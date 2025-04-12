import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

// Scene setup with improved fog for depth perception
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000022); // Very dark blue background
scene.fog = new THREE.FogExp2(0x000033, 0.001); // Add subtle fog for depth

// Create starfield background
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];

// Generate a lot more stars for better visibility
for (let i = 0; i < 40000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

// Create simple but effective star material
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.3,    // Larger size for better visibility
    transparent: true,
    opacity: 0.8
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Add second layer of brighter blue-tinted stars
const starGeometry2 = new THREE.BufferGeometry();
const starVertices2 = [];

for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 1800;
    const y = (Math.random() - 0.5) * 1800;
    const z = (Math.random() - 0.5) * 1800;
    starVertices2.push(x, y, z);
}

starGeometry2.setAttribute('position', new THREE.Float32BufferAttribute(starVertices2, 3));

const starMaterial2 = new THREE.PointsMaterial({
    color: 0xaaccff, // Slightly blue tint
    size: 0.4,      // Larger size
    transparent: true,
    opacity: 0.9
});

const stars2 = new THREE.Points(starGeometry2, starMaterial2);
scene.add(stars2);

// Add third layer with larger prominent stars
const starGeometry3 = new THREE.BufferGeometry();
const starVertices3 = [];

for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 1500;
    const y = (Math.random() - 0.5) * 1500;
    const z = (Math.random() - 0.5) * 1500;
    starVertices3.push(x, y, z);
}

starGeometry3.setAttribute('position', new THREE.Float32BufferAttribute(starVertices3, 3));

const starMaterial3 = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.8,      // Much larger for visibility
    transparent: true,
    opacity: 1.0
});

const stars3 = new THREE.Points(starGeometry3, starMaterial3);
scene.add(stars3);

