
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Records from "./pages/Records";
import RecordGenerate from "./pages/RecordGenerate";
import RecordDetail from "./pages/RecordDetail";
import InfoPage from "./pages/Info";
import CriminalRecordRequests from "./pages/CriminalRecordRequests";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/records" element={<Records />} />
          <Route path="/records/generate/:id" element={<RecordGenerate />} />
          <Route path="/record/:recordNumber" element={<RecordDetail />} />
          <Route path="/requests" element={<CriminalRecordRequests />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
