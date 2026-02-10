import { type ComponentType, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Briefcase,
  Buildings,
  CalendarBlank,
  CurrencyDollar,
  FilmStrip,
  MagnifyingGlass,
  MapPin,
  SlidersHorizontal,
  ShieldCheck,
  UserCircle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Actor,
  Agency,
  CastingCall,
  Studio,
  mockActors,
  mockAgencies,
  mockCastingCalls,
  mockStudios,
} from "@/lib/store";

interface SearchCardProps {
  fromSearch: string;
}

type SectionIcon = ComponentType<{
  className?: string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}>;

type ClearanceStatus = "pre-cleared" | "conditional" | "restricted";

interface PreClearedMeta {
  clearance: ClearanceStatus;
  ageRange: string;
  gender: string;
  accent: string;
  geography: string;
  useCases: string[];
}

const PRE_CLEARED_META: Record<string, PreClearedMeta> = {
  "actor-1": {
    clearance: "pre-cleared",
    ageRange: "25-34",
    gender: "Female",
    accent: "Neutral English",
    geography: "India",
    useCases: ["Games", "TV/Film", "Dubbing"],
  },
  "actor-2": {
    clearance: "conditional",
    ageRange: "35-44",
    gender: "Male",
    accent: "Hindi",
    geography: "APAC",
    useCases: ["Games", "Ads"],
  },
  "actor-3": {
    clearance: "pre-cleared",
    ageRange: "25-34",
    gender: "Female",
    accent: "Tamil English",
    geography: "Worldwide",
    useCases: ["TV/Film", "Social", "Ads"],
  },
  "actor-4": {
    clearance: "restricted",
    ageRange: "45-54",
    gender: "Male",
    accent: "Hindi English",
    geography: "Europe",
    useCases: ["Dubbing"],
  },
};

const CLEARANCE_OPTIONS = [
  { label: "Any Clearance", value: "all" },
  { label: "Pre-cleared", value: "pre-cleared" },
  { label: "Conditional", value: "conditional" },
  { label: "Restricted", value: "restricted" },
];

const AGE_OPTIONS = [
  { label: "Any Age", value: "all" },
  { label: "25-34", value: "25-34" },
  { label: "35-44", value: "35-44" },
  { label: "45-54", value: "45-54" },
];

const GENDER_OPTIONS = [
  { label: "Any Gender", value: "all" },
  { label: "Female", value: "Female" },
  { label: "Male", value: "Male" },
];

const ACCENT_OPTIONS = [
  { label: "Any Accent", value: "all" },
  { label: "Neutral English", value: "Neutral English" },
  { label: "Hindi", value: "Hindi" },
  { label: "Tamil English", value: "Tamil English" },
  { label: "Hindi English", value: "Hindi English" },
];

const GEOGRAPHY_OPTIONS = [
  { label: "Any Geography", value: "all" },
  { label: "India", value: "India" },
  { label: "APAC", value: "APAC" },
  { label: "Europe", value: "Europe" },
  { label: "Worldwide", value: "Worldwide" },
];

const USE_CASE_OPTIONS = [
  { label: "Any Use Case", value: "all" },
  { label: "Games", value: "Games" },
  { label: "TV/Film", value: "TV/Film" },
  { label: "Social", value: "Social" },
  { label: "Dubbing", value: "Dubbing" },
  { label: "Ads", value: "Ads" },
];

const includesQuery = (value: string, query: string) => value.toLowerCase().includes(query);

function PeopleCard({ actor, fromSearch }: { actor: Actor } & SearchCardProps) {
  return (
    <Link to={`/dashboard/actor/${actor.id}`} state={{ fromSearch }}>
      <Card className="h-full rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-colors hover:border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground">
              <UserCircle className="size-5" weight="fill" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-foreground">{actor.name}</h3>
              <p className="text-[12px] text-muted-foreground">{actor.specialty}</p>
            </div>
          </div>
          {actor.verified && <ShieldCheck className="size-4 text-emerald-600" weight="fill" />}
        </div>
        <p className="mt-3 line-clamp-2 text-[12px] text-muted-foreground text-pretty">{actor.bio}</p>
        <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="size-3.5" />
          <span className="truncate">{actor.location}</span>
        </div>
      </Card>
    </Link>
  );
}

