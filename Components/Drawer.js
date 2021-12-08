import React, { Component } from "react";
import { Text, StyleSheet, View, Image, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import CountrySelectionScreen from "./CountrySelectionScreen";
import GlobalConverage from "./Global";
import ContinentalData from "./Continents";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default class Drawer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const MyDrawer = createDrawerNavigator();
    return (
      <NavigationContainer>
        <MyDrawer.Navigator
          initialRouteName="Search"
          drawerContentOptions={{
            activeBackgroundColor: "#ff8282",
            activeTintColor: "white",
          }}
          drawerContent={(props) => <DrawerImage {...props} />}
        >
          <MyDrawer.Screen
            name="Search"
            component={CountrySelectionScreen}
            options={{
              drawerIcon: ({ color }) => (
                <Feather name="search" size={24} color={color} />
              ),
            }}
          />
          <MyDrawer.Screen
            name="Global Coverage"
            component={GlobalConverage}
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="md-globe" size={24} color={color} />
              ),
            }}
          />
          <MyDrawer.Screen
            name="Continental Coverage"
            component={ContinentalData}
            options={{
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="map-marker-radius"
                  size={24}
                  color={color}
                />
              ),
            }}
          />
        </MyDrawer.Navigator>
      </NavigationContainer>
    );
  }
}

const DrawerImage = (props) => {
  return (
    <View style={styles.container}>
      <Image style={styles.corona} source={require("./../assets/corona.png")} />
      <Text style={styles.drawerImageText}>Corona Virus</Text>
      <DrawerContentScrollView style={styles.drawerContent}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <Text style={styles.footerText}>© Developed by Mutahhar BM</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  corona: {
    width: "50%",
    height: "20%",
    backgroundColor: "#fff",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 30,
    resizeMode: "contain",
  },
  drawerImageText: {
    fontSize: 20,
    fontFamily: "Roboto",
    fontWeight: "600",
    color: "#eb4242",
    marginTop:2,
  },
  footerText:{
    padding: 10,
    fontSize: 12,
    color: "#000",
    fontFamily: "monospace",
  }
});
