/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/url','N/search','N/redirect','N/email','N/runtime','N/record','N/crypto'], 
(serverWidget,url,search,redirect,email,runtime,record,crypto) => {

const onRequest = (context) => {

    if(context.request.method === 'GET'){

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
        <style>
        body,html{font-family: Arial;
        margin-top:-18px !important;
padding-right:-10px !important;
margin-left:-10px !important;
margin-right:-10px !important;
width:1436px !important;
        }

        .header{
            display:flex;
            align-items:center;
            border:1px solid #2d6fa3;
        }

        .portal{
            flex:1;
            background:#6b3fa0;
            color:white;
            display:flex;
            justify-content:center;
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
        </style>

        <div class="header">

            <div class="logo">
                <img width="250" height="20" src="https://2771600.app.netsuite.com/core/media/media.nl?id=5690&c=2771600&h=kIUCEpH0C_eyrUBVYGJn7nEHV_vSoKDhpdzpaPF7vFesdytX">
            </div>

            <div class="portal">
                Reachware Login Portal
            </div>

        </div>

        <div class="login-box">

            <form method="POST">

            <div class="row">
                <label>Email</label>
                <input type="text" name="email" id="email">
            </div>

            <div class="row">
                <label>Password</label>
                <input type="password" name="password" id="password">
            </div>

            <button type="submit" class="btn" onclick="retur login()">Login</button>

            </form>

            <button type="button" class="btn" onclick="forgot()">Update Password</button>

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

                context.response.write(
                    "<html><script>window.location.href='"+homeUrl+"';</script></html>"
                );
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