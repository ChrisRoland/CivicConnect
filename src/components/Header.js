"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Menu, X, Shield } from "lucide-react";
import { getCurrentUser, signOut } from "@/lib/supabase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "../../public/assets/ccLogo.png";

export default function Header() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);

    // Check if user is admin from user metadata
    if (currentUser) {
      // Check user_metadata.role or app_metadata.role
      const role =
        currentUser.user_metadata?.role || currentUser.app_metadata?.role;
      setIsAdmin(role === "admin");
    }
  }

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className=" rounded-lg">
              <Image src={Logo} width={70} height={70} alt="Logo" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-gray-900">CivicConnect</h1>
              <p className="text-xs text-gray-500">Empowering Communities</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-xl font-bold text-gray-900">CivicConnect</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Link
              href="/issues"
              className={`px-4 py-2 transition-all duration-200 ${
                isActive("/issues")
                  ? " text-green-700 font-semibold border-b-2 border-green-600"
                  : "text-gray-700 hover:border-b-2"
              }`}
            >
              Issues
            </Link>
            <Link
              href="/map"
              className={`px-4 py-2 transition-all duration-200-all duration-200 ${
                isActive("/map")
                  ? " text-green-700 font-semibold border-b-2 border-green-600"
                  : "text-gray-700 hover:border-b-2"
              }`}
            >
              Map
            </Link>

            {/* Admin Button - Only visible to admins */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`px-4 py-2 transition-all duration-200 flex items-center space-x-1 ${
                  isActive("/admin")
                    ? "bg-purple-100 text-purple-700 font-semibold border-b-2 border-purple-600"
                    : "text-purple-700 bg-purple-50 hover:bg-purple-100"
                }`}
                title="Admin Dashboard"
              >
                <span>Admin</span>
              </Link>
            )}

            {user ? (
              <>
                <span className="text-sm bg-green-950 rounded-full text-white font-bold py-1 px-2 uppercase">
                  {user.email.trim().slice(0, 5) || "Anonymous"}
                </span>
                <button
                  onClick={async () => {
                    await signOut();
                    window.location.reload();
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/report"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Report</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 space-y-2 border-t border-gray-200 pt-4">
            <Link
              href="/issues"
              className={`block px-4 py-2 rounded-lg transition ${
                isActive("/issues")
                  ? " text-green-700 font-semibold border-l-4 border-green-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Reported Issues
            </Link>
            <Link
              href="/map"
              className={`block px-4 py-2 rounded-lg transition ${
                isActive("/map")
                  ? "bg-green-50 text-green-700 font-semibold border-l-4 border-green-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              View Map
            </Link>

            {/* Admin Button - Mobile */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`block px-4 py-2 rounded-lg transition ${
                  isActive("/admin")
                    ? "bg-purple-100 text-purple-700 font-semibold border-l-4 border-purple-600"
                    : "text-purple-700 bg-purple-50 hover:bg-purple-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <span>Admin Dashboard</span>
                </div>
              </Link>
            )}

            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-600 border-t border-gray-200">
                  Signed in as: {user.email}
                </div>
                <button
                  onClick={async () => {
                    await signOut();
                    window.location.reload();
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
            <Link
              href="/report"
              className="block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Report an Issue
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
