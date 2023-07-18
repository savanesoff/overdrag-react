by `Protosus`

# Overdrag-React

[![Github](https://badgen.net/badge/Protosus/overdrag-react?color=purple&icon=github)](https://github.com/savanesoff/overdrag-react)
[![Build Status](https://github.com/savanesoff/overdrag-react/actions/workflows/test.yaml/badge.svg?branch=main&event=push)](https://github.com/savanesoff/overdrag-react/actions/workflows/test.yaml)
[![npm version](https://badge.fury.io/js/overdrag-react.svg)](https://badge.fury.io/js/overdrag-react)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Li](https://badgen.net/badge/savanesoff/LI?color=blue)](https://www.linkedin.com/in/samvel-avanesov)

Overdrag is a library for adding draggable and resizable behavior to DOM elements that respects its parent and is recursive.

## Demo

You can view a live demo [here](https://savanesoff.github.io/overdrag-react/)

[![Validator](https://raw.githubusercontent.com/savanesoff/overdrag-react/main/public/overdrag-demo.gif)](https://savanesoff.github.io/overdrag-react)

## VanillaJS

Want a `VanillaJS` class? Checkout `Overdrag` utility [NPM](https://www.npmjs.com/package/overdrag), and [GH](https://github.com/savanesoff/overdrag)

[![NPM](https://nodei.co/npm/overdrag.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/overdrag)

## Installation

[![NPM](https://nodei.co/npm/overdrag-react.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/overdrag-react/)

To install `overdrag-react`, use p/npm yarn:

- using `npm`

```shell
npm install overdrag-react
```

- using `yarn`

```shell
yarn add overdrag-react
```

- using `pnpm`

```shell
pnpm add overdrag-react
```

## Usage

To use Overdrag, import the Overdrag Rect component:

```JS
import Overdrag from "overdrag-react";
```

### Component

Render component anywhere in you app:

```tsx
function App() {
  return (
    <Overdrag
      /* optional props */
      style={{ backgroundColor: "red" }}
      minContentHeight={100}
      onClick={(overdragInstance) => console.log("clicked", overdragInstance)}
    >
      <p>
        This is a child component of Overdrag. Put here anything you want, just
        like you would do to a `div` or any other React component
      </p>
    </Overdrag>
  );
}
```

### Properties

- **`minContentHeight`** The minimum height of the DOM element (CSS height) in pixels. This prevents resizing smaller than the specified value.

- **`minContentWidth`** The minimum width of the DOM element (CSS width) in pixels. This prevents resizing smaller than the specified value.

- **`maxContentHeight`** The max height of the DOM element (CSS height) in pixels. This prevents resizing bigger than the specified value.

- **`maxContentWidth`** The max width of the DOM element (CSS width) in pixels. This prevents resizing bigger than the specified value.

- **`snapThreshold`** The distance to the edge of the relative parent element (top, left, bottom, right) when the element should snap to it.

- **`controlsThreshold`** The distance to the edge of the element (top, left, bottom, right) when the element should show resize cursor and activate control points.

- **`clickDetectionThreshold`** The threshold distance to detect a click event. If you've started dragging the element, mouse up event will not trigger `click` event.

- **`stack`** (default: `false`): If true, an `Overdrag` parent element that has a recursively embedded `Overdrag` elements as a child will retain `over` state while the child is active. Else, the parent element will be set to `out` state (inactive)

### Events

The available events are:

- **`down`**: Triggered when the mouse button is pressed down on the element.

- **`up`**: Triggered when the mouse button is released if pressed while element was "engaged".

- **`click`**: Triggered when a click action is detected.

- **`drag`**: Triggered during dragging, on every drag motion with a mouse move.

- **`dragStart`**: Triggered when the mouse button is pressed down on the element, but not control points.

- **`dragEnd`**: Triggered when the mouse button is released after dragging.

- **`over`**: Triggered when the mouse is over the element passed the control point sensors.

- **`out`**: Triggered when the mouse moves out of the visible box of element excluding control point sensors.

- **`controlsActive`**: Triggered when any control point is activated (edge of element) within control sensor area.

- **`controlsInactive`**: Triggered when the control points are deactivated.

- **`controlRightUpdate`**: Triggered when the right control point position is updated.

- **`controlLeftUpdate`**: Triggered when the left control point position is updated.

- **`controlTopUpdate`**: Triggered when the top control point position is updated.

- **`controlBottomUpdate`**: Triggered when the bottom control point position is updated.

- **`resize`**: Triggered during resizing on every mouse move (if size change detected).

- **`resizeStart`**: Triggered when resizing starts on mouse down.

- **`resizeEnd`**: Triggered when resizing ends on mouse up.

- **`update`**: Triggered before any other event is dispatched.

## Description

Controlled element is bound by its parent bounds and requires parent element to have `position:relative` CSS property for the controlled element absolute position be relative to its `offsetParent`.

> **_NOTE_**
> Absolute position of the target element is enforced during construction of class instance, so don't feel bad if you've forgotten to assign it.

### Resizing

While hovering near and/or over the edge of controlled element (left, right, top, bottom), that includes border sizes, a corresponding sensor will be activated. Pressing mouse down and initiating a drag will move corresponding edge of the element, thereby resizing it.

> **_NOTE_**  
> Two adjacent sensors can be activated at once, ex: top-right, in which case dragging mouse around will resize both: width and height of controlled element.

Maximum size is determined by the size of the offset parent, however, a margin values of controlled element are respected, so if controlled element has a right-margin value of `10` the max width of the element will be no larger than `offsetParent.width - 10px`

> **_NOTE_**  
> See `maxContentWidth/Height` values

### Dragging

While hovering over the element content (passed the control sensors), pressing mouse `down` and proceeding to move it will engage `drag` motion and element will follow the motion of a mouse while respecting its initial offset. Max top/bottom/right/left position of the element will be constrained by its offsetParent bounds.

### Snapping

In both cases, `drag` and `resize` the edge of controlled element will snap to the edge of `offsetParent` if controlled element distance to `offsetParent` edge (including margins) is equal to or less than `snapThreshold` value.

### Sensors

Sensitivity of control points is determined by the `controlsThreshold` value, where control point is activated if mouse cursor distance to the control point of element is equal to of less than `controlsThreshold` value.

> **_NOTE_**
> This allows for a better control precision of when control points become active, preventing edge hunting to activate controls

## Element Action Attributes ⚙️

During interaction with element, its attributes are set according to the current mode and user actions. Use this to set various CSS properties accordingly to reflect type of interaction.

### Example

Say you want your element to change background color while its engaged, here is how you do it:

```CSS
#element-id[data-overdrag-over]{
    /* change style while element is engaged */
    background-color: red;
}
```

### Available Action attributes

- **`data-overdrag-controls`**: Set while any control point is active with a value of active control type (`left`, `right`, `top`, `bottom`), Ex: `data-overdrag-controls="right-left"`

- **`data-overdrag-over`**: Set while mouse is over the element pass the control sensors

- **`data-overdrag-down`**: Set while mouse is down (preceded by `over` conditions).

- **`data-overdrag-dragging`**: Set while element is dragged.

- **`data-overdrag-drag-mode`**: Set when entering drag mode.

- **`data-overdrag-resizing`**: Set while element is being resized, if resizing is detected

- **`data-overdrag-resize-mode`**: Set when entering resize mode

## Cursor 👆

At every point of interaction with a controlled element, mouse cursor style is set according to the mouse position relative to element control points and being over the content area.

> **_NOTE_**  
> Mouse cursor is set as an element pointer style which should not interfere with a global cursor state. Moreover, the child DOM overrides are performed by default.

- <span style="cursor:w-resize">**`w-resize`**</span>: Set while LEFT control sensor is activated (including sensitivity area)

- <span style="cursor:e-resize">**`e-resize`**:</span> Set while RIGHT control sensor is activated (including sensitivity area).

- <span style="cursor:n-resize">**`n-resize`**</span>: Set while TOP control sensor is activated (including sensitivity area).

- <span style="cursor:s-resize">**`s-resize`**:</span> Set while BOTTOM control sensor is activated (including sensitivity area).

- <span style="cursor:nw-resize">**`nw-resize`**:</span> Set while TOP and LEFT control sensors are activated (including sensitivity area).

- <span style="cursor:ne-resize">**`ne-resize`**</span>: Set while TOP and RIGHT control sensors are activated (including sensitivity area).

- <span style="cursor:sw-resize">**`sw-resize`**</span>: Set while BOTTOM and LEFT control sensors are activated (including sensitivity area).

- <span style="cursor:se-resize">**`se-resize`**</span>: Set while BOTTOM and RIGHT control sensors are activated (including sensitivity area).

- <span style="cursor:grab">**`grab`**</span>: Set while mouse is over the element pass the control sensors.

- <span style="cursor:pointer">**`default`**:</span> Set while no interactions are detected.

# PS

[![Li](https://badgen.net/badge/Hit%20me%20up%20on/LI?color=blue)](https://www.linkedin.com/in/samvel-avanesov)

Enjoy! 🎉🎉🎉
