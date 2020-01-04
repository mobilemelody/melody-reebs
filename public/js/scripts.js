function validateForm () {
	console.log("validate");
	if ($('#math').val() != $('#math').data('ans')) {
		if (!$('#error-msg').length) {
			$('#math').after("<small id='error-msg' class='text-danger pl-2'>Incorrect value</small>");
		}
		return false;
	}
}

$(document).ready(function(){

});