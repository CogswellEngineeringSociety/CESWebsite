import React, {Component} from 'react';
import {Form,Label,Input,Dropdown,DropdownItem,DropdownToggle,DropdownMenu,FormGroup} from 'reactstrap';
import fire,{url} from './back-end/fire';
import {Link} from 'react-router-dom';
/*

This page will have simple form. Topic and description.
Author of feedback will be from auth.

*/
class FeedbackPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            category:"Unspecified",
            categories : ["Unspecified"],
            categoryMenuOpen : false,
            topic:"",
            description:"",
            author:""
        }

        this.onUpdateField = this.onUpdateField.bind(this);
        this.toggleCategory = this.toggleCategory.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.submitFeedback = this.submitFeedback.bind(this);
    }

    pullCategories(){
        //This won't be called every frame, it's not as urgent, but should be updated according to database.
        //The categories are keys for all entries, so it's not like just plopping categories themselves just to do this
        //but it is beneficial that don't gotta reach in code to change this, but not execessive since already there.
        const dbRef = fire.database().ref("Feedback/");
        var categs = []
        dbRef.once('value')
            .then(snapshot => {

                snapshot.foreach(value => {
                    categs.push(value);
                })
                categs.push("Unspecified");
            })
            .catch(err => {
                console.log(err);
            })
    }

    componentWillMount(){
        this.pullCategories();
    }
    shouldComponentUpdate(newProps, newState){

        
        return newState.category != this.state.category || newState.topic != this.state.topic || 
        newState.description != this.state.description || newState.categoryMenuOpen != this.state.categoryMenuOpen;
    }

    onUpdateField(event){
        const target = event.target;

        this.setState({
            [target.name] : target.value
        });
    }

    toggleCategory(){

        this.setState({

            categoryMenuOpen : !this.state.categoryMenuOpen
        });
    }

    setCategory(event){
        this.setState({
            category:event.target.value
        });
    }

    submitFeedback(event){

        event.preventDefault();

       
    }

    render(){

        return (<div>
            
                <Form onSubmit = {this.submitFeedback}>

                    <FormGroup hidden = {this.props.userInfo == null}>
                        <Label for="authorInput"> Enter your name here or <Link to ="/Login"> Login </Link> </Label>
                        <Input type="text" id= "authorInput" name="author" value={this.state.author} onChange = {this.onUpdateField}/>
                    </FormGroup>
                    <Label for="topicInput" > Topic </Label>
                    <Input id="topicInput" name = "topic" type="text" value={this.state.topic} onChange={this.onUpdateField}/>
                    <Label for = "descInput"> Description </Label>
                    <Input id="descInput" name = "description" type="text" value={this.state.description} onChange={this.onUpdateField}/>
            
                    <Dropdown toggle>
                        <DropdownToggle caret>
                            {this.state.category}
                        </DropdownToggle>

                        <DropdownMenu>
                            {this.state.categories.map(val => {
                                return <DropdownItem onClick = {this.setCategory}> {val} </DropdownItem>
                            })}

                        </DropdownMenu>

                    </Dropdown>
                    <Input type="submit" value="Submit Feedback" />
                </Form>
            
            </div>
            )

    }

}