import {
  Users,
  Calendar,
  BarChart3,
  MessageSquare,
  Bell,
  Smartphone,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Lead Management",
      description:
        "Capture, organize, and nurture leads from multiple sources. Never lose a potential client again.",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Automated appointment booking with calendar sync. Your clients can book directly online.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Track your performance with detailed reports. Identify trends and optimize your sales process.",
    },
    {
      icon: MessageSquare,
      title: "Automated Follow-ups",
      description:
        "Set up drip campaigns and automated messages. Stay top-of-mind without the manual work.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Get notified about hot leads, important dates, and opportunities you might miss.",
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description:
        "Access your CRM anywhere with our powerful mobile app. Update leads on the go.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Everything You Need to
            <span className="block text-primary">Grow Your Business</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive CRM platform is designed specifically for real
            estate professionals. Streamline your workflow and focus on what
            matters most - closing deals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-8 shadow-elegant hover:shadow-glow transition-all duration-300 border border-border group hover:scale-105"
            >
              <div className="bg-gradient-primary rounded-lg w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-7 w-7 text-white" />
              </div>

              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {feature.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-elegant border border-border max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">40%</div>
                <div className="text-muted-foreground">
                  Increase in Closings
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">2.5x</div>
                <div className="text-muted-foreground">Faster Follow-ups</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">85%</div>
                <div className="text-muted-foreground">
                  Lead Conversion Rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
