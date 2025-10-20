'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dodger-blue/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
              
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-white/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-dodger-blue to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                AutoUnion
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors font-medium">
                Features
              </a>
              <a href="#fleet" className="text-gray-300 hover:text-white transition-colors font-medium">
                Our Fleet
              </a>
              <a href="#experience" className="text-gray-300 hover:text-white transition-colors font-medium">
                Experience
              </a>
              <Link 
                href="/dashboard"
                className="text-gray-300 hover:text-white transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Staff Login
              </Link>
              <Link 
                href="/checkin"
                className="bg-dodger-blue hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-dodger-blue/50 hover:shadow-xl hover:shadow-dodger-blue/60"
              >
                Check In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block mb-6">
                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold">
                  Premium Car Rental Experience
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Elevate Your
                <span className="block bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                  Journey
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
                Experience luxury and convenience with AutoUnion&apos;s premium fleet. Seamless digital check-in powered by cutting-edge AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/checkin"
                  className="group relative px-8 py-4 bg-dodger-blue hover:bg-blue-500 text-white rounded-xl font-semibold text-lg transition-all shadow-2xl shadow-dodger-blue/50 hover:shadow-dodger-blue/70 hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Start Your Journey</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-dodger-blue opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                </Link>
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold text-lg transition-all">
                  Explore Fleet
                </button>
              </div>
            </div>
            
            {/* Right Content - Glass Card */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Total Vehicles</div>
                      <div className="text-3xl font-bold text-white">500+</div>
                    </div>
                    <div className="w-12 h-12 bg-dodger-blue/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-dodger-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Happy Customers</div>
                      <div className="text-3xl font-bold text-white">50K+</div>
                    </div>
                    <div className="w-12 h-12 bg-dodger-blue/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-dodger-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Locations</div>
                      <div className="text-3xl font-bold text-white">100+</div>
                    </div>
                    <div className="w-12 h-12 bg-dodger-blue/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-dodger-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                          </div>
                        </div>
                    </div>
                  </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why AutoUnion?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the perfect blend of luxury, technology, and convenience
            </p>
                  </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-dodger-blue/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-dodger-blue/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-dodger-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Check-In</h3>
                <p className="text-gray-400 leading-relaxed">
                  Skip the queues with our intelligent document verification system. Fast, secure, and completely contactless.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-dodger-blue/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-dodger-blue/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-dodger-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Bank-Level Security</h3>
                <p className="text-gray-400 leading-relaxed">
                  Your data protected with military-grade encryption. Every document, every transaction, completely secure.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-dodger-blue/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-dodger-blue/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-dodger-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Instant Access</h3>
                <p className="text-gray-400 leading-relaxed">
                  From booking to driving in minutes. No paperwork, no waiting. Just pure convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Premium Fleet Collection
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From executive sedans to luxury SUVs, find your perfect match
            </p>
        </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Economy */}
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-dodger-blue/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-dodger-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-8">
                <div className="text-sm font-semibold text-dodger-blue mb-2">ECONOMY</div>
                <h3 className="text-3xl font-bold text-white mb-4">Compact & Efficient</h3>
                <p className="text-gray-400 mb-6">Perfect for city driving and daily commutes</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-gray-400 ml-2">/day</span>
              </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-dodger-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Fuel Efficient
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-dodger-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    4-5 Passengers
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-dodger-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                    Automatic/Manual
                  </li>
                </ul>
                <Link 
                  href="/checkin"
                  className="block text-center px-6 py-3 bg-white/10 hover:bg-dodger-blue border border-white/20 hover:border-dodger-blue text-white rounded-lg font-semibold transition-all"
                >
                  Select Vehicle
                </Link>
            </div>
          </div>

            {/* Premium */}
            <div className="group relative bg-white/10 backdrop-blur-xl border-2 border-dodger-blue rounded-2xl overflow-hidden transform scale-105">
              <div className="absolute top-0 right-0 bg-dodger-blue text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                POPULAR
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-dodger-blue/10 to-transparent"></div>
              <div className="relative p-8">
                <div className="text-sm font-semibold text-dodger-blue mb-2">PREMIUM</div>
                <h3 className="text-3xl font-bold text-white mb-4">Luxury SUVs</h3>
                <p className="text-gray-400 mb-6">Spacious comfort for the whole family</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-white">$79</span>
                  <span className="text-gray-400 ml-2">/day</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-dodger-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Premium Interior
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-dodger-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    6-7 Passengers
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-dodger-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                    Advanced Safety
                  </li>
                </ul>
                <Link 
                  href="/checkin"
                  className="block text-center px-6 py-3 bg-dodger-blue hover:bg-blue-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-dodger-blue/50"
                >
                  Select Vehicle
                </Link>
            </div>
          </div>

            {/* Luxury */}
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-dodger-blue/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-dodger-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-8">
                <div className="text-sm font-semibold text-dodger-blue mb-2">EXECUTIVE</div>
                <h3 className="text-3xl font-bold text-white mb-4">Luxury Class</h3>
                <p className="text-gray-400 mb-6">Ultimate comfort and prestige</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-white">$149</span>
                  <span className="text-gray-400 ml-2">/day</span>
              </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-dodger-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Luxury Features
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-dodger-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    4-5 Passengers
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-dodger-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                    Chauffeur Available
                  </li>
                </ul>
                <Link 
                  href="/checkin"
                  className="block text-center px-6 py-3 bg-white/10 hover:bg-dodger-blue border border-white/20 hover:border-dodger-blue text-white rounded-lg font-semibold transition-all"
                >
                  Select Vehicle
                </Link>
              </div>
            </div>
          </div>
              </div>
      </section>

      {/* CTA Section */}
      <section id="experience" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="relative bg-gradient-to-br from-dodger-blue/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Experience Luxury?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust AutoUnion for their premium car rental needs
              </p>
              <Link 
                href="/checkin"
                className="inline-block px-10 py-4 bg-white text-black hover:bg-gray-100 rounded-xl font-bold text-lg transition-all shadow-2xl hover:shadow-white/50 hover:-translate-y-1"
              >
                Begin Your Journey →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-dodger-blue to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">AutoUnion</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Premium car rental redefined
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-dodger-blue transition-colors">Car Rental</a></li>
                <li><a href="#" className="text-gray-400 hover:text-dodger-blue transition-colors">Long-term Lease</a></li>
                <li><a href="#" className="text-gray-400 hover:text-dodger-blue transition-colors">Corporate Plans</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-dodger-blue transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-dodger-blue transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-dodger-blue transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-dodger-blue transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-dodger-blue transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-dodger-blue transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 AutoUnion. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
