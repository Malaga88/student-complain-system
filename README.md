# Online Students' Complaint System

Final year project — Design and Implementation of an Online Students' Complaint System.
Built with **Node.js, Express, MongoDB (Mongoose), EJS, HTML/CSS**.

Students submit and track complaints (hostel, academic, welfare, harassment, other).
Staff see every complaint in one dashboard, respond, and update status
(pending → in progress → resolved).

## 1. Requirements

- Node.js 18+ (you have v22, that's fine)
- MongoDB — either:
  - installed locally (`mongod` running on `localhost:27017`), or
  - a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (cloud, no install needed)

## 2. Setup

```bash
cd complaint-system
npm install
cp .env.example .env
```

Open `.env` and set `MONGODB_URI`:

```
# Local MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/complaint_system

# OR MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/complaint_system
```

Also change `SESSION_SECRET` to any random string.

## 3. Create a staff account

Student accounts are made by registering on the site. Staff accounts are
provisioned separately (so students can't grant themselves staff access).
Run the seed script once to create a starter staff login:

```bash
npm run seed
```

This creates:
- **Email:** `staff@atbu.edu.ng`
- **Password:** `staffpass123`

Change this password after your first login, or edit `seed.js` before running it
if you'd rather seed different staff details.

## 4. Run it

```bash
npm start
```

Visit **http://localhost:3000**.

- Register as a student → submit a complaint → track its status.
- Log in with the staff account above → see all complaints → respond and update status.

For development (auto-restart on file changes):

```bash
npm run dev
```

## 5. Project structure

```
complaint-system/
├── server.js              Express app entry point
├── seed.js                 Creates the starter staff account
├── config/db.js            MongoDB connection (Mongoose)
├── models/
│   ├── User.js              Students and staff
│   └── Complaint.js         Complaints + embedded staff responses
├── middleware/auth.js      Session-based login guard (requireRole)
├── routes/
│   ├── auth.js              Home, register, login, logout
│   ├── student.js           Student dashboard, submit/view complaint
│   └── staff.js             Staff dashboard, view/respond/update status
├── views/                   EJS templates (server-rendered HTML)
└── public/css/style.css    All styling
```

## 6. How the pieces map to the proposal

| Proposal objective | Where it's implemented |
|---|---|
| Student submits a complaint online | `routes/student.js` → `POST /student/complaints/new` |
| Student tracks complaint progress | `routes/student.js` → `GET /student/complaints/:id` |
| Staff dashboard, view/respond/resolve | `routes/staff.js` + `views/staff/*` |
| Testing (valid/missing input, etc.) | Manual test cases below — write these up in Chapter 4 |

## 7. Suggested manual test cases (for your Chapter 4 write-up)

1. Register a student with a duplicate email → should show an error, not crash.
2. Submit a complaint with a missing field → form re-shows with an error, no data lost.
3. Submit a valid complaint → appears immediately on the student dashboard as "pending".
4. Log in as staff → same complaint appears on the staff dashboard.
5. Staff sends a response → student sees it on their complaint page.
6. Staff changes status to "resolved" → status pill updates on both dashboards.
7. Try visiting `/staff/dashboard` while logged in as a student → redirected to login (role check).
8. Log out → try visiting `/student/dashboard` directly → redirected to login (session check).

## 8. Notes for your report

- Passwords are hashed with **bcrypt** before being stored — never saved as plain text.
- Sessions are stored server-side in MongoDB via `connect-mongo`, not just in a cookie.
- All database queries use Mongoose, which parameterizes queries and helps prevent
  injection attacks — worth a line in your security/discussion section.
