define(['exports', 'fineuploader-client/utilities', 'fineuploader-client/dom/utilities', './constants', 'jquery', 'jquery-ui/ui/core', 'jquery-ui/ui/widget', 'jquery-ui/ui/mouse', 'jquery-ui/ui/sortable'], function (exports, _fineuploaderClientUtilities, _fineuploaderClientDomUtilities, _constants, _jquery, _jqueryUiUiCore, _jqueryUiUiWidget, _jqueryUiUiMouse, _jqueryUiUiSortable) {
  'use strict';

  exports.__esModule = true;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _$ = _interopRequireDefault(_jquery);

  var _ui = _interopRequireDefault(_jqueryUiUiCore);

  var _widgetFactory = _interopRequireDefault(_jqueryUiUiWidget);

  var _mouseInteraction = _interopRequireDefault(_jqueryUiUiMouse);

  var _sortable = _interopRequireDefault(_jqueryUiUiSortable);

  var PrimaryDrag = (function () {
    function PrimaryDrag(callback) {
      _classCallCheck(this, PrimaryDrag);

      this._callback = callback;
      this._uploadPaths = {};
    }

    PrimaryDrag.prototype._initialize = function _initialize() {
      var container = _fineuploaderClientDomUtilities.getContainer(this._uploader.settings.container);

      container.addClass(_constants.CONTAINER_CLASS);
    };

    PrimaryDrag.prototype._getUploadPath = function _getUploadPath(id) {
      return this._uploadPaths[id];
    };

    PrimaryDrag.prototype._fireCallback = function _fireCallback(id, name, upload_path) {
      if (_fineuploaderClientUtilities.isFunction(this._callback)) {
        this._callback(id, name, upload_path);
      }
    };

    PrimaryDrag.prototype._initializeSortable = function _initializeSortable() {
      var self = this;
      var list = _fineuploaderClientDomUtilities.getFileList(this._uploader.settings.container);

      list.sortable({
        containment: 'parent',
        placeholder: _constants.PLACEHOLDER_CLASS,
        sort: function sort(event, ui) {
          var self = _$['default'](this),
              width = ui.helper.outerWidth(),
              top = ui.helper.position().top;

          self.children().each(function () {
            if (_$['default'](this).hasClass('ui-sortable-helper') || _$['default'](this).hasClass('uploader-sortable-placeholder')) {
              return true;
            }

            var distance = Math.abs(ui.position.left - _$['default'](this).position().left),
                before = ui.position.left > _$['default'](this).position().left;

            if (width - distance > width / 2 && distance < width && _$['default'](this).position().top === top) {
              if (before) {
                _$['default']('.uploader-sortable-placeholder', self).insertBefore(_$['default'](this));
              } else {
                _$['default']('.uploader-sortable-placeholder', self).insertAfter(_$['default'](this));
              }
              return false;
            }
          });
        },
        stop: function stop(event, ui) {
          self._setPrimary();
        }
      });
    };

    PrimaryDrag.prototype._onDelete = function _onDelete() {
      this._setPrimary();
    };

    PrimaryDrag.prototype._setPrimary = function _setPrimary() {
      var list = _fineuploaderClientDomUtilities.getFileList(this._uploader.settings.container);

      var first = list.children('li[qq-file-id]:first-child');
      var current = list.children('li[qq-file-id].' + _constants.PRIMARY_CLASS);

      current.removeClass(_constants.PRIMARY_CLASS);
      first.addClass(_constants.PRIMARY_CLASS);

      var id = this._uploader.fineuploader.getId(first[0]);
      var name = this._uploader.fineuploader.getName(id);
      var upload_path = this._uploadPaths[id];

      this._fireCallback(id, name, upload_path);
    };

    PrimaryDrag.prototype._setupListeners = function _setupListeners() {
      var self = this;

      this._uploader.listen('onTemplateRendered', function () {
        self._initialize();
      });

      this._uploader.listen('onDeleteComplete', function () {
        self._setPrimary();
      });

      this._uploader.listen('onComplete', function (id, name, responseJSON, xhr) {
        self._setUploadPath(id, responseJSON.upload_path);
      });

      this._uploader.listen('onAllComplete', function () {
        self._initializeSortable();
        self._setPrimary();
      });
    };

    PrimaryDrag.prototype._setUploadPath = function _setUploadPath(id, path) {
      this._uploadPaths[id] = path;
    };

    PrimaryDrag.prototype.__setUploader = function __setUploader(uploader) {
      this._uploader = uploader;

      this._setupListeners();
    };

    return PrimaryDrag;
  })();

  exports.PrimaryDrag = PrimaryDrag;
});