'use client';

import { useState } from 'react';
import { ContactFormData, ContactSubject } from '@/app/types';
import { api } from '@/app/lib/api';

const subjectOptions: { value: ContactSubject; label: string }[] = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'wholesale', label: 'Wholesale/Bulk Orders' },
    { value: 'quality', label: 'Quality Concern' },
    { value: 'order_mismatch', label: 'Order Mismatch' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'media', label: 'Media/Press Inquiry' },
];

export default function ContactForm() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

        if (!formData.name || formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.phone && !/^[0-9+\-\s()]*$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.message || formData.message.length < 20) {
            newErrors.message = 'Message must be at least 20 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const result = await api.contact.submit(formData);

            if (result.success) {
                setIsSubmitting(false);
                setIsSuccess(true);

                // Reset form after 3 seconds
                setTimeout(() => {
                    setIsSuccess(false);
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'general',
                        message: '',
                    });
                }, 3000);
            } else {
                setIsSubmitting(false);
                setErrors((prev) => ({
                    ...prev,
                    message: result.message || 'Failed to send message. Please try again.',
                }));
            }
        } catch (error) {
            console.error('Contact submit error:', error);
            setIsSubmitting(false);
            setErrors((prev) => ({
                ...prev,
                message: 'An unexpected error occurred. Please try again later.',
            }));
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof ContactFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-cyan-50 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-cyan-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h3>
                <p className="text-gray-600">
                    Your message has been sent successfully. We&apos;ll get back to you soon.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="form-group">
                    <label htmlFor="name" className="form-label">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Your name"
                    />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="your@email.com"
                    />
                    {errors.email && <p className="form-error">{errors.email}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                        Phone (optional)
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="+91 XXXXX XXXXX"
                    />
                    {errors.phone && <p className="form-error">{errors.phone}</p>}
                </div>

                {/* Subject */}
                <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                        Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-select"
                    >
                        {subjectOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Message */}
            <div className="form-group">
                <label htmlFor="message" className="form-label">
                    Message <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`form-textarea ${errors.message ? 'border-red-500' : ''}`}
                    placeholder="How can we help you?"
                    rows={5}
                />
                {errors.message && <p className="form-error">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg w-full md:w-auto"
            >
                {isSubmitting ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Sending...
                    </>
                ) : (
                    <>
                        Send Message
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
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </>
                )}
            </button>
        </form>
    );
}

