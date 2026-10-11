import {
  createZeroMatrix,
  cloneMatrix,
  addMatrices,
  subtractMatrices,
  splitMatrix,
  joinMatrices,
  nextPowerOfTwo,
  padMatrix,
  unpadMatrix
} from './matrixUtils.js';

/**
 * Strassen's Matrix Multiplication Algorithm with instrumentation and step logging
 *
 * @param {number[][]} A - Matrix A (supports 2x2, 3x3 with padding, 4x4)
 * @param {number[][]} B - Matrix B
 * @returns {object} { result, steps, stats }
 */
export function multiplyStrassen(A, B) {
  const n = A.length;
  const startTime = performance.now();

  const tracker = {
    multiplications: 0,
    additions: 0, // includes additions and subtractions
    recursiveCalls: 0
  };

  const steps = [];

  // Step 1: Input matrices
  steps.push({
    id: 1,
    title: 'Input Matrices Overview',
    description: `Multiply Matrix A (${n}×${n}) by Matrix B (${n}×${n}) using Strassen's Divide and Conquer algorithm.`,
    matrices: { A: cloneMatrix(A), B: cloneMatrix(B) },
    type: 'overview'
  });

  const targetSize = nextPowerOfTwo(n);
  const needsPadding = targetSize !== n;
  let workA = A;
  let workB = B;

  if (needsPadding) {
    workA = padMatrix(A, targetSize);
    workB = padMatrix(B, targetSize);
    steps.push({
      id: steps.length + 1,
      title: `Step 2: Zero-Padding (${n}×${n} → ${targetSize}×${targetSize})`,
      description: `Dimension n=${n} is not a power of 2. In DAA, Strassen's algorithm pads the matrices with zeros to the next power of 2 (${targetSize}×${targetSize}) so that recursive quadrant bisection can be applied.`,
      type: 'overview',
      matrices: { A: cloneMatrix(workA), B: cloneMatrix(workB) }
    });
  }

  // Execute recursive multiplication with step recording
  const fullResult = strassenRecursive(workA, workB, tracker, steps, 0, 'Top Level');

  const endTime = performance.now();
  const executionTimeMs = Math.max(0, endTime - startTime);

  let result = fullResult;

  if (needsPadding) {
    result = unpadMatrix(fullResult, n);
    steps.push({
      id: steps.length + 1,
      title: `Final Step: Unpad to Extract Original ${n}×${n} Result Matrix`,
      description: `Extract the top-left ${n}×${n} submatrix from the ${targetSize}×${targetSize} intermediate result, discarding the padded zero-fill boundaries.`,
      formula: `C = Extract_${n}×${n}(C_padded)`,
      resultMatrix: cloneMatrix(result),
      type: 'final',
      isFinal: true
    });
  } else {
    steps.push({
      id: steps.length + 1,
      title: 'Final Combined Result Matrix C',
      description: `Strassen multiplication complete! Reduced scalar multiplications from ${Math.pow(n, 3)} (traditional) to ${tracker.multiplications}.`,
      formula: 'C = A × B',
      resultMatrix: cloneMatrix(result),
      type: 'final',
      isFinal: true
    });
  }

  return {
    result,
    steps,
    stats: {
      algorithm: "Strassen's Algorithm (O(n^2.807))",
      dimensions: `${n}×${n}`,
      matrixSize: n,
      scalarMultiplications: tracker.multiplications,
      scalarAdditions: tracker.additions,
      totalScalarOps: tracker.multiplications + tracker.additions,
      recursiveCalls: tracker.recursiveCalls,
      executionTimeMs: executionTimeMs
    }
  };
}

/**
 * Recursive Strassen implementation
 */
