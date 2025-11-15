import React from 'react';
import Hero from '../components/Hero';
import OffersCarousel from '../components/OffersCarousel';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Search, 
  CreditCard, 
  CheckCircle, 
  MapPin, 
  Smartphone, 
  BadgePercent,
  AirVent,
  Home as HomeIcon,
  Bed,
  Tv,
  Droplets,
  Phone,
  Lock,
  Lamp,
  Wifi,
  Star,
  ChevronLeft,
  ChevronRight,
  Quote
} from 'lucide-react';
import { pgs, testimonials, amenitiesList, howItWorks, features } from '../mock/mockData';

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

  const iconMap = {
    Search, CreditCard, CheckCircle, MapPin, Smartphone, BadgePercent,
    AirVent, Home: HomeIcon, Bed, Tv, Droplets, Phone, Lock, Lamp, Wifi
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  React.useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Offers Carousel */}
      <OffersCarousel />

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#003d5c] mb-4 border-b-4 border-cyan-500 inline-block pb-2">
                About Find My PG
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We, at Find My PG, are India's fastest-growing network of managed Paying Guest (PG) rentals. 
                We hope to provide you with the best renting solutions with the help of our designs and technology.
                Our services will help you find and book Paying Guest (PG) rental homes.
              </p>
              <Link to="/about">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-8">
                  Read More
                </Button>
              </Link>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"
                alt="About Book My PG"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Video */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#003d5c] text-center mb-8 border-b-4 border-cyan-500 inline-block pb-2 mx-auto block w-fit">
            Product Video
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
              <iframe
                width="100%"
                height="100%"
                src="https://"
                title="Find My PG Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#003d5c] text-center mb-4">
            How it's Work
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Our process is simple and very different from those of others in this industry. The search process is 
            streamlined by the locality or landmark of your choice. This allows you to find the right hostel or room. 
            You can choose the subscription plan that best suits your needs.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <div key={item.id} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-cyan-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-cyan-500 transition-all duration-300">
                      <Icon className="h-12 w-12 text-cyan-600 group-hover:text-white transition" />
                    </div>
                    {index < howItWorks.length - 1 && (
                      <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-cyan-200"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[#003d5c] mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#003d5c] text-center mb-12">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = iconMap[feature.icon];
              return (
                <div key={feature.id} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-cyan-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#003d5c] mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#003d5c] text-center mb-4">
            Amenities List
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            We provide all the amenities, some amenities are surely available for all our service places. 
            Some of the items only you may get by request, because that type of amenities are not mandatory.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {amenitiesList.map((amenity, index) => {
              const Icon = iconMap[amenity.icon];
              return (
                <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow">
                    <Icon className="h-8 w-8 text-cyan-600" />
                  </div>
                  <h4 className="font-semibold text-[#003d5c] mb-2">{amenity.name}</h4>
                  <p className="text-xs text-gray-500">
                    {amenity.available ? 'Surely Available' : 'You need to request'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular PGs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#003d5c] text-center mb-12">
            Popular Paying Guest (PG)
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {pgs.slice(0, 3).map((pg) => (
              <Link to={`/pg/${pg.id}`} key={pg.id} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pg.image}
                      alt={pg.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {pg.gender === 'boys' ? 'Boys' : 'Girls'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-[#003d5c] mb-1">{pg.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{pg.locality}, {pg.city}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-semibold">{pg.rating}</span>
                        <span className="text-xs text-gray-500">({pg.reviews})</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Starting from</p>
                        <p className="text-lg font-bold text-cyan-600">₹{pg.sharingTypes[pg.sharingTypes.length - 1].price}/mo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link to="/search">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg">
                View All PGs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#003d5c] text-center mb-12">
            Testimonials
          </h2>
          <div className="max-w-4xl mx-auto relative">
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition z-10"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>

            <div className="bg-gray-50 rounded-lg p-8 md:p-12 shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-cyan-500"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Quote className="h-10 w-10 text-cyan-500 mb-4 mx-auto md:mx-0" />
                  <p className="text-gray-700 text-lg mb-4 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <p className="font-bold text-[#003d5c] text-xl">
                    {testimonials[currentTestimonial].name}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition z-10"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition ${
                    index === currentTestimonial ? 'bg-cyan-500 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#003d5c] text-center mb-4">
            Comparison
          </h2>
          <p className="text-gray-600 text-center mb-12">
            How Find My PG better than normal PG's and low maintained PG services.
          </p>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#003d5c] text-white">
                  <th className="py-4 px-6 text-left">Features</th>
                  <th className="py-4 px-6 text-center">Find My PG</th>
                  <th className="py-4 px-6 text-center">Others</th>
                </tr>
              </thead>
              <tbody>
                {[
                  'Online Enabled Booking',
                  'Online Coupon Discounts',
                  'Low Security Deposit',
                  'Fully Furnished',
                  'Free Wi-Fi',
                  'Book My PG App enabled Stay',
                  '24*7 Security',
                  'Live Customer Support',
                  'Hygienic Food Options',
                ].map((feature, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-4 px-6 font-medium text-gray-700">{feature}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center">
                        <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* <tr className="bg-white">
                  <td className="py-4 px-6 font-medium text-gray-700">Brokerage</td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center">
                      <CheckCircle className="h-6 w-6 text-red-500" />
                    </div>
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
