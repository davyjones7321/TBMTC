'use client';

import { useState } from 'react';
import { API_BASE_URL } from '@/app/lib/api-config';
import { BulkOrderFormData, BusinessType } from '@/app/types';

const businessTypes: { value: BusinessType; label: string }[] = [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'catering', label: 'Catering Service' },
    { value: 'retailer', label: 'Retailer' },
    { value: 'other', label: 'Other' },
];

export default function BulkOrdersPage() {
    const [formData, setFormData] = useState<BulkOrderFormData>({
        businessName: '',
        businessType: 'restaurant',
        contactName: '',
        email: '',
        phone: '',
        city: '',
        estimatedMonthlyVolume: '',
        productInterests: [],
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const productOptions = [
        { id: 'fish-seafood', label: 'Fish & Seafood' },
        { id: 'poultry', label: 'Poultry' },
        { id: 'mutton', label: 'Mutton' },
        { id: 'ready-to-cook', label: 'Ready to Cook' },
        { id: 'vegetarian', label: 'Vegetarian' },
    ];

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/bulk-orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit request');
            }

            setIsSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProductToggle = (productId: string) => {
        setFormData((prev) => ({
            ...prev,
            productInterests: prev.productInterests.includes(productId)
                ? prev.productInterests.filter((id) => id !== productId)
                : [...prev.productInterests, productId],
        }));
    };

    if (isSuccess) {
        return (
            <>
                <section className="pt-32 pb-24">
                    <div className="container">
                        <div className="max-w-md mx-auto text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-100 flex items-center justify-center">
                                <svg
                                    className="h-10 w-10 text-cyan-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1
                                className="text-3xl font-bold text-gray-900 mb-4"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Request Submitted!
                            </h1>
                            <p className="text-gray-600 mb-8">
                                Thank you for your interest in bulk orders. Our team will contact you within 24-48 hours.
                            </p>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-16 text-white overflow-hidden" style={{ backgroundColor: '#570C19' }}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>
                <div className="container relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#F5DDE1' }}>
                            FOR BUSINESSES
                        </span>
                        <h1
                            className="text-4xl lg:text-5xl font-bold mb-4"
                            style={{ fontFamily: 'var(--font-display)', color: '#F5DDE1' }}
                        >
                            Bulk Orders
                        </h1>
                        <p className="text-lg" style={{ color: '#E8C4CA' }}>
                            Special pricing and dedicated support for restaurants, hotels, and catering services.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-12 bg-white border-b">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: '💰', title: 'Competitive Pricing', desc: 'Special rates for bulk' },
                            { icon: '🚚', title: 'Reliable Delivery', desc: 'On-time, every time' },
                            { icon: '📦', title: 'Flexible Quantities', desc: 'Order what you need' },
                            { icon: '👤', title: 'Dedicated Support', desc: 'Personal account manager' },
                        ].map((benefit, index) => (
                            <div key={index}>
                                <div className="text-4xl mb-3">{benefit.icon}</div>
                                <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                                <p className="text-sm text-gray-600">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10">
                            <h2
                                className="text-2xl font-bold text-gray-900 mb-2"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Request a Quote
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Fill out the form below and our team will get back to you within 24-48 hours.
                            </p>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label className="form-label">Business Name *</label>
                                        <input
                                            type="text"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Your business name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Business Type *</label>
                                        <select
                                            name="businessType"
                                            value={formData.businessType}
                                            onChange={handleChange}
                                            className="form-select"
                                            required
                                        >
                                            {businessTypes.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label className="form-label">Contact Name *</label>
                                        <input
                                            type="text"
                                            name="contactName"
                                            value={formData.contactName}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Your name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label className="form-label">Phone *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="+91 XXXXX XXXXX"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Bangalore"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Estimated Monthly Volume *</label>
                                    <select
                                        name="estimatedMonthlyVolume"
                                        value={formData.estimatedMonthlyVolume}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select volume</option>
                                        <option value="50-100kg">50 - 100 kg</option>
                                        <option value="100-250kg">100 - 250 kg</option>
                                        <option value="250-500kg">250 - 500 kg</option>
                                        <option value="500-1000kg">500 - 1000 kg</option>
                                        <option value="1000kg+">1000+ kg</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Products Interested In</label>
                                    <div className="flex flex-wrap gap-3 mt-2">
                                        {productOptions.map((product) => (
                                            <button
                                                key={product.id}
                                                type="button"
                                                onClick={() => handleProductToggle(product.id)}
                                                className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-colors ${formData.productInterests.includes(product.id)
                                                    ? 'text-white'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:border-[#570C19]/30'
                                                    }`}
                                                style={formData.productInterests.includes(product.id) ? { backgroundColor: '#570C19', borderColor: '#570C19', color: '#F5DDE1' } : undefined}
                                            >
                                                {product.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Additional Requirements</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="form-textarea"
                                        placeholder="Tell us about your specific requirements..."
                                        rows={4}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary btn-lg w-full justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                />
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Request'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section bg-white">
                <div className="container">
                    <div className="max-w-3xl mx-auto">
                        <h2
                            className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-4">
                            {[
                                {
                                    q: 'What is the minimum order quantity?',
                                    a: 'Our minimum order for bulk pricing is 50kg per order. For specific products, minimums may vary.',
                                },
                                {
                                    q: 'How does pricing work for bulk orders?',
                                    a: 'We offer tiered pricing based on volume. The more you order, the better the rates. Contact us for a custom quote.',
                                },
                                {
                                    q: 'What are your delivery options?',
                                    a: 'We offer scheduled deliveries (daily, weekly, bi-weekly) based on your needs. All deliveries are in temperature-controlled vehicles.',
                                },
                                {
                                    q: 'Do you provide credit terms?',
                                    a: 'Yes, we offer credit terms for established business accounts. Terms vary based on order volume and payment history.',
                                },
                            ].map((faq, index) => (
                                <details
                                    key={index}
                                    className="group bg-gray-50 rounded-xl overflow-hidden"
                                >
                                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-semibold text-gray-900">
                                        {faq.q}
                                        <svg
                                            className="h-5 w-5 text-gray-500 transform group-open:rotate-180 transition-transform"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-5 pb-5 text-gray-600">
                                        {faq.a}
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

