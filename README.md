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

```bash
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── parcel/ 
├── middlewares/
├── config/
├── utils/
├── app.ts


```
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
cd parcel-delivery-api

```

2. **Install dependencies**

```bash
npm install
```

3. **Create .env file**

```bash
PORT=5000
DATABASE_URL=your_mongo_uri
JWT_SECRET=your_secret
BCRYPT_SALT_ROUNDS=10

```

4. **Run the server**

```bash
npm run dev

```

### 🔐 Auth & Security
JWT-based login system.

Authenticated routes require the following header:

```bash
Authorization: Bearer <your_token>

```

Passwords are hashed with bcryptjs before saving.

Role-based access control via middleware.


### ✅ Zod Validation
All incoming data (e.g., registration, login, parcel creation) is validated using Zod schemas before hitting the controller.

Example Zod validation for a user:

```bash
import { z } from 'zod';

export const createUserZodSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['SENDER', 'RECEIVER']),
  }),
});

```
### 🔁 Parcel Status Logs
Each parcel contains a statusLogs array to track its full journey. Each log contains:

```bash
statusLogs: [
  {
    status: 'PICKED' | 'IN_TRANSIT' | 'DELIVERED' | ...,
    location: 'Dhaka Hub',
    note: 'Parcel left the station',
    timestamp: Date,
    updatedBy: UserID or 'SYSTEM'
  }
]


```

Accessible via:

```bash

GET /api/parcels/:id/status-log

```

### 👤 Sender / Receiver Capabilities
## Sender can:
Register, login

Create parcels

Cancel parcels (if not dispatched)

View all their sent parcels and history

## Receiver can:
Register, login

View incoming parcels

Confirm delivery

View delivery history

## 🛡️ Admin Capabilities
View and manage all users

Block or unblock parcels or users

Update parcel status at any time

Assign delivery status (like DISPATCHED, DELIVERED)

Full visibility across the system

### 🔍 Parcel Tracking Format
Every parcel has a unique tracking ID like:

```bash
TRK-20250802-000001

```

Searchable via:

```bash
GET /api/parcels/tracking/:trackingId

```

### 📦 Example Parcel Schema (Simplified)

```bash

{
  _id: ObjectId,
  trackingId: string,
  senderId: ObjectId,
  receiverId: ObjectId,
  type: 'Document' | 'Box',
  weight: number,
  deliveryAddress: string,
  fee: number,
  status: 'REQUESTED' | 'DISPATCHED' | 'DELIVERED',
  isBlocked: boolean,
  statusLogs: [ ... ]
}
````

