import React, { Component } from "react";
import { Text, StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { format } from "date-fns";

export default class CountryStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dayone: {},
      current: {},
    };
    this.url = `https://api.covid19api.com/dayone/country/${this.props.route.params.slug}`;
  }

  fetchCountryData() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(this.url, requestOptions)
      .then((response) => response.json())
      .then((respJson) => {
        console.log(this.url)
        this.setState({
          loading: false,
          dayone: respJson[0],
          current: respJson[respJson.length - 1],
          slug: "",
        });
      })
      .catch((error) =>
        Alert.alert("Error", "Server not responding. Please try again later!", [
          {
            text: "Ok",
            onPress: () => this.props.navigation.goBack(null),
          },
        ])
      );
  }

  componentDidMount() {
    this.fetchCountryData();
  }

  formatDate(date) {
    let d = new Date(date);
    let formattedDate = format(d, "MMMM dd, yyyy");
    return formattedDate;
  }

  render() {
    if (this.state.loading) {
      return (
        <ActivityIndicator style={styles.activityIndicator} size="large" />
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
    }
    else{
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize:16, alignSelf: "center"}}>Error Occurred! Try again Later.</Text>
        </View>
      )
    }
  }
}

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
