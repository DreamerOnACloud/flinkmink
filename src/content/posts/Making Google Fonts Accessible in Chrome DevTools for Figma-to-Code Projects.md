---
author: "Dreamer On A Cloud"
title: "Making Google Fonts Accessible in Chrome DevTools for Figma-to-Code Projects"
date: "07/11/2024"
image: "./images/Making Google Fonts Accessible in Chrome DevTools for Figma-to-Code Projects.png"
description: "This code exercise demonstrates how to build a flexible, resizable layout using CSS flexbox. The goal is to have two side-by-side elements that adjust to the parent container's size, with one element displaying text and the other displaying an image. The image is set to fill its container entirely without stretching, using `object-fit: cover`."
tags: ["Web Development", "Google Fonts", "Figma to Code", "DevTools", "UI Design"]
---

## The Story
I want to reproduce my Figma designs in code (codepen here). But I noticed that the font family types provided on dev tools (F12) are VERY limited.

Google Fonts are a popular choice and free for reuse. 

Will installing those on my Windows machine make them available for use in Google Chrome dev tools? And can we even install them locally? Yes, and yes.

Let’s dive in:

## How-to

### 1. Download All Google Fonts

- **Google Fonts Repository on GitHub**: Google Fonts provides a GitHub repository with all their fonts. Here’s how to download it:
    1. Go to the [Google Fonts GitHub Repository](https://github.com/google/fonts).
    2. Click on the green **Code** button and select **Download ZIP**.
    3. This will download a ZIP file containing all the Google Fonts in `.ttf` and `.otf` formats (mind you the file is BIG!, at about 1.1 GB).

### 2. Extract the Fonts

- After downloading, extract the ZIP file to a folder on your computer. You’ll now have a folder with subfolders for each font family.

### 3. Install All Fonts on Windows

- To install all fonts at once:
    1. Open the folder containing the extracted fonts.
    2. Select all font files (`.ttf` and `.otf`) by pressing **Ctrl + A**.
    3. Right-click on the selected fonts and choose **Install** or **Install for all users**.
    4. Windows will process the installation; this may take a few minutes as there are many fonts.

**Note**: If you don’t want to install every single font, you can manually select specific fonts or font families to install instead.

### **4. Locate the `.ttf` Files**:

- Open the extracted folder and navigate to the main directory where all fonts are organized (usually in folders like `ofl` or `ufl`).
- Use the search function in File Explorer to find all `.ttf` files by typing `.ttf` in the search bar. This will display all `.ttf` font files across the subfolders.

### **5. Install Fonts by Copying to Windows Fonts Folder**:

- Select all `.ttf` files from the search results (press **Ctrl + A** to select all).
- Copy the selected files.
- Open **C:\Windows\Fonts** in File Explorer and paste the copied `.ttf` files directly into this folder.
- Windows will automatically start installing each font, making them available system-wide.

### **6. Verify Installation**:

- To confirm that all fonts were installed, check the **C:\Windows\Fonts** folder or open any application (like Chrome DevTools or Word) to see if the fonts are available.