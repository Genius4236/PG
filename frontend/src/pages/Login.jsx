import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Building2, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../lib/api';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', role: 'user', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  // Animation styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(loginData);
      const { user, token } = response.data;

      login(user, token);
      toast({
        title: 'Login Successful',
        description: 'Welcome back!'
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.response?.data?.detail || 'Invalid credentials',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.signup(signupData);
      const { user, token } = response.data;

      login(user, token);
      toast({
        title: 'Signup Successful',
        description: 'Account created successfully!'
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Signup Failed',
        description: error.response?.data?.detail || 'Failed to create account',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="bg-gradient-to-br from-teal-600 to-teal-500 p-3 rounded-lg shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-2xl text-teal-700">Find My PG</div>
                <div className="text-xs text-teal-600">LIVE YOUR LIFE STYLE</div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-100">
              <TabsTrigger value="login" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="shadow-2xl border border-slate-200 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Login to your account</CardTitle>
                  <CardDescription>Enter your credentials to access your dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4 transition duration-300" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your@email.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          className="pl-10 border-slate-200 focus:border-teal-500 focus:ring-teal-500 transition"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4 transition duration-300" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="pl-10 border-slate-200 focus:border-teal-500 focus:ring-teal-500 transition"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl hover:scale-105 transition duration-300" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging In...
                        </>
                      ) : (
                        'Login'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="shadow-2xl border border-slate-200 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>Sign up to start booking PGs</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4 transition duration-300" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="mohammad khizer"
                          value={signupData.name}
                          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                          className="pl-10 border-slate-200 focus:border-teal-500 focus:ring-teal-500 transition"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4 transition duration-300" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          className="pl-10 border-slate-200 focus:border-teal-500 focus:ring-teal-500 transition"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4 transition duration-300" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          className="pl-10 border-slate-200 focus:border-teal-500 focus:ring-teal-500 transition"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number (Optional)</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+91 9148495208"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        className="border-slate-200 focus:border-teal-500 focus:ring-teal-500 transition"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>I am a</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer hover:text-teal-600 transition">
                          <input
                            type="radio"
                            name="role"
                            value="user"
                            checked={signupData.role === 'user'}
                            onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                            className="mr-2 accent-teal-600"
                          />
                          User
                        </label>
                        <label className="flex items-center cursor-pointer hover:text-teal-600 transition">
                          <input
                            type="radio"
                            name="role"
                            value="owner"
                            checked={signupData.role === 'owner'}
                            onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                            className="mr-2 accent-teal-600"
                          />
                          PG Owner
                        </label>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl hover:scale-105 transition duration-300" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing Up...
                        </>
                      ) : (
                        'Sign Up'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-gray-600 mt-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-teal-600 hover:text-teal-700 hover:underline transition">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-teal-600 hover:text-teal-700 hover:underline transition">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
