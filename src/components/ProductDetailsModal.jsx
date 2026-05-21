import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

function Product3DView({ product }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const previousPointerPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 320;
    let height = Math.max(width * 0.9, 320);

    // Initialize WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create Scene
    const scene = new THREE.Scene();

    // Create Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10);
    camera.position.set(0, 0.1, 3.0); // Slightly closer and lower for perfect catalog framing

    // Premium Studio Lighting Network
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55); // Rich soft base fill
    scene.add(ambientLight);

    // Front-Right Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff8e7, 1.6);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    // Front-Left Cool Fill Light
    const fillLight = new THREE.DirectionalLight(0xe7f0ff, 0.9);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    // High Rim Light (Casts beautiful highlighting over contours of garments and rings)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(0, 6, -3);
    scene.add(rimLight);

    // Point Light for sparkling specular glimmers
    const sparkleLight = new THREE.PointLight(0xffffff, 1.0, 10);
    sparkleLight.position.set(0, 1.8, 2.2);
    scene.add(sparkleLight);

    // Create a rotating group
    const productGroup = new THREE.Group();
    scene.add(productGroup);

    // Build the beautiful 3D mesh based on category & title
    const titleLower = (product.title || '').toLowerCase();
    const catLower = (product.category || '').toLowerCase();

    const isJewelry = catLower.includes('jewel') || titleLower.includes('ring') || titleLower.includes('bracelet') || titleLower.includes('gem') || titleLower.includes('earring');
    const isClothing = catLower.includes('clothing') || titleLower.includes('gown') || titleLower.includes('kirtle') || titleLower.includes('coat') || titleLower.includes('sherwani') || titleLower.includes('tunic') || titleLower.includes('blazer') || titleLower.includes('kimono') || titleLower.includes('jacket');
    const isTech = catLower.includes('electronics') || titleLower.includes('drive') || titleLower.includes('ssd') || titleLower.includes('tv') || titleLower.includes('playstation') || titleLower.includes('monitor') || titleLower.includes('audio');
    const isBag = catLower.includes('bag') || titleLower.includes('backpack') || titleLower.includes('pack') || titleLower.includes('handbag') || titleLower.includes('tote');

    // Store all created geometries & materials for strict disposal on cleanup
    const disposables = [];

    const trackDisposable = (obj) => {
      disposables.push(obj);
      return obj;
    };

    if (isJewelry) {
      // 💍 Premium Gold Ring with diamond gemstone!
      const ringGeo = trackDisposable(new THREE.TorusGeometry(0.55, 0.08, 16, 100));
      const goldMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: 0xE5C483, // Elegant luxury champagne gold
        metalness: 1.0,
        roughness: 0.08,
      }));
      const ringMesh = new THREE.Mesh(ringGeo, goldMat);
      ringMesh.rotation.x = Math.PI / 2; // Flat circle
      productGroup.add(ringMesh);

      // Cut diamond gem
      const gemGeo = trackDisposable(new THREE.OctahedronGeometry(0.18, 0));
      const gemMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: 0xE8F5F8, // Sparkling aquamarine/diamond clear
        metalness: 0.1,
        roughness: 0.03,
        transparent: true,
        opacity: 0.85,
      }));
      const gemMesh = new THREE.Mesh(gemGeo, gemMat);
      gemMesh.position.set(0, 0.55, 0);
      productGroup.add(gemMesh);

      // 4 gold prongs keeping the gemstone secure
      for (let i = 0; i < 4; i++) {
        const prongGeo = trackDisposable(new THREE.CylinderGeometry(0.015, 0.015, 0.08, 8));
        const prong = new THREE.Mesh(prongGeo, goldMat);
        const angle = (i * Math.PI) / 2;
        prong.position.set(Math.cos(angle) * 0.1, 0.55, Math.sin(angle) * 0.1);
        prong.rotation.x = Math.PI / 4;
        productGroup.add(prong);
      }
    } else if (isBag) {
      // 👜 Premium leather designer handbag with gold strap rings & buckle closure!
      
      // Grounding base & pillar in luxury marble style
      const baseGeo = trackDisposable(new THREE.CylinderGeometry(0.38, 0.42, 0.05, 32));
      const baseMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: 0xFAF7F2, // Cream marble
        roughness: 0.18,
        metalness: 0.1,
      }));
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = -0.85;
      productGroup.add(baseMesh);

      const pillarGeo = trackDisposable(new THREE.CylinderGeometry(0.28, 0.32, 0.4, 32));
      const pillarMesh = new THREE.Mesh(pillarGeo, baseMat);
      pillarMesh.position.y = -0.65;
      productGroup.add(pillarMesh);

      const bagGeo = trackDisposable(new THREE.CylinderGeometry(0.28, 0.38, 0.45, 32, 1));
      bagGeo.scale(1, 1, 0.6); // Flattened to form a handbag shape

      let leatherColor = 0x6E473B; // Cognac Tan leather
      if (titleLower.includes('black') || titleLower.includes('dark')) {
        leatherColor = 0x1C1C1C;
      }
      const leatherMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: leatherColor,
        roughness: 0.7,
        metalness: 0.05,
      }));
      const bagMesh = new THREE.Mesh(bagGeo, leatherMat);
      bagMesh.position.y = -0.22; // Sitting exactly on top of the pedestal (top of pedestal is at y = -0.45)
      productGroup.add(bagMesh);

      // Gold elements
      const goldMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: 0xE5C483,
        metalness: 1.0,
        roughness: 0.1,
      }));

      // Gold magnetic lock center clasp
      const claspGeo = trackDisposable(new THREE.BoxGeometry(0.08, 0.08, 0.25));
      const clasp = new THREE.Mesh(claspGeo, goldMat);
      clasp.position.set(0, -0.12, 0.12);
      productGroup.add(clasp);

      // Designer arched handbag strap
      const strapGeo = trackDisposable(new THREE.TorusGeometry(0.22, 0.024, 12, 48, Math.PI));
      const strapMesh = new THREE.Mesh(strapGeo, leatherMat);
      strapMesh.position.set(0, -0.01, 0);
      productGroup.add(strapMesh);

      // Gold connecting rings for the strap
      const ringGeo = trackDisposable(new THREE.TorusGeometry(0.04, 0.008, 8, 24));
      const ringLeft = new THREE.Mesh(ringGeo, goldMat);
      ringLeft.position.set(-0.22, -0.01, 0);
      const ringRight = ringLeft.clone();
      ringRight.position.set(0.22, -0.01, 0);
      productGroup.add(ringLeft);
      productGroup.add(ringRight);
    } else if (isTech) {
      // 💻 Modern minimalist obsidian gadget chassis with warm gold LED accent glow!
      
      // Grounding base & pillar in deep obsidian dark style
      const baseGeo = trackDisposable(new THREE.CylinderGeometry(0.38, 0.42, 0.05, 32));
      const baseMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: 0x1C1C1C, // Obsidian black
        roughness: 0.1,
        metalness: 0.9,
      }));
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = -0.85;
      productGroup.add(baseMesh);

      const pillarGeo = trackDisposable(new THREE.CylinderGeometry(0.25, 0.28, 0.4, 32));
      const pillarMesh = new THREE.Mesh(pillarGeo, baseMat);
      pillarMesh.position.y = -0.65;
      productGroup.add(pillarMesh);

      // Main brushed slate metal housing
      const bodyGeo = trackDisposable(new THREE.BoxGeometry(0.55, 0.8, 0.12));
      const bodyMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: 0x2C302E, // Matte deep charcoal
        metalness: 0.95,
        roughness: 0.22,
      }));
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bodyMesh.position.y = -0.05; // Bottom sits exactly at y = -0.45 (top of pillar)
      productGroup.add(bodyMesh);

      // Front polished glass facade panel
      const glassGeo = trackDisposable(new THREE.BoxGeometry(0.51, 0.76, 0.13));
      const glassMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: 0x070707, // Liquid black gloss glass
        metalness: 0.85,
        roughness: 0.02,
      }));
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      glassMesh.position.y = -0.05;
      productGroup.add(glassMesh);

      // Sleek warm gold emissive status indicator line
      const ledGeo = trackDisposable(new THREE.BoxGeometry(0.015, 0.7, 0.14));
      const ledMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: 0xB59A6D, // Warm Brand Gold
        emissive: 0xB59A6D,
        emissiveIntensity: 3.5,
        roughness: 0.1,
      }));
      const ledMesh = new THREE.Mesh(ledGeo, ledMat);
      ledMesh.position.set(0.22, -0.05, 0); // Positioned on the right edge
      productGroup.add(ledMesh);

      // Gold pins / port connector
      const connectorGeo = trackDisposable(new THREE.BoxGeometry(0.12, 0.04, 0.08));
      const goldMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: 0xE5C483,
        metalness: 1.0,
        roughness: 0.1,
      }));
      const connector = new THREE.Mesh(connectorGeo, goldMat);
      connector.position.set(0, -0.41, 0.04);
      productGroup.add(connector);
    } else if (isClothing) {
      // 👗 High-end clothing model! Differentiates between Gowns/Dresses and Tops/Coats/Shirts
      const isGown = titleLower.includes('gown') || titleLower.includes('kirtle') || titleLower.includes('lehenga') || titleLower.includes('kimono') || titleLower.includes('dress');

      // Shared gold elements material
      const goldMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: 0xC3A67A, // Warm brushed gold/bronze
        metalness: 0.9,
        roughness: 0.15,
      }));

      let dressColor = 0x1B4D3E; // Default Emerald Velvet
      if (titleLower.includes('crimson') || titleLower.includes('red') || titleLower.includes('kirtle')) {
        dressColor = 0x800020; // Velvet Burgundy
      } else if (titleLower.includes('elven') || titleLower.includes('sage') || titleLower.includes('moss')) {
        dressColor = 0x2D5A27; // Ethereal Sage/Moss Velvet
      } else if (titleLower.includes('celestial') || titleLower.includes('constellation') || titleLower.includes('star')) {
        dressColor = 0x1B2A4A; // Celestial Midnight Navy
      } else if (titleLower.includes('lehenga') || titleLower.includes('peony') || titleLower.includes('peach') || titleLower.includes('pink')) {
        dressColor = 0xF2D2BD; // Blush Peach Raw Silk
      } else if (titleLower.includes('obsidian') || titleLower.includes('black') || titleLower.includes('kimono')) {
        dressColor = 0x111111; // Heavy black silk
      } else if (titleLower.includes('alabaster') || titleLower.includes('blazer') || titleLower.includes('white')) {
        dressColor = 0xFAF7F2; // Cream Cashmere
      } else if (titleLower.includes('tunic') || titleLower.includes('knight')) {
        dressColor = 0x2E1E3B; // Deep knightly purple
      } else if (titleLower.includes('jacket') || titleLower.includes('rain') || titleLower.includes('windbreaker') || titleLower.includes('coat')) {
        dressColor = 0x3d5a80; // Slate Blue Casual
      } else if (titleLower.includes('danvouy') || titleLower.includes('t-shirt') || titleLower.includes('tee') || titleLower.includes('casual') || titleLower.includes('cotton') || titleLower.includes('shirt')) {
        dressColor = 0x4f5d73; // Cotton Slate/Navy
      }

      console.log(`[Product3DView Curation Debug]`, {
        productId: product.id,
        productTitle: product.title,
        titleLower,
        isClothing,
        isGown,
        resolvedColor: '0x' + dressColor.toString(16)
      });

      // Luxury fabric material with double-sided rendering to give physical thickness/volume
      const fabricMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: dressColor,
        roughness: 0.6,
        metalness: 0.05,
        side: THREE.DoubleSide, // Essential to prevent transparent gaps in hollow models!
      }));

      // Garment sub-group (centered at z = 0)
      const garmentGroup = new THREE.Group();
      productGroup.add(garmentGroup);

      if (isGown) {
        // --- 👗 GOWN/DRESS DISPLAY ---
        
        // Marble pedestal base (pushed slightly back at z = -0.08)
        const baseGeo = trackDisposable(new THREE.CylinderGeometry(0.38, 0.42, 0.05, 32));
        const baseMat = trackDisposable(new THREE.MeshStandardMaterial({
          color: 0xFAF7F2, // Cream marble white
          roughness: 0.18,
          metalness: 0.1,
        }));
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.set(0, -0.85, -0.08);
        productGroup.add(baseMesh);

        // Gold mannequin support rod (pushed slightly back at z = -0.08)
        const rodGeo = trackDisposable(new THREE.CylinderGeometry(0.015, 0.015, 1.45, 16));
        const rodMesh = new THREE.Mesh(rodGeo, goldMat);
        rodMesh.position.set(0, -0.15, -0.08);
        productGroup.add(rodMesh);

        // Gold collar ring (placed at neck opening z = -0.02)
        const collarGeo = trackDisposable(new THREE.TorusGeometry(0.08, 0.012, 8, 24));
        const collarMesh = new THREE.Mesh(collarGeo, goldMat);
        collarMesh.position.set(0, 0.52, -0.02);
        collarMesh.rotation.x = Math.PI / 2;
        garmentGroup.add(collarMesh);

        // Volumetric upper bodice cylinder (solid, centered at z = 0)
        const bodiceGeo = trackDisposable(new THREE.CylinderGeometry(0.18, 0.14, 0.45, 32));
        bodiceGeo.scale(1, 1, 0.65); // Flatter torso
        const bodiceMesh = new THREE.Mesh(bodiceGeo, fabricMat);
        bodiceMesh.position.set(0, 0.32, 0);
        garmentGroup.add(bodiceMesh);

        // Volumetric hollow skirt cone with double side rendering! (centered at z = 0)
        const skirtGeo = trackDisposable(new THREE.CylinderGeometry(0.14, 0.45, 0.8, 32, 1, true));
        skirtGeo.scale(1, 1, 0.7);
        const skirtMesh = new THREE.Mesh(skirtGeo, fabricMat);
        skirtMesh.position.set(0, -0.25, 0);
        garmentGroup.add(skirtMesh);

        // Elegant draped sleeves (bell sleeve outline)
        const sleeveLGeo = trackDisposable(new THREE.CylinderGeometry(0.06, 0.14, 0.3, 16, 1, true));
        const sleeveL = new THREE.Mesh(sleeveLGeo, fabricMat);
        sleeveL.position.set(-0.21, 0.28, 0);
        sleeveL.rotation.z = Math.PI / 5;
        garmentGroup.add(sleeveL);

        const sleeveRGeo = trackDisposable(new THREE.CylinderGeometry(0.06, 0.14, 0.3, 16, 1, true));
        const sleeveR = new THREE.Mesh(sleeveRGeo, fabricMat);
        sleeveR.position.set(0.21, 0.28, 0);
        sleeveR.rotation.z = -Math.PI / 5;
        garmentGroup.add(sleeveR);
      } else {
        // --- 👕 CASUAL TOP / COAT / BLAZER / T-SHIRT ON T-STAND ---
        
        // Marble pedestal base (pushed back at z = -0.08)
        const baseGeo = trackDisposable(new THREE.CylinderGeometry(0.38, 0.42, 0.05, 32));
        const baseMat = trackDisposable(new THREE.MeshStandardMaterial({
          color: 0xFAF7F2, // Cream marble white
          roughness: 0.18,
          metalness: 0.1,
        }));
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.set(0, -0.85, -0.08);
        productGroup.add(baseMesh);

        // Gold vertical support rod (pushed back at z = -0.08)
        const rodGeo = trackDisposable(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 16));
        const rodMesh = new THREE.Mesh(rodGeo, goldMat);
        rodMesh.position.set(0, -0.15, -0.08); // Extends from -0.85 to 0.55
        productGroup.add(rodMesh);

        // Gold horizontal crossbar at the top (aligned at z = -0.08)
        const crossbarGeo = trackDisposable(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 16));
        const crossbarMesh = new THREE.Mesh(crossbarGeo, goldMat);
        crossbarMesh.rotation.z = Math.PI / 2; // Horizontal
        crossbarMesh.position.set(0, 0.55, -0.08);
        garmentGroup.add(crossbarMesh);

        // Hanger Hook (now hangs from crossbar, positioned at z = -0.08 to -0.04)
        const hookGeo = trackDisposable(new THREE.TorusGeometry(0.05, 0.01, 8, 24, Math.PI * 1.3));
        const hookMesh = new THREE.Mesh(hookGeo, goldMat);
        hookMesh.position.set(0, 0.50, -0.06); // Hook rests on crossbar at 0.55
        hookMesh.rotation.z = -Math.PI / 4;
        garmentGroup.add(hookMesh);

        // Curved Hanger Bar (pushed slightly back to z = -0.04 to sit neatly inside shirt collar)
        const hangerGeo = trackDisposable(new THREE.TorusGeometry(0.24, 0.015, 8, 32, Math.PI));
        const hangerMesh = new THREE.Mesh(hangerGeo, goldMat);
        hangerMesh.position.set(0, 0.35, -0.04);
        hangerMesh.rotation.z = Math.PI;
        garmentGroup.add(hangerMesh);

        // Gold collar ring (placed at z = -0.02, aligned with t-shirt neck)
        const collarGeo = trackDisposable(new THREE.TorusGeometry(0.085, 0.01, 8, 24));
        const collarMesh = new THREE.Mesh(collarGeo, goldMat);
        collarMesh.position.set(0, 0.36, -0.02);
        collarMesh.rotation.x = Math.PI / 2;
        garmentGroup.add(collarMesh);

        // Volumetric Shirt Torso - Boxy, realistic, short-sleeve t-shirt proportions (centered at z = 0)
        const shirtGeo = trackDisposable(new THREE.CylinderGeometry(0.24, 0.24, 0.54, 32));
        shirtGeo.scale(1, 1, 0.5); // Flat volumetric torso
        const shirtMesh = new THREE.Mesh(shirtGeo, fabricMat);
        shirtMesh.position.set(0, 0.10, 0);
        garmentGroup.add(shirtMesh);

        // Volumetric Short Sleeves - Shorter, neat casual short sleeve profile (centered at z = 0)
        const sleeveLGeo = trackDisposable(new THREE.CylinderGeometry(0.08, 0.075, 0.16, 16));
        const sleeveL = new THREE.Mesh(sleeveLGeo, fabricMat);
        sleeveL.position.set(-0.29, 0.24, 0);
        sleeveL.rotation.z = Math.PI / 6; // 30 degrees tilt down
        garmentGroup.add(sleeveL);

        const sleeveRGeo = trackDisposable(new THREE.CylinderGeometry(0.08, 0.075, 0.16, 16));
        const sleeveR = new THREE.Mesh(sleeveRGeo, fabricMat);
        sleeveR.position.set(0.29, 0.24, 0);
        sleeveR.rotation.z = -Math.PI / 6; // 30 degrees tilt down
        garmentGroup.add(sleeveR);
      }
    } else {
      // 🏺 Minimalist museum centerpiece abstract: cream column pedestal with floating gold orbital rings surrounding a light core!
      const pedGeo = trackDisposable(new THREE.CylinderGeometry(0.35, 0.4, 0.4, 32));
      const pedMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: 0xFAF7F2, // Cream marble
        roughness: 0.18,
        metalness: 0.05,
      }));
      const pedMesh = new THREE.Mesh(pedGeo, pedMat);
      pedMesh.position.y = -0.55;
      productGroup.add(pedMesh);

      // Gleaming floating light sphere core
      const sphereGeo = trackDisposable(new THREE.SphereGeometry(0.18, 32, 32));
      const sphereMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: 0xFDFBF7,
        roughness: 0.05,
        metalness: 0.1,
      }));
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.y = 0.05;
      productGroup.add(sphereMesh);

      // Polished gold orbital ring surrounding the sphere
      const ringGeo = trackDisposable(new THREE.TorusGeometry(0.32, 0.015, 8, 48));
      const goldMat = trackDisposable(new THREE.MeshStandardMaterial({
        color: 0xE5C483,
        metalness: 1.0,
        roughness: 0.08,
      }));
      const ringMesh = new THREE.Mesh(ringGeo, goldMat);
      ringMesh.position.y = 0.05;
      ringMesh.rotation.x = Math.PI / 3;
      ringMesh.rotation.y = Math.PI / 6;
      productGroup.add(ringMesh);
    }

    // Animation & Interactive loops
    let animationId;
    let autoRotationSpeed = 0.005;

    const handlePointerDown = (e) => {
      isDragging.current = true;
      canvas.style.cursor = 'grabbing';
      previousPointerPosition.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mousePosition.current = { x, y };

      if (isDragging.current) {
        const deltaX = e.clientX - previousPointerPosition.current.x;
        const deltaY = e.clientY - previousPointerPosition.current.y;

        productGroup.rotation.y += deltaX * 0.007;
        productGroup.rotation.x += deltaY * 0.007;

        previousPointerPosition.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      canvas.style.cursor = 'grab';
    };

    const handlePointerLeave = () => {
      isDragging.current = false;
      setIsHovered(false);
      canvas.style.cursor = 'grab';
    };

    const handlePointerEnter = () => {
      setIsHovered(true);
      canvas.style.cursor = isDragging.current ? 'grabbing' : 'grab';
    };

    // Attach interaction listeners to canvas directly
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('pointerenter', handlePointerEnter);

    const animate = () => {
      // Gentle auto-rotation and interactive lighting tilt when not dragging
      if (!isDragging.current) {
        productGroup.rotation.y += autoRotationSpeed;
        
        if (isHovered) {
          // Soft interactive hover tilt toward pointer
          const rect = canvas.getBoundingClientRect();
          const targetRotX = -(mousePosition.current.y / (rect.height / 2)) * 0.4;
          const targetRotY = (mousePosition.current.x / (rect.width / 2)) * 0.4;
          
          productGroup.rotation.x += (targetRotX - productGroup.rotation.x) * 0.05;
          // Add hover rotation on top of continuous spin
          productGroup.rotation.y += (targetRotY * 0.02);
        } else {
          // Lerp back to base resting X tilt
          productGroup.rotation.x += (0.15 - productGroup.rotation.x) * 0.05;
        }
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Responsive Canvas Resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newWidth } = entry.contentRect;
        const newHeight = Math.max(newWidth * 0.9, 320);

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // Strict cleanup of WebGL context, textures, geometries, and materials
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);

      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('pointerenter', handlePointerEnter);

      disposables.forEach((item) => {
        if (item.dispose) item.dispose();
      });

      renderer.dispose();
    };
  }, [product.id, isHovered]);

  return (
    <div className="product-3d-canvas-container" ref={containerRef} style={{ width: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} className="product-3d-canvas" style={{ display: 'block', touchAction: 'none', cursor: isDragging.current ? 'grabbing' : 'grab' }} />
      <span className="product-3d-caption">
        {isHovered ? 'Drag or hover to steer rotation & lighting' : 'Interactive 3D Studio • Hover or drag model'}
      </span>
    </div>
  );
}

