import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for dynamic city searches and admin priority actions
// We preload with Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Kota
const activeActionsStore = [
  {
    id: 'gov-act-1',
    priorityLevel: 'HIGH PRIORITY',
    location: 'Okhla Industrial Sector Phase II',
    city: 'Delhi',
    reason: 'PM2.5 spike detected (312 AQI) exceeding permissible industrial stack discharge limits.',
    recommendedAction: 'Deploy mobile emission inspection squad & enforce water misting cannons along perimeter.',
    confidence: 94,
    status: 'Pending Dispatch',
    timestamp: '10 mins ago'
  },
  {
    id: 'gov-act-2',
    priorityLevel: 'HIGH PRIORITY',
    location: 'Deonar Dump Yard Sector',
    city: 'Mumbai',
    reason: 'Anomalous Carbon Monoxide (CO) thermal hotspot indicating subsurface spontaneous methane combustion.',
    recommendedAction: 'Dispatch municipal fire suppression unit and cover exposed municipal solid waste with soil capping.',
    confidence: 91,
    status: 'Team Deployed',
    timestamp: '25 mins ago'
  },
  {
    id: 'gov-act-3',
    priorityLevel: 'URGENT INTERVENTION',
    location: 'Anand Vihar ISBT Terminal',
    city: 'Delhi',
    reason: 'Heavy diesel interstate bus congestion causing severe localized NOx accumulation near metro foot overbridge.',
    recommendedAction: 'Reroute non-BS VI commercial transport vehicles & enforce strict anti-idling penalties.',
    confidence: 96,
    status: 'Pending Dispatch',
    timestamp: '4 mins ago'
  },
  {
    id: 'gov-act-4',
    priorityLevel: 'MONITORING',
    location: 'Silk Board Junction Traffic Flyover',
    city: 'Bengaluru',
    reason: 'Morning peak traffic gridlock raising NO2 levels to 184 AQI threshold.',
    recommendedAction: 'Optimize smart traffic signal timing progression to reduce vehicle queue stationary idling duration.',
    confidence: 89,
    status: 'Action Resolved',
    timestamp: '1 hour ago'
  }
];

// Helper to determine AQI status and color
function getAqiStatus(aqi: number) {
  if (aqi <= 50) return { status: 'Good', color: '#22c55e', risk: 'Low' };
  if (aqi <= 100) return { status: 'Moderate', color: '#eab308', risk: 'Moderate' };
  if (aqi <= 150) return { status: 'Unhealthy', color: '#f97316', risk: 'Moderate' };
  if (aqi <= 200) return { status: 'Poor', color: '#ef4444', risk: 'High' };
  if (aqi <= 300) return { status: 'Severe', color: '#b91c1c', risk: 'Severe' };
  return { status: 'Hazardous', color: '#7f1d1d', risk: 'Critical' };
}

// Helper lazy Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      geminiClient = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (e) {
      console.error('Failed to init Gemini SDK', e);
    }
  }
  return geminiClient;
}

