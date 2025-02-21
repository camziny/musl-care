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
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/caregivers", label: "Caregivers" },
  { href: "/jobs", label: "Jobs" },
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
          ? "bg-white/90 backdrop-blur-md shadow-sm border-gray-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left side - Logo and Nav Links */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-xl font-semibold text-slate-800 hover:text-slate-600 transition-colors"
            >
              <FaHome className="text-2xl" />
            </Link>
            
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Social and Auth */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="blank"
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                  aria-label={label}
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>

            <SignedOut>
              <SignInButton>
                <button className="bg-slate-800 text-white text-sm font-medium rounded-full px-6 py-2 hover:bg-slate-700 transition-all duration-200 shadow-sm">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center space-x-4">
                {user && (
                  <Link
                    href={`/caregiver/${user.id}/profile`}
                    className="bg-slate-800 text-white text-sm font-medium rounded-full px-6 py-2 hover:bg-slate-700 transition-all duration-200 shadow-sm"
                  >
                    My Profile
                  </Link>
                )}
                <UserButton />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-600 hover:text-slate-900 transition-colors"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-50 border-t border-gray-200"
          >
            <div className="container mx-auto px-4 py-6 space-y-6">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="flex justify-center space-x-6">
                {socialLinks.map(({ Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-slate-500 hover:text-slate-700 transition-colors"
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
                    <button className="bg-slate-800 text-white text-sm font-medium rounded-full px-6 py-2 hover:bg-slate-700 transition-all duration-200 shadow-sm">
                      Sign In
                    </button>
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
