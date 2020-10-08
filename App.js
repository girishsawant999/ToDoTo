import {
  Ubuntu_500Medium,
  Ubuntu_700Bold,
  useFonts,
} from '@expo-google-fonts/ubuntu';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { v4 as uuid } from 'uuid';
import { Colors } from './Components/Colors/colors';

export default function App() {
  const [tasks, settasks] = React.useState(
    localStorage.getItem('tasks')
      ? JSON.parse(localStorage.getItem('tasks'))
      : []
  );
  let textInputRef = React.createRef();
  let [fontsLoaded] = useFonts({
    Ubuntu_500Medium,
    Ubuntu_700Bold,
  });

  const addTask = (task) => {
    let new_task = [
      ...tasks,
      {
        id: uuid(),
        value: capitalizeFirstLetter(task),
        status: false,
      },
    ];

    settasks(new_task);
    localStorage.setItem('tasks', JSON.stringify(new_task));
  };

  const deleteTask = (id) => {
    let new_task = tasks.filter((task) => task.id !== id);
    settasks(new_task);
    localStorage.setItem('tasks', JSON.stringify(new_task));
  };

  const changeStatus = (id) => {
    let new_task = tasks.map((task) => {
      if (task.id === id) {
        task.status = !task.status;
      }
      return task;
    });
    settasks(new_task);
    localStorage.setItem('tasks', JSON.stringify(new_task));
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
              item.status ? [styles.title, styles.title_done] : [styles.title]
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

  if (!fontsLoaded) {
    return <View style={styles.container}></View>;
  }
  return (
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
          />
        </View>
        <View style={styles.taskbox__button}>
          <TouchableOpacity
            onPress={() => {
              const re = /^(?!\s*$).+/g;
              if (re.test(textInputRef.value)) addTask(textInputRef.value);
              textInputRef.clear();
              textInputRef.focus();
            }}
            style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.tasks}>
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexBasis: 'content',
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
    borderBottomWidth: '2px',
  },

  task__switch: {
    flex: 1,
    minWidth: 45,
  },
  checkbox: {
    color: Colors.primary,
  },
  task__title: {
    flex: 6,
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: 'Ubuntu_500Medium',
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
