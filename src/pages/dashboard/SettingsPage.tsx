import { useMemo, useState } from 'react';
import {
  Bell,
  CheckCircle,
  CreditCard,
  Download,
  Fingerprint,
  Key,
  Lock,
  ShieldCheck,
  SignOut,
  Trash,
  User,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { storage } from '@/lib/store';
import { toast } from 'sonner';

type CheckoutStep = 'plan' | 'contact' | 'payment' | 'confirm';

type NotificationEvent = 'license_requests' | 'contract_updates' | 'security_alerts' | 'payout_updates';

type NotificationChannel = 'email' | 'push' | 'in_app';

const BILLING_HISTORY = [
  { id: 'inv-001', date: '2026-01-02', amount: '$29.00', status: 'Paid', description: 'Pro Plan - January' },
  { id: 'inv-002', date: '2025-12-02', amount: '$29.00', status: 'Paid', description: 'Pro Plan - December' },
  { id: 'inv-003', date: '2025-11-02', amount: '$29.00', status: 'Paid', description: 'Pro Plan - November' },
];

const SESSION_DEVICES = [
  { id: 'session-1', device: 'MacBook Pro - Safari', location: 'Mumbai, IN', active: true, seen: 'Active now' },
  { id: 'session-2', device: 'iPhone 15 - iOS', location: 'Mumbai, IN', active: false, seen: '2 hours ago' },
  { id: 'session-3', device: 'Windows PC - Chrome', location: 'Bangalore, IN', active: false, seen: '1 day ago' },
];

export default function SettingsPage() {
  const user = storage.getUser();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('plan');
  const [logoutAllOpen, setLogoutAllOpen] = useState(false);

  const [notificationMatrix, setNotificationMatrix] = useState<Record<NotificationEvent, Record<NotificationChannel, boolean>>>({
    license_requests: { email: true, push: true, in_app: true },
    contract_updates: { email: true, push: false, in_app: true },
    security_alerts: { email: true, push: true, in_app: true },
    payout_updates: { email: true, push: true, in_app: true },
  });

  const checkoutSteps = useMemo(
    () => [
      { key: 'plan', label: 'Choose Plan' },
      { key: 'contact', label: 'Business Details' },
      { key: 'payment', label: 'Razorpay Checkout' },
      { key: 'confirm', label: 'Confirmation' },
    ] as const,
    [],
  );

  const saveProfile = () => {
    if (!user) return;
    storage.setUser({ ...user, name, email });
    toast.success('Profile updated');
  };

  const updateNotification = (eventName: NotificationEvent, channel: NotificationChannel, value: boolean) => {
    setNotificationMatrix((current) => ({
      ...current,
      [eventName]: {
        ...current[eventName],
        [channel]: value,
      },
    }));
  };

  const runCheckoutStep = () => {
    if (checkoutStep === 'plan') {
      setCheckoutStep('contact');
      return;
    }
    if (checkoutStep === 'contact') {
      setCheckoutStep('payment');
      return;
    }
    if (checkoutStep === 'payment') {
      setCheckoutStep('confirm');
      return;
    }
    setCheckoutOpen(false);
    setCheckoutStep('plan');
    toast.success('Plan activated successfully');
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <Card className="rounded-3xl border border-[#ECECEC] bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#0052FF]">
              <User className="h-5 w-5" weight="fill" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Profile</h2>
              <p className="text-[12px] text-muted-foreground">Update your account identity and contact email.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Full Name</Label>
              <Input id="settings-name" value={name} onChange={(event) => setName(event.target.value)} className="h-10 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input id="settings-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 rounded-xl" />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button className="h-9 rounded-lg text-[12px]" onClick={saveProfile}>Save Changes</Button>
          </div>
        </Card>

        <Card className="rounded-3xl border border-[#ECECEC] bg-white p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF3E8] text-[#C25A00]">
                <CreditCard className="h-5 w-5" weight="fill" />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-foreground">Plan and Checkout</h2>
                <p className="text-[12px] text-muted-foreground">Razorpay-style stepper for upgrades and renewals.</p>
              </div>
            </div>
            <Button className="h-9 rounded-lg text-[12px]" onClick={() => setCheckoutOpen(true)}>
              Upgrade Plan
            </Button>
          </div>

          <div className="rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] p-4">
            <p className="text-[13px] font-medium text-foreground">Current Plan: Free</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Access 1 protected asset and standard contract review tools.</p>
          </div>
        </Card>

        <Card className="rounded-3xl border border-[#ECECEC] bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#0052FF]">
              <Download className="h-5 w-5" weight="fill" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Billing History and Invoices</h2>
              <p className="text-[12px] text-muted-foreground">Download invoices and review historical billing events.</p>
            </div>
          </div>

          <div className="space-y-2">
            {BILLING_HISTORY.map((invoice) => (
              <div key={invoice.id} className="flex flex-col gap-2 rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] p-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">{invoice.description}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(invoice.date).toLocaleDateString()} • {invoice.id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-700">{invoice.status}</span>
                  <span className="font-inter-numeric tabular-nums text-[13px] font-semibold text-foreground">{invoice.amount}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg text-[11px]"
                    onClick={() => toast.success(`Downloaded ${invoice.id}.pdf`) }
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Invoice
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-3xl border border-[#ECECEC] bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5FF] text-[#315BB8]">
              <Lock className="h-5 w-5" weight="fill" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Security and Sessions</h2>
              <p className="text-[12px] text-muted-foreground">Manage 2FA, credentials, and active device sessions.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-[#ECECEC] bg-[#FAFAFA] p-3">
              <div className="flex items-center gap-3">
                <Fingerprint className="h-4 w-4 text-[#315BB8]" />
                <div>
                  <p className="text-[13px] font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-[11px] text-muted-foreground">Protect your account with an additional verification step.</p>
                </div>
              </div>
              <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#ECECEC] bg-[#FAFAFA] p-3">
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-[#315BB8]" />
                <div>
                  <p className="text-[13px] font-medium text-foreground">Password Rotation</p>
                  <p className="text-[11px] text-muted-foreground">Set a new password every 90 days.</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-[11px]">Update</Button>
            </div>

            <div className="rounded-xl border border-[#ECECEC] bg-[#FAFAFA] p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[13px] font-medium text-foreground">Session Management</p>
                <Button variant="outline" size="sm" className="h-8 rounded-lg text-[11px]" onClick={() => setLogoutAllOpen(true)}>
                  <SignOut className="mr-1.5 h-3.5 w-3.5" />
                  Log Out All Devices
                </Button>
              </div>
              <div className="space-y-2">
                {SESSION_DEVICES.map((session) => (
                  <div key={session.id} className="flex items-center justify-between rounded-lg border border-[#E7E7E7] bg-white px-3 py-2">
                    <div>
                      <p className="text-[12px] font-medium text-foreground">{session.device}</p>
                      <p className="text-[10px] text-muted-foreground">{session.location} • {session.seen}</p>
                    </div>
                    {session.active && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-700">Current</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border border-[#ECECEC] bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF8EA] text-[#8A5A00]">
              <Bell className="h-5 w-5" weight="fill" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Notification Matrix</h2>
              <p className="text-[12px] text-muted-foreground">Configure Email, Push, and In-app channels per event.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#ECECEC] text-[11px] uppercase text-muted-foreground">
                  <th className="py-2 pr-2">Event</th>
                  <th className="py-2 px-2">Email</th>
                  <th className="py-2 px-2">Push</th>
                  <th className="py-2 pl-2">In-App</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['license_requests', 'License Requests'],
                    ['contract_updates', 'Contract Updates'],
                    ['security_alerts', 'Security Alerts'],
                    ['payout_updates', 'Payout Updates'],
                  ] as Array<[NotificationEvent, string]>
                ).map(([eventName, label]) => (
                  <tr key={eventName} className="border-b border-[#F1F1F1]">
                    <td className="py-3 pr-2 text-[12px] font-medium text-foreground">{label}</td>
                    <td className="py-3 px-2"><Switch checked={notificationMatrix[eventName].email} onCheckedChange={(value) => updateNotification(eventName, 'email', value)} /></td>
                    <td className="py-3 px-2"><Switch checked={notificationMatrix[eventName].push} onCheckedChange={(value) => updateNotification(eventName, 'push', value)} /></td>
                    <td className="py-3 pl-2"><Switch checked={notificationMatrix[eventName].in_app} onCheckedChange={(value) => updateNotification(eventName, 'in_app', value)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Trash className="h-5 w-5" weight="fill" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Danger Zone</h2>
              <p className="text-[12px] text-muted-foreground">Irreversible actions require confirmation.</p>
            </div>
          </div>
          <Button variant="destructive" className="h-9 rounded-lg text-[12px]" onClick={() => toast.info('Delete flow intentionally mocked in frontend mode.')}>Delete Account</Button>
        </Card>
      </div>

      <Dialog open={checkoutOpen} onOpenChange={(open) => { setCheckoutOpen(open); if (!open) setCheckoutStep('plan'); }}>
        <DialogContent className="sm:max-w-[540px] rounded-3xl border border-[#ECECEC] bg-[#F9F9F9]">
          <DialogHeader>
            <DialogTitle>Checkout Flow</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {checkoutSteps.map((step, index) => {
                const activeIndex = checkoutSteps.findIndex((entry) => entry.key === checkoutStep);
                const done = index <= activeIndex;
                return (
                  <div key={step.key} className="space-y-1 text-center">
                    <div className={done ? 'h-2 rounded-full bg-[#0052FF]' : 'h-2 rounded-full bg-[#E8E8E8]'} />
                    <p className={done ? 'text-[10px] text-foreground' : 'text-[10px] text-muted-foreground'}>{step.label}</p>
                  </div>
                );
              })}
            </div>

            {checkoutStep === 'plan' && (
              <div className="rounded-xl border border-[#ECECEC] bg-white p-3">
                <p className="text-[13px] font-medium text-foreground">Select Plan</p>
                <p className="text-[11px] text-muted-foreground">Pro: $29/mo • Enterprise: custom</p>
              </div>
            )}

            {checkoutStep === 'contact' && (
              <div className="rounded-xl border border-[#ECECEC] bg-white p-3">
                <p className="text-[13px] font-medium text-foreground">Business Details</p>
                <p className="text-[11px] text-muted-foreground">GSTIN, billing address, and contact owner are captured here.</p>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div className="rounded-xl border border-[#ECECEC] bg-white p-3">
                <p className="text-[13px] font-medium text-foreground">Razorpay Mock Checkout</p>
                <p className="text-[11px] text-muted-foreground">Card/UPI flow with webhook confirmation state is simulated.</p>
              </div>
            )}

            {checkoutStep === 'confirm' && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-700">
                  <CheckCircle className="h-4 w-4" weight="fill" />
                  Payment Successful
                </p>
                <p className="text-[11px] text-emerald-700">Plan upgraded and invoice generated in billing history.</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCheckoutOpen(false)}>Cancel</Button>
              <Button onClick={runCheckoutStep}>{checkoutStep === 'confirm' ? 'Finish' : 'Continue'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={logoutAllOpen} onOpenChange={setLogoutAllOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log Out All Devices?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end all active sessions except your current browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.success('All other sessions logged out');
                setLogoutAllOpen(false);
              }}
            >
              Log Out Devices
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
