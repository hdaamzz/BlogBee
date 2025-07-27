export interface DashboardStats {
  totalPosts: number;
  totalViews: number;
  activeUsers: number;
}

export interface StatCard {
  id: keyof DashboardStats;
  title: string;
  value: number;
  growth: string;
  growthType: 'positive' | 'negative';
  icon: string;
  iconPath: string;
}