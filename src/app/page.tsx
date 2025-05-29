import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AppLogo } from "@/components/layout/AppLogo";
import { LogIn, UserPlus } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto px-4 py-6">
        <AppLogo />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Welcome to <span className="text-primary">DormNexus</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Your all-in-one solution for seamless hostel management. Streamline operations, enhance student experience, and maintain control with ease.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/login">
                <LogIn className="mr-2 h-5 w-5" /> Login
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">
                <UserPlus className="mr-2 h-5 w-5" /> Register
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} DormNexus. All rights reserved.
      </footer>
    </div>
  );
}
