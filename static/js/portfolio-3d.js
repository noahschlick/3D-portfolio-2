import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Portfolio 3D Scene Manager
class Portfolio3D {
    constructor() {
        this.scenes = new Map();
        this.init();
    }

    init() {
        this.createHeroScene();
        // this.createTimelineScenes(); // Removed - timeline no longer has 3D objects
        this.createProjectScenes();
        // Note: createSkillScenes() removed since skills no longer have 3D elements
    }

    createHeroScene() {
        const heroContainer = document.getElementById('hero-3d-container');
        if (!heroContainer) return;

        const scene = new THREE.Scene();
        // Use fixed larger dimensions
        const containerWidth = 1000;
        const containerHeight = 400;
        
        const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(containerWidth, containerHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        heroContainer.appendChild(renderer.domElement);

        // Enhanced lighting setup for hero
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x64ffda, 1.2);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const pointLight1 = new THREE.PointLight(0x00ff88, 0.8, 100);
        pointLight1.position.set(-10, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x2563eb, 0.6, 100);
        pointLight2.position.set(10, -5, -5);
        scene.add(pointLight2);

        camera.position.set(0, 0, 12);

        // Load the retro computer model
        const loader = new GLTFLoader();
        loader.load('/assets/retro-computer-model.glb', (gltf) => {
            const model = gltf.scene;
            
            // Scale and position the retro computer
            model.scale.setScalar(5.0);
            model.position.set(0, -1, 0);
            scene.add(model);

            // Store scene data for animation
            const sceneData = {
                scene,
                camera,
                renderer,
                model,
                animate: () => {
                    if (model) {
                        // Slow rotation for professional look
                        model.rotation.y += 0.005;
                        
                        // Subtle floating animation
                        model.position.y = -1 + Math.sin(Date.now() * 0.001) * 0.1;
                    }
                    renderer.render(scene, camera);
                }
            };
            
            this.scenes.set('hero', sceneData);
            
            // Start animation loop
            const animate = () => {
                requestAnimationFrame(animate);
                sceneData.animate();
            };
            animate();
            
        }, undefined, (error) => {
            console.error('Error loading retro computer model:', error);
        });

        // Handle window resize - maintain fixed dimensions for now
        window.addEventListener('resize', () => {
            const newWidth = 1000;
            const newHeight = 400;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        });
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
                1: 'icode-model.glb', 
                2: 'react-model.glb', // Will be handled by separate containers
                3: 'work-model.glb'  // Use work model for the new test automation stage
            };
            
            // Map model files to their desired scales
            const scaleMap = {
                'education-model.glb': 1.2,
                'work-model.glb': 0.6,
                'current-model.glb': 0.6,
                'react-model.glb': 0.8,  // Bigger React model
                'mushroom-model.glb': 1.0,  // Much bigger mushroom model
                'icode-model.glb': 0.8
            };
            
            const modelFiles = modelMap[index] || 'education-model.glb';
            const filesToLoad = Array.isArray(modelFiles) ? modelFiles : [modelFiles];
            
