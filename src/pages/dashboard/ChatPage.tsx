import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Buildings,
  CaretRight,
  ChatCircle,
  CheckCircle,
  Checks,
  Eye,
  FileText,
  Lock,
  MagnifyingGlass,
  PaperPlaneRight,
  Plus,
  ShieldCheck,
  UserCircle,
  X,
} from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Conversation,
  Message,
  NetworkConnection,
  mockConversations,
  mockMessages,
  mockNetworkConnections,
  storage,
} from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type SecureFileType = 'script' | 'nda' | 'brief';

interface SecureAttachment {
  type: SecureFileType;
  name: string;
  size: string;
}

interface ReferencedAsset {
  id: string;
  label: string;
  assetType: 'voice' | 'likeness' | 'motion';
  rightsStatus: 'licensed' | 'conditional' | 'restricted';
}

interface ChatMessage extends Message {
  attachments?: SecureAttachment[];
  referencedAsset?: ReferencedAsset;
}

type NewChatContactSource = 'recent' | 'connect';
type NewChatSourceFilter = 'all' | NewChatContactSource;
type NewChatTypeFilter = 'all' | 'actor' | 'studio' | 'agency';

interface NewChatContact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  type: 'actor' | 'studio' | 'agency';
  source: NewChatContactSource;
  conversationId?: string;
}

const NEW_CHAT_SOURCE_FILTERS: { id: NewChatSourceFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'connect', label: 'Connects' },
  { id: 'recent', label: 'Recent' },
];

const NEW_CHAT_TYPE_FILTERS: { id: NewChatTypeFilter; label: string }[] = [
  { id: 'all', label: 'All types' },
  { id: 'actor', label: 'Actors' },
  { id: 'studio', label: 'Studios' },
  { id: 'agency', label: 'Agencies' },
];

const SECURE_ATTACHMENT_PRESETS: Record<SecureFileType, Omit<SecureAttachment, 'type'>> = {
  script: { name: 'Scene_40_Rewrite.pdf', size: '1.8 MB' },
  nda: { name: 'Mutual_NDA_v4.pdf', size: '420 KB' },
  brief: { name: 'Voice_Direction_Brief.pdf', size: '760 KB' },
};

const REFERENCE_ASSETS: ReferencedAsset[] = [
  { id: 'asset-voice-01', label: 'Hero Voice v3', assetType: 'voice', rightsStatus: 'licensed' },
  { id: 'asset-likeness-02', label: 'Lead Likeness Scan', assetType: 'likeness', rightsStatus: 'conditional' },
  { id: 'asset-motion-03', label: 'Stunt Motion Capture', assetType: 'motion', rightsStatus: 'licensed' },
];

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatParticipantTypeLabel(type: 'actor' | 'studio' | 'agency'): string {
  if (type === 'actor') return 'Actor';
  if (type === 'studio') return 'Studio';
  return 'Agency';
}

function formatAssetTypeLabel(type: ReferencedAsset['assetType']): string {
  if (type === 'voice') return 'Voice';
  if (type === 'likeness') return 'Likeness';
  return 'Motion';
}

function formatRightsLabel(status: ReferencedAsset['rightsStatus']): string {
  if (status === 'licensed') return 'Licensed';
  if (status === 'conditional') return 'Conditional';
  return 'Restricted';
}

function getParticipantIconConfig(type: 'actor' | 'studio' | 'agency') {
  switch (type) {
    case 'actor':
      return {
        icon: UserCircle,
        bg: 'bg-muted/70',
        text: 'text-foreground',
        ring: 'ring-border/70',
        badge: 'bg-muted/70 text-muted-foreground',
      };
    case 'studio':
      return {
        icon: Buildings,
        bg: 'bg-[#D61D1F]/10',
        text: 'text-[#D61D1F]',
        ring: 'ring-[#D61D1F]/20',
        badge: 'bg-[#D61D1F]/10 text-[#D61D1F]',
      };
    case 'agency':
      return {
        icon: Briefcase,
        bg: 'bg-amber-500/10',
        text: 'text-amber-700',
        ring: 'ring-amber-500/20',
        badge: 'bg-amber-500/10 text-amber-700',
      };
  }
}

function getParticipantLink(type: 'actor' | 'studio' | 'agency', id: string) {
  switch (type) {
    case 'actor':
      return `/dashboard/actor/${id}`;
    case 'studio':
      return `/dashboard/studio/${id}`;
    case 'agency':
      return `/dashboard/agency/${id}`;
  }
}

type RealtimeState = 'connecting' | 'connected' | 'offline' | 'error';

function realtimeStateLabel(state: RealtimeState): string {
  if (state === 'connected') return 'Secure Live';
  if (state === 'connecting') return 'Connecting';
  if (state === 'offline') return 'Offline';
  return 'Connection Error';
}

function realtimeStateClasses(state: RealtimeState): string {
  if (state === 'connected') return 'bg-emerald-500/10 text-emerald-700';
  if (state === 'connecting') return 'bg-amber-500/10 text-amber-700';
  if (state === 'offline') return 'bg-muted text-muted-foreground';
  return 'bg-destructive/10 text-destructive';
}

