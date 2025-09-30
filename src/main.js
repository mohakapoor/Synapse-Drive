const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

// Pause/Resume system
let isPaused = false;
let animationId;

const carCtx = carCanvas.getContext("2d");

const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width/2,carCanvas.width*0.95)

let N = 100;  // Default to 100 cars
let cars = generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.2);
        }
    }
}

// Smart traffic generation system
let traffic = [];
let trafficSpawnDistance = 250; // Distance between traffic groups
let nextTrafficSpawn = -100;

function generateTrafficGroup() {
    const laneCount = 3; // Road has 3 lanes
    const maxCarsPerGroup = laneCount - 1; // Always leave at least 1 lane open
    const minGapForPassing = 150; // Minimum gap for our car to pass through
    
    // Randomly decide how many cars in this group (1 or 2, never all 3 lanes)
    const carsInThisGroup = Math.floor(Math.random() * maxCarsPerGroup) + 1;
    const availableLanes = [0, 1, 2];
    
    // Randomly select which lanes to block (always leaving at least one open)
    for (let i = 0; i < carsInThisGroup; i++) {
        const laneIndex = availableLanes.splice(Math.floor(Math.random() * availableLanes.length), 1)[0];
        traffic.push(new Car(road.getLaneCenter(laneIndex), nextTrafficSpawn, 30, 50, "TRAFFIC", 2));
    }
    
    nextTrafficSpawn -= trafficSpawnDistance;
}

// Generate initial traffic
for (let i = 0; i < 15; i++) {
    generateTrafficGroup();
}

animate();

function save(){
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars = [];
    for(let i=0;i<N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"))
    }
    return cars;
}


function animate(time){
    // Update existing traffic
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    
    // Remove traffic that's too far behind (cleanup)
    traffic = traffic.filter(car => car.y < bestCar.y + 500);
    
    // Generate new traffic ahead if needed
    if (bestCar.y < nextTrafficSpawn + 400) {
        generateTrafficGroup();
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);

    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    )

    carCanvas.height = window.innerHeight;
    networkCanvas.height =window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i = 0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"green");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");

    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true)

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    
    // Only continue animation if not paused
    if (!isPaused) {
        animationId = requestAnimationFrame(animate);
    }
}

// Pause/Resume function
function toggleTraining() {
    isPaused = !isPaused;
    
    if (!isPaused) {
        // Resume animation
        animationId = requestAnimationFrame(animate);
    }
    
    // Update button text (optional)
    const button = document.querySelector('button[onclick="toggleTraining()"]');
    if (button) {
        button.textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
    }
}

// Update car count function
function updateCarCount() {
    const dropdown = document.getElementById('carCount');
    const newN = parseInt(dropdown.value);
    
    // Only update if value actually changed
    if (newN !== N) {
        N = newN;
        
        // Find current best car position to maintain progress
        const currentBestY = bestCar ? bestCar.y : 0;
        
        // Regenerate cars with new count at current best position
        cars = generateCars(N);
        
        // Position new cars at the current best position (not starting line)
        for (let i = 0; i < cars.length; i++) {
            cars[i].y = currentBestY;
        }
        
        bestCar = cars[0];
        
        // If we had a saved brain, apply it to the new cars
        if (localStorage.getItem("bestBrain")) {
            for (let i = 0; i < cars.length; i++) {
                cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
                if (i != 0) {
                    NeuralNetwork.mutate(cars[i].brain, 0.2);
                }
            }
        }
        
        console.log(`Updated to ${N} cars at position ${currentBestY}`);
    }
}