            // Load all models for this stage
            filesToLoad.forEach((modelFile, modelIndex) => {
                const modelScale = scaleMap[modelFile] || 0.8; // Default scale if not found
                
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
                        } else if (modelFile === 'react-model.glb') {
                            model.position.set(0, 0.2, 0); // Raise React model higher
                            model.rotation.y = Math.PI; // 180 degree rotation around Y-axis
                            model.rotation.x = Math.PI / 12; // 15 degree tilt around X-axis
                        } else if (modelFile === 'icode-model.glb') {
                            // Create a group to hold the model for proper rotation
                            const modelGroup = new THREE.Group();
                            
                            // Center the model geometry within the group
                            const box = new THREE.Box3().setFromObject(model);
                            const center = box.getCenter(new THREE.Vector3());
                            model.position.sub(center); // Center model within group
                            
                            // Add model to group and position group in scene
                            modelGroup.add(model);
                            modelGroup.position.set(0, 0, 0); // Keep group centered in screen
                            
                            // Replace model reference with group for rotation
                            scene.add(modelGroup);
                            mesh = modelGroup; // This will rotate instead of the model directly
                            
                            // Skip the normal scene.add(model) later
                            return;
                        } else if (filesToLoad.length > 1) {
                            // Position multiple models side by side with closer spacing
                            const spacing = 1.2; // Reduced spacing to keep both in frame
                            const totalWidth = (filesToLoad.length - 1) * spacing;
                            const startX = -totalWidth / 2;
                            
                            // Position models side by side at same depth
                            model.position.set(startX + (modelIndex * spacing), -0.5, 0);
                        } else {
                            model.position.set(0, -0.5, 0); // Lower other models
                        }
                        
                        // Handle mushroom model coloring and lighting specifically
                        if (modelFile === 'mushroom-model.glb') {
                            // Add dedicated spotlight for the mushroom
                            const mushroomSpotlight = new THREE.SpotLight(0xffffff, 2.0);
                            mushroomSpotlight.position.set(
                                model.position.x + 1, 
                                model.position.y + 2, 
                                model.position.z + 1
                            );
                            mushroomSpotlight.target = model;
                            mushroomSpotlight.angle = Math.PI / 4;
                            mushroomSpotlight.penumbra = 0.3;
                            scene.add(mushroomSpotlight);
                            
                            // Traverse the model and force mushroom colors
                            let meshIndex = 0;
                            model.traverse((child) => {
                                if (child.isMesh) {
                                    // Force a new material with mushroom colors
                                    const mushroomMaterial = new THREE.MeshPhongMaterial({
                                        emissive: 0x000000,     // Black emissive glow
                                        emissiveIntensity: 0.2,
                                        shininess: 30
                                    });
                                    
                                    // Simple alternating approach: first mesh is cap, second is stem
                                    if (meshIndex === 0) {
                                        mushroomMaterial.color = new THREE.Color(0xFF0000); // Red for cap
                                        console.log('Applied red color to mushroom cap');
                                    } else {
                                        mushroomMaterial.color = new THREE.Color(0xFFFFFF); // White for stem
                                        console.log('Applied white color to mushroom stem');
                                    }
                                    
                                    child.material = mushroomMaterial;
                                    meshIndex++;
                                }
                            });
                        }
                        
                        scene.add(model);
                        
                        // Store reference for rotation (last loaded model will be the mesh reference)
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
            });

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

    createProjectScenes() {
        const projectItems = document.querySelectorAll('.project-3d');
        console.log('Found project items:', projectItems.length);
        
        projectItems.forEach((container, index) => {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / 200, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            
            renderer.setSize(container.offsetWidth, 200);
            renderer.setClearColor(0x000000, 0);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            container.appendChild(renderer.domElement);

            // Lighting setup
            const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0x64ffda, 1);
            directionalLight.position.set(5, 5, 5);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            const pointLight = new THREE.PointLight(0x00ff88, 0.5, 100);
            pointLight.position.set(-5, 5, 0);
            scene.add(pointLight);

            camera.position.z = 5;

            // Load the GLB model based on data-model attribute
            const modelFile = container.dataset.model;
            if (modelFile) {
                const loader = new GLTFLoader();
                loader.load(`/assets/${modelFile}`, (gltf) => {
                    const model = gltf.scene;
                    
                    // Scale model based on filename
                    const scaleMap = {
                        'mushroom-model.glb': 2.5,
                        'react-model.glb': 1.8,
                        'work-model.glb': 2.0,
                        'education-model.glb': 2.2,
                        'beer-model.glb': 4.0,
                        'glasses-model.glb': 5.175,
                        'robot-pixel.glb': 1.4,
                        'tic-tac-toe-model.glb': 2.6
                    };
                    
                    const scale = scaleMap[modelFile] || 2.0;
                    model.scale.setScalar(scale);
                    
                    // Center the model properly
                    if (modelFile === 'beer-model.glb') {
                        // Calculate bounding box to center the beer model perfectly
                        const box = new THREE.Box3().setFromObject(model);
                        const center = box.getCenter(new THREE.Vector3());
                        model.position.set(-center.x - 0.5, -center.y, -center.z);
                    } else if (modelFile === 'glasses-model.glb') {
                        // Calculate bounding box to center the glasses model perfectly
                        const box = new THREE.Box3().setFromObject(model);
                        const center = box.getCenter(new THREE.Vector3());
                        model.position.set(-center.x, -center.y, -center.z);
                    } else if (modelFile === 'robot-pixel.glb') {
                        // Center the robot geometry itself for proper rotation
                        model.traverse((child) => {
                            if (child.isMesh && child.geometry) {
                                child.geometry.center();
                            }
                        });
                        model.position.set(0, 0, 0);
                    } else if (modelFile === 'tic-tac-toe-model.glb') {
                        // Position and tilt the tic-tac-toe model
                        model.position.set(0, 0, 0);
                        model.rotation.x = 0.2;  // Tilt forward slightly
                        model.rotation.z = 0.1;  // Tilt to the side slightly
                    } else {
                        model.position.set(0, 0, 0);
                    }
                    
                    scene.add(model);

                    // Add enhanced lighting for beer model
                    if (modelFile === 'beer-model.glb') {
                        // Additional ambient light for beer model (doubled again)
                        const extraAmbientLight = new THREE.AmbientLight(0xffffff, 1.8);
                        scene.add(extraAmbientLight);
                        
                        // Spotlight from top to highlight the beer (doubled again)
                        const spotLight = new THREE.SpotLight(0xffffff, 9.0, 0, Math.PI / 6, 0.1);
                        spotLight.position.set(0, 8, 0);
                        spotLight.target.position.set(0, 0, 0);
                        scene.add(spotLight);
                        scene.add(spotLight.target);
                        
                        // Rim lighting from sides (doubled again)
                        const rimLight1 = new THREE.PointLight(0xffaa00, 4.8, 20);
                        rimLight1.position.set(5, 2, 3);
                        scene.add(rimLight1);
                        
                        const rimLight2 = new THREE.PointLight(0xff6600, 4.2, 20);
                        rimLight2.position.set(-5, 2, 3);
                        scene.add(rimLight2);
                        
                        // Bottom fill light (doubled again)
                        const fillLight = new THREE.PointLight(0x88aaff, 2.4, 15);
                        fillLight.position.set(0, -3, 2);
                        scene.add(fillLight);
                    }

                    // Add enhanced lighting for glasses model (triple brightness)
                    if (modelFile === 'glasses-model.glb') {
                        // Triple ambient light for glasses model
                        const extraAmbientLight = new THREE.AmbientLight(0xffffff, 1.8);
                        scene.add(extraAmbientLight);
                        
                        // Triple intensity spotlight from top
                        const spotLight = new THREE.SpotLight(0xffffff, 9.0, 0, Math.PI / 6, 0.1);
                        spotLight.position.set(0, 8, 0);
                        spotLight.target.position.set(0, 0, 0);
                        scene.add(spotLight);
                        scene.add(spotLight.target);
                        
                        // Triple intensity rim lighting from sides
                        const rimLight1 = new THREE.PointLight(0x00aaff, 4.8, 20);
                        rimLight1.position.set(5, 2, 3);
                        scene.add(rimLight1);
                        
                        const rimLight2 = new THREE.PointLight(0x0066ff, 4.2, 20);
                        rimLight2.position.set(-5, 2, 3);
                        scene.add(rimLight2);
                        
                        // Triple intensity bottom fill light
                        const fillLight = new THREE.PointLight(0xaaffaa, 2.4, 15);
                        fillLight.position.set(0, -3, 2);
                        scene.add(fillLight);
                    }

                    // Add enhanced lighting for robot-pixel model (double brightness)
                    if (modelFile === 'robot-pixel.glb') {
                        // Double ambient light for robot model
                        const extraAmbientLight = new THREE.AmbientLight(0xffffff, 1.2);
                        scene.add(extraAmbientLight);
                        
                        // Double intensity spotlight from top
                        const spotLight = new THREE.SpotLight(0xffffff, 6.0, 0, Math.PI / 6, 0.1);
                        spotLight.position.set(0, 8, 0);
                        spotLight.target.position.set(0, 0, 0);
                        scene.add(spotLight);
                        scene.add(spotLight.target);
                        
                        // Double intensity rim lighting with tech colors
                        const rimLight1 = new THREE.PointLight(0xff4444, 3.2, 20);
                        rimLight1.position.set(5, 2, 3);
                        scene.add(rimLight1);
                        
                        const rimLight2 = new THREE.PointLight(0x44ff44, 2.8, 20);
                        rimLight2.position.set(-5, 2, 3);
                        scene.add(rimLight2);
                        
                        // Double intensity bottom fill light
                        const fillLight = new THREE.PointLight(0x4444ff, 1.6, 15);
                        fillLight.position.set(0, -3, 2);
                        scene.add(fillLight);
                    }

                    // Add enhanced lighting for tic-tac-toe model (double brightness)
                    if (modelFile === 'tic-tac-toe-model.glb') {
                        // Double ambient light for tic-tac-toe model
                        const extraAmbientLight = new THREE.AmbientLight(0xffffff, 1.2);
                        scene.add(extraAmbientLight);
                        
                        // Double intensity spotlight from top
                        const spotLight = new THREE.SpotLight(0xffffff, 6.0, 0, Math.PI / 6, 0.1);
                        spotLight.position.set(0, 8, 0);
                        spotLight.target.position.set(0, 0, 0);
                        scene.add(spotLight);
                        scene.add(spotLight.target);
                        
                        // Double intensity rim lighting with game colors
                        const rimLight1 = new THREE.PointLight(0x00ff00, 3.2, 20);
                        rimLight1.position.set(5, 2, 3);
                        scene.add(rimLight1);
                        
                        const rimLight2 = new THREE.PointLight(0xff0000, 2.8, 20);
                        rimLight2.position.set(-5, 2, 3);
                        scene.add(rimLight2);
                        
                        // Double intensity bottom fill light
                        const fillLight = new THREE.PointLight(0xffff00, 1.6, 15);
                        fillLight.position.set(0, -3, 2);
                        scene.add(fillLight);
                    }

                    // Store scene data for animation
                    const sceneData = {
                        scene,
                        camera,
                        renderer,
                        model,
                        animate: () => {
                            if (model) {
                                model.rotation.y += 0.01;
                            }
                            renderer.render(scene, camera);
                        }
                    };
                    
                    this.scenes.set(`project-${index}`, sceneData);
                    
                    // Start animation loop
                    const animate = () => {
                        requestAnimationFrame(animate);
                        sceneData.animate();
                    };
                    animate();
                    
                }, undefined, (error) => {
                    console.error('Error loading project model:', error);
                });
            }
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
