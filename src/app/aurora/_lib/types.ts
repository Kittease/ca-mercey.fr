export type Coordinates = {
  lat: number;
  lon: number;
};

export type GeolocationState = Coordinates & {
  loading: boolean;
  error: string | null;
  retry: () => void;
};

/** Single OVATION aurora observation point */
export type OvationCoord = {
  Longitude: number;
  Latitude: number;
  Aurora: number;
};

/** Full OVATION JSON response */
export type OvationData = {
  Observation_Time: string;
  Forecast_Time: string;
  coordinates: OvationCoord[];
};

/** Kp index entry: [time_tag, kp_value, observed/estimated/predicted] */
export type KpEntry = [string, string, string];

/** Kp 3-day forecast entry */
export type KpForecastEntry = [string, string, string, string];

/** RTSW magnetometer entry */
export type BzEntry = {
  time_tag: string;
  bz_gsm: number | null;
};

/** Solar wind plasma entry [time_tag, density, speed, temperature] */
export type PlasmaEntry = [string, string, string, string];

/** Weather data from Open-Meteo */
export type WeatherData = {
  currentCloud: number;
  hourlyCloud: { time: string; cloud: number }[];
  loading: boolean;
  error: string | null;
};

/** Aurora data from NOAA */
export type AuroraData = {
  ovation: OvationData | null;
  kp: number | null;
  kpForecast: KpForecastEntry[];
  bz: number | null;
  solarWindSpeed: number | null;
  solarWindDensity: number | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
};

/** Individual probability factors */
export type ProbabilityFactors = {
  pGeo: number;
  fCloud: number;
  fDark: number;
  fMoon: number;
};

/** Hourly projection entry */
export type HourlyProjection = {
  time: Date;
  probability: number;
  factors: ProbabilityFactors;
};

/** Full probability result */
export type ProbabilityResult = {
  probability: number;
  factors: ProbabilityFactors;
  hourlyProjections: HourlyProjection[];
};

/** RainViewer satellite data */
export type RainViewerData = {
  satellite: {
    infrared: { path: string; time: number }[];
  };
};
