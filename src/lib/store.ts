// Simple state management using localStorage
export interface User {
  id: string;
  email: string;
  role: 'actor' | 'studio' | 'agency' | 'lawyer';
  name: string;
  verified: boolean;
  verificationId?: string;
}

export interface VaultAsset {
  id: string;
  name: string;
  type: 'voice' | 'face' | 'motion';
  status: 'pending' | 'scanning' | 'verified' | 'tamper-proof';
  uploadedAt: string;
  size: string;
}

export interface LicenseRequest {
  id: string;
  studioName: string;
  projectName: string;
  rightType: 'voice-cloning' | 'face-synthesis' | 'full-likeness';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  usageToken?: string;
}

export interface CastingCall {
  id: string;
  title: string;
  studio: string;
  role: string;
  description: string;
  budget: string;
  deadline: string;
  requirements: string[];
  applied?: boolean;
}

const STORAGE_KEYS = {
  USER: 'theatre_ai_user',
  VAULT_ASSETS: 'theatre_ai_vault_assets',
  LICENSE_REQUESTS: 'theatre_ai_license_requests',
  ONBOARDING_STEP: 'theatre_ai_onboarding_step',
};

export const storage = {
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  getVaultAssets: (): VaultAsset[] => {
    const data = localStorage.getItem(STORAGE_KEYS.VAULT_ASSETS);
    return data ? JSON.parse(data) : [];
  },

  addVaultAsset: (asset: VaultAsset): void => {
    const assets = storage.getVaultAssets();
    assets.push(asset);
    localStorage.setItem(STORAGE_KEYS.VAULT_ASSETS, JSON.stringify(assets));
  },

  updateVaultAsset: (id: string, updates: Partial<VaultAsset>): void => {
    const assets = storage.getVaultAssets();
    const index = assets.findIndex(a => a.id === id);
    if (index !== -1) {
      assets[index] = { ...assets[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.VAULT_ASSETS, JSON.stringify(assets));
    }
  },

  getLicenseRequests: (): LicenseRequest[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LICENSE_REQUESTS);
    if (data) return JSON.parse(data);
    
    // Default mock license requests
    return [
      {
        id: '1',
        studioName: 'Universal Pictures India',
        projectName: 'Project X',
        rightType: 'voice-cloning',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        studioName: 'Netflix Studios',
        projectName: 'Eternal Shadows',
        rightType: 'face-synthesis',
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  },

  updateLicenseRequest: (id: string, updates: Partial<LicenseRequest>): void => {
    const requests = storage.getLicenseRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
      requests[index] = { ...requests[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.LICENSE_REQUESTS, JSON.stringify(requests));
    }
  },

  getOnboardingStep: (): number => {
    return parseInt(localStorage.getItem(STORAGE_KEYS.ONBOARDING_STEP) || '1');
  },

  setOnboardingStep: (step: number): void => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_STEP, step.toString());
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },
};

export const mockCastingCalls: CastingCall[] = [
  {
    id: '1',
    title: 'Lead Voice Actor - Animated Feature',
    studio: 'DreamWorks Animation',
    role: 'Main Character Voice',
    description: 'Seeking a versatile voice actor for an upcoming animated feature film. Must be able to convey emotion and comedy.',
    budget: '$50,000 - $80,000',
    deadline: '2024-03-15',
    requirements: ['Voice Demo Required', 'CastID Verified', '5+ Years Experience'],
  },
  {
    id: '2',
    title: 'Digital Double - Action Sequence',
    studio: 'Marvel Studios',
    role: 'Stunt Double',
    description: 'Looking for actors willing to license their face for digital doubles in high-action sequences.',
    budget: '$25,000 per scene',
    deadline: '2024-02-28',
    requirements: ['Full Biometric Scan', 'Motion Capture Experience'],
  },
  {
    id: '3',
    title: 'AI Training Dataset - Voice',
    studio: 'Anthropic Entertainment',
    role: 'Voice Dataset Contributor',
    description: 'Contribute your voice to train ethical AI systems. Full consent and compensation.',
    budget: '$15,000 + Royalties',
    deadline: '2024-04-01',
    requirements: ['CastID Voice Verification', 'Non-Exclusive License'],
  },
  {
    id: '4',
    title: 'Virtual Brand Ambassador',
    studio: 'Meta Reality Labs',
    role: 'Digital Avatar',
    description: 'Create a permanent digital avatar for VR experiences. Long-term licensing opportunity.',
    budget: '$100,000 + Annual Royalties',
    deadline: '2024-03-30',
    requirements: ['Full Likeness License', '3D Scan Session', 'Exclusivity Negotiable'],
  },
];

export const generateUsageToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = 'TH_';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};
