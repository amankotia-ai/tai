import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/store';
import {
    ShieldCheck,
    Vault,
    FileText,
    ArrowUpRight,
    CaretRight,
    Pulse,
    TrendUp,
    CloudArrowUp,
    PenNib
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

// Mock recently joined users for demonstration
const recentlyJoined = [
    { name: 'Orlando Diggs', time: '5 hours ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { name: 'Olivia Rhye', time: '19 hours ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { name: 'Andi Lane', time: '22 hours ago', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];

export default function DashboardHome() {
    const user = storage.getUser();
    const assets = storage.getVaultAssets();
    const licenseRequests = storage.getLicenseRequests();

    const pendingRequests = licenseRequests.filter(r => r.status === 'pending').length;
    const approvedLicenses = licenseRequests.filter(r => r.status === 'approved').length;
    const verifiedAssets = assets.filter(a => a.status === 'verified' || a.status === 'tamper-proof').length;

    const stats = [
        {
            label: 'Protected Assets',
            value: verifiedAssets.toString(),
            previousValue: '0 previous period',
            change: verifiedAssets > 0 ? '+100%' : null,
            icon: Vault,
            href: '/dashboard/vault',
            theme: 'green',
            watermark: ShieldCheck
        },
        {
            label: 'Approved Licenses',
            value: approvedLicenses.toString(),
            previousValue: '0 previous period',
            change: approvedLicenses > 0 ? `+${approvedLicenses}` : null,
            icon: FileText,
            href: '/dashboard/vault',
            theme: 'blue',
            watermark: FileText
        },
        {
            label: 'Pending Requests',
            value: pendingRequests.toString(),
            previousValue: '0 previous period',
            change: pendingRequests > 0 ? `+${pendingRequests}` : null,
            icon: Pulse,
            href: '/dashboard/vault',
            theme: 'yellow',
            watermark: Pulse
        },
    ];

    const getThemeStyles = (theme: string) => {
        return {
            bg: 'bg-muted',
            text: 'text-foreground',
            border: 'group-hover:border-foreground/10',
            ring: 'ring-border/50',
            icon: 'text-foreground',
            badge: 'bg-muted text-muted-foreground'
        };
    };

    const recentActivity = [
        { action: 'Voice biometric added', time: '2 hours ago', type: 'upload' },
        { action: 'License authorized for Project Aurora', time: '5 hours ago', type: 'license' },
        { action: 'Face scan verified', time: '1 day ago', type: 'verify' },
        { action: 'Contract signed with Studio XYZ', time: '2 days ago', type: 'contract' },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-6">


                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6">
                    {stats.map((stat) => {
                        const styles = getThemeStyles(stat.theme);
                        const WatermarkIcon = stat.watermark;

                        return (
                            <Link
                                key={stat.label}
                                to={stat.href}
                                className="group relative"
                            >
                                <Card className={`p-6 relative overflow-hidden transition-all duration-300 rounded-3xl`}>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-10 h-10 rounded-lg ${styles.bg} flex items-center justify-center ${styles.text} ring-1 ${styles.ring}`}>
                                                <stat.icon className="w-5 h-5" weight="fill" />
                                            </div>
                                            {stat.change && (
                                                <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${styles.badge}`}>
                                                    {stat.change}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[13px] font-medium text-muted-foreground">{stat.label}</p>
                                            <p className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
                                        </div>

                                        <div className="mt-4 flex items-center gap-1 opacity-60">
                                            <TrendUp className="w-3.5 h-3.5" />
                                            <p className="text-[11px]">{stat.previousValue}</p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Security Status */}
                    <Card className="p-6 relative overflow-hidden group hover:border-[#D61D1F]/20 transition-all duration-300 rounded-3xl">
                        <div className="absolute bottom-2 right-2 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity rotate-12">
                            <ShieldCheck className="w-24 h-24 text-muted-foreground/20" weight="duotone" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground ring-1 ring-border/50">
                                        <ShieldCheck className="w-5 h-5" weight="fill" />
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-semibold text-foreground">Security Status</h3>
                                        <p className="text-[12px] text-muted-foreground">Real-time monitoring</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">All Systems Operational</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-md bg-background shadow-sm">
                                            <Vault className="w-4 h-4 text-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-medium">Vault Protection</p>
                                            <p className="text-[11px] text-muted-foreground">End-to-end encrypted</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-semibold">{verifiedAssets}</span>
                                        <span className="text-[11px] text-muted-foreground">assets</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
                                        <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                                    </div>
                                    <span className="text-[11px] font-medium text-muted-foreground">100% Secure</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Recently Joined */}
                    <Card className="p-6 flex flex-col h-full hover:border-[#D61D1F]/20 transition-all duration-300 rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground ring-1 ring-border/50">
                                    <TrendUp className="w-5 h-5" weight="fill" />
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-semibold text-foreground">Recently Joined</h3>
                                    <p className="text-[12px] text-muted-foreground">Latest team members</p>
                                </div>
                            </div>
                            <Link to="/dashboard/team" className="text-[12px] font-medium text-[#D61D1F] hover:text-[#D61D1F]/80 transition-colors">
                                View all
                            </Link>
                        </div>

                        <div className="space-y-4 flex-1">
                            {recentlyJoined.map((person, index) => (
                                <div key={index} className="flex items-center justify-between group p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-background shadow-sm group-hover:scale-105 transition-transform duration-300">
                                                <img
                                                    src={person.avatar}
                                                    alt={person.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-background rounded-full bg-emerald-500"></div>
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors">{person.name}</p>
                                            <p className="text-[11px] text-muted-foreground">Product Designer</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[11px] text-muted-foreground block">{person.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                            <div className="flex -space-x-2">
                                {recentlyJoined.map((p, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full ring-2 ring-background overflow-hidden opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:z-10 transition-all">
                                        <img src={p.avatar} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-6 h-6 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[9px] font-medium text-muted-foreground">+5</div>
                            </div>
                            <span className="text-[11px] text-muted-foreground">Team growth +12% this week</span>
                        </div>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card className="overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur-sm rounded-3xl">
                    <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
                        <h3 className="text-[15px] font-semibold text-foreground">Recent Activity</h3>
                        <Link to="/dashboard/activity" className="text-[12px] font-medium text-[#D61D1F] hover:text-[#D61D1F]/80 transition-colors">
                            View all
                        </Link>
                    </div>
                    <div className="divide-y divide-border/40">
                        {recentActivity.map((activity, index) => {
                            const getActivityConfig = (type: string) => {
                                switch (type) {
                                    case 'upload': return { icon: CloudArrowUp, color: 'text-foreground', bg: 'bg-muted', ring: 'ring-border/50' };
                                    case 'license': return { icon: FileText, color: 'text-foreground', bg: 'bg-muted', ring: 'ring-border/50' };
                                    case 'verify': return { icon: ShieldCheck, color: 'text-foreground', bg: 'bg-muted', ring: 'ring-border/50' };
                                    case 'contract': return { icon: PenNib, color: 'text-foreground', bg: 'bg-muted', ring: 'ring-border/50' };
                                    default: return { icon: FileText, color: 'text-foreground', bg: 'bg-muted', ring: 'ring-border/50' };
                                }
                            };

                            const config = getActivityConfig(activity.type);
                            const Icon = config.icon;

                            return (
                                <div
                                    key={index}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center ${config.color} ring-1 ${config.ring}`}>
                                            <Icon className="w-5 h-5" weight="fill" />
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-medium text-foreground">{activity.action}</p>
                                            <p className="text-[12px] text-muted-foreground">Just now · via API</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[12px] text-muted-foreground bg-muted px-2 py-1 rounded-md">{activity.time}</span>
                                        <CaretRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" weight="bold" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/dashboard/vault">
                        <Card className="p-6 hover:border-border transition-colors cursor-pointer group rounded-3xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[15px] font-medium mb-1">Upload Biometrics</p>
                                    <p className="text-[13px] text-muted-foreground">Add new protected assets to your vault</p>
                                </div>
                                <CaretRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" weight="bold" />
                            </div>
                        </Card>
                    </Link>
                    <Link to="/dashboard/marketplace">
                        <Card className="p-6 hover:border-border transition-colors cursor-pointer group rounded-3xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[15px] font-medium mb-1">Browse Marketplace</p>
                                    <p className="text-[13px] text-muted-foreground">Discover opportunities and partnerships</p>
                                </div>
                                <CaretRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" weight="bold" />
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
