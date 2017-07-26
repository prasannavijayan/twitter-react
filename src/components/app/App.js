import './App.css';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { getUserInfo, getTweets } from '../../state/actions';
import Header from '../header/Header';
import Login from '../login/Login';
import TweetsList from '../tweets-list/TweetsList';

class Application extends Component {

    /**
     * Get user information when the component mounted.
     */
    componentDidMount() {
        this.props.getUserInfo();
    }

    /**
     * Once the user logs in, fetch the tweets only once.
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.user.isLoggedIn && !nextProps.tweets.alreadyFetched) {
            this.props.getTweets();
        }
    }

    render() {
        const { user, tweets } = this.props;
        const mainContainer = user.isLoggedIn ? <TweetsList user={user} tweets={tweets.list}/> : <Login/>;

        return (
            <div className="app">
                <Header user={user}/>
                {mainContainer}
            </div>
        );
    }
}

/**
 * Connect the application with the created store.
 */
const App = connect(
    state => {
        return {
            user: { ...state.user },
            tweets: { ...state.tweets },
        };
    },
    dispatch => bindActionCreators({ getUserInfo, getTweets }, dispatch)
)(Application);

export default App;
