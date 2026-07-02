import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Layers, 
  Flame, 
  CloudRain, 
  ShieldAlert, 
  Factory,
  Car,
  HardHat,
  Trash2
} from 'lucide-react';
import { CityData, HotspotMarker } from '../types';
import L from 'leaflet';

interface InteractiveMapProps {
  city: CityData;
  onSelectHotspot?: (hotspot: HotspotMarker) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ city }) => {
  const [selectedMarker, setSelectedMarker] = useState<HotspotMarker | null>(city.hotspots[0] || null);
  const [layer, setLayer] = useState<'hotspots' | 'heatmap' | 'weather' | 'boundary'>('hotspots');
  const [zoomLevel, setZoomLevel] = useState(12);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const getStatusColorHex = (status: string) => {
    switch (status) {
      case 'Good': return '#22c55e';
      case 'Moderate': return '#eab308';
      case 'Unhealthy': return '#f97316';
      case 'Poor': return '#ef4444';
      case 'Severe': return '#b91c1c';
      case 'Hazardous': return '#7f1d1d';
      default: return '#ef4444';
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Industrial': return <Factory className="w-4 h-4 text-purple-400" />;
      case 'Traffic': return <Car className="w-4 h-4 text-amber-400" />;
      case 'Construction': return <HardHat className="w-4 h-4 text-orange-400" />;
      case 'Waste': return <Trash2 className="w-4 h-4 text-red-400" />;
      default: return <MapPin className="w-4 h-4 text-cyan-400" />;
    }
  };

  useEffect(() => {
    setSelectedMarker(city.hotspots[0] || null);
    setDispatchStatus(null);
  }, [city]);

  // Cleanup Leaflet Map completely on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [city.lat, city.lng],
        zoom: zoomLevel,
        zoomControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([city.lat, city.lng], zoomLevel);
    }

    const map = mapInstanceRef.current;

    // Remove existing custom vector layers & pins
    map.eachLayer((l) => {
      if (l instanceof L.Circle || l instanceof L.Marker) {
        map.removeLayer(l);
      }
    });

    // Add GIS Overlays based on active layer
    if (layer === 'boundary' || layer === 'hotspots') {
      L.circle([city.lat, city.lng], {
        color: '#06b6d4',
        weight: 2,
        dashArray: '6, 8',
        fillColor: '#06b6d4',
        fillOpacity: 0.05,
        radius: 9000
      }).addTo(map);
    }

    if (layer === 'heatmap') {
      L.circle([city.lat, city.lng], {
        color: city.color,
        fillColor: city.color,
        fillOpacity: 0.28,
        radius: 7000,
        stroke: false
      }).addTo(map);

      L.circle([city.lat + 0.012, city.lng - 0.01], {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.35,
        radius: 4000,
        stroke: false
      }).addTo(map);
    }

    // City Center Benchmark Marker
    const centerIcon = L.divIcon({
      className: 'custom-center-pin',
      html: `<div style="background-color: #0f172a; border: 2.5px solid white; border-radius: 50%; width: 48px; height: 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.6); color: white;">
        <span style="font-size: 8px; font-weight: bold; line-height: 1; text-transform: uppercase; max-width: 42px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${city.name}</span>
        <span style="font-size: 13px; font-weight: 900; color: ${city.color}; line-height: 1.1;">${city.metrics.aqi}</span>
      </div>`,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    L.marker([city.lat, city.lng], { icon: centerIcon, zIndexOffset: 1000 }).addTo(map);

    // Hotspot Sector Markers
    if (layer === 'hotspots' || layer === 'heatmap' || layer === 'weather') {
      city.hotspots.forEach((spot) => {
        const spotColorHex = getStatusColorHex(spot.status);
        const spotIcon = L.divIcon({
          className: 'custom-spot-pin',
          html: `<div style="background-color: rgba(15, 23, 42, 0.95); border: 2px solid ${spotColorHex}; border-radius: 10px; padding: 4px 8px; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); color: white; cursor: pointer;">
            <span style="font-size: 10px; font-weight: bold; max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${spot.name}</span>
            <span style="font-size: 10px; font-family: monospace; font-weight: 900; background: ${spotColorHex}; color: #0f172a; padding: 1px 4px; border-radius: 4px;">${spot.aqi}</span>
          </div>`,
          iconSize: [140, 28],
          iconAnchor: [70, 14]
        });

        const marker = L.marker([spot.lat, spot.lng], { icon: spotIcon }).addTo(map);
        marker.on('click', () => setSelectedMarker(spot));
      });
    }

  }, [city, layer, zoomLevel]);

  const handleZoomIn = () => {
    setZoomLevel(z => Math.min(18, z + 1));
  };

  const handleZoomOut = () => {
    setZoomLevel(z => Math.max(5, z - 1));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px] md:h-[640px] relative">
      {/* Map Control Header Bar */}
      <div className="bg-slate-950/90 backdrop-blur px-4 md:px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0"></div>
          <span className="font-bold text-xs md:text-sm text-white tracking-wide truncate">AeroGeospatial GIS Command Canvas</span>
          <span className="text-[10px] md:text-xs text-slate-400 font-mono shrink-0">[{city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°]</span>
        </div>

        {/* Layer Switches */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setLayer('hotspots')}
            className={`flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              layer === 'hotspots' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Hotspots</span> ({city.hotspots.length})
          </button>
          <button
            onClick={() => setLayer('heatmap')}
            className={`flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              layer === 'heatmap' ? 'bg-red-500 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Heatmap</span>
          </button>
          <button
            onClick={() => setLayer('weather')}
            className={`flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              layer === 'weather' ? 'bg-sky-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Wind/Rain</span>
          </button>
          <button
            onClick={() => setLayer('boundary')}
            className={`flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              layer === 'boundary' ? 'bg-purple-500 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Boundary</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px] md:text-xs font-mono text-slate-400">Zoom: {zoomLevel}x</span>
          <button 
            onClick={handleZoomIn}
            className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer"
          >+</button>
          <button 
            onClick={handleZoomOut}
            className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer"
          >-</button>
        </div>
      </div>

      {/* Real OpenStreetMap Leaflet Map Workspace */}
      <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center select-none">
        <div 
          ref={mapContainerRef}
          className="w-full h-full [&_.leaflet-tile-pane]:invert [&_.leaflet-tile-pane]:hue-rotate-180 [&_.leaflet-tile-pane]:brightness-90 [&_.leaflet-tile-pane]:contrast-125 z-0"
        ></div>

        {/* Selected Marker Detailed Info Popup Overlay */}
        {selectedMarker && (
          <div className="absolute inset-x-4 bottom-4 md:inset-auto md:right-6 md:top-6 md:bottom-6 w-auto md:w-80 max-h-[60%] md:max-h-none bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-4 md:p-5 shadow-2xl z-30 flex flex-col justify-between overflow-y-auto md:overflow-visible animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-right-4 duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {selectedMarker.type} Hotspot
                </span>
                <button 
                  onClick={() => setSelectedMarker(null)}
                  className="text-slate-400 hover:text-white font-bold text-xs bg-slate-800 px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>

              <h3 className="font-bold text-sm md:text-base text-white tracking-tight leading-snug">{selectedMarker.name}</h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-mono mt-1">Sector Lat: {selectedMarker.lat.toFixed(4)}, Lng: {selectedMarker.lng.toFixed(4)}</p>

              {/* Popup Telemetry Matrix */}
              <div className="space-y-2.5 mt-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-[11px] md:text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Recorded AQI:</span>
                  <span className="font-black text-base md:text-lg px-2 py-0.5 rounded text-slate-950 font-mono" style={{ backgroundColor: getStatusColorHex(selectedMarker.status) }}>
                    {selectedMarker.aqi}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-800/80 pt-1.5">
                  <span className="text-slate-400">Pollution Status:</span>
                  <span className="font-bold text-slate-200">{selectedMarker.status}</span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-800/80 pt-1.5">
                  <span className="text-slate-400">Main Pollutant:</span>
                  <span className="font-bold text-amber-400 font-mono">{selectedMarker.mainPollutant}</span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-800/80 pt-1.5">
                  <span className="text-slate-400">Ambient Temp:</span>
                  <span className="font-bold text-sky-400 font-mono">{city.weather.temperature}°C</span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-800/80 pt-1.5">
                  <span className="text-slate-400">Health Risk Rating:</span>
                  <span className="font-bold text-red-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    {selectedMarker.healthRisk}
                  </span>
                </div>
              </div>

              <div className="mt-3.5 p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-[10px] md:text-[11px] text-red-200 leading-relaxed">
                <span className="font-bold text-red-400 block mb-0.5">Intervention Mandate:</span>
                Continuous stack emission violation detected. Municipal drone monitoring team has been alerted for immediate site inspection.
              </div>
            </div>

            {dispatchStatus ? (
              <div className="mt-3.5 p-3 bg-emerald-950/50 border border-emerald-800/80 rounded-xl text-[10px] md:text-[11px] text-emerald-200 text-center animate-pulse">
                <span className="font-bold text-emerald-400 block mb-0.5">✓ Task Force Deployed</span>
                {dispatchStatus}
              </div>
            ) : (
              <button
                onClick={() => {
                  setDispatchStatus(`Inspection team dispatched to ${selectedMarker.name} [Sector ID: ${selectedMarker.id}]. Tracking under active protocol.`);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-3.5 min-h-[44px]"
              >
                <ShieldAlert className="w-4 h-4" />
                Deploy Municipal Rapid Response
              </button>
            )}
          </div>
        )}

        {/* Legend Overlay at Bottom Left */}
        <div className={`absolute left-4 bottom-4 bg-slate-900/90 backdrop-blur border border-slate-800 p-2.5 rounded-xl z-20 text-[10px] md:text-[11px] space-y-1 md:space-y-1.5 shadow-xl pointer-events-none transition-opacity duration-200 ${
          selectedMarker ? 'hidden md:block' : 'block'
        }`}>
          <span className="font-bold text-slate-300 block border-b border-slate-800 pb-1 mb-1 uppercase tracking-wider text-[9px] md:text-[10px]">AQI Index Legend</span>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#22c55e]"></span><span className="text-slate-400">0-50 Good</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#eab308]"></span><span className="text-slate-400">51-100 Moderate</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#f97316]"></span><span className="text-slate-400">101-150 Unhealthy</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#ef4444]"></span><span className="text-slate-400">151-200 Poor</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#b91c1c]"></span><span className="text-slate-400">201-300 Severe</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#7f1d1d]"></span><span className="text-slate-400">300+ Hazardous</span></div>
        </div>
      </div>
    </div>
  );
};
