import React, {Component} from 'react';
import {Input,Form,Label,Button,Alert,FormText} from 'reactstrap';
import {Link} from 'react-router-dom';
const validator = require('./util/validationFunctions');

const url = "http://localhost:5000";
class ForgotPasswordPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            email:"",
            newPassword:"",
            error:"",
            resetRequestSent:false
        }

        this.updateField = this.updateField.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    updateField(event){

        const target = event.target;
        this.setState({
            [target.name]:target.value,
            error:""
        });
    }

    resetPassword(event){
        event.preventDefault();

        
        //Verifying email first, need to 
        const regex = /@cogswell.edu$/

        if (!regex.test(this.state.email)){

            this.setState({
                error:"Invalid email."
            });
            return;
        }
        
        this.tryResetPassword();
        

    }   
    tryResetPassword = async() =>{
         //Will send post request to other app to reset password.
         var data = new FormData();
         data.append("email",this.state.email);

         const response = await fetch(url+"/ResetPassword",{
            method:"POST",
          
            body:data
            
        })
        .then(val => {
            //When it is returned then just update content on page saying sent to email
            this.setState({
                resetRequestSent:true,
               
            });
            return;
        })
        .catch(err => {
            console.log(err);
          
        })
        
        if (response != null){
            const body = await response.json();
            this.setState({
                error: body.error
            });
        }

    }
    
  

    render(){
        return (<div>
            
                <Form onSubmit={this.resetPassword} hidden={this.state.resetRequestSent} >
                    <Label for="emailInput"> Enter your Email </Label>
                    <Input type="email" id="emailInput" name="email" value={this.state.email} onChange={this.updateField}/>
                    <Input type="submit" value="Send Reset Request"/>
                </Form>          
                <div hidden = {!this.state.resetRequestSent}>
                    <p> We have sent an email to {this.state.email} with further instructions. </p>
                </div>
            </div>)
    }

}
export default ForgotPasswordPage;