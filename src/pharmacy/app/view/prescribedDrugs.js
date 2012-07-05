var states = Ext.create('Ext.data.Store', {
    fields: ['abbr', 'name'],
    data : [
    {
        "abbr":"AL", 
        "name":"Alabama"
    },

    {
        "abbr":"AK", 
        "name":"Alaska"
    },

    {
        "abbr":"AZ", 
        "name":"Arizona"
    }
    //...
    ]
});

Ext.define('RaxaEmr.Pharmacy.view.prescribedDrugs', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.prescribedDrugs',
    id: 'prescribedDrugs',
    height: 300,
    styleHtmlContent: false,
    width: 780,
    store: 'orderStore',
    autoScroll: true,
    selType: 'rowmodel',
    rowEditor: Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 3
    }),
    viewConfig: {
        stripeRows: false
    },
    initComponent: function () {    
        var drugEditor = this;
        this.addEvents(['drugEdit', 'drugDelete']);
        this.columns = [
        {
            xtype: 'gridcolumn',
            width: 117,
            dataIndex: 'drugname',
            text: 'Name Of drug',
            editor: {
                xtype: 'combobox',
                allowBlank: false,
                store: Ext.create('RaxaEmr.Pharmacy.store.allDrugs'),
                displayField: 'text'       
            }
        },
        {
            xtype: 'gridcolumn',
            width: 67,
            dataIndex: 'dosage',
            text: 'Dosage',
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        },
        {
            xtype: 'gridcolumn',
            width: 73,
            dataIndex: 'duration',
            text: 'Duration',
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        },
        {
            xtype: 'numbercolumn',
            width: 38,
            dataIndex: 'qty',
            text: 'Qty',
            editor: {
                xtype: 'numberfield',
                allowBlank: true
            }
        },
        {
            xtype: 'numbercolumn',
            text: 'Unit Price',
            dataIndex: 'unitprice',
            editor: {
                xtype: 'numberfield',
                allowBlank: true
            }
        },
        {
            xtype: 'numbercolumn',
            width: 103,
            dataIndex: 'itemprice',
            text: 'Item Price',
            id: 'itemprice'
        },{
            xtype: 'actioncolumn',
            width: 50,
            items: [{
                icon: '../../resources/img/edit.png',  // Use a URL in the icon config
                tooltip: 'Edit',
                handler: function(grid, rowIndex, colIndex) {
                    drugEditor.fireEvent('drugEdit', {
                        rowIndex: rowIndex,
                        colIndex: colIndex
                    });
                }
            },{
                icon: '../../resources/img/edit.png',
                tooltip: 'Delete',
                handler: function(grid, rowIndex, colIndex) {
                    drugEditor.fireEvent('drugDelete', {
                        rowIndex: rowIndex,
                        colIndex: colIndex
                    });
                }
            }]
        }];
        this.plugins = [this.rowEditor];
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [
            '->',
            {
                text: 'Add Drug',
                iconCls: 'icon-add'
            }]
        }];
        this.callParent(arguments);
    }
});