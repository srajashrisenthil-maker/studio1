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
