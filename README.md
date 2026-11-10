# Northbank Banking Demo

A front-end banking transfer prototype built with HTML, CSS, and JavaScript. It demonstrates sign-in, beneficiary management, a review and passcode step, a balance display, a receipt, searchable transaction history, profile editing, and demo security settings.

## Run it

1. Open this folder in Visual Studio Code.
2. Open `index.html` in a browser, or use VS Code's Live Server extension and choose **Open with Live Server**.
3. Sign in with the demo account below.

## Demo account

- Email: `jordan@northbank.demo`
- Password: `BankDemo123`
- Transfer passcode: `246810`

## Files

- `index.html` defines the screens, forms, and navigation.
- `styles.css` defines the visual layout, colors, and responsive behavior.
- `app.js` handles demo sign-in, navigation, profile and security settings, form validation, beneficiaries, transfers, receipts, and history.
- `PROJECT-REPORT.md` describes the goals, user flow, design, and limitations.

## Important demo behavior

- Sign-in checks fixed sample credentials in the browser; it is not server authentication.
- `sessionStorage` keeps the demo signed in for the current browser tab session.
- `localStorage` saves the demo balance, beneficiary list, transaction list, profile, updated demo password, and transfer PIN in this browser.
- The initial transfer PIN is `246810`; it is not delivered by SMS or email. You can change the demo PIN in Security settings. Successful transfers show an in-app confirmation and receipt.
- New beneficiary details receive format checks only; the demo cannot verify ownership with a bank. No bank account is contacted and no real money is transferred.
- The profile, PIN, and password settings are browser-only simulations. Browser storage is not appropriate for storing real passwords or sensitive account information.

## Explore and customize

Try the Home, Profile, and Security settings navigation, update the demo profile or PIN, add a sample beneficiary, make a small demo transfer, and search transaction history. Then change a color in `styles.css` or sample content in `app.js`, reload the page, and note what changed. Be prepared to explain the parts you changed and how the demo flow works.