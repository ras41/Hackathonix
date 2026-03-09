import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const OPTION_COLORS = [
  "#8b5cf6", // purple
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#3b82f6", // blue
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

function getColorForOption(option, allOptions) {
  const index = allOptions.indexOf(option);
  return OPTION_COLORS[index >= 0 ? index % OPTION_COLORS.length : 0];
}

function AutoFitBounds({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (!markers.length) return;

    const bounds = markers.map((m) => [m.lat, m.lng]);

    if (bounds.length === 1) {
      map.setView(bounds[0], 12);
    } else {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [markers, map]);

  return null;
}

export default function MapComponent({ votes = [], options = [] }) {
  const markers = useMemo(
    () =>
      votes
        .filter(
          (v) =>
            Number.isFinite(v.latitude) &&
            Number.isFinite(v.longitude)
        )
        .map((v) => ({
          id: v._id,
          lat: v.latitude,
          lng: v.longitude,
          option: v.option,
          color: getColorForOption(v.option, options),
        })),
    [votes, options]
  );

  return (
    <div className="w-full h-full rounded-xl overflow-hidden" style={{ minHeight: 350 }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", minHeight: 350, borderRadius: "0.75rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AutoFitBounds markers={markers} />
        {markers.map((m) => (
          <CircleMarker
            key={m.id}
            center={[m.lat, m.lng]}
            radius={9}
            pathOptions={{
              fillColor: m.color,
              color: "#fff",
              weight: 2,
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold" style={{ color: m.color }}>
                  {m.option}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {m.lat.toFixed(4)}, {m.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend */}
      {options.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3 px-1">
          {options.map((opt) => (
            <div key={opt} className="flex items-center gap-1.5 text-xs text-gray-700">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: getColorForOption(opt, options) }}
              />
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
