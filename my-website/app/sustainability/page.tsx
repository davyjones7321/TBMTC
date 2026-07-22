import Link from 'next/link';

export const metadata = {
    title: 'Sustainability - THE BANGALORE MEAT AND TRADING COMPANY',
    description: 'Our commitment to sustainable practices, ethical sourcing, and environmental responsibility.',
};

export default function SustainabilityPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-24 text-white overflow-hidden" style={{ backgroundColor: '#570C19' }}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
                </div>
                <div className="container relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#F5DDE1' }}>
                            SUSTAINABILITY
                        </span>
                        <h1
                            className="text-4xl lg:text-6xl font-bold mb-6"
                            style={{ fontFamily: 'var(--font-display)', color: '#F5DDE1' }}
                        >
                            Better for you and the planet
                        </h1>
                        <p className="text-lg lg:text-xl" style={{ color: '#E8C4CA' }}>
                            Our commitment to sustainable practices that protect our environment for future generations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Commitment Cards */}
            <section className="section bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '📦',
                                title: '100% Recyclable Packaging',
                                description: 'Our packaging is designed with the environment in mind. From compostable insulation to recyclable boxes, we minimize waste at every step.',
                                details: [
                                    'Frozen at peak quality to reduce waste',
                                    'Compostable insulation materials',
                                    '100% recyclable outer packaging',
                                    'Reduced plastic use across all products',
                                ],
                            },
                            {
                                icon: '🌊',
                                title: 'Ethical Sourcing',
                                description: 'We partner exclusively with suppliers who share our commitment to environmental stewardship and animal welfare.',
                                details: [
                                    'Sustainable fishing practices',
                                    'No overfished species',
                                    'Animal welfare certified farms',
                                    'Fair wages for workers',
                                ],
                            },
                            {
                                icon: '🌱',
                                title: 'Reducing Carbon Footprint',
                                description: "From optimized delivery routes to renewable energy, we're working to minimize our environmental impact.",
                                details: [
                                    'Optimized delivery routes',
                                    'Electric delivery vehicles',
                                    'Solar-powered cold storage',
                                    'Carbon offset programs',
                                ],
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FAEFF1' }}>
                                    <span className="text-4xl">{item.icon}</span>
                                </div>
                                <h3
                                    className="text-xl font-bold text-gray-900 mb-4"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 mb-6">{item.description}</p>
                                <ul className="space-y-2">
                                    {item.details.map((detail, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <svg
                                                className="h-5 w-5 flex-shrink-0"
                                                style={{ color: '#570C19' }}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="section text-white" style={{ backgroundColor: '#570C19' }}>
                <div className="container">
                    <div className="text-center mb-12">
                        <h2
                            className="text-3xl lg:text-4xl font-bold"
                            style={{ fontFamily: 'var(--font-display)', color: '#F5DDE1' }}
                        >
                            Our Impact
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '10,000+', label: 'Kg plastic saved yearly' },
                            { value: '50+', label: 'Sustainable farms partnered' },
                            { value: '100%', label: 'Recyclable packaging' },
                            { value: '25%', label: 'Carbon reduction achieved' },
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#F5DDE1' }}>{stat.value}</div>
                                <div className="text-sm" style={{ color: '#E8C4CA' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Goals */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2
                                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Our 2025 Goals
                            </h2>
                            <p className="text-lg text-gray-600">
                                We&apos;re committed to continuous improvement in our sustainability efforts.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { goal: 'Zero plastic packaging', progress: 75 },
                                { goal: 'Carbon neutral operations', progress: 60 },
                                { goal: '100% sustainable seafood sourcing', progress: 90 },
                                { goal: 'Electric delivery fleet', progress: 40 },
                            ].map((item, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-semibold text-gray-900">{item.goal}</span>
                                        <span className="font-bold" style={{ color: '#570C19' }}>{item.progress}%</span>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${item.progress}%`, backgroundColor: '#570C19' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section bg-white">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2
                            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Join Our Sustainability Journey
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Every purchase supports sustainable farming practices and environmental conservation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/shop" className="btn btn-primary btn-lg">
                                Shop Sustainable Products
                            </Link>
                            <Link href="/our-story" className="btn btn-secondary btn-lg">
                                Learn More About Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

