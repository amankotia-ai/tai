import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Buildings,
  CalendarBlank,
  ChatCircle,
  Clock,
  FileText,
  MapPin,
  MonitorPlay,
  ShieldCheck,
  Users,
} from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockCastingCalls, mockStudios } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type CollaborationState = 'idle' | 'loading' | 'success' | 'error';

interface CollaborationRequest {
  id: string;
  project: string;
  note: string;
  status: 'pending' | 'in-review' | 'accepted';
  createdAt: string;
}

interface FeaturedProject {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  imageUrl?: string;
}

const NETFLIX_FEATURED_IMAGE_URL = 'https://preview.redd.it/top-10-most-watched-indian-movies-and-series-on-netflix-v0-n3n9v92n3b7c1.jpg?width=640&format=pjpg&auto=webp&s=ed1af675d101226861d56ee86afd4061382c013b';

const DEFAULT_FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'project-1',
    title: 'Neon Horizon',
    subtitle: 'Voice casting open for bilingual leads',
    status: 'Open Operations',
  },
  {
    id: 'project-2',
    title: 'Chronicle 9',
    subtitle: 'Digital doubles approved for APAC release',
    status: 'In Production',
  },
  {
    id: 'project-3',
    title: 'Skyline Guard',
    subtitle: 'Motion capture sprint with new stunt roster',
    status: 'Open Operations',
  },
] as const;

const NETFLIX_FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'netflix-project-1',
    title: 'Gumrah',
    subtitle: 'Crime thriller catalog title with strong India viewership.',
    status: 'Featured',
    imageUrl: NETFLIX_FEATURED_IMAGE_URL,
  },
  {
    id: 'netflix-project-2',
    title: 'Delhi Crime',
    subtitle: 'Award-winning crime drama series in the Netflix India slate.',
    status: 'Featured',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN-KQqDfJlSt9AsAyNto8PcnhHHDujsM3L_Q&s',
  },
  {
    id: 'netflix-project-3',
    title: 'The Grad Story',
    subtitle: 'Campus-centered coming-of-age title in the Netflix lineup.',
    status: 'Featured',
    imageUrl: 'https://i.pinimg.com/736x/fd/0a/3d/fd0a3df645f2595af30ad31ac5a2a267.jpg',
  },
];

const TRUST_SIGNALS = [
  { label: 'Verification completion', value: 96 },
  { label: 'Contract reliability', value: 91 },
  { label: 'Payout timeliness', value: 89 },
  { label: 'Dispute resolution pace', value: 92 },
] as const;

const DATE_LABEL = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const SHOW_STUDIO_HERO = false;

const REQUEST_STATUS_TONE: Record<CollaborationRequest['status'], string> = {
  pending: 'bg-[#EDF3FF] text-[#0052FF]',
  'in-review': 'bg-amber-500/10 text-amber-700',
  accepted: 'bg-emerald-500/10 text-emerald-700',
};

