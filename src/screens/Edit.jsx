import { View, Text, Button } from "react-native";
import { SelectCountry } from "react-native-element-dropdown";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Pressable } from "react-native";
import { Platform } from "react-native";
import { CheckBox, Dialog } from "@rneui/themed";
import { local_data } from "../common";
import Iconn from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/FontAwesome";

import { useNavigation } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import { useEffect } from "react";
import { ScrollView } from "react-native";

const { width, height } = Dimensions.get("window");
export default function Edit(props) {
  const db = SQLite.openDatabase("demo.db");
  const [hikes, setHikes] = useState();
  const [text1, setText] = useState("");
  const [address1, setAddress] = useState("");
  const [date, setDate] = useState(new Date());
  const [selectedOption1, setOption] = useState(null);
  const [dimension1, setDimension] = useState();
  const [difficulty1, setDifficulty] = useState("");
  const [description1, setDescription] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isActive1, setIsActive1] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate1, setSelectedDate] = useState(hikes?.dateHike);
  const navigation = useNavigation();
  const toggleDatePicker = (e) => {
    setShowPicker(!showPicker);
  };
  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleDatePicker();
        setSelectedDate(formatDate(currentDate));
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
    return `${day}-${month}-${year}`;
  };
  const setClear = () => {
    setText("");
    setAddress("");
    setSelectedDate("Select Date");
    setOption(null);
    setDimension("");
    setDifficulty("");
    setDescription("");
  };
  const data = {
    text1,
    address1,
    selectedDate1,
    selectedOption1,
    dimension1,
    difficulty1,
    description1,
  };
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };
  const toggleDialog = () => {
    if (
      text1 !== "" &&
      address1 !== "" &&
      selectedDate1 !== "" &&
      selectedOption1 !== "" &&
      dimension1 !== "" &&
      difficulty1 !== "" &&
      description1 !== ""
    ) {
      setVisible(!visible);
    } else {
      setError(!error);
    }
  };
  let id = props.route.params.id;
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM hikes WHERE id = ?",
        [id],
        (txObj, resultSet) => setHikes(resultSet.rows._array[0]),
        (txObj, error) => console.log(error)
      );
    });
    setIsFetching(false);
  }, [props.route.params.id]);

  const editHilke = () => {
    db.transaction((tx) => {
      "SELECT COUNT(*) FROM hikes",
        null,
        tx.executeSql(
          "UPDATE hikes SET name = ?, location = ?, datehike = ?, selectedIndex = ?, lenghtHight = ?, level = ?, desc = ? WHERE id = ?",
          [
            text1,
            address1,
            selectedDate1,
            selectedOption1,
            dimension1,
            difficulty1,
            description1,
            id,
          ],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              setClear();
              handleBack();
            }
          },
          (txObj, error) => {
            console.log(error);
          }
        );
    });
  };
  const handleActiveEdit = () => {
    setText(hikes.name);
    setAddress(hikes.location);
    setSelectedDate(hikes.dateHike);
    setOption(hikes.selectedIndex);
    setDimension(hikes.lenghtHight);
    setDifficulty(hikes.level);
    setDescription(hikes.desc);
    setIsActive1(true);
    console.log("Can edit");
  };
  if (isFetching) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Iconn
          name="backspace-sharp"
          color="black"
          size={30}
          style={{ marginRight: 20, marginTop: 15 }}
          onPress={handleBack}
        />
        <Text style={styles.h1}>Edit hike</Text>
        {/* <Icon
          name="edit"
          color="black"
          size={30}
          style={{
            marginLeft: width / 3.5,
            marginTop: 15,
            alignSelf: "flex-end",
          }}
          onPress={handleActiveEdit}
        /> */}
        <Pressable
          onPress={handleActiveEdit}
          style={{
            marginLeft: width / 3.5,
            marginTop: 15,
            alignSelf: "flex-end",
          }}
        >
          <Text style={{ fontSize: 20 }}> Edit</Text>
        </Pressable>
      </View>
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.item}>
            <Text style={styles.label}>Name of the hike </Text>
            <TextInput
              style={styles.input}
              value={isActive1 == false ? hikes?.name : text1.toString()}
              onChangeText={(e) => setText(e)}
              placeholder="Son Dang"
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Location </Text>
            <TextInput
              style={styles.input}
              placeholder="Quang Binh"
              value={isActive1 == false ? hikes?.location : address1.toString()}
              onChangeText={(e) => setAddress(e)}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Date of the hike </Text>
            {showPicker && (
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
                placeholder="20-11-2023"
                value={
                  isActive1 == false
                    ? hikes?.dateHike
                    : selectedDate1.toString()
                }
                onPressIn={toggleDatePicker}
              />
            </Pressable>
          </View>
          <View style={styles.item}>
            <View style={styles.row}>
              <View style={styles.col}>
                <View style={{ marginTop: 6 }}>
                  <Text style={styles.label}>Parking available </Text>
                </View>
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
                        checked={
                          isActive1 === false
                            ? hikes?.selectedIndex == 0
                            : selectedOption1 === 0
                        }
                        onPress={() => setOption(0)}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        style={{ marginBottom: 3 }}
                        size={18}
                        title="Yes"
                      />
                    </View>
                    <View style={styles.col}>
                      <CheckBox
                        style={{ marginRight: 10 }}
                        checked={
                          isActive1 === false
                            ? hikes?.selectedIndex == 1
                            : selectedOption1 === 1
                        }
                        title="No"
                        onPress={() => setOption(1)}
                        size={18}
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
                  value={
                    isActive1 == false
                      ? String(hikes?.lenghtHight)
                      : dimension1.toString()
                  }
                  keyboardType="numeric"
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
                  placeholderStyle={styles.phStyle}
                  imageStyle={styles.img}
                  iconStyle={styles.ic}
                  maxHeight={200}
                  data={local_data}
                  valueField="value"
                  labelField="lable"
                  imageField="image"
                  placeholder="HIGHT"
                  searchPlaceholder="Search..."
                  value={isActive1 == false ? hikes?.level : difficulty1}
                  onChange={(e) => {
                    setDifficulty(e.value);
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
              multiline={true}
              numberOfLines={4}
              placeholder="Description about the hike ...."
              onChangeText={(e) => setDescription(e)}
              value={isActive1 == false ? hikes?.desc : description1}
              style={{
                borderWidth: 1,
                borderColor: "black",
                height: 100,
                borderRadius: 10,
                backgroundColor: "#DDDDDD",
                color: "black",
                paddingLeft: 10,
                marginTop: 4,
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: "##1453F7",
              borderRadius: 10,
              marginTop: 4,
            }}
          >
            {isActive1 ? (
              <Button title="Update" onPress={toggleDialog}></Button>
            ) : (
              <Button title="Update" disabled></Button>
            )}
          </View>
          {visible === true ? (
            <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
              <Dialog.Title title="Confirmation" />
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>New hike will be added:</Text>
                <Text>Name: {data.text1}</Text>
                <Text>Location: {data.address1}</Text>
                <Text>Date of the hike: {data.selectedDate1}</Text>
                <Text>
                  Parking available: {data.selectedOption1 === 0 ? "Yes" : "No"}
                </Text>
                <Text>Length of the hike: {data.dimension1}</Text>
                <Text>Difficulty level: {data.difficulty1}</Text>
                <Text style={{ marginTop: 10 }}>HIGH Are you sure ?</Text>
              </View>
              <Dialog.Actions>
                <Dialog.Button
                  title="YES"
                  onPress={() => {
                    editHilke();
                    toggleDialog();
                  }}
                />
                <Dialog.Button title="CANCEL" onPress={toggleDialog} />
              </Dialog.Actions>
            </Dialog>
          ) : (
            ""
          )}
          {error === true ? (
            <Dialog isVisible={error} onBackdropPress={toggleDialog}>
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
                    setError(false);
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
    flexDirection: "row",
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
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 16,
  },
  input: {
    marginTop: 8,
    height: 50,
    borderColor: "#DDDDDD",
    width: width * 0.9,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 15,
  },
  input2: {
    marginTop: 10,
    height: 50,
    borderColor: "#DDDDDD",
    width: width * 0.4,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
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
  phStyle: {
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
