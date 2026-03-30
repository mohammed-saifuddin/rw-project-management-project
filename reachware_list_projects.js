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
    max-width: 1200px;
    margin: 0 auto;
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

</style>

<form method="POST">

<div class="main-container">

<div class="form-grid">

<label>Customer Name</label>
<input type="text" name="customername" required>

<label>Proforma Invoice</label>
<input type="text" name="invoice" required>

<label>Account Manager</label>
<select name="accountmanager" required>
${empOptions}
</select>

<label>Scheduled UAT Date</label>
<input type="date" name="uatdate" required>

<label>Project Manager</label>
<select name="projectmanager">
${empOptions}
</select>

<label>Scheduled Go Live Date</label>
<input type="date" name="golivedate" required>

<label>ERP</label>
<select name="erp" required>
<option value="">Select</option>
<option value="1">Netsuite</option>
<option value="2">Odoo</option>
<option value="3">Microsoft dynamics 365</option>
<option value="4">SAP</option>
</select>

<label>Direct Project</label>
<select name="directproject" id="directproject" required>
${dpOptions}
</select>

<label>Project Type</label>
<select name="projecttype">
<option value="">Select</option>
<option value="1">Implementation</option>
<option value="2">Support</option>

</select>

<label>Status</label>
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
<th style="width:15%;font-size:10px;">RW Product</th>
<th style="width:15%;font-size:10px;">Additional Comments</th>
<th style="width:15%;font-size:10px;">RW Project Manager</th>
<th style="width:15%;font-size:10px;">Functional Consultant</th>
<th style="width:15%;font-size:10px;">Technical Consultant</th>
<th style="width:14%;font-size:10px;">Expected UAT Date</th>
<th style="width:11%;font-size:10px;">Expected Go Live Date</th>
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

</div>

</form>
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
<script>
   document.title="New project"
    alert("Project created successfully!");
    window.location.href = "${projectListUrl}";
</script>
</head>
<body></body>
</html>
`);
}

};

return {onRequest};

});