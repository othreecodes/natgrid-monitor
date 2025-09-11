# Nigerian National Grid Monitor - Next.js SSR

A professional **Server-Side Rendered** React application for monitoring Nigeria's National Grid in real-time. This dashboard provides location-based grid status, power generation/demand tracking, and Distribution Company (DISCO) zone mapping with interactive visualizations

## ✨ Features

### New SSR Features
- 🚀 **Server-Side Rendering** with Next.js for optimal performance
- 🔄 **Direct API Access** - No more CORS issues! Server fetches data directly from niggrid.org
- ⚡ **Real-time Data** from actual Nigerian Grid API 
- 🏗️ **Production Ready** with Docker deployment
- 🌐 **SEO Optimized** with proper meta tags and structured data

### Key Features
- 🔍 **Location Search**: Google Maps integration for finding your grid zone
- 📊 **Interactive Charts**: Real-time load profiles and grid frequency monitoring  
- 🗺️ **DISCO Zone Mapping**: Automatic detection of your electricity distribution company
- ⚡ **Grid Status**: Live monitoring of national grid health and outages
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🐳 **Docker Support**: Easy deployment with containerization

## Technology Stack

- **Frontend**: Next.js 13 + React 18 + TypeScript
- **Styling**: Tailwind CSS + Heroicons
- **Charts**: Recharts for data visualization
- **Maps**: Google Maps Places API
- **Backend**: Next.js API Routes (Server-Side Rendering)
- **Deployment**: Docker with standalone output

## 🚀 Quick Start

<details>
<summary><strong>Prerequisites</strong></summary>

- Node.js 18+ 
- Docker (optional but recommended)
- Google Maps API key
</details>

<details>
<summary><strong>1. Clone and Install</strong></summary>

```bash
git clone https://github.com/othreecodes/natgrid-monitor.git
cd natgrid-monitor
npm install
```
</details>

<details>
<summary><strong>2. Environment Setup</strong></summary>

Copy the environment template:

```bash
cp .env.example .env.local
```

Configure your environment variables:

```env
# Google Maps API Key (Client-side)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Google Maps API Key (Server-side) - Can be the same key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Nigerian Grid API Configuration (Server-side only)
GRID_API_ENDPOINT=https://niggrid.org
GRID_UPDATE_INTERVAL=60000

# Application Configuration (Client-side)
NEXT_PUBLIC_DEFAULT_LOCATION_LAT=9.0765
NEXT_PUBLIC_DEFAULT_LOCATION_LNG=7.3986
NEXT_PUBLIC_GRID_UPDATE_INTERVAL=60000
```
</details>

<details>
<summary><strong>3. Google Maps API Setup</strong></summary>

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Places API  
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security
</details>

<details>
<summary><strong>4. Run Development Server</strong></summary>

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.
</details>

## 🐳 Docker Deployment

<details>
<summary><strong>Development</strong></summary>

```bash
# Build and run with Docker Compose
docker-compose up --build
```
</details>

<details>
<summary><strong>Production</strong></summary>

```bash
# Build production image
docker build -t natgrid-monitor .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key \
  -e GOOGLE_MAPS_API_KEY=your_api_key \
  natgrid-monitor
```
</details>

## Project Structure

```
├── components/          # React components
│   ├── LocationSearch.tsx # Google Maps search
│   ├── LoadChart.tsx    # Power generation charts
│   └── GridStatus.tsx   # Grid status indicators
├── hooks/              # Custom React hooks
│   ├── useGridData.ts  # Grid data management
│   └── useLocation.ts  # Location state management
├── lib/                # Utility libraries
│   ├── gridDataService.ts # Client-side service
│   └── zoneMapping.ts  # DISCO zone calculations
├── pages/              # Next.js pages
│   ├── api/            # API routes (SSR)
│   │   ├── grid-data.ts # Nigerian grid API proxy
│   │   └── health.ts   # Health check endpoint
│   ├── _app.tsx        # App wrapper
│   ├── _document.tsx   # Document template
│   └── index.tsx       # Main dashboard page
├── types/              # TypeScript definitions
│   └── grid.types.ts   # Grid data interfaces
└── styles/             # Global styles
    └── globals.css     # Tailwind + custom styles
```

