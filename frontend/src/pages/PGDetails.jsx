import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { pgAPI } from '../lib/api';

const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSharing, setSelectedSharing] = useState(null);

  useEffect(() => {
    const fetchPG = async () => {
      try {
        const response = await pgAPI.getPG(id);
        setPg(response.data.pg);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load PG details',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPG();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-cyan-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Loading PG Details...</h2>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">PG Not Found</h2>
          <Link to="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % pg.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + pg.images.length) % pg.images.length);
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to book a PG',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    if (!selectedSharing) {
      toast({
        title: 'Select Sharing Type',
        description: 'Please select a sharing type to proceed',
        variant: 'destructive'
      });
      return;
    }

    navigate(`/booking/${pg.id}?sharing=${selectedSharing}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/search" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mb-6">
          <ChevronLeft className="h-5 w-5" />
          Back to Search
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Images and Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={pg.images[currentImageIndex]}
                  alt={`${pg.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold">
                  {pg.gender === 'boys' ? 'Boys PG' : 'Girls PG'}
                </div>
                {pg.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {pg.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition ${
                        index === currentImageIndex ? 'bg-white w-6' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-[#003d5c] mb-2">{pg.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="h-5 w-5" />
                  <span>{pg.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-6 w-6 fill-current" />
                    <span className="font-bold text-lg">{pg.rating}</span>
                  </div>
                  <span className="text-gray-500">({pg.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#003d5c] mb-4">About this PG</h2>
              <p className="text-gray-700 leading-relaxed">{pg.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#003d5c] mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pg.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-[#003d5c] mb-4">Select Sharing Type</h3>
              <div className="space-y-3 mb-6">
                {pg.sharing_types.map((sharing) => (
                  <div
                    key={sharing.type}
                    onClick={() => sharing.available && setSelectedSharing(sharing.type)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      !sharing.available
                        ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                        : selectedSharing === sharing.type
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-300 hover:border-cyan-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-[#003d5c]">{sharing.type} Sharing</p>
                        <p className="text-sm text-gray-500">
                          {sharing.available ? 'Available' : 'Not Available'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-600">₹{sharing.price}</p>
                        <p className="text-xs text-gray-500">/month</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleBookNow}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-6 text-lg"
                disabled={!selectedSharing}
              >
                Book Now
              </Button>

              <div className="mt-6 pt-6 border-t">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Security Deposit</span>
                    <span className="font-semibold">₹10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notice Period</span>
                    <span className="font-semibold">1 Month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Brokerage</span>
                    <span className="font-semibold text-green-600">Zero</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PGDetails;
