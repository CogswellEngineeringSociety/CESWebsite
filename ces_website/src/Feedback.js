import React, {Component} from 'react';
import {Form,Label,Input,Dropdown,DropdownItem,DropdownToggle,DropdownMenu,FormGroup,Alert} from 'reactstrap';
import fire from './back-end/fire';
import {Link} from 'react-router-dom';
/*

This page will have simple form. Topic and description.
Author of feedback will be from auth.

*/
const url = "http://localhost:5000";
class FeedbackPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            category:"Unspecified",
            categoryMenuOpen : false,
            topic:"",
            description:"",
            author:"",
            onSubmitMessage:""
        }

        this.categories = ["Design","Website Features","Events", "3DPrinting"];
        this.onUpdateField = this.onUpdateField.bind(this);
        this.toggleCategory = this.toggleCategory.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.submitFeedback = this.submitFeedback.bind(this);
    }

    shouldComponentUpdate(newProps, newState){

        
        //Will switch this with modular solution wrote in Login and Register later.
        return newState.category != this.state.category || newState.topic != this.state.topic || 
        newState.description != this.state.description || newState.categoryMenuOpen != this.state.categoryMenuOpen
        ||newState.onSubmitMessage != this.state.onSubmitMessage || newState.author != this.state.author;
    }

    onUpdateField(event){
        const target = event.target;

        this.setState({
            [target.name] : target.value,
            onSubmitMessage:""
        });
    }

    toggleCategory(){

        this.setState({

            categoryMenuOpen : !this.state.categoryMenuOpen,
        });
    }

    setCategory(event){
        this.setState({
            category:event.target.textContent,
            onSubmitMessage:""
        });
    }

    submitFeedback(event){

        event.preventDefault();

        var data = new FormData();
        if (this.props.userInfo != null){
            data.append("uid",this.props.userInfo.uid);
            data.append("name",this.props.userInfo.firstName + " " + this.props.userInfo.lastName);
        }
        else{
            data.append("name",this.state.author);
        }

        data.append("topic",this.state.topic);
        data.append("desc",this.state.description);
        data.append("category",this.state.category);
        //Sends post request to back-end app.
        fetch(url+"/UserFeedback",{
            method:"POST",
            body:data
        })
        .then(val => {

            this.setState({
                onSubmitMessage:"Your feedback has been successfully submitted"
            });
        })
        .catch(err => {
            console.log(err);
            this.setState({
                onSubmitMessage:"Failed to submit feedback. Please try again or email us directly at ces@cogswell.edu"
            });
        })
    }

    render(){

        return (<div>
            
                <p id="successText"> {this.state.onSubmitMessage} </p>
                <Form onSubmit = {this.submitFeedback} hidden = {this.state.onSubmitMessage.includes("success")}>

                    <FormGroup hidden = {this.props.userInfo != null}>
                        <Label for="authorInput"> Enter your name here or <Link to ="/Login"> Login </Link> </Label>
                        <Input type="text" id= "authorInput" name="author" value={this.state.author} onChange = {this.onUpdateField}/>
                    </FormGroup>
                    <Label for="topicInput" > Topic </Label>
                    <Input id="topicInput" name = "topic" type="text" value={this.state.topic} onChange={this.onUpdateField}/>
                    <Label for = "descInput"> Description </Label>
                    <Input id="descInput" name = "description" type="text" value={this.state.description} onChange={this.onUpdateField}/>
            
                    <Dropdown toggle = {this.toggleCategory} isOpen = {this.state.categoryMenuOpen}>
                        <DropdownToggle caret>
                            {this.state.category}
                        </DropdownToggle>

                        <DropdownMenu>
                            {this.categories.map(val => {
                                return <DropdownItem onClick = {this.setCategory}> {val} </DropdownItem>
                            })}

                        </DropdownMenu>

                    </Dropdown>
                    <Alert color="warning" hidden = {!this.state.onSubmitMessage.includes("Failed")}> {this.state.onSubmitMessage}</Alert>
                    <Input type="submit" value="Submit Feedback" />
                </Form>
            
            </div>
            )

    }

}
export default FeedbackPage