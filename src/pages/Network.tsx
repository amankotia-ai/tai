import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    Buildings,
    Users,
    Globe,
    ArrowRight,
    CheckCircle,
    Star,
    TrendUp
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/PublicHeader';

const stats = [
    { value: '500+', label: 'Partner Studios' },
    { value: '50K+', label: 'Protected Artists' },
    { value: '120+', label: 'Countries Represented' },
    { value: '$25M+', label: 'Rights Secured' },
];

const studios = [
    { name: 'DreamWorks Animation', type: 'Animation Studio' },
    { name: 'Netflix Studios', type: 'Streaming Platform' },
    { name: 'Universal Pictures India', type: 'Film Production' },
    { name: 'Marvel Studios', type: 'Film Production' },
    { name: 'Prime Video', type: 'Streaming Platform' },
    { name: 'Dharma Productions', type: 'Film Production' },
    { name: 'Yash Raj Films', type: 'Film Production' },
    { name: 'Red Chillies VFX', type: 'VFX Studio' },
];

const agencies = [
    { name: 'CAA India', specialization: 'Talent Representation' },
    { name: 'KWAN', specialization: 'Celebrity Management' },
    { name: 'Matrix Entertainment', specialization: 'Artist Management' },
    { name: 'Cornerstone Agency', specialization: 'Voice Artists' },
];

export default function Network() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <PublicHeader />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-hero" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                            <Globe className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium text-primary">Global Network</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            The Industry's Most
                            <span className="text-gradient-primary"> Trusted Network</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground mb-10">
                            Connecting artists, studios, and agencies worldwide through verified trust and transparent rights management.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
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

            {/* Partner Studios */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <Buildings className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium text-primary">Partner Studios</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Trusted by Leading Studios
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Major studios rely on theatre.ai for verified consent and compliant licensing
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {studios.map((studio) => (
                            <div
                                key={studio.name}
                                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                                    <Buildings className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <h3 className="font-semibold mb-1">{studio.name}</h3>
                                <p className="text-sm text-muted-foreground">{studio.type}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partner Agencies */}
            <section className="py-20 lg:py-32 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                            <Users className="w-5 h-5 text-accent" />
                            <span className="text-sm font-medium text-accent">Partner Agencies</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Agency Partners
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Leading talent agencies trust us to protect their roster
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {agencies.map((agency) => (
                            <div
                                key={agency.name}
                                className="p-6 rounded-2xl bg-card border border-border text-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                                    <Star className="w-6 h-6 text-accent" weight="fill" />
                                </div>
                                <h3 className="font-semibold mb-1">{agency.name}</h3>
                                <p className="text-sm text-muted-foreground">{agency.specialization}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Network CTA */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Join the Network
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Whether you're an individual artist, a talent agency, or a major studio—there's a place for you in the theatre.ai network.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Instant access to verified talent pool',
                                    'Streamlined licensing workflows',
                                    'Real-time compliance tracking',
                                    'Industry-standard legal frameworks',
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-accent" weight="fill" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" onClick={() => navigate('/onboarding')} className="gap-2">
                                    Join as Artist <ArrowRight className="w-5 h-5" />
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => navigate('/onboarding')}>
                                    Join as Studio
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-gradient-card border border-border p-8 flex items-center justify-center">
                                <div className="text-center">
                                    <TrendUp className="w-24 h-24 text-primary mx-auto mb-6" weight="duotone" />
                                    <p className="text-4xl font-bold text-gradient-primary mb-2">+340%</p>
                                    <p className="text-muted-foreground">Network growth in 2024</p>
                                </div>
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
