import React from 'react';
import {KeyboardAvoidingView, StyleSheet, Text, View} from 'react-native';
import Constants from 'expo-constants';
import {GiftedChat} from 'react-native-gifted-chat';

const uuidv4 = require('uuid/v4');

class App extends React.Component {
  state = {
    messages: [],
  };

  componentWillMount() {
    const deviceId = Constants.installationId;
    const url = `https://robopeterson-api.herokuapp.com/api/messages/${deviceId}`;
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
            messages: [
              {
                _id: uuidv4(),
                createdAt: new Date(),
                text: 'Well hello there.',
                user: {
                  _id: 'robopeterson-95686',
                  name: 'robopeterson-95686',
                  avatar: 'https://f4.bcbits.com/img/a2965037780_10.jpg',
                },
              },
            ],
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
    const url = 'https://robopeterson-api.herokuapp.com/api/messages';
    const deviceId = Constants.installationId;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query: messages[0].text, deviceId: deviceId}),
    })
      .then(res => {
        res.json().then(resJSON => {
          const agentMessages = [
            {
              _id: uuidv4(),
              createdAt: new Date(),
              text: resJSON.video
                ? `${resJSON.message}\n${resJSON.video}`
                : resJSON.message,
              image: resJSON.meme ? resJSON.meme.image : '',
              user: {
                _id: 'robopeterson-95686',
                name: 'robopeterson-95686',
                avatar: 'https://f4.bcbits.com/img/a2965037780_10.jpg',
              },
            },
          ];
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
