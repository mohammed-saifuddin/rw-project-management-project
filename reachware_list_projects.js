/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/search','N/url','N/runtime'], (serverWidget,record,search,url,runtime) => {

const onRequest = (context) => {

if(context.request.method === 'GET'){

var form = serverWidget.createForm({ title: ' ' });
var projectId = context.request.parameters.projectId;
var isEdit = !!projectId;   // true = edit, false = create
form.hideNavBar = true;
var empOptions = '<option value="">--Select--</option>';
var dpOptions = '<option value="">--Select--</option>';
var rwOptions ='<option value="">--Select--</option>';
var statOptions ='<option value="">--Select--</option>';
var statSearch = search.create({
    type: 'customlist_rw_portal_access_pjstlist',
    columns: ['internalid','name']
});

var empId = context.request.parameters.empid;
var email = context.request.parameters.email;
var from = context.request.parameters.from || '';
var isFromHome = (from === 'home');
statSearch.run().each(function(result){

    var id = result.getValue('internalid');
    var name = result.getValue('name');

    var isSelected = (name === 'To Do') ? 'selected' : '';


statOptions += '<option value="'+id+'" '+isSelected+'>'+name+'</option>';

    

    return true;
});
var statOptions1 ='<option value="">--Select--</option>';
var statSearch1 = search.create({
    type: 'customlist_rw_portal_statuslist',
    columns: ['internalid','name']
});

statSearch1.run().each(function(result){

    var id = result.getValue('internalid');
    var name = result.getValue('name');

     var isSelected = (name === 'To Do') ? 'selected' : '';
var isDisabled = (name !== 'To Do') ? 'disabled' : '';

statOptions1 += '<option value="'+id+'" '+isSelected+' '+isDisabled+'>'+name+'</option>';

    return true;
});
var rwSearch=search.create({
    type:'customlist2261',
    columns:['internalid','name']
})
rwSearch.run().each(function(result){
    rwOptions +='<option value="'+result.getValue('internalid')+'">'+result.getValue('name')+'</option>';
    return true;
})
var customerOptions = '<option value="">--Select--</option>';

var customerSearch = search.create({
    type: 'customer',
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
var dpSearch = search.create({
    type: 'customlist_rw_portal_directprojectlist',
    columns: ['internalid','name']
});

dpSearch.run().each(function(result){
    dpOptions += '<option value="'+result.getValue('internalid')+'">'+result.getValue('name')+'</option>';
    return true;
});
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

    empOptions += '<option value="'+id+'">'+firstname+' '+lastname+'</option>';

    return true;
});
var homeUrl = url.resolveScript({
                    scriptId:'customscript2874',
                    deploymentId:'customdeploy3',
                    returnExternalUrl:true,
                    params:{
        empid: empId,
        email: email
    }
                });

var loginUrl = url.resolveScript({
scriptId: 'customscript2872',
deploymentId: 'customdeploy1',
returnExternalUrl: true,

});
var html = form.addField({
    id: 'custpage_html',
    type: serverWidget.FieldType.INLINEHTML,
    label: ' '
});
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

    var empSearch = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empInternalId,
        columns: ['role']
    });

    // ✅ SAFE CHECK
    if (empSearch.role && empSearch.role.length > 0) {
        return empSearch.role[0].text || '';
    }

    return '';   // fallback
}
function getRoleType(roleName){
    roleName = roleName.toLowerCase();

    if(roleName.includes('pmo')) return 'PMO';
    if(roleName.includes('project manager')) return 'PM';
    if(roleName.includes('developer')) return 'DEV';

    return 'OTHER';
}


var empRole = getEmployeeRole(empInternalId);
log.debug("Employee Role", empRole);
var roleType = getRoleType(empRole);
var tableHeader = '';
function getEmployeeDMSRole(empId){

    if(!empId) return '';

    var emp = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empId,
        columns: ['custentityrw_dms_role']   // ✅ correct field
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
    if(roleName.includes('project manager')) return 'PM';

    return 'OTHER';
}
var dmsRole = getEmployeeDMSRole(empInternalId);
var roleType = getRoleTypeFromDMS(dmsRole);

