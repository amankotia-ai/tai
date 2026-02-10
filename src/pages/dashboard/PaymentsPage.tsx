import { useMemo, useState } from 'react';
import {
  CheckCircle,
  Clock,
  Download,
  Receipt,
  WarningCircle,
} from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { storage } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type PaymentStatus = 'initiated' | 'processing' | 'paid' | 'failed';

interface PaymentRecord {
  id: string;
  contract: string;
  gross: number;
  platformFee: number;
  netPayout: number;
  status: PaymentStatus;
  createdAt: string;
}

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1001',
    contract: 'Project Atlas License',
    gross: 5000,
    platformFee: 500,
    netPayout: 4500,
    status: 'paid',
    createdAt: '2026-01-28',
  },
  {
    id: 'pay-1002',
    contract: 'Neon Nights Dubbing',
    gross: 2800,
    platformFee: 280,
    netPayout: 2520,
    status: 'processing',
    createdAt: '2026-02-04',
  },
];

function statusStyle(status: PaymentStatus): string {
  if (status === 'paid') return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
  if (status === 'processing') return 'bg-[#EDF3FF] text-[#0052FF] border-[#DCE7FF]';
  if (status === 'failed') return 'bg-destructive/10 text-destructive border-destructive/20';
  return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
}

export default function PaymentsPage() {
  const user = storage.getUser();
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [isPaying, setIsPaying] = useState(false);

  const totals = useMemo(() => {
    return payments.reduce(
      (acc, payment) => {
        acc.gross += payment.gross;
        acc.fees += payment.platformFee;
        acc.net += payment.netPayout;
        return acc;
      },
      { gross: 0, fees: 0, net: 0 },
    );
  }, [payments]);

  const createStudioPayment = () => {
    setIsPaying(true);
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      contract: 'Open Operations License',
      gross: 3600,
      platformFee: 360,
      netPayout: 3240,
      status: 'initiated',
      createdAt: new Date().toISOString(),
    };

    setPayments((current) => [newPayment, ...current]);

    window.setTimeout(() => {
      setPayments((current) => current.map((payment) => (
        payment.id === newPayment.id ? { ...payment, status: 'processing' } : payment
      )));
      window.setTimeout(() => {
        setPayments((current) => current.map((payment) => (
          payment.id === newPayment.id ? { ...payment, status: 'paid' } : payment
        )));
        setIsPaying(false);
        toast.success('Payment completed and payout posted to actor ledger.');
      }, 900);
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">
            Transparent payment rails for studio pay-in, platform fee split, and actor payout records.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="rounded-2xl border border-[#ECECEC] bg-white p-4">
            <p className="text-[11px] text-muted-foreground">Gross Volume</p>
            <p className="font-inter-numeric tabular-nums text-2xl font-bold text-foreground">${totals.gross.toLocaleString()}</p>
          </Card>
          <Card className="rounded-2xl border border-[#ECECEC] bg-white p-4">
            <p className="text-[11px] text-muted-foreground">Platform Fees</p>
            <p className="font-inter-numeric tabular-nums text-2xl font-bold text-foreground">${totals.fees.toLocaleString()}</p>
          </Card>
          <Card className="rounded-2xl border border-[#ECECEC] bg-white p-4">
            <p className="text-[11px] text-muted-foreground">Net Actor Payout</p>
            <p className="font-inter-numeric tabular-nums text-2xl font-bold text-foreground">${totals.net.toLocaleString()}</p>
          </Card>
        </div>

        <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Payment Rail Workflow</h2>
              <p className="text-[11px] text-muted-foreground">Studio → Platform → Actor payout with status timeline.</p>
            </div>
            {user?.role === 'studio' && (
              <Button className="h-9 rounded-lg text-[12px]" disabled={isPaying} onClick={createStudioPayment}>
                {isPaying ? 'Processing...' : 'Pay Selected License'}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] p-4">
              <p className="text-[13px] font-medium text-foreground">Split Preview</p>
              <div className="mt-2 space-y-2 text-[12px]">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Gross</span><span className="font-inter-numeric tabular-nums">$3,600</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Platform Fee (10%)</span><span className="font-inter-numeric tabular-nums">$360</span></div>
                <div className="flex items-center justify-between border-t border-[#ECECEC] pt-2"><span className="font-medium text-foreground">Net Actor Payout</span><span className="font-inter-numeric tabular-nums font-semibold">$3,240</span></div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] p-4">
              <p className="text-[13px] font-medium text-foreground">Status Timeline</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-amber-700">initiated</span>
                <span className="rounded-full bg-[#EDF3FF] px-2.5 py-1 text-[#0052FF]">processing</span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-700">paid</span>
                <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-destructive">failed</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">Every payment creates downloadable invoices and appears in actor payout ledger.</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-foreground">Payout and Invoice Records</h2>
            <Button variant="outline" size="sm" className="h-8 rounded-lg text-[11px]" onClick={() => toast.success('Exported payment CSV (mock).')}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
          </div>

          <div className="space-y-2">
            {payments.map((payment) => (
              <div key={payment.id} className="rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] p-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{payment.contract}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString()} • Invoice {payment.id.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn('border text-[11px] font-medium', statusStyle(payment.status))}>{payment.status}</Badge>
                    <span className="font-inter-numeric tabular-nums text-[13px] font-semibold text-foreground">${payment.netPayout.toLocaleString()}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg text-[11px]"
                      onClick={() => toast.success(`Downloaded receipt for ${payment.id.toUpperCase()}`)}
                    >
                      <Receipt className="mr-1.5 h-3.5 w-3.5" />
                      Receipt
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {payments.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#ECECEC] bg-[#FAFAFA] p-6 text-center">
              <Clock className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-2 text-[13px] text-muted-foreground">No payment records yet.</p>
            </div>
          )}
        </Card>

        <Card className="rounded-2xl border border-[#ECECEC] bg-white p-4 text-[12px] text-muted-foreground">
          <CheckCircle className="mr-1.5 inline h-4 w-4 text-emerald-600" weight="fill" />
          Accepted rails: status continuity across contracts, invoices, and actor payout visibility.
          <WarningCircle className="ml-2 mr-1.5 inline h-4 w-4 text-amber-700" weight="fill" />
          Transfer processing and bank settlement are mocked in frontend mode.
        </Card>
      </div>
    </DashboardLayout>
  );
}