## 🏗️ Architecture

<details>
<summary><strong>Server-Side Rendering Architecture</strong></summary>

### API Routes (`/pages/api/`)

- **`/api/grid-data`**: Fetches real-time data from niggrid.org server-side
- **`/api/health`**: Health check endpoint for monitoring

### Data Flow

1. **Client Request**: Browser requests data from `/api/grid-data`
2. **Server Processing**: Next.js API route fetches data from niggrid.org 
3. **Session Management**: Handles ASP.NET Web Forms authentication
4. **Data Parsing**: Extracts hourly generation profiles from HTML
5. **Response**: Returns structured JSON to client

</details>

### 📊 Real-Time Chart Projections

<details>
<summary><strong>How Projection Algorithm Works</strong></summary>

The system generates intelligent projections when real-time data is limited, especially during early morning hours:

#### 1. **Daily Load Curve Simulation**
```typescript
const timeMultiplier = 0.7 + 0.3 * Math.sin((hour - 6) * Math.PI / 12);
```
- **Sine wave** pattern shifted by 6 hours to peak around midday
- **Base level** of 70% capacity with 30% variation
- **Peak hours**: 12-18 (noon to 6pm) - highest demand
- **Low hours**: 0-6 (midnight to 6am) - lowest demand

#### 2. **Deterministic Randomness**
```typescript
const hourSeed = hour + new Date(date).getDate();
const randomGen = Math.sin(hourSeed * 12.9898) * 43758.5453;
const normalizedRandom = randomGen - Math.floor(randomGen);
```
- **Consistent**: Same hour on same date produces identical values
- **Varying**: Different hours/dates produce realistic variations
- **Bounded**: Output between 0-1 for predictable scaling

#### 3. **Realistic Grid Parameters**
```typescript
const generation = Math.round(baseGeneration * timeMultiplier + (normalizedRandom - 0.5) * 400);
const demand = Math.round(baseDemand * timeMultiplier + (normalizedRandom - 0.3) * 300);
const frequency = 50.0 + (normalizedRandom - 0.5) * 0.6;
```
- **Generation**: 4000MW base ± 400MW variation
- **Demand**: 4200MW base ± 300MW variation (typically higher than generation)
- **Frequency**: 50Hz ± 0.6Hz (realistic grid frequency range)

#### 4. **Trigger Logic**
Projections activate when:
- It's **today's date** AND
- Less than **3 hours** of current data available
- Generates up to **3 additional future hours**

This ensures the chart always displays meaningful data, even during early morning hours.
</details>

## 🗺️ DISCO Coverage Areas

<details>
<summary><strong>LGA-Based Mapping System</strong></summary>

The application uses a **comprehensive LGA-based mapping system** covering all 774 Local Government Areas in Nigeria. Locations are automatically mapped to their serving Distribution Companies using a three-step process:

1. **LGA-based mapping** (Primary) - Exact Local Government Area matching
2. **Coordinate-based mapping** (Fallback) - Geographic boundary checking  
3. **Distance-based mapping** (Last resort) - Closest DISCO calculation

### Distribution Companies Coverage

| DISCO | States/Areas Covered | LGAs Mapped |
|-------|---------------------|-------------|
| **Abuja DISCO** | FCT, Niger, Nassarawa, Kogi, Benue | 103 LGAs |
| **Benin DISCO** | Edo, Delta, Ondo, Ekiti | 94 LGAs |
| **Eko DISCO** | Lagos Island, Apapa, Eti-Osa, Surulere, Lagos Mainland | 5 LGAs |
| **Enugu DISCO** | Enugu, Anambra, Abia, Imo, Ebonyi | 95 LGAs |
| **Ibadan DISCO** | Oyo, Osun, Kwara, most of Ogun | 94 LGAs |
| **Ikeja DISCO** | Lagos Mainland, Alimosho, Badagry, Ikorodu + border Ogun areas | 19 LGAs |
| **Jos DISCO** | Plateau, Bauchi, Gombe | 48 LGAs |
| **Kaduna DISCO** | Kaduna, Kebbi, Sokoto, Zamfara | 101 LGAs |
| **Kano DISCO** | Kano, Katsina, Jigawa | 101 LGAs |
| **Port Harcourt DISCO** | Rivers, Bayelsa, Cross River, Akwa Ibom | 79 LGAs |
| **Yola DISCO** | Adamawa, Taraba, Borno, Yobe | 75 LGAs |