export default function ProductDetailsModal({ 
  product, 
  onClose, 
  onAdd, 
  isInCart, 
  quantityInCart, 
  updateQuantity 
}) {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState('image'); // 'image' or '3d'
  const { title, price, description, category, image, rating } = product;

  // Handle clicking on backdrop
  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop active') {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop active" onClick={handleBackdropClick}>
      <div className="modal-container" role="dialog" aria-modal="true" id={`detail-modal-${product.id}`}>
        {/* Close Button */}
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close product details"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <div className="modal-content-grid">
          {/* Left Column: Image & 3D viewports */}
          <div className="modal-image-panel">
            {/* Elegant Tab Controls */}
            <div className="modal-media-tabs">
              <button 
                className={`media-tab-btn ${activeTab === 'image' ? 'active' : ''}`}
                onClick={() => setActiveTab('image')}
                type="button"
              >
                <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>Gallery Image</span>
              </button>
              <button 
                className={`media-tab-btn ${activeTab === '3d' ? 'active' : ''}`}
                onClick={() => setActiveTab('3d')}
                type="button"
              >
                <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span>3D Curator View</span>
              </button>
            </div>

            <div className="modal-media-viewport">
              {activeTab === 'image' ? (
                <div className="modal-image-wrapper animate-fade-in">
                  <img src={image} alt={title} className="modal-product-image" />
                </div>
              ) : (
                <div className="modal-3d-wrapper animate-fade-in">
                  <Product3DView product={product} />
                </div>
              )}
            </div>
            <span className="modal-category-tag">{category}</span>
          </div>

          {/* Right Column: Information */}
          <div className="modal-info-panel">
            <span className="modal-release-label">Exclusive Curator Release</span>
            <h2 className="modal-product-title">{title}</h2>

            <div className="modal-ratings-row">
              <div className="modal-stars">
                {Array.from({ length: 5 }, (_, idx) => (
                  <svg
                    key={idx}
                    className={`modal-star-icon ${idx < Math.round(rating?.rate || 0) ? 'active' : ''}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="modal-rating-text">
                {rating?.rate || 0} / 5.0 ({rating?.count || 0} Verified Collector Reviews)
              </span>
            </div>

            <div className="modal-price-divider"></div>
            
            <div className="modal-price-row">
              <span className="modal-price">${price.toFixed(2)}</span>
              {isInCart && <span className="modal-in-cart-badge">{quantityInCart} items in your cart</span>}
            </div>

            <div className="modal-description-wrapper">
              <h3>Gallery Description</h3>
              <p>{description}</p>
            </div>

            {/* Atelier details */}
            <div className="modal-specs-block">
              <div className="spec-row">
                <span className="spec-label">Availability</span>
                <span className="spec-val">Limited Edition / Hand-selected</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Category Code</span>
                <span className="spec-val">{category ? category.replace("'", "").replace(" ", "-") : 'N/A'}</span>
              </div>
              {product.subcategory && (
                <div className="spec-row">
                  <span className="spec-label">Atelier Style</span>
                  <span className="spec-val">{product.subcategory} Piece</span>
                </div>
              )}
              <div className="spec-row">
                <span className="spec-label">Curation Level</span>
                <span className="spec-val">Premium Certified Aether</span>
              </div>
            </div>

            <div className="modal-actions-area">
              {isInCart ? (
                <div className="modal-cart-controls">
                  <div className="modal-quantity-adjuster">
                    <button 
                      className="modal-qty-btn"
                      onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                      aria-label="Decrease quantity"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
                    </button>
                    <span className="modal-qty-num">{quantityInCart}</span>
                    <button 
                      className="modal-qty-btn"
                      onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                      aria-label="Increase quantity"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    </button>
                  </div>
                  <span className="modal-cart-status">Manage item quantity inside your cart</span>
                </div>
              ) : (
                <button 
                  className="modal-primary-buy-btn"
                  onClick={() => onAdd(product)}
                  id={`modal-add-${product.id}`}
                >
                  <svg className="modal-btn-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <span>Acquire for Curation</span>
                </button>
              )}
            </div>

            <div className="modal-trust-footer">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <span>Complimentary signature packaging and premium courier dispatch on order placement.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
