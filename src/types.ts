export interface AirQualityMetrics {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  co: number;
  so2: number;
  o3: number;
}

export interface WeatherMetrics {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCondition: string;
  rainProbability: number;
  visibility: number;
}

export interface SourceAttribution {
  vehicle: number;
  industry: number;
  construction: number;
  wasteBurning: number;
  confidenceScore: number;
  analysisRationale: string;
}

export interface ForecastDataPoint {
  timeLabel: string;
  hourOffset: number;
  aqi: number;
  upperBound: number;
  lowerBound: number;
  pm25: number;
  status: string;
}

export interface HealthAdvisory {
  english: string;
  hindi: string;
  regional: string;
  precautions: string[];
  sensitiveGroupsInfo: string;
}

export interface HotspotMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  mainPollutant: string;
  status: string;
  type: 'Industrial' | 'Traffic' | 'Construction' | 'Waste';
  healthRisk: string;
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  metrics: AirQualityMetrics;
  weather: WeatherMetrics;
  status: 'Good' | 'Moderate' | 'Unhealthy' | 'Poor' | 'Severe' | 'Hazardous';
  color: string;
  mainPollutant: string;
  healthRisk: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical';
  weatherExplanation: string;
  attribution: SourceAttribution;
  forecast: ForecastDataPoint[];
  advisory: HealthAdvisory;
  hotspots: HotspotMarker[];
  lastUpdated: string;
}

export interface PriorityAction {
  id: string;
  priorityLevel: 'HIGH PRIORITY' | 'URGENT INTERVENTION' | 'MONITORING';
  location: string;
  city: string;
  reason: string;
  recommendedAction: string;
  confidence: number;
  status: 'Pending Dispatch' | 'Team Deployed' | 'Action Resolved';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export type ActiveTab = 
  | 'dashboard' 
  | 'map' 
  | 'analytics' 
  | 'forecast' 
  | 'attribution' 
  | 'advisory' 
  | 'chat' 
  | 'admin' 
  | 'compare';