### Smart Location Detection

The system handles various location formats and common variations:

- **Direct LGA names**: "Ikeja", "Alimosho", "Port Harcourt"
- **Area variations**: "Mainland" → Lagos Mainland, "Island" → Lagos Island  
- **Abbreviations**: "VI" → Victoria Island, "Festac" → Amuwo-Odofin
- **Common locations**: "Lekki" → Eti-Osa, "Yaba" → Yaba LGA
</details>

## 📚 Data Sources & References

<details>
<summary><strong>Grid Data Sources</strong></summary>

- **Primary Source**: Nigeria Independent System Operator (NISO) via NIGGRID platform
- **API Endpoint**: https://niggrid.org
- **Update Frequency**: Every 60 seconds (configurable)
- **Data Processing**: Server-side HTML parsing and JSON transformation
</details>

<details>
<summary><strong>Location & Administrative Data</strong></summary>

- **Location Search**: Google Maps Places API with Geocoding
- **LGA Database**: Official Nigerian Local Government Areas dataset
  - Source: [Nigerian States and LGAs JSON](https://gist.githubusercontent.com/chrisidakwo/4ba3a4f03afc442305021be4ca67738e/raw/a8276ee3a756ae47ee853c4be5a82a11d6c8a313/nigerian-states.json)
  - Coverage: All 774 LGAs across 36 states + FCT
  - Last Updated: 2024
</details>

<details>
<summary><strong>DISCO Mapping Research</strong></summary>

- **Academic Reference**: Power distribution company service areas analysis
- **File**: `1-s2.0-S2352484721000263-main.pdf` (Research paper on Nigerian electricity distribution)
- **Verification**: Cross-referenced with official DISCO coverage maps
- **Methodology**: Comprehensive LGA-to-DISCO assignment based on:
  - Official DISCO service area documentation
  - Geographic proximity analysis
  - Administrative boundary considerations
  - Academic research validation

### Technical Implementation
- **Mapping Algorithm**: Three-tier fallback system (LGA → Coordinates → Distance)
- **Address Parsing**: Intelligent extraction of LGA names from free-text addresses
- **Normalization**: Handles spaces, hyphens, and case variations in LGA names
- **Debugging**: Comprehensive console logging for mapping verification
</details>

## 💻 Development

<details>
<summary><strong>Available Scripts</strong></summary>

```bash
npm run dev        # Development server with hot reload
npm run build      # Production build
npm start          # Production server
npm run lint       # ESLint code quality check
npm run type-check # TypeScript type checking
```
</details>

<details>
<summary><strong>Environment Variables</strong></summary>

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (client) | Yes | - |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key (server) | Yes | - |
| `GRID_API_ENDPOINT` | Nigerian grid API URL | No | `https://niggrid.org` |
| `GRID_UPDATE_INTERVAL` | Data refresh interval (ms) | No | `60000` |
| `NEXT_PUBLIC_DEFAULT_LOCATION_LAT` | Default latitude | No | `9.0765` (Abuja) |
| `NEXT_PUBLIC_DEFAULT_LOCATION_LNG` | Default longitude | No | `7.3986` (Abuja) |
</details>

## 📡 API Documentation

<details>
<summary><strong>GET `/api/grid-data`</strong></summary>

Fetches comprehensive grid data including generation, demand, and status.

**Query Parameters:**
- `date` (optional): Date in YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "data": {
    "readings": [],
    "loadProfile": [],
    "gencos": [],
    "gridStatus": {}
  },
  "timestamp": "2025-01-09T12:00:00.000Z"
}
```
</details>

<details>
<summary><strong>GET `/api/health`</strong></summary>

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-09T12:00:00.000Z",
  "uptime": 3600.5,
  "environment": "production",
  "version": "1.0.0"
}
```
</details>


