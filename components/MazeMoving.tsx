import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Group,
} from "three";
import { Renderer } from "expo-three";
import { GLView } from "expo-gl";
import { ExpoWebGLRenderingContext } from "expo-gl";
import { GyroscopeData, MazeCell, Velocity } from "@/types/types";
import { generateMaze } from "@/components/mazeGenerator";

interface MazeMovingProps {
  gyroscopeData: GyroscopeData;
}

export const MazeMoving: React.FC<MazeMovingProps> = ({ gyroscopeData }) => {
  const [levelCount, setLevelCount] = useState(1);
  const mazeRef = useRef<Group | null>(null);
  const ballRef = useRef<Mesh | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);

  const velocityRef = useRef<Velocity>({ x: 0, z: 0, y: 0 });

  // Constantes de physique
  const FRICTION = 0.97;
  const ACCELERATION = 0.003;
  const MAX_VELOCITY = 0.2;
  const BOUNCE_FACTOR = 0.5;

  const MAZE_SIZE = 11;
  const CELL_SIZE = 2;

  const START_POSITION = {
    x: -(MAZE_SIZE * CELL_SIZE) / 2 + CELL_SIZE,
    z: -(MAZE_SIZE * CELL_SIZE) / 2 + CELL_SIZE,
  };

  const END_POSITION = {
    x: (MAZE_SIZE * CELL_SIZE) / 2 - CELL_SIZE,
    z: (MAZE_SIZE * CELL_SIZE) / 2 - CELL_SIZE,
  };

  const [timer, setTimer] = useState(0);

  setTimeout(() => {
    setTimer(timer + 1);
  }, 1000);

  const createMaze = (scene: Scene) => {
    const mazeGroup = new Group();
    const maze = generateMaze(MAZE_SIZE, MAZE_SIZE);

    // Trouver une cellule vide dans le coin opposé pour le point d'arrivée
    let endX = MAZE_SIZE - 2; // On commence près du coin opposé
    let endZ = MAZE_SIZE - 2;

    // Chercher la cellule vide la plus proche du coin opposé
    while (maze[endZ][endX].isWall && endX > 0 && endZ > 0) {
      if (endX > endZ) {
        endX--;
      } else {
        endZ--;
      }
    }

    // Mettre à jour END_POSITION avec la position trouvée
    const END_POSITION = {
      x: endX * CELL_SIZE - (MAZE_SIZE * CELL_SIZE) / 2,
      z: endZ * CELL_SIZE - (MAZE_SIZE * CELL_SIZE) / 2,
    };

    // Créer les murs du labyrinthe
    for (let y = 0; y < MAZE_SIZE; y++) {
      for (let x = 0; x < MAZE_SIZE; x++) {
        if (maze[y][x].isWall) {
          const geometry = new BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);
          const material = new MeshBasicMaterial({ color: maze[y][x].color });
          const wall = new Mesh(geometry, material);

          wall.position.set(
            x * CELL_SIZE - (MAZE_SIZE * CELL_SIZE) / 2,
            0,
            y * CELL_SIZE - (MAZE_SIZE * CELL_SIZE) / 2
          );

          mazeGroup.add(wall);
        }
      }
    }

    // Créer le bloc de fin (vert) sur la cellule vide trouvée
    const endGeometry = new BoxGeometry(CELL_SIZE, CELL_SIZE / 2, CELL_SIZE);
    const endMaterial = new MeshBasicMaterial({
      color: "green",
      opacity: 0.8,
      transparent: true,
    });
    const endBlock = new Mesh(endGeometry, endMaterial);
    endBlock.position.set(END_POSITION.x, 0, END_POSITION.z);
    endBlock.name = "endBlock";
    mazeGroup.add(endBlock);

    // Créer la bille au point de départ
    const ballGeometry = new BoxGeometry(
      CELL_SIZE * 0.5,
      CELL_SIZE * 0.5,
      CELL_SIZE * 0.5
    );
    const ballMaterial = new MeshBasicMaterial({ color: "red" });
    const ball = new Mesh(ballGeometry, ballMaterial);
    ball.position.set(START_POSITION.x, 0.5, START_POSITION.z);
    ballRef.current = ball;

    mazeGroup.add(ball);
    mazeRef.current = mazeGroup;
    scene.add(mazeGroup);
  };

  const updateBallPhysics = () => {
    if (!ballRef.current) return;

    // Appliquer l'accélération basée sur le gyroscope
    velocityRef.current.x += gyroscopeData.y * ACCELERATION;
    velocityRef.current.z += gyroscopeData.x * ACCELERATION;
    velocityRef.current.y += gyroscopeData.z * ACCELERATION;

    // Limiter la vitesse maximale
    velocityRef.current.x = Math.max(
      -MAX_VELOCITY,
      Math.min(MAX_VELOCITY, velocityRef.current.x)
    );
    velocityRef.current.z = Math.max(
      -MAX_VELOCITY,
      Math.min(MAX_VELOCITY, velocityRef.current.z)
    );

    // Appliquer la friction
    velocityRef.current.x *= FRICTION;
    velocityRef.current.z *= FRICTION;

    // Mettre à jour la position
    const newX = ballRef.current.position.x + velocityRef.current.x;
    const newZ = ballRef.current.position.z + velocityRef.current.z;

    // Vérifier les collisions avec les bords
    const maxPosition = (MAZE_SIZE * CELL_SIZE) / 2 - CELL_SIZE;

    // Gérer les collisions avec rebond
    if (newX > maxPosition) {
      ballRef.current.position.x = maxPosition;
      velocityRef.current.x *= -BOUNCE_FACTOR;
    } else if (newX < -maxPosition) {
      ballRef.current.position.x = -maxPosition;
      velocityRef.current.x *= -BOUNCE_FACTOR;
    } else {
      ballRef.current.position.x = newX;
    }

    if (newZ > maxPosition) {
      ballRef.current.position.z = maxPosition;
      velocityRef.current.z *= -BOUNCE_FACTOR;
    } else if (newZ < -maxPosition) {
      ballRef.current.position.z = -maxPosition;
      velocityRef.current.z *= -BOUNCE_FACTOR;
    } else {
      ballRef.current.position.z = newZ;
    }

    // Ajouter une rotation à la bille basée sur sa vélocité
    ballRef.current.rotation.x -= velocityRef.current.z * 2;
    ballRef.current.rotation.z += velocityRef.current.x * 2;
  };

  const checkEndBlock = () => {
    if (!ballRef.current || !mazeRef.current) return;

    const ballPosition = ballRef.current.position;
    const endBlock = mazeRef.current.children.find(
      (child) => child instanceof Mesh && child.name === "endBlock"
    ) as Mesh;

    if (!endBlock) return;

    const distance = Math.sqrt(
      Math.pow(ballPosition.x - endBlock.position.x, 2) +
        Math.pow(ballPosition.z - endBlock.position.z, 2)
    );

    if (distance < CELL_SIZE) {
      resetLevel();
    }
  };

  const resetLevel = () => {
    if (!sceneRef.current || !ballRef.current) return;

    velocityRef.current = { x: 0, y: 0, z: 0 };

    if (mazeRef.current) {
      sceneRef.current.remove(mazeRef.current);
    }

    createMaze(sceneRef.current);
    setTimer(0);
    setLevelCount((prev) => prev + 1);
  };

  const animateEndBlock = () => {
    if (!mazeRef.current) return;

    const endBlock = mazeRef.current.children.find(
      (child) => child instanceof Mesh && child.name === "endBlock"
    ) as Mesh;

    if (endBlock) {
      endBlock.rotation.y += 0.01;
      endBlock.position.y = Math.sin(Date.now() * 0.003) * 0.2;
    }
  };

  const checkWallCollisions = () => {
    if (!ballRef.current || !mazeRef.current) return;

    const ballPosition = ballRef.current.position;
    const ballRadius = CELL_SIZE * 0.25;

    mazeRef.current.children.forEach((child) => {
      if (
        child instanceof Mesh &&
        child !== ballRef.current &&
        child.name !== "endBlock"
      ) {
        const wallPosition = child.position;
        const wallSize = CELL_SIZE / 2;

        if (
          ballPosition.x + ballRadius > wallPosition.x - wallSize &&
          ballPosition.x - ballRadius < wallPosition.x + wallSize &&
          ballPosition.z + ballRadius > wallPosition.z - wallSize &&
          ballPosition.z - ballRadius < wallPosition.z + wallSize
        ) {
          const dx = ballPosition.x - wallPosition.x;
          const dz = ballPosition.z - wallPosition.z;

          if (Math.abs(dx) > Math.abs(dz)) {
            velocityRef.current.x *= -BOUNCE_FACTOR;
            ballPosition.x =
              wallPosition.x +
              (dx > 0 ? wallSize + ballRadius : -(wallSize + ballRadius));
          } else {
            velocityRef.current.z *= -BOUNCE_FACTOR;
            ballPosition.z =
              wallPosition.z +
              (dz > 0 ? wallSize + ballRadius : -(wallSize + ballRadius));
          }
        }
      }
    });
  };

  useEffect(() => {
    if (!ballRef.current || !mazeRef.current) return;

    // Mettre à jour la physique
    updateBallPhysics();

    // Vérifier les collisions
    checkWallCollisions();

    // Vérifier si on atteint la fin
    checkEndBlock();

    // Rendu
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [gyroscopeData]);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const scene = new Scene();
    sceneRef.current = scene;

    const camera = new PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.set(0, MAZE_SIZE * 3, 0);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new Renderer({ gl });
    rendererRef.current = renderer;
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    createMaze(scene);

    const render = () => {
      requestAnimationFrame(render);

      if (ballRef.current) {
        updateBallPhysics();
        checkWallCollisions();
        checkEndBlock();
        animateEndBlock();
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    render();
  };

  return (
    <View style={{ flex: 1 }}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
      <Text style={styles.levelCounter}>Niveau: {levelCount}</Text>
      <Text style={styles.timerCounter}>Temps: {timer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  levelCounter: {
    position: "absolute",
    top: 100,
    right: 20,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  timerCounter: {
    position: "absolute",
    top: 100,
    right: 200,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
