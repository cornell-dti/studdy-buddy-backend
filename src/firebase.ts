import * as firebase from 'firebase-admin';

let app!: firebase.app.App;
let auth!: firebase.auth.Auth;

export function initialize() {
    let cert = null;
    let projectId = process.env.FIREBASE_PROJECT_ID;

    if (process.env.FIREBASE_CREDENTIALS) {
        const keyfile = JSON.parse(process.env.FIREBASE_CREDENTIALS);

        cert = firebase.credential.cert(keyfile);
    }

    if (cert && projectId) {
        app = firebase.initializeApp({
            projectId,
            credential: cert
        });
    } else {
        console.warn('Attempting to initialize firebase without explicit environmental configuration...');
        app = firebase.initializeApp();
    }

    auth = app.auth();
}

export default auth;

export { app as firebaseApp };