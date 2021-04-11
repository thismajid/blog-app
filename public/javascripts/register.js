$(document).ready(() => {
  $("#submitBtn").click(() => {
    $("#alertMsg").addClass("d-none");
    $("#msg").addClass("d-none");
    $("#msg2").addClass("d-none");
    $("#msg2").text("خطا");
    $("input").each(function () {
      if (!$(this).val()) {
        $(this).addClass("plc");
        $("#alertMsg").removeClass("d-none");
      } else if ($(this).val()) {
        if (
          (!(
            $("#firstName").val().length >= 3 &&
            $("#firstName").val().length <= 30
          ) &&
            $("#firstName").val() !== "") ||
          (!(
            $("#lastName").val().length >= 3 &&
            $("#lastName").val().length <= 30
          ) &&
            $("#lastName").val() !== "")
        ) {
          $("#msg2").removeClass("d-none");
          $("#msg2").text("نام یا نام خانوادگی معتبر نمی باشد");
        } else if (
          !(
            $("#username").val().length >= 3 &&
            $("#username").val().length <= 30
          ) &&
          $("#username").val() !== ""
        ) {
          $("#msg2").removeClass("d-none");
          $("#msg2").text("نام کاربری معتبر نمی باشد");
        } else if ($("#password").val() !== $("#rePassword").val()) {
          $("#msg2").removeClass("d-none");
          $("#msg2").text("رمزهای وارد شده یکسان نیستند");
        } else if (
          !$("#email")
            .val()
            .match(
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ) &&
          $("#email").val() !== ""
        ) {
          $("#msg2").removeClass("d-none");
          $("#msg2").text("آدرس ایمیل وارد شده معتبر نمی باشد");
        } else if (
          !$("#password")
            .val()
            .match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/) &&
          $("#password").val() !== ""
        ) {
          $("#msg2").removeClass("d-none");
          $("#msg2").text(
            "رمز عبور باید حداقل شامل 6 کاراکتر و حداقل یک حرف و یک عدد باشد"
          );
        } else if (
          !$("#mobileNumber")
            .val()
            .match(/^(\+98|0098|0)?9\d{9}$/) &&
          $("#mobileNumber").val() !== ""
        ) {
          $("#msg2").removeClass("d-none");
          $("#msg2").text("شماره موبایل معتبر نمی باشد");
        }
      }
    });
    if (
      $("#firstName").val().length >= 3 &&
      $("#firstName").val().length <= 30 &&
      $("#lastName").val().length >= 3 &&
      $("#lastName").val().length <= 30 &&
      $("#email")
        .val()
        .match(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) &&
      $("email").val() !== "" &&
      $("#username").val().length >= 3 &&
      $("#username").val().length <= 30 &&
      $("#password").val() === $("#rePassword").val() &&
      $("#password")
        .val()
        .match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/) &&
      $("#mobileNumber")
        .val()
        .match(/^(\+98|0098|0)?9\d{9}$/)
    ) {
      $.ajax({
        type: "post",
        url: "/register",
        data: {
          firstName: $("#firstName").val().trim(),
          lastName: $("#lastName").val().trim(),
          email: $("#email").val().trim(),
          username: $("#username").val().trim(),
          password: $("#password").val(),
          gender: $("#radioBtn input[type='radio']:checked").val(),
          mobileNumber: $("#mobileNumber").val().trim(),
        },
        success: function (response) {
          $("#msg").removeClass("d-none");
          setTimeout(function () {
            window.location.href = "/login";
          }, 2500);
        },
        error: function (err) {
          console.log(err);
          let error = JSON.parse(err.responseText);
          if (error.msg == "user exist") {
            $("#msg2").removeClass("d-none");
            $("#msg2").text("نام کاربری معتبر نمی باشد");
          }
          if (error.msg == "phone number") {
            $("#msg2").removeClass("d-none");
            $("#msg2").text("شماره موبایل معتبر نمی باشد");
          }
          if (error.msg == "email exist") {
            $("#msg2").removeClass("d-none");
            $("#msg2").text("ایمیل معتبر نمی باشد");
          }
        },
      });
    } else {
      $("#msg2").removeClass("d-none");
    }
  });
});
