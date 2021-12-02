import { FFprobeKit, Session } from "ffmpeg-kit-react-native";
import React from "react";

function useMounted() {
  const isMounted = React.useRef(true);
  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
}

export function useResolvedValue<T>(
  method: () => Promise<T>
): [T | null, Error | null] {
  const [error, setError] = React.useState<Error | null>(null);
  const [value, setValue] = React.useState<T | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    method()
      .then((value) => {
        if (isMounted) {
          setValue(value);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setError(error);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return [value, error];
}

export function useMediaInfo(filePathOrUrl: string) {
  const [results, setResults] = React.useState<Session | undefined>(undefined);
  const isMounted = useMounted();
  React.useEffect(() => {
    FFprobeKit.getMediaInformationAsync(filePathOrUrl, async (session) => {
      if (isMounted) {
        setResults(session);
      }
    });
  }, [filePathOrUrl]);

  return results;
}
