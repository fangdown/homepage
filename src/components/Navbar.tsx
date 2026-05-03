"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuIcon, XIcon, GithubIcon, GoogleIcon } from "./Icons";
import { signInWithGoogle, signOut, onAuthStateChange, getCurrentUser, User } from "@/lib/auth";

const navLinks = [
  { name: "Works", href: "/#works" },
  { name: "Courses", href: "/courses" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初始检查已有 session
    getCurrentUser().then((user) => {
      setUser(user)
      setIsLoading(false)
    })

    // 监听状态变化
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user)
      setIsLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Sign in failed:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const headerShell = scrolled
    ? "bg-background/90 backdrop-blur-md border-b border-border/50"
    : "bg-transparent border-b border-transparent";

  const linkMuted = "text-foreground/80 hover:text-gold transition-colors duration-200";
  const linkQuiet = "text-foreground/50 hover:text-foreground/80 transition-colors";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerShell}`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-gold hover:opacity-80 transition-opacity"
          >
            Fangdu
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={linkMuted}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://github.com/fangdown"
              target="_blank"
              rel="noopener noreferrer"
              className={linkMuted}
            >
              <GithubIcon size={20} />
            </a>

            {/* Auth Section */}
            {isLoading ? (
              <div className="w-8 h-8" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Image
                  src={user.avatar_url || "https://www.gravatar.com/avatar/?d=mp"}
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border border-border object-cover"
                />
                <span className="text-sm text-foreground/80">
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className={`text-xs ${linkQuiet}`}
                >
                  退出
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <GoogleIcon size={18} />
                登录
              </button>
            )}
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
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={linkMuted}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://github.com/fangdown"
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkMuted} flex items-center gap-2`}
              >
                <GithubIcon size={20} />
                GitHub
              </a>

              {/* Mobile Auth */}
              {isLoading ? (
                <div className="w-8 h-8" />
              ) : user ? (
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <Image
                    src={user.avatar_url || "https://www.gravatar.com/avatar/?d=mp"}
                    alt={user.name || "User"}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border border-border object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {user.name || user.email}
                    </p>
                    <button
                      onClick={handleSignOut}
                      className={`text-xs ${linkQuiet}`}
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium mt-4 pt-4 border-t border-border"
                >
                  <GoogleIcon size={18} />
                  使用 Google 登录
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
