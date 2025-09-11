// Client-side grid data service for Next.js
import axios from 'axios';
import { GridApiResponse } from '../types/grid.types';

class ClientGridDataService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private updateInterval: number = 60000; // 1 minute

  private isDataFresh(timestamp: number): boolean {
    return Date.now() - timestamp < this.updateInterval;
  }

  async getGridData(date?: string): Promise<GridApiResponse> {
    const cacheKey = `grid-${date || 'current'}`;
    const cached = this.cache.get(cacheKey);

    if (cached && this.isDataFresh(cached.timestamp)) {
      console.log('Using cached grid data');
      return cached.data;
    }

    console.log('Fetching fresh grid data from API...');
    try {
      const params = date ? { date } : {};
      const response = await axios.get('/api/grid-data', { params });
      const data = response.data;
      
      console.log('Grid data received:', data);
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Error fetching grid data:', error);
      console.error('Error details:', (error as any).response?.data || (error as Error).message);
      throw new Error('Failed to fetch grid data from server');
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const gridDataService = new ClientGridDataService();