import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import styles from './styles';

export default class Day extends Component {
  static defaultProps = {
    customStyle: {},
    fadedRange: false,
    disabled: false,
    multiRangeMode: false,
    inSelectedRange: false,
  }

  static propTypes = {
    caption: PropTypes.any,
    customStyle: PropTypes.object,
    filler: PropTypes.bool,
    event: PropTypes.object,
    isSelected: PropTypes.bool,
    isThurs: PropTypes.bool,
    isToday: PropTypes.bool,
    isWeekend: PropTypes.bool,
    isInRange: PropTypes.bool,
    isStartRange: PropTypes.bool,
    isEndRange: PropTypes.bool,
    fadedRange: PropTypes.bool,
    onPress: PropTypes.func,
    showEventIndicators: PropTypes.bool,
    disabled: PropTypes.bool,
    multiRangeMode: PropTypes.bool,
    inSelectedRange: PropTypes.bool,
  }

  dayButtonStyle = (isInRange, isThurs) => {
    const { customStyle } = this.props;
    const dayButtonStyle = [styles.dayButton, customStyle.dayButton];
    return dayButtonStyle;
  }

  dayCircleStyle = (
    isWeekend,
    isSelected,
    isToday,
    isStartRange,
    isEndRange,
    multiRangeMode,
    inSelectedRange,
    event,
  ) => {
    const { customStyle } = this.props;
    const dayCircleStyle = [styles.dayCircleFiller, customStyle.dayCircleFiller];
    /* Multi Range Mode*/
    if (multiRangeMode) {
      if (inSelectedRange && (isStartRange || isEndRange)) {
        dayCircleStyle.push(styles.selectedDayCircle, customStyle.multiRangeSelectedStyle);
      } else if (isStartRange || isEndRange) {
        dayCircleStyle.push(styles.selectedDayCircle, customStyle.multiRangeUnselectedStyle);
      }
    /* Regular Mode */
    } else {
      if (isSelected) {
        if (isToday) {
          dayCircleStyle.push(styles.currentDayCircle, customStyle.currentDayCircle);
        } else {
          dayCircleStyle.push(styles.selectedDayCircle, customStyle.selectedDayCircle);
        }
      }
      if (isStartRange || isEndRange) {
        dayCircleStyle.push(styles.selectedDayCircle, customStyle.selectedDayCircle);
      }
    }

    if (event) {
      if (isSelected) {
        dayCircleStyle.push(styles.hasEventDaySelectedCircle,
          customStyle.hasEventDaySelectedCircle, event.hasEventDaySelectedCircle);
      } else {
        dayCircleStyle.push(styles.hasEventCircle,
          customStyle.hasEventCircle, event.hasEventCircle);
      }
    }
    return dayCircleStyle;
  }

  dayTextStyle = (
    isWeekend,
    isSelected,
    isToday,
    isInRange,
    isStartRange,
    isEndRange,
    disabled,
    multiRangeMode,
    inSelectedRange,
    event,
  ) => {
    const { customStyle } = this.props;
    const dayTextStyle = [styles.day, customStyle.day];

    if (disabled) {
      dayTextStyle.push(styles.disabledDay, customStyle.disabledDay);
      return dayTextStyle;
    }

    if (isToday && !isSelected) {
      dayTextStyle.push(styles.currentDayText, customStyle.currentDayText);
    } else if (isToday || isSelected) {
      if (multiRangeMode && !inSelectedRange) {
        dayTextStyle.push(styles.currentDayText, customStyle.currentDayText);
      } else {
        dayTextStyle.push(styles.selectedDayText, customStyle.selectedDayText);
      }
    } else if (isWeekend) {
      dayTextStyle.push(styles.weekendDayText, customStyle.weekendDayText);
    }

    if (isInRange || isStartRange || isEndRange) {
      dayTextStyle.push(styles.selectedDayText, customStyle.selectedDayText);
    }

    if (event) {
      dayTextStyle.push(styles.hasEventText, customStyle.hasEventText, event.hasEventText);
    }
    return dayTextStyle;
  }

  rangeStyle = (fadedRange, multiRangeMode, inSelectedRange) => {
    const { customStyle } = this.props;
    if (multiRangeMode) {
      if (inSelectedRange) {
        return [styles.selectedRangeBar, customStyle.selectedMultiRangeBar];
      }
      return [styles.selectedFadedRangeBar, customStyle.unselectedMultiRangeBar];
    } else if (fadedRange) {
      return styles.selectedFadedRangeBar;
    }
    return styles.selectedRangeBar;
  }

  render() {
    let { caption, customStyle } = this.props;
    const {
      filler,
      event,
      isWeekend,
      isThurs,
      isSelected,
      isToday,
      isInRange,
      isStartRange,
      isEndRange,
      fadedRange,
      showEventIndicators,
      disabled,
      multiRangeMode,
      inSelectedRange,
      } = this.props;
    return filler
      ? (
        <TouchableWithoutFeedback>
          <View style={[styles.dayButtonFiller, customStyle.dayButtonFiller]}>
            <Text style={[styles.day, customStyle.day]} />
          </View>
        </TouchableWithoutFeedback>
      )
      : (
        <TouchableOpacity onPress={!this.props.disabled ? this.props.onPress : () => {}}>
          <View style={this.dayButtonStyle(isInRange, isThurs)}>
            {
              (isInRange || isEndRange) && !isStartRange ?
                <View
                  style={this.rangeStyle(fadedRange, multiRangeMode, inSelectedRange)}
                /> :
                <View style={styles.emptyRangeBar} />
            }
            {
              (isInRange || isStartRange) && !isEndRange ?
                <View
                  style={this.rangeStyle(fadedRange, multiRangeMode, inSelectedRange)}
                /> :
                <View style={styles.emptyRangeBar} />
            }
            <View
              style={this.dayCircleStyle(isWeekend, isSelected,
              isToday, isStartRange, isEndRange, multiRangeMode, inSelectedRange, event)}
            >
              <Text
                style={this.dayTextStyle(isWeekend, isSelected, isToday,
                  isInRange, isStartRange, isEndRange, disabled,
                  multiRangeMode, inSelectedRange, event)}
              >
                {caption}
              </Text>
            </View>
            {showEventIndicators &&
            <View style={[
                styles.eventIndicatorFiller,
                customStyle.eventIndicatorFiller,
                event && styles.eventIndicator,
                event && customStyle.eventIndicator,
                event && event.eventIndicator]}
            />
            }
          </View>
        </TouchableOpacity>
    );
  }
}
