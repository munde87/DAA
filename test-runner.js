import { multiplyTraditional } from './src/utils/traditional.js';
import { multiplyStrassen } from './src/utils/strassen.js';
import {
  matricesEqual,
  createIdentityMatrix,
  createZeroMatrix,
  EXAMPLE_2X2_A,
  EXAMPLE_2X2_B,
  EXAMPLE_4X4_A,
  EXAMPLE_4X4_B
} from './src/utils/matrixUtils.js';

console.log('--- RUNNING MATRIX MULTIPLICATION TESTS ---');

// Test 1: Known 2x2 Example
const t1Trad = multiplyTraditional(EXAMPLE_2X2_A, EXAMPLE_2X2_B);
const t1Strassen = multiplyStrassen(EXAMPLE_2X2_A, EXAMPLE_2X2_B);
const expected2x2 = [[19, 22], [43, 50]];

console.log('Test 1 (Known 2x2 Example):');
console.log('Traditional Result:', t1Trad.result);
console.log('Strassen Result:', t1Strassen.result);
console.log('Matches Expected [[19, 22], [43, 50]]:', matricesEqual(t1Trad.result, expected2x2) && matricesEqual(t1Strassen.result, expected2x2) ? 'PASS' : 'FAIL');
console.log('Strassen Scalar Mults:', t1Strassen.stats.scalarMultiplications, '(Expected: 7)');
console.log('Traditional Scalar Mults:', t1Trad.stats.scalarMultiplications, '(Expected: 8)');

// Test 2: Identity Matrix
const I2 = createIdentityMatrix(2);
const t2Trad = multiplyTraditional(EXAMPLE_2X2_A, I2);
const t2Strassen = multiplyStrassen(EXAMPLE_2X2_A, I2);
console.log('\nTest 2 (Multiplication by Identity):');
console.log('A * I = A:', matricesEqual(t2Trad.result, EXAMPLE_2X2_A) && matricesEqual(t2Strassen.result, EXAMPLE_2X2_A) ? 'PASS' : 'FAIL');

// Test 3: Zero Matrix
const Z2 = createZeroMatrix(2);
const t3Trad = multiplyTraditional(EXAMPLE_2X2_A, Z2);
const t3Strassen = multiplyStrassen(EXAMPLE_2X2_A, Z2);
console.log('\nTest 3 (Multiplication by Zero Matrix):');
console.log('A * 0 = 0:', matricesEqual(t3Trad.result, Z2) && matricesEqual(t3Strassen.result, Z2) ? 'PASS' : 'FAIL');

// Test 4: Negative Values
const negA = [[-2, 3], [4, -1]];
const negB = [[1, -5], [-3, 2]];
const t4Trad = multiplyTraditional(negA, negB);
const t4Strassen = multiplyStrassen(negA, negB);
console.log('\nTest 4 (Negative values):');
console.log('Traditional:', t4Trad.result);
console.log('Strassen:', t4Strassen.result);
console.log('Equal:', matricesEqual(t4Trad.result, t4Strassen.result) ? 'PASS' : 'FAIL');

// Test 5: 3x3 Matrices (Non-power-of-2 with padding)
import { EXAMPLE_3X3_A, EXAMPLE_3X3_B } from './src/utils/matrixUtils.js';
const t3x3Trad = multiplyTraditional(EXAMPLE_3X3_A, EXAMPLE_3X3_B);
const t3x3Strassen = multiplyStrassen(EXAMPLE_3X3_A, EXAMPLE_3X3_B);
console.log('\nTest 5 (3x3 Matrix multiplication with padding):');
console.log('Traditional 3x3:', t3x3Trad.result);
console.log('Strassen 3x3:', t3x3Strassen.result);
console.log('Equal:', matricesEqual(t3x3Trad.result, t3x3Strassen.result) ? 'PASS' : 'FAIL');

// Test 6: 4x4 Matrices
const t5Trad = multiplyTraditional(EXAMPLE_4X4_A, EXAMPLE_4X4_B);
const t5Strassen = multiplyStrassen(EXAMPLE_4X4_A, EXAMPLE_4X4_B);
console.log('\nTest 6 (4x4 Matrix multiplication):');
console.log('Strassen equals Traditional:', matricesEqual(t5Trad.result, t5Strassen.result) ? 'PASS' : 'FAIL');
console.log('Traditional Mults (4x4):', t5Trad.stats.scalarMultiplications, '(Expected: 64)');
console.log('Strassen Mults (4x4):', t5Strassen.stats.scalarMultiplications, '(Expected: 49)');

console.log('\nALL MATHEMATICAL TESTS COMPLETED SUCCESSFULLY!');
