/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/search','N/url'], (serverWidget,record,search,url) => {

const onRequest = (context) => {

if(context.request.method === 'GET'){

var form = serverWidget.createForm({ title: ' ' });

form.hideNavBar = true;
var empOptions = '<option value="">Select</option>';
var dpOptions = '<option value="">Select</option>';
var rwOptions ='<option value="">Select</option>';
var rwSearch=search.create({
    type:'customlist2261',
    columns:['internalid','name']
})
rwSearch.run().each(function(result){
    rwOptions +='<option value="'+result.getValue('internalid')+'">'+result.getValue('name')+'</option>';
    return true;
})
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

var html = form.addField({
    id: 'custpage_html',
    type: serverWidget.FieldType.INLINEHTML,
    label: ' '
});

html.defaultValue = `

<style>

body{
margin:0 !important;
overflow-y:hidden !important;
width:100%;
}
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
#div__body{
padding:0 !important;
margin:0 !important;
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
    background: transparent;
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
</style>

<form method="POST">

<div class="main-container">

<div class="form-grid">

<label class="required">Customer Name</label>
<input type="text" name="customername" required>

<label class="required">Proforma Invoice</label>
<input type="text" name="invoice" required>

<label class="required">Account Manager</label>
<select name="accountmanager" required>
${empOptions}
</select>

<label class="required">Scheduled UAT Date</label>
<input type="date" name="uatdate" required>

<label class="required">Project Manager</label>
<select name="projectmanager">
${empOptions}
</select>

<label class="required">Scheduled Go Live Date</label>
<input type="date" name="golivedate" required>

<label class="required">ERP</label>
<select name="erp" required>
<option value="">Select</option>
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
<option value="">Select</option>
<option value="1">Implementation</option>
<option value="2">Support</option>

</select>

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

<table class="product-table">

<tr>
<th style="width:15%;font-size:10px;" class="required">RW Product</th>
<th style="width:15%;font-size:10px;" class="required">Additional Comments</th>
<th style="width:15%;font-size:10px;" class="required">RW Project Manager</th>
<th style="width:15%;font-size:10px;" class="required">Functional Consultant</th>
<th style="width:15%;font-size:10px;" class="required">Technical Consultant</th>
<th style="width:14%;font-size:10px;" class="required">Expected UAT Date</th>
<th style="width:11%;font-size:10px;" class="required">Expected Go Live Date</th>
</tr>

<tr>
<td>
<select name="rwproduct" required>
${rwOptions}
</select>
</td>
<td><input type="text" name="comments">
</td>
<td>
<select name="rwpm" required>
${empOptions}
</select>
</td>
<td>
<select name="functional" required>
${empOptions}
</select>
</td>
<td>
<select name="technical">
${empOptions}
</select>
</td>
<td><input type="date" name="expuat" required></td>
<td><input type="date" name="expgolive"></td>
</tr>

</table>

<button type="submit" class="savebtn">Save</button>
<div id="loader">
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
</div>

</form>
<script>
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

document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("form");
    if(form){
        form.addEventListener("submit", function () {
            showLoader();
        });
    }
});
</script>
`;

context.response.writePage(form);

}

/* POST METHOD → SAVE RECORD */

else{

var req = context.request;

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

var rwproduct = req.parameters.rwproduct;
var comments = req.parameters.comments;
var rwpm = req.parameters.rwpm;
var functional = req.parameters.functional;
var technical = req.parameters.technical;
var expuat = req.parameters.expuat;
var expgolive = req.parameters.expgolive;

/* Create a custom record */

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

rec.setValue({
fieldId:'custrecord_rw_portal_proformainvoice',
value:invoice
});

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
fieldId:'custrecord_rw_portal_projecttype',
value:projecttype
});
var parentId = rec.save();
/* Product details */
rec1.setValue({
fieldId:'custrecord1513',
value:parentId
});
rec1.setValue({
fieldId:'custrecord_rw_portal_rwproduct',
value:rwproduct
});

rec1.setValue({
fieldId:'custrecord_rw_portal_additionalcomments',
value:comments
});
rec1.setValue({
fieldId:'custrecord_rw_rwprojectmanager',
value:rwpm
});
rec1.setValue({
fieldId:'custrecord_rw_portal_funcconsultant',
value:functional
});

rec1.setValue({
fieldId:'custrecord_rw_portal_techconsultant',
value:technical
});

// rec1.setValue({
//     fieldId:'custrecord_rw_portal_lineexpecteduatdate',
//     value:expuat
// });
if(expuat){
rec1.setValue({
    fieldId:'custrecord_rw_portal_lineexpecteduatdate',
    value:new Date(expuat)
});
}
// rec1.setValue({
//     fieldId:'custrecord_rw_portal_lineexptgolivedate',
//     value:expgolive
// });
if(expgolive){
rec1.setValue({
    fieldId:'custrecord_rw_portal_lineexptgolivedate',
    value:new Date(expgolive)
});
}

rec1.save();
var projectListUrl = url.resolveScript({
    scriptId: 'customscript2876',  
    deploymentId: 'customdeploy5',
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