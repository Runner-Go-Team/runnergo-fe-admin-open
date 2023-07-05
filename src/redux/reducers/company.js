const NAMESPACE = 'company';

const initialState = {
  company_id: '',
  name: "",
  logo: "",
  expire_time_sec: 0
};

const companyReducer = (state = initialState, action) => {
    switch (action.type) {
        case `${NAMESPACE}/updateCompany`:
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

export default companyReducer;