import { useEffect, useRef, useState } from "react";

import * as fabric from "fabric";

export default function CanvasComponent() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    // Initialize canvas
    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new fabric.Canvas(canvasRef.current, {
                width: window.innerWidth,
                height: window.innerHeight - 100, // Leave space for the toolbar
            });

            initCanvas.backgroundColor = "#fff";
            initCanvas.renderAll();
            setCanvas(initCanvas);

            return () => {
                initCanvas.dispose();
            };
        }
    }, []);

    // Resize canvas on window resize using setDimensions
    useEffect(() => {
        const handleResize = () => {
            if (canvas) {
                canvas.setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight - 100,
                });
                canvas.renderAll();
            }
        };

        // Add resize event listener
        window.addEventListener("resize", handleResize);

        // Cleanup on unmount
        return () => window.removeEventListener("resize", handleResize);
    }, [canvas]);

    // Add rectangle
    const addRect = () => {
        if (canvas) {
            const rect = new fabric.Rect({
                left: 100,
                top: 100,
                fill: 'red',
                width: 150,
                height: 100,
            });
            canvas.add(rect);
        }
    };

    // Add circle
    const addCircle = () => {
        if (canvas) {
            const circle = new fabric.Circle({
                left: 200,
                top: 100,
                radius: 50,
                fill: 'blue',
            });
            canvas.add(circle);
        }
    };

    // Add triangle
    const addTriangle = () => {
        if (canvas) {
            const triangle = new fabric.Triangle({
                left: 300,
                top: 100,
                width: 100,
                height: 100,
                fill: 'green',
            });
            canvas.add(triangle);
        }
    };

    // Add line
    const addLine = () => {
        if (canvas) {
            const line = new fabric.Line([50, 50, 200, 200], {
                left: 150,
                top: 150,
                stroke: 'black',
                strokeWidth: 2,
            });
            canvas.add(line);
        }
    };

    // Add free drawing (toggle drawing mode)
    const toggleFreeDrawing = () => {
        if (canvas) {
            canvas.isDrawingMode = !canvas.isDrawingMode;
            setIsDrawing(canvas.isDrawingMode);

            // Initialize drawing brush when entering drawing mode
            if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.color = "black";  // Set the drawing color
                canvas.freeDrawingBrush.width = 5;  // Set the brush width
            }
        }
    };
    console.log(canvas);
    

    // Clear canvas
    const clearCanvas = () => {
        if (canvas) {
            canvas.clear();
        }
    };

    return (
        <div className="relative">
            <canvas ref={canvasRef} />
            {/* Toolbar */}
            <div className="absolute bottom-0 w-full bg-gray-800 p-4 flex justify-around items-center">
                <button onClick={addRect} className="bg-red-500 text-white p-2">Rectangle</button>
                <button onClick={addCircle} className="bg-blue-500 text-white p-2">Circle</button>
                <button onClick={addTriangle} className="bg-green-500 text-white p-2">Triangle</button>
                <button onClick={addLine} className="bg-black text-white p-2">Line</button>
                <button onClick={toggleFreeDrawing} className={`bg-yellow-500 text-white p-2 ${isDrawing ? 'bg-yellow-700' : ''}`}>
                    {isDrawing ? 'Drawing Mode' : 'Free Draw'}
                </button>
                <button onClick={clearCanvas} className="bg-gray-500 text-white p-2">Clear</button>
            </div>
        </div>
    );
}
