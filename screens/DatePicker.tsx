import {View} from 'react-native';
import Calendar from '../Components/Calendar';
import moment from 'moment-hijri';

const DatePicker = () => {
  return (
    <View>
      <Calendar moment={moment} type={'geo'} monthsCount={1} />
    </View>
  );
};

export default DatePicker;
