import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MagnifyingGlass,
  Funnel,
  FilmStrip,
  Buildings,
  CurrencyDollar,
  CalendarBlank,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockCastingCalls } from '@/lib/store';

export default function CastingCallsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navState = typeof location.state === 'object' && location.state !== null ? (location.state as Record<string, unknown>) : null;
  const fromAgency = typeof navState?.fromAgency === 'string' ? navState.fromAgency : null;
  const fromStudio = typeof navState?.fromStudio === 'string' ? navState.fromStudio : null;
  const fromSearch = typeof navState?.fromSearch === 'string' ? navState.fromSearch : null;
  const detailNavState = fromStudio
    ? { fromStudio }
    : fromAgency
      ? { fromAgency }
      : fromSearch
        ? { fromSearch }
        : { fromCastingCalls: `${location.pathname}${location.search}` };

  const filteredCalls = mockCastingCalls.filter(call =>
    call.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.studio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.requirements.some(requirement => requirement.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-[24px] font-semibold text-foreground text-balance">Casting Calls</h1>
          <p className="text-[13px] text-muted-foreground text-pretty">Browse active opportunities from verified studios and teams.</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 md:w-80 group">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <Input
                placeholder="Search by title, studio, role, or requirement..."
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCalls.map((call) => (
            <Link key={call.id} to={`/dashboard/casting-calls/${call.id}`} state={detailNavState}>
              <Card className="p-6 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 hover:border-[#D61D1F]/30 transition-colors duration-200 h-full">
                <div className="h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#D61D1F]/10 text-[#D61D1F] ring-1 ring-[#D61D1F]/20 flex items-center justify-center">
                        <FilmStrip className="w-5 h-5" weight="fill" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-[15px] font-semibold text-foreground line-clamp-2 text-balance">{call.title}</h2>
                        <p className="text-[12px] text-muted-foreground line-clamp-1">{call.role}</p>
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#D61D1F]/10 text-[#D61D1F] border border-[#D61D1F]/20 whitespace-nowrap">Open</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-3">
                    <Buildings className="w-3.5 h-3.5" />
                    <span className="truncate">{call.studio}</span>
                  </div>

                  <p className="text-[13px] text-muted-foreground line-clamp-3 text-pretty mb-4">{call.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {call.requirements.slice(0, 2).map((requirement, index) => (
                      <span key={index} className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/50 text-secondary-foreground border border-border/50">
                        {requirement}
                      </span>
                    ))}
                    {call.requirements.length > 2 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md text-muted-foreground border border-border/50">
                        +{call.requirements.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between text-[12px] text-muted-foreground gap-3">
                    <div className="flex items-center gap-1 truncate">
                      <CurrencyDollar className="w-3.5 h-3.5" />
                      <span className="truncate">{call.budget}</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <CalendarBlank className="w-3.5 h-3.5" />
                      <span>{new Date(call.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredCalls.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border/60">
            <div className="w-16 h-16 rounded-2xl bg-muted/20 flex items-center justify-center mb-4">
              <MagnifyingGlass className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-[15px] font-semibold text-foreground text-balance">No casting calls found</h3>
            <p className="text-[13px] text-muted-foreground mt-1 text-pretty">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