function CastingCallCard({ call, fromSearch }: { call: CastingCall } & SearchCardProps) {
  return (
    <Link to={`/dashboard/casting-calls/${call.id}`} state={{ fromSearch }}>
      <Card className="h-full rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-colors hover:border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground">
              <FilmStrip className="size-5" weight="fill" />
            </div>
            <div>
              <h3 className="line-clamp-1 text-[14px] font-semibold text-foreground">{call.title}</h3>
              <p className="text-[12px] text-muted-foreground">{call.studio}</p>
            </div>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-[12px] text-muted-foreground text-pretty">{call.description}</p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CurrencyDollar className="size-3.5" />
            {call.budget}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarBlank className="size-3.5" />
            {new Date(call.deadline).toLocaleDateString()}
          </span>
        </div>
      </Card>
    </Link>
  );
}

function StudioCard({ studio, fromSearch }: { studio: Studio } & SearchCardProps) {
  return (
    <Link to={`/dashboard/studio/${studio.id}`} state={{ fromSearch }}>
      <Card className="h-full rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-colors hover:border-border">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-muted/70 text-muted-foreground">
            {studio.logoUrl ? (
              <img src={studio.logoUrl} alt={`${studio.name} logo`} className="size-full object-cover" loading="lazy" />
            ) : (
              <Buildings className="size-5" weight="fill" />
            )}
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">{studio.name}</h3>
            <p className="text-[12px] text-muted-foreground">{studio.type}</p>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-[12px] text-muted-foreground text-pretty">{studio.description}</p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {studio.location}
          </span>
          <span>{studio.projectCount} projects</span>
        </div>
      </Card>
    </Link>
  );
}

function AgencyCard({ agency, fromSearch }: { agency: Agency } & SearchCardProps) {
  return (
    <Link to={`/dashboard/agency/${agency.id}`} state={{ fromSearch }}>
      <Card className="h-full rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-colors hover:border-border">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground">
            <Briefcase className="size-5" weight="fill" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">{agency.name}</h3>
            <p className="text-[12px] text-muted-foreground">{agency.rosterSize} artists</p>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-[12px] text-muted-foreground text-pretty">{agency.description}</p>
      </Card>
    </Link>
  );
}

function SectionHeader({ title, count, icon: Icon }: { title: string; count: number; icon: SectionIcon }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-muted/70 text-muted-foreground">
          <Icon className="size-4" weight="fill" />
        </div>
        <h2 className="text-[16px] font-semibold text-foreground text-balance">{title}</h2>
      </div>
      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{count}</span>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-9 rounded-lg border-border/60 text-[12px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-[12px]">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function clearanceTone(clearance: ClearanceStatus) {
  if (clearance === "pre-cleared") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700";
  }
  if (clearance === "conditional") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-700";
  }
  return "border-destructive/20 bg-destructive/10 text-destructive";
}

