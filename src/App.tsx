import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { AuthProvider } from "./contexts/AuthContext";
import { WalletProvider } from "./contexts/WalletContext";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AccessibilityProvider>
      <AuthProvider>
        <FiatProvider>
          <WalletProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route
                      path="/*"
                      element={
                        <div className="min-h-screen bg-background">
                          <AccessibleNavBar />
                          <main className="pb-20 md:pb-0">
                            <Routes>
                              <Route path="/dashboard" element={<DashboardPage />} />
                              <Route path="/wallet" element={<WalletPage />} />
                              <Route path="/swap" element={<SwapPage />} />
                              <Route path="/staking" element={<StakingPage />} />
                              <Route path="/fiat" element={<FiatPage />} />
                              <Route path="/transactions" element={<TransactionsPage />} />
                              <Route path="/settings" element={<SettingsPage />} />
                              <Route path="*" element={<Navigate to="/" replace />} />
                              {/* 👆 redirects any unknown route back to "/" */}
                            </Routes>
                          </main>
                          <VoiceCommandButton />
                        </div>
                      }
                  />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </WalletProvider>
        </FiatProvider>
      </AuthProvider>
    </AccessibilityProvider>
  </QueryClientProvider>
);

export default App;
