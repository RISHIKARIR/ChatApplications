#  WhatsinYourMind - Real Time Chat Application

A real-time chat application built with **Next.js, Node.js, Express, PostgreSQL, Sequelize, and Socket.IO**.

##  Live Demo

**Frontend:**  
https://whatsinyourmind.vercel.app/login

**GitHub Repository:**  
https://github.com/RISHIKARIR/ChatApplications

**Frontend Deployment:** Vercel  
**Backend Deployment:** Render  
**Database:** Neon PostgreSQL

---

##  Features

- User Authentication
- JWT Access & Refresh Tokens
- Real-time messaging
- WebSockets using Socket.IO
- Private conversations
- Online/Offline user status
- Message delivery status
- Media upload using Cloudinary
- PostgreSQL database
- Responsive UI

---

##  Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Socket.IO Client
- Tailwind CSS
- Shadcn UI

### Backend

- Node.js
- Express.js
- Socket.IO
- Sequelize
- PostgreSQL
- JWT
- bcrypt
- Multer
- Cloudinary

### Deployment

- Vercel
- Render
- Neon PostgreSQL

---

# 📁 Project Structure

```text
ChatApplications/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── utils/
│   ├── validations/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── Frontend/
│   └── my-app/
│       ├── app/
│       ├── components/
│       ├── config/
│       ├── context/
│       ├── hooks/
│       ├── lib/
│       ├── public/
│       ├── services/
│       ├── package.json
│       └── package-lock.json
│
└── README.md
```

---

# 📥 Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/RISHIKARIR/ChatApplications.git
```
## 2. Backend Setup

Navigate to the backend directory:

```bash
cd ChatApplications/Backend
npm install


## 3. Backend Environment Variables

After installing the backend dependencies, create a `.env` file inside the `Backend` folder.

Your folder should look like:

```text
Backend/
├── .env
├── package.json
├── index.js
└── ...


DATABASE_URL=""

DB_NAME="neondb"
DB_USER=""
DB_PASSWORD=""
DB_HOST=""

JWT_REFRESH_SECRET_KEY=""
JWT_ACCESS_SECRET_KEY=""

CLIENT_URL="http://localhost:3000"

cloudinary_cloud_name=""
cloudinary_api_key=""
cloudinary_api_secret=""

```



| Variable                 | Description                             |
| ------------------------ | --------------------------------------- |
| `DATABASE_URL`           | PostgreSQL/Neon database connection URL |
| `DB_NAME`                | PostgreSQL database name                |
| `DB_USER`                | PostgreSQL database username            |
| `DB_PASSWORD`            | PostgreSQL database password            |
| `DB_HOST`                | PostgreSQL database host                |
| `JWT_REFRESH_SECRET_KEY` | Secret key used for refresh tokens      |
| `JWT_ACCESS_SECRET_KEY`  | Secret key used for access tokens       |
| `CLIENT_URL`             | Frontend URL                            |
| `cloudinary_cloud_name`  | Cloudinary cloud name                   |
| `cloudinary_api_key`     | Cloudinary API key                      |
| `cloudinary_api_secret`  | Cloudinary API secret                   |







## 4. Start the Backend

Once you have configured the backend environment variables, start the backend server using:

```bash
npm run dev
```




# 🎨 Frontend Setup

Navigate to the frontend directory:

```bash
cd ChatApplications/Frontend/my-app
npm install
```



## 5. Frontend Environment Variables

Inside the `Frontend/my-app` folder, create a file named:

```text
.env

NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"
```
## 6. Start the Frontend

Once the frontend environment variables have been configured, start the Next.js development server:

```bash
npm run dev
