//ROSETTE
(function($) {

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //
// ----------------------------------------- DATA ----------------------------------------- //
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //

	var Data = {

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ defaults

		//default settings values
		defaults: {
			languages: {}, 
			current: null, 
			values: {}
		}, 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ process

		//process data
		process: function(settings) {
			//find current language if not explicitly provided
			if(settings.current === null) {
				//set current language as first language
				settings.current = Object.keys(settings.languages)[0];
			}
		}, 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ control

		//control data validity
		control: function(settings) {
			var dataOk = true;
			//control languages
			var langKeys = Object.keys(settings.languages);
			if(langKeys.length < 1) {
				dataOk = false;
				console.error('Rosette ERROR: Empty language data');
			}
			//control current languages
			if(settings.current !== null && $.inArray(settings.current, langKeys) === -1) {
				settings.current = null;
				dataOk = false;
				console.error('Rosette ERROR: Invalid current language');
			}
			//control result
			return dataOk;
		}, 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ setup

		//set default settings values
		setup: function(opts) {
			//controls provided settings keys
			var defKeys = Object.keys(this.defaults);
			var optKeys = Object.keys(opts);
			var isOk = true;
			optKeys.forEach(function(k) {
				if($.inArray(k, defKeys) === -1) {
					console.error('Rosette ERROR: Invalid setup data');
					isOk = false;
				}
			});
			//if provided settings are ok
			if(isOk) {
				this.defaults = $.extend(true, {}, Data.defaults, opts);
			}
		}

	};

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //
// ---------------------------------------- ENGINE ---------------------------------------- //
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //

	var Engine = {

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ init

		//initialize rosette on target
		init: function($input, settings) {
			//control targeted input validity
			if(Engine.controlTarget($input)) {
				//control settings integrity
				if(Data.control(settings)) {
					//process data
					Data.process(settings);
					//build rosette
					Build.build($input, settings);
					//bind rosette
					Binds.bind($input);
				}
			}
		}, 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ controlTarget

		//control targeted input integrity
		controlTarget: function($input) {
			var targetOk = true;
			//control that element is input text
			if(!$input.is('input[type="text"]')) {
				targetOk = false;
				console.error('Rosette ERROR: Target is not an input type text');
			}
			//control that element is not already initialized
			if($input.is('.rosette')) {
				targetOk = false;
				console.error('Rosette ERROR: Target is already initialized');
			}
			//returns control result
			return targetOk;
		}, 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ openDropdown / closeDropdown

		//open dropdown
		openDropdown: function($input) {
			var $dropdown = $input.data('rosette-dropdown');
			//open dropdown
			$dropdown.stop().addClass('open').slideDown(100);
		}, 

		//close dropdown
		closeDropdown: function($input) {
			var $dropdown = $('.rosette-dropdown');
			if(typeof $input !== 'undefined') {
				$dropdown = $input.data('rosette-dropdown');
			}
			//open dropdown
			$dropdown.stop().removeClass('open').slideUp(100);
		}, 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ getValues

		//get translation values
		getValues: function($input) {
			var $wrap = $input.data('rosette-wrap');
			var data = {};
			//loop through inputs
			$wrap.find('.rosette-input').each(function() {
				var $thisInput = $(this);
				//insert translation value
				var thisLangKey = $thisInput.attr('data-rosette-language');
				var thisLangText = $thisInput.val();
				data[thisLangKey] = thisLangText;
			});
			//return translation values
			return data;
		}, 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ destroy

		//destroy rosette
		destroy: function($input) {
			var $wrap = $input.data('rosette-wrap');
			//replace rosette elements with original input
			$wrap.replaceWith($input);
			//remove classes
			$input.removeClass('rosette-input rosette-main');
			//remove data
			$input.removeData('rosette-wrap').removeData('rosette-dropdown');
		}

	};

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //
// ---------------------------------------- BUILD ----------------------------------------- //
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //

	var Build = {

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ build

		//build rosette plugin
		build: function($input, settings) {
			var langs = settings.languages;
			var currentLang = settings.current;
			//sample input
			var $sampleInput = $input.clone().attr('id', '').attr('name', '');
			//main wrap
			$input.wrap('<div class="rosette rosette-wrap"></div>');
			var $wrap = $input.closest('.rosette-wrap');
			//attach main wrap to targeted input
			$input.data('rosette-wrap', $wrap);
			//set main wrap width
			$wrap.css('width', $input.css('width'));
			//wrap input with input container
			$input.wrap('<div class="rosette-input-container rosette-main"></div>');
			//set current language id on main input and set class
			$input.attr('data-rosette-language', currentLang).addClass('rosette-input rosette-main');
			//insert translation inputs dropdown
			$wrap.append('<div class="rosette-dropdown"></div>');
			var $dropdown = $wrap.find('.rosette-dropdown');
			//attach dropdown to targeted input
			$input.data('rosette-dropdown', $dropdown);
			//loop through languages
			for(var langKey in langs) {
				//if language is not current
				if(langs.hasOwnProperty(langKey) && langKey !== currentLang) {
					//clone sample input
					var $clone = $sampleInput.clone();
					//set language id and class
					$clone.attr('data-rosette-language', langKey).addClass('rosette-input');
					//insert clone input in dropdown
					$dropdown.append($clone);
					//wrap input with input container
					$clone.wrap('<div class="rosette-input-container"></div>');
				}
			}
			//insert buttons in inputs
			Build.buildButtons($input, settings);
		}, 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ buildButtons

		//build and insert language buttons in inputs
		buildButtons: function($input, settings) {
			var $wrap = $input.data('rosette-wrap');
			//sample button
			var $sampleButton = $('<div class="rosette-button"></div>');
			//set font size
			$sampleButton.css('font-size', $input.css('font-size'));
			//loop through inputs
			$wrap.find('.rosette-input').each(function() {
				var $thisInput = $(this);
				//clone sample button
				var $cloneButton = $sampleButton.clone();
				//insert language text in button
				var thisLangKey = $thisInput.attr('data-rosette-language');
				$cloneButton.text(settings.languages[thisLangKey]);
				//insert button in input
				$thisInput.closest('.rosette-input-container').append($cloneButton);
			});
		}

	};

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //
// ---------------------------------------- BINDS ----------------------------------------- //
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //

	var Binds = {

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bind

		//bind rosette controls
		bind: function($input) {
			var $wrap = $input.data('rosette-wrap');
			//main button click
			$wrap.find('.rosette-main .rosette-button').off('click.rosette').on('click.rosette', Binds.button);
			//bind click sur page en dehors rosette pour fermeture dropdown
			$(document).off('click.rosette').on('click.rosette', Binds.outside);
		}, 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ button

		//main button click
		button: function() {
			var $input = $(this).closest('.rosette-input-container').find('.rosette-input');
			var $dropdown = $input.data('rosette-dropdown');
			//toggle dropdown
			if($dropdown.is('.open')) {
				Engine.closeDropdown($input);
			}
			else {
				Engine.openDropdown($input);
			}
		}, 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ outside

		outside: function(e) {
			$target = $(e.target);
			if(!$target.is('.rosette') && $target.closest('.rosette').length < 1) {
				Engine.closeDropdown();
			}
		}

	};

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //
// ---------------------------------------- TOOLS ----------------------------------------- //
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //

	var Tools = {

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 

		//
		someMethod: function() {
			//
		}

	};

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //
// --------------------------------------- METHODS --------------------------------------- //
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //

	var Methods = {

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ init

		//initialize rosette
		init: function(opts) {
			//settings provided by user
			var settings = $.extend(true, {}, Data.defaults, opts);
			//loop through targeted elements
			return this.each(function() {
				//initialize rosette
				Engine.init($(this), settings);
			});
		}, 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ destroy

		//destroy rosette
		destroy: function() {
			//loop through targeted elements
			return this.each(function() {
				//initialize rosette
				Engine.destroy($(this));
			});
		}, 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ get

		//return translation values from rosette
		get: function() {
			//scope to unique element
			var $target = this.first();
			//return values
			return Engine.getValues($target);
		}

	};

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //
// --------------------------------------- HANDLER ---------------------------------------- //
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //

	//plugin methods handler
	$.fn.rosette = function(methodOrOpts) {
		//stop right away if targeted element empty
		if(this.length < 1) { return; }
		//call method
		if(Methods[methodOrOpts]) {
			//remove method name from call arguments
			var slicedArguments = Array.prototype.slice.call(arguments, 1);
			//call targeted mathod with arguments
			return Methods[methodOrOpts].apply(this, slicedArguments);
		}
		//call init
		else if(typeof methodOrOpts === 'object' || !methodOrOpts) {
			//call init with arguments
			return Methods.init.apply(this, arguments);
		}
		//error
		else {
			console.error('Rosette ERROR - Invalid method');
			console.log(this);
		}
	};

	//plugin setup handler
	$.extend({
		rosetteSetup: function(opts) {
			//set default settings values
			Data.setup(opts);
		}
	});

})(jQuery);