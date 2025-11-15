import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2, Users, IndianRupee, Edit, Trash2, LogOut, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { pgAPI, bookingAPI } from '../lib/api';
import { useToast } from '../hooks/use-toast';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [ownerPGs, setOwnerPGs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddPGOpen, setIsAddPGOpen] = useState(false);
  const [isEditPGOpen, setIsEditPGOpen] = useState(false);
  const [editingPG, setEditingPG] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editFormData, setEditFormData] = useState({});
  const [amenities, setAmenities] = useState([]);
  const [editAmenities, setEditAmenities] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'owner') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [pgsResponse, bookingsResponse] = await Promise.all([
          pgAPI.getOwnerPGs(),
          bookingAPI.getOwnerBookings()
        ]);
        setOwnerPGs(pgsResponse.data.pgs);
        setBookings(bookingsResponse.data.bookings);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate, toast]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditPG = (pg) => {
    setEditingPG(pg);
    setEditFormData({
      name: pg.name,
      city: pg.city,
      locality: pg.locality,
      address: pg.address,
      gender: pg.gender,
      description: pg.description,
      singlePrice: pg.sharing_types.find(st => st.type === 'single')?.price || '',
      doublePrice: pg.sharing_types.find(st => st.type === 'double')?.price || '',
      triplePrice: pg.sharing_types.find(st => st.type === 'triple')?.price || '',
    });
    setEditAmenities(pg.amenities || []);
    setIsEditPGOpen(true);
  };

  const handleDeletePG = async (pgId) => {
    if (!window.confirm('Are you sure you want to delete this PG? This action cannot be undone.')) {
      return;
    }

    try {
      await pgAPI.deletePG(pgId);
      toast({
        title: 'PG Deleted Successfully',
        description: 'Your PG has been removed from the platform'
      });
      // Refresh PGs list
      const response = await pgAPI.getOwnerPGs();
      setOwnerPGs(response.data.pgs);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete PG',
        variant: 'destructive'
      });
    }
  };

  const handleUpdatePG = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.target);

      // Add sharing types as JSON string
      const sharingTypes = [
        {
          type: 'single',
          price: parseInt(formData.get('singlePrice')),
          available: true
        },
        {
          type: 'double',
          price: parseInt(formData.get('doublePrice')),
          available: true
        },
        ...(formData.get('triplePrice') ? [{
          type: 'triple',
          price: parseInt(formData.get('triplePrice')),
          available: true
        }] : [])
      ];

      const updateData = {
        name: formData.get('name'),
        city: formData.get('city'),
        locality: formData.get('locality'),
        address: formData.get('address'),
        gender: formData.get('gender'),
        description: formData.get('description'),
        sharing_types: sharingTypes,
        amenities: editAmenities,
      };

      await pgAPI.updatePG(editingPG.id, updateData);
      toast({
        title: 'PG Updated Successfully',
        description: 'Your PG has been updated'
      });
      setIsEditPGOpen(false);
      setEditingPG(null);
      setEditFormData({});
      setEditAmenities([]);
      // Refresh PGs list
      const response = await pgAPI.getOwnerPGs();
      setOwnerPGs(response.data.pgs);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update PG',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 10 images
    if (files.length > 10) {
      toast({
        title: 'Too many images',
        description: 'Please select a maximum of 10 images',
        variant: 'destructive'
      });
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast({
        title: 'Invalid file type',
        description: 'Please select only image files',
        variant: 'destructive'
      });
      return;
    }

    // Validate file sizes (max 5MB per image)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: 'File too large',
        description: 'Each image must be less than 5MB',
        variant: 'destructive'
      });
      return;
    }

    setSelectedImages(files);

    // Create image previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleAddPG = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.target);

      // Add sharing types as JSON string
      const sharingTypes = [
        {
          type: 'single',
          price: parseInt(formData.get('singlePrice')),
          available: true
        },
        {
          type: 'double',
          price: parseInt(formData.get('doublePrice')),
          available: true
        },
        ...(formData.get('triplePrice') ? [{
          type: 'triple',
          price: parseInt(formData.get('triplePrice')),
          available: true
        }] : [])
      ];
      formData.set('sharing_types', JSON.stringify(sharingTypes));

      // Add amenities as JSON string
      formData.set('amenities', JSON.stringify(amenities));

      // Validate that at least one image is selected
      if (selectedImages.length === 0) {
        toast({
          title: 'Images required',
          description: 'Please select at least one image for your PG',
          variant: 'destructive'
        });
        setSubmitting(false);
        return;
      }

      // Add selected images
      selectedImages.forEach((image, index) => {
        formData.append('images', image);
      });

      // Remove text fields that are now handled by FormData
      formData.delete('pgName');
      formData.delete('city');
      formData.delete('locality');
      formData.delete('address');
      formData.delete('gender');
      formData.delete('description');
      formData.delete('singlePrice');
      formData.delete('doublePrice');
      formData.delete('triplePrice');

      // Add the text fields back with proper names
      formData.append('name', e.target.pgName.value);
      formData.append('city', e.target.city.value);
      formData.append('locality', e.target.locality.value);
      formData.append('address', e.target.address.value);
      formData.append('gender', e.target.gender.value);
      formData.append('description', e.target.description.value);

      await pgAPI.createPG(formData);
      toast({
        title: 'PG Added Successfully',
        description: 'Your PG has been listed on the platform'
      });
      setIsAddPGOpen(false);
      setSelectedImages([]);
      setImagePreviews([]);
      setAmenities([]);
      // Refresh PGs list
      const response = await pgAPI.getOwnerPGs();
      setOwnerPGs(response.data.pgs);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add PG',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
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
              <h1 className="text-3xl font-bold text-[#003d5c]">PG Owner Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={isAddPGOpen} onOpenChange={(open) => {
                setIsAddPGOpen(open);
                if (!open) {
                  setSelectedImages([]);
                  setImagePreviews([]);
                  setAmenities([]);
                }
              }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New PG</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddPG} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pgName">PG Name</Label>
                        <Input id="pgName" placeholder="Green Valley PG" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                            <SelectItem value="Chennai">Chennai</SelectItem>
                            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                            <SelectItem value="Mumbai">Mumbai</SelectItem>
                            <SelectItem value="Pune">Pune</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locality">Locality</Label>
                      <Input id="locality" placeholder="Koramangala" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Textarea id="address" placeholder="Complete address..." required />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="boys">Boys</SelectItem>
                          <SelectItem value="girls">Girls</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe your PG..." required />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="singlePrice">Single Room Price</Label>
                        <Input id="singlePrice" type="number" placeholder="12000" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doublePrice">Double Room Price</Label>
                        <Input id="doublePrice" type="number" placeholder="8000" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="triplePrice">Triple Room Price</Label>
                        <Input id="triplePrice" type="number" placeholder="6000" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Amenities</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['WiFi', 'AC', 'Laundry', 'Parking', 'Security', 'Gym', 'Food', 'Housekeeping'].map((amenity) => (
                          <label key={amenity} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={amenities.includes(amenity)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setAmenities([...amenities, amenity]);
                                } else {
                                  setAmenities(amenities.filter(a => a !== amenity));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="images">PG Images</Label>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="cursor-pointer"
                        required
                      />
                      <p className="text-sm text-gray-500">Select multiple images (max 10, at least 1 required)</p>
                    </div>
                    {imagePreviews.length > 0 && (
                      <div className="space-y-2">
                        <Label>Image Previews</Label>
                        <div className="grid grid-cols-3 gap-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding PG...
                        </>
                      ) : (
                        'Add PG'
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog open={isEditPGOpen} onOpenChange={(open) => {
                setIsEditPGOpen(open);
                if (!open) {
                  setEditingPG(null);
                  setEditFormData({});
                  setEditAmenities([]);
                }
              }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit PG</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdatePG} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editName">PG Name</Label>
                        <Input id="editName" name="name" value={editFormData.name || ''} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} placeholder="Green Valley PG" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editCity">City</Label>
                        <Select value={editFormData.city || ''} onValueChange={(value) => setEditFormData({...editFormData, city: value})} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                            <SelectItem value="Chennai">Chennai</SelectItem>
                            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                            <SelectItem value="Mumbai">Mumbai</SelectItem>
                            <SelectItem value="Pune">Pune</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editLocality">Locality</Label>
                      <Input id="editLocality" name="locality" value={editFormData.locality || ''} onChange={(e) => setEditFormData({...editFormData, locality: e.target.value})} placeholder="Koramangala" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editAddress">Full Address</Label>
                      <Textarea id="editAddress" name="address" value={editFormData.address || ''} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} placeholder="Complete address..." required />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={editFormData.gender || ''} onValueChange={(value) => setEditFormData({...editFormData, gender: value})} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="boys">Boys</SelectItem>
                          <SelectItem value="girls">Girls</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editDescription">Description</Label>
                      <Textarea id="editDescription" name="description" value={editFormData.description || ''} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} placeholder="Describe your PG..." required />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editSinglePrice">Single Room Price</Label>
                        <Input id="editSinglePrice" name="singlePrice" type="number" value={editFormData.singlePrice || ''} onChange={(e) => setEditFormData({...editFormData, singlePrice: e.target.value})} placeholder="12000" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editDoublePrice">Double Room Price</Label>
                        <Input id="editDoublePrice" name="doublePrice" type="number" value={editFormData.doublePrice || ''} onChange={(e) => setEditFormData({...editFormData, doublePrice: e.target.value})} placeholder="8000" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editTriplePrice">Triple Room Price</Label>
                        <Input id="editTriplePrice" name="triplePrice" type="number" value={editFormData.triplePrice || ''} onChange={(e) => setEditFormData({...editFormData, triplePrice: e.target.value})} placeholder="6000" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Amenities</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['WiFi', 'AC', 'Laundry', 'Parking', 'Security', 'Gym', 'Food', 'Housekeeping'].map((amenity) => (
                          <label key={amenity} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={editAmenities.includes(amenity)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditAmenities([...editAmenities, amenity]);
                                } else {
                                  setEditAmenities(editAmenities.filter(a => a !== amenity));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating PG...
                        </>
                      ) : (
                        'Update PG'
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-cyan-600" />
                    Total Properties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-[#003d5c]">{ownerPGs.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Total Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600">{bookings.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-yellow-600" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-yellow-600">
                    ₹{bookings.reduce((sum, b) => sum + b.monthly_rent, 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Occupancy Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-cyan-600">85%</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">New booking received</p>
                      <p className="text-sm text-gray-600">Green Valley PG - Double Sharing</p>
                    </div>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Payment received</p>
                      <p className="text-sm text-gray-600">₹8,000 from khizer</p>
                    </div>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">New review posted</p>
                      <p className="text-sm text-gray-600">5 stars for Urban Living PG</p>
                    </div>
                    <p className="text-sm text-gray-500">3 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {ownerPGs.length === 0 ? (
                <Card className="md:col-span-2">
                  <CardContent className="p-12 text-center">
                    <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Properties Yet</h3>
                    <p className="text-gray-500 mb-4">You haven't added any PGs yet.</p>
                    <Button onClick={() => setIsAddPGOpen(true)} className="bg-cyan-500 hover:bg-cyan-600">
                      Add Your First PG
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                ownerPGs.map((pg) => (
                  <Card key={pg.id}>
                    <CardContent className="p-0">
                      <img src={pg.images && pg.images.length > 0 ? pg.images[0] : '/placeholder-pg.jpg'} alt={pg.name} className="w-full h-48 object-cover" />
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[#003d5c] mb-2">{pg.name}</h3>
                        <p className="text-gray-600 mb-4">{pg.locality}, {pg.city}</p>
                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                          {pg.sharing_types.map((sharing) => (
                            <div key={sharing.type}>
                              <p className="text-gray-500">{sharing.type}</p>
                              <p className="font-bold">₹{sharing.price}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 flex items-center gap-2" onClick={() => handleEditPG(pg)}>
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button variant="outline" className="flex-1 flex items-center gap-2 text-red-600 hover:text-red-700" onClick={() => handleDeletePG(pg.id)}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
                      <p className="text-gray-500">No one has booked your PGs yet.</p>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-lg">{booking.user_name}</h4>
                            <p className="text-sm text-gray-600">{booking.pg_name} - {booking.sharing_type} Sharing</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            booking.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Move-in Date</p>
                            <p className="font-semibold">{new Date(booking.move_in_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Monthly Rent</p>
                            <p className="font-semibold">₹{booking.monthly_rent}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-semibold">{booking.user_phone}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerDashboard;
