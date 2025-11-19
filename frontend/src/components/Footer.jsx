import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-teal-600 text-gray-100">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white p-2 rounded">
                <Building2 className="h-6 w-6 text-cyan-500" />
              </div>
              <div>
                <div className="font-bold text-lg">Find My PG</div>
                <div className="text-xs text-cyan-300">LIVE YOUR LIFE STYLE</div>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              India's First network of managed Paying Guest rentals. Find and book your perfect PG online.
            </p>
            <div className="flex gap-3">
              <a href="#" className="transition rounded-full p-2 hover:bg-white hover:text-slate-900">
                <Facebook className="h-6 w-6 text-teal-200" />
              </a>
              <a href="#" className="transition rounded-full p-2 hover:bg-white hover:text-slate-900">
                <Twitter className="h-6 w-6 text-teal-200" />
              </a>
              <a href="#" className="transition rounded-full p-2 hover:bg-white hover:text-slate-900">
                <Instagram className="h-6 w-6 text-teal-200" />
              </a>
              <a href="https://www.linkedin.com/in/md-khizer-0b31a5314?" className="transition rounded-full p-2 hover:bg-white hover:text-slate-900">
                <Linkedin className="h-6 w-6 text-teal-200" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-cyan-400 transition">
                  Search PG
                </Link>
              </li>
              <li>
                <Link to="/for-owners" className="hover:text-cyan-400 transition">
                  For PG Owners
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="font-bold text-lg mb-4">Popular Cities</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search?city=Bengaluru" className="hover:text-cyan-400 transition">
                  Bengaluru
                </Link>
              </li>
              <li>
                <Link to="/search?city=Chennai" className="hover:text-cyan-400 transition">
                  Chennai
                </Link>
              </li>
              <li>
                <Link to="/search?city=Hyderabad" className="hover:text-cyan-400 transition">
                  Hyderabad
                </Link>
              </li>
              <li>
                <Link to="/search?city=Mumbai" className="hover:text-cyan-400 transition">
                  Mumbai
                </Link>
              </li>
              <li>
                <Link to="/search?city=Pune" className="hover:text-cyan-400 transition">
                  Pune
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span> Teachers colony, Ballari, Karnataka -583102</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-cyan-400" />
                <a href="tel:+918939654691" className="hover:text-cyan-400 transition">
                  +91-9148495208
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-cyan-400" />
                <a href="mailto:info@bookmypg.co.in" className="hover:text-cyan-400 transition">
                  @findmypg.co.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Find My PG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
