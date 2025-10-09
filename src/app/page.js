import { Camera, Users, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";
import { Earth } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50">
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-bold text-gray-900 mb-6">
            <span className="text-green-700">Report.</span>{" "}
            <span className="text-green-400">Track.</span>{" "}
            <span className="text-green-600">Resolve.</span>
          </h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with your community and local authorities to solve civic
            issues faster than ever before.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/report"
              className="px-8 py-4 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Report an Issue
            </Link>
            <Link
              href="/issues"
              className="px-8 py-4 bg-white text-green-600 text-lg rounded-lg hover:bg-gray-50 transition font-semibold border-2 border-green-600"
            >
              Browse Issues
            </Link>
          </div>
        </div>
      </section>

      {/*  Banner */}
      <section className="bg-gradient-to-r from-green-800 via-green-500 to-green-700 py-4 overflow-hidden">
        <div className="flex items-center whitespace-nowrap animate-marquee">
          <span className="text-white text-lg font-semibold mx-4">
            Report Issues in Your Area
          </span>
          <Earth
            className="text-white mx-4 flex-shrink-0"
            size={15}
          />
          <span className="text-white text-lg font-semibold mx-4">
            Join The Pro-Active Citizen Movement
          </span>
          <Earth
            className="text-white mx-4 flex-shrink-0"
            size={15}
          />
          <span className="text-white text-lg font-semibold mx-4">
            Upvote Issues That Matter
          </span>
          <Earth
            className="text-white mx-4 flex-shrink-0"
            size={15}
          />
          <span className="text-white text-lg font-semibold mx-4">
            Real-Time Updates
          </span>
          <Earth
            className="text-white mx-4 flex-shrink-0"
            size={15}
          />
          <span className="text-white text-lg font-semibold mx-4">
            Report Issues • Track Progress • Make a Difference
          </span>
          <Earth
            className="text-white mx-4 flex-shrink-0"
            size={15}
          />
          <span className="text-white text-lg font-semibold mx-4">
            Join The Pro-Active Citizen Movement
          </span>
          <Earth
            className="text-white mx-4 flex-shrink-0"
            size={15}
          />
          <span className="text-white text-lg font-semibold mx-4">
            Upvote Issues That Matter
          </span>
          <Earth
            className="text-white mx-4 flex-shrink-0"
            size={15}
          />
          <span className="text-white text-lg font-semibold mx-4">
            Real-Time Updates
          </span>
          <Earth
            className="text-white mx-4 flex-shrink-0"
            size={15}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-10 bg-white">
        <h3 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Why CivicConnect?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-8">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="text-green-600" size={40} />
            </div>
            <h4 className="text-2xl font-semibold text-gray-900 mb-4">
              Easy Reporting
            </h4>
            <p className="text-gray-600 text-lg">
              Snap a photo, add location, and submit in seconds. Reporting civic
              issues has never been easier.
            </p>
          </div>
          <div className="text-center p-8">
            <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-purple-600" size={40} />
            </div>
            <h4 className="text-2xl font-semibold text-gray-900 mb-4">
              Community Driven
            </h4>
            <p className="text-gray-600 text-lg">
              Upvote issues to prioritize what matters most to your community
              and track their progress.
            </p>
          </div>
          <div className="text-center p-8">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h4 className="text-2xl font-semibold text-gray-900 mb-4">
              Real-Time Updates
            </h4>
            <p className="text-gray-600 text-lg">
              Track progress from report to resolution with real-time status
              updates and notifications.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-green-800 via-green-500 to-green-700 rounded-2xl p-16 text-center text-white">
          <h3 className="text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h3>
          <p className="text-2xl mb-10 opacity-90">
            Join thousands of citizens improving their communities
          </p>
          <Link
            href="/report"
            className="inline-block px-10 py-5 bg-white text-green-600 text-lg rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Report Your First Issue
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center">
            &copy; {new Date().getFullYear()} CivicConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
