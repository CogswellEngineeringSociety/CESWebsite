import React, {Component} from 'react';
import fire from './back-end/fire';
import Dropzone from 'react-dropzone';
import './3DPrinterPage.css'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem,FormText,Input, ButtonGroup,Button,Form,FormGroup,Alert,ListGroup,ListGroupItem,ListGroupItemHeading } from 'reactstrap';

//Will be in separate file later upon merging
const url ="https://middleman2.herokuapp.com"

class PrintingPage extends Component{

    constructor(props){
        super(props);
        
        this.state = {
             
            //Should I show the list of everything in queue? Is that neccessarry?
            queue : [],
            colors : [],
            colorChosen: "Choose Color",
            colorDropDown : false,
            fileUploaded : null,
            dropZoneText : "Drag your Model Here or Click to Upload",
            modelSize:"Small",
            modelSizeUnit:"mm",
            modelDropDown:false,
            defaultSizeSelection:true,
            error:""
            
        }
        this.sizeUnits = ["mm","inches"];
        //Later on once get more information will say exact measurements
        this.defaultSizes = ["Small","Medium","Large"];
        this.uploadFile = this.uploadFile.bind(this);
        this.toggleColorDD = this.toggleColorDD.bind(this);
        this.alternateSizeSelection = this.alternateSizeSelection.bind(this);
    }

    componentWillMount(){

        this.pullAvailableColors();

        this.updateQueue();
        //Also pull the queue, that will be serverside rendering, cause don't want it to be on a ticker, but for now this is fine.
    }

    //Read access on queue will also be public.
    //Writing will not be so that will be handled on private server.
    //Hmm but non-admin storage doesn't have getFilse method
    updateQueue = async() => {

      //  const queueRef = fire.storage().ref().child("3DPrinterQueue");
        //hmmmmmmmmmm, need to iterate through each child, there isn't a way I can do that using non-admin
        //queueRef.child().storage.

        fetch(url+"/3DPrinterQueue")
        .then(response => {
            const body = response.json();
            this.setState({
                queue:body.queue
            });
        })
        .catch(err =>{
            console.log("Error");
        })
    }

    pullAvailableColors(){
            fire.database().ref("PrinterState/Color").once('value')
            .then(snapshot => {this.setState({
                colors:snapshot.val().split(",")
            })})
    }

    uploadFile(event){

        event.preventDefault();

        //const auth = fire.auth();
        //This was good learning,// and will require this sign in for client side.
        //but prio is sending get request
       /* auth.signInWithEmailAndPassword("bleh@gmail.com","bleh")
            .then(user => {if (user) {

                const storage = fire.storage().ref("3DPrinterQueue/"+this.state.fileUploaded.name);
                var task = storage.put(this.state.fileUploaded);


                task.on("state_changed",
    
                //Main thing though is no progress on front-end
                //to show user.

                function progress(snapshot){
                    var percentage = snapshot.bytesTransferrd / snapshot.totalBytes;
                    percentage *= 100;
    
                },
    
                function error(err){
                    console.log(err);
                },
                function complete(){
                    console.log("Finished uploading");
                   
                }
        
        
        )
            }})
        

      */
     if (this.validateForm()){
        this.uploadSecurely()

                .then( res => {this.setState({
                    dropZoneText:"Drag your Model Here or Click to Upload"
                })});
        
     }
}

    validateForm(){

        var regex = /.obj|.X3G/;

        if (this.state.fileUploaded == null){

            this.setState({
                error: "Please upload a model to print."
            });

        }
        else if (!regex.test(this.state.fileUploaded.name.split(".")[1])){

            this.setState({
                error:"Invalid file type."
            })
        }

        //Will update this to take multiple? Or just have them fill form out multiple times. Thats UX choice will dicuss alter.
        else if (this.state.colorChosen == "Choose Color"){
            this.setState({
                error:"Please choose a color for your print"
            })
        }

    }

