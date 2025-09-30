# Synapse-Drive Technical Design Document

## 📋 Overview

Synapse-Drive is a neural network-powered autonomous vehicle simulation built with JavaScript. This document provides comprehensive technical details for understanding and expanding the ML capabilities.

---

## 🏗️ Current Architecture

### System Flow
```
index.html → src/main.js → [src/core/*] → [src/ml/*] → Physics Loop → Rendering
```

### File Structure
```
├── src/
│   ├── core/
│   │   ├── Car.js          # Vehicle physics and behavior
│   │   ├── Controls.js     # Input handling (keyboard/AI)
│   │   ├── Road.js         # Environment and boundaries
│   │   └── Sensor.js       # Collision detection sensors
│   ├── ml/
│   │   ├── NeuralNetwork.js # Neural network implementation
│   │   └── Visualizer.js    # ML visualization system
│   ├── utils/
│   │   └── Utils.js        # Mathematical utilities
│   └── main.js             # Game loop, initialization
├── assets/
│   └── style.css           # Visual styling
├── docs/
│   └── design.md           # Technical documentation
└── index.html              # Entry point, canvas setup
```

---

## 🚗 Core Components Deep Dive

### 1. Car Class (`src/core/Car.js`)

**Constructor Parameters:**
- `x, y`: Position coordinates
- `width, height`: Car dimensions (30x50 pixels)
- `controlType`: "KEYS" (player) or "TRAFFIC" (AI)
- `maxSpeed`: Maximum velocity (default: 3 units/frame)

**Physics Properties:**
```javascript
speed: 0,              // Current velocity
acceleration: 0.2,     // Acceleration rate per frame
maxSpeed: 3,           // Maximum forward speed
friction: 0.05,        // Deceleration when not accelerating
angle: 0,              // Rotation in radians
damaged: false         // Collision state
```

**Key Methods:**
- `update(roadBorders, traffic)`: Main physics loop
- `#move()`: Handles acceleration, friction, steering
- `#createPolygon()`: Generates collision boundaries
- `#assessDamage()`: Collision detection with environment
- `draw(ctx, color)`: Renders car and sensors

**Physics Calculations:**
- **Steering**: `angle += 0.03 * flip` (where flip = speed direction)
- **Movement**: `x -= sin(angle) * speed`, `y -= cos(angle) * speed`
- **Friction**: Applied when not accelerating to gradually stop

### 2. Sensor Class (`src/core/Sensor.js`)

**Configuration:**
```javascript
rayCount: 10,           // Number of detection rays
rayLength: 150,         // Detection range in pixels
raySpread: Math.PI/2    // 90-degree spread angle
```

**Ray Casting Algorithm:**
1. Calculate ray angles: `lerp(raySpread/2, -raySpread/2, i/(rayCount-1)) + car.angle`
2. Cast rays from car position to calculated endpoints
3. Find intersections with road borders and traffic polygons
4. Return closest intersection per ray

**Output Data Structure:**
```javascript
readings[i] = {
    x: intersectionX,      // Collision point X
    y: intersectionY,      // Collision point Y
    offset: distance       // Distance from car (0-1, where 1 = max range)
}
// or null if no collision detected
```

### 3. Controls Class (`src/core/Controls.js`)

**Control States:**
```javascript
forward: boolean,   // W, ↑
left: boolean,      // A, ←
right: boolean,     // D, →
reverse: boolean    // S, ↓
```

**Control Types:**
- **"KEYS"**: Keyboard input with event listeners
- **"TRAFFIC"**: Simple AI (forward = true always)
- **"AI"**: *Implemented - Neural network controlled via src/ml/NeuralNetwork.js*

### 4. Road Class (`src/core/Road.js`)

**Properties:**
```javascript
x: centerX,           // Road center position
width: roadWidth,     // Total road width
laneCount: 3,         // Number of lanes
left: x - width/2,    // Left boundary
right: x + width/2    // Right boundary
```

**Lane System:**
- `getLaneCenter(index)`: Returns X coordinate for lane center
- Lane 0 = leftmost, Lane 2 = rightmost
- Used for AI car placement and navigation

**Collision Boundaries:**
```javascript
borders = [
    [topLeft, bottomLeft],     // Left wall
    [topRight, bottomRight]    // Right wall
]
```

### 5. Utils (`src/utils/Utils.js`)

**Mathematical Functions:**

**Linear Interpolation:**
```javascript
lerp(A, B, t) = A + (B - A) * t
// t = 0 returns A, t = 1 returns B
```

**Line Intersection:**
```javascript
getIntersection(A, B, C, D)
// Returns intersection point of line AB with line CD
// Uses parametric line equations and cross products
```

**Polygon Collision:**
```javascript
polysIntersect(poly1, poly2)
// Checks if any edge of poly1 intersects any edge of poly2
// Returns true/false for collision detection
```

---

## 🧠 Machine Learning Integration

### Current ML-Ready Components

**1. Input Layer (Sensor Data):**
```javascript
// 10 sensor readings, each 0-1 (1 = no obstacle, 0 = immediate collision)
inputs = [
    sensor.readings[0]?.offset || 1,  // Ray 0 distance
    sensor.readings[1]?.offset || 1,  // Ray 1 distance
    // ... 8 more rays
    sensor.readings[9]?.offset || 1   // Ray 9 distance
]
```

**2. Output Layer (Control Commands):**
```javascript
// 4 control outputs, each 0-1 (threshold > 0.5 = active)
outputs = [
    forward_activation,   // Accelerate
    left_activation,      // Turn left
    right_activation,     // Turn right
    reverse_activation    // Reverse
]
```

