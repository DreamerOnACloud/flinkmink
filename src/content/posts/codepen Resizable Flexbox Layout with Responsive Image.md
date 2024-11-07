---
author: "Dreamer On A Cloud"
title: "Codepen Resizable Flexbox Layout with Responsive Image"
date: "07/11/2024"
image: "./images/Codepen Resizable Flexbox Layout with Responsive Image.png"
description: "This code exercise demonstrates how to build a flexible, resizable layout using CSS flexbox. The goal is to have two side-by-side elements that adjust to the parent container's size, with one element displaying text and the other displaying an image. The image is set to fill its container entirely without stretching, using `object-fit: cover`."
tags: ["codepen", "CSS", "flexbox", "layout"]
---

## Objective

Learn how to create a responsive layout using CSS flexbox, where two child elements split the available space. One child contains text, and the other contains an image that fills its container without distortion.

## Description

This code exercise demonstrates how to build a flexible, resizable layout using CSS flexbox. The goal is to have two side-by-side elements that adjust to the parent container's size, with one element displaying text and the other displaying an image. The image is set to fill its container entirely without stretching, using `object-fit: cover`.

## Prerequisites

Basic understanding of HTML structure and CSS concepts, particularly flexbox layout properties and image handling with CSS.

## Code Breakdown

Break the code into clear, digestible parts. Use the following subheadings and structure as a guide for organizing your code and explanations. The content provided here is just an example—replace it with the specifics of your topic.

### 1. Setting Up the Main Structure

*Purpose*: Create the main container and structure the layout.

```html
<div class="parent">
  <div class="child child-1">Child 1</div>
  <div class="child child-2">
    <img src="https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Resizing Image">
  </div>
</div>
```

### 2. Styling the Parent Container

*Purpose*: Make the main container resizable and set up flexbox properties.

```css
.parent {
  display: flex;
  width: 80%;
  height: 50vh; /* Set a height for demonstration */
  background-color: #e4f6ff;
  resize: both; /* Enables resizing in both directions */
  overflow: auto; /* Ensures content stays visible within resized area */

  padding: 20px;
  gap: 20px;
}
```

### 3. Configuring Child Elements

*Purpose*: Set each child to occupy 50% of the container's width and 100% of its height.

```css
.child {
  flex: 1; /* Each child takes up equal space horizontally */
  height: 100%; /* Each child fills the parent's height */
  display: flex;
  align-items: center;
  justify-content: center;
}

.child-1 {
  background-color: #a0c4ff;
}

.child-2 {
  background-color: #bde0fe;
  position: relative;
}
```

### 4. Adding a Responsive Image in Child-2

*Purpose*: Add an image that fills `child-2` without stretching or distortion, using `object-fit: cover` to maintain its aspect ratio.

```html
<div class="child child-2">
  <img src="https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Resizing Image">
</div>
```

```css
.child-2 img {
  width: 100%; /* Image will scale down with the container */
  height: 100%; /* Image will scale down to fit the height */
  object-fit: cover; /* Prevents stretching */
}
```

## Final Result

### The HTML:
```html
<!-- Complete HTML Structure -->
<div class="parent">
  <div class="child child-1">Child 1</div>
  <div class="child child-2">
    <img src="https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Resizing Image">
  </div>
</div>
```

### The CSS:

```css
<!-- Complete CSS Styles -->
<style>
.parent {
  display: flex;
  width: 80%;
  height: 50vh;
  background-color: #e4f6ff;
  resize: both;
  overflow: auto;
  padding: 20px;
  gap: 20px;
}

.child {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.child-1 {
  background-color: #a0c4ff;
}

.child-2 {
  background-color: #bde0fe;
  position: relative;
}

.child-2 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
```

## Testing & Experimentation

Throw the code on codepen (or other) and play around.

- Try changing the `height` and `width` of `.parent` to see how the layout adapts.
- Experiment with different `object-fit` values like `contain` or `scale-down` in `.child-2 img` to see how the image resizing changes.
- Adjust the `gap` between `.child` elements to observe how spacing impacts the layout.

## Key Takeaways

- **Flexbox Layout**: Use `display: flex` to create responsive, side-by-side layouts.
- **Resizable Container**: `resize: both` allows the container to be resizable in both directions.
- **Responsive Images**: `object-fit: cover` allows an image to fill its container without distortion, cropping as necessary to maintain aspect ratio.