import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Receipt, Settings, LogOut, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { bookingAPI } from '../lib/api';
import { useToast } from '../hooks/use-toast';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await bookingAPI.getUserBookings();
        setBookings(response.data.bookings);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load bookings',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, navigate, toast]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-cyan-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#003d5c]">Welcome, {user.name}!</h1>
              <p className="text-gray-600">Manage your bookings and profile</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Profile Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-cyan-600">
                    {bookings.filter(b => b.status === 'active').length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-[#003d5c]">{bookings.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600">
                    ₹{bookings.reduce((sum, b) => sum + b.monthly_rent, 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#003d5c]">Your Bookings</h2>
              {bookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
                    <p className="text-gray-500 mb-4">You haven't made any bookings yet.</p>
                    <Button onClick={() => navigate('/search')} className="bg-cyan-500 hover:bg-cyan-600">
                      Browse PGs
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-0">
                      <div className="md:flex">
                        <div className="md:w-1/4">
                          <img
                            src={booking.pg_images && booking.pg_images.length > 0 ? booking.pg_images[0] : '/placeholder-pg.jpg'}
                            alt={booking.pg_name}
                            className="w-full h-48 md:h-full object-cover rounded-l-lg"
                          />
                        </div>
                        <div className="md:w-3/4 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-[#003d5c] mb-2">{booking.pg_name}</h3>
                              <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <MapPin className="h-4 w-4" />
                                <span>{booking.pg_locality}, {booking.pg_city}</span>
                              </div>
                              <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                                {booking.sharing_type} Sharing
                              </span>
                            </div>
                            <div className="text-right">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  booking.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Monthly Rent</p>
                              <p className="font-bold text-lg text-[#003d5c]">₹{booking.monthly_rent}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Move-in Date</p>
                              <p className="font-semibold">{new Date(booking.move_in_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <Button className="bg-cyan-500 hover:bg-cyan-600 w-full">
                                <Receipt className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue={user.phone || ''}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      disabled
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Profile editing is not available yet. Contact support to update your information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
