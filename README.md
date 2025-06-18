# School Management API

A RESTful API built with **Node.js**, **Express**, and **MongoDB (MongoClient)** for managing students, staff, departments, courses, and enrollments with full authentication, role-based access control, and Swagger documentation.

---

## 📚 Features

- JWT authentication with Redis token blacklist support
- Centralized login with role-based access (student, staff, admin)
- Dynamic profile population after login
- CRUD operations for:
  - Users (students, staff)
  - Departments
  - Courses
  - Enrollments
- Role-based authorization middleware
- API key generation and validation (optional)
- Swagger/OpenAPI documentation
- Jest + Supertest for integration testing

---

## 🧱 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (native MongoClient)
- **Auth**: JWT (with Redis blacklist), OAuth2 (Google, GitHub)
- **Testing**: Jest, Supertest
- **Validation**: express-validator
- **Documentation**: Swagger 2.0 (via `swagger-autogen`)

---

## 📁 Folder Structure

```
school-management-api/
├── config/
├── controllers/
|── data/
├── middleware/
├── models/
├── routes/
├── swagger/
├── utilities/
├── tests/
├── app.js
├── server.js
└── swagger.js
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git https://github.com/lexmanthefirst/cse-341-project.git
cd cse-341-group-project
pnpm install
```

### 2. Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/school_management_db
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

For testing, create `.env.test`:

```
MONGO_URI_TEST=mongodb://localhost:27017/school_management_test
JWT_SECRET=your_test_secret
```

---

## 🔐 Authentication

- Centralized login via `/api/auth/google`
- Role-based login for `student`, `staff`, or `admin`
- JWT issued on login and stored in Redis
- Token blacklist enforced on logout:
  - On logout, JWT is added to a Redis blacklist with expiry
  - Every protected route checks Redis to ensure the token hasn't been revoked
- User profile (student/staff) is populated after login
- Middleware `authenticateUser` checks:
  - Token validity
  - Redis blacklist status
  - User existence and role

---

## 🧠 JWT + Redis Flow

1. 🔓 Login using Google OAuth2 → JWT is signed and stored in Redis as a valid token
2. 🔐 Protected routes check:
   - JWT validity
   - Whether token exists in Redis blacklist
3. 🚪 Logout → JWT is added to Redis blacklist (with `EX` = expiry time)
4. ✅ Prevents reuse of tokens after logout or user deactivation

---

## 📦 API Endpoints

### 🔸 Auth

| Method | Route              | Description              |
| ------ | ------------------ | ------------------------ |
| POST   | `/api/auth/google` | Login                    |
| POST   | `/api/auth/google` | Register user            |
| POST   | `/api/auth/logout` | Logout and blacklist JWT |

### 🔸 Department

| Method | Route                 | Description           |
| ------ | --------------------- | --------------------- |
| POST   | `/api/department`     | Create new department |
| GET    | `/api/department`     | List all departments  |
| GET    | `/api/department/:id` | Get department by ID  |
| PUT    | `/api/department/:id` | Update department     |
| DELETE | `/api/department/:id` | Delete department     |

### 🔸 Course

| Method | Route             | Description    |
| ------ | ----------------- | -------------- |
| CRUD   | `/api/course/...` | Manage courses |

### 🔸 Enrollment

| Method | Route             | Description                |
| ------ | ----------------- | -------------------------- |
| POST   | `/api/enrollment` | Enroll student in a course |
| GET    | `/api/enrollment` | View all enrollments       |

---

## 🧪 Testing with Jest

```bash
pnpm test --coverage
```

Includes tests for department routes using Jest + Supertest.

---

## 🧾 Swagger Docs

Generate Swagger docs using:

```bash
pnpm run dev
```

View documentation at: `https://cse-341-project-m8mw.onrender.com/api-docs/`

---

## 🧑‍💻 Authors

**Alex Okhitoya**, **Racheal Katono**

Passionate about solving real-world problems with backend technology.
