# login-rest-api

Rest API to be used as an authentication service. 
It uses JWT (JSON Web Tokens) to provide access tokens and bcrypt for password encryption.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

These are the node modules used:

```
npm install express body-parser morgan mongoose jsonwebtoken bcrypt
```

You can define on which port you want this API running at (default if not set: 8080):

```
export NODE_PORT=80 # Port 80 is recommended to avoid network restrictions from consumers
```
### Production Deployment

When deploying on a production environment, don't forget to set the NODE_ENV environment variable:

```
export NODE_ENV=production # Default if not set 'development'
```

### Endpoints

* /signup
* /api/authenticate
* /api/users
* /api/token

## Author

* **Vinnie Abdala** - [GitHub account](https://github.com/vgabdala)
