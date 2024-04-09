# Damages Assessment and Resolution Platform

## Overview

This platform is designed to bridge the gap between individuals facing infrastructure issues and professionals who are equipped to resolve these issues. It acts as an intermediary, efficiently connecting those in need of repair services with skilled professionals. Through our application, damage assessments are not just recorded but are actively addressed by connecting users with suitable professionals based on profession specificity, geographical proximity, and professional ratings.

## Features

- **User Authentication**: Secure sign-in and sign-up processes with JSON Web Tokens.
- **File Upload**: Users can upload photos via AWS S3 storage for damage reporting.
- **Professional Search**: Find professionals based on location and profession.
- **Damage Reporting**: Users can create, read, update, and delete damage reports.
- **Email Notifications**: Automated notifications for user actions like report creation and deletion.
- **User Profiles**: Users can view and edit their profiles and view their report history.
- **Search and Filter**: Reports can be searched and filtered on the homepage.
- **YouTube Integration**: Service providers receive recommended videos based on their profession.

## Technologies

### Client-side technologies
- **React**: For building the client-side user interface.
- **Material-UI**: For styling the React components.
- **Formik & Yup**: For forms management and validation.
- **Axios**: For making HTTP requests to the server-side API.
- **React Router**: For navigation between client-side pages.
### Server-side technologies
- **Node.js and Express.js** for server-side logic.
- **Mongoose** for object data modeling and MongoDB interactions.
- **JSON Web Token** for authentication.
- **AWS SDK** for file uploads to AWS S3.
- **Nodemailer** for sending emails.
- **Bcrypt** for password hashing.
- **Multer** for handling multipart/form-data, primarily used for file uploads.

## Setup and Installation

### Prerequisites

- Node.js
- npm or Yarn
- MongoDB
- AWS Account (for S3)
- Google Account (for Gmail SMTP service)

### Environment Setup

1. Set up MongoDB and create a database for the application.
2. Set up AWS S3 bucket for file uploads.
3. Set up Gmail for nodemailer configuration.
4. Obtain a YouTube API key for fetching recommended videos.

### Configuring Environment Variables

Create a `.env` file in the root directory and set the following variables:

- `JWT_SECRET`: a secret key for JWT.
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`: AWS S3 credentials.
- `GMAIL_USER`, `GMAIL_APP_PASSWORD`: Gmail credentials for nodemailer.
- `DB_USER`, `DB_PASS`, `DB_HOST`: MongoDB credentials.
- `YOUTUBE_API_KEY`: API key for YouTube integration.
- `GOOGLE_MAPS_API_KEY` : API key for google maps city

## Getting Started

To begin setting up the Damages Assessment and Resolution Platform on your local environment, follow these steps to get both the client and server sides up and running.

### 1. Clone the Repository
Start by cloning the project repository to your local machine. Open your terminal and execute:
 `https://github.com/yoav1870/E2E` 

### 2. Set Up the Server
**Navigate to the Server Directory**
```bash
cd server
```

**Install Dependencies**

Install the necessary dependencies for the server side by running:

```bash
npm install
```

**Configure Environment Variables**

Create a `.env` file in the root of your server directory. Add the necessary environment variables as outlined in the project's documentation.

Example:

```bash
JWT_SECRET=your_jwt_secret_here
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_access_key
DB_HOST=your_database_host
DB_USER=your_database_username
DB_PASS=your_database_password
GMAIL_USER=your_gmail_username
GMAIL_APP_PASSWORD=your_gmail_app_password
```
**Start the Server**

With the environment configured and dependencies installed, start the server:
```bash
npm start
```



### 3. Set Up the Client
**Navigate to the Client Directory**

Open a new terminal window and navigate to the client directory within your cloned repository:
```bash
cd client
```

**Install Dependencies**

Install the necessary dependencies for the client side:

```bash
npm install
```

**Configure Environment Variables**

Create a `.env` file in the root of your client directory. Include any required environment variables specific to the client side.

Example:
```bash
VITE_YOUTUBE_API_KEY=""
VITE_GOOGLE_MAPS_API_KEY=""
```

**Start the Client Development Server**

Finally, start the client development server:

```bash
npm start
```

The client application should now be accessible in your browser, typically at `http://localhost:3000`.

### 4. Explore the Application
With both the server and client running, you're now ready to explore the functionalities of the Damages Assessment and Resolution Platform. Begin by registering as a new user, browsing through the service offerings, or reporting a new issue.


## Server-Side Testing

Testing is a critical part of the development process. Our server-side code includes a comprehensive test suite that covers a range of endpoints for both user and report functionalities.

### Test Suite Features

- **Automated Testing**: We utilize the Jest framework to run automated tests on our endpoints.
- **Mocking**: To isolate the testing environment from the production server, we use Jest mocks for external dependencies such as databases and middleware.
- **Test Coverage**: Our tests cover successful operations and various error scenarios to ensure robust error handling.


### How to Run Tests

To execute the test suite, navigate to the server directory in your terminal and run the following commands:

```bash
npm test -- tests/report.test.js
```

```bash
npm test -- tests/user.test.js
```

## Client-Side Testing
Testing is equally important on the client side to ensure our user interface works as expected. We have implemented tests for our React components to verify both their functionality and their interaction with external services and APIs.
### Test Suite Features
- **Automated Testing** with React Testing Library: Utilizes React Testing Library and Jest to simulate user interactions and test component state.
- **Mocking API Calls** Uses Jest to mock axios calls, allowing us to test the behavior of our components in response to successful and failed API requests.
- **Route Testing** Incorporates testing for React Router to ensure navigation occurs correctly when users interact with the application.
- **Mocking Modules** Implements module mocks for files and styles (e.g., images, CSS modules), which are not directly testable or relevant to the logic being tested.

### How to Run Tests
To run the client-side tests, navigate to the client directory in your terminal. Then, execute the following command to run all tests:
```bash
npm test -- tests/SignIn.test.jsx
```

```bash
npm test -- tests/EditProfile.test.jsx
```
## API Reference

POSTMAN = https://documenter.getpostman.com/view/32136851/2sA35G21W9
## Feedback

If you have any feedback, please reach out to us at https://github.com/yoav1870/E2E

