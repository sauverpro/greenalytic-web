'use client';
import Link from 'next/link';
import { Target, Lightbulb, Heart, Leaf, Users, Globe } from 'lucide-react';

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-200 rounded-full text-sm font-medium mb-8">
            <Globe className="w-4 h-4 mr-2" />
            About Greenalytic Motors
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            Who We Are
          </h1>
          <p className="text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            Tackling pollution with smart, locally engineered clean transport technologies 
            that transform African mobility.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-8">
                <Target className="w-4 h-4 mr-2" />
                Our Mission
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Driving change through 
                <span className="text-emerald-600"> innovation</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Greenalytic Motors Ltd is a Rwanda-based cleantech company established in 2022,
                focused on reducing air pollution in African cities and rural areas.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Real-time emissions monitoring system</h3>
                    <p className="text-gray-600">Advanced IoT solutions for regulatory compliance and fleet management optimization.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Electric cargo tricycles</h3>
                    <p className="text-gray-600">Specially designed for rural and peri-urban logistics with African road conditions in mind.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-emerald-50 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/50 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-300/30 rounded-full blur-2xl"></div>
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Leaf className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Clean Future</h3>
                    <p className="text-gray-600">Building sustainable transport solutions for the next generation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white text-emerald-700 rounded-full text-sm font-medium mb-8 shadow-sm">
              <Heart className="w-4 h-4 mr-2" />
              Our Values
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              What drives us forward
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our core values guide every decision we make and every solution we build.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lightbulb className="w-8 h-8" />,
                title: 'Innovation',
                desc: 'We design cutting-edge clean mobility solutions that suit local contexts and address real-world challenges.',
                color: 'bg-blue-500'
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Impact',
                desc: 'We aim for real change by empowering communities through green transport solutions that make a difference.',
                color: 'bg-emerald-500'
              },
              {
                icon: <Leaf className="w-8 h-8" />,
                title: 'Sustainability',
                desc: 'Our technologies are built for long-term ecological and economic resilience across African markets.',
                color: 'bg-green-500'
              }
            ].map((value, idx) => (
              <div key={idx} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`${value.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-24 bg-emerald-600 text-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              Our Impact So Far
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Since 2022, we&apos;ve been making measurable progress toward cleaner African cities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '15+', label: 'Strategic Partners', desc: 'Collaborating for impact' },
              { number: '100%', label: 'Local Engineering', desc: 'Built in Rwanda for Africa' },
              { number: '24/7', label: 'Real-time Monitoring', desc: 'Continuous data collection' },
              { number: '0', label: 'Emission Tricycles', desc: 'Clean transportation solution' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="bg-emerald-500/20 backdrop-blur-sm rounded-2xl p-8 hover:bg-emerald-500/30 transition-colors duration-300">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-emerald-100 mb-2">{stat.label}</div>
                  <div className="text-sm text-emerald-200">{stat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-8">
              <Users className="w-4 h-4 mr-2" />
              Our Team
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Meet the innovators behind our mission
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              A diverse team of engineers, developers, and sustainability experts working together 
              to transform African mobility.
            </p>
            <Link 
              href="/team" 
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-xl"
            >
              Meet Our Full Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

