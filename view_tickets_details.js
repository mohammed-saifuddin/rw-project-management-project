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
var empId = request.parameters.empid;
log.debug("Ticket ID Received", ticketId);
 var req = context.request;
        var attachment = '';
        
var ticketId = request.parameters.ticketId;
if(request.method === 'POST'){
    var replyId =
    request.parameters.replyId;

    try{

        log.debug("POST STARTED");

        var commentText =
            request.parameters.commentText;

        var ticketId =
            request.parameters.ticketId;

        log.debug("COMMENT TEXT", commentText);
        log.debug("TICKET ID", ticketId);

        if(commentText){

           var commentRec;

if(editingId){

    commentRec = record.load({
        type:'customrecord_rw_ticket_comment',
        id: editingId,
        isDynamic:true
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
          status=ticketRec.getText('custrecord_rw_ticket_ticketstatus')
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
        'custrecord_rw_ticket_comments_replycmmnt'
    ]
});

var commentsMap = {};
var replyMap = {};

commentSearch.run().each(function(result){

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

            <button
                type="button"
                class="edit-comment-btn"
                onclick="editComment(
                    '${commentId}',
                    '${rawComment
                        .replace(/'/g, "\\'")
                        .replace(/"/g, '&quot;')
                        .replace(/\n/g, ' ')
                    }'
                )">

                Edit

            </button>

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
</div>

<div
    id="replyBox_${commentId}"
    class="reply-input-box"
    style="display:none;">

    <textarea
        id="replyText_${commentId}"
        class="reply-textarea"
        placeholder="Write a reply..."></textarea>

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

        replyMap[parentComment].push(html);

    }else{

        commentsMap[commentId] = html;
    }

    return true;
});
var commentsListHtml = '';

Object.keys(commentsMap).forEach(function(commentId){

    commentsListHtml += commentsMap[commentId];

    if(replyMap[commentId]){

        commentsListHtml +=
            '<div class="reply-wrapper">';

        replyMap[commentId].forEach(function(replyHtml){

            commentsListHtml += replyHtml;
        });

        commentsListHtml += '</div>';
    }
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
    <textarea id="newComment"
        placeholder="Add a comment..."
        style="
            width:100%;
            height:80px;
            padding:10px;
            border-radius:8px;
            border:1px solid #ccc;
        ">
    </textarea>

    <button type="button"
        onclick="saveComment()"
        style="
            margin-top:10px;
            background:#6f3ba2;
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
    background:#6f3ba2;
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
    border-color:#6f3ba2;
    box-shadow:0 0 0 3px rgba(111,59,162,0.15);
}

/* BUTTON */

.comment-btn{
    margin-top:12px;
    background:#6f3ba2;
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
    background:#6f3ba2;
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
.reply-wrapper{
    margin-left:65px;
    border-left:2px solid #dfe1e6;
    padding-left:18px;
    margin-top:8px;
}
.reply-btn:hover{
    text-decoration:underline;
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
function editComment(id, text){

    document.getElementById("newComment").value =
        text.replace(/<[^>]*>/g,'');

    document.getElementById("editingCommentId").value =
        id;

    document.getElementById("newComment").focus();

    window.scrollTo({
        top: document.getElementById("newComment")
            .offsetTop - 120,
        behavior:'smooth'
    });
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
    function openReplyBox(commentId){

    var box =
        document.getElementById(
            'replyBox_' + commentId
        );

    box.style.display = 'block';
enableMentions(
    'replyText_' + commentId
);
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

    if(!comment){

        alert('Enter reply');

        return;
    }

    fetch(window.location.href,{

        method:'POST',

        headers:{
            'Content-Type':
                'application/x-www-form-urlencoded'
        },

        body:
            'ticketId=${ticketId}' +
            '&empid=${empId}' +
            '&replyId=' + commentId +
            '&commentText=' +
            encodeURIComponent(comment)

    })
    .then(() => {

        location.reload();
    });
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
    function saveComment(){

    var comment =
        document.getElementById("newComment").value;
var editingId =
    document.getElementById("editingCommentId").value;
    var replyId =
    document.getElementById(
        "replyCommentId"
    ).value;
    if(!comment){
        alert("Enter comment");
        return;
    }

    fetch(window.location.href,{
        method:'POST',

        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        },

     body:
    'ticketId=${ticketId}' +
    '&empid=${empId}' +
    '&editingId=' + editingId +
    
    '&commentText=' + encodeURIComponent(comment)
    })
    .then(() => {
        location.reload();
    });
}
    </script>
    `;

    context.response.writePage(form);
};

return { onRequest };

});