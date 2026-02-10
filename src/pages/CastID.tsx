import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    Fingerprint,
    Lock,
    Eye,
    CloudArrowUp,
    CheckCircle,
    ArrowRight,
    Database,
    ShieldCheckered,
    Scan
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/PublicHeader';

const features = [
    {
        icon: Fingerprint,
        title: 'Biometric Capture',
        description: 'Securely capture voice, face, and motion data with our studio-grade tools.'
    },
    {
        icon: Lock,
        title: 'Military-Grade Encryption',
        description: 'AES-256 encryption ensures your data is protected at rest and in transit.'
    },
    {
        icon: Database,
        title: 'Immutable Ledger',
        description: 'Every access and modification is logged with cryptographic proof.'
    },
    {
        icon: ShieldCheckered,
        title: 'Tamper Detection',
        description: 'Instant alerts if someone attempts to misuse your protected assets.'
    },
];

const steps = [
    { step: '01', title: 'Upload Your Assets', desc: 'Record or upload voice samples, facial scans, or motion capture data.' },
    { step: '02', title: 'AI Verification', desc: 'Our AI verifies authenticity and creates a unique digital fingerprint.' },
    { step: '03', title: 'Secure Storage', desc: 'Assets are encrypted and stored in your personal vault.' },
    { step: '04', title: 'Monitor & Control', desc: 'Track who accesses your data and revoke permissions anytime.' },
];

export default function CastID() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <PublicHeader />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-hero" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                            <Fingerprint className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium text-primary">CastID Technology</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            Your Digital Identity,
                            <span className="text-gradient-primary"> Secured Forever</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground mb-10">
                            CastID creates an unbreakable link between you and your biometric data. No one can use your voice or face without your explicit, cryptographically-verified consent.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" onClick={() => navigate('/onboarding')} className="gap-2 glow-primary">
                                Protect Your Identity <ArrowRight className="w-5 h-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="gap-2">
                                <Eye className="w-5 h-5" />
                                See Demo
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 lg:py-32 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            How CastID Works
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Four simple steps to secure your digital identity
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((item) => (
                            <div key={item.step} className="relative">
                                <div className="text-8xl font-bold text-primary/10 absolute -top-4 -left-2">{item.step}</div>
                                <div className="relative pt-12 p-6 rounded-2xl bg-card border border-border h-full">
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Enterprise-Grade Security
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Built with the same security standards trusted by governments and financial institutions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <feature.icon className="w-6 h-6 text-primary" weight="duotone" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scan Animation Section */}
            <section className="py-20 lg:py-32 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                                <Scan className="w-5 h-5 text-accent" />
                                <span className="text-sm font-medium text-accent">Real-Time Protection</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Continuous Monitoring
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                Our AI continuously scans the internet for unauthorized use of your protected assets. Get instant alerts when your voice or likeness is detected without permission.
                            </p>
                            <ul className="space-y-3">
                                {['Social media monitoring', 'Deepfake detection', 'Audio fingerprint matching', 'Automated takedown requests'].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-accent" weight="fill" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-gradient-card border border-border p-8 flex items-center justify-center">
                                <div className="relative w-48 h-48">
                                    <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
                                    <div className="absolute inset-4 rounded-full border-4 border-primary/50 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                                    <div className="absolute inset-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <ShieldCheck className="w-16 h-16 text-primary" weight="duotone" />
                                    </div>
                                </div>
                            </div>
                        </div>
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
                            <CloudArrowUp className="w-16 h-16 text-primary mx-auto mb-6" weight="duotone" />
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Start Protecting Today
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                                Join thousands of artists who trust CastID to safeguard their digital future
                            </p>
                            <Button size="lg" onClick={() => navigate('/onboarding')} className="gap-2 glow-primary">
                                Create Your CastID <ArrowRight className="w-5 h-5" />
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
