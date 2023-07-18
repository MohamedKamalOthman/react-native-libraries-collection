// create home screen

import React, {useLayoutEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import {View, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const Home = ({navigation}) => {
  const {t, i18n} = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('Home'),
      drawerIcon: ({focused, size}) => (
        <Icon name="rocket" size={30} color="#900" />
      ),
    });
  });
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
};

export default Home;
