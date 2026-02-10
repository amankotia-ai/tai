import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Buildings,
  CalendarBlank,
  CheckCircle,
  Clock,
  CurrencyDollar,
  FilmStrip,
  Globe,
  MapPin,
  ShieldCheck,
  Sparkle,
  UsersThree,
  WarningCircle,
} from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockCastingCalls } from '@/lib/store';

interface CastingCallDetailMeta {
  projectType: string;
  contractType: string;
  workMode: string;
  location: string;
  commitment: string;
  startWindow: string;
  postedAt: string;
  rightsScope: string[];
  responsibilities: string[];
  preferredProfile: string[];
  deliverables: string[];
  protections: string[];
  timeline: Array<{ label: string; detail: string }>;
}

const DEFAULT_DETAIL: CastingCallDetailMeta = {
  projectType: 'Screen & Digital Performance',
  contractType: 'Project-based agreement',
  workMode: 'Hybrid',
  location: 'Mumbai, India',
  commitment: '4 to 8 weeks',
  startWindow: 'Immediately after shortlist',
  postedAt: '2026-02-01',
  rightsScope: ['Global streaming distribution', 'Campaign usage rights', 'Inference-only model usage'],
  responsibilities: [
    'Attend shortlist call and rights briefing with production legal.',
    'Submit all required source media and verification artifacts by milestone.',
    'Participate in review rounds for approved synthetic outputs.',
  ],
  preferredProfile: [
    'Prior production credits in film, series, games, or branded campaigns.',
    'Experience with performance capture, ADR, or high-fidelity voice sessions.',
    'Clear availability during pre-production and recording windows.',
  ],
  deliverables: [
    'Initial creative and legal intake within 48 hours of acceptance.',
    'Source capture and quality review package in week 1.',
    'Final approved deliverables and consent ledger sign-off before release.',
  ],
  protections: [
    'Usage is constrained to contract-allowed channels and geographies.',
    'All generated outputs are watermark-traceable and auditable.',
    'License revocation and dispute escalation are contractually defined.',
  ],
  timeline: [
    { label: 'Shortlist Review', detail: 'Within 3 business days of application.' },
    { label: 'Verification + Legal', detail: '2 to 4 business days after shortlist confirmation.' },
    { label: 'Production Kickoff', detail: 'Scheduled once agreement is countersigned.' },
  ],
};

const CASTING_CALL_DETAIL_META: Record<string, CastingCallDetailMeta> = {
  '1': {
    projectType: 'Animated Feature Film',
    contractType: 'Principal performance agreement',
    workMode: 'On-site + remote pickups',
    location: 'Los Angeles, CA',
    commitment: '6 to 10 weeks',
    startWindow: 'March 2026',
    postedAt: '2026-01-24',
    rightsScope: ['Theatrical and OTT distribution', 'Dub-localization rights', 'Inference-only AI enhancement'],
    responsibilities: [
      'Record lead character sessions across core script and ADR rounds.',
      'Collaborate with director and dialogue coach on tonal variations.',
      'Approve final synthetic voice references for localization use.',
    ],
    preferredProfile: [
      'Strong character range with emotional and comedic beats.',
      'Previous lead or recurring animated role credits.',
      'Union-compliant or equivalent production experience preferred.',
    ],
    deliverables: [
      'Primary language performance package.',
      'Pronunciation and style guide notes for localization.',
      'Final approval on release-candidate voice outputs.',
    ],
    protections: [
      'No training rights granted outside contracted project scope.',
      'All usage events logged to the rights ledger.',
      'Re-use beyond term requires fresh written approval.',
    ],
    timeline: [
      { label: 'Initial Audition', detail: 'Submit within 5 days of application.' },
      { label: 'Callback + Chemistry Read', detail: 'Week of shortlist publication.' },
      { label: 'Contract & Session Booking', detail: 'Starts immediately after acceptance.' },
    ],
  },
  '2': {
    ...DEFAULT_DETAIL,
    projectType: 'Action Feature Sequence',
    contractType: 'Scene-based likeness agreement',
    workMode: 'On-set scan + stage sessions',
    location: 'Atlanta, GA',
    commitment: '2 to 4 weeks',
    startWindow: 'Late February 2026',
    postedAt: '2026-01-30',
  },
  '3': {
    ...DEFAULT_DETAIL,
    projectType: 'Ethical AI Voice Dataset',
    contractType: 'Contributor + royalty model',
    workMode: 'Remote-first',
    location: 'Remote (US/India time overlap)',
    commitment: '3 weeks capture + periodic updates',
    startWindow: 'April 2026',
    postedAt: '2026-02-02',
  },
  '4': {
    ...DEFAULT_DETAIL,
    projectType: 'Persistent Virtual Avatar Program',
    contractType: 'Annual renewable licensing agreement',
    workMode: 'On-site scan + remote approvals',
    location: 'Menlo Park, CA',
    commitment: '8 to 12 weeks',
    startWindow: 'Q2 2026',
    postedAt: '2026-01-29',
  },
};

