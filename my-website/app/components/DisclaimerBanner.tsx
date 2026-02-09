import React from 'react';

const DisclaimerBanner = () => {
    return (
        <div className="w-full bg-transparent py-2 relative z-10 border-b border-gray-100">
            <div className="container mx-auto px-4">
                <span className="text-gray-600 font-light text-base tracking-widest uppercase italic">
                    ❄️ All the products are blast frozen and stored in -18 °C, Thaw before consumption ❄️
                </span>
            </div>
        </div>
    );
};

export default DisclaimerBanner;