function strassenRecursive(A, B, tracker, steps, depth = 0, contextLabel = '') {
  const n = A.length;
  tracker.recursiveCalls++;

  // Base case: 1x1 scalar multiplication
  if (n === 1) {
    tracker.multiplications += 1;
    return [[A[0][0] * B[0][0]]];
  }

  // Partition A and B into 4 quadrants
  const { A11, A12, A21, A22 } = splitMatrix(A);
  const { B11, B12, B21, B22 } = splitMatrix(B);

  // Only record educational steps at top level (depth 0) to avoid overwhelming the user
  const recordSteps = depth === 0;

  if (recordSteps) {
    steps.push({
      id: steps.length + 1,
      title: `Step 2: Submatrix Partitioning (${n}×${n} → 4 × ${n / 2}×${n / 2})`,
      description: `Divide matrices A and B into four quadrants each: A11, A12, A21, A22 and B11, B12, B21, B22.`,
      type: 'partition',
      submatrices: {
        A11: cloneMatrix(A11),
        A12: cloneMatrix(A12),
        A21: cloneMatrix(A21),
        A22: cloneMatrix(A22),
        B11: cloneMatrix(B11),
        B12: cloneMatrix(B12),
        B21: cloneMatrix(B21),
        B22: cloneMatrix(B22)
      }
    });
  }

  // Helper for internal recursive call
  const subMultiply = (X, Y) => strassenRecursive(X, Y, tracker, steps, depth + 1);

  // Calculate the 7 Strassen products M1 .. M7
  // M1 = (A11 + A22)(B11 + B22)
  const A11_plus_A22 = addMatrices(A11, A22, tracker);
  const B11_plus_B22 = addMatrices(B11, B22, tracker);
  const M1 = subMultiply(A11_plus_A22, B11_plus_B22);

  if (recordSteps) {
    steps.push({
      id: steps.length + 1,
      title: 'Step 3: Calculate M1',
      description: 'M1 combines the diagonals of both matrices.',
      formula: 'M1 = (A11 + A22) × (B11 + B22)',
      parts: {
        leftName: '(A11 + A22)',
        leftMatrix: cloneMatrix(A11_plus_A22),
        rightName: '(B11 + B22)',
        rightMatrix: cloneMatrix(B11_plus_B22)
      },
      product: cloneMatrix(M1),
      productName: 'M1',
      type: 'product'
    });
  }

  // M2 = (A21 + A22) * B11
  const A21_plus_A22 = addMatrices(A21, A22, tracker);
  const M2 = subMultiply(A21_plus_A22, B11);

  if (recordSteps) {
    steps.push({
      id: steps.length + 1,
      title: 'Step 4: Calculate M2',
      description: 'M2 combines row 2 of Matrix A with top-left of Matrix B.',
      formula: 'M2 = (A21 + A22) × B11',
      parts: {
        leftName: '(A21 + A22)',
        leftMatrix: cloneMatrix(A21_plus_A22),
        rightName: 'B11',
        rightMatrix: cloneMatrix(B11)
      },
      product: cloneMatrix(M2),
      productName: 'M2',
      type: 'product'
    });
  }

  // M3 = A11 * (B12 - B22)
  const B12_minus_B22 = subtractMatrices(B12, B22, tracker);
  const M3 = subMultiply(A11, B12_minus_B22);

  if (recordSteps) {
    steps.push({
      id: steps.length + 1,
      title: 'Step 5: Calculate M3',
      description: 'M3 combines top-left of Matrix A with column 2 difference of Matrix B.',
      formula: 'M3 = A11 × (B12 − B22)',
      parts: {
        leftName: 'A11',
        leftMatrix: cloneMatrix(A11),
        rightName: '(B12 − B22)',
        rightMatrix: cloneMatrix(B12_minus_B22)
      },
      product: cloneMatrix(M3),
      productName: 'M3',
      type: 'product'
    });
  }

  // M4 = A22 * (B21 - B11)
  const B21_minus_B11 = subtractMatrices(B21, B11, tracker);
  const M4 = subMultiply(A22, B21_minus_B11);

  if (recordSteps) {
    steps.push({
      id: steps.length + 1,
      title: 'Step 6: Calculate M4',
      description: 'M4 combines bottom-right of Matrix A with column 1 difference of Matrix B.',
      formula: 'M4 = A22 × (B21 − B11)',
      parts: {
        leftName: 'A22',
        leftMatrix: cloneMatrix(A22),
        rightName: '(B21 − B11)',
        rightMatrix: cloneMatrix(B21_minus_B11)
      },
      product: cloneMatrix(M4),
      productName: 'M4',
      type: 'product'
    });
  }

  // M5 = (A11 + A12) * B22
  const A11_plus_A12 = addMatrices(A11, A12, tracker);
  const M5 = subMultiply(A11_plus_A12, B22);

  if (recordSteps) {
    steps.push({
      id: steps.length + 1,
      title: 'Step 7: Calculate M5',
      description: 'M5 combines row 1 of Matrix A with bottom-right of Matrix B.',
      formula: 'M5 = (A11 + A12) × B22',
      parts: {
        leftName: '(A11 + A12)',
        leftMatrix: cloneMatrix(A11_plus_A12),
        rightName: 'B22',
        rightMatrix: cloneMatrix(B22)
      },
      product: cloneMatrix(M5),
      productName: 'M5',
      type: 'product'
    });
  }

  // M6 = (A21 - A11) * (B11 + B12)
  const A21_minus_A11 = subtractMatrices(A21, A11, tracker);
  const B11_plus_B12 = addMatrices(B11, B12, tracker);
  const M6 = subMultiply(A21_minus_A11, B11_plus_B12);

  if (recordSteps) {
    steps.push({
      id: steps.length + 1,
      title: 'Step 8: Calculate M6',
      description: 'M6 combines row differences of Matrix A with row 1 sum of Matrix B.',
      formula: 'M6 = (A21 − A11) × (B11 + B12)',
      parts: {
        leftName: '(A21 − A11)',
        leftMatrix: cloneMatrix(A21_minus_A11),
        rightName: '(B11 + B12)',
        rightMatrix: cloneMatrix(B11_plus_B12)
      },
      product: cloneMatrix(M6),
      productName: 'M6',
      type: 'product'
    });
  }

  // M7 = (A12 - A22) * (B21 + B22)
  const A12_minus_A22 = subtractMatrices(A12, A22, tracker);
  const B21_plus_B22 = addMatrices(B21, B22, tracker);
  const M7 = subMultiply(A12_minus_A22, B21_plus_B22);

  if (recordSteps) {
    steps.push({
      id: steps.length + 1,
      title: 'Step 9: Calculate M7',
      description: 'M7 combines row differences of Matrix A with row 2 sum of Matrix B.',
      formula: 'M7 = (A12 − A22) × (B21 + B22)',
      parts: {
        leftName: '(A12 − A22)',
        leftMatrix: cloneMatrix(A12_minus_A22),
        rightName: '(B21 + B22)',
        rightMatrix: cloneMatrix(B21_plus_B22)
      },
      product: cloneMatrix(M7),
      productName: 'M7',
      type: 'product'
    });
  }

  // Combining the results:
  // C11 = M1 + M4 - M5 + M7
  const C11 = addMatrices(
    subtractMatrices(addMatrices(M1, M4, tracker), M5, tracker),
    M7,
    tracker
  );

  // C12 = M3 + M5
  const C12 = addMatrices(M3, M5, tracker);

  // C21 = M2 + M4
  const C21 = addMatrices(M2, M4, tracker);

  // C22 = M1 - M2 + M3 + M6
  const C22 = addMatrices(
    addMatrices(subtractMatrices(M1, M2, tracker), M3, tracker),
    M6,
    tracker
  );

  if (recordSteps) {
    steps.push({
      id: steps.length + 1,
      title: 'Step 10: Combine Products into Quadrants (C11, C12, C21, C22)',
      description: 'Assemble M1 through M7 using Strassen’s quadrant combination formulas.',
      type: 'combination',
      combinations: [
        { name: 'C11', formula: 'C11 = M1 + M4 − M5 + M7', matrix: cloneMatrix(C11) },
        { name: 'C12', formula: 'C12 = M3 + M5', matrix: cloneMatrix(C12) },
        { name: 'C21', formula: 'C21 = M2 + M4', matrix: cloneMatrix(C21) },
        { name: 'C22', formula: 'C22 = M1 − M2 + M3 + M6', matrix: cloneMatrix(C22) }
      ],
      allM: {
        M1: cloneMatrix(M1),
        M2: cloneMatrix(M2),
        M3: cloneMatrix(M3),
        M4: cloneMatrix(M4),
        M5: cloneMatrix(M5),
        M6: cloneMatrix(M6),
        M7: cloneMatrix(M7)
      }
    });
  }

  // Assemble full matrix
  const C = joinMatrices(C11, C12, C21, C22);
  return C;
}