function ChatOverviewCard({
  totalUnread,
  requestCount,
  conversationCount,
  archivedCount,
  realtimeState,
  conversations,
  onOpenNewChat,
  onOpenRequests,
  onSelectConversation,
}: {
  totalUnread: number;
  requestCount: number;
  conversationCount: number;
  archivedCount: number;
  realtimeState: RealtimeState;
  conversations: Conversation[];
  onOpenNewChat: () => void;
  onOpenRequests: () => void;
  onSelectConversation: (conversation: Conversation) => void;
}) {
  const user = storage.getUser();
  const statusItems = [
    { label: 'Unread', value: `${totalUnread} messages`, icon: ChatCircle },
    { label: 'Requests', value: `${requestCount} pending`, icon: ShieldCheck },
    { label: 'Conversations', value: `${conversationCount} threads`, icon: Eye },
    { label: 'Archived', value: `${archivedCount} hidden`, icon: FileText },
  ];
  const needsReply = [...conversations]
    .filter((conversation) => conversation.unreadCount > 0)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);
  const activeNow = conversations.filter((conversation) => conversation.online).slice(0, 4);

  return (
    <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="size-12 overflow-hidden rounded-full bg-muted ring-2 ring-background shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop"
              alt={user?.name || 'Profile'}
              className="size-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-emerald-500" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-foreground">{user?.name || 'Jane Smith'}</h3>
          <p className="text-[11px] capitalize text-muted-foreground">{user?.role || 'actor'} inbox</p>
        </div>

        <Link
          to="/dashboard/profile"
          aria-label="Open profile"
          className="flex size-9 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <CaretRight className="size-4" weight="bold" />
        </Link>
      </div>

      <div className="my-4 h-px bg-border/50" />

      <section>
        <div className="mb-3 flex items-center gap-2">
          <ChatCircle className="size-4 text-[#0052FF]" weight="fill" />
          <h4 className="text-balance text-[13px] font-semibold text-foreground">Message Health</h4>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {statusItems.map((item) => (
            <div
              key={item.label}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-[#ECECEC] bg-[#FAFAFA] px-3 py-2.5"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-white text-muted-foreground">
                <item.icon className="size-4" weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="my-5 h-px bg-border/50" />

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Lock className="size-4 text-[#0052FF]" weight="fill" />
          <h4 className="text-balance text-[13px] font-semibold text-foreground">Secure Channel</h4>
        </div>
        <div className="space-y-2 rounded-xl border border-[#ECECEC] bg-[#FAFAFA] p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-foreground">Realtime Link</span>
            <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-medium', realtimeStateClasses(realtimeState))}>
              {realtimeState === 'connected' ? 'WebSocket Active' : realtimeStateLabel(realtimeState)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-foreground">Audit Trail</span>
            <span className="text-[10px] text-muted-foreground">On-platform logs</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-foreground">File Protection</span>
            <span className="text-[10px] text-muted-foreground">Encrypted documents</span>
          </div>
        </div>
      </section>

      <div className="my-5 h-px bg-border/50" />

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Plus className="size-4 text-[#0052FF]" weight="fill" />
          <h4 className="text-balance text-[13px] font-semibold text-foreground">Quick Actions</h4>
        </div>
        <div className="space-y-2">
          <button
            type="button"
            onClick={onOpenNewChat}
            className="flex w-full items-center justify-between rounded-xl border border-[#ECECEC] bg-[#FAFAFA] px-3 py-2 text-left transition-colors hover:bg-muted/70"
          >
            <span className="text-[12px] font-medium text-foreground">Start New Chat</span>
            <Plus className="size-3.5 text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={onOpenRequests}
            className="flex w-full items-center justify-between rounded-xl border border-[#ECECEC] bg-[#FAFAFA] px-3 py-2 text-left transition-colors hover:bg-muted/70"
          >
            <span className="text-[12px] font-medium text-foreground">Review Requests</span>
            <span className="font-inter-numeric text-[11px] text-muted-foreground">{requestCount}</span>
          </button>
        </div>
      </section>

      <div className="my-5 h-px bg-border/50" />

      <section>
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="size-4 text-[#0052FF]" weight="fill" />
          <h4 className="text-balance text-[13px] font-semibold text-foreground">Needs Reply</h4>
        </div>
        {needsReply.length > 0 ? (
          <div className="space-y-2">
            {needsReply.map((conversation) => {
              const config = getParticipantIconConfig(conversation.participantType);
              const Icon = config.icon;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => onSelectConversation(conversation)}
                  className="flex w-full items-center gap-3 rounded-xl border border-[#ECECEC] bg-[#FAFAFA] px-2.5 py-2 text-left transition-colors hover:bg-muted/60"
                >
                  <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg ring-1', config.bg, config.text, config.ring)}>
                    <Icon className="size-4" weight="fill" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-foreground">{conversation.participantName}</p>
                    <p className="text-[10px] text-muted-foreground">{formatTimestamp(conversation.timestamp)}</p>
                  </div>
                  <Badge className="h-5 min-w-[20px] border-[#DCE7FF] bg-[#EDF3FF] px-1.5 text-[10px] text-[#0052FF]">
                    {conversation.unreadCount}
                  </Badge>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#ECECEC] bg-[#FAFAFA] px-3 py-3">
            <p className="text-pretty text-[11px] text-muted-foreground">You are all caught up. Start a new chat with your connects.</p>
            <button
              type="button"
              onClick={onOpenNewChat}
              className="mt-2 text-[11px] font-medium text-[#0052FF] transition-colors hover:text-[#0047DD]"
            >
              Start new chat
            </button>
          </div>
        )}
      </section>

      <div className="my-5 h-px bg-border/50" />

      <section>
        <div className="mb-2 flex items-center gap-2">
          <Eye className="size-4 text-[#0052FF]" weight="fill" />
          <h4 className="text-[13px] font-semibold text-foreground">Active Now</h4>
        </div>
        {activeNow.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeNow.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation)}
                className="flex items-center gap-2 rounded-full bg-[#F3F7FF] px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-[#EAF1FF]"
              >
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span className="max-w-[120px] truncate">{conversation.participantName}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground">No one is currently online.</p>
        )}
      </section>
    </Card>
  );
}

function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const config = getParticipantIconConfig(conversation.participantType);
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors',
        isActive
          ? 'border-[#E8EEFF] bg-[#F3F7FF]'
          : 'border-transparent hover:border-[#ECECEC] hover:bg-[#FAFAFA]',
      )}
    >
      <div className="relative shrink-0">
        <div className={cn('flex size-10 items-center justify-center rounded-xl ring-1', config.bg, config.text, config.ring)}>
          <Icon className="size-5" weight="fill" />
        </div>
        {conversation.online && (
          <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-emerald-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center justify-between gap-2">
          <p className="truncate text-[13px] font-semibold text-foreground">{conversation.participantName}</p>
          <span className="shrink-0 font-inter-numeric text-[11px] text-muted-foreground">
            {formatTimestamp(conversation.timestamp)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'line-clamp-1 text-pretty text-[12px]',
              conversation.unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground',
            )}
          >
            {conversation.lastMessage}
          </p>
          {conversation.unreadCount > 0 && (
            <Badge className="pointer-events-none h-5 min-w-[20px] border-[#DCE7FF] bg-[#EDF3FF] px-1.5 text-[10px] text-[#0052FF]">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

function NewChatContactItem({
  contact,
  onSelect,
}: {
  contact: NewChatContact;
  onSelect: (contact: NewChatContact) => void;
}) {
  const config = getParticipantIconConfig(contact.type);
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(contact)}
      className="group flex w-full items-center gap-3 rounded-2xl border border-[#ECECEC] bg-white px-3 py-3 text-left transition-colors hover:border-[#DCE7FF] hover:bg-[#F8FAFF]"
    >
      {contact.avatar ? (
        <img
          src={contact.avatar}
          alt={contact.name}
          className="size-10 shrink-0 rounded-xl object-cover ring-1 ring-border/60"
        />
      ) : (
        <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl ring-1', config.bg, config.text, config.ring)}>
          <Icon className="size-5" weight="fill" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[13px] font-semibold text-foreground">{contact.name}</p>
          <CaretRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" weight="bold" />
        </div>
        <p className="line-clamp-1 text-pretty text-[11px] text-muted-foreground">{contact.role}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {formatParticipantTypeLabel(contact.type)}
          </span>
          <span className={cn(
            'rounded-md px-1.5 py-0.5 text-[10px] font-medium',
            contact.source === 'connect'
              ? 'bg-[#EDF3FF] text-[#0052FF]'
              : 'bg-amber-500/10 text-amber-700',
          )}>
            {contact.source === 'connect' ? 'Connect' : 'Recent'}
          </span>
        </div>
      </div>
    </button>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  participantType?: 'actor' | 'studio' | 'agency';
}

function MessageBubble({ message, participantType }: MessageBubbleProps) {
  const config = participantType ? getParticipantIconConfig(participantType) : null;
  const Icon = config?.icon || UserCircle;

  return (
    <div className={cn('flex w-full pb-4', message.isOwn ? 'justify-end' : 'justify-start gap-3')}>
      {!message.isOwn && (
        <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-border/60', config?.bg, config?.text)}>
          <Icon className="size-4" weight="fill" />
        </div>
      )}

      <div className={cn('flex max-w-[72%] flex-col', message.isOwn ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            message.isOwn
              ? 'rounded-br-md bg-[#0052FF] text-white'
              : 'rounded-bl-md border border-[#ECECEC] bg-[#F8F8F8] text-foreground',
          )}
        >
          <p className="text-pretty text-[13px] leading-relaxed">{message.content}</p>

          {message.referencedAsset && (
            <div className="mt-2 rounded-xl border border-white/20 bg-white/10 p-2.5">
              <div className="flex items-center gap-2">
                <Lock className={cn('size-3.5', message.isOwn ? 'text-white/90' : 'text-[#0052FF]')} weight="fill" />
                <p className={cn('text-[10px] font-semibold', message.isOwn ? 'text-white/90' : 'text-[#0052FF]')}>
                  Referenced Asset
                </p>
              </div>
              <p className={cn('mt-1 text-[11px] font-medium', message.isOwn ? 'text-white' : 'text-foreground')}>
                {message.referencedAsset.label}
              </p>
              <p className={cn('text-[10px]', message.isOwn ? 'text-white/80' : 'text-muted-foreground')}>
                {formatAssetTypeLabel(message.referencedAsset.assetType)} • {formatRightsLabel(message.referencedAsset.rightsStatus)}
              </p>
            </div>
          )}

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {message.attachments.map((attachment, index) => (
                <div
                  key={`${attachment.name}-${index}`}
                  className={cn(
                    'flex items-center justify-between rounded-lg border px-2.5 py-2',
                    message.isOwn
                      ? 'border-white/20 bg-white/10 text-white'
                      : 'border-[#E7E7E7] bg-white text-foreground',
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium">{attachment.name}</p>
                    <p className={cn('text-[10px]', message.isOwn ? 'text-white/80' : 'text-muted-foreground')}>
                      {attachment.size}
                    </p>
                  </div>
                  <span className={cn(
                    'ml-2 rounded-md px-1.5 py-0.5 text-[10px] font-medium',
                    message.isOwn ? 'bg-white/15 text-white' : 'bg-[#EDF3FF] text-[#0052FF]',
                  )}>
                    Secure
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={cn('mt-1 flex items-center gap-1', message.isOwn ? 'justify-end' : 'justify-start')}>
          <span className={cn('font-inter-numeric text-[10px]', message.isOwn ? 'text-[#0052FF]/80' : 'text-muted-foreground')}>
            {formatMessageTime(message.timestamp)}
          </span>
          {message.isOwn && (
            message.read ? (
              <Checks className="size-3 text-[#0052FF]/80" weight="bold" />
            ) : (
              <CheckCircle className="size-3 text-[#0052FF]/80" weight="fill" />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeTab, setActiveTab] = useState<'active' | 'request' | 'archived'>('active');
  const [archivedConversationIds, setArchivedConversationIds] = useState<string[]>([]);
  const [realtimeState, setRealtimeState] = useState<RealtimeState>('connecting');
  const [starterContext, setStarterContext] = useState<string | null>(null);
  const [bootstrappedFromQuery, setBootstrappedFromQuery] = useState(false);
  const isConversationArchived = (conversationId: string) => archivedConversationIds.includes(conversationId);
  const displayConversations = conversations.filter((conversation) => {
    const archived = isConversationArchived(conversation.id);
    if (activeTab === 'archived') return archived;
    if (archived) return false;
    return conversation.status === activeTab;
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(displayConversations[0]?.id || null);

  useEffect(() => {
    const currentConversation = displayConversations.find((conversation) => conversation.id === activeConversationId);
    if (!currentConversation && displayConversations.length > 0) {
      setActiveConversationId(displayConversations[0].id);
    } else if (displayConversations.length === 0) {
      setActiveConversationId(null);
    }
  }, [activeConversationId, activeTab, displayConversations]);

  const [messages, setMessages] = useState<ChatMessage[]>(() => (
    mockMessages.map((message) => {
      if (message.id === 'msg-1-3') {
        return {
          ...message,
          referencedAsset: REFERENCE_ASSETS[0],
        };
      }

      if (message.id === 'msg-3-2') {
        return {
          ...message,
          attachments: [{ type: 'nda', ...SECURE_ATTACHMENT_PRESETS.nda }],
        };
      }

      return message;
    })
  ));
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [threadSearchQuery, setThreadSearchQuery] = useState('');
  const [attachments, setAttachments] = useState<SecureAttachment[]>([]);
  const [selectedReferencedAsset, setSelectedReferencedAsset] = useState<ReferencedAsset | null>(null);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newChatQuery, setNewChatQuery] = useState('');
  const [newChatSourceFilter, setNewChatSourceFilter] = useState<NewChatSourceFilter>('all');
  const [newChatTypeFilter, setNewChatTypeFilter] = useState<NewChatTypeFilter>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const realtimeTimersRef = useRef<number[]>([]);

  useEffect(() => {
    const forcedTransport = searchParams.get('transport');
    if (forcedTransport === 'offline' || forcedTransport === 'error') {
      setRealtimeState(forcedTransport);
      return;
    }

    setRealtimeState('connecting');
    const timerId = window.setTimeout(() => {
      setRealtimeState('connected');
    }, 700);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [searchParams]);

  useEffect(() => {
    return () => {
      realtimeTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, []);

  const handleAttach = (type: SecureFileType) => {
    const preset = SECURE_ATTACHMENT_PRESETS[type];
    setAttachments((previous) => [...previous, { type, ...preset }]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId);
  const activeConfig = activeConversation ? getParticipantIconConfig(activeConversation.participantType) : null;
  const conversationMessages = messages.filter((message) => message.conversationId === activeConversationId);
  const latestReferencedAsset = [...conversationMessages]
    .reverse()
    .find((message) => message.referencedAsset)?.referencedAsset || null;
  const normalizedThreadSearchQuery = threadSearchQuery.trim().toLowerCase();
  const filteredConversationMessages = conversationMessages.filter((message) => {
    if (!normalizedThreadSearchQuery) return true;

    const searchableChunks = [
      message.content,
      message.referencedAsset?.label || '',
      ...(message.attachments?.map((attachment) => attachment.name) || []),
    ];

    return searchableChunks.join(' ').toLowerCase().includes(normalizedThreadSearchQuery);
  });
  const threadResultCount = normalizedThreadSearchQuery ? filteredConversationMessages.length : null;

  const filteredConversations = displayConversations.filter((conversation) =>
    conversation.participantName.toLowerCase().includes(searchQuery.toLowerCase())
    || conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const requestCount = conversations.filter(
    (conversation) => conversation.status === 'request' && !isConversationArchived(conversation.id),
  ).length;
  const nonArchivedCount = conversations.filter((conversation) => !isConversationArchived(conversation.id)).length;
  const totalUnread = conversations.reduce((sum, conversation) => (
    isConversationArchived(conversation.id) ? sum : sum + conversation.unreadCount
  ), 0);
  const archivedCount = archivedConversationIds.length;
  const normalizedNewChatQuery = newChatQuery.trim().toLowerCase();

  const recentContacts: NewChatContact[] = conversations
    .filter((conversation) => !isConversationArchived(conversation.id))
    .map((conversation) => ({
    id: `recent-${conversation.id}`,
    name: conversation.participantName,
    role: conversation.status === 'request'
      ? `Message request • ${formatParticipantTypeLabel(conversation.participantType)}`
      : `Recent chat • ${formatParticipantTypeLabel(conversation.participantType)}`,
    type: conversation.participantType,
    source: 'recent',
    conversationId: conversation.id,
    }));

  const recentNames = new Set(recentContacts.map((contact) => contact.name.toLowerCase()));
  const connectContacts: NewChatContact[] = mockNetworkConnections
    .filter((connection: NetworkConnection) => connection.connected)
    .filter((connection: NetworkConnection) => !recentNames.has(connection.name.toLowerCase()))
    .map((connection: NetworkConnection) => ({
      id: `connect-${connection.id}`,
      name: connection.name,
      role: connection.role,
      avatar: connection.avatar,
      type: connection.type,
      source: 'connect',
    }));

  useEffect(() => {
    if (bootstrappedFromQuery) return;

    const contactId = searchParams.get('contact');
    const contactType = searchParams.get('type') as 'actor' | 'studio' | 'agency' | null;
    const context = searchParams.get('context');
    if (!contactId) return;

    const existingConversation = conversations.find((conversation) => conversation.participantId === contactId);
    if (existingConversation) {
      setActiveTab('active');
      setActiveConversationId(existingConversation.id);
      setStarterContext(context);
      setBootstrappedFromQuery(true);
      return;
    }

    const networkContact = mockNetworkConnections.find((connection) => connection.id === contactId);
    const inferredType = contactType || networkContact?.type || 'studio';
    const inferredName = networkContact?.name || 'New Contact';

    const newConversation: Conversation = {
      id: `conv-query-${Date.now()}`,
      participantId: contactId,
      participantName: inferredName,
      participantType: inferredType,
      lastMessage: context ? `Started from ${context}` : 'New conversation started.',
      unreadCount: 0,
      timestamp: new Date().toISOString(),
      online: false,
      status: 'active',
    };

    setConversations((previous) => [newConversation, ...previous]);
    setActiveTab('active');
    setActiveConversationId(newConversation.id);
    setStarterContext(context);
    setBootstrappedFromQuery(true);
  }, [bootstrappedFromQuery, conversations, searchParams]);

  const matchesContactQuery = (contact: NewChatContact) => {
    if (!normalizedNewChatQuery) return true;
    return (
      contact.name.toLowerCase().includes(normalizedNewChatQuery)
      || contact.role.toLowerCase().includes(normalizedNewChatQuery)
    );
  };

  const matchesNewChatFilters = (contact: NewChatContact) => {
    if (newChatSourceFilter !== 'all' && contact.source !== newChatSourceFilter) return false;
    if (newChatTypeFilter !== 'all' && contact.type !== newChatTypeFilter) return false;
    return true;
  };

  const filteredRecentContacts = recentContacts.filter((contact) => (
    matchesContactQuery(contact) && matchesNewChatFilters(contact)
  ));
  const filteredConnectContacts = connectContacts.filter((contact) => (
    matchesContactQuery(contact) && matchesNewChatFilters(contact)
  ));
  const hasNewChatResults = filteredRecentContacts.length > 0 || filteredConnectContacts.length > 0;
  const newChatResultCount = filteredRecentContacts.length + filteredConnectContacts.length;
  const newChatTotalCount = recentContacts.length + connectContacts.length;
  const allNewChatContacts = [...recentContacts, ...connectContacts];
  const actorContactCount = allNewChatContacts.filter((contact) => contact.type === 'actor').length;
  const studioContactCount = allNewChatContacts.filter((contact) => contact.type === 'studio').length;
  const agencyContactCount = allNewChatContacts.filter((contact) => contact.type === 'agency').length;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [filteredConversationMessages.length, activeConversationId]);

  const handleSendMessage = () => {
    if (realtimeState === 'offline' || realtimeState === 'error') {
      toast.error('Connection unavailable. Retry transport before sending.');
      return;
    }

    const trimmedMessage = newMessage.trim();
    if ((!trimmedMessage && attachments.length === 0 && !selectedReferencedAsset) || !activeConversationId) return;

    const attachmentLabel = attachments.length > 0
      ? `Shared ${attachments.length} secure file${attachments.length > 1 ? 's' : ''}`
      : '';
    const referenceLabel = selectedReferencedAsset ? `Referenced ${selectedReferencedAsset.label}` : '';
    const fallbackContent = [attachmentLabel, referenceLabel].filter(Boolean).join(' • ') || 'Secure update shared.';

    const message: ChatMessage = {
      id: `msg-new-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: 'user',
      senderName: 'You',
      content: trimmedMessage || fallbackContent,
      timestamp: new Date().toISOString(),
      read: false,
      isOwn: true,
      attachments: attachments.length > 0 ? attachments : undefined,
      referencedAsset: selectedReferencedAsset || undefined,
    };

    setMessages((previous) => [...previous, message]);
    setConversations((previous) => {
      const activeConversationForMessage = previous.find((conversation) => conversation.id === activeConversationId);
      if (!activeConversationForMessage) return previous;

      const updatedConversation: Conversation = {
        ...activeConversationForMessage,
        lastMessage: trimmedMessage || attachmentLabel || referenceLabel || 'Secure update shared',
        unreadCount: 0,
        timestamp: message.timestamp,
        status: 'active',
      };

      return [updatedConversation, ...previous.filter((conversation) => conversation.id !== activeConversationId)];
    });
    setArchivedConversationIds((previous) => previous.filter((conversationId) => conversationId !== activeConversationId));

    if (activeConversation?.online) {
      const autoReplyTimer = window.setTimeout(() => {
        const autoReplyMessage: ChatMessage = {
          id: `msg-auto-${Date.now()}`,
          conversationId: activeConversationId,
          senderId: activeConversation.participantId,
          senderName: activeConversation.participantName,
          content: 'Received securely. Reviewing this now and will revert shortly.',
          timestamp: new Date().toISOString(),
          read: activeTab === 'active' && activeConversationId === activeConversation.id,
          isOwn: false,
        };

        setMessages((previous) => [...previous, autoReplyMessage]);
        setConversations((previous) => {
          const targetConversation = previous.find((conversation) => conversation.id === activeConversationId);
          if (!targetConversation) return previous;

          const updatedConversation: Conversation = {
            ...targetConversation,
            lastMessage: autoReplyMessage.content,
            timestamp: autoReplyMessage.timestamp,
            unreadCount: activeTab === 'active' && activeConversationId === targetConversation.id
              ? 0
              : targetConversation.unreadCount + 1,
            status: 'active',
          };

          return [updatedConversation, ...previous.filter((conversation) => conversation.id !== activeConversationId)];
        });
      }, 1200);

      realtimeTimersRef.current.push(autoReplyTimer);
    }

    setActiveTab('active');
    setNewMessage('');
    setAttachments([]);
    setSelectedReferencedAsset(null);
    setRealtimeState('connected');
  };

  const handleStartConversation = (contact: NewChatContact) => {
    const existingConversation = contact.conversationId
      ? conversations.find((conversation) => conversation.id === contact.conversationId)
      : conversations.find((conversation) => conversation.participantName.toLowerCase() === contact.name.toLowerCase());

    if (existingConversation) {
      setArchivedConversationIds((previous) => previous.filter((conversationId) => conversationId !== existingConversation.id));
      setActiveTab(existingConversation.status);
      setActiveConversationId(existingConversation.id);
    } else {
      const newConversation: Conversation = {
        id: `conv-new-${Date.now()}`,
        participantId: `${contact.type}-${contact.name.toLowerCase().replace(/\s+/g, '-')}`,
        participantName: contact.name,
        participantType: contact.type,
        lastMessage: 'No messages yet',
        unreadCount: 0,
        timestamp: new Date().toISOString(),
        online: false,
        status: 'active',
      };

      setConversations((previous) => [newConversation, ...previous]);
      setActiveTab('active');
      setActiveConversationId(newConversation.id);
    }

    setThreadSearchQuery('');
    setNewChatQuery('');
    setNewChatSourceFilter('all');
    setNewChatTypeFilter('all');
    setNewChatOpen(false);
  };

  const handleOpenRequests = () => {
    const firstRequest = conversations.find(
      (conversation) => conversation.status === 'request' && !isConversationArchived(conversation.id),
    );
    setActiveTab('request');
    if (firstRequest) {
      setActiveConversationId(firstRequest.id);
    }
  };

  const handleSelectConversationFromOverview = (conversation: Conversation) => {
    setArchivedConversationIds((previous) => previous.filter((conversationId) => conversationId !== conversation.id));
    setActiveTab(conversation.status);
    setActiveConversationId(conversation.id);
    setThreadSearchQuery('');
  };

  const handleArchiveToggle = () => {
    if (!activeConversationId) return;

    const isArchived = isConversationArchived(activeConversationId);

    if (isArchived) {
      setArchivedConversationIds((previous) => previous.filter((conversationId) => conversationId !== activeConversationId));
      if (activeConversation) {
        setActiveTab(activeConversation.status);
      }
      return;
    }

    setArchivedConversationIds((previous) => [...previous, activeConversationId]);
    const replacementConversation = displayConversations.find((conversation) => conversation.id !== activeConversationId);
    setActiveConversationId(replacementConversation?.id || null);
    setThreadSearchQuery('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const retryRealtimeConnection = () => {
    setRealtimeState('connecting');
    const retryTimer = window.setTimeout(() => {
      setRealtimeState('connected');
    }, 700);
    realtimeTimersRef.current.push(retryTimer);
  };

  return (
    <DashboardLayout
      className="h-dvh overflow-hidden bg-[#F9F9F9]"
      fullWidth
      transparentNav
      navContentClassName="mx-auto w-[85%]"
    >
      <div className="mx-auto flex h-[calc(100dvh-6.5rem)] w-[85%] gap-6 overflow-hidden">
        <div className="flex h-full min-w-0 flex-1 overflow-hidden">
          <Card className="flex h-full w-full overflow-hidden rounded-3xl border border-[#ECECEC] bg-white">
            <div className="flex h-full w-full">
              <div className="flex h-full w-full flex-col md:w-80 md:flex-shrink-0 md:border-r md:border-[#ECECEC]">
                <div className="border-b border-[#ECECEC] px-5 py-4">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h2 className="flex items-center gap-2 text-balance text-[15px] font-semibold text-foreground">
                        <span className="flex size-8 items-center justify-center rounded-xl bg-muted/70 text-[#0052FF]">
                          <ChatCircle className="size-4" weight="fill" />
                        </span>
                        Messages
                      </h2>
                      {totalUnread > 0 && (
                        <Badge className="h-5 min-w-[20px] border-[#DCE7FF] bg-[#EDF3FF] px-1.5 text-[10px] text-[#0052FF]">
                          {totalUnread}
                        </Badge>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setNewChatOpen(true)}
                      className="h-8 rounded-lg border-[#ECECEC] bg-white px-2.5 text-[12px] text-foreground hover:bg-[#FAFAFA]"
                    >
                      <Plus className="mr-1.5 size-3.5" />
                      New chat
                    </Button>
                  </div>

                  <div className="relative mb-4">
                    <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="h-10 rounded-xl border-[#ECECEC] bg-[#F8F8F8] pl-9 text-[13px] focus-visible:ring-[#0052FF]/30"
                    />
                  </div>

                  <div className="grid grid-cols-3 rounded-xl bg-[#F8F8F8] p-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('active')}
                      className={cn(
                        'rounded-lg py-1.5 text-[13px] font-medium transition-colors',
                        activeTab === 'active'
                          ? 'bg-white text-[#0052FF] shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      Inbox
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('request')}
                      className={cn(
                        'relative rounded-lg py-1.5 text-[13px] font-medium transition-colors',
                        activeTab === 'request'
                          ? 'bg-white text-[#0052FF] shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      Requests
                      {requestCount > 0 && <span className="absolute right-2 top-1 size-2 rounded-full bg-[#0052FF]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('archived')}
                      className={cn(
                        'rounded-lg py-1.5 text-[13px] font-medium transition-colors',
                        activeTab === 'archived'
                          ? 'bg-white text-[#0052FF] shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      Archived
                    </button>
                  </div>

                </div>

                <ScrollArea className="flex-1 px-3 py-3">
                  <div className="space-y-1.5">
                    {filteredConversations.length > 0 ? (
                      filteredConversations.map((conversation) => (
                        <ConversationItem
                          key={conversation.id}
                          conversation={conversation}
                          isActive={conversation.id === activeConversationId}
                          onClick={() => {
                            setActiveConversationId(conversation.id);
                            setThreadSearchQuery('');
                          }}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
                        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted/70">
                          <ChatCircle className="size-6 opacity-40" />
                        </div>
                        <p className="text-[13px]">
                          {activeTab === 'active'
                            ? 'No conversations found'
                            : activeTab === 'request'
                              ? 'No message requests'
                              : 'No archived conversations'}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="border-t border-[#ECECEC] p-4 text-center md:hidden">
                  <p className="text-pretty text-[12px] text-muted-foreground">
                    Open chat on a larger screen to view full thread and compose messages.
                  </p>
                </div>
              </div>

              <div className="hidden h-full min-w-0 flex-1 md:flex md:flex-col">
                {activeConversation && activeConfig ? (
                  <>
                    <div className="border-b border-[#ECECEC]">
                      <div className="flex items-center gap-4 px-6 py-4">
                        <Link
                          to={getParticipantLink(activeConversation.participantType, activeConversation.participantId)}
                          aria-label={`Open ${activeConversation.participantName} profile`}
                        >
                          <div className={cn('flex size-10 items-center justify-center rounded-xl ring-1', activeConfig.bg, activeConfig.text, activeConfig.ring)}>
                            {(() => {
                              const Icon = activeConfig.icon;
                              return <Icon className="size-5" weight="fill" />;
                            })()}
                          </div>
                        </Link>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Link to={getParticipantLink(activeConversation.participantType, activeConversation.participantId)}>
                              <p className="text-[15px] font-semibold text-foreground transition-colors hover:text-[#0052FF]">
                                {activeConversation.participantName}
                              </p>
                            </Link>
                            {activeConversation.online && <span className="size-2 rounded-full bg-emerald-500" />}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className={cn('rounded-md px-1.5 py-0.5 text-[11px] font-medium capitalize', activeConfig.badge)}>
                              {activeConversation.participantType}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {activeConversation.online ? 'Online now' : `Last seen ${formatTimestamp(activeConversation.timestamp)}`}
                            </span>
                            <span className={cn(
                              'rounded-md px-1.5 py-0.5 text-[10px] font-medium',
                              realtimeStateClasses(realtimeState),
                            )}>
                              {realtimeStateLabel(realtimeState)}
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleArchiveToggle}
                          className="h-8 rounded-lg border-[#ECECEC] px-3 text-[12px] hover:bg-[#FAFAFA]"
                        >
                          {isConversationArchived(activeConversation.id) ? 'Restore' : 'Archive'}
                        </Button>
                      </div>

                      {starterContext && (
                        <div className="mx-6 mb-3 rounded-xl border border-[#E7ECFB] bg-[#F5F8FF] px-3 py-2">
                          <p className="text-[10px] font-semibold text-[#0052FF]">Conversation Starter Context</p>
                          <p className="text-[11px] text-[#2A4373]">{starterContext}</p>
                        </div>
                      )}

                      {(realtimeState === 'offline' || realtimeState === 'error') && (
                        <div className="mx-6 mb-3 flex items-center justify-between gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2">
                          <p className="text-[11px] text-destructive">
                            {realtimeState === 'offline' ? 'You appear offline. Sending is paused.' : 'Connection error. Messages may fail to deliver.'}
                          </p>
                          <Button size="sm" className="h-7 rounded-lg text-[10px]" onClick={retryRealtimeConnection}>
                            Retry
                          </Button>
                        </div>
                      )}

                      <div className="flex items-center gap-2 border-t border-[#F1F1F1] px-6 py-3">
                        <div className="relative flex-1">
                          <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Search within this conversation..."
                            value={threadSearchQuery}
                            onChange={(event) => setThreadSearchQuery(event.target.value)}
                            className="h-9 rounded-xl border-[#ECECEC] bg-[#FAFAFA] pl-9 text-[12px] focus-visible:ring-[#0052FF]/30"
                          />
                        </div>
                        {threadResultCount !== null && (
                          <span className="font-inter-numeric text-[11px] text-muted-foreground">
                            {threadResultCount} matches
                          </span>
                        )}
                      </div>

                      {latestReferencedAsset && (
                        <div className="mx-6 mb-3 rounded-xl border border-[#E7ECFB] bg-[#F5F8FF] px-3 py-2">
                          <p className="text-[10px] font-semibold text-[#0052FF]">Referenced Asset in Thread</p>
                          <p className="text-[12px] font-medium text-foreground">{latestReferencedAsset.label}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatAssetTypeLabel(latestReferencedAsset.assetType)} • {formatRightsLabel(latestReferencedAsset.rightsStatus)}
                          </p>
                        </div>
                      )}
                    </div>

                    <ScrollArea className="flex-1 px-6 py-6">
                      <div className="mx-auto max-w-4xl">
                        <div className="mb-4 rounded-xl border border-[#E7ECFB] bg-[#F5F8FF] px-3 py-2">
                          <p className="text-pretty text-[11px] text-[#2A4373]">
                            Secure log active: all messages, files, and asset references remain documented on platform.
                          </p>
                        </div>
                        {filteredConversationMessages.map((message) => (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            participantType={activeConversation.participantType}
                          />
                        ))}
                        {normalizedThreadSearchQuery && filteredConversationMessages.length === 0 && (
                          <div className="rounded-2xl border border-dashed border-[#ECECEC] bg-[#FAFAFA] px-4 py-8 text-center">
                            <p className="text-[12px] text-muted-foreground">No messages match your search in this conversation.</p>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    <div className="border-t border-[#ECECEC] px-4 py-4">
                      {attachments.length > 0 && (
                        <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
                          {attachments.map((attachment, index) => (
                            <div
                              key={`${attachment.name}-${index}`}
                              className="relative flex items-center gap-2 rounded-xl border border-[#ECECEC] bg-[#F8F8F8] px-3 py-2 pr-8"
                            >
                              <div className="flex size-8 items-center justify-center rounded-lg bg-white text-muted-foreground">
                                <FileText className="size-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="block max-w-[150px] truncate text-[12px] font-medium text-foreground">
                                  {attachment.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground">{attachment.size}</span>
                              </div>
                              <span className="rounded-md bg-[#EDF3FF] px-1.5 py-0.5 text-[10px] font-medium uppercase text-[#0052FF]">
                                {attachment.type}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                aria-label={`Remove ${attachment.name}`}
                                className="absolute right-1 top-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedReferencedAsset && (
                        <div className="mb-3 flex items-center justify-between rounded-xl border border-[#E7ECFB] bg-[#F5F8FF] px-3 py-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-[#0052FF]">Referenced Asset</p>
                            <p className="truncate text-[12px] font-medium text-foreground">{selectedReferencedAsset.label}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedReferencedAsset(null)}
                            aria-label="Remove referenced asset"
                            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="mx-auto flex max-w-4xl items-end gap-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              aria-label="Share secure file"
                              className="size-11 shrink-0 rounded-xl border-[#ECECEC] hover:bg-muted/40"
                            >
                              <FileText className="size-5 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56 rounded-2xl border-[#ECECEC] p-1.5" sideOffset={8}>
                            <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground">
                              Share Secure File
                            </DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleAttach('script')} className="cursor-pointer gap-2 rounded-lg">
                              <div className="flex size-6 items-center justify-center rounded bg-[#0052FF]/10 text-[#0052FF]">
                                <FileText className="size-3.5" />
                              </div>
                              <span className="text-[13px]">Attach Script</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAttach('nda')} className="cursor-pointer gap-2 rounded-lg">
                              <div className="flex size-6 items-center justify-center rounded bg-[#D61D1F]/10 text-[#D61D1F]">
                                <Lock className="size-3.5" />
                              </div>
                              <span className="text-[13px]">Attach NDA</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAttach('brief')} className="cursor-pointer gap-2 rounded-lg">
                              <div className="flex size-6 items-center justify-center rounded bg-emerald-500/10 text-emerald-600">
                                <FileText className="size-3.5" />
                              </div>
                              <span className="text-[13px]">Attach Brief</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              aria-label="Add referenced asset"
                              className="h-11 shrink-0 rounded-xl border-[#ECECEC] px-3 text-[12px] hover:bg-muted/40"
                            >
                              <ShieldCheck className="mr-1.5 size-4 text-muted-foreground" />
                              Asset
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-64 rounded-2xl border-[#ECECEC] p-1.5" sideOffset={8}>
                            <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground">
                              Reference Asset
                            </DropdownMenuLabel>
                            {REFERENCE_ASSETS.map((asset) => (
                              <DropdownMenuItem
                                key={asset.id}
                                onClick={() => setSelectedReferencedAsset(asset)}
                                className="cursor-pointer rounded-lg"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-[12px] font-medium">{asset.label}</p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {formatAssetTypeLabel(asset.assetType)} • {formatRightsLabel(asset.rightsStatus)}
                                  </p>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <Input
                          placeholder="Send a secure message..."
                          value={newMessage}
                          onChange={(event) => setNewMessage(event.target.value)}
                          onKeyDown={handleKeyPress}
                          className="h-11 flex-1 rounded-xl border-[#ECECEC] bg-[#F8F8F8] text-[13px] focus-visible:ring-[#0052FF]/30"
                        />
                        <Button
                          onClick={handleSendMessage}
                          aria-label="Send message"
                          disabled={!newMessage.trim() && attachments.length === 0 && !selectedReferencedAsset}
                          className="size-11 shrink-0 rounded-xl bg-[#0052FF] p-0 text-white hover:bg-[#0052FF]/90"
                        >
                          <PaperPlaneRight className="size-5" weight="fill" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                    <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#F8F8F8]">
                      <ChatCircle className="size-8 text-muted-foreground/50" weight="duotone" />
                    </div>
                    <h3 className="text-balance text-[18px] font-semibold text-foreground">Welcome to Messages</h3>
                    <p className="mt-2 max-w-md text-pretty text-[13px] text-muted-foreground">
                      Select a conversation from the list to start messaging with actors, studios, and agencies.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog
        open={newChatOpen}
        onOpenChange={(open) => {
          setNewChatOpen(open);
          if (!open) {
            setNewChatQuery('');
            setNewChatSourceFilter('all');
            setNewChatTypeFilter('all');
          }
        }}
      >
        <DialogContent className="overflow-hidden rounded-3xl border border-[#ECECEC] bg-[#F9F9F9] p-0 sm:max-w-[760px]">
          <DialogHeader className="border-b border-[#ECECEC] px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-balance text-[18px] text-foreground">Start New Chat</DialogTitle>
                <DialogDescription className="mt-1 text-pretty text-[12px] text-muted-foreground">
                  Search by name or role, apply filters, and jump directly into a secure thread.
                </DialogDescription>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <div className="rounded-xl border border-[#ECECEC] bg-white px-3 py-2">
                  <p className="font-inter-numeric text-[14px] font-semibold text-foreground">{newChatTotalCount}</p>
                  <p className="text-[10px] text-muted-foreground">Available</p>
                </div>
                <div className="rounded-xl border border-[#ECECEC] bg-white px-3 py-2">
                  <p className="font-inter-numeric text-[14px] font-semibold text-foreground">{newChatResultCount}</p>
                  <p className="text-[10px] text-muted-foreground">Shown</p>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-4 px-5 pb-5 pt-4 md:grid-cols-[220px_minmax(0,1fr)] md:px-6 md:pb-6">
            <aside className="space-y-3">
              <div className="rounded-2xl border border-[#ECECEC] bg-white p-3">
                <p className="text-[11px] font-semibold uppercase text-muted-foreground">Scope</p>
                <div className="mt-2 space-y-1.5">
                  {NEW_CHAT_SOURCE_FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setNewChatSourceFilter(filter.id)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] font-medium transition-colors',
                        newChatSourceFilter === filter.id
                          ? 'bg-[#EDF3FF] text-[#0052FF]'
                          : 'text-muted-foreground hover:bg-[#F7F7F7] hover:text-foreground',
                      )}
                    >
                      <span>{filter.label}</span>
                      {newChatSourceFilter === filter.id && <span className="size-1.5 rounded-full bg-[#0052FF]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#ECECEC] bg-white p-3">
                <p className="text-[11px] font-semibold uppercase text-muted-foreground">People Mix</p>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between rounded-lg bg-[#FAFAFA] px-2.5 py-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-foreground">
                      <UserCircle className="size-3.5 text-muted-foreground" weight="fill" />
                      Actors
                    </div>
                    <span className="font-inter-numeric text-[11px] text-muted-foreground">{actorContactCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#FAFAFA] px-2.5 py-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-foreground">
                      <Buildings className="size-3.5 text-muted-foreground" weight="fill" />
                      Studios
                    </div>
                    <span className="font-inter-numeric text-[11px] text-muted-foreground">{studioContactCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#FAFAFA] px-2.5 py-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-foreground">
                      <Briefcase className="size-3.5 text-muted-foreground" weight="fill" />
                      Agencies
                    </div>
                    <span className="font-inter-numeric text-[11px] text-muted-foreground">{agencyContactCount}</span>
                  </div>
                </div>
              </div>
            </aside>

            <section className="min-w-0">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or role..."
                  value={newChatQuery}
                  onChange={(event) => setNewChatQuery(event.target.value)}
                  className="h-10 rounded-xl border-[#ECECEC] bg-white pl-9 text-[13px] focus-visible:ring-[#0052FF]/30"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {NEW_CHAT_TYPE_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setNewChatTypeFilter(filter.id)}
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                      newChatTypeFilter === filter.id
                        ? 'border-[#DCE7FF] bg-[#EDF3FF] text-[#0052FF]'
                        : 'border-[#ECECEC] bg-white text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-[11px] text-muted-foreground">
                Showing <span className="font-inter-numeric">{newChatResultCount}</span> of{' '}
                <span className="font-inter-numeric">{newChatTotalCount}</span> available contacts.
              </p>

              <ScrollArea className="mt-3 h-[22rem] pr-1">
                <div className="space-y-4 pb-1">
                  {filteredConnectContacts.length > 0 && (
                    <section>
                      <p className="mb-2 text-[12px] font-semibold text-foreground">Connects</p>
                      <div className="space-y-2">
                        {filteredConnectContacts.map((contact) => (
                          <NewChatContactItem key={contact.id} contact={contact} onSelect={handleStartConversation} />
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredRecentContacts.length > 0 && (
                    <section>
                      <p className="mb-2 text-[12px] font-semibold text-foreground">Recent</p>
                      <div className="space-y-2">
                        {filteredRecentContacts.map((contact) => (
                          <NewChatContactItem key={contact.id} contact={contact} onSelect={handleStartConversation} />
                        ))}
                      </div>
                    </section>
                  )}

                  {!hasNewChatResults && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ECECEC] bg-white px-4 py-12 text-center">
                      <p className="text-pretty text-[13px] text-muted-foreground">No matching people found for this query.</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewChatQuery('');
                          setNewChatSourceFilter('all');
                          setNewChatTypeFilter('all');
                        }}
                        className="mt-3 h-8 rounded-lg border-[#ECECEC] px-3 text-[12px] hover:bg-[#FAFAFA]"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
