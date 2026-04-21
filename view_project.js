/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/url','N/search','N/format','N/file','N/runtime'], (serverWidget, record, url, search,format,file,runtime) => {

const onRequest = (context) => {
   
if (context.request.method === 'POST') {
var projectStatus = context.request.parameters.projectStatus;
var projectId = context.request.parameters.projectId;
    var body;

    try {
        body = JSON.parse(context.request.body);
    } catch (e) {
        body = JSON.parse(context.request.parameters.data || "[]");
    }

    log.debug("FINAL BODY", body);

    log.debug(body);
    if (!body || body.length === 0) {
        context.response.write("No data received");
        return;
    }

    body.forEach(function(line){

        if(!line.id) return; // safety

        var values = {};

if(line.functional){
    values['custrecord_rw_portal_funcconsultant'] = line.functional;
}

if(line.technical){
    values['custrecord_rw_portal_techconsultant'] = line.technical;
}

values['custrecord_rw_portal_lineexpecteduatdate'] =
    line.uat ? new Date(line.uat + "T00:00:00") : null;

values['custrecord_rw_portal_lineexptgolivedate'] =
    line.golive ? new Date(line.golive + "T00:00:00") : null;

if(line.status){
    values['custrecord_rw_portal_projstat'] = line.status;
}
if(projectStatus && projectId){
    record.submitFields({
        type: 'customrecord_rw_portal_access',
        id: projectId,
        values: {
            custrecord_rw_portal_status: projectStatus
        }
    });
}
record.submitFields({
    type: 'customrecord_rw_portal_access2',
    id: line.id,
    values: values
});
    });

    context.response.write('success');
    return;
}
    var form = serverWidget.createForm({ title: ' ' });
var statOptions ='<option value="">--Select--</option>';
var statSearch = search.create({
    type: 'customlist_rw_portal_access_pjstlist',
    columns: ['internalid','name']
});
var request = context.request;
    var projectId = request.parameters.projectId;
 var email = context.request.parameters.email || '';
    var empId = context.request.parameters.empid 
         || context.request.parameters.empId 
         || context.request.parameters.employeeId 
         || '';
var empOptions = '<option value="">--Select--</option>';
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
var empInternalId = getEmployeeInternalId(email);
function getEmployeeRole(empInternalId){
    if(!empInternalId) return '';

    var empData = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empInternalId,
        columns: ['role']
    });

    if(empData.role && empData.role.length > 0){
        return empData.role[0].text;
    }

    return '';
}
var empRole = getEmployeeRole(empInternalId);
log.debug("Employee Role", empRole);
function getRoleType(roleName){
    roleName = roleName.toLowerCase();

    if(roleName.includes('pmo')) return 'PMO';
    if(roleName.includes('project manager')) return 'PM';
    if(roleName.includes('developer')) return 'DEV';

    return 'OTHER';
}

var roleType = getRoleType(empRole);
var tableHeader = '';

if(roleType === 'PMO'){
    tableHeader = `
        <tr style="background:#6f3ba2; color:white;">
            <th style="border:1px solid #ccc;padding:8px;">RW Product</th>
            <th style="border:1px solid #ccc;padding:8px;">Comments</th>
            <th style="border:1px solid #ccc;padding:8px;">Status</th>
        </tr>
    `;
} else {
    tableHeader = `
        <tr style="background:#6f3ba2; color:white;">
            <th style="border:1px solid #ccc;padding:8px;">RW Product</th>
            <th style="border:1px solid #ccc;padding:8px;">Comments</th>
            <th style="border:1px solid #ccc;padding:8px;">Project Manager</th>
            <th style="border:1px solid #ccc;padding:8px;">Functional consultant</th>
            <th style="border:1px solid #ccc;padding:8px;">Technical consultant</th>
            <th style="border:1px solid #ccc;padding:8px;">Expected UAT</th>
            <th style="border:1px solid #ccc;padding:8px;">Expected Go Live</th>
            <th style="border:1px solid #ccc;padding:8px;">Status</th>
        </tr>
    `;
}
    
    var customer = '';
    var status = '';
    var projectType = '';
    var directProject ='';
    var projectManager ='';
    var accountManager ='';
    var erp ='';
    var scheduledUatDate= '';
    var goliveDate ='';
    var performa='';
      var fileUrl = '';
      var projectManagerId='';
