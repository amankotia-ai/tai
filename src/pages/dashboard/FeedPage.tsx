import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bell,
  BookmarkSimple,
  Briefcase,
  Buildings,
  CaretRight,
  ChartPieSlice,
  ChatCircle,
  CreditCard,
  DotsThree,
  Eye,
  FileText,
  Gear,
  GridFour,
  Heart,
  Image,
  List,
  LinkSimple,
  MagnifyingGlass,
  Microphone,
  NewspaperClipping,
  PaperPlaneTilt,
  PresentationChart,
  ShareNetwork,
  ShieldCheck,
  Sparkle,
  UsersThree,
  UserCircle,
  Vault,
  VideoCamera,
  GlobeHemisphereWest,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  mockCommunities,
  storage,
  mockFeedPosts,
  FeedPost,
} from '@/lib/store';
import { cn } from '@/lib/utils';

type ComposerToolId = 'image' | 'video' | 'audio' | 'link' | 'poll';

type ComposerAttachment =
  | { type: 'image'; imageUrl: string }
  | { type: 'video'; videoUrl: string; videoTitle?: string }
  | { type: 'audio'; audioUrl: string; audioTitle?: string }
  | { type: 'link'; linkUrl: string; linkTitle?: string }
  | { type: 'poll'; pollQuestion: string; pollOptions: string[] };

type CreatePostPayload = {
  content: string;
  attachment?: ComposerAttachment;
};

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

function getAuthorIconConfig(type: 'actor' | 'studio' | 'agency') {
  switch (type) {
    case 'actor':
      return { icon: UserCircle, bg: 'bg-primary/10', text: 'text-primary' };
    case 'studio':
      return { icon: Buildings, bg: 'bg-blue-500/10', text: 'text-blue-600' };
    case 'agency':
      return { icon: Briefcase, bg: 'bg-purple-500/10', text: 'text-purple-600' };
  }
}

type FeedNavItem = {
  label: string;
  href: string;
  activePaths: string[];
  icon: typeof UserCircle;
};

const mobileMenuItems: FeedNavItem[] = [
  { label: 'Feed', href: '/dashboard/feed', activePaths: ['/dashboard/feed', '/feed'], icon: NewspaperClipping },
  { label: 'Search', href: '/dashboard/search', activePaths: ['/dashboard/search', '/dashboard/discover', '/search', '/dashboard/casting-calls', '/casting-calls'], icon: MagnifyingGlass },
  { label: 'Messages', href: '/dashboard/chat', activePaths: ['/dashboard/chat', '/dashboard/messages', '/chat'], icon: ChatCircle },
  { label: 'Network', href: '/dashboard/network', activePaths: ['/dashboard/network', '/network'], icon: UsersThree },
  { label: 'Vault', href: '/dashboard/vault', activePaths: ['/dashboard/vault', '/vault'], icon: Vault },
  { label: 'Contracts', href: '/dashboard/contracts', activePaths: ['/dashboard/contracts', '/contracts'], icon: FileText },
  { label: 'Payments', href: '/dashboard/payments', activePaths: ['/dashboard/payments', '/payments'], icon: CreditCard },
  { label: 'Settings', href: '/dashboard/settings', activePaths: ['/dashboard/settings', '/settings'], icon: Gear },
];

const mobileBottomNavItems: FeedNavItem[] = [
  { label: 'Feed', href: '/dashboard/feed', activePaths: ['/dashboard/feed', '/feed'], icon: NewspaperClipping },
  { label: 'Search', href: '/dashboard/search', activePaths: ['/dashboard/search', '/dashboard/discover', '/search', '/dashboard/casting-calls', '/casting-calls'], icon: MagnifyingGlass },
  { label: 'Messages', href: '/dashboard/chat', activePaths: ['/dashboard/chat', '/dashboard/messages', '/chat'], icon: ChatCircle },
  { label: 'Network', href: '/dashboard/network', activePaths: ['/dashboard/network', '/network'], icon: UsersThree },
  { label: 'Profile', href: '/dashboard/profile', activePaths: ['/dashboard/profile'], icon: UserCircle },
];

