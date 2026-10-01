import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import DashboardAuthGuard from "@/components/dashboard/DashboardAuthGuard";
import DensityWrapper from "@/components/dashboard/DensityWrapper";

export default function DashboardLayout({ children }) {
  return (
    <DashboardAuthGuard>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0d1117]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-gray-50/60 dark:bg-[#0d1117] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/[0.15]">
            <DensityWrapper>
              {children}
            </DensityWrapper>
          </main>
        </div>
      </div>
    </DashboardAuthGuard>
  );
}
