[![Coverage Status](https://coveralls.io/repos/github/bookit-app/provider-services/badge.svg?branch=master)](https://coveralls.io/github/bookit-app/provider-services?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7c29b8b5b8b74764935483aab91973d0)](https://www.codacy.com/gh/bookit-app/provider-services?utm_source=github.com&utm_medium=referral&utm_content=bookit-app/provider-services&utm_campaign=Badge_Grade)

# provider-services

# Navigation

- [Design](#Design)
- [Data Model](#Data-Model)
- [REST APIs](#REST-APIs)
- [Component Descriptions](#Component-Descriptions)
  - [Shared lib](#Shared-Lib)
  - [Configuration Service](#Configuration-Service)
  - [Create Service Offering](#Create-Service-Offering)

## Design

This repo contains a set of deployable services to handle BookIt Service Provider Operations. This includes creating and managing service providers, staff members, services, and staff member requests. The repo is designed as a mono-repo to house all services necessary to support a provider services as it has been defined for the BookIt app. Each service is intended to be individually deployed as a standalone microservice to the cloud to be consumed by the client applications.

[![design](./docs/images/design.png)](./docs/images/design.png)

The design is based around how [expressjs](https://expressjs.com) works and hence everything is essentially decomposed down into a setup of middleware. The following describes each component of the diagram in more detail.

## Data Model

## REST APIs

Each service depicted in the design diagram exposes HTTP(s) REST APIs to be consumed by either the client application, other internal Google Cloud Services, or for service to service internal API communication. The requests that are exposes are mentioned below Refer to the [API Gateway Repo](https://github.com/bookit-app/api-gateway) OpenAPI specification for the APIs which are exposes and consumed from the client application.

## Dependencies

As these services are all implemented in nodejs npm is used to manage the dependencies. However, as this is a mono-repo and contains several microservice applications that will be deployed as docker containers it has been designed in a away to allow each service to be built into a container containing only the necessary dependencies that it specifically requires. This is done to try and keep the image size to a minimum. Dependencies are managed as follows:

- **Global Dependencies**: There are dependencies that every service leverages. These have been defined in the `package.json` at the root of the project and each service leverages them as this ensures consistency across the deployments as well as ensures that shared libraries leverage the same versions across all.
- **Local Dependencies**: These are dependencies specific to an individual service and would only be contained within the deployment. These are managed within the `package.json` file within the services directory under src/service/<service-name>.

## Component Descriptions

### Shared lib

The items within this section make up a set of components (functions, classes, data) which are intended to be shared/reused across all services pertaining to the provider-services.

- **express mw**: Common re-usable middleware used across various services

  - **convert-pubsub-message-mw**: This is a general MW which handles the conversion of the message body provided from pubsub. The MW will base64 decode the body and overwrite the payload body to the JSON result for the following MW's to process.
  - **error-handling-mw**: This is the mw which is hooked into express to take of errors when they are raised. The MW takes the error generated and populates a default JSON object to be returned to the call and also sets the HTTP status code appropriately
  - **user-mw**: This is a mw which is hooked into express and handles processing the HTTP header injected by Google Cloud Endpoints which contains the Base64 encoded user metadata. The MW will take the Base64 data, decode it and place it into a req object attribute to allow the information to be passed along to other MW steps which required it. This ensures that we only need to decode the data one time. If the MW doesn't find this header it raises a ServiceError to ensure that the processing of teh request is stopped
  - **payload-validation-mw**: This middleware is a re-usable MW which can allow the services to hook in JSON payload validations. The MW makes use of a library called [ajv](https://ajv.js.org) and will automatically validation the body of the HTTP request based on the provided schema.
  - **trace-id-mw**: This middleware is responsible to make the Trace ID information which is injected by Google Cloud automatically into the HTTP headers and make it available for use in other locations of the express chain when logs are being generated.

- **repository**: Contains components acting as the data access layer for the services

  - **firestore**: Provides access to the `@google-cloud/firestore` module within the node js applications
  - **service-provider-repository**: Provides functions to interact with the ServiceProvider firestore collection and documents.
  - **config-repository**: Provides functions to interact with the config firestore collection and documents.
  - **service-offering-repository**: Provides functions to interact with the ServiceProvider offerings sub-collection firestore collection and documents.
  - **staff-member-repository**: Provides functions to interact with the ServiceProvider staff member sub-collection firestore collection and documents.
  - **staff-membership-request-repository**: Provides functions to interact with the StaffMembershipRequests firestore collection and documents.

- **util**: Provides a setup of utility type components for the services to rely on

  - **service-error**: This is an extension to the default JS Error object to allow specific information like errorCodes and http status codes to be propagated to the error-handling-mw when an error occurs.
  - **validator**: Provides the AJV object reference to the node application and is primarily used by the payload-validation-mw
  - **logger**: Sets up a default winston logger to allow the services to log necessary messages in a consistent manner
  - **provider-search-util**: Provides a set of functions to encapsulate logic used for several locations related to the provider search handling

- **constants**: Exposes a set of attributes as constants for use across the services.
  - **errors**: Constants represented general error situations and are intended to be used as the basis for errors created into the ServiceError reference
  - **statusCodes**: This is a reference to an npm modules calls `http-status-codes` which provides constants for the HTTP Status Codes like 200, 201, 500, etc

### Configuration Service

The configuration service provides a means to expose configuration options as they pertain to the Service Provider. The supported configurations built for the Book-App relate to:

- **staffClassification**: This indicates the role that a staff member has at a service provider and would be used to direct appointments to the appropriate members based on the users selection
- **styles**: Represents the set of services which are globally defined and supported by the book-it app. This is used to enable searching functionalities and to classify non-Custom services provided by the service providers.

The configuration service exposes a route to **GET** a the set of configuration properties as specified above. When a request is received it will trigger a set of express MW and determine what to do. The service exposes the route at `/configuration/:config` where the `:config` is the name specified above and enables the application to support any additional configuration that might need to be added in future iterations. This route is configured with the middleware as described within the [configuration-service index.js](./src/services/configuration-service/src/index.js) file.

- **service specific express MW**: Contains express MW which is dedicated to the configuration service
    - **[param-options-mw.js](./src/services/configuration-service/src/param-options-mw.js)**: Converts the `:config` path parameter to camel case and stores it into the configQueryOptions req object if it is a supported option for the application.
    - **[query-provider-config-mw.js](./src/services/configuration-service/src/query-provider-config-mw.js)**: Triggers the request to the repository and processes/prepares the result for the consumer of the REST API

### Create Service Offering