// Location and Geography Types
export interface Location {
  lat: number;
  lng: number;
  address: string;
  placeId?: string;
}

export interface DiscoZone {
  id: string;
  name: string;
  fullName: string;
  states: string[];
  coordinates: {
    center: Location;
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
  color: string;
  status: 'online' | 'offline' | 'maintenance' | 'partial';
}

// Grid Data Types
export interface GridReading {
  timestamp: string;
  generation: number; // MW
  frequency: number; // Hz
  voltage: number; // kV
  status: 'normal' | 'warning' | 'critical';
}

export interface LoadData {
  hour: number;
  generation: number;
  demand: number;
  frequency: number;
  timestamp: string;
}

export interface GencoData {
  name: string;
  capacity: number;
  currentOutput: number;
  status: 'online' | 'offline' | 'maintenance';
  efficiency: number;
}

export interface GridStatus {
  isOnline: boolean;
  totalGeneration: number;
  totalDemand: number;
  frequency: number;
  lastUpdated: string;
  discoStatuses: {
    [discoId: string]: {
      status: 'online' | 'offline' | 'partial';
      load: number;
      outages: number;
    };
  };
}

// API Response Types
export interface GridApiResponse {
  success: boolean;
  data: {
    readings: GridReading[];
    loadProfile: LoadData[];
    gencos: GencoData[];
    gridStatus: GridStatus;
  };
  timestamp: string;
}

// Chart Data Types
export interface ChartDataPoint {
  time: string;
  generation: number;
  demand: number;
  frequency: number;
}

// Component Props Types
export interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  placeholder?: string;
  className?: string;
}

export interface LoadChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
  height?: number;
  className?: string;
}

export interface GridStatusProps {
  status: GridStatus;
  disco: DiscoZone;
  className?: string;
}

// Hook Types
export interface UseGridDataReturn {
  gridData: GridApiResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export interface UseLocationReturn {
  currentLocation: Location | null;
  selectedLocation: Location | null;
  disco: DiscoZone | null;
  setSelectedLocation: (location: Location) => void;
  isLoading: boolean;
  error: string | null;
}

// Utility Types
export type GridMetric = 'generation' | 'demand' | 'frequency' | 'voltage';
export type TimeRange = '24h' | '7d' | '30d';
export type ChartType = 'line' | 'area' | 'bar';