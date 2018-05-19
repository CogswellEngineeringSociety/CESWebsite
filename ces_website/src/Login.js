import React, {Component} from 'react'
import {Input,FormText,Form,FormGroup,Label,Button,Alert} from 'reactstrap';
import fire from './back-end/fire';
let url = "sdf";


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
        this.props.changeLogin({email:this.state.email,credits:200});

        const history = this.props.history;

        console.log();
        if (this.props.location.state == null){
           history.goBack();
        }
        else{
            history.push(this.props.location.state.back);
        }

    }

    
    validateLogin = async() =>{

        
        //Logging not need admin access they authorizing themselves in this session lol.
        const auth = fire.auth();
        //Will test this later.
        auth.signInWithEmailAndPassword(this.state.email,this.state.password)

            .then(res => {
                
                console.log("logged in successfully " + res);
               // localStorage.setItem("loggedin",this.userName);
            })

            .catch(err => {console.log(err);})


    }

    fieldChanged(event){
        const target = event.target;
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
                <FormText color="warning" hidden = {this.props.location.state == null}> Please login to {(this.props.location.state != null)? this.props.location.state.prompt:""} </FormText>
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