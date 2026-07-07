/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/url','N/search','N/runtime','N/redirect','N/record'], (serverWidget,url,search,runtime,redirect,record) => {

const onRequest = (context) => {

var empId = context.request.parameters.empid 
         || context.request.parameters.empId 
         || context.request.parameters.employeeId 
         || '';

var email = context.request.parameters.email;
var empInternalId = getEmployeeInternalId(email);
log.debug("Employee Internal ID", empInternalId);
if (
    context.request.parameters.action ===
    'updateTicketStatus'
) {

    var ticketId =
        context.request.parameters.ticketid;

    var statusId =
        context.request.parameters.statusid;

    log.debug(
        'UPDATE',
        ticketId + ' -> ' + statusId
    );

    record.submitFields({
        type:'customrecord_rw_ticket',
        id: ticketId,
        values:{
            custrecord_rw_ticket_ticketstatus:
                statusId
        }
    });

    context.response.write('success');
    return;
}

function getTotalCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters: ['isinactive','is','F'],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project",count);
    return count;
}
function getMyProjectCount(empId){

    if(!empId) return 0;

    var projectSearch = search.create({
        type: 'customrecord_rw_portal_access',
        filters: [
            ['isinactive','is','F'],
            'AND',
            [
                [
                    'custrecord_rw_portal_projectmanager','anyof',empId
                ],
                'OR',
                [
                    'custrecord_rw_portal_technical','anyof',empId
                ],
                'OR',
                [
                    'custrecord_rw_portal_functional_consulta','anyof',empId
                ],
                'OR',
                [
                    'custrecord_rw_portal_accountmanager','anyof',empId
                ]
            ]
        ]
    });

    return projectSearch.runPaged().count;
}
function getTotalTicketCount(){
    var ticketSearch =search.create({
        type:'customrecord_rw_ticket',
        filters:[],
        columns:[],
    })
    var count=ticketSearch.runPaged().count;
    log.debug("Total tickets",count);
    return count;
}
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
function getAssignedTicketCount(empId){

    if(!empId) return 0;

    var ticketSearch = search.create({
        type: 'customrecord_rw_ticket',
        filters: [
            ['custrecord_rw_ticket_assignedto','anyof', empId]
        ]
    });

    return ticketSearch.runPaged().count;
}
function getInProgressCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['custrecord_rw_portal_status','anyof','2']
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
function getKickOffCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
             ['isinactive','is','F'],
             'AND',
            ['custrecord_rw_portal_status','anyof',['1']]
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
function getBussinessCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['custrecord_rw_portal_status','anyof','7']
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
function getTrainingCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['custrecord_rw_portal_status','anyof','9']
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
function getUATCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['custrecord_rw_portal_status','anyof','4']
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
function getGoliveCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['custrecord_rw_portal_status','anyof','5']
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
var debugSearch = search.create({
    type:'customrecord_rw_portal_access',
    filters:[
        ['isinactive','is','F']
    ],
    columns:[
        'internalid',
        'custrecord_rw_portal_status'
    ]
});

debugSearch.run().each(function(res){

    log.debug("ID", res.getValue('internalid'));
    log.debug("STATUS VALUE", res.getValue('custrecord_rw_portal_status'));
    log.debug("STATUS TEXT", res.getText('custrecord_rw_portal_status'));

    return true;
});

var empRoleMap = {};
function getCOCCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['isinactive','is','F'],
             'AND',
            ['custrecord_rw_portal_status','is','6']
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
function getSupportCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['isinactive','is','F'],
             'AND',
            ['custrecord_rw_portal_status','anyof',['11']]
        ],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project in progress",count);
    return count;
}
function getOpenProjectCount(){

    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',

        filters:[

            ['isinactive','is','F'],
            'AND',

            ['custrecord_rw_portal_status','noneof',['6','7','8']],
            'AND',

            ['custrecord_rw_portal_status','isnotempty','']
        ]
    });

    var count = projectSearch.runPaged().count;

    log.debug("Total open projects", count);

    return count;
}

function getClosedProjectCount(){

    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',

        filters:[

            ['isinactive','is','F'],
            'AND',

            ['custrecord_rw_portal_status','anyof',['6','7','8']]
        ]
    });

    var count = projectSearch.runPaged().count;

    log.debug("Total closed projects", count);

    return count;
}
function getMyClosedProjectCount(empId){

    if(!empId) return 0;

    var projectSearch = search.create({

        type:'customrecord_rw_portal_access',

        filters:[
            ['isinactive','is','F'],
            'AND',
            ['custrecord_rw_portal_projectmanager','anyof',empId],
            'AND',
            ['custrecord_rw_portal_status','anyof',['6','7','8']]
        ]
    });

    return projectSearch.runPaged().count;
}

function getOpenTicketsCount(){
    var ticketSearch=search.create({
        type:'customrecord_rw_ticket',
        filters:[
            ['custrecord_rw_ticket_ticketstatus','noneof','5']
        ]
    })
    var count=ticketSearch.runPaged().count;
    log.debug("Total open tickets",count);
    return count;
}
var debugSearch = search.create({
    type:'customrecord_rw_portal_access',

    filters:[
        ['isinactive','is','F']
    ],

    columns:[
        'internalid',
        'custrecord_rw_portal_status'
    ]
});

debugSearch.run().each(function(res){

    log.debug(
        "PROJECT",
        "ID: " + res.getValue('internalid') +
        " STATUS: " + res.getValue('custrecord_rw_portal_status') +
        " TEXT: " + res.getText('custrecord_rw_portal_status')
    );

    return true;
});
var openTicketCount=getOpenTicketCount();
function getclosedTicketsCount(){
    
    var ticketSearch=search.create({
        type:'customrecord_rw_ticket',
        filters:[
            ['custrecord_rw_ticket_assignedto','anyof',empId],
            'AND',
            ['custrecord_rw_ticket_ticketstatus','anyof','5']
        ]
    })
    var count=ticketSearch.runPaged().count;
    log.debug("Total closed tickets",count);
    return count;
}
var closedTicketCount=getclosedTicketsCount();
function getEmployeeRole(empInternalId){
    if(!empInternalId) return '';

    var empSearch = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empInternalId,
        columns: ['role']
    });

    
    if (empSearch.role && empSearch.role.length > 0) {
        return empSearch.role[0].id || '';
    }

    return '';   
}
function getEmployeeDMSRole(empId){

    if(!empId) return '';

    var emp = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empId,
        columns: ['custentityrw_dms_role']   //  correct field
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
function getOpenTicketCount(){
    var ticketSearch=search.create({
        type:'customrecord_rw_ticket',
        filters:[
            ['custrecord_rw_ticket_ticketstatus','noneof','5']
        ]
    })
    var count=ticketSearch.runPaged().count;
    log.debug("Total open tickets",count);
    return count;
}
function getSprintBoardData(empId){

    var data = {
        todo: [],
        progress: [],
        testing: [],
        codeReview:[],
        done: []
    };

    var ticketSearch = search.create({
        type:'customrecord_rw_ticket',
        filters:[
            ['custrecord_rw_ticket_assignedto','anyof',empId]
        ],
        columns:[
            'internalid',
            'custrecord_rw_ticket_ticketno',
            'custrecord_rw_ticket_projectname',
            'custrecord_rw_ticket_deadline',
            'custrecord_rw_ticket_ticketstatus'
        ]
    });

    ticketSearch.run().each(function(res){

        var ticket = {
            id: res.getValue('internalid'),
            number: res.getValue('custrecord_rw_ticket_ticketno'),
            project: res.getText('custrecord_rw_ticket_projectname'),
            deadline: res.getValue('custrecord_rw_ticket_deadline')
        };

        var status = res.getValue(
            'custrecord_rw_ticket_ticketstatus'
        );

        if(status == '1'){
            data.todo.push(ticket);
        }
        else if(status == '2'){
            data.progress.push(ticket);
        }
        else if(status == '4'){
            data.testing.push(ticket);
        }
        else if(status == '3'){
            data.codeReview.push(ticket);
        }
        else if(status == '5'){
            data.done.push(ticket);
        }

        return true;
    });

    return data;
}
const form = serverWidget.createForm({ title: ' ' });

const htmlField = form.addField({
id: 'custpage_dashboard',
type: serverWidget.FieldType.INLINEHTML,
label: 'Dashboard'
});


const loginUrl = url.resolveScript({
scriptId: 'customscript2872',
deploymentId: 'customdeploy1',
returnExternalUrl: true,
 params: {
        empid: empId,
        email: email
    }
});

const taskUrl = url.resolveScript({
scriptId: 'customscript2899',
deploymentId: 'customdeploy1',
returnExternalUrl: true,
 params: {
        empid: empId,
        email: email
    }
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

const projectPlanUrl = url.resolveScript({
    scriptId: 'customscript3140',
    deploymentId: 'customdeploy1',
    returnExternalUrl: true,
    params: {
        empid: empId,
        email: email
    }
});
 const newProjectPlanUrl = url.resolveScript({
    scriptId: 'customscript3146',
    deploymentId: 'customdeploy1',
    returnExternalUrl: true,
    params: {
        empid: empId,
        email: email
    }
});

 const newRevenueStreamUrl = url.resolveScript({
    scriptId: 'customscript3168',
    deploymentId: 'customdeploy1',
    returnExternalUrl: true,
    params: {
        empid: empId,
        email: email
    }
});

var viewProjectUrl = url.resolveScript({
scriptId: 'customscript2892',
deploymentId: 'customdeploy1',
returnExternalUrl: true,
params: {
        empid: empId,
        email: email
    }
});
 var selectedEmpId = empId || '';
        log.debug("FINAL EMP ID", selectedEmpId);
        var currentUser = runtime.getCurrentUser();
var loggedRoleName = currentUser.roleCenter; 
const ticketUrl = url.resolveScript({
scriptId: 'customscript2894',
deploymentId: 'customdeploy1',
returnExternalUrl: true,
params: {
        empid: empId,
        email: email
    }
});
function getHighPriorityTicketList(){

    var tickets = [];

    var ticketSearch = search.create({
        type: 'customrecord_rw_ticket',
        filters: [
            ['custrecord_rw_ticket_priority','anyof','1'] 
        ],
        columns: [
            'custrecord_rw_ticket_ticketno', // Ticket Number
            'custrecord_rw_ticket_deadline'
        ]
    });

    ticketSearch.run().each(function(result){

        tickets.push({
            number: result.getValue('custrecord_rw_ticket_ticketno'),
            deadline: result.getValue('custrecord_rw_ticket_deadline')
        });

        return true;
    });

    return tickets;
}
var projectCount=getTotalCount();
var inProgressCount=getInProgressCount();
var totalTickets=getTotalTicketCount();
var openProjects=getOpenProjectCount();
var closedProjects=getClosedProjectCount();
var openTickets=getOpenTicketCount();
var empInternalId = getEmployeeInternalId(email);
var empRole = getEmployeeRole(empInternalId);
log.debug("Employee Role", empRole);
var highPriorityTickets = getHighPriorityTicketList();
var assignedTickets = getAssignedTicketCount(empId);
var kickOffCount=getKickOffCount();
var bussinesCount=getBussinessCount();
var training=getTrainingCount();
var uatCount=getUATCount();
var myClosedProjects = getMyClosedProjectCount(empId);
var golive=getGoliveCount();
var coc=getCOCCount();
var pmProjectCount = getMyProjectCount(empId);
var support=getSupportCount();
var sprintData = getSprintBoardData(empId);
function getRoleType(roleName){
    if (!roleName) return 'OTHER';
    roleName = roleName.toLowerCase();

    if(roleName.includes('pmo')) return 'PMO';
    if(roleName.includes('pm')) return 'PM';
    if(roleName.includes('developer')) return 'DEV';

    return 'OTHER';
}
var myOpenCount = 0;

if (empId) {

    var openTicketSearch = search.create({
        type: 'customrecord_rw_ticket',
        filters: [
            ['custrecord_rw_ticket_assignedto','anyof',empId],
            'AND',
            ['custrecord_rw_ticket_ticketstatus','noneof','5'] // exclude Done
        ],
        columns: [
            search.createColumn({ name: 'internalid', summary: 'COUNT' })
        ]
    });

    var result = openTicketSearch.run().getRange({ start: 0, end: 1 });

    if (result && result.length > 0) {
        myOpenCount = result[0].getValue({
            name: 'internalid',
            summary: 'COUNT'
        }) || 0;
    }
}
if (!empRole || empRole.trim() === '') {
    empRole =  'Others';
}
function getCurrentGoLiveProducts(){

    var data = [];

    var searchObj = search.create({
        type: 'customrecord_rw_portal_access2',
        filters: [
            ['custrecord1513.custrecord_rw_portal_status','anyof','5'] // Go-Live
        ],
        columns: [
            'custrecord_rw_portal_rwproduct',
             search.createColumn({
                name: 'custrecord_rw_portal_customername',
                join: 'custrecord1513'
            }) //  Project reference field (confirm ID)
        ]
    });

    searchObj.run().each(function(result){

        var product = result.getText('custrecord_rw_portal_rwproduct');
        var project = result.getText({
            name: 'custrecord_rw_portal_customername',
            join: 'custrecord1513'
        }); // project name

        data.push({
            product: product || '-',
            project: project || '-'
        });

        return true;
    });

    return data;
}
var roleType = getRoleType(empRole);
log.debug(empRole)
let statsHeader = '';
let statsValues = '';
var empInternalId = getEmployeeInternalId(email);
let projectStatsHeader = '';
let projectStatsValues = '';

let ticketStatsHeader = '';
let ticketStatsValues = '';
var dmsRole = getEmployeeDMSRole(empInternalId);
var loggedInUserName = getEmployeeName(empInternalId);
var roleType = getRoleTypeFromDMS(dmsRole);

log.debug("DMS ROLE", dmsRole);
log.debug("ROLE TYPE", roleType);
if(roleType === 'PMO'){
    statsValues = `
<div class="pmo-stat-card">
    <div class="st-header">Total Projects</div>
    <div class="data-val" onclick="openProjects('total')">${projectCount}</div>
</div>

<div class="pmo-stat-card">
    <div class="st-header">Open Projects</div>
    <div class="data-val" onclick="openProjects('open')">${openProjects}</div>
</div>

<div class="pmo-stat-card">
    <div class="st-header">Kickoff</div>
    <div class="data-val" onclick="openProjects('kickof')">${kickOffCount}</div>
</div>

<div class="pmo-stat-card">
    <div class="st-header">UAT</div>
    <div class="data-val" onclick="openProjects('uat')">${uatCount}</div>
</div>

<div class="pmo-stat-card">
    <div class="st-header">Go Live</div>
    <div class="data-val" onclick="openProjects('golive')">${golive}</div>
</div>

<div class="pmo-stat-card">
    <div class="st-header">COC</div>
    <div class="data-val" onclick="openProjects('coc')">${coc}</div>
</div>

<div class="pmo-stat-card">
    <div class="st-header">Closed Projects</div>
    <div class="data-val" onclick="openProjects('done')">${closedProjects}</div>
</div>
`;
}
else if(roleType === 'PM'){
    
    projectStatsHeader = `
    <div class="st-header">Total Projects</div>
    <div class="st-header">Open Projects</div>
    <div class="st-header">In Progress</div>
    <div class="st-header">My Closed Projects</div>
    <div class="st-header">My Projects</div>
`;

projectStatsValues = `
    <div class="data-val" id="tit" onclick="openProjects('total')">${projectCount}</div>
        
        <div class="data-val" id="tit" onclick="openProjects('open')">${openProjects}</div>
        <div class="data-val" id="tit" onclick="openProjects('inprogress')">${inProgressCount}</div>
         <div class="data-val" id="tit" onclick="openProjects('close')">${myClosedProjects}</div>
         <div class="data-val" id="tit" onclick="openProjects('myprojects')">${pmProjectCount}</div>
`;

ticketStatsHeader = `
    <div class="st-header">Total Tickets</div>
    <div class="st-header">Total Open Tickets</div>
    <div class="st-header">My Assigned Tickets</div>
    <div class="st-header">My Open Tickets</div>
`;

ticketStatsValues = `
    <div class="data-val" id="tit" onclick="openTickets('total')">${totalTickets}</div>
        <div class="data-val" id="tit" onclick="openTickets('allopen')">${openTicketCount}</div>
        
        <div class="data-val" id="tit" onclick="openTickets('assigned')">${assignedTickets}</div>
        <div class="data-val" id="tit" onclick="openTickets('open')">${myOpenCount}</div>
        
`;
}
else if(roleType === 'DEV'){
    statsHeader = `
    <div class="st-header">My Projects</div>
        
        
        <div class="st-header">My  Tickets</div>
        <div class="st-header">My Open Tickets</div>
        <div class="st-header">My Closed Tickets</div>
    `;

    statsValues = `
    <div class="data-val" id="tit" onclick="openProjects('myprojects')">${pmProjectCount}</div>
      
    <div class="data-val" id="tit" onclick="openTickets('assigned')">${assignedTickets}</div>
    <div class="data-val" id="tit" onclick="openTickets('open')">${myOpenCount}</div>
     <div class="data-val" id="tit" onclick="openTickets('closed')">${closedTicketCount}</div>
    `;
}
else{
     statsHeader = `
     
        <div class="st-header">My Tickets</div>
        <div class="st-header">My Open Tickets</div>
        <div class="st-header">My Closed Tickets</div>
    `;

    
    statsValues = `
     
    <div class="data-val" id="tit" onclick="openTickets('assigned')">${assignedTickets}</div>
    <div class="data-val" id="tit" onclick="openTickets('open')">${myOpenCount}</div>
    <div class="data-val"  id="tit" onclick="openTickets('closed')">${closedTicketCount}</div>
`;
}



function getCurrentGoLiveProducts(empId, roleType){

    if(!empId) return [];

    var data = [];

    var filters = [
        ['custrecord1513.custrecord_rw_portal_status','anyof','5']
    ];

    // PM → projects managed by PM
    if(roleType === 'PM'){

        filters.push(
            'AND',
            ['custrecord1513.custrecord_rw_portal_projectmanager','anyof', empId]
        );
    }

    // DEV / OTHER → assigned tickets/projects
    else{

        filters.push(
            'AND',
            ['custrecord1513.custrecord_rw_portal_projectmanager','anyof', empId]
        );
    }

    var searchObj = search.create({
        type: 'customrecord_rw_portal_access2',

        filters: filters,

        columns: [
            'custrecord_rw_portal_rwproduct',

            search.createColumn({
                name: 'custrecord_rw_portal_customername',
                join: 'custrecord1513'
            })
        ]
    });

    searchObj.run().each(function(result){

        var product = result.getText(
            'custrecord_rw_portal_rwproduct'
        );

        var project = result.getText({
            name: 'custrecord_rw_portal_customername',
            join: 'custrecord1513'
        });

        data.push({
            product: product || '-',
            project: project || '-'
        });

        return true;
    });

    return data;
}
var goLiveProductsForUser = getCurrentGoLiveProducts(empId, roleType);
var avatarLetter = (empRole && empRole.length > 0) 
    ? empRole.charAt(0).toUpperCase() 
    : 'U';

var ticketMenu = '';

if (roleType !== 'PMO') {
    ticketMenu = `<div class="menu" onclick="setActiveMenu(this);openTickets(); closeMenu()"><i class="fa-solid fa-ticket"></i> <span> Tickets</span></div>`;
}
var projectPlan ='';
if(roleType === 'PM'){
    projectPlan = `<div class="menu" onclick="setActiveMenu(this);openProjectPlan(); closeMenu()"><i class="fa-solid fa-chart-gantt"></i>   Project Plan</div>`;
}

var newProjectPlan ='';
if(roleType === 'PM'){
    newProjectPlan = `<div class="menu" onclick="setActiveMenu(this);openNewProjectPlan(); closeMenu()"><i class="fa-solid fa-file-circle-plus"></i>  Milestone</div>`;
}
var newRevenueStream ='';
if(roleType === 'PM'){
    newRevenueStream = `<div class="menu" onclick="setActiveMenu(this);openRevenueStream(); closeMenu()"><i class="fa-solid fa-chart-area"></i>   Revenue Stream</div>`;
}
var projectMenu = '';
if(roleType !== 'OTHER'){
    projectMenu = '<div class="menu" onclick="setActiveMenu(this);openProjects(); closeMenu()"> <i class="fa-solid fa-list"></i>  Projects</div>';
}
function getCurrentMonthDates(){
    var today = new Date();

    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return { firstDay, lastDay };
}
function getCalendarEvents(){

    var events = [];

    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',

        filters:[
            ['isinactive','is','F']
        ],

        columns:[
            'internalid',
            'custrecord_rw_portal_customername',
            'custrecord_rw_portal_start_date',
            'custrecord_rw_portal_end_date',
            'custrecord_rw_portal_status'
        ]
    });

    projectSearch.run().each(function(res){

        var projectName =
            res.getText('custrecord_rw_portal_customername');

        var status =
            res.getValue('custrecord_rw_portal_status');

        var startDate =
            res.getValue('custrecord_rw_portal_start_date');

        var endDate =
            res.getValue('custrecord_rw_portal_end_date');

        var projectId =
            res.getValue('internalid');

        // UAT
        if(status == '4' && startDate){

            events.push({
                title:'UAT - ' + projectName,
                start: formatCalendarDate(startDate),
                color:'#3b82f6',
                url:'${viewProjectUrl}&projectId=' + projectId
            });
        }

        // Go Live
        if(status == '5' && startDate){

            events.push({
                title:'Go Live - ' + projectName,
                start: formatCalendarDate(startDate),
                color:'#10b981',
                url:'${viewProjectUrl}&projectId=' + projectId
            });
        }

        // COC
        if(status == '6' && endDate){

            events.push({
                title:'COC - ' + projectName,
                start: formatCalendarDate(endDate),
                color:'#8b5cf6',
                url:'${viewProjectUrl}&projectId=' + projectId
            });
        }

        return true;
    });

    return events;
}
function formatCalendarDate(nsDate){

    if(!nsDate) return '';

    var parts = nsDate.split('/');

    return parts[2] + '-' +
           parts[1].padStart(2,'0') + '-' +
           parts[0].padStart(2,'0');
}
function getProjectProgress(){

    var data = [];

    var projectSearch = search.create({

        type:'customrecord_rw_portal_access',

        filters:[
            ['isinactive','is','F']
        ],

        columns:[
            'internalid',
            'custrecord_rw_portal_customername',
            'custrecord_rw_portal_status'
        ]
    });

    projectSearch.run().each(function(project){

        var projectId =
            project.getValue('internalid');

        var projectName =
            project.getText(
                'custrecord_rw_portal_customername'
            ) || 'Project';

        var totalMilestones = 0;
var completedMilestones = 0;
        var totalProgress = 0;

        var milestoneSearch = search.create({

            type:'customrecord_rw_portal_access2',

            filters:[
                ['custrecord1513','anyof',projectId]
            ],

            columns:[
                'custrecord_rw_portal_projstat'
            ]
        });

        milestoneSearch.run().each(function(ms){

            totalMilestones++;

            var status =
                ms.getValue(
                    'custrecord_rw_portal_projstat'
                );

            var progressValue = 0;

            
            if(status == '8'){ // use your actual Not Started status ID
    progressValue = 0;
}
// KICKOFF
            else if(status == '1'){
                progressValue = 10;
            }

            // IN PROGRESS
            else if(status == '2'){
                progressValue = 50;
            }

            // UAT
            else if(status == '4'){
                progressValue = 75;
            }

            // GOLIVE
            else if(status == '4'){
                progressValue = 90;
            }

            // COC / DONE / COMPLETED
            else if(
                status == '6' ||
                status == '5'
            
            ){
                progressValue = 100;
                completedMilestones++;
            }
            
            totalProgress += progressValue;
            

            return true;
        });

        var finalProgress = 0;

        if(totalMilestones > 0){

            finalProgress = Math.round(
                totalProgress / totalMilestones
            );
        }

        if(finalProgress > 100){
            finalProgress = 100;
        }

       data.push({

    projectId: projectId,

    projectName: projectName,

    progress: finalProgress,

    completed: completedMilestones,

    total: totalMilestones
});

        return true;
    });

    return data;
}
function getCustomersByStatus(statusId){

    var today = new Date();

    var month = today.getMonth() + 1;
    var year = today.getFullYear();

    var startDate = '01/' + month + '/' + year;
    var endDate = new Date(year, month, 0).getDate() + '/' + month + '/' + year;

    var customerArr = [];

    try{

        var searchObj = search.create({
            type: 'customrecord_rw_portal_access',
            filters: [
                ['custrecord_rw_portal_status','anyof', statusId],
                'AND',
                 ['custrecord_rw_portal_customername.custentity_rw_emp_port_access','is','T'],
                 'AND',
                ['created','within', startDate, endDate]   // ✅ string format
            ],
            columns: [
                'custrecord_rw_portal_customername',
                'internalid'   // ⚠️ replace with correct field
            ]
        });

        searchObj.run().each(function(res){

            var customer = '';

            try{
                customer = res.getText('custrecord_rw_portal_customername'); // or getValue
            }catch(e){
                log.error("Customer fetch error", e);
            }

            if(customer){
                customerArr.push(customer);
            }

            return true;
        });

    }catch(e){
        log.error("Search Error", e);
    }

    return customerArr || [];
}
function getEmployeeName(empId){

    if(!empId) return '';

    var empData = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empId,
        columns: ['entityid','firstname','lastname']
    });

    var fullName = '';

    if(empData.firstname){
        fullName += empData.firstname;
    }

    if(empData.lastname){
        fullName += ' ' + empData.lastname;
    }

    return fullName || empData.entityid || '';
}
var uatCustomers = getCustomersByStatus('4');
var goliveCustomers = getCustomersByStatus('5');
var cocCustomers = getCustomersByStatus('6');

