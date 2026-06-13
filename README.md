# Edinburgh ISoc Website

A static multi-page website for the University of Edinburgh Islamic Society. No build step, no dependencies — just HTML & CSS.

## Pages
- `index.html` — Home
- `about.html` — About & committee
- `events.html` — Events calendar 2026–27
- `prayer.html` — Prayer spaces, Qibla, halal food
- `planner.html` — The Muslim Student Planner
- `contact.html` — Contact form & socials

## Preview locally
Open `index.html` in any browser, or run a local server:
```bash
cd isoc-site
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Publish free on GitHub Pages
1. Create a new repository on GitHub (e.g. `edinburgh-isoc-site`).
2. Upload **the contents** of this folder to the repo (so `index.html` is at the repo root).
   ```bash
   git init
   git add .
   git commit -m "Initial ISoc website"
   git branch -M main
   git remote add origin https://github.com/USERNAME/edinburgh-isoc-site.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment**.
   - Source: **Deploy from a branch**
   - Branch: **main** / **/ (root)** → Save.
4. Wait ~1 minute. Your site goes live at:
   `https://USERNAME.github.io/edinburgh-isoc-site/`

### Custom domain (optional)
If the society gets a domain, add it under **Settings → Pages → Custom domain**, then create a `CNAME` DNS record pointing to `USERNAME.github.io`.

## Things to update before going live
- Replace the Instagram/email placeholders if they change (`@EdinburghISoc`, `isoc@eusa.ed.ac.uk`).
- Add real confirmed event dates in `events.html`.
- Add committee names/photos in `about.html` if desired.
- Add a live prayer-time widget on `prayer.html` if wanted (e.g. an Aladhan API embed).

The `.nojekyll` file is included so GitHub Pages serves all files as-is.
