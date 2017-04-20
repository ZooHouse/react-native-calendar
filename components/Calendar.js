import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Day from './Day';

import moment from 'moment';
import styles from './styles';

const DEVICE_WIDTH = Dimensions.get('window').width;
const VIEW_INDEX = 2;

function getNumberOfWeeks(month) {
  const firstWeek = moment(month).startOf('month').week();
  const lastWeek = moment(month).endOf('month').week();
  return lastWeek - firstWeek + 1;
}

class Calendar extends Component {

  state = {
    currentMonthMoment: moment(this.props.startDate),
    selectedMoment: moment(this.props.selectedDate),
    selectedStartMoment: moment(this.props.selectedStartDate),
    selectedEndMoment: moment(this.props.selectedEndDate),
    rangeStart: moment(this.props.selectedStartDate),
    rangeEnd: moment(this.props.selectedEndDate),
    selectStartDate: this.props.selectStartDate && this.props.selectedEndDate === this.props.selectedStartDate,
    disabledAfter: moment(this.props.disabledAfter),
    disabledBefore: moment(this.props.disabledBefore),
    rowHeight: null,
    firstSelection: true,
  };

  static propTypes = {
    customStyle: PropTypes.object,
    dayHeadings: PropTypes.array,
    eventDates: PropTypes.array,
    monthNames: PropTypes.array,
    nextButtonText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    disabledBefore: PropTypes.any,
    disabledAfter: PropTypes.any,
    selectStartDate: PropTypes.bool,
    onDateSelect: PropTypes.func,
    onStartDateSelect: PropTypes.func,
    onEndDateSelect: PropTypes.func,
    onSwipeNext: PropTypes.func,
    onSwipePrev: PropTypes.func,
    onTouchNext: PropTypes.func,
    onTouchPrev: PropTypes.func,
    prevButtonText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    scrollEnabled: PropTypes.bool,
    selectedDate: PropTypes.any,
    selectedStartDate: PropTypes.any,
    selectedEndDate: PropTypes.any,
    showControls: PropTypes.bool,
    showEventIndicators: PropTypes.bool,
    startDate: PropTypes.any,
    titleFormat: PropTypes.string,
    today: PropTypes.any,
    weekStart: PropTypes.number,
    rangeEnabled: PropTypes.bool,
    fadedRange: PropTypes.bool,
  };

  static defaultProps = {
    customStyle: {},
    width: DEVICE_WIDTH,
    dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    eventDates: [],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    nextButtonText: 'Next',
    prevButtonText: 'Prev',
    scrollEnabled: false,
    showControls: false,
    showEventIndicators: false,
    startDate: moment().format('YYYY-MM-DD'),
    titleFormat: 'MMMM YYYY',
    today: moment().format('YYYY-MM-DD'),
    weekStart: 1,
    rangeEnabled: false,
    fadedRange: false,
    disabledBefore: null,
    disabledAfter: null,
  };

  componentDidMount() {
    // fixes initial scrolling bug on Android
    setTimeout(() => this.scrollToItem(VIEW_INDEX), 0)
  }

