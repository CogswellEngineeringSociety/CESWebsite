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
  //Url to server app to send post requests to for functions not executed on client side. This app was deleted
  export const url = "https://middleman2.herokuapp.com"
  export default fire;

