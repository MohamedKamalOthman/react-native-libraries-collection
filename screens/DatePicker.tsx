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
  const [calendar, setCalendar] = useState(
    <Calendar
      key={currentDate.toDateString()}
      moment={moment}
      type={'hijri'}
      monthsCount={1}
      fromDate={moment()}
      startDate={currentDate}
      setCurrentDate={setCurrentDate}
      onSelectionChange={(date: {to: any}) => {
        console.log(moment(date.to).format('iYYYY/iM/iD'));
      }}
    />,
  );
  const change = () => {
    setCalendar(
      <Calendar
        key={currentDate.toDateString()}
        moment={moment}
        type={'hijri'}
        monthsCount={1}
        startDate={currentDate}
        onSelectionChange={(date: {to: any}) => {
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
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  listViewContainer: {
    //flex:1,
    height: '100%',
    backgroundColor: 'white',
    alignSelf: 'center',
  },
});