var fileName = '';

var empSearch = search.create({
    type: 'employee',
    filters: [
        ['isinactive','is','F']
    ],
    columns: ['internalid','firstname','lastname']
});

var funcDropdown = '<option value="">--Select--</option>';
var techDropdown = '<option value="">--Select--</option>';



const projectUrl = url.resolveScript({
scriptId: 'customscript2876',
deploymentId: 'customdeploy5',
returnExternalUrl: true,
params: {
        empid: empId,
        email: email
    }
});
 var currentUser = runtime.getCurrentUser();
var userId = currentUser.id;
    if(projectId){

        var projectRec = record.load({
            type: 'customrecord_rw_portal_access',
            id: projectId,
            isDynamic: false
        });

        customer = projectRec.getText('custrecord_rw_portal_customername') || '';
        status = projectRec.getText('custrecord_rw_portal_status') || '';
        projectType = projectRec.getText('custrecord_rw_portal_projecttype') || '';
        directProject = projectRec.getText('custrecord_rw_portal_directproject') || '';
        projectManager = projectRec.getText('custrecord_rw_portal_projectmanager') || '';
        accountManager = projectRec.getText('custrecord_rw_portal_accountmanager') || '';
        erp = projectRec.getText('custrecord_rw_portal_erp') || '';
        scheduledUatDate = projectRec.getValue('custrecord_rw_portal_scheduleduatdate') || '';
        goliveDate = projectRec.getValue('custrecord_rw_portal_scheduledgolivedate') || '';
        performa=projectRec.getValue('custrecord_rw_portal_proformainvoice');
  projectManagerId = projectRec.getValue('custrecord_rw_portal_projectmanager');

  
        var isProjectManager = (empId === projectManagerId);
        log.debug("user id is",userId);
        log.debug("emp id is ",empId)
        log.debug("project manger id is",projectManagerId)
        log.debug(isProjectManager);
        log.debug('pm is',projectManager)
        log.debug("ROLE", runtime.getCurrentUser().role);
log.debug("USER", runtime.getCurrentUser().id);
    if (performa) {
    try {
        var fileObj = file.load({
            id: performa
        });

        fileUrl = fileObj.url;
        fileName = fileObj.name;

    } catch (e) {
        log.error("File Load Error", e);
    }
}
var projectStatusOptions = '<option value="">--Select--</option>';

var projectStatusSearch = search.create({
    type: 'customlist_rw_portal_access_pjstlist',
    columns: ['internalid','name']
});

var projectStatusId = projectRec.getValue('custrecord_rw_portal_status');

projectStatusSearch.run().each(function(res){

    var id = res.getValue('internalid');
    var name = res.getValue('name');

    var selected = (id == projectStatusId) ? 'selected' : '';

    projectStatusOptions += '<option value="'+id+'" '+selected+'>'+name+'</option>';

    return true;
});
         var scheduled='';
         var golive='';
        if(scheduledUatDate){
    scheduled = format.format({
        value: scheduledUatDate,
        type: format.Type.DATE
    });
}
if(goliveDate){
    golive = format.format({
        value: goliveDate,
        type: format.Type.DATE
    });
}

function toInputDate(date){
    if(!date) return '';

    try {
        var d = new Date(date);

        // Fix timezone issue
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());

        return d.toISOString().split('T')[0];

    } catch(e){
        return '';
    }
}
   
var empRoleMap = {};

var lineItemsHtml = '';

