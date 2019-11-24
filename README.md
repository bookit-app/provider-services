[![Coverage Status](https://coveralls.io/repos/github/bookit-app/provider-services/badge.svg?branch=master)](https://coveralls.io/github/bookit-app/provider-services?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7c29b8b5b8b74764935483aab91973d0)](https://www.codacy.com/gh/bookit-app/provider-services?utm_source=github.com&utm_medium=referral&utm_content=bookit-app/provider-services&utm_campaign=Badge_Grade)

# provider-services

# Navigation

- [Design](#Design)
- [Data Model](#Data-Model)
- [REST APIs](#REST-APIs)
- [Repo Organization](#Repo-Organization)
- [Deployment](#Deployment)
- [Code Quality](#Code-Quality)
- [Security](#Security)
- Component Descriptions
  - [Shared lib](./src/lib/README.md)
  - [Configuration Service](./src/services/configuration-service/README.md)
  - [Create Service Offering](#Create-Service-Offering)

## Design

This repo contains a set of deployable services to handle BookIt Service Provider Operations. This includes creating and managing service providers, staff members, services, and staff member requests. The repo is designed as a mono-repo to house all services necessary to support a provider services as it has been defined for the BookIt app. Each service is intended to be individually deployed as a standalone microservice to the cloud to be consumed by the client applications.

[![design](./docs/images/design.png)](./docs/images/design.png)

The design is based around how [expressjs](https://expressjs.com) works and hence everything is essentially decomposed down into a setup of middleware. The following describes each component of the diagram in more detail.

## TODO: Data Model

- Service Provider Collection
    - Staff sub-collection - relationship to profile
    - offering sub-collection

- StaffMembershipRequests Collection

- config collection

## REST APIs

Each service depicted in the design diagram exposes HTTP(s) REST APIs to be consumed by either the client application, other internal Google Cloud Services, or for service to service internal API communication. The requests that are exposes are mentioned below Refer to the [API Gateway Repo](https://github.com/bookit-app/api-gateway) OpenAPI specification for the APIs which are exposes and consumed from the client application.

## Repo Organization

As these services are all implemented in nodejs npm is used to manage the dependencies. However, as this is a mono-repo and contains several microservice applications that will be deployed as docker containers it has been designed in a away to allow each service to be built into a container containing only the necessary dependencies that it specifically requires. This is done to try and keep the image size to a minimum. Dependencies are managed as follows:

- **Global Dependencies**: There are dependencies that every service leverages. These have been defined in the `package.json` at the root of the project and each service leverages them as this ensures consistency across the deployments as well as ensures that shared libraries leverage the same versions across all.
- **Local Dependencies**: These are dependencies specific to an individual service and would only be contained within the deployment. These are managed within the `package.json` file within the services directory under src/service/<service-name>.

## TODO: Deployment

- Cloud Build used for build and deployment
- Each service it warped into a docker image and pushed to gcr.io
- Each service contains its own build setup which is triggered in a dedicated build run via the repos parent build
- The build is broken down into 2 phases
    - On the opening of a pull request a build is triggered which runs the linting and automated unit tests to ensure the code changes within the PR are quality changes
    - On merge to the master branch the build/push of the docker images are processed and a new revision is created in Cloud Run to finalize the deployment

## TODO: Security

- No external access without proper IAM roles
- Access granted via ESP which is enforcing user based authentication
- Access granted to Specific GCP IAM users as needed like o the account level pubsub user to enable push notifications for messages arriving on topics with subscriptions.

## TODO: Code Quality

- Integration with husky for unit-tests, linting on commit
- Integration of tests and lint within the build process to ensure everything is working as expected before build/deployment/merge into master branch
- Integration with [Coveralls](https://coveralls.io/github/bookit-app/provider-services?branch=master) to track unit test code coverage over time to ensure we can tracking well with our implemented unit tests - Also see badge linked at the top of the repo
- Integration with [Codacy](https://www.codacy.com/gh/bookit-app/provider-services?utm_source=github.com&utm_medium=referral&utm_content=bookit-app/provider-services&utm_campaign=Badge_Grade) which is a code quality tool and provides insights in to overall code quality based on a scoring metric, anaylizes complexity, technical debt, formatting issues and so one. - Also see badge linked at the top of the repo


