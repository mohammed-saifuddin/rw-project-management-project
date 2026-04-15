/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/search','N/format'], 
(serverWidget, record, search, format) => {

const onRequest = (context) => {

    if (context.request.method === 'GET') {

        var form = serverWidget.createForm({ title: ' ' });

        var htmlField = form.addField({
            id: 'custpage_html',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'HTML'
        });

        // ================= EMPLOYEE OPTIONS =================
        var empOptions = '<option value="">Select</option>';

        search.create({
            type: 'employee',
            filters: [['isinactive','is','F']],
            columns: ['internalid','firstname','lastname']
        }).run().each(function(res){
            empOptions += `<option 
    value="${res.getValue('internalid')}" 
    data-name="${res.getValue('firstname')} ${res.getValue('lastname')}">
    ${res.getValue('firstname')} ${res.getValue('lastname')}
</option>`;
            return true;
        });

        // ================= PROJECT OPTIONS =================
        var projectOptions = '<option value="">Select</option>';

        search.create({
            type: 'customlist_rw_ticket_projectnamelist',
            columns: ['internalid','name']
        }).run().each(function(res){
            projectOptions += `<option value="${res.getValue('internalid')}">
                ${res.getValue('name')}
            </option>`;
            return true;
        });

       htmlField.defaultValue = `

<style>
body {
    font-family: Arial;
    background:white;
}

html, body {
    overflow: hidden !important;   
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
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
    resize:both;
}
.attach{
height:30px;


}
/* Section Header */
.section {
    background: #6f3ba2;
    color: black;
    font-weight: bold;
    text-align: center;
    padding: 8px;
    margin-top: 10px;
}
/* Grid Layout */
.grid {
    display: grid;
    grid-template-columns: 150px 1fr 150px 1fr 150px 1fr;
    gap: 12px;
    padding: 10px;
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
/* Table */
table {
    width: 100%;
    border-collapse: collapse;
}

th {
    background: #6f3ba2;
    color: white;
    padding: 6px;
    text-align: left;
}

td {
    
    padding: 5px;
}

button {
    margin-top: 10px;
    padding: 8px 15px;
    background: #6f3ba2;
    border: none;
    cursor: pointer;
}
</style>

<form method="POST">

<!-- PRIMARY INFO -->
<div class="section">Primary Information</div>

<div class="grid">

<div class="label">Employee</div>
<select id="employeeSelect" name="employee">
    ${empOptions}
</select>

<div class="label">Employee ID</div>
<input name="empId" id="empId" readonly>

<div class="label">Employee Name</div>
<input name="empName" id="empName" readonly>

<div class="label">Assignee</div>
<input name="assignee" value="Aman">

<div class="label">Department</div>
<input name="department" value="Extend">

<div class="label">Subsidiary</div>
<input name="subsidiary">

<div class="label">Date</div>
<input type="date" name="date">

<div class="label">ERP Type</div>
<input name="erpType">

<div class="label">Project Type</div>
<select name="projectType">
    <option>Implementation</option>
    <option>Support</option>
</select>

<div class="label">Memo / Comments from Clients</div>
<input name="memo">

<div class="label">Total Projects</div>
<input name="totalProjects">

<div class="label">Total Hours</div>
<input name="totalHours">

<div class="label">Task Type</div>
<input name="taskType">

</div>


<!-- TIME ENTRY -->
<div class="section">Time Entry</div>

<table id="timeTable">
    <thead>
        <tr>
            <th>S.no</th>
            <th>Client Name</th>
            <th>Product</th>
            <th>Task</th>
            <th>Memo</th>
            <th>Time</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>

<button type="button" onclick="addRow()">+ Add Row</button>
<button type="submit">Submit</button>

</form>

<script>
let count = 1;

function addRow() {
    let tbody = document.querySelector("#timeTable tbody");

    let row = document.createElement("tr");

    row.innerHTML = \`
        <td>\${count++}</td>
        <td><input name="client"></td>
        <td><input name="product"></td>
        <td><input name="task"></td>
        <td><input name="memo"></td>
        <td><input type="number" name="time" oninput="calc()"></td>
    \`;

    tbody.appendChild(row);
}

function calc() {
    let total = 0;
    document.querySelectorAll("input[name='time']").forEach(el => {
        total += Number(el.value) || 0;
    });
    document.querySelector("input[name='totalHours']").value = total;
}
</script>
`;

        context.response.writePage(form);
    }

    // ================= POST =================
    else {

        var req = context.request;

        function convertDate(dateStr){
            if(!dateStr) return null;

            var parts = dateStr.split('-');
            return format.parse({
                value: parts[2]+'/'+parts[1]+'/'+parts[0],
                type: format.Type.DATE
            });
        }

        var rec = record.create({
            type: 'customrecord_task', // ⚠️ change to your record
            isDynamic: true
        });

        rec.setValue({ fieldId: 'custrecord_task_employee', value: req.parameters.employee });
        rec.setValue({ fieldId: 'custrecord_task_project', value: req.parameters.project });
        rec.setValue({ fieldId: 'custrecord_task_type', value: req.parameters.taskType });
        rec.setValue({ fieldId: 'custrecord_task_priority', value: req.parameters.priority });
        rec.setValue({ fieldId: 'custrecord_task_status', value: req.parameters.status });
        rec.setValue({ fieldId: 'custrecord_task_desc', value: req.parameters.description });

        var start = convertDate(req.parameters.startDate);
        var due = convertDate(req.parameters.dueDate);

        if(start) rec.setValue({ fieldId: 'custrecord_task_start', value: start });
        if(due) rec.setValue({ fieldId: 'custrecord_task_due', value: due });

        var id = rec.save();

        context.response.write("<h3 style='color:green;text-align:center;'>Task Assigned Successfully!</h3>");
    }
};

return { onRequest };

});