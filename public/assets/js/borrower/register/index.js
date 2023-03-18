$('#reload').click(function() {
    $.ajax({
        method: "GET",
        url: "{{ route('reload-captcha') }}",
    }).done(function(data) {
        $(".captcha span").html(data.captcha);
    }).fail(function(error) {
        errorNoty("somthing went wrong please try again")
    });
})
$('#login_btn').click(function() {
    let email = $("#email").val();
    let password = $("#password").val();
    let captcha = $("#captcha").val();
    $.ajax({
        method: "POST",
        url: "{{ route('check_otp') }}",
        data: {
            _token: '{{ csrf_token() }}',
            email,
            password,
            captcha,
        }
    }).done(function(data) {
        let otp = data.data.otp;
        if (data.data.url) {
            location.assign(data.data.url);
        }
        $('#otp_modal').modal({
            show: otp
        });
        successNoty(data.message)
    }).fail(function(error) {
        $.ajax({
            method: "GET",
            url: "{{ route('reload-captcha') }}",
        }).done(function(data) {
            $(".captcha span").html(data.captcha);
        }).fail(function(error) {
            errorNoty("somthing went wrong please try again")
        });
        let res_error = error.responseJSON.message;
        errorNoty(res_error)
    });


});
$('#otp_submit_btn').click(function() {
    let email = $("#email").val();
    let password = $("#password").val();
    let otp_code = $("#otp_code").val();
    $.ajax({
        method: "POST",
        url: "{{ route('post_check_otp') }}",
        data: {
            _token: '{{ csrf_token() }}',
            email,
            password,
            otp_code,
            browser_uuid: localStorage.getItem('browserUUID') || null
        }
    }).done(function(data) {
        console.log(data);
        successNoty(data.message)
        let url = "{{ route('borrower.projects.index') }}";
        localStorage.setItem('browserUUID', data.data.browser_uuid);
        $('#otp_modal').modal({
            show: false
        });
        location.assign(url);
    }).fail(function(error) {
        console.log(error);
        let res_error = error.responseJSON.message;
        errorNoty(res_error)
        $('#otp_modal').modal({
            show: true
        });
    });


});
$('#send-again').click(function() {
    let email = $("#email").val();
    let password = $("#password").val();
    $.ajax({
        method: "POST",
        url: "{{ route('resend_otp') }}",
        data: {
            _token: '{{ csrf_token() }}',
            email,
            password,
        }
    }).done(function(data) {
        let otp = data.data.otp;
        $('#otp_modal').modal({
            show: true
        });
        successNoty(data.message)
    }).fail(function(error) {
        let res_error = error.responseJSON.message;
        errorNoty(res_error)
    });
});

function errorNoty(res_error) {
    new Noty({
        type: 'error',
        layout: 'topLeft',
        text: res_error,
        killer: true,
        timeout: 5000,
    }).show();
}

function successNoty(message) {
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text: message,
        killer: true,
        timeout: 5000,
    }).show();
}
