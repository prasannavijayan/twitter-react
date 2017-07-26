
const OPTS = { credentials: 'include' };


class Api {

    static fetchJson(url, errorPrefix) {
        return fetch(url, OPTS)
            .then(res => res.json())
            .catch(err => console.error(errorPrefix, err));
    }

    static fetchTweets() {
        return Api.fetchJson('/twitter/tweets', 'Fetch tweets failed');
    }

    static fetchUserInfo() {
        return Api.fetchJson('/user-info', 'Fetch user info failed')
    }

}

export default Api;
