# Limit User

This app permits you to define a specific user that can modify only a limited list of ticket properties.

The install procedure will ask you:

* the email address of the user you want to limit
* the Freshdesk domain (Eg. "dummy" if your Freshdesk domain is dummy.freshdesk.com
* the API key, the API key is needed to retrieve the list of ticket attributes
* available fields: a list of fields name (comma separated) that will be available for edit to the limited user
* Auto update date field (not required): a field name that will be auto-updated when the limited user will change one of the available fields. This field will be updated with the current date and time.
