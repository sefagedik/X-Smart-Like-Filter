# X Smart Like Filter

A lightweight JavaScript console script that scans posts on X (formerly Twitter), skips promoted posts and posts containing media, and automatically clicks the Like button on eligible posts. It supports configurable limits, scrolling, basic progress tracking, and **automatic stopping when a recognized warning appears**.

> [!WARNING]
> X may prohibit automated liking and browser-based automation under its platform rules. Using this script may result in restrictions or suspension. This repository is provided for educational and code-review purposes. **Warning detection is best-effort and does not guarantee account safety or compliance.**

## Features

- **Automatic likes:** Clicks the Like button on matching posts.
- **Promoted-post filtering:** Skips posts labeled `Reklam`, `Promoted`, or `Sponsored`.
- **Media filtering:** Skips posts containing detected photos, videos, GIFs, and embedded media cards.
- **Duplicate prevention:** Uses a temporary set of post IDs to avoid processing the same post twice in one run.
- **Already-liked handling:** Posts without an available Like button (including already-liked posts) are skipped.
- **Configurable delay:** Waits 3 seconds after each Like by default.
- **Automatic scrolling:** Scrolls down 700 pixels between scans by default.
- **Like limit:** Stops after 100 likes by default.
- **Empty-round limit:** Stops after 20 scans with no newly discovered posts by default.
- **Warning-triggered stop:** Watches visible X alerts, alert dialogs, toast notifications, and modals for recognized rate-limit, suspicious-activity, restriction, or CAPTCHA warnings and stops when a match is detected.
- **Manual stop:** Set `window.likeBot.stop = true` in the browser console.
- **Live console output:** Prints like counts and a final summary of likes, ads, media, skipped posts, and stop reason.
- **No external dependencies:** Runs as a self-contained browser console snippet.

## Configuration

Modify the `SETTINGS` object at the top of `x-smart-like-filter.js`:

```js
const SETTINGS = {
    delay: 3000,          // Milliseconds between likes
    scrollDistance: 700, // Pixels per scroll
    maxLikes: 100,       // Maximum likes per run
    maxEmptyRounds: 20   // Maximum consecutive scans without new posts
};
```

## How to Run

1. Open X in a desktop browser and navigate to a post feed.
2. Open Developer Tools (usually `F12`) and select **Console**.
3. Copy the contents of [`x-smart-like-filter.js`](./x-smart-like-filter.js) into the console and run it.
4. Review messages and the final summary in the console.

**Stop manually:**

```js
window.likeBot.stop = true;
```

**Inspect the current status:**

```js
console.table(window.likeBot);
```

## How Warning Detection Works

The script monitors visible elements matching these selectors:

```css
[role="alert"], [role="alertdialog"], [data-testid="toast"], [aria-modal="true"]
```

It checks their displayed text against warning phrases in English and Turkish. When a match is found, it sets `window.likeBot.stop` to `true`, records the warning in `reason`, and stops processing. The warning observer is disconnected when the script finishes.

Warning detection is **not comprehensive**. Changes to X's interface, different warning wording, or warnings that do not appear in the selected elements may prevent detection. The script also cannot undo actions already taken.

## Limitations

- Depends on X's current page markup and `data-testid` attributes, which may change without notice.
- Advertising labels, media types, and warnings may not always be detected.
- The Like counter reflects clicks attempted, not confirmation that the server accepted each like.
- Post IDs and progress are stored in memory for the current run only.
- The script does not provide an official X integration or API.
- The source is written in English; some Turkish patterns remain intentionally to recognize Turkish-language labels and warnings.

## Files

```text
x-smart-like-filter/
├── x-smart-like-filter.js
├── README.md
├── LICENSE
└── .gitignore
```

## License

Developed by Sefa Gedik
Sefa Gedik is the developer and maintainer of X Smart Like Filter.
- Developer: Sefa Gedik
- Official Website: www.sefagedik.com.tr
- GitHub: github.com/sefagedik
- Project Repository: X Smart Like Filter
Copyright
Copyright © 2026 Sefa Gedik.
This project is released under the MIT License. See the LICENSE file for details.
