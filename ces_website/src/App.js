import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navigationbar from './site_constants/navbar';
import Login from './Login';
import Registration from './Registration';
import NewsPage from './News';
import {Button} from 'reactstrap';
import UserProfile from './UserProfile'

import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter,
  Redirect

} from 'react-router-dom';
import PrintingPage from './3DPrinterPage';
import Calendar from './Calendar';

class App extends Component {


  constructor(props){
    super(props);

    const cachedUser = localStorage.getItem("user");

    this.state= {
      user: JSON.parse(cachedUser),
    };


    this.changeLogin = this.changeLogin.bind(this);
  }
  //Logged in stuff should actually be in here,
  //Navbar is doing alot, I should rename it to header
  //Need to rework design of this to be better code-wise later


  //Not what i'm looking for here, but remember reading not needing to re-render so this is something to add later.
  shouldComponentUpdate(nextProps, nextState){

   
    return true;
  }
  changeLogin(user){

    console.log(localStorage.getItem("userChanged"))
    
    
    this.setState({
      user:user,
    });
    console.log(user);


    if (user != null){    
      localStorage.setItem("user",JSON.stringify(user));
    }
    else{

      localStorage.removeItem("user");
    //  console.log(this.props.match);
     // this.props.history.push("/Login");
    }
  }

  

  render() {
    return (
      
      <header>
        {/*Banner will go here*/}
        <Router>
          <div>
        <Navigationbar userInfo={this.state.user}/>
        
        <span hidden={this.state.user == null} className="LoggedInOptions">

          <p> Signed in as {(this.state.user != null)? this .state.user.email : ""} </p>
          <Button  onClick={
            () => {this.changeLogin(null);}

          }> Logout </Button>

          <Button tag={Link} to="/UserProfile">Profile
          </Button>

          }

        </span>
        <Route exact  path="/" render={(props)=>{
          
          if (localStorage.getItem("userChanged") == true){

            window.location.reload();
          }
          
          return <NewsPage/>}}/>

          {/*Thing is fine for these, but if go to calendar should also now be logged in, but can't jsut reload all the time.*/}
        <Route path="/Login"  render={(props) => {
          if (localStorage.getItem("user") !== null){
            window.location.reload();
          }
        if (this.state.user == null) {return <div><Login changeLogin={this.changeLogin} {...props}/>
        <div style={{margin:"auto",width:"50%"}}><Button tag={Link}  style={{marginTop:"1em"}} className="Button" to="/Register">Don't have an account? Register</Button></div>
        </div>}
        else {
          
          return  <Redirect to="/"/>
        }
        }}/>

        <Route path="/Register" render={(props) => {

          //CHecking cache cause state is per session, would have to refresh to sync it up.
          if (localStorage.getItem("user") !== null){
            window.location.reload();
          }
         if (this.state.user == null) {return <div><Registration changeLogin={this.changeLogin} {...props}/>
        <div style={{margin:"auto",width:"50%"}}><Button tag={Link}  style={{marginTop:"1em"}} className="Button" to="/Login">Already have an account? Login instead</Button></div>
        </div>}
        else{
          //A little slight delay on the redirect, unfortunately but wroks lol.
          return <Redirect to={"/"} />
        }

      }}/>

        <Route path="/Calendar" component={Calendar}/>

        <Route path="/3DPrinting" render={(props => {

            if (this.state.user == null){
              return <Redirect to={{pathname:"/Login",state:{prompt:"Order a 3D Print",back:"/3DPrinting"}}} {...props} />
            }
            else return <PrintingPage userInfo={this.state.user} {...props}/>
        })}/>

        <Route path="/UserProfile" render = {(props)=>{
          if (this.state.user != null)
            return <UserProfile userInfo={this.state.user}/>
          else
            return <Redirect to ={{pathname:"/Login", state:{prompt:"View your profile",back:"/UserProfile"}}} {...props}/>
        }}/>

        

        </div>
        </Router>

      </header>



    );
  }
}

export default App;
