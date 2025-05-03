import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Rect, Circle, Arrow } from "react-konva";

export const CanvasBoard = ({ tool }) => {
  const stageRef = useRef();

  // To store Array of shapes

  const [shapes, setShapes] = useState(() => {
    const savedShapes = localStorage.getItem("nuvio-shapes");
    return savedShapes ? JSON.parse(savedShapes) : [];
  });

  // Track Changes

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Canvas States
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentShape, setCurrentShapes] = useState(null);

  // To Move the Canvas
  const [panMode, setPanMode] = useState(false);

  useEffect(() => {
    if (tool === "hand") {
      setPanMode(true);
    } else {
      setPanMode(false);
    }
  }, [tool]);

  useEffect(() => {
    localStorage.setItem("nuvio-shapes", JSON.stringify(shapes));
  }, [shapes]);

  // To Handle the Undo and Redo

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && e.key === "x") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shapes, undoStack, redoStack]);

  // Start Drawing

  const handleMouseDown = (e) => {
    if (panMode) return;
    const position = e.target.getStage().getPointerPosition();
    setStartPoint(position);
    setIsDrawing(true);
    setCurrentShapes(null);
  };

  // Update the shape when start drawing

  const handleMouseMove = (e) => {
    if (!isDrawing || panMode) return;

    const position = e.target.getStage().getPointerPosition();
    const newShape = createShape(tool, startPoint, position);
    if (!newShape) {
      return;
    }
    setCurrentShapes(newShape);
  };

  // End the drawing and save

  const handleMouseUp = () => {
    if (!isDrawing || !panMode) {
      setIsDrawing(false);
      if (currentShape) {
        setUndoStack([...undoStack, shapes]);
        setRedoStack([]);
        setShapes((prev) => [...prev, currentShape]);
        setCurrentShapes(null);
      }
    }
  };

  // Create the Shape

  const createShape = (tool, start, end) => {
    // Co-ordinates
    const { x: x1, y: y1 } = start;
    const { x: x2, y: y2 } = end;

    // Managing the Shapes

    switch (tool) {
      case "rectangle":
      case "square":
        const width = x2 - x1;
        const height = tool === "square" ? width : y2 - y1;
        return { type: "rect", x: x1, y: y1, width, height };

      case "circle": {
        const radius = Math.hypot(x2 - x1, y2 - y1) / 2;
        return { type: "circle", x: (x1 + x2) / 2, y: (y1 + y2) / 2, radius };
      }

      case "line":
        return { type: "line", points: [x1, y1, x2, y2] };

      case "arrow":
        return { type: "arrow", points: [x1, y2, x2, y2] };

      case "triangle":
        return {
          type: "triangle",
          points: [x1, x2, (x1 + x2) / 2, y1, x2, y2, x1, y2],
          closed: true,
        };
      default:
        return null;
    }
  };

  // To Handle Pan Mode

  const handleStagePan = (e) => {
    const stage = stageRef.current;
    const container = stage.container();
    if (panMode) {
      container.style.cursor = "grabbing";
      stage.startDrag();
    } else {
      handleMouseDown(e);
      container.style.cursor = "cursor";
    }
  };

  const handleStageMouseUp = (e) => {
    if (panMode) {
      const stage = stageRef.current;
      stage.container().style.cursor = "grab";
      stage.stopDrag();
    } else {
      handleMouseUp(e);
    }
  };

  const handleStageMouseMove = (e) => {
    if (!panMode) {
      handleMouseMove(e);
    }
  };

  const undo = () => {
    if (undoStack.length === 0) {
      return;
    }

    const previousState = undoStack[undoStack.length - 1];
    setRedoStack([...redoStack, shapes]);
    setShapes(previousState);
    setUndoStack(undoStack.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) {
      return;
    }

    const nextState = redoStack[redoStack.length - 1];
    setUndoStack([...undoStack, shapes]);
    setShapes(nextState);
    setRedoStack(redoStack.slice(0, -1));
  };

  // Reset the Canvas

  const resetCanvas = () => {
    setShapes([]);
    setUndoStack([]);
    setRedoStack([]);
    localStorage.removeItem("nuvio-shapes");
  };

  // Export as PNG

  const exportAsPng = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "nuvio-draw.png";
    link.href = uri;
    link.click();
  };

  return (
    <div>
      {/* Canvas */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onMouseDown={handleStagePan}
        onMouseUp={handleStageMouseUp}
        onMouseMove={handleStageMouseMove}
        className={panMode ? "cursor-grab" : "cursor"}
        draggable={panMode}
      >
        <Layer>
          {/* Mapping over the shapes */}
          {shapes.map((shape, i) => {
            switch (shape.type) {
              case "rect":
                return (
                  <Rect key={i} {...shape} stroke="white" strokeWidth={3} />
                );
              case "circle":
                return (
                  <Circle key={i} {...shape} stroke="white" strokeWidth={3} />
                );
              case "line":
                return (
                  <Line
                    key={i}
                    points={shape.points}
                    stroke="white"
                    closed={shape.closed || false}
                  />
                );
              case "arrow":
                return (
                  <Arrow key={i} {...shape} stroke="white" strokeWidth={3} />
                );
              default:
                return null;
            }
          })}
          {currentShape && (
            <>
              {currentShape.type == "rect" && (
                <Rect {...currentShape} stroke="white" />
              )}
              {currentShape.type == "circle" && (
                <Circle {...currentShape} stroke="white" />
              )}
              {currentShape.type == "line" && (
                <Line {...currentShape} stroke="white" />
              )}
              {currentShape.type == "arrow" && (
                <Arrow {...currentShape} stroke="white" />
              )}
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasBoard;
