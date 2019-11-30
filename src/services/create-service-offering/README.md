# create-service-offering

The create service offering service provides the capabilities to publish service offerings against a service provider. When a service offering is published the data is validated against the defined schema and if acceptable the information is created within the offerings sub-collection associated with the service provider.

## Component Descriptions

- **create-service-offering-mw**: This is the main MW step configured for this service within the chain and it is responsible to taking the payload provided by the user and mapping it to an object which is acceptable for the service offering repository to commit to the database.

- **payload-validations**: This defines the schema which is expected for the body of the payload and some check functions to ensure the provided data is appropriate.

- **success-mw**: If all goes well within the process and this MW step is reached it is just populating a proper HTTP response code to the caller.

## Special Processing

Creation of service offerings has some special async processing which occurs after the information is created within the offerings sub-collection. As the information related to service offerings is necessary to enabling the defined search capabilities for service providers there is a need to enhance the main service offering document with information in order to enable easier and more efficient queries. The process for this async processing is depicted within the diagram below along with the additional components of the solution which are enabling this. As the ability to search for the data is not a critical component of creating service offerings the handling and sync of the related information is pushed to tbe background. This enables the user to receive quicker response time with respect to creating offerings, and it is also keeps the logic and the architecture clean as we have a clear separation of concerns between creating service offerings and enabling them to be searchable within our basic approach. This decoupled also enables us to enhance/modify the search capabilities and how we handle this at anytime with no impact to the services responsible for creating offerings.

<<CREATE DATAFLOW DIAGRM>>

To enable the above we make use of Cloud Firestore triggers which are hooked into Cloud Functions. The cloud function receives the create and update events for service provider offerings and when received it generates a notification onto a topic in Cloud PubSub. PubSub is used as the mechanism to broadcast the changes to those interested in the event rather than having many functions hook directly into this trigger from firestore. This increases the complexity slightly but also enables a more flexible design as we do not have a tight coupling to the data model and the technology leveraged. Once the messages are published to pubsub those which have subscribed to the event will receive the notifications and can process the event accordingly.

### Additional Github Repositories

The below repositories contain the code base and documentation for those additional components mentioned within the data flow diagram above.

- [Offering Notification Processor](https://github.com/bookit-app/provider-services/tree/master/src/services/offering-notification-processor)
- [Service Offering Notification Publisher](https://github.com/bookit-app/service-offering-notification-publisher)
- [Service Provider Search](https://github.com/bookit-app/provider-services/tree/master/src/services/provider-search)