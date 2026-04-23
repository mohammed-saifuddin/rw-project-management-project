/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/url','N/search','N/runtime'], (serverWidget,url,search,runtime) => {

const onRequest = (context) => {

var empId = context.request.parameters.empid;
var email = context.request.parameters.email;
var empInternalId = getEmployeeInternalId(email);
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
function getPMProjectCount(empId){

    if(!empId) return 0;

    var projectSearch = search.create({
        type: 'customrecord_rw_portal_access',
        filters: [
            ['custrecord_rw_portal_projectmanager','anyof', empId]
        ]
    });

    return projectSearch.runPaged().count;
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
function getAssignedTicketCount(empId){

    if(!empId) return 0;

    var ticketSearch = search.create({
        type: 'customrecord_rw_ticket',
        filters: [
            ['custrecord_rw_ticket_assignedto','anyof', empId]
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
function getKickOffCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
             ['isinactive','is','F'],
             'AND',
            ['custrecord_rw_portal_status','anyof',['6']]
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
function getBussinessCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['custrecord_rw_portal_status','anyof','7']
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
function getTrainingCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['custrecord_rw_portal_status','anyof','8']
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
function getUATCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['custrecord_rw_portal_status','anyof','3']
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
function getGoliveCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['custrecord_rw_portal_status','anyof','9']
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
var debugSearch = search.create({
    type:'customrecord_rw_portal_access',
    filters:[
        ['isinactive','is','F']
    ],
    columns:[
        'internalid',
        'custrecord_rw_portal_status'
    ]
});

debugSearch.run().each(function(res){

    log.debug("ID", res.getValue('internalid'));
    log.debug("STATUS VALUE", res.getValue('custrecord_rw_portal_status'));
    log.debug("STATUS TEXT", res.getText('custrecord_rw_portal_status'));

    return true;
});
var empRoleMap = {};
function getCOCCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['isinactive','is','F'],
             'AND',
            ['custrecord_rw_portal_status','is','10']
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
function getSupportCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['isinactive','is','F'],
             'AND',
            ['custrecord_rw_portal_status','anyof',['11']]
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
function getEmployeeRole(empInternalId){
    if(!empInternalId) return '';

    var empSearch = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empInternalId,
        columns: ['role']
    });

    
    if (empSearch.role && empSearch.role.length > 0) {
        return empSearch.role[0].text || '';
    }

    return '';   // fallback
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
returnExternalUrl: true,
params: {
        empid: empId,
        email: email
    }
});
 var selectedEmpId = empId || '';
        log.debug("FINAL EMP ID", selectedEmpId);
        var currentUser = runtime.getCurrentUser();
var loggedRoleName = currentUser.roleCenter; 
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
var empRole = getEmployeeRole(empInternalId);
log.debug("Employee Role", empRole);
var assignedTickets = getAssignedTicketCount(empId);
var kickOffCount=getKickOffCount();
var bussinesCount=getBussinessCount();
var training=getTrainingCount();
var uatCount=getUATCount();
var golive=getGoliveCount();
var coc=getCOCCount();
var pmProjectCount = getPMProjectCount(empId);
var support=getSupportCount();
function getRoleType(roleName){
    if (!roleName) return 'OTHER';
    roleName = roleName.toLowerCase();

    if(roleName.includes('pmo')) return 'PMO';
    if(roleName.includes('project manager')) return 'PM';
    if(roleName.includes('developer')) return 'DEV';

    return 'OTHER';
}
var myOpenCount = 0;

if (empId) {

    var openTicketSearch = search.create({
        type: 'customrecord_rw_ticket',
        filters: [
            ['custrecord_rw_ticket_assignedto','anyof',empId],
            'AND',
            ['custrecord_rw_ticket_ticketstatus','noneof','5'] // exclude Done
        ],
        columns: [
            search.createColumn({ name: 'internalid', summary: 'COUNT' })
        ]
    });

    var result = openTicketSearch.run().getRange({ start: 0, end: 1 });

    if (result && result.length > 0) {
        myOpenCount = result[0].getValue({
            name: 'internalid',
            summary: 'COUNT'
        }) || 0;
    }
}
if (!empRole || empRole.trim() === '') {
    empRole =  'Administrator';
}
var roleType = getRoleType(empRole);

let statsHeader = '';
let statsValues = '';
if(roleType === 'PMO'|| roleType === 'DEV'){
    statsHeader = `
        <div>Total Projects</div>
        <div>Open Projects</div>
        <div>In Progress</div>
        <div>Kickoff</div>
        <div>Business requirement</div>
        <div>Training</div>
        <div>UAT</div>
        <div>Go live</div>
        <div>COC</div>
        <div>Support</div>
    `;

   statsValues = `
    <div class="data-val" id="tit" onclick="openProjects('total')">${projectCount}</div>
    <div class="data-val" id="tit" onclick="openProjects('open')">${openProjects}</div>
    <div class="data-val" id="tit" onclick="openProjects('inprogress')">${inProgressCount}</div>
    <div class="data-val" id="tit" onclick="openProjects('kickof')">${kickOffCount}</div>
    <div class="data-val" id="tit" onclick="openProjects('bussinessrequirement')">${bussinesCount}</div>
    <div class="data-val" id="tit" onclick="openProjects('training')">${training}</div>
    <div class="data-val" id="tit" onclick="openProjects('uat')">${uatCount}</div>
    <div class="data-val" id="tit" onclick="openProjects('golive')">${golive}</div>
    <div class="data-val" id="tit" onclick="openProjects('coc')">${coc}</div>
    <div class="data-val" id="tit" onclick="openProjects('support')">${support}</div>
`;
}
else if(roleType === 'PM'){
    statsHeader = `
        <div>Total projects</div>
        
        <div>Open projects</div>
        <div>In Progress</div>
        <div>Total Tickets</div>
        <div>My Projects</div>
        <div>Open Tickets</div>
        
        <div>Assigned Tickets</div>
    `;

    statsValues = `
        <div class="data-val" id="tit" onclick="openProjects('total')">${projectCount}</div>
        
        <div class="data-val" id="tit" onclick="openProjects('open')">${openProjects}</div>
        <div class="data-val" id="tit" onclick="openProjects('inprogress')">${inProgressCount}</div>
        <div class="data-val" id="tit" onclick="openTickets('total')">${totalTickets}</div>
        <div class="data-val" id="tit" onclick="openProjects('myprojects')">${pmProjectCount}</div>
        <div class="data-val" id="tit" onclick="openTickets('open')">${myOpenCount}</div>
        
        <div class="data-val" id="tit" onclick="openTickets('assigned')">${assignedTickets}</div>
    `;
}
else if(roleType === 'DEV'){
    statsHeader = `
        <div>Assigned Tickets</div>
        <div>Open Tickets</div>
    `;

    statsValues = `
       <div class="data-val" id="tit" onclick="openTickets('assigned')">${assignedTickets}</div>
    
    <div class="data-val" id="tit" onclick="openTickets('open')">${myOpenCount}</div>
    `;
}
else{
     statsHeader = `
        <div>Assigned Tickets</div>
        <div>Open Tickets</div>
        <div>Total Tickets</div>
    `;

    
    statsValues = `
    <div class="data-val" id="tit" onclick="openTickets('assigned')">${assignedTickets}</div>
    <div class="data-val" id="tit" onclick="openTickets('open')">${myOpenCount}</div>
    <div class="data-val"  id="tit" onclick="openTickets('total')">${totalTickets}</div>
`;
}
var avatarLetter = (empRole && empRole.length > 0) 
    ? empRole.charAt(0).toUpperCase() 
    : 'U';
let html = `

<style>

* {
    box-sizing: border-box;
}

html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    
   overflow-x:auto !important;
    
    overflow-y: auto !important;



    
}
#homeContent{
    overflow: hidden;
}
    
.data-val:hover{
  background:#E6E6FA;
  color:black;
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
    height: calc(100vh - 60px); 
    overflow:hidden;   /* full screen */
}


    .stats-container {
    width: 100%;
}

.stats-header,
.stats-values {
    display: flex;
    width: 100%;
}

.stats-header div,
.stats-values div {
    flex: 1;   

    display: flex;
    justify-content: center;
    align-items: center;

    text-align: center;
}

/* Optional styling */
.stats-header div {
    background: #6b3fa0;
    color: white;
    padding: 10px;
}

.stats-values div {
    padding: 15px;
    border: 1px solid #ccc;
    font-size: 18px;
}


.header{
    background:#6b3fa0;
    color:white;
    height:60px;
    padding:0 20px;
    display:flex;
    align-items:center;
}
/* Left */
.left-section{
    flex:1;
}

/* Center */
.center-section{
    flex:2;
    text-align:center;
    font-size:18px;
    
}

/* Right */
.right-section{
    flex:1;
    display:flex;
    justify-content:flex-end;
    align-items:center;
    gap:15px;
}
.menu-icon{
position:static;
left:15px;
top:12px;
font-size:22px;
cursor:pointer;
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
// .container{
//     display:block;   
// }
.sidebar{

    top: 60px;
    left: 0;

    width: 0;
    
    height: 100%;


    background: #1667a5;
    color: white;

    overflow: hidden;
    transition: 0.3s;

    z-index: 1000;   /* above content */
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
    width: 100%;
    padding: 0 20px;
    padding: 0 20px;
    height: calc(100vh - 60px);  
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
.stats-header, .stats-values {
    display: flex;
    flex-wrap: nowrap;   
    width: 100%;
}

.stats-header div,
.stats-values div {
    flex: 1;
    width:100%;
    

    display: flex;              
    justify-content: center;    
    align-items: center;        

    text-align: center;
}
.stats-header div{
padding:10px;
text-align:center;
border-right:1px solid white;
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
 .stats-container{
    display: inline-flex;
    flex-direction: column;
}

.stats-header,
.stats-values{
    display: flex;
    flex-wrap: nowrap;
    width:100%;
}

.stats-header div,
.stats-values div{
    
    flex: 1;

    display: flex;
    justify-content: center;
    align-items: center;
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

.right-section{
    display:flex;
    align-items:center;
    gap:10px;
}
.role-text{
    font-size:12px;
    font-weight:bold;
    background:white;
    border-radius:20px;
    padding:6px 15px;
        color:#6b3fa0;
}
        .role-text:hover{
        background:#1667a5;
        color :white;
        }

/* REMOVE absolute positioning */
.logout{
    position:static;   
    background:#6b3fa0;
    border:1px solid white;
    padding:6px 15px;
    color:white;
    cursor:pointer;
}
    
.logout:hover{
background:white;
color:#6b3fa0;
font-weight:bold;

}
    .title{
    position:absolute;
    left:50%;
    transform:translateX(-50%);
    font-size:18px;
}
    .avatar{
    width: 35px;
    height: 35px;
    border-radius: 50%;

    background: #6b3fa0;
    color: white;

    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: bold;
    font-size: 14px;
}
</style>
<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<div class="con" sytle="width:100%;margin:0;padding:0;background:pink;">
<div class="header">

    <div class="left-section">
        <div class="menu-icon" onmouseover="openMenu()">☰</div>
    </div>

    <div class="center-section" id="headerTitle">
        Reachware Project Management Portal
    </div>

    <div class="right-section">
        <span class="role-text"> ${empRole}</span>
        <button class="logout" onclick="logout()">Logout</button>
    </div>

</div>

<div class="container" style="display: flex; flex-direction: row;">

<div class="sidebar" id="sidebar" onmouseleave="closeMenu()">

<div class="menu" onclick="openHome()">Home</div>
<div class="menu" onclick="openProjects(); closeMenu()">Projects</div>
<div class="menu" onclick="openTickets(); closeMenu()">Tickets</div>


</div>

<div class="content">

<div id="projectContent" style="display:none;width:100%;height:calc(100vh - 60px);">

  <iframe id="mainFrame"
        style="
        width:100%;
        height:100%;
        border:none;
        display:none;
        margin-top:60px;
        position:absolute;
        top:0;
        left:0;
        background:white;
        overflow-y:hidden;
        
        "
        onload="hideLoader()">
</iframe>
</div>

<div id="homeContent" style="margin-top:40px;">

<div class="stats-container">

    <div class="stats-header">
        ${statsHeader}
    </div>

    <div class="stats-values">
        ${statsValues}
    </div>

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
// function openProjects(){
// setPageTitle("Projects");
// document.getElementById("headerTitle").innerText = "Reachware Project Management Portal";
//  document.getElementById("homeContent").style.display = "none";
// document.getElementById("loader").style.display = "block"; 
// document.getElementById("mainFrame").src = projectUrl  ;
// document.getElementById("projectContent").style.display = "block";



// }
function openProjects(type){

    setPageTitle("Projects");
document.getElementById("headerTitle").innerText = "Reachware Project Management Portal";
    document.getElementById("homeContent").style.display = "none";
    document.getElementById("loader").style.display = "block";

     let title = "Projects";

    if(type === "total") title = "Total Projects";
    else if(type === "open") title = "Open Projects";
    else if(type === "inprogress") title = "In Progress Projects";
    else if(type === "kickof") title = "Kickof Projects";
else if(type === "bussinessrequirement") title = "Bussiness requirement Projects";
else if(type === "training") title = "Training Projects";
else if(type === "coc") title = "COC Projects";
else if(type === "uat") title = "UAT Projects";
else if(type === "golive") title = "Golive Projects";
else if(type === "support") title = "Support Projects";
else if(type === "myprojects") title = "My projects";
    let url = projectUrl;
var frame = document.getElementById("mainFrame");


frame.style.display = "none";
frame.src = "";


frame.src = url;
    if(type){
        url += "&filter=" + type; 
        url += "&title=" + encodeURIComponent(title);  
    }

    document.getElementById("mainFrame").src = url;

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
// function openTickets(){
// setPageTitle("Tickets");
// document.getElementById("headerTitle").innerText = "Reachware Ticketing APP - ISSUE";
//  document.getElementById("homeContent").style.display = "none";
// document.getElementById("loader").style.display = "block"; 
// document.getElementById("mainFrame").src = ticketUrl  ;
// document.getElementById("projectContent").style.display = "block";
// }
function openTickets(type){

    setPageTitle("Tickets");
    document.getElementById("headerTitle").innerText = "Reachware Ticketing APP - ISSUE";

    document.getElementById("homeContent").style.display = "none";
    document.getElementById("loader").style.display = "block";
let title = "Tickets";

    if(type === "assigned") title = "Assigned Tickets";
    else if(type === "open") title = "Open Tickets";
    else if(type === "total") title = "Total Tickets";

    let url = ticketUrl;
    
var frame = document.getElementById("mainFrame");


frame.style.display = "none";
frame.src = "";


frame.src = url;
    if(type){
       url += "&filter=" + type;
        url += "&title=" + encodeURIComponent(title);
url += "&empid=" + localStorage.getItem("empId");   
    }

    document.getElementById("mainFrame").src = url;
    document.getElementById("projectContent").style.display = "block";
}
    
// function hideLoader(){
//     document.getElementById("loader").style.display = "none";
//      document.getElementById("mainFrame").style.display = "block";
     
// }
     function hideLoader(){
    var frame = document.getElementById("mainFrame");

    document.getElementById("loader").style.display = "none";

    
    if(frame.src){
        frame.style.display = "block";
    }
}
function openHome(){
setPageTitle("Home");
document.getElementById("headerTitle").innerText = "Reachware Project Management Portal";
 document.getElementById("projectContent").style.display = "none";

document.getElementById("loader").style.display = "none"; 
document.getElementById("homeContent").style.display = "block";
var frame = document.getElementById("mainFrame");
    frame.src = "";              // clear old page
    frame.style.display = "none";
}
var loggedRoleName = "${loggedRoleName}";
var empRoleMap = ${JSON.stringify(empRoleMap)};
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