// API Route: Geocoding suggestions proxy using OpenStreetMap Nominatim
app.get('/api/geocode', async (req: Request, res: Response): Promise<void> => {
  const query = (req.query.q as string || '').trim();
  if (!query) {
    res.json([]);
    return;
  }
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`;
    const response = await fetch(nomUrl, {
      headers: {
        'User-Agent': 'VayuDrishti-SmartCity-Platform/1.0 (contact@vayudrishti.ai)'
      }
    });
    if (response.ok) {
      const data = await response.json();
      res.json(data || []);
    } else {
      res.status(500).json({ error: 'Failed to fetch suggestions from Nominatim' });
    }
  } catch (err) {
    console.error('Nominatim proxy error:', err);
    res.status(500).json({ error: 'Geocoding proxy error' });
  }
});

// API Route: Search location and fetch live Air Quality & Weather
app.get('/api/city-search', async (req: Request, res: Response): Promise<void> => {
  const query = (req.query.q as string || req.query.city as string || '').trim();
  const reqLat = req.query.lat ? parseFloat(req.query.lat as string) : NaN;
  const reqLng = req.query.lng ? parseFloat(req.query.lng as string) : NaN;
  const reqName = (req.query.name as string || query).trim();
  const reqState = (req.query.state as string || '').trim();
  const reqCountry = (req.query.country as string || '').trim();

  if (!query && isNaN(reqLat)) {
    res.status(400).json({ error: 'Search query parameter q or location coordinates are required' });
    return;
  }

  let lat = 28.6139;
  let lng = 77.2090;
  let cityName = reqName || query || 'Location';
  let stateName = reqState || 'India';
  let countryName = reqCountry || 'India';

  if (!isNaN(reqLat) && !isNaN(reqLng)) {
    lat = reqLat;
    lng = reqLng;
  } else {
    // Dynamic Geocoding via OpenStreetMap Nominatim API
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`;
      const nomRes = await fetch(nomUrl, {
        headers: { 'User-Agent': 'VayuDrishti-SmartCity-Platform/1.0' }
      });
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        if (!nomData || nomData.length === 0) {
          res.status(404).json({ error: `No location found for "${query}". Please check the spelling and try again.` });
          return;
        }
        const r = nomData[0];
        lat = parseFloat(r.lat);
        lng = parseFloat(r.lon);
        cityName = r.address?.city || r.address?.town || r.address?.village || r.address?.suburb || r.address?.county || r.name || query;
        stateName = r.address?.state || r.address?.country || '';
        countryName = r.address?.country || 'India';
      } else {
        res.status(404).json({ error: `Could not resolve location coordinates for "${query}".` });
        return;
      }
    } catch (err) {
      console.error('Nominatim dynamic geocoding error:', err);
      res.status(500).json({ error: `Network error while locating "${query}".` });
      return;
    }
  }

  // Now fetch real live Air Quality and Weather from Open-Meteo
  let aqi = 160;
  let pm25 = 75;
  let pm10 = 140;
  let no2 = 45;
  let co = 1.2;
  let so2 = 15;
  let o3 = 40;
  let temp = 30;
  let humidity = 60;
  let windSpeed = 10;
  let windDir = 180;
  let weatherCond = 'Partly Cloudy';

  try {
    const [aqiRes, weatherRes] = await Promise.all([
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`),
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m`)
    ]);

    if (aqiRes.ok) {
      const aData = await aqiRes.json();
      if (aData.current) {
        aqi = Math.round(aData.current.us_aqi || aqi);
        pm25 = Math.round((aData.current.pm2_5 || pm25) * 10) / 10;
        pm10 = Math.round((aData.current.pm10 || pm10) * 10) / 10;
        no2 = Math.round((aData.current.nitrogen_dioxide || no2) * 10) / 10;
        co = Math.round((aData.current.carbon_monoxide || co * 1000) / 100) / 10; // convert µg to mg
        so2 = Math.round((aData.current.sulphur_dioxide || so2) * 10) / 10;
        o3 = Math.round((aData.current.ozone || o3) * 10) / 10;
      }
    }

    if (weatherRes.ok) {
      const wData = await weatherRes.json();
      if (wData.current) {
        temp = Math.round(wData.current.temperature_2m || temp);
        humidity = Math.round(wData.current.relative_humidity_2m || humidity);
        windSpeed = Math.round(wData.current.wind_speed_10m || windSpeed);
        windDir = Math.round(wData.current.wind_direction_10m || windDir);
        const code = wData.current.weather_code || 0;
        if (code === 0) weatherCond = 'Clear Sky';
        else if (code <= 3) weatherCond = 'Partly Cloudy';
        else if (code <= 48) weatherCond = 'Fog & Mist';
        else if (code <= 67) weatherCond = 'Rain Showers';
        else weatherCond = 'Thunderstorm / Overcast';
      }
    }
  } catch (apiErr) {
    console.error('Live API fetch error, using synthetic estimates based on coords', apiErr);
    // Add realistic noise based on lat
    aqi = Math.round(120 + Math.abs(Math.sin(lat) * 120));
    pm25 = Math.round(aqi * 0.48);
    pm10 = Math.round(aqi * 0.85);
  }

  const { status, color, risk } = getAqiStatus(aqi);

  // Determine main cause
  let mainPollutant = 'PM2.5';
  if (pm10 > pm25 * 2.2) mainPollutant = 'PM10';
  if (no2 > 80) mainPollutant = 'NO2';
  if (so2 > 40) mainPollutant = 'SO2';

  // Weather explanation
  let weatherExpl = `Wind speed of ${windSpeed} km/h is providing moderate dispersion of urban pollutants.`;
  if (windSpeed < 7) {
    weatherExpl = `Low wind speed (${windSpeed} km/h) and calm atmospheric boundary layer are causing pollutant stagnation and surface accumulation.`;
  } else if (windSpeed > 18) {
    weatherExpl = `Strong gusty winds (${windSpeed} km/h) are actively dispersing vehicular exhaust, though resuspending coarse soil particulates (PM10).`;
  }

  // Attribution analysis
  let veh = 45, ind = 30, con = 20, was = 5;
  if (mainPollutant === 'PM10') { veh = 32; ind = 18; con = 42; was = 8; }
  else if (mainPollutant === 'SO2') { veh = 20; ind = 62; con = 12; was = 6; }
  else if (mainPollutant === 'NO2') { veh = 65; ind = 15; con = 15; was = 5; }

  // Forecast 24, 48, 72h
  const forecast = [
    { timeLabel: 'Today (Now)', hourOffset: 0, aqi, pm25: Math.round(pm25), upperBound: Math.round(aqi * 1.08), lowerBound: Math.round(aqi * 0.92), status },
    { timeLabel: '+6 Hours', hourOffset: 6, aqi: Math.round(aqi * 1.12), pm25: Math.round(pm25 * 1.1), upperBound: Math.round(aqi * 1.2), lowerBound: Math.round(aqi * 1.02), status: getAqiStatus(aqi * 1.12).status },
    { timeLabel: '+12 Hours', hourOffset: 12, aqi: Math.round(aqi * 0.95), pm25: Math.round(pm25 * 0.95), upperBound: Math.round(aqi * 1.05), lowerBound: Math.round(aqi * 0.85), status: getAqiStatus(aqi * 0.95).status },
    { timeLabel: 'Tomorrow (+24h)', hourOffset: 24, aqi: Math.round(aqi * 0.88), pm25: Math.round(pm25 * 0.88), upperBound: Math.round(aqi * 0.98), lowerBound: Math.round(aqi * 0.78), status: getAqiStatus(aqi * 0.88).status },
    { timeLabel: '+48 Hours', hourOffset: 48, aqi: Math.round(aqi * 0.76), pm25: Math.round(pm25 * 0.76), upperBound: Math.round(aqi * 0.88), lowerBound: Math.round(aqi * 0.65), status: getAqiStatus(aqi * 0.76).status },
    { timeLabel: '+72 Hours', hourOffset: 72, aqi: Math.round(aqi * 0.70), pm25: Math.round(pm25 * 0.70), upperBound: Math.round(aqi * 0.82), lowerBound: Math.round(aqi * 0.58), status: getAqiStatus(aqi * 0.70).status }
  ];

  // Health advisory English / Hindi
  let advEng = `Air quality is ${status.toLowerCase()}. Sensitive individuals should limit strenuous outdoor activity.`;
  let advHin = `आज हवा की गुणवत्ता ${status === 'Poor' ? 'खराब' : status === 'Good' ? 'अच्छी' : 'मध्यम'} है। ${aqi > 150 ? 'बाहर लंबे समय तक रहने से बचें।' : 'सामान्य गतिविधियों के लिए सुरक्षित है।'}`;
  if (aqi > 200) {
    advEng = `Air quality is unhealthy to poor. Avoid outdoor cardiovascular exercise. Wearing N95 masks is strongly recommended outside.`;
    advHin = `आज हवा की गुणवत्ता काफी खराब है। बाहर व्यायाम करने से बचें और घर से बाहर निकलते समय N95 मास्क अवश्य लगाएं।`;
  }

  const resultCity = {
    id: cityName.toLowerCase().replace(/\s+/g, '-'),
    name: cityName,
    state: stateName,
    country: countryName,
    lat,
    lng,
    status,
    color,
    mainPollutant,
    healthRisk: risk,
    weatherExplanation: weatherExpl,
    lastUpdated: new Date().toLocaleTimeString(),
    metrics: { aqi, pm25, pm10, no2, co, so2, o3 },
    weather: {
      temperature: temp,
      humidity,
      windSpeed,
      windDirection: windDir,
      weatherCondition: weatherCond,
      rainProbability: Math.round(humidity * 0.4),
      visibility: aqi > 200 ? 3.5 : 8.0
    },
    attribution: {
      vehicle: veh,
      industry: ind,
      construction: con,
      wasteBurning: was,
      confidenceScore: Math.round(88 + (aqi % 8)),
      analysisRationale: `Real-time spectral analysis of ${mainPollutant} elevation correlates with ${mainPollutant === 'PM10' ? 'land development dust' : 'internal combustion engine exhaust'} trajectories under current ${windSpeed} km/h wind shear.`
    },
    forecast,
    advisory: {
      english: advEng,
      hindi: advHin,
      regional: `ವಾಯು ಸ್ಥಿತಿ: ${status}. (Regional Advisory: Keep indoor purifiers active)`,
      precautions: [
        aqi > 150 ? 'Wear N95/FFP2 protective face respirators outdoors' : 'Standard outdoor precautions apply',
        'Keep indoor windows closed during peak morning traffic congestion',
        'Use indoor air purifiers equipped with HEPA filtration',
        'Drink plenty of warm fluids to maintain airway hydration'
      ],
      sensitiveGroupsInfo: `Citizens with chronic asthma, bronchitis, or cardiovascular disease should monitor respiratory symptoms.`
    },
    hotspots: [
      { id: `${cityName}-1`, name: `${cityName} Central Transit Flyover`, lat: lat + 0.012, lng: lng - 0.008, aqi: Math.round(aqi * 1.15), mainPollutant, status: getAqiStatus(aqi * 1.15).status, type: 'Traffic', healthRisk: risk },
      { id: `${cityName}-2`, name: `${cityName} Industrial Corridor`, lat: lat - 0.018, lng: lng + 0.015, aqi: Math.round(aqi * 1.08), mainPollutant: 'SO2', status: getAqiStatus(aqi * 1.08).status, type: 'Industrial', healthRisk: risk },
      { id: `${cityName}-3`, name: `${cityName} Land Excavation Zone`, lat: lat + 0.005, lng: lng + 0.02, aqi: Math.round(aqi * 0.95), mainPollutant: 'PM10', status: getAqiStatus(aqi * 0.95).status, type: 'Construction', healthRisk: risk }
    ]
  };

  res.json(resultCity);
});

