"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  File,
} from "lucide-react";
import { getIssues, updateIssueStatus } from "@/lib/supabase";
import Header from "@/components/Header";
import { toast } from "sonner";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    reported: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [issues, statusFilter]);

  async function loadIssues() {
    try {
      const data = await getIssues();
      setIssues(data);

      setStats({
        total: data.length,
        reported: data.filter((i) => i.status === "reported").length,
        inProgress: data.filter((i) => i.status === "in-progress").length,
        resolved: data.filter((i) => i.status === "resolved").length,
      });
    } catch (error) {
      console.error("Error loading issues:", error);
    } finally {
      setLoading(false);
    }
  }

  function applyFilter() {
    if (statusFilter === "all") {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter((i) => i.status === statusFilter));
    }
  }

  async function handleStatusChange(issueId, newStatus) {
    try {
      await updateIssueStatus(issueId, newStatus);
      loadIssues();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  }

  const statCards = [
    {
      icon: File,
      label: "Total Issues",
      value: stats.total,
      color: "text-gray-700",
      bg: "bg-gray-100",
      filter: "all",
    },
    {
      icon: AlertCircle,
      label: "Reported",
      value: stats.reported,
      color: "text-orange-600",
      bg: "bg-orange-100",
      filter: "reported",
    },
    {
      icon: Clock,
      label: "In Progress",
      value: stats.inProgress,
      color: "text-blue-600",
      bg: "bg-blue-100",
      filter: "in-progress",
    },
    {
      icon: CheckCircle,
      label: "Resolved",
      value: stats.resolved,
      color: "text-green-600",
      bg: "bg-green-100",
      filter: "resolved",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => (
            <button
              key={idx}
              onClick={() => setStatusFilter(stat.filter)}
              className={`text-left p-6 rounded-xl shadow-sm border-2 transition hover:shadow-md ${
                statusFilter === stat.filter
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
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
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {statusFilter === "all"
                ? "All Issues"
                : `${statusFilter.replace("-", " ")} Issues`}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredIssues.length} of {stats.total} total issues
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Image
                src="/ccLoading.gif"
                alt="Loading"
                width={100}
                height={100}
                className="mx-auto"
              />
              <p className="text-gray-600">Loading issues...</p>
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-gray-600">No issues found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Issue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Votes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reported
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {issue.title}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-1">
                            {issue.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {issue.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {issue.location_name || "Not specified"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-gray-700">
                          <TrendingUp size={16} />
                          <span className="font-semibold">{issue.upvotes}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>
                            {formatDistanceToNow(new Date(issue.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            issue.status === "reported"
                              ? "bg-orange-100 text-orange-700"
                              : issue.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {issue.status.replace("in-", "")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={issue.status}
                          onChange={(e) =>
                            handleStatusChange(issue.id, e.target.value)
                          }
                          className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="reported">Reported</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
