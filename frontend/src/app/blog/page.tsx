'use client';
import { BookOpen } from 'lucide-react';

export default function Blog() {
  return (
    <>
      {/* Blog Header */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4 mr-2" />
              Insights & Stories
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-emerald-600">Blog</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore insights, updates, and stories from Greenalytic Motors' clean mobility journey.
            </p>
          </div>
        </div>
      </section>

      {/* Main Blog Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="lg:flex lg:gap-16">
            {/* Main Article */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="/tricycle2.jpg"
                    alt="Electric tricycle transporting community"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-8 lg:p-12">
                  <div className="flex items-center mb-6">
                    <span className="text-xs font-medium px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-wider">
                      Impact Highlight
                    </span>
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                    Empowering rural communities through clean mobility
                  </h1>

                  <div className="flex items-center pt-8 border-t border-gray-100">
                    <img
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-100"
                      src="/csm_PHOTO_-_Emmanuel_TUYIZERE_ef84d8ce7d.jpg"
                      alt="Emmanuel Tuyizere"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Emmanuel Tuyizere</h3>
                      <p className="text-emerald-600 font-medium">Founder, Greenalytic Motors</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/4 mt-12 lg:mt-0">
              <div className="bg-gray-50 rounded-3xl p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
                
                <div className="space-y-8">
                  {[
                    {
                      title: 'Green Mobility in Rwanda',
                      description: 'How electric tricycles are transforming rural transportation.',
                      link: '#',
                    },
                    {
                      title: 'Emission Monitoring Explained',
                      description: 'Real-time data for cleaner air across Kigali.',
                      link: '#',
                    },
                    {
                      title: 'Partnership with CMU-Africa',
                      description: 'Building scalable, data-driven solutions with academic research.',
                      link: '#',
                    },
                    {
                      title: 'Local Manufacturing Impact',
                      description: 'Job creation and tech transfer through in-country assembly.',
                      link: '#',
                    },
                  ].map((item, idx, arr) => (
                    <div key={idx} className="group">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                        {item.description}
                      </p>
                      <a
                        href={item.link}
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
                      >
                        Read More →
                      </a>
                      {idx < arr.length - 1 && (
                        <hr className="mt-8 border-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Articles Preview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              More from Our Blog
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover more insights about clean mobility, sustainability, and innovation in Africa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'The Future of Electric Vehicles in Africa',
                excerpt: 'Exploring the potential and challenges of EV adoption across the continent.',
                category: 'Technology',
                readTime: '5 min read',
                image: '/byd.webp'
              },
              {
                title: 'Building Sustainable Supply Chains',
                excerpt: 'How local manufacturing is transforming the clean energy sector.',
                category: 'Business',
                readTime: '7 min read',
                image: '/Spiro.webp'
              },
              {
                title: 'Air Quality Monitoring in Urban Areas',
                excerpt: 'The role of IoT in creating cleaner, healthier cities.',
                category: 'Environment',
                readTime: '6 min read',
                image: '/air.jpg'
              }
            ].map((article, idx) => (
              <article key={idx} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">{article.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {article.excerpt}
                  </p>
                  
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors">
                    Read Article →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-emerald-600 text-white">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Stay Updated with Our Latest Insights
          </h2>
          <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new articles, 
            product updates, and industry insights.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button className="bg-white text-emerald-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-emerald-200 mt-3">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
