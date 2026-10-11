import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Play, CheckCircle, AlertTriangle, BarChart3, HelpCircle } from 'lucide-react';
import { runBenchmark } from '../utils/benchmark';

export default function BenchmarkChart() {
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [metricMode, setMetricMode] = useState('multiplications'); // 'multiplications' | 'time'

  const handleRunBenchmark = () => {
    setIsRunning(true);
    // Allow React state to render loading indicator before running CPU loop
    setTimeout(() => {
      const data = runBenchmark();
      setBenchmarkData(data);
      setIsRunning(false);
    }, 50);
  };

  // Format data for Recharts
  const chartData = benchmarkData
    ? benchmarkData.benchmarks.map((item) => ({
        dimension: item.label,
        'Traditional Multiplications': item.traditional.multiplications,
        'Strassen Multiplications': item.strassen.multiplications,
        'Traditional Additions': item.traditional.additions,
        'Strassen Additions': item.strassen.additions,
        'Traditional Time (ms)': item.traditional.timeMs,
        'Strassen Time (ms)': item.strassen.timeMs
      }))
    : [];

  return (
    <div className="benchmark-card">
      <div className="benchmark-header">
        <div>
          <div className="benchmark-title-row">
            <BarChart3 size={20} className="text-blue" />
            <h3 className="benchmark-title">Empirical Benchmark & Complexity Comparison</h3>
          </div>
          <p className="benchmark-subtitle">
            Compare actual operation counts and execution speeds between Traditional and Strassen algorithms.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary btn-benchmark"
          onClick={handleRunBenchmark}
          disabled={isRunning}
        >
          <Play size={16} className={isRunning ? 'animate-spin' : 'fill-current'} />
          <span>{isRunning ? 'Benchmarking...' : 'Run Benchmark'}</span>
        </button>
      </div>

      {benchmarkData && (
        <div className="benchmark-results-container">
          {/* Verification Status */}
          <div
            className={`benchmark-status-banner ${
              benchmarkData.allMatched ? 'status-pass' : 'status-fail'
            }`}
          >
            {benchmarkData.allMatched ? (
              <>
                <CheckCircle size={18} className="text-green" />
                <span>
                  <strong>Mathematical Verification Passed:</strong> Traditional and Strassen
                  algorithms produced 100% identical result matrices for all test cases.
                </span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} className="text-red" />
                <span>
                  <strong>Verification Error:</strong> Matrix results diverged between Traditional
                  and Strassen algorithms.
                </span>
              </>
            )}
          </div>

          {/* Metric Selector Buttons */}
          <div className="chart-mode-toggles">
            <button
              type="button"
              className={`mode-toggle-btn ${metricMode === 'multiplications' ? 'active' : ''}`}
              onClick={() => setMetricMode('multiplications')}
            >
              Scalar Multiplications (Theoretical Target)
            </button>
            <button
              type="button"
              className={`mode-toggle-btn ${metricMode === 'time' ? 'active' : ''}`}
              onClick={() => setMetricMode('time')}
            >
              Approx. Wall-Clock Time (ms per op)
            </button>
          </div>

          {/* Recharts Bar Chart */}
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="dimension" stroke="#64748b" />
                <YAxis
                  stroke="#64748b"
                  label={{
                    value: metricMode === 'multiplications' ? 'Operations' : 'Time (ms)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: '#64748b', fontSize: 12 }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                />
                <Legend />
                {metricMode === 'multiplications' ? (
                  <>
                    <Bar
                      dataKey="Traditional Multiplications"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Strassen Multiplications"
                      fill="#2563eb"
                      radius={[4, 4, 0, 0]}
                    />
                  </>
                ) : (
                  <>
                    <Bar
                      dataKey="Traditional Time (ms)"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Strassen Time (ms)"
                      fill="#2563eb"
                      radius={[4, 4, 0, 0]}
                    />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table Comparison */}
          <div className="benchmark-table-wrapper">
            <table className="benchmark-table">
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>Algorithm</th>
                  <th>Scalar Multiplications</th>
                  <th>Scalar Additions</th>
                  <th>Total Arithmetic Ops</th>
                  <th>Time / Op (Avg)</th>
                </tr>
              </thead>
              <tbody>
                {benchmarkData.benchmarks.map((row) => (
                  <React.Fragment key={row.size}>
                    <tr className="row-trad">
                      <td rowSpan="2" className="dim-cell">{row.label}</td>
                      <td>Traditional O(n³)</td>
                      <td><strong>{row.traditional.multiplications}</strong></td>
                      <td>{row.traditional.additions}</td>
                      <td>{row.traditional.totalOps}</td>
                      <td>~{row.traditional.timeMs} ms</td>
                    </tr>
                    <tr className="row-strassen">
                      <td>Strassen O(n<sup>2.807</sup>)</td>
                      <td>
                        <strong className="text-blue">{row.strassen.multiplications}</strong>
                        {row.traditional.multiplications > row.strassen.multiplications ? (
                          <span className="reduction-badge">
                            (-{Math.round(((row.traditional.multiplications - row.strassen.multiplications) / row.traditional.multiplications) * 100)}%)
                          </span>
                        ) : (
                          <span className="reduction-badge badge-neutral">
                            (padded to 4×4)
                          </span>
                        )}
                      </td>
                      <td>{row.strassen.additions}</td>
                      <td>{row.strassen.totalOps}</td>
                      <td>~{row.strassen.timeMs} ms</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Educational Note on Trade-offs */}
          <div className="benchmark-explanation">
            <HelpCircle size={18} className="text-amber flex-shrink-0" />
            <p>{benchmarkData.explanation}</p>
          </div>
        </div>
      )}

      {!benchmarkData && (
        <div className="benchmark-empty-prompt">
          <p>
            Click <strong>"Run Benchmark"</strong> to execute identical test suites on both algorithms,
            verify correctness, and compare scalar multiplication reductions and wall-clock times.
          </p>
        </div>
      )}
    </div>
  );
}
