# Shared lib

These items make up a set of components (functions, classes, data) which are intended to be shared/reused across all services pertaining to the provider-services.

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