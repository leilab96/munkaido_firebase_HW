import React, { useEffect, useState } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { addHistory } from '../database';

const StatusPage = ({ navigation: { navigate }, userData, setUserData, toggleSwitch }) => {
  const [link, setLink] = useState('');
  const [loadStatusPage, setLoadStatusPage] = useState(true);

  //generateImage generálja a linket
  const generateImage = async () => {
    const urlString = 'https://inspirobot.me/api?generate=true';
    const response = await fetch(urlString);
    setLink(await response.text());
  };

  //toggleSwitch kikerült az InnerPage-be, statusUpdate megkapja a newState-t amivel felveheti a status megváltozását a history-ba és a link is legenerálódik az inspirational háttérhez
  const statusUpdate = () => {
    const newState = toggleSwitch();
    addHistory(userData.email, newState);
    generateImage();
  };

  //várja meg a link fetch-elését
  useEffect(() => {
    generateImage().then(() => setLoadStatusPage(false));
  }, []);

  return loadStatusPage ? null : (
    <View style={styles.container}>
      <View style={styles.settingsSection}>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigate('Beállítások')}>
          <Text style={styles.settingsButtonText}>Beállítások</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.appTitle}>Szia {userData.name}!</Text>
      <Text style={styles.statusText}>
        Jelenlegi státuszod: {userData.currentState === 'in' ? 'bejött' : 'távozott'}
      </Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={userData.currentState === 'in' ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={statusUpdate}
        value={userData.currentState === 'in'}
      />
      <TouchableOpacity onPress={() => navigate('Napló')} style={[styles.button, styles.shadow]}>
        <Text style={styles.buttonText}>Napló megtekintése</Text>
      </TouchableOpacity>
      <View>
        <Image style={styles.image} source={{ uri: link }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    // https://stackoverflow.com/a/59183680/9004180
    // fixing the scrolling of the FlatList
    // flex: 1 just means "take up the entire space" (whatever "entire" that may be).
    flex: 1,
  },
  appTitle: {
    textAlign: 'center',
    fontSize: 30,
    marginVertical: 30,
  },
  settingsSection: {
    alignSelf: 'stretch',
  },
  settingsButton: {
    alignSelf: 'stretch',
  },
  settingsButtonText: {
    marginRight: 'auto',
    fontStyle: 'italic',
    color: 'blue',
  },
  statusText: {
    fontSize: 18,
    margin: 15,
  },
  button: {
    margin: 50,
    alignSelf: 'stretch',
    textAlign: 'center',
    paddingVertical: '5%',
    paddingHorizontal: '7%',
    borderRadius: 20,
    color: 'blue',
    backgroundColor: '#0091ff',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 15,
    color: 'white',
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  //változtattam a kép méretein a korábbiakhoz képest, mert sok esetben a szöveg nem látszott
  image: {
    width: '110%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
});

export default StatusPage;