function buildCard(title, customers){
    var list = customers.length 
        ? customers.map(c => `<li>${c}</li>`).join('')
        : '<li>No data</li>';

    return `
        <div class="card">
            <h3>${title}</h3>
            <ul>${list}</ul>
        </div>
        
    `;
}
var sprintBoardHtml = `

<div class="sprint-board">
      
    <div class="sprint-column"
     ondrop="drop(event,'1')"
     ondragover="allowDrop(event)">

        <div class="sprint-title todo">
            To Do (${sprintData.todo.length})
        </div>

        ${sprintData.todo.map(t => `
            <div class="ticket-card"
     draggable="true"
     data-ticketid="${t.id}"
     ondragstart="drag(event)">
                <div>${t.number}</div>
                <div>${t.project || ''}</div>
                <small>${t.deadline || ''}</small>
            </div>
        `).join('')}

    </div>

    <div class="sprint-column"
     ondrop="drop(event,'2')"
     ondragover="allowDrop(event)">
        <div class="sprint-title progress">
            In Progress (${sprintData.progress.length})
        </div>

        ${sprintData.progress.map(t => `
            <div class="ticket-card"
     draggable="true"
     data-ticketid="${t.id}"
     ondragstart="drag(event)">
                <div>${t.number}</div>
                <div>${t.project || ''}</div>
                <small>${t.deadline || ''}</small>
            </div>
        `).join('')}

    </div>

    
<div class="sprint-column"
     ondrop="drop(event,'3')"
     ondragover="allowDrop(event)">

    <div class="sprint-title review">
        Code Review (${sprintData.codeReview.length})
    </div>

    ${sprintData.codeReview.map(t => `
        <div class="ticket-card"
     draggable="true"
     data-ticketid="${t.id}"
     ondragstart="drag(event)">
            <div>${t.number}</div>
            <div>${t.project || ''}</div>
        </div>
    `).join('')}

</div>

<div class="sprint-column"
     ondrop="drop(event,'4')"
     ondragover="allowDrop(event)">

        <div class="sprint-title testing">
            UAT (${sprintData.testing.length})
        </div>

        ${sprintData.testing.map(t => `
            <div class="ticket-card"
     draggable="true"
     data-ticketid="${t.id}"
     ondragstart="drag(event)">
                <div>${t.number}</div>
                <div>${t.project || ''}</div>
                <small>${t.deadline || ''}</small>
            </div>
        `).join('')}

    </div>
    <div class="sprint-column"
     ondrop="drop(event,'5')"
     ondragover="allowDrop(event)">

        <div class="sprint-title done">
            Done (${sprintData.done.length})
        </div>

        ${sprintData.done.map(t => `
            <div class="ticket-card done-ticket"
     draggable="false"
     data-ticketid="${t.id}">
                <div>${t.number}</div>
                <div>${t.project || ''}</div>
                <small>${t.deadline || ''}</small>
            </div>
        `).join('')}

    </div>

</div>
`;
var specialCards = `
<div class="card-container">
    ${buildCard('UAT Customers', uatCustomers)}
    ${buildCard('Go Live Customers', goliveCustomers)}
    ${buildCard('COC Customers', cocCustomers)}
</div>
`;
function formatDateForNS(date){
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    return day + '/' + month + '/' + year;
}
var goLiveProducts = getCurrentGoLiveProducts();
function getCustomersByDate(fieldId, type, statusId){

    var customers = [];

    try{
        var today = new Date();

        function formatDateForNS(date){

    var d = String(date.getDate()).padStart(2,'0');
    var m = String(date.getMonth() + 1).padStart(2,'0');
    var y = date.getFullYear();

    return d + '/' + m + '/' + y;
}

        var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        var start = formatDateForNS(firstDay);
        var end = formatDateForNS(lastDay);
        var todayStr = formatDateForNS(today);

       var filters = [
    ['isinactive','is','F'],
    'AND',
    ['custrecord_rw_portal_status','anyof', statusId],   //  ADD THIS
    'AND',
    ['custrecord_rw_portal_customername.custentity_rw_emp_port_access','is','T'],
    'AND',
    [fieldId, 'isnotempty', '']
];

      if(type === 'current'){

    filters.push(
        'AND',
        [fieldId, 'onorafter', start],
        'AND',
        [fieldId, 'onorbefore', end]
    );
}

        if(type === 'upcoming'){

    // first day of next month
    var nextMonthFirstDay = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1
    );

    var nextMonthStart = formatDateForNS(nextMonthFirstDay);

    filters.push(
        'AND',
        [fieldId, 'onorafter', nextMonthStart]
    );
}

        var searchObj = search.create({
            type: 'customrecord_rw_portal_access',
            filters: filters,
            columns: [
                'custrecord_rw_portal_customername',
                'internalid',
                fieldId
            ]
        });

        searchObj.run().each(function(res){

            var customer = res.getText('custrecord_rw_portal_customername');
            var date = res.getValue(fieldId);
            var projectId = res.getValue('internalid');  

            if(customer){
                // customers.push(customer + ' ' + date + '  ' + projectId);
                customers.push(`
    <div class="card-row">
        <span class="cust">${customer}</span>
        <span class="proj" onclick="openProjectView('${projectId}')">
    ${projectId}
</span>
        <span class="date">${date}</span>
    </div>
`);
            }

            return true;
        });

    }catch(e){
        log.error("Date Search Error", e);
    }

    return customers;
}
//  Start Date Cards
// UAT
// UAT
var uatCurrent = getCustomersByDate(
    'custrecord_rw_portal_start_date',
    'current',
    '3'
);
var kickoffCurrent = getCustomersByDate(
    'custrecord_rw_portal_start_date',
    'current',
    '1'
);
var uatUpcoming = getCustomersByDate(
    'custrecord_rw_portal_start_date',
    'upcoming',
    '3'
);

// GoLive
var goliveCurrent = getCustomersByDate(
    'custrecord_rw_portal_start_date',
    'current',
    '5'
);

var completedCurrent = getCustomersByDate(
    'custrecord_rw_portal_start_date',
    'current',
    '8'
);

// COC
var cocCurrent = getCustomersByDate(
    'custrecord_rw_portal_end_date',
    'current',
    '6'
);


var cocUpcoming = []; // optional if you have date field
log.debug("UAT CURRENT DATA", uatCurrent);
log.debug("GOLIVE CURRENT DATA", goliveCurrent);
log.debug("COC CURRENT DATA", cocCurrent);

function getOverdueTickets(empId){

    if(!empId) return [];

    var tickets = [];

    var today = new Date();

    var ticketSearch = search.create({

        type: 'customrecord_rw_ticket',

        filters: [

            ['custrecord_rw_ticket_assignedto','anyof', empId],

            'AND',

            ['custrecord_rw_ticket_deadline','before','today'],

            'AND',

            ['custrecord_rw_ticket_ticketstatus','noneof','5']
        ],

        columns: [

            'custrecord_rw_ticket_ticketno',

            'custrecord_rw_ticket_deadline'
        ]
    });

    ticketSearch.run().each(function(result){

        var deadline = result.getValue(
            'custrecord_rw_ticket_deadline'
        );

        var overdueDays = 0;

        if(deadline){

            var parts = deadline.split('/');

            var deadlineDate = new Date(
                parts[2],       // year
                parts[1]-1,     // month
                parts[0]        // day
            );

            var diffTime = today - deadlineDate;

            overdueDays = Math.floor(
                diffTime / (1000 * 60 * 60 * 24)
            );
        }

        tickets.push({

            number: result.getValue(
                'custrecord_rw_ticket_ticketno'
            ),

            deadline: deadline,

            days: overdueDays
        });

        return true;
    });

    return tickets;
}
// function getOverdueTickets(empId){

