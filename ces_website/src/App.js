import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navigationbar from './site_constants/navbar';
import Login from './Login';
import Registration from './Registration';
import NewsPage from './News';
import {Button} from 'reactstrap';

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
      user: JSON.parse(cachedUser) 
    };


    this.changeLogin = this.changeLogin.bind(this);
  }
  //Logged in stuff should actually be in here,
  //Navbar is doing alot, I should rename it to header
  //Need to rework design of this to be better code-wise later


  changeLogin(user){
    
    this.setState({
      user:user
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

          <p> Signed in as {(this.state.user != null)? this.state.user.email : ""} </p>
          <Button  onClick={
            () => {this.changeLogin(null);}

          }> Logout </Button>

        </span>
        <Route exact  path="/" component={NewsPage}/>

        <Route path="/Login"  render={(props) => {
        return <div><Login changeLogin={this.changeLogin} {...props}/>
        <div style={{margin:"auto",width:"50%"}}><Button tag={Link}  style={{marginTop:"1em"}} className="Button" to="/Register">Register</Button></div>
        </div>}
        }/>

        <Route path="/Register" render={(props) => {
        return <div><Registration changeLogin={this.changeLogin}/>
        <div style={{margin:"auto",width:"50%"}}><Button tag={Link}  style={{marginTop:"1em"}} className="Button" to="/Login">Login</Button></div>
        </div>}
        }/>

        <Route path="/Calendar" component={Calendar}/>

        <Route path="/3DPrinting" render={(props => {

            if (this.state.user == null){
              return <Redirect to={{pathname:"/Login",state:{prompt:"Order a 3D Print",back:"/3DPrinting"}}} {...props} />
            }
            else return <PrintingPage userInfo={this.state.user} {...props}/>
        })}/>

        

        </div>
        </Router>

      </header>



    );
  }
}

export default App;
