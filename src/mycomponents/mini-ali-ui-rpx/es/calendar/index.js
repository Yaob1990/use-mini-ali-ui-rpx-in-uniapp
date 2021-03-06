import getI18n from '../_util/getI18n';
var i18n = getI18n().calendar;
/* eslint-disable complexity, no-param-reassign */

/* eslint max-depth: [2, 7] */

var leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var commonYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var FIRST_MONTH = 0;
var LAST_MONTH = 11;
var DAYS_PER_ROW = 7;
var COLOR_MAP = {
  1: '#ff6010',
  2: '#00b578',
  3: '#ff8f1f',
  4: '#1677ff',
  5: '#999'
}; // 获取某月第某天是星期几

function getDay(month, year, index) {
  return new Date(year, month, index).getDay();
} // 获取某月有几天


function getMonthLength(month, year) {
  if (year % 400 === 0 || year % 100 !== 0 && year % 4 === 0) {
    return leapYear[month];
  } else {
    return commonYear[month];
  }
} // 数字补位 1 -> 01


function prefixNum(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return "" + num;
  }
}

Component({
  data: {
    selectedYear: 0,
    selectedMonth: 0,
    currentDate: null,
    dates: [],
    blockType: 1,
    // 1.没有待办纯数字 2.有待办 用于区分不同类型日期块的样式。
    _i18nYear: i18n.year,
    _i18nMonth: i18n.month,
    _i18nWeekSun: i18n.sunday,
    _i18nWeekMon: i18n.monday,
    _i18nWeekTue: i18n.tuesday,
    _i18nWeekWed: i18n.wednesday,
    _i18nWeekThu: i18n.thursday,
    _i18nWeekFri: i18n.friday,
    _i18nWeekSat: i18n.saturday
  },
  props: {
    className: '',
    tagData: [],
    type: 'single',
    haveYear: false,
    prevMonthDisable: false,
    prevYearDisable: false,
    nextvMonthDisable: false,
    nextYearDisable: false
  },
  didMount: function didMount() {
    this.tapTimes = 1;
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    var year = date.getFullYear();
    var month = date.getMonth();
    this.setData({
      selectedYear: year,
      selectedMonth: month,
      currentDate: date
    });
    this.refreshdates(month, year);
  },
  didUpdate: function didUpdate() {
    var dates = this.data.dates;
    var blockType = 1;

    for (var i = 0; i < dates.length; i++) {
      for (var j = 0; j < dates[i].length; j++) {
        if (this.hasTag(dates[i][j])) {
          blockType = 2;
        }
      }
    }

    this.setData({
      dates: dates,
      blockType: blockType
    });
  },
  methods: {
    onPrevYearTap: function onPrevYearTap() {
      var _this$data = this.data,
          selectedMonth = _this$data.selectedMonth,
          selectedYear = _this$data.selectedYear;
      var prevYearDisable = this.props.prevYearDisable;

      if (!prevYearDisable) {
        var year = selectedYear;
        var month = selectedMonth;
        year = selectedYear - 1;

        if (this.props.onYearChange) {
          this.props.onYearChange(year, selectedYear);
        }

        if (this.props.onChange) {
          this.props.onChange({
            year: year,
            month: month
          }, {
            year: selectedYear,
            month: selectedMonth
          });
        }

        this.setData({
          selectedYear: year
        });
        this.refreshdates(month, year);
      }
    },
    onNextYearTap: function onNextYearTap() {
      var _this$data2 = this.data,
          selectedMonth = _this$data2.selectedMonth,
          selectedYear = _this$data2.selectedYear;
      var nextYearDisable = this.props.nextYearDisable;

      if (!nextYearDisable) {
        var year = selectedYear;
        var month = selectedMonth;
        year = selectedYear + 1;

        if (this.props.onYearChange) {
          this.props.onYearChange(year, selectedYear);
        }

        if (this.props.onChange) {
          this.props.onChange({
            year: year,
            month: month
          }, {
            year: selectedYear,
            month: selectedMonth
          });
        }

        this.setData({
          selectedYear: year
        });
        this.refreshdates(month, year);
      }
    },
    onPrevMonthTap: function onPrevMonthTap() {
      var _this$data3 = this.data,
          selectedMonth = _this$data3.selectedMonth,
          selectedYear = _this$data3.selectedYear;
      var prevMonthDisable = this.props.prevMonthDisable;

      if (!prevMonthDisable) {
        var year = selectedYear;
        var month = selectedMonth; // 如果当前选中是一月份，前一月是去年的12月

        if (selectedMonth === FIRST_MONTH) {
          year = selectedYear - 1;
          month = LAST_MONTH;
        } else {
          month = selectedMonth - 1;
        }

        if (this.props.onMonthChange) {
          this.props.onMonthChange(month, selectedMonth);
        }

        if (this.props.onChange) {
          this.props.onChange({
            year: year,
            month: month
          }, {
            year: selectedYear,
            month: selectedMonth
          });
        }

        this.setData({
          selectedYear: year,
          selectedMonth: month
        });
        this.refreshdates(month, year);
      }
    },
    onNextMonthTap: function onNextMonthTap() {
      var _this$data4 = this.data,
          selectedMonth = _this$data4.selectedMonth,
          selectedYear = _this$data4.selectedYear;
      var nextvMonthDisable = this.props.nextvMonthDisable;

      if (!nextvMonthDisable) {
        var year = selectedYear;
        var month = selectedMonth; // 如果当前选中是十二月份，下一月是去年的12月

        if (selectedMonth === LAST_MONTH) {
          year = selectedYear + 1;
          month = FIRST_MONTH;
        } else {
          month = selectedMonth + 1;
        }

        if (this.props.onMonthChange) {
          this.props.onMonthChange(month, selectedMonth);
        }

        if (this.props.onChange) {
          this.props.onChange({
            year: year,
            month: month
          }, {
            year: selectedYear,
            month: selectedMonth
          });
        }

        this.setData({
          selectedYear: year,
          selectedMonth: month
        });
        this.refreshdates(month, year);
      }
    },
    refreshdates: function refreshdates(month, year) {
      this.tapTimes = 1;
      var _this$data5 = this.data,
          selectedYear = _this$data5.selectedYear,
          selectedMonth = _this$data5.selectedMonth,
          currentDate = _this$data5.currentDate;
      var firstDay = getDay(month, year, 1);
      var days = getMonthLength(month, year);
      var datesArray = [];
      var currentDateTimeStamp = +currentDate;
      var num = 0;

      for (var i = 0; i < firstDay; i++) {
        num += 1; // 如果当前选中的是一月份，前一个月是去年的12月

        var _year = selectedYear;
        var _month = selectedMonth;

        if (selectedMonth === 0) {
          _year = selectedYear - 1;
          _month = LAST_MONTH;
        } else {
          _year = selectedYear;
          _month = selectedMonth - 1;
        }

        var date = getMonthLength(_month, _year) - i;
        datesArray.unshift({
          year: _year,
          month: _month,
          date: date,
          isToday: false,
          isGray: true,
          isSelected: false,
          tag: ''
        });
      }

      for (var _i = 0; _i < days; _i++) {
        num += 1;

        var _date = _i + 1;

        var dateTimeStamp = +new Date(selectedYear, selectedMonth, _date);
        datesArray.push({
          year: selectedYear,
          month: selectedMonth,
          date: _date,
          isToday: dateTimeStamp === currentDateTimeStamp,
          isGray: false,
          isSelected: dateTimeStamp === currentDateTimeStamp,
          tag: ''
        });
      }

      var nextDate = 0;
      var daysPerPage = 35;

      if (num > 35) {
        daysPerPage = 42;
      }

      for (var _i2 = 0; _i2 < daysPerPage - days - firstDay; _i2++) {
        // 如果是12月，下月是第二年的1月份
        nextDate += 1;
        var _year2 = selectedYear;
        var _month2 = selectedMonth;

        if (selectedMonth === LAST_MONTH) {
          _year2 = selectedYear + 1;
          _month2 = FIRST_MONTH;
        } else {
          _year2 = selectedYear;
          _month2 = selectedMonth + 1;
        }

        datesArray.push({
          year: _year2,
          month: _month2,
          date: nextDate,
          isToday: false,
          isGray: true,
          isSelected: false,
          tag: ''
        });
      }

      var blockType = 1;

      for (var _i3 = 0; _i3 < datesArray.length; _i3++) {
        if (this.hasTag(datesArray[_i3])) {
          blockType = 2;
        }
      }

      var dates = [];
      var weekDates = [];

      for (var _i4 = 0; _i4 < datesArray.length; _i4++) {
        weekDates.push(datesArray[_i4]);

        if ((_i4 + 1) % DAYS_PER_ROW === 0) {
          dates.push([].concat(weekDates));
          weekDates = [];
        }
      }

      this.setData({
        dates: dates,
        blockType: blockType
      });
    },
    hasTag: function hasTag(dateObj) {
      var tagData = this.props.tagData; // 去重由调用者处理

      if (tagData.length === 0) {
        dateObj.tag = '';
        return false;
      }

      return tagData.some(function (item) {
        var dateArr = item.date.split('-');
        var dateStr = []; // 兼容ios下new Date('2018-1-1')格式返回invalid Date的问题

        for (var i = 0; i < dateArr.length; i++) {
          dateStr.push(dateArr[i].length > 1 ? dateArr[i] : "0" + dateArr[i]);
        }

        var date = new Date(dateStr.join('-'));

        if (dateObj.year === date.getFullYear() && dateObj.month === date.getMonth() && dateObj.date === date.getDate()) {
          dateObj.tag = item.tag;
          dateObj.color = COLOR_MAP[item.tagColor];
          dateObj.disable = item.disable;
          return true;
        } else {
          dateObj.tag = '';
          return false;
        }
      });
    },
    getDateGap: function getDateGap(day1, day2) {
      var date1 = +new Date(day1.year, prefixNum(day1.month), prefixNum(day1.date));
      var date2 = +new Date(day2.year, prefixNum(day2.month), prefixNum(day2.date));
      return (date1 - date2) / (24 * 3600 * 1000);
    },
    makeDate: function makeDate(dateObj) {
      return new Date(dateObj.year + "-" + prefixNum(dateObj.month + 1) + "-" + prefixNum(dateObj.date));
    },
    onDateTap: function onDateTap(event) {
      var dates = this.data.dates;
      var _event$currentTarget$ = event.currentTarget.dataset,
          year = _event$currentTarget$.year,
          month = _event$currentTarget$.month,
          date = _event$currentTarget$.date;
      var type = this.props.type;

      if (type === 'range') {
        if (this.tapTimes % 2 === 0) {
          this.tapTimes += 1;
          this.endDate = {
            year: year,
            month: month,
            date: date
          };
          var dateGap = this.getDateGap(this.startDate, this.endDate);

          if (dateGap > 0) {
            var _ref = [this.endDate, this.startDate];
            this.startDate = _ref[0];
            this.endDate = _ref[1];
          }

          var hasDisable = false;

          for (var i = 0; i < dates.length; i++) {
            for (var j = 0; j < dates[i].length; j++) {
              var dateObj = dates[i][j];
              dateObj.isStart = false;
              dateObj.isMiddle = false;
              dateObj.isEnd = false;
              var startDateGap = this.getDateGap(dateObj, this.startDate);
              var endDateGap = this.getDateGap(dateObj, this.endDate);

              if (dateObj.year === year && dateObj.month === month && dateObj.date === date && dateObj.disable) {
                hasDisable = true;
              }

              if (startDateGap > 0 && endDateGap < 0) {
                if (dateObj.disable) {
                  hasDisable = true;
                }

                if (dateGap !== 0) {
                  if (j === 0) {
                    dateObj.isStart = true;
                  } else if (j === 6) {
                    dateObj.isEnd = true;
                  } else {
                    dateObj.isMiddle = true;
                  }
                } else {
                  dateObj.isSelected = true;
                }
              }

              if (this.startDate.year === dateObj.year && this.startDate.month === dateObj.month && this.startDate.date === dateObj.date && dateGap !== 0) {
                if (j === 6) {
                  dateObj.isSelected = true;
                } else {
                  dateObj.isStart = true;
                }
              }

              if (this.endDate.year === dateObj.year && this.endDate.month === dateObj.month && this.endDate.date === dateObj.date && dateGap !== 0) {
                if (j === 0) {
                  dateObj.isSelected = true;
                } else {
                  dateObj.isEnd = true;
                }
              }
            }
          }

          if (hasDisable) {
            this.props.onSelectHasDisableDate([this.makeDate(this.startDate), this.makeDate(this.endDate)]);
            return;
          }

          if (this.props.onSelect) {
            this.props.onSelect([this.makeDate(this.startDate), this.makeDate(this.endDate)]);
          }
        } else {
          var isDisable = false;

          for (var _i5 = 0; _i5 < dates.length; _i5++) {
            for (var _j = 0; _j < dates[_i5].length; _j++) {
              var _dateObj = dates[_i5][_j];

              if (_dateObj.year === year && _dateObj.month === month && _dateObj.date === date) {
                if (_dateObj.disable) {
                  // console.log(1111);
                  isDisable = true;
                  _dateObj.isSelected = false;
                } else {
                  _dateObj.isSelected = true;
                }

                _dateObj.isStart = false;
                _dateObj.isMiddle = false;
                _dateObj.isEnd = false;
              } else {
                _dateObj.isSelected = false;
                _dateObj.isStart = false;
                _dateObj.isMiddle = false;
                _dateObj.isEnd = false;
              }
            }
          }

          if (!isDisable) {
            this.tapTimes += 1;
          }

          this.startDate = {
            year: year,
            month: month,
            date: date
          };
        }

        this.setData({
          dates: dates
        });
      } else {
        var _isDisable = false;

        for (var _i6 = 0; _i6 < dates.length; _i6++) {
          for (var _j2 = 0; _j2 < dates[_i6].length; _j2++) {
            var _dateObj2 = dates[_i6][_j2];

            if (_dateObj2.year === year && _dateObj2.month === month && _dateObj2.date === date) {
              _dateObj2.isSelected = true;

              if (_dateObj2.disable) {
                _isDisable = true;
              }
            } else {
              _dateObj2.isSelected = false;
            }
          }
        }

        if (_isDisable) {
          return;
        }

        this.setData({
          dates: dates
        });

        if (this.props.onSelect) {
          this.props.onSelect([this.makeDate({
            year: year,
            month: month,
            date: date
          }), undefined]);
        }
      }
    }
  }
});