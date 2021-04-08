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
      <header>
      <h1>⚛️🔥💬</h1>
        <SingOut/>
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
  const dummy= React.useRef()

  const messageref = firestore.collection('mensajes')
  const query = messageref.orderBy('createAt').limit(25)
  const [value, setvalue]= React.useState('')
  const [mensajes] = useCollectionData(query, {idField: 'id'})

  const Enviar= async(e)=>{
    e.preventDefault();
    const {uid, photoURL}= auth.currentUser
    
    await messageref.add({
      text: value,
      createAt: firebase.firestore.FieldValue.serverTimestamp(), uid,photoURL
    })
    setvalue("")
    dummy.current.scrollIntoView({behavior:'smooth'})
  }

  return(<>
    <main>
      {mensajes && mensajes.map(msg=><ChatMessage key={msg.id} mensajes={msg}/>)}
      <div ref={dummy}></div>
    </main>

    <form onSubmit={Enviar}>
      <input value={value} onChange={(e)=>setvalue(e.target.value)}/>
      <button type='submit'>Enviar</button>
    </form>
    </>
  )
}

function ChatMessage(props){
  const {text, uid, photoURL} =props.mensajes
  const messageClass =uid=== auth.currentUser.uid? 'sent': 'received'
  return(
    <div className={`mensajes ${messageClass}`}>
      <img src={photoURL} alt="f"/>
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
    <button className='google' onClick={Sign}>Sign In</button>
  )
}

export default App;
