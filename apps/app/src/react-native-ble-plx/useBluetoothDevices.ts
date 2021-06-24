import { useEffect, useMemo, useRef, useState } from "react";
import { BleManager, State, Device } from "react-native-ble-plx";
import { uniqBy } from "lodash";

export function useManager() {
  return useMemo(() => new BleManager(), []);
}

export function useManagerState(bleManager: BleManager): State | null {
  const [state, setState] = useState<State | null>(null);
  const isMounted = useMounted();

  useEffect(() => {
    if (!bleManager) return;

    bleManager.onStateChange((state) => {
      if (isMounted.current) {
        setState(state);
      }
    }, true);
  }, [bleManager]);

  return state;
}

function useMounted() {
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
}

export function useBluetoothDevices(
  bleManager: BleManager
): [Device[], null | string] {
  const isMoutned = useMounted();
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    bleManager.startDeviceScan(
      [],
      { allowDuplicates: false },
      (e, scannedDevice) => {
        if (!isMoutned.current) return;
        if (e) {
          setError(e.message);
        }

        if (!scannedDevice) return;

        setDevices((oldDevices) =>
          uniqBy([...oldDevices, scannedDevice], "id")
        );
      }
    );

    return () => {
      bleManager.stopDeviceScan();
    };
  }, [bleManager]);

  return [devices, error];
}

export default useBluetoothDevices;
