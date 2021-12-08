import React, { Component } from "react";
import { Text, StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";

export default class GlobalConverage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      globalData: {},
    };
  }

  fetchGlobalData = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    

    fetch("https://api.covid19api.com/summary", requestOptions)
      .then((response) => response.json())
      .then((respJson) => this.setState({ loading: false,globalData: respJson.Global }))
      .catch((error) => Alert.alert("Error",
      "Server not responding. Please try again later!",
      [
        {
          text:'Ok',
          onPress:()=>this.setState({ loading: false})
        }
      ]));
  };

  componentDidMount() {
    this.fetchGlobalData();
  }

  GlobalComponent = () => <Global data={this.state.globalData} />;

  render() {
    const Stack = createStackNavigator();
    if (this.state.loading) {
      return (
        <ActivityIndicator style={styles.activityIndicator} size="large" />
      );
    }
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Global Coverage"
          component={this.GlobalComponent}
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
      </Stack.Navigator>
    );
  }
}


const Global = (props) => {
  
  return (
    <View style={styles.container}>
      <View style={styles.total}>
        <View style={styles.totalConfirmed}>
          <Text style={styles.totalConfirmedText}>{formatNumber(props.data.TotalConfirmed)}</Text>
          <Text style={styles.totalConfirmedHeader}>Total Confirmed</Text>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <View style={styles.barContainer}>
          <View>
            <View style={styles.totalRecoveredBar}></View>
            <Text style={styles.header}>Total Recovered</Text>
          </View>
          <Text style={styles.totalRecoveredText}>{formatNumber(props.data.TotalRecovered)}</Text>
        </View>
        <View style={styles.barContainer}>
          <View>
            <View style={styles.totalDeathsBar}></View>
            <Text style={styles.header}>Total Deaths</Text>
          </View>
          <Text style={styles.totalDeathsText}>{formatNumber(props.data.TotalDeaths)}</Text>
        </View>
        <View style={styles.barContainer}>
          <View>
            <View style={styles.newConfirmedBar}></View>
            <Text style={styles.header}>Confirmed(24 hrs)</Text>
          </View>
          <Text style={styles.newConfirmedText}>{formatNumber(props.data.NewConfirmed)}</Text>
        </View>
        <View style={styles.barContainer}>
          <View>
            <View style={styles.newDeathsBar}></View>
            <Text style={styles.header}>Deaths(24 hrs)</Text>
          </View>
          <Text style={styles.newDeathsText}>{formatNumber(props.data.NewDeaths)}</Text>
        </View>
        <View style={styles.barContainer}>
          <View>
            <View style={styles.newRecoveredBar}></View>
            <Text style={styles.header}>Recovered(24 hrs)</Text>
          </View>
          <Text style={styles.newRecoveredText}>{formatNumber(props.data.NewRecovered)}</Text>
        </View>
      </View>
    </View>
  );
};

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#eee",
    marginTop: "15%",
  },
  activityIndicator: {
    flex: 1,
    backgroundColor: "#fff",
    alignContent: "center",
    justifyContent: "center",
  },
  totalConfirmed: {
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#de3131",
    backgroundColor: "#de3131",
  },
  totalConfirmedText: {
    fontSize: 34,
    color: "white",
    fontFamily: "Roboto",
    fontWeight: "600",
    letterSpacing: 2,
  },
  totalConfirmedHeader: {
    fontSize: 16,
    color: "white",
    fontFamily: "Roboto",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  barContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee",
    marginHorizontal: 5,
    marginVertical: 10,
  },
  header: {
    fontSize: 18,
    fontFamily: "Roboto",
  },
  totalRecoveredBar: {
    backgroundColor: "green",
    height: 5,
    width: 25,
  },
  totalRecoveredText: {
    marginLeft: 15,
    color: "green",
    fontSize: 22,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },

  totalDeathsBar: {
    backgroundColor: "#96000d",
    height: 5,
    width: 25,
  },

  totalDeathsText: {
    marginLeft: 15,
    color: "#96000d",
    fontSize: 22,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  newConfirmedBar: {
    backgroundColor: "#14c972",
    height: 5,
    width: 25,
  },
  newConfirmedText: {
    marginLeft: 15,
    color: "#14c972",
    fontSize: 22,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  newDeathsBar: {
    backgroundColor: "red",
    height: 5,
    width: 25,
  },
  newDeathsText: {
    marginLeft: 15,
    color: "red",
    fontSize: 22,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  newRecoveredBar: {
    backgroundColor: "#46e8b2",
    height: 5,
    width: 25,
  },
  newRecoveredText: {
    marginLeft: 15,
    color: "#46e8b2",
    fontSize: 22,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
});
