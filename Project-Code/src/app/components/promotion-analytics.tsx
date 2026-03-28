import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  TrendingUp, 
  TrendingDown,
  Eye,
  MousePointerClick,
  UserPlus,
  DollarSign,
  BarChart3,
  Download,
  Mail,
  Play,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

// Mock campaign data
const campaigns = [
  {
    id: '1',
    name: 'Spring Fitness Challenge 2026',
    status: 'Active',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    budget: 5000,
    spent: 3200,
    impressions: 128500,
    clicks: 4250,
    signups: 185,
    revenue: 27750,
    roi: 768,
    channels: {
      'Facebook Ads': 35,
      'Instagram': 28,
      'Email': 22,
      'Google Ads': 15
    }
  },
  {
    id: '2',
    name: 'New Year Resolution 2026',
    status: 'Completed',
    startDate: '2026-01-01',
    endDate: '2026-02-28',
    budget: 8000,
    spent: 7850,
    impressions: 215000,
    clicks: 6800,
    signups: 312,
    revenue: 46800,
    roi: 496,
    channels: {
      'Facebook Ads': 40,
      'Instagram': 25,
      'Email': 20,
      'Google Ads': 15
    }
  },
  {
    id: '3',
    name: 'Summer Body Bootcamp',
    status: 'Scheduled',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    budget: 10000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    signups: 0,
    revenue: 0,
    roi: 0,
    channels: {}
  }
];

// Time series data for performance graph
const performanceData = [
  { date: 'Mar 1', clicks: 120, signups: 5, revenue: 750 },
  { date: 'Mar 3', clicks: 185, signups: 8, revenue: 1200 },
  { date: 'Mar 5', clicks: 220, signups: 12, revenue: 1800 },
  { date: 'Mar 7', clicks: 198, signups: 9, revenue: 1350 },
  { date: 'Mar 9', clicks: 245, signups: 15, revenue: 2250 },
  { date: 'Mar 11', clicks: 280, signups: 18, revenue: 2700 },
  { date: 'Mar 13', clicks: 310, signups: 22, revenue: 3300 },
  { date: 'Mar 15', clicks: 295, signups: 19, revenue: 2850 },
  { date: 'Mar 17', clicks: 340, signups: 25, revenue: 3750 },
  { date: 'Mar 19', clicks: 375, signups: 28, revenue: 4200 }
];

// Real-time data
const realTimeData = {
  clicksPerHour: 18,
  signupsPerHour: 2.4,
  budgetRemaining: 1800,
  activeUsers: 47
};

