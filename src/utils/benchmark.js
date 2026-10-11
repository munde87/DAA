import { multiplyTraditional } from './traditional.js';
import { multiplyStrassen } from './strassen.js';
import {
  matricesEqual,
  EXAMPLE_2X2_A,
  EXAMPLE_2X2_B,
  EXAMPLE_3X3_A,
  EXAMPLE_3X3_B,
  EXAMPLE_4X4_A,
  EXAMPLE_4X4_B
} from './matrixUtils.js';

/**
 * Run deterministic benchmarks for 2x2, 3x3, and 4x4 matrix multiplication
 * Runs multiple iterations to accurately measure modern JS execution time.
 */
export function runBenchmark() {
  const testCases = [
    { size: 2, label: '2×2 Matrix', A: EXAMPLE_2X2_A, B: EXAMPLE_2X2_B, iterations: 2000 },
    { size: 3, label: '3×3 Matrix', A: EXAMPLE_3X3_A, B: EXAMPLE_3X3_B, iterations: 1500 },
    { size: 4, label: '4×4 Matrix', A: EXAMPLE_4X4_A, B: EXAMPLE_4X4_B, iterations: 1000 }
  ];

  const results = [];
  let allMatched = true;

  for (const test of testCases) {
    const { size, label, A, B, iterations } = test;

    // Single run for operations count and correctness verification
    const tradSingle = multiplyTraditional(A, B);
    const strassenSingle = multiplyStrassen(A, B);

    const matches = matricesEqual(tradSingle.result, strassenSingle.result);
    if (!matches) {
      allMatched = false;
    }

    // Benchmark timing over multiple iterations for statistical reliability
    const tStartTrad = performance.now();
    for (let i = 0; i < iterations; i++) {
      multiplyTraditional(A, B);
    }
    const tEndTrad = performance.now();
    const tradTimePerOp = (tEndTrad - tStartTrad) / iterations;

    const tStartStrassen = performance.now();
    for (let i = 0; i < iterations; i++) {
      multiplyStrassen(A, B);
    }
    const tEndStrassen = performance.now();
    const strassenTimePerOp = (tEndStrassen - tStartStrassen) / iterations;

    results.push({
      size,
      label,
      iterations,
      matches,
      traditional: {
        timeMs: Number(tradTimePerOp.toFixed(4)),
        multiplications: tradSingle.stats.scalarMultiplications,
        additions: tradSingle.stats.scalarAdditions,
        totalOps: tradSingle.stats.totalScalarOps
      },
      strassen: {
        timeMs: Number(strassenTimePerOp.toFixed(4)),
        multiplications: strassenSingle.stats.scalarMultiplications,
        additions: strassenSingle.stats.scalarAdditions,
        totalOps: strassenSingle.stats.totalScalarOps
      }
    });
  }

  return {
    allMatched,
    benchmarks: results,
    explanation: 'Small matrix sizes (2×2 and 4×4) demonstrate recursive mechanics and operation count reduction (e.g. 7 vs 8 multiplications for 2×2, 49 vs 64 for 4×4). In browser JS engines, recursive function call overhead and submatrix allocation dominate execution time at small n, which is why Strassen is practically faster when n ≥ 64 or 128.'
  };
}
