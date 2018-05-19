import React, {Component} from 'react';
import {Navbar,Nav,NavLink,NavbarBrand,Button} from 'reactstrap';


import {Link} from 'react-router-dom';
import { app } from 'firebase';
import User from '../User';

//Rename this later cause it has nav bar and then some lol.
//I could actually rework this a bit better, have the face of nav bar here
//but then have all the actual routes in parent cause it just needs to be above it in heirarchy
//that way instead of components being child of nav bar, which is wierd it will be children of main app.
class Navigationbar extends Component{

    constructor(props){
        super(props);


        //Feedback is basically contact us but there will be footer for contact
        //us too.
        this.menuItems = [];
        this.state = {

          //  loggedIn:(localStorage.getItem("user") == "")? false : true
          userInfo:null
        };
    }





    render(){

        //Router is in parent
return(

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
   

    {/*Doesn't get updated, would I need to use context instead?*/}
    {/*These buttons will be hidden if logged in*/}
    <div hidden = {this.props.userInfo != null}>
        <Button tag={Link} to="/Login"> Login </Button>
        <Button tag={Link} to="/Register"> Register </Button>
    </div>

    
    

    </div>
        


    );
}


}

export default Navigationbar;