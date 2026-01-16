# YumRush 🍔

A modern food delivery and restaurant ordering platform built with React and Node.js. Browse restaurants, view menus, add items to cart, and place orders seamlessly.

## Features

- 🏪 **Restaurant Browsing** - Explore a variety of restaurants with detailed information
- 📋 **Menu Viewing** - Browse complete menus with prices and descriptions
- 🛒 **Shopping Cart** - Add items to cart and manage your order
- 🔐 **User Authentication** - Secure signup and login with JWT tokens
- 📦 **Order Management** - Place orders and view order history
- 🔍 **Search Functionality** - Search for restaurants and menu items
- 👤 **Account Management** - Update profile information and change password
- 📱 **Responsive Design** - Modern UI built with Tailwind CSS

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Deployment
- **Vercel** - Frontend and serverless API deployment
- **Railway** - Alternative backend hosting option

## Project Structure

```
YumRush/
├── api/                    # Vercel serverless entrypoint
│   └── server.js
├── Client/                 # React frontend application
│   ├── src/
│   │   ├── Components/    # React components
│   │   │   ├── Footer/
│   │   │   ├── Header/
│   │   │   ├── Layout/
│   │   │   ├── Pages/     # Page components
│   │   │   └── restaurants/
│   │   ├── lib/           # Utilities (API, cache)
│   │   ├── main.jsx       # App entry point
│   │   └── index.css
│   ├── index.html
│   └── package.json
├── Server/                 # Express backend
│   ├── auth/              # Authentication routes and models
│   ├── db/                # Database connection
│   ├── Views/Data/        # Static data (menus, restaurants)
│   ├── public/images/     # Restaurant images
│   ├── server.js          # Express server
│   └── package.json
└── vercel.json            # Vercel configuration
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** database (local or cloud instance like MongoDB Atlas)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd YumRush
   ```

2. **Install server dependencies**
   ```bash
   cd Server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../Client
   npm install
   ```

## Environment Variables

### Server Environment Variables

Create a `.env` file in the `Server/` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/yumrush
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yumrush

# Optional: Database name (if not in URI)
DB=yumrush

# JWT Secret (use a strong random string in production)
JWT_SECRET=your-secret-key-here

# Server Port (for Railway/local development)
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend.vercel.app

# Preview URL (for preview deployments)
PREVIEW_URL=https://your-preview.vercel.app

# Node Environment
NODE_ENV=production
```

### Client Environment Variables

Create a `.env` file in the `Client/` directory (optional, for local development):

```env
# Backend API URL (only needed if frontend and backend are on different domains)
VITE_API_URL=http://localhost:3000
```

## Running the Project

### Development Mode

1. **Start the backend server**
   ```bash
   cd Server
   npm start
   ```
   The server will run on `http://localhost:3000` (or the port specified in your `.env`)

2. **Start the frontend development server**
   ```bash
   cd Client
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Production Build

1. **Build the frontend**
   ```bash
   cd Client
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd Server
   npm start
   ```

## API Endpoints

### Public Endpoints

- `GET /api/restaurants` - Get all restaurants
- `GET /api/menus` - Get all menus
- `GET /images/:filename` - Serve restaurant images

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Protected Endpoints (Require JWT Token)

- `POST /api/auth/orders` - Place a new order
  - Headers: `Authorization: Bearer <token>`
  - Body:
    ```json
    {
      "items": [...],
      "total": 25.99
    }
    ```

- `GET /api/auth/orders` - Get user's order history
  - Headers: `Authorization: Bearer <token>`

- `PATCH /api/auth/me` - Update user profile
  - Headers: `Authorization: Bearer <token>`
  - Body:
    ```json
    {
      "name": "New Name",
      "currentPassword": "oldpass",
      "newPassword": "newpass"
    }
    ```

## Deployment

### Vercel Deployment

The project is configured for Vercel deployment:

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `PREVIEW_URL` (optional)
   - `NODE_ENV=production`

3. **Deploy** - Vercel will automatically:
   - Build the React frontend
   - Deploy the serverless API functions
   - Serve static images

The `vercel.json` configuration handles routing:
- `/api/*` routes to serverless functions
- `/images/*` serves static images
- All other routes serve the React app

### Railway Deployment (Alternative)

For Railway deployment:

1. **Set up Railway project** and connect your repository
2. **Configure environment variables** in Railway dashboard
3. **Set the root directory** to `Server/`
4. **Deploy** - Railway will run the Express server

## Development Notes

- The frontend uses client-side caching for API responses to improve performance
- Images are served with aggressive caching headers (1 year)
- API responses are cached for 5 minutes
- MongoDB connection is optimized for serverless environments with connection pooling
- CORS is configured to allow requests from localhost and Vercel deployments

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
