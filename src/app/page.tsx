import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AnalyticsEventsProvider } from "@/components/providers/AnalyticsEventsProvider";

export default function Home() {
  return (
    <ProtectedRoute>
    <AnalyticsEventsProvider initialDateRange="24hours" initialEvents={[]}>
    <div className="p-3 flex flex-col gap-6">
      <Header/>
      <Dashboard/>
    </div>
    </AnalyticsEventsProvider>
    </ProtectedRoute>
  );
}
