# Rubik AI Mobile — iPhone prototype

This is a static, offline-capable web app. It does not call APIs or send cube images anywhere.
It is **not yet a trained neural network or a complete solver**.

## Files
- `index.html` — UI and camera/photo picker
- `app.js` — local color sampling, manual corrections, localStorage
- `sw.js` — offline cache (service worker)
- `manifest.webmanifest`, `icon.svg` — install metadata

## Use on iPhone
A service worker/PWA install requires a secure origin (HTTPS or localhost). To install:
1. Put these static files on a static host such as GitHub Pages once, or use a trusted iPhone local development environment that serves the folder on localhost.
2. Open the HTTPS page in Safari, allow camera access, use Share → Add to Home Screen.
3. Open once while online so the app shell is cached. After that, the app UI and image processing run on-device/offline. No backend/API is used.
4. If using localStorage, avoid clearing Safari website data or the saved scan will be erased.

**Strict no-hosting option:** save/open the files in an iOS code editor that supports local HTML preview, but camera access and PWA offline installation vary by app and iOS permissions. A plain `file://` page may not permit camera access or service workers.

## Current capabilities
- Both camera capture and photo upload
- Six faces, nine sampled cells each
- RGB nearest-prototype color guess
- Manual color correction
- localStorage persistence
- 9-of-each-color count check

## Not implemented yet
- Trained Core ML / TensorFlow Lite neural model
- Perspective correction and robust sticker segmentation
- Legal cube-state validation and Kociemba two-phase solver
- Move-by-move animation

The RGB recognizer is only a baseline heuristic. Calling it a trained AI would be inaccurate. A real model needs a labelled dataset, training/validation, export and on-device testing. A correct solver also needs full cubie-state validation and a tested solver implementation.
