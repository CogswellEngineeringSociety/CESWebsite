import React, {Component} from 'react'
import {Input,FormText,Form,FormGroup,Label,Button} from 'reactstrap';


 class Registration extends Component{

    constructor(props){
        super(props);
        this.onRegister = this.onRegister.bind(this);

    }

    onRegister(event){

        event.preventDefault();
        this.validateForm();
    }

    validateForm(){


        console.log("Validating form");


    }

    render(){

        return (
            <Form>
                <FormGroup>
                    <Label for="emailInput">Email </Label>
                    <Input type="email" id="emailInput" placeholder="jdoe@cogswell.edu"/>
                </FormGroup>
                <FormGroup>
                    <Label for="passwordInput">Password</Label>
                    <Input type="password" id="passwordInput"/>
                </FormGroup>
                <Button onClick={this.onRegister}> Create Account </Button>
            </Form>
        )
    }

}

export default Registration;