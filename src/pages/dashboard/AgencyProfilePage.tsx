import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  CalendarBlank,
  ChatCircle,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  ShieldCheck,
  Sparkle,
  Users,
  WarningCircle,
} from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
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
import { mockActors, mockAgencies, mockCastingCalls, mockStudios } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type IntroState = 'idle' | 'loading' | 'success' | 'error' | 'blocked';
type ContractsState = 'success' | 'loading' | 'empty' | 'error';

interface IntroItem {
  id: string;
  actorId: string;
  studioId: string;
  projectName: string;
  note: string;
  status: 'sent' | 'accepted' | 'completed';
  createdAt: string;
}

const WORKFLOW_STEPS = [
  { label: 'Agency verification', detail: 'Business credentials validated', state: 'done' as const },
  { label: 'Representation shortlist', detail: 'Actor + studio shortlist built', state: 'done' as const },
  { label: 'Studio intro initiated', detail: 'Negotiation active', state: 'active' as const },
  { label: 'Contract milestone tracking', detail: 'Awaiting final signatures', state: 'up-next' as const },
] as const;

const CONTRACT_THREADS = [
  { id: 'thread-1', title: 'Neon Horizon - Voice License', status: 'Pending amendment', milestone: 'Clause review' },
  { id: 'thread-2', title: 'Chronicle 9 - Digital Double', status: 'Active', milestone: 'Usage ledger sync' },
] as const;

const INTRO_STATUS_TONE: Record<IntroItem['status'], string> = {
  sent: 'border-[#DCE7FF] bg-[#EDF3FF] text-[#0052FF]',
  accepted: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700',
  completed: 'border-[#ECECEC] bg-muted text-foreground',
};