// Add nebula effect with improved shader
const nebulaGeometry = new THREE.SphereGeometry(500, 32, 32);
const nebulaMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x0040ff) }, // Bright blue
        color2: { value: new THREE.Color(0xff0040) }  // Bright red
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Improved noise function with better performance
        float hash(float n) {
            return fract(sin(n) * 43758.5453);
        }
        
        float noise(vec3 x) {
            vec3 p = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            
            float n = p.x + p.y * 57.0 + p.z * 113.0;
            return mix(
                mix(
                    mix(hash(n + 0.0), hash(n + 1.0), f.x),
                    mix(hash(n + 57.0), hash(n + 58.0), f.x),
                    f.y),
                mix(
                    mix(hash(n + 113.0), hash(n + 114.0), f.x),
                    mix(hash(n + 170.0), hash(n + 171.0), f.x),
                    f.y),
                f.z);
        }
        
        void main() {
            // Create more dynamic, flowing nebula
            vec3 pos = normalize(vPosition);
            float noiseScale = 1.5; // Larger scale patterns
            
            float noiseVal = 
                noise(pos * 8.0 * noiseScale + time * 0.1) * 0.5 +
                noise(pos * 16.0 * noiseScale - time * 0.05) * 0.25 +
                noise(pos * 32.0 * noiseScale + time * 0.2) * 0.125;
            
            float pattern = 0.5 + 0.5 * sin(noiseVal * 6.28 + time * 0.5);
            
            // Improved color blending with more contrast
            vec3 color = mix(color1, color2, smoothstep(0.2, 0.8, pattern));
            
            // Add depth and glow
            float glow = pow(noiseVal, 2.0) * 0.5 + 0.2;
            float alpha = glow * 0.35; // Slightly more transparent for performance
            
            gl_FragColor = vec4(color, alpha);
        }
    `,
    transparent: true,
    side: THREE.BackSide
});
const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
scene.add(nebula);

// Improved camera settings
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;

// Renderer with post-processing
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
document.body.appendChild(renderer.domElement);

// Add orbit controls with improved settings
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.minDistance = 1;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI / 2;
controls.autoRotateSpeed = 0.5;

// Improved lighting
const ambientLight = new THREE.AmbientLight(0x333366, 0.7); // Increased ambient light
scene.add(ambientLight);

// Replace single directional light with multiple softer lights
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight1.position.set(5, 3, 5);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-5, 3, 5);
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight3.position.set(0, -3, 5);
scene.add(directionalLight3);

// Modify moving light to be softer
const movingLight = new THREE.PointLight(0x0066ff, 0.7, 50);
movingLight.position.set(0, 0, 15);
scene.add(movingLight);

// Add subtle rim light
const rimLight = new THREE.DirectionalLight(0x0044ff, 0.3);
rimLight.position.set(0, 0, -5);
scene.add(rimLight);

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
prevButton.innerHTML = '← Nakaraan';
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
nextButton.innerHTML = 'Susunod →';
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
    { // Pangalan
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/1Pangalan.mp4"
    },

    { // Saan nagmula ang aking pangalan
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/2BakitPangalan.mp4"
    },

    { // anong nickname ang ugsto itawag sakin
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/3Palayaw.mp4"
    },
    { //Kaarawan
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/4Kaarawan.mp4"
    },
    { // Edad
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/5Edad.mp4"
    },

    { // Address
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/6Address.mp4"
    },

    { // Address
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/7Komyut.mp4"
    },

    // saakin at sa pamilya

    { // me
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/me.mp4"
    },
    { // sport
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/sports.mp4"
    },

        { // intro
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/intro.mp4"
        },
        

        { // intro
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/lungs.mp4"
        },

        { // intro
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/turo.mp4"
        },

        { // intro
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/transition.mp4"
        },

        { // guitar talent
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/talent.mp4"
        },

        { // intro
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/yt.mp4"
        },


    { // family
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/family.mp4"
    },

    { // internet
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/8Connection.mp4"
    },

    { // Liblib
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/9Liblib.mp4"
    },

    { // device
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/device.mp4"
    },

    

    { // kasalukuyan
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/kasalukuyang.mp4"
    },



        // Paaralan
        { // Paaralan
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/paaralan.mp4"
        },
        { // Edad
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/p1.mp4"
        },
        { // Edad
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/p2.mp4"
        },
        { // Edad
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/p3.mp4"
        },
        { // Edad
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/p4.mp4"
        },
        { // Edad
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/p5.mp4"
        },

        { // no money
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/no money.mp4"
        },


                //scholarship
                { // no money
                    color: 0x050629,
                    hasVideo: true,
                    videoPath: "src/vid/isko1.mp4"
                },
                { // no money
                    color: 0x050629,
                    hasVideo: true,
                    videoPath: "src/vid/isko2.mp4"
                },

                { // no money
                    color: 0x050629,
                    hasVideo: true,
                    videoPath: "src/vid/isko3.mp4"
                },
        
        
        //Why CS
        { // Edad
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/whycs1.mp4"
        },
        { // Edad
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/whycs2.mp4"
        },
        { // Edad
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/whycs3.mp4"
        },
        { // Edad
            color: 0x050629,
            hasVideo: true,
            videoPath: "src/vid/whycs4.mp4"
        },

    { // Motto
        color: 0x050629,
        hasVideo: true,
        videoPath: "src/vid/motto.mp4"
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

// Add video preloading system
const videoCache = new Map(); // Cache for preloaded videos
const preloadRange = 3; // How many videos to preload ahead

// Function to preload videos
function preloadVideos(startIndex) {
    // Clear old preloaded videos that are no longer needed
    videoCache.forEach((videoElement, index) => {
        if (index < startIndex - 1 || index > startIndex + preloadRange) {
            if (videoElement && videoElement !== window.videoElement) {
                videoElement.pause();
                videoElement.src = '';
                videoElement.load();
            }
            videoCache.delete(index);
        }
    });
    
    // Preload upcoming videos
    for (let i = startIndex; i < Math.min(startIndex + preloadRange, slides.length); i++) {
        if (!videoCache.has(i) && slides[i].hasVideo && slides[i].videoPath) {
            const video = document.createElement('video');
            video.src = slides[i].videoPath;
            video.crossOrigin = 'anonymous';
            video.playsInline = true;
            video.muted = true; // Keep muted until played
            video.style.display = 'none';
            video.load(); // Start loading the video
            document.body.appendChild(video);
            videoCache.set(i, video);
            
            // Force preloading by starting and immediately pausing
            video.play().then(() => {
                video.pause();
                video.currentTime = 0;
            }).catch(e => console.log('Preload play error (ignorable):', e));
        }
    }
}

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

// Font loader with enhanced 3D text creation
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function(loadedFont) {
    font = loadedFont;
    createSlide(); // Create initial slide after font is loaded
    
    // Create 3D text for "PAGTATAYA BILANG 1" with enhanced materials
    const titleGeometry = new TextGeometry('PAGTATAYA BILANG 1', {
        font: loadedFont,
        size: 2.2,
        height: 0.5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.05,
        bevelSegments: 5
    });
    
    titleGeometry.computeBoundingBox();
    const titleWidth = titleGeometry.boundingBox.max.x - titleGeometry.boundingBox.min.x;
    
    // Create dynamic glowing material for title
    const titleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x0055ff,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
        reflectivity: 0.9,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
    });
    
    const titleText = new THREE.Mesh(titleGeometry, titleMaterial);
    titleText.position.set(-titleWidth/2, 10, -30);
    scene.add(titleText);
    
    // Save original position for animation
    titleText.userData.originalY = titleText.position.y;
    titleText.userData.originalX = titleText.position.x;
    
    // Create 3D text for name "Adriel Magalona" with enhanced materials
    const nameGeometry = new TextGeometry('Adriel Magalona', {
        font: loadedFont,
        size: 1.4,
        height: 0.4,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: 0.08,
        bevelSize: 0.04,
        bevelSegments: 3
    });
    
    nameGeometry.computeBoundingBox();
    const nameWidth = nameGeometry.boundingBox.max.x - nameGeometry.boundingBox.min.x;
    
    // Create metallic gold material for name
    const nameMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFF4500, // Changed to orange-red
        emissive: 0xFF4500, // Changed to orange-red
        emissiveIntensity: 0.3,
        metalness: 0.9,
        roughness: 0.1,
        reflectivity: 1.0,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1
    });
    
    const nameText = new THREE.Mesh(nameGeometry, nameMaterial);
    nameText.position.set(-nameWidth/2, 7, -30); // Position below title
    scene.add(nameText);
    
    // Save original position for animation
    nameText.userData.originalY = nameText.position.y;
    nameText.userData.originalX = nameText.position.x;
    
    // Store references for animation
    window.titleText3D = titleText;
    window.nameText3D = nameText;
    
    // Add sparkle particles around the text
    createSparkles(titleText.position.clone(), 100);
    createSparkles(nameText.position.clone(), 60);
}, undefined, function(error) {
    console.error('Error loading font:', error);
    
    // Still init even if font fails to load
    font = null;
    createSlide(); // Try to create slide anyway
});

// Create sparkle particles function
function createSparkles(centerPosition, count) {
    const sparkleGeometry = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(count * 3);
    const sparkleSizes = new Float32Array(count);
    
    // Position particles in a cloud around the center
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Create a cloud around the text
        const radius = 3 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        sparklePositions[i3] = centerPosition.x + radius * Math.sin(phi) * Math.cos(theta);
        sparklePositions[i3 + 1] = centerPosition.y + radius * Math.sin(phi) * Math.sin(theta);
        sparklePositions[i3 + 2] = centerPosition.z + radius * Math.cos(phi);
        
        // Random sizes for sparkles
        sparkleSizes[i] = Math.random() * 0.2 + 0.05;
    }
    
    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    sparkleGeometry.setAttribute('size', new THREE.BufferAttribute(sparkleSizes, 1));
    
    // Sparkle shader material
    const sparkleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pointTexture: { value: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png') }
        },
        vertexShader: `
            attribute float size;
            uniform float time;
            void main() {
                // Animate position slightly
                vec3 pos = position;
                pos.x += sin(time + position.z * 10.0) * 0.1;
                pos.y += cos(time + position.x * 10.0) * 0.1;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z) * (0.7 + 0.3 * sin(time * 3.0 + gl_VertexID));
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            uniform float time;
            void main() {
                // Pulsating opacity
                float opacity = 0.5 + 0.5 * sin(time * 2.0 + gl_FragCoord.x + gl_FragCoord.y);
                vec4 texColor = texture2D(pointTexture, gl_PointCoord);
                
                // White with a hint of blue or gold
                float blueGoldMix = sin(time * 0.5 + gl_FragCoord.x * 0.01) * 0.5 + 0.5;
                vec3 color = mix(
                    vec3(0.8, 0.9, 1.0), // Light blue
                    vec3(1.0, 0.9, 0.6), // Light gold
                    blueGoldMix
                );
                
                gl_FragColor = vec4(color, texColor.a * opacity);
                if (gl_FragColor.a < 0.1) discard;
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });
    
    const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
    sparkles.userData.centerPosition = centerPosition.clone();
    scene.add(sparkles);
    
    // Store reference for animation
    if (!window.sparkleEffects) window.sparkleEffects = [];
    window.sparkleEffects.push(sparkles);
}

