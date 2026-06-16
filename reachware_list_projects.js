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
var subsidiaryOptions = '<option value="">--Select--</option>';

var subsidiarySearch = search.create({
    type: search.Type.SUBSIDIARY,
    filters: [
        ['isinactive','is','F']
    ],
    columns: [
        'internalid',
        'name'
    ]
});

subsidiarySearch.run().each(function(result){

    subsidiaryOptions +=
        '<option value="' + result.getValue('internalid') + '">' +
        result.getValue('name') +
        '</option>';

    return true;
});

var classOptions = '<option value="">--Select--</option>';

var classSearch = search.create({
    type: search.Type.CLASSIFICATION,
    filters: [
        ['isinactive','is','F']
    ],
    columns: [
        'internalid',
        'name'
    ]
});

classSearch.run().each(function(result){

    classOptions +=
        '<option value="' + result.getValue('internalid') + '">' +
        result.getValue('name') +
        '</option>';

    return true;
});


var statSearch = search.create({
    type: 'customlist_rw_portal_statuslist_line',
    columns: ['internalid','name']
});
var erpOptions = '<option value="">--Select--</option>';

var erpSearch = search.create({
    type: 'customrecord_rw_crm_support_category',
    columns: ['internalid', 'name']
});

erpSearch.run().each(function(res){

    erpOptions +=
        '<option value="' + res.getValue('internalid') + '">' +
        res.getValue('name') +
        '</option>';

    return true;
});
var projectOptions = '<option value="">--Select--</option>';
var project =search.create({
    type:'customrecordrw_portal_project_type_list',
    columns:['internalid','name']
})
project.run().each(function(res){

projectOptions +=
        '<option value="' + res.getValue('internalid') + '">' +
        res.getValue('name') +
        '</option>';

    return true;
});
var empId = context.request.parameters.empid;
var email = context.request.parameters.email;
var from = context.request.parameters.from || '';
var isFromHome = (from === 'home');
statSearch.run().each(function(result){

    var id = result.getValue('internalid');
    var name = result.getValue('name');

    var isSelected = (name === 'Not Started') ? 'selected' : '';


var isDisabled = (name !== 'Not Started') ? 'disabled' : '';

statOptions += '<option value="'+id+'" '+isSelected+' '+isDisabled+'>'+name+'</option>';

    

    return true;
});
var statOptions1 ='<option value="">--Select--</option>';
var statSearch1 = search.create({
    type: 'customlist_rw_portal_statuslist_header',
    filters:[
        ['isinactive','is','F']
    ],
    columns: ['internalid','name']
});

statSearch1.run().each(function(result){

    var id = result.getValue('internalid');
    var name = result.getValue('name');

     var isSelected = (name === 'Not Started') ? 'selected' : '';
var isDisabled = (name !== 'Not Started') ? 'disabled' : '';

statOptions1 += '<option value="'+id+'" '+isSelected+' '+isDisabled+'>'+name+'</option>';

    return true;
});
var rwSearch=search.create({
    type:'customrecord_rw_extend_products',
    columns:['internalid','name']
})
rwSearch.run().each(function(result){
    rwOptions +='<option value="'+result.getValue('internalid')+'">'+result.getValue('name')+'</option>';
    return true;
})
var customerOptions = '<option value="">--Select--</option>';

var customerData = [];

var customerSearch = search.create({

    type: search.Type.CUSTOMER,

    filters: [
        ['isinactive','is','F'],
        'AND',
        ['custentity_is_rw_customer','is','T']
    ],

    columns: [
        'internalid',
        'altname'
    ]
});

customerSearch.run().each(function(result){

    customerData.push({

        id:
            result.getValue('internalid'),

        name:
            result.getValue('altname') || ''
    });

    return true;
});

// SORT ALPHABETICALLY
customerData.sort(function(a,b){

    return a.name.localeCompare(b.name);
});

// BUILD DROPDOWN
customerData.forEach(function(customer){

    customerOptions += `

        <option value="${customer.id}"

            ${
                
                customer.id

                
            }>

            ${customer.name}

        </option>
    `;
});
var dpSearch = search.create({
    type: 'customrecord_rw_proj_rev_stream',
    columns: ['internalid','name']
});

dpSearch.run().each(function(result){
    dpOptions += '<option value="'+result.getValue('internalid')+'">'+result.getValue('name')+'</option>';
    return true;
});
// var empSearch = search.create({
//     type: 'employee',
//     filters: [
//         ['isinactive','is','F'],
//         //'AND',
//        // ['giveaccess','is','T']
//     ],
//     columns: ['internalid','firstname','lastname']
// });

// empSearch.run().each(function(result){

//     var id = result.getValue('internalid');
//     var firstname = result.getValue('firstname');
//     var lastname = result.getValue('lastname');

//     empOptions += '<option value="'+id+'">'+firstname+' '+lastname+'</option>';

//     return true;
// });

var uniqueEmployees = {};

var employeeData = [];

