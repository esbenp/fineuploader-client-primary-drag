System.register([], function (_export) {
  'use strict';

  var CONTAINER_CLASS, LABEL_SELETOR, PLACEHOLDER_CLASS, PRIMARY_CLASS;
  return {
    setters: [],
    execute: function () {
      CONTAINER_CLASS = 'ou--primary';

      _export('CONTAINER_CLASS', CONTAINER_CLASS);

      LABEL_SELETOR = '.ou__files__primary-drag-label';

      _export('LABEL_SELETOR', LABEL_SELETOR);

      PLACEHOLDER_CLASS = 'ou__files__primary-drag-placeholder';

      _export('PLACEHOLDER_CLASS', PLACEHOLDER_CLASS);

      PRIMARY_CLASS = 'ou__files--primary';

      _export('PRIMARY_CLASS', PRIMARY_CLASS);
    }
  };
});