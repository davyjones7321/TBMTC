import Link from 'next/link';

interface StorySectionProps {
    heading: string;
    content: string | string[];
    image: string;
    imageAlt: string;
    imagePosition?: 'left' | 'right';
    cta?: {
        text: string;
        href: string;
    };
}

export default function StorySection({
    heading,
    content,
    image,
    imageAlt,
    imagePosition = 'right',
    cta,
}: StorySectionProps) {
    const contentArray = Array.isArray(content) ? content : [content];

    return (
        <section className="section overflow-hidden">
            <div className="container">
                <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${imagePosition === 'left' ? '' : ''
                        }`}
                >
                    {/* Text Content */}
                    <div
                        className={`${imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1'}`}
                    >
                        <h2
                            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            {heading}
                        </h2>

                        <div className="space-y-4">
                            {contentArray.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="text-lg text-gray-600 leading-relaxed"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {cta && (
                            <Link
                                href={cta.href}
                                className="inline-flex items-center gap-2 mt-6 font-semibold text-lg hover:underline group"
                                style={{ color: '#570C19' }}
                            >
                                {cta.text}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 transform group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </Link>
                        )}
                    </div>

                    {/* Image */}
                    <div
                        className={`${imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'}`}
                    >
                        <div className="relative">
                            {/* Main Image Container */}
                            <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-cyan-100 to-cyan-200 aspect-[4/3]">
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-8xl">{image}</span>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div
                                className={`absolute -z-10 w-full h-full rounded-2xl bg-cyan-100 top-4 ${imagePosition === 'left' ? '-left-4' : '-right-4'
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

