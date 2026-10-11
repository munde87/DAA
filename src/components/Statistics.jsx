import React from 'react';
import { Clock, Activity, Calculator, Cpu, ShieldCheck } from 'lucide-react';

export default function Statistics({ stats }) {
  if (!stats) return null;

  const {
    algorithm,
    dimensions,
    scalarMultiplications,
    scalarAdditions,
    totalScalarOps,
    executionTimeMs,
    recursiveCalls
  } = stats;

  const formattedTime =
    executionTimeMs < 0.01 ? '< 0.01 ms (instantaneous)' : `~ ${executionTimeMs.toFixed(3)} ms`;

  return (
    <div className="stats-card">
      <div className="stats-header">
        <Activity size={20} className="text-blue" />
        <h3 className="stats-title">Performance & Operation Statistics</h3>
        <span className="stats-disclaimer">Instrumented Execution Data</span>
      </div>

      <div className="stats-grid">
        <div className="stat-tile">
          <div className="stat-icon-wrap">
            <Cpu size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Algorithm</span>
            <span className="stat-value">{algorithm}</span>
          </div>
        </div>

        <div className="stat-tile">
          <div className="stat-icon-wrap">
            <Calculator size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Matrix Size</span>
            <span className="stat-value">{dimensions}</span>
          </div>
        </div>

        <div className="stat-tile highlight-stat">
          <div className="stat-icon-wrap text-blue">
            <Calculator size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Scalar Multiplications</span>
            <span className="stat-value stat-primary">{scalarMultiplications}</span>
            <span className="stat-subtext">Core divide-and-conquer products</span>
          </div>
        </div>

        <div className="stat-tile">
          <div className="stat-icon-wrap">
            <Calculator size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Scalar Additions / Subs</span>
            <span className="stat-value">{scalarAdditions}</span>
            <span className="stat-subtext">Sum & difference operations</span>
          </div>
        </div>

        <div className="stat-tile">
          <div className="stat-icon-wrap">
            <ShieldCheck size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Arithmetic Ops</span>
            <span className="stat-value">{totalScalarOps}</span>
            <span className="stat-subtext">Multiplications + Additions</span>
          </div>
        </div>

        <div className="stat-tile">
          <div className="stat-icon-wrap text-amber">
            <Clock size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Elapsed Time (Approx.)</span>
            <span className="stat-value">{formattedTime}</span>
            <span className="stat-subtext">Measured via performance.now()</span>
          </div>
        </div>
      </div>

      {recursiveCalls !== undefined && (
        <div className="stats-callout">
          <strong>Divide-and-Conquer Analysis:</strong> Strassen executed{' '}
          <strong>{recursiveCalls} recursive function calls</strong>.{' '}
          {dimensions === '2×2' && (
            <>
              At 2×2, Strassen uses only <strong>7 scalar multiplications</strong> compared to Traditional's <strong>8</strong> (12.5% reduction).
            </>
          )}
          {dimensions === '3×3' && (
            <>
              At 3×3, dimension <em>n=3</em> is not a power of 2. The matrices are zero-padded to 4×4 to enable quadrant partitioning, performing <strong>49 block multiplications</strong> and unpadding back to 3×3 (compared to Traditional's 27 multiplications with 0 overhead).
            </>
          )}
          {dimensions === '4×4' && (
            <>
              At 4×4, Strassen uses only <strong>49 scalar multiplications</strong> compared to Traditional's <strong>64</strong> (23.4% reduction).
            </>
          )}
        </div>
      )}
    </div>
  );
}
