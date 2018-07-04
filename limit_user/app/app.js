$(document).ready(function() {
  app.initialized()
  .then(function(_client) {
    var client = _client;
    var limited_user;
    var freshdesk_domain;
    var freshdesk_key;
    var user;
    var available_fields;
    var auto_update_date_field = "";

    // get the settings from the iparams
    client.iparams.get().then (
      function(data) {
          //console.log(data);
          limited_user = data['limited_user'];
          freshdesk_domain = data['freshdesk_domain'];
          freshdesk_key = data['freshdesk_key'];
          if (data['auto_update_date_field'] != undefined ){
            auto_update_date_field = data['auto_update_date_field'];
          }
          available_fields = data['available_fields'].split(",");
      },
      function(error) {
        client.interface.trigger("showNotify", {type: "error", message: { title: "Error", description: "Error while trying to get the limited user"}});
      }
    );

    client.data.get("loggedInUser").then (
      function(data) {
        user = data['loggedInUser']['contact']['email'];
        //console.log("Logged in user is: " + data['loggedInUser']['contact']['email']);
        if (user == limited_user){
          //console.log("You are limited!");
          var baseUrl = "https://" + freshdesk_domain + ".freshdesk.com";
          var url = `${baseUrl}/api/v2/ticket_fields`;
          var options = {
            "headers" : {
              "Content-Type": "application/json",
              "Authorization": "Basic <%= encode(iparam.freshdesk_key + ':x') %>"
            }
          };
          //console.log(url);
          //console.log(options);
          client.request.get(url, options)
          .then(function(data) {
            //console.log(available_fields);
            if (data.status === 200) {
              var fieldList = JSON.parse(data.response);
              for(var field in fieldList) {
                //console.log(fieldList[field]);
                var name = fieldList[field]["name"];
                if (available_fields.indexOf(name) < 0){
                    client.interface.trigger("disable", {id: name});
                }
              }
            }
        }, function(error){
            //console.log("Error while trying to get the fields");
            client.interface.trigger("showNotify", {type: "error", message: { title: "Error", description: "Error while trying to get the fields"}});
        });
      }
      }, function(error) {
        client.interface.trigger("showNotify", {type: "error", message: { title: "Error", description: "Error while trying to get the current user"}});
      }
    );

    var eventCallback = function(event) {
        if (auto_update_date_field.length > 0){
          if(user == limited_user){
            event.helper.done();
            client.interface.trigger("setValue", {id: auto_update_date_field, value: new Date()});
          } else {
            event.helper.done();
          } 
        } else {
            event.helper.done();
        }
    };

    client.events.on("ticket.propertiesUpdated", eventCallback, {intercept: true});
  });
});