//     if(!empId) return [];

//     var tickets = [];

//     var ticketSearch = search.create({
//         type: 'customrecord_rw_ticket',
//         filters: [
//             ['custrecord_rw_ticket_assignedto','anyof', empId],
//             'AND',
//             ['custrecord_rw_ticket_overduedays','isnotempty','']
//         ],
//         columns: [
//             'custrecord_rw_ticket_ticketno',
//             'custrecord_rw_ticket_overduedays'
//         ]
//     });

//     ticketSearch.run().each(function(result){

//         tickets.push({
//             number: result.getValue('custrecord_rw_ticket_ticketno'),
//             days: result.getValue('custrecord_rw_ticket_overduedays')
//         });

//         return true;
//     });

//     return tickets;
// }
var overdueTicketsOfLoggedInUser = getOverdueTickets(empId);
function buildCard(title, currentList, upcomingList){

    currentList = currentList || [];   
    upcomingList = upcomingList || []; 

    var currentHtml = currentList.length 
        ? currentList.map(c => `<li>${c}</li>`).join('')
        : '<li>No data</li>';

    var upcomingHtml = upcomingList.length 
        ? upcomingList.map(c => `<li>${c}</li>`).join('')
        : '<li>No data</li>';

    return `
        <div class="card">
            <h3>${title}</h3>

            <h4 style="color:linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);;">Current Month</h4>
            <ul>${currentHtml}</ul>

            <h4 style="color:#999;">Upcoming</h4>
            <ul>${upcomingHtml}</ul>
        </div>
    `;
}
function buildSingleCard(title, list){

    list = list || [];
    var count = list.length;

    var htmlList = count 
        ? list.map(c => `<li>${c}</li>`).join('')
        : '<li>No data</li>';

    return `
        <div class="card">
            <h3 class="card-title">${title} (${count})</h3>

            <!-- ✅ COLUMN HEADER -->
            <div class="card-header-row">
                <span class="cust">Customer</span>
                <span class="proj">Project Id</span>
                <span class="date">Date</span>
            </div>

            <ul>${htmlList}</ul>
        </div>
    `;
}
var specialCards = `
<div class="card-container">
${buildSingleCard('Kick off - Current Month', kickoffCurrent)}

    ${buildSingleCard('UAT - Current Month', uatCurrent)}

    

    ${buildSingleCard('Go Live - Current Month', goliveCurrent)}

    ${buildSingleCard('Completed - Current Month', completedCurrent)}

    ${buildSingleCard('COC - Current Month', cocCurrent)}

    

</div>
`;
var chartCard = `
<div class="chart-card" id="chartCard">
    <div class="chart-header">
        Project Status Overview
    </div>
    <div class="chart-body">
        <canvas id="statusChart"></canvas>
    </div>
</div>
`;
var pieChartCard =`

<div class="chart-card" id="pieChartCard">

    <div class="chart-header">
        Dashboard Overview
    </div>

    <div style="
        display:flex;
        justify-content:space-around;
        align-items:center;
        gap:20px;
        flex-wrap:wrap;
    ">

        <div style="width:250px; text-align:center;">
            <h3>Projects</h3>
            <canvas id="projectPie"></canvas>
        </div>

        <div style="width:250px; text-align:center;">
            <h3>Tickets</h3>
            <canvas id="ticketPie"></canvas>
        </div>

        <div style="width:250px; text-align:center;">
            <h3>My Data</h3>
            <canvas id="myPie"></canvas>
        </div>

    </div>

</div>

`
var chartHtml = (roleType === 'PMO') ? chartCard : '';
var goLiveCard = `
<div style="display:flex; gap:15px; margin:10px;">

    <div style="
        width:320px;
        background:#fff;
        border-radius:10px;
        box-shadow:0 4px 10px rgba(0,0,0,0.1);
        overflow:hidden;
    ">

        <!-- HEADER -->
        <div style="
            background:#6f3ba2;
            color:white;
            padding:10px;
            font-weight:bold;
            font-size:14px;
        ">
             Current Go-Lives
        </div>

        <div style="padding:10px;">

            <!-- COLUMN NAME -->
            <div style="
                display:flex;
                justify-content:space-between;
                font-weight:bold;
                border-bottom:2px solid #ddd;
                padding-bottom:5px;
                font-size:13px;
            ">
                <span>Project Name</span>
                <span>Product Name</span>
            </div>

            <!-- DATA -->
            <div style="max-height:200px; overflow-y:auto;">

                ${goLiveProducts.map(p => `
    <div style="
        display:flex;
        justify-content:space-between;
        padding:6px 0;
        border-bottom:1px solid #eee;
        font-size:12px;
    ">
        <span>${p.project}</span>
        <span>${p.product}</span>
    </div>
`).join('')}

            </div>

        </div>

    </div>

</div>
`;
var goLiveCardUser = `
<div style="display:flex; gap:15px; margin:10px;">

    <div style="
        width:360px;
        background:#fff;
        border-radius:10px;
        box-shadow:0 4px 10px rgba(0,0,0,0.1);
        overflow:hidden;
    ">

        <!-- HEADER -->
        <div style="
            background:linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);;
            color:black;
            padding:10px;
            font-weight:bold;
            font-size:14px;
            font-family:Arial, sans-serif;
        ">
             Current Go-Lives(${goLiveProductsForUser.length})
        </div>

        <div style="padding:10px;">

            <!-- COLUMN NAME -->
            <div style="
                display:flex;
                justify-content:space-between;
                font-weight:bold;
                border-bottom:2px solid #ddd;
                padding-bottom:5px;
                font-size:13px;
                font-family:Arial, sans-serif;
            ">
                <span>Project Name</span>
                <span>Product Name</span>
            </div>

            <!-- DATA -->
            <div style="max-height:200px; overflow-y:auto;">

                ${goLiveProductsForUser.length ? goLiveProductsForUser.map(p => `
    <div style="
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:12px;
    padding:6px 0;
    border-bottom:1px solid #eee;
    font-size:12px;
    font-family:Arial, sans-serif;
    flex-wrap:wrap;
    overflow:hidden;
">

    <span style="
        flex:1;
        min-width:120px;
        word-break:break-word;
        text-align:left;
    ">
        ${p.project}
    </span>

    <span style="
        flex:1;
        min-width:120px;
        word-break:break-word;
        text-align:right;
    ">
        ${p.product}
    </span>

</div>
`).join('') : `
<div style="
    padding:15px;
    text-align:center;
    color:#999;
    font-size:13px;
">
    No data
</div>
`}

            </div>

        </div>

    </div>

</div>
`;
var overdueTickets =getOverdueTickets(empId);
var projectProgressData =
    getProjectProgress();
var overdueCardInner = `
<div style="display:flex; gap:15px; margin:10px;">
<div style="
    width:320px;
    background:#fff;
    border-radius:10px;
    box-shadow:0 4px 10px rgba(0,0,0,0.1);
    overflow:hidden;
">

    <div style="
        background:#6f3ba2;
        color:white;
        padding:10px;
        font-weight:bold;
        font-size:14px;
        font-family:Arial, sans-serif;
    ">
         Overdue Tickets
    </div>

    <div style="padding:10px;">

        <div style="
            display:flex;
            justify-content:space-between;
            font-weight:bold;
            border-bottom:2px solid #ddd;
            padding-bottom:5px;
            font-size:13px;
            font-family:Arial, sans-serif;
        ">
            <span>Ticket No</span>
            <span>Days</span>
        </div>

        <div style="max-height:200px; overflow-y:auto;">

            ${overdueTicketsOfLoggedInUser.map(t => `
                <div style="
                    display:flex;
                    justify-content:space-between;
                    padding:6px 0;
                    border-bottom:1px solid #eee;
                    font-size:12px;
                ">
                    <span>${t.number}</span>
                    <span style="color:red; font-weight:bold;">
                        ${t.days + ' days'} 
                    </span>
                </div>
            `).join('')}

        </div>

    </div>

</div>
</div>
`;
function getHighPriorityTicketListLoggedin(empId){

    if(!empId) return [];

    var tickets = [];

    var ticketSearch = search.create({
        type: 'customrecord_rw_ticket',

        filters: [
            ['custrecord_rw_ticket_assignedto','anyof', empId],
            'AND',
            ['custrecord_rw_ticket_priority','anyof','1']
        ],

        columns: [
            'custrecord_rw_ticket_ticketno',
            'custrecord_rw_ticket_deadline'
        ]
    });

    ticketSearch.run().each(function(result){

        tickets.push({

            number: result.getValue(
                'custrecord_rw_ticket_ticketno'
            ),

            deadline: result.getValue(
                'custrecord_rw_ticket_deadline'
            )
        });

        return true;
    });

    // ✅ SORT MANUALLY
    tickets.sort(function(a, b){

    function parseDate(str){

        if(!str) return new Date(0);

        var parts = str.split('/');

        return new Date(
            parts[2],      // year
            parts[1]-1,    // month
            parts[0]       // day
        );
    }

    // ✅ SORT BY DEADLINE ASCENDING
    return parseDate(a.deadline) - parseDate(b.deadline);

});

    log.debug("SORTED TICKETS", JSON.stringify(tickets));

    return tickets;
}
var priorityTickets = getHighPriorityTicketListLoggedin(empId);
var highPriorityCardOfLoggedInUser = `
<div style="display:flex; gap:15px; margin:10px;">

    <div style="
        width:300px;
        min-height:300px;
        background:#fff;
        border-radius:10px;
        box-shadow:0 4px 10px rgba(0,0,0,0.1);
        overflow:hidden;
    ">

        <!-- HEADER (same as table header) -->
        <div style="
            background:linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);;
            color:black;
            padding:10px;
            font-weight:bold;
            font-size:14px;
            font-family:Arial, sans-serif;
        ">
             High Priority (${priorityTickets.length})
        </div>

        <div style="padding:10px;">

            <!-- COLUMN NAMES -->
            <div style="
                display:flex;
                justify-content:space-between;
                font-weight:bold;
                border-bottom:2px solid #ddd;
                padding-bottom:5px;
                font-size:13px;
                font-family:Arial, sans-serif;
            ">
                <span>Ticket No</span>
                <span>Deadline</span>
            </div>

            <!-- DATA -->
            <div style="max-height:none; overflow-y:auto;">

                ${priorityTickets.length ? priorityTickets.map(t => `
                    <div style="
                        display:flex;
                        justify-content:space-between;
                        padding:6px 0;
                        border-bottom:1px solid #eee;
                        font-size:12px;
                        font-family:Arial, sans-serif;
                    ">
                        <span>${t.number}</span>
                        <span>${t.deadline || '-'}</span>
                    </div>
                `).join('') : `
<div style="
    padding:15px;
    text-align:center;
    color:#999;
    font-size:13px;
">
    No data
</div>
`}

            </div>

        </div>

    </div>

</div>
`;
function getOverdueProjects(empId, roleType){

    if(!empId) return [];

    var projects = [];

    var today = new Date();

    var filters = [
        ['custrecord_rw_portal_updateddeadline','before','today'],
        'AND',
        ['custrecord_rw_portal_projstat','noneof','5'] // exclude completed
    ];

    // PM
    if(roleType === 'PM'){

        filters.push(
            'AND',
            ['custrecord1513.custrecord_rw_portal_projectmanager','anyof', empId]
        );
    }

    // DEV / OTHER
    else{

        filters.push(
            'AND',
            ['custrecord1513.custrecord_rw_portal_projectmanager','anyof', empId]
        );
    }

    var searchObj = search.create({

        type: 'customrecord_rw_portal_access2',

        filters: filters,

        columns: [

            'custrecord_rw_portal_rwproduct',

            'custrecord_rw_portal_updateddeadline',

            search.createColumn({
                name: 'custrecord_rw_portal_customername',
                join: 'custrecord1513'
            })
        ]
    });

    searchObj.run().each(function(result){

        var product = result.getText(
            'custrecord_rw_portal_rwproduct'
        );

        var deadline = result.getValue(
            'custrecord_rw_portal_updateddeadline'
        );

        var overdueDays = 0;

        if(deadline){

            var parts = deadline.split('/');

            var deadlineDate = new Date(
                parts[2],
                parts[1]-1,
                parts[0]
            );

            var diffTime = today - deadlineDate;

            overdueDays = Math.floor(
                diffTime / (1000 * 60 * 60 * 24)
            );
        }

        var project = result.getText({
            name: 'custrecord_rw_portal_customername',
            join: 'custrecord1513'
        });

        projects.push({

            project: project || '-',

            product: product || '-',

            duration: overdueDays
        });

        return true;
    });

    return projects;
}
var overdueProjects =getOverdueProjects();
// function getOverdueProjects(empId, roleType){

//     if(!empId) return [];

//     var projects = [];

//     var filters = [
//         ['custrecord_rw_portal_updateddeadline','before','today']
//     ];

//     // PM → only PM projects
//     if(roleType === 'PM'){

//         filters.push(
//             'AND',
//             ['custrecord1513.custrecord_rw_portal_projectmanager','anyof', empId]
//         );
//     }

//     // DEV / OTHER → only assigned resources
//     else{

//         filters.push(
//             'AND',
//              ['custrecord1513.custrecord_rw_portal_projectmanager','anyof', empId]
//         );
//     }

//     var searchObj = search.create({

//         type: 'customrecord_rw_portal_access2',

//         filters: filters,

//         columns: [

//             'custrecord_rw_portal_rwproduct',

//             'custrecord_rw_portal_durationline',

//             search.createColumn({
//                 name: 'custrecord_rw_portal_customername',
//                 join: 'custrecord1513'
//             })
//         ]
//     });

//     searchObj.run().each(function(result){

//         var product = result.getText(
//             'custrecord_rw_portal_rwproduct'
//         );

//         var duration = result.getValue(
//             'custrecord_rw_portal_durationline'
//         );

//         var project = result.getText({
//             name: 'custrecord_rw_portal_customername',
//             join: 'custrecord1513'
//         });

//         projects.push({
//             project: project || '-',
//             product: product || '-',
//             duration: duration || 0
//         });

//         return true;
//     });

//     return projects;
// }
var overdueProjectsUsers = getOverdueProjects(empId, roleType);
var overdueProjectCardInner = `
<div style="display:flex;gap:15px;margin:10px;">
<div style="
    width:320px;
    background:#fff;
    border-radius:10px;
    box-shadow:0 4px 10px rgba(0,0,0,0.1);
    overflow:hidden;
">

    <!-- HEADER -->
    <div style="
        background:linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);;
        color:black;
        padding:10px;
        font-weight:bold;
        font-size:14px;
        font-family:Arial, sans-serif;
    ">
         Overdue Products
    </div>

    <div style="padding:10px;">

        <!-- COLUMN -->
        <div style="
            display:flex;
            justify-content:space-between;
            font-weight:bold;
            border-bottom:2px solid #ddd;
            padding-bottom:5px;
            font-size:12px;
            font-family:Arial, sans-serif;
        ">
        <span>Project</span>
            <span>Product</span>
            <span>Duration</span>
        </div>

        <!-- DATA -->
        <div style="max-height:200px; overflow-y:auto;">

            ${overdueProjects.map(p => `
                <div style="
                    display:flex;
                    justify-content:space-between;
                    padding:6px 0;
                    border-bottom:1px solid #eee;
                    font-size:12px;
                    font-family:Arial, sans-serif;
                ">
                <span>${p.project || '-'}</span>
                    <span>${p.product}</span>
                    
                    <span style="color:red; font-weight:bold;font-size:11px;">
                        ${p.duration ? p.duration + ' days' : '-'}
                    </span>
                </div>
            `).join('')}

        </div>

    </div>

</div>
</div>
`;
var overdueProjectCardInneruser = `
<div style="display:flex;gap:15px;margin:10px;">
<div style="
    width:360px;
        min-height:300px;
        background:#fff;
        border-radius:10px;
        box-shadow:0 4px 10px rgba(0,0,0,0.1);
        overflow:hidden;
">

    <!-- HEADER -->
    <div style="
        background:linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);;
        color:black;
        padding:10px;
        font-weight:bold;
        font-size:14px;
    ">
         Overdue Products(${overdueProjectsUsers.length})
    </div>

    <div style="padding:10px;">

        <!-- COLUMN -->
        <div style="
            display:flex;
            justify-content:space-between;
            font-weight:bold;
            border-bottom:2px solid #ddd;
            padding-bottom:5px;
            font-size:13px;
        ">
        <span>Project</span>
            <span>Product</span>
            <span>Duration</span>
        </div>

        <!-- DATA -->
        <div style="max-height:none; overflow:visible;">

            ${overdueProjectsUsers.length ? overdueProjectsUsers.map(p => `
                <div style="
                    display:flex;
                    justify-content:space-between;
                    padding:6px 0;
                    gap:12px;
                    border-bottom:1px solid #eee;
                    font-size:12px;
                    font-family:Arial, sans-serif;
                ">
                <span>${p.project || '-'}</span>
                    <span>${p.product}</span>
                    
                    <span style="color:red; font-weight:bold;font-size:11px;">
                        ${p.duration ? p.duration + ' days' : '-'}
                    </span>
                </div>
            `).join('') : `
