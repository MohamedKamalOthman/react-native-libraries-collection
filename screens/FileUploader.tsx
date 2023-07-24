import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Button,
  StyleSheet,
  useColorScheme,
  Text,
  SafeAreaView,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {formatBytes} from '../utils/utils';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Card} from '@rneui/themed';
import * as Progress from 'react-native-progress';

const Tab = createBottomTabNavigator();

function UploadScreen({navigation}: any) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [uploadedFiles, setUploadedFiles]: [any, any] = useState([]);
  const [filesToUpload, setFilesToUpload]: [any, any] = useState([]);
  const [filesToUploadProgress, setFilesToUploadProgress]: [any, any] =
    useState([]);

  const uploadFiles = async () => {
    // for each file in filesToUpload
    // get file content

    filesToUpload.forEach(async (element: any, index: number) => {
      // upload file to server https://v2.convertapi.com/upload  with axios
      setFilesToUploadProgress((currentFilesToUploadProgress: any) => {
        currentFilesToUploadProgress[index] = 1;
        return currentFilesToUploadProgress;
      });
      const formData = new FormData();
      formData.append('file', {
        uri: element.uri,
        name: element.name,
        type: element.type,
      });
      console.log(`Uploading file ${element.name}`);
      const response = await axios.post(
        'https://v2.convertapi.com/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log(
        `Upload Finished Access the file at https://v2.convertapi.com/d/${response.data.FileId}`,
      );
      // add file to uploadedFiles
      setFilesToUploadProgress((currentFilesToUploadProgress: any) => {
        currentFilesToUploadProgress[index] = 2;
        return currentFilesToUploadProgress;
      });
      setUploadedFiles([...uploadedFiles, response.data.FileId]);
    });
  };

  function readFiles() {
    console.log('Reading file');
    DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
      allowMultiSelection: true,
    }).then(res => {
      // log file content
      console.log(res);
      // add file to filesToUpload
      res.forEach(element => {
        res.stat = 0;
        setFilesToUploadProgress((currentFilesToUploadProgress: any) => {
          currentFilesToUploadProgress.push(0);
          return currentFilesToUploadProgress;
        });
      });
      console.log(filesToUploadProgress);
      setFilesToUpload([...filesToUpload, ...res]);
    });
  }

  function removeFile(index: number) {
    // remove file from filesToUpload
    const newFiles = [...filesToUpload];
    newFiles.splice(index, 1);
    setFilesToUpload(newFiles);
    // remove file from filesToUploadProgress
    setFilesToUploadProgress((current: []) => {
      current.splice(index, 1);
      return current;
    });
  }

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <Card>
        <View key={index} style={styles.listItem}>
          <Text style={{flex: 1}}>{item.name}</Text>
          <Text>{formatBytes(item.size)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              removeFile(index);
            }}>
            <FontAwesomeIcon name="remove" size={15} color={'white'} />
          </TouchableOpacity>
        </View>
        <View>
          {(filesToUploadProgress[index] === 2 ||
            filesToUploadProgress[index] === 1) && (
            <View style={{padding: 10}}>
              <Progress.Bar
                progress={1}
                indeterminate={filesToUploadProgress[index] === 1}
                width={null}
                height={6}
              />
            </View>
          )}
        </View>
      </Card>
    );
  };

  useEffect(() => {
    console.log(filesToUploadProgress);
  });
  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <View style={styles.sectionContainer}>
          <Button
            title="Select Files"
            onPress={() => {
              readFiles();
            }}
          />
          <Button
            title="Upload Files"
            onPress={() => {
              uploadFiles();
            }}
          />
        </View>
        <View>
          <FlatList
            data={filesToUpload}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function UploadedScreen({navigation}: any) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <View>
      <Text>Uploaded Files</Text>
    </View>
  );
}

function FileUploader(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Upload Files"
        component={UploadScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon name="upload" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="View Uploaded Files"
        component={UploadedScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon name="file" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default FileUploader;

const styles = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  list: {
    backgroundColor: '#6495ed',
    // paddingVertical: 20,
    marginTop: 20,
    // paddingBottom: 1000,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 5,
    marginLeft: 10,
  },
});
