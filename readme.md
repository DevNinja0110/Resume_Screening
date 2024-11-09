# Project Setup Instructions

## Prerequisites

- **Node.js**: Version 20.15 or higher
- **Python**: Version 3.10 or higher

## Backend Setup

1. Navigate to the `server` directory:
    ```sh
    cd server
    ```

2. Install the required Python packages:
    ```sh
    pip install -r requirements.txt
    ```

3. Start the backend server using Uvicorn:
    ```sh
    uvicorn main:app --reload
    ```

## Frontend Setup

1. Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```

2. Install the required Node.js packages:
    ```sh
    npm install
    ```

3. Start the frontend development server:
    ```sh
    npm run dev
    ```

## Additional Notes

- Ensure that you have the correct versions of Node.js and Python installed.
- The backend server will automatically reload on code changes due to the `--reload` flag.
- The frontend development server will be available at the specified port (usually `http://localhost:5173`).
