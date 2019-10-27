import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  View,
} from 'react-native';
//import {getUniqueId} from 'react-native-device-info';
import Constants from 'expo-constants';

export default function App() {
  const [message, setMessage] = useState();

  async function queryAgent(query) {
    try {
      const url = 'https://robopeterson-api.herokuapp.com/api/messages';
      const deviceId = Constants.installationId;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: query, deviceId: deviceId}),
      });
      const response = await res.json();
      const message = response.message;
      setMessage(message);
    } catch (err) {
      console.error(err.message);
      setMessage(err.message);
    }
  }

  /*
  if (message === 'Something meaningful should probably go here.') {
    const query = 'Say something funny';
    queryAgent(query);
  }
  */

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>{message}</Text>
      </View>
      <TextInput
        style={styles.input}
        onSubmitEditing={event => {
          queryAgent(event.nativeEvent.text);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
});
