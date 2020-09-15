// 로그인
$('#login').on('click', function () {

    $.ajax({
        type: 'POST',
        url: "/loginmatch",
        dataType: 'json',
        data: {'email': $('#login_email').val(), 'password': $('#login_pw').val()},
        success: function (response) {
            console.log(response)
            let match = response["result"]

            if (match == null) {
                alert('로그인에 실패했습니다.')
                return
            } else {
                alert("로그인 되었습니다.")
                $('#log').submit()
                log_user_btn()
            }

        }
    })
});

// 로그인 후 유저버튼
function log_user_btn() {
    $(".user_btn").attr({
        'data-toggle': 'dropdown',
        'id': 'user_dropdown_btn',
        'aria-haspopup': 'true',
        'aria-expanded': 'false'
    })
    $(".user_btn").removeAttr('data-target')
    $(".user_btn").addClass('dropdown-toggle')
};

// footer 내용 show&hide
$("#f_btn").on('click', function () {
    $("footer").slideToggle(300, function(){
        let offset = $("footer").offset()
        $('body, html').animate({scrollTop:offset.top}, 200)
    })
});