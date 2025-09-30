// Canvas setup
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

// Core systems
const road = new Road(carCanvas.width/2, carCanvas.width*0.95);
const trafficManager = new TrafficManager(road);
let generationManager = new GenerationManager(road, 100); // Default 100 cars

// Pause/Resume system
let isPaused = false;
let animationId;

animate();

function animate(time = 0) {
    const bestCar = generationManager.getBestCar();
    
    // Safety check - if no best car, something went wrong
    if (!bestCar) {
        console.error("No best car found! Restarting generation...");
        generationManager = new GenerationManager(road, generationManager.N);
        if (!isPaused) {
            animationId = requestAnimationFrame(animate);
        }
        return;
    }
    
    // Update systems
    trafficManager.update(bestCar.y);
    generationManager.update(trafficManager.getTraffic());
    
    // Update stats in real-time
    generationManager.updateStats();
    
    // Rendering
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    // Draw road and traffic
    road.draw(carCtx);
    trafficManager.draw(carCtx);
    
    // Draw cars
    generationManager.draw(carCtx);

    carCtx.restore();

    // Draw neural network (with safety check)
    if (bestCar.brain) {
        networkCtx.lineDashOffset = -time / 50;
        Visualizer.drawNetwork(networkCtx, bestCar.brain);
    }
    
    // Continue animation if not paused
    if (!isPaused) {
        animationId = requestAnimationFrame(animate);
    }
}

function save() {
    const bestCar = generationManager.getBestCar();
    if (bestCar && bestCar.brain) {
        localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
        console.log("Best brain saved!");
    }
}

function discard() {
    localStorage.removeItem("bestBrain");
    generationManager = new GenerationManager(road, generationManager.N);
    console.log("Saved brain discarded! New generation started.");
}

// Pause/Resume function
function toggleTraining() {
    isPaused = !isPaused;
    
    if (!isPaused) {
        // Resume animation
        animationId = requestAnimationFrame(animate);
    }
    
    // Update button text
    const button = document.querySelector('button[onclick="toggleTraining()"]');
    if (button) {
        button.textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
    }
}

function updateCarCount() {
    const dropdown = document.getElementById('carCount');
    const newN = parseInt(dropdown.value);
    generationManager.updateCarCount(newN);
}