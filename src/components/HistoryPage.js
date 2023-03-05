import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import trashIcon from '../../assets/Trash_font_awesome.js';

import { getHistory, deleteHistoryById } from '../database';

export default function HistoryPage(props) {
  const [history, setHistory] = useState([]);
  //Alert a törlés megerősítésére, ha lenyomjuk az OK-t --> törli a legutolsó bejegyzést és visszaváltoztatja a státuszt
  const createTwoButtonAlert = item => {
    Alert.alert('Biztos töröljem?', 'Biztos törlöd a bejegyzést?', [
      {
        text: 'Mégse',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          deleteHistoryById(props.userData.email, item.id);
          props.toggleSwitch();
          console.log('Document was deleted!');
        },
      },
    ]);
  };

  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.historyItemContainer,
        styles.shadow,
        item.state === 'in' ? styles.containerIn : styles.containerOut,
      ]}>
      <View style={styles.historyTextContainer}>
        <Text style={styles.currentStateText}>{item.date.toDate().toLocaleString('hu-HU')}</Text>
        <Text
          style={[
            styles.currentStateText,
            item.state === 'in' ? styles.currentStateTextIn : styles.currentStateTextOut,
          ]}>
          {item.state === 'in' ? 'bejött' : 'távozott'}
        </Text>
      </View>
      {index === 0 && (
        <TouchableOpacity
          onPress={() => {
            createTwoButtonAlert(item);
          }}>
          <SvgXml style={styles.trash} width="25px" height="25px" xml={trashIcon} />
        </TouchableOpacity>
      )}
    </View>
  );

  //useEffectben meghívott async function
  const historyLoader = async () => {
    const historyFromFirebase = await getHistory(props.userData.email);
    setHistory(historyFromFirebase);
  };
  //újratölt ha változik a history
  useEffect(() => {
    historyLoader();
  }, [history]);

  return (
    <View style={styles.container}>
      <FlatList data={history} renderItem={renderItem} keyExtractor={item => item.id} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'stretch',
    // https://stackoverflow.com/a/59183680/9004180
    // fixing the scrolling of the FlatList
    // flex: 1 just means "take up the entire space" (whatever "entire" that may be).
    flex: 1,
  },
  historyItemContainer: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    margin: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyTextContainer: {},
  currentStateText: {
    fontSize: 17,
    color: 'white',
  },
  containerIn: {
    backgroundColor: '#165BAA',
  },
  containerOut: {
    backgroundColor: '#173F5F',
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  trash: {
    color: 'red',
  },
});
