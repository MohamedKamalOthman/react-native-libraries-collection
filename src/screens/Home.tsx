// create home screen

import React, {useLayoutEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import {View, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const Home = ({navigation}: any) => {
  const {t, i18n} = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('Home'),
    });
  });
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
};

export default Home;
