import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResultMatrix({ result, algorithmName, matrixSize, isStale, error }) {
  if (error) {
    return (
      <div className="result-card error-card">
        <div className="error-header">
          <AlertCircle size={20} className="text-red" />
          <span className="error-title">Calculation Error</span>
        </div>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className={`result-card ${isStale ? 'stale-result' : ''}`}>
      <div className="result-header">
        <div>
          <div className="result-title-row">
            <h3 className="result-title">Result Matrix (C)</h3>
            <span className="result-algo-badge">{algorithmName}</span>
          </div>
          <p className="result-subtitle">
            Matrix Product: <strong>C = A × B</strong> ({matrixSize} × {matrixSize})
          </p>
        </div>

        {!isStale ? (
          <div className="success-badge">
            <CheckCircle2 size={16} />
            <span>Multiplication Successful</span>
          </div>
        ) : (
          <div className="stale-badge">
            <AlertCircle size={16} />
            <span>Inputs changed — Click Calculate to refresh</span>
          </div>
        )}
      </div>

      <div className="result-bracket-container">
        <div className="bracket bracket-left result-bracket" />
        <div
          className="matrix-grid result-grid"
          style={{
            gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 1fr))`
          }}
        >
          {result.map((row, rIdx) =>
            row.map((val, cIdx) => (
              <div key={`c-${rIdx}-${cIdx}`} className="result-cell-box">
                <span className="result-value">{val}</span>
                <span className="cell-subscript">
                  c<sub>{rIdx + 1},{cIdx + 1}</sub>
                </span>
              </div>
            ))
          )}
        </div>
        <div className="bracket bracket-right result-bracket" />
      </div>
    </div>
  );
}
