import React from 'react';
import { TicketStatus } from '../../types';

interface StatusBarChartProps {
    data: { [key in TicketStatus]: number };
    total: number;
    getStatusColor: (status: TicketStatus) => string;
}

const StatusBarChart: React.FC<StatusBarChartProps> = ({ data, total, getStatusColor }) => {
    return (
        <div className="bg-base-200 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-text-primary mb-4">Activities by Status</h3>
            <div className="space-y-3">
                {Object.entries(data).map(([status, count]) => {
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    const typedStatus = status as TicketStatus;
                    const colorClasses = getStatusColor(typedStatus);
                    const bgColor = colorClasses.split(' ')[0].replace('/20', ''); // e.g. bg-amber-500/20 -> bg-amber-500

                    return (
                        <div key={status}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-text-secondary">{status}</span>
                                <span className="text-sm font-bold text-text-primary">{count}</span>
                            </div>
                            <div className="w-full bg-base-300 rounded-full h-2.5">
                                <div
                                    className={`${bgColor} h-2.5 rounded-full transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatusBarChart;