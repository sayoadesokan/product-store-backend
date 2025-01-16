# Product Store API

This is a backend API for managing a product store. It supports user registration and login flows, product CRUD functionality, and validation using class-validator middleware.

## Getting Started

Follow these steps to get the project up and running:

## 1. Clone the Repository

```bash
git clone https://github.com/sayoadesokan/product-store-backend
cd product-store-backend
```

## 2. Install Dependencies

Make sure you have npm installed, then run:

```bash
npm install
```

## 3. Run API

To run API:

```bash
npm run start
```

## 4. Containerize the Application

If you want to containerize the application using Docker, follow the steps below:

### 4.1. Install Docker

Make sure Docker is installed on your machine. If not, you can follow the installation guide on [Docker Website](https://www.docker.com/products/docker-desktop/)

### 4.2. Build the Docker Image

Run the following command to build the Docker image:

```bash
docker build -t product-store-api .
```

### 4.3. Check Docker Containers

To see if the Docker container was successfully built, run:

```bash
docker ps -a
```

### 4.4. Start the Docker Container

To run the Docker container:

```bash
docker-compose up
```

The API should now be running within the Docker container.

## 5. Running Tests

To run the test cases for the API, use the following command:

```bash
npm run test
```

You can view the test cases and the results in the terminal.

## Database Diagram

![Product Image](/db-diagram.png)

## Features

- User Registration: Create a new user.
- User Login: Authenticate a user and obtain a JWT token.
- Product CRUD: Create, Read, Update, and Delete products.
- Input Validation: Ensures all inputs follow the required formats using class-validator.

## Design and Architecture of API

The Product Store API is built using a modular approach, focusing on scalability and maintainability. The architecture is based on a clean separation of concerns, with individual modules handling specific functionality.

### Key Features

1. User Registration:

- A new user can be created by providing necessary information such as email, password, and other user details. The password is hashed using bcrypt for security. After registration, the user can be authenticated via the login flow.

- Bcrypt is used to hash passwords for secure storage and comparison.

2. User Login:

Users authenticate using their email and password. Upon successful authentication, a JWT token is issued. This token is used for session management and for authenticating subsequent requests.

JWT (JSON Web Token) is used to issue a token that the user can include in their request headers to authenticate API calls.

3.  Product CRUD:

- Create: Adds a new product to the store.
- Read: Fetches details of a product or a list of products.
- Update: Modifies an existing product.
- Delete: Removes a product from the store.

Each operation is encapsulated within a service, which interacts with the database to perform CRUD actions.

4. Input Validation:

Input validation is crucial for ensuring that the data coming into the API is valid and follows the expected formats. class-validator is used to enforce validation rules on incoming requests.

## Middleware

Authentication Middleware: A middleware is used to check if the user is authenticated by verifying the JWT token included in the request headers.

## Documentation

You can find the API documentation on Postman:

[Postman Documentation](https://documenter.getpostman.com/view/22494723/2sAYQXosVe)

This documentation provides detailed information about the available API endpoints, request/response formats, and examples.

## Conclusion

This API provides a robust backend for managing a product store, with functionality for user authentication, product management, and validation using middleware. For further assistance, refer to the Postman documentation link above.
