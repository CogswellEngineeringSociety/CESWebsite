import React, {Component} from 'react';
import {Alert} from 'reactstrap';
import key from './util/keyIterator';

export const loadingStates = {NOTLOADING: "Not Loading", LOADING : "Loading", LOADED : "Loaded"}

class LoadingScreen extends Component{

    constructor(props){
        super(props);

        

    
    }

   

    render(){

        return (<div>
            
                <div hidden={this.props.loadState != loadingStates.LOADING}>
                    {/*Later will be loading animation*/}
                    <Alert color ="info" >{this.props.loadingText} </Alert>
                </div>
                
                <div hidden = {this.props.loadState != loadingStates.LOADED}>
                    <Alert color = "info" >{this.props.loadedText}</Alert>
                </div>
            
            
            </div>)


    }
}

export default LoadingScreen;