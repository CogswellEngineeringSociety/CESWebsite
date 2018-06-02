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
        this.sendAgain = this.sendAgain.bind(this);
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
        console.log("resetting password");

        
        //Verifying email first, need to 
        const regex = /@cogswell.edu$/

        if (!regex.test(this.state.email)){

            this.setState({
                error:"Invalid email, all accounts must have an email @cogswell.edu"
            });
            return;
        }
        if (!validator.testPW(this.state.newPassword)){
            this.setState({
                error:"Invalid Password"
            });
            return;
        }

        this.tryResetPassword();
        

    }   
    tryResetPassword = async() =>{
         //Will send post request to other app to reset password.
         var data = new FormData();
         data.append("email",this.state.email);
         data.append("password",this.state.newPassword);
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
    
    

    sendAgain(event){
        event.preventDefault();

        this.setState({
            resetRequestSent:false
        });
    }

    render(){
        return (<div>
            
                <Form onSubmit={this.resetPassword} hidden={this.state.resetRequestSent} >
                    <Label for="emailInput"> Enter your Email </Label>
                    <Input type="email" id="emailInput" name="email" value={this.state.email} onChange={this.updateField}/>
                    <Label for="newPassword"> Enter Your New Password </Label>
                    <FormText className="FormPrompt"> (Password must at a minimum of 6 characters and contain atleast one of each: Lowercase,Uppercase,Number) </FormText>

                    <Input type="password" id="newPassword" name="newPassword" value={this.state.newPassword} onChange={this.updateField}/>
                    <Input className="Button" type="submit" value="Reset Password"/>
                    <Alert color="danger" isOpen={this.state.error !== ""}> {this.state.error} </Alert>
                    
                </Form>          
                <div hidden = {!this.state.resetRequestSent}>
                    <p> Your password has been reset </p>
                    <Button onClick={this.sendAgain}> Reset Again</Button>
                    <Button tag={Link} to="/Login"> Login </Button>
                </div>
            </div>)
    }

}
export default ForgotPasswordPage;