# Salah Streak 🕌

Track your daily prayers, dhikr, and compete on the leaderboard – all in one beautiful Islamic app. Build consistency in your worship with streaks, detailed reports, and a supportive community.


## ✨ Features

- ✅ **Prayer Tracking** – Log your five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) with a beautiful, responsive calendar.
- 🔥 **Streak Counter** – Maintain your streak by completing all prayers daily. The streak updates in real-time.
- 📊 **Monthly Summaries** – View detailed statistics and download reports as PDF (weekly, monthly, yearly).
- 📿 **Tasbeeh Counter** – Create custom dhikr lists, tap to count, reset, or add custom amounts. A "Masha Allah" toast appears on completion.
- 🏆 **Leaderboard** – Compete with the community in three categories: Consistency (all days completed), Active Streaks, and Total Dhikr.
- 🗓️ **Hijri Dates** – Islamic dates are displayed alongside Gregorian (fetched from Aladhan API).
- 📧 **Email Notifications** – OTP verification for signup, password reset, and missed prayer reminders (via Brevo).
- 📱 **Fully Responsive** – Works perfectly on mobile, tablet, and desktop.
- 🌙 **Islamic Design** – Calm, spiritual UI with Arabic calligraphy and duas in the footer.

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React Icons
- React Hot Toast

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js
- Brevo (Sendinblue) for emails
- PDFKit for report generation
- Node-Cron for scheduled reminders

**External APIs**
- [Aladhan API](https://aladhan.com/islamic-calendar-api) – for accurate Hijri dates.

## 🚀 Live Demo

The app is deployed at: [https://salah-streak.netlify.app](https://salah-streak.netlify.app)

*Backend is hosted on Render (may take a few seconds to spin up).*

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Brevo (Sendinblue) account for email services

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/salah-streak.git
cd salah-streak
