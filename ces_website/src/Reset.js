import React, {Component} from 'react';
import {Form, Input,Label} from 'reactstrap';
import fire from './back-end/fire'

const url = "http://localhost:5000";

class Reset extends Component{

    constructor(props){
        super(props);

        this.state = {
            passwordEntered:"",
            retypedPassword:"",
            error:"",
            success:false,
            expired:true,

        };

        this.resetPassword = this.resetPassword.bind(this);
        this.onUpdateField = this.onUpdateField.bind(this);
    }

 

   
    componentWillMount(){

        const token = this.props.match.params.acc;
        //Can't do it in here.
        const ref = fire.database().ref("ExpiredTokens/"+token).once('value')
        .then(snapshot => {

          //Works but slight delay
          if (snapshot.exists()){
            
            console.log("here?");
            this.props.history.push("/");
            return;
          }
          else{
                this.setState({
                    expired:false
                });
                //Once mounted, it will set the token expired.
                const formData = new FormData();
                formData.append("token",token);
                fetch(url+"/TokenUsed",{
                    method:"POST",
                    body:formData
                })
                .catch(err => {
                    console.log(err);
                })
          }
        })
      
    }


    resetPassword(event){
        event.preventDefault();

        if(this.state.passwordEntered !== this.state.retypedPassword){
            this.setState({
                error:"Passwords do not match"
            });
            return;
        }

        var formData = new FormData();
        formData.set("token",this.props.match.params.acc);
        formData.set("password",this.state.passwordEntered);
        
        fetch(url+"/ConfirmReset",{
            method:"POST",
            body:formData
        })
        .then(response => {

            this.setState({
                success : true
            });
        })
        .catch(err => {
            console.log(err);
        })
    }

    onUpdateField(event){
        const target = event.target;

        this.setState({
            [target.name] : target.value
        });


    }

    render(){
        return (<div hidden = {this.state.expired}>
            
            <p hidden ={!this.state.success}> Your password has been updated. </p>
            <Form onSubmit = {this.resetPassword} hidden = {this.state.success}>
                <Label for = "pw1"> Enter your new password </Label>
                <Input id ="pw1" name="passwordEntered" type="password" value={this.state.passwordEntered} onChange={this.onUpdateField}/>
                <Label for = "pw2"> Re-Enter your new password </Label>
                <Input id ="pw2" name="retypedPassword" type="password" value={this.state.retypedPassword} onChange={this.onUpdateField}/>
                <p> {this.state.error} </p>
                <Input type="submit" value="Confirm"/>
            </Form>
            </div>);

    }


}

export default Reset