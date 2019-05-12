import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyD9v4dutqedNRE6e5UHA8Vb2y6gONAR0TI",
  authDomain: "finances-dec3e.firebaseapp.com",
  databaseURL: "https://finances-dec3e.firebaseio.com",
  projectId: "finances-dec3e",
  storageBucket: "finances-dec3e.appspot.com",
  messagingSenderId: "355802560264",
  appId: "1:355802560264:web:7619ba46f000a3f5"
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    // Firebase APIs
    this.auth = app.auth();
    this.db = app.firestore();
    //console.log(app.firestore.Timestamp.fromDate(new Date()));
    this.firestore = app.firestore;
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

  // *** Message API ***

  message = uid => this.db.doc(`messages/${uid}`);

  messages = () => this.db.collection("messages");

  // *** Message API ***

  userTransactions = uid => this.db.doc(`transactions/${uid}`);

  transactions = () => this.db.collection("transactions");
}

export default Firebase;
