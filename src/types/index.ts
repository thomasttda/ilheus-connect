export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  tag?: string;
  badgeColor?: string;
  ctaText?: string;
  ctaLink?: string;
  targetPage?: 'delivery' | 'services' | 'register' | 'external';
}

export interface MenuCategory {
  id: string;
  name: string;
  iconName: string;
  pageId: 'home' | 'delivery' | 'services' | 'pharmacy' | 'news';
  badge?: string;
  color: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  popular?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  logoUrl: string;
  bannerUrl: string;
  whatsapp: string;
  address: string;
  neighborhood: string;
  isOpen: boolean;
  isFeatured?: boolean;
  menu: MenuItem[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  restaurantWhatsapp: string;
  notes?: string;
}

export interface Professional {
  id: string;
  name: string;
  profession: string;
  category: 'eletrica' | 'construcao' | 'pintura' | 'mecanica' | 'hidraulica' | 'refrigera' | 'limpeza' | 'ti' | 'outros';
  rating: number;
  reviewCount: number;
  experienceYears: number;
  whatsapp: string;
  phone: string;
  neighborhoods: string[];
  bio: string;
  avatarUrl: string;
  portfolioImages: string[];
  isVerified: boolean;
  completedJobsCount: number;
  priceStartingAt?: number;
}
