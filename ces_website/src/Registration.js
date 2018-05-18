import React, {Component} from 'react'
import {Input,FormText,Form,FormGroup,Label,Button,Alert} from 'reactstrap';
import "./Registration.css";

 class Registration extends Component{

    constructor(props){
        super(props);
        this.onRegister = this.onRegister.bind(this);
        this.state={

            email:"",
            password:"",
            error:""
        }

        this.emailInputted = this.emailInputted.bind(this);
        this.passwordInputted = this.passwordInputted.bind(this);
    }

    onRegister(event){

        event.preventDefault();
        if (this.validateForm()){
            //Then send post request to my other webapp to upload this user information, need to create that first.


        }
    }

    validateForm(){


        //Validating email
        const emailRegex = /@cogswell.edu$/

        var valid = emailRegex.test(this.state.email); 
        if (valid){
            const prefix = this.state.email.split("@")[0];

            valid = prefix.length > 1 && (prefix !== "@cogswell.edu");
        }

        if (!valid){
            this.setState({
                error:"Invalid Email."
            });
            return;
        }

        //Validating password
        const pwRegex = [

            /[a-z]/,
            /[A-Z]/,
            /[0-9]/
        ];
        
        for (var i = 0; i < pwRegex.length && valid; ++i){
            valid = pwRegex[i].test(this.state.password);
        }

        if (!valid){
            this.setState({
                error:"Invalid Password"
            });
            return;
        }
        //Password should also require stuff, but fuck it for now don't care enough, up to them for that

        
    }

    emailInputted(event){

        this.setState({
            email:event.target.value,
            error:""
        });

    }

    passwordInputted(event){

        this.setState({
            password:event.target.value,
            error:""
        });
    }
    render(){

        return (
            <Form>
                <FormGroup>
                    <Label for="emailInput">Email </Label> <FormText className="FormPrompt"> (Must be a cogswell student) </FormText>
                    <Input type="email" id="emailInput" placeholder="jdoe@cogswell.edu" value={this.state.email} onChange={this.emailInputted}/>
                </FormGroup>
                <FormGroup>
                    <Label for="passwordInput">Password</Label> <FormText className="FormPrompt"> (Password must contain atleast one of each: Lowercase,Uppercase,Number) </FormText>
                    <Input type="password" id="passwordInput" value={this.state.password} onChange={this.passwordInputted}/>
                </FormGroup>
                <Alert color="danger" isOpen={this.state.error !== ""}> {this.state.error} </Alert>

                <Button onClick={this.onRegister}> Create Account </Button>
            </Form>
        )
    }

}

export default Registration;