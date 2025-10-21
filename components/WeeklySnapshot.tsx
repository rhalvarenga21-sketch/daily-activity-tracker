import React, { useState, useCallback } from 'react';
import { Ticket } from '../types';
import { generateWeeklySnapshot } from '../services/geminiService';
import { AiIcon } from './icons/Icons';

interface WeeklySnapshotProps {
    tickets: Ticket[];
}

const WeeklySnapshot: React.FC<WeeklySnapshotProps> = ({ tickets }) => {
    const [snapshot, setSnapshot] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setSnapshot('');
        try {
            const result = await generateWeeklySnapshot(tickets);
            setSnapshot(result);
        } catch (err) {
            setError('Failed to generate snapshot. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [tickets]);

    return (
        <div className="bg-base-200 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-text-primary">AI Weekly Snapshot</h3>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary hover:bg-base-300 text-text-primary font-semibold rounded-lg shadow-md transition-all duration-300 disabled:opacity-50"
                    aria-label="Generate AI weekly snapshot"
                >
                    <AiIcon />
                    <span>{isLoading ? 'Generating...' : 'Generate'}</span>
                </button>
            </div>
            <div className="min-h-[6rem] bg-base-300/50 p-4 rounded-md">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                )}
                {error && <p className="text-red-400">{error}</p>}
                {snapshot && <p className="text-text-secondary whitespace-pre-wrap">{snapshot}</p>}
                {!isLoading && !error && !snapshot && (
                    <p className="text-text-secondary/70 text-center flex items-center justify-center h-full">
                        Click "Generate" for a summary of the last 7 days.
                    </p>
                )}
            </div>
        </div>
    );
};

export default WeeklySnapshot;