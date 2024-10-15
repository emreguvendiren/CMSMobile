import { SERVER_URL } from "../parameters"

import AsyncStorage from '@react-native-async-storage/async-storage';



export const getRequest = async (path, callback,errorCallBack) => {
  
  
  const token = await AsyncStorage.getItem("Token");

 AsyncStorage.getItem("Token").then(token=>{
   console.log(path);

    fetch(SERVER_URL + path, {
      headers: { Authorization:"Bearer " + token}
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


export const postRequest = async (path, data,callback) => {
  console.log("post " +path+ "  "+JSON.stringify(data));
  AsyncStorage.getItem("Token").then(token=>{
    
     fetch(SERVER_URL + path, {
       method:'POST',
       
       headers: {
         Authorization: "Bearer "+token ,"Content-Type": "application/json"
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
 
