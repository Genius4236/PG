import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Building2, Globe, Heart, Users, MapPin } from 'lucide-react';

const About = () => {
  useEffect(() => {
    document.title = 'About · Find My PG';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-lg mb-6">
            <Building2 className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-teal-700 mb-4">About Find My PG</h1>
          <p className="max-w-3xl mx-auto text-gray-600 mb-8">
            We make finding and booking paying guest (PG) homes simple, secure and fast.
            Our platform connects verified PG owners with students and professionals across India.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/search">
              <Button className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition">
                Search PGs
              </Button>
            </Link>
            <Link to="/partner" className="text-teal-600 hover:underline self-center">
              Partner with us
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-teal-600" />
              <h3 className="text-lg font-semibold text-teal-700">Our Mission</h3>
            </div>
            <p className="text-gray-600">
              To provide a trusted marketplace for comfortable, affordable and verified PG stays with seamless booking and support.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-6 w-6 text-teal-600" />
              <h3 className="text-lg font-semibold text-teal-700">What We Value</h3>
            </div>
            <p className="text-gray-600">
              Safety, transparency and convenience — we vet properties and make booking simple via our platform and support.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-teal-600" />
              <h3 className="text-lg font-semibold text-teal-700">Our Community</h3>
            </div>
            <p className="text-gray-600">
              A growing network of PG owners and residents who trust Find My PG for better stays and transparent pricing.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-teal-700 mb-6">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100">
              <div className="flex items-center justify-center mb-3">
                <MapPin className="h-6 w-6 text-teal-600" />
              </div>
              <h4 className="font-semibold mb-2">Find by Location</h4>
              <p className="text-gray-600 text-sm">Search PGs near your college, workplace or preferred locality.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100">
              <div className="flex items-center justify-center mb-3">
                <Building2 className="h-6 w-6 text-teal-600" />
              </div>
              <h4 className="font-semibold mb-2">Verified Listings</h4>
              <p className="text-gray-600 text-sm">We verify owners and listings to ensure accurate information and safety.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <h4 className="font-semibold mb-2">Book & Move In</h4>
              <p className="text-gray-600 text-sm">Book online instantly and reach out to support for any help during move-in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team / Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-teal-700 mb-4">Want to know more?</h3>
          <p className="text-gray-600 mb-6">Reach out to our support team or partner with us to list your PG.</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/contact">
              <Button className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition">
                Contact Us
              </Button>
            </Link>
            <a href="mailto:hello@findmypg.co.in" className="text-teal-600 hover:underline self-center">hello@findmypg.co.in</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
