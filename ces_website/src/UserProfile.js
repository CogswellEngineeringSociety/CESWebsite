import React, {Component} from 'react';
import fire from './back-end/fire';

export default class UserProfile extends Component{

    constructor(props){

        super(props);
    }



    refund(event){
        //If the thing they clicked on to refund is still in queue
        //then allow refund.
        //They have access to read in queue if they match the uID. I need to set the rules on firebase first.
        
        const databaseRef = fire.datebase.ref("QueuedModels");
    
    }

    




    render(){

        return (
            //Will show all user information and models they ordered to print





        )


    }


}