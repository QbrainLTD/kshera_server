Writer: idan Arbeli | 0504050514
---

# Business restaurant Backend API

This repository contains the backend server for the Business restaurant site, developed to provide the necessary API endpoints for user management and business restaurant creation. It’s built using Node.js and Express, with various middleware and libraries to ensure security, validation, and performance.

### Writer: Idan Arbeli

---

## Project Overview

The Business restaurant Backend API serves as the backend of a business restaurant management web application. This API allows users to create accounts, manage their profiles, and add business restaurants. It interacts with a MongoDB database and is built with robust security and validation mechanisms.

## Features and Technologies Used

This project leverages several Node.js packages and middleware to provide a complete backend solution:

### 1. **Express**
   - The server is built on Express, providing a flexible structure for defining endpoints and managing requests.
   - **express.Router()** is used to separate routes within the `router` folder, making the application modular and easy to maintain.

### 2. **CORS**
   - Cross-Origin Resource Sharing (CORS) is enabled to allow requests from different domains, such as from the frontend of the business restaurant site.

### 3. **Environment Variables (.env)**
   - Sensitive information, like database URIs and JWT secret keys, is stored in environment variables using the `.env` file for secure and configurable management of these values.

### 4. **bcrypt**
   - **bcrypt** is used for hashing user passwords before storing them in the database, providing security for user credentials.

### 5. **Joi**
   - **Joi** is used for validating incoming data to ensure that all required fields are correctly formatted and present, reducing the risk of invalid data in the database.

### 6. **JWT (JSON Web Token)**
   - JWT is implemented to authenticate users. A token is generated and sent to the client upon login, which is then used to authorize requests to protected endpoints.

### 7. **Morgan Logger**
   - **Morgan** is used to log HTTP requests, providing insight into server activity and assisting with debugging. Logging functions are organized in the `logger` folder.

### 8. **MongoDB**
   - MongoDB serves as the database for storing user profiles and business restaurant information.
   - Mongoose is used for object modeling, making it easy to interact with MongoDB collections and documents. Database configurations are located in the `DB` and `config` folders.

### 9. **Custom Middlewares**
   - Various middlewares are implemented to handle request validation, error handling, and authentication. These are organized within the `middlewares` folder to maintain code organization and improve readability.

### 10. **Helper and Utility Functions**
   - Helper functions and utility scripts are organized in the `helpers` and `utils` folders to support modular code and improve reusability.

---

## Project Structure

```
├── DB
├── auth
├── restaurants
├── config
├── helpers
├── logger
├── middlewares
├── public
├── router
├── users
├── utils
├── .env
├── .gitignore
├── app.js
├── package-lock.json
└── package.json
```

### Folder Explanations:
- **DB**: Contains database connection and configurations.
- **auth**: Manages user authentication and JWT token handling.
- **restaurants**: Handles business restaurant-related operations.
- **config**: Stores environment configurations and settings.
- **helpers**: Contains helper functions for various utilities.
- **logger**: Configures and manages request logging.
- **middlewares**: Holds middleware functions for authentication, validation, etc.
- **public**: Static files served by the backend.
- **router**: Defines routes for user and business restaurant actions.
- **users**: Manages user-related functionality.
- **utils**: Utility scripts for common functionalities across the project.

---

## API Endpoints

### User Management
- **POST /register**: Register a new user.
- **POST /login**: Authenticate user and return a JWT token.

### Business restaurant Management
- **POST /restaurants**: Create a new business restaurant.
- **GET /restaurants**: Retrieve all business restaurants for the authenticated user.
- **PUT /restaurants/:id**: Update an existing business restaurant.
- **DELETE /restaurants/:id**: Delete a business restaurant.

---

-
