import React, {Component} from 'react'
import {Input,FormText,Form,FormGroup,Label,Button,Alert} from 'reactstrap';
import fire from './back-end/fire';
import User from './User';

class Login extends Component{

    constructor(props){
        super(props);
        this.attemptLogin = this.attemptLogin.bind(this);
        this.state = {

            email:"",
            password:"",
            error:""
        }
        this.fieldChanged = this.fieldChanged.bind(this);
    }

    
    attemptLogin(event){

        event.preventDefault();
        //So if they open it its still logged in
        //console.log(localStorage.getItem("user"))
        this.props.changeLogin({email:this.state.email});
    }

    
    validateLogin = async() =>{

        //Wait sending password in, should be post request  since sensitive lol
        
        //Logging not need admin access they authorizing themselves in this session lol.
        const auth = fire.auth();
        //Just to test local storage first

        //Will test this later.
        auth.signInWithEmailAndPassword(this.state.email,this.state.password)

            .then(res => {
                
                //this.props.changeLogin(true);
                console.log("logged in successfully " + res);
            })

            .catch(err => {
                console.log(err);
                this.props.changeLogin(null);
            })


    }

    fieldChanged(event){
        const target = event.target;

        //Is it because set state from another render??????
        //wtf. It's not rendering
        this.setState({
            [target.name] : target.value,
            error:""
        });
        
    }
   


    render(){
        //Logging in is submitting
        //Registering will link to different page.
        return (
          //Will check cache
            //If not logged in, then show this form
            
            <Form>
                <FormGroup>
                    <Label for="emailInput">Email </Label> <FormText className="FormPrompt"> (Must be a cogswell student) </FormText>
                    <Input name="email" type="email" id="emailInput" value={this.state.email} onChange={this.fieldChanged}/>
                </FormGroup>
                <FormGroup>
                    <Label for="passwordInput">Password</Label> 
                    <Input name="password" type="password" id="passwordInput" value={this.state.password} onChange={this.fieldChanged}/>
                </FormGroup>
                <Alert color="danger" isOpen={this.state.error !== ""}> {this.state.error} </Alert>
                <Button onClick = {this.attemptLogin} > Login </Button>

            </Form>

            )
    }
}

export default Login;