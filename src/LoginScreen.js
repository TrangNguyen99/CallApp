import React, {useEffect, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Voximplant} from 'react-native-voximplant';
import {ACC_NAME, APP_NAME} from './constant';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const voximplant = Voximplant.getInstance();

  const redirectHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'HomeScreen',
        },
      ],
    });
  };

  const onLogin = async () => {
    try {
      const _username = `${username}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
      await voximplant.login(_username, password);

      redirectHome();
    } catch (e) {
      Alert.alert(e.name, `Error code: ${e.code}`);
    }
  };

  useEffect(() => {
    const connect = async () => {
      const status = await voximplant.getClientState();
      if (status === Voximplant.ClientState.DISCONNECTED) {
        await voximplant.connect();
      } else if (status === Voximplant.ClientState.LOGGED_IN) {
        redirectHome();
      }
    };

    connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{flex: 1}}>
      <TextInput
        placeholder="username"
        value={username}
        onChangeText={v => setUsername(v)}
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={v => setPassword(v)}
      />
      <TouchableOpacity
        style={{backgroundColor: 'lightblue'}}
        onPress={onLogin}>
        <Text style={{textAlign: 'center'}}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
