// create home screen

import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, Image} from 'react-native';
const Home = ({navigation}: any) => {
  const {t, i18n} = useTranslation();

  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
};

export default Home;
