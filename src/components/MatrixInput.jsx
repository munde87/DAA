import React from 'react';

export default function MatrixInput({
  label,
  matrixName,
  matrix,
  onCellChange,
  matrixSize,
  errorCell,
  disabled = false,
  onEnter
}) {
  return (
    <div className="matrix-card">
      <div className="matrix-card-header">
        <div className="matrix-title-badge">
          <span className="matrix-symbol">{matrixName}</span>
          <span className="matrix-dimensions">({matrixSize} × {matrixSize})</span>
        </div>
        <span className="matrix-label-sub">{label}</span>
      </div>

      <div className="matrix-bracket-container">
        <div className="bracket bracket-left" />
        <div
          className="matrix-grid"
          style={{
            gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 1fr))`
          }}
        >
          {matrix.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const isError =
                errorCell && errorCell.matrix === matrixName && errorCell.row === rIdx && errorCell.col === cIdx;

              return (
                <div key={`${matrixName}-${rIdx}-${cIdx}`} className="matrix-cell-wrapper">
                  <input
                    type="number"
                    step="1"
                    className={`matrix-input-cell ${isError ? 'cell-error' : ''}`}
                    value={val}
                    onChange={(e) => onCellChange(matrixName, rIdx, cIdx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && onEnter) {
                        onEnter();
                      }
                    }}
                    disabled={disabled}
                    placeholder="0"
                    aria-label={`${matrixName} [${rIdx + 1}, ${cIdx + 1}]`}
                  />
                  <span className="cell-subscript">
                    {rIdx + 1},{cIdx + 1}
                  </span>
                </div>
              );
            })
          )}
        </div>
        <div className="bracket bracket-right" />
      </div>
    </div>
  );
}
