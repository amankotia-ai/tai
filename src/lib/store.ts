// Simple state management using localStorage
export interface User {
  id: string;
  email: string;
  role: 'actor' | 'studio' | 'agency' | 'lawyer';
  name: string;
  location?: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
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
  visibility?: 'private' | 'public' | 'request-only';
  metadataTags?: string[];
  aiTags?: string[];
  previewType?: 'audio' | '3d' | 'image';
  isHeadshot?: boolean;
  fileExtension?: string;
}

export interface ConsentItem {
  id: string;
  category: 'voice' | 'likeness' | 'motion' | 'training';
  label: string;
  description: string;
  status: 'granted' | 'revoked' | 'conditional';
  conditions?: {
    territory: string[];
    duration: string;
    useCases: string[];
    trainingPolicy?: 'allow-training' | 'inference-only' | 'disabled';
    inferenceAllowed?: boolean;
    expiryDate?: string;
  };
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
  CONSENT_MATRIX: 'theatre_ai_consent_matrix',
};

export const storage = {
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (data) {
      return JSON.parse(data);
    }
    return {
      id: 'user-1',
      email: 'actor@example.com',
      role: 'actor',
      name: 'Jane Smith',
      location: 'Mumbai, India',
      verificationStatus: 'verified',
      verified: true,
      verificationId: 'CASTID-001',
    };
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
    const index = assets.findIndex((a) => a.id === id);
    if (index !== -1) {
      assets[index] = { ...assets[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.VAULT_ASSETS, JSON.stringify(assets));
    }
  },

  getLicenseRequests: (): LicenseRequest[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LICENSE_REQUESTS);
    if (data) return JSON.parse(data);

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

  addLicenseRequest: (request: LicenseRequest): void => {
    const requests = storage.getLicenseRequests();
    const existsIndex = requests.findIndex((r) => r.id === request.id);
    if (existsIndex >= 0) {
      requests[existsIndex] = request;
    } else {
      requests.unshift(request);
    }
    localStorage.setItem(STORAGE_KEYS.LICENSE_REQUESTS, JSON.stringify(requests));
  },

  updateLicenseRequest: (id: string, updates: Partial<LicenseRequest>): void => {
    const requests = storage.getLicenseRequests();
    const index = requests.findIndex((r) => r.id === id);
    if (index !== -1) {
      requests[index] = { ...requests[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.LICENSE_REQUESTS, JSON.stringify(requests));
    }
  },

  getOnboardingStep: (): number => {
    return parseInt(localStorage.getItem(STORAGE_KEYS.ONBOARDING_STEP) || '1', 10);
  },

  setOnboardingStep: (step: number): void => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_STEP, step.toString());
  },

  getConsentMatrix: (): ConsentItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONSENT_MATRIX);
    if (data) return JSON.parse(data);

    return [
      {
        id: 'c1',
        category: 'voice',
        label: 'Voice Cloning',
        description: 'Creation of AI voice model from audio samples',
        status: 'granted',
        conditions: {
          territory: ['North America', 'Europe'],
          duration: 'Project Duration only',
          useCases: ['Dubbing', 'Localization'],
          trainingPolicy: 'inference-only',
          inferenceAllowed: true,
          expiryDate: '2026-12-31',
        },
      },
      {
        id: 'c2',
        category: 'likeness',
        label: 'Digital Double',
        description: '3D scanning and reconstruction of face/body',
        status: 'conditional',
        conditions: {
          territory: ['Worldwide'],
          duration: '2 Years',
          useCases: ['VFX Background', 'Stunt Double'],
          trainingPolicy: 'inference-only',
          inferenceAllowed: true,
          expiryDate: '2027-12-31',
        },
      },
      {
        id: 'c3',
        category: 'training',
        label: 'Generative Training',
        description: 'Use data to train foundational models',
        status: 'revoked',
      },
      {
        id: 'c4',
        category: 'motion',
        label: 'Motion Capture',
        description: 'Recording of movement patterns',
        status: 'granted',
        conditions: {
          territory: ['Worldwide'],
          duration: 'Perpetual',
          useCases: ['Game Animation'],
          trainingPolicy: 'allow-training',
          inferenceAllowed: true,
          expiryDate: '2028-12-31',
        },
      },
    ];
  },

  updateConsent: (id: string, updates: Partial<ConsentItem>): void => {
    const items = storage.getConsentMatrix();
    const index = items.findIndex((i) => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.CONSENT_MATRIX, JSON.stringify(items));
    }
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  },
};

