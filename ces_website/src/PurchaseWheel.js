import React, {Component} from 'react';
import  {Container,Row,Col,
Button} from 'reactstrap';
import _ from 'lodash';
import ModelInfoBlock from './ModelInfoBlock'



class PurchaseWheel extends Component{

    constructor(props){

        super(props);


        this.state = {

            endingPage : -1
        }

        //Actually iterating through will be in props, provided by UserProfile, 3DPrinterPage etc.

        this.changePage = this.changePage.bind(this);
        this.pageElements = []

      
        
    }

    shouldComponentUpdate(newProps,newState){

        if (this.props.items.length == 0) 
            return false;
        return true;
    }

    componentWillReceiveProps(newProps){

        if (newProps.items.length == this.props.items.length){

            //Basically if not equal at any point, stop and just overwrite everything
            var isSame = true;

            for (var i = 0; i < newProps.items.length && isSame; ++i){
                isSame = _.isEqual(newProps.items[i], this.props.items[i]);                
            }

            if (isSame){
                return;
            }
        }

        this.pageElements = []
        var pageCount = (newProps.items.length / newProps.itemsPerPage);
        if (pageCount == 0) pageCount = 1;

        for (var i = 0; i < pageCount; ++i){

            this.pageElements.push(i + 1)
        }

        this.setState({
            endingPage : newProps.itemsPerPage
        })

    }

    changePage(event){
        event.preventDefault();

        const newEndingPage = event.target.name * this.props.itemsPerPage;

        this.setState({
            endingPage : newEndingPage
        });

    }

   

    render(){

        if (this.props.items.length == 0) return null;

        //Basically the logic I used in my news for pages is what I'm going to be using.
                //Kinda works, does scroll and show more items on next page, but next page should only show 
        const startingPage = this.state.endingPage - this.props.itemsPerPage;
        const pageContent = []
        for (var i = startingPage; i < this.state.endingPage && i < this.props.items.length; ++i){
            const order = this.props.items[i];
           pageContent.push(<Col> {order.name}
                <ModelInfoBlock name= {order.name} duration={order.duration} cost = {order.cost} 
                start = {order.start} end = {order.end}/>  
                
               <Button name={order.name} hidden = {this.props.refundMethod == null} onClick = {this.props.refundMethod}> Refund </Button> 
                
                 </Col>)
        }


        return(

            <div>
        <Container>
            <Row>
                {pageContent.map(content => {
                    return content;
                })}

            </Row>
              

        </Container>
        {
                    this.pageElements.map( page => {
                        console.log(page);
                    return <Button name = {page} onClick = {this.changePage}> {page } </Button>
                })}
        </div>

        )
    }
}


export default PurchaseWheel;