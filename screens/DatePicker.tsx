import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Calendar from '../Components/Calendar';
import moment from 'moment-hijri';
import {useState} from 'react';

const TwoButtons = ({change, setCurrentDate, date}) => {
  const increaseMonth = () => {
    setCurrentDate(new Date(date.setMonth(date.getMonth() + 1)));
    console.log(date);
    change();
  };
  const decreaseMonth = () => {
    setCurrentDate(new Date(date.setMonth(date.getMonth() - 1)));
    console.log(date);
    change();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={increaseMonth}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={decreaseMonth}>
        <Text style={styles.buttonText}>Prev</Text>
      </TouchableOpacity>
    </View>
  );
};
const DatePicker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState(<></>);
  const change = () => {
    setCalendar(
      <Calendar
        key={currentDate.toDateString()}
        moment={moment}
        type={'hijri'}
        monthsCount={1}
        fromDate={moment()}
        startDate={currentDate}
        setCurrentDate={setCurrentDate}
        onSelectionChange={date => {
          console.log(moment(date.to).format('iYYYY/iM/iD'));
        }}
      />,
    );
  };
  return (
    <View>
      <TwoButtons
        change={change}
        setCurrentDate={setCurrentDate}
        date={currentDate}
      />
      {calendar}
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  listViewContainer: {
    //flex:1,
    height: '100%',
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  weekDayNames: {
    width: '100%',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDayNamesItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  month: {
    paddingBottom: 10,
  },
  monthHeader: {
    paddingTop: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  monthDays: {
    width: '100%',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  common: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
