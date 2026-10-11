import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

// Mini matrix renderer for submatrices or small intermediate matrices
function MiniMatrixView({ matrix, label, highlight = false, size = 'md' }) {
  if (!matrix || !Array.isArray(matrix)) return null;

  return (
    <div className={`mini-matrix-block ${highlight ? 'highlight' : ''}`}>
      {label && <div className="mini-matrix-label">{label}</div>}
      <div className="mini-bracket-wrapper">
        <div className="mini-bracket bracket-left" />
        <div
          className={`mini-matrix-grid size-${size}`}
          style={{ gridTemplateColumns: `repeat(${matrix.length}, minmax(0, 1fr))` }}
        >
          {matrix.map((row, rIdx) =>
            row.map((val, cIdx) => (
              <div key={`${rIdx}-${cIdx}`} className="mini-matrix-cell">
                {val}
              </div>
            ))
          )}
        </div>
        <div className="mini-bracket bracket-right" />
      </div>
    </div>
  );
}

export default function StepVisualizer({ steps, algorithm }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef(null);

  // Reset step index when new steps are generated
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [steps]);

  // Handle Auto Play
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800); // 1.8 seconds per step
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, steps.length]);

  if (!steps || steps.length === 0) {
    return (
      <div className="visualizer-card empty-visualizer">
        <p>No calculation steps available. Click "Calculate" to visualize the algorithm.</p>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handlePrev = () => {
    if (!isFirstStep) setCurrentStepIndex(currentStepIndex - 1);
  };

  const handleNext = () => {
    if (!isLastStep) setCurrentStepIndex(currentStepIndex + 1);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const toggleAutoPlay = () => {
    if (isLastStep) {
      // If at end, restart and play
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div>
          <div className="visualizer-title-badge">
            <Sparkles size={18} className="text-blue" />
            <h3 className="visualizer-title">Algorithm Visualization</h3>
          </div>
          <p className="visualizer-subtitle">
            {algorithm === 'strassen'
              ? "Strassen's Divide-and-Conquer Trace (M1–M7 Products & Quadrant Assembly)"
              : 'Traditional Row-by-Column Dot-Product Trace'}
          </p>
        </div>

        {/* Step Progress Counter */}
        <div className="step-counter-badge">
          Step <strong>{currentStepIndex + 1}</strong> of <strong>{steps.length}</strong>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="step-progress-track">
        <div
          className="step-progress-fill"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step Content Card */}
      <div className="step-content-box">
        <div className="step-content-heading">
          <span className="step-number-tag">Step {currentStepIndex + 1}</span>
          <h4 className="step-heading-text">{currentStep.title}</h4>
        </div>

        <p className="step-description">{currentStep.description}</p>

        {/* Specific content rendering depending on step type */}
        {renderStepDetails(currentStep, algorithm)}
      </div>

      {/* Navigation Controls */}
      <div className="visualizer-controls">
        <div className="step-jump-container">
          <span className="jump-label">Jump to step:</span>
          <input
            type="range"
            min="0"
            max={steps.length - 1}
            value={currentStepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIndex(Number(e.target.value));
            }}
            className="step-slider"
            aria-label="Step slider"
          />
        </div>

        <div className="control-buttons-group">
          <button
            type="button"
            className="ctrl-btn"
            onClick={handleRestart}
            title="Restart visualization from Step 1"
          >
            <RotateCcw size={16} />
            <span>Restart</span>
          </button>

          <button
            type="button"
            className="ctrl-btn"
            onClick={handlePrev}
            disabled={isFirstStep}
            title="Previous step"
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>

          <button
            type="button"
            className={`ctrl-btn btn-autoplay ${isPlaying ? 'playing' : ''}`}
            onClick={toggleAutoPlay}
            title={isPlaying ? 'Pause auto-play' : 'Auto play through all steps'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            type="button"
            className="ctrl-btn ctrl-btn-primary"
            onClick={handleNext}
            disabled={isLastStep}
            title="Next step"
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-renderers for different types of step data
function renderStepDetails(step, algorithm) {
  // 1. Initial Overview Step
  if (step.matrices && step.type === 'overview') {
    return (
      <div className="step-matrices-row">
        <div className="side-by-side-matrices">
          <MiniMatrixView matrix={step.matrices.A} label="Matrix A" />
          <div className="op-sign">×</div>
          <MiniMatrixView matrix={step.matrices.B} label="Matrix B" />
        </div>
      </div>
    );
  }

  // 2. Strassen Partition Step (Step 2)
  if (step.type === 'partition' && step.submatrices) {
    const { A11, A12, A21, A22, B11, B12, B21, B22 } = step.submatrices;
    return (
      <div className="partition-display">
        <div className="partition-group">
          <div className="partition-title">Matrix A Quadrants</div>
          <div className="quadrant-grid">
            <MiniMatrixView matrix={A11} label="A₁₁" />
            <MiniMatrixView matrix={A12} label="A₁₂" />
            <MiniMatrixView matrix={A21} label="A₂₁" />
            <MiniMatrixView matrix={A22} label="A₂₂" />
          </div>
        </div>

        <div className="partition-group">
          <div className="partition-title">Matrix B Quadrants</div>
          <div className="quadrant-grid">
            <MiniMatrixView matrix={B11} label="B₁₁" />
            <MiniMatrixView matrix={B12} label="B₁₂" />
            <MiniMatrixView matrix={B21} label="B₂₁" />
            <MiniMatrixView matrix={B22} label="B₂₂" />
          </div>
        </div>
      </div>
    );
  }

  // 3. Strassen M1-M7 Product Step
  if (step.type === 'product' && step.parts) {
    return (
      <div className="product-step-details">
        <div className="formula-banner">
          <code>{step.formula}</code>
        </div>

        <div className="product-arithmetic-visual">
          <MiniMatrixView matrix={step.parts.leftMatrix} label={step.parts.leftName} />
          <div className="op-sign">×</div>
          <MiniMatrixView matrix={step.parts.rightMatrix} label={step.parts.rightName} />
          <div className="op-sign">=</div>
          <MiniMatrixView matrix={step.product} label={step.productName} highlight={true} />
        </div>
      </div>
    );
  }

  // 4. Strassen Combination Step (Step 10)
  if (step.type === 'combination' && step.combinations) {
    return (
      <div className="combination-step-details">
        <div className="combinations-grid">
          {step.combinations.map((comb) => (
            <div key={comb.name} className="combination-item-card">
              <div className="comb-formula">
                <code>{comb.formula}</code>
              </div>
              <MiniMatrixView matrix={comb.matrix} label={comb.name} highlight={true} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. Final Strassen / Traditional Step
  if (step.isFinal) {
    const finalMat = step.resultMatrix || step.currentC;
    return (
      <div className="final-step-details">
        <div className="formula-banner">
          <code>{step.formula}</code>
        </div>
        <div className="final-center-matrix">
          <MiniMatrixView matrix={finalMat} label="Final Matrix C" highlight={true} size="lg" />
        </div>
      </div>
    );
  }

  // 6. Traditional Row-by-Column Calculation Step
  if (step.activeCell !== undefined && step.formula) {
    return (
      <div className="traditional-step-details">
        <div className="formula-banner">
          <code>{step.formula}</code>
        </div>

        <div className="traditional-grid-preview">
          <div className="side-by-side-matrices">
            {step.matrices && (
              <>
                <div className="matrix-with-highlight">
                  <div className="mini-matrix-label">Matrix A (Row {step.activeRow + 1})</div>
                  <div className="bracket-wrapper">
                    <div className="bracket bracket-left" />
                    <div
                      className="matrix-grid-small"
                      style={{ gridTemplateColumns: `repeat(${step.matrices.A.length}, 1fr)` }}
                    >
                      {step.matrices.A.map((row, r) =>
                        row.map((val, c) => (
                          <div
                            key={`a-${r}-${c}`}
                            className={`small-cell ${r === step.activeRow ? 'highlight-row' : ''}`}
                          >
                            {val}
                          </div>
                        ))
                      )}
                    </div>
                    <div className="bracket bracket-right" />
                  </div>
                </div>

                <div className="op-sign">·</div>

                <div className="matrix-with-highlight">
                  <div className="mini-matrix-label">Matrix B (Col {step.activeCol + 1})</div>
                  <div className="bracket-wrapper">
                    <div className="bracket bracket-left" />
                    <div
                      className="matrix-grid-small"
                      style={{ gridTemplateColumns: `repeat(${step.matrices.B.length}, 1fr)` }}
                    >
                      {step.matrices.B.map((row, r) =>
                        row.map((val, c) => (
                          <div
                            key={`b-${r}-${c}`}
                            className={`small-cell ${c === step.activeCol ? 'highlight-col' : ''}`}
                          >
                            {val}
                          </div>
                        ))
                      )}
                    </div>
                    <div className="bracket bracket-right" />
                  </div>
                </div>
              </>
            )}

            <div className="op-sign">=</div>

            {step.currentC && (
              <div className="matrix-with-highlight">
                <div className="mini-matrix-label">Matrix C State</div>
                <div className="bracket-wrapper">
                  <div className="bracket bracket-left" />
                  <div
                    className="matrix-grid-small"
                    style={{ gridTemplateColumns: `repeat(${step.currentC.length}, 1fr)` }}
                  >
                    {step.currentC.map((row, r) =>
                      row.map((val, c) => {
                        const isCurrent =
                          step.activeCell &&
                          step.activeCell.row === r &&
                          step.activeCell.col === c;
                        return (
                          <div
                            key={`c-${r}-${c}`}
                            className={`small-cell ${isCurrent ? 'highlight-active-cell' : ''}`}
                          >
                            {val}
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="bracket bracket-right" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
