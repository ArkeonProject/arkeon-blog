import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import GuiaDashboardPage from "@/pages/guia-junior/DashboardPage";

export default function DashboardProtectedPage() {
  return (
    <ProtectedRoute requiredProduct="guia_junior" allowOpenSourceBypass>
      <GuiaDashboardPage />
    </ProtectedRoute>
  );
}
