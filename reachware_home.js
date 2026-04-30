/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/url','N/search','N/runtime'], (serverWidget,url,search,runtime) => {

const onRequest = (context) => {

var empId = context.request.parameters.empid;
var email = context.request.parameters.email;
var empInternalId = getEmployeeInternalId(email);

function getTotalCount(){
    var projectSearch = search.create({
        type:'customrecord_rw_portal_access',
        filters:[],
        columns:[],
        
    })
    var count =projectSearch.runPaged().count;
    log.debug("Total project",count);
    return count;
}
function getPMProjectCount(empId){

    if(!empId) return 0;

    var projectSearch = search.create({
        type: 'customrecord_rw_portal_access',
        filters: [
            ['custrecord_rw_portal_projectmanager','anyof', empId]
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
            ['custrecord_rw_portal_status','anyof',['6']]
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
            ['custrecord_rw_portal_status','anyof','8']
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
            ['custrecord_rw_portal_status','anyof','3']
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
            ['custrecord_rw_portal_status','anyof','9']
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
            ['custrecord_rw_portal_status','is','10']
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
    var projectSearch=search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['custrecord_rw_portal_status','noneof','5']
        ]
    })
    var count=projectSearch.runPaged().count;
    log.debug("Total open projects",count);
    return count;
}
function getClosedProjectCount(){
    var projectSearch=search.create({
        type:'customrecord_rw_portal_access',
        filters:[
            ['custrecord_rw_portal_status','anyof','5']
        ]
    })
    var count=projectSearch.runPaged().count;
    log.debug("Total open projects",count);
    return count;
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
var openTicketCount=getOpenTicketCount();
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

    return '';   // fallback
}
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
            ['custrecord_rw_ticket_priority','anyof','1'] // ⚠️ adjust if needed
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
var golive=getGoliveCount();
var coc=getCOCCount();
var pmProjectCount = getPMProjectCount(empId);
var support=getSupportCount();
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
    empRole =  'Administrator';
}
function getCurrentGoLiveProducts(){

    var products = [];

    var searchObj = search.create({
        type: 'customrecord_rw_portal_access2',
        filters: [
            ['custrecord1513.custrecord_rw_portal_status','anyof','9'] // Go-Live
        ],
        columns: [
            'custrecord_rw_portal_rwproduct'
        ]
    });

    searchObj.run().each(function(result){

        var product = result.getText('custrecord_rw_portal_rwproduct');

        if(product && !products.includes(product)){
            products.push(product); // avoid duplicates
        }

        return true;
    });

    return products;
}
var roleType = getRoleType(empRole);
log.debug(empRole)
let statsHeader = '';
let statsValues = '';
var empInternalId = getEmployeeInternalId(email);

var dmsRole = getEmployeeDMSRole(empInternalId);
var roleType = getRoleTypeFromDMS(dmsRole);

