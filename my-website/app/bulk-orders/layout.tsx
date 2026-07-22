import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bulk Orders - THE BANGALORE MEAT AND TRADING COMPANY',
    description: 'Special pricing for restaurants, hotels, and catering services. Get a quote for bulk orders.',
};

export default function BulkOrdersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

