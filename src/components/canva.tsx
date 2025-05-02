'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';


export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [resizeTrigger, setresizeTrigger] = useState(false);

    // Tracking the Canvas
    interface offSetType {
        x: number;
        y: number;
    }

    const [isDragging, setisDragging] = useState(false);
    const [offset, setoffset] = useState<offSetType>({
        x: 0,
        y: 0
    });

    useEffect(() => {
        if (!canvasRef.current) return;

        // Setting Canvas to fill the window

        const canvasEl = canvasRef.current;
        canvasEl.width = window.innerWidth;
        canvasEl.height = window.innerHeight;

        const canvas = new fabric.Canvas(canvasEl, {
            isDrawingMode: true,
        });

        // Optimize window Initially

        let resizeTimeout: NodeJS.Timeout;
        canvas.setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        })

        const handleSize = () => {
            if (resizeTrigger) return; // Avoid Extra Calls

            setresizeTrigger(true);

            resizeTimeout = setTimeout(() => {
                canvas.setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight,
                })
            }, 100);

        }

        // Handle Mouse Events

        const handleMouseDown = (e: MouseEvent) => {
            setisDragging(true);
            const react = canvasEl.getBoundingClientRect();
            setoffset({
                x: e.clientX - react.x,
                y: e.clientY - react.y,
            });
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            
            const canvaEl = canvasRef.current!;
            const newX = e.clientX - offset.x;
            const newY = e.clientY - offset.y;

            canvaEl.style.left = `${newX}px`;
            canvaEl.style.right = `${newY}px`;
        }

        const handleMouseUp = () => {
            setisDragging(false);
        }

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("resize", handleSize);

        return () => {
            canvas.dispose();
            window.removeEventListener("resize", handleSize);
            clearTimeout(resizeTimeout);
        }
    }, [resizeTrigger]);

    return (
        <>
            <canvas
                ref={canvasRef}
                className='fixed top-0 left-0 z-10 w-screen h-screen touch-none bg-white'
            />

        </>
    )
}
