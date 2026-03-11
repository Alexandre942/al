
import { User, StoredData } from '../types';

const USERS_KEY = 'quetane_users';
const DATA_KEY = 'quetane_data';
const CURRENT_USER_KEY = 'quetane_session';

export const dbService = {
  // User Management
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  
  saveUser: (user: User) => {
    const users = dbService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) users[index] = user;
    else users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(CURRENT_USER_KEY);
    return session ? JSON.parse(session) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Data Management
  getAllStoredData: (): StoredData[] => JSON.parse(localStorage.getItem(DATA_KEY) || '[]'),
  
  saveData: (userId: string, type: StoredData['type'], content: any) => {
    const allData = dbService.getAllStoredData();
    const newData: StoredData = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type,
      content,
      timestamp: Date.now()
    };
    allData.push(newData);
    localStorage.setItem(DATA_KEY, JSON.stringify(allData));
    return newData;
  },

  getUserData: (userId: string): StoredData[] => {
    return dbService.getAllStoredData().filter(d => d.userId === userId);
  },

  deleteData: (dataId: string, requestorId: string, isAdmin: boolean) => {
    const allData = dbService.getAllStoredData();
    const index = allData.findIndex(d => d.id === dataId);
    if (index > -1) {
      if (isAdmin || allData[index].userId === requestorId) {
        allData.splice(index, 1);
        localStorage.setItem(DATA_KEY, JSON.stringify(allData));
        return true;
      }
    }
    return false;
  },

  deleteUser: (userId: string) => {
    const users = dbService.getUsers().filter(u => u.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const data = dbService.getAllStoredData().filter(d => d.userId !== userId);
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }
};
