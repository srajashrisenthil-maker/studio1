"use client";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CartItem, Order, OrderItem, Product, User } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AppContextType {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  farmers: User[];
  login: (user: Omit<User, 'id'>) => void;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id' | 'farmerId' | 'rating'>, price: number) => void;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addOrder: (cart: CartItem[], total: number) => void;
  getFarmerById: (farmerId: string) => User | undefined;
  followFarmer: (farmerId: string) => void;
  unfollowFarmer: (farmerId: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const initialFarmers: User[] = [
    {
        id: 'farmer_123',
        name: 'Suresh Kumar',
        phone: '9876543210',
        address: '123, Green Valley, Pollachi, Tamil Nadu',
        location: { lat: 10.66, lon: 77.01 },
        role: 'farmer',
        profilePicture: 'https://i.ibb.co/yYyVz3D/pexels-greta-hoffman-7722731.jpg',
        followers: 120,
    },
    {
        id: 'farmer_456',
        name: 'Anitha Devi',
        phone: '8765432109',
        address: '456, Farm Road, Ooty, Tamil Nadu',
        location: { lat: 11.41, lon: 76.69 },
        role: 'farmer',
        profilePicture: 'https://i.ibb.co/yYyVz3D/pexels-greta-hoffman-7722731.jpg',
        followers: 85,
    }
];

const initialProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Fresh Tomatoes',
    description: 'Organically grown, juicy tomatoes from the valley.',
    image: PlaceHolderImages.find(p => p.id === 'tomatoes')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'tomatoes')?.imageHint || '',
    farmerId: 'farmer_123',
    price: 150,
    rating: 4.5,
  },
  {
    id: 'prod_2',
    name: 'Crunchy Carrots',
    description: 'Sweet and crunchy carrots, perfect for salads and stews.',
    image: PlaceHolderImages.find(p => p.id === 'carrots')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'carrots')?.imageHint || '',
    farmerId: 'farmer_123',
    price: 80,
    rating: 4.8,
  },
    {
    id: 'prod_3',
    name: 'Earthy Potatoes',
    description: 'Versatile potatoes, great for roasting, frying, or mashing.',
    image: PlaceHolderImages.find(p => p.id === 'potatoes')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'potatoes')?.imageHint || '',
    farmerId: 'farmer_456',
    price: 50,
    rating: 4.2,
  },
  {
    id: 'prod_4',
    name: 'Spicy Onions',
    description: 'Flavorful red onions to spice up any dish.',
    image: PlaceHolderImages.find(p => p.id === 'onions')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'onions')?.imageHint || '',
    farmerId: 'farmer_456',
    price: 60,
    rating: 4.0,
  }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [farmers, setFarmers] = useState<User[]>(initialFarmers);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("agri-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedProducts = localStorage.getItem("agri-products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
    const storedOrders = localStorage.getItem("agri-orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    const storedFarmers = localStorage.getItem("agri-farmers");
    if (storedFarmers) {
      setFarmers(JSON.parse(storedFarmers));
    }
  }, []);

  const persistUser = (updatedUser: User | null) => {
    if (updatedUser) {
      localStorage.setItem("agri-user", JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem("agri-user");
    }
    setUser(updatedUser);
  }

  const login = (userData: Omit<User, 'id'>) => {
    const newUser: User = { 
        ...userData, 
        id: `${userData.role}_${Date.now()}`,
        ...(userData.role === 'marketman' && { following: [] }),
        ...(userData.role === 'farmer' && { followers: 0 }),
    };
    persistUser(newUser);

    if (newUser.role === 'farmer') {
        const newFarmerList = [...farmers, newUser];
        setFarmers(newFarmerList);
        localStorage.setItem("agri-farmers", JSON.stringify(newFarmerList));
    }

    router.push(`/${newUser.role}/dashboard`);
  };

  const logout = () => {
    persistUser(null);
    router.push("/");
  };

  const addProduct = (productData: Omit<Product, 'id'| 'farmerId' | 'rating'>, price: number) => {
    if(!user || user.role !== 'farmer') return;
    const newProduct: Product = {
        ...productData,
        id: `prod_${Date.now()}`,
        farmerId: user.id,
        price,
        rating: 0, // New products start with a rating of 0
    };
    const updatedProducts = [newProduct, ...products];
    setProducts(updatedProducts);
    localStorage.setItem("agri-products", JSON.stringify(updatedProducts));
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
     if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };
  
  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (cartItems: CartItem[], total: number) => {
      if (!user || user.role !== 'marketman') return;

      const newOrder: Order = {
          id: `order_${Date.now()}`,
          marketmanId: user.id,
          marketmanName: user.name,
          items: cartItems.map(cartItem => ({
              productId: cartItem.product.id,
              productName: cartItem.product.name,
              productImage: cartItem.product.image,
              quantity: cartItem.quantity,
              price: cartItem.product.price,
              farmerId: cartItem.product.farmerId,
          })),
          total,
          date: new Date().toISOString(),
      };

      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      localStorage.setItem("agri-orders", JSON.stringify(updatedOrders));
  };

  const getFarmerById = (farmerId: string) => {
    return farmers.find(f => f.id === farmerId && f.role === 'farmer');
  };

  const updateFarmer = (farmerId: string, updates: Partial<User>) => {
      const updatedFarmers = farmers.map(f => f.id === farmerId ? { ...f, ...updates } : f);
      setFarmers(updatedFarmers);
      localStorage.setItem('agri-farmers', JSON.stringify(updatedFarmers));
  }

  const followFarmer = (farmerId: string) => {
    if (!user || user.role !== 'marketman' || !user.following) return;

    const updatedUser: User = { ...user, following: [...user.following, farmerId] };
    persistUser(updatedUser);

    const farmer = getFarmerById(farmerId);
    if(farmer) {
        updateFarmer(farmerId, { followers: (farmer.followers || 0) + 1 });
    }
  }

  const unfollowFarmer = (farmerId: string) => {
    if (!user || user.role !== 'marketman' || !user.following) return;

    const updatedUser: User = { ...user, following: user.following.filter(id => id !== farmerId) };
    persistUser(updatedUser);

    const farmer = getFarmerById(farmerId);
    if(farmer && farmer.followers && farmer.followers > 0) {
        updateFarmer(farmerId, { followers: farmer.followers - 1 });
    }
  }

  return (
    <AppContext.Provider
      value={{ user, products, cart, orders, farmers, login, logout, addProduct, addToCart, removeFromCart, updateCartQuantity, clearCart, addOrder, getFarmerById, followFarmer, unfollowFarmer }}
    >
      {children}
    </AppContext.Provider>
  );
};
