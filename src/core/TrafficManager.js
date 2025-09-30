class TrafficManager {
    constructor(road) {
        this.road = road;
        this.traffic = [];
        this.trafficSpawnDistance = 250; // Distance between traffic groups
        this.nextTrafficSpawn = -100;
        this.laneCount = 3; // Road has 3 lanes
        
        // Generate initial traffic
        for (let i = 0; i < 15; i++) {
            this.generateTrafficGroup();
        }
    }
    
    generateTrafficGroup() {
        const maxCarsPerGroup = this.laneCount - 1; // Always leave at least 1 lane open
        
        // Randomly decide how many cars in this group (1 or 2, never all 3 lanes)
        const carsInThisGroup = Math.floor(Math.random() * maxCarsPerGroup) + 1;
        const availableLanes = [0, 1, 2];
        
        // Randomly select which lanes to block (always leaving at least one open)
        for (let i = 0; i < carsInThisGroup; i++) {
            const laneIndex = availableLanes.splice(Math.floor(Math.random() * availableLanes.length), 1)[0];
            this.traffic.push(new Car(this.road.getLaneCenter(laneIndex), this.nextTrafficSpawn, 30, 50, "TRAFFIC", 2));
        }
        
        this.nextTrafficSpawn -= this.trafficSpawnDistance;
    }
    
    update(bestCarY) {
        // Update existing traffic
        for (let i = 0; i < this.traffic.length; i++) {
            this.traffic[i].update(this.road.borders, []);
        }
        
        // Remove traffic that's too far behind (cleanup)
        this.traffic = this.traffic.filter(car => car.y < bestCarY + 500);
        
        // Generate new traffic ahead if needed
        if (bestCarY < this.nextTrafficSpawn + 400) {
            this.generateTrafficGroup();
        }
    }
    
    draw(ctx) {
        for (let i = 0; i < this.traffic.length; i++) {
            this.traffic[i].draw(ctx, "green");
        }
    }
    
    getTraffic() {
        return this.traffic;
    }
}
