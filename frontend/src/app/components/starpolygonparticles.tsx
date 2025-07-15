import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "@tsparticles/engine";
import Head from "next/head";
export default function StarParticles() {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);
    
  
  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: { value: "#000000" },
          },
          fpsLimit: 60,
          polygon: {
            enable: true,
            type: "inline",
            inline: {
              arrangement: "equidistant",
            },
            move: {
              type: "path",
              radius: 2,
            },
            url: "/star-solid.svg", // 👈 local SVG from public folder
            draw: {
              enable: true,
              stroke: {
                color: { value: "#ffffff" },
                width: 11,
              },
            },
            scale: 0.8,
            position: { x: 50, y: 50 },
          },
          particles: {
            number: {
              value: 250,
              density: {
                enable: false,
              },
            },
            move: {
              enable: false,
              speed:1,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: 2,
            },
            opacity: {
              value: 0.7,
              animation: {
                enable: true,
                speed: 0.5,
                minimumValue: 0.3,
                sync: false,
              },
            },
            color: {
              value: "#ffffff",
            },
          },
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />
    </div>
  );
}
