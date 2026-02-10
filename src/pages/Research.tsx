import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    Atom,
    BookOpen,
    GraduationCap,
    ArrowRight,
    ArrowUpRight,
    FileText,
    Users,
    Lock
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PublicHeader } from '@/components/layout/PublicHeader';

const papers = [
    {
        title: 'Consent-First AI: A Framework for Ethical Biometric Licensing',
        authors: ['Dr. Priya Sharma', 'Dr. Aarav Mehta'],
        venue: 'ACM FAccT 2024',
        abstract: 'We propose a cryptographic framework for managing consent in AI training data, with applications to entertainment and media.',
    },
    {
        title: 'Detecting Unauthorized Voice Cloning: A Deep Learning Approach',
        authors: ['Dr. Rohan Kapoor', 'Research Team'],
        venue: 'IEEE Security & Privacy 2024',
        abstract: 'Novel techniques for identifying synthetic voice generation without access to the underlying model.',
    },
    {
        title: 'The Economics of Digital Identity Rights',
        authors: ['Dr. Ananya Iyer', 'Prof. Vikram Singh'],
        venue: 'Journal of AI Ethics',
        abstract: 'Analyzing market dynamics when creators maintain ownership of their digital likeness.',
    },
];

const partners = [
    { name: 'IIT Bombay', focus: 'AI Safety Research' },
    { name: 'Stanford HAI', focus: 'Human-Centered AI' },
    { name: 'IIIT Hyderabad', focus: 'Speech & Audio Processing' },
    { name: 'MIT Media Lab', focus: 'Identity & Personhood' },
];

const researchAreas = [
    { icon: Lock, title: 'Deepfake Detection', desc: 'Advanced techniques to identify synthetic media' },
    { icon: Users, title: 'Consent Verification', desc: 'Cryptographic proof of authorization' },
    { icon: Atom, title: 'Ethical AI Training', desc: 'Frameworks for responsible model development' },
    { icon: FileText, title: 'Rights Management', desc: 'Smart contracts for digital identity licensing' },
];

export default function Research() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <PublicHeader />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-hero" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                            <Atom className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium text-primary">Research Lab</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            Advancing the Science of
                            <span className="text-gradient-primary"> Digital Identity</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground mb-10">
                            Our research team works at the intersection of AI safety, cryptography, and entertainment law to build the future of creator protection.
                        </p>
                    </div>
                </div>
            </section>

            {/* Research Areas */}
            <section className="py-20 lg:py-32 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Research Focus Areas
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {researchAreas.map((area) => (
                            <div
                                key={area.title}
                                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <area.icon className="w-6 h-6 text-primary" weight="duotone" />
                                </div>
                                <h3 className="font-semibold mb-2">{area.title}</h3>
                                <p className="text-sm text-muted-foreground">{area.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Publications */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                            <BookOpen className="w-5 h-5 text-accent" />
                            <span className="text-sm font-medium text-accent">Publications</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Recent Papers
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {papers.map((paper) => (
                            <div
                                key={paper.title}
                                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <Badge variant="secondary" className="mb-3">{paper.venue}</Badge>
                                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                            {paper.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3">{paper.authors.join(', ')}</p>
                                        <p className="text-muted-foreground">{paper.abstract}</p>
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button variant="outline" className="gap-2">
                            View All Publications <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Academic Partners */}
            <section className="py-20 lg:py-32 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium text-primary">Academic Partners</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Collaborating Institutions
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We partner with leading universities and research labs worldwide
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {partners.map((partner) => (
                            <div
                                key={partner.name}
                                className="p-6 rounded-2xl bg-card border border-border text-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <GraduationCap className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-1">{partner.name}</h3>
                                <p className="text-sm text-muted-foreground">{partner.focus}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="relative rounded-3xl bg-gradient-card border border-border p-8 md:p-16 text-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
                        </div>
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Join Our Research
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                                Interested in collaborating or joining our research team? We're always looking for passionate researchers.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="gap-2">
                                    View Open Positions <ArrowRight className="w-5 h-5" />
                                </Button>
                                <Button size="lg" variant="outline">
                                    Propose Collaboration
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
