import React, {useEffect, useRef, useState} from 'react';

function CanvasComponent() {
    const canvasRef = useRef(null);
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
    const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);
    let particles = [];
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        window.addEventListener('resize', function () {
            setCanvasWidth(window.innerWidth);
            setCanvasHeight(window.innerHeight);
        })

        // Draw on canvas here
        const mouse = {
            x: null,
            y: null,
        };

        const options = {
            size: 2,
            speed: 2,
            radius: 4,
            quantity: 100,
            distance: 120,
            lineWidth: 1,
            lifeSpan: 10,
            color: "#163A61"
        };

        canvas.addEventListener("click", function (e) {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        canvas.addEventListener("mousemove", function (e) {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * options.size + 1;
                this.speedX = Math.random() * options.speed - options.speed / 2;
                this.speedY = Math.random() * options.speed - options.speed / 2;
                this.color = options.color;
                this.lifeSpan = (Math.random() * options.lifeSpan + 2) * 60;
            }
            update() {
                if (this.x - this.size + this.speedX < 0 || this.x + this.size + this.speedX > canvas.width) {
                    this.speedX *= -1;
                }
                if (this.y - this.size + this.speedY < 0 || this.y + this.size + this.speedY > canvas.height) {
                    this.speedY *= -1;
                }
                this.x += this.speedX;
                this.y += this.speedY;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            reSpawn() {
                if (this.lifeSpan < 1) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.lifeSpan = (Math.random() * options.lifeSpan + 2) * 60;
                }
                this.lifeSpan--;
            }
        }

        function fillParticles() {
            for (let i = 0; i < options.quantity; i++) {
                particles.push(new Particle());
            }
        }
        fillParticles();

        function particleUpdate() {
            for (let i in particles) {
                particles[i].update();
                particles[i].draw();
                particles[i].reSpawn();
            }
        }

        function drawLines() {
            let x1, x2, y1, y2, d, opacity;
            for (let p1 of particles) {
                for (let p2 of particles) {
                    x1 = p1.x;
                    x2 = p2.x;
                    y1 = p1.y;
                    y2 = p2.y;
                    d = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
                    if (d < options.distance) {
                        opacity = 1 - d/options.distance;
                        ctx.strokeStyle = "rgba(22,58,97,"+opacity+")";
                        ctx.beginPath();
                        ctx.lineWidth = options.lineWidth;
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particleUpdate();
            drawLines();
            requestAnimationFrame(animate);
        }
        animate();
    }, []);

    return (
        <canvas
            style={{position: "absolute", left: 0, top: 0}}
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight} />
    );
}

export default CanvasComponent;
