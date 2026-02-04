import Link from 'next/link';

interface ValueCardProps {
    icon: string;
    title: string;
    description: string;
    link?: {
        text: string;
        href: string;
    };
}

export default function ValueCard({ icon, title, description, link }: ValueCardProps) {
    return (
        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-cyan-200">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">{icon}</span>
            </div>

            {/* Content */}
            <h3
                className="text-xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {title}
            </h3>

            <p className="text-gray-600 leading-relaxed mb-4">{description}</p>

            {link && (
                <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 group/link"
                >
                    {link.text}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 transform group-hover/link:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </Link>
            )}
        </div>
    );
}

interface ValueCardImageProps {
    image: string;
    title: string;
    description: string;
}

export function ValueCardImage({ image, title, description }: ValueCardImageProps) {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
            {/* Image */}
            <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-cyan-50 to-cyan-100">
                <div className="w-full h-full flex items-center justify-center">
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                        {image}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 lg:p-8">
                <h3
                    className="text-xl lg:text-2xl font-bold text-gray-900 mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    {title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

