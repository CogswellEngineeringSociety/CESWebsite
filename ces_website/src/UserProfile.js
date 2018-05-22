import React, {Component} from 'react';
import fire,{url} from './back-end/fire';
import {ListGroup, ListGroupItem, ListGroupItemHeading, Button, Popover,PopoverBody,PopoverHeader} from 'reactstrap';


export default class UserProfile extends Component{

    constructor(props){

        super(props);
        this.state = {

            orderedPrints: [],
            infoOpen:false,
            //For actual content
            infoContent:null,
            error:""
        }
    }

    componentWillUpdate(){

        const databaseRef = fire.datebase.ref("QueuedModels");
          //Need to test this when have internet
        const pulledPrints = []
          databaseRef.orderByChild("email").equalTo(this.props.userInfo.email).on("child_added",(snapshot)=>{

            pulledPrints.push(snapshot);  
            this.setState({
                orderedPrints : pulledPrints
            });

            /* Could make dictionary for it instead but since not part of state or props it won't render on updating it.
            So keeping here incase change mind but alternative for now is just one popover where content of it is changed.
            pulledPrints.forEach(order => {
                //Adding states to state for whether or not displaying info.
                this.setState({
                    [order.fileName + "_info"] : false  
                });
            })*/
        })

    }

    toggleInfo(event){

        const nameOfFile = event.target.name.split("_")[0];

        const toDisplay = this.state.orderedPrints.find((element) => {
            return element.fileName === nameOfFile;
        });

        //If was info was clicked and was on same item as before, then this means close the info box
        if (this.state.infoContent != null && this.state.infoContent.name == nameOfFile){
            
            this.setState({
                infoOpen: false,
                infoContent:null

            });
        }
        else{

            this.setState({
                infoOpen : true,
                //Assuming the objects pulled from database keep that kind of structure, I'll have to test that later.
                //infoContent: toDisplay
                //For testing of disaply
                infoContent:{name:nameOfFile, start:"2 weeks", end:"2weeks", duration:"60 mins", cost:"10 credits / $1"}
            });
        }
    }

    refund(event){
        //If the thing they clicked on to refund is still in queue
        //then allow refund.
        //They have access to read in queue if they match the uID. I need to set the rules on firebase first.
        
        const toRemove = event.target.name;
        
        /* Removing from Database*/
        //Removing client side like this will depend on authorization they've provided.
        const databaseRef = fire.datebase.ref("QueuedModels/"+toRemove);
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
                <ListGroup>
                    <ListGroupItemHeading>
                        Your ordered prints.

                    </ListGroupItemHeading>
                    {
                         (this.state.orderedPrints.length == 0)? <ListGroupItem> None </ListGroupItem> :

                            this.state.orderedPrints.map((order) => {

                            //Buttons will be floated to right of name.
                            return <ListGroupItem> {order} 

                            <Button name={order+"_info"}  onClick = {this.toggleInfo}> Info </Button>
                            <Button name={order+"_cancel"} onClick = {this.refund}> Cancel  </Button> 
                        </ListGroupItem>

                       })
                    }

                </ListGroup>
               
                    {/*Name in info content will correspond to last info button clicked so that the popover shows up in the
                    correct spot*/}
                <Popover placement="bottom" isOpen = {this.state.infoOpen} target={(this.state.infoContent != null)?this.state.infoContent.name+"_info": ""}>
                        <PopoverHeader> Order Information on { (this.state.infoContent != null)? this.state.infoContent.name : ""} </PopoverHeader>
                        <PopoverBody>
                            Estimated Start Time: {this.state.infoContent.start} <br></br>
                            Duration: {this.state.infoContent.duration}} <br> </br>
                            Estimated End Time: {this.state.infoContent.end} <br> </br>
                            Cost: {this.state.infoContent.cost} 
                        </PopoverBody>
                </Popover>
            </div>

        )
    }
}