import React, {useState} from 'react';
import {StyleSheet, Text, ScrollView, Alert, View} from 'react-native';

export default function App() {
  const [message, setMessage] = useState(
    'Something meaningful should probably go here.',
  );

  async function queryAgent(query) {
    try {
      const url = 'https://robopeterson-api.herokuapp.com/api/message';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: query}),
      });
      const response = await res.json();
      const message = response.message;
      setMessage(message);
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
