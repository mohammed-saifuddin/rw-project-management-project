/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/url','N/search'], (serverWidget,url,search) => {

const onRequest = (context) => {
var logout = context.request.parameters.logout || '';
var empId = context.request.parameters.empid;
var email = context.request.parameters.email;
function getTotalCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project",count);
    return count;
}
function getInProgressCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['custrecord_rw_portal_status','anyof','2']
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
if(logout === 'T'){
    // user logged out
    // just show login page and stop any redirect
    const loginUrl = url.resolveScript({
scriptId: 'customscript2872',
deploymentId: 'customdeploy1',
returnExternalUrl: true,
 params: {
        empid: empId,
        email: email
    }
});

log.debug("Logout", "User returned to login page");
context.response.write(
"<html><script>alert('Employee not found');window.location.href='" + loginUrl + "';</script></html>"
);
return;
}
const form = serverWidget.createForm({ title: ' ' });

const htmlField = form.addField({
id: 'custpage_dashboard',
type: serverWidget.FieldType.INLINEHTML,
label: 'Dashboard'
});


const loginUrl = url.resolveScript({
scriptId: 'customscript2872',
deploymentId: 'customdeploy1',
returnExternalUrl: true,
 params: {
        empid: empId,
        email: email
    }
});


const projectUrl = url.resolveScript({
scriptId: 'customscript2876',
deploymentId: 'customdeploy5',
returnExternalUrl: true
});
var projectCount=getTotalCount();
var inProgressCount=getInProgressCount();
let html = `

<style>

html, body {


margin-top:-18px !important;
padding-right:-10px !important;
margin-left:-10px !important;
margin-right:-10px !important;
width:1436px !important;
}

#main_form,
.uir-page-body-content,
.uir-page-body,
.uir-page-wrapper,
.uir-page-main,
.uir-page-container,
#div__body {
    margin: 0 !important;
    padding: 0 !important;
}
.uir-page-body-content {
padding:0 !important;
}

.uir-page-body {
padding:0 !important;
}

body{
font-family: Arial;
margin:0;
}

.header{
background:#6b3fa0;
color:white;
padding:15px;
text-align:center;
font-size:18px;
position:relative;
}

.menu-icon{
position:absolute;
left:15px;
top:12px;
font-size:22px;
cursor:pointer;
}

.logout{
position:absolute;
right:20px;
top:12px;
background:#6b3fa0;
border:1px solid white;
padding:6px 15px;
color:white;
cursor:pointer;
}
.logout:hover{
background:white;
color:#6b3fa0;

}
#div__body,
.uir-page-wrapper,
.uir-page-main,
.uir-page-body,
.uir-page-container {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
}
.container{
display:flex;
}

.sidebar{
width:0;
overflow:hidden;
background:#1667a5;
color:white;
min-height:400px;
transition:0.3s;
}

.menu{
padding:12px;
border-bottom:1px solid #0c4f82;
cursor:pointer;
}

.menu:hover{
background:#0f4e80;
}

.content{
flex:1;
padding: 0 20px;

}

.stats-header{
display:grid;
grid-template-columns: repeat(6,1fr);
background:#6b3fa0;
color:white;
}

.stats-header div{
padding:10px;
text-align:center;
border-right:1px solid white;
}

.stats-values{
display:grid;
grid-template-columns: repeat(6,1fr);
text-align:center;
}
#loader {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height:100%;
  background: rgba(255,255,255,0.7); /* light overlay */
  z-index: 9999;     /* above everything */
  text-align: center;
  padding-top: 200px;

 
}
.spinner {
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);


  border: 6px solid #f3f3f3;
  border-top: 6px solid #6b3fa0;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
//   margin: auto;
}

@keyframes spin {
  0% { transform: translate(-50%,-50%) rotate(0deg); }
  100% { transform: translate(-50%,-50%) rotate(360deg); }
}
.stats-values div{
padding:20px;
border:1px solid #ccc;
font-size:20px;
}

</style>
<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<div class="header">

<div class="menu-icon" onmouseover="openMenu()">☰</div>

Reachware Project Management Portal

<button class="logout" onclick="logout()">
Logout
</button>

</div>

<div class="container" style="display: flex; flex-direction: row;">

<div class="sidebar" id="sidebar" onmouseleave="closeMenu()">

<div class="menu" onclick="openHome()">Home</div>
<div class="menu" onclick="openProjects()">Projects</div>
<div class="menu">Tickets</div>

</div>

<div class="content">

<div id="projectContent" style="display: none;width:100%;height:100%;">
<iframe id="mainFrame" style="width:100%;height:100%;border:none;display:none;" onload="hideLoader()"></iframe>
</div>

<div id="homeContent" style="margin-top:50px;">

<div class="stats-header">
<div>Total Projects</div>
<div>Open Projects</div>
<div>Total Tickets</div>
<div>Open Tickets</div>
<div>In Progress</div>
<div>Assigned Tickets</div>
</div>

<div class="stats-values">
<div>${projectCount}</div>
<div>2</div>
<div>24</div>
<div>6</div>
<div>${inProgressCount}</div>
<div>1</div>
</div>

</div>

</div>

</div>
<div id="loader">
    <div class="spinner"></div>
    <p>Loading Projects...</p>
</div>
<script>
if (!localStorage.getItem("isLoggedIn")) {
   // window.location.replace("https://2771600.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2872&deploy=1");
window.location.replace('${loginUrl}');
   }
    // Prevent back button completely
window.history.pushState(null, null, window.location.href);

window.onpopstate = function () {
   // window.location.replace("https://2771600.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2872&deploy=1&empid=&email=");
window.location.replace('${loginUrl}');
   };
function storeSession(email, empId, password) {
    localStorage.setItem("email", email);
    localStorage.setItem("empId", empId);

   
    

    
  localStorage.setItem("isLoggedIn", "true");
}
    var emailFromSuitelet = "${email}";
var empIdFromSuitelet = "${empId}";
storeSession(emailFromSuitelet, empIdFromSuitelet);
   console.log("Stored Email:", localStorage.getItem("email"));
console.log("Stored EmpId:", localStorage.getItem("empId"));
 if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "https://2771600.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2872&deploy=1&compid=2771600&ns-at=AAEJ7tMQLCBxkbOlhRyShbsZSNh6QPuKL2rt00NN091SJ6hEFho";
}


function openMenu(){
document.getElementById("sidebar").style.width="180px";
document.getElementById("sidebar").style.height="700px";

}

function closeMenu(){
document.getElementById("sidebar").style.width="0";
}

var projectUrl = '${projectUrl}';

function openProjects(){

 document.getElementById("homeContent").style.display = "none";
document.getElementById("loader").style.display = "block"; 
document.getElementById("mainFrame").src = projectUrl  ;
document.getElementById("projectContent").style.display = "block";


}
function hideLoader(){
    document.getElementById("loader").style.display = "none";
     document.getElementById("mainFrame").style.display = "block";
}
function openHome(){

 document.getElementById("projectContent").style.display = "none";

document.getElementById("loader").style.display = "none"; 
document.getElementById("homeContent").style.display = "block";

}
window.onload = function(){

    
    window.history.pushState(null, null, window.location.href);

    window.onpopstate = function () {
      // window.location.href = "https://2771600.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2872&deploy=1&compid=2771600&ns-at=AAEJ7tMQLCBxkbOlhRyShbsZSNh6QPuKL2rt00NN091SJ6hEFho";
      window.location.replace('${loginUrl}');
    };

}
   
/* LOGOUT FUNCTION */

 function logout(){

if(confirm("Are you sure you want to logout?")){


  localStorage.clear();

    

    localStorage.removeItem("email");
    localStorage.removeItem("empId");
    
    localStorage.removeItem("isLoggedIn");
    
    
window.location.replace('${loginUrl}');
    
   // window.location.href = "https://2771600.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2872&deploy=1&compid=2771600&ns-at=AAEJ7tMQLCBxkbOlhRyShbsZSNh6QPuKL2rt00NN091SJ6hEFho";

}

 }
document.title="Reachware Project Management Portal";
</script>

`;

htmlField.defaultValue = html;

context.response.writePage(form);

};

return { onRequest };

});