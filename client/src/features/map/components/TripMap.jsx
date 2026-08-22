import React, { useState, useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Calendar,
  Clock,
  Compass,
  Sparkles,
  AlertTriangle,
  Layers,
  Eye,
  Navigation,
  ArrowRight,
  Info,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { formatCurrency } from '../../../utils/currencyUtils';
import { formatShortDate } from '../../../utils/dateUtils';

// Fix Leaflet's default icon assets broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * Custom HTML DivIcon Generator for City Stops
 */
function createCityIcon(stopNumber, cityName) {
  return L.divIcon({
    className: 'custom-city-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
        <div style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 4px 14px rgba(37,99,235,0.4); border: 2.5px solid #ffffff;">
          ${stopNumber}
        </div>
        <div style="background: rgba(15, 23, 42, 0.88); color: #ffffff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; white-space: nowrap; margin-top: 3px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2);">
          ${cityName}
        </div>
        <div style="width: 2px; height: 6px; background: #2563eb;"></div>
      </div>
    `,
    iconSize: [34, 52],
    iconAnchor: [17, 52],
    popupAnchor: [0, -48],
  });
}

/**
 * Custom HTML DivIcon Generator for Activities
 */
function createActivityIcon(category) {
  let color = '#d97706'; // default amber
  if (category === 'ADVENTURE') color = '#dc2626'; // red
  if (category === 'CULTURE') color = '#7c3aed'; // purple
  if (category === 'NATURE') color = '#059669'; // green
  if (category === 'FOOD') color = '#ea580c'; // orange

  return L.divIcon({
    className: 'custom-activity-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%); cursor: pointer;">
        <div style="background: ${color}; color: #ffffff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid #ffffff;">
          ★
        </div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });
}

/**
 * Subcomponent to automatically fit map view bounds to markers
 */
function MapBoundsFitter({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 10, { animate: true });
    } else {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13, animate: true });
    }
  }, [map, points]);

  return null;
}

export default function TripMap({
  stops = [],
  itineraryItems = [],
  onSelectStop,
  onSelectActivity,
  className = '',
}) {
  const [showActivities, setShowActivities] = useState(true);
  const [selectedStopId, setSelectedStopId] = useState(null);

  // 1. Filter valid city stop coordinates (sorted by stopOrder)
  const validStops = useMemo(() => {
    return [...stops]
      .sort((a, b) => (a.stopOrder || 0) - (b.stopOrder || 0))
      .filter(
        (s) =>
          s.city &&
          s.city.latitude !== null &&
          s.city.longitude !== null &&
          !isNaN(s.city.latitude) &&
          !isNaN(s.city.longitude)
      );
  }, [stops]);

  // Missing coordinates check for warning
  const missingCityStops = useMemo(() => {
    return stops.filter(
      (s) =>
        !s.city ||
        s.city.latitude === null ||
        s.city.longitude === null ||
        isNaN(s.city.latitude) ||
        isNaN(s.city.longitude)
    );
  }, [stops]);

  // 2. Filter valid activity coordinates
  const validActivities = useMemo(() => {
    return itineraryItems.filter(
      (item) =>
        item.activity &&
        item.activity.latitude !== null &&
        item.activity.longitude !== null &&
        !isNaN(item.activity.latitude) &&
        !isNaN(item.activity.longitude)
    );
  }, [itineraryItems]);

  // 3. Polyline Route Coordinates (between consecutive city stops)
  const routePositions = useMemo(() => {
    return validStops.map((s) => [s.city.latitude, s.city.longitude]);
  }, [validStops]);

  // 4. Combined points for bounds calculation
  const allPoints = useMemo(() => {
    const pts = validStops.map((s) => ({
      lat: s.city.latitude,
      lng: s.city.longitude,
    }));
    if (showActivities) {
      validActivities.forEach((a) => {
        pts.push({
          lat: a.activity.latitude,
          lng: a.activity.longitude,
        });
      });
    }
    return pts;
  }, [validStops, validActivities, showActivities]);

  // Default initial center (India center if empty)
  const defaultCenter = [20.5937, 78.9629];

  // If completely empty
  if (stops.length === 0) {
    return (
      <Card className="p-8 text-center bg-slate-50 border-dashed border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
          <Navigation className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No mapped locations yet</h3>
        <p className="text-xs text-slate-500 mt-1">
          Add city stops to this trip to visualize the interactive travel route.
        </p>
      </Card>
    );
  }

  return (
    <div className={`flex flex-col lg:flex-row gap-6 ${className}`}>
      {/* Left / Main Map Canvas (Approx 70% width on desktop) */}
      <div className="flex-1 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative min-h-[480px] lg:min-h-[580px] bg-slate-100 flex flex-col">
        {/* Missing coordinates notice banner */}
        {missingCityStops.length > 0 && (
          <div className="bg-amber-500 text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 z-10 shrink-0">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Coordinates unavailable for: {missingCityStops.map((s) => s.city?.name || 'City').join(', ')}. Markers for these stops are omitted gracefully.
            </span>
          </div>
        )}

        {/* Map Header Floating Overlay Controls */}
        <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 flex-wrap">
          <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-2 text-xs font-bold text-slate-800">
            <Navigation className="w-3.5 h-3.5 text-brand-600" />
            <span>{validStops.length} Mapped Stops</span>
          </div>

          <button
            type="button"
            onClick={() => setShowActivities(!showActivities)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
              showActivities
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showActivities ? 'Hide Activities' : 'Show Activities'} ({validActivities.length})</span>
          </button>
        </div>

        {/* Leaflet Map */}
        <div className="flex-1 w-full h-full relative z-0">
          <MapContainer
            center={allPoints.length > 0 ? [allPoints[0].lat, allPoints[0].lng] : defaultCenter}
            zoom={5}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '100%', minHeight: '480px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapBoundsFitter points={allPoints} />

            {/* Route Polyline connecting city stops */}
            {routePositions.length > 1 && (
              <>
                {/* Glow / Outline */}
                <Polyline
                  positions={routePositions}
                  pathOptions={{
                    color: '#0284c7',
                    weight: 6,
                    opacity: 0.35,
                    lineCap: 'round',
                  }}
                />
                {/* Main Dashed Connecting Line */}
                <Polyline
                  positions={routePositions}
                  pathOptions={{
                    color: '#2563eb',
                    weight: 3.5,
                    dashArray: '8, 10',
                    opacity: 0.9,
                  }}
                />
              </>
            )}

            {/* City Stop Markers */}
            {validStops.map((stop, idx) => {
              const stopNumber = stop.stopOrder || idx + 1;
              const stopItems = itineraryItems.filter((i) => i.tripStopId === stop.id);

              return (
                <Marker
                  key={`stop-${stop.id}`}
                  position={[stop.city.latitude, stop.city.longitude]}
                  icon={createCityIcon(stopNumber, stop.city.name)}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-1 min-w-[200px] text-slate-900">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] font-black flex items-center justify-center">
                          {stopNumber}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                          {stop.city.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {stop.city.region ? `${stop.city.region}, ` : ''}{stop.city.country}
                      </p>

                      <div className="mt-2 pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-sky-600 shrink-0" />
                          <span>
                            {formatShortDate(stop.arrivalDate)} – {formatShortDate(stop.departureDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Compass className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{stopItems.length} Scheduled Activities</span>
                        </div>
                      </div>

                      {onSelectStop && (
                        <div className="mt-3 pt-2 border-t border-slate-100">
                          <Button
                            size="sm"
                            variant="primary"
                            className="w-full text-xs font-bold py-1"
                            onClick={() => onSelectStop(stop)}
                          >
                            View Stop
                          </Button>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Activity Markers */}
            {showActivities &&
              validActivities.map((item) => (
                <Marker
                  key={`act-${item.id}`}
                  position={[item.activity.latitude, item.activity.longitude]}
                  icon={createActivityIcon(item.activity.category)}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-1 min-w-[220px] text-slate-900">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Badge variant="category" category={item.activity.category} />
                        <span className="text-xs font-black text-emerald-600">
                          {formatCurrency(item.customCost ?? item.activity.estimatedCost)}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 mt-1 leading-snug">
                        {item.activity.name}
                      </h4>

                      <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] space-y-0.5 text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{formatShortDate(item.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{item.startTime} – {item.endTime}</span>
                        </div>
                      </div>

                      {onSelectActivity && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => onSelectActivity(item)}
                            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                          >
                            <span>Open Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </div>

      {/* Right / Side Route Stop Summary Panel (Approx 30% width) */}
      <div className="w-full lg:w-80 space-y-4 shrink-0">
        <Card className="p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-brand-600" />
                Route Sequence
              </h3>
              <p className="text-[11px] text-slate-500">
                Ordered journey stops & destinations
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-50 text-brand-700 border border-brand-200">
              {stops.length} Stops
            </span>
          </div>

          {/* Sequential Stop List */}
          <div className="space-y-3">
            {stops
              .sort((a, b) => (a.stopOrder || 0) - (b.stopOrder || 0))
              .map((stop, idx) => {
                const stopNumber = stop.stopOrder || idx + 1;
                const stopItems = itineraryItems.filter((i) => i.tripStopId === stop.id);
                const hasCoords =
                  stop.city?.latitude !== null &&
                  stop.city?.longitude !== null &&
                  !isNaN(stop.city?.latitude);

                return (
                  <div
                    key={stop.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-2.5 transition-all hover:bg-slate-100/70"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        {stopNumber}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {stop.city?.name || 'Unknown Destination'}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {stop.city?.region ? `${stop.city.region}, ` : ''}{stop.city?.country || 'India'}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {formatShortDate(stop.arrivalDate)} – {formatShortDate(stop.departureDate)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {stopItems.length} acts
                      </span>
                      {!hasCoords && (
                        <span className="block text-[9px] text-amber-600 font-semibold mt-1">
                          No GPS
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Click any marker to inspect dates, costs, and scheduled activities.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
