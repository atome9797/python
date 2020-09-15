// 회원가입 JavaScript

// 이름 형식 (한글 또는 영문 사용하기, 혼용은 안됨)
function name_form_check(str) {
    let reg_name = /^[가-힣]{2,4}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/;
    return reg_name.test(str);
}

// 이메일 주소 형식
function email_form_check(str) {
    let reg_email = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    return reg_email.test(str);
}

// 비밀번호 입력 형식 (영어와 숫자의 혼합, 6~12자리 이내의 암호)
function password_form_check(str) {
    let reg_password = /^[A-Za-z0-9]{6,12}$/;
    return reg_password.test(str);
}

// 회원가입 유효성 검사
// 회원가입 - 이름
$("#resister_name").blur(function () {
    let name = $("#resister_name").val();
    if (!name_form_check(name)) {
        $("#nameHelp").text("올바른 이름이 아닙니다.").removeClass("text-muted text-success").addClass("text-danger")
    } else if (name_form_check(name)) {
        $("#nameHelp").text("사용 가능한 이름입니다.").removeClass("text-muted text-danger").addClass("text-success")
    }
});

// 회원가입 - 이메일
$("#resister_email").blur(function () {
    let email = $("#resister_email").val();

    $.ajax({ // 이메일 입력란 중복체크 및 유효성 검사
        type: "POST",
        url: "email_check",
        data: { 'email_create': email },
        success: function (response) {
            if (response["result"] === "success") {
                $("#emailHelp").text("사용 가능한 이메일 주소입니다.").removeClass("text-muted text-danger").addClass("text-success")
                if (!email_form_check(email)) {
                    $("#emailHelp").text("올바른 이메일 형식이 아닙니다.").removeClass("text-muted text-success").addClass("text-danger")
                } else if (email_form_check(email)) {
                    $("#emailHelp").text("사용 가능한 이메일 주소입니다.").removeClass("text-muted text-danger").addClass("text-success")
                }
            } else {
                $("#emailHelp").text("중복된 이메일 입니다.").removeClass("text-muted text-success").addClass("text-danger")
            }
        }
    })
});

// 회원가입 - 패스워드
$("#resister_password").blur(function () {
    let password = $("#resister_password").val();
    if (!password_form_check(password)) {
        $("#passwordHelp").text("문자와 숫자가 포함된 6~12자리로 작성해주세요.").removeClass("text-muted text-success").addClass("text-danger")
    } else if (password_form_check(password)) {
        $("#passwordHelp").text("사용 가능한 패스워드입니다.").removeClass("text-muted text-danger").addClass("text-success")
    }
});
// 회원가입 - 패스워드 체크
$("#resister_password_check").blur(function () {
    let password_check = $("#resister_password_check").val();
    let password = $("#resister_password").val();
    if (password !== password_check) {
        $("#password_checkHelp").text("비밀번호가 서로 일치하지 않습니다.").removeClass("text-muted text-success").addClass("text-danger")
    } else if (password === "") {
        $("#password_checkHelp").text("비밀번호를 먼저 입력해 주세요.").removeClass("text-muted text-success").addClass("text-danger")
    } else {
        $("#password_checkHelp").text("일치한 비밀번호입니다.").removeClass("text-muted text-danger").addClass("text-success")
    }
});

// '계정 생성' 버튼 클릭
$("#join_btn").click(function () {

    // 폼에 입력된 각 값에 대한 변수 정의
    let name = $("#resister_name").val();
    let email = $("#resister_email").val();
    let password = $("#resister_password").val();
    let password_check = $("#resister_password_check").val();

    // 빈칸 및 형식 체크 알람
    if (name === "") {
        alert("이름을 입력해주세요")
        $("#resister_name").focus()
        return
    } else if (!name_form_check(name)) {
        alert("올바른 이름이 아닙니다.")
        return
    } else if (email === "") {
        alert("이메일을 입력해주세요.")
        $("#resister_email").focus()
        return
    } else if (!email_form_check(email)) {
        alert("올바른 이메일 형식이 아닙니다.")
        return
    } else if (password === "") {
        alert("비밀번호를 입력해주세요")
        $("#resister_password").focus()
        return
    } else if (!password_form_check(password)) {
        alert("문자와 숫자가 포함된 6~12자리로 작성해주세요.")
        return
    } else if (password_check === "") {
        alert("비밀번호를 입력해주세요")
        $("#resister_password_check").focus()
        return
    } else if (password !== password_check) { // 비밀번호 재입력이 비밀번호와 같은지
        alert("비밀번호가 서로 일치하지 않습니다.")
        $("#resister_password_check").focus()
        return
    } else if (!$('#agree_check').is(":checked")) {
        alert("약관에 동의해주세요.")
        return
    }

    $.ajax({
        type: "POST",
        url: "/regist",
        data: { 'name_create': name, 'email_create': email, 'password_create': password },
        success: function (response) {
            if (response["result"] === "success") {
                alert("회원가입이 완료되었습니다.")
                window.location.replace('/') // 파이썬의 Redirect 기능을 자바스크립트에서 적용
            } else {
                alert("중복된 이메일 입니다.")
                $("#emailHelp").text("중복된 이메일 입니다.").removeClass("text-muted text-success").addClass("text-danger")
            }
        }
    })
});