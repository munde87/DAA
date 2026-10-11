# Strassen's Matrix Multiplication Visualizer

An interactive, beginner-friendly educational web application built with **React**, **Vite**, and **vanilla CSS** that demonstrates how **Strassen's Algorithm** multiplies square matrices using divide-and-conquer, step-by-step.

---

## 🌟 Key Features

1. **Matrix Dimensions**: Supports **2×2**, **3×3** (with dynamic zero-padding & unpadding for non-powers of 2), and **4×4** square matrices.
2. **Interactive Grids**: Editable integer cells for **Matrix A** and **Matrix B** supporting positive numbers, zero, and negative values.
3. **Control Toolbar**:
   - **Dimension Selector**: Toggle between 2×2, 3×3, and 4×4 with automatic state adjustment.
   - **Load Example**: Pre-populates verified textbook examples.
   - **Randomize**: Generates clean small integers.
   - **Reset**: Restores default 2×2 state and clears all results.
   - **Calculate**: Validates inputs and dynamically computes product matrices.
4. **Algorithm Selection**:
   - **Strassen's Algorithm**: $O(n^{\log_2 7}) \approx O(n^{2.807})$ with 7 intermediate products.
   - **Traditional Multiplication**: $O(n^3)$ row-by-column dot products.
5. **Step-by-Step Visualization**:
   - For Strassen: Displays zero-padding (for 3×3), partitioning into submatrices ($A_{11}$–$A_{22}$, $B_{11}$–$B_{22}$), calculation of the 7 products ($M_1$ through $M_7$), quadrant combinations ($C_{11}$ through $C_{22}$), unpadding, and final product matrix.
   - For Traditional: Highlights row and column dot-product combinations cell-by-cell.
   - Controls: **Previous Step**, **Next Step**, **Auto Play / Pause**, **Restart**, and **Step Slider**.
6. **Instrumented Statistics**:
   - Scalar multiplications count (7 vs 8 for 2×2; 49 block mults for 3×3/4×4 vs 64/27).
   - Scalar additions/subtractions count.
   - Approximate execution time measured via `performance.now()`.
7. **Empirical Benchmark & Comparison Chart**:
   - Benchmarks 2×2, 3×3, and 4×4 with verified mathematical equivalence checks.
   - Interactive bar charts powered by Recharts.
8. **Fully Responsive Design**:
   - Custom-tailored layouts for desktop, tablet, phablet, and mobile (down to 320px).
   - Dynamic cell sizing, touch-friendly buttons, and horizontal overflow scrolling for math expressions.
9. **Educational Guide**:
   - Explains divide-and-conquer, Master Theorem, why 7 products instead of 8 reduces complexity, how odd dimensions like 3×3 are zero-padded, and practical crossover thresholds.

---

## 📐 Strassen's Formulas Implemented

For submatrices:
$$A = \begin{pmatrix} A_{11} & A_{12} \\ A_{21} & A_{22} \end{pmatrix}, \quad B = \begin{pmatrix} B_{11} & B_{12} \\ B_{21} & B_{22} \end{pmatrix}$$

### The 7 Intermediate Products:
- $M_1 = (A_{11} + A_{22})(B_{11} + B_{22})$
- $M_2 = (A_{21} + A_{22}) B_{11}$
- $M_3 = A_{11}(B_{12} - B_{22})$
- $M_4 = A_{22}(B_{21} - B_{11})$
- $M_5 = (A_{11} + A_{12}) B_{22}$
- $M_6 = (A_{21} - A_{11})(B_{11} + B_{12})$
- $M_7 = (A_{12} - A_{22})(B_{21} + B_{22})$

### Result Quadrants:
- $C_{11} = M_1 + M_4 - M_5 + M_7$
- $C_{12} = M_3 + M_5$
- $C_{21} = M_2 + M_4$
- $C_{22} = M_1 - M_2 + M_3 + M_6$

---

## 📂 Project Structure

```
DAA/
├── src/
│   ├── components/
│   │   ├── Header.jsx               # App title, subtitle, and badges
│   │   ├── MatrixConfiguration.jsx  # Size toggles (2x2, 4x4) and action buttons
│   │   ├── MatrixInput.jsx          # Editable matrix grid with bracket styling
│   │   ├── AlgorithmSelector.jsx    # Select Strassen vs Traditional
│   │   ├── ResultMatrix.jsx         # Highlighted Result Matrix C card
│   │   ├── StepVisualizer.jsx       # Step-by-step trace & auto-play navigation
│   │   ├── Statistics.jsx           # Performance & operation count statistics
│   │   ├── BenchmarkChart.jsx       # Recharts bar chart & benchmark comparison
│   │   └── AlgorithmInfo.jsx        # DAA educational concepts & explanations
│   ├── utils/
│   │   ├── matrixUtils.js           # Add, subtract, partition, join, validate
│   │   ├── traditional.js           # Traditional O(n³) algorithm & step trace
│   │   ├── strassen.js              # Recursive Strassen O(n^2.807) algorithm
│   │   └── benchmark.js             # Performance testing & equivalence tests
│   ├── App.jsx                      # Main dashboard component
│   ├── main.jsx                     # React DOM entry point
│   └── index.css                    # Modern clean dashboard styles
├── index.html                       # HTML5 template with Google Fonts
├── vite.config.js                   # Vite configuration
├── package.json                     # Project scripts and dependencies
└── test-runner.js                   # Automated unit test suite
```

---

## 🚀 How to Run the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

3. **Run the Automated Tests**:
   ```bash
   npm test
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```
