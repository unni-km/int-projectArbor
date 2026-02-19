# 🧾 Inventory Management System

A full-stack web application for managing inventory and pantry stock with admin approval via email.

---

## 🚀 Features

- ✅ User login and authentication
- 📦 Inventory and Pantry management
- 🔄 Move items from Inventory to Pantry
- 📧 Email notification to Admin with **Approve/Reject** links
- 🔐 Admin approval with password authentication
- 📉 Inventory stock is reduced only after approval
- 📊 Transaction history (Approved status only)
- 🐳 Dockerized deployment for easy setup

---

## 📁 Folder Structure

```
inventory-management/
├── backend/         # Node.js + Express + MySQL
├── client/          # React.js
├── mysql_data/      # MySQL data volume
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Other |
|----------|---------|----------|-------|
| React.js | Node.js | MySQL    | Nodemailer, Docker |

---

## 🔧 How to Run Locally with Docker

### 1. Clone the repo

```bash
git clone https://github.com/your-username/inventory-management.git
cd inventory-management
```



> ⚠️ Update your actual email and password (or use an app password if using Gmail).

### 2. Start the project using Docker

```bash
docker-compose up --build
```

### 3. Access the app

- Frontend: http://localhost:3000
- Backend API: http://localhost:8800
- MySQL: localhost:3306 (username: `root`, password: `admin`)

---

## 📮 Email Notification Flow

Admin will receive an email like:

```html
User <strong>JohnDoe</strong> requested to move the following items:
- Item: Rice, Quantity: 5
[✅ Approve] [❌ Reject]
```

---

## ✅ Admin Approval

- Admin clicks **Approve/Reject**
- Enters password in the form
- On **Approve**: quantity is deducted from `m_inventory`
- On **Reject**: no change to stock

---

## 🔄 Deploy to Another System

### Option 1: Using Git

1. Clone the repo on the new system:
   ```bash
   git clone https://github.com/your-username/inventory-management.git
   cd inventory-management
   ```

2. Set up `.env`, then run:
   ```bash
   docker-compose up --build
   ```

### Option 2: Using Docker Hub

1. Push Docker images from the current system:
   ```bash
   docker tag your_image your_dockerhub_username/inventory-management
   docker push your_dockerhub_username/inventory-management
   ```

2. On another system, pull and run:
   ```bash
   docker pull your_dockerhub_username/inventory-management
   ```

---

## 🗃️ Transfer Database to Another System

### Export:
```bash
docker exec -i your_mysql_container_name \
  mysqldump -uroot -padmin inventorymanagement > backup.sql
```

### Import:
```bash
docker cp backup.sql new_mysql_container:/backup.sql
docker exec -i new_mysql_container \
  mysql -uroot -padmin inventorymanagement < /backup.sql
```

--
