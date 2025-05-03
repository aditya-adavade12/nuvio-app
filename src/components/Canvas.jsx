import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Arrow } from 'react-konva';

const CanvasBoard = ({ tool }) => {
  const stageRef = useRef();
  const [shapes, setShapes] = useState(() => {
    const savedShapes = localStorage.getItem('canvas-shapes');
    return savedShapes ? JSON.parse(savedShapes) : [];
  });
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentShape, setCurrentShape] = useState(null);
  const [panMode, setPanMode] = useState(false);

  useEffect(() => {
    if (tool === 'hand') {
      setPanMode(true);
    } else {
      setPanMode(false);
    }
  }, [tool]);

  useEffect(() => {
    localStorage.setItem('canvas-shapes', JSON.stringify(shapes));
  }, [shapes]);

  useEffect(() => {
    // Keyboard event listener for Undo (Ctrl+Z) and Redo (Ctrl+Y)
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault(); // Prevent default Ctrl+Z behavior
        undo();
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault(); // Prevent default Ctrl+Y behavior
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shapes, undoStack, redoStack]);

  const handleMouseDown = (e) => {
    if (panMode) return;

    const pos = e.target.getStage().getPointerPosition();
    setStartPoint(pos);
    setIsDrawing(true);
    setCurrentShape(null); // Reset current shape at the start
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || panMode) return;

    const pos = e.target.getStage().getPointerPosition();
    const newShape = createShape(tool, startPoint, pos);

    if (!newShape) return;

    // Update the current shape while drawing
    setCurrentShape(newShape);
  };

  const handleMouseUp = () => {
    if (isDrawing && !panMode) {
      setIsDrawing(false);
      if (currentShape) {
        setUndoStack([...undoStack, shapes]); // Save the current shapes for undo
        setRedoStack([]); // Clear redo stack when a new shape is added
        setShapes((prevShapes) => [...prevShapes, currentShape]);
        setCurrentShape(null); // Reset after shape is added
      }
    }
  };

  const createShape = (tool, start, end) => {
    const { x: x1, y: y1 } = start;
    const { x: x2, y: y2 } = end;

    switch (tool) {
      case 'rectangle':
      case 'square':
        const width = x2 - x1;
        const height = tool === 'square' ? width : y2 - y1;
        return { type: 'rect', x: x1, y: y1, width, height };
      case 'circle': {
        const radius = Math.hypot(x2 - x1, y2 - y1) / 2;
        return { type: 'circle', x: (x1 + x2) / 2, y: (y1 + y2) / 2, radius };
      }
      case 'line':
        return { type: 'line', points: [x1, y1, x2, y2] };
      case 'arrow':
        return { type: 'arrow', points: [x1, y1, x2, y2] };
      case 'triangle':
        return {
          type: 'line',
          points: [x1, y2, (x1 + x2) / 2, y1, x2, y2, x1, y2],
          closed: true,
        };
      default:
        return null;
    }
  };

  const handleStageMouseDown = (e) => {
    if (panMode) {
      const stage = stageRef.current;
      stage.container().style.cursor = 'grabbing';
      stage.startDrag();
    } else {
      handleMouseDown(e);
    }
  };

  const handleStageMouseUp = (e) => {
    if (panMode) {
      const stage = stageRef.current;
      stage.container().style.cursor = 'grab';
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
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack([...redoStack, shapes]); // Save the current state for redo
    setShapes(previousState); // Restore the previous state
    setUndoStack(undoStack.slice(0, -1)); // Remove the last state from the undo stack
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack([...undoStack, shapes]); // Save the current state for undo
    setShapes(nextState); // Restore the next state from the redo stack
    setRedoStack(redoStack.slice(0, -1)); // Remove the last state from the redo stack
  };

  const reset = () => {
    setShapes([]);
    setUndoStack([]);
    setRedoStack([]);
    localStorage.removeItem('canvas-shapes');
  };

  const exportImage = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = uri;
    link.click();
  };

  return (
    <>
      <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 100 }}>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={exportImage}>Export PNG</button>
        <button onClick={reset}>Reset</button>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onMouseDown={handleStageMouseDown}
        onMouseUp={handleStageMouseUp}
        onMouseMove={handleStageMouseMove}
        style={{
          cursor: panMode ? 'grab' : 'crosshair',
        }}
        draggable={panMode}
      >
        <Layer>
          {shapes.map((shape, i) => {
            switch (shape.type) {
              case 'rect':
                return <Rect key={i} {...shape} stroke="white" strokeWidth={3}/>;
              case 'circle':
                return <Circle key={i} {...shape} stroke="white" strokeWidth={3}/>;
              case 'line':
                return (
                  <Line
                    key={i}
                    points={shape.points}
                    stroke="white"
                    closed={shape.closed || false}
                  />
                );
              case 'arrow':
                return <Arrow key={i} points={shape.points} stroke="white" />;
              default:
                return null;
            }
          })}
          {/* Render the current shape being drawn */}
          {currentShape && (
            <>
              {currentShape.type === 'rect' && (
                <Rect {...currentShape} stroke="white" />
              )}
              {currentShape.type === 'circle' && (
                <Circle {...currentShape} stroke="white" />
              )}
              {currentShape.type === 'line' && (
                <Line {...currentShape} stroke="white" />
              )}
              {currentShape.type === 'arrow' && (
                <Arrow {...currentShape} stroke="white" />
              )}
            </>
          )}
        </Layer>
      </Stage>
    </>
  );
};

export default CanvasBoard;
