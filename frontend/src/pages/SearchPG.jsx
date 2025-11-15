import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { pgAPI } from '../lib/api';

const SearchPG = () => {
  const [searchParams] = useSearchParams();
  const [pgs, setPgs] = useState([]);
  const [filteredPgs, setFilteredPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const { toast } = useToast();
  
  // Fetch PGs from API
  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const response = await pgAPI.getPGs();
        setPgs(response.data.pgs);
        setFilteredPgs(response.data.pgs);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load PG listings',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPGs();
  }, [toast]);

  useEffect(() => {
    const city = searchParams.get('city');
    const query = searchParams.get('query');

    let filtered = [...pgs];

    if (city) {
      filtered = filtered.filter(pg => pg.city.toLowerCase() === city.toLowerCase());
      setCityFilter(city);
    }

    if (query) {
      setSearchQuery(query);
      filtered = filtered.filter(pg =>
        pg.name.toLowerCase().includes(query.toLowerCase()) ||
        pg.city.toLowerCase().includes(query.toLowerCase()) ||
        pg.locality.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredPgs(filtered);
  }, [searchParams, pgs]);

  const applyFilters = () => {
    let filtered = [...pgs];

    if (cityFilter !== 'all') {
      filtered = filtered.filter(pg => pg.city === cityFilter);
    }

    if (genderFilter !== 'all') {
      filtered = filtered.filter(pg => pg.gender === genderFilter);
    }

    if (priceRange !== 'all') {
      filtered = filtered.filter(pg => {
        const minPrice = Math.min(...pg.sharing_types.map(s => s.price));
        if (priceRange === '0-8000') return minPrice <= 8000;
        if (priceRange === '8000-12000') return minPrice > 8000 && minPrice <= 12000;
        if (priceRange === '12000+') return minPrice > 12000;
        return true;
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(pg =>
        pg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pg.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pg.locality.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPgs(filtered);
  };

  useEffect(() => {
    if (pgs.length > 0) {
      applyFilters();
    }
  }, [cityFilter, genderFilter, priceRange, searchQuery, pgs]);

  const cities = [...new Set(pgs.map(pg => pg.city))];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by name, city or locality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-cyan-600" />
                <h3 className="font-bold text-lg text-[#003d5c]">Filters</h3>
              </div>

              <div className="space-y-6">
                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="boys">Boys</SelectItem>
                      <SelectItem value="girls">Girls</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-8000">Under ₹8,000</SelectItem>
                      <SelectItem value="8000-12000">₹8,000 - ₹12,000</SelectItem>
                      <SelectItem value="12000+">Above ₹12,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="md:col-span-3">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-[#003d5c]">
                {filteredPgs.length} PG{filteredPgs.length !== 1 ? 's' : ''} Found
              </h2>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Loader2 className="h-16 w-16 text-cyan-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading PGs...</h3>
                <p className="text-gray-500">Please wait while we fetch the latest listings</p>
              </div>
            ) : filteredPgs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No PGs Found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPgs.map((pg) => (
                  <Link to={`/pg/${pg.id}`} key={pg.id}>
                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3 relative">
                          <img
                            src={pg.images && pg.images.length > 0 ? pg.images[0] : '/placeholder-pg.jpg'}
                            alt={pg.name}
                            className="w-full h-64 md:h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {pg.gender === 'boys' ? 'Boys' : 'Girls'}
                          </div>
                        </div>
                        <div className="md:w-2/3 p-6">
                          <h3 className="text-2xl font-bold text-[#003d5c] mb-2">{pg.name}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="h-4 w-4" />
                            <span>{pg.locality}, {pg.city}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="h-5 w-5 fill-current" />
                              <span className="font-semibold">{pg.rating}</span>
                            </div>
                            <span className="text-gray-500 text-sm">({pg.reviews} reviews)</span>
                          </div>
                          <p className="text-gray-600 mb-4">{pg.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {pg.amenities.slice(0, 5).map((amenity, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                                {amenity}
                              </span>
                            ))}
                            {pg.amenities.length > 5 && (
                              <span className="text-gray-500 text-xs py-1">+{pg.amenities.length - 5} more</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Starting from</p>
                              <p className="text-2xl font-bold text-cyan-600">
                                ₹{Math.min(...pg.sharing_types.map(s => s.price))}/month
                              </p>
                            </div>
                            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPG;
