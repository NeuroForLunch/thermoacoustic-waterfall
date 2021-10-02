'use strict';

define([
  './widgets/appui',
  './widgets/basic',
  './widgets/dbui',
  './widgets/scope',
  './widgets/spectrum',
], (
  widgets_appui,
  widgets_basic,
  widgets_dbui,
  widgets_scope,
  widgets_spectrum
) => {
  // TODO: This module is leftover from refactoring and only makes the namespace used for looking up widgets by name -- this ought to become something else that better considers plugin extensibility.

  const widgets = Object.create(null);
  Object.assign(widgets, widgets_appui, widgets_basic, widgets_dbui, widgets_spectrum);
  for (const k in {ScopeControls: 0, ScopePlot: 0}) {
    // special case because this module exports non-widgets
    widgets[k] = widgets_scope[k];
  }

  // TODO: This is currently used by plugins to extend the widget namespace. Create a non-single-namespace widget type lookup and then freeze this.
  return widgets;
});
