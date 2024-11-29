import { StyleSheet, Image, Text, View } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabTwoScreen() {
  return (
    <View>
      <View style={styles.titleContainer}>
        <IconSymbol size={28} name="paperplane.fill" color="#808080" />
        <Text style={{ color: "#808080", fontSize: 24 }}>Explore</Text>
      </View>
      <Image
        source={require("@/assets/images/react-logo.png")}
        style={styles.headerImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
