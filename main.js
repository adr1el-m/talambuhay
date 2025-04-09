import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000022); // Very dark blue background

// Create starfield background
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
});

const starVertices = [];
for (let i = 0; i < 20000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Add second layer of stars with different size for depth
const starGeometry2 = new THREE.BufferGeometry();
const starMaterial2 = new THREE.PointsMaterial({
    color: 0xaaccff, // Slightly blue tint
    size: 0.15,      // Slightly larger
    transparent: true,
});

const starVertices2 = [];
for (let i = 0; i < 5000; i++) {
    const x = (Math.random() - 0.5) * 1500;
    const y = (Math.random() - 0.5) * 1500;
    const z = (Math.random() - 0.5) * 1500;
    starVertices2.push(x, y, z);
}

starGeometry2.setAttribute('position', new THREE.Float32BufferAttribute(starVertices2, 3));
const stars2 = new THREE.Points(starGeometry2, starMaterial2);
scene.add(stars2);

// Add third layer with bright prominent stars
const starGeometry3 = new THREE.BufferGeometry();
const starMaterial3 = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.3,       // Much larger for prominent stars
    transparent: true,

});

const starVertices3 = [];
for (let i = 0; i < 200; i++) {
    const x = (Math.random() - 0.5) * 1000;
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 1000;
    starVertices3.push(x, y, z);
}

starGeometry3.setAttribute('position', new THREE.Float32BufferAttribute(starVertices3, 3));
const stars3 = new THREE.Points(starGeometry3, starMaterial3);
scene.add(stars3);

// Add nebula effect
const nebulaGeometry = new THREE.SphereGeometry(500, 32, 32);
const nebulaMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x0040ff) }, // Bright blue
        color2: { value: new THREE.Color(0xff0040) }  // Bright red
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        void main() {
            vec2 uv = vUv;
            float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
            float pattern = sin(uv.x * 10.0 + time) * sin(uv.y * 10.0 + time) * noise;
            vec3 color = mix(color1, color2, pattern);
            gl_FragColor = vec4(color, 0.3);
        }
    `,
    transparent: true,
    side: THREE.BackSide
});
const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
scene.add(nebula);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls for interactive camera movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.minDistance = 5;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI / 2;

// Create navigation controls
const navContainer = document.createElement('div');
navContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 1000;
`;
document.body.appendChild(navContainer);

// Create navigation buttons
const buttonStyle = `
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.4);
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-family: Arial, sans-serif;
    font-size: 16px;
    transition: all 0.3s ease;
`;

const prevButton = document.createElement('button');
prevButton.innerHTML = '← Previous';
prevButton.style.cssText = buttonStyle;
prevButton.onmouseover = () => prevButton.style.background = 'rgba(255, 255, 255, 0.3)';
prevButton.onmouseout = () => prevButton.style.background = 'rgba(255, 255, 255, 0.2)';
navContainer.appendChild(prevButton);

// Create slide indicator
const slideIndicator = document.createElement('div');
slideIndicator.style.cssText = `
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.4);
    color: white;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    font-size: 16px;
`;
navContainer.appendChild(slideIndicator);

const nextButton = document.createElement('button');
nextButton.innerHTML = 'Next →';
nextButton.style.cssText = buttonStyle;
nextButton.onmouseover = () => nextButton.style.background = 'rgba(255, 255, 255, 0.3)';
nextButton.onmouseout = () => nextButton.style.background = 'rgba(255, 255, 255, 0.2)';
navContainer.appendChild(nextButton);

// Create interactive controls
const controlsContainer = document.createElement('div');
controlsContainer.style.cssText = `
    display: none; /* Hide the controls completely */
`;
document.body.appendChild(controlsContainer);

// Add click handlers
prevButton.addEventListener('click', previousSlide);
nextButton.addEventListener('click', nextSlide);

