import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Fingerprint, 
  Handshake, 
  Globe, 
  Lock, 
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Users,
  Buildings
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Fingerprint,
      title: 'CastID Biometrics',
      description: 'Secure your voice, face, and motion data with military-grade encryption. Your digital identity, protected.',
    },
    {
      icon: Lock,
      title: 'Consent-First Licensing',
      description: 'Control exactly how your likeness is used. Approve or revoke permissions with cryptographic certainty.',
    },
    {
      icon: Handshake,
      title: 'Smart Contracts',
      description: 'AI-powered contract analysis ensures you understand every clause. No more hidden terms.',
    },
    {
      icon: Globe,
      title: 'Global Marketplace',
      description: 'Connect with studios worldwide. Your verified credentials open doors to opportunities.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Protected Artists' },
    { value: '500+', label: 'Partner Studios' },
    { value: '$2.5M', label: 'Rights Secured' },
    { value: '99.9%', label: 'Uptime' },
  ];

  const testimonials = [
    {
      quote: "theatre.ai gave me the confidence to enter the AI licensing space. I know my voice is protected.",
      name: "Priya Sharma",
      role: "Voice Actor, Mumbai",
      rating: 5,
    },
    {
      quote: "The consent flow is genius. It's like Aadhaar for entertainment - secure, simple, and trusted.",
      name: "Rajesh Kumar",
      role: "Film Director",
      rating: 5,
    },
    {
      quote: "Finally, a platform that puts artists first. The contract AI saved me from a bad deal.",
      name: "Aisha Patel",
      role: "Screen Actor",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <ShieldCheck className="w-5 h-5 text-primary" weight="duotone" />
              <span className="text-sm font-medium text-primary">Trusted by 50,000+ artists worldwide</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Own Your
              <span className="text-gradient-primary"> Digital Identity</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              The entertainment industry's first AI-powered rights management platform. 
              Protect your voice, face, and likeness with cryptographic security.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button 
                size="lg" 
                onClick={() => navigate('/onboarding')}
                className="gap-2 glow-primary text-lg px-8 h-14"
              >
                Get Protected
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="gap-2 text-lg px-8 h-14 border-border hover:bg-secondary"
              >
                <Play className="w-5 h-5" weight="fill" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gradient-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Protection Suite
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to protect and monetize your digital identity in the age of AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="group p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/50 transition-all duration-300 hover:glow-primary"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" weight="duotone" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to secure your digital future
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Register & Verify', desc: 'Create your account and complete professional verification' },
              { step: '02', title: 'Secure Your Assets', desc: 'Upload voice, face, and motion data to your encrypted vault' },
              { step: '03', title: 'Control & Earn', desc: 'Approve licensing requests and receive fair compensation' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-8xl font-bold text-primary/10 absolute -top-4 -left-2">{item.step}</div>
                <div className="relative pt-12">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Industry Leaders
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.name}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning" weight="fill" />
                  ))}
                </div>
                <p className="text-foreground mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl bg-gradient-card border border-border p-8 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/30 rounded-full blur-3xl" />
            </div>
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Protect Your Identity?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of artists who trust theatre.ai to safeguard their digital future
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/onboarding')}
                className="gap-2 glow-primary text-lg px-8 h-14"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" weight="duotone" />
              <span className="font-bold">theatre.ai</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 theatre.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
