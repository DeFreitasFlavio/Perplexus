import { Gyroscope } from "expo-sensors";
import { Subscription } from "expo-sensors/build/DeviceSensor";
import { useEffect, useState, useRef } from "react";
import { GyroscopeData } from "@/types/types";

function useGyroscope(
  options = {
    smoothing: 0.1,
    sensitivity: 1,
    maxTilt: 2,
  }
) {
  const [data, setData] = useState<GyroscopeData>({
    x: 0,
    y: 0,
    z: 0,
  });

  const calibrationRef = useRef<GyroscopeData | null>(null);
  const accumulatedValues = useRef<GyroscopeData>({
    x: 0,
    y: 0,
    z: 0,
  });

  const accumulatedValuesAfter = useRef<GyroscopeData>({
    x: 0,
    y: 0,
    z: 0,
  });

  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const _subscribe = (): void => {
    setSubscription(
      Gyroscope.addListener((gyroscopeData: GyroscopeData) => {
        // Calibrer si nécessaire
        if (!calibrationRef.current) {
          calibrationRef.current = { ...gyroscopeData };
          return;
        }

        const applyDeadzone = (value: number, deadzone: number): number => {
          if (Math.abs(value) < deadzone) {
            return (value = 0); // Garde la valeur actuelle au lieu de la mettre à zéro
          } else {
            //  console.log(value);
            return value;
          }
        };

        // Accumuler les valeurs avec la sensibilité
        accumulatedValues.current = {
          x: applyDeadzone(
            accumulatedValues.current.x +
              (gyroscopeData.x - calibrationRef.current.x) *
                options.sensitivity,
            1
          ),
          y: applyDeadzone(
            accumulatedValues.current.y +
              (gyroscopeData.y - calibrationRef.current.y) *
                options.sensitivity,
            1
          ),
          z: applyDeadzone(
            accumulatedValues.current.z +
              (gyroscopeData.z - calibrationRef.current.z) *
                options.sensitivity,
            1
          ),
        };

        //console.log(accumulatedValues.current.y.toFixed(3));

        // Appliquer le lissage
        if (Math.sign(accumulatedValues.current.x) === 1) {
          // La valeur est positive
          if (
            accumulatedValues.current.x < gyroscopeData.x + 15 ||
            gyroscopeData.x < 0
          ) {
            accumulatedValuesAfter.current.x = accumulatedValues.current.x;
          } else {
            accumulatedValues.current.x = 0;
          }
          if (
            accumulatedValues.current.y < gyroscopeData.y + 15 ||
            gyroscopeData.y < 0
          ) {
            accumulatedValuesAfter.current.y = accumulatedValues.current.y;
          } else {
            accumulatedValues.current.y = 0;
          }
          if (
            accumulatedValues.current.z < gyroscopeData.z + 15 ||
            gyroscopeData.z < 0
          ) {
            accumulatedValuesAfter.current.z = accumulatedValues.current.z;
          } else {
            accumulatedValues.current.z = 0;
          }
          if (
            accumulatedValues.current.x > 20 ||
            accumulatedValues.current.y > 20 ||
            accumulatedValues.current.z > 20
          ) {
            accumulatedValues.current.x = 0;
            accumulatedValues.current.y = 0;
            accumulatedValues.current.z = 0;
          }
        }
        // La valeur est négative
        if (Math.sign(accumulatedValues.current.x) === -1) {
          if (
            accumulatedValues.current.x > gyroscopeData.x - 15 ||
            gyroscopeData.x > 0
          ) {
            accumulatedValuesAfter.current.x = accumulatedValues.current.x;
          } else {
            accumulatedValues.current.x = 0;
          }
          if (
            accumulatedValues.current.y < gyroscopeData.y - 15 ||
            gyroscopeData.y > 0
          ) {
            accumulatedValuesAfter.current.y = accumulatedValues.current.y;
          } else {
            accumulatedValues.current.y = 0;
          }
          if (
            accumulatedValues.current.z < gyroscopeData.z - 15 ||
            gyroscopeData.z > 0
          ) {
            accumulatedValuesAfter.current.z = accumulatedValues.current.z;
          } else {
            accumulatedValues.current.z = 0;
          }
          if (
            accumulatedValues.current.x > -20 ||
            accumulatedValues.current.y > -20 ||
            accumulatedValues.current.z > -20
          ) {
            accumulatedValues.current.x = 0;
            accumulatedValues.current.y = 0;
            accumulatedValues.current.z = 0;
          }
        }

        // Appliquer les limites sans remettre à zéro
        const limitedValues = {
          x: Math.max(
            -options.maxTilt,
            Math.min(options.maxTilt, accumulatedValuesAfter.current.x)
          ),
          y: Math.max(
            -options.maxTilt,
            Math.min(options.maxTilt, accumulatedValuesAfter.current.y)
          ),
          z: Math.max(
            -options.maxTilt,
            Math.min(options.maxTilt, accumulatedValuesAfter.current.z)
          ),
        };

        setData(limitedValues);
      })
    );
  };

  const _unsubscribe = (): void => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    Gyroscope.setUpdateInterval(60);
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return {
    ...data,
  };
}

export default useGyroscope;
