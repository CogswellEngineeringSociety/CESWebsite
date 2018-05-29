import React, {Component} from 'react'
import {Input,FormText,Form,FormGroup,Label,Button,Alert} from 'reactstrap';
import fire from './back-end/fire';

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
        this.validateLogin();
    }
    
    validateLogin = async() =>{

        const auth = fire.auth();

        auth.signInWithEmailAndPassword(this.state.email,this.state.password)

            .then(res => {
                
                const user = auth.currentUser;

                const userInfoRef  = fire.database().ref("Users/"+user.uid);
               
                //Gets profile informaiton of user.
                userInfoRef.once('value').then(snapshot=>{
                    var userInfo = snapshot.val();
                    userInfo["uid"] = user.uid;
                    this.props.changeLogin(userInfo);                   
                })
            
                const history = this.props.history;
                if (this.props.location.state == null){

                    //Using redirect to avoid going back to register, but it does show it for a split second
                    //I probably should find way to check it here and avoid going there at all.
                    history.goBack();
                }
                else{
                    //This is when was forced to login when tried to go to a login required page.
                    history.push(this.props.location.state.back);
                }

            })

            .catch(err => {
                
                console.log(err);
                this.setState({
                    error:"Failed to login. Incorret email or password",
                    email:"",
                    password:""
                });
            }
            )

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
      
        return (
            <div>
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
            </div>

            )
    }
}

export default Login;