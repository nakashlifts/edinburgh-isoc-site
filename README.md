# ISocEd — University of Edinburgh Islamic Society Website

A complete, production-ready, multi-page static website for the University of Edinburgh Islamic Society (“ISocEd”). It is built with pure HTML, handwritten CSS and vanilla JavaScript — no frameworks, no build step and no external dependencies beyond Google Fonts and the public [AlAdhan](https://aladhan.com/prayer-times-api) prayer-times API. The site features a warm, premium, “Notion-meets-mosque” aesthetic with a salaam top bar, sticky responsive navigation, six fully-written pages (Home, About, Events, Prayer & Spaces, Planner, Contact), live Edinburgh prayer times with next-prayer highlighting, scroll-reveal animations, and a no-backend contact form that opens the visitor’s email app.

## Project structure

```
.
├── index.html        # Home
├── about.html        # About + committee
├── events.html       # Events calendar 2026–27
├── prayer.html       # Live prayer times, spaces, Qibla, halal food
├── planner.html      # The Muslim Student Planner
├── contact.html      # Contact info + mailto form
├── assets/
│   ├── style.css     # One stylesheet for all pages
│   ├── script.js     # All behaviour (nav, reveal, year, form, prayer times)
│   ├── logo-mark.png # Small crescent mark (nav / favicon)
│   └── logo-full.png # Full logo with text (homepage hero)
├── .nojekyll         # Tells GitHub Pages to serve assets as-is
└── README.md
```

## Run locally

The site works by simply opening the files — no build step required.

- **Quickest:** open `index.html` in your browser.
- **Recommended (so `fetch` for prayer times works smoothly):** serve the folder over HTTP, e.g.
  ```bash
  python3 -m http.server 8000
  # then visit http://localhost:8000
  ```

## Deploy to GitHub Pages

1. Create a new GitHub repository and push these files to it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ISocEd website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose the **main** branch and the **/ (root)** folder, then **Save**.
5. Wait a minute, then visit `https://<your-username>.github.io/<your-repo>/`.

The included `.nojekyll` file ensures GitHub Pages serves the `assets/` folder exactly as-is. All internal links use relative paths, so the site works correctly on GitHub Pages project sites.

## Customising

- **Logo:** replace `assets/logo-mark.png` and `assets/logo-full.png` with your own. If either is missing, an inline gold SVG crescent is shown as a fallback so nothing breaks.
- **Colours & fonts:** edit the CSS variables at the top of `assets/style.css`.
- **Prayer times:** the widget calls the AlAdhan API for Edinburgh, United Kingdom (calculation method 3 — Muslim World League). Edit the endpoint in `assets/script.js` to change city or method.
- **Event dates:** exact dates are confirmed each term; update the date chips in `events.html` as needed.

## Credits

Built for the University of Edinburgh Islamic Society. Affiliated with EUSA & FOSIS Scotland.
