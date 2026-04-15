/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/url','N/search'], (serverWidget,url,search) => {

const onRequest = (context) => {

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
function getTotalTicketCount(){
    var ticketSearch =search.create({
        type:'customrecord_rw_ticket',
        filters:[],
        columns:[],
    })
    var count=ticketSearch.runPaged().count;
    log.debug("Total tickets",count);
    return count;
}
function getEmployeeInternalId(email){

    var empSearch = search.create({
        type: search.Type.EMPLOYEE,
       
            filters: email ? [['email','is', email]] : []
            
        ,
        columns: ['internalid']
    });

    var res = empSearch.run().getRange({ start: 0, end: 1 });

    if(res.length > 0){
        return res[0].getValue('internalid');
    }

    return null;
}
function getAssignedTicketCount(empInternalId){

    if(!empInternalId) return 0;

    var ticketSearch = search.create({
        type: 'customrecord_rw_ticket',
        filters: [
            ['custrecord_rw_ticket_assignedto','anyof', empInternalId] // ⚠️ change field if needed
        ]
    });

    return ticketSearch.runPaged().count;
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
function getOpenProjectCount(){
    var projectSearch=search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['custrecord_rw_portal_status','noneof','5']
        ]
    })
    var count=projectSearch.runPaged().count;
    log.debug("Total open projects",count);
    return count;
}
function getOpenTicketCount(){
    var ticketSearch=search.create({
        type:'customrecord_rw_ticket',
        filters:[
            ['custrecord_rw_ticket_ticketstatus','noneof','5']
        ]
    })
    var count=ticketSearch.runPaged().count;
    log.debug("Total open tickets",count);
    return count;
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

const taskUrl = url.resolveScript({
scriptId: 'customscript2899',
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
const ticketUrl = url.resolveScript({
scriptId: 'customscript2894',
deploymentId: 'customdeploy1',
returnExternalUrl: true,
params: {
        empid: empId,
        email: email
    }
});
var projectCount=getTotalCount();
var inProgressCount=getInProgressCount();
var totalTickets=getTotalTicketCount();
var openProjects=getOpenProjectCount();
var openTickets=getOpenTicketCount();
var empInternalId = getEmployeeInternalId(email);
var assignedTickets = getAssignedTicketCount(empInternalId);
let html = `

<style>

* {
    box-sizing: border-box;
}

html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    overflow-y:hidden;
    overflow: hidden;
    


    overflow-x: hidden;   /* removes right scroll */
}

/* Remove NetSuite spacing */
#main_form,
.uir-page-body-content,
.uir-page-body,
.uir-page-wrapper,
.uir-page-main,
.uir-page-container,
#div__body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
}

/* Fix container */
.container{
    display: flex;
    height: 100vh;   /* full screen */
}

/* Fix content overflow */
.content{
    flex: 1;
    padding: 0 20px;
    overflow: hidden;   /* ✅ no scrollbar */
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
    height:100vh;           /* ✅ full screen */
    //position:fixed;
    
    left:0;
    transition:0.3s;
    overflow-y:hidden;        /* ✅ scroll only if needed */
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
    height: calc(100vh - 60px);  /* ✅ full screen minus header */
    overflow: hidden;
}
.con{


margin-top:-36px;
margin-left:-20px;
margin-right:-20px;
padding-right:-20px;
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
  background:white /* light overlay */
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
  border-top: 6px solid rgb(107, 63, 160);
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
<div class="con" sytle="width:100%;margin:0;padding:0;background:pink;">
<div class="header">

<div class="menu-icon" onmouseover="openMenu()">☰</div>

<span id="headerTitle">Reachware Project Management Portal</span>

<button class="logout" onclick="logout()">
Logout
</button>

</div>

<div class="container" style="display: flex; flex-direction: row;">

<div class="sidebar" id="sidebar" onmouseleave="closeMenu()">

<div class="menu" onclick="openHome()">Home</div>
<div class="menu" onclick="openProjects()">Projects</div>
<div class="menu" onclick="openTickets()">Tickets</div>


</div>

<div class="content" style="margin-top:-20px;">

<div id="projectContent" style="display:none;width:100%;height:calc(100vh - 60px);">
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
<div>${openProjects}</div>
<div>${totalTickets}</div>
<div>${openTickets}</div>
<div>${inProgressCount}</div>
<div>${assignedTickets}</div>
</div>

</div>

</div>

</div>
</div>

<div id="loader">
    <div class="spinner"></div>
    <p>Opening...</p>
</div>
<script>

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace('${loginUrl}');
}
if (!localStorage.getItem("isLoggedIn")) {
   
window.location.replace('${loginUrl}');
   }
    // Prevent back button completely
window.history.pushState(null, null, window.location.href);

window.onpopstate = function () {
  
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
// document.getElementById("sidebar").style.height="700px";

}

function closeMenu(){
document.getElementById("sidebar").style.width="0";
}
function setPageTitle(title){
    document.title = title + " | Reachware";
}
var projectUrl = '${projectUrl}';
var ticketUrl ='${ticketUrl}';
var taskUrl ='${taskUrl}';
function openProjects(){
setPageTitle("Projects");
document.getElementById("headerTitle").innerText = "Reachware Project Management Portal";
 document.getElementById("homeContent").style.display = "none";
document.getElementById("loader").style.display = "block"; 
document.getElementById("mainFrame").src = projectUrl  ;
document.getElementById("projectContent").style.display = "block";



}
function openTasks(){
alert("task are opening");
setPageTitle("Task");
document.getElementById("headerTitle").innerText = "Reachware Ticketing APP - Task";
 document.getElementById("homeContent").style.display = "none";
document.getElementById("loader").style.display = "block"; 
document.getElementById("mainFrame").src = taskUrl  ;
document.getElementById("projectContent").style.display = "block";
}
function openTickets(){
setPageTitle("Tickets");
document.getElementById("headerTitle").innerText = "Reachware Ticketing APP - ISSUE";
 document.getElementById("homeContent").style.display = "none";
document.getElementById("loader").style.display = "block"; 
document.getElementById("mainFrame").src = ticketUrl  ;
document.getElementById("projectContent").style.display = "block";
}
function hideLoader(){
    document.getElementById("loader").style.display = "none";
     document.getElementById("mainFrame").style.display = "block";
}
function openHome(){
setPageTitle("Home | Reachware");
document.getElementById("headerTitle").innerText = "Reachware Project Management Portal";
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
    localStorage.setItem("logout-event", Date.now());
    
window.location.replace('${loginUrl}');
    
   

}

 }
document.title="Reachware Project Management Portal";
window.addEventListener('storage', function(event) {

    if (event.key === 'logout-event') {

        // Clear everything again (safety)
        localStorage.clear();

        // Redirect to login
        window.location.replace('${loginUrl}');
    }

});
</script>

`;

htmlField.defaultValue = html;

context.response.writePage(form);

};

return { onRequest };

});