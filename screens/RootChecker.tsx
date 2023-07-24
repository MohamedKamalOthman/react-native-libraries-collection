import JailMonkey from 'jail-monkey';
import {useColorScheme, View, Text, StyleSheet} from 'react-native';
import {styles} from '../components/Style';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function RootedScreen(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // if device is rooted return view with rooted else not rooted
  return JailMonkey.isJailBroken() ? (
    <View>
      <Text style={styles.sectionTitle}>Device is Rooted/Jailbroken</Text>
    </View>
  ) : (
    <View>
      <Text style={styles.sectionTitle}>Device is Not Rooted/Jailbroken</Text>
    </View>
  );
}
export default RootedScreen;
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
});
