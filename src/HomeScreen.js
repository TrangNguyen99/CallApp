import React, {useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Voximplant} from 'react-native-voximplant';

const HomeScreen = ({navigation}) => {
  const [callee, setCallee] = useState('');

  const voximplant = Voximplant.getInstance();

  const onCall = () => {
    if (callee) {
      navigation.navigate('CallingScreen', {callee});
    }
  };

  useEffect(() => {
    voximplant.on(Voximplant.ClientEvents.IncomingCall, incomingCallEvent => {
      navigation.navigate('IncomingCallScreen', {call: incomingCallEvent.call});
    });

    return () => {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{flex: 1}}>
      <TextInput
        placeholder="Callee"
        value={callee}
        onChangeText={v => setCallee(v)}
      />
      <TouchableOpacity style={{backgroundColor: 'lightblue'}} onPress={onCall}>
        <Text style={{textAlign: 'center'}}>Call</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
