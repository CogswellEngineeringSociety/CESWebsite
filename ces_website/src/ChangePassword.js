import React, {Component} from 'react';
import {Form, Input, Label,FormText,Alert} from 'reactstrap';
import fire, {url} from './back-end/fire';
const validator = require('./util/validationFunctions');


class ChangePasswordPage extends Component{


    constructor(props){

        super(props);

       

        //Will make this loading state and screen to it's own component later.
        this.changeStates = {NOTCHANGING :"Not Changing" ,CHANGING: "Changing",CHANGED : "Changed"};
        this.state = {
            currentPW:"",
            passwordEntered:"",
            retypedPassword:"",
            error:"",
            changeState: null
        }
        this.onUpdateField = this.onUpdateField.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    componentWillMount(){
        this.setState({
            changeState : this.changeStates.NOTCHANGING
        });
    }

    componentWillUpdate(){
    }

    onUpdateField(event){

        const target = event.target;

        this.setState({
            [target.name] : target.value
        });
    }

    changePassword(event){

        event.preventDefault();


        const auth = fire.auth();
        auth.signInWithEmailAndPassword(this.props.userInfo.email,this.state.currentPW)
            .then(val => {

                const user = auth.currentUser;

                if (!validator.testPW(this.state.passwordEntered)){
            
                    this.setState({
                        error:"Invalid New Password"
                    });
                    return;
        
                }
        
                if(this.state.passwordEntered !== this.state.retypedPassword){
                    this.setState({
                        error:"Passwords do not match"
                    });
                    return;
                }

                //Since only updating own account settings, it will be on this side because rules will only allow if authorized.
                this.setState({
                    changeState:this.changeStates.CHANGING
                });
                user.updatePassword(this.state.passwordEntered)
                    .then(val => {

                        this.setState({
                           changeState : this.changeStates.CHANGED
                        });
                    }) 
                    .error(err => {

                        this.setState({
                            error:"Password failed to change",
                            changeState:this.changeStates.NOTCHANGING
                        });
                    })
            })
            .catch(err => {

                if (err.code == "auth/wrong-password" ){
                    this.setState({
                        error : "Incorrect Current Password"
                    });
                 }

            })
    }

    render(){

        return (<div>
                <Form hidden = {this.state.changeState == this.changeStates.CHANGED} onSubmit = {this.changePassword}>
                    <Label for = "currentPW"> Enter your current password </Label>
                    <Input id ="currentPW" name="currentPW" type="password" value={this.state.currentPW} onChange={this.onUpdateField}/>
                    <Label for = "pw1"> Enter your new password </Label>
                    <FormText className="FormPrompt"> (Password must at a minimum of 6 characters and contain atleast one of each: Lowercase,Uppercase,Number) </FormText>
                    <Input id ="pw1" name="passwordEntered" type="password" value={this.state.passwordEntered} onChange={this.onUpdateField}/>
                    <Label for = "pw2"> Re-Enter your new password </Label>
                    <Input id ="pw2" name="retypedPassword" type="password" value={this.state.retypedPassword} onChange={this.onUpdateField}/>
                    <Alert color="warning" hidden = {this.state.error == ""}> {this.state.error} </Alert>
                    <Input type="submit" value="Confirm"/>

                </Form>
                <div hidden={this.state.changeState != this.changeStates.CHANGING}>
                    {/*Later will be loading animation*/}
                    <Alert color ="info" > Changing Password </Alert>
                </div>
                <div hidden = {this.state.changeState != this.changeStates.CHANGED}>
                    <Alert color = "info" > Successfuly Changed Password</Alert>
                </div>
            
            
            </div>)

    }


}

export default ChangePasswordPage