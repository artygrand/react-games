import React, { useEffect, useRef } from 'react';

const Background = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const ctx = canvas.getContext('2d')!;

        ctx.font = '90px serif'
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🌲🌲🌲', canvas.width / 2.05, canvas.height * .13);
        ctx.font = '70px serif'
        ctx.fillText('🌲🌲🌲', canvas.width / 3, canvas.height * .14);
        ctx.font = '82px serif'
        ctx.fillText('🌲🌲🌲', canvas.width / 1.6, canvas.height * .15);
        ctx.font = '20px serif'
        ctx.fillText('🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾', canvas.width / 2.2, canvas.height * .94);
        ctx.font = '26px serif'
        ctx.fillText('🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾', canvas.width / 2.1, canvas.height * .96);
        ctx.font = '30px serif'
        ctx.fillText('🌾🌾🌾🌾🌾🌾🌾🌾🌾', canvas.width / 2, canvas.height * .98);
    },[]);

    return (
        <canvas id="cow-bg" ref={canvasRef} />
    );
};

export default Background;
