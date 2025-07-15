'use client';
import React from "react";
import FusionStar from "../components/fusionstar";

function App() {
  return (
    <div>
      <FusionStar />
      <div style={{ position: "relative", zIndex: 1, color: "#fff", padding: "2rem" }}>
        <h1>Star Polygon Mask Example</h1>
        <p>Particles follow the shape of a star.</p>
      </div>
    </div>
  );
}

export default App;