**3. Fitness Function:**
```javascript
fitness = distanceTraveled * survivalBonus - collisionPenalty
// distanceTraveled: Y-coordinate progress (negative = forward)
// survivalBonus: Time alive without crashing
// collisionPenalty: Large negative value for crashes
```

### Planned Neural Network Architecture

**Network Structure:**
```
Input Layer:    10 neurons (sensor readings)
Hidden Layer 1: 16 neurons (ReLU activation)
Hidden Layer 2: 8 neurons (ReLU activation)
Output Layer:   4 neurons (Sigmoid activation)
```

**Training Parameters:**
```javascript
populationSize: 100,        // Number of cars per generation
mutationRate: 0.1,          // Genetic algorithm mutation rate
crossoverRate: 0.8,         // Breeding probability
elitismCount: 10,           // Top performers to keep
maxGenerations: 1000,       // Training iterations
fitnessThreshold: 5000      // Success criteria
```

---

## 🎯 Implementation Roadmap

### Phase 1: Neural Network Foundation ✅
- [x] Create `src/ml/NeuralNetwork.js` class
- [x] Implement forward propagation
- [x] Add weight/bias initialization
- [x] Create network serialization (save/load)

### Phase 2: Genetic Algorithm Training ✅
- [x] Create genetic algorithm system
- [x] Implement population management
- [x] Add mutation and crossover functions
- [x] Create fitness evaluation system

### Phase 3: Training Environment
- [ ] Multi-car simulation (100+ cars)
- [ ] Performance metrics dashboard
- [ ] Real-time evolution visualization
- [ ] Training data export/import

### Phase 4: Advanced Features
- [ ] Reinforcement learning integration
- [ ] Dynamic traffic patterns
- [ ] Multi-objective optimization
- [ ] Transfer learning capabilities

---

## 📊 Performance Considerations

### Current Performance:
- **Frame Rate**: 60 FPS target
- **Cars**: 1 player + variable traffic
- **Sensors**: 10 rays × 60 FPS = 600 calculations/second
- **Physics**: Real-time collision detection

### ML Performance Targets:
- **Population**: 100-500 cars simultaneously
- **Generations**: 1000+ training cycles
- **Network Size**: ~500 parameters per car
- **Training Time**: 10-30 minutes per full evolution

### Optimization Strategies:
- Web Workers for neural network calculations
- Canvas optimization for multi-car rendering
- Spatial partitioning for collision detection
- GPU acceleration via WebGL (future)

---

## 🔧 Configuration Parameters

### Physics Constants
```javascript
const PHYSICS = {
    ACCELERATION: 0.2,      // Car acceleration rate
    MAX_SPEED: 3,           // Maximum velocity
    FRICTION: 0.05,         // Deceleration rate
    TURN_SPEED: 0.03,       // Steering sensitivity
    CAR_WIDTH: 30,          // Car dimensions
    CAR_HEIGHT: 50
};
```

### Sensor Configuration
```javascript
const SENSOR = {
    RAY_COUNT: 10,          // Number of detection rays
    RAY_LENGTH: 150,        // Detection range
    RAY_SPREAD: Math.PI/2,  // Detection angle (90°)
    UPDATE_FREQUENCY: 60    // Updates per second
};
```

### ML Hyperparameters
```javascript
const ML_CONFIG = {
    POPULATION_SIZE: 100,
    MUTATION_RATE: 0.1,
    CROSSOVER_RATE: 0.8,
    ELITISM_COUNT: 10,
    HIDDEN_LAYERS: [16, 8],
    ACTIVATION: 'relu',
    OUTPUT_ACTIVATION: 'sigmoid'
};
```

### Training Environment
```javascript
const TRAINING = {
    TRAFFIC_DENSITY: 0.3,   // Cars per lane per 1000 units
    ROAD_LENGTH: 10000,     // Training track length
    MAX_TIME: 30000,        // Max frames per attempt
    SUCCESS_DISTANCE: 5000, // Distance for "success"
    COLLISION_PENALTY: -1000 // Fitness penalty for crashes
};
```

---

## 🚀 Expansion Points

### 1. Enhanced Sensors
- **Radar**: 360-degree detection
- **Lidar**: Point cloud simulation
- **Camera**: Image-based ML input
- **GPS**: Position awareness

### 2. Advanced Physics
- **Tire friction**: Surface-dependent grip
- **Weather**: Rain/snow effects
- **Damage**: Progressive car degradation
- **Fuel**: Resource management

### 3. Complex Environments
- **Multi-lane highways**: Lane changing
- **Intersections**: Traffic light navigation
- **Parking**: Precision maneuvering
- **City streets**: Complex navigation

### 4. AI Techniques
- **Deep Q-Learning**: Reinforcement learning
- **NEAT**: Evolving network topology
- **Imitation Learning**: Human demonstration
- **Multi-agent**: Car-to-car communication

---

## 📝 Development Notes

### Code Quality Standards
- ES6+ JavaScript features
- Modular class-based architecture
- Comprehensive error handling
- Performance monitoring hooks

### Testing Strategy
- Unit tests for physics calculations
- Integration tests for ML components
- Performance benchmarks
- Cross-browser compatibility

### Documentation Requirements
- Inline code comments
- API documentation
- Training guides
- Performance analysis

---

*This document serves as the technical foundation for Synapse-Drive development. Update as new features are implemented.*
