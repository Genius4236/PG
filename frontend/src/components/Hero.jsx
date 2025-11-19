import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cities } from '../mock/mockData';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100); // slight delay before reveal
    return () => clearTimeout(t);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNearMe = () => {
    navigate('/search?nearme=true');
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-50 to-teal-50 py-20">
      {/* Background illustration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSIxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMCAwaDE0NDB2MTI4SDBWMHoiIGZpbGw9IiMwMDNkNWMiLz48L2c+PC9zdmc+')] bg-repeat-x"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <div className={`text-center mb-8 transform transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-teal-700 mb-3">
            Find My PG
          </h1>
          <p className="text-lg text-gray-600">
            India's First PG Network to Book your PG Online
          </p>
        </div>

        {/* Search Box */}
        <div className={`max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 mb-12 border border-slate-100 transform transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Enter city name, area etc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 py-5 text-lg border-gray-300 rounded-md focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <Button
              onClick={handleNearMe}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-6 flex items-center gap-2"
            >
              <MapPin className="h-5 w-5" />
              Near me
            </Button>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-4 md:gap-6">
            {cities.map((city, index) => (
              <div
                key={city.id}
                onClick={() => navigate(`/search?city=${city.name}`)}
                className={`cursor-pointer group transform transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${200 + index * 80}ms` }} // stagger
              >
                <div className="relative overflow-hidden rounded-full aspect-square mb-2 border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-center text-sm font-medium text-gray-700 group-hover:text-teal-600 transition">
                  {city.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* City Skyline Illustration */}
        <div className="w-full h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI5NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDk2aDI4OFY0OEgwdjQ4em0zMjAgMGgyODhWMzJIMzIwdjY0em0zMjAgMGgyODhWMTZINjQwdjgwem0zMjAgMGgyODhWNDhIOTYwdjQ4em0zMjAgMGgyODhWMzJIMTI4MHY2NHoiIGZpbGw9IiNFNUU3RUIiLz48L2c+PC9zdmc+')] bg-repeat-x bg-bottom opacity-25"></div>
      </div>
    </div>
  );
};

export default Hero;
