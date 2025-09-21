# use-component-media-query 🎯

A lightweight, performant React hook that provides real-time component-level dimensions (like width and height) while intelligently pausing updates for components outside the viewport. Perfect for driving UI logic based on a component's size, not just the viewport's.

## ✨ Features
* 🚀 Performance First: Automatically stops tracking dimensions when the component is off-screen, eliminating unnecessary calculations and boosting your app's performance.

* 📏 Component-Centric: Get the exact width and height of a component, not the window. Think of it as a "JS-based container query".

* 🪶 Lightweight: Extremely small footprint with zero dependencies (uses the native ResizeObserver and IntersectionObserver).

* ⚡ Preload Aware: Configurable preloading to start measuring components just before they enter the viewport for a smoother user experience.

* 🧠 Logic, Not Styles: Designed for situations where you need JavaScript logic based on size, not just CSS styling.

## 📦 Installation

```bash
# npm
npm install use-component-media-query
# yarn
yarn add use-component-media-query
# pnpm
pnpm add use-component-media-query
```

## 🚀 Quick Start

```js
import React from 'react';
import { useComponentMediaQuery } from 'use-component-media-query';

const MyResponsiveComponent = () => {
  // Use the hook
  const { ref, dimension } = useComponentMediaQuery();

  // Apply logic based on the component's width
  const layoutMode = dimension.width > 768 ? 'desktop' : dimension.width > 480 ? 'tablet' : 'mobile';

  return (
    // Attach the ref to the element you want to measure
    <div ref={ref} className="container">
      <h2>My {layoutMode} layout</h2>
      <p>My width is: {dimension.width}px</p>
    </div>
  );
};

export default MyResponsiveComponent;
```

## 📖 API Reference

### `useComponentMediaQuery(options)`

**Parameters**

| Parameter | Type              | Default | Description                                                                                                                                                                                                                                                                                  |
|-----------|-------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `preload` | boolean \| string | true    | Determines when to start observing an off-screen component.  `true` uses a sensible default root margin of "0px 0px 400px 0px".   `false` sets the root margin to "0px". Disabling the preloading  If the it's a string is expecting a margin property syntax to applied on the margin root. |

**Return Value**

The hook returns an object with the following properties:

| Property | Type | Description |
|---|---|---|
| `dimension` | DimensionType `{ width: number, height: number }` | Current width and height of the observed element |
| `ref` | RefCallback `(node: HTMLDivElement \| null) => void` | Callback ref to attach to the element you want to measure |

## 💡 Use Cases

This hook is ideal when you need to change component logic or behavior based on its size:

* Conditional Rendering: Show/hide different child components based on available space.

* Data Manipulation: Load more or less data (e.g., pagination items, list items) depending on the container's width.

* Logic Branching: Change animation variants, chart configurations, or complex JS behavior.

* Integrating Third-Party Libraries: Pass the component's dimensions to a library (e.g., a charting library) that requires a fixed size on initialization.

## ⚠️ Important Notes

* **Not a CSS Replacement:** This hook is not a replacement for CSS Container Queries. If your goal is to change styles (e.g., `font-size`, `flex-direction`, `color`) based on container size, you should always use CSS Container Queries for better performance and smoother visuals.

* **Use for Logic:** This tool is specifically for cases where you need the dimensions in your JavaScript logic, which is something CSS alone cannot provide.

## 🏎️ Performance
This hook is built with performance as a core principle. It combines a `ResizeObserver` to track size changes and an `IntersectionObserver` to automatically disable the `ResizeObserver` when the component is not in the viewport. This prevents your application from doing any layout work for hidden or off-screen components.

## 🔮 Comparison

|            | useComponentMediaQuery | CSS Container Queries | Window Resize Listener |
|------------|------------------------|-----------------------|------------------------|
| Measures   | Specific component     | Specific container    | Browser viewport       |
| Output     | JS Object              | CSS Styles            | JS Event               |
| Best For   | JavaScript logic       | Styling               | Viewport logic         |
| Off-screen | ✅ Paused               | ✅ Native              | ❌ Always active        |


## 🐛 Known Issues & Solutions

### Current Limitation with Preloading

There is currently a known issue where the preloading behavior may not work as expected in certain scenarios. This occurs because the Intersection Observer uses the browser viewport as its default root element. As a result, components that are within the viewport (even if not yet visible in a scrollable container) may be detected as "intersecting" immediately.

## Planned Solution

We're working on implementing a more robust solution that will allow you to specify a custom container element as the intersection root:

```js
// Future API (coming soon)
const containerRef = useRef(null);
const { ref, dimension } = useComponentMediaQuery({
  preload: true,
  containerRef: containerRef // Specify a custom container
});

return (
  <div ref={containerRef} className="scroll-container">
    <div ref={ref} className="measured-element">
      {/* Your content */}
    </div>
  </div>
);
```


