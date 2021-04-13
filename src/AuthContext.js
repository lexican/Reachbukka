import React, { Component } from 'react';
import axios from 'axios';
import fire from '../src/firebase'
const AuthContext = React.createContext();

class AuthProvider extends Component{
    state = {
        message: '',
        isAdmin: false,
        isVendor: false,
        username: '',
        loggedIn: false,
        isLoading: true,
        user: null
    }
    componentDidMount(){
        this.getUser();
    }



    getUser = async () => {
        fire.auth().onAuthStateChanged(userAuth => {
            //console.log("logged in user: " + JSON.stringify(userAuth));
            if(userAuth != null){
                this.setState({ user: userAuth, loggedIn: true});
            }else{
                this.setState({ user: null, loggedIn: false});
            }
          });
      }

    updateMessage = (message) =>{
        this.setState(()=>{
            return {message: message}
        })
    }

    updateUser = (data) =>{
        this.setState(()=>{
            return {loggedIn: data.loggedIn,
                    username: data.username,
                    isAdmin: data.isAdmin
            }
        })
    }
    render(){
        return(
            <AuthContext.Provider value={{...this.state, updateMessage: this.updateMessage, updateUser: this.updateUser }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
        
}
const AuthConsumer = AuthContext.Consumer;
export {AuthProvider, AuthConsumer, AuthContext};