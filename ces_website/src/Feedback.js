import React, {Component} from 'react';
import {Form,Label,Input,Dropdown,DropdownItem,DropdownToggle,DropdownMenu} from 'reactstrap';
/*

This page will have simple form. Topic and description.
Author of feedback will be from auth.

*/
class FeedbackPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            category:"",
            categories : [],
            categoryMenuOpen : false,
            topic:"",
            description:""
        }

        this.onUpdateField = this.onUpdateField.bind(this);
        this.toggleCategory = this.toggleCategory.bind(this);
        this.setCategory = this.setCategory.bind(this);
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

    render(){

        return (<div>
            
                <Form>
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

                </Form>
            
            </div>
            )

    }

}