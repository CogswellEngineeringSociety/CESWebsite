import React, {Component} from 'react';
import {Navbar,NavItem,NavbarBrand} from 'reactstrap';
import {
    BrowserRouter as Router,
    Link,
    Route

} from 'react-router-dom';


//Do this later.
class Navbar extends Component{

    constructor(props){
        super(props);


        //Feedback is basically contact us but there will be footer for contact
        //us too.
        this.menuItems = ["News","Calendar","3DPrinter","Feedback"];

    }




    render(){

        <Navbar className="NavBar">
        <Router>

            {this.menuItems.map(menuItem => {

                <NavItem> <Link to={"/"+menuItem}> {menuItem} </Link> </NavItem>
            })}

            {/*exact means default*/}
            <Route exact path={"/"} component={App}/>
            <Route path="/News" component = {News}/>
            <Route path="/Calendar" component = {Calendar}/>
            <Route path="/Feedback" component ={Feedback}/>

        </Router>
        </Navbar>
        


    }


}

export default Component