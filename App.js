import React, {useState} from 'react';
import {StyleSheet, Text, ScrollView, Alert, View} from 'react-native';

export default function App() {
  const [message, setMessage] = useState(
    'Something meaningful should probably go here.',
  );

  async function queryAgent(query) {
    try {
      let url = `https://robopeterson-api.herokuapp.com/api/message?query=${query}`;
      let res = await fetch(url, {
        method: 'POST',
      });
      let body = await res.text();
      setMessage(body);
    } catch (err) {
      console.error(err.message);
      setMessage(err.message);
    }
  }

  if (message === 'Something meaningful should probably go here.') {
    const query = 'Say something funny';
    queryAgent(query);
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>{message}</Text>
      </View>
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
});
