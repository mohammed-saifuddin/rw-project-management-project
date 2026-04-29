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
values['custrecord_rw_portal_startdateline'] =
    line.startdate ? new Date(line.startdate + "T00:00:00") : null;

values['custrecord_rw_portal_enddateline'] =
    line.enddate ? new Date(line.enddate + "T00:00:00") : null;

values['custrecord_rw_portal_updateddeadline'] =
    line.updateddeadline ? new Date(line.updateddeadline + "T00:00:00") : null;
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
var statOptions1 ='<option value="">--Select--</option>';
var statSearch1 = search.create({
    type: 'customlist_rw_portal_statuslist',
    columns: ['internalid','name']
});

statSearch1.run().each(function(result){

    var id = result.getValue('internalid');
    var name = result.getValue('name');

     var isSelected = (name === 'To Do') ? 'selected' : '';


statOptions += '<option value="'+id+'" '+isSelected+'>'+name+'</option>';

    return true;
});
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
    if(roleName.includes('pm')) return 'PM';
    if(roleName.includes('developer')) return 'DEV';

    return 'OTHER';
}
log.debug("role type",roleType);
var roleType = getRoleType(empRole);
var tableHeader = '';
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
function getEmployeeDMSRole(empId){

    if(!empId) return '';

    var emp = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empId,
        columns: ['custentityrw_dms_role']   
    });

    log.debug("DMS ROLE RAW", emp);

    if(emp.custentityrw_dms_role && emp.custentityrw_dms_role.length > 0){
        return emp.custentityrw_dms_role[0].text;   // "RW PMO"
    }

    return '';
}
function getRoleTypeFromDMS(roleName){

    if(!roleName) return 'OTHER';

    roleName = roleName.toLowerCase();

    if(roleName.includes('pmo')) return 'PMO';
    if(roleName.includes('developer')) return 'DEV';
    if(roleName.includes('pm')) return 'PM';

    return 'OTHER';
}
var empInternalId = getEmployeeInternalId(email);
var dmsRole = getEmployeeDMSRole(empInternalId);
var roleType = getRoleTypeFromDMS(dmsRole);

