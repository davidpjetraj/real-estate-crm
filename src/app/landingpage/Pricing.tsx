import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "/month",
      description: "Perfect for new agents getting started",
      features: [
        "Up to 500 contacts",
        "Lead capture forms",
        "Email automation",
        "Basic reporting",
        "Mobile app access",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Best for growing real estate professionals",
      features: [
        "Up to 2,500 contacts",
        "Advanced lead scoring",
        "SMS automation",
        "Advanced analytics",
        "Calendar integration",
        "Phone support",
        "Custom branding",
        "Transaction management",
      ],
      popular: true,
    },
    {
      name: "Team",
      price: "$199",
      period: "/month",
      description: "Ideal for teams and brokerages",
      features: [
        "Unlimited contacts",
        "Team collaboration tools",
        "Advanced permissions",
        "White-label solution",
        "API access",
        "Dedicated success manager",
        "Priority support",
        "Custom integrations",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Simple, Transparent
            <span className="block text-primary">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your business. All plans include a
            14-day free trial with no setup fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`
                relative bg-card rounded-2xl p-8 border transition-all duration-300 hover:shadow-glow
                ${
                  plan.popular
                    ? "border-primary shadow-elegant scale-105"
                    : "border-border shadow-sm hover:scale-105"
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-primary">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                className="w-full"
              >
                {plan.popular ? "Start Free Trial" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Need a custom solution? We&apos;ve got you covered.
          </p>
          <Button variant="ghost" size="lg">
            Contact Sales Team
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