  componentDidUpdate() {
    this.scrollToItem(VIEW_INDEX);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDate && this.props.selectedDate !== nextProps.selectedDate) {
      this.setState({selectedMoment: nextProps.selectedDate});
    }
    if (this.props.selectStartDate !== nextProps.selectStartDate) {
      this.setState({selectStartDate: nextProps.selectStartDate});
    }
    if (this.props.disabledBefore !== nextProps.disabledBefore) {
      this.setState({disabledBefore: nextProps.disabledBefore});
    }
    if (this.props.disabledAfter !== nextProps.disabledAfter) {
      this.setState({disabledAfter: nextProps.disabledAfter});
    }
    if (this.props.fadedRange && nextProps.selectedEndDate && this.props.selectedEndDate !== nextProps.selectedEndDate) {
      this.setState({selectedEndMoment: nextProps.selectedEndDate});
    }
  }

  getMonthStack(currentMonth) {
    if (this.props.scrollEnabled) {
      const res = [];
      for (let i = -VIEW_INDEX; i <= VIEW_INDEX; i++) {
        res.push(moment(currentMonth).add(i, 'month'));
      }
      return res;
    }
    return [moment(currentMonth)];
  }

  prepareEventDates(eventDates, events) {
    const parsedDates = {};

    // Dates without any custom properties
    eventDates.forEach(event => {
      const date = moment(event);
      const month = moment(date).startOf('month').format();
      parsedDates[month] = parsedDates[month] || {};
      parsedDates[month][date.date() - 1] = {};
    });

    // Dates with custom properties
    if (events) {
      events.forEach(event => {
        if (event.date) {
          const date = moment(event.date);
          const month = moment(date).startOf('month').format();
          parsedDates[month] = parsedDates[month] || {};
          parsedDates[month][date.date() - 1] = event;
        }
      });
    }
    return parsedDates;
  }

  selectDate(date, argMoment) {
    if (this.props.selectedDate === undefined) {
      this.setState({ selectedMoment: date });
    }
    let rangeStart = this.state.rangeStart;
    let rangeEnd = this.state.rangeEnd;
    let selectStartDate = this.state.selectStartDate;
    let firstSelection = this.state.firstSelection;
      if (this.props.rangeEnabled) {
        if (firstSelection && selectStartDate) {
          rangeEnd = date;
          rangeStart = date;
        } else if (firstSelection && !selectStartDate && date.isAfter(rangeStart)) {
          rangeEnd = date;
          firstSelection = false;
        } else if (selectStartDate && date.isBefore(rangeEnd)) {
          rangeStart = date;
        } else if (!selectStartDate && date.isAfter(rangeStart)) {
          rangeEnd = date;
        } else {
          return;
        }
        this.setState({
          rangeStart,
          rangeEnd,
          firstSelection,
        });
        // If selected day is rangeEnd, run onEndDateSelect callback
        this.state.rangeEnd != rangeEnd ?
          this.props.onEndDateSelect && this.props.onEndDateSelect(date ? date.format() : null,
            null,
            rangeEnd ? rangeEnd.format() : null ) :
          null;
        // If selected day is rangeStart, run onStartDateSelect callback
        this.state.rangeStart != rangeStart ?
          this.props.onStartDateSelect && this.props.onStartDateSelect(date ? date.format() : null,
            rangeStart ? rangeStart.format() : null
          ) :
          null;

        return;
      }
    // If range is disabled, run onDateSelect callback
    this.props.onDateSelect && this.props.onDateSelect(date ? date.format() : null,
      rangeStart ? rangeStart.format() : null,
      rangeEnd ? rangeEnd.format() : null );
  }

  onPrev = () => {
    const newMoment = moment(this.state.currentMonthMoment).subtract(1, 'month');
    this.setState({ currentMonthMoment: newMoment });
    this.props.onTouchPrev && this.props.onTouchPrev(newMoment);
  }

  onNext = () => {
    const newMoment = moment(this.state.currentMonthMoment).add(1, 'month');
    this.setState({ currentMonthMoment: newMoment });
    this.props.onTouchNext && this.props.onTouchNext(newMoment);
  }

  scrollToItem(itemIndex) {
    const scrollToX = itemIndex * this.props.width;
    if (this.props.scrollEnabled) {
      this._calendar.scrollTo({ y: 0, x: scrollToX, animated: false });
    }
  }

  scrollEnded(event) {
    const position = event.nativeEvent.contentOffset.x;
    const currentPage = position / this.props.width;
    const newMoment = moment(this.state.currentMonthMoment).add(currentPage - VIEW_INDEX, 'month');
    this.setState({ currentMonthMoment: newMoment });

    if (currentPage < VIEW_INDEX) {
      this.props.onSwipePrev && this.props.onSwipePrev(newMoment);
    } else if (currentPage > VIEW_INDEX) {
      this.props.onSwipeNext && this.props.onSwipeNext(newMoment);
    }
  }

  onWeekRowLayout = (event) => {
    if (this.state.rowHeight !== event.nativeEvent.layout.height) {
      this.setState({ rowHeight: event.nativeEvent.layout.height });
    }
  }

  isDisabled = (dayIndex, startOfArgMonthMoment) => {
    beforeIndex = moment(this.state.disabledBefore).date() - 1;
    afterIndex = moment(this.state.disabledAfter).date() - 1;
    // Case 1: current month is before disabledBefore month, return true
    if (this.state.disabledBefore &&
        startOfArgMonthMoment.isBefore(this.state.disabledBefore, 'month')) {
      return true;
    }
    // Case 2: current month is after disabledAfter month, return true
    if (this.state.disabledAfter &&
        startOfArgMonthMoment.isAfter(this.state.disabledAfter, 'month')) {
      return true;
    }
    // Case 3: current month is same as disabledBefore month and dayIndex is before beforeIndex, return true
    if (this.state.disabledBefore &&
        startOfArgMonthMoment.isSame(this.state.disabledBefore, 'month') &&
        dayIndex < beforeIndex) {
      return true;
    }
    // Case 4: current month is same as disabledAfter month and dayIndex is after afterIndex, return true
    if (this.state.disabledAfter &&
        startOfArgMonthMoment.isSame(this.state.disabledAfter, 'month') &&
        dayIndex > afterIndex) {
      return true;
    }
    return false;
  }

  renderMonthView(argMoment, eventsMap) {
    let
      renderIndex = 0,
      weekRows = [],
      days = [],
      startOfArgMonthMoment = argMoment.startOf('month');

    const
      selectedMoment = moment(this.state.selectedMoment),
      rangeEnabled = this.props.rangeEnabled,
      fadedRange = this.props.fadedRange,
      rangeStart = moment(this.state.rangeStart),
      rangeEnd = moment(this.state.rangeEnd),
      weekStart = this.props.weekStart,
      todayMoment = moment(this.props.today),
      todayIndex = todayMoment.date() - 1,
      argMonthDaysCount = argMoment.daysInMonth(),
      offset = (startOfArgMonthMoment.isoWeekday() - weekStart + 7) % 7,
      argMonthIsToday = argMoment.isSame(todayMoment, 'month'),
      argAfterStartMonth = argMoment.isAfter(rangeStart, 'month'),
      argIsStartMonth = argMoment.isSame(rangeStart, 'month'),
      argBeforeEndMonth = argMoment.isBefore(rangeEnd, 'month'),
      argIsEndMonth = argMoment.isSame(rangeEnd, 'month'),
      selectedIndex = moment(selectedMoment).date() - 1,
      rangeStartIndex = moment(rangeStart).date() - 1,
      rangeEndIndex = moment(rangeEnd).date() - 1,
      selectedMonthIsArg = selectedMoment.isSame(argMoment, 'month');

    const events = (eventsMap !== null)
      ? eventsMap[argMoment.startOf('month').format()]
      : null;

    do {
      const dayIndex = renderIndex - offset;
      const isoWeekday = (renderIndex + weekStart) % 7;
      if (dayIndex >= 0 && dayIndex < argMonthDaysCount) {
        days.push((
          <Day
            startOfMonth={startOfArgMonthMoment}
            isWeekend={isoWeekday === 0 || isoWeekday === 6}
            isThurs={isoWeekday === 4}
            key={`${renderIndex}`}
            onPress={() => {
              this.selectDate(moment(startOfArgMonthMoment).set('date', dayIndex + 1), argMoment);
            }}
            caption={`${dayIndex + 1}`}
            isToday={argMonthIsToday && (dayIndex === todayIndex)}
            isSelected={selectedMonthIsArg && (dayIndex === selectedIndex)}
            isInRange={rangeEnabled &&
            (argAfterStartMonth || argIsStartMonth && dayIndex > rangeStartIndex) &&
            (argBeforeEndMonth || argIsEndMonth && dayIndex < rangeEndIndex)}
            isStartRange={rangeEnabled &&
              (argIsStartMonth && dayIndex === rangeStartIndex)}
            isEndRange={rangeEnabled &&
              (argIsEndMonth && dayIndex === rangeEndIndex)}
            fadedRange={fadedRange}
            event={events && events[dayIndex]}
            showEventIndicators={this.props.showEventIndicators}
            customStyle={this.props.customStyle}
            disabled={this.isDisabled(dayIndex, startOfArgMonthMoment)}
          />
        ));
      } else {
        days.push(<Day key={`${renderIndex}`} filler customStyle={this.props.customStyle} />);
      }
      if (renderIndex % 7 === 6) {
        weekRows.push(
          <View
            key={weekRows.length}
            onLayout={weekRows.length ? undefined : this.onWeekRowLayout}
            style={[styles.weekRow, this.props.customStyle.weekRow]}
          >
            {days}
          </View>);
        days = [];
        if (dayIndex + 1 >= argMonthDaysCount) {
          break;
        }
      }
      renderIndex += 1;
    } while (true)
    const containerStyle = [styles.monthContainer, this.props.customStyle.monthContainer];
    return <View key={argMoment.month()} style={containerStyle}>{weekRows}</View>;
  }

  renderHeading() {
    const headings = [];
    for (let i = 0; i < 7; i++) {
      const j = (i + this.props.weekStart) % 7;
      headings.push(
        <Text
          key={i}
          style={j === 0 || j === 6 ?
            [styles.weekendHeading, this.props.customStyle.weekendHeading] :
            [styles.dayHeading, this.props.customStyle.dayHeading]}
        >
          {this.props.dayHeadings[j]}
        </Text>
      );
    }

    return (
      <View style={[styles.calendarHeading, this.props.customStyle.calendarHeading]}>
        {headings}
      </View>
    );
  }

  renderTopBar() {
    let localizedMonth = this.props.monthNames[this.state.currentMonthMoment.month()];
    return this.props.showControls
      ? (
      <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
        <TouchableOpacity
          style={[styles.controlButton, this.props.customStyle.controlButton]}
          onPress={this.onPrev}
        >
          <Text style={[styles.controlButtonText, this.props.customStyle.controlButtonText]}>
            {this.props.prevButtonText}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, this.props.customStyle.title]}>
          {this.state.currentMonthMoment.format(this.props.titleFormat)}
        </Text>
        <TouchableOpacity
          style={[styles.controlButton, this.props.customStyle.controlButton]}
          onPress={this.onNext}
        >
          <Text style={[styles.controlButtonText, this.props.customStyle.controlButtonText]}>
            {this.props.nextButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    )
      : (
      <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
        <Text style={[styles.title, this.props.customStyle.title]}>
          {this.state.currentMonthMoment.format(this.props.titleFormat)}
        </Text>
      </View>
    );
  }

  render() {
    const calendarDates = this.getMonthStack(this.state.currentMonthMoment);
    const eventDatesMap = this.prepareEventDates(this.props.eventDates, this.props.events);
    const numOfWeeks = getNumberOfWeeks(this.state.currentMonthMoment);

    return (
      <View style={[styles.calendarContainer, this.props.customStyle.calendarContainer]}>
        {this.renderTopBar()}
        {this.renderHeading(this.props.titleFormat)}
        {this.props.scrollEnabled ?
          <ScrollView
            ref={calendar => this._calendar = calendar}
            horizontal
            scrollEnabled
            pagingEnabled
            removeClippedSubviews
            scrollEventThrottle={1000}
            showsHorizontalScrollIndicator={false}
            automaticallyAdjustContentInsets
            onMomentumScrollEnd={(event) => this.scrollEnded(event)}
            style={{
              height: this.state.rowHeight ? this.state.rowHeight * numOfWeeks : null,
            }}
          >
            {calendarDates.map((date) => this.renderMonthView(moment(date), eventDatesMap))}
          </ScrollView>
          :
          <View ref={calendar => this._calendar = calendar}>
            {calendarDates.map((date) => this.renderMonthView(moment(date), eventDatesMap))}
          </View>
        }
      </View>
    );
  }
}

export default Calendar;
