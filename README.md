
# 📝 Mini-Blog API

A simple and secure blog backend API where users can create accounts, post blogs, manage personal content, and upload profile pictures. Built with **Node.js**, **Express**, **MySQL**, and **Sequelize**.

---

## 🚀 Features

- ✅ User Registration & Login with JWT
- ✅ Create & View Personal Blog Posts
- ✅ Post Deletion (only by owner)
- ✅ Profile Picture Upload (via Cloudinary)
- ✅ Password Reset & Change (via email)
- ✅ Secure Authentication
- ✅ Sequelize ORM + MySQL

---

## 📦 Technologies Used

- **Node.js + Express**
- **MySQL** with **Sequelize**
- **JWT** for Authentication
- **SendGrid** for Emails
- **Cloudinary** for Image Uploads
- **dotenv** for env config

---

## ⚙️ Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/SamueldDev/mini-blog-backend
   cd mini-blog-backend
   
Install dependencies

npm install
Configure environment variables

Create a .env file in the root:

env

PORT=5000

DB_NAME=your_db_name

DB_USER=your_mysql_user

DB_PASSWORD=your_mysql_password

DB_HOST=localhost

JWT_SECRET=your_jwt_secret

SENDGRID_API_KEY=your_sendgrid_key

VERIFIED_SENDER_EMAIL=your_verified_email

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

Run the server

npm run dev

📬 API Endpoints

🧑 Auth Routes

Method	Route	Description

POST	/api/register	Register a new user

POST	/api/login	Login and get JWT

POST	/api/forgot-password	Request password reset email

POST	/api/reset-password/:token	Reset password with token

PUT	/api/change-password	Change password (logged in)

DELETE	/api/delete-account	Delete user account

📝 Blog Post Routes

Method	Route	Description

POST	/api/posts	Create a new post

GET	/api/posts	Get all your posts

DELETE	/api/posts/:id	Delete a specific post

🛡️ All post routes require a valid JWT token in the Authorization header.

🖼️ Profile Upload

Method	Route	Description

POST	/api/upload-profile	Upload or change profile image (Cloudinary)


🧑‍💻 Author

Samuel Friday

Backend Developer – Passionate about building APIs that turn ideas into working systems.

✅ License
MIT — free to use for personal and commercial projects.