export default function SearchPage() {
  const location = useLocation();
  const fromSearch = `${location.pathname}${location.search}`;
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreCleared, setShowPreCleared] = useState(false);
  const [clearanceFilter, setClearanceFilter] = useState<ClearanceStatus | "all">("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [accentFilter, setAccentFilter] = useState("all");
  const [geographyFilter, setGeographyFilter] = useState("all");
  const [useCaseFilter, setUseCaseFilter] = useState("all");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPeople = useMemo(
    () =>
      mockActors.filter(
        (actor) =>
          !normalizedQuery ||
          includesQuery(actor.name, normalizedQuery) ||
          includesQuery(actor.specialty, normalizedQuery) ||
          includesQuery(actor.bio, normalizedQuery) ||
          actor.skills.some((skill) => includesQuery(skill, normalizedQuery)),
      ),
    [normalizedQuery],
  );

  const filteredCastingCalls = useMemo(
    () =>
      mockCastingCalls.filter(
        (call) =>
          !normalizedQuery ||
          includesQuery(call.title, normalizedQuery) ||
          includesQuery(call.studio, normalizedQuery) ||
          includesQuery(call.role, normalizedQuery) ||
          includesQuery(call.description, normalizedQuery) ||
          call.requirements.some((requirement) => includesQuery(requirement, normalizedQuery)),
      ),
    [normalizedQuery],
  );

  const filteredStudios = useMemo(
    () =>
      mockStudios.filter(
        (studio) =>
          !normalizedQuery ||
          includesQuery(studio.name, normalizedQuery) ||
          includesQuery(studio.type, normalizedQuery) ||
          includesQuery(studio.description, normalizedQuery) ||
          includesQuery(studio.location, normalizedQuery),
      ),
    [normalizedQuery],
  );

  const filteredAgencies = useMemo(
    () =>
      mockAgencies.filter(
        (agency) =>
          !normalizedQuery ||
          includesQuery(agency.name, normalizedQuery) ||
          includesQuery(agency.description, normalizedQuery) ||
          agency.specialties.some((specialty) => includesQuery(specialty, normalizedQuery)),
      ),
    [normalizedQuery],
  );

  const preClearedPeople = useMemo(
    () => filteredPeople.filter((person) => person.verified),
    [filteredPeople],
  );

  const preClearedResults = useMemo(() => {
    return preClearedPeople
      .map((person) => {
        const meta = PRE_CLEARED_META[person.id];
        if (!meta) {
          return null;
        }

        if (clearanceFilter !== "all" && meta.clearance !== clearanceFilter) {
          return null;
        }
        if (ageFilter !== "all" && meta.ageRange !== ageFilter) {
          return null;
        }
        if (genderFilter !== "all" && meta.gender !== genderFilter) {
          return null;
        }
        if (accentFilter !== "all" && meta.accent !== accentFilter) {
          return null;
        }
        if (geographyFilter !== "all" && meta.geography !== geographyFilter) {
          return null;
        }
        if (useCaseFilter !== "all" && !meta.useCases.includes(useCaseFilter)) {
          return null;
        }

        let score = Math.round(person.rating * 16);
        if (meta.clearance === "pre-cleared") score += 14;
        if (useCaseFilter !== "all" && meta.useCases.includes(useCaseFilter)) score += 8;

        return {
          actor: person,
          meta,
          matchScore: Math.min(99, score),
        };
      })
      .filter((item): item is { actor: Actor; meta: PreClearedMeta; matchScore: number } => !!item)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [
    accentFilter,
    ageFilter,
    clearanceFilter,
    genderFilter,
    geographyFilter,
    preClearedPeople,
    useCaseFilter,
  ]);

  const resetPreClearedFilters = () => {
    setClearanceFilter("all");
    setAgeFilter("all");
    setGenderFilter("all");
    setAccentFilter("all");
    setGeographyFilter("all");
    setUseCaseFilter("all");
  };

  const totalResults =
    filteredPeople.length + filteredCastingCalls.length + filteredStudios.length + filteredAgencies.length;

  return (
    <DashboardLayout
      className="h-dvh overflow-hidden bg-[#F9F9F9]"
      fullWidth
      transparentNav
      navContentClassName="w-[85%] mx-auto"
    >
      <div className="hide-scrollbar mx-auto h-[calc(100dvh-6.5rem)] w-[85%] space-y-6 overflow-y-auto pb-6">
        <div className="space-y-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="min-w-0 flex-1">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={
                    showPreCleared
                      ? "Search pre-cleared talent..."
                      : "Search people, casting calls, studios, and agencies..."
                  }
                  className="h-12 rounded-xl border-border/60 pl-9 text-[14px]"
                />
              </div>
            </div>

            <div className="flex h-12 w-full items-center justify-between rounded-xl border border-border/50 bg-background px-4 lg:w-[280px] lg:flex-shrink-0">
              <Label htmlFor="pre-cleared-search" className="cursor-pointer text-[13px] font-medium text-foreground">
                Pre-cleared
              </Label>
              <Switch id="pre-cleared-search" checked={showPreCleared} onCheckedChange={setShowPreCleared} />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">{totalResults} total matches across all sections.</p>
        </div>

        {showPreCleared && (
          <Card className="mx-auto w-full max-w-4xl rounded-2xl border border-border/50 bg-card p-4 sm:p-5">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-[17px] font-semibold text-foreground text-balance">Pre-cleared Talent Search</h2>
                  <p className="mt-1 text-[12px] text-muted-foreground text-pretty">
                    Filter talent by clearance, demographic profile, and allowed use cases.
                  </p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-[11px] text-muted-foreground">
                  {preClearedResults.length} compliance-ready matches
                </span>
              </div>

              <div className="border-t border-border/50 pt-4">
                <div className="mb-3 flex items-center gap-2 text-[12px] font-medium text-foreground">
                  <SlidersHorizontal className="size-4" />
                  Filters
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
                  <FilterSelect
                    label="Clearance"
                    value={clearanceFilter}
                    onValueChange={(value) => setClearanceFilter(value as ClearanceStatus | "all")}
                    options={CLEARANCE_OPTIONS}
                  />
                  <FilterSelect label="Age" value={ageFilter} onValueChange={setAgeFilter} options={AGE_OPTIONS} />
                  <FilterSelect label="Gender" value={genderFilter} onValueChange={setGenderFilter} options={GENDER_OPTIONS} />
                  <FilterSelect label="Accent" value={accentFilter} onValueChange={setAccentFilter} options={ACCENT_OPTIONS} />
                  <FilterSelect
                    label="Geography"
                    value={geographyFilter}
                    onValueChange={setGeographyFilter}
                    options={GEOGRAPHY_OPTIONS}
                  />
                  <FilterSelect
                    label="Use Case"
                    value={useCaseFilter}
                    onValueChange={setUseCaseFilter}
                    options={USE_CASE_OPTIONS}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <Button variant="outline" className="h-8 rounded-lg text-[12px]" onClick={resetPreClearedFilters}>
                    Reset Filters
                  </Button>
                </div>
              </div>

              {preClearedResults.length === 0 ? (
                <p className="text-[12px] text-muted-foreground text-pretty">
                  No pre-cleared talent matched your current search.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {preClearedResults.map((result) => (
                    <Link
                      key={result.actor.id}
                      to={`/dashboard/actor/${result.actor.id}`}
                      state={{ fromSearch }}
                    >
                      <Card className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:border-border">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground">
                              <UserCircle className="size-5" weight="fill" />
                            </div>
                            <div>
                              <h3 className="text-[14px] font-semibold text-foreground">{result.actor.name}</h3>
                              <p className="text-[12px] text-muted-foreground">{result.actor.specialty}</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                            Match {result.matchScore}%
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${clearanceTone(
                              result.meta.clearance,
                            )}`}
                          >
                            {result.meta.clearance}
                          </span>
                          <span className="rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground">
                            {result.meta.ageRange}
                          </span>
                          <span className="rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground">
                            {result.meta.gender}
                          </span>
                          <span className="rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground">
                            {result.meta.accent}
                          </span>
                          <span className="rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground">
                            {result.meta.geography}
                          </span>
                        </div>

                        <p className="mt-3 text-[11px] text-muted-foreground">
                          Allowed: {result.meta.useCases.join(", ")}
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        <div className="space-y-6">
          <div className="space-y-3">
            <SectionHeader title="People" count={filteredPeople.length} icon={UserCircle} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPeople.map((person) => (
                <PeopleCard key={person.id} actor={person} fromSearch={fromSearch} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <SectionHeader title="Casting Calls" count={filteredCastingCalls.length} icon={FilmStrip} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCastingCalls.map((call) => (
                <CastingCallCard key={call.id} call={call} fromSearch={fromSearch} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <SectionHeader title="Studios" count={filteredStudios.length} icon={Buildings} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredStudios.map((studio) => (
                <StudioCard key={studio.id} studio={studio} fromSearch={fromSearch} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <SectionHeader title="Agencies" count={filteredAgencies.length} icon={Briefcase} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAgencies.map((agency) => (
                <AgencyCard key={agency.id} agency={agency} fromSearch={fromSearch} />
              ))}
            </div>
          </div>
        </div>

        {totalResults === 0 && (
          <div className="rounded-2xl border border-dashed border-border/50 bg-card p-8 text-center">
            <h3 className="text-[16px] font-semibold text-foreground text-balance">No results found</h3>
            <p className="mt-1 text-[12px] text-muted-foreground text-pretty">
              Try changing your search terms.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
