/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/url','N/search','N/format','N/file','N/runtime'], (serverWidget, record, url, search,format,file,runtime) => {

const onRequest = (context) => {
   
if (context.request.method === 'POST') {
var reqBody = JSON.parse(
    context.request.body || '{}'
);
if(reqBody.action === 'deleteProduct'){

    try{

        record.submitFields({
            type: 'customrecord_rw_portal_access2',
            id: reqBody.lineId,
            values:{
                isinactive: true
            }
        });

        context.response.write(
            JSON.stringify({
                success:true
            })
        );

        return;

    }catch(e){

        context.response.write(
            JSON.stringify({
                success:false,
                message:e.message
            })
        );

        return;
    }
}
var body =
    reqBody.data || [];

var milestoneData =
    reqBody.milestoneData || [];

var projectStatus =
    reqBody.projectStatus || '';

var updatedEndDate =
    reqBody.updatedEndDate || '';

var pmoComments =
    reqBody.pmoComments || '';

var projectId =
    reqBody.projectId || '';

var empId =
    reqBody.empid || '';
    
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

    try{

        roleName = String(
            roleName || ''
        ).toLowerCase();

        if(roleName.includes('pmo')){
            return 'PMO';
        }

        if(roleName.includes('developer')){
            return 'DEV';
        }

        if(roleName.includes('pm')){
            return 'PM';
        }

        return 'OTHER';

    }catch(e){

        log.error(
            'ROLE TYPE ERROR',
            e
        );

        return 'OTHER';
    }
}

function safeDate(dateStr){

    if(!dateStr){
        return null;
    }

    try{

        var d = new Date(dateStr);

        if(isNaN(d.getTime())){
            return null;
        }

        return d;

    }catch(e){

        return null;
    }
}
log.debug(
    'FINAL MILESTONE DATA',
    JSON.stringify(milestoneData)
);

var dmsRole =
    getEmployeeDMSRole(empId);

log.debug(
    'POST DMS ROLE',
    dmsRole
);

var roleType =
    getRoleTypeFromDMS(dmsRole);
var isEditMode = false;
var hasChanges = false;
log.debug(
    'POST ROLE TYPE',
    roleType
);
    // try {
    //     body = JSON.parse(context.request.body);
    // } catch (e) {
    //     body = JSON.parse(context.request.parameters.data || "[]");
    // }

    log.debug("FINAL BODY", body);

    log.debug(body);
    if (!body || body.length === 0) {
        context.response.write("No data received");
        return;
    }
    // var milestoneData =
    // context.request.parameters
    // .milestoneData || [];

// try{

//     milestoneData =
//         JSON.parse(milestoneData);

// }catch(e){

//     milestoneData = [];
// }
var oldProjectRec = record.load({
    type: 'customrecord_rw_portal_access',
    id: projectId,
    isDynamic: false
});

var oldProjectStatus =
    oldProjectRec.getText(
        'custrecord_rw_portal_status'
    ) || '';

var customer =
    oldProjectRec.getText(
        'custrecord_rw_portal_customername'
    ) || '';
   
var newProjectStatusText = '';
function parseInputDate(dateStr){

    if(!dateStr) return null;

    var parts = dateStr.split('-');

    return new Date(
        parts[0],        // year
        parts[1] - 1,    // month
        parts[2]         // day
    );
}
if(projectStatus){

    var projStatusSearch = search.create({
        type: 'customlist_rw_portal_statuslist',
        filters: [
            ['internalid','anyof', projectStatus],
            
        ],
        columns: ['name']
    });

    var projRes =
        projStatusSearch.run().getRange({
            start: 0,
            end: 1
        });

    if(projRes.length > 0){

        newProjectStatusText =
            projRes[0].getValue('name') || '';
    }
}
   body.forEach(function(line){

    // =====================================
    // CREATE NEW PRODUCT
    // =====================================
log.debug(
    'NEW LINE RECEIVED',
    JSON.stringify(line)
);
    if(!line.id){

    try{

        log.debug(
            'NEW LINE DATA',
            JSON.stringify(line)
        );

        log.debug(
            'PROJECT ID',
            projectId
        );

        var newLine = record.create({

            type:
            'customrecord_rw_portal_access2',

            isDynamic:true
        });

        // PARENT LINK
        newLine.setValue({

            fieldId:
            'custrecord1513',

            value:
            Number(projectId)
        });

        // PRODUCT
        if(line.productid){

            newLine.setValue({

                fieldId:
                'custrecord_rw_portal_rwproduct',

                value:
                Number(line.productid)
            });
        }

        // COMMENTS
        if(line.comments){

            newLine.setValue({

                fieldId:
                'custrecord_rw_portal_additionalcomments',

                value:
                line.comments
            });
        }

        // PM
        if(line.rwpm){

            newLine.setValue({

                fieldId:
                'custrecord_rw_rwprojectmanager',

                value:
                Number(line.rwpm)
            });
        }

        // FUNCTIONAL
        if(line.functional){

            newLine.setValue({

                fieldId:
                'custrecord_rw_portal_funcconsultant',

                value:
                Number(line.functional)
            });
        }

        // TECHNICAL
        if(line.technical){

            newLine.setValue({

                fieldId:
                'custrecord_rw_portal_techconsultant',

                value:
                Number(line.technical)
            });
        }

        // STATUS
        if(line.status){

            newLine.setValue({

                fieldId:
                'custrecord_rw_portal_projstat',

                value:
                Number(line.status)
            });
        }

        // START DATE
        if(line.startdate){

            newLine.setValue({

                fieldId:
                'custrecord_rw_portal_startdateline',

                value:
                parseInputDate(
                    line.startdate
                )
            });
        }

        // END DATE
        if(line.enddate){

            newLine.setValue({

                fieldId:
                'custrecord_rw_portal_enddateline',

                value:
                parseInputDate(
                    line.enddate
                )
            });
        }

        // UPDATED DEADLINE
        if(line.updateddeadline){

            newLine.setValue({

                fieldId:
                'custrecord_rw_portal_updateddeadline',

                value:
                parseInputDate(
                    line.updateddeadline
                )
            });
        }

        // DURATION
        if(line.duration){

            newLine.setValue({

                fieldId:
                'custrecord_rw_portal_durationline',

                value:
                line.duration
            });
        }

        var newId = newLine.save({

            enableSourcing:true,

            ignoreMandatoryFields:false
        });
        return;
        log.debug(
            'NEW RECORD CREATED',
            newId
        );

    }catch(e){

        log.error(
            'NEW RECORD ERROR',
            e
        );
        return;
    }

    
}

       

    // =====================================
    // UPDATE EXISTING PRODUCT
    // =====================================

    var values = {};

    

if(line.functional){
    values['custrecord_rw_portal_funcconsultant'] = line.functional;
}

if(line.technical){
    values['custrecord_rw_portal_techconsultant'] = line.technical;
}
if(line.rwpm){
    values['custrecord_rw_rwprojectmanager'] =
        line.rwpm;
}
values['custrecord_rw_portal_lineexpecteduatdate'] =
    parseInputDate(line.uat);

values['custrecord_rw_portal_lineexptgolivedate'] =
    parseInputDate(line.golive);

values['custrecord_rw_portal_startdateline'] =
    parseInputDate(line.startdate);

values['custrecord_rw_portal_enddateline'] =
    parseInputDate(line.enddate);

values['custrecord_rw_portal_updateddeadline'] =
    parseInputDate(line.updateddeadline);

values['custrecord_rw_portal_lineexpecteduatdate'] =
    parseInputDate(line.uat);

values['custrecord_rw_portal_lineexptgolivedate'] =
    parseInputDate(line.golive);
if(line.status){
    values['custrecord_rw_portal_projstat'] = line.status;
}
values['custrecord_rw_portal_durationline'] =
    line.duration || '';


var oldLine = record.load({
    type: 'customrecord_rw_portal_access2',
    id: line.id,
    isDynamic: false
});

var oldStatusText =
    oldLine.getText('custrecord_rw_portal_projstat') || '';

var oldStatusId =
    oldLine.getValue('custrecord_rw_portal_projstat') || '';

var newStatusId = line.status || '';




var newStatusText =
    line.statusText || '';
if(newStatusId){

    var statusSearch = search.create({
        type: 'customlist_rw_portal_access_pjstlist',
        filters: [
            ['internalid','anyof', newStatusId]
        ],
        columns: ['name']
    });

    var res = statusSearch.run().getRange({
        start: 0,
        end: 1
    });

    if(res.length > 0){

        newStatusText =
            res[0].getValue('name') || '';
    }
}

var projectStatusChanged =
    String(oldProjectStatus) !=
    String(newProjectStatusText);

var productStatusChanged =
    newStatusId &&
    String(oldStatusId) !=
    String(newStatusId);

if(
    projectStatusChanged ||
    productStatusChanged
){

    var productText =
        oldLine.getText('custrecord_rw_portal_rwproduct') || '';

    var histRec = record.create({
        type: 'customrecord_rw_project_status_history',
        isDynamic: true
    });

    histRec.setValue({
        fieldId: 'custrecord_rw_hist_project',
        value: Number(projectId)
    });

    histRec.setValue({
        fieldId: 'custrecord_rw_hist_line',
        value: line.id
    });

    histRec.setValue({
        fieldId: 'custrecord_rw_hist_product',
        value: productText
    });

    histRec.setValue({
        fieldId: 'custrecord_rw_hist_oldstatus',
        value: oldStatusText || '-'
    });
histRec.setValue({
    fieldId: 'custrecord_rw_hist_oldprojstatus',
    value: oldProjectStatus || ''
});

histRec.setValue({
    fieldId: 'custrecord_rw_hist_projectstatus',
    value: newProjectStatusText || ''
});
   histRec.setValue({
    fieldId: 'custrecord_rw_hist_newstatus',
    value:
        productStatusChanged
        ? newStatusText
        : oldStatusText
});
    histRec.setValue({
        fieldId: 'custrecord_rw_hist_changedby',
        value: Number(empId)
    });

    histRec.setValue({
        fieldId: 'custrecord_rw_hist_changedon',
        value: new Date()
    });

    histRec.setValue({
        fieldId: 'custrecord_rw_hist_startdate',
        value: line.startdate
            ? new Date(line.startdate)
            : null
    });

    histRec.setValue({
        fieldId: 'custrecord_rw_hist_enddate',
        value: line.enddate
            ? new Date(line.enddate)
            : null
    });

    histRec.setValue({
        fieldId: 'custrecord_rw_hist_updateddeadline',
        value: line.updateddeadline
            ? new Date(line.updateddeadline)
            : null
    });

    histRec.setValue({
        fieldId: 'custrecord_rw_hist_duration',
        value: line.duration || ''
    });

    var histId = histRec.save({
    enableSourcing: true,
    ignoreMandatoryFields: true
});

log.debug(
    'HISTORY SAVED',
    histId
);
}



record.submitFields({
    type: 'customrecord_rw_portal_access2',
    id: line.id,
    values: values
});
    });
var oldProjectRec = record.load({
    type: 'customrecord_rw_portal_access',
    id: projectId,
    isDynamic: false
});

var oldProjectStatus =
    oldProjectRec.getText(
        'custrecord_rw_portal_status'
    ) || '';

var newProjectStatusText = '';

if(projectStatus){

    var projStatusSearch = search.create({
        type: 'customlist_rw_portal_statuslist_header',
        filters: [
            ['internalid','anyof', projectStatus]
        ],
        columns: ['name']
    });

    var projRes =
        projStatusSearch.run().getRange({
            start: 0,
            end: 1
        });

    if(projRes.length > 0){

        newProjectStatusText =
            projRes[0].getValue('name') || '';
    }
}


if(projectId){

    var updateValues = {};

if(roleType === 'PMO'){

    if(projectStatus){

        updateValues.custrecord_rw_portal_status =
            projectStatus;
    }

    if(updatedEndDate){

        updateValues.custrecord_rw_portal_updatedenddate =
            safeDate(updatedEndDate);
    }

    updateValues.custrecord_rw_portal_pmocommnts =
        pmoComments || '';
}

if(projectStatus){

    updateValues.custrecord_rw_portal_status =
        projectStatus;
}

if(roleType === 'PMO' || roleType === 'PM'){

    if(updatedEndDate){

        updateValues.custrecord_rw_portal_updatedenddate =
            safeDate(updatedEndDate);
    }

    updateValues.custrecord_rw_portal_pmocommnts =
        pmoComments || '';
}
var customerId =
    oldProjectRec.getValue(
        'custrecord_rw_portal_customername'
    ) || '';

var directProject =
    oldProjectRec.getValue(
        'custrecord_rw_portal_directproject'
    ) || '';

log.debug(
    'CUSTOMER link',
    customerId
);


function getDefaultMilestoneStatus(){

    var statusId = '';

    search.create({

        type:
        'customlist_rw_portal_milestone_status',

        filters: [
            ['name','is','Not Started']
        ],

        columns: ['internalid']

    })
    .run()
    .each(function(r){

        statusId =
            r.getValue('internalid');

        return false;
    });

    return statusId;
}

var defaultMilestoneStatus =
    getDefaultMilestoneStatus();
if(roleType === 'PM'){

     milestoneData.forEach(function(ms){

    var planId = ms.id || '';

    // CREATE NEW RECORD
    if(!planId){

        var newRec = record.create({
            type: 'customrecord_rw_customer_project_plan',
            isDynamic: true
        });

    if(customerId){

    newRec.setValue({

        fieldId:
        'custrecord_rw_cust_proj_plan_link',

        value:
        customerId
    });
}

        if(ms.milestoneid){
            newRec.setValue({
                fieldId: 'custrecord_rw_cust_proj_mile_stone',
                value: ms.milestoneid
            });
        }
        
        if(ms.productid){
            newRec.setValue({
                fieldId: 'custrecord_rw_cust_proj_plan_prod_serv',
                value: ms.productid
            });
        }
      if(directProject && directProject !== 'null'){

    newRec.setValue({
        fieldId:
        'custrecord_rw_cust_proj_rev_stream',
        value: directProject
    });
}
      
      
        if(ms.startdate){
            newRec.setValue({
                fieldId:
                'custrecord_rw_cust_proj_mile_start_date',
                value:safeDate(ms.startdate)
            });
        }
         if(ms.sno){
newRec.setValue({
                fieldId:
                'custrecord_rw_cust_proj_plan_sno',
                value:ms.sno
            });
         }



        if(ms.enddate){
            newRec.setValue({
                fieldId:
                'custrecord_rw_cust_proj_plan_end_date',
                value:safeDate(ms.enddate)
            });
        }

        newRec.setValue({
            fieldId:
            'custrecord_rw_cust_proj_planest_duration',
            value: ms.duration || ''
        });

        if(ms.actual){
            newRec.setValue({
                fieldId:
                'custrecord_rw_cust_proj_plan_act_compl',
                value:safeDate(ms.actual)
            });
        }

        newRec.setValue({
            fieldId:
            'custrecord_rw_cust_proj_plan_aging',
            value: ms.aging || ''
        });

        newRec.setValue({
            fieldId:
            'custrecord_rw_cust_proj_plan_time_spent',
            value: ms.timespent || ''
        });
newRec.setValue({

    fieldId:
    'custrecord_rw_portal_milestone_status',

    value:
        ms.status ||
        defaultMilestoneStatus
});

newRec.setValue({
    fieldId:
    'custrecord_re_portal_milestone_comments',
    value: ms.comments || ''
});
        var newId = newRec.save({
            enableSourcing:true,
            ignoreMandatoryFields:true
        });

        log.debug('NEW MILESTONE CREATED', newId);

    }

    // UPDATE EXISTING
    else{

        record.submitFields({

            type:
            'customrecord_rw_customer_project_plan',

            id: planId,

            values: {

                custrecord_rw_cust_proj_mile_start_date:
                    safeDate(ms.startdate),

                custrecord_rw_cust_proj_plan_end_date:
                    safeDate(ms.enddate),

                custrecord_rw_cust_proj_planest_duration:
                    ms.duration || '',

                custrecord_rw_cust_proj_plan_act_compl:
                    safeDate(ms.actual),

                custrecord_rw_cust_proj_plan_aging:
                    ms.aging || '',
custrecord_rw_cust_proj_plan_sno:
    ms.sno || '',


                custrecord_rw_cust_proj_plan_time_spent:
    ms.timespent || '',

custrecord_rw_portal_milestone_status:
    ms.status || defaultMilestoneStatus,

	custrecord_re_portal_milestone_comments:
    ms.comments || ''
            }
        });
    }
});
}
  
    record.submitFields({
        type: 'customrecord_rw_portal_access',
        id: projectId,
        values: updateValues
    });
}
function getMilestoneStatusId(name){

    var statusId = '';

    search.create({

        type:
        'customlist_rw_portal_milestone_status',

        filters: [
            ['name','is', name]
        ],

        columns: ['internalid']

    })
    .run()
    .each(function(r){

        statusId =
            r.getValue('internalid');

        return false;
    });

    return statusId;
}

function getProductStatusId(name){

    var statusId = '';

    search.create({

        type:
        'customlist_rw_portal_statuslist_line',

        filters: [
            ['name','is', name]
        ],

        columns: ['internalid']

    })
    .run()
    .each(function(r){

        statusId =
            r.getValue('internalid');

        return false;
    });

    return statusId;
}

function getProjectStatusId(name){

    var statusId = '';

    search.create({

        type:
        'customlist_rw_portal_statuslist_header',

        filters: [
            ['name','is', name]
        ],

        columns: ['internalid']

    })
    .run()
    .each(function(r){

        statusId =
            r.getValue('internalid');

        return false;
    });

    return statusId;
}
// ============================================
// AUTO SYNC PRODUCT STATUS FROM MILESTONES
// ============================================

function getCompletedMilestoneStatusId(){

    var completedId = '';

    search.create({
        type: 'customlist_rw_portal_milestone_status',
        filters: [
            ['name','is','Completed']
        ],
        columns: ['internalid']
    })
    .run()
    .each(function(r){

        completedId = r.getValue('internalid');
        return false;
    });

    return completedId;
}

function getCompletedProductStatusId(){

    var completedId = '';

    search.create({
        type: 'customlist_rw_portal_statuslist_line',
        filters: [
            ['name','is','Completed']
        ],
        columns: ['internalid']
    })
    .run()
    .each(function(r){

        completedId = r.getValue('internalid');
        return false;
    });

    return completedId;
}

function getCompletedProjectStatusId(){

    var completedId = '';

    search.create({
        type: 'customlist_rw_portal_statuslist_header',
        filters: [
            ['name','is','Done']
        ],
        columns: ['internalid']
    })
    .run()
    .each(function(r){

        completedId = r.getValue('internalid');
        return false;
    });

    return completedId;
}

var completedMilestoneStatusId =
    getCompletedMilestoneStatusId();

var completedProductStatusId =
    getCompletedProductStatusId();

var completedProjectStatusId =
    getCompletedProjectStatusId();

var notStartedMilestoneStatusId =
    getMilestoneStatusId('Not Started');

var todoMilestoneStatusId =
    getMilestoneStatusId('To do');

var inProgressMilestoneStatusId =
    getMilestoneStatusId('In Progress');

var kickoffProductStatusId =
    getProductStatusId('Kick Off');

var kickoffProjectStatusId =
    getProjectStatusId('Kick Off');
// ============================================
// CHECK EACH PRODUCT
// ============================================

var lineSearchSync = search.create({

    type: 'customrecord_rw_portal_access2',

    filters: [
        ['custrecord1513','anyof', projectId]
    ],

    columns: [
        'internalid',
        'custrecord_rw_portal_rwproduct'
    ]
});

var allProductsCompleted = true;
lineSearchSync.run().each(function(lineRes){

    var lineId =
        lineRes.getValue('internalid');

    var productId =
        lineRes.getValue(
            'custrecord_rw_portal_rwproduct'
        );

    var totalMilestones = 0;

    var completedMilestones = 0;

    var hasStartedMilestone = false;

    var milestoneSearchSync = search.create({

        type:
        'customrecord_rw_customer_project_plan',

        filters: [

            [
                'custrecord_rw_cust_proj_plan_prod_serv',
                'anyof',
                productId
            ],

            'AND',

            [
                'custrecord_rw_cust_proj_plan_link',
                'anyof',
                customerId
            ]
        ],

        columns: [
            'custrecord_rw_portal_milestone_status'
        ]
    });

    milestoneSearchSync.run().each(function(ms){

        totalMilestones++;

        var msStatus =
            ms.getValue(
                'custrecord_rw_portal_milestone_status'
            );

        // COMPLETED
        if(
            String(msStatus) ===
            String(completedMilestoneStatusId)
        ){
            completedMilestones++;
        }

        // STARTED
        if(
            String(msStatus) ===
            String(todoMilestoneStatusId)
            ||
            String(msStatus) ===
            String(inProgressMilestoneStatusId)
        ){

            hasStartedMilestone = true;
        }

        return true;
    });

    // =====================================
    // PRODUCT COMPLETED
    // =====================================

  // =====================================
// PRODUCT STATUS AUTO SYNC
// =====================================

if(
    totalMilestones > 0 &&
    totalMilestones === completedMilestones
){

    // AUTO COMPLETE
    record.submitFields({

        type:
        'customrecord_rw_portal_access2',

        id: lineId,

        values: {

            custrecord_rw_portal_projstat:
                completedProductStatusId
        }
    });

}
else if(hasStartedMilestone){

    // LOAD CURRENT PRODUCT STATUS
    var currentLineRec = record.load({

        type:
        'customrecord_rw_portal_access2',

        id: lineId,

        isDynamic:false
    });

    var currentProductStatus =
        currentLineRec.getValue(
            'custrecord_rw_portal_projstat'
        );

    // ONLY SET KICK OFF
    // IF STATUS IS EMPTY OR NOT STARTED

    if(

        !currentProductStatus

        ||

        String(currentProductStatus) ===
        String(
            getProductStatusId('Not Started')
        )

    ){

        record.submitFields({

            type:
            'customrecord_rw_portal_access2',

            id: lineId,

            values: {

                custrecord_rw_portal_projstat:
                    kickoffProductStatusId
            }
        });
    }

    allProductsCompleted = false;
}
else{

    allProductsCompleted = false;
}

    return true;
});


// ============================================
// PROJECT STATUS UPDATE
// ============================================

if(allProductsCompleted){

    record.submitFields({

        type:
        'customrecord_rw_portal_access',

        id: projectId,

        values: {

            custrecord_rw_portal_status:
                completedProjectStatusId
        }
    });

}
else{

    var currentProjectRec = record.load({

        type:
        'customrecord_rw_portal_access',

        id: projectId,

        isDynamic:false
    });

    var currentProjectStatus =
        currentProjectRec.getValue(
            'custrecord_rw_portal_status'
        );

    if(

        !currentProjectStatus

        ||

        String(currentProjectStatus) ===
        String(
            getProjectStatusId('Not Started')
        )

    ){

        var hasAnyStartedMilestone = false;

        lineSearchSync.run().each(function(lineRes){

            var productId =
                lineRes.getValue(
                    'custrecord_rw_portal_rwproduct'
                );

            var msSearch = search.create({

                type:
                'customrecord_rw_customer_project_plan',

                filters:[

                    [
                        'custrecord_rw_cust_proj_plan_prod_serv',
                        'anyof',
                        productId
                    ],

                    'AND',

                    [
                        'custrecord_rw_cust_proj_plan_link',
                        'anyof',
                        customerId
                    ],

                    'AND',

                    [
                        'custrecord_rw_portal_milestone_status',
                        'anyof',
                        [
                            todoMilestoneStatusId,
                            inProgressMilestoneStatusId
                        ]
                    ]
                ],

                columns:['internalid']
            });

            var c =
                msSearch.run().getRange({
                    start:0,
                    end:1
                });

            if(c.length > 0){

                hasAnyStartedMilestone = true;

                return false;
            }

            return true;
        });

        if(hasAnyStartedMilestone){

            record.submitFields({

                type:
                'customrecord_rw_portal_access',

                id: projectId,

                values: {

                    custrecord_rw_portal_status:
                        kickoffProjectStatusId
                }
            });
        }
    }
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
createNotification(
    empId,
    'Project Updated : ' + customer,
    'PROJECT_UPDATED',
    projectId
);
    context.response.write('success');
    return;
}
    var form = serverWidget.createForm({ title: ' ' });
    function getProjectStatusClass(status){

    status = (status || '')
        .toLowerCase()
        .trim();

    if(status.includes('not started')){
        return 'notstarted';
    }

    if(status.includes('kick off')){
        return 'kickoff';
    }

    if(status.includes('in progress')){
        return 'inprogress';
    }

    if(status.includes('uat')){
        return 'uat';
    }

    if(status.includes('done') || status.includes('completed')){
        return 'done';
    }

    return 'notstarted';
}
var statOptions ='<option value="">--Select--</option>';


var rwOptions ='<option value="">--Select--</option>';
var rwSearch=search.create({
    type:'customrecord_rw_extend_products',
    columns:['internalid','name']
})
rwSearch.run().each(function(result){
    rwOptions +='<option value="'+result.getValue('internalid')+'">'+result.getValue('name')+'</option>';
    return true;
})
// statSearch1.run().each(function(result){

//     var id = result.getValue('internalid');
//     var name = result.getValue('name');

//      var isSelected = (name === 'To-Do') ? 'selected' : '';


// statOptions += '<option value="'+id+'" '+isSelected+'>'+name+'</option>';

//     return true;
// });
var statSearch = search.create({
    type: 'customlist_rw_portal_statuslist_line',
    columns: ['internalid','name']
});

var request = context.request;
    var projectId = request.parameters.projectId;
 var email = context.request.parameters.email || '';
    var empId = context.request.parameters.empid 
         || context.request.parameters.empId 
         || context.request.parameters.employeeId 
         || '';
var empOptions = '<option value="">--Select--</option>';
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

    var empData = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empInternalId,
        columns: ['role']
    });

    if(empData.role && empData.role.length > 0){
        return empData.role[0].text;
    }

    return '';
}
var empRole = getEmployeeRole(empInternalId);
log.debug("Employee Role", empRole);
function getRoleType(roleName){

    try{

        roleName = String(
            roleName || ''
        ).toLowerCase();

        if(roleName.includes('pmo')){
            return 'PMO';
        }

        if(roleName.includes('pm')){
            return 'PM';
        }

        if(roleName.includes('developer')){
            return 'DEV';
        }

        return 'OTHER';

    }catch(e){

        log.error(
            'GET ROLE TYPE ERROR',
            e
        );

        return 'OTHER';
    }
}