log.debug("DMS ROLE", dmsRole);
log.debug("ROLE TYPE", roleType);
if(roleType === 'PMO'){
    tableHeader = `
        <tr style="background:#6f3ba2; color:white;">
            <th style="border:1px solid #ccc;padding:8px;">RW Product</th>
            <th style="border:1px solid #ccc;padding:8px;">Comments</th>
            <th style="border:1px solid #ccc;padding:8px;">Status</th>
            <th style="border:1px solid #ccc;padding:8px;">Start Date</th>
            <th style="border:1px solid #ccc;padding:8px;">End Date</th>
            <th style="border:1px solid #ccc;padding:8px;">Updated Deadline</th>
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
stdate=projectRec.getValue('custrecord_rw_portal_start_date');
eddate=projectRec.getValue('custrecord_rw_portal_end_date');
updatedenddate=projectRec.getValue('custrecord_rw_portal_updatedenddate');
pmoComments=projectRec.getValue('custrecord_rw_portal_pmocommnts')
  
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
    type: 'customlist_rw_portal_statuslist',
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
         var st = '';
var ed = '';
var upd = '';
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
if(stdate){
    st = format.format({
        value: stdate,
        type: format.Type.DATE
    });
}
if(eddate){
    ed = format.format({
        value: eddate,
        type: format.Type.DATE
    });
}
if(updatedenddate){
    upd = format.format({
        value: updatedenddate,
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
        'custrecord_rw_portal_projstat',
        'custrecord_rw_portal_updateddeadline',
        'custrecord_rw_portal_enddateline',
        'custrecord_rw_portal_startdateline'


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
var startdate=result.getValue('custrecord_rw_portal_startdateline');
var enddate=result.getValue('custrecord_rw_portal_enddateline');
var updateddeadline=result.getValue('custrecord_rw_portal_updateddeadline');
var statOptions1 = '<option value="">--Select--</option>';

statSearch.run().each(function(res){

    var id = res.getValue('internalid');
    var name = res.getValue('name');

    var selected = (id == linestatusId) ? 'selected' : '';

    statOptions1 += '<option value="'+id+'" '+selected+'>'+name+'</option>';

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
var start = '';
var end = '';
var updated = '';

if(uatRaw){
    uat = format.format({
        value: uatRaw,
        type: format.Type.DATE
    });
}
if(startdate){
    start = format.format({
        value: startdate,
        type: format.Type.DATE
    });
}
if(enddate){
    end = format.format({
        value: enddate,
        type: format.Type.DATE
    });
}
if(updateddeadline){
    updated = format.format({
        value: updateddeadline,
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
            ${statOptions1}
        </select>
    </td>
    <td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">${start}</span>
    <input class="edit-mode startdate" type="date" value="${toInputDate(startdate)}" style="display:none;" />
</td>
   <td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">${end}</span>
    <input class="edit-mode enddate" type="date" value="${toInputDate(enddate)}" style="display:none;" />
</td>
   <td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">${updated}</span>
    <input class="edit-mode updateddeadline" type="date" value="${toInputDate(updateddeadline)}" style="display:none;" />
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
/* Toast Notification */
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #e74c3c; /* red for warning */
    color: white;
    padding: 12px 18px;
    border-radius: 25px;
    font-size: 14px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
    z-index: 100000;
}

/* show state */
.toast.show {
    opacity: 1;
    transform: translateY(0);
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
 <div class="label">Start Date</div>
        <div class="value">${st}</div>
         <div class="label">Updated End Date</div>
        <div class="value">${upd}</div>
 <div class="label">End Date</div>
        <div class="value">${ed}</div>
         <div class="label">PMO comments</div>
        <div class="value">${pmoComments}</div>
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
<div class="toast" id="toast">
     Project Saved Successfully
</div>
<span id="saveBadge" style="display:none; color:green; margin-left:10px;">
    ✔ Saved
</span>
    <script>
    
   document.title="project details";
    var projectUrl = '${projectUrl}';
     function goBack(){

    var loader = document.getElementById("loader");
    loader.style.display = "block";   

    setTimeout(function(){
        

      if(window.parent && window.parent.openHome){
      window.parent.document.getElementById("loader").style.display = "none";
        window.parent.openHome();   // ✅ correct
    }

    }, 300); // small delay for smooth UX
}
    function formatDate(dateStr){
    if(!dateStr) return '';
    var d = new Date(dateStr);
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
}
    function showToast(message, color = "#28a745") {
    const toast = document.getElementById("toast");

    toast.innerText = message;
    toast.style.background = color;

   
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
    function updateCell(row, selector, value){
    var el = row.querySelector(selector);
    if(el){
        el.innerText = value;
    }
}
  function saveData(){

    var rows = document.querySelectorAll("tbody tr");
    var projectStatus = document.getElementById("projectStatus")?.value || '';
    var data = [];

    rows.forEach(function(row){

        var id = row.getAttribute("data-id");

        
        if(!id){
            console.log("Skipping row without ID");
            return;
        }

     
var functional = row.querySelector("select.edit-mode.functional")?.value;
var technical  = row.querySelector("select.edit-mode.technical")?.value;
var uat        = row.querySelector("input.edit-mode.uat")?.value;
var golive     = row.querySelector("input.edit-mode.golive")?.value;
var status     = row.querySelector("select.edit-mode.status")?.value;
var startdate = row.querySelector("input.edit-mode.startdate")?.value;
var enddate = row.querySelector("input.edit-mode.enddate")?.value;
var updateddeadline = row.querySelector("input.edit-mode.updateddeadline")?.value;
       

       data.push({
    id: id,
    functional: functional || '',
    technical: technical || '',
    uat: uat || '',
    golive: golive || '',
    status: status || '',
    startdate:startdate || '',
    enddate:enddate || '',
    updateddeadline:updateddeadline || '',
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
showToast("Project Saved Successfully ");
        // ✅ Update UI with new values
        document.querySelectorAll("tbody tr").forEach(function(row){

            var funcSel = row.querySelector("select.edit-mode.functional");
            var techSel = row.querySelector("select.edit-mode.technical");
            var uatInp  = row.querySelector("input.edit-mode.uat");
            var golInp  = row.querySelector("input.edit-mode.golive");
            var statSel = row.querySelector("select.edit-mode.status");
            var startInp = row.querySelector("input.edit-mode.startdate");
            var endInp = row.querySelector("input.edit-mode.enddate");
            var updInp = row.querySelector("input.edit-mode.updateddeadline");
            
            if(funcSel){
    var txt = funcSel.options[funcSel.selectedIndex]?.text || '';
    updateCell(row, "td:nth-child(4) .view-mode", txt);
}
if(startInp){
    updateCell(row, "td:nth-child(4) .view-mode", formatDate(startInp.value));
}
if(endInp){
    updateCell(row, "td:nth-child(5) .view-mode", formatDate(endInp.value));
}
if(updInp){
    updateCell(row, "td:nth-child(6) .view-mode", formatDate(updInp.value));
}
if(techSel){
    var txt = techSel.options[techSel.selectedIndex]?.text || '';
    updateCell(row, "td:nth-child(5) .view-mode", txt);
}

if(uatInp){
    updateCell(row, "td:nth-child(6) .view-mode", formatDate(uatInp.value));
}

if(golInp){
    updateCell(row, "td:nth-child(7) .view-mode", formatDate(golInp.value));
}

if(statSel){
    var txt = statSel.options[statSel.selectedIndex]?.text || '';

    // for PMO/DEV
    updateCell(row, "td:nth-child(3) .view-mode", txt);

    // for OTHER roles
    updateCell(row, "td:nth-child(8) .view-mode", txt);
}
var statusSelect = document.getElementById("projectStatus");

if(statusSelect){
    var selectedText = statusSelect.options[statusSelect.selectedIndex]?.text || '';
    document.querySelector("#projectStatus").previousElementSibling.innerText = selectedText;
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
document.getElementById("saveBadge").style.display = "inline";

setTimeout(()=>{
    document.getElementById("saveBadge").style.display = "none";
}, 2000);
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