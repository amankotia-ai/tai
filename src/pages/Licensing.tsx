import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    Handshake,
    FileText,
    CheckCircle,
    ArrowRight,
    CurrencyDollar,
    Clock,
    Users,
    Lock,
    Sparkle
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PublicHeader } from '@/components/layout/PublicHeader';

const processSteps = [
    { icon: FileText, title: 'Request Received', desc: 'Studio submits a licensing request through our platform' },
    { icon: Users, title: 'Artist Review', desc: 'You receive full details: project, usage scope, compensation' },
    { icon: Lock, title: 'Secure Authorization', desc: 'Biometric verification ensures it is really you approving' },
    { icon: Handshake, title: 'License Issued', desc: 'Cryptographic token grants time-limited access' },
];

const benefits = {
    actors: [
        'Full control over how your likeness is used',
        'Transparent compensation tracking',
        'Instant revocation capabilities',
        'Legal compliance documentation',
    ],
    studios: [
        'Verified consent chain for legal protection',
        'Streamlined rights acquisition',
        'Access to global talent pool',
        'Automated compliance reporting',
    ],
};

const pricing = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        features: ['1 protected asset', 'Basic monitoring', 'Community support'],
        cta: 'Get Started',
        highlighted: false
    },
    {
        name: 'Pro',
        price: '$29',
        period: '/month',
        features: ['Unlimited assets', 'Advanced AI monitoring', 'Priority support', 'Revenue analytics'],
        cta: 'Start Free Trial',
        highlighted: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        features: ['Custom integrations', 'Dedicated account manager', 'SLA guarantee', 'API access'],
        cta: 'Contact Sales',
        highlighted: false
    },
];

export default function Licensing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <PublicHeader />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-hero" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8">
                            <Handshake className="w-5 h-5 text-accent" />
                            <span className="text-sm font-medium text-accent">Consent-First Licensing</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            License Rights,
                            <span className="text-gradient-primary"> Not Exploitation</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground mb-10">
                            Our licensing system ensures every use of an artist's likeness is authorized, compensated, and auditable. Think of it as Digi-Yatra for entertainment.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" onClick={() => navigate('/onboarding')} className="gap-2 glow-primary">
                                Start Licensing <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Flow */}
            <section className="py-20 lg:py-32 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            How Licensing Works
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            A seamless, secure process from request to authorization
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {processSteps.map((step, index) => (
                            <div key={step.title} className="relative">
                                {index < processSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border -translate-x-1/2 z-0" />
                                )}
                                <div className="relative p-6 rounded-2xl bg-card border border-border h-full z-10">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <step.icon className="w-6 h-6 text-primary" weight="duotone" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Benefits for Everyone
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="p-8 rounded-2xl bg-card border border-border">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Users className="w-6 h-6 text-primary" />
                                For Artists
                            </h3>
                            <ul className="space-y-4">
                                {benefits.actors.map((benefit) => (
                                    <li key={benefit} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-8 rounded-2xl bg-card border border-border">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                For Studios
                            </h3>
                            <ul className="space-y-4">
                                {benefits.studios.map((benefit) => (
                                    <li key={benefit} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-20 lg:py-32 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <CurrencyDollar className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium text-primary">Pricing</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Plans for Every Creator
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {pricing.map((plan) => (
                            <div
                                key={plan.name}
                                className={`p-8 rounded-2xl border ${plan.highlighted
                                    ? 'bg-gradient-card border-primary/50 glow-primary'
                                    : 'bg-card border-border'
                                    }`}
                            >
                                {plan.highlighted && (
                                    <Badge className="mb-4 gap-1 bg-primary text-primary-foreground">
                                        <Sparkle className="w-3 h-3" weight="fill" /> Most Popular
                                    </Badge>
                                )}
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">{plan.period}</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-accent" weight="fill" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className="w-full"
                                    variant={plan.highlighted ? 'default' : 'outline'}
                                    onClick={() => navigate('/onboarding')}
                                >
                                    {plan.cta}
                                </Button>
                            </div>
                        ))}
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
