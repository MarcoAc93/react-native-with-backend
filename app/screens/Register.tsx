import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { AuthContext } from '../context/auth';
import { WhiteLogo } from '../components/WhiteLogo';
import { loginStyles } from '../theme/loginTheme';
import { useForm } from '../hooks/useForm';

interface RegisterProps extends StackScreenProps<any, any> {};

export const Register = ({ navigation }: RegisterProps) => {
  const { signUp, errorMessage, removeError } = useContext(AuthContext);
  const { email, password, name, onChange } = useForm({ email: '', password: '', name: '' });

  const OnRegister = async () => {
    await signUp({ correo: email, password, nombre: name });
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (errorMessage.length === 0) return;
    Alert.alert(
      'Registration error',
      errorMessage,
      [{ text: 'Try again', onPress: removeError }]
    )
  }, [errorMessage]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#5856D6' }}
        behavior={(Platform.OS === 'ios' ? 'padding' : 'height')}
      >
        <View style={loginStyles.formContainer}>
          <WhiteLogo />
          <Text style={loginStyles.title}>Register</Text>

          <Text style={loginStyles.label}>Name:</Text>
          <TextInput
            placeholder='Name'
            placeholderTextColor='rgba(255, 255, 255, 0.4)'
            underlineColorAndroid='white'
            style={[loginStyles.inputField, (Platform.OS === 'ios' && loginStyles.inputFieldIos)]}
            selectionColor='white'
            autoCapitalize='words'
            onChangeText={(value) => onChange(value, 'name')}
            value={name}
          />

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
            <TouchableOpacity activeOpacity={0.5} style={loginStyles.button} onPress={OnRegister}>
              <Text style={loginStyles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>

          <View style={loginStyles.newUserContainer}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.replace('Login')}>
              <Text style={loginStyles.buttonText}>Already have an account?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
