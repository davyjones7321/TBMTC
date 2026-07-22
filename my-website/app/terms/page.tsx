import Link from 'next/link';

export const metadata = {
    title: 'Terms of Service - THE BANGALORE MEAT AND TRADING COMPANY',
    description: 'Read the terms and conditions governing your use of THE BANGALORE MEAT AND TRADING COMPANY services.',
};

export default function TermsOfServicePage() {
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
                            Terms of Service
                        </h1>
                        <p className="text-lg" style={{ color: '#000000' }}>
                            Please read these terms carefully before using our services.
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
                                    1. Acceptance of Terms
                                </h2>
                                <p className="text-gray-600">
                                    By accessing or using JHOM FOODS services, you agree to be bound by these Terms of Service.
                                    If you do not agree to these terms, please do not use our services.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    2. Account Registration
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    To place orders, you must create an account. You agree to:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                    <li>Provide accurate and complete information</li>
                                    <li>Maintain the security of your account credentials</li>
                                    <li>Notify us immediately of any unauthorized access</li>
                                    <li>Be responsible for all activities under your account</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    3. Orders and Payments
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    When you place an order:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                    <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
                                    <li>We reserve the right to refuse or cancel orders</li>
                                    <li>Payment must be made at the time of order or upon delivery (COD)</li>
                                    <li>Delivery fees may apply based on your location</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    4. Delivery
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Regarding delivery of orders:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                    <li>Delivery times are estimates and not guaranteed</li>
                                    <li>You must be available to receive orders at the specified address</li>
                                    <li>Risk of loss transfers to you upon delivery</li>
                                    <li>We may restrict delivery to certain areas</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    5. Product Quality
                                </h2>
                                <p className="text-gray-600">
                                    We are committed to delivering high-quality products. If you receive a product
                                    that does not meet our quality standards, please contact us within 24 hours of delivery
                                    for a refund or replacement.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    6. Refunds and Returns
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Due to the perishable nature of our products:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                    <li>Returns are not accepted once products are delivered</li>
                                    <li>Refunds may be issued for quality issues reported within 24 hours</li>
                                    <li>Photo evidence may be required for refund claims</li>
                                    <li>Refunds will be processed within 5-7 business days</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    7. Limitation of Liability
                                </h2>
                                <p className="text-gray-600">
                                    JHOM FOODS shall not be liable for any indirect, incidental, special, or consequential
                                    damages arising from your use of our services. Our total liability shall not exceed
                                    the amount paid for the specific order in question.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    8. Changes to Terms
                                </h2>
                                <p className="text-gray-600">
                                    We may update these terms from time to time. Continued use of our services after
                                    changes constitutes acceptance of the new terms. We encourage you to review these
                                    terms periodically.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    9. Governing Law
                                </h2>
                                <p className="text-gray-600">
                                    These terms shall be governed by and construed in accordance with the laws of India.
                                    Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                    10. Contact
                                </h2>
                                <p className="text-gray-600">
                                    For questions about these Terms of Service, please contact us at{' '}
                                    <a href="mailto:legal@jhomfoods.com" className="text-cyan-600 hover:text-cyan-700">
                                        legal@jhomfoods.com
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
                                Ready to Shop?
                            </h2>
                            <p className="text-sky-600 text-lg mb-8">
                                Browse our selection of premium, ethically sourced products.
                            </p>
                            <Link
                                href="/shop"
                                className="btn btn-lg bg-sky-600 text-white hover:bg-sky-700 font-semibold shadow-lg"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
