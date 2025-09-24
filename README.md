# Synapse-Drive

A neural network-powered autonomous vehicle simulation built with JavaScript. Features advanced sensor systems, real-time collision detection, and machine learning capabilities for intelligent navigation. This project explores the intersection of artificial intelligence and autonomous driving technology.

## 🚗 Features

- **Realistic Car Physics**: Acceleration, friction, and steering mechanics
- **Sensor System**: 10-ray collision detection system with 150px range
- **Traffic Simulation**: AI-controlled traffic cars for interaction testing
- **Collision Detection**: Real-time damage assessment using polygon intersection
- **Manual Controls**: WASD/Arrow key controls for player car
- **Visual Feedback**: Color-coded cars and sensor ray visualization

## 🎮 Controls

- **W / ↑**: Accelerate forward
- **S / ↓**: Reverse
- **A / ←**: Turn left
- **D / →**: Turn right

## 🛠 Project Structure

```
├── index.html      # Main HTML file
├── main.js         # Main game loop and canvas setup
├── car.js          # Car class with physics and rendering
├── controls.js     # Keyboard input handling
├── sensor.js       # Collision detection sensor system
├── road.js         # Road rendering and boundaries
├── utils.js        # Utility functions for intersections
└── style.css       # Styling for the canvas
```

## 🚀 Getting Started

1. Clone this repository
2. Open `index.html` in your web browser
3. Use WASD or arrow keys to control the blue car
4. Avoid colliding with the green traffic cars and road boundaries

## 🧠 How It Works

### Car Physics
- Each car has position, velocity, acceleration, and rotation
- Friction automatically slows down cars when not accelerating
- Realistic turning mechanics that depend on current speed

### Sensor System
- Cars equipped with a 10-ray sensor array spread 90° in front
- Rays detect collisions with road boundaries and other vehicles
- Sensor readings update in real-time for autonomous navigation

### Collision Detection
- Uses polygon-based collision detection
- Cars turn gray when damaged
- Real-time intersection calculations between car polygons

## 🎯 Upcoming ML Features

- [ ] Neural network brain for autonomous decision making
- [ ] Genetic algorithm training system
- [ ] Reinforcement learning environment
- [ ] Multiple AI car generations
- [ ] Performance evolution tracking
- [ ] Save/load trained neural networks
- [ ] Real-time learning visualization

## 🔧 Technologies Used

- **HTML5 Canvas** for rendering
- **Vanilla JavaScript** for game logic
- **2D Physics** for realistic car movement
- **Ray Casting** for collision detection

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

---

*Synapse-Drive bridges the gap between neural networks and autonomous vehicles, creating an intelligent learning environment for AI-powered navigation.*
