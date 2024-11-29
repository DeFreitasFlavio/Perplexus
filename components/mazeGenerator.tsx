import { MazeCell } from "@/types/types";

export const generateMaze = (width: number, height: number): MazeCell[][] => {
  const maze: MazeCell[][] = [];

  // Initialiser le labyrinthe avec des murs
  for (let y = 0; y < height; y++) {
    maze[y] = [];
    for (let x = 0; x < width; x++) {
      maze[y][x] = {
        color: "#666666",
        isWall: true,
      };
    }
  }

  // Algorithme de génération (Recursive Backtracking)
  const carve = (x: number, y: number) => {
    const directions = [
      [0, -2], // Nord
      [2, 0], // Est
      [0, 2], // Sud
      [-2, 0], // Ouest
    ];

    // Mélanger les directions aléatoirement
    directions.sort(() => Math.random() - 0.5);

    maze[y][x] = {
      color: "transparent",
      isWall: false,
    };

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (
        newX > 0 &&
        newX < width - 1 &&
        newY > 0 &&
        newY < height - 1 &&
        maze[newY][newX].isWall
      ) {
        // Creuser le mur entre la cellule actuelle et la nouvelle cellule
        maze[y + dy / 2][x + dx / 2] = {
          color: "transparent",
          isWall: false,
        };
        carve(newX, newY);
      }
    }
  };

  // Commencer la génération au centre
  carve(1, 1);
  return maze;
};
