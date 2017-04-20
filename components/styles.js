import { Dimensions, StyleSheet } from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#f7f7f7',
  },
  monthContainer: {
    width: DEVICE_WIDTH,
  },
  calendarControls: {
    flexDirection: 'row',
  },
  controlButton: {
  },
  controlButtonText: {
    margin: 20,
    fontSize: 15,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    margin: 15,
  },
  calendarHeading: {
    flexDirection: 'row',
  },
  dayHeading: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  weekendHeading: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayButton: {
    alignItems: 'center',
    padding: 0,
    width: DEVICE_WIDTH / 7,
    height: DEVICE_WIDTH / 7,
    flexDirection: 'row',
  },
  dayButtonFiller: {
    padding: 0,
    width: DEVICE_WIDTH / 7,
    height: DEVICE_WIDTH / 7,
  },
  day: {
    fontSize: 16,
    alignSelf: 'center',
  },
  disabledDay: {
    fontSize: 16,
    alignSelf: 'center',
    color: 'grey',
  },
  eventIndicatorFiller: {
    marginTop: 3,
    borderColor: 'transparent',
    width: 4,
    height: 4,
    borderRadius: 0,
  },
  eventIndicator: {
    backgroundColor: '#cccccc',
  },
  dayCircleFiller: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: 28,
    height: 28,
    left: (DEVICE_WIDTH / 14) - 14,
    top: (DEVICE_WIDTH / 14) - 14,
    borderRadius: 14,
    position: 'absolute',
  },
  currentDayCircle: {
    backgroundColor: '#F22169',
  },
  currentDayText: {
    color: 'black',
    fontWeight: 'bold',
  },
  selectedDayCircle: {
    backgroundColor: '#F22169',
  },
  hasEventCircle: {
  },
  hasEventDaySelectedCircle: {
  },
  hasEventText: {
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weekendDayText: {
    color: 'black',
  },
  selectedRangeBarWrapper: {
    flexDirection: 'row',
  },
  selectedRangeBar: {
    width: DEVICE_WIDTH / 14,
    height: 28,
    backgroundColor: '#F22169',
  },
  selectedFadedRangeBar: {
    width: DEVICE_WIDTH / 14,
    height: 28,
    backgroundColor: '#FFA5C5',
  },
  emptyRangeBar: {
    width: DEVICE_WIDTH / 14,
    height: 28,
    backgroundColor: 'transparent',
  },
});

export default styles;
