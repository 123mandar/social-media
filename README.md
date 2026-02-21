# Property Deal Tracker (Full Stack)

A full-stack real-estate **Property Deal Tracker** that helps investors evaluate and manage property opportunities.

## Tech Stack

- **Frontend:** React + Tailwind CSS + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt password hashing
- **Charts:** Chart.js via react-chartjs-2

---

## Features

### 1) Authentication
- Signup with name/email/password
- Login/logout
- Password hashing via bcrypt
- JWT auth middleware
- Users only access their own properties

### 2) Property CRUD
- Create property deal with title, location, price, builder, ROI, type, status, notes
- Read dashboard table with filtering, searching, sorting
- Update property via modal form
- Delete property with confirmation

### 3) Dashboard UI
- Sidebar + top navbar
- KPI cards (Total, Interested, Bought, Avg ROI)
- Table with color-coded status badges

### 4) Analytics
- Doughnut chart: property count by status
- Bar chart: ROI comparison

### 5) Extras
- Form validation (frontend + backend)
- Loading states
- Toast notifications
- Dark mode toggle
- Export properties to CSV

---

## Production-ready Folder Structure

```bash
.
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── utils/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── README.md
```

---

## Environment Variables

### Server (`server/.env`)
Copy `server/.env.example`:

```bash
cp server/.env.example server/.env
```

Then verify values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/property_deal_tracker
JWT_SECRET=change-me-in-production
CLIENT_URL=http://localhost:5173
```

If you run `node server.js` from inside `server/`, this `.env` file must exist or Mongo will use local fallback defaults.

If Mongo still prints `uri ... got "undefined"`, your local code is outdated. Update and re-check scripts:

```bash
git pull
npm run
```

Also ensure `server/.env` contains a real URI string (not `MONGO_URI=undefined`).

### Client (`client/.env`)
Copy `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Installation

```bash
# from repo root
npm run install:all
```

If your Windows Git Bash/npm setup throws this error:

```
npm ERR! Cannot read properties of undefined (reading "stdin")
```

run installs one-by-one instead:

```bash
npm run install:server
npm run install:client
```

If you get `Missing script: "install:server"` or `"install:client"`, your local clone is likely behind.

```bash
git pull
npm run
```

Then retry. If you still prefer not to use npm scripts, run direct installs:

```bash
cd server && npm install
cd ../client && npm install
```

If npm itself crashes with `stdin` errors during **run** commands, start processes directly with Node:

```bash
# backend
cd server && node server.js

# frontend (new terminal)
cd client && node node_modules/vite/bin/vite.js
```

---

## Run locally


### Terminal 1
```bash
npm run dev:server
```

If npm still throws a Windows stdin error while running scripts, start backend directly:

```bash
cd server
node server.js
```

### Terminal 2
```bash
npm run dev:client
```

If npm throws a Windows stdin error while starting Vite, run client directly without npm:

```bash
cd client
node node_modules/vite/bin/vite.js
```

Open: `http://localhost:5173`

---

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Properties
- `GET /api/properties`
- `POST /api/properties`
- `PUT /api/properties/:id`
- `DELETE /api/properties/:id`
- `GET /api/properties/analytics`
- `GET /api/properties/export/csv`

---

## Deployment (Render + Vercel)

### Option A: Deploy backend on Render
1. Create a new **Web Service** from this repo.
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `.env.example`.
6. Allow MongoDB Atlas IP / use 0.0.0.0/0 for testing.

### Option B: Deploy frontend on Vercel
1. Import this repo in Vercel.
2. Root directory: `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set `VITE_API_URL` to your Render backend URL + `/api`.

### CORS tip
Update `CLIENT_URL` in backend env to your frontend domain.

---

## Beginner-friendly notes
- Start with backend `.env` setup and database connection.
- Test auth first, then property CRUD.
- Use browser dev tools to inspect API errors and toasts.

