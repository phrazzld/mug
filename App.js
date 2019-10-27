import React, {useState} from 'react';
import {KeyboardAvoidingView, StyleSheet, Alert, View} from 'react-native';
import Constants from 'expo-constants';
import {Text, Input, ThemeProvider, Header} from 'react-native-elements';

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
    <ThemeProvider>
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Header
          centerComponent={{text: 'ROBOPETERSON', style: {color: 'white'}}}
        />
        <View style={styles.messagesContainer}>
          <View style={[styles.messageContainer, styles.userMessageContainer]}>
            <Text style={[styles.message, styles.userMessage]}>
              {userMessage}
            </Text>
          </View>
          <View style={[styles.messageContainer, styles.agentMessageContainer]}>
            <Text style={[styles.message, styles.agentMessage]}>
              {agentMessage}
            </Text>
          </View>
        </View>
        <View style={styles.form}>
          <Input
            style={styles.messageContainer}
            placeholder="Send a message..."
            ref={input => {
              this.textInput = input;
            }}
            onSubmitEditing={event => {
              queryAgent(event.nativeEvent.text);
              this.textInput.clear();
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  messagesContainer: {
    width: '100%',
    padding: 20,
  },
  messageContainer: {
    marginVertical: 20,
    padding: 5,
  },
  userMessageContainer: {
    borderColor: 'blue',
    borderBottomWidth: 1,
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    width: '80%',
  },
  agentMessageContainer: {
    borderColor: 'red',
    borderBottomWidth: 1,
    width: '80%',
  },
  userMessage: {
    textAlign: 'right',
  },
  agentMessage: {
    textAlign: 'left',
  },
  message: {
    fontSize: 16,
  },
  form: {
    justifyContent: 'center',
    width: '100%',
    padding: 20,
    marginTop: 20,
  },
});
