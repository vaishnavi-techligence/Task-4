import React, { useRef, useEffect, useState } from 'react';

export default function Interactive3DShowcase() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  // 3D Gemstone Vertices (Octahedron / Tall Crystal)
  const vertices = [
    { x: 0, y: -1.4, z: 0 },    // 0: Top Tip
    { x: 0.8, y: 0, z: 0.8 },   // 1: Mid Front Right
    { x: -0.8, y: 0, z: 0.8 },  // 2: Mid Front Left
    { x: -0.8, y: 0, z: -0.8 }, // 3: Mid Back Left
    { x: 0.8, y: 0, z: -0.8 },  // 4: Mid Back Right
    { x: 0, y: 1.4, z: 0 }     // 5: Bottom Tip
  ];

  // 3D Gemstone Faces (Triangles)
  const faces = [
    { v: [0, 1, 2], name: 'top-front' },
    { v: [0, 2, 3], name: 'top-left' },
    { v: [0, 3, 4], name: 'top-back' },
    { v: [0, 4, 1], name: 'top-right' },
    { v: [5, 2, 1], name: 'bottom-front' },
    { v: [5, 3, 2], name: 'bottom-left' },
    { v: [5, 4, 3], name: 'bottom-back' },
    { v: [5, 1, 4], name: 'bottom-right' }
  ];

  // Light source vector (normalized)
  const light = { x: 0.5, y: -0.5, z: -1.0 };
  const lightMag = Math.sqrt(light.x * light.x + light.y * light.y + light.z * light.z);
  const normLight = { x: light.x / lightMag, y: light.y / lightMag, z: light.z / lightMag };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Rotation state
    let angleX = 0.3;
    let angleY = 0.5;
    let targetAngleX = 0.3;
    let targetAngleY = 0.5;

    // Handle resize
    const resizeCanvas = () => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = Math.max(rect.width, 240);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse interactions
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseRef.current = { x, y };

      // Tilt slightly toward mouse
      targetAngleY = (x / (rect.width / 2)) * 0.8;
      targetAngleX = -(y / (rect.height / 2)) * 0.8;
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      // Resume slow drift
      targetAngleX = 0;
      targetAngleY = 0;
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mouseenter', handleMouseEnter);

    // Game loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const scaleFactor = Math.min(width, height) * 0.3;

      // Slow drift rotation when not hovered, otherwise lerp to target
      if (!isHovered) {
        angleY += 0.008;
        angleX = 0.2 + Math.sin(Date.now() * 0.0005) * 0.15;
      } else {
        angleX += (targetAngleX - angleX) * 0.1;
        angleY += (targetAngleY - angleY) * 0.1;
      }

      // Pre-calculate sin/cos
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // 1. Rotate and Project Vertices
      const projected = vertices.map(v => {
        // Rotate around Y
        let x1 = v.x * cosY - v.z * sinY;
        let z1 = v.x * sinY + v.z * cosY;

        // Rotate around X
        let y2 = v.y * cosX - z1 * sinX;
        let z2 = v.y * sinX + z1 * cosX;

        // Perspective Projection
        const focalLength = 3.5;
        const d = focalLength / (focalLength + z2);
        
        return {
          x: centerX + x1 * d * scaleFactor,
          y: centerY + y2 * d * scaleFactor,
          z: z2 // keep depth for z-sorting
        };
      });

      // 2. Map and Depth-Sort Faces (Painter's Algorithm)
      const mappedFaces = faces.map(f => {
        const p0 = projected[f.v[0]];
        const p1 = projected[f.v[1]];
        const p2 = projected[f.v[2]];
        
        // Calculate average Z (depth)
        const avgZ = (p0.z + p1.z + p2.z) / 3;

        // Calculate face normal vector
        // AB = B - A
        const ab = {
          x: vertices[f.v[1]].x - vertices[f.v[0]].x,
          y: vertices[f.v[1]].y - vertices[f.v[0]].y,
          z: vertices[f.v[1]].z - vertices[f.v[0]].z
        };
        // AC = C - A
        const ac = {
          x: vertices[f.v[2]].x - vertices[f.v[0]].x,
          y: vertices[f.v[2]].y - vertices[f.v[0]].y,
          z: vertices[f.v[2]].z - vertices[f.v[0]].z
        };
        // Cross product: AB x AC
        const normal = {
          x: ab.y * ac.z - ab.z * ac.y,
          y: ab.z * ac.x - ab.x * ac.z,
          z: ab.x * ac.y - ab.y * ac.x
        };
        // Normalize normal
        const mag = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
        const normN = { x: normal.x / mag, y: normal.y / mag, z: normal.z / mag };

        // Apply rotation to normal so lighting is dynamic
        // Rotate normal around Y
        let rx = normN.x * cosY - normN.z * sinY;
        let rz = normN.x * sinY + normN.z * cosY;
        // Rotate normal around X
        let ry = normN.y * cosX - rz * sinX;
        let rz2 = normN.y * sinX + rz * cosX;
        const rotatedNormal = { x: rx, y: ry, z: rz2 };

        // Calculate dot product with light source (Flat Shading)
        const dot = rotatedNormal.x * normLight.x + rotatedNormal.y * normLight.y + rotatedNormal.z * normLight.z;
        const shading = Math.max(0.1, dot);

        return {
          vertices: [p0, p1, p2],
          depth: avgZ,
          shading: shading,
          facingCamera: rotatedNormal.z > 0 // standard backface culling flag
        };
      });

      // Sort faces: farthest first
      mappedFaces.sort((a, b) => b.depth - a.depth);

      // 3. Draw Faces
      mappedFaces.forEach(face => {
        ctx.beginPath();
        ctx.moveTo(face.vertices[0].x, face.vertices[0].y);
        ctx.lineTo(face.vertices[1].x, face.vertices[1].y);
        ctx.lineTo(face.vertices[2].x, face.vertices[2].y);
        ctx.closePath();

        // Elegant warm luxury gold/champagne colors with dynamic shading intensity
        // Base luxury gold: HSL 39, 36%, 63% -> rgb(181, 154, 109)
        const goldHue = 39;
        const goldSat = 36;
        // Light intensity affects brightness
        const lightValue = Math.floor(45 + 40 * face.shading);
        
        ctx.fillStyle = `hsla(${goldHue}, ${goldSat}%, ${lightValue}%, 0.55)`;
        ctx.fill();

        // Draw elegant thin borders
        ctx.strokeStyle = `rgba(181, 154, 109, ${0.45 + 0.4 * face.shading})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      });

      // Draw subtle orbital particle ring for a floating luxury atelier space vibe
      const particleCount = 12;
      const ringRadius = scaleFactor * 1.3;
      ctx.strokeStyle = 'rgba(181, 154, 109, 0.08)';
      ctx.lineWidth = 0.5;
      
      // Draw projected orbit path
      ctx.beginPath();
      for (let i = 0; i <= 360; i += 5) {
        const rad = (i * Math.PI) / 180;
        const px = Math.cos(rad) * ringRadius;
        const pz = Math.sin(rad) * ringRadius;
        
        // Rotate Y
        let rx = px * cosY - pz * sinY;
        let rz = px * sinY + pz * cosY;
        // Rotate X
        let ry = -rz * sinX;
        let rz2 = rz * cosX;

        const focalLength = 3.5;
        const d = focalLength / (focalLength + rz2);
        
        const sx = centerX + rx * d;
        const sy = centerY + ry * d;

        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationId);
    };
  }, [isHovered]);

  return (
    <div className="atelier-3d-card" ref={containerRef}>
      <h3 className="atelier-title">Atelier Jewel</h3>
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} className="gem-3d-canvas" />
      </div>
      <p className="atelier-caption">
        {isHovered ? 'Active Mouse Attract Mode' : 'Hover to steer light projection'}
      </p>
    </div>
  );
}
