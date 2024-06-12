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

export function TopNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-100 border-b p-4">
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
            <Link href="/contact" className="hover:text-gray-600">
              Contact
            </Link>
          </div>
        </div>
        <div className="hidden md:flex space-x-4">
          <Link
            href="https://www.facebook.com/route9landscapeproducts/"
            target="blank"
            className="hover:text-gray-600"
            aria-label="Facebook"
          >
            <FaSquareFacebook size={24} />
          </Link>
          <Link
            href="https://www.instagram.com/route9landscapeproducts/"
            target="blank"
            className="hover:text-gray-600"
            aria-label="Instagram"
          >
            <FaInstagramSquare size={24} />
          </Link>
          <Link
            href="https://www.linkedin.com/company/rosado-landscape-supplies/"
            target="blank"
            className="hover:text-gray-600"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={24} />
          </Link>
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
              target="blank"
              className="hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              target="blank"
              className="hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              target="blank"
              className="hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/route9landscapeproducts/"
                className="hover:text-gray-600"
                aria-label="Facebook"
                onClick={() => setIsOpen(false)}
              >
                <FaSquareFacebook size={24} />
              </Link>
              <Link
                href="https://www.instagram.com/route9landscapeproducts/"
                target="blank"
                className="hover:text-gray-600"
                aria-label="Instagram"
                onClick={() => setIsOpen(false)}
              >
                <FaInstagramSquare size={24} />
              </Link>
              <Link
                href="https://www.linkedin.com/company/rosado-landscape-supplies/"
                target="blank"
                className="hover:text-gray-600"
                aria-label="LinkedIn"
                onClick={() => setIsOpen(false)}
              >
                <FaLinkedin size={24} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
