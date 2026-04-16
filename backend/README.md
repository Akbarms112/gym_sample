# Challenge Fitness App Backend

This is the backend API for the Challenge Fitness App, built with **FastAPI** and **MongoDB**.

## Prerequisites

- Python 3.8 or higher
- MongoDB (Local or Atlas)

## Setup Instructions

### 1. Create a Virtual Environment

It's recommended to use a virtual environment to manage dependencies.

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

### 2. Install Dependencies

Install the required Python packages using pip:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory if it doesn't exist. You can copy the structure from the example below.

**`.env` file content:**

```env
# MongoDB Connection String (Update with your own if needed)
MONGODB_URL=mongodb+srv://your_username:your_password@cluster.mongodb.net/?appName=Cluster0

# Optional: Secret Key for JWT (Change this in production!)
# SECRET_KEY=your-secret-key-change-this-in-production
```

> **Note:** The application connects to MongoDB using the `MONGODB_URL`. Ensure your IP is whitelisted if using MongoDB Atlas.

## Running the Server

Start the backend server using Uvicorn with hot-reload enabled:

```bash
uvicorn main:app --reload
```

The server will start at `http://127.0.0.1:8000`.

## API Documentation

FastAPI automatically generates interactive API documentation. Once the server is running, you can access it at:

- **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Project Structure

- `main.py`: Entry point of the FastAPI application.
- `requirements.txt`: List of Python dependencies.
- `.env`: Environment variables configuration.
