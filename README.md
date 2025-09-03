## AI-Powered Crop Yield Prediction & Optimization

A simple full-stack app: static HTML/CSS/JS frontend and Node.js/Express backend. Predicts crop yield from soil and weather, and suggests irrigation, fertilization, and pest management tips.

### Features
- Prediction API with validation
- Weather integration via Open-Meteo (no API key)
- Heuristic model placeholder (replace with ML later)
- Actionable recommendations
- Multilingual UI (English, Hindi)

### Quick Start

Prerequisite: Node.js 18+

Install
```bash
cd backend
npm install
```

Run backend
```bash
npm run dev
```
Server: `http://localhost:4000`

Open frontend
- Open `frontend/index.html` directly in a browser
- Or serve statically and set CORS accordingly

### API
POST `/api/predict`
```json
{
  "crop": "wheat",
  "region": "Maharashtra",
  "sowingDate": "2025-01-01",
  "areaHectares": 1.5,
  "soil": { "nitrogen": 40, "phosphorus": 30, "potassium": 35, "ph": 6.5, "organicMatter": 2.5 },
  "location": { "lat": 19.076, "lon": 72.8777 }
}
```

### Notes
- Model is heuristic; replace with trained regression/NN and data persistence.
- For production, serve frontend via the backend and enable HTTPS and stricter CORS.

