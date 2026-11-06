if (!$.trim) { $.trim = function (t) { return t == null ? "" : String(t).trim(); }; }


$(document).ready(function () {
    $(".detailsBox").click(function () {
        var id = $(this).val();
        $("#details" + id).fadeToggle(1000);

        var btnWord = $(this).siblings(".btn-content").find(".btn-word");
        var btnIcon = $(this).siblings(".btn-content").find(".btn-icon");
        if (this.checked) {
            btnWord.text("Hide");
            btnIcon.text("✖");
        } else {
            btnWord.text("Details");
            btnIcon.text("👁️");
        }
    });

    $("#continueBtn").click(function () {
        var count = $(".chooseBox:checked").length;
        if (count == 0) {
            alert("Please choose at least one car.");
        } else {
            $("#bookingForm").slideDown("slow");
        }
    });

    $("#bookingForm").submit(function () {
        checkForm();
        return false;
    });
});

function setError(id, message) {
    $("#" + id + "Error").text(message);
}

function isDigits(text) {
    for (var i = 0; i < text.length; i++) {
        if (text.charAt(i) < "0" || text.charAt(i) > "9") {
            return false;
        }
    }
    return true;
}

function checkName(name) {
    if (name == "") {
        return "";
    }
    for (var i = 0; i < name.length; i++) {
        var code = name.charCodeAt(i);
        var isArabic = (code >= 1569 && code <= 1610);
        if (!isArabic && name.charAt(i) != " ") {
            return "Arabic letters only.";
        }
    }
    return "";
}

function checkNationalNumber(num) {
    if (num == "") {
        return "National number is required.";
    }
    if (num.length != 11 || !isDigits(num)) {
        return "It must be 11 digits.";
    }
    var gov = parseInt(num.substring(0, 2), 10);
    if (gov < 1 || gov > 14) {
        return "The first two digits must be between 01 and 14.";
    }
    return "";
}

function makeDate(text) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (match == null) {
        return null;
    }
    var y = parseInt(match[1], 10);
    var m = parseInt(match[2], 10);
    var d = parseInt(match[3], 10);
    var date = new Date(0);
    date.setFullYear(y, m - 1, d);
    date.setHours(0, 0, 0, 0);
    if (date.getFullYear() != y || date.getMonth() != m - 1 || date.getDate() != d) {
        return null;
    }
    return date;
}

function checkMobile(mobile) {
    if (mobile == "") {
        return "";
    }
    if (mobile.length != 10 || !isDigits(mobile)) {
        return "Mobile must be 10 digits like 0944123456.";
    }
    var prefix = mobile.substring(0, 3);
    var syriatel = ["093", "098", "099"];
    var mtn = ["094", "095", "096"];
    for (var i = 0; i < 3; i++) {
        if (prefix == syriatel[i] || prefix == mtn[i]) {
            return "";
        }
    }
    return "The number must be Syriatel or MTN.";
}

function checkEmail(email) {
    if (email == "") {
        return "";
    }
    var at = email.indexOf("@");
    var dot = email.lastIndexOf(".");
    if (at < 1 || dot < at + 2 || dot == email.length - 1 || email.indexOf(" ") != -1) {
        return "Email is not valid.";
    }
    return "";
}

function checkForm() {
    var name = $.trim($("#fullName").val());
    var nid = $.trim($("#nationalId").val());
    var startText = $.trim($("#startDate").val());
    var endText = $.trim($("#endDate").val());
    var mobile = $.trim($("#mobile").val());
    var email = $.trim($("#email").val());
    var allOk = true;

    var nameMsg = checkName(name);
    var nidMsg = checkNationalNumber(nid);
    var mobileMsg = checkMobile(mobile);
    var emailMsg = checkEmail(email);
    var startMsg = "";
    var endMsg = "";

    var startDate = null;
    var endDate = null;

    if (startText == "") {
        startMsg = "Start date is required.";
    } else {
        startDate = makeDate(startText);
        if (startDate == null) { startMsg = "Use the format yyyy-mm-dd."; }
    }

    if (endText == "") {
        endMsg = "End date is required.";
    } else {
        endDate = makeDate(endText);
        if (endDate == null) { endMsg = "Use the format yyyy-mm-dd."; }
    }

    if (startDate != null && endDate != null) {
        if (endDate <= startDate) {
            endMsg = "End date must be after the start date.";
        }
    }

    setError("fullName", nameMsg);
    setError("nationalId", nidMsg);
    setError("startDate", startMsg);
    setError("endDate", endMsg);
    setError("mobile", mobileMsg);
    setError("email", emailMsg);

    if (nameMsg != "" || nidMsg != "" || startMsg != "" || endMsg != "" || mobileMsg != "" || emailMsg != "") {
        allOk = false;
    }

    if (allOk) {
        showResult(startDate, endDate);
    } else {
        $("#resultText").text("");
    }
}

function showResult(startDate, endDate) {
    var days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    var total = 0;
    var message = "Booking summary\n\n";

    $(".chooseBox:checked").each(function () {
        var row = $("#row" + $(this).val());
        var model = row.find(".model").text();
        var price = parseInt(row.find(".price").text(), 10);
        var cost = price * days;
        total = total + cost;
        message = message + model + ": " + days + " days x " + price + " = " + cost + " SYP\n";
    });

    var discount = 0;
    if (days > 7) {
        discount = total * 10 / 100;
    }
    var finalPrice = total - discount;

    message = message + "\nTotal: " + total + " SYP";
    message = message + "\nDiscount: " + discount + " SYP";
    message = message + "\nFinal amount: " + finalPrice + " SYP";

    alert(message);
    $("#resultText").text("Your booking request was accepted. Final amount: " + finalPrice + " SYP");
}
