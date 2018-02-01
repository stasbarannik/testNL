/*
* FORM VARIABLES
* BIO SECTION
* JS-LEVEL SECTION
*  - JS-level section VARIABLES
*  - JS-level section FUNCTIONS
*  - JS-level section EVENTS
* INIT
*/

/* FORM VARIABLES */
let currentJSAngle = 30; // current JS-level diagram angle value (0-180 degrees)
let currentJSScore = 685; // current JS-level score = (0-100% of angle) * JSScoreFactor
const JSScoreFactor = 10; // factor for JS-level score value
/* End FORM VARIABLES */

/* ****  BIO SECTION **** */
// Set focus to visible inputs from hidden inputs
$('#bioDataHidden').find('input').on('focus', function clickToHiddenInput() {
	let el = $('#bioData').find('input')[$(this).index()];

	el.focus();
});
/* ****  END BIO SECTION **** */

/* **** JS-LEVEL SECTION **** */

/* JS-level section FUNCTIONS */
function radToDeg(rad) {
	return rad / Math.PI * 180;
} // convert radians to degrees
function roundToPositive(e) {
	if (e >= 0.01) {
		return e;
	}

	return 0.01;
} // rounding negative number to zero

// Get current angle to cursor-position on JS-level diagram
function getJSAngle(event, element) {
	let offset = $(element).offset();
	let relativeX = event.pageX - offset.left - 128;
	let relativeY = roundToPositive(-(event.pageY - offset.top - 128));
	let alpha = -radToDeg(Math.atan(relativeY / relativeX));
	let result = 0;

	if (alpha > 0) {
		result = Math.floor(alpha - 90);
	} else {
		result = Math.ceil(alpha + 90);
	}

	return result;
}

// Calculate JS-level score on angle value
function getJSScore(angle) {
	let skill = (angle + 90) * 100 / 180; // процент скила JS (от 0 - 100%) 90,180 - градусы; 100 - проценты

	if (JSScoreFactor) {
		skill *= JSScoreFactor;
	} // приводим проценты к желаемомму значению (умножаем на множитель)

	return Math.ceil(skill);
}

// Set current JS-level score and diagram angle
function setCurrentJSScore(angle) {
	currentJSAngle = angle;
	currentJSScore = getJSScore(angle);
}

// JS-level score value check on allowable diapason
function checkScoreValue(value) {
	let maxVal = 100; // 100%

	if (JSScoreFactor) {
		maxVal *= JSScoreFactor;
	}
	if (value >= 0) {
		if (value > maxVal) {
			value = maxVal;
		}
	} else {
		value = 0;
	}

	return value;
}

// JS-level score change animation
function smoothScoreChange() {
	$('#scoreJS').animate({number: currentJSScore}, {
		duration: 1000,
		step(number) {
			$('#scoreJS').val(number.toFixed(0));
		},
	});
}
/* End JS-level section FUNCTIONS */

/* JS-level section EVENTS */
$('#daigramJS').on('mousemove', function mouseMoveOnDiagram(event) {
	let angle = getJSAngle(event, this);

	$('#arrowJS').css('transform', `rotate(${angle}deg)`);
})
	.on('click', function diargamClick(event) {
		setCurrentJSScore(getJSAngle(event, this));
		smoothScoreChange();
	})
	.on('mouseout', () => {
		$('#arrowJS').css('transform', `rotate(${currentJSAngle}deg)`);
	});

$('#scoreJS').on('input', function scoreChanged() {
	let value = $(this).val();

	value = checkScoreValue(value);
	let valProcent = value;

	if (JSScoreFactor) {
		valProcent /= JSScoreFactor;
	}
	let angle = valProcent * 180 / 100 - 90;

	if (angle >= -90 && angle <= 90) {
		setCurrentJSScore(angle);
		$('#arrowJS').css('transform', `rotate(${currentJSAngle}deg)`);
		$('#scoreJS').val(value);
	}
});
/* End JS-level section EVENTS */

/* ****  END JS-LEVEL SECTION **** */

/* **** INIT **** */
function init() {
	$('#arrowJS').css('transform', `rotate(${currentJSAngle}deg)`); // Set arrow position
	smoothScoreChange(); // Set score value
}

$(document).ready(() => {
	init();
});
/* **** END INIT **** */

