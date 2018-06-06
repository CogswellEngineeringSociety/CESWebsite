import React, {Component} from 'react'

import fire, {url} from './back-end/fire';

//Reading news in will be public to all, writing news will be done through post request to the admin app
class NewsPage extends Component{


    constructor(props){
        super(props);

        //State of news page will just be sorting and filter.
        //Could embed these settings in user profiles, but prob makes more sense to just keep in state
        this.state = {
            sortCriterion : null,
            filter:null,
            newsEntries: []
        }

        this.pullNewsEntries = this.pullNewsEntries.bind(this);
        setInterval(this.pullNewsEntries,1000);
    }
    
    shouldComponentUpdate(nextProps,nextState){

        if (nextState.sortCriterion != this.state.sortCriterion || nextState.filter != this.state.filter){
            return true;
        }
        else if (nextState.newsEntries.length != this.state.newsEntries.length){
            return true;
        }
        
        return false;

    }

    componentWillUpdate(){
        
        //This should only be called once.
        console.log("I'm called");
    }

    pullNewsEntries(){


        console.log("pulling new entries");
        //Then fetch from the news all that match the filter / criterion. 
        //For now just all
        const dbRef = fire.database().ref("News/");


        var data = []
        
        dbRef.once('value')
        .then( (snapshot) => {

            snapshot.forEach(child => {
                const newsData = child.val();
                data.push(newsData);
            });

            //Though this will be called on a set interval, updating will only happen as neccessary.
            this.setState({
                newsEntries : data
            });
        })
        .catch(err => {console.log(err);})
    }

    //Don't beleieve need to send any data, prob repeatedly call this on an interval instead of update, slightly better?
    pushNewEntry = async() => {

        const response = await fetch(url+"/NewsEntries",{
            method:"POST",
            

        });

        if (response.status.valueOf() != 200){
            throw new Error("Failed to connect");
        }

        const body = await response.json();

        return body;
    }


    render(){
        return (<div>
                
            
            
            </div>)
    }

}

export default NewsPage;