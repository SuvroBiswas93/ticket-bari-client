# 🎫 TicketBari – Smart Ticket Booking Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/Firebase-Auth-orange?logo=firebase" />
  <img src="https://img.shields.io/badge/Stripe-Payments-purple?logo=stripe" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb" />
  <img src="https://img.shields.io/badge/TailwindCSS-UI-38bdf8?logo=tailwindcss" />
</p>

<p align="center">
  A full-stack, role-based ticket booking platform for Bus, Train, Launch & Flight tickets.
</p>

---

## 🌐 Live Website

🔗 **Live URL:** https://online-ticket-booking-fullstack.netlify.app

---

## 🎯 Project Purpose

**TicketBari** is a production-ready ticket booking platform designed to simulate a real-world commercial system.  
It demonstrates **secure authentication**, **role-based dashboards**, **admin moderation**, **vendor ticket management**, and **Stripe payment integration** with a modern recruiter-friendly UI.

---

## 🚀 Key Features

### 🔐 Authentication & Security
- Email & Password authentication
- Google social login
- Password validation (Uppercase, Lowercase, Min 6 characters)
- Role-based protected routes (User / Vendor / Admin)
- Firebase Authentication
- JWT / Firebase token secured APIs
- Environment variables for Firebase & MongoDB credentials

---

### 🏠 Home Page
- Hero banner / slider
- Advertisement section (Admin selected – max 6 tickets)
- Latest tickets section (recently added)
- Two custom extra sections
- Fully responsive layout

---

### 🎟️ All Tickets Page
- Shows only **admin-approved tickets**
- 🔍 Search by **From → To**
- 🎯 Filter by **Transport Type**
- 🔃 Sort by **Price (Low → High / High → Low)**
- 📄 Pagination (6–9 tickets per page)
- Clean grid layout with equal-height cards

---

### 📄 Ticket Details (Protected)
- Full ticket information
- Countdown timer based on departure date & time
- “Book Now” modal with quantity selection
- Smart booking rules:
  - Cannot book if quantity is 0
  - Cannot book after departure time
  - Cannot exceed available quantity

---

## 📊 Dashboard System

### 👤 User Dashboard
- Profile information
- My Booked Tickets
  - Status: Pending / Accepted / Rejected / Paid
  - Countdown timer
  - Stripe payment integration
- Transaction History table

---

### 🧳 Vendor Dashboard
- Vendor profile
- Add ticket with image upload (imgbb)
- Manage added tickets (Update / Delete)
- Requested bookings (Accept / Reject)
- Revenue overview with interactive charts

---

### 🛡️ Admin Dashboard
- Admin profile
- Manage tickets (Approve / Reject)
- Manage users (Make Admin / Vendor)
- Mark vendor as Fraud
- Advertise tickets (Max 6)

---

## 🎨 UI & UX Highlights

- Modern & recruiter-friendly design
- Consistent typography and color theme
- Dark / Light mode toggle
- Responsive for mobile, tablet & desktop
- Smooth animations with Framer Motion
- Loading spinners & error handling pages
- Beautiful cards design & proper spacing

---

## 🧰 Tech Stack & Packages

### Frontend
- React 19
- Vite
- React Router 
- React Router DOM
- Tailwind CSS
- DaisyUI
- Firebase
- Axios
- React Hook Form
- Framer Motion
- Recharts
- Swiper
- SweetAlert2
- React Toastify
- Lucide React / React Icons
- React Spinners

### Backend
- Node.js
- Express.js
- MongoDB
- Firebase Token Authentication
- Stripe Payment Gateway
- Secure CORS handling

---

