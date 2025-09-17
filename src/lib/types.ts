export type UserRole = 'farmer' | 'marketman';

export type User = {
  id: string;
  name: string;
  phone: string;
  address: string;
  location: {
    lat: number;
    lon: number;
  } | null;
  role: UserRole;
  pin: string;
  profilePicture?: string;
  // For marketmen
  following?: string[]; 
  // For farmers
  followers?: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  imageHint: string;
  farmerId: string;
  price: number;
  rating: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  farmerId: string;
};

export type Order = {
    id: string;
    marketmanId: string;
    marketmanName: string;
    items: OrderItem[];
    total: number;
    date: string;
};
