# BUILD THE MATH TOWER 🏗️

A standalone 3D educational game for Grade 4 students to practise order of operations by building a tower one mathematically correct step at a time.

## Run locally
This project is a static browser game using Three.js from a CDN. Open `index.html` through a local web server (for example, VS Code Live Server).

## Controls
- WASD / arrow keys: move
- Space: jump
- Shift: run
- Drag a step card to a tower slot, or tap a card then a slot
- On touch devices, use the on-screen controls

## Learning rules
1. Parentheses first.
2. Multiplication and division share precedence and are evaluated left to right.
3. Addition and subtraction share precedence and are evaluated left to right.

The game checks the ordered working steps, not only the final answer. Progress is saved in the browser using localStorage.

## Publish with GitHub Pages
In the repository settings, open **Pages**, choose **Deploy from a branch**, select **main** and **/ (root)**, then Save. The game will be available at:
`https://lanadewan5-byte.github.io/build-the-math-tower/`
