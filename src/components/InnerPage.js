import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { updateUserState } from '../database';
import HistoryPage from './HistoryPage';
import StatusPage from './StatusPage';
import SettingsPage from './SettingsPage';

const Stack = createNativeStackNavigator();

// prop drilling problem: https://kentcdodds.com/blog/prop-drilling
const InnerPage = ({ userData, setUserData }) => {
  //toggleSwitch kikerült ide, hogy a HistoryPage is tudja használni törléskor, de az addHistory csak a StatusPage-n kell (törléskor nem szükséges újra menteni a státuszt)
  const toggleSwitch = () => {
    let newState = '';
    if (userData.currentState === 'in') {
      newState = 'out';
    } else {
      newState = 'in';
    }
    setUserData({ ...userData, currentState: newState });
    updateUserState(userData.email, newState);
    //adja vissza a newState-t
    return newState;
  };
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Munkaidő Nyilvántartó">
          {navigatorProps => (
            <StatusPage
              {...navigatorProps}
              setUserData={setUserData}
              userData={userData}
              toggleSwitch={toggleSwitch}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Napló">
          {navigatorProps => (
            <HistoryPage {...navigatorProps} userData={userData} toggleSwitch={toggleSwitch} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Beállítások">
          {navigatorProps => (
            <SettingsPage {...navigatorProps} setUserData={setUserData} userData={userData} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default InnerPage;
