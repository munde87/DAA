import React from 'react';
import { RefreshCw, Shuffle, FileText, Play } from 'lucide-react';

export default function MatrixConfiguration({
  matrixSize,
  onChangeSize,
  onLoadExample,
  onRandomize,
  onReset,
  onCalculate,
  isCalculating
}) {
  return (
    <div className="configuration-bar">
      <div className="config-group size-group">
        <label className="config-label">Matrix Dimension (n × n):</label>
        <div className="size-toggle-buttons">
          <button
            type="button"
            className={`size-btn ${matrixSize === 2 ? 'active' : ''}`}
            onClick={() => onChangeSize(2)}
          >
            2 × 2
          </button>
          <button
            type="button"
            className={`size-btn ${matrixSize === 3 ? 'active' : ''}`}
            onClick={() => onChangeSize(3)}
          >
            3 × 3
          </button>
          <button
            type="button"
            className={`size-btn ${matrixSize === 4 ? 'active' : ''}`}
            onClick={() => onChangeSize(4)}
          >
            4 × 4
          </button>
        </div>
      </div>

      <div className="config-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onLoadExample}
          title="Load standard test matrices"
        >
          <FileText size={16} />
          <span>Load Example</span>
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={onRandomize}
          title="Generate random small integers"
        >
          <Shuffle size={16} />
          <span>Randomize</span>
        </button>

        <button
          type="button"
          className="btn-secondary btn-reset"
          onClick={onReset}
          title="Reset to default initial matrix"
        >
          <RefreshCw size={16} />
          <span>Reset</span>
        </button>

        <button
          type="button"
          className="btn-primary btn-calculate"
          onClick={onCalculate}
          disabled={isCalculating}
        >
          <Play size={17} className="fill-current" />
          <span>Calculate</span>
        </button>
      </div>
    </div>
  );
}
