import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Voximplant} from 'react-native-voximplant';

const IncomingCallScreen = ({navigation, route}) => {
  const {call} = route.params;
  const [caller, setCaller] = useState('');

  const onAccept = () => {
    navigation.navigate('CallingScreen', {
      call,
      isIncomingCall: true,
    });
  };

  const onDecline = () => {
    call.decline();
  };

  useEffect(() => {
    setCaller(call.getEndpoints()[0].displayName);
    call.on(Voximplant.CallEvents.Disconnected, callEvent => {
      navigation.navigate('HomeScreen');
    });
    return () => {
      call.off(Voximplant.CallEvents.Disconnected);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{flex: 1}}>
      <Text style={{fontWeight: 'bold', textAlign: 'center'}}>{caller}</Text>
      <TouchableOpacity
        style={{backgroundColor: 'lightblue', marginTop: 20}}
        onPress={onAccept}>
        <Text style={{textAlign: 'center'}}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{backgroundColor: 'lightblue', marginTop: 20}}
        onPress={onDecline}>
        <Text style={{textAlign: 'center'}}>Decline</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IncomingCallScreen;
