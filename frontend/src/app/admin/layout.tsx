import { Sidebar } from "@/src/components/admin/Sidebar";
import { Header } from "@/src/components/admin/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard - Smart Meeting Assistant",
    description: "Administrative control panel for managing users and interviews.",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
