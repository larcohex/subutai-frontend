NProgress.start();
setTimeout(function() {
	NProgress.done();
	$('.fade').removeClass('out');
}, 1000);

$(document).ready(function() {
	$('.b-nav-menu-link').on('click', function(){
		if($(this).next('.b-nav-menu__sub').length > 0) {
			if($(this).parent().hasClass('b-nav-menu_active')) {
				$(this).parent().removeClass('b-nav-menu_active');
				$(this).next('.b-nav-menu__sub').slideUp(300);
			} else {
				$(this).parent().addClass('b-nav-menu_active');
				$(this).next('.b-nav-menu__sub').slideDown(300);
			}
			return false;
		}
	});

	function colEqualHeight() {
		if( $('.b-nav').height() > $('.b-workspace').height() ) {
			$('.b-workspace').height( $('.b-nav').height() );
		}else if( $('.b-nav').height() < $('.b-workspace').height() ) {
			$('.b-nav').height( $('.b-workspace').height() );
		}
	}
	colEqualHeight();
});

/*Mask form*/
Array.prototype.forEach.call(document.body.querySelectorAll("*[data-mask]"), applyDataMask);

function applyDataMask(field) {
	var mask = field.dataset.mask.split('');

	// For now, this just strips everything that's not a number
	function stripMask(maskedData) {
		function isDigit(char) {
			return /\d/.test(char);
		}
		return maskedData.split('').filter(isDigit);
	}

	// Replace `_` characters with characters from `data`
	function applyMask(data) {
		return mask.map(function(char) {
			if (char != '_') return char;
			if (data.length == 0) return char;
			return data.shift();
		}).join('')
	}

	function reapplyMask(data) {
		return applyMask(stripMask(data));
	}

	function changed() {
		var oldStart = field.selectionStart;
		var oldEnd = field.selectionEnd;

		field.value = reapplyMask(field.value);

		field.selectionStart = oldStart;
		field.selectionEnd = oldEnd;
	}

	field.addEventListener('click', changed)
	field.addEventListener('keyup', changed)
}

var connectSlider = document.getElementById('slider-connect');

noUiSlider.create(connectSlider, {
	start: 0,
	connect: 'lower',
	step: 1,
	range: {
		'min': 0,
		'max': 5
	},
	pips: {
		mode: 'count',
		values: 6,
		density: 1
	}
});