<div style="
    padding:15px;
    text-align:center;
    color:#999;
    font-size:13px;
">
    No data
</div>
`}

        </div>

    </div>

</div>
</div>
`;

var donutCard = `
<div style="
    margin:20px;
    width:350px;
    padding:15px;
    background:#fff;
    border-radius:12px;
    box-shadow:0 4px 10px rgba(0,0,0,0.1);
    font-family:Arial, sans-serif;
">

    <div style="font-weight:bold; margin-bottom:10px; color:#6f3ba2;font-size:14px;">
         Overview
    </div>

    <canvas id="donutChart" style="height:200px;"></canvas>

</div>
`;
var donutTicket =`
<div style="
    margin:20px;
    padding:15px;
    background:#fff;
    border-radius:12px;
    box-shadow:0 4px 10px rgba(0,0,0,0.1);
    font-family:Arial, sans-serif;
">
    <div style="font-weight:bold; margin-bottom:10px; color:#6f3ba2;">
        My Ticket Distribution
    </div>

    <canvas id="myTicketDonut" style="height:200px;"></canvas>
</div>
`
var overdueCardInner = `
<div style="display:flex; gap:15px; margin:10px;">
<div style="
    width:320px;
    min-height:300px;
    background:#fff;
    border-radius:10px;
    box-shadow:0 4px 10px rgba(0,0,0,0.1);
    overflow:hidden;
">

    <div style="
        background:linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);;
        color:black;
        padding:10px;
        font-weight:bold;
        font-size:14px;
        font-family:Arial, sans-serif;
    ">
         Overdue Tickets(${overdueTicketsOfLoggedInUser.length})
    </div>

    <div style="padding:10px;">

        <div style="
            display:flex;
            justify-content:space-between;
            font-weight:bold;
            border-bottom:2px solid #ddd;
            padding-bottom:5px;
            font-size:13px;
            font-family:Arial, sans-serif;
        ">
            <span>Ticket No</span>
            <span>Days</span>
        </div>

        <div style="max-height:none; overflow-y:auto;">

           ${overdueTicketsOfLoggedInUser.length ? overdueTicketsOfLoggedInUser.map(t => `
                <div style="
                    display:flex;
                    justify-content:space-between;
                    padding:6px 0;
                    border-bottom:1px solid #eee;
                    font-size:12px;
                    font-family:Arial, sans-serif;
                ">
                    <span>${t.number}</span>
                    <span style="color:red; font-weight:bold;font-size:11px;font-family:Arial, sans-serif;">
                        ${t.days + ' days'}
                    </span>
                </div>
            `).join('') : `
<div style="
    padding:15px;
    text-align:center;
    color:#999;
    font-size:13px;
">
    No data
</div>
`}

        </div>

    </div>

</div>
</div>
`;
var visibleProjects = projectProgressData.slice(0,5);

var hiddenProjects = projectProgressData.slice(5);

function buildTimelineItem(p){

    return `

    <div class="modern-progress-item">

        <div class="modern-progress-top">

            <div>

                <div class="modern-project-name">
                    ${p.projectName}
                </div>

                <div class="modern-meta">
                    ${p.completed}/${p.total} Products Completed
                </div>

            </div>

            <div class="modern-percent">
                ${p.progress}%
            </div>

        </div>

        <div class="modern-progress-bar">

            <div
                class="modern-progress-fill"
                style="width:${p.progress}%"
            ></div>

        </div>

    </div>
    `;
}

var timelineProgressCard = `

<div class="modern-timeline-card">

    <div class="modern-timeline-header">

        <div>
             Project Timeline Progress
        </div>

        <div class="timeline-count">
            ${projectProgressData.length} Projects
        </div>

    </div>

    <div class="modern-timeline-body">

        ${visibleProjects.map(buildTimelineItem).join('')}

        <div
            id="moreTimelineProjects"
            style="display:none;"
        >

            ${hiddenProjects.map(buildTimelineItem).join('')}

        </div>

        ${
            hiddenProjects.length > 0
            ?
            `
            <div class="timeline-btn-wrap">

                <button
                    class="modern-view-btn"
                    id="timelineViewBtn"
                    onclick="toggleTimelineProjects()"
                >
                    View More
                </button>




            </div>
            `
            :
            ''
        }

    </div>

</div>
`;
var highPriorityCard = `
<div style="display:flex; gap:15px; margin:10px;">

    <div style="
        width:320px;
        
        background:#fff;
        border-radius:10px;
        box-shadow:0 4px 10px rgba(0,0,0,0.1);
        overflow:hidden;
    ">

        <!-- HEADER (same as table header) -->
        <div style="
            background:linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);;
            color:black;
            padding:10px;
            font-weight:bold;
            font-size:14px;
        ">
             High Priority
        </div>

        <div style="padding:10px;">

            <!-- COLUMN NAMES -->
            <div style="
                display:flex;
                justify-content:space-between;
                font-weight:bold;
                border-bottom:2px solid #ddd;
                padding-bottom:5px;
                font-size:13px;
            ">
                <span>Ticket No</span>
                <span>Deadline</span>
            </div>

            <!-- DATA -->
            <div style="max-height:400px; overflow-y:auto;">

                ${highPriorityTickets.map(t => `
                    <div style="
                        display:flex;
                        justify-content:space-between;
                        padding:6px 0;
                        border-bottom:1px solid #eee;
                        font-size:12px;
                    ">
                        <span>${t.number}</span>
                        <span>${t.deadline || '-'}</span>
                    </div>
                `).join('')}

            </div>

        </div>

    </div>

</div>
`;
function getNotifications(empId){

    var data = [];

    var notifSearch = search.create({

        type:'customrecord2517',

        filters:[
    ['custrecord_rw_notif_employee','anyof',empId],
    'AND',
    ['custrecord_rw_notif_read','is','F']
],
        

        columns:[

            search.createColumn({
                name:'created',
                sort:search.Sort.DESC
            }),

            'internalid',
            'custrecord_rw_notif_message',
            'isinactive'
        ]
    });

    notifSearch.run().each(function(res){

        data.push({

    id: res.getValue('internalid'),

    message: res.getValue(
        'custrecord_rw_notif_message'
    ),

    created: res.getValue('created'),

    inactive: res.getValue('isinactive')
});

        return true;
    });

    return data;
}
function getUnreadNotificationCount(empId){

    var count = 0;

    var notifSearch = search.create({

        type:'customrecord2517',

        filters:[

            [
                'custrecord_rw_notif_employee',
                'anyof',
                empId
            ],

            'AND',

            ['custrecord_rw_notif_read','is','F']
        ],

        columns:['internalid']
    });

    notifSearch.run().each(function(){

        count++;

        return true;
    });

    return count;
}
var notifications = getNotifications(empId);

var unreadCount = getUnreadNotificationCount(empId);
var notifHtml = `
<div class="notif-wrapper">

    <div class="notif-bell"
         onclick="toggleNotifications()">

        <i class="fa-solid fa-bell"></i>

        <span class="notif-count"
      style="
      display:${unreadCount > 0 ? 'flex' : 'none'};
      ">
    ${unreadCount}
</span>

    </div>

    <div class="notif-dropdown"
         id="notifDropdown">

        <div class="notif-header">
             <span>Notifications</span>

        <span class="notif-close"
              onclick="closeNotifications(event)">
            ✖
        </span>
        </div>

        ${
    notifications.length

?

notifications.map((n,index) => `

   

<div class="notif-item unread"
     id="notif_${n.id}">

    <div style="
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:10px;
    ">

        <div>

            <div class="notif-title">
                ${n.message}
            </div>

            <div class="notif-time">
                ${n.created}
            </div>

        </div>

        <span
            class="notif-remove"
            onclick="removeNotification('${n.id}')">

            ✖

        </span>

    </div>

</div>

