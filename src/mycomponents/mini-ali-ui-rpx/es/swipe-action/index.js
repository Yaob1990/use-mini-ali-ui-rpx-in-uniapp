import fmtUnit from '../_util/fmtUnit';
var isV2 = my.canIUse('movable-view.onTouchStart');
Component({
  data: {
    leftPos: 0,
    swiping: false,
    holdSwipe: true,
    viewWidth: 0,
    x: 0,
    actionWidth: 0,
    transitionVal: 'none',
    radiusItemSpace: fmtUnit('12px')
  },
  props: {
    className: '',
    right: [],
    restore: false,
    borderRadius: false,
    index: null,
    swipeitem: null,
    height: 0,
    enableNew: true,
    swipeWidth: ''
  },
  didMount: function didMount() {
    var _this$props = this.props,
        enableNew = _this$props.enableNew,
        swipeWidth = _this$props.swipeWidth;
    var useV2 = isV2 && enableNew;
    this.setData({
      useV2: useV2
    });

    if (swipeWidth.match(/%/)) {
      this.setData({
        swipeWidth: ''
      });
    }

    this.setWindowWidth();
  },
  didUpdate: function didUpdate(_prevProps, prevData) {
    var restore = this.props.restore;
    var _this$data = this.data,
        holdSwipe = _this$data.holdSwipe,
        useV2 = _this$data.useV2;

    if (restore === true && _prevProps.restore !== restore || prevData.holdSwipe === true && holdSwipe === false) {
      this.setData({
        leftPos: 0,
        swiping: false,
        cellWidth: this.btnWidth,
        x: this.btnWidth // V2

      });
    }

    this.getSwipeHeight();

    if (!useV2) {
      this.setBtnWidth();
      this.getSwipeHeight();
    }
  },
  methods: {
    setWindowWidth: function setWindowWidth() {
      var _this = this;

      my.getSystemInfo({
        success: function success(res) {
          _this.setData({
            viewWidth: res.windowWidth
          });

          _this.setBtnWidth();

          _this.getSwipeHeight();
        }
      });
    },
    setBtnWidth: function setBtnWidth() {
      var _this2 = this;

      my.createSelectorQuery().select(".am-swipe-right-" + this.$id).boundingClientRect().exec(function (ret) {
        _this2.btnWidth = ret && ret[0] && ret[0].width || 0;

        if (isV2 && _this2.props.enableNew) {
          _this2.setData({
            actionWidth: _this2.btnWidth,
            x: _this2.btnWidth,
            cellWidth: _this2.btnWidth,
            lastWidth: _this2.btnWidth
          });
        }
      });
    },
    getSwipeHeight: function getSwipeHeight() {
      var _this3 = this;

      var enableNew = this.props.enableNew;
      var useV2 = isV2 && enableNew;

      if (useV2) {
        my.createSelectorQuery().select(".am-swipe-movable-area-" + this.$id).boundingClientRect().exec(function (ret) {
          if (!ret) return;

          _this3.setData({
            height: parseInt(ret[0].height, 0)
          });
        });
      }
    },
    onSwipeTap: function onSwipeTap() {
      this.setData({
        cellWidth: this.data.lastWidth
      });

      if (!this.data.swiping && this.data.x < 0 || this.data.leftPos !== 0) {
        this.setData({
          leftPos: 0,
          swiping: false,
          x: 0
        });
      }
    },
    onSwipeStart: function onSwipeStart(e) {
      this.touchObject = {
        startX: e.touches[0].pageX,
        startY: e.touches[0].pageY
      };
      var _this$props2 = this.props,
          index = _this$props2.index,
          onSwipeStart = _this$props2.onSwipeStart;

      if (onSwipeStart) {
        onSwipeStart({
          index: index
        });
      }
    },
    onSwipeMove: function onSwipeMove(e) {
      var touchObject = this.touchObject;
      var touchePoint = e.touches[0];
      var leftPos = this.data.leftPos;
      touchObject.endX = touchePoint.pageX; // ????????????????????????????????????

      if (touchObject.direction === undefined) {
        var direction = 0;
        var xDist = touchObject.startX - touchePoint.pageX || 0;
        var yDist = touchObject.startY - touchePoint.pageY || 0;
        var r = Math.atan2(yDist, xDist);
        var swipeAngle = Math.round(r * 180 / Math.PI);

        if (swipeAngle < 0) {
          swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if (swipeAngle <= 45 && swipeAngle >= 0) {
          direction = 1;
        }

        if (swipeAngle <= 360 && swipeAngle >= 315) {
          direction = 1;
        }

        if (swipeAngle >= 135 && swipeAngle <= 225) {
          direction = -1;
        }

        touchObject.direction = direction;
      } // ?????????????????????????????????


      if (touchObject.direction !== 0) {
        var newLeftPos = leftPos; // ????????????

        var distance = touchObject.endX - touchObject.startX; // ??????

        if (distance < 0) {
          newLeftPos = Math.max(distance, -this.btnWidth); // ??????
        } else {
          newLeftPos = 0;
        }

        if (Math.abs(distance) > 10) {
          this.setData({
            leftPos: newLeftPos,
            swiping: distance < 0
          });
        }
      }
    },
    onSwipeEnd: function onSwipeEnd(e) {
      var touchObject = this.touchObject;

      if (touchObject.direction !== 0) {
        var touchePoint = e.changedTouches[0];
        touchObject.endX = touchePoint.pageX;
        var leftPos = this.data.leftPos;
        var distance = touchObject.endX - touchObject.startX;
        var newLeftPos = leftPos;

        if (distance < 0) {
          if (Math.abs(distance + leftPos) > this.btnWidth * 0.7) {
            newLeftPos = -this.btnWidth;
          } else {
            newLeftPos = 0;
          }
        }

        this.setData({
          leftPos: newLeftPos,
          swiping: false
        });
      }
    },
    onChange: function onChange() {
      if (!this.data.swiping) {
        this.setData({
          swiping: true,
          transitionVal: 'transform 100ms linear'
        });
      }
    },
    onChangeEnd: function onChangeEnd(e) {
      var _this4 = this;

      var actionWidth = this.data.actionWidth;
      var x = e.detail.x;
      this.setData({
        x: x < actionWidth / 2 ? -1 : actionWidth - 1,
        swiping: false
      }, function () {
        _this4.setData({
          x: _this4.data.x === -1 ? 0 : actionWidth
        });
      });
    },
    done: function done() {
      var _this5 = this;

      this.setData({
        holdSwipe: true
      }, function () {
        _this5.setData({
          holdSwipe: false
        });
      });
    },
    onItemClick: function onItemClick(e) {
      var _this6 = this;

      var onRightItemClick = this.props.onRightItemClick;
      var holdSwipe = this.data.holdSwipe;

      if (onRightItemClick) {
        var index = e.target.dataset.index;
        onRightItemClick({
          index: index,
          extra: this.props.extra,
          detail: this.props.right[index],
          done: this.done.bind(this)
        });
      }

      if (!this.data.swiping && holdSwipe === false) {
        setTimeout(function () {
          _this6.setData({
            leftPos: 0,
            swiping: false,
            x: 0
          });
        }, 300);
      }
    }
  }
});