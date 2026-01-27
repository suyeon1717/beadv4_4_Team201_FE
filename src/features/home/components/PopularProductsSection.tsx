'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export function PopularProductsSection() {
    const products = Array.from({ length: 4 }).map((_, i) => ({
        id: `p${i}`,
        name: `인기 상품 ${i + 1}`,
        price: (i + 1) * 15000,
        imageUrl: `/images/placeholder-product-${(i % 2) + 1}.jpg`,
    }));

    return (
        <section className="space-y-4 py-6 pb-12">
            <div className="px-4">
                <h2 className="text-lg font-bold">🔥 인기 상품</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 px-4">
                {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                        <Card className="overflow-hidden">
                            <div className="relative aspect-square w-full bg-secondary">
                                {/* Placeholder for real image */}
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                                    IMG
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="line-clamp-1 text-sm font-medium">{product.name}</h3>
                                <p className="font-bold text-base mt-1">₩{product.price.toLocaleString()}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
