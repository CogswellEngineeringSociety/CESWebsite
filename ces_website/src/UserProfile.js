import React, {Component} from 'react';
import fire,{url} from './back-end/fire';

export default class UserProfile extends Component{

    constructor(props){

        super(props);
        this.state = {

            orderedPrints: [],
            error:""
        }
    }

    componentWillUpdate(){

        const databaseRef = fire.datebase.ref("QueuedModels");
          //Need to test this when have internet
        const pulledPrints = []
          databaseRef.orderByChild("email").equalTo(this.props.userInfo.email).on("child_added",(snapshot)=>{

            console.log(snapshot);
            pulledPrints.push(snapshot);  
        })

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
        }
        //Could add then to only update their list here, but if looking at on phone and on somewhere else, should auto update
        //Also if put in printer, will be auto removed, so it needs to be updated every frame regardless.
        .catch(err => {

            console.log(err);
            
            throw new Error("Failed to remove item. Please try again.");

        })

    }



    




    render(){

        return (
            //Will show all user information and models they ordered to print





        )


    }


}