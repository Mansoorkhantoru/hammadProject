<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ad6d5cbf-df1f-48fe-aa99-bccadf3ef2c9" />
# 💊 MERN Stack Online Pharmacy & Prescription E-Commerce Platform

A specialized online pharmacy and medicine delivery platform built using the MERN stack (MongoDB, Express.js, React, Node.js). The system features mandatory prescription-based ordering, product management, and real-time order tracking for customers and store administrators.

---

## 🌟 Key Features

### 🛒 Client / Customer Side
* **Medicine Catalog:** Browse and search for medicines, healthcare products, and medical supplies.
* **Mandatory Prescription Upload:** Strict validation requiring customers to upload a valid prescription file (PDF or Image) before placing an order.
* **Order Placement:** Seamless checkout process connected directly with prescription verification.
* **Live Order Tracking:** Track the status of your order in real-time (e.g., *Prescription Review*, *Approved*, *Processing*, *Shipped*, *Delivered*).

### 🛠️ Admin Panel
* **Product Management:** Full CRUD operations — add, edit, view, and delete medicines, stock counts, and pricing.
* **Prescription & Order Verification:** Review uploaded customer prescriptions alongside incoming orders before approving and fulfilling them.
* **Order Status Updates:** Update order statuses instantly so clients can monitor their delivery progress.

---

## 🏗️ Tech Stack

* **Frontend:** React.js, React Router, Tailwind CSS / Bootstrap
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **File Uploads:** Multer / Cloudinary (for storing prescriptions and medicine images)
* **Authentication:** JSON Web Tokens (JWT) & bcrypt

---

## 🔒 Mandatory Prescription Workflow

```text
[ Client ] Selects Medicines ➔ Uploads Prescription (Required) ➔ Places Order
                                                                        │
                                                                        ▼
[ Admin Panel ] Reviews Prescription ➔ Approves / Rejects ➔ Updates Order Status
                                                                        │
                                                                        ▼
[ Client Dashboard ] Views Live Order Status Updates (Dispatched / Delivered)
