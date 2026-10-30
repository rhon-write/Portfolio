MYPORTFOLIO — STATIC HTML/CSS/JAVASCRIPT VERSION
================================================

This version does not use Laravel, PHP, Composer, or a database.

FILES
-----
index.html       Main portfolio page
css/style.css    Design and responsive layout
js/script.js     Three.js 3D animation and interactions

HOW TO RUN
----------
1. Extract this ZIP into a folder, for example:
   C:\xampp\htdocs\myportfolio-html

2. Open the folder in Visual Studio Code.

3. Run it:
   - Recommended: install the "Live Server" extension in VS Code.
   - Right-click index.html and choose "Open with Live Server".
   - Or, if you have XAMPP installed, put the folder in htdocs and open:
     http://localhost/myportfolio-html/

   The Three.js module may not work when you open index.html directly using
   file://. Use Live Server or localhost instead.

CUSTOMIZE YOUR PORTFOLIO
------------------------
1. Open index.html.
2. Replace the sample introduction with your own details.
3. Replace the sample project cards with your actual projects.
4. Replace your.email@example.com with your real email address.
5. Replace the GitHub and LinkedIn links with your own profiles.
6. Adjust colors and layout in css/style.css.

NOTES
-----
- The 3D orb uses Three.js from a CDN.
- Scroll animations use GSAP from a CDN.
- An internet connection is required to load the CDN libraries and Google Fonts.
- The contact button opens the visitor's email app. A working server-side contact
  form would require a backend or a third-party form service.
