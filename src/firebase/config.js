import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

const firebaseConfig = {
	apiKey: 'AIzaSyBMB6C-_B61S1wd1RYAr34jomKZpvq16eA',
	authDomain: 'better-react-messenger.firebaseapp.com',
	projectId: 'better-react-messenger',
	storageBucket: 'better-react-messenger.appspot.com',
	messagingSenderId: '381225253186',
	appId: '1:381225253186:web:43a9fb8cce6b202f31f0db',
}

// Firebase init
firebase.initializeApp(firebaseConfig)

// Services init
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

const projectGoogle = new firebase.auth.GoogleAuthProvider()
const projectGitHub = new firebase.auth.GithubAuthProvider()

projectGoogle.setCustomParameters({ prompt: 'select_account' })
// Timestamp
const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, timestamp, projectStorage, projectGoogle, projectGitHub }
