'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { useCanvaStore } from '@/lib/canvaStore';
import type { TEvent } from 'fabric';



export default function CanvasMode() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [DrawingMode, setDrawingMode] = useState<string>('free');
    const [LocalCanvas, setLocalCanvas] = useState<fabric.Canvas | null>(null);

    const canvas = useCanvaStore((state) => state.canvas);
    const setCanvas = useCanvaStore((state) => state.setCanvas);

    const [isDragging, setisDragging] = useState(false);

    const [LastPosX, setLastPosX] = useState(0);
    const [LastPosY, setLastPosY] = useState(0);

    // Changing Drawing Mode

    const changeDrawingMode = (Mode: string) => {
        setDrawingMode(Mode);

        if (LocalCanvas) {
            LocalCanvas.isDrawingMode = Mode === "free";
        }
    };

    const drawShapes = (opt: fabric.TEvent<MouseEvent | PointerEvent>) => {
        console.log("clciked");
        
        if (!LocalCanvas || DrawingMode === 'free') return;

        const pointer = LocalCanvas.getPointer(opt.e);
        console.log("pointer: ", pointer);


        let shape: fabric.Object | null = null;

        switch (DrawingMode) {
            case 'line':
                shape = new fabric.Line([pointer.x, pointer.y, pointer.x + 100, pointer.y + 100], {
                    stroke: 'black',
                    strokeWidth: 5,
                    selectable: false,
                });
                break;

            case 'rectangle':
                shape = new fabric.Rect({
                    left: pointer.x,
                    top: pointer.y,
                    fill: 'transparent',
                    stroke: 'black',
                    width: 100,
                    height: 100,
                    selectable: true
                });
                break;
            default:
                return;
        }

        if (shape) {
            LocalCanvas.add(shape);
            LocalCanvas.renderAll();
        }
    }

    // Initialization

    const LaunchCanvas = () => {
        if (!canvasRef.current) return;

        const newCanvas = new fabric.Canvas(canvasRef.current, {
            isDrawingMode: true,
        });

        newCanvas.setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        // Free Draw Settings
        if (newCanvas.freeDrawingBrush) {
            const brush = newCanvas.freeDrawingBrush;
            brush.color = 'red';
            brush.width = 5;
        }

        //  Mouse down for dragging and shape creation

        newCanvas.on('mouse:down', (opt) => {
            if (DrawingMode !== 'free') {
                drawShapes(opt as TEvent<MouseEvent | PointerEvent>);
            }
            else if (opt.e.altKey) {
                setisDragging(true);
                const evt = opt.e as MouseEvent;
                setLastPosX(evt.clientX);
                setLastPosY(evt.clientY);
            }

        });

        // Mouse down for panning

        newCanvas.on('mouse:move', (opt) => {
            if (isDragging && opt.e) {
                const e = opt.e as MouseEvent;
                const deltaX = e.clientX - LastPosX;
                const deltaY = e.clientY - LastPosY;

                const vpt = newCanvas.viewportTransform!;
                vpt[4] += deltaX;
                vpt[5] += deltaY;

                newCanvas.setViewportTransform(vpt);

                setLastPosX(e.clientX);
                setLastPosY(e.clientY);
            }
        });

        // Mouse up to stop dragging

        newCanvas.on('mouse:up', () => setisDragging(false));

        // Handle Scroll

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const delta = e.deltaY;
            let zoom = canvas?.getZoom() as number;

            if (isNaN(zoom)) {
                zoom = 1;
            }

            zoom = zoom * (0.999 ** delta);
            zoom = Math.max(0.5, Math.min(zoom, 3));

            newCanvas.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), zoom);
            console.log(zoom);
        };

        const resizeCanvas = () => {
            newCanvas.setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("wheel", handleWheel, { passive: false });

        setLocalCanvas(newCanvas);
        setCanvas(newCanvas);
    }

    useEffect(() => {
        LaunchCanvas();
    }, []);



    return (
        <>
            <canvas
                ref={canvasRef}
                className='top-0 left-0 z-10 w-screen h-screen bg-white border touch-none border-stone-950'
            />

            <div className="fixed top-4 left-4 z-20 flex gap-2">
                <button onClick={() => changeDrawingMode('free')} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">
                    Free Draw
                </button>
                <button onClick={() => changeDrawingMode('rectangle')} className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
                    rectangle
                </button>
            </div>
        </>

    )
}
