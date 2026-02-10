import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Camera,
  CaretRight,
  Check,
  GearSix,
  Globe,
  Link as LinkIcon,
  Lock,
  MapPin,
  Microphone,
  PencilSimple,
  Play,
  Plus,
  ShareNetwork,
  ShieldCheck,
  User,
  VideoCamera,
  WarningCircle,
} from '@phosphor-icons/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
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
import { Progress } from '@/components/ui/progress';
import { storage } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const mockProfile = {
  bio: 'Versatile actor with 5 years of experience in Bollywood and regional cinema. Trained in method acting and classical dance forms.',
  headshots: [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
  ],
  workLinks: [
    { title: 'IMDb Profile', url: 'https://imdb.com/name/nm1234567' },
    { title: 'Personal Website', url: 'https://priya-sharma-actor.com' },
  ],
  location: 'Mumbai, Maharashtra',
  roleType: 'Actor / Voice Artist',
  voiceSamples: [
    { title: 'Commercial Demo', duration: '1:05' },
    { title: 'Narrative - Documentary', duration: '2:10' },
    { title: 'Character Reel', duration: '1:30' },
  ],
  experience: [
    { title: 'The Broken Mirror', role: 'Lead Actor', production: 'Independent Feature', year: '2025' },
    { title: 'City of Dreams', role: 'Recurring Guest', production: 'Netflix Series', year: '2024' },
    { title: 'Echoes of Silence', role: 'Supporting', production: 'Short Film', year: '2023' },
  ],
};

type VerificationStep = 'signup' | 'profile' | 'verification' | 'verified';

