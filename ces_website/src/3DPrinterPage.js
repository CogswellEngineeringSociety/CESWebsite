import React, {Component} from 'react';
import fire from './back-end/fire';
import Dropzone from 'react-dropzone';
import './3DPrinterPage.css'
class PrintingPage extends Component{

    constructor(props){
        super(props);
        
        this.state = {
             
            queue : [],
            colors : [],
            colorDropDown : false,
            fileUploaded : null,
            dropZoneText : "Drag your Model Here or Click to Upload"
        }
        this.uploadFile = this.uploadFile.bind(this);
    }

    componentWillMount(){
        //Before this component is mounted on screen want to make sure colors
        //there will be set interval to update the queue, will determine that time later
        //colors avaialbe have to be refreshed, don't want that dynamic.


    }

    updateAvailableColors(){

        const database = fire.database();



    }

    uploadFile(event){

        event.preventDefault();

        console.log("hello");

        if (this.state.fileUploaded == null) return;


        const auth = fire.auth();
        //This was good learning, and will require this sign in for client side.
        //but prio is sending get request
       /* auth.signInWithEmailAndPassword("princebasiga@gmail.com","Cplus2x2Unity")
            .then(user => {if (user) {

                const storage = fire.storage().ref("3DPrinterQueue/"+this.state.fileUploaded.name);
                var task = storage.put(this.state.fileUploaded);


                task.on("state_changed",
    
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
     this.uploadSecurely()

            .then( res => {console.log(res);})
        
    }

    uploadSecurely = async() => {

        const data = new FormData();
        data.append('file', this.state.fileUploaded);
        //Will put in url of other server here
        const response = await fetch("https://middleman2.herokuapp.com/uploadFile", {


            method:"POST",
            body: data,
            mode:'no-cors',
            


        })
        .then(res => {
            
            
            console.log("finished fetching" + res);
          

    
        }
        )
        .catch(err =>{console.log(err);})
        
      



    }

    onDrop(newFiles){
        console.log(newFiles[0].name);
        this.setState({
            fileUploaded:newFiles[0],
            dropZoneText:newFiles[0].name
        });
    }

    render(){

        return (
            //This will have the list of things in queue, prob like side scroll thing
            //Form to add to queue
            <div>
                
                <Dropzone className="DropZone" onDrop={this.onDrop.bind(this)}>
                    <p>{this.state.dropZoneText}</p>
                </Dropzone>
                <button onClick={this.uploadFile}> Upload </ button>
            </div>
        )

    }



}

export default PrintingPage;