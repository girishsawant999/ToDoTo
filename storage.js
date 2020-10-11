import { AsyncStorage } from 'react-native';

const TASK_KEY = 'TASK_KEY';

export const _storeData = async (object) => {
  try {
    await AsyncStorage.setItem(TASK_KEY, JSON.stringify(object));
  } catch (error) {
    // Error saving data
  }
};

export const _retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem(TASK_KEY);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    // Error retrieving data
  }
};
