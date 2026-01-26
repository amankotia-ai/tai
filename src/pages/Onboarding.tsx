import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Envelope, 
  Lock, 
  User as UserIcon, 
  MaskHappy, 
  Buildings, 
  UsersThree, 
  Scales,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Spinner,
  IdentificationBadge,
  FilmStrip
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { storage, User } from '@/lib/store';
import { cn } from '@/lib/utils';

type Role = 'actor' | 'studio' | 'agency' | 'lawyer';

const roles = [
  { 
    id: 'actor' as Role, 
    label: 'Actor / Artist', 
    icon: MaskHappy, 
    description: 'Protect your voice, face, and digital likeness',
    verificationLabel: 'Link your IMDb Profile'
  },
  { 
    id: 'studio' as Role, 
    label: 'Studio', 
    icon: Buildings, 
    description: 'License talent rights with verified consent',
    verificationLabel: 'Verify Company Registration'
  },
  { 
    id: 'agency' as Role, 
    label: 'Agency', 
    icon: UsersThree, 
    description: 'Manage your roster\'s digital assets',
    verificationLabel: 'Link Agency Credentials'
  },
  { 
    id: 'lawyer' as Role, 
    label: 'Legal / Lawyer', 
    icon: Scales, 
    description: 'Review and draft AI-powered contracts',
    verificationLabel: 'Verify Bar Council ID'
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [verificationId, setVerificationId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleNextStep = () => {
    setStep(step + 1);
    storage.setOnboardingStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    storage.setOnboardingStep(step - 1);
  };

  const handleVerification = async () => {
    setIsVerifying(true);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsVerifying(false);
    setIsVerified(true);
  };

  const handleComplete = () => {
    const user: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role: selectedRole!,
      verified: true,
      verificationId,
    };
    storage.setUser(user);
    navigate('/dashboard');
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <ShieldCheck className="w-8 h-8 text-primary" weight="duotone" />
            <span className="text-xl font-bold">theatre.ai</span>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>

          {/* Step 1: Account Creation */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold mb-2">Create your account</h1>
              <p className="text-muted-foreground mb-8">Get started with theatre.ai in seconds</p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative mt-1.5">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-1.5">
                    <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full gap-2 mt-4"
                  onClick={handleNextStep}
                  disabled={!name || !email || !password}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Role Selection */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold mb-2">Select your role</h1>
              <p className="text-muted-foreground mb-8">This helps us personalize your experience</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      selectedRole === role.id 
                        ? "border-primary bg-primary/10 glow-primary" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <role.icon className={cn(
                      "w-8 h-8 mb-3",
                      selectedRole === role.id ? "text-primary" : "text-muted-foreground"
                    )} weight="duotone" />
                    <h3 className="font-semibold text-sm mb-1">{role.label}</h3>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handlePrevStep} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  onClick={handleNextStep}
                  disabled={!selectedRole}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Professional Verification */}
          {step === 3 && selectedRoleData && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold mb-2">Professional Verification</h1>
              <p className="text-muted-foreground mb-8">
                Verify your credentials to unlock full platform access
              </p>
              
              <div className="p-6 rounded-xl border border-border bg-card mb-6">
                <div className="flex items-center gap-4 mb-4">
                  {selectedRole === 'actor' ? (
                    <FilmStrip className="w-10 h-10 text-primary" weight="duotone" />
                  ) : (
                    <IdentificationBadge className="w-10 h-10 text-primary" weight="duotone" />
                  )}
                  <div>
                    <h3 className="font-semibold">{selectedRoleData.verificationLabel}</h3>
                    <p className="text-sm text-muted-foreground">This helps establish trust</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>
                      {selectedRole === 'actor' ? 'IMDb Profile URL' : 
                       selectedRole === 'lawyer' ? 'Bar Council ID' :
                       'Registration Number'}
                    </Label>
                    <Input 
                      className="mt-1.5"
                      value={verificationId}
                      onChange={(e) => setVerificationId(e.target.value)}
                      placeholder={
                        selectedRole === 'actor' ? 'https://www.imdb.com/name/nm...' :
                        selectedRole === 'lawyer' ? 'BAR/2024/12345' :
                        'REG-2024-XXXXX'
                      }
                    />
                  </div>
                  
                  {!isVerified ? (
                    <Button 
                      className="w-full gap-2"
                      onClick={handleVerification}
                      disabled={!verificationId || isVerifying}
                    >
                      {isVerifying ? (
                        <>
                          <Spinner className="w-4 h-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify Credentials'
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-accent">
                      <CheckCircle className="w-5 h-5" weight="fill" />
                      <span className="font-medium">Verified Successfully</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handlePrevStep} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  onClick={handleNextStep}
                  disabled={!isVerified}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="animate-fade-in text-center">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-accent" weight="fill" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Welcome to theatre.ai!</h1>
              <p className="text-muted-foreground mb-8">
                Your account is verified and ready. Let's secure your digital identity.
              </p>
              
              <div className="p-4 rounded-xl border border-border bg-card mb-6 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{selectedRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-accent">
                  <ShieldCheck className="w-4 h-4" weight="fill" />
                  <span>Verified Professional</span>
                </div>
              </div>

              <Button 
                className="w-full gap-2 glow-primary"
                onClick={handleComplete}
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Sign in link */}
          {step === 1 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/signin')}>
                Sign in
              </Button>
            </p>
          )}
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative flex items-center justify-center w-full p-16">
          <div className="text-center">
            <ShieldCheck className="w-24 h-24 text-primary mx-auto mb-8" weight="duotone" />
            <h2 className="text-3xl font-bold mb-4">Secure Your Digital Future</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Join 50,000+ artists protecting their voice, face, and likeness with theatre.ai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
