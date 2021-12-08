import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

export default class InputScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCountry: "",
      countriesList: [],
      filteredCountries: [],
      loading: true,
    };
  }

  fetchCountries() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    return fetch("https://api.covid19api.com/countries", requestOptions)
      .then((response) => response.json())
      .then((Json) => {
        this.setState({ loading: false, countriesList: Json });
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
    this.fetchCountries();
  }

  filterSearch = (text) => {
    if (text.length === 0) {
      this.setState({ filteredCountries: [], userCountry: "" });
    } else {
      const filteredCountries = this.state.countriesList.filter((countryObj) =>
        countryObj.Country.toLowerCase().includes(text.toLowerCase())
      );
      if ( filteredCountries.length===1 && filteredCountries[0].Country.toLowerCase() === text.toLowerCase()) {
        this.setState({
          filteredCountries: [],
          userCountry: text,
        });
      } else {
        this.setState({
          filteredCountries: filteredCountries,
          userCountry: text,
        });
      }
    }
  };

  selectCountry = (country) => {
    Keyboard.dismiss();
    this.setState({
      userCountry: '',
      filteredCountries: [],
    });
    this.props.navigation.navigate("Selected Country", {
      slug: country.Slug,
      title: country.Country
    });
  };

  searchCountry = () => {
    if (this.state.userCountry.length != 0) {
      const country = this.state.countriesList.find(
        (item) => item.Country.toLowerCase() === this.state.userCountry.toLowerCase()
      );
      if (country != undefined) {
        this.setState({
          userCountry: '',
        });
        this.props.navigation.navigate("Selected Country", {
          slug: country.Slug,
          title: country.Country
        });

      } else {
        Alert.alert(
          "Error",
          "This country does not exist. Kindly check for the typo in the country name.",
          [
            {
              text: "Ok",
              onPress: () => this.setState({ loading: false }),
            },
          ]
        );
      }
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <ActivityIndicator style={styles.activityIndicator} size="large" />
      );
    }
    return (
      <View style={styles.container}>
        <Image style={styles.corona} source={require("../assets/corona.png")} />
        <View style={styles.title}>
          <Text style={styles.titleText}>COVID 19 Global Coverage</Text>
        </View>
        <View style={styles.inputField}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a country name..."
            value={this.state.userCountry}
            onChangeText={(text) => this.filterSearch(text)}
          />
          <TouchableOpacity
            style={styles.inputButton}
            onPress={this.searchCountry}
          >
            <Text style={styles.inputButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.suggestionBox}>
          <FlatList
            data={this.state.filteredCountries}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestion}
                onPress={() => {this.selectCountry(item)
                }}
              >
                <Text style={styles.suggestionText}>{item.Country}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  activityIndicator: {
    flex: 1,
    backgroundColor: "#fff",
    alignContent: "center",
    justifyContent: "center",
  },
  corona: {
    width: "70%",
    height: "30%",
    backgroundColor: "#fff",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 20,
    resizeMode: "contain",
  },
  title: {
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  titleText: {
    fontSize: 28,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#eb4242",
  },
  inputField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginHorizontal: 10,
  },
  textInput: {
    borderBottomWidth: 2,
    width: "78%",
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
  },
  inputButton: {
    backgroundColor: "#eb4242",
    borderRadius: 10,
    width: "22%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    margin: 5,
  },
  inputButtonText: {
    fontSize: 20,
    color: "white",
  },
  suggestionBox: {
    backgroundColor: "#fff",
    margin: 10,
    top: -10,
  },
  suggestionText: {
    fontSize: 18,
    paddingHorizontal: 5,
    paddingVertical: 15,
  },

  suggestion: {
    borderBottomWidth: 1,
    borderBottomColor: "#b5b5b5",
  },
});
