import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { AuthProvider } from "./contexts/AuthContext";
import { FiatProvider } from "./contexts/FiatContext";
import { VoiceCommandButton } from "./components/VoiceCommandButton";
import { AccessibleNavBar } from "./components/AccessibleNavBar";
import { DashboardPage } from "./pages/DashboardPage";
import { WalletPage } from "./pages/WalletPage";
import { SwapPage } from "./pages/SwapPage";
import { StakingPage } from "./pages/StakingPage";
import { FiatPage } from "./pages/FiatPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { LoginPage } from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout component for authenticated routes
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-background">
      <AccessibleNavBar />
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      <VoiceCommandButton />
    </div>
);

const App = () => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AccessibilityProvider>
          <AuthProvider>
            <FiatProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Authenticated routes with layout */}
                    <Route path="/dashboard" element={
                      <AuthenticatedLayout>
                        <DashboardPage />
                      </AuthenticatedLayout>
                    } />
                    <Route path="/wallet" element={
                      <AuthenticatedLayout>
                        <WalletPage />
                      </AuthenticatedLayout>
                    } />
                    <Route path="/swap" element={
                      <AuthenticatedLayout>
                        <SwapPage />
                      </AuthenticatedLayout>
                    } />
                    <Route path="/staking" element={
                      <AuthenticatedLayout>
                        <StakingPage />
                      </AuthenticatedLayout>
                    } />
                    <Route path="/fiat" element={
                      <AuthenticatedLayout>
                        <FiatPage />
                      </AuthenticatedLayout>
                    } />
                    <Route path="/transactions" element={
                      <AuthenticatedLayout>
                        <TransactionsPage />
                      </AuthenticatedLayout>
                    } />
                    <Route path="/settings" element={
                      <AuthenticatedLayout>
                        <SettingsPage />
                      </AuthenticatedLayout>
                    } />

                    {/* 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TooltipProvider>
            </FiatProvider>
          </AuthProvider>
        </AccessibilityProvider>
      </BrowserRouter>
    </QueryClientProvider>
);

export default App;