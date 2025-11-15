import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, User, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { pgAPI, bookingAPI } from '../lib/api';

const Booking = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const sharingType = searchParams.get('sharing');
  const selectedSharing = pg?.sharing_types.find(s => s.type === sharingType);

  const [bookingData, setBookingData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    moveInDate: '',
    duration: '1',
    couponCode: ''
  });

  const [discount, setDiscount] = useState(0);

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

  const applyCoupon = () => {
    // Mock coupon validation
    if (bookingData.couponCode === 'PGCH500') {
      setDiscount(500);
      toast({
        title: 'Coupon Applied!',
        description: '₹500 discount applied successfully'
      });
    } else if (bookingData.couponCode) {
      toast({
        title: 'Invalid Coupon',
        description: 'The coupon code is not valid',
        variant: 'destructive'
      });
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const bookingPayload = {
        pg_id: id,
        sharing_type: sharingType,
        move_in_date: bookingData.moveInDate,
        duration: parseInt(bookingData.duration),
        monthly_rent: selectedSharing.price,
        security_deposit: 10000,
        discount: discount,
        total_amount: totalAmount,
        user_name: bookingData.name,
        user_email: bookingData.email,
        user_phone: bookingData.phone
      };

      await bookingAPI.createBooking(bookingPayload);

      toast({
        title: 'Booking Confirmed!',
        description: 'Your booking has been confirmed. Redirecting to dashboard...'
      });
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2000);
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: error.response?.data?.detail || 'Failed to create booking',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-cyan-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Loading Booking Details...</h2>
        </div>
      </div>
    );
  }

  if (!pg || !selectedSharing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Invalid Booking</h2>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const monthlyRent = selectedSharing.price;
  const securityDeposit = 10000;
  const totalAmount = (monthlyRent * parseInt(bookingData.duration)) + securityDeposit - discount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#003d5c] mb-8">Complete Your Booking</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-[#003d5c]">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Mohammad Khizer"
                            value={bookingData.name}
                            onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="khizer@example.com"
                            value={bookingData.email}
                            onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 9148495208"
                            value={bookingData.phone}
                            onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="moveInDate">Move-in Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="moveInDate"
                            type="date"
                            value={bookingData.moveInDate}
                            onChange={(e) => setBookingData({ ...bookingData, moveInDate: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="duration">Booking Duration (Months)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="12"
                      value={bookingData.duration}
                      onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
                      required
                    />
                  </div>

                  {/* Coupon Code */}
                  <div className="space-y-2">
                    <Label htmlFor="coupon">Coupon Code (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="coupon"
                        type="text"
                        placeholder="Enter coupon code"
                        value={bookingData.couponCode}
                        onChange={(e) => setBookingData({ ...bookingData, couponCode: e.target.value })}
                      />
                      <Button type="button" onClick={applyCoupon} variant="outline">
                        Apply
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-6 text-lg" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Booking...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* PG Details */}
                <div className="border-b pb-4">
                  <img src={pg.images && pg.images.length > 0 ? pg.images[0] : '/placeholder-pg.jpg'} alt={pg.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                  <h3 className="font-bold text-lg text-[#003d5c]">{pg.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{pg.locality}, {pg.city}</span>
                  </div>
                  <div className="mt-2">
                    <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedSharing.type} Sharing
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Rent</span>
                    <span className="font-semibold">₹{monthlyRent}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{bookingData.duration} Month(s)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rent Total</span>
                    <span className="font-semibold">₹{monthlyRent * parseInt(bookingData.duration)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="font-semibold">₹{securityDeposit}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">-₹{discount}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-lg">Total Amount</span>
                      <span className="font-bold text-2xl text-cyan-600">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-cyan-50 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-2 text-cyan-700">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-sm font-medium">Secure Payment Gateway</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Your payment information is secure and encrypted.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
