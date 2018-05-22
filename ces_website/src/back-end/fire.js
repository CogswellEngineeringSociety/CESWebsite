import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyADrVRU9CSIktkXnvQXcXFeOPicmYtC91M",
    authDomain: "ceswebsite-cf841.firebaseapp.com",
    databaseURL: "https://ceswebsite-cf841.firebaseio.com",
    projectId: "ceswebsite-cf841",
    storageBucket: "ceswebsite-cf841.appspot.com",
    messagingSenderId: "612020639792"
  };
 
  const fire = firebase.initializeApp(config);
  
  //Will add later when update domain, I know it works.
  export const url = "https://middleman2.herokuapp.com"
  export default fire;

 
  //Contemplated having node back-end and the node code will have ref of firebase
  //and do everything but I'm cutting the middleman. Will add if need
  //for now will just have front-end use firebase api directly.