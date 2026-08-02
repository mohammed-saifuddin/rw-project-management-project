/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search'], (search) => {

    function onRequest(context) {


        var projects = [];
        var filterType = context.request.parameters.filters;
        var projectSearch = search.create({

            type: "customrecord_rw_portal_access",

            filters: [
                ["isinactive", "is", "F"]
            ],

            columns: [

                "internalid",

               

                "custrecord_rw_portal_customername",

                "custrecord_rw_portal_status",

                "custrecord_rw_portal_start_date",

                "custrecord_rw_portal_end_date",

                "custrecord_rw_portal_duration",

                "custrecord_rw_portal_scheduledgolivedate",

                "custrecord_rw_portal_projectmanager",
                "custrecord_rw_portal_accountmanager",
                "custrecord_rw_portal_pmocommnts",
                "custrecord_rw_portal_functional_consulta",
                "custrecord_rw_portal_technical"


            ]

        });
        if (filterType === "open") {

    filters.push("AND");
    filters.push([
        "custrecord_rw_portal_status",
        "noneof",
        ["6","7","8"]
    ]);

}
else if (filterType === "done" || filterType === "close") {

    filters.push("AND");
    filters.push([
        "custrecord_rw_portal_status",
        "anyof",
        ["6","7","8"]
    ]);

}
else if (filterType === "inprogress") {

    filters.push("AND");
    filters.push([
        "custrecord_rw_portal_status",
        "anyof",
        "2"
    ]);

}
else if (filterType === "kickoff") {

    filters.push("AND");
    filters.push([
        "custrecord_rw_portal_status",
        "anyof",
        "1"
    ]);

}
else if (filterType === "uat") {

    filters.push("AND");
    filters.push([
        "custrecord_rw_portal_status",
        "anyof",
        "4"
    ]);

}
else if (filterType === "golive") {

    filters.push("AND");
    filters.push([
        "custrecord_rw_portal_status",
        "anyof",
        "5"
    ]);

}
else if (filterType === "coc") {

    filters.push("AND");
    filters.push([
        "custrecord_rw_portal_status",
        "anyof",
        "6"
    ]);

}
else if (filterType === "support") {

    filters.push("AND");
    filters.push([
        "custrecord_rw_portal_status",
        "anyof",
        "11"
    ]);

}
function buildTicketMap() {

    var ticketMap = {};

    var ticketSearch = search.create({
        type: "customrecord_rw_ticket",
        columns: [
            "custrecord_rw_ticket_projectname",
            "custrecord_rw_ticket_rwsuiteapp",
            "custrecord_rw_ticket_ticketstatus"
        ]
    });

    ticketSearch.run().each(function(result){

        var customerId = result.getValue("custrecord_rw_ticket_projectname");
        var productId  = result.getValue("custrecord_rw_ticket_rwsuiteapp");
        var status     = result.getText("custrecord_rw_ticket_ticketstatus");

        if(!ticketMap[customerId]){
            ticketMap[customerId] = {
                total:0,
                open:0,
                closed:0,
                products:{}
            };
        }

        ticketMap[customerId].total++;

        if(status === "Done"){
            ticketMap[customerId].closed++;
        }else{
            ticketMap[customerId].open++;
        }

        if(productId){

            if(!ticketMap[customerId].products[productId]){
                ticketMap[customerId].products[productId]={
                    total:0,
                    open:0,
                    closed:0
                };
            }

            ticketMap[customerId].products[productId].total++;

            if(status === "Closed"){
                ticketMap[customerId].products[productId].closed++;
            }else{
                ticketMap[customerId].products[productId].open++;
            }
        }

        return true;
    });

    return ticketMap;
}
var ticketMap = buildTicketMap();

        projectSearch.run().each(function(result){

    var projectId = result.getValue("internalid");
var customerId = result.getValue("custrecord_rw_portal_customername");
    // Count Products
    var products = [];
    var projectTicket = ticketMap[customerId] || {
    total: 0,
    open: 0,
    closed: 0,
    products: {}
};




var productSearch = search.create({

    type: "customrecord_rw_portal_access2",

    filters: [
        ["isinactive","is","F"],
        "AND",
        ["custrecord1513","anyof",projectId]
    ],

    columns: [

        "custrecord_rw_portal_rwproduct",
        "custrecord_rw_portal_projstat",
        "custrecord_rw_portal_additionalcomments",
        "custrecord_rw_portal_startdateline",
        "custrecord_rw_portal_enddateline",
        "custrecord_rw_portal_updateddeadline",
        "custrecord_rw_portal_durationline",
        "custrecord_rw_portal_funcconsultant",
        "custrecord_rw_portal_techconsultant"

    ]

});

productSearch.run().each(function(line){
 

   var productId = line.getValue("custrecord_rw_portal_rwproduct");

var productTicket =
    (ticketMap[customerId] &&
     ticketMap[customerId].products[productId])
        ? ticketMap[customerId].products[productId]
        : { total:0, open:0, closed:0 };

products.push({

    productId: productId,
    product: line.getText("custrecord_rw_portal_rwproduct"),
    status: line.getText("custrecord_rw_portal_projstat"),

    comments: line.getValue("custrecord_rw_portal_additionalcomments"),
    startDate: line.getValue("custrecord_rw_portal_startdateline"),
    endDate: line.getValue("custrecord_rw_portal_enddateline"),
    updatedEndDate: line.getValue("custrecord_rw_portal_updateddeadline"),
    duration: line.getValue("custrecord_rw_portal_durationline"),

    functionalConsultant: line.getText("custrecord_rw_portal_funcconsultant"),
    functionalId:line.getValue('custrecord_rw_portal_funcconsultant'),
    technicalId:line.getValue("custrecord_rw_portal_techconsultant"),
    technicalConsultant: line.getText("custrecord_rw_portal_techconsultant"),

 totalTickets: productTicket.total,
    openTickets: productTicket.open,
    closedTickets: productTicket.closed

});

    return true;

});
        

    

    projects.push({

        id: projectId,
          id: projectId,

    pm: result.getText("custrecord_rw_portal_projectmanager"),
    pmId: result.getValue("custrecord_rw_portal_projectmanager"),

    accountManagerId: result.getValue("custrecord_rw_portal_accountmanager"),
    techId:result.getValue("custrecord_rw_portal_technical"),
    funcId:result.getValue('custrecord_rw_portal_functional_consulta'),

        customerId:result.getValue("custrecord_rw_portal_customername"),

        customer: result.getText("custrecord_rw_portal_customername"),

        status: result.getText("custrecord_rw_portal_status"),

        statusId:result.getValue("custrecord_rw_portal_status"),

        startDate: result.getValue("custrecord_rw_portal_start_date"),

        endDate: result.getValue("custrecord_rw_portal_end_date"),

        duration: result.getValue("custrecord_rw_portal_duration"),

        goLive: result.getValue("custrecord_rw_portal_scheduledgolivedate"),

        pm: result.getText("custrecord_rw_portal_projectmanager"),
        pmoComments:result.getValue("custrecord_rw_portal_pmocommnts"),
        totalTickets: projectTicket.total,
    openTickets: projectTicket.open,
    closedTickets: projectTicket.closed,

       totalProducts: products.length,

    products: products

    });

    return true;
});

        context.response.setHeader({
            name: "Content-Type",
            value: "application/json"
        });

        context.response.write(JSON.stringify({

            success: true,

            count: projects.length,

            data: projects

        }));

    }

    return {
        onRequest: onRequest
    };

});