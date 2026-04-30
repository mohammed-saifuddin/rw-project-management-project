/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/search','N/url','N/file','N/format','N/runtime'], 
(serverWidget, record, search, url, file, format,runtime) => {

const onRequest = (context) => {
// var productOptions = '<option value="">Select Product</option>';

// var productSearch = search.create({
//     type: 'customlist_rw_ticket_rwsuiteapplist', 
//     columns:['internalid','name']// 
// });

// productSearch.run().each(function(result){

//     var id = result.getValue('internalid');
//     var name = result.getValue('name');

//     productOptions += `<option value="${id}" 
//     >${name}</option>`;

//     return true;
// });
    var productOptions = '<option value="">Select Product</option>';
     if (context.request.parameters.action === 'getProducts') {

    var customerId = context.request.parameters.customerId;

    if(!customerId){
        context.response.write(JSON.stringify([]));
        return;
    }

    var productList = [];

    var mappingSearch = search.create({
        type: 'customrecord_rw_support_',
        filters: [
            ['custrecord_rw_project_summary', 'anyof', customerId]
        ],
        columns: [
            'custrecord_rw_support_product'
        ]
    });

    mappingSearch.run().each(function(result) {

        productList.push({
            id: result.getValue('custrecord_rw_support_product'),
            name: result.getText('custrecord_rw_support_product')
        });
  log.debug("FIELD VALUE", result.getValue('custrecord_rw_project_summary'));
    log.debug("FIELD TEXT", result.getText('custrecord_rw_project_summary'));
        return true;
    });

    context.response.write(JSON.stringify(productList));
    return;
}
    if (context.request.method === 'GET') {

        var form = serverWidget.createForm({ title: ' ' });
        form.hideNavBar = true;
          var email = context.request.parameters.email || '';
    var empId = context.request.parameters.empid 
         || context.request.parameters.empId 
         || context.request.parameters.employeeId 
         || '';
        var htmlField = form.addField({
            id: 'custpage_html',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'HTML'
        });
        var selectedEmpId = empId || '';
        log.debug("FINAL EMP ID", selectedEmpId);
        var currentUser = runtime.getCurrentUser();
var loggedRoleName = currentUser.roleCenter;  // ✅ USE NAME

log.debug("Logged Role Name", loggedRoleName);
         var rwOptions ='<option value="">--Select--</option>';
var rwSearch=search.create({
    type:'customlist_rw_ticket_rwsuiteapplist',
    columns:['internalid','name']
})
rwSearch.run().each(function(result){
    rwOptions +='<option value="'+result.getValue('internalid')+'">'+result.getValue('name')+'</option>';
    return true;
})
        var roleOptions = '<option value="">Select</option>';
   
if (context.request.parameters.action === 'getTicket') {

   var requestType = context.request.parameters.requestType;

var projectId = context.request.parameters.projectId;
var requestType = context.request.parameters.requestType;

var ticketSearch = search.create({
    type: 'customrecord_rw_ticket',
    filters: [
        ['custrecord_rw_ticket_projectname', 'anyof', projectId],
        'AND',
        ['custrecord_rw_ticket_requesttype', 'anyof', requestType]
    ],
    columns: ['custrecord_rw_ticket_ticketno']
});

var result = ticketSearch.run().getRange({ start: 0, end: 1000 });

var maxNumber = 0;

result.forEach(function(rec) {

    var ticket = rec.getValue('custrecord_rw_ticket_ticketno');

    if (ticket) {
        var num = parseInt(ticket.split('-').pop()) || 0;

        if (num > maxNumber) {
            maxNumber = num;
        }
    }
});

var nextNumber = maxNumber + 1;

context.response.write(JSON.stringify({ count: nextNumber }));
return;
}

var customerOptions = '<option value="">--Select--</option>';

var customerSearch = search.create({
    type: search.Type.CUSTOMER,
    filters: [
        ['isinactive','is','F'],
       
    'AND',
    ['custentity_is_rw_customer','is','T']
    ],
    columns: ['internalid','altname']
});
customerSearch.run().each(function(result){
    customerOptions += '<option value="' + result.getValue('internalid') + '">' + result.getValue('altname') + '</option>';
     return true;
});
var roleSearch = search.create({
    type: 'role',
    columns: ['internalid', 'name']
});

roleSearch.run().each(function(result){

    var id = result.getValue('internalid');
    var name = result.getValue('name');

    roleOptions += '<option value="'+id+'" ' + 
    (name === loggedRoleName ? 'selected' : '') +
    '>' + name + '</option>';

    return true;
});
var empOptions = '<option value="">Select</option>';
var emp1Options = '<option value="">Select</option>';
        var empSearch = search.create({
    type: 'employee',
    filters: [
        ['isinactive','is','F']
    ],
    columns: ['internalid','firstname','lastname']
});

empSearch.run().each(function(result){

    var id = result.getValue('internalid');
    var firstname = result.getValue('firstname');
    var lastname = result.getValue('lastname');

    var isSelected = (String(id) === selectedEmpId) ? 'selected' : '';

    empOptions += '<option value="'+id+'" '+isSelected+'>' +
        firstname + ' ' + lastname +
        '</option>';

    return true;
});
log.debug("emp id is ",selectedEmpId)
var projectOptions = '<option value="">Select</option>';

var projectSearch = search.create({
    type: 'customlist_rw_ticket_projectnamelist',
    filters: [['isinactive','is','F']],
    columns: ['internalid','name']
});
var empRoleMap = {};
projectSearch.run().each(function(result){
    var id = result.getValue('internalid');
    var name = result.getValue('name');

    projectOptions += '<option value="'+id+'">'+name+'</option>';
var empSearch = search.create({
    type: 'employee',
    filters: [
        ['isinactive','is','F']
    ],
    columns: ['internalid','firstname','lastname','role']
});

empSearch.run().each(function(result){

    var id = result.getValue('internalid');
    var firstname = result.getValue('firstname');
    var lastname = result.getValue('lastname');

    var roleId = result.getValue('role');
    var roleName = result.getText('role');

    empRoleMap[id] = {
        roleId: roleId,
        roleName: roleName
    };

    emp1Options += '<option value="'+id+'">'+
        firstname + ' ' + lastname +
        '</option>';

    return true;
});
    return true;
});

        htmlField.defaultValue = `

<style>

body{
margin:0 !important;
width:100%;
height:100%;
}

html, body {
    margin: 0 !important;
    padding: 0 !important;
    height:100%;
    
}

body > div,
.uir-page-container,
.uir-page-wrapper,
.uir-page-body,
.uir-page-main,
#div__body {
    margin: 0 !important;
    padding: 0 !important;
}


#custpage_html_fs,
#custpage_html_fs_lbl,
#custpage_html_fs_val {
    margin: 0 !important;
    margin-top:-20px;
    padding: 0 !important;
    border: none !important;
}

#div__body{
padding:0 !important;
margin-top:-20px;
margin:0 !important;
}



label.required::after {
    content: " *";
    color: red;
    font-weight: bold;
}
// /* Title */
// .main-title {
//     text-align:center;
//     background:#6b3fa0;
//     color:white;
//     padding:10px;
//     font-weight:bold;
//     margin-bottom:10px;
//     display:flex;
//     justify-content:center;
//     align-items:center;
// }

/* Section */
.section {
    background:#6f3ba2;
    // background:#5d8db8;
    color:white;
    padding:8px;
    font-weight:bold;
    text-transform:uppercase;
    
    shadow: 0 4px 8px rgba(111,59,162,0.3);
    display:flex;
    justify-content:center;
    align-items:center;
    margin-bottom:10px;
}

/* Row (label + input) */
.form-row {
    display:flex;
    align-items:center;
    margin-bottom:12px;
}

/* Label */
.form-row label {
    width:220px;
    font-weight:bold;
    
    padding:8px;
    
}
select {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.opt:hover {
    border-color: #6f3ba2;
    background-color: #f3e8ff;
    cursor: pointer;
}
/* Input */
.form-row input,
.form-row select,
.form-row textarea {
    flex:1;
    
    border:1px solid #ccc;
    font-size:14px;
}

/* Two column layout */
.row {
    display:flex;
    gap:20px;
    
}

/* Special colors */
.green { background:#c6e0b4; }
.red { background:#ff0000; color:white; }

/* Textarea */
textarea {
    height:40px;
    resize:vertical;
}
.attach{
height:30px;


}
.container {
    width: 100%; 
    height:650px;         /* ✅ fixed width */
    max-width: 95%;
    max-height:99%;
    position:absolute;
    margin-left:0px;
    padding-left:0px;
    margin-top:-40px;
    
   
    
}
/* Button */
button {
   margin-top:20px;
padding:10px 20px;
background:#6f3ba2;
color:white;
border:none;
cursor:pointer;
}

</style>

<div class="container">



<form method="POST" action="" enctype="multipart/form-data">

<!-- Requestor Info -->
<div class="section">Requestor Information</div>

<div class="row">

<div style="flex:1;">
    <div class="form-row">
        <label class="required">Assignee</label>
        <input type="hidden" name="empid" value="${selectedEmpId}">
        <select name="name" required>
        ${empOptions}
        </select>
    </div>

    <div class="form-row">
        <label class="required">Date</label>
    <input type="date" id="dateField" name="date" readonly>
    </div>

    <div class="form-row">
        <label>Ticket No</label>
        
        <span id="ticketNoText" style="padding:8px;font-size:14px;font-style:italic;">To be Generated automatically</span>

<input type="hidden" id="ticketNoField" name="ticketNo">
    </div>
</div>

<div style="flex:1;">
    <div class="form-row">
        <label class="required">Email</label>
        
    <input type="text" id="emailField" name="email" readonly>
    </div>

    <div class="form-row">
        <label class="required">Request Type</label>
        <select class="" name="requestType" required>
        <option value="">Select</option>
        <option value="1">New Request</option>
            <option value="2">Issue/bug</option>
            <option value="3">Enhancement</option>
            <option value="4">Training/UAT</option>
        </select>
    </div>
  <div class="form-row">
        <label class="required">Role Of User</label>
        <select name="roleOfUser" required>
    ${roleOptions}
</select>
    </div>
    
</div>

</div>

<!-- Project Info -->
<div class="section">Project Information</div>

<div class="row">

<div style="flex:1;">
    <div class="form-row">
        <label class="required">Client Name</label>
       <select name="projectName" id="projectName" required>
    ${customerOptions}
</select>
    </div>

    <div class="form-row">
        <label class="required">Reachware Product</label>
        
       <select class="" name="suiteApp" id="suiteApp" required>
  ${productOptions}
</select>
    </div>
</div>

<div style="flex:1;">
    <div class="form-row">
        <label class="required">Environment</label>
        <select class="" name="environment" required>
            <option value="">Select</option>
            <option  value="1">Production</option>
            <option value="2">Sandbox</option>
            
        </select>
    </div>
</div>

</div>


<div class="section">Issue Details</div>

<div class="row">

<div style="flex:1;">
    <div class="form-row">
        <label class="required">Priority</label>
        <select class="" name="priority" required>
            <option value="">Select</option>
            <option  value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
        </select>
    </div>

    <div class="form-row">
        <label class="required">Issue Details</label>
        <textarea name="issueDetails" required></textarea>
    </div>

    <div class="form-row">
        <label>Attachment</label>
        
        <input type="file" id="attachment" name="attachment" >
<input type="hidden" name="fileId" id="fileId">
    </div>

    <div class="form-row">
        <label class="required">Status</label>
        <select name="status" required>
<option value="">Select</option>
<option value="1">To Do</option>
<option value="2">In Progress</option>
<option value="3">UAT</option>
<option value="4">Code Review</option>
<option value="5">Done</option>
</select>
    </div>
</div>

<div style="flex:1;">
    <div class="form-row">
        <label class="required">Issue Occurred on</label>
        <input type="date" name="issueOccurredOn" required>
    </div>

    <div class="form-row">
        <label class="required">Assigned To</label>
        
        <select class="" name="assignedTo" required>
            ${emp1Options}
        </select>
    </div>

    <div class="form-row">
        <label class="required">Deadline</label>
        <input type="date" name="deadline" required>
    </div>
    <div class="form-row">
        <label class="required">OverDues days</label>
        <input type="text" name="overdueDays" required>
    </div>
</div>

</div>

<button type="submit">Submit Ticket</button>

</form>

</div>

<script>
var loggedRoleName = "${loggedRoleName}";
var empRoleMap = ${JSON.stringify(empRoleMap)};
var requestTypeDropdown = document.querySelector("select[name='requestType']");
var projectDropdown = document.getElementById('projectName');
document.addEventListener("DOMContentLoaded", function () {

    setTimeout(function () {

        var today = new Date();

        var year = today.getFullYear();
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var day = String(today.getDate()).padStart(2, '0');

        var formattedDate = year + "-" + month + "-" + day; // YYYY-MM-DD

        var dateField = document.getElementById("dateField");

        if (dateField) {
            dateField.value = formattedDate;
        }

    }, 300);

});
document.addEventListener("DOMContentLoaded", function () {

    const empDropdown = document.querySelector("select[name='name']");
    const roleDropdown = document.querySelector("select[name='roleOfUser']");

    function setRole() {
        const empId = empDropdown.value;

        if (empRoleMap[empId] && roleDropdown) {
            roleDropdown.value = empRoleMap[empId].roleId;
        }
    }

    if (empDropdown) {
        empDropdown.addEventListener("change", setRole);
        setRole(); 
    }

});
document.addEventListener("DOMContentLoaded", function () {

    setTimeout(function () {

        var email = localStorage.getItem("email");

        console.log("Email:", email);

        var emailField = document.getElementById("emailField");

        if (email && emailField) {
            emailField.value = email;
        }

    }, 300);

});
document.getElementById('projectName').addEventListener('change', function () {

    var customerId = this.value;

    fetch(window.location.href + "&action=getProducts&customerId=" + customerId)
    .then(res => res.json())
    .then(data => {

        var dropdown = document.getElementById('suiteApp');

        dropdown.innerHTML = '<option value="">Select Product</option>';

        data.forEach(function(prod){
            dropdown.innerHTML += '<option value="' + prod.id + '">' + prod.name + '</option>';
        });

    });
});
// document.getElementById('projectName').addEventListener('change', function () {

//     var projectId = this.value;
//     var projectText = this.options[this.selectedIndex].text;

//     if (!projectId) return;

//     var prefix = projectText.replace(/\s/g, '').substring(0, 2).toUpperCase();

//     fetch(window.location.href + "&action=getTicket&projectId=" + projectId)
//     .then(res => res.json())
//     .then(data => {

//         console.log("Next Number:", data.count); // 🔍 DEBUG

//         var ticketNo = prefix + "-ISSU-" + ('000' + data.count).slice(-3);

//         var ticketInput = document.getElementById('ticketNoField');
// var ticketText = document.getElementById('ticketNoText');

// if (ticketInput) ticketInput.value = ticketNo;
// if (ticketText) ticketText.innerText = ticketNo;
//     });

// });

document.getElementById('attachment').addEventListener('change', function(){

    var file = this.files[0];
    var formData = new FormData();
    formData.append("file", file);

    fetch("https://2771600.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2890&deploy=1&compid=2771600&ns-at=AAEJ7tMQRHG8OQo6ARWBSPkf8htuXBSiRp_GEKmie7jHHMP-uJ0", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        document.getElementById('fileId').value = data.fileId;
        //alert("File uploaded successfully!");
    });
});
function generateTicketNumber() {

    var projectDropdown = document.getElementById('projectName');
    var requestTypeDropdown = document.querySelector("select[name='requestType']");

    var projectId = projectDropdown.value;
    var projectText = projectDropdown.options[projectDropdown.selectedIndex]?.text || '';
    var requestType = requestTypeDropdown.value;

    if (!projectId || !requestType) return;

    var prefix = projectText.replace(/\s/g, '').substring(0, 3).toUpperCase();

    var year = new Date().getFullYear();

    // 🔥 type mapping
    var typeCode = "";
    switch(requestType){
        case "1": typeCode = "NRQ"; break;
        case "2": typeCode = "ISSU"; break;
        case "3": typeCode = "ENH"; break;
        case "4": typeCode = "TRN"; break;
    }

    fetch(window.location.href + 
        "&action=getTicket&projectId=" + projectId + 
        "&requestType=" + requestType)
    .then(res => res.json())
    .then(data => {

        var ticketNo = prefix + "-" + typeCode + "-" + ('000' + data.count).slice(-3);

        document.getElementById('ticketNoField').value = ticketNo;
        document.getElementById('ticketNoText').innerText = ticketNo;
    });
}
projectDropdown.addEventListener('change', generateTicketNumber);
requestTypeDropdown.addEventListener('change', generateTicketNumber);
//console.log(file);


</script>
`;

        context.response.writePage(form);
    }

    
    else {

        var req = context.request;
        var fileId = req.parameters.fileId;
        

log.debug("Received File ID", fileId);
function convertToNetSuiteDate(dateStr) {
    if (!dateStr || dateStr.trim() === '') return null;

    var parts = dateStr.split('-'); // YYYY-MM-DD

    if (parts.length !== 3) return null;

    var formatted = parts[2] + '/' + parts[1] + '/' + parts[0]; // DD/MM/YYYY

    return format.parse({
        value: formatted,
        type: format.Type.DATE
    });
}

        var name = req.parameters.name;
        var email = req.parameters.email;
        var date = req.parameters.date;
        var requestType = req.parameters.requestType;
        var assignedTo = req.parameters.assignedTo;
        var projectName = req.parameters.projectName;
        var suiteApp = req.parameters.suiteApp;
        var environment = req.parameters.environment;
        var priority = req.parameters.priority;
        var issueDetails = req.parameters.issueDetails;
        var status = req.parameters.status;
        var issueOccurredOn = req.parameters.issueOccurredOn;
        var roleOfUser = req.parameters.roleOfUser;
        var deadline = req.parameters.deadline;
      var formattedDate = convertToNetSuiteDate(date);
var formattedDeadline = convertToNetSuiteDate(deadline);
var formattedIssueDate = convertToNetSuiteDate(issueOccurredOn);
var overdueDays =req.parameters.overdueDays;
        var ticketNo =req.parameters.ticketNo;

        var rec = record.create({
            type: 'customrecord_rw_ticket',
            isDynamic: true
        });

        rec.setValue({ 
            fieldId: 'custrecord_rw_ticket_name', 
            value: name 
        });
        rec.setValue({ 
            fieldId: 'custrecord_rw_ticket_email', 
            value: email
         });
        rec.setValue({ 
            fieldId: 'custrecord_rw_ticket_priority',
             value: priority
            });
        rec.setValue({ 
            fieldId: 'custrecord_rw_ticket_ticketstatus',
             value: status 
            });
         rec.setValue({
             fieldId: 'custrecord_rw_ticket_assignedto', 
             value: assignedTo 
            });
        rec.setValue({ 
            fieldId: 'custrecord_rw_ticket_issuedetails',
             value: issueDetails 
            });
        rec.setValue({ 
            fieldId: 'custrecord_rw_ticket_requesttype', 
            value: requestType
         });
        rec.setValue({ 
            fieldId: 'custrecord_rw_ticket_ticketno', 
            value: ticketNo
         });
//         var fileId = null;

// if (fileObj) {
//     try {
//         fileObj.folder = 456;  
//         fileId = fileObj.save(); 

//         log.debug("File Saved", fileId);

//     } catch (e) {
//         log.error("File Upload Error", e.message);
//     }
// }
// log.debug("File ID", fileId);
// log.debug('File Uploaded', 'File ID:',fileId);
       if (fileId) {
    rec.setValue({
        fieldId: 'custrecord_rw_ticket_attachment',
        value: fileId   
    });
}
        
       
        rec.setValue({
             fieldId: 'custrecord_rw_ticket_userrole',
              value: roleOfUser
             });
          rec.setValue({ 
            fieldId: 'custrecord_rw_ticket_projectname',
            value: projectName 
        });
        rec.setValue({ 
            fieldId: 'custrecord_rw_ticket_environment',
             value: environment
             });
        rec.setValue({ 
            fieldId: 'custrecord_rw_ticket_rwsuiteapp',
             value: suiteApp 
            });
       
               rec.setValue({ 
            fieldId: 'custrecord_rw_ticket_overduedays',
             value: overdueDays 
            });
            if (formattedDate) {
    rec.setValue({
        fieldId: 'custrecord_rw_ticket_date',
        value: formattedDate
    });
}

if (formattedDeadline) {
    rec.setValue({
        fieldId: 'custrecord_rw_ticket_deadline',
        value: formattedDeadline
    });
}

if (formattedIssueDate) {
    rec.setValue({
        fieldId: 'custrecord_rw_ticket_issueoccuredon',
        value: formattedIssueDate
    });
}
        
        log.debug("FILES OBJECT", context.request.files);
        
        
        var id = rec.save();

        
        var redirectUrl = url.resolveScript({
                scriptId: 'customscript2894',
                deploymentId: 'customdeploy1',
                returnExternalUrl: true
                });

        context.response.write(`
<html>
<head>
<style>
/* FORCE FULL SCREEN OVERRIDE */
html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    overflow: hidden !important;
}

/* REMOVE ALL NETSUITE WRAPPER SPACE */
body > div,
.uir-page-container,
.uir-page-wrapper,
.uir-page-body,
.uir-page-main {
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    left: 0 !important;
}

/* VERY IMPORTANT (fix side gap) */
body {
    position: fixed;
    width: 100vw;
}
#loader {
    display: none;
    position: fixed;
    inset: 0;
    left:0px;
    right:0px;
    background:white;
    z-index: 9999;
    justify-content: center;
    align-items: center;
}

.loader-box {
    background: white;
    padding: 25px 30px;
    border-radius: 12px;
    text-align: center;
    animation: fadeIn 0.3s ease;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #ddd;
    border-top: 4px solid #6f3ba2;
    border-radius: 50%;
    margin: auto;
    animation: spin 1s linear infinite;
}

#dialog {
    display: none;
    position: fixed;
    inset: 0;
    
    width:100%;
    height:100%;
    justify-content:center;
    align-items:center;
    background: white;
    backdrop-filter: blur(6px);
    z-index: 9999;
    
}

/* MODAL */
.dialog-box {
    width: 360px;
    background: linear-gradient(135deg, #f8f6f6, #f8f6fc);
    border-radius: 20px;
    padding: 30px 25px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    animation: modalEnter 0.4s cubic-bezier(.25,.8,.25,1);
    position: relative;
}

/* ICON CIRCLE */
.success-circle {
    width: 70px;
    height: 70px;
    background: #6f3ba2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -60px auto 15px;
    box-shadow: 0 8px 20px rgba(111,59,162,0.4);
    animation: popIcon 0.5s ease;
}

.success-circle span {
    color: white;
    font-size: 32px;
    font-weight: bold;
}

/* TEXT */
.dialog-title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
}

.dialog-text {
    font-size: 14px;
    color: #666;
    margin: 10px 0 25px;
}

/* BUTTON */
.dialog-btn {
    background: linear-gradient(135deg, #6f3ba2, #8a4dd1);
    border: none;
    color: white;
    padding: 10px 30px;
    border-radius: 25px;
    font-size: 14px;
    cursor: pointer;
    transition: 0.3s ease;
    box-shadow: 0 5px 15px rgba(111,59,162,0.3);
}

.dialog-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(111,59,162,0.5);
}

/* ANIMATIONS */
@keyframes modalEnter {
    0% { transform: translateY(40px) scale(0.9); opacity: 0; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
}

@keyframes popIcon {
    0% { transform: scale(0); }
    80% { transform: scale(1.2); }
    100% { transform: scale(1); }
}
</style>
<script>
window.redirectUrl = "${redirectUrl}";
</script>
</head>

<body onload="showDialog()">

<!-- Loader -->
<div id="loader" style="display:flex;">
    <div class="loader-box">
        <div class="spinner"></div>
        <p style="margin-top:10px;">Saving your project...</p>
    </div>
</div>

<div id="dialog">
    <div class="dialog-box">

        <div class="success-circle">
            <span>✓</span>
        </div>

        <div class="dialog-title">Success!</div>
        <div class="dialog-text">
            Ticket has been created successfully.
        </div>

        <button class="dialog-btn" type="button" onclick="redirectPage()">
            Continue
        </button>

    </div>
</div>

<script>
function showDialog(){
    document.getElementById("loader").style.display = "none";
    document.getElementById("dialog").style.display = "flex";
}
    var selectedEmpId = "${selectedEmpId}";
console.log("Emp from URL:", selectedEmpId);
function redirectPage(){
    window.location.href = window.redirectUrl;
}
    document.addEventListener("DOMContentLoaded", function () {

    setTimeout(function () {

        var empId = selectedEmpId;

        var dropdown = document.querySelector("select[name='name']");

        if (dropdown && empId) {
            dropdown.value = empId;
        }

    }, 300);

});
</script>

</body>
</html>
`);
}
};

return { onRequest };

});