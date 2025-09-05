import React, { useRef, useEffect } from 'react';
import { BackgroundSettings, BackgroundMode } from '../types';

interface DynamicBackgroundProps {
    settings: BackgroundSettings;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ settings }) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof (window as any).THREE === 'undefined') return;

        const THREE = (window as any).THREE;

        const vertexShader = `
            attribute float customSize;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = customSize * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
        const fragmentShader = `
            varying vec3 vColor;
            void main() {
                if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
                gl_FragColor = vec4(vColor, 1.0);
            }
        `;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        renderer.setClearColor(0x000000, 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current?.appendChild(renderer.domElement);

        const particleCount = 3000;
        const particlesGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);
        const sizeArray = new Float32Array(particleCount);
        const baseBrightness = 0.05;

        for (let i = 0; i < particleCount; i++) {
            posArray[i * 3 + 0] = (Math.random() - 0.5) * 20;
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 20;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 20;
            colorArray[i * 3 + 0] = baseBrightness;
            colorArray[i * 3 + 1] = baseBrightness;
            colorArray[i * 3 + 2] = baseBrightness;
            sizeArray[i] = Math.random() * 0.06 + 0.02;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        particlesGeometry.setAttribute('customSize', new THREE.BufferAttribute(sizeArray, 1));
        
        const particlesMaterial = new THREE.ShaderMaterial({
            vertexShader, fragmentShader, transparent: true,
            blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: true,
        });
        const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleMesh);

        // Matrix Bolt setup
        const MAX_BOLTS = 15;
        const linePositions = new Float32Array(MAX_BOLTS * 2 * 3);
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff00, transparent: true,
            blending: THREE.AdditiveBlending, depthWrite: false,
        });
        const lineMesh: any = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lineMesh);

        camera.position.z = 5;
        
        const mouse = { x: 0, y: 0 };
        let flashes: { position: any; intensity: number }[] = [];
        let boltData: { from: number; to: number; intensity: number }[] = [];
        
        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        const handleTouchMove = (event: TouchEvent) => {
            if (event.touches.length > 0) {
                mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
            }
        };

        const triggerFlash = (x: number, y: number) => {
            const vector = new THREE.Vector3(x, y, 0.5);
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));
            flashes.push({ position: pos, intensity: 2.0 * settings.intensity });
        };
        const handleMouseDown = (event: MouseEvent) => {
            if (settings.mode === BackgroundMode.PAPARAZZI) {
                triggerFlash((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
            }
        };
        const handleTouchStart = (event: TouchEvent) => {
             if (event.touches.length > 0 && settings.mode === BackgroundMode.PAPARAZZI) {
                triggerFlash((event.touches[0].clientX / window.innerWidth) * 2 - 1, -(event.touches[0].clientY / window.innerHeight) * 2 + 1);
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('mousedown', handleMouseDown, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        
        const animate = () => {
            requestAnimationFrame(animate);
            
            const targetRotationX = mouse.y * 0.15;
            const targetRotationY = -mouse.x * 0.15;
            particleMesh.rotation.x += (targetRotationX - particleMesh.rotation.x) * 0.04;
            particleMesh.rotation.y += (targetRotationY - particleMesh.rotation.y) * 0.04;
            
            const colors = particlesGeometry.attributes.color.array as Float32Array;
            const positions = particlesGeometry.attributes.position.array as Float32Array;

            // Fade all particles back to base brightness
            for (let i = 0; i < particleCount; i++) {
                let r = colors[i * 3];
                let g = colors[i * 3 + 1];
                let b = colors[i * 3 + 2];
                colors[i * 3] += (baseBrightness - r) * 0.03;
                colors[i * 3 + 1] += (baseBrightness - g) * 0.03;
                colors[i * 3 + 2] += (baseBrightness - b) * 0.03;
            }

            if (settings.mode === BackgroundMode.PAPARAZZI) {
                lineMesh.visible = false;
                
                if (flashes.length === 0 && Math.random() > 0.98) {
                    const randomPos = new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
                    flashes.push({ position: randomPos, intensity: 1.8 * settings.intensity });
                }

                flashes.forEach(flash => {
                    for (let i = 0; i < particleCount; i++) {
                        const dx = positions[i * 3] - flash.position.x;
                        const dy = positions[i * 3 + 1] - flash.position.y;
                        const dz = positions[i * 3 + 2] - flash.position.z;
                        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                        if (distance < 5) {
                            const falloff = 1 - (distance / 5);
                            const flashBrightness = flash.intensity * falloff * falloff;
                            colors[i * 3] = Math.max(colors[i * 3], flashBrightness);
                            colors[i * 3 + 1] = Math.max(colors[i * 3 + 1], flashBrightness);
                            colors[i * 3 + 2] = Math.max(colors[i * 3 + 2], flashBrightness);
                        }
                    }
                });

                flashes.forEach(flash => flash.intensity *= 0.7);
                flashes = flashes.filter(flash => flash.intensity > 0.01);
            } else if (settings.mode === BackgroundMode.MATRIX) {
                lineMesh.visible = true;

                if (boltData.length < MAX_BOLTS && Math.random() > 0.95) {
                    const from = Math.floor(Math.random() * particleCount);
                    let to = -1, min_d = 2; // Find a nearby particle
                    for(let i=0; i<50; i++) {
                        const idx = Math.floor(Math.random() * particleCount);
                        const d = Math.sqrt(Math.pow(positions[from*3]-positions[idx*3], 2) + Math.pow(positions[from*3+1]-positions[idx*3+1], 2) + Math.pow(positions[from*3+2]-positions[idx*3+2], 2));
                        if(d > 0.1 && d < min_d) { min_d = d; to = idx; }
                    }
                    if (to !== -1) boltData.push({ from, to, intensity: 2.5 * settings.intensity });
                }
                
                const linePosAttr = lineMesh.geometry.attributes.position;
                for (let i = 0; i < MAX_BOLTS; i++) {
                    if (i < boltData.length) {
                        const bolt = boltData[i];
                        linePosAttr.setXYZ(i*2, positions[bolt.from*3], positions[bolt.from*3+1], positions[bolt.from*3+2]);
                        linePosAttr.setXYZ(i*2+1, positions[bolt.to*3], positions[bolt.to*3+1], positions[bolt.to*3+2]);
                        colors[bolt.from*3] = 0; colors[bolt.from*3+1] = bolt.intensity; colors[bolt.from*3+2] = 0;
                        colors[bolt.to*3] = 0; colors[bolt.to*3+1] = bolt.intensity; colors[bolt.to*3+2] = 0;
                        bolt.intensity *= 0.85;
                    } else {
                        linePosAttr.setXYZ(i*2, 0,0,0); linePosAttr.setXYZ(i*2+1, 0,0,0);
                    }
                }
                boltData = boltData.filter(b => b.intensity > 0.05);
                linePosAttr.needsUpdate = true;
            }
            
            particlesGeometry.attributes.color.needsUpdate = true;
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', handleResize);

        const currentMount = mountRef.current;
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('touchstart', handleTouchStart);
            currentMount?.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, width: '100%', height: '100%' }} />;
};

export default DynamicBackground;