function isActivePath(pathname: string, paths: string[]) {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function MobileFeedHeader({ pendingRequests }: { pendingRequests: number }) {
  const location = useLocation();
  const user = storage.getUser();

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-white/95 backdrop-blur-sm lg:hidden"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="size-9 rounded-xl text-muted-foreground hover:bg-[#D61D1F]/10 hover:text-[#D61D1F]"
              >
                <List className="size-5" weight="bold" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] max-w-xs border-r border-border/60 bg-white p-0">
              <SheetHeader className="border-b border-border/60 px-4 py-4 text-left">
                <SheetTitle className="text-[16px] font-semibold text-foreground">Navigation</SheetTitle>
              </SheetHeader>

              <div className="border-b border-border/60 px-4 py-4">
                <p className="truncate text-[14px] font-semibold text-foreground">{user?.name || 'Jane Smith'}</p>
                <p className="truncate text-[12px] capitalize text-muted-foreground">{user?.role || 'Actor'}</p>
              </div>

              <nav className="space-y-1 px-2 py-3">
                {mobileMenuItems.map((item) => {
                  const active = isActivePath(location.pathname, item.activePaths);

                  return (
                    <SheetClose key={item.label} asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors',
                          active
                            ? 'bg-[#D61D1F]/10 font-medium text-[#D61D1F]'
                            : 'text-muted-foreground hover:bg-[#D61D1F]/5 hover:text-[#D61D1F]',
                        )}
                      >
                        <item.icon className="size-[18px]" weight={active ? 'fill' : 'regular'} />
                        <span>{item.label}</span>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <span className="text-[15px] font-semibold tracking-tight text-foreground">Feed</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="View notifications"
            className="relative size-9 rounded-xl text-muted-foreground hover:bg-[#D61D1F]/10 hover:text-[#D61D1F]"
          >
            <Bell className="size-[18px]" />
            {pendingRequests > 0 && (
              <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[#D61D1F] text-[9px] font-semibold text-white">
                {pendingRequests}
              </span>
            )}
          </Button>

          <Link
            to="/dashboard/profile"
            aria-label="Open profile"
            className="block size-9 overflow-hidden rounded-full ring-2 ring-transparent transition-all hover:ring-[#D61D1F]/20"
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop"
              alt={user?.name || 'Profile'}
              className="size-full object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

function MobileFeedBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-white/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.25rem)' }}
    >
      <div className="grid grid-cols-5 gap-1 px-2 pt-2">
        {mobileBottomNavItems.map((item) => {
          const active = isActivePath(location.pathname, item.activePaths);

          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                'flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-colors',
                active
                  ? 'bg-[#D61D1F]/10 text-[#D61D1F]'
                  : 'text-muted-foreground hover:bg-[#D61D1F]/5 hover:text-[#D61D1F]',
              )}
            >
              <item.icon className="size-[18px]" weight={active ? 'fill' : 'regular'} />
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function ProfileOverviewCard() {
  const user = storage.getUser();
  const stats = [
    { label: 'Followers', value: '128' },
    { label: 'Following', value: '45' },
    { label: 'Projects', value: '12' },
  ];
  const analyticsItems = [
    { label: 'Profile Viewers', value: '234', change: '+12%', icon: Eye },
    { label: 'Post Impressions', value: '1.8k', change: '+8%', icon: PresentationChart },
  ];
  const savedItems = [
    { label: 'Saved Roles', count: 8, icon: Briefcase },
    { label: 'Saved Profiles', count: 24, icon: UserCircle },
    { label: 'Saved Posts', count: 56, icon: BookmarkSimple },
  ];

  return (
    <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-muted ring-2 ring-background shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop"
              alt={user?.name || 'Profile'}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-foreground">{user?.name || 'Jane Smith'}</h3>
          <p className="text-[11px] capitalize text-muted-foreground">{user?.role || 'Actor'}</p>
        </div>
        <Link
          to="/dashboard/profile"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <CaretRight className="h-4 w-4" weight="bold" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex min-h-[52px] flex-col items-center justify-center rounded-xl bg-muted/70 text-muted-foreground"
          >
            <p className="font-inter-numeric tabular-nums text-[15px] font-semibold leading-none text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 text-[9px] font-medium uppercase leading-none">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="my-4 border-t border-dashed border-border/50" />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChartPieSlice className="h-4 w-4 text-[#0052FF]" weight="fill" />
            <h4 className="text-[13px] font-semibold text-foreground">Analytics</h4>
          </div>
          <Link to="#" className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground">
            View all
          </Link>
        </div>

        <div className="space-y-3">
          {analyticsItems.map((item) => {
            const changeText = item.change.trim();
            const changeColorClass = changeText.startsWith('-')
              ? 'text-red-600'
              : changeText.startsWith('+')
                ? 'text-emerald-600'
                : 'text-muted-foreground';

            return (
              <Link
                key={item.label}
                to="#"
                className="group flex w-full min-w-0 items-center gap-3 rounded-xl transition-opacity duration-200 hover:opacity-90"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground">
                  <item.icon className="h-4 w-4" weight="fill" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium leading-5 text-foreground group-hover:text-[#0052FF]">{item.label}</p>
                  <div className="mt-[1px] flex items-center gap-1.5 text-pretty text-[10px] text-muted-foreground">
                    <span className="font-inter-numeric">{item.value}</span>
                    <span className={cn('font-inter-numeric', changeColorClass)}>{item.change}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="my-5 border-t border-dashed border-border/50" />

      <section>
        <div className="mb-3 flex items-center gap-2">
          <BookmarkSimple className="h-4 w-4 text-[#0052FF]" weight="fill" />
          <h4 className="text-[13px] font-semibold text-foreground">Saved Items</h4>
        </div>

        <div className="space-y-3">
          {savedItems.map((item) => (
            <Link
              key={item.label}
              to="#"
              className="group flex w-full min-w-0 items-center gap-3 rounded-xl transition-opacity duration-200 hover:opacity-90"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground">
                <item.icon className="h-4 w-4" weight="fill" />
              </div>
              <span className="min-w-0 flex-1 truncate text-[12px] font-medium leading-5 text-foreground group-hover:text-[#0052FF]">
                {item.label}
              </span>
              <span className="font-inter-numeric rounded-full bg-muted/70 px-2.5 py-0.5 text-[10px] font-semibold tracking-[-0.02em] text-muted-foreground">
                {item.count}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </Card>
  );
}

function CreatePostInput({ onPost }: { onPost: (payload: CreatePostPayload) => void }) {
  const user = storage.getUser();
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState<'network' | 'public'>('network');
  const [activeTool, setActiveTool] = useState<ComposerToolId | null>(null);
  const [usedAiAssist, setUsedAiAssist] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [audioTitle, setAudioTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const maxLength = 1200;

  const tools: { id: ComposerToolId; label: string; icon: typeof Image }[] = [
    { id: 'image', label: 'Photo', icon: Image },
    { id: 'video', label: 'Video', icon: VideoCamera },
    { id: 'audio', label: 'Audio', icon: Microphone },
    { id: 'link', label: 'Link', icon: LinkSimple },
    { id: 'poll', label: 'Poll', icon: GridFour },
  ];

  const selectedTool = tools.find((tool) => tool.id === activeTool);

  const toggleTool = (toolId: ComposerToolId) => {
    setActiveTool((current) => (current === toolId ? null : toolId));
  };

  const updatePollOption = (index: number, value: string) => {
    setPollOptions((current) => current.map((option, optionIndex) => (
      optionIndex === index ? value : option
    )));
  };

  const addPollOption = () => {
    setPollOptions((current) => (current.length >= 4 ? current : [...current, '']));
  };

  const removePollOption = (index: number) => {
    setPollOptions((current) => {
      if (current.length <= 2) return current;
      return current.filter((_, optionIndex) => optionIndex !== index);
    });
  };

  const hasValidAttachment = (() => {
    switch (activeTool) {
      case 'image':
        return imageUrl.trim().length > 0;
      case 'video':
        return videoUrl.trim().length > 0;
      case 'audio':
        return audioUrl.trim().length > 0;
      case 'link':
        return linkUrl.trim().length > 0;
      case 'poll':
        return pollOptions.filter((option) => option.trim().length > 0).length >= 2;
      default:
        return true;
    }
  })();

  const buildAttachment = (): ComposerAttachment | undefined => {
    switch (activeTool) {
      case 'image':
        if (!imageUrl.trim()) return undefined;
        return { type: 'image', imageUrl: imageUrl.trim() };
      case 'video':
        if (!videoUrl.trim()) return undefined;
        return {
          type: 'video',
          videoUrl: videoUrl.trim(),
          videoTitle: videoTitle.trim() || undefined,
        };
      case 'audio':
        if (!audioUrl.trim()) return undefined;
        return {
          type: 'audio',
          audioUrl: audioUrl.trim(),
          audioTitle: audioTitle.trim() || undefined,
        };
      case 'link':
        if (!linkUrl.trim()) return undefined;
        return {
          type: 'link',
          linkUrl: linkUrl.trim(),
          linkTitle: linkTitle.trim() || undefined,
        };
      case 'poll': {
        const sanitizedOptions = pollOptions
          .map((option) => option.trim())
          .filter((option) => option.length > 0);
        if (sanitizedOptions.length < 2) return undefined;
        return {
          type: 'poll',
          pollQuestion: pollQuestion.trim(),
          pollOptions: sanitizedOptions,
        };
      }
      default:
        return undefined;
    }
  };

  const handleAiAssist = () => {
    const normalized = content.replace(/\s+/g, ' ').trim();
    const toolText = selectedTool ? ` Including ${selectedTool.label.toLowerCase()} in this post.` : '';

    if (!normalized) {
      const seed = audience === 'public'
        ? `Excited to share a quick update with the CastID community.${toolText} Open to collaborations and casting opportunities. #CastID`
        : `Quick update for my network from today's work.${toolText} Would love your feedback and recommendations. #CastID`;
      setContent(seed);
      setUsedAiAssist(true);
      return;
    }

    let polished = normalized;
    if (!/[.!?]$/.test(polished)) {
      polished = `${polished}.`;
    }
    if (audience === 'public' && !/open to collaborations/i.test(polished)) {
      polished = `${polished} Open to collaborations and casting opportunities.`;
    }
    if (audience === 'network' && !/feedback/i.test(polished)) {
      polished = `${polished} Would love your feedback and recommendations.`;
    }
    if (!/#CastID\b/i.test(polished)) {
      polished = `${polished} #CastID`;
    }

    setContent(polished);
    setUsedAiAssist(true);
  };

  const handleCreate = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    const attachment = buildAttachment();
    if (activeTool && !attachment) return;

    onPost({ content: trimmed, attachment });
    setContent('');
    setActiveTool(null);
    setUsedAiAssist(false);
    setImageUrl('');
    setVideoUrl('');
    setVideoTitle('');
    setAudioUrl('');
    setAudioTitle('');
    setLinkUrl('');
    setLinkTitle('');
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = '0px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [content]);

  return (
    <Card className="rounded-3xl border border-[#ECECEC] bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link to={`/dashboard/profile/${user?.id || 'me'}`} className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop"
              alt={user?.name || 'Profile'}
              className="h-full w-full object-cover"
            />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-foreground">{user?.name || 'You'}</p>
            <p className="truncate text-[11px] capitalize text-muted-foreground">{user?.role || 'Actor'}</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Post to network audience"
            aria-pressed={audience === 'network'}
            onClick={() => setAudience('network')}
            className={cn(
              'inline-flex size-7 items-center justify-center transition-colors',
              audience === 'network' ? 'text-[#D61D1F]' : 'text-muted-foreground hover:text-[#D61D1F]',
            )}
          >
            <UsersThree className="size-4.5" weight="fill" />
          </button>
          <button
            type="button"
            aria-label="Post to public audience"
            aria-pressed={audience === 'public'}
            onClick={() => setAudience('public')}
            className={cn(
              'inline-flex size-7 items-center justify-center transition-colors',
              audience === 'public' ? 'text-[#D61D1F]' : 'text-muted-foreground hover:text-[#D61D1F]',
            )}
          >
            <GlobeHemisphereWest className="size-4.5" weight="fill" />
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-[#FCFCFC] p-3">
        <Textarea
          ref={textareaRef}
          rows={2}
          placeholder="Share a quick update, casting call, or behind-the-scenes moment..."
          maxLength={maxLength}
          className="h-auto min-h-[48px] resize-none overflow-hidden border-none bg-transparent p-0 text-[14px] leading-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              handleCreate();
            }
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="hide-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap pr-1">
          {tools.map((tool) => {
            const ToolIcon = tool.icon;
            const isActive = activeTool === tool.id;

            return (
              <button
                key={tool.id}
                type="button"
                aria-label={`Attach ${tool.label.toLowerCase()}`}
                aria-pressed={isActive}
                onClick={() => toggleTool(tool.id)}
                className={cn(
                  'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium transition-colors',
                  isActive
                    ? 'border-solid border-[#D61D1F]/30 bg-[#D61D1F]/10 text-[#D61D1F]'
                    : 'border-dashed border-[#CBD2E0] bg-white text-muted-foreground hover:border-[#9AA5BC] hover:text-foreground',
                )}
              >
                <ToolIcon className="size-3.5" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Generate draft with AI assist"
            onClick={handleAiAssist}
            className={cn(
              'inline-flex size-8 items-center justify-center rounded-full border transition-colors',
              usedAiAssist
                ? 'border-[#D61D1F]/30 bg-[#D61D1F]/10 text-[#D61D1F]'
                : 'border-[#E5E7EB] bg-white text-muted-foreground hover:border-[#D61D1F]/30 hover:text-[#D61D1F]',
            )}
          >
            <Sparkle className="size-4" weight="fill" />
          </button>
          <Button
            type="button"
            aria-label="Publish post"
            className="h-8 rounded-full bg-[#D61D1F] px-3 text-[11px] font-semibold text-white hover:bg-[#C3191B]"
            onClick={handleCreate}
            disabled={!content.trim() || !hasValidAttachment}
          >
            <PaperPlaneTilt className="size-4" weight="fill" />
            Post
          </Button>
        </div>
      </div>

      {activeTool && (
        <div className="mt-3">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              {selectedTool && <selectedTool.icon className="size-3.5 text-muted-foreground" weight="fill" />}
              <p className="truncate text-[11px] font-semibold text-foreground">
                {selectedTool?.label} flow
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTool(null)}
              className="text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear
            </button>
          </div>

          {activeTool === 'image' && (
            <div className="space-y-2.5">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL"
                className="h-10 rounded-2xl border-[#E5E7EB] bg-white text-[12px] focus-visible:ring-1 focus-visible:ring-[#D61D1F]/20 focus-visible:ring-offset-0"
              />
              {imageUrl.trim() && (
                <img src={imageUrl} alt="Attachment preview" className="h-40 w-full rounded-2xl object-cover" />
              )}
            </div>
          )}

          {activeTool === 'video' && (
            <div className="space-y-2.5">
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste video URL"
                className="h-10 rounded-2xl border-[#E5E7EB] bg-white text-[12px] focus-visible:ring-1 focus-visible:ring-[#D61D1F]/20 focus-visible:ring-offset-0"
              />
              <Input
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Optional video title"
                className="h-10 rounded-2xl border-[#E5E7EB] bg-white text-[12px] focus-visible:ring-1 focus-visible:ring-[#D61D1F]/20 focus-visible:ring-offset-0"
              />
            </div>
          )}

          {activeTool === 'audio' && (
            <div className="space-y-2.5">
              <Input
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="Paste audio URL"
                className="h-10 rounded-2xl border-[#E5E7EB] bg-white text-[12px] focus-visible:ring-1 focus-visible:ring-[#D61D1F]/20 focus-visible:ring-offset-0"
              />
              <Input
                value={audioTitle}
                onChange={(e) => setAudioTitle(e.target.value)}
                placeholder="Optional track title"
                className="h-10 rounded-2xl border-[#E5E7EB] bg-white text-[12px] focus-visible:ring-1 focus-visible:ring-[#D61D1F]/20 focus-visible:ring-offset-0"
              />
              {audioUrl.trim() && (
                <audio controls className="h-10 w-full" src={audioUrl}>
                  Your browser does not support audio playback.
                </audio>
              )}
            </div>
          )}

          {activeTool === 'link' && (
            <div className="space-y-2.5">
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Paste URL"
                className="h-10 rounded-2xl border-[#E5E7EB] bg-white text-[12px] focus-visible:ring-1 focus-visible:ring-[#D61D1F]/20 focus-visible:ring-offset-0"
              />
              <Input
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="Optional link title"
                className="h-10 rounded-2xl border-[#E5E7EB] bg-white text-[12px] focus-visible:ring-1 focus-visible:ring-[#D61D1F]/20 focus-visible:ring-offset-0"
              />
            </div>
          )}

          {activeTool === 'poll' && (
            <div className="space-y-2.5">
              <Input
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Poll question (optional)"
                className="h-10 rounded-2xl border-[#E5E7EB] bg-white text-[12px] focus-visible:ring-1 focus-visible:ring-[#D61D1F]/20 focus-visible:ring-offset-0"
              />
              {pollOptions.map((option, index) => (
                <div key={`poll-option-${index}`} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="h-10 rounded-2xl border-[#E5E7EB] bg-white text-[12px] focus-visible:ring-1 focus-visible:ring-[#D61D1F]/20 focus-visible:ring-offset-0"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removePollOption(index)}
                      className="h-10 rounded-2xl border border-[#E5E7EB] bg-white px-3 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPollOption}
                disabled={pollOptions.length >= 4}
                className="h-8 rounded-2xl border border-dashed border-[#CBD2E0] bg-white px-3 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add option
              </button>
            </div>
          )}

          <p className={cn(
            'mt-2.5 text-[10px]',
            hasValidAttachment ? 'text-muted-foreground' : 'text-[#D61D1F]',
          )}>
            {hasValidAttachment
              ? 'Attachment ready to publish.'
              : 'Complete the selected type details to publish this post.'}
          </p>
        </div>
      )}
    </Card>
  );
}

function PostCard({ post }: { post: FeedPost }) {
  const config = getAuthorIconConfig(post.authorType);
  const Icon = config.icon;
  const [liked, setLiked] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [commentCount, setCommentCount] = useState(post.comments);
  const attachmentType = post.attachmentType ?? ((post.hasImage && post.imageUrl) ? 'image' : undefined);

  return (
    <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/dashboard/profile/${post.authorId}`} className="block">
            {post.authorAvatar ? (
              <div className="h-10 w-10 overflow-hidden rounded-full shadow-sm">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                config.bg,
                config.text,
              )}>
                <Icon className="h-5 w-5" weight="fill" />
              </div>
            )}
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Link to={`/dashboard/profile/${post.authorId}`} className="hover:underline">
                <h4 className="text-[13px] font-semibold text-foreground">{post.authorName}</h4>
              </Link>
              {post.authorType === 'actor' && (
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" weight="fill" />
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">{post.authorRole} · {formatTimestamp(post.timestamp)}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
          <DotsThree className="h-5 w-5" weight="bold" />
        </Button>
      </div>

      <p className="mb-4 text-[13px] leading-relaxed text-foreground">{post.content}</p>

      {attachmentType === 'image' && post.imageUrl && (
        <div className="-mx-1 mb-4 overflow-hidden rounded-2xl">
          <img
            src={post.imageUrl}
            alt="Post image"
            className="h-56 w-full object-cover"
          />
        </div>
      )}

      {attachmentType === 'video' && post.videoUrl && (
        <a
          href={post.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mb-4 flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/20 p-3 transition-colors hover:bg-muted/35"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-muted-foreground">
            <VideoCamera className="h-5 w-5" weight="fill" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-[12px] font-semibold text-foreground">
              {post.videoTitle || 'Video attachment'}
            </p>
            <p className="line-clamp-1 text-[11px] text-muted-foreground">{post.videoUrl}</p>
          </div>
          <CaretRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" weight="bold" />
        </a>
      )}

      {attachmentType === 'audio' && post.audioUrl && (
        <div className="mb-4 rounded-2xl border border-border/50 bg-muted/20 p-3">
          <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-foreground">
            <Microphone className="h-4 w-4 text-muted-foreground" weight="fill" />
            <span className="line-clamp-1">{post.audioTitle || 'Audio attachment'}</span>
          </div>
          <audio controls className="h-9 w-full" src={post.audioUrl}>
            Your browser does not support audio playback.
          </audio>
        </div>
      )}

      {attachmentType === 'link' && post.linkUrl && (
        <a
          href={post.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mb-4 flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/20 p-3 transition-colors hover:bg-muted/35"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-muted-foreground">
            <LinkSimple className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-[12px] font-semibold text-foreground">
              {post.linkTitle || 'Shared link'}
            </p>
            <p className="line-clamp-1 text-[11px] text-muted-foreground">{post.linkUrl}</p>
          </div>
          <CaretRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" weight="bold" />
        </a>
      )}

      {attachmentType === 'poll' && post.pollOptions && post.pollOptions.length > 0 && (
        <div className="mb-4 rounded-2xl border border-border/50 bg-muted/20 p-3">
          <p className="mb-2 text-[12px] font-semibold text-foreground">
            {post.pollQuestion?.trim() || 'Vote on this quick poll'}
          </p>
          <div className="space-y-2">
            {post.pollOptions.map((option, optionIndex) => (
              <button
                key={`${post.id}-poll-${optionIndex}`}
                type="button"
                onClick={() => setSelectedPollOption(optionIndex)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-[12px] transition-colors',
                  selectedPollOption === optionIndex
                    ? 'border-[#D61D1F]/35 bg-[#D61D1F]/8 text-[#D61D1F]'
                    : 'border-border/50 bg-white text-foreground hover:bg-muted/40',
                )}
              >
                <span className="line-clamp-1">{option}</span>
                {selectedPollOption === optionIndex && (
                  <span className="text-[10px] font-semibold uppercase">Selected</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-6 border-t border-border/40 pt-3">
        <button
          type="button"
          onClick={() => setLiked((current) => !current)}
          className={cn(
            'flex items-center gap-1.5 text-[12px] transition-colors',
            liked ? 'text-[#D61D1F]' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Heart className="h-4 w-4" weight={liked ? 'fill' : 'regular'} />
          <span className="font-inter-numeric">{liked ? post.likes + 1 : post.likes}</span>
        </button>

        <button
          type="button"
          onClick={() => setCommentCount((current) => current + 1)}
          className="flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChatCircle className="h-4 w-4" />
          <span className="font-inter-numeric">{commentCount}</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ShareNetwork className="h-4 w-4" />
          <span className="font-inter-numeric">{post.shares}</span>
        </button>
      </div>
    </Card>
  );
}

function FeedPostSkeletonCard({ withMedia = false }: { withMedia?: boolean }) {
  return (
    <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-28 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-[88%] rounded-full" />
        <Skeleton className="h-3 w-[72%] rounded-full" />
      </div>

      {withMedia && (
        <Skeleton className="mt-4 h-44 w-full rounded-2xl" />
      )}

      <div className="mt-4 flex items-center gap-2 border-t border-border/40 pt-3">
        <Skeleton className="h-7 w-14 rounded-lg" />
        <Skeleton className="h-7 w-14 rounded-lg" />
        <Skeleton className="h-7 w-14 rounded-lg" />
      </div>
    </Card>
  );
}

function PostPublishPreviewModal({
  post,
  open,
  onOpenChange,
  onConfirm,
}: {
  post: FeedPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-4xl gap-0 overflow-hidden rounded-3xl border border-[#ECECEC] bg-[#F9F9F9] p-0">
        <DialogHeader className="border-b border-border/50 bg-white px-5 py-4 text-left sm:px-6">
          <DialogTitle className="text-balance text-[18px] font-semibold text-foreground">
            Feed render preview
          </DialogTitle>
          <DialogDescription className="text-pretty text-[12px] leading-5 text-muted-foreground">
            Validate how this post appears in the feed. The other posts here are skeleton placeholders.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90dvh-11.5rem)]">
          <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
            <FeedPostSkeletonCard />
            <div className="rounded-[28px] border border-[#D61D1F]/20 bg-[#FDF5F5] p-1">
              <PostCard post={post} />
            </div>
            <FeedPostSkeletonCard withMedia />
            <FeedPostSkeletonCard />
          </div>
        </ScrollArea>

        <div className="flex items-center justify-end gap-2 border-t border-border/50 bg-white px-5 py-3 sm:px-6">
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-full px-4 text-[12px] font-semibold"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-9 rounded-full bg-[#D61D1F] px-4 text-[12px] font-semibold text-white hover:bg-[#C3191B]"
            onClick={onConfirm}
          >
            Post to feed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GroupsSection({ title, groups }: { title: string; groups: typeof mockCommunities }) {
  const groupItemIcons = [UsersThree, Buildings, Briefcase, UserCircle];

  return (
    <Card className="rounded-3xl border border-[#ECECEC] bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersThree className="size-4 text-[#0052FF]" weight="fill" />
          <h3 className="text-balance text-[13px] font-semibold text-foreground">{title}</h3>
        </div>
        <Link to="#" className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground">
          See all
        </Link>
      </div>

      <div className="space-y-2.5">
        {groups.map((group, index) => {
          const GroupItemIcon = groupItemIcons[index % groupItemIcons.length];

          return (
            <Link
              key={group.id}
              to={`/dashboard/community/${group.id}`}
              className="group flex min-w-0 items-center gap-3 rounded-xl transition-colors"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground">
                <GroupItemIcon className="size-5" weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="line-clamp-1 text-balance text-[12px] font-medium leading-5 text-foreground transition-colors group-hover:text-[#0052FF]">
                  {group.name}
                </h4>
                <div className="mt-0.5 text-pretty text-[10px] text-muted-foreground">
                  <span className="font-inter-numeric tabular-nums">{group.memberCount.toLocaleString()} members</span>
                </div>
              </div>
              <CaretRight className="size-4 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" weight="bold" />
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>(mockFeedPosts);
  const [previewPost, setPreviewPost] = useState<FeedPost | null>(null);
  const user = storage.getUser();
  const pendingRequests = storage.getLicenseRequests().filter((request) => request.status === 'pending').length;

  const handleCreatePost = ({ content, attachment }: CreatePostPayload) => {
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      authorId: user?.id || 'me',
      authorName: user?.name || 'You',
      authorRole: user?.role || 'Actor',
      authorType: (user?.role as 'actor' | 'studio' | 'agency') || 'actor',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop',
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
    };

    if (attachment?.type === 'image') {
      newPost.attachmentType = 'image';
      newPost.hasImage = true;
      newPost.imageUrl = attachment.imageUrl;
    }
    if (attachment?.type === 'video') {
      newPost.attachmentType = 'video';
      newPost.videoUrl = attachment.videoUrl;
      newPost.videoTitle = attachment.videoTitle;
    }
    if (attachment?.type === 'audio') {
      newPost.attachmentType = 'audio';
      newPost.audioUrl = attachment.audioUrl;
      newPost.audioTitle = attachment.audioTitle;
    }
    if (attachment?.type === 'link') {
      newPost.attachmentType = 'link';
      newPost.linkUrl = attachment.linkUrl;
      newPost.linkTitle = attachment.linkTitle;
    }
    if (attachment?.type === 'poll') {
      newPost.attachmentType = 'poll';
      newPost.pollQuestion = attachment.pollQuestion;
      newPost.pollOptions = attachment.pollOptions;
    }

    setPreviewPost(newPost);
  };

  const handleConfirmPost = () => {
    if (!previewPost) return;
    setPosts((current) => [previewPost, ...current]);
    setPreviewPost(null);
  };

  return (
    <DashboardLayout
      className="h-dvh overflow-hidden bg-[#F9F9F9]"
      fullWidth
      transparentNav
      navContentClassName="w-[85%] mx-auto"
      hideTopNavOnMobile
      mainClassName="px-0 py-0 lg:px-6 lg:py-6"
    >
      <MobileFeedHeader pendingRequests={pendingRequests} />

      <div className="mx-auto flex h-dvh w-full gap-4 overflow-hidden px-4 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] pt-[calc(env(safe-area-inset-top)+4.25rem)] lg:h-[calc(100dvh-6.5rem)] lg:w-[85%] lg:gap-6 lg:px-0 lg:pb-0 lg:pt-0">
        <div className="hidden h-full w-72 flex-shrink-0 lg:block">
          <ProfileOverviewCard />
        </div>

        <div className="hide-scrollbar h-full min-w-0 flex-1 space-y-4 overflow-y-auto pb-4 pr-1 lg:pb-6">
          <CreatePostInput onPost={handleCreatePost} />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="hidden h-full w-72 flex-shrink-0 space-y-4 xl:block">
          <GroupsSection title="Groups" groups={mockCommunities.slice(0, 3)} />
        </div>
      </div>

      <MobileFeedBottomNav />

      <PostPublishPreviewModal
        post={previewPost}
        open={Boolean(previewPost)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPreviewPost(null);
          }
        }}
        onConfirm={handleConfirmPost}
      />
    </DashboardLayout>
  );
}
