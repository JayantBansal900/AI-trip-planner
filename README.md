# ✈️ PushpakUdaan

[![CI](https://github.com/JayantBansal900/AI-trip-planner/actions/workflows/ci.yml/badge.svg)](https://github.com/JayantBansal900/AI-trip-planner/actions/workflows/ci.yml)

### Plan smarter. Travel better.

PushpakUdaan is an AI-powered trip planner that creates personalized travel itineraries based on a user's destination, trip duration, budget, travel group, and interests.

Instead of providing a generic list of places, PushpakUdaan generates a structured day-by-day travel plan with hotel suggestions, activities, estimated expenses, and useful travel tips.

---

## ✨ Features

- Personalized trip planning based on destination, duration, budget, travel group, and interests
- AI-generated day-by-day itineraries using Google Gemini
- Morning, afternoon, and evening activity planning
- Hotel recommendations based on the selected budget
- Estimated trip budget breakdown
- Destination-specific travel tips
- Explore popular destinations such as Goa, Manali, Jaipur, Bali, Paris, and Tokyo
- Edit preferences and regenerate itineraries
- Save trips directly in the browser
- View and delete previously saved trips
- Responsive design for mobile, tablet, and desktop
- Secure server-side Gemini API integration with input validation and rate limiting
- Automatic fallback between Gemini models

---

## 🛠️ Tech Stack

### Frontend

- React 18
- JavaScript
- Vite
- Tailwind CSS
- Shadcn UI
- Lucide React

### Backend

- Node.js
- Express.js

### AI

- Google Gemini API
- `@google/genai`

### Storage

- Browser LocalStorage

### Development Tools

- npm
- ESLint
- Git & GitHub

---

## ⚙️ How It Works

```text
User enters trip preferences
        ↓
React Trip Planner
        ↓
POST /api/itinerary/generate
        ↓
Express Backend
        ↓
Google Gemini API
        ↓
Structured itinerary response
        ↓
Trip Result Page
        ↓
Optional Save to LocalStorage
        ↓
My Trips
```

The Gemini API key is handled only by the backend and is never exposed to the React frontend.

---

## 📁 Project Structure

```text
AI-trip-planner/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── assets/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── itinerary/
│   │   │   ├── BudgetBreakdown.jsx
│   │   │   ├── DayItinerary.jsx
│   │   │   └── HotelCard.jsx
│   │   │
│   │   ├── ui/
│   │   │   ├── button.jsx
│   │   │   └── button-variants.js
│   │   │
│   │   ├── BrandLogo.jsx
│   │   ├── DestinationCard.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   └── SavedTripCard.jsx
│   │
│   ├── data/
│   │   └── destinations.js
│   │
│   ├── lib/
│   │   └── utils.js
│   │
│   ├── pages/
│   │   ├── Explore.jsx
│   │   ├── Home.jsx
│   │   ├── MyTrips.jsx
│   │   ├── PlanTrip.jsx
│   │   └── TripResult.jsx
│   │
│   ├── services/
│   │   ├── tripService.js
│   │   └── tripStorageService.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── LICENSE
├── index.html
├── package.json
├── server.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js 20.12 or later
- npm
- A Google Gemini API key

---

### 1. Clone the Repository

```bash
git clone https://github.com/JayantBansal900/AI-trip-planner.git
cd AI-trip-planner
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file from the provided example.

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux**

```bash
cp .env.example .env
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> Never commit your `.env` file or API key to GitHub.

Optional settings (also listed in `.env.example`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `GEMINI_MODEL` | `gemini-flash-latest,gemini-flash-lite-latest` | Comma-separated Gemini models, tried in order |
| `RATE_LIMIT_PER_MINUTE` | `5` | Max trip requests per IP address per minute |
| `PORT` | `3000` | Server port |

### 4. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 📦 Production Build

Create the optimized frontend build:

```bash
npm run build
```

Start the application:

```bash
npm start
```

`npm start` runs the Express server in production mode, serving both the built frontend from `dist/` and the itinerary API.

---

## 💾 Saving Trips

PushpakUdaan uses browser `localStorage` to save generated itineraries.

This keeps the project simple and removes the need for authentication or a database.

Saved trips can be:

- viewed instantly without calling Gemini again
- reopened after refreshing the browser
- deleted from the My Trips page

Because the data is stored locally, saved trips do not sync between devices or browsers.

---

## 🔐 Security

The Gemini API key is never included in the frontend application.

All AI requests follow this architecture:

```text
React Frontend
      ↓
Express Backend
      ↓
Gemini API
```

The API key is stored as an environment variable:

```env
GEMINI_API_KEY=...
```

The `.env` file is excluded from Git using `.gitignore`.

The API also:

- accepts only the budget, travel group and interest options offered in the form
- limits each IP address to a few trip requests per minute to protect the Gemini quota
- checks the AI response and retries with the next model if it is incomplete

---

## ⚠️ Limitations

- Hotel and activity prices are estimates and not live booking prices.
- Saved trips are stored only in the current browser.
- The application does not currently include user accounts.
- Flight and hotel bookings are not performed through the application.
- Travel information such as visa rules, opening hours, and transportation schedules should be verified before travelling.

---

## 🔮 Future Improvements

- User authentication and cloud-synced trips
- Interactive maps for itinerary locations
- Real-time weather information
- Live hotel and flight data
- PDF itinerary export
- Calendar integration

---

## 👨‍💻 Author

**Jayant Bansal**

Built as a full-stack project exploring React, Node.js, Express, and Generative AI integration.

---

## ⭐ Support

If you found this project useful, consider giving the repository a star.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
