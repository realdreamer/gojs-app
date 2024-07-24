# GoJS Application

This application is built using Vite, React, and GoJS, with pnpm as the package manager.

Live Demo: [GoJS Application](https://gojs-app.vercel.app/)

## Installation

To install the dependencies, run the following command:

```bash
pnpm install
```

## Running the App
To start the development server, run:

```bash
pnpm dev
```

## Building the App
To create a production build, run:
```bash
pnpm build
```

## Libraries Used:
- [Zustand](https://github.com/pmndrs/zustand) for state management.
- [React Select](https://react-select.com/home) for select box.
- [react-window](https://github.com/bvaughn/react-window) for virtualization to render large lists efficiently.

### Areas for Improvement
1. Simplify the Diagram Component: The Diagram component's code could be refactored to improve readability and maintainability.
2. Sync/Persist Diagram State: Consider synchronizing and persisting the diagram state with the model.
3. Improve UX: In some cases, shape colors are not visible due to the background color. This could be improved by changing the shape color based on the background color.
3. Add Tests: Implement tests to ensure the reliability and correctness of the application.
