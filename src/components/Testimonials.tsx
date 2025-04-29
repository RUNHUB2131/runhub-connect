
import React from 'react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  type: 'run-club' | 'brand';
}

const testimonials: Testimonial[] = [
  {
    quote: "RunConnect has transformed how we find sponsors. We've partnered with three new brands this year alone, all perfectly aligned with our club's values.",
    author: "Sarah Johnson",
    role: "President, Northern Beaches Runners",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    type: 'run-club'
  },
  {
    quote: "As a nutrition brand targeting active Australians, RunConnect helped us form genuine partnerships with running communities who love our products.",
    author: "Mark Peterson",
    role: "Marketing Director, VitalFuel",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    type: 'brand'
  },
  {
    quote: "The platform made it incredibly easy to showcase our club to potential sponsors. Within weeks we secured a partnership for our annual charity run.",
    author: "Emma Taylor",
    role: "Treasurer, Melbourne City Striders",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    type: 'run-club'
  },
  {
    quote: "RunConnect provided us direct access to authentic running communities across Australia, significantly increasing our brand visibility in our target market.",
    author: "David Chen",
    role: "CEO, RunFree Footwear",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    type: 'brand'
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="section bg-navy-800 text-white">
      <div className="container-custom">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="bg-navy-700/50 text-orange-300 text-sm font-medium px-3 py-1 rounded-full mb-4">
            Success Stories
          </span>
          <h2 className="text-white mb-4">What Our Users Say</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Discover how RunConnect has helped run clubs and brands across Australia build meaningful partnerships.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`p-6 rounded-xl ${testimonial.type === 'brand' ? 'bg-navy-700' : 'bg-gradient-to-br from-orange-600 to-orange-700'}`}
            >
              <div className="flex items-start mb-4">
                <svg className="h-8 w-8 text-orange-300 mr-2" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4H10zM4 4c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v2H6v18c-2.2 0-4-1.8-4-4V4z"/>
                </svg>
              </div>
              <p className="text-lg mb-6">{testimonial.quote}</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full mr-4 object-cover border-2 border-white/20" 
                />
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className={`text-sm ${testimonial.type === 'brand' ? 'text-white/70' : 'text-white/80'}`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