`).join('')

    :

    `
    <div class="notif-item no-notif" style="color:black;">
        No Notifications
    </div>
    `
}
    </div>

</div>
`;
function loadNotifications(){

    fetch(
        window.location.pathname +
        '?action=getNotifications' +
        '&empid=' + empId
    )
    .then(r => r.json())
    .then(data => {

        const dropdown =
            document.getElementById(
                'notifDropdown'
            );

        let html =
            '<div class="notif-header">Notifications</div>';

        data.forEach(n => {

            html += `
                <div class="notif-item unread">
                    <div>${n.message}</div>
                    <div>${n.created}</div>
                </div>
            `;
        });

        dropdown.innerHTML = html;
    });
}
function refreshNotifications(){

    fetch(
        window.location.pathname +
        '?action=getUnreadCount' +
        '&empid=' + empId
    )
    .then(r => r.text())
    .then(count => {

        const badge =
            document.querySelector('.notif-count');

        if(!badge) return;

        badge.innerText = count;

        badge.style.display =
            Number(count) > 0
            ? 'flex'
            : 'none';
    });

    loadNotifications();
}
if(
    context.request.parameters.action
    === 'getUnreadCount'
){

    context.response.write(
        getUnreadNotificationCount(empId)
    );

    return;
}
if(
    context.request.parameters.action
    === 'removeNotification'
){

    var notifId =
        context.request.parameters.notifId;

    if(notifId){

        record.submitFields({
    type:'customrecord2517',
    id:notifId,
    values:{
        custrecord_rw_notif_read: true,
        isinactive: true
    }
});
    }

    context.response.write('success');

    return;
}
if(context.request.parameters.action === 'markRead'){

    log.debug('MARK READ CALLED', empId);

    var notifSearch = search.create({
        type:'customrecord2517',
       filters:[
    ['custrecord_rw_notif_employee','anyof',empId],
    'AND',
    ['custrecord_rw_notif_read','is','F']
],
        columns:['internalid']
    });

    notifSearch.run().each(function(res){

        log.debug(
            'MARKING',
            res.getValue('internalid')
        );

       record.submitFields({
    type:'customrecord2517',
    id:res.getValue('internalid'),
    values:{
        custrecord_rw_notif_read: true,
        isinactive: true
    }
});
log.debug(
    'UPDATED',
    res.getValue('internalid')
);
        return true;
    });

    context.response.write('success');
    return;
}
if(
context.request.parameters.action
=== 'getNotifications'
){


var data = getNotifications(empId);

context.response.setHeader({
    name:'Content-Type',
    value:'application/json'
});

context.response.write(
    JSON.stringify(data)
);

return;

}
var todoCount = sprintData.todo.length;
var progressCount = sprintData.progress.length;
var testingCount = sprintData.testing.length;
var codereviewCount =sprintData.codeReview.length;
var doneCount = sprintData.done.length;
var workloadChartHtml = `

<div class="chart-card">

    <div class="chart-header" style="font-size:14px;">
        My Workload
    </div>

    <div style="height:300px;">
        <canvas id="workloadChart"></canvas>
        
    </div>

</div>

`;
let html = `
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>

* {
    box-sizing: border-box;
}

html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    
   overflow-x:auto !important;
    
    overflow-y: auto !important;



    
}
    body{
    background: var(--bg);
    background: linear-gradient(135deg, var(--bg), #e9dbeb);
    font-family: 'Inter', sans-serif;
    
}
    
    .card-container{
    display:flex;
    gap:20px;
    margin-top:25px;
}

.card{
    flex:1;
    background:white;
    border-radius:14px;
    overflow:hidden;

    box-shadow:0 6px 20px rgba(0,0,0,0.08);
    transition:all 0.3s ease;
}
.card-row{
    display:flex;
    justify-content:space-between;
    gap:10px;
}
.card-header-row{
    display:flex;
    justify-content:space-between;
    gap:10px;

    padding:8px 15px;
    font-size:10px;
    font-weight:bold;
    font-family:Arial, sans-serif;
    border-bottom : 1px solid #ddd;

    
    
}
:root{
    --primary:#6C63FF;
    --primary-dark:#574BDB;
    --bg:#F5F7FB;
    --card:#FFFFFF;
    --text:#1F2937;
    --muted:#6B7280;
    --border:#E5E7EB;
    --success:#10B981;
    --warning:#F59E0B;
    --danger:#EF4444;
}
.card-header-row .cust{
    flex:1;
}

.card-header-row .proj{
    flex:0.7;
    text-align:center;
}

.card-header-row .date{
    flex:0.8;
    text-align:right;
}
.card-row .cust{
    flex:1;
    font-weight:500;
    font-family:Arial, sans-serif;
}

.card-row .proj{
    flex:0.7;
    color:linear-gradient(
    135deg,
    #8E2DE2,
    #C471ED
);;
    font-weight:600;
    font-family:Arial, sans-serif;
}

.card-row .date{
    flex:0.8;
    text-align:right;
    color:#888;
}
/* hover effect */
.card:hover{
    transform:translateY(-5px);
    box-shadow:0 10px 25px rgba(0,0,0,0.15);
}
.card-row .proj{
    flex:0.7;
   
    font-weight:600;
    cursor:pointer;
}

.card-row .proj:hover{
    text-decoration:underline;
}
/* HEADER */
.card h3{
    margin:0;
    padding:12px 15px;
    font-size:12px;
    font-family: sans-serif;
    font-weight:600;
    color:darkblue;

    background:linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);;
}

/* SECTION TITLE */
.card h4{
    margin:10px 15px 5px;
    font-size:13px;
    font-family:Arial, sans-serif;
    font-weight:bold;
}

/* COLORS */
.card h4:first-of-type{
    color:#28a745;   /* green */
}
.card h4:last-of-type{
    color:#ff9800;   /* orange */
}

/* LIST */
.card ul{
    margin:5px 0 10px;
    padding:0 15px 10px 25px;

    max-height:160px;
    overflow-y:auto;

    font-size:13px;
    color:#444;
    font-family:Arial, sans-serif;
}

/* scrollbar (optional nice touch) */
.card ul::-webkit-scrollbar{
    width:5px;
}
.card ul::-webkit-scrollbar-thumb{
    background:linear-gradient(
    135deg,
    #8E2DE2,
    #C471ED
);;
    border-radius:10px;
}
    .card h4:first-of-type {
    color: green;
}
.card h4:last-of-type {
    color: orange;
}
// #homeContent{
//     overflow: hidden;
// }
    
.data-val:hover{
  background:linear-gradient(
    #61348b,
    #002855
    
    
);
  color:white;
  cursor:pointer;
}
.data-val{
border:1px solid #ddd;


}
/* Remove NetSuite spacing */
#main_form,
.uir-page-body-content,
.uir-page-body,
.uir-page-wrapper,
.uir-page-main,
.uir-page-container,
#div__body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
}

/* Fix container */
.container{
    display: flex;
    flex-direction: row;      /*  sidebar + content side-by-side */
    min-height: calc(100vh - 60px);
    
}


    .stats-container {
    width: 100%;
    transition:all 0.3s ease;
}


.st-header{
                font-size:14px;
                
                font-family:calibri;
                color:#0000CD;
                white-space:nowrap;
                border:1px solid #ddd;
                

                text-transform:uppercase;
                }

.header{
    
       background:linear-gradient(
    135deg,
    #002855 20%,
    #5b2d8e 40%,
    #8f50df 100%
);;
    color:white;
    height:60px;
    padding:0 20px;
    display:flex;
    font-family: sans-serif;
    font-weight:100;
    font-size:14px;
    //text-transform:uppercase;
    align-items:center;
    position:sticky;
    top:0;
    z-index:999;
}
/* Left */
.left-section{
    flex:1;
    display:flex;
    flex-direction:row;
    gap:10px;
    align-items:center;
   
}

/* Center */
.center-section{
    flex:2;
    text-align:center;
    font-size:18px;
    font-weight:bold;
    font-family: sans-serif;
    
}

/* Right */
.right-section{
    flex:1;
    display:flex;
    justify-content:flex-end;
    align-items:center;
    gap:15px;
}
.menu-icon{
position:static;
left:15px;
top:12px;
font-size:22px;
cursor:pointer;
}


#div__body,
.uir-page-wrapper,
.uir-page-main,
.uir-page-body,
.uir-page-container {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
}
// .container{
//     display:block;   
// }
.sidebar{
     position:fixed;      
    top: 60px;             
    left: 0;

    width: 0px;
    height: 1000px;  


 background:linear-gradient(
    #61348b,
    #002855
    
    
);
    color: white;

    overflow: hidden;
    transition: 0.3s;

    z-index: 9999;          
}
.status-section{
    margin-bottom:25px;
}

.section-title{
    font-size:18px;
    font-weight:bold;
    color:linear-gradient(
    135deg,
    #8E2DE2,
    #C471ED
);;
    margin-bottom:10px;
    margin-top:10px;
}
.menu{
padding:14px;
border-bottom:1px solid #0c4f82;
cursor:pointer;
font-family:sans-serif;
font-size:16px;
font-weight:bold;
font-family:calibri;
display:flex;
gap:20px;
text-transform:capitalize;
}
.menu.active{
    background:#6f3ba2;
    color:#fff;
    font-weight:bold;
}

.menu.active i{
    color:#fff;
}
.menu:hover{
background:white;
text-decoration: underline;
border-radius:8px;
color:darkblue;

}


    .content{
    flex: 1;
    padding: 0 20px;

    height: auto;        /*  REMOVE FIXED HEIGHT */
    overflow-y: hidden;   /*  NO SCROLL, NO CUT */
}
.con{


margin-top:-36px;
margin-left:-20px;
margin-right:-20px;
padding-right:-20px;

}



#loader {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height:100%;
  background:white /* light overlay */
  z-index: 9999;     /* above everything */
  text-align: center;
  padding-top: 200px;

 
}
 
.spinner {
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);


  border: 6px solid #f3f3f3;
  border-top: 6px solid rgb(107, 63, 160);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
//   margin: auto;
}

@keyframes spin {
  0% { transform: translate(-50%,-50%) rotate(0deg); }
  100% { transform: translate(-50%,-50%) rotate(360deg); }
}
.stats-values div{
padding:20px;

font-size:20px;
}

.right-section{
    display:flex;
    align-items:center;
    gap:10px;
}
.role-text{
    font-size:10px;
    font-weight:bold;
    background:white;
    border-radius:20px;
    padding:8px 17px;
    color:#8E2DE2;
}
        .role-text:hover{
        background:#1667a5;
        color :white;
        }

/* REMOVE absolute positioning */
.logout{
    position:static;   
     background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
    border:1px solid #ddd;
    border-radius:4px;
    padding:6px 15px;
    color:white;
    cursor:pointer;
}
    
.logout:hover{
background:white;
color:#1667a5;
font-weight:bold;

}
.card-title{
     background:
linear-gradient(
    135deg,
    #8E2DE2,
    #C471ED
);}
    .title{
    position:absolute;
    left:50%;
    transform:translateX(-50%);
    font-size:18px;
}
    .avatar{
    width: 35px;
    height: 35px;
    border-radius: 50%;

    background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
    color: white;

    display: flex;
    align-items: center;
    justify-content: center;

    
    font-size: 10px;
}
    .card-container{
    display:flex;
    gap:20px;
    margin-top:20px;
}


.chart-card{
    margin:20px;
    padding:15px;
    background:#fff;
    border-radius:12px;
    box-shadow:0 4px 15px rgba(0,0,0,0.1);
}

.chart-header{
    font-size:18px;
    font-weight:bold;
    font-family: sans-serif;
    margin-bottom:10px;
    color:#6f3ba2;
}

.chart-body{
    width:100%;
    height:350px;
}

.user-info{
    display:flex;
    align-items:center;
    gap:10px;
}

.user-name{
    font-size:12px;
    font-weight:bold;
    background:white;
    border-radius:20px;
    padding:6px 15px;
   color:#8E2DE2;
}
     .user-name:hover{
        background:#1667a5;
        color :white;
        }
.card ul{
    padding-left:20px;
    max-height:none;   /* 🔥 remove limit */
    overflow:visible;  /* 🔥 no scroll */
}
    .user-info{
    display:flex;
    align-items:center;
    gap:10px;
}

.user-name-box{
    display:flex;
    align-items:center;
    gap:8px;
}
.user-name-box{
    font-size:12px;
    font-weight:bold;
    background:white;
    border-radius:20px;
    padding:6px 15px;
   color:#8E2DE2;
}
     .user-name-box:hover{
        background:#1667a5;
        color :white;
        font-weight:bold;
        }
.initials{
    width:22px;
    height:22px;
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

    font-size:8px;
    font-weight:bold;
}

.full-name{
    
    font-size:10px;
    font-weight:bold;
    color:#8E2DE2;
}
.full-name:hover{
    color:white;
    font-weight:bold;


    }
    .stats-main-wrapper{
    display:flex;
    gap:20px;
    width:100%;
    margin-top:-10px;
    align-items:flex-start;
}

.status-section{
    flex:1;
    min-width:0;
}

.section-title{
    font-size:18px;
    font-weight:bold;
    color:linear-gradient(
    135deg,
    #8E2DE2,
    #C471ED
);;
    margin-bottom:10px;
    padding-left:5px;
}

.status-section .stats-header,
.status-section .stats-values{
    display:flex;
    width:100%;
}

.status-section .stats-header div,
.status-section .stats-values div{
    flex:1;
    text-align:center;
}
    .stats-main-wrapper{
    display:flex;
    gap:10px;
    width:100%;
}

.status-section{
    flex:1;
}

/* MAIN HEADING ROW */
.main-heading-row{
    width:100%;
    border:1px solid #ccc;
}

.main-heading{
    background:linear-gradient(
    135deg,
    #D8BFD8,
    #D8BFD8
);;
    color:white;

    padding:8px;
    text-align:center;
    border-radius:6px 6px 0 0;

    font-size:16px;
    font-weight:bold;

   text-transform: uppercase;
   
   font-family:calibri;
     white-space: nowrap;      /* Prevents text from wrapping */
    overflow: hidden;         /* Hides overflow text */
    text-overflow: ellipsis;
   
    border-radius:6px 6px 0 0;
    border-bottom:2px solid white;
}

/* EXISTING TABLE STYLE */
.status-section .stats-header{
    display:flex;
    background:#7b4bb3;
    color:white;
}

.status-section .stats-values{
    display:flex;
}

.status-section .stats-header div,
.status-section .stats-values div{
    flex:1;
    text-align:center;
    padding:12px;
    border:1px solid #ddd;
}
   .stats-main-wrapper{
    display:flex;
    gap:25px;   /* space between Project and Ticket */
    width:100%;
    border-radius:8px;
    margin-top:15px;
}

.status-section{
    flex:1;
}

/* REMOVE GAP */
.main-heading-row{
    width:100%;
    margin:0;
    padding:0;
}

.main-heading{
    background:linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);;
    color:black;

    padding:8px;
    text-align:center;

    font-size:16px;
    font-weight:bold;

    margin:0 !important;
    border:1px solid #ccc;

    border-radius:0;
    border-bottom:none;
    border:1px solid white;
}
.main-heading-row,
.stats-header,
.stats-container,
.status-section{
    margin:0 !important;
    padding:0 !important;
}
/* REMOVE GAP BETWEEN HEADING & TABLE */
.status-section .stats-container{
    margin-top:0 !important;
    padding-top:0 !important;
}

.status-section .stats-header{
    display:flex;
    background:#7b4bb3;
    color:white;
    margin-top:0 !important;
}

.status-section .stats-values{
    display:flex;
}

.status-section .stats-header div,
.status-section .stats-values div{
    flex:1;
    text-align:center;
    padding:12px;
    border:1px solid #ddd;
}
    
    .card,
.chart-card{

    background:
    rgba(255,255,255,0.92);

    backdrop-filter:blur(12px);

    border:1px solid rgba(255,255,255,0.2);
}
    .card:hover,
button:hover{

    transform:translateY(-4px);

    box-shadow:
    0 10px 25px rgba(168,85,247,0.35);
}
.logo{
    display:flex;
    align-items:center;
    justify-content:center;

    height:60px;

    position:relative;
    top:0;
    padding:0;
    margin:0;

    filter:
        brightness(0)
        invert(1)
        drop-shadow(0 2px 4px rgba(0,0,0,0.2));

    opacity:0.95;
}

.logo img{
    width:150px;
    height:38px;
    padding-top:6px;
    object-fit:contain;
    display:block;
}
    .stats-header,
.stats-values{
    display:grid;
    width:100%;
    grid-template-columns:repeat(auto-fit, minmax(120px, 1fr));
}

/* HEADER */
.stats-header div{
    background:linear-gradient(
        135deg,
        #E6E6FA,
        #E6E6FA
    );

    color:#00008B;

    padding:12px 8px;

    text-align:center;

    font-size:13px;
    font-weight:bold;

    border:1px solid white;
}

/* VALUES */
.stats-values div{
    background:#fff;

    padding:16px 8px;

    text-align:center;

    font-size:18px;

    
}
    .right-section{

    display:flex;

    align-items:center;

    justify-content:flex-end;

    gap:14px;
}

/* USER CARD */

.modern-user-box{

    display:flex;

    align-items:center;

    gap:10px;

    padding:6px 14px;

    border-radius:14px;

    background:
        rgba(255,255,255,0.16);

    backdrop-filter:blur(10px);

    border:
        1px solid rgba(255,255,255,0.18);

    transition:0.3s ease;
}

.modern-user-box:hover{

    transform:translateY(-1px);

    background:
        rgba(255,255,255,0.22);
}

/* AVATAR */

.modern-avatar{

    width:34px;

    height:34px;

    border-radius:50%;

    background:
        linear-gradient(
            135deg,
            #ffffff,
            #d8b4fe
        );

    color:#5b2d8e;

    display:flex;

    align-items:center;

    justify-content:center;

    font-size:11px;

    font-weight:600;

    letter-spacing:0.5px;
}

/* USER DETAILS */

.modern-user-details{

    display:flex;

    flex-direction:column;

    line-height:1.2;
}

.modern-user-name{

    font-size:13px;

    font-weight:700;

    color:white;
}

.modern-user-role{

    font-size:11px;

    color:#E9D5FF;

    font-weight:500;
}

/* LOGOUT BUTTON */

.modern-logout-btn{

    height:38px;

    padding:0 16px;

    border:none;

    border-radius:10px;

    cursor:pointer;

    font-size:13px;

    font-weight:600;

    color:white;

    background:
        rgba(255,255,255,0.14);

    border:
        1px solid rgba(255,255,255,0.18);

    backdrop-filter:blur(10px);

    transition:0.3s ease;
}

.modern-logout-btn:hover{

    background:white;

    color:#5b2d8e;

    transform:translateY(-1px);
}
    .right-section{

    display:flex;

    justify-content:flex-end;

    align-items:center;
}

/* MAIN PROFILE */

.profile-dropdown{

    position:relative;
}

/* TOP BAR */

.profile-top{

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:12px;

    min-width:220px;
    height:40px;

    padding:8px 10px;

    border-radius:10px;

    cursor:pointer;

    background:
        rgba(255,255,255,0.14);

    border:
        1px solid rgba(255,255,255,0.16);

    backdrop-filter:blur(10px);

    transition:0.3s ease;
}

.profile-top:hover{

    background:
        rgba(255,255,255,0.22);
}

.profile-left{

    display:flex;

    align-items:center;

    gap:10px;
}

/* AVATAR */

.modern-avatar{

    width:30px;

    height:30px;

    border-radius:50%;

    background:
        linear-gradient(
            135deg,
            #ffffff,
            #d8b4fe
        );

    color:#5b2d8e;

    display:flex;

    align-items:center;

    justify-content:center;

    font-size:14px;

    font-weight:700;
}

/* NAME */

.profile-name{

    color:white;

    font-size:13px;

    font-weight:700;
}

/* ARROW */

.profile-arrow{

    color:white;

    font-size:11px;

    transition:0.3s ease;
}

/* MENU */

.profile-menu{

    position:absolute;

    top:55px;

    right:0;

    width:260px;

    background:white;

    border-radius:14px;

    box-shadow:
        0 10px 30px rgba(0,0,0,0.14);

    padding:16px;

    display:none;

    z-index:9999;
}

/* DETAIL ROW */

.profile-detail-row{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:10px 0;

    border-bottom:1px solid #ECECEC;
}

.detail-label{

    font-size:12px;

    color:#6B7280;

    font-weight:600;
}

.detail-value{

    font-size:12px;

    color:#172B4D;

    font-weight:700;

    text-align:right;
}

/* LOGOUT */

.modern-logout-btn{

    width:100%;

    margin-top:16px;

    height:40px;

    border:none;

    border-radius:10px;

    cursor:pointer;

    background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;

    color:white;

    font-size:13px;

    font-weight:600;

    transition:0.3s ease;
}

.modern-logout-btn:hover{

    transform:translateY(-1px);

    opacity:0.92;
}
    .modern-avatar{

    width:32px !important;

    height:32px !important;

    font-size:10px !important;

    font-weight:600 !important;

    letter-spacing:0.3px !important;
}
   .profile-menu{

    position:absolute;

    top:55px;

    right:0;

    width:260px;

    background:white;

    border-radius:14px;

    box-shadow:
        0 10px 30px rgba(0,0,0,0.14);

    padding:16px;

    display:none;

    z-index:9999;
}

/* CLOSE ICON */

.profile-close{

    position:absolute;

    top:10px;

    right:12px;

    width:24px;

    height:24px;

    border-radius:50%;

    display:flex;

    align-items:center;

    justify-content:center;

    cursor:pointer;
    margin-bottom:20px;
    padding:20px;
    font-size:12px;

    font-weight:700;

    color:#6B7280;

    transition:0.3s ease;
}

.profile-close:hover{

    background:#F3F4F6;

    color:#5b2d8e;

    transform:scale(1.08);
}
    .profile-menu{

    position:absolute;
    top:55px;
    right:0;

    width:280px;

    background:white;
    border-radius:16px;

    box-shadow:
        0 10px 30px rgba(0,0,0,0.14);

    padding:18px 18px 14px;

    display:none;

    z-index:9999;
}

/* TOP AREA */

.profile-top{

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:10px;

    margin-bottom:14px;

    padding-right:6px;
}

/* USER ROLE */

.profile-role{

    font-size:12px;

    font-weight:600;

    color:#5b2d8e;

    background:#F3F0FF;

    padding:7px 14px;

    border-radius:20px;

    max-width:200px;

    overflow:hidden;

    text-overflow:ellipsis;

    white-space:nowrap;
}

/* CLOSE BUTTON */

.profile-close{

    width:28px;

    height:28px;

    min-width:28px;

    border-radius:50%;

    display:flex;

    align-items:center;

    justify-content:center;

    cursor:pointer;

    font-size:13px;

    font-weight:700;

    color:#666;

    transition:0.3s ease;
}

.profile-close:hover{

    background:#F3F4F6;

    color:#5b2d8e;

    transform:scale(1.08);
}
    /* PROFILE WRAPPER */

.profile-wrapper{

    position:relative;

    display:flex;

    align-items:center;
}

/* TRIGGER */

.profile-trigger{

    display:flex;

    align-items:center;

    gap:12px;

    background:white;

    padding:8px 14px;

    border-radius:40px;

    cursor:pointer;

    transition:0.3s ease;

    min-width:240px;

    box-shadow:
        0 4px 12px rgba(0,0,0,0.08);
}

.profile-trigger:hover{

    transform:translateY(-2px);

    box-shadow:
        0 8px 20px rgba(0,0,0,0.12);
}

/* AVATAR */

.profile-avatar{

    width:40px;

    height:40px;

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

    font-size:16px;

    font-weight:700;

    flex-shrink:0;
}

/* USER INFO */

.profile-user-info{

    flex:1;

    min-width:0;
}

.profile-user-name{

    font-size:13px;

    font-weight:700;

    color:#222;

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;
}

.profile-user-role{

    font-size:11px;

    color:#777;

    margin-top:2px;

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;
}

/* ARROW */

.profile-arrow{

    color:#777;

    font-size:12px;

    flex-shrink:0;
}

/* MENU */

.profile-menu{

    position:absolute;

    top:70px;

    right:0;

    width:320px;

    background:white;

    border-radius:18px;

    box-shadow:
        0 15px 40px rgba(0,0,0,0.15);

    padding:18px;

    display:none;

    z-index:99999;

    animation:profileFade 0.25s ease;
}

@keyframes profileFade{

    from{
        opacity:0;
        transform:translateY(-10px);
    }

    to{
        opacity:1;
        transform:translateY(0);
    }
}

/* TOP */

.profile-top{

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:10px;

    margin-bottom:16px;
}

/* ROLE BADGE */

.profile-role-badge{

    background:#F3F0FF;

    color:#6C2BD9;

    font-size:12px;

    font-weight:700;

    padding:8px 14px;

    border-radius:30px;

    max-width:220px;

    overflow:hidden;

    text-overflow:ellipsis;

    white-space:nowrap;
}

/* CLOSE */

.profile-close{

    width:30px;

    height:30px;

    min-width:30px;

    border-radius:50%;

    display:flex;

    align-items:center;

    justify-content:center;

    cursor:pointer;

    font-size:14px;

    transition:0.3s ease;

    color:#666;
}

.profile-close:hover{

    background:#F4F4F4;

    color:#8E2DE2;

    transform:rotate(90deg);
}

/* PROFILE CARD */

.profile-card{

    display:flex;

    align-items:center;

    gap:14px;

    background:#fafafa;

    padding:14px;

    border-radius:14px;

    margin-bottom:18px;
}

/* CARD AVATAR */

.profile-card-avatar{

    width:52px;

    height:52px;

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

    font-size:20px;

    font-weight:700;

    flex-shrink:0;
}

/* DETAILS */

.profile-card-details{

    flex:1;

    min-width:0;
}

.profile-card-name{

    font-size:14px;

    font-weight:700;

    color:#222;

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;
}

.profile-card-email{

    font-size:12px;

    color:#777;

    margin-top:4px;

    word-break:break-word;
}

/* MENU ITEMS */

.profile-menu-items{

    display:flex;

    flex-direction:column;

    gap:8px;
}

.profile-menu-item{

    display:flex;

    align-items:center;
    

    gap:12px;

    padding:12px 14px;

    border-radius:12px;

    cursor:pointer;

    transition:0.25s ease;

    font-size:16px;

    font-weight:700;

    color:#333;
}

.profile-menu-item:hover{

    background:#F3F0FF;

    color:#6C2BD9;
}

/* LOGOUT */

.logout-item{

    color:#dc2626;
}

.logout-item:hover{

    background:#fef2f2;

    color:#dc2626;
}
    /* PROFILE BUTTON */

.profile-trigger{

    padding:6px 12px;      /* reduced */

    min-width:200px;       /* reduced */

    border-radius:16px;

    gap:10px;
}

/* AVATAR */

.profile-avatar{

    width:34px;            /* reduced */

    height:34px;

    font-size:13px;
}

/* USER NAME */

.profile-user-name{

    font-size:12px;
}

/* ROLE */

.profile-user-role{

    font-size:10px;
}

/* ARROW */

.profile-arrow{

    font-size:10px;
}

/* DROPDOWN */

.profile-menu{

    width:260px;           /* reduced */

    padding:14px;
}

/* PROFILE CARD */

.profile-card{

    padding:10px;

    gap:10px;

    margin-bottom:14px;
}

/* CARD AVATAR */

.profile-card-avatar{

    width:42px;

    height:42px;

    font-size:16px;
}

/* MENU ITEMS */

.profile-menu-item{

    padding:10px 12px;

    font-size:12px;
}
    .profile-header{
    display:flex;
    align-items:center;
    justify-content:space-between;

    width:100%;
    padding:10px 14px;

    border-bottom:1px solid #e5e7eb;
}

/* title */
.profile-header h3{
    margin:0;
    font-size:14px;
    font-weight:600;
}

/* close icon */
.profile-close{
    margin-left:auto;
    cursor:pointer;

    font-size:16px;
    font-weight:bold;

    line-height:1;
}
    /* NOTIFICATION */

.notif-wrapper{
    position:relative;
    display:flex;
    align-items:center;
}

.notif-bell{

    position:relative;

    width:40px;
    height:40px;

    border-radius:50%;

    display:flex;
    align-items:center;
    justify-content:center;

    cursor:pointer;

    background:rgba(255,255,255,0.15);

    transition:0.3s ease;

    backdrop-filter:blur(10px);
}

.notif-bell:hover{

    background:white;
    color:#8E2DE2;

    transform:translateY(-2px);
}

.notif-bell i{
    font-size:18px;
    color:white;
}

.notif-bell:hover i{
    color:#8E2DE2;
}

/* COUNT */

.notif-count{

    position:absolute;

    top:-5px;
    right:-5px;

    width:18px;
    height:18px;

    border-radius:50%;

    background:red;
    color:white;

    font-size:10px;
    font-weight:bold;

    display:flex;
    align-items:center;
    justify-content:center;
}

/* DROPDOWN */

.notif-dropdown{

    position:absolute;

    top:55px;
    right:0;

    width:340px;

    background:white;

    border-radius:14px;

    box-shadow:0 10px 30px rgba(0,0,0,0.15);

    overflow:hidden;

    display:none;

    z-index:99999;
}

/* HEADER */

.notif-header{

    padding:14px;

    font-size:15px;
    font-weight:bold;

    background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;

    color:white;
}

/* ITEM */

.notif-item{

    padding:14px;

    border-bottom:1px solid #eee;

    cursor:pointer;

    transition:0.3s ease;
}

.notif-item:hover{

    background:#f8f5ff;
}

/* UNREAD */

.notif-item.unread{

    background:#f3e8ff;
}

/* TITLE */

.notif-title{

    font-size:13px;
    font-weight:600;
    color:#333;

    margin-bottom:4px;
}

/* TIME */

.notif-time{

    font-size:11px;
    color:#888;
}
    .timeline-card{

    margin:20px;
    background:#fff;
    border-radius:18px;
    padding:20px;

    box-shadow:
        0 4px 20px rgba(0,0,0,0.08);
}

.timeline-header{

    font-size:18px;
    font-weight:600;
    margin-bottom:20px;

    color:#2d2d2d;

    font-family:Arial,sans-serif;
}

.progress-item{

    margin-bottom:22px;
}
.notif-remove{
color:black;
}
.progress-top{

    display:flex;
    justify-content:space-between;
    align-items:center;

    margin-bottom:8px;
}

.project-name{

    font-size:14px;
    font-weight:600;
    color:#222;
}

.project-percent{

    font-size:13px;
    font-weight:bold;

    color:#6f3ba2;
}

.progress-bar{

    width:100%;
    height:14px;

    background:#ececec;

    border-radius:20px;

    overflow:hidden;
}

.progress-fill{

    height:100%;

    border-radius:20px;

   background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;

    transition:width 0.5s ease;
}

.progress-meta{

    margin-top:6px;

    font-size:11px;

    color:#888;
}
    .modern-timeline-card{

    margin:20px;

    background:rgba(255,255,255,0.75);

    backdrop-filter:blur(12px);

    border-radius:22px;

    padding:22px;

    box-shadow:
        0 8px 30px rgba(0,0,0,0.08);

    border:1px solid rgba(255,255,255,0.4);

    transition:0.3s ease;
}

.modern-timeline-card:hover{

    transform:translateY(-3px);
}

.modern-timeline-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:22px;

    font-size:18px;

    font-weight:700;

    color:#2d1457;
}

.timeline-count{

    background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;

    color:white;

    padding:7px 14px;

    border-radius:30px;

    font-size:12px;

    font-weight:600;
}

.modern-progress-item{

    margin-bottom:20px;

    padding:16px;

    border-radius:18px;

    background:white;

    box-shadow:
        0 4px 15px rgba(0,0,0,0.05);

    transition:0.3s ease;
}

.modern-progress-item:hover{

    transform:scale(1.01);
}

.modern-progress-top{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:12px;
}

.modern-project-name{

    font-size:15px;

    font-weight:700;

    color:#222;

    margin-bottom:4px;
}

.modern-meta{

    font-size:12px;

    color:#777;
}

.modern-percent{

    font-size:15px;

    font-weight:700;

    color:#8E2DE2;
}

.modern-progress-bar{

    width:100%;

    height:12px;

    background:#ececec;

    border-radius:30px;

    overflow:hidden;
}

.modern-progress-fill{

    height:100%;

    border-radius:30px;

   background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;

    transition:width 0.5s ease;
}

.timeline-btn-wrap{

    display:flex;

    justify-content:center;

    margin-top:20px;
}

.modern-view-btn{

    border:none;

    outline:none;

    cursor:pointer;

    padding:12px 24px;

    border-radius:40px;

    font-size:13px;

    font-weight:600;

    color:white;

    background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;

    transition:0.3s ease;

    box-shadow:
        0 5px 15px rgba(142,45,226,0.3);
}

.modern-view-btn:hover{

    transform:translateY(-2px) scale(1.03);

    box-shadow:
        0 8px 20px rgba(142,45,226,0.4);
}
        .pmo-stats-row{
    display:flex;
    gap:15px;          /* gap between columns */
    flex-wrap:wrap;
    
}

.pmo-stat-card{
    min-width:140px;
    border:1px solid white;
    border-radius:14px;
    overflow:hidden;
    background:#fff;
}

.pmo-stat-card .st-header{
    padding:10px;
    text-align:center;
    background:#E6E6FA;
    font-weight:400;
    font-size:14px;
    
    font-family:calibri;
    color:#0000CD;
}

.pmo-stat-card .data-val{
    padding:12px;
    text-align:center;
    font-weight:400;
}
    .notif-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:12px 15px;
    font-weight:bold;
}

.notif-close{
    cursor:pointer;
    font-size:16px;
    color:white;
}

.notif-close:hover{
    color:darkblue;
}
    .sprint-board{
    display:flex;
    gap:15px;
    margin:20px;
}

.sprint-column{
    flex:1;
    background:#fff;
    border-radius:12px;
    padding:10px;
    min-height:350px;
    box-shadow:0 4px 10px rgba(0,0,0,.08);
}

.sprint-title{
    font-weight:700;
    padding:10px;
    border-radius:8px;
    margin-bottom:10px;
    text-align:center;
}

.todo{
    background:#ffe5e5;
}
.review{
    background:#e9d5ff;
}
.progress{
    background:#dbeafe;
}

.testing{
    background:#fef3c7;
}

.done{
    background:#dcfce7;
}

.ticket-card{
    background:#fafafa;
    border-left:4px solid #6f3ba2;
    border-radius:8px;
    padding:8px;
    margin-bottom:8px;
    font-size:12px;
}
    .sprint-column.drag-over{
    background:#f3f4f6;
    border:2px dashed #6f3ba2;
}

.ticket-card{
    cursor:grab;
}
.done-ticket{
    cursor:not-allowed;
    opacity:0.85;
}
.ticket-card:active{
    cursor:grabbing;
}
    s
</style>
<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<div class="con" sytle="width:100%;margin:0;padding:0;background:pink;">
<div class="header">

    <div class="left-section">
        <div class="menu-icon" onmouseover="openMenu()">☰</div>
        <div class="logo">
                <img  height="30px" width="150px"  src="https://2771600.app.netsuite.com/core/media/media.nl?id=5690&c=2771600&h=kIUCEpH0C_eyrUBVYGJn7nEHV_vSoKDhpdzpaPF7vFesdytX">
            </div>
    </div>

    <div class="center-section" id="headerTitle">
        RW Project Management Portal
    </div>

 <div class="right-section">
${notifHtml}
    <!-- PROFILE SECTION -->

<div class="profile-wrapper">

    <!-- PROFILE BUTTON -->
    <div class="profile-trigger" onclick="toggleProfileMenu(event)">

        <div class="profile-avatar">

    ${
        loggedInUserName
        ? loggedInUserName
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0,2)
            .toUpperCase()

        : 'US'
    }

</div>

        <div class="profile-user-info">

            <div class="profile-user-name">
                ${loggedInUserName || 'User'}
            </div>

            <div class="profile-user-role">
                ${dmsRole || 'Employee'}
            </div>

        </div>

        <div class="profile-arrow">
            <i class="fa-solid fa-chevron-down"></i>
        </div>

    </div>

    <!-- DROPDOWN -->
    <div class="profile-menu" id="profileMenu">

        <!-- TOP -->

        <div class="profile-top">

            <div class="profile-menu-item">
                <i class="fa-solid fa-user"></i>
                My Profile
            </div>

            <div
                class="profile-close"
                onclick="closeProfileMenu(event)"
            >
                ✕
            </div>

        </div>

        <!-- USER CARD -->

        <div class="profile-card">

          

           

        

        <!-- MENU -->

        <div class="profile-menu-items">

            <div class="profile-card-name">
                    ${loggedInUserName || 'User'}
                </div>

                <div class="profile-card-email">
                    ${email || ''}
                </div>
<div class="profile-role-badge">
                ${dmsRole || 'Employee'}
            </div>
            

            <div
                class="profile-menu-item logout-item"
                onclick="logout()"
            >
                <i class="fa-solid fa-right-from-bracket"></i>
                Logout
            </div>

        </div>

    </div>
</div>
</div>

</div>

</div>

<div class="container" style="display: flex; flex-direction: row;">

<div class="sidebar" id="sidebar" onmouseleave="closeMenu()">

<div class="menu" onclick="openHome()"><i class="fa-solid fa-house"></i>  Home</div>

${projectMenu}
${ticketMenu}
${projectPlan}
${newProjectPlan}
${newRevenueStream}

</div>

<div class="content">

<div id="projectContent" style="display:none;width:100%;">

  <iframe id="mainFrame"
        style="
        width:100%;
        height:100%;
        border:none;
        display:none;
        margin-top:40px;
        
        position:absolute;
        
        top:0;
        left:0;
        background:white;
        overflow-y:hidden;
        overflow-x:hidden;
        
        "
        onload="hideLoader()">
</iframe>
</div>

<div id="homeContent" style="margin-top:30px;">

${roleType === 'PM' ? `

