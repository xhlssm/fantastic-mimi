// 未来感WebGL粒子背景组件（three.js实现，自动全屏，性能友好）
'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WebGLParticles() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let particles: THREE.Points;
    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    // 初始化
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.z = 200;
    // 粒子
    const geometry = new THREE.BufferGeometry();
    const numParticles = 400;
    const positions = new Float32Array(numParticles * 3);
    for (let i = 0; i < numParticles; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x3ECFFF, size: 3, transparent: true, opacity: 0.7 });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    // 渲染循环
    function animate() {
      animationId = requestAnimationFrame(animate);
      particles.rotation.y += 0.0015;
      particles.rotation.x += 0.0007;
      renderer.render(scene, camera);
    }
    animate();
    // 挂载
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }
    // 响应式
    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);
    // 卸载
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  return <div ref={mountRef} className="fixed inset-0 -z-20 pointer-events-none" />;
}
