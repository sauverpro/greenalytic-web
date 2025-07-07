'use client';
import { useState, useEffect } from 'react';
import { ArrowRight, Play, Zap, Shield, Leaf, TrendingUp, MapPin, Users } from 'lucide-react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/carousel2.jpg',
      title: 'Clean mobility works better here.',
      subtitle: 'Zero emissions. Real impact.',
      description: 'Track vehicle emissions in real-time and drive change with expert-built monitoring solutions.',
      cta: 'Get started'
    },
    {
      image: '/tricycle2.jpg', 
      title: 'Electric vehicles built for Africa.',
      subtitle: 'Rugged. Reliable. Revolutionary.',
      description: 'Transport agricultural goods with zero emissions using tricycles designed for rural roads.',
      cta: 'Explore vehicles'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <>
      {/* Force Cache Bust Comment - Update: 2024 */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-50 rounded-full blur-2xl opacity-80"></div>
        </div>

        <div className="relative container mx-auto px-6 lg:px-8 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline - Large and Bold like Wealthfront */}
            <h1 className="text-6xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
              {slides[currentSlide].title}
            </h1>
            
            {/* Subtitle */}
            <div className="mb-6">
              <span className="text-2xl lg:text-3xl font-semibold text-emerald-600">
                {slides[currentSlide].subtitle}
              </span>
            </div>
            
            {/* Description */}
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {slides[currentSlide].description}
            </p>

            {/* CTA Button - Clean Wealthfront Style */}
            <div className="mb-16">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-semibold px-12 py-4 rounded-2xl transition-all duration-300 hover:shadow-2xl transform hover:scale-105">
                {slides[currentSlide].cta}
              </button>
            </div>

            {/* Floating Image - Wealthfront Style */}
            <div className="relative max-w-2xl mx-auto">
              <img
                src={slides[currentSlide].image}
                alt="Clean mobility solution"
                className="w-full h-auto rounded-3xl shadow-2xl transform transition-all duration-1000"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))'
                }}
              />
              
              {/* Floating Elements with Outline Icons */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl">
                <Zap className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center text-white shadow-xl">
                <Leaf className="w-8 h-8" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-emerald-600 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Choose the right solution for different parts of your fleet.
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {[
                {
                  icon: <Shield className="w-12 h-12" />,
                  title: 'Emissions Monitoring',
                  subtitle: 'Real-time tracking',
                  description: 'Best for regulatory compliance and fleet optimization, until you&apos;re ready for full electrification.',
                  risk: 'LOW RISK',
                  color: 'emerald'
                },
                {
                  icon: <Zap className="w-12 h-12" />,
                  title: 'Electric Tricycles',
                  subtitle: 'Zero emissions transport',
                  description: 'Purpose-built vehicles that earn steady performance and are considered ideal for rural logistics.',
                  risk: 'PROVEN TECH',
                  color: 'gray'
                },
                {
                  icon: <TrendingUp className="w-12 h-12" />,
                  title: 'IoT Fleet Management',
                  subtitle: 'Smart operations',
                  description: 'The data-driven method designed to maximize efficiency over the long term, while we automatically manage the insights.',
                  risk: 'HIGH IMPACT',
                  color: 'emerald'
                }
              ].map((solution, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="text-center mb-8">
                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full ${
                      solution.color === 'emerald' ? 'bg-emerald-50' : 'bg-gray-50'
                    } flex items-center justify-center ${
                      solution.color === 'emerald' ? 'text-emerald-600' : 'text-gray-600'
                    }`}>
                      {solution.icon}
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      solution.color === 'emerald' 
                        ? 'text-emerald-700 bg-emerald-100' 
                        : 'text-gray-700 bg-gray-100'
                    } mb-4`}>
                      {solution.risk}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{solution.title}</h3>
                  <p className="text-lg font-semibold text-emerald-600 mb-4">{solution.subtitle}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{solution.description}</p>
                  
                  <button className="w-full bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-900 font-semibold py-3 rounded-xl transition-colors">
                    Learn more
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-16">
              Don&apos;t just take our word for it.
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  quote: "Greenalytic takes the crown for best emissions monitoring platform in Rwanda",
                  author: "Transport Ministry",
                  product: "Emissions Monitoring"
                },
                {
                  quote: "The single best resource for rural logistics and seeing our entire transport picture.",
                  author: "Agricultural Cooperative",
                  product: "Electric Tricycles"
                },
                {
                  quote: "I LOVE Greenalytic and have moved almost all of our fleet monitoring there.",
                  author: "Fleet Manager",
                  product: "IoT Solutions"
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-8">
                  <div className="text-4xl mb-4">&quot;</div>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">{testimonial.quote}</p>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-emerald-600">{testimonial.product}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <MapPin className="w-16 h-16 text-emerald-200" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              Ready for your fleet&apos;s new home?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <div className="text-5xl font-bold mb-2">15+</div>
                <div className="text-emerald-200">partners trust us with</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">100%</div>
                <div className="text-emerald-200">clean energy focus</div>
              </div>
            </div>

            <button className="bg-white text-emerald-600 hover:bg-gray-100 text-xl font-semibold px-12 py-4 rounded-2xl transition-all duration-300 hover:shadow-2xl transform hover:scale-105">
              Get started
            </button>
          </div>
        </div>
      </section>
    </>
  );
}