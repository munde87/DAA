import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MatrixConfiguration from './components/MatrixConfiguration';
import AlgorithmSelector from './components/AlgorithmSelector';
import MatrixInput from './components/MatrixInput';
import ResultMatrix from './components/ResultMatrix';
import StepVisualizer from './components/StepVisualizer';
import Statistics from './components/Statistics';
import BenchmarkChart from './components/BenchmarkChart';
import AlgorithmInfo from './components/AlgorithmInfo';

import {
  createZeroMatrix,
  cloneMatrix,
  validateMatrix,
  generateRandomMatrix,
  EXAMPLE_2X2_A,
  EXAMPLE_2X2_B,
  EXAMPLE_3X3_A,
  EXAMPLE_3X3_B,
  EXAMPLE_4X4_A,
  EXAMPLE_4X4_B
} from './utils/matrixUtils.js';
import { multiplyTraditional } from './utils/traditional.js';
import { multiplyStrassen } from './utils/strassen.js';

function getExamplePair(size) {
  if (size === 2) return { A: cloneMatrix(EXAMPLE_2X2_A), B: cloneMatrix(EXAMPLE_2X2_B) };
  if (size === 3) return { A: cloneMatrix(EXAMPLE_3X3_A), B: cloneMatrix(EXAMPLE_3X3_B) };
  return { A: cloneMatrix(EXAMPLE_4X4_A), B: cloneMatrix(EXAMPLE_4X4_B) };
}

