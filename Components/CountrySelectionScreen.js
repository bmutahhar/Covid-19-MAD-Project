import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import InputScreen from "./InputScreen";
import CountryStats from "./Selection";
import { Feather } from "@expo/vector-icons";

export default class CountrySelectionScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            color: "black",
          },
        }}
      >
        <Stack.Screen
          name="Search"
          component={InputScreen}
          options={{
            headerLeft: ({ color }) => (
              <Feather
                style={{ marginLeft: 10 }}
                name="menu"
                size={30}
                color={color}
                onPress={() => this.props.navigation.toggleDrawer()}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Selected Country"
          component={CountryStats}
          options={({ route }) => ({ title: route.params.title })}
        />
      </Stack.Navigator>
    );
  }
}

const styles = StyleSheet.create({});
