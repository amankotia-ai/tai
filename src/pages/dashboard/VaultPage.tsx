import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  UserCircle,
  Microphone,
  PersonArmsSpread,
  Globe,
  Clock,
  Lock,
  WarningCircle,
  FileText,
  CaretRight,
  CloudArrowUp,
  Eye,
  XCircle,
  ToggleLeft,
  ToggleRight
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
import { cn } from '@/lib/utils';
import { ConsentItem, VaultAsset, storage } from '@/lib/store';
import { toast } from 'sonner';

// --- Constants & Types ---
interface UsageLog {
  id: string;
  studioName: string;
  projectName: string;
  assetType: 'Voice' | 'Likeness' | 'Motion';
  date: string;
  context: string;
  duration: string;
  status: 'active' | 'completed';
  details?: {
    productionUnit: string;
    sessionID: string;
    authorizedPersonnel: string[];
    usageTerritory: string;
    scriptExcerpt?: string;
  };
}

const MOCK_USAGE_LOGS: UsageLog[] = [
  {
    id: 'l1',
    studioName: 'Universal Pictures',
    projectName: 'Neon Horizon 2049',
    assetType: 'Voice',
    date: 'Oct 24, 2025',
    context: 'ADR Sessions - Scene 40-45',
    duration: '4 Hours',
    status: 'completed',
    details: {
      productionUnit: 'Unit A - Post Production',
      sessionID: 'UNI-2025-X992',
      authorizedPersonnel: ['Sarah Connor (Director)', 'Mike Smith (Sound Eng)'],
      usageTerritory: 'Global Theatrical',
      scriptExcerpt: 'Main character monologue during the rain sequence.'
    }
  },
  {
    id: 'l2',
    studioName: 'Netflix Animation',
    projectName: 'Cyber Samurai',
    assetType: 'Likeness',
    date: 'Nov 12, 2025',
    context: 'Background Character Gen',
    duration: 'Active License',
    status: 'active',
    details: {
      productionUnit: 'Animation Studio 4',
      sessionID: 'NFLX-GEN-2210',
      authorizedPersonnel: ['Kenji Sato (Lead Animator)', 'System Automated'],
      usageTerritory: 'Worldwide Streaming',
      scriptExcerpt: 'Crowd generation for Neo-Tokyo street scenes.'
    }
  },
  {
    id: 'l3',
    studioName: 'Warner Bros. Games',
    projectName: 'Shadows of Gotham',
    assetType: 'Motion',
    date: 'Dec 05, 2025',
    context: 'Combat Animations',
    duration: 'Completed',
    status: 'completed',
    details: {
      productionUnit: 'Montreal Studio',
      sessionID: 'WB-MOCAP-8822',
      authorizedPersonnel: ['Combat Designer A', 'Animator B'],
      usageTerritory: 'Global Digital',
      scriptExcerpt: 'Takedown move set A.'
    }
  },
  {
    id: 'l4',
    studioName: 'HBO',
    projectName: 'The Last Frontier',
    assetType: 'Voice',
    date: 'Jan 15, 2026',
    context: 'Episode 4 Dialogue',
    duration: '2 Hours',
    status: 'completed',
    details: {
      productionUnit: 'Sound Stage 4',
      sessionID: 'HBO-VO-1123',
      authorizedPersonnel: ['Director X', 'Sound Eng Y'],
      usageTerritory: 'Global Broadcast',
      scriptExcerpt: 'Radio call scene.'
    }
  }
];

const MAX_ASSET_SIZE_BYTES = 250 * 1024 * 1024;
const SUPPORTED_EXTENSIONS = ['wav', 'obj', 'fbx', 'jpg', 'jpeg', 'png'] as const;
const VISIBILITY_OPTIONS: Array<NonNullable<VaultAsset['visibility']>> = ['private', 'public', 'request-only'];
const AI_TAG_SUGGESTIONS: Record<VaultAsset['type'], string[]> = {
  voice: ['neutral tone', 'clean vocals', 'english', 'long-form'],
  face: ['headshot', 'scan-ready', 'high detail', 'commercial'],
  motion: ['stunt', 'game-ready', 'combat', 'loop'],
};
const USE_CASE_OPTIONS = ['Games', 'TV/Film', 'Social', 'Political', 'Dubbing', 'Ads'] as const;
const TERRITORY_OPTIONS = ['North America', 'Europe', 'India', 'APAC', 'Worldwide'] as const;

type UploadStage = 'encrypting' | 'scanning' | 'uploading' | 'verifying' | 'completed';

interface UploadJob {
  id: string;
  assetName: string;
  fileName: string;
  fileSize: string;
  assetType: VaultAsset['type'];
  previewType: NonNullable<VaultAsset['previewType']>;
  fileExtension: string;
  isHeadshot: boolean;
  visibility: NonNullable<VaultAsset['visibility']>;
  metadataTags: string[];
  aiTags: string[];
  consentLabel: string;
  progress: number;
  stage: UploadStage;
  startedAt: string;
}

interface DisputeCase {
  id: string;
  usageLogId: string;
  reason: string;
  evidence: string;
  status: 'submitted' | 'under review' | 'resolved';
  createdAt: string;
}

const DEFAULT_SECURED_ASSETS: VaultAsset[] = [
  {
    id: 'seed-voice-1',
    name: 'Reference_Voice_2026.wav',
    type: 'voice',
    status: 'verified',
    uploadedAt: '2026-01-09T10:00:00.000Z',
    size: '24MB',
    visibility: 'request-only',
    metadataTags: ['dubbing', 'dramatic', 'english'],
    aiTags: ['clean vocals', 'studio grade'],
    previewType: 'audio',
    fileExtension: 'wav',
  },
  {
    id: 'seed-face-1',
    name: 'Head_Scan_Raw.obj',
    type: 'face',
    status: 'verified',
    uploadedAt: '2026-01-08T15:40:00.000Z',
    size: '156MB',
    visibility: 'private',
    metadataTags: ['full body', 'scan'],
    aiTags: ['high poly', 'neutral lighting'],
    previewType: '3d',
    fileExtension: 'obj',
  },
];

function formatVisibilityLabel(value: NonNullable<VaultAsset['visibility']>): string {
  if (value === 'request-only') return 'Request Only';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  }
  return `${Math.round((bytes / (1024 * 1024)) * 10) / 10}MB`;
}

function getFileExtension(fileName: string): string {
  const segments = fileName.split('.');
  if (segments.length < 2) return '';
  return segments[segments.length - 1].toLowerCase();
}