// Create slide plane
function createSlide() {
    if (!font) {
        console.warn('Font not loaded, attempting to create slide without text');
        // Continue with slide creation anyway, just won't have text
    }

    // Store the previous slide mesh before removing it
    const oldSlideMesh = slideMesh;
    let oldVideoElement = window.videoElement;
    
    // Create a single slide with all elements as children
    const slideGroup = new THREE.Group();
    scene.add(slideGroup);
    
    // Initially set the new slide to be transparent
    slideGroup.traverse(child => {
        if (child.material) {
            if (!child.material.originalOpacity) {
                child.material.originalOpacity = child.material.opacity || 1.0;
            }
            child.material.transparent = true;
            child.material.opacity = 0;
        }
    });
    
    // Set the new slideMesh reference
    slideMesh = slideGroup;

    // Check if this is a video slide
    const isVideoSlide = slides[currentSlide].hasVideo && slides[currentSlide].videoPath;
    
    // Add video if this slide has one - do this first and early
    if (isVideoSlide) {
        // Use cached video if available, otherwise create a new one
        let video;
        if (videoCache.has(currentSlide)) {
            video = videoCache.get(currentSlide);
            console.log('Using preloaded video for slide', currentSlide);
        } else {
            // Fallback to creating a new video if not preloaded
            video = document.createElement('video');
            video.src = slides[currentSlide].videoPath;
            video.crossOrigin = 'anonymous';
            video.playsInline = true;
            video.style.display = 'none';
            document.body.appendChild(video);
            console.log('Creating new video for slide', currentSlide);
        }
        
        // Update cache with current video
        videoCache.set(currentSlide, video);
        
        // Common video settings
        video.loop = true;
        video.muted = false; // Unmute when actually playing
        
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
            depthWrite: true,
            transparent: true,
            opacity: 0
        });
        
        // Create mesh with custom shader material
        const videoGeometry = new THREE.PlaneGeometry(8, 4.5);
        const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
        videoMesh.position.set(0, 0, 0.1);
        slideGroup.add(videoMesh);
        
        // Store reference
        window.videoMesh = videoMesh;
        
        // Play video immediately rather than with a timeout
        video.play().catch(error => {
            console.error('Video play error:', error);
            // Add play button if autoplay fails
            addPlayButton(slideGroup, video);
        });
    } 
    // If not a video slide, add the standard background and other elements
    else {
        // Create slide background
        const geometry = new THREE.PlaneGeometry(8, 4.5);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x111111,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0
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
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0
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
        opacity: 0
    });
    const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
    borderMesh.position.z = -0.05;
    slideGroup.add(borderMesh);

    // Always add title if it exists
    if (slides[currentSlide].title && font) {
        const titleGeometry = new TextGeometry(slides[currentSlide].title, {
            font: font,
            size: 0.5,
            height: 0.1
        });
        const titleMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            emissive: 0x333333,
            shininess: 100,
            transparent: true,
            opacity: 0
        });
        titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
        titleGeometry.computeBoundingBox();
        const titleWidth = titleGeometry.boundingBox.max.x - titleGeometry.boundingBox.min.x;
        titleMesh.position.set(-titleWidth/2, 1.5, 0.1);
        slideGroup.add(titleMesh);
    }

    // Always add content if it exists
    if (slides[currentSlide].content && font) {
        const contentGeometry = new TextGeometry(slides[currentSlide].content, {
            font: font,
            size: 0.3,
            height: 0.1
        });
        const contentMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            emissive: 0x333333,
            shininess: 100,
            transparent: true,
            opacity: 0
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
    
    // Now perform the fade transition using GSAP
    if (oldSlideMesh) {
        // First hide the old slide
        gsap.to(oldSlideMesh.position, {
            duration: 0.4,
            z: -1,
            ease: "power2.in"
        });
        
        // Hide the old slide materials quickly
        oldSlideMesh.traverse(child => {
            if (child.material && typeof child.material.opacity !== 'undefined') {
                gsap.to(child.material, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: function() {
                        if (child === oldSlideMesh.children[oldSlideMesh.children.length - 1]) {
                            // Clean up old slide and video when fade out completes
                            scene.remove(oldSlideMesh);
                            if (oldVideoElement && oldVideoElement !== window.videoElement && oldVideoElement.parentNode) {
                                oldVideoElement.pause();
                                oldVideoElement.remove();
                            }
                        }
                    }
                });
            }
        });
        
        // Simply fade in the new slide
        gsap.fromTo(slideGroup.position, 
            { z: 0.5 },
            { z: 0, duration: 0.4, ease: "power2.out", delay: 0.2 }
        );
        
        // Fade in all materials of the new slide
        slideGroup.traverse(child => {
            if (child.material && typeof child.material.opacity !== 'undefined') {
                const targetOpacity = child.material.originalOpacity || 1.0;
                gsap.to(child.material, {
                    opacity: targetOpacity,
                    duration: 0.5,
                    ease: "power2.out",
                    delay: 0.2
                });
            }
        });
    } else {
        // For the first slide, just make it visible without animation
        slideGroup.traverse(child => {
            if (child.material && typeof child.material.opacity !== 'undefined') {
                const targetOpacity = child.material.originalOpacity || 1.0;
                gsap.to(child.material, {
                    opacity: targetOpacity,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });
    }

    // Preload videos for upcoming slides
    preloadVideos(currentSlide + 1);
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
    camera.position.z = Math.max(camera.position.z - 2, controls.minDistance);
}

function zoomOut() {
    camera.position.z = Math.min(camera.position.z + 2, controls.maxDistance);
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

// Improved animation loop with optimized performance
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001; // Current time for animations
    
    // Update controls
    controls.update();
    
    // Optimized star animation (slower rotation to reduce GPU load)
    stars.rotation.y += 0.00008;
    stars.rotation.x += 0.00003;
    
    // Animate the moving light in a circular pattern
    movingLight.position.x = Math.sin(time * 0.2) * 15;
    movingLight.position.y = Math.cos(time * 0.2) * 15;
    movingLight.intensity = 1 + Math.sin(time) * 0.3;
    
    // Update lightning effect
    if (window.lightning) {
        window.lightning.update();
    }
    
    // Animate 3D texts with improved fluid motion
    if (window.titleText3D) {
        window.titleText3D.position.y = window.titleText3D.userData.originalY + Math.sin(time * 0.6) * 0.4;
        window.titleText3D.position.x = window.titleText3D.userData.originalX + Math.cos(time * 0.4) * 0.3;
        window.titleText3D.rotation.y = Math.sin(time * 0.2) * 0.1;
        window.titleText3D.lookAt(camera.position);
    }
    
    if (window.nameText3D) {
        window.nameText3D.position.y = window.nameText3D.userData.originalY + Math.sin(time * 0.6 + 0.5) * 0.4;
        window.nameText3D.position.x = window.nameText3D.userData.originalX + Math.cos(time * 0.4 + 0.3) * 0.3;
        window.nameText3D.rotation.y = Math.sin(time * 0.2 + 0.5) * 0.1;
        window.nameText3D.lookAt(camera.position);
    }
    
    // Animate sparkle effects
    if (window.sparkleEffects) {
        window.sparkleEffects.forEach(sparkle => {
            // Update time uniform for shader animation
            sparkle.material.uniforms.time.value = time;
            
            // Make sparkles follow their text, but with some lag
            const centerPos = sparkle.userData.centerPosition;
            if (window.titleText3D && centerPos.y > 8) { // Title sparkles
                sparkle.position.y = window.titleText3D.position.y - centerPos.y + sparkle.userData.centerPosition.y;
                sparkle.position.x = window.titleText3D.position.x - centerPos.x + sparkle.userData.centerPosition.x;
            } else if (window.nameText3D) { // Name sparkles
                sparkle.position.y = window.nameText3D.position.y - centerPos.y + sparkle.userData.centerPosition.y;
                sparkle.position.x = window.nameText3D.position.x - centerPos.x + sparkle.userData.centerPosition.x;
            }
        });
    }
    
    // Animate nebula with improved performance
    nebulaMaterial.uniforms.time.value += 0.0008; // Slower animation for better performance
    
    // Smoothly rotate slide to face cursor
    if (slideMesh) {
        slideMesh.rotation.y += (targetRotationY - slideMesh.rotation.y) * rotationSpeed;
        slideMesh.rotation.x += (targetRotationX - slideMesh.rotation.x) * rotationSpeed;
    }
    
    // Rotate Earth if it exists
    if (window.earth) {
        window.earth.rotation.y += 0.0005;
    }
    
    // Animate portal
    if (window.portal) {
        window.portal.rotation.z = time * 0.2;
        window.portal.material.uniforms.time.value = time;
    }
    
    // Animate crystals
    if (window.crystals) {
        window.crystals.forEach(crystal => {
            // Rotate crystal
            crystal.rotation.x += crystal.userData.rotationSpeed.x;
            crystal.rotation.y += crystal.userData.rotationSpeed.y;
            crystal.rotation.z += crystal.userData.rotationSpeed.z;
            
            // Float movement
            const floatY = Math.sin(time * crystal.userData.floatSpeed + crystal.userData.floatOffset) * 2;
            crystal.position.y = crystal.userData.originalPosition.y + floatY;
            
            // Pulse effect
            const scale = 1 + Math.sin(time * 2 + crystal.userData.floatOffset) * 0.1;
            crystal.scale.set(scale, scale, scale);
        });
    }
    
    // Animate energy field
    if (window.energyField) {
        window.energyField.material.uniforms.time.value = time;
        window.energyField.rotation.y = time * 0.1;
    }
    
    // Animate spot light
    if (window.spotLight) {
        window.spotLight.position.x = Math.sin(time * 0.5) * 30;
        window.spotLight.position.z = Math.cos(time * 0.5) * 30;
    }
    
    // Animate plasma field
    if (window.plasmaField) {
        window.plasmaField.rotation.y = time * 0.1;
        window.plasmaField.rotation.z = time * 0.05;
        window.plasmaField.material.uniforms.time.value = time;
    }
    
    // Animate energy beams
    if (window.energyBeams) {
        window.energyBeams.forEach((beam, index) => {
            const angle = beam.userData.angle + time * 0.5;
            const radius = beam.userData.radius;
            
            beam.position.x = Math.cos(angle) * radius;
            beam.position.z = Math.sin(angle) * radius - 40;
            beam.rotation.y = -angle;
            
            beam.material.uniforms.time.value = time;
            
            // Pulse effect
            const scale = 1 + Math.sin(time * 3 + index) * 0.2;
            beam.scale.x = beam.scale.z = scale;
        });
    }
    
    // Animate holographic rings
    if (window.holographicRings) {
        window.holographicRings.forEach((ring, index) => {
            ring.rotation.z = time * (0.2 + index * 0.1);
            ring.material.uniforms.time.value = time;
            
            // Breathe effect
            const breathe = 1 + Math.sin(time * 2 + index * Math.PI / 2) * 0.1;
            ring.scale.set(breathe, breathe, 1);
        });
    }
    
    // Animate quantum tunnel
    if (window.quantumTunnel) {
        window.quantumTunnel.material.uniforms.time.value = time;
        window.quantumTunnel.rotation.z = time * 0.1;
    }
    
    // Animate DNA helix
    if (window.dnaHelix) {
        window.dnaHelix.rotation.y = time * 0.2;
        window.dnaHelix.children.forEach(child => {
            if (child.material.uniforms) {
                child.material.uniforms.time.value = time;
            }
        });
    }
    
    // Animate cosmic dust
    if (window.cosmicDust) {
        window.cosmicDust.material.uniforms.time.value = time;
    }
    
    // Animate vortex
    if (window.vortex) {
        window.vortex.rotation.y = time * 0.3;
        window.vortex.rotation.z = time * 0.2;
        window.vortex.material.uniforms.time.value = time;
    }
    
    renderer.render(scene, camera);
}

// Initialize loading
function init() {
    // Prevent multiple initialization
    if (initCalled) {
        return;
    }
    initCalled = true;
    
    // Hide loading screen
    const loadingScreen = document.querySelector('.loading');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    
    // Start preloading videos for first few slides
    preloadVideos(0);
    
    // Initialize advanced visual effects
    initVisualEffects();
    
    // Start animation
    animate();
    
    // Create the first slide
    createSlide();
}

// Function to initialize all the visual effects
function initVisualEffects() {
    // Initialize wormhole effect
    const wormholeGeometry = new THREE.TorusGeometry(20, 8, 30, 100);
    const wormholeMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            colorA: { value: new THREE.Color(0x3311bb) },
            colorB: { value: new THREE.Color(0x00ffff) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 colorA;
            uniform vec3 colorB;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            // Spiral noise function
            float noise(vec2 p) {
                return sin(p.x * 10.0) * sin(p.y * 10.0);
            }
            
            void main() {
                // Create spiral pattern
                float distFromCenter = length(vPosition.xy) / 20.0;
                float angle = atan(vPosition.y, vPosition.x);
                float spiral = sin(distFromCenter * 20.0 - time * 2.0 + angle * 3.0);
                
                // Add noise layers
                float noise1 = noise(vUv * 5.0 + time * 0.1);
                float noise2 = noise(vUv * 10.0 - time * 0.2);
                
                // Color gradient based on spiral pattern and noise
                vec3 color = mix(colorA, colorB, sin(spiral + noise1 + noise2) * 0.5 + 0.5);
                
                // Add glow effect
                float glow = pow(1.0 - abs(distFromCenter - 0.5), 2.0);
                color += vec3(0.1, 0.3, 0.6) * glow;
                
                // Pulse effect
                float pulse = 0.5 + 0.5 * sin(time);
                color *= 0.8 + pulse * 0.4;
                
                // Variable transparency based on pattern
                float alpha = min(0.7, glow * (0.3 + 0.5 * spiral));
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const wormhole = new THREE.Mesh(wormholeGeometry, wormholeMaterial);
    wormhole.rotation.x = Math.PI / 2;
    wormhole.position.z = -100;
    scene.add(wormhole);
    window.wormhole = wormhole;
    
    // Initialize lightning effect
    window.lightning = {
        bolts: [],
        maxBolts: 3,
        nextStrikeTime: Date.now() + 2000,
        thunderSounds: [],
        
        createBolt: function(startPoint, endPoint, segments, width, color) {
            // Create points for lightning path
            const points = [startPoint.clone()];
            const mainDirection = endPoint.clone().sub(startPoint);
            const length = mainDirection.length();
            
            // Add random points along the path
            for (let i = 1; i < segments; i++) {
                const ratio = i / segments;
                const position = startPoint.clone().add(mainDirection.clone().multiplyScalar(ratio));
                
                // Add random offset perpendicular to main direction
                const offset = new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).multiplyScalar(length * 0.1 * (1 - ratio)); // Less offset toward the end
                
                position.add(offset);
                points.push(position);
            }
            
            // Add end point
            points.push(endPoint.clone());
            
            // Create geometry and material
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: color,
                transparent: true,
                opacity: 1.0,
                linewidth: width // Note: Line width may not work in WebGL
            });
            
            const bolt = new THREE.Line(geometry, material);
            bolt.life = 0.5; // Duration in seconds
            this.bolts.push(bolt);
            scene.add(bolt);
            
            // Flash effect for lightning
            const flash = new THREE.PointLight(0xaaddff, 5, 100);
            flash.position.copy(endPoint);
            scene.add(flash);
            
            // Animate flash
            gsap.to(flash, {
                intensity: 0,
                duration: 0.1,
                onComplete: () => {
                    scene.remove(flash);
                }
            });
            
            // Play thunder sound with delay
            this.playThunder();
        },
        
        playThunder: function() {
            // Create thunder sound
            const thunderDelay = Math.random() * 2000 + 500; // 0.5-2.5 second delay
            
            setTimeout(() => {
                // Create audio for thunder
                const thunder = new Audio();
                // Random choice of thunder sounds
                const thunderOptions = [
                    'https://assets.mixkit.co/sfx/preview/mixkit-distant-thunder-explosion-1278.mp3',
                    'https://assets.mixkit.co/sfx/preview/mixkit-thunder-deep-rumble-1296.mp3',
                    'https://assets.mixkit.co/sfx/preview/mixkit-lightning-explosion-rumble-1304.mp3'
                ];
                thunder.src = thunderOptions[Math.floor(Math.random() * thunderOptions.length)];
                thunder.volume = Math.random() * 0.3 + 0.2; // Random volume
                thunder.play().catch(e => console.log('Thunder audio error (ignorable):', e));
                
                // Store sound reference
                this.thunderSounds.push(thunder);
                
                // Remove reference after playing
                thunder.onended = () => {
                    const index = this.thunderSounds.indexOf(thunder);
                    if (index > -1) {
                        this.thunderSounds.splice(index, 1);
                    }
                };
            }, thunderDelay);
        },
        
        strike: function() {
            // Remove old bolts
            for (let i = this.bolts.length - 1; i >= 0; i--) {
                if (this.bolts[i].life <= 0) {
                    scene.remove(this.bolts[i]);
                    this.bolts.splice(i, 1);
                }
            }
            
            // Limit max bolts
            if (this.bolts.length >= this.maxBolts) return;
            
            // Create random start and end points in the background
            const startPoint = new THREE.Vector3(
                (Math.random() - 0.5) * 150,
                50 + Math.random() * 20,
                -70 - Math.random() * 30
            );
            
            const endPoint = new THREE.Vector3(
                startPoint.x + (Math.random() - 0.5) * 20,
                -50 - Math.random() * 20,
                startPoint.z + (Math.random() - 0.5) * 20
            );
            
            // Add branches
            this.createBolt(
                startPoint,
                endPoint,
                5 + Math.floor(Math.random() * 5), // Random segments
                2,
                new THREE.Color(0xaaddff)
            );
            
            // Add random branches
            const numBranches = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numBranches; i++) {
                // Pick a random point along the main bolt
                const ratio = Math.random() * 0.6 + 0.2; // 20-80% along the main bolt
                const branchStart = new THREE.Vector3().lerpVectors(startPoint, endPoint, ratio);
                
                // Create a branch end point
                const branchEnd = new THREE.Vector3(
                    branchStart.x + (Math.random() - 0.5) * 30,
                    branchStart.y - Math.random() * 30,
                    branchStart.z + (Math.random() - 0.5) * 30
                );
                
                this.createBolt(
                    branchStart,
                    branchEnd,
                    3 + Math.floor(Math.random() * 3), // Fewer segments for branches
                    1,
                    new THREE.Color(0x55ddff)
                );
            }
            
            // Set next strike time - cluster lightning occasionally
            if (Math.random() < 0.3) { // 30% chance of a quick follow-up strike
                this.nextStrikeTime = Date.now() + Math.random() * 500 + 200; // 0.2-0.7 seconds
            } else {
                this.nextStrikeTime = Date.now() + Math.random() * 8000 + 3000; // 3-11 seconds
            }
        },
        
        update: function() {
            // Update existing bolts
            for (const bolt of this.bolts) {
                bolt.life -= 0.016; // Roughly one frame at 60fps
                bolt.material.opacity = bolt.life * 2; // Fade out
            }
            
            // Check if time for a new bolt
            if (Date.now() > this.nextStrikeTime) {
                this.strike();
            }
        }
    };
    
    // Add dynamic lights to orbit around the center
    window.orbitLights = [];
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(
            new THREE.Color(
                Math.random() * 0.3 + 0.7, 
                Math.random() * 0.3 + 0.7, 
                Math.random() * 0.3 + 0.7
            ),
            1,
            100
        );
        
        light.angle = Math.random() * Math.PI * 2;
        light.speed = 0.2 + Math.random() * 0.3;
        light.radius = 10 + Math.random() * 20;
        light.height = Math.random() * 20 - 10;
        
        window.orbitLights.push(light);
        scene.add(light);
    }

    // Add new effects
    createCosmicPortal();
    createFloatingCrystals();
    createEnergyField();
    createPlasmaField();
    createEnergyBeams();
    createHolographicRings();
    createQuantumTunnel();
    createDNAHelix();
    createCosmicDust();
    createVortex();
    
    // Enhance nebula colors
    nebulaMaterial.uniforms.color1.value = new THREE.Color(0x00ffff);
    nebulaMaterial.uniforms.color2.value = new THREE.Color(0xff1493);
    
    // Add more dynamic lights
    const spotLight = new THREE.SpotLight(0x00ffff, 2);
    spotLight.position.set(0, 30, 0);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.5;
    scene.add(spotLight);
    window.spotLight = spotLight;
}

