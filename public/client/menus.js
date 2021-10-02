// Manages pop-up context menus

'use strict';

define([
  './types',
  './values',
  './widget',
], (
  import_types,
  import_values,
  import_widget
) => {
  const {
    anyT,
  } = import_types;
  const {
    ConstantCell,
  } = import_values;
  const {
    createWidgetExt,
  } = import_widget;

  const exports = {};

  const menuDialog = new WeakMap();
  const menuInner = new WeakMap();
  function Menu(widgetContext, widgetCtor, target) {
    var dialog = document.createElement('dialog');
    var innerElement = document.createElement('div');
    dialog.appendChild(innerElement);
    dialog.classList.add('menu-dialog');

    menuDialog.set(this, dialog);
    menuInner.set(this, innerElement);

    var menuContext = widgetContext.forMenu(function closeCallback() {
      dialog.close();
    });

    var widgetHandle = createWidgetExt(menuContext, widgetCtor, innerElement, new ConstantCell(target, anyT));

    dialog.addEventListener('mouseup', function (event) {
      if (event.target === dialog) {  // therefore not on content
        dialog.close();
      }
      event.stopPropagation();
    }, true);
    dialog.addEventListener('close', function (event) {
      if (dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
      }
      widgetHandle.destroy();  // TODO prevent reuse at this point
    }, true);

    Object.freeze(this);
  }
  exports.Menu = Menu;
  Menu.prototype.openAt = function(targetElOrEvent) {
    var dialog = menuDialog.get(this);
    dialog.ownerDocument.body.appendChild(dialog);
    // TODO: Per spec, aligning the dialog should be automatic if we pass the target to showModal, but it isn't in Chrome 47. Enable once it works properly (and rework the kludge for map features to be compatible).
    dialog.showModal(/* targetElOrEvent */);
    if (targetElOrEvent && targetElOrEvent.nodeType) {
      var dialogCR = dialog.getBoundingClientRect();
      var targetCR = targetElOrEvent.getBoundingClientRect();
      dialog.style.left = (
        Math.max(0, Math.min(document.body.clientWidth - dialogCR.width,
          targetCR.left + targetCR.width / 2 - dialogCR.width / 2))
      ) + 'px';
      dialog.style.top = (
        Math.max(0, Math.min(document.body.clientHeight - dialogCR.height,
          targetCR.bottom))
      ) + 'px';
    }
    //lifecycleInit(menuInner.get(this));  // TODO make this possible or make it unavoidable (widget does this implicitly in 0ms but menu can be delayed between create and open)
  };
  Menu.prototype.close = function() {
    menuDialog.get(this).close();
  };

  return Object.freeze(exports);
});
