import React from 'react';

interface AreaPieChartProps {
    data: { [key: string]: number };
    total: number;
}

const COLORS = ['#0d9488', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'];

const AreaPieChart: React.FC<AreaPieChartProps> = ({ data, total }) => {
    let cumulativePercentage = 0;
    const gradients = Object.entries(data).map(([name, count], index) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        const color = COLORS[index % COLORS.length];
        const start = cumulativePercentage;
        const end = cumulativePercentage + percentage;
        cumulativePercentage = end;
        return `${color} ${start}% ${end}%`;
    });

    const conicGradient = `conic-gradient(${gradients.join(', ')})`;

    return (
        <div className="bg-base-200 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-text-primary mb-4">Activities by Area</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div
                    className="w-32 h-32 rounded-full"
                    style={{ background: conicGradient }}
                    role="img"
                    aria-label="Pie chart showing activities by discussion area"
                ></div>
                <div className="flex-1 space-y-2">
                    {Object.entries(data).map(([name, count], index) => (
                         <div key={name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></span>
                                <span className="text-text-secondary">{name}</span>
                            </div>
                            <span className="font-bold text-text-primary">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AreaPieChart;