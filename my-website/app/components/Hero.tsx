import Link from 'next/link';

interface HeroProps {
    title: string;
    subtitle?: string;
    primaryCta?: {
        text: string;
        href: string;
    };
    secondaryCta?: {
        text: string;
        href: string;
    };
    backgroundImage?: string;
    overlay?: boolean;
    size?: 'small' | 'medium' | 'large';
    centered?: boolean;
}

export default function Hero({
    title,
    subtitle,
    primaryCta,
    secondaryCta,
    backgroundImage,
    overlay = true,
    size = 'large',
    centered = false,
}: HeroProps) {
    const sizeClasses = {
        small: 'min-h-[300px] md:min-h-[400px]',
        medium: 'min-h-[400px] md:min-h-[500px]',
        large: 'min-h-[600px] md:min-h-[700px]',
    };

    return (
        <section
            className={`relative ${sizeClasses[size]} flex items-center overflow-hidden`}
        >
            {/* Background */}
            <div className="absolute inset-0">
                {backgroundImage ? (
                    <div
                        className="w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-800 via-cyan-700 to-cyan-900">
                        {/* Decorative Elements */}
                        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-600/30 rounded-full blur-3xl" />
                        <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-3xl" />
                    </div>
                )}

                {/* Overlay */}
                {overlay && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
                )}

                {/* Grain Texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Content */}
            <div className="container relative z-10">
                <div
                    className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''
                        } animate-fade-in-up`}
                >
                    <h1
                        className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed max-w-2xl" style={{ color: '#000000' }}>
                            {subtitle}
                        </p>
                    )}

                    {(primaryCta || secondaryCta) && (
                        <div
                            className={`flex flex-col sm:flex-row gap-4 ${centered ? 'justify-center' : ''
                                }`}
                        >
                            {primaryCta && (
                                <Link
                                    href={primaryCta.href}
                                    className="btn btn-lg bg-white text-gray-900 hover:bg-gray-100 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                >
                                    {primaryCta.text}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
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
                            {secondaryCta && (
                                <Link
                                    href={secondaryCta.href}
                                    className="btn btn-lg btn-outline-white font-semibold"
                                >
                                    {secondaryCta.text}
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>
    );
}

