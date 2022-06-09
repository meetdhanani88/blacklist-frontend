import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import Loginreducer from './Loginreducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    Login: Loginreducer
});

export default reducer;
