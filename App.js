import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  WebView,
  Platform,
  Button
} from 'react-native';

import { createStackNavigator } from 'react-navigation';

const isAndroid = Platform.OS === 'android'

class HomeScreen extends React.Component {

   constructor(props) {
     super(props);
     this.state = {
       user: {
         id: "some_id_123",
         name: "Alex",
         email: "alex@example.com",
         welcomeMessage: "Hello"
       }
     };
   }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Id: {this.state.user.id} </Text>
        <Text>Name: {this.state.user.name}</Text>
        <Text>Email: {this.state.user.email}</Text>
        <Text>Welcome message: {this.state.user.welcomeMessage}</Text>
        <Button
          title= {"Talk with " + this.state.user.name}
          onPress={() => {
        this.props.navigation.navigate('Chatbox', {
          userToChat: this.state.user
        });
      }}
      />
    </View>
    );
  }
}

class ChatScreen extends React.Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: params.userToChat.name
    };
  };

  javascriptToInject = user => {
        return `
        Talk.ready.then(function() {
            
        var me = new Talk.User({
            id: "123456",
            name: "George Looney",
            email: "george@looney.net",
            photoUrl: "https://talkjs.com/docs/img/george.jpg"
          });
          window.talkSession = new Talk.Session({
            appId: "tHax9rb0",
            me: me
          });
          var other = new Talk.User({
            id: "${user.id}",
            name: "${user.name}",
            email: "${user.email}",
            welcomeMessage: "${user.welcomeMessage}"
          });


          var conversationId = Talk.oneOnOneId(me, other);

          var conversation = window.talkSession.getOrCreateConversation(conversationId);
          conversation.setParticipant(me);
          conversation.setParticipant(other);
          var chatbox = window.talkSession.createChatbox(conversation);
          chatbox.mount(document.getElementById("talkjs-container"));
        });
      `
    }

  render() {
    const { navigation } = this.props;
    const userToChat = navigation.getParam('userToChat');

    return (
        <WebView
          source={{ uri: isAndroid ? 'file:///android_asset/widget/index.html' : './widget/index.html' }}
          injectedJavaScript={this.javascriptToInject(userToChat)}
        />
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Chatbox: ChatScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
