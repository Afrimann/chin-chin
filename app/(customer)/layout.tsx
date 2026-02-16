import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/customer/TopNav";
import { MobileNav } from "@/components/customer/MobileNav";

export default async function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    // if (!userId) {
    //     redirect("/auth/sign-in");
    // }

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
