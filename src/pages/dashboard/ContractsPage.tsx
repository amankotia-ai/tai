import { useState } from 'react';
import { 
  FileText, 
  MagnifyingGlass,
  WarningCircle,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Sparkle,
  Lock,
  ArrowRight
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { storage } from '@/lib/store';
import { cn } from '@/lib/utils';

interface ContractClause {
  id: string;
  text: string;
  type: 'warning' | 'info' | 'safe';
  label: string;
  explanation: string;
}

interface Contract {
  id: string;
  title: string;
  studio: string;
  status: 'pending' | 'reviewed' | 'signed';
  createdAt: string;
  clauses: ContractClause[];
}

const mockContracts: Contract[] = [
  {
    id: '1',
    title: 'Voice Licensing Agreement - Project X',
    studio: 'Universal Pictures India',
    status: 'pending',
    createdAt: '2024-01-15',
    clauses: [
      {
        id: '1',
        text: 'The Artist grants Studio exclusive worldwide rights to synthesize, modify, and distribute voice reproductions for a period of 10 years.',
        type: 'warning',
        label: 'Usage Window',
        explanation: 'This clause grants very long-term exclusive rights. Consider negotiating for a shorter term (2-3 years) with renewal options.',
      },
      {
        id: '2',
        text: 'Artist may revoke consent with 90 days written notice, subject to completion of ongoing productions.',
        type: 'safe',
        label: 'Revocation Rights',
        explanation: 'This is a favorable clause that protects your ability to withdraw consent, though 90 days notice is required.',
      },
      {
        id: '3',
        text: 'Compensation shall be a one-time payment of $25,000 USD, with no additional royalties or residuals.',
        type: 'warning',
        label: 'Compensation Terms',
        explanation: 'No royalty structure may undervalue long-term use. Consider negotiating for usage-based royalties.',
      },
      {
        id: '4',
        text: 'Studio shall not use synthetic voice for defamatory, political, or adult content without explicit written consent.',
        type: 'safe',
        label: 'Content Restrictions',
        explanation: 'Good protection against misuse of your likeness for inappropriate content.',
      },
    ],
  },
  {
    id: '2',
    title: 'Digital Double Agreement - Action Film',
    studio: 'Marvel Studios',
    status: 'reviewed',
    createdAt: '2024-01-10',
    clauses: [
      {
        id: '1',
        text: 'Rights are non-exclusive and limited to the specified production only.',
        type: 'safe',
        label: 'Scope Limitation',
        explanation: 'Favorable clause limiting usage to a single production.',
      },
      {
        id: '2',
        text: 'Artist retains full ownership of biometric data at all times.',
        type: 'safe',
        label: 'Data Ownership',
        explanation: 'Excellent clause ensuring you maintain control of your biometric information.',
      },
    ],
  },
];

export default function ContractsPage() {
  const [contracts] = useState(mockContracts);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const user = storage.getUser();
  const isLawyer = user?.role === 'lawyer';

  const getStatusBadge = (status: Contract['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Pending Review</Badge>;
      case 'reviewed':
        return <Badge className="gap-1 bg-accent/20 text-accent border-accent/30"><CheckCircle className="w-3 h-3" /> Reviewed</Badge>;
      case 'signed':
        return <Badge className="gap-1 bg-primary/20 text-primary border-primary/30"><FileText className="w-3 h-3" /> Signed</Badge>;
    }
  };

  const getClauseIcon = (type: ContractClause['type']) => {
    switch (type) {
      case 'warning':
        return <WarningCircle className="w-5 h-5 text-warning" weight="fill" />;
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-accent" weight="fill" />;
      case 'info':
        return <Sparkle className="w-5 h-5 text-info" weight="fill" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Contract Intelligence</h1>
            <p className="text-muted-foreground">AI-powered contract analysis and review</p>
          </div>
          {isLawyer && (
            <Button className="gap-2">
              <FileText className="w-4 h-4" />
              Upload New Contract
            </Button>
          )}
        </div>

        {/* Pro Feature Banner */}
        <Card className="bg-gradient-card border-primary/30 overflow-hidden relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/40 rounded-full blur-3xl" />
          </div>
          <CardContent className="p-6 relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkle className="w-6 h-6 text-primary" weight="fill" />
              </div>
              <div>
                <h3 className="font-semibold">AI Contract Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI highlights key clauses and potential concerns
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-primary text-primary">
              Included in Pro
            </Badge>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <div className="space-y-4">
          {contracts.map((contract) => (
            <Card 
              key={contract.id}
              className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => setSelectedContract(contract)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{contract.title}</h3>
                      <p className="text-sm text-muted-foreground">{contract.studio}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created: {new Date(contract.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(contract.status)}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{contract.clauses.filter(c => c.type === 'warning').length} concerns</span>
                      <span>•</span>
                      <span>{contract.clauses.length} clauses analyzed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Locked Feature */}
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Advanced Negotiation Tools</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Unlock AI-powered negotiation suggestions, clause comparisons, and industry benchmarks.
            </p>
            <Button className="gap-2">
              Upgrade to Pro <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Contract Viewer Modal */}
      <Dialog open={!!selectedContract} onOpenChange={() => setSelectedContract(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {selectedContract?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedContract && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Studio</p>
                  <p className="font-semibold">{selectedContract.studio}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button size="sm" className="gap-1">
                    <Eye className="w-4 h-4" />
                    Full Document
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkle className="w-5 h-5 text-primary" />
                  AI-Highlighted Clauses
                </h3>
                
                <div className="space-y-4">
                  {selectedContract.clauses.map((clause) => (
                    <div 
                      key={clause.id}
                      className={cn(
                        "p-4 rounded-xl border",
                        clause.type === 'warning' && "bg-warning/5 border-warning/30",
                        clause.type === 'safe' && "bg-accent/5 border-accent/30",
                        clause.type === 'info' && "bg-info/5 border-info/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {getClauseIcon(clause.type)}
                        <div className="flex-1">
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "mb-2",
                              clause.type === 'warning' && "bg-warning/20 text-warning",
                              clause.type === 'safe' && "bg-accent/20 text-accent",
                              clause.type === 'info' && "bg-info/20 text-info"
                            )}
                          >
                            {clause.label}
                          </Badge>
                          <p className="text-sm mb-2 font-medium">{clause.text}</p>
                          <p className="text-sm text-muted-foreground">{clause.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedContract(null)}>
                  Close
                </Button>
                <Button className="gap-2">
                  Request Changes <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
