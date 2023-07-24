import {
  Button,
  I18nManager,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  MyCustomTextComponent,
  MyDirectionChangerButton,
} from '../components/language_direction';
import {useTranslation} from 'react-i18next';
import RNRestart from 'react-native-restart';
import {useLayoutEffect} from 'react';
const Language = ({navigation}) => {
  const {t, i18n} = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('Language'),
    });
  });

  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.sectionWrapper}>
          <Text style={styles.heading}>{t('Hello world')}</Text>
          <Text style={styles.regularText}>
            {t('Some text goes here, some more text goes here')}
          </Text>
        </View>

        <View style={styles.sectionWrapper}>
          <Button
            title={t('Change language')}
            onPress={() => {
              i18n
                .changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')
                .then(() => {
                  I18nManager.forceRTL(i18n.language === 'ar');
                  RNRestart.Restart();
                });
            }}
          />
        </View>
      </View>
    </>
  );
};

export default Language;
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f3f3f3',
    flex: 1,
  },
  sectionWrapper: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'left',
  },
  regularText: {
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
});