var roleType = getRoleType(empRole);
log.debug("role type",roleType);
var tableHeader = '';
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

    if(!empId) return '';

    var emp = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empId,
        columns: ['custentityrw_dms_role']   
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
var empInternalId = getEmployeeInternalId(email);
var dmsRole = getEmployeeDMSRole(empInternalId);
var roleType = getRoleTypeFromDMS(dmsRole);

log.debug("DMS ROLE", dmsRole);
log.debug("ROLE TYPE", roleType);
if(roleType === 'PMO'){
    tableHeader = `
        <tr style="background:
linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
); color:darkblue;">
            <th style="border:1px solid #ccc;padding:8px;">RW Product</th>
            <th style="border:1px solid #ccc;padding:8px;">Comments</th>
            <th style="border:1px solid #ccc;padding:8px;">Status</th>
            <th style="border:1px solid #ccc;padding:8px;">Start Date</th>
            <th style="border:1px solid #ccc;padding:8px;">End Date</th>
            <th style="border:1px solid #ccc;padding:8px;">Updated Deadline</th>
           <th style="border:1px solid #ccc;padding:8px;">Duration</th>
           <th class="edit-action-col" style="display:none;border:1px solid #ccc;padding:8px;">
    Action
</th>
       
        </tr>
    `;
}  else if (roleType === 'PM') {
    tableHeader = `
        <tr style="background:
linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
); color:darkblue;">
            <th style="border:1px solid #ccc;padding:8px;">RW Product</th>
            <th style="border:1px solid #ccc;padding:8px;">Comments</th>
            <th style="border:1px solid #ccc;padding:8px;">Project Manager</th>
            <th style="border:1px solid #ccc;padding:8px;">Functional consultant</th>
            <th style="border:1px solid #ccc;padding:8px;">Technical consultant</th>
            <th style="border:1px solid #ccc;padding:8px;">Expected UAT</th>
            <th style="border:1px solid #ccc;padding:8px;">Expected Go Live</th>
            <th style="border:1px solid #ccc;padding:8px;">Status</th>
            <th style="border:1px solid #ccc;padding:8px;">Start Date</th>
            <th style="border:1px solid #ccc;padding:8px;">End Date</th>
            <th style="border:1px solid #ccc;padding:8px;">Updated Deadline</th>
            <th class="edit-action-col" style="display:none;border:1px solid #ccc;padding:8px;">
    Action
</th>
      
        </tr>
    `;
}else {
    tableHeader = `
        <tr style="background:linear-gradient(135deg, #E6E6FA, #E6E6FA); color:darkblue;">
            <th style="border:1px solid #ccc;padding:8px;">RW Product</th>
            <th style="border:1px solid #ccc;padding:8px;">Comments</th>
            <th style="border:1px solid #ccc;padding:8px;">Project Manager</th>
            <th style="border:1px solid #ccc;padding:8px;">Functional consultant</th>
            <th style="border:1px solid #ccc;padding:8px;">Technical consultant</th>
            <th style="border:1px solid #ccc;padding:8px;">Expected UAT</th>
            <th style="border:1px solid #ccc;padding:8px;">Expected Go Live</th>
            <th style="border:1px solid #ccc;padding:8px;">Status</th>
            <th class="edit-action-col" style="display:none;border:1px solid #ccc;padding:8px;">
    Action
</th>
   
        </tr>
    `;
}
    
    var customer = '';
    var status = '';
    var subsidiary = '';
