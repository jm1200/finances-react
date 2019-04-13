import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAGJovUlsq1L05Ipt9xlY23F9mwyo3ldPc",
  authDomain: "website-boilerplate.firebaseapp.com",
  databaseURL: "https://website-boilerplate.firebaseio.com",
  projectId: "website-boilerplate",
  storageBucket: "website-boilerplate.appspot.com",
  messagingSenderId: "853851661443"
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    // Firebase APIs
    this.auth = app.auth();
    this.db = app.firestore();
  }

  onAuthUserListener = (next, fallback) => {
    return this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then(doc => {
            let dbUser;
            if (doc.exists) {
              dbUser = doc.data();
              // default empty roles
              if (!dbUser.roles) {
                dbUser.roles = [];
              }

              authUser = {
                uid: authUser.uid,
                email: authUser.email,
                emailVerified: authUser.emailVerified,
                providerData: authUser.providerData,
                ...dbUser
              };

              next(authUser);
            } else {
              console.log("Doc doesn't exist");
            }
          });
      } else {
        fallback();
      }
    });
  };

  //   Auth API

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // Users API

  user = uid => this.db.doc(`users/${uid}`);

  users = () => this.db.collection("users");
}

export default Firebase;
