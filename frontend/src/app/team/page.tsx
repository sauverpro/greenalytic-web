'use client';
import { useState } from 'react';
import { Users, Award, ArrowRight, Linkedin, Mail, Calendar, MapPin } from 'lucide-react';

export default function Team() {
  const [activeFilter, setActiveFilter] = useState('all');

  const teamMembers = [
    {
      name: 'Emmanuel Tuyizere',
      title: 'Founder & CEO',
      category: 'leadership',
      description: 'Leads strategic vision, partnerships, and overall company direction. Oversees product development and drives clean mobility innovation across African markets.',
      linkedin: '#',
      email: 'emmanuel@greenalytic.rw',
      img: '/csm_PHOTO_-_Emmanuel_TUYIZERE_ef84d8ce7d.jpg',
      experience: '8+ years',
      location: 'Kigali, Rwanda'
    },
    {
      name: 'Eng. Jean Bosco Byumvuhore',
      title: 'Embedded Systems Engineer',
      category: 'engineering',
      description: 'Designs and develops IoT hardware systems for emissions monitoring. Responsible for PCB design, sensor integration, and embedded firmware development.',
      linkedin: '#',
      email: 'bosco@greenalytic.rw',
      img: '/team/bosco.jpg',
      experience: '6+ years',
      location: 'Kigali, Rwanda'
    },
    {
      name: 'Jean Baptista',
      title: 'Software Developer',
      category: 'engineering',
      description: 'Builds web applications and dashboard interfaces for real-time data visualization. Develops APIs and manages system integration for client platforms.',
      linkedin: '#',
      email: 'baptista@greenalytic.rw',
      img: '/team/baptista.jpg',
      experience: '5+ years',
      location: 'Kigali, Rwanda'
    },
    {
      name: 'Kellia Inkindi',
      title: 'Finance & Administration Officer',
      category: 'operations',
      description: 'Manages financial reporting, budget planning, and HR operations. Ensures compliance with grant requirements and oversees day-to-day administrative functions.',
      linkedin: '#',
      email: 'kellia@greenalytic.rw',
      img: '/team/kellia.jpg',
      experience: '7+ years',
      location: 'Kigali, Rwanda'
    }
  ];

  const advisors = [
    {
      name: 'Dr. Kalisa Egide',
      title: 'Environmental Research Advisor',
      description: 'Provides scientific guidance on air quality monitoring and climate change adaptation. Advises on environmental health impact assessment and policy development.',
      linkedin: '#',
      img: '/team/kalisa.jpg',
      institution: 'Western University of Ontario',
      credentials: 'PhD in Environmental Science'
    },
    {
      name: 'Dr. Innocent Nkurikiyimfura',
      title: 'Climate Innovation Advisor',
      description: 'Guides sustainable technology development and renewable energy integration. Advises on climate-resilient innovations and greenhouse gas inventory methodologies.',
      linkedin: '#',
      img: '/team/innocent.jpg',
      institution: 'University of Rwanda',
      credentials: '17+ years in energy systems'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Team', count: teamMembers.length },
    { id: 'leadership', label: 'Leadership', count: teamMembers.filter(m => m.category === 'leadership').length },
    { id: 'engineering', label: 'Engineering', count: teamMembers.filter(m => m.category === 'engineering').length },
    { id: 'operations', label: 'Operations', count: teamMembers.filter(m => m.category === 'operations').length }
  ];

  const filteredMembers = activeFilter === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.category === activeFilter);

  return (
    <>
      {/* Hero Section with Dynamic Elements */}
      <section className="py-32 bg-gradient-to-br from-emerald-900 via-emerald-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative container mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-200 rounded-full text-sm font-medium mb-8 animate-fadeIn">
            <Users className="w-4 h-4 mr-2" />
            Meet Our Team
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight animate-slideUp">
            Meet the <span className="text-emerald-400">innovators</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-12 animate-slideUp delay-200">
            Diverse in background and experience, our team is building clean mobility 
            and air quality solutions across Africa.
          </p>
          
          {/* Animated Team Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { number: '6', label: 'Team Members' },
              { number: '2', label: 'Advisors' },
              { number: '25+', label: 'Years Combined' },
              { number: '100%', label: 'Passionate' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center animate-fadeIn" style={{ animationDelay: `${idx * 100 + 600}ms` }}>
                <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 hover:scale-110 transition-transform duration-300 cursor-default">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-300 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Filter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeFilter === filter.id
                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Animated Team Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMembers.map((member, idx) => (
              <div
                key={member.name}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 overflow-hidden animate-slideUp"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-emerald-100 to-blue-100">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Dynamic Category Badge */}
                  <div className="absolute top-4 right-4 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.category === 'leadership' ? 'bg-emerald-500 text-white' :
                      member.category === 'engineering' ? 'bg-blue-500 text-white' :
                      'bg-purple-500 text-white'
                    }`}>
                      {member.category.charAt(0).toUpperCase() + member.category.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-emerald-600 font-medium text-sm mb-3">{member.title}</p>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {member.experience}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {member.location}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">{member.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <a
                        href={member.linkedin}
                        className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="w-9 h-9 bg-gray-600 hover:bg-gray-700 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                    
                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors group-hover:translate-x-1 duration-300">
                      View Profile →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Advisors Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white text-emerald-700 rounded-full text-sm font-medium mb-8 shadow-sm animate-fadeIn">
              <Award className="w-4 h-4 mr-2" />
              Our Advisory Board
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 animate-slideUp">
              Expert Guidance from Industry Leaders
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {advisors.map((advisor, idx) => (
              <div
                key={advisor.name}
                className="group bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2 animate-slideUp"
                style={{ animationDelay: `${idx * 200}ms` }}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                  <div className="flex-shrink-0 mx-auto lg:mx-0">
                    <div className="relative">
                      <img
                        src={advisor.img}
                        alt={advisor.name}
                        className="w-32 h-32 rounded-3xl object-cover ring-4 ring-emerald-100 group-hover:ring-emerald-200 transition-all duration-300 group-hover:scale-105"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {advisor.name}
                    </h3>
                    <p className="text-emerald-600 font-semibold mb-4 text-lg">{advisor.title}</p>
                    
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      <div className="flex items-center justify-center lg:justify-start text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-2 text-emerald-500" />
                        <span className="font-medium">{advisor.credentials}</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                        <span>{advisor.institution}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-gray-700 leading-relaxed mb-6">{advisor.description}</p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <a
                    href={advisor.linkedin}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group/link"
                  >
                    <Linkedin className="w-5 h-5 mr-2 group-hover/link:scale-110 transition-transform" />
                    Connect on LinkedIn
                  </a>
                  
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium transition-all duration-300 hover:translate-x-1">
                    View Full Bio →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated CTA Section */}
      <section className="py-24 bg-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 animate-slideUp">
            Ready to join our mission?
          </h2>
          <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto animate-slideUp delay-200">
            We're always looking for passionate individuals who want to make a real difference 
            in African mobility and environmental sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn delay-500">
            <a 
              href="mailto:info@greenalytic.rw?subject=Career Opportunity - Join the Greenalytic Team&body=Hello,%0A%0AI am interested in exploring career opportunities at Greenalytic Motors. I would like to learn more about current openings and how I can contribute to your mission of transforming African mobility through clean technology solutions.%0A%0AThank you for your time."
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 text-center"
            >
              Join Our Team
            </a>
            <a 
              href="mailto:info@greenalytic.rw?subject=Partnership Opportunity - Collaborate with Greenalytic Motors&body=Hello,%0A%0AI am interested in exploring partnership opportunities with Greenalytic Motors. Our organization would like to discuss potential collaboration in advancing clean mobility solutions across Africa.%0A%0APlease let me know the best time to connect and discuss this further.%0A%0AThank you."
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 text-center"
            >
              Partner With Us
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </>
  );
}