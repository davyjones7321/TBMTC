import React from 'react';

const DisclaimerBanner = () => {
    return (
        <div className="w-full bg-transparent overflow-hidden py-2 relative z-10 border-b border-gray-100">
            <div className="animate-marquee-reverse whitespace-nowrap">
                <span className="text-gray-600 font-light text-base tracking-widest uppercase italic px-4">
                    ❄️ All the products are blast frozen and stored in -18 °C, Thaw before consumption ❄️
                </span>
            </div>
        </div>
    );
};

export default DisclaimerBanner;
