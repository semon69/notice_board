# Notice Board - HR Management System

A full-stack employee notice management application built with modern web technologies. Manage, publish, and track notices for your organization with an intuitive dashboard.

## Project Overview

Notice Board is an enterprise HR management system that enables organizations to:

- Create, publish, and manage employee notices
- Filter and search notices by department, status
- Track notice status (Published/Unpublished/Draft)
- View detailed notice information with attachments
- Generate notice statistics and reports
- Manage employee database

The application features a responsive frontend dashboard and a robust backend API with MongoDB integration for data persistence.

## Tech Stack

### Frontend

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Form Handling**: React Hook Form
- **State Management**: React Hooks with custom hooks
- **Icons**: Lucide React
- **API Client**: Fetch API with custom hooks

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **CORS**: Enabled for frontend integration
- **Body Parser**: For JSON/Form data handling

### Deployment

- **Frontend**: Vercel
- **Backend**: Vercel
- **Database**: MongoDB

## Installation Steps

### Prerequisites

- Node.js 18+ and npm installed
- MongoDB Atlas account (free tier available at mongodb.com)
- Git installed
- Vercel account (for deployment)

### Frontend Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd notice-board
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment variables**

   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

### Backend Installation

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment variables**

   ```bash
   # Create .env file in backend directory
   cp .env.example .env
   ```

4. **Update .env file with your MongoDB URI and settings** (see ENV Variables section)

5. **Run development server**

   ```bash
   npm run dev
   ```

   Backend will be available at `http://localhost:5000/api`

6. **Build TypeScript**

   ```bash
   npm run build
   ```

7. **Start production server**
   ```bash
   npm start
   ```

## Environment Variables

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Description**: URL of your backend API server. Change this to your production backend URL when deploying.

### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notice-board?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Variable Explanations**:

1. **MONGODB_URI** (Required)

   - MongoDB connection string from MongoDB Atlas
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database-name`
   - Get this from MongoDB Atlas > Connect > Drivers

2. **PORT** (Optional, default: 5000)

   - Port number for backend server
   - Change if 5000 is already in use

3. **NODE_ENV** (Optional, default: development)

   - Set to `production` for production deployment
   - Affects logging and error handling

4. **FRONTEND_URL** (Optional, default: http://localhost:3000)
   - URL of your frontend application
   - Used for CORS configuration
   - Update this to your production frontend URL

### Setting Up MongoDB URI

1. **Create MongoDB Atlas Account**

   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a new project

2. **Create a Cluster**

   - Click "Create a Deployment"
   - Choose "Free" tier
   - Select desired region
   - Click "Create"

3. **Get Connection String**

   - Click "Connect" on your cluster
   - Choose "Drivers"
   - Copy the connection string
   - Add username and password in the string

4. **Add to .env**
   ```env
   MONGODB_URI=mongodb+srv://yourUsername:yourPassword@yourcluster.mongodb.net/notice-board
   ```

## API Endpoints

### Notice Endpoints

- `POST /api/notices/create` - Create new notice
- `GET /api/notices/list` - Get all notices with filters
- `GET /api/notices/:id` - Get single notice
- `PATCH /api/notices/:id/status` - Update notice status
- `PUT /api/notices/:id` - Update notice details
- `DELETE /api/notices/:id` - Delete notice

## Running Locally

### Terminal 1 - Backend

```bash
cd backend
npm run dev
# Server runs on http://localhost:3001/api
```

### Terminal 2 - Frontend

```bash
npm run dev
# App runs on http://localhost:3000
```

Visit `http://localhost:3000` to access the application.

## Features

- **Create Notices**: Form with validation for all required fields
- **Notice Types**: General/Company-wide, Holiday & Events, HR & Policy Update, etc.
- **Target Audience**: Department-based or individual targeting
- **Publishing**: Scheduled or immediate publishing
- **Status Toggle**: Publish/Unpublish notices with a single click
- **Filtering**: Filter by department, employee, status, and date
- **Pagination**: Efficient data loading with page navigation
- **Notice Details**: View complete notice information in detail modal
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Draft Management**: Save notices as draft before publishing