<div class="stats-main-wrapper">

    <!-- PROJECT SECTION -->
    <div class="status-section">

        <div class="main-heading-row">
            <div class="main-heading">
                Projects
            </div>
        </div>

        <div class="stats-container">

            <div class="stats-header">
                ${projectStatsHeader}
            </div>

            <div class="stats-values">
                ${projectStatsValues}
            </div>

        </div>

    </div>

    <!-- TICKET SECTION -->
    <div class="status-section">

        <div class="main-heading-row">
            <div class="main-heading">
                Tickets
            </div>
        </div>

        <div class="stats-container">

            <div class="stats-header">
                ${ticketStatsHeader}
            </div>

            <div class="stats-values">
                ${ticketStatsValues}
            </div>

        </div>

    </div>

</div>

` : ''}
<div class="stats-container">

            <div class="stats-header">
                ${statsHeader}
            </div>

            <div class="stats-values">
                ${statsValues}
            </div>

        </div>
${roleType === 'PMO' ? `
    ${specialCards}
${timelineProgressCard}
    

    <div style="margin:10px;">
        ${pieChartCard}
    </div>
    
` : ''}
${roleType === 'PM' ? `
<div style="display:flex; gap:8px; margin:8px;">
    ${highPriorityCardOfLoggedInUser}
    ${goLiveCardUser}
    ${overdueProjectCardInneruser}
    ${overdueCardInner}
</div>

<div style="margin:10px;">
    ${pieChartCard}
</div>
` : ''}
${roleType === 'DEV' ? `

<!-- TOP ROW -->
<div style="display:flex; margin:10px; align-items:space-between;">

    ${highPriorityCardOfLoggedInUser}

    ${overdueCardInner}

    ${donutCard}
    ${workloadChartHtml}

