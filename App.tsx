/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';

import './utils/i18n';
import {useTranslation} from 'react-i18next';
import {
  Home,
  Language,
  Form,
  Tabs,
  DatePicker,
  ContactsScreen,
  RootedScreen,
  FileUploader,
} from './screens';
const Drawer = createDrawerNavigator();

function App(): JSX.Element {
  const {t} = useTranslation();
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={t('Home')}>
        <Drawer.Screen name={t('Home')} component={Home} />
        <Drawer.Screen name={t('Language')} component={Language} />
        <Drawer.Screen name={t('Form')} component={Form} />
        <Drawer.Screen name={t('Tabs')} component={Tabs} />
        <Drawer.Screen name={t('DatePicker')} component={DatePicker} />
        <Drawer.Screen name={t('Contacts')} component={ContactsScreen} />
        <Drawer.Screen name={t('RootChecker')} component={RootedScreen} />
        <Drawer.Screen name={t('File Uploader')} component={FileUploader} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
export default App;
