import Api from '../services/api';

export const types = {
    GET_USER_INFO: 'getUserInfo',
    GET_TWEETS: 'getTweets',
};

export function getUserInfo() {
    return {
        type: types.GET_USER_INFO,
        payload: Api.fetchUserInfo(),
    };
}

export function getTweets() {
    return {
        type: types.GET_TWEETS,
        payload: Api.fetchTweets(),
    };
}
