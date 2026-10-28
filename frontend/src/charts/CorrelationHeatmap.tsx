import React, { useState } from 'react';
import { CorrelationMatrixData } from '../types';

interface Props {
  data: CorrelationMatrixData;
}

export const CorrelationHeatmap: React.FC<Props> = ({ data }) => {
  const [hoveredCell, setHoveredCell] = useState<{
    var1: string;
    var2: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  if (!data || !data.variables || data.variables.length === 0) {
    return <div className="p-8 text-center text-slate-400">Correlation data unavailable.</div>;
  }

  // Color mapping: -1.0 (blue) -> 0.0 (slate) -> +1.0 (emerald/teal)
  const getCellColor = (val: number) => {
    if (val === 1.0) return 'bg-teal-700 text-white font-bold';
    if (val >= 0.6) return 'bg-teal-600 text-white font-semibold';
    if (val >= 0.4) return 'bg-teal-500/80 text-white font-medium';
    if (val >= 0.2) return 'bg-teal-400/40 text-teal-950 dark:text-teal-100';
    if (val > 0.0) return 'bg-teal-100/60 dark:bg-teal-950/40 text-slate-700 dark:text-slate-300';
    if (val === 0.0) return 'bg-slate-100 dark:bg-slate-800 text-slate-400';
    if (val >= -0.2) return 'bg-sky-100/60 dark:bg-sky-950/40 text-slate-700 dark:text-slate-300';
    return 'bg-sky-400/40 text-sky-950 dark:text-sky-100';
  };

  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-full align-middle">
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left font-medium text-slate-400"></th>
                {data.variables.map((v, i) => (
                  <th
                    key={i}
                    className="p-2 text-center font-semibold text-slate-600 dark:text-slate-300 min-w-[58px]"
                  >
                    <span className="truncate block max-w-[58px]" title={v}>
                      {v}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.matrix.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td className="p-2 text-right font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap pr-3">
                    {row.variable}
                  </td>
                  {row.values.map((val, cIdx) => (
                    <td
                      key={cIdx}
                      className="p-1 text-center"
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredCell({
                          var1: row.variable,
                          var2: data.variables[cIdx],
                          value: val,
                          x: rect.x + rect.width / 2,
                          y: rect.y
                        });
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className={`h-9 w-14 rounded-md flex items-center justify-center transition-all cursor-pointer hover:ring-2 hover:ring-teal-400 ${getCellColor(
                          val
                        )}`}
                      >
                        {val.toFixed(2)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating tooltip preview */}
      {hoveredCell && (
        <div className="mt-2 p-2.5 rounded-lg bg-slate-900 text-white text-xs shadow-lg flex items-center justify-between">
          <div>
            <span className="text-teal-300 font-semibold">{hoveredCell.var1}</span> &harr;{' '}
            <span className="text-teal-300 font-semibold">{hoveredCell.var2}</span>
          </div>
          <div>
            Correlation <span className="font-bold text-teal-400">{hoveredCell.value >= 0 ? `+${hoveredCell.value.toFixed(2)}` : hoveredCell.value.toFixed(2)}</span>
            {' '}({hoveredCell.value > 0.5 ? 'Strong Positive' : hoveredCell.value > 0.2 ? 'Moderate Positive' : hoveredCell.value < -0.2 ? 'Negative' : 'Weak/Neutral'})
          </div>
        </div>
      )}

      {/* Statistical Methodology & Causal Warning */}
      <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
        <span className="font-bold shrink-0">⚠️ Statistical Note:</span>
        <p className="leading-relaxed">
          {data.disclaimer || 'Statistical correlation measures linear association and does NOT establish biological or clinical causation.'}
        </p>
      </div>
    </div>
  );
};