var projectClass = '';
    var projectType = '';
    var directProject ='';
    var projectManager ='';
    var accountManager ='';
    var erp ='';
    var performaDate='';
    var functional1='';
    var technical ='';
    var scheduledUatDate= '';
    var goliveDate ='';
    var duration='';
    var performa='';
      var fileUrl = '';
      var projectManagerId='';
var fileName = '';

var empSearch = search.create({
    type: 'employee',
    filters: [
        ['isinactive','is','F']
    ],
    columns: ['internalid','firstname','lastname']
});

var funcDropdown = '<option value="">--Select--</option>';
var techDropdown = '<option value="">--Select--</option>';
var pmDropdown = '<option value="">--Select--</option>';


const projectUrl = url.resolveScript({
scriptId: 'customscript2876',
deploymentId: 'customdeploy5',
returnExternalUrl: true,
params: {
        empid: empId,
        email: email
    }
});
 var currentUser = runtime.getCurrentUser();
var userId = currentUser.id;
    if(projectId){

        var projectRec = record.load({
            type: 'customrecord_rw_portal_access',
            id: projectId,
            isDynamic: false
        });

        customer = projectRec.getText('custrecord_rw_portal_customername') || '';
        var customerId =
    projectRec.getValue(
        'custrecord_rw_portal_customername'
    ) || '';
        status = projectRec.getText('custrecord_rw_portal_status') || '';
var canAddProduct = false;

var safeStatus =
    String(status || '')
    .toLowerCase()
    .trim();

if(

    (
        roleType === 'PM'
        ||
        roleType === 'PMO'
    )

    &&

    safeStatus === 'not started'

){
    canAddProduct = true;
}
        projectType = projectRec.getText('custrecord_rw_portal_projecttype') || '';
        directProject = projectRec.getText('custrecord_rw_portal_directproject') || '';
        projectManager = projectRec.getText('custrecord_rw_portal_projectmanager') || '';

        subsidiary =
    projectRec.getText(
        'custrecord_rw_portal_subsidiary'
    ) || '';

projectClass =
    projectRec.getText(
        'custrecord_rw_portal_class'
    ) || '';
        accountManager = projectRec.getText('custrecord_rw_portal_accountmanager') || '';
        erp = projectRec.getText('custrecord_rw_portal_erp') || '';
        scheduledUatDate = projectRec.getValue('custrecord_rw_portal_scheduleduatdate') || '';
        goliveDate = projectRec.getValue('custrecord_rw_portal_scheduledgolivedate') || '';
        performa=projectRec.getValue('custrecord_rw_portal_proformainvoice');
  projectManagerId = projectRec.getValue('custrecord_rw_portal_projectmanager');
stdate=projectRec.getValue('custrecord_rw_portal_start_date');
eddate=projectRec.getValue('custrecord_rw_portal_end_date');
updatedenddate=projectRec.getValue('custrecord_rw_portal_updatedenddate') || ''
pmoComments=projectRec.getValue('custrecord_rw_portal_pmocommnts');
duration=projectRec.getValue('custrecord_rw_portal_duration')
functional1 =
    projectRec.getText(
        'custrecord_rw_portal_functional_consulta'
    ) || '';

technical1 =
    projectRec.getText(
        'custrecord_rw_portal_technical'
    ) || '';
    functional1 =
    projectRec.getValue(
        'custrecord_rw_portal_functional_consulta'
    ) || '';

technical1 =
    projectRec.getValue(
        'custrecord_rw_portal_technical'
    ) || '';

var functionalText =
    projectRec.getText(
        'custrecord_rw_portal_functional_consulta'
    ) || '';

var technicalText =
    projectRec.getText(
        'custrecord_rw_portal_technical'
    ) || '';
    var functionalText =
    projectRec.getText(
        'custrecord_rw_portal_functional_consulta'
    ) || '';

var technicalText =
    projectRec.getText(
        'custrecord_rw_portal_technical'
    ) || '';
performaDate=projectRec.getValue('custrecord_rw_portal_invoice_date') || '';
  
        // var isProjectManager = (empId === projectManagerId);
        var canEdit = (
    roleType === 'PM' ||
    roleType === 'PMO'
);
        log.debug("user id is",userId);
        log.debug("emp id is ",empId)
        //log.debug("project manger id is",projectManagerId)
        log.debug(canEdit);
        //log.debug('pm is',projectManager)
        log.debug("ROLE", runtime.getCurrentUser().role);
log.debug("USER", runtime.getCurrentUser().id);
    if (performa) {

    try {

        var fileObj = file.load({
            id: performa
        });

        fileUrl = fileObj.url;

        // force full domain
        if(fileUrl.indexOf('http') !== 0){

            fileUrl =
                'https://' +
                runtime.accountId.replace('_','-') +
                '.app.netsuite.com' +
                fileUrl;
        }

        fileName = fileObj.name;

        log.debug('FINAL FILE URL', fileUrl);

    } catch (e) {

        log.error("File Load Error", e);
    }
}
var projectStatusOptions = '<option value="">--Select--</option>';

var projectStatusSearch = search.create({
    type: 'customlist_rw_portal_statuslist_header',
    filters:[[
        'isinactive','is','F'
    ]],
    columns: ['internalid','name']
});

var projectStatusId = projectRec.getValue('custrecord_rw_portal_status');

projectStatusSearch.run().each(function(res){

    var id = res.getValue('internalid');
    var name = res.getValue('name');

    var selected = (id == projectStatusId) ? 'selected' : '';

    projectStatusOptions += '<option value="'+id+'" '+selected+'>'+name+'</option>';

    return true;
});
         var scheduled='';
         var golive='';
         var invoice='';
         var st = '';
var ed = '';
var upd = '';
      try{

    if(scheduledUatDate){

        scheduled = format.format({
            value: scheduledUatDate,
            type: format.Type.DATE
        });
    }

}catch(e){

    scheduled = '';

    log.error(
        'SCHEDULED DATE ERROR',
        e
    );
}
   try{

    if(performaDate){

        invoice = format.format({
            value: performaDate,
            type: format.Type.DATE
        });
    }

}catch(e){

    invoice = '';

    log.error(
        'INVOICE DATE ERROR',
        e
    );
}
try{

    if(goliveDate){

        golive = format.format({
            value: goliveDate,
            type: format.Type.DATE
        });
    }

}catch(e){

    golive = '';
}
try{

    if(stdate){

        st = format.format({
            value: stdate,
            type: format.Type.DATE
        });
    }

}catch(e){

    st = '';

    log.error(
        'START DATE ERROR',
        e
    );
}
try{

    if(eddate){

        ed = format.format({
            value: eddate,
            type: format.Type.DATE
        });
    }

}catch(e){

    ed = '';

    log.error(
        'END DATE ERROR',
        e
    );
}

try{

    if(updatedenddate){

        upd = format.format({
            value: updatedenddate,
            type: format.Type.DATE
        });
    }

}catch(e){

    upd = '';

    log.error(
        'UPDATED END DATE ERROR',
        e
    );
}
function toInputDate(date){
    if(!date) return '';

    try {
        var d = new Date(date);

        // Fix timezone issue
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());

        return d.toISOString().split('T')[0];

    } catch(e){
        return '';
    }
}
 function getDateValues(date){

    var obj = {
        display: '',
        input: ''
    };

    if(!date){
        return obj;
    }

    try{

        var d;

        // HANDLE DD/MM/YYYY STRING
        if(
            typeof date === 'string' &&
            date.indexOf('/') > -1
        ){

            var p = date.split('/');

            d = new Date(
                p[2],
                p[1]-1,
                p[0]
            );

        }else{

            // HANDLE NETSUITE / JS DATE
            d = new Date(date);
        }

        if(isNaN(d.getTime())){
            return obj;
        }

        // DISPLAY
        obj.display = format.format({
            value: d,
            type: format.Type.DATE
        });

        // INPUT
        d.setMinutes(
            d.getMinutes() -
            d.getTimezoneOffset()
        );

        obj.input =
            d.toISOString().split('T')[0];

    }catch(e){

        log.debug(
            'DATE FORMAT ERROR',
            e
        );
    }

    return obj;
}


// var milestoneStatusOptions =
// '<option value="">--Select--</option>';

// var milestoneStatusSearch = search.create({

//     type:
//     'customlist_rw_portal_milestone_status',

//     filters: [
//         ['isinactive','is','F']
//     ],

//     columns: [
//         'internalid',
//         'name'
//     ]
// });

// milestoneStatusSearch.run().each(function(res){

//     var id =
//         res.getValue('internalid');

//     var name =
//         res.getValue('name');

   

    

//     milestoneStatusOptions +=
//     '<option value="' + id + '">' +
//     name +
//     '</option>';


//     return true;
// });
var defaultMilestoneStatus = '';

search.create({
    type: 'customlist_rw_portal_milestone_status',
    filters: [
        ['name','is','Not Started']
    ],
    columns: ['internalid']
})
.run()
.each(function(r){

    defaultMilestoneStatusId =
        r.getValue('internalid');

    return false;
});

var milestoneStatusOptions =
'<option value="">--Select--</option>';
var milestoneStatusSearch = search.create({

    type:
    'customlist_rw_portal_milestone_status',

    filters: [
        ['isinactive','is','F']
    ],

    columns: [
        'internalid',
        'name'
    ]
});
milestoneStatusSearch.run().each(function(res){

    var id =
        res.getValue('internalid');

    var name =
        res.getValue('name');

    var selected =
        (id == defaultMilestoneStatus)
        ? 'selected'
        : '';

    milestoneStatusOptions +=
        '<option value="' + id + '" ' + selected + '>' +
        name +
        '</option>';

    return true;
});
var lineItemsHtml = '';

var lineSearch = search.create({
    type: 'customrecord_rw_portal_access2',
    filters: [
        ['custrecord1513','anyof', projectId],
        'AND',
        ['isinactive','is','F']
    ],
    columns: [
         search.createColumn({ name: 'internalid' }),
        'custrecord_rw_portal_rwproduct',
        'custrecord_rw_portal_additionalcomments',
        'custrecord_rw_rwprojectmanager',
        'custrecord_rw_portal_funcconsultant',
        'custrecord_rw_portal_techconsultant',
        'custrecord_rw_portal_lineexpecteduatdate',
        'custrecord_rw_portal_lineexptgolivedate',
        'custrecord_rw_portal_projstat',
        'custrecord_rw_portal_updateddeadline',
        'custrecord_rw_portal_enddateline',
        'custrecord_rw_portal_startdateline',
        'custrecord_rw_portal_durationline'



    ]
});
function formatDate(date){
    if(!date) return '';
    var d = new Date(date);
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
}


