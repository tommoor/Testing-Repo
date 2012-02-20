/*
 * Caret - A small library for manipulating the mouse cursor
 * Tom Moor, http://tommoor.com
 * Copyright (c) 2012 Tom Moor
 * MIT Licensed
 * @version 0.1
*/

(function(){
	var Caret = {};

	var getActiveElement = function(){
		if (document.activeElement && 
			document.activeElement.tagName.toLowerCase () == "textarea" ||
			document.activeElement.tagName.toLowerCase () == "input") {
			return document.activeElement;
		}
		
		return document;
	};
	
	Caret.getPosition = function(element){
		var pos = 0;
		
		if (!element) element = getActiveElement();
		
		// allow passing of jquery objects
		if (typeof jQuery != 'undefined' && element instanceof jQuery) {
			element = jQuery(element)[0];
		}
			
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
	
	Caret.setPosition = function(pos, element){

		if (!pos) pos = 0;
		if (!element) element = getActiveElement();

		// allow passing of jquery objects
		if (typeof jQuery != 'undefined' && element instanceof jQuery) {
			element = jQuery(element)[0];
		}
		
		// Firefox / Webkit / Modern IE
		if (element.createTextRange) {
			var range = element.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		
		// Internet Explorer
		} else if(element.setSelectionRange) {
			element.focus();
			element.setSelectionRange(pos,pos);
		}
	};
	
	window.Caret = Caret;
})();