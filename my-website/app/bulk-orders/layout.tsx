import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bulk Orders - JHOM FOODS',
    description: 'Special pricing for restaurants, hotels, and catering services. Get a quote for bulk orders.',
};

export default function BulkOrdersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

