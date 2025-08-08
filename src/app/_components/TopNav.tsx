"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaInstagramSquare,
  FaLinkedin,
  FaBars,
  FaTimes,
  FaHome,
} from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/caregivers", label: "Caregivers" },
  { href: "/jobs", label: "Jobs" },
  { href: "/forum", label: "Forum" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { Icon: FaSquareFacebook, href: "", label: "Facebook" },
  { Icon: FaInstagramSquare, href: "", label: "Instagram" },
  { Icon: FaLinkedin, href: "", label: "LinkedIn" },
];

export function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm border-border"
          : "bg-background/60 backdrop-blur-md border-border/60"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-xl font-semibold text-primary hover:text-primary transition-colors"
            >
              <FaHome className="text-2xl" />
            </Link>
            
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="blank"
                  className="text-secondary/70 hover:text-secondary transition-colors"
                  aria-label={label}
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>

            <SignedOut>
              <SignInButton>
                <Button className="rounded-full px-6 py-2">Sign In</Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center space-x-4">
                {user && (
                  <Link href={`/caregiver/${user.id}/profile`}>
                    <Button className="rounded-full px-6 py-2">My Profile</Button>
                  </Link>
                )}
                <UserButton />
              </div>
            </SignedIn>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-secondary hover:text-primary transition-colors"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/80 backdrop-blur-md border-t border-border/60"
          >
            <div className="container mx-auto px-4 py-6 space-y-6">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <SignedIn>
                </SignedIn>
              </div>

              <div className="flex justify-center space-x-6">
                {socialLinks.map(({ Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-secondary/70 hover:text-secondary transition-colors"
                    aria-label={label}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} />
                  </Link>
                ))}
              </div>

              <div className="flex justify-center">
                <SignedOut>
                  <SignInButton>
                    <Button className="rounded-full px-6 py-2">Sign In</Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
