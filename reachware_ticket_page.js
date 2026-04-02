/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/search','N/url'], 
(serverWidget, record, search, url) => {

const onRequest = (context) => {

    
    if (context.request.method === 'GET') {

        var form = serverWidget.createForm({ title: ' ' });

        var htmlField = form.addField({
            id: 'custpage_html',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'HTML'
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
    resize:none;
}
.attach{
height:30px;


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



<form onsubmit="return false;">

<!-- Requestor Info -->
<div class="section">Requestor Information</div>

<div class="row">

<div style="flex:1;">
    <div class="form-row">
        <label>Name</label>
        <input type="text">
    </div>

    <div class="form-row">
        <label>Date</label>
        <input type="date">
    </div>

    <div class="form-row">
        <label>Ticket No</label>
        <input type="text">
    </div>
</div>

<div style="flex:1;">
    <div class="form-row">
        <label>Email</label>
        <input type="email">
    </div>

    <div class="form-row">
        <label>Request Type</label>
        <select class="">
            <option>Issue</option>
            <option>Bug</option>
        </select>
    </div>

    <div class="form-row">
        <label>Assigned To</label>
        <input type="text">
    </div>
</div>

</div>

<!-- Project Info -->
<div class="section">Project Information</div>

<div class="row">

<div style="flex:1;">
    <div class="form-row">
        <label>Project Name</label>
        <input class="" type="text">
    </div>

    <div class="form-row">
        <label>Reachware Suite APP</label>
        <input class="" type="text">
    </div>
</div>

<div style="flex:1;">
    <div class="form-row">
        <label>Environment</label>
        <input type="text">
    </div>
</div>

</div>


<div class="section">Issue Details</div>

<div class="row">

<div style="flex:1;">
    <div class="form-row">
        <label>Priority</label>
        <select class="">
            <option class="red">High</option>
            <option>Medium</option>
            <option>Low</option>
        </select>
    </div>

    <div class="form-row">
        <label>Issue Details</label>
        <textarea></textarea>
    </div>

    <div class="form-row">
        <label >Attachment</label>
        <input type="file" class="attach">
    </div>

    <div class="form-row">
        <label>Status</label>
        <select class="">
            <option>In Progress</option>
            <option>Open</option>
            <option>Closed</option>
        </select>
    </div>
</div>

<div style="flex:1;">
    <div class="form-row">
        <label>Issue Occurred on</label>
        <input type="date">
    </div>

    <div class="form-row">
        <label>Role Of User</label>
        <input class="" type="text">
    </div>

    <div class="form-row">
        <label>Deadline</label>
        <input type="date">
    </div>
</div>

</div>

<button type="submit">Submit Ticket</button>

</form>

</div>
`;

        context.response.writePage(form);
    }

    
    else {

        var req = context.request;

        var name = req.parameters.name;
        var email = req.parameters.email;
        var date = req.parameters.date;
        var requestType = req.parameters.requestType;
        var assignedTo = req.parameters.assignedTo;
        var projectName = req.parameters.projectName;
        var suiteApp = req.parameters.suiteApp;
        var environment = req.parameters.envronment;
        var priority = req.parameters.priority;
        var issueDetails = req.parameters.issueDetails;
        var status = req.parameters.status;
        var isssueOccurredOn =req.parameters.isssueOccurredOn;
        var roleOfUser = req.parameters.roleOfUser;
        var deadline = req.parameters.deadline;
        var attachment = req.parameters.attachment;
        var ticketNo =req.parameters.ticketNo;

        var rec = record.create({
            type: 'customrecord_rw_portal_access2',
            isDynamic: true
        });

        rec.setValue({ 
            fieldId: 'custrecord1513', 
            value: name 
        });
        rec.setValue({ 
            fieldId: 'custrecord_rw_portal_email', 
            value: email
         });
        rec.setValue({ 
            fieldId: 'custrecord_rw_portal_priority',
             value: priority
            });
        rec.setValue({ 
            fieldId: 'custrecord_rw_portal_status',
             value: status 
            });
         rec.setValue({
             fieldId: 'custrecord_rw_portal_assignedto', 
             value: assignedTo 
            });
        rec.setValue({ 
            fieldId: 'custrecord_rw_portal_issuedetails',
             value: issueDetails 
            });
        rec.setValue({ 
            fieldId: 'custrecord_rw_portal_requesttype', 
            value: requestType
         });
        rec.setValue({ 
            fieldId: 'custrecord_rw_portal_ticketno', 
            value: ticketNo
         });
        
        rec.setValue({ 
            fieldId: 'custrecord_rw_portal_attachment', 
            value: attachment 
        });
        rec.setValue({ 
            fieldId: 'custrecord_rw_portal_deadline', 
            value: deadline
         });
        rec.setValue({
             fieldId: 'custrecord_rw_portal_roleofuser',
              value: roleOfUser
             });
          rec.setValue({ 
            fieldId: 'custrecord_rw_portal_projectname',
            value: projectName 
        });
        rec.setValue({ 
            fieldId: 'custrecord_rw_portal_environment',
             value: environment
             });
        rec.setValue({ 
            fieldId: 'custrecord_rw_portal_suiteapp',
             value: suiteApp 
            });
        
          rec.setValue({
             fieldId: 'custrecord_rw_portal_issueoccuredon', 
             value: isssueOccurredOn 
            });
        rec.setValue({ 
            fieldId: 'custrecord_rw_portal_date', 
            value: date 
        });
        
        
        
        var id = rec.save();

        // redirect back
        var redirectUrl = url.resolveScript({
                scriptId: 'customscript2876',
                deploymentId: 'customdeploy5',
                returnExternalUrl: true
                });

        context.response.write(`
        <html>
        <script>
            alert("Ticket Created Successfully (ID: ${id})");
            window.location.href = "${redirectUrl}";
        </script>
        </html>
        `);
    }
};

return { onRequest };

});