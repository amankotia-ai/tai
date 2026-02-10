import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersThree, ChatCircle, ShareNetwork, PencilSimple } from '@phosphor-icons/react';
import { mockCommunities, mockFeedPosts } from '@/lib/store';
import { toast } from 'sonner';

export default function CommunityPage() {
  const { id } = useParams();
  const community = mockCommunities.find((entry) => entry.id === id);

  if (!community) {
    return (
      <DashboardLayout
        className="h-dvh overflow-hidden bg-[#F9F9F9]"
        fullWidth
        transparentNav
        navContentClassName="w-[85%] mx-auto"
      >
        <div className="mx-auto flex h-[calc(100dvh-6.5rem)] w-[85%] items-center justify-center">
          <Card className="w-full max-w-xl rounded-3xl border border-[#EAEAEA] bg-white p-8 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#F4F5F7]">
              <UsersThree className="size-8 text-muted-foreground" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-foreground text-balance">Community Not Found</h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              The community you are looking for does not exist anymore or is private.
            </p>
            <Button
              asChild
              className="mt-6 h-9 rounded-full bg-[#D61D1F] px-4 text-xs font-semibold text-white hover:bg-[#C3191B]"
            >
              <Link to="/dashboard/feed">Back to Feed</Link>
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const posts = mockFeedPosts;
  const snapshotMetrics = [
    { label: 'Members', value: community.memberCount.toLocaleString() },
    { label: 'Posts today', value: '24' },
    { label: 'Open discussions', value: '6' },
  ];

  const handleJoin = () => {
    toast.success(`Joined ${community.name}`);
  };

  return (
    <DashboardLayout
      className="h-dvh overflow-hidden bg-[#F9F9F9]"
      fullWidth
      transparentNav
      navContentClassName="w-[85%] mx-auto"
    >
      <div className="mx-auto flex h-[calc(100dvh-6.5rem)] w-[85%] gap-6 overflow-hidden">
        <aside className="hide-scrollbar hidden h-full w-72 flex-shrink-0 space-y-4 overflow-y-auto pb-6 lg:block">
          <Card className="rounded-3xl border border-[#EAEAEA] bg-white p-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Community Snapshot</p>
            <h2 className="mt-2 text-sm font-semibold text-foreground text-balance">{community.name}</h2>
            <div className="mt-4 divide-y divide-[#ECECEC]">
              {snapshotMetrics.map((metric) => (
                <div key={metric.label} className="flex items-end justify-between py-2.5">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  <span className="font-inter-numeric tabular-nums text-sm font-semibold text-foreground">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-3xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-sm font-semibold text-foreground text-balance">Community Priorities</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground text-pretty">
              Keep discussions practical, share opportunities responsibly, and credit collaborators.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className="rounded-full border border-[#E5E7EB] bg-[#F7F8FA] px-2.5 py-1 text-xs font-medium text-foreground hover:bg-[#F0F2F5]">
                Casting calls
              </Badge>
              <Badge className="rounded-full border border-[#E5E7EB] bg-[#F7F8FA] px-2.5 py-1 text-xs font-medium text-foreground hover:bg-[#F0F2F5]">
                Portfolio reviews
              </Badge>
              <Badge className="rounded-full border border-[#E5E7EB] bg-[#F7F8FA] px-2.5 py-1 text-xs font-medium text-foreground hover:bg-[#F0F2F5]">
                Rights education
              </Badge>
            </div>
          </Card>
        </aside>

        <section className="hide-scrollbar h-full min-w-0 flex-1 overflow-y-auto pb-6 pr-1">
          <Card className="rounded-3xl border border-[#EAEAEA] bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex size-16 items-center justify-center rounded-2xl border border-[#ECECEC] bg-[#F7F8FA]">
                  <UsersThree className="size-8 text-[#D61D1F]" weight="duotone" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold text-foreground text-balance">{community.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <UsersThree className="size-4" />
                      <span className="font-inter-numeric tabular-nums">
                        {community.memberCount.toLocaleString()} members
                      </span>
                    </span>
                    <span className="size-1 rounded-full bg-[#D5D7DB]" />
                    <span className="font-medium text-[#D61D1F]">Live discussion room</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  className="h-9 rounded-full bg-[#D61D1F] px-4 text-xs font-semibold text-white hover:bg-[#C3191B]"
                  onClick={handleJoin}
                >
                  Join Community
                </Button>
                <Button
                  aria-label="Share community"
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full border-[#E5E7EB] text-muted-foreground hover:text-foreground"
                >
                  <ShareNetwork className="size-4" />
                </Button>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
              A focused space for performers, producers, and rights managers to exchange opportunities and practices.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className="rounded-full bg-[#D61D1F]/10 px-2.5 py-1 text-xs font-medium text-[#D61D1F] hover:bg-[#D61D1F]/15">
                Open Community
              </Badge>
              <Badge className="rounded-full bg-[#F2F4F7] px-2.5 py-1 text-xs font-medium text-foreground hover:bg-[#ECEFF3]">
                Weekly Q&A
              </Badge>
              <Badge className="rounded-full bg-[#F2F4F7] px-2.5 py-1 text-xs font-medium text-foreground hover:bg-[#ECEFF3]">
                Verified Profiles
              </Badge>
            </div>
          </Card>

          <Tabs defaultValue="feed" className="mt-4 space-y-4">
            <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-[#EAEAEA] bg-transparent p-0 pb-px">
              <TabsTrigger
                value="feed"
                className="rounded-none border-b-2 border-transparent px-0 py-2.5 text-sm font-semibold text-muted-foreground transition-colors data-[state=active]:border-[#D61D1F] data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Feed
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="rounded-none border-b-2 border-transparent px-0 py-2.5 text-sm font-semibold text-muted-foreground transition-colors data-[state=active]:border-[#D61D1F] data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Members
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="rounded-none border-b-2 border-transparent px-0 py-2.5 text-sm font-semibold text-muted-foreground transition-colors data-[state=active]:border-[#D61D1F] data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-4">
              <Card className="rounded-2xl border border-[#EAEAEA] bg-white p-4">
                <div className="flex gap-3">
                  <Avatar className="size-10 border border-[#ECECEC]">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Start a discussion..."
                      className="h-10 w-full rounded-full border border-[#ECECEC] bg-[#FAFAFA] px-4 text-sm transition-colors hover:bg-white focus-visible:bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D61D1F]/20"
                    />
                    <Button
                      aria-label="Write post"
                      size="icon"
                      variant="ghost"
                      className="absolute right-1 top-1 size-8 rounded-full text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    >
                      <PencilSimple className="size-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {posts.map((post) => (
                <Card key={post.id} className="rounded-3xl border border-[#EAEAEA] bg-white p-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10 border border-[#ECECEC]">
                      <AvatarImage src={post.authorAvatar} />
                      <AvatarFallback>{post.authorName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{post.authorName}</p>
                          <p className="truncate text-xs text-muted-foreground">{post.authorRole}</p>
                        </div>
                        <span className="font-inter-numeric tabular-nums text-xs text-muted-foreground">2h ago</span>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-foreground/90 text-pretty">{post.content}</p>
                      {post.imageUrl && (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-[#ECECEC]">
                          <img src={post.imageUrl} alt="Post content" className="h-auto w-full object-cover" />
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-2 border-t border-[#F1F1F1] pt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        >
                          {post.likes} Likes
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        >
                          <ChatCircle className="size-4" />
                          {post.comments} Comments
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="members" className="space-y-3">
              {posts.slice(0, 5).map((post) => (
                <Card key={`${post.id}-member`} className="rounded-2xl border border-[#EAEAEA] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-10 border border-[#ECECEC]">
                        <AvatarImage src={post.authorAvatar} />
                        <AvatarFallback>{post.authorName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{post.authorName}</p>
                        <p className="truncate text-xs text-muted-foreground">{post.authorRole}</p>
                      </div>
                    </div>
                    <Badge className="rounded-full bg-[#F2F4F7] px-2.5 py-1 text-xs font-medium text-foreground hover:bg-[#ECEFF3]">
                      Active
                    </Badge>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="about">
              <Card className="rounded-3xl border border-[#EAEAEA] bg-white p-5">
                <h3 className="text-sm font-semibold text-foreground text-balance">About This Community</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                  This group focuses on practical collaboration between performers, production teams, and licensing
                  stakeholders. Share calls, ask for reviews, and discuss rights with context.
                </p>
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Core rules</p>
                  <p className="text-sm text-muted-foreground text-pretty">1. Keep feedback specific and respectful.</p>
                  <p className="text-sm text-muted-foreground text-pretty">
                    2. Mention source and timeline when sharing opportunities.
                  </p>
                  <p className="text-sm text-muted-foreground text-pretty">
                    3. Use rights-safe assets for all uploads and references.
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <aside className="hide-scrollbar hidden h-full w-72 flex-shrink-0 space-y-4 overflow-y-auto pb-6 xl:block">
          <Card className="rounded-3xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-xs font-semibold text-foreground text-balance">Community Guidelines</h3>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#D61D1F]" />
                <span className="text-pretty">Be respectful to every member.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#D61D1F]" />
                <span className="text-pretty">No promotional spam in discussion threads.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#D61D1F]" />
                <span className="text-pretty">Report suspicious or plagiarized content.</span>
              </li>
            </ul>
          </Card>

        </aside>
      </div>
    </DashboardLayout>
  );
}