const DATE_LABEL = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function AgencyLeftRail({
  name,
  description,
  location,
  rosterSize,
  specialties,
}: {
  name: string;
  description: string;
  location: string;
  rosterSize: number;
  specialties: string[];
}) {
  return (
    <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-[#F5F6F8] text-muted-foreground">
          <Briefcase className="size-6" weight="duotone" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-foreground">{name}</h3>
          <p className="text-[11px] text-muted-foreground">Talent Agency</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-semibold text-muted-foreground">About</p>
        <p className="mt-1 text-pretty text-[11px] text-muted-foreground">{description}</p>
      </div>

      <div className="mt-4 divide-y divide-dashed divide-[#ECECEC] text-[11px] text-muted-foreground">
        <div className="flex items-center justify-between py-2">
          <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" /> Location</span>
          <span>{location}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span>Represented artists</span>
          <span className="font-inter-numeric tabular-nums text-foreground">{rosterSize}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <Link to="/dashboard/chat">
          <Button className="h-9 w-full rounded-xl bg-[#D61D1F] text-[11px] text-white hover:bg-[#D61D1F]/90">
            <ChatCircle className="mr-1.5 size-4" />
            Message Agency
          </Button>
        </Link>
        <Link to="/dashboard/contracts">
          <Button variant="outline" className="h-9 w-full rounded-xl border-[#ECECEC] bg-white text-[11px]">
            <FileText className="mr-1.5 size-4" />
            Contract Threads
          </Button>
        </Link>
      </div>

      <div className="mt-5 border-t border-dashed border-[#ECECEC] pt-4">
        <h3 className="text-[13px] font-semibold text-foreground">Specialties</h3>
        <p className="mt-2 text-[11px] text-muted-foreground">{specialties.join(' • ')}</p>
      </div>

      <div className="mt-5 border-t border-dashed border-[#ECECEC] pt-4">
        <h3 className="text-[13px] font-semibold text-foreground">Workflow Status</h3>
        <div className="mt-3 space-y-3">
          {WORKFLOW_STEPS.map((step) => (
            <div key={step.label} className="flex items-start gap-2">
              {step.state === 'done' && <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-600" weight="fill" />}
              {step.state === 'active' && <Clock className="mt-0.5 size-4 shrink-0 text-[#0052FF]" weight="fill" />}
              {step.state === 'up-next' && <Sparkle className="mt-0.5 size-4 shrink-0 text-muted-foreground" weight="fill" />}
              <div>
                <p className="text-[12px] font-medium text-foreground">{step.label}</p>
                <p className="text-[10px] text-muted-foreground">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function AgencyRightRail({ introQueue, onStartIntro, onWithdraw }: { introQueue: IntroItem[]; onStartIntro: () => void; onWithdraw: (item: IntroItem) => void }) {
  return (
    <>
      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-foreground">Intro Queue</h3>
          <Button size="sm" variant="outline" className="h-7 rounded-lg border-[#ECECEC] bg-white px-2 text-[10px]" onClick={onStartIntro}>
            New
          </Button>
        </div>

        {introQueue.length === 0 ? (
          <p className="mt-3 text-[11px] text-muted-foreground">No intros yet.</p>
        ) : (
          <div className="mt-3 divide-y divide-dashed divide-[#ECECEC]">
            {introQueue.map((item) => (
              <div key={item.id} className="py-3">
                <p className="text-[12px] font-semibold text-foreground">{item.projectName}</p>
                <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">{item.note || 'No notes added.'}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <Badge className={cn('border text-[10px] capitalize', INTRO_STATUS_TONE[item.status])}>{item.status}</Badge>
                  {item.status === 'sent' && (
                    <Button size="sm" variant="outline" className="h-6 rounded-lg border-[#ECECEC] bg-white px-2 text-[10px] text-destructive" onClick={() => onWithdraw(item)}>
                      Withdraw
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <h3 className="text-[13px] font-semibold text-foreground">Agency Signals</h3>
        <div className="mt-3 space-y-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-600" weight="fill" />
            <span>Verification badge active.</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarBlank className="size-4" />
            <span>Contract updates synced daily.</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <span>Studio-agent intros available.</span>
          </div>
        </div>
      </Card>
    </>
  );
}

export default function AgencyProfilePage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const agency = mockAgencies.find((entry) => entry.id === id);
  const fallbackSearchPath = location.pathname.startsWith('/dashboard') ? '/dashboard/search' : '/search';
  const backToSearchPath =
    typeof location.state === 'object' &&
    location.state !== null &&
    'fromSearch' in location.state &&
    typeof (location.state as { fromSearch?: unknown }).fromSearch === 'string'
      ? (location.state as { fromSearch: string }).fromSearch
      : fallbackSearchPath;

  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const [introState, setIntroState] = useState<IntroState>('idle');
  const [introError, setIntroError] = useState('');
  const [contractsState, setContractsState] = useState<ContractsState>('success');
  const [withdrawCandidate, setWithdrawCandidate] = useState<IntroItem | null>(null);

  const [selectedActorId, setSelectedActorId] = useState(mockActors[0]?.id || '');
  const [selectedStudioId, setSelectedStudioId] = useState(mockStudios[0]?.id || '');
  const [projectName, setProjectName] = useState('');
  const [introNote, setIntroNote] = useState('');

  const [introQueue, setIntroQueue] = useState<IntroItem[]>([
    {
      id: 'intro-1',
      actorId: 'actor-1',
      studioId: 'studio-1',
      projectName: 'Chronicle 9 ADR Expansion',
      note: 'Kickoff call scheduled with legal teams.',
      status: 'accepted',
      createdAt: '2026-02-04T10:15:00.000Z',
    },
    {
      id: 'intro-2',
      actorId: 'actor-3',
      studioId: 'studio-2',
      projectName: 'Vocal Localization Rollout',
      note: 'Need APAC + Europe rights confirmation.',
      status: 'sent',
      createdAt: '2026-02-05T11:20:00.000Z',
    },
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const fromAgency = `${location.pathname}${location.search}`;
  const openCastingProjects = mockCastingCalls.filter((call) => call.deadline >= today).slice(0, 3);

  const resetIntroForm = () => {
    setProjectName('');
    setIntroNote('');
    setIntroState('idle');
    setIntroError('');
  };

  const submitIntro = () => {
    if (!agency) return;

    setIntroError('');

    if (!selectedActorId || !selectedStudioId) {
      setIntroState('blocked');
      setIntroError('Select both actor and studio before creating an intro workflow.');
      return;
    }

    if (!projectName.trim()) {
      setIntroState('error');
      setIntroError('Project name is required to create a trackable intro record.');
      return;
    }

    setIntroState('loading');

    window.setTimeout(() => {
      if (projectName.toLowerCase().includes('error')) {
        setIntroState('error');
        setIntroError('Intro dispatch failed due to a simulated transport issue.');
        toast.error('Unable to create intro workflow.');
        return;
      }

      const item: IntroItem = {
        id: `intro-${Date.now()}`,
        actorId: selectedActorId,
        studioId: selectedStudioId,
        projectName: projectName.trim(),
        note: introNote.trim(),
        status: 'sent',
        createdAt: new Date().toISOString(),
      };

      setIntroQueue((current) => [item, ...current]);
      setIntroState('success');
      toast.success(`Intro workflow created for ${agency.name}.`);

      window.setTimeout(() => {
        setIsIntroModalOpen(false);
        resetIntroForm();
      }, 500);
    }, 600);
  };

  const withdrawIntro = () => {
    if (!withdrawCandidate) return;
    setIntroQueue((current) => current.filter((item) => item.id !== withdrawCandidate.id));
    toast.success(`Withdrawn intro: ${withdrawCandidate.projectName}`);
    setWithdrawCandidate(null);
  };

  if (!agency) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-dashed border-[#ECECEC] bg-white p-8 text-center">
          <Briefcase className="size-16 text-muted-foreground/60" />
          <p className="mt-3 text-[13px] text-muted-foreground">Agency not found.</p>
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
            <AgencyLeftRail name={agency.name} description={agency.description} location={agency.location} rosterSize={agency.rosterSize} specialties={agency.specialties} />
          </div>

          <div className="hide-scrollbar h-full min-w-0 flex-1 overflow-y-auto pb-6 pr-1">
            <div className="space-y-4 lg:hidden">
              <AgencyLeftRail name={agency.name} description={agency.description} location={agency.location} rosterSize={agency.rosterSize} specialties={agency.specialties} />
              <AgencyRightRail introQueue={introQueue} onStartIntro={() => setIsIntroModalOpen(true)} onWithdraw={(item) => setWithdrawCandidate(item)} />
            </div>

            <div className="space-y-4 lg:mt-0">

              <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Users className="size-5 text-muted-foreground" weight="duotone" />
                <h2 className="text-[14px] font-semibold text-foreground">Representation Shortlist</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground">Actors</p>
                  <div className="mt-2 divide-y divide-dashed divide-[#ECECEC]">
                    {mockActors.slice(0, 3).map((actor) => (
                      <div key={actor.id} className="flex items-center justify-between py-2">
                        <div className="flex min-w-0 items-center gap-3">
                          <div aria-hidden="true" className="size-11 shrink-0 rounded-xl bg-[#F3F4F6]" />
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium text-foreground">{actor.name}</p>
                            <p className="text-[10px] text-muted-foreground">{actor.specialty}</p>
                          </div>
                        </div>
                        <Link to={`/dashboard/actor/${actor.id}`}>
                          <Button size="sm" variant="outline" className="h-7 rounded-lg border-[#ECECEC] bg-white px-2 text-[10px]">View</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground">Studios</p>
                  <div className="mt-2 divide-y divide-dashed divide-[#ECECEC]">
                    {mockStudios.slice(0, 3).map((studio) => (
                      <div key={studio.id} className="flex items-center justify-between py-2">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="size-11 shrink-0 overflow-hidden rounded-xl bg-[#F3F4F6]">
                            {studio.logoUrl && (
                              <img src={studio.logoUrl} alt={`${studio.name} logo`} className="size-full object-cover" loading="lazy" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium text-foreground">{studio.name}</p>
                            <p className="text-[10px] text-muted-foreground">{studio.type}</p>
                          </div>
                        </div>
                        <Link to={`/dashboard/studio/${studio.id}`}>
                          <Button size="sm" variant="outline" className="h-7 rounded-lg border-[#ECECEC] bg-white px-2 text-[10px]">View</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

              <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarBlank className="size-5 text-muted-foreground" weight="duotone" />
                    <h2 className="text-[14px] font-semibold text-foreground">Open Casting Calls / Projects</h2>
                  </div>
                  <Link to="/dashboard/casting-calls" state={{ fromAgency }}>
                    <Button size="sm" variant="outline" className="h-7 rounded-lg border-[#ECECEC] bg-white px-2 text-[10px]">View All</Button>
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
                        state={{ fromAgency }}
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

              <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-foreground">Contract Collaboration</h2>
                <div className="flex items-center gap-1">
                  {(['success', 'loading', 'empty', 'error'] as ContractsState[]).map((state) => (
                    <Button key={state} size="sm" variant={contractsState === state ? 'default' : 'ghost'} className="h-7 rounded-lg px-2 text-[10px] capitalize" onClick={() => setContractsState(state)}>
                      {state}
                    </Button>
                  ))}
                </div>
              </div>

              {contractsState === 'loading' && (
                <div className="mt-4 space-y-2">
                  {[1, 2].map((item) => (
                    <div key={item} className="py-2">
                      <Skeleton className="h-4 w-3/5" />
                      <Skeleton className="mt-2 h-3 w-2/5" />
                    </div>
                  ))}
                </div>
              )}

              {contractsState === 'empty' && <p className="mt-4 text-[12px] text-muted-foreground">No contract threads in queue.</p>}

              {contractsState === 'error' && (
                <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-[12px] text-destructive">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5"><WarningCircle className="size-4" weight="fill" /> Contract feed failed to load.</span>
                    <Button size="sm" variant="outline" className="h-7 rounded-lg border-[#ECECEC] bg-white text-[10px]" onClick={() => setContractsState('success')}>Retry</Button>
                  </div>
                </div>
              )}

              {contractsState === 'success' && (
                <div className="mt-3 divide-y divide-dashed divide-[#ECECEC]">
                  {CONTRACT_THREADS.map((thread) => (
                    <div key={thread.id} className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">{thread.title}</p>
                        <p className="text-[11px] text-muted-foreground">{thread.status} • {thread.milestone}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link to="/dashboard/contracts">
                          <Button size="sm" variant="outline" className="h-7 rounded-lg border-[#ECECEC] bg-white px-2 text-[10px]">Review</Button>
                        </Link>
                        <Button size="sm" variant="outline" className="h-7 rounded-lg border-[#ECECEC] bg-white px-2 text-[10px]" onClick={() => toast.success('Amendment request drafted in contract thread.')}>Amend</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            </div>
          </div>

          <div className="hide-scrollbar hidden h-full w-72 flex-shrink-0 space-y-4 overflow-y-auto pb-6 xl:block">
            <AgencyRightRail introQueue={introQueue} onStartIntro={() => setIsIntroModalOpen(true)} onWithdraw={(item) => setWithdrawCandidate(item)} />
          </div>
        </div>
      </div>

      <Dialog open={isIntroModalOpen} onOpenChange={(open) => { setIsIntroModalOpen(open); if (!open) resetIntroForm(); }}>
        <DialogContent className="sm:max-w-[560px] rounded-3xl border border-[#ECECEC] bg-[#F9F9F9]">
          <DialogHeader>
            <DialogTitle>Create Intro Workflow</DialogTitle>
            <DialogDescription>Introduce actor and studio, then track milestones through contracts.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Actor</Label>
                <select className="h-10 w-full rounded-xl border border-[#ECECEC] bg-white px-3 text-[12px]" value={selectedActorId} onChange={(event) => setSelectedActorId(event.target.value)}>
                  {mockActors.map((actor) => <option key={actor.id} value={actor.id}>{actor.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Studio</Label>
                <select className="h-10 w-full rounded-xl border border-[#ECECEC] bg-white px-3 text-[12px]" value={selectedStudioId} onChange={(event) => setSelectedStudioId(event.target.value)}>
                  {mockStudios.map((studio) => <option key={studio.id} value={studio.id}>{studio.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agency-project">Project Name</Label>
              <Input id="agency-project" value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="e.g. Horizon Line - Regional Dubbing" className="h-10 rounded-xl border-[#ECECEC] bg-white" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agency-note">Intro Notes</Label>
              <Textarea id="agency-note" value={introNote} onChange={(event) => setIntroNote(event.target.value)} placeholder="Mention rights scope, timelines, and contract dependencies." className="min-h-[110px] rounded-xl border-[#ECECEC] bg-white" />
            </div>

            {introState === 'loading' && (
              <div className="rounded-xl border border-[#ECECEC] bg-white p-3 text-[11px] text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Clock className="size-4" /> Creating intro and notifying participants...</span></div>
            )}

            {(introState === 'error' || introState === 'blocked') && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-[11px] text-destructive">{introError}</div>
            )}

            {introState === 'success' && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-[11px] text-emerald-700">Intro workflow created. Contract milestones are now trackable.</div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsIntroModalOpen(false)} disabled={introState === 'loading'}>Cancel</Button>
            <Button onClick={submitIntro} disabled={introState === 'loading'}>Start Intro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!withdrawCandidate} onOpenChange={(open) => !open && setWithdrawCandidate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw this intro?</AlertDialogTitle>
            <AlertDialogDescription>Withdrawing removes the negotiation handoff and contract timeline linkage for this intro.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep intro</AlertDialogCancel>
            <AlertDialogAction onClick={withdrawIntro}>Withdraw intro</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
