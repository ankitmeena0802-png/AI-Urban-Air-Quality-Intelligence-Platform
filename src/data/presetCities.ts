import { CityData, PriorityAction } from '../types';

export const PRESET_CITIES: CityData[] = [
  {
    id: 'delhi-ncr',
    name: 'Delhi',
    state: 'Delhi NCR',
    country: 'India',
    lat: 28.6139,
    lng: 77.2090,
    status: 'Poor',
    color: '#ef4444', // red-500
    mainPollutant: 'PM2.5',
    healthRisk: 'High',
    weatherExplanation: 'Low wind speed (5.2 km/h) and temperature inversion are trapping vehicle and industrial emissions near the surface.',
    lastUpdated: new Date().toLocaleTimeString(),
    metrics: {
      aqi: 285,
      pm25: 142.5,
      pm10: 235.8,
      no2: 68.4,
      co: 1.85,
      so2: 22.1,
      o3: 45.2
    },
    weather: {
      temperature: 31,
      humidity: 62,
      windSpeed: 5.2,
      windDirection: 210,
      weatherCondition: 'Haze & Smog',
      rainProbability: 10,
      visibility: 2.8
    },
    attribution: {
      vehicle: 45,
      industry: 30,
      construction: 20,
      wasteBurning: 5,
      confidenceScore: 92,
      analysisRationale: 'High nocturnal NO2 concentration correlates with heavy diesel freight transit on Outer Ring Road, combined with thermal plant plume drift from Anand Vihar sector.'
    },
    forecast: [
      { timeLabel: 'Today (Now)', hourOffset: 0, aqi: 285, pm25: 142, upperBound: 300, lowerBound: 270, status: 'Poor' },
      { timeLabel: '+6 Hours', hourOffset: 6, aqi: 310, pm25: 165, upperBound: 330, lowerBound: 290, status: 'Severe' },
      { timeLabel: '+12 Hours', hourOffset: 12, aqi: 295, pm25: 150, upperBound: 315, lowerBound: 280, status: 'Poor' },
      { timeLabel: 'Tomorrow (+24h)', hourOffset: 24, aqi: 240, pm25: 115, upperBound: 260, lowerBound: 220, status: 'Poor' },
      { timeLabel: '+48 Hours', hourOffset: 48, aqi: 210, pm25: 98, upperBound: 230, lowerBound: 190, status: 'Unhealthy' },
      { timeLabel: '+72 Hours', hourOffset: 72, aqi: 185, pm25: 82, upperBound: 205, lowerBound: 165, status: 'Moderate' }
    ],
    advisory: {
      english: 'Air quality is poor with high PM2.5 levels. Avoid prolonged outdoor physical exertion. N95 respirators are strongly advised during morning commute.',
      hindi: 'आज हवा की गुणवत्ता खराब है और PM2.5 का स्तर अधिक है। बाहर लंबे समय तक व्यायाम करने से बचें। सुबह के समय N95 मास्क का प्रयोग करें।',
      regional: 'ವಾಯು ಗುಣಮಟ್ಟ ಕಳಪೆಯಾಗಿದೆ. ಹೊರಗಿನ ಚಟುವಟಿಕೆಗಳನ್ನು ಮಿತಿಗೊಳಿಸಿ. (Kannada/Regional Advisory: Protect sensitive respiratory airways)',
      precautions: [
        'Run HEPA air purifiers indoors with windows closed',
        'Avoid jogging near arterial highways between 6 AM - 9 AM',
        'Use public rapid transit (Metro) to reduce vehicular exhaust',
        'Hydrate frequently to help respiratory mucus clearance'
      ],
      sensitiveGroupsInfo: 'Asthma patients should carry emergency bronchodilators. Elderly (65+) and infants under 5 should remain indoors.'
    },
    hotspots: [
      { id: 'del-1', name: 'Anand Vihar ISBT Terminal', lat: 28.6469, lng: 77.3161, aqi: 345, mainPollutant: 'PM10', status: 'Severe', type: 'Traffic', healthRisk: 'Severe' },
      { id: 'del-2', name: 'Okhla Industrial Sector Phase II', lat: 28.5273, lng: 77.2766, aqi: 312, mainPollutant: 'SO2', status: 'Severe', type: 'Industrial', healthRisk: 'Severe' },
      { id: 'del-3', name: 'Punjabi Bagh Junction', lat: 28.6692, lng: 77.1328, aqi: 278, mainPollutant: 'PM2.5', status: 'Poor', type: 'Traffic', healthRisk: 'High' },
      { id: 'del-4', name: 'Dwarka Sector 21 Construction Zone', lat: 28.5524, lng: 77.0583, aqi: 265, mainPollutant: 'PM10', status: 'Poor', type: 'Construction', healthRisk: 'High' }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    lat: 19.0760,
    lng: 72.8777,
    status: 'Moderate',
    color: '#eab308', // yellow-500
    mainPollutant: 'PM10',
    healthRisk: 'Moderate',
    weatherExplanation: 'Coastal sea breeze (18.5 km/h) is assisting pollutant dispersion, though localized construction dust persists near coastal road expansion corridors.',
    lastUpdated: new Date().toLocaleTimeString(),
    metrics: {
      aqi: 142,
      pm25: 64.2,
      pm10: 128.5,
      no2: 42.1,
      co: 1.15,
      so2: 14.2,
      o3: 38.6
    },
    weather: {
      temperature: 32,
      humidity: 78,
      windSpeed: 18.5,
      windDirection: 280,
      weatherCondition: 'Partly Cloudy & Humid',
      rainProbability: 35,
      visibility: 6.5
    },
    attribution: {
      vehicle: 35,
      industry: 15,
      construction: 42,
      wasteBurning: 8,
      confidenceScore: 89,
      analysisRationale: 'High coarse particulate (PM10) signatures match extensive metro line excavation and coastal freeway land reclamation projects.'
    },
    forecast: [
      { timeLabel: 'Today (Now)', hourOffset: 0, aqi: 142, pm25: 64, upperBound: 155, lowerBound: 130, status: 'Moderate' },
      { timeLabel: '+6 Hours', hourOffset: 6, aqi: 158, pm25: 72, upperBound: 175, lowerBound: 140, status: 'Moderate' },
      { timeLabel: '+12 Hours', hourOffset: 12, aqi: 125, pm25: 55, upperBound: 140, lowerBound: 110, status: 'Moderate' },
      { timeLabel: 'Tomorrow (+24h)', hourOffset: 24, aqi: 115, pm25: 48, upperBound: 130, lowerBound: 100, status: 'Moderate' },
      { timeLabel: '+48 Hours', hourOffset: 48, aqi: 95, pm25: 38, upperBound: 110, lowerBound: 80, status: 'Good' },
      { timeLabel: '+72 Hours', hourOffset: 72, aqi: 88, pm25: 32, upperBound: 102, lowerBound: 75, status: 'Good' }
    ],
    advisory: {
      english: 'Air quality is acceptable for the general public. Individuals with severe chronic asthma may experience mild respiratory irritation near heavy construction sites.',
      hindi: 'हवा की गुणवत्ता मध्यम है। आम जनता के लिए सुरक्षित है, लेकिन धूल भरी निर्माण स्थलों के पास अस्थमा रोगियों को सावधानी बरतनी चाहिए।',
      regional: 'ಹವಾಮಾನ ಉತ್ತಮವಾಗಿದೆ. ಸಾಧಾರಣ ಚಟುವಟಿಕೆಗಳಿಗೆ ಯಾವುದೇ ತೊಂದರೆ ಇಲ್ಲ. (Marathi: हवेची गुणवत्ता मध्यम आहे. बाहेर जाण्यास हरकत नाही.)',
      precautions: [
        'Wear standard cloth or surgical masks near road excavation zones',
        'Keep car air conditioning on recirculation mode in bumper-to-bumper traffic',
        'Rinse eyes with clean water after returning from dusty transit corridors'
      ],
      sensitiveGroupsInfo: 'Unusually sensitive individuals should consider reducing prolonged heavy exertion.'
    },
    hotspots: [
      { id: 'mum-1', name: 'BKC Bandra Kurla Complex Junction', lat: 19.0657, lng: 72.8681, aqi: 188, mainPollutant: 'PM10', status: 'Moderate', type: 'Construction', healthRisk: 'Moderate' },
      { id: 'mum-2', name: 'Deonar Dump Yard Sector', lat: 19.0558, lng: 72.9231, aqi: 215, mainPollutant: 'CO', status: 'Poor', type: 'Waste', healthRisk: 'High' },
      { id: 'mum-3', name: 'Saki Naka Andheri East', lat: 19.1012, lng: 72.8887, aqi: 172, mainPollutant: 'NO2', status: 'Moderate', type: 'Traffic', healthRisk: 'Moderate' }
    ]
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    status: 'Moderate',
    color: '#eab308',
    mainPollutant: 'PM2.5',
    healthRisk: 'Moderate',
    weatherExplanation: 'Elevated plateau topography provides steady cross-winds (14 km/h). Tech corridor congestion creates localized morning peak NO2 surges.',
    lastUpdated: new Date().toLocaleTimeString(),
    metrics: { aqi: 118, pm25: 48.6, pm10: 92.4, no2: 54.2, co: 0.95, so2: 8.5, o3: 34.1 },
    weather: { temperature: 27, humidity: 65, windSpeed: 14.0, windDirection: 240, weatherCondition: 'Pleasant Breeze', rainProbability: 20, visibility: 8.0 },
    attribution: { vehicle: 58, industry: 12, construction: 22, wasteBurning: 8, confidenceScore: 91, analysisRationale: 'Vehicular gridlock along Silk Board and Outer Ring Road tech hubs contributes over 58% of primary NOx emissions.' },
    forecast: [
      { timeLabel: 'Today (Now)', hourOffset: 0, aqi: 118, pm25: 48, upperBound: 130, lowerBound: 105, status: 'Moderate' },
      { timeLabel: '+6 Hours', hourOffset: 6, aqi: 145, pm25: 62, upperBound: 160, lowerBound: 130, status: 'Moderate' },
      { timeLabel: '+12 Hours', hourOffset: 12, aqi: 98, pm25: 40, upperBound: 110, lowerBound: 85, status: 'Good' },
      { timeLabel: 'Tomorrow (+24h)', hourOffset: 24, aqi: 105, pm25: 42, upperBound: 118, lowerBound: 92, status: 'Moderate' },
      { timeLabel: '+48 Hours', hourOffset: 48, aqi: 85, pm25: 32, upperBound: 98, lowerBound: 72, status: 'Good' },
      { timeLabel: '+72 Hours', hourOffset: 72, aqi: 76, pm25: 28, upperBound: 88, lowerBound: 65, status: 'Good' }
    ],
    advisory: {
      english: 'Air quality is generally acceptable. Commuters on two-wheelers in high-density traffic corridors should consider wearing anti-pollution visors.',
      hindi: 'बेंगलुरु में हवा की स्थिति सामान्य है। मुख्य ट्रैफिक चौराहों पर दोपहिया वाहन चालकों को हेलमेट वाइज़र बंद रखना चाहिए।',
      regional: 'ವಾಯು ಗುಣಮಟ್ಟ ಉತ್ತಮವಾಗಿದೆ. ಹೊರಗಿನ ವ್ಯಾಯಾಮಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಮಾಡಬಹುದು. (Kannada: ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ಮತ್ತು ಟೆಕ್ ಕಾರಿಡಾರ್‌ಗಳಲ್ಲಿ ಮುಖಗವಸು ಧರಿಸಿ.)',
      precautions: ['Avoid outdoor cycling along Outer Ring Road during 8 AM - 11 AM rush hour', 'Utilize indoor gym facilities on high traffic smog days'],
      sensitiveGroupsInfo: 'Safe for most citizens. Mild hypersensitivity reactions possible near Bellandur/Whitefield transit bottlenecks.'
    },
    hotspots: [
      { id: 'blr-1', name: 'Silk Board Junction Traffic Flyover', lat: 12.9174, lng: 77.6228, aqi: 184, mainPollutant: 'NO2', status: 'Moderate', type: 'Traffic', healthRisk: 'Moderate' },
      { id: 'blr-2', name: 'Peenya Industrial Area Stage IV', lat: 13.0285, lng: 77.5197, aqi: 165, mainPollutant: 'PM10', status: 'Moderate', type: 'Industrial', healthRisk: 'Moderate' },
      { id: 'blr-3', name: 'KR Puram Tin Factory Corridor', lat: 12.9982, lng: 77.6606, aqi: 192, mainPollutant: 'PM2.5', status: 'Moderate', type: 'Traffic', healthRisk: 'Moderate' }
    ]
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    lat: 13.0827,
    lng: 80.2707,
    status: 'Good',
    color: '#22c55e', // green-500
    mainPollutant: 'PM10',
    healthRisk: 'Low',
    weatherExplanation: 'Strong maritime monsoon air currents (22 km/h) are flushing atmospheric aerosols out toward the Bay of Bengal.',
    lastUpdated: new Date().toLocaleTimeString(),
    metrics: { aqi: 74, pm25: 28.4, pm10: 62.1, no2: 24.8, co: 0.65, so2: 6.2, o3: 28.4 },
    weather: { temperature: 34, humidity: 82, windSpeed: 22.0, windDirection: 140, weatherCondition: 'Humid Sea Breeze', rainProbability: 45, visibility: 9.5 },
    attribution: { vehicle: 40, industry: 38, construction: 15, wasteBurning: 7, confidenceScore: 94, analysisRationale: 'Ennore thermal power station emissions are rapidly dispersed by onshore trade winds.' },
    forecast: [
      { timeLabel: 'Today (Now)', hourOffset: 0, aqi: 74, pm25: 28, upperBound: 85, lowerBound: 65, status: 'Good' },
      { timeLabel: '+6 Hours', hourOffset: 6, aqi: 82, pm25: 32, upperBound: 95, lowerBound: 70, status: 'Good' },
      { timeLabel: '+12 Hours', hourOffset: 12, aqi: 65, pm25: 22, upperBound: 75, lowerBound: 55, status: 'Good' },
      { timeLabel: 'Tomorrow (+24h)', hourOffset: 24, aqi: 68, pm25: 25, upperBound: 80, lowerBound: 58, status: 'Good' },
      { timeLabel: '+48 Hours', hourOffset: 48, aqi: 60, pm25: 20, upperBound: 72, lowerBound: 50, status: 'Good' },
      { timeLabel: '+72 Hours', hourOffset: 72, aqi: 58, pm25: 18, upperBound: 68, lowerBound: 48, status: 'Good' }
    ],
    advisory: {
      english: 'Air quality is satisfactory and poses little or no health risk. Ideal conditions for outdoor sports and seaside walks.',
      hindi: 'चेन्नई में हवा की गुणवत्ता बहुत अच्छी है। बाहरी गतिविधियों और खेलकूद के लिए उत्तम मौसम है।',
      regional: 'காற்றின் தரம் மிகவும் நன்றாக உள்ளது. எவ்வித உடல்நல பாதிப்பும் இல்லை. (Tamil: வெளிப்புற உடற்பயிற்சிகளுக்கு மிகவும் ஏற்ற நேரம்.)',
      precautions: ['Enjoy outdoor activities without air quality restrictions', 'Stay hydrated due to high tropical coastal humidity'],
      sensitiveGroupsInfo: 'Completely safe for all age demographics and respiratory groups.'
    },
    hotspots: [
      { id: 'che-1', name: 'Manali Industrial & Refinery Belt', lat: 13.1667, lng: 80.2667, aqi: 142, mainPollutant: 'SO2', status: 'Moderate', type: 'Industrial', healthRisk: 'Moderate' },
      { id: 'che-2', name: 'Kathipara Cloverleaf Flyover', lat: 13.0067, lng: 80.2020, aqi: 115, mainPollutant: 'NO2', status: 'Moderate', type: 'Traffic', healthRisk: 'Low' }
    ]
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    lat: 22.5726,
    lng: 88.3639,
    status: 'Poor',
    color: '#f97316', // orange-500
    mainPollutant: 'PM2.5',
    healthRisk: 'High',
    weatherExplanation: 'High atmospheric humidity (85%) combined with low morning ventilation coefficient is condensing soot particles from outdated commercial diesel fleets.',
    lastUpdated: new Date().toLocaleTimeString(),
    metrics: { aqi: 245, pm25: 118.2, pm10: 194.5, no2: 62.1, co: 1.65, so2: 18.4, o3: 39.8 },
    weather: { temperature: 30, humidity: 85, windSpeed: 6.8, windDirection: 180, weatherCondition: 'Misty Smog', rainProbability: 15, visibility: 3.5 },
    attribution: { vehicle: 48, industry: 22, construction: 18, wasteBurning: 12, confidenceScore: 90, analysisRationale: 'High biomass burning markers detected along suburban railway tracks combined with heavy Howrah bridge freight transit.' },
    forecast: [
      { timeLabel: 'Today (Now)', hourOffset: 0, aqi: 245, pm25: 118, upperBound: 260, lowerBound: 230, status: 'Poor' },
      { timeLabel: '+6 Hours', hourOffset: 6, aqi: 275, pm25: 135, upperBound: 295, lowerBound: 255, status: 'Poor' },
      { timeLabel: '+12 Hours', hourOffset: 12, aqi: 220, pm25: 102, upperBound: 240, lowerBound: 200, status: 'Poor' },
      { timeLabel: 'Tomorrow (+24h)', hourOffset: 24, aqi: 205, pm25: 95, upperBound: 225, lowerBound: 185, status: 'Unhealthy' },
      { timeLabel: '+48 Hours', hourOffset: 48, aqi: 175, pm25: 78, upperBound: 195, lowerBound: 155, status: 'Moderate' },
      { timeLabel: '+72 Hours', hourOffset: 72, aqi: 150, pm25: 65, upperBound: 168, lowerBound: 132, status: 'Moderate' }
    ],
    advisory: {
      english: 'Air quality is unhealthy for sensitive groups and poor overall. Reduce heavy outdoor physical work. Asthmatics must keep rescue inhalers handy.',
      hindi: 'कोलकाता में हवा अस्वास्थ्यकर है। बुजुर्गों और बच्चों को सुबह के कोहरे के दौरान बाहर निकलने से बचना चाहिए।',
      regional: 'বাতাসের মান খারাপ। অপ্রয়োজনীয় বাইরের ঘোরাঘুরি এড়িয়ে চলুন। (Bengali: বয়স্ক ও শিশুদের মাস্ক ব্যবহার করা উচিত।)',
      precautions: ['Use N95 masks when traveling through central business district hubs', 'Keep home windows closed during early morning mist hours'],
      sensitiveGroupsInfo: 'High risk of acute bronchial spasms for chronic obstructive pulmonary disease (COPD) patients.'
    },
    hotspots: [
      { id: 'kol-1', name: 'Howrah Railway Station Approach', lat: 22.5838, lng: 88.3426, aqi: 298, mainPollutant: 'PM2.5', status: 'Poor', type: 'Traffic', healthRisk: 'High' },
      { id: 'kol-2', name: 'Topsia Leather & Waste Burning Belt', lat: 22.5411, lng: 88.3881, aqi: 315, mainPollutant: 'CO', status: 'Severe', type: 'Waste', healthRisk: 'Severe' }
    ]
  },
  {
    id: 'kota',
    name: 'Kota',
    state: 'Rajasthan',
    country: 'India',
    lat: 25.2138,
    lng: 75.8648,
    status: 'Moderate',
    color: '#eab308',
    mainPollutant: 'PM10',
    healthRisk: 'Moderate',
    weatherExplanation: 'Dry arid conditions generate natural soil resuspension dust, compounded by emissions from thermal power generation facilities.',
    lastUpdated: new Date().toLocaleTimeString(),
    metrics: { aqi: 165, pm25: 74.5, pm10: 158.2, no2: 44.2, co: 1.10, so2: 26.5, o3: 48.2 },
    weather: { temperature: 38, humidity: 32, windSpeed: 11.2, windDirection: 310, weatherCondition: 'Hot & Dusty', rainProbability: 5, visibility: 6.0 },
    attribution: { vehicle: 28, industry: 48, construction: 14, wasteBurning: 10, confidenceScore: 88, analysisRationale: 'Kota Super Thermal Power Station coal fly ash emissions account for nearly half of local sulfur and PM10 loads.' },
    forecast: [
      { timeLabel: 'Today (Now)', hourOffset: 0, aqi: 165, pm25: 74, upperBound: 180, lowerBound: 150, status: 'Moderate' },
      { timeLabel: '+6 Hours', hourOffset: 6, aqi: 182, pm25: 84, upperBound: 198, lowerBound: 165, status: 'Moderate' },
      { timeLabel: '+12 Hours', hourOffset: 12, aqi: 150, pm25: 66, upperBound: 165, lowerBound: 135, status: 'Moderate' },
      { timeLabel: 'Tomorrow (+24h)', hourOffset: 24, aqi: 140, pm25: 60, upperBound: 155, lowerBound: 125, status: 'Moderate' },
      { timeLabel: '+48 Hours', hourOffset: 48, aqi: 128, pm25: 54, upperBound: 142, lowerBound: 114, status: 'Moderate' },
      { timeLabel: '+72 Hours', hourOffset: 72, aqi: 115, pm25: 46, upperBound: 130, lowerBound: 100, status: 'Moderate' }
    ],
    advisory: {
      english: 'Air quality is moderate with dry dust particulates. Students walking or cycling to coaching hubs during afternoon heat should stay hydrated and wear protective face covers.',
      hindi: 'कोटा में हवा मध्यम स्तर पर है और धूल के कण मौजूद हैं। कोचिंग जाने वाले छात्रों को दोपहर की धूप और धूल से बचने के लिए रुमाल या मास्क का प्रयोग करना चाहिए।',
      regional: 'हवा में धूल है। बाहर निकलते समय मुंह ढंक कर रखें। (Rajasthani/Hindi Advisory: Protect eyes and throat from dry dust)',
      precautions: ['Cover mouth and nose with cotton scarf during afternoon wind gusts', 'Drink electrolytes to prevent respiratory mucosal dehydration'],
      sensitiveGroupsInfo: 'Individuals with allergic rhinitis or dry eye syndrome should wear protective wraparound eyewear.'
    },
    hotspots: [
      { id: 'kot-1', name: 'Kota Thermal Power Plant Plume Area', lat: 25.1764, lng: 75.8333, aqi: 242, mainPollutant: 'SO2', status: 'Poor', type: 'Industrial', healthRisk: 'High' },
      { id: 'kot-2', name: 'Indraprastha Industrial Area', lat: 25.1420, lng: 75.8560, aqi: 195, mainPollutant: 'PM10', status: 'Moderate', type: 'Industrial', healthRisk: 'Moderate' }
    ]
  }
];

export const INITIAL_PRIORITY_ACTIONS: PriorityAction[] = [
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
