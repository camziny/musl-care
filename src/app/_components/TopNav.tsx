"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaInstagramSquare,
  FaLinkedin,
  FaBars,
  FaTimes,
  FaHome,
} from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function TopNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-stone-100 border-b border-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="text-xl font-semibold">
            <Link href="/" className="hover:text-gray-600">
              <FaHome />
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/about" className="hover:text-gray-600">
              About
            </Link>
            <Link href="/caregivers" className="hover:text-gray-600">
              Caregivers
            </Link>
            <Link href="/testimonials" className="hover:text-gray-600">
              Testimonials
            </Link>
            <Link href="/contact" className="hover:text-gray-600">
              Contact
            </Link>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href=""
            target="blank"
            className="hover:text-gray-600"
            aria-label="Facebook"
          >
            <FaSquareFacebook size={24} />
          </Link>
          <Link
            href=""
            target="blank"
            className="hover:text-gray-600"
            aria-label="Instagram"
          >
            <FaInstagramSquare size={24} />
          </Link>
          <Link
            href=""
            target="blank"
            className="hover:text-gray-600"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={24} />
          </Link>
          <SignedOut>
            <SignInButton>
              <button className="bg-slate-600 text-white text-sm font-semibold rounded-md px-6 py-2 shadow-md hover:bg-slate-500 transition-all duration-300 ease-in-out">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4">
          <div className="flex flex-col items-center space-y-4">
            <Link
              href="/"
              className="hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/caregivers"
              className="hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              Caregivers
            </Link>
            <Link
              href="/testimonials"
              className="hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="/contact"
              className="hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="flex space-x-4">
              <Link
                href=""
                className="hover:text-gray-600"
                aria-label="Facebook"
                onClick={() => setIsOpen(false)}
              >
                <FaSquareFacebook size={24} />
              </Link>
              <Link
                href=""
                target="blank"
                className="hover:text-gray-600"
                aria-label="Instagram"
                onClick={() => setIsOpen(false)}
              >
                <FaInstagramSquare size={24} />
              </Link>
              <Link
                href=""
                target="blank"
                className="hover:text-gray-600"
                aria-label="LinkedIn"
                onClick={() => setIsOpen(false)}
              >
                <FaLinkedin size={24} />
              </Link>
            </div>
            <div className="flex flex-row items-center gap-4">
              <SignedOut>
                <SignInButton>
                  <button className="bg-slate-600 text-white text-sm font-semibold rounded-md px-6 py-2 shadow-md hover:bg-slate-500 transition-all duration-300 ease-in-out">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
