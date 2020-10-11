import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import React from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import { Colors } from './Components/Colors/colors';
import { _retrieveData, _storeData } from './storage';

export default function App() {
  const [tasks, settasks] = React.useState([]);
  const [content, setcontent] = React.useState('');
  const [added, setadded] = React.useState(false);
  let textInputRef = React.createRef();
  let flatListRef = React.createRef();
  let [fontsLoaded] = useFonts({
    Ubuntu_500Medium: require('./Components/assets/fonts/Ubuntu-Medium.ttf'),
    Ubuntu_700Bold: require('./Components/assets/fonts/Ubuntu-Bold.ttf'),
  });
  React.useEffect(() => {
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
    setadded(true);
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

  const randomHexColor = () => {
    return '#000000'.replace(/0/g, function () {
      return (~~(Math.random() * 16)).toString(16);
    });
  };
  const [rippleColor, setRippleColor] = React.useState(randomHexColor());
  const [rippleOverflow, setRippleOverflow] = React.useState(false);

  const renderItem = ({ item }) => (
    <View style={styles.task}>
      <TouchableNativeFeedback
        onPress={() => changeStatus(item.id)}
        background={TouchableNativeFeedback.Ripple(
          Colors.primary_light,
          true,
          30
        )}>
        <View style={styles.task__switch}>
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
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        onPress={() => changeStatus(item.id)}
        background={TouchableNativeFeedback.Ripple(Colors.primary_light, true)}>
        <View style={styles.task__title}>
          <Text
            style={
              item.status ? [styles.title, styles.title_done] : styles.title
            }>
            {item.value}
          </Text>
        </View>
      </TouchableNativeFeedback>

      <TouchableNativeFeedback
        onPress={() => setTimeout(() => deleteTask(item.id), 200)}
        background={TouchableNativeFeedback.Ripple(Colors.red_light, true, 30)}>
        <View style={styles.task__delete}>
          <MaterialCommunityIcons
            name="delete-forever"
            size={24}
            color={Colors.red}
          />
        </View>
      </TouchableNativeFeedback>
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
              setcontent('');
            }}
          />
        </View>
        <View style={styles.taskbox__button}>
          <TouchableNativeFeedback
            onPress={() => {
              const re = /^(?!\s*$).+/g;
              if (re.test(content)) addTask(content);
              setcontent('');
            }}
            background={TouchableNativeFeedback.Ripple(
              Colors.primary_light,
              false,
              35
            )}>
            <View style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>Add Task</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
      <SafeAreaView style={styles.tasks}>
        <FlatList
          ref={(ref) => (flatListRef = ref)}
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={tasks}
          onContentSizeChange={(added) => {
            if (added) {
              flatListRef.scrollToEnd({ animated: true });
              setadded(false);
            }
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
  },
  taskbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 16,
    backgroundColor: Colors.primary,
  },
  taskbox__input: {
    flex: 7,
    marginStart: 10,
    marginEnd: 5,
  },
  taskbox__input_: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    fontFamily: 'Ubuntu_500Medium',
    height: 40,
  },
  taskbox__button: {
    flex: 2,
    marginStart: 5,
    marginEnd: 10,
  },
  appButtonContainer: {
    backgroundColor: Colors.white,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    height: 40,
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
    alignItems: 'center',
    marginEnd: 5,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
