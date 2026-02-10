import {
    ShieldCheck,
    Newspaper,
    Download,
    Envelope,
    Calendar,
    ArrowRight,
    ArrowUpRight
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PublicHeader } from '@/components/layout/PublicHeader';

const pressReleases = [
    {
        date: '2024-01-15',
        title: 'theatre.ai Raises $15M Series A to Protect Artist Rights in AI Era',
        source: 'TechCrunch',
        excerpt: 'The startup is building the infrastructure for consent-based AI licensing in entertainment.',
    },
    {
        date: '2024-01-08',
        title: 'How theatre.ai is Becoming the "Aadhaar for Entertainment"',
        source: 'Economic Times',
        excerpt: 'India\'s answer to AI-driven exploitation of artist likenesses gains momentum.',
    },
    {
        date: '2023-12-20',
        title: 'Major Studios Partner with theatre.ai for Ethical AI Licensing',
        source: 'Variety India',
        excerpt: 'Universal Pictures India and Netflix Studios join the verified consent network.',
    },
    {
        date: '2023-12-05',
        title: 'theatre.ai Launches CastID: Military-Grade Protection for Digital Identities',
        source: 'Mint',
        excerpt: 'New biometric vault technology promises tamper-proof protection for voice and face data.',
    },
];

const mediaAssets = [
    { name: 'Logo Pack', format: 'SVG, PNG', size: '2.4 MB' },
    { name: 'Brand Guidelines', format: 'PDF', size: '8.1 MB' },
    { name: 'Executive Photos', format: 'JPG', size: '15.2 MB' },
    { name: 'Product Screenshots', format: 'PNG', size: '12.8 MB' },
];

export default function Press() {
    return (
        <div className="min-h-screen bg-background">
            <PublicHeader />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-hero" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                            <Newspaper className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium text-primary">Press & Media</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            theatre.ai in the
                            <span className="text-gradient-primary"> News</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground">
                            Latest updates, press releases, and media coverage of our mission to protect creative identity.
                        </p>
                    </div>
                </div>
            </section>

            {/* Press Releases */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Latest News
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {pressReleases.map((release) => (
                            <div
                                key={release.title}
                                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Badge variant="secondary" className="gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(release.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">{release.source}</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                            {release.title}
                                        </h3>
                                        <p className="text-muted-foreground">{release.excerpt}</p>
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Press Kit */}
            <section className="py-20 lg:py-32 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                                <Download className="w-5 h-5 text-accent" />
                                <span className="text-sm font-medium text-accent">Press Kit</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Media Resources
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Download our official brand assets, executive photos, and product screenshots for your publications.
                            </p>
                            <Button size="lg" className="gap-2">
                                <Download className="w-5 h-5" />
                                Download Full Press Kit
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {mediaAssets.map((asset) => (
                                <div
                                    key={asset.name}
                                    className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer group"
                                >
                                    <div>
                                        <p className="font-medium group-hover:text-primary transition-colors">{asset.name}</p>
                                        <p className="text-sm text-muted-foreground">{asset.format} • {asset.size}</p>
                                    </div>
                                    <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Media Contact */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <Envelope className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Media Inquiries
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            For press inquiries, interviews, or additional information, please contact our media team.
                        </p>
                        <div className="p-6 rounded-2xl bg-card border border-border mb-8">
                            <p className="font-semibold mb-1">Press Contact</p>
                            <a href="mailto:press@theatre.ai" className="text-primary hover:underline">
                                press@theatre.ai
                            </a>
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Envelope className="w-5 h-5" />
                            Send Media Inquiry
                        </Button>
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
