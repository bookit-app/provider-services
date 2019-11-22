[![Coverage Status](https://coveralls.io/repos/github/bookit-app/provider-services/badge.svg?branch=master)](https://coveralls.io/github/bookit-app/provider-services?branch=master)

# provider-services

## Design

This repo contains a set of deployable services to handle BookIt Service Provider Operations. This includes creating and managing service providers, staff members, services, and staff member requests. The repo is designed as a mono-repo to house all services necessary to support a provider services as it has been defined for the BookIt app. Each service is intended to be individually deployed as a standalone microservice to the cloud to be consumed by the client applications.

[![design](./docs/images/design.png)](./docs/images/design.png)

The design is based around how [expressjs](https://expressjs.com) works and hence everything is essentially decomposed down into a setup of middleware. The following describes each component of the diagram in more detail.

## API Descriptions