</div>
<!-- SPRINT BOARD BELOW -->
<div style="margin:20px 40px 0 40px;">
<div style="
    margin-top:20px;
    margin-bottom:10px;
    padding:12px 18px;
    background:linear-gradient(135deg,#002855,#5b2d8e,#8f50df);
    color:white;
    font-size:18px;
    font-weight:bold;
    border-radius:10px;
    box-shadow:0 4px 10px rgba(0,0,0,0.15);
">
    Sprint Board
</div>
    ${sprintBoardHtml}
</div>
<!-- WORKLOAD CHART BELOW -->
<div style="margin:20px 40px 0 40px;">
    
</div>



${pieChartCard}

` : ''}
${roleType === 'OTHER' ? `
<div style="display:flex; gap:100px; margin:10px;margin-left:40px;">
    ${highPriorityCardOfLoggedInUser}
    ${overdueCardInner}
    ${donutTicket}
   
</div>
  ${pieChartCard}
` : ''}
</div>


</div>




</div>

</div>

</div>

<div id="loader">
    <div class="spinner"></div>
    <p>Opening...</p>
</div>
<audio id="notifSound">

<source
src="https://actions.google.com/sounds/v1/alarms/notification_simple-02.mp3"
type="audio/mpeg">

</audio>
<script>

function removeNotification(notifId){

    fetch(
        window.location.href +
        '&action=removeNotification&notifId=' +
        notifId
    )
    .then(res => res.text())

    .then(() => {

        // REMOVE CURRENT NOTIFICATION
        var notifDiv =
            document.getElementById(
                'notif_' + notifId
            );

        if(notifDiv){
            notifDiv.remove();
        }

        // REMAINING NOTIFICATIONS
        var remaining =
            document.querySelectorAll(
                '.notif-item.unread'
            );

        // UPDATE COUNT
        var countBadge =
            document.querySelector(
                '.notif-count'
            );

        if(countBadge){

            countBadge.innerText =
                remaining.length;

            if(remaining.length === 0){
                countBadge.style.display = 'none';
            }
        }

        // DROPDOWN
        var dropdown =
            document.getElementById(
                'notifDropdown'
            );

        // SHOW ONLY WHEN EMPTY
        if(remaining.length === 0){

           dropdown.innerHTML =
    '<div class="notif-header">' +
         '<span>Notifications</span>'+

        '<span class="notif-close"'+
             ' onclick="closeNotifications(event)">'+
          '  ✖'+
        '</span>'+

    '</div>' +

    '<div class="notif-item no-notif" style="color:black;">' +
        'No Notifications' +
    '</div>';
        }

    });

}
/* ===== BLOCK BACK BUTTON AFTER LOGOUT ===== */

(function () {

    // prevent browser cache
    window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", function () {

        if (localStorage.getItem("isLoggedIn") !== "true") {

            window.location.replace("${loginUrl}");

            setTimeout(function () {
                window.history.go(1);
            }, 0);
        }
    });

    // prevent bfcache restore
    window.addEventListener("pageshow", function (event) {

        const isBack =
            event.persisted ||
            (window.performance &&
             window.performance.navigation &&
             window.performance.navigation.type === 2);

        if (isBack) {

            if (localStorage.getItem("isLoggedIn") !== "true") {

                document.body.innerHTML = "";

                window.location.replace("${loginUrl}");
            }
        }
    });

    // direct access protection
    if (localStorage.getItem("isLoggedIn") !== "true") {

        document.body.innerHTML = "";

        window.location.replace("${loginUrl}");
    }

})();

function closeProfileMenu(event){

    event.stopPropagation();

    document.getElementById(
        'profileMenu'
    ).style.display = 'none';

    document.getElementById(
        'profileArrow'
    ).style.transform = 'rotate(0deg)';
}
/* ===== LOGOUT FUNCTION ===== */

function logout() {

    // clear everything
    localStorage.clear();
    sessionStorage.clear();

    // kill browser history
    history.replaceState(null, null, "${loginUrl}");

    // redirect
    window.location.href = "${loginUrl}";
}
function toggleProfileMenu(){

    var menu =
        document.getElementById(
            'profileMenu'
        );

    var arrow =
        document.getElementById(
            'profileArrow'
        );

    if(menu.style.display === 'block'){

        menu.style.display = 'none';

        arrow.style.transform =
            'rotate(0deg)';
    }
    else{

        menu.style.display = 'block';

        arrow.style.transform =
            'rotate(180deg)';
    }
}

/* CLOSE WHEN CLICK OUTSIDE */

document.addEventListener(
    'click',
    function(e){

        var dropdown =
            document.querySelector(
                '.profile-dropdown'
            );

        var menu =
            document.getElementById(
                'profileMenu'
            );

        var arrow =
            document.getElementById(
                'profileArrow'
            );

        if(
            dropdown &&
            !dropdown.contains(e.target)
        ){

            menu.style.display='none';

            arrow.style.transform=
                'rotate(0deg)';
        }
    }
);

function toggleProfileMenu(event){

    event.stopPropagation();

    const menu =
        document.getElementById('profileMenu');

    if(menu.style.display === 'block'){

        menu.style.display = 'none';

    }else{

        menu.style.display = 'block';
    }
}

function closeProfileMenu(event){

    event.stopPropagation();

    document.getElementById(
        'profileMenu'
    ).style.display = 'none';
}

/* OUTSIDE CLICK */

document.addEventListener('click', function(){

    document.getElementById(
        'profileMenu'
    ).style.display = 'none';
});

/* PREVENT CLOSE INSIDE MENU */

document.getElementById(
    'profileMenu'
).addEventListener('click', function(event){

    event.stopPropagation();
});

var currentType = '';
/* PREVENT BACK AFTER LOGOUT */

history.pushState(null, null, location.href);

window.onpopstate = function () {
    history.go(1);
};

/* PREVENT PAGE CACHE */

window.addEventListener("pageshow", function (event) {

    if (
        event.persisted ||
        window.performance &&
        window.performance.navigation.type === 2
    ) {

        if(localStorage.getItem("isLoggedIn") !== "true"){

            window.location.replace("${loginUrl}");
        }
    }
});

/* SESSION CHECK */

if(localStorage.getItem("isLoggedIn") !== "true"){

    window.location.replace("${loginUrl}");
}
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace('${loginUrl}');
}

// Disable browser back
history.pushState(null, null, location.href);

window.addEventListener('popstate', function () {

    // stay on same page
    history.pushState(null, null, location.href);

});
if (!localStorage.getItem("isLoggedIn")) {
   
window.location.replace('${loginUrl}');
   }
    // Prevent back button completely
// window.history.pushState(null, null, window.location.href);
// window.addEventListener('pageshow', function(event) {

//     // browser back cache fix
//     if (event.persisted) {

//         window.location.reload();

//     }

// });
// window.onpopstate = function () {
  
// window.location.replace('${loginUrl}');
//    };
function storeSession(email, empId, password) {
    localStorage.setItem("email", email);
    localStorage.setItem("empId", empId); 
  localStorage.setItem("isLoggedIn", "true");
}
    var emailFromSuitelet = "${email}";
var empIdFromSuitelet = "${empId}";
storeSession(emailFromSuitelet, empIdFromSuitelet);
   console.log("Stored Email:", localStorage.getItem("email"));
console.log("Stored EmpId:", localStorage.getItem("empId"));
 if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "https://2771600.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2872&deploy=1&compid=2771600&ns-at=AAEJ7tMQLCBxkbOlhRyShbsZSNh6QPuKL2rt00NN091SJ6hEFho";
}
var viewProjectUrl = '${viewProjectUrl}';
var ticketUrl = '${ticketUrl}';

// DISABLE BACK AFTER LOGIN
 
function disableBackButton(){

    // remove previous login page
    history.replaceState(
        null,
        '',
        location.href
    );

    // push current dashboard state
    history.pushState(
        null,
        '',
        location.href
    );

}

// initial
disableBackButton();

// browser back
window.addEventListener('popstate', function () {

    // stay on dashboard
    history.pushState(
        null,
        '',
        location.href
    );

});

// mobile swipe back
window.addEventListener('pageshow', function (event) {

    if(event.persisted){

        disableBackButton();

    }

});

//enable only on home page
disableBackButton();


function renderMyTicketDonut(){

    var ctx = document.getElementById('myTicketDonut');

    if (!ctx) return;

    var chartCtx = ctx.getContext('2d');

    new Chart(chartCtx, {
        type: 'doughnut',
        data: {
            labels: [
                'My Tickets',
                'My Open Tickets',
                'My Closed Tickets'
            ],
            datasets: [{
                data: [
                    ${assignedTickets},
                    ${myOpenCount},
                    ${closedTicketCount}
                ],
                backgroundColor: [
                    '#6f3ba2',   // purple
                    '#ff9800',   // orange
                    '#28a745'    // green
                ]
            }]
        },
        options: {
            responsive: true,
            cutout: '60%',   // donut thickness
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ": " + context.raw;
                        }
                    }
                }
            }
        }
    });
}
    


function openProjectView(projectId){

    //setPageTitle("Project Details");
   // document.getElementById("headerTitle").innerText = "Project Details";

    document.getElementById("homeContent").style.display = "none";
    document.getElementById("loader").style.display = "block";
currentType = type || '';
    let url = viewProjectUrl;

    //  pass projectId + mode=view
    url += "&projectId=" + projectId;
url += "&statusFilter=" + encodeURIComponent(currentType);
    url += "&mode=view";

    document.getElementById("mainFrame").src = url;
    document.getElementById("projectContent").style.display = "block";

    toggleChartVisibility();
}
function openMenu(){
    document.getElementById("sidebar").style.width="240px";
    
}

function closeMenu(){
    document.getElementById("sidebar").style.width="0";
}
function setPageTitle(title){
    document.title = title + " | Reachware";
}
var projectUrl = '${projectUrl}';
var taskUrl ='${taskUrl}';
var ticketUrl = '${ticketUrl}';
function openProjects(){
setPageTitle("Projects");
document.getElementById("headerTitle").innerText = "RW Project Management Portal";
 document.getElementById("homeContent").style.display = "none";
document.getElementById("loader").style.display = "block"; 
document.getElementById("mainFrame").src = projectUrl  ;
document.getElementById("projectContent").style.display = "block";
toggleChartVisibility();
//disableBackButton();

}
function toggleChartVisibility(){

    var chart = document.getElementById("chartCard");
    var home = document.getElementById("homeContent");

    if(!chart || !home) return;

    var roleType = "${roleType}";

    // Show ONLY when:
    // - PMO
    // - Home is visible
    if(roleType === "PMO" && home.style.display !== "none"){
        chart.style.display = "block";
    }else{
        chart.style.display = "none";
    }
}
    function togglePieVisibility(){

    var pie = document.getElementById("pieChartCard");
    var home = document.getElementById("homeContent");

    if(!pie || !home) return;

    var roleType = "${roleType}";

    // ✅ Show only for PM AND only on Home
    if(roleType === "PM" && home.style.display !== "none"){
        pie.style.display = "block";
    }else{
        pie.style.display = "none";
    }
}

// run on page load
document.addEventListener("DOMContentLoaded", toggleChartVisibility);

function toggleDashboardVisibility(){

    var home = document.getElementById("homeContent");

    var chart = document.getElementById("chartCard");
    var pie = document.getElementById("pieChartCard");

    if(!home) return;

    var isHomeVisible = home.style.display !== "none";

    // BAR CHART (PMO only)
    if(chart){
        chart.style.display = (isHomeVisible && "${roleType}" === "PMO") ? "block" : "none";
    }

    // PIE CHART (PM / DEV / OTHER)
    if(pie){
        pie.style.display = isHomeVisible ? "block" : "none";
    }
}

function openProjectPlan(){
setPageTitle("Project Plan template");
    document.getElementById('homeContent').style.display = 'none';
    document.getElementById('projectContent').style.display = 'block';

    var frame = document.getElementById('mainFrame');

    frame.style.display = 'block';

    document.getElementById('loader').style.display = 'block';

    frame.src = '${projectPlanUrl}';

    

    closeMenu();
}
    function openNewProjectPlan(){
setPageTitle("New Project Plan template");
    document.getElementById('homeContent').style.display = 'none';
    document.getElementById('projectContent').style.display = 'block';
    var frame = document.getElementById('mainFrame');

    frame.style.display = 'block';

    document.getElementById('loader').style.display = 'block';

    frame.src = '${newProjectPlanUrl}';

    

    closeMenu();
}
    var lastNotifCount =
    ${unreadCount};

// async function toggleNotifications(){

//     var dropdown =
//         document.getElementById(
//             'notifDropdown'
//         );

//     dropdown.style.display =
//         dropdown.style.display === 'block'
//         ? 'none'
//         : 'block';
// }
async function toggleNotifications(){

    
var dropdown =
        document.getElementById(
            'notifDropdown'
        );

    dropdown.style.display =
        dropdown.style.display === 'block'
        ? 'none'
        : 'block';
    dropdown.classList.toggle('show');

    if(dropdown.classList.contains('show')){

        console.log('Bell clicked');

fetch(window.location.href + '&action=markRead')
.then(r => r.text())
.then(data => {
    console.log('markRead response', data);

    loadNotifications();
    loadNotificationCount();
});
    }
}


/* CLOSE WHEN CLICK OUTSIDE */

document.addEventListener('click', function(event){

    var wrapper = document.querySelector('.notif-wrapper');

    if(!wrapper.contains(event.target)){

        document.getElementById('notifDropdown').style.display = 'none';
    }
});
    function openRevenueStream(){
setPageTitle("New Project Plan template");
    document.getElementById('homeContent').style.display = 'none';
    document.getElementById('projectContent').style.display = 'block';
    var frame = document.getElementById('mainFrame');

    frame.style.display = 'block';

    document.getElementById('loader').style.display = 'block';

    frame.src = '${newRevenueStreamUrl}';

    

    closeMenu();
}
function openProjects(type){

    setPageTitle("Projects");
document.getElementById("headerTitle").innerText = "RW Project Management Portal";
    document.getElementById("homeContent").style.display = "none";
    document.getElementById("loader").style.display = "block";

     let title = "Projects";
if(type){
    currentType = type;
}
    if(type === "total") title = "Total Projects";
    else if(type === "open") title = "Open Projects";
    else if(type === "close") title = "Closed Projects";
    else if(type === "inprogress") title = "In Progress Projects";
    else if(type === "kickof") title = "Kickof Projects";
else if(type === "bussinessrequirement") title = "Bussiness requirement Projects";
else if(type === "training") title = "Training Projects";
else if(type === "coc") title = "COC Projects";
else if(type === "uat") title = "UAT Projects";
else if(type === "golive") title = "Golive Projects";
else if(type === "support") title = "Support Projects";
else if(type === "myprojects") title = "My projects";
    let url = projectUrl;
var frame = document.getElementById("mainFrame");


frame.style.display = "none";
frame.src = "";


frame.src = url;
    if(type){
        
        url += "&filter=" + type;
url += "&from=home";   //  ADD THIS

        url += "&title=" + encodeURIComponent(title);  
    }

    document.getElementById("mainFrame").src = url;

    document.getElementById("projectContent").style.display = "block";
    toggleChartVisibility();
    togglePieVisibility();
}
    document.addEventListener("DOMContentLoaded", function(){
    toggleChartVisibility();
    togglePieVisibility(); 
    disableBackButton();  //  ADD THIS
});
function openTasks(){
alert("task are opening");
setPageTitle("Task");
document.getElementById("headerTitle").innerText = "RW Ticketing APP - Task";
 document.getElementById("homeContent").style.display = "none";
document.getElementById("loader").style.display = "block"; 
document.getElementById("mainFrame").src = taskUrl  ;
document.getElementById("projectContent").style.display = "block";
}
// function openTickets(){
// setPageTitle("Tickets");
// document.getElementById("headerTitle").innerText = "RW Ticketing APP - ISSUE";
//  document.getElementById("homeContent").style.display = "none";
// document.getElementById("loader").style.display = "block"; 
// document.getElementById("mainFrame").src = ticketUrl  ;
// document.getElementById("projectContent").style.display = "block";
// }
// function openTickets(type){

//     setPageTitle("Tickets");
//     document.getElementById("headerTitle").innerText = "RW Ticketing APP - ISSUE";

//     document.getElementById("homeContent").style.display = "none";
//     document.getElementById("loader").style.display = "block";

//     var frame = document.getElementById("mainFrame");

//     if (!ticketUrl) {
//         console.error("ticketUrl is undefined");
//         return;
//     }

//     //  ALWAYS start fresh
//     var url = ticketUrl;

   

//     let title = "Tickets";

//     if(type === "assigned") title = "Assigned Tickets";
//     else if(type === "open") title = "Open Tickets";
//     else if(type === "allopen") title = "All Open Tickets";
//     else if(type === "total") title = "Total Tickets";
// else if(type === "closed") title = "Closed Tickets";
//     if(type){
//              url += "&filter=" + type;
             
// url += "&from=home";  
//         url += "&title=" + encodeURIComponent(title);  
//         //url += "&empid=" + localStorage.getItem("empId"); 
//     }

//     console.log("FINAL URL:", url);

//     frame.src = "";          // reset first
//     frame.style.display = "none";

//     frame.src = url;         // set once

//     document.getElementById("projectContent").style.display = "block";
//     toggleChartVisibility();
//     togglePieVisibility();
// }
function renderPieCharts(){

    var pieData = {
        project: [${projectCount}, ${openProjects}, ${inProgressCount}, ${closedProjects}],
        ticket: [${totalTickets}, ${openTicketCount}, ${totalTickets - openTicketCount}],
        my: [${pmProjectCount}, ${assignedTickets}, ${myOpenCount}]
    };

    // PROJECT PIE
    var p = document.getElementById('projectPie');
    if(p){
        new Chart(p.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Total', 'Open', 'In Progress', 'Closed'],
                datasets: [{ data: pieData.project }]
            }
        });
    }

    // TICKET PIE
    var t = document.getElementById('ticketPie');
    if(t){
        new Chart(t.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Total', 'Open', 'Closed'],
                datasets: [{ data: pieData.ticket }]
            }
        });
    }

    // MY PIE
    var m = document.getElementById('myPie');
    // MY PIE
var m = document.getElementById('myPie');

if(m){

    new Chart(m.getContext('2d'), {

        type: 'doughnut',

        data: {

            labels: [
                'My Projects',
                'My Tickets',
                'Open Tickets',
                'Closed Tickets'
            ],

            datasets: [{

                data: [
                    ${pmProjectCount},
                    ${assignedTickets},
                    ${myOpenCount},
                    ${closedTicketCount}
                ]
            }]
        },

        options:{
            responsive:true,
            cutout:'60%'
        }
    });
}
}
document.addEventListener('DOMContentLoaded',function(){

    var ctx =
    document.getElementById('workloadChart');

    if(!ctx) return;

    new Chart(ctx,{

        type:'doughnut',

        data:{
            labels:[
                'To Do',
                'In Progress',
                'UAT',
                'Code Review',
                'Done'
            ],

            datasets:[{
                data:[
                    ${todoCount},
                    ${progressCount},
                    ${testingCount},
                    ${codereviewCount},
                    ${doneCount}
                ],
                backgroundColor:[
                    '#ef4444',
                    '#3b82f6',
                    '#f59e0b',
                    '#f50bca',
                    '#10b981'
                ]
            }]
        },

        options:{
            responsive:true,
        
            maintainAspectRatio:false,
            cutout:'60%',
            plugins:{
                legend:{
                    position:'bottom'
                }
            }
        }
    });

});
    function renderDonutCharts(){

    var donutData = {
        overview: [
            ${assignedTickets},
            ${myOpenCount},
            ${closedTicketCount},
            
            ${pmProjectCount}
        ],
        myTickets: [
            ${assignedTickets},
            ${myOpenCount},
            ${closedTicketCount},
            
        ]
    };

    // MAIN DONUT
    var d = document.getElementById('donutChart');
    if(d){
        new Chart(d.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['My Assigned tickets','My Open tickets','My Closed tickets',' My Projects'],
                datasets: [{ data: donutData.overview }]
            },
            options: {
            responsive: true,
            cutout: '60%',
}
        });
    }

    // MY DONUT
    var md = document.getElementById('myTicketDonut');
    if(md){
        new Chart(md.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['My Tickets','My Open Tickets','My Closed Tickets'],
                datasets: [{ data: donutData.myTickets }]
            }
        });
    }

}
  document.addEventListener("DOMContentLoaded", function(){

    renderAllCharts();

});

function renderAllCharts(){

    renderPieCharts();
    renderDonutCharts();

}  
function openTickets(type){

    setPageTitle("Tickets");
document.getElementById("headerTitle").innerText = "RW Project Management Portal";
    document.getElementById("homeContent").style.display = "none";
    document.getElementById("loader").style.display = "block";

     let title = "Tickets";

    
    if(type === "assigned") title = "Assigned Tickets";
    else if(type === "open") title = "Open Tickets";
    else if(type === "allopen") title = "All Open Tickets";
    else if(type === "total") title = "Total Tickets";
else if(type === "closed") title = "Closed Tickets";
    let url = ticketUrl;
var frame = document.getElementById("mainFrame");


frame.style.display = "none";
frame.src = "";


frame.src = url;
    if(type){
        
        url += "&filter=" + type;
url += "&from=home";   // ✅ ADD THIS
        url += "&title=" + encodeURIComponent(title);  
       
    }

    document.getElementById("mainFrame").src = url;

    document.getElementById("projectContent").style.display = "block";
    toggleChartVisibility();
    togglePieVisibility();
}
// function hideLoader(){
//     document.getElementById("loader").style.display = "none";
//      document.getElementById("mainFrame").style.display = "block";
     
// }

     function hideLoader(){
    var frame = document.getElementById("mainFrame");

    document.getElementById("loader").style.display = "none";

    
    if(frame.src){
        frame.style.display = "block";
    }
}
function openHome(){
setPageTitle("Reachware Project Management");
document.getElementById("headerTitle").innerText = "RW Project Management Portal";
 document.getElementById("projectContent").style.display = "none";

document.getElementById("loader").style.display = "none"; 
document.getElementById("homeContent").style.display = "block";
var frame = document.getElementById("mainFrame");
    frame.src = "";              // clear old page
    frame.style.display = "none";
    toggleChartVisibility();
    togglePieVisibility();
    disableBackButton();
     // REFRESH PM DASHBOARD
    var shouldRefresh =
        sessionStorage.getItem('refreshDashboard');

    if(shouldRefresh === 'true'){

        sessionStorage.removeItem(
            'refreshDashboard'
        );

        location.reload();
    }
}
    
var loggedRoleName = "${loggedRoleName}";
var empRoleMap = ${JSON.stringify(empRoleMap)};
window.onload = function(){

    
    window.history.pushState(null, null, window.location.href);

    window.onpopstate = function () {
      // window.location.href = "https://2771600.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2872&deploy=1&compid=2771600&ns-at=AAEJ7tMQLCBxkbOlhRyShbsZSNh6QPuKL2rt00NN091SJ6hEFho";
      window.location.replace('${loginUrl}');
    };

}
    
   
/* LOGOUT FUNCTION */

//  function logout(){

// if(confirm("Are you sure you want to logout?")){


//   localStorage.clear();

    

//     localStorage.removeItem("email");
//     localStorage.removeItem("empId");
    
//     localStorage.removeItem("isLoggedIn");
//     localStorage.setItem("logout-event", Date.now());
    
// window.location.replace('${loginUrl}');
    
   

// }

//  }
// function logout(){

//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("empId");

//     sessionStorage.clear();

//     window.location.replace("${loginUrl}");
// }
document.title="RW Project Management Portal";
window.addEventListener('storage', function(event) {

    if (event.key === 'logout-event') {

        // Clear everything again (safety)
        localStorage.clear();

        // Redirect to login
        window.location.replace('${loginUrl}');
    }

});
var chartData = {
    labels: [
    "Total Projects",
    "Open Projects",
        
        "Kickoff",
        // "Business",
        // "Training",
        "UAT",
        "Go Live",
        "COC",
        // "Support",
        "Closed"
    ],
    values: [
        ${projectCount},
        ${openProjects},
        
        ${kickOffCount},
        // ${bussinesCount},
        // ${training},
        ${uatCount},
        ${golive},
        ${coc},
        // ${support},
        ${closedProjects}
    ]
};
var ctx = document.getElementById('statusChart').getContext('2d');

var statusChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: chartData.labels,
        datasets: [{
            label: 'Project Status Count',
            data: chartData.values,
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,

        onClick: function(evt, elements){

            if(elements.length > 0){

                var index = elements[0].index;
                var label = chartData.labels[index];

                // 🔥 redirect based on clicked bar
                if(label === "Total Projects"){
                    openProjects('total');
                }
                else if(label === "Open Projects"){
                    openProjects('open');
                }
                else if(label === "In Progress"){
                    openProjects('inprogress');
                }
                else if(label === "Kickoff"){
                    openProjects('kickof');
                }
                else if(label === "Business"){
                    openProjects('bussinessrequirement');
                }
                else if(label === "Training"){
                    openProjects('training');
                }
                else if(label === "UAT"){
                    openProjects('uat');
                }
                else if(label === "Go Live"){
                    openProjects('golive');
                }
                else if(label === "COC"){
                    openProjects('coc');
                }
                else if(label === "Support"){
                    openProjects('support');
                }
                else if(label === "Closed"){
                    openProjects('close');
                }
            }
        },

        plugins: {
            legend: {
                display: true
            }
        },

        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
function refreshDashboardCounts(){

    fetch('/app/site/hosting/scriptlet.nl?script=HOME_SCRIPT&deploy=1')

    .then(res => res.json())

    .then(data => {

        document.getElementById('openCount').innerText =
            data.open;

        document.getElementById('closedCount').innerText =
            data.closed;

        document.getElementById('projectCount').innerText =
            data.projects;

        document.getElementById('overdueCount').innerText =
            data.overdue;
    });

}
window.addEventListener('storage', function(event){

    if(event.key === 'dashboard-refresh'){

        refreshDashboardCounts();

    }

});

window.addEventListener('focus', function(){

    var shouldRefresh =
        sessionStorage.getItem('refreshDashboard');

    if(shouldRefresh === 'true'){

        sessionStorage.removeItem(
            'refreshDashboard'
        );

        window.location.reload();

    }

});

  
window.addEventListener(

    'notificationUpdated',

    function(){

        refreshNotifications();
    }
);

// AUTO REFRESH NOTIFICATIONS
setInterval(function(){

    refreshNotifications();

}, 3000);
// ============================
// REALTIME NOTIFICATION SYSTEM
// ============================

var lastNotificationCount = 0;

// START POLLING
setInterval(function(){

    refreshNotifications();

}, 2000);


// LOAD IMMEDIATELY
refreshNotifications();


// ============================
// REFRESH FUNCTION
// ============================

function refreshNotifications(){

    fetch('/app/site/hosting/scriptlet.nl?script=YOUR_SCRIPT_ID&deploy=1&action=getNotifications')

    .then(res => res.json())

    .then(data => {

        var badge =
            document.getElementById('notifCount');

        var container =
            document.getElementById('notifContainer');

        // =====================
        // UPDATE COUNT
        // =====================

        if(data.length > 0){

            badge.style.display = 'flex';
            badge.innerText = data.length;

        } else {

            badge.style.display = 'none';
        }

        // =====================
        // PLAY SOUND FOR NEW
        // =====================

        if(data.length > lastNotificationCount){

            var audio =
                new Audio(
                    'https://actions.google.com/sounds/v1/alarms/notification_simple-02.mp3'
                );

            audio.play();
        }

        lastNotificationCount = data.length;

        // =====================
        // BUILD HTML
        // =====================

        var html = '';

        if(data.length === 0){

            html =
                '<div class="notif-item no-notif" style="color:black;">No Notifications</div>';

        } else {

            data.forEach(function(n){

                html +=
                '<div class="notif-item">' +

                    '<div class="notif-text">' +
                        n.message +
                    '</div>' +

                    '<span class="notif-remove" onclick="removeNotification(' + n.id + ')">✖</span>' +

                '</div>';

            });
        }

        container.innerHTML = html;

    });
}
    setInterval(function(){

    fetch(window.location.href + '&action=getUnreadCount')

    .then(function(res){
        return res.text();
    })

    .then(function(count){

        var countEl =
            document.querySelector('.notif-count');

        if(!countEl) return;

        count = parseInt(count || '0');

        if(count > 0){

            countEl.style.display = 'flex';
            countEl.innerText = count;

        }else{

            countEl.style.display = 'none';
            countEl.innerText = '0';
        }
    });

}, 1000);

function toggleTimelineProjects(){

    var more =
        document.getElementById(
            'moreTimelineProjects'
        );

    var btn =
        document.getElementById(
            'timelineViewBtn'
        );

    if(more.style.display === 'none'){

        more.style.display = 'block';

        btn.innerHTML = 'View Less';

    }else{

        more.style.display = 'none';

        btn.innerHTML = 'View More';
    }
}
    let lastUnreadCount = ${unreadCount};

setInterval(function(){

    fetch(
        window.location.pathname +
        window.location.search +
        '&action=getUnreadCount'
    )

    .then(r => r.text())

    .then(count => {

        count = parseInt(count || 0);

        if(count > lastUnreadCount){

            const audio =
                document.getElementById(
                    'notifSound'
                );

            if(audio){

                audio.currentTime = 0;

                audio.play()
                .catch(err => {
                    console.log(
                        'Notification Sound Error',
                        err
                    );
                });
            }
        }

        lastUnreadCount = count;
    });

},5000);
function markAllNotificationsRead(){

    fetch(
        window.location.href +
        '&action=markRead'
    ).then(()=>{
        loadNotifications();
        loadNotificationCount();
    });
}
    function closeNotifications(event){

    event.stopPropagation();

    document
        .getElementById('notifDropdown')
        .style.display = 'none';
}
        function refreshNotifications(){

    fetch(
        window.location.pathname +
        '?action=getUnreadCount' +
        '&empid=' + empId
    )
    .then(r => r.text())
    .then(count => {

        const badge =
            document.querySelector('.notif-count');

        if(!badge) return;

        badge.innerText = count;

        badge.style.display =
            Number(count) > 0
            ? 'flex'
            : 'none';
    });

    loadNotifications();
}
    function allowDrop(ev){
    ev.preventDefault();
}

function drag(ev){

    const card = ev.target;

    if(card.classList.contains('done-ticket')){
        ev.preventDefault();
        return false;
    }

    ev.dataTransfer.setData(
        "ticketid",
        card.dataset.ticketid
    );
}
 function updateTicketStatus(ticketId,statusId){

  fetch(
    window.location.href.split('&action=')[0] +
    '&action=updateTicketStatus' +
    '&ticketid=' + ticketId +
    '&statusid=' + statusId
)
    .then(function(response){
        return response.text();
    })
    .then(function(result){

        console.log('Status Update Result:', result);

        if(result === 'success'){

            location.reload();

        }else{

            alert('Status update failed');
        }
    })
    .catch(function(err){

        console.error(err);

        alert('Error updating ticket');
    });
}
function allowDrop(ev){
    ev.preventDefault();
}

function drop(ev,statusId){

    ev.preventDefault();

    var ticketId =
        ev.dataTransfer.getData('ticketid');

    console.log(
        'Dropped Ticket:',
        ticketId,
        'Status:',
        statusId
    );

    if(!ticketId){
        alert('Ticket ID missing');
        return;
    }

    fetch(
        window.location.pathname +
        '?action=updateTicketStatus' +
        '&ticketid=' + ticketId +
        '&statusid=' + statusId
    )
    .then(r => r.text())
    .then(function(res){

        console.log('Response:',res);

        location.reload();

    })
    .catch(function(err){

        console.log(err);

    });
}
    function drag(ev){

    const ticketCard =
        ev.currentTarget;

    const ticketId =
        ticketCard.getAttribute(
            'data-ticketid'
        );

    ev.dataTransfer.effectAllowed =
        'move';

    ev.dataTransfer.setData(
        'text/plain',
        ticketId
    );

    console.log(
        'Dragging',
        ticketId
    );
}

function allowDrop(ev){

    ev.preventDefault();

    ev.dataTransfer.dropEffect =
        'move';
}

function drop(ev,statusId){

    ev.preventDefault();

    const ticketId =
        ev.dataTransfer.getData(
            'text/plain'
        );

    console.log(
        'Dropped',
        ticketId,
        statusId
    );

    if(!ticketId){
        alert(
            'Ticket ID not found'
        );
        return;
    }

    updateTicketStatus(
        ticketId,
        statusId
    );
}
   function refreshNotificationBell(){

    fetch(window.location.pathname +
        '?action=getUnreadCount' +
        '&empid=' + empId)

    .then(response => response.text())

    .then(function(count){

        document.getElementById('notifCount')
            .innerHTML = count;

    });

}
    function loadLatestNotifications(){

    fetch(window.location.pathname +
        '?action=getNotifications' +
        '&empid=' + empId)

    .then(r => r.text())

    .then(function(html){

        document.getElementById('notificationList')
            .innerHTML = html;

    });

}
   window.addEventListener('storage', function(e){

    if(e.key === 'notification_refresh'){

        refreshNotificationBell();

        loadLatestNotifications();
    }

});
function setActiveMenu(menu){

    localStorage.setItem("activeMenu", menu.id);

    document.querySelectorAll(".menu").forEach(function(item){
        item.classList.remove("active");
    });

    menu.classList.add("active");
}
    window.onload = function(){

    var active = localStorage.getItem("activeMenu");

    if(active){
        var menu = document.getElementById(active);

        if(menu){
            menu.classList.add("active");
        }
    }

};
</script>

`;

htmlField.defaultValue = html;

context.response.writePage(form);

};

return { onRequest };

});