import { useState, useCallback, useEffect } from 'react';
import { 
  CloudArrowUp, 
  Microphone, 
  User, 
  PersonArmsSpread,
  ShieldCheck,
  CheckCircle,
  Clock,
  Spinner,
  Lock,
  Bell,
  ArrowRight,
  X,
  Fingerprint
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { storage, VaultAsset, LicenseRequest, generateUsageToken } from '@/lib/store';
import { cn } from '@/lib/utils';

const assetTypes = [
  { id: 'voice', label: 'Voice', icon: Microphone, description: 'Voice recordings and samples' },
  { id: 'face', label: 'Face', icon: User, description: 'Facial recognition data' },
  { id: 'motion', label: 'Motion', icon: PersonArmsSpread, description: 'Movement and gesture data' },
];

export default function VaultPage() {
  const [assets, setAssets] = useState<VaultAsset[]>([]);
  const [licenseRequests, setLicenseRequests] = useState<LicenseRequest[]>([]);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanningId, setCurrentScanningId] = useState<string | null>(null);
  
  // License approval modal
  const [selectedRequest, setSelectedRequest] = useState<LicenseRequest | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [approvedToken, setApprovedToken] = useState<string>('');

  useEffect(() => {
    setAssets(storage.getVaultAssets());
    setLicenseRequests(storage.getLicenseRequests());
  }, []);

  const handleFileUpload = async (type: 'voice' | 'face' | 'motion') => {
    setUploadingType(type);
    
    const newAsset: VaultAsset = {
      id: crypto.randomUUID(),
      name: `${type}_capture_${Date.now()}`,
      type,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      size: `${(Math.random() * 50 + 10).toFixed(1)} MB`,
    };
    
    storage.addVaultAsset(newAsset);
    setAssets([...assets, newAsset]);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Start scanning
    setUploadingType(null);
    setIsScanning(true);
    setCurrentScanningId(newAsset.id);
    storage.updateVaultAsset(newAsset.id, { status: 'scanning' });
    setAssets(prev => prev.map(a => a.id === newAsset.id ? { ...a, status: 'scanning' } : a));
    
    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 5) {
      setScanProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Complete
    setIsScanning(false);
    setCurrentScanningId(null);
    setScanProgress(0);
    storage.updateVaultAsset(newAsset.id, { status: 'verified' });
    setAssets(prev => prev.map(a => a.id === newAsset.id ? { ...a, status: 'verified' } : a));
    
    // After a short delay, mark as tamper-proof
    setTimeout(() => {
      storage.updateVaultAsset(newAsset.id, { status: 'tamper-proof' });
      setAssets(prev => prev.map(a => a.id === newAsset.id ? { ...a, status: 'tamper-proof' } : a));
    }, 2000);
  };

  const handleSlideAuthorize = async () => {
    if (slideProgress < 100) return;
    
    setIsAuthorizing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const token = generateUsageToken();
    setApprovedToken(token);
    
    if (selectedRequest) {
      storage.updateLicenseRequest(selectedRequest.id, { 
        status: 'approved', 
        usageToken: token 
      });
      setLicenseRequests(prev => 
        prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'approved', usageToken: token } : r)
      );
    }
    
    setIsAuthorizing(false);
    setSelectedRequest(null);
    setSlideProgress(0);
    setShowSuccessModal(true);
  };

  const handleSlideMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.buttons) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const progress = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setSlideProgress(progress);
  };

  const handleRejectRequest = (request: LicenseRequest) => {
    storage.updateLicenseRequest(request.id, { status: 'rejected' });
    setLicenseRequests(prev => 
      prev.map(r => r.id === request.id ? { ...r, status: 'rejected' } : r)
    );
  };

  const getStatusBadge = (status: VaultAsset['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      case 'scanning':
        return <Badge className="gap-1 bg-warning/20 text-warning border-warning/30"><Spinner className="w-3 h-3 animate-spin" /> Scanning</Badge>;
      case 'verified':
        return <Badge className="gap-1 bg-accent/20 text-accent border-accent/30"><CheckCircle className="w-3 h-3" /> Verified</Badge>;
      case 'tamper-proof':
        return <Badge className="gap-1 bg-primary/20 text-primary border-primary/30"><ShieldCheck className="w-3 h-3" /> Tamper-Proof</Badge>;
    }
  };

  const pendingRequests = licenseRequests.filter(r => r.status === 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Pending License Requests */}
        {pendingRequests.length > 0 && (
          <Card className="bg-warning/5 border-warning/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5 text-warning" weight="fill" />
                Pending Authorization Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingRequests.map((request) => (
                <div 
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
                >
                  <div>
                    <p className="font-semibold">{request.studioName}</p>
                    <p className="text-sm text-muted-foreground">
                      Requests <span className="text-foreground font-medium">{request.rightType.replace('-', ' ')}</span> rights for "{request.projectName}"
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRejectRequest(request)}
                    >
                      Decline
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                      className="gap-1"
                    >
                      Authorize <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Upload Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Upload Biometric Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {assetTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleFileUpload(type.id as 'voice' | 'face' | 'motion')}
                  disabled={uploadingType !== null || isScanning}
                  className={cn(
                    "p-6 rounded-xl border-2 border-dashed text-center transition-all hover:border-primary hover:bg-primary/5",
                    uploadingType === type.id ? "border-primary bg-primary/10" : "border-border"
                  )}
                >
                  {uploadingType === type.id ? (
                    <Spinner className="w-10 h-10 mx-auto mb-3 text-primary animate-spin" />
                  ) : (
                    <type.icon className="w-10 h-10 mx-auto mb-3 text-primary" weight="duotone" />
                  )}
                  <p className="font-semibold mb-1">{type.label}</p>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scanning Animation */}
        {isScanning && (
          <Card className="bg-card border-primary overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Scanning & Encrypting</p>
                  <p className="text-sm text-muted-foreground">Securing your biometric data with military-grade encryption</p>
                </div>
                <span className="text-2xl font-bold text-primary">{scanProgress}%</span>
              </div>
              
              <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-primary transition-all duration-100"
                  style={{ width: `${scanProgress}%` }}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent animate-scan"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vault Assets Grid */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Protected Assets</CardTitle>
          </CardHeader>
          <CardContent>
            {assets.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map((asset) => {
                  const typeInfo = assetTypes.find(t => t.id === asset.type);
                  const Icon = typeInfo?.icon || Microphone;
                  
                  return (
                    <div 
                      key={asset.id}
                      className="p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" weight="duotone" />
                        </div>
                        {getStatusBadge(asset.status)}
                      </div>
                      <p className="font-medium text-sm truncate mb-1">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {asset.size} • {new Date(asset.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <CloudArrowUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No assets uploaded yet</p>
                <p className="text-sm text-muted-foreground">Upload your biometric data to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Authorization Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => { setSelectedRequest(null); setSlideProgress(0); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-primary" />
              Authorize License
            </DialogTitle>
          </DialogHeader>
          
          {selectedRequest && !isAuthorizing && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Studio</p>
                <p className="font-semibold">{selectedRequest.studioName}</p>
                <p className="text-sm text-muted-foreground mt-3 mb-1">Project</p>
                <p className="font-semibold">{selectedRequest.projectName}</p>
                <p className="text-sm text-muted-foreground mt-3 mb-1">Right Type</p>
                <p className="font-semibold capitalize">{selectedRequest.rightType.replace('-', ' ')}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-3 text-center">
                  Slide to authorize this request
                </p>
                <div 
                  className="relative h-14 rounded-full bg-secondary border border-border overflow-hidden cursor-pointer"
                  onMouseMove={handleSlideMove}
                  onMouseUp={handleSlideAuthorize}
                >
                  <div 
                    className="absolute inset-y-0 left-0 bg-primary/20 transition-all"
                    style={{ width: `${slideProgress}%` }}
                  />
                  <div 
                    className="absolute top-1 bottom-1 left-1 w-12 rounded-full bg-primary flex items-center justify-center transition-all"
                    style={{ left: `calc(${slideProgress}% - ${slideProgress * 0.52}px + 4px)` }}
                  >
                    <ArrowRight className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-muted-foreground">
                    {slideProgress > 50 ? 'Release to authorize' : 'Slide to authorize'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {isAuthorizing && (
            <div className="py-8 text-center">
              <Spinner className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              <p className="font-semibold">Generating Usage Token...</p>
              <p className="text-sm text-muted-foreground">Creating cryptographically signed authorization</p>
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
            <h2 className="text-xl font-bold mb-2">Authorization Complete</h2>
            <Badge className="mb-4 gap-1 bg-accent/20 text-accent border-accent/30">
              <ShieldCheck className="w-3 h-3" /> Cryptographically Signed
            </Badge>
            <div className="p-3 rounded-lg bg-secondary border border-border font-mono text-xs break-all mb-4">
              {approvedToken}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This usage token has been sent to the studio. They can now use your licensed rights within the agreed terms.
            </p>
            <Button className="w-full" onClick={() => setShowSuccessModal(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
