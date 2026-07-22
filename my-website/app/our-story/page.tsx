import Link from 'next/link';
import StorySection from '@/app/components/StorySection';

export const metadata = {
    title: 'Our Story - THE BANGALORE MEAT AND TRADING COMPANY',
    description: 'Learn about our mission to create meaningful connections between farmers and customers through quality, transparency, and sustainability.',
};

const coreValues = [
    {
        icon: '🐄',
        title: 'Animal Welfare',
        description: 'We partner with farms that prioritize humane treatment and natural living conditions.',
    },
    {
        icon: '👨‍🌾',
        title: 'Supporting Farmers',
        description: 'Direct relationships with local producers ensure fair prices and sustainable livelihoods.',
    },
    {
        icon: '🌍',
        title: 'Environmental Respect',
        description: 'Sustainable practices that protect our planet for future generations.',
    },
    {
        icon: '🤝',
        title: 'Diversity & Inclusion',
        description: 'Celebrating diverse communities and creating opportunities for all.',
    },
    {
        icon: '🔍',
        title: 'Transparency',
        description: 'Complete visibility into our sourcing, processes, and quality standards.',
    },
    {
        icon: '✓',
        title: 'Quality Assurance',
        description: 'Rigorous testing and standards ensure only the best reaches your table.',
    },
];

export default function OurStoryPage() {
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
                            OUR STORY
                        </span>
                        <h1
                            className="text-4xl lg:text-6xl font-bold mb-6"
                            style={{ fontFamily: 'var(--font-display)', color: '#F5DDE1' }}
                        >
                            Creating meaningful connections through food
                        </h1>
                        <p className="text-lg lg:text-xl" style={{ color: '#E8C4CA' }}>
                            We believe in knowing where your food comes from and the people who produce it.
                        </p>
                    </div>
                </div>
            </section>

            {/* Opening Statement */}
            <section className="section bg-white">
                <div className="container">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2
                            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            &ldquo;We believe in creating a meaningful connection between you and the food you eat.&rdquo;
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            At The Bangalore Meat & Trading Company, we&apos;re not just delivering meat and seafood—we&apos;re building bridges between
                            conscious consumers and ethical producers. Every product tells a story of dedication,
                            sustainability, and exceptional quality.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Sections */}
            <StorySection
                heading="How it all started"
                content={[
                    "The Bangalore Meat & Trading Company was born from a simple belief: everyone deserves access to high-quality, ethically sourced meat and seafood. We saw a food system that was broken—disconnected from the farmers who work tirelessly and the customers who deserve transparency.",
                    "In 2024, we set out to change that. Starting from Bangalore, we built direct relationships with small, independent farms and fisheries who shared our values. Today, we're proud to serve thousands of families who trust us with their food.",
                ]}
                image="🌱"
                imageAlt="The beginning of The Bangalore Meat & Trading Company"
                imagePosition="right"
            />

            <div className="bg-gray-50">
                <StorySection
                    heading="Our Mission"
                    content={[
                        "We're on a mission to transform how people buy and think about meat and seafood. By connecting customers directly with producers, we ensure fair prices for farmers and premium quality for families.",
                        "Every product we sell is fully traceable. We want you to know the farm, the farmer, and the journey your food took to reach your table. That's The Bangalore Meat & Trading Company promise.",
                    ]}
                    image="🎯"
                    imageAlt="Our mission"
                    imagePosition="left"
                    cta={{ text: 'View Certifications', href: '/certifications' }}
                />
            </div>

            <StorySection
                heading="The Recipe for a Great Meal"
                content={[
                    "Great food starts with great ingredients. We handpick every product, working with expert butchers and quality specialists to ensure only the best reaches your table.",
                    "But it's more than just taste—it's about food that's better for you, better for the earth, better for the animals, and better for the hardworking producers who make it all possible.",
                ]}
                image="👨‍🍳"
                imageAlt="Quality and care"
                imagePosition="right"
                cta={{ text: 'View Our Products', href: '/shop' }}
            />

            {/* Core Values */}
            <section className="section" style={{ backgroundColor: '#faf6f1' }}>
                <div className="container">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: '#570C19', color: '#F5DDE1' }}>
                            WHAT WE STAND FOR
                        </span>
                        <h2
                            className="text-3xl lg:text-4xl font-bold text-gray-900"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Our Core Values
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {coreValues.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
                            >
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FAEFF1' }}>
                                    <span className="text-3xl">{value.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Us CTA */}
            <section className="section" style={{ backgroundColor: '#faf6f1' }}>
                <div className="container">
                    <div className="max-w-3xl mx-auto">
                        <div className="rounded-2xl p-8 lg:p-12 text-center" style={{ backgroundColor: '#570C19' }}>
                            <h2
                                className="text-3xl lg:text-4xl font-bold mb-6"
                                style={{ fontFamily: 'var(--font-display)', color: '#F5DDE1' }}
                            >
                                Join the Food Transparency Movement
                            </h2>
                            <p className="text-lg mb-8" style={{ color: '#E8C4CA' }}>
                                Experience the difference of knowing exactly where your food comes from.
                                Shop with confidence, eat with pride.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/shop" className="btn btn-lg bg-white font-semibold shadow-lg hover:bg-gray-100" style={{ color: '#570C19' }}>
                                    Shop Now
                                </Link>
                                <Link href="/certifications" className="btn btn-lg border-2 border-white/30 text-white hover:bg-white/10" style={{ color: '#F5DDE1' }}>
                                    Our Certifications
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

