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
  BookmarkSimple
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground">Discover casting calls and licensing opportunities</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-72">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Funnel className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Featured Banner */}
        <Card className="bg-gradient-card border-primary/30 overflow-hidden relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/40 rounded-full blur-3xl" />
          </div>
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkle className="w-5 h-5 text-primary" weight="fill" />
              <span className="text-sm font-medium text-primary">Featured Opportunity</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Premium Voice Dataset Partnership</h3>
            <p className="text-muted-foreground mb-4">
              Join our exclusive partnership program with leading AI companies. Earn royalties while helping shape ethical AI development.
            </p>
            <Button className="gap-2">
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
                "bg-card border-border hover:border-primary/30 transition-all cursor-pointer",
                call.applied && "border-accent/30 bg-accent/5"
              )}
              onClick={() => !call.applied && setSelectedCall(call)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Buildings className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{call.studio}</p>
                        <p className="text-xs text-muted-foreground">{call.role}</p>
                      </div>
                      {call.applied && (
                        <Badge className="ml-auto gap-1 bg-accent/20 text-accent border-accent/30">
                          <CheckCircle className="w-3 h-3" /> Applied
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{call.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{call.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {call.requirements.map((req, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 min-w-[160px]">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <CurrencyDollar className="w-4 h-4" />
                        {call.budget}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-4 h-4" />
                        Deadline: {new Date(call.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {!call.applied && (
                      <Button 
                        size="sm" 
                        className="gap-1"
                        onClick={(e) => { e.stopPropagation(); setSelectedCall(call); }}
                      >
                        Apply Now <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCalls.length === 0 && (
          <div className="text-center py-12">
            <MagnifyingGlass className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No opportunities found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search</p>
          </div>
        )}
      </div>

      {/* Application Modal */}
      <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply to Opportunity</DialogTitle>
          </DialogHeader>
          
          {selectedCall && !isApplying && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{selectedCall.title}</h3>
                <p className="text-muted-foreground">{selectedCall.description}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="text-sm font-medium mb-3">Your Application Will Include:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Verified CastID Profile</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Protected Biometric Credentials</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Professional Verification Badge</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedCall(null)}>
                  Cancel
                </Button>
                <Button className="flex-1 gap-2" onClick={handleApply}>
                  <ShieldCheck className="w-4 h-4" />
                  One-Click Apply
                </Button>
              </div>
            </div>
          )}
          
          {isApplying && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <p className="font-semibold">Sending Digital Twin Credentials...</p>
              <p className="text-sm text-muted-foreground">Securely transmitting your verified identity</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="py-6">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-accent" weight="fill" />
            </div>
            <h2 className="text-xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-4">
              Your verified credentials have been securely sent to the studio. You'll be notified when they respond.
            </p>
            <Badge className="gap-1 bg-accent/20 text-accent border-accent/30 mb-4">
              <ShieldCheck className="w-3 h-3" /> Credentials Verified
            </Badge>
            <Button className="w-full mt-4" onClick={() => setShowSuccessModal(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
