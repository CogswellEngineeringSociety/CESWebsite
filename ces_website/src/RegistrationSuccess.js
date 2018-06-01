import React, {Component} from 'react';


class RegistrationSuccessPage extends Component{


    render(){

        return (<div>

                <p> A Verification Email has been sent to {this.props.email}</p>
                <p> Please click on the link provided there to verify your account </p>     
            </div>)
    }
}

export default RegistrationSuccessPage;