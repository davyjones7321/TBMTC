export type BusinessType = 'restaurant' | 'hotel' | 'catering' | 'retailer' | 'other';

export interface BulkOrderFormData {
    businessName: string;
    businessType: BusinessType;
    contactName: string;
    email: string;
    phone: string;
    city: string;
    estimatedMonthlyVolume: string;
    productInterests: string[];
    message: string;
}

export interface BulkOrderResponse {
    success: boolean;
    data: {
        bulkOrder: {
            _id: string;
            businessName: string;
            status: string;
            createdAt: string;
        };
    };
    message: string;
}
