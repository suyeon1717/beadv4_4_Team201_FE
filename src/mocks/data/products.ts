export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  status: 'PENDING' | 'ON_SALE' | 'REJECTED' | 'DISCONTINUED';
}

export interface ProductDetail extends Product {
  sellerId: string;
  description: string;
  images: string[];
  stock: number;
  category: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  createdAt: string;
}

export const products: Product[] = [
  {
    id: 'product-1',
    name: '에어팟 프로 2세대',
    price: 329000,
    imageUrl: 'https://picsum.photos/seed/airpods/400/400',
    status: 'ON_SALE',
  },
  {
    id: 'product-2',
    name: '갤럭시 워치6',
    price: 359000,
    imageUrl: 'https://picsum.photos/seed/galaxywatch/400/400',
    status: 'ON_SALE',
  },
  {
    id: 'product-3',
    name: '아이패드 에어',
    price: 929000,
    imageUrl: 'https://picsum.photos/seed/ipad/400/400',
    status: 'ON_SALE',
  },
  {
    id: 'product-4',
    name: '소니 WH-1000XM5',
    price: 449000,
    imageUrl: 'https://picsum.photos/seed/sony/400/400',
    status: 'ON_SALE',
  },
  {
    id: 'product-5',
    name: '닌텐도 스위치 OLED',
    price: 439000,
    imageUrl: 'https://picsum.photos/seed/switch/400/400',
    status: 'ON_SALE',
  },
  {
    id: 'product-6',
    name: '맥북 에어 M3',
    price: 1690000,
    imageUrl: 'https://picsum.photos/seed/macbook/400/400',
    status: 'ON_SALE',
  },
  {
    id: 'product-7',
    name: '아이폰 15 Pro',
    price: 1550000,
    imageUrl: 'https://picsum.photos/seed/iphone/400/400',
    status: 'ON_SALE',
  },
  {
    id: 'product-8',
    name: '삼성 갤럭시 버즈2 프로',
    price: 229000,
    imageUrl: 'https://picsum.photos/seed/buds/400/400',
    status: 'ON_SALE',
  },
  {
    id: 'product-9',
    name: 'LG 그램 노트북',
    price: 1890000,
    imageUrl: 'https://picsum.photos/seed/gram/400/400',
    status: 'ON_SALE',
  },
  {
    id: 'product-10',
    name: '다이슨 에어랩',
    price: 729000,
    imageUrl: 'https://picsum.photos/seed/dyson/400/400',
    status: 'ON_SALE',
  },
];

export const productDetails: Record<string, ProductDetail> = {
  'product-1': {
    ...products[0],
    sellerId: 'seller-1',
    description:
      '애플의 최신 무선 이어폰. 탁월한 액티브 노이즈 캔슬링과 공간 오디오를 경험하세요.',
    images: [
      'https://picsum.photos/seed/airpods1/800/800',
      'https://picsum.photos/seed/airpods2/800/800',
      'https://picsum.photos/seed/airpods3/800/800',
    ],
    stock: 50,
    category: '이어폰',
    rating: 4.8,
    reviewCount: 1234,
    salesCount: 5678,
    createdAt: '2024-01-01T00:00:00Z',
  },
  'product-2': {
    ...products[1],
    sellerId: 'seller-1',
    description:
      '삼성의 프리미엄 스마트워치. 건강 관리와 스타일을 동시에 잡으세요.',
    images: [
      'https://picsum.photos/seed/watch1/800/800',
      'https://picsum.photos/seed/watch2/800/800',
    ],
    stock: 30,
    category: '웨어러블',
    rating: 4.6,
    reviewCount: 890,
    salesCount: 2345,
    createdAt: '2024-01-02T00:00:00Z',
  },
  'product-3': {
    ...products[2],
    sellerId: 'seller-2',
    description: 'M1 칩 탑재 아이패드. 업무와 엔터테인먼트 모두 완벽하게.',
    images: [
      'https://picsum.photos/seed/ipad1/800/800',
      'https://picsum.photos/seed/ipad2/800/800',
      'https://picsum.photos/seed/ipad3/800/800',
    ],
    stock: 20,
    category: '태블릿',
    rating: 4.9,
    reviewCount: 2100,
    salesCount: 8900,
    createdAt: '2024-01-03T00:00:00Z',
  },
};

export const popularProducts = products.slice(0, 8);
