# Quick Delivery

Quick Delivery is a comprehensive web application for managing deliveries, consisting of a robust Laravel backend API and a modern React Vite frontend. 

## Project Structure

The project is divided into two main repositories/directories located within the `QuickDelivery` folder:

- `backend/`: The Laravel backend API.
- `frontend/`: The React (Vite) frontend application.

## Tech Stack

### Backend
- **Framework:** Laravel 
- **Language:** PHP
- **Package Manager:** Composer

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Other utilities:** React Signature Canvas

## Prerequisites

Before setting up the project, ensure you have the following installed on your machine:
- PHP (>= 8.1 recommended)
- Composer
- Node.js (>= 18.x recommended)
- npm or yarn
- MySQL or any other supported SQL Database

## Setup Instructions

### 1. Backend Setup (Laravel)

1. Navigate to the backend directory:
   ```bash
   cd "QuickDelivery/backend"
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Set up your environment file:
   ```bash
   cp .env.example .env
   ```
4. Configure your `.env` file with your local database credentials (DB_DATABASE, DB_USERNAME, DB_PASSWORD).
5. Generate the application key:
   ```bash
   php artisan key:generate
   ```
6. Run database migrations (if applicable):
   ```bash
   php artisan migrate
   ```
7. Start the Laravel development server:
   ```bash
   php artisan serve
   ```
   *The backend will typically be accessible at `http://localhost:8000`.*

### 2. Frontend Setup (React/Vite)

1. Navigate to the frontend directory:
   ```bash
   cd QuickDelivery/frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will typically be accessible at `http://localhost:5173`. Ensure it is configured to point to the backend API URL appropriately (usually through a `.env` file or Axios base URL settings).*

## Features
- Complete API for managing deliveries
- Modern, responsive User Interface
- React Signature Canvas for proof of delivery