function ProfileSidebar({
  userName,
  verificationStep,
  onVerifyClick,
}: {
  userName: string;
  verificationStep: VerificationStep;
  onVerifyClick: () => void;
}) {
  const isVerified = verificationStep === 'verified';
  const verificationSteps = [
    {
      id: 'signup',
      label: 'Sign Up',
      detail: 'Account created',
      state: 'done' as const,
      type: 'check' as const,
    },
    {
      id: 'profile',
      label: 'Profile Basics',
      detail: 'Name, role, location',
      state: 'done' as const,
      type: 'check' as const,
    },
    {
      id: 'identity',
      label: 'Identity Verification',
      detail: 'Gov ID and professional proof',
      state: isVerified ? ('done' as const) : ('current' as const),
      type: 'check' as const,
    },
    {
      id: 'badge',
      label: 'Cast ID Badge',
      detail: 'Profile protected',
      state: isVerified ? ('done' as const) : ('upcoming' as const),
      type: 'shield' as const,
    },
  ];

  return (
    <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="size-12 overflow-hidden rounded-full bg-muted ring-2 ring-background shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div
            className={cn(
              'absolute bottom-0 right-0 size-3 rounded-full border-2 border-background',
              verificationStep === 'verified' ? 'bg-emerald-500' : 'bg-muted-foreground/40',
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-foreground">{userName}</h3>
          <p className="text-[11px] text-muted-foreground">{mockProfile.roleType}</p>
        </div>
      </div>

      {verificationStep === 'verified' ? (
        <div className="mt-4 flex min-w-0 items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-muted px-2.5 py-1.5 text-[10px] text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" weight="fill" />
            <span className="truncate">{mockProfile.location}</span>
          </div>
          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1.5">
            <ShieldCheck className="size-3.5 text-emerald-600" weight="fill" />
            <span className="text-[10px] font-semibold text-emerald-700">Cast ID Verified</span>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-[11px] text-muted-foreground">
            <MapPin className="size-3.5" weight="fill" />
            <span>{mockProfile.location}</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#ECECEC] bg-[#FCFCFC] p-3 text-left">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-background">
              <ShieldCheck className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-foreground">Verification Required</p>
              <p className="text-[10px] text-muted-foreground">Unlock full features</p>
            </div>
          </div>
          <Button
            className="h-9 w-full rounded-xl bg-[#D61D1F] text-[11px] font-semibold text-white hover:bg-[#D61D1F]/90"
            onClick={onVerifyClick}
          >
            Verify Identity
          </Button>
        </div>
      )}

      <div className="my-5 h-px bg-border/50" />

      <section>
        <h3 className="text-[13px] font-semibold text-foreground">Verification Journey</h3>
        <div className="relative mt-4 space-y-2">
          <div className="absolute bottom-4 left-4 top-4 z-0 w-px bg-[#ECECEC]" aria-hidden="true" />

          {verificationSteps.map((step) => (
            <div key={step.id} className="relative z-10 flex items-start gap-3 pb-1 last:pb-0">
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border',
                  step.state === 'done' && 'border-[#F7CACA] bg-[#FFF3F3] text-[#D61D1F]',
                  step.state === 'current' && 'border-[#F2D8A0] bg-[#FFF7E6] text-amber-700',
                  step.state === 'upcoming' && 'border-[#ECECEC] bg-white text-muted-foreground',
                )}
              >
                {step.state === 'done' ? (
                  step.type === 'shield' ? (
                    <ShieldCheck className="h-4 w-4" weight="fill" />
                  ) : (
                    <Check className="h-4 w-4" weight="bold" />
                  )
                ) : step.state === 'current' ? (
                  <div className="h-2.5 w-2.5 rounded-full bg-current" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-current/80" />
                )}
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[12px] font-medium text-foreground">{step.label}</p>
                <p className="text-[10px] text-muted-foreground">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Card>
  );
}

function ProfileMainFeed() {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-[#ECECEC] bg-black">
        <div className="aspect-[16/7] min-h-[220px]">
          <div className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[10px] font-medium text-white/90">
            Intro Reel
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
            <h3 className="text-balance text-[18px] font-semibold text-white">Video Introduction</h3>
            <p className="text-pretty text-[11px] text-white/80">Showcasing personality and range</p>
          </div>
        </div>
      </div>

      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#F5F6F8] text-muted-foreground">
              <User className="size-4.5" weight="fill" />
            </div>
            <h3 className="text-balance text-[14px] font-semibold text-foreground">About</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit about section"
            className="size-8 rounded-full text-muted-foreground hover:bg-muted"
          >
            <PencilSimple className="size-4" />
          </Button>
        </div>
        <p className="text-pretty text-[13px] leading-6 text-muted-foreground">{mockProfile.bio}</p>
      </Card>

      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#F5F6F8] text-muted-foreground">
              <Camera className="size-4.5" weight="fill" />
            </div>
            <h3 className="text-balance text-[14px] font-semibold text-foreground">Headshots</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Add headshot"
            className="size-8 rounded-full text-muted-foreground hover:bg-muted"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {mockProfile.headshots.map((src) => (
            <div key={src} className="aspect-[3/4] overflow-hidden rounded-xl bg-muted">
              <img src={src} alt="Headshot" className="size-full object-cover" />
            </div>
          ))}
          <button
            type="button"
            aria-label="Upload a new headshot"
            className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#ECECEC] bg-[#FCFCFC] text-muted-foreground"
          >
            <Camera className="size-5" />
            <span className="text-[11px] font-medium">Add New</span>
          </button>
        </div>
      </Card>

      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#F5F6F8] text-muted-foreground">
              <Microphone className="size-4.5" weight="fill" />
            </div>
            <h3 className="text-balance text-[14px] font-semibold text-foreground">Voice</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Add voice sample"
            className="size-8 rounded-full text-muted-foreground hover:bg-muted"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {mockProfile.voiceSamples.map((sample) => (
            <div
              key={sample.title}
              className="flex items-center gap-3 rounded-xl border border-[#ECECEC] bg-[#FCFCFC] p-3"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#D61D1F] text-white">
                <Play className="ml-0.5 size-4" weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-[13px] font-medium text-foreground">{sample.title}</h4>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-muted" />
                  <span className="font-inter-numeric tabular-nums text-[10px] text-muted-foreground">
                    {sample.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#F5F6F8] text-muted-foreground">
              <Briefcase className="size-4.5" weight="fill" />
            </div>
            <h3 className="text-balance text-[14px] font-semibold text-foreground">Credits</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Add credit"
            className="size-8 rounded-full text-muted-foreground hover:bg-muted"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <div className="relative ml-2 space-y-0 before:absolute before:inset-y-2 before:left-1 before:w-px before:bg-[#ECECEC]">
          {mockProfile.experience.map((job, index) => (
            <div key={`${job.title}-${index}`} className="relative py-3 pl-8 first:pt-0 last:pb-0">
              <div className="absolute left-0 top-[18px] size-2.5 rounded-full bg-muted-foreground/30 ring-4 ring-background" />
              <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h4 className="text-[14px] font-semibold text-foreground">{job.title}</h4>
                <span className="font-inter-numeric tabular-nums rounded-md border border-[#ECECEC] bg-[#FCFCFC] px-2 py-0.5 text-[11px] text-muted-foreground">
                  {job.year}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <span className="font-medium text-foreground/80">{job.role}</span>
                <span className="size-1 rounded-full bg-muted-foreground/40" />
                <span>{job.production}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#F5F6F8] text-muted-foreground">
              <LinkIcon className="size-4.5" weight="fill" />
            </div>
            <h3 className="text-balance text-[14px] font-semibold text-foreground">Work and Links</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Add work link"
            className="size-8 rounded-full text-muted-foreground hover:bg-muted"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {mockProfile.workLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[#ECECEC] bg-[#FCFCFC] p-2.5"
            >
              <div className="flex size-9 min-w-9 items-center justify-center rounded-lg border border-[#ECECEC] bg-white text-muted-foreground">
                <Globe className="size-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-[13px] font-medium text-foreground">{link.title}</h4>
                <p className="truncate text-[11px] text-muted-foreground">{link.url}</p>
              </div>
              <CaretRight className="size-4 text-muted-foreground/50" />
            </a>
          ))}
        </div>
        <button
          type="button"
          className="mt-3 w-full rounded-xl border border-[#ECECEC] bg-[#FCFCFC] py-2 text-[12px] font-medium text-foreground"
        >
          Add New Link
        </button>
      </Card>
    </div>
  );
}

function ProfileSupportRail() {
  const manageActions = [
    {
      id: 'edit',
      label: 'Edit Details',
      detail: 'Update bio, links, and credits',
      icon: PencilSimple,
      tone: 'text-[#0052FF] bg-[#0052FF]/10',
      onClick: () => toast.info('Edit mode coming soon'),
    },
    {
      id: 'share',
      label: 'Share Profile',
      detail: 'Copy public profile URL',
      icon: ShareNetwork,
      tone: 'text-emerald-600 bg-emerald-500/10',
      onClick: () => toast.success('Profile link copied!'),
    },
    {
      id: 'settings',
      label: 'Settings',
      detail: 'Privacy and notification controls',
      icon: GearSix,
      tone: 'text-amber-700 bg-amber-500/10',
      link: '/dashboard/settings',
    },
  ] as const;

  return (
    <>
      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-foreground">Profile Strength</h3>
          <span className="font-inter-numeric tabular-nums text-[13px] font-semibold text-foreground">85%</span>
        </div>
        <Progress value={85} className="h-2" />
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#ECECEC] bg-[#FCFCFC] p-3">
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <VideoCamera className="size-3.5" weight="duotone" />
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-foreground">Add a Showreel</h4>
            <p className="mt-0.5 text-pretty text-[10px] text-muted-foreground">
              Profiles with showreels get 3x more views.
            </p>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <GearSix className="h-4 w-4 text-[#0052FF]" weight="fill" />
          <h3 className="text-balance text-[13px] font-semibold text-foreground">Manage Profile</h3>
        </div>

        <div className="space-y-3">
          {manageActions.map((item) => {
            const content = (
              <div className="flex items-center gap-3 rounded-xl">
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', item.tone)}>
                  <item.icon className="h-4 w-4" weight="fill" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-foreground">{item.label}</p>
                  <p className="text-pretty text-[10px] text-muted-foreground">{item.detail}</p>
                </div>
                <CaretRight className="h-3.5 w-3.5 text-muted-foreground/60" />
              </div>
            );

            if (item.link) {
              return (
                <Link key={item.id} to={item.link} className="block">
                  {content}
                </Link>
              );
            }

            return (
              <button key={item.id} type="button" onClick={item.onClick} className="block w-full text-left">
                {content}
              </button>
            );
          })}
        </div>

        <div className="my-4 h-px bg-border/50" />
        <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
          <Lock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" weight="fill" />
          <p className="text-pretty">Your personal contact information is hidden. Studios can only reach you through the platform.</p>
        </div>
      </Card>

    </>
  );
}

export default function ProfilePage() {
  const user = storage.getUser();
  const [verificationStep, setVerificationStep] = useState<VerificationStep>(
    user?.verificationStatus === 'verified' ? 'verified' : 'profile',
  );
  const [isVerificationDrawerOpen, setIsVerificationDrawerOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const submitVerification = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = window.setInterval(() => {
      setScanProgress((previous) => {
        const next = previous + 5;

        if (next >= 100) {
          window.clearInterval(interval);

          window.setTimeout(() => {
            setIsScanning(false);
            if (!user) return;

            const updatedUser = { ...user, verificationStatus: 'verified' as const, verified: true };
            storage.setUser(updatedUser);
            setVerificationStep('verified');
            setIsVerificationDrawerOpen(false);
            toast.success('Identity verification completed successfully');
          }, 600);

          return 100;
        }

        return next;
      });
    }, 120);
  };

  return (
    <DashboardLayout
      className="h-dvh overflow-hidden bg-[#F9F9F9]"
      fullWidth
      transparentNav
      navContentClassName="mx-auto w-[85%]"
    >
      <div className="mx-auto flex h-[calc(100dvh-6.5rem)] w-[85%] gap-6 overflow-hidden">
        <div className="hide-scrollbar hidden h-full w-72 flex-shrink-0 space-y-4 overflow-y-auto pb-6 lg:block">
          <ProfileSidebar
            userName={user?.name || 'Jane Doe'}
            verificationStep={verificationStep}
            onVerifyClick={() => setIsVerificationDrawerOpen(true)}
          />
          <ProfileSupportRail />
        </div>

        <div className="hide-scrollbar h-full min-w-0 flex-1 overflow-y-auto pb-6 pr-1">
          <div className="space-y-4 lg:hidden">
            <ProfileSidebar
              userName={user?.name || 'Jane Doe'}
              verificationStep={verificationStep}
              onVerifyClick={() => setIsVerificationDrawerOpen(true)}
            />
            <ProfileSupportRail />
          </div>

          <div className="mt-4 lg:mt-0">
            <ProfileMainFeed />
          </div>
        </div>
      </div>

      <Dialog open={isVerificationDrawerOpen} onOpenChange={setIsVerificationDrawerOpen}>
        <DialogContent className="max-w-lg gap-0 overflow-hidden rounded-3xl border border-[#ECECEC] bg-white p-0">
          <div className="px-8 pb-4 pt-8 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#D61D1F]/10 text-[#D61D1F]">
              <ShieldCheck className="size-8" weight="duotone" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-balance text-center text-2xl font-bold text-foreground">
                Verify Your Identity
              </DialogTitle>
              <DialogDescription className="text-pretty mt-2 text-center text-base text-muted-foreground">
                Get your Cast ID badge to access premium roles and protect your digital likeness.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-4 px-8">
            <div className="flex gap-4 rounded-2xl border border-[#ECECEC] bg-[#FCFCFC] p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#ECECEC] bg-white text-sm font-semibold text-muted-foreground">
                1
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Identity Document</h4>
                <p className="text-sm text-muted-foreground">Upload Aadhar Card, PAN Card, or Passport</p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border border-[#ECECEC] bg-[#FCFCFC] p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#ECECEC] bg-white text-sm font-semibold text-muted-foreground">
                2
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Professional Proof</h4>
                <p className="text-sm text-muted-foreground">
                  Link to IMDb, CINTAA card, or representation agreement
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-50 p-4 text-xs leading-relaxed text-amber-700">
              <WarningCircle className="size-5 shrink-0" weight="fill" />
              <p>Verification usually takes 24 to 48 hours. Your data is encrypted and securely stored.</p>
            </div>
          </div>

          <DialogFooter className="p-8 pt-6 sm:justify-center">
            {isScanning ? (
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-2 text-foreground">
                    <div className="size-2 rounded-full bg-[#D61D1F] animate-pulse" />
                    Verifying Biometrics...
                  </span>
                  <span className="font-inter-numeric tabular-nums">{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
                <p className="text-center text-xs text-muted-foreground">Please do not close this window</p>
              </div>
            ) : (
              <Button
                className="h-12 w-full rounded-xl bg-[#D61D1F] text-base font-semibold text-white hover:bg-[#D61D1F]/90"
                onClick={submitVerification}
              >
                Start Verification Scan
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
