import { TopNav } from "@/components/customer/TopNav";
import { MobileNav } from "@/components/customer/MobileNav";

export default async function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <TopNav />
            <main className="flex-1 pb-16 md:pb-0">
                {children}
            </main>
            <MobileNav />
        </div>
    );
}
