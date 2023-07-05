import { combineReducers } from 'redux';
import userReducer from './user';
import permissionReducer from './permission';
import companyReducer from './company';

const reducers = combineReducers({
    user: userReducer,
    permission: permissionReducer,
    company:companyReducer
});

export default reducers;