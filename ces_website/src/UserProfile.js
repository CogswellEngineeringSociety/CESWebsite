import React, {Component} from 'react';
import fire,{url} from './back-end/fire';
import {ListGroup, ListGroupItem, ListGroupItemHeading, Button, Popover,PopoverBody,PopoverHeader} from 'reactstrap';
import {Link} from 'react-router-dom';
import ModelInfoBlock from './ModelInfoBlock';
import queryString from 'query-string';

export default class UserProfile extends Component{


    constructor(props){

        super(props);
        this.state = {

            //Public Information
            major:"",
            year:"",
            concentration:"",
            github:"",
            linkedin:"",

            orderedPrints: [],
            visitorOwnProfile : false,
            error:""
        }

        this.refund = this.refund.bind(this);
        console.log("hello");
    }

    componentWillMount(){
    

        console.log(this.props.location);
        //Prob add username to this for this comparison or make it use UID instead.
        const user = queryString.parse(this.props.location.search).user;

        console.log("visiting profile of " + user);
        console.log("Logged in as " + this.props.userInfo.uid);
        if (user == this.props.userInfo.uid){
            this.setState({
                visitorOwnProfile : true
            });

            this.pullPrints();
        }

        //this.pullProfileInfo();
    }

    //This will get the rest of the information from user of profile that is considered public.
    //In database will change this so there will be Public parent and private parent under users.
    pullProfileInfo(user){

        const dbRef = fire.database().ref("Users/"+user+"/public");

        dbRef.on('value',snapshot => {

            //Will update this later to redirect to 404.
            if (!snapshot.exists()) return;

            const publicInfo = snapshot.val();
            this.setState({
                major : publicInfo.major,
                year : publicInfo.year,
                concentration : publicInfo.concentration,
                github : publicInfo.github,
                linkedin : publicInfo.linkedin
            })
        })
    }

    pullPrints(){

        //This will only show if query was also same.
        const databaseRef = fire.database().ref("QueuedModels/"+this.props.userInfo.uid);

        //Need to test this when have internet
        const pulledPrints = []

        databaseRef.on('value',snapshot =>{
           
            if (!snapshot.exists()) return;

            const orders = snapshot.val();

            Object.keys(orders).forEach((key) => {
               var newObj = orders[key];
               newObj['name'] = key;
               pulledPrints.push(newObj);
            })
            this.setState({
                orderedPrints : pulledPrints
            })
            
        });

    }

   

    refund(event){
        //If the thing they clicked on to refund is still in queue
        //then allow refund.
        //They have access to read in queue if they match the uID. I need to set the rules on firebase first.
        
        const toRemove = event.target.name;
        
        /* Removing from Database*/
        //Removing client side like this will depend on authorization they've provided.
        const databaseRef = fire.datebase.ref("QueuedModels/"+this.props.userInfo.email+"/"+toRemove);
        databaseRef.remove()
        .then(res => {

            //Once it's been removed then add to credits.
            //And remove from storage too. Cause Atomicity must be kept. If this failed and still existed in database
            //it should also still exist in storage for consistency.
            this.removeFromStorage(toRemove)
            .catch(err =>{
                //Set the error and add the item back to keep consistency.                
                this.setState({
                    error:err
                });
                databaseRef.push();
            })

        })
        .catch(err =>{

            //Failing to remove could only mean that it's no longer in queue.
            //This means the print has started, so they cannot cancel anymore.(They can still get refund and we will then keep it)
            //Prompt will show up here in a modal probably and notify them that it's already started printing, if you'd like to still refund
            //we will keep the printed model, would you like to continue?
        })
        //Then this needs to update the credits.
        //This will be another callback given by root app to updateUserInfo.

    }

    removeFromStorage = async(toRemove) =>{

        fetch(url+"/RemoveFromQueue",{

            method:"POST",
            body:{
                userEmail:this.userInfo.email,
                fileName:toRemove
            }
        })
        //Could add then to only update their list here, but if looking at on phone and on somewhere else, should auto update
        //Also if put in printer, will be auto removed, so it needs to be updated every frame regardless.
        .catch(err => {

            console.log(err);
            
            throw new Error("Failed to remove item. Please try again.");

        });
    }

    

    render(){

        return (
            //Will show all user information and models they ordered to print
            <div>
                <div className = "profileHeader">
                                <p> Major: {this.state.major} </p>
                                <p> Year : {this.state.year} </p>
                                <p> Concentration : {this.state.concentration}</p>
                                <div id="socialMedia">
                                {/*Will switch to image later*/}
                                <a href = {this.state.linkedin}> LinkedIn </a>
                                <a href = {this.state.github}> Github </a>
                                </div>

                                <div className="editProfile" hidden = {!this.state.visitorOwnProfile}>
                                    <p> Your Credits: { this.props.userInfo.credits} </p>                                                                
                                    <Link to="/ChangePassword"> Change Password </Link>
                                    {/*Either link to different page or open profile field here? This links back to UserProfile, they can go directly to Update Profile through link
                                    just gotta be logged in*/}
                                    <Link to="/UpdateProfile"> Update Profile </Link>
                                </div>
                    
                </div>

                <ListGroup hidden = {!this.state.visitorOwnProfile}>
                    <ListGroupItemHeading>
                        Your ordered prints.
                    </ListGroupItemHeading>
                    {
                         (this.state.orderedPrints.length == 0)? <ListGroupItem> None </ListGroupItem> :

                            this.state.orderedPrints.map((order) => {
                            //Buttons will be floated to right of name.
                            return <ListGroupItem>  {order.name}

                            <ModelInfoBlock name= {order.name} duration={order.duration} cost = {order.cost} 
                            start = {order.start} end = {order.end}/>                     
                            <Button name={order.name+"_cancel"} onClick = {this.refund}> Cancel  </Button> 
                        </ListGroupItem>

                       })
                    }
                </ListGroup>

                <div hidden = {this.state.visitorOwnProfile}>
                        {/*In here will be button to message, maybe, etc.*/}
                </div>
               
                    
            </div>

        )
    }
}