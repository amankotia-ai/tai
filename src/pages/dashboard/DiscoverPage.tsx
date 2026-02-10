import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    MagnifyingGlass,
    Funnel,
    UserCircle,
    Buildings,
    Briefcase,
    FilmStrip,
    ArrowRight,
    CaretRight,
    Star,
    MapPin,
    ShieldCheck,
    CheckCircle,
    CurrencyDollar,
    ChatCircleDots,
    Globe,
    EnvelopeSimple,
    Phone,
    CalendarBlank,
    Money,
    UserPlus,
    BookmarkSimple,
    WarningCircle
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockActors, mockStudios, mockAgencies, mockCastingCalls, Actor, Studio, Agency, CastingCall, storage } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

type ClearanceStatus = 'pre-cleared' | 'conditional' | 'restricted';

interface DiscoveryMeta {
    clearance: ClearanceStatus;
    ageRange: string;
    gender: string;
    accent: string;
    location: string;
    geography: string;
    permissions: string[];
}

const DISCOVERY_META: Record<string, DiscoveryMeta> = {
    'actor-1': {
        clearance: 'pre-cleared',
        ageRange: '25-34',
        gender: 'Female',
        accent: 'Neutral English',
        location: 'Mumbai',
        geography: 'India',
        permissions: ['Games', 'TV/Film', 'Dubbing'],
    },
    'actor-2': {
        clearance: 'conditional',
        ageRange: '35-44',
        gender: 'Male',
        accent: 'Hindi',
        location: 'Hyderabad',
        geography: 'APAC',
        permissions: ['Games', 'Ads'],
    },
    'actor-3': {
        clearance: 'pre-cleared',
        ageRange: '25-34',
        gender: 'Female',
        accent: 'Tamil English',
        location: 'Bangalore',
        geography: 'Worldwide',
        permissions: ['TV/Film', 'Social', 'Ads'],
    },
    'actor-4': {
        clearance: 'restricted',
        ageRange: '45-54',
        gender: 'Male',
        accent: 'Hindi English',
        location: 'Delhi',
        geography: 'Europe',
        permissions: ['Dubbing'],
    },
};

const CASTING_LISTS = ['Q2 Voice Leads', 'Sci-Fi Roster', 'Regional Campaign', 'Priority Talent'] as const;

// --- Components ---

function SectionHeader({ title, icon: Icon, action }: { title: string, icon: any, action?: { label: string, onClick: () => void } }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground">
                    <Icon className="w-4 h-4" weight="duotone" />
                </div>
                <h2 className="text-[18px] font-bold text-foreground">{title}</h2>
            </div>
            {action && (
                <Button variant="ghost" size="sm" className="h-8 text-[13px] gap-1 text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={action.onClick}>
                    {action.label} <ArrowRight className="w-3 h-3" />
                </Button>
            )}
        </div>
    );
}

