import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    UsersThree,
    UserCircle,
    Buildings,
    Briefcase,
    CaretRight,
    Plus,
    VideoCamera,
    Microphone,
    FilmStrip,
    AddressBook,
    Funnel,
    MagnifyingGlass,
    DotsThree,
    UserPlus,
    Check,
    BookmarkSimple,
    CurrencyDollar,
    ArrowRight
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";
import { ShareNetwork } from '@phosphor-icons/react';
import { storage, User } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Brand Red Constant
const BRAND_RED = '#D61D1F';

// Mock Data for Network Page
// Mock Data for Network Page
const mockConnections = [
    { id: '1', name: 'James Cameron', role: 'Director', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop', type: 'studio', connected: true },
    { id: '2', name: 'Sarah Jones', role: 'Casting Director', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop', type: 'agency', connected: true },
    { id: '3', name: 'Michael Chen', role: 'Producer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop', type: 'studio', connected: true },
];

const mockRequests = [
    { id: 'r1', name: 'David Fincher', role: 'Director', avatar: 'https://images.unsplash.com/photo-1542596594-649edbc13630?w=256&h=256&fit=crop', type: 'studio', connected: false },
];

const mockFollowing = [
    { id: 'f1', name: 'Greta Gerwig', role: 'Director/Writer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop', type: 'studio', connected: false },
];

const mockSuggestions = [
    { id: '4', name: 'Emily Blunt', role: 'Actor', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&h=256&fit=crop', type: 'actor', mutual: 12 },
    { id: '5', name: 'John Krasinski', role: 'Actor/Director', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&h=256&fit=crop', type: 'actor', mutual: 8 },
];

const mockCastingCalls = [
    { id: '1', title: 'Lead Role - Sci-Fi Feature', studio: 'Universal Pictures', deadline: '2d left', type: 'Film', location: 'Los Angeles, CA' },
    { id: '2', title: 'Voice Actor for Animation', studio: 'DreamWorks', deadline: '5d left', type: 'Voice', location: 'Burbank, CA' },
    { id: '3', title: 'Background Artists Needed', studio: 'Netflix', deadline: '1w left', type: 'TV Series', location: 'New York, NY' },
];

const mockWatchlists = [
    { id: '1', name: 'Action Heroes', count: 12 },
    { id: '2', name: 'Voice Talent', count: 45 },
    { id: '3', name: 'Potential Leads', count: 8 },
];

// Helper to get user role
function getUserRole() {
    const user = storage.getUser();
    return user?.role || 'actor';
}

// Quick Actions Component - Updated Design
// Quick Actions Component - Updated Design
// Quick Actions Component - Updated Design
function NetworkQuickActions({ role, className }: { role: string, className?: string }) {
    const handleAction = (action: string) => {
        if (action === 'Submit Self Tape' || action === 'Voice Samples' || action === 'Invite to Audition' || action === 'Request Intro') {
            toast.info("This feature is coming soon!");
        }
    };

    const actions = role === 'actor'
        ? [
            { label: 'Submit Self Tape', icon: VideoCamera, onClick: () => handleAction('Submit Self Tape') },
            { label: 'Update Profile', icon: UserCircle, link: '/dashboard/profile' },
            { label: 'Browse Castings', icon: FilmStrip, link: '/dashboard/feed' },
            { label: 'Voice Samples', icon: Microphone, onClick: () => handleAction('Voice Samples') },
        ]
        : [
            { label: 'Post Casting Call', icon: Plus, link: '/dashboard/contracts' }, // Assuming contracts for now or new page
            { label: 'Shortlist Talent', icon: AddressBook, link: '/dashboard/search' },
            { label: 'Invite to Audition', icon: VideoCamera, onClick: () => handleAction('Invite to Audition') },
            { label: 'Request Intro', icon: UsersThree, onClick: () => handleAction('Request Intro') },
        ];

    return (
        <div className={cn("grid gap-1", className || "grid-cols-2 md:grid-cols-4")}>
            {actions.map((action) => {
                const Content = (
                    <div className="flex items-center gap-3 w-full py-2 px-0 rounded-xl transition-colors cursor-pointer group">
                        <div className="w-9 h-9 min-w-9 rounded-full bg-[#74A5BE]/15 flex items-center justify-center transition-all group-hover:bg-[#D61D1F]/10 group-hover:scale-110">
                            <action.icon className="w-4.5 h-4.5 text-[#74A5BE] group-hover:text-[#D61D1F] transition-colors" weight="duotone" />
                        </div>
                        <span className="text-[13px] font-medium text-foreground group-hover:text-[#D61D1F] transition-colors text-left line-clamp-1 flex-1">
                            {action.label}
                        </span>
                        <CaretRight className="w-3.5 h-3.5 text-muted-foreground/30 ml-auto group-hover:text-[#D61D1F] transition-colors" />
                    </div>
                );

                if (action.link) {
                    return (
                        <Link
                            key={action.label}
                            to={action.link}
                            className="block w-full"
                        >
                            {Content}
                        </Link>
                    )
                }

                return (
                    <button
                        key={action.label}
                        onClick={action.onClick}
                        className="block w-full"
                    >
                        {Content}
                    </button>
                )
            })}
        </div>
    );
}

// Left Sidebar - Saved Items (Copied from FeedPage)
function SavedItemsLinks() {
    const savedItems = [
        { label: 'Saved Roles', count: 8, icon: Briefcase, link: '/dashboard/saved?tab=roles' },
        { label: 'Saved Profiles', count: 24, icon: UserCircle, link: '/dashboard/saved?tab=profiles' },
        { label: 'Saved Posts', count: 56, icon: BookmarkSimple, link: '/dashboard/saved?tab=posts' },
    ];

    return (
        <Card className="p-5 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <BookmarkSimple className="w-4 h-4 text-foreground" weight="fill" />
                    <h3 className="text-[14px] font-semibold text-foreground">Saved Items</h3>
                </div>
            </div>
            <div className="space-y-2">
                {savedItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.link}
                        className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-muted/50 transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-[#74A5BE]/15 flex items-center justify-center ring-1 ring-[#74A5BE]/20 text-[#74A5BE] group-hover:text-foreground transition-colors">
                            <item.icon className="w-4 h-4" weight="fill" />
                        </div>
                        <span className="flex-1 text-[12px] font-medium text-foreground group-hover:text-primary transition-colors">
                            {item.label}
                        </span>
                        <span className="text-[11px] font-semibold text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full">
                            {item.count}
                        </span>
                    </Link>
                ))}
            </div>
        </Card>
    );
}

// Left Sidebar - Profile Summary
function NetworkProfileCard() {
    const user = storage.getUser();
    // Concept: Move away from vanity metrics to utility/actionable insights
    const profileCompleteness = 70;

    return (
        <Card className="p-5 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-[#D61D1F]/20 transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Link to={`/dashboard/profile/${user?.id || 'me'}`}>
                            <div className="w-12 h-12 rounded-full bg-muted overflow-hidden ring-2 ring-background group-hover:ring-[#D61D1F]/20 transition-all">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop"
                                    alt={user?.name || 'Profile'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Link>
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-2 border-background rounded-full bg-emerald-500 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" weight="bold" />
                        </div>
                    </div>
                    <div>
                        <Link to={`/dashboard/profile/${user?.id || 'me'}`} className="hover:underline">
                            <h3 className="text-[15px] font-semibold text-foreground truncate">{user?.name || 'Jane Smith'}</h3>
                        </Link>
                        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                            <span className="capitalize">{user?.role || 'Actor'}</span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                            <span className="text-emerald-500 font-medium">Public</span>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-1 rounded-full hover:bg-[#D61D1F]/10 hover:text-[#D61D1F] transition-colors" onClick={() => toast.success("Profile link copied!")}>
                    <ShareNetwork className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-4">
                {/* Profile Strength */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[12px]">
                        <span className="font-medium text-foreground">Profile Strength</span>
                        <span className="font-bold text-[#D61D1F]">{profileCompleteness}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#74A5BE]/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#D61D1F] rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${profileCompleteness}%` }}
                        />
                    </div>
                </div>

                {/* Intelligent Insight / Suggestion */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-muted/50 to-transparent border border-border/40 flex gap-3 items-start">
                    <div className="p-1.5 rounded-full bg-[#74A5BE]/15 text-[#74A5BE] mt-0.5 flex-shrink-0">
                        <VideoCamera className="w-3.5 h-3.5" weight="duotone" />
                    </div>
                    <div>
                        <h4 className="text-[12px] font-semibold text-foreground mb-0.5">Add a Video Reel</h4>
                        <p className="text-[11px] text-muted-foreground leading-snug">
                            Profiles with reels get <span className="text-foreground font-medium">3x more views</span> from casting directors.
                        </p>
                    </div>
                </div>
            </div>

            <Link to="/dashboard/profile" className="block mt-4">
                <Button className="w-full rounded-2xl bg-foreground text-background hover:bg-foreground/90 h-9 text-[13px] font-medium shadow-sm">
                    View & Edit Profile
                </Button>
            </Link>
        </Card>
    );
}

// Right Sidebar - Connections/Watchlists
function RightSidebarWidget({ role }: { role: string }) {
    if (role === 'actor') {
        return null;
    }

    return (
        <Card className="p-5 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-[#D61D1F]/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <BookmarkSimple className="w-4 h-4 text-foreground" weight="fill" />
                    <h3 className="text-[14px] font-semibold text-foreground">Watchlists</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-[#D61D1F]/10 hover:text-[#D61D1F]">
                    <Plus className="w-3.5 h-3.5" />
                </Button>
            </div>
            <div className="space-y-2">
                {mockWatchlists.map((list) => (
                    <div key={list.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/50 cursor-pointer group transition-all">
                        <span className="text-[13px] font-medium text-foreground group-hover:text-[#D61D1F] transition-colors">{list.name}</span>
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full group-hover:bg-[#D61D1F]/10 group-hover:text-[#D61D1F] transition-colors">{list.count}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export default function NetworkPage() {
    const role = getUserRole();
    const [activeTab, setActiveTab] = useState('connections');
    const [categoryTab, setCategoryTab] = useState<'all' | 'casting-directors' | 'talent' | 'agents'>('all');
    const [selectedCastingCall, setSelectedCastingCall] = useState<typeof mockCastingCalls[0] | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Local State for Interactivity
    const [connections, setConnections] = useState(mockConnections);
    const [requests, setRequests] = useState(mockRequests);
    const [following, setFollowing] = useState(mockFollowing);

    const handleAcceptRequest = (id: string) => {
        const request = requests.find(r => r.id === id);
        if (request) {
            setConnections([...connections, { ...request, connected: true }]);
            setRequests(requests.filter(r => r.id !== id));
            toast.success(`Connected with ${request.name}`);
        }
    };

    const handleIgnoreRequest = (id: string) => {
        setRequests(requests.filter(r => r.id !== id));
        toast.info("Request ignored");
    };

    const handleCastingCallClick = (call: typeof mockCastingCalls[0]) => {
        setSelectedCastingCall(call);
        setIsDrawerOpen(true);
    };

    const getDataForTab = () => {
        switch (activeTab) {
            case 'connections': return connections;
            case 'requests': return requests;
            case 'following': return following;
            default: return [];
        }
    };

    const currentData = getDataForTab().filter((person) => {
        if (categoryTab === 'all') return true;
        if (categoryTab === 'casting-directors') {
            return person.role.toLowerCase().includes('casting') || person.type === 'studio';
        }
        if (categoryTab === 'talent') {
            return person.type === 'actor' || person.role.toLowerCase().includes('actor');
        }
        return person.type === 'agency' || person.role.toLowerCase().includes('agent');
    });

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex gap-6">

                    {/* Left Sidebar - 25% */}
                    <div className="w-64 flex-shrink-0 space-y-4 hidden lg:block">
                        <NetworkProfileCard />
                        <SavedItemsLinks />
                    </div>

                    {/* Center Content - 50% */}
                    <div className="flex-1 min-w-0">
                        {/* Quick Actions - Mobile/Tablet Only */}
                        <div className="mb-2 xl:hidden">
                            <h2 className="text-[18px] font-bold text-foreground mb-4 pl-1">Quick Actions</h2>
                            <NetworkQuickActions role={role} className="grid-cols-2 lg:grid-cols-4" />
                        </div>

                        {/* Casting Calls Preview (for Actors) */}
                        {role === 'actor' && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4 pl-1">
                                    <h2 className="text-[18px] font-bold text-foreground">Casting Calls</h2>
                                    <Link to="/dashboard/search" className="text-[13px] font-medium text-[#D61D1F] hover:text-[#D61D1F]/80 flex items-center gap-1 group">
                                        View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                                <div className="grid gap-3">
                                    {mockCastingCalls.slice(0, 3).map((call) => (
                                        <div key={call.id} className="p-4 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-foreground/10 transition-all duration-300 group cursor-pointer hover:bg-muted/30" onClick={() => handleCastingCallClick(call)}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#74A5BE]/15 flex items-center justify-center text-[#74A5BE]">
                                                        <FilmStrip className="w-5 h-5" weight="duotone" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{call.title}</h3>
                                                        <p className="text-[12px] text-muted-foreground">{call.studio} • {call.type}</p>
                                                    </div>
                                                </div>
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
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            {[
                                { value: 'casting-directors', label: 'Casting Directors' },
                                { value: 'talent', label: 'Talent' },
                                { value: 'agents', label: 'Agents' },
                            ].map((entry) => (
                                <Button
                                    key={entry.value}
                                    size="sm"
                                    variant={categoryTab === entry.value ? 'default' : 'outline'}
                                    className="h-8 rounded-full text-[11px]"
                                    onClick={() => setCategoryTab(entry.value as 'casting-directors' | 'talent' | 'agents')}
                                >
                                    {entry.label}
                                </Button>
                            ))}
                            <Button
                                size="sm"
                                variant={categoryTab === 'all' ? 'default' : 'outline'}
                                className="h-8 rounded-full text-[11px]"
                                onClick={() => setCategoryTab('all')}
                            >
                                All
                            </Button>
                        </div>

                        {/* Connections Tabs */}
                        <div className="flex items-center gap-6 mb-6 border-b border-border/40 pb-1 mx-1">
                            {['Connections', 'Requests', 'Following'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={cn(
                                        "text-[14px] font-medium pb-3 relative transition-colors",
                                        activeTab === tab.toLowerCase() ? "text-[#D61D1F]" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {tab}
                                    {activeTab === tab.toLowerCase() && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D61D1F] rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Connections List */}
                        <div className="space-y-3">
                            {currentData.length > 0 ? (
                                currentData.map((person) => (
                                    <Card key={person.id} className="p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-[#D61D1F]/20 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <Link to={`/dashboard/profile/${person.id}`} className="relative block">
                                                <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-background group-hover:ring-[#D61D1F]/20 transition-all" />
                                                {person.type === 'studio' && (
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center p-0.5">
                                                        <div className="w-full h-full bg-[#74A5BE]/15 rounded-full flex items-center justify-center">
                                                            <Buildings className="w-2.5 h-2.5 text-[#74A5BE]" weight="fill" />
                                                        </div>
                                                    </div>
                                                )}
                                            </Link>
                                            <div className="flex-1">
                                                <Link to={`/dashboard/profile/${person.id}`} className="hover:underline decoration-[#D61D1F]/30">
                                                    <h4 className="text-[14px] font-semibold text-foreground group-hover:text-[#D61D1F] transition-colors">{person.name}</h4>
                                                </Link>
                                                <p className="text-[12px] text-muted-foreground">{person.role}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {activeTab === 'requests' ? (
                                                    <>
                                                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-green-500/20 text-green-500 hover:bg-green-500/10 hover:text-green-600" onClick={() => handleAcceptRequest(person.id)}>
                                                            <Check className="w-4 h-4" weight="bold" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500" onClick={() => handleIgnoreRequest(person.id)}>
                                                            <Plus className="w-4 h-4 rotate-45" weight="bold" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link to={`/chat?contact=${person.id}&type=${person.type}`}>
                                                            <Button size="sm" variant="outline" className="h-8 rounded-full text-[12px] hover:text-[#D61D1F] hover:border-[#D61D1F]/30 hover:bg-[#D61D1F]/5">Message</Button>
                                                        </Link>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:text-[#D61D1F] hover:bg-[#D61D1F]/10"><DotsThree className="w-5 h-5" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                                                                    Remove Connection
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="cursor-pointer">
                                                                    Block
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="cursor-pointer">
                                                                    Report
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>No {activeTab} found.</p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Sidebar - 25% */}
                    <div className="w-72 flex-shrink-0 space-y-4 hidden xl:block">
                        {/* Quick Actions - Desktop Sidebar */}
                        <Card className="p-5 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-[#D61D1F]/20 transition-all">
                            <h3 className="text-[14px] font-semibold text-foreground mb-4">Quick Actions</h3>
                            <NetworkQuickActions role={role} className="grid-cols-1" />
                        </Card>

                        <RightSidebarWidget role={role} />
                        {/* Additional Promo Widget */}
                        <Card className="p-5 rounded-3xl bg-gradient-to-br from-[#D61D1F]/5 to-transparent border border-[#D61D1F]/10 hover:border-[#D61D1F]/30 transition-all">
                            <h3 className="text-[15px] font-bold text-foreground mb-2">Premium Network</h3>
                            <p className="text-[12px] text-muted-foreground mb-4">Unlock direct messaging with top tier studios and casting directors.</p>
                            <Button size="sm" className="w-full rounded-full bg-[#D61D1F] hover:bg-[#D61D1F]/90 text-white shadow-lg shadow-[#D61D1F]/20">Upgrade Now</Button>
                        </Card>
                    </div>

                </div>
            </div>

            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent className="max-h-[85vh] w-full md:w-[60%] mx-auto rounded-t-[32px] border-border/40 bg-background/95 backdrop-blur-xl">
                    <div className="mx-auto w-full max-w-4xl">
                        <DrawerHeader className="relative px-8 pt-8">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-20 h-20 rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/40 flex items-center justify-center text-[#D61D1F]">
                                        <FilmStrip className="w-10 h-10" weight="duotone" />
                                    </div>
                                    <div className="text-left space-y-1.5">
                                        <DrawerTitle className="text-3xl font-bold tracking-tight">{selectedCastingCall?.title}</DrawerTitle>
                                        <DrawerDescription className="text-base font-medium flex items-center gap-2">
                                            <span className="text-foreground">{selectedCastingCall?.studio}</span>
                                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                                            <span>{selectedCastingCall?.type}</span>
                                        </DrawerDescription>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#D61D1F] bg-[#D61D1F]/5 px-3 py-1.5 rounded-full border border-[#D61D1F]/10">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#D61D1F] animate-pulse" />
                                        {selectedCastingCall?.deadline}
                                    </span>
                                </div>
                            </div>
                        </DrawerHeader>

                        <div className="px-8 pb-8 space-y-8 overflow-y-auto max-h-[calc(85vh-200px)]">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-4 rounded-2xl bg-card/40 border border-border/40 flex flex-col gap-2 hover:bg-card/60 transition-colors">
                                    <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Location</span>
                                    <span className="text-[15px] font-semibold">Los Angeles, CA</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-card/40 border border-border/40 flex flex-col gap-2 hover:bg-card/60 transition-colors">
                                    <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Rate</span>
                                    <span className="text-[15px] font-semibold text-[#D61D1F]">$2,500 / week</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-card/40 border border-border/40 flex flex-col gap-2 hover:bg-card/60 transition-colors">
                                    <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Gender</span>
                                    <span className="text-[15px] font-semibold">Any</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-card/40 border border-border/40 flex flex-col gap-2 hover:bg-card/60 transition-colors">
                                    <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Age Range</span>
                                    <span className="text-[15px] font-semibold">25 - 35</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[16px] font-bold tracking-tight">Role Description</h4>
                                <p className="text-[15px] text-muted-foreground leading-relaxed">
                                    We are looking for a talented individual to join our upcoming production.
                                    Expected to demonstrate strong acting skills and ability to take direction well.
                                    Prior experience in {selectedCastingCall?.type} is a plus but not mandatory.
                                    <br /><br />
                                    The role requires comprehensive understanding of scene study and character development.
                                    Candidates should be prepared for a physically demanding shoot schedule.
                                </p>
                            </div>
                        </div>

                        <DrawerFooter className="px-8 pb-8 pt-0">
                            <div className="flex gap-4">
                                <Button className="flex-1 bg-[#D61D1F] hover:bg-[#D61D1F]/90 text-white h-14 rounded-2xl text-[16px] font-semibold transition-all hover:scale-[1.02]" onClick={() => {
                                    toast.success("Application started!");
                                    setIsDrawerOpen(false);
                                }}>
                                    Apply Now
                                </Button>
                                <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-border/40 bg-card/50 hover:bg-[#D61D1F]/5 hover:text-[#D61D1F] hover:border-[#D61D1F]/20 transition-all" onClick={() => toast.success("Saved to watchlist")}>
                                    <BookmarkSimple className="w-6 h-6" weight="duotone" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-border/40 bg-card/50 hover:bg-[#D61D1F]/5 hover:text-[#D61D1F] hover:border-[#D61D1F]/20 transition-all" onClick={() => toast.success("Link copied to clipboard")}>
                                    <ShareNetwork className="w-6 h-6" weight="duotone" />
                                </Button>
                            </div>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </DashboardLayout>
    );
}
