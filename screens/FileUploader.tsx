import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Button,
  StyleSheet,
  useColorScheme,
  Text,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
function Section({children, title}: any): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}
function FileUploader(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [uploadedFiles, setUploadedFiles]: [any, any] = useState([]);
  const [filesToUpload, setFilesToUpload]: [any, any] = useState([]);

  const uploadFiles = async () => {
    // for each file in filesToUpload
    // get file content
    console.log(filesToUpload);
    filesToUpload.forEach(async (element: any) => {
      // upload file to server https://v2.convertapi.com/upload  with axios
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
      setUploadedFiles([...uploadedFiles, response.data]);
    });
  };
  function readFiles() {
    console.log('Reading file');
    DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    }).then(res => {
      // log file content
      console.log(res);
      // add file to filesToUpload
      setFilesToUpload([...filesToUpload, ...res]);
    });
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="File Opener">
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
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default FileUploader;

const styles = StyleSheet.create({
  sectionContainer: {
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
});
