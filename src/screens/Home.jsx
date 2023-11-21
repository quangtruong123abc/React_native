import { View, Text } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
import { TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Dialog } from "@rneui/themed";
import { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

const { width, height } = Dimensions.get("window");
export default function Home() {
  const [hikes, setHikes] = useState([]);
  const database = SQLite.openDatabase("demo.db", {
    onCreate: (database) => {
      database.executeSql(
        "CREATE TABLE IF NOT EXISTS hikes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT, dateHike TEXT, selectedIndex INTEGER, lenghtHight INTEGER, level TEXT, desc TEXT) "
      );
    },
  });
  const [fetchingData, setFetchingData] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [visible, setVisible] = useState(false);
  const nav = useNavigation();

  const handleDetail = (id) => {
    nav.navigate("Edit", { id });
  };

  const toggleDialog = () => {
    setHasError(!hasError);
  };
  const toggleDialog2 = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    database.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS hikes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT, dateHike TEXT, selectedIndex INTEGER, lenghtHight INTEGER, level TEXT, desc TEXT) "
      );
      tx.executeSql(
        "SELECT * FROM hikes",
        null,
        (txObj, resultSet) => setHikes(resultSet.rows._array),
        (txObj, hasError) => console.log(hasError)
      );
    });
    setFetchingData(false);
  }, [hikes]);
  const deleteHike = (id) => {
    database.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM hikes WHERE id = ?",
        [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingHikes = [...hikes].filter((hike) => hike.id !== id);
            setHikes(existingHikes);
          }
        },
        (txObj, hasError) => console.log(hasError)
      );
    });
  };
  const deleteAllHikes = () => {
    database.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM hikes;",
        null,
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            console.log("Deleted all data");
          }
        },
        (txObj, hasError) => console.log(hasError)
      );
    });
  };
  if (fetchingData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ marginLeft: 10, marginRight: 10 }}>
        <View
          style={{
            top: 30,
            justifyContent: "center",
            alignItems: "center",
            margin: 10,
          }}
        >
          {hasError === true ? (
            <Dialog isVisible={hasError} onBackdropPress={toggleDialog}>
              <Dialog.Title title="Confirm" />
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Text>Do you want to delete it? </Text>
              </View>
              <Dialog.Actions>
                <Dialog.Button
                  title="OK"
                  onPress={() => {
                    deleteAllHikes();
                    setHasError(false);
                  }}
                />
                <Dialog.Button
                  title="CANCEL"
                  onPress={() => {
                    setHasError(false);
                  }}
                />
              </Dialog.Actions>
            </Dialog>
          ) : (
            ""
          )}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.h1}>Home Page</Text>
            </View>
            <View style={styles.col}>
              <Button color="#F64949" radius={"md"} onPress={toggleDialog}>
                Delete All
              </Button>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          {hikes.map((item) => (
            <View style={styles.row} key={item.id}>
              <View style={styles.col}>
                <Text style={styles.input}>{item.name}</Text>
              </View>
              <View style={styles.col}>
                <View style={{ marginTop: 8 }}>
                  <View style={styles.row}>
                    <View style={styles.col}>
                      <Button
                        radius={"md"}
                        onPressIn={() => handleDetail(item.id)}
                        size="md"
                        color={"green"}
                      >
                        More
                      </Button>
                    </View>
                    <View style={styles.col}>
                      <Button
                        color={"red"}
                        onPressIn={toggleDialog2}
                        size="md"
                        radius={"md"}
                      >
                        Delete
                      </Button>
                    </View>
                  </View>
                </View>
              </View>
              {visible === true ? (
                <Dialog isVisible={visible} onBackdropPress={toggleDialog2}>
                  <Dialog.Title title="Confirm" />
                  <View
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Text>Do you want to delete {item.name}? </Text>
                  </View>
                  <Dialog.Actions>
                    <Dialog.Button
                      title="OK"
                      onPress={() => {
                        deleteHike(item.id);
                        setVisible(false);
                      }}
                    />
                    <Dialog.Button
                      title="CANCEL"
                      onPress={() => {
                        setVisible(false);
                      }}
                    />
                  </Dialog.Actions>
                </Dialog>
              ) : (
                ""
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: "#fff",
  },
  title: {
    width: width * 0.9,
  },
  h1: {
    fontSize: 30,
    fontWeight: "600",
    color: "black",
    alignSelf: "flex-start",
  },
  body: {
    margin: "auto",
    width: width * 0.9,
  },
  item: {
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
  },
  col: {
    flex: 1,
  },
  input: {
    marginLeft: 8,
    marginTop: 8,
    height: 50,
    borderColor: "#DDDDDD",
    width: width * 0.4,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 15,
    color: "#585858",
  },
});
