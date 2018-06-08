import React, {Component} from 'react';
import fire, {url} from './back-end/fire';
import Dropzone from 'react-dropzone';
import './3DPrinterPage.css';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
    FormText,Input, ButtonGroup,Button,Form,FormGroup,Alert,
    ListGroup,ListGroupItem,ListGroupItemHeading ,
    Popover,PopoverHeader,PopoverBody} 
from 'reactstrap';
import ModelInfoBlock from './ModelInfoBlock'

//Will be in separate file later upon merging
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
            error:"",
            success:"",

            //All this stuff taking from my code in UserProfile, will think of way to make it modular later
            infoOpen:false,
            //For actual content
            infoContent:null
            
        }
        this.sizeUnits = ["mm","inches"];
        //Later on once get more information will say exact measurements
        this.defaultSizes = ["Small","Medium","Large"];
        this.uploadFile = this.uploadFile.bind(this);
        this.toggleColorDD = this.toggleColorDD.bind(this);
        this.toggleSizeDD = this.toggleSizeDD.bind(this);
        this.alternateSizeSelection = this.alternateSizeSelection.bind(this);
        this.updateSelectedItem = this.updateSelectedItem.bind(this);
        this.updateSize = this.updateSize.bind(this);
        
        this.refreshQueue = this.refreshQueue.bind(this);
    }

    
    componentWillMount(){

        this.pullAvailableColors();
        setInterval(this.refreshQueue,500);       
    }

    shouldComponentUpdate(prevProps, prevState){

        if (prevState.infoOpen != this.state.infoOpen || prevState.infoContent !== this.state.infoContent ||
            prevState.queue.length != this.state.queue.length ){
            return true;
        }
        else{
            for (var i = 0; i < prevState.queue.length; ++i){
                //Should do sha
                const prevStateModel = prevState.queue[i];
                const currStateModel = this.state.queue[i];
                //This one I will add the ands to for everything 
                if (prevStateModel.name != currStateModel.name){
                    return true;
                }
            }
        }

        return true;

    }
    //In update so that while they're filling out form, this will auto update.
    //It's actually every toher frame, not just when needs to update, fuck.
    refreshQueue(){
        this.updateQueue()
        .then(body =>  { this.setState({queue:body.queue})})
        .catch(err => {console.log("Still " + err)})
    }
    


    //Read access on queue will also be public.
    //Writing will not be so that will be handled on private server.
    updateQueue = async() => {

        const url = "http://localhost:5000";
        //Technically since making public, could use clientside firebase instead, but this is fine. Some overhead but not heavy.
        const response =  await fetch(url+"/3DPrinterQueue",{
            method:"GET",
            headers:{'content-type': 'application/json'},
            
        })
        .catch(err =>{
            console.log("error here" + err);
        })

       const body = await response.json()
        .catch(err => { console.log(err);})

        return body;
    }


    pullAvailableColors(){
            fire.database().ref("PrinterState/Color").once('value')
            .then(snapshot => {this.setState({
                colors:snapshot.val().split(",")
            })})
    }

    uploadFile(event){

        event.preventDefault();

       
        if (this.validateForm()){
            this.uploadSecurely()

                    .then( res => {this.setState({
                        dropZoneText:"Drag your Model Here or Click to Upload"
                    })});
            
        }
    }
    

    validateForm(){

        var regex = /.obj|.X3G/;
        return true;

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

        return this.state.error == "";
    }

    uploadSecurely = async() => {


        const url = "http://localhost:5000";        
        const data = new FormData();

        data.append('file', this.state.fileUploaded);
        data.append('size',this.state.modelSize + this.state.modelSizeUnit);
        //Will check dropdown to get its valjue, but still now just this.
        data.append('color', this.state.colorChosen);

        //Could check localstorage but if ever do this not on web like just phone app then will require this way.
        //Only need email, don't need rest of information.
        data.append('uid',this.props.userInfo.uid);
        const response = await fetch(url+"/AddToQueue", {
            method:"POST",
            body: data,
        })
        .then(res => {
            
            console.log("uploaded the model");
            this.setState({

                //Kinda redundant cause they'll see the queue on the page be updated.
                

            });
         })
        .catch(err =>{
            console.log(err);
            this.setState({
                error:"An error has occured. Please try again."
            });
        })
        
    }

    onDrop(newFiles){
        
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

    toggleSizeDD(){
        this.setState({
            modelDropDown:!this.state.modelDropDown
        });
    }

    alternateSizeSelection(){
        this.setState({

            defaultSizeSelection : !this.state.defaultSizeSelection,
            modelSize : ""
        })
    }

    
    updateSelectedItem(event){

        const target = event.target;

        this.setState({
            
            [target.name] : target.textContent,
        })
    }

    updateSize(event){

        this.setState({
            modelSize: event.target.value
        });

    }

  

    render(){
            
        return (
           
            <div>
                <ListGroup >

                    <ListGroupItemHeading>
                        Ordered Prints

                    </ListGroupItemHeading>
                    {
                         (this.state.queue.length == 0)? <ListGroupItem> None </ListGroupItem> :

                            this.state.queue.map((order) => {
                            //Buttons will be floated to right of name.
                            return <ListGroupItem> {order.name} <ModelInfoBlock name= {order.name} duration={order.duration} cost = {order.cost} 
                            start = {order.start} end = {order.end}/>

                        </ListGroupItem>

                       })
                    }
                </ListGroup>
                {/*Will change this and userprofile to be modular and switch the null part, will create custom popoveritem*
                    Right now multiple buttons mapped to one popover(cause only one need be open, but maybe not best way, can
                    force only one open another way. Yeah cleaner and the positions gets fucked.*/}
               
               {/*Impossible for user to be null on this page cause will redirect them to login if go to this path*/}
                <p> Your Credits: { this.props.userInfo.credits} </p>
                
            
                <Form>

                    <FormGroup className="DefaultSize" hidden = {!this.state.defaultSizeSelection}>
                    <ButtonGroup className = "SizeSelection"> 
                        {/*Add images here later*/ }
                        {this.defaultSizes.map(val => {

                            return <Button name="modelSize" className="DefaultSize" onClick = {this.updateSelectedItem}> {val} </Button>
                        })}
                    </ButtonGroup>
                    <FormText> Chosen Size: {this.state.modelSize} </FormText>
                    </FormGroup>
                    
                    
                    <FormGroup className="CustomSize" hidden = {this.state.defaultSizeSelection}>

                    <Input type="number" name="size" onChange={this.updateSize} value={this.state.modelSize} className = "SizeSelection" placeholder="Input size"></Input> 

                        {/*Test this later before doing toher way*/}
                        <Dropdown className = "SizeUnit" isOpen = {this.state.modelDropDown} toggle={this.toggleSizeDD}>

                            <DropdownToggle caret>
                                {this.state.modelSizeUnit}
                            </DropdownToggle>
                            
                            <DropdownMenu>
                            {this.sizeUnits.map(value =>{

                                return <DropdownItem name="modelSizeUnit" onClick = {this.updateSelectedItem}> {value} </DropdownItem>
                            })}
                            </DropdownMenu>

                        </Dropdown>

                    </FormGroup>
                    <Button onClick={this.alternateSizeSelection}> Select a {this.state.defaultSizeSelection? "Custom" : "Default"} size</Button>

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