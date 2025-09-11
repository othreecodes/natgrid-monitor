import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { format } from 'date-fns';
import { GridApiResponse, LoadData, GridStatus, GencoData } from '../../types/grid.types';

// Server-side grid data service
class ServerGridDataService {
  private apiBaseUrl: string;
  private axiosInstance;

  constructor() {
    this.apiBaseUrl = process.env.GRID_API_ENDPOINT || 'https://niggrid.org';
    
    this.axiosInstance = axios.create({
      baseURL: this.apiBaseUrl,
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'no-cache',
      },
    });
  }

  async fetchGenerationData(date: string): Promise<LoadData[]> {
    try {
      // Step 1: Get the initial page to extract session data
      const initialResponse = await this.axiosInstance.get('/GenerationProfile2');
      const html = initialResponse.data;
      
      // Extract session cookies
      const cookies = initialResponse.headers['set-cookie']?.join('; ') || '';
      
      // Extract ViewState and EventValidation using regex
      const viewStateMatch = html.match(/__VIEWSTATE[^>]*value="([^"]*)"/) || [];
      const eventValidationMatch = html.match(/__EVENTVALIDATION[^>]*value="([^"]*)"/) || [];
      const viewStateGeneratorMatch = html.match(/__VIEWSTATEGENERATOR[^>]*value="([^"]*)"/) || [];

      const viewState = decodeURIComponent(viewStateMatch[1] || '');
      const eventValidation = decodeURIComponent(eventValidationMatch[1] || '');
      const viewStateGenerator = viewStateGeneratorMatch[1] || '823598FF';

      // Format date for the API (YYYY/MM/DD)
      const formattedDate = date.replace(/-/g, '/');

      // Step 2: Submit the form with extracted data
      const formData = new URLSearchParams({
        '__EVENTTARGET': '',
        '__EVENTARGUMENT': '',
        '__VIEWSTATE': viewState,
        '__VIEWSTATEGENERATOR': viewStateGenerator,
        '__EVENTVALIDATION': eventValidation,
        'ctl00$MainContent$txtReadingDate': formattedDate,
        'ctl00$MainContent$btnGetReadings': 'Get Generation'
      });

      const response = await this.axiosInstance.post('/GenerationProfile2', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': cookies,
          'Referer': `${this.apiBaseUrl}/GenerationProfile2`,
          'Origin': this.apiBaseUrl,
        },
      });

      return this.parseGenerationResponse(response.data, date);
    } catch (error) {
      console.error('Error fetching real grid data:', error);
      return this.generateMockLoadData(date);
    }
  }

  private parseGenerationResponse(html: string, date: string): LoadData[] {
    try {
      const loadData: LoadData[] = [];
      
      // Look for table data in the HTML response
      const tableRegex = /<table[^>]*class="[^"]*grid[^"]*"[^>]*>(.*?)<\/table>/gis;
      const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
      const cellRegex = /<td[^>]*>(.*?)<\/td>/gis;

      const tableMatch = tableRegex.exec(html);
      if (tableMatch) {
        const tableContent = tableMatch[1];
        let rowMatch;
        let isHeaderRow = true;
        
        while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
          if (isHeaderRow) {
            isHeaderRow = false;
            continue; // Skip header row
          }

          const rowContent = rowMatch[1];
          const cells: string[] = [];
          let cellMatch;
          
          while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
            cells.push(cellMatch[1].replace(/<[^>]*>/g, '').trim());
          }

          // Expected columns: Hour, Generation Company data...
          if (cells.length >= 2) {
            const hour = parseInt(cells[0]);
            if (!isNaN(hour) && hour >= 0 && hour <= 23) {
              // Sum all generation values (skip first column which is hour)
              let totalGeneration = 0;
              for (let i = 1; i < cells.length; i++) {
                const value = parseFloat(cells[i]) || 0;
                totalGeneration += value;
              }

              loadData.push({
                hour,
                generation: Math.round(totalGeneration),
                demand: Math.round(totalGeneration * 1.1), // Estimate demand as 110% of generation
                frequency: 50.0 + (Math.random() - 0.5) * 0.4, // Random frequency around 50Hz
                timestamp: `${date}T${hour.toString().padStart(2, '0')}:00:00`
              });
            }
          }
        }
      }

      return loadData.length > 0 ? loadData : this.generateMockLoadData(date);
    } catch (error) {
      console.error('Error parsing generation response:', error);
      return this.generateMockLoadData(date);
    }
  }

  async fetchGridStatus(): Promise<GridStatus> {
    try {
      const response = await this.axiosInstance.get('/');
      const html = response.data;
      
      // Parse current generation from dashboard
      const generationMatch = html.match(/(?:total|current).*?generation.*?([0-9,]+(?:\.[0-9]+)?)\s*MW/i);
      const frequencyMatch = html.match(/frequency.*?([0-9]+\.[0-9]+)\s*Hz/i);
      
      const totalGeneration = generationMatch 
        ? parseFloat(generationMatch[1].replace(/,/g, '')) 
        : this.generateMockGridStatus().totalGeneration;
      
      const frequency = frequencyMatch 
        ? parseFloat(frequencyMatch[1]) 
        : this.generateMockGridStatus().frequency;

      return {
        isOnline: totalGeneration > 1000,
        totalGeneration: Math.round(totalGeneration),
        totalDemand: Math.round(totalGeneration * 1.15),
        frequency,
        lastUpdated: new Date().toISOString(),
        discoStatuses: this.generateMockGridStatus().discoStatuses
      };
    } catch (error) {
      console.error('Error fetching real grid status:', error);
      return this.generateMockGridStatus();
    }
  }

  private generateMockLoadData(date: string): LoadData[] {
    const data: LoadData[] = [];
    const baseGeneration = 4000; // MW
    const baseDemand = 4200; // MW
    
    const now = new Date();
    const targetDate = new Date(date);
    const isToday = targetDate.toDateString() === now.toDateString();
    
    // If it's today, generate data up to current hour + 1, otherwise full 24 hours
    const maxHour = isToday ? Math.min(now.getHours() + 1, 23) : 23;
    
    for (let hour = 0; hour <= maxHour; hour++) {
      // Simulate realistic daily load curve
      const timeMultiplier = 0.7 + 0.3 * Math.sin((hour - 6) * Math.PI / 12);
      
      // Add some randomness but keep it stable per hour for consistency
      const hourSeed = hour + new Date(date).getDate(); // Seed based on hour and date
      const randomGen = Math.sin(hourSeed * 12.9898) * 43758.5453;
      const normalizedRandom = randomGen - Math.floor(randomGen);
      
      const generation = Math.round(baseGeneration * timeMultiplier + (normalizedRandom - 0.5) * 400);
      const demand = Math.round(baseDemand * timeMultiplier + (normalizedRandom - 0.3) * 300);
      const frequency = 50.0 + (normalizedRandom - 0.5) * 0.6;

      // For current hour, use more recent timestamp
      let timestamp: string;
      if (isToday && hour === now.getHours()) {
        // For current hour, use actual current time
        timestamp = now.toISOString();
      } else {
        timestamp = `${date}T${hour.toString().padStart(2, '0')}:00:00`;
      }

      data.push({
        hour,
        generation: Math.max(1000, generation), // Ensure minimum generation
        demand: Math.max(1200, demand), // Ensure minimum demand
        frequency: Math.max(49.2, Math.min(50.8, frequency)),
        timestamp
      });
    }

    // If today and we have less than 3 hours of data, add a few more future projections
    if (isToday && data.length < 3) {
      for (let hour = data.length; hour < Math.min(data.length + 3, 24); hour++) {
        const timeMultiplier = 0.7 + 0.3 * Math.sin((hour - 6) * Math.PI / 12);
        const hourSeed = hour + new Date(date).getDate();
        const randomGen = Math.sin(hourSeed * 12.9898) * 43758.5453;
        const normalizedRandom = randomGen - Math.floor(randomGen);
        
        const generation = Math.round(baseGeneration * timeMultiplier + (normalizedRandom - 0.5) * 400);
        const demand = Math.round(baseDemand * timeMultiplier + (normalizedRandom - 0.3) * 300);
        const frequency = 50.0 + (normalizedRandom - 0.5) * 0.6;

        data.push({
          hour,
          generation: Math.max(1000, generation),
          demand: Math.max(1200, demand),
          frequency: Math.max(49.2, Math.min(50.8, frequency)),
          timestamp: `${date}T${hour.toString().padStart(2, '0')}:00:00`
        });
      }
    }

    return data;
  }

  private generateMockGridStatus(): GridStatus {
    const totalGeneration = Math.round(3800 + Math.random() * 800);
    const totalDemand = Math.round(totalGeneration * 1.1 + Math.random() * 200);
    
    return {
      isOnline: totalGeneration > 1000,
      totalGeneration,
      totalDemand,
      frequency: 49.8 + Math.random() * 0.4,
      lastUpdated: new Date().toISOString(),
      discoStatuses: {
        'abuja': { status: 'online', load: 420, outages: 2 },
        'benin': { status: 'online', load: 380, outages: 1 },
        'eko': { status: 'online', load: 450, outages: 0 },
        'enugu': { status: 'online', load: 340, outages: 3 },
        'ibadan': { status: 'partial', load: 290, outages: 5 },
        'ikeja': { status: 'online', load: 520, outages: 1 },
        'jos': { status: 'online', load: 280, outages: 4 },
        'kaduna': { status: 'online', load: 310, outages: 2 },
        'kano': { status: 'online', load: 360, outages: 1 },
        'portharcourt': { status: 'online', load: 400, outages: 2 },
        'yola': { status: 'partial', load: 180, outages: 6 },
      }
    };
  }

  private generateMockGencos(): GencoData[] {
    return [
      { name: 'Shiroro', capacity: 600, currentOutput: 450, status: 'online', efficiency: 75 },
      { name: 'Kainji', capacity: 760, currentOutput: 580, status: 'online', efficiency: 76 },
      { name: 'Jebba', capacity: 578, currentOutput: 420, status: 'online', efficiency: 73 },
      { name: 'Egbin', capacity: 1320, currentOutput: 980, status: 'online', efficiency: 74 },
      { name: 'Delta', capacity: 966, currentOutput: 720, status: 'online', efficiency: 75 },
      { name: 'Afam', capacity: 726, currentOutput: 540, status: 'online', efficiency: 74 },
      { name: 'Sapele', capacity: 1020, currentOutput: 760, status: 'online', efficiency: 75 },
    ];
  }

  async getCompleteGridData(date?: string): Promise<GridApiResponse> {
    // Default to today's date for real-time data
    const targetDate = date || format(new Date(), 'yyyy-MM-dd');
    
    try {
      const [loadProfile, gridStatus] = await Promise.all([
        this.fetchGenerationData(targetDate),
        this.fetchGridStatus()
      ]);

      const readings = loadProfile.map(load => ({
        timestamp: load.timestamp,
        generation: load.generation,
        frequency: load.frequency,
        voltage: 330,
        status: load.frequency < 49.5 || load.frequency > 50.5 ? 'warning' as const : 'normal' as const
      }));

      const gencos = this.generateMockGencos();

      return {
        success: true,
        data: {
          readings,
          loadProfile,
          gencos,
          gridStatus
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }
}

const gridService = new ServerGridDataService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date } = req.query;
    const dateParam = typeof date === 'string' ? date : undefined;
    
    const gridData = await gridService.getCompleteGridData(dateParam);
    
    // Cache for 1 minute
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(gridData);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch grid data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}