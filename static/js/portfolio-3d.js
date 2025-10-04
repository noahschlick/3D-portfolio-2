import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Portfolio 3D Scene Manager
class Portfolio3D {
    constructor() {
        this.scenes = new Map();
        this.init();
    }

    init() {
        // this.createHeroScene(); // Disabled hero 3D scene
        this.createTimelineScenes();
        this.createSkillScenes();
    }

    createTimelineScenes() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        console.log('Found timeline items:', timelineItems.length);
        
        timelineItems.forEach((item, index) => {
            const container = item.querySelector('.stage-3d');
            console.log(`Timeline item ${index} container:`, container);
            if (!container) return;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, 600 / 500, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            
            renderer.setSize(600, 500);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);

            // Add lighting to the scene
            // Ambient light for overall illumination
            const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // Soft white light
            scene.add(ambientLight);

            // Directional light for shadows and depth
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(-1, 1, 1);
            scene.add(directionalLight);

            // Additional fill light from the opposite side
            const fillLight = new THREE.DirectionalLight(0x404040, 0.4);
            fillLight.position.set(1, 0.5, -1);
            scene.add(fillLight);

            // Create GLTFLoader
            const loader = new GLTFLoader();
            
            // Map stages to GLB files
            const modelMap = {
                0: 'education-model.glb',
                1: 'work-model.glb', 
                2: 'current-model.glb',
                3: 'work-model.glb'  // Use work model for the new test automation stage
            };
            
            // Map model files to their desired scales
            const scaleMap = {
                'education-model.glb': 1.2,
                'work-model.glb': 0.6,
                'current-model.glb': 0.6
            };
            
            const modelFile = modelMap[index] || 'education-model.glb';
            const modelScale = scaleMap[modelFile] || 0.8; // Default scale if not found
            
            // Try to load GLB model
            console.log(`Attempting to load ${modelFile} for stage ${index} with scale ${modelScale}`);
            loader.load(
                `/assets/${modelFile}`,
                (gltf) => {
                    const model = gltf.scene;
                    model.scale.setScalar(modelScale);
                    
                    // Apply specific positioning and rotations based on model
                    if (modelFile === 'education-model.glb') {
                        model.position.set(0, 0.5, 0); // Raise education model higher
                        // Tilt education model backward vertically (rotate around X-axis)
                        model.rotation.x = Math.PI / 6; // +30 degrees backward tilt
                    } else {
                        model.position.set(0, -0.5, 0); // Lower other models
                    }
                    
                    scene.add(model);
                    
                    // Store reference for rotation
                    mesh = model;
                    console.log(`Successfully loaded ${modelFile} for stage ${index} at scale ${modelScale}`);
                },
                (progress) => {
                    const percent = progress.loaded / progress.total * 100;
                    console.log(`Loading ${modelFile}: ${percent.toFixed(2)}%`);
                },
                (error) => {
                    console.error(`Error loading ${modelFile}:`, error);
                    console.log(`GLB file ${modelFile} not found - container will remain empty`);
                }
            );

            camera.position.z = 4; // Move camera back for better framing

            // Animation loop (render only, no automatic rotation)
            const animate = () => {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            };
            
            animate();

            // Store scene data with scroll handler (mesh will be updated when model loads)
            const sceneData = { 
                scene, 
                camera, 
                renderer, 
                mesh: null, // Will be set when GLB model loads successfully
                container,
                initialRotation: { x: 0, y: 0 },
                lastScrollY: window.pageYOffset
            };
            
            this.scenes.set(`timeline-${index}`, sceneData);
        });
    }

    createSkillScenes() {
        const skillItems = document.querySelectorAll('.skill-3d');
        
        skillItems.forEach((container, index) => {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, 150 / 150, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            
            renderer.setSize(150, 150);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);

            let geometry, material, mesh;
            const skill = container.dataset.skill;
            
            switch(skill) {
                case 'python':
                    // Python logo inspired shape
                    geometry = new THREE.SphereGeometry(0.8, 12, 8);
                    material = new THREE.MeshBasicMaterial({ color: 0x3776ab, wireframe: true });
                    break;
                case 'javascript':
                    // JS cube
                    geometry = new THREE.BoxGeometry(1, 1, 1);
                    material = new THREE.MeshBasicMaterial({ color: 0xf7df1e, wireframe: true });
                    break;
                case 'web':
                    // Web/network structure
                    geometry = new THREE.IcosahedronGeometry(0.8);
                    material = new THREE.MeshBasicMaterial({ color: 0xe34f26, wireframe: true });
                    break;
                default:
                    geometry = new THREE.TetrahedronGeometry(1);
                    material = new THREE.MeshBasicMaterial({ color: 0x9333ea, wireframe: true });
            }
            
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            camera.position.z = 2.5;

            const animate = () => {
                requestAnimationFrame(animate);
                mesh.rotation.y += 0.02;
                mesh.rotation.x += 0.01;
                renderer.render(scene, camera);
            };
            
            animate();

            this.scenes.set(`skill-${skill}`, { scene, camera, renderer, mesh });
        });
    }

    // Method to update timeline 3D rotations based on scroll
    updateTimelineRotations() {
        const currentScrollY = window.pageYOffset;
        
        this.scenes.forEach((sceneData, key) => {
            if (key.startsWith('timeline-')) {
                const { scene } = sceneData;
                const scrollDelta = currentScrollY - (sceneData.lastScrollY || 0);
                
                // Update last scroll position
                sceneData.lastScrollY = currentScrollY;
                
                // Rotate all objects in the scene based on scroll delta
                scene.children.forEach(child => {
                    // Handle both individual meshes and loaded GLTF models (which are Groups)
                    if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
                        // Only horizontal rotation (Y-axis), proportional to scroll
                        child.rotation.y += scrollDelta * 0.01;
                    }
                });
            }
        });
    }

    // Method to clean up scenes if needed
    cleanup() {
        this.scenes.forEach(({ renderer }) => {
            renderer.dispose();
        });
        this.scenes.clear();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio3D = new Portfolio3D();
    
    // Add scroll event listener for timeline rotations
    window.addEventListener('scroll', () => {
        if (window.portfolio3D) {
            window.portfolio3D.updateTimelineRotations();
        }
    });
});
