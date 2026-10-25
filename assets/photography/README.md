# Photography Collection · The Antechamber

Drop your high-resolution photographs, 35mm film scans, or architectural studies directly in this directory:

- Recommended formats: `.jpg`, `.jpeg`, `.webp`, `.png`
- Naming convention: e.g. `plate-01.jpg`, `plate-02.jpg`, `plate-03.jpg`, etc.
- To display a photo in the Antechamber gallery, update the `<article class="photo-plate">` in `antechamber/index.html` with:
  ```html
  <div class="photo-viewfinder">
    <img src="{{ '/assets/photography/plate-01.jpg' | relative_url }}" alt="Photo title" loading="lazy">
  </div>
  ```
