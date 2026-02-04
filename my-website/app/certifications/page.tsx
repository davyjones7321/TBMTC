import Link from 'next/link';

export const metadata = {
    title: 'Certifications - JHOM FOODS',
    description: 'Our commitment to the highest standards. View all our certifications and what they mean for you.',
};

const certifications = [
    {
        name: 'FSSAI Certified',
        description: 'Food Safety and Standards Authority of India certification ensuring food safety compliance.',
        icon: '🏛️',
    },
    {
        name: 'USDA Organic',
        description: 'Products certified to meet strict organic standards set by the USDA.',
        icon: '🌿',
    },
    {
        name: 'Certified Humane',
        description: 'Animals raised with care, meeting humane farm animal care standards.',
        icon: '🐄',
    },
    {
        name: 'Non-GMO Verified',
        description: 'Products verified to be free from genetically modified organisms.',
        icon: '🧬',
    },
    {
        name: 'ISO 22000',
        description: 'International food safety management system certification.',
        icon: '✓',
    },
    {
        name: 'MSC Certified',
        description: 'Marine Stewardship Council certification for sustainable seafood.',
        icon: '🐟',
    },
    {
        name: 'ASC Certified',
        description: 'Aquaculture Stewardship Council certification for responsible fish farming.',
        icon: '🦐',
    },
    {
        name: 'HACCP Compliant',
        description: 'Hazard Analysis Critical Control Points food safety management.',
        icon: '🔬',
    },
];

export default function CertificationsPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-24 bg-gradient-to-br from-cyan-800 via-cyan-700 to-cyan-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
                </div>
                <div className="container relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
                            CERTIFICATIONS
                        </span>
                        <h1
                            className="text-4xl lg:text-6xl font-bold mb-6"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Certified Excellence
                        </h1>
                        <p className="text-lg lg:text-xl" style={{ color: '#000000' }}>
                            Our commitment to the highest standards of quality, safety, and sustainability.
                        </p>
                    </div>
                </div>
            </section>

            {/* Certifications Grid */}
            <section className="section bg-white">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2
                            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Our Certifications
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Every certification represents our dedication to providing you with safe, ethical, and high-quality products.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {certifications.map((cert, index) => (
                            <div
                                key={index}
                                className="group bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-xl hover:border-cyan-200 transition-all duration-300"
                            >
                                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-4xl">{cert.icon}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{cert.name}</h3>
                                <p className="text-sm text-gray-600">{cert.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What It Means */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2
                                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                What This Means For You
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    title: 'Food Safety Guaranteed',
                                    content: 'Every product undergoes rigorous testing and quality checks to ensure it meets the highest safety standards. From our suppliers to your table, we maintain strict hygiene and handling protocols.',
                                    icon: '🛡️',
                                },
                                {
                                    title: 'Ethical Sourcing',
                                    content: 'Our certifications ensure that animals are raised humanely, farmers are paid fairly, and environmental impact is minimized. When you choose JHOM FOODS, you support ethical practices.',
                                    icon: '💚',
                                },
                                {
                                    title: 'Complete Traceability',
                                    content: 'With certified supply chains, we can trace every product back to its source. Know exactly where your food comes from and how it was produced.',
                                    icon: '🔍',
                                },
                                {
                                    title: 'Consistent Quality',
                                    content: 'Standardized processes and regular audits ensure you get the same premium quality with every order. No surprises, just excellence.',
                                    icon: '⭐',
                                },
                            ].map((item, index) => (
                                <details
                                    key={index}
                                    className="group bg-white rounded-2xl shadow-md overflow-hidden"
                                >
                                    <summary className="flex items-center gap-4 p-6 cursor-pointer list-none">
                                        <span className="text-3xl">{item.icon}</span>
                                        <span className="flex-1 font-bold text-gray-900 text-lg">{item.title}</span>
                                        <svg
                                            className="h-6 w-6 text-gray-400 transform group-open:rotate-180 transition-transform"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-6 pb-6 pt-0 text-gray-600">
                                        <p className="ml-14">{item.content}</p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


        </>
    );
}

