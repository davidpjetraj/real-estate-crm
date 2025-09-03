const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Martinez",
      role: "Top Producer, Luxury Homes Realty",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b586?w=150&h=150&fit=crop&crop=face",
      quote:
        "This CRM transformed my business completely. I went from struggling with spreadsheets to closing 40% more deals. The automated follow-ups alone have been game-changing.",
    },
    {
      name: "Michael Chen",
      role: "Broker, Dynasty Real Estate",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote:
        "Finally, a CRM built for real estate. The lead management is intuitive, and my team loves how easy it is to stay organized. Our conversion rate has never been higher.",
    },
    {
      name: "Jessica Thompson",
      role: "Realtor, Coastal Properties",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote:
        "The mobile app is incredible. I can update lead information during showings and never miss a follow-up. It's like having a personal assistant in my pocket.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Trusted by Top
            <span className="block text-primary">
              Real Estate Professionals
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how our CRM is helping agents and brokers across the country
            close more deals and grow their business.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-elegant border border-border hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <blockquote className="text-muted-foreground leading-relaxed italic">
                &quot;{testimonial.quote}&quot;
              </blockquote>

              <div className="flex mt-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
