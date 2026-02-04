// API Response Type
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[]; // Validation errors from backend
}

// User Types
export interface User {
  _id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Product Types (MongoDB Schema)
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  unit: 'piece' | 'kg' | 'g' | 'l' | 'ml';
  unitValue: number;
  category: {
    _id: string;
    name: string;
  };
  images: Array<{
    url: string;
    alt?: string;
    isPrimary: boolean;
    _id?: string;
  }>;
  stock: {
    quantity: number;
    lowStockThreshold: number;
    trackInventory: boolean;
  };
  variants: Array<{
    size: string;
    price: number;
    stock: number;
    sku: string;
    _id?: string;
  }>;
  specifications: Array<{
    name: string;
    value: string;
  }>;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  totalSold: number;
  rating: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Legacy Product type for backward compatibility
export interface LegacyProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  image: string;
  weight: string;
  unit: string;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

export type ProductCategory =
  | 'fish-seafood'
  | 'poultry'
  | 'mutton'
  | 'ready-to-cook'
  | 'vegetarian'
  | 'fish'
  | 'prawns'
  | 'chicken'
  | 'seafood';

// Category (MongoDB Schema)
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  description: string;
  icon: string;
}

// Cart Types
export interface CartItem {
  product: Product | LegacyProduct;
  quantity: number;
  variation?: string; // For variant products (e.g., "6/8", "1kg")
  price?: number; // Price at time of adding (for variants)
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// Order Types (MongoDB Schema)
export interface Order {
  _id: string;
  orderNumber: string;
  customer: string;
  items: Array<{
    product: string | { _id: string; name: string; images?: Array<{ url: string }> };
    name?: string;
    sku?: string;
    variation?: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    firstName?: string;
    lastName?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
  deliverySlot?: string;
  statusHistory: Array<{
    status: string;
    date: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Legacy Order type
export interface LegacyOrder {
  id: string;
  items: CartItem[];
  deliveryAddress: Address;
  deliverySlot: DeliverySlot;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface DeliverySlot {
  id: string;
  date: string;
  timeRange: string;
  available: boolean;
}

export type PaymentMethod =
  | 'cod'
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'cash_on_delivery'
  | 'credit_card'
  | 'debit_card'
  | 'paypal';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: ContactSubject;
  message: string;
}

export type ContactSubject =
  | 'general'
  | 'wholesale'
  | 'quality'
  | 'partnership'
  | 'media'
  | 'order_mismatch';

// Bulk Order Form Types
export interface BulkOrderFormData {
  businessName: string;
  businessType: BusinessType;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  estimatedMonthlyVolume: string;
  productInterests: string[];
  message: string;
}

export type BusinessType =
  | 'restaurant'
  | 'hotel'
  | 'catering'
  | 'retailer'
  | 'other';

// Navigation Types
export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

// Certification Types
export interface Certification {
  id: string;
  name: string;
  description: string;
  logo: string;
  learnMoreUrl?: string;
}

// Value Proposition Types
export interface ValueProp {
  image: string;
  title: string;
  description: string;
}

// Story Section Types
export interface StoryBlock {
  heading: string;
  content: string;
  image: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
  cta?: {
    text: string;
    href: string;
  };
}

// Core Value Types
export interface CoreValue {
  icon: string;
  title: string;
  description: string;
}