log.debug("DMS ROLE", dmsRole);
log.debug("ROLE TYPE", roleType);
if(roleType === 'PMO'){
    tableHeader = `
        <tr>
            <th>RW Product</th>
            <th>PMO Comments</th>
            <th>Status</th>

            ${isEdit ? `
                <th>Start Date</th>
                <th>End Date</th>
                <th>Updated Deadline</th>
            ` : ``}

            <th></th>
        </tr>
    `;
} else {
    tableHeader = `
        <tr>
            <th>RW Product</th>
            <th>PMO Comments</th>
            <th>Project Manager</th>
            <th>Functional Consultant</th>
            <th>Technical Consultant</th>
            <th>Expected UAT Date</th>
            <th>Expected Go Live Date</th>
            <th>Status</th>
            <th></th>
        </tr>
    `;
}

var rowHtml = '';


    if(roleType === 'PMO'){
    rowHtml = `
    <tr>
        <td><select name="rwproduct[]">${rwOptions}</select></td>
        <td><input type="text" name="comments[]"></td>
        <td>
            <select name="linestatus[]">${statOptions1}</select>
        </td>

        ${isEdit ? `
        <td> <input type="date" id="stdate" name="stdate[]"></td>
<td><input type="date" id="eddate" name="eddate[]"></td>
<td><input type="date" id="updateddeadline" name="updateddeadline[]"></td>
        ` : ``}

        <td><button type="button" onclick="removeRow(this)">❌</button></td>
    </tr>
    `;

} else {
    rowHtml = `
    <tr>
        <td><select name="rwproduct[]">${rwOptions}</select></td>
        <td><input type="text" name="comments[]"></td>
        <td><select name="rwpm[]" class="linePM">${empOptions}</select></td>
        <td><select name="functional[]">${empOptions}</select></td>
        <td><select name="technical[]">${empOptions}</select></td>
        <td><input type="date" name="expuat[]"></td>
        <td><input type="date" name="expgolive[]"></td>
        <td><select name="linestatus[]">${statOptions1}</select></td>
        <td><button type="button" onclick="removeRow(this)">❌</button></td>
    </tr>
    `;
}
html.defaultValue = `

<style>

body{
margin:0 !important;
overflow-y:hidden !important;
width:100%;
}
/* FORCE FULL SCREEN OVERRIDE */
#customerModal{
    backdrop-filter: blur(4px);
    padding-left:-30px;
    padding-right:-10px;
}
html, body {
    width:100%;
    height:100%;
    margin: 0 !important;
    padding: 0 !important;
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
#div__body{
padding:0 !important;
margin:0 !important;
}
.backBtn{
            margin-top:20px;
            padding:10px 15px;
            background:#6f3ba2;
            color:white;
            border:none;
            border-radius:5px;
            display:flex;
            align-item:left;
            cursor:pointer;
        }
.header{
width:calc(100% + 40px);
margin-left:-20px;
margin-top:-20px;
}

.portal-header{
width:calc(100% + 40px);
margin-left:-20px;
margin-top:-20px;
}

.uir-page-title{
display:none !important;
}

.uir-page-main,
.uir-page-wrapper,
.uir-page-body{
border:none !important;
box-shadow:none !important;
background:white !important;
padding:0 !important;
}

.main-container{
font-family:Arial;
}

.form-grid{
display:grid;
grid-template-columns:200px 1fr 200px 1fr;
gap:10px;
align-items:center;
margin-bottom:25px;
}

.form-grid label{
font-weight:600;
}

.form-grid input,
.form-grid select{
width:100%;
padding:6px;
border:1px solid #ccc;
border-radius:3px;
}

.product-table{
width:100%;
border-collapse:collapse;
table-layout:fixed;
}

.product-table th{
background:#6f3ba2;
color:white;
padding:10px;
border:1px solid #ccc;
}

.product-table td{
border:1px solid #ccc;
padding:8px;
overflow:hidden;
}

.product-table input{
width:100%;
padding:6px;
overflow:hidden;
box-sizing: border-box;
border:1px solid #ccc;
}

#ns-sidebar,
.uir-left-nav,
.uir-page-sidebar {
    width: 0px !important;
    display: none !important;
}


.uir-page-container,
.uir-page-wrapper,
.uir-page-body,
.uir-page-main {
    margin-left: 0px !important;
    padding-left: 0px !important;
    left: 0px !important;
    width: 100% !important;
    max-width: 100% !important;
    transition: none !important;
}


body {
    overflow-x: hidden !important;
}


.main-container {
    width: 100%;
    max-width: 100%;
    margin: 0;
    margin-top:30px;
}


.form-grid {
    display: grid;
    grid-template-columns: 180px 1fr 180px 1fr;
    gap: 10px;
    width: 100%;
}
.product-table select {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.product-table {
    width: 100%;
    table-layout: fixed;
}
   
.product-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;   
    margin-top: 30px;
}


.product-table th {
    background: #6f3ba2;
    color: white;
    padding: 10px;
    border: 1px solid #ccc;
    font-size: 13px;
}


.product-table td {
    border: 1px solid #ccc;
    padding: 6px;
    vertical-align: middle;
    overflow: hidden;   
}


.product-table input,
.product-table select {
    width: 100%;
    box-sizing: border-box; 
    font-size: 12px;
}

.product-table select {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.savebtn{
margin-top:20px;
padding:10px 20px;
background:#6f3ba2;
color:white;
border:none;
cursor:pointer;
}
#loader {
    display: none;
    position: fixed;
    inset: 0;
    background: white;
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
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(6px);
    z-index: 10000;
    justify-content: center;
    align-items: center;
}

label.required::after {
    content: " *";
    color: red;
    font-weight: bold;
}
.dialog-box {
    width: 360px;
    background: linear-gradient(135deg, #ffffff, #f8f6fc);
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
    .customer-wrapper{
    display:flex;
    flex-direction:row;
    gap:8px;
    }
    .customer-wrapper {
    position: relative;
    width: 100%;
}

/* dropdown full width */
.customer-wrapper select {
    width: 100%;
    padding-right: 35px; /* space for + */
}

/* + button hidden by default */
.add-customer-btn {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
   
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: none;
    font-size: 14px;
}
.add-customer-btn {
    opacity: 0;
    transition: opacity 0.2s ease;
}

.customer-wrapper:hover .add-customer-btn {
    opacity: 1;
}
/* SHOW on hover */
.customer-wrapper:hover .add-customer-btn {
    display: block;
}
    .customer-wrapper:hover .add-customer-btn,
.customer-wrapper:focus-within .add-customer-btn {
    display: block;
}
    .addBtn{
font-size:20px;
cursor:pointer;
color:#3c5c8a;

background:none;
border:none;
display:flex;
align-item:left;
padding:0;
}
.addBtn:hover{
color:#6f3ba2;
text-shadow:0 0 5px #6f3ba2;
text-decoration: none;

}
.remBtn{
font-size:12px;
cursor:pointer;
color:#3c5c8a;

background:none;
border:none;
display:flex;
justify-content:center;
align-item:center;
padding:0;
}
.btnRem:hover{
color:#6f3ba2;
text-shadow:0 0 5px #6f3ba2;
text-decoration: none;
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
#customerModal{
    display:none;
    position:fixed;

    top:0;
    left:0;
    width:100%;
    height:100%;

    background:rgba(0,0,0,0.6);

    z-index:99999;

   
    justify-content:center;
    align-items:center;

    padding:0;     /* remove gaps */
    margin:0;
}
</style>

<form method="POST">

<div class="main-container">
<div id="toast" class="toast"></div>
<div class="form-grid">

<label class="required">Customer Name</label>

<div class="customer-wrapper">
    
    <select name="customername" id="customerDropdown" required>
        ${customerOptions}
    </select>

    <button type="button" class="add-customer-btn" onclick="createCustomer()">➕</button>

</div>

<label class="required">Proforma Invoice</label>

        <input type="file" id="attachment" name="invoice" >
<input type="hidden" name="fileId" id="fileId">
<label class="required">Account Manager</label>
<select name="accountmanager" required>
${empOptions}
</select>

<label class="required">Kick of Date</label>
<input type="date" name="uatdate" required>

<label class="required">Project Manager</label>
<select name="projectmanager" id="headerPM">
${empOptions}
</select>

<label class="required">Scheduled Go Live Date</label>
<input type="date" name="golivedate" required>

<label class="required">ERP</label>
<select name="erp" required>
<option value="">--Select--</option>
<option value="1">Netsuite</option>
<option value="2">Odoo</option>
<option value="3">Microsoft dynamics 365</option>
<option value="4">SAP</option>
</select>

<label class="required">Direct Project</label>
<select name="directproject" id="directproject" required>
${dpOptions}
</select>

<label class="required">Project Type</label>
<select name="projecttype">
<option value="">--Select--</option>
<option value="1">Implementation</option>
<option value="2">Support</option>

</select>

<label class="required">Status</label>
<select name="status" required>
${statOptions1}
</select>
<label class="required">Start Date</label>
<input type="date" name="startdate" id="startdate" required>
<label class="required">End Date</label>
<input type="date" name="enddate" id="enddate" required>
<label class="required">Updated end date</label>
<input type="date" name="updatedenddate" id="updatedenddate" required>
<label class="required">Duration</label>
<input type="type" name="duration" id="duration" required>
<label class="required">PMO Comments</label>
<input type="type" name="pmocomments" id="pmocomments" required>
</div>
<button type="button" onclick="addRow()" class="addBtn" style="margin-top:10px;">
➕ 
</button>

<table class="product-table">

<thead>
${tableHeader}
</thead>
<tbody id="lineItems">
${rowHtml}
</tbody>

</table>
<input type="hidden" name="lineitems" id="lineitems">

<button type="submit" class="savebtn" >Save</button>

<div id="loader">
    <div class="loader-box">
        <div class="spinner"></div>
        
    </div>
</div>
<div id="dialog">
    <div class="dialog-box">

        <div class="success-circle">
            <span>✓</span>
        </div>

        <div class="dialog-title">Success!</div>
        <div class="dialog-text">
            Your project has been created successfully.
        </div>

        <button class="dialog-btn" onclick="redirectPage()">
            Continue
        </button>

    </div>
</div>
</div>

</form>
<div id="customerModal" style="
    display:none;
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.5);
    justify-content:center;
    align-items:center;
    z-index:9999;
">

    <div style="
        background:white;
        padding:25px;
        border-radius:10px;
        width:300px;
        text-align:center;
    ">

        <h3 style="margin-bottom:15px;">Add New Customer</h3>

        <input type="text" id="newCustomerName" placeholder="Enter name"
            style="width:100%; padding:8px; margin-bottom:15px; border:1px solid #ccc; border-radius:5px;" />

        <div style="display:flex; gap:10px; justify-content:center;">
            <button type="button" onclick="saveCustomer()" 
                style="padding:8px 15px; background:#6f3ba2; color:white; border:none; border-radius:5px;">
                Save
            </button>

            <button onclick="closeCustomerModal()" 
                style="padding:8px 15px; background:#ccc; border:none; border-radius:5px;">
                Cancel
            </button>
        </div>

    </div>
</div>
<script>
function closeCustomerModal(){
    document.getElementById("customerModal").style.display = "none";
}
function showToast(message){

    var toast = document.getElementById("toast");
    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(function(){
        toast.classList.remove("show");
    }, 3000); // disappears after 3 sec
}
    document.addEventListener("DOMContentLoaded", function(){

    var startInput = document.getElementById("startdate");
    var endInput = document.getElementById("enddate");
    var durationInput = document.getElementById("duration");

    function calculateDuration(){

        var start = startInput.value;
        var end = endInput.value;

        if(start && end){

            var startDate = new Date(start);
            var endDate = new Date(end);

            var diffTime = endDate - startDate;

            if(diffTime >= 0){

                var days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                durationInput.value = days + " days";

            } else {
                durationInput.value = "Invalid";
            }
        }
    }

    startInput.addEventListener("change", calculateDuration);
    endInput.addEventListener("change", calculateDuration);

});
function saveCustomer(){

    var name = document.getElementById("newCustomerName").value;

    if(!name){
        alert("Please enter customer name");
        return;
    }

    // ✅ CLOSE MODAL
    document.getElementById("customerModal").style.display = "none";

    // ✅ SHOW LOADER
    document.getElementById("loader").style.display = "flex";

    fetch(window.location.href, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "action=createCustomer&customername=" + encodeURIComponent(name)
    })
    .then(res => res.json())
    .then(data => {

        if(data.success){

            // OPTIONAL: small delay for smooth UX
            document.getElementById("dialog").style.display = "flex";
document.querySelector(".dialog-title").innerText = "Customer Created!";
document.querySelector(".dialog-text").innerText = data.name + " added successfully.";
            setTimeout(function(){

                // ✅ REDIRECT TO SAME SUITELET (refresh page)
                window.location.href = window.location.href;

            }, 500);

        } else {

            // ❌ ERROR → hide loader + reopen modal
            document.getElementById("loader").style.display = "none";
            document.getElementById("customerModal").style.display = "flex";

            alert("Error creating customer");
        }
    })
    .catch(err => {

        document.getElementById("loader").style.display = "none";
        document.getElementById("customerModal").style.display = "flex";

        console.error(err);
        alert("Error creating customer");
    });
}
function createCustomer(){
    document.getElementById("customerModal").style.display = "flex";
}
function addRow() {
    var table = document.getElementById("lineItems");

    var newRow = ` + JSON.stringify(rowHtml) + `;

    table.insertAdjacentHTML("beforeend", newRow);

// 🔥 auto apply PM to new row
var headerPM = document.getElementById("headerPM").value;

var lastRow = table.lastElementChild;
var pmField = lastRow.querySelector(".linePM");

if(pmField){
    pmField.value = headerPM;
}
}
   var homeUrl = '${homeUrl}';
     function goBack(){

    var loader = document.getElementById("loader");
    loader.style.display = "block";   // ✅ show loader

    setTimeout(function(){
        window.parent.location.href = homeUrl;
    }, 300); // small delay for smooth UX
}
document.querySelector("form").addEventListener("submit", function () {

    var rows = document.querySelectorAll("#lineItems tr");
    var data = [];

    rows.forEach(function(row){

       var obj = {
    rwproduct: row.querySelector('[name="rwproduct[]"]')?.value || '',
    comments: row.querySelector('[name="comments[]"]')?.value || '',
    rwpm: row.querySelector('[name="rwpm[]"]')?.value || '',
    functional: row.querySelector('[name="functional[]"]')?.value || '',
    technical: row.querySelector('[name="technical[]"]')?.value || '',
    expuat: row.querySelector('[name="expuat[]"]')?.value || '',
    expgolive: row.querySelector('[name="expgolive[]"]')?.value || '',
    linestatus: row.querySelector('[name="linestatus[]"]')?.value || '',
    stdate: row.querySelector('[name="stdate[]"]')?.value || '',
    eddate: row.querySelector('[name="eddate[]"]')?.value || '',
    updateddeadline: row.querySelector('[name="updateddeadline[]"]')?.value || ''
};

        data.push(obj);
    });

    document.getElementById("lineitems").value = JSON.stringify(data);
});
function removeRow(btn) {
    var table = document.getElementById("lineItems");
    var rows = table.querySelectorAll("tr");

    if (rows.length <= 1) {
        showToast("At least one line item is required");
        return;
    }

    btn.closest("tr").remove();
}
function showLoader() {
    document.getElementById("loader").style.display = "flex";
}

function showDialog() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("dialog").style.display = "flex";
}

function redirectPage() {
    window.location.href = window.redirectUrl;
}
document.addEventListener("DOMContentLoaded", function(){

    var headerPM = document.getElementById("headerPM");

    function syncPM(){

        var selectedPM = headerPM.value;

        document.querySelectorAll(".linePM").forEach(function(select){
            select.value = selectedPM;
        });
    }

    // when header changes
    headerPM.addEventListener("change", syncPM);

});
document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("form");
    if(form){
        form.addEventListener("submit", function () {
            showLoader();
        });
    }
});
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

context.response.writePage(form);

}

/* POST METHOD → SAVE RECORD */

else{

var req = context.request;
var fileId = req.parameters.fileId;
        

log.debug("Received File ID", fileId);
// 🔥 HANDLE CUSTOMER CREATION
if (req.parameters.action === "createCustomer") {

    var name = req.parameters.customername;

    var customerRec = record.create({
        type: record.Type.CUSTOMER,
        isDynamic: true
    });

    // customerRec.setValue({ fieldId: 'entityid', value: name });
   customerRec.setValue({ fieldId: 'companyname', value: name });
customerRec.setValue({ fieldId: 'altname', value: name });
customerRec.setValue({ fieldId: 'subsidiary', value: 1 });

// ✅ IMPORTANT
customerRec.setValue({
    fieldId: 'custentity_rw_emp_port_access',
    value: true
});
customerRec.setValue({
    fieldId: 'custentity_is_rw_customer',
    value: true
});

    var id = customerRec.save();

    context.response.setHeader({
        name: 'Content-Type',
        value: 'application/json'
    });

    context.response.write(JSON.stringify({
        success: true,
        id: id,
        name: name
    }));

    return; // 🚨 MUST STOP HERE
}
var customername = req.parameters.customername;
var invoice = req.parameters.invoice;
var accountmanager = req.parameters.accountmanager;
var uatdate = req.parameters.uatdate;
var projectmanager = req.parameters.projectmanager;
var golivedate = req.parameters.golivedate;
var erp = req.parameters.erp;
var directproject = req.parameters.directproject;
var projecttype = req.parameters.projecttype;
var status = req.parameters.status;
var startdate=req.parameters.startdate;
var enddate=req.parameters.enddate;
var updatedenddate=req.parameters.updatedenddate;
var pmocomments=req.parameters.pmocomments;
var duration = '';

if(startdate && enddate){

    var start = new Date(startdate);
    var end = new Date(enddate);

    var diff = end - start;

    if(diff >= 0){
        var days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        duration = days; // store number OR string
    }
}
function normalizeArray(val) {
    if (!val) return [];

    if (Array.isArray(val)) return val;

    if (typeof val === 'string') {
        if (val.indexOf('\u0005') !== -1) {
            return val.split('\u0005'); // NetSuite delimiter
        }
        return [val];
    }

    return [];
}

var rwproduct = normalizeArray(req.parameters['rwproduct[]']);
var comments = normalizeArray(req.parameters['comments[]']);
var rwpm = normalizeArray(req.parameters['rwpm[]']);
var functional = normalizeArray(req.parameters['functional[]']);
var technical = normalizeArray(req.parameters['technical[]']);
var expuat = normalizeArray(req.parameters['expuat[]']);
var expgolive = normalizeArray(req.parameters['expgolive[]']);
var linestatus = normalizeArray(req.parameters['linestatus[]']);

var stdate = normalizeArray(req.parameters['stdate[]']);
var eddate = normalizeArray(req.parameters['eddate[]']);

var updateddeadline = normalizeArray(req.parameters['updateddeadline[]']);
/* Create a custom record */
log.debug('rwproduct raw', req.parameters['rwproduct[]']);
log.debug('rwpm raw', req.parameters['rwpm[]']);
log.debug('comments raw', req.parameters['comments[]']);
log.debug('functional raw', req.parameters['functional[]']);
log.debug('technical raw', req.parameters['technical[]']);
log.debug('expuat raw', req.parameters['expuat[]']);
log.debug('expgolive raw', req.parameters['expgolive[]']);




var rec = record.create({
type:'customrecord_rw_portal_access'
});

var rec1=record.create({
    type:'customrecord_rw_portal_access2'
})
rec.setValue({
fieldId:'custrecord_rw_portal_customername',
value:customername
});

// rec.setValue({
// fieldId:'custrecord_rw_portal_proformainvoice',
// value:invoice
// });

rec.setValue({
fieldId:'custrecord_rw_portal_accountmanager',
value:accountmanager
});

rec.setValue({
fieldId:'custrecord_rw_portal_projectmanager',
value:projectmanager
});

rec.setValue({
fieldId:'custrecord_rw_portal_status',
value:status
});
rec.setValue({
fieldId:'custrecord_rw_portal_pmocommnts',
value:pmocomments
});

rec.setValue({
fieldId:'custrecord_rw_portal_erp',
value:erp
});
// rec.setValue({
// fieldId:'custrecord_rw_portal_scheduleduatdate',
// value:uatdate
// });
if(uatdate){
rec.setValue({
fieldId:'custrecord_rw_portal_scheduleduatdate',
value:new Date(uatdate)
});
}
if(startdate){
rec.setValue({
fieldId:'custrecord_rw_portal_start_date',
value:new Date(startdate)
});
}
if(enddate){
rec.setValue({
fieldId:'custrecord_rw_portal_end_date',
value:new Date(enddate)
});
}
if(updatedenddate){
rec.setValue({
fieldId:'custrecord_rw_portal_updatedenddate',
value:new Date(updatedenddate)
});
}
// rec.setValue({
// fieldId:'custrecord_rw_portal_scheduledgolivedate',
// value:golivedate
// });
log.debug('Direct Project from UI', req.parameters.directproject);
if(golivedate){
rec.setValue({
fieldId:'custrecord_rw_portal_scheduledgolivedate',
value:new Date(golivedate)
});
}
rec.setValue({
fieldId:'custrecord_rw_portal_directproject',
value:directproject
});
rec.setValue({
fieldId:'custrecord_rw_portal_duration',
value:duration
});
rec.setValue({
fieldId:'custrecord_rw_portal_projecttype',
value:projecttype
});
     if (fileId) {
    rec.setValue({
        fieldId: 'custrecord_rw_portal_proformainvoice',
        value: fileId   
    });
}
var parentId = rec.save();
// Link customer to project (IMPORTANT)

/* Product details */
if (!Array.isArray(rwproduct)) {
    rwproduct = [rwproduct];
}
if (!Array.isArray(rwpm)) {
    rwpm = [rwpm];
}
if (!Array.isArray(functional)) {
    functional = [functional];
}
if (!Array.isArray(technical)) {
    technical = [technical];
}
if (!Array.isArray(comments)) {
    comments = [comments];
}
if (!Array.isArray(expuat)) {
    expuat = [expuat];
}
if (!Array.isArray(expgolive)) {
    expgolive = [expgolive];
}
if (!Array.isArray(linestatus)) {
    linestatus = [linestatus];
}
var lineItems = JSON.parse(req.parameters.lineitems || '[]');

for (var i = 0; i < lineItems.length; i++) {

    var item = lineItems[i];

    if (!item.rwproduct) continue;

    var lineDuration = 0;

if(item.stdate && item.eddate){

    var s = new Date(item.stdate);
    var e = new Date(item.eddate);

    var diff = e - s;

    if(diff >= 0){
        lineDuration = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
}
    var rec1 = record.create({
        type: 'customrecord_rw_portal_access2'
    });

    rec1.setValue({
        fieldId: 'custrecord1513',
        value: parentId
    });

    rec1.setValue({
        fieldId: 'custrecord_rw_portal_rwproduct',
        value: parseInt(item.rwproduct)
    });

    if (item.comments) {
        rec1.setValue({
            fieldId: 'custrecord_rw_portal_additionalcomments',
            value: item.comments
        });
    }

    if (item.rwpm) {
        rec1.setValue({
            fieldId: 'custrecord_rw_rwprojectmanager',
            value: parseInt(item.rwpm)
        });
    }
        if (item.functional) {
        rec1.setValue({
            fieldId: 'custrecord_rw_portal_funcconsultant',
            value: parseInt(item.functional)
        });
    }

    if (item.technical) {
        rec1.setValue({
            fieldId: 'custrecord_rw_portal_techconsultant',
            value: parseInt(item.technical)
        });
    }

    if (item.expuat) {
        rec1.setValue({
            fieldId: 'custrecord_rw_portal_lineexpecteduatdate',
            value: new Date(item.expuat)
        });
    }
     if (item.stdate) {
        rec1.setValue({
            fieldId: 'custrecord_rw_portal_startdateline',
            value: new Date(item.stdate)
        });
    }
    if (item.eddate) {
        rec1.setValue({
            fieldId: 'custrecord_rw_portal_enddateline',
            value: new Date(item.eddate)
        });
    }
   
    if (item.updateddeadline) {
        rec1.setValue({
            fieldId: 'custrecord_rw_portal_updateddeadline',
            value: new Date(item.updateddeadline)
        });
    }
    rec1.setValue({
        fieldId: 'custrecord_rw_portal_projstat',
        value: item.linestatus
    });
    if (item.expgolive) {
        rec1.setValue({
            fieldId: 'custrecord_rw_portal_lineexptgolivedate',
            value: new Date(item.expgolive)
        });
    }
rec1.setValue({
    fieldId: 'custrecord_rw_portal_durationline',  // your duration field
    value: lineDuration
});
    rec1.save();
}





var projectListUrl = url.resolveScript({
    scriptId: 'customscript2876',  
    deploymentId: 'customdeploy5',
    returnExternalUrl: true,
      
          params: {
        empid: empId,
        email: email,
        from: 'home'   // 🔥 IMPORTANT FIX
          
    }
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
    //background: rgba(0,0,0,0.4);
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
window.redirectUrl = "${projectListUrl}";
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
            Your project has been created successfully.
        </div>

        <button class="dialog-btn" onclick="redirectPage()">
            Continue
        </button>

    </div>
</div>

<script>
function showDialog(){
    document.getElementById("loader").style.display = "none";
    document.getElementById("dialog").style.display = "flex";
}
function redirectPage(){
    window.location.href = window.redirectUrl;
}
</script>

</body>
</html>
`);
}

};

return {onRequest};

});