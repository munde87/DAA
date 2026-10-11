/**
 * Matrix Utility Functions for Matrix Multiplication & Visualization
 */

// Create an n x n zero matrix
export function createZeroMatrix(n) {
  return Array.from({ length: n }, () => Array(n).fill(0));
}

// Create an n x n identity matrix
export function createIdentityMatrix(n) {
  const result = createZeroMatrix(n);
  for (let i = 0; i < n; i++) {
    result[i][i] = 1;
  }
  return result;
}

// Deep clone a matrix
export function cloneMatrix(M) {
  return M.map(row => [...row]);
}

// Check if two matrices are equal in dimension and values
export function matricesEqual(A, B) {
  if (!A || !B) return false;
  if (A.length !== B.length) return false;
  for (let i = 0; i < A.length; i++) {
    if (A[i].length !== B[i].length) return false;
    for (let j = 0; j < A[i].length; j++) {
      if (A[i][j] !== B[i][j]) return false;
    }
  }
  return true;
}

// Add two matrices with optional operation counter tracking
export function addMatrices(A, B, opTracker = null) {
  const n = A.length;
  const C = createZeroMatrix(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      C[i][j] = A[i][j] + B[i][j];
      if (opTracker) {
        opTracker.additions += 1;
      }
    }
  }
  return C;
}

// Subtract matrix B from matrix A with optional operation counter tracking
export function subtractMatrices(A, B, opTracker = null) {
  const n = A.length;
  const C = createZeroMatrix(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      C[i][j] = A[i][j] - B[i][j];
      if (opTracker) {
        opTracker.additions += 1; // addition/subtraction count
      }
    }
  }
  return C;
}

// Split an n x n matrix into four (n/2) x (n/2) submatrices: A11, A12, A21, A22
export function splitMatrix(M) {
  const n = M.length;
  const half = Math.floor(n / 2);
  const A11 = createZeroMatrix(half);
  const A12 = createZeroMatrix(half);
  const A21 = createZeroMatrix(half);
  const A22 = createZeroMatrix(half);

  for (let i = 0; i < half; i++) {
    for (let j = 0; j < half; j++) {
      A11[i][j] = M[i][j];
      A12[i][j] = M[i][j + half];
      A21[i][j] = M[i + half][j];
      A22[i][j] = M[i + half][j + half];
    }
  }

  return {
    M11: A11,
    M12: A12,
    M21: A21,
    M22: A22,
    A11,
    A12,
    A21,
    A22,
    B11: A11,
    B12: A12,
    B21: A21,
    B22: A22
  };
}

// Join four (n/2) x (n/2) submatrices into an n x n matrix
export function joinMatrices(C11, C12, C21, C22) {
  const half = C11.length;
  const n = half * 2;
  const C = createZeroMatrix(n);

  for (let i = 0; i < half; i++) {
    for (let j = 0; j < half; j++) {
      C[i][j] = C11[i][j];
      C[i][j + half] = C12[i][j];
      C[i + half][j] = C21[i][j];
      C[i + half][j + half] = C22[i][j];
    }
  }

  return C;
}

// Generate a random n x n matrix with small integers
export function generateRandomMatrix(n, min = -5, max = 9) {
  const M = createZeroMatrix(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Pick random integer between min and max
      M[i][j] = Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
  return M;
}

// Validate that matrix string inputs are valid integers
export function validateMatrix(grid) {
  if (!grid || !Array.isArray(grid)) {
    return { isValid: false, error: 'Matrix is missing or invalid structure.' };
  }

  const n = grid.length;
  const parsed = [];

  for (let r = 0; r < n; r++) {
    const row = [];
    for (let c = 0; c < n; c++) {
      const val = grid[r][c];
      if (val === '' || val === null || val === undefined) {
        return {
          isValid: false,
          error: `Cell at row ${r + 1}, column ${c + 1} cannot be empty.`,
          row: r,
          col: c
        };
      }
      const num = Number(val);
      if (!Number.isInteger(num)) {
        return {
          isValid: false,
          error: `Cell at row ${r + 1}, column ${c + 1} must be an integer.`,
          row: r,
          col: c
        };
      }
      row.push(num);
    }
    parsed.push(row);
  }

  return { isValid: true, error: null, matrix: parsed };
}

// Next power of two (for matrices whose dimension is not a power of 2, like 3x3)
export function nextPowerOfTwo(n) {
  let p = 1;
  while (p < n) {
    p *= 2;
  }
  return p;
}

// Pad an n x n matrix with zeros to targetSize x targetSize
export function padMatrix(M, targetSize) {
  const currentSize = M.length;
  if (currentSize === targetSize) return cloneMatrix(M);

  const padded = createZeroMatrix(targetSize);
  for (let i = 0; i < currentSize; i++) {
    for (let j = 0; j < currentSize; j++) {
      padded[i][j] = M[i][j];
    }
  }
  return padded;
}

// Extract originalSize x originalSize from a padded matrix
export function unpadMatrix(M, originalSize) {
  const unpadded = createZeroMatrix(originalSize);
  for (let i = 0; i < originalSize; i++) {
    for (let j = 0; j < originalSize; j++) {
      unpadded[i][j] = M[i][j];
    }
  }
  return unpadded;
}

// Standard educational examples
export const EXAMPLE_2X2_A = [
  [1, 2],
  [3, 4]
];

export const EXAMPLE_2X2_B = [
  [5, 6],
  [7, 8]
];

export const EXAMPLE_3X3_A = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

export const EXAMPLE_3X3_B = [
  [9, 8, 7],
  [6, 5, 4],
  [3, 2, 1]
];

export const EXAMPLE_4X4_A = [
  [1, 2, 3, 1],
  [4, 1, 0, 2],
  [2, 3, 1, 4],
  [0, 1, 2, 3]
];

export const EXAMPLE_4X4_B = [
  [2, 0, 1, 3],
  [1, 3, 2, 0],
  [0, 1, 4, 2],
  [3, 2, 1, 1]
];

