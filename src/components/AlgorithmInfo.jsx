import React from 'react';
import { BookOpen, HelpCircle, GitFork, Scale, ArrowRight, Zap } from 'lucide-react';

export default function AlgorithmInfo() {
  return (
    <div className="education-card">
      <div className="education-header">
        <BookOpen size={20} className="text-blue" />
        <h3 className="education-title">Understanding Strassen's Algorithm</h3>
      </div>

      <div className="education-grid">
        {/* Concept 1 */}
        <div className="edu-topic-card">
          <div className="topic-header">
            <HelpCircle size={18} className="topic-icon" />
            <h4 className="topic-title">What is Matrix Multiplication?</h4>
          </div>
          <p className="topic-text">
            Matrix multiplication computes the product <code>C = A × B</code>, where each element{' '}
            <code>C[i][j]</code> is the dot product of row <code>i</code> of Matrix A and column{' '}
            <code>j</code> of Matrix B:
          </p>
          <div className="topic-formula">
            <code>C[i][j] = Σ (A[i][k] × B[k][j])</code>
          </div>
          <p className="topic-text">
            For an <em>n × n</em> matrix, the standard approach requires 3 nested loops, resulting in{' '}
            <strong>n³ scalar multiplications</strong> and <strong>n³ − n² scalar additions</strong>.
          </p>
        </div>

        {/* Concept 2 */}
        <div className="edu-topic-card">
          <div className="topic-header">
            <GitFork size={18} className="topic-icon" />
            <h4 className="topic-title">Divide-and-Conquer Approach</h4>
          </div>
          <p className="topic-text">
            Any square matrix of size <em>n × n</em> can be partitioned into four submatrices of size{' '}
            <em>(n/2) × (n/2)</em>:
          </p>
          <div className="topic-formula">
            <code>
              A = [ [A₁₁, A₁₂], [A₂₁, A₂₂] ]<br />
              B = [ [B₁₁, B₁₂], [B₂₁, B₂₂] ]
            </code>
          </div>
          <p className="topic-text">
            Standard block multiplication still evaluates <strong>8 submatrix multiplications</strong>:{' '}
            <code>T(n) = 8T(n/2) + O(n²) ⇒ O(n³)</code> by Master Theorem.
          </p>
        </div>

        {/* Concept 3 */}
        <div className="edu-topic-card highlight-topic">
          <div className="topic-header">
            <Zap size={18} className="topic-icon text-blue" />
            <h4 className="topic-title">Strassen's Breakthrough: 7 Products</h4>
          </div>
          <p className="topic-text">
            In 1969, Volker Strassen discovered clever linear combinations allowing matrix multiplication
            with only <strong>7 recursive multiplications</strong> (M1 through M7) instead of 8:
          </p>
          <div className="topic-formula">
            <code>T(n) = 7T(n/2) + O(n²)</code>
          </div>
          <p className="topic-text">
            Applying the Master Theorem (Case 1 where log₂7 ≈ 2.807 &gt; 2):
          </p>
          <div className="topic-formula highlight-formula">
            <strong>Time Complexity: O(n<sup>log₂7</sup>) ≈ O(n<sup>2.807</sup>)</strong>
          </div>
        </div>

        {/* Concept 4 */}
        <div className="edu-topic-card">
          <div className="topic-header">
            <Scale size={18} className="topic-icon" />
            <h4 className="topic-title">Practical Trade-offs & Hybrid Thresholds</h4>
          </div>
          <p className="topic-text">
            While Strassen reduces the number of multiplications (the slowest operation in hardware), it increases
            the number of scalar additions from 4 to 18 for 2×2 blocks and adds recursion overhead.
          </p>
          <ul className="tradeoff-list">
            <li>
              <strong>Small matrices (n &lt; 64):</strong> Traditional loops are faster due to cache locality and zero call overhead.
            </li>
            <li>
              <strong>Large matrices (n ≥ 128):</strong> Strassen's lower asymptotic exponent overtakes traditional multiplication.
            </li>
            <li>
              <strong>In Production:</strong> Libraries like BLAS switch to Strassen only when matrix dimensions exceed a crossover threshold.
            </li>
          </ul>
        </div>

        {/* Concept 5 */}
        <div className="edu-topic-card">
          <div className="topic-header">
            <BookOpen size={18} className="topic-icon text-blue" />
            <h4 className="topic-title">Non-Power-of-2 Matrices (e.g. 3×3)</h4>
          </div>
          <p className="topic-text">
            Strassen's algorithm requires matrices to be recursively halved into equal quadrants. When <em>n</em> is not a power of 2 (such as 3×3):
          </p>
          <div className="topic-formula">
            <code>3×3 &rarr; Pad with zeros to 4×4 &rarr; Strassen &rarr; Unpad</code>
          </div>
          <p className="topic-text">
            Zero-padding preserves mathematical correctness while satisfying the 2<sup>k</sup> dimensional requirement.
          </p>
        </div>
      </div>
    </div>
  );
}
