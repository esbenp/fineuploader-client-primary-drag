System.register(['fineuploader-client/utilities', 'fineuploader-client/dom/utilities', './constants', 'jquery', 'jquery-ui/core', 'jquery-ui/widget', 'jquery-ui/mouse', 'jquery-ui/sortable'], function (_export) {
  'use strict';

  var isFunction, isUndefined, getContainer, getFileList, CONTAINER_CLASS, PLACEHOLDER_CLASS, PRIMARY_CLASS, $, ui, widgetFactory, mouseInteraction, sortable, PrimaryDrag;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_fineuploaderClientUtilities) {
      isFunction = _fineuploaderClientUtilities.isFunction;
      isUndefined = _fineuploaderClientUtilities.isUndefined;
    }, function (_fineuploaderClientDomUtilities) {
      getContainer = _fineuploaderClientDomUtilities.getContainer;
      getFileList = _fineuploaderClientDomUtilities.getFileList;
    }, function (_constants) {
      CONTAINER_CLASS = _constants.CONTAINER_CLASS;
      PLACEHOLDER_CLASS = _constants.PLACEHOLDER_CLASS;
      PRIMARY_CLASS = _constants.PRIMARY_CLASS;
    }, function (_jquery) {
      $ = _jquery['default'];
    }, function (_jqueryUiCore) {
      ui = _jqueryUiCore['default'];
    }, function (_jqueryUiWidget) {
      widgetFactory = _jqueryUiWidget['default'];
    }, function (_jqueryUiMouse) {
      mouseInteraction = _jqueryUiMouse['default'];
    }, function (_jqueryUiSortable) {
      sortable = _jqueryUiSortable['default'];
    }],
    execute: function () {
      PrimaryDrag = (function () {
        function PrimaryDrag(callback) {
          _classCallCheck(this, PrimaryDrag);

          this._callback = callback;
          this._uploadPaths = {};
        }

        PrimaryDrag.prototype._initialize = function _initialize() {
          var container = getContainer(this._uploader.settings.container);

          container.addClass(CONTAINER_CLASS);
        };

        PrimaryDrag.prototype._getUploadPath = function _getUploadPath(id) {
          return this._uploadPaths[id];
        };

        PrimaryDrag.prototype._fireCallback = function _fireCallback(id, name, upload_path, order) {
          if (isFunction(this._callback)) {
            this._callback(id, name, upload_path, order);
          }
        };

        PrimaryDrag.prototype._initializeSortable = function _initializeSortable() {
          var self = this;
          var list = getFileList(this._uploader.settings.container);

          var currentPrimary;

          list.sortable({
            containment: "parent",
            placeholder: PLACEHOLDER_CLASS,
            sort: function sort(event, ui) {
              var self = $(this),
                  width = ui.helper.outerWidth(),
                  top = ui.helper.position().top;

              currentPrimary = list.children("li[qq-file-id]:first-child");

              self.children().each(function () {
                if ($(this).hasClass('ui-sortable-helper') || $(this).hasClass(PLACEHOLDER_CLASS)) {
                  return true;
                }

                var distance = Math.abs(ui.position.left - $(this).position().left),
                    before = ui.position.left > $(this).position().left;

                if (width - distance > width / 2 && distance < width && $(this).position().top === top) {
                  if (before) {
                    $('.' + PLACEHOLDER_CLASS, self).insertBefore($(this));
                  } else {
                    $('.' + PLACEHOLDER_CLASS, self).insertAfter($(this));
                  }
                  return false;
                }
              });
            },
            stop: function stop(event, ui) {
              var first = list.children("li[qq-file-id]:first-child");

              var orderWasChanged = true;
              var primaryWasChanged = false;

              if (first.attr('qq-file-id') !== currentPrimary.attr('qq-file-id')) {
                primaryWasChanged = true;
              }

              self._setPrimary(orderWasChanged, primaryWasChanged);
            }
          });
        };

        PrimaryDrag.prototype._onDelete = function _onDelete() {
          this._setPrimary();
        };

        PrimaryDrag.prototype._setPrimary = function _setPrimary(orderWasChanged, primaryWasChanged) {
          var list = getFileList(this._uploader.settings.container);

          var first = list.children("li[qq-file-id]:first-child");
          var current = list.children("li[qq-file-id]." + PRIMARY_CLASS);

          current.removeClass(PRIMARY_CLASS);

          if (isUndefined(first[0])) {
            return true;
          }

          first.addClass(PRIMARY_CLASS);

          var id = this._uploader.fineuploader.getId(first[0]);
          var name = this._uploader.fineuploader.getName(id);
          var upload_path = this._uploadPaths[id];

          var order = [];
          list.children('li[qq-file-id]').each(function (i, ele) {
            var id = self._uploader.fineuploader.getId(ele);
            order.push(self._uploadPaths[id]);
          });

          this._fireCallback(id, name, upload_path, order);
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

      _export('PrimaryDrag', PrimaryDrag);
    }
  };
});