var lineSearch = search.create({
    type: 'customrecord_rw_portal_access2',
    filters: [
        ['custrecord1513','anyof', projectId]
    ],
    columns: [
         search.createColumn({ name: 'internalid' }),
        'custrecord_rw_portal_rwproduct',
        'custrecord_rw_portal_additionalcomments',
        'custrecord_rw_rwprojectmanager',
        'custrecord_rw_portal_funcconsultant',
        'custrecord_rw_portal_techconsultant',
        'custrecord_rw_portal_lineexpecteduatdate',
        'custrecord_rw_portal_lineexptgolivedate',
        'custrecord_rw_portal_projstat'
    ]
});
function formatDate(date){
    if(!date) return '';
    var d = new Date(date);
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
}
lineSearch.run().each(function(result){

    var product = result.getText('custrecord_rw_portal_rwproduct') || '';
    var comments = result.getValue('custrecord_rw_portal_additionalcomments') || '';
    var pm = result.getText('custrecord_rw_rwprojectmanager') || '';
    var functional = result.getText('custrecord_rw_portal_funcconsultant') || '';
    var technical = result.getText('custrecord_rw_portal_techconsultant') || '';
    var functionalId = result.getValue('custrecord_rw_portal_funcconsultant');
var technicalId  = result.getValue('custrecord_rw_portal_techconsultant');

var functional   = result.getText('custrecord_rw_portal_funcconsultant');
var technical    = result.getText('custrecord_rw_portal_techconsultant');
   var uatRaw = result.getValue('custrecord_rw_portal_lineexpecteduatdate');
var goliveRaw = result.getValue('custrecord_rw_portal_lineexptgolivedate');
var linestatus = result.getText('custrecord_rw_portal_projstat'); // for display
var linestatusId = result.getValue('custrecord_rw_portal_projstat'); // for dropdown
statSearch.run().each(function(result){

    var id = result.getValue('internalid');
    var name = result.getValue('name');

    var isSelected = (name === 'To-Do') ? 'selected' : '';

    statOptions += '<option value="'+id+'" '+(id == linestatusId ? 'selected' : '')+'>'+name+'</option>';

    return true;
});
empSearch.run().each(function(emp){

    var id = emp.getValue('internalid');
    var name = emp.getValue('firstname') + ' ' + emp.getValue('lastname');

    funcDropdown += '<option value="'+id+'" '+(id == functionalId ? 'selected' : '')+'>'+name+'</option>';
    techDropdown += '<option value="'+id+'" '+(id == technicalId ? 'selected' : '')+'>'+name+'</option>';

    return true;
});
var uat = '';
var golive = '';
if(uatRaw){
    uat = format.format({
        value: uatRaw,
        type: format.Type.DATE
    });
}

if(goliveRaw){
    golive = format.format({
        value: goliveRaw,
        type: format.Type.DATE
    });
}
var lineId = result.id;   // 🔥 BEST WAY
 


 if(roleType === 'PMO'){
    lineItemsHtml += `
<tr data-id="${lineId}">
    <td style="border:1px solid #ccc;padding:8px;">${product}</td>
    <td style="border:1px solid #ccc;padding:8px;">${comments}</td>
    <td style="border:1px solid #ccc;padding:8px;">
        <span class="view-mode">${linestatus}</span>
        <select class="edit-mode status" style="display:none;">
            ${statOptions}
        </select>
    </td>
</tr>`;
}
else {
    lineItemsHtml += `
<tr data-id="${lineId}">
<td style="border:1px solid #ccc;padding:8px;">${product}</td>
<td style="border:1px solid #ccc;padding:8px;">${comments}</td>
<td style="border:1px solid #ccc;padding:8px;">${pm}</td>

<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">${functional}</span>
    <select class="edit-mode functional" style="display:none;">
       ${funcDropdown}
    </select>
</td>

<td style="border:1px solid #ccc; padding:8px;">
    <span class="view-mode">${technical}</span>
    <select class="edit-mode technical" style="display:none;">
       ${techDropdown}
    </select>
</td>

<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">${uat}</span>
    <input class="edit-mode uat" type="date" value="${toInputDate(uatRaw)}" style="display:none;" />
</td>

<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">${golive}</span>
    <input class="edit-mode golive" type="date" value="${toInputDate(goliveRaw)}" style="display:none;" />
</td>

<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">${linestatus}</span>
    <select class="edit-mode status" style="display:none;">
       ${statOptions}
    </select>
</td>
</tr>`;
}
    return true;
});
    }

    var htmlField = form.addField({
        id: 'custpage_html',
        type: serverWidget.FieldType.INLINEHTML,
        label: 'HTML'
    });

    htmlField.defaultValue = `
    <style>
        body{
            font-family: Arial;
            margin:0;
            padding:20px;
            height:100%;
            
        }
.form-grid {
    display: grid;
    grid-template-columns: 180px 1fr 180px 1fr;
    gap: 12px 20px;
    align-items: center;
}

.label {
    font-weight: bold;
}

.value {
    background: #f9f9f9;
    padding: 8px;
    border-radius: 5px;
}
        // .container{
        //     max-width:1000px;
            
        //     height:fit-content;
        //     margin:auto;
        //     background:white;
        //     padding:20px;
        //     border-radius:10px;
        //     box-shadow:0 0 10px rgba(0,0,0,0.1);
        // }

        .title{
            font-size:20px;
            font-weight:bold;
            margin-bottom:20px;
            text-align:center;
        }

        .row{
            display:flex;
            margin-bottom:15px;
        }

        .label{
            width:50%;
            font-weight:bold;
        }

        .value{
            width:100%;
            background:#f9f9f9;
            border:1px solid #f1f1;
            padding:8px;
            border-radius:5px;
        }

        .backBtn{
            margin-top:20px;
            padding:10px 15px;
            background:#6f3ba2;
            color:white;
            border:none;
            border-radius:5px;
            cursor:pointer;
        }
#loader{
    display:none;
    position:fixed;
    inset:0;
    background:rgba(255,255,255,0.8);
    z-index:9999;
    text-align:center;
}

.spinner{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    border:6px solid #f3f3f3;
    border-top:6px solid #6f3ba2;
    border-radius:50%;
    width:50px;
    height:50px;
    animation:spin 1s linear infinite;
}

@keyframes spin{
    0%{transform:translate(-50%,-50%) rotate(0deg);}
    100%{transform:translate(-50%,-50%) rotate(360deg);}
}

#loader p{
    position:absolute;
    top:60%;
    left:50%;
    transform:translateX(-50%);
    font-weight:bold;
    color:#6f3ba2;
}
    #editBtn{
    margin-top:20px;
            padding:10px 15px;
            background:#6f3ba2;
            color:white;
            border:none;
            border-radius:5px;
            cursor:pointer;
    }
        .backBtn:hover{
            background:#5a2d87;
        }
            #saveBtn{
             margin-top:20px;
            padding:10px 15px;
            background:#6f3ba2;
            color:white;
            border:none;
            border-radius:5px;
            cursor:pointer;
            }
    </style>

    <div class="container">
    <div class="title">Project Details</div>

    <div class="form-grid">

        <div class="label">Project ID</div>
        <div class="value">${projectId || ''}</div>

        <div class="label">Project Type</div>
        <div class="value">${projectType}</div>

        <div class="label">Customer</div>
        <div class="value">${customer}</div>
        <div class="label">Performa Invoice</div>
        <div class="value">
    ${fileUrl ? `<a href="${fileUrl}" target="_blank">${fileName}</a>` : 'No Attachment'}
</div>
        <div class="label">Status</div>
<div class="value">

    <span class="view-mode">${status}</span>

    <select id="projectStatus" class="edit-mode" style="display:none;">
        ${projectStatusOptions}
    </select>

</div>

        <div class="label">Direct Project</div>
        <div class="value">${directProject}</div>
        <div class="label">Project Manager</div>
        <div class="value">${projectManager}</div>
        <div class="label">Account Manager</div>
        <div class="value">${accountManager}</div>
        <div class="label">ERP</div>
        <div class="value">${erp}</div>
        <div class="label">Scheduled UAT Date</div>
        <div class="value">${scheduled}</div>
        <div class="label">Go-Live Date</div>
        <div class="value">${golive}</div>

    </div>


<table style="width:100%; border-collapse:collapse; margin-top:14px;">
  <thead>
    ${tableHeader}
</thead>
    <tbody>
        ${lineItemsHtml || '<tr><td colspan="7">No data found</td></tr>'}
    </tbody>
</table>
    <button class="backBtn" type="button" onclick="goBack()">⬅ Back</button>
    ${isProjectManager ? `