export function PromotionAnalytics() {
  const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0]);
  const [timePeriod, setTimePeriod] = useState('7days');
  const [showRealTime, setShowRealTime] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonCampaign, setComparisonCampaign] = useState<typeof campaigns[1] | null>(null);
  const [showError, setShowError] = useState(false);

  const ctr = ((selectedCampaign.clicks / selectedCampaign.impressions) * 100).toFixed(2);
  const conversionRate = ((selectedCampaign.signups / selectedCampaign.clicks) * 100).toFixed(2);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const handleDownloadReport = () => {
    console.log('Downloading PDF report for campaign:', selectedCampaign.name);
    alert('Report download started! (Mock functionality)');
  };

  const handleEmailReport = () => {
    console.log('Emailing report for campaign:', selectedCampaign.name);
    alert('Report sent via email! (Mock functionality)');
  };

  const handleRefreshStats = () => {
    setShowError(false);
    console.log('Refreshing statistics...');
    alert('Statistics refreshed successfully!');
  };

  const calculateComparison = () => {
    if (!comparisonCampaign) return null;
    
    const clicksDiff = ((selectedCampaign.clicks - comparisonCampaign.clicks) / comparisonCampaign.clicks * 100).toFixed(1);
    const signupsDiff = ((selectedCampaign.signups - comparisonCampaign.signups) / comparisonCampaign.signups * 100).toFixed(1);
    const roiDiff = ((selectedCampaign.roi - comparisonCampaign.roi) / comparisonCampaign.roi * 100).toFixed(1);
    
    return { clicksDiff, signupsDiff, roiDiff };
  };

  return (
    <div className="space-y-6">
      {/* Header Section - YouTube Analytics Style */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Campaign Analytics</h2>
          <p className="text-gray-500 mt-1">Track and optimize your promotion performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowRealTime(!showRealTime)}>
            <Play className="size-4 mr-2" />
            {showRealTime ? 'Hide' : 'Show'} Real-time
          </Button>
          <Button variant="outline" onClick={() => setShowComparison(!showComparison)}>
            <BarChart3 className="size-4 mr-2" />
            Compare
          </Button>
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="size-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" onClick={handleEmailReport}>
            <Mail className="size-4 mr-2" />
            Email Report
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {showError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-red-900">Statistics Error</h3>
                <p className="text-sm text-red-700 mt-1">
                  We're experiencing issues updating the performance statistics. Please try refreshing or log out and log back in.
                </p>
                <Button variant="outline" size="sm" onClick={handleRefreshStats} className="mt-3">
                  <RefreshCw className="size-4 mr-2" />
                  Refresh Statistics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign Selector & Time Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Campaign</label>
              <Select 
                value={selectedCampaign.id} 
                onValueChange={(val) => {
                  const campaign = campaigns.find(c => c.id === val);
                  if (campaign) setSelectedCampaign(campaign);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name} ({campaign.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">Last 24 Hours</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaign Overview - Top Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-medium">{selectedCampaign.name}</h3>
            <p className="text-gray-600 mt-1">
              {selectedCampaign.startDate} → {selectedCampaign.endDate}
            </p>
          </div>
          <Badge 
            className={
              selectedCampaign.status === 'Active' ? 'bg-green-100 text-green-800' :
              selectedCampaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }
          >
            {selectedCampaign.status}
          </Badge>
        </div>
        
        {/* Key Metrics Grid - YouTube Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="size-4 text-blue-600" />
              <span className="text-sm text-gray-600">Impressions</span>
            </div>
            <div className="text-2xl font-medium">{selectedCampaign.impressions.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
              <TrendingUp className="size-3" />
              +12.5% vs prev period
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MousePointerClick className="size-4 text-purple-600" />
              <span className="text-sm text-gray-600">Clicks</span>
            </div>
            <div className="text-2xl font-medium">{selectedCampaign.clicks.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
              CTR: {ctr}%
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="size-4 text-green-600" />
              <span className="text-sm text-gray-600">Sign-ups</span>
            </div>
            <div className="text-2xl font-medium">{selectedCampaign.signups}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
              Conv Rate: {conversionRate}%
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="size-4 text-orange-600" />
              <span className="text-sm text-gray-600">ROI</span>
            </div>
            <div className="text-2xl font-medium">{selectedCampaign.roi}%</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
              <TrendingUp className="size-3" />
              Revenue: ${selectedCampaign.revenue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Monitoring */}
      {showRealTime && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="size-2 bg-red-500 rounded-full animate-pulse"></div>
              Live Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Clicks/Hour</div>
                <div className="text-2xl font-medium text-blue-600">{realTimeData.clicksPerHour}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Sign-ups/Hour</div>
                <div className="text-2xl font-medium text-green-600">{realTimeData.signupsPerHour}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Budget Remaining</div>
                <div className="text-2xl font-medium text-orange-600">${realTimeData.budgetRemaining}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Active Users</div>
                <div className="text-2xl font-medium text-purple-600">{realTimeData.activeUsers}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign Comparison */}
      {showComparison && (
        <Card>
          <CardHeader>
            <CardTitle>Compare with Previous Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select 
              value={comparisonCampaign?.id || ''} 
              onValueChange={(val) => {
                const campaign = campaigns.find(c => c.id === val);
                if (campaign) setComparisonCampaign(campaign);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select campaign to compare..." />
              </SelectTrigger>
              <SelectContent>
                {campaigns.filter(c => c.id !== selectedCampaign.id && c.status === 'Completed').map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {comparisonCampaign && (() => {
              const comparison = calculateComparison();
              return comparison && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Clicks</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-medium">{comparison.clicksDiff}%</span>
                      {parseFloat(comparison.clicksDiff) > 0 ? (
                        <TrendingUp className="size-5 text-green-600" />
                      ) : (
                        <TrendingDown className="size-5 text-red-600" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedCampaign.clicks} vs {comparisonCampaign.clicks}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Sign-ups</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-medium">{comparison.signupsDiff}%</span>
                      {parseFloat(comparison.signupsDiff) > 0 ? (
                        <TrendingUp className="size-5 text-green-600" />
                      ) : (
                        <TrendingDown className="size-5 text-red-600" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedCampaign.signups} vs {comparisonCampaign.signups}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">ROI</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-medium">{comparison.roiDiff}%</span>
                      {parseFloat(comparison.roiDiff) > 0 ? (
                        <TrendingUp className="size-5 text-green-600" />
                      ) : (
                        <TrendingDown className="size-5 text-red-600" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedCampaign.roi}% vs {comparisonCampaign.roi}%
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Performance Graph - YouTube Style */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Trend</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowError(!showError)}>
                <RefreshCw className="size-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="clicks" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                name="Clicks"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="signups" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                name="Sign-ups"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="revenue" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4 }}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Channel Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(selectedCampaign.channels).length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={Object.entries(selectedCampaign.channels).map(([name, value]) => ({
                        name,
                        value
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(selectedCampaign.channels).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {Object.entries(selectedCampaign.channels).map(([channel, percentage], idx) => (
                    <div key={channel} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="size-3 rounded-full" 
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <span className="text-sm">{channel}</span>
                      </div>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No channel data available for this campaign
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Budget Spent</span>
                  <span className="text-sm font-medium">
                    ${selectedCampaign.spent} / ${selectedCampaign.budget}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${(selectedCampaign.spent / selectedCampaign.budget) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((selectedCampaign.spent / selectedCampaign.budget) * 100).toFixed(1)}% of budget used
                </p>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Budget</span>
                  <span className="font-medium">${selectedCampaign.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Spent</span>
                  <span className="font-medium">${selectedCampaign.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-medium text-green-600">
                    ${(selectedCampaign.budget - selectedCampaign.spent).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-600">Revenue Generated</span>
                  <span className="font-medium text-blue-600">
                    ${selectedCampaign.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Profit</span>
                  <span className="font-medium text-green-600">
                    ${(selectedCampaign.revenue - selectedCampaign.spent).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Campaigns Statistics - Bottom Section */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div 
                key={campaign.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  campaign.id === selectedCampaign.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedCampaign(campaign)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{campaign.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {campaign.startDate} → {campaign.endDate}
                    </p>
                  </div>
                  <Badge 
                    className={
                      campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Impressions</div>
                    <div className="font-medium mt-1">{campaign.impressions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Clicks</div>
                    <div className="font-medium mt-1">{campaign.clicks.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Sign-ups</div>
                    <div className="font-medium mt-1">{campaign.signups}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Revenue</div>
                    <div className="font-medium mt-1">${campaign.revenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">ROI</div>
                    <div className="font-medium mt-1 text-green-600">{campaign.roi}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
