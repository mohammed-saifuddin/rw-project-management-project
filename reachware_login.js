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
body * {
    margin: 0;
    margin-top:10px;
    overflow:hidden;
}
.full-header {
    
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
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
            background:#6b3fa0;
            color:white;
            
            margin-left:10px;
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
    background:white;
    padding-left:0px;
}

.portal {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    
    background: #6b3fa0;
    color: white;
    
    padding: 16px;
    height: 70px;
    
    display: flex;
    font-size:18px;
    justify-content: center;
    align-items: center;

    width: 100%; /* prevent full stretch */
    margin: 0;
}
        .login-box{
            width:350px;
            margin:80px auto;
            margin-top:0px;
        }

        .row{
            display:flex;
            margin-bottom:15px;
        }
.login-box{
    width: 380px;
    margin: 120px auto;
    margin-top:20px;
    background: #ffffff;
    padding: 30px 25px;
    
    border-radius: 12px;
    
    /* SHADOW */
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);

    /* smooth look */
    transition: all 0.3s ease;
}
.btn{
    background:#6b3fa0;
    color:white;
    padding:10px 20px;
    border:none;
    border-radius:8px;
    cursor:pointer;
    transition:0.3s;
}


body{
    background: #f4f6f9;
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
    border-color:#6b3fa0;
    box-shadow:0 0 5px rgba(177, 117, 250, 0.91);
}
.btn:hover{
    background:#5a3390;
}
/* Optional hover effect */
.login-box:hover{
    box-shadow: 0 12px 35px rgba(0,0,0,0.2);
}
        .row label{
            width:120px;
            font-size:16px;
         font-family:bold;
        }

        .row input{
            width:200px;
            padding:6px;
        }
         
        .btn{
        
            background:#1c6ea4;
            color:white;
            padding:8px 20px;
            border:none;
            
           
          
            
           
            cursor:pointer;
            margin-right:10px;
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
           .card-header{
    text-align:center;
    margin-bottom:25px;
}

.icon{
    font-size:40px;
    margin-bottom:10px;
}

.card-title{
    font-size:22px;
    font-weight:700;
    color:#6b3fa0;
}

.card-subtitle{
    font-size:13px;
    color:#777;
    margin-top:5px;
}
        </style>

       
<div class="full-header">
    <div class="header">
        <div class="logo">
                <img  height="45px" width="250px"  src="https://2771600.app.netsuite.com/core/media/media.nl?id=5690&c=2771600&h=kIUCEpH0C_eyrUBVYGJn7nEHV_vSoKDhpdzpaPF7vFesdytX">
            </div>

        <div class="portal">
            Reachware Login Portal
        </div>
    </div>
</div>
        <div class="login-box">
             <div class="card-header">
    <div class="icon">🔐</div>
    <div class="card-title">Login</div>
    <div class="card-subtitle">Access your Reachware account</div>
</div>
            <form method="POST">

            <div class="row">
                <label>Email</label>
                <input type="text" name="email" id="email">
            </div>

            <div class="row">
                <label>Password</label>
                <input type="password" name="password" id="password">
            </div>

            <div class="btn-row">
            <button type="submit" class="btn" onclick="retur login()">Login</button>
           <button type="button" class="btn" onclick="forgot()">Update Password</button>
            </div>
            

            </form>

            
        </div>

        <script>
        document.title="Login"
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
                'custentity_rw_dms_portal_password'
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