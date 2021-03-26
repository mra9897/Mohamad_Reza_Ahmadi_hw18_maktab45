$(function () {
    let usernameRgex = new RegExp(/^[^0-9](?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/);
    let passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);
    let emailRegx = new RegExp(/^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/);

    $('#submit').on('click', () => {
        let name = $('#name');
        let username = $('#username');
        let email = $('#email');
        let password = $('#password');
        let rePassword = $('#rePassword');
        let gender = $('#gender');

        let message = [];

        let formCheck = true;

        if (!usernameRgex.test(username.val()) || !username.val()) {
            formCheck = wrong(username);
            message.push("Username must be larger than 3 characters and start with a letter");
        } else normalize(username);

        if (password.val() !== rePassword.val() || !passwordRegex.test(password.val())) {
            formCheck = wrong(password);
            wrong(rePassword);
            message.push("The password must be larger than 3 characters and contain uppercase and lowercase letters and a special character")
        } else {
            normalize(password);
            normalize(rePassword);
        }

        if (emailRegx.test(email.val())) {
            formCheck = wrong(email);
            message.push("The email you entered is incorrect");
        }
        else normalize(email);

        if (formCheck) {
            let formData = {
                name: name.val(),
                username: username.val(),
                password: password.val(),
                email: email.val(),
                gender: gender.val()
            };
            $.ajax({
                url: `/user/create`,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: data => {
                    if (data.result === true) {
                        alert("register successfully completed, click ok to log in");
                        window.location.href = "/login";
                    } else if (data.result === "user exist")
                        alert("user exist, you can login or choose another username");
                },
                error: (data) => {
                    let errors = "";
                    data.responseJSON.errors.map(err => errors += (err+"<br>"));
                    $('#log').html(errors).show();
                }
            });
        }else{
            $('#log').text(message.join('\n')).show();
            console.log(3)
        }
    });
});

const wrong = element => {
    element.css('border', '2px solid red');
    return false;
}
const normalize = element => element.css('border', '1px solid lightgray')