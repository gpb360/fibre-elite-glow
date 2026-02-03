'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star, Shield, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export function ReviewSubmissionForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        product: '',
        rating: 5,
        review: ''
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setMessage('');

        try {
            const response = await fetch('/api/testimonials/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Submission failed');
            }

            setStatus('success');
            setMessage(`Thank you! Your review has been submitted. Use code ${data.discountCode} for 15% off.`);
            setFormData({ name: '', email: '', product: '', rating: 5, review: '' });

        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    Leave a Verified Review
                </CardTitle>
                <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <Shield className="h-4 w-4 inline mr-1" />
                        <strong>Verification Process:</strong> Reviews are only accepted from verified customers.
                        We require honest, truthful feedback to help us improve and provide you with the premium quality you deserve.
                    </p>
                </div>
            </CardHeader>
            <CardContent>
                {status === 'success' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                            <h3 className="font-bold text-lg mb-2">Success!</h3>
                            <p>{message}</p>
                        </div>
                        <Button onClick={() => setStatus('idle')} variant="outline">Submit Another</Button>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Your email address"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Product Used</label>
                            <select
                                name="product"
                                value={formData.product}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Product</option>
                                <option value="Total Essential">Total Essential</option>
                                <option value="Total Essential Plus">Total Essential Plus</option>
                                <option value="Both Products">Both Products</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                        className={`p-1 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        <Star className="h-6 w-6 fill-current" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Your Review</label>
                            <textarea
                                name="review"
                                value={formData.review}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                                placeholder="Share your honest experience with our products..."
                                required
                            />
                        </div>

                        {status === 'error' && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                                {message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={status === 'submitting'}
                        >
                            {status === 'submitting' ? 'Verifying & Submitting...' : 'Submit Review & Get 15% Off'}
                        </Button>

                        <p className="text-xs text-gray-600 text-center">
                            By submitting this review, you confirm that you are a verified customer and that your review is honest and truthful.
                            Discount code will be shown immediately after verification.
                        </p>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
