"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon, GithubIcon, GoogleIcon } from "./Icons";
import { signInWithGoogle, signOut, onAuthStateChange, getCurrentUser, User } from "@/lib/auth";

const navLinks = [
  { name: "Works", href: "/#works" },
  { name: "Courses", href: "/courses" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
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

  const headerShell = isAdmin
    ? scrolled
      ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
      : "bg-white border-b border-gray-200"
    : scrolled
      ? "bg-background/90 backdrop-blur-md border-b border-border/50"
      : "bg-transparent border-b border-transparent";

  const linkMuted = isAdmin
    ? "text-gray-600 hover:text-gray-900 transition-colors duration-200"
    : "text-foreground/80 hover:text-gold transition-colors duration-200";
  const linkQuiet = isAdmin
    ? "text-gray-500 hover:text-gray-800 transition-colors"
    : "text-foreground/50 hover:text-foreground/80 transition-colors";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerShell}`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={
              isAdmin
                ? "text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors"
                : "text-xl font-bold text-gold hover:opacity-80 transition-opacity"
            }
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
                  className={
                    isAdmin
                      ? "h-8 w-8 rounded-full border border-gray-200 object-cover"
                      : "h-8 w-8 rounded-full border border-border object-cover"
                  }
                />
                <span className={isAdmin ? "text-sm text-gray-700" : "text-sm text-foreground/80"}>
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
            className={
              isAdmin
                ? "md:hidden text-gray-700 hover:text-gray-900 transition-colors"
                : "md:hidden text-foreground hover:text-gold transition-colors"
            }
            aria-label="Toggle menu"
          >
            {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            className={
              isAdmin
                ? "md:hidden mt-4 pb-4 border-t border-gray-200 pt-4"
                : "md:hidden mt-4 pb-4 border-t border-border pt-4"
            }
          >
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
                <div
                  className={
                    isAdmin
                      ? "flex items-center gap-3 pt-4 border-t border-gray-200"
                      : "flex items-center gap-3 pt-4 border-t border-border"
                  }
                >
                  <Image
                    src={user.avatar_url || "https://www.gravatar.com/avatar/?d=mp"}
                    alt={user.name || "User"}
                    width={40}
                    height={40}
                    className={
                      isAdmin
                        ? "h-10 w-10 rounded-full border border-gray-200 object-cover"
                        : "h-10 w-10 rounded-full border border-border object-cover"
                    }
                  />
                  <div className="flex-1">
                    <p
                      className={
                        isAdmin
                          ? "text-sm font-medium text-gray-900"
                          : "text-sm font-medium text-foreground"
                      }
                    >
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
                  className={
                    isAdmin
                      ? "flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-800 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors text-sm font-medium mt-4 pt-4 border-t border-gray-200"
                      : "flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium mt-4 pt-4 border-t border-border"
                  }
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