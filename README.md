# Woman-2-Woman
Powered by Holistiq

Static registration site for the Woman 2 Woman event. Open `index.html` directly in a
browser, or serve the folder with any static host (GitHub Pages, Netlify, etc.).

## Wiring up form submissions (Google Sheets)

Responses are posted to a Google Apps Script Web App, which appends each submission as a
row in a Google Sheet.

1. Create a new Google Sheet (this will hold the responses).
2. In the sheet, go to **Extensions > Apps Script**.
3. Delete the placeholder code and paste in the contents of [`apps-script/Code.gs`](apps-script/Code.gs).
4. Click **Deploy > New deployment**, choose type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Deploy, and copy the resulting Web App URL.
6. In [`js/script.js`](js/script.js), replace `SCRIPT_URL` with that URL.

Until `SCRIPT_URL` is set, the form will show a "not configured" error on submit instead of
silently losing responses.
