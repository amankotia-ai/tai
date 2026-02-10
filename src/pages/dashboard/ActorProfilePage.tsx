import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  CalendarBlank,
  CaretRight,
  ChatCircle,
  Check,
  CheckCircle,
  Clock,
  CurrencyDollar,
  FileText,
  Globe,
  Link as LinkIcon,
  Lock,
  MapPin,
  Microphone,
  Play,
  ShieldCheck,
  Star,
  User,
  UserCircle,
  WarningCircle,
} from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { LicenseRequest, mockActors, storage } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type AssetType = 'voice' | 'face' | 'motion';
type AccessRequestStatus = 'requested' | 'approved' | 'expired' | 'revoked';
type RequestState = 'idle' | 'loading' | 'success' | 'error';

interface AccessRequestItem {
  id: string;
  projectName: string;
  assetType: AssetType;
  useCase: string;
  territory: string;
  duration: string;
  status: AccessRequestStatus;
  createdAt: string;
}

interface AssetPolicy {
  id: AssetType;
  label: string;
  trainingPolicy: 'Allow Training' | 'Inference Only' | 'Disabled';
  allowedUseCases: string[];
  territories: string[];
  duration: string;
  visibility: 'Request Only' | 'Public' | 'Private';
}

const PROFILE_COMPLETION = 85;

const VERIFICATION_TIMELINE = [
  { id: 'identity', label: 'Identity verification', detail: 'Gov ID approved', state: 'done' as const },
  { id: 'professional', label: 'Professional credentials', detail: 'Union and credits verified', state: 'done' as const },
  { id: 'castid', label: 'Cast ID badge', detail: 'Issued Jan 19, 2026', state: 'done' as const },
  { id: 'refresh', label: 'Annual refresh', detail: 'Next refresh Jan 2027', state: 'upcoming' as const },
] as const;

const VOICE_SAMPLES = [
  { title: 'Commercial Demo', duration: '1:05' },
  { title: 'Narrative - Documentary', duration: '2:10' },
  { title: 'Character Reel', duration: '1:30' },
];

const CREDITS = [
  { title: 'The Broken Mirror', role: 'Lead Actor', production: 'Independent Feature', year: '2025' },
  { title: 'City of Dreams', role: 'Recurring Guest', production: 'Netflix Series', year: '2024' },
  { title: 'Echoes of Silence', role: 'Supporting', production: 'Short Film', year: '2023' },
];

const WORK_LINKS = [
  { title: 'IMDb Profile', url: 'https://imdb.com/name/nm1234567' },
  { title: 'Showreel Site', url: 'https://priya-sharma-actor.com' },
];

const ASSET_POLICIES: AssetPolicy[] = [
  {
    id: 'voice',
    label: 'Neural Voice Pack',
    trainingPolicy: 'Inference Only',
    allowedUseCases: ['TV/Film', 'Games', 'Dubbing', 'Ads'],
    territories: ['India', 'APAC'],
    duration: '12 months',
    visibility: 'Request Only',
  },
  {
    id: 'face',
    label: 'Likeness Model',
    trainingPolicy: 'Inference Only',
    allowedUseCases: ['TV/Film', 'Ads'],
    territories: ['India', 'Worldwide'],
    duration: '6 months',
    visibility: 'Request Only',
  },
  {
    id: 'motion',
    label: 'Motion Signature',
    trainingPolicy: 'Allow Training',
    allowedUseCases: ['Games', 'TV/Film'],
    territories: ['India', 'APAC', 'Europe'],
    duration: '9 months',
    visibility: 'Request Only',
  },
];

const STATUS_TONE: Record<AccessRequestStatus, string> = {
  requested: 'border-[#DCE7FF] bg-[#EDF3FF] text-[#0052FF]',
  approved: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700',
  expired: 'border-amber-500/20 bg-amber-500/10 text-amber-700',
  revoked: 'border-destructive/20 bg-destructive/10 text-destructive',
};

