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

function UploadScreen({navigation, uploadedFiles, setUploadedFiles}: any) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [filesToUpload, setFilesToUpload]: [any, any] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [flatListHeight, setFlatListHeight] = useState(0);

  const uploadFiles = async () => {
    // for each file in filesToUpload
    // get file content

    for (let index = 0; index < filesToUpload.length; index++) {
      const element = filesToUpload[index];
      // upload file to server https://v2.convertapi.com/upload  with axios
      setFilesToUpload((curr: [any]) => {
        curr[index].progress = 0;
        return curr;
      });
      setUploading(true);
      console.log(`Uploading file progress ${element.progress}`);
      const formData = new FormData();
      formData.append('file', {
        uri: element.uri,
        name: element.name,
        type: element.type,
      });
      console.log(`Uploading file ${element.name}`);
      try {
        const response = await axios.post(
          'https://v2.convertapi.com/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        setUploading(false);

        console.log(
          `Upload Finished Access the file at https://v2.convertapi.com/d/${response.data.FileId}`,
        );
        setFilesToUpload((curr: [any]) => {
          curr[
            index
          ].url = `https://v2.convertapi.com/d/${response.data.FileId}`;
          curr[index].progress = 100;
          return curr;
        });
        setUploadedFiles((curr: [any]) => [...curr, element]);
      } catch (e) {
        console.log(e);
      }
    }
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
      setFilesToUpload([...filesToUpload, ...res]);
    });
  }

  function removeFile(index: number) {
    // remove file from filesToUpload
    const newFiles = [...filesToUpload];
    newFiles.splice(index, 1);
    setFilesToUpload(newFiles);
    // remove file from filesToUploadProgress
  }
  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <Card key={`${index}-${uploading}`} containerStyle={{marginBottom: 20}}>
        <View style={styles.listItem}>
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

        <Progress.Bar
          progress={filesToUpload[index].progress}
          indeterminate={filesToUpload[index].progress === 0}
          width={null}
          height={6}
        />
      </Card>
    );
  };
  return (
    <>
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
      </View>
      <FlatList
        data={filesToUpload}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onContentSizeChange={(w, h) => setFlatListHeight(h)}
        onLayout={e => setFlatListHeight(e.nativeEvent.layout.height)}
        style={{height: flatListHeight, ...styles.list}}
      />
    </>
  );
}

function UploadedScreen({navigation, uploadedFiles, setUploadedFiles}: any) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <>
        <Card key={`${index}`} containerStyle={{marginBottom: 20}}>
          <View style={styles.listItem}>
            <Text style={{flex: 1}}>{item.name}</Text>
            <Text>{formatBytes(item.size)}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                // removeFile(index);
              }}>
              <FontAwesomeIcon name="remove" size={15} color={'white'} />
            </TouchableOpacity>
          </View>
        </Card>
      </>
    );
  };

  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <View>
          <FlatList
            data={uploadedFiles}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function FileUploader(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [uploadedFiles, setUploadedFiles]: [any, any] = useState([]);

  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Upload Files"
        children={() => (
          <UploadScreen
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
          />
        )}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon name="upload" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="View Uploaded Files"
        children={() => (
          <UploadedScreen
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
          />
        )}
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
    padding: 24,
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
    // backgroundColor: '#6495ed',
    // paddingVertical: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 5,
    marginLeft: 10,
  },
});
