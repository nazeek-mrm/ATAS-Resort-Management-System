# 🌴 ATAS RESORT — Luxury Getaway Booking & Management System

> A luxury private resort reservation web application and administrative management system built with **React (Vite)** and **Laravel 11**.

---

## 📖 Project Overview

**ATAS Resort** provides an exclusive getaway booking experience. Guests can view date availability in real-time, select custom packages based on group size and duration, submit booking requests, and upload bank transfer receipts or reference codes.

The system includes a dedicated **Admin Dashboard** allowing resort management to verify payments, confirm or reject bookings, add internal notes, review revenue statistics, and export monthly business reports.

---

## ✨ Key Features

### 🏨 Guest Booking Portal (Frontend)
- **Interactive Availability Calendar**: Visual indicators for available, pending, and confirmed dates.
- **4-Step Booking Workflow**:
  1. **Date Selection**: Pick available dates with real-time status.
  2. **Package Selection**: Day, Day-Night, and Night tiers with dynamic pricing and automatic 30% advance calculation.
  3. **Customer Details**: Strict email domain validation (blocking incomplete/typo domains like `@gmail.co`) and mobile validation.
  4. **Payment Proof**: Drag-and-drop bank receipt upload (JPG, PNG, PDF up to 5MB) or bank reference transaction number.
- **Classical Modal Error Dialogs**: Elegant resort-branded popup modals with auto-focus assistance.
- **Silent Background Session Timers**: 6 minutes per step (1–3) and 12 minutes for payment step with automatic refresh protection.
- **Responsive Luxury Design**: Built with Tailwind CSS, custom animations, and Playfair Display typography.

### 🛡️ Admin Management Dashboard
- **Secure Authentication**: Protected dashboard with show/hide password toggles and back-button navigation guards.
- **Live Booking Overview**: Filter by Pending, Confirmed, Rejected, or Cancelled bookings with real-time status badges.
- **Receipt Verification**: In-modal image and PDF receipt preview with direct download capability.
- **Internal Admin Notes**: Fast note-taking per booking for internal communication.
- **Financial & Monthly Reports**: Revenue summaries, advance collected, check-in balances, and one-click printable reports.
- **Credentials Management**: Update admin username and password securely from settings.

### 📧 Automated Email Notifications (SMTP)
- **Guest Confirmation**: Automated booking received emails with reference codes and booking summary.
- **Admin Alerts**: Instant notifications sent to resort management upon every new booking submission.
- **Status Updates**: Automated customer notifications when bookings are confirmed or rejected.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router 6, Tailwind CSS, Lucide-style SVG Icons.
- **Backend**: Laravel 11, PHP 8.2+, MySQL / MariaDB, Symfony Mailer (SMTP / SSL).
- **Environment**: Compatible with XAMPP, Apache, Nginx, or standalone PHP server.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+) & **npm**
- **PHP** (v8.2+) with extensions: `pdo_mysql`, `openssl`, `mbstring`, `fileinfo`, `curl`
- **Composer**
- **MySQL / MariaDB** (via XAMPP or standalone)

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/atas-resort.git
cd atas-resort
```

---

### 2. Backend Setup (Laravel)
```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Create environment file from template
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Link public storage for uploaded receipts
php artisan storage:link
```

#### Configure `.env` in `backend/`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=atas_resort
DB_USERNAME=root
DB_PASSWORD=

# Gmail SMTP Configuration
MAIL_MAILER=smtp
MAIL_SCHEME=smtps
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=your-admin-email@gmail.com
MAIL_PASSWORD=your-google-app-password
MAIL_FROM_ADDRESS=your-admin-email@gmail.com
MAIL_FROM_NAME="ATAS RESORT"

FRONTEND_URL=http://localhost:5173
```

> **Note on Gmail SMTP**: Google requires a **16-character Google App Password** generated from [Google Account Security](https://myaccount.google.com/apppasswords). Enter it without spaces in `MAIL_PASSWORD`.

#### Start Backend Server:
```bash
php artisan serve
# Server runs at http://localhost:8000
```

---

### 3. Frontend Setup (React + Vite)
```bash
# Navigate to frontend directory
cd ../frontend

# Install JavaScript dependencies
npm install

# Start Vite development server
npm run dev
# App opens at http://localhost:5173
```

---

## 📂 Project Architecture

```
atas-resort/
├── backend/                  # Laravel 11 REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/  # Booking & Admin Controllers
│   │   ├── Mail/                  # Email Mailable Classes
│   │   └── Models/                # Eloquent Models (Booking, BookedDate, Admin)
│   ├── config/                    # Application Configuration (mail, cors, db)
│   ├── database/migrations/       # Database Schema Migrations
│   ├── resources/views/emails/    # HTML Email Templates
│   └── routes/api.php             # API Endpoints
│
├── frontend/                 # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/            # ClassicalModal, Navbar, Footer, Icons, Toast
│   │   ├── pages/                 # HomePage, BookingPage, AdminLogin, AdminDashboard
│   │   ├── utils/                 # Validation & Helper Utilities
│   │   ├── api.js                 # Axios API Client Configuration
│   │   └── index.css              # Global Styling & Keyframe Animations
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore                # Comprehensive Git Ignore Rules
└── README.md                 # System Documentation
```

---

## 🔒 Security Best Practices

- `backend/.env` is ignored by Git to prevent exposing credentials, database passwords, or SMTP app passwords.
- Always use `.env.example` as a template when cloning into new environments.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
