/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/url','N/search','N/email','N/runtime','N/crypto'], 
(serverWidget,record,url,search,email,runtime,crypto) => {

const onRequest = (context) => {

if(context.request.method === 'GET'){

var empId = context.request.parameters.empid || '';
var emailId = context.request.parameters.email || '';
var showOtp = context.request.parameters.showOtp || '';

log.debug("empId from URL", empId);
log.debug("email from URL", emailId);
const loginUrl = url.resolveScript({
scriptId: 'customscript2872',
deploymentId: 'customdeploy1',
returnExternalUrl: true,
 params: {
        empid: empId,
        email: emailId
    }
});
/* If empId not passed, find using email */

if(!empId && emailId){

var empSearch = search.create({
type: search.Type.EMPLOYEE,
filters:[
['email','is',emailId]
],
columns:['internalid']
});

var result = empSearch.run().getRange({
start:0,
end:1
});

if(result.length > 0){
empId = result[0].getValue('internalid');
}
}

const form = serverWidget.createForm({
title:' ',
hideNavBar:true
});

const htmlField = form.addField({
id:'custpage_html',
type:serverWidget.FieldType.INLINEHTML,
label:' '
});

let html = `
<html>
<head>
<title>Reset password</title>

<style>
html,body{
font-family:Arial;
margin-top:-18px !important;
padding-right:-10px !important;
margin-left:-10px !important;
margin-right:-10px !important;
width:1580px !important;
overflow:hidden;
//  background:
//     linear-gradient(
//         135deg,
//         #8E2DE2,
//         #C471ED
//     );
background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
}
.login-box{
    width:600px;

    margin:80px auto;

    background:rgba(254, 253, 254, 0.96);

    backdrop-filter:blur(18px);
    -webkit-backdrop-filter:blur(18px);

    border-radius:22px;

    border:1px solid rgba(255,255,255,0.25);

    padding:30px;

    position:relative;
    z-index:5;

    box-shadow:
        0 15px 35px rgba(0,0,0,0.18);

    animation:
        fadeFloat 5s ease-in-out infinite;

    transition:
        transform 0.45s ease,
        box-shadow 0.45s ease,
        opacity 0.45s ease;
}

.login-box:hover{

    transform:
        translateY(-12px)
        scale(1.02);

    box-shadow:
        0 25px 50px rgba(0,0,0,0.28);
}

body{
     background:
    // linear-gradient(
    //     135deg,
    //     #8E2DE2,
    //     #C471ED
    // );
    background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
}


/* MODERN BUTTON */

.btn{

    height:38px;

    min-width:150px;

    padding:0 22px;

    border:none;

    border-radius:14px;

    background:
    linear-gradient(
        135deg,
        #8E2DE2,
        #C471ED
    );

    color:white;

    font-size:13px;

    font-weight:700;

    letter-spacing:0.5px;

    cursor:pointer;

    position:relative;

    overflow:hidden;

    transition:
        transform 0.35s ease,
        box-shadow 0.35s ease,
        opacity 0.35s ease;

    box-shadow:
        0 12px 28px rgba(168,85,247,0.30);
}

/* SHINE EFFECT */

.btn::before{

    content:'';

    position:absolute;

    top:0;
    left:-120%;

    width:100%;
    height:100%;

    background:
    linear-gradient(
        120deg,
        transparent,
        rgba(255,255,255,0.35),
        transparent
    );

    transition:0.6s;
}

/* HOVER */

.btn:hover{

    transform:
        translateY(-4px)
        scale(1.03);

    box-shadow:
        0 18px 38px rgba(168,85,247,0.42);
}

/* SHINE MOVE */

.btn:hover::before{
    left:120%;
}

/* CLICK EFFECT */

.btn:active{

    transform:
        scale(0.97);

    box-shadow:
        0 8px 18px rgba(168,85,247,0.25);
}




.row input:focus{
    border-color:#8f50df;
    box-shadow:0 0 5px rgba(107,63,160,0.3);
}
.header{
display:flex;
border:1px solid #2d6fa3;
}

.portal{
flex:1;
 background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
    position:sticky;
color:white;
height:60px;
display:flex;
justify-content:center;
display:none;
align-items:center;
text-align:center;
padding:12px;
font-size:18px;
font-weight:bold;
font-family:calibri;
}

.login-box{
width:600px;
justify-content:center;
align-items:center;
margin:80px auto;
}




.btn{
     background:
linear-gradient(
    135deg,
    #8E2DE2,
    #C471ED
);
color:white;
padding:8px 20px;
border:none;

cursor:pointer;
}
.btn-row{
            display:flex;
           justify-content:center;
           align-items:center;
           flex-direction:row;
           gap:10px;
           margin-left:50px;
           }
           .btn:hover{
           background:#155d8a;
           text-decoration:justify;
           }
     .card-header{
    text-align:center;
    margin-bottom:16px;
}

.icon{
    font-size:40px;
    margin-bottom:10px;
}

.card-title{
    font-size:16px;
    font-weight:700;
    color:#8f50df;
}

.card-subtitle{
    font-size:13px;
    color:#777;
    margin-top:5px;
}
    /* MAIN CONTAINER */

.main-bg{
    width:100vw;
    height:100vh;

    position:fixed;
    top:0;
    left:0;

    overflow:hidden;

  background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
}

/* FLOATING CIRCLES */

.bg-circle{
    position:absolute;

    border-radius:50%;

    background:rgba(255,255,255,0.08);

    animation:moveCircle 16s infinite linear;
}

/* CIRCLE POSITIONS */

.bg1{
    width:260px;
    height:260px;

    top:-60px;
    left:-80px;
}

.bg2{
    width:140px;
    height:140px;

    top:120px;
    right:180px;

    animation-duration:12s;
}

.bg3{
    width:200px;
    height:200px;

    bottom:-70px;
    right:-50px;

    animation-duration:20s;
}

.bg4{
    width:90px;
    height:90px;

    bottom:180px;
    left:120px;

    animation-duration:10s;
}

.bg5{
    width:70px;
    height:70px;

    top:300px;
    left:45%;

    animation-duration:14s;
}

/* ANIMATION */

@keyframes moveCircle{

    0%{
        transform:
        translateY(0px)
        translateX(0px);
    }

    25%{
        transform:
        translateY(-20px)
        translateX(12px);
    }

    50%{
        transform:
        translateY(15px)
        translateX(-12px);
    }

    75%{
        transform:
        translateY(-10px)
        translateX(8px);
    }

    100%{
        transform:
        translateY(0px)
        translateX(0px);
    }
}
  /* MODERN INPUT GROUP */

.input-group{
    position:relative;
    margin-bottom:22px;
}

/* LABEL */

.modern-label{
    display:block;

    font-size:12px;
    font-weight:700;

    color:#6B7280;

    margin-bottom:4px;

    letter-spacing:1px;

    text-transform:uppercase;
}

/* MODERN INPUT */

.modern-input{

    width:100%;

    height:34px;

    padding:
        0 40px 0 14px;

    border:none;



    background:
        rgba(255,255,255,0.9);

    backdrop-filter:blur(12px);

    box-shadow:
        0 8px 22px rgba(0,0,0,0.08);

    font-size:14px;

    font-weight:500;

    color:#374151;

    outline:none;

    transition:all 0.3s ease;
}

/* PLACEHOLDER */

.modern-input::placeholder{
    color:#9CA3AF;
    font-size:13px;
}

/* FOCUS */

.modern-input:focus{

    transform:translateY(-2px);

    box-shadow:
        0 0 0 4px rgba(168,85,247,0.15),
        0 12px 28px rgba(168,85,247,0.22);

    background:white;
}

/* ICON */

.input-icon{

    position:absolute;

    right:16px;
    top:67%;

    transform:translateY(-50%);

    color:#A855F7;

    font-size:14px;

    transition:0.3s ease;
}

/* ICON HOVER */

.input-icon:hover{
    color:#8E2DE2;
} 
    /* OTP GROUP FIX */

.otp-group{

    width:100%;

    display:flex;

    flex-direction:column;

    align-items:stretch;
}
     /* HIDE DEFAULT BROWSER PASSWORD EYE ICON */

input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
    display: none;
}

input[type="password"]::-webkit-credentials-auto-fill-button,
input[type="password"]::-webkit-textfield-decoration-container {
    display: none !important;
}

input[type="password"]::-webkit-password-toggle-button {
    display: none !important;
}

/* EDGE / CHROME */

input[type="password"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
}
</style>
<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>

<body>

<div class="main-bg">

<div class="bg-circle bg1"></div>
<div class="bg-circle bg2"></div>
<div class="bg-circle bg3"></div>
<div class="bg-circle bg4"></div>
<div class="bg-circle bg5"></div>
<div class="header">
<div class="portal">
Reachware Portal Password Setup
</div>
</div>

<div class="login-box">
<div class="card-header">
    <div class="logo1">
                <img width="240px" height="40px"  src="https://2771600.app.netsuite.com/core/media/media.nl?id=5690&c=2771600&h=kIUCEpH0C_eyrUBVYGJn7nEHV_vSoKDhpdzpaPF7vFesdytX">
            </div>
    <div class="card-title">Reset Password</div>
    
</div>
<form method="POST">

<input type="hidden" name="empid" value="${empId}">
<input type="hidden" name="email" value="${emailId}">
<input type="hidden" name="action" id="action">

<div class="input-group">

<label class="modern-label">
Email
</label>

<input
type="text"
value="${emailId}"
readonly
class="modern-input"
placeholder="Enter email">

<i class="fa-solid fa-envelope input-icon"></i>

</div>

<div class="input-group">
<label class="modern-label">
Password
</label>
<input
type="password"
name="password"
id="password"
class="modern-input"
placeholder="Enter password">
 <i class="fa-regular fa-eye input-icon"
   id="toggleEyePassword"
   onclick="togglePassword('password','toggleEyePassword')">
</i>
</div>

<div class="input-group">

<label class="modern-label">
Confirm Password
</label>

<input
type="password"
name="confirmpassword"
id="confirmpassword"
class="modern-input"
placeholder="Confirm password">

 <i class="fa-regular fa-eye input-icon"
   id="toggleEyeConfirm"
   onclick="togglePassword('confirmpassword','toggleEyeConfirm')">
</i>

</div>



<div class="input-group otp-group" id="otpRow"
style="display:${showOtp=='T'?'block':'none'};">

<label class="modern-label">
Enter OTP
</label>

<input
type="text"
name="otp"
id="otp"
class="modern-input"
placeholder="Enter OTP">

<i class="fa-solid fa-key input-icon"></i>

</div>
<div class="btn-row">
<button class="btn" type="button" onclick="confirmReset()">

<i class="fa-solid fa-check"></i>
&nbsp;&nbsp;
Confirm

</button>

<button class="btn" id="otpBtn"
type="button"
onclick="handleGenerateOtp()">

<i class="fa-solid fa-paper-plane"></i>
&nbsp;&nbsp;
Generate OTP

</button>
</div>


<span id="timer" style="margin-left:10px;color:green;"></span><br>
<span id="msg" style="color:red;"></span>


</form>
<div style="border:0.5px solid grey;margin-top:36px;">
<p style="display:flex;justify-content:center;align-item:center;font-size:12px;font-weight:bold;color:green;">Password should have</p>
<p style="display:flex;margin-left:12px;color:red;">1.It should contains atleast 8 character </p>
<p style="display:flex;margin-left:12px;color:red;">2.It should contains special characters @ # $ % & !</p>
<p style="display:flex;margin-left:12px;color:red;">3.It should contains character and numbers Abc 1234</p>
</div>
</div>
</div>
</body>
</html>
<script>
document.title="Reset password";
function setAction(val){
document.getElementById("action").value = val;
}
document.title="Reset password";

var countdown = 120;
var timerInterval = null;

window.togglePassword = function (fieldId, iconId) {

    var passwordField = document.getElementById(fieldId);

    var eyeIcon = document.getElementById(iconId);

    if (passwordField.type === "password") {

        passwordField.type = "text";

        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");

    } else {

        passwordField.type = "password";

        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
};
function checkPasswords(){

    var pwd = document.getElementById("password").value;
    var confirmPwd = document.getElementById("confirmpassword").value;
    var msg = document.getElementById("msg");
    var otpBtn = document.getElementById("otpBtn");

    if(pwd === "" || confirmPwd === ""){
        msg.innerText = "";
        otpBtn.disabled = true;
        return;
    }

    if(pwd !== confirmPwd){
        msg.innerText = "Passwords do not match";
        msg.style.color = "red";
        otpBtn.disabled = true;
    } else {
        msg.innerText = "Passwords match ✔";
        msg.style.color = "green";
        otpBtn.disabled = false;
    }
}


document.getElementById("password").addEventListener("keyup", checkPasswords);
document.getElementById("confirmpassword").addEventListener("keyup", checkPasswords);



function handleGenerateOtp(){

    var otpBtn = document.getElementById("otpBtn");

    if(otpBtn.disabled){
        return;
    }

    var pwd = document.getElementById("password").value;
    var confirmPwd = document.getElementById("confirmpassword").value;

    if(pwd !== confirmPwd || pwd === ""){
        alert("Enter matching passwords first");
        return;
    }

    var email = document.querySelector("input[name='email']").value;
    var empId = document.querySelector("input[name='empid']").value;

    
    otpBtn.disabled = true;

    fetch(window.location.href, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "action=generateotp&email=" + encodeURIComponent(email) + "&empid=" + empId
    })
    .then(res => res.text())
    .then(data => {

        var res = JSON.parse(data);

        
        sessionStorage.setItem("rw_otp", res.otp);
        sessionStorage.setItem("rw_email", email);
        sessionStorage.setItem("otp_time", Date.now());

        document.getElementById("otpRow").style.display = "flex";

        startTimer();

        alert("OTP sent to your email");

    })
    .catch(err => {
        console.error(err);
        otpBtn.disabled = false; // enable again if error
        alert("Error generating OTP");
    });
}




function startTimer(){

    var timer = document.getElementById("timer");
    var otpBtn = document.getElementById("otpBtn");

    var duration = 120; // 2 minutes
    var start = Date.now();

    var interval = setInterval(function(){

        var elapsed = Math.floor((Date.now() - start) / 1000);
        var remaining = duration - elapsed;

        if(remaining <= 0){
            clearInterval(interval);
            timer.innerText = "You can resend OTP";
            otpBtn.disabled = false;
            return;
        }

        var minutes = Math.floor(remaining / 60);
        var seconds = remaining % 60;

        timer.innerText = "Resend in: " + minutes + ":" + (seconds < 10 ? "0"+seconds : seconds);

    },1000);
}
    window.onload = function(){

    var otpTime = sessionStorage.getItem("otp_time");

    if(otpTime){
        var diff = Math.floor((Date.now() - otpTime) / 1000);

        if(diff < 120){
            document.getElementById("otpBtn").disabled = true;
            startTimer();
        }
    }
}
    window.onload = function(){

    
    window.history.pushState(null, null, window.location.href);

    window.onpopstate = function () {
       window.location.href = "https://2771600.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2872&deploy=1&compid=2771600&ns-at=AAEJ7tMQLCBxkbOlhRyShbsZSNh6QPuKL2rt00NN091SJ6hEFho";

    };

}
function confirmReset(){

    var otpInput = document.getElementById("otp").value;
    var storedOtp = sessionStorage.getItem("rw_otp");
    var storedEmail = sessionStorage.getItem("rw_email");
    var email = document.querySelector("input[name='email']").value;
    var password =document.querySelector("input[name='password']").value;

    console.log("Entered OTP:", otpInput);
    console.log("Stored OTP:", storedOtp);

    if(!storedOtp){
        alert("Please generate OTP first");
        return false;
    }

    if(!otpInput){
        alert("Please enter OTP");
        return false;
    }

    if(email !== storedEmail){
        alert("Email session mismatch");
        return false;
    }

    if(String(otpInput) !== String(storedOtp)){
        alert("Invalid OTP");
        return false;
    }
        /* Minimum 8 characters */
if(password.length < 8){
    alert("Password must be at least 8 characters");
    return;
}

/* Must contain letter, number and special character */
var regex = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&]).+$/;

if(!regex.test(password)){
    alert("Password must contain letters, numbers and special characters");
    return;
}

    document.getElementById("action").value = "resetpassword";
     console.log("Submitting form...");

    
    document.forms[0].submit();
    return true;
}

</script>

`;

htmlField.defaultValue = html;

context.response.writePage(form);

}

/* POST */

else{

let action = context.request.parameters.action || '';
let emailId = context.request.parameters.email || '';
let empId = context.request.parameters.empid || '';
let password = context.request.parameters.password || '';
let confirmPassword = context.request.parameters.confirmpassword || '';
let otp = context.request.parameters.otp || '';

log.debug("Action",action);
log.debug("Email",emailId);
log.debug("EmpId",empId);
log.debug("otp is ",otp);




if(!empId && emailId){

var empSearch = search.create({
type: search.Type.EMPLOYEE,
filters:[
['email','is',emailId]
],
columns:['internalid']
});

var result = empSearch.run().getRange({
start:0,
end:1
});

if(result.length > 0){
empId = result[0].getValue('internalid');
}
}



if(action == 'generateotp'){

var generatedOtp = Math.floor(100000 + Math.random() * 900000);

log.debug("Generated OTP",generatedOtp);



record.submitFields({
type:record.Type.EMPLOYEE,
id:empId,
values:{
custentityrw_password_:generatedOtp
},
options:{
ignoreMandatoryFields:true
}
});


try {

    log.debug("Before Email Send", {
        author: 1535,
        recipients: emailId
    });

    email.send({
        author: 1535,
        recipients: emailId,
        subject: "Reachware Portal OTP",
        body: "Your OTP is: " + generatedOtp
    });

    log.debug("Email Status", "Email sent successfully");

} catch (e) {

    log.error("Email Error", {
        message: e.message,
        name: e.name,
        stack: e.stack
    });

}

var resetUrl = url.resolveScript({
scriptId:'customscript2873',
deploymentId:'customdeploy2',
returnExternalUrl:true,
params:{
empid:empId,
email:emailId,
showOtp:'T'
}
});

// context.response.write(`
// <html>
// <script>

// sessionStorage.setItem("rw_otp","${generatedOtp}");
// sessionStorage.setItem("rw_email","${emailId}");

// // window.location.href="${resetUrl}";

// context.response.write(JSON.stringify({
//     status: "success",
//     otp: generatedOtp   // optional
// }));
// return;
// </script>
// </html>
// `);
context.response.write(JSON.stringify({
    status: "success",
    otp: generatedOtp
}));
return;

}



if(action == 'resetpassword'){


if(password !== confirmPassword){
context.response.write("<h3>Password mismatch</h3>");
return;
}



//log.debug("seession email",sessionEmail)
// log.debug(emailId)
// if(emailId != sessionEmail){
// context.response.write("<html><script>alert('email session mismatch'); window.history.back();</script></html>");
// return;
// }



// if(otp != sessionOtp){
// context.response.write("<h3>Invalid OTP</h3>");
// return;
// }



// var empRec = record.load({
// type:record.Type.EMPLOYEE,
// id:empId
// });

// var savedOtp = empRec.getValue('custentityrw_password_');

// if(otp != savedOtp){
// context.response.write("<h3>Invalid OTP</h3>");
// return;
// }

function hashPassword(password){

    var hashObj = crypto.createHash({
        algorithm: crypto.HashAlg.SHA256
    });

    hashObj.update({
        input: password
    });

    return hashObj.digest({
        outputEncoding: crypto.Encoding.HEX
    });
}
var hashedPassword = hashPassword(password);
record.submitFields({
type:record.Type.EMPLOYEE,
id:empId,
values:{
custentity_rw_dms_portal_password :hashedPassword
},
options:{
ignoreMandatoryFields:true
}
});



var homeUrl = url.resolveScript({
scriptId:'customscript2874',
deploymentId:'customdeploy3',
returnExternalUrl:true,
params:{
empid:empId,
email:emailId
}
});
var loginUrl = url.resolveScript({
scriptId: 'customscript2872',
deploymentId: 'customdeploy1',
returnExternalUrl: true,
 params: {
        empid: empId,
        email: emailId
    }
});

context.response.write("<html><script>window.location='"+loginUrl+"'</script></html>");

}

}

};

return {onRequest};

});