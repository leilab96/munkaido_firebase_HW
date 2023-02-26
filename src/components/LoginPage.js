import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { resetPassword, signIn, signUp } from '../auth';
import { getUserDataByEmail, createUserData } from '../database';

const LoginPage = ({ setUserData }) => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const login = async () => {
    console.log('logging in...');
    const user = await signIn(email, password);
    const userData = await getUserDataByEmail(user.email);
    setUserData(userData);
    console.log('user: ', user);
  };

  const register = async () => {
    console.log('registering...');
    //Ha nem egyeznek a jelszók nem történik meg az egész regisztráció
    if (password === passwordConfirm) {
      await signUp(email, password);
      const initialUserData = {
        name: userName,
        email: email.toLowerCase(),
        currentState: 'out',
        // history: [],
      };
      await createUserData(initialUserData);
      setUserData(initialUserData);
    } else {
      window.alert('Jelszók nem egyeznek');
    }
  };

  //Password reset function
  const reset = async () => {
    console.log('Password reset...');
    if (email === '') {
      window.alert('Töltsd ki az email címedet majd nyomd meg újra ezt a gombot');
    } else if (!email.match(/\S+@\S+\.\S+/)) {
      window.alert('Email cím nem megfelelő formátumú');
    } else {
      await resetPassword(email);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButtonLeft, !isSignUpActive && styles.active]}
          onPress={() => {
            setIsSignUpActive(false);
          }}>
          <Text style={[styles.toggleButtonText, !isSignUpActive && styles.activeText]}>
            Bejelentkezés
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButtonRight, isSignUpActive && styles.active]}
          onPress={() => {
            setIsSignUpActive(true);
          }}>
          <Text style={[styles.toggleButtonText, isSignUpActive && styles.activeText]}>
            Regisztráció
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{ alignSelf: 'stretch' }}>
        <View style={styles.formContainer}>
          {isSignUpActive ? (
            <Text style={styles.title}>Regisztráció</Text>
          ) : (
            <Text style={styles.title}>Bejelentkezés</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="email cím"
            value={email}
            onChangeText={setEmail}
          />
          {isSignUpActive && (
            <TextInput
              style={styles.input}
              placeholder="Név"
              value={userName}
              onChangeText={setUserName}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="jelszó"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          {isSignUpActive && (
            <TextInput
              style={styles.input}
              placeholder="jelszó mégegyszer"
              secureTextEntry={true}
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
            />
          )}
          {!isSignUpActive && (
            <TouchableOpacity onPress={reset}>
              <Text style={[styles.passwordReminder]}>Elfelejtett jelszó</Text>
            </TouchableOpacity>
          )}

          {isSignUpActive ? (
            <Button title="Regisztráció" onPress={register} />
          ) : (
            <Button title="Bejelentkezés" onPress={login} />
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    alignItems: 'center',
    // https://stackoverflow.com/a/59183680/9004180
    // fixing the scrolling of the FlatList
    // flex: 1 just means "take up the entire space" (whatever "entire" that may be).
    flex: 1,
    alignSelf: 'stretch',
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    marginVertical: 30,
    color: '#000000',
  },
  input: {
    height: 40,
    // width: 190,
    margin: 12,
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 20,
    color: '#000000',
  },
  formContainer: {
    paddingHorizontal: 40,
    alignSelf: 'stretch',
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? 20 : 20,
  },
  toggleButtonLeft: {
    marginTop: 20,
    paddingHorizontal: 50,
    paddingVertical: 14,
    borderWidth: 1,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },
  toggleButtonRight: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderWidth: 1,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
  },
  toggleButtonText: {
    fontSize: 17,
    color: 'black',
  },
  active: {
    backgroundColor: '#0851c7',
  },
  activeText: {
    color: '#ffffff',
  },
  passwordReminder: {
    textAlign: 'right',
    fontStyle: 'italic',
    fontSize: 12,
    paddingBottom: 20,
  },
});

export default LoginPage;