var empSearch = search.create({
    type: 'employee',
    filters: [
        ['isinactive','is','F']
    ],
    columns: [
        'internalid',
        'firstname',
        'lastname',
        'role'
    ]
});

empSearch.run().each(function(result){

   var id = result.getValue('internalid');

var firstname = result.getValue('firstname') || '';
var lastname = result.getValue('lastname') || '';

var fullName =
    (firstname + ' ' + lastname)
    .replace(/\s+/g,' ')
    .trim();

// ✅ avoid duplicate NAMES
var uniqueKey = fullName.toLowerCase();

if(uniqueEmployees[uniqueKey]){
    return true;
}

uniqueEmployees[uniqueKey] = true;
    employeeData.push({
        id: id,
        name: fullName,
        roleId: result.getValue('role'),
        roleName: result.getText('role')
    });

    return true;
});


// ✅ SORT ALPHABETICALLY
employeeData.sort(function(a,b){

    return a.name.localeCompare(b.name);

});


// ✅ BUILD DROPDOWNS
employeeData.forEach(function(emp){

    empOptions +=
        '<option value="' + emp.id + '">' +
        emp.name +
        '</option>';

});
var pmOptions = '<option value="">--Select--</option>';

var pmSearch = search.create({
    type: search.Type.EMPLOYEE,
    filters: [
        ['isinactive','is','F']
    ],
    columns: [
        'internalid',
        'firstname',
        'lastname',
        'custentity_rw_dms_designation'
    ]
});

pmSearch.run().each(function(result){

    var designationId = result.getValue({
        name: 'custentity_rw_dms_designation'
    });

    if (parseInt(designationId) !== 2) {
        return true;
    }

    var fullName =
        (result.getValue('firstname') || '') +
        ' ' +
        (result.getValue('lastname') || '');

    pmOptions +=
        '<option value="' +
        result.getValue('internalid') +
        '">' +
        fullName.trim() +
        '</option>';

    return true;
});


var amOptions = '<option value="">--Select--</option>';

var amSearch = search.create({
    type: search.Type.EMPLOYEE,
    filters: [
        ['isinactive','is','F']
    ],
    columns: [
        'internalid',
        'firstname',
        'lastname',
        'custentity_rw_dms_designation'
    ]
});

amSearch.run().each(function(result){

    var designationId = result.getValue({
        name: 'custentity_rw_dms_designation'
    });

    if (parseInt(designationId) !== 1) {
        return true;
    }

    var fullName =
        (result.getValue('firstname') || '') +
        ' ' +
        (result.getValue('lastname') || '');

    amOptions +=
        '<option value="' +
        result.getValue('internalid') +
        '">' +
        fullName.trim() +
        '</option>';

    return true;
});

var funcOptions = '<option value="">--Select--</option>';

var funcSearch = search.create({
    type: search.Type.EMPLOYEE,
    filters: [
        ['isinactive','is','F']
    ],
    columns: [
        'internalid',
        'firstname',
        'lastname',
        'custentity_rw_dms_designation'
    ]
});

funcSearch.run().each(function(result){

    var designationId = result.getValue({
        name: 'custentity_rw_dms_designation'
    });

    if (parseInt(designationId) !== 4) {
        return true;
    }

    var fullName =
        (result.getValue('firstname') || '') +
        ' ' +
        (result.getValue('lastname') || '');

    funcOptions +=
        '<option value="' +
        result.getValue('internalid') +
        '">' +
        fullName.trim() +
        '</option>';

    return true;
});

var techOptions = '<option value="">--Select--</option>';

var techSearch = search.create({
    type: search.Type.EMPLOYEE,
    filters: [
        ['isinactive','is','F']
    ],
    columns: [
        'internalid',
        'firstname',
        'lastname',
        'custentity_rw_dms_designation'
    ]
});

