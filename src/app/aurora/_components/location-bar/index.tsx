"use client";

import { MapPin, RotateCw } from "lucide-react";
import { useState } from "react";

type Props = {
  lat: number;
  lon: number;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onManualCoords: (coords: { lat: number; lon: number } | null) => void;
};

const LocationBar = ({ lat, lon, loading, error, onRetry, onManualCoords }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [inputLat, setInputLat] = useState("");
  const [inputLon, setInputLon] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLat = parseFloat(inputLat);
    const parsedLon = parseFloat(inputLon);
    if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
      onManualCoords({ lat: parsedLat, lon: parsedLon });
      setExpanded(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900/30 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-green-400" />

          {loading ? (
            <span className="text-sm text-neutral-500">Locating...</span>
          ) : (
            <span className="text-sm text-neutral-300">
              {`${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1 rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-700"
            >
              <RotateCw size={12} />
              Use my location
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-700"
          >
            {expanded ? "Cancel" : "Manual"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-orange-400">{error}</p>
      )}

      {expanded && (
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1">
            <label htmlFor="aurora-lat" className="mb-1 block text-xs text-neutral-500">Latitude</label>

            <input
              id="aurora-lat"
              type="number"
              step="any"
              value={inputLat}
              onChange={(e) => setInputLat(e.target.value)}
              placeholder="64.15"
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-green-500 focus:outline-none"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="aurora-lon" className="mb-1 block text-xs text-neutral-500">Longitude</label>

            <input
              id="aurora-lon"
              type="number"
              step="any"
              value={inputLon}
              onChange={(e) => setInputLon(e.target.value)}
              placeholder="-21.94"
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-green-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-500"
          >
            Go
          </button>
        </form>
      )}
    </div>
  );
};

export default LocationBar;
