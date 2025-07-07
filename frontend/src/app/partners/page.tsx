'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Building, 
  GraduationCap, 
  Factory, 
  Handshake, 
  Globe, 
  Users,
  ArrowRight,
  ExternalLink,
  Target,
  Zap
} from 'lucide-react';

export default function Partners() {
  const [activeCategory, setActiveCategory] = useState('all');

  const partners = [
    {
      name: 'NCST – National Council for Science and Technology',
      category: 'institutional',
      logo: '/partners/NCST.png',
      desc: 'Funding and supporting cleantech innovation through research grants and infrastructure access.',
      type: 'Government Agency',
      relationship: 'Funding Partner',
      impact: 'Research & Development Support',
      website: 'https://www.ncst.gov.rw/'
    },
    {
      name: 'CMU-Africa – Carnegie Mellon University Africa',
      category: 'academic',
      logo: '/partners/CMU - AFRICA.png',
      desc: 'Technical partner providing research mentorship, systems design, and IoT collaboration.',
      type: 'Academic Institution',
      relationship: 'Research Partner',
      impact: 'Technical Expertise & Innovation',
      website: 'https://www.africa.engineering.cmu.edu/'
    },
    {
      name: 'Mastercard Foundation',
      category: 'institutional',
      logo: '/partners/MASTERCARD FOUNDATION.png',
      desc: 'Supports youth employment, innovation, and inclusion in cleantech entrepreneurship.',
      type: 'Foundation',
      relationship: 'Strategic Partner',
      impact: 'Capacity Building & Employment',
      website: 'https://mastercardfdn.org/en/'
    },
    {
      name: 'Rwanda ICT Chamber',
      category: 'institutional',
      logo: '/partners/ICT_CHAMBER.png',
      desc: 'Promotes local innovation, tech community building, and advocacy.',
      type: 'Industry Association',
      relationship: 'Community Partner',
      impact: 'Industry Networking & Advocacy',
      website: 'https://rw.linkedin.com/company/rwanda-ict-chamber'
    },
    {
      name: 'Beno Holding Ltd',
      category: 'manufacturing',
      logo: '/partners/BENO.png',
      desc: 'Local engineering and production partner focused on scalable EV fabrication.',
      type: 'Manufacturing Company',
      relationship: 'Production Partner',
      impact: 'Local Manufacturing & Assembly',
      website: 'https://www.benoholdings.rw/'
    },
    {
      name: '250STARTUP',
      category: 'strategic',
      logo: '/partners/250 (2).png',
      desc: 'Incubation support, mentorship, and startup readiness acceleration.',
      type: 'Incubator',
      relationship: 'Incubation Partner',
      impact: 'Business Development & Mentorship',
      website: 'https://250.rw/'
    },
    {
      name: 'ESP Partners',
      category: 'strategic',
      logo: '/partners/ESP.png',
      desc: 'Strategic guidance on scaling operations and environmental impact finance.',
      type: 'Consulting Firm',
      relationship: 'Advisory Partner',
      impact: 'Strategic Planning & Finance',
      website: 'https://espartners.co/'
    },
    {
      name: 'Rwanda Electric Motors (REM)',
      category: 'strategic',
      logo: '/partners/REM.png',
      desc: 'Partner in the e-mobility sector driving national adoption of electric vehicles.',
      type: 'E-mobility Company',
      relationship: 'Industry Partner',
      impact: 'Market Development & Adoption',
      website: 'https://remrw.com/'
    },
    {
      name: 'REMA – Rwanda Environment Management Authority',
      category: 'institutional',
      logo: '/partners/REMA.png',
      desc: 'Collaborates on air quality initiatives and emissions policy nationwide.',
      type: 'Government Agency',
      relationship: 'Regulatory Partner',
      impact: 'Policy Development & Compliance',
      website: 'https://www.rema.gov.rw/home'
    },
    {
      name: 'Tianjin Luobei – EV Manufacturer (China)',
      category: 'manufacturing',
      logo: '',
      desc: 'International partner supporting the design and supply of electric tricycle components.',
      type: 'Manufacturing Company',
      relationship: 'Supply Chain Partner',
      impact: 'Technology Transfer & Components',
      website: 'https://loboev.en.alibaba.com/'
    },
    {
      name: 'SSM Factory – Clean Cooking Stove Manufacturer',
      category: 'manufacturing',
      logo: '',
      desc: 'Collaborates on local manufacturing strategies for sustainable energy technologies.',
      type: 'Manufacturing Company',
      relationship: 'Manufacturing Partner',
      impact: 'Local Production Expertise',
      website: 'https://www.ssmstove.com/'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Partners', icon: <Globe className="w-4 h-4" />, count: partners.length },
    { id: 'institutional', label: 'Institutional', icon: <Building className="w-4 h-4" />, count: partners.filter(p => p.category === 'institutional').length },
    { id: 'academic', label: 'Academic', icon: <GraduationCap className="w-4 h-4" />, count: partners.filter(p => p.category === 'academic').length },
    { id: 'manufacturing', label: 'Manufacturing', icon: <Factory className="w-4 h-4" />, count: partners.filter(p => p.category === 'manufacturing').length },
    { id: 'strategic', label: 'Strategic', icon: <Handshake className="w-4 h-4" />, count: partners.filter(p => p.category === 'strategic').length }
  ];

  const filteredPartners = activeCategory === 'all' 
    ? partners 
    : partners.filter(partner => partner.category === activeCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="py-32 bg-gradient-to-br from-blue-900 via-emerald-800 to-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-200 rounded-full text-sm font-medium mb-8">
            <Users className="w-4 h-4 mr-2" />
            Partnership Network
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            Our <span className="text-emerald-400">Partners</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-12">
            Collaboration fuels innovation. These institutions and organizations support our mission 
            to build clean mobility technologies for Africa.
          </p>
          
          {/* Partnership Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {[
              { number: '11+', label: 'Partners' },
              { number: '4', label: 'Categories' },
              { number: '3+', label: 'Countries' },
              { number: '100%', label: 'Aligned' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Categories */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.label} ({category.count})</span>
              </button>
            ))}
          </div>

          {/* Partners Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.map((partner, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                <div className="p-8">
                  {/* Logo Section */}
                  <div className="h-20 flex items-center justify-center mb-6 bg-gray-50 rounded-xl">
                    {partner.logo ? (
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="max-h-16 max-w-full object-contain group-hover:scale-110 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Building className="w-8 h-8 text-emerald-600" />
                      </div>
                    )}
                  </div>

                  {/* Partner Info */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {partner.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                        {partner.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {partner.relationship}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {partner.desc}
                    </p>
                  </div>

                  {/* Impact Badge */}
                  <div className="mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-gray-700 mb-1">Key Impact:</div>
                      <div className="text-sm text-emerald-600 font-medium">{partner.impact}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors flex items-center">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                    {partner.website && (
                      <a 
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 hover:bg-emerald-100 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-600 hover:text-emerald-600" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Why Partners Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our partnerships are built on shared values, mutual benefit, and a common commitment 
              to transforming African mobility.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Globe className="w-8 h-8 text-emerald-600" />,
                title: 'Local Expertise',
                desc: 'Deep understanding of African markets and conditions'
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: 'Proven Team',
                desc: 'Experienced professionals with track record of success'
              },
              {
                icon: <Target className="w-8 h-8 text-purple-600" />,
                title: 'Clear Impact',
                desc: 'Measurable results in clean mobility and emissions reduction'
              },
              {
                icon: <Zap className="w-8 h-8 text-green-600" />,
                title: 'Innovation Focus',
                desc: 'Cutting-edge solutions designed for real-world challenges'
              }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-6">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Partnership Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We work with diverse organizations across multiple sectors to maximize our impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Building className="w-12 h-12 text-blue-600" />,
                title: 'Institutional Partners',
                count: partners.filter(p => p.category === 'institutional').length,
                desc: 'Government agencies, foundations, and industry associations providing funding and policy support.',
                color: 'bg-blue-50 border-blue-200'
              },
              {
                icon: <GraduationCap className="w-12 h-12 text-emerald-600" />,
                title: 'Academic Partners',
                count: partners.filter(p => p.category === 'academic').length,
                desc: 'Universities and research institutions contributing technical expertise and innovation.',
                color: 'bg-emerald-50 border-emerald-200'
              },
              {
                icon: <Factory className="w-12 h-12 text-purple-600" />,
                title: 'Manufacturing Partners',
                count: partners.filter(p => p.category === 'manufacturing').length,
                desc: 'Production companies enabling local manufacturing and supply chain development.',
                color: 'bg-purple-50 border-purple-200'
              },
              {
                icon: <Handshake className="w-12 h-12 text-green-600" />,
                title: 'Strategic Partners',
                count: partners.filter(p => p.category === 'strategic').length,
                desc: 'Business partners providing mentorship, market access, and strategic guidance.',
                color: 'bg-green-50 border-green-200'
              }
            ].map((category, idx) => (
              <div key={idx} className={`${category.color} border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow`}>
                <div className="mb-6">{category.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                <div className="text-3xl font-bold text-emerald-600 mb-4">{category.count}</div>
                <p className="text-gray-600 text-sm">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="py-24 bg-emerald-600 text-white">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Interested in partnering with us?
          </h2>
          <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
            Join our network of partners working together to transform African mobility 
            and create a cleaner, more sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-xl text-center">
              Explore Partnership Opportunities
            </Link>
            <Link href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 text-center">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}