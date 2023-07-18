// create home screen

import {useLayoutEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text} from 'react-native';

const Home = ({navigation}) => {
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
