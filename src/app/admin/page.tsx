"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, BarChart3, Target, Settings, Mail, Download, Search, ChevronLeft, ChevronRight, LogOut,
  Loader2, Plus, Save, Send, Menu, X, Upload
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import SignupChart from "@/components/signup-chart";

type Tab = "users" | "stats" | "milestones" | "settings" | "email";

interface WaitlistUser {
  id: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  referral_code: string;
  referral_count: number;
  position: number;
  joined_at: string;
  source: string;
}

interface Milestone {
  id: string;
  name: string;
  description: string | null;
  target_count: number;
  reached_at: string | null;
}

interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
}

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "users", label: "Users", icon: Users },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "milestones", label: "Milestones", icon: Target },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "email", label: "Email", icon: Mail },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Users state
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [userTotal, setUserTotal] = useState(0);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);

  // Stats state
  const [adminStats, setAdminStats] = useState<Record<string, unknown> | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Milestones state
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState({ name: "", description: "", target_count: 0 });

  // Settings state
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Email state
  const [emailForm, setEmailForm] = useState({ subject: "", body: "" });
  const [emailSending, setEmailSending] = useState(false);

  // Import state
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    imported: number;
    skipped: number;
    total: number;
  } | null>(null);

  // Client-side auth check - MUST come after all useState calls
  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      setIsReady(true);
    }
  }, [router]);

  // Show loading before auth check
  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-[#c9a54e]" />
      </div>
    );
  }

  // Data fetching effects - come after all useState and after auth check
  useEffect(() => {
    fetchUsers();
    fetchSettings();
    fetchMilestones();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [userPage, userSearch]);

  async function fetchUsers() {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(userPage),
        limit: "20",
        search: userSearch,
        sort_by: "joined_at",
        sort_order: "desc",
      });
      const res = await fetch(`/api/admin/users?${params}`);
      
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      
      const data = await res.json();
      
      // Check for API-level errors
      if (!data.success) {
        console.error("Failed to fetch users:", data.error);
        toast.error(data.error || "Failed to load users");
        setUsers([]);
        return;
      }
      
      if (data.users) {
        setUsers(data.users);
        setUserTotal(data.total);
        setUserTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
      toast.error("Network error loading users");
    } finally {
      setUsersLoading(false);
    }
  }

  async function fetchStats() {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      
      if (!data.success) {
        console.error("Failed to fetch stats:", data.error);
        return;
      }
      
      setAdminStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }

  async function fetchMilestones() {
    try {
      const res = await fetch("/api/admin/milestones");
      const data = await res.json();
      
      if (!data.success) {
        console.error("Failed to fetch milestones:", data.error);
        return;
      }
      
      if (data.milestones) setMilestones(data.milestones);
    } catch (err) {
      console.error("Failed to load milestones:", err);
    }
  }

  async function fetchSettings() {
    setSettingsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      
      if (!data.success) {
        console.error("Failed to fetch settings:", data.error);
        toast.error(data.error || "Failed to load settings");
        return;
      }
      
      if (data.settings) {
        const map: Record<string, string> = {};
        data.settings.forEach((s: AdminSetting) => {
          map[s.setting_key] = s.setting_value || "";
        });
        setSettings(map);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      toast.error("Network error loading settings");
    } finally {
      setSettingsLoading(false);
    }
  }

  function handleExport() {
    window.open("/api/admin/export", "_blank");
  }

  async function handleImportCsv(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImportResult({
          imported: data.imported,
          skipped: data.skipped,
          total: data.total,
        });
        toast.success(`Imported ${data.imported} users, skipped ${data.skipped}`);
        fetchUsers();
      } else {
        toast.error(data.error || "Import failed");
      }
    } catch {
      toast.error("Network error during import");
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = "";
    }
  }

  async function handleCreateMilestone() {
    if (!newMilestone.name || !newMilestone.target_count) {
      toast.error("Name and target count required");
      return;
    }
    try {
      const res = await fetch("/api/admin/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMilestone),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Milestone created");
        setNewMilestone({ name: "", description: "", target_count: 0 });
        fetchMilestones();
      } else {
        toast.error(data.error || "Failed to create");
      }
    } catch {
      toast.error("Network error");
    }
  }

  async function handleSaveSettings() {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Settings saved");
      } else {
        toast.error("Failed to save");
      }
    } catch {
      toast.error("Network error");
    }
  }

  async function handleSendEmail() {
    if (!emailForm.subject || !emailForm.body) {
      toast.error("Subject and body required");
      return;
    }
    setEmailSending(true);
    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Email sent to ${data.sent_count} users`);
        setEmailForm({ subject: "", body: "" });
      } else {
        toast.error(data.error || "Failed to send");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setEmailSending(false);
    }
  }

  function handleLogout() {
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  }

  function handleTabSwitch(tab: Tab) {
    setActiveTab(tab);
    setSidebarOpen(false);
    if (tab === "stats" && !adminStats) fetchStats();
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card p-4 transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold text-foreground">Pantero</Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <span className="font-display text-sm font-semibold text-foreground">Admin Dashboard</span>
          <div className="w-6" />
        </div>

        <div className="p-6 md:p-8">
          {/* Users Tab */}
          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">Users</h1>
                  <p className="text-sm text-muted-foreground">{userTotal.toLocaleString()} total users</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={userSearch}
                      onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                      className="w-48 pl-9"
                    />
                  </div>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                  <label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImportCsv}
                      className="hidden"
                      disabled={importing}
                    />
                    <Button variant="outline" asChild disabled={importing}>
                      <span>
                        {importing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Import
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Referrals</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center">
                          <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-mono text-xs">{u.position}</TableCell>
                          <TableCell className="text-sm font-medium">{u.full_name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{u.whatsapp_number}</TableCell>
                          <TableCell className="text-sm">{u.referral_count}</TableCell>
                          <TableCell className="font-mono text-xs text-primary">{u.referral_code}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(u.joined_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {userTotalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={userPage <= 1}
                    onClick={() => setUserPage(userPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {userPage} of {userTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={userPage >= userTotalPages}
                    onClick={() => setUserPage(userPage + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Import Result */}
              {importResult && (
                <div className="mt-4 rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-muted-foreground">
                    Last import: <span className="font-semibold text-foreground">{importResult.imported}</span> imported,{" "}
                    <span className="font-semibold text-foreground">{importResult.skipped}</span> skipped (duplicates),{" "}
                    <span className="font-semibold text-foreground">{importResult.total}</span> total rows
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Analytics</h1>
              {statsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : adminStats ? (
                <div className="space-y-6">
                  {/* Overview cards */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: "Total Users", value: adminStats.total_users as number },
                      { label: "Today", value: adminStats.signups_today as number },
                      { label: "This Week", value: adminStats.signups_week as number },
                      { label: "This Month", value: adminStats.signups_month as number },
                    ].map((card) => (
                      <div key={card.label} className="rounded-xl border border-border bg-card p-5">
                        <p className="text-sm text-muted-foreground">{card.label}</p>
                        <p className="mt-1 font-display text-3xl font-bold text-foreground">
                          {(card.value ?? 0).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <SignupChart />

                  {/* Source breakdown */}
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Source Breakdown</h3>
                    <div className="space-y-2">
                      {Object.entries(adminStats.source_breakdown as Record<string, number> || {}).map(([src, count]) => (
                        <div key={src} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{src}</span>
                          <span className="font-mono font-semibold text-foreground">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top referrers */}
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Top Referrers</h3>
                    {(adminStats.top_referrers as Array<Record<string, unknown>>)?.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No referrers yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {(adminStats.top_referrers as Array<Record<string, unknown>> || []).map((r, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{r.full_name as string}</span>
                            <span className="font-mono font-semibold text-primary">{r.referral_count as number} referrals</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Button onClick={fetchStats}>Load Stats</Button>
              )}
            </motion.div>
          )}

          {/* Milestones Tab */}
          {activeTab === "milestones" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Milestones</h1>

              {/* Create milestone */}
              <div className="mb-6 rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Create Milestone</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input
                    placeholder="Name"
                    value={newMilestone.name}
                    onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                  />
                  <Input
                    placeholder="Description"
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Target"
                      value={newMilestone.target_count || ""}
                      onChange={(e) => setNewMilestone({ ...newMilestone, target_count: parseInt(e.target.value) || 0 })}
                    />
                    <Button onClick={handleCreateMilestone}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* List milestones */}
              <div className="space-y-3">
                {milestones.map((m) => (
                  <div key={m.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display font-semibold text-foreground">{m.name}</p>
                        {m.description && <p className="text-sm text-muted-foreground">{m.description}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold text-primary">{m.target_count}</p>
                        {m.reached_at && <p className="text-xs text-green-400">Reached</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-6 flex items-center justify-between">
                <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>

              {settingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(settings).map(([key, value]) => (
                    <div key={key} className="rounded-xl border border-border bg-card p-4">
                      <label className="mb-2 block text-sm font-medium text-muted-foreground">{key}</label>
                      <Input
                        value={value}
                        onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Email Tab */}
          {activeTab === "email" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Send Bulk Email</h1>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">Subject</label>
                    <Input
                      placeholder="Email subject..."
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">Body (HTML supported)</label>
                    <Textarea
                      placeholder="Email body content..."
                      value={emailForm.body}
                      onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                      className="min-h-[200px]"
                    />
                  </div>
                  <Button onClick={handleSendEmail} disabled={emailSending}>
                    {emailSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send to All Users
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
