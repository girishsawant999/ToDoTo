import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import React from 'react';
import {
  AsyncStorage,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import { Colors } from './Components/Colors/colors';
import { _retrieveData, _storeData } from './storage';

export default function App() {
  const [tasks, settasks] = React.useState([]);
  const [content, setcontent] = React.useState('');
  let textInputRef = React.createRef();
  let flatListRef = React.createRef();
  let [fontsLoaded] = useFonts({
    Ubuntu_500Medium: require('./Components/assets/fonts/Ubuntu-Medium.ttf'),
    Ubuntu_700Bold: require('./Components/assets/fonts/Ubuntu-Bold.ttf'),
  });
  React.useEffect(() => {
    AsyncStorage.clear();
    _retrieveData().then((value) => value && settasks(value));
    return () => {};
  }, []);

  const addTask = (task) => {
    let new_task = tasks;
    new_task.push({
      id: uuid(),
      value: capitalizeFirstLetter(task),
      status: false,
    });
    settasks(new_task.map((item) => item));
    _storeData(new_task);
  };

  const deleteTask = (id) => {
    let new_task = tasks.filter((task) => task.id !== id);
    settasks(new_task);
    _storeData(new_task);
  };

  const changeStatus = (id) => {
    let new_task = tasks.map((task) => {
      if (task.id === id) {
        task.status = !task.status;
      }
      return task;
    });
    settasks(new_task);
    _storeData(new_task);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderItem = ({ item }) => (
    <View style={styles.task}>
      <View style={styles.task__switch}>
        <TouchableOpacity onPress={() => changeStatus(item.id)}>
          {item.status ? (
            <MaterialCommunityIcons
              name="checkbox-marked"
              size={24}
              color={Colors.primary}
            />
          ) : (
            <MaterialCommunityIcons
              name="checkbox-blank-outline"
              size={24}
              color={Colors.primary}
            />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.task__title}>
        <TouchableOpacity onPress={() => changeStatus(item.id)}>
          <Text
            style={
              item.status ? [styles.title, styles.title_done] : styles.title
            }>
            {item.value}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.task__delete}>
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <MaterialCommunityIcons
            name="delete-forever"
            size={24}
            color={Colors.red}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return !fontsLoaded ? (
    <AppLoading />
  ) : (
    <View style={styles.container}>
      <View style={styles.taskbox}>
        <View style={styles.taskbox__input}>
          <TextInput
            ref={(input) => {
              textInputRef = input;
            }}
            placeholder="Enter the task"
            autoFocus={true}
            style={styles.taskbox__input_}
            value={content}
            onChangeText={(text) => setcontent(text)}
            onSubmitEditing={() => {
              const re = /^(?!\s*$).+/g;
              if (re.test(content)) addTask(content);
              textInputRef.clear();
            }}
          />
        </View>
        <View style={styles.taskbox__button}>
          <TouchableOpacity
            onPress={() => {
              const re = /^(?!\s*$).+/g;
              if (re.test(content)) addTask(content);
              textInputRef.clear();
            }}
            style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SafeAreaView style={styles.tasks}>
        <FlatList
          ref={(ref) => (flatListRef = ref)}
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={tasks}
          onContentSizeChange={() =>
            flatListRef.scrollToEnd({ animated: true })
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight + 8,
  },
  taskbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: Colors.primary,
  },
  taskbox__input: {
    flex: 8,
    marginHorizontal: 10,
  },
  taskbox__input_: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontFamily: 'Ubuntu_500Medium',
  },
  taskbox__button: {
    flex: 2,
    marginHorizontal: 10,
  },
  appButtonContainer: {
    backgroundColor: Colors.white,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  appButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontFamily: 'Ubuntu_700Bold',
  },
  tasks: {
    flex: 1,
  },
  task: {
    marginHorizontal: 10,
    paddingHorizontal: 2,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.grey,
    borderBottomWidth: 1,
  },

  task__switch: {
    flex: 1,
  },
  checkbox: {
    color: Colors.primary,
  },
  task__title: {
    flex: 10,
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: 'Ubuntu_500Medium',
    color: Colors.black,
  },
  title_done: {
    color: Colors.primary,
    textDecorationLine: 'line-through',
  },
  task__delete: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
