import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// Types for checkout data matching backend API
interface DeliveryDetails {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    orderNotes: string;
}

interface CheckoutContextType {
    deliveryDetails: DeliveryDetails;
    setDeliveryDetails: (details: DeliveryDetails) => void;
    resetCheckout: () => void;
    getShippingAddress: () => {
        firstName: string;
        lastName: string;
        phone: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    getDeliverySlot: () => string;
}

const defaultDeliveryDetails: DeliveryDetails = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: 'Haryana',
    zipCode: '',
    country: 'India',
    orderNotes: '',
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [deliveryDetails, setDeliveryDetailsState] = useState<DeliveryDetails>(defaultDeliveryDetails);

    const setDeliveryDetails = useCallback((details: DeliveryDetails) => {
        setDeliveryDetailsState(details);
    }, []);

    const resetCheckout = useCallback(() => {
        setDeliveryDetailsState(defaultDeliveryDetails);
    }, []);

    // Format shipping address for backend API
    const getShippingAddress = useCallback(() => {
        return {
            firstName: deliveryDetails.firstName,
            lastName: deliveryDetails.lastName,
            phone: deliveryDetails.phone,
            street: deliveryDetails.street,
            city: deliveryDetails.city,
            state: deliveryDetails.state,
            zipCode: deliveryDetails.zipCode,
            country: deliveryDetails.country,
        };
    }, [deliveryDetails]);

    // Get delivery slot (order notes) for backend API
    const getDeliverySlot = useCallback(() => {
        return deliveryDetails.orderNotes;
    }, [deliveryDetails]);

    return (
        <CheckoutContext.Provider
            value={{
                deliveryDetails,
                setDeliveryDetails,
                resetCheckout,
                getShippingAddress,
                getDeliverySlot,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => {
    const context = useContext(CheckoutContext);
    if (context === undefined) {
        throw new Error('useCheckout must be used within a CheckoutProvider');
    }
    return context;
};
