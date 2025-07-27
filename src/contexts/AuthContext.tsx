import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  phone: string;
  businessType: string;
  businessName?: string;
  avatar?: string;
  role?: 'vendor' | 'supplier';
  email?: string;
  location?: string;
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

interface Request {
  id: string;
  vendorId: string;
  vendorName: string;
  supplierId: string;
  material: string;
  quantity: number;
  deliveryDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'delivered';
  requestDate: string;
  deliveryAddress: string;
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
  email?: string;
  businessName?: string;
  password?: string;
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
  login: (phone: string, password: string, role?: 'vendor' | 'supplier') => boolean;
  register: (userData: Omit<User, 'id'> & { password: string }) => boolean;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  orders: Order[];
  requests: Request[];
  suppliers: Supplier[];
  messages: Message[];
  addOrder: (order: Omit<Order, 'id' | 'userId'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateRequestStatus: (requestId: string, status: Request['status']) => void;
  sendMessage: (receiverId: string, message: string, type?: 'text' | 'image', attachment?: string) => void;
  getConversations: () => Array<{userId: string, userName: string, lastMessage: string, avatar: string}>;
  searchSuppliers: (term: string, category: string) => Supplier[];
  getSupplierRequests: (supplierId: string) => Request[];
  getSupplierOrders: (supplierId: string) => Order[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample suppliers data with passwords for login
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
    verified: true,
    email: 'fresh@veggies.com',
    businessName: 'Fresh Veggies Co',
    password: 'supplier123'
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
    verified: true,
    email: 'spice@world.com',
    businessName: 'Spice World',
    password: 'supplier123'
  },
  {
    id: '3',
    name: 'FreshKart Traders',
    category: 'vegetables',
    materials: ['Premium Vegetables', 'Organic Produce', 'Exotic Vegetables'],
    rating: 4.9,
    distance: '3.2 km',
    price: '₹60-300/kg',
    phone: '+91 9876543212',
    avatar: '/placeholder.svg',
    location: 'Premium Fresh Market',
    verified: true,
    email: 'contact@freshkart.com',
    businessName: 'FreshKart Traders',
    password: 'supplier123'
  }
];

// Sample requests data
const sampleRequests: Request[] = [
  {
    id: '1',
    vendorId: '1',
    vendorName: 'Poorni\'s Street Food',
    supplierId: '1',
    material: 'Onions',
    quantity: 50,
    deliveryDate: '2024-01-15',
    status: 'pending',
    requestDate: '2024-01-10',
    deliveryAddress: 'Street Food Corner, Main Road'
  },
  {
    id: '2',
    vendorId: '2',
    vendorName: 'Ravi\'s Tiffin Center',
    supplierId: '1',
    material: 'Tomatoes',
    quantity: 30,
    deliveryDate: '2024-01-16',
    status: 'accepted',
    requestDate: '2024-01-11',
    deliveryAddress: 'Tiffin Center, Park Street'
  },
  {
    id: '3',
    vendorId: '3',
    vendorName: 'Sita\'s Snacks',
    supplierId: '2',
    material: 'Red Chili',
    quantity: 15,
    deliveryDate: '2024-01-17',
    status: 'delivered',
    requestDate: '2024-01-12',
    deliveryAddress: 'Snacks Corner, Market Square'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<Request[]>(sampleRequests);
  const [messages, setMessages] = useState<Message[]>([]);
  const [suppliers] = useState<Supplier[]>(sampleSuppliers);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('hopeshopper_user');
    const storedOrders = localStorage.getItem('hopeshopper_orders');
    const storedRequests = localStorage.getItem('hopeshopper_requests');
    const storedMessages = localStorage.getItem('hopeshopper_messages');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  const login = (phone: string, password: string, role: 'vendor' | 'supplier' = 'vendor'): boolean => {
    console.log('Login attempt:', { phone, password, role });
    
    if (role === 'supplier') {
      // Check if it's a predefined supplier
      const supplier = suppliers.find(s => s.phone === phone && s.password === password);
      console.log('Found supplier:', supplier);
      
      if (supplier) {
        const supplierUser: User = {
          id: supplier.id,
          name: supplier.name,
          phone: supplier.phone,
          businessType: supplier.category,
          businessName: supplier.businessName,
          role: 'supplier',
          email: supplier.email,
          location: supplier.location
        };
        console.log('Setting supplier user:', supplierUser);
        setUser(supplierUser);
        localStorage.setItem('hopeshopper_user', JSON.stringify(supplierUser));
        return true;
      }
    } else {
      // Vendor login (existing logic)
      const storedUsers = JSON.parse(localStorage.getItem('hopeshopper_users') || '[]');
      const foundUser = storedUsers.find((u: any) => u.phone === phone && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        const vendorUser = { ...userWithoutPassword, role: 'vendor' };
        setUser(vendorUser);
        localStorage.setItem('hopeshopper_user', JSON.stringify(vendorUser));
        return true;
      }
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
      businessName: userData.businessName || `${userData.name}'s ${userData.businessType === 'street-food' ? 'Street Food Corner' : 'Business'}`,
      role: userData.role || 'vendor'
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

  const updateRequestStatus = (requestId: string, status: Request['status']) => {
    const updatedRequests = requests.map(request =>
      request.id === requestId ? { ...request, status } : request
    );
    setRequests(updatedRequests);
    localStorage.setItem('hopeshopper_requests', JSON.stringify(updatedRequests));
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

  const getSupplierRequests = (supplierId: string) => {
    return requests.filter(request => request.supplierId === supplierId);
  };

  const getSupplierOrders = (supplierId: string) => {
    return orders.filter(order => order.supplierId === supplierId);
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
      orders: user && user.role === 'vendor' ? orders.filter(order => order.userId === user.id) : orders,
      requests,
      suppliers,
      messages,
      addOrder,
      updateOrderStatus,
      updateRequestStatus,
      sendMessage,
      getConversations,
      searchSuppliers,
      getSupplierRequests,
      getSupplierOrders
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