export const mockCastingCalls: CastingCall[] = [
  {
    id: '1',
    title: 'Lead Voice Actor - Animated Feature',
    studio: 'DreamWorks Animation',
    role: 'Main Character Voice',
    description: 'Seeking a versatile voice actor for an upcoming animated feature film.',
    budget: 'INR 41.5L - INR 66.4L',
    deadline: '2026-03-15',
    requirements: ['Voice Demo Required', 'CastID Verified', '5+ Years Experience'],
  },
  {
    id: '2',
    title: 'Digital Double - Action Sequence',
    studio: 'Marvel Studios',
    role: 'Stunt Double',
    description: 'Looking for actors willing to license their face for digital doubles.',
    budget: 'INR 20.8L per scene',
    deadline: '2026-02-28',
    requirements: ['Full Biometric Scan', 'Motion Capture Experience'],
  },
  {
    id: '3',
    title: 'AI Training Dataset - Voice',
    studio: 'Anthropic Entertainment',
    role: 'Voice Dataset Contributor',
    description: 'Contribute your voice to train ethical AI systems.',
    budget: 'INR 12.5L + royalties',
    deadline: '2026-04-01',
    requirements: ['CastID Voice Verification', 'Non-Exclusive License'],
  },
  {
    id: '4',
    title: 'Virtual Brand Ambassador',
    studio: 'Meta Reality Labs',
    role: 'Digital Avatar',
    description: 'Create a permanent digital avatar for VR experiences.',
    budget: 'INR 83L + annual royalties',
    deadline: '2026-03-30',
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

// Search feature types
export interface Actor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  verified: boolean;
  skills: string[];
  location: string;
  avatar?: string;
  rateRange: string;
}

export interface Studio {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  projectCount: number;
  verified: boolean;
  logoUrl?: string;
}

export interface Agency {
  id: string;
  name: string;
  description: string;
  rosterSize: number;
  specialties: string[];
  verified: boolean;
  location: string;
}

export const mockActors: Actor[] = [
  {
    id: 'actor-1',
    name: 'Priya Sharma',
    specialty: 'Voice Actor',
    bio: 'Award-winning voice actor with 10+ years of experience in animation and gaming.',
    rating: 4.9,
    verified: true,
    skills: ['Animation', 'Gaming', 'Commercial', 'Narration'],
    location: 'Mumbai, India',
    rateRange: '$500 - $2,000 per session',
  },
  {
    id: 'actor-2',
    name: 'Rahul Kapoor',
    specialty: 'Motion Capture Artist',
    bio: 'Professional motion capture performer specializing in action sequences.',
    rating: 4.8,
    verified: true,
    skills: ['Motion Capture', 'Stunts', 'Martial Arts'],
    location: 'Hyderabad, India',
    rateRange: '$1,000 - $5,000 per day',
  },
  {
    id: 'actor-3',
    name: 'Ananya Iyer',
    specialty: 'Digital Double',
    bio: 'Specialized in providing digital likeness for film and advertising.',
    rating: 4.7,
    verified: true,
    skills: ['Digital Double', '3D Scanning', 'Photogrammetry'],
    location: 'Bangalore, India',
    rateRange: '$2,000 - $10,000 per project',
  },
  {
    id: 'actor-4',
    name: 'Vikram Singh',
    specialty: 'Voice Actor',
    bio: 'Deep, resonant voice perfect for documentaries and trailers.',
    rating: 4.6,
    verified: true,
    skills: ['Narration', 'Audiobooks', 'Dubbing'],
    location: 'Delhi, India',
    rateRange: '$300 - $1,500 per session',
  },
];

export const mockStudios: Studio[] = [
  {
    id: 'studio-1',
    name: 'DreamWorks Animation India',
    type: 'Animation Studio',
    description: 'Leading animation studio creating world-class animated features.',
    location: 'Mumbai, India',
    projectCount: 24,
    verified: true,
  },
  {
    id: 'studio-2',
    name: 'Netflix Studios Mumbai',
    type: 'Streaming Production',
    description: 'Original content production arm of Netflix for South Asian markets.',
    location: 'Mumbai, India',
    projectCount: 18,
    verified: true,
    logoUrl: 'https://static.vecteezy.com/system/resources/previews/017/396/814/non_2x/netflix-mobile-application-logo-free-png.png',
  },
  {
    id: 'studio-3',
    name: 'Technicolor Games',
    type: 'Game Development',
    description: 'AAA game studio specializing in performance capture.',
    location: 'Bangalore, India',
    projectCount: 8,
    verified: true,
  },
];

export const mockAgencies: Agency[] = [
  {
    id: 'agency-1',
    name: 'Talent Connect India',
    description: 'Premier talent agency representing voice actors and digital performers.',
    rosterSize: 150,
    specialties: ['Voice Acting', 'Motion Capture', 'Digital Doubles'],
    verified: true,
    location: 'Mumbai, India',
  },
  {
    id: 'agency-2',
    name: 'Digital Artists Guild',
    description: 'Specialized agency for digital performance artists.',
    rosterSize: 75,
    specialties: ['Digital Performance', 'Likeness Rights'],
    verified: true,
    location: 'Bangalore, India',
  },
  {
    id: 'agency-3',
    name: 'Voice Box Artists',
    description: 'Boutique voice acting agency with premium roster.',
    rosterSize: 45,
    specialties: ['Voice Acting', 'Dubbing', 'Commercial VO'],
    verified: true,
    location: 'Delhi, India',
  },
];

// Chat feature types
export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantType: 'actor' | 'studio' | 'agency';
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
  online?: boolean;
  status: 'active' | 'request';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  isOwn?: boolean;
}

