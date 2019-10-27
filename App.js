import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  View,
} from 'react-native';
import Constants from 'expo-constants';

export default function App() {
  const [userMessage, setUserMessage] = useState();
  const [agentMessage, setAgentMessage] = useState();

  async function queryAgent(query) {
    try {
      setUserMessage(query);
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
      setAgentMessage(message);
    } catch (err) {
      console.error(err.message);
      Alert.alert('Error', 'There was an error querying the agent.', [
        {text: 'OK'},
      ]);
      setAgentMessage(err.message);
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.userMessageContainer}>
          <Text style={styles.userMessage}>{userMessage}</Text>
        </View>
        <View style={styles.agentMessageContainer}>
          <Text style={styles.agentMessage}>{agentMessage}</Text>
        </View>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          ref={input => {
            this.textInput = input;
          }}
          onSubmitEditing={event => {
            queryAgent(event.nativeEvent.text);
            this.textInput.clear();
          }}
        />
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
  userMessageContainer: {
    marginVertical: 20,
    marginRight: 5,
    marginLeft: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '80%',
  },
  agentMessageContainer: {
    marginVertical: 20,
    marginRight: 10,
    marginLeft: 5,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'space-around',
    width: '80%',
  },
  userMessage: {
    textAlign: 'right',
  },
  agentMessage: {
    textAlign: 'left',
  },
  form: {
    justifyContent: 'center',
  },
});