function getAssetTypeByExtension(extension: string): VaultAsset['type'] | null {
  if (extension === 'wav') return 'voice';
  if (extension === 'obj' || extension === 'jpg' || extension === 'jpeg' || extension === 'png') return 'face';
  if (extension === 'fbx') return 'motion';
  return null;
}

function getPreviewTypeByExtension(extension: string): NonNullable<VaultAsset['previewType']> {
  if (extension === 'wav') return 'audio';
  if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') return 'image';
  return '3d';
}

function getStageByProgress(progress: number): UploadStage {
  if (progress >= 100) return 'completed';
  if (progress >= 85) return 'verifying';
  if (progress >= 55) return 'uploading';
  if (progress >= 30) return 'scanning';
  return 'encrypting';
}

function getAssetTypeLabel(assetType: VaultAsset['type']): string {
  if (assetType === 'voice') return 'Voice';
  if (assetType === 'face') return 'Likeness';
  return 'Motion';
}

function formatAssetDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function initializeVaultAssets(): VaultAsset[] {
  const storedAssets = storage.getVaultAssets();
  if (storedAssets.length > 0) return storedAssets;

  DEFAULT_SECURED_ASSETS.forEach((asset) => storage.addVaultAsset(asset));
  return storage.getVaultAssets();
}

// --- Components ---

