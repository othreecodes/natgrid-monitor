import React from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  BoltIcon,
  SignalIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  XCircleIcon as XCircleIconSolid,
} from '@heroicons/react/24/solid';
import { GridStatusProps, GridStatus as GridStatusType } from '../types/grid.types';
import { format, parseISO } from 'date-fns';

// Status indicator component
const StatusIndicator: React.FC<{
  status: 'online' | 'offline' | 'partial' | 'maintenance';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}> = ({ status, size = 'md', showLabel = true }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: CheckCircleIconSolid,
          color: 'text-success-600',
          bgColor: 'bg-success-50',
          label: 'Online',
          pulse: false
        };
      case 'offline':
        return {
          icon: XCircleIconSolid,
          color: 'text-danger-600',
          bgColor: 'bg-danger-50',
          label: 'Offline',
          pulse: true
        };
      case 'partial':
        return {
          icon: ExclamationTriangleIconSolid,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          label: 'Partial',
          pulse: true
        };
      case 'maintenance':
        return {
          icon: ClockIcon,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          label: 'Maintenance',
          pulse: false
        };
      default:
        return {
          icon: XCircleIcon,
          color: 'text-gray-400',
          bgColor: 'bg-gray-50',
          label: 'Unknown',
          pulse: false
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-center space-x-2">
      <div className={`relative ${config.bgColor} rounded-full p-1`}>
        <Icon className={`${sizeClasses[size]} ${config.color}`} />
        {config.pulse && (
          <div className={`absolute inset-0 ${config.color} rounded-full opacity-75 animate-ping`}></div>
        )}
      </div>
      {showLabel && (
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
      )}
    </div>
  );
};

// Main grid status component
export const GridStatus: React.FC<GridStatusProps> = ({ 
  status, 
  disco, 
  className = "" 
}) => {
  const formatLastUpdated = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), 'MMM dd, HH:mm');
    } catch {
      return 'Unknown';
    }
  };

  const getGridHealthScore = () => {
    const onlineDiscos = Object.values(status.discoStatuses).filter(
      disco => disco.status === 'online'
    ).length;
    const totalDiscos = Object.keys(status.discoStatuses).length;
    return Math.round((onlineDiscos / totalDiscos) * 100);
  };

  const getTotalOutages = () => {
    return Object.values(status.discoStatuses).reduce(
      (total, disco) => total + disco.outages, 0
    );
  };

  const healthScore = getGridHealthScore();
  const totalOutages = getTotalOutages();
  const supplyDemandRatio = ((status.totalGeneration / status.totalDemand) * 100);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Grid Status</h3>
            <p className="text-sm text-gray-600 mt-1">
              Real-time grid performance for {disco.fullName}
            </p>
          </div>
          <StatusIndicator 
            status={status.isOnline ? 'online' : 'offline'} 
            size="lg" 
          />
        </div>
      </div>

      {/* Main metrics */}
      <div className="p-6 space-y-6">
        {/* Overall status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <BoltIcon className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {status.totalGeneration.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">MW Generated</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <SignalIcon className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {status.totalDemand.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">MW Demand</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <div className={`w-3 h-3 rounded-full ${
                status.frequency >= 49.5 && status.frequency <= 50.5
                  ? 'bg-success-500'
                  : 'bg-danger-500'
              }`}></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {status.frequency.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Hz Frequency</p>
          </div>
        </div>

        {/* Supply-demand analysis */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Supply vs Demand</h4>
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
              supplyDemandRatio >= 100
                ? 'bg-success-100 text-success-700'
                : supplyDemandRatio >= 80
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-danger-100 text-danger-700'
            }`}>
              {supplyDemandRatio.toFixed(1)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                supplyDemandRatio >= 100
                  ? 'bg-success-500'
                  : supplyDemandRatio >= 80
                  ? 'bg-yellow-500'
                  : 'bg-danger-500'
              }`}
              style={{ width: `${Math.min(100, supplyDemandRatio)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Generation: {status.totalGeneration.toLocaleString()} MW</span>
            <span>Demand: {status.totalDemand.toLocaleString()} MW</span>
          </div>
        </div>

        {/* Your DISCO status */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Your Distribution Zone</h4>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: disco.color }}
              ></div>
              <span className="text-sm font-medium">{disco.name}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <StatusIndicator 
                status={status.discoStatuses[disco.id]?.status || 'offline'} 
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Load</span>
              <span className="text-sm font-medium text-gray-900">
                {status.discoStatuses[disco.id]?.load?.toLocaleString() || 'N/A'} MW
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Reported Outages</span>
              <span className={`text-sm font-medium ${
                (status.discoStatuses[disco.id]?.outages || 0) === 0
                  ? 'text-success-600'
                  : (status.discoStatuses[disco.id]?.outages || 0) <= 2
                  ? 'text-yellow-600'
                  : 'text-danger-600'
              }`}>
                {status.discoStatuses[disco.id]?.outages || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Coverage Area</span>
              <span className="text-sm text-gray-600">
                {disco.states.slice(0, 2).join(', ')}
                {disco.states.length > 2 && ` +${disco.states.length - 2} more`}
              </span>
            </div>
          </div>
        </div>

        {/* National grid health */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">National Grid Health</h4>
            <span className={`text-lg font-bold ${
              healthScore >= 90
                ? 'text-success-600'
                : healthScore >= 70
                ? 'text-yellow-600'
                : 'text-danger-600'
            }`}>
              {healthScore}%
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">DISCOs Online</span>
              <span className="font-medium">
                {Object.values(status.discoStatuses).filter(d => d.status === 'online').length}/11
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Outages</span>
              <span className={`font-medium ${
                totalOutages === 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {totalOutages}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: {formatLastUpdated(status.lastUpdated)}</span>
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span>Real-time data</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default GridStatus;