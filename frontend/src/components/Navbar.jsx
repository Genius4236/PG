import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Info, Building2, Mail, Phone, User, Menu, X} from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Will be managed by AuthContext later
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  // Check for logged in user
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="bg-slate-800/95 text-slate-100 py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-teal-200" />
            <span className="text-slate-200 font-medium">@findmypg.co.in</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-teal-200" />
              <span className="text-slate-200">+91-9148495208</span>
            </div>
            {!user ? (
              <Link to="/login" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition text-sm">
                <User className="h-4 w-4" />
                <span>Login / Sign up</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to={user.role === 'owner' ? '/owner/dashboard' : '/user/dashboard'}
                  className="text-slate-200 hover:underline"
                >
                  <Home className="h-4 w-4 text-teal-200" />
                  {/* {user.name} */}
                </Link>
                <button onClick={handleLogout} className="text-slate-200 hover:underline">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-gradient-to-r from-slate-900 to-teal-700 text-white shadow sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
             {/* Logo */}
             <Link to="/" className="flex items-center gap-2">
               <div className="bg-white p-2 rounded">
                 <Building2 className="h-6 w-6 text-cyan-500" />
               </div>
               <div>
                 <div className="font-bold text-xl">Find My PG</div>
                 <div className="text-xs text-cyan-300">LIVE YOUR LIFE STYLE</div>
               </div>
             </Link>
 
             {/* Desktop Navigation */}
             <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="hover:text-teal-200 transition flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link to="/about" className="hover:text-teal-200 transition flex items-center gap-1">
                <Info className="h-4 w-4" />
                About
              </Link>
              <Link to="/for-owners" className="hover:text-teal-200 transition">
                 For PG Owners
               </Link>
              <Link to="/contact" className="hover:text-teal-200 transition flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Contact Us
              </Link>
              <Link to="/partner" className="hover:text-teal-200 transition">
                 Partner Us
               </Link>
             </div>
 
             {/* Mobile menu button */}
             <button
               className="md:hidden"
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
             >
               {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </button>
           </div>
 
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 mt-2 space-y-2 bg-slate-800/90 rounded-b-md px-4 py-3 border-t border-slate-700">
              <Link to="/" className="block py-2 px-3 rounded hover:bg-slate-700 transition text-slate-100">
                Home
              </Link>
              <Link to="/about" className="block py-2 px-3 rounded hover:bg-slate-700 transition text-slate-100">
                About
              </Link>
              <Link to="/for-owners" className="block py-2 px-3 rounded hover:bg-slate-700 transition text-slate-100">
                For PG Owners
              </Link>
              <Link to="/contact" className="block py-2 px-3 rounded hover:bg-slate-700 transition text-slate-100">
                Contact Us
              </Link>
              <Link to="/partner" className="block py-2 px-3 rounded hover:bg-slate-700 transition text-slate-100">
                Partner Us
              </Link>
            </div>
          )}
         </div>
       </nav>
     </>
   );
 };
 
 export default Navbar;
