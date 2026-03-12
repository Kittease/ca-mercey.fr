const SWPC_BASE = "https://services.swpc.noaa.gov";

export const API_URLS = {
  OVATION: `${SWPC_BASE}/json/ovation_aurora_latest.json`,
  KP_OBSERVED: `${SWPC_BASE}/products/noaa-planetary-k-index.json`,
  KP_FORECAST: `${SWPC_BASE}/products/noaa-planetary-k-index-forecast.json`,
  BZ: `${SWPC_BASE}/json/rtsw/rtsw_mag_1m.json`,
  PLASMA: `${SWPC_BASE}/products/solar-wind/plasma-1-day.json`,
  OPEN_METEO: "https://api.open-meteo.com/v1/forecast",
  RAINVIEWER: "https://api.rainviewer.com/public/weather-maps.json",
} as const;

export const POLLING_INTERVALS = {
  AURORA_DATA: 60_000,
  WEATHER_DATA: 300_000,
} as const;

export const DEFAULTS = {
  /** Reykjavik, Iceland */
  LAT: 64.1466,
  LON: -21.9426,
} as const;

export const CARTO_DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export const KP_THRESHOLDS = {
  LOW: 3,
  MODERATE: 5,
  HIGH: 7,
} as const;

export const BZ_THRESHOLDS = {
  FAVORABLE: -5,
  STRONG: -10,
  EXTREME: -20,
} as const;
