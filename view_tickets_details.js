/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/url','N/search','N/format','N/file'], (serverWidget, record, url, search,format,file) => {

const onRequest = (context) => {

    var form = serverWidget.createForm({ title: ' ' });

    var request = context.request;
    var ticketId = context.request.parameters.ticketId;

log.debug("Ticket ID Received", ticketId);
 var req = context.request;
        var attachment = '';
        

log.debug("Received File ID", attachment);
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

        var name = '';
        var email = '';
        var date = '';
        var requestType = '';
        var assignedTo = '';
        var clientName = '';
        var suiteApp = '';
        var environment = '';
        var priority = '';
        var issueDetails = '';
        var status = '';
        var issueOccurredOn = '';
        var roleOfUser = '';
        var deadline = '';
      var formattedDate = '';
var formattedDeadline = '';
var formattedIssueDate = '';
        var ticketNo ='';
const ticketUrl = url.resolveScript({
scriptId: 'customscript2894',
deploymentId: 'customdeploy1',
returnExternalUrl: true,

});

    

        var ticketRec = record.load({
    type: 'customrecord_rw_ticket',
    id: ticketId,
    isDynamic: false
});



        name = ticketRec.getText('custrecord_rw_ticket_name') || '';
        date = ticketRec.getText('custrecord_rw_ticket_date') || '';
        email = ticketRec.getText('custrecord_rw_ticket_email') || '';
        requestType = ticketRec.getText('custrecord_rw_ticket_requesttype') || '';
        assignedTo = ticketRec.getText('custrecord_rw_ticket_assignedto') || '';
        clientName = ticketRec.getText('custrecord_rw_ticket_projectname') || '';
        suiteApp = ticketRec.getText('custrecord_rw_ticket_rwsuiteapp') || '';
        environment = ticketRec.getText('custrecord_rw_ticket_environment') || '';
        priority = ticketRec.getText('custrecord_rw_ticket_priority') || '';
        issueDetails=ticketRec.getValue('custrecord_rw_ticket_issuedetails')
    ticketNo = ticketRec.getValue('custrecord_rw_ticket_ticketno') || '';
        //issueOccurredOn = ticketRec.getValue('custrecord_rw_ticket_issueoccuredon') || '';
        formattedDeadline=ticketRec.getText('custrecord_rw_ticket_deadline')
        roleOfUser = ticketRec.getText('custrecord_rw_ticket_userrole') || '';
         formattedIssueDate = ticketRec.getText('custrecord_rw_ticket_issueoccuredon') || '';
          attachment=ticketRec.getValue('custrecord_rw_ticket_attachment')
          status=ticketRec.getValue('custrecord_rw_ticket_ticketstatus')
//          var scheduled='';
//          var golive='';
//         if(scheduledUatDate){
//     scheduled = format.format({
//         value: scheduledUatDate,
//         type: format.Type.DATE
//     });
// }
// if(goliveDate){
//     golive = format.format({
//         value: goliveDate,
//         type: format.Type.DATE
//     });
// }


    var fileUrl = '';
var fileName = '';

if (attachment) {
    try {
        var fileObj = file.load({
            id: attachment
        });

        fileUrl = fileObj.url;
        fileName = fileObj.name;

    } catch (e) {
        log.error("File Load Error", e);
    }
}

function formatDate(date){
    if(!date) return '';
    var d = new Date(date);
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
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
    <div class="title">Ticket Details</div>

    <div class="form-grid">

        <div class="label">Name</div>
        <div class="value">${name}</div>

        <div class="label">Date</div>
        <div class="value">${date}</div>

        <div class="label">Ticket No</div>
        <div class="value">${ticketNo}</div>
        <div class="label">Attachment</div>
        <div class="value">
    ${fileUrl ? `<a href="${fileUrl}" target="_blank">${fileName}</a>` : 'No Attachment'}
</div>
        <div class="label">Ticket Status</div>
        <div class="value">${status}</div>

        <div class="label">Email</div>
        <div class="value">${email}</div>
        <div class="label">Request Type</div>
        <div class="value">${requestType}</div>
        <div class="label">Assigned To</div>
        <div class="value">${assignedTo}</div>
        <div class="label">Client Name</div>
        <div class="value">${clientName}</div>
        <div class="label">Environment</div>
        <div class="value">${environment}</div>
        <div class="label">RW Product</div>
        <div class="value">${suiteApp}</div>
        <div class="label">Priority</div>
        <div class="value">${priority}</div>
        <div class="label">Issue Details</div>
        <div class="value">${issueDetails}</div>
        <div class="label">Issue Occured on</div>
        <div class="value">${formattedIssueDate}</div>
        <div class="label">Role of the user</div>
        <div class="value">${roleOfUser}</div>
        <div class="label">Deadline</div>
        <div class="value">${formattedDeadline}</div>

    </div>



    <button class="backBtn" type="button" onclick="goBack()">⬅ Back</button>
</div>
<div id="loader">
    <div class="spinner"></div>
    <p>Loading tickets...</p>
</div>
    <script>
   
    var ticketUrl = '${ticketUrl}';
     function goBack(){

    var loader = document.getElementById("loader");
    loader.style.display = "block";   // ✅ show loader

    setTimeout(function(){
        window.parent.location.href = ticketUrl;
    }, 300); // small delay for smooth UX
}
    </script>
    `;

    context.response.writePage(form);
};

return { onRequest };

});