techSearch.run().each(function(result){

    var designationId = result.getValue({
        name: 'custentity_rw_dms_designation'
    });

    if (parseInt(designationId) !== 5) {
        return true;
    }

    var fullName =
        (result.getValue('firstname') || '') +
        ' ' +
        (result.getValue('lastname') || '');

    techOptions +=
        '<option value="' +
        result.getValue('internalid') +
        '">' +
        fullName.trim() +
        '</option>';

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
const projectUrl = url.resolveScript({
scriptId: 'customscript2876',
deploymentId: 'customdeploy5',
returnExternalUrl: true,
params: {
        empid: empId,
        email: email
    }
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
    if(roleName.includes('pm')) return 'PM';

    return 'OTHER';
}

function getEmployeeDetails(empId){

    if(!empId) return {};

    var empData = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empId,
        columns: [
            'subsidiary',
            'class'
        ]
    });

    return {

        subsidiary:
            (empData.subsidiary &&
             empData.subsidiary.length > 0)
            ? empData.subsidiary[0].value
            : '',

        class:
            (empData.class &&
             empData.class.length > 0)
            ? empData.class[0].value
            : ''
    };
}
var dmsRole = getEmployeeDMSRole(empInternalId);
var roleType = getRoleTypeFromDMS(dmsRole);

var employeeDetails =
    getEmployeeDetails(empInternalId);

var empSubsidiary =
    employeeDetails.subsidiary || '';

var empClass =
    employeeDetails.class || '';
log.debug("DMS ROLE", dmsRole);
log.debug("ROLE TYPE", roleType);
if(roleType === 'PMO'){
    tableHeader = `
        <tr>
            <th>Services/Products</th>
            <th>PMO Comments</th>
            <th>Status</th>
            

            ${isEdit ? `
                <th>Start Date</th>
                <th>End Date</th>
                <th>Updated Deadline</th>
                <th>Duration</th>
            ` : ``}

            <th></th>
        </tr>
    `;
} 
else if(roleType === 'PM'){
    tableHeader = `
        <tr>
            <th>Services/Products</th>
            <th>PMO Comments</th>
            <th>Project Manager</th>
            <th>Functional Consultant</th>
            <th>Technical Consultant</th>
            <th>Expected UAT Date</th>
            <th>Expected Go Live Date</th>
            <th>Status</th>
            <th>Start Date</th>
                <th>End Date</th>
                <th>Updated Deadline</th>
                
            <th></th>
        </tr>
    `;
}
else {
    tableHeader = `
        <tr>
            <th>Services/Products</th>
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
log.debug(isEdit)

    if(roleType === 'PMO'){
    rowHtml = `
    <tr class="row-hover">
        <td><select name="rwproduct[]">${rwOptions}</select></td>
        <td><input type="text" name="comments[]"></td>
        <td>
            <select name="linestatus[]">${statOptions}</select>
        </td>

        ${isEdit ? `
            
        <td> <input type="date" id="stdate" name="stdate[]"></td>
<td><input type="date" id="eddate" name="eddate[]"></td>
<td><input type="date" id="updateddeadline" name="updateddeadline[]"></td>
<td>
    <input type="text"
           name="durationline[]"
           class="durationline"
           readonly
           style="
                background:#f5f5f5;
                cursor:not-allowed;
           ">
</td>

        ` : ``}

        <td style="text-align:center;width:20px;"><button type="button" class="revBtn" onclick="removeRow(this)">❌</button></td>
    </tr>
    `;

}
else if(roleType === 'PM'){
    rowHtml = `
    <tr class="row-hover">
       <td><select name="rwproduct[]">${rwOptions}</select></td>
        <td><input type="text" name="comments[]"></td>
        <td><select name="rwpm[]" class="linePM">${pmOptions}</select></td>
        <td><select name="functional[]" class="lineFunctional">${funcOptions}</select></td>
        <td><select name="technical[]" class="lineTechnical">${techOptions}</select></td>
        <td><input type="date" name="expuat[]"></td>
        <td><input type="date" name="expgolive[]"></td>
        <td><select name="linestatus[]">${statOptions}</select></td>
         <td> <input type="date" id="stdate" name="stdate[]"></td>
<td><input type="date" id="eddate" name="eddate[]"></td>
<td><input type="date" id="updateddeadline" name="updateddeadline[]"></td>
        <td style="text-align:center;width:20px;"><button type="button" class="revBtn" onclick="removeRow(this)">❌</button></td>

        
       
       

        
    </tr>
    `;
 
}
else {
    rowHtml = `
    <tr class="row-hover">
        <td><select name="rwproduct[]">${rwOptions}</select></td>
        <td><input type="text" name="comments[]"></td>
        <td><select name="rwpm[]" class="linePM">${pmOptions}</select></td>
        <td><select name="functional[]" class="lineFunctional">${funcOptions}</select></td>
        <td><select name="technical[]" class="lineTechnical">${techOptions}</select></td>
        <td><input type="date" name="expuat[]"></td>
        <td><input type="date" name="expgolive[]"></td>
        <td><select name="linestatus[]">${statOptions}</select></td>
        
        <td style="text-align:center;width:20px;"><button type="button" class="revBtn" onclick="removeRow(this)">❌</button></td>
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
    .row-hover:hover{
background:#F8F8FF !important;
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
         background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
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
.section-card{

    background:#fff;

    border:1px solid #E5E7EB;

    border-radius:14px;

    padding:20px;

    margin-bottom:25px;

    box-shadow:
        0 4px 14px rgba(0,0,0,0.05);
}

.section-title{

    font-size:16px;

    font-weight:700;

    color:#5b2d8e;

    margin-bottom:18px;

    padding-bottom:10px;

    border-bottom:1px solid #E5E7EB;

    text-transform:uppercase;

    letter-spacing:0.5px;
}
.form-grid{

    display:grid;

    grid-template-columns:
        180px 280px
        180px 280px;

    column-gap:30px;

    row-gap:18px;

    align-items:center;
}

.form-grid label{
font-weight:600;
margin-right:24px;
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
  background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
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
    margin-top:10px;
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
          background:
linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);
    color: darkblue;
    padding: 10px;
    border: 1px solid #ccc;
    text-transform: uppercase;
    font-family: sans-serif;
}


.product-table td {
    border: 1px solid #ccc;
    padding: 6px;
    vertical-align: middle;
    overflow: hidden;   
}


/* APPLY ONLY FOR LINE ITEMS */

.product-table input,
.product-table select{

    width:100%;
    height:38px;

    padding:0 12px;

    border:1px solid transparent;

    border-radius:3px;

    background:transparent;

    font-size:13px;

    font-weight:500;

    color:#374151;

    outline:none;

    transition:all 0.35s ease;

    box-sizing:border-box;
}

/* INPUT PLACEHOLDER */

.product-table input::placeholder{

    color:#9CA3AF;
}

/* INPUT HOVER */

.product-table input:hover,
.product-table select:hover{

    background:white;

    border-color:#C084FC;

    box-shadow:
        0 8px 20px rgba(168,85,247,0.15);

    transform:translateY(-2px);
}

/* INPUT FOCUS */

.product-table input:focus,
.product-table select:focus{

    background:white;

    border-color:#8B5CF6;

    box-shadow:
        0 0 0 4px rgba(139,92,246,0.15),
        0 10px 25px rgba(168,85,247,0.18);

    transform:translateY(-2px);
}

/* MODERN SELECT */

.product-table select{

    cursor:pointer;

    appearance:none;
    -webkit-appearance:none;
    -moz-appearance:none;

    padding-right:35px;

    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='%238B5CF6' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 5.5l6 6 6-6' stroke='%238B5CF6' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");

    background-repeat:no-repeat;

    background-position:right 12px center;
}
.product-table select {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.savebtn{
margin-top:20px;
padding:10px 20px;
 background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
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
    border-top: 4px solid #8f50df;
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
    background: linear-gradient(135deg, #8E2DE2, #C471ED);
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
    background: linear-gradient(135deg, #8f50df, #8a4dd1);
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
    .revBtn{
font-size:14px;
cursor:pointer;
color:#3c5c8a;
margin-bottom:10px;
background:none;
border:none;
display:flex;
justify-content:center;
margin-left:30px;
align-item:center;

padding:0;
}
.revBtn:hover{
color:#8f50df;
text-shadow:0 0 5px #8f50df;
text-decoration: none;
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
color:#8f50df;
text-shadow:0 0 5px #8f50df;
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
color:#8f50df;
text-shadow:0 0 5px #8f50df;
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
    input[type="date"]{
    font-family:Arial;
}
    label{
    font-family:sans-serif;
    text-transform:uppercase;
}
    /* MODERN INPUTS */

.form-grid input,
.form-grid select,
.product-table input,
.product-table select{

    width:300px;
    height:33px;

    padding:0 10px;
    margin-left:20px;

    border:1px solid #E5E7EB;

    

    background:#FFFFFF;

    font-size:14px;

    font-weight:500;

    color:#374151;

    outline:none;

    transition:all 0.3s ease;

    box-sizing:border-box;

    box-shadow:
        0 2px 6px rgba(0,0,0,0.04);
}

/* PLACEHOLDER */

.form-grid input::placeholder{
    color:#9CA3AF;
}

/* HOVER EFFECT */

.form-grid input:hover,
.form-grid select:hover,
.product-table input:hover,
.product-table select:hover{

    border-color:#C084FC;

    box-shadow:
        0 4px 12px rgba(168,85,247,0.12);
}

/* FOCUS EFFECT */

.form-grid input:focus,
.form-grid select:focus,
.product-table input:focus,
.product-table select:focus{

    border-color:#8B5CF6;

    box-shadow:
        0 0 0 4px rgba(139,92,246,0.15);

    transform:translateY(-1px);
}

/* DISABLED */

input:disabled,
select:disabled{

    background:#F3F4F6;

    cursor:not-allowed;

    opacity:0.8;
}
    th{
     background:
linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);
color:darkblue;
font-family:sans-serif;
font-weight:bold;
font-size:10px;
}
.portal-header{
    font-size:24px;
    font-weight:700;
    display:flex;
    align-items:center;
    justify-content:center;
    color:#333;
}
    .form-grid{

    display:grid;

    grid-template-columns:
        180px 300px
    180px 300px;

    justify-content:space-between;

    column-gap:70px;

    row-gap:16px;

    padding:0 60px;

    width:100%;

    box-sizing:border-box;

    align-items:center;
}

/* LABELS */
.form-grid label{

    width:180px;

    margin:0;

    padding:0;

    font-weight:600;

    text-align:left;
}

/* INPUTS + SELECTS */
.form-grid input,
.form-grid select{

    width:100%;

    height:36px;

    margin:0;

    padding:0 12px;

    box-sizing:border-box;
}
</style>
<h1 class="portal-header">Create New Project</h1>
<form method="POST">
<input type="hidden" name="empid" value="${empId}">
<input type="hidden" name="email" value="${email}">

<div class="main-container">

<div id="toast" class="toast"></div>
<div class="section-card">

<div class="section-title">
    Project Information
</div>

<div class="form-grid">
<label class="required">Project Type</label>
<select name="projecttype">
${projectOptions}

</select>

<label class="required">Customer Name</label>

<div class="customer-wrapper">
    
    <select name="customername" id="customerDropdown" required>
        ${customerOptions}
    </select>

    <button type="button" class="add-customer-btn" onclick="createCustomer()">➕</button>

</div>

<label>Subsidiary</label>
<select name="subsidiary" id="subsidiary">

${subsidiaryOptions.replace(
    'value="' + empSubsidiary + '"',
    'value="' + empSubsidiary + '" selected'
)}

</select>

<label>Class</label>
<select name="class" id="class" required>

${classOptions.replace(
    'value="' + empClass + '"',
    'value="' + empClass + '" selected'
)}

</select>

<label class="required">Revenue Stream</label>
<select name="directproject" id="directproject" required>
${dpOptions}
</select>
<label>Proforma Invoice</label>

        <input type="file" id="attachment" name="invoice" >
<input type="hidden" name="fileId" id="fileId">

<label class="required">Project Manager</label>
<select name="projectmanager" id="headerPM">
${pmOptions}
</select>

<label>Performa Invoice Date</label>
<input type="date" name="invoicedate" id="invoicedate" required>


<label class="required">Account Manager</label>
<select name="accountmanager" id="accountmanager" required>
${amOptions}
</select>

<label>Start Date</label>
<input type="date" name="startdate" id="startdate" required>


<label class="required">Product/Services</label>
<select name="erp" required>
${erpOptions}
</select>
<label >End Date</label>
<input type="date" name="enddate" id="enddate" required>

</div>
</div>

<div class="section-card">

<div class="section-title">
    Consultant & Timeline Information
</div>

<div class="form-grid">
${isEdit ? `
<label>Updated End Date</label>
<input type="date"
       name="updatedenddate"
       id="updatedenddate">
` : ``}

<label>PMO Comments</label>
<input type="type" name="pmocomments" id="pmocomments">




<label class="required">Tentative Go Live Date</label>
<input type="date" name="golivedate" id="golivedate" required>




<label>Technical Consultant</label>
<select name="technical1" id="technical1" required>
${techOptions}
</select>

<label>Project Duration</label>
<input type="type" name="duration" id="duration">

<label>Functional Consultant</label>
<select name="functional1" id="functional1" required id="headerFunc">
${funcOptions}
</select>


<label>Status</label>
<select name="status" required>
${statOptions1}
</select>


</div>
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
<input type="hidden"
       name="customertext"
       id="customertext">
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
            <button type="button"
        id="saveCustomerBtn"
        onclick="saveCustomer()" 
        style="padding:8px 15px;  background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);; color:white; border:none; border-radius:5px;">
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

    // apply min date to all fields EXCEPT invoice date

    var today = new Date();

    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2,'0');
    var dd = String(today.getDate()).padStart(2,'0');

    var minDate = yyyy + '-' + mm + '-' + dd;

    document.querySelectorAll('input[type="date"]').forEach(function(field){

        // allow previous dates for Performa Invoice Date
        if(field.id === 'invoicedate'){
            field.removeAttribute('min');
        }
           else if(field.id === 'startdate'){
            field.removeAttribute('min');
        }
        else{
            field.setAttribute('min', minDate);
        }

    });

});

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

// document.addEventListener("DOMContentLoaded", function(){

//     var projectManager =
//         document.getElementById("headerPM");

//     var accountManager =
//         document.getElementById("accountmanager");

//     projectManager.addEventListener("change", function(){

//         accountManager.value =
//             projectManager.value;

//     });

// });
function formatDateForInput(dateObj){

    let day = String(dateObj.getDate()).padStart(2,'0');
    let month = String(dateObj.getMonth()+1).padStart(2,'0');
    let year = dateObj.getFullYear();

    return year + '-' + month + '-' + day;
}
    document.getElementById("startdate").value =
    formatDateForInput(new Date());

    var goliveField =
    document.getElementById("golivedate");

var endDateField =
    document.getElementById("enddate");

endDateField.addEventListener(
    "change",
    function(){

        goliveField.value=endDateField.value;
    }
);
function saveCustomer(){

    var btn =
        document.getElementById(
            "saveCustomerBtn"
        );

    // prevent multiple clicks
    if(btn.disabled){
        return;
    }

    var name =
        document.getElementById(
            "newCustomerName"
        ).value.trim();

    if(!name){

        showToast(
            "Please enter customer name"
        );

        return;
    }

    // disable button
    btn.disabled = true;
    btn.innerText = "Creating...";

    // show loader
    document.getElementById(
        "loader"
    ).style.display = "flex";

    fetch(window.location.href, {

        method: "POST",

        headers: {
            "Content-Type":
                "application/x-www-form-urlencoded"
        },

        body:
            "action=createCustomer&customername="
            + encodeURIComponent(name)

    })

    .then(res => res.json())

    .then(data => {

        // hide loader
        document.getElementById(
            "loader"
        ).style.display = "none";

        // enable again
        btn.disabled = false;
        btn.innerText = "Save";

        if(data.success){

            var dropdown =
                document.getElementById(
                    "customerDropdown"
                );

            var option =
                document.createElement("option");

            option.value = data.id;
            option.text = data.name;

            dropdown.appendChild(option);

            dropdown.value = data.id;

            closeCustomerModal();

            document.getElementById(
                "newCustomerName"
            ).value = '';

            showToast(
                "Customer created successfully"
            );

        } else {

            showToast(
                data.message ||
                "Customer already exists"
            );
        }

    })

    .catch(err => {

        console.error(err);

        document.getElementById(
            "loader"
        ).style.display = "none";

        btn.disabled = false;
        btn.innerText = "Save";

        showToast(
            "Error creating customer"
        );
    });
}

document.addEventListener("DOMContentLoaded", function(){

    const startDate =
        document.getElementById("startdate");

    const endDate =
        document.getElementById("enddate");

    const updatedEndDate =
        document.getElementById("updatedenddate");

    const kickoffDate =
        document.getElementById("uatdate");

    const goliveDate =
        document.getElementById("golivedate");

    function validateMainDates(){

        var start = startDate.value;
        var end = endDate.value;
        var updated = updatedEndDate.value;

        var kickoff = kickoffDate.value;
        var golive = goliveDate.value;

        // START < END
        if(start && end){

            if(
                new Date(start) >
                new Date(end)
            ){

                alert(
                    "Start Date should be less than End Date"
                );

                endDate.value = '';

                return;
            }
        }

        // UPDATED > START
        if(start && updated){

            if(
                new Date(updated) <
                new Date(start)
            ){

                alert(
                    "Updated End Date should be greater than Start Date"
                );

                updatedEndDate.value = '';

                return;
            }
        }

        // UPDATED > END
        if(end && updated){

            if(
                new Date(updated) <
                new Date(end)
            ){

                alert(
                    "Updated End Date should be greater than End Date"
                );

                updatedEndDate.value = '';

                return;
            }
        }

        // KICKOFF < GO LIVE
        if(kickoff && golive){

            if(
                new Date(kickoff) >
                new Date(golive)
            ){

                alert(
                    "Kickoff Date should be less than Scheduled Go Live Date"
                );

                goliveDate.value = '';

                return;
            }
        }
    }

    startDate.addEventListener(
        "input",
        validateMainDates
    );

    endDate.addEventListener(
        "input",
        validateMainDates
    );

    updatedEndDate.addEventListener(
        "input",
        validateMainDates
    );

    kickoffDate.addEventListener(
        "input",
        validateMainDates
    );

    goliveDate.addEventListener(
        "input",
        validateMainDates
    );

});

document.addEventListener('input', function(e){

    var row = e.target.closest('tr');

    if(!row) return;

    var startField =
        row.querySelector('[name="stdate[]"]');

    var endField =
        row.querySelector('[name="eddate[]"]');

    var updatedField =
        row.querySelector('[name="updateddeadline[]"]');

    var uatField =
        row.querySelector('[name="expuat[]"]');

    var goliveField =
        row.querySelector('[name="expgolive[]"]');

    var start = startField?.value || '';
    var end = endField?.value || '';
    var updated = updatedField?.value || '';
    var uat = uatField?.value || '';
    var golive = goliveField?.value || '';

    // START < END
    if(start && end){

        if(
            new Date(start) >
            new Date(end)
        ){

            alert(
                'Start Date should be less than End Date'
            );

            endField.value = '';

            return;
        }
    }

    // UPDATED > START
    if(start && updated){

        if(
            new Date(updated) <
            new Date(start)
        ){

            alert(
                'Updated Deadline should be greater than Start Date'
            );

            updatedField.value = '';

            return;
        }
    }

    // UPDATED > END
    if(end && updated){

        if(
            new Date(updated) <
            new Date(end)
        ){

            alert(
                'Updated Deadline should be greater than End Date'
            );

            updatedField.value = '';

            return;
        }
    }

    // EXPECTED UAT < GO LIVE
    if(uat && golive){

        if(
            new Date(uat) >
            new Date(golive)
        ){

            alert(
                'Expected UAT Date should be less than Expected Go Live Date'
            );

            goliveField.value = '';

            return;
        }
    }

});


function createCustomer(){
    document.getElementById("customerModal").style.display = "flex";
}
function addRow() {
    var table = document.getElementById("lineItems");

    var newRow = ` + JSON.stringify(rowHtml) + `;

    table.insertAdjacentHTML("beforeend", newRow);

// 🔥 auto apply PM to new row
var headerPM = document.getElementById("headerPM").value;
var headerFunc = document.getElementById("functional1").value;
var headerTech = document.getElementById("technical1").value;
var lastRow = table.lastElementChild;
var pmField = lastRow.querySelector(".linePM");

if(pmField){
    pmField.value = headerPM;
}
    if(headerFunc){
        var funcField = lastRow.querySelector(".lineFunctional");
        if(funcField && !funcField.value){
            funcField.value = headerFunc;
        }
    }

    if(headerTech){
        var techField = lastRow.querySelector(".lineTechnical");
        if(techField && !techField.value){
            techField.value = headerTech;
        }
    }

// AUTO START/END DATE
var startDate =
    document.getElementById("startdate").value;

var endDate =
    document.getElementById("enddate").value;

var startField =
    lastRow.querySelector('[name="stdate[]"]');

var endField =
    lastRow.querySelector('[name="eddate[]"]');

if(startField){
    startField.value = startDate;
}

if(endField){
    endField.value = endDate;
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
var customerDropdown =
    document.getElementById("customerDropdown");

var customerText =
    customerDropdown.options[
        customerDropdown.selectedIndex
    ].text;

document.getElementById(
    "customertext"
).value = customerText;
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
    
    window.location.replace(window.redirectUrl);
    
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

document.addEventListener("DOMContentLoaded", function(){

    var headerFunc =
        document.getElementById("functional1");

    function syncFunctional(){

        var selectedFunctional =
            headerFunc.value;

        document
            .querySelectorAll(".lineFunctional")
            .forEach(function(select){

                // only empty rows
                if(!select.value){
                    select.value =
                        selectedFunctional;
                }

            });
    }

    // initial load
    syncFunctional();

    // when header changes
    headerFunc.addEventListener(
        "change",
        syncFunctional
    );

});
document.addEventListener("DOMContentLoaded", function(){

    var headerTech =
        document.getElementById("technical1");

    function syncTechnical(){

        var selectedTech =
            headerTech.value;

        document
            .querySelectorAll(".lineTechnical")
            .forEach(function(select){

                // only empty rows
                if(!select.value){
                    select.value =
                        selectedTech;
                }

            });
    }

    // initial load
    syncTechnical();

    // when header changes
    headerTech.addEventListener(
        "change",
        syncTechnical
    );

});
document.addEventListener("DOMContentLoaded", function(){

    var bodyStartDate =
        document.getElementById("startdate");

    var bodyEndDate =
        document.getElementById("enddate");

    function syncLineDates(){

        var startValue =
            bodyStartDate.value;

        var endValue =
            bodyEndDate.value;

        document
            .querySelectorAll('[name="stdate[]"]')
            .forEach(function(field){

                // only empty rows
                if(!field.value){
                    field.value = startValue;
                }

            });

        document
            .querySelectorAll('[name="eddate[]"]')
            .forEach(function(field){

                // only empty rows
                if(!field.value){
                    field.value = endValue;
                }

            });

    }

    // initial load
    syncLineDates();

    // when body dates change
    bodyStartDate.addEventListener(
        "change",
        syncLineDates
    );

    bodyEndDate.addEventListener(
        "change",
        syncLineDates
    );

});
document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("form");
    if(form){
        form.addEventListener("submit", function () {
            showLoader();
        });
    }
});
document.addEventListener("DOMContentLoaded", function(){

    var headerFunc =
        document.getElementById("functional1");

    headerFunc.addEventListener("change", function(){

        var selectedFunctional =
            this.value;

        document
            .querySelectorAll(".lineFunctional")
            .forEach(function(select){

                select.value =
                    selectedFunctional;

            });

    });

});
document.addEventListener("DOMContentLoaded", function(){

    var headerTech =
        document.getElementById("technical1");

    headerTech.addEventListener("change", function(){

        var selectedTechnical =
            this.value;

        document
            .querySelectorAll(".lineTechnical")
            .forEach(function(select){

                select.value =
                    selectedTechnical;

            });

    });

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
   var empId = req.parameters.empid || '';
var email = req.parameters.email || '';     

log.debug("Received File ID", fileId);
// 🔥 HANDLE CUSTOMER CREATION
if (req.parameters.action === "createCustomer") {

    var name = req.parameters.customername;

    var existingCustomer = search.create({

    type: search.Type.CUSTOMER,

    filters: [
        ['altname','is',name]
    ],

    columns: ['internalid']

}).run().getRange({
    start:0,
    end:1
});

if(existingCustomer.length > 0){

    context.response.setHeader({
        name:'Content-Type',
        value:'application/json'
    });

    context.response.write(JSON.stringify({
        success:false,
        message:'Customer already exists'
    }));

    return;
}

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
var customerText =
    req.parameters.customertext || '';

if(customername){

    var customerLookup = search.lookupFields({
        type: search.Type.CUSTOMER,
        id: customername,
        columns:['entityid']
    });

    customerText =
        customerLookup.entityid || '';
}
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
var functional1 =req.parameters.functional1;
var technical1=req.parameters.technical1;
var invoicedate =req.parameters.invoicedate;
var subsidiary = req.parameters.subsidiary;
var projectClass = req.parameters.class;
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

if(functional1){

    rec.setValue({
        fieldId:'custrecord_rw_portal_functional_consulta',
        value: parseInt(functional1)
    });

}
rec.setValue({
    fieldId:'custrecord_rw_portal_subsidiary',
    value: subsidiary
});
if(technical1){

    rec.setValue({
        fieldId:'custrecord_rw_portal_technical',
        value: parseInt(technical1)
    });

}

rec.setValue({
    fieldId:'custrecord_rw_portal_class',
    value: projectClass
});
rec.setValue({
fieldId:'custrecord_rw_portal_invoice_date',
value:new Date(invoicedate)
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

// =========================
// CREATE NOTIFICATION
// =========================


var parentId = rec.save();

// =========================
// CREATE NOTIFICATIONS
// =========================
function createNotification(empId, message, type, refId){

    if(!empId) return;
     
var notifRec = record.create({
        type:'customrecord2517'
    });

    // REQUIRED NAME FIELD
    notifRec.setValue({
        fieldId:'name',
        value: message
    });

    notifRec.setValue({
        fieldId:'custrecord_rw_notif_employee',
        value:empId
    });

    notifRec.setValue({
        fieldId:'custrecord_rw_notif_message',
        value:message
    });

    notifRec.setValue({
        fieldId:'custrecord_rw_notif_type',
        value:type
    });

    notifRec.setValue({
        fieldId:'custrecord_rw_notif_refid',
        value:refId || ''
    });

    notifRec.setValue({
        fieldId:'custrecord_rw_notif_read',
        value:false
    });

    notifRec.save();
     
    
}
createNotification(
    empId,
    'New Project Created  ',
    'PROJECT_CREATED',
    parentId
);
createNotification(
    projectmanager,
    'New Project Created',
    'PROJECT_CREATED',
    parentId
);

createNotification(
    accountmanager,
    'New Project Created',
    'PROJECT_CREATED',
    parentId
);

// if(functional1){
//     createNotification(
//         functional1,
//         'You are assigned as Functional Consultant',
//         'PROJECT_CREATED',
//         parentId
//     );
// }

// if(technical1){
//     createNotification(
//         technical1,
//         'You are assigned as Technical Consultant',
//         'PROJECT_CREATED',
//         parentId
//     );
// }
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
// =====================================
// SAVE CUSTOMER RELATIONSHIP RECORD
// =====================================

try {

    log.debug('CUSTOMER ID', customername);
    log.debug('ERP', erp);
    log.debug('PRODUCT', item.rwproduct);

    var mapRec = record.create({
        type: 'customrecord_rw_crm_support_hierarhy_map',
        isDynamic: true
    });

    
mapRec.setValue({
        fieldId: 'custrecord_rw_crm_support_hier_parent',
        value: parseInt(customername)
    });
    // ERP
    if(erp){
        mapRec.setValue({
            fieldId: 'custrecord_rw_crm_support_hier_category',
            value: parseInt(erp)
        });
    }
log.debug('PRODUCT VALUE', item.rwproduct);
log.debug('PRODUCT PARSED', parseInt(item.rwproduct));
    // PRODUCT
   try {

    mapRec.setText({
        fieldId: 'custrecord_rw_support_producr',
        text: search.lookupFields({
            type:'customrecord_rw_extend_products',
            id: parseInt(item.rwproduct),
            columns:['name']
        }).name
    });

} catch(e){

    log.error('PRODUCT FIELD ERROR', e);
}

    // PM
    if(item.rwpm){
        mapRec.setValue({
            fieldId: 'custrecord_rw_crm_support_hier_manager',
            value: parseInt(item.rwpm)
        });
    }

    // FUNCTIONAL
    if(item.functional){
        mapRec.setValue({
            fieldId: 'custrecord_rw_crm_support_hier_prim_rep',
            value: parseInt(item.functional)
        });
    }

    // TECHNICAL
    if(item.technical && item.technical !== ''){

    try {

        mapRec.setValue({
            fieldId: 'custrecord_rw_crm_support_hier_secnd_rep',
            value: parseInt(item.technical)
        });

    } catch(e){

        log.error('INVALID TECHNICAL CONSULTANT', item.technical);
    }
}

    // ENABLE SUPPORT
    mapRec.setValue({
        fieldId: 'custrecord_rw_crm_support_enable_upport',
        value: true
    });

    var mapId = mapRec.save({
        enableSourcing: true,
        ignoreMandatoryFields: true
    });

    log.debug('MAPPING SAVED', mapId);

} catch(e){

    log.error('MAPPING ERROR', e);
}
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
    border-top: 4px solid #8f50df;
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
    background: #8f50df;
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
    background: linear-gradient(135deg, #8f50df, #8a4dd1);
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
    sessionStorage.setItem(
    'refreshDashboard',
    'true'
);
function redirectPage(){
    window.location.href = window.redirectUrl;
}
    if(window.opener){

    window.opener.refreshNotifications();
}

if(window.parent){

    window.parent.refreshNotifications();
}
    window.dispatchEvent(
    new CustomEvent(
        'notificationUpdated'
    )
);
localStorage.setItem(

    'rw_notification_update',

    new Date().getTime()
);
</script>

</body>
</html>
`);
}

};

return {onRequest};

});