lineSearch.run().each(function(result){

    var product = result.getText('custrecord_rw_portal_rwproduct') || '';
    var productId =
    result.getValue(
        'custrecord_rw_portal_rwproduct'
    ) || '';

var templateId = '';

try{

    if(productId){

        var productLookup =
            search.lookupFields({

                type:
                'customrecord_rw_extend_products',

                id:
                productId,

                columns: [
                    'custrecord_rw_ext_proj_plan_template'
                ]
            });

        log.debug(
            'PRODUCT LOOKUP',
            JSON.stringify(productLookup)
        );

        if(
            productLookup &&

            productLookup
            .custrecord_rw_ext_proj_plan_template &&

            Array.isArray(
                productLookup
                .custrecord_rw_ext_proj_plan_template
            ) &&

            productLookup
            .custrecord_rw_ext_proj_plan_template
            .length > 0
        ){

            templateId =
                productLookup
                .custrecord_rw_ext_proj_plan_template[0]
                .value || '';
        }
    }

}catch(e){

    log.error(
        'PRODUCT TEMPLATE ERROR',
        e
    );

    templateId = '';
}
var startdate =
    result.getValue(
        'custrecord_rw_portal_startdateline'
    ) ||

    stdate ||

    '';

var enddate =
    result.getValue(
        'custrecord_rw_portal_enddateline'
    ) ||

    eddate ||

    '';

var updateddeadline =
    result.getValue(
        'custrecord_rw_portal_updateddeadline'
    ) ||

    updatedenddate ||

    '';
var startDate = '';
var milestoneenddate = '';
var estDuration = '';
var actualCompleted = '';
var aging = '';
var timeSpent = '';
var milestoneStatusId = '';

var milestoneStatus = '';
var milestoneComments = '';
var milestoneRowColor = '#ffffff';
var canEditMilestone =
    (roleType === 'PM');
var milestoneRows = '';


if(templateId){

    var milestoneSearch =
    search.create({

        type:
        'customrecord_rw_project_plan_temp_child',

        filters: [
            [
                'custrecord_rw_proj_plan_temp_child_link',
                'anyof',
                templateId
            ]
        ],

        columns: [

            search.createColumn({
                name: 'formulanumeric',
                formula:
                'TO_NUMBER({custrecord_rw_proj_plan_temp_child_sno})',
                sort: search.Sort.ASC
            }),

            'custrecord_rw_proj_plan_temp_child_sno',

            'custrecord_rw_project_temp_child_miles'
        ]
});

       
   milestoneSearch.run().each(function(ms){

    var sno =
        ms.getValue(
            'custrecord_rw_proj_plan_temp_child_sno'
        ) || '';

    var milestoneId =
        ms.getValue(
            'custrecord_rw_project_temp_child_miles'
        ) || '';

    var milestoneName =
        ms.getText(
            'custrecord_rw_project_temp_child_miles'
        ) || '';

    var startDate = '';
    var milestoneenddate = '';
    var estDuration = '';
    var actualCompleted = '';
    var aging = '';
    var timeSpent = '';
var customerPlanId = '';
    var customerPlanSearch = search.create({

        type: 'customrecord_rw_customer_project_plan',

       filters: [

    [
        'custrecord_rw_cust_proj_plan_link',
        'anyof',
        customerId
    ],

    'AND',

    [
        'formulatext: {custrecord_rw_cust_proj_mile_stone}',
        'is',
        milestoneName
    ],

    'AND',

    [
        'formulatext: {custrecord_rw_cust_proj_plan_prod_serv}',
        'is',
        product
    ]
],

        columns: [
               search.createColumn({
    name:
    'custrecord_rw_cust_proj_plan_sno',
    sort:
    search.Sort.ASC
}),
            'internalid',
         
            'custrecord_rw_cust_proj_mile_start_date',
            'custrecord_rw_cust_proj_plan_sno',

            'custrecord_rw_cust_proj_plan_end_date',

            'custrecord_rw_cust_proj_planest_duration',

            'custrecord_rw_cust_proj_plan_act_compl',

            'custrecord_rw_cust_proj_plan_aging',

            'custrecord_rw_cust_proj_plan_time_spent',
            'custrecord_rw_portal_milestone_status',
            'custrecord_re_portal_milestone_comments',
        ]
    });

    customerPlanSearch.run().each(function(cp){
      
         customerPlanId =
    cp.getValue('internalid') || '';
        startDate =
            cp.getValue(
                'custrecord_rw_cust_proj_mile_start_date'
            ) || '';

        milestoneenddate =
            cp.getValue(
                'custrecord_rw_cust_proj_plan_end_date'
            ) || '';

        estDuration =
            cp.getValue(
                'custrecord_rw_cust_proj_planest_duration'
            ) || '';

        actualCompleted =
            cp.getValue(
                'custrecord_rw_cust_proj_plan_act_compl'
            ) || '';

        aging =
            cp.getValue(
                'custrecord_rw_cust_proj_plan_aging'
            ) || '';

        timeSpent =
            cp.getValue(
                'custrecord_rw_cust_proj_plan_time_spent'
            ) || '';

          milestoneStatusId =
    cp.getValue(
        'custrecord_rw_portal_milestone_status'
    ) || '';
if(!milestoneStatusId){

    milestoneStatusId =
        defaultMilestoneStatus;
}

milestoneStatus =
    cp.getText(
        'custrecord_rw_portal_milestone_status'
    ) || '';
if(!milestoneStatusId){

    milestoneStatusId =
        defaultMilestoneStatus;

    
}
var milestoneStatusText =
    milestoneStatus;

          var milestoneStatusText =
    cp.getText(
        'custrecord_rw_portal_milestone_status'
    ) || '';

milestoneRowColor = '#ffffff';

var safeMilestoneStatus =
    String(
        milestoneStatusText || ''
    ).toLowerCase();

if(
    safeMilestoneStatus === 'to do'
){

    milestoneRowColor = '#ffffff';

}
else if(
    safeMilestoneStatus === 'in progress'
){

    milestoneRowColor = '#dbeafe';

}
else if(
    safeMilestoneStatus === 'completed'
){

    milestoneRowColor = '#d4edda';

}
else if(
    safeMilestoneStatus === 'pending from customer'
){

    milestoneRowColor = '#f8d7da';

}        milestoneComments =
            cp.getValue(
                'custrecord_re_portal_milestone_comments'
            ) || '';

        return false;
    });

var isPM =
    (roleType === 'PM');
    
   if(isPM){

milestoneRows += `

<tr
    class="milestoneRow"
    data-planid="${customerPlanId}"
    data-milestoneid="${milestoneId}"
    data-productid="${productId}"
    data-sno="${sno}"
     style="
        background:${milestoneRowColor};
        transition:0.3s;
    "
>

<td style="border:1px solid #ddd;padding:8px;">
    ${sno}
</td>

<td style="border:1px solid #ddd;padding:8px;">
    ${milestoneName}
</td>

<td style="border:1px solid #ddd;padding:8px;">

    <span class="view-mode">
        ${
    getDateValues(
        startDate || startdate
    ).display
}
    </span>

   <input
    type="date"
    class="edit-mode ms-startdate"
 value="${
    getDateValues(
        startDate || startdate
    ).input
}"
    style="display:none;width:100%;"
/>

</td>

<td style="border:1px solid #ddd;padding:8px;">

    <span class="view-mode">
      ${
    getDateValues(
        milestoneenddate || enddate
    ).display
}
    </span>

   <input
    type="date"
    class="edit-mode ms-enddate"
  value="${
    getDateValues(
        milestoneenddate || enddate
    ).input
}"
    style="display:none;width:100%;"
/>

</td>

<td style="border:1px solid #ddd;padding:8px;">

    <span class="view-mode">
        ${estDuration || ''}
    </span>

    <input
        type="text"
        class="edit-mode ms-duration"
        readonly
        value="${estDuration || ''}"
        style="display:none;width:80px;"
    />

</td>

<td style="border:1px solid #ddd;padding:8px;">

   <span
    class="view-mode"
    style="
        ${
            actualCompleted &&
            milestoneenddate &&
            (
                function(){

                    function parseDate(str){

                        if(!str) return null;

                        // DD/MM/YYYY
                        if(String(str).indexOf('/') > -1){

                            var p =
                                String(str).split('/');

                            return new Date(
                                p[2],
                                p[1]-1,
                                p[0]
                            );
                        }

                        return new Date(str);
                    }

                    var actualDate =
                        parseDate(actualCompleted);

                    var endDate =
                        parseDate(milestoneenddate);

                    return actualDate > endDate;

                }
            )()

            ?

            `
            border:2px solid red;
            color:red;
            padding:4px 8px;
            border-radius:6px;
            font-weight:bold;
            background:#fff5f5;
            display:inline-block;
            `

            :

            ''
        }
    "
>
    ${
        getDateValues(actualCompleted).display ||
        actualCompleted ||
        ''
    }
</span>

    <input
        type="date"
        class="edit-mode ms-actual"
        value="${getDateValues(actualCompleted).input}"
        style="
            display:none;
            width:100%;
           ${
    actualCompleted &&
    milestoneenddate &&
    (
        function(){

            function parseDate(str){

                if(!str) return null;

                // HANDLE DD/MM/YYYY
                if(str.indexOf('/') > -1){

                    var p = str.split('/');

                    return new Date(
                        p[2],
                        p[1]-1,
                        p[0]
                    );
                }

                // HANDLE YYYY-MM-DD
                return new Date(str);
            }

            var actualDate =
                parseDate(actualCompleted);

            var endDate =
                parseDate(milestoneenddate);

            return actualDate > endDate;

        }
    )()


                ?

                `
                border:2px solid red;
                background:#fff5f5;
                color:red;
                `

                :

                ''
            }
        "
        onchange="validateActualCompleted(this)"
    />

</td>

<td style="border:1px solid #ddd;padding:8px;">

    <span class="view-mode">
        ${aging || ''}
    </span>

    <input
        type="text"
        class="edit-mode ms-aging"
        readonly
        value="${aging || ''}"
        style="display:none;width:80px;"
    />

</td>

<td style="border:1px solid #ddd;padding:8px;">

    <span class="view-mode">
        ${timeSpent || ''}
    </span>

    <input
        type="text"
        class="edit-mode ms-timespent"
        value="${timeSpent || ''}"
        style="display:none;width:80px;"
    />

</td>
<td style="border:1px solid #ddd;padding:8px;">

    <span class="view-mode">
        ${milestoneComments || ''}
    </span>

    <textarea
        class="edit-mode ms-comments"
        style="
            display:none;
            width:100%;
            min-height:60px;
        "
    >${milestoneComments || ''}</textarea>

</td>
<td style="border:1px solid #ddd;padding:8px;">

    <span class="view-mode">
        ${milestoneStatus || ''}
    </span>

    <select
    class="edit-mode ms-status"
    style="display:none;width:100%;"
>
${milestoneStatusOptions.replace(
    'value="' + String(milestoneStatusId).trim() + '"',
    'value="' + String(milestoneStatusId).trim() + '" selected'
)}
</select>

</td>


</tr>
`;

}else{

milestoneRows += `

<tr>

<td style="border:1px solid #ddd;padding:8px;">
    ${sno}
</td>

<td style="border:1px solid #ddd;padding:8px;">
    ${milestoneName}
</td>

<td style="border:1px solid #ddd;padding:8px;">

    ${
        getDateValues(
            startDate || startdate
        ).display
    }

</td>

<td style="border:1px solid #ddd;padding:8px;">

    ${
        getDateValues(
            milestoneenddate || enddate
        ).display
    }

</td>

<td style="border:1px solid #ddd;padding:8px;">
    ${estDuration || ''}
</td>

<td style="border:1px solid #ddd;padding:8px;">
    ${getDateValues(actualCompleted).display || ''}
</td>

<td style="border:1px solid #ddd;padding:8px;">
    ${aging || ''}
</td>

<td style="border:1px solid #ddd;padding:8px;">
    ${timeSpent || ''}
</td>
<td style="border:1px solid #ddd;padding:8px;">
    ${milestoneComments || ''}
</td>
<td style="border:1px solid #ddd;padding:8px;">
    ${milestoneStatus || ''}
</td>
</tr>
`;

}

    return true;
});
}
    var comments = result.getValue('custrecord_rw_portal_additionalcomments') || '';
    var pmId =
    result.getValue('custrecord_rw_rwprojectmanager') ||
    projectManagerId ||
    '';

var pm =
    result.getText('custrecord_rw_rwprojectmanager') ||
    projectManager ||
    '';
   var functionalId =
    result.getValue(
        'custrecord_rw_portal_funcconsultant'
    ) ||

    functional1 ||

    '';

var technicalId =
    result.getValue(
        'custrecord_rw_portal_techconsultant'
    ) ||

    technical1 ||

    '';

var functional =
    result.getText(
        'custrecord_rw_portal_funcconsultant'
    ) ||

    functionalText ||

    '';

var technical =
    result.getText(
        'custrecord_rw_portal_techconsultant'
    ) ||

    technicalText ||

    '';
var duration =result.getValue('custrecord_rw_portal_durationline')

var functional =
    result.getText(
        'custrecord_rw_portal_funcconsultant'
    ) ||

    projectRec.getText(
        'custrecord_rw_portal_functional_consulta'
    ) ||

    '';

var technical =
    result.getText(
        'custrecord_rw_portal_techconsultant'
    ) ||

    projectRec.getText(
        'custrecord_rw_portal_technical'
    ) ||

    '';
   var uatRaw = result.getValue('custrecord_rw_portal_lineexpecteduatdate');
var goliveRaw = result.getValue('custrecord_rw_portal_lineexptgolivedate');
var linestatus = result.getText('custrecord_rw_portal_projstat'); // for display
var linestatusId = result.getValue('custrecord_rw_portal_projstat'); // for dropdown




statSearch.run().each(function(res){

    var id = res.getValue('internalid');
    var name = res.getValue('name');

    var selected = (id == linestatusId) ? 'selected' : '';

    statOptions += '<option value="'+id+'" '+selected+'>'+name+'</option>';

    return true;
});
var employeeList = [];
var uniqueEmployees = {};

empSearch.run().each(function(emp){

    var id = emp.getValue('internalid');

    var first =
        emp.getValue('firstname') || '';

    var last =
        emp.getValue('lastname') || '';

    var name =
        (first + ' ' + last).trim();

    // skip empty names
    if(!name){
        return true;
    }

    // unique by lowercase name
    var key = name.toLowerCase();

    if(!uniqueEmployees[key]){

        uniqueEmployees[key] = true;

        employeeList.push({
            id: id,
            name: name
        });
    }

    return true;
});

// SORT ALPHABETICALLY
employeeList.sort(function(a,b){

    return a.name.localeCompare(b.name);
});

// BUILD DROPDOWNS
employeeList.forEach(function(emp){

    funcDropdown +=
        '<option value="' + emp.id + '" ' +
        (emp.id == functionalId ? 'selected' : '') +
        '>' +
        emp.name +
        '</option>';
pmDropdown +=
    '<option value="' + emp.id + '" ' +
    (emp.id == pmId
    ? 'selected'
    : '') +
    '>' +
    emp.name +
    '</option>';
    techDropdown +=
        '<option value="' + emp.id + '" ' +
        (emp.id == technicalId ? 'selected' : '') +
        '>' +
        emp.name +
        '</option>';
});
// var uat = '';
// var golive = '';
// var start = '';
// var end = '';
// var updated = '';

// if(uatRaw){
//     uat = format.format({
//         value: uatRaw,
//         type: format.Type.DATE
//     });
// }
// if(startdate){
//     start = format.format({
//         value: startdate,
//         type: format.Type.DATE
//     });
// }
// if(enddate){
//     end = format.format({
//         value: enddate,
//         type: format.Type.DATE
//     });
// }
// if(updateddeadline){
//     updated = format.format({
//         value: updateddeadline,
//         type: format.Type.DATE
//     });
// }
// if(goliveRaw){
//     golive = format.format({
//         value: goliveRaw,
//         type: format.Type.DATE
//     });
// }

var lineId = result.id;   // 🔥 BEST WAY
//  var removeBtn = '';

// if(canAddProduct){

//     removeBtn = `
//         <button
//             type="button"
//             onclick="removeProduct('${lineId}')"
//             style="
//                 background:#dc3545;
//                 color:white;
//                 border:none;
//                 padding:6px 10px;
//                 border-radius:6px;
//                 cursor:pointer;
//             ">
//             Remove
//         </button>
//     `;
// }
var uatLineObj =
    getDateValues(uatRaw);

var goliveLineObj =
    getDateValues(goliveRaw);

var startLineObj =
    getDateValues(startdate);

var endLineObj =
    getDateValues(enddate);

var updatedLineObj =
    getDateValues(updateddeadline);
var empRoleMap = {};

 if(roleType === 'PMO'){
//    var historyHtml = `
// <div style="
//     padding:18px;
//     background:#f8f9fc;
//     border-radius:14px;
//     border:1px solid #e3e8f0;
//     box-shadow:0 4px 12px rgba(0,0,0,0.06);
//     margin-top:10px;
// ">
// `;

// var histSearch = search.create({
//     type: 'customrecord_rw_project_status_history',

//     filters: [
//         [
//             ['custrecord_rw_hist_line','anyof', lineId],
//             // 'OR',
//             // [
//             //     'custrecord_rw_hist_project',
//             //     'anyof',
//             //     projectId
//             // ]
//         ]
//     ],

//     columns: [
//     search.createColumn({
//     name:'created',
//     sort: search.Sort.DESC
// }),
//         'custrecord_rw_hist_oldprojstatus',
//         'custrecord_rw_hist_projectstatus',
//         'custrecord_rw_hist_oldstatus',
//         'custrecord_rw_hist_newstatus',
//         'custrecord_rw_hist_changedby',
//         'custrecord_rw_hist_duration'
//     ]
// });

// histSearch.run().each(function(h){

//     historyHtml += `

// <div style="
//     background:white;
//     border-left:5px solid #8f50df;
//     border-radius:12px;
//     padding:10px 14px;
//     margin-bottom:13px;
//     box-shadow:0 2px 8px rgba(0,0,0,0.05);
// ">

//     <div style="
//         display:flex;
//         justify-content:space-between;
//         align-items:center;
//         margin-bottom:12px;
//     ">

//         <div style="
//             font-size:15px;
//             font-weight:700;
//             color:#2d3436;
//         ">
//             ${product}
//         </div>

//         <div style="
//             background:#f3ecff;
//             color:#8f50df;
//             padding:5px 12px;
//             border-radius:20px;
//             font-size:12px;
//             font-weight:600;
//         ">
//             ${h.getValue(
//                 'custrecord_rw_hist_duration'
//             ) || '-'}
//         </div>

//     </div>

//     <div style="
//         display:flex;
//         gap:20px;
//         flex-wrap:wrap;
//         margin-bottom:10px;
//     ">

//         <div style="
//             flex:1;
//             min-width:240px;
//             background:#f8f9ff;
//             padding:12px;
//             border-radius:10px;
//         ">

//             <div style="
//                 font-size:12px;
//                 color:#7f8c8d;
//                 margin-bottom:6px;
//                 font-weight:600;
//                 text-transform:uppercase;
//             ">
//                 Project Status
//             </div>

//             <div style="
//                 display:flex;
//                 align-items:center;
//                 gap:10px;
//                 font-size:14px;
//                 font-weight:600;
//             ">

//                 <span style="
//                     color:#e67e22;
//                     background:#fff4e8;
//                     padding:5px 10px;
//                     border-radius:8px;
//                 ">
//                     ${h.getValue(
//                         'custrecord_rw_hist_oldprojstatus'
//                     ) || '-'}

//                 </span>

//                 <span style="
//                     color:#8f50df;
//                     font-size:18px;
//                 ">
//                     →
//                 </span>

//                 <span style="
//                     color:#27ae60;
//                     background:#eafaf1;
//                     padding:5px 10px;
//                     border-radius:8px;
//                 ">
//                     ${h.getValue(
//                         'custrecord_rw_hist_projectstatus'
//                     ) || '-'}

//                 </span>

//             </div>

//         </div>

//         <div style="
//             flex:1;
//             min-width:240px;
//             background:#f8f9ff;
//             padding:12px;
//             border-radius:10px;
//         ">

//             <div style="
//                 font-size:12px;
//                 color:#7f8c8d;
//                 margin-bottom:6px;
//                 font-weight:600;
//                 text-transform:uppercase;
//             ">
//                 Product Status
//             </div>

//             <div style="
//                 display:flex;
//                 align-items:center;
//                 gap:10px;
//                 font-size:14px;
//                 font-weight:600;
//             ">

//                 <span style="
//                     color:#e67e22;
//                     background:#fff4e8;
//                     padding:5px 10px;
//                     border-radius:8px;
//                 ">
//                     ${h.getValue(
//                         'custrecord_rw_hist_oldstatus'
//                     ) || '-'}

//                 </span>

//                 <span style="
//                     color:#8f50df;
//                     font-size:18px;
//                 ">
//                     →
//                 </span>

//                 <span style="
//                     color:#27ae60;
//                     background:#eafaf1;
//                     padding:5px 10px;
//                     border-radius:8px;
//                 ">
//                     ${h.getValue(
//                         'custrecord_rw_hist_newstatus'
//                     ) || '-'}

//                 </span>

//             </div>

//         </div>

//     </div>

//     <div style="
//         display:flex;
//         justify-content:space-between;
//         align-items:center;
//         font-size:12px;
//         color:#7f8c8d;
//         margin-top:10px;
//         border-top:1px solid #f1f2f6;
//         padding-top:10px;
//     ">

//         <div>
//             👤 ${h.getText(
//                 'custrecord_rw_hist_changedby'
//             ) || ''}
//         </div>

//         <div>
//           🕒 ${
//     format.format({
//         value: h.getValue('created'),
//         type: format.Type.DATETIMETZ
//     }) || ''
// }
//         </div>

//     </div>

// </div>
// `;

//     return true;
// });

// historyHtml += `</div>`;
    lineItemsHtml += `
<tr data-id="${lineId}">
    <td style="border:1px solid #ccc;padding:8px;">
    <span
    onclick="togglePlan('${lineId}')"
    style="
        cursor:pointer;
        color:#27ae60;
        font-weight:bold;
        margin-right:8px;
    "
>
    📋
</span>
    

    ${product}
</td>
    <td style="border:1px solid #ccc;padding:8px;">${comments}</td>
    <td style="border:1px solid #ccc;padding:8px;">
        <span class="view-mode">
    <span class="status-badge ${getProjectStatusClass(linestatus)}">
        ${linestatus}
    </span>
</span>
        <select class="edit-mode status" style="display:none;" data-currenttext="${linestatus}">
            ${statOptions}
        </select>
    </td>
  <td style="border:1px solid #ccc;padding:8px;">

    <span class="view-mode">
        ${startLineObj.display}
    </span>

    <input
        class="edit-mode startdate"
        type="date"
        value="${startLineObj.input}"
        style="display:none;"
    />

</td>

<!-- END DATE -->
<td style="border:1px solid #ccc;padding:8px;">

    <span class="view-mode">
        ${endLineObj.display}
    </span>

    <input
        class="edit-mode enddate"
        type="date"
        value="${endLineObj.input}"
        style="display:none;"
    />

</td>

<!-- UPDATED DEADLINE -->
<td style="border:1px solid #ccc;padding:8px;">

    <span class="view-mode">
        ${updatedLineObj.display}
    </span>

    <input
        class="edit-mode updateddeadline"
        type="date"
        value="${updatedLineObj.input}"
        style="display:none;"
    />

</td>
    
<td style="border:1px solid #ccc;padding:8px;">

    <span class="view-mode duration-text">
        ${duration || ''}
    </span>

    <input
        type="text"
        class="edit-mode duration"
        value="${duration || ''}"
        readonly
        style="
            display:none;
            width:80px;
            background:#f5f5f5;
            border:1px solid #ccc;
        "
    />

</td>
<td
    class="action-col"
    style="
        display:none;
        border:1px solid #ccc;
        padding:8px;
        text-align:center;
    "
>
    ${
        canAddProduct
        ?
        `<button
            type="button"
            onclick="removeProduct('${lineId}')"
            style="
                background:#dc3545;
                color:#fff;
                border:none;
                padding:6px 10px;
                border-radius:6px;
                cursor:pointer;
            "
        >
            Remove
        </button>`
        :
        ''
    }
</td>
</tr>

<tr id="history_${lineId}"
    style="display:none;background:#fafafa;">

<td colspan="12"
    style="padding:15px;">



</td>
</tr>
<tr id="plan_${lineId}"
    style="
        display:none;
        background:#f8f9fc;
    ">

<td colspan="12"
    style="padding:15px;">

    <div style="
        background:white;
        border-radius:12px;
        padding:15px;
        border:1px solid #ddd;
    ">

        <div style="
            font-size:16px;
            font-weight:bold;
            color:#8f50df;
            margin-bottom:12px;
        ">
            ${product}
        </div>

        <table style="
            width:100%;
            border-collapse:collapse;
        ">

            <thead>

                <tr style="
                        background:#E6E6E6;
font-weight:bold;
font-size:10px;
color:darkblue;
text-transform:uppercase;
font-family:Arial, sans-serif;
                    
                ">

                    <th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">
                        S.NO
                    </th>

                    <th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">
                        Milestone
                    </th>

<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Start Date</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">End Date</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Estimated Duration</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Actual Completed</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Aging</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Time Spent</th>
                    
                    <th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Comments</th>
                    <th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Status</th>
                </tr>

            </thead>

            <tbody>

                ${
                    milestoneRows ||

                    '<tr><td colspan="2">No Milestones Found</td></tr>'
                }

            </tbody>

        </table>

    </div>

</td>

</tr>`

;
log.debug(
    'START RAW',
    startdate
);

log.debug(
    'START INPUT',
    startLineObj.input
);

log.debug(
    'END INPUT',
    endLineObj.input
);

log.debug(
    'UPDATED INPUT',
    updatedLineObj.input
);
}

else if (roleType === 'PM') {
//     var historyHtml = `
// <div style="
//     padding:18px;
//     background:#f8f9fc;
//     border-radius:14px;
//     border:1px solid #e3e8f0;
//     box-shadow:0 4px 12px rgba(0,0,0,0.06);
//     margin-top:10px;
// ">
// `;

// var histSearch = search.create({
//     type: 'customrecord_rw_project_status_history',

//     filters: [
//         [
//             ['custrecord_rw_hist_line','anyof', lineId],
//             // 'OR',
//             // [
//             //     'custrecord_rw_hist_project',
//             //     'anyof',
//             //     projectId
//             // ]
//         ]
//     ],

//     columns: [
//     search.createColumn({
//     name:'created',
//     sort: search.Sort.DESC
// }),
//         'custrecord_rw_hist_oldprojstatus',
//         'custrecord_rw_hist_projectstatus',
//         'custrecord_rw_hist_oldstatus',
//         'custrecord_rw_hist_newstatus',
//         'custrecord_rw_hist_changedby',
//         'custrecord_rw_hist_duration'
//     ]
// });

// histSearch.run().each(function(h){

//     historyHtml += `

// <div style="
//     background:white;
//     border-left:5px solid #8f50df;
//     border-radius:12px;
//     padding:10px 14px;
//     margin-bottom:13px;
//     box-shadow:0 2px 8px rgba(0,0,0,0.05);
// ">

//     <div style="
//         display:flex;
//         justify-content:space-between;
//         align-items:center;
//         margin-bottom:12px;
//     ">

//         <div style="
//             font-size:15px;
//             font-weight:700;
//             color:#2d3436;
//         ">
//             ${product}
//         </div>

//         <div style="
//             background:#f3ecff;
//             color:#8f50df;
//             padding:5px 12px;
//             border-radius:20px;
//             font-size:12px;
//             font-weight:600;
//         ">
//             ${h.getValue(
//                 'custrecord_rw_hist_duration'
//             ) || '-'}
//         </div>

//     </div>

//     <div style="
//         display:flex;
//         gap:20px;
//         flex-wrap:wrap;
//         margin-bottom:10px;
//     ">

//         <div style="
//             flex:1;
//             min-width:240px;
//             background:#f8f9ff;
//             padding:12px;
//             border-radius:10px;
//         ">

//             <div style="
//                 font-size:12px;
//                 color:#7f8c8d;
//                 margin-bottom:6px;
//                 font-weight:600;
//                 text-transform:uppercase;
//             ">
//                 Project Status
//             </div>

//             <div style="
//                 display:flex;
//                 align-items:center;
//                 gap:10px;
//                 font-size:14px;
//                 font-weight:600;
//             ">

//                 <span style="
//                     color:#e67e22;
//                     background:#fff4e8;
//                     padding:5px 10px;
//                     border-radius:8px;
//                 ">
//                     ${h.getValue(
//                         'custrecord_rw_hist_oldprojstatus'
//                     ) || '-'}

//                 </span>

//                 <span style="
//                     color:#8f50df;
//                     font-size:18px;
//                 ">
//                     →
//                 </span>

//                 <span style="
//                     color:#27ae60;
//                     background:#eafaf1;
//                     padding:5px 10px;
//                     border-radius:8px;
//                 ">
//                     ${h.getValue(
//                         'custrecord_rw_hist_projectstatus'
//                     ) || '-'}

//                 </span>

//             </div>

//         </div>

//         <div style="
//             flex:1;
//             min-width:240px;
//             background:#f8f9ff;
//             padding:12px;
//             border-radius:10px;
//         ">

//             <div style="
//                 font-size:12px;
//                 color:#7f8c8d;
//                 margin-bottom:6px;
//                 font-weight:600;
//                 text-transform:uppercase;
//             ">
//                 Product Status
//             </div>

//             <div style="
//                 display:flex;
//                 align-items:center;
//                 gap:10px;
//                 font-size:14px;
//                 font-weight:600;
//             ">

//                 <span style="
//                     color:#e67e22;
//                     background:#fff4e8;
//                     padding:5px 10px;
//                     border-radius:8px;
//                 ">
//                     ${h.getValue(
//                         'custrecord_rw_hist_oldstatus'
//                     ) || '-'}

//                 </span>

//                 <span style="
//                     color:#8f50df;
//                     font-size:18px;
//                 ">
//                     →
//                 </span>

//                 <span style="
//                     color:#27ae60;
//                     background:#eafaf1;
//                     padding:5px 10px;
//                     border-radius:8px;
//                 ">
//                     ${h.getValue(
//                         'custrecord_rw_hist_newstatus'
//                     ) || '-'}

//                 </span>

//             </div>

//         </div>

//     </div>

//     <div style="
//         display:flex;
//         justify-content:space-between;
//         align-items:center;
//         font-size:12px;
//         color:#7f8c8d;
//         margin-top:10px;
//         border-top:1px solid #f1f2f6;
//         padding-top:10px;
//     ">

//         <div>
//             👤 ${h.getText(
//                 'custrecord_rw_hist_changedby'
//             ) || ''}
//         </div>

//         <div>
//           🕒 ${
//     format.format({
//         value: h.getValue('created'),
//         type: format.Type.DATETIMETZ
//     }) || ''
// }
//         </div>

//     </div>

// </div>
// `;

//     return true;
// });

// historyHtml += `</div>`;
    lineItemsHtml += `
<tr data-id="${lineId}">
<td style="border:1px solid #ccc;padding:8px;">
<span
    onclick="togglePlan('${lineId}')"
    style="
        cursor:pointer;
        color:#27ae60;
        font-weight:bold;
        margin-right:8px;
    "
>
    📋
</span>
    

    ${product}
</td>
<td style="border:1px solid #ccc;padding:8px;">${comments}</td>
<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">${pm}</span>

    
<select 
    class="edit-mode rwpm" 
    style="display:none;"
    onchange="syncProjectManager(this)"
>
    ${pmDropdown}
</select>
</td>

<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">${functional}</span>
    <select
    class="edit-mode functional"
    style="display:none;"
    
>
   ${funcDropdown}
</select>
</td>

<td style="border:1px solid #ccc; padding:8px;">
    <span class="view-mode">${technical}</span>
    <select class="edit-mode technical" style="display:none;">
       ${techDropdown}
    </select>
</td>

<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">
        ${uatLineObj.display}
    </span>

    <input
        class="edit-mode uat"
        type="date"
        value="${uatLineObj.input}"
        style="display:none;"
    />
</td>

<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">
        ${goliveLineObj.display}
    </span>

    <input
        class="edit-mode golive"
        type="date"
        value="${goliveLineObj.input}"
        style="display:none;"
    />
</td>

<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">
    <span class="status-badge ${getProjectStatusClass(linestatus)}">
        ${linestatus}
    </span>
</span>
    <select class="edit-mode status" style="display:none;" data-currenttext="${linestatus}">
       ${statOptions}
    </select>
</td>
<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">${startLineObj.display}</span>
   

<input
    class="edit-mode startdate"
    type="date"
    value="${startLineObj.input}"
    style="display:none;"
/>
</td>
   <td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">
    ${endLineObj.display}
</span>

<input
    class="edit-mode enddate"
    type="date"
    value="${endLineObj.input}"
    style="display:none;"
/>
</td>
   <td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">
    ${updatedLineObj.display}
</span>

<input
    class="edit-mode updateddeadline"
    type="date"
    value="${updatedLineObj.input}"
    style="display:none;"
/>
</td>
 <td
    class="action-col"
    style="
        display:none;
        border:1px solid #ccc;
        padding:8px;
        text-align:center;
    "
>
    ${
        canAddProduct
        ?
        `<button
            type="button"
            onclick="removeProduct('${lineId}')"
            style="
                background:#dc3545;
                color:#fff;
                border:none;
                padding:6px 10px;
                border-radius:6px;
                cursor:pointer;
            "
        >
            Remove
        </button>`
        :
        ''
    }
</td>
</tr>

<tr id="history_${lineId}"
    style="display:none;background:#fafafa;">

<td colspan="12"
    style="padding:15px;">

    

</td>
</tr>
<tr id="plan_${lineId}"
    style="
        display:none;
        background:#f8f9fc;
    ">

<td colspan="12"
    style="padding:15px;">

    <div style="
        background:white;
        border-radius:12px;
        padding:15px;
        border:1px solid #ddd;
    ">

        <div style="
            font-size:16px;
            font-weight:bold;
            color:#8f50df;
            margin-bottom:12px;
        ">
            ${product}
        </div>

        <table style="
            width:100%;
            border-collapse:collapse;
        ">

            <thead>

                <tr style="
                        background:linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);;
                    font-weight:bold;
                    font-size:10px;
                    text-transform:uppercase;
                    font-family:Arial, sans-serif;

                    color:darkblue;
                ">

                    <th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">
                        S.NO
                    </th>

                    <th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">
                        Milestone
                    </th>

<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Start Date</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">End Date</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Duration</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Actual Completed</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Aging</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Time Spent</th>
                    
                    <th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Comments</th>
                    <th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Status</th>
                </tr>

            </thead>

            <tbody>

                ${
                    milestoneRows ||

                    '<tr><td colspan="2">No Milestones Found</td></tr>'
                }

            </tbody>

        </table>

    </div>

</td>

</tr>`

;
}
else {
    lineItemsHtml += `
<tr data-id="${lineId}">
<td style="border:1px solid #ccc;padding:8px;">
 <span
    onclick="togglePlan('${lineId}')"
    style="
        cursor:pointer;
        color:#27ae60;
        font-weight:bold;
        margin-right:8px;
    "
>
    📋
</span>
${product}</td>
<td style="border:1px solid #ccc;padding:8px;">${comments}</td>
<td style="border:1px solid #ccc;padding:8px;">${pm}</td>

<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">${functional}</span>
    <select class="edit-mode functional" style="display:none;">
       ${funcDropdown}
    </select>
</td>

<td style="border:1px solid #ccc; padding:8px;">
    <span class="view-mode">${technical}</span>
    <select class="edit-mode technical" style="display:none;">
       ${techDropdown}
    </select>
</td>

<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">
        ${uatLineObj.display}
    </span>

    <input
        class="edit-mode uat"
        type="date"
        value="${uatLineObj.input}"
        style="display:none;"
    />
</td>

<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">${golive}</span>
    <input class="edit-mode golive" type="date" value="${toInputDate(goliveRaw)}" style="display:none;" />
</td>

<td style="border:1px solid #ccc;padding:8px;">
    <span class="view-mode">${linestatus}</span>
    <select class="edit-mode status" style="display:none;" data-currenttext="${linestatus}">
       ${statOptions}
    </select>
</td>
</tr>
<tr id="plan_${lineId}"
    style="
        display:none;
        background:#f8f9fc;
    ">

<td colspan="12"
    style="padding:15px;">

    <div style="
        background:white;
        border-radius:12px;
        padding:15px;
        border:1px solid #ddd;
    ">

        <div style="
            font-size:16px;
            font-weight:bold;
            color:#8f50df;
            margin-bottom:12px;
        ">
            ${product}
        </div>

        <table style="
            width:100%;
            border-collapse:collapse;
        ">

            <thead>

                <tr style="
                        background:linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);;
                    font-weight:bold;
                    font-size:10px;
                    text-transform:uppercase;
                    font-family:Arial, sans-serif;

                    color:darkblue;
                ">

                    <th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">
                        S.NO
                    </th>

                    <th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">
                        Milestone
                    </th>

<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Start Date</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">End Date</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Duration</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Actual Completed</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Aging</th>
<th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Time Spent</th>
                    
                    <th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Comments</th>
                    <th style="
                        padding:10px;
                        border:1px solid #ddd;
                    ">Status</th>
                </tr>

            </thead>

            <tbody>

                ${
                    milestoneRows ||

                    '<tr><td colspan="2">No Milestones Found</td></tr>'
                }

            </tbody>

        </table>

    </div>

</td>

</tr>`

;

}
    return true;
});
    }

