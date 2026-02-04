import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import { getProductsByCategory, categories } from '@/app/data/sample-products';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
    return categories.map((category) => ({
        category: category.id,
    }));
}

export async function generateMetadata({ params }: Props) {
    const { category } = await params;
    const categoryInfo = categories.find((c) => c.id === category);

    if (!categoryInfo) {
        return {
            title: 'Category Not Found - JHOM FOODS',
        };
    }

    return {
        title: `${categoryInfo.name} - JHOM FOODS`,
        description: categoryInfo.description,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { category } = await params;
    const categoryInfo = categories.find((c) => c.id === category);

    if (!categoryInfo) {
        notFound();
    }

    const products = getProductsByCategory(category);

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-emerald-800 to-emerald-900 text-white">
                <div className="container">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl">{categoryInfo.icon}</span>
                        <h1
                            className="text-4xl lg:text-5xl font-bold"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            {categoryInfo.name}
                        </h1>
                    </div>
                    <p className="text-lg text-emerald-100 max-w-2xl">
                        {categoryInfo.description}
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-white border-b sticky top-20 z-30">
                <div className="container">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 -mb-2">
                        <Link
                            href="/shop"
                            className="flex-shrink-0 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full font-medium text-sm hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                        >
                            All Products
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/shop/${cat.id}`}
                                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${cat.id === category
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{products.length}</span> products in {categoryInfo.name}
                        </p>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">{categoryInfo.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No products found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                We&apos;re adding new products soon. Check back later!
                            </p>
                            <Link href="/shop" className="btn btn-primary">
                                Browse All Products
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