// Track if init has been called
let initCalled = false;

// Start initialization
init();

// Set a safety timeout to make sure the presentation initializes even if loading takes too long
setTimeout(() => {
    if (!initCalled) {
        console.warn('Safety timeout reached - forcing initialization');
        init();
    }
}, 5000); // 5 seconds timeout

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

// Add cosmic portal effect
function createCosmicPortal() {
    const portalGeometry = new THREE.TorusGeometry(12, 2, 30, 100);
    const portalMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            portalColor1: { value: new THREE.Color(0x00ffff) },
            portalColor2: { value: new THREE.Color(0xff00ff) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 portalColor1;
            uniform vec3 portalColor2;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            float noise(vec2 p) {
                return sin(p.x * 10.0 + time) * sin(p.y * 10.0 + time);
            }
            
            void main() {
                float distFromCenter = length(vPosition.xy) / 12.0;
                float angle = atan(vPosition.y, vPosition.x);
                
                // Create swirling effect
                float swirl = sin(angle * 10.0 + time * 2.0 + distFromCenter * 20.0);
                
                // Add electric-like noise
                float noise1 = noise(vUv * 5.0 + time);
                float noise2 = noise(vUv * 10.0 - time * 0.5);
                
                // Combine effects
                vec3 color = mix(portalColor1, portalColor2, swirl * noise1 * noise2);
                
                // Add energy pulse
                float pulse = 0.5 + 0.5 * sin(time * 3.0);
                color += vec3(0.2, 0.5, 1.0) * pulse;
                
                // Edge glow
                float edgeGlow = pow(1.0 - abs(distFromCenter - 0.5), 3.0);
                color += vec3(0.0, 0.5, 1.0) * edgeGlow;
                
                float alpha = min(1.0, edgeGlow + 0.3);
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const portal = new THREE.Mesh(portalGeometry, portalMaterial);
    portal.position.z = -50;
    portal.rotation.x = Math.PI / 4;
    scene.add(portal);
    window.portal = portal;
}

// Add floating crystals effect
function createFloatingCrystals() {
    const crystals = [];
    const crystalCount = 20;
    
    for (let i = 0; i < crystalCount; i++) {
        const geometry = new THREE.OctahedronGeometry(Math.random() * 0.5 + 0.5);
        const material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(Math.random(), Math.random(), 1),
            metalness: 0.9,
            roughness: 0.1,
            transmission: 0.5,
            thickness: 0.5,
            envMapIntensity: 1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            transparent: true,
            opacity: 0.8
        });

        const crystal = new THREE.Mesh(geometry, material);
        
        // Random position in a sphere
        const radius = 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        crystal.position.x = radius * Math.sin(phi) * Math.cos(theta);
        crystal.position.y = radius * Math.sin(phi) * Math.sin(theta);
        crystal.position.z = radius * Math.cos(phi) - 30;
        
        // Store original position and random rotation speed
        crystal.userData.originalPosition = crystal.position.clone();
        crystal.userData.rotationSpeed = {
            x: Math.random() * 0.02 - 0.01,
            y: Math.random() * 0.02 - 0.01,
            z: Math.random() * 0.02 - 0.01
        };
        crystal.userData.floatSpeed = Math.random() * 0.005 + 0.002;
        crystal.userData.floatOffset = Math.random() * Math.PI * 2;
        
        scene.add(crystal);
        crystals.push(crystal);
    }
    window.crystals = crystals;
}

