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
import {Header} from 'react-navigation-stack';
import {Colors} from 'react-native/Libraries/NewAppScreen';
function Section({children, title}: SectionProps): JSX.Element {
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
  const [files, setFiles] = useState([]);
  const getFileContent = async (
    uri_: string | null,
    name_: string | null,
    type_: string | null,
  ) => {
    // upload file to server https://v2.convertapi.com/upload  with axios
    const formData = new FormData();
    formData.append('file', {
      uri: uri_,
      name: name_,
      type: type_,
    });
    console.log('Uploading file');
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
  };
  function readFile2() {
    console.log('Reading file');
    DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    }).then(res => {
      // log file content
      var content = res[0].uri;
      // get data from file
      getFileContent(content, res[0].name, res[0].type);
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
                title="Upload File"
                onPress={() => {
                  readFile2();
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
