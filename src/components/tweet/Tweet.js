import './Tweet.css';

import React, { Component } from 'react';
import { Card, CardHeader } from 'material-ui/Card';


class Tweet extends Component {

    getTitle() {
        const parser = new DOMParser();
        return parser.parseFromString(`<html><body>${this.props.tweet.text}`, 'text/html').body.textContent;
    }

    getSubtitle() {
        const tweet = this.props.tweet;
        return `By ${tweet.user.name}, at ${new Date(tweet.created_at).toUTCString()}`;
    }

    render() {
        return (
            <div className="tweet-card">
                <Card>
                    <CardHeader
                        title={this.getTitle()}
                        subtitle={this.getSubtitle()}
                        avatar={this.props.tweet.user.profile_image_url}
                    />
                </Card>
            </div>
        )
    }
}

export default Tweet;
