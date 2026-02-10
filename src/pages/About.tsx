import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Target, 
  Lightbulb,
  Heart,
  Globe,
  ArrowRight,
  LinkedinLogo,
  TwitterLogo
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/PublicHeader';

const team = [
  { name: 'Aarav Mehta', role: 'CEO & Co-founder', bio: 'Former Head of AI Ethics at a major streaming platform' },
  { name: 'Priya Sharma', role: 'CTO & Co-founder', bio: 'Ex-Google, specialized in cryptographic security' },
  { name: 'Rohan Kapoor', role: 'Chief Legal Officer', bio: '20+ years in entertainment law' },
  { name: 'Ananya Iyer', role: 'Head of Artist Relations', bio: 'Former talent agent, advocate for creator rights' },
];

const values = [
  { icon: Heart, title: 'Artist-First', description: 'Every decision we make prioritizes the rights and wellbeing of creators.' },
  { icon: ShieldCheck, title: 'Trust Through Technology', description: 'We build security you can verify, not just believe in.' },
  { icon: Globe, title: 'Global Access', description: 'Protecting artists everywhere, from Bollywood to Hollywood.' },
  { icon: Lightbulb, title: 'Ethical Innovation', description: 'AI should empower creators, never exploit them.' },
];

export default function About() {
  const navigate = useNavigate();

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
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Protecting the Future of
              <span className="text-gradient-primary"> Creative Identity</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              We're building the trust infrastructure for the AI era—where artists control their digital likeness and studios can innovate responsibly.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Democratizing Digital Rights
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                The rise of AI has created unprecedented challenges for artists. Voice cloning, face synthesis, and deepfakes threaten livelihoods and reputations. We believe technology should protect creators, not exploit them.
              </p>
              <p className="text-lg text-muted-foreground">
                theatre.ai provides the tools for artists to own, protect, and monetize their digital identity—while giving studios a trusted, consent-first pathway to innovation.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map((value) => (
                <div key={value.title} className="p-6 rounded-2xl bg-card border border-border">
                  <value.icon className="w-10 h-10 text-primary mb-4" weight="duotone" />
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Users className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-accent">Our Team</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built by Industry Insiders
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our team combines decades of experience in entertainment, AI, law, and security.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="p-6 rounded-2xl bg-card border border-border text-center group hover:border-primary/50 transition-colors">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                <div className="flex justify-center gap-2">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <LinkedinLogo className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <TwitterLogo className="w-4 h-4" />
                  </Button>
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
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join Our Mission
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Whether you're an artist, studio, or advocate—we'd love to connect.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/onboarding')} className="gap-2">
                  Get Started <ArrowRight className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </div>
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
