import React, {Component} from 'react';
import {Navbar,Nav,NavLink,NavbarBrand,Button} from 'reactstrap';
import NewsPage from '../News';
import Login from '../Login';
import Registration from '../Registration';

import {
    BrowserRouter as Router,
    Link,
    Route

} from 'react-router-dom';
import { app } from 'firebase';


//Do this later.
class Navigationbar extends Component{

    constructor(props){
        super(props);


        //Feedback is basically contact us but there will be footer for contact
        //us too.
        this.menuItems = [,"Login","Register"];

    }




    render(){
return(
    <Router>
    <div>

<Navbar className="NavBar">
    <Nav>
    <NavLink tag = {Link} to="/"> News </NavLink>
    {this.menuItems.map(menuItem => {

        return <NavLink  className="NavBarButton" tag={Link} to={"/"+menuItem}> {menuItem} </NavLink>
    })}
    </Nav>
            </Navbar>


    {/*exact means default*/}
   
    <Route exact  path="/" component={NewsPage}/>

    {/*These buttons will be hidden if logged in*/}
    <div>
        <Button tag={Link} to="/Login"> Login </Button>
        <Button tag={Link} to="/Register"> Register </Button>
    </div>
        <Route path="/Login"  render={(props) => {
        return <div><Login/>
        <div style={{margin:"auto",width:"50%"}}><Button tag={Link}  style={{marginTop:"1em"}} className="Button" to="/Register">Register</Button></div>
        </div>}
        }/>

        <Route path="/Register" render={(props) => {
        return <div><Registration/>
        <div style={{margin:"auto",width:"50%"}}><Button tag={Link}  style={{marginTop:"1em"}} className="Button" to="/Login">Login</Button></div>
        </div>}
        }/>




    </div>
</Router>
        


    );
}


}

export default Navigationbar;