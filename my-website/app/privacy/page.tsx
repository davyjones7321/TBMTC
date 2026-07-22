import Link from 'next/link';

export const metadata = {
    title: 'Privacy Policy - THE BANGALORE MEAT AND TRADING COMPANY',
    description: 'Learn how THE BANGALORE MEAT AND TRADING COMPANY collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-16 bg-gradient-to-br from-cyan-800 via-cyan-700 to-cyan-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>
                <div className="container relative">
                    <div className="max-w-2xl">
                        <h1
                            className="text-4xl lg:text-5xl font-bold mb-4"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Privacy Policy
                        </h1>
                        <p className="text-lg" style={{ color: '#000000' }}>
                            Your privacy is important to us. This policy outlines how we handle your data.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-md p-8 lg:p-12 space-y-8">
                            <div>
                                <p className="text-sm text-gray-500 mb-8">Last updated: February 2026</p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    1. Information We Collect
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    We collect information you provide directly to us, including:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                    <li>Name, email address, and phone number</li>
                                    <li>Delivery address and billing information</li>
                                    <li>Order history and preferences</li>
                                    <li>Communications with our customer support team</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    2. How We Use Your Information
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    We use the information we collect to:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                    <li>Process and deliver your orders</li>
                                    <li>Send order confirmations and delivery updates</li>
                                    <li>Provide customer support</li>
                                    <li>Send promotional communications (with your consent)</li>
                                    <li>Improve our products and services</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    3. Information Sharing
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    We do not sell your personal information. We may share your information with:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                    <li>Delivery partners to fulfill your orders</li>
                                    <li>Payment processors to complete transactions</li>
                                    <li>Service providers who assist our operations</li>
                                    <li>Law enforcement when required by law</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    4. Data Security
                                </h2>
                                <p className="text-gray-600">
                                    We implement industry-standard security measures to protect your personal information,
                                    including encryption, secure servers, and regular security audits. However, no method
                                    of transmission over the Internet is 100% secure.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    5. Your Rights
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    You have the right to:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                    <li>Access your personal information</li>
                                    <li>Correct inaccurate data</li>
                                    <li>Request deletion of your data</li>
                                    <li>Opt-out of marketing communications</li>
                                    <li>Export your data</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    6. Cookies
                                </h2>
                                <p className="text-gray-600">
                                    We use cookies and similar technologies to enhance your browsing experience,
                                    analyze site traffic, and personalize content. You can control cookie preferences
                                    through your browser settings.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    7. Contact Us
                                </h2>
                                <p className="text-gray-600">
                                    If you have any questions about this Privacy Policy, please contact us at{' '}
                                    <a href="mailto:privacy@jhomfoods.com" className="text-cyan-600 hover:text-cyan-700">
                                        privacy@jhomfoods.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section bg-black">
                <div className="container">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-sky-50 rounded-2xl p-8 lg:p-12 text-center">
                            <h2
                                className="text-2xl lg:text-3xl font-bold mb-4 text-sky-600"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Have Questions?
                            </h2>
                            <p className="text-sky-600 text-lg mb-8">
                                Our team is here to help with any privacy-related concerns.
                            </p>
                            <Link
                                href="/contact"
                                className="btn btn-lg bg-sky-600 text-white hover:bg-sky-700 font-semibold shadow-lg"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
