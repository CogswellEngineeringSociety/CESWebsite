import React, {Component} from 'react'
import fire, { url } from './back-end/fire';
import {Input,FormText,Form,FormGroup,Label,Button,Alert,Dropdown,DropdownItem,DropdownToggle,DropdownMenu} from 'reactstrap';
import "./Registration.css";
import {Route} from 'react-router-dom';
const validator = require('./util/validationFunctions');

 class Registration extends Component{

    constructor(props){
        super(props);
        this.onRegister = this.onRegister.bind(this);
        this.state={

            email:"",
            password:"",
            firstName:"",
            lastName:"",
            major:"",
            error:"",
            majorListOpen:false
        } 

        this.fieldChanged = this.fieldChanged.bind(this);

        this.majorSelected = this.majorSelected.bind(this);
        this.toggleMajorList = this.toggleMajorList.bind(this);


        //These options will be pulled from either file or database instead later. This is fine for now.
        this.majors=["Game Design Engineering","Computer Science","Digital Audio Engineering","Digital Arts Engineering","Digital Arts Animaton",
        "Game Design Art", "Game Design Writing", "Digital Media Management"];
    }

    onRegister(event){

        event.preventDefault();
        if (this.validateForm()){
            console.log("registering");
            this.registerAccount()
            .then(val => {
               
            })
            .catch(err => {
                console.log(err);
            })
            //Then send post request to my other webapp to upload this user information, need to create that first.
           
        
            
        }
    }

    registerAccount = async() =>{

    
        const data = new FormData();
        data.append("firstName",this.state.firstName);
        data.append("lastName",this.state.lastName);
        data.append("email",this.state.email);
        data.append("password",this.state.password);
        data.append("major",this.state.major);

        //Chang with loclahost for testing later, changing app to be different domain so keeping here for now
        //the server app needs to be on too
        const response = await fetch("http://localhost:5000/register",{

            method:"POST",
            body:data,
        })
        .then(val => {
            this.setState({
                error:""
            });
            
            console.log("registered");
            fire.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
            .then(val=>{
                console.log("done registering");
                const user = fire.auth().currentUser;
                console.log(user);
                if (user.email == this.state.email){
                    console.log("signed in as newly registered");
                    const verificationOptions = {url:"http://localhost:3000/Login"}
                    user.sendEmailVerification(verificationOptions)
                        .then(val => {
                            this.props.history.push("Register/Verify");
                        })
                }
            });
            

        })
        .catch(err => {
          
            this.setState({
                error:"An error as occured. Please contact the help desk if it continues"
            });
            return;
        }
        );

        if (response != null){
            const body = await response.json();
        
            if (body != null){
                    if (body.error != null){
                        this.setState({
                        error:body.error
                        });
                     }
                     this.props.history.push("/Login");
            }
        }
        else{
     
        const body = await response.json();

        if (body != null && body.error != null){
            this.setState({
                error: "Trouble connecting to server. Please check that you have a connection and try again."
            });
        }


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
            return false;
        }

        valid = validator.testPW(this.state.password);

        if (!valid){
            this.setState({
                error:"Invalid Password"
            });
            return false;
        }


        //Checkign if selected major
        valid = this.state.major.length > 0;

        //Prob better way to do this then checking same condition lol
        if (!valid){
            this.setState({
                error:"Please Select your Major"
            });
            return false;
        }
        //Password should also require stuff, but fuck it for now don't care enough, up to them for that

        return valid;
    }

   
    fieldChanged(event){
        const target = event.target;
        this.setState({
            [target.name] : target.value,
            error:""
        });

    }

    majorSelected(event){
        this.setState({
            "major":event.target.textContent,
            error:""
        });
    }

    toggleMajorList(){
        this.setState({
            majorListOpen : !this.state.majorListOpen
        });
    }

    render(){

        return (
            <Form>
                <FormGroup>
                    <Label for="firstName">First Name</Label>
                    <Input name="firstName" type="text" id="firstName" value={this.state.firstName} onChange={this.fieldChanged}/>
                    <Label for="lastName">Last Name</Label>
                    <Input name="lastName" type="text" id="lastName" value={this.state.lastName} onChange={this.fieldChanged}/>
                </FormGroup>

                <FormGroup>
                    <Label for="emailInput">Email </Label> <FormText className="FormPrompt"> (Must be Cogswell email) </FormText>
                    <Input name="email" type="email" id="emailInput" placeholder="jdoe@cogswell.edu" value={this.state.email} onChange={this.fieldChanged}/>
                </FormGroup>
                
                <FormGroup>
                    <Label for="passwordInput">Password</Label> <FormText className="FormPrompt"> (Password must at a minimum of 6 characters and contain atleast one of each: Lowercase,Uppercase,Number) </FormText>
                    <Input name="password" type="password" id="passwordInput" value={this.state.password} onChange={this.fieldChanged}/>
                </FormGroup>
                
                <FormGroup>

                <Dropdown style={{paddingBottom:"3em"}}name="major" direction="right" isOpen={this.state.majorListOpen} toggle = {this.toggleMajorList}>
                    <DropdownToggle caret>
                        { (this.state.major !== "")? this.state.major : "Select Major"}
                    </DropdownToggle>
                    <DropdownMenu  modifiers={{
                        
                        setMaxHeight: {
                            enabled: true,
                            fn: (data) => {
                              return {
                                ...data,
                                styles: {
                                  ...data.styles,
                                  overflow: 'auto',
                                  maxHeight: 100,
                                },
                              };
                            },
                          },
                        
                    }}>
                        {this.majors.map(major => {

                            return <DropdownItem onClick={this.majorSelected}> {major} </DropdownItem>
                        })}
                    </DropdownMenu>
                
                </Dropdown>
    
                </FormGroup>
    
               
                <Alert color="danger" isOpen={this.state.error !== ""}> {this.state.error} </Alert>
                
                <Button onClick={this.onRegister}> Register </Button>

                
            </Form>
        )
    }

}

export default Registration;