<button id="editBtn" type="button" >✏ Edit</button>
<button id="saveBtn" onclick="saveData()" style="display:none;" type="button">💾 Save</button>
` : ''}
</div>
<div id="loader">
    <div class="spinner"></div>
    <p>Loading projects...</p>
</div>
    <script>
    
   document.title="project details";
    var projectUrl = '${projectUrl}';
     function goBack(){

    var loader = document.getElementById("loader");
    loader.style.display = "block";   

    setTimeout(function(){
        window.parent.location.href = projectUrl;
    }, 300); // small delay for smooth UX
}
    function formatDate(dateStr){
    if(!dateStr) return '';
    var d = new Date(dateStr);
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
}
  function saveData(){

    var rows = document.querySelectorAll("tbody tr");
    var projectStatus = document.getElementById("projectStatus")?.value || '';
    var data = [];

    rows.forEach(function(row){

        var id = row.getAttribute("data-id");

        // 🔥 skip invalid rows
        if(!id){
            console.log("Skipping row without ID");
            return;
        }

     
var functional = row.querySelector("select.edit-mode.functional")?.value;
var technical  = row.querySelector("select.edit-mode.technical")?.value;
var uat        = row.querySelector("input.edit-mode.uat")?.value;
var golive     = row.querySelector("input.edit-mode.golive")?.value;
var status     = row.querySelector("select.edit-mode.status")?.value;
       

       data.push({
    id: id,
    functional: functional || '',
    technical: technical || '',
    uat: uat || '',
    golive: golive || '',
    status: status || ''
});
    });

    console.log("FINAL DATA SENT:", data); // 🔥 DEBUG

    if(data.length === 0){
        alert("No valid data to update");
        return;
    }

  fetch(window.location.href, {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "data=" + encodeURIComponent(JSON.stringify(data)) + 
          "&projectStatus=" + projectStatus
})
.then(res => res.text())
.then(res => {

    console.log("SERVER RESPONSE:", res);

    if(res === "success"){

        // ✅ Update UI with new values
        document.querySelectorAll("tbody tr").forEach(function(row){

            var funcSel = row.querySelector("select.edit-mode.functional");
            var techSel = row.querySelector("select.edit-mode.technical");
            var uatInp  = row.querySelector("input.edit-mode.uat");
            var golInp  = row.querySelector("input.edit-mode.golive");
            var statSel = row.querySelector("select.edit-mode.status");

            // 👉 Update view spans
            if(funcSel){
                var txt = funcSel.options[funcSel.selectedIndex]?.text || '';
                row.querySelector("td:nth-child(4) .view-mode").innerText = txt;
            }
var statusSelect = document.getElementById("projectStatus");

if(statusSelect){
    var selectedText = statusSelect.options[statusSelect.selectedIndex]?.text || '';
    document.querySelector("#projectStatus").previousElementSibling.innerText = selectedText;
}
            if(techSel){
                var txt = techSel.options[techSel.selectedIndex]?.text || '';
                row.querySelector("td:nth-child(5) .view-mode").innerText = txt;
            }

            if(uatInp){
                row.querySelector("td:nth-child(6) .view-mode").innerText = formatDate(uatInp.value);
            }

            if(golInp){
                row.querySelector("td:nth-child(7) .view-mode").innerText = formatDate(golInp.value);
            }

            if(statSel){
                var txt = statSel.options[statSel.selectedIndex]?.text || '';
                row.querySelector("td:nth-child(8) .view-mode").innerText = txt;
            }

        });

        // ✅ Switch back to view mode
        document.querySelectorAll(".edit-mode").forEach(el => el.style.display = "none");
        document.querySelectorAll(".view-mode").forEach(el => el.style.display = "inline");

        document.getElementById("saveBtn").style.display = "none";
        document.getElementById("editBtn").style.display = "inline";

    } else {
        alert("Error: " + res);
    }

});
}
function enableEdit(){

    document.querySelectorAll(".view-mode").forEach(function(el){
        el.style.display = "none";
    });

    document.querySelectorAll(".edit-mode").forEach(function(el){
        el.style.display = "inline-block";
    });

    document.getElementById("editBtn").style.display = "none";
    document.getElementById("saveBtn").style.display = "inline-block";
}
  document.addEventListener("DOMContentLoaded", function () {

    var editBtn = document.getElementById("editBtn");
    var saveBtn = document.getElementById("saveBtn");

    if(editBtn){
        editBtn.addEventListener("click", enableEdit);
    }

    if(saveBtn){
        saveBtn.addEventListener("click", saveData);
    }

});

    </script>
    `;

    context.response.writePage(form);
};

return { onRequest };

});