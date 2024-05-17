import { SERVER_URL } from "../parameters"

import AsyncStorage from '@react-native-async-storage/async-storage';



export const getRequest = async (path, callback,errorCallBack) => {
  
  

 AsyncStorage.getItem("userToken").then(token=>{
   console.log(path);

    fetch(SERVER_URL + path, {
      headers: { Authorization: token }
    })
      .then(response => response.json())
      .then(responseData => {
        callback(responseData);
        
      }) .catch(err => { 
        errorCallBack(err);
        //sessionStorage.setItem("jwt",null);
        //sessionStorage.setItem("isAuthenticated",false);
        //window.location.href='/login'
      })
  });

}

export const getRequestWithoutToken = async (path, callback,errorCallBack) => {
  
    fetch(SERVER_URL + path, {
      })
        .then(response => response.json())
        .then(responseData => {
          callback(responseData);
          
        }) .catch(err => { 
          errorCallBack(err);
          
        })
   
   }




export const postRequest = async (path, data,callback) => {
  console.log("post " +path+ "  "+JSON.stringify(data));
  AsyncStorage.getItem("userToken").then(token=>{
    
     fetch(SERVER_URL + path, {
       method:'POST',
       
       headers: {
         Authorization: token ,"Content-Type": "application/json"
        },
       mode: 'no-cors',
       body:JSON.stringify(data)
     }).then((response) => response.json())
     .then((responseJson) => {
      console.log("resp:"+JSON.stringify(responseJson))
      callback(responseJson);
     
   }).catch(err => {
        console.error('Post Hata: ',err);
         //sessionStorage.setItem("jwt",null);
         //sessionStorage.setItem("isAuthenticated",false);
         //window.location.href='/login'
       })
   });
 
 
 }

 export const postRequestWithoutToken = async (path, data,callback) => {
    console.log(SERVER_URL + path+" post " +path+ "  "+JSON.stringify(data));
    fetch(SERVER_URL + path, {
        method:'POST',
        
        headers: {
          "Content-Type": "application/json"
         },
        mode: 'no-cors',
        body:JSON.stringify(data)
      }).then((response) => response.json())
      .then((responseJson) => {
       console.log("resp:"+JSON.stringify(responseJson))
       callback(responseJson);
      
    }).catch(err => {
         console.error('Post Hata: ',err);
          //sessionStorage.setItem("jwt",null);
          //sessionStorage.setItem("isAuthenticated",false);
          //window.location.href='/login'
        })
   
   
   }
 