export default function App() {
  const [matrixSize, setMatrixSize] = useState(2);
  const [matrixA, setMatrixA] = useState(cloneMatrix(EXAMPLE_2X2_A));
  const [matrixB, setMatrixB] = useState(cloneMatrix(EXAMPLE_2X2_B));
  const [algorithm, setAlgorithm] = useState('strassen');

  // Calculation outputs
  const [resultMatrix, setResultMatrix] = useState(null);
  const [steps, setSteps] = useState([]);
  const [stats, setStats] = useState(null);

  // Status & Validation
  const [validationError, setValidationError] = useState(null);
  const [errorCell, setErrorCell] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Automatically calculate default example on first load
  useEffect(() => {
    executeCalculation(EXAMPLE_2X2_A, EXAMPLE_2X2_B, 'strassen');
  }, []);

  const executeCalculation = (matA, matB, algo) => {
    // Validate Matrix A
    const valA = validateMatrix(matA);
    if (!valA.isValid) {
      setValidationError(`Matrix A: ${valA.error}`);
      setErrorCell({ matrix: 'Matrix A', row: valA.row, col: valA.col });
      setResultMatrix(null);
      setSteps([]);
      setStats(null);
      return;
    }

    // Validate Matrix B
    const valB = validateMatrix(matB);
    if (!valB.isValid) {
      setValidationError(`Matrix B: ${valB.error}`);
      setErrorCell({ matrix: 'Matrix B', row: valB.row, col: valB.col });
      setResultMatrix(null);
      setSteps([]);
      setStats(null);
      return;
    }

    // Clear previous errors
    setValidationError(null);
    setErrorCell(null);
    setIsCalculating(true);

    try {
      let calcOutput;
      if (algo === 'strassen') {
        calcOutput = multiplyStrassen(valA.matrix, valB.matrix);
      } else {
        calcOutput = multiplyTraditional(valA.matrix, valB.matrix);
      }

      setResultMatrix(calcOutput.result);
      setSteps(calcOutput.steps);
      setStats(calcOutput.stats);
      setIsStale(false);
    } catch (err) {
      setValidationError(`Calculation Error: ${err.message}`);
      setResultMatrix(null);
      setSteps([]);
      setStats(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCellChange = (matrixName, row, col, value) => {
    const updated = matrixName === 'Matrix A' ? cloneMatrix(matrixA) : cloneMatrix(matrixB);
    updated[row][col] = value;

    if (matrixName === 'Matrix A') {
      setMatrixA(updated);
    } else {
      setMatrixB(updated);
    }

    setIsStale(true);
    setValidationError(null);
    setErrorCell(null);
  };

  const handleChangeSize = (newSize) => {
    if (newSize === matrixSize) return;

    setMatrixSize(newSize);
    const { A: newA, B: newB } = getExamplePair(newSize);

    setMatrixA(newA);
    setMatrixB(newB);
    setResultMatrix(null);
    setSteps([]);
    setStats(null);
    setValidationError(null);
    setErrorCell(null);
    setIsStale(false);

    // Calculate immediately with new size example
    executeCalculation(newA, newB, algorithm);
  };

  const handleLoadExample = () => {
    const { A: exampleA, B: exampleB } = getExamplePair(matrixSize);

    setMatrixA(exampleA);
    setMatrixB(exampleB);
    setValidationError(null);
    setErrorCell(null);
    setIsStale(false);

    executeCalculation(exampleA, exampleB, algorithm);
  };

  const handleRandomize = () => {
    const randomA = generateRandomMatrix(matrixSize, -5, 9);
    const randomB = generateRandomMatrix(matrixSize, -5, 9);

    setMatrixA(randomA);
    setMatrixB(randomB);
    setValidationError(null);
    setErrorCell(null);
    setIsStale(false);

    executeCalculation(randomA, randomB, algorithm);
  };

  const handleReset = () => {
    setMatrixSize(2);
    const defaultA = cloneMatrix(EXAMPLE_2X2_A);
    const defaultB = cloneMatrix(EXAMPLE_2X2_B);

    setMatrixA(defaultA);
    setMatrixB(defaultB);
    setAlgorithm('strassen');
    setValidationError(null);
    setErrorCell(null);
    setIsStale(false);

    executeCalculation(defaultA, defaultB, 'strassen');
  };

  const handleSelectAlgorithm = (newAlgo) => {
    setAlgorithm(newAlgo);
    if (resultMatrix) {
      executeCalculation(matrixA, matrixB, newAlgo);
    }
  };

  const handleCalculate = () => {
    executeCalculation(matrixA, matrixB, algorithm);
  };

  const algorithmDisplayName =
    algorithm === 'strassen' ? "Strassen's Algorithm" : 'Traditional Multiplication';

  return (
    <div className="app-layout">
      <div className="main-container">
        {/* Header */}
        <Header />

        {/* Configuration Toolbar */}
        <MatrixConfiguration
          matrixSize={matrixSize}
          onChangeSize={handleChangeSize}
          onLoadExample={handleLoadExample}
          onRandomize={handleRandomize}
          onReset={handleReset}
          onCalculate={handleCalculate}
          isCalculating={isCalculating}
        />

        {/* Algorithm Selector */}
        <AlgorithmSelector
          selectedAlgorithm={algorithm}
          onSelectAlgorithm={handleSelectAlgorithm}
        />

        {/* Inline Error Message */}
        {validationError && (
          <div className="validation-alert" role="alert">
            <span className="alert-badge">Input Error</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* Matrix Inputs (Side by side on desktop) */}
        <div className="matrices-input-section">
          <MatrixInput
            label="First Input Matrix"
            matrixName="Matrix A"
            matrix={matrixA}
            onCellChange={handleCellChange}
            matrixSize={matrixSize}
            errorCell={errorCell}
            onEnter={handleCalculate}
          />

          <div className="matrices-operator-badge">
            <span>×</span>
          </div>

          <MatrixInput
            label="Second Input Matrix"
            matrixName="Matrix B"
            matrix={matrixB}
            onCellChange={handleCellChange}
            matrixSize={matrixSize}
            errorCell={errorCell}
            onEnter={handleCalculate}
          />
        </div>

        {/* Action Button for mobile & primary flow */}
        <div className="calculate-action-wrapper">
          <button
            type="button"
            className="btn-primary btn-calc-large"
            onClick={handleCalculate}
            disabled={isCalculating}
          >
            Calculate Product Matrix (C = A × B)
          </button>
        </div>

        {/* Result Matrix C */}
        <ResultMatrix
          result={resultMatrix}
          algorithmName={algorithmDisplayName}
          matrixSize={matrixSize}
          isStale={isStale}
          error={validationError}
        />

        {/* Step-by-Step Visualization */}
        {steps.length > 0 && (
          <StepVisualizer steps={steps} algorithm={algorithm} />
        )}

        {/* Performance Statistics */}
        {stats && <Statistics stats={stats} />}

        {/* Empirical Benchmark & Complexity Chart */}
        <BenchmarkChart />

        {/* Educational Information Section */}
        <AlgorithmInfo />

        {/* Footer */}
        <footer className="app-footer">
          <p>
            <strong>Strassen's Matrix Multiplication Visualizer</strong> — Designed for Design &
            Analysis of Algorithms (DAA) Education.
          </p>
          <p className="footer-sub">
            Frontend-only demonstration • Divide and Conquer • Master Theorem Analysis
          </p>
        </footer>
      </div>
    </div>
  );
}
