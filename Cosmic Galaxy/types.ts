
export interface GalaxyParameters {
  count: number;
  size: number;
  radius: number;
  branches: number;
  spin: number;
  randomness: number;
  randomnessPower: number;
  insideColor: string;
  outsideColor: string;
  animate: boolean;
  mouse: boolean;
}

export interface DoFParameters {
  opacity: number;
  focusDistance: number;
  focalLength: number;
  bokehScale: number;
  width: number;
  height: number;
  focusX: number;
  focusY: number;
  focusZ: number;
}