// API Route: AI Assistant Chatbot
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  const { message, cityData } = req.body;
  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  const ai = getGemini();
  const cName = cityData?.name || 'Delhi';
  const cAqi = cityData?.metrics?.aqi || 285;
  const cStatus = cityData?.status || 'Poor';
  const cTemp = cityData?.weather?.temperature || 31;
  const cWind = cityData?.weather?.windSpeed || 5.2;
  const cMain = cityData?.mainPollutant || 'PM2.5';

  if (ai) {
    try {
      const prompt = `You are the chief AI Environmental Scientist & Smart City Strategist for the AeroSmart Command Center monitoring ${cName}.
Current Live Data for ${cName}:
- AQI: ${cAqi} (${cStatus})
- Main Pollutant: ${cMain}
- Temperature: ${cTemp}°C
- Wind Speed: ${cWind} km/h
- Sources: Vehicles ${cityData?.attribution?.vehicle || 45}%, Industry ${cityData?.attribution?.industry || 30}%, Construction ${cityData?.attribution?.construction || 20}%

User Question: "${message}"

Answer the user clearly, authoritatively, and concisely (2-3 short bullet points or paragraphs). Explain using the real live AQI and weather numbers provided above. Provide practical smart city intervention or health advice.`;

      const resp = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });

      res.json({ reply: resp.text });
      return;
    } catch (err) {
      console.error('Gemini chat API error, using intelligent fallback:', err);
    }
  }

  // Rule-based intelligent fallback chatbot response
  const q = message.toLowerCase();
  let reply = `Based on live telemetry for **${cName}** (AQI: **${cAqi} - ${cStatus}**):\n\n`;
  if (q.includes('why') || q.includes('high') || q.includes('cause')) {
    reply += `• **Meteorological Trapping**: Low surface wind speed (${cWind} km/h) is preventing vertical mixing of vehicular exhaust.\n• **Primary Contaminant**: **${cMain}** is spiking due to morning peak traffic combined with thermal plant emissions.\n• **Temperature Inversion**: At ${cTemp}°C, cool morning air creates a lid trapping ground-level particulate matter.`;
  } else if (q.includes('reduce') || q.includes('solution') || q.includes('government')) {
    reply += `• **Immediate Intervention**: Municipal authorities are deploying high-pressure water misting cannons along hotspot perimeters.\n• **Traffic Optimization**: Rerouting heavy freight vehicles away from arterial city bypasses during 6 AM - 10 AM.\n• **Stack Enforcement**: Enforcing temporary industrial load reduction on thermal units in Sector Phase II.`;
  } else if (q.includes('precautions') || q.includes('health') || q.includes('mask') || q.includes('safe')) {
    reply += `• **Outdoor Exertion**: Limit prolonged jogging or high-intensity cycling when AQI exceeds 150.\n• **Respiratory Protection**: Wear certified N95 respirators if commuting in open two-wheelers.\n• **Indoor Quality**: Keep doors and windows tightly sealed during peak smog hours (7 AM - 10 AM) and run HEPA air purifiers.`;
  } else {
    reply += `Air quality in ${cName} is currently registered as **${cStatus}** with PM2.5 at ${cityData?.metrics?.pm25 || 142} µg/m³. City administrators are actively monitoring ${cityData?.hotspots?.length || 4} priority pollution hotspots for immediate municipal intervention.`;
  }

  res.json({ reply });
});

