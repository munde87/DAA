import React from 'react';
import { Layers, Zap } from 'lucide-react';

export default function AlgorithmSelector({ selectedAlgorithm, onSelectAlgorithm }) {
  return (
    <div className="algorithm-selector-container">
      <div className="section-label">Select Multiplication Algorithm</div>
      <div className="algorithm-options-grid">
        <button
          type="button"
          className={`algorithm-card ${selectedAlgorithm === 'strassen' ? 'active' : ''}`}
          onClick={() => onSelectAlgorithm('strassen')}
        >
          <div className="algo-card-header">
            <Zap size={20} className="algo-icon strassen-icon" />
            <div className="algo-title-block">
              <span className="algo-name">Strassen's Algorithm</span>
              <span className="complexity-tag tag-strassen">O(n<sup>2.807</sup>)</span>
            </div>
          </div>
          <p className="algo-desc">
            Divide-and-conquer using 7 intermediate products (M1–M7) instead of 8.
          </p>
        </button>

        <button
          type="button"
          className={`algorithm-card ${selectedAlgorithm === 'traditional' ? 'active' : ''}`}
          onClick={() => onSelectAlgorithm('traditional')}
        >
          <div className="algo-card-header">
            <Layers size={20} className="algo-icon trad-icon" />
            <div className="algo-title-block">
              <span className="algo-name">Traditional Multiplication</span>
              <span className="complexity-tag tag-trad">O(n<sup>3</sup>)</span>
            </div>
          </div>
          <p className="algo-desc">
            Standard row-by-column dot products with 3 nested loops.
          </p>
        </button>
      </div>
    </div>
  );
}
