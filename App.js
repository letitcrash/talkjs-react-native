import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  WebView,
  Platform
} from 'react-native';

const isAndroid = Platform.OS === 'android'

export default class WebViewTalkJs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        id: "myapp_id",
        name: "Alexandra McManahmanah",
        email: "alexandra@example.com",
        photoUrl: "https://talkjs.com/docs/img/george.jpg",
        welcomeMessage: "Hi there!"
      } 
    };
    this._onPressButton = this._onPressButton.bind(this);
  }

  _onPressButton() {
    let user = this.state.user;
    var msg = JSON.stringify(user);
    this.refs.myWebView.postMessage(msg);
  }

  render() {
    const injectedScript = function () {
      document.addEventListener('message', function (e) {
        user = JSON.parse(e.data)
        Talk.ready.then(function () {
          // The core TalkJS lib has loaded, so let's identify the current user to TalkJS.

          // TODO: replace the fields below with actual user data.
          var me = new Talk.User({
            // must be any value that uniquely identifies this user
            id: "123456",
            name: "George Looney",
            email: "george@looney.net",
            photoUrl: "https://talkjs.com/docs/img/george.jpg"
          });
          // TODO: add a "configuration" field to the user object so your
          // user can get email notifications.
          // See https://talkjs.com/docs/Emails_and_Configurations.html for more 
          // info.
          // TODO: replace the appId below with the appId provided in the Dashboard
          window.talkSession = new Talk.Session({
            appId: "tHax9rb0",
            me: me
          });
          // Let's show the chatbox.
          // First, we need to define who we want to talk to.
          var user_to_talk = new Talk.User({
            // just hardcode any user id, as long as your real users don't have this id
            id: user.id,
            name: user.name,
            email: user.email,
            photoUrl: user.photoUrl,
            welcomeMessage: user.welcomeMessage
          });


          var conversationId = Talk.oneOnOneId(me, user_to_talk);

          var conversation = window.talkSession.getOrCreateConversation(conversationId);
          conversation.setParticipant(me);
          conversation.setParticipant(user_to_talk);
          var chatbox = window.talkSession.createChatbox(conversation);
          chatbox.mount(document.getElementById("talkjs-container"));
        });
      });

    }

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this._onPressButton}>
          <Text>Press me to talk with {this.state.user.name}</Text>
        </TouchableHighlight>

        <WebView
          source={{ uri: isAndroid ? 'file:///android_asset/widget/index.html' : './widget/index.html' }}
          injectedJavaScript={'(' + String(injectedScript) + ')()'}
          ref="myWebView"
        />

      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  webView: {
    backgroundColor: '#fff',
    height: 50,
  }
});
