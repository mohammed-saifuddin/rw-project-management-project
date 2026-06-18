/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define([
    'N/ui/serverWidget',
    'N/search',
    'N/record'
], (serverWidget, search,record) => {

    const onRequest = (context) => {

        var request = context.request;

        var templateId = request.parameters.templateid || '';

        var templateName = request.parameters.templatename || '';

        var product = request.parameters.product || '';

        var revenue = request.parameters.revenue || '';

        var form = serverWidget.createForm({
            title: 'Project Plan Detail'
        });

        var htmlField = form.addField({
            id: 'custpage_html',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'HTML'
        });

        var rows = '';
        var milestoneOptions = '';

var addedMilestones = {};

var milestoneSearch = search.create({

    type:'customrecord_rw_project_mile_stone_types',

    filters:[
        ['isinactive','is','F']
    ],

    columns:[
        'internalid',
        'name'
    ]
});

milestoneSearch.run().each(function(r){

    var id =
        r.getValue('internalid');

    var name =
        r.getValue('name');

    if(!addedMilestones[name]){

        milestoneOptions +=

            '<option value="' +
            id +
            '">' +
            name +
            '</option>';

        addedMilestones[name] = true;
    }

    return true;
});
var action = request.parameters.action || '';
function getOrCreateSNO(sno, search, record){

    var snoId = '';

    var snoSearch = search.create({

        type:
        'customlist_rw_serial_no',

        filters:[
            ['name','is',sno]
        ],

        columns:[
            'internalid'
        ]
    });

    snoSearch.run().each(function(r){

        snoId =
            r.getValue('internalid');

        return false;
    });

    if(snoId){
        return snoId;
    }

    var snoRec =
        record.create({

            type:
            'customrecord_rw_sno'
        });

    snoRec.setValue({

        fieldId:'name',

        value:sno.toString()
    });

    return snoRec.save();
}

function isDuplicateMilestone(templateId, milestoneId, excludeRecId){

    var duplicate = false;

    var filters = [
        ['custrecord_rw_proj_plan_temp_child_link','anyof',templateId],
        'AND',
        ['custrecord_rw_project_temp_child_miles','anyof',milestoneId]
    ];

    if(excludeRecId){

        filters.push('AND');

        filters.push([
            'internalid',
            'noneof',
            excludeRecId
        ]);
    }

    var dupSearch = search.create({

        type:'customrecord_rw_project_plan_temp_child',

        filters: filters,

        columns:['internalid']
    });

    dupSearch.run().each(function(){

        duplicate = true;

        return false;
    });

    return duplicate;
}
if(action === 'create'){

    var templateId = request.parameters.template;

    var milestoneId = request.parameters.milestone;

    if(isDuplicateMilestone(templateId, milestoneId)){

        context.response.write(`
            <script>
                alert('Milestone already exists');
                window.history.back();
            </script>
        `);

        return;
    }

    var rec = record.create({

        type:'customrecord_rw_project_plan_temp_child'
    });

    rec.setValue({

        fieldId:'custrecord_rw_proj_plan_temp_child_link',

        value: templateId
    });

    rec.setValue({

        fieldId:'custrecord_rw_proj_plan_temp_child_sno',

        value:getOrCreateSNO(
            request.parameters.tempsno,
            search,
            record
        )
    });

    rec.setValue({

        fieldId:'custrecord_rw_project_temp_child_miles',

        value: milestoneId
    });

    rec.save();
}
if(action === 'delete'){

    var recId =
        request.parameters.recid;

    record.delete({

        type:
        'customrecord_rw_project_plan_temp_child',

        id: recId
    });

    context.response.write('deleted');

    return;
}
if(action === 'update'){

    var recId =
        request.parameters.recid;

    var childRec =
        record.load({

            type:
            'customrecord_rw_project_plan_temp_child',

            id: recId
        });

    childRec.setValue({

        fieldId:
        'custrecord_rw_project_temp_child_miles',

        value:
        request.parameters.milestone
    });

    childRec.setValue({

        fieldId:
        'custrecord_rw_proj_plan_temp_child_sno',

        value:
        request.parameters.tempsno
    });

    childRec.save();

    context.response.write(
        'success'
    );

    return;
}
        var childSearch = search.create({

            type: 'customrecord_rw_project_plan_temp_child',

            filters: [
                
            ],

            columns: [
                'internalid',

                'custrecord_rw_proj_plan_temp_child_sno',

                'custrecord_rw_project_temp_child_miles'
            ]
        });

        if(templateId){

    childSearch.filters.push(
        search.createFilter({
            name:
            'custrecord_rw_proj_plan_temp_child_link',

            operator: search.Operator.ANYOF,

            values: [templateId]
        })
    );
}
var totalRecords = 0;
        var i = 1;

       var renderedMilestones = {};

childSearch.run().each(function(res){

    var recId =
        res.getValue('internalid');

    var sno = i;

    var milestone =
        res.getText(
            'custrecord_rw_project_temp_child_miles'
        ) || '';

    var milestoneId =
        res.getValue(
            'custrecord_rw_project_temp_child_miles'
        ) || '';

    // if(renderedMilestones[milestoneId]){

    //     return true;
    // }

    // renderedMilestones[milestoneId] = true;
    totalRecords++;

    rows += `

<tr>

    <td style="border:1px solid #ddd" >

        <span id="sno_text_${recId}" class="data">
            ${sno}
        </span>

        <input type="text"
               value="${sno}"
               id="sno_${recId}"
               class="input"
               style="display:none;"/>

    </td>

    <td style="border:1px solid #ddd">

        <span id="mile_text_${recId}" class="data">
            ${milestone}
        </span>

        <select
            id="mile_${recId}"
            data-selected="${milestoneId}"
            class="input"
            style="display:none;">

            ${milestoneOptions}

        </select>

   </td>



</tr>

</tr>

<script>

window.addEventListener(
    'load',
    function(){

        var sel =
            document.getElementById(
                'mile_${recId}'
            );

        if(sel){

            sel.value =
                '${milestoneId}';
        }
    }
);

</script>
`;

    i++;

    return true;
});

        var html = `

        <style>

       


body{
    padding:0 !important;
}


#main_form{
    border:none !important;
    box-shadow:none !important;
    background:transparent !important;
    padding:0 !important;
}

.uir-page-title{
    display:none !important;
}

.uir-outside-fields-table{
    border:none !important;
}

.uir-outside-fields-table td{
    border:none !important;
}

.uir-page-body{
    margin:0 !important;
    padding:0 !important;
    border:none !important;
}

      #main_form_div,
#custpage_html_fs,
#custpage_html_val{

    overflow:visible !important;
    height:auto !important;
    max-height:none !important;
}

.card{

    overflow:visible !important;
}
/* DELETE BUTTON */

.delete-btn{

    

    color:red;
    background:white;

    border:none;

    padding:0;

    border-radius:8px;

    cursor:pointer;

    font-size:16px;

    font-weight:600;

    transition:0.3s ease;
}

.delete-btn:hover{

    transform:translateY(-2px);

    box-shadow:
        0 8px 18px rgba(239,68,68,0.25);
}
            .title{
                font-size:24px;
                color:darkblue;
                font-weight:bold;
                margin-bottom:20px;
            }

            .info{
                margin-bottom:10px;
                font-size:14px;
            }

            table{
                width:100%;
                border-collapse:collapse;
                
            }

            th{
                background:#E6E6FA;
                color:darkblue;
                padding:12px;
            }

            td{
                padding:8px;
                
            }
.input{
    width:100%;
    padding:8px;
    border:1px solid #ccc;
    border-radius:6px;
}
.data{
    font-size:12px;
    display:flex;
    padding:0;
    align-items:center;
    justify-content:center;
    color:#333;
    }
button{
    background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
    color:white;
    border:none;
    padding:8px 14px;
    border-radius:6px;
    cursor:pointer;
}
    .count-box{
                margin-bottom:15px;
                padding:10px 15px;
                    background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
                color:white;
                display:flex;
                align-items:right;
                float:right;
                justify-content:right;
                gap:8px;
                
                display:inline-block;
                border-radius:8px;
                font-weight:bold;
            }
                /* HEADER ALIGNMENT */

.top-header{

    width:100%;

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:15px;
}

.left-actions{

    display:flex;

    gap:10px;
}

/* TOTAL RECORD BOX */

.count-box{

    padding:10px 16px;

        background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;

    color:white;

    border-radius:8px;

    font-weight:bold;

    font-size:13px;

    display:flex;

    align-items:center;

    gap:8px;
}
        </style>
               <link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<input type="hidden"
       id="templateId"
       value="${templateId}">
       <input type="hidden"
       id="templateName"
       value="${templateName}">

<input type="hidden"
       id="productName"
       value="${product}">

<input type="hidden"
       id="revenueName"
       value="${revenue}">
        <div class="card">

            <div class="title">
                ${templateName}
            </div>

            <div class="info">
                <b>Product :</b> ${product}
            </div>

            <div class="info">
                <b>Revenue Stream :</b> ${revenue}
            </div>


 <div class="top-header">

    <div class="left-actions">

        <button
        type="button"
        id="topEditBtn"
        onclick="editAllRows()">

        Edit

        </button>

        <button
        type="button"
        id="topSaveBtn"
        style="display:none;"
        onclick="saveAllRows()">

        Save

        </button>

    </div>

    <div class="count-box">

        <i class="fa-solid fa-database"></i>

        Total Records : ${totalRecords}

    </div>

</div>


            <table>

                <thead>

                   <tr>

    <th style="border:1px solid #ddd; font-family:Arial, sans-serif; font-size:12px;text-transform:uppercase;font-weight:bold; background:#E6E6FA">
        S.NO
    </th>

   <th style="border:1px solid #ddd;font-family:Arial, sans-serif;font-size:12px;text-transform:uppercase;font-weight:bold;
background:#E6E6FA">
    Milestone
</th>



    

</tr>

                </thead>

                <tbody id="mileBody">

                    ${rows}

                </tbody>

            </table>

        </div>
<script>
var milestoneDropdownOptions =
    ${JSON.stringify(milestoneOptions)};

function addNewRow(){

    var tbody =
        document.getElementById(
            'mileBody'
        );

    var row =
        document.createElement('tr');

    var nextSno =
        document.querySelectorAll(
            '#mileBody tr'
        ).length + 1;

    row.innerHTML =

        '<td style="border:1px solid #ddd">' +

            nextSno +

        '</td>' +

        '<td style="border:1px solid #ddd">' +

            '<select id="new_mile"' +
                    ' class="input">' +

                milestoneDropdownOptions +

            '</select>' +

        '</td>' +

        '<td style="border:1px solid #ddd">' +

            '<button type="button"' +
                    ' onclick="saveNewMilestone()">' +

                'Save' +

            '</button>' +

        '</td>';

    tbody.appendChild(row);

    row.scrollIntoView({
        behavior:'smooth',
        block:'end'
    });
}

function showToast(message){

    var oldToast =
        document.getElementById(
            'customToast'
        );

    if(oldToast){

        oldToast.remove();
    }

    var toast =
        document.createElement('div');

    toast.id = 'customToast';

    toast.innerHTML = message;

    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.background = '#8f50df';
    toast.style.color = '#fff';
    toast.style.padding = '12px 18px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '999999';
    toast.style.fontSize = '14px';
    toast.style.boxShadow =
        '0 4px 10px rgba(0,0,0,0.2)';

    document.body.appendChild(toast);

    setTimeout(function(){

        toast.remove();

    },3000);
}
window.addEventListener(
    'load',
    function(){

        document.body.style.overflow =
            'hidden';

        document.documentElement.style.overflow =
            'hidden';

        setTimeout(function(){

            var height =
                document.body.scrollHeight;

            if(window.parent){

                var iframe =
                    window.parent.document
                    .querySelector('iframe');

                if(iframe){

                    iframe.style.height =
                        height + 'px';
                }
            }

        },500);
    }
);
async function saveNewMilestone(){

    var milestone =
        document.getElementById(
            'new_mile'
        ).value;

    var templateId =
        document.getElementById(
            'templateId'
        ).value;

    var templateName =
        document.getElementById(
            'templateName'
        ).value;

    var product =
        document.getElementById(
            'productName'
        ).value;

    var revenue =
        document.getElementById(
            'revenueName'
        ).value;

    var sno =
        document.querySelectorAll(
            '#mileBody tr'
        ).length;

    var alreadyExists = false;

    document.querySelectorAll(
        'select[id^="mile_"]'
    ).forEach(function(sel){

        if(sel.value == milestone){

            alreadyExists = true;
        }
    });

    if(alreadyExists){

        // showToast(
        //     'Milestone already exists'
        // );
         alert('Milestone already exists');
        setTimeout(function(){

            location.reload();

        },1000);

        return;
    }

    // showToast(
    //     'Adding milestone...'
    // );
    alert('Adding milestone...');

    var url =
        new URL(window.location.href);

    url.searchParams.set(
        'action',
        'create'
    );

    url.searchParams.set(
        'tempsno',
        sno
    );

    url.searchParams.set(
        'template',
        templateId
    );

    url.searchParams.set(
        'templateid',
        templateId
    );

    url.searchParams.set(
        'templatename',
        templateName
    );

    url.searchParams.set(
        'product',
        product
    );

    url.searchParams.set(
        'revenue',
        revenue
    );

    url.searchParams.set(
        'milestone',
        milestone
    );

    await fetch(
        url.toString()
    );

    showToast(
        'Milestone added successfully'
    );

    setTimeout(function(){

        location.reload();

    },1000);
}

function cancelEditMode(){

    var rows =
        document.querySelectorAll(
            '#mileBody tr'
        );

    rows.forEach(function(row){

        var spanSno =
            row.querySelector(
                'span[id^="sno_text_"]'
            );

        var spanMile =
            row.querySelector(
                'span[id^="mile_text_"]'
            );

        var inputSno =
            row.querySelector(
                'input[id^="sno_"]'
            );

        var selectMile =
            row.querySelector(
                'select[id^="mile_"]'
            );

        if(spanSno)
            spanSno.style.display='block';

        if(spanMile)
            spanMile.style.display='block';

        if(inputSno)
            inputSno.style.display='none';

        if(selectMile){

            selectMile.style.display='none';

            selectMile.style.border =
                '1px solid #ccc';

            selectMile.value =
                selectMile.getAttribute(
                    'data-selected'
                );
        }
    });

    document.getElementById(
        'topEditBtn'
    ).style.display='inline-block';

    document.getElementById(
        'topSaveBtn'
    ).style.display='none';

    document.getElementById(
        'topSaveBtn'
    ).disabled = false;

    document.getElementById(
        'topSaveBtn'
    ).innerHTML = 'Save';
}
async function saveAllRows(){

    var rows =
        document.querySelectorAll(
            '#mileBody tr'
        );

    var selectedMilestones = [];

    var duplicateFound = false;

    var finalSelections = {};

rows.forEach(function(row){

    var select =
        row.querySelector(
            'select[id^="mile_"]'
        );

    if(select){

        var value = select.value;

        if(finalSelections[value]){

            duplicateFound = true;

            select.style.border =
                '2px solid red';

        }else{

            finalSelections[value] = true;

            select.style.border =
                '1px solid #ccc';
        }
    }
});
    if(duplicateFound){

        // showToast(
        //     'Milestone already exists'
        // );
            alert('Milestone already exists');
        setTimeout(function(){

            cancelEditMode();

        },1000);

        return false;
    }

    document.getElementById(
        'topSaveBtn'
    ).innerHTML = 'Saving...';

    document.getElementById(
        'topSaveBtn'
    ).disabled = true;

    for(const row of rows){

        var select =
            row.querySelector(
                'select[id^="mile_"]'
            );

        var snoInput =
            row.querySelector(
                'input[id^="sno_"]'
            );

        if(select && snoInput){

            var recId =
                select.id.replace(
                    'mile_',
                    ''
                );

            var oldValue =
                select.getAttribute(
                    'data-selected'
                );

            if(oldValue != select.value){

                var response =
                    await updateMilestone(recId);

                var text =
                    await response.text();

                if(text.includes(
                    'Milestone already exists'
                )){

                    // showToast(
                    //     'Milestone already exists'
                    // );
                    alert('Milestone already exists');

                    setTimeout(function(){

                        cancelEditMode();

                    },1000);

                    return false;
                }

                select.setAttribute(
                    'data-selected',
                    select.value
                );
            }
        }
    }

    // showToast(
    //     'Milestones updated successfully'
    // );
    alert('Milestones updated successfully');

    setTimeout(function(){

        location.reload();

    },1000);
}

function editAllRows(){

    var rows =
        document.querySelectorAll(
            '#mileBody tr'
        );

    rows.forEach(function(row){

        var spanSno =
            row.querySelector(
                'span[id^="sno_text_"]'
            );

        var spanMile =
            row.querySelector(
                'span[id^="mile_text_"]'
            );

        var inputSno =
            row.querySelector(
                'input[id^="sno_"]'
            );

        var selectMile =
            row.querySelector(
                'select[id^="mile_"]'
            );

        if(spanSno)
            spanSno.style.display='none';

        if(spanMile)
            spanMile.style.display='none';

        if(inputSno)
            inputSno.style.display='block';

        if(selectMile){

            selectMile.style.display='block';

            selectMile.value =
                selectMile.getAttribute(
                    'data-selected'
                );
        }
    });

    document.getElementById(
        'topEditBtn'
    ).style.display='none';

    document.getElementById(
        'topSaveBtn'
    ).style.display='inline-block';
}
    async function deleteMilestone(recId){

    var confirmDelete =
        confirm(
            'Are you sure you want to remove this milestone?'
        );

    if(!confirmDelete){
        return;
    }

    var url =
        new URL(window.location.href);

    url.searchParams.set(
        'action',
        'delete'
    );

    url.searchParams.set(
        'recid',
        recId
    );

    await fetch(
        url.toString()
    );

    alert(
        'Milestone removed successfully'
    );

    setTimeout(function(){

        location.reload();

    },500);
}
    async function deleteMilestone(recId){

    var confirmDelete =
        confirm(
            'Are you sure you want to remove this milestone?'
        );

    if(!confirmDelete){
        return;
    }

    var url =
        new URL(window.location.href);

    url.searchParams.set(
        'action',
        'delete'
    );

    url.searchParams.set(
        'recid',
        recId
    );

    await fetch(
        url.toString()
    );

    alert(
        'Milestone removed successfully'
    );

    setTimeout(function(){

        location.reload();

    },500);
}
async function updateMilestone(recId){

    var sno =
        document.getElementById(
            'sno_' + recId
        ).value;

    var milestone =
        document.getElementById(
            'mile_' + recId
        ).value;

    var templateId =
        document.getElementById(
            'templateId'
        ).value;

    var product =
        document.getElementById(
            'productName'
        ).value;

    var revenue =
        document.getElementById(
            'revenueName'
        ).value;

    var templateName =
        document.getElementById(
            'templateName'
        ).value;

    var url =
        new URL(window.location.href);

    url.searchParams.set(
        'templateid',
        templateId
    );

    url.searchParams.set(
        'templatename',
        templateName
    );

    url.searchParams.set(
        'product',
        product
    );

    url.searchParams.set(
        'revenue',
        revenue
    );

    url.searchParams.set(
        'action',
        'update'
    );

    url.searchParams.set(
        'recid',
        recId
    );

    url.searchParams.set(
        'tempsno',
        sno
    );

    url.searchParams.set(
        'milestone',
        milestone
    );

    return fetch(
        url.toString()
    );
}
function editRow(recId){

    document.getElementById(
        'sno_text_' + recId
    ).style.display = 'none';

    document.getElementById(
        'mile_text_' + recId
    ).style.display = 'none';

    document.getElementById(
        'sno_' + recId
    ).style.display = 'block';

    document.getElementById(
        'mile_' + recId
    ).style.display = 'block';

    document.getElementById(
        'edit_' + recId
    ).style.display = 'none';

    document.getElementById(
        'save_' + recId
    ).style.display = 'inline-block';
    var sel =
    document.getElementById(
        'mile_' + recId
    );

if(sel){

    sel.value =
        sel.getAttribute(
            'data-selected'
        );
}
}
if(window.opener){

    window.opener.refreshNotifications();
}

if(window.parent){

    window.parent.refreshNotifications();
}
</script>
        `;

        htmlField.defaultValue = html;

        context.response.writePage(form);
    };

    return { onRequest };
});