const REQUEST_STATUSES: AccessRequestStatus[] = ['requested', 'approved', 'expired', 'revoked'];

const assetTypeLabel = (assetType: AssetType): string => {
  if (assetType === 'voice') return 'Voice';
  if (assetType === 'face') return 'Likeness';
  return 'Motion';
};

const nextStatus = (status: AccessRequestStatus): AccessRequestStatus => {
  const index = REQUEST_STATUSES.indexOf(status);
  if (index === REQUEST_STATUSES.length - 1) return status;
  return REQUEST_STATUSES[index + 1];
};

const rightTypeForAsset = (assetType: AssetType): LicenseRequest['rightType'] => {
  if (assetType === 'voice') return 'voice-cloning';
  if (assetType === 'face') return 'face-synthesis';
  return 'full-likeness';
};

function ActorVisitorSidebar({
  name,
  specialty,
  location,
  rating,
  rateRange,
  onOpenRequest,
}: {
  name: string;
  specialty: string;
  location: string;
  rating: number;
  rateRange: string;
  onOpenRequest: () => void;
}) {
  return (
    <>
      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-12 overflow-hidden rounded-full bg-muted ring-2 ring-background shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop"
                alt={name}
                className="size-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-emerald-500" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold text-foreground">{name}</h3>
            <p className="text-[11px] text-muted-foreground">{specialty}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-dashed border-[#ECECEC] pt-4 text-[11px] text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              Location
            </span>
            <span>{location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-3.5 text-amber-500" weight="fill" />
              Rating
            </span>
            <span className="font-inter-numeric tabular-nums text-foreground">{rating}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <CurrencyDollar className="size-3.5" />
              Typical rate
            </span>
            <span className="font-inter-numeric text-foreground">{rateRange}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <Link to="/dashboard/chat" className="w-full">
            <Button className="h-9 w-full rounded-xl bg-[#D61D1F] text-[11px] font-semibold text-white hover:bg-[#D61D1F]/90">
              <ChatCircle className="mr-1.5 size-4" />
              Message Actor
            </Button>
          </Link>
          <Button
            variant="outline"
            className="h-9 rounded-xl border-[#ECECEC] bg-white text-[11px]"
            onClick={onOpenRequest}
          >
            <FileText className="mr-1.5 size-4" />
            Request Access
          </Button>
        </div>
      </Card>

      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <h3 className="text-[13px] font-semibold text-foreground">Verification Journey</h3>
        <div className="mt-3 divide-y divide-dashed divide-[#ECECEC]">
          {VERIFICATION_TIMELINE.map((step) => (
            <div key={step.id} className="flex items-start gap-2 py-2">
              <div className={cn('mt-0.5 size-4 shrink-0', step.state === 'done' ? 'text-emerald-600' : 'text-muted-foreground')}>
                {step.state === 'done' ? <CheckCircle className="size-4" weight="fill" /> : <Clock className="size-4" />}
              </div>
              <div>
                <p className="text-[12px] font-medium text-foreground">{step.label}</p>
                <p className="text-[10px] text-muted-foreground">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function VisitorTrustRail({
  activeRequests,
  profileCompletion,
  showProfileStrength = true,
}: {
  activeRequests: number;
  profileCompletion: number;
  showProfileStrength?: boolean;
}) {
  return (
    <>
      {showProfileStrength && (
        <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
          <h3 className="text-[13px] font-semibold text-foreground">Profile Strength</h3>
          <div className="mt-2 h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full bg-[#D61D1F]" style={{ width: `${profileCompletion}%` }} />
          </div>
          <div className="mt-4 divide-y divide-dashed divide-[#ECECEC] text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2 py-2">
              <CheckCircle className="size-4 text-emerald-600" weight="fill" /> Visible in discover search
            </div>
            <div className="flex items-center gap-2 py-2">
              <ShieldCheck className="size-4 text-emerald-600" weight="fill" /> Cast ID verified profile
            </div>
            <div className="flex items-center gap-2 py-2">
              <CalendarBlank className="size-4" /> Updated Jan 19, 2026
            </div>
          </div>
        </Card>
      )}

      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <h3 className="text-[13px] font-semibold text-foreground">Access Requests</h3>
        <p className="mt-1 text-[11px] text-muted-foreground">{activeRequests} active requests in this session</p>
        <p className="mt-3 text-pretty text-[11px] text-muted-foreground">
          Consent scope is enforced. Requests outside territory, use-case, or duration are blocked before actor review.
        </p>
      </Card>
    </>
  );
}

export default function ActorProfilePage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const actor = mockActors.find((entry) => entry.id === id);
  const fallbackSearchPath = location.pathname.startsWith('/dashboard') ? '/dashboard/search' : '/search';
  const fromSearchPath =
    typeof location.state === 'object' &&
    location.state !== null &&
    'fromSearch' in location.state &&
    typeof (location.state as { fromSearch?: unknown }).fromSearch === 'string'
      ? (location.state as { fromSearch: string }).fromSearch
      : null;
  const backToSearchPath = fromSearchPath ?? fallbackSearchPath;
  const showProfileStrength = fromSearchPath === null;

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestState, setRequestState] = useState<RequestState>('idle');
  const [requestError, setRequestError] = useState('');
  const [cancelCandidate, setCancelCandidate] = useState<AccessRequestItem | null>(null);

  const [projectName, setProjectName] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>('voice');
  const [useCase, setUseCase] = useState('TV/Film');
  const [territory, setTerritory] = useState('India');
  const [duration, setDuration] = useState('6 months');
  const [requestLifecycle, setRequestLifecycle] = useState<AccessRequestItem[]>([]);

  const selectedPolicy = useMemo(
    () => ASSET_POLICIES.find((policy) => policy.id === selectedAssetType) || ASSET_POLICIES[0],
    [selectedAssetType],
  );

  const consentPrecheck = useMemo(() => {
    if (!projectName.trim()) {
      return { allowed: false, reason: 'Project name is required before consent pre-check.' };
    }

    if (!selectedPolicy.allowedUseCases.includes(useCase)) {
      return {
        allowed: false,
        reason: `${assetTypeLabel(selectedAssetType)} policy does not allow ${useCase}.`,
      };
    }

    if (!selectedPolicy.territories.includes(territory)) {
      return {
        allowed: false,
        reason: `${assetTypeLabel(selectedAssetType)} policy does not cover ${territory}.`,
      };
    }

    if (duration.toLowerCase().includes('perpetual')) {
      return {
        allowed: false,
        reason: 'Perpetual usage requires legal review and is blocked in self-serve mode.',
      };
    }

    return {
      allowed: true,
      reason: `Consent matched: ${selectedPolicy.duration} cap and ${selectedPolicy.trainingPolicy.toLowerCase()} policy.`,
    };
  }, [duration, projectName, selectedAssetType, selectedPolicy, territory, useCase]);

  const resetForm = () => {
    setProjectName('');
    setSelectedAssetType('voice');
    setUseCase('TV/Film');
    setTerritory('India');
    setDuration('6 months');
    setRequestState('idle');
    setRequestError('');
  };

  const submitRequest = () => {
    if (!actor) return;

    setRequestError('');

    if (!consentPrecheck.allowed) {
      setRequestState('error');
      setRequestError(consentPrecheck.reason);
      toast.error('Consent pre-check failed.');
      return;
    }

    setRequestState('loading');

    window.setTimeout(() => {
      if (projectName.trim().toLowerCase().includes('error')) {
        setRequestState('error');
        setRequestError('Submission failed due to a simulated transport issue.');
        toast.error('Request submission failed.');
        return;
      }

      const idValue = `req-${Date.now()}`;
      const createdAt = new Date().toISOString();

      storage.addLicenseRequest({
        id: idValue,
        studioName: 'My Studio',
        projectName: projectName.trim(),
        rightType: rightTypeForAsset(selectedAssetType),
        status: 'pending',
        createdAt,
      });

      setRequestLifecycle((current) => [
        {
          id: idValue,
          projectName: projectName.trim(),
          assetType: selectedAssetType,
          useCase,
          territory,
          duration,
          status: 'requested',
          createdAt,
        },
        ...current,
      ]);

      setRequestState('success');
      toast.success(`Access request submitted to ${actor.name}`);

      window.setTimeout(() => {
        setIsRequestModalOpen(false);
        resetForm();
      }, 350);
    }, 550);
  };

  const advanceRequest = (requestId: string) => {
    setRequestLifecycle((current) =>
      current.map((item) =>
        item.id === requestId
          ? {
              ...item,
              status: nextStatus(item.status),
            }
          : item,
      ),
    );
  };

  const cancelRequest = () => {
    if (!cancelCandidate) return;
    setRequestLifecycle((current) => current.filter((item) => item.id !== cancelCandidate.id));
    toast.success(`Request cancelled: ${cancelCandidate.projectName}`);
    setCancelCandidate(null);
  };

  if (!actor) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-dashed border-[#ECECEC] bg-white p-8 text-center">
          <UserCircle className="size-16 text-muted-foreground/60" />
          <p className="mt-3 text-[13px] text-muted-foreground">Actor not found.</p>
          <Button className="mt-4" variant="outline" onClick={() => navigate(backToSearchPath)}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Search
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      className="h-dvh overflow-hidden bg-[#F9F9F9]"
      fullWidth
      transparentNav
      navContentClassName="mx-auto w-[85%]"
    >
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
            <ActorVisitorSidebar
              name={actor.name}
              specialty={actor.specialty}
              location={actor.location}
              rating={actor.rating}
              rateRange={actor.rateRange}
              onOpenRequest={() => setIsRequestModalOpen(true)}
            />
          </div>

          <div className="hide-scrollbar h-full min-w-0 flex-1 overflow-y-auto pb-6 pr-1">
            <div className="space-y-4 lg:hidden">
              <ActorVisitorSidebar
                name={actor.name}
                specialty={actor.specialty}
                location={actor.location}
                rating={actor.rating}
                rateRange={actor.rateRange}
                onOpenRequest={() => setIsRequestModalOpen(true)}
              />
              <VisitorTrustRail
                activeRequests={requestLifecycle.length}
                profileCompletion={PROFILE_COMPLETION}
                showProfileStrength={showProfileStrength}
              />
            </div>

            <div className="space-y-4 lg:mt-0">

              <div className="relative overflow-hidden rounded-3xl border border-[#ECECEC] bg-black">
              <div className="aspect-[16/7] min-h-[220px]">
                <div className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[10px] font-medium text-white/90">
                  Visitor Preview Reel
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    aria-label="Play introduction video"
                    className="flex size-14 items-center justify-center rounded-full bg-white/20"
                  >
                    <Play className="ml-0.5 size-5 text-white" weight="fill" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-balance text-[18px] font-semibold text-white">{actor.name} Introduction</h2>
                  <p className="text-pretty text-[11px] text-white/80">Public profile preview from discover view</p>
                </div>
              </div>
            </div>

              <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#F5F6F8] text-muted-foreground">
                  <User className="size-4.5" weight="fill" />
                </div>
                <h3 className="text-[14px] font-semibold text-foreground">About</h3>
              </div>
              <p className="text-pretty text-[13px] leading-6 text-muted-foreground">{actor.bio}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {actor.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-muted px-2.5 py-1 text-[10px] text-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

              <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#F5F6F8] text-muted-foreground">
                  <Globe className="size-4.5" weight="fill" />
                </div>
                <h3 className="text-[14px] font-semibold text-foreground">Consent Snapshot</h3>
              </div>

              <div className="divide-y divide-dashed divide-[#ECECEC]">
                {ASSET_POLICIES.map((policy) => (
                  <div key={policy.id} className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[12px] font-semibold text-foreground">{policy.label}</p>
                      <p className="text-[10px] text-muted-foreground">
                        Training: {policy.trainingPolicy} • Use cases: {policy.allowedUseCases.join(', ')} • Territory: {policy.territories.join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-[#ECECEC] bg-white text-[10px] text-muted-foreground">
                        {policy.visibility}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 rounded-lg border-[#ECECEC] bg-white text-[10px]"
                        onClick={() => {
                          setSelectedAssetType(policy.id);
                          setUseCase(policy.allowedUseCases[0]);
                          setTerritory(policy.territories[0]);
                          setDuration(policy.duration);
                          setIsRequestModalOpen(true);
                        }}
                      >
                        Request {assetTypeLabel(policy.id)}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

              <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#F5F6F8] text-muted-foreground">
                  <Microphone className="size-4.5" weight="fill" />
                </div>
                <h3 className="text-[14px] font-semibold text-foreground">Voice Samples</h3>
              </div>

              <div className="divide-y divide-dashed divide-[#ECECEC]">
                {VOICE_SAMPLES.map((sample) => (
                  <div key={sample.title} className="flex items-center gap-3 py-3">
                    <button type="button" aria-label={`Play ${sample.title}`} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#D61D1F] text-white">
                      <Play className="ml-0.5 size-3.5" weight="fill" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-foreground">{sample.title}</p>
                      <p className="font-inter-numeric tabular-nums text-[10px] text-muted-foreground">{sample.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

              <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#F5F6F8] text-muted-foreground">
                  <Briefcase className="size-4.5" weight="fill" />
                </div>
                <h3 className="text-[14px] font-semibold text-foreground">Credits</h3>
              </div>

              <div className="divide-y divide-dashed divide-[#ECECEC]">
                {CREDITS.map((job, index) => (
                  <div key={`${job.title}-${index}`} className="py-3 first:pt-0 last:pb-0">
                    <div className="mb-1 flex items-center justify-between">
                      <h4 className="text-[14px] font-semibold text-foreground">{job.title}</h4>
                      <span className="font-inter-numeric tabular-nums text-[11px] text-muted-foreground">{job.year}</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground">
                      {job.role} • {job.production}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

              <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#F5F6F8] text-muted-foreground">
                  <LinkIcon className="size-4.5" weight="fill" />
                </div>
                <h3 className="text-[14px] font-semibold text-foreground">Work and Links</h3>
              </div>

              <div className="divide-y divide-dashed divide-[#ECECEC]">
                {WORK_LINKS.map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <Globe className="size-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-foreground">{item.title}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{item.url}</p>
                    </div>
                    <CaretRight className="size-4 text-muted-foreground/50" />
                  </a>
                ))}
              </div>
            </Card>

              <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-foreground">Request Lifecycle</h3>
                <Button variant="outline" size="sm" className="h-8 rounded-lg border-[#ECECEC] bg-white text-[11px]" onClick={() => setIsRequestModalOpen(true)}>
                  New Request
                </Button>
              </div>

              {requestLifecycle.length === 0 ? (
                <p className="text-[12px] text-muted-foreground">No requests started yet.</p>
              ) : (
              <div className="divide-y divide-dashed divide-[#ECECEC]">
                  {requestLifecycle.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{item.projectName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {assetTypeLabel(item.assetType)} • {item.useCase} • {item.territory} • {item.duration}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={cn('border text-[10px] capitalize', STATUS_TONE[item.status])}>{item.status}</Badge>
                        <Button variant="outline" size="sm" className="h-7 rounded-lg border-[#ECECEC] bg-white text-[10px]" onClick={() => advanceRequest(item.id)} disabled={item.status === 'revoked'}>
                          Advance
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 rounded-lg border-[#ECECEC] bg-white text-[10px] text-destructive" onClick={() => setCancelCandidate(item)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            </div>
          </div>

          <div className="hide-scrollbar hidden h-full w-72 flex-shrink-0 space-y-4 overflow-y-auto pb-6 xl:block">
            <VisitorTrustRail
              activeRequests={requestLifecycle.length}
              profileCompletion={PROFILE_COMPLETION}
              showProfileStrength={showProfileStrength}
            />
          </div>
        </div>
      </div>

      <Dialog
        open={isRequestModalOpen}
        onOpenChange={(open) => {
          setIsRequestModalOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-[520px] rounded-3xl border border-[#ECECEC] bg-[#F9F9F9]">
          <DialogHeader>
            <DialogTitle>Request Asset Access</DialogTitle>
            <DialogDescription>
              Scope is validated against actor consent policy before the request is submitted.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="e.g. Open Operations Episode 4"
                className="h-10 rounded-xl border-[#ECECEC] bg-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Asset Type</Label>
                <select
                  className="h-10 w-full rounded-xl border border-[#ECECEC] bg-white px-3 text-[12px]"
                  value={selectedAssetType}
                  onChange={(event) => {
                    const nextType = event.target.value as AssetType;
                    const policy = ASSET_POLICIES.find((item) => item.id === nextType) || ASSET_POLICIES[0];
                    setSelectedAssetType(nextType);
                    setUseCase(policy.allowedUseCases[0]);
                    setTerritory(policy.territories[0]);
                    setDuration(policy.duration);
                  }}
                >
                  <option value="voice">Voice</option>
                  <option value="face">Likeness</option>
                  <option value="motion">Motion</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Use Case</Label>
                <select
                  className="h-10 w-full rounded-xl border border-[#ECECEC] bg-white px-3 text-[12px]"
                  value={useCase}
                  onChange={(event) => setUseCase(event.target.value)}
                >
                  {['TV/Film', 'Games', 'Social', 'Ads', 'Dubbing', 'Political'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Territory</Label>
                <select
                  className="h-10 w-full rounded-xl border border-[#ECECEC] bg-white px-3 text-[12px]"
                  value={territory}
                  onChange={(event) => setTerritory(event.target.value)}
                >
                  {['India', 'APAC', 'Europe', 'Worldwide'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  className="h-10 rounded-xl border-[#ECECEC] bg-white"
                  placeholder="e.g. 6 months"
                />
              </div>
            </div>

            <div
              className={cn(
                'rounded-xl border p-3 text-[11px]',
                consentPrecheck.allowed
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700'
                  : 'border-destructive/20 bg-destructive/10 text-destructive',
              )}
            >
              {consentPrecheck.allowed ? (
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle className="size-4" weight="fill" />
                  {consentPrecheck.reason}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <WarningCircle className="size-4" weight="fill" />
                  {consentPrecheck.reason}
                </span>
              )}
            </div>

            {requestState === 'loading' && (
              <div className="rounded-xl border border-[#ECECEC] bg-white p-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" />
                  Submitting request and creating audit link...
                </span>
              </div>
            )}

            {requestState === 'error' && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-[11px] text-destructive">
                {requestError}
              </div>
            )}

            {requestState === 'success' && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-[11px] text-emerald-700">
                Request submitted and linked to contracts workflow.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRequestModalOpen(false)} disabled={requestState === 'loading'}>
              Cancel
            </Button>
            <Button onClick={submitRequest} disabled={requestState === 'loading'}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!cancelCandidate} onOpenChange={(open) => !open && setCancelCandidate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the request from the current workflow and clears its negotiation record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep request</AlertDialogCancel>
            <AlertDialogAction onClick={cancelRequest}>Cancel request</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