export default function CastingCallProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const castingCall = mockCastingCalls.find((entry) => entry.id === id);
  const callMeta = (id && CASTING_CALL_DETAIL_META[id]) || DEFAULT_DETAIL;

  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const fallbackSearchPath = isDashboardRoute ? '/dashboard/search' : '/search';
  const navState = typeof location.state === 'object' && location.state !== null ? (location.state as Record<string, unknown>) : null;
  const fromStudio = typeof navState?.fromStudio === 'string' ? navState.fromStudio : null;
  const fromAgency = typeof navState?.fromAgency === 'string' ? navState.fromAgency : null;
  const fromSearch = typeof navState?.fromSearch === 'string' ? navState.fromSearch : null;
  const fromCastingCalls = typeof navState?.fromCastingCalls === 'string' ? navState.fromCastingCalls : null;

  const backTarget = fromStudio ?? fromAgency ?? fromSearch ?? fromCastingCalls ?? fallbackSearchPath;
  const backLabel = fromStudio
    ? 'Back to Studio'
    : fromAgency
      ? 'Back to Agency'
      : fromSearch
        ? 'Back to Search'
        : fromCastingCalls
          ? 'Back to Casting Calls'
          : 'Back to Search';
  const chatPath = isDashboardRoute ? '/dashboard/chat' : '/chat';
  const browseCallsPath = isDashboardRoute ? '/dashboard/casting-calls' : '/casting-calls';

  if (!castingCall) {
    return (
      <DashboardLayout className="bg-[#F9F9F9]">
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 rounded-xl px-2 text-[12px] text-muted-foreground hover:bg-[#F5F6F8] hover:text-foreground"
            onClick={() => navigate(backTarget)}
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </Button>

          <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-dashed border-[#ECECEC] bg-white p-8 text-center">
            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[#F5F6F8] text-muted-foreground">
              <WarningCircle className="size-5" />
            </div>
            <h1 className="text-[18px] font-semibold text-foreground text-balance">Casting Call Not Found</h1>
            <p className="mt-2 max-w-md text-[13px] text-muted-foreground text-pretty">
              This casting call might be archived or the link may be outdated.
            </p>
            <Link to={backTarget} className="mt-4">
              <Button className="h-9 rounded-xl bg-[#D61D1F] px-4 text-[12px] text-white hover:bg-[#D61D1F]/90">
                {backLabel}
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const deadlineDate = new Date(castingCall.deadline);
  const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - Date.now()) / 86400000);
  const deadlineStatus =
    daysUntilDeadline < 0 ? 'Closed' : daysUntilDeadline === 0 ? 'Closes today' : `${daysUntilDeadline} days left`;

  return (
    <DashboardLayout className="bg-[#F9F9F9]">
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 rounded-xl px-2 text-[12px] text-muted-foreground hover:bg-[#F5F6F8] hover:text-foreground"
          onClick={() => navigate(backTarget)}
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Button>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[18rem_minmax(0,1fr)_18rem]">
          <div className="order-2 space-y-4 xl:order-1">
            <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#F5F6F8] text-muted-foreground">
                  <Buildings className="size-4.5" weight="fill" />
                </div>
                <h3 className="text-[14px] font-semibold text-foreground">Studio Snapshot</h3>
              </div>

              <div className="divide-y divide-dashed divide-[#ECECEC] text-[11px] text-muted-foreground">
                <div className="flex items-center justify-between py-2">
                  <span>Studio</span>
                  <span className="text-foreground">{castingCall.studio}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Project Type</span>
                  <span className="text-foreground">{callMeta.projectType}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Role</span>
                  <span className="text-foreground">{castingCall.role}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Work Mode</span>
                  <span className="text-foreground">{callMeta.workMode}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" /> Location</span>
                  <span className="text-foreground">{callMeta.location}</span>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <h3 className="text-[13px] font-semibold text-foreground">Commercial Terms</h3>
              <div className="mt-3 divide-y divide-dashed divide-[#ECECEC] text-[11px] text-muted-foreground">
                <div className="flex items-center justify-between py-2">
                  <span className="inline-flex items-center gap-1.5"><CurrencyDollar className="size-3.5" /> Budget</span>
                  <span className="font-inter-numeric tabular-nums text-foreground">{castingCall.budget}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Contract</span>
                  <span className="text-foreground">{callMeta.contractType}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Commitment</span>
                  <span className="text-foreground">{callMeta.commitment}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Start Window</span>
                  <span className="text-foreground">{callMeta.startWindow}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="order-1 space-y-4 xl:order-2">
            <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5 md:p-6">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#D61D1F]/10 text-[#D61D1F]">
                  <FilmStrip className="size-5" weight="fill" />
                </div>
                <Badge className="border-transparent bg-emerald-100 text-[11px] text-emerald-700">Open Casting</Badge>
              </div>

              <h1 className="text-[24px] font-semibold text-foreground text-balance">{castingCall.title}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Buildings className="size-4" /> {castingCall.studio}</span>
                <span className="rounded-md bg-muted px-2 py-0.5">{castingCall.role}</span>
                <span className="inline-flex items-center gap-1.5"><CalendarBlank className="size-4" /> {deadlineDate.toLocaleDateString()}</span>
              </div>

            </Card>

            <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <Sparkle className="size-4 text-[#D61D1F]" weight="fill" />
                <h2 className="text-[14px] font-semibold text-foreground">Role Overview</h2>
              </div>
              <p className="text-[13px] leading-6 text-muted-foreground text-pretty">{castingCall.description}</p>

              <div className="mt-4 space-y-2">
                {callMeta.responsibilities.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                    <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-600" weight="fill" />
                    <span className="text-pretty">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
                <h2 className="text-[14px] font-semibold text-foreground">Requirements</h2>
                <div className="mt-3 space-y-2">
                  {castingCall.requirements.map((requirement) => (
                    <div key={requirement} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <CheckCircle className="size-4 text-emerald-600" weight="fill" />
                      <span>{requirement}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
                <h2 className="text-[14px] font-semibold text-foreground">Preferred Profile</h2>
                <div className="mt-3 space-y-2">
                  {callMeta.preferredProfile.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                      <UsersThree className="mt-0.5 size-4 shrink-0" />
                      <span className="text-pretty">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#D61D1F]" weight="fill" />
                <h2 className="text-[14px] font-semibold text-foreground">Rights & Licensing</h2>
              </div>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {callMeta.rightsScope.map((scope) => (
                  <Badge key={scope} variant="outline" className="border-[#ECECEC] bg-white text-[10px] text-muted-foreground">
                    {scope}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2">
                {callMeta.protections.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                    <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-600" weight="fill" />
                    <span className="text-pretty">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <h2 className="text-[14px] font-semibold text-foreground">Deliverables & Process</h2>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-[12px] font-semibold text-foreground">Expected Deliverables</h3>
                  <div className="mt-2 space-y-2">
                    {callMeta.deliverables.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                        <CheckCircle className="mt-0.5 size-3.5 shrink-0 text-emerald-600" weight="fill" />
                        <span className="text-pretty">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[12px] font-semibold text-foreground">Selection Timeline</h3>
                  <div className="mt-2 space-y-2">
                    {callMeta.timeline.map((step) => (
                      <div key={step.label} className="rounded-xl border border-[#ECECEC] bg-[#F9F9F9] p-2.5">
                        <p className="text-[11px] font-medium text-foreground">{step.label}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground text-pretty">{step.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="order-3 space-y-4">
            <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <h3 className="text-[13px] font-semibold text-foreground">Application Checklist</h3>
              <div className="mt-3 space-y-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-600" weight="fill" />
                  <span>CastID verification active</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-600" weight="fill" />
                  <span>Portfolio and credits updated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-600" weight="fill" />
                  <span>Consent and territory settings reviewed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-600" weight="fill" />
                  <span>Availability confirmed for timeline windows</span>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <h3 className="text-[13px] font-semibold text-foreground">Timing</h3>
              <div className="mt-3 divide-y divide-dashed divide-[#ECECEC] text-[11px] text-muted-foreground">
                <div className="flex items-center justify-between py-2">
                  <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" /> Deadline</span>
                  <span className="font-inter-numeric tabular-nums text-foreground">{deadlineDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Status</span>
                  <span className="text-foreground">{deadlineStatus}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Posted</span>
                  <span className="font-inter-numeric tabular-nums text-foreground">{new Date(callMeta.postedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
              <h3 className="text-[13px] font-semibold text-foreground">Next Actions</h3>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <Link to={chatPath}>
                  <Button className="h-9 w-full rounded-xl bg-[#D61D1F] text-[11px] text-white hover:bg-[#D61D1F]/90">
                    Message Hiring Team
                  </Button>
                </Link>
                <Link to={browseCallsPath}>
                  <Button variant="outline" className="h-9 w-full rounded-xl border-[#ECECEC] bg-white text-[11px]">
                    Browse More Calls
                  </Button>
                </Link>
              </div>
              <p className="mt-3 inline-flex items-start gap-1.5 text-[10px] text-muted-foreground text-pretty">
                <Globe className="mt-0.5 size-3.5 shrink-0" />
                Rights usage and approvals are tracked in your CastID audit trail.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
