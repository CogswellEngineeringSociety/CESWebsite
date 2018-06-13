import React, {Component} from 'react';
import {Input,FormText,Form,FormGroup,Label,Button,Alert,Dropdown,DropdownItem,DropdownToggle,DropdownMenu} from 'reactstrap';
import fire from './back-end/fire';
import LoadingScreen, {loadingStates} from './LoadingScreen';


class UpdateProfilePage extends Component{


    constructor(props){

        super(props);

        this.state={

            //I'll let them decide this so they can describe it.
            //By default, if none chosen then it stays what it is.
            concentration:this.props.userInfo.concentration,
            major:this.props.userInfo.major,
            year:this.props.userInfo.year,
            error:"",
            updateState: loadingStates.NOTLOADING,
            majorListOpen:false,
            yearListOpen:false,
            githubUrl:"",
            linkedinUrl:""
        } 

        this.fieldChanged = this.fieldChanged.bind(this);
        this.dropDownItemSelected = this.dropDownItemSelected.bind(this);

        this.years = ["Freshman","Sophomore","Junior","Senior","Alumni"];
        //These options will be pulled from either file or database instead later. This is fine for now.
        this.majors=["Game Design Engineering","Computer Science","Digital Audio Engineering","Digital Arts Engineering","Digital Arts Animaton",
        "Game Design Art", "Game Design Writing", "Digital Media Management"];
    }

   

    fieldChanged(event){
        const target = event.target;
        this.setState({
            [target.name] : target.value,
        });
    }

    dropDownItemSelected(event){
        this.setState({
            [event.target.name]:event.target.textContent,
        });
    }

    updateProfile(event){

        event.preventDefault();

        //Mainly to get uid, but could also have just gotten it from userINfo variable
        //Less overhead that way too with auth call.
        //const currentUser = fire.auth().currentUser;

        //Same logic as changepassword, user logged in should be able to have access to own stuff in rules.

        const dbRef = fire.database().ref("Users/"+this.props.userInfo.uid);

        this.setState({
            updateState : loadingStates.LOADING
        });
        dbRef.update({
            major : this.state.major,
            year : this.state.year,
            github : this.state.githubUrl,
            linkedin: this.state.linkedinUrl
        })
        .then(val => {

            this.setState({
                updateState : loadingStates.LOADED
            });
        })
        .catch(err => {

            this.setState({
                updateState : loadingStates.NOTLOADING
            });
        });
      
    }

    render(){

        return (<div>
            
            <Form>
            <FormGroup>

                    <Label for = "concentrationInput"> Concentration </Label>
                    <Input id = "concentrationInput" name="concentration" value={this.state.concentration} onChange = {this.fieldChanged}/>
                    
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

                                return <DropdownItem name="major" onClick={this.dropDownItemSelected}> {major} </DropdownItem>
                            })}
                        </DropdownMenu>
                    </Dropdown>
                </FormGroup>
               
               <FormGroup>
                    <Dropdown style={{paddingBottom:"3em"}} direction="right" isOpen={this.state.yearListOpen} toggle = {this.toggleYearList}>
                    <DropdownToggle caret>
                            { (this.state.year !== "")? this.state.year : "Select Year"}
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
                            {this.years.map(year => {

                                return <DropdownItem name="year" onClick={this.dropDownItemSelected}> {year} </DropdownItem>
                            })}
                        </DropdownMenu>
                    </Dropdown>
                </FormGroup>

                <FormGroup>
                <Label for="githubUrl">Github </Label>
                <Input type="text" name="githubUrl" id="githubUrl" value={this.state.githubUrl} onChange = {this.fieldChanged}/> 
                <Label for="linkedinUrl">Github </Label>
                <Input type="text" name="linkedinUrl" id="linkedinUrl" value={this.state.linkedinUrl} onChange = {this.fieldChanged}/>
                </FormGroup>
            </Form>
            <LoadingScreen loadState={this.state.updateState} loadingText = "Updating Profile" loadedText = "Updated Profile"/>
            </div>)



    }


}