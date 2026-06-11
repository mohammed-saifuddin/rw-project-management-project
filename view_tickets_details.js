/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/url','N/search','N/format','N/file','N/runtime'], (serverWidget, record, url, search,format,file,runtime) => {

const onRequest = (context) => {

    var form = serverWidget.createForm({ title: ' ' });

    var request = context.request;
    var ticketId = context.request.parameters.ticketId;
    var editingId =
    request.parameters.editingId;
var empId =
    parseInt(
        request.parameters.empid,
        10
    ) || 0;
log.debug("Ticket ID Received", ticketId);
 var req = context.request;
        var attachment = '';
        
var ticketId = request.parameters.ticketId;
var updateStatus =
    request.parameters.updateStatus;

if(updateStatus){

    var oldTicketRec = record.load({
    type:'customrecord_rw_ticket',
    id: ticketId,
    isDynamic:false
});

var oldStatus =
    oldTicketRec.getText(
        'custrecord_rw_ticket_ticketstatus'
    ) || '';

record.submitFields({

    type:'customrecord_rw_ticket',

    id: ticketId,

    values:{
        custrecord_rw_ticket_ticketstatus:
            updateStatus
    }
});

var newTicketRec = record.load({
    type:'customrecord_rw_ticket',
    id: ticketId,
    isDynamic:false
});

var newStatus =
    newTicketRec.getText(
        'custrecord_rw_ticket_ticketstatus'
    ) || '';
if(oldStatus !== newStatus){

    createNotification(
        empId,
        'Ticket Status Changed : ' +
        oldStatus +
        ' → ' +
        newStatus,
        'TICKET_STATUS',
        ticketId
    );
}
var histRec = record.create({
    type:'customrecord_rw_ticket_history',
    isDynamic:true
});

histRec.setValue({
    fieldId:'custrecord_rw_ticket_hist_ticket',
    value:ticketId
});

histRec.setValue({
    fieldId:'custrecord_rw_ticket_hist_oldstatus',
    value:oldStatus
});

histRec.setValue({
    fieldId:'custrecord_rw_ticket_hist_newstatus',
    value:newStatus
});

histRec.setValue({
    fieldId:'custrecordcustrecord_rw_ticket_hist_chan',
    value:empId
});

histRec.setValue({
    fieldId:'custrecord_rw_ticket_hist_changedon',
    value:new Date()
});

histRec.save({
    enableSourcing:true,
    ignoreMandatoryFields:true
});
    record.submitFields({

        type:'customrecord_rw_ticket',

        id: ticketId,

        values:{
            custrecord_rw_ticket_ticketstatus:
                updateStatus
        }
    });

    context.response.write('success');

    return;
}
if(request.method === 'POST'){
    var replyId =
    request.parameters.replyId;
var uploadedFiles = [];
var existingFiles =
    JSON.parse(
        request.parameters.existingFiles || '[]'
    );
    try{

        log.debug("POST STARTED");

        var commentText =
            request.parameters.commentText;

        var ticketId =
            request.parameters.ticketId;

        log.debug("COMMENT TEXT", commentText);
        log.debug("TICKET ID", ticketId);
if(request.files){

    Object.keys(request.files)
        .forEach(function(key){

        var uploadedFile =
            request.files[key];

        if(uploadedFile){

            uploadedFile.folder = 5842;

            var uploadedFileId =
                uploadedFile.save();

            var savedFile =
                file.load({
                    id: uploadedFileId
                });

            savedFile.isOnline = true;

            savedFile.save();

            uploadedFiles.push(
                uploadedFileId
            );

            log.debug(
                'Uploaded File ID',
                uploadedFileId
            );
        }
    });
}
        if(commentText){

           var commentRec;

if(editingId){

    commentRec = record.load({
        type:'customrecord_rw_ticket_comment',
        id: editingId,
        isDynamic:true
    });
var currentEditCount =
    parseInt(
        commentRec.getValue(
            'custrecord_rw_ticket_comment_editcount'
        ) || 0
    );

commentRec.setValue({

    fieldId:
        'custrecord_rw_ticket_comment_editcount',

    value:
        currentEditCount + 1
});
}else{

    commentRec = record.create({
        type:'customrecord_rw_ticket_comment'
    });
}
if(replyId){

    commentRec.setValue({
        fieldId:
            'custrecord_rw_ticket_comments_replycmmnt',

        value: replyId
    });
}
            commentRec.setValue({
                fieldId:'custrecord_rw_ticket_comments_comments',
                value: commentText
            });

            if(!editingId){

    commentRec.setValue({
        fieldId:'custrecord_rw_ticket_comment_employee',
        value: empId
    });

    commentRec.setValue({
        fieldId:'custrecord_rw_comment_link',
        value: ticketId
    });
}
log.debug("EMP ID", empId);
            commentRec.setValue({
                fieldId:'custrecord_rw_ticket_comment_cmtdate',
                value: new Date()
            });

       

            var commentId = commentRec.save({
                enableSourcing:true,
                ignoreMandatoryFields:true
            });
            if(editingId){

    var oldAttachSearch =
        search.create({

            type:'customrecord2297',

            filters:[
                [
                    'custrecord1515',
                    'anyof',
                    commentId
                ]
            ],

            columns:['internalid']
        });

    oldAttachSearch.run().each(function(r){

        record.delete({

            type:'customrecord2297',

            id:r.getValue('internalid')
        });

        return true;
    });

    existingFiles.forEach(function(file){

        var attachRec =
            record.create({

                type:'customrecord2297'
            });

        attachRec.setValue({
            fieldId:'name',
            value:
                'ATT-' +
                commentId +
                '-' +
                file.id
        });

        attachRec.setValue({
            fieldId:'custrecord1515',
            value:commentId
        });

        attachRec.setValue({
            fieldId:
                'custrecord_rw_ticket_comments_attachment',

            value:file.id
        });

        attachRec.save({
            ignoreMandatoryFields:true
        });
    });
}
if(uploadedFiles.length > 0){

    uploadedFiles.forEach(function(fileId){

        var attachRec =
            record.create({

                type:'customrecord2297'
            });

        attachRec.setValue({

            fieldId:'name',

            value:
                'ATT-' +
                commentId +
                '-' +
                fileId
        });

        attachRec.setValue({

            fieldId:'custrecord1515',

            value:commentId
        });

        attachRec.setValue({

            fieldId:
                'custrecord_rw_ticket_comments_attachment',

            value:fileId
        });

        attachRec.save({

            enableSourcing:true,
            ignoreMandatoryFields:true
        });

    });
}
            log.debug("COMMENT SAVED", commentId);
        }

        context.response.write('success');
        return;

    }catch(e){

        log.error("COMMENT ERROR", e);

        context.response.write(JSON.stringify(e));
        return;
    }
}
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
        var coworker = '';
        var reviewer = '';
      var formattedDate = '';
var formattedDeadline = '';
var formattedIssueDate = '';
        var ticketNo ='';
const ticketUrl = url.resolveScript({
scriptId: 'customscript2894',
deploymentId: 'customdeploy1',
returnExternalUrl: true,
 params:{
        empid: empId,
        email:email
    },
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
function getEmployeeDMSRole(empId){

    if(
        !empId ||
        isNaN(empId)
    ){
        return '';
    }

    empId = parseInt(empId,10);

    var emp = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empId,
        columns:['custentityrw_dms_role']
    });

    if(
        emp.custentityrw_dms_role &&
        emp.custentityrw_dms_role.length
    ){
        return emp.custentityrw_dms_role[0].text;
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
var dmsRole = getEmployeeDMSRole(empId);
var roleType = getRoleTypeFromDMS(dmsRole);
    

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
          status=ticketRec.getText('custrecord_rw_ticket_ticketstatus');
          coworker = ticketRec.getText('custrecord_rw_ticket_coworker') || '';
          reviewer = ticketRec.getText('custrecord_rw_ticket_review') || '';
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
const currentUser = Number(empId);

const assignedEmp = Number(
    ticketRec.getValue(
        'custrecord_rw_ticket_assignedto'
    ) || 0
);

const reviewerEmp = Number(
    ticketRec.getValue(
        'custrecord_rw_ticket_review'
    ) || 0
);

const pmEmp = Number(
    ticketRec.getValue(
        'custrecord_rw_ticket_coworker'
    ) || 0
);

var statusId = Number(
    ticketRec.getValue(
        'custrecord_rw_ticket_ticketstatus'
    ) || 0
);

log.debug('CURRENT USER', currentUser);
log.debug('ASSIGNED EMP', assignedEmp);
log.debug('REVIEWER', reviewerEmp);
log.debug('PM', pmEmp);
log.debug('STATUS', statusId);

var hasAccess = false;

if(
    currentUser === assignedEmp ||
    currentUser === reviewerEmp ||
    currentUser === pmEmp ||
    roleType === 'PM'
){
    hasAccess = true;
}

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

var statusButtonHtml = '';

if(hasAccess){

    if(statusId === 1){

        statusButtonHtml =
        '<button class="statusBtn" type="button" onclick="updateStatus(2)">' +
        'Start Progress' +
        '</button>';
    }

    else if(statusId === 2){

        statusButtonHtml =
        '<button class="statusBtn" type="button" onclick="updateStatus(3)">' +
        'Move To CodeReview' +
        '</button>';
    }

    else if(statusId === 3){

        statusButtonHtml =
        '<button class="statusBtn" type="button" onclick="updateStatus(4)">' +
        'Move To UAT' +
        '</button>';
    }

    else if(statusId === 4){

        statusButtonHtml =
        '<button class="statusBtn" type="button" onclick="updateStatus(5)">' +
        'Mark As Done' +
        '</button>';
    }

    else if(
    statusId === 5 &&
    (
        currentUser === reviewerEmp ||
        currentUser === pmEmp
    )
){

    statusButtonHtml =
    '<button class="statusBtn reopenBtn" type="button" onclick="updateStatus(2)">' +
    'Reopen Ticket' +
    '</button>';
}
}
    

    var htmlField = form.addField({
        id: 'custpage_html',
        type: serverWidget.FieldType.INLINEHTML,
        label: 'HTML'
    });


var commentSearch = search.create({
    type: 'customrecord_rw_ticket_comment',

    filters: [
        ['custrecord_rw_comment_link','anyof',ticketId]
    ],

    columns: [
        'internalid',
        search.createColumn({
            name:'custrecord_rw_ticket_comment_cmtdate',
            sort: search.Sort.DESC
        }),
        'custrecord_rw_ticket_comment_employee',
        'custrecord_rw_ticket_comments_comments',
        'custrecord_rw_ticket_comments_replycmmnt',
        'custrecord_rw_ticket_comment_editcount'
       
    ]
});

var commentsMap = {};
var replyMap = {};

var commentIndex = 0;

commentSearch.run().each(function(result){

    commentIndex++;

    var rawComment =
        result.getValue(
            'custrecord_rw_ticket_comments_comments'
        ) || '';

    var comment =
        rawComment.replace(
            /@([a-zA-Z0-9._-]+)/g,
            '<span style="color:#0052cc;font-weight:600;">@$1</span>'
        );

    var parentComment =
        result.getValue(
            'custrecord_rw_ticket_comments_replycmmnt'
        );

    var commentId =
        result.getValue('internalid');

    var user =
        result.getText(
            'custrecord_rw_ticket_comment_employee'
        ) || '';

    var date =
        result.getValue(
            'custrecord_rw_ticket_comment_cmtdate'
        ) || '';

    var commentEmpId =
        result.getValue(
            'custrecord_rw_ticket_comment_employee'
        );
        var editCount =
    parseInt(
        result.getValue(
            'custrecord_rw_ticket_comment_editcount'
        ) || 0
    );
var attachmentId =
    result.getValue(
        'custrecord_rw_ticket_comments_attachment'
    );

var attachmentHtml = '';
var existingFiles = [];
var attachSearch = search.create({

    type:
        'customrecord2297',

    filters: [
        [
            'custrecord1515',
            'anyof',
            commentId
        ]
    ],

    columns: [
        'custrecord_rw_ticket_comments_attachment'
    ]
});

attachSearch.run().each(function(att){

    var fileId =
        att.getValue(
            'custrecord_rw_ticket_comments_attachment'
        );

    if(fileId){

        try{

            var fileObj =
                file.load({
                    id:fileId
                });
existingFiles.push({

    id:fileId,

    name:fileObj.name,

    url:fileObj.url
});
            var fileUrl =
                fileObj.url;

            var ext =
                fileObj.name
                    .split('.')
                    .pop()
                    .toLowerCase();

            if(
                ext === 'png' ||
                ext === 'jpg' ||
                ext === 'jpeg' ||
                ext === 'gif' ||
                ext === 'webp'
            ){

                attachmentHtml +=

'<div style="margin-top:10px;">' +

'<a href="' + fileUrl + '" target="_blank" style="' +
'display:inline-block;' +
'width:auto;' +
'">' +

'<img src="' + fileUrl + '" style="' +
'width:auto;' +
'max-width:250px;' +
'max-height:180px;' +
'display:block;' +
'border-radius:10px;' +
'border:1px solid #dfe1e6;' +
'">' +

'</a>' +

'</div>';

            }else{

                attachmentHtml +=

                    '<div style="margin-top:10px;">' +

                    '<a href="' +
                    fileUrl +
                    '" target="_blank" ' +

                    'style="' +
                    'display:inline-block;' +
                    'padding:8px 12px;' +
                    'background:#fff;' +
                    'border:1px solid #dfe1e6;' +
                    'border-radius:8px;' +
                    'text-decoration:none;' +
                    'font-size:13px;' +
                    'color:#0052cc;' +
                    '">' +

                    '📎 ' + fileObj.name +

                    '</a></div>';
            }

        }catch(e){

            log.error(
                'Attachment Load Error',
                e
            );
        }
    }

    return true;
});
var createdDate =
    result.getValue(
        'custrecord_rw_ticket_comment_cmtdate'
    );

var diffMinutes = 0;

try{

    if(createdDate){

        var createdTime =
            format.parse({

                value: createdDate,

                type: format.Type.DATETIMETZ
            });

        var now =
            new Date();

        diffMinutes =
            Math.floor(
                (
                    now.getTime() -
                    createdTime.getTime()
                ) / 1000 / 60
            );
    }

}catch(e){

    log.error(
        'DATE PARSE ERROR',
        e
    );

    diffMinutes = 999;
}

log.debug(
    'DIFF MINUTES',
    diffMinutes
);

var editBtn = '';
if(
    String(commentEmpId) === String(empId) &&
    commentIndex <= 3 &&
    diffMinutes <= 10 &&
    editCount < 2
){

    editBtn = `
    
    <button type="button"
        onclick='editComment(
            "${commentId}",
            "${rawComment
                .replace(/"/g,"&quot;")
                .replace(/\n/g," ")
            }",
            ${JSON.stringify(existingFiles)
                .replace(/"/g,'&quot;')}
        )'
        class="edit-comment-btn">

        Edit

    </button>
    `;
}
    var initials = user
        ? user.split(' ')
              .map(n => n[0])
              .join('')
              .substring(0,2)
              .toUpperCase()
        : 'U';

    var html = `

<div class="jira-comment">

    <div class="jira-avatar">
        ${initials}
    </div>

    <div class="jira-content">

        <div class="jira-top">

            <div>
                <span class="jira-user">${user}</span>
                <span class="jira-date">${date}</span>
            </div>

            <div>

            ${String(commentEmpId) === String(empId) ? `

            ${editBtn}

            ` : ''}

            <button
                type="button"
                class="reply-btn"
               onclick="openReplyBox('${commentId}')">

                Reply

            </button>

            </div>

        </div>

        <div class="jira-message">
    ${comment}
    ${attachmentHtml}
</div>

<div
    id="replyBox_${commentId}"
    class="reply-input-box"
    style="display:none;">

    <div class="comment-input-wrapper">

    <textarea
        id="replyText_${commentId}"
        class="reply-textarea"
        placeholder="Write a reply..."></textarea>

    <label
        for="replyAttachment_${commentId}"
        class="attachment-btn">

        📎

    </label>

    <input
        type="file"
        id="replyAttachment_${commentId}"
        style="display:none;">

</div>

<div
    id="replyFileName_${commentId}"
    class="selected-file-name">
</div>

    <div class="reply-actions">

        <button
            type="button"
            class="reply-save-btn"
            onclick="saveReply('${commentId}')">

            Send

        </button>

        <button
            type="button"
            class="reply-cancel-btn"
            onclick="cancelReply('${commentId}')">

            Cancel

        </button>

    </div>

</div>

    </div>

</div>
`;

    if(parentComment){

    if(!replyMap[parentComment]){
        replyMap[parentComment] = [];
    }

    replyMap[parentComment].push({
        id: commentId,
        html: html
    });

}else{

    commentsMap[commentId] = {
        id: commentId,
        html: html
    };
}

    return true;
});
var commentsListHtml = '';

function renderReplies(parentId){

    var html = '';

    if(replyMap[parentId]){

        html +=
            '<div class="reply-wrapper">';

        replyMap[parentId].forEach(function(reply){

            html += reply.html;

            html += renderReplies(reply.id);

        });

        html += '</div>';
    }

    return html;
}

Object.keys(commentsMap).forEach(function(commentId){

    commentsListHtml +=
        commentsMap[commentId].html;

    commentsListHtml +=
        renderReplies(commentId);
});
var employeeList = [];

var empSearch = search.create({
    type: 'employee',
    filters: [
        ['isinactive','is','F']
    ],
    columns: ['internalid','firstname','lastname']
});

empSearch.run().each(function(result){

    

    employeeList.push({
        id: result.getValue('internalid'),
        name: result.getValue('firstname') + ' ' + result.getValue('lastname')

    });

    return true;
});



var employeeJson =
    JSON.stringify(employeeList)
        .replace(/'/g, "\\'");

        var historyHtml = `
<div style="
    margin-top:25px;
    background:#fff;
    border-radius:14px;
    padding:20px;
    box-shadow:0 4px 20px rgba(0,0,0,0.08);
">
<h3 style="
    margin-top:0;
    margin-bottom:20px;
    color:#172b4d;
">
    System Notes
</h3>
`;
var histSearch = search.create({
    type:'customrecord_rw_ticket_history',

    filters:[
        [
            'custrecord_rw_ticket_hist_ticket',
            'anyof',
            ticketId
        ]
    ],

    columns:[
        search.createColumn({
            name:'created',
            sort:search.Sort.DESC
        }),
        'custrecord_rw_ticket_hist_oldstatus',
        'custrecord_rw_ticket_hist_newstatus',
        'custrecordcustrecord_rw_ticket_hist_chan',
        'custrecord_rw_ticket_hist_changedon'
    ]
});
histSearch.run().each(function(h){

    historyHtml += `

<div style="
    border-left:5px solid #8f50df;
    background:#f8f9fc;
    padding:14px;
    border-radius:10px;
    margin-bottom:14px;
">

<div style="
    display:flex;
    justify-content:space-between;
    align-items:center;
">

<div style="
    font-weight:600;
">
    ${h.getValue(
        'custrecord_rw_ticket_hist_oldstatus'
    ) || '-'}
    
    →
    
    ${h.getValue(
        'custrecord_rw_ticket_hist_newstatus'
    ) || '-'}
</div>

<div style="
    font-size:12px;
    color:#6b778c;
">
🕒 ${
format.format({
    value:h.getValue('created'),
    type:format.Type.DATETIMETZ
})
}
</div>

</div>

<div style="
    margin-top:8px;
    font-size:13px;
    color:#555;
">
👤 ${
h.getText(
    'custrecordcustrecord_rw_ticket_hist_chan'
) || ''
}
</div>

</div>
`;

    return true;
});

historyHtml += `</div>`;
var commentsHtml = `
<div class="comment-section">
<input type="hidden" id="editingCommentId" value="">
<input
    type="hidden"
    id="replyCommentId"
    value="">
    <div style="
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:15px;
">
    <h3 style="
        margin:0;
        color:#172b4d;
        font-size:20px;
    ">
        Activity
    </h3>

    <span style="
        color:#6b778c;
        font-size:13px;
    ">
        ${commentSearch.runPaged().count} comments
    </span>
</div>
<div id="mentionBox"></div>
  <div class="comment-input-wrapper">

    <textarea
        id="newComment"
        placeholder="Add a comment..."
        class="comment-textarea">
    </textarea>

    <label
        for="commentAttachment"
        class="attachment-btn">

        📎

    </label>

    <input
    type="file"
    id="commentAttachment"
    multiple
    style="display:none;">

</div>

<div
    id="selectedFileName"
    class="selected-file-name">
</div>
<div
    id="existingEditFiles"
    style="margin-top:10px;">
</div>
    <button type="button"
        onclick="saveComment()"
        style="
            margin-top:10px;
         background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
            color:white;
            border:none;
            padding:10px 15px;
            border-radius:6px;
            cursor:pointer;
        ">
        Add Comment
    </button>

    <div id="commentsContainer">
        ${commentsListHtml}
    </div>

</div>
`;

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


/* COMMENT SECTION */

.comment-section{
    margin-top:35px;
    background:#ffffff;
    border-radius:14px;
    padding:20px;
    box-shadow:0 4px 20px rgba(0,0,0,0.08);
}

/* COMMENT ROW */

.jira-comment{
    display:flex;
    gap:15px;
    margin-top:20px;
    padding-bottom:18px;
    border-bottom:1px solid #ececec;
    animation:fadeIn 0.3s ease;
}

/* AVATAR */

.jira-avatar{
    width:42px;
    height:42px;
    border-radius:50%;
 background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;

    color:white;
    display:flex;
    align-items:center;
    justify-content:center;
    font-weight:bold;
    font-size:14px;
    flex-shrink:0;
}

/* MENTION BOX */

#mentionBox{
    position:absolute;
    background:white;
    border:1px solid #dfe1e6;
    border-radius:10px;
    width:260px;
    max-height:220px;
    overflow:auto;
    display:none;
    z-index:9999;
    box-shadow:0 4px 16px rgba(0,0,0,0.15);
}

/* USER OPTION */

.mention-user{
    padding:10px 14px;
    cursor:pointer;
    transition:0.2s;
    font-size:14px;
}

.mention-user:hover{
    background:#f4f5f7;
}
/* CONTENT */

.jira-content{
    flex:1;
}
.comment-input-wrapper{
    position:relative;
    width:100%;
}

.comment-textarea{
    width:100%;
    min-height:100px;
    border:1px solid #dfe1e6;
    border-radius:12px;
    padding:14px 50px 14px 14px;
    font-size:14px;
    resize:vertical;
    box-sizing:border-box;
}

.comment-textarea:focus{
    outline:none;
    border-color:#8f50df;
    box-shadow:0 0 0 3px rgba(111,59,162,0.15);
}

.attachment-btn{
    position:absolute;
    right:14px;
    bottom:14px;
    font-size:20px;
    cursor:pointer;
    color:#6b778c;
    transition:0.2s;
}

.attachment-btn:hover{
    color:#8f50df;
    transform:scale(1.1);
}

.selected-file-name{
    margin-top:6px;
    font-size:12px;
    color:#6b778c;
}
/* TOP BAR */

.jira-top{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:6px;
}

/* USER */

.jira-user{
    font-weight:600;
    color:#172b4d;
    font-size:14px;
}

/* DATE */

.jira-date{
    font-size:12px;
    color:#6b778c;
}

/* MESSAGE */


.edit-comment-btn{
    border:none;
    background:#f4f5f7;
    color:#42526e;
    padding:5px 10px;
    border-radius:6px;
    cursor:pointer;
    font-size:12px;
    transition:0.2s;
}

.edit-comment-btn:hover{
    background:#dfe1e6;
}
.jira-message{
    background:#f4f5f7;
    padding:14px;
    border-radius:10px;
    color:#172b4d;
    line-height:1.5;
    font-size:14px;
    white-space:pre-wrap;
}

/* COMMENT BOX */

#newComment{
    width:100%;
    min-height:90px;
    border:1px solid #dfe1e6;
    border-radius:10px;
    padding:14px;
    font-size:14px;
    resize:vertical;
    transition:0.2s;
}

#newComment:focus{
    outline:none;
    border-color:#8f50df;
    box-shadow:0 0 0 3px rgba(111,59,162,0.15);
}

/* BUTTON */

.comment-btn{
    margin-top:12px;
    background:linear-gradient(135deg, #8E2DE2, #C471ED);
    color:white;
    border:none;
    padding:10px 18px;
    border-radius:8px;
    cursor:pointer;
    font-weight:600;
    transition:0.2s;
}

.comment-btn:hover{
    background:#5d2f8d;
    transform:translateY(-1px);
}

/* ANIMATION */

@keyframes fadeIn{
    from{
        opacity:0;
        transform:translateY(8px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}
    .reply-comment{
    margin-left:60px;
    border-left:3px solid #dfe1e6;
    padding-left:15px;
}
.value {
    background: #f9f9f9;
    padding: 8px;
    border-radius: 5px;
}
        .container{
            max-width:95%;
            width:100%;
            height:100%;
            margin:auto;
            background:white;
            padding:0px;
            margin-top:-30px;
            margin-left:-20px;
        
            
        }

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
         background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
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
    border-top:6px solid #8f50df;
    border-radius:50%;
    width:50px;
    height:50px;
    animation:spin 1s linear infinite;
}

@keyframes spin{
    0%{transform:translate(-50%,-50%) rotate(0deg);}
    100%{transform:translate(-50%,-50%) rotate(360deg);}
}
/* INLINE REPLY BOX */

.reply-input-box{
    margin-top:12px;
    background:#f4f5f7;
    padding:12px;
    border-radius:10px;
}

/* REPLY TEXTAREA */

.reply-textarea{
    width:100%;
    min-height:70px;
    border:1px solid #d0d7de;
    border-radius:8px;
    padding:10px;
    resize:vertical;
    font-size:14px;
    box-sizing:border-box;
}

/* ACTIONS */

.reply-actions{
    display:flex;
    gap:10px;
    margin-top:10px;
}

/* SAVE */

.reply-save-btn{
    background:linear-gradient(135deg, #8E2DE2, #C471ED);
    color:white;
    border:none;
    padding:8px 14px;
    border-radius:6px;
    cursor:pointer;
}

/* CANCEL */

.reply-cancel-btn{
    background:#dfe1e6;
    color:#172b4d;
    border:none;
    padding:8px 14px;
    border-radius:6px;
    cursor:pointer;
}
#loader p{
    position:absolute;
    top:60%;
    left:50%;
    transform:translateX(-50%);
    font-weight:bold;
    color:#8f50df;
}
    #editBtn{
    margin-top:20px;
            padding:10px 15px;
            background:linear-gradient(135deg, #8E2DE2, #C471ED);
            color:white;
            border:none;
            border-radius:5px;
            cursor:pointer;
    }


    .comment-section{
    margin-top:25px;
}

.comment-card{
    background:#f8f8fb;
    padding:12px;
    border-radius:10px;
    margin-top:10px;
    box-shadow:0 2px 8px rgba(0,0,0,0.08);
}

.comment-header{
    display:flex;
    justify-content:space-between;
    margin-bottom:8px;
    color:#555;
    font-size:13px;
}
.reply-btn{
    border:none;
    background:transparent;
    color:#0052cc;
    cursor:pointer;
    font-size:12px;
    margin-left:10px;
}
    .reply-heading{
    font-size:12px;
    font-weight:600;
    color:#6b778c;
    margin-bottom:10px;
    margin-top:5px;
    text-transform:uppercase;
    letter-spacing:0.5px;
}
.reply-wrapper{
    margin-left:65px;
    border-left:2px solid #dfe1e6;
    padding-left:18px;
    margin-top:8px;
}
.reply-btn:hover{
    text-decoration:underline;
}
    .topHeader{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:25px;
}

.statusBtn{
 background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
    color:white;
    border:none;
    padding:10px 16px;
    border-radius:8px;
    cursor:pointer;
    font-weight:600;
    transition:0.2s;
}
.reopenBtn{
    background:#e67e22;
}

.reopenBtn:hover{
    background:#ca6b12;
}
.statusBtn:hover{
    background:#5a2d87;
    transform:translateY(-1px);
}
.comment-body{
    font-size:14px;
    color:#222;
    white-space:pre-wrap;
}

        .backBtn:hover{
            background:#5a2d87;
        }
            #saveBtn{
             margin-top:20px;
            padding:10px 15px;
            background:linear-gradient(135deg, #8E2DE2, #C471ED);
            color:white;
            border:none;
            border-radius:5px;
            cursor:pointer;
            }
            .view-sections{

    display:flex;

    flex-direction:column;

    gap:18px;

    margin-top:14px;
}

.modern-section{

    background:#ffffff;

    border-radius:14px;

    padding:16px 18px;

    border:1px solid #E5E7EB;

    box-shadow:
        0 3px 10px rgba(0,0,0,0.04);
}

.modern-section-title{

    font-size:14px;

    font-weight:700;

    margin-bottom:16px;

    color:#5b2d8e;

    padding-bottom:10px;

    border-bottom:1px solid #ECECEC;

    text-transform:uppercase;

    letter-spacing:0.4px;
}

.modern-grid{

    display:grid;

    grid-template-columns:
        repeat(2,minmax(420px,1fr));

    gap:12px 28px;
}

.field-box{

    display:grid;

    grid-template-columns:
        130px 240px;
      padding-left:84px;
      
    align-items:center;

    column-gap:12px;
}

/* LABEL */
.field-box label{

    font-size:11px;

    font-weight:700;

    color:#6B7280;

    text-transform:uppercase;

    letter-spacing:0.3px;

    margin:0;
}

/* VALUE */
.field-value{

    min-height:34px;

    width:300px;

    display:flex;

    align-items:center;

    padding:0 10px;
  

    background:#F9FAFB;

    border:1px solid #E5E7EB;

    border-radius:8px;

    font-size:12px;

    color:#172B4D;
     justify-content:space-between;

    font-weight:500;

    box-sizing:border-box;
}
.issue-box{

    background:#F9FAFB;

    border:1px solid #E5E7EB;

    border-radius:12px;

    padding:14px;

    min-height:80px;

    line-height:1.5;

    font-size:12px;
}

.status-pill{

    color:white;

    font-weight:600;

    justify-content:center;

    border:none;
}

/* OPEN */
.status-open{

    background:#3498db;
}

/* IN PROGRESS */
.status-progress{

    background:#f39c12;
}

/* CODE REVIEW */
.status-review{

    background:#9b59b6;
}

/* UAT */
.status-uat{

    background:#16a085;
}

/* DONE */
.status-done{

    background:#27ae60;
}

/* REOPEN */
.status-reopen{

    background:#e74c3c;
}

/* HOLD */
.status-hold{

    background:#7f8c8d;
}

.title{

    font-size:18px;

    font-weight:700;
}

.topHeader{

    margin-bottom:18px;
}

.statusBtn{

    padding:8px 14px;

    font-size:12px;

    border-radius:6px;
}

.backBtn{

    padding:8px 14px;

    font-size:12px;

    border-radius:6px;
}
    </style>

    <div class="container">
    <div class="topHeader">

    <div class="title">
        Ticket Details
    </div>

    <div>
        ${statusButtonHtml}
    </div>

</div>

    <div class="view-sections">

    <!-- SECTION 1 -->
    <div class="modern-section">

        <div class="modern-section-title">
            Ticket Information
        </div>

        <div class="modern-grid">

            <div class="field-box">
                <label>Ticket No</label>
                <div class="field-value">${ticketNo}</div>
            </div>

            <div class="field-box">
                <label>Requester</label>
                <div class="field-value">${name}</div>
            </div>

            <div class="field-box">
                <label>Email</label>
                <div class="field-value">${email}</div>
            </div>

            <div class="field-box">
                <label>Client Name</label>
                <div class="field-value">${clientName}</div>
            </div>

            <div class="field-box">
                <label>Request Type</label>
                <div class="field-value">${requestType}</div>
            </div>

            <div class="field-box">
                <label>Environment</label>
                <div class="field-value">${environment}</div>
            </div>

            <div class="field-box">
                <label>RW Product</label>
                <div class="field-value">${suiteApp}</div>
            </div>

            <div class="field-box">
                <label>Priority</label>
                <div class="field-value">${priority}</div>
            </div>

        </div>

    </div>

    <!-- SECTION 2 -->
    <div class="modern-section">

        <div class="modern-section-title">
            Assignment & Timeline
        </div>

        <div class="modern-grid">

            <div class="field-box">
                <label>Assigned To</label>
                <div class="field-value">${assignedTo}</div>
            </div>

            <div class="field-box">
                <label>Reviewer</label>
                <div class="field-value">${reviewer}</div>
            </div>

            <div class="field-box">
                <label>Project Manager</label>
                <div class="field-value">${coworker}</div>
            </div>

            <div class="field-box">
                <label>Status</label>
                <div class="
    field-value
    status-pill
    ${
        status === 'Open'
        ? 'status-open'

        : status === 'In Progress'
        ? 'status-progress'

        : status === 'Code Review'
        ? 'status-review'

        : status === 'UAT'
        ? 'status-uat'

        : status === 'Done'
        ? 'status-done'

        : status === 'Reopen'
        ? 'status-reopen'

        : 'status-hold'
    }
">
    ${status}
</div>
            </div>

            <div class="field-box">
                <label>Date</label>
                <div class="field-value">${date}</div>
            </div>

            <div class="field-box">
                <label>Issue Occurred On</label>
                <div class="field-value">
                    ${formattedIssueDate}
                </div>
            </div>

            <div class="field-box">
                <label>Deadline</label>
                <div class="field-value">
                    ${formattedDeadline}
                </div>
            </div>

            <div class="field-box">
                <label>Role of User</label>
                <div class="field-value">
                    ${roleOfUser}
                </div>
            </div>

        </div>

    </div>

    <!-- SECTION 3 -->
    <div class="modern-section">

        <div class="modern-section-title">
            Issue Details
        </div>

        <div class="issue-box">
            ${issueDetails}
        </div>

    </div>

</div>
${historyHtml}
${commentsHtml}

    <button class="backBtn" type="button" onclick="goBack()">⬅ Back</button>
</div>
<div id="loader">
    <div class="spinner"></div>
    <p>Loading tickets...</p>
</div>
    <script>
   
    var ticketUrl = '${ticketUrl}';
    var employees = JSON.parse('${employeeJson}');
function editComment(
    id,
    text,
    files
){

    document.getElementById(
        "newComment"
    ).value =
        text.replace(/<[^>]*>/g,'');

    document.getElementById(
        "editingCommentId"
    ).value = id;

    existingEditFiles = files || [];

    renderExistingFiles();

    document.getElementById(
        "newComment"
    ).focus();

    window.scrollTo({

        top:
            document.getElementById(
                "newComment"
            ).offsetTop - 120,

        behavior:'smooth'
    });
}
    function renderExistingFiles(){

    var html = '';

    existingEditFiles.forEach(function(file,index){

        html +=

            '<div style="' +
            'display:flex;' +
            'justify-content:space-between;' +
            'align-items:center;' +
            'background:#f4f5f7;' +
            'padding:8px 10px;' +
            'margin-top:6px;' +
            'border-radius:6px;' +
            '">' +

            '<a href="' +
            file.url +
            '" target="_blank">' +

            '📎 ' + file.name +

            '</a>' +

            '<span ' +
            'style="' +
            'color:red;' +
            'cursor:pointer;' +
            'font-weight:bold;' +
            '" ' +

            'onclick="removeExistingFile(' +
            index +
            ')">' +

            '✖' +

            '</span>' +

            '</div>';
    });

    document.getElementById(
        'existingEditFiles'
    ).innerHTML = html;
}
    function removeExistingFile(index){

    existingEditFiles.splice(index,1);

    renderExistingFiles();
}
var textarea =
    document.getElementById("newComment");

var mentionBox =
    document.getElementById("mentionBox");

// textarea.addEventListener('keyup', function(e){

//     var text = textarea.value;

//     var cursorPos =
//         textarea.selectionStart;

//     var textUntilCursor =
//         text.substring(0, cursorPos);

//     var match =
//         textUntilCursor.match(/@(\w*)$/);

//     if(match){

//         var keyword =
//             match[1].toLowerCase();

//         var filtered =
//             employees.filter(emp =>
//                 emp.name.toLowerCase()
//                     .includes(keyword)
//             );

//         if(filtered.length){

//             mentionBox.innerHTML = '';

//            filtered.forEach(function(emp){

//     mentionBox.innerHTML +=
//         '<div class="mention-user" ' +
//         'onclick="selectMention(\\'' + emp.name + '\\')">' +

//         emp.name +

//         '</div>';
// });

//             mentionBox.style.display = 'block';

//             var rect =
//                 textarea.getBoundingClientRect();

//             mentionBox.style.left =
//                 rect.left + 'px';

//             mentionBox.style.top =
//                 (rect.bottom + window.scrollY) + 'px';
//         }
//     }
//     else{
//         mentionBox.style.display = 'none';
//     }
// });

function enableMentions(textareaId){

    var textarea =
        document.getElementById(textareaId);

    if(!textarea){
        return;
    }

    textarea.addEventListener('keyup', function(){

        var text =
            textarea.value;

        var cursorPos =
            textarea.selectionStart;

        var textUntilCursor =
            text.substring(0, cursorPos);

        var match =
            textUntilCursor.match(/@(\w*)$/);

        if(match){

            var keyword =
                match[1].toLowerCase();

            var filtered =
                employees.filter(function(emp){

                    return emp.name
                        .toLowerCase()
                        .includes(keyword);
                });

            mentionBox.innerHTML = '';

            filtered.forEach(function(emp){

                mentionBox.innerHTML +=
                    '<div class="mention-user" ' +
                    'onclick="selectMentionForTextarea(\\'' +
                    textareaId +
                    '\\',\\'' +
                    emp.name +
                    '\\')">' +

                    emp.name +

                    '</div>';
            });

            if(filtered.length){

                mentionBox.style.display =
                    'block';

                var rect =
                    textarea.getBoundingClientRect();

                mentionBox.style.left =
                    rect.left + 'px';

                mentionBox.style.top =
                    (rect.bottom + window.scrollY) +
                    'px';
            }

        }else{

            mentionBox.style.display =
                'none';
        }
    });
}
    function selectMentionForTextarea(
    textareaId,
    name
){

    var textarea =
        document.getElementById(textareaId);

    var cursorPos =
        textarea.selectionStart;

    var text =
        textarea.value;

    var textBefore =
        text.substring(0, cursorPos);

    var textAfter =
        text.substring(cursorPos);

    textBefore =
        textBefore.replace(
            /@([a-zA-Z0-9._-]*)$/,
            '@' + name + ' '
        );

    textarea.value =
        textBefore + textAfter;

    mentionBox.style.display =
        'none';

    textarea.focus();

    var newCursorPos =
        textBefore.length;

    textarea.setSelectionRange(
        newCursorPos,
        newCursorPos
    );
}
// function selectMention(name){

//     var cursorPos =
//         textarea.selectionStart;

//     var text =
//         textarea.value;

//     var textBefore =
//         text.substring(0, cursorPos);

//     var textAfter =
//         text.substring(cursorPos);

//     textBefore =
//         textBefore.replace(
//             /@([a-zA-Z0-9._-]*)$/,
//             '@' + name + ' '
//         );

//     textarea.value =
//         textBefore + textAfter;

//     mentionBox.style.display = 'none';

//     textarea.focus();

//     var newCursorPos =
//         textBefore.length;

//     textarea.setSelectionRange(
//         newCursorPos,
//         newCursorPos
//     );
// }

var selectedFiles = [];
    function openReplyBox(commentId){

    var box =
        document.getElementById(
            'replyBox_' + commentId
        );

    box.style.display = 'block';
enableMentions(
    'replyText_' + commentId
);
var replyFile =
    document.getElementById(
        'replyAttachment_' + commentId
    );

replyFile.addEventListener(
    'change',
    function(){

        document.getElementById(
            'replyFileName_' + commentId
        ).innerText =

            this.files.length
            ? '📎 ' + this.files[0].name
            : '';
});

var existingFiles = [];
    document.getElementById(
        'replyText_' + commentId
    ).focus();
}
enableMentions('newComment');
function cancelReply(commentId){

    document.getElementById(
        'replyBox_' + commentId
    ).style.display = 'none';
}
   function saveReply(commentId){

    var comment =
        document.getElementById(
            'replyText_' + commentId
        ).value;

    var fileInput =
        document.getElementById(
            'replyAttachment_' + commentId
        );

    if(!comment){

        alert('Enter reply');
        return;
    }

    var formData = new FormData();

    formData.append(
        'ticketId',
        '${ticketId}'
    );

    formData.append(
        'empid',
        '${empId}'
    );

    formData.append(
        'replyId',
        commentId
    );

    formData.append(
        'commentText',
        comment
    );

    if(fileInput.files.length > 0){

        formData.append(
            'commentAttachment',
            fileInput.files[0]
        );
    }

    fetch(window.location.href,{

        method:'POST',
        body: formData

    })
    .then(() => {

        location.reload();
    });
}
    document
    .getElementById('commentAttachment')
    .addEventListener('change', function(){

        for(
            var i = 0;
            i < this.files.length;
            i++
        ){

            selectedFiles.push(
                this.files[i]
            );
        }

        renderSelectedFiles();

        this.value = '';
});

function renderSelectedFiles(){

    var html = '';

    selectedFiles.forEach(function(file,index){

        html +=
            '<div style="' +
            'display:flex;' +
            'width:200px;'+
            'align-items:center;' +
            'justify-content:space-between;' +
            'margin-top:6px;' +
            'padding:6px 10px;' +
            'background:#f4f5f7;' +
            'border-radius:6px;' +
            '">' +

            '<span>📎 ' +
            file.name +
            '</span>' +

            '<span ' +
            'style="' +
            'cursor:pointer;' +
            'color:red;' +
            'font-weight:bold;' +
            '" ' +

            'onclick="removeFile(' +
            index +
            ')">' +

            '✖' +

            '</span>' +

            '</div>';
    });

    document.getElementById(
        'selectedFileName'
    ).innerHTML = html;
}
    function removeFile(index){

    selectedFiles.splice(index,1);

    renderSelectedFiles();
}

     function goBack(){

    var loader = document.getElementById("loader");
    loader.style.display = "block";   // ✅ show loader

    setTimeout(function(){
        window.parent.location.href = ticketUrl;
    }, 300); // small delay for smooth UX
}
    function replyToComment(id, user){

    document.getElementById(
        "replyCommentId"
    ).value = id;

    var textarea =
        document.getElementById(
            "newComment"
        );

    textarea.value =
        '@' + user + ' ';

    textarea.focus();

    document.getElementById(
        "commentBtn"
    ).innerText = 'Reply';
}
    var existingEditFiles = [];
    function saveComment(){

    var comment =
        document.getElementById("newComment").value;

    var fileInput =
        document.getElementById(
            "commentAttachment"
        );

    var editingId =
        document.getElementById(
            "editingCommentId"
        ).value;

    if(
    !comment ||
    comment.trim() === ''
){

    alert(
        'Comment cannot be empty'
    );

    return;
}

    var formData = new FormData();

    formData.append(
        'ticketId',
        '${ticketId}'
    );

    formData.append(
        'empid',
        '${empId}'
    );

    formData.append(
        'editingId',
        editingId
    );

    formData.append(
        'commentText',
        comment
    );

   selectedFiles.forEach(function(file,index){

    formData.append(
        'commentAttachment_' + index,
        file
    );
});
formData.append(
    'existingFiles',
    JSON.stringify(existingEditFiles)
);
    fetch(window.location.href,{

        method:'POST',
        body: formData

    })
    .then(() => {

      selectedFiles = [];

location.reload();
    });
}
    function updateStatus(statusId){

    var formData = new FormData();

    formData.append(
        'ticketId',
        '${ticketId}'
    );

    formData.append(
        'updateStatus',
        statusId
    );

    fetch(window.location.href,{

        method:'POST',

        body: formData

    })
    .then(function(){

        location.reload();
    });
}
    sessionStorage.setItem(
    'refreshDashboard',
    'true'
);
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
    </script>
    `;

    context.response.writePage(form);
};

return { onRequest };

});