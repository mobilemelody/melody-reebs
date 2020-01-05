function validateForm() {
	console.log("validate");
	if ($('#math').val() != $('#math').data('ans')) {
		if (!$('#error-msg').length) {
			$('#math').after("<small id='error-msg' class='text-danger pl-2'>Incorrect value</small>");
		}
		return false;
	}
}

function filterPortfolio(tag) {
	if (tag) {
		$('.clear-filter').addClass('active');
		$('.portfolio-container').hide();
		$('[data-tag="' + tag + '"]').parents('.portfolio-container').show();
	} else {
		$('.tag-filter').addClass('active');
		$('.portfolio-container').show();
	}
}

$(document).ready(function(){
	// Filter portfolio on page load
	filterPortfolio($('.portfolio-filters .active').data('filter'));

	// Filter portfolio on tag selection
	$('.tag-filter').click(function() {
		$('.tag-filter.active').removeClass('active');
		$(this).addClass('active');

		let tag = $(this).data('filter');
		window.history.pushState("object or string", "melody reebs", "/portfolio?tag=" + tag);
		filterPortfolio(tag);
	});

	// Clear portfolio filter
	$('.clear-filter').click(function() {
		$('.tag-filter').addClass('active');
		$('.clear-filter').removeClass('active');

		window.history.pushState("object or string", "melody reebs", "/portfolio");
		filterPortfolio();
	});

});