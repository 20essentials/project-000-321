/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";

const hueColors = [
  37, 170, 151, 265, 0, 75, 341, 303, 132, 189,
  113, 227, 360, 246, 94, 284, 208, 56, 322, 18,
];

const randomY = () => 100 + Math.floor(Math.random() * (window.innerHeight - 200));
const randomX = () => 100 + Math.floor(Math.random() * (window.innerWidth - 200));

export default function App() {
  return (
    <div
      css={css`
        height: 100dvh;
        width: 100%;
        display: flex;
        background-color: black;
        overflow: hidden;
        position: relative;
      `}
    >
      <DvdScreenSaver width={150} height={70} srcImage="assets/blurray.webp" />
    </div>
  );
}

function DvdScreenSaver({ width, height, srcImage }) {
  const ref = useRef(null);

  // Posiciones y movimiento (x,y) y velocidades (growX, growY)
  const [position, setPosition] = useState({ x: randomX(), y: randomY() });
  const [velocity, setVelocity] = useState({ growX: 2, growY: 2 });
  const [colorIndex, setColorIndex] = useState(-1);

  // Actualizar color index cíclicamente
  const upgradeIndexColor = () => {
    setColorIndex((i) => (i + 1) % hueColors.length);
  };

  // Movimiento y detección de colisiones
  useEffect(() => {
    let animationFrameId;

    const movement = () => {
      setPosition(({ x, y }) => {
        let newX = x + velocity.growX;
        let newY = y + velocity.growY;

        const htmlWidth = window.innerWidth;
        const htmlHeight = window.innerHeight;

        // Detectar colisión y actualizar velocidad y color
        let newGrowX = velocity.growX;
        let newGrowY = velocity.growY;
        let newColorIndex = colorIndex;

        if (newX > htmlWidth - width) {
          newGrowX = -newGrowX;
          newColorIndex = (colorIndex + 1) % hueColors.length;
        }
        if (newX < 0) {
          newGrowX = -newGrowX;
          newColorIndex = (colorIndex + 1) % hueColors.length;
        }
        if (newY > htmlHeight - height) {
          newGrowY = -newGrowY;
          newColorIndex = (colorIndex + 1) % hueColors.length;
        }
        if (newY < 0) {
          newGrowY = -newGrowY;
          newColorIndex = (colorIndex + 1) % hueColors.length;
        }

        // Si cambió el color, actualizar estado
        if (newColorIndex !== colorIndex) {
          setColorIndex(newColorIndex);
        }

        // Actualizar velocidades si cambiaron
        if (newGrowX !== velocity.growX || newGrowY !== velocity.growY) {
          setVelocity({ growX: newGrowX, growY: newGrowY });
        }

        return { x: newX, y: newY };
      });

      animationFrameId = requestAnimationFrame(movement);
    };

    movement();

    return () => cancelAnimationFrame(animationFrameId);
  }, [velocity, colorIndex, width, height]);

  const style = css`
    display: flex;
    flex-wrap: wrap;
    place-content: center;
    position: absolute;
    aspect-ratio: 320 / 150;
    width: ${width}px;
    height: ${height}px;
    transform-origin: 0 0;
    filter: hue-rotate(${hueColors[colorIndex]}deg);
    transition: filter 0.5s ease;
    transform: translate(${position.x}px, ${position.y}px);

    img {
      transform: scale(0.8);
      pointer-events: none;
      user-select: none;
      -webkit-user-drag: none;
    }
  `;

  return (
    <div css={style} ref={ref}>
      <img src={srcImage} alt="dvd logo" draggable={false} />
    </div>
  );
}
