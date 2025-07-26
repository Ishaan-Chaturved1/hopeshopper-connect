
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  phone: string;
  businessType: string;
  businessName?: string;
  avatar?: string;
}

interface Order {
  id: string;
  userId: string;
  supplierId: string;
  supplierName: string;
  material: string;
  quantity: number;
  price: number;
  status: 'pending' | 'accepted' | 'shipped' | 'delivered';
  date: string;
  deliveryAddress: string;
  deliveryDate: string;
  paymentScreenshot?: string;
}

interface Supplier {
  id: string;
  name: string;
  category: string;
  materials: string[];
  rating: number;
  distance: string;
  price: string;
  phone: string;
  avatar: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image';
  attachment?: string;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => boolean;
  register: (userData: Omit<User, 'id'> & { password: string }) => boolean;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  orders: Order[];
  suppliers: Supplier[];
  messages: Message[];
  addOrder: (order: Omit<Order, 'id' | 'userId'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  sendMessage: (receiverId: string, message: string, type?: 'text' | 'image', attachment?: string) => void;
  getConversations: () => Array<{userId: string, userName: string, lastMessage: string, avatar: string}>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample data
const sampleSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Fresh Veggies Co',
    category: 'vegetables',
    materials: ['Tomatoes', 'Onions', 'Potatoes', 'Carrots'],
    rating: 4.8,
    distance: '2.5 km',
    price: '₹50-200/kg',
    phone: '+91 9876543210',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Spice World',
    category: 'spices',
    materials: ['Turmeric', 'Red Chili', 'Cumin', 'Coriander'],
    rating: 4.6,
    distance: '1.8 km',
    price: '₹80-500/kg',
    phone: '+91 9876543211',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Grain Masters',
    category: 'grains',
    materials: ['Rice', 'Wheat', 'Lentils', 'Chickpeas'],
    rating: 4.7,
    distance: '3.2 km',
    price: '₹30-120/kg',
    phone: '+91 9876543212',
    avatar: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Dairy Fresh',
    category: 'dairy',
    materials: ['Milk', 'Cheese', 'Butter', 'Yogurt'],
    rating: 4.9,
    distance: '1.5 km',
    price: '₹25-150/kg',
    phone: '+91 9876543213',
    avatar: '/placeholder.svg'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const suppliers = sampleSuppliers;

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('hopeshopper_user');
    const storedOrders = localStorage.getItem('hopeshopper_orders');
    const storedMessages = localStorage.getItem('hopeshopper_messages');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  const login = (phone: string, password: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('hopeshopper_users') || '[]');
    const foundUser = storedUsers.find((u: any) => u.phone === phone && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('hopeshopper_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id'> & { password: string }): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('hopeshopper_users') || '[]');
    const existingUser = storedUsers.find((u: any) => u.phone === userData.phone);
    
    if (existingUser) {
      return false;
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      businessName: `${userData.name}'s ${userData.businessType === 'street-food' ? 'Street Food Corner' : 'Business'}`
    };

    storedUsers.push(newUser);
    localStorage.setItem('hopeshopper_users', JSON.stringify(storedUsers));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('hopeshopper_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hopeshopper_user');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('hopeshopper_user', JSON.stringify(updatedUser));
    }
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'userId'>) => {
    if (user) {
      const newOrder: Order = {
        ...orderData,
        id: Date.now().toString(),
        userId: user.id
      };
      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      localStorage.setItem('hopeshopper_orders', JSON.stringify(updatedOrders));
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('hopeshopper_orders', JSON.stringify(updatedOrders));
  };

  const sendMessage = (receiverId: string, message: string, type: 'text' | 'image' = 'text', attachment?: string) => {
    if (user) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        receiverId,
        message,
        timestamp: new Date().toISOString(),
        type,
        attachment
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem('hopeshopper_messages', JSON.stringify(updatedMessages));
    }
  };

  const getConversations = () => {
    if (!user) return [];
    
    const userConversations = messages.filter(m => 
      m.senderId === user.id || m.receiverId === user.id
    );
    
    const conversationMap = new Map();
    userConversations.forEach(msg => {
      const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      const supplier = suppliers.find(s => s.id === otherUserId);
      
      if (supplier && (!conversationMap.has(otherUserId) || 
          new Date(msg.timestamp) > new Date(conversationMap.get(otherUserId).timestamp))) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          userName: supplier.name,
          lastMessage: msg.message,
          avatar: supplier.avatar,
          timestamp: msg.timestamp
        });
      }
    });
    
    return Array.from(conversationMap.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      orders: user ? orders.filter(order => order.userId === user.id) : [],
      suppliers,
      messages,
      addOrder,
      updateOrderStatus,
      sendMessage,
      getConversations
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
