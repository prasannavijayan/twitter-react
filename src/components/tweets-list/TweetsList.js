import './TweetsList.css';

import React, { Component } from 'react';
import Tweet from '../tweet/Tweet';


class TweetsList extends Component {

    title = "Recent #Apple Related Tweets";

    getTweets() {
        try {
            return JSON.parse(this.props.tweets).statuses;
        } catch (e) {
            return [];
        }
    }

    render() {
        return (
            <div className="center-container">
                <h1 className="tweets-title">{this.title}</h1>
                {this.getTweets().map(tweet => <Tweet tweet={tweet}/>)}
            </div>
        );
    }
}

export default TweetsList;
