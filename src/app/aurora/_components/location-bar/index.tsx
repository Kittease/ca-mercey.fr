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
    <div className="aurora-glass relative flex flex-col gap-3 overflow-hidden rounded-xl px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10">
            <MapPin size={14} className="text-emerald-400" />
          </div>

          {loading ? (
            <span className="aurora-data text-sm text-white/30">Locating...</span>
          ) : (
            <span className="aurora-data text-sm text-white/60">
              {`${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white/70"
            >
              <RotateCw size={11} />
              Use my location
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="aurora-label rounded-lg bg-white/[0.04] px-3 py-1.5 text-[10px] text-white/35 transition-colors hover:bg-white/[0.08] hover:text-white/55"
          >
            {expanded ? "Cancel" : "Manual"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-amber-400/70">{error}</p>
      )}

      {expanded && (
        <form onSubmit={handleSubmit} className="flex items-end gap-2.5">
          <div className="flex-1">
            <label htmlFor="aurora-lat" className="aurora-label mb-1.5 block text-[10px] text-white/25">
              Latitude
            </label>
            <input
              id="aurora-lat"
              type="number"
              step="any"
              value={inputLat}
              onChange={(e) => setInputLat(e.target.value)}
              placeholder="64.15"
              className="aurora-data w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white/80 placeholder:text-white/15 focus:border-emerald-400/30 focus:outline-none focus:ring-1 focus:ring-emerald-400/10"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="aurora-lon" className="aurora-label mb-1.5 block text-[10px] text-white/25">
              Longitude
            </label>
            <input
              id="aurora-lon"
              type="number"
              step="any"
              value={inputLon}
              onChange={(e) => setInputLon(e.target.value)}
              placeholder="-21.94"
              className="aurora-data w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white/80 placeholder:text-white/15 focus:border-emerald-400/30 focus:outline-none focus:ring-1 focus:ring-emerald-400/10"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/30"
          >
            Go
          </button>
        </form>
      )}
    </div>
  );
};

export default LocationBar;
