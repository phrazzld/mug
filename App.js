import React from 'react';
import {KeyboardAvoidingView, StyleSheet, Text, View} from 'react-native';
import Constants from 'expo-constants';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  PROJECT_ID,
  AGENT_NAME,
  AGENT_AVATAR_URL,
  API_BASE_URL,
} from 'react-native-dotenv';

const uuidv4 = require('uuid/v4');

const formatAgentMessage = resJSON => {
  return {
    _id: uuidv4(),
    createdAt: new Date(),
    text: resJSON.video
      ? `${resJSON.message}\n${resJSON.video}`
      : resJSON.message,
    image: resJSON.meme ? resJSON.meme.image : '',
    user: {
      _id: PROJECT_ID,
      name: AGENT_NAME,
      avatar: AGENT_AVATAR_URL,
    },
  };
};

class App extends React.Component {
  state = {
    messages: [],
  };

  componentWillMount() {
    const deviceId = Constants.installationId;
    const url = `${API_BASE_URL}/${deviceId}`;
    fetch(url)
      .then(res => {
        if (res.status === 200) {
          res
            .json()
            .then(resJSON => {
              this.setState({
                messages: resJSON,
              });
            })
            .catch(err => {
              console.error(err);
            });
        } else {
          this.setState({
            messages: [formatAgentMessage({message: 'Well hello there.'})],
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    const deviceId = Constants.installationId;
    fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query: messages[0].text, deviceId: deviceId}),
    })
      .then(res => {
        res.json().then(resJSON => {
          const agentMessages = [formatAgentMessage(resJSON)];
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, agentMessages),
          }));
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={{flex: 1, width: '100%', height: '100%'}}
        behavior="padding"
        enabled>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: Constants.installationId,
          }}
        />
      </KeyboardAvoidingView>
    );
  }
}

export default App;