//     var subscriptionHtml = '';

// var addedProducts = {};

// var productSearch = search.create({

//     type: 'customrecord_rw_portal_access2',

//     filters: [
//         ['custrecord1513','anyof', projectId]
//     ],

//     columns: [
//         'custrecord_rw_portal_rwproduct'
//     ]
// });

// productSearch.run().each(function(res){

//     var productId =
//         res.getValue(
//             'custrecord_rw_portal_rwproduct'
//         );

//     if(!productId){
//         return true;
//     }

//     // avoid duplicate product
//     if(addedProducts[productId]){
//         return true;
//     }

//     addedProducts[productId] = true;

//     // =====================================
//     // PRODUCT RECORD
//     // =====================================

//     var productData =
//         search.lookupFields({

//             type:
//             'customrecord_rw_extend_products',

//             id:
//             productId,

//             columns: [
//                 'name',
//                 'custrecord_rw_ext_proj_plan_template'
//             ]
//         });

//     var productName =
//         productData.name || '';

//     var subscriptionId = '';

//     var product = '';

//     if(
//         productData
//         .custrecord_ns_subscription_plan &&
//         productData
//         .custrecord_ns_subscription_plan
//         .length
//     ){

//         subscriptionId =
//             productData
//             .custrecord_ns_subscription_plan[0]
//             .value;

