import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "@rneui/base";
import { useState } from "react";
import { Dimensions } from "react-native";
import { TextInput } from "react-native";
import * as SQLite from "expo-sqlite";
import { useEffect } from "react";

const { width, height } = Dimensions.get("window");
export default function Search() {
  const [searchText, setSearchText] = useState("");
  const [Matches, setMatches] = useState([]);
  const [hikesData, setHikesData] = useState([]);
  const [HasContent, setHasContent] = useState(false);
  const [InProgress, setInProgress] = useState(true);
  const database = SQLite.openDatabase("demo.db");
  useEffect(() => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM hikes",
        null,
        (txObj, resultSet) => setHikesData(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });
    setInProgress(false);
  }, [hikesData]);
  const fill = (searchText) => {
    const result = hikesData.filter((item) => item.name.includes(searchText));
    setMatches(result);
    setHasContent(true);
  };

  const handleFill = () => {
    fill(searchText);
  };
  if (InProgress) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.h1}>Search</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.item}>
          <TextInput
            style={styles.input}
            placeholder="Search Hike Data"
            onChangeText={(e) => setSearchText(e)}
          />
        </View>
        <View style={{ marginTop: 16 }}>
          <Button
            color="green"
            style={{ width: width * 0.9, borderRadius: 12, marginTop: 20 }}
            title="Search"
            onPress={handleFill}
          />
        </View>
      </View>
      <View style={styles.result}>
        <View style={{ width: width - 10 }}>
          <Text style={styles.h2}>Result</Text>
          <View style={styles.col}></View>
        </View>
        {HasContent && (
          <View style={styles.listItem}>
            {Matches.map((item, i) => (
              <View style={styles.item} key={item.id}>
                <TextInput style={styles.input}>{item.name}</TextInput>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: width,
    height: height,
    backgroundColor: "#fff",
  },
  title: {
    width: width * 0.9,
    top: 45,
  },
  h1: {
    fontSize: 30,
    fontWeight: "600",
    color: "black",
    alignSelf: "flex-start",
  },
  h2: {
    fontSize: 26,
    fontWeight: "500",
    color: "black",
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  body: {
    margin: "auto",
    width: width * 0.9,
    marginTop: 40,
  },
  item: {
    marginTop: 6,
    marginLeft: 14,
  },
  listItem: {
    marginTop: 14,
  },
  row: {
    flexDirection: "row",
  },
  col: {
    flex: 1,
  },
  result: {
    marginTop: 20,
  },
  input: {
    height: 50,
    borderColor: "#DDDDDD",
    width: width * 0.9,
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    fontSize: 15,
    color: "#585858",
  },
});
