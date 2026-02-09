'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
    {
        category: 'Orders & Delivery',
        questions: [
            {
                question: 'What are your delivery timings?',
                answer: 'We deliver between 7 AM and 9 PM, seven days a week. You can choose your preferred time slot during checkout.',
            },
            {
                question: 'What areas do you deliver to?',
                answer: 'We currently deliver across Bangalore. Enter your pincode during checkout to check if we deliver to your area.',
            },
            {
                question: 'Is there a minimum order value?',
                answer: 'Yes, the minimum order value is ₹299. Orders above ₹999 qualify for free delivery.',
            },
            {
                question: 'Can I track my order?',
                answer: 'Yes! Once your order is dispatched, you will receive a tracking link via SMS and email to monitor your delivery in real-time.',
            },
            {
                question: 'What if I am not available to receive my order?',
                answer: 'Our delivery partner will attempt to contact you. If unreachable, the order will be returned and a refund will be processed.',
            },
        ],
    },
    {
        category: 'Products & Quality',
        questions: [
            {
                question: 'How do you ensure product quality?',
                answer: 'All our products are sourced from trusted farms and processed in temperature-controlled facilities. We maintain a strict cold chain from farm to your doorstep.',
            },
            {
                question: 'Are your products antibiotic-free?',
                answer: 'Yes, we work with farms that follow responsible practices and do not use antibiotics for growth promotion.',
            },
            {
                question: 'Where do you source your products from?',
                answer: 'We partner with certified farms and fisheries across India, prioritizing local producers who meet our strict quality and ethical standards.',
            },
            {
                question: 'How should I store the products after delivery?',
                answer: 'Refrigerate all products immediately upon delivery. For longer storage, you can freeze them. Check individual product packaging for specific storage instructions.',
            },
        ],
    },
    {
        category: 'Payments & Refunds',
        questions: [
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit/debit cards, UPI, net banking, and Cash on Delivery (COD) for orders under ₹5000.',
            },
            {
                question: 'How do I get a refund?',
                answer: 'If you face any quality issues, report it within 24 hours of delivery with photos. Approved refunds are processed within 5-7 business days.',
            },
            {
                question: 'Can I cancel my order?',
                answer: 'Orders can be cancelled before they are dispatched. Once dispatched, cancellation is not possible due to the perishable nature of products.',
            },
        ],
    },
    {
        category: 'Account & Support',
        questions: [
            {
                question: 'How do I create an account?',
                answer: 'Click on "Sign Up" on our website or app and enter your email/phone number. You will receive an OTP to verify your account.',
            },
            {
                question: 'How can I contact customer support?',
                answer: 'You can reach us via email at hello@jhomfoods.com, call us at +91 98765 43210, or use the contact form on our website.',
            },
            {
                question: 'How do I reset my password?',
                answer: 'Click on "Forgot Password" on the login page and enter your registered email. You will receive a link to reset your password.',
            },
        ],
    },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 last:border-0">
            <button
                className="w-full py-4 flex items-center justify-between text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium text-gray-900">{question}</span>
                <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="pb-4 text-gray-600">
                    {answer}
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
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
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg" style={{ color: '#000000' }}>
                            Find answers to common questions about our products and services.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {faqs.map((category, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-md p-6 lg:p-8">
                                <h2
                                    className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    <span className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600 text-lg">
                                        {index === 0 && '🚚'}
                                        {index === 1 && '🥩'}
                                        {index === 2 && '💳'}
                                        {index === 3 && '👤'}
                                    </span>
                                    {category.category}
                                </h2>
                                <div>
                                    {category.questions.map((faq, faqIndex) => (
                                        <FAQItem key={faqIndex} question={faq.question} answer={faq.answer} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still have questions CTA */}
            <section className="section bg-black">
                <div className="container">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-sky-50 rounded-2xl p-8 lg:p-12 text-center">
                            <h2
                                className="text-2xl lg:text-3xl font-bold mb-4 text-sky-600"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Still Have Questions?
                            </h2>
                            <p className="text-sky-600 text-lg mb-8">
                                Can&apos;t find the answer you&apos;re looking for? Our team is here to help.
                            </p>
                            <Link
                                href="/contact"
                                className="btn btn-lg bg-sky-600 text-white hover:bg-sky-700 font-semibold shadow-lg"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
