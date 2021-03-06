Ext.define('RaxaEmr.billing.view.currentBill_main', {
    extend: 'Ext.form.Panel',
    alias : 'widget.currentBill_main',
    height: 750,
    layout: {
        type: 'vbox',
        align: 'center',
        pack:'start'
    },
    initComponent: function() {
        var me = this;
        this.addEvents(['itemDelete'],['itemEdit']);
        Ext.applyIf(me, {
            items: [
            {
                xtype: 'container',
                layout: 'vbox',
                items: [
                {
                    xtype: 'panel',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                    {
                        xtype: 'panel',
                        width: 180,
                        items: [
                        {
                            xtype: 'image',
                            src:  '../resources/img/icon_s.png',
                            width : '10',
                            height : '10'
                        }
                        ]

                    },
                    {
                        xtype: 'panel',
                        width: 110,
                        margins: '0 1 1 1',
                        items:[{
                            html: "<img border=\"0\" src=\"../resources/img/billing.png\" alt=\"Patient Image\" width=\"110\" height=\"140\" />"
                        }]
                    },
                    {
                        xtype: 'panel',
                        width: 520,
                        layout: {
                            align: 'stretch',
                            type: 'hbox'
                        },
                        items: [
                        {
                            xtype: 'panel',    
                            layout: 'vbox',
                            width: '200',
                            border: false,
                            items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: 'Name ',
                                id: 'billingPatientName'
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: 'Patient ID',
                                id: 'billingPatientId',
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: 'Age',
                                id: 'billingPatientAge'
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: 'Gender',
                                id: 'billingPatientGender'
                            }
                            ]
                        },
                        {
                            xtype: 'panel',
                            layout: 'vbox',
                                                    
                            width: 200,
                            border: false,
                            items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: 'Doctor\'s Name '
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: 'Location '
                            }
                            ]
                        }
                        ]
                    }
                    ]
                }
                ,
                {
                    xtype: 'container',
                    layout: 'hbox',    
                    items: [
                    {
                        xtype: 'BillingSearchPatient',
                        id: 'billingSearchPatient',
                        title: 'Find Patient ',
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                        {
                            xtype: 'container',
                            height: 350,
                            width: 650,
                            items: [
                            {
                                xtype: 'gridpanel',
                                title: 'CurrentBill',
                                id: 'gridCurrentBill',
                                height: 350,
                                store: Ext.data.StoreManager.lookup('RaxaEmr.billing.store.itemStore'),

                                columns: [
                                {
                                    xtype: 'gridcolumn',
                                    width: 80,
                                    dataIndex: 'item_name',
                                    text: 'Item',
                                    id : 'item_name'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 80,
                                    dataIndex: 'category',
                                    text: 'category',
                                    id : 'category'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    width: 50,
                                    dataIndex: 'quantity',
                                    text: 'quantity',
                                    id : 'quantity'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    width: 50,
                                    dataIndex: 'price',
                                    text: 'price',
                                    id: 'price'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    width: 55,
                                    dataIndex: 'discount',
                                    text: 'discount',
                                    id: 'discount'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 200,
                                    dataIndex: 'discountReason',
                                    text: 'discountReason',
                                    id: 'discountReason'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    width: 50,
                                    dataIndex: 'total',
                                    text: 'total',
                                    id: 'total'
                                },
                                {
                                    xtype: 'actioncolumn',
                                    width: 60,
                                    items: [{
                                        icon: '../resources/img/edit.png',
                                        tooltip: 'Edit',
                                        handler: function(grid, rowIndex) {
                                            me.fireEvent('itemEdit', {
                                                rowIndex: rowIndex

                                            });
                                        }
                                    },{
                                        icon: '../resources/img/delete.png',
                                        tooltip: 'Delete',
                                        handler: function(grid,rowIndex) {
                                            me.fireEvent('itemDelete', {
                                                rowIndex: rowIndex

                                            });
                                        /* var itemStore1 = Ext.getStore('RaxaEmr.billing.store.itemStore');
                                        //  console.log(evtData.rowIndex);
                                        var record = itemStore1.getAt(rowIndex);
                                        if(record) {
                                            itemStore1.remove(record);
                                            itemStore1.sync();


                                            var amount=Ext.getCmp('current_amount');
                                            var prev_amount=Ext.getCmp('prev_amount');
                                            var tot_amount=Ext.getCmp('total_amount');
                                            var paid =Ext.getCmp('amount_paid');
                                            var pay= paid.getValue();
                                            var balance = Ext.getCmp('balance1');
                                            var prev=prev_amount.getValue();
                                            var prev1=parseInt(prev);
                                            var total;
                                            var bal;

                                            var tot=0;
                                            for (var j = 0; j < itemStore1.getCount(); j++) {
                                                // order[j].concept = concept[j].getAt(0).getData().uuid;
                                                tot=tot+itemStore1.getAt(j).getData().total;
                                            }
                                            amount.setValue(tot);
                                            total=tot+prev1;
                                            bal=total-pay;
                                            amount.setValue(tot);

                                            tot_amount.setValue(total);
                                            balance.setValue(bal);
                                        }*/

                                        /*  me.fireEvent('billDelete', {
                                            rowIndex: rowIndex,
                                            colIndex: colIndex
                                        });*/
                                        }
                                    }
                                    ]
                                }
                                ], 

                                features: [{
                                    ftype:'grouping'
                                }]
                            }
                            ]
                        },
                        {
                            xtype: 'panel',
                            title: 'Features',
                            layout: 'vbox',
                            height: 350,
                            width: 170,
                            items: [
                            {
                                xtype: 'button',
                                height: 22,
                                width: 168,
                                text: 'Add Item',
                                action: 'findPatient1'
                            },
                            {
                                xtype: 'button',
                                height: 22,
                                width: 168,
                                text: ' Save and Print Bill',
                                action: 'saveBill'
                            },
                            {
                                xtype: 'button',
                                height: 22,
                                width: 168,
                                text: ' Pay bill',
                                action: 'payBill'
                            },
                            {
                                xtype: 'textfield',
                                height: 20,
                                width: 168,
                                fieldLabel: 'Current Amount ',
                                id:'current_amount',
                                value:0,
                                readOnly:true
                            },
                            {
                                xtype: 'textfield',
                                height: 20,
                                width: 168,
                                fieldLabel: 'Previous Amount ',
                                id:'prev_amount',
                                value:0,
                                readOnly:true
                            },

                            {
                                xtype: 'textfield',
                                height: 20,
                                width: 168,
                                fieldLabel: 'Total Amount ',
                                id:'total_amount',
                                value:0,
                                readOnly:true
                            },


                            {
                                xtype: 'textfield',
                                height: 20,
                                width: 168,
                                fieldLabel: 'Amount Paid ',
                                id:'amount_paid',
                                value:0
                            },
                            {
                                xtype: 'textfield',
                                height: 20,
                                width: 168,
                                fieldLabel: 'Balance',
                                id:'balance1',
                                value:0,
                                readOnly:true
                            },
                            /*{
                            xtype: 'button',
                            height: 37,
                            width: 118,
                            text: 'RSBY'
                        },
                        {
                            xtype: 'button',
                            height: 72,
                            width: 118,
                            text: 'Collect Money'
                        }*/
                            ]
                        }
                        ]
                    }
                    ]    
                
                }
                ]
            }]
        });

        me.callParent(arguments);
    }

});
