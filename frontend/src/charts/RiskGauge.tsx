import React from 'react';

interface Props {
  probabilityPercent: number;
  category: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export const RiskGauge: React.FC<Props> = ({ probabilityPercent, category }) => {
  // Semicircular gauge: angle from -90 to +90 degrees
  const clamped = Math.min(Math.max(probabilityPercent, 0), 100);
  const angle = (clamped / 100) * 180 - 90;

  const getCategoryStyles = () => {
    switch (category) {
      case 'Critical':
        return { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900', needle: '#EF4444' };
      case 'High':
        return { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900', needle: '#F59E0B' };
      case 'Moderate':
        return { text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-900', needle: '#06B6D4' };
      default:
        return { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900', needle: '#10B981' };
    }
  };

  const styles = getCategoryStyles();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-56 h-32 flex items-center justify-center">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          {/* Background track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="16"
            strokeLinecap="round"
            className="dark:stroke-slate-800"
          />
          {/* Low Band (0-20%) */}
          <path
            d="M 20 100 A 80 80 0 0 1 45 44"
            fill="none"
            stroke="#10B981"
            strokeWidth="16"
            strokeOpacity="0.8"
          />
          {/* Moderate Band (20-40%) */}
          <path
            d="M 45 44 A 80 80 0 0 1 100 20"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="16"
            strokeOpacity="0.8"
          />
          {/* High Band (40-65%) */}
          <path
            d="M 100 20 A 80 80 0 0 1 155 44"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="16"
            strokeOpacity="0.8"
          />
          {/* Critical Band (65-100%) */}
          <path
            d="M 155 44 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#EF4444"
            strokeWidth="16"
            strokeOpacity="0.8"
          />
          {/* Needle */}
          <g transform={`rotate(${angle} 100 100)`} className="transition-transform duration-700 ease-out">
            <line x1="100" y1="100" x2="100" y2="30" stroke={styles.needle} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="100" cy="100" r="7" fill={styles.needle} />
            <circle cx="100" cy="100" r="3" fill="#FFFFFF" />
          </g>
        </svg>

        {/* Display Score in center bottom */}
        <div className="absolute -bottom-1 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {clamped}%
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Estimated Risk
          </span>
        </div>
      </div>

      {/* Category Pill */}
      <div className={`mt-3 px-4 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${styles.bg} ${styles.text}`}>
        {category} Risk Tier
      </div>
    </div>
  );
};
