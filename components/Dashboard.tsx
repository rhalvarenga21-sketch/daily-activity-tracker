import React, { useMemo } from 'react';
import { Ticket, TicketStatus } from '../types';
import MetricCard from './MetricCard';
import StatusBarChart from './charts/StatusBarChart';
import AreaPieChart from './charts/AreaPieChart';
import WeeklySnapshot from './WeeklySnapshot';

interface DashboardProps {
    tickets: Ticket[];
    getStatusColor: (status: TicketStatus) => string;
}

const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2v-3a2 2 0 00-2-2H5zM5 14a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2v-3a2 2 0 00-2-2H5z" /></svg>;
const PendingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ResolvedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


const Dashboard: React.FC<DashboardProps> = ({ tickets, getStatusColor }) => {
    
    const sevenDaysAgo = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    }, []);

    const ticketsLast7Days = useMemo(() => {
        return tickets.filter(t => new Date(t.connectDate) >= sevenDaysAgo);
    }, [tickets, sevenDaysAgo]);

    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        
        const total = tickets.length;
        const pendingInternal = tickets.filter(t => t.currentStatus === 'Pending (Internal Action)').length;
        const pendingPartner = tickets.filter(t => t.currentStatus === 'Pending (Partner Action)').length;
        const resolvedToday = tickets.filter(t => t.currentStatus === 'Resolved' && t.connectDate === today).length;

        const statusCounts: { [key in TicketStatus]: number } = {
            'Pending (Internal Action)': pendingInternal,
            'Pending (Partner Action)': pendingPartner,
            'Resolved': tickets.filter(t => t.currentStatus === 'Resolved').length,
        };

        const areaCounts = tickets.reduce((acc, ticket) => {
            acc[ticket.discussionArea] = (acc[ticket.discussionArea] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });

        return {
            total,
            pending: pendingInternal + pendingPartner,
            resolvedToday,
            statusCounts,
            areaCounts
        };
    }, [tickets]);

    return (
        <div className="space-y-6">
             {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard title="Total Activities" value={stats.total} icon={<TicketIcon />} />
                <MetricCard title="Total Pending" value={stats.pending} icon={<PendingIcon />} />
                <MetricCard title="Resolved Today" value={stats.resolvedToday} icon={<ResolvedIcon />} />
            </div>

            {/* AI Snapshot */}
            <WeeklySnapshot tickets={ticketsLast7Days} />

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusBarChart data={stats.statusCounts} total={stats.total} getStatusColor={getStatusColor} />
                <AreaPieChart data={stats.areaCounts} total={stats.total} />
            </div>
        </div>
    );
};

export default Dashboard;