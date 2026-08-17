import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeLadderSceneProps {
  activeLayer?: 'L0' | 'L1' | 'L2' | 'L3' | 'ALL';
  onSelectLayer?: (layer: 'L0' | 'L1' | 'L2' | 'L3') => void;
}

export const ThreeLadderScene: React.FC<ThreeLadderSceneProps> = ({
  activeLayer = 'ALL',
  onSelectLayer
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Clear previous children if any
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Brand Palette
    const paperColor = 0xF7F3E8;
    const yellowColor = 0xF4C430;
    const cobaltColor = 0x2457C5;
    const inkColor = 0x111111;

    // L0 - Raw Text Layer (Stacked Paper Sheets)
    const l0Group = new THREE.Group();
    const sheetGeom = new THREE.PlaneGeometry(1.2, 1.6);
    const sheetMat = new THREE.MeshBasicMaterial({ color: paperColor, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    const wireframeMat = new THREE.MeshBasicMaterial({ color: inkColor, wireframe: true });

    for (let i = 0; i < 3; i++) {
      const sheet = new THREE.Mesh(sheetGeom, sheetMat);
      const wire = new THREE.Mesh(sheetGeom, wireframeMat);
      sheet.position.set(i * 0.08, i * 0.08, -0.6 + i * 0.08);
      wire.position.copy(sheet.position);
      l0Group.add(sheet);
      l0Group.add(wire);
    }
    l0Group.position.x = -3.0;
    scene.add(l0Group);

    // L1 - Atomic Propositions Layer (Modular Blocks)
    const l1Group = new THREE.Group();
    const blockGeom = new THREE.BoxGeometry(0.28, 0.14, 0.06);
    const blockMat = new THREE.MeshBasicMaterial({ color: yellowColor });
    const blockEdgeMat = new THREE.MeshBasicMaterial({ color: inkColor, wireframe: true });

    for (let i = 0; i < 14; i++) {
      const block = new THREE.Mesh(blockGeom, blockMat);
      const edge = new THREE.Mesh(blockGeom, blockEdgeMat);
      const px = ((i % 3) - 1) * 0.35 + (Math.random() - 0.5) * 0.1;
      const py = Math.floor(i / 3) * 0.3 - 0.7;
      block.position.set(px, py, (Math.random() - 0.5) * 0.2);
      edge.position.copy(block.position);
      l1Group.add(block);
      l1Group.add(edge);
    }
    l1Group.position.x = -1.0;
    scene.add(l1Group);

    // L2 - Structured Gist Layer (Tabular Cards)
    const l2Group = new THREE.Group();
    const cardGeom = new THREE.PlaneGeometry(0.9, 0.5);
    const cardMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
    const cardWire = new THREE.MeshBasicMaterial({ color: cobaltColor, wireframe: true });

    for (let i = 0; i < 4; i++) {
      const card = new THREE.Mesh(cardGeom, cardMat);
      const wire = new THREE.Mesh(cardGeom, cardWire);
      card.position.set(0, i * 0.6 - 0.9, 0);
      wire.position.copy(card.position);
      l2Group.add(card);
      l2Group.add(wire);
    }
    l2Group.position.x = 1.0;
    scene.add(l2Group);

    // L3 - Vector Embeddings Layer (Constellation of Points & Connecting Beams)
    const l3Group = new THREE.Group();
    const pointGeom = new THREE.SphereGeometry(0.045, 8, 8);
    const pointMat = new THREE.MeshBasicMaterial({ color: yellowColor });

    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 22; i++) {
      const point = new THREE.Mesh(pointGeom, pointMat);
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 1.3,
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 1.2
      );
      point.position.copy(pos);
      l3Group.add(point);
      points.push(pos);
    }

    const lineMat = new THREE.LineBasicMaterial({ color: cobaltColor, transparent: true, opacity: 0.35 });
    for (let i = 0; i < 18; i++) {
      const p1 = points[Math.floor(Math.random() * points.length)];
      const p2 = points[Math.floor(Math.random() * points.length)];
      const lineGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const line = new THREE.Line(lineGeom, lineMat);
      l3Group.add(line);
    }
    l3Group.position.x = 3.0;
    scene.add(l3Group);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(10, 20, inkColor, 0xcccccc);
    gridHelper.position.y = -1.8;
    scene.add(gridHelper);

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle natural breathing rotations
      l0Group.rotation.y = Math.sin(elapsedTime * 0.6) * 0.15;
      l1Group.rotation.y = Math.cos(elapsedTime * 0.5) * 0.2;
      l1Group.rotation.z = Math.sin(elapsedTime * 0.3) * 0.05;
      l2Group.rotation.y = Math.sin(elapsedTime * 0.7) * 0.18;
      l3Group.rotation.y = elapsedTime * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 500;
      height = container.clientHeight || 400;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[340px]">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {/* Interactive Layer Pills Overlay */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-1 pointer-events-auto bg-surface/90 border-2 border-on-background p-1.5 shadow-[2px_2px_0px_0px_#111111]">
        <button
          onClick={() => onSelectLayer?.('L0')}
          className="flex-1 px-2 py-1 text-center font-mono text-[11px] font-bold uppercase border border-on-background hover:bg-primary-container transition-colors"
        >
          L0: RAW
        </button>
        <button
          onClick={() => onSelectLayer?.('L1')}
          className="flex-1 px-2 py-1 text-center font-mono text-[11px] font-bold uppercase border border-on-background hover:bg-primary-container transition-colors"
        >
          L1: PROPS
        </button>
        <button
          onClick={() => onSelectLayer?.('L2')}
          className="flex-1 px-2 py-1 text-center font-mono text-[11px] font-bold uppercase border border-on-background hover:bg-primary-container transition-colors"
        >
          L2: GIST
        </button>
        <button
          onClick={() => onSelectLayer?.('L3')}
          className="flex-1 px-2 py-1 text-center font-mono text-[11px] font-bold uppercase border border-on-background hover:bg-primary-container transition-colors"
        >
          L3: VECTOR
        </button>
      </div>
    </div>
  );
};
