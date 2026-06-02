/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/url','N/search','N/redirect','N/email','N/runtime','N/record','N/crypto'], 
(serverWidget,url,search,redirect,email,runtime,record,crypto) => {

const onRequest = (context) => {

    if(context.request.method === 'GET'){
        var empId = context.request.parameters.empid || '';
        var email = context.request.parameters.email || '';
        const form = serverWidget.createForm({
            title: ' ',
            hideNavBar:true
        });

        const forgotUrl = url.resolveScript({
            scriptId: 'customscript2873',
            deploymentId: 'customdeploy2',
            returnExternalUrl: true
        });



        const htmlField = form.addField({
            id: 'custpage_login_html',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'Login'
        });

        let html = `
        <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
        <style>
        
html, body {
    margin: 0 !important;
    padding: 0 !important;
    margin-top:-10px !impoertant;
    overflow-y:hidden;
/* Remove ALL parent spacing */
body *{
    margin:0;
    padding:0;
    box-sizing:border-box;
}
.full-header {
    
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
    linear-gradient(
    135deg,
    #8E2DE2,
    #C471ED
);
    height:80px;
    position: fixed;   
    top: 0;
    margin-top:-10px;
    
    z-index: 9999;
}

.header {
    display: flex;
    width: 100%;
    margin: 0;
    padding: 0;


            
            left:0;
            top:0;
        
            align-items:center;
            border:1px solid #2d6fa3;
            
        }
.uir-page-container,
.uir-page-wrapper,
body > div,
body > form {
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
}


body {
    overflow-x: hidden;
}
        
body, html {
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden;
}
* {
    box-sizing: border-box;
}

body > div {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
}


div[data-container], 
div.uir-page-container, 
div.uir-page-wrapper {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
}

        

        .portal{
             width:100%;
   linear-gradient(
    135deg,
    #8E2DE2,
    #C471ED
);
            color:white;
             font-weight:bold;
            margin-left:10px;
            font-family:sans-serif;
            font-weight:sans-serif;
            text-transform:capitalize;
            padding:16px;
            height:70px;
            font-size:16px;
            display:flex;
         justify-content:center;
         align-items:center;
         
         margin-top:0;
        }
        .header {
    display: flex;
    align-items: center;
    position: relative; /* IMPORTANT */
    border: 1px solid #2d6fa3;
}

.logo {
    z-index: 2;
    
    padding-left:30px;
}
.logo{
    display:flex;
    align-items:center;
    justify-content:center;

    height:70px;

    position:relative;
    top:0;
    padding:0;
    margin:0;

    filter:
        brightness(0)
        invert(1)
        drop-shadow(0 2px 4px rgba(0,0,0,0.2));

    opacity:0.95;
}

.logo img{
    width:180px;
    height:100px;
    padding-top:6px;
    padding-left:20px;
    object-fit:contain;
    display:block;
}

.logo2{
    

    height:140px;

    position:relative;
    top:0;
    padding:0;
    margin-top:-20px;

    filter:
        brightness(0)
        invert(1)
        drop-shadow(0 2px 4px rgba(0,0,0,0.2));

    opacity:0.95;
}

.logo2 img{
    width:220px;
    height:100px;
    padding-top:0px;
     padding-left:10px;
    object-fit:contain;
    display:block;
}
.portal {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    
    background: linear-gradient(
    135deg,
    #8E2DE2,
    #C471ED
);
    color: white;
    
    padding: 16px;
    height: 70px;
    
    display: flex;
    font-size:18px;
    font-family:Calibri, sans-serif;
    font-weight:600;
    text-transform:capitalize;
    justify-content: center;
    align-items: center;

    width: 100%; /* prevent full stretch */
    margin: 0;
}
        

        .row{
            display:flex;
            margin-bottom:15px;
        }
.login-box{
    width:380px;
    height:380px;

    margin:120px auto;
    margin-top:150px;

    background:white;

    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);

    border-radius:22px;

    border:1px solid rgba(255,255,255,0.25);

    padding:30px 25px;

    position:relative;
    z-index:5;

    box-shadow:
        0 10px 35px rgba(0,0,0,0.18);

    animation:fadeFloat 5s ease-in-out infinite;

    transition:
        transform 0.45s ease,
        box-shadow 0.45s ease,
        opacity 0.45s ease,
        background 0.45s ease;
}
.btn{
    background:#8f50df;
    color:white;
    padding:8px 10px;
    border:none;
    font-size:40px;
    font-weight:700;
   
    font-family:sans-serif;
    border-radius:8px;
    cursor:pointer;
    transition:0.3s;
    white-space: nowrap;
}


body{
        background:
#E6E6FA;
}

.row input{
    width:100%;
    padding:10px;
    border:1px solid #ccc;
    border-radius:8px;
    outline:none;
    transition:0.2s;
}

.row input:focus{
    border-color:#8f50df;
    box-shadow:0 0 5px rgba(177, 117, 250, 0.91);
}
.btn:hover{
    background:#5a3390;
}
/* Optional hover effect */
.login-box:hover{

    transform:
        translateY(-14px)
        scale(1.03);

    opacity:1;

    background:white;

    box-shadow:
        0 25px 55px rgba(0,0,0,0.28);
}
        .row label{
            width:120px;
            font-size:16px;
         font-family:Calibri, sans-serif;
         font-weight:600;
        }

        .row input{
            width:200px;
            padding:6px;
        }
         
        /* MODERN BUTTON */

.btn{

    height:38px;

    min-width:160px;

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


            
       .btn-row{

    width:100%;

    display:flex;

    justify-content:center;

    align-items:center;
    padding-left:20px;
    padding-right:20px;

    gap:18px;

    margin-top:28px;
}

.icon{
    font-size:40px;
    margin-bottom:10px;
}

.card-title{
    font-size:22px;
    font-weight:700;
    display:flex;
    justify-content:center;
    align-items:center;
    font-family:Calibri, sans-serif;
    color:#8f50df;
}

.card-subtitle{
    font-size:13px;
    color:#777;
    display:flex;
    justify-content:center;
    align-items:center;
    margin-top:5px;
}
    /* MODERN INPUT GROUP */

.input-group{

    position:relative;

    margin-bottom:22px;
}

/* MODERN INPUT */

.modern-input{

    width:100%;

    height:40px;

    padding:
        0 46px 0 16px;

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
    padding:20px;

    font-size:13px;
}

/* HOVER */

.modern-input:hover{

    transform:translateY(-2px);

    box-shadow:
    0 10px 25px rgba(168,85,247,0.15);
}

/* FOCUS */

.modern-input:focus{

    box-shadow:
    0 0 0 4px rgba(168,85,247,0.15),
    0 10px 25px rgba(168,85,247,0.2);

    background:white;
}

/* ICON */

.input-icon{

    position:absolute;

    right:16px;

    top:68%;

    transform:translateY(-50%);

    color:#A855F7;

    font-size:14px;
    
    
    display:flex;
    justify-content:center;
    align-items:center;
    cursor:pointer;

    transition:0.3s ease;
}

.input-icon:hover{

    color:#8E2DE2;

    transform:
    translateY(-50%)
    scale(1.08);
}
    .btn{

    height:38px;

    padding:0 26px;

    border:none;



    background:
    linear-gradient(
        135deg,
        #8E2DE2,
        #C471ED
    );

    color:white;

    font-size:12px;

    font-weight:700;

    cursor:pointer;

    transition:0.3s ease;

    box-shadow:
    0 10px 20px rgba(168,85,247,0.25);
}

.btn:hover{

    transform:translateY(-3px);

    box-shadow:
    0 16px 30px rgba(168,85,247,0.35);
}
    body{

       background:
linear-gradient(
    135deg,
    #8E2DE2,
    #C471ED
);
    font-family:'Inter',sans-serif;
}
    /* MODERN LABEL */

.modern-label{

    display:block;

    

    font-size:12px;

    font-weight:700;
    padding-bottom:6px;

    color:#6B7280;

    letter-spacing:1px;

    text-transform:uppercase;
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
   .main{
    display:flex;
    width:100vw;
    height:100vh;

    position:fixed;
    top:0;
    left:0;

    
    
    margin-bottom:-10px;
    margin-right:-10px;
    padding-bottom:-10px;

    overflow:hidden;
             background:
linear-gradient(
    135deg,
    #C471ED,
    #8E2DE2
    
);
}

/* LEFT PANEL */

.side-image{
    width:50%;
//        background:
// linear-gradient(
//     135deg,
//     #C471ED,
//     #8E2DE2
    
// );

    color:white;
    padding:30px;
    position:relative;

    display:flex;
    flex-direction:column;
    justify-content:space-between;
}

/* LOGO */

.side-logo img{
    width:220px;
}

/* LEFT CONTENT */

.side-content{
    margin-top:60px;
    padding-left:10px;
}

.side-title{
    font-size:24px;
    line-height:1.1;
    font-weight:600;
    margin-top:10px;
    font-family:Arial,sans-serif;
    margin-bottom:12px;
}

.side-title span{
    color:#f5a623;
}

.side-desc{
    font-size:14px;
    line-height:1.7;
    color:lightgray;
    width:85%;
    font-family:Arial, sans-serif;
    margin-bottom:10px;
}

/* BULLETS */

.feature-list{
    list-style:none;
    padding:0;
    margin-top:30px;
    font-family:Arial, sans-serif;
    font-size:14px;
    color:lightgray;
}

.feature-list li{
    margin-bottom:18px;
    font-size:14px;
    display:flex;
    
    font-family:Arial, sans-serif;
    
    align-items:center;
    gap:14px;
}

.feature-list li::before{
    content:'•';
    color:#f5a623;
    font-size:14px;
}

/* FOOTER */

.side-footer{
    font-size:12px;
    padding:16px;
    padding-bottom:5px;
    
    color:lightgray;
}
.full-header{
    display:none;
}
     .side-name{
     text-transform:uppercase;
     color:lightgray;
     margin-top:-20px;
     font-family:Arial, sans-serif;
     padding-left:30px;
     padding-top:-20px;
     font-size:16px;

     }
     /* ANIMATED BACKGROUND */

.side-image{
    overflow:hidden;
}

/* FLOATING CIRCLES */

.side-image::before,
.side-image::after{
    content:'';
    position:absolute;
    border-radius:50%;
    background:rgba(255,255,255,0.08);
    animation:floatAnimation 10s infinite ease-in-out;
}

/* BIG CIRCLE */

.side-image::before{
    width:320px;
    height:320px;
    top:-80px;
    left:-100px;
}

/* SMALL CIRCLE */

.side-image::after{
    width:220px;
    height:220px;
    bottom:-60px;
    right:-60px;
    animation-delay:3s;
}

/* EXTRA FLOATING SHAPES */

.floating-circle{
    position:absolute;
    border-radius:50%;
    background:rgba(255,255,255,0.06);
    animation:moveCircle 14s infinite linear;
}

.circle1{
    width:120px;
    height:120px;
    top:120px;
    right:40px;
}

.circle2{
    width:60px;
    height:60px;
    bottom:180px;
    left:60px;
    animation-duration:10s;
}

.circle3{
    width:180px;
    height:180px;
    bottom:40px;
    right:120px;
    animation-duration:18s;
}

/* KEYFRAMES */

@keyframes floatAnimation{

    0%{
        transform:translateY(0px) scale(1);
    }

    50%{
        transform:translateY(25px) scale(1.05);
    }

    100%{
        transform:translateY(0px) scale(1);
    }
}

@keyframes moveCircle{

    0%{
        transform:translateY(0px) translateX(0px);
    }

    25%{
        transform:translateY(-20px) translateX(10px);
    }

    50%{
        transform:translateY(15px) translateX(-15px);
    }

    75%{
        transform:translateY(-10px) translateX(8px);
    }

    100%{
        transform:translateY(0px) translateX(0px);
    }
}

/* CONTENT ABOVE ANIMATION */

.side-image > *{
    position:relative;
    z-index:2;
}
    /* RIGHT SIDE ANIMATION */

/* RIGHT SIDE */

.right-side{
    width:72%;
    position:relative;

    display:flex;
    justify-content:center;
    align-items:center;

    overflow:hidden;

    // background:#E6E6FA;
//       background:
// linear-gradient(
//     135deg,
    
//     #C471ED,
//     #8E2DE2
// );
}

/* REMOVE LOGIN BOX OVERFLOW */

.login-box{
    position:relative;
    z-index:5;
}

/* FLOATING CIRCLES */

.login-floating{
    position:absolute;
    border-radius:50%;

    background:rgba(255,255,255,0.06);

    animation:moveCircle 14s infinite linear;
}

/* BIG TOP RIGHT */

.login-circle1{
    width:220px;
    height:220px;

    top:-60px;
    right:80px;
}

/* MIDDLE LEFT */

.login-circle2{
    width:120px;
    height:120px;

    left:120px;
    bottom:140px;

    animation-duration:10s;
}

/* BOTTOM RIGHT */
/* EXTRA LEFT SIDE CIRCLES */

.circle4{
    width:90px;
    height:90px;

    top:300px;
    left:180px;

    animation-duration:12s;
}

.circle5{
    width:140px;
    height:140px;

    top:80px;
    right:180px;

    animation-duration:20s;
}

.circle6{
    width:50px;
    height:50px;

    bottom:120px;
    left:220px;

    animation-duration:8s;
}

/* EXTRA RIGHT SIDE CIRCLES */

.login-circle4{
    width:100px;
    height:100px;

    top:160px;
    right:260px;

    animation-duration:16s;
}

.login-circle5{
    width:70px;
    height:70px;

    bottom:220px;
    left:260px;

    animation-duration:11s;
}

.login-circle6{
    width:150px;
    height:150px;

    bottom:40px;
    right:320px;

    animation-duration:22s;
}
.login-circle3{
    width:180px;
    height:180px;

    right:120px;
    bottom:-50px;

    animation-duration:18s;
}
   @keyframes fadeFloat{

    0%{
        transform:translateY(0px);
        opacity:0.82;
    }

    25%{
        transform:translateY(-8px);
        opacity:1;
    }

    50%{
        transform:translateY(0px);
        opacity:0.88;
    }

    75%{
        transform:translateY(8px);
        opacity:1;
    }

    100%{
        transform:translateY(0px);
        opacity:0.82;
    }
}
    .logo1{
    display:flex;
    align-items:center;
    justify-content:center;
    }
        </style>

       <link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<div class="full-header">
    <div class="header">
        <div class="logo">
                <img   src="https://2771600.app.netsuite.com/core/media/media.nl?id=5690&c=2771600&h=kIUCEpH0C_eyrUBVYGJn7nEHV_vSoKDhpdzpaPF7vFesdytX">
            </div>

        <div class="portal">
            Reachware Project Management 
        </div>
    </div>
</div>
       <div class="main">
        <div class="side-image">

        <div>

            <div class="logo2">
                <img src="https://2771600.app.netsuite.com/core/media/media.nl?id=5690&c=2771600&h=kIUCEpH0C_eyrUBVYGJn7nEHV_vSoKDhpdzpaPF7vFesdytX">
             <div class="side-name">
                    Reachware Project Management
                </div>
                </div>

            <div class="side-content">

                <div class="side-title">
                    A comprehensive project management solution that enables organizations to plan,
                     track, and <span>deliver projects efficiently, ensuring visibility, control, and on-time execution</span>.
                </div>

                <div class="side-desc">
                        Streamline your project management processes with our all-in-one solution, designed to provide complete visibility, control, and confidence from planning to delivery.
                </div>

                <ul class="feature-list">
                    <li>Manage Every Project with Complete Visibility and Control</li>
                    <li>From Planning to Delivery ,Manage Every Project with Confidence</li>
                    <li>Gain complete visibility into project status through a centralized dashboard.</li>
                    <li>Keep projects on schedule with clear timelines, milestones and deadlines.</li>
                    <li>Multi-subsidiary support</li>
                </ul>

            </div>
<div class="floating-circle circle1"></div>
<div class="floating-circle circle2"></div>
<div class="floating-circle circle3"></div>
<div class="floating-circle circle4"></div>
<div class="floating-circle circle5"></div>

        </div>

        <div class="side-footer">
            © 2026 Reachware · All rights reserved
        </div>

    </div>

        <div class="right-side">
        <div class="login-floating login-circle1"></div>
<div class="login-floating login-circle2"></div>
<div class="login-floating login-circle3"></div>
<div class="login-floating login-circle6"></div>
<div class="login-floating login-circle4"></div>
<div class="login-floating login-circle5"></div>
<div class="login-floating login-circle6"></div>
<div class="login-floating login-circle2"></div>
<div class="login-floating login-circle3"></div>

         <div class="login-box">
             <div class="card-header">
    <div class="logo1">
                <img width="240px" height="40px"  src="https://2771600.app.netsuite.com/core/media/media.nl?id=5690&c=2771600&h=kIUCEpH0C_eyrUBVYGJn7nEHV_vSoKDhpdzpaPF7vFesdytX">
            </div>
    <div class="card-title">Login</div>
    <div class="card-subtitle">Access your Reachware account</div>
</div>
            <form method="POST">

        <div class="input-group">

    <label class="modern-label">
        Email
    </label>

    <input
        type="text"
        name="email"
        id="email"
        placeholder="Enter your email"
        class="modern-input"
    >

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
        placeholder="Enter your password"
        class="modern-input"
    >

   <i class="fa-regular fa-eye input-icon"
   id="toggleEye"
   onclick="togglePassword()">
</i>

</div>

           <div class="btn-row">

<button type="submit"
class="btn"
onclick="return login()">

<i class="fa-solid fa-right-to-bracket"></i>
&nbsp;
Login

</button>

<button type="button"
class="btn"
onclick="forgot()">


<i class="fa-solid fa-arrow-rotate-right"></i>

Update Password

</button>

</div>
            

            </form>

            
        </div>

       </div>
       
        </div>
       
        <script>
        document.title="Reachware Project Management - Login";

       window.togglePassword = function () {

    var passwordField = document.getElementById("password");
    var eyeIcon = document.getElementById("toggleEye");

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
    function forgot(){

var email = document.getElementById("email").value.trim();
var password = document.getElementById("password").value.trim();

/* Email check */
if(!email){
    alert("Please enter email first");
    return ;
}

/* Password empty */
if(!password){
    alert("Please enter your previous password");
    return;
}

// /* Minimum 8 characters */
// if(password.length < 8){
//     alert("Password must be at least 8 characters");
//     return;
// }

// /* Must contain letter, number and special character */
// var regex = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&]).+$/;

// if(!regex.test(password)){
//     alert("Password must contain letters, numbers and special characters");
//     return;
// }

/* Redirect only if all validations pass */
window.location.href = "${forgotUrl}&email=" + encodeURIComponent(email);



}
    function login(){

var email = document.getElementById("email").value.trim();
var password = document.getElementById("password").value.trim();

if(!email){
    alert("Please enter email");
    return false;
}

if(!password){
    alert("Please enter password");
    return false;
}
/* Minimum length check */
if(password.length < 8){
    alert("Password must be at least 8 characters");
    return ;
}

/* Password must contain letter, number and special character */
var regex = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&]).+$/;

if(!regex.test(password)){
    alert("Password must contain letters, numbers and special characters");
    return;
}
return true;

}
        </script>
        `;

        htmlField.defaultValue = html;

        context.response.writePage(form);
    }

    else{

        var emailValue = context.request.parameters.email || '';
        var password = context.request.parameters.password || '';
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
        emailValue = emailValue.trim();
        password = password.trim();
        
        if(!emailValue){
context.response.write(
"<html><script>alert('Please enter email first');window.history.back();</script></html>"
);
return;
}

        var employeeSearch = search.create({
            type: search.Type.EMPLOYEE,
            filters:[
                ['email','is',emailValue]
            ],
            columns:[
                'internalid',
                'custentity_rw_dms_portal_password',
                'custentity_rw_dms_portalaccess',
                'custentityrw_dms_role'
            ]
        });

        var result = employeeSearch.run().getRange({
            start:0,
            end:1
        });
        if(result.length > 1 ){
context.response.write(
"<html><script>alert('This email is not registered');window.history.back();</script></html>"
);
return;
}
        if(result.length > 0){

            var storedPassword = result[0].getValue({
                name: 'custentity_rw_dms_portal_password'
            });

            var empId = result[0].getValue({
                name: 'internalid'
            });
            var hasPortalAccess =
    result[0].getValue({
        name:'custentity_rw_dms_portalaccess'
    });
            var role = result[0].getValue({
                name: 'custentityrw_dms_role'
            });
            log.debug("Employee ID from search", empId);
            log.debug("Email from login", emailValue);

            log.debug("Employee ID from search", empId);
            log.debug("Hashed Input", hashPass);
log.debug("Stored Password", storedPassword);
           var hashPass=hashPassword(password)
           


             log.debug("Hashed Input", hashPass);
log.debug("Stored Password", storedPassword);
            // FIRST LOGIN → RESET PASSWORD PAGE
            if(!storedPassword){

          var resetUrl = url.resolveScript({
    scriptId: 'customscript2873',
    deploymentId: 'customdeploy2',
    returnExternalUrl: true,
    params:{
        empid: empId,
        email: emailValue
    }
});

redirect.redirect({
    url: resetUrl
});

log.debug("Reset URL", resetUrl);

// context.response.write(
// "<html><script>window.location.href='" + resetUrl + "';</script></html>"
// );
            }

            // NORMAL LOGIN
            else if(hashPass === storedPassword){
if(
        !hasPortalAccess ||
        !role
    ){

        context.response.write(

            "<html><script>" +

            "alert('Not Authorized to Access Portal');" +

            "window.history.back();" +

            "</script></html>"
        );

        return;
    }
                var homeUrl = url.resolveScript({
                    scriptId:'customscript2874',
                    deploymentId:'customdeploy3',
                    returnExternalUrl:true,
                    params:{
        empid: empId,
        email: emailValue
    }
                });

               context.response.write(`
<html>
<script>
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("empId", "${empId}");
    window.location.href = "${homeUrl}";
</script>
</html>
`);
            }

            else{
                context.response.write(
"<html><script>alert('Invalid Password'); window.history.back();</script></html>"
);
            }

        }
        else{
            context.response.write("<html><script>alert('Invalid email'); window.history.back();</script></html>");
        }
    }

};

return {onRequest};

});