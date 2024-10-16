import React, {useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastAndroid} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {Int32} from 'react-native/Libraries/Types/CodegenTypes';
import {postRequestWithoutToken} from '../services/apiService';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
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
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 23,
    marginBottom: 20,
  },
});

const LoginScreen = () => {
  const [username, setUsername] = useState('emrebaba');
  const [password, setPassword] = useState('furkanbaba');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (username === '' && password === '') {
      ToastAndroid.show(
        'Lütfen kullanıcı adı ve şifre alanlarını giriniz',
        ToastAndroid.LONG,
      );
    } else {
      const user = {
        username: username,
        password: password,
      };
      postRequestWithoutToken('auth/signin', user, responseData => {
        if (responseData.status === 200) {
          AsyncStorage.setItem('Token', responseData.result);
          navigation.navigate('Home');
        } else {
          ToastAndroid.show(responseData.message, ToastAndroid.LONG);
        }
      });
    }
  };

  return (
    <ImageBackground
      source={require('../assets/bg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Coffee Management System</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Kullanıcı Adı"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Giriş Yap" color="#796a41" onPress={handleLogin} />
        </View>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
