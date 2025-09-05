import React, { useState, useCallback } from 'react';
import { ConnectedAccount, StreamingPlatformId } from '../../types';
import { STREAMING_PLATFORMS } from '../../services/mockData';
import Card from '../ui/Card';
import Button from '../ui/Button';

const MOCK_ANALYTICS_DATA = [
  { name: 'Twitch', viewers: 4500, followers: 120 },
  { name: 'YouTube', viewers: 3200, followers: 85 },
  { name: 'Kick', viewers: 1500, followers: 200 },
];

const AnalyticsChart: React.FC = () => {
    const Recharts = (window as any).Recharts;

    if (!Recharts) {
        return (
            <div className="flex items-center justify-center h-full text-brand-text-dark">
              Loading analytics...
            </div>
        );
    }
    
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = Recharts;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_ANALYTICS_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #4b5563' }}
                    labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="viewers" fill="#f59e0b" name="Live Viewers" />
                <Bar dataKey="followers" fill="#38bdf8" name="New Followers" />
            </BarChart>
        </ResponsiveContainer>
    );
}

const StreamingTab: React.FC = () => {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([
    { id: '1', platformId: StreamingPlatformId.TWITCH, username: 'NovaStream', connectedAt: new Date().toISOString() },
  ]);
  const [isConnecting, setIsConnecting] = useState<StreamingPlatformId | null>(null);

  const handleConnect = useCallback((platformId: StreamingPlatformId) => {
    setIsConnecting(platformId);
    // Simulate OAuth flow
    setTimeout(() => {
      if (!connectedAccounts.some(acc => acc.platformId === platformId)) {
        setConnectedAccounts(prev => [...prev, {
          id: `${Date.now()}`,
          platformId,
          username: 'NovaStream', // mock username
          connectedAt: new Date().toISOString(),
        }]);
      }
      setIsConnecting(null);
    }, 1500);
  }, [connectedAccounts]);

  const handleDisconnect = useCallback((accountId: string) => {
    setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountId));
  }, []);

  const isConnected = (platformId: StreamingPlatformId) => {
    return connectedAccounts.some(acc => acc.platformId === platformId);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text-light mb-2">Multi-Stream Hub</h2>
      <p className="text-brand-text-dark mb-8">Connect your platforms, manage settings, and view unified analytics.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          <Card>
            <h3 className="text-xl font-semibold mb-4">Connect Platforms</h3>
            <div className="grid grid-cols-2 gap-4">
              {STREAMING_PLATFORMS.map(platform => (
                <div key={platform.id} className="p-4 bg-gray-800 rounded-lg flex flex-col items-center justify-center gap-3">
                  <platform.Icon className="w-10 h-10" style={{ color: platform.color }} />
                  <span className="font-medium">{platform.name}</span>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleConnect(platform.id)}
                    isLoading={isConnecting === platform.id}
                    disabled={isConnected(platform.id)}
                  >
                    {isConnected(platform.id) ? 'Connected' : 'Connect'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
          
          <Card>
            <h3 className="text-xl font-semibold mb-4">Connected Accounts</h3>
            <div className="space-y-3">
              {connectedAccounts.length > 0 ? connectedAccounts.map(account => {
                const platform = STREAMING_PLATFORMS.find(p => p.id === account.platformId);
                if (!platform) return null;
                return (
                  <div key={account.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <platform.Icon className="w-6 h-6" style={{ color: platform.color }} />
                      <div>
                        <p className="font-semibold">{platform.name}</p>
                        <p className="text-sm text-brand-text-dark">@{account.username}</p>
                      </div>
                    </div>
                    <Button variant="ghost" onClick={() => handleDisconnect(account.id)}>Disconnect</Button>
                  </div>
                );
              }) : (
                <p className="text-brand-text-dark text-center py-4">No accounts connected.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          <Card>
            <h3 className="text-xl font-semibold mb-4">Combined Analytics</h3>
            <div className="h-64">
              <AnalyticsChart />
            </div>
          </Card>
          <Card className="flex-1">
            <h3 className="text-xl font-semibold mb-4">Unified Chat</h3>
            <div className="h-full bg-gray-800 rounded-md p-4 flex flex-col">
                <div className="flex-1 text-sm space-y-3 overflow-y-auto">
                    <p><span className="font-semibold" style={{color: "#9146FF"}}>[Twitch] User123:</span> Hello world!</p>
                    <p><span className="font-semibold" style={{color: "#FF0000"}}>[YouTube] GamerX:</span> This is awesome!</p>
                    <p><span className="font-semibold" style={{color: "#53FC18"}}>[Kick] Kicker01:</span> LFG!!! 🔥</p>
                    <p><span className="font-semibold" style={{color: "#9146FF"}}>[Twitch] AnotherViewer:</span> Great stream!</p>
                </div>
                <div className="mt-4">
                    <input type="text" placeholder="Unified chat will appear here..." className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-sm focus:ring-brand-primary focus:border-brand-primary" disabled />
                </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StreamingTab;