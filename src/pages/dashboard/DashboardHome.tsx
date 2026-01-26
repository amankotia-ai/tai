import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Vault, 
  FileText, 
  ShieldCheck, 
  TrendUp, 
  Clock, 
  Bell,
  ArrowRight,
  Warning,
  CheckCircle
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { storage, LicenseRequest } from '@/lib/store';

export default function DashboardHome() {
  const [pendingRequests, setPendingRequests] = useState<LicenseRequest[]>([]);
  const assets = storage.getVaultAssets();
  const user = storage.getUser();

  useEffect(() => {
    const requests = storage.getLicenseRequests();
    setPendingRequests(requests.filter(r => r.status === 'pending'));
  }, []);

  const stats = [
    { 
      label: 'Protected Assets', 
      value: assets.length, 
      icon: Vault, 
      change: '+2 this month',
      color: 'text-primary' 
    },
    { 
      label: 'Active Licenses', 
      value: '3', 
      icon: FileText, 
      change: '$12,500 earned',
      color: 'text-accent' 
    },
    { 
      label: 'Security Score', 
      value: '98%', 
      icon: ShieldCheck, 
      change: 'Excellent',
      color: 'text-accent' 
    },
    { 
      label: 'Pending Requests', 
      value: pendingRequests.length, 
      icon: Clock, 
      change: 'Action required',
      color: 'text-warning' 
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
                    <stat.icon className="w-6 h-6" weight="duotone" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Requests */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Pending License Requests</CardTitle>
              <Link to="/dashboard/vault">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.slice(0, 3).map((request) => (
                  <div 
                    key={request.id} 
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-warning" weight="fill" />
                      </div>
                      <div>
                        <p className="font-medium">{request.studioName}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.rightType.replace('-', ' ')} for "{request.projectName}"
                        </p>
                      </div>
                    </div>
                    <Link to="/dashboard/vault">
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No pending requests</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/dashboard/vault" className="block">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Vault className="w-5 h-5 text-primary" weight="duotone" />
                    </div>
                    <div>
                      <p className="font-medium">Upload New Asset</p>
                      <p className="text-sm text-muted-foreground">Secure voice, face, or motion data</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>

              <Link to="/dashboard/marketplace" className="block">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <TrendUp className="w-5 h-5 text-accent" weight="duotone" />
                    </div>
                    <div>
                      <p className="font-medium">Explore Opportunities</p>
                      <p className="text-sm text-muted-foreground">Browse casting calls and licensing</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>

              <Link to="/dashboard/contracts" className="block">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-info/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-info" weight="duotone" />
                    </div>
                    <div>
                      <p className="font-medium">Review Contracts</p>
                      <p className="text-sm text-muted-foreground">AI-powered clause analysis</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Security Alert */}
        {assets.length === 0 && (
          <Card className="bg-warning/10 border-warning/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Warning className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" weight="fill" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Complete Your Protection</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your vault is empty. Upload your biometric data to start protecting your digital identity.
                  </p>
                  <Link to="/dashboard/vault">
                    <Button size="sm" className="gap-2">
                      Go to Vault <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
