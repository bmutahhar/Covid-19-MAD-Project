import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather, FontAwesome5,Octicons } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { format } from "date-fns";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

export default class ContinentalData extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <Tab.Navigator
        activeColor="white"
        inactiveColor="gray"
        labeled={true}
        shifting={true}
        barStyle={{
          backgroundColor: "#ff8282",
          paddingVertical: 7,
          paddingHorizontal: 2,
        }}
      >
        <Tab.Screen
          name="Asia"
          component={AsiaStack}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="globe-asia" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Australia"
          component={AustraliaStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Octicons name="globe" size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Africa"
          component={AfricaStack}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="globe-africa" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Europe"
          component={EuropeStack}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="globe-europe" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="S America"
          component={SouthAmerciaStack}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="globe-americas" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="N America"
          component={NorthAmerciaStack}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="globe-americas" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

class ContinentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      countriesApi: [],
    };
    this.url = `https://covid19-update-api.herokuapp.com/api/v1/world/continent/${this.props.continent.toLowerCase()}`;
  }

  fetchContinentData() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(this.url, requestOptions)
      .then((response) => response.json())
      .then((respJson) => {
        this.setState({
          loading: false,
          countriesApi: respJson.countries,
        });
      })
      .catch((error) =>
        Alert.alert("Error", "Server not responding. Please try again later!", [
          {
            text: "Ok",
            onPress: () => this.setState({ loading: false }),
          },
        ])
      );
  }

  componentDidMount() {
    this.fetchContinentData();
  }

  render() {
    if (this.state.loading) {
      return (
        <ActivityIndicator style={styles.activityIndicator} size="large" />
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.state.countriesApi}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.countryItem}
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate("Screen 2", {
                    item: item,
                    title: item.name,
                  });
                }}
              >
                <View>
                  <Text style={styles.title}>{item.name}</Text>
                  <View style={styles.rowContent}>
                    <Text style={styles.header}>Cases: </Text>
                    <Text style={styles.cases}>{item.cases}</Text>
                  </View>
                  <View style={styles.rowContent}>
                    <Text style={styles.header}>Deaths: </Text>
                    <Text style={styles.deaths}>{item.deaths}</Text>
                  </View>
                </View>
                <View>
                  <Text style={{ fontSize: 32 }}>»</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

class Country extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slug: "",
      dayone: [],
      current: [],
      loadingList: true,
      loadingCountryData: true,
      error: false,
    };
  }

  fetchCountriesList() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("https://api.covid19api.com/countries", requestOptions)
      .then((response) => response.json())
      .then((respJson) => {
        let itemName = this.props.route.params.item.name;
        let country = respJson.find((item) => {
          if (item.Country.length >= itemName.length)
            return item.Country.toLowerCase().includes(itemName.toLowerCase());
          else {
            return itemName.toLowerCase().includes(item.Country.toLowerCase());
          }
        });
        this.setState({ slug: country.Slug, loadingList: false });
        this.fetchCountryData();
      })
      .catch((error) => {
        this.setState({ error: true });
        Alert.alert("Error", "Server not responding. Please try again later!", [
          {
            text: "Ok",
            onPress: () => {
              this.props.navigation.goBack(null);
            },
          },
        ]);
      });
  }

  fetchCountryData() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `https://api.covid19api.com/dayone/country/${this.state.slug}`;
    console.log(url)
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((respJson) => {
        this.setState({
          loadingCountryData: false,
          dayone: respJson[0],
          current: respJson[respJson.length - 1],
          slug: "",
        });
      })
      .catch((error) => {
        this.setState({ error: true });
        Alert.alert("Error", "Server not responding. Please try again later!", [
          {
            text: "Ok",
            onPress: () => this.props.navigation.goBack(null),
          },
        ]);
      });
  }

  formatDate(date) {
    let d = new Date(date);
    let formattedDate = format(d, "MMMM dd, yyyy");
    return formattedDate;
  }

  componentDidMount() {
    this.fetchCountriesList();
  }

  render() {
    if (this.state.loadingCountryData) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator style={{}} size="large" />
          <Text style={{ alignSelf: "center" }}>
            Please wait the data is loading...
          </Text>
        </View>
      );
    } else if (this.state.dayone !== undefined) {
      let date = this.formatDate(this.state.dayone.Date);
      return (
        <View style={styles.container}>
          <View style={styles.dayoneHeaderContainer}>
            <Text style={styles.dayoneHeaderText}>Stats For Day One</Text>
          </View>
          <View style={styles.firstCaseContainer}>
            <Text style={styles.firstCaseDate}>{date}</Text>
            <Text style={styles.firstCaseHeader}>First case reported on</Text>
          </View>
          <View style={styles.firstCaseNumberContainer}>
            <Text style={styles.firstCaseNumber}>
              {this.state.dayone.Confirmed}
            </Text>
            <Text style={styles.firstCaseText}>case/s reported on {date}</Text>
          </View>
          <View style={styles.overallHeaderContainer}>
            <Text style={styles.overallHeaderText}>Overall Statistics </Text>
          </View>
          <View style={styles.totalContent}>
            <View style={styles.row}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalConfirmedNumber}>
                  {formatNumber(this.state.current.Confirmed)}
                </Text>
                <Text style={styles.totalConfirmedText}>Total Confirmed</Text>
              </View>
              <View style={styles.totalContainer}>
                <Text style={styles.totalDeathsNumber}>
                  {formatNumber(this.state.current.Deaths)}
                </Text>
                <Text style={styles.totalDeathsText}>Total Deaths</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalRecoveredNumber}>
                  {formatNumber(this.state.current.Recovered)}
                </Text>
                <Text style={styles.totalRecoveredText}>Total Recovered</Text>
              </View>
              <View style={styles.totalContainer}>
                <Text style={styles.totalActiveNumber}>
                  {formatNumber(this.state.current.Active)}
                </Text>
                <Text style={styles.totalActiveText}>Active Cases</Text>
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 16, alignSelf: "center" }}>
            Error Occurred! Try again Later.
          </Text>
        </View>
      );
    }
  }
}

