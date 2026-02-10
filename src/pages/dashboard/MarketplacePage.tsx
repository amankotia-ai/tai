import { useState } from 'react';
import {
  MagnifyingGlass,
  Funnel,
  Buildings,
  Clock,
  CurrencyDollar,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Sparkle,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockCastingCalls, CastingCall, storage } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [castingCalls, setCastingCalls] = useState(mockCastingCalls);
  const [selectedCall, setSelectedCall] = useState<CastingCall | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appliedCallId, setAppliedCallId] = useState<string | null>(null);

  const user = storage.getUser();

  const handleApply = async () => {
    if (!selectedCall) return;

    setIsApplying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setCastingCalls(prev =>
      prev.map(c => c.id === selectedCall.id ? { ...c, applied: true } : c)
    );
    setAppliedCallId(selectedCall.id);
    setIsApplying(false);
    setSelectedCall(null);
    setShowSuccessModal(true);
  };

  const filteredCalls = castingCalls.filter(call =>
    call.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.studio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 md:w-80 group">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <Input
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-background/50 backdrop-blur-sm border-border/60 hover:border-border transition-colors text-[13px] rounded-xl"
              />
            </div>
            <Button variant="outline" className="gap-2 h-10 px-4 text-[13px] font-medium border-border/60 hover:bg-muted/50 rounded-xl">
              <Funnel className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Featured Banner */}
        <Card className="bg-primary/5 border-primary/10 overflow-hidden relative rounded-3xl shadow-none">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/40 rounded-full blur-3xl opacity-20" />
          </div>
          <CardContent className="p-8 relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-primary/10 p-1.5 rounded-lg">
                <Sparkle className="w-4 h-4 text-primary" weight="fill" />
              </div>
              <span className="text-[13px] font-medium text-primary">Featured Opportunity</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 tracking-tight">Premium Voice Dataset Partnership</h3>
            <p className="text-[14px] text-muted-foreground mb-6 max-w-2xl leading-relaxed">
              Join our exclusive partnership program with leading AI companies. Earn royalties while helping shape ethical AI development.
            </p>
            <Button className="gap-2 rounded-xl h-10 px-5 text-[13px] shadow-none">
              Learn More <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Casting Calls Feed */}
        <div className="space-y-4">
          {filteredCalls.map((call) => (
            <Card
              key={call.id}
              className={cn(
                "group relative overflow-hidden transition-all duration-300 rounded-3xl border-transparent ring-1 ring-border/40 hover:ring-primary/20 bg-card/50 backdrop-blur-sm shadow-none",
                call.applied && "bg-emerald-500/5 ring-emerald-500/20"
              )}
              onClick={() => !call.applied && setSelectedCall(call)}
            >
              <CardContent className="p-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 ring-1 ring-blue-500/20">
                        <Buildings className="w-5 h-5" weight="fill" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{call.studio}</p>
                        <p className="text-[11px] text-muted-foreground">{call.role}</p>
                      </div>
                      {call.applied && (
                        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" weight="fill" />
                          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Applied</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-[16px] font-semibold mb-2 text-foreground">{call.title}</h3>
                    <p className="text-[13px] text-muted-foreground mb-5 leading-relaxed">{call.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {call.requirements.map((req, i) => (
                        <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-secondary/50 text-secondary-foreground border border-border/50">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 min-w-[160px]">
                    <div className="text-right space-y-1">
                      <p className="text-[13px] font-medium flex items-center justify-end gap-1.5 text-foreground">
                        <CurrencyDollar className="w-4 h-4 text-muted-foreground" />
                        {call.budget}
                      </p>
                      <p className="text-[12px] text-muted-foreground flex items-center justify-end gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(call.deadline).toLocaleDateString()}
                      </p>
                    </div>

                    {!call.applied && (
                      <Button
                        size="sm"
                        className="gap-2 rounded-xl h-9 px-4 text-[12px] font-medium shadow-none opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.stopPropagation(); setSelectedCall(call); }}
                      >
                        Apply Now <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCalls.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border/60">
            <div className="w-16 h-16 rounded-2xl bg-muted/20 flex items-center justify-center mb-4">
              <MagnifyingGlass className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-[15px] font-semibold text-foreground">No opportunities found</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Application Modal */}
      <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <DialogContent className="sm:max-w-lg p-0 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-3xl gap-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-[18px] font-semibold">Apply to Opportunity</DialogTitle>
          </DialogHeader>

          {selectedCall && !isApplying && (
            <div className="p-6 pt-2 space-y-6">
              <div>
                <h3 className="font-semibold text-[15px] mb-1">{selectedCall.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{selectedCall.description}</p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                <p className="text-[13px] font-medium mb-3">Your Application Will Include:</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-[13px]">
                    <CheckCircle className="w-4 h-4 text-primary" weight="fill" />
                    <span>Verified CastID Profile</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px]">
                    <CheckCircle className="w-4 h-4 text-primary" weight="fill" />
                    <span>Protected Biometric Credentials</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px]">
                    <CheckCircle className="w-4 h-4 text-primary" weight="fill" />
                    <span>Professional Verification Badge</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 rounded-xl h-11 text-[13px]" onClick={() => setSelectedCall(null)}>
                  Cancel
                </Button>
                <Button className="flex-1 gap-2 rounded-xl h-11 text-[13px] shadow-none" onClick={handleApply}>
                  <ShieldCheck className="w-4 h-4" />
                  One-Click Apply
                </Button>
              </div>
            </div>
          )}

          {isApplying && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <ShieldCheck className="w-8 h-8 text-primary" weight="duotone" />
              </div>
              <p className="font-semibold text-[15px]">Sending Digital Twin Credentials...</p>
              <p className="text-[13px] text-muted-foreground mt-1">Securely transmitting your verified identity</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md text-center p-8 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-3xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-500" weight="fill" />
          </div>
          <h2 className="text-[20px] font-semibold mb-2 tracking-tight">Application Submitted!</h2>
          <p className="text-[13px] text-muted-foreground mb-6 leading-relaxed">
            Your verified credentials have been securely sent to the studio. You'll be notified when they respond.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" weight="fill" />
            <span className="text-[11px] font-medium text-emerald-600">Credentials Verified</span>
          </div>
          <Button className="w-full rounded-xl h-11 text-[13px] shadow-none" onClick={() => setShowSuccessModal(false)}>
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
