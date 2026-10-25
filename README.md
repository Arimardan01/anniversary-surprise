# 💕 Anniversary Website — Setup Guide

## Folder Structure

```
web/
├── index.html       ← Main HTML (open this in your browser)
├── style.css        ← All styles
├── script.js        ← All logic — edit questions/answers/message here
├── photos/
│   ├── 1.jpg        ← Add your photos here
│   ├── 2.jpg
│   ├── 3.jpg
│   └── 4.jpg
└── stickers/        ← Optional custom sticker images
```

## 📸 Adding Photos

1. Put 4 photos in the `photos/` folder named `1.jpg`, `2.jpg`, `3.jpg`, `4.jpg`
2. They'll appear as polaroids that slide in one by one
3. Tap/click any photo to enlarge it

## ✏️ Editing Content

Open **`script.js`** in any text editor:

- **Questions & Answers**: Edit the `QUESTIONS` array at the top
- **Final message**: Edit the `MESSAGE_LINES` array
- **Photo captions**: Edit the `PHOTOS` array
- **Polaroid tilts**: Edit `PHOTO_TILTS` (degrees, can be negative)

## 🚀 How to Open

Simply **double-click `index.html`** — no server needed, no build step.

> For photos to load correctly, you may need to open via a local server
> if your browser blocks local file requests. Use VS Code Live Server,
> or run: `npx serve .` in this folder.

## 🌸 Characters

- **BUBU** — pink bear with a pink bow (the girlfriend)
- **DUDU** — blue bear with a blue scarf (the boyfriend)
- They bob, blink, and cheer when you get an answer right
- On the final page, they hug with a heart between them

## 💕 Features

- One-letter-at-a-time answer input with auto-focus and backspace navigation
- Gentle shake + feedback on wrong answers
- Heart burst animation on correct answers
- Floating hearts in the background on all screens
- Heartbeat pulse on the title
- Final message revealed line-by-line with stagger
- Polaroid photo gallery with tilt, fade-in, and lightbox
- Fully mobile-first, works on phones and desktop