log.debug("DMS ROLE", dmsRole);
log.debug("ROLE TYPE", roleType);
if(roleType === 'PMO'){
    statsHeader = `
        <div>Total Projects</div>
        <div>Open Projects</div>
        <div>In Progress</div>
        
        <div>Kickoff</div>
        <div>Business requirement</div>
        <div>Training</div>
        <div>UAT</div>
        <div>Go live</div>
        <div>COC</div>
        <div>Support</div>
        <div>Closed Projects</div>
    `;

   statsValues = `
    <div class="data-val" id="tit" onclick="openProjects('total')">${projectCount}</div>
    <div class="data-val" id="tit" onclick="openProjects('open')">${openProjects}</div>
    <div class="data-val" id="tit" onclick="openProjects('inprogress')">${inProgressCount}</div>
   
    <div class="data-val" id="tit" onclick="openProjects('kickof')">${kickOffCount}</div>
    <div class="data-val" id="tit" onclick="openProjects('bussinessrequirement')">${bussinesCount}</div>
    <div class="data-val" id="tit" onclick="openProjects('training')">${training}</div>
    <div class="data-val" id="tit" onclick="openProjects('uat')">${uatCount}</div>
    <div class="data-val" id="tit" onclick="openProjects('golive')">${golive}</div>
    <div class="data-val" id="tit" onclick="openProjects('coc')">${coc}</div>
    <div class="data-val" id="tit" onclick="openProjects('support')">${support}</div>
     <div class="data-val" id="tit" onclick="openProjects('close')">${closedProjects}</div>
`;
}
else if(roleType === 'PM'){
    statsHeader = `
        <div>Total projects</div>
        
        <div>Open projects</div>
        <div>In Progress</div>
        <div>Total Tickets</div>
        <div>Total Open Tickets</div>
        <div>My Projects</div>
        <div>Assigned Tickets</div>
        <div>Open Tickets</div>
        <div>Closed Projects</div>
        
        
    `;

    statsValues = `
        <div class="data-val" id="tit" onclick="openProjects('total')">${projectCount}</div>
        
        <div class="data-val" id="tit" onclick="openProjects('open')">${openProjects}</div>
        <div class="data-val" id="tit" onclick="openProjects('inprogress')">${inProgressCount}</div>
        <div class="data-val" id="tit" onclick="openTickets('total')">${totalTickets}</div>
        <div class="data-val" id="tit" onclick="openTickets('allopen')">${openTicketCount}</div>
        <div class="data-val" id="tit" onclick="openProjects('myprojects')">${pmProjectCount}</div>
        <div class="data-val" id="tit" onclick="openTickets('assigned')">${assignedTickets}</div>
        <div class="data-val" id="tit" onclick="openTickets('open')">${myOpenCount}</div>
         <div class="data-val" id="tit" onclick="openProjects('close')">${closedProjects}</div>
        
    `;
}
else if(roleType === 'DEV'){
    statsHeader = `
        <div>Assigned Tickets</div>
        <div>Open Tickets</div>
    `;

    statsValues = `
       <div class="data-val" id="tit" onclick="openTickets('assigned')">${assignedTickets}</div>
    
    <div class="data-val" id="tit" onclick="openTickets('open')">${myOpenCount}</div>
    `;
}
else{
     statsHeader = `
        <div>Assigned Tickets</div>
        <div>Open Tickets</div>
        <div>Total Tickets</div>
    `;

    
    statsValues = `
    <div class="data-val" id="tit" onclick="openTickets('assigned')">${assignedTickets}</div>
    <div class="data-val" id="tit" onclick="openTickets('open')">${myOpenCount}</div>
    <div class="data-val"  id="tit" onclick="openTickets('total')">${totalTickets}</div>
`;
}
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
            background:#6f3ba2;
            color:white;
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
            <div style="max-height:200px; overflow-y:auto;">

                ${highPriorityTickets.map(t => `
                    <div style="
                        display:flex;
                        justify-content:space-between;
                        padding:6px 0;
                        border-bottom:1px solid #eee;
                        font-size:13px;
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
var avatarLetter = (empRole && empRole.length > 0) 
    ? empRole.charAt(0).toUpperCase() 
    : 'U';

var ticketMenu = '';

if (roleType !== 'PMO') {
    ticketMenu = `<div class="menu" onclick="openTickets(); closeMenu()">Tickets</div>`;
}
function getCurrentMonthDates(){
    var today = new Date();

    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return { firstDay, lastDay };
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
var uatCustomers = getCustomersByStatus('3');
var goliveCustomers = getCustomersByStatus('9');
var cocCustomers = getCustomersByStatus('10');

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
            var d = date.getDate();
            var m = date.getMonth() + 1;
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
    ['custrecord_rw_portal_status','anyof', statusId],   // ✅ ADD THIS
    'AND',
    ['custrecord_rw_portal_customername.custentity_rw_emp_port_access','is','T'],
    'AND',
    [fieldId, 'isnotempty', '']
];

        if(type === 'current'){
            filters.push('AND', [fieldId, 'within', start, end]);
        }

        if(type === 'upcoming'){
            filters.push('AND', [fieldId, 'after', todayStr]);
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
// 🔹 Start Date Cards
// UAT
var uatCurrent = getCustomersByDate('custrecord_rw_portal_start_date','current','3');
var uatUpcoming = getCustomersByDate('custrecord_rw_portal_end_date','upcoming','3');

// GoLive
var goliveCurrent = getCustomersByDate('custrecord_rw_portal_start_date','current','9');
var goliveUpcoming = getCustomersByDate('custrecord_rw_portal_end_date','upcoming','9');
// COC (status-based)
var cocCurrent = getCustomersByDate('custrecord_rw_portal_end_date','current','10'); 
var cocUpcoming = []; // optional if you have date field
log.debug("UAT CURRENT DATA", uatCurrent);
log.debug("GOLIVE CURRENT DATA", goliveCurrent);
log.debug("COC CURRENT DATA", cocCurrent);

function getOverdueTickets(){

    var tickets = [];

    var ticketSearch = search.create({
        type: 'customrecord_rw_ticket',
        filters: [
            ['custrecord_rw_ticket_overduedays','isnotempty',''] // ✅ only overdue
        ],
        columns: [
            'custrecord_rw_ticket_ticketno',
            'custrecord_rw_ticket_overduedays'
        ]
    });

    ticketSearch.run().each(function(result){

        tickets.push({
            number: result.getValue('custrecord_rw_ticket_ticketno'),
            days: result.getValue('custrecord_rw_ticket_overduedays')
        });

        return true;
    });

    return tickets;
}
function buildCard(title, currentList, upcomingList){

    currentList = currentList || [];   // ✅ FIX
    upcomingList = upcomingList || []; // ✅ FIX

    var currentHtml = currentList.length 
        ? currentList.map(c => `<li>${c}</li>`).join('')
        : '<li>No data</li>';

    var upcomingHtml = upcomingList.length 
        ? upcomingList.map(c => `<li>${c}</li>`).join('')
        : '<li>No data</li>';

    return `
        <div class="card">
            <h3>${title}</h3>

            <h4 style="color:#6b3fa0;">Current Month</h4>
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
            <h3>${title} (${count})</h3>

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

    ${buildSingleCard('UAT - Current Month', uatCurrent)}
    ${buildSingleCard('UAT - Upcoming', uatUpcoming)}

    ${buildSingleCard('Go Live - Current Month', goliveCurrent)}
    ${buildSingleCard('Go Live - Upcoming', goliveUpcoming)}
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
                font-weight:bold;
                border-bottom:2px solid #ddd;
                padding-bottom:5px;
                font-size:13px;
            ">
                Product Name
            </div>

            <!-- DATA -->
            <div style="max-height:200px; overflow-y:auto;">

                ${goLiveProducts.map(p => `
                    <div style="
                        padding:6px 0;
                        border-bottom:1px solid #eee;
                        font-size:13px;
                    ">
                        ${p}
                    </div>
                `).join('')}

            </div>

        </div>

    </div>

</div>
`;
var overdueTickets =getOverdueTickets();
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
        ">
            <span>Ticket No</span>
            <span>Days</span>
        </div>

        <div style="max-height:200px; overflow-y:auto;">

            ${overdueTickets.map(t => `
                <div style="
                    display:flex;
                    justify-content:space-between;
                    padding:6px 0;
                    border-bottom:1px solid #eee;
                    font-size:13px;
                ">
                    <span>${t.number}</span>
                    <span style="color:red; font-weight:bold;">
                        ${t.days}
                    </span>
                </div>
            `).join('')}

        </div>

    </div>

</div>
</div>
`;
function getOverdueProjects(){

    var projects = [];

    var today = new Date();

    var searchObj = search.create({
        type: 'customrecord_rw_portal_access2',
        filters: [
            ['custrecord_rw_portal_updateddeadline','before','today'] // ✅ overdue
        ],
        columns: [
            'custrecord_rw_portal_rwproduct',
            'custrecord_rw_portal_durationline'
        ]
    });

    searchObj.run().each(function(result){

        var product = result.getText('custrecord_rw_portal_rwproduct');
        var duration = result.getValue('custrecord_rw_portal_durationline');

        if(product){
            projects.push({
                product: product,
                duration: duration || 0
            });
        }

        return true;
    });

    return projects;
}
var overdueProjects =getOverdueProjects();
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
        background:#6f3ba2;
        color:white;
        padding:10px;
        font-weight:bold;
        font-size:14px;
    ">
         Overdue Projects
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
                    font-size:13px;
                ">
                    <span>${p.product}</span>
                    <span style="color:red; font-weight:bold;">
                        ${p.duration ? p.duration + 'days' : '-'}
                    </span>
                </div>
            `).join('')}

        </div>

    </div>

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
    border-bottom : 1px solid #ddd;

    
    
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
}

.card-row .proj{
    flex:0.7;
    color:#6b3fa0;
    font-weight:600;
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
    color:#6b3fa0;
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
    font-weight:600;
    color:white;

    background: linear-gradient(135deg, #6b3fa0, #8e5cd9);
}

/* SECTION TITLE */
.card h4{
    margin:10px 15px 5px;
    font-size:13px;
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
}

/* scrollbar (optional nice touch) */
.card ul::-webkit-scrollbar{
    width:5px;
}
.card ul::-webkit-scrollbar-thumb{
    background:#6b3fa0;
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
  background:#E6E6FA;
  color:black;
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

.stats-header,
.stats-values {
    display: flex;
    width: 100%;
    transition:all 0.3s ease;

}

.stats-header div,
.stats-values div {
    flex: 1;   

    display: flex;
    justify-content: center;
    align-items: center;
transition:all 0.3s ease;
    text-align: center;
}

/* Optional styling */
.stats-header div {
    background: #6b3fa0;
    color: white;
    padding: 10px;
}

.stats-values div {
    padding: 15px;
    border: 1px solid #ccc;
    font-size: 18px;
}


.header{
    background:#6b3fa0;
    color:white;
    height:60px;
    padding:0 20px;
    display:flex;
    align-items:center;
}
/* Left */
.left-section{
    flex:1;
}

/* Center */
.center-section{
    flex:2;
    text-align:center;
    font-size:18px;
    font-weight:bold;
    
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

    background: #1667a5;
    color: white;

    overflow: hidden;
    transition: 0.3s;

    z-index: 9999;          
}

.menu{
padding:12px;
border-bottom:1px solid #0c4f82;
cursor:pointer;
}

.menu:hover{
background:#0f4e80;
}


    .content{
    flex: 1;
    padding: 0 20px;

    height: auto;        /* 🔥 REMOVE FIXED HEIGHT */
    overflow: visible;   /* 🔥 NO SCROLL, NO CUT */
}
.con{


margin-top:-36px;
margin-left:-20px;
margin-right:-20px;
padding-right:-20px;

}
.stats-header{
display:grid;
grid-template-columns: repeat(6,1fr);
background:#6b3fa0;
color:white;
}
.stats-header, .stats-values {
    display: flex;
    flex-wrap: nowrap;   
    width: 100%;
}

.stats-header div,
.stats-values div {
    flex: 1;
    width:100%;
    

    display: flex;              
    justify-content: center;    
    align-items: center;        

    text-align: center;
}
.stats-header div{
padding:10px;
text-align:center;
border-right:1px solid white;
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
 .stats-container{
    display: inline-flex;
    flex-direction: column;
}

.stats-header,
.stats-values{
    display: flex;
    flex-wrap: nowrap;
    width:100%;
}

.stats-header div,
.stats-values div{
    
    flex: 1;

    display: flex;
    justify-content: center;
    align-items: center;
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
border:1px solid #ccc;
font-size:20px;
}

.right-section{
    display:flex;
    align-items:center;
    gap:10px;
}
.role-text{
    font-size:12px;
    font-weight:bold;
    background:white;
    border-radius:20px;
    padding:6px 15px;
        color:#6b3fa0;
}
        .role-text:hover{
        background:#1667a5;
        color :white;
        }

/* REMOVE absolute positioning */
.logout{
    position:static;   
    background:#6b3fa0;
    border:1px solid white;
    padding:6px 15px;
    color:white;
    cursor:pointer;
}
    
.logout:hover{
background:white;
color:#6b3fa0;
font-weight:bold;

}
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

    background: #6b3fa0;
    color: white;

    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: bold;
    font-size: 14px;
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
    margin-bottom:10px;
    color:#6f3ba2;
}

.chart-body{
    width:100%;
    height:350px;
}


.card ul{
    padding-left:20px;
    max-height:none;   /* 🔥 remove limit */
    overflow:visible;  /* 🔥 no scroll */
}
</style>
<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<div class="con" sytle="width:100%;margin:0;padding:0;background:pink;">
<div class="header">

    <div class="left-section">
        <div class="menu-icon" onmouseover="openMenu()">☰</div>
    </div>

    <div class="center-section" id="headerTitle">
        Reachware Project Management Portal
    </div>

    <div class="right-section">
        <span class="role-text"> ${dmsRole || empRole}</span>
        <button class="logout" onclick="logout()">Logout</button>
    </div>

</div>

<div class="container" style="display: flex; flex-direction: row;">

<div class="sidebar" id="sidebar" onmouseleave="closeMenu()">

<div class="menu" onclick="openHome()">Home</div>
<div class="menu" onclick="openProjects(); closeMenu()">Projects</div>
${ticketMenu}


</div>

<div class="content">

<div id="projectContent" style="display:none;width:100%;height:100%;">

  <iframe id="mainFrame"
        style="
        width:100%;
        height:100%;
        border:none;
        display:none;
        margin-top:60px;
        position:absolute;
        top:0;
        left:0;
        background:white;
        overflow-y:hidden;
        
        "
        onload="hideLoader()">
</iframe>
</div>

<div id="homeContent" style="margin-top:40px;">

<div class="stats-container">

    <div class="stats-header">
        ${statsHeader}
    </div>

    <div class="stats-values">
        ${statsValues}
    </div>

</div>
${roleType === 'PMO' ? specialCards : ''}
${roleType === 'PM' ? `
<div style="display:flex; gap:20px; margin:10px;">
    ${highPriorityCard}
    ${goLiveCard}
    ${overdueProjectCardInner}
     ${overdueCardInner}
</div>
` : ''}
</div>
${chartHtml}
${(roleType === 'PM') ? pieChartCard : ''}
</div>

</div>

</div>

<div id="loader">
    <div class="spinner"></div>
    <p>Opening...</p>
</div>
<script>

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace('${loginUrl}');
}
if (!localStorage.getItem("isLoggedIn")) {
   
window.location.replace('${loginUrl}');
   }
    // Prevent back button completely
window.history.pushState(null, null, window.location.href);

window.onpopstate = function () {
  
window.location.replace('${loginUrl}');
   };
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

new Chart(document.getElementById('projectPie'), {
    type: 'pie',
    data: {
        labels: ['Total Projects', 'Open Projects', 'In Progress Projects', 'Closed Projects'],
        datasets: [{
            data: [${projectCount}, ${openProjects}, ${inProgressCount}, ${closedProjects}],
        }]
    }
});

new Chart(document.getElementById('ticketPie'), {
    type: 'pie',
    data: {
        labels: ['Total Tickets', 'Open Tickets', 'Closed Tickets'],
        datasets: [{
            data: [${totalTickets}, ${openTicketCount}, ${totalTickets - openTicketCount}],
        }]
    }
});

new Chart(document.getElementById('myPie'), {
    type: 'pie',
    data: {
        labels: ['My Projects', 'Assigned Tickets', 'My Open Tickets'],
        datasets: [{
            data: [${pmProjectCount}, ${assignedTickets}, ${myOpenCount}],
        }]
    }
});

function openProjectView(projectId){

    setPageTitle("Project Details");
    document.getElementById("headerTitle").innerText = "Project Details";

    document.getElementById("homeContent").style.display = "none";
    document.getElementById("loader").style.display = "block";

    let url = viewProjectUrl;

    // 👇 pass projectId + mode=view
    url += "&projectId=" + projectId;
    url += "&mode=view";

    document.getElementById("mainFrame").src = url;
    document.getElementById("projectContent").style.display = "block";

    toggleChartVisibility();
}
function openMenu(){
    document.getElementById("sidebar").style.width="180px";
    
}

function closeMenu(){
    document.getElementById("sidebar").style.width="0";
}
function setPageTitle(title){
    document.title = title + " | Reachware";
}
var projectUrl = '${projectUrl}';
var ticketUrl ='${ticketUrl}';
var taskUrl ='${taskUrl}';
function openProjects(){
setPageTitle("Projects");
document.getElementById("headerTitle").innerText = "Reachware Project Management Portal";
 document.getElementById("homeContent").style.display = "none";
document.getElementById("loader").style.display = "block"; 
document.getElementById("mainFrame").src = projectUrl  ;
document.getElementById("projectContent").style.display = "block";
toggleChartVisibility();


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
function openProjects(type){

    setPageTitle("Projects");
document.getElementById("headerTitle").innerText = "Reachware Project Management Portal";
    document.getElementById("homeContent").style.display = "none";
    document.getElementById("loader").style.display = "block";

     let title = "Projects";

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
url += "&from=home";   // ✅ ADD THIS
        url += "&title=" + encodeURIComponent(title);  
    }

    document.getElementById("mainFrame").src = url;

    document.getElementById("projectContent").style.display = "block";
    toggleChartVisibility();
    togglePieVisibility();
}
    document.addEventListener("DOMContentLoaded", function(){
    toggleChartVisibility();
    togglePieVisibility();   // ✅ ADD THIS
});
function openTasks(){
alert("task are opening");
setPageTitle("Task");
document.getElementById("headerTitle").innerText = "Reachware Ticketing APP - Task";
 document.getElementById("homeContent").style.display = "none";
document.getElementById("loader").style.display = "block"; 
document.getElementById("mainFrame").src = taskUrl  ;
document.getElementById("projectContent").style.display = "block";
}
// function openTickets(){
// setPageTitle("Tickets");
// document.getElementById("headerTitle").innerText = "Reachware Ticketing APP - ISSUE";
//  document.getElementById("homeContent").style.display = "none";
// document.getElementById("loader").style.display = "block"; 
// document.getElementById("mainFrame").src = ticketUrl  ;
// document.getElementById("projectContent").style.display = "block";
// }
function openTickets(type){

    setPageTitle("Tickets");
    document.getElementById("headerTitle").innerText = "Reachware Ticketing APP - ISSUE";

    document.getElementById("homeContent").style.display = "none";
    document.getElementById("loader").style.display = "block";
let title = "Tickets";

    if(type === "assigned") title = "Assigned Tickets";
    else if(type === "open") title = "Open Tickets";
    else if(type === "allopen") title = "All Open Tickets";
    else if(type === "total") title = "Total Tickets";

    let url = ticketUrl;
    
var frame = document.getElementById("mainFrame");


frame.style.display = "none";
frame.src = "";


frame.src = url;
    if(type){
       url += "&filter=" + type;
        url += "&title=" + encodeURIComponent(title);
url += "&empid=" + localStorage.getItem("empId");   
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
setPageTitle("Home");
document.getElementById("headerTitle").innerText = "Reachware Project Management Portal";
 document.getElementById("projectContent").style.display = "none";

document.getElementById("loader").style.display = "none"; 
document.getElementById("homeContent").style.display = "block";
var frame = document.getElementById("mainFrame");
    frame.src = "";              // clear old page
    frame.style.display = "none";
    toggleChartVisibility();
    togglePieVisibility();
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

 function logout(){

if(confirm("Are you sure you want to logout?")){


  localStorage.clear();

    

    localStorage.removeItem("email");
    localStorage.removeItem("empId");
    
    localStorage.removeItem("isLoggedIn");
    localStorage.setItem("logout-event", Date.now());
    
window.location.replace('${loginUrl}');
    
   

}

 }
document.title="Reachware Project Management Portal";
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
        "In Progress",
        "Kickoff",
        "Business",
        "Training",
        "UAT",
        "Go Live",
        "COC",
        "Support",
        "Closed"
    ],
    values: [
        ${projectCount},
        ${openProjects},
        ${inProgressCount},
        ${kickOffCount},
        ${bussinesCount},
        ${training},
        ${uatCount},
        ${golive},
        ${coc},
        ${support},
        ${closedProjects}
    ]
};
var ctx = document.getElementById('statusChart').getContext('2d');

new Chart(ctx, {
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
</script>

`;

htmlField.defaultValue = html;

context.response.writePage(form);

};

return { onRequest };

});