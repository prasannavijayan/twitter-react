import './Header.css';

import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import SecurityIcon from 'material-ui/svg-icons/hardware/computer';
import IconButton from 'material-ui/IconButton';


class Header extends Component {

    title = 'Twitter React App';

    render() {
        const { name, isLoggedIn } = this.props.user;
        const userName = name ? `@${name}` : '';

        const logoutButton = isLoggedIn ?
            <RaisedButton
                href="/logout"
                label="Logout"
                primary={true}
            /> : null;

        const rightElement = (
            <div className={isLoggedIn ? "padding logout-button" : "logout-text"}>
                <span className="padding">{userName}</span>
                {logoutButton}
            </div>);

        return (
            <AppBar
                title={this.title}
                titleStyle={{ textAlign: 'left' }}
                iconElementRight={rightElement}
                iconElementLeft={<IconButton><SecurityIcon /></IconButton>}
            />);

    }
}

export default Header;
