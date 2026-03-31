# 📌 Subscription Tracker API 

LIVE DEPLOYMENT: https://subscriptiontrackerproject.onrender.com/

A backend system built with **Node.js, Express.js, MongoDB, JWT Authentication, and Arcjet** to help users track their subscriptions, manage renewals, and receive email reminders — with built-in security and rate limiting.  

---

## 🚀 Features  

- 🔑 **JWT Authentication** – Secure login & registration with access/refresh tokens.  
- ➕ **Add Subscriptions** – Store subscription details (name, cost, renewal date).  
- 📋 **Manage Subscriptions** – Update, view, or delete subscriptions via RESTful APIs.  
- 📧 **Email Notifications** – Automated reminders sent to users before renewal dates using Nodemailer.  
- 🛡 **Arcjet Protection** – Shields against common attacks (SQLi, XSS, etc.), enforces rate limits, and blocks bots.  
- ☁️ **MongoDB Storage** – Persistent storage of user and subscription data.  

---

## 🛠 Tech Stack  

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Auth & Security:** JWT, Arcjet  
- **Mail Service:** Nodemailer (SMTP or Gmail integration)  
- **Other Tools:** Postman (API testing), Git, GitHub  

---

## 📂 Project Structure  
```
subscription-tracker-api/
 ┣ config/            # Database & mailer config
 ┣ middleware/        # JWT & Arcjet middleware
 ┣ models/            # Mongoose schemas
 ┣ routes/            # Express routes (subscriptions, users, auth)
 ┣ controllers/       # Route logic
 ┣ server.js          # Entry point
 ┗ package.json
```
## ⚡ Getting Started
_Prerequisites_

- Install Node.js
- Install MongoDB (local or Atlas)
- Get an Arcjet API Key

---

## Installation
 **Clone repo**
```git clone https://github.com/kushagrx/subscription-tracker-api.git```

 **Navigate**
```cd subscription-tracker-api```

 **Install dependencies**
```npm install```

 **Add environment variables**
```cp .env.example .env```    configure DB_URI, JWT_SECRET, MAIL_USER, MAIL_PASS, ARCJET_KEY

 **Run server**
```npm start```

## API Endpoints
Auth

POST /api/auth/register → Register user (with hashed password)

POST /api/auth/login → Login user & return JWT token

Subscriptions (Protected by JWT & Arcjet)

POST /api/subscriptions → Add new subscription

GET /api/subscriptions → Get all subscriptions

PUT /api/subscriptions/:id → Update subscription

DELETE /api/subscriptions/:id → Delete subscription

## Email Notifications

Uses Nodemailer to send automated reminders.

Renewal reminder emails are sent X days before due date (configurable).

## Arcjet Security

Bot Protection – Blocks bad bots and automated abuse.

Rate Limiting – Prevents API overuse.

Attack Shield – Protects against common web vulnerabilities.

Arcjet is integrated as Express middleware and applied to sensitive routes.

# 🎯 Future Improvements

📱 Frontend dashboard to view/manage subscriptions.

🔔 Push notifications for mobile/web apps.

💳 Payment gateway integration for auto-renewals.

# 👨‍💻 Author

Kushagra Bisht
