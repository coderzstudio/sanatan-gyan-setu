import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import AboutUs from "./pages/AboutUs";
import Report from "./pages/Report";
import NaamJap from "./pages/NaamJap";
import Store from "./pages/Store";
import Mantras from "./pages/Mantras";
import MantraDetail from "./pages/MantraDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/books" element={<Books />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/mantras" element={<Mantras />} />
          <Route path="/mantra/:id" element={<MantraDetail />} />
          <Route path="/naam-jap" element={<NaamJap />} />
          <Route path="/store" element={<Store />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/report" element={<Report />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