// Slides content
const slides = [
    {
        title: "",
        color: 0x2196F3,
        hasVideo: true,
        videoPath: "src/vid/s1.mp4"
    },
    {
        color: 0x4CAF50,
        hasVideo: true,
        videoPath: "src/vid/s2.mp4"
    },
    {
        color: 0x4CAF50,
        hasVideo: true,
        videoPath: "src/vid/s3.mp4"
    },
    {
        color: 0x4CAF50,
        hasVideo: true,
        videoPath: "src/vid/s4.mp4"
    },
];

let currentSlide = 0;
let slideMesh;
let titleMesh;
let contentMesh;
let font;
let isRotating = false;
let skillHighlighted = false;
let textAnimated = false;
let projectsShown = false;

// Add mouse tracking for slide orientation
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
const rotationSpeed = 0.05;
const maxRotation = 0.1; // Maximum rotation in radians

// Track mouse position
document.addEventListener('mousemove', (event) => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Calculate target rotation based on mouse position
    targetRotationY = mouseX * maxRotation;
    targetRotationX = mouseY * maxRotation;
});

// Load font first
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(loadedFont) {
    font = loadedFont;
    createSlide(); // Create initial slide after font is loaded
});

// Add lighting for better visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create slide plane
function createSlide() {
    if (!font) return; // Don't create slide if font isn't loaded yet

    // Remove existing meshes
    if (slideMesh) scene.remove(slideMesh);
    if (titleMesh) scene.remove(titleMesh);
    if (contentMesh) scene.remove(contentMesh);
    if (window.imageMesh) scene.remove(window.imageMesh);
    if (window.videoMesh) scene.remove(window.videoMesh);
    if (window.videoElement && window.videoElement.parentNode) {
        window.videoElement.pause();
        window.videoElement.remove();
    }

    // Create a single slide with all elements as children
    const slideGroup = new THREE.Group();
    scene.add(slideGroup);
    slideMesh = slideGroup; // Store reference to the group

    // Check if this is a video slide
    const isVideoSlide = slides[currentSlide].hasVideo && slides[currentSlide].videoPath;
    
    // Add video if this slide has one - do this first and early
    if (isVideoSlide) {
        // Create video element
        const video = document.createElement('video');
        video.src = slides[currentSlide].videoPath;
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.muted = false;
        video.playsInline = true;
        video.style.display = 'none';
        document.body.appendChild(video);
        
        // Store reference for cleanup
        window.videoElement = video;
        
        // Create video texture
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        
        // Create a custom shader material for better video rendering
        const videoMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tVideo: { value: videoTexture },
                contrast: { value: 1.2 },  // Slightly increased contrast
                brightness: { value: 0.1 }, // Slightly increased brightness
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tVideo;
                uniform float contrast;
                uniform float brightness;
                varying vec2 vUv;
                
                void main() {
                    vec4 color = texture2D(tVideo, vUv);
                    
                    // Apply brightness adjustment
                    color.rgb += brightness;
                    
                    // Apply contrast adjustment
                    color.rgb = (color.rgb - 0.5) * contrast + 0.5;
                    
                    gl_FragColor = color;
                }
            `,
            depthTest: true,
            depthWrite: true
        });
        
        // Create mesh with custom shader material
        const videoGeometry = new THREE.PlaneGeometry(8, 4.5);
        const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
        videoMesh.position.set(0, 0, 0.1);
        slideGroup.add(videoMesh);
        
        // Store reference
        window.videoMesh = videoMesh;
        
        // Start video after a short delay to ensure it's loaded
        setTimeout(() => {
            video.play().catch(error => {
                console.error('Video play error:', error);
                // Add play button if autoplay fails
                addPlayButton(slideGroup, video);
            });
        }, 100);
    } 
    // If not a video slide, add the standard background and other elements
    else {
        // Create slide background
        const geometry = new THREE.PlaneGeometry(8, 4.5);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x111111,
            side: THREE.DoubleSide,
            transparent: true,
        });
        const backgroundMesh = new THREE.Mesh(geometry, material);
        slideGroup.add(backgroundMesh);
        
        // Add image if this slide has one
        if (slides[currentSlide].hasImage && slides[currentSlide].imagePath) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(slides[currentSlide].imagePath, (texture) => {
                // Calculate aspect ratio to maintain image proportions
                const imageAspect = texture.image.width / texture.image.height;
                
                let imageWidth, imageHeight;
                
                if (slides[currentSlide].fullScreenImage) {
                    // Make the image cover the entire slide
                    imageWidth = 8; // Match the slide width
                    imageHeight = 4.5; // Match the slide height
                } else {
                    // Use the standard sizing for other slides
                    imageWidth = 4; // Base width
                    imageHeight = imageWidth / imageAspect;
                }
                
                const imageGeometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
                const imageMaterial = new THREE.MeshBasicMaterial({ 
                    map: texture,
                    side: THREE.DoubleSide
                });
                const imageMesh = new THREE.Mesh(imageGeometry, imageMaterial);
                
                // Position the image
                if (slides[currentSlide].fullScreenImage) {
                    imageMesh.position.set(0, 0, 0.1);
                } else {
                    imageMesh.position.set(0, 1, 0.1);
                }
                
                slideGroup.add(imageMesh);
                window.imageMesh = imageMesh;
            }, undefined, (error) => {
                console.error("Error loading image:", error);
                // Fallback to canvas if image loading fails
            });
        }
    }

    // Always add a colored border to the slide
    const borderGeometry = new THREE.PlaneGeometry(8.2, 4.7);
    const borderMaterial = new THREE.MeshBasicMaterial({ 
        color: slides[currentSlide].color,
        side: THREE.DoubleSide,
        transparent: true,
    });
    const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
    borderMesh.position.z = -0.05;
    slideGroup.add(borderMesh);

    // Always add title if it exists
    if (slides[currentSlide].title) {
        const titleGeometry = new TextGeometry(slides[currentSlide].title, {
            font: font,
            size: 0.5,
            height: 0.1
        });
        const titleMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            emissive: 0x333333,
            shininess: 100
        });
        titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
        titleGeometry.computeBoundingBox();
        const titleWidth = titleGeometry.boundingBox.max.x - titleGeometry.boundingBox.min.x;
        titleMesh.position.set(-titleWidth/2, 1.5, 0.1);
        slideGroup.add(titleMesh);
    }

    // Always add content if it exists
    if (slides[currentSlide].content) {
        const contentGeometry = new TextGeometry(slides[currentSlide].content, {
            font: font,
            size: 0.3,
            height: 0.1
        });
        const contentMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            emissive: 0x333333,
            shininess: 100
        });
        contentMesh = new THREE.Mesh(contentGeometry, contentMaterial);
        contentGeometry.computeBoundingBox();
        const contentWidth = contentGeometry.boundingBox.max.x - contentGeometry.boundingBox.min.x;
        contentMesh.position.set(-contentWidth/2, -0.5, 0.1);
        slideGroup.add(contentMesh);
    }

    // Update button states
    prevButton.style.opacity = currentSlide === 0 ? '0.5' : '1';
    nextButton.style.opacity = currentSlide === slides.length - 1 ? '0.5' : '1';
    
    // Update slide indicator
    slideIndicator.textContent = `${currentSlide + 1} / ${slides.length}`;
    
    // Update interactive elements
    updateInteractiveElements();
}

// Function to create a fallback image if loading fails
function createFallbackImage(slideGroup) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw a simple avatar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(256, 200, 100, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw body
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(256, 400, 150, 0, Math.PI * 2);
    ctx.fill();
    
    // Add text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Adriel', 256, 500);
    
    // Convert canvas to texture
    const texture = new THREE.CanvasTexture(canvas);
    const imageGeometry = new THREE.PlaneGeometry(3, 3);
    const imageMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        side: THREE.DoubleSide
    });
    const imageMesh = new THREE.Mesh(imageGeometry, imageMaterial);
    imageMesh.position.set(0, 1, 0.1);
    slideGroup.add(imageMesh);
    window.imageMesh = imageMesh;
}

// Update interactive elements for current slide
function updateInteractiveElements() {
    // Function emptied to remove all controls
}

// Interactive functions
function toggleRotation() {
    isRotating = !isRotating;
    if (isRotating) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;
    } else {
        controls.autoRotate = false;
    }
}

function zoomIn() {
    camera.position.z = Math.max(camera.position.z - 1, controls.minDistance);
}

function zoomOut() {
    camera.position.z = Math.min(camera.position.z + 1, controls.maxDistance);
}

function changeNebulaColors() {
    const colors = [
        [0x0040ff, 0xff0040], // Blue to Red
        [0x4CAF50, 0xFF9800], // Green to Orange
        [0xF44336, 0xFFEB3B], // Red to Yellow
        [0x00BCD4, 0xE91E63]  // Cyan to Pink
    ];
    const randomColors = colors[Math.floor(Math.random() * colors.length)];
    nebulaMaterial.uniforms.color1.value = new THREE.Color(randomColors[0]);
    nebulaMaterial.uniforms.color2.value = new THREE.Color(randomColors[1]);
}

function addMoreStars() {
    const newStarGeometry = new THREE.BufferGeometry();
    const newStarMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
    });
    
    const newStarVertices = [];
    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        newStarVertices.push(x, y, z);
    }
    
    newStarGeometry.setAttribute('position', new THREE.Float32BufferAttribute(newStarVertices, 3));
    const newStars = new THREE.Points(newStarGeometry, newStarMaterial);
    scene.add(newStars);
    
    // Remove after 5 seconds
    setTimeout(() => {
        scene.remove(newStars);
    }, 5000);
}

function highlightSkills() {
    if (skillHighlighted) return;
    
    // Create glowing effect for skills text
    const glowGeometry = new THREE.PlaneGeometry(8.5, 5);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF9800,
        transparent: true,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.position.z = -0.1;
    scene.add(glowMesh);
    
    // Animate the glow
    const animateGlow = () => {
        glowMaterial.opacity = 0.3 + Math.sin(Date.now() * 0.005) * 0.2;
        if (skillHighlighted) {
            requestAnimationFrame(animateGlow);
        } else {
            scene.remove(glowMesh);
        }
    };
    
    skillHighlighted = true;
    animateGlow();
    
    // Reset after 5 seconds
    setTimeout(() => {
        skillHighlighted = false;
    }, 5000);
}

function animateText() {
    if (textAnimated) return;
    
    // Store original positions
    const originalTitlePos = titleMesh.position.clone();
    const originalContentPos = contentMesh.position.clone();
    
    // Animate text
    const startTime = Date.now();
    const duration = 2000; // 2 seconds
    
    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Bounce effect
        titleMesh.position.y = originalTitlePos.y + Math.sin(progress * Math.PI * 4) * 0.5;
        contentMesh.position.y = originalContentPos.y + Math.sin(progress * Math.PI * 4) * 0.3;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Reset positions
            titleMesh.position.copy(originalTitlePos);
            contentMesh.position.copy(originalContentPos);
        }
    };
    
    textAnimated = true;
    animate();
    
    // Reset flag after animation
    setTimeout(() => {
        textAnimated = false;
    }, duration);
}

function showProjects() {
    if (projectsShown) return;
    
    // Create project cards
    const projectCards = [];
    const projectData = [
        { title: "Web App", color: 0x2196F3 },
        { title: "3D Viz", color: 0x4CAF50 },
        { title: "Interactive", color: 0xFF9800 }
    ];
    
    projectData.forEach((project, index) => {
        const cardGeometry = new THREE.PlaneGeometry(2, 1.5);
        const cardMaterial = new THREE.MeshPhongMaterial({
            color: project.color,
            side: THREE.DoubleSide,
            transparent: true,
        });
        const card = new THREE.Mesh(cardGeometry, cardMaterial);
        
        // Position cards in a row
        card.position.set(-3 + index * 3, -2, 0.2);
        scene.add(card);
        projectCards.push(card);
        
        // Add project title
        const titleGeometry = new TextGeometry(project.title, {
            font: font,
            size: 0.2,
            height: 0.05
        });
        const titleMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const title = new THREE.Mesh(titleGeometry, titleMaterial);
        titleGeometry.computeBoundingBox();
        const titleWidth = titleGeometry.boundingBox.max.x - titleGeometry.boundingBox.min.x;
        title.position.set(-titleWidth/2, 0, 0.1);
        title.position.x += card.position.x;
        scene.add(title);
    });
    
    projectsShown = true;
    
    // Remove after 5 seconds
    setTimeout(() => {
        projectCards.forEach(card => scene.remove(card));
        projectsShown = false;
    }, 5000);
}

function resetView() {
    // Reset camera position
    camera.position.set(0, 0, 8);
    controls.reset();
    
    // Reset nebula colors
    gradientBackground.material.map = createGradientTexture();
    gradientBackground.material.needsUpdate = true;
    
    // Stop rotation
    controls.autoRotate = false;
    isRotating = false;
}

// Position camera
camera.position.z = 8;

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Handle keyboard navigation
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextSlide();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        previousSlide();
    }
});

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        createSlide();
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        createSlide();
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Very slow star rotation - different speeds for each layer
    stars.rotation.y += 0.0001;
    stars.rotation.x += 0.00005;
    
    stars2.rotation.y += 0.00015;
    stars2.rotation.x += 0.00003;
    
    stars3.rotation.y += 0.00005;
    stars3.rotation.x += 0.00002;
    
    // Rotate Earth
    if (window.earth) {
        window.earth.rotation.y += 0.0005;
    }
    
    // Animate nebula
    nebulaMaterial.uniforms.time.value += 0.001;
    
    // Smoothly rotate slide to face cursor
    if (slideMesh) {
        // Smoothly interpolate current rotation to target rotation
        slideMesh.rotation.y += (targetRotationY - slideMesh.rotation.y) * rotationSpeed;
        slideMesh.rotation.x += (targetRotationX - slideMesh.rotation.x) * rotationSpeed;
    }
    
    renderer.render(scene, camera);
}

// Initialize loading
function init() {
    // Hide loading screen
    const loadingScreen = document.querySelector('.loading');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    
    // Start animation
    animate();
}

// Start initialization
init();

// Add new interactive functions
function pulseEffect() {
    const originalScale = slideMesh.scale.clone();
    const pulseAnimation = () => {
        const time = Date.now() * 0.001;
        const scale = 1 + Math.sin(time * 5) * 0.1;
        slideMesh.scale.set(scale, scale, scale);
    };
    
    const interval = setInterval(pulseAnimation, 16);
    setTimeout(() => {
        clearInterval(interval);
        slideMesh.scale.copy(originalScale);
    }, 30000); // 30 seconds
}

function shakeText() {
    const originalPosition = contentMesh.position.clone();
    const shakeAnimation = () => {
        const offsetX = (Math.random() - 0.5) * 0.1;
        const offsetY = (Math.random() - 0.5) * 0.1;
        contentMesh.position.set(
            originalPosition.x + offsetX,
            originalPosition.y + offsetY,
            originalPosition.z
        );
    };
    
    const interval = setInterval(shakeAnimation, 50);
    setTimeout(() => {
        clearInterval(interval);
        contentMesh.position.copy(originalPosition);
    }, 30000); // 30 seconds
}

function glowBorder() {
    const originalColor = borderMesh.material.color.getHex();
    const glowAnimation = () => {
        const time = Date.now() * 0.001;
        const hue = (time * 0.1) % 1;
        borderMesh.material.color.setHSL(hue, 1, 0.5);
    };
    
    const interval = setInterval(glowAnimation, 16);
    setTimeout(() => {
        clearInterval(interval);
        borderMesh.material.color.setHex(originalColor);
    }, 30000); // 30 seconds
}

function rainbowText() {
    const originalColor = contentMesh.material.color.getHex();
    const rainbowAnimation = () => {
        const time = Date.now() * 0.001;
        const hue = (time * 0.2) % 1;
        contentMesh.material.color.setHSL(hue, 1, 0.5);
    };
    
    const interval = setInterval(rainbowAnimation, 16);
    setTimeout(() => {
        clearInterval(interval);
        contentMesh.material.color.setHex(originalColor);
    }, 30000); // 30 seconds
}

function rotate3D() {
    const originalRotation = slideMesh.rotation.clone();
    const rotateAnimation = () => {
        const time = Date.now() * 0.001;
        slideMesh.rotation.x = Math.sin(time) * 0.5;
        slideMesh.rotation.y = Math.cos(time) * 0.5;
    };
    
    const interval = setInterval(rotateAnimation, 16);
    setTimeout(() => {
        clearInterval(interval);
        slideMesh.rotation.copy(originalRotation);
    }, 30000); // 30 seconds
}

function particleBurst() {
    const particleCount = 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const particle = new THREE.Mesh(geometry, material);
        
        particle.position.copy(contentMesh.position);
        particle.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
        );
        
        scene.add(particle);
        particles.push(particle);
    }
    
    const burstAnimation = () => {
        particles.forEach(particle => {
            particle.position.add(particle.velocity);
            particle.velocity.y -= 0.01; // gravity
        });
    };
    
    const interval = setInterval(burstAnimation, 16);
    setTimeout(() => {
        clearInterval(interval);
        particles.forEach(particle => scene.remove(particle));
    }, 30000); // 30 seconds
}

function zoomEffect() {
    const originalScale = slideMesh.scale.clone();
    const zoomAnimation = () => {
        const time = Date.now() * 0.001;
        const scale = 1 + Math.sin(time * 2) * 0.3;
        slideMesh.scale.set(scale, scale, scale);
    };
    
    const interval = setInterval(zoomAnimation, 16);
    setTimeout(() => {
        clearInterval(interval);
        slideMesh.scale.copy(originalScale);
    }, 30000); // 30 seconds
}

function colorCycle() {
    const originalColor = slideMesh.material.color.getHex();
    const cycleAnimation = () => {
        const time = Date.now() * 0.001;
        const hue = (time * 0.1) % 1;
        slideMesh.material.color.setHSL(hue, 1, 0.5);
    };
    
    const interval = setInterval(cycleAnimation, 16);
    setTimeout(() => {
        clearInterval(interval);
        slideMesh.material.color.setHex(originalColor);
    }, 30000); // 30 seconds
}

function waveAnimation() {
    const originalPosition = contentMesh.position.clone();
    const waveAnimation = () => {
        const time = Date.now() * 0.001;
        contentMesh.position.y = originalPosition.y + Math.sin(time * 3) * 0.2;
    };
    
    const interval = setInterval(waveAnimation, 16);
    setTimeout(() => {
        clearInterval(interval);
        contentMesh.position.copy(originalPosition);
    }, 30000); // 30 seconds
}

// Add Earth in background
function createEarth() {
    // Load Earth textures
    const textureLoader = new THREE.TextureLoader();
    
    // Create Earth sphere
    const earthGeometry = new THREE.SphereGeometry(15, 64, 64);
    
    // Load Earth textures in parallel
    Promise.all([
        new Promise(resolve => textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg', resolve)),
        new Promise(resolve => textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg', resolve)),
        new Promise(resolve => textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg', resolve)),
    ]).then(([earthMap, earthSpecular, earthNormal]) => {
        // Create Earth material with textures - increased emissive and shininess for brightness
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: earthMap,
            specularMap: earthSpecular,
            normalMap: earthNormal,
            shininess: 25,          // Increased from 5 to 25
            emissive: 0x112244,     // Added subtle blue emissive glow
            emissiveIntensity: 0.2  // Subtle emissive effect
        });
        
        // Create Earth mesh
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        
        // Position Earth in the background
        earth.position.set(30, 0, -60);
        
        // Add to scene
        scene.add(earth);
        
        // Store reference
        window.earth = earth;
    });
    
    // Add stronger lights to illuminate the Earth
    const earthLight = new THREE.DirectionalLight(0xffffff, 2.5);  // Increased from 1.5 to 2.5
    earthLight.position.set(5, 3, 5);
    scene.add(earthLight);
    
    // Add a second light from another angle
    const earthLight2 = new THREE.DirectionalLight(0xccddff, 1.0);  // Blueish tint
    earthLight2.position.set(-5, -2, 3);
    scene.add(earthLight2);
}

// Create Earth
createEarth(); 