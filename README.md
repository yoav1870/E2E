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

## Getting Started

To begin, follow these steps:




## Server-Side Testing

Testing is a critical part of the development process. Our server-side code includes a comprehensive test suite that covers a range of endpoints for both user and report functionalities.

### Test Suite Features

- **Automated Testing**: We utilize the Jest framework to run automated tests on our endpoints.
- **Mocking**: To isolate the testing environment from the production server, we use Jest mocks for external dependencies such as databases and middleware.
- **Test Coverage**: Our tests cover successful operations and various error scenarios to ensure robust error handling.

### Key Endpoint Tests

- **User Authentication**: Tests for sign-in include checking for successful token generation with valid credentials, and handling of missing fields or incorrect password.
- **User Registration**: Tests validate that only users with unique emails can register, required fields are checked, and the correct role and profession are stored.
- **Report Management**: We verify that reports can be created, updated, and deleted correctly, ensuring that users can only manipulate reports they have submitted or been assigned to.

### How to Run Tests

To execute the test suite, navigate to the server directory in your terminal and run the following commands:

```bash
npm test -- tests/report.test.js
```

```bash
npm test -- tests/user.test.js
```


## Feedback

If you have any feedback, please reach out to us at https://github.com/yoav1870/E2E