export interface NetworkConnection {
  id: string;
  name: string;
  role: string;
  avatar: string;
  type: 'actor' | 'studio' | 'agency';
  connected: boolean;
}

export const mockNetworkConnections: NetworkConnection[] = [
  {
    id: '1',
    name: 'James Cameron',
    role: 'Director',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop',
    type: 'studio',
    connected: true,
  },
  {
    id: '2',
    name: 'Sarah Jones',
    role: 'Casting Director',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop',
    type: 'agency',
    connected: true,
  },
  {
    id: '3',
    name: 'Priya Sharma',
    role: 'Actor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop',
    type: 'actor',
    connected: true,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantId: 'studio-1',
    participantName: 'DreamWorks Animation India',
    participantType: 'studio',
    lastMessage: 'We would love to discuss the voice acting opportunity with you.',
    unreadCount: 2,
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    online: true,
    status: 'active',
  },
  {
    id: 'conv-2',
    participantId: 'agency-1',
    participantName: 'Talent Connect India',
    participantType: 'agency',
    lastMessage: 'Your license request has been processed successfully.',
    unreadCount: 0,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    online: true,
    status: 'active',
  },
  {
    id: 'conv-3',
    participantId: 'studio-2',
    participantName: 'Netflix Studios Mumbai',
    participantType: 'studio',
    lastMessage: 'Thank you for your interest in the project!',
    unreadCount: 1,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    online: false,
    status: 'request',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1-1',
    conversationId: 'conv-1',
    senderId: 'studio-1',
    senderName: 'DreamWorks Animation India',
    content: 'Hello! We noticed your impressive voice acting portfolio on CastID.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
    isOwn: false,
  },
  {
    id: 'msg-1-2',
    conversationId: 'conv-1',
    senderId: 'user',
    senderName: 'You',
    content: 'Thank you! I am very interested in voice acting opportunities.',
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    read: true,
    isOwn: true,
  },
  {
    id: 'msg-1-3',
    conversationId: 'conv-1',
    senderId: 'studio-1',
    senderName: 'DreamWorks Animation India',
    content: 'We have an upcoming animated feature that might be perfect for you.',
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    read: true,
    isOwn: false,
  },
  {
    id: 'msg-2-1',
    conversationId: 'conv-2',
    senderId: 'agency-1',
    senderName: 'Talent Connect India',
    content: 'Welcome to Talent Connect! We are excited to have you on our platform.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    isOwn: false,
  },
  {
    id: 'msg-3-1',
    conversationId: 'conv-3',
    senderId: 'studio-2',
    senderName: 'Netflix Studios Mumbai',
    content: 'Thank you for your interest in the project!',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: false,
    isOwn: false,
  },
];

