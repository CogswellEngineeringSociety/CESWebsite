import React, {Component} from 'react';


class NewsEntry extends Component{

    constructor(props){

        super(props);
        
        //Will think more on state for entries later.
        this.state = {
            beingEdited:false,

        }
    }

    render(){

        return (<div>
                <h1 id="topic"> {this.props.topic}</h1>
                <h3 id="author"> Written by {this.props.author} </h3>
                <p id="description"> {this.props.desc }</p>
            </div>);
    }


}

export default NewsEntry; 