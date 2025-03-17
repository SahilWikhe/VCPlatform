# VC Platform

A web application connecting startups with investors for funding and partnership opportunities.

## Overview

VC Platform is a full-stack web application built with React, TypeScript, Node.js, Express, and MongoDB. It provides a platform for startups to showcase their ventures and for investors to discover promising opportunities.

## Features

- **User Authentication**: Secure registration and login for startups and investors
- **Profile Management**: Create and manage detailed profiles
- **Discovery**: Browse and search for startups or investors based on various criteria
- **Connections**: Initiate and manage connections between startups and investors
- **Responsive Design**: Fully responsive UI that works on all devices

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Material UI for component library
- Emotion for styling
- Axios for API requests

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Project Structure

```
/
├── client/               # React frontend
│   ├── public/           # Static files
│   └── src/              # Source files
│       ├── components/   # Reusable components
│       ├── context/      # Context providers
│       ├── pages/        # Page components
│       ├── services/     # API services
│       ├── styles/       # Global styles and theme
│       └── utils/        # Utility functions
│
└── server/               # Express backend
    ├── src/              # Source files
    │   ├── controllers/  # Route controllers
    │   ├── middleware/   # Custom middleware
    │   ├── models/       # Mongoose models
    │   └── routes/       # API routes
    └── dist/             # Compiled JavaScript
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/vcplatform.git
   cd vcplatform
   ```

2. Install server dependencies
   ```
   cd server
   npm install
   ```

3. Install client dependencies
   ```
   cd ../client
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vcplatform
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

### Running the Application

1. Start the server (development mode)
   ```
   cd server
   npm run dev
   ```

2. Start the client (in a new terminal)
   ```
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## License

This project is licensed under the MIT License - see the LICENSE file for details. 