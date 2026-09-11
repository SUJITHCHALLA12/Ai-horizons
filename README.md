# AI Horizons

AI Horizons is a lightweight, browser-based atlas for discovering AI tools and learning about AI + IoT. It presents curated tool collections by capability and includes Firebase-backed sign-in with Google or email/password accounts.

## Features

- Browse AI tools grouped by capability
- Search the tool catalogue
- Open focused tool-detail views with official links
- Ask the built-in AI + IoT guide for project and technology help
- Sign in with Google or email/password through Firebase Authentication
- Store basic signed-in user profiles in Cloud Firestore

## Run locally

This project uses native browser ES modules and Firebase CDN imports, so no package installation is required.

Serve the repository from a local web server (rather than opening `index.html` directly). For example:

```powershell
npx serve .
```

Then open the local address printed by the server.

## Firebase setup

The Firebase web configuration lives in `firebase-config.js`. In the Firebase console for the selected project:

1. Enable **Google** and/or **Email/Password** in Authentication providers.
2. Add the local and production hostnames to Authentication's authorized domains.
3. Create a Cloud Firestore database.
4. Deploy the included Firestore rules:

```powershell
firebase deploy --only firestore:rules
```

To use another Firebase project, replace the values in `firebase-config.js` and update `.firebaserc` as needed.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Application UI, styles, catalogue data, and client interactions |
| `firebase-config.js` | Firebase app initialization and Analytics setup |
| `firebase-auth.js` | Authentication state, Google/email sign-up, and Firestore profile writes |
| `firestore.rules` | Cloud Firestore access rules |
| `firebase.json` | Firebase CLI configuration |

## License

Released under the [MIT License](LICENSE).
