import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
    BookmarkSimple,
    FilmStrip,
    UserCircle,
    Article,
    MagnifyingGlass,
    Briefcase,
    MapPin,
    CurrencyDollar,
    Buildings,
    Star,
    CaretRight,
    Heart,
    ChatCircle,
    ShareNetwork,
    DotsThree,
    CheckCircle
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/lib/utils';
import { mockActors } from '@/lib/store';

// Importing Card Components from DiscoverPage logic (re-implemented here for simplicity or we could export them)
// For this task, I will reimplement the specific cards customized for "Saved" context if needed, or reuse the designs.
// I'll stick to the approved designs.

function SavedPersonCard({ person }: { person: any }) {
    return (
        <Link to={`/dashboard/actor/${person.id}`}>
            <Card className="relative p-6 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-foreground/10 transition-all duration-300 group h-full flex flex-col items-center text-center hover:-translate-y-1">
                {/* Remove from Saved Button (Absolute Top Right) */}
                <button className="absolute top-4 right-4 text-primary hover:text-primary/80 transition-colors z-10" onClick={(e) => { e.preventDefault(); /* Handle remove */ }}>
                    <BookmarkSimple className="w-5 h-5" weight="fill" />
                </button>

                {/* Avatar - Large & Centered */}
                <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-4 ring-background border border-border/20 group-hover:border-foreground/10 transition-all">
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground/50">
                        <UserCircle className="w-12 h-12" />
                    </div>
                </div>

                {/* Name & Role */}
                <div className="mb-4">
                    <h3 className="text-[16px] font-bold text-foreground group-hover:text-primary transition-colors">{person.name}</h3>
                    <p className="text-[13px] text-muted-foreground font-medium">{person.specialty}</p>
                    <div className="flex items-center justify-center gap-1 mt-1 text-[12px] text-muted-foreground/80">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{person.location}</span>
                    </div>
                </div>

                {/* Skills - Subtle */}
                <div className="mt-auto flex flex-wrap justify-center gap-1.5 w-full">
                    {person.skills.slice(0, 3).map((skill: string, i: number) => (
                        <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-muted/30 text-muted-foreground border border-border/30">
                            {skill}
                        </span>
                    ))}
                </div>
            </Card>
        </Link>
    );
}

function SavedCastingCallCard({ call }: { call: any }) {
    return (
        <Card className="p-4 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-foreground/10 transition-all duration-300 group cursor-pointer hover:bg-muted/30 relative">
            <button className="absolute top-4 right-4 text-primary hover:text-primary/80 transition-colors z-10" onClick={(e) => { e.stopPropagation(); /* Handle remove */ }}>
                <BookmarkSimple className="w-5 h-5" weight="fill" />
            </button>

            <div className="flex items-start justify-between mb-3 pr-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-foreground">
                        <FilmStrip className="w-5 h-5" weight="duotone" />
                    </div>
                    <div>
                        <h3 className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{call.title}</h3>
                        <p className="text-[12px] text-muted-foreground">{call.studio} • {call.type}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full border border-border/50">
                    {call.deadline}
                </span>
            </div>

            <p className="text-[12px] text-muted-foreground line-clamp-2 mb-3">
                Looking for a talented individual to join our upcoming production. Strong acting skills required.
            </p>
            <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium px-2 py-1 rounded-lg bg-muted text-muted-foreground">
                    {call.location}
                </span>
                <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20" title="Paid Project">
                    <CurrencyDollar className="w-3.5 h-3.5 text-green-600" weight="bold" />
                </div>
            </div>
        </Card>
    )
}

