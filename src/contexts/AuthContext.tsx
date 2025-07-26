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
  location: string;
  verified: boolean;
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
  searchSuppliers: (term: string, category: string) => Supplier[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Enhanced sample data with more suppliers from surrounding locations
const sampleSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Fresh Veggies Co',
    category: 'vegetables',
    materials: ['Tomatoes', 'Onions', 'Potatoes', 'Carrots', 'Cabbage', 'Spinach'],
    rating: 4.8,
    distance: '2.5 km',
    price: '₹50-200/kg',
    phone: '+91 9876543210',
    avatar: '/placeholder.svg',
    location: 'Central Market, Sector 17',
    verified: true
  },
  {
    id: '2',
    name: 'Spice World',
    category: 'spices',
    materials: ['Turmeric', 'Red Chili', 'Cumin', 'Coriander', 'Garam Masala', 'Black Pepper'],
    rating: 4.6,
    distance: '1.8 km',
    price: '₹80-500/kg',
    phone: '+91 9876543211',
    avatar: '/placeholder.svg',
    location: 'Old City Spice Bazaar',
    verified: true
  },
  {
    id: '3',
    name: 'Grain Masters',
    category: 'grains',
    materials: ['Rice', 'Wheat', 'Lentils', 'Chickpeas', 'Black Dal', 'Barley'],
    rating: 4.7,
    distance: '3.2 km',
    price: '₹30-120/kg',
    phone: '+91 9876543212',
    avatar: '/placeholder.svg',
    location: 'Agricultural Market, Phase 2',
    verified: true
  },
  {
    id: '4',
    name: 'Dairy Fresh',
    category: 'dairy',
    materials: ['Milk', 'Cheese', 'Butter', 'Yogurt', 'Paneer', 'Cream'],
    rating: 4.9,
    distance: '1.5 km',
    price: '₹25-150/kg',
    phone: '+91 9876543213',
    avatar: '/placeholder.svg',
    location: 'Green Valley Dairy Farm',
    verified: true
  },
  {
    id: '5',
    name: 'Golden Harvest',
    category: 'vegetables',
    materials: ['Bell Peppers', 'Broccoli', 'Cauliflower', 'Green Beans', 'Peas'],
    rating: 4.5,
    distance: '4.1 km',
    price: '₹60-250/kg',
    phone: '+91 9876543214',
    avatar: '/placeholder.svg',
    location: 'Suburban Farm District',
    verified: true
  },
  {
    id: '6',
    name: 'Aromatic Spices Hub',
    category: 'spices',
    materials: ['Cardamom', 'Cinnamon', 'Star Anise', 'Nutmeg', 'Cloves', 'Bay Leaves'],
    rating: 4.4,
    distance: '2.9 km',
    price: '₹100-800/kg',
    phone: '+91 9876543215',
    avatar: '/placeholder.svg',
    location: 'Heritage Spice Market',
    verified: true
  },
  {
    id: '7',
    name: 'Premium Grains Co',
    category: 'grains',
    materials: ['Basmati Rice', 'Quinoa', 'Oats', 'Brown Rice', 'Millet', 'Buckwheat'],
    rating: 4.6,
    distance: '3.8 km',
    price: '₹45-200/kg',
    phone: '+91 9876543216',
    avatar: '/placeholder.svg',
    location: 'Organic Grain Center',
    verified: true
  },
  {
    id: '8',
    name: 'Farm Fresh Dairy',
    category: 'dairy',
    materials: ['Organic Milk', 'Greek Yogurt', 'Cottage Cheese', 'Fresh Cream', 'Ghee'],
    rating: 4.7,
    distance: '5.2 km',
    price: '₹40-180/kg',
    phone: '+91 9876543217',
    avatar: '/placeholder.svg',
    location: 'Riverside Organic Farm',
    verified: true
  },
  {
    id: '9',
    name: 'Metro Vegetables',
    category: 'vegetables',
    materials: ['Mushrooms', 'Zucchini', 'Eggplant', 'Okra', 'Bitter Gourd', 'Bottle Gourd'],
    rating: 4.3,
    distance: '1.2 km',
    price: '₹40-180/kg',
    phone: '+91 9876543218',
    avatar: '/placeholder.svg',
    location: 'City Center Wholesale',
    verified: true
  },
  {
    id: '10',
    name: 'Exotic Spice Traders',
    category: 'spices',
    materials: ['Saffron', 'Vanilla', 'Paprika', 'Oregano', 'Thyme', 'Rosemary'],
    rating: 4.8,
    distance: '6.5 km',
    price: '₹200-2000/kg',
    phone: '+91 9876543219',
    avatar: '/placeholder.svg',
    location: 'International Spice Plaza',
    verified: true
  },
  {
    id: '11',
    name: 'Healthy Grains Store',
    category: 'grains',
    materials: ['Chia Seeds', 'Flax Seeds', 'Sesame Seeds', 'Pumpkin Seeds', 'Sunflower Seeds'],
    rating: 4.5,
    distance: '4.7 km',
    price: '₹80-400/kg',
    phone: '+91 9876543220',
    avatar: '/placeholder.svg',
    location: 'Health Food District',
    verified: true
  },
  {
    id: '12',
    name: 'Village Dairy Products',
    category: 'dairy',
    materials: ['Buffalo Milk', 'Curd', 'Lassi', 'Buttermilk', 'Khoya', 'Malai'],
    rating: 4.4,
    distance: '7.1 km',
    price: '₹30-120/kg',
    phone: '+91 9876543221',
    avatar: '/placeholder.svg',
    location: 'Traditional Village Market',
    verified: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [suppliers] = useState<Supplier[]>(sampleSuppliers);

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

  const searchSuppliers = (term: string, category: string) => {
    return suppliers.filter(supplier => {
      const matchesSearch = term === '' || 
        supplier.name.toLowerCase().includes(term.toLowerCase()) ||
        supplier.materials.some(material => 
          material.toLowerCase().includes(term.toLowerCase())
        ) ||
        supplier.location.toLowerCase().includes(term.toLowerCase());
      const matchesCategory = category === "all" || supplier.category === category;
      return matchesSearch && matchesCategory;
    });
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
      login: (phone: string, password: string): boolean => {
        const storedUsers = JSON.parse(localStorage.getItem('hopeshopper_users') || '[]');
        const foundUser = storedUsers.find((u: any) => u.phone === phone && u.password === password);
        
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('hopeshopper_user', JSON.stringify(userWithoutPassword));
          return true;
        }
        return false;
      },
      register: (userData: Omit<User, 'id'> & { password: string }): boolean => {
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
      },
      logout: () => {
        setUser(null);
        localStorage.removeItem('hopeshopper_user');
      },
      updateProfile: (userData: Partial<User>) => {
        if (user) {
          const updatedUser = { ...user, ...userData };
          setUser(updatedUser);
          localStorage.setItem('hopeshopper_user', JSON.stringify(updatedUser));
        }
      },
      orders: user ? orders.filter(order => order.userId === user.id) : [],
      suppliers,
      messages,
      addOrder,
      updateOrderStatus,
      sendMessage,
      getConversations,
      searchSuppliers
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
