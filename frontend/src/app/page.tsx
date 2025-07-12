'use client';
import { useState, useEffect } from 'react';
import { ArrowRight, Play, Zap, Shield, Leaf, TrendingUp, MapPin, Users } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);


  const slides = [
    {
      image: '/carousel1.jpg',
      title: 'Clean mobility works better here.',
      subtitle: 'Zero emissions. Real impact.',
      description: 'Track vehicle emissions in real-time and drive change with expert-built monitoring solutions.',
      cta: 'Get started'
    },
    {
      image: '/carousel2.jpg', 
      title: 'Electric tricycles built for Africa.',
      subtitle: 'Rugged. Reliable. Revolutionary.',
      description: 'Transport agricultural goods with zero emissions using tricycles designed for rural roads.',
      cta: 'Explore tricycles'
    },
    {
      image: '/carousel-1.jpg',
      title: 'Smart monitoring solutions.',
      subtitle: 'Data-driven. Decision-ready.',
      description: 'IoT sensors and real-time analytics to optimize your fleet performance and reduce environmental impact.',
      cta: 'Learn more'
    },
    {
      image: '/green.jpeg',
      title: 'Innovation for Africa.',
      subtitle: 'Local solutions. Global impact.',
      description: 'Locally engineered technologies designed specifically for African road conditions and climate.',
      cta: 'Discover more'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);
  const handlers = useSwipeable({
  onSwipedLeft: () => setCurrentSlide((prev) => (prev + 1) % slides.length),
  onSwipedRight: () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length),
  preventScrollOnSwipe: true,
  trackTouch: true,
  trackMouse: false,
});

  return (
    <>
<section className="relative min-h-screen overflow-hidden">
  {/* Background Slideshow */}
  <div className="absolute inset-0 z-0">
    {slides.map((slide, index) => (
      <img
        key={index}
        src={slide.image}
        alt={`Slide ${index + 1}`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
          currentSlide === index ? 'opacity-100' : 'opacity-0'
        }`}
      />
    ))}
    <div className="absolute inset-0 bg-black/60" />
  </div>

  {/* Foreground Content */}
  <div 
      {...handlers}
  className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 flex items-center min-h-screen">
    <div className="w-full text-center text-white space-y-6">
      {/* Title */}
      <h1 className="text-[clamp(2rem,6vw,5rem)] font-extrabold leading-tight tracking-tight">
        {slides[currentSlide].title}
      </h1>

      {/* Subtitle */}
      <p className="text-[clamp(1.2rem,3vw,2rem)] font-semibold text-emerald-400">
        {slides[currentSlide].subtitle}
      </p>

      {/* Description */}
      <p className="max-w-3xl mx-auto text-[clamp(1rem,2.5vw,1.5rem)] text-gray-200 leading-relaxed">
        {slides[currentSlide].description}
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-6 sm:px-10 py-3 sm:py-4 text-[clamp(1rem,2vw,1.25rem)] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl transform hover:scale-105">
          {slides[currentSlide].cta}
        </button>
        <a
          href="https://www.facebook.com/watch/?v=249386448091361"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 sm:px-10 py-3 sm:py-4 text-[clamp(1rem,2vw,1.25rem)] border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-xl transform hover:scale-105"
        >
          Watch Story
        </a>
      </div>

      {/* Feature Icons */}
      <div className="flex justify-center gap-4 sm:gap-6 pt-8">
        {[Zap, Shield, Leaf].map((Icon, i) => (
          <div
            key={i}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white"
          >
            <Icon className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Slide Indicators */}
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
    {slides.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentSlide(index)}
        className={`h-2.5 rounded-full transition-all duration-300 ${
          index === currentSlide ? 'w-6 bg-emerald-400' : 'w-2.5 bg-white/50'
        }`}
      />
    ))}
  </div>

  {/* Arrows */}
  <button
    onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
    className="absolute left-0 sm:left-0 top-[50%] -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white z-20 transition"
  >
    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 rotate-180" />
  </button>
  <button
    onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
    className="absolute right-0 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white z-20 transition"
  >
    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
  </button>
</section>



      {/* Value Proposition Section */}
      <section className="space-y-3 ">
        <div className="">
          <div className="">
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
      <section className=" bg-white">
        <div className="">
          <div className=" text-center">
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
      <section className="  text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative">
          <div className=" text-center  bg-emerald-600">
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
