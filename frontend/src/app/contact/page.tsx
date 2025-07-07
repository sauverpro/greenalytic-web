'use client';
import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare, 
  Globe,
  CheckCircle
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Our Location',
      details: ['Kicukiro, Kigali, Rwanda', 'KN 3Rd, Kicukiro'],
      color: 'text-emerald-600'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone & WhatsApp',
      details: ['+250 796 895 138', 'WhatsApp available'],
      color: 'text-blue-600'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Address',
      details: ['info@greenalytic.rw', 'Response within 24 hours'],
      color: 'text-purple-600'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Business Hours',
      details: ['Mon–Fri: 9:00 AM – 5:00 PM', 'Sat: 9:00 AM – 2:00 PM'],
      color: 'text-green-600'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-32 bg-gradient-to-br from-emerald-900 via-blue-800 to-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-200 rounded-full text-sm font-medium mb-8">
            <MessageSquare className="w-4 h-4 mr-2" />
            Get In Touch
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            Contact <span className="text-emerald-400">Us</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you! Whether you're a partner, investor, customer, or just curious — 
            reach out and let's connect.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Let's Start a Conversation
              </h2>
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                Ready to explore clean mobility solutions or discuss partnership opportunities? 
                We're here to help and answer any questions you might have.
              </p>

              <div className="space-y-8">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className={`${info.color} mt-1`}>
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                      {info.details.map((detail, detailIdx) => (
                        <p key={detailIdx} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-12 p-6 bg-green-50 rounded-2xl border border-green-200">
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="font-semibold text-gray-900">Quick Response via WhatsApp</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  For immediate assistance, reach out to us on WhatsApp for the fastest response.
                </p>
                <a
                  href="https://wa.me/250796895138"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Start WhatsApp Chat
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Send Us a Message</h3>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Message Sent Successfully!</h4>
                    <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        placeholder="What's this about?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg'
                      } text-white`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Visit Our Office
            </h2>
            <p className="text-lg text-gray-600">
              Located in the heart of Kigali's tech ecosystem
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <iframe
              className="w-full h-96"
              src="https://maps.google.com/maps?q=Kicukiro, Kigali, Rwanda&t=&z=13&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Greenalytic Motors Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Office Hours & Additional Info */}
      <section className="py-24 bg-emerald-600 text-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Clock className="w-12 h-12 mx-auto mb-4 text-emerald-200" />
              <h3 className="text-xl font-bold mb-4">Business Hours</h3>
              <div className="space-y-2 text-emerald-100">
                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
                <p>Sunday & Holidays: Closed</p>
              </div>
            </div>
            
            <div>
              <Globe className="w-12 h-12 mx-auto mb-4 text-emerald-200" />
              <h3 className="text-xl font-bold mb-4">Global Reach</h3>
              <div className="space-y-2 text-emerald-100">
                <p>Headquartered in Rwanda</p>
                <p>Serving across Africa</p>
                <p>International partnerships</p>
              </div>
            </div>
            
            <div>
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-emerald-200" />
              <h3 className="text-xl font-bold mb-4">Response Time</h3>
              <div className="space-y-2 text-emerald-100">
                <p>Email: Within 24 hours</p>
                <p>WhatsApp: Within 2 hours</p>
                <p>Phone: Business hours only</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


