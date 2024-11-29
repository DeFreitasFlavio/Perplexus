import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import { MazeMoving } from "@/components/MazeMoving";
import useGyroscope from "@/hooks/useGyroscope";

export default function HomeScreen() {
  const gyroscopeData = useGyroscope();

  return (
    <View style={{ flex: 1 }}>
      <MazeMoving gyroscopeData={gyroscopeData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  text: {
    textAlign: "center",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
});
