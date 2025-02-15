# Secret Santa Game

## Overview
The **Secret Santa Game** automates the assignment of Secret Santa gift-givers and receivers. The system reads employee data from a CSV file and assigns each employee a secret child while ensuring fairness by avoiding self-assignments and previous year’s pairings.

## Features
- Upload a CSV file with employee details.
- Automatically assign a secret child to each employee following the specified rules.
- Download the generated assignments as a CSV file.
- Prevent duplicate assignments from the previous year.
- Error handling for invalid files and incorrect inputs.

---

## Tech Stack
- **Backend**: Node.js, Express.js, Multer
- **Frontend**: React.js (Vite setup)
- **Version Control**: GitHub

---

## Backend Setup

### Prerequisites
- Install [Node.js](https://nodejs.org/) and npm

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/AdityaBheke/Secret-Santa-Game.git
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the `.env` file:
   ```env
   PORT=5000
   ```
4. Start the backend server:
   ```sh
   node index.js
   ```

### API Endpoints
| Method | Endpoint | Description |
|--------|------------------------------|--------------------------------------|
| POST   | `/api/secret-santa/shuffle`  | Processes CSV file and assigns secret children |
| GET    | `/api/secret-santa/download/:filename` | Downloads the generated CSV file |
| DELETE | `/api/secret-santa/delete/:filename`   | Deletes a specified CSV file |

---

## Frontend Setup

### Prerequisites
- Install [Node.js](https://nodejs.org/) and npm

### Installation
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the `.env` file:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
4. Start the frontend server:
   ```sh
   npm run dev
   ```

### Frontend Features
- A **Home Page** with a file upload container.
- Instructions displayed below the upload container.
- Accepts only `.csv` files.
- Displays error messages if an invalid file is uploaded.
- Prevents requests without a file.

---

## Running the Project
1. Start the backend server:
   ```sh
   cd backend
   node index.js
   ```
2. Start the frontend server:
   ```sh
   cd frontend
   npm run dev
   ```
3. Open the frontend in a browser and upload a valid CSV file to assign secret children.

---

## Error Handling
- Invalid file uploads are rejected with a proper error message.
- Backend ensures CSV format validation.
- Errors are displayed gracefully in the UI.


---

## Contact
For any queries or contributions, please contact [adityabheke34@gmail.com].
