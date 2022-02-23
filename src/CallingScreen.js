import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Voximplant} from 'react-native-voximplant';

const PERMISSIONS = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
];

const CallingScreen = ({navigation, route}) => {
  const [permissionGranted, setPermissionGranted] = useState(false);

  const voximplant = Voximplant.getInstance();
  const camera = Voximplant.Hardware.CameraManager.getInstance();
  const audio = Voximplant.Hardware.AudioDeviceManager.getInstance();

  const {callee, call: incomingCall, isIncomingCall} = route.params;
  const call = useRef(incomingCall);

  const [callStatus, setCallStatus] = useState('Initializing...');

  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');
  const endpoint = useRef(null);

  const [frontCamera, setFrontCamera] = useState(true);
  const [soundEarpiece, setSoundEarpiece] = useState(true);

  const onHangup = () => {
    call.current.hangup();
  };

  const onReverseCamera = () => {
    camera.switchCamera(
      frontCamera
        ? Voximplant.Hardware.CameraType.BACK
        : Voximplant.Hardware.CameraType.FRONT,
    );
    setFrontCamera(!frontCamera);
  };

  const onToggleSound = () => {
    audio.selectAudioDevice(
      soundEarpiece
        ? Voximplant.Hardware.AudioDevice.SPEAKER
        : Voximplant.Hardware.AudioDevice.EARPIECE,
    );
    setSoundEarpiece(!soundEarpiece);
  };

  useEffect(() => {
    const getPermissions = async () => {
      const granted = await PermissionsAndroid.requestMultiple(PERMISSIONS);
      const recordAudioGranted =
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
      const cameraGranted =
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';

      if (!cameraGranted || !recordAudioGranted) {
        Alert.alert('Permissions not granted');
      } else {
        setPermissionGranted(true);
      }
    };

    if (Platform.OS === 'android') {
      getPermissions();
    } else {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) {
      return;
    }

    const showError = reason => {
      Alert.alert('Call failed', `Reason: ${reason}`, [
        {
          text: 'OK',
          onPress: navigation.navigate('HomeScreen'),
        },
      ]);
    };

    const subscribeToCallEvents = () => {
      call.current.on(Voximplant.CallEvents.Failed, callEvent => {
        showError(callEvent.reason);
      });
      call.current.on(Voximplant.CallEvents.ProgressToneStart, callEvent => {
        setCallStatus('Calling...');
      });
      call.current.on(Voximplant.CallEvents.Connected, callEvent => {
        setCallStatus('Connected');
      });
      call.current.on(Voximplant.CallEvents.Disconnected, callEvent => {
        navigation.navigate('HomeScreen');
      });
      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamAdded,
        callEvent => {
          setLocalVideoStreamId(callEvent.videoStream.id);
        },
      );
      call.current.on(Voximplant.CallEvents.EndpointAdded, callEvent => {
        endpoint.current = callEvent.endpoint;
        subscribeToEndpointEvent();
      });
    };

    const subscribeToEndpointEvent = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        endpointEvent => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        },
      );
    };

    const callSettings = {
      video: {
        sendVideo: true,
        receiveVideo: true,
      },
    };

    const makeCall = async () => {
      call.current = await voximplant.call(callee, callSettings);
      subscribeToCallEvents();
    };

    const answerCall = () => {
      subscribeToCallEvents();
      endpoint.current = call.current.getEndpoints()[0];
      subscribeToEndpointEvent();
      call.current.answer(callSettings);
    };

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }

    return () => {
      call.current.off(Voximplant.CallEvents.Failed);
      call.current.off(Voximplant.CallEvents.ProgressToneStart);
      call.current.off(Voximplant.CallEvents.Connected);
      call.current.off(Voximplant.CallEvents.Disconnected);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionGranted]);

  return (
    <View style={{flex: 1}}>
      <Voximplant.VideoView
        videoStreamId={remoteVideoStreamId}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
      <Voximplant.VideoView
        videoStreamId={localVideoStreamId}
        showOnTop={true}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 100,
          height: 150,
        }}
      />
      <View style={{flex: 1}}>
        <Text style={{textAlign: 'center'}}>{callee}</Text>
        <Text style={{textAlign: 'center'}}>{callStatus}</Text>
      </View>
      <View style={{padding: 20}}>
        <TouchableOpacity
          style={{backgroundColor: 'lightblue'}}
          onPress={onHangup}>
          <Text style={{textAlign: 'center'}}>Hangup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{backgroundColor: 'lightblue', marginTop: 10}}
          onPress={onReverseCamera}>
          <Text style={{textAlign: 'center'}}>Reverse Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{backgroundColor: 'lightblue', marginTop: 10}}
          onPress={onToggleSound}>
          <Text style={{textAlign: 'center'}}>Sound</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CallingScreen;
