/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

/*
 Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		this.regexList = [
			{ regex: /^\+\+\+.*$/gm,		css: 'color2' },
			{ regex: /^\-\-\-.*$/gm,		css: 'color2' },
			{ regex: /^\s.*$/gm,			css: 'color1' },
			{ regex: /^@@.*@@$/gm,			css: 'variable' },
			{ regex: /^\+[^\+]{1}.*$/gm,	css: 'string' },
			{ regex: /^\-[^\-]{1}.*$/gm,	css: 'comments' }
			];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['diff', 'patch'];

	SyntaxHighlighter.brushes.Diff = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
