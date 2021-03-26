const SERVER_URL = "http://192.168.1.7:5002/";
$(function () {
    const urlParams = new URLSearchParams(window.location.search);
    let userIdValue = $('#userId').val();
    if (typeof userId !== "undefined" && userIdValue !== "")
        localStorage.setItem('userId', userIdValue);
    if (typeof userId !== "undefined" && userIdValue === "") {
        $.get(SERVER_URL + 'admin/refresh?token=' + localStorage.getItem('userId'))
            .done(r => {
                $('#nameHolder').text(r.name);
                $('#usernameHolder').text(r.username);
                $('#name').val(r.name);
                $('#username').val(r.username);
                $('#emailHolder').text(r.email);
                $('#email').val(r.email);
                $('#genderHolder').text(r.gender);
                $('#gender').val(r.gender);
                $('#passwordHolder').text('*'.repeat(r.password.length));
            })
            .fail(() => {
                localStorage.removeItem('userId');
                window.location.href = '/login';
            });
    }
    if (urlParams.get('error')) {
        error($("#username"));
        error($("#password"));
        customAlert("alert-fail", "There is no user with entered data!");
        window.history.pushState(null, null, '/login');
    }
    $('#login').on('click', () => {
        if (!validation()) return false;
        let username = $('#username').val();
        let password = $('#password').val();
        $.ajax({
            url: "/user/login",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({username, password}),
            success: result => {
                if (result.result) return window.location.href = "/dashboard";
                window.location.href = "/login?error=1";
            },
            error: err => {
                error($("#username"));
                error($("#password"));
                customAlert("alert-fail", "there is something wrong in your entery data");
                $('#error-text').html(err.responseJSON.errors.join("<br>"));
            }
        })
        // $('#loginForm').submit();
    });
    $('#logout').on('click', logout);
    $('#update').on('click', () => {
        let data = {
            name: $('#name').val(),
            username: $('#username').val(),
            email: $('#email').val(),
            gender: $('#gender').val()
        }
        $.ajax({
            url: "/user/update-me",
            data: JSON.stringify(data),
            method: "PUT",
            contentType: "application/json",
            success: result => {
                if (result.result) location.reload();
                else
                    alert("something went wrong, call my father :'( (70)");
            },
            error: err => {
                console.log(err);
                alert("check console");
            }
        });
    });
    $('#updatePassword').on('click', () => {
        let oldPassword = $('#oldPassword').val();
        let newPassword = $('#newPassword').val();
        let reNewPassword = $('#reNewPassword').val();
        if (newPassword !== reNewPassword)
            return alert("new password and it's repeat is not match");
        $.ajax({
            url: "/user/update-password",
            data: JSON.stringify({oldPassword, newPassword, reNewPassword}),
            method: "PATCH",
            contentType: "application/json",
            success: result => {
                if (result.result) {
                    alert("password successfully changed");
                    setTimeout(() => window.location.href = "/login", 1000);
                } else
                    alert(result.error);
            },
            error: err => {
                alert(err.responseJSON.errors[0]);
            }
        });
    });
    $('#deleteMe').on('click', () => {
        if (confirm("are you really sure?")) {
            if (confirm("dont do this please :( do you want to continue?")) {
                if (confirm("one last time, tell me you are sure about this horrible action!")) {
                    $.ajax({
                        url: "/user/delete",
                        method: "delete"
                    })
                        .done(result => {
                            if (result.result) {
                                alert("your fight is over, may we meet again");
                                window.location.href = "/login";
                            } else
                                alert(result.error);
                        })
                        .fail(err => {
                            alert("something went wrong, check console");
                            console.log(err);
                        });
                }
            }
        }
    })
    let selectedGender = $('#selectedGender').val();
    $('#gender').val(selectedGender ? selectedGender : "Gender ...");
});
const validation = () => {
    const username = $('#username');
    const password = $('#password');
    let wrong = false;

    if (!username.val()) {
        error(username, true);
        wrong = true;
    } else normal(username);

    if (!password.val()) {
        error(password, true);
        wrong = true;
    } else normal(password);

    return !wrong;
}

const error = (element, text = false) => {
    $(element).parent().css("border", "2px solid orangered");
    $(element).children('i').css("color", "orangered");
    if (text) {
        $(`div[data-target=${$(element).attr("id")}]`).show();
    }
}
const normal = element => {
    $(element).parent().css("border", "none");
    $(element).children('i').css("color", "white");
    $(`div[data-target=${$(element).attr("id")}]`).hide();
}
const customAlert = (type, text) => {
    let alertContainer = $('.d-flex');
    let notification = $('#notification');
    notification.fadeIn();
    alertContainer.css("display", "flex");
    let icon = type === "alert-fail" ? '<i class="fa fa-times"></i>' : '<i class="fa fa-check"></i>';
    text = `${icon} ${text}`;
    notification.addClass(type).html(text);
    setTimeout(() => {
        notification.fadeOut(() => {
            notification.removeClass(type).html("");
        });
    }, 5000);
}

const checkLogin = () => {
    if (!localStorage.getItem('userId')) window.location.href = "/login";
}
const logout = () => $.get('/user/logout').done(() => window.location.href = "/login");