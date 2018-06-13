import React, {Component} from 'react';
import {Popover, PopoverBody,PopoverHeader,Button} from 'reactstrap';
class ModelInfoBlock extends Component{


    constructor(props){
        super(props);

        this.state = {
         popoverOpen :false   
        }
        this.toggle = this.toggle.bind(this);
    }

    toggle(){

        this.setState({
            popoverOpen : !this.state.popoverOpen
        });
    }

    render(){


        return (<span>
            <Button id = {this.props.name+"_info"} onClick = {this.toggle}> Info </Button>
            <Popover placement ="bottom" target={this.props.name+"_info"} isOpen = {this.state.popoverOpen} toggle = {this.toggle}>
                <PopoverHeader> Order Information on {this.props.name} </PopoverHeader>
                    <PopoverBody>
                            <p>Estimated Start Time: {this.props.start} </p>
                            <p>Duration: {this.props.duration}</p>
                            <p>Estimated End Time: {this.props.end} </p>
                           <p> Cost: {this.props.cost} </p>
                    </PopoverBody>
            </Popover>
            </span>);

    }


}

export default ModelInfoBlock;