"use client";

import { useState, useEffect } from "react";
import { MenuIcon, XIcon, GithubIcon } from "./Icons";

const navLinks = [{ name: "Works", href: "#works" }];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/50"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="text-xl font-bold text-gold hover:opacity-80 transition-opacity"
          >
            Fangdu
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground/80 hover:text-gold transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://github.com/fangdown"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/80 hover:text-gold transition-colors duration-200"
            >
              <GithubIcon size={20} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground hover:text-gold transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-foreground/80 hover:text-gold transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="https://github.com/fangdown"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-gold transition-colors duration-200 flex items-center gap-2"
              >
                <GithubIcon size={20} />
                GitHub
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
