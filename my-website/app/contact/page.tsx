import ContactForm from '@/app/components/ContactForm';
import Link from 'next/link';

export const metadata = {
    title: 'Contact Us - JHOM FOODS',
    description: 'Get in touch with our team. We\'re here to help with any questions about our products or services.',
};

export default function ContactPage() {
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
                            Contact Us
                        </h1>
                        <p className="text-lg" style={{ color: '#000000' }}>
                            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-10">
                                <h2
                                    className="text-2xl font-bold text-gray-900 mb-6"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    Send us a message
                                </h2>
                                <ContactForm />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-1">
                            <div className="space-y-6">
                                {/* Address */}
                                <div className="bg-white rounded-2xl shadow-md p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="h-6 w-6 text-cyan-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                                            <p className="text-gray-600 text-sm">
                                                JHOM FOODS Pvt. Ltd.<br />
                                                123 Market Lane<br />
                                                Koramangala, Bangalore<br />
                                                Karnataka 560034
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="bg-white rounded-2xl shadow-md p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="h-6 w-6 text-blue-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                            <a
                                                href="mailto:hello@jhomfoods.com"
                                                className="text-cyan-600 hover:text-cyan-700 text-sm"
                                            >
                                                hello@jhomfoods.com
                                            </a>
                                            <p className="text-gray-500 text-sm mt-1">
                                                We reply within 24 hours
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="bg-white rounded-2xl shadow-md p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="h-6 w-6 text-orange-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                                            <a
                                                href="tel:+919876543210"
                                                className="text-cyan-600 hover:text-cyan-700 text-sm"
                                            >
                                                +91 98765 43210
                                            </a>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Mon-Sat, 9AM - 6PM
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Operating Hours */}
                                <div className="bg-white rounded-2xl shadow-md p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="h-6 w-6 text-purple-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Operating Hours</h3>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                                                <p>Saturday: 9:00 AM - 6:00 PM</p>
                                                <p>Sunday: 10:00 AM - 4:00 PM</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bulk Orders CTA */}
            <section className="section bg-black">
                <div className="container">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-sky-50 rounded-2xl p-8 lg:p-12 text-center">
                            <h2
                                className="text-2xl lg:text-4xl font-bold mb-4 text-sky-600"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Need Bulk Orders?
                            </h2>
                            <p className="text-sky-600 text-lg mb-8">
                                Special pricing for restaurants, hotels, and catering services.
                            </p>
                            <Link
                                href="/bulk-orders"
                                className="btn btn-lg bg-sky-600 text-white hover:bg-sky-700 font-semibold shadow-lg"
                            >
                                Get Bulk Pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