// Social feed types
export interface Community {
  id: string;
  name: string;
  memberCount: number;
}

export interface FeedEvent {
  id: string;
  name: string;
  date: string;
  city: string;
  hostedBy: string;
  isAttending?: boolean;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorType: 'actor' | 'studio' | 'agency';
  authorAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  hasImage?: boolean;
  imageUrl?: string;
  attachmentType?: 'image' | 'video' | 'audio' | 'link' | 'poll';
  videoUrl?: string;
  videoTitle?: string;
  audioUrl?: string;
  audioTitle?: string;
  linkUrl?: string;
  linkTitle?: string;
  pollQuestion?: string;
  pollOptions?: string[];
}

export const mockCommunities: Community[] = [
  { id: 'comm-1', name: 'Women in Film India', memberCount: 2540 },
  { id: 'comm-2', name: 'Actors for Change', memberCount: 1823 },
  { id: 'comm-3', name: 'Actor Prepares', memberCount: 956 },
  { id: 'comm-4', name: "The Actor's Truth", memberCount: 1247 },
  { id: 'comm-5', name: "The Actor's Lab", memberCount: 678 },
];

export const mockEvents: FeedEvent[] = [
  {
    id: 'event-1',
    name: 'Voice Acting Workshop',
    date: '2026-02-15',
    city: 'Mumbai',
    hostedBy: 'Talent Connect India',
    isAttending: false,
  },
  {
    id: 'event-2',
    name: 'Digital Rights Seminar',
    date: '2026-02-18',
    city: 'Delhi',
    hostedBy: 'Digital Artists Guild',
    isAttending: false,
  },
  {
    id: 'event-3',
    name: 'Motion Capture Masterclass',
    date: '2026-02-22',
    city: 'Bangalore',
    hostedBy: 'Technicolor Games',
    isAttending: true,
  },
];

export const mockFeedPosts: FeedPost[] = [
  {
    id: 'post-1',
    authorId: 'actor-1',
    authorName: 'Priya Sharma',
    authorRole: 'Voice Actor',
    authorType: 'actor',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop',
    content: 'Just wrapped up an amazing session at the DreamWorks studio. Grateful for the opportunity! 🎙️',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 124,
    comments: 18,
    shares: 7,
  },
  {
    id: 'post-2',
    authorId: 'studio-1',
    authorName: 'DreamWorks Animation India',
    authorRole: 'Animation Studio',
    authorType: 'studio',
    content: 'We are launching a new voice casting initiative. Verified profiles welcome. #NowCasting',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    likes: 256,
    comments: 42,
    shares: 89,
    hasImage: true,
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=400&fit=crop',
  },
  {
    id: 'post-3',
    authorId: 'agency-2',
    authorName: 'Digital Artists Guild',
    authorRole: 'Talent Agency',
    authorType: 'agency',
    content: 'New guidelines for AI training consent are out. Review your profile settings today.',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    likes: 89,
    comments: 31,
    shares: 56,
  },
];
