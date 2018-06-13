import React, {Component} from 'react';
import {Link} from 'react-router-dom';


class NewsEntry extends Component{

    constructor(props){

        super(props);
        
        //Will think more on state for entries later.
        this.state = {

        }
    }

    render(){

        return (<div>
                <h1 id="topic"> {this.props.topic}</h1>
                 <p> Written by
                <Link  id="author" to={"/UserProfile?user="+this.props.author}>  {this.props.author} </Link></p>
                <p id="description"> {this.props.desc }</p>
            </div>);
    }


}

export default NewsEntry; 