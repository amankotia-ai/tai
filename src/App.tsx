import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import SignIn from "./pages/SignIn";
import About from "./pages/About";
import CastID from "./pages/CastID";
import Licensing from "./pages/Licensing";
import Network from "./pages/Network";
import Press from "./pages/Press";
import Research from "./pages/Research";
import DashboardHome from "./pages/dashboard/DashboardHome";
import VaultPage from "./pages/dashboard/VaultPage";
import MarketplacePage from "./pages/dashboard/MarketplacePage";
import ContractsPage from "./pages/dashboard/ContractsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import SearchPage from "./pages/dashboard/SearchPage";
import CastingCallsPage from "./pages/dashboard/CastingCallsPage";
import CastingCallProfilePage from "./pages/dashboard/CastingCallProfilePage";
import ChatPage from "./pages/dashboard/ChatPage";
import FeedPage from "./pages/dashboard/FeedPage";
import ActorProfilePage from "./pages/dashboard/ActorProfilePage";
import StudioProfilePage from "./pages/dashboard/StudioProfilePage";
import AgencyProfilePage from "./pages/dashboard/AgencyProfilePage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import NetworkPage from "./pages/dashboard/NetworkPage";
import SavedItemsPage from "./pages/dashboard/SavedItemsPage";
import CommunityPage from "./pages/dashboard/CommunityPage";
import PaymentsPage from "./pages/dashboard/PaymentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const NetworkEntryRoute = () => {
  const hasPersistedUser = typeof window !== "undefined" && !!window.localStorage.getItem("theatre_ai_user");
  return hasPersistedUser ? <NetworkPage /> : <Network />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/about" element={<About />} />
          <Route path="/castid" element={<CastID />} />
          <Route path="/licensing" element={<Licensing />} />
          <Route path="/network" element={<NetworkEntryRoute />} />
          <Route path="/press" element={<Press />} />
          <Route path="/research" element={<Research />} />

          <Route path="/vault" element={<VaultPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/casting-calls" element={<CastingCallsPage />} />
          <Route path="/casting-calls/:id" element={<CastingCallProfilePage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/studio/:id" element={<StudioProfilePage />} />

          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/vault" element={<VaultPage />} />
          <Route path="/dashboard/marketplace" element={<MarketplacePage />} />
          <Route path="/dashboard/contracts" element={<ContractsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/discover" element={<Navigate to="/dashboard/search" replace />} />
          <Route path="/dashboard/search" element={<SearchPage />} />
          <Route path="/dashboard/casting-calls" element={<CastingCallsPage />} />
          <Route path="/dashboard/casting-calls/:id" element={<CastingCallProfilePage />} />
          <Route path="/dashboard/chat" element={<ChatPage />} />
          <Route path="/dashboard/messages" element={<ChatPage />} />
          <Route path="/dashboard/feed" element={<FeedPage />} />
          <Route path="/dashboard/actor/:id" element={<ActorProfilePage />} />
          <Route path="/dashboard/studio/:id" element={<StudioProfilePage />} />
          <Route path="/dashboard/agency/:id" element={<AgencyProfilePage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/network" element={<NetworkPage />} />
          <Route path="/dashboard/community/:id" element={<CommunityPage />} />
          <Route path="/dashboard/saved" element={<SavedItemsPage />} />
          <Route path="/dashboard/payments" element={<PaymentsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
