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
├── src/
│   ├── core/           # Core simulation components
│   ├── ml/             # Neural networks and ML algorithms
│   └── utils/          # Mathematical utilities
├── assets/             # Stylesheets and static files
├── docs/               # Technical documentation
└── index.html          # Run this file to start!
```

## 🚀 Getting Started

1. **Clone this repository**
   ```bash
   git clone https://github.com/mohakapoor/Synapse-Drive.git
   cd Synapse-Drive
   ```

2. **Run the simulation**
   - Simply open `index.html` in your web browser
   - No installation or build process required!

3. **Controls**
   - Use **WASD** or **arrow keys** to control the blue car
   - Avoid colliding with green traffic cars and road boundaries
   - Watch the neural network visualization on the right panel

## 🧠 What You'll See

- **Blue Car**: Your manually controlled vehicle
- **Green Cars**: AI traffic for obstacle avoidance training  
- **Yellow Rays**: Sensor system detecting obstacles
- **Right Panel**: Real-time neural network visualization
- **Save/Load**: Buttons to save the best performing AI models

The simulation uses neural networks to learn autonomous driving through trial and error!

## 🎯 Current ML Features

- ✅ **Neural Network Brain**: Cars learn to drive autonomously
- ✅ **Genetic Algorithm**: Population evolves over generations  
- ✅ **Real-time Visualization**: Watch the neural network think
- ✅ **Save/Load Models**: Preserve the best performing drivers
- ✅ **Sensor-based Learning**: 10-ray collision detection system

## 📚 Documentation

For technical details, architecture, and development notes, see [`docs/design.md`](docs/design.md)

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
