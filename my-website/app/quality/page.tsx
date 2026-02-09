import Link from 'next/link';
import { categories } from '@/app/data/sample-products';

export const metadata = {
    title: 'Quality & Sourcing - JHOM FOODS',
    description: 'From farm to table, discover how we ensure premium quality in every product through careful sourcing and rigorous standards.',
};

export default function QualityPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-24 bg-gradient-to-br from-cyan-800 via-cyan-700 to-cyan-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
                </div>
                <div className="container relative">
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
                            QUALITY & SOURCING
                        </span>
                        <h1
                            className="text-4xl lg:text-6xl font-bold mb-6"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Quality you can taste
                        </h1>
                        <p className="text-lg lg:text-xl" style={{ color: '#000000' }}>
                            From farm to fork, we ensure premium quality at every step of the journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section bg-white">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2
                            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            What We Offer
                        </h2>
                        <p className="text-lg text-gray-600">
                            A curated selection of premium products across categories
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/shop/${category.id}`}
                                className="group text-center p-6 rounded-2xl bg-gray-50 hover:bg-cyan-50 transition-colors"
                            >
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-4xl">{category.icon}</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">
                                    {category.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quality Standards */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div>
                            <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold mb-4">
                                OUR STANDARDS
                            </span>
                            <h2
                                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Quality you can taste
                            </h2>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'From free-range organic chicken to pasture-raised goats',
                                    'We handpick and taste-test every product',
                                    'Only the best reaches your table',
                                    "It's good food you can feel good about — simple, sustainable and 100% delicious",
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <svg
                                            className="h-6 w-6 text-cyan-500 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-lg text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/shop" className="btn btn-primary">
                                Shop Quality Products
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 aspect-square flex items-center justify-center shadow-2xl">
                                <span className="text-[150px]">🍖</span>
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-100 rounded-2xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Sourcing Story */}
            <section className="section bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="lg:order-2">
                            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                                OUR SOURCING
                            </span>
                            <h2
                                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Sourced with care
                            </h2>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'We find best-in-class producers and connect you to them',
                                    'Know exactly where your food comes from',
                                    "We're proud to tell the stories of the producers we source from",
                                    'Complete traceability, total transparency',
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <svg
                                            className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-lg text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/our-story" className="btn btn-secondary">
                                Read Our Story
                            </Link>
                        </div>
                        <div className="lg:order-1 relative">
                            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 aspect-square flex items-center justify-center shadow-2xl">
                                <span className="text-[150px]">👨‍🌾</span>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-2xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Quality Promise */}
            <section className="section bg-cyan-600 text-white">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '100%', label: 'Quality Guaranteed' },
                            { value: '24hr', label: 'Farm to Table' },
                            { value: '50+', label: 'Partner Farms' },
                            { value: '0', label: 'Preservatives Added' },
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-white">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2
                            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Experience the JHOM FOODS Difference
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Taste the quality that comes from ethical sourcing, careful selection, and dedication to excellence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/shop" className="btn btn-primary btn-lg">
                                Shop Now
                            </Link>
                            <Link href="/certifications" className="btn btn-secondary btn-lg">
                                Our Certifications
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

