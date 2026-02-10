import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Buildings,
  CheckCircle,
  Envelope,
  FileText,
  Fingerprint,
  IdentificationBadge,
  Lock,
  MaskHappy,
  Scales,
  ShieldCheck,
  Spinner,
  User as UserIcon,
  UsersThree,
  WarningCircle,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, storage } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Role = 'actor' | 'studio' | 'agency' | 'lawyer';
type IdentityState = 'uploading' | 'submitted' | 'review' | 'approved' | 'rejected';

const roles = [
  {
    id: 'actor' as Role,
    label: 'Actor / Artist',
    icon: MaskHappy,
    description: 'Protect voice, likeness, and motion rights',
    verificationLabel: 'IMDb or professional profile URL',
  },
  {
    id: 'studio' as Role,
    label: 'Studio',
    icon: Buildings,
    description: 'Discover pre-cleared talent and generate licenses',
    verificationLabel: 'Company registration number',
  },
  {
    id: 'agency' as Role,
    label: 'Agency',
    icon: UsersThree,
    description: 'Represent talent and coordinate contracts',
    verificationLabel: 'Agency credential identifier',
  },
  {
    id: 'lawyer' as Role,
    label: 'Legal / Lawyer',
    icon: Scales,
    description: 'Review clauses and compliance workflows',
    verificationLabel: 'Bar council or legal ID',
  },
];

const identityTimeline: IdentityState[] = ['uploading', 'submitted', 'review', 'approved'];

