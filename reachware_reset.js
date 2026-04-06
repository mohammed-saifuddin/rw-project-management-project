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
}

.header{
display:flex;
border:1px solid #2d6fa3;
}

.portal{
flex:1;
background:#6b3fa0;
color:white;
text-align:center;
padding:12px;
font-size:18px;
}

.login-box{
width:350px;
margin:80px auto;
}

.row{
display:flex;
margin-bottom:15px;
}

.row label{
width:120px;
font-size:12px;
}

.row input{
width:200px;
padding:6px;
border:1px solid black;
}

.btn{
background:#1c6ea4;
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
           margin-left:60px;
           }
           .btn:hover{
           background:#155d8a;
           text-decoration:justify;
           }
           
</style>
</head>
<body>
<div class="header">
<div class="portal">
Reachware Portal Password Setup
</div>
</div>

<div class="login-box">

<form method="POST">

<input type="hidden" name="empid" value="${empId}">
<input type="hidden" name="email" value="${emailId}">
<input type="hidden" name="action" id="action">

<div class="row">
<label>Email</label>
<input type="text" value="${emailId}" readonly>
</div>

<div class="row">
<label>Password</label>
<input type="password" name="password" id="password">
</div>

<div class="row">
<label>Confirm  Password</label>
<input type="password" name="confirmpassword" id="confirmpassword">
</div>

<div class="row" id="otpRow" style="display:${showOtp=='T'?'flex':'none'};">
<label>Enter OTP</label>
<input type="text" name="otp" id="otp">
</div>
<div class="btn-row">
<button class="btn" type="button" onclick="confirmReset()">
Confirm
</button>

<button class="btn" id="otpBtn" type="button" onclick="handleGenerateOtp()">
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