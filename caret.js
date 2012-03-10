/*!
 * Caret - A small library for manipulating the mouse cursor
 * Tom Moor, http://tommoor.com
 * Copyright (c) 2012 Tom Moor
 * MIT Licensed
 * @version 0.1
*/

(function(){
	var Caret = {};
	var selected;
	
	// private methods
	var getActiveElement = function(){
		if (document.activeElement && 
			document.activeElement.tagName.toLowerCase () == "textarea" ||
			document.activeElement.tagName.toLowerCase () == "input") {
			return document.activeElement;
		}
		
		return document;
	};
	
	var getSelectedElement = function(){
		
		var element = selected;
		if (!element) element = getActiveElement();
		
		// play nice with jquery
		if (typeof jQuery != 'undefined' && element instanceof jQuery) {
			element = jQuery(element)[0];
		}
		
		return element;
	};
	
	
	// public methods
	Caret.setElement = function(element){
		selected = element;
		return this;
	};
	
	Caret.getSelection = function(){
		
		var	element = getSelectedElement();

		// Firefox / Webkit / Modern IE
		if (element.selectionStart || element.selectionStart == '0') {
			
			var selection = document.getSelection();
			
			return {
				text: selection.toString(),
				start: element.selectionStart,
				end: element.selectionEnd,
			};
			
		// Internet Explorer
		} else if (document.selection) {
			element.focus();
		 	var selection = document.selection.createRange();
			
			return {
				text: selection.text,
				start: 0,
				end: 0,
			};
		}
		
		return false;
	};
	
	Caret.setSelection = function(start, end){
		
		var	element = getSelectedElement();
		
		// we want to select a specific piece of text
		if (typeof(start) === 'string' && element.value)
		{
			// find if this string exists in element
			var len = start.length;
			var exists = element.value.search(start);
			
			// select correct text
			if (exists != -1) {
				start = element.value.search(start);
				end = start+len;
			}
		}
		
		if (!start) start = 0;
		if (!end) end = 0;

		// Firefox / Webkit / Modern IE
		if (element.createTextRange) {
			var range = element.createTextRange();
			range.collapse(start === end ? true : false);
			range.moveEnd('character', start);
			range.moveStart('character', end);
			range.select();
		
		// Internet Explorer
		} else if(element.setSelectionRange) {
			element.focus();
			element.setSelectionRange(start, end);
		}
		
		return this;
	};
	
	Caret.clearSelection = function(){
		if (window.getSelection) {
			if (window.getSelection().empty) {
				window.getSelection().empty();
			} else if (window.getSelection().removeAllRanges) {
				window.getSelection().removeAllRanges();
			}
		} else if (document.selection) {
			document.selection.empty();
		}
		
		return this;
	};
	
	Caret.getPosition = function(){
		var pos = 0;
		var element = getSelectedElement();
			
		// Firefox / Webkit / Modern IE
		if (element.selectionStart || element.selectionStart == '0') {
			pos = element.selectionStart;
		} 
		
		// Internet Explorer
		else if (document.selection) {
			element.focus();
		 	var selection = document.selection.createRange();
			selection.moveStart('character', -element.value.length);
			pos = selection.text.length;
		}

		return pos;
	};
	
	Caret.setPosition = function(pos){
		Caret.setSelection(pos, pos);
		return this;
	};
	
	Caret.moveToStart = function(){
		Caret.setPosition(0);
		return this;
	};
	
	Caret.moveToEnd = function(){
		var element = getSelectedElement();
		
		if (element.value) {
			Caret.setPosition(element.value.length);
		}
		
		return this;
	};
	
	window.Caret = Caret;
})();