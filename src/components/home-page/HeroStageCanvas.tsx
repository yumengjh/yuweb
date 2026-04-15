// cspell:words metalness
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroStageCanvas({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let rafId = 0;
    let renderer: THREE.WebGLRenderer | null = null;

    if (typeof window.WebGLRenderingContext === "undefined") {
      mount.dataset.render = "fallback";
      return;
    }

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      camera.position.z = 6;

      const geometry = new THREE.IcosahedronGeometry(2, 8);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        wireframe: true,
        roughness: 0.35,
        metalness: 0.5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const light = new THREE.DirectionalLight(0xffffff, 1.15);
      light.position.set(2.2, 1.8, 2.4);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0xffffff, 0.35));

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const resize = () => {
        const width = mount.clientWidth || 1;
        const height = mount.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer?.setSize(width, height, false);
      };

      const renderFrame = () => {
        mesh.rotation.x += 0.0025;
        mesh.rotation.y += 0.0035;
        renderer?.render(scene, camera);
        rafId = window.requestAnimationFrame(renderFrame);
      };

      resize();
      renderFrame();
      window.addEventListener("resize", resize);

      return () => {
        window.cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
        geometry.dispose();
        material.dispose();
        renderer?.dispose();
        if (renderer?.domElement.parentElement === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    } catch {
      mount.dataset.render = "fallback";
      return () => {
        window.cancelAnimationFrame(rafId);
        renderer?.dispose();
      };
    }
  }, []);

  return <div aria-hidden="true" className={className} ref={mountRef} />;
}
