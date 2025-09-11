import React, { useMemo } from 'react';
import Head from 'next/head';
import { ArrowPathIcon, MapPinIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import LocationSearch from '../components/LocationSearch';
import LoadChart from '../components/LoadChart';
import GridStatus from '../components/GridStatus';
import { useGridData } from '../hooks/useGridData';
import { useLocation } from '../hooks/useLocation';
import { ChartDataPoint } from '../types/grid.types';
import { format } from 'date-fns';

export default function HomePage() {
  const { gridData, isLoading: gridLoading, error: gridError, refetch, lastUpdated } = useGridData();
  const { selectedLocation, disco, setSelectedLocation, isLoading: locationLoading, error: locationError } = useLocation();

  // Debug: Log hook states
  React.useEffect(() => {
    console.log('Hook states:', { gridData, gridLoading, gridError, lastUpdated });
  }, [gridData, gridLoading, gridError, lastUpdated]);

  // Debug: Test direct API call
  React.useEffect(() => {
    const testDirectCall = async () => {
      try {
        console.log('Direct API test: Starting fetch...');
        const response = await fetch('/api/grid-data');
        const data = await response.json();
        console.log('Direct API test: Success!', data);
      } catch (error) {
        console.error('Direct API test: Failed!', error);
      }
    };
    testDirectCall();
  }, []);

  // Convert grid data to chart format
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!gridData?.data?.loadProfile) return [];

    return gridData.data.loadProfile.map(point => ({
      time: point.timestamp,
      generation: point.generation,
      demand: point.demand,
      frequency: point.frequency,
    }));
  }, [gridData]);

  // Error handling for when location is selected but no DISCO found
  const locationError2 = selectedLocation && !disco ? 
    'Unable to determine grid zone for selected location' : null;

  const hasError = gridError || locationError || locationError2;

  return (
    <>
      <Head>
        <title>Nigerian National Grid Monitor | Real-time Grid Status</title>
        <meta name="description" content="Monitor Nigeria's National Grid in real-time. View power generation, demand, grid status, and outages by location with interactive charts." />
        <meta name="keywords" content="Nigerian National Grid, Power Grid Monitor, Electricity Nigeria, DISCO zones, Grid status, Power outages" />
        <link rel="canonical" href="https://natgrid-monitor.vercel.app" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">NG</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Nigerian National Grid Monitor
                  </h1>
                  <p className="text-sm text-gray-600">
                    Real-time grid performance and location-based outage tracking
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {lastUpdated && (
                  <span className="text-xs text-gray-500">
                    Last updated: {format(lastUpdated, 'HH:mm:ss')}
                  </span>
                )}
                
                <button
                  onClick={() => refetch()}
                  disabled={gridLoading}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 
                           shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 
                           bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
                           focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50
                           disabled:cursor-not-allowed"
                >
                  <ArrowPathIcon className={`h-4 w-4 mr-2 ${gridLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Location Search */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPinIcon className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-medium text-gray-900">
                  Find Your Grid Zone
                </h2>
              </div>
              
              <div className="max-w-2xl">
                <LocationSearch
                  onLocationSelect={setSelectedLocation}
                  className="w-full"
                  placeholder="Search for your location in Nigeria..."
                />
                
                {selectedLocation && disco && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Selected Location
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedLocation.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Served by
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: disco.color }}
                          ></div>
                          <span className="text-sm text-gray-600">{disco.fullName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {hasError && (
            <div className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                      Issues detected
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="space-y-1">
                        {gridError && <li>• Grid data: {gridError}</li>}
                        {locationError && <li>• Location: {locationError}</li>}
                        {locationError2 && <li>• Grid zone: {locationError2}</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Load Chart - Takes up 2 columns */}
            <div className="lg:col-span-2">
              <LoadChart
                data={chartData}
                isLoading={gridLoading && !gridData}
                height={500}
                className="h-full"
              />
            </div>

            {/* Grid Status - Takes up 1 column */}
            <div className="lg:col-span-1">
              {gridData?.data?.gridStatus && disco ? (
                <GridStatus
                  status={gridData.data.gridStatus}
                  disco={disco}
                  className="h-full"
                />
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 h-full flex items-center justify-center">
                  <div className="text-center text-gray-500 p-6">
                    {!disco ? (
                      <>
                        <MapPinIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">Select a location</p>
                        <p className="text-sm mt-1">Grid status will appear here</p>
                      </>
                    ) : gridLoading ? (
                      <>
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="font-medium">Loading grid status...</p>
                      </>
                    ) : (
                      <>
                        <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">Grid status unavailable</p>
                        <p className="text-sm mt-1">Please try refreshing</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GENCO Performance */}
            {gridData?.data?.gencos && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Generation Companies (GENCOs)
                </h3>
                
                <div className="space-y-3">
                  {gridData.data.gencos.map((genco, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{genco.name}</p>
                        <p className="text-sm text-gray-600">
                          {genco.currentOutput.toLocaleString()} MW / {genco.capacity.toLocaleString()} MW
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          genco.status === 'online' 
                            ? 'bg-success-100 text-success-700'
                            : genco.status === 'maintenance'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {genco.status}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {genco.efficiency}% efficient
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Information Panel */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About This Dashboard
              </h3>
              
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  This dashboard provides real-time monitoring of Nigeria&apos;s National Grid,
                  showing generation capacity, demand, and distribution company (DISCO) status
                  across all 36 states and the Federal Capital Territory.
                </p>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Real-time grid performance metrics</li>
                    <li>• Location-based DISCO identification</li>
                    <li>• 24-hour load profile visualization</li>
                    <li>• Grid frequency monitoring</li>
                    <li>• Server-side data fetching (no CORS issues)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Data Sources:</h4>
                  <p>
                    Grid data is sourced from Nigeria Independent System Operator (NISO) 
                    via the NIGGRID platform, fetched server-side and updated every minute.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                © 2025 Nigerian National Grid Monitor. Data provided by NISO/TCN.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Powered by Next.js & TypeScript</span>
                <span>•</span>
                <span>Built for monitoring Nigeria&apos;s power grid</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}