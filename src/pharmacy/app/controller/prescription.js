Ext.define("RaxaEmr.Pharmacy.controller.prescription", {
    extend: 'Ext.app.Controller',
    
    views: ['Viewport', 'prescription', 'pharmacyTopbar', 'addFacility', 'goodsReceipt', 'listOfDrugs', 'newdrugform', 'pharmacyDetails', 
    'reports', 'addPatient', 'stockIssue', 'stockIssueGrid', 'goodReceiptGrid', 'goodReceipt', 'goodIssueText', 'goodIssuePop', 'goodIssue',
    'allStockPanel', 'allStockGrid', 'allStockForm', 'allStock', 'addDrug', 'allStock', 'prescribedDrugs'],
    
    stores: ['orderStore', 'Doctors', 'Identifiers', 'Locations', 'Patients', 'Persons', 'drugOrderPatient', 'drugOrderSearch', 'drugConcept', 'drugEncounter', 'allDrugs'],
    models: ['Address', 'Doctor', 'Identifier', 'Name', 'Patient', 'Person', 'drugOrderPatient', 'drugOrderSearch', 'drugOrder', 'drugEncounter'],
    
    init: function () {
        this.control({
            'prescription [action=addPatient]': {
                click: this.displayForm
            },
            "prescription button[action=done2]": {
                click: this.savePerson
            },
            'prescribedDrugs': {
                render: this.onEditorRender,
                edit: this.afterMovieEdit,
                drugEdit: this.onDrugEdit,
                drugDelete: this.onDrugDelete
            },
            'prescribedDrugs button': {
                click: this.addDrug
            },
            "prescription": {
                // as the perscription view activates it attaches listners to the 3 fields and 2
                // girds of advanced search
                activate: function(){
                    // below there listners call searchPatient() as enter key is pressed 
                    Ext.getCmp('patientNameASearch').on('specialkey', function(field, e){
                        if (e.getKey() == KEY.ENTER) {
                            this.searchPatient()
                        }
                    },this)
                    Ext.getCmp('prescriptionIdASearch').on('specialkey', function(field, e){
                        if (e.getKey() == KEY.ENTER) {
                            this.searchPatient()
                        }
                    },this)
                    Ext.getCmp('prescriptionDateASearch').on('specialkey', function(field, e){
                        if (e.getKey() == KEY.ENTER) {
                            this.searchPatient()
                        }
                    },this)
                    // listner on patient search results to show drugorders when a patient is selected
                    Ext.getCmp('patientASearchGrid').on('cellClick', function(){
                        this.patientSelect(Ext.getCmp('patientASearchGrid').getSelectionModel().getSelection()[0].getData())
                    },this)
                    // listner on perscription grid to show drugorder on main grid with more details
                    Ext.getCmp('drugOrderASearchGrid').on('cellClick', function(){
                        this.DrugOrderSelect(Ext.getCmp('drugOrderASearchGrid').getSelectionModel().getSelection()[0])
                    },this)
                }
            },
            // show patient search results when pressed
            'prescription button[action=back]': {
                click: this.goback
            }
        })
    },
    
    onEditorRender: function () {
        // cache a reference to the moviesEditor and rowEditor
        this.drugsEditor = Ext.ComponentQuery.query('prescribedDrugs')[0];
        this.rowEditor = this.drugsEditor.rowEditor;
    },

    afterMovieEdit: function () {
        var drugStore = this.getStore('orderStore');
        var x = Ext.getCmp('prescribedDrugs').getSelectionModel().getSelection()
        console.log(x[0].data.itemprice);
        if(x[0].data.unitprice != null && x[0].data.qty){
            x[0].data.itemprice = x[0].data.unitprice*x[0].data.qty;
        }
        drugStore.sync();
    },

    onDrugEdit: function (evtData) {
        var store = this.getStore('orderStore');
        var record = store.getAt(evtData.rowIndex);
        if(record) {
            this.rowEditor.startEdit(record, this.drugsEditor.columns[evtData.colIndex]);
        }
        console.log(Ext.getStore('allDrugs'))
    },

    onDrugDelete: function (evtData) {
        var store = this.getStore('orderStore');
        var record = store.getAt(evtData.rowIndex);
        if(record) {
            store.remove(record);
            store.sync();
        }
    }, 
    
    addDrug: function() {
        var newDrug;
        drugStore = Ext.getStore('orderStore');
        // add blank item to store -- will automatically add new row to grid
        newDrug = drugStore.add({
            drugname: '',
            dosage: '',
            duration: '',
            unitprice: '',
            itemprice: ''
        })[0];
        this.rowEditor.startEdit(newDrug, this.drugsEditor.columns[0]);
    },
    
    displayForm: function () {
        var l = Ext.getCmp('addpatientarea').getLayout();
        l.setActiveItem(1);
        var l1 = Ext.getCmp('addpatientgridarea').getLayout();
        l1.setActiveItem(1);
    },

    savePerson: function () {
        var jsonperson = Ext.create('RaxaEmr.Pharmacy.model.Person', {
            gender: Ext.getCmp('sexRadioGroup').getChecked()[0].boxLabel.charAt(0),
            addresses: [{
                address1: Ext.getCmp('block').value,
                cityVillage: Ext.getCmp('village').value,
                countyDistrict: Ext.getCmp('District').value
            }],
            names: [{
                givenName: Ext.getCmp('givenName').value,
                familyName: Ext.getCmp('familyName').value
            }]
        })
        //this if else statement change the persist property of age field in Person model so that if its
        //empty it should not be sent to server in the body of post call
        if (Ext.getCmp('age').isValid()) {
            jsonperson.data.age = Ext.getCmp('age').value;
            RaxaEmr.Pharmacy.model.Person.getFields()[2].persist = true;
        } else {
            RaxaEmr.Pharmacy.model.Person.getFields()[2].persist = false;
        }
        if (Ext.getCmp('dob').isValid()) {
            jsonperson.data.birthdate = Ext.getCmp('dob').value;
            RaxaEmr.Pharmacy.model.Person.getFields()[3].persist = true;
        } else {
            RaxaEmr.Pharmacy.model.Person.getFields()[3].persist = false;
        }

        var store = Ext.create('RaxaEmr.Pharmacy.store.Persons');
        store.add(jsonperson);
        // this statement makes the post call to make the person
        store.sync();
        // this statement calls getifentifiers() as soon as the post call is successful
        store.on('write', function () {
            this.getidentifierstype(store.getAt(0).getData().uuid)
        }, this)
        Ext.getCmp('addPatient').getForm().reset();
        //I made this funtion return this store because i needed this in jasmine unit test
        return store;
    },

    getidentifierstype: function (personUuid) {
        var identifiers = Ext.create('RaxaEmr.Pharmacy.store.Identifiers')
        identifiers.load();
        // this statement calls getlocation() as soon as the get call is successful
        identifiers.on('load', function () {
            this.getlocation(personUuid, identifiers.getAt(0).getData().uuid)
        }, this);
    },

    /* this funtions makes a get call to get the location uuid */
    getlocation: function (personUuid, identifierType) {
        var locations = Ext.create('RaxaEmr.Pharmacy.store.Locations')
        locations.load();
        // this statement calls makePatient() as soon as the get call is successful
        locations.on('load', function () {
            this.makePatient(personUuid, identifierType, locations.getAt(0).getData().uuid)
        }, this)
    },

    /* this funtions makes a post call to creat the patient with three parameter which will sent as person, identifiertype 
       and loaction */
    makePatient: function (personUuid, identifierType, location) {
        var patient = Ext.create('RaxaEmr.Pharmacy.model.Patient', {
            person: personUuid,
            identifiers: [{
                identifier: Util.getPatientIdentifier().toString(),
                identifierType: identifierType,
                location: location,
                preferred: true
            }]
        });
        var PatientStore = Ext.create('RaxaEmr.Pharmacy.store.Patients')
        PatientStore.add(patient);
        //makes the post call for creating the patient
        PatientStore.sync();
        //I made this funtion return this store because i needed this in jasmine unit test
        return PatientStore
    },
    
    //fuction to be called when a drug order is selected in prescription grid of advanced search
    //sets the prescription date and store for main prescription grid
    DrugOrderSelect: function(x){
        var l = Ext.getCmp('mainarea').getLayout();
        l.setActiveItem(0);
        var l1 = Ext.getCmp('addpatientarea').getLayout();
        l1.setActiveItem(0);
        var l2 = Ext.getCmp('addpatientgridarea').getLayout();
        l2.setActiveItem(0);
        Ext.getCmp('drugASearchGrid').getStore().removeAll();
        Ext.getCmp('drugASearchGrid').getStore().add(x)
        Ext.getCmp('prescriptionDate').setValue(x.getData().startDate.toLocaleDateString())
    },
    
    //function to be call when a patient is selected in the patient search results gird of advanced search
    //sets the fields realted to patient in main screen and then calls for function getDrugOrders()
    patientSelect: function(x){
        Ext.getCmp('prescriptionPatientName').setValue(x.display)
        //below its commented as the identifier are not sent in patient search results
        //Ext.getCmp('prescriptionPatientId').setValue(x.identifier)
        if(x.age != 0)Ext.getCmp('prescriptionPatientAge').setValue(x.age)
        else Ext.getCmp('prescriptionPatientAge').setValue(null)
        Ext.getCmp('prescriptionPatientGender').setValue(x.gender)
        this.getDrugOrders(x.uuid)
    },
    
    //function for the get call for drugorder for related patient
    getDrugOrders: function(x){
        var Url = HOST + '/ws/rest/v1/order?patient=';
        Url = Url + x + '&&v=full';
        // setting up the proxy here because url is not fixed
        Ext.getCmp('drugOrderASearchGrid').getStore().setProxy({
            type: 'rest',
            url: Url,
            headers: Util.getBasicAuthHeaders(),
            reader: {
                type: 'json',
                root: 'results'
            }
        })
        Ext.getCmp('drugOrderASearchGrid').getStore().load();
        Ext.getCmp('drugOrderASearchGrid').getStore().on('load', function(){
            // show prescriptions grid(drugOrderASearchGrid) when drug orders are loaded
            Ext.getCmp('searchGrid').getLayout().setActiveItem(1)
        },this)
    },
    
    //function that make the get call when enter is pressed within any of the 3 text fieds in advanced search
    searchPatient: function(){
        Ext.getCmp('searchGrid').getLayout().setActiveItem(0)
        if(Ext.getCmp('patientNameASearch').getValue() != ""){
            var Url = HOST + '/ws/rest/v1/patient?q=';
            Url = Url + Ext.getCmp('patientNameASearch').getValue() + "&"
            Url = Url + "&v=full";
            // setting up the proxy here because url is not fixed
            Ext.getCmp('patientASearchGrid').getStore().setProxy({
                type: 'rest',
                url: Url,
                headers: Util.getBasicAuthHeaders(),
                reader: {
                    type: 'json',
                    root: 'results'
                }
            })
            Ext.getCmp('patientASearchGrid').getStore().load();
        }
    },
    //functiont to go to patient search grid when back button is pressed in advanced search
    goback: function(){
        Ext.getCmp('searchGrid').getLayout().setActiveItem(0)
    }
    
    
});