"use client";

import { useState, useEffect } from "react";
import { TrendingUp, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { getIssues, upvoteIssue, getCurrentUser } from "@/lib/supabase";
import Header from "@/components/Header";
import Image from "next/image";
import { toast } from "sonner";

export default function ReportedIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [upvotingIssues, setUpvotingIssues] = useState(new Set());

  useEffect(() => {
    loadData();
    checkUser();
  }, []);

  async function checkUser() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }

  async function loadData() {
    try {
      const allIssues = await getIssues();
      setIssues(allIssues);

      setStats({
        active: allIssues.filter((i) => i.status === "reported").length,
        inProgress: allIssues.filter((i) => i.status === "in-progress").length,
        resolved: allIssues.filter((i) => i.status === "resolved").length,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpvote(issueId) {
    if (!user) {
      toast.error("Please sign in to upvote issues");
      return;
    }

    // Prevent multiple clicks
    if (upvotingIssues.has(issueId)) {
      return;
    }

    // Add to upvoting set
    setUpvotingIssues((prev) => new Set([...prev, issueId]));

    try {
      const result = await upvoteIssue(issueId);

      // Reload data to get updated counts
      await loadData();

      // Show appropriate message
      if (result.action === "added") {
        toast.success("Upvoted!");
      } else {
        toast.success("Vote removed");
      }
    } catch (error) {
      console.error("Error upvoting:", error);
      toast.error("Failed to update vote");
    } finally {
      // Remove from upvoting set
      setUpvotingIssues((prev) => {
        const next = new Set(prev);
        next.delete(issueId);
        return next;
      });
    }
  }

  const statCards = [
    {
      icon: AlertCircle,
      label: "Active Issues",
      value: stats.active,
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      icon: Clock,
      label: "In Progress",
      value: stats.inProgress,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      icon: CheckCircle,
      label: "Resolved",
      value: stats.resolved,
      color: "text-green-500",
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50">
      <Header />

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Community Issues
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse and support issues reported by your community members
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <div
                className={`${stat.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}
              >
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">
              All Reported Issues
            </h3>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="text-center py-12">
                <Image
                  src="/ccLoading.gif"
                  alt="Loading"
                  width={100}
                  height={100}
                  className="mx-auto"
                />
                <p className="text-gray-600 mt-4">Loading issues...</p>
              </div>
            ) : issues.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="text-gray-400 mx-auto mb-4" size={48} />
                <p className="text-gray-600">
                  No issues reported yet. Be the first!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          {issue.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {issue.location_name || "Location not specified"}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {issue.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-3 ${
                          issue.status === "reported"
                            ? "bg-orange-100 text-orange-700"
                            : issue.status === "in-progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {issue.status.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs px-3 py-1 bg-white rounded-full border border-gray-200">
                        {issue.category}
                      </span>
                      <button
                        onClick={() => handleUpvote(issue.id)}
                        disabled={upvotingIssues.has(issue.id)}
                        className={`flex items-center space-x-1 px-3 py-1 bg-white rounded-full border border-gray-200 transition ${
                          upvotingIssues.has(issue.id)
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-green-50 hover:border-green-300 cursor-pointer"
                        }`}
                      >
                        <TrendingUp
                          size={16}
                          className={`text-green-600 ${
                            upvotingIssues.has(issue.id) ? "animate-pulse" : ""
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {issue.upvotes}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
