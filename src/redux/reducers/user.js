import { getCookie } from '@utils';
const NAMESPACE = 'user';

const initialState = {
    theme: getCookie('theme') || "dark",
    language: getCookie('i18nextLng') || 'cn'
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case `${NAMESPACE}/updateUser`:
            return {
                ...state,
                ...action.payload,
            };
            break;
        default:
            return state;
            break;
    }
}

export default userReducer;