//         product =
//             productData
//             .custrecord_ns_subscription_plan[0]
//             .text;
//     }

//     // =====================================
//     // FETCH CUSTOM SUBTAB RECORDS
//     // =====================================

//     var milestoneRows = '';

// var milestoneSearch = search.create({

//     type: 'customrecord_rw_project_plan_temp_child',

//     filters: [
//         [
//             'custrecord_rw_proj_plan_temp_child_link',
//             'anyof',
//             productData.custrecord_rw_ext_proj_plan_template[0].value
//         ]
//     ],

//     columns: [

//         search.createColumn({
//             name:
//             'custrecord_rw_proj_plan_temp_child_sno',

//             sort:
//             search.Sort.ASC
//         }),

//         'custrecord_rw_project_temp_child_miles'
//     ]
// });

// log.debug(
//     'MILESTONE COUNT',
//     milestoneSearch.runPaged().count
// );

// milestoneSearch.run().each(function(ms){

//     milestoneRows += `

//         <tr>

//             <td>
//                 ${
//                     ms.getText(
//                         'custrecord_rw_proj_plan_temp_child_sno'
//                     ) ||

//                     ms.getValue(
//                         'custrecord_rw_proj_plan_temp_child_sno'
//                     ) || ''
//                 }
//             </td>

//             <td>
//                 ${
//                     ms.getText(
//                         'custrecord_rw_project_temp_child_miles'
//                     ) ||

//                     ms.getValue(
//                         'custrecord_rw_project_temp_child_miles'
//                     ) || ''
//                 }
//             </td>

//         </tr>

//     `;

//     return true;
// });
    

//     // =====================================
//     // FINAL HTML
//     // =====================================

//     subscriptionHtml += `

//         <div class="subscriptionCard">

//             <div class="subscriptionTitle">

//                 ${productName}

//             </div>

//             <div class="subscriptionSubTitle">

//                 ${product}

//             </div>

//             <table class="milestoneTable">

//                 <thead>

//                     <tr>

//                         <th>S.NO</th>

//                         <th>Project Milestones</th>

//                     </tr>

//                 </thead>

//                 <tbody>

//                     ${
//                         milestoneRows ||

//                         '<tr><td colspan="2">No Milestones Found</td></tr>'
//                     }

//                 </tbody>

//             </table>

//         </div>

//     `;

//     return true;
// });
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
.subscriptionWrapper{

    margin-top:30px;
}

.subscriptionCard{

    margin-bottom:25px;
    border:1px solid #ddd;
    border-radius:12px;
    padding:20px;
    background:white;

    box-shadow:
    0 2px 8px rgba(0,0,0,0.05);
}

.subscriptionTitle{

    font-size:18px;
    font-weight:bold;
    color:#8f50df;

    margin-bottom:8px;
}

.subscriptionSubTitle{

    font-size:14px;
    color:#666;

    margin-bottom:20px;
}

.milestoneTable{

    width:100%;
    border-collapse:collapse;
}