function StudioLeftRail({ name, type, location, trustScore, logoUrl }: { name: string; type: string; location: string; trustScore: number; logoUrl?: string }) {
  return (
      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#F5F6F8] text-muted-foreground">
            {logoUrl ? (
              <img src={logoUrl} alt={`${name} logo`} className="size-full object-cover" loading="lazy" />
            ) : (
              <Buildings className="size-6" weight="duotone" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold text-foreground">{name}</h3>
            <p className="text-[11px] text-muted-foreground">{type}</p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-dashed divide-[#ECECEC] text-[11px] text-muted-foreground">
          <div className="flex items-center justify-between py-2">
            <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" /> Location</span>
            <span>{location}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Trust Score</span>
            <span className="font-inter-numeric tabular-nums text-foreground">{trustScore}/100</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <Link to="/dashboard/chat">
            <Button className="h-9 w-full rounded-xl bg-[#D61D1F] text-[11px] text-white hover:bg-[#D61D1F]/90">
              <ChatCircle className="mr-1.5 size-4" />
              Message Studio
            </Button>
          </Link>
          <Link to="/dashboard/search">
            <Button variant="outline" className="h-9 w-full rounded-xl border-[#ECECEC] bg-white text-[11px]">
              <MonitorPlay className="mr-1.5 size-4" />
              Open Operations
            </Button>
          </Link>
        </div>

        <div className="mt-5 border-t border-dashed border-[#ECECEC] pt-4">
          <h3 className="text-[13px] font-semibold text-foreground">Trust Breakdown</h3>
          <div className="mt-3 divide-y divide-dashed divide-[#ECECEC]">
            {TRUST_SIGNALS.map((signal) => (
              <div key={signal.label} className="flex items-center justify-between py-2 text-[11px]">
                <span className="text-muted-foreground">{signal.label}</span>
                <span className="font-inter-numeric tabular-nums text-foreground">{signal.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
  );
}

function StudioRightRail({ outboundRequests, onOpenCollaboration, onCancel }: { outboundRequests: CollaborationRequest[]; onOpenCollaboration: () => void; onCancel: (request: CollaborationRequest) => void }) {
  return (
    <>
      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-foreground">Collaboration Queue</h3>
          <Button size="sm" variant="outline" className="h-7 rounded-lg border-[#ECECEC] bg-white px-2 text-[10px]" onClick={onOpenCollaboration}>
            New
          </Button>
        </div>

        {outboundRequests.length === 0 ? (
          <p className="mt-3 text-[11px] text-muted-foreground">No requests in queue.</p>
        ) : (
          <div className="mt-3 divide-y divide-dashed divide-[#ECECEC]">
            {outboundRequests.map((request) => (
              <div key={request.id} className="py-3">
                <p className="text-[12px] font-semibold text-foreground">{request.project}</p>
                <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">{request.note || 'No note provided.'}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <Badge className={cn('text-[10px] capitalize', REQUEST_STATUS_TONE[request.status])}>{request.status}</Badge>
                  {request.status === 'pending' && (
                    <Button size="sm" variant="outline" className="h-6 rounded-lg border-[#ECECEC] bg-white px-2 text-[10px] text-destructive" onClick={() => onCancel(request)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <h3 className="text-[13px] font-semibold text-foreground">Legal Signals</h3>
        <div className="mt-3 space-y-3 text-[11px] text-muted-foreground">
          <div className="flex items-start gap-2">
            <FileText className="mt-0.5 size-4 shrink-0" />
            <span>Eligible for synthetic performance license generation.</span>
          </div>
          <div className="flex items-start gap-2">
            <CalendarBlank className="mt-0.5 size-4 shrink-0" />
            <span>Trust score refreshed weekly.</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" weight="fill" />
            <span>Business verification complete.</span>
          </div>
        </div>
      </Card>
    </>
  );
}

export default function StudioProfilePage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const studio = mockStudios.find((entry) => entry.id === id);
  const fallbackSearchPath = location.pathname.startsWith('/dashboard') ? '/dashboard/search' : '/search';
  const backToSearchPath =
    typeof location.state === 'object' &&
    location.state !== null &&
    'fromSearch' in location.state &&
    typeof (location.state as { fromSearch?: unknown }).fromSearch === 'string'
      ? (location.state as { fromSearch: string }).fromSearch
      : fallbackSearchPath;

  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [collaborationState, setCollaborationState] = useState<CollaborationState>('idle');
  const [collaborationError, setCollaborationError] = useState('');
  const [projectName, setProjectName] = useState('');
  const [collaborationNote, setCollaborationNote] = useState('');

  const [cancelCandidate, setCancelCandidate] = useState<CollaborationRequest | null>(null);
  const [outboundRequests, setOutboundRequests] = useState<CollaborationRequest[]>([
    {
      id: 'col-1',
      project: 'Fracture Line - Voice Expansion',
      note: 'Need multilingual voice roster with APAC rights.',
      status: 'in-review',
      createdAt: '2026-02-03T08:30:00.000Z',
    },
    {
      id: 'col-2',
      project: 'Shoreline Unit Casting',
      note: 'Urgent request for cleared motion performers.',
      status: 'pending',
      createdAt: '2026-02-05T09:10:00.000Z',
    },
  ]);

  const trustScore = Math.round(TRUST_SIGNALS.reduce((sum, signal) => sum + signal.value, 0) / TRUST_SIGNALS.length);
  const today = new Date().toISOString().slice(0, 10);
  const fromStudio = `${location.pathname}${location.search}`;
  const openCastingProjects = mockCastingCalls.filter((call) => call.deadline >= today).slice(0, 3);
  const featuredProjects = studio.name.toLowerCase().includes('netflix') ? NETFLIX_FEATURED_PROJECTS : DEFAULT_FEATURED_PROJECTS;

  const resetCollaborationForm = () => {
    setProjectName('');
    setCollaborationNote('');
    setCollaborationState('idle');
    setCollaborationError('');
  };

  const submitCollaboration = () => {
    if (!studio) return;
    setCollaborationError('');

    if (!projectName.trim()) {
      setCollaborationState('error');
      setCollaborationError('Project name is required.');
      return;
    }

    setCollaborationState('loading');

    window.setTimeout(() => {
      if (projectName.toLowerCase().includes('error')) {
        setCollaborationState('error');
        setCollaborationError('Studio inbox is temporarily unavailable. Retry in a moment.');
        toast.error('Unable to submit collaboration request.');
        return;
      }

      const nextRequest: CollaborationRequest = {
        id: `col-${Date.now()}`,
        project: projectName.trim(),
        note: collaborationNote.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setOutboundRequests((current) => [nextRequest, ...current]);
      setCollaborationState('success');
      toast.success(`Collaboration request sent to ${studio.name}.`);

      window.setTimeout(() => {
        setIsCollabModalOpen(false);
        resetCollaborationForm();
      }, 500);
    }, 600);
  };

  const cancelCollaboration = () => {
    if (!cancelCandidate) return;
    setOutboundRequests((current) => current.filter((request) => request.id !== cancelCandidate.id));
    toast.success(`Cancelled request: ${cancelCandidate.project}`);
    setCancelCandidate(null);
  };

  if (!studio) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-dashed border-[#ECECEC] bg-white p-8 text-center">
          <Buildings className="size-16 text-muted-foreground/60" />
          <p className="mt-3 text-[13px] text-muted-foreground">Studio not found.</p>
          <Button className="mt-4" variant="outline" onClick={() => navigate(backToSearchPath)}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Search
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout className="h-dvh overflow-hidden bg-[#F9F9F9]" fullWidth transparentNav navContentClassName="mx-auto w-[85%]">
      <div className="mx-auto h-[calc(100dvh-6.5rem)] w-[85%] space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 rounded-xl px-2 text-[12px] text-muted-foreground hover:bg-[#F5F6F8] hover:text-foreground"
          onClick={() => navigate(backToSearchPath)}
        >
          <ArrowLeft className="size-4" />
          Back to Search
        </Button>

        <div className="flex h-[calc(100%-3rem)] gap-6 overflow-hidden">
          <div className="hide-scrollbar hidden h-full w-72 flex-shrink-0 space-y-4 overflow-y-auto pb-6 lg:block">
            <StudioLeftRail name={studio.name} type={studio.type} location={studio.location} trustScore={trustScore} logoUrl={studio.logoUrl} />
          </div>

          <div className="hide-scrollbar h-full min-w-0 flex-1 overflow-y-auto pb-6 pr-1">
            <div className="space-y-4 lg:hidden">
              <StudioLeftRail name={studio.name} type={studio.type} location={studio.location} trustScore={trustScore} logoUrl={studio.logoUrl} />
              <StudioRightRail outboundRequests={outboundRequests} onOpenCollaboration={() => setIsCollabModalOpen(true)} onCancel={(request) => setCancelCandidate(request)} />
            </div>

            <div className="space-y-4 lg:mt-0">

              {SHOW_STUDIO_HERO && (
                <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-balance text-[22px] font-semibold text-foreground">{studio.name}</h1>
                        <Badge className="bg-emerald-500/10 text-[10px] text-emerald-700">
                          <ShieldCheck className="mr-1 size-3.5" weight="fill" />
                          Verified Studio
                        </Badge>
                      </div>
                      <p className="mt-1 text-[12px] text-muted-foreground">{studio.description}</p>
                      <p className="mt-2 text-[11px] text-muted-foreground">{studio.location}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:w-[280px]">
                      <Link to="/dashboard/chat">
                        <Button className="h-9 w-full rounded-xl bg-[#D61D1F] text-[11px] text-white hover:bg-[#D61D1F]/90">
                          <ChatCircle className="mr-1.5 size-4" />
                          Message
                        </Button>
                      </Link>
                      <Button variant="outline" className="h-9 rounded-xl border-[#ECECEC] bg-white text-[11px]" onClick={() => setIsCollabModalOpen(true)}>
                        <Users className="mr-1.5 size-4" />
                        Collaborate
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MonitorPlay className="size-5 text-muted-foreground" weight="duotone" />
                  <h2 className="text-[14px] font-semibold text-foreground">Featured Projects</h2>
                </div>
                <Link to="/dashboard/search">
                  <Button size="sm" variant="outline" className="h-7 rounded-lg bg-white px-2 text-[10px] hover:bg-[#F5F6F8] hover:text-foreground">View All</Button>
                </Link>
              </div>

              <div className="divide-y divide-dashed divide-[#ECECEC]">
                {featuredProjects.map((project) => (
                  <div key={project.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="h-11 w-8 shrink-0 overflow-hidden rounded-md bg-[#F3F4F6]">
                        {project.imageUrl ? (
                          <img src={project.imageUrl} alt={`${project.title} poster`} className="size-full object-cover" loading="lazy" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-foreground">{project.title}</p>
                        <p className="mt-1 text-pretty text-[11px] text-muted-foreground">{project.subtitle}</p>
                      </div>
                    </div>
                    <Badge className="bg-[#F8F9FA] text-[10px] text-muted-foreground">
                      {project.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

              <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarBlank className="size-5 text-muted-foreground" weight="duotone" />
                    <h2 className="text-[14px] font-semibold text-foreground">Open Casting Calls / Projects</h2>
                  </div>
                  <Link to="/dashboard/casting-calls" state={{ fromStudio }}>
                    <Button size="sm" variant="outline" className="h-7 rounded-lg bg-white px-2 text-[10px] hover:bg-[#F5F6F8] hover:text-foreground">View All</Button>
                  </Link>
                </div>

                {openCastingProjects.length === 0 ? (
                  <p className="mt-4 text-[12px] text-muted-foreground">No open casting calls available right now.</p>
                ) : (
                  <div className="mt-3 divide-y divide-dashed divide-[#ECECEC]">
                    {openCastingProjects.map((call) => (
                      <Link
                        key={call.id}
                        to={`/dashboard/casting-calls/${call.id}`}
                        state={{ fromStudio }}
                        className="block rounded-lg py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-foreground">{call.title}</p>
                            <p className="text-[11px] text-muted-foreground">{call.studio} • {call.role}</p>
                          </div>
                          <Badge className="bg-emerald-500/10 text-[10px] text-emerald-700">Open</Badge>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">{call.description}</p>
                        <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
                          <span className="font-medium text-foreground">{call.budget}</span>
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarBlank className="size-3.5" />
                            Deadline {DATE_LABEL.format(new Date(`${call.deadline}T00:00:00`))}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>

          <div className="hide-scrollbar hidden h-full w-72 flex-shrink-0 space-y-4 overflow-y-auto pb-6 xl:block">
            <StudioRightRail outboundRequests={outboundRequests} onOpenCollaboration={() => setIsCollabModalOpen(true)} onCancel={(request) => setCancelCandidate(request)} />
          </div>
        </div>
      </div>

      <Dialog open={isCollabModalOpen} onOpenChange={(open) => { setIsCollabModalOpen(open); if (!open) resetCollaborationForm(); }}>
        <DialogContent className="sm:max-w-[560px] rounded-3xl border border-[#ECECEC] bg-[#F9F9F9]">
          <DialogHeader>
            <DialogTitle>Request Collaboration</DialogTitle>
            <DialogDescription>Send project scope and context to the studio operations team.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="studio-project">Project Name</Label>
              <Input id="studio-project" value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="e.g. Frontier Archive Season 2" className="h-10 rounded-xl border-[#ECECEC] bg-white" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studio-note">Context</Label>
              <Textarea id="studio-note" value={collaborationNote} onChange={(event) => setCollaborationNote(event.target.value)} placeholder="Share rights scope, timelines, and talent requirements." className="min-h-[110px] rounded-xl border-[#ECECEC] bg-white" />
            </div>

            {collaborationState === 'loading' && (
              <div className="rounded-xl border border-[#ECECEC] bg-white p-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Clock className="size-4" /> Sending request to studio inbox...</span>
              </div>
            )}

            {collaborationState === 'error' && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-[11px] text-destructive">{collaborationError}</div>
            )}

            {collaborationState === 'success' && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-[11px] text-emerald-700">Collaboration request submitted and queued for review.</div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCollabModalOpen(false)} disabled={collaborationState === 'loading'}>Cancel</Button>
            <Button onClick={submitCollaboration} disabled={collaborationState === 'loading'}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!cancelCandidate} onOpenChange={(open) => !open && setCancelCandidate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel collaboration request?</AlertDialogTitle>
            <AlertDialogDescription>Cancelling removes this request from the studio intake queue.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep request</AlertDialogCancel>
            <AlertDialogAction onClick={cancelCollaboration}>Cancel request</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
