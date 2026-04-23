// Shared campaigns data for the application
export const campaigns = [
  {
    id: '1',
    name: 'Spring Fitness Challenge 2026',
    status: 'Active' as const,
    promoCode: 'SPRING2026',
    discountPercentage: 25,
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    budget: 5000,
    spent: 3200,
    impressions: 128500,
    clicks: 4250,
    signups: 185,
    revenue: 27750,
    roi: 768,
    channels: {
      'In-App': 20,
      'Facebook Ads': 30,
      'Instagram': 25,
      'Email': 15,
      'Google Ads': 10
    },
    description: '25% off your subscription - Spring 2026 promotion'
  },
  {
    id: '2',
    name: 'Welcome New Members',
    status: 'Active' as const,
    promoCode: 'WELCOME20',
    discountPercentage: 20,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    budget: 15000,
    spent: 8500,
    impressions: 325000,
    clicks: 12500,
    signups: 425,
    revenue: 63750,
    roi: 325,
    channels: {
      'In-App': 30,
      'Facebook Ads': 25,
      'Instagram': 20,
      'Email': 15,
      'Google Ads': 10
    },
    description: '20% off your first month - Welcome offer'
  },
  {
    id: '3',
    name: 'Fitness First Initiative',
    status: 'Active' as const,
    promoCode: 'FITNESS15',
    discountPercentage: 15,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    budget: 10000,
    spent: 6200,
    impressions: 180000,
    clicks: 7500,
    signups: 265,
    revenue: 39750,
    roi: 541,
    channels: {
      'In-App': 25,
      'Facebook Ads': 30,
      'Instagram': 25,
      'Email': 12,
      'Google Ads': 8
    },
    description: '15% off subscription - Fitness First members'
  },
  {
    id: '4',
    name: 'Premium Member Loyalty',
    status: 'Active' as const,
    promoCode: 'PREMIUM10',
    discountPercentage: 10,
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    budget: 8000,
    spent: 4100,
    impressions: 95000,
    clicks: 4200,
    signups: 158,
    revenue: 23700,
    roi: 478,
    channels: {
      'In-App': 40,
      'Email': 35,
      'Facebook Ads': 15,
      'Instagram': 10,
      'Google Ads': 0
    },
    description: '10% loyalty discount for premium members'
  },
  {
    id: '5',
    name: 'Student Discount Program',
    status: 'Active' as const,
    promoCode: 'STUDENT30',
    discountPercentage: 30,
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    budget: 12000,
    spent: 5800,
    impressions: 145000,
    clicks: 8900,
    signups: 312,
    revenue: 31200,
    roi: 438,
    channels: {
      'In-App': 20,
      'Instagram': 35,
      'Facebook Ads': 25,
      'Email': 15,
      'Google Ads': 5
    },
    description: '30% student discount - Valid with student ID'
  },
  {
    id: '6',
    name: 'Health & Wellness Week',
    status: 'Active' as const,
    promoCode: 'WELLNESS25',
    discountPercentage: 25,
    startDate: '2026-04-01',
    endDate: '2026-05-31',
    budget: 7000,
    spent: 2100,
    impressions: 88000,
    clicks: 3500,
    signups: 142,
    revenue: 21300,
    roi: 914,
    channels: {
      'In-App': 35,
      'Email': 30,
      'Facebook Ads': 20,
      'Instagram': 10,
      'Google Ads': 5
    },
    description: '25% off - Health & Wellness promotion'
  },
  {
    id: '7',
    name: 'Friends & Family Special',
    status: 'Active' as const,
    promoCode: 'FAMILY20',
    discountPercentage: 20,
    startDate: '2026-03-15',
    endDate: '2026-06-30',
    budget: 6000,
    spent: 1800,
    impressions: 65000,
    clicks: 2800,
    signups: 98,
    revenue: 14700,
    roi: 717,
    channels: {
      'In-App': 50,
      'Email': 30,
      'Facebook Ads': 10,
      'Instagram': 10,
      'Google Ads': 0
    },
    description: '20% off - Bring your friends & family'
  },
  {
    id: '8',
    name: 'New Year Resolution 2026',
    status: 'Completed' as const,
    promoCode: 'NEWYEAR2026',
    discountPercentage: 30,
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
      'In-App': 25,
      'Facebook Ads': 35,
      'Instagram': 20,
      'Email': 15,
      'Google Ads': 5
    },
    description: '30% New Year special - Expired'
  },
  {
    id: '9',
    name: 'Summer Body Bootcamp',
    status: 'Scheduled' as const,
    promoCode: 'SUMMER2026',
    discountPercentage: 20,
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    budget: 10000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    signups: 0,
    revenue: 0,
    roi: 0,
    channels: {},
    description: '20% off - Summer bootcamp special (Not yet active)'
  },
  {
    id: '10',
    name: 'Early Bird Special',
    status: 'Active' as const,
    promoCode: 'EARLYBIRD',
    discountPercentage: 35,
    startDate: '2026-03-20',
    endDate: '2026-04-30',
    budget: 5500,
    spent: 1200,
    impressions: 42000,
    clicks: 1850,
    signups: 67,
    revenue: 10050,
    roi: 738,
    channels: {
      'In-App': 45,
      'Email': 35,
      'Facebook Ads': 10,
      'Instagram': 10,
      'Google Ads': 0
    },
    description: '35% early bird discount - Limited time offer'
  }
];

// Helper to get active campaigns (campaigns that are active or within date range)
export const getActiveCampaigns = () => {
  const today = new Date();
  return campaigns.filter(campaign => {
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    return (
      campaign.status === 'Active' ||
      (today >= startDate && today <= endDate)
    );
  });
};

// Helper to validate a promo code
export const validatePromoCode = (code: string) => {
  const activeCampaigns = getActiveCampaigns();
  return activeCampaigns.find(
    campaign => campaign.promoCode?.toUpperCase() === code.toUpperCase()
  );
};
