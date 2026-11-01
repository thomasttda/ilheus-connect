import { topBanners, secondaryBanners, restaurantsData, professionalsData } from './mockData';
import type { BannerItem, Restaurant, Professional } from '../types';

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Cultura' | 'Economia' | 'Turismo' | 'Utilidade';
  date: string;
  imageUrl: string;
  summary: string;
  readTime: string;
}

export const initialNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Festival Internacional do Chocolate e Cacau confirma datas históricas em Ilhéus',
    category: 'Cultura',
    date: 'Hoje às 10:30',
    imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    summary: 'Evento reúne os maiores mestres chocolateiros do Brasil no Centro de Convenções com palestras, feiras gastronômicas e oficinas gratuitas para produtores.',
    readTime: '3 min de leitura',
  },
  {
    id: 'news-2',
    title: 'Temporada de Cruzeiros deve injetar mais de R$ 35 milhões no comércio ilheense',
    category: 'Economia',
    date: 'Ontem',
    imageUrl: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80',
    summary: 'Porto de Ilhéus recebe grandes navios transatlânticos impulsionando hotéis, restaurantes do Centro Histórico e o turismo praiano do Pontal e Olivença.',
    readTime: '2 min de leitura',
  },
  {
    id: 'news-3',
    title: 'Previsão do Tempo & Praias: Sol e ondas favoráveis para surf na Praia dos Milionários',
    category: 'Turismo',
    date: 'Atualizado há 2h',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    summary: 'Fim de semana ensolarado com temperaturas médias de 29°C e condições perfeitas para banho de mar nas praias do litoral sul.',
    readTime: '1 min de leitura',
  },
  {
    id: 'news-4',
    title: 'Balcão de Empregos da Cidade Digital abre 45 novas vagas para o setor de serviços',
    category: 'Utilidade',
    date: 'Hoje às 08:00',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    summary: 'Oportunidades em comércios, oficinas mecânicas, restaurantes e construção civil em diversos bairros de Ilhéus.',
    readTime: '2 min de leitura',
  },
];

const STORAGE_KEYS = {
  TOP_BANNERS: 'ic_top_banners',
  SEC_BANNERS: 'ic_sec_banners',
  RESTAURANTS: 'ic_restaurants',
  PROFESSIONALS: 'ic_professionals',
  NEWS: 'ic_news',
};

export const getStoredTopBanners = (): BannerItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TOP_BANNERS);
  return data ? JSON.parse(data) : topBanners;
};

export const saveStoredTopBanners = (banners: BannerItem[]) => {
  localStorage.setItem(STORAGE_KEYS.TOP_BANNERS, JSON.stringify(banners));
};

export const getStoredSecBanners = (): BannerItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SEC_BANNERS);
  return data ? JSON.parse(data) : secondaryBanners;
};

export const saveStoredSecBanners = (banners: BannerItem[]) => {
  localStorage.setItem(STORAGE_KEYS.SEC_BANNERS, JSON.stringify(banners));
};

export const getStoredRestaurants = (): Restaurant[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
  return data ? JSON.parse(data) : restaurantsData;
};

export const saveStoredRestaurants = (restaurants: Restaurant[]) => {
  localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
};

export const getStoredProfessionals = (): Professional[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFESSIONALS);
  return data ? JSON.parse(data) : professionalsData;
};

export const saveStoredProfessionals = (professionals: Professional[]) => {
  localStorage.setItem(STORAGE_KEYS.PROFESSIONALS, JSON.stringify(professionals));
};

export const getStoredNews = (): NewsArticle[] => {
  const data = localStorage.getItem(STORAGE_KEYS.NEWS);
  return data ? JSON.parse(data) : initialNews;
};

export const saveStoredNews = (news: NewsArticle[]) => {
  localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
};
