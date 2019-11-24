# Configuration Service

The configuration service provides a means to expose configuration options as they pertain to the Service Provider. The supported configurations built for the Book-App relate to:

- **staffClassification**: This indicates the role that a staff member has at a service provider and would be used to direct appointments to the appropriate members based on the users selection
- **styles**: Represents the set of services which are globally defined and supported by the book-it app. This is used to enable searching functionalities and to classify non-Custom services provided by the service providers.

The configuration service exposes a route to **GET** the set of configuration properties as specified above. When a request is received it will trigger a set of express MW and determine what to do. The service exposes the route at `/configuration/:config` where the `:config` is the name specified above and enables the application to support any additional configuration that might need to be added in future iterations. This route is configured with the middleware as described within the [configuration-service index.js](./src/index.js) file.

- **service specific express MW**: Contains express MW which is dedicated to the configuration service
  - **[param-options-mw.js](./src/param-options-mw.js)**: Converts the `:config` path parameter to camel case and stores it into the configQueryOptions req object if it is a supported option for the application.
  - **[query-provider-config-mw.js](./src/query-provider-config-mw.js)**: Triggers the request to the repository and processes/prepares the result for the consumer of the REST API
