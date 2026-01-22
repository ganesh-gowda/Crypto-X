# CryptoX

CryptoX is a modern crypto dashboard that keeps prices, markets, news, and your personal portfolio in one clean UI. It’s built to feel fast, smooth, and friendly to use, with glassmorphism styling, 3D-style icons, and animated interactions throughout the app.

## What you can do

- Track real-time cryptocurrency prices and market stats
- Browse detailed coin charts and key metrics
- Read the latest crypto news
- Manage a simple portfolio and price alerts
- Use a fully responsive interface that works across devices

## Tech stack

**Frontend**
- React + Vite
- Tailwind CSS
- Framer Motion animations
- Chart.js + react-chartjs-2

**Backend**
- Node.js + Express
- MongoDB (Atlas)
- JWT authentication
- bcryptjs for password hashing

**Data & APIs**
- CoinGecko (market data)
- CryptoCompare (news)

**Deployment**
- Vercel (frontend)
- Render (backend)

## Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Set up environment variables

Create a `.env` file in the project root for both frontend and backend values. Example keys:

```bash
# Frontend
VITE_API_URL=
VITE_API_HOST=
VITE_API_KEY=

# Backend
MONGODB_URI=
DB_NAME=cryptox
JWT_SECRET=your_jwt_secret
```

> If you’re running the backend separately, the server reads from the same root `.env` file.

### 3) Run the app locally

Start the backend:

```bash
npm run server
```

Start the frontend (in another terminal):

```bash
npm run dev
```

The app will be available at the Vite URL shown in the terminal (usually http://localhost:5173).

## Production build

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

## Notes

- If you deploy the frontend to Vercel, make sure you’ve set `VITE_API_URL` in Vercel Environment Variables.
- If you deploy the backend to Render, set `MONGODB_URI`, `DB_NAME`, and `JWT_SECRET` there too.
