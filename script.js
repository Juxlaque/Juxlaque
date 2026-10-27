let dreamProgress = 0;

const init3DBackground = () => {
  const container = document.getElementById("bg-3d");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });

  scene.fog = new THREE.FogExp2(0x9aa0b4, 0.0);
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const particlesCount = 700;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 2000;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    transparent: true,
    opacity: 0.7,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  camera.position.z = 500;

  const animate = () => {
  requestAnimationFrame(animate);
  particles.rotation.x += 0.0005;
  particles.rotation.y += 0.0008;

  camera.position.z = 500 + dreamProgress * 900;
  scene.fog.density = dreamProgress * 0.0014;

  renderer.render(scene, camera);
};

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

const initAudio = () => {
  const audio = document.getElementById("bg-music");
  const muteBtn = document.getElementById("mute-btn");

  audio.volume = 0.5;

  const setIcon = (src) => {
    muteBtn.classList.remove("icon-in");
    muteBtn.classList.add("icon-out");
    setTimeout(() => {
      muteBtn.src = src;
      muteBtn.classList.remove("icon-out");
      muteBtn.classList.add("icon-in");
    }, 150);
  };

  audio.play()
    .then(() => { muteBtn.src = "./img/unmute.png"; })
    .catch(() => { muteBtn.src = "./img/mute.png"; });

  muteBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      setIcon("./img/unmute.png");
    } else {
      audio.pause();
      setIcon("./img/mute.png");
    }
  });
};

const initDream = () => {
  const root = document.documentElement;
  const SENSITIVITY = 0.0005;
  let target = 0;
  let current = 0;
  let lastTouchY = null;

  const clamp = (v) => Math.min(Math.max(v, 0), 1);

  window.addEventListener("wheel", (e) => {
    target = clamp(target + e.deltaY * SENSITIVITY);
  }, { passive: true });

  window.addEventListener("touchstart", (e) => {
    lastTouchY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    const y = e.touches[0].clientY;
    target = clamp(target + (lastTouchY - y) * SENSITIVITY * 3);
    lastTouchY = y;
  }, { passive: true });

  // Clavier (flèches / espace)
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === " ") target = clamp(target + 0.05);
    if (e.key === "ArrowUp") target = clamp(target - 0.05);
  });

  // Boucle de lissage
  const tick = () => {
    current += (target - current) * 0.06; // 0.06 = inertie douce
    if (Math.abs(target - current) < 0.0001) current = target;

    dreamProgress = current;
    root.style.setProperty("--p", current.toFixed(4));
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const text = "JUXLAQUE";
const speed = 120;

async function typeWriter() {
  const element = document.getElementById("typewriter");
  const cursor = document.querySelector(".cursor");
  
  if (element) {
    for (let i = 0; i < text.length; i++) {
      element.innerHTML += text.charAt(i);
      await sleep(speed);
    }
  }
  
  if (cursor) {
    cursor.classList.add("finished");
    await sleep(300);
    cursor.remove();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  init3DBackground();
  typeWriter();
  initAudio();
  initDream();
});