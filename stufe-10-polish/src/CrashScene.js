function loadThree() {
  if (window.THREE) return Promise.resolve(window.THREE);
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js";
    script.async = true;
    script.onload = () => window.THREE ? resolve(window.THREE) : reject(new Error("Three.js did not initialize."));
    script.onerror = () => reject(new Error("Three.js could not be loaded."));
    document.head.append(script);
  });
}

export function initCrashScene(clock) {

  const panel = document.querySelector("#crash-scene");
  const canvas = document.querySelector("#crash-canvas");
  let renderer;
  let scene;
  let camera;
  let animationFrame;
  let fallbackTimer;
  let threePromise;

  function complete() {
    window.clearTimeout(fallbackTimer);
    panel.hidden = true;
    window.dispatchEvent(new Event("ng:crash-scene-complete"));
  }

  function showFallback(error) {
    if (error) console.warn("3D crash scene is unavailable; keeping the 2D result.", error);
    panel.dataset.mode = "fallback";
    panel.hidden = false;
    cancelAnimationFrame(animationFrame);
    window.clearTimeout(fallbackTimer);
    fallbackTimer = window.setTimeout(complete, 4200);
  }

  window.addEventListener("ng:crash", async event => {
    panel.hidden = false;
    window.clearTimeout(fallbackTimer);
    let THREE;
    try {
      threePromise ??= loadThree().catch(error => { threePromise = null; throw error; });
      THREE = await threePromise;
    } catch (error) {
      showFallback(error);
      return;
    }

    try {
      if (!renderer) {
        const nextRenderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true });
        nextRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        const nextScene = new THREE.Scene();
        nextScene.background = new THREE.Color("#03070b");
        const nextCamera = new THREE.PerspectiveCamera(48, 5 / 3, .1, 100);
        nextScene.add(new THREE.HemisphereLight(0x8deeff, 0x07101a, 2));
        const grid = new THREE.GridHelper(40, 40, 0x20dff5, 0x123943);
        grid.position.y = -.65;
        nextScene.add(grid);
        renderer = nextRenderer; scene = nextScene; camera = nextCamera;
      }

      while (scene.children.length > 2) {
      const child = scene.children.at(-1);
      scene.remove(child);
      child.geometry?.dispose();
      if (Array.isArray(child.material)) child.material.forEach(material => material.dispose());
      else child.material?.dispose();
      }
      const detail = event.detail;
      for (const trail of detail.trails) {
      if (trail.cells.length < 2) continue;
      const points = trail.cells.map((cell, index) => new THREE.Vector3(cell.x - 20, -.42 + index / trail.cells.length * .22, cell.y - 12));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: trail.color, transparent: true, opacity: .8 });
      const beam = new THREE.Line(geometry, material);
      beam.userData.trailLength = points.length;
      beam.userData.derezz = trail.id === detail.crashed;
      scene.add(beam);
      const shadowGeometry = new THREE.BufferGeometry().setFromPoints(points.map(point => point.clone().add(new THREE.Vector3(0, -.22, 0))));
      scene.add(new THREE.Line(shadowGeometry, new THREE.LineBasicMaterial({ color: trail.color, transparent: true, opacity: .35 })));
      for (let index = 0; index < points.length; index += 3) {
        const postGeometry = new THREE.BufferGeometry().setFromPoints([
          points[index].clone().add(new THREE.Vector3(0, -.01, 0)),
          points[index].clone().add(new THREE.Vector3(0, -.22, 0))
        ]);
        scene.add(new THREE.Line(postGeometry, new THREE.LineBasicMaterial({ color: trail.color, transparent: true, opacity: .48 })));
      }
      }
      for (const rider of detail.riders) {
      const color = new THREE.Color(rider.color);
      const shape = new THREE.Shape();
      shape.moveTo(.8, 0); shape.lineTo(-.55, -.46); shape.lineTo(-.32, 0); shape.lineTo(-.55, .46); shape.closePath();
      const cycle = new THREE.Mesh(
        new THREE.ShapeGeometry(shape),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.8, metalness: .25, roughness: .35 })
      );
      cycle.rotation.x = -Math.PI / 2;
      cycle.position.set(rider.x - 20, .25, rider.y - 12);
      cycle.rotation.y = -Math.atan2(rider.dy, rider.dx);
      scene.add(cycle);
      }
      const impact = detail.riders.find(rider => rider.id === "player") ?? detail.riders[0];
      if (impact) {
      const ringMaterial = new THREE.MeshBasicMaterial({ color: "#bff9ff", wireframe: true, transparent: true, opacity: .9 });
      const ring = new THREE.Mesh(new THREE.IcosahedronGeometry(.8, 1), ringMaterial);
      ring.position.set(impact.x - 20, 0, impact.y - 12);
      scene.add(ring);
      ring.userData.explosion = true;
      }
      const start = clock.now;
      const focus = impact ?? { x: 20, y: 12 };
      camera.position.set(focus.x - 20 + 8, 11, focus.y - 12 + 11);
      camera.lookAt(focus.x - 20, 0, focus.y - 12);
      renderer.setSize(panel.clientWidth, panel.clientHeight, false);
      cancelAnimationFrame(animationFrame);
      function animate() {
      const elapsed = clock.now - start;
      camera.position.x = focus.x - 20 + 8 + Math.sin(elapsed / 900) * 2.5;
      camera.position.z = focus.y - 12 + 11 - Math.min(elapsed / 1000, 1) * 4;
      camera.lookAt(focus.x - 20, 0, focus.y - 12);
      scene.children.filter(child => child.userData.explosion).forEach(ring => {
        const scale = 1 + elapsed / 260;
        ring.scale.setScalar(scale);
        ring.material.opacity = Math.max(0, 1 - elapsed / 1500);
      });
      scene.children.filter(child => child.userData.derezz).forEach(beam => {
        const removed = Math.floor(beam.userData.trailLength * Math.min(1, elapsed / 1500));
        beam.geometry.setDrawRange(removed, beam.userData.trailLength - removed);
      });
      try {
        renderer.render(scene, camera);
      } catch (error) {
        showFallback(error);
        return;
      }
      if (elapsed < 4200) animationFrame = requestAnimationFrame(animate);
      else complete();
      }
      fallbackTimer = window.setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        complete();
      }, 6500);
      animationFrame = requestAnimationFrame(animate);
    } catch (error) {
      showFallback(error);
    }
  });

  window.addEventListener("resize", () => {
    if (!renderer || panel.hidden) return;
    renderer.setSize(panel.clientWidth, panel.clientHeight, false);
    camera.aspect = panel.clientWidth / Math.max(1, panel.clientHeight);
    camera.updateProjectionMatrix();
  });
}
