import React, { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';
import { postRequestWithoutToken } from './services/apiService';

type LoginResponse = {
  success: boolean;
  message?: string;
  result?: Object;
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',  // Genişlik % olarak ayarlandı
    backgroundColor: 'rgba(166, 162, 162, 0.89)',
    padding: 30,
    borderRadius: 10,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',  // Düğmenin genişliği de konteyner ile aynı hizaya getirildi
  },
  title: {
    fontWeight: 'bold',
    fontSize: 23,
    marginBottom: 20, // Başlık ile form arasına boşluk eklendi
  },
});

function App(): React.JSX.Element {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async()=>{
      if(username ==="" && password ===""){
        ToastAndroid.show("Lütfen kullanıcı adı ve şifre alanlarını giriniz",ToastAndroid.LONG);
      }
      else{
        const user = {
          username:username,
          password : password
        };
        postRequestWithoutToken("auth/signin",user,(responseData:LoginResponse)=>{
          console.log(responseData);
        });
      }
  }
  return (
    <ImageBackground 
      source={require('./assets/bg.jpg')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Coffe Management System</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder='Kullanıcı Adı' 
            value={username} 
            onChangeText={setUsername} 
            style={styles.input} 
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder='Şifre' 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
            style={styles.input} 
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title='Giriş Yap' color='#796a41' onPress={handleLogin}/>
        </View>
      </View>
    </ImageBackground>
  );
}

export default App;