function SavedPostCard({ post }: { post: any }) {
    return (
        <Card className="p-5 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-foreground/10 transition-all duration-300 relative">
            <button className="absolute top-4 right-4 text-primary hover:text-primary/80 transition-colors z-10" onClick={(e) => { e.preventDefault(); /* Handle remove */ }}>
                <BookmarkSimple className="w-5 h-5" weight="fill" />
            </button>

            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
                <div>
                    <h3 className="text-[14px] font-bold text-foreground">{post.author}</h3>
                    <span className="text-[12px] text-muted-foreground flex items-center gap-1.5">
                        {post.timeAgo} • <span className="flex items-center gap-1"><Article className="w-3.5 h-3.5" weight="fill" /> Article</span>
                    </span>
                </div>
            </div>

            <h4 className="text-[16px] font-bold text-foreground mb-2">{post.title}</h4>
            <p className="text-[13px] text-muted-foreground line-clamp-2 mb-4">
                {post.preview}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[12px]">
                        <Heart className="w-4 h-4" /> 24
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[12px]">
                        <ChatCircle className="w-4 h-4" /> 8
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-[12px] rounded-full hover:bg-muted">
                    Read More <CaretRight className="w-3 h-3 ml-1" />
                </Button>
            </div>
        </Card>
    );
}


export default function SavedItemsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get('tab') || 'roles';
    const [searchQuery, setSearchQuery] = useState('');

    const handleTabChange = (value: string) => {
        setSearchParams({ tab: value });
    };

    // Mock Data
    const savedRoles = [
        { id: '1', title: 'Lead Role - Sci-Fi Feature', studio: 'Universal Pictures', deadline: '2d left', type: 'Film', location: 'Los Angeles, CA' },
        { id: '3', title: 'Background Artists Needed', studio: 'Netflix', deadline: '1w left', type: 'TV Series', location: 'New York, NY' },
    ];

    const savedProfiles = mockActors.slice(0, 4);

    const savedPosts = [
        { id: '1', author: 'Casting Networks', title: '5 Tips for a Perfect Self-Tape', preview: 'Learn the industry secrets to submitting a self-tape that gets you noticed by top casting directors.', timeAgo: '2d ago' },
        { id: '2', author: 'Backstage', title: 'Upcoming Auditions in LA', preview: 'A curated list of the best opportunities happening in Los Angeles this week.', timeAgo: '5d ago' },
        { id: '3', author: 'Variety', title: 'Industry Trends 2026', preview: 'What actors need to know about the changing landscape of film and television production.', timeAgo: '1w ago' },
    ];


    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <BookmarkSimple className="w-5 h-5" weight="fill" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Saved Items</h1>
                            <p className="text-muted-foreground text-[14px]">Your personal collection of bookmarked content</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="relative">
                    <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search saved items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-12 bg-card/50 backdrop-blur-sm border-border/40 hover:border-foreground/20 focus:border-primary transition-all rounded-2xl text-[14px] shadow-sm max-w-md"
                    />
                </div>

                {/* Tabs */}
                <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-8">
                    <TabsList className="bg-transparent p-0 h-auto gap-6 border-b border-border/40 w-full justify-start rounded-none px-1">
                        {[
                            { id: 'roles', label: 'Saved Roles', icon: Briefcase },
                            { id: 'profiles', label: 'Saved Profiles', icon: UserCircle },
                            { id: 'posts', label: 'Saved Posts', icon: Article }
                        ].map((tab) => {
                            const isActive = currentTab === tab.id;
                            return (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className={cn(
                                        "px-0 py-3 bg-transparent text-[14px] font-medium text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none relative rounded-none transition-all hover:text-foreground gap-2 flex items-center",
                                        isActive && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                                    )}
                                >
                                    <tab.icon className={cn("w-4 h-4", isActive ? "weight-fill" : "weight-regular")} />
                                    {tab.label}
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>

                    {/* Content */}
                    <TabsContent value="roles" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                        {savedRoles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {savedRoles.map(call => (
                                    <SavedCastingCallCard key={call.id} call={call} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState label="roles" />
                        )}
                    </TabsContent>

                    <TabsContent value="profiles" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                        {savedProfiles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {savedProfiles.map(person => (
                                    <SavedPersonCard key={person.id} person={person} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState label="profiles" />
                        )}
                    </TabsContent>

                    <TabsContent value="posts" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                        {savedPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {savedPosts.map(post => (
                                    <SavedPostCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState label="posts" />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/60 rounded-3xl bg-muted/5">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 text-muted-foreground">
                <BookmarkSimple className="w-8 h-8" weight="duotone" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No saved {label} yet</h3>
            <p className="text-muted-foreground text-[14px] mt-1">
                Items you bookmark will appear here for easy access.
            </p>
        </div>
    )
}
