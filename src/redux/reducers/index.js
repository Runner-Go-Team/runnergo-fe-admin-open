import { combineReducers } from 'redux';
import userReducer from './user';
import permissionReducer from './permission';

const reducers = combineReducers({
    user: userReducer,
    permission: permissionReducer
});

export default reducers;