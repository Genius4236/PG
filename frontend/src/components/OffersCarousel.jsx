import React from 'react';
import { ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { offers } from '../mock/mockData';
import { Button } from './ui/button';

const OffersCarousel = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + offers.length) % offers.length);
  };

  // Auto-scroll
  React.useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, []);

  const getVisibleOffers = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(offers[(currentIndex + i) % offers.length]);
    }
    return visible;
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getVisibleOffers().map((offer, index) => (
              <div
                key={`${offer.id}-${index}`}
                className={`rounded-lg overflow-hidden shadow-lg transition-all duration-500 ${
                  offer.color === 'bg-yellow-500' ? 'bg-yellow-500' : offer.color === 'bg-blue-900' ? 'bg-blue-900' : 'bg-blue-800'
                }`}
              >
                <div className="p-6 text-white relative">
                  {/* Skyline background */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
                    <svg viewBox="0 0 1440 128" className="w-full h-full">
                      <path
                        d="M0 96h288V48H0v48zm320 0h288V32H320v64zm320 0h288V16H640v80zm320 0h288V48H960v48zm320 0h288V32H1280v64z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-white p-1 rounded">
                        <Building2 className="h-5 w-5 text-cyan-500" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Find My PG</div>
                        <div className="text-xs opacity-80">LIVE YOUR LIFE STYLE</div>
                      </div>
                    </div>

                    {/* <div className="text-sm mb-2">Instant Discount</div> */}
                    <h3 className="text-2xl font-bold mb-2">{offer.city}</h3>
                    <div className="mb-3">
                      {/* <span className="text-lg font-semibold">{offer.discount} off on rent: </span> */}
                      <span className="bg-white text-gray-900 px-3 py-1 rounded font-bold text-sm">
                        {offer.code}
                      </span>
                    </div>
                    {/* <p className="text-xs opacity-90">*Valid only on 1 month bookings</p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OffersCarousel;
