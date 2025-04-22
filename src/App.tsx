
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductEssential from "./pages/ProductEssential";
import ProductEssentialPlus from "./pages/ProductEssentialPlus";
import Benefits from "./pages/Benefits";  // Import the Benefits page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Index />} />
          <Route path="/products/total-essential" element={<ProductEssential />} />
          <Route path="/products/total-essential-plus" element={<ProductEssentialPlus />} />
          <Route path="/benefits" element={<Benefits />} />  {/* Use the Benefits component */}
          <Route path="/testimonials" element={<Index />} />
          <Route path="/faq" element={<Index />} />
          <Route path="/about" element={<Index />} />
          <Route path="/contact" element={<Index />} />
          <Route path="/cart" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
