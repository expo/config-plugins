import React from 'react';
import { Text, View } from 'react-native';

import useBluetoothDevices, { useManager, useManagerState } from './useBluetoothDevices';

export default function App() {
  const bleManager = useManager();
  const state = useManagerState(bleManager);

  console.log('Info:', state);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue'}}>
      <Text style={{fontSize: 18, color: 'white'}}>State: {state}</Text>
      {state === 'PoweredOn' && <DeviceScanner bleManager={bleManager} />}
    </View>
  );
}

function DeviceScanner({ bleManager }) {
  const [devices] = useBluetoothDevices(bleManager);

  React.useEffect(() => {
    console.log(devices);
  }, [devices]);
  
  return (
    <View>
      {devices.filter(({name}) => name).map((device, index) => (<Text key={`-${index}`} style={{fontSize: 14, color: 'white'}}>{device.name}</Text>))}
    </View>
  )
}
