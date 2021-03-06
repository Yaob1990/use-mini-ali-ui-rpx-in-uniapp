import fmtClass from '../_util/fmtClass';
import fmtEvent from '../_util/fmtEvent';
var SUPPORT_COMPONENT2 = my.canIUse('component2');
var prefixCls = 'am-button';

var noop = function noop() {};

Component({
  mixins: [],
  data: {
    baseClass: prefixCls
  },
  props: {
    className: '',
    type: '',
    dataName: '',
    disabled: false,
    subtitle: '',
    onTap: noop,
    capsuleMinWidth: false,
    showLoading: false
  },
  onInit: function onInit() {
    if (!this.props.hoverClass) {
      this.props.hoverClass = 'am-button-active';

      if (this.props.type === 'text') {
        this.props.hoverClass = 'am-button-active-text';
      }
    }

    this.setData({
      baseClass: this.wrapBaseCls(this.props),
      hoverClass: this.props.hoverClass
    });
  },
  deriveDataFromProps: function deriveDataFromProps(nextProps) {
    if (this.propsChange(this.props, nextProps)) {
      this.setData({
        baseClass: this.wrapBaseCls(nextProps)
      });
    }
  },
  didMount: function didMount() {
    if (!SUPPORT_COMPONENT2) {
      if (!this.props.hoverClass) {
        this.props.hoverClass = 'am-button-active';

        if (this.props.type === 'text') {
          this.props.hoverClass = 'am-button-active-text';
        }
      }

      this.setData({
        baseClass: this.wrapBaseCls(this.props),
        hoverClass: this.props.hoverClass
      });
    }
  },
  didUpdate: function didUpdate(prevProps) {
    if (!SUPPORT_COMPONENT2 && this.propsChange(prevProps, this.props)) {
      this.setData({
        baseClass: this.wrapBaseCls(this.props)
      });
    }
  },
  didUnmount: function didUnmount() {},
  methods: {
    wrapBaseCls: function wrapBaseCls(props) {
      var _fmtClass;

      var type = props.type,
          disabled = props.disabled,
          subtitle = props.subtitle,
          shape = props.shape,
          _props$capsuleSize = props.capsuleSize,
          capsuleSize = _props$capsuleSize === void 0 ? 'medium' : _props$capsuleSize,
          capsuleMinWidth = props.capsuleMinWidth;
      var capsuleMinWidthCls = '';

      if (capsuleMinWidth) {
        capsuleMinWidthCls = prefixCls + "-capsule-" + capsuleSize + "-minwidth";
      }

      var ret = fmtClass((_fmtClass = {}, _fmtClass["" + prefixCls] = true, _fmtClass[prefixCls + "-primary"] = type === 'primary', _fmtClass[prefixCls + "-ghost"] = type === 'ghost', _fmtClass[prefixCls + "-warn"] = type === 'warn', _fmtClass[prefixCls + "-warn-ghost"] = type === 'warn-ghost', _fmtClass[prefixCls + "-text"] = type === 'text', _fmtClass[prefixCls + "-light"] = type === 'light', _fmtClass[prefixCls + "-capsule " + prefixCls + "-capsule-" + capsuleSize + " " + capsuleMinWidthCls] = shape === 'capsule', _fmtClass[prefixCls + "-disabled"] = disabled, _fmtClass[prefixCls + "-subtitle"] = subtitle, _fmtClass));
      return ret;
    },
    onButtonTap: function onButtonTap(e) {
      var event = fmtEvent(this.props, e);
      this.props.onTap(event);
    },
    onGetAuthorize: function onGetAuthorize(e) {
      var event = fmtEvent(this.props, e);
      this.props.onGetAuthorize(event);
    },
    onError: function onError(e) {
      var event = fmtEvent(this.props, e);
      this.props.onError(event);
    },
    propsChange: function propsChange(prevProps, nextProps) {
      var pProps = Object.getOwnPropertyNames(prevProps);
      var nProps = Object.getOwnPropertyNames(nextProps);

      if (pProps.length !== nProps.length) {
        return true;
      }

      for (var i = 0; i < pProps.length; i++) {
        var propName = pProps[i];

        if (prevProps[propName] !== nextProps[propName]) {
          return true;
        }
      }

      return false;
    }
  }
});