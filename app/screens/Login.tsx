import React, { useContext, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import {
  TouchableOpacity,
  Text,
  TextInput,
  Platform,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Alert
} from 'react-native';

import { AuthContext } from '../context/auth';

import { Background } from '../components/Background';
import { WhiteLogo } from '../components/WhiteLogo';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../theme/loginTheme';


interface LoginProps extends StackScreenProps<any, any> {};

export const Login = ({ navigation }: LoginProps) => {
  const { email, password, onChange } = useForm({ email: '', password: '' });
  const { signIn, errorMessage, removeError } = useContext(AuthContext);

  const onLogin = () => {
    signIn({ correo: email, password });
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (errorMessage.length === 0) return;
    Alert.alert(
      'Incorrect Login',
      errorMessage,
      [{ text: 'ok', onPress: removeError }]
    );
  }, [errorMessage]);

  return (
    <>
      <Background />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={(Platform.OS === 'ios' ? 'padding' : 'height')}
      >
        <View style={loginStyles.formContainer}>
          <WhiteLogo />
          <Text style={loginStyles.title}>Login</Text>
          <Text style={loginStyles.label}>Email:</Text>
          <TextInput
            placeholder='Email'
            placeholderTextColor='rgba(255, 255, 255, 0.4)'
            keyboardType='email-address'
            underlineColorAndroid='white'
            style={[loginStyles.inputField, (Platform.OS === 'ios' && loginStyles.inputFieldIos)]}
            selectionColor='white'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={(value) => onChange(value, 'email')}
            value={email}
          />

          <Text style={loginStyles.label}>Password:</Text>
          <TextInput
            placeholder='******'
            keyboardType='default'
            placeholderTextColor='rgba(255, 255, 255, 0.4)'
            underlineColorAndroid='white'
            style={[loginStyles.inputField, (Platform.OS === 'ios' && loginStyles.inputFieldIos)]}
            selectionColor='white'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry
            onChangeText={(value) => onChange(value, 'password')}
            value={password}
          />

          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity activeOpacity={0.5} style={loginStyles.button} onPress={onLogin}>
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={loginStyles.newUserContainer}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.replace('Register')}>
              <Text style={loginStyles.buttonText}>New account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
