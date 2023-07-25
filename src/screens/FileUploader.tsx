import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  Button,
  StyleSheet,
  useColorScheme,
  Text,
  SafeAreaView,
  Alert,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Colors from '../assets/colors/Colors';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {formatBytes, getFileIcon} from '../utils/utils';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Card} from '@rneui/themed';
import * as Progress from 'react-native-progress';
import FileViewer from 'react-native-file-viewer';

const Tab = createBottomTabNavigator();

function UploadScreen({navigation, uploadedFiles, setUploadedFiles}: any) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode
      ? Colors.primaryDark
      : Colors.secondaryBackground,
  };
  const [filesToUpload, setFilesToUpload]: [any, any] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [flatListHeight, setFlatListHeight] = useState(0);
  const [progress, setProgress] = useState(0);

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
            onUploadProgress: progressEvent => {
              const progress_ = progressEvent.loaded / progressEvent.total;
              console.log(`Uploading file progress ${progress_}`);
              setFilesToUpload((curr: [any]) => {
                curr[index].progress = progress_;
                return curr;
              });
              setProgress(progress_);
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
          curr[index].progress = 1;
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
    const extension = item.name.split('.').pop();
    const icon = getFileIcon(extension);
    return (
      <Card
        key={`${index}-${uploading}-${filesToUpload[index].progress}`}
        containerStyle={{marginBottom: 20}}>
        <View style={styles.listItem}>
          <FontAwesomeIcon name={icon} size={25} color={Colors.black} />
          <Text style={{flex: 1, padding: 10}}>{item.name}</Text>
          <Text>{formatBytes(item.size)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              removeFile(index);
            }}>
            <FontAwesomeIcon name="remove" size={15} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Progress.Bar
          progress={filesToUpload[index].progress}
          // indeterminate={filesToUpload[index].progress === 0}
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
          <TouchableOpacity
            onPress={readFiles}
            style={{
              backgroundColor: Colors.primaryBackground2,
              padding: 10,
              borderRadius: 5,
              marginBottom: 10,
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 16, fontWeight: 'bold', color: Colors.white}}>
              Select Files
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={uploadFiles}
            style={{
              backgroundColor: Colors.primaryBackground2,
              padding: 10,
              borderRadius: 5,
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 16, fontWeight: 'bold', color: Colors.white}}>
              Upload Files
            </Text>
          </TouchableOpacity>
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
    backgroundColor: isDarkMode
      ? Colors.primaryDark
      : Colors.secondaryBackground,
  };
  const renderItem = ({item, index}: {item: any; index: number}) => {
    const extension = item.name.split('.').pop();
    const icon = getFileIcon(extension);
    return (
      <Card key={`${index}`} containerStyle={{marginBottom: 20}}>
        <View style={styles.listItem}>
          <FontAwesomeIcon name={icon} size={25} color={Colors.black} />
          <Text style={{flex: 1, padding: 10}}>{item.name}</Text>
          <Text>{formatBytes(item.size)}</Text>
          <TouchableOpacity
            style={{
              ...styles.deleteButton,
              backgroundColor: Colors.primaryBackground2,
            }}
            onPress={() => {
              const path = item.uri;
              FileViewer.open(path, {showOpenWithDialog: true})
                .then(() => {
                  console.log('success');
                })
                .catch(error => {
                  console.log(error);
                });
            }}>
            <FontAwesomeIcon name="file" size={15} color={'white'} />
          </TouchableOpacity>
        </View>
      </Card>
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
    backgroundColor: isDarkMode
      ? Colors.primaryDark
      : Colors.secondaryBackground,
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
