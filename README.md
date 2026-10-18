# 🌴 ATAS RESORT — Luxury Getaway Booking & Management System

A full-stack private resort reservation application and administrative management system built with **React 19**, **Vite 8**, **Laravel 12**, and **MySQL/MariaDB**.

## 📖 Project Overview

**ATAS Resort** provides an online booking experience for guests and a management dashboard for resort administrators. Guests can view date availability, select packages based on group size and duration, submit booking requests, and provide bank transfer receipts or transaction references.

Administrators can review payments, confirm or reject bookings, add internal notes, review revenue statistics, and generate monthly reports.

## ✨ Key Features

### 🏨 Guest Booking Portal

- **Availability calendar:** Visual indicators for available, pending, and confirmed dates.
- **Four-step booking workflow:**
  1. **Date selection:** Choose dates using availability information.
  2. **Package selection:** Choose Day, Day-Night, or Night packages, with dynamic pricing and automatic 30% advance calculation.
  3. **Customer details:** Email-domain and mobile-number validation.
  4. **Payment proof:** Upload a JPG, PNG, or PDF receipt (up to 5 MB), or provide a bank transaction reference.
- **Branded error dialogs:** Modal feedback with focus assistance.
- **Session timers:** Six minutes per step for steps 1–3 and twelve minutes for the payment step, with expiry handling.
- **Responsive interface:** Tailwind CSS, animations, and Playfair Display typography.

### 🛡️ Admin Management Dashboard

- Protected administrator authentication.
- Booking filters for Pending, Confirmed, Rejected, and Cancelled statuses.
- Receipt preview and download for supported image and PDF formats.
- Internal notes for each booking.
- Revenue summaries, advance-payment tracking, check-in balances, and printable monthly reports.
- Administrator username and password management.

### 📧 Email Notifications

- Booking-submission acknowledgements for guests.
- New-booking alerts for resort management.
- Customer notifications for booking confirmation or rejection.
- SMTP-based email delivery.

## 🛠️ Technology Stack

| Layer | Technology | Verified local version |
| --- | --- | --- |
| Frontend | React | 19.3.0 |
| Build tool | Vite | 8.3.0 |
| Routing | React Router DOM | 7.18.4 |
| Styling | Tailwind CSS | 3.4.19 |
| Backend | Laravel | 12.69.2 |
| Database | MySQL / MariaDB | Depends on installation |
| Email | SMTP / Laravel Mail | Depends on configuration |
| Development tools | PHP, Composer, Node.js, npm, XAMPP | Depends on installation |

> Versions above were verified in the development environment in October 2026. Installed dependency versions may differ after future updates.

## 📂 Project Structure

```text
ATAS-Resort-Management-System/
├── backend/                    # Laravel API and business logic
│   ├── app/
│   │   ├── Http/Controllers/Api/ # Booking and admin endpoints
│   │   ├── Mail/               # Email notification classes
│   │   └── Models/             # Eloquent models
│   ├── config/                 # Application configuration
│   ├── database/
│   │   ├── migrations/         # Database schema
│   │   └── seeders/            # Initial data and admin seeder
│   ├── resources/views/emails/ # Email templates
│   └── routes/api.php          # API routes
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/         # Shared UI components
│   │   ├── pages/              # Guest and admin pages
│   │   └── utils/              # Helpers and validation
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🚀 Getting Started (Windows / PowerShell)

### Prerequisites

- **PHP 8.2+** and required Laravel extensions, including `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, and `curl`.
- **Composer** for PHP dependencies.
- **Node.js and npm** compatible with the installed Vite version. Check the Node.js engine requirement in `frontend/package.json` before installation.
- **MySQL or MariaDB**, optionally provided through XAMPP.
- **Git**.

### 1. Clone the repository

```powershell
git clone https://github.com/nazeek-mrm/ATAS-Resort-Management-System.git
cd ATAS-Resort-Management-System
```

### 2. Create the database

Start MySQL/MariaDB through XAMPP or your database service. In phpMyAdmin or another SQL client, create an empty database:

```sql
CREATE DATABASE atas_resort CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

If your local database has a different name, use that name in the environment configuration below.

### 3. Configure the Laravel backend

From the repository root:

```powershell
cd backend
composer install
Copy-Item .env.example .env
php artisan key:generate
```

Edit `backend/.env` with your own database settings:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=atas_resort
DB_USERNAME=root
DB_PASSWORD=
```

> The empty database password is only an example for certain local XAMPP installations. Use the actual database credentials for your environment. Never use an unprotected root account in production.

Run migrations and configure the public storage link:

```powershell
php artisan migrate
php artisan storage:link
```

### 4. Configure the initial administrator

Add the following **placeholder values** to your private `backend/.env` file:

```dotenv
SEED_ADMIN_USERNAME=choose_an_admin_username
SEED_ADMIN_PASSWORD=replace_with_a_strong_unique_password
SEED_ADMIN_EMAIL=admin@example.com
```

Use a strong, unique password and a valid administrative email address. With the environment configured and the database migrated, run:

```powershell
php artisan config:clear
php artisan db:seed --class=AdminSeeder
```

> The admin seeder reads credentials from environment variables. Never put real credentials in source code or commit your `.env` file.

### 5. Configure SMTP (optional for local setup)

For Gmail SMTP, configure the following in `backend/.env`:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SCHEME=smtps
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-google-app-password
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="ATAS RESORT"
FRONTEND_URL=http://localhost:5173
```

Gmail accounts using app passwords require an eligible account and a generated app password. See [Google Account App Passwords](https://support.google.com/accounts/answer/185833). Mail settings can differ depending on your email provider and deployment environment.

For local development without sending actual messages, consider a safe test mailer configuration supported by your Laravel installation.

### 6. Start the backend

In the `backend` directory:

```powershell
php artisan serve
```

The development server normally runs at **http://127.0.0.1:8000**.

### 7. Install and start the frontend

Open a **second terminal** from the repository root, or navigate from `backend`:

```powershell
cd ..\frontend
npm install
npm run dev
```

Open the URL printed by Vite (commonly **http://localhost:5173**).

> Ensure that the frontend API configuration points to the Laravel backend URL used on your machine.

## 🔒 Security and Privacy

- Never commit `.env` files, database passwords, SMTP app passwords, or Laravel application keys.
- Keep initial administrator credentials in private environment configuration, not in seeders or source code.
- Use strong passwords and secure deployment-specific settings.
- Do not upload real guest data, payment receipts, or private business records to the public repository.
- Review `git status` and staged changes before committing.
- Use HTTPS, appropriate access controls, backups, and production-safe configuration before deploying publicly.

## 📸 Screenshots

Screenshots of the homepage, availability calendar, booking process, and admin dashboard can be added in `docs/screenshots/`.

> Use demonstration data and remove personal or confidential information from screenshots.

## 🧭 Project Status

The source code is published for development and documentation. A GitHub repository is **not** the same as a deployed production website; running the application requires a configured frontend, backend, and database.

## 👨‍💻 Developer

**Nazeek MRM** — [GitHub Profile](https://github.com/nazeek-mrm)

## 📄 License

No open-source license is specified in this repository documentation. If a license is added later, refer to the repository's `LICENSE` file for its terms.
