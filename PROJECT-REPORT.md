# Northbank Banking Management System — Project Report

## 1. Project overview

Northbank is a browser-based prototype for an online banking transfer experience. It models a customer signing in, choosing a beneficiary, entering a payment amount, checking the details, authorizing the transfer with a demo passcode, and reviewing the result.

## 2. Problem and goal

A transfer interface should make the recipient and amount clear before a customer confirms. This prototype focuses on a short, understandable sequence and gives feedback when required information is missing or an amount exceeds the displayed demo balance.

## 3. Main features

- Demo sign-in and sign-out.
- Sample account balance and account number.
- Add, list, and remove beneficiaries with basic account and IFSC format checks.
- Transfer review before authorization.
- Demo passcode step and transfer validation.
- Confirmation receipt with a reference number.
- Searchable transaction history and recent activity.
- Home navigation plus dedicated beneficiary, profile, and security screens.
- Profile name and phone updates.
- Changeable demo transfer PIN and sign-in password with current-value and confirmation checks.
- Browser storage to retain demo balances, recipients, and transfers across reloads.
- Responsive layout for smaller screens.

## 4. Example user flow

1. Sign in using the demo credentials shown on the login screen.
2. Open **Beneficiaries** and add a sample recipient, or select one already listed.
3. Return to **Money transfer**, choose the recipient, enter an amount and optional note, then select **Review transfer**.
4. Check the recipient, bank, amount, and fee before selecting **Confirm transfer**.
5. Enter the current demo transfer PIN (initially `246810`; it can be changed in Security settings).
6. Review the receipt and see the updated balance and transaction in history.


## 5. Match to the project brief

| Brief requirement | Where the prototype demonstrates it |
| --- | --- |
| Customer logs in with valid credentials and sees banking services | Demo sign-in checks the sample email and password, then opens the account dashboard. |
| Customer chooses an existing beneficiary or adds a new one | The transfer form offers saved sample recipients and a new-recipient form; the Beneficiaries page can also add or remove saved recipients. |
| System validates beneficiary details | New recipient details are checked for required fields, an 8–18 digit account number, and an 11-character IFSC format before review. This is format validation only; no bank confirms that the account exists or belongs to the named person. |
| System checks the amount against available funds | The transfer is rejected if the amount is invalid or higher than the current demo balance. |
| Customer reviews and confirms using authentication | The transfer has a review step and requires the fixed demo passcode `246810`. An incorrect code leaves the transfer incomplete. |
| Transfer is processed, referenced, and added to history | A successful demo transfer deducts the local sample balance, creates a reference number, and adds a completed transaction to recent activity and searchable history. |
| Customer receives a confirmation | The site displays an in-app confirmation and receipt. It does not send email or SMS. |
## 6. Design decisions

The interface uses a light background, restrained blue accents, readable system fonts, and small line icons. Transfer steps are separated into details, review, and confirmation to make the action easier to follow. Inline error messages explain what needs correction.

## 7. Technical structure

- `index.html` contains the page structure and input forms.
- `styles.css` contains colors, spacing, typography, layouts, and responsive rules.
- `app.js` manages UI updates, validation, navigation, and browser storage.

The prototype uses `sessionStorage` for the temporary signed-in state and `localStorage` for demo transactions, beneficiaries, balance, profile, PIN, and password. No server or database is used.

## 8. Limitations and next steps

This is an educational front-end demonstration. The login and security settings are simulated in browser code, the reference number is generated in the browser, and transfers only update local demo data. Passwords and PINs are stored in browser storage for this prototype and are not protected like real banking credentials. It does not connect to a bank or move money. A real deployment would need server-side identity checks, secure storage, authorization controls, audit logging, and an approved payment integration.

Possible extensions for a later version include a backend with a database, stronger authentication, account-specific transfer limits, and tests for input validation and transaction state changes.

## 9. Reflection prompts

Before presenting, write down: Which screen did you customize? What happens when the transfer amount is above the balance? Where are the demo transactions saved? Which parts would have to move to a server for a real banking service?