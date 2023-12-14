import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 

const initialState = {
    state: "t",
    username: "t",
    Id: 0,
    token: 0,
    collegeStudent: false,
    collegeOrg: false,
    email: "",
    loginType: "",
    address: "",
    phoneNumber: "",

}

const reducer = (state = initialState, action: {
    address: string
    phoneNumber: string
    email: string;
    token: number;
    Id: number;
    loginType: string; 
    type: string; 
    username: string ; 
    state: string ;
    collegeStudent: boolean 
    collegeOrg: boolean
}) => 
{
    const newState = {...state}

    if (action.type === 'changeUsername')
    {
        newState.username = action.username
    }
    else if (action.type === 'changeState')
    {
        newState.state = action.state
    }
    else if (action.type === 'changeCollegeStudent')
    {
        newState.collegeStudent = action.collegeStudent
    }
    else if (action.type === 'changeId')
    {
        newState.Id = action.Id
    }
    else if (action.type === 'changeToken')
    {
        newState.token = action.token
    }
    else if (action.type === 'changeEmail')
    {
        newState.email = action.email
    }
    else if (action.type === 'changeLoginType')
    {
        newState.loginType = action.loginType
    }
    else if (action.type === 'changeCollegeOrg')
    {
        newState.collegeOrg = action.collegeOrg
    }
    else if (action.type === 'changePN')
    {
        newState.phoneNumber = action.phoneNumber
    }
    else if (action.type === 'changeAddress')
    {
        newState.address = action.address
    }
    

    return newState
}
const persistConfig = {
    key: 'root',
    storage,
  }




const persistedReducer = persistReducer(persistConfig, reducer)
 

export const store = configureStore({
  reducer: persistedReducer,
})

export const persistor = persistStore(store)




