import React from 'react';
import { Grid, Sparkles, BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-badge">
        <Sparkles size={14} className="icon-pulse" />
        <span>Design & Analysis of Algorithms</span>
      </div>
      <div className="header-title-row">
        <div className="title-icon-wrapper">
          <Grid size={28} />
        </div>
        <div>
          <h1 className="header-title">Strassen's Matrix Multiplication Visualizer</h1>
          <p className="header-subtitle">Interactive Matrix Multiplication System</p>
        </div>
      </div>
      <p className="header-description">
        Explore how Strassen's algorithm multiplies square matrices using divide-and-conquer,
        reducing 8 recursive multiplications to 7 step-by-step.
      </p>
    </header>
  );
}
