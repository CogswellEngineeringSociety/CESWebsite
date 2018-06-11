import React, {Component} from 'react'

import fire, {url} from './back-end/fire';
import NewsEntry from './NewsEntry';
import {Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import queryString from 'query-string';

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

        //Then fetch from the news all that match the filter / criterion. 
        //For now just all
        const dbRef = fire.database().ref("News/");

        //To hold data pulled, so can set state to trigger update check.
        var data = []
        dbRef.once('value')
        .then( (snapshot) => {

            if (!snapshot.exists()){
                return;
            }
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

  
    componentWillMount(){
      //Get page from query parameter.
      const pg = queryString.parse(this.props.location.search).pg;
      
    }


    render(){

        //Get page from query parameter.
        const pg = queryString.parse(this.props.location.search).pg;
        var totalPages = (this.state.newsEntries.length / this.props.entryPerPage) + 1;
        //If length / entry per page is less than queried page, than invalid. Later will reroute to 404, for now jsut return.
         if (totalPages < pg){
             //Reroute to 404 page instead.
            return null;
         }

         var endingPage = pg * this.props.entryPerPage;
         if (pg == null){

            endingPage = this.props.entryPerPage;
            totalPages = 2;
         }

        //Minus entry per page because start from 0. Check not needed here cause will auto be 0 with subtraction.        
        const startingPage = endingPage - this.props.entryPerPage;
        const renderedNewsEntries = []

        if (this.state.newsEntries.length == 0){
            //Replace this with loading screen made in useres branch after merge everything.
            return null;
        }
        else{

            for (var page = startingPage; page < endingPage; ++page){
                const entry = this.state.newsEntries[page];
                renderedNewsEntries.push(<NewsEntry topic = {entry.topic} author = {entry.author} desc = {entry.desc}/>);
            }

        }

        const pageNumbers = []
        for (var page = 1; page < totalPages; ++page){
                        pageNumbers.push(
                                <PaginationItem id = {page} disabled = {page == pg}>
                                {/*Works, but not what want this is new page for each indivudla news post, but that's over kill.*/}
                                {/*Okay, so PaginationLink works with routes, so rpob extends Link from react-router-dom. interesting*/}
                                <PaginationLink href={"/?pg="+page}> {page} </PaginationLink>
                               </PaginationItem>);
        }
        
        return (<div>

                    <div className = "FilterOptions">
                    


                    </div>
                    <div className = "NewsEntries">
                    {
                        renderedNewsEntries.map(newsEntry => {
                            return newsEntry;
                        })

                    }
                    </div>
                    <Pagination>
                    {
                        pageNumbers.map(pageItem => {
                            return pageItem;
                        })
                    }

                    </Pagination>
            
            </div>)
    }

}

export default NewsPage;