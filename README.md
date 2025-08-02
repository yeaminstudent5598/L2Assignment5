# 📦 Parcel Delivery System API

This is a role-based REST API backend system for a parcel delivery service — inspired by platforms like Pathao or Sundarban Courier. It's built using **TypeScript**, **Express**, **Mongoose**, and includes strong validation with **Zod**, authentication with **JWT**, and password hashing with **bcryptjs**.

---

## 🚀 Features

- Sender, Receiver, and Admin roles
- Secure authentication and authorization
- Create, track, and manage parcels
- Validation with **Zod**
- Password encryption with **bcryptjs**
- Clean modular folder structure
- Role-based route access
- Parcel status logs (track history)

---

## 📁 Folder Structure

src/
├── app/
│ ├── modules/
│ │ ├── user/
│ │ ├── auth/
│ │ ├── parcel/
│ └── middlewares/
├── config/
├── constants/
├── enums/
├── interfaces/
├── server.ts


---

## 🧪 Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- TypeScript
- JWT (Authentication)
- bcryptjs (Password Hashing)
- Zod (Validation)
- dotenv (Environment config)

---

## 🛣️ API Routes

### 🔐 Auth

| Method | Route                 | Description                    |
|--------|----------------------|--------------------------------|
| POST   | `/api/auth/register` | Register as sender or receiver |
| POST   | `/api/auth/login`    | Login and receive access token |
| GET    | `/api/auth/me`       | Get current user info          |

### 👤 Users

| Method | Route           | Access      | Description        |
|--------|-----------------|-------------|--------------------|
| GET    | `/api/users`    | Admin only  | Get all users      |
| GET    | `/api/users/:id`| Admin/User  | Get single user    |

### 📦 Parcels

| Method | Route                                     | Access              | Description                          |
|--------|-------------------------------------------|---------------------|--------------------------------------|
| POST   | `/api/parcels`                            | Sender              | Create new parcel                    |
| GET    | `/api/parcels/my-parcels`                 | Sender              | View all parcels of sender          |
| PATCH  | `/api/parcels/cancel/:id`                 | Sender              | Cancel a parcel (if not dispatched) |
| GET    | `/api/parcels/incoming-parcels`           | Receiver            | View incoming parcels               |
| PATCH  | `/api/parcels/confirm-delivery/:id`       | Receiver            | Confirm parcel delivery             |
| GET    | `/api/parcels/delivery-history`           | Sender/Receiver     | View parcel delivery history        |
| GET    | `/api/parcels`                            | Admin               | View all parcels                    |
| PATCH  | `/api/parcels/update-status/:id`          | Admin               | Update parcel status                |
| PATCH  | `/api/parcels/block/:id`                  | Admin               | Block a parcel                      |
| PATCH  | `/api/parcels/unblock/:id`                | Admin               | Unblock a parcel                    |
| GET    | `/api/parcels/tracking/:trackingId`       | Public              | Track parcel by tracking ID         |
| GET    | `/api/parcels/:parcelId/status-log`       | Admin/Users         | View status log of a parcel         |
| GET    | `/api/parcels/:id`                        | Authenticated Users | View specific parcel                |

---

## 🧾 Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/yourname/parcel-delivery-api.git
cd parcel-delivery-api ```

----
