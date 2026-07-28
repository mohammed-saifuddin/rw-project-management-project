/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define([
    'N/ui/serverWidget',
    'N/search',
    'N/url'
], function (serverWidget, search,url) {

    function onRequest(context) {
        var empId = context.request.parameters.empid 
         || context.request.parameters.empId 
         || context.request.parameters.employeeId 
         || '';

var email = context.request.parameters.email;
        function formatDate(dateStr) {

    var parts = dateStr.split("/");

    return parts[2] + "-" + parts[1] + "-" + parts[0];
}
var viewProjectUrl = url.resolveScript({
scriptId: 'customscript2892',
deploymentId: 'customdeploy1',
returnExternalUrl: true,
params: {
        empid: empId,
        email: email
    }
});
function getCalendarEvents(){

    var events = [];

    var projectSearch = search.create({

        type: "customrecord_rw_portal_access",

        filters:[
            ["isinactive","is","F"]
        ],

      columns: [
    "internalid",
    "custrecord_rw_portal_customername",
    "custrecord_rw_portal_status",

    "custrecord_rw_portal_start_date",
    "custrecord_rw_portal_scheduleduatdate",
    "custrecord_rw_portal_scheduledgolivedate",

    "custrecord_rw_portal_end_date"
]

    });

    projectSearch.run().each(function(result){

       var customer = result.getText("custrecord_rw_portal_customername");

var projectId = result.getValue("internalid");

var status = result.getText("custrecord_rw_portal_status");

var kickoffDate =
    result.getValue("custrecord_rw_portal_start_date");

var uatDate =
    result.getValue("custrecord_rw_portal_scheduleduatdate");

var goLiveDate =
    result.getValue("custrecord_rw_portal_scheduledgolivedate");

var endDate =
    result.getValue("custrecord_rw_portal_end_date");
log.debug("Project", customer);
    log.debug("Status", status);
    var eventDate = "";

var eventDate = "";

switch (status) {

    case "Kick Off":
        eventDate = kickoffDate;
        break;

    case "In Progress":
        eventDate = uatDate || goLiveDate;
        break;

    case "Completed":
        eventDate = goLiveDate || endDate;
        break;

    default:
        eventDate = goLiveDate;
}



if (eventDate) {

    events.push({

        id: projectId,
        customer: customer,
        title: customer,
        date: formatDate(eventDate),
        status: status,
        type: status.replace(/\s+/g, "").toLowerCase()

    });

}

        return true;

    });

    return JSON.stringify(events);

}
        if (context.request.method === "GET") {

            var form = serverWidget.createForm({
                title: " "
            });

            var htmlField = form.addField({
                id: "custpage_calendar",
                type: serverWidget.FieldType.INLINEHTML,
                label: "Calendar"
            });
var events = [];
           htmlField.defaultValue =
    getHTML(
        getCalendarEvents(),
        viewProjectUrl
    );

            context.response.writePage(form);

        }

    }

    function getHTML(events,viewProjectUrl){

        return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>Reachware Calendar</title>

<style>

body{

    margin:0;

    padding:0;
    margin-right:-20px;

    background:#f5f6fa;

    font-family:Arial,sans-serif;

}

.calendar-container{

    width:95%;
    

    margin:25px auto;

    background:#fff;

    border-radius:12px;

    overflow:hidden;

    box-shadow:0 10px 30px rgba(0,0,0,.15);

}

.calendar-header{

      background:#663399;
    color:#fff;

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:20px;

}

.calendar-header h2{

    margin:0;

}

.calendar-header button{

    border:none;

    background:#fff;

    color:#5b2ca8;

    width:40px;

    height:40px;

    border-radius:50%;

    cursor:pointer;

    font-size:18px;

}

.weekdays{

    display:grid;

    grid-template-columns:repeat(7,1fr);

    background:#ececec;

    text-align:center;

    font-weight:bold;

}

.weekdays div{

    padding:15px;

}

.days{

    display:grid;

    grid-template-columns:repeat(7,1fr);

}

.day{

    min-height:110px;

    border:1px solid #efefef;

    padding:8px;

    position:relative;

}

.day-number{

    font-weight:bold;

}

.event{

    margin-top:8px;

    padding:5px;

    border-radius:5px;

    color:#fff;

    font-size:12px;

}

.golive{

    background:#0d6efd;

}

.coc{

    background:#198754;

}

.uat{

    background:#ffc107;

    color:#000;

}

.kickoff{

    background:#8e44ad;

}

.training{

    background:#ff9800;

}

.legend{

    padding:15px;

    display:flex;

    gap:20px;

    border-top:1px solid #ddd;
    justify-content:center;

    flex-wrap:wrap;

}

.legend span{

    display:flex;

    align-items:center;

    gap:6px;

}

.box{

    width:15px;

    height:15px;

    border-radius:3px;

}
.today{

    background:#d9f2ff;

    border:2px solid #0d6efd;

}
    .popup{

    display:none;

    position:fixed;

    left:0;

    top:0;

    width:100%;

    height:100%;

    background:rgba(0,0,0,.4);

    z-index:9999;

}

.popup-content{

    width:420px;

    background:#fff;

    margin:80px auto;

    padding:25px;

    border-radius:10px;

    box-shadow:0 10px 25px rgba(0,0,0,.25);

}

.popup table{

    width:100%;

}

.popup td{

    padding:8px;

}

#closePopup{

    float:right;

    cursor:pointer;

    font-size:24px;

}

#openProject{

    width:100%;

    height:45px;

    border:none;

    background:#5b2ca8;

    color:white;

    border-radius:8px;

    cursor:pointer;

}
    .golive{
    background:#0d6efd;
}

.uat{
    background:#ffc107;
    color:#000;
}

.kickoff{
    background:#8e44ad;
}

.coc{
    background:#198754;
}

.inprogress{
    background:#ff9800;
}
    .notstarted{
    background:#17a2b8;
    color:#fff;
}
    h1{
    display:flex;
    justify-content:center;
    align-items:center;

    }
    .event:hover{
    background:#663399;
    color:white;
    }
    .completed{
    background:#28a745;
    color:#fff;
}

.done{
    background:#28a745;
    color:#fff;
}

.inprogress{
    background:#ffc107;
    color:#000;
}
    .event{
    cursor:pointer;
    transition:.2s;
}

.event:hover{
    transform:scale(1.03);
    box-shadow:0 3px 8px rgba(0,0,0,.2);
}
</style>

</head>

<body>
<h1>Project Calendar</h1>
<div class="calendar-container">

<div class="calendar-header">

<button type="button" id="prev">&#10094;</button>

<h2 id="monthYear"></h2>

<button type="button" id="next">&#10095;</button>

</div>

<div class="weekdays">

<div>Sun</div>

<div>Mon</div>

<div>Tue</div>

<div>Wed</div>

<div>Thu</div>

<div>Fri</div>

<div>Sat</div>

</div>

<div id="calendarDays" class="days"></div>

<div class="legend">
<div id="eventPopup" class="popup">

    <div class="popup-content">

        <span id="closePopup">&times;</span>

        <h2 id="popupTitle"></h2>

        <table>

            <tr>

                <td><b>Customer</b></td>

                <td id="popupCustomer"></td>

            </tr>

            <tr>

                <td><b>Event</b></td>

                <td id="popupEvent"></td>

            </tr>

            <tr>

                <td><b>Date</b></td>

                <td id="popupDate"></td>

            </tr>

            <tr>

                <td><b>Status</b></td>

                <td id="popupStatus"></td>

            </tr>


        </table>

        <br>

        <button id="openProject">

            Open Project

        </button>

    </div>

</div>
<span><div class="box" style="background:#0d6efd"></div>Go Live</span>

<span><div class="box" style="background:#198754"></div>COC</span>

<span><div class="box" style="background:#ffc107"></div>UAT</span>

<span><div class="box" style="background:#8e44ad"></div>Kickoff</span>

<span><div class="box" style="background:#ff9800"></div>In Progress</span>

<span><div class="box" style="background:#28a745"></div>Done</span>

</div>

</div>

<script>

const monthYear = document.getElementById("monthYear");

const calendarDays = document.getElementById("calendarDays");

let currentDate = new Date();

/* Sample Events
   In Part 3 these will come from NetSuite
*/

const calendarEvents = ${events};
console.log("events", calendarEvents);

const events = {};

calendarEvents.forEach(function(e){

    if(!events[e.date]){
        events[e.date] = [];
    }

    events[e.date].push(e);

});

var viewProjectUrl='${viewProjectUrl}';
function renderCalendar() {

    try {

        calendarDays.innerHTML = "";

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay =
            new Date(year, month, 1).getDay();

        const totalDays =
            new Date(year, month + 1, 0).getDate();

        monthYear.innerHTML =
            currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric"
            });

        for (let i = 0; i < firstDay; i++) {
            calendarDays.innerHTML += "<div></div>";
        }

        for (let day = 1; day <= totalDays; day++) {

            let fullDate =
                year + "-" +
                String(month + 1).padStart(2, "0") + "-" +
                String(day).padStart(2, "0");

            let eventHTML = "";

            console.log("Rendering:", fullDate, events[fullDate]);

            if (events[fullDate]) {

                events[fullDate].forEach(function (ev) {

                    try {

                       var borderClass = "";

if (ev.status == "Kick Off" || ev.status == "Started" || ev.status == "Not Started") {
    borderClass = "project-start";
}
else if (ev.status == "Completed" || ev.status == "Done") {
    borderClass = "project-completed";
}
else {
    borderClass = "project-ongoing";
}

eventHTML +=
    "<div class='event " + ev.type + " " + borderClass + "' " +
    "onclick='openProject(" + ev.id + ")'>" +
    "<b>" + ev.customer + "</b><br>" +
    "<small>" + ev.status + "</small>" +
    "</div>";
                    } catch (err) {

                        console.error("Error rendering event:", ev);
                        console.error(err);

                    }

                });

            }

            let todayClass = "";

            const today = new Date();

            if (
                today.getDate() == day &&
                today.getMonth() == month &&
                today.getFullYear() == year
            ) {
                todayClass = "today";
            }

            calendarDays.innerHTML +=
                "<div class='day " + todayClass + "'>" +
                "<div class='day-number'>" + day + "</div>" +
                eventHTML +
                "</div>";
        }

    } catch (e) {

        console.error("renderCalendar Error:", e);
        console.error(e.stack);
        

    }
}

        


document.getElementById("prev").addEventListener("click", function (e) {
    e.preventDefault();
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById("next").addEventListener("click", function (e) {
    e.preventDefault();
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});



renderCalendar();
function openProject(projectId){

    window.location.href =
        viewProjectUrl + "&projectId=" + projectId;

}
</script>

</body>

</html>

        `;

    }

    return {
        onRequest: onRequest
    };

});