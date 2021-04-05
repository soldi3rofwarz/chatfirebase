import React from 'react'
import './App.css';
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyBICLMxpajuwwlla3otdh5CZifcKyDtBjg",
    authDomain: "chatfirebase-dce6e.firebaseapp.com",
    projectId: "chatfirebase-dce6e",
    storageBucket: "chatfirebase-dce6e.appspot.com",
    messagingSenderId: "73957269640",
    appId: "1:73957269640:web:343fd1a56d93e4dfcc3f3d",
    measurementId: "G-SQ75EG5SS1"
})

const auth= firebase.auth()
const firestore = firebase.firestore()

function App() {

  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header className="App-header">
       
      </header>
      <section>
        {user? <ChatRoom/>: <SignIn/>}
      </section>
    </div>
  );
}

function SingOut(){
  return auth.currentUser && (
    <button onClick={()=> auth.SingOut()}>salir</button>
  )
}

function ChatRoom(){
  const messageref = firestore.collection('mensajes')
  const query = messageref.orderBy('createAt').limit(25)

  const [mensajes] = useCollectionData(query, {idField: 'id'})

  return(<>
    <div>
      {mensajes && mensajes.map(msg=><ChatMessage key={msg.id} mensajes={msg}/>)}
    </div>

    <form>
      
    </form>
    </>
  )
}

function ChatMessage(props){
  const {text, uid} =props.mensajes
  const messageClass =uid=== auth.currentUser.uid? 'sent': 'received'
  return(
    <div className={`mensajes ${messageClass}`}>
      <img src={photoURL} />
    <p>{text}</p>
    </div>
  )
}

function SignIn(){
  const Sign =()=>{
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }
  return(
    <button onClick={Sign}>Sign In</button>
  )
}

export default App;
