
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  balance?: number;
  joinedAt: number;
}

export interface StoredData {
  id: string;
  userId: string;
  type: 'strategy' | 'chat' | 'project' | 'music' | 'finance';
  content: any;
  timestamp: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  parts?: any[];
  timestamp: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export enum AppView {
  DASHBOARD = 'dashboard',
  STRATEGY = 'strategy',
  CHAT = 'chat',
  DEVELOPMENT = 'development',
  MUSIC = 'music',
  MARKET = 'market',
  ADVISOR = 'advisor',
  FINANCE = 'finance',
  NEWS = 'news',
  PROFILE = 'profile',
  ADMIN = 'admin',
  PRIVACY = 'privacy'
}
