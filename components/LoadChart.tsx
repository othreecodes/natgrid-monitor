import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { LoadChartProps, ChartDataPoint } from '../types/grid.types';

// Custom tooltip component
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{`Time: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toLocaleString()} MW`}
          </p>
        ))}
        {payload.find((entry: any) => entry.dataKey === 'frequency') && (
          <p className="text-sm text-gray-600 mt-1">
            Frequency: {payload.find((entry: any) => entry.dataKey === 'frequency')?.value.toFixed(2)} Hz
          </p>
        )}
      </div>
    );
  }
  return null;
};

// Loading skeleton component
const ChartSkeleton: React.FC<{ height: number }> = ({ height }) => (
  <div className="animate-pulse" style={{ height }}>
    <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-gray-400 text-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2"></div>
        <p>Loading chart data...</p>
      </div>
    </div>
  </div>
);

export const LoadChart: React.FC<LoadChartProps> = ({
  data,
  isLoading = false,
  height = 400,
  className = ""
}) => {
  // Process data for chart display
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    return data.map((point, index) => {
      const pointTime = parseISO(point.time);
      const pointHour = pointTime.getHours();
      const pointMinute = pointTime.getMinutes();
      
      // Check if this is the current time point (within last hour)
      const isCurrentTime = pointHour === currentHour && 
        (pointMinute === 0 || Math.abs(now.getTime() - pointTime.getTime()) < 3600000); // Within 1 hour
      
      // Format time with LIVE indicator for current data
      let timeLabel = format(pointTime, 'HH:mm');
      if (isCurrentTime && index === data.length - 1) {
        timeLabel = `${timeLabel} LIVE`;
      }
      
      return {
        time: timeLabel,
        fullTime: format(pointTime, 'MMM dd, HH:mm'),
        generation: Math.round(point.generation),
        demand: Math.round(point.demand),
        frequency: parseFloat(point.frequency.toFixed(2)),
        deficit: Math.max(0, point.demand - point.generation),
        surplus: Math.max(0, point.generation - point.demand),
        isLive: isCurrentTime && index === data.length - 1,
      };
    });
  }, [data]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const totalGeneration = chartData.reduce((sum, point) => sum + point.generation, 0);
    const totalDemand = chartData.reduce((sum, point) => sum + point.demand, 0);
    const avgFrequency = chartData.reduce((sum, point) => sum + point.frequency, 0) / chartData.length;
    const maxGeneration = Math.max(...chartData.map(point => point.generation));
    const minGeneration = Math.min(...chartData.map(point => point.generation));
    const maxDemand = Math.max(...chartData.map(point => point.demand));

    return {
      avgGeneration: Math.round(totalGeneration / chartData.length),
      avgDemand: Math.round(totalDemand / chartData.length),
      avgFrequency: parseFloat(avgFrequency.toFixed(2)),
      maxGeneration,
      minGeneration,
      maxDemand,
      supplyReliability: ((totalGeneration / totalDemand) * 100).toFixed(1),
    };
  }, [chartData]);

  if (isLoading) {
    return <ChartSkeleton height={height} />;
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm">Grid data will appear here when available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Chart Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Grid Load Profile</h3>
            <p className="text-sm text-gray-600 mt-1">
              {chartData.length > 0 && chartData[chartData.length - 1]?.isLive 
                ? `Live data up to ${format(new Date(), 'HH:mm')} today`
                : `${chartData.length}-hour generation and demand chart`
              }
            </p>
          </div>
          
          {stats && (
            <div className="flex space-x-6 text-sm">
              <div className="text-center">
                <p className="text-gray-500">Avg Generation</p>
                <p className="font-semibold text-primary-600">{stats.avgGeneration.toLocaleString()} MW</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Avg Demand</p>
                <p className="font-semibold text-gray-900">{stats.avgDemand.toLocaleString()} MW</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Frequency</p>
                <p className={`font-semibold ${
                  stats.avgFrequency >= 49.5 && stats.avgFrequency <= 50.5 
                    ? 'text-success-600' 
                    : 'text-danger-600'
                }`}>
                  {stats.avgFrequency} Hz
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Reliability</p>
                <p className={`font-semibold ${
                  parseFloat(stats.supplyReliability) >= 95 
                    ? 'text-success-600' 
                    : parseFloat(stats.supplyReliability) >= 80
                    ? 'text-yellow-600'
                    : 'text-danger-600'
                }`}>
                  {stats.supplyReliability}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={height - 140}>
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="generationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            
            <XAxis 
              dataKey="time" 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
            />
            
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value.toLocaleString()}`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            
            {/* Reference lines for frequency */}
            <ReferenceLine y={4000} stroke="#10B981" strokeDasharray="5 5" opacity={0.6} />
            
            <Area
              type="monotone"
              dataKey="demand"
              stackId="1"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#demandGradient)"
              name="Demand"
            />
            
            <Area
              type="monotone"
              dataKey="generation"
              stackId="1"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#generationGradient)"
              name="Generation"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Frequency Chart */}
      <div className="px-6 pb-6">
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Grid Frequency (Hz)</h4>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="time" 
                stroke="#6B7280"
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                domain={[49.0, 51.0]}
                stroke="#6B7280"
                fontSize={10}
                tickLine={false}
                tickFormatter={(value) => `${value.toFixed(1)}`}
              />
              
              {/* Reference lines for acceptable frequency range */}
              <ReferenceLine y={49.5} stroke="#FCD34D" strokeDasharray="3 3" opacity={0.8} />
              <ReferenceLine y={50.5} stroke="#FCD34D" strokeDasharray="3 3" opacity={0.8} />
              <ReferenceLine y={50.0} stroke="#10B981" strokeDasharray="2 2" opacity={0.6} />
              
              <Line
                type="monotone"
                dataKey="frequency"
                stroke="#8B5CF6"
                strokeWidth={1.5}
                dot={false}
                name="Frequency"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LoadChart;