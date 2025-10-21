import React from 'react';

interface MetricCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-base-200 p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <div className="p-3 bg-slate-700/50 rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-text-secondary">{title}</p>
                <p className="text-2xl font-bold text-text-primary">{value}</p>
            </div>
        </div>
    );
};

export default MetricCard;