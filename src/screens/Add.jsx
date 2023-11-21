import { View, Text, Button } from "react-native";
import { SelectCountry } from "react-native-element-dropdown";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Pressable } from "react-native";
import { Platform } from "react-native";
import { CheckBox, Dialog } from "@rneui/themed";
import { local_data } from "../common";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";

const { width, height } = Dimensions.get("window");
export default function Add() {
  const db = SQLite.openDatabase("demo.db");
  const [hikes, setHikes] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [inputName, setInputName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(new Date());
  const [selectedIndex, setIndex] = useState(0);
  const [dimension, setDimension] = useState(0);
  const [complexity, setComplexity] = useState("1");
  const [desc, setDesc] = useState("");
  const [displayPicker, setDisplayPicker] = useState(false);
  const [dateHike, setDateHike] = useState("");
  const [visible, setVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const nav = useNavigation();
  const setClear = () => {
    setInputName("");
    setAddress("");
    setDateHike("");
    setIndex(null);
    setDimension("");
    setComplexity("");
    setDesc("");
  };
  const toggleDatePicker = (e) => {
    setDisplayPicker(!displayPicker);
  };
  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleDatePicker();
        setDateHike(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  };
  const formatDate = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${day}/${month}/${year}`;
  };
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS hikes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT, dateHike TEXT, selectedIndex INTEGER, lenghtHight INTEGER, level TEXT, desc TEXT)"
      );
      tx.executeSql(
        "SELECT * FROM hikes",
        null,
        (txObj, resultSet) => setHikes(resultSet.rows._array),
        (txObj, hasError) => console.log(hasError)
      );
    });
    setFetchingData(false);
  }, []);
  const addHilke = () => {
    db.transaction((tx) => {
      "SELECT COUNT(*) FROM hikes",
        null,
        tx.executeSql(
          "INSERT INTO hikes (name, location, datehike, selectedIndex, lenghtHight, level, desc) values (?, ?, ?, ?, ?, ?, ?)",
          [
            inputName,
            address,
            dateHike,
            selectedIndex,
            dimension,
            complexity,
            desc,
          ],
          (txObj, resultSet) => {
            let existingHikes = [...hikes];
            existingHikes.push({
              id: resultSet.insertId,
              name: inputName,
              location: address,
              dateHike: dateHike,
              selectedIndex: selectedIndex,
              lenghtHight: dimension,
              level: dimension,
              desc: desc,
            });
            setHikes(existingHikes);
            setClear();
            nav.navigate("Home");
          },
          (txObj, hasError) => {
            console.log(hasError);
          }
        );
    });
  };

  const data = {
    inputName,
    address,
    dateHike,
    selectedIndex,
    dimension,
    complexity,
    desc,
  };

  const toggleDialog = () => {
    if (
      inputName !== "" &&
      address !== "" &&
      dateHike !== "" &&
      selectedIndex !== "" &&
      dimension !== "" &&
      complexity !== "" &&
      desc !== ""
    ) {
      setVisible(!visible);
    } else {
      setHasError(!hasError);
    }
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
      <View style={styles.title}>
        <Text style={styles.h1}>Add hike</Text>
      </View>
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.item}>
            <Text style={styles.label}>Name of the hike </Text>
            <TextInput
              style={styles.input}
              placeholder="Quang Truong"
              value={inputName}
              onChangeText={(e) => setInputName(e)}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Location </Text>
            <TextInput
              style={styles.input}
              placeholder="Da Nang"
              value={address}
              onChangeText={(e) => setAddress(e)}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Date of the hike </Text>
            {displayPicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                maximumDate={new Date("2030-1-1")}
              />
            )}
            <Pressable onPress={toggleDatePicker}>
              <TextInput
                style={styles.input}
                placeholder="Enter Date"
                value={dateHike}
                onPressIn={toggleDatePicker}
              />
            </Pressable>
          </View>
          <View style={styles.item}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label1}>Parking available </Text>
              </View>
              <View style={styles.col}>
                <View
                  style={{
                    marginRight: 10,
                    width: width * 0.46,
                  }}
                >
                  <View style={styles.row}>
                    <View style={styles.col}>
                      <CheckBox
                        checked={selectedIndex === 0}
                        onPress={() => setIndex(0)}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        size={18}
                        style={{
                          marginBottom: 3,
                        }}
                        title="Yes"
                      />
                    </View>
                    <View style={styles.col}>
                      <CheckBox
                        checked={selectedIndex === 1}
                        title="No"
                        onPress={() => setIndex(1)}
                        size={18}
                        style={{ marginBottom: 3, marginRight: 8 }}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Length of the hike </Text>
              </View>
              <View style={styles.col}>
                <TextInput
                  style={styles.input2}
                  placeholder="100"
                  keyboardType="numeric"
                  value={String(dimension)}
                  onChangeText={(e) => setDimension(e)}
                />
              </View>
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Difficulty level </Text>
              </View>
              <View style={styles.col}>
                <SelectCountry
                  style={styles.styleDropdown}
                  selectedTextStyle={styles.select}
                  placeholderStyle={styles.placeholderStyle}
                  imageStyle={styles.img}
                  iconStyle={styles.ic}
                  maxHeight={200}
                  value={complexity}
                  data={local_data}
                  valueField="value"
                  labelField="lable"
                  imageField="image"
                  placeholder="MEDIUM"
                  searchPlaceholder="Search Hike Data"
                  onChange={(e) => {
                    setComplexity(e.value);
                  }}
                />
              </View>
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Description </Text>
              </View>
              <View style={styles.col}></View>
            </View>
            <TextInput
              placeholder="Enter Hike Description ...."
              multiline={true}
              numberOfLines={4}
              value={desc}
              onChangeText={(e) => setDesc(e)}
              style={{
                borderWidth: 1,
                borderColor: "#b0b0b0",
                height: 100,
                borderRadius: 10,
                backgroundColor: "#dddddd",
                color: "#6E6E6E",
                paddingLeft: 10,
                marginTop: 4,
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: "#1453F7",
              borderRadius: 10,
              marginTop: 4,
              width: 150,
              alignSelf: "center",
            }}
          >
            <Button title="ADD" onPress={toggleDialog}></Button>
          </View>
          {visible === true ? (
            <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
              <Dialog.Title title="Confirm" />
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text> Hike will be added:</Text>
                <Text>Name: {data.inputName}</Text>
                <Text>Location: {data.address}</Text>
                <Text>Date of the hike: {data.dateHike}</Text>
                <Text>
                  Parking available: {data.selectedIndex === 0 ? "Yes" : "No"}
                </Text>
                <Text>Length of the hike: {data.dimension}</Text>
                <Text>Difficulty level: {data.complexity}</Text>
                <Text>Description: {data.desc}</Text>
                <Text style={{ marginTop: 10 }}>
                  Are you sure to add this information ?
                </Text>
              </View>
              <Dialog.Actions>
                <Dialog.Button
                  title="CONFIRM"
                  onPress={() => {
                    addHilke();
                    toggleDialog();
                  }}
                />
                <Dialog.Button title="CANCEL" onPress={toggleDialog} />
              </Dialog.Actions>
            </Dialog>
          ) : (
            ""
          )}
          {hasError === true ? (
            <Dialog isVisible={hasError} onBackdropPress={toggleDialog}>
              <Dialog.Title title="Error" />
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Text>All required fields must be filled. </Text>
              </View>
              <Dialog.Actions>
                <Dialog.Button
                  title="OK"
                  onPress={() => {
                    setHasError(false);
                  }}
                />
              </Dialog.Actions>
            </Dialog>
          ) : (
            ""
          )}
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: height,
    backgroundColor: "#fff",
  },
  title: {
    width: width * 0.9,
    marginTop: 10,
  },
  h1: {
    fontSize: 30,
    fontWeight: "600",
    color: "black",
    alignSelf: "center",
  },
  body: {
    margin: "auto",
    width: width * 0.9,
  },
  item: {
    marginTop: 13,
  },
  row: {
    flexDirection: "row",
  },
  col: {
    flex: 1,
  },
  label: {
    marginTop: 3,
    fontSize: 17,
  },
  label1: {
    fontSize: 17,
    marginTop: 10,
  },
  input: {
    marginTop: 8,
    height: 50,
    borderColor: "#DDDDDD",
    width: width * 0.9,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontSize: 15,
    color: "#6E6E6E",
  },
  input2: {
    marginTop: -10,
    height: 50,
    borderColor: "#DDDDDD",
    width: width * 0.4,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    color: "#6E6E6E",
  },
  styleDropdown: {
    height: 50,
    width: width * 0.4,
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  img: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  select: {
    fontSize: 16,
    marginLeft: 8,
  },
  ic: {
    width: 20,
    height: 20,
  },
});