function VaultProfileOverviewCard({ consentItems }: { consentItems: ConsentItem[] }) {
  const user = storage.getUser();
  const conditionalConsents = consentItems.filter((item) => item.status === 'conditional').length;
  const activeLogs = MOCK_USAGE_LOGS.filter((log) => log.status === 'active').length;

  const statusItems = [
    {
      label: 'Conditional Rights',
      value: `${conditionalConsents} policies`,
      icon: Globe,
    },
    {
      label: 'Active Sessions',
      value: `${activeLogs} running`,
      icon: Clock,
    },
  ];

  const quickLinks = [
    { label: 'Open Profile', to: '/dashboard/profile' },
    { label: 'Review Consent', to: '/dashboard/vault' },
    { label: 'View Activity', to: '/dashboard/vault' },
  ];

  return (
    <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-muted ring-2 ring-background shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop"
              alt={user?.name || 'Profile'}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-foreground">{user?.name || 'Jane Smith'}</h3>
          <p className="text-[11px] capitalize text-muted-foreground">
            {(user?.role || 'actor')} vault profile
          </p>
        </div>

        <Link
          to="/dashboard/profile"
          aria-label="Open profile"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <CaretRight className="h-4 w-4" weight="bold" />
        </Link>
      </div>

      <div className="my-4 h-px bg-border/50" />

      <section>
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#0052FF]" weight="fill" />
          <h4 className="text-[13px] font-semibold text-foreground">Vault Health</h4>
        </div>
        <div className="space-y-3">
          {statusItems.map((item) => (
            <div key={item.label} className="flex min-w-0 items-center gap-3 rounded-xl">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground">
                <item.icon className="h-4 w-4" weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium leading-5 text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="my-5 h-px bg-border/50" />

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Eye className="h-4 w-4 text-[#0052FF]" weight="fill" />
          <h4 className="text-[13px] font-semibold text-foreground">Quick Access</h4>
        </div>
        <div className="space-y-2.5">
          {quickLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group flex items-center gap-3 rounded-xl text-[12px] font-medium text-foreground transition-colors hover:text-[#0052FF]"
            >
              <div className="size-2 rounded-full bg-muted-foreground/50 transition-colors group-hover:bg-[#0052FF]" />
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </Card>
  );
}

function ConsentDetailsModal({ item, onClose, onUpdate }: { item: ConsentItem; onClose: () => void; onUpdate: (id: string, updates: Partial<ConsentItem>) => void }) {
  const [status, setStatus] = useState<ConsentItem['status']>(item.status);
  const [duration, setDuration] = useState(item.conditions?.duration || 'Project Duration');
  const [expiryDate, setExpiryDate] = useState(item.conditions?.expiryDate || '');
  const [trainingPolicy, setTrainingPolicy] = useState<'allow-training' | 'inference-only' | 'disabled'>(item.conditions?.trainingPolicy || 'inference-only');
  const [inferenceAllowed, setInferenceAllowed] = useState(item.conditions?.inferenceAllowed ?? true);
  const [useCases, setUseCases] = useState<string[]>(item.conditions?.useCases || []);
  const [territories, setTerritories] = useState<string[]>(item.conditions?.territory || []);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);

  const isRevoked = status === 'revoked';

  const toggleSelection = (currentValues: string[], value: string, setter: (values: string[]) => void) => {
    if (currentValues.includes(value)) {
      setter(currentValues.filter((entry) => entry !== value));
      return;
    }
    setter([...currentValues, value]);
  };

  const savePolicy = (nextStatus: ConsentItem['status']) => {
    onUpdate(item.id, {
      status: nextStatus,
      conditions: {
        useCases,
        territory: territories,
        duration,
        expiryDate,
        trainingPolicy,
        inferenceAllowed,
      },
    });
    toast.success(nextStatus === 'revoked' ? 'Consent policy revoked' : 'Consent policy snapshot saved');
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0', isRevoked ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary')}>
          {item.category === 'voice' && <Microphone className="w-6 h-6" weight="fill" />}
          {item.category === 'likeness' && <UserCircle className="w-6 h-6" weight="fill" />}
          {item.category === 'motion' && <PersonArmsSpread className="w-6 h-6" weight="fill" />}
          {item.category === 'training' && <FileText className="w-6 h-6" weight="fill" />}
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{item.label}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Policy version: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/50 bg-card p-3">
            <p className="text-[11px] font-semibold text-foreground">Training Permission</p>
            <select
              className="mt-2 h-9 w-full rounded-lg border border-border bg-background px-2 text-[12px]"
              value={trainingPolicy}
              onChange={(event) => setTrainingPolicy(event.target.value as 'allow-training' | 'inference-only' | 'disabled')}
            >
              <option value="allow-training">Allow AI Training</option>
              <option value="inference-only">Inference Only</option>
              <option value="disabled">No Model Usage</option>
            </select>
          </div>

          <div className="rounded-xl border border-border/50 bg-card p-3">
            <p className="text-[11px] font-semibold text-foreground">Inference Access</p>
            <div className="mt-2 flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={inferenceAllowed ? 'default' : 'outline'}
                className="h-8 rounded-lg text-[11px]"
                onClick={() => setInferenceAllowed(true)}
              >
                Allowed
              </Button>
              <Button
                type="button"
                size="sm"
                variant={!inferenceAllowed ? 'default' : 'outline'}
                className="h-8 rounded-lg text-[11px]"
                onClick={() => setInferenceAllowed(false)}
              >
                Blocked
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-3">
          <p className="text-[11px] font-semibold text-foreground">Approved Use Cases</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {USE_CASE_OPTIONS.map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => toggleSelection(useCases, entry, setUseCases)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[11px]',
                  useCases.includes(entry) ? 'border-[#0052FF]/40 bg-[#0052FF]/10 text-[#0052FF]' : 'border-border bg-background text-muted-foreground',
                )}
              >
                {entry}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-3">
          <p className="text-[11px] font-semibold text-foreground">Territory</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TERRITORY_OPTIONS.map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => toggleSelection(territories, entry, setTerritories)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[11px]',
                  territories.includes(entry) ? 'border-[#0052FF]/40 bg-[#0052FF]/10 text-[#0052FF]' : 'border-border bg-background text-muted-foreground',
                )}
              >
                {entry}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/50 bg-card p-3">
            <p className="text-[11px] font-semibold text-foreground">Duration</p>
            <Input
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              className="mt-2 h-9 rounded-lg border-border text-[12px]"
              placeholder="e.g. 12 months"
            />
          </div>
          <div className="rounded-xl border border-border/50 bg-card p-3">
            <p className="text-[11px] font-semibold text-foreground">Consent Expiry Date</p>
            <Input
              type="date"
              value={expiryDate}
              onChange={(event) => setExpiryDate(event.target.value)}
              className="mt-2 h-9 rounded-lg border-border text-[12px]"
            />
          </div>
        </div>

        <div className={cn('flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px]', isRevoked ? 'border-destructive/20 bg-destructive/5 text-destructive' : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-700')}>
          {isRevoked ? <XCircle className="h-3.5 w-3.5" weight="fill" /> : <CheckCircle className="h-3.5 w-3.5" weight="fill" />}
          <span>{isRevoked ? 'This consent is currently revoked. Studios cannot use covered assets.' : 'Nothing can be used unless explicitly allowed in this policy.'}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button className="h-10 rounded-xl text-[12px]" onClick={() => savePolicy(status)}>
          Save Policy Snapshot
        </Button>
        {isRevoked ? (
          <Button
            variant="outline"
            className="h-10 rounded-xl text-[12px]"
            onClick={() => {
              setStatus('granted');
              savePolicy('granted');
            }}
          >
            Restore Consent
          </Button>
        ) : (
          <Button variant="destructive" className="h-10 rounded-xl text-[12px]" onClick={() => setShowRevokeConfirm(true)}>
            Revoke Consent
          </Button>
        )}
        <Button variant="outline" className="h-10 rounded-xl text-[12px]" onClick={onClose}>Cancel</Button>
      </div>

      <AlertDialog open={showRevokeConfirm} onOpenChange={setShowRevokeConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke This Consent Scope?</AlertDialogTitle>
            <AlertDialogDescription>
              Active licenses tied to this scope may be affected and move to conditional review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setStatus('revoked');
                savePolicy('revoked');
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ConsentMatrix({ items, onUpdate }: { items: ConsentItem[]; onUpdate: (id: string, updates: Partial<ConsentItem>) => void }) {
  const [openConsentId, setOpenConsentId] = useState<string | null>(null);

  return (
    <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
      <div className="mb-4">
        <h3 className="text-balance text-[13px] font-semibold text-foreground">Consent Matrix</h3>
        <p className="mt-1 text-pretty text-[11px] text-muted-foreground">
          Tap a card to edit granular and revocable permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((item) => (
          <Dialog
            key={item.id}
            open={openConsentId === item.id}
            onOpenChange={(isOpen) => setOpenConsentId(isOpen ? item.id : null)}
          >
            <DialogTrigger asChild>
              <Card className="group cursor-pointer rounded-2xl border border-[#ECECEC] bg-white p-5 transition-colors hover:border-[#DADADA]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F8F8]",
                      item.status === 'revoked' ? "text-muted-foreground" : "text-[#D61D1F]"
                    )}>
                      {item.category === 'voice' && <Microphone className="h-5 w-5" weight="duotone" />}
                      {item.category === 'likeness' && <UserCircle className="h-5 w-5" weight="duotone" />}
                      {item.category === 'motion' && <PersonArmsSpread className="h-5 w-5" weight="duotone" />}
                      {item.category === 'training' && <FileText className="h-5 w-5" weight="duotone" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-[13px] font-semibold leading-4 text-foreground">{item.label}</h4>
                      <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>

                  <div>
                    {item.status === 'revoked' ? (
                      <ToggleLeft className="h-8 w-8 text-muted-foreground" weight="duotone" />
                    ) : (
                      <ToggleRight className="h-8 w-8 text-[#D61D1F]" weight="fill" />
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                  <span className={cn("font-medium", item.status === 'revoked' ? "text-destructive" : "text-foreground")}>
                    {item.status === 'revoked' ? 'Revoked' : 'Active'}
                  </span>

                  {item.status !== 'revoked' && item.conditions && (
                    <>
                      <span aria-hidden="true">•</span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" />
                        <span className="font-inter-numeric tabular-nums">{item.conditions.territory.length}</span>
                        <span>{item.conditions.territory.length === 1 ? 'Region' : 'Regions'}</span>
                      </span>
                      {item.conditions.expiryDate && (
                        <>
                          <span aria-hidden="true">•</span>
                          <span className="font-inter-numeric tabular-nums">Expires {item.conditions.expiryDate}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border border-[#EAEAEA] bg-[#F9F9F9]">
              <ConsentDetailsModal item={item} onClose={() => setOpenConsentId(null)} onUpdate={onUpdate} />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </Card>
  );
}

function AssetVault({ consentItems }: { consentItems: ConsentItem[] }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadTimersRef = useRef<Record<string, ReturnType<typeof window.setInterval>>>({});
  const [assets, setAssets] = useState<VaultAsset[]>(initializeVaultAssets);
  const [uploadJobs, setUploadJobs] = useState<UploadJob[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingFileExtension, setPendingFileExtension] = useState('');
  const [pendingAssetName, setPendingAssetName] = useState('');
  const [pendingAssetType, setPendingAssetType] = useState<VaultAsset['type']>('voice');
  const [pendingPreviewType, setPendingPreviewType] = useState<NonNullable<VaultAsset['previewType']>>('audio');
  const [pendingIsHeadshot, setPendingIsHeadshot] = useState(false);
  const [pendingVisibility, setPendingVisibility] = useState<NonNullable<VaultAsset['visibility']>>('private');
  const [pendingMetadataInput, setPendingMetadataInput] = useState('');
  const [pendingMetadataTags, setPendingMetadataTags] = useState<string[]>([]);
  const [pendingAiTags, setPendingAiTags] = useState<string[]>([]);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string>('');
  const [pendingConsentId, setPendingConsentId] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const getConsentForAssetType = (assetType: VaultAsset['type']) => {
    if (assetType === 'voice') return consentItems.find((item) => item.category === 'voice');
    if (assetType === 'face') return consentItems.find((item) => item.category === 'likeness');
    return consentItems.find((item) => item.category === 'motion');
  };

  const resetDraft = () => {
    setPendingFile(null);
    setPendingFileExtension('');
    setPendingAssetName('');
    setPendingPreviewType('audio');
    setPendingIsHeadshot(false);
    setPendingVisibility('private');
    setPendingMetadataInput('');
    setPendingMetadataTags([]);
    setPendingAiTags([]);
    setPendingPreviewUrl('');
    setPendingConsentId('');
    setUploadError(null);
  };

  const prepareFileForUpload = (file: File) => {
    const extension = getFileExtension(file.name);
    const detectedAssetType = getAssetTypeByExtension(extension);

    if (!detectedAssetType || !SUPPORTED_EXTENSIONS.includes(extension as typeof SUPPORTED_EXTENSIONS[number])) {
      setUploadError('Unsupported file type. Upload .wav, .obj, .fbx, .jpg, .jpeg, or .png files only.');
      return;
    }

    if (file.size > MAX_ASSET_SIZE_BYTES) {
      setUploadError('File is too large. Maximum supported size is 250MB.');
      return;
    }

    const linkedConsent = getConsentForAssetType(detectedAssetType);
    if (!linkedConsent || linkedConsent.status === 'revoked') {
      setUploadError(`Cannot upload ${getAssetTypeLabel(detectedAssetType).toLowerCase()} assets while related consent is revoked.`);
      return;
    }

    setPendingFile(file);
    setPendingFileExtension(extension);
    setPendingAssetName(file.name);
    setPendingAssetType(detectedAssetType);
    setPendingPreviewType(getPreviewTypeByExtension(extension));
    setPendingIsHeadshot(extension === 'jpg' || extension === 'jpeg' || extension === 'png');
    setPendingVisibility('request-only');
    setPendingMetadataTags([]);
    setPendingAiTags(AI_TAG_SUGGESTIONS[detectedAssetType]);
    setPendingPreviewUrl(URL.createObjectURL(file));
    setPendingConsentId(linkedConsent.id);
    setUploadError(null);
  };

  const handleAddMetadataTag = () => {
    const normalizedTag = pendingMetadataInput.trim().toLowerCase();
    if (!normalizedTag) return;
    if (pendingMetadataTags.includes(normalizedTag)) {
      setPendingMetadataInput('');
      return;
    }
    setPendingMetadataTags((currentTags) => [...currentTags, normalizedTag]);
    setPendingMetadataInput('');
  };

  const removeMetadataTag = (tag: string) => {
    setPendingMetadataTags((currentTags) => currentTags.filter((entry) => entry !== tag));
  };

  const toggleAiTag = (tag: string) => {
    setPendingAiTags((currentTags) => (
      currentTags.includes(tag) ? currentTags.filter((entry) => entry !== tag) : [...currentTags, tag]
    ));
  };

  const updateAssetVisibility = (assetId: string, visibility: NonNullable<VaultAsset['visibility']>) => {
    storage.updateVaultAsset(assetId, { visibility });
    setAssets(storage.getVaultAssets());
    toast.success(`Visibility changed to ${formatVisibilityLabel(visibility)}`);
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    prepareFileForUpload(selectedFile);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (!droppedFile) return;
    prepareFileForUpload(droppedFile);
  };

  const handleStartUpload = () => {
    if (!pendingFile) {
      setUploadError('Choose a file before starting upload.');
      return;
    }

    const linkedConsent = consentItems.find((item) => item.id === pendingConsentId);
    if (!linkedConsent || linkedConsent.status === 'revoked') {
      setUploadError('Selected consent is not active. Update consent settings first.');
      return;
    }

    const normalizedAssetName = pendingAssetName.trim();
    if (!normalizedAssetName) {
      setUploadError('Asset name cannot be empty.');
      return;
    }

    const uploadJob: UploadJob = {
      id: `upload-${Date.now()}`,
      assetName: normalizedAssetName,
      fileName: pendingFile.name,
      fileSize: formatFileSize(pendingFile.size),
      assetType: pendingAssetType,
      previewType: pendingPreviewType,
      fileExtension: pendingFileExtension,
      isHeadshot: pendingIsHeadshot,
      visibility: pendingVisibility,
      metadataTags: pendingMetadataTags,
      aiTags: pendingAiTags,
      consentLabel: linkedConsent.label,
      progress: 8,
      stage: 'encrypting',
      startedAt: new Date().toISOString(),
    };

    setUploadJobs((currentJobs) => [uploadJob, ...currentJobs]);
    resetDraft();

    const timerId = window.setInterval(() => {
      let completedJob: UploadJob | null = null;

      setUploadJobs((currentJobs) => (
        currentJobs.map((job) => {
          if (job.id !== uploadJob.id || job.stage === 'completed') return job;

          const nextProgress = Math.min(job.progress + 12, 100);
          const updatedJob = {
            ...job,
            progress: nextProgress,
            stage: getStageByProgress(nextProgress),
          };

          if (nextProgress === 100) {
            completedJob = updatedJob;
          }

          return updatedJob;
        })
      ));

      if (!completedJob) return;

      window.clearInterval(uploadTimersRef.current[uploadJob.id]);
      delete uploadTimersRef.current[uploadJob.id];

      const finalizedAsset: VaultAsset = {
        id: `asset-${Date.now()}`,
        name: completedJob.assetName,
        type: completedJob.assetType,
        status: 'tamper-proof',
        uploadedAt: new Date().toISOString(),
        size: completedJob.fileSize,
        visibility: completedJob.visibility,
        metadataTags: completedJob.metadataTags,
        aiTags: completedJob.aiTags,
        previewType: completedJob.previewType,
        isHeadshot: completedJob.isHeadshot,
        fileExtension: completedJob.fileExtension,
      };

      storage.addVaultAsset(finalizedAsset);
      setAssets(storage.getVaultAssets());
      toast.success(`${completedJob.assetName} uploaded and secured.`);
    }, 500);

    uploadTimersRef.current[uploadJob.id] = timerId;
  };

  const handleCancelUpload = (jobId: string) => {
    const activeTimer = uploadTimersRef.current[jobId];
    if (activeTimer) {
      window.clearInterval(activeTimer);
      delete uploadTimersRef.current[jobId];
    }
    setUploadJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
    toast.message('Upload canceled');
  };

  useEffect(() => (
    () => {
      Object.values(uploadTimersRef.current).forEach((timerId) => window.clearInterval(timerId));
    }
  ), []);

  useEffect(() => (
    () => {
      if (pendingPreviewUrl) {
        URL.revokeObjectURL(pendingPreviewUrl);
      }
    }
  ), [pendingPreviewUrl]);

  const sortedAssets = [...assets].sort((first, second) => (
    new Date(second.uploadedAt).getTime() - new Date(first.uploadedAt).getTime()
  ));

  const getAssetIcon = (assetType: VaultAsset['type']) => {
    if (assetType === 'voice') return Microphone;
    if (assetType === 'face') return UserCircle;
    return PersonArmsSpread;
  };

  const getAssetStatusLabel = (status: VaultAsset['status']) => {
    if (status === 'tamper-proof' || status === 'verified') return 'Verified';
    if (status === 'scanning') return 'Scanning';
    return 'Pending';
  };

  const getAssetStatusTextClasses = (status: VaultAsset['status']) => {
    if (status === 'tamper-proof' || status === 'verified') {
      return 'text-foreground';
    }
    if (status === 'scanning') {
      return 'text-muted-foreground';
    }
    return 'text-muted-foreground';
  };

  const isConsentRevokedForAssetType = (assetType: VaultAsset['type']) => (
    getConsentForAssetType(assetType)?.status === 'revoked'
  );

  const pendingConsentLabel = consentItems.find((item) => item.id === pendingConsentId)?.label;

  return (
    <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-balance text-[13px] font-semibold text-foreground flex items-center gap-2">
            Digital Asset Vault
            <Lock className="w-4 h-4 text-muted-foreground" weight="duotone" />
          </h3>
          <p className="mt-1 text-pretty text-[11px] text-muted-foreground">
            Upload and store actor-approved assets. Zero generation inside product.
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".wav,.obj,.fbx,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Upload Area */}
      <div
        className={cn(
          "mt-4 flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#ECECEC] bg-muted/30 p-6 text-center transition-colors",
          isDragActive && "border-[#0052FF]/40 bg-[#0052FF]/5",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragActive(false);
        }}
        onDrop={handleDrop}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <CloudArrowUp className="h-7 w-7 text-muted-foreground" />
        </div>
        <h4 className="mb-2 text-[14px] font-semibold text-foreground">Drop biometric assets here</h4>
        <p className="text-pretty px-4 text-[11px] text-muted-foreground">
          Supports .wav (Voice), .obj/.fbx (3D), .jpg/.png (Headshots). Maximum 250MB per file.
        </p>
        <p className="mt-2 text-[11px] font-medium text-[#D61D1F]">
          Assets are explicitly tied to consent terms.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 h-8 rounded-full px-4 text-[11px]"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose File
        </Button>
      </div>

      {uploadError && (
        <p className="mt-2 text-[11px] text-destructive">{uploadError}</p>
      )}

      {pendingFile && (
        <Card className="mt-4 rounded-2xl border border-[#ECECEC] bg-[#FCFCFC] p-4">
          <h4 className="text-[12px] font-semibold text-foreground">Review Upload</h4>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Confirm metadata before secure encryption and policy binding.
          </p>

          <div className="mt-3 space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Asset Name</label>
              <Input
                value={pendingAssetName}
                onChange={(event) => setPendingAssetName(event.target.value)}
                className="h-9 rounded-xl border-[#ECECEC] bg-white text-[12px]"
                placeholder="Asset name"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#ECECEC] bg-white px-3 py-2">
                <p className="text-[10px] text-muted-foreground">Detected Type</p>
                <p className="mt-0.5 text-[12px] font-medium text-foreground">{getAssetTypeLabel(pendingAssetType)}</p>
              </div>
              <div className="rounded-xl border border-[#ECECEC] bg-white px-3 py-2">
                <p className="text-[10px] text-muted-foreground">Linked Consent</p>
                <p className="mt-0.5 truncate text-[12px] font-medium text-foreground">{pendingConsentLabel || 'Not linked'}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Visibility</label>
              <select
                className="h-9 w-full rounded-xl border border-[#ECECEC] bg-white px-3 text-[12px]"
                value={pendingVisibility}
                onChange={(event) => setPendingVisibility(event.target.value as NonNullable<VaultAsset['visibility']>)}
              >
                {VISIBILITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {formatVisibilityLabel(option)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Metadata Tags</label>
              <div className="flex gap-2">
                <Input
                  value={pendingMetadataInput}
                  onChange={(event) => setPendingMetadataInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleAddMetadataTag();
                    }
                  }}
                  className="h-9 rounded-xl border-[#ECECEC] bg-white text-[12px]"
                  placeholder="Add tag and press Enter"
                />
                <Button type="button" variant="outline" className="h-9 rounded-xl text-[11px]" onClick={handleAddMetadataTag}>
                  Add
                </Button>
              </div>

              {pendingMetadataTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {pendingMetadataTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeMetadataTag(tag)}
                      className="rounded-full border border-[#ECECEC] bg-white px-2 py-1 text-[10px] text-foreground"
                    >
                      {tag} x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">AI-Suggested Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {AI_TAG_SUGGESTIONS[pendingAssetType].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleAiTag(tag)}
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-[10px]',
                      pendingAiTags.includes(tag)
                        ? 'border-[#0052FF]/40 bg-[#0052FF]/10 text-[#0052FF]'
                        : 'border-[#ECECEC] bg-white text-muted-foreground',
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#ECECEC] bg-white p-3">
              <p className="text-[10px] text-muted-foreground">Preview</p>
              {pendingPreviewType === 'audio' && pendingPreviewUrl && (
                <audio controls className="mt-2 w-full">
                  <source src={pendingPreviewUrl} type="audio/wav" />
                </audio>
              )}
              {pendingPreviewType === 'image' && pendingPreviewUrl && (
                <img src={pendingPreviewUrl} alt="Headshot preview" className="mt-2 h-24 w-full rounded-lg object-cover" />
              )}
              {pendingPreviewType === '3d' && (
                <div className="mt-2 rounded-lg border border-dashed border-[#ECECEC] bg-[#FAFAFA] px-3 py-4 text-[11px] text-muted-foreground">
                  3D preview widget ready ({pendingFileExtension.toUpperCase()}). Render is simulated in frontend-only mode.
                </div>
              )}
              {pendingIsHeadshot && (
                <p className="mt-2 text-[10px] text-muted-foreground">Headshot asset detected for profile visibility controls.</p>
              )}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-8 flex-1 rounded-xl text-[11px]"
              onClick={resetDraft}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-8 flex-1 rounded-xl bg-[#0052FF] text-[11px] text-white hover:bg-[#0046DB]"
              onClick={handleStartUpload}
            >
              Start Secure Upload
            </Button>
          </div>
        </Card>
      )}

      {uploadJobs.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="text-[11px] font-semibold text-muted-foreground">Upload Pipeline</h4>
          {uploadJobs.map((job) => (
            <Card key={job.id} className="rounded-2xl border border-[#ECECEC] bg-[#FCFCFC] p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold text-foreground">{job.assetName}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {job.fileSize} • {job.consentLabel} • {formatVisibilityLabel(job.visibility)}
                  </p>
                </div>
                {job.stage === 'completed' ? (
                  <Badge className="h-5 border-none bg-emerald-500/10 px-2 text-[10px] font-medium text-emerald-600">
                    Complete
                  </Badge>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-6 rounded-full px-2.5 text-[10px] text-muted-foreground hover:bg-muted/60"
                    onClick={() => handleCancelUpload(job.id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="capitalize">{job.stage}</span>
                <span className="font-inter-numeric tabular-nums">{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="mt-1.5 h-2 bg-muted" />
            </Card>
          ))}
        </div>
      )}

      {/* Asset List */}
      <div className="mt-4 space-y-3.5">
        <h4 className="text-[11px] font-semibold text-muted-foreground">Secured Assets</h4>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {sortedAssets.map((asset) => {
            const isRevoked = isConsentRevokedForAssetType(asset.type);
            const AssetIcon = getAssetIcon(asset.type);
            const linkedConsent = getConsentForAssetType(asset.type);
            const uploadedLabel = formatAssetDateLabel(asset.uploadedAt);

            return (
              <div
                key={asset.id}
                className={cn(
                  "relative rounded-2xl border border-[#ECECEC] bg-white p-4 md:p-5",
                  isRevoked && "opacity-60 grayscale",
                )}
              >
                {isRevoked && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl border border-destructive/20 bg-background/50 backdrop-blur-[1px]">
                    <div className="flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive shadow-sm">
                      <Lock className="h-3 w-3" weight="fill" /> Access Revoked
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F8F8]">
                      <AssetIcon className="h-5 w-5 text-muted-foreground" weight="duotone" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[13px] font-semibold leading-4 text-foreground">{asset.name}</p>
                        <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px]">
                          {(asset.status === 'tamper-proof' || asset.status === 'verified') && (
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" weight="fill" />
                          )}
                          <span className={cn('font-medium', getAssetStatusTextClasses(asset.status))}>
                            {getAssetStatusLabel(asset.status)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground">{linkedConsent?.label || 'No consent linked'}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#ECECEC] bg-[#FCFCFC] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] text-muted-foreground">Visibility</p>
                      <select
                        className="h-7 rounded-lg border border-[#ECECEC] bg-white px-2 text-[10px]"
                        disabled={isRevoked}
                        value={(asset.visibility || 'private') as NonNullable<VaultAsset['visibility']>}
                        onChange={(event) => updateAssetVisibility(asset.id, event.target.value as NonNullable<VaultAsset['visibility']>)}
                      >
                        {VISIBILITY_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {formatVisibilityLabel(option)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-2 rounded-lg border border-dashed border-[#ECECEC] bg-white p-2 text-[10px] text-muted-foreground">
                      {asset.previewType === 'audio' && 'Audio preview widget available for secure playback.'}
                      {asset.previewType === '3d' && `3D preview widget attached (${(asset.fileExtension || 'OBJ').toUpperCase()}).`}
                      {asset.previewType === 'image' && 'Headshot preview available with profile visibility controls.'}
                      {!asset.previewType && 'Preview is available in secure viewer mode.'}
                    </div>

                    {(asset.metadataTags?.length || asset.aiTags?.length) ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(asset.metadataTags || []).map((tag) => (
                          <span key={`${asset.id}-meta-${tag}`} className="rounded-full border border-[#ECECEC] bg-white px-2 py-1 text-[10px] text-foreground">
                            {tag}
                          </span>
                        ))}
                        {(asset.aiTags || []).map((tag) => (
                          <span key={`${asset.id}-ai-${tag}`} className="rounded-full border border-[#DCE7FF] bg-[#EDF3FF] px-2 py-1 text-[10px] text-[#0052FF]">
                            AI {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
                    {!isRevoked && (
                      <span className="inline-flex items-center rounded-full bg-[#F5F6F8] px-2.5 py-1 font-medium text-foreground/80">
                        Policy Bound
                      </span>
                    )}
                    {asset.isHeadshot && (
                      <span className="inline-flex items-center rounded-full bg-[#F5F6F8] px-2.5 py-1 font-medium text-foreground/80">
                        Headshot
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F6F8] px-2.5 py-1">
                      <span>Size</span>
                      <span className="font-inter-numeric tabular-nums font-medium text-foreground">{asset.size}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F6F8] px-2.5 py-1">
                      <span>Type</span>
                      <span className="font-medium text-foreground">{getAssetTypeLabel(asset.type)}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F6F8] px-2.5 py-1">
                      <span>Uploaded</span>
                      <span className="font-inter-numeric tabular-nums font-medium text-foreground">{uploadedLabel}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="my-4 h-px bg-border/50" />
      <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
        <WarningCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" weight="fill" />
        <p className="text-pretty">
          <span className="font-semibold text-foreground">Safety Note:</span> No AI content generation occurs within this vault. This workspace is reserved for secure storage, auditability, and consent-bound asset delivery.
        </p>
      </div>

    </Card>
  );
}

function VaultSignalsCard({ consentItems }: { consentItems: ConsentItem[] }) {
  const activeConsents = consentItems.filter((item) => item.status === 'granted').length;
  const conditionalConsents = consentItems.filter((item) => item.status === 'conditional').length;
  const revokedConsents = consentItems.filter((item) => item.status === 'revoked').length;

  const signalItems = [
    { label: 'Granted', value: activeConsents, icon: ShieldCheck, tone: 'text-emerald-600 bg-emerald-500/10' },
    { label: 'Conditional', value: conditionalConsents, icon: Globe, tone: 'text-[#0052FF] bg-[#0052FF]/10' },
    { label: 'Revoked', value: revokedConsents, icon: WarningCircle, tone: 'text-amber-700 bg-amber-500/10' },
  ];

  return (
    <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <Eye className="h-4 w-4 text-[#0052FF]" weight="fill" />
        <h3 className="text-balance text-[13px] font-semibold text-foreground">Consent Signals</h3>
      </div>
      <div className="space-y-3">
        {signalItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", item.tone)}>
              <item.icon className="h-4 w-4" weight="fill" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-foreground">{item.label}</p>
              <p className="font-inter-numeric tabular-nums text-[10px] text-muted-foreground">
                {item.value} policies
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="my-4 h-px bg-border/50" />
      <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
        <Clock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" weight="fill" />
        <p className="text-pretty">Ledger updates sync in real time with vault permissions.</p>
      </div>
    </Card>
  );
}

function LedgerDetailsModal({
  log,
  onClose,
  disputeCase,
  onFlagUse,
}: {
  log: UsageLog;
  onClose: () => void;
  disputeCase?: DisputeCase;
  onFlagUse: (log: UsageLog) => void;
}) {
  const isActive = log.status === 'active';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border/50">
            {log.assetType === 'Voice' && <Microphone className="w-6 h-6 text-foreground" weight="duotone" />}
            {log.assetType === 'Likeness' && <UserCircle className="w-6 h-6 text-foreground" weight="duotone" />}
            {log.assetType === 'Motion' && <PersonArmsSpread className="w-6 h-6 text-foreground" weight="duotone" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{log.studioName}</h3>
            <p className="text-sm font-medium text-muted-foreground">{log.projectName}</p>
          </div>
        </div>
        <Badge variant={isActive ? "default" : "secondary"} className="h-7 px-3 text-xs capitalize">
          {isActive && <div className="w-2 h-2 rounded-full bg-emerald-300 mr-2 animate-pulse" />}
          {log.status}
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Session Date</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">{log.date}</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Duration</span>
          <span className="text-sm font-semibold">{log.duration}</span>
        </div>
        <div className="col-span-2 p-3 rounded-xl bg-secondary/50 border border-border/50">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Context</span>
          <p className="text-sm">{log.context}</p>
        </div>
      </div>

      {/* Detailed Info */}
      {log.details && (
        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Authorization Details
          </h4>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-card border border-border/50 space-y-3">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-xs text-muted-foreground">Session ID</span>
                <span className="text-xs font-mono font-medium">{log.details.sessionID}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-xs text-muted-foreground">Production Unit</span>
                <span className="text-xs font-medium text-right">{log.details.productionUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Usage Territory</span>
                <span className="text-xs font-medium text-right">{log.details.usageTerritory}</span>
              </div>
            </div>

            {log.details.authorizedPersonnel && (
              <div className="p-4 rounded-xl bg-card border border-border/50">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Authorized Personnel</span>
                <div className="flex flex-wrap gap-2">
                  {log.details.authorizedPersonnel.map((person, idx) => (
                    <Badge key={idx} variant="outline" className="bg-secondary/30 text-xs font-normal">
                      {person}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {disputeCase && (
        <div className="rounded-xl border border-[#F6DDB0] bg-[#FFF8EA] p-3">
          <p className="text-[11px] font-semibold text-foreground">Dispute Timeline</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={cn(
              'rounded-full px-2.5 py-1 text-[10px]',
              disputeCase.status === 'submitted' || disputeCase.status === 'under review' || disputeCase.status === 'resolved'
                ? 'bg-[#FDE9BE] text-[#8A5A00]'
                : 'bg-muted text-muted-foreground',
            )}>
              Submitted
            </span>
            <span className={cn(
              'rounded-full px-2.5 py-1 text-[10px]',
              disputeCase.status === 'under review' || disputeCase.status === 'resolved'
                ? 'bg-[#DBE8FF] text-[#224B8F]'
                : 'bg-muted text-muted-foreground',
            )}>
              Under Review
            </span>
            <span className={cn(
              'rounded-full px-2.5 py-1 text-[10px]',
              disputeCase.status === 'resolved'
                ? 'bg-[#DFF6E7] text-[#176038]'
                : 'bg-muted text-muted-foreground',
            )}>
              Resolved
            </span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Latest reason: {disputeCase.reason}</p>
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <Button variant="outline" className="rounded-xl text-[12px]" onClick={() => onFlagUse(log)}>
          Flag Suspicious Use
        </Button>
        <Button variant="outline" className="w-full sm:w-auto rounded-xl" onClick={onClose}>
          Close Details
        </Button>
      </div>
    </div>
  );
}

function UseLedger() {
  const [visibleCount, setVisibleCount] = useState(2);
  const [openLedgerId, setOpenLedgerId] = useState<string | null>(null);
  const [activeDisputeLog, setActiveDisputeLog] = useState<UsageLog | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeEvidence, setDisputeEvidence] = useState('');
  const [disputeError, setDisputeError] = useState<string | null>(null);
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
  const [disputes, setDisputes] = useState<DisputeCase[]>([]);
  const visibleLogs = MOCK_USAGE_LOGS.slice(0, visibleCount);
  const hasMore = visibleCount < MOCK_USAGE_LOGS.length;

  const getDisputeForLog = (usageLogId: string) => disputes.find((item) => item.usageLogId === usageLogId);

  const handleLoadMore = () => {
    if (hasMore) {
      setVisibleCount((prev) => prev + 2);
    } else {
      setVisibleCount(2); // Collapse
    }
  };

  const handleOpenDispute = (log: UsageLog) => {
    const unresolvedDispute = disputes.find((entry) => entry.usageLogId === log.id && entry.status !== 'resolved');
    if (unresolvedDispute) {
      toast.warning('An unresolved dispute already exists for this usage log.');
      return;
    }
    setActiveDisputeLog(log);
    setDisputeReason('');
    setDisputeEvidence('');
    setDisputeError(null);
  };

  const handleSubmitDispute = () => {
    if (!activeDisputeLog) return;
    if (!disputeReason.trim()) {
      setDisputeError('Please provide a reason before submitting a dispute.');
      return;
    }

    setIsSubmittingDispute(true);
    const createdDispute: DisputeCase = {
      id: `dispute-${Date.now()}`,
      usageLogId: activeDisputeLog.id,
      reason: disputeReason.trim(),
      evidence: disputeEvidence.trim(),
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };

    window.setTimeout(() => {
      setDisputes((currentDisputes) => [createdDispute, ...currentDisputes]);
      setIsSubmittingDispute(false);
      setActiveDisputeLog(null);
      toast.success('Dispute filed. Status moved to submitted.');
      window.setTimeout(() => {
        setDisputes((currentDisputes) => (
          currentDisputes.map((dispute) => (
            dispute.id === createdDispute.id ? { ...dispute, status: 'under review' } : dispute
          ))
        ));
      }, 1400);
    }, 700);
  };

  return (
    <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
      <div className="mb-4">
        <h3 className="text-balance text-[13px] font-semibold text-foreground">Use Ledger</h3>
        <p className="mt-1 text-pretty text-[11px] text-muted-foreground">
          Immutable transparency log of consent-bound usage.
        </p>
      </div>

      <div className="divide-y divide-dashed divide-[#ECECEC]">
        {visibleLogs.map((log) => (
          <Dialog
            key={log.id}
            open={openLedgerId === log.id}
            onOpenChange={(isOpen) => setOpenLedgerId(isOpen ? log.id : null)}
          >
            <DialogTrigger asChild>
              <button
                type="button"
                className="w-full appearance-none border-0 bg-transparent py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                  <div className="flex min-w-0 shrink-0 items-center gap-3 md:w-52">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#F8F8F8] text-muted-foreground">
                      {log.assetType === 'Voice' && <Microphone className="h-5 w-5" weight="duotone" />}
                      {log.assetType === 'Likeness' && <UserCircle className="h-5 w-5" weight="duotone" />}
                      {log.assetType === 'Motion' && <PersonArmsSpread className="h-5 w-5" weight="duotone" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-inter-numeric tabular-nums text-[11px] text-muted-foreground">{log.date}</p>
                      <p className="text-[14px] font-semibold text-foreground">{log.assetType}</p>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-foreground">{log.studioName}</p>
                    <p className="mt-1 truncate text-[12px] text-muted-foreground">
                      Project <span className="text-foreground">{log.projectName}</span> • {log.context}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 md:justify-end">
                    {getDisputeForLog(log.id) && (
                      <span className="rounded-full bg-[#FDE9BE] px-2 py-1 text-[10px] font-medium text-[#8A5A00]">
                        Dispute {getDisputeForLog(log.id)?.status}
                      </span>
                    )}
                    <span
                      className={cn(
                        "text-[12px] font-medium capitalize",
                        log.status === 'active' ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {log.status}
                    </span>
                    <CaretRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl border border-[#EAEAEA] bg-[#F9F9F9]">
              <LedgerDetailsModal
                log={log}
                disputeCase={getDisputeForLog(log.id)}
                onFlagUse={handleOpenDispute}
                onClose={() => setOpenLedgerId(null)}
              />
            </DialogContent>
          </Dialog>
        ))}
      </div>

      <div className="mt-2 border-t border-dashed border-[#ECECEC] pt-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-[12px] text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          onClick={handleLoadMore}
        >
          {hasMore ? "View Full History" : "Show Less"}
        </Button>
      </div>

      <Dialog
        open={!!activeDisputeLog}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setActiveDisputeLog(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] rounded-3xl border border-[#EAEAEA] bg-[#F9F9F9]">
          <div className="space-y-4">
            <div>
              <h3 className="text-[16px] font-semibold text-foreground">Flag Suspicious Use</h3>
              <p className="text-[12px] text-muted-foreground">
                Report usage mismatch for {activeDisputeLog?.projectName || 'selected log'} and track status changes.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-muted-foreground">Reason</label>
              <Textarea
                value={disputeReason}
                onChange={(event) => setDisputeReason(event.target.value)}
                className="min-h-[92px] rounded-xl border-[#ECECEC] bg-white text-[12px]"
                placeholder="Describe why this usage appears suspicious..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-muted-foreground">Evidence or references</label>
              <Textarea
                value={disputeEvidence}
                onChange={(event) => setDisputeEvidence(event.target.value)}
                className="min-h-[72px] rounded-xl border-[#ECECEC] bg-white text-[12px]"
                placeholder="Add timestamps, references, or external notes."
              />
            </div>

            {disputeError && (
              <p className="text-[11px] text-destructive">{disputeError}</p>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-9 flex-1 rounded-xl text-[12px]"
                onClick={() => setActiveDisputeLog(null)}
              >
                Cancel
              </Button>
              <Button
                className="h-9 flex-1 rounded-xl text-[12px]"
                disabled={isSubmittingDispute}
                onClick={handleSubmitDispute}
              >
                {isSubmittingDispute ? 'Submitting...' : 'Submit Dispute'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function VaultSecondPane({
  consentItems,
  onUpdate,
}: {
  consentItems: ConsentItem[];
  onUpdate: (id: string, updates: Partial<ConsentItem>) => void;
}) {
  return (
    <div className="hide-scrollbar h-full min-w-0 flex-1 overflow-y-auto pb-6 pr-1">
      <div className="space-y-4 lg:hidden">
        <VaultProfileOverviewCard consentItems={consentItems} />
        <VaultSignalsCard consentItems={consentItems} />
      </div>

      <div className="mt-4 space-y-4 lg:mt-0">
        <AssetVault consentItems={consentItems} />
        <ConsentMatrix items={consentItems} onUpdate={onUpdate} />
        <UseLedger />
      </div>
    </div>
  );
}

export default function VaultPage() {
  const [consentItems, setConsentItems] = useState<ConsentItem[]>(storage.getConsentMatrix());

  const handleUpdateConsent = (id: string, updates: Partial<ConsentItem>) => {
    storage.updateConsent(id, updates);
    setConsentItems(storage.getConsentMatrix());
  };

  return (
    <DashboardLayout
      className="h-dvh overflow-hidden bg-[#F9F9F9]"
      fullWidth
      transparentNav
      navContentClassName="w-[85%] mx-auto"
    >
      <div className="mx-auto flex h-[calc(100dvh-6.5rem)] w-[85%] gap-6 overflow-hidden">
        <div className="hide-scrollbar hidden h-full w-72 flex-shrink-0 space-y-4 overflow-y-auto pb-6 lg:block">
          <VaultProfileOverviewCard consentItems={consentItems} />
          <VaultSignalsCard consentItems={consentItems} />
        </div>

        <VaultSecondPane consentItems={consentItems} onUpdate={handleUpdateConsent} />
      </div>
    </DashboardLayout>
  );
}
