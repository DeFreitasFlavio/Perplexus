export interface GyroscopeData {
  x: number;
  y: number;
  z: number;
}

export interface MazeCell {
  color: string;
  isWall: boolean;
}

export interface MazeGrid {
  grid: MazeCell[][];
}

export interface Velocity {
  x: number;
  z: number;
  y: number;
}