function identityLabel(state: IdentityState): string {
  if (state === 'uploading') return 'Uploading';
  if (state === 'submitted') return 'Submitted';
  if (state === 'review') return 'In Review';
  if (state === 'approved') return 'Approved';
  return 'Rejected';
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [verificationId, setVerificationId] = useState('');
  const [identityState, setIdentityState] = useState<IdentityState>('uploading');
  const [professionalVerified, setProfessionalVerified] = useState(false);
  const [isVerifyingProfessional, setIsVerifyingProfessional] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'paid' | 'failed'>('idle');
  const [onboardingError, setOnboardingError] = useState<string | null>(null);

  const selectedRoleData = roles.find((role) => role.id === selectedRole) || null;
  const studioHasPlanStep = selectedRole === 'studio';
  const totalSteps = studioHasPlanStep ? 5 : 4;

  const goNext = () => {
    const nextStep = Math.min(step + 1, totalSteps);
    setStep(nextStep);
    storage.setOnboardingStep(nextStep);
  };

  const goBack = () => {
    const nextStep = Math.max(step - 1, 1);
    setStep(nextStep);
    storage.setOnboardingStep(nextStep);
  };

  const runProfessionalVerification = async () => {
    if (!verificationId.trim()) {
      setOnboardingError('Professional verification field cannot be empty.');
      return;
    }
    setOnboardingError(null);
    setIsVerifyingProfessional(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfessionalVerified(true);
    setIsVerifyingProfessional(false);
  };

  const moveIdentityState = (nextState: IdentityState) => {
    setIdentityState(nextState);
    if (nextState === 'rejected') {
      setOnboardingError('Document rejected. Upload a clearer identity document and resubmit.');
      return;
    }
    setOnboardingError(null);
  };

  const runStudioCheckout = () => {
    setPaymentState('processing');
    window.setTimeout(() => {
      setPaymentState('paid');
      toast.success('Studio plan activated successfully.');
    }, 1100);
  };

  const completeOnboarding = () => {
    if (!selectedRole) return;

    const user: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role: selectedRole,
      verified: true,
      verificationId: verificationId || `CASTID-${Math.floor(Math.random() * 9000 + 1000)}`,
      verificationStatus: 'verified',
    };

    storage.setUser(user);
    storage.setOnboardingStep(1);
    navigate('/dashboard');
  };

  const verificationReady = identityState === 'approved' && professionalVerified;

  const progress = useMemo(() => {
    const value = Math.round((step / totalSteps) * 100);
    return Math.max(10, value);
  }, [step, totalSteps]);

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 px-6 py-12 lg:px-16 flex items-center">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-8 flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" weight="duotone" />
            <span className="text-xl font-bold">theatre.ai</span>
          </div>

          <div className="mb-6">
            <div className="mb-2 h-2 w-full rounded-full bg-border">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[12px] text-muted-foreground">Step {step} of {totalSteps}</p>
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm">Set up your Cast ID profile in a few steps.</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="onboarding-name">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="onboarding-name" value={name} onChange={(event) => setName(event.target.value)} className="h-10 rounded-xl pl-9" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="onboarding-email">Email</Label>
                  <div className="relative">
                    <Envelope className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="onboarding-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 rounded-xl pl-9" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="onboarding-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="onboarding-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-10 rounded-xl pl-9" />
                  </div>
                </div>
              </div>

              <Button className="h-10 rounded-xl" disabled={!name || !email || !password} onClick={goNext}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold">Select your role</h1>
                <p className="text-muted-foreground text-sm">Role controls your verification workflow and dashboard defaults.</p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      'rounded-2xl border p-4 text-left transition-colors',
                      selectedRole === role.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
                    )}
                  >
                    <role.icon className={cn('mb-2 h-6 w-6', selectedRole === role.id ? 'text-primary' : 'text-muted-foreground')} weight="duotone" />
                    <p className="text-[14px] font-semibold text-foreground">{role.label}</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">{role.description}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={goBack}><ArrowLeft className="mr-1.5 h-4 w-4" />Back</Button>
                <Button className="flex-1" disabled={!selectedRole} onClick={goNext}>Continue<ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {step === 3 && selectedRoleData && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold">Identity + Professional Verification</h1>
                <p className="text-muted-foreground text-sm">Complete identity and role-specific verification to unlock full access.</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[13px] font-semibold text-foreground">Identity Timeline</p>
                <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                  {identityTimeline.map((state) => {
                    const active = identityTimeline.indexOf(state) <= identityTimeline.indexOf(identityState);
                    return (
                      <button
                        key={state}
                        type="button"
                        onClick={() => moveIdentityState(state)}
                        className={cn(
                          'rounded-xl border px-2 py-2 text-[11px]',
                          active ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border text-muted-foreground',
                        )}
                      >
                        {identityLabel(state)}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => moveIdentityState('rejected')}
                    className="rounded-xl border border-destructive/30 bg-destructive/5 px-2 py-2 text-[11px] text-destructive"
                  >
                    Rejected
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[13px] font-semibold text-foreground">Professional Verification</p>
                <p className="text-[11px] text-muted-foreground">{selectedRoleData.verificationLabel}</p>
                <div className="mt-3 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="verification-id">Verification Identifier</Label>
                    <Input
                      id="verification-id"
                      value={verificationId}
                      onChange={(event) => setVerificationId(event.target.value)}
                      placeholder={selectedRole === 'actor' ? 'https://imdb.com/name/...' : 'REG-2026-XXXXX'}
                      className="h-10 rounded-xl"
                    />
                  </div>

                  <Button className="h-9 rounded-lg text-[12px]" disabled={isVerifyingProfessional} onClick={runProfessionalVerification}>
                    {isVerifyingProfessional ? (
                      <>
                        <Spinner className="mr-1.5 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <IdentificationBadge className="mr-1.5 h-4 w-4" />
                        Verify Credentials
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className={cn(
                'rounded-xl border p-3 text-[12px]',
                verificationReady
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700'
                  : 'border-amber-500/20 bg-amber-500/10 text-amber-700',
              )}>
                {verificationReady ? (
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" weight="fill" />Verification complete. Cast ID can be issued.</span>
                ) : (
                  <span className="flex items-center gap-1.5"><WarningCircle className="h-4 w-4" weight="fill" />Awaiting approval or professional verification completion.</span>
                )}
              </div>

              {onboardingError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-[12px] text-destructive">
                  {onboardingError}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={goBack}><ArrowLeft className="mr-1.5 h-4 w-4" />Back</Button>
                <Button className="flex-1" disabled={!verificationReady} onClick={goNext}>Continue<ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {step === 4 && studioHasPlanStep && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold">Studio Plan Activation</h1>
                <p className="text-muted-foreground text-sm">Complete paid activation to unlock discovery and licensing workflows.</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <div className="rounded-xl border border-[#ECECEC] bg-[#FAFAFA] p-3">
                  <p className="text-[13px] font-semibold text-foreground">Plan: Pro Studio</p>
                  <p className="text-[11px] text-muted-foreground">Razorpay checkout is simulated in frontend mode.</p>
                </div>

                <Button className="h-9 rounded-lg text-[12px]" disabled={paymentState === 'processing'} onClick={runStudioCheckout}>
                  {paymentState === 'processing' ? 'Processing payment...' : 'Run Checkout'}
                </Button>

                {paymentState === 'paid' && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-[12px] text-emerald-700">
                    <CheckCircle className="mr-1.5 inline h-4 w-4" weight="fill" />
                    Payment successful. Studio status: Paid + Verified.
                  </div>
                )}

                {paymentState === 'failed' && (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-[12px] text-destructive">
                    Payment failed. Retry checkout to continue.
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={goBack}><ArrowLeft className="mr-1.5 h-4 w-4" />Back</Button>
                <Button className="flex-1" disabled={paymentState !== 'paid'} onClick={goNext}>Continue<ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {((step === 4 && !studioHasPlanStep) || step === 5) && (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle className="h-10 w-10" weight="fill" />
              </div>

              <div>
                <h1 className="text-2xl font-bold">Verification Complete</h1>
                <p className="text-muted-foreground text-sm">Your Cast ID profile is ready and onboarding is complete.</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 text-left">
                <p className="text-[12px] text-muted-foreground">Issued Cast ID</p>
                <p className="font-inter-numeric tabular-nums text-[16px] font-semibold text-foreground">
                  CASTID-{Math.floor(Math.random() * 900000 + 100000)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-700">Identity Approved</span>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-700">Professional Verified</span>
                  {studioHasPlanStep && <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-700">Paid Plan Active</span>}
                </div>
              </div>

              <Button className="h-10 rounded-xl" onClick={completeOnboarding}>
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 1 && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button variant="link" className="h-auto p-0" onClick={() => navigate('/signin')}>
                Sign in
              </Button>
            </p>
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="relative flex w-full items-center justify-center p-16 text-center">
          <div>
            <ShieldCheck className="mx-auto mb-6 h-20 w-20 text-primary" weight="duotone" />
            <h2 className="text-3xl font-bold">Trust Loop Starts At Onboarding</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Verification, consent rules, and payment readiness are captured upfront so all usage stays transparent.
            </p>
            <div className="mt-6 flex justify-center gap-2 text-[11px]">
              <span className="rounded-full bg-background/70 px-2.5 py-1">Rules</span>
              <span className="rounded-full bg-background/70 px-2.5 py-1">Usage</span>
              <span className="rounded-full bg-background/70 px-2.5 py-1">Record</span>
            </div>
            <div className="mt-4 flex justify-center text-[11px] text-muted-foreground gap-3">
              <span className="inline-flex items-center gap-1"><Fingerprint className="h-3.5 w-3.5" />Identity</span>
              <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" />Consent</span>
              <span className="inline-flex items-center gap-1"><Buildings className="h-3.5 w-3.5" />Paid Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
