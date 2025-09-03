import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img
          src={"/placeholder.svg"}
          alt="Real estate professionals using CRM technology"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-85"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Close More Deals with the
            <span className="block bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              Ultimate Real Estate CRM
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
            Streamline your pipeline, nurture leads automatically, and never
            miss a follow-up. Join thousands of top agents who&apos;ve increased
            their closings by 40%.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button variant="default" size="lg" className="w-full sm:w-auto">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-white">4.9/5</div>
              <div className="flex">
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
              <div>from 500+ reviews</div>
            </div>

            <div className="h-4 w-px bg-white/20 hidden sm:block"></div>

            <div>
              <strong className="text-white">5,000+</strong> agents trust our
              platform
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
