# ✈️ Airline Voucher Seat Assignment Application

> A full-stack web application built with **React + Laravel** to generate **3 unique random voucher seats** for airline promotional campaigns while preventing duplicate voucher assignments for the same flight and departure date.

---

## 📖 Overview

This project was developed as part of a **PHP Laravel Technical Assessment**.

The application allows airline crew members to generate promotional voucher seats based on the selected aircraft type. Before generating vouchers, the system validates whether vouchers have already been created for the same flight number and departure date to prevent duplicate assignments.

Each voucher generation produces **exactly three unique random seats** that are valid according to the aircraft's seat layout. The generated data is then stored in a **SQLite** database for future reference.

---

## ✨ Features

- 🎲 Generate exactly **3 unique random seat numbers**
- ✈️ Aircraft-specific seat generation (ATR, Airbus 320, Boeing 737 Max)
- ✅ Prevent duplicate voucher generation for the same flight and date
- 📅 Interactive Date Picker
- 💾 Store voucher assignments in SQLite
- 🛡️ Input validation using Laravel Form Requests
- ⚙️ Clean architecture using Service Layer
- 🌐 RESTful API implementation
- 📱 Responsive user interface
- 🚨 User-friendly error handling

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Axios

### Backend

- PHP 8.2+
- Laravel 12
- Eloquent ORM
- Laravel Form Requests
- Laravel API Resources
- SQLite

---

## ✈️ Supported Aircraft Layout

| Aircraft       | Row Range | Seat Letters     | Example Seats |
| -------------- | --------- | ---------------- | ------------- |
| ATR            | 1 – 18    | A, C, D, F       | 1A, 18F       |
| Airbus 320     | 1 – 32    | A, B, C, D, E, F | 1A, 32F       |
| Boeing 737 Max | 1 – 32    | A, B, C, D, E, F | 1A, 32F       |

---

## 🏗 Project Structure

```text
voucher-seat-assignment/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── services/
│   └── assets/
│
├── backend/
│   ├── app/
│   │   ├── Exceptions/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   ├── routes/
│   └── tests/
│
└── README.md
```

---

# 📋 Prerequisites

Before running this project, ensure the following software is installed:

- Node.js (v18 or newer)
- PHP (v8.2 or newer)
- Composer
- Git
- SQLite

---

# 🚀 Installation

## 1. Clone Repository

Clone this repository and navigate to the project directory.

```bash
git clone https://github.com/5Uph1/voucher-seat-assignment.git

cd voucher-seat-assignment
```

---

## 2. Backend Setup

Navigate to the backend directory.

```bash
cd backend
```

Install the PHP dependencies.

```bash
composer install
```

Copy the environment configuration file.

```bash
cp .env.example .env
```

Generate the Laravel application key.

```bash
php artisan key:generate
```

---

## 3. Configure SQLite

Create the SQLite database file.

```bash
touch database/database.sqlite
```

Update the following values in your `.env` file:

```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

---

## 4. Run Database Migration

Run the database migrations to create the required tables.

```bash
php artisan migrate
```

---

## 5. Start the Laravel Backend

Start the Laravel development server.

```bash
php artisan serve
```

The backend API will be available at:

```text
http://localhost:8000
```

Keep this terminal running while using the application.

---

## 6. Frontend Setup

Open a **new terminal**, then navigate to the frontend directory.

```bash
cd frontend
```

Install the Node.js dependencies.

```bash
npm install
```

Start the React development server.

```bash
npm run dev
```

The frontend application will be available at:

```text
http://localhost:5173
```

Keep this terminal running while using the application.

---

## 7. Running the Application

This project consists of two separate applications:

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:5173 |
| Backend API | http://localhost:8000 |

Make sure **both the frontend and backend development servers are running simultaneously**.

To use the application:

1. Open **http://localhost:5173** in your browser.
2. Fill in the crew and flight information.
3. Select the aircraft type and flight date.
4. Click **Generate Vouchers**.
5. The frontend will call the Laravel API to:
   - Check whether vouchers already exist for the selected flight and date.
   - Generate three unique random seats.
   - Store the generated voucher in the SQLite database.

---

# 🔌 API Endpoints

## Check Existing Voucher

### Request

```http
POST /api/check
```

```json
{
  "flightNumber": "GA102",
  "date": "2025-07-12"
}
```

### Response

```json
{
  "exists": false
}
```

---

## Generate Voucher Seats

### Request

```http
POST /api/generate
```

```json
{
  "name": "Sarah",
  "id": "98123",
  "flightNumber": "GA102",
  "date": "2025-07-12",
  "aircraft": "Airbus 320"
}
```

### Response

```json
{
  "success": true,
  "seats": ["3B", "7C", "14D"]
}
```

---

# ⚙️ Seat Generation Rules

The application follows these rules when generating vouchers:

- Generate exactly **3 seats**
- Every seat must be unique
- Seat numbers must match the selected aircraft layout
- Prevent duplicate voucher creation for the same flight number and date
- Store generated vouchers in the database

---