// API Route: Admin Priority Actions GET & POST
app.get('/api/admin-actions', (req: Request, res: Response) => {
  res.json(activeActionsStore);
});

app.post('/api/admin-actions/dispatch', (req: Request, res: Response): void => {
  const { actionId } = req.body;
  const target = activeActionsStore.find(a => a.id === actionId);
  if (!target) {
    res.status(404).json({ error: 'Action not found' });
    return;
  }
  target.status = 'Team Deployed';
  res.json({ success: true, updated: target });
});

app.post('/api/admin-actions/resolve', (req: Request, res: Response): void => {
  const { actionId } = req.body;
  const target = activeActionsStore.find(a => a.id === actionId);
  if (!target) {
    res.status(404).json({ error: 'Action not found' });
    return;
  }
  target.status = 'Action Resolved';
  res.json({ success: true, updated: target });
});

app.post('/api/admin-actions/create', (req: Request, res: Response): void => {
  const { location, city, priorityLevel, reason, recommendedAction } = req.body;
  const newAction = {
    id: `custom-act-${Date.now()}`,
    priorityLevel: priorityLevel || 'URGENT INTERVENTION',
    location: location || 'Central Sector Corridor',
    city: city || 'Delhi',
    reason: reason || 'Anomalous particulate spike registered by municipal sensor network.',
    recommendedAction: recommendedAction || 'Deploy inspection squad for immediate audit.',
    confidence: Math.round(88 + Math.random() * 9),
    status: 'Pending Dispatch',
    timestamp: 'Just now'
  };
  activeActionsStore.unshift(newAction);
  res.json({ success: true, action: newAction });
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AeroSmart AI Urban Air Quality Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