    uploadSecurely = async() => {

        const data = new FormData();

        data.append('file', this.state.fileUploaded);
        data.append('size',{size:this.state.modelSize, unit:this.state.modelSizeUnit});
        //Will check dropdown to get its valjue, but still now just this.
        data.append('color', this.state.colorChosen);
        //Will put in url of other server here
        const response = await fetch(url+"/uploadFile", {


            method:"POST",
            body: data,
            mode:'no-cors',
        })
        .then(res => {
            
            console.log("finished fetching" + res);
         })
        .catch(err =>{console.log(err);})
        
    }

    onDrop(newFiles){
        console.log(newFiles[0].name);
        this.setState({
            fileUploaded:newFiles[0],
            dropZoneText:newFiles[0].name
        });
    }

    toggleColorDD(){

        this.setState({
            colorDropDown: !this.state.colorDropDown
        });
      
    }

    alternateSizeSelection(){
        this.setState({

            defaultSizeSelection : !this.state.defaultSizeSelection
        })
    }

    updateSelectedItem(event){

        const target = event.target;

        this.setState({
            
            [target.name] : target.textContent
        })
    }

  

    render(){
            
        return (
           
            <div>

                <ListGroup>
                    <ListGroupItemHeading> Models in Queue to Print </ListGroupItemHeading>
                    {this.state.queue.map(model =>{

                        <ListGroupItem> {model} </ListGroupItem>
                    })}

                </ListGroup>
               {/*Impossible for user to be null on this page cause will redirect them to login if go to this path*/}
                <p> Your Credits: { this.props.user.credits} </p>
                
            
                <Form>

                    <FormGroup className="DefaultSize" isOpen = {this.state.defaultSizeSelection}>
                    <ButtonGroup className = "SizeSelection"> 
                        {/*Add images here later*/ }
                        {this.defaultSizes.map(val => {

                            <Button name="size" onClick = {this.updateSelectedItem}> {val} </Button>
                        })}
                    </ButtonGroup>
                    </FormGroup>
                    
                    
                    <FormGroup className="CustomSize" isOpen = {!this.state.defaultSizeSelection}>

                    <Input name="size" onChange={(input)=>{this.setState({size:input.value});}} className = "SizeSelection" placeholder="Input size"></Input> 

                        {/*Test this later before doing toher way*/}
                        <Dropdown className = "SizeUnit" isOpen = {this.state.modelDropDown} toggle={this.setState({
                            
                        modelDropDown : !this.state.modelDropDown  
                            
                        })}>

                            <DropdownToggle caret>
                                {this.state.modelSizeUnit}
                            </DropdownToggle>
                            
                            <DropdownMenu>
                            {this.sizeUnits.map(value =>{

                                <DropdownItem name="modelSizeUnit" onClick = {this.updateSelectedItem}> {value} </DropdownItem>
                            })}
                            </DropdownMenu>

                        </Dropdown>

                    </FormGroup>
                    <Button> Select a {this.sizeSelectionMethod? "Custom" : "Default"} size</Button>

                    <Dropdown className="ColorPicker" isOpen={this.state.colorDropDown} toggle={this.toggleColorDD}>

                            <DropdownToggle caret>
                                {this.state.colorChosen}
                            </DropdownToggle>

                            <DropdownMenu>

                                {this.state.colors.map(color => {
                                    return <DropdownItem name="colorChosen" onClick={this.updateSelectedItem}> {color} </DropdownItem>
                                })} 

                            </DropdownMenu>
                    </Dropdown>
                    <Dropzone className="DropZone" onDrop={this.onDrop.bind(this)}>
                        <p>{this.state.dropZoneText}</p>
                    </Dropzone>

                    <Button onClick={this.uploadFile}> Upload </Button>
                    <Alert color="danger" isOpen = {this.state.error != ""}> {this.state.error} </Alert>

                </Form>
            </div>
        )
    }

}

export default PrintingPage;