.milestoneTable th{

    background:linear-gradient(135deg, #E6E6FA, #E6E6FA);
    color:darkblue;
    padding:10px;

    border:1px solid #ccc;
}

.milestoneTable td{

    padding:10px;
    border:1px solid #ccc;
}
.label {
    font-weight: bold;
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
            width:300px;
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
.planWrapper{
    margin-top:30px;
}

.planTabs{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    margin-bottom:20px;
}

.planTabBtn{

    background:#f3f3f3;
    border:none;
    padding:10px 18px;
    border-radius:8px;
    cursor:pointer;
    font-weight:600;
}

.planTabBtn.active{

    background:#8f50df;
    color:white;
}

.planTabContent{

    display:none;
}

.planCard{

    background:white;
    border-radius:12px;
    padding:20px;
    border:1px solid #ddd;
    box-shadow:0 2px 10px rgba(0,0,0,0.05);
}

.planTitle{

    font-size:18px;
    font-weight:bold;
    color:#8f50df;
    margin-bottom:15px;
}

.planBody{

    line-height:1.8;
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
        .backBtn:hover{
            background:#5a2d87;
        }
            #saveBtn{
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

            .section-card{

    background:#fff;

    border:1px solid #E5E7EB;

    border-radius:16px;

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

.milestone-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:15px;
}

.milestone-product{

    font-size:16px;

    font-weight:700;

    color:#002855;
}

.milestone-table{

    width:100%;

    border-collapse:collapse;

    overflow:hidden;

    border-radius:12px;
}

.milestone-table th{

    background:linear-gradient(
        135deg,
        #002855 0%,
        #5b2d8e 50%,
        #8f50df 100%
    );

    color:white;

    padding:12px;

    font-size:11px;

    text-transform:uppercase;

    letter-spacing:0.5px;
}

.milestone-table td{

    padding:10px;

    border:1px solid #E5E7EB;

    font-size:13px;
}

.milestone-table tr:hover{

    background:#f8f9fc;
}
    .status-badge{
    padding:6px 12px;
    border-radius:20px;
    color:#fff;
    font-size:12px;
    font-weight:600;
    display:inline-block;
    min-width:90px;
    text-align:center;
}

.status-badge.notstarted{
    background:#6c757d;
}

.status-badge.kickoff{
    background:#17a2b8;
}

.status-badge.inprogress{
    background:#f39c12;
}

.status-badge.uat{
    background:#3498db;
}

.status-badge.done{
    background:#28a745;
}
    </style>

    <div class="container">
    <div class="title">Project Details</div>

    <div class="section-card">

    <div class="section-title">
        Project Information
    </div>

    <div class="form-grid">

        <div class="label">Project ID</div>
        <div class="value">${projectId || ''}</div>

        <div class="label">Project Type</div>
        <div class="value">${projectType}</div>

        <div class="label">Customer</div>
        <div class="value">${customer}</div>

       <div class="label">Subsidiary</div>
<div class="value">${subsidiary}</div>

<div class="label">Class</div>
<div class="value">${projectClass}</div>

        <div class="label">Performa Invoice</div>
        
        <div class="value">
    ${fileUrl ? `<a href="javascript:void(0)"
   onclick="window.open('${fileUrl}','_blank','noopener=yes,noreferrer=yes')">
   ${fileName}
</a>` : 'No Attachment'}
    
</div>
<div class="label">Peforma Invoice Date</div>
        <div class="value">${invoice}</div>
  

        <div class="label">Revenue Stream</div>
        <div class="value">${directProject}</div>
        <div class="label">Project Manager</div>
        <div class="value">${projectManager}</div>
        <div class="label">Account Manager</div>
        <div class="value">${accountManager}</div>
        <div class="label">Product/Services</div>
        <div class="value">${erp}</div>
       </div>
</div>

<div class="section-card">

    <div class="section-title">
        Consultant & Timeline Information
    </div>

    <div class="form-grid">
        <div class="label">Go-Live Date</div>
        <div class="value">${golive}</div>
 <div class="label">Start Date</div>
        <div class="value">${st}</div>
         <div class="label">Updated End Date</div>
<div class="value">

    <span class="view-mode">${upd}</span>

    <input
        type="date"
        id="updatedEndDate"
        class="edit-mode"
        value="${toInputDate(updatedenddate)}"
        style="display:none;width:100%;"
    >

</div>
 <div class="label">End Date</div>
        <div class="value">${ed}</div>
         <div class="label">PMO comments</div>

<div class="value">

    <span class="view-mode">
        ${pmoComments || ''}
    </span>

    <textarea
        id="pmoComments"
        class="edit-mode"
        style="
            display:none;
            width:100%;
            min-height:70px;
        "
    >${pmoComments || 'NO comments'}</textarea>

</div>

         <div class="label">Functional consultant</div>
        <div class="value">${functionalText}</div>
   <div class="label">Technical consultant</div>
        <div class="value">${technicalText}</div>
        <div class="label">Duration</div>
        <div class="value">${duration} days</div>

              <div class="label">Status</div>
<div class="value">

    <span
    id="projectStatusText" class="view-mode"
    
>
    ${status}
</span>

    <select id="projectStatus" class="edit-mode" style="display:none;width:100%;" data-currenttext="${status}">
        ${projectStatusOptions}
    </select>

</div>
    </div>
    </div>
</div>
<!-- ====================================== -->
<!-- PRODUCT PLAN TABS -->
<!-- ====================================== -->

<div
    id="addProductBtn"
    style="
        display:none;
        justify-content:flex-start;
        align-items:center;
        margin-bottom:12px;
    "
>
${canAddProduct ? `
<button
    type="button"
    onclick="addNewProductRow()"
    style="
        background:linear-gradient(135deg,#5b2d8e,#8f50df);
        border:none;
        color:white;
        width:38px;
        height:38px;
        border-radius:10px;
        cursor:pointer;
        font-size:22px;
        font-weight:bold;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 4px 10px rgba(0,0,0,0.15);
    "
>
    +
</button>
` : ''}
</div>

<table style="width:100%; border-collapse:collapse; margin-top:14px;">
  <thead>
    ${tableHeader}
</thead>
    <tbody id="projectTableBody">
        ${lineItemsHtml || '<tr><td colspan="7">No data found</td></tr>'}
    </tbody>
</table>

    <button class="backBtn" type="button" onclick="goBack()">⬅ Back</button>
  

${canEdit ? `
<button id="editBtn" type="button">✏ Edit</button>
<button id="saveBtn" onclick="saveData()" style="display:none;" type="button">💾 Save</button>
` : ''}

</div>
<div id="loader">
    <div class="spinner"></div>
    <p>Loading projects...</p>
</div>
<div class="toast" id="toast">
     Project Saved Successfully
</div>
<span id="saveBadge" style="display:none; color:green; margin-left:10px;">
    ✔ Saved
</span>
    <script>
    var roleType = "${roleType}";
    var pmDropdown = ` + JSON.stringify(pmDropdown) + `;
    var rwOptions = ` + JSON.stringify(rwOptions) + `;
var funcDropdown = ` + JSON.stringify(funcDropdown) + `;
var techDropdown = ` + JSON.stringify(techDropdown) + `;
var statOptions =` +JSON.stringify(statOptions)+`;
    function addNewProductRow(){

    var tbody =
        document.querySelector(
            '#projectTableBody'
        );

    if(!tbody){
        return;
    }

    var rowHtml = '';

    // ====================================
    // PMO
    // ====================================

    if(roleType === 'PMO'){

        rowHtml += '<tr class="newRow">';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<select class="rwProduct">';
        rowHtml += rwOptions;
        rowHtml += '</select>';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<textarea class="new-comments" style="width:100%;min-height:60px;"></textarea>';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<select class="status">';
        rowHtml += statOptions;
        rowHtml += '</select>';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<input type="date" class="startdate" />';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<input type="date" class="enddate" />';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<input type="date" class="updateddeadline" />';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<input type="text" class="duration" readonly style="width:80px;background:#f5f5f5;" />';
        rowHtml += '</td>';

        rowHtml += '</tr>';
    }

    // ====================================
    // PM
    // ====================================

    else if(roleType === 'PM'){

        rowHtml += '<tr class="newRow">';

          rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<select class="rwProduct">';
        rowHtml += rwOptions;
        rowHtml += '</select>';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<textarea class="new-comments" style="width:100%;min-height:60px;"></textarea>';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<select class="rwpm">';
        rowHtml += pmDropdown;
        rowHtml += '</select>';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<select class="functional">';
        rowHtml += funcDropdown;
        rowHtml += '</select>';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<select class="technical">';
        rowHtml += techDropdown;
        rowHtml += '</select>';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<input type="date" class="uat" />';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<input type="date" class="golive" />';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<select class="status">';
        rowHtml += statOptions;
        rowHtml += '</select>';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<input type="date" class="startdate" />';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<input type="date" class="enddate" />';
        rowHtml += '</td>';

        rowHtml += '<td style="border:1px solid #ccc;padding:8px;">';
        rowHtml += '<input type="date" class="updateddeadline" />';
        rowHtml += '</td>';

        rowHtml += '</tr>';
    }

    tbody.insertAdjacentHTML(
        'beforeend',
        rowHtml
    );
}
    function calculateDays(start, end){

    if(!start || !end){
        return '';
    }

    var s = new Date(start);
    var e = new Date(end);

    var diff =
        Math.floor(
            (e - s) / (1000 * 60 * 60 * 24)
        );

    return diff >= 0 ? diff : '';
}

function autoPopulateMilestone(row){

    var startDate =
        row.querySelector('.ms-startdate')?.value || '';

    var milestoneenddate =
        row.querySelector('.ms-enddate')?.value || '';

    var actualDate =
        row.querySelector('.ms-actual')?.value || '';

    var durationInput =
        row.querySelector('.ms-duration');

    var agingInput =
        row.querySelector('.ms-aging');

    // Estimated Duration
    if(durationInput){

        durationInput.value =
            calculateDays(
                startDate,
                milestoneenddate
            );
    }

    // Aging
    if(agingInput){

        agingInput.value =
            calculateDays(
                startDate,
                actualDate
            );
    }
}

function bindMilestoneAutoCalc(){

    document
    .querySelectorAll('.milestoneRow')
    .forEach(function(row){

        var start =
            row.querySelector('.ms-startdate');

        var end =
            row.querySelector('.ms-enddate');

        var actual =
            row.querySelector('.ms-actual');

        if(start){

            start.addEventListener(
                'change',
                function(){

                    autoPopulateMilestone(row);
                }
            );
        }

        if(end){

            end.addEventListener(
                'change',
                function(){

                    autoPopulateMilestone(row);
                }
            );
        }

        if(actual){

            actual.addEventListener(
                'change',
                function(){

                    autoPopulateMilestone(row);
                }
            );
        }

        // Initial load
        autoPopulateMilestone(row);

    });
}
   document.title="project details";
    var projectUrl = '${projectUrl}';
//      function goBack(){

//     var loader = document.getElementById("loader");
//     loader.style.display = "block";   //  show loader

//     setTimeout(function(){
//         //window.parent.location.href = projectUrl;
//         window.parent.openProjects();
//     }, 300); // small delay for smooth UX
// }
    function goBack(){

    var loader = document.getElementById("loader");

    if(loader){
        loader.style.display = "block";
    }

    try{

        // hide details iframe
        window.parent.document.getElementById("projectContent").style.display = "none";

        // show project list page
        window.parent.document.getElementById("homeContent").style.display = "none";

        // reopen projects page
        window.parent.openProjects();

    }catch(e){

        console.log("Back Error", e);

        // fallback
        window.parent.location.href = projectUrl;
    }
}
    function formatDate(dateStr){
    if(!dateStr) return '';
    var d = new Date(dateStr);
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
}
    function showToast(message, color = "#28a745") {
    const toast = document.getElementById("toast");

    toast.innerText = message;
    toast.style.background = color;

   
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
    function updateCell(row, selector, value){
    var el = row.querySelector(selector);
    if(el){
        el.innerText = value;
    }
}

window.togglePlan = function(lineId){

    var row =
        document.getElementById(
            'plan_' + lineId
        );

    if(!row) return;

    if(row.style.display === 'none'){

        row.style.display = 'table-row';

    } else {

        row.style.display = 'none';
    }
};
document.addEventListener(
    'DOMContentLoaded',
    function(){

        bindMilestoneAutoCalc();

        var firstBtn =
            document.querySelector(
                '.planTabBtn'
            );

        if(firstBtn){

            firstBtn.click();
        }
    }
);
function openPlanTab(productId){

    // hide all
    document
    .querySelectorAll('.planTabContent')
    .forEach(function(tab){

        tab.style.display = 'none';
    });

    // remove active
    document
    .querySelectorAll('.planTabBtn')
    .forEach(function(btn){

        btn.classList.remove('active');
    });

    // show current
    document.getElementById(
        'tab_' + productId
    ).style.display = 'block';

    // active button
    document.getElementById(
        'tabbtn_' + productId
    ).classList.add('active');
}

// AUTO OPEN FIRST TAB
document.addEventListener(
    'DOMContentLoaded',
    function(){

        var firstBtn =
            document.querySelector(
                '.planTabBtn'
            );

        if(firstBtn){

            firstBtn.click();
        }
    }
);
var statusFlow = [
'Not Started',
    'Kick Off',
    'To-Do',
'Business requirement',
'System configuration',
'In Progress',
'In-Progress',
'On-hold',
'On Hold',
'Terminated',
'UAT',


'Go live',

'Post Go-live',
'Support',
    
   
    'Testing',
    
    'Done',
    'Completed',
     
    'COC',
    

];

function autopopulateConsultants(){

    // BODY VALUES
    var bodyPM =
        '${projectManagerId || ""}';

    var bodyFunctional =
        '${functional1 || ""}';

    var bodyTechnical =
        '${technical1 || ""}';

    // PROJECT MANAGER
    document
        .querySelectorAll('.rwpm')
        .forEach(function(pm){

            if(!pm.value){
                pm.value = bodyPM;
            }

        });

    // FUNCTIONAL
    document
        .querySelectorAll('.functional')
        .forEach(function(func){

            if(!func.value){
                func.value = bodyFunctional;
            }

        });

    // TECHNICAL
    document
        .querySelectorAll('.technical')
        .forEach(function(tech){

            if(!tech.value){
                tech.value = bodyTechnical;
            }

        });
}
function disablePreviousStatuses(selectEl){

    if(!selectEl) return;

    var currentText =
        (
            selectEl.getAttribute(
                'data-currenttext'
            ) || ''
        ).trim().toLowerCase();

    Array.from(selectEl.options)
    .forEach(function(opt){

        opt.disabled = false;
        opt.style.color = '';
    });

    var currentIndex = statusFlow
    .map(function(s){
        return s.toLowerCase();
    })
    .indexOf(currentText);

    if(currentIndex < 0){
        return;
    }

    Array.from(selectEl.options)
    .forEach(function(opt){

        var optionText =
            (opt.text || '')
            .trim()
            .toLowerCase();

        var optIndex = statusFlow
        .map(function(s){
            return s.toLowerCase();
        })
        .indexOf(optionText);

        if(optIndex < currentIndex){

            opt.disabled = true;

            opt.style.background =
                '#f1f1f1';

            opt.style.color =
                '#999';
        }
    });
}
    function syncProjectManager(currentSelect){

    var selectedValue = currentSelect.value;

    document.querySelectorAll('.rwpm').forEach(function(pm){

        pm.value = selectedValue;

    });

}
    function syncFunctional(currentSelect){

    var selectedValue =
        currentSelect.value;

    document
        .querySelectorAll('.functional')
        .forEach(function(func){

            func.value = selectedValue;

        });
}

function syncTechnical(currentSelect){

    var selectedValue =
        currentSelect.value;

    document
        .querySelectorAll('.technical')
        .forEach(function(tech){

            tech.value = selectedValue;

        });
}
  function saveData(){

  var rows =
document.querySelectorAll(
    "#projectTableBody tr[data-id], #projectTableBody tr.newRow"
);
    var projectStatus = document.getElementById("projectStatus")?.value || '';
    var updatedEndDate =
    document.getElementById("updatedEndDate")?.value || '';
var pmoComments =
    document.getElementById("pmoComments")?.value || '';
    var data = [];

    var milestoneData = [];

document.querySelectorAll('.milestoneRow')
.forEach(function(row){

    milestoneData.push({

        id:
            row.dataset.planid || '',

        milestoneid:
            row.dataset.milestoneid || '',

        productid:
            row.dataset.productid || '',

        sno:
            row.dataset.sno || '',

        startdate:
            row.querySelector('.ms-startdate')?.value || '',

        enddate:
            row.querySelector('.ms-enddate')?.value || '',

        duration:
            row.querySelector('.ms-duration')?.value || '',

        actual:
            row.querySelector('.ms-actual')?.value || '',

        aging:
            row.querySelector('.ms-aging')?.value || '',

        timespent:
            row.querySelector('.ms-timespent')?.value || '',
            status:
    row.querySelector('.ms-status')
    ? row.querySelector('.ms-status').value
    : '',

comments:
    row.querySelector('.ms-comments')
    ? row.querySelector('.ms-comments').value
    : '',
    });
});

console.log(
    'MILESTONE DATA',
    milestoneData
);
var hasError = false;
    rows.forEach(function(row){

        var id = row.getAttribute("data-id") || '';

        
        // if(!id){
        //     console.log("Skipping row without ID");
        //     return;
        // }
        //     else{
        //         console.log("new proudct is not added");
        //         }
if(hasError){
    return;
}
     
var functional = row.querySelector("select.edit-mode.functional")?.value;
var technical  = row.querySelector("select.edit-mode.technical")?.value;
var uat        = row.querySelector("input.edit-mode.uat")?.value;
var rwpm =
    row.querySelector(
        "select.edit-mode.rwpm"
    )?.value || '';
var golive     = row.querySelector("input.edit-mode.golive")?.value;
var status     = row.querySelector("select.edit-mode.status")?.value;
var statusText =
    row.querySelector(
        "select.edit-mode.status"
    )?.selectedOptions[0]?.text || '';
var startdate = row.querySelector("input.edit-mode.startdate")?.value;
var enddate = row.querySelector("input.edit-mode.enddate")?.value;
var updateddeadline = row.querySelector("input.edit-mode.updateddeadline")?.value;
       // DATE VALIDATIONS
var duration = '';

if(startdate && enddate){

    var s = new Date(startdate);
    var e = new Date(enddate);

    var diff =
        e.getTime() - s.getTime();

    if(diff >= 0){

        var days = Math.ceil(
            diff / (1000 * 60 * 60 * 24)
        );

        duration = days + ' days';
    }
}


if(startdate && enddate){

    var startObj = new Date(startdate);
    var endObj = new Date(enddate);

    if(startObj > endObj){

        showToast(
            "Start Date should be less than End Date",
            "#e74c3c"
        );

      hasError = true;
return;
    }
}

if(updateddeadline && enddate){

    var updatedObj = new Date(updateddeadline);
    var endObj2 = new Date(enddate);

    if(updatedObj < endObj2){

        showToast(
            "Updated Deadline should be greater than End Date",
            "#e74c3c"
        );

        hasError = true;
return;
    }
}
var projectStartDate = '${toInputDate(stdate)}';
var projectEndDate = '${toInputDate(eddate)}';
var projectUpdatedEndDate = '${toInputDate(updatedenddate)}';

// PRODUCT START DATE VALIDATION
if(startdate && projectStartDate){

    if(new Date(startdate) < new Date(projectStartDate)){

        showToast(
            "Product Start Date cannot be less than Project Start Date",
            "#e74c3c"
        );

        hasError = true;
        return;
    }
}
document.getElementById(
    'addProductBtn'
).style.display = 'none';
// PRODUCT END DATE VALIDATION
if(enddate && projectEndDate){

    if(new Date(enddate) > new Date(projectEndDate)){

        showToast(
            "Product End Date cannot exceed Project End Date",
            "#e74c3c"
        );

        hasError = true;
        return;
    }
}

// PRODUCT UPDATED DEADLINE VALIDATION
if(updateddeadline && projectUpdatedEndDate){

    if(
        new Date(updateddeadline) >
        new Date(projectUpdatedEndDate)
    ){

        showToast(
            "Product Updated Deadline cannot exceed Project Updated End Date",
            "#e74c3c"
        );

        hasError = true;
        return;
    }
}
     data.push({

    id: id,

    // NEW PRODUCT
    productid:
        row.querySelector('.rwProduct')?.value || '',

    comments:
        row.querySelector('.new-comments')?.value || '',

    functional: functional || '',

    technical: technical || '',

    rwpm: rwpm,

    uat: uat || '',

    golive: golive || '',

    status: status || '',

    startdate: startdate || '',

    enddate: enddate || '',

    updateddeadline:
        updateddeadline || '',

    duration: duration,

    statusText: statusText

});
    });

    console.log("FINAL DATA SENT:", data); // 🔥 DEBUG

    if(data.length === 0){
        alert("No valid data to update");
        return;
    }

 fetch(window.location.href, {

    method: 'POST',

    headers: {
        'Content-Type': 'application/json'
    },

    body: JSON.stringify({

        data: data,

        milestoneData: milestoneData,

        projectStatus: projectStatus,

        updatedEndDate: updatedEndDate,

        pmoComments: pmoComments,

        projectId: "${projectId}",

empid: "${empId}"
    })
})
.then(res => res.text())
.then(res => {

    console.log("SERVER RESPONSE:", res);

    if(res === "success"){
showToast("Project Saved Successfully ");
alert("Project Saved Succesfully");
  
        // ✅ Update UI with new values
        document.querySelectorAll("tbody tr").forEach(function(row){

            var funcSel = row.querySelector("select.edit-mode.functional");
            var techSel = row.querySelector("select.edit-mode.technical");
            var uatInp  = row.querySelector("input.edit-mode.uat");
            var golInp  = row.querySelector("input.edit-mode.golive");
            var statSel = row.querySelector("select.edit-mode.status");
            var startInp = row.querySelector("input.edit-mode.startdate");
            var endInp = row.querySelector("input.edit-mode.enddate");
            var updInp = row.querySelector("input.edit-mode.updateddeadline");
            var statusText =
    row.querySelector(
        "select.edit-mode.status"
    )?.selectedOptions[0]?.text || '';


            var durationInp =
    row.querySelector(
        "input.edit-mode.duration"
    );

if(durationInp){

    updateCell(
        row,
        ".duration-text",
        durationInp.value
    );
}
            if(funcSel){
    var txt = funcSel.options[funcSel.selectedIndex]?.text || '';
    updateCell(row, "td:nth-child(4) .view-mode", txt);
}
if(startInp){

    // ONLY PMO
    if(row.querySelector("td:nth-child(4) .startdate")){
        updateCell(row, "td:nth-child(4) .view-mode", formatDate(startInp.value));
    }

    // PM
    updateCell(row, "td:nth-child(9) .view-mode", formatDate(startInp.value));
}

if(endInp){

    // ONLY PMO
    if(row.querySelector("td:nth-child(5) .enddate")){
        updateCell(row, "td:nth-child(5) .view-mode", formatDate(endInp.value));
    }

    // PM
    updateCell(row, "td:nth-child(10) .view-mode", formatDate(endInp.value));
}

if(updInp){

    // ONLY PMO
    if(row.querySelector("td:nth-child(6) .updateddeadline")){
        updateCell(row, "td:nth-child(6) .view-mode", formatDate(updInp.value));
    }

    // PM
    updateCell(row, "td:nth-child(11) .view-mode", formatDate(updInp.value));
}
if(techSel){
    var txt = techSel.options[techSel.selectedIndex]?.text || '';
    updateCell(row, "td:nth-child(5) .view-mode", txt);
}

if(uatInp){
    updateCell(row, "td:nth-child(6) .view-mode", formatDate(uatInp.value));
}

if(golInp){
    updateCell(row, "td:nth-child(7) .view-mode", formatDate(golInp.value));
}

if(statSel){
    var txt = statSel.options[statSel.selectedIndex]?.text || '';

    // for PMO/DEV
    updateCell(row, "td:nth-child(3) .view-mode", txt);

    // for OTHER roles
    updateCell(row, "td:nth-child(8) .view-mode", txt);
}
var statusSelect = document.getElementById("projectStatus");

if(statusSelect){
    var selectedText = statusSelect.options[statusSelect.selectedIndex]?.text || '';
    document.querySelector("#projectStatus").previousElementSibling.innerText = selectedText;
}
            

        });

        // ✅ Switch back to view mode
        document.querySelectorAll(".edit-mode").forEach(el => el.style.display = "none");
        document.querySelectorAll(".view-mode").forEach(el => el.style.display = "inline");

        document.getElementById("saveBtn").style.display = "none";
document.getElementById("editBtn").style.display = "inline";

showToast(
    "Project Saved Successfully",
    "#28a745"
);

setTimeout(function(){

    window.location.href =
        window.location.href;

}, 1200);

    } else {
        alert("Error: " + res);
    }

});
}
window.toggleHistory = function(lineId){

    var row = document.getElementById(
        'history_' + lineId
    );

    if(!row) return;

    var icon = document.querySelector(
        '[onclick="toggleHistory(\\'' + lineId + '\\')"]'
    );

    if(row.style.display === 'none'){

        row.style.display = 'table-row';

        if(icon){
            icon.innerHTML = '▼';
        }

    } else {

        row.style.display = 'none';

        if(icon){
            icon.innerHTML = '▶';
        }
    }
};
document.addEventListener('change', function(e){

    var row = e.target.closest('tr');

    if(!row) return;

    var startInput =
        row.querySelector('.edit-mode.startdate');

    var endInput =
        row.querySelector('.edit-mode.enddate');

    var durationInput =
        row.querySelector('.edit-mode.duration');

    if(
        !startInput ||
        !endInput ||
        !durationInput
    ){
        return;
    }

    var start = startInput.value;
    var end = endInput.value;

    if(start && end){

        var s = new Date(start);
        var ed = new Date(end);

        var diff = ed - s;

        if(diff >= 0){

            var days = Math.ceil(
                diff /
                (1000 * 60 * 60 * 24)
            );

            durationInput.value =
                days + ' days';

        } else {

            durationInput.value = '';
        }
    }

});
function validateActualCompleted(el){

    var row =
        el.closest('tr');

    var endDate =
        row.querySelector('.ms-enddate').value;

    var actualDate =
        el.value;

    if(!endDate || !actualDate){
        return true;
    }

    var end =
        new Date(endDate);

    var actual =
        new Date(actualDate);

    if(actual > end){

        alert(
            'Warning: you are execeding the milestone end date!'
        );
    }

    return true;
}
document.getElementById("saveBadge").style.display = "inline";

setTimeout(()=>{
    document.getElementById("saveBadge").style.display = "none";
}, 2000);
function enableEdit(){

    document.querySelectorAll(".view-mode")
    .forEach(function(el){

        el.style.display = "none";
    });
isEditMode = true;
    document.querySelectorAll(".edit-mode")
    .forEach(function(el){

        el.style.display = "inline-block";
    });

    // DISABLE PASSED STATUS FOR LINE ITEMS
    document
    .querySelectorAll('select.edit-mode.status')
    .forEach(function(sel){

        disablePreviousStatuses(sel);
    });

    // DISABLE PASSED STATUS FOR PROJECT STATUS
    var projectStatus =
        document.getElementById(
            'projectStatus'
        );

    if(projectStatus){

        disablePreviousStatuses(
            projectStatus
        );
    }

    document.getElementById("editBtn")
    .style.display = "none";

    document.getElementById("saveBtn")
    .style.display = "inline-block";
    // SHOW ADD BUTTON
    document.getElementById(
        'addProductBtn'
    ).style.display = 'flex';
    document
        .querySelectorAll('.action-col')
        .forEach(function(td){
            td.style.display = '';
        });

    document
        .querySelectorAll('.edit-action-col')
        .forEach(function(th){
            th.style.display = '';
        });
    autopopulateConsultants();
}
  document.addEventListener("DOMContentLoaded", function () {

    var editBtn = document.getElementById("editBtn");
    var saveBtn = document.getElementById("saveBtn");

    if(editBtn){
        editBtn.addEventListener("click", enableEdit);
    }

    // if(saveBtn){
    //     saveBtn.addEventListener("click", saveData);
    // }

});
document
.querySelectorAll('select.edit-mode.status')
.forEach(function(sel){

    disablePreviousStatuses(sel);

});
 sessionStorage.setItem(
    'refreshDashboard',
    'true'
);
document.addEventListener('change', function(){

    if(isEditMode){
        hasChanges = true;
    }

});
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
document.addEventListener('change', function(){

    if(isEditMode){
        hasChanges = true;
    }

});
function removeProduct(lineId){

    if(!confirm('Remove this product?')){
        return;
    }

    fetch(window.location.href,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            action:'deleteProduct',
            lineId:lineId
        })
    })
    .then(async r => {

    const txt = await r.text();

    console.log('SERVER RESPONSE:', txt);

    return JSON.parse(txt);
})
    .then(function(res){

        if(res.success){

            document
                .querySelector(
                    'tr[data-id="' + lineId + '"]'
                )
                .remove();
                alert("product removed");
        }
    });
}
    </script>
    `;

    context.response.writePage(form);
};

return { onRequest };

});