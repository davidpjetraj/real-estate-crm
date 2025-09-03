import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Mobile App", href: "#mobile" },
        { name: "Integrations", href: "#integrations" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Press", href: "#press" },
        { name: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "API Docs", href: "#api" },
        { name: "Training", href: "#training" },
        { name: "Blog", href: "#blog" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Cookie Policy", href: "#cookies" },
        { name: "GDPR", href: "#gdpr" },
      ],
    },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-white rounded-lg w-10 h-10 flex items-center justify-center mr-3">
                <span className="text-primary font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold">RealEstate CRM</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              The ultimate CRM platform designed specifically for real estate
              professionals. Streamline your workflow and close more deals.
            </p>

            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary-foreground/60" />
                <span className="text-primary-foreground/80">
                  hello@realestate-crm.com
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary-foreground/60" />
                <span className="text-primary-foreground/80">
                  1-800-REAL-CRM
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-primary-foreground/60" />
                <span className="text-primary-foreground/80">
                  San Francisco, CA
                </span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/60 mb-4 md:mb-0">
              © 2024 RealEstate CRM. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