// Add energy field effect
function createEnergyField() {
    const fieldGeometry = new THREE.SphereGeometry(25, 32, 32);
    const fieldMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            energyColor: { value: new THREE.Color(0x00ffff) }
        },
        vertexShader: `
            varying vec3 vPosition;
            varying vec2 vUv;
            void main() {
                vPosition = position;
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 energyColor;
            varying vec3 vPosition;
            varying vec2 vUv;
            
            void main() {
                vec3 pos = normalize(vPosition);
                float pattern = sin(pos.x * 20.0 + time) * sin(pos.y * 20.0 + time) * sin(pos.z * 20.0 + time);
                pattern = abs(pattern);
                
                float energyLines = abs(sin(vUv.y * 50.0 + time * 2.0)) * abs(sin(vUv.x * 50.0 - time));
                
                vec3 color = energyColor * (pattern + energyLines);
                float alpha = pattern * 0.3 + energyLines * 0.1;
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    energyField.position.z = -40;
    scene.add(energyField);
    window.energyField = energyField;
}

// Add plasma field effect
function createPlasmaField() {
    const plasmaGeometry = new THREE.IcosahedronGeometry(30, 3);
    const plasmaMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            plasmaColor1: { value: new THREE.Color(0x0088ff) },
            plasmaColor2: { value: new THREE.Color(0xff1493) }
        },
        vertexShader: `
            varying vec3 vPosition;
            varying vec2 vUv;
            void main() {
                vPosition = position;
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 plasmaColor1;
            uniform vec3 plasmaColor2;
            varying vec3 vPosition;
            varying vec2 vUv;
            
            float plasma(vec3 p) {
                float v = 0.0;
                v += sin((p.x + time) * 10.0) * 0.5;
                v += sin((p.y + time * 0.5) * 10.0) * 0.5;
                v += sin((p.z + time * 0.7) * 10.0) * 0.5;
                v += sin(sqrt(p.x * p.x + p.y * p.y + p.z * p.z) * 10.0 - time * 2.0);
                return v;
            }
            
            void main() {
                vec3 pos = normalize(vPosition);
                float v = plasma(pos);
                
                vec3 color = mix(plasmaColor1, plasmaColor2, v * 0.5 + 0.5);
                float alpha = 0.3 * (0.5 + 0.5 * sin(v * 5.0 + time));
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const plasmaField = new THREE.Mesh(plasmaGeometry, plasmaMaterial);
    plasmaField.position.z = -60;
    scene.add(plasmaField);
    window.plasmaField = plasmaField;
}

// Add energy beams
function createEnergyBeams() {
    const beams = [];
    const beamCount = 8;
    
    for (let i = 0; i < beamCount; i++) {
        const angle = (i / beamCount) * Math.PI * 2;
        const radius = 15;
        
        const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 20, 8);
        const beamMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                beamColor: { value: new THREE.Color(0x00ffff) }
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
                uniform vec3 beamColor;
                varying vec2 vUv;
                
                void main() {
                    float energy = abs(sin(vUv.y * 20.0 + time * 5.0));
                    vec3 color = beamColor * (0.5 + 0.5 * energy);
                    float alpha = energy * 0.7;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        
        beam.position.x = Math.cos(angle) * radius;
        beam.position.y = 0;
        beam.position.z = Math.sin(angle) * radius - 40;
        
        beam.rotation.z = Math.PI / 2;
        beam.rotation.y = -angle;
        
        beam.userData.angle = angle;
        beam.userData.radius = radius;
        
        scene.add(beam);
        beams.push(beam);
    }
    window.energyBeams = beams;
}

// Add holographic rings
function createHolographicRings() {
    const rings = [];
    const ringCount = 3;
    
    for (let i = 0; i < ringCount; i++) {
        const radius = 8 + i * 4;
        const ringGeometry = new THREE.TorusGeometry(radius, 0.2, 16, 100);
        const ringMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                ringColor: { value: new THREE.Color(0x00ffff) }
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
                uniform vec3 ringColor;
                varying vec2 vUv;
                
                void main() {
                    float pattern = abs(sin(vUv.x * 50.0 + time * 2.0));
                    vec3 color = ringColor * (0.5 + 0.5 * pattern);
                    float alpha = pattern * 0.5;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.z = -35;
        ring.rotation.x = Math.PI / 4;
        
        scene.add(ring);
        rings.push(ring);
    }
    window.holographicRings = rings;
}

// Add quantum tunnel effect
function createQuantumTunnel() {
    const tunnelGeometry = new THREE.CylinderGeometry(10, 10, 100, 32, 32, true);
    const tunnelMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            tunnelColor1: { value: new THREE.Color(0x00ffff) },
            tunnelColor2: { value: new THREE.Color(0xff1493) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 tunnelColor1;
            uniform vec3 tunnelColor2;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            float pattern(vec2 p) {
                return sin(p.x * 10.0 + time * 0.5);
            }
            
            void main() {
                vec2 pos = vUv * 2.0 - 1.0;
                float dist = length(pos);
                
                // Create spiral effect
                float angle = atan(pos.y, pos.x);
                float spiral = sin(angle * 10.0 + dist * 20.0 - time * 3.0);
                
                // Add quantum noise
                float noise = pattern(vUv * 5.0);
                float quantumEffect = sin(spiral * 3.0 + noise + time);
                
                // Color mix with quantum interference
                vec3 color = mix(tunnelColor1, tunnelColor2, quantumEffect * 0.5 + 0.5);
                
                // Add energy waves
                float waves = sin(dist * 20.0 - time * 2.0) * 0.5 + 0.5;
                color += vec3(0.2, 0.5, 1.0) * waves;
                
                // Edge glow
                float edge = 1.0 - abs(dist - 0.5) * 2.0;
                edge = pow(edge, 3.0);
                
                float alpha = edge * (0.5 + 0.5 * quantumEffect);
                gl_FragColor = vec4(color, alpha * 0.5);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    tunnel.rotation.x = Math.PI / 2;
    tunnel.position.z = -80;
    scene.add(tunnel);
    window.quantumTunnel = tunnel;
}

// Add DNA helix effect
function createDNAHelix() {
    const helixGroup = new THREE.Group();
    const strandCount = 2;
    const pointsPerStrand = 100;
    const radius = 5;
    const height = 30;
    const rotations = 4;
    
    for (let strand = 0; strand < strandCount; strand++) {
        const points = [];
        for (let i = 0; i < pointsPerStrand; i++) {
            const angle = (i / pointsPerStrand) * Math.PI * 2 * rotations + (strand * Math.PI);
            const y = (i / pointsPerStrand) * height - height/2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.3, 8, false);
        const tubeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                baseColor: { value: new THREE.Color(strand === 0 ? 0x00ffff : 0xff1493) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 baseColor;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    float energy = abs(sin(vUv.x * 30.0 + time * 3.0));
                    vec3 color = baseColor * (0.5 + 0.5 * energy);
                    float alpha = 0.7 + 0.3 * energy;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        helixGroup.add(tube);
        
        // Add connecting segments (base pairs)
        for (let i = 0; i < pointsPerStrand; i += 5) {
            const angle = (i / pointsPerStrand) * Math.PI * 2 * rotations;
            const y = (i / pointsPerStrand) * height - height/2;
            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;
            
            const baseGeometry = new THREE.CylinderGeometry(0.1, 0.1, radius * 2, 8);
            const baseMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    baseColor: { value: new THREE.Color(0xffffff) }
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
                    uniform vec3 baseColor;
                    varying vec2 vUv;
                    
                    void main() {
                        float pulse = sin(vUv.y * 10.0 + time * 5.0) * 0.5 + 0.5;
                        vec3 color = baseColor * pulse;
                        float alpha = 0.3 + 0.2 * pulse;
                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });
            
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.set((x1 + x2)/2, y, (z1 + z2)/2);
            base.lookAt(x2, y, z2);
            base.rotateX(Math.PI/2);
            helixGroup.add(base);
        }
    }
    
    helixGroup.position.z = -50;
    scene.add(helixGroup);
    window.dnaHelix = helixGroup;
}

// Add cosmic dust particles
function createCosmicDust() {
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const radius = 50 + Math.random() * 50;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi) - 50;
        
        const color = new THREE.Color();
        color.setHSL(Math.random(), 0.8, 0.8);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        sizes[i] = Math.random() * 2;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pointTexture: { value: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png') }
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            uniform float time;
            
            void main() {
                vColor = color;
                vec3 pos = position;
                
                // Add swirling motion
                float angle = time * 0.2;
                float radius = length(pos.xz);
                float theta = atan(pos.z, pos.x) + angle * (1.0 - radius / 100.0);
                pos.x = radius * cos(theta);
                pos.z = radius * sin(theta);
                
                // Add vertical wave motion
                pos.y += sin(time + radius * 0.02) * 5.0;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            
            void main() {
                gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    window.cosmicDust = particles;
}

// Add vortex effect
function createVortex() {
    const vortexGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const vortexMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            vortexColor1: { value: new THREE.Color(0x00ffff) },
            vortexColor2: { value: new THREE.Color(0xff1493) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 vortexColor1;
            uniform vec3 vortexColor2;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                float noise = sin(vUv.x * 20.0 + time) * sin(vUv.y * 20.0 + time);
                float twist = sin(atan(vPosition.y, vPosition.x) * 5.0 + time * 2.0);
                float pattern = noise * twist;
                
                vec3 color = mix(vortexColor1, vortexColor2, pattern * 0.5 + 0.5);
                float alpha = 0.5 * (0.5 + 0.5 * sin(pattern * 5.0 + time));
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });
    
    const vortex = new THREE.Mesh(vortexGeometry, vortexMaterial);
    vortex.position.z = -70;
    scene.add(vortex);
    window.vortex = vortex;
}