function PersonModalContent({ person }: { person: Actor }) {
    return (
        <div className="flex flex-col gap-6">
            {/* Header Profile Section */}
            <div className="flex flex-col items-center text-center -mt-2">
                <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center text-muted-foreground/50 ring-8 ring-background mb-4">
                    {person.avatar ? (
                        <img src={person.avatar} alt={person.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <UserCircle className="w-16 h-16" />
                    )}
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                    {person.name}
                    {person.verified && <CheckCircle className="w-5 h-5 text-blue-500" weight="fill" />}
                </h2>
                <p className="text-muted-foreground font-medium">{person.specialty}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground/80 bg-muted/30 px-3 py-1 rounded-full border border-border/40">
                    <MapPin className="w-4 h-4" />
                    <span>{person.location}</span>
                </div>
            </div>

            {/* Stats / Quick Info */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 p-3 rounded-2xl border border-border/40 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                        <Star className="w-4 h-4" weight="fill" />
                        <span className="font-bold text-foreground text-lg">{person.rating}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Rating</span>
                </div>
                <div className="bg-muted/30 p-3 rounded-2xl border border-border/40 flex flex-col items-center justify-center text-center">
                    <span className="font-bold text-foreground text-lg mb-0.5">{person.rateRange.split(' ')[0]}</span>
                    <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Start Rate</span>
                </div>
            </div>

            {/* About / Bio */}
            <div>
                <h4 className="text-sm font-bold text-foreground mb-2">About</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{person.bio}</p>
            </div>

            {/* Skills */}
            <div>
                <h4 className="text-sm font-bold text-foreground mb-2">Skills & Attributes</h4>
                <div className="flex flex-wrap gap-2">
                    {person.skills.map(skill => (
                        <span key={skill} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground border border-border/40">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
                <Button className="flex-1 h-12 rounded-xl text-[14px] font-semibold shadow-lg shadow-primary/20">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Connect
                </Button>
                <Button variant="outline" className="h-12 w-12 rounded-xl border-border/40 bg-transparent hover:bg-muted/50 p-0 flex items-center justify-center">
                    <BookmarkSimple className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Link to={`/dashboard/actor/${person.id}`} className="flex-1">
                    <Button variant="outline" className="w-full h-12 rounded-xl text-[14px] font-semibold border-border/40 bg-transparent hover:bg-muted/50">
                        View Profile
                    </Button>
                </Link>
            </div>
        </div>
    );
}

function PersonCard({ person }: { person: Actor }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="relative p-6 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-foreground/10 transition-all duration-300 group h-full flex flex-col items-center text-center hover:-translate-y-1 cursor-pointer">
                    {/* Avatar - Large & Centered */}
                    <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-4 ring-background border border-border/20 group-hover:border-foreground/10 transition-all">
                        {/* Placeholder for now if no avatar, using the mock store usually has avatars or we fallback */}
                        {person.avatar ? (
                            <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground/50">
                                <UserCircle className="w-12 h-12" />
                            </div>
                        )}
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
                        {person.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-muted/30 text-muted-foreground border border-border/30">
                                {skill}
                            </span>
                        ))}
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <PersonModalContent person={person} />
            </DialogContent>
        </Dialog>
    );
}



function CastingCallModalContent({ call }: { call: CastingCall }) {
    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1 -mt-2">
                <div className="flex items-center justify-between">
                    <div className="text-[12px] font-medium px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground border border-border/40 inline-block w-max">
                        {call.role}
                    </div>
                    <div className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 inline-block w-max">
                        Deadline: {call.deadline}
                    </div>
                </div>
                <h2 className="text-xl font-bold text-foreground mt-2">{call.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Buildings className="w-4 h-4" />
                    <span>{call.studio}</span>
                </div>
            </div>

            {/* Description */}
            <div className="bg-muted/20 p-4 rounded-xl border border-border/30">
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    <FilmStrip className="w-4 h-4 text-primary" />
                    Role Description
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{call.description}</p>
            </div>

            {/* Requirements */}
            <div>
                <h4 className="text-sm font-bold text-foreground mb-2">Requirements</h4>
                <div className="flex flex-col gap-2">
                    {call.requirements.map(req => (
                        <div key={req} className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-secondary/50 border border-border/20">
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" weight="fill" />
                            <span>{req}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Budget Info */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                        <Money className="w-5 h-5" weight="duotone" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-green-600 uppercase tracking-wide">Budget / Rate</span>
                        <span className="text-sm font-bold text-foreground">{call.budget}</span>
                    </div>
                </div>
            </div>

            {/* Action */}
            <Button className="w-full h-12 rounded-xl text-[14px] font-semibold shadow-lg shadow-primary/20 mt-2">
                Apply for Role
            </Button>
        </div>
    )
}

function CastingCallCard({ call }: { call: CastingCall }) {
    return (
        <Link to={`/dashboard/casting-calls/${call.id}`}>
            <Card className="p-4 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-foreground/10 transition-all duration-300 group cursor-pointer hover:bg-muted/30">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground">
                            <FilmStrip className="w-5 h-5" weight="duotone" />
                        </div>
                        <div>
                            <h3 className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{call.title}</h3>
                            <p className="text-[12px] text-muted-foreground">{call.studio} • {call.role}</p>
                        </div>
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full border border-border/50">
                        {call.deadline}
                    </span>
                </div>
                <p className="text-[12px] text-muted-foreground line-clamp-2 mb-3">
                    {call.description}
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium px-2 py-1 rounded-lg bg-muted text-muted-foreground">
                        {/* Mock doesn't have location, adding fallback or removing */}
                        Los Angeles, CA
                    </span>
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20" title="Paid Project">
                        <CurrencyDollar className="w-3.5 h-3.5 text-green-600" weight="bold" />
                    </div>
                </div>
            </Card>
        </Link>
    )
}

function OrganizationModalContent({ org, type }: { org: Studio | Agency, type: 'studio' | 'agency' }) {
    const Icon = type === 'studio' ? Buildings : Briefcase;
    const colorClass = type === 'studio' ? 'text-blue-600' : 'text-purple-600';
    const bgClass = type === 'studio' ? 'bg-blue-500/10' : 'bg-purple-500/10';
    const statsLabel = type === 'studio' ? 'Projects' : 'Artists';
    const statsValue = type === 'studio' ? (org as Studio).projectCount : (org as Agency).rosterSize;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col items-center text-center pt-2">
                <div className={cn("w-24 h-24 rounded-2xl flex items-center justify-center mb-4 ring-8 ring-background", bgClass, colorClass)}>
                    <Icon className="w-12 h-12" weight="fill" />
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                    {org.name}
                    {org.verified && <ShieldCheck className="w-5 h-5 text-green-500" weight="fill" />}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/40">
                        {type === 'agency' ? 'Talent Agency' : 'Production Studio'}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground/80">
                    <MapPin className="w-4 h-4" />
                    <span>{org.location}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 p-3 rounded-2xl border border-border/40 flex flex-col items-center justify-center text-center">
                    <span className="font-bold text-foreground text-lg mb-0.5">{statsValue}</span>
                    <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{statsLabel}</span>
                </div>
                <div className="bg-muted/30 p-3 rounded-2xl border border-border/40 flex flex-col items-center justify-center text-center">
                    <span className="font-bold text-foreground text-lg mb-0.5">Active</span>
                    <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Status</span>
                </div>
            </div>

            {/* Description */}
            <div>
                <h4 className="text-sm font-bold text-foreground mb-2">About</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{org.description}</p>
            </div>

            {/* Specialties if Agency */}
            {type === 'agency' && (org as Agency).specialties && (
                <div>
                    <h4 className="text-sm font-bold text-foreground mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                        {(org as Agency).specialties.map(spec => (
                            <span key={spec} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground border border-border/40">
                                {spec}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-2">
                <Button className="h-12 rounded-xl text-[14px] font-semibold shadow-lg shadow-primary/20 col-span-2">
                    <EnvelopeSimple className="w-5 h-5 mr-2" />
                    Contact {type === 'agency' ? 'Agency' : 'Studio'}
                </Button>
                <Button variant="outline" className="h-11 rounded-xl text-[13px] font-medium border-border/40 hover:bg-muted/50">
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                </Button>
                <Link to={`/dashboard/${type}/${org.id}`}>
                    <Button variant="outline" className="w-full h-11 rounded-xl text-[13px] font-medium border-border/40 hover:bg-muted/50">
                        View Profile
                    </Button>
                </Link>
            </div>
        </div>
    )
}

function OrganizationCard({ org, type }: { org: Studio | Agency, type: 'studio' | 'agency' }) {
    const Icon = type === 'studio' ? Buildings : Briefcase;
    const colorClass = type === 'studio' ? 'text-blue-600' : 'text-purple-600';
    const bgClass = type === 'studio' ? 'bg-blue-500/10' : 'bg-purple-500/10';

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="p-5 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-foreground/10 transition-all duration-300 group h-full cursor-pointer hover:bg-muted/30">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", bgClass, colorClass)}>
                            <Icon className="w-6 h-6" weight="fill" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors">{org.name}</h3>
                            <p className="text-[12px] text-muted-foreground">{type === 'agency' ? 'Talent Agency' : 'Production Studio'}</p>
                        </div>
                    </div>
                    <p className="text-[13px] text-muted-foreground line-clamp-2 mb-4 h-10">{org.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                        <span className="text-[12px] font-medium text-muted-foreground">
                            {type === 'studio' ? `${(org as Studio).projectCount} Projects` : `${(org as Agency).rosterSize} Artists`}
                        </span>
                        <CaretRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <OrganizationModalContent org={org} type={type} />
            </DialogContent>
        </Dialog>
    )
}

function DiscoveryResultCard({
    actor,
    meta,
    matchScore,
    onBookmark,
}: {
    actor: Actor;
    meta: DiscoveryMeta;
    matchScore: number;
    onBookmark: (actor: Actor) => void;
}) {
    return (
        <Card className="rounded-2xl border border-[#ECECEC] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-muted overflow-hidden">
                        {actor.avatar ? (
                            <img src={actor.avatar} alt={actor.name} className="size-full object-cover" />
                        ) : (
                            <div className="size-full flex items-center justify-center text-muted-foreground">
                                <UserCircle className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-[14px] font-semibold text-foreground">{actor.name}</p>
                        <p className="text-[11px] text-muted-foreground">{actor.specialty}</p>
                    </div>
                </div>
                <div className="rounded-lg bg-[#EDF3FF] px-2.5 py-1 text-[11px] font-semibold text-[#0052FF]">
                    Match {matchScore}%
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
                <span className={cn(
                    'rounded-full px-2 py-1 text-[10px] font-medium',
                    meta.clearance === 'pre-cleared'
                        ? 'bg-emerald-500/10 text-emerald-700'
                        : meta.clearance === 'conditional'
                            ? 'bg-amber-500/10 text-amber-700'
                            : 'bg-destructive/10 text-destructive',
                )}>
                    {meta.clearance}
                </span>
                <span className="rounded-full bg-muted px-2 py-1 text-[10px] text-muted-foreground">{meta.ageRange}</span>
                <span className="rounded-full bg-muted px-2 py-1 text-[10px] text-muted-foreground">{meta.gender}</span>
                <span className="rounded-full bg-muted px-2 py-1 text-[10px] text-muted-foreground">{meta.accent}</span>
                <span className="rounded-full bg-muted px-2 py-1 text-[10px] text-muted-foreground">{meta.location}</span>
            </div>

            <div className="mt-3 rounded-xl border border-[#ECECEC] bg-[#FAFAFA] p-2">
                <p className="text-[10px] font-medium text-muted-foreground">Consent summary</p>
                <p className="text-[11px] text-foreground">Allowed: {meta.permissions.join(', ')} • Geo: {meta.geography}</p>
            </div>

            <div className="mt-3 flex gap-2">
                <Button className="h-8 flex-1 rounded-lg text-[11px]" asChild>
                    <Link to={`/dashboard/actor/${actor.id}`}>View Profile</Link>
                </Button>
                <Button variant="outline" className="h-8 rounded-lg text-[11px]" onClick={() => onBookmark(actor)}>
                    <BookmarkSimple className="mr-1.5 h-3.5 w-3.5" />
                    Save to List
                </Button>
            </div>
        </Card>
    );
}

function DiscoverLoadingState() {
    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="rounded-2xl border border-[#ECECEC] bg-white p-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-28" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <div className="mt-3 space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-4/5" />
                    </div>
                </Card>
            ))}
        </div>
    );
}


export default function DiscoverPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get('tab') || 'all';
    const user = storage.getUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [queryMode, setQueryMode] = useState<'keyword' | 'nlp'>('keyword');
    const [clearanceFilter, setClearanceFilter] = useState<ClearanceStatus | 'all'>('all');
    const [ageFilter, setAgeFilter] = useState('all');
    const [genderFilter, setGenderFilter] = useState('all');
    const [accentFilter, setAccentFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [geographyFilter, setGeographyFilter] = useState('all');
    const [useCaseFilter, setUseCaseFilter] = useState('all');
    const [searchState, setSearchState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [nlpConfidence, setNlpConfidence] = useState<number | null>(null);
    const [bookmarkTarget, setBookmarkTarget] = useState<Actor | null>(null);
    const [selectedCastingList, setSelectedCastingList] = useState<string>(CASTING_LISTS[0]);
    const [savedCastingLists, setSavedCastingLists] = useState<Record<string, string[]>>({});

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const isLegalFacetBlocked = user?.role === 'actor';

    useEffect(() => {
        setSearchState('loading');

        const timer = window.setTimeout(() => {
            if (normalizedQuery.includes('error')) {
                setSearchState('error');
                return;
            }
            setSearchState('success');
            if (queryMode === 'nlp' && normalizedQuery) {
                const confidenceBase = Math.min(95, 65 + normalizedQuery.length * 2);
                setNlpConfidence(confidenceBase);
            } else {
                setNlpConfidence(null);
            }
        }, 450);

        return () => window.clearTimeout(timer);
    }, [
        normalizedQuery,
        queryMode,
        clearanceFilter,
        ageFilter,
        genderFilter,
        accentFilter,
        locationFilter,
        geographyFilter,
        useCaseFilter,
    ]);

    const scoredResults = mockActors
        .map((actor) => {
            const meta = DISCOVERY_META[actor.id];
            const searchableContent = `${actor.name} ${actor.specialty} ${actor.skills.join(' ')} ${meta.permissions.join(' ')} ${meta.location} ${meta.accent}`.toLowerCase();
            const keywordMatch = normalizedQuery ? searchableContent.includes(normalizedQuery) : true;
            if (!keywordMatch) return null;

            if (clearanceFilter !== 'all' && meta.clearance !== clearanceFilter) return null;
            if (ageFilter !== 'all' && meta.ageRange !== ageFilter) return null;
            if (genderFilter !== 'all' && meta.gender !== genderFilter) return null;
            if (accentFilter !== 'all' && meta.accent !== accentFilter) return null;
            if (locationFilter !== 'all' && meta.location !== locationFilter) return null;
            if (geographyFilter !== 'all' && meta.geography !== geographyFilter) return null;
            if (useCaseFilter !== 'all' && !meta.permissions.includes(useCaseFilter)) return null;

            let score = 52 + Math.round(actor.rating * 9);
            if (meta.clearance === 'pre-cleared') score += 9;
            if (useCaseFilter !== 'all' && meta.permissions.includes(useCaseFilter)) score += 7;
            if (normalizedQuery && searchableContent.includes(normalizedQuery)) score += 10;

            return {
                actor,
                meta,
                matchScore: Math.min(99, score),
            };
        })
        .filter((item): item is { actor: Actor; meta: DiscoveryMeta; matchScore: number } => !!item)
        .sort((a, b) => b.matchScore - a.matchScore);

    const handleTabChange = (value: string) => {
        setSearchParams({ tab: value });
    };

    const handleBookmarkActor = (actor: Actor) => {
        setBookmarkTarget(actor);
        setSelectedCastingList(CASTING_LISTS[0]);
    };

    const handleSaveBookmark = () => {
        if (!bookmarkTarget) return;
        setSavedCastingLists((currentLists) => {
            const currentActors = currentLists[selectedCastingList] || [];
            if (currentActors.includes(bookmarkTarget.id)) {
                return currentLists;
            }
            return {
                ...currentLists,
                [selectedCastingList]: [...currentActors, bookmarkTarget.id],
            };
        });
        toast.success(`${bookmarkTarget.name} added to ${selectedCastingList}`);
        setBookmarkTarget(null);
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-[16px] font-semibold text-foreground">Pre-cleared Talent Search</h2>
                                <p className="text-[12px] text-muted-foreground">
                                    Use keyword or natural language mode to match talent by consent scope, geography, and demographics.
                                </p>
                            </div>
                            <div className="flex items-center rounded-xl border border-[#ECECEC] bg-[#FAFAFA] p-1">
                                <Button
                                    size="sm"
                                    className={cn(
                                        'h-8 rounded-lg text-[11px]',
                                        queryMode === 'keyword' ? 'bg-[#0052FF] text-white hover:bg-[#0046DB]' : 'bg-transparent text-muted-foreground hover:bg-white',
                                    )}
                                    onClick={() => setQueryMode('keyword')}
                                >
                                    Keyword
                                </Button>
                                <Button
                                    size="sm"
                                    className={cn(
                                        'h-8 rounded-lg text-[11px]',
                                        queryMode === 'nlp' ? 'bg-[#0052FF] text-white hover:bg-[#0046DB]' : 'bg-transparent text-muted-foreground hover:bg-white',
                                    )}
                                    onClick={() => setQueryMode('nlp')}
                                >
                                    NLP Query
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder={queryMode === 'nlp' ? 'Try: South Asian female voice actor cleared for games in APAC' : 'Search by name, skill, location, or use case'}
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="h-11 rounded-xl border-[#ECECEC] bg-[#FAFAFA] pl-9 text-[13px]"
                            />
                        </div>

                        {queryMode === 'nlp' && (
                            <div className="rounded-xl border border-[#E7ECFB] bg-[#F5F8FF] p-3">
                                <p className="text-[11px] text-[#244275]">
                                    Confidence explanation: model confidence is based on consent-rule match, profile depth, and recent activity.
                                </p>
                                <p className="mt-1 text-[11px] font-medium text-[#0052FF]">
                                    {nlpConfidence ? `Current confidence: ${nlpConfidence}%` : 'Run a query to generate confidence scoring.'}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-8">
                            <select className="h-9 rounded-lg border border-[#ECECEC] bg-white px-2 text-[11px]" value={clearanceFilter} onChange={(event) => setClearanceFilter(event.target.value as ClearanceStatus | 'all')}>
                                <option value="all">Clearance</option>
                                <option value="pre-cleared">Pre-cleared</option>
                                <option value="conditional">Conditional</option>
                                <option value="restricted">Restricted</option>
                            </select>
                            <select className="h-9 rounded-lg border border-[#ECECEC] bg-white px-2 text-[11px]" value={ageFilter} onChange={(event) => setAgeFilter(event.target.value)}>
                                <option value="all">Age Range</option>
                                <option value="25-34">25-34</option>
                                <option value="35-44">35-44</option>
                                <option value="45-54">45-54</option>
                            </select>
                            <select className="h-9 rounded-lg border border-[#ECECEC] bg-white px-2 text-[11px]" value={genderFilter} onChange={(event) => setGenderFilter(event.target.value)}>
                                <option value="all">Gender</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                            </select>
                            <select className="h-9 rounded-lg border border-[#ECECEC] bg-white px-2 text-[11px]" value={accentFilter} onChange={(event) => setAccentFilter(event.target.value)}>
                                <option value="all">Accent</option>
                                <option value="Neutral English">Neutral English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Tamil English">Tamil English</option>
                                <option value="Hindi English">Hindi English</option>
                            </select>
                            <select className="h-9 rounded-lg border border-[#ECECEC] bg-white px-2 text-[11px]" value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
                                <option value="all">Location</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Delhi">Delhi</option>
                            </select>
                            <select className="h-9 rounded-lg border border-[#ECECEC] bg-white px-2 text-[11px]" value={geographyFilter} onChange={(event) => setGeographyFilter(event.target.value)}>
                                <option value="all">Geography</option>
                                <option value="India">India</option>
                                <option value="APAC">APAC</option>
                                <option value="Europe">Europe</option>
                                <option value="Worldwide">Worldwide</option>
                            </select>
                            <select
                                className={cn(
                                    'h-9 rounded-lg border border-[#ECECEC] bg-white px-2 text-[11px]',
                                    isLegalFacetBlocked && 'opacity-70',
                                )}
                                value={useCaseFilter}
                                onChange={(event) => setUseCaseFilter(event.target.value)}
                                disabled={isLegalFacetBlocked}
                            >
                                <option value="all">Use Case</option>
                                <option value="Games">Games</option>
                                <option value="TV/Film">TV/Film</option>
                                <option value="Social">Social</option>
                                <option value="Political">Political</option>
                                <option value="Dubbing">Dubbing</option>
                                <option value="Ads">Ads</option>
                            </select>
                            <Button
                                variant="outline"
                                className="h-9 rounded-lg border-[#ECECEC] text-[11px]"
                                onClick={() => {
                                    setClearanceFilter('all');
                                    setAgeFilter('all');
                                    setGenderFilter('all');
                                    setAccentFilter('all');
                                    setLocationFilter('all');
                                    setGeographyFilter('all');
                                    setUseCaseFilter('all');
                                }}
                            >
                                Reset
                            </Button>
                        </div>

                        {isLegalFacetBlocked && (
                            <div className="flex items-start gap-2 rounded-xl border border-[#F6DDB0] bg-[#FFF8EA] p-3 text-[11px] text-[#8A5A00]">
                                <WarningCircle className="mt-0.5 h-3.5 w-3.5" weight="fill" />
                                Use-case legal filters are studio-only. Switch to a studio account for permission-level facets.
                            </div>
                        )}

                        {searchState === 'loading' && <DiscoverLoadingState />}

                        {searchState === 'error' && (
                            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                                <p className="text-[12px] text-destructive">Search failed. Retry by adjusting your query or filters.</p>
                            </div>
                        )}

                        {searchState === 'success' && scoredResults.length === 0 && (
                            <div className="rounded-xl border border-dashed border-[#ECECEC] bg-[#FAFAFA] p-6 text-center">
                                <p className="text-[13px] font-medium text-foreground">No matching talent found</p>
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                    Try broadening clearance/geography filters or use NLP mode with a looser query.
                                </p>
                            </div>
                        )}

                        {searchState === 'success' && scoredResults.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[12px] text-muted-foreground">{scoredResults.length} compliance-matched results</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {CASTING_LISTS.map((list) => `${list}: ${(savedCastingLists[list] || []).length}`).join(' • ')}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {scoredResults.map((result) => (
                                        <DiscoveryResultCard
                                            key={result.actor.id}
                                            actor={result.actor}
                                            meta={result.meta}
                                            matchScore={result.matchScore}
                                            onBookmark={handleBookmarkActor}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-12 bg-card/50 backdrop-blur-sm border-border/40 hover:border-foreground/20 focus:border-primary transition-all rounded-2xl text-[14px]"
                        />
                    </div>
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-border/40 bg-card/50 hover:bg-muted/50 hover:text-foreground transition-all font-medium">
                        <Funnel className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                </div>

                {/* Custom Tabs */}
                <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-8">
                    <TabsList className="bg-transparent p-0 h-auto gap-6 border-b border-border/40 w-full justify-start rounded-none px-1">
                        {['All', 'People', 'Casting Calls', 'Agencies', 'Studios'].map((tab) => {
                            const value = tab.toLowerCase().replace(' ', '-');
                            const isActive = currentTab === value;
                            return (
                                <TabsTrigger
                                    key={value}
                                    value={value}
                                    className={cn(
                                        "px-0 py-3 bg-transparent text-[14px] font-medium text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-[#D61D1F] data-[state=active]:shadow-none relative rounded-none transition-all hover:text-foreground",
                                        isActive && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#D61D1F] after:rounded-full"
                                    )}
                                >
                                    {tab}
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>

                    {/* All View */}
                    <TabsContent value="all" className="space-y-10 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                        {/* Featured Casting Calls - Horizontal Scroll or Grid */}
                        <div className="space-y-4">
                            <SectionHeader
                                title="Recent Casting Calls"
                                icon={FilmStrip}
                                action={{ label: 'View all', onClick: () => handleTabChange('casting-calls') }}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {mockCastingCalls.slice(0, 3).map(call => (
                                    <CastingCallCard key={call.id} call={call} />
                                ))}
                            </div>
                        </div>

                        {/* Featured People */}
                        <div className="space-y-4">
                            <SectionHeader
                                title="Suggested People"
                                icon={UserCircle}
                                action={{ label: 'View all', onClick: () => handleTabChange('people') }}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {mockActors.slice(0, 4).map(actor => (
                                    <PersonCard key={actor.id} person={actor} />
                                ))}
                            </div>
                        </div>

                        {/* Industry Partners (Studios + Agencies mixed) */}
                        <div className="space-y-4">
                            <SectionHeader
                                title="Industry Partners"
                                icon={Buildings}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {mockStudios.slice(0, 2).map(studio => (
                                    <OrganizationCard key={studio.id} org={studio} type="studio" />
                                ))}
                                {mockAgencies.slice(0, 1).map(agency => (
                                    <OrganizationCard key={agency.id} org={agency} type="agency" />
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* People View */}
                    <TabsContent value="people" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {mockActors.map(actor => (
                                <PersonCard key={actor.id} person={actor} />
                            ))}
                        </div>
                    </TabsContent>

                    {/* Casting Calls View */}
                    <TabsContent value="casting-calls" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mockCastingCalls.map(call => (
                                <CastingCallCard key={call.id} call={call} />
                            ))}
                        </div>
                    </TabsContent>

                    {/* Agencies View */}
                    <TabsContent value="agencies" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mockAgencies.map(agency => (
                                <OrganizationCard key={agency.id} org={agency} type="agency" />
                            ))}
                        </div>
                    </TabsContent>

                    {/* Studios View */}
                    <TabsContent value="studios" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mockStudios.map(studio => (
                                <OrganizationCard key={studio.id} org={studio} type="studio" />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                <Dialog open={!!bookmarkTarget} onOpenChange={(open) => { if (!open) setBookmarkTarget(null); }}>
                    <DialogContent className="sm:max-w-[420px] rounded-3xl border border-[#ECECEC] bg-[#F9F9F9]">
                        <DialogHeader>
                            <DialogTitle>Add To Casting List</DialogTitle>
                            <DialogDescription>
                                Save {bookmarkTarget?.name || 'actor'} to a named casting list.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 pt-2">
                            <select
                                className="h-10 w-full rounded-xl border border-[#ECECEC] bg-white px-3 text-[12px]"
                                value={selectedCastingList}
                                onChange={(event) => setSelectedCastingList(event.target.value)}
                            >
                                {CASTING_LISTS.map((listName) => (
                                    <option key={listName} value={listName}>
                                        {listName}
                                    </option>
                                ))}
                            </select>
                            <div className="rounded-xl border border-[#ECECEC] bg-white p-3 text-[11px] text-muted-foreground">
                                {selectedCastingList} currently has {(savedCastingLists[selectedCastingList] || []).length} saved actors.
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="h-9 flex-1 rounded-xl text-[12px]" onClick={() => setBookmarkTarget(null)}>
                                    Cancel
                                </Button>
                                <Button className="h-9 flex-1 rounded-xl text-[12px]" onClick={handleSaveBookmark}>
                                    Save Bookmark
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