const Asia = ({ navigation }) => (
  <ContinentComponent continent="Asia" navigation={navigation} />
);
const Africa = ({ navigation }) => (
  <ContinentComponent continent="Africa" navigation={navigation} />
);
const Europe = ({ navigation }) => (
  <ContinentComponent continent="Europe" navigation={navigation} />
);
const Australia = ({ navigation }) => (
  <ContinentComponent continent="Australia" navigation={navigation} />
);
const NorthAmerica = ({ navigation }) => (
  <ContinentComponent continent="North America" navigation={navigation} />
);
const SouthAmerica = ({ navigation }) => (
  <ContinentComponent continent="South America" navigation={navigation} />
);

const StackNavigator = (props) => (
  <Stack.Navigator>
    <Stack.Screen
      name={props.name}
      component={props.component}
      options={{
        headerLeft: ({ color }) => (
          <Feather
            style={{ marginLeft: 10 }}
            name="menu"
            size={30}
            color={color}
            onPress={() => props.navigation.toggleDrawer()}
          />
        ),
      }}
    />
    <Stack.Screen
      name="Screen 2"
      component={props.screen2}
      options={({ route }) => ({ title: route.params.title })}
    />
  </Stack.Navigator>
);

const AsiaStack = ({ navigation }) => (
  <StackNavigator
    name="Asia"
    component={Asia}
    screen2={Country}
    navigation={navigation}
  />
);
const AfricaStack = ({ navigation }) => (
  <StackNavigator
    name="Africa"
    component={Africa}
    navigation={navigation}
    screen2={Country}
  />
);
const EuropeStack = ({ navigation }) => (
  <StackNavigator
    name="Europe"
    component={Europe}
    navigation={navigation}
    screen2={Country}
  />
);
const AustraliaStack = ({ navigation }) => (
  <StackNavigator
    name="Australia"
    component={Australia}
    navigation={navigation}
    screen2={Country}
  />
);
const NorthAmerciaStack = ({ navigation }) => (
  <StackNavigator
    name="North America"
    component={NorthAmerica}
    navigation={navigation}
    screen2={Country}
  />
);
const SouthAmerciaStack = ({ navigation }) => (
  <StackNavigator
    name="South America"
    component={SouthAmerica}
    navigation={navigation}
    screen2={Country}
  />
);

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
  },
  activityIndicator: {
    flex: 1,
    backgroundColor: "#fff",
    alignContent: "center",
    justifyContent: "center",
  },
  list: {
    marginHorizontal: 5,
  },
  rowContent: {
    flexDirection: "row",
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 3,
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  title: {
    fontSize: 20,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  header: {
    fontSize: 16,
    fontFamily: "Roboto",
  },
  cases: {
    fontSize: 16,
    fontFamily: "Roboto",
  },
  deaths: {
    fontSize: 16,
    fontFamily: "Roboto",
    color: "red",
  },
  dayoneHeaderContainer: {
    backgroundColor: "darkred",
    justifyContent: "center",
  },
  dayoneHeaderText: {
    color: "#fff",
    fontFamily: "monospace",
    fontSize: 16,
    padding: 5,
    marginHorizontal: 5,
  },
  firstCaseContainer: {
    width: "80%",
    height: "20%",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgreen",
    marginHorizontal: "10%",
    marginTop: "5%",
    marginBottom: "3%",
  },
  firstCaseHeader: {
    fontSize: 16,
    fontFamily: "Roboto",
    color: "#fff",
    letterSpacing: 1,
    marginVertical: 10,
  },
  firstCaseDate: {
    marginVertical: 20,
    fontSize: 28,
    fontFamily: "sans-serif",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  firstCaseNumberContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "#ddd",
  },
  firstCaseText: {
    fontSize: 18,
    fontFamily: "Roboto",
    color: "#eb4034",
    padding: 5,
    alignSelf: "center",
  },
  firstCaseNumber: {
    fontSize: 24,
    fontFamily: "Roboto",
    color: "darkred",
  },
  overallHeaderContainer: {
    backgroundColor: "darkred",
    justifyContent: "center",
    marginTop: 40,
  },
  overallHeaderText: {
    color: "#fff",
    fontFamily: "monospace",
    fontSize: 16,
    padding: 5,
    marginHorizontal: 5,
  },
  totalContent: {
    flex: 1,
    margin: 10,
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 10,
    flex: 1,
  },
  totalContainer: {
    flex: 1,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  totalConfirmedNumber: {
    fontSize: 28,
    fontFamily: "monospace",
  },
  totalConfirmedText: {
    fontSize: 16,
  },
  totalDeathsNumber: {
    fontSize: 28,
    color: "red",
    fontFamily: "monospace",
  },
  totalDeathsText: {
    fontSize: 16,
  },
  totalRecoveredNumber: {
    fontSize: 28,
    color: "green",
    fontFamily: "monospace",
  },
  totalRecoveredText: {
    fontSize: 16,
  },
  totalActiveNumber: {
    fontSize: 28,
    fontFamily: "monospace",
  },
  totalActiveText: {
    fontSize: 16,
  },
});
