class GenerationManager {
    constructor(road, N = 100) {
        this.road = road;
        this.N = N;
        this.cars = [];
        this.bestCar = null;
        this.generation = 1;
        this.generationStartTime = Date.now();
        this.maxGenerationTime = 30000; // 30 seconds max per generation
        
        this.generateCars();
    }
    
    generateCars() {
        const cars = [];
        const startY = this.bestCar ? this.bestCar.y : 100; // Start at current best position
        
        for (let i = 0; i < this.N; i++) {
            const car = new Car(this.road.getLaneCenter(1), startY, 30, 50, "AI");
            cars.push(car);
        }
        
        // Apply saved brain if exists
        if (localStorage.getItem("bestBrain")) {
            for (let i = 0; i < cars.length; i++) {
                cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
                if (i != 0) {
                    NeuralNetwork.mutate(cars[i].brain, 0.2);
                }
            }
        }
        
        this.cars = cars;
        this.bestCar = cars[0];
        this.generationStartTime = Date.now();
        
        console.log(`Generation ${this.generation}: ${this.N} cars spawned at position ${startY}`);
    }
    
    update(traffic) {
        // Update all cars
        for (let i = 0; i < this.cars.length; i++) {
            this.cars[i].update(this.road.borders, traffic);
        }
        
        // Find best car (furthest along) - make sure we have cars first
        if (this.cars.length > 0) {
            this.bestCar = this.cars.find(c => c.y == Math.min(...this.cars.map(c => c.y)));
            
            // Fallback if bestCar is null
            if (!this.bestCar) {
                this.bestCar = this.cars[0];
            }
        }
        
        // Only check for new generation if we have multiple cars
        if (this.N > 1) {
            const aliveCars = this.cars.filter(car => !car.damaged).length;
            const generationTime = Date.now() - this.generationStartTime;
            
            // Start new generation if:
            // 1. Less than 10% of cars are alive, OR
            // 2. Generation has been running for too long
            if (aliveCars <= Math.max(1, Math.floor(this.N / 10)) || generationTime > this.maxGenerationTime) {
                console.log(`Starting new generation: ${aliveCars} cars alive, ${generationTime}ms elapsed`);
                this.nextGeneration();
            }
        }
    }
    
    nextGeneration() {
        // Save the best brain
        if (this.bestCar && this.bestCar.brain) {
            localStorage.setItem("bestBrain", JSON.stringify(this.bestCar.brain));
        }
        
        this.generation++;
        this.generateCars();
        
        // Update UI
        this.updateStats();
    }
    
    updateStats() {
        if (!this.bestCar) return; // Safety check
        
        const aliveCars = this.cars.filter(car => !car.damaged).length;
        const bestDistance = Math.abs(Math.floor(this.bestCar.y));
        
        // Update HTML elements
        const genElement = document.getElementById('generation');
        const distElement = document.getElementById('bestDistance');
        const aliveElement = document.getElementById('carsAlive');
        
        if (genElement) genElement.textContent = this.generation;
        if (distElement) distElement.textContent = bestDistance;
        if (aliveElement) aliveElement.textContent = aliveCars;
    }
    
    draw(ctx) {
        // Draw all cars with transparency
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < this.cars.length; i++) {
            this.cars[i].draw(ctx, "blue");
        }
        
        // Draw best car prominently
        ctx.globalAlpha = 1;
        if (this.bestCar) {
            this.bestCar.draw(ctx, "blue", true);
        }
    }
    
    updateCarCount(newN) {
        if (newN !== this.N) {
            this.N = newN;
            this.generateCars();
            console.log(`Updated to ${this.N} cars`);
        }
    }
    
    getBestCar() {
        return this.bestCar;
    }
    
    getCars() {
        return this.cars;
    }
    
    getGeneration() {
        return this.generation;
    }
}
