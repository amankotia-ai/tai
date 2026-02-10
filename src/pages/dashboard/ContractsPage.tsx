import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Sparkle,
  WarningCircle,
} from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ContractStatus = 'active' | 'pending' | 'expired';

interface ContractClause {
  id: string;
  text: string;
  type: 'warning' | 'safe' | 'info';
  label: string;
  explanation: string;
}

interface UsageLogEntry {
  id: string;
  licenseId: string;
  project: string;
  sessionId: string;
  territory: string;
  date: string;
  status: 'compliant' | 'flagged';
}

interface ContractRecord {
  id: string;
  title: string;
  studio: string;
  status: ContractStatus;
  createdAt: string;
  expiresAt: string;
  clauses: ContractClause[];
  consentScope: string;
  usageLogs: UsageLogEntry[];
}

const CONTRACTS: ContractRecord[] = [
  {
    id: 'contract-1',
    title: 'Synthetic Performance License - Project Atlas',
    studio: 'Universal Pictures India',
    status: 'active',
    createdAt: '2026-01-15',
    expiresAt: '2027-01-15',
    consentScope: 'Voice + Likeness • India + APAC • TV/Film',
    clauses: [
      {
        id: 'clause-1',
        text: 'Usage is limited to approved project scope and listed territories.',
        type: 'safe',
        label: 'Scope Boundaries',
        explanation: 'Matches consent matrix and limits unauthorized expansion.',
      },
      {
        id: 'clause-2',
        text: 'Retraining on actor data requires explicit consent version approval.',
        type: 'warning',
        label: 'Training Restriction',
        explanation: 'Studio cannot retrain unless actor updates the policy version.',
      },
    ],
    usageLogs: [
      {
        id: 'log-1',
        licenseId: 'LIC-ATLAS-2301',
        project: 'Atlas Episode 2',
        sessionId: 'ATLS-221-A',
        territory: 'India',
        date: '2026-02-02',
        status: 'compliant',
      },
      {
        id: 'log-2',
        licenseId: 'LIC-ATLAS-2301',
        project: 'Atlas Episode 3',
        sessionId: 'ATLS-228-B',
        territory: 'APAC',
        date: '2026-02-05',
        status: 'compliant',
      },
    ],
  },
  {
    id: 'contract-2',
    title: 'Voice Dubbing Agreement - Neon Nights',
    studio: 'Netflix Studios Mumbai',
    status: 'pending',
    createdAt: '2026-02-01',
    expiresAt: '2026-12-01',
    consentScope: 'Voice • Worldwide • Dubbing',
    clauses: [
      {
        id: 'clause-1',
        text: 'License becomes active after actor approval and certificate generation.',
        type: 'info',
        label: 'Activation Rule',
        explanation: 'Pending until both sides confirm the final consent version.',
      },
      {
        id: 'clause-2',
        text: 'Revocation notice must be honored within 14 days.',
        type: 'warning',
        label: 'Revocation SLA',
        explanation: 'Requires studio ops process to stop usage quickly.',
      },
    ],
    usageLogs: [],
  },
  {
    id: 'contract-3',
    title: 'Game Performance Capture - Shadowline',
    studio: 'Technicolor Games',
    status: 'expired',
    createdAt: '2024-11-20',
    expiresAt: '2025-11-20',
    consentScope: 'Motion • North America • Games',
    clauses: [
      {
        id: 'clause-1',
        text: 'No usage beyond expiration date without renewed consent.',
        type: 'safe',
        label: 'Expiry Guardrail',
        explanation: 'Expired contracts require a new synthetic performance license.',
      },
    ],
    usageLogs: [
      {
        id: 'log-3',
        licenseId: 'LIC-SHDW-991',
        project: 'Shadowline DLC',
        sessionId: 'SHDW-11-X',
        territory: 'US',
        date: '2025-10-30',
        status: 'compliant',
      },
    ],
  },
];

const statusOrder: ContractStatus[] = ['active', 'pending', 'expired'];

function statusLabel(status: ContractStatus): string {
  if (status === 'active') return 'Active';
  if (status === 'pending') return 'Pending';
  return 'Expired';
}

function statusClasses(status: ContractStatus): string {
  if (status === 'active') return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
  if (status === 'pending') return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
  return 'bg-muted text-muted-foreground border-border';
}

function clauseIcon(type: ContractClause['type']) {
  if (type === 'warning') return <WarningCircle className="h-5 w-5 text-amber-600" weight="fill" />;
  if (type === 'safe') return <CheckCircle className="h-5 w-5 text-emerald-600" weight="fill" />;
  return <Sparkle className="h-5 w-5 text-[#0052FF]" weight="fill" />;
}

export default function ContractsPage() {
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');
  const [selectedContract, setSelectedContract] = useState<ContractRecord | null>(null);
  const [certificates, setCertificates] = useState<Record<string, string>>({});
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const filteredContracts = useMemo(() => {
    if (statusFilter === 'all') return CONTRACTS;
    return CONTRACTS.filter((contract) => contract.status === statusFilter);
  }, [statusFilter]);

  const usageLedger = useMemo(() => CONTRACTS.flatMap((contract) => contract.usageLogs), []);

  const generateLicense = (contract: ContractRecord) => {
    if (contract.status === 'expired') {
      toast.error('Cannot generate certificate for expired contracts. Renew consent first.');
      return;
    }

    setGeneratingId(contract.id);
    window.setTimeout(() => {
      const certificateId = `CERT-${contract.id.toUpperCase()}-${new Date().getTime().toString().slice(-6)}`;
      setCertificates((current) => ({ ...current, [contract.id]: certificateId }));
      setGeneratingId(null);
      toast.success(`License certificate generated: ${certificateId}`);
    }, 900);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contracts</h1>
            <p className="text-sm text-muted-foreground">
              Manage synthetic performance licenses, AI clause highlights, and contract-linked usage logs.
            </p>
          </div>
          <Button className="h-9 rounded-lg text-[12px]" onClick={() => toast.info('Upload flow is mocked in frontend mode.')}> 
            <FileText className="mr-2 h-4 w-4" />
            Upload Contract
          </Button>
        </div>

        <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              className="h-8 rounded-full text-[11px]"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            {statusOrder.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={statusFilter === status ? 'default' : 'outline'}
                className="h-8 rounded-full text-[11px]"
                onClick={() => setStatusFilter(status)}
              >
                {statusLabel(status)} ({CONTRACTS.filter((contract) => contract.status === status).length})
              </Button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredContracts.map((contract) => (
              <button
                key={contract.id}
                type="button"
                onClick={() => setSelectedContract(contract)}
                className="w-full rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] p-4 text-left transition-colors hover:border-[#D6D6D6]"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[15px] font-semibold text-foreground">{contract.title}</p>
                    <p className="text-[12px] text-muted-foreground">
                      {contract.studio} • Expires {new Date(contract.expiresAt).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{contract.consentScope}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={cn('border text-[11px] font-medium', statusClasses(contract.status))}>
                      {statusLabel(contract.status)}
                    </Badge>
                    <div className="rounded-lg bg-[#EDF3FF] px-2.5 py-1 text-[11px] text-[#0052FF]">
                      {contract.clauses.length} AI notes
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredContracts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#ECECEC] bg-[#FAFAFA] p-6 text-center">
              <p className="text-[13px] text-muted-foreground">No contracts in this status.</p>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-foreground">License Generation Center</h2>
                <p className="text-[11px] text-muted-foreground">Generate exportable certificates from approved consent scope.</p>
              </div>
            </div>

            <div className="space-y-3">
              {CONTRACTS.filter((contract) => contract.status !== 'expired').map((contract) => (
                <div key={`center-${contract.id}`} className="rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] p-3">
                  <p className="text-[13px] font-medium text-foreground">{contract.title}</p>
                  <p className="text-[11px] text-muted-foreground">{contract.consentScope}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      className="h-8 rounded-lg text-[11px]"
                      onClick={() => generateLicense(contract)}
                      disabled={generatingId === contract.id}
                    >
                      {generatingId === contract.id ? 'Generating...' : 'Generate License'}
                    </Button>
                    {certificates[contract.id] && (
                      <Badge className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 text-[11px]">
                        {certificates[contract.id]}
                      </Badge>
                    )}
                    {certificates[contract.id] && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[11px]"
                        onClick={() => toast.success('Certificate downloaded (mock).')}
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        Download PDF
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
            <div className="mb-4">
              <h2 className="text-[15px] font-semibold text-foreground">Usage Logs</h2>
              <p className="text-[11px] text-muted-foreground">Ledger entries tied to generated licenses in contract context.</p>
            </div>

            <div className="space-y-2">
              {usageLedger.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-[#ECECEC] bg-[#FAFAFA] px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-medium text-foreground">{entry.project}</p>
                    <Badge className={cn(
                      'border text-[10px] font-medium',
                      entry.status === 'compliant'
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700'
                        : 'border-amber-500/20 bg-amber-500/10 text-amber-700',
                    )}>
                      {entry.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {entry.licenseId} • {entry.sessionId} • {entry.territory} • {new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedContract} onOpenChange={(open) => { if (!open) setSelectedContract(null); }}>
        <DialogContent className="max-h-[80vh] overflow-y-auto rounded-3xl border border-[#ECECEC] bg-[#F9F9F9] sm:max-w-3xl">
          {selectedContract && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-[18px]">
                  <FileText className="h-5 w-5 text-[#0052FF]" />
                  {selectedContract.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                <div className="rounded-2xl border border-[#ECECEC] bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-foreground">{selectedContract.studio}</p>
                    <Badge className={cn('border text-[11px] font-medium', statusClasses(selectedContract.status))}>
                      {statusLabel(selectedContract.status)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{selectedContract.consentScope}</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 rounded-lg text-[11px]" onClick={() => toast.success('Source contract downloaded (mock).')}>
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Source Doc
                    </Button>
                    <Button size="sm" className="h-8 rounded-lg text-[11px]" onClick={() => toast.info('Full document viewer mocked in frontend mode.')}>
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      View Full Document
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-foreground">
                    <Sparkle className="h-4 w-4 text-[#0052FF]" weight="fill" />
                    AI Highlighted Clauses
                  </h3>
                  <div className="space-y-3">
                    {selectedContract.clauses.map((clause) => (
                      <div key={clause.id} className="rounded-2xl border border-[#ECECEC] bg-white p-4">
                        <div className="flex items-start gap-3">
                          {clauseIcon(clause.type)}
                          <div>
                            <Badge className="mb-2 border border-[#ECECEC] bg-[#FAFAFA] text-[10px] text-foreground">
                              {clause.label}
                            </Badge>
                            <p className="text-[13px] font-medium text-foreground">{clause.text}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">{clause.explanation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-[14px] font-semibold text-foreground">Contract Usage Ledger</h3>
                  <div className="space-y-2">
                    {selectedContract.usageLogs.length > 0 ? selectedContract.usageLogs.map((entry) => (
                      <div key={`detail-${entry.id}`} className="rounded-xl border border-[#ECECEC] bg-white px-3 py-2">
                        <p className="text-[12px] font-medium text-foreground">{entry.project}</p>
                        <p className="text-[11px] text-muted-foreground">{entry.sessionId} • {entry.territory} • {new Date(entry.date).toLocaleDateString()}</p>
                      </div>
                    )) : (
                      <div className="rounded-xl border border-dashed border-[#ECECEC] bg-white px-3 py-5 text-center text-[12px] text-muted-foreground">
                        No usage entries yet for this contract.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-[#ECECEC] pt-4">
                  <Button variant="outline" onClick={() => setSelectedContract(null)}>Close</Button>
                  <Button onClick={() => toast.info('Amendment request sent (mock).')}>
                    Request Changes
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
