import { Canvas, Circle, Group, Line, Rect, Triangle } from "fabric";
import React, { useEffect, useRef, useState } from "react";

const FabricCanvas = ({ tool }) => {
  const CanvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (CanvasRef.current) {
      const initCanvas = new Canvas(CanvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight,
      });

      initCanvas.renderAll();
      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (!canvas) return;

    canvas.isDrawingMode = false;

    if (tool === "drawing") {
      canvas.isDrawingMode = true;

      const brush = canvas.freeDrawingBrush;
      if (brush) {
        brush.color = "white";
        brush.width = 50;
      }
    }
  }, [tool, canvas]);

  const HandleShapes = () => {
    if (!canvas) return;

    switch (tool) {
      case "rectangle":
        const rect = new Rect({
          top: 100,
          left: 50,
          width: 100,
          height: 50,
          stroke: "white",
          fill: "transparent",
          strokeWidth: 2,
          rx: 5,
          strokeUniform: true,
          ry: 5,
          opacity: 0.6,
        });
        canvas.add(rect);
        break;

      case "square":
        const square = new Rect({
          top: 100,
          left: 100,
          width: 100,
          height: 100,
          stroke: "white",
          fill: "transparent",
          strokeWidth: 2,
          rx: 5,
          strokeUniform: true,
          ry: 5,
          opacity: 0.6,
        });
        canvas.add(square);
        break;

      case "circle":
        const circle = new Circle({
          top: 100,
          left: 100,
          radius: 50,
          stroke: "white",
          fill: "transparent",
          strokeWidth: 2,
          strokeUniform: true,
          opacity: 0.6,
        });
        canvas.add(circle);
        break;

      case "triangle":
        const triangle = new Triangle({
          top: 100,
          left: 100,
          width: 100,
          height: 100,
          stroke: "white",
          fill: "transparent",
          strokeWidth: 2,
          rx: 5,
          strokeUniform: true,
          ry: 5,
          opacity: 0.6,
        });
        canvas.add(triangle);
        break;

      case "line":
        const line = new Line([50, 50, 200, 200], {
          stroke: "white",
          fill: "transparent",
          strokeWidth: 3,
          strokeUniform: true,
          opacity: 0.6,
          strokeLineCap: "round",
        });
        canvas.add(line);
        break;

      case "arrow":
        const [x1, y1, x2, y2] = [50, 50, 200, 200];
        const arrowLine = new Line([x1, y1, x2, y2], {
          stroke: "white",
          fill: "transparent",
          strokeWidth: 3,
          strokeUniform: true,
          opacity: 0.6,
          strokeLineCap: "round",
          evented: false,
          selectable: false,
        });

        const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

        const arrowHead = new Triangle({
          left: x2,
          top: y2,
          originX: "center",
          originY: "center",
          angle: angle + 90,
          width: 15,
          height: 20,
          selectable: false,
          evented: false,
          strokeWidth: 3,
          strokeUniform: true,
          stroke: "white",
        });

        const arrow = new Group([arrowLine, arrowHead], {
          selectable: true,
          hasControls: true,
          hoverCursor: "move",
          objectCaching: false,
        });

        canvas.add(arrow);
        canvas.requestRenderAll();
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    HandleShapes();
  }, [tool]);

  return (
    <div>
      <canvas id="canvas" ref={CanvasRef} className=" absolute z-10" />
    </div>
  );
};

export default FabricCanvas;
