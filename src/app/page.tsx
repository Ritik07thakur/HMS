
"use client"; // For useEffect and useState for footer year

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AppLogo } from "@/components/layout/AppLogo";
import { LogIn, UserPlus, Wifi, Utensils, BookOpen, ShieldCheck, Dumbbell, Tv2, WashingMachine, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // For mobile menu
import { useEffect, useState } from "react";
import { StaticChatbot } from "@/components/chatbot/StaticChatbot"; // Import the chatbot

// Header Nav Links
const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#facilities", label: "Facilities" },
  { href: "#contact", label: "Contact" },
];

// Facility Items
const facilities = [
  { name: "High-Speed Wi-Fi", description: "Seamless internet access throughout the hostel.", icon: Wifi, dataAiHint: "internet signal" },
  { name: "Laundry Service", description: "Convenient and hygienic laundry facilities.", icon: WashingMachine, dataAiHint: "washing machine" },
  { name: "Study Room", description: "Quiet and well-lit space for focused learning.", icon: BookOpen, dataAiHint: "open book" },
  { name: "24/7 Security", description: "Ensuring a safe and secure environment for all residents.", icon: ShieldCheck, dataAiHint: "security badge" },
  { name: "Gymnasium", description: "Equipped with modern fitness machines.", icon: Dumbbell, dataAiHint: "fitness weights" },
  { name: "Common Room", description: "A place to relax, socialize, and unwind.", icon: Tv2, dataAiHint: "television lounge" },
];

// Mess Timings
const messTimings = [
  { meal: "Breakfast", time: "8:00 AM – 9:00 AM", icon: Utensils },
  { meal: "Lunch", time: "1:00 PM – 2:00 PM", icon: Utensils },
  { meal: "Dinner", time: "7:00 PM – 8:00 PM", icon: Utensils },
];

export default function HomePage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header id="home" className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <AppLogo />
          <nav className="hidden space-x-6 md:flex">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-x-2 md:flex md:gap-x-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">
                <UserPlus className="mr-2 h-4 w-4" /> Register
              </Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-6">
                <nav className="flex flex-col space-y-4 mt-6">
                  {navLinks.map((link) => (
                    <Link key={link.label} href={link.href} className="text-lg font-medium text-foreground transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 flex flex-col space-y-3">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" /> Login
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/register">
                      <UserPlus className="mr-2 h-4 w-4" /> Register
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Manage Your <span className="text-primary">Hostel Life</span> with Ease
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              From registration to mess schedules – everything in one place.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="px-10 py-6 text-lg">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Mess Timings Section */}
        <section id="mess-timings" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Mess Timings</h2>
              <p className="mt-2 text-muted-foreground">Delicious and timely meals to keep you energized.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {messTimings.map((timing) => (
                <div key={timing.meal} className="rounded-xl border bg-card p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <timing.icon className="h-10 w-10 text-primary mr-4" />
                    <h3 className="text-2xl font-semibold text-card-foreground">{timing.meal}</h3>
                  </div>
                  <p className="text-xl text-muted-foreground">{timing.time}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section id="facilities" className="py-16 md:py-24 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Facilities</h2>
              <p className="mt-2 text-muted-foreground">Comfort and convenience at your fingertips.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {facilities.map((facility) => (
                <div key={facility.name} className="rounded-xl border bg-card p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center mb-3">
                     <facility.icon className="h-8 w-8 text-primary mr-4" />
                     <h3 className="text-xl font-semibold text-card-foreground">{facility.name}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{facility.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">About DormNexus</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Our Hostel Management System, DormNexus, is designed to simplify the complexities of hostel administration and enhance the living experience for students. 
                We provide a centralized platform for managing registrations, room allocations, fee payments, attendance, mess schedules, and much more. 
                Our goal is to create an efficient, transparent, and user-friendly environment for students, wardens, and administrators alike.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="py-10 border-t bg-muted/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">For any queries, please contact hostel administration at <a href="mailto:contact@dormnexus.example.com" className="text-primary hover:underline">contact@dormnexus.example.com</a>.</p>
          {currentYear && <p>© {currentYear} DormNexus. All rights reserved.</p>}
          {!currentYear && <p>© DormNexus. All rights reserved.</p>}
        </div>
      </footer>
      
      <StaticChatbot /> {/* Add chatbot here */}
    </div>
  );
}

