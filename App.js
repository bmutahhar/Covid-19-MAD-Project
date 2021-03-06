import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Drawer from "./Components/Drawer";

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Drawer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignContent: "center",
    justifyContent: "center",
  },
});
