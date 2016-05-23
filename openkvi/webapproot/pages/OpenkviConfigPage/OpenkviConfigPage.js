dojo.declare("OpenkviConfigPage", wm.Page, {
	start: function() {
		try {
			this._security_session_changed = false;
            this._security_level_changed = false;
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},
    showToastError: function(message) {
        try {
            var user = this.templateUsernameVar.getValue("dataValue");
            if (user === "dev") {
                app.toastError(message);
            }
        } catch (e) {
            console.error('ERROR IN showToastError: ' + e);
        }
    },
    initOpenkviConfigTab: function() {
        try {
            this.getAuthenticationMode.update();
            this.panelDefaultStorages.domNode.style.backgroundColor = "#ffffff";
            this.panelAuth.domNode.style.backgroundColor = "#ffffff";
            this.panelHosts.domNode.style.backgroundColor = "#ffffff";
            this.panelSecurity.domNode.style.backgroundColor = "#ffffff";
            this.layerUsers.activate();
            this.panelUsers.domNode.style.backgroundColor = "#dfd8d8";
            
        } catch (e) {
            console.error('ERROR IN onLabelClick: ' + e);
            this.showToastError(this.name + "ERROR IN onLabelClick: " + e.toString());
        }
    },
	btnUpdateAuthenticationModeClick: function(inSender) {
        try {
            if ((this.authenticationLivePanel.isDirty === true) && (this.modeSelectEditor.getDataValue() != "SQL")){
                app.toastDialog.showToast("Please test your configuration before saving.", 3000, "Error", "cc", 'Cannot save untested changes');        
            } else {
                this.authenticationLiveForm.updateData();
            }
                
        } catch(e) {
            console.error('ERROR IN btnUpdateAuthenticationModeClick: ' + e); 
            this.showToastError(this.name + "ERROR IN btnUpdateAuthenticationModeClick: " + e.toString());
        }
    },

    javaAuthenticationModeResult: function(inSender, inDeprecated) {
        try {
            this.authenticationLiveForm.setReadonly(false);
            this.btnUpdateAuthenticationMode.setDisabled(this.modeSelectEditor.getDataValue() != "SQL");
        } catch(e) {
            console.error('ERROR IN javaAuthenticationModeResult: ' + e); 
            this.showToastError(this.name + "ERROR IN javaAuthenticationModeResult: " + e.toString());
        } 
    },
    
    textTestPasswordEnterKeyPress: function(inSender) {
        try {
            this.btnValidTestClick(inSender);
    
        } catch (e) {
            console.error('ERROR IN textTestPasswordEnterKeyPress: ' + e);
        }
    },
    btnValidTestClick: function(inSender) {
        try {
            var searchUser = "";
            var login = this.textTestLogin.getDisplayValue();
            
            if (this.ldapLoginDiag.title == "Authentication test") {
                searchUser = this.textTestLogin.getDisplayValue();
                this.javaTestLdapConnection.input.setValue("host", this.ldaphostEditor.getDataValue());
                this.javaTestLdapConnection.input.setValue("port", this.ldapportEditor.getDataValue());
                this.javaTestLdapConnection.input.setValue("baseDn", this.ldapbasednEditor.getDataValue());                
                if (this.modeSelectEditor.getDataValue() == "AD") {
                    login = this.ldapadminloginEditor.getDataValue() + "\\" + this.textTestLogin.getDisplayValue();
                }
                this.javaTestLdapConnection.input.setValue("adminLogin", login);
                this.javaTestLdapConnection.input.setValue("adminPassword", this.textTestPassword.getDisplayValue());
                this.javaTestLdapConnection.input.setValue("identifier", this.ldapidentifierfieldEditor.getDataValue());
                this.javaTestLdapConnection.input.setValue("searchedUser", searchUser);
                this.javaTestLdapConnection.update();
                
            } else if (this.ldapLoginDiag.title == "Please provide your credentials") {
                searchUser = this.loginEditor.getDisplayValue();
                this.javaGetLdapUserInfo.input.setValue("login", login);
                this.javaGetLdapUserInfo.input.setValue("password", this.textTestPassword.getDisplayValue());
                this.javaGetLdapUserInfo.input.setValue("user", this.loginEditor.getDataValue());
                this.javaGetLdapUserInfo.update();
            }           
    
        } catch (e) {
            console.error('ERROR IN btnValidTestClick: ' + e);
            this.showToastError(this.name + "ERROR IN btnValidTestClick: " + e.toString());
        }
    },
    
    btnTestLdapConnectionClick: function(inSender) {
        try {
            this.ldapLoginDiag.setTitle("Authentication test");
            this.labelInvalidUser.setShowing(false);
            this.ldapLoginDiag.show();
        } catch (e) {
            console.error('ERROR IN btnTestLdapConnectionClick: ' + e);
        }
    },
    javaTestLdapConnectionResult: function(inSender, inDeprecated) {
        try {
            this.ldapLoginDiag.hide();
            var result = this.javaTestLdapConnection.getValue("dataValue");            
            if (result == "OK") {
                app.toastDialog.showToast("Save your configuration to apply changes.", 3000, "Success", "cc", 'LDAP connection successful');
                this.btnUpdateAuthenticationMode.setDisabled(false);
                this.authenticationLivePanel.clearDirty();
            } else {
                this.labelInvalidUser.setShowing(true);
                app.toastDialog.showToast("Please review your configuration.", 3000, "Error", "cc", 'LDAP connection failed');
                this.btnUpdateAuthenticationMode.setDisabled(true);
            }

        } catch(e) {
            console.error('ERROR IN javaTestLdapConnectionResult: ' + e);
            this.showToastError(this.name + "ERROR IN javaTestLdapConnectionResult: " + e.toString());
        }
    },

    modeSelectEditorChange: function(inSender) {
        try { 
            var selectedMode = this.modeSelectEditor.getDataValue();
            
            this.btnTestLdapConnection.setDisabled(selectedMode == "SQL");
            this.ldapParametersPanel.setShowing(selectedMode != "SQL");
            this.ldaphostEditor.setRequired(selectedMode != "SQL");
            this.ldapportEditor.setRequired(selectedMode != "SQL");
            //this.ldapadminloginEditor.setRequired(selectedMode != "SQL");
            //this.ldapadminpasswordEditor.setRequired(selectedMode != "SQL");
            this.ldapbasednEditor.setRequired(selectedMode != "SQL");
            this.ldapidentifierfieldEditor.setRequired(selectedMode != "SQL");
            //this.ldapCreationModeSelectEditor.setRequired(this.modeSelectEditor.getDataValue() == "LDAP");
            this.ldapdefaultroleEditor.setRequired(selectedMode != "SQL");
            this.ldapdefaultroleEditor.setDataValue("Administrator");
            this.ldapdefaultroleEditor.setDisplayValue("Administrator");
            
            this.ldapadminloginEditor.setShowing(selectedMode == "AD");
            this.ldapadminloginEditor.setRequired(selectedMode == "AD");
                        
            var mode = this.getAuthenticationMode.getValue("dataValue");
            
            if (this.modeSelectEditor.getDataValue() === mode) {
                this.btnUpdateAuthenticationMode.setCaption(" Apply");
            } else {
                this.btnUpdateAuthenticationMode.setCaption(" Save");
                this.btnUpdateAuthenticationMode.setDisabled(selectedMode != "SQL");
            }
            
        } catch(e) {
            console.error('ERROR IN modeSelectEditorChange: ' + e); 
            this.showToastError(this.name + "ERROR IN modeSelectEditorChange: " + e.toString());
        }
    },
    
    getAuthenticationModeResult: function(inSender, inDeprecated) {
        try {
            var mode = this.getAuthenticationMode.getValue("dataValue");
            if (mode.indexOf("Failed") > -1) {
                app.alert("Cannot get Authentication mode: "+mode);
            } else {
                this.modeSelectEditor.setDataValue(mode);
                this.panelAuthSave.setShowing(false);
            }
    
    
        } catch (e) {
            console.error('ERROR IN getAuthenticationModeResult: ' + e);
            this.showToastError(this.name + "ERROR IN getAuthenticationModeResult: " + e.toString());
        }
    },

    checkUserCreationModeChange: function(inSender) {
        try {
            if (this.checkUserCreationMode.getChecked()) {
                this.ldapCreationModeSelectEditor.setDataValue("AutoSubscription");
            } else {
                this.ldapCreationModeSelectEditor.setDataValue("AdminAdd");
            }
    
        } catch (e) {
            console.error('ERROR IN checkUserCreationModeChange: ' + e);
            this.showToastError(this.name + "ERROR IN checkUserCreationModeChange: " + e.toString());
        }
    },

    ldapCreationModeSelectEditorChange: function(inSender) {
        try {
            var mode = this.ldapCreationModeSelectEditor.getDataValue();
            if (mode === "AutoSubscription") {
                this.checkUserCreationMode.setChecked(true);
            } else {
                this.checkUserCreationMode.setChecked(false);
            }
    
        } catch (e) {
            console.error('ERROR IN ldapCreationModeSelectEditorChange: ' + e);
            this.showToastError(this.name + "ERROR IN ldapCreationModeSelectEditorChange: " + e.toString());
        }
    },

    setUsersDialog: function(inSender) {
        try {
            var mode = this.getAuthenticationMode.getValue("dataValue");
            this.passwordEditor.setShowing(mode == "SQL");
            this.passwordEditor.setRequired(mode == "SQL");
            this.panelGetUserInfo.setShowing(mode != "SQL");
            //this.loginEditor.setRegExp((mode != "SQL" ? "" : ".*"));
            this.roleEditor.setDataValue("Administrator");
            this.roleEditor.setDisplayValue("Administrator");
        } catch(e) {
            console.error('ERROR IN usersDialogShow: ' + e);
            this.showToastError(this.name + "ERROR IN usersDialogShow: " + e.toString());
        }
    },

    btnGetLdapUserInfoClick: function(inSender) {
        try {
            if ((this.textTestLogin.getDisplayValue() !== "") && (this.labelInvalidUser.showing === false)) {
                this.javaGetLdapUserInfo.input.setValue("login", this.textTestLogin.getDisplayValue());
                this.javaGetLdapUserInfo.input.setValue("password", this.textTestPassword.getDisplayValue());
                this.javaGetLdapUserInfo.input.setValue("user", this.loginEditor.getDisplayValue());
                this.javaGetLdapUserInfo.update();     
            } else { 
                this.ldapLoginDiag.setTitle("Please provide your credentials");
                this.labelInvalidUser.setShowing(false);
                this.ldapLoginDiag.show();
            }
            //this.javaGetLdapUserInfo.input.setValue("searchedUser", this.loginEditor.getDataValue());
            //this.javaGetLdapUserInfo.update();
        } catch(e) {
            console.error('ERROR IN btnGetLdapUserInfoClick: ' + e);
            this.showToastError(this.name + "ERROR IN btnGetLdapUserInfoClick: " + e.toString());
        } 
    },
    loginEditorEnterKeyPress: function(inSender) {
        try {
            if (this.btnGetLdapUserInfo.showing === true) {
                this.btnGetLdapUserInfoClick(inSender);
            }
    
        } catch (e) {
            console.error('ERROR IN loginEditorEnterKeyPress: ' + e);
        }
    },

    javaGetLdapUserInfoResult: function(inSender, inDeprecated) {
        try {
            this.ldapLoginDiag.hide();            
            result = this.javaGetLdapUserInfo.getValue("dataValue");
            if (result !== null) {
                if (result.indexOf("Error") > -1) {
                    this.labelInvalidUser.setShowing(true);
                    this.ldapLoginDiag.show();
                } else {
                    var jsonVar = JSON.parse(result);
                    this.firstNameEditor.setDisplayValue(jsonVar.firstname);
                    this.lastNameEditor.setDisplayValue(jsonVar.lastname);
                    this.mailEditor.setDisplayValue(jsonVar.mail);                
                    this.loginEditor.setRegExp(jsonVar.login);
                    this.roleEditor.setDisplayValue("Administrator");
                }

            } else {
                this.firstNameEditor.setDisplayValue("User not found.");
            }
        } catch(e) {
            this.showToastError(this.name + "ERROR IN javaGetLdapUserInfoResult: " + e.toString());
            console.error('ERROR IN javaGetLdapUserInfoResult: ' + e); 
        }
    },

    onItemConfigClick: function(inSender, inEvent) {
        try {
            this.javaGetSecurityLevel.update();           
            
            this.panelDefaultStorages.domNode.style.backgroundColor = "#ffffff";
            this.panelUsers.domNode.style.backgroundColor = "#ffffff";
            this.panelAuth.domNode.style.backgroundColor = "#ffffff";
            this.panelHosts.domNode.style.backgroundColor = "#ffffff";
            this.panelSecurity.domNode.style.backgroundColor = "#ffffff";
            
            if (inSender.name.indexOf("Storages") > -1) {
                this.layerDataStorage.activate();
                this.panelDefaultStorages.domNode.style.backgroundColor = "#dfd8d8";
            } else if (inSender.name.indexOf("Users") > -1) {
                this.getAuthenticationMode.update();
                this.layerUsers.activate();
                this.panelUsers.domNode.style.backgroundColor = "#dfd8d8";
            } else if (inSender.name.indexOf("Authentication") > -1) {
                this.getAuthenticationMode.update();
                this.layerAuthenticationMode.activate();
                this.panelAuth.domNode.style.backgroundColor = "#dfd8d8";
            } else if (inSender.name.indexOf("Hosts") > -1) {
                this.javaGetHosts.update();
                this.layerDataHosts.activate();
                this.panelHosts.domNode.style.backgroundColor = "#dfd8d8";
            } else if (inSender.name.indexOf("Security") > -1) {
                this.javaGetSessionInfo.update();
                this.layerSecurity.activate();
                this.panelSecurity.domNode.style.backgroundColor = "#dfd8d8";
            }
    
        } catch (e) {
            console.error('ERROR IN onLabelClick: ' + e);
            this.showToastError(this.name + "ERROR IN onLabelClick: " + e.toString());
        }
    },   

    usersSaveButtonClick: function(inSender) {
        try {
            var count = this.usersDojoGrid.getRowCount();
            var checked = true;
            var newLogin = this.loginEditor.getDisplayValue();
            for (var i = 0; i < count; i++) {
                var data = this.usersDojoGrid.getRow(i);
                if (newLogin === data.login) {
                    if (this.usersLiveForm.operation === "update") {
                        var selectedIndex = this.usersDojoGrid.getSelectedIndex();
                        if (selectedIndex !== i) {
                            checked = false;
                        }
                    } else {
                        checked = false;
                    }
                }
            }
            if (this.roleEditor.getDisplayValue() === "") {
                if (newLogin === "dev") {
                    this.roleEditor.setDisplayValue("dev");
                } else {
                    this.roleEditor.setDisplayValue("admin");
                }
            }
            
            if (checked) {
            
                this.usersLiveForm.saveDataIfValid();
                this.userDialog.hide();
            } else {
                var title = 'User "'+newLogin+'" already exist !';
                //app.alert("<p>The user <b>" + newLogin + "</b> already exist.</p>");
                var msg = "Please select a new login name";
                app.toastDialog.showToast(msg, 5000, "Warning", "cc", title);
            }
        } catch (e) {
            console.error('ERROR IN usersSaveButtonClick: ' + e);
            this.showToastError(this.name + "ERROR IN usersSaveButtonClick: " + e.toString());
        }
    },

    authenticationLiveFormResult: function(inSender, inData) {
        try {
            app.toastDialog.showToast("Authentication mode updated.", 2000, "Success", "cc", 'Success');
            this.authenticationLiveForm.setReadonly(false);
            this.getAuthenticationMode.update();
            this.btnUpdateAuthenticationMode.setCaption(" Apply");
        } catch (e) {
            console.error('ERROR IN authenticationLiveFormResult: ' + e);
            this.showToastError("ERROR IN authenticationLiveFormResult: " + e.toString());
        }
    },   
    
    javaGetHostsResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaGetHosts.getValue("dataValue");
            var jsonVar = JSON.parse(result);
            this.varEtcHosts.setData(jsonVar.action.result);
            
        } catch (e) {
            console.error('ERROR IN javaGetHostsResult: ' + e);
        }
    },
    btnHostNewClick: function(inSender) {
        try {
            this.hostnamesDialog.setTitle("New Host entry");
            
            this.textHostIP.clear();
            this.textHostNames.clear();
            this.hostnamesDialog.show();
    
        } catch (e) {
            console.error('ERROR IN btnHostNewClick: ' + e);
        }
    },
    btnHostEditClick: function(inSender) {
        try {
            this.hostnamesDialog.setTitle("Edit Host entry");
            var index = this.gridEtcHosts.getSelectedIndex();
            var data = this.gridEtcHosts.getRow(index);
            this.textHostIP.clear();
            this.textHostNames.clear();
            this.textHostIP.setDisplayValue(data.ip);
            this.textHostNames.setDisplayValue(data.names);
            this.hostnamesDialog.show();
    
        } catch (e) {
            console.error('ERROR IN btnHostEditClick: ' + e);
        }
    },
    btnHostEntrySaveClick: function(inSender) {
        try {
            if (this.hostnamesDialog.title === "New Host entry") {
                this.varEtcHosts.addItem({ip: this.textHostIP.getDisplayValue(), names: this.textHostNames.getDisplayValue()});
            } else {
                var index = this.gridEtcHosts.getSelectedIndex();
                this.varEtcHosts.setItem(index, {ip: this.textHostIP.getDisplayValue(), names: this.textHostNames.getDisplayValue()});                
            }
            var content = this.varEtcHosts.getData();
            this.javaSetHosts.input.setValue('data', JSON.stringify(content));
            this.javaSetHosts.update();
    
            this.hostnamesDialog.hide();
        } catch (e) {
            console.error('ERROR IN btnHostEntrySaveClick: ' + e);
        }
    },
    btnHostDeleteClick: function(inSender) {
        try {
            var index = this.gridEtcHosts.getSelectedIndex();
            var data = this.gridEtcHosts.getRow(index);
            this.labelHostEntryToDelete.setCaption(data.ip+" \t "+data.names);
            this.deleteHostEntryDialog.show();
    
        } catch (e) {
            console.error('ERROR IN btnHostDeleteClick: ' + e);
        }
    },
    javaSetHostsResult: function(inSender, inDeprecated) {
        try {
            this.getAuthenticationMode.update();
        } catch (e) {
            console.error('ERROR IN javaSetHostsResult: ' + e);
        }
    },
    btnDeleteHostEntryConfirmClick: function(inSender) {
        try {
            var index = this.gridEtcHosts.getSelectedIndex();
            this.varEtcHosts.removeItem(index);
            
            var content = this.varEtcHosts.getData();
            this.javaSetHosts.input.setValue('data', JSON.stringify(content));
            this.javaSetHosts.update();
            this.deleteHostEntryDialog.hide();
    
        } catch (e) {
            console.error('ERROR IN btnDeleteHostEntryConfirmClick: ' + e);
        }
    },
    btnHostNew1Click: function(inSender) {
        try {
            this.btnHostNewClick(inSender);
    
        } catch (e) {
            console.error('ERROR IN btnHostNew1Click: ' + e);
        }
    },
    btnHostEdit1Click: function(inSender) {
        try {
            this.btnHostEditClick(inSender);
    
        } catch (e) {
            console.error('ERROR IN btnHostEdit1Click: ' + e);
        }
    },
    btnHostDelete1Click: function(inSender) {
        try {
            this.btnHostDeleteClick(inSender);
    
        } catch (e) {
            console.error('ERROR IN btnHostDelete1Click: ' + e);
        }
    },
    javaGetSessionInfoResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaGetSessionInfo.getValue("dataValue");
            //var tmpstr0 = result.replace(/-/g, '__');/(\w+)\s(\w+)/
            var tmpstr0 = result.replace(/(\w+)-(\w+)/g, "$1__$2");
            var tmpstr1 = tmpstr0.replace(/__1/g, '-1');
            var jsonVar = JSON.parse(tmpstr1);
            var timeout = jsonVar.web__app.session__config.session__timeout;
            if (timeout === "-1") {
                this.useTimeoutBox.setChecked(true);
            } else {
                this.useTimeoutBox.setChecked(false);
                this.sessionTimeout.setDisplayValue(timeout);
            }
            
            this.panelDataCenterSecurityApply.setDisabled(true);
            } catch (e) {
                //app.toastError(e.toString());
                console.error('ERROR IN javaGetSessionInfoResult: ' + e);
            }
            this._security_session_changed = false;
        },
    sessionTimeoutChange: function(inSender) {
        try {
            this.panelDataCenterSecurityApply.setDisabled(false);    
            this._security_session_changed = true;
        } catch (e) {
            console.error('ERROR IN sessionTimeoutChange: ' + e);
        }
    },
    useTimeoutBoxChange: function(inSender) {
        try {
            this.panelDataCenterSecurityApply.setDisabled(false); 
            this._security_session_changed = true;
        } catch (e) {
            console.error('ERROR IN useTimeoutBoxChange: ' + e);
        }
    },
    btnResetSecurityClick: function(inSender) {
        try {
            this.javaGetSessionInfo.update();   
            this.javaGetSecurityLevel.update();
        } catch (e) {
            console.error('ERROR IN btnResetSecurityClick: ' + e);
        }
    },
    btnApplyDataCenterSecurityClick: function(inSender) {
        try {            
            if (this._security_session_changed) {
                var newTimeout = "-1" ;
                if (this.useTimeoutBox.getChecked() === false) {
                    newTimeout = this.sessionTimeout.getDisplayValue().toString();    
                }
                this.javaSetSessionInfo.input.setValue("timeout", newTimeout);
                this.javaSetSessionInfo.update();
            } 
            if (this._security_level_changed) {
                var val = this.sliderSecurity.getValue("dataValue");
                var level = "";
                if (val === 0) {
                    level = "low";
                } else if (val === 1) {
                    level = "high";
                }
                this.javaSetSecurityLevel.input.setValue("level", level);
                this.javaSetSecurityLevel.update();
            }
        } catch (e) {
            console.error('ERROR IN btnApplyDataCenterSecurityClick: ' + e);
            //app.toastError('ERROR IN btnApplyDataCenterSecurityClick: ' + e.toString());
        }
    },
    javaSetSessionInfoResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaSetSessionInfo.getValue("dataValue");                
            this.panelDataCenterSecurityApply.setDisabled(true);
            if (result === "done") {
                var title = "OpenKVI service needs to be restarted";
                var msg = "Please wait, this may take a few seconds ...";
                app.toastDialog.showToast(msg, 30000, "Warning", "cc", title);
                setTimeout(function() {
                    try {
                        wm.Page.getPage("OpenkviConfigPage").javaRestartTomcat.update();
                    } catch (e) {
                        alert(e);
                    }
                },1000);
            
            } else {
                app.toastError('Error updating Session information: '+result);
            }            
            this.javaGetSessionInfo.update();
        } catch (e) {
            console.error('ERROR IN javaSetSessionInfoResult: ' + e);
        }
    },

    sliderSecurityChange: function(inSender) {
        try {
            var val = this.sliderSecurity.getValue("dataValue");
            var help = "";
            if (val === 0) {
                help = "<h3><u>Low Level</u></h3>";
                help += "<ul>";
                help += "<li><b>Unencrypted connection allowed.</b></li>";
                help += "<li><b>No firewalling.</b></li>";
                help += "</ul>";
                help += "Only suitable for test purposes.";
            } else if (val === 1) {
                help = "<h3><u>High Level</u></h3>";
                help += "<ul>";
                help += "<li><b>Unencrypted connection <u>denied</u>.</b></br>HTTP Connections (port 80) are redirected to HTTPS (port 443).</li>";
                help += "<li><b>Firewall activated.</b></br>All incoming traffic, except on port 22, 80 and 443, is rejected.</li>";
                help += "<li><b>Only auhtenticated users can have access to KVM nodes' Webshell and Virtual Machines' console.</b></li>"; 
                help += "<li><b>On KVM nodes, the management IP is Firewalled.</b></li>"; 
                help += "</ul>";
                help += "Suitable for a production environment.";
                
            }
            this.SecurityLevelText.setDisplayValue(help);
            this.panelDataCenterSecurityApply.setDisabled(false);
            this._security_level_changed = true;
        } catch (e) {
            console.error('ERROR IN sliderSecurityChange: ' + e);
        }
    },

    javaGetSecurityLevelResult: function(inSender, inDeprecated) {
        try {            
            var result = this.javaGetSecurityLevel.getValue("dataValue");
            var jsonVar = JSON.parse(result);
            
            if (jsonVar.action.result === "low") {
                this.sliderSecurity.setDisplayValue(0);
            } else if (jsonVar.action.result === "high") {
                this.sliderSecurity.setDisplayValue(1);
            }
            this._security_level_changed = false;
        } catch (e) {
            console.error('ERROR IN javaGetSecurityLevelResult: ' + e);
        }
    },
    
    javaSetSecurityLevelResult: function(inSender, inDeprecated) {
        try {
            //app.toastDialog.showToast("You will be disconnected ....", 3000, "Success", "cc", "Security level updated");
            this.panelDataCenterSecurityApply.setDisabled(true);
            //this.javaGetSecurityLevel.update();    

        } catch (e) {
            console.error('ERROR IN javaSetSecurityLevelResult: ' + e);
        }
    },
    
  _end: 0
});
