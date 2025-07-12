'use client';
import { useState } from 'react';
import { 
  Monitor, 
  Search, 
  Truck, 
  BarChart3, 
  Zap, 
  Shield, 
  Wifi, 
  MapPin,
  ArrowRight,
  ExternalLink,
  Play
} from 'lucide-react';

export default function Products() {
  const [activeProduct, setActiveProduct] = useState(0);

  const products = [
    {
      id: 0,
      title: 'Emission Monitoring Device',
      shortDesc: 'Smart real-time vehicle emissions tracking',
      fullDesc: 'A comprehensive in-vehicle IoT device providing real-time data on emissions, GPS tracking, fuel consumption, speed monitoring, and intelligent alerts for enhanced fleet management and regulatory compliance.',
      icon: <Monitor className="w-8 h-8" />,
      features: [
        { icon: <Wifi className="w-5 h-5" />, name: 'Real-time Data', desc: 'Live emissions monitoring' },
        { icon: <MapPin className="w-5 h-5" />, name: 'GPS Tracking', desc: 'Precise location data' },
        { icon: <Shield className="w-5 h-5" />, name: 'Compliance', desc: 'Regulatory standards' },
        { icon: <BarChart3 className="w-5 h-5" />, name: 'Analytics', desc: 'Performance insights' }
      ],
      actions: ['Request Quote', 'Learn More'],
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 1,
      title: 'OBD II Scanner',
      shortDesc: 'Advanced vehicle diagnostics tool',
      fullDesc: 'Plug-and-play diagnostic device that tracks engine temperature, detects system faults, evaluates vehicle health status, and provides comprehensive maintenance insights for optimal vehicle performance.',
      icon: <Search className="w-8 h-8" />,
      features: [
        { icon: <Monitor className="w-5 h-5" />, name: 'Engine Health', desc: 'Temperature monitoring' },
        { icon: <Shield className="w-5 h-5" />, name: 'Fault Detection', desc: 'System diagnostics' },
        { icon: <BarChart3 className="w-5 h-5" />, name: 'Health Reports', desc: 'Vehicle status' },
        { icon: <Zap className="w-5 h-5" />, name: 'Quick Setup', desc: 'Plug-and-play' }
      ],
      actions: ['Request Quote'],
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 2,
      title: 'Electric Cargo Tricycle',
      shortDesc: 'Zero-emission rural transport solution',
      fullDesc: 'Specially engineered electric tricycle for transporting agricultural goods with extended range, minimal maintenance requirements, and ruggedized design optimized for challenging rural road conditions.',
      icon: <Truck className="w-8 h-8" />,
      features: [
        { icon: <Zap className="w-5 h-5" />, name: 'Zero Emissions', desc: 'Clean electric power' },
        { icon: <Shield className="w-5 h-5" />, name: 'Rugged Design', desc: 'Built for rough roads' },
        { icon: <BarChart3 className="w-5 h-5" />, name: 'Long Range', desc: 'Extended battery life' },
        { icon: <Monitor className="w-5 h-5" />, name: 'Low Maintenance', desc: 'Minimal upkeep' }
      ],
      actions: ['Request Quote', 'View Specifications'],
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      title: 'Vehicle Data Dashboard',
      shortDesc: 'Comprehensive fleet management platform',
      fullDesc: 'Web-based analytics platform offering emissions visualization, GPS tracking, fuel consumption analysis, and customizable fleet insights with real-time monitoring and comprehensive reporting capabilities.',
      icon: <BarChart3 className="w-8 h-8" />,
      features: [
        { icon: <BarChart3 className="w-5 h-5" />, name: 'Data Visualization', desc: 'Interactive charts' },
        { icon: <MapPin className="w-5 h-5" />, name: 'Fleet Tracking', desc: 'Real-time locations' },
        { icon: <Monitor className="w-5 h-5" />, name: 'Custom Reports', desc: 'Tailored insights' },
        { icon: <Wifi className="w-5 h-5" />, name: 'Live Updates', desc: '24/7 monitoring' }
      ],
      actions: ['See Live Demo', 'Schedule Walkthrough'],
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-200 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4 mr-2" />
            Clean Mobility Solutions
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            Our Products
          </h1>
          <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Cutting-edge, locally adapted technologies to combat vehicle emissions 
            and support clean transport across Africa.
          </p>
        </div>
      </section>

      {/* Interactive Products Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Cards */}
            <div className="space-y-6">
              {products.map((product, idx) => (
                <div
                  key={idx}
                  className={`group cursor-pointer transition-all duration-500 ${
                    activeProduct === idx 
                      ? 'bg-white shadow-2xl scale-[1.02]' 
                      : 'bg-gray-50 hover:bg-white hover:shadow-lg'
                  }`}
                  onClick={() => setActiveProduct(idx)}
                >
                  <div className="p-8 rounded-2xl border border-gray-100">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${product.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                        {product.icon}
                      </div>
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeProduct === idx ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}></div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h3>
                    <p className="text-gray-600 mb-4">{product.shortDesc}</p>
                    
                    <div className="flex items-center text-emerald-600 font-medium">
                      <span className="text-sm">Click to explore</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Product Details */}
            <div className="lg:sticky lg:top-8">
              <div className={`${products[activeProduct].bgColor} rounded-3xl p-8 transition-all duration-500`}>
                <div className="mb-8">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${products[activeProduct].gradient} flex items-center justify-center text-white mb-6`}>
                    {products[activeProduct].icon}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {products[activeProduct].title}
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {products[activeProduct].fullDesc}
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {products[activeProduct].features.map((feature, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="text-gray-600 mr-3">{feature.icon}</div>
                        <h4 className="font-semibold text-gray-900 text-sm">{feature.name}</h4>
                      </div>
                      <p className="text-xs text-gray-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {products[activeProduct].actions.map((action, idx) => (
                    <button
                      key={idx}
                      className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg ${
                        idx === 0 
                          ? `bg-gradient-to-r ${products[activeProduct].gradient} text-white hover:scale-105` 
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {action}
                      {idx === 0 && <ArrowRight className="w-4 h-4 ml-2 inline" />}
                      {action.includes('Demo') && <ExternalLink className="w-4 h-4 ml-2 inline" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Built with cutting-edge technology
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our products leverage the latest in IoT, AI, and clean energy technologies 
              to deliver reliable, scalable solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'IoT Integration',
                desc: 'Advanced sensor networks for real-time data collection',
                icon: <Wifi className="w-8 h-8 text-blue-600" />
              },
              {
                title: 'Cloud Analytics',
                desc: 'Powerful data processing and visualization platform',
                icon: <BarChart3 className="w-8 h-8 text-emerald-600" />
              },
              {
                title: 'Mobile First',
                desc: 'Responsive design for on-the-go fleet management',
                icon: <Monitor className="w-8 h-8 text-purple-600" />
              }
            ].map((tech, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-6">{tech.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{tech.title}</h3>
                <p className="text-gray-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-emerald-600 text-white">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Ready to transform your fleet?
          </h2>
          <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
            Get started with our clean mobility solutions today and join the sustainable transport revolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-xl">
              Schedule Demo
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center">
              <Play className="mr-2 w-5 h-5" />
              Watch Overview
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
