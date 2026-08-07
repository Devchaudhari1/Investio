import { loadFull } from "tsparticles";
import { loadPolygonMaskPlugin } from "@tsparticles/plugin-polygon-mask";
import type { Engine } from "@tsparticles/engine";

export const particlesInit = async (engine: Engine): Promise<void> => {
  await loadFull(engine);
  await loadPolygonMaskPlugin(engine);
};
