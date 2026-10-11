import { createZeroMatrix, cloneMatrix } from './matrixUtils.js';

/**
 * Standard Traditional Matrix Multiplication (Row × Column)
 * Complexity: O(n^3)
 *
 * @param {number[][]} A - Matrix A (n x n)
 * @param {number[][]} B - Matrix B (n x n)
 * @returns {object} { result, steps, stats }
 */
export function multiplyTraditional(A, B) {
  const n = A.length;
  const startTime = performance.now();

  let multiplications = 0;
  let additions = 0;
  const steps = [];

  const C = createZeroMatrix(n);

  // Step 1: Initial State
  steps.push({
    id: 1,
    title: 'Input Matrices Overview',
    description: `Multiply Matrix A (${n}×${n}) by Matrix B (${n}×${n}) using traditional row-by-column dot products.`,
    matrices: { A: cloneMatrix(A), B: cloneMatrix(B) },
    formula: 'C[i][j] = \\sum_{k=0}^{n-1} A[i][k] \\times B[k][j]',
    currentC: cloneMatrix(C),
    activeCell: null
  });

  let stepId = 2;

  // Compute each element of C
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      const terms = [];
      const productStrings = [];

      for (let k = 0; k < n; k++) {
        const prod = A[i][k] * B[k][j];
        multiplications++;
        terms.push(prod);
        productStrings.push(`${A[i][k]} × ${B[k][j]}`);

        if (k > 0) {
          additions++;
        }
        sum += prod;
      }

      C[i][j] = sum;

      // Construct a clean arithmetic string
      // e.g. "C[1][1] = (1 × 5) + (2 × 7) = 5 + 14 = 19"
      const formulaStr = `C[${i + 1}][${j + 1}] = ${productStrings.join(' + ')}`;
      const calcStr = `${terms.join(' + ')} = ${sum}`;

      steps.push({
        id: stepId++,
        title: `Calculate C[${i + 1}][${j + 1}] (Row ${i + 1} · Column ${j + 1})`,
        description: `Dot product of row ${i + 1} of Matrix A and column ${j + 1} of Matrix B.`,
        formula: `${formulaStr} = ${calcStr}`,
        activeRow: i,
        activeCol: j,
        activeCell: { row: i, col: j, val: sum },
        currentC: cloneMatrix(C),
        matrices: { A: cloneMatrix(A), B: cloneMatrix(B) }
      });
    }
  }

  const endTime = performance.now();
  const executionTimeMs = Math.max(0, endTime - startTime);

  // Final summary step
  steps.push({
    id: stepId,
    title: 'Final Product Matrix C',
    description: `Traditional multiplication complete. All ${n * n} cells evaluated with ${multiplications} scalar multiplications and ${additions} scalar additions.`,
    formula: 'C = A × B',
    currentC: cloneMatrix(C),
    matrices: { A: cloneMatrix(A), B: cloneMatrix(B) },
    activeCell: null,
    isFinal: true
  });

  return {
    result: C,
    steps,
    stats: {
      algorithm: 'Traditional (Standard O(n³))',
      dimensions: `${n}×${n}`,
      matrixSize: n,
      scalarMultiplications: multiplications,
      scalarAdditions: additions,
      totalScalarOps: multiplications + additions,
      executionTimeMs: executionTimeMs
    }
  };
}
