import {isFunction} from 'fineuploader-client/utilities';
import {
  getContainer,
  getFileList
} from 'fineuploader-client/dom/utilities';
import {
  CONTAINER_CLASS,
  PLACEHOLDER_CLASS,
  PRIMARY_CLASS
} from './constants';
import $ from 'jquery';
import ui from 'jquery-ui/core';
import widgetFactory from 'jquery-ui/widget';
import mouseInteraction from 'jquery-ui/mouse';
import sortable from 'jquery-ui/sortable';

export class PrimaryDrag {
  constructor(callback) {
    this._callback = callback;
    this._uploadPaths = {};
  }

  _initialize() {
    var container = getContainer(this._uploader.settings.container);

    container.addClass(CONTAINER_CLASS);
  }

  _getUploadPath(id) {
    return this._uploadPaths[id];
  }

  _fireCallback(id, name, upload_path) {
    if (isFunction(this._callback)) {
      this._callback(id, name, upload_path);
    }
  }

  _initializeSortable() {
    var self = this;
    var list = getFileList(this._uploader.settings.container);

    list.sortable({
        containment: "parent",
        placeholder: PLACEHOLDER_CLASS,
        sort: function (event, ui) {
          var self = $(this),
              width = ui.helper.outerWidth(),
              top = ui.helper.position().top;

          self.children().each(function () {
            if ($(this).hasClass('ui-sortable-helper') || $(this).hasClass(PLACEHOLDER_CLASS)) {
              return true;
            }
            // If overlap is more than half of the dragged item
            var distance = Math.abs(ui.position.left - $(this).position().left),
                before = ui.position.left > $(this).position().left;

            if ((width - distance) > (width / 2) && (distance < width) && $(this).position().top === top) {
              if (before) {
                $('.'+PLACEHOLDER_CLASS, self).insertBefore($(this));
              } else {
                $('.'+PLACEHOLDER_CLASS, self).insertAfter($(this));
              }
              return false;
            }
          });
        },
        stop: function(event, ui) {
            self._setPrimary();
        }
    });
  }

  _onDelete() {
    this._setPrimary();
  }

  _setPrimary() {
    var list = getFileList(this._uploader.settings.container);

    var first = list.children("li[qq-file-id]:first-child");
    var current = list.children("li[qq-file-id]." + PRIMARY_CLASS);

    current.removeClass(PRIMARY_CLASS);
    first.addClass(PRIMARY_CLASS);

    var id = this._uploader.fineuploader.getId(first[0]);
    var name = this._uploader.fineuploader.getName(id);
    var upload_path = this._uploadPaths[id];

    this._fireCallback(id, name, upload_path);
  }

  _setupListeners() {
    var self = this;

    this._uploader.listen('onTemplateRendered', function(){
      self._initialize();
    });

    this._uploader.listen('onDeleteComplete', function(){
      self._setPrimary();
    });

    this._uploader.listen('onComplete', function(id, name, responseJSON, xhr){
      self._setUploadPath(id, responseJSON.upload_path);
    });

    this._uploader.listen('onAllComplete', function(){
      self._initializeSortable();
      self._setPrimary();
    });
  }

  _setUploadPath(id, path) {
    this._uploadPaths[id] = path;
  }

  __setUploader(uploader){
    this._uploader = uploader;

    this._setupListeners();
  }

}
