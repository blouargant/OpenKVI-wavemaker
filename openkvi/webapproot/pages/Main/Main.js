/*
    This file is part of OPENKVI.

    OPENKVI is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    OPENKVI is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with OPENKVI.  If not, see <http://www.gnu.org/licenses/>.
*/

eval(wm.load("resources/javascript/coolclock/coolclock.js"));
eval(wm.load("resources/javascript/coolclock/moreskins.js"));
eval(wm.load("resources/javascript/d3.min.js"));
eval(wm.load("resources/javascript/d3pie.js"));
//eval(wm.load("resources/javascript/jquery.min.js"));
dojo.require("dojox.collections.Dictionary");
dojo.declare("Main", wm.Page, {
    "i18n": true,
    "coolClock": undefined,
    start: function() {
        try {
            dojo.subscribe("session-expiration", this, "sessionExpired");
            this._isLogout = false;
            this._isExpired = false;
            this._clientID = 0;
            dojo.cookie("closingTest", "opened", {
                expires: 0.0006
            });
            this._vmConfigHotswapable = "";
            this._vmTabChangeInfo = null;
            this._gridLogHeight = 150;
            this._gridLogShower = 0;
            this._TaskListHided = false;
            this._debug = false;
            this._vncFocusTries = 0;
            this._nodeVirtualNetworkData = {};
            this._waitForAllVmsNics = false;
            this._movingVnic = {};
            this._varMoveVm = {};
            this._nodesData = {};
            this._dojoConnectHandles = {};
            this._nodePopup = {
                "name": null,
                "showing": false,
                "caller": null
            };
            this.TabCenterServers.setShowing(false);
            this._BottomInfoHided = 28;
            this._maxVmPanelHeight = 0;
            this._expandedNodes = {};
            
            //dojo.subscribe("session-expiration-servicecall", this, "sessionExpired");
            var jsonVar = [{
                name: "KVM",
                dataValue: "kvm"
            },
            {
                name: "QEMU",
                dataValue: "qemu"
            }];


            this.vmsByServer = new dojox.collections.Dictionary();

            input = "/opt/virtualization/openkvi/tmpfs/openkvi.cbuff";
            this.varDefaultInputFile.setValue("dataValue", input);
            output = "/opt/virtualization/openkvi/openkvi.fifo";
            this.varDefaultOutputFile.setValue("dataValue", output);

            this.varCurrentUser.setValue("DataValue", "admin");
            this.varVmsToImport.setValue("DataValue", "{vms:[]}");
            this.clearServerInfo.setValue("dataValue", true);
            var deleteAllVmFromServer = false;
            // Set the variable datae
            this.varHypervisors.setData(jsonVar);
            this.varDefaultDiskSize.setValue("dataValue", "6");
            this.varDefaultDiskPath.setValue("dataValue", "/opt/virtualization/vmdisks");
            this.varDefaultVmConfigPath.setValue("dataValue", "/opt/virtualization/vmconfigs");
            this.varIsoDirectory.setValue("dataValue", "/opt/virtualization/ISOs");
            this.varServersCreated.setValue("dataValue", false);
            this.varVMsCreated.setValue("dataValue", false);
            this.varLoadVMDB.setValue("dataValue", true);
            this.varSelectedItem.setValue("dataValue", "panelDatacenter");
            this.varSelectedVm.setValue("dataValue", "none");
            this.labelDatacenter.domNode.style.cursor = "pointer";
            this.javaGetLocalHostname.update();

            this.labelVmRename.setValue("domNode.title", "Change name displayed in OpenKVI");

            this.listAllServersLiveVar.update();

            this.connect(this.mainLayoutBox.domNode, "onmousedown", this, dojo.hitch(this, "mainLayoutBoxRightClick", this.layoutBox));
            this.connect(this.ntpConfigurationDialog.domNode, "onmousedown", this, dojo.hitch(this, "closeTimezoneDialog", this.layoutBox));

            //this.connect(app.Main,"onbeforeunload",this,"mainPageClose");
            dojo.connect(window, "onbeforeunload", this, "windowUnload");
            //dojo.connect(window, "onunload", this, "windowClose");
            var currentVersion = this.openkviVersion.caption;
            var cookieVersion = dojo.cookie('OpenKVI_version');
            dojo.cookie('OpenKVI_version', currentVersion, {
                expires: 3600
            });
            if ((cookieVersion !== undefined) && (cookieVersion !== currentVersion)) {
                this.showWarning("<p><b>OpenKVI</b> has been updated.<br>For a better user experience, please logout and then clean your browser's cache.</br></p>");
            }

            this.nodemanagerListener.input.setValue("clientId", 0);
            this.nodemanagerListener.update();

            this.javaGetDebug.update();

            var compactViewCookie = dojo.cookie("openkvi_compact_view");
            if (compactViewCookie !== "no") {
                this.hideTasksList();
                //this.toolbarViewCompactClick();
            }

            var DataCenter_Panel_Width = dojo.cookie('OpenKVI_DataCenter_Panel_Width');
            if (DataCenter_Panel_Width !== undefined) {
                this.panelTree.setWidth(DataCenter_Panel_Width);
            }

            // PNotify
            var panelWidth = parseInt(this.panelTree.domNode.style.width.replace(/px/g, ""), 10);
            //this._stack_bar_bottom = {"dir1": "up", "dir2": "right", "push": "down", 'firstpos1': 0, 'firstpos2': 0, "spacing1": 3, "spacing2": 0, "context": $("#panelInfo")};
            this._stack_bar_bottom = {
                "dir1": "up",
                "dir2": "right",
                "spacing1": 0,
                "spacing2": 0
            };
            this._pnotify_list = [];
            PNotify.prototype.options.styling = "jqueryui";
            this.createToolTip();
            this.addToolTip(this.labelDatacenter.domNode, "", "Click here for a global view", "help", 800);
            this.addToolTip(this.pictureMainMenu.domNode, "Main menu", "", "help", 800);
            
            // Start by updating all nodes' information
            this.javaGetAllNodesInfo.update();
            this.varSelectedItem.setValue("dataValue", "panelDatacenter");
            this.labelNbUnseenMsg.setShowing(false);
            
            this.splitterLeftRight.bevelSize = "4";
            
            /// INITIALISE COLORS
            this._LogFrameColor = "#FFCCBC"; // DeepOrange_100
            
            this.panelNodemanagerLogs.domNode.style.backgroundColor = this._LogFrameColor;
            this.labelNodemanagerLogs.domNode.style.backgroundColor = this._LogFrameColor;
            

            
        } catch (e) {
            app.toastError(this.name + ".start() Failed: " + e.toString());
        }
    },
    guid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    dirname: function(path) {
        return path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');
    },
    getUserRolesResult: function(inSender, inDeprecated) {
        try {
            this._userRole = this.getUserRoles.getValue("dataValue");
            if (this._userRole === "dev") {
                this.textWebsocket.setReadonly(false);
                this.textWebsocket.setDisabled(false);
            }
        } catch (e) {
            console.error('ERROR IN getUserRolesResult: ' + e);
        }
    },
    dynamicSort: function(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function(a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        };
    },
    clone: function(obj) {
        // Handle the 3 simple types, and null or undefined
        if (null === obj || "object" !== typeof obj) return obj;
        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    },
    onMiscKey: function(inCharacter) {
        try {
            // This is a workaround for Chrome that use BACKSPACE key to go backward in history 
            dojo.cookie("closingTest", inCharacter, {
                //key expire after 10 seconds
                expires: 0.0001
            });

        } catch (e) {
            console.error('ERROR IN onMiscKey: ' + e);
            app.toastError("onMiscKey Failed: " + e.toString());
        }
    },
    windowUnload: function(e) {
        var strWidth = this.panelTree.domNode.style.width.replace(/px/g, "");
        //var currentWidth = parseInt(strWidth, 10) + 18;
        var currentWidth = parseInt(strWidth, 10);
        var currentStr = currentWidth.toString() + "px";
        if (currentStr !== this.panelTree.width) {
            dojo.cookie('OpenKVI_DataCenter_Panel_Width', currentStr, {
                expires: 3600
            });

        }


        var cookieTest = dojo.cookie("closingTest");
        if (this._isExpired) {
            return;
        }
        if (this._isLogout) {
            this.labelSessionInfo.setCaption("Closing OpenKVI.");
            this.sessionExpiredDialog.show();
            return;
        }

        if ((cookieTest !== "RELOAD") && (cookieTest !== "expired")) {

            dojo.cookie("closingTest", "closed", {
                expires: 0.0006
            });
            this.stopMonitoring.update();
            var mesg = "Are you sure you want to leave OpenKVI? \nYou should logout before leaving.";
            // For IE
            e.returnValue = mesg;
            // For all others
            return mesg;
        } else if (cookieTest === "expired") {
            this.stopMonitoring.update();
        }
    },
    templateLogoutVarBeforeUpdate: function(inSender, ioInput) {
        try {
            this._isLogout = true;
            this.stopMonitoring.update();

        } catch (e) {
            console.error('ERROR IN templateLogoutVarBeforeUpdate: ' + e);
        }
    },
    sessionExpired: function() {
        var cookieTest = dojo.cookie("closingTest");
        if ((cookieTest !== "closed") && (!this._isLogout)) {
            dojo.cookie("closingTest", "expired", {
                expires: 0.0006
            });
            this.labelSessionInfo.setCaption("Your session has expired, please reauthenticate.");
            this.sessionExpiredDialog.show();
            this._isExpired = true;
            setTimeout(function() {
                try {
                    window.location = "/openkvi/login.html";
                } catch (e) {
                    alert(e);
                }
            }, 30000);
        }
    },
    showWarning: function(warning) {
        try {
            //this.warningDialogText.setDataValue('<p><b><font color = "red">'+warning+'</font></b></p>');
            this.warningDialogText.setDataValue(warning);
            this.warningDialog.show();
        } catch (e) {
            this.showToastError(this.name + "ERROR IN showWarning: " + e.toString());
            console.error('ERROR IN showWarning: ' + e);
        }
    },

    btnExitAppClick: function(inSender) {
        try {
            this.sessionExpiredDialog.hide();
            this._isLogout = true;
            window.location = "/openkvi/login.html";

        } catch (e) {
            console.error('ERROR IN btnExitAppClick: ' + e);
        }
    },

    ///// START Debugging functions://///////////////////////////////////////////////
    showToastError: function(message) {
        try {
            var user = this.templateUsernameVar.getValue("dataValue");
            if ((user === "dev") || (this._debug)) {
                app.toastError(message);
            }
        } catch (e) {
            console.error('ERROR IN showToastError: ' + e);
        }
    },
    setDebugModeBtnClick: function(inSender) {
        try {
            this.setDebugMode();
        } catch (e) {
            console.error('ERROR IN setDebugModeBtnClick: ' + e);
        }
    },
    setDebugMode: function() {
        try {
            this.setDebugModeBtn.setDisabled(true);
            var input = "yes";
            if (this._debug) {
                input = "no";
            }
            this.javaSetDebug.input.setValue("enabled", input);
            this.javaSetDebug.update();

        } catch (e) {
            console.error('ERROR IN setDebugModeBtnClick: ' + e);
        }
    },
    javaGetDebugResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaGetDebug.getValue("dataValue");
            var jsonVar = JSON.parse(result);
            this.changeDebugMode(jsonVar.action.result);

        } catch (e) {
            console.error('ERROR IN javaGetDebugResult: ' + e);
            this.showToastError('ERROR IN javaGetDebugResult: ' + e.toString());
        }
    },
    changeDebugMode: function(enabled) {
        try {
            if (enabled === "yes") {
                app.toastInfo("Debug mode is enabled !");
                this._debug = true;
                this.checkDebugLogs.setShowing(true);
                this.labelOpenkviLogs.setShowing(true);
                this.checkDebugLogs.setChecked(true);
                this.setDebugModeBtn.removeUserClass("wm_BackgroundChromeBar_LightGray");
                this.setDebugModeBtn.addUserClass("wm_BackgroundChromeBar_SteelBlue");
                this.setDebugModeBtn.setHint('Disable Debug Mode');
                this.labelNodemanagerLogsClick();
                this.textWebsocket.setShowing(true);
            } else {
                this._debug = false;
                this.checkDebugLogs.setChecked(false);
                this.checkDebugLogs.setShowing(false);
                this.labelOpenkviLogs.setShowing(false);
                this.labelNodemanagerLogsClick();
                this.setDebugModeBtn.removeUserClass("wm_BackgroundChromeBar_SteelBlue");
                this.setDebugModeBtn.addUserClass("wm_BackgroundChromeBar_LightGray");
                this.setDebugModeBtn.setHint('Enable Debug Mode');
                this.textWebsocket.setShowing(false);
            }
            this.setDebugModeBtn.setDisabled(false);
        } catch (e) {
            console.error('ERROR IN changeDebugMode: ' + e);
            this.showToastError('ERROR IN changeDebugMode: ' + e.toString());
        }
    },

    logDebugVM: function(string) {
        if (this._debug) {
            str1 = this.dataCenterDebugArea.getDataValue();
            str2 = str1 + "<p><br><b>DEBUG VMS:</b></br>" + string + "</p>";
            this.dataCenterDebugArea.setDataValue(str2);
        }
    },
    logDebugServer: function(string) {
        if (this._debug) {
            str1 = this.dataCenterDebugArea.getDataValue();
            str2 = str1 + "<p><br><b>DEBUG NODES:</b></br>" + string + "</p>";
            this.dataCenterDebugArea.setDataValue(str2);
        }
    },
    logDebugDataCenter: function(string) {
        if (this._debug) {
            str1 = this.dataCenterDebugArea.getDataValue();
            str2 = str1 + "<p><br><b>DEBUG GLOBAL:</b></br>" + string + "</p>";
            this.dataCenterDebugArea.setDataValue(str2);
        }
    },

    labelNodemanagerLogsClick: function(inSender, inEvent) {
        try {
            this.panelNodemanagerLogs.domNode.style.backgroundColor = this._LogFrameColor;
            this.labelNodemanagerLogs.domNode.style.backgroundColor = this._LogFrameColor;
            
            this.layerNodeManagerLogs.activate();
            this.labelOpenkviLogs.domNode.style.backgroundColor = "#eeeeee";
            //this.labelNodemanagerLogs.domNode.style.backgroundColor = "#e0e0e0";
            this.labelNodemanagerLogs.setBorder('1,2,0,1');
            this.labelOpenkviLogs.setBorder('1,1,0,1');
            this.labelOpenkviLogs.removeUserClass("wm_TextDecoration_Bold");
            this.labelNodemanagerLogs.addUserClass("wm_TextDecoration_Bold");

        } catch (e) {
            console.error('ERROR IN labelNodemanagerLogsClick: ' + e);
        }
    },
    labelOpenkviLogsClick: function(inSender, inEvent) {
        try {
            this.panelOpenkviLogs.domNode.style.backgroundColor = this._LogFrameColor;
            this.labelOpenkviLogs.domNode.style.backgroundColor = this._LogFrameColor;
            
            this.layerOpenkviLogs.activate();
            this.labelNodemanagerLogs.domNode.style.backgroundColor = "#eeeeee";
            //this.labelOpenkviLogs.domNode.style.backgroundColor = "#e0e0e0";
            this.labelOpenkviLogs.setBorder('1,2,0,1');
            this.labelNodemanagerLogs.setBorder('1,1,0,1');
            this.labelNodemanagerLogs.removeUserClass("wm_TextDecoration_Bold");
            this.labelOpenkviLogs.addUserClass("wm_TextDecoration_Bold");
        } catch (e) {
            console.error('ERROR IN labelOpenkviLogsClick: ' + e);
        }
    },
    clearOpenkviLogsBtnClick: function(inSender) {
        try {
            this.dataCenterDebugArea.setDataValue("");
            this.dataCenterDebugArea.frame.contentWindow.focus();

        } catch (e) {
            console.error('ERROR IN clearOpenkviLogsBtnClick: ' + e);
        }
    },
    // <DISPLAY NODEMANAGERD LOGS>  //
    TabCenterLogsShow: function(inSender) {
        try {
            //this.labelNodemanagerLogsClick();
            this.javaReadLogFile.update();
            setTimeout(function() {
                try {
                    wm.Page.getPage("Main").reloadNodemanagerLogFile();
                } catch (e) {
                    alert(e);
                }
            }, 10000);

        } catch (e) {
            console.error('ERROR IN TabCenterLogsShow: ' + e);
        }
    },
    reloadNodemanagerLogFile: function() {
        try {
            if (this.layerDataCenter.isActive() && this.TabCenterLogs.isActive()) {
                this.javaReadLogFile.update();
                setTimeout(function() {
                    try {
                        wm.Page.getPage("Main").reloadNodemanagerLogFile();
                    } catch (e) {
                        alert(e);
                    }
                }, 15000);
            }
        } catch (e) {
            console.error('ERROR IN TabCenterLogsShow: ' + e);
        }
    },
    javaReadLogFileResult: function(inSender, inDeprecated) {
        this.readLogFile();
    },
    readLogFile: function() {
        try {
            var result = this.javaReadLogFile.getValue("dataValue");
            if (result) {
                var list = result.split("\n");
                var dispStr = "";
                var addToArea = false;
                for (var i = 1; i < list.length; i++) {
                    addToArea = false;
                    var elts = list[i].split("::");
                    //<font color = "838888">' + args[1] + '</font>'
                    var tmpStr = "";
                    var color = "black";
                    if (elts[1] === "[ERROR]") {
                        color = "Red";
                        if (this.checkErrorLogs.getChecked()) {
                            addToArea = true;
                        }
                    } else if (elts[1] === "[WARNING]") {
                        color = "OrangeRed ";
                        if (this.checkWarningLogs.getChecked()) {
                            addToArea = true;
                        }
                    } else if (elts[1] === "[INFO]") {
                        color = "DarkSlateBlue ";
                        if (this.checkInfoLogs.getChecked()) {
                            addToArea = true;
                        }
                    } else if (elts[1] === "[EVENT]") {
                        color = "Green";
                        if (this.checkEventLogs.getChecked()) {
                            addToArea = true;
                        }
                    } else if (elts[1] === "[DEBUG]") {
                        color = "Grey";
                        if (this.checkDebugLogs.getChecked()) {
                            addToArea = true;
                        }
                    }
                    if (addToArea) {
                        tmpStr = '<font color = "' + color + '">' + elts[0] + '  <b>' + elts[1] + '</b>  ' + elts[2] + '</font>';
                        dispStr += tmpStr + "</br>";
                    }
                }
                this.nodemanagerLogArea.setDisplayValue(dispStr);
            }
        } catch (e) {
            console.error('ERROR IN javaReadLogFileResult: ' + e);
        }
    },
    onLogCheckboxChange: function(inSender) {
        try {
            this.readLogFile();
        } catch (e) {
            console.error('ERROR IN onLogCheckboxChange: ' + e);
        }
    },
    // </DISPLAY NODEMANAGERD LOGS>  //
    ///// END Debugging functions: //////////////////////////////////////////////////
    javaGetLocalHostnameResult: function(inSender, inDeprecated) {
        try {
            var user = this.templateUsernameVar.getValue("dataValue");
            var dc = "<i>"+user+"</i>"+" @ <b>"+this.javaGetLocalHostname.getValue("dataValue")+"</b>";
            this.varCenterHostname.setValue("dataValue", this.javaGetLocalHostname.getValue("dataValue"));
            this.labelUserInfoPath.setCaption(dc + " <small>></small> ");
            this.labelDatacenter.setCaption(this.javaGetLocalHostname.getValue("dataValue"));
            this.addToolTip(this.pictureHome.domNode, "Data Center's Home", this.varCenterHostname.getValue("dataValue"), "help", 800);
            this.labelDatacenterClick()
        } catch (e) {
            this.showToastError(this.name + "ERROR IN javaGetLocalHostnameResult: " + e.toString());
            console.error('ERROR IN javaGetLocalHostnameResult: ' + e);
        }
    },
    templateUsernameVarSuccess: function(inSender, inDeprecated) {
        try {
            var user = this.templateUsernameVar.getValue("dataValue");
            this.javaSetUser.input.setValue("name", user);
            this.javaSetUser.update();

            var dc = "<i>"+user+"</i>"+" @ <b>"+this.javaGetLocalHostname.getValue("dataValue")+"</b>";
            this.varCenterHostname.setValue("dataValue", this.javaGetLocalHostname.getValue("dataValue"));
            this.labelUserInfoPath.setCaption(dc + " <small>></small> ");
            this.labelDatacenter.setCaption(this.javaGetLocalHostname.getValue("dataValue"));

        } catch (e) {
            console.error('ERROR IN templateUsernameVarSuccess: ' + e);
        }
    },
    pictureSmallOpenkviClick: function(inSender) {
        try {
            this.hideOpenkviToolTip();
            if ((this._userRole === "User") || (this._userRole === "PowerUser")) {
                this.SmallHeaderMenu.setHeight("220");
            } else {
                this.SmallHeaderMenu.setHeight("284");
            }

            this.SmallHeaderMenu.fixPositionNode = inSender.domNode;
            this.SmallHeaderMenu.domNode.style.top = "20px";
            this.SmallHeaderMenu.domNode.style.left = "40px";
            if (this.SmallHeaderMenu.showing === false) {
                this.panelSmallOpenkvi.addUserClass("wm_BackgroundColor_SteelBlue");
                this.SmallHeaderMenu.fixPositionNode = inSender.domNode;
                this.SmallHeaderMenu.show();
                //dojo.style(this.SmallHeaderMenu.domNode, "opacity", 0.5);
                this.SmallHeaderMenu.domNode.style.top = "28px";
                this.SmallHeaderMenu.domNode.style.left = "4px";
            } else {
                this.panelSmallOpenkvi.removeUserClass("wm_BackgroundColor_SteelBlue");
                this.SmallHeaderMenu.domNode.style.top = "24px";
                this.SmallHeaderMenu.domNode.style.left = "4px";
                this.SmallHeaderMenu.hide();
            }

        } catch (e) {
            console.error('ERROR IN pictureSmallOpenkviClick: ' + e);
        }
    },
    onHelpClick: function(inSender) {
        try {
            this.dialogHelp.setHeight("500px");
            this.dialogHelp.setWidth("700px");
            var file = "";
            this.helpText.setDataValue("");
            var str = "";
            if (inSender.name === "helpLifecycleBtn") {
                file = "lifecycle.help";
                this.helpText.setCaption("<B><U>Lifecycle controls:</U></B>");
            } else if (inSender.name === "helpHardOptionsBtn") {
                file = "hardwareoptions.help";
                this.helpText.setCaption("<B><U>Hardware features:</U></B>");
            } else if (inSender.name === "helpBootOptionsBtn") {
                file = "bootoptions.help";
                this.helpText.setCaption("<B><U>Booting options:</U></B>");
            } else if (inSender.name === "helpClockOptionsBtn") {
                file = "clockoptions.help";
                this.helpText.setCaption("<B><U>Clock options:</U></B>");
            } else if (inSender.name === "helpCpuAllocBtn") {
                file = "processor.help";
                this.helpText.setCaption("<B><U>Processor option:</U></B>");
            } else if (inSender.name === "helpVideoCardBtn") {
                file = "videocard.help";
                this.helpText.setCaption("<B><U>Video Card option:</U></B>");
            } else if (inSender.name === "helpGraphicsBtn") {
                file = "graphics.help";
                this.helpText.setCaption("<B><U>Graphics option:</U></B>");
            } else if (inSender.name === "helpCpuAdvancedBtn") {
                file = "cpumodels.help";
                this.helpText.setCaption("<B><U>CPU model:</U></B>");

            } else if (inSender.name.indexOf("Whatsnew") > -1) {
                var tmpver = this.openkviVersion.caption.split(".");
                var version = tmpver[0] + "." + tmpver[1];
                file = "news-" + version + ".help";
                this.helpText.setCaption("");
                //str = "<h1>What's new in version "+version+"</h1></br>";
                this.dialogHelp.setHeight("700px");
                this.dialogHelp.setWidth("700px");

            } else if (inSender.name.indexOf("UserGuide") > -1) {
                file = "user_guide/user_guide.html";
                this.helpText.setCaption("");
                //str = "<h1>What's new in version "+version+"</h1></br>";
                this.dialogHelp.setHeight("800px");
                this.dialogHelp.setWidth("900px");

            }

            if (file !== "") {
                this.javaGetHelp.input.setValue("help", file);
                this.javaGetHelp.update();
            } else {
                this.helpText.setDataValue(str + "Sorry, there is no help available yet on this topic");
                this.dialogHelp.show();
            }

        } catch (e) {
            this.showToastError(" IN onBHelpClick:" + e.toString());
            console.error('ERROR IN onBHelpClick: ' + e);
        }
    },
    bthPrintHelpClick: function(inSender) {
        try {
            this.dialogHelp.print();

        } catch (e) {
            console.error('ERROR IN bthPrintHelpClick: ' + e);
        }
    },
    javaGetHelpResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaGetHelp.getValue("dataValue");
            this.helpText.setDataValue(result);
            this.dialogHelp.show();

        } catch (e) {
            this.showToastError(" IN javaGetHelpResult:" + e.toString());
            console.error('ERROR IN javaGetHelpResult: ' + e);
        }
    },
    createToolTip: function() {
        this._toolTipList = {};
        this.OpenkviTooltip = new PNotify({
            type: "notice",
            title: "Tooltip",
            text: "I'm not in a stack. I'm positioned like a tooltip with JavaScript.",
            hide: false,
            buttons: {
                closer: false,
                sticker: false
            },
            history: {
                history: false
            },
            animate_speed: 100,
            animation: 'fade',
            cornerclass: 'openkvi_curved_tooltip',
            opacity: 0.9,
            icon: false,
            // Setting stack to false causes PNotify to ignore this notice when positioning.
            stack: false,
            auto_display: false
        });
        // Remove the notice if the user mouses over it.
        /*
        this.OpenkviTooltip.get().mouseout(function() {
            wm.Page.getPage("Main").OpenkviTooltip.remove();
        });*/
    },
    addToolTip: function(tipTarget, tipTitle, tipMsg, tipType, tipDelay) {
        try {
            if (typeof(tipType)==='undefined') tipType = "notice";
            if (typeof(tipDelay)==='undefined') tipDelay = 0;
            // tipType is either: error, notice, info or success
            // ypeDelay is in micoseconds
            var tipDiv = null;
            if (typeof(tipTarget) === "string") {
                tipDiv = dojo.byId(tipTarget);
            } else {
                tipDiv = tipTarget;
                tipTarget = dojo.attr(tipDiv, "id");
            }
            
            this._toolTipList[tipTarget] = {};
            this._toolTipList[tipTarget].title = tipTitle;
            this._toolTipList[tipTarget].msg = tipMsg;
            this._toolTipList[tipTarget].type = tipType;
            this._toolTipList[tipTarget].delay = tipDelay;
			this.connect(tipDiv, "onmouseenter", this, dojo.hitch(this, "showOpenkviToolTip", tipTarget));
			this.connect(tipDiv, "onmousemove", this, dojo.hitch(this, "moveOpenkviToolTip"));
			this.connect(tipDiv, "onmouseleave", this, dojo.hitch(this, "hideOpenkviToolTip"));
            this.connect(tipDiv, "onclick", this, dojo.hitch(this, "hideOpenkviToolTip"));
        } catch (e) {
            console.error('ERROR IN addToolTip: ' + e);
        }
    },
    updateToolTip: function(tipTarget, tipTitle, tipMsg, tipType, tipDelay) {
        try {
            var tipDiv = null;
            if (typeof(tipTarget) === "string") {
                tipDiv = dojo.byId(tipTarget);
            } else {
                tipDiv = tipTarget;
                tipTarget = dojo.attr(tipDiv, "id");
            }
            if (tipType !== undefined) {
                this._toolTipList[tipTarget].type = tipType;
            }
            if (tipDelay !== undefined) {
                 this._toolTipList[tipTarget].delay = tipDelay;
            }
            this._toolTipList[tipTarget].title = tipTitle;
            this._toolTipList[tipTarget].msg = tipMsg;
            
        } catch (e) {
            console.error('ERROR IN updateToolTip: ' + e);
        }
    },
    
    showOpenkviToolTip: function(ref) {
        try {
            if ((! this.serverPopup.showing) && 
                (! this.VmPopupMenu.showing) && 
                (! this.VmPopupMenuRemove.showing) &&
                (! this.snapshotPopup.showing)) {
                tipTitle = this._toolTipList[ref].title;
                tipMsg = this._toolTipList[ref].msg;
                tipType = this._toolTipList[ref].type;
                tipDelay = this._toolTipList[ref].delay;
                
                var tipSettings = {
                    title: '<font size="2.5">'+tipTitle+'</font>',
                    type: tipType,
                    icon: false,
                    addclass: "",
                    text: tipMsg };
                
                if (tipType === "error") {
                    tipSettings.icon = "ui-icon ui-icon-alert";
                } else if (tipType === "info") {
                    tipSettings.icon = "ui-icon ui-icon-info";
                } else if (tipType === "success") {
                    tipSettings.icon = "ui-icon ui-icon-check";
                } else if (tipType === "notice") {
                    tipSettings.addclass = "pnotify_notice";
                } else if (tipType === "help") {
                    tipSettings.addclass = "pnotify_help";
                }
                
                if (tipDelay > 0) {
                    this.hideOpenkviToolTip();
                    this._openkviToolTipTimeoutRef = setTimeout(function() {
                        try {
                            wm.Page.getPage("Main").OpenkviTooltip.update(tipSettings);
                            wm.Page.getPage("Main").OpenkviTooltip.open();
                        } catch (e) {
                            alert(e);
                        }
                    },tipDelay);
            
                } else {
                    this.OpenkviTooltip.update(tipSettings);
                    this.OpenkviTooltip.open();
                }
            } else {
                this.OpenkviTooltip.remove();
            }
        } catch (e) {
            console.error('ERROR IN showOpenkviToolTip: ' + e);
        }
    },
    hideOpenkviToolTip: function() {
        try {
            this.OpenkviTooltip.remove();
            if (this._openkviToolTipTimeoutRef !== undefined) {
                clearTimeout(this._openkviToolTipTimeoutRef);
            }
    
        } catch (e) {
            console.error('ERROR IN hideOpenkviToolTip: ' + e);
        }
    },
    moveOpenkviToolTip: function(event) {
        try {
            this.OpenkviTooltip.get().css({
                'top': event.clientY + 12,
                'left': event.clientX + 12
            });
    
        } catch (e) {
            console.error('ERROR IN moveOpenkviToolTip: ' + e);
        }
    },
    showVmPopup: function() {
        try {
            if (this._userRole === "User") {
                this.VmPopupMenu.setHeight("226");
            }
            this.VmPopupMenu.show();
            /*
            dojo.animateProperty({
                node: this.panelVmPopupMenu.domNode,
                duration: 500,
                properties: {
                    height: {
                        start: '0',
                        end: '334',
                        unit: "px"
                    },
                    width: {
                        start: '190',
                        end: '190',
                        unit: "px"
                    }
                }
            }).play();*/

        } catch (e) {
            this.showToastError(" IN showVmPopup:" + e.toString());
            console.error('ERROR IN showVmPopup: ' + e);
        }
    },
    //position popups
    onPopupDialogShow: function(inSender) {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vmName = dic[0];
            var node = dic[1];

            var varStatus = "Status" + vmName + "__" + node;
            var vmStatus = this[varStatus].getValue("dataValue");

            if (vmStatus === "running") {
                this.disableLabel(this.labelVmStart);
                this.enableLabel(this.labelVmStop);
                this.enableLabel(this.labelVmPause);
                this.enableLabel(this.labelVmSuspend);
                this.enableLabel(this.labelVmReboot);
                this.enableLabel(this.labelVmKill);

            } else if (vmStatus === "stopped") {
                this.labelVmStart.setCaption("Power on");
                this.enableLabel(this.labelVmStart);
                this.disableLabel(this.labelVmStop);
                this.disableLabel(this.labelVmPause);
                this.disableLabel(this.labelVmReboot);
                this.disableLabel(this.labelVmKill);
                this.disableLabel(this.labelVmSuspend);

            } else if (vmStatus === "suspended") {
                this.labelVmStart.setCaption("Power on");
                this.enableLabel(this.labelVmStart);
                this.disableLabel(this.labelVmStop);
                this.disableLabel(this.labelVmPause);
                this.disableLabel(this.labelVmReboot);
                this.disableLabel(this.labelVmKill);
                this.disableLabel(this.labelVmSuspend);

            } else if (vmStatus === "paused") {
                this.labelVmStart.setCaption("Resume");
                this.enableLabel(this.labelVmStart);
                this.disableLabel(this.labelVmStop);
                this.disableLabel(this.labelVmPause);
                this.disableLabel(this.labelVmReboot);
                this.enableLabel(this.labelVmKill);
                this.disableLabel(this.labelVmSuspend);

            }


            var top = this.varMousePosition.getValue("top");
            var left = this.varMousePosition.getValue("left");
            this.setMenuPosition(inSender, top, left);
            //inSender.domNode.style.top = top+"px";
            //inSender.domNode.style.left = left+"px";
        } catch (e) {
            this.showToastError("onPopupDialogShow Error: " + e.toString());
            console.error('ERROR IN onPopupDialogShow: ' + e);
        }
    },
    enableLabel: function(inSender) {
        try {
            inSender.setDisabled(false);
            inSender.removeUserClass("wm_FontColor_LightGray");
            inSender.addUserClass("wm_FontColor_White");
        } catch (e) {
            this.showToastError("ERROR IN enableLabel: " + e.toString());
            console.error('ERROR IN enableLabel: ' + e);
        }
    },
    disableLabel: function(inSender) {
        try {
            inSender.setDisabled(true);
            inSender.removeUserClass("wm_FontColor_White");
            inSender.addUserClass("wm_FontColor_LightGray");
        } catch (e) {
            this.showToastError("ERROR IN disableLabel: " + e.toString());
            console.error('ERROR IN enableLabel: ' + e);
        }
    },
    // hide popups :
    mainLayoutBoxRightClick: function(inSender, event) {
        try {
            this.serverPopup.hide();
            this.MenuDialogCenter.hide();
            this.VmPopupMenu.hide();
            this.VmPopupMenuRemove.hide();
            this.snapshotPopup.hide();
            this.timezonesDialog.hide();
            if (this.SmallHeaderMenu.showing === true) {
                this.SmallHeaderMenu.hide();
            }
        } catch (e) {
            console.error('ERROR IN mainLayoutBoxRightClick: ' + e);
        }
    },
    // confirm dialog 
    showConfirmDialog: function(text, callback, cancel) {
        try {
            if (cancel) {
                this.confirmDialog.button2Caption = "Cancel";
            } else {
                this.confirmDialog.button2Caption = "";
            }
            this.confirmDialog.setInputDataValue(callback);
            this.confirmDialog.setUserPrompt(text);
            this.confirmDialog.show();
        } catch (e) {
            this.showToastError(" IN showConfirmDialog:" + e.toString());
            console.error('ERROR IN showConfirmDialog: ' + e);
        }
    },

    confirmDialogButton1Click: function(inSender, inButton, inText) {
        try {
            this[inText](true);
        } catch (e) {
            this.showToastError(" IN confirmDialogButton1Click:" + e.toString());
            console.error('ERROR IN confirmDialogButton1Click: ' + e);
        }
    },
    confirmDialogButton2Click: function(inSender, inButton, inText) {
        try {
            this.confirmDialog.hide();
            this[inText](false);
        } catch (e) {
            console.error('ERROR IN confirmDialogButton2Click: ' + e);
        }
    },

    javaMonitorInputStringResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaMonitorInputString.getValue("dataValue");
            if (result !== "") {
                this.logDebugDataCenter("javaMonitorInputStringResult: " + result);
            }
            var cookieTest = dojo.cookie("closingTest");
            if (result.indexOf("Unable to load javaTools") > -1) {
                if (cookieTest === "closed") {
                    this.nodemanagerListener.input.setValue("clientId", 0);
                    this.nodemanagerListener.update();
                    return;
                } else {
                    window.location = "/openkvi/login.html";
                }
            }
            if (result.indexOf("MONITOR_ERROR") > -1) {
                if (result.indexOf("session expired") > 0) {
                    this.sessionExpired();
                    return;
                } else if (result.indexOf("socket closed") > -1) {
                    this._isLogout = true;
                    this.labelSessionInfo.setCaption("Nodemanager backend has been stopped !");
                    this.sessionExpiredDialog.show();
                    this.nodemanagerListener.input.setValue("clientId", -1);
                    return;
                } else if (cookieTest === "closed") {
                    this.nodemanagerListener.input.setValue("clientId", 0);
                    this.nodemanagerListener.update();
                    this._isClosing = false;
                    return;
                } else if (cookieTest === "RELOAD") {
                    window.location = "/openkvi/index.html";
                } else {
                    window.location = "/openkvi/login.html";
                    return;
                }

            } else if (result.indexOf("hello") === -1) {
                this.javaMonitorInputString.update();
                var jsonVar = JSON.parse(result);
                var messages = jsonVar.messages;

                for (var j = 0; j < messages.length; j++) {
                    params = messages[j].split(";");
                    if (params[0].indexOf("CONTROL NODE") > -1) {
                        this.handleNodeInfo(params[1]);
                    } else if (params[0].indexOf("CONTROL VM") > -1) {
                        this.handleVmInfo(params[1]);
                    } else if (params[0].indexOf("EVENT") > -1) {
                        this.handleEventInfo(params[1]);
                    } else if (params[0].indexOf("CONTROL GENERAL") > -1) {
                        this.handleControlInfo(params[1]);
                    }
                }
            } else {
                var clientId = this.varClientId.getValue("dataValue");
                this.javaMonitorInputString.input.setValue("clientId", clientId);
                this.javaMonitorInputString.update();
            }

        } catch (e) {
            this.showToastError("javaMonitorInputStringResult Error: " + e.toString());
            console.error('ERROR IN javaMonitorInputStringResult: ' + e);
        }
    },
    nodemanagerListenerResult: function(inSender, inDeprecated) {
        try {
            var result = this.nodemanagerListener.getValue("dataValue");
            this.logDebugDataCenter("nodemanagerListener: " + result);
            if (result.indexOf('::') > 0) {
                var infos = result.split("::");

                if ((infos[1].indexOf("ERROR") > -1) || (infos[1].indexOf("Error: ") === 0)) {
                    if ((infos[1].indexOf("socket closed") > -1) || (infos[1].indexOf("Read timed out") === -1)) {
                        this._isLogout = true;
                        this.labelSessionInfo.setCaption("Nodemanager backend is not running !");
                        this.sessionExpiredDialog.show();
                        this.nodemanagerListener.input.setValue("clientId", -1);
                    }

                } else if (infos[1].indexOf("started") === 0) {
                    this.nodemanagerListener.input.setValue("clientId", infos[0]);
                    this.javaMonitorInputString.input.setValue("clientId", infos[0]);
                    this.javaMonitorInputString.update();
                    this.varClientId.setValue("dataValue", infos[0]);
                    this.stopMonitoring.input.setValue("clientId", infos[0]);
                    if (this.sessionExpiredDialog.showing === true) {
                        app.loadPage("Main");
                    }

                } else {
                    this.nodemanagerListener.input.setValue("clientId", infos[0]);
                }
                //this.nodemanagerListener.update();
            } else if (result.indexOf('Unable to load javaTools.json status:0') > -1) {
                //This happens when using backward button or backspace in chrome
                this.logDebugDataCenter("nodemanagerListener: OpenKVI backwarding has been cancelled");
                this.nodemanagerListener.input.setValue("clientId", -1);
                this.nodemanagerListener.update();
            }

        } catch (e) {
            console.error('ERROR IN nodemanagerListenerResult: ' + e);
            this.showToastError("nodemanagerListenerResult Error: " + e.toString());
        }
    },

    // Search for VM or Node
    textRightSearchChange: function(inSender) {
        try {
            var search = this.textRightSearch.getDisplayValue();
            var found = false;
            if (search !== "") {
                var vmCount = this.tablevmsLiveVariable2.getCount();
                var nodeCount = this.tableserversLiveVariable1.getCount();
                var data = null;
                var node = "";
                var vName = "";
                var varPanel = "";
                var state = "";
                var tmpNode = "";
                for (var i = 0; i < vmCount; i++) {
                    data = this.tablevmsLiveVariable2.getData()[i];
                    node = data.server;
                    vName = data.name;
                    vDisplayedName = data.displayedname;
                    if (vDisplayedName === search) {
                        found = true;
                        this.varSelectedServer.setValue("dataValue", node);
                        for (var l = 0; l < nodeCount; l++) {
                            data = this.tableserversLiveVariable1.getData()[l];
                            tmpNode = data.name;
                            varPanel = "LabelArrow" + tmpNode;
                            //state = this[varPanel].getValue("domNode.title");
                            state = this._toolTipList[varPanel].msg;
                            if ((state === "Collapse") && (tmpNode !== node)) {
                                this.CollapseServer(tmpNode);
                            }
                        }
                        varPanel = "LabelArrow" + node;
                        //state = this[varPanel].getValue("domNode.title");
                        state = this._toolTipList[varPanel].msg;
                        if (state === "Expand") {
                            this.ExpandServer(node);
                        }
                        this.varSelectedServer.setValue("dataValue", node);
                        this.varSelectedVm.setValue("dataValue", vName + "__" + node);
                        this.labelVMClick(vName + "__" + node);
                        break;
                    }
                }
                if (found === false) {
                    for (var j = 0; j < nodeCount; j++) {
                        data = this.tableserversLiveVariable1.getData()[j];
                        node = data.name;
                        if (search === node) {
                            found = true;
                            this.varSelectedServer.setValue("dataValue", node);
                            this.labelServerClick(node);
                            break;
                        }
                    }
                }

                if (found === false) {
                    for (i = 0; i < vmCount; i++) {
                        data = this.tablevmsLiveVariable2.getData()[i];
                        node = data.server;
                        vName = data.name;
                        vDisplayedName = data.displayedname;
                        if (vDisplayedName.toLowerCase() === search.toLowerCase()) {
                            found = true;
                            this.varSelectedServer.setValue("dataValue", node);
                            for (var n = 0; n < nodeCount; n++) {
                                data = this.tableserversLiveVariable1.getData()[n];
                                tmpNode = data.name;
                                varPanel = "LabelArrow" + tmpNode;
                                //state = this[varPanel].getValue("domNode.title");
                                state = this._toolTipList[varPanel].msg;
                                if ((state === "Collapse") && (tmpNode !== node)) {
                                    this.CollapseServer(tmpNode);
                                }
                            }
                            varPanel = "LabelArrow" + node;
                            //state = this[varPanel].getValue("domNode.title");
                            state = this._toolTipList[varPanel].msg;
                            if (state === "Expand") {
                                this.ExpandServer(node);
                            }
                            this.varSelectedServer.setValue("dataValue", node);
                            this.varSelectedVm.setValue("dataValue", vName + "__" + node);
                            this.labelVMClick(vName + "__" + node);
                            break;
                        }
                    }
                }
                if (found === false) {
                    for (var k = 0; k < nodeCount; k++) {
                        data = this.tableserversLiveVariable1.getData()[k];
                        node = data.name;
                        if (search.toLowerCase() === node.toLowerCase()) {
                            found = true;
                            this.varSelectedServer.setValue("dataValue", node);
                            this.labelServerClick(node);
                            break;
                        }
                    }
                }
            }
            this.layerShowSearch.activate();
        } catch (e) {
            this.showToastError("textRightSearchChange Error: " + e.toString());
            console.error('ERROR IN textRightSearchChange: ' + e);
        }
    },
    CloseSearchBtnClick: function(inSender) {
        try {
            this.textRightSearch.clear();
            this.layerLogs.activate();

        } catch (e) {
            console.error('ERROR IN CloseSearchBtnClick: ' + e);
        }
    },

    handleControlInfo: function(strInfos) {
        try {
            this.logDebugDataCenter("HandleControlInfo:" + strInfos);
            var jsonVar = JSON.parse(strInfos);
            var owner = jsonVar.sender;
            var target = jsonVar.node;
            var server = target;
            var task = jsonVar.action.name;
            if (task === "set_security_level") {
                if (jsonVar.action.result === "done") {
                    this._isLogout = true;
                    app.toastDialog.showToast("You will be disconnected ....", 4000, "Warning", "cc", "The Security Level has been updated !");
                    setTimeout(function() {
                        try {
                            window.location = "/openkvi/login.html";
                        } catch (e) {
                            alert(e);
                        }
                    }, 5000);
                }
            } else if (task === "set_debug") {
                this.changeDebugMode(jsonVar.action.result);
            }
        } catch (e) {
            console.error('ERROR IN handleControlInfo: ' + e);
            this.showToastError("handleControlInfo Error: " + e.toString());
        }
    },

    handleNodeInfo: function(strInfos) {
        try {
            this.logDebugDataCenter("HandleNodeInfos:" + strInfos);
            var jsonVar = JSON.parse(strInfos);
            var owner = jsonVar.sender;
            var target = jsonVar.node;
            var server = target;
            var task = jsonVar.action.name;
            var doUpdate = true;
            var status = "";
            var varLabel = "";
            var bUpdateLiveVariable = true;

            switch (task) {
            case "add":
                varPanel = "panelNode" + target;
                if (this[varPanel] === undefined) {
                    task = "Add new node";
                    if (jsonVar.action.result.state !== undefined) {
                        status = jsonVar.action.result.state;
                    } else {
                        status = jsonVar.action.result;
                    }
                    if (status.indexOf("Failed") < 0) {
                        app.toastInfo(target + " has been added to OpenKVI");
                        var ip = jsonVar.action.result.ip;
                        var virt = jsonVar.action.driver;
                        if ((this.tableserversDialog.showing) &&
                            (this.tableserversDialog.title === "Add Discovered Node")) {
                            var index = this.gridAvailableNodes.getSelectedIndex();
                            this.gridAvailableNodes.deleteRow(index);
                        }
                        this.addNewServer(target, ip, virt, true);
                        this.listAllServersLiveVar.update();
                        if (this.TabCenterOverview.isActive()) {
                            this.javaGetAllNodesInfo.update();
                        }
                    } else {
                        app.toastDialog.showToast(status, 5000, "Warning", "cc", target + " cannot be added.");
                    }
                }
                break;
            case "remove":
                task = "Remove node";
                console.error(strInfos);
                status = jsonVar.action.result;
                var panelName = "panelMain" + target;
                if (this[panelName] !== undefined) {
                    this.removeServer(target);
                }
                this.removeDashboardNode(target);
                this.listAllServersLiveVar.update();
                break;
            case "reconnect":
                task = "Reconnecting node";
                status = jsonVar.action.result.state;
                if (status.indexOf("Failed") < 0) {
                    this.setNodeConnected(target, jsonVar.action.result);
                }
                break;
            case "connect":
                task = "Connecting node";
                status = jsonVar.action.result;
                break;
            case "local_import":
                doUpdate = false;
                var localVmImportList = jsonVar.action.result;
                var vmList = "";
                for (var j = 0; j < localVmImportList.length; j++) {
                    vName = localVmImportList[j].vm;
                    status = localVmImportList[j].status;
                    if (status === "Successful") {
                        state = localVmImportList[j].state;
                        if (vName === "OpenKVI") {
                            this.addOpenKVI(vName, server, false);
                        } else {
                            this.addVM(vName, server, false);
                        }
                        if (vmList.length === 0) {
                            vmList = vName;
                        } else {
                            vmList += "::" + vName;
                        }
                    }
                    this.updateLog("Import virtual machine", vName, server, status, owner);
                }
                var varLabelArrow = "LabelArrow" + server;
                //var labelState = this[varLabelArrow].getValue("domNode.title");
                var labelState = this._toolTipList[varLabelArrow].msg;
                if (labelState === "Collapse") {
                    var varGetVmListStatus = server + "javaGetVmListStatus";
                    this[varGetVmListStatus].input.setValue("node", server);
                    this[varGetVmListStatus].input.setValue("vmList", vmList);
                    this[varGetVmListStatus].update();
                }


                this.tablevmsLiveVariable2.update();
                this.vmListByServerLive.filter.setValue("server", server);
                this.vmListByServerLive.update();
                var varIP = target + "ip";
                var sIP = this[varIP].getValue("dataValue");
                var javaNodeNetwork = target + "javaNodeNetwork";
                this[javaNodeNetwork].input.setValue("node", target);
                this[javaNodeNetwork].update();
                break;
            case "notify":
                var message = jsonVar.action.request;
                if (message === "renameVM") {
                    var oldname = jsonVar.action.result.oldname;
                    target = oldname;
                    owner = jsonVar.action.result.owner;
                    var libvirtname = jsonVar.action.result.vm;
                    var newname = jsonVar.action.result.newname;
                    status = "Successful. Rename \"" + oldname + "\" to \"" + newname + "\"";
                    task = "Rename Virtual Machine";
                    // update name in treeview if needed
                    if (this["Label" + libvirtname + "__" + server] !== undefined) {
                        this["Label" + libvirtname + "__" + server].setCaption(newname);
                    }
                    // update userInfopath label if needed
                    var user = this.templateUsernameVar.getValue("dataValue");
                    var dc = "<i>"+user+"</i>"+" @ <b>"+this.varCenterHostname.getValue("dataValue")+"</b>";
                    if (this.labelUserInfoPath.caption === dc + " <small>></small> " + server + " <small>></small> " + oldname) {
                        this.labelUserInfoPath.setCaption(dc + " <small>></small> " + server + " <small>></small> " + newname);
                    }
                    // update vm screensho name if needed
                    var screnshot_vm = dojo.byId("name_screenshot_vm_" + libvirtname);
                    if (screnshot_vm !== undefined && screnshot_vm !== null) {
                        dojo.html.set(screnshot_vm, newname);
                    }
                } else if (message === "reconnect") {
                    doUpdate = false;
                }
                break;
            case "network":
                bUpdateLiveVariable = false;
                var request = jsonVar.action.request;
                var request_info = JSON.parse(jsonVar.action.desc);
                if (request === "update") {
                    task = "Update Virtual Network";
                } else if (request === "create") {
                    task = "Create Virtual Network";
                } else if (request === "remove") {
                    task = "Remove Virtual Network";
                }
                target = request_info.name;
                status = jsonVar.action.result;
                doUpdate = true;
                if (!(this._waitForAllVmsNics)) {
                    var javaNodeNetwork2 = server + "javaNodeNetwork";
                    this[javaNodeNetwork2].input.setValue("node", server);
                    this[javaNodeNetwork2].update();
                }
                break;
            }

            if (bUpdateLiveVariable) {
                // update live variables
                this.tablevmsLiveVariable2.update();
                this.vmListByServerLive.filter.setValue("server", server);
                this.vmListByServerLive.update();
            }

            if (doUpdate === true) {
                this.updateLog(task, target, server, status, owner);
            }

            this.getAllNodesInfo();
        } catch (e) {
            this.showToastError("handleNodeInfo Error: " + e.toString());
            console.error('ERROR IN handleNodeInfo: ' + e);
        }
    },
    handleVmInfo: function(strInfos) {
        try {
            this.logDebugServer("vm infos:" + strInfos);
            var jsonVar = JSON.parse(strInfos);
            owner = jsonVar.sender;
            server = jsonVar.node;
            target = jsonVar.action.vm;
            task = jsonVar.action.name;
            status = jsonVar.action.result;
            if (task === "get") {
                task = "get " + jsonVar.action.request;
            }

            this.updateLog(task, target, server, status, owner);
        } catch (e) {
            this.showToastError("handleVmInfo Error: " + e.toString());
            console.error('ERROR IN handleVmInfo: ' + e);
        }
    },
    handleEventInfo: function(strInfos) {
        try {
            var jsonVar = JSON.parse(strInfos);

            //var infos = strInfos.split(';;');
            this.logDebugDataCenter("Event infos:" + strInfos);

            switch (jsonVar.event) {
            case "NODE_STATUS":
                this.processNodeEvent(jsonVar);
                break;
            case "VM_STATUS":
                this.processVmStatusEvent(jsonVar);
                break;
            case "VM_PROGRESS":
                this.processVmProgressEvent(jsonVar);
                break;
            case "VM_INFO":
                this.processVmInfoEvent(jsonVar);
                break;
            default:
                if (infos[0] === "service started") {
                    app.loadPage("Main");
                } else if (infos[0] === "service stopped") {
                    this.labelSessionInfo.setCaption("Service nodemanagerd is not running !");
                }
            }

        } catch (e) {
            this.showToastError("handleEventInfo Error: " + e.toString());
            console.error('ERROR IN handleEventInfo: ' + e);
        }
    },

    processNodeEvent: function(jsonVar) {
        try {
            var log = true;
            var sender = jsonVar.sender;
            var node = jsonVar.node;
            var state = jsonVar.status;
            var details = jsonVar.detail;
            var varPict = "PictServer" + node;
            var varPanelMain = "panelMain" + node;
            var varConnected = node + "connected";

            switch (state) {
            case "Warning":
                this.setNodeUnreachable(node, state);
                this.updateLog(state, node, node, details, sender, "warning");
                break;
            case "Error":
                this.setNodeUnreachable(node, state);
                this[varPict].setSource("resources/images/icons/server-error-30.png");
                this.updateLog(state, node, node, details, sender, "error");
                break;
            case "Networks":
                if (this.layerServerNetwork.isActive() && this.TabServersConfig.isActive() && !(this._waitForAllVmsNics)) {
                    var javaNodeNetwork = node + "javaNodeNetwork";
                    this[javaNodeNetwork].input.setValue("node", node);
                    this[javaNodeNetwork].update();
                }
                if (details !== "Bridges updated") {
                    this.updateLog(state, node, node, details, sender, "successful");
                }
                break;

            case "Connected":
                var varVirt = node + "virt";
                sVirt = this[varVirt].getValue("dataValue");
                var node_logo = "resources/images/icons/server-30.png";
                if (sVirt === "kvm") {
                    node_logo = "resources/images/icons/server-kvm.png";
                } else if (sVirt === "esx") {
                    node_logo = "resources/images/icons/server-esx.png";
                } else if (sVirt === "qemu") {
                    node_logo = "resources/images/icons/server-qemu.png";
                }

                this[varPict].setSource(node_logo);
                dojo.style(this[varPanelMain].domNode, "opacity", 1);
                this[varConnected].setValue("dataValue", true);
                this.updateLog(state, node, node, details, sender, "successful");
                this.getAllNodesInfo();
                break;

            default:
                if (state.indexOf("Error")) {
                    this[varPict].setSource("resources/images/icons/server-error-30.png");
                    dojo.style(this[varPanelMain].domNode, "opacity", 0.5);
                    this[varConnected].setValue("dataValue", false);
                    this.updateLog(state, node, node, details, sender, "error");
                }
            }
        } catch (e) {
            this.showToastError("processNodeEvent Error: " + e.toString());
            console.error('ERROR IN processNodeEvent: ' + e);
        }
    },
    processVmStatusEvent: function(jsonVar) {
        try {
            var log = true;
            var selectedNode = this.varSelectedServer.getValue("dataValue");
            var selectedVmInfos = this.varSelectedVm.getValue("dataValue").split("__");
            var selectedVm = selectedVmInfos[0];
            var vName = jsonVar.vm;
            var task = jsonVar.task;
            var status = jsonVar.status;
            var sender = jsonVar.sender;
            var node = jsonVar.node;
            var varVnc = "VNC" + vName + "__" + node;
            var varStatus = "Status" + vName + "__" + node;

            var changeStatus = true;
            if (this[varStatus] !== undefined) {
                changeStatus = "running";
            } else {
                changeStatus = false;
            }

            switch (task) {
            case "Started":
                switch (status) {
                case "Migrated":
                    log = false;
                    changeStatus = false;
                    break;
                case "Snapshot":
                    log = false;
                    changeStatus = false;
                    break;
                default:
                    if (status.indexOf("Failed") === -1) {
                        task = "Start";
                        changeStatus = "running";
                        var mig_suspend_cookie = dojo.cookie("migration_vm_suspended:::" + vName + ":::" + node);
                        if (mig_suspend_cookie === "active") {
                            dojo.cookie("migration_vm_suspended:::" + vName + ":::" + node, "inactive", {
                                expires: 0.00002
                            });
                            status = "Resumed after migration";
                        }
                    }
                }
                break;

            case "Stopped":
                changeStatus = "stopped";
                if (this[varVnc] !== undefined) {
                    this[varVnc].setValue("dataValue", "none");
                }

                switch (status) {
                case "Migrated":
                    log = false;
                    changeStatus = false;
                    break;
                case "Snapshot":
                    log = false;
                    changeStatus = false;
                    break;
                case "Shutdown":
                    var shutdown_cookie = dojo.cookie(vName + "_Shutdown");
                    if (shutdown_cookie !== undefined) {
                        log = false;
                    } else {
                        task = "Shutdown";
                        status = "VM stopped";
                    }
                    break;
                case "Destroyed":
                    task = "Stop";
                    status = "VM stopped";
                    break;
                case "Saved":
                    task = "Suspend";
                    var mig_cookie = dojo.cookie("openkvi_vm_migration_source_" + vName + "_" + node);
                    //vName+":::"+node+":::"+dest 
                    if ((mig_cookie !== undefined) && (mig_cookie.indexOf("active:::") > -1)) {
                        var mig_infos = mig_cookie.split(":::");
                        moved_to_node = mig_infos[1];
                        dojo.cookie("migration_vm_suspended:::" + vName + ":::" + moved_to_node, "active", {
                            expires: 0.012
                        });
                        status = "Saved for migration";
                    }
                    break;
                default:
                    if (status.indexOf("Failed") === -1) {
                        changeStatus = "stopped";
                    }
                }
                break;

            case "Shutdown":
                var tmp1_cookie = dojo.cookie("Reboot_" + vName + "_" + node);
                if (tmp1_cookie !== "SET") {
                    if (this[varVnc] !== undefined) {
                        this[varVnc].setValue("dataValue", "none");
                    }
                    changeStatus = "stopped";
                    dojo.cookie(vName + "_Shutdown", sender, {
                        //key expire after 2 seconds
                        expires: 0.00002
                    });
                } else {
                    log = false;
                }
                break;

            case "Resumed":
                switch (status) {
                case "Migrated":
                    task = "Pause";
                    node = "unknown";
                    break;
                case "Unpaused":
                    var tmp_cookie = dojo.cookie("Reboot_" + vName + "_" + node);
                    if (tmp_cookie === "SET") {
                        task = "Reboot";
                        status = "System has rebooted";
                        changeStatus = false;
                    } else {
                        var resumed_cookie = dojo.cookie(vName + "_Resumed");
                        if (resumed_cookie === undefined) {
                            var reboot_cookie = dojo.cookie(vName + "_Shutdown");
                            if (reboot_cookie !== undefined) {
                                task = "Reboot";
                                status = "System has rebooted";
                                sender = reboot_cookie;
                            } else {
                                task = "Pause";
                                status = "Resumed";
                                // Prevent double message emission
                                dojo.cookie(vName + "_Resumed", "SET", {
                                    //key expire after 2 seconds
                                    expires: 0.00002
                                });
                            }
                            changeStatus = "running";

                        } else {
                            log = false;
                            dojo.cookie(vName + "_Resumed", undefined, {
                                //key expire after 2 seconds
                                expires: 0.00002
                            });
                        }
                    }
                    break;
                default:
                    task = "Resume";
                    changeStatus = "running";
                }
                if ((this[varStatus] !== undefined) && (this[varStatus].getData("dataValue") === changeStatus)) {
                    log = false;
                }
                break;

            case "Suspended":
                switch (status) {
                case "Migrated":
                    log = false;
                    changeStatus = false;
                    break;
                case "Snapshot":
                    log = false;
                    changeStatus = "paused";
                    break;
                case "Paused":
                    task = "Pause";
                    changeStatus = "paused";
                    var task_cookie = dojo.cookie(task + "_" + vName + "_" + node);
                    if ((this[varStatus] !== undefined) && (this[varStatus].getData("dataValue") === changeStatus)) {
                        log = false;
                    } else if (task_cookie !== "SET") {
                        // If Pause has not been called by user then call addlog instead of updatelog
                        this.addLog(task, vName, node, 0, "info", sender, "Paused");
                        log = false;
                    }
                    break;
                default:
                    uri = '<image style="height: 20px;" src="resources/images/icons/20/pause' + ext + '"/>';
                    changeStatus = "paused";
                }
                break;

            case "Defined":
                changeStatus = false;
                switch (status) {
                case "Added":
                    // Those messages should not be used anymore
                    // "Add" is an Event not a status.
                    status = "Virtual Machine added";
                    if ((moved_vm === vName) && (moved_to_node === node)) {
                        log = false;
                    } else {
                        task = "Add Virtual Machine";
                    }
                    if (selectedNode === node) {
                        this.getNodeInformation(node, true);
                    }
                    break;
                case "Updated":
                    if (jsonVar.show_task === undefined) {
                        task = "Update Virtual Machine";
                    } else {
                        task = jsonVar.show_task;
                    }
                    if (task.indexOf(" NIC") > 0) {
                        if (this.layerServerNetwork.isActive() && this.TabServersConfig.isActive() && (selectedNode === node)) {

                            var varIP = node + "ip";
                            var sIP = this[varIP].getValue("dataValue");
                            var javaNodeNetwork = node + "javaNodeNetwork";
                            this[javaNodeNetwork].input.setValue("node", node);
                            this[javaNodeNetwork].update();
                        }
                    }
                    status = "Successful";
                    if (vName == selectedVm) {
                        this.reloadVmConfig("handleEventInfo");
                    }
                    break;
                }
                break;
            case "Undefined":
                if (status === "Removed") {
                    //VM deleted by another OpenKVI
                    this.removeVmData(vName, node);
                }
                break;
            case "Migration":
                var migrate_cookie_src = "";
                var destnode = "";
                if (status === "Successful") {
                    destnode = jsonVar.detail;
                    if (selectedVm === vName) {
                        this.labelVMClick(vName + "__" + destnode);
                    }
                    status = jsonVar.status + " : VM moved to " + destnode;

                } else {
                    if (selectedVm === vName) {
                        this.labelVMClick(vName + "__" + node);
                    }
                    status = jsonVar.status + " : " + jsonVar.detail;

                    migrate_cookie_src = dojo.cookie("openkvi_vm_migration_source_" + vName + "_" + node);
                    if (migrate_cookie_src.indexOf("active:::") > -1) {
                        var migrate_infos = migrate_cookie.split(":::");
                        destnode = mig_infos_src[1];
                    }
                }
                //key expire after 10 seconds
                dojo.cookie("openkvi_vm_migration_source_" + vName + "_" + node, "inactive", {
                    expires: 0.0001
                });
                dojo.cookie("openkvi_vm_migration_dest_" + vName + "_" + destnode, "inactive", {
                    expires: 0.0001
                });
                break;
            }


            if (changeStatus !== false) {
                var locked = this.vmIsLocked(vName + "__" + node);
                var lockName = this.getVmLock(vName + "__" + node);
                this.changeVmState(vName, node, changeStatus, locked, lockName);
                if (!locked) {
                    if ((this.TabVmScreen.isActive()) && (vName === selectedVm)) {
                        this.startVnc(vName + "__" + node);
                    }
                }
                this.getAllNodesInfo();
            }
            if (log) {
                this.updateLog(task, vName, node, status, sender);
            }

        } catch (e) {
            this.showToastError("processVmStatusEvent Error: " + e.toString());
            console.error('ERROR IN processVmStatusEvent: ' + e);
        }
    },
    processVmProgressEvent: function(jsonVar) {
        try {
            var vName = jsonVar.vm;
            var task = jsonVar.task;
            var sender = jsonVar.sender;
            var node = jsonVar.node;
            var desc = jsonVar.status;
            var percent = jsonVar.detail;
            if (percent > 0) {
                if (desc !== "") {
                    status = '<progress max="100" value="' + percent + '"></progress> &rArr; ' + desc;
                } else {
                    status = '<progress max="100" value="' + percent + '"></progress>';
                }

            } else if (percent < 0) {
                image = '<image style="height: 12px;" src="resources/images/icons/loading/ajax-bar-loader-12.gif" align="center"/>';
                if (desc !== "") {
                    status = image + ' &rArr; ' + desc;
                } else {
                    status = image;
                }
            }

            this.updateLog(task, vName, node, status, sender);

        } catch (e) {
            this.showToastError("processVmProgressEvent Error: " + e.toString());
            console.error('ERROR IN processVmProgressEvent: ' + e);
        }
    },
    processVmInfoEvent: function(jsonVar) {
        try {
            var vName = jsonVar.vm;
            var task = jsonVar.task;
            var node = jsonVar.node;
            var status = jsonVar.status;
            var detail = jsonVar.detail;
            var sender = jsonVar.sender;
            var currentVm = this.varSelectedVm.getValue("dataValue").split("__")[0];
            var mig_cookie = "";
            if (task.indexOf("snapshot") > 0) {
                switchTask = "snapshot";
            } else {
                switchTask = task;
            }

            switch (switchTask) {
            case "lock":
                if (status === "Locked") {
                    this.lockVm(node, vName, task, detail, sender);
                } else {
                    this.UnlockVm(node, vName, task, detail, sender);
                }
                break;

            case "snapshot":
                this.snapshotResult(node, vName, task, status, detail, sender);
                break;

            case "Migration":
                if (status === "Started") {
                    if (dojo.cookie("openkvi_vm_migration_source_" + vName + "_" + node) === undefined) {
                        var dest = jsonVar.destination;
                        //keys expire after 2 hours
                        dojo.cookie("openkvi_vm_migration_source_" + vName + "_" + node, "active:::" + dest, {
                            expires: 0.012
                        });
                        dojo.cookie("openkvi_vm_migration_dest_" + vName + "_" + dest, "active:::" + node, {
                            expires: 0.012
                        });
                    }
                }
                break;

            case "Add":
                task = "Add Virtual Machine";
                if (status.indexOf("Successful") > -1) {
                    this.defineVm(node, vName);
                }
                if (this.varSelectedServer.getValue("dataValue") === node) {
                    this.getNodeInformation(node, true);
                }
                // log info only if it's not a migration
                mig_cookie = dojo.cookie("openkvi_vm_migration_dest_" + vName + "_" + node);
                if ((mig_cookie === undefined) || (mig_cookie.indexOf("active") === -1)) {
                    this.updateLog(task, vName, node, status, sender);
                }
                break;

            case "Remove":
                task = "Remove from inventory";
                if (status.indexOf("Successful") > -1) {
                    this.removeVmData(vName, node);
                }
                // log info only if it's not a migration
                mig_cookie = dojo.cookie("openkvi_vm_migration_source_" + vName + "_" + node);
                if ((mig_cookie === undefined) || (mig_cookie.indexOf("active") === -1)) {
                    this.updateLog(task, vName, node, status, sender);
                }
                break;

            case "Delete":
                task = "Delete Virtual Machine";
                if (status.indexOf("Successful") > -1) {
                    this.removeVmData(vName, node);
                }
                // log info only if it's not a migration
                mig_cookie = dojo.cookie("openkvi_vm_migration_source_" + vName + "_" + node);
                if ((mig_cookie === undefined) || (mig_cookie.indexOf("active") === -1)) {
                    this.updateLog(task, vName, node, status, sender);
                }
                break;

            }
            this.getAllNodesInfo();
        } catch (e) {
            this.showToastError("processVmInfoEvent Error: " + e.toString());
            console.error('ERROR IN processVmInfoEvent: ' + e);
        }
    },

    lockVm: function(node, vm, task, lockinfo, sender) {
        try {
            this.setVmLock(vm + "__" + node, lockinfo, true);
            this.addLog(task, vm, node, 0, "info", sender, "VM Locked");
            var selectedVm = this.varSelectedVm.getValue("dataValue").split("__")[0];

            picLabel = "picLabel" + vm + "__" + node;
            if (this[picLabel] !== undefined) {
                tmpImage = this[picLabel].caption;
                image = tmpImage.replace(/.png/, "-locked.png");
                if (lockinfo === "Snapshot") {
                    this.deactivateVmSnapshot(vm, node, "is locked. Processing a snapshot.");
                } else if (lockinfo === "Migration") {
                    this.deactivateVmMigration(vm, node, "is locked. Processing a migration.");
                } else {
                    this.deactivateVm(vm, node, "is locked");
                }
                this[picLabel].setCaption(image);
                this[picLabel].reflow();
            }
            if (vm === selectedVm) {
                this.activateLock(vm, node, lockinfo);
            }
        } catch (e) {
            this.showToastError("lockVm Error: " + e.toString());
            console.error('ERROR IN lockVm: ' + e);
        }
    },
    activateLock: function(vm, node, lock) {
        try {
            this.tabVirtualMachines.setDisabled(true);
            if (lock === "Disabled") {
                this.panelVmDisabled.setShowing(true);
                disabled = true;
            } else if (lock === "Migration") {
                this.tabVirtualMachines.setShowing(true);
                this.panelVmOverviewWarning.setShowing(true);
                this.labelVmOverviewWarning.setCaption("This Virtual Machine is currently locked by a migration process.");
            } else if (lock === "Snapshot") {
                this.tabVirtualMachines.setShowing(true);
                this.panelVmOverviewWarning.setShowing(true);
                this.labelVmOverviewWarning.setCaption("This Virtual Machine is currently locked by a snapshot process.");
            }
        } catch (e) {
            this.showToastError("activateLock Error: " + e.toString());
            console.error('ERROR IN activateLock: ' + e);
        }
    },
    UnlockVm: function(node, vm, task, lockinfo, sender) {
        try {
            this.setVmLock(vm + "__" + node, lockinfo, false);
            this.updateLog(task, vm, node, "VM Unlocked", sender);
            var selectedVm = this.varSelectedVm.getValue("dataValue").split("__")[0];

            picLabel = "picLabel" + vm + "__" + node;
            if (this[picLabel] !== undefined) {
                tmpImage = this[picLabel].caption;
                image = tmpImage.replace(/-locked.png/, ".png");
                if (lockinfo === "Snapshot") {
                    this.activateVmSnapshot(vm, node);
                } else if (lockinfo === "Migration") {
                    this.activateVmMigration(vm, node);
                } else {
                    this.activateVm(vm, node, "is locked");
                }
                this[picLabel].setCaption(image);
                this[picLabel].reflow();
            }
            if (vm === selectedVm) {
                this.deactivateLock(vm, node);
            }

        } catch (e) {
            this.showToastError("UnlockVm Error: " + e.toString());
            console.error('ERROR IN setVmLock: ' + e);
        }
    },
    deactivateLock: function(vm, node) {
        try {
            this.panelVmOverviewWarning.setShowing(false);
            this.tabVirtualMachines.setShowing(true);
            this.tabVirtualMachines.setDisabled(false);
            this.panelVmDisabled.setShowing(false);
            this.loadingVmConfiguration.setShowing(false);
            this.loadingLockScreen.setShowing(false);
        } catch (e) {
            this.showToastError("deactivateLock Error: " + e.toString());
            console.error('ERROR IN v: ' + e);
        }
    },

    setVmLock: function(vmInfos, lock, value) {
        try {
            var varLock = "Lock" + vmInfos;
            if (this[varLock] === undefined) {
                this.createComponent(varLock, "wm.Variable");
                this[varLock].setType("lockTypeDef");
                this[varLock].setData({
                    "Snapshot": false,
                    "Migration": false,
                    "Disabled": false
                });
            }
            this[varLock].setValue(lock, value);
        } catch (e) {
            this.showToastError("setVmLock Error: " + e.toString());
            console.error('ERROR IN setVmLock: ' + e);
        }
    },
    clearVmLocks: function(vmInfos) {
        try {
            var varLock = "Lock" + vmInfos;
            if (this[varLock] === undefined) {
                this.createComponent(varLock, "wm.Variable");
                this[varLock].setType("lockTypeDef");
            }
            this[varLock].setData({
                "Snapshot": false,
                "Migration": false,
                "Disabled": false
            });
        } catch (e) {
            this.showToastError("clearVmLocks Error: " + e.toString());
            console.error('ERROR IN clearVmLocks: ' + e);
        }
    },
    getVmLock: function(vmInfos) {
        try {
            var varLock = "Lock" + vmInfos;
            var value = "";
            if (this[varLock].getValue("Disabled")) {
                value = "Disabled";
            } else if (this[varLock].getValue("Migration")) {
                value = "Migration";
            } else if (this[varLock].getValue("Snapshot")) {
                value = "Snapshot";
            }
            return value;

        } catch (e) {
            console.error('ERROR IN getLock: ' + e);
        }
    },
    vmIsLocked: function(vmInfos) {
        try {
            var varLock = "Lock" + vmInfos;
            var value = false;
            if (this[varLock] !== undefined) {
                var snapshot = this[varLock].getValue("Snapshot");
                var migration = this[varLock].getValue("Migration");
                var disabled = this[varLock].getValue("Disabled");
                if (snapshot || migration || disabled) {
                    value = true;
                }
            }
            return value;

        } catch (e) {
            console.error('ERROR IN vmIsLocked: ' + e);
        }
    },

    defineVm: function(node, vm) {
        try {
            this.logDebugDataCenter("defineVm call addVm");
            if (vm === "OpenKVI") {
                this.addOpenKVI(vm, node, false);
            } else {
                this.addVM(vm, node, false);
            }
            this.vmListByServerLive.filter.setValue("server", node);
            this.vmListByServerLive.update();
            this.tablevmsLiveVariable2.update();

        } catch (e) {
            console.error('ERROR IN defineVm: ' + e);
        }
    },

    ///////////////// DataBase synchronisation //////////////////////////////////////
    updateServerDatabaseHooks: function(updateVmDb) {
        try {
            if (updateVmDb === true) {
                this.varLoadVMDB.setValue("dataValue", true);
            }
            this.listAllServersLiveVar.update();
        } catch (e) {
            console.error('ERROR IN updateServerDatabaseHooks: ' + e);
        }
    },
    updateVmDatabaseHooks: function() {
        try {
            this.tablevmsLiveVariable2.update();
        } catch (e) {
            console.error('ERROR IN updateVmDatabaseHooks: ' + e);
        }
    },

    tablevmsLiveVariable2Result: function(inSender, inDeprecated) {
        try {
            var count = inSender.getCount();
            this.labelDatacenterNbVms.setCaption("Number of virtual machines: " + count);
            // empty dictionnary and recreate it
            this.vmsByServer.clear();
            var vmsOfServer = null;
            if (count > 0) {
                var vmData = null;
                for (var i = 0; i < count; i++) {
                    vmData = inSender.getData()[i] || 0;
                    if (vmData) {
                        if (!this.vmsByServer.containsKey(vmData.server)) {
                            this.vmsByServer.add(vmData.server, new dojox.collections.Dictionary());
                        }
                        vmsOfServer = this.vmsByServer.entry(vmData.server).value;
                        vmsOfServer.add(vmData.name, {
                            "id": vmData.id,
                            "name": vmData.name,
                            "displayedname": vmData.displayedname
                        });
                    }
                }
            }

            var iter = this.vmsByServer.getIterator();
            while (!iter.atEnd()) {
                var dictEntry = iter.get();
                var node = dictEntry.key;
                // key is available as dictEntry.key 
                // value is available as dictEntry.value 
                vmsOfServer = dictEntry.value;
                var vmCount = vmsOfServer.getValueList().length;
                var varLabel = "LabelServer" + node;
                var varIP = node + "ip";
                var varVirt = node + "virt";
                var sVirt = this[varVirt].getValue("dataValue");
                var sIP = this[varIP].getValue("dataValue");
                this.setNodeTooltip(node, "IP: "+sIP+"</br>Type: "+sVirt+"<br>Guests: "+vmCount, "notice");
                
                if (this._nodesData[node] === undefined) {
                    this._nodesData[node] = {};
                    this._nodesData[node].general = {
                        "type": sVirt,
                        "ip": sIP,
                        "active": true,
                        "state": "open",
                        "vms": {
                            "actives": 0,
                            "total": vmCount,
                            "list": []
                        }
                    };
                } else {
                    this._nodesData[node].general.vms.total = vmCount;
                }
            }

        } catch (e) {
            console.error('ERROR IN tablevmsLiveVariable2Result: ' + e);
        }
    },
    vmListByServerLiveResult: function(inSender, inDeprecated) {
        try {
            this.labelNodeNbVms.setCaption("Number of virtual machines: " + inSender.getCount());
            var count = this.vmListByServerLive.getCount();
            if (count > 0) {
                var projectData = this.vmListByServerLive.getData()[0] || 0;
                if (projectData) {
                    var node = projectData.server;
                    var varLabel = "LabelServer" + node;
                    if (this[varLabel] !== undefined) {
                        var varVms = node + "VmCreated";
                        var created = this[varVms].getValue("dataValue");
                        var varIP = node + "ip";
                        var varVirt = node + "virt";
                        var sVirt = this[varVirt].getValue("dataValue");
                        var sIP = this[varIP].getValue("dataValue");
                        var varVmList = node + "VmList";
                        var oldVmList = this[varVmList].getValue("dataValue");
                        var vmList = "";
                        this.setNodeTooltip(node, "IP: "+sIP+"</br>Type: "+sVirt+"<br>Guests: "+count, "notice");

                        if (this._nodesData[node] === undefined) {
                            this._nodesData[node] = {};
                            this._nodesData[node].general = {
                                "type": sVirt,
                                "ip": sIP,
                                "active": true,
                                "state": "open",
                                "vms": {
                                    "actives": 0,
                                    "total": count,
                                    "list": []
                                }
                            };
                        } else {
                            this._nodesData[node].general.vms.total = count;
                        }

                        if (count > 0) {
                            for (var i = 0; i < count; i++) {
                                projectData = this.vmListByServerLive.getData()[i] || 0;
                                if ((projectData) && (projectData.server === node)) {
                                    vName = projectData.name;
                                    if (vmList.length === 0) {
                                        vmList = vName;
                                    } else {
                                        vmList += "::" + vName;
                                    }
                                }
                            }
                        }
                        this[varVmList].setValue("dataValue", vmList);
                        if (created !== true) {
                            this.createAllVmsByServer(node);
                            this[varVms].setValue("dataValue", true);
                        } else if (vmList !== oldVmList) {
                            this.getVmListStatus(node);
                            this.logDebugServer(node + " VM List: " + vmList);
                        }
                        if (this._expandedNodes[node].showing) {
                            this.ExpandServer(node);
                        }
                    }
                }
                this.GridVmList.reflow();
            }
        } catch (e) {
            this.showToastError("vmListByServerLiveResult Error: " + e.toString());
            console.error('ERROR IN vmListByServerLiveResult: ' + e);
        }
    },
    listAllServersLiveVarResult: function(inSender, inDeprecated) {
        try {
            var count = this.listAllServersLiveVar.getCount();
            var data = null;
            this.varServerList.clearData();
            for (var i = 0; i < count; i++) {
                data = this.listAllServersLiveVar.getData()[i];
                this.varServerList.addItem({
                    "name": data.name,
                    "dataValue": data.name
                });
            }

            this.varServersDbLoaded.setValue("dataValue", true);
            if (this.varServersCreated.getValue("dataValue") === false) {
                this.createAllServers();
            }
            if (this.varLoadVMDB.getValue("dataValue") === true) {
                this.updateVmDatabaseHooks();
            }
            if (this.labelNumberOfNodes !== undefined) {
                this.labelNumberOfNodes.setCaption("Number of nodes: " + inSender.getCount());
            }


        } catch (e) {
            this.showToastError("listAllServersLiveVarResult Error: " + e.toString());
            console.error('ERROR IN listAllServersLiveVarResult: ' + e);
        }
    },
    tableserversLiveVariable1Success: function(inSender, inDeprecated) {
        try {
            this.updateServerDatabaseHooks(false);
        } catch (e) {
            this.showToastError("tableserversLiveVariable1Success Error: " + e.toString());
            console.error('ERROR IN tableserversLiveVariable1Success: ' + e);
        }
    },

    ///////////////// End DataBase synchro //////////////////////////////////////////
    ///////////////// Start Task Loggin functions  //////////////////////////////////
    addLog: function(task, target, server, timeout, status, owner, detail) {
        try {
            if (owner === undefined) {
                owner = this.templateUsernameVar.getValue("dataValue");
            }

            if (target !== server && (task !== "Import virtual machine" && task !== "Add virtual machine")) {
                target = this.getVmDisplayedName(target, server);
            }

            var time = new Date();
            var h = time.getHours();
            if (h < 10) {
                h = "0" + h;
            }
            var m = time.getMinutes();
            if (m < 10) {
                m = "0" + m;
            }
            var s = time.getSeconds();
            if (s < 10) {
                s = "0" + s;
            }
            var started = h + ":" + m + ":" + s;
            if (status === undefined) {
                icon = '<image style="height: 16px;" src="resources/images/icons/loading/ajax-loader-indicator-small.gif"/>';
                //icon = '<image style="height: 16px;" src="resources/images/icons/loading/ajax-loader-arrows.gif"/>';
                status = "";
            } else if (status === "progess") {
                status = '<progress max="100" value="0"></progress>';
                icon = '<image style="height: 16px;" src="resources/images/icons/loading/ajax-loader-indicator-small.gif"/>';
            } else if (status === "info") {
                icon = '<image style="height: 16px;" src="resources/images/icons/documentinfo.png"/>';
                if (detail !== undefined) {
                    status = detail;
                } else {
                    status = task;
                }
            } else {
                icon = '<image style="height: 16px;" src="resources/images/icons/loading/ajax-loader-indicator-small.gif"/>';
            }
            var uuid = this.guid();
            var logInfo = {
                "task": task,
                "target": target,
                "owner": owner,
                "node": server,
                "started": started,
                "finished": "-",
                "icon": icon,
                "status": status,
                "state": "open",
                "uid": uuid
            };
            this.varTaskLog.addItem(logInfo, 0);

            if (timeout !== 0) {
                this.setLogTimeout(task, target, server, timeout, owner);
            } else {
                dojo.cookie(task + "_" + target + "_" + server, "SET", {
                    expires: 0.0003
                });
            }
            var showPnotify = false;
            if (this._TaskListHided) {
                var selectedNode = this.varSelectedServer.getValue("dataValue");
                var selectedVm = this.varSelectedVm.getValue("dataValue").split("__")[0];
                if ((target === selectedNode) || (target === selectedVm)) {
                    //this.showLogPanel();
                    logInfo.flag = status;
                    if (status.indexOf("Failed") > -1) {
                        logInfo.flag = "error";
                    } else if (status === "") {
                        logInfo.status = "ongoing";
                    }
                    showPnotify = true;
                } else if (owner === this.templateUsernameVar.getValue("dataValue")) {
                    showPnotify = true;
                } else if (owner === "Node Manager") {
                    showPnotify = true;
                } else {
                    var nbUnseen = parseInt(this.labelNbUnseenMsg.caption, 10) + 1;
                    var strUnseen = nbUnseen.toString();
                    if (nbUnseen > 9) {
                        strUnseen = "+9";
                    }
                    this.labelNbUnseenMsg.setCaption(strUnseen);
                    this.labelNbUnseenMsg.setShowing(true);
                }
            }
            if (showPnotify) {
                var notify = this.showBottomPnotify(logInfo, uuid);
            }


        } catch (e) {
            this.showToastError("addLog Error: " + e.toString());
            console.error('ERROR IN addLog: ' + e);
        }
    },
    updateLog: function(task, target, server, status, owner, flag) {
        try {
            var icon = "";
            var state = "closed";
            var task_cookie = dojo.cookie(task + "_" + target + "_" + server);

            if (owner === undefined) {
                if (task_cookie === "SET") {
                    owner = this.templateUsernameVar.getValue("dataValue");
                } else {
                    owner = "Node Manager";
                }
            }

            if (target !== server && (task !== "Import virtual machine" && task !== "Add virtual machine")) {
                target = this.getVmDisplayedName(target, server);
            }

            if (flag === undefined) {
                if (((status.indexOf("Failed") > -1) || (status.indexOf("Cancel") > -1)) && (flag === undefined)) {
                    flag = "cancel";
                } else if ((status.indexOf("Error") > -1) && (flag === undefined)) {
                    flag = "error";
                } else if ((status.indexOf("Critical") > -1) && (flag === undefined)) {
                    flag = "error";
                } else {
                    flag = "successful";
                }
            }

            if (flag === "successful") {
                icon = '<image style="height: 16px;" src="resources/images/icons/dialog-ok-apply.png"/> ';
            } else if (flag === "error") {
                icon = '<image style="height: 16px;" src="resources/images/icons/dialog-error-16.png"/> ';
            } else if (flag === "warning") {
                icon = '<image style="height: 16px;" src="resources/images/icons/dialog-warning-16.png"/> ';
            } else if (flag === "cancel") {
                icon = '<image style="height: 16px;" src="resources/images/icons/dialog-cancel.png"/> ';
            } else if (flag === "timeout") {
                icon = '<image style="height: 16px;" src="resources/images/icons/dialog-cancel.png"/> ';
            }



            var time = new Date();
            var h = time.getHours();
            if (h < 10) {
                h = "0" + h;
            }
            var m = time.getMinutes();
            if (m < 10) {
                m = "0" + m;
            }
            var s = time.getSeconds();
            if (s < 10) {
                s = "0" + s;
            }
            var finished = h + ":" + m + ":" + s;
            var started = "-";
            var count = this.varTaskLog.getCount();
            var index = -1;
            for (var i = 0; i < count; i++) {
                var tmpState = this.varTaskLog.getItem(i).getValue("state");
                if (tmpState === "open") {
                    var tmpTask = this.varTaskLog.getItem(i).getValue("task");
                    var tmpTarget = this.varTaskLog.getItem(i).getValue("target");
                    var tmpNode = this.varTaskLog.getItem(i).getValue("node");
                    var tmpStatus = this.varTaskLog.getItem(i).getValue("status");
                    var tmpOwner = this.varTaskLog.getItem(i).getValue("owner");
                    if ((target === "unknown") || (server === "unknown")) {
                        if ((tmpTask === task) && (tmpOwner === owner)) {
                            index = i;
                            target = tmpTarget;
                            server = tmpNode;
                            state = "closed";
                        }
                    } else if ((tmpTask === task) && (tmpTarget === target) && (tmpNode === server)) {
                        index = i;
                        if (status.indexOf("<progress") > -1) {
                            state = "open";
                            finished = "<i>Not yet</i>";
                            icon = '<image style="height: 16px;" src="resources/images/icons/loading/ajax-loader-indicator-small.gif"/>';
                        } else if (status.indexOf("ajax-bar-loader") > -1) {
                            state = "open";
                            finished = "<i>Not yet</i>";
                            icon = '<image style="height: 16px;" src="resources/images/icons/loading/ajax-loader-indicator-small.gif"/>';
                        } else {
                            state = "closed";
                        }
                    }
                }
            }
            var logInfo = {};
            // Clear possible pending timeout
            if (task_cookie === "SET") {
                dojo.cookie(task + "_" + target + "_" + server, "CLEARED", {
                    expires: 0.00001
                });
            }
            var uuid = this.guid();
            if (index > -1) {
                started = this.varTaskLog.getItem(index).getValue("started");
                owner = this.varTaskLog.getItem(index).getValue("owner");
                uuid = this.varTaskLog.getItem(index).getValue("uid");
                logInfo = {
                    "task": task,
                    "target": target,
                    "owner": owner,
                    "node": server,
                    "started": started,
                    "finished": finished,
                    "icon": icon,
                    "status": status,
                    "state": state,
                    "uid": uuid
                };
                this.varTaskLog.setItem(index, logInfo);

            } else if (flag !== "timeout") {

                if (status.indexOf("<progress") > -1) {
                    started = h + ":" + m + ":" + s;
                    state = "open";
                    finished = "<i>Not yet</i>";
                    icon = '<image style="height: 16px;" src="resources/images/icons/loading/ajax-loader-indicator-small.gif"/>';
                } else if (status.indexOf("ajax-bar-loader") > -1) {
                    started = h + ":" + m + ":" + s;
                    state = "open";
                    finished = "<i>Not yet</i>";
                    icon = '<image style="height: 16px;" src="resources/images/icons/loading/ajax-loader-indicator-small.gif"/>';
                } else {
                    state = "closed";
                    started = "-";
                }

                if (flag === "successful") {
                    icon = '<image style="height: 16px;" src="resources/images/icons/documentinfo.png"/> ';
                }
                logInfo = {
                    "task": task,
                    "target": target,
                    "owner": owner,
                    "node": server,
                    "started": started,
                    "finished": finished,
                    "icon": icon,
                    "status": status,
                    "state": state,
                    "uid": uuid
                };
                this.varTaskLog.addItem(logInfo, 0);
            }
            var showPnotify = false;
            if ((this._TaskListHided) && (state !== "open")) {
                var selectedNode = this.varSelectedServer.getValue("dataValue");
                var selectedVm = this.varSelectedVm.getValue("dataValue").split("__")[0];
                logInfo.flag = flag;
                if (flag.indexOf("failed") > -1) {
                    logInfo.flag = "error";
                }
                if ((target === selectedNode) || (target === selectedVm)) {
                    showPnotify = true;
                } else if (owner === this.templateUsernameVar.getValue("dataValue")) {
                    showPnotify = true;
                } else if (owner === "Node Manager") {
                    showPnotify = true;
                } else {
                    var nbUnseen = parseInt(this.labelNbUnseenMsg.caption, 10) + 1;
                    var strUnseen = nbUnseen.toString();
                    if (nbUnseen > 9) {
                        strUnseen = "+9";
                    }
                    this.labelNbUnseenMsg.setCaption(strUnseen);
                    this.labelNbUnseenMsg.setShowing(true);
                }
                if (showPnotify) {
                    if (index > -1) {
                        var notify_length = this._pnotify_list.length;
                        var found_notice = false;
                        for (i = 0; i < notify_length; i++) {
                            if (this._pnotify_list[i].uid === uuid) {
                                notice = this._pnotify_list[i].notice;
                                if (notice) {
                                    this.updatePnotify(notice, logInfo);
                                    found_notice = true;
                                    break;
                                }
                            }
                        }
                        if (!found_notice) {
                            this.showBottomPnotify(logInfo, uuid);
                        }
                    } else {
                        this.showBottomPnotify(logInfo, uuid);
                    }
                }
            }
        } catch (e) {
            this.showToastError("updateLog Error: " + e.toString());
            console.error('ERROR IN updateLog: ' + e);
            console.error('task: ' + task + ' ,target: ' + target + ', server: ' + server + ', status: ' + status + ', owner: ' + owner + ', flag: ' + flag);
        }
    },
    showBottomPnotify: function(logInfo, uid) {
        try {
            var notify_length = this._pnotify_list.length;
            //PNotify.removeAll();
            while (notify_length > 2) {
                try {
                    var rm_notify = this._pnotify_list[0];
                    rm_notify.notice.remove();
                } finally {
                    this._pnotify_list.splice(0, 1);
                    notify_length--;
                }
            }

            if (logInfo.status === "") {
                logInfo.status = "  ";
            }
            var msg = '<table style="width:100%; border-collapse: collapse; text-align: center; margin-top: 2px;">';
            msg += '<tr style="margin: 5px;">';
            msg += '<td style="width:25%;"><i>Task</i></td>';
            msg += '<td style="width:25%;"><i>Object</i></td>';
            msg += '<td style="width:80px;"><i>Owner</i></td>';
            msg += '<td style="width:25%;"><i>Node</i></td>';
            msg += '<td style="width:25%;"><i>Status</i></td>';
            msg += '</tr>';
            msg += '<tr style="margin: 5px;">';
            msg += '<td><b>' + logInfo.task + '</td>';
            msg += '<td><b>' + logInfo.target + '</b></td>';
            msg += '<td><b>' + logInfo.owner + '</b></td>';
            msg += '<td><b>' + logInfo.node + '</b></td>';
            msg += '<td><b>' + logInfo.status + '</b></td>';
            msg += '</tr>';
            msg += '</table>';

            var ptype = "success";
            switch (logInfo.flag) {
            case 'error':
                ptype = "error";
                break;
            case 'cancel':
                ptype = "error";
                break;
            case 'info':
                ptype = "info";
                break;
            case 'successful':
                ptype = "success";
                break;
            default:
                ptype = "";
                break;
            }

            var intLeftPanelWidth = parseInt(this.panelTree.domNode.style.width.replace(/px/g, ""), 10);
            var intRightPanelWidth = parseInt(this.panelInfo.domNode.style.width.replace(/px/g, ""), 10);
            var intMarginLeft = 0;
            var intNotifyWidth = 600;
            var notifyWidth = intNotifyWidth.toString() + "px";
            
            if (intRightPanelWidth > intNotifyWidth) {
                intMarginLeft = intLeftPanelWidth + Math.round((intRightPanelWidth - intNotifyWidth) / 2);
                notifyWidth = "500px";
            } else if ((intLeftPanelWidth + intRightPanelWidth) > intNotifyWidth) {
                intMarginLeft = Math.round(((intLeftPanelWidth + intRightPanelWidth - intNotifyWidth) / 2));
                notifyWidth = "500px";
            } else {
                notifyWidth = (intLeftPanelWidth + intRightPanelWidth - 10).toString() + "px";
                intMarginLeft = 10;
            }
            this._stack_bar_bottom.firstpos2 = intMarginLeft;
            var opts = {
                type: ptype,
                title: "Notification",
                text: msg,
                addclass: "stack-bar-bottom",
                cornerclass: "",
                width: notifyWidth,
                animate_speed: 'normal',
                //animation: 'slide',
                animation: {
                    effect_in: 'slide',
                    effect_out: 'fade'
                },
/*
                nonblock: {
                    nonblock: true,
                    nonblock_opacity: 0.3
                },*/
                buttons: {
                    closer: false,
                    closer_hover: false,
                    sticker: false
                },
                remove: true,
                hide: true,
                delay: 6000,
                mouse_reset: false,
                after_close: function(Pnotice) {
                    var pnotify_list = wm.Page.getPage("Main")._pnotify_list;
                    for (var i = 0; i < pnotify_list.length; i++) {
                        if (pnotify_list[i].notice === Pnotice) {
                            wm.Page.getPage("Main")._pnotify_list.splice(i, 1);
                            break;
                        }
                    }
                },
                stack: this._stack_bar_bottom
            };

            var notice = new PNotify(opts);
            this._pnotify_list.push({
                "notice": notice,
                "uid": uid
            });
            notice.get().click(function() {
                notice.remove();
            });
            return notice;
        } catch (e) {
            console.error('ERROR IN showBottomPnotify: ' + e);
        }

    },
    updatePnotify: function(notify, logInfo) {
        try {
            var msg = '<table style="width:100%; border-collapse: collapse; text-align: center; margin-top: 2px;">';
            msg += '<tr style="margin: 5px;">';
            msg += '<td style="width:25%;"><i>Task</i></td>';
            msg += '<td style="width:25%;"><i>Object</i></td>';
            msg += '<td style="width:80px;"><i>Owner</i></td>';
            msg += '<td style="width:25%;"><i>Node</i></td>';
            msg += '<td style="width:25%;"><i>Status</i></td>';
            msg += '</tr>';
            msg += '<tr style="margin: 5px;">';
            msg += '<td><b>' + logInfo.task + '</td>';
            msg += '<td><b>' + logInfo.target + '</b></td>';
            msg += '<td><b>' + logInfo.owner + '</b></td>';
            msg += '<td><b>' + logInfo.node + '</b></td>';
            msg += '<td><b>' + logInfo.status + '</b></td>';
            msg += '</tr>';
            msg += '</table>';

            var ptype = "success";
            switch (logInfo.flag) {
            case 'error':
                ptype = "error";
                break;
            case 'cancel':
                ptype = "error";
                break;
            case 'info':
                ptype = "info";
                break;
            case 'successful':
                ptype = "success";
                break;
            default:
                ptype = "";
                break;
            }
            var upnotice = notify.update({
                type: ptype,
                text: msg,
                delay: 6000
            });

        } catch (e) {
            console.error('ERROR IN updatePnotify: ' + e);
        }
    },

    clearLogBtnClick: function(inSender) {
        try {
            if (this._TaskListHided) {
                this.labelNbUnseenMsg.setShowing(false);
                this.labelNbUnseenMsg.setCaption("0");
                PNotify.removeAll();
                this._pnotify_list = [];
            } else {
                this.varTaskLog.clearData();
                this.labelNbUnseenMsg.setShowing(false);
                this.labelNbUnseenMsg.setCaption("0");
            }

        } catch (e) {
            console.error('ERROR IN clearLogBtnClick: ' + e);
        }
    },
    showLogPanel: function() {
        try {
            this._gridLogShower = Math.random();
            var id = this._gridLogShower;
            if (this.layersBottomInfo.height === this._BottomInfoHided) {
                dojo.animateProperty({
                    node: this.layersBottomInfo.domNode,
                    duration: 500,
                    properties: {
                        height: {
                            start: '27',
                            end: '150',
                            unit: "px"
                        }
                    }
                }).play();
                this.layersBottomInfo.setHeight(this._gridLogHeight);
            }
            var log_timeout = 5000; // 5 seconds
            setTimeout(function() {
                try {
                    wm.Page.getPage("Main").hideLogPanel(id);
                } catch (e) {
                    alert(e);
                }
            }, log_timeout);
        } catch (e) {
            console.error('ERROR IN showLogPanel: ' + e);
        }
    },
    hideLogPanel: function(id) {
        try {
            if (id === this._gridLogShower) {
                if (this.layersBottomInfo.height !== this._BottomInfoHided) {
                    this._gridLogHeight = this.layersBottomInfo.height;
                    dojo.animateProperty({
                        node: this.layersBottomInfo.domNode,
                        duration: 500,
                        properties: {
                            height: {
                                start: this._gridLogHeight,
                                end: '27',
                                unit: "px"
                            }
                        }
                    }).play();
                    setTimeout(function() {
                        try {
                            wm.Page.getPage("Main").layersBottomInfo.setHeight(32);
                        } catch (e) {
                            alert(e);
                        }
                    }, 500);
                }
            }

        } catch (e) {
            console.error('ERROR IN hideLogPanel: ' + e);
        }
    },
    getVmDisplayedName: function(vmName, serverName) {
        try {
            var name = vmName;

            if (this.vmsByServer.containsKey(serverName)) {
                var vmsOfServer = this.vmsByServer.entry(serverName).value;
                if (vmsOfServer.containsKey(vmName)) {
                    name = vmsOfServer.entry(vmName).value["displayedname"];
                }
            }
            return name;
        } catch (e) {
            console.error('ERROR IN getVmDisplayedName: ' + e);
        }
    },
    javaTimeoutResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaTimeout.getValue("dataValue");
            var infos = result.split("::");
            var status = "Failed: timed out";
            var task = infos[0];
            var target = infos[1];
            var node = infos[2];
            var owner = infos[3];
            if ((target === node) && (task === "Contacting node")) {
                var varConnected = node + "connected";
                var online = this[varConnected].getValue("dataValue");
                if (online === false) {
                    this.setNodeUnreachable(node, "Node unreachable");
                }
            }
            this.updateLog(task, target, node, status, owner, "timeout");


        } catch (e) {
            console.error('ERROR IN javaTimeoutResult: ' + e);
            this.showToastError("javaTimeoutResult Error: " + e.toString());
        }
    },
    javaSleepResult: function(inSender, inDeprecated) {
        try {
            var func = this.javaSleep.getValue("dataValue");
            this[func]();

        } catch (e) {
            console.error('ERROR IN javaSleepResult: ' + e);
            this.showToastError("javaSleepResult Error: " + e.toString());
        }
    },
    setLogTimeout: function(task, target, server, timeout, owner) {
        try {
            if (owner === undefined) {
                owner = this.templateUsernameVar.getValue("dataValue");
            }
            if (timeout === undefined) {
                timeout = 5000;
            }
            dojo.cookie(task + "_" + target + "_" + server, "SET", {
                //key expire after 2 hours
                expires: 0.012
            });
            setTimeout(function() {
                try {
                    var timeout_cookie = dojo.cookie(task + "_" + target + "_" + server);
                    if (timeout_cookie === "SET") {
                        if ((target === server) && (task === "Contacting node")) {
                            var varConnected = server + "connected";
                            var online = wm.Page.getPage("Main")[varConnected].getValue("dataValue");
                            if (online === false) {
                                wm.Page.getPage("Main").setNodeUnreachable(node, "Node unreachable");
                            }
                        }
                        wm.Page.getPage("Main").updateLog(task, target, server, "Failed: timed out", owner, "timeout");
                    }
                } catch (e) {
                    alert(e);
                }
            }, timeout);
        } catch (e) {
            console.error('ERROR IN setLogTimeout: ' + e);
            this.showToastError("setLogTimeout Error: " + e.toString());
        }
    },

    ///////////////// End Task Loggin functions    //////////////////////////////////
    ///////////////// Start remote browsing functions ///////////////////////////////
    javaListRemoteDirectoryResult: function(inSender, inDeprecated) {
        try {
            this.varBrowserFileList.clearData();
            var result = this.javaListRemoteDirectory.getValue("dataValue");
            var jsonVar = JSON.parse(result);
			var list = jsonVar.action.result;
			var node = jsonVar.node;
            var icon = '<image style="height: 24px;" src="resources/images/icons/browser/folder-documents-24.png"/>';
            var type = "folder";
            for (var i = 0; i < list.length; i++) {
                var params = list[i].split("::");
                if (params[0] !== "") {
                    if (params[1] > 1) {
                        icon = '<image style="height: 24px;" src="resources/images/icons/browser/folder-documents-24.png"/>';
                        type = "folder";
                    } else {
                        icon = '<image style="height: 24px;" src="resources/images/icons/browser/file-24.png"/>';
                        type = "file";
                    }
                    this.varBrowserFileList.addItem({
                        "rights": params[0],
                        "owner": params[2],
                        "group": params[3],
                        "size": params[4],
                        "modified": params[5],
                        "name": params[params.length - 1],
                        "icon": icon,
                        "type": type
                    });

                }
            }
            this.pictBrowserUp.addUserClass("wm_BorderShadow_WeakShadow");
            this.pictBrowserRefresh.addUserClass("wm_BorderShadow_WeakShadow");
            this.pictBrowserHome.addUserClass("wm_BorderShadow_WeakShadow");
            this.pictBrowserNewFolder.addUserClass("wm_BorderShadow_WeakShadow");
            this.browserGrid.renderDojoObj();
            this.pictBrowserLoading.setShowing(false);
            this.browserPath.setDisabled(false);
            this.browserBtnOpen.setDisabled(false);
        } catch (e) {
            this.showToastError("javaListRemoteDirectoryResult Error: " + e.toString());
            console.error('ERROR IN javaListRemoteDirectoryResult: ' + e);
        }
    },
    javaGetFileInfoResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaGetFileInfo.getValue("dataValue");
            var jsonVar = JSON.parse(result);
            var params = jsonVar.action.result;
            this.fileInfoTextArea.setDataValue(params[0]);
            var qemuInfos = params[1].split("\n");
            var tmpstr = qemuInfos[2].replace(/virtual size: /g, "");
            var tmpstr2 = tmpstr.split(" ");
            var vsize = tmpstr2[0];
            var rsize = qemuInfos[3].replace(/disk size: /g, "");
            var format = qemuInfos[1].replace(/file format: /g, "");
            this.varFileInfo.setValue("format", format);
            this.varFileInfo.setValue("rsize", rsize);
            this.varFileInfo.setValue("vsize", vsize);
            var str = "Format: " + format + "\nVirtual size: " + vsize + "\nDisk size:" + rsize;
            this.qemuInfoTextArea.setDataValue(str);

        } catch (e) {
            this.showToastError("javaGetFileInfoResult Error: " + e.toString());
            console.error('ERROR IN javaGetFileInfoResult: ' + e);
        }
    },
    remoteFileBrowserDiagShow: function(inSender) {
        try {
            var node = this.varSelectedServer.getValue("dataValue");
            this.remoteFileBrowserDiag.setTitle(node + " Remote Browser");
            this.pictBrowserHomeClick(inSender);
            this.fileInfoTextArea.setDataValue("");
            this.qemuInfoTextArea.setDataValue("");

        } catch (e) {
            this.showToastError("remoteFileBrowserDiagShow Error: " + e.toString());
            console.error('ERROR IN remoteFileBrowserDiagShow: ' + e);
        }
    },
    pictBrowserHomeClick: function(inSender) {
        try {
            this.fileInfoTextArea.setDataValue("");
            this.qemuInfoTextArea.setDataValue("");
            this.BrowserSelection.setDataValue("");
            this.browserBtnSelect.setCaption("Select");
            this.browserBtnSelect.setDisabled(true);
            inSender.removeUserClass("wm_BorderShadow_StrongShadow");
            var node = this.varSelectedServer.getValue("dataValue");
            this.browserPath.setDataValue("/opt/virtualization/");
            this.pictBrowserLoading.setShowing(true);
            this.browserPath.setDisabled(true);
            this.browserBtnOpen.setDisabled(true);
            this.javaListRemoteDirectory.input.setValue("node", node);
            this.javaListRemoteDirectory.input.setValue("path", "/opt/virtualization/");
            this.javaListRemoteDirectory.update();

        } catch (e) {
            this.showToastError("pictBrowserHomeClick Error: " + e.toString());
            console.error('ERROR IN pictBrowserHomeClick: ' + e);
        }
    },
    pictBrowserUpClick: function(inSender) {
        try {
            this.fileInfoTextArea.setDataValue("");
            this.qemuInfoTextArea.setDataValue("");
            this.BrowserSelection.setDataValue("");
            this.browserBtnSelect.setCaption("Select");
            this.browserBtnSelect.setDisabled(true);
            inSender.removeUserClass("wm_BorderShadow_StrongShadow");
            var path = this.browserPath.getDataValue();
            var params = path.split("/");
            var newPath = "/";
            var sub = 1;
            if (params[params.length - 1] === "") {
                sub = 2;
            }
            for (var i = 1; i < (params.length - sub); i++) {
                newPath += params[i] + "/";
            }
            this.browserPath.setDataValue(newPath);
            var node = this.varSelectedServer.getValue("dataValue");
            this.pictBrowserLoading.setShowing(true);
            this.browserPath.setDisabled(true);
            this.browserBtnOpen.setDisabled(true);
            this.javaListRemoteDirectory.input.setValue("node", node);
            this.javaListRemoteDirectory.input.setValue("path", newPath);
            this.javaListRemoteDirectory.update();

        } catch (e) {
            console.error('ERROR IN pictBrowserUpClick: ' + e);
        }
    },
    browserGridCellDblClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        try {
            this.fileInfoTextArea.setDataValue("");
            this.qemuInfoTextArea.setDataValue("");
            this.BrowserSelection.setDataValue("");
            this.panelBrowserBody.disabled = true;
            var callTarget = this.varBrowserCaller.getValue("dataValue");
            var type = this.browserGrid.getCell(rowId, "type");
            var name = this.browserGrid.getCell(rowId, "name");
            var params = name.split(" -> ");
            if (params.length > 1) {
                name = params[0];
            }
            var path = this.browserPath.getDataValue();
            if (path[path.length - 1] != "/") {
                path += "/";
            }
            if (type === "folder") {
                newPath = path + name + "/";
            } else {
                newPath = path + name;
            }
            if (callTarget === type) {
                this.BrowserSelection.setDataValue(newPath);
                this.browserBtnSelect.setCaption("<b>Select</b>");
                this.browserBtnSelect.setDisabled(false);
            }
            if (type === "folder") {
                var node = this.varSelectedServer.getValue("dataValue");
                this.browserPath.setDataValue(newPath);
                this.pictBrowserLoading.setShowing(true);
                this.browserPath.setDisabled(true);
                this.browserBtnOpen.setDisabled(true);
                this.javaListRemoteDirectory.input.setValue("node", node);
                this.javaListRemoteDirectory.input.setValue("path", newPath);
                this.javaListRemoteDirectory.update();
            }

        } catch (e) {
            this.showToastError("browserGridCellDblClick Error: " + e.toString());
            console.error('ERROR IN browserGridCellDblClick: ' + e);
        }
    },
    browserGridClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        try {
            var callTarget = this.varBrowserCaller.getValue("dataValue");
            var type = this.browserGrid.getCell(rowId, "type");
            var name = this.browserGrid.getCell(rowId, "name");
            var params = name.split(" -> ");
            var path = this.browserPath.getDataValue();
            if (path[path.length - 1] != "/") {
                path += "/";
            }
            if (params.length > 1) {
                name = params[0];
            }
            var newFile = path + name;

            if (callTarget === type) {
                this.BrowserSelection.setDataValue(newFile);
                this.browserBtnSelect.setCaption("<b>Select</b>");
                this.browserBtnSelect.setDisabled(false);
            }
            if (type === "file") {
                var node = this.varSelectedServer.getValue("dataValue");
                this.javaGetFileInfo.input.setValue("node", node);
                this.javaGetFileInfo.input.setValue("path", newFile);
                this.javaGetFileInfo.update();
            }

        } catch (e) {
            this.showToastError("browserGridClick Error: " + e.toString());
            console.error('ERROR IN browserGridClick: ' + e);
        }
    },
    pictBrowserRefreshClick: function(inSender) {
        try {
            inSender.removeUserClass("wm_BorderShadow_StrongShadow");
            var node = this.varSelectedServer.getValue("dataValue");
            var path = this.browserPath.getDataValue();
            this.pictBrowserLoading.setShowing(true);
            this.browserPath.setDisabled(true);
            this.browserBtnOpen.setDisabled(true);
            this.javaListRemoteDirectory.input.setValue("node", node);
            this.javaListRemoteDirectory.input.setValue("path", path);
            this.javaListRemoteDirectory.update();

        } catch (e) {
            console.error('ERROR IN pictBrowserRefreshClick: ' + e);
        }
    },
    browserPathEnterKeyPress: function(inSender) {
        try {
            this.pictBrowserRefreshClick(inSender);

        } catch (e) {
            console.error('ERROR IN browserPathEnterKeyPress: ' + e);
        }
    },
    browserBtnOpenClick: function(inSender) {
        try {
            var index = this.browserGrid.getSelectedIndex();
            this.fileInfoTextArea.setDataValue("");
            this.qemuInfoTextArea.setDataValue("");
            this.BrowserSelection.setDataValue("");
            this.browserBtnSelect.setCaption("Select");
            this.browserBtnSelect.setDisabled(true);
            if (index > -1) {
                var callTarget = this.varBrowserCaller.getValue("dataValue");
                var type = this.browserGrid.getCell(index, "type");
                var name = this.browserGrid.getCell(index, "name");
                var params = name.split(" -> ");
                if (params.length > 1) {
                    name = params[0];
                }
                var path = this.browserPath.getDataValue();
                if (path[path.length - 1] != "/") {
                    path += "/";
                }
                var newPath = "";
                if (type === "folder") {
                    newPath = path + name + "/";
                } else {
                    newPath = path + name;
                }

                if (callTarget === type) {
                    this.BrowserSelection.setDataValue(newPath);
                    this.browserBtnSelect.setCaption("<b>Select</b>");
                    this.browserBtnSelect.setDisabled(false);
                }

                if (type === "folder") {

                    var node = this.varSelectedServer.getValue("dataValue");
                    this.browserPath.setDataValue(newPath);
                    this.pictBrowserLoading.setShowing(true);
                    this.browserPath.setDisabled(true);
                    this.browserBtnOpen.setDisabled(true);
                    this.javaListRemoteDirectory.input.setValue("node", node);
                    this.javaListRemoteDirectory.input.setValue("path", newPath);
                    this.javaListRemoteDirectory.update();
                }
            }

        } catch (e) {
            this.showToastError("browserBtnOpenClick Error: " + e.toString());
            console.error('ERROR IN browserBtnOpenClick: ' + e);
        }
    },
    browserBtnSelectClick: function(inSender) {
        try {
            var caller = this.varBrowserCaller.getValue("name");
            this[caller].setDataValue(this.BrowserSelection.getDataValue());
            this.varBrowserFileList.clearData();
            this.browserPath.setDataValue("");
            this.browserBtnSelect.setCaption("Select");
            this.browserBtnSelect.setDisabled(true);
            this.remoteFileBrowserDiag.setShowing(false);
        } catch (e) {
            this.showToastError("browserBtnSelectClick Error: " + e.toString());
            console.error('ERROR IN browserBtnSelectClick: ' + e);
        }
    },
    browserBtnCancelClick: function(inSender) {
        try {
            this.varBrowserFileList.clearData();
            this.browserPath.setDataValue("");
            this.browserBtnSelect.setCaption("Select");
            this.browserBtnSelect.setDisabled(true);
            this.remoteFileBrowserDiag.setShowing(false);
        } catch (e) {
            console.error('ERROR IN browserBtnCancelClick: ' + e);
        }
    },
    onPictureMouseOver: function(inSender, event) {
        try {
            inSender.removeUserClass("wm_BorderShadow_WeakShadow");
            inSender.addUserClass("wm_BorderShadow_StrongShadow");

        } catch (e) {
            console.error('ERROR IN onPictureMouseOver: ' + e);
        }
    },
    onPictureMouseOut: function(inSender, event) {
        try {
            inSender.removeUserClass("wm_BorderShadow_StrongShadow");
            inSender.addUserClass("wm_BorderShadow_WeakShadow");

        } catch (e) {
            console.error('ERROR IN onPictureMouseOut: ' + e);
        }
    },
    ///////////////// End remote browsing functions ////////////////////////////////
    disableLoadingDialogs: function() {
        try {
            this.loadingDialogVm.setShowing(false);
            this.loadingNodeRessources.setShowing(false);
            this.loadingNodeNetworkConf.setShowing(false);
            this.loadingNodeRessources.setShowing(false);
        } catch (e) {
            this.showToastError("disableLoadingDialogs Error: " + e.toString());
            console.error('ERROR IN disableLoadingDialogs: ' + e);
        }
    },

    ///////////////// Start DataCenter configuration ////////////////////////////////
    btnDefaultVmConfigStorageClick: function(inSender) {
        try {
            if (inSender.caption === "Edit") {
                this.editDefaultVmConfigStorage.setReadonly(false);
                this.btnDefaultVmConfigStorage.setCaption("Save");
                this.btnCancelVmConfigStorage.setShowing(true);
            } else if (inSender.caption === "Save") {
                this.editDefaultVmConfigStorage.setReadonly(true);
                this.btnDefaultVmConfigStorage.setCaption("Edit");
                this.varDefaultVmConfigPath.setValue("dataValue", this.editDefaultVmConfigStorage.getDataValue(""));
                this.btnCancelVmConfigStorage.setShowing(false);
            }

        } catch (e) {
            this.showToastError("btnDefaultVmConfigStorageClick Error: " + e.toString());
            console.error('ERROR IN btnDefaultVmConfigStorageClick: ' + e);
        }
    },
    btnDefaultVmImageStorageClick: function(inSender) {
        try {
            if (inSender.caption === "Edit") {
                this.editDefaultVmImageStorage.setReadonly(false);
                this.btnDefaultVmImageStorage.setCaption("Save");
                this.btnCancelVmImageStorage.setShowing("true");
            } else if (inSender.caption === "Save") {
                this.editDefaultVmImageStorage.setReadonly(true);
                this.btnDefaultVmImageStorage.setCaption("Edit");
                this.varDefaultDiskPath.setValue("dataValue", this.editDefaultVmImageStorage.getDataValue(""));
                this.btnCancelVmImageStorage.setShowing(false);
            }

        } catch (e) {
            this.showToastError("btnDefaultVmImageStorageClick Error: " + e.toString());
            console.error('ERROR IN btnDefaultVmImageStorageClick: ' + e);
        }
    },
    btnCancelVmConfigStorageClick: function(inSender) {
        try {
            this.btnCancelVmConfigStorage.setShowing(false);
            this.editDefaultVmConfigStorage.setDataValue(this.varDefaultVmConfigPath.getDataValue(""));
            this.btnDefaultVmConfigStorage.setCaption("Edit");
            this.editDefaultVmConfigStorage.setReadonly(true);
        } catch (e) {
            console.error('ERROR IN btnCancelVmConfigStorageClick: ' + e);
        }
    },
    btnCancelVmImageStorageClick: function(inSender) {
        try {
            this.editDefaultVmImageStorage.setDataValue(this.varDefaultDiskPath.getDataValue(""));
            this.btnDefaultVmImageStorage.setCaption("Edit");
            this.btnCancelVmImageStorage.setShowing(false);
            this.editDefaultVmImageStorage.setReadonly(true);
        } catch (e) {
            console.error('ERROR IN btnCancelVmImageStorageClick: ' + e);
        }
    },
    //////////////// End DataCenter configuration ///////////////////////////////////
    //////////////// Servers functions ://///////////////////////////////////////////
    refreshServerList: function() {
        try {
            this.removeAllServers();
        } catch (e) {
            this.showToastError("refreshServerList ERROR: " + e.toString());
            console.error('ERROR IN refreshServerList: ' + e);
        }
    },

    removeAllServers: function() {
        try {
            if (this.varServersCreated.getValue("dataValue") === true) {
                var count = this.tableserversLiveVariable1.getCount();
                var projectData = null;
                var node = "";
                for (var i = 0; i < count; i++) {
                    projectData = this.tableserversLiveVariable1.getData()[i];
                    node = projectData.name;
                    panelName = "panelNode" + node;
                    this.removeServer(node);
                }
                this.varServersCreated.setValue("dataValue", false);
            }
        } catch (e) {
            this.showToastError("removeAllServers Failed: " + e.toString());
        }
    },

    serverServiceResult: function(inSender) {
        try {
            var serviceName = inSender.name.toString();
            var result = this[serviceName].getValue("dataValue");
            this.logDebugDataCenter(serviceName + ":" + result);
            var params = result.split("::");
            var infos = params[0].split("=");
            var call = infos[0];
            var node = infos[1];
            var status = params[1];
            var varConnected = node + "connected";
            var varLabel = "";
            //app.toastInfo("serverServiceResult:"+result);
            if (call.indexOf("connectToServer" > 0)) {
                var varPict = "PictServer" + node;
                if (status.indexOf("Failed") > -1) {
                    var error = "Failed";
                    if (params[2] !== undefined) {
                        error = params[2];
                    } else {
                        var jsonError = JSON.parse(params[1]);
                        error = jsonError.action.result.state;
                        if (error === undefined) {
                            error = jsonError.action.result;
                        }
                    }
                    this.setNodeUnreachable(node, error);
                    app.toastDialog.showToast(error, 5000, "Warning", "cc", node + " is unreachable");
                    //this.updateLog("Reconnecting node", node, node, error);
                    this[varPict].setSource("resources/images/icons/server-error-30.png");
                    varLabel = "LabelServer" + node;
                    this.connect(this[varLabel].domNode, "onclick", this, dojo.hitch(this, "highLightSelectedServer", this[varLabel].caption));
                } else if (status.indexOf("Error:Received timed out") > -1) {
                    this.setNodeUnreachable(node, "reply took too long");
                    this[varPict].setSource("resources/images/icons/server-warning-30.png");
                    varLabel = "LabelServer" + node;
                    this.connect(this[varLabel].domNode, "onclick", this, dojo.hitch(this, "highLightSelectedServer", this[varLabel].caption));
                } else {
                    var jsonVar = JSON.parse(params[1]);
                    var resInfos = jsonVar.action.result;
                    this.setNodeConnected(node, resInfos);
                }
                var varPictWait = "PictServerWait" + node;
                this[varPictWait].setShowing(false);
                var varPictVMListWait = "PictVMListWait" + node;
                this[varPictVMListWait].setShowing(false);
            }

        } catch (e) {
            this.showToastError("serverServiceResult Failed: " + e.toString());
            console.error('ERROR IN serverServiceResult: ' + e);
        }
    },
    setNodeConnected: function(node, infos) {
        try {
            var state = infos.state;
            var varConnected = node + "connected";
            var webshell = infos.webshell;
            var nodeWebshell = node + "nodeWebshell";
            var varVirt = node + "virt";
            var varLabelArrow = "LabelArrow" + node;
            var varLabel = "LabelServer" + node;
            var varPanelMain = "panelMain" + node;
            var varPict = "PictServer" + node;
            
            this[nodeWebshell].setValue("dataValue", webshell);            
            sVirt = this[varVirt].getValue("dataValue");
            var node_logo = "resources/images/icons/server-30.png";
            if (sVirt === "kvm") {
                node_logo = "resources/images/icons/server-kvm.png";
            } else if (sVirt === "esx") {
                node_logo = "resources/images/icons/server-esx.png";
            } else if (sVirt === "qemu") {
                node_logo = "resources/images/icons/server-qemu.png";
            }

            this[varConnected].setValue("dataValue", true);            
            dojo.style(this[varPanelMain].domNode, "opacity", 1);            
            this.connect(this[varLabel].domNode, "onclick", this, dojo.hitch(this, "labelServerClick", this[varLabel].caption));            
            
            //this[varLabelArrow].setValue("domNode.title", "Expand");
            this.addToolTip(this[varLabelArrow].domNode, "", "Expand", "help", 800);
            
            this.connect(this[varLabelArrow].domNode, "onclick", this, dojo.hitch(this, "ExpandCollapseServer", this[varLabel].caption));
            this[varPict].setSource(node_logo);

        } catch (e) {
            this.showToastError("setNodeConnected Failed: " + e.toString());
            console.error('ERROR IN setNodeConnected: ' + e);
        }
    },    
    setNodeUnreachable: function(node, error) {
        try {
            varLabel = "LabelServer" + node;
            varPanelMain = "panelMain" + node;
            var varConnected = node + "connected";
            this[varConnected].setValue("dataValue", false);
            //this[varPanelMain].setValue("domNode.title", error);
            dojo.style(this[varPanelMain].domNode, "opacity", 0.5);
            var varPictWait = "PictServerWait" + node;
            this[varPictWait].setShowing(false);
            var varPictVMListWait = "PictVMListWait" + node;
            this[varPictVMListWait].setShowing(false);
            //this[varLabel].setValue("domNode.title", error);
            this.setNodeTooltip(node, error, "error");
            
            var varPict = "PictServer" + node;
            this[varPict].setSource("resources/images/icons/server-warning-30.png");
            //this.updateLog("Contacting node", node, node, "Failed: "+error);
            this._nodesData[node].general.active = false;
            this._nodesData[node].general.state = "Unreachable";
            if (this.TabCenterOverview.isActive()) {
                this.createDataCenterOverview();
            }

        } catch (e) {
            this.showToastError("setNodeUnreachable Failed: " + e.toString());
            console.error('ERROR IN setNodeUnreachable: ' + e);
        }
    },
    labelServerConnectClick: function(inSender, inEvent) {
        try {
            this.serverPopup.hide();
            node = this.varSelectedServer.getValue("dataValue");
            var varService = node + "service";
            var varPictWait = "PictServerWait" + node;
            this[varPictWait].setShowing(true);
            var varPictVMListWait = "PictVMListWait" + node;
            this[varPictVMListWait].setShowing(false);
            var varIP = node + "ip";
            var sIP = this[varIP].getValue("dataValue");
            var varVirt = node + "virt";
            var sVirt = this[varVirt].getValue("dataValue");

            this[varService].setService("serverTools");
            this[varService].setOperation("reconnectToServer");
            this[varService].input.setValue("ipaddr", sIP);
            this[varService].input.setValue("server", node);
            this[varService].input.setValue("force", "True");
            //this[varService].input.setValue("transport", "ssh");
            //this[varService].input.setValue("transport", "tcp");
            //this[varService].input.setValue("driver", sVirt);
            this[varService].update();
            this.addLog("Reconnecting node", node, node, 0);


        } catch (e) {
            this.showToastError("labelConnectServerClick Failed: " + e.toString());
            console.error('ERROR IN labelConnectServerClick: ' + e);
        }
    },
    createAllServers: function() {
        try {
            var count = this.listAllServersLiveVar.getCount();
            var projectData = null;
            var node = "";
            var sIP = "";
            var sVirt = "";
            var nodeList = "";

            for (var i = 0; i < count; i++) {
                projectData = this.listAllServersLiveVar.getData()[i];
                node = projectData.name;
                sIP = projectData.ip;
                sVirt = projectData.hypervisor;
                desc = projectData.descritption;
                if (nodeList === "") {
                    nodeList = node;
                } else {
                    nodeList += "::" + node;
                }
                this.addNewServer(node, sIP, sVirt, false);
            }
            this.createDataCenterOverview();
            //app.toastSuccess("All Nodes Added");
            this.varServersCreated.setValue("dataValue", true);

        } catch (e) {
            this.showToastError("createAllServers Failed: " + e.toString());
        }
    },
    createAllVMs: function() {
        try {
            var count = this.tablevmsLiveVariable2.getCount();
            var projectData = null;
            var node = "";
            var vName = "";
            var vmList = "";
            for (var i = 0; i < count; i++) {

                projectData = this.tablevmsLiveVariable2.getData()[i];
                node = projectData.server;
                vName = projectData.name;
                if (i === 0) {
                    vmList = vName;
                } else {
                    vmList += "::" + vName;
                }
                if (vName === "OpenKVI") {
                    this.addOpenKVI(vName, node, false);
                } else {
                    this.addVM(vName, node, false);
                }

            }
            this.getAllNodesInfo();
        } catch (e) {
            this.showToastError("createAllVMs Failed: " + e.toString());
        }
    },
    createAllVmsByServer: function(node) {
        try {
            var varVmList = node + "VmList";
            var vmList = this[varVmList].getValue("dataValue");
            if ((vmList !== undefined) && (vmList !== "")) {
                var infos = vmList.split("::");
                var varPictVMListWait = "PictVMListWait" + node;
                this[varPictVMListWait].setShowing(false);
                var varPictWait = "PictServerWait" + node;
                var vName = "";
                var count = infos.length;
                if (count > 0) {
                    for (var i = 0; i < count; i++) {
                        vName = infos[i];
                        if (vName === "OpenKVI") {
                            this.addOpenKVI(vName, node, false);
                        } else {
                            this.addVM(vName, node, false);
                        }
                    }
                    var varGetVmListStatus = node + "javaGetVmListStatus";
                    this[varGetVmListStatus].input.setValue("node", node);
                    this[varGetVmListStatus].input.setValue("vmList", vmList);
                    this[varGetVmListStatus].update();
                } else if (this[varPictWait] !== undefined) {
                    this[varPictWait].setShowing(false);
                }
            }
        } catch (e) {
            this.showToastError("createAllVmsByServer Failed: " + e.toString());
        }
    },
    getVmListStatus: function(node) {
        try {
            var varVmList = node + "VmList";
            var vmList = this[varVmList].getValue("dataValue");
            if ((vmList !== undefined) && (vmList !== "")) {
                var varGetVmListStatus = node + "javaGetVmListStatus";
                this[varGetVmListStatus].input.setValue("node", node);
                this[varGetVmListStatus].input.setValue("vmList", vmList);
                this[varGetVmListStatus].update();
            }

        } catch (e) {
            this.showToastError("getVmListStatus Failed: " + e.toString());
        }
    },

    removeServer: function(node, showErr) {
        try {
            var panelName = "panelMain" + node;
            var varPict = "PictServer" + node;
            this._maxVmPanelHeight -= 52;
            this[panelName].destroy();
            this.panelServers.reflow();
        } catch (e) {
            console.error('ERROR IN removeServer: ' + e);
            this.showToastError("removeServer Failed: " + e.toString());
        }
    },
    addNewServer: function(node, sIP, sVirt, newServer) {
        try {
            if (this._nodesData[node] === undefined) {
                this._nodesData[node] = {};
            }
            if (this._expandedNodes[node] === undefined) {
                this._expandedNodes[node] = {};
                this._expandedNodes[node].size = 5;
                this._expandedNodes[node].showing = false;
            }
            this._nodesData[node].general = {
                "type": sVirt,
                "ip": sIP,
                "active": true,
                "state": "open",
                "vms": {
                    "actives": 0,
                    "total": 0,
                    "list": []
                }
            };
            var s = node;

            varPanelMain = "panelMain" + s;
            this.panelServers.createComponent(varPanelMain, "wm.Panel", {
                layoutKind: "top-to-bottom",
                verticalAlign: "top",
                horizontalAlign: "left",
                width: "100%",
                fitToContentHeight: true
            });
            this[varPanelMain].addUserClass("wm_BorderTopStyle_Curved4px");
            this[varPanelMain].addUserClass("wm_BorderBottomStyle_Curved4px");

            varPanel = "panelNode" + s;
            this[varPanelMain].createComponent(varPanel, "wm.Panel", {
                layoutKind: "left-to-right",
                verticalAlign: "middle",
                horizontalAlign: "left",
                width: "100%",
                border: 0,
                borderColor: "#888888",
                margin: "3,4,4,5",
                fitToContentHeight: true
            });

            var panelAllVmList = "panelAllVmList" + s;
            this[varPanelMain].createComponent(panelAllVmList, "wm.Panel", {
                layoutKind: "top-to-bottom",
                verticalAlign: "top",
                horizontalAlign: "left",
                width: "100%",
                autoScroll: true
            });
            this[panelAllVmList].setShowing(false);

            var varPanelVM = "panelVmList" + s;
            this[panelAllVmList].createComponent(varPanelVM, "wm.Panel", {
                layoutKind: "top-to-bottom",
                verticalAlign: "top",
                horizontalAlign: "left",
                width: "100%",
                height: "100%",
                border: "0,0,0,1",
                borderColor: "#b3b8c4",
                margin: "0,0,0,17",
                fitToContentHeight: true
            });
            this[varPanelVM].setShowing(false);

            var varPanelOpenKVI = "panelOpenKVI" + s;
            this[panelAllVmList].createComponent(varPanelOpenKVI, "wm.Panel", {
                layoutKind: "top-to-bottom",
                verticalAlign: "top",
                horizontalAlign: "left",
                width: "100%",
                border: "0,0,0,1",
                borderColor: "#b3b8c4",
                //padding: "0,0,0,30",
                margin: "0,0,0,17",
                fitToContentHeight: true
            });
            this[varPanelOpenKVI].setShowing(false);
            //dojo.style(this[varPanelOpenKVI].domNode, "display", "none");
            //this[varPanelOpenKVI].domNode.style.backgroundColor = "#efefe2";
            //this[varPanelOpenKVI].addUserClass("wm_BackgroundChromeBar_LightBlue");
            var varPanelEnd = "panelNodeEnd" + s;
            this[varPanelMain].createComponent(varPanelEnd, "wm.Panel", {
                layoutKind: "top-to-bottom",
                verticalAlign: "top",
                horizontalAlign: "left",
                width: "100%",
                height: "10px",
                margin: "0,10,0,10",
                border: "0"
            });

            this.connect(this[varPanelMain].domNode, "ondragover", this, function(event) {
                event.preventDefault();
                this.nodeOndragover(node);
            });
            this.connect(this[varPanelMain].domNode, "ondragleave", this, function(event) {
                this.nodeOndragleave(node);
            });
            this.connect(this[varPanelMain].domNode, "ondrop", this, function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.nodeOndrop(node);
            });


            this[varPanel].addUserClass("wm_BorderTopStyle_Curved4px");
            this[varPanel].addUserClass("wm_BorderBottomStyle_Curved4px");
            var varLabelArrow = "LabelArrow" + s;
            this[varPanel].createComponent(varLabelArrow, "wm.Label", {
                width: "20px",
                height: "20px",
                caption: '<image src="resources/images/icons/arrow-right.png"/>'
            });
            var node_logo = "resources/images/icons/server-30.png";
            if (sVirt === "kvm") {
                node_logo = "resources/images/icons/server-kvm.png";
            } else if (sVirt === "esx") {
                node_logo = "resources/images/icons/server-esx.png";
            } else if (sVirt === "qemu") {
                node_logo = "resources/images/icons/server-qemu.png";
            }

            var varPict = "PictServer" + s;
            this[varPanel].createComponent(varPict, "wm.Picture", {
                width: "30px",
                height: "34px",
                source: node_logo
            });
            var varLabel = "LabelServer" + s;
            this[varPanel].createComponent(varLabel, "wm.Label", {
                caption: s,
                width: "100%"
            });
            this[varLabel].domNode.style.cursor = "pointer";
            this.addToolTip(this[varLabel].domNode, s, "IP: "+sIP+"</br>Type: "+sVirt, "notice", 1200);
            
            this.connect(this[varLabel].domNode, "oncontextmenu", this, function(event) {
                this.varMousePosition.setValue("top", event.clientY);
                this.varMousePosition.setValue("left", event.clientX);
                dojo.stopEvent(event);
                this.nodeLabelShowPopup(this[varLabel].caption, this[varLabel].domNode, true);
            });

            var varPictWait = "PictServerWait" + s;
            this[varPanel].createComponent(varPictWait, "wm.Picture", {
                width: "16px",
                height: "16px",
                source: "resources/images/icons/loading/ajax-loader-arrows.gif"
            });
            var varPictVMListWait = "PictVMListWait" + s;
            this[panelAllVmList].createComponent(varPictVMListWait, "wm.Picture", {
                width: "100%",
                height: "16px",
                align: "center",
                source: "resources/images/icons/loading/ajax-loader-arrows.gif"
            });
            this[varPictVMListWait].setShowing(false);
            
            var varIP = s + "ip";
            this.createComponent(varIP, "wm.Variable");
            this[varIP].setValue("dataValue", sIP);

            var varVirt = s + "virt";
            this.createComponent(varVirt, "wm.Variable");
            this[varVirt].setValue("dataValue", sVirt);

            var varConnected = s + "connected";
            this.createComponent(varConnected, "wm.Variable");
            this[varConnected].setValue("dataValue", false);

            var varVms = s + "VmCreated";
            this.createComponent(varVms, "wm.Variable");
            this[varVms].setValue("dataValue", false);

            var varVmList = s + "VmList";
            this.createComponent(varVmList, "wm.Variable");
            this[varVms].setValue("dataValue", "");

            var nodeWebshell = s + "nodeWebshell";
            this.createComponent(nodeWebshell, "wm.Variable");
            this[nodeWebshell].setValue("dataValue", "no");
            var nodeWebshellSsl = s + "nodeWebshellSsl";
            this.createComponent(nodeWebshellSsl, "wm.Variable");
            this[nodeWebshellSsl].setValue("dataValue", "no");


            dojo.place(this[varPanelMain].domNode, this.panelServers.domNode, 0);


            var varService = s + "service";
            this.createComponent(varService, "wm.ServiceVariable", {
                "autoUpdate": false,
                "startUpdate": false
            }, {
                "onResult": "serverServiceResult"
            });
            this[varService].setService("serverTools");
            this[varService].setOperation("connectToServer");

            var javaNodeHardwareInfo = s + "nodeHardwareInfo";
            this.createComponent(javaNodeHardwareInfo, "wm.ServiceVariable", {
                "autoUpdate": false,
                "startUpdate": false
            }, {
                "onResult": "javaGetNodeHardwareInfoResult"
            });
            this[javaNodeHardwareInfo].setService("serverTools");
            this[javaNodeHardwareInfo].setOperation("getServerInfo");

            var javaNodeRessourcesInfo = s + "nodeRessourcesInfo";
            this.createComponent(javaNodeRessourcesInfo, "wm.ServiceVariable", {
                "autoUpdate": false,
                "startUpdate": false
            }, {
                "onResult": "javaGetNodeRessourcesInfoResult"
            });
            this[javaNodeRessourcesInfo].setService("serverTools");
            this[javaNodeRessourcesInfo].setOperation("getServerRessources");


            var javaNodeCapa = s + "nodeCapa";
            this.createComponent(javaNodeCapa, "wm.ServiceVariable", {
                "autoUpdate": false,
                "startUpdate": false
            }, {
                "onResult": "javaGetCapabilitiesResult"
            });
            this[javaNodeCapa].setService("serverTools");
            this[javaNodeCapa].setOperation("getServerCapabilities");
            this[javaNodeCapa].input.setValue("node", s);

            var javaNodeNetwork = s + "javaNodeNetwork";
            this.createComponent(javaNodeNetwork, "wm.ServiceVariable", {
                "autoUpdate": false,
                "startUpdate": false
            }, {
                "onResult": "javaGetServerNetworkInfoResult"
            });
            this[javaNodeNetwork].setService("serverTools");
            this[javaNodeNetwork].setOperation("getServerNetworkInfos");
            this[javaNodeNetwork].input.setValue("force", false);


            var javaListAllVms = s + "javaListAllVms";
            this.createComponent(javaListAllVms, "wm.ServiceVariable", {
                "autoUpdate": false,
                "startUpdate": false
            }, {
                "onResult": "javaListAllVmsResult"
            });
            this[javaListAllVms].setService("serverTools");
            this[javaListAllVms].setOperation("listAllVms");

            var varGetVmListStatus = s + "javaGetVmListStatus";
            this.createComponent(varGetVmListStatus, "wm.ServiceVariable", {
                "autoUpdate": false,
                "startUpdate": false
            }, {
                "onResult": "javaGetVmListStatusResult"
            });
            this[varGetVmListStatus].setService("vmTools");
            this[varGetVmListStatus].setOperation("getVmListStatus");

            var varGetVmListScreenshot = s + "getVmListScreenshot";
            this.createComponent(varGetVmListScreenshot, "wm.ServiceVariable", {
                "autoUpdate": false,
                "startUpdate": false
            }, {
                "onResult": "javaGetVmListScreenshotResult"
            });
            this[varGetVmListScreenshot].setService("serverTools");
            this[varGetVmListScreenshot].setOperation("getVmListScreenshot");


            if (newServer) {
                this[varPictWait].setShowing(false);
                this[varConnected].setValue("dataValue", true);
                this[varVms].setValue("dataValue", true);

            } else {
                dojo.style(this[varPanelMain].domNode, "opacity", 0.5);
            }
            this[varService].input.setValue("ipaddr", sIP);
            this[varService].input.setValue("server", node);
            this[varService].input.setValue("force", "False");
            this[varService].update();

            this[varPanelMain].reflow();
            this._maxVmPanelHeight += 52;

        } catch (e) {
            console.error('ERROR IN addNewServer: ' + e);
            this.showToastError("ERROR IN addNewServer: " + e.toString());
        }
    },
    setNodeTooltip: function(node, tooltip, type) {
        try {
            var varLabel = "LabelServer" + node;
            this.updateToolTip(this[varLabel].domNode, node, tooltip, type);
        } catch (e) {
            console.error('ERROR IN setNodeTooltip: ' + e);
        }
    },
    resizePanelAllVmList: function(node, size) {
        try {
            var panelAllVmList = "panelAllVmList" + node;
            //var panelAllVmListHeight = parseInt(this[panelAllVmList].domNode.style.height.replace(/px/g, ""), 10);
            var panelAllVmListHeight = this._expandedNodes[node].size;
            var newHeight = 0;
            newHeight = panelAllVmListHeight + size;
            if (newHeight <= 5) {
                newHeight = 5;
            }

            var panelVmList = "panelVmList" + node;
            var varOpenkviPanel = "panelOpenKVI" + node;
            if ((this[varOpenkviPanel].showing) && (newHeight === 37)) {
                this[panelVmList].setShowing(false);
            } else if (newHeight < 37) {
                this[panelVmList].setShowing(false);
            }

            this._expandedNodes[node].size = newHeight;
            this[panelAllVmList].setHeight(newHeight.toString());
            var varPanelMain = "panelMain" + node;
            this[varPanelMain].reflow();

        } catch (e) {
            console.error('ERROR IN resizePanelAllVmList: ' + e);
        }
    },
    nodeLabelShowPopup: function(node, domNode, activate) {
        try {
            if ((node === this._nodePopup.name) && (this._nodePopup.showing) && (this._nodePopup.caller === "nodeLabel")) {
                this._nodePopup = {
                    "name": node,
                    "showing": false,
                    "caller": "nodeLabel"
                };
                this.serverPopup.hide();
            } else {
                this._nodePopup = {
                    "name": node,
                    "showing": true,
                    "caller": "nodeLabel"
                };
                this.showPopupMenu(node, domNode, activate);
            }
        } catch (e) {
            console.error('ERROR IN nodeLabelShowPopup: ' + e);
        }
    },
    nodeOndragover: function(node) {
        try {
            var varPanelMain = "panelMain" + node;
            if ((this._varMoveVm !== {}) && (this._varMoveVm.node !== node)) {
                this[varPanelMain].setBorder("2");
            }
            return false;
        } catch (e) {
            console.error('ERROR IN nodeOndragover: ' + e);
        }
    },
    nodeOndragleave: function(node) {
        try {
            var varPanelMain = "panelMain" + node;
            this[varPanelMain].setBorder("0");
        } catch (e) {
            console.error('ERROR IN nodeOndragleave: ' + e);
        }
    },
    nodeOndrop: function(node) {
        try {
            var varPanelMain = "panelMain" + node;
            this[varPanelMain].setBorder("0");
            if (this._varMoveVm !== {}) {
                var vName = this._varMoveVm.vm;
                var source = this._varMoveVm.node;
                this._varMoveVm = {};
                this.varVmToMigrate.setValue("name", vName);
                this.varVmToMigrate.setValue("from", source);
                this.varVmToMigrate.setValue("to", node);

                dojo.cookie("openkvi_vm_migration_source_" + vName + "_" + source, "active:::" + node, {
                    //key expire after 2 hours
                    expires: 0.012
                });
                dojo.cookie("openkvi_vm_migration_dest_" + vName + "_" + node, "active:::" + source, {
                    //key expire after 2 hours
                    expires: 0.012
                });
                if (source !== node) {
                    var picLabel = "picLabel" + vName + "__" + source;
                    if (this[picLabel].caption.indexOf("secure-22.png") === -1) {
                        this.showConfirmDialog("This will migrate " + vName + " from " + source + " to " + node, "migrateVm", true);
                    }
                }
            }

        } catch (e) {
            this.showToastError("ERROR IN nodeOndrop: " + e.toString());
            console.error('ERROR IN nodeOndrop: ' + e);
        }
    },
    migrateVm: function() {
        try {
            var vName = this.varVmToMigrate.getValue("name");
            var source = this.varVmToMigrate.getValue("from");
            var node = this.varVmToMigrate.getValue("to");

            this.addLog("Migration", vName, source, 0, "progress");
            this.javaMigrateVm.input.setValue("node", source);
            this.javaMigrateVm.input.setValue("vName", vName);
            this.javaMigrateVm.input.setValue("target", node);
            this.javaMigrateVm.update();

        } catch (e) {
            this.showToastError("ERROR IN migrateVm: " + e.toString());
            console.error('ERROR IN migrateVm: ' + e);
        }
    },

    javaMigrateVmResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaMigrateVm.getValue("dataValue");
            this.logDebugServer("javaMigrateVm: " + result);
            if (result.indexOf("Error:") > -1) {
                var status = "";
                var node = "";
                var vName = "";
                if (result.indexOf("result") > -1) {
                    var jsonVar = JSON.parse(result);
                    status = jsonVar.action.result;
                    vName = jsonVar.action.vm;
                    node = jsonVar.node;
                    destNode = jsonVar.action.dest;
                } else {
                    var args = result.split("::");
                    vName = args[0];
                    node = args[1];
                    status = args[2];
                }
                this.showWarning("<p>Cannot migrate Virtual Machine <B>" + vName + "</B> from " + node + " to " + destNode + ":<br><i>" + status + "</i></br></p>");
                //app.alert("<p>Cannot migrate Virtual Machine <B>"+vName+"</B>:<br><i>"+status+"</i></br></p>");
                this.updateLog("Migration", vName, node, status);
            }

        } catch (e) {
            this.showToastError("ERROR IN javaMigrateVmResult: " + e.toString());
            console.error('ERROR IN javaMigrateVmResult: ' + e);
        }
    },
    serverPopupClose: function(inSender, inWhy) {
        try {
            this._nodePopup.showing = false;
        } catch (e) {
            console.error('ERROR IN serverPopupClose: ' + e);
        }
    },
    showPopupMenu: function(node, domNode, activate, opacity) {
        try {
            this.hideOpenkviToolTip();
            if (this.tabVirtualMachines.getActiveLayer().name === "Configuration") {
                if (this.vmConfigSave.disabled === false) {
                    this._vmTabChangeParams = [node, domNode];
                    this.unsavedVirtualMachinesChanges('showPopupMenu');
                    return 0;
                }
            }
            var oldNode = this.varSelectedServer.getValue("dataValue");
            this.serverPopup.fixPositionNode = domNode;
            var varConnected = node + "connected";

            if (this[varConnected].getValue("dataValue") === false) {
                this.panelPopupImportVm.setShowing(false);
                this.panelPopupAddVm.setShowing(false);
                this.serverPopup.setHeight("87");
                this.varSelectedServer.setValue("dataValue", node);
                if (activate) {
                    this.highLightSelectedServer(node);
                }
            } else {
                var selectedPanel = this.varSelectedItem.getValue("dataValue");
                var varPanel = "panelNode" + node;
                if ((node !== oldNode) || (varPanel !== selectedPanel)) {
                    this.varSelectedServer.setValue("dataValue", node);
                    this.labelServerClick(node, activate);
                }
                this.panelPopupImportVm.setShowing(true);
                this.panelPopupAddVm.setShowing(true);
                this.serverPopup.setHeight("155");
            }
            if (this._userRole === "PowerUser") {
                this.serverPopup.setHeight("50");
            }
            var top = this.varMousePosition.getValue("top");
            var left = this.varMousePosition.getValue("left");


            this.serverPopup.show();
            this.setMenuPosition(this.serverPopup, top, left);
            //this.serverPopup.domNode.style.top = top+"px";
            //this.serverPopup.domNode.style.left = left+"px";
        } catch (e) {
            this.showToastError("ERROR IN showPopupMenu: " + e.toString());
            console.error('ERROR IN showPopupMenu: ' + e);
        }
    },

    checkboxPasswdChange: function(inSender) {
        try {
            this.editPassword.setPassword(this.checkboxPasswd.getChecked());

        } catch (e) {
            console.error('ERROR IN checkboxPasswdChange: ' + e);
        }
    },
    removeVmPanel: function(vName, node) {
        try {
            var panelVM = "panelVm" + vName + "__" + node;
            var panelVMHeight = parseInt(this[panelVM].height, 10);

            if (this[panelVM] !== undefined) {
                var parent = this[panelVM].parent;
                var varLabel = "Label" + vName + "__" + node;
                var picLabel = "picLabel" + vName + "__" + node;
                var varPictWait = "PictVmWait" + vName + "__" + node;
                var varServer = "Server" + vName + "__" + node;
                if (this[varServer] !== undefined) {
                    this[varServer].destroy();
                }
                if (this[varPictWait] !== undefined) {
                    this[varPictWait].destroy();
                }
                if (this[picLabel] !== undefined) {
                    this[picLabel].destroy();
                }
                if (this[varLabel] !== undefined) {
                    this[varLabel].destroy();
                }
                if (this[panelVM] !== undefined) {
                    this[panelVM].destroy();
                }
                if (parent.name === "panelOpenKVI" + node) {
                    parent.setShowing(false);
                }
                this.resizePanelAllVmList(node, -32);
            }
        } catch (e) {
            this.showToastError("removeVmPanel Failed: " + e.toString());
            console.error('ERROR IN removeVmPanel: ' + e);
        }
    },
    removeVmData: function(vName, node) {
        try {
            varLabel = "Label" + vName + "__" + node;
            if (this[varLabel] !== undefined) {
                this.removeVmPanel(vName, node);
                this.tablevmsLiveVariable2.update();
                this.vmListByServerLive.filter.setValue("server", node);
                this.vmListByServerLive.update();
                del_cookie = dojo.cookie("openkvi_vm_delete");
                if (del_cookie === vName + ":::" + node) {
                    dojo.cookie("openkvi_vm_delete", "", {
                        expires: 0.00001
                    });
                    app.toastSuccess("Virtual machine deleted.");
                }
            }
            var selectedVm = this.varSelectedVm.getValue("dataValue").split("__")[0];
            var selectedNode = this.varSelectedServer.getValue("dataValue");
            if ((selectedNode === node) || (selectedVm === vName)) {
                this.labelServerClick(node);
            }
        } catch (e) {
            this.showToastError("removeVmData Failed: " + e.toString());
            console.error('ERROR IN removeVmData: ' + e);
        }
    },

    addVM: function(vName, node, status) {
        try {
            var panelVmList = "panelVmList" + node;
            if (status === true) {
                var varPanel2 = "LabelArrow" + node;
                //var state = this[varPanel2].getValue("domNode.title");
                var state = this._toolTipList[varPanel2].msg;
                if (state === "Expand") {
                    this.ExpandServer(node);
                }
            }

            var panelVM = "panelVm" + vName + "__" + node;
            if (this[panelVM] === undefined) {
                this[panelVmList].createComponent(panelVM, "wm.Panel", {
                    layoutKind: "left-to-right",
                    verticalAlign: "middle",
                    horizontalAlign: "left",
                    width: "100%",
                    margin: "1,5,3,5",
                    height: "32px"
                    //fitToContentHeight: true
                });
                this[panelVM].addUserClass("wm_BorderTopStyle_Curved4px");
                this[panelVM].addUserClass("wm_BorderBottomStyle_Curved4px");
                this[panelVM].domNode.draggable = true;
                this[panelVM].domNode.style.cursor = "pointer";
                this.addToolTip(this[panelVM].domNode, vName, "is stopped", "notice", 1000);
                
                var picLabel = "picLabel" + vName + "__" + node;
                this[panelVM].createComponent(picLabel, "wm.Label", {
                    width: "28px",
                    height: "28px",
                    padding: "3,4,4,5",
                    caption: '<image style="height: 20px;" src="resources/images/icons/20/system-shutdown.png"/>'
                });

                var varLabel = "Label" + vName + "__" + node;
                this[panelVM].createComponent(varLabel, "wm.Label", {
                    width: "100%",
                    height: "24px",
                    caption: this.getVmDisplayedName(vName, node)
                });
                var varPictWait = "PictVmWait" + vName + "__" + node;
                this[panelVM].createComponent(varPictWait, "wm.Picture", {
                    width: "24px",
                    height: "24px",
                    source: "resources/images/icons/loading/ajax-loader-arrows.gif"
                });
                this[varPictWait].setDisabled(true);
                this[varPictWait].setShowing(false);

                this.setVmDragAndDrop(vName, node);


                this.connect(this[varLabel].domNode, "onclick", this, dojo.hitch(this, "labelVMClick", vName + "__" + node));

                this.connect(this[varLabel].domNode, "oncontextmenu", this, function(event) {
                    this.varMousePosition.setValue("top", event.clientY);
                    this.varMousePosition.setValue("left", event.clientX);
                    dojo.stopEvent(event);
                    this.showVmPopupMenu(this[varLabel], node);
                });
                if (!this[panelVmList].showing) {
                    this[panelVmList].setShowing(true);
                } else {
                    this[panelVmList].reflow();
                }
                var varServer = "server" + vName + "__" + node;
                this.createComponent(varServer, "wm.Variable");
                this[varServer].setValue("dataValue", node);

                var varVnc = "VNC" + vName + "__" + node;
                this.createComponent(varVnc, "wm.Variable");
                this[varVnc].setValue("dataValue", "none");

                var varStatus = "Status" + vName + "__" + node;
                this.createComponent(varStatus, "wm.Variable");
                this[varStatus].setValue("dataValue", "stopped");
                this.connect(this[varStatus], "onSetData", this, dojo.hitch(this, "vmStatusChanged", vName + "__" + node));


                var varLock = "Lock" + vName + "__" + node;
                if (this[varLock] === undefined) {
                    this.createComponent(varLock, "wm.Variable");
                    this[varLock].setType("lockTypeDef");
                    this[varLock].setData({
                        "Snapshot": false,
                        "Migration": false,
                        "Disabled": false
                    });
                }


                if (status === true) {
                    this.logDebugServer("ask status for " + vName);
                    this.javaGetVmStatus.input.setValue("node", node);
                    this.javaGetVmStatus.input.setValue("vName", vName);
                    this.javaGetVmStatus.update();
                }

                // Set the variable data
                this.vmList.addItem({
                    name: vName,
                    dataValue: node
                });
                this.resizePanelAllVmList(node, 32);
            }

        } catch (e) {
            console.error('ERROR IN addVM: ' + e);
            this.showToastError("ERROR IN addVM: " + e.toString());
        }
    },
    addOpenKVI: function(vName, node, status) {
        try {
            var userRole = this.getUserRoles.getValue('dataValue');
            var varPanel = "panelOpenKVI" + node;
            if ((userRole === "dev") || (userRole === "Administrator")) {
                if (status === true) {
                    var varPanel2 = "LabelArrow" + node;
                    //var state = this[varPanel2].getValue("domNode.title");
                    var state = this._toolTipList[varPanel2].msg;
                    if (state === "Expand") {
                        this.ExpandServer(node);
                    }
                }

                var panelVM = "panelVm" + vName + "__" + node;
                if (this[panelVM] === undefined) {
                    this[varPanel].createComponent(panelVM, "wm.Panel", {
                        layoutKind: "left-to-right",
                        verticalAlign: "middle",
                        horizontalAlign: "left",
                        width: "100%",
                        margin: "1,5,3,5",
                        height: "32px"
                        //fitToContentHeight: true
                    });
                    this[panelVM].addUserClass("wm_BorderTopStyle_Curved4px");
                    this[panelVM].addUserClass("wm_BorderBottomStyle_Curved4px");
                    var picLabel = "picLabel" + vName + "__" + node;
                    this.addToolTip(this[panelVM].domNode, vName, "is stopped", "notice", 1000);
                    
                    this[panelVM].createComponent(picLabel, "wm.Label", {
                        width: "28px",
                        height: "28px",
                        padding: "3,4,4,5",
                        caption: '<image style="height: 20px;" src="resources/images/icons/20/system-shutdown.png"/>'
                    });
                    
                    var varLabel = "Label" + vName + "__" + node;
                    this[panelVM].createComponent(varLabel, "wm.Label", {
                        width: "100%",
                        height: "24px",
                        caption: "<i>OpenKVI</i>"
                    });
                    this[varLabel].addUserClass("wm_FontColor_Evergreen");
                    var varPictWait = "PictVmWait" + vName + "__" + node;
                    this[panelVM].createComponent(varPictWait, "wm.Picture", {
                        width: "24px",
                        height: "24px",
                        source: "resources/images/icons/loading/ajax-loader-arrows.gif"
                    });
                    this[varPictWait].setDisabled(true);
                    this[varPictWait].setShowing(false);

                    this[varLabel].domNode.style.cursor = "pointer";
                    this.connect(this[varLabel].domNode, "onclick", this, dojo.hitch(this, "labelVMClick", vName + "__" + node));

                    this.connect(this[varLabel].domNode, "oncontextmenu", this, function(event) {
                        this.varMousePosition.setValue("top", event.clientY);
                        this.varMousePosition.setValue("left", event.clientX);
                        dojo.stopEvent(event);
                        this.showVmPopupMenu(this[varLabel], node);
                    });
                    if (!this[varPanel].showing) {
                        this[varPanel].setShowing(true);
                    } else {
                        this[varPanel].reflow();
                    }
                    var varServer = "server" + vName + "__" + node;
                    this.createComponent(varServer, "wm.Variable");
                    this[varServer].setValue("dataValue", node);

                    var varVnc = "VNC" + vName + "__" + node;
                    this.createComponent(varVnc, "wm.Variable");
                    this[varVnc].setValue("dataValue", "none");

                    var varStatus = "Status" + vName + "__" + node;
                    this.createComponent(varStatus, "wm.Variable");
                    this[varStatus].setValue("dataValue", "stopped");
                    this.connect(this[varStatus], "onSetData", this, dojo.hitch(this, "vmStatusChanged", vName + "__" + node));
                    var varLock = "Lock" + vName + "__" + node;
                    if (this[varLock] === undefined) {
                        this.createComponent(varLock, "wm.Variable");
                        this[varLock].setType("lockTypeDef");
                        this[varLock].setData({
                            "Snapshot": false,
                            "Migration": false,
                            "Disabled": false
                        });
                    }
                    if (status === true) {
                        this.logDebugServer("ask status for " + vName);
                        this.javaGetVmStatus.input.setValue("node", node);
                        this.javaGetVmStatus.input.setValue("vName", vName);
                        this.javaGetVmStatus.update();
                    }
                    // Set the variable data
                    this.vmList.addItem({
                        name: vName,
                        dataValue: node
                    });

                    this.resizePanelAllVmList(node, 32);
                } else {
                    this[varPanel].setShowing(false);
                    this[varPanel].setDisabled(true);
                }
            }
        } catch (e) {
            console.error('ERROR IN addOpenKVI: ' + e);
            this.showToastError("ERROR IN addOpenKVI: " + e.toString());
        }
    },
    setVmTooltip: function(vm, node, tooltip, type) {
        try {
            var panelVM = "panelVm" + vm + "__" + node;
            this.updateToolTip(this[panelVM].domNode, vm, tooltip, type);
        } catch (e) {
            console.error('ERROR IN setVmTooltip: ' + e);
        }
    },
    setVmDragAndDrop: function(vName, node) {
        try {
            var panelVM = "panelVm" + vName + "__" + node;
            this.connect(this[panelVM].domNode, "ondragstart", this, function(event) {
                this._varMoveVm = {
                    "node": node,
                    "vm": vName
                };
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text", event.target.id);
            });
            this.connect(this[panelVM].domNode, "ondragend", this, function(event) {
                event.dataTransfer.clearData();
                this._varMoveVm = {};
            });
        } catch (e) {
            this.showToastError("ERROR IN labelVMDrag: " + e.toString());
        }
    },
    unsetVmDragAndDrop: function(vName, node) {
        try {
            var panelVM = "panelVm" + vName + "__" + node;
            this.connect(this[panelVM].domNode, "ondragstart", this, function(event) {});
            this.connect(this[panelVM].domNode, "ondragend", this, function(event) {});
        } catch (e) {
            this.showToastError("ERROR IN labelVMDrag: " + e.toString());
        }
    },
    labelVMDrag: function(vName) {
        try {
            //app.toastInfo("dragging "+vName);
        } catch (e) {
            this.showToastError("ERROR IN labelVMDrag: " + e.toString());
        }
    },
    vmStatusChanged: function(vmInfos) {
        try {
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            var selectedVmInfos = this.varSelectedVm.getValue("dataValue");
            var selectDic = selectedVmInfos.split("__");
            var selectedVm = selectDic[0];
            var selectedNode = selectDic[1];
            if (selectedVm === vName) {
                var varStatus = "Status" + vmInfos;
                var vmStatus = this[varStatus].getValue("dataValue");
                if (vmStatus === "running") {
                    this.disableLabel(this.labelVmStart);
                    this.enableLabel(this.labelVmStop);
                    this.enableLabel(this.labelVmPause);
                    this.enableLabel(this.labelVmSuspend);
                    this.enableLabel(this.labelVmReboot);
                    this.enableLabel(this.labelVmKill);
                    this.startVmVncBtn.setDisabled(true);
                    this.startVmVncBtn.removeUserClass("wm_BackgroundChromeBar_LightGray");
                    this.pauseVmVncBtn.setDisabled(false);
                    this.pauseVmVncBtn.addUserClass("wm_BackgroundChromeBar_LightGray");
                    this.stopVmVncBtn.setDisabled(false);
                    this.stopVmVncBtn.addUserClass("wm_BackgroundChromeBar_LightGray");
                    this.killVmVncBtn.setDisabled(false);
                    this.killVmVncBtn.addUserClass("wm_BackgroundChromeBar_LightGray");

                } else if ((vmStatus === "stopped") || (vmStatus === "suspended")) {
                    this.labelVmStart.setCaption("Power on");
                    this.enableLabel(this.labelVmStart);
                    this.disableLabel(this.labelVmStop);
                    this.disableLabel(this.labelVmPause);
                    this.disableLabel(this.labelVmReboot);
                    this.disableLabel(this.labelVmKill);
                    this.disableLabel(this.labelVmSuspend);
                    this.startVmVncBtn.setDisabled(false);
                    this.startVmVncBtn.addUserClass("wm_BackgroundChromeBar_LightGray");
                    this.startVmVncBtn.hint = "Start Virtual Machine";
                    this.pauseVmVncBtn.setDisabled(true);
                    this.pauseVmVncBtn.removeUserClass("wm_BackgroundChromeBar_LightGray");
                    this.stopVmVncBtn.setDisabled(true);
                    this.stopVmVncBtn.removeUserClass("wm_BackgroundChromeBar_LightGray");
                    this.killVmVncBtn.setDisabled(true);
                    this.killVmVncBtn.removeUserClass("wm_BackgroundChromeBar_LightGray");

                } else if (vmStatus === "paused") {
                    this.labelVmStart.setCaption("Resume");
                    this.enableLabel(this.labelVmStart);
                    this.disableLabel(this.labelVmStop);
                    this.disableLabel(this.labelVmPause);
                    this.disableLabel(this.labelVmReboot);
                    this.enableLabel(this.labelVmKill);
                    this.disableLabel(this.labelVmSuspend);
                    this.startVmVncBtn.setDisabled(false);
                    this.startVmVncBtn.addUserClass("wm_BackgroundChromeBar_LightGray");
                    this.startVmVncBtn.hint = "Resume Virtual Machine";
                    this.pauseVmVncBtn.setDisabled(true);
                    this.pauseVmVncBtn.removeUserClass("wm_BackgroundChromeBar_LightGray");
                    this.stopVmVncBtn.setDisabled(true);
                    this.stopVmVncBtn.removeUserClass("wm_BackgroundChromeBar_LightGray");
                    //this.killVmVncBtn.setDisabled(true);
                    //this.killVmVncBtn.addUserClass("wm_BackgroundChromeBar_LightGray");
                }
            }
        } catch (e) {
            this.showToastError("ERROR IN vmStatusChanged: " + e.toString());
        }
    },
    showVmPopupMenu: function(inSender, node) {
        try {
            if (this.tabVirtualMachines.getActiveLayer().name === "Configuration") {
                if (this.vmConfigSave.disabled === false) {
                    this._vmTabChangeParams = [inSender, node];
                    this.unsavedVirtualMachinesChanges('showVmPopupMenu');
                    return 0;
                }
            }

            this.varSelectedServer.setValue("dataValue", node);

            var vmInfos = inSender.getId().replace("Label", "");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];

            var panelName = "panelVm" + vmInfos;
            var selectedPanel = this.varSelectedItem.getValue("dataValue");
            if (panelName !== selectedPanel) {
                this.labelVMClick(vmInfos);
            }

            var top = this.varMousePosition.getValue("top");
            var left = this.varMousePosition.getValue("left");

            var picLabel = "picLabel" + vmInfos;
            var caption = this[picLabel].caption;
            //var varLock = vName + "Lock";
            var locked = this.vmIsLocked(vmInfos);

            if (caption.indexOf("dialog-warning") > -1) {
                this.VmPopupMenuRemove.fixPositionNode = inSender.domNode;
                this.VmPopupMenuRemove.show();
                this.setMenuPosition(this.VmPopupMenuRemove, top, left);
            } else if (locked === false) {
                this.VmPopupMenu.fixPositionNode = inSender.domNode;
                this.showVmPopup();
                this.setMenuPosition(this.VmPopupMenu, top, left);
            }


        } catch (e) {
            this.showToastError("ERROR IN showVmPopupMenu: " + e.toString());
            console.error('ERROR IN showVmPopupMenu: ' + e);
        }
    },
    setMenuPosition: function(menu, mouseX, mouseY) {
        try {
            var strMainHeight = this.mainLayoutBox.domNode.style.height.replace(/px/g, "");
            var mainHeight = parseInt(strMainHeight, 10);

            var menuHeight = parseInt(menu.domNode.style.height.replace(/px/g, ""), 10);
            var positionTop = mouseX;
            var PositionLeft = mouseY;

            if (mainHeight > 999) {
                sTop = mouseX.toString().replace(/147/g, "");
                if (sTop === "") {
                    sTop = "147";
                }
                mouseX = parseInt(sTop, 10);
            }

            if ((mouseX + menuHeight) > mainHeight) {
                positionTop = mouseX - menuHeight;
                if (positionTop < 0) {
                    positionTop = 0;
                }
            }
            menu.domNode.style.top = positionTop.toString() + "px";
            menu.domNode.style.left = PositionLeft.toString() + "px";
        } catch (e) {
            this.showToastError("ERROR IN setMenuPosition: " + e.toString());
            console.error('ERROR IN setMenuPosition: ' + e);
        }
    },
    ExpandCollapseServer: function(node) {
        try {
            this.hideOpenkviToolTip();
            if (node !== this.varSelectedServer.getValue("dataValue")) {
                this.labelServerClick(node);
            }
            if (this._expandedNodes[node].showing) {
                this.CollapseServer(node);
            } else {
                this.ExpandServer(node);
            }
        } catch (e) {
            this.showToastError("ExpandCollapseServer ERROR: " + e.toString());
            console.error('ERROR IN ExpandCollapseServer: ' + e);
        }
    },
    ExpandServer: function(node) {
        try {
            var varPanel2 = "LabelArrow" + node;
            var panelAllVmList = "panelAllVmList" + node;
            this.getVmListStatus(node);
            this[varPanel2].setCaption('<image src="resources/images/icons/arrow-down.png"/>');
            //this[varPanel2].setValue("domNode.title", "Collapse");
            this.updateToolTip(this[varPanel2].domNode, "", "Collapse");
            this[varPanel2].reflow();
            var varPictVMListWait = "PictVMListWait" + node;
            this._expandedNodes[node].showing = true;
            //this[panelOpenKVI].setShowing(true);
            //dojo.style(this[panelAllVmList].domNode, "display", "block");
            //dojo.fx.wipeIn({ node: this[panelAllVmList].domNode }).play();
/*
                dojo.fx.chain([
                    dojo.fx.wipeIn({ node: this[panelAllVmList].domNode }),
                    dojo.fx.wipeIn({ node: this[panelOpenKVI].domNode })
                ]).play();
                */
            //var varVms = node + "VmCreated";
            //var created = this[varVms].getValue("dataValue");
            this[panelAllVmList].setShowing(true);
            var nodeList = Object.keys(this._expandedNodes);
            var showSize = 0;
            for (var i = 0; i < nodeList.length; i++) {
                if (this._expandedNodes[nodeList[i]].showing) {
                    showSize += this._expandedNodes[nodeList[i]].size;
                }
            }
            var panelServerHeight = parseInt(this.panelServers.domNode.style.height.replace(/px/g, ""), 10);
            var maxHeight = panelServerHeight - this._maxVmPanelHeight;
            var minHeight = 8 * 32 + 5;  // we show at least 8 VMs            
            if (maxHeight < minHeight) {
                maxHeight = minHeight;
            }
            if (showSize >= maxHeight) {
                if (this._expandedNodes[node].size > maxHeight) {
                    this[panelAllVmList].setHeight(maxHeight.toString());
                } else {
                    this[panelAllVmList].setHeight(this._expandedNodes[node].size.toString());
                }
                for (i = 0; i < nodeList.length; i++) {
                    if ((this._expandedNodes[nodeList[i]].showing) && (nodeList[i] !== node)) {
                        this.CollapseServer(nodeList[i]);
                    }
                }
            } else if (this[varPictVMListWait].showing) {
                this[panelAllVmList].setHeight("21");
            } else {
                this[panelAllVmList].setHeight(this._expandedNodes[node].size.toString());
            }
            var varPanelMain = "panelMain" + node;
            this[varPanelMain].reflow();
        } catch (e) {
            this.showToastError("ExpandServer ERROR: " + e.toString());
            console.error('ERROR IN ExpandServer: ' + e);
        }
    },
    CollapseServer: function(node) {
        try {
            var varPanel2 = "LabelArrow" + node;
            var panelAllVmList = "panelAllVmList" + node;
            this[varPanel2].setCaption('<image src="resources/images/icons/arrow-right.png"/>');
            //this[varPanel2].setValue("domNode.title", "Expand");
            this.updateToolTip(this[varPanel2].domNode, "", "Expand");
            this[varPanel2].reflow();
            this[panelAllVmList].setShowing(false);
            //dojo.fx.wipeOut({ node: this[panelAllVmList].domNode }).play();
            //dojo.style(this[panelAllVmList].domNode, "display", "none");
            //
/*
                dojo.fx.chain([
                    dojo.fx.wipeOut({ node: this[panelOpenKVI].domNode }),
                    dojo.fx.wipeOut({ node: this[panelAllVmList].domNode })                    
                ]).play();
                */
            this._expandedNodes[node].showing = false;
            var varPanelMain = "panelMain" + node;
            this[varPanelMain].reflow();
        } catch (e) {
            this.showToastError("CollapseServer ERROR: " + e.toString());
            console.error('ERROR IN CollapseServer: ' + e);
        }
    },
    onLabelMouseOver: function(inSender, event) {
        try {
            var labelName = inSender.name.toString();
            //app.toastInfo(inSender.name);
            if (labelName.indexOf("labelVm") > -1) {
                this.labelVmStart.removeUserClass("wm_TextDecoration_Bold");
                this.labelVmStop.removeUserClass("wm_TextDecoration_Bold");
                this.labelVmReboot.removeUserClass("wm_TextDecoration_Bold");
                this.labelVmPause.removeUserClass("wm_TextDecoration_Bold");
                this.labelVmSuspend.removeUserClass("wm_TextDecoration_Bold");
                this.labelVmKill.removeUserClass("wm_TextDecoration_Bold");
                this.labelVmDelete.removeUserClass("wm_TextDecoration_Bold");
                this.labelVmRemoveFromInventory.removeUserClass("wm_TextDecoration_Bold");
                this.labelVmRename.removeUserClass("wm_TextDecoration_Bold");
            } else if (labelName.indexOf("labelServer") > -1) {
                this.labelServerConnect.removeUserClass("wm_TextDecoration_Bold");
                this.labelServerAddVm.removeUserClass("wm_TextDecoration_Bold");
                this.labelServerDelete.removeUserClass("wm_TextDecoration_Bold");
                this.labelServerScanVm.removeUserClass("wm_TextDecoration_Bold");
            } else if (labelName.indexOf("labelCenter") > -1) {
                this.labelCenterAddNewServer.removeUserClass("wm_TextDecoration_Bold");
                this.labelCenterProbe.removeUserClass("wm_TextDecoration_Bold");
                this.labelCenterReload.removeUserClass("wm_TextDecoration_Bold");

            } else if (labelName.indexOf("labelSnapshot") > -1) {
                this.labelSnapshotCreate.removeUserClass("wm_TextDecoration_Bold");
                this.labelSnapshotRevert.removeUserClass("wm_TextDecoration_Bold");
                this.labelSnapshotRollback.removeUserClass("wm_TextDecoration_Bold");
                this.labelSnapshotMergeAll.removeUserClass("wm_TextDecoration_Bold");
                this.labelSnapshotMergeToDescendant.removeUserClass("wm_TextDecoration_Bold");
                this.labelSnapshotDiscardBranch.removeUserClass("wm_TextDecoration_Bold");
            } else if (labelName.indexOf("toolbarTools") > -1) {
                this.toolbarToolsRemoveNode.removeUserClass("wm_TextDecoration_Bold");
                this.toolbarToolsAddNode.removeUserClass("wm_TextDecoration_Bold");
            } else if (labelName.indexOf("toolbarHelp") > -1) {
                this.toolbarHelpWhatsnew.removeUserClass("wm_TextDecoration_Bold");
                this.toolbarHelpUserGuide.removeUserClass("wm_TextDecoration_Bold");
            } else if (labelName.indexOf("smallHeaderMenu") > -1) {
                this.smallHeaderMenuLogout.removeUserClass("wm_TextDecoration_Bold");
                this.smallHeaderMenuViewFull.removeUserClass("wm_TextDecoration_Bold");
                this.smallHeaderMenuUserGuide.removeUserClass("wm_TextDecoration_Bold");
                this.smallHeaderMenuWhatsnew.removeUserClass("wm_TextDecoration_Bold");
                this.smallHeaderMenuAddNode.removeUserClass("wm_TextDecoration_Bold");
                this.smallHeaderMenuRemoveNode.removeUserClass("wm_TextDecoration_Bold");
                this.smallHeaderMenuProbeNodes.removeUserClass("wm_TextDecoration_Bold");

            }

            if (inSender.disabled !== true) {
                inSender.addUserClass("wm_TextDecoration_Bold");
            }

        } catch (e) {
            this.showToastError("onLabelMouseOver ERROR: " + e.toString());
            console.error('ERROR IN onLabelMouseOver: ' + e);
        }
    },
    onLabelMouseOut: function(inSender, event) {
        try {
            inSender.removeUserClass("wm_TextDecoration_Bold");

        } catch (e) {
            this.showToastError("onLabelMouseOut ERROR: " + e.toString());
            console.error('ERROR IN onLabelMouseOut: ' + e);
        }
    },
    // On Click functions:
    labelDatacenterClick: function(inSender, inEvent) {
        try {
            this.SmallHeaderMenu.hide();
            this.disableLoadingDialogs();
            //Check if VM config is left in a dirty state 
            if (this.tabVirtualMachines.getActiveLayer().name === "Configuration") {
                if (this.vmConfigSave.disabled === false) {
                    this._vmTabChangeParams = [inSender, inEvent];
                    this.unsavedVirtualMachinesChanges("labelDatacenterClick");
                    return 0;
                }
            }
            // reinitialize tabs
            this.TabCenterOverview.activate();
            this.TabServersOverview.activate();
            this.TabVMsOverview.activate();

            this.varSelectedServer.setValue("dataValue", "none");
            this.varSelectedVm.setValue("dataValue", "none");
            //High light  selection 
            var varOldPanel = this.varSelectedItem.getValue("dataValue");
            if (varOldPanel !== "panelDatacenter") {
                this[varOldPanel].removeUserClass("wm_BorderShadow_WeakShadow");
                this[varOldPanel].removeUserClass("wm_BackgroundChromeBar_LightGray");
                this[varOldPanel].setBorder(0);
            }
            this.panelDatacenter.addUserClass("wm_BackgroundColor_SteelBlue");
            this.panelDatacenter.setBorder(1);
            
            this.varSelectedItem.setValue("dataValue", "panelDatacenter");            
            
            this.layerServer.setShowing(false);
            this.layerVirtualMachines.setShowing(false);
            this.layerDataCenter.setShowing(true);
            this.layerDataCenter.activate();
            var user = this.templateUsernameVar.getValue("dataValue");
            var dc = "<i>"+user+"</i>"+" @ <b>"+this.varCenterHostname.getValue("dataValue")+"</b>";
            this.labelUserInfoPath.setCaption(dc + " <small>></small> ");
            //this.updateServerDatabaseHooks(false);
        } catch (e) {
            //this.showToastError("labelDatacenterClick ERROR: " + e.toString());
            console.error('ERROR IN labelDatacenterClick: ' + e);
        }
    },
    btnProbeNodesClick: function(inSender) {
        try {
            this.javaProbeNeighborhood.update();
            this.varAvailableNodes.clearData();
            this.layersAvailableNodes.setLayer(this.layerWaitNodeList);
            this.listAvailableNodes.show();
            this.addSelectedNode.setDisabled(true);
        } catch (e) {
            console.error('ERROR IN btnProbeNodesClick: ' + e);
        }
    },
    javaGetAllNodesInfoResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaGetAllNodesInfo.getValue("dataValue");
            this.logDebugDataCenter(result);
            var data = JSON.parse(result).action.result;
            var nodeList = Object.keys(data);
            var show_overview = true;
            for (var i = 0; i < nodeList.length; i++) {
                var add = true;
                if (nodeList[i] !== "error") {
                    if (this._nodesData[nodeList[i]] === undefined) {
                        if (data[nodeList[i]].ressources !== undefined) {
                            this._nodesData[nodeList[i]] = {};
                            show_overview = false;
                        } else {
                            add = false;
                        }
                    }
                    if (add) {
                        this._nodesData[nodeList[i]].hardware = data[nodeList[i]].hardware;
                        this._nodesData[nodeList[i]].ressources = data[nodeList[i]].ressources;
                        this._nodesData[nodeList[i]].system = data[nodeList[i]].system;
                        this._nodesData[nodeList[i]].general = data[nodeList[i]].general;
                    }
                }
            }
            if (show_overview) {
                this.createDataCenterOverview();
            }
            timeout = 300000; // 5 minutes
            setTimeout(function() {
                try {
                    wm.Page.getPage("Main").getAllNodesInfo();
                } catch (e) {
                    alert(e);
                }
            }, timeout);
        } catch (e) {
            console.error('ERROR IN javaGetAllNodesInfoResult: ' + e);
        }
    },
    getAllNodesInfo: function() {
        try {
            if (this.TabCenterOverview.isActive()) {
                this.javaGetAllNodesInfo.update();
            }
        } catch (e) {
            console.error('ERROR IN TabCenterOverviewShow: ' + e);
        }
    },
    TabCenterOverviewShow: function(inSender) {
        try {
            if (this._nodesData !== undefined) {
                this.getAllNodesInfo();
            }

        } catch (e) {
            console.error('ERROR IN TabCenterOverviewShow: ' + e);
        }
    },
    removeDashboardNode: function(node) {
        try {
            this._nodesData[node].general = {
                "type": "",
                "ip": "",
                "active": false,
                "state": "removed",
                "vms": {}
            };
            if (this.TabCenterOverview.isActive()) {
                this.createDataCenterOverview();
            }
        } catch (e) {
            console.error('ERROR IN removeDashboardNode: ' + e);
        }
    },
    createDataCenterOverview: function() {
        try {
            //console.error(JSON.stringify(this._nodesData));
            var html = '<body>\n';
            var nodeType = "";
            var nodeList = Object.keys(this._nodesData);
            nodeList.sort();
            inactive_nodes = [];
            removed_nodes = [];
            for (var i = 0; i < nodeList.length; i++) {
                if (this._nodesData[nodeList[i]] !== undefined) {
                    var node = this._nodesData[nodeList[i]];
                    node.name = nodeList[i];
                    if (node.general.active) {
                        html += this.makeNodeCard(node);
                    } else if (node.general.state === "removed") {
                        removed_nodes[inactive_nodes.length] = node;
                    } else {
                        inactive_nodes[inactive_nodes.length] = node;
                    }
                }
            }
            for (i = 0; i < inactive_nodes.length; i++) {
                var inac_node = inactive_nodes[i];
                html += this.makeNodeCard(inac_node);
            }
            for (i = 0; i < removed_nodes.length; i++) {
                var rm_node = removed_nodes[i];
                html += this.makeNodeCard(rm_node);
            }

            var htmlHead = '<html><head>';
            htmlHead += '<style type="text/css">\n';
            htmlHead += 'div.nodePlus {';
            htmlHead += '    border-bottom: 1px solid #b3b8c4;';
            htmlHead += '    padding-top: 2px;';
            htmlHead += '    padding-bottom: 4px;';
            htmlHead += '    padding-left: 10px;';
            htmlHead += '    padding-right: 10px;';
            htmlHead += '  }\n';
            htmlHead += 'div.nodeGroup {';
            htmlHead += '    margin-left: 5px;';
            htmlHead += '    margin-right: 5px;';
            htmlHead += '    margin-bottom: 10px;';
            htmlHead += '    padding-bottom: 5px;';
            //htmlHead += '    padding: 5px;';
            htmlHead += '  }\n';
            htmlHead += 'div.nodeGroup label {';
            htmlHead += '    color: DarkSlateGray;';
            htmlHead += '    overflow: hidden; ';
            htmlHead += '    white-space: nowrap;';
            htmlHead += '    height: 20px;';
            htmlHead += '    line-height: 20px;';
            htmlHead += '  }\n';
            htmlHead += 'div.nodeGroupTitle {';
            htmlHead += '    border-bottom: 1px solid #b3b8c4;';
            htmlHead += '    padding: 5px;';
            htmlHead += '  }\n';
            htmlHead += 'div.nodeGroupBody {';
            htmlHead += '    margin: 5px;';
            htmlHead += '  }\n';
            htmlHead += '</style>';
            htmlHead += '</head>';
            var htmlTail = '</body>\n</html>';

            this.htmlCenterOverview.setHtml(htmlHead + html + htmlTail);

            for (var j = 0; j < nodeList.length; j++) {
                var node = nodeList[j];
                var nodeHid = dojo.byId('nodeDashboardTitle_' + node);
                this.connect(nodeHid, "onclick", this, dojo.hitch(this, "goToNode", node));
                var nodeMenuHid = dojo.byId('nodeDashboardMenu_' + node);
                this.connect(nodeMenuHid, "onmouseover", this, dojo.hitch(this, "nodeSetPopupDom", node, nodeMenuHid));
                this.connect(nodeMenuHid, "onclick", this, function(event) {
                    var nodeName = this.varSelectedServer.getValue("dataValue");
                    var domNode = this._selected_DomNode;
                    this.varMousePosition.setValue("top", event.clientY);
                    this.varMousePosition.setValue("left", event.clientX);
                    dojo.stopEvent(event);
                    this.nodeDashboardShowPopup(nodeName, domNode, false);
                });                
                
                this.addToolTip('nodeDashboardMenu_' + node, "", "Open Menu", "help", 900);
                
                var node_info = this._nodesData[nodeList[j]];                
                if (node_info.general.active) {
                    if (node_info.ressources !== undefined) {
                        var nodeShowRessHid = dojo.byId('hideShowNodeRessources_' + node);
                        this.connect(nodeShowRessHid, "onclick", this, dojo.hitch(this, "hideShowNodeRessources", node));
                        this.addToolTip('hideShowNodeRessources_' + node, "", "Hide/Show ressources", "help", 700);
                        var NodeDashboard_cookie = dojo.cookie("NodeDashboard_cookie");
                        var NodeDashboard = JSON.parse(NodeDashboard_cookie);
                        if (NodeDashboard[node].warnings > 0) {
                            var tipMsg = NodeDashboard[node].warningText;
                            this.addToolTip('showWarningNodeRessources_' + node, "Ressource Warnings:", tipMsg, "error", 0);
                        }
                    }
                    var totVm = parseInt(node_info.general.vms.total, 10);
                    var runVm = parseInt(node_info.general.vms.running, 10);
                    var stopVm = totVm - runVm;
                    var pieChartVmInfo = {
                        "header": {
                            "title": {},
                            "subtitle": {},
                            "titleSubtitlePadding": 0
                        },
                        "footer": {},
                        "size": {
                            "canvasHeight": 100,
                            "canvasWidth": 220,
                            "pieInnerRadius": "0%",
                            "pieOuterRadius": "55%"
                        },
                        "data": {
                            "content": [{
                                "label": "Running",
                                "value": runVm,
                                "color": "#1dbd45"
                            },
                            {
                                "label": "Stopped",
                                "value": stopVm,
                                "color": "Teal"
                            }]
                        },
                        "labels": {
                            "outer": {
                                "format": "none",
                                "pieDistance": 0
                            },
                            "inner": {
                                "format": "value"
                            },
                            "mainLabel": {
                                "font": "arial",
                                "fontSize": 12
                            },
                            "percentage": {
                                "color": "#e1e1e1",
                                "font": "arial",
                                "decimalPlaces": 0,
                                "fontSize": 12
                            },
                            "value": {
                                "color": "#e1e1e1",
                                "font": "arial",
                                "fontSize": 12
                            },
                            "lines": {
                                "enabled": false
                            },
                            "truncation": {
                                "enabled": true
                            }
                        },
                        "tooltips": {
                            "enabled": true,
                            "type": "placeholder",
                            "string": "{label}: {value}",
                            "styles": {
                                "backgroundOpacity": 0.75,
                                "borderRadius": 4,
                                "fontSize": 12,
                                "padding": 6
                            }
                        },
                        "effects": {
                            "pullOutSegmentOnClick": {
                                "effect": "none"
                            },
                            "load": {
                                "effect": "none"
                            }
                        },
                        "misc": {
                            "pieCenterOffset": {
                                "x": -50
                            },
                            "gradient": {
                                "enabled": true,
                                "percentage": 35,
                                "color": "#e5eded"
                            }
                        }
                    };
                    var nodePieVms = dojo.byId("pieChartVms_" + node);
                    if (nodePieVms) {
                        var pieVms = new d3pie(nodePieVms, pieChartVmInfo);
                    }
                    if (node_info.system) {
                        var totCores = node_info.system.cores * node_info.system.nodes * node_info.system.sockets * node_info.system.threads;
                        var vcpus = node_info.general.vms.vcpus;
                        var freeCores = totCores - vcpus;
                        var label1 = "Allocated Vcpus";
                        var label2 = "Available Threads";
                        var color1 = "Orange";
                        var color2 = "MediumSpringGreen";
                        var color3 = "MidnightBlue";
                        if (vcpus > totCores) {
                            color1 = "FireBrick";
                            color2 = "OrangeRed";
                            color3 = "Cornsilk";
                            label1 = "Over-allocated";
                            label2 = "Allocated Vcpus";
                            freeCores = vcpus - totCores;
                            vcpus = freeCores;
                            freeCores = totCores;
                        } else if (vcpus > (0.75 * totCores)) {
                            color1 = "Crimson";
                        } else if (vcpus > (0.5 * totCores)) {
                            color1 = "OrangeRed";
                        } else if (vcpus > (0.25 * totCores)) {
                            color1 = "GoldenRod";
                        }

                        var pieChartCoreInfo = {
                            "header": {
                                "title": {},
                                "subtitle": {},
                                "titleSubtitlePadding": 0
                            },
                            "footer": {},
                            "size": {
                                "canvasHeight": 100,
                                "canvasWidth": 220,
                                "pieInnerRadius": "57%",
                                "pieOuterRadius": "100%"
                            },
                            "data": {
                                "content": [{
                                    "label": label1,
                                    "value": vcpus,
                                    "color": color1
                                },
                                {
                                    "label": label2,
                                    "value": freeCores,
                                    "color": color2
                                }]
                            },
                            "labels": {
                                "outer": {
                                    "format": "none",
                                    "pieDistance": 0
                                },
                                "inner": {
                                    "format": "percentage"
                                },
                                "mainLabel": {
                                    "font": "verdana",
                                    "fontSize": 12
                                },
                                "percentage": {
                                    "color": color3,
                                    "font": "arial",
                                    "decimalPlaces": 0,
                                    "fontSize": 10
                                },
                                "value": {
                                    "color": color3,
                                    "font": "arial",
                                    "fontSize": 12
                                },
                                "lines": {
                                    "enabled": false
                                },
                                "truncation": {
                                    "enabled": true
                                }
                            },
                            "tooltips": {
                                "enabled": true,
                                "type": "placeholder",
                                "string": "{label}: {value}",
                                "styles": {
                                    "backgroundOpacity": 0.8,
                                    "borderRadius": 4,
                                    "fontSize": 12,
                                    "padding": 4
                                }
                            },
                            "effects": {
                                "pullOutSegmentOnClick": {
                                    "effect": "none"
                                },
                                "load": {
                                    "effect": "none"
                                }
                            },
                            "misc": {
                                "pieCenterOffset": {
                                    "x": -50
                                },
                                "gradient": {
                                    "enabled": true,
                                    "percentage": 60,
                                    "color": "#e5eded"
                                }
                            }
                        };
                        var nodePieCores = dojo.byId("pieChartCores_" + node);
                        if (nodePieCores) {
                            var pieCores = new d3pie(nodePieCores, pieChartCoreInfo);
                        }
                        var nodePieShadow = dojo.byId("pieChartShadow_" + node);
                        var pieShadowInfo = {
                            "header": {
                                "title": {},
                                "subtitle": {
                                    "color": "#999999"
                                }
                            },
                            "footer": {},
                            "size": {
                                "canvasHeight": 107,
                                "canvasWidth": 220,
                                "pieOuterRadius": "100%"
                            },
                            "data": {
                                "sortOrder": "value-desc",
                                "content": [{
                                    "label": "shadow",
                                    "value": 1,
                                    "color": "#00070b"
                                }]
                            },
                            "labels": {
                                "outer": {
                                    "format": "none"
                                },
                                "inner": {
                                    "format": "none"
                                },
                                "mainLabel": {
                                    "fontSize": 11
                                },
                                "percentage": {
                                    "color": "#ffffff",
                                    "decimalPlaces": 0
                                },
                                "value": {
                                    "color": "#adadad",
                                    "fontSize": 11
                                },
                                "lines": {
                                    "enabled": false
                                },
                                "truncation": {
                                    "enabled": true
                                }
                            },
                            "effects": {
                                "load": {
                                    "effect": "none"
                                },
                                "pullOutSegmentOnClick": {
                                    "effect": "none"
                                },
                                "highlightSegmentOnMouseover": false
                            },
                            "misc": {
                                "pieCenterOffset": {
                                    "x": -48,
                                    "y": -1
                                },
                                "gradient": {
                                    "enabled": true,
                                    "percentage": 25,
                                    "color": "White"
                                }
                            }
                        };
                        var pieShadow = new d3pie(nodePieShadow, pieShadowInfo);

                    }
                }
            }

        } catch (e) {
            console.error('ERROR IN createDataCenterOverview: ' + e);
        }
    },
    nodeSetPopupDom: function(node, domNode) {
        try {
            this.varSelectedServer.setValue("dataValue", node);
            this._selected_DomNode = domNode;
        } catch (e) {
            console.error('ERROR IN nodeShowPopup: ' + e);
        }
    },
    nodeDashboardShowPopup: function(node, domNode, activate) {
        try {
            if ((node === this._nodePopup.name) && (this._nodePopup.showing) && (this._nodePopup.caller === "dashboard")) {
                this._nodePopup = {
                    "name": node,
                    "showing": false,
                    "caller": "dashboard"
                };
                this.serverPopup.hide();
            } else {
                this._nodePopup = {
                    "name": node,
                    "showing": true,
                    "caller": "dashboard"
                };
                this.showPopupMenu(node, domNode, activate);
            }
        } catch (e) {
            console.error('ERROR IN nodeDashboardShowPopup: ' + e);
        }
    },
    goToNode: function(node) {
        this.labelServerClick(node, true);
    },
    hideShowNodeRessources: function(node) {
        try {
            //this.hideOpenkviToolTip();
            var wipeout = true;
            var NodeDashboard_cookie = dojo.cookie("NodeDashboard_cookie");
            var NodeDashboard = {};
            if (NodeDashboard_cookie !== undefined) {
                NodeDashboard = JSON.parse(NodeDashboard_cookie);
                if (NodeDashboard[node] !== undefined) {
                    wipeout = !NodeDashboard[node].wipeOut;
                    NodeDashboard[node].wipeOut = wipeout;
                } else {
                    NodeDashboard[node] = {};
                    NodeDashboard[node].wipeOut = true;
                    wipeout = true;
                }
            } else {
                NodeDashboard[node] = {};
                NodeDashboard[node].wipeOut = true;
                wipeout = true;
            }
            dojo.cookie("NodeDashboard_cookie", JSON.stringify(NodeDashboard), {
                expires: 3600
            });
            var div = dojo.byId('nodeDashRessources_' + node);
            this.wipeInOutDiv(div, wipeout);
            
            var warnDiv = dojo.byId('showWarningNodeRessources_' + node);
            if (wipeout) {
                dojo.style(warnDiv, "visibility", "visible");
            } else {
                dojo.style(warnDiv, "visibility", "hidden");
            }

        } catch (e) {
            console.error('ERROR IN hideShowNodeRessources: ' + e);
        }
    },
    wipeInOutDiv: function(div, wipeout) {
        try {
            //var divHeight = dojo.style(nodeHid, "height");
/*dojo.fx.chain([
                dojo.fadeOut({ node: nodeHid }),
                dojo.fx.wipeOut({ node: nodeHid })
            ]).play();
            */
            if (wipeout) {
                dojo.fx.wipeOut({
                    node: div
                }).play();                
            } else {
                dojo.fx.wipeIn({
                    node: div
                }).play();                
            }
        } catch (e) {
            console.error('ERROR IN wipeInOutDiv: ' + e);
        }
    },
    showNodeRessourceToolTip: function(node) {
        var NodeDashboard_cookie = dojo.cookie("NodeDashboard_cookie");
		var NodeDashboard = JSON.parse(NodeDashboard_cookie);
        this.showOpenkviToolTip("Ressource Warnings:", NodeDashboard[node].warningText, "error");
    },
    moveNodeRessourceToolTip: function() {
        this.moveOpenkviToolTip();
    },
    hideNodeRessourceToolTip: function() {
        this.hideOpenkviToolTip();
    },
    makeNodeCard: function(node) {
        var html = "";
        try {
            var mode = "KVM";
            var optColor = "Teal";
            nodeTitle = "";
            nodeTitle = "Go to node " + node.name;
            fontColor = '"#0D0D3B"';
            if (node.general.type === "qemu") {
                mode = "Qemu";
                nodeBackground = 'LightGreen';
            } else if (node.general.type === "kvm") {
                mode = "KVM";
                nodeBackground = 'LightGoldenRodYellow';
            }
            if (node.general.active === false) {
                nodeBackground = 'Gray';
                fontColor = '"LightYellow "';
                optColor = "LightYellow ";
                nodeTitle = "Inactive node";
            }
            typeDesc = '<div style="text-align:left; color:' + optColor + ';">' + mode + '</div>';
            typeDesc += '<div style="text-align:left; color:' + optColor + ';">' + node.general.ip + '</div>';
            if (node.general.active) {
                if (node.system) {
                    typeDesc += '<div style="text-align:left; color:' + optColor + ';"><i>' + node.system.os + '</i></div>';
                }
                //typeDesc += '<div style="text-align:left; color:'+optColor+';">TOTO</div>';
                html += '<div id="node_id_' + node.name + '" class="nodeDashboardPanel openkvi_CadetBlue_gradient openkvi_PanelShadow">';
            } else if (node.general.state === "unreachable") {
                html += '<div id="node_id_' + node.name + '" class="nodeDashboardPanel openkvi_LightSlateGray_gradient openkvi_PanelShadow">';
                nodeTitle = "Node is unreachable!";
            } else if (node.general.state === "removed") {
                html += '<div id="node_id_' + node.name + '" style="display: none;">';
                nodeTitle = "Node removed !";
            } else {
                // default is like unreachable
                html += '<div id="node_id_' + node.name + '" class="nodeDashboardPanel openkvi_LightSlateGray_gradient openkvi_PanelShadow">';
                nodeTitle = node.general.state;
            }
            html += '<div title="' + nodeTitle + '" id="nodeDashboardTitle_' + node.name + '" class="nodeDashboardTitle">';
            html += '<div><label><b>' + node.name + '</b></label>';

            if (node.general.active) {
                html += '<image id="nodeDashboardMenu_' + node.name + '" title=""';
                html += 'src="resources/images/icons/task-accepted-menu.png" align="right"/>';
            } else {
                html += '<image id="nodeDashboardMenu_' + node.name + '" src="resources/images/icons/warn-32-menu.png"';
                html += 'title="Show menu" align="right"/>';
            }
            html += '</div></div>';
            html += '<div class="nodePlus" align="left" style="background-color:' + nodeBackground + ';">' + typeDesc + '</div>';

            if (node.general.active) {
                if (node.ressources !== undefined) {
                    // Virtual Machines
                    html += '<div class="nodeGroup" style="position:relative; border-bottom: 1px solid #cdd5ef; width:220px; height:80px;">';
                    html += '<div style="position:absolute; z-index:0; top:0px; left:0px; padding-top:10px; padding-left:5px;">';
                    html += '<label style="display:block;text-align:left;">';
                    html += '<font color="#0D0D3B">Virtual Machines:</font></label>';
                    html += '<label style="display:block;text-align:left;" class="wm_FontColor_Graphite">';
                    if (node.general.vms.list.length === node.general.vms.total) {
                        html += '<b>' + node.general.vms.total + '</b> Defined.';
                    } else {
                        html += '<b>' + node.general.vms.list.length.toString() + '</b> Known out of <b>' + node.general.vms.total.toString() + '</b>';
                    }
                    html += '</label>';
                    html += '<label style="display:block;text-align:left;" class="wm_FontColor_Graphite">';
                    html += '<b>' + node.general.vms.running + '</b> Running.</label>';
                    html += '</div>';
                    // z-index:2; 
                    html += '<div align="left" style="position:absolute; z-index:0; top:0px; left:110px" id="pieChartShadow_' + node.name + '"></div>';
                    html += '<div align="left" style="position:absolute; z-index:1; top:0px; left:110px" id="pieChartVms_' + node.name + '"></div>';
                    html += '<div align="left" style="position:absolute; z-index:2; top:0px; left:110px" id="pieChartCores_' + node.name + '"></div>';
                    html += '</div>';

                    var totCores = node.system.cores * node.system.nodes * node.system.sockets;
                    var load_per_nodes = Math.round(node.ressources.load / totCores * 10000) / 100;
                    var rounded_freq = Math.round(node.system.mhz / 10) / 100;
                    var percentUsedMem = Math.round(node.ressources.memory.used / node.ressources.memory.total * 100);
                    var usedMem = Math.round(node.ressources.memory.used / 1024 * 10) / 10;
                    var freeMem = Math.round(node.ressources.memory.free / 1024 * 10) / 10;

                    // Uptime and load and VMs
                    // Uptime
                    html += '<div class="nodeGroup" style="border-bottom: 1px solid #cdd5ef;" align="left">';
                    html += '<label style="display:inline; text-align:left;">Uptime:</label>';
                    html += '<div class="wmlabel wm_FontColor_Graphite" ';
                    html += 'style="padding-left: 20px; padding-right: 10px; text-align:left;"><b>' + node.ressources.uptime + '</b></div>';
                    // Load
                    html += '<label style="display:inline; text-align:left;">Load average:</label>';
                    html += '<div class="wmlabel wm_FontColor_Graphite" ';
                    html += 'style="padding-left: 20px; text-align:left;"><b>' + load_per_nodes.toString() + ' %</b> per cores</div>';
                    html += '</div>';

                    // RESSOURCES
                    var wipeout = false;
                    var NodeDashboard_cookie = dojo.cookie("NodeDashboard_cookie");
                    var NodeDashboard = {};
                    if (NodeDashboard_cookie !== undefined) {
                        NodeDashboard = JSON.parse(NodeDashboard_cookie);
                        if (NodeDashboard[node.name] !== undefined) {
                            wipeout = NodeDashboard[node.name].wipeOut;
                        } else {
                            NodeDashboard[node.name] = {};
                            NodeDashboard[node.name].wipeOut = false;
                            wipeout = false;
                        }
                    } else {
                        NodeDashboard[node.name] = {};
                        NodeDashboard[node.name].wipeOut = false;

                        wipeout = false;
                    }
                    NodeDashboard[node.name].warnings = 0;
                    NodeDashboard[node.name].warningText = "";
                    if (wipeout) {
                        html += '<div id="nodeDashRessources_' + node.name + '" style="display: none;" >';
                    } else {
                        html += '<div id="nodeDashRessources_' + node.name + '">';
                    }
                    // CPU usage
                    var cpu = node.ressources.cpu;
                    html += '<div class="nodeGroup" style="border-bottom: 1px solid #cdd5ef;" align="left">';

                    html += '<label style="display:inline-block; float: left; width: 100px; text-align:left;">CPU usage:</label>';
                    html += '<label class="wm_FontColor_Graphite"';
                    html += 'style="display:block; width: 80px; text-align:right;">';
                    html += '<b>' + cpu.toString() + '%</b>';
                    html += '</label>';

                    html += '<div style="padding-left: 20px">';
                    //html += '<progress max="100" value="' + node.ressources.cpu + '"></progress></div>';
                    var border_color = "LightGreen";
                    if (cpu < 10) {
                        border_color = "LightGreen";
                    } else if (cpu < 30) {
                        border_color = "LimeGreen";
                    } else if (cpu < 70) {
                        border_color = "OrangeRed";
                    } else {
                        border_color = "Red";
                        NodeDashboard[node.name].warningText += "High CPU usage !</br>";
                        NodeDashboard[node.name].warnings += 1;
                    }
                    html += '<meter style="width:160px; height:12px; border:solid 1px ' + border_color + '"';
                    html += 'min="0" max="100" low="1" high="50" optimum="10" value="' + cpu + '" title=" ' + cpu.toString() + '% ">2/20</meter></div>';
                    html += '<div style="padding-left: 20px; color: Teal"><i>' + totCores.toString() + ' cores at ' + rounded_freq + ' GHz</i></div>';

                    //Memory load
                    html += '<label style="display:inline-block; float: left; width: 100px; text-align:left;">Memory usage:</label>';
                    html += '<label class="wm_FontColor_Graphite"';
                    html += 'style="display:block; width: 80px; text-align:right;">';
                    html += '<b>' + usedMem.toString() + ' GB</b>';
                    html += '</label>';

                    html += '<div style="padding-left: 20px">';
                    //html += '<progress max="100" value="' + percentUsedMem + '"></progress></div>';
                    if (percentUsedMem < 30) {
                        border_color = "LightGreen";
                    } else if (percentUsedMem < 50) {
                        border_color = "LimeGreen";
                    } else if (percentUsedMem < 80) {
                        border_color = "OrangeRed";
                    } else {
                        border_color = "Red";
                        NodeDashboard[node.name].warningText += "High Memory usage !</br>";
                        NodeDashboard[node.name].warnings += 1;

                    }
                    html += '<meter style="width:160px; height:12px; border:solid 1px ' + border_color + '"';
                    html += 'min="0" max="100" low="1" high="50" optimum="20" value="' + percentUsedMem + '" title=" ' + percentUsedMem.toString() + '% ">2/20</meter></div>';
                    html += '<div style="padding-left: 20px; color: Teal"><i>Free: ' + freeMem.toString() + ' GB</i></div>';
                    html += '</div>';

                    // Storage usage
                    html += '<div class="nodeGroup">';
                    html += '<div style="text-align:left; padding-bottom: 5px;"><font color="#0D0D3B">Storages:</font></div>';
                    for (var i = 0; i < node.ressources.storages.length; i++) {
                        var storage = node.ressources.storages[i];
                        html += '<label style="display:inline-block; float: left; width: 100px; text-align:left;">' + storage.name + '</label>';
                        html += '<label class="wm_FontColor_Graphite"';
                        html += 'style="display:block; width: 80px; text-align:right;">';
                        html += '<b>' + storage.capacity + ' GB</b>';
                        html += '</label>';
                        html += '<div align="left" style="padding-left: 20px;">';
                        var percentUsed = Math.round(parseInt(storage.allocation, 10) / parseInt(storage.capacity, 10) * 100);
                        if (percentUsed < 30) {
                            border_color = "LightGreen";
                        } else if (percentUsed < 50) {
                            border_color = "LimeGreen";
                        } else if (percentUsed < 80) {
                            border_color = "OrangeRed";
                            NodeDashboard[node.name].warningText += "<b>"+storage.name+"</b>: Low free space</br>";
                            NodeDashboard[node.name].warnings += 1;
                        } else {
                            border_color = "Red";
                            NodeDashboard[node.name].warningText += "<b>"+storage.name+"</b>: <u>Critically</u> low free space</br>";
                            NodeDashboard[node.name].warnings += 1;
                        }
                        html += '<meter style="width:160px; height:12px; border:solid 1px ' + border_color + '"';
                        html += 'min="0" max="100" low="1" high="50" optimum="20" value="' + percentUsed + '" title=" ' + storage.allocation + ' GB used "></meter></div>';
                        html += '<div align="left" style="padding-left: 20px; color: Teal"><i>Free: ' + storage.available + ' GB</i></div>';
                    }
                    html += '</div>';
                    // END RESSSOURCES
                    html += '</div>';
                    // Hiding button
                    var visible = "hidden";
                    if (wipeout) {
                        visible = "visible";
                    }
                    var warnImg = "none";
                    var marginDots = "0px";
                    var warnTitle = "";
                    if (NodeDashboard[node.name].warnings > 0) {
                        warnImg = "inline";
                        marginDots = "25px";
                    }                        
                    html += '<div style="width:100%; height:16px;" align="bottom">';
                    html += '<div style="float:right; margin-right:5px; visibility:'+visible+';" text-align="bottom" id="showWarningNodeRessources_' + node.name + '">';
                    html += '<div style="width: 25px; display:'+warnImg+';">';
                    html += '<div style="display:inline;"><small><b>'+NodeDashboard[node.name].warnings.toString()+'</b></small></div>';
                    html += '<image style="vertical-align:-6px;" src="resources/images/icons/dialog-warning-16.png"/>';
                    html += '</div></div>';
                    html += '<div style="height:16px; display:inline-block; margin:0 auto; margin-left:'+marginDots+';" class="nodeDashboardHider" align="center">';
                    html += '<image id="hideShowNodeRessources_' + node.name + '" src="resources/images/icons/three-dot-horizon.png" align="center"/>';
                    html += '</div>';

                    html += '</div>';
                    dojo.cookie("NodeDashboard_cookie", JSON.stringify(NodeDashboard), {
                        expires: 3600
                    });
                }
            }
            html += '</div>\n';
        } catch (e) {
            console.error('ERROR IN makeNodeCard: ' + e);
        }
        return html;
    },


    TabCenterServersShow: function(inSender) {
        try {
            this.updateServerDatabaseHooks(false);

        } catch (e) {
            console.error('ERROR IN TabCenterServersShow: ' + e);
        }
    },
    TabCenterConfigShow: function(inSender) {
        try {
            wm.Page.getPage("OpenkviConfigPage").initOpenkviConfigTab();

        } catch (e) {
            this.showToastError("TabCenterConfigShow ERROR: " + e.toString());
            console.error('ERROR IN TabCenterConfigShow: ' + e);
        }
    },
    createServerConfig: function(name, ip, virt, desc, passwd) {
        try {
            if (passwd === undefined) {
                passwd = "";
            }
            var defaultImageStorage = this.varDefaultDiskPath.getValue("dataValue");
            var defaultConfigPath = this.varDefaultVmConfigPath.getValue("dataValue");

            var storageList = [{
                "name": "default_storage",
                "type": "local",
                "target": defaultImageStorage,
                "source": "none"
            }];
            var coordinates = {
                "building": "",
                "street": "",
                "city": "",
                "latitude": "",
                "longitude": ""
            };

            var hash = {
                "name": name,
                "password": passwd,
                "ip": ip,
                "hypervisor": virt,
                "description": desc,
                "vmconfigs": defaultConfigPath,
                "storages": storageList,
                "coordinates": coordinates,
                "transport": "ssh"
            };
            this.javaMakeServerConfig.input.setValue("node", name);
            this.javaMakeServerConfig.input.setValue("jsonString", hash);
            this.javaMakeServerConfig.update();
        } catch (e) {
            this.showToastError("createServerConfig ERROR: " + e.toString());
            console.error('ERROR IN writeServerXml: ' + e);
        }
    },
    javaMakeServerConfigResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaMakeServerConfig.getValue("dataValue");
            this.logDebugDataCenter("javaMakeServerConfig: " + result);
            var args = result.split("::");
            var node = args[0];
            var res = args[1];
            this.connectingServerDiag.hide();
            if ((res.indexOf("Error") > -1) || (res.indexOf("Failed") > -1)) {
                var status = "Error";
                if (res.indexOf('{') > -1) {
                    var jState = JSON.parse(res);
                    status = jState.state;
                } else {
                    status = res;
                }
                stat = status.replace(/Error/g, "Failed");
                this.updateLog("Add new node", node, node, stat);
                info = stat.replace(/Failed: /g, "");
                this.labelServerWarnig.setCaption(info);
                this.panelServerError.setShowing(true);
                this.clearServerInfo.setValue("dataValue", false);
                if (info.indexOf("do not support KVM paravitualization") > -1) {
                    this.selectHypervisor.addUserClass("wm_TextDecoration_Bold");
                    this.selectHypervisor.addUserClass("wm_FontColor_BrightRed");
                }
            } else {
                this.tableserversDialog.hide();

            }

        } catch (e) {
            this.updateLog("Add new node", "unknown", "unknown", "Failed: unknwon error");
            this.showToastError("javaMakeServerConfigResult ERROR: " + e.toString());
            console.error('ERROR IN javaMakeServerConfigResult: ' + e);
        }
    },
    javaUpdateServerConfigResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaUpdateServerConfig.getValue("dataValue");
            var args = result.split("=");
            var node = args[0];
            var log = args[1];
            if (result.indexOf("Error") === -1) {
                this.updateLog(log, node, node, "Successful");
            } else {
                this.updateLog(log, node, node, "Failed: " + args[2]);
            }
            if (log === "Update coordinates") {
                this.getNodeConfig(node);
            }

        } catch (e) {
            this.showToastError("javaUpdateServerConfigResult ERROR: " + e.toString());
            console.error('ERROR IN javaUpdateServerConfigResult: ' + e);
        }
    },
    addServerProcess: function() {
        try {
            this.panelServerError.setShowing(false);
            this.panelWarningQemu.setShowing(false);
            this.selectHypervisor.removeUserClass("wm_TextDecoration_Bold");
            this.selectHypervisor.removeUserClass("wm_FontColor_BrightRed");

            var node = this.varServerInfo.getValue("name");
            var sIP = this.varServerInfo.getValue("ip");
            var sVirt = this.varServerInfo.getValue("virt");
            var passwd = this.varServerInfo.getValue("passwd");
            var desc = this.varServerInfo.getValue("desc");
            //if (this.tableserversLiveForm1.saveDataIfValid()) {
            this.createServerConfig(node, sIP, sVirt, desc, passwd);
            //this.tabServers.setLayer(this.TabServersOverview);
            //this.labelServerClick(node);
        } catch (e) {
            this.showToastError("addServerProcess ERROR: " + e.toString());
            console.error('ERROR IN addServerProcess: ' + e);
        }
    },
    tableserversSaveButtonClick: function(inSender) {
        try {
            if (this.tableserversSaveButton.disabled === false) {
                var node = this.nameEditor.getDataValue();
                var sIP = this.ipEditor.getDataValue();
                var sVirt = this.selectHypervisor.getDataValue();

                this.addLog("Add new node", node, node, 0);

                this.clearServerInfo.setValue("dataValue", true);
                this.varServerInfo.setValue("name", node);
                this.varServerInfo.setValue("ip", sIP);
                this.varServerInfo.setValue("virt", sVirt);
                this.varServerInfo.setValue("desc", this.descEditor.getDataValue());
                this.varServerInfo.setValue("passwd", this.editPassword.getDataValue());


                if (inSender.caption === "Save") {
                    var oldName = this.varSelectedServer.getValue("dataValue");
                    if (oldName !== node) {
                        var varLabel = "LabelServer" + node;
                        //if ( this[varLabel].caption !== 
                    }
                    this.tableserversLiveForm1.updateData();
                } else {
                    this.connectingServerDiag.show();
                    this.addServerProcess();
                }
            }
        } catch (e) {
            this.showToastError("tableserversSaveButtonClick ERROR: " + e.toString());
            console.error('ERROR IN tableserversSaveButtonClick: ' + e);
        }
    },
    selectHypervisorChange: function(inSender) {
        try {
            if (this.selectHypervisor.getDataValue() === "qemu") {
                this.panelWarningQemu.setShowing(true);
            } else {
                this.panelWarningQemu.setShowing(false);
            }

        } catch (e) {
            console.error('ERROR IN selectHypervisorChange: ' + e);
        }
    },
/*
    onLiveFormDeleteData: function(inSender) {
        try {
            var node = this.serverToDelete.getValue("dataValue");
            this.javaDeleteServer.input.setValue("name", node);
            this.javaDeleteServer.update();
            this.delVMbyServer.update();
            this.removeServer(node);
            this.serverToDelete.setValue("dataValue", "");
            this.updateServerDatabaseHooks(true);
            
        } catch (e) {
            this.updateLog("Remove node", "unknown", "unknown", "Failed: unknwon error");
            this.showToastError("onLiveFormDeleteData ERROR: " + e.toString());
            console.error('ERROR IN onLiveFormDeleteData: ' + e);
        }
    },
    */
    tableserversLiveForm1InsertData: function(inSender) {
        try {
            this.updateServerDatabaseHooks(false);

        } catch (e) {
            console.error('ERROR IN tableserversLiveForm1InsertData: ' + e);
        }
    },
    boxSshKeyChange: function(inSender) {
        try {
            if (this.boxSshKey.getChecked() === true) {
                this.editPassword.setRequired(true);
                this.editPassword.setDisabled(false);
            } else {
                this.editPassword.setRequired(false);
                this.editPassword.setDisabled(true);
            }

        } catch (e) {
            console.error('ERROR IN boxSshKeyChange: ' + e);
        }
    },
    radioISOChange: function(inSender) {
        try {
            if (this.radioISO.getChecked() === true) {
                this.isoBtn.setDisabled(false);
                this.selectISO.setDisabled(false);
                this.selectISO.setRequired(true);
            } else {
                this.isoBtn.setDisabled(true);
                this.selectISO.setDisabled(true);
                this.selectISO.setRequired(false);
            }

        } catch (e) {
            console.error('ERROR IN radioISOChange: ' + e);
        }
    },
    isoBtnClick: function(inSender) {
        try {
            this.varBrowserCaller.setValue("name", "selectISO");
            this.varBrowserCaller.setValue("dataValue", "file");
            this.remoteFileBrowserDiag.setShowing(true);

        } catch (e) {
            console.error('ERROR IN isoBtnClick: ' + e);
        }
    },
    onAddVmClick: function(inSender) {
        try {
            var vName = this.nameEditor3.getDataValue();
            var node = this.serverMenuEditor.getDataValue();
            var mem = (this.memoryEditor.getDataValue() * 1024);

            var allocation = "";
            if (this.boxAllocateSpace.getChecked()) {
                allocation = "preallocation";
            } else {
                allocation = "sparse";
            }
            var diskPath = this.diskPathEditor.getDataValue();
            if (diskPath.slice(-1) !== "/") {
                diskPath += "/";
            }
            var diskImage = diskPath + vName + "-01.img";
            var diskBus = this.selectDiskBus.getDataValue();
            if (diskBus === "") {
                diskBus = "hda";
            }
            var diskList = [{
                "type": "file",
                "device": "disk",
                "driver": "qemu",
                //"format"
                "format": this.selectDeviceType.getDataValue(),
                //"type"
                "source": diskImage,
                //"path"
                "size": this.diskSizeEditor.getDataValue()+"G",
                "bus": diskBus,
                "alloc": allocation
            }];
            var cdromBus = this.selectCdromBus.getDataValue();
            if (cdromBus === "") {
                cdromBus = "hdb";
            }
            var cdrom = {};
            if (this.radioISO.getChecked() === true) {
                cdrom = {
                    "type": "file",
                    "device": "cdrom",
                    "driver": "qemu",
                    //"format"
                    "format": "raw",
                    //"type"
                    "source": this.selectISO.getDataValue(),
                    //"path"
                    "size": "",
                    "bus": cdromBus,
                    "alloc": ""
                };
                diskList.push(cdrom);
            } else if (this.radioPhysical.getChecked() === true) {
                cdrom = {
                    "type": "block",
                    "device": "cdrom",
                    "driver": "qemu",
                    //"format"
                    "format": "raw",
                    //"type"
                    "source": "/dev/cdrom",
                    //"path"
                    "size": "",
                    "bus": cdromBus,
                    "alloc": ""
                };
                diskList.push(cdrom);
            }

            var network = this.selectVswitch.getDataValue();
            var nicList = [{
                "bridge": network.name,
                "portgroup": network.portgroup,
                "device": this.selectNetworkDevice.getDataValue(),
                "mac": this.macEditor.getDataValue()
            }];
            var bootList = [{
                "dev": "hd"
            }];
            //var bootList = [{"dev":"hd"}, {"dev":"cdrom"}, {"dev":"network"}];
            if (this.radioNone.getChecked() === false) {
                bootList.push({
                    "dev": "cdrom"
                });
            }
            if (this.checkboxNetBoot.getChecked() === true) {
                bootList.push({
                    "dev": "network"
                });
            }
            var featureList = [{
                "opt": "acpi"
            },
            {
                "opt": "apic"
            },
            {
                "opt": "pae"
            }];

            var arch = this.selectArchMenu.getDisplayValue();
            var emulator = this.selectArchMenu.getDataValue();
            this.vmArch.setDataValue(arch);
            var keymap = this.selectKeymap.getDataValue();
            var hash = {
                "domain_type": "kvm",
                "name": vName,
                "memory": mem,
                "vcpu": this.nbcpuEditor.getDataValue(),
                "arch": arch,
                "machine": "rhel6.3.0",
                "machine_type": "hvm",
                "bootList": bootList,
                "bootMenu": "yes",
                "features": featureList,
                "clock_offset": "utc",
                "timers": [{
                    "name": "pit",
                    "present": "yes",
                    "tickpolicy": "delay"
                },
                {
                    "name": "rtc",
                    "present": "yes",
                    "tickpolicy": "catchup"
                }],
                "on_poweroff": "destroy",
                "on_reboot": "restart",
                "on_crash": "restart",
                "emulator": emulator,
                "diskList": diskList,
                "nicList": nicList,
                "serial": [{
                    "type": "pty",
                    "port": "0"
                }],
                "console": [{
                    "type": "serial",
                    "port": "0"
                },
                {
                    "type": "virtio",
                    "port": "1"
                }],
                "input": [{
                    "type": "mouse",
                    "bus": "ps2"
                },
                {
                    "type": "tablet",
                    "bus": "usb"
                }],
                "graphics": [{
                    "type": "vnc",
                    "port": "-1",
                    "autoport": "yes",
                    "listen": "0.0.0.0",
                    "keymap": keymap
                }],
                "sound": [{
                    "model": "ac97"
                }],
                "video": [{
                    "type": "cirrus",
                    "vram": "9216",
                    "heads": "1"
                }]
            };
            this.addLog("Add Virtual Machine", vName, node, 30000);

            this.varSelectedServer.setValue("dataValue", node);
            var varNameIP = node + "ip";
            sIP = this[varNameIP].getValue("dataValue");
            this.javaCreateVM.input.setValue("jsonString", hash);
            this.javaCreateVM.input.setValue("server", node);
            this.javaCreateVM.input.setValue("ipaddr", sIP);
            this.javaCreateVM.input.setValue("path", this.varDefaultVmConfigPath.getValue("dataValue"));
            this.javaCreateVM.update();

        } catch (e) {
            this.showToastError("onAddVmClick ERROR: " + e.toString());
            console.error('ERROR IN onAddVmClick: ' + e);
        }
    },
    onWizardLayersDoneClick: function(inSender) {
        try {
            var validated = false;
            var network = this.selectVswitch.getDataValue();
            if (network && network.name) {
                validated = true;
            } else {
                msg = "Network connection does not exist anymore !";
                title = "Network configuration error";
                this.layerNetwork.activate();
            }

            if (validated) {
                var diskImage = this.diskPathEditor.getDataValue();
                if (!(diskImage)) {
                    validated = false;
                    this.layerStorage.activate();
                    msg = "Storage location has been modified !";
                    title = "Storage configuration error";
                }
            }
            if (validated) {
                this.onAddVmClick(inSender);
                this.tablevmsDialog1.hide();
                setTimeout(function() {
                    try {
                        wm.Page.getPage("Main").layerGeneral.activate();
                    } catch (e) {
                        alert(e);
                    }
                }, 300);
            } else {
                app.toastDialog.showToast(msg, 7000, "Error", "cc", title);
            }
        } catch (e) {
            console.error('ERROR IN onWizardLayersDoneClick: ' + e);
        }
    },
    javaCreateVMResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaCreateVM.getValue("dataValue");
            var params = result.split("::");
            var vName = params[1];
            var node = params[0];
            if (params[2].indexOf("Error") === 0) {
                this.showWarning("<p>Cannot create Virtual Machine <B>" + vName + "</B> on <B>" + node + "</B>:<br><i>" + params[2] + "</i></br></p>");
                //app.alert("<p>Cannot create Virtual Machine <B>"+vName+"</B> on <B>"+node+"</B>:<br><i>"+params[2]+"</i></br></p>");
                this.updateLog("Add Virtual Machine", vName, node, "Failed to create Virtual Machine.");
            } else {
                var jsonVar = JSON.parse(params[2]);
                if (jsonVar.action.result.indexOf("Error") > -1) {
                    this.showWarning("<p>Cannot create Virtual Machine <B>" + vName + "</B> on <B>" + node + "</B>:<br><i>" + jsonVar.action.result + "</i></br></p>");
                    //app.alert("<p>Cannot create Virtual Machine <B>"+vName+"</B> on <B>"+node+"</B>:<br><i>"+jsonVar.action.result+"</i></br></p>");
                    this.updateLog("Add Virtual Machine", vName, node, "Failed to create Virtual Machine.");
                }
/*else {
                    this.tablevmsLiveForm2.saveDataIfValid();
                }   */
            }
        } catch (e) {
            this.showToastError("javaCreateVMResult ERROR: " + e.toString());
            console.error('ERROR IN javaCreateVMResult: ' + e);
        }
    },
    labelCenterAddNewServerClick: function(inSender, inEvent) {
        try {
            this.tableserversDialog.setTitle("Add Node");
            this.tableserversLivePanel1.popupLivePanelInsert();
            this.MenuDialogCenter.hide();

        } catch (e) {
            console.error('ERROR IN labelAddServerClick: ' + e);
        }
    },
    labelCenterReloadClick: function(inSender, inEvent) {
        try {
            this.labelCenterReload.setCaption("Reloading");
            this.labelWaiting.setCaption("Reloading");
            //this.connectingServerDiag.show();
            this.MenuDialogCenter.hide();
            // Use closingTest to check the reload of the page.
            dojo.cookie("closingTest", "RELOAD", {
                //key expire after 20 seconds
                expires: 0.0002
            });
            this.stopMonitoring.update();

        } catch (e) {
            console.error('ERROR IN labelCenterAddNewServer1Click: ' + e);
        }
    },
    dojoMenu1Add_NodeClick: function(inSender /*,args*/ ) {
        try {
            this.tableserversDialog.setTitle("Add Node");
            this.tableserversLivePanel1.popupLivePanelInsert();

        } catch (e) {
            console.error('ERROR IN dojoMenu1Add_NodeClick: ' + e);
        }
    },
    tableserversCancelButtonClick: function(inSender) {
        try {
            this.tableserversDialog.hide();
            this.editPassword.setDataValue("");
            this.editPassword.setRequired(true);
            this.editPassword.setDisabled(false);
            this.boxSshKey.setChecked(true);
            this.checkboxPasswd.setChecked(true);
            this.panelServerError.setShowing(false);
            this.panelWarningQemu.setShowing(false);
            this.selectHypervisor.removeUserClass("wm_TextDecoration_Bold");
            this.selectHypervisor.removeUserClass("wm_FontColor_BrightRed");


        } catch (e) {
            this.showToastError("ERROR IN tableserversCancelButtonClick: " + e.toString());
            console.error('ERROR IN tableserversCancelButtonClick: ' + e);
        }
    },
    tableserversDialogShow: function(inSender) {
        try {

            if (this.clearServerInfo.getValue("dataValue")) {
                this.editPassword.setDataValue("");
                this.editPassword.setRequired(true);
                this.editPassword.setDisabled(false);
                this.boxSshKey.setChecked(true);
                this.checkboxPasswd.setChecked(true);
                this.panelServerError.setShowing(false);
                this.panelWarningQemu.setShowing(false);
                this.selectHypervisor.removeUserClass("wm_TextDecoration_Bold");
                this.selectHypervisor.removeUserClass("wm_FontColor_BrightRed");

            } else {
                this.clearServerInfo.setValue("dataValue", true);
            }
        } catch (e) {
            this.showToastError("ERROR IN tableserversDialogShow: " + e.toString());
            console.error('ERROR IN tableserversDialogShow: ' + e);
        }
    },

    labelServerClick: function(serverLabel, activate) {
        try {
            this.hideOpenkviToolTip();
            activate = typeof activate !== 'undefined' ? activate : true;
            this.disableLoadingDialogs();
            //Check if VM config is left in a dirty state 
            if (this.tabVirtualMachines.getActiveLayer().name === "Configuration") {
                if (this.vmConfigSave.disabled === false) {
                    this._vmTabChangeParams = [serverLabel, null];
                    this.unsavedVirtualMachinesChanges('labelServerClick');
                    return 0;
                }
            }
            // reinitialize tabs
            //this.TabCenterOverview.activate();
            if (activate) {
                this.TabServersOverview.activate();
                this.TabVMsOverview.activate();
            }

            var node = serverLabel;
            var OldSelectedServer = this.varSelectedServer.getValue("dataValue");
            this.varSelectedServer.setValue("dataValue", node);
            this.varSelectedVm.setValue("dataValue", "none");

            var varVms = node + "VmCreated";
            var varConnected = node + "connected";
            online = this[varConnected].getValue("dataValue");

            if (this[varVms] !== undefined) {
                var created = this[varVms].getValue("dataValue");

                if (created !== true) {
                    var varPictWait = "PictServerWait" + node;
                    this[varPictWait].setShowing(true);
                    var varPictVMListWait = "PictVMListWait" + node;
                    this[varPictVMListWait].setShowing(true);
                    this.vmListByServerLive.filter.setValue("server", node);
                    this.vmListByServerLive.update();
                }
                if (activate) {
                    this.highLightSelectedServer(serverLabel);

                    var varIP = node + "ip";
                    var sIP = this[varIP].getValue("dataValue");
                    var varVirt = node + "virt";
                    var sVirt = this[varVirt].getValue("dataValue");
                    this.serverIpText.setDataValue(sIP);
                    this.serverHypervisorText.setDataValue(sVirt);
                }
                this.getNodeConfig(node);
                if (online) {

                    var varWait = "PictServerWait" + node;
                    this[varWait].setShowing(true);
                    var javaNodeHardwareInfo = node + "nodeHardwareInfo";
                    this[javaNodeHardwareInfo].input.setValue("node", node);
                    this[javaNodeHardwareInfo].update();
                    this.getNodeInformation(node, true);
                }

                // Show webconsole if it exist
                var varNodeWebshell = node + "nodeWebshell";
                var webshell = this[varNodeWebshell].getValue("dataValue");
                var proto = window.location.protocol;
                if (proto !== "https:") {
                    this.TabConsole.setShowing(false);
                }
                else if (webshell !== "no") {
                    this.TabConsole.setShowing(true);
                } else {
                    this.TabConsole.setShowing(false);
                }
                if (activate) {
                    this.loadingNodeRessources.setShowing(true);
                }
            }

        } catch (e) {
            this.showToastError("labelServerClick ERROR: " + e.toString());
            console.error('ERROR IN labelServerClick: ' + e);
        }
    },
    highLightSelectedServer: function(serverLabel) {
        try {
            //High light  selection 
            var varOldPanel = this.varSelectedItem.getValue("dataValue");
            if (this[varOldPanel] !== undefined) {                
                if (varOldPanel === "panelDatacenter") {
                    this[varOldPanel].removeUserClass("wm_BackgroundColor_SteelBlue");
                } else {
                    this[varOldPanel].removeUserClass("wm_BackgroundChromeBar_LightGray");
                    this[varOldPanel].removeUserClass("wm_BorderShadow_WeakShadow");
                }
                this[varOldPanel].setBorder(0);
            }
            var varPanel = "panelNode" + serverLabel;
            this[varPanel].addUserClass("wm_BorderShadow_WeakShadow");
            this[varPanel].addUserClass("wm_BackgroundChromeBar_LightGray");
            this[varPanel].setBorder(1);
            //this[varPanel].setMargin("0,0,0,0");
            //end
            this.varSelectedItem.setValue("dataValue", varPanel);
            this.layerServer.setShowing(true);
            this.layerVirtualMachines.setShowing(false);
            this.layerDataCenter.setShowing(false);
            this.layerServer.activate();
            var user = this.templateUsernameVar.getValue("dataValue");
            var dc = "<i>"+user+"</i>"+" @ <b>"+this.varCenterHostname.getValue("dataValue")+"</b>";
            this.labelUserInfoPath.setCaption(dc + " <small>></small> " + serverLabel);

            var varConnected = serverLabel + "connected";
            if (this[varConnected].getValue("dataValue") === false) {
                this.panelServerTabs.setShowing(false);
            } else if (varOldPanel !== varPanel) {
                this.TabServersOverview.activate();
                this.panelServerTabs.setShowing(true);
            } else {
                this.panelServerTabs.setShowing(true);
            }
        } catch (e) {
            this.showToastError("highLightSelectedServer ERROR: " + e.toString());
            console.error('ERROR IN highLightSelectedServer: ' + e);
        }
    },
    iFrameNodeConsoleMouseOver: function(inSender, event) {
        try {
            this.iFrameNodeConsole.frame.contentWindow.focus();

        } catch (e) {
            console.error('ERROR IN iFrameNodeConsoleMouseOver: ' + e);
            this.showToastError("iFrameNodeConsoleMouseOver ERROR: " + e.toString());
        }
    },
    iFrameNodeConsoleMouseOut: function(inSender, event) {
        try {
            this.labelWebshellUri.focus();

        } catch (e) {
            console.error('ERROR IN iFrameNodeConsoleMouseOut: ' + e);
            this.showToastError("iFrameNodeConsoleMouseOut ERROR: " + e.toString());
        }
    },
    TabConsoleShow: function(inSender) {
        try {
            var node = this.varSelectedServer.getValue("dataValue");
            var varNodeWebshell = "";
            var proto = window.location.protocol;

            if (proto !== "https:") {
                this.panelNodeConsole.setShowing(false);
                this.panelNodeConsoleWarning.setShowing(true);
            } else {
                this.panelNodeConsoleWarning.setShowing(false);
                this.panelNodeConsole.setShowing(true);
                varNodeWebshell = node + "nodeWebshell";
                var webshell = this[varNodeWebshell].getValue("dataValue");

                if (webshell !== "0") {
                    var clientId = this.varClientId.getValue("dataValue");
                    var hostname = window.location.hostname;
                    var uri = proto + "//" + hostname + "/shellinabox/" + webshell + "/?id=" + clientId;
                    this.labelWebshellUri.setCaption(uri);
                    this.iFrameNodeConsole.setSource(uri);
                }
            }
        } catch (e) {
            console.error('ERROR IN TabConsoleShow: ' + e);
            this.showToastError("TabConsoleShow ERROR: " + e.toString());
        }
    },
    btnDetachNodeConsoleClick: function(inSender) {
        try {
            var uri = this.labelWebshellUri.caption;
            window.open(uri, "", 'scrollbars=yes,menubar=no,height=600,width=800,resizable=yes,toolbar=no,location=no,status=no');

        } catch (e) {
            console.error('ERROR IN btnDetachNodeConsoleClick: ' + e);
        }
    },
    TabServersVMsShow: function(inSender) {
        try {
            var node = this.varSelectedServer.getValue("dataValue");
            this.vmListByServerLive.filter.setValue("server", node);
            this.vmListByServerLive.update();

        } catch (e) {
            console.error('ERROR IN TabServersVMsShow: ' + e);
        }
    },
    GridVmListCellDblClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        try {
            var selectedIndex = this.GridVmList.getSelectedIndex();
            var selectedVM = this.GridVmList.getCell(selectedIndex, "name");
            var node = this.GridVmList.getCell(selectedIndex, "server");
            var varPanel = "LabelArrow" + node;
            //var state = this[varPanel].getValue("domNode.title");
            var state = this._toolTipList[varPanel].msg;
            if (state === "Expand") {
                this.ExpandServer(node);
            }
            this.labelVMClick(selectedVM + "__" + node);

        } catch (e) {
            this.showToastError("GridVmListCellDblClick ERROR: " + e.toString());
            console.error('ERROR IN GridVmListCellDblClick: ' + e);
        }
    },
    tablevmsDojoGridCellDblClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        try {
            var selectedIndex = this.tablevmsDojoGrid.getSelectedIndex();
            var selectedVM = this.tablevmsDojoGrid.getCell(selectedIndex, "name");
            var node = this.tablevmsDojoGrid.getCell(selectedIndex, "server");
            var varPanel = "LabelArrow" + node;
            //var state = this[varPanel].getValue("domNode.title");
            var state = this._toolTipList[varPanel].msg;
            if (state === "Expand") {
                this.ExpandServer(node);
            }

            setTimeout(function() {
                try {
                    wm.Page.getPage("Main").labelVMClick(selectedVM + "__" + node);
                } catch (e) {
                    alert(e);
                }
            }, 1000);

        } catch (e) {
            console.error('ERROR IN tablevmsDojoGridCellDblClick: ' + e);
        }
    },
    layerVirtualMachinesShow: function(inSender) {
        try {
            this.loadingDialogVm.setShowing(true);

        } catch (e) {
            console.error('ERROR IN layerVirtualMachinesShow: ' + e);
        }
    },
    labelVMClick: function(vmInfos) {
        try {
            this.disableLoadingDialogs();

            this.TabVMsOverview.activate();
            //this.TabCenterOverview.activate();
            //this.TabServersOverview.activate();
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];

            var locked = this.vmIsLocked(vmInfos);
            var disabled = false;

            if (locked) {
                var lock = this.getVmLock(vmInfos);
                this.logDebugVM("VM " + vName + " is currently locked by " + lock);
                this.activateLock(vName, node, lock);
            } else {
                this.deactivateLock(vName, node);
            }

            this.vmScreenshotpict.setShowing(false);
            var oldVmInfos = this.varSelectedVm.getValue("dataValue");
            var oldDic = vmInfos.split("__");
            var oldVname = dic[0];
            var oldnode = dic[1];
            var varOldPictWait = "PictVmWait" + oldVmInfos;
            if (this[varOldPictWait] !== undefined) {
                this[varOldPictWait].setDisabled(true);
                this[varOldPictWait].setShowing(false);
            }
            this.varSelectedVm.setValue("dataValue", vName + "__" + node);
            var panelName = "panelVm" + vmInfos;
            if (this[panelName] !== undefined) {
                this.logDebugDataCenter("this[panelName] !== undefined");
                //var varServer = vName + "Server";
                //var node = this[varServer].getValue("dataValue");
                this.varSelectedServer.setValue("dataValue", node);
                //High light  selection 
                var varOldPanel = this.varSelectedItem.getValue("dataValue");
                if (this[varOldPanel] !== undefined) {                    
                    if (varOldPanel === "panelDatacenter") {
                        this[varOldPanel].removeUserClass("wm_BackgroundColor_SteelBlue");
                    } else {
                        this[varOldPanel].removeUserClass("wm_BackgroundChromeBar_LightGray");
                        this[varOldPanel].removeUserClass("wm_BorderShadow_WeakShadow");
                    }
                    this[varOldPanel].setBorder(0);
                }
                this[panelName].addUserClass("wm_BorderShadow_WeakShadow");
                this[panelName].addUserClass("wm_BackgroundChromeBar_LightGray");
                this[panelName].setBorder(1);
                //this[panelName].domNode.style.backgroundColor = "#dfd8d8";
                //this[panelName].domNode.style.backgroundColor = "#c8c8c8";
                //end
                this.varSelectedItem.setValue("dataValue", panelName);

                var picLabel = "picLabel" + vmInfos;
                var caption = this[picLabel].caption;
                if ((caption.indexOf("dialog-warning") === -1) && (disabled === false)) {
                    this.layerServer.setShowing(false);
                    this.layerVirtualMachines.setShowing(true);
                    this.layerDataCenter.setShowing(false);
                    var user = this.templateUsernameVar.getValue("dataValue");
                    var dc = "<i>"+user+"</i>"+" @ <b>"+this.varCenterHostname.getValue("dataValue")+"</b>";
                    var vDisplayedName = this["Label" + vmInfos].caption;
                    this.labelUserInfoPath.setCaption(dc + " <small>></small> " + node + " <small>></small> " + vDisplayedName);
                    this.layerVirtualMachines.activate();

                    var varConnected = node + "connected";
                    var nodeOnLine = this[varConnected].getValue("dataValue");
                    if (nodeOnLine) {
                        this.reloadVmConfig("labelVMClick");
                        var varPictWait = "PictVmWait" + vmInfos;
                        this[varPictWait].setDisabled(false);
                        this[varPictWait].setShowing(true);
                        if (panelName !== varOldPanel) {
                            this.TabVMsOverview.activate();
                            //this.updateVmOverview();
                        }
                    }

                }
                this.clearVmExtraInfos();

            } else {
                this.loadingDialogVm.setShowing(false);
            }

        } catch (e) {
            this.showToastError("labelVMClick ERROR: " + e.toString());
            console.error('ERROR IN labelVMClick: ' + e);
        }
    },
    onLabelRightClick: function(inSender, event) {
        try {
            if (this.tabVirtualMachines.getActiveLayer().name === "Configuration") {
                if (this.vmConfigSave.disabled === false) {
                    this._vmTabChangeParams = [inSender, event];
                    this.unsavedVirtualMachinesChanges('onLabelRightClick');
                    return 0;
                }
            }

            if ((this._userRole === "User") || (this._userRole === "PowerUser")) {
                this.MenuDialogCenter.setHeight("50");
            } else {
                this.MenuDialogCenter.setHeight("124");
            }

            this.MenuDialogCenter.fixPositionNode = inSender.domNode;
            this.varMousePosition.setValue("top", event.clientY);
            this.varMousePosition.setValue("left", event.clientX);
            this.MenuDialogCenter.show();
            this.MenuDialogCenter.domNode.style.top = event.clientY + "px";
            this.MenuDialogCenter.domNode.style.left = event.clientX + "px";
            this.labelDatacenterClick(inSender, event);

        } catch (e) {
            this.showToastError("onLabelRightClick ERROR: " + e.toString());
            console.error('ERROR IN onLabelRightClick: ' + e);
        }
    },

    deleteVirtualMachine: function() {
        try {
            var vName = this._vmToDelete;
            var node = this._vmToDeleteNode;
            this.addLog("Delete Virtual Machine", vName, node, 20000);

            var picLabel = "picLabel" + vName + '__' + node;
            var caption = "";
            if (this[picLabel] !== undefined) {
                caption = this[picLabel].caption;
            }
            var dirLocalList = node + "/vm/configs";
            this.javaDeleteVmData.input.setValue("directories", dirLocalList);
            this.javaDeleteVmData.input.setValue("vmName", vName);
            this.javaDeleteVmData.update();
            this.javaUndefineVm.input.setValue("node", node);
            this.javaUndefineVm.input.setValue("vm", vName);
            //this.javaUndefineVm.input.setValue("disks", dirList);
            this.javaUndefineVm.update();
            this.logDebugServer("vm delete 2");
            var selectedVmInfos = this.varSelectedVm.getValue("dataValue");
            var selectedVm = selectedVmInfos.split("__")[0];
            if (vName === selectedVm) {
                this.varSelectedVm.setValue("dataValue", "");
                if (this.layerVirtualMachines.isActive()) {
                    this.labelServerClick(node);
                }
            }
            dojo.cookie("openkvi_vm_delete", vName + ":::" + node, {
                //key expire after 1min
                expires: 0.0001
            });

        } catch (e) {
            this.showToastError("deleteVirtualMachine ERROR: " + e.toString());
            console.error('ERROR: ' + e);
        }
    },
    javaUndefineVmResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaUndefineVm.getValue("dataValue");
/*
            var jsonVar = JSON.parse(result);
            var node = jsonVar.node;
            var vName = jsonVar.action.vm;
            var jRes = jsonVar.action.result.state;
            if (jRes.indexOf("Error:") > -1) {
                var error = jRes.replace(/Error: /, "");
                this.updateLog("Delete Virtual Machine", vName, node, "Failed: " + error);
            }
            */
        } catch (e) {
            this.showToastError("javaUndefineVmResult ERROR: " + e.toString());
            console.error('ERROR IN javaUndefineVmResult: ' + e);
        }
    },
    onNewVmButtonClick: function(inSender) {
        try {
            this.layerGeneral.activate();
            this.selectDeviceType.setDisplayValue("");
            this.panelWarnNoSnapshot.setShowing(false);
            this.selectDiskBus.setDisplayValue("");
            this.diskSizeEditor.setDisplayValue(this.varDefaultDiskSize.getValue("dataValue"));
            this.diskPathEditor.setDisplayValue(this.varDefaultDiskPath.getValue("dataValue"));
            this.varNewVmCaller.setValue("dataValue", inSender.name);
            this.selectVswitch.setDisplayValue("");
            this.selectNetworkDevice.setDisplayValue("");
            //this.tablevmsLiveForm2.clearData();
            this.tablevmsLivePanel1.popupLivePanelInsert();

            this.serverPopup.hide();
        } catch (e) {
            this.showToastError("onNewVmButtonClick Error: " + e.toString());
            console.error('ERROR IN onNewVmButtonClick: ' + e);
        }
    },
    labelServerScanVmClick: function(inSender, inEvent) {
        try {
            this.serverPopup.hide();
            var node = this.varSelectedServer.getValue("dataValue");
            var javaListAllVms = node + "javaListAllVms";
            this[javaListAllVms].input.setValue("node", node);
            this[javaListAllVms].update();
        } catch (e) {
            this.showToastError("labelServerScanVmClick Error: " + e.toString());
            console.error('ERROR IN labelServerScanVmClick: ' + e);
        }
    },
    tablevmsDialog1Show: function(inSender) {
        try {
            this.memoryEditor.setDisplayValue(256);
            this.nbcpuEditor.setDisplayValue(1);
            this.selectArchMenu.setDisplayValue("");
            this.selectKeymap.setDisplayValue("");
            this.nameEditor3.setRegExp("^[A-Za-z0-9]+(?:-?_?[A-Za-z0-9]+)+$");
            this.tablevmsCancelButton1.setShowing(false);
            this.macEditor.setDataValue("Automatic");
            this.checkboxNetBoot.setChecked(true);

            var caller = this.varNewVmCaller.getValue("dataValue");
            if ((caller === "vmNewButton") || (caller === "labelServerAddVm")) {
                node = this.varSelectedServer.getValue("dataValue");
                this.serverMenuEditor.setDataValue(node);
                this.serverMenuEditor.setReadonly(true);
            } else {
                this.serverMenuEditor.setReadonly(false);
            }

        } catch (e) {
            this.showToastError("tablevmsDialog1Show Error: " + e.toString());
            console.error('ERROR IN tablevmsDialog1Show: ' + e);
        }
    },
    serverMenuEditorChange: function(inSender) {
        try {
            var node = this.serverMenuEditor.getDisplayValue();
            if (this.tablevmsDialog1.showing) {
                this.getNodeInformation(node, false);
            }

        } catch (e) {
            this.showToastError("layerStorageShow Error: " + e.toString());
            console.error('ERROR IN serverMenuEditorChange: ' + e);
        }
    },
    selectArchMenuChange: function(inSender) {
        try {
            if (this.selectArchMenu.getDisplayValue() == "x86_64") {
                if (this.memoryEditor.getDisplayValue() < 1024) {
                    this.memoryEditor.setDisplayValue(1024);
                }
            }

        } catch (e) {
            this.showToastError("selectArchMenuChange Error: " + e.toString());
            console.error('ERROR IN selectArchMenuChange: ' + e);
        }
    },
    dojoMenuStorageNewClick: function(inSender /*,args*/ ) {
        try {
            this.newStorage.show();

        } catch (e) {
            this.showToastError("dojoMenuStorageNewClick Error: " + e.toString());
            console.error('ERROR IN dojoMenuStorageNewClick: ' + e);
        }
    },
    tablevmdisksNewButtonClick: function(inSender) {
        try {
            this.tablevmdisksLivePanel1.popupLivePanelInsert();
        } catch (e) {
            this.showToastError("tablevmdisksNewButtonClick Error: " + e.toString());
            console.error('ERROR IN tablevmdisksNewButtonClick: ' + e);
        }
    },
    onWizardLayersLayerValidation: function(inSender, inLayer, outResult) {
        try {
            var vName = this.nameEditor3.getDisplayValue();
            var node = this.serverMenuEditor.getDisplayValue();
            this.varSelectedVm.setValue("dataValue", vName + "__" + node);

        } catch (e) {
            console.error('ERROR IN onWizardLayersLayerValidation: ' + e);
        }
    },
    wizardNewVmChange: function(inSender, inIndex) {
        try {
            if (this.layerGeneral.isActive()) {
                this.tablevmsCancelButton1.setShowing(false);
            } else {
                this.tablevmsCancelButton1.setShowing(true);
            }
        } catch (e) {
            this.showToastError(this.name + "ERROR IN wizardNewVmChange: " + e.toString());
            console.error('ERROR IN wizardNewVmChange: ' + e);
        }
    },
    layerCdromShow: function(inSender) {
        try {
            this.radioNone.setChecked(true);
            this.selectISO.setDataValue("");
            this.selectCdromBus.setDisplayValue("ide");


        } catch (e) {
            console.error('ERROR IN layerCdromShow: ' + e);
        }
    },
    onNewVmCancelClick: function(inSender) {
        try {
            this.selectArchMenu.setDisplayValue("");
            this.nameEditor3.setRegExp("^[A-Za-z0-9]+(?:-?_?[A-Za-z0-9]+)+$");
            this.containerWidget2.clearData();
            //this.tablevmsLiveForm2.clearData();
            this.tablevmsDialog1.hide();
            setTimeout(function() {
                try {
                    wm.Page.getPage("Main").layerGeneral.activate();
                } catch (e) {
                    alert(e);
                }
            }, 300);

        } catch (e) {
            console.error('ERROR IN onNewVmCancelClick: ' + e);
        }
    },
    
    newStorageDeviceTypeChange: function(inSender) {
        try {
            var type = this.newStorageDeviceType.getDataValue();
            if (type !== "qcow2") {
                this.newStorageAllocateSpace.setDisabled(false);
            } else {
                this.newStorageAllocateSpace.setChecked(true);
                this.newStorageAllocateSpace.setDisabled(true);
            }
    
        } catch (e) {
            console.error('ERROR IN newStorageDeviceTypeChange: ' + e);
        }
    },
    selectDeviceTypeChange: function(inSender) {
        try {
            var type = this.selectDeviceType.getDataValue();
            if (type !== "qcow2") {
                this.panelWarnNoSnapshot.setShowing(true);
                this.boxAllocateSpace.setDisabled(false);
            } else {
                this.panelWarnNoSnapshot.setShowing(false);
                this.boxAllocateSpace.setChecked(true);
                this.boxAllocateSpace.setDisabled(true);
            }

        } catch (e) {
            console.error('ERROR IN selectDeviceTypeChange: ' + e);
        }
    },
    nameEditor3Change: function(inSender) {
        try {
            this.checkVmName();
        } catch (e) {
            console.error('ERROR IN nameEditor3Change: ' + e);
        }
    },
    checkVmName: function() {
        try {
            if (this.nameEditor3.isDirty) {
                var selectedNode = "None";
                if (this.serverMenuEditor.readonly === true) {
                    selectedNode = this.serverMenuEditor.getDisplayValue();
                }
                //var vName = this.nameEditor3.getDisplayValue();
                var vName = this.nameEditor3.getDataValue();
                var notFound = true;
                var vmCount = this.tablevmsLiveVariable2.getCount();
                for (var j = 0; j < vmCount; j++) {
                    //var vmInfo = this.tablevmsLiveVariable2.getItem(j);
                    //var vm = vmInfo.getValue("name");
                    var vm = this.tablevmsLiveVariable2.getItem(j).getValue("name");
                    var node = "None";
                    if (this.serverMenuEditor.readonly === true) {
                        node = this.tablevmsLiveVariable2.getItem(j).getValue("server");
                    }

                    if ((vm === vName) && (this.tablevmsDialog1.showing === true)) {
                        var msg = "";
                        var title = "";
                        if (node === selectedNode) {
                            msg = "Virtual Machine names must be unique within an OpenKVI instance";
                            title = vm + " name already exist";
                            this.nameEditor3.setRegExp("^((?!" + vm + ").)*$");
                            this.layerGeneral.activate();
                        } else {
                            title = vm + " is already used on " + node;
                            msg = "Migration between both nodes will not be possible";
                        }
                        app.toastDialog.showToast(msg, 5000, "Warning", "cc", title);
                        notFound = false;
                    }
                }
            }

        } catch (e) {
            console.error('ERROR IN checkVmName: ' + e);
        }
    },
    btnRepoSaveClick: function(inSender) {
        try {
            var storagePath = this.editRepoTarget.getValue("dataValue");
            if (storagePath[storagePath.length - 1] !== "/") {
                storagePath += "/";
            }
            var jsonRepo = {
                "name": this.editRepoName.getValue("dataValue"),
                "type": this.selectRepoType.getValue("dataValue"),
                "target": storagePath,
                "source": this.editRemoteSource.getValue("dataValue")
            };
            this.varStorages.addItem(jsonRepo);
            var jsonVar = this.varServerXmlData.getData();
            jsonVar.storages = this.varStorages.getData();
            var jsonString = JSON.stringify(jsonVar);
            this.varServerXmlData.clearData();
            this.varServerXmlData.setData(jsonVar);
            this.logDebugServer(jsonString);

            this.addLog("Add new storage", jsonVar.name, "<i>All</i>", 0);
            this.javaUpdateServerConfig.input.setValue("jsonString", jsonString);
            this.javaUpdateServerConfig.input.setValue("log", "Add new storage");
            this.javaUpdateServerConfig.input.setValue("server", jsonVar.name);
            this.javaUpdateServerConfig.update();

            this.serverRepositoryDialog.hide();

        } catch (e) {
            this.showToastError("btnRepoSaveClick Error: " + e.toString());
            console.error('ERROR IN btnRepoSaveClick: ' + e);
        }
    },
    selectRepoTypeChange: function(inSender) {
        try {
            if (this.selectRepoType.getDataValue() == "nfs") {
                this.panelRemoteTarget.setShowing(true);
                this.editRemoteSource.setRequired(false);
            } else {
                this.panelRemoteTarget.setShowing(false);
                this.editRemoteSource.setRequired(false);
            }

        } catch (e) {
            this.showToastError("selectRepoTypeChange Error: " + e.toString());
            console.error('ERROR IN selectRepoTypeChange: ' + e);
        }
    },
    macEditorChange: function(inSender) {
        try {
            var mac = this.macEditor.getDataValue();
            if (mac.toLowerCase() !== "automatic") {
                //check mac is correct
                this.macEditor.setRegExp("^([0-9A-F]{2}:){5}([0-9A-F]{2})$");
            } else {
                this.macEditor.setRegExp(".*");
            }

        } catch (e) {
            console.error('ERROR IN macEditorChange: ' + e);
        }
    },
    ////// Server extra configuration ////////
    btnEditVmConfigStorageClick: function(inSender) {
        try {
            if (inSender.caption === "Edit") {
                this.editVmConfigStorage.setReadonly(false);
                this.btnEditVmConfigStorage.setCaption("Save");
            } else if (inSender.caption === "Save") {
                this.editVmConfigStorage.setReadonly(true);
                this.btnEditVmConfigStorage.setCaption("Edit");
                this.varDefaultVmConfigPath.setValue("dataValue", this.editVmConfigStorage.getDataValue(""));
            }

        } catch (e) {
            this.showToastError("btnEditVmConfigStorageClick Error: " + e.toString());
            console.error('ERROR IN btnEditVmConfigStorageClick: ' + e);
        }
    },
    javaListAllVmsResult: function(inSender, inDeprecated) {
        try {
            var serviceName = inSender.name.toString();
            var result = this[serviceName].getValue("dataValue");

            var jsonVar = JSON.parse(result);
            this.varVmState.clearData();

            var vmsOfServer = new dojox.collections.Dictionary();
            var serverName = this.varSelectedServer.getValue("dataValue");
            if (this.vmsByServer.containsKey(serverName)) {
                vmsOfServer = this.vmsByServer.entry(serverName).value;
            }
            count = jsonVar.action.result.length;
            if (count > 0) {
                for (var i = 0; i < count; i++) {
                    var vName = jsonVar.action.result[i].vm;
                    var state = jsonVar.action.result[i].state;
                    if (!vmsOfServer.containsKey(vName)) {
                        this.varVmState.addItem({
                            "id": i,
                            "name": vName,
                            "state": state,
                            "add": true
                        });
                    }
                }
            }

            this.listAvailableVmsDialog.show();
        } catch (e) {
            this.showToastError("javaListAllVmsResult Error: " + e.toString());
            console.error('ERROR IN javaListAllVmsResult: ' + e);
        }
    },
    addAvailableVmsBtnClick: function(inSender) {
        try {
            var server = this.varSelectedServer.getValue("dataValue");
            this.listAvailableVmsDialog.hide();
            var count = this.gridAvailableVms.getRowCount();
            //var vmList = "[";
            var vmList = [];
            for (var i = 0; i < count; i++) {
                var data = this.gridAvailableVms.getRow(i);
                if (data.add === true) {
                    this.addLog("Import virtual machine", data.name, server, 60000);
                    //this.setLogTimeout("Import virtual machine", data.name, server, 60000);
/*
                    if (vmList === "[") {
                        vmList += "{name:" + data.name + "}";                        
                    } else {
                       vmList += ",{name:" + data.name + "}";                       
                    }*/
                    vmList.push(data.name);
                }
            }
            //vmList += "]";
            var node = this.varSelectedServer.getValue("dataValue");
            this.javaNodeImportLocalVms.input.setValue("node", node);
            this.javaNodeImportLocalVms.input.setValue("vmList", vmList);
            this.javaNodeImportLocalVms.update();
/*
            var varIP = node + "ip";
            var sIP = this[varIP].getValue("dataValue");
            var configDir = this.varDefaultVmConfigPath.getValue("dataValue");
            this.javaImportVmConfig.input.setValue("ipaddr", sIP);
            this.javaImportVmConfig.input.setValue("jsonString", vmList);
            this.javaImportVmConfig.input.setValue("server", node);
            this.javaImportVmConfig.update();
            */
        } catch (e) {
            this.showToastError("addAvailableVmsBtnClick Error: " + e.toString());
            console.error('ERROR IN addAvailableVmsBtnClick: ' + e);
        }
    },
    javaImportVmConfigSuccess: function(inSender, inDeprecated) {
        try {
            var result = this.javaImportVmConfig.getValue("dataValue");
            this.varImportedVms.clearData();
            this.logDebugServer(result);
            var jsonVar = JSON.parse(this.javaImportVmConfig.getValue("dataValue"));
            var count = jsonVar.vms.length;
            if (count > 0) {
                var invalidVmList = "";
                for (var i = 0; i < count; i++) {
                    var vName = jsonVar.vms[i].domain.name;
                    var error = jsonVar.vms[i].error;
                    var server = jsonVar.vms[i].node;

                    if (error !== "") {
                        invalidVmList = " " + vName;
                        jsonVar.vms.splice(i, 1);
                        count -= 1;
                        i -= 1;
                        this.updateLog("Import virtual machine", vName, server, "Failed: " + error);
                    }
                }
                if (invalidVmList !== "") {
                    var msg = invalidVmList;
                    var title = "The following VMs are invalid:";
                    app.toastDialog.showToast(msg, 5000, "Warning", "cc", title);
                }
            }
            count = jsonVar.vms.length;
            if (count > 0) {
                var jsonVm = jsonVar.vms[0];
                jsonVar.vms.splice(0, 1);
                this.varVmsToImport.setValue("dataValue", JSON.stringify(jsonVar));
                this.importVm(jsonVm);

            }

        } catch (e) {
            this.updateLog("Import virtual machine", "unknown", "unknown", "Failed: unknwon error");
            this.showToastError(" javaImportVmConfigSuccess Error: " + e.toString());
            console.error('ERROR IN javaImportVmConfigSuccess: ' + e);
        }
    },
    importVm: function(vmInfo) {
        try {
            this.liveFormInsertVmEditPanel.beginDataInsert();
            var memory = Math.floor(parseInt(vmInfo.domain.memory, 10) / 1024);
            var name = vmInfo.domain.name;
            var server = vmInfo.node;
            var nbcpu = parseInt(vmInfo.domain.vcpu, 10);
            var arch = vmInfo.domain.os.type.arch;
            var emulator = vmInfo.domain.emulator;
            var network = "none";
            var cdrom = "none";
            var disks = vmInfo.domain.devices.disk.vsize;

            this.nameEditor2.setDataValue(name);
            this.displayednameEditor1.setDataValue(name);
            this.memoryEditor1.setDataValue(memory);
            this.serverEditor1.setDataValue(server);
            this.nbcpuEditor1.setDataValue(nbcpu);
            this.freqcpuEditor1.setDataValue(1);
            this.archEditor1.setDataValue(arch);
            this.networkEditor2.setDataValue(network);
            this.cdromEditor1.setDataValue(cdrom);
            this.disksEditor1.setDataValue(disks);

            this.varVmToInsert.setValue("name", name);
            this.varVmToInsert.setValue("server", server);

            this.liveFormInsertVmEditPanel.saveData();

            //this.vmListByServerLive.update();
        } catch (e) {
            this.updateLog("Import virtual machine", "unknown", "unknown", "Failed: " + e.toString());
            this.showToastError(" importVm Error: " + e.toString());
            console.error('ERROR IN importVm: ' + e);
        }
    },
    liveFormInsertVmInsertData: function(inSender) {
        try {

            var name = this.varVmToInsert.getValue("name");
            var server = this.varVmToInsert.getValue("server");
            this.logDebugDataCenter("liveFormInsertVmInsertData called addVM");
            this.addVM(name, server, true);
            this.updateLog("Import virtual machine", name, server, "Successful");
            this.varImportedVms.addItem({
                "name": name,
                "server": server
            });

            // Check if there is other VMs to import:
            var strVar = this.varVmsToImport.getValue("dataValue");
            var jsonVar = JSON.parse(strVar);
            var count = jsonVar.vms.length;
            if (count > 0) {
                var jsonVm = jsonVar.vms[0];
                jsonVar.vms.splice(0, 1);
                this.varVmsToImport.setValue("dataValue", JSON.stringify(jsonVar));
                this.importVm(jsonVm);
            } else {
                var user = this.templateUsernameVar.getValue("dataValue");
                var vmList = {
                    "list": this.varImportedVms.getData(),
                    "owner": user
                };
                var str = JSON.stringify(vmList);
                this.javaNotifyAll.input.setValue("node", server);
                this.javaNotifyAll.input.setValue("request", "import");
                this.javaNotifyAll.input.setValue("infos", str);
                this.javaNotifyAll.update();
                //                this.updateVmDatabaseHooks();
            }

        } catch (e) {
            this.updateLog("Import virtual machine", "unknown", "unknown", "Failed: unknwon error");
            this.showToastError(" liveFormInsertVmInsertData Error: " + e.toString());
            console.error('ERROR IN liveFormInsertVmInsertData: ' + e);
        }
    },

    /////////////////////////////////////////////////////////////////////////////////
    ///////// end disk editing //////////////////////////////////////////////////////
    ////////// start network editing ////////////////////////////////////////////////
    disableVmConfigSave: function() {
        this.vmConfigSave.setDisabled(true);
        this.vmConfigSave.setCaption("Commit");
    },

    enableVmConfigSave: function() {
        this.vmConfigSave.setDisabled(false);
        this.vmConfigSave.setCaption("<b>Commit</b>");
    },

    gridVmNetworksStatusFormat: function(inValue, rowId, cellId, cellField, cellObj, rowObj) {
        try {
            return '<img  style="height: 30px;" src="' + inValue + '" />';

        } catch (e) {
            console.error('ERROR IN gridVmNetworksStatusFormat: ' + e);
        }
    },
    initEditNetworkDialog: function(inSender) {
        try {
            if (this.panelVmNetworkWarning.showing === true) {
                this.editNetworkDialog.setHeight(300);
                this.panelVmNetworkWarning.setShowing(false);
            }
            this.selectNetworkType.setDisplayValue("");
            this.selectBridge.setDisplayValue("");
            this.selectNetDevice.setDisplayValue("");
            this.editMac.setDisplayValue("");
            this.checkLinkStatus.setChecked(true);

        } catch (e) {
            console.error('ERROR IN initEditNetworkDialog: ' + e);
        }
    },
    editNetworkDialogShow: function(inSender) {
        try {

            var action = this.varNetworkCaller.getValue("dataValue");
            var disableBridge = true;
            var count = this.varNetworkInput.getCount();
            for (i = 0; i < count; i++) {
                var connection = this.varNetworkInput.getItem(i).getValue("type");
                if (connection === "bridge") {
                    disableBridge = false;
                }
            }
            var node = this.varSelectedServer.getValue("dataValue");
            var serviceName = node + "javaNodeNetwork";
            var networking = this[serviceName].getValue("dataValue");
            var network = JSON.parse(networking).action.result;
            if (network.virtualnet.networks.length === 0) {
                disableBridge = false;
                this.editNetworkDialog.setHeight(340);
                this.panelVmNetworkWarning.setShowing(true);
            }

            if (action.search("add") > -1) {
                this.editNetworkDialog.setTitle("Add network interface");
                this.editMac.setDataValue("auto");
                this.selectNetworkType.setDisplayValue("");
                this.selectBridge.setDisplayValue("");
            } else {
                this.editNetworkDialog.setTitle("Update network interface");
                this.selectNetworkType.setDisplayValue("");

                var index = this.gridVmNetworks.getSelectedIndex();
                var data = this.gridVmNetworks.getRow(index);
                var status = data.status;
                var source = data.source.replace(/<\/B>/g, "");
                var portgroup = data.portgroup.replace(/<\/B>/g, "");
                var driver = data.model.replace(/<\/B>/g, "");
                var mac = data.mac.replace(/<\/B>/g, "");
                var type = data.type.replace(/<\/B>/g, "");
                if (data.connected === "yes") {
                    this.checkLinkStatus.setChecked(true);
                } else {
                    this.checkLinkStatus.setChecked(false);
                }


                if (status.indexOf("network-add.png") > -1) {
                    source = source.replace(/<B>/g, "");
                    portgroup = portgroup.replace(/<B>/g, "");
                    driver = driver.replace(/<B>/g, "");
                    mac = mac.replace(/<B>/g, "");
                    this.varNetworkCaller.setValue("dataValue", "add");
                    this.varNetworkInput.removeItem(index);
                } else if (status.indexOf("network-update.png") > -1) {
                    var array1 = [];
                    var array2 = [];
                    var oldSource = "";
                    var oldPortgroup = "";
                    var oldDriver = "";
                    var oldMac = "";
                    var oldType = "";

                    if (source.indexOf("<B source=") > -1) {
                        array1 = source.split(";");
                        array2 = array1[0].split("=");
                        oldSource = array2[1].replace(/\"/g, "");
                        source = array1[1].replace(/.*>/g, "");
                    } else {
                        oldSource = source;
                    }
                    if (portgroup.indexOf("<B portgroup=") > -1) {
                        array1 = source.split(";");
                        array2 = array1[0].split("=");
                        oldPortgroup = array2[1].replace(/\"/g, "");
                        portgroup = array1[1].replace(/.*>/g, "");
                    } else {
                        oldPortgroup = portgroup;
                    }
                    if (driver.indexOf("<B model=") > -1) {
                        array1 = driver.split(";");
                        array2 = array1[0].split("=");
                        oldDriver = array2[1].replace(/\"/g, "");
                        driver = array1[1].replace(/.*>/g, "");
                    } else {
                        oldDriver = driver;
                    }
                    if (mac.indexOf("<B mac=") > -1) {
                        array1 = mac.split(";");
                        array2 = array1[0].split("=");
                        oldMac = array2[1].replace(/\"/g, "");
                        mac = array1[1].replace(/.*>/g, "");
                    } else {
                        oldMac = mac;
                    }
                    if (type.indexOf("<B type=") > -1) {
                        array1 = type.split(";");
                        array2 = array1[0].split("=");
                        oldType = array2[1].replace(/\"/g, "");
                        type = array1[1].replace(/.*>/g, "");
                    } else {
                        oldType = type;
                    }

                }
                this.selectNetworkType.setDataValue(type);
                // Use a Timeout to set "selectBridge" because of selectNetworkType
                // onCHange function.
                setTimeout(function() {
                    try {
                        wm.Page.getPage("Main").setSelectBridgeDisplay(source, portgroup);
                    } catch (e) {
                        alert(e);
                    }
                }, 300);

                this.selectNetDevice.setDataValue(driver);
                this.editMac.setDisplayValue(mac);
            }
        } catch (e) {
            this.showToastError("editNetworkDialogShow Error: " + e.toString());
            console.error('ERROR IN editNetworkDialogShow: ' + e);
        }
    },
    setSelectBridgeDisplay: function(source, portgroup) {
        try {
            var network_data = this.varNetworkInterfaces.getData();
            var displayed = source;
            for (var j = 0; j < network_data.length; j++) {
                if ((network_data[j].name === source) && (network_data[j].portgroup === portgroup)) {
                    displayed = network_data[j].display;
                }
            }
            this.selectBridge.setDisplayValue(displayed);

        } catch (e) {
            this.showToastError("setSelectBridgeDisplay Error: " + e.toString());
            console.error('ERROR IN setSelectBridgeDisplay: ' + e);
        }
    },
    newNetworkCancelClick: function(inSender) {
        try {
            this.editNetworkDialog.hide();
            this.editNetworkDialog.setHeight(300);
            this.panelVmNetworkWarning.setShowing(false);

        } catch (e) {
            console.error('ERROR IN newNetworkCancelClick: ' + e);
        }
    },
    newVmNetworkBtnClick: function(inSender) {
        try {
            this.varNetworkCaller.setValue("dataValue", "add");
            this.editMac.setReadonly(false);
            this.initEditNetworkDialog();
            this.editNetworkDialog.show();

        } catch (e) {
            console.error('ERROR IN addNetworkBtnClick: ' + e);
        }
    },
    updateVmNetworkBtnClick: function(inSender) {
        try {
            this.varNetworkCaller.setValue("dataValue", "modify");
            this.editMac.setReadonly(true);
            this.initEditNetworkDialog();
            this.editNetworkDialog.show();

        } catch (e) {
            this.showToastError("modifyNetworkBtnClick Error: " + e.toString());
            console.error('ERROR IN modifyNetworkBtnClick: ' + e);
        }
    },
    gridVmNetworksCellDblClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        try {
            this.varNetworkCaller.setValue("dataValue", "modify");
            this.editMac.setReadonly(true);
            this.initEditNetworkDialog();
            this.editNetworkDialog.show();

        } catch (e) {
            console.error('ERROR IN gridVmNetworksCellDblClick: ' + e);
        }
    },
    gridVmNetworksCellEdited: function(inSender, inValue, rowId, fieldId) {
        try {
            if (fieldId === "link") {
                var selectedData = this.gridVmNetworks.getRow(rowId);
                var status = selectedData.status;
                if ((status.indexOf("network-add.png") < 0) && (status.indexOf("network-update.png") < 0) && (status.indexOf("network-remove.png") < 0)) {
                    this.updateNetworkLink(inValue, rowId);
                } else {
                    var value = true;
                    if (inValue) {
                        value = false;
                    }
                    this.gridVmNetworks.setCell(rowId, fieldId, value, true);
                }
            }


        } catch (e) {
            console.error('ERROR IN gridVmNetworksCellEdited: ' + e);
        }
    },
    removeVmNetworkBtnClick: function(inSender) {
        try {
            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";

            var index = this.gridVmNetworks.getSelectedIndex();
            var data = this.gridVmNetworks.getRow(index);
            var source = data.source;
            var driver = data.model;
            var mac = data.mac;
            var type = data.type;
            var opt = data.options;
            var icon = data.status;
            var connected = data.connected;
            var portgroup = data.portgroup;

            if (icon.indexOf("network-add.png") > -1) {
                this.varNetworkInput.removeItem(index);
            } else if (icon.indexOf("network-card.png") > -1) {
                //icon = '<image title="network"; style="height: 30px;" src="resources/images/icons/hardware/network-remove.png"/>';
                icon = "resources/images/icons/hardware/network-remove.png";
                var1 = {
                    "source": "<B>" + source + "</B>",
                    "portgroup": "<B>" + portgroup + "</B>",
                    "model": "<B>" + driver + "</B>",
                    "mac": "<B>" + mac + "</B>",
                    "type": "<B>" + type + "</B>",
                    "option": "<B>" + "opt" + "</B>",
                    "connected": "<B>" + connected + "</B>",
                    "status": icon
                };

                this.varNetworkInput.setItem(index, var1);
            } else if (icon.indexOf("network-update.png") > -1) {
                app.toastDialog.showToast("You cannot remove a device set to be updated", 3000, "Warning", "cc", "Invalid operation");
            }
            this.gridVmNetworks.reflow();
        } catch (e) {
            this.showToastError("deleteNetworkBtnClick Error: " + e.toString());
            console.error('ERROR IN deleteNetworkBtnClick: ' + e);
        }
    },
    selectBridgeChange: function(inSender) {
        try {
            var data = this.selectBridge.getDataValue();
            if (data !== undefined) {
                this.selectNetworkType.setDataValue(data.type);
            }
        } catch (e) {
            console.error('ERROR IN selectBridgeChange: ' + e);
        }
    },
    setVirtualNetworks: function(virtualNets) {
        try {
            this.varNetworkInterfaces.clearData();
            for (var j = 0; j < virtualNets.length; j++) {
                var virtName = virtualNets[j].name;
                var vBr = virtualNets[j].bridge;
                var vType = virtualNets[j].type;
                if (virtualNets[j].mode === "private") {
                    vType = "private";
                }

                if (!((vBr === 'openkvibr0') && (virtName === 'default'))) {
                    if (virtualNets[j].active === 1) {
                        if (virtualNets[j].portgroups.length === 0) {
                            this.varNetworkInterfaces.addItem({
                                'name': virtName,
                                'display': virtName,
                                'type': vType,
                                'target': vBr,
                                'portgroup': ''
                            });
                        } else {
                            for (var m = 0; m < virtualNets[j].portgroups.length; m++) {
                                var portgroup = virtualNets[j].portgroups[m];
                                if ((portgroup.is_default === "yes") && (portgroup.name === "")) {
                                    this.varNetworkInterfaces.addItem({
                                        'name': virtName,
                                        'display': virtName,
                                        'type': vType,
                                        'target': vBr,
                                        'portgroup': ''
                                    });
                                } else if (portgroup.name !== "") {
                                    this.varNetworkInterfaces.addItem({
                                        'name': virtName,
                                        'display': virtName + " ➤ " + portgroup.name,
                                        'type': vType,
                                        'target': vBr,
                                        'portgroup': portgroup.name
                                    });
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error('ERROR IN setVirtualNetworks: ' + e);
            this.showToastError("setVirtualNetworks Error: " + e.toString());
        }
    },
    newNetworkSaveClick: function(inSender) {
        try {
            //this.editNetworkDialog.setHeight(300);
            //this.panelVmNetworkWarning.setShowing(false);
            this.enableVmConfigSave();


            var data = this.selectBridge.getDataValue();
            var varSwitch = data.name;
            var varPortgroup = data.portgroup;
            var varType = this.selectNetworkType.getDisplayValue();
            var varDevice = this.selectNetDevice.getDataValue();
            var varMac = this.editMac.getDataValue();

            var varConnected = "";
            if (this.checkLinkStatus.getChecked()) {
                varConnected = "yes";
            } else {
                varConnected = "no";
            }
            //var varType = this.selectNetworkType.getDataValue();
            var icon = "";
            var var1 = {};
            var link = true;

            if (this.varNetworkCaller.getValue("dataValue") === "add") {
                //icon = '<image title="network"; style="height: 30px;" src="resources/images/icons/hardware/network-add.png"/>';
                icon = "resources/images/icons/hardware/network-add.png";
                if (varConnected === "yes") {
                    link = true;
                } else {
                    link = false;
                }

                var1 = {
                    "source": "<B>" + varSwitch + "</B>",
                    "portgroup": "<B>" + varPortgroup + "</B>",
                    "model": "<B>" + varDevice + "</B>",
                    "mac": "<B>" + varMac + "</B>",
                    "type": "<B>" + varType + "</B>",
                    "option": "",
                    "connected": varConnected,
                    "link": link,
                    "status": icon
                };

                this.varNetworkInput.addItem(var1);
                this._vmConfigHotswapable = "no";
            } else {
                var index = this.gridVmNetworks.getSelectedIndex();
                var selectedData = this.gridVmNetworks.getRow(index);
                var modSwitch = "";
                var modModel = "";
                var modMac = "";
                var modType = "";

                var oldSource = selectedData.source.replace(/<\/B>/g, "");
                var oldPortgroup = selectedData.portgroup.replace(/<\/B>/g, "");
                var oldmodel = selectedData.model.replace(/<\/B>/g, "");
                var oldMac = selectedData.mac.replace(/<\/B>/g, "");
                var oldType = selectedData.type.replace(/<\/B>/g, "");
                var oldConnected = selectedData.connected;
                var oldLink = selectedData.link;
                icon = selectedData.status;

                if (oldSource.indexOf("<B source=") > -1) {
                    array1 = oldSource.split(";");
                    array2 = array1[0].split("=");
                    oldSource = array2[1].replace(/\"/g, "");
                }
                if (oldPortgroup.indexOf("<B portgroup=") > -1) {
                    array1 = oldPortgroup.split(";");
                    array2 = array1[0].split("=");
                    oldPortgroup = array2[1].replace(/\"/g, "");
                }
                if (oldmodel.indexOf("<B model=") > -1) {
                    array1 = oldmodel.split(";");
                    array2 = array1[0].split("=");
                    oldmodel = array2[1].replace(/\"/g, "");
                }
                if (oldMac.indexOf("<B mac=") > -1) {
                    array1 = oldMac.split(";");
                    array2 = array1[0].split("=");
                    oldMac = array2[1].replace(/\"/g, "");
                }
                if (oldType.indexOf("<B type=") > -1) {
                    array1 = oldType.split(";");
                    array2 = array1[0].split("=");
                    oldType = array2[1].replace(/\"/g, "");
                }

                var modified = false;

                if (oldSource !== varSwitch) {
                    modSwitch = '<B source="' + oldSource + '";>' + varSwitch + '</B>';
                    modified = true;
                } else {
                    modSwitch = varSwitch;
                }
                if (oldPortgroup !== varPortgroup) {
                    modPortgroup = '<B portgroup="' + oldPortgroup + '";>' + varPortgroup + '</B>';
                    modified = true;
                } else {
                    modPortgroup = varPortgroup;
                }
                if (oldmodel !== varDevice) {
                    modModel = '<B model="' + oldmodel + '";>' + varDevice + '</B>';
                    this._vmConfigHotswapable = "no";
                    modified = true;
                } else {
                    modModel = varDevice;
                }
                if (oldMac !== varMac) {
                    modMac = '<B mac="' + oldMac + '";>' + varMac + '</B>';
                    modified = true;
                } else {
                    modMac = varMac;
                }
                if (oldType !== varType) {
                    modType = '<B type="' + oldType + '";>' + varType + '</B>';
                    if ((oldType === "Private Bridge") && (varType === "OpenVswitch")) {
                        this._vmConfigHotswapable = "yes";
                    } else if ((varType === "Private Bridge") && (oldType === "OpenVswitch")) {
                        this._vmConfigHotswapable = "yes";
                    } else {
                        this._vmConfigHotswapable = "no";
                    }
                    modified = true;
                } else {
                    modType = varType;
                }

                if (varType === "Bridge") {
                    this._vmConfigHotswapable = "no";
                }
                if (this._vmConfigHotswapable === "") {
                    this._vmConfigHotswapable = "yes";
                }
                if (oldConnected !== varConnected) {
                    modified = true;
                }
                if (modified) {
                    icon = "resources/images/icons/hardware/network-update.png";
                } else {
                    this.vmConfigSave.setDisabled(true);
                }

                var vmInfos = this.varSelectedVm.getValue("dataValue");
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];
                var varVmStatus = "Status" + vName + "__" + node;
                var vmStatus = this[varVmStatus].getValue("dataValue");

                if (vmStatus === "Stopped") {
                    if (varConnected === "yes") {
                        link = true;
                    } else {
                        link = false;
                    }
                } else {
                    link = oldLink;
                }


                var1 = {
                    "source": modSwitch,
                    "portgroup": modPortgroup,
                    "model": modModel,
                    "mac": modMac,
                    "type": modType,
                    "option": this._vmConfigHotswapable,
                    "connected": varConnected,
                    "link": link,
                    "status": icon
                };

                this.varNetworkInput.setItem(index, var1);
            }

            this.editNetworkDialog.hide();
            this.gridVmNetworks.reflow();
        } catch (e) {
            this.showToastError("netSaveBtnClick Error: " + e.toString());
            console.error('ERROR IN netSaveBtnClick: ' + e);
        }
    },
    selectVideoModelChange: function(inSender) {
        try {
            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";


        } catch (e) {
            console.error('ERROR IN selectVideoModelChange: ' + e);
        }
    },
    vramNumberChange: function(inSender) {
        try {
            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";

        } catch (e) {
            console.error('ERROR IN vramNumberChange: ' + e);
        }
    },
    newVmGraphicBtnClick: function(inSender) {
        try {
            this.selectGraphicType.setReadonly(false);
            this.vmGraphicDialog.setTitle("New graphic interface");
            this.selectGraphicType.setDisplayValue("VNC");
            this.textGraphicPort.setDisplayValue("autoport");
            this.textGraphicAddress.setDisplayValue("0.0.0.0");
            this.vmGraphicDialog.show();

        } catch (e) {
            this.showToastError("newVmGraphicBtnClick Error: " + e.toString());
            console.error('ERROR IN newVmGraphicBtnClick: ' + e);
        }
    },
    updateVmGraphicBtnClick: function(inSender) {
        try {
            this.selectGraphicType.setReadonly(true);

            var index = this.gridGraphics.getSelectedIndex();
            var data = this.gridGraphics.getRow(index);
            var dialogTitle = "Update graphic interface";


            if (data.icon.indexOf("-add.png") > -1) {
                data.type = data.type.replace(/<\/B>/g, "");
                data.type = data.type.replace(/<B>/g, "");
                data.keymap = data.keymap.replace(/<\/B>/g, "");
                data.keymap = data.keymap.replace(/<B>/g, "");
                data.listen = data.listen.replace(/<\/B>/g, "");
                data.listen = data.listen.replace(/<B>/g, "");
                data.port = data.port.replace(/<\/B>/g, "");
                data.port = data.port.replace(/<B>/g, "");
                data.autoport = data.autoport.replace(/<\/B>/g, "");
                data.autoport = data.autoport.replace(/<B>/g, "");
                this.varGraphicList.removeItem(index);
                dialogTitle = "New graphic interface";
            }
            if (data.icon.indexOf("-update.png") > -1) {
                app.toastDialog.showToast("Cannot update a component set to be updated", 10000, "Warning", "cc", "This operation is not allowed");
                return;
            } else if (data.icon.indexOf("-remove.png") > -1) {
                app.toastDialog.showToast("Cannot update a component set to be removed", 10000, "Warning", "cc", "This operation is not allowed");
                return;
            }


            this.selectGraphicType.setDataValue(data.type);
            this.selectGraphicKeymap.setDataValue(data.keymap);


            if (data.type === "vnc") {

                this.textGraphicAddress.setDisplayValue(data.listen);
                if (data.autoport === "yes") {
                    this.textGraphicPort.setDataValue("autoport");
                } else {
                    this.textGraphicPort.setDataValue(data.port);
                }
            } else if (data.type === "sdl") {
                this.textGraphicDisplay.setDataValue(data.listen);
            }

            this.vmGraphicDialog.setTitle(dialogTitle);
            this.vmGraphicDialog.show();

        } catch (e) {
            this.showToastError("updateVmGraphicBtnClick Error: " + e.toString());
            console.error('ERROR IN updateVmGraphicBtnClick: ' + e);
        }
    },
    removeVmGraphicBtnClick: function(inSender) {
        try {
            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";

            var index = this.gridGraphics.getSelectedIndex();
            var data = this.gridGraphics.getRow(index);
            var heads = 0;

            if (data.icon.indexOf("-add.png") > -1) {
                for (var i = 0; i < this.varVmConfigUpdate.getCount(); i++) {
                    actionItem = this.varVmConfigUpdate.getItem(i);
                    if (actionItem.index === index) {
                        this.varVmConfigUpdate.removeItem(i);
                    }
                }
                this.varGraphicList.removeItem(index);
                heads = this.headNumber.getDataValue();
                heads = heads - 1;
                if (heads < 0) {
                    heads = 1;
                }
                this.headNumber.setDataValue(heads);
                return;
            }
            if (data.icon.indexOf("-update.png") > -1) {
                app.toastDialog.showToast("Cannot Remove a component set to be updated", 10000, "Warning", "cc", "This operation is not allowed");
                return;
            } else if (data.icon.indexOf("-remove.png") > -1) {
                app.toastDialog.showToast("Component is already set to be removed", 10000, "Warning", "cc", "This operation is not allowed");
                return;
            }

            var jsonItem = {
                "type": data.type,
                "keymap": data.keymap,
                "listen": data.listen,
                "autoport": data.autoport,
                "port": data.port
            };
            var item = JSON.stringify(jsonItem);
            var oldItem = "";
            this.varVmConfigUpdate.addItem({
                "action": "remove",
                "index": index,
                "type": "graphic",
                "item": item,
                "olditem": oldItem
            });

            if (data.type === "vnc") {
                icon = '<image style="height: 30px;" src="resources/images/icons/hardware/vnc-remove.png" align="center"/>';
                //icon = "resources/images/icons/hardware/vnc-remove.png";
            } else if (data.type === "sdl") {
                icon = '<image style="height: 30px;" src="resources/images/icons/hardware/sdl-remove.png" align="center"/>';
                //icon = "resources/images/icons/hardware/sdl-remove.png";
            }
            tmpvar = {
                "icon": icon,
                "type": "<B>" + data.type + "</B>",
                "keymap": "<B>" + data.keymap + "</B>",
                "listen": "<B>" + data.listen + "</B>",
                "port": "<B>" + data.port + "</B>",
                "autoport": "<B>" + data.autoport + "</B>"
            };
            this.varGraphicList.setItem(index, tmpvar);
            this.gridGraphics.reflow();
        } catch (e) {
            console.error('ERROR IN removeVmGraphicBtnClick: ' + e);
        }
    },
    vmGraphicBtnSaveClick: function(inSender) {
        try {
            var action = "";
            var item = "";
            var oldItem = "";
            var type = "graphic";
            var listen = "";
            var port = "";
            var graphicType = this.selectGraphicType.getDataValue();
            var keymap = this.selectGraphicKeymap.getDataValue();
            var icon = "";
            var tmpvar = {};
            var autoport = "";
            var index = 0;

            if (graphicType === "vnc") {
                listen = this.textGraphicAddress.getDisplayValue();
                port = this.textGraphicPort.getDisplayValue();
                if (port === "autoport") {
                    autoport = "yes";
                    port = "-1";
                } else {
                    autoport = "no";
                }
            } else if (graphicType === "sdl") {
                listen = this.textGraphicDisplay.getDataValue();
            }
            index = this.gridGraphics.getRowCount() + 1;
            jsonItem = {
                "type": graphicType,
                "keymap": keymap,
                "listen": listen,
                "autoport": autoport,
                "port": port
            };
            item = JSON.stringify(jsonItem);

            if (this.vmGraphicDialog.title === "New graphic interface") {
                action = "add";
                if (graphicType === "vnc") {
                    icon = '<image style="height: 30px;" src="resources/images/icons/hardware/vnc-add.png" align="center"/>';
                    //icon = "resources/images/icons/hardware/vnc-add.png";
                } else if (graphicType === "sdl") {
                    icon = '<image style="height: 30px;" src="resources/images/icons/hardware/sdl-add.png" align="center"/>';
                    //icon = "resources/images/icons/hardware/sdl-add.png";
                }

                tmpvar = {
                    "icon": icon,
                    "type": "<B>" + graphicType + "</B>",
                    "keymap": "<B>" + keymap + "</B>",
                    "listen": "<B>" + listen + "</B>",
                    "port": "<B>" + port + "</B>",
                    "autoport": "<B>" + autoport + "</B>"
                };
                this.varGraphicList.addItem(tmpvar);
                var heads = this.headNumber.getDataValue();
                heads += 1;
                this.headNumber.setDataValue(heads);

            } else {
                action = "update";
                index = this.gridGraphics.getSelectedIndex();
                var data = this.gridGraphics.getRow(index);
                jsonOldItem = {
                    "type": data.type,
                    "keymap": data.keymap,
                    "listen": data.listen,
                    "autoport": data.autoport,
                    "port": data.port
                };
                oldItem = JSON.stringify(jsonOldItem);
                if (graphicType === "vnc") {
                    icon = '<image style="height: 30px;" src="resources/images/icons/hardware/vnc-update.png" align="center"/>';
                    //icon = "resources/images/icons/hardware/vnc-update.png";
                } else if (graphicType === "sdl") {
                    icon = '<image style="height: 30px;" src="resources/images/icons/hardware/sdl-update.png" align="center"/>';
                    //icon = "resources/images/icons/hardware/sdl-update.png";
                }

                tmpvar = {
                    "icon": icon,
                    "type": "<B>" + graphicType + "</B>",
                    "keymap": "<B>" + keymap + "</B>",
                    "listen": "<B>" + listen + "</B>",
                    "port": "<B>" + port + "</B>",
                    "autoport": "<B>" + autoport + "</B>"
                };
                this.varGraphicList.setItem(index, tmpvar);


            }
            this.varVmConfigUpdate.addItem({
                "action": action,
                "index": index,
                "type": type,
                "item": item,
                "olditem": oldItem
            });

            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";
            this.vmGraphicDialog.hide();
            this.gridGraphics.reflow();
        } catch (e) {
            this.showToastError("vmGraphicBtnSaveClick Error: " + e.toString());
            console.error('ERROR IN vmGraphicBtnSaveClick: ' + e);
        }
    },
    selectGraphicTypeChange: function(inSender) {
        try {
            var type = this.selectGraphicType.getDataValue();
            if (type === "sdl") {
                this.textGraphicDisplay.setRequired(true);
                this.textGraphicDisplay.setShowing(true);
                this.textGraphicPort.setShowing(false);
                this.textGraphicPort.setRequired(false);
                this.textGraphicAddress.setShowing(false);
                this.textGraphicAddress.setRequired(false);
            } else {
                this.textGraphicPort.setShowing(true);
                this.textGraphicPort.setRequired(true);
                this.textGraphicAddress.setShowing(true);
                this.textGraphicAddress.setRequired(true);
                this.textGraphicDisplay.setRequired(false);
                this.textGraphicDisplay.setShowing(false);
            }

        } catch (e) {
            console.error('ERROR IN selectGraphicTypeChange: ' + e);
        }
    },
    ////////// end network editing /////////////////////////////////////////////////////
    ///// Server delete process  /////////////////////////////////////////////////// 
    tableserversDeleteButtonClick: function(inSender) {
        try {
            var index = this.tableserversDojoGrid.getSelectedIndex();
            var data = this.tableserversDojoGrid.getRow(index);
            var node = data.name;
            this._nodeToRemove = node;
            this.showConfirmDialog("This will delete " + node + ".", "removeNode", true);

        } catch (e) {
            this.showToastError("tableserversDeleteButtonClick ERROR: " + e.toString());
            console.error('ERROR IN tableserversDeleteButtonClick: ' + e);
        }
    },
    labelServerDeleteClick: function(inSender, inEvent) {
        try {
            var node = this.varSelectedServer.getValue("dataValue");
            this._nodeToRemove = node;
            this.showConfirmDialog("This will delete " + node + ".", "removeNode", true);
            this.serverPopup.hide();

        } catch (e) {
            this.showToastError("labelDeleteServerClick ERROR: " + e.toString());
            console.error('ERROR IN labelDeleteServerClick: ' + e);
        }
    },
    deleteNodeClick: function(inSender) {
        try {
            var node = this.selectNode.getDataValue();
            this._nodeToRemove = node;
            this.showConfirmDialog("This will delete " + node + ".", "removeNode", true);
            this.selectNodeToDel.hide();
        } catch (e) {
            console.error('ERROR IN deleteNodeClick: ' + e);
        }
    },
    removeNode: function(inSender) {
        try {
            var node = this._nodeToRemove;
            this.addLog("Remove node", node, node, 0);
            this.javaDeleteServer.input.setValue("name", node);
            this.javaDeleteServer.update();
            if (node === this.varSelectedServer.getValue("dataValue")) {
                this.labelDatacenterClick();
            }
            this._nodeToRemove = "";
        } catch (e) {
            this.showToastError("removeNode ERROR: " + e.toString());
            console.error('ERROR IN removeNode: ' + e);
        }
    },
/*
    serverInfoLiveVarResult: function(inSender) {
        try {
            this.idEditor.setDataValue(this.serverInfoLiveVar.getValue("id"));
            this.nameEditor.setDataValue(this.serverInfoLiveVar.getValue("name"));
            this.descEditor.setDataValue(this.serverInfoLiveVar.getValue("description"));
            this.selectHypervisor.setDataValue(this.serverInfoLiveVar.getValue("Hypervisor"));
            this.ipEditor.setDataValue(this.serverInfoLiveVar.getValue("ip"));
            this.tableserversLiveForm1.deleteData();

        } catch (e) {
            this.showToastError("serverInfoLiveVarResult ERROR: " + e.toString());
            console.error('ERROR IN serverInfoLiveVarResult: ' + e);
        }
    },
    */
    delVMbyServerResult: function(inSender, inDeprecated) {
        try {
            this.updateVmDatabaseHooks();

        } catch (e) {
            console.error('ERROR IN delVMbyServerResult: ' + e);
        }
    },
    ///// end server delete process  ////////////////////////////////////////////////
    ///// start VM delete process   /////////////////////////////////////////////////
    onDataCenterDeleteVmClick: function(inSender) {
        try {
            var index = this.tablevmsDojoGrid.getSelectedIndex();
            var data = this.tablevmsDojoGrid.getRow(index);
            var vName = data.name;
            var node = data.server;
            var label = data.displayedname;
            var vmPanel = "panelVm" + vName + "__" + node;
            if (this[vmPanel] === undefined) {
                this.javaRemoveVm.input.setValue("node", node);
                this.javaRemoveVm.input.setValue("vm", vName);
                this.javaRemoveVm.update();
                this.addLog("Remove from inventory", vName, node, 5000);
            } else {
                this.varSelectedVm.setValue("dataValue", vName + "__" + node);
                this.deleteVm(vName, label, node);
            }
        } catch (e) {
            this.showToastError("onDataCenterDeleteVmClick ERROR: " + e.toString());
            console.error('ERROR IN onDataCenterDeleteVmClick: ' + e);
        }
    },
    labelVmDeleteClick: function(inSender, inEvent) {
        try {
            if (this.labelVmDelete.disabled !== true) {
                var vmInfos = this.varSelectedVm.getValue("dataValue");
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];
                var label = this.getVmDisplayedName(vName, node);
                //var varServer = vName + "Server" + vmInfos;
                //var node = this[varServer].getValue("dataValue");
                this.VmPopupMenu.hide();
                this.deleteVm(vName, label, node);
            }
        } catch (e) {
            console.error('ERROR IN labelVmDeleteClick: ' + e);
        }
    },
    vmDeleteButtonClick: function(inSender) {
        try {
            var index = this.GridVmList.getSelectedIndex();
            var data = this.GridVmList.getRow(index);
            var vName = data.name;
            var node = data.server;
            var label = data.displayedname;
            var vmPanel = "panelVm" + vName + "__" + node;
            if (this[vmPanel] === undefined) {
                this.javaRemoveVm.input.setValue("node", node);
                this.javaRemoveVm.input.setValue("vm", vName);
                this.javaRemoveVm.update();
                this.addLog("Remove from inventory", vName, node, 5000);
            } else {
                this.varSelectedVm.setValue("dataValue", vName + "__" + node);
                this.deleteVm(vName, label, node);
            }
        } catch (e) {
            this.showToastError("vmDeleteButtonClick ERROR: " + e.toString());
            console.error('ERROR IN vmDeleteButtonClick: ' + e);
        }
    },
    deleteVm: function(vm, label, node) {
        try {
            this._vmToDelete = vm;
            this._vmToDeleteNode = node;
            var msg = "This will delete <b>" + vm + "</b>.";
            if ((label !== "") && (label !== vm)) {
                msg = "This will delete " + vm + " alias <b>" + label + "</b>.";
            }
            this.showConfirmDialog(msg, "deleteVirtualMachine", true);
        } catch (e) {
            this.showToastError("deleteVm ERROR: " + e.toString());
            console.error('ERROR IN deleteVm: ' + e);
        }
    },
    labelVmRemoveFromInventoryClick: function(inSender, inEvent) {
        try {
            if (this.labelVmRemoveFromInventory.disabled !== true) {
                var vmInfos = this.varSelectedVm.getValue("dataValue");
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];
                var label = this.getVmDisplayedName(vName, node);
                var msg = "This will remove <b>" + vName + "</b> from inventory.";
                if ((label !== "") && (label !== vName)) {
                    msg = "This will remove " + vName + ", alias <b>" + label + "</b>, from inventory.";
                }
                this.showConfirmDialog(msg, "removeVmFromInventory", true);
                this.VmPopupMenu.hide();
            }
        } catch (e) {
            console.error('ERROR IN labelVmRemoveFromInventoryClick: ' + e);
        }
    },
    labelDisabledlVmDeleteClick: function(inSender, inEvent) {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            var label = this.getVmDisplayedName(vName, node);
            var msg = "This will remove <b>" + vName + "</b> from inventory.";
            if ((label !== "") && (label !== vName)) {
                msg = "This will remove " + vName + ", alias <b>" + label + "</b>, from inventory.";
            }
            this.showConfirmDialog(msg, "removeVmFromInventory", true);
            this.VmPopupMenuRemove.hide();
        } catch (e) {
            console.error('ERROR IN labelDisabledlVmDeleteClick: ' + e);
        }
    },
    removeVmFromInventory: function() {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            //var node = this[varServer].getValue("dataValue");
            this.javaRemoveVm.input.setValue("node", node);
            this.javaRemoveVm.input.setValue("vm", vName);
            this.javaRemoveVm.update();
            this.addLog("Remove from inventory", vName, node, 5000);
        } catch (e) {
            console.error('ERROR IN labelDisabledlVmDeleteClick: ' + e);
        }
    },

    tablevmsDojoGridSelectionChange: function(inSender) {
        try {

            var index = this.tablevmsDojoGrid.getSelectedIndex();
            var data = this.tablevmsDojoGrid.getRow(index);
            var vName = data.name;
            var node = data.server;
            this.getVmInfos(vName, node);


        } catch (e) {
            this.showToastError("tablevmsDojoGridSelectionChange ERROR: " + e.toString());
            console.error('ERROR IN tablevmsDojoGridSelectionChange: ' + e);
        }
    },
    GridVmListSelectionChange: function(inSender) {
        try {
            var index = this.GridVmList.getSelectedIndex();
            if (index !== -1) {
                var data = this.GridVmList.getRow(index);
                var vName = data.name;
                var node = data.server;
                this.getVmInfos(vName, node);
            }

        } catch (e) {
            this.showToastError("GridVmListSelectionChange ERROR: " + e.toString());
            console.error('ERROR IN GridVmListSelectionChange: ' + e);
        }
    },
    ///// end VM delete process    
    newStorageSaveBtnClick: function(inSender) {
        try {
            if (this.liveForm1.saveDataIfValid()) {
                this.newStorage.hide();
            }

        } catch (e) {
            this.showToastError("newStorageSaveBtnClick ERROR: " + e.toString());
            console.error('ERROR IN newStorageSaveBtnClick: ' + e);
        }
    },
    javaServerReadXmlSuccess: function(inSender, inDeprecated) {
        try {
            var result = this.javaServerReadXml.getValue("dataValue");
            this.logDebugServer("Node info:" + result);

            var jsonVar = JSON.parse(result);

            this.varServerXmlData.clearData();
            this.logDebugDataCenter("Node xml:" + result);
            if (jsonVar !== null) {
                var count = jsonVar.storages.length;
                for (var i = 0; i < count; i++) {
                    var storagePath = jsonVar.storages[i].target;
                    if (storagePath[storagePath.length - 1] !== "/") {
                        storagePath += "/";
                        jsonVar.storages[i].target = storagePath;
                    }
                }
                this.varServerXmlData.setData(jsonVar);
            }

        } catch (e) {
            this.showToastError("javaServerReadXmlSuccess ERROR: " + e.toString());
            console.error('ERROR IN javaServerReadXmlSuccess: ' + e);
        }
    },

    TabServersConfigShow: function(inSender) {
        try {
            var node = this.varSelectedServer.getValue("dataValue");
            this.getNodeInformation(node, false);
            this.labelServerConfigStorageClick(inSender, null);
            this.labelConfigVirtualNetworksClick(inSender);

        } catch (e) {
            this.showToastError("TabServersConfigShow ERROR: " + e.toString());
            console.error('ERROR IN TabServersConfigShow: ' + e);
        }
    },
    makeVmListNetworks: function(node) {
        try {
            if (node === undefined) {
                node = this.varSelectedServer.getValue("dataValue");
            }
            this.javaGetAllVmsNetworks.input.setValue("node", node);
            this._waitForAllVmsNics = true;
            this.javaGetAllVmsNetworks.update();

        } catch (e) {
            this.showToastError("makeVmListNetworks ERROR: " + e.toString());
            console.error('ERROR IN makeVmListNetworks: ' + e);
        }
    },
    getNodeInformation: function(node, force) {
        try {
            // Set a cookie that will expire after 1 minute
            // so that if node information is not older than 1 minute 
            // there is no need to get it again.
            var gotNodeInfoCookie = dojo.cookie("openkvi_" + node + "_nodeinformation");
            if ((gotNodeInfoCookie === undefined) || (force === true)) {
                if (this.tablevmsDialog1.showing) {
                    this.panelNewVmHardware.setDisabled(true);
                }
                dojo.cookie("openkvi_" + node + "_nodeinformation", "set", {
                    expires: 0.0007
                });
                this.getNodeConfig(node);
                var javaNodeNetwork = node + "javaNodeNetwork";
                this[javaNodeNetwork].input.setValue("node", node);
                this[javaNodeNetwork].input.setValue("force", true);
                this[javaNodeNetwork].update();
                var javaNodeCapa = node + "nodeCapa";
                this[javaNodeCapa].input.setValue("node", node);
                this[javaNodeCapa].update();
                this.panelNodeNetworkConfig.reflow();
                this.loadingNodeNetworkConf.setShowing(true);
                this.loadingNodeNetworkConf2.setShowing(true);
            }
        } catch (e) {
            console.error('ERROR IN getNodeInformation: ' + e);
            this.showToastError("getNodeInformation ERROR: " + e.toString());
        }
    },
    getNodeConfig: function(node) {
        try {
            this.javaServerReadXml.input.setValue("server", node);
            this.javaServerReadXml.update();
        } catch (e) {
            console.error('ERROR IN getNodeConfig: ' + e);
        }

    },
    javaGetAllVmsNetworksResult: function(inSender, inDeprecated) {
        try {
            var InterfacesData = this.javaGetAllVmsNetworks.getValue("dataValue");
            this.logDebugServer("javaGetAllVmsNetworksResult:" + InterfacesData);
            this._waitForAllVmsNics = false;
        } catch (e) {
            console.error('ERROR IN javaGetAllVmsNetworksResult: ' + e);
        }
    },
    ////// node info /////////////////////////////////////////////////////////
    javaGetNodeHardwareInfoResult: function(inSender, inDeprecated) {
        try {
            var serviceName = inSender.name.toString();
            var result = this[serviceName].getValue("dataValue");
            var jsonInfo = JSON.parse(result);
            var node = jsonInfo.node;
            var varWait = "PictServerWait" + node;
            this[varWait].setShowing(false);
            var varPictVMListWait = "PictVMListWait" + node;
            this[varPictVMListWait].setShowing(false);
            this.logDebugDataCenter(node + " hardware infos: " + result);

            if (result.indexOf("Failed: timeout") > -1) {
                this.setNodeUnreachable(node, "Node temporarily unreachable \nPlease try to reconnect.");
            } else {
                this._nodesData[node].system = jsonInfo.action.result.system;
                this._nodesData[node].hardware = jsonInfo.action.result.sysinfo;

                var varConnected = node + "connected";
                this[varConnected].setValue("dataValue", true);

                this.textCpuAch.setDataValue(this._nodesData[node].system.arch);
                var totCores = this._nodesData[node].system.cores * this._nodesData[node].system.nodes * this._nodesData[node].system.sockets;
                this.textCoreNumber.setDataValue(totCores);
                this.textFrequency.setDataValue(this._nodesData[node].system.mhz + " MHz");
                this.varNodeMemory.setValue("dataValue", this._nodesData[node].system.memory);

                var rounded = Math.round(this._nodesData[node].system.mhz / 10) / 100;
                var GhzCpu = totCores + " x " + rounded.toFixed(2) + " GHz";
                this.labelTotalCpu.setCaption(GhzCpu);


                var cpu = {};
                cpu.sockets = this._nodesData[node].system.sockets;
                cpu.nodes = this._nodesData[node].system.nodes;
                cpu.cores = this._nodesData[node].system.cores;
                cpu.hyperthreading = "0";
                cpu.total_cores = totCores;
                var memory = {};
                memory.mb = this._nodesData[node].system.memory;
                memory.gb = (Math.round(this._nodesData[node].system.memory / 1024 * 100) / 100);

                this.labelMemoryUsage.setCaption("<progress max='100' value='0'></progress>");
                this.labelUsedMemory.setCaption("");
                this.labelTotalMemory.setCaption("");
                this.labelNodeFreeMem.setCaption("");
                this.labelTitleCpuUsage.setCaption("");
                this.labelCpuUsage.setCaption("<progress max='100' value='0'></progress>");

                this.varStorageCapacity.clearData();
                this.gridStoragesUsage.reflow();

                if (this._nodesData[node].system.threads === 1) {
                    this.textHyperthreading.setDataValue("No");
                } else {
                    var totThreads = totCores * this._nodesData[node].system.threads;
                    this.textHyperthreading.setDataValue("yes [ " + totThreads + " Threads ]");
                }

                this.nodeManufacturer.setDataValue(this._nodesData[node].hardware.manufacturer);
                this.nodeProductSerial.setDataValue(this._nodesData[node].hardware.serial);
                str = "<div>" + this._nodesData[node].hardware.product + "</div>";
                str += "<div>Version : " + this._nodesData[node].hardware.version + "</div>";

                this.nodeProduct.setDataValue(str);
                var javaNodeRessources = node + "nodeRessourcesInfo";
                this[javaNodeRessources].input.setValue("node", node);
                this[javaNodeRessources].update();

            }
            var varVms = node + "VmCreated";
            var created = this[varVms].getValue("dataValue");
            if (created === true) {
                var varPictWait = "PictServerWait" + node;
                this[varPictWait].setShowing(false);
                this[varPictVMListWait].setShowing(false);
            }


        } catch (e) {
            this.showToastError("ERROR IN javaGetNodeHardwareInfoResult: " + e.toString());
            console.error('ERROR IN javaGetNodeHardwareInfoResult: ' + e);
        }
    },
    javaGetNodeRessourcesInfoResult: function(inSender, inDeprecated) {
        try {
            var serviceName = inSender.name.toString();
            var result = this[serviceName].getValue("dataValue");
            this.logDebugDataCenter("javaGetNodeRessourcesInfoResult:" + result);
            var jsonInfo = JSON.parse(result);
            var node = jsonInfo.node;
            var selected = this.varSelectedServer.getValue("dataValue");
            this._nodesData[node].ressources = jsonInfo.action.result;

            if (selected === node) {
                if (result.indexOf("Failed: timeout") === -1) {
                    var nodeStorages = jsonInfo.action.result.storages;
                    var storageList = [];
                    for (var k = 0; k < nodeStorages.length; k++) {
                        var storageType = nodeStorages[k].type;
                        if (storageType === "dir") {
                            storageType = "Local Directory";
                        }
                        var repo = {
                            "name": nodeStorages[k].name,
                            "type": storageType,
                            "target": nodeStorages[k].path,
                            "source": nodeStorages[k].source,
                            "capacity": nodeStorages[k].capacity,
                            "allocation": nodeStorages[k].allocation,
                            "available": nodeStorages[k].available
                        };
                        storageList.push(repo);
                    }
                    var oldStorageData = JSON.stringify(this.varStorages.getData());
                    if (oldStorageData !== storageList) {
                        this.varStorages.setData(storageList);
                    }

                    if ((this.TabServersOverview.isActive()) && (this.layerServer.isActive())) {
                        var oldCpu = this.labelTitleCpuUsage.caption;
                        var oldMem = this.labelUsedMemory.caption;
                        var count = this.gridStoragesUsage.getRowCount();
                        var oldStorages = "";
                        for (var i = 0; i < count; i++) {
                            oldStorages += this.gridStoragesUsage.getCell(i, "used");
                        }

                        var varConnected = node + "connected";
                        this[varConnected].setValue("dataValue", true);
                        var freeMem = jsonInfo.action.result.memory.free;
                        var totalMem = jsonInfo.action.result.memory.total;
                        this.displayNodeMemory(freeMem, totalMem);
                        this.displayNodeCpu(jsonInfo.action.result.cpu);
                        this.displayNodeStorages(nodeStorages);

                        var newCpu = this.labelTitleCpuUsage.caption;
                        var newMem = this.labelUsedMemory.caption;
                        count = this.gridStoragesUsage.getRowCount();
                        var newStorages = "";
                        for (var j = 0; j < count; j++) {
                            newStorages += this.gridStoragesUsage.getCell(j, "used");
                        }
                        // Wait 5 minutes to query node ressources
                        var timeout = 300000;
                        if ((oldCpu !== newCpu) || (oldMem !== newMem) || (oldStorages !== newStorages)) {
                            // Wait 30 seconds to query node ressources
                            timeout = 30000;
                        }
                        setTimeout(function() {
                            try {
                                var javaNodeRessources = node + "nodeRessourcesInfo";
                                wm.Page.getPage("Main")[javaNodeRessources].input.setValue("node", node);
                                wm.Page.getPage("Main")[javaNodeRessources].update();
                            } catch (e) {
                                alert(e);
                            }
                        }, timeout);
                    }
                    this.loadingNodeRessources.setShowing(false);
                } else {
                    this.setNodeUnreachable(node, "Node temporarily unreachable \nPlease try to reconnect.");
                }
            }
        } catch (e) {
            this.showToastError("ERROR IN javaGetNodeRessourcesInfoResult: " + e.toString());
            console.error('ERROR IN javaGetNodeRessourcesInfoResult: ' + e);
        }
    },
    displayNodeMemory: function(freeMem, totalMem) {
        try {
            var perceentUsedMem = (totalMem - freeMem) / totalMem * 100;
            var total = (Math.round(totalMem / 1024 * 10)) / 10;
            var totalStr = "";
            var freeStr = "";
            var usedStr = "";
            var usedMem = totalMem - freeMem;
            if (total < 4) {
                totalStr = totalMem + " MB";
                freeStr = freeMem + " MB";
                usedStr = usedMem + " MB";
            } else {
                totalStr = total + " GB";
                usedStr = (Math.round(usedMem / 1024 * 10)) / 10 + " GB";
                freeStr = (Math.round(freeMem / 1024 * 10)) / 10 + " GB";
            }
            //var str = '<meter min=0 max="100" value="'+usedMem+'">"'+usedMem+'"</meter>';
            var str = '<progress max="100" value="' + perceentUsedMem + '"></progress>';
            this.labelMemoryUsage.setCaption(str);
            this.labelUsedMemory.setCaption(usedStr);
            this.labelTotalMemory.setCaption(totalStr);
            this.labelNodeFreeMem.setCaption("<i>Free: " + freeStr + "</i>");

        } catch (e) {
            this.showToastError("ERROR IN displayNodeMemory: " + e.toString());
            console.error('ERROR IN displayNodeMemory: ' + e);
        }
    },
    displayNodeCpu: function(usedCpu) {
        try {
            str = '<progress max="100" value="' + usedCpu + '"></progress>';
            this.labelTitleCpuUsage.setCaption(usedCpu + "%");
            this.labelCpuUsage.setCaption(str);
        } catch (e) {
            this.showToastError("ERROR IN displayNodeCpu: " + e.toString());
            console.error('ERROR IN displayNodeCpu: ' + e);
        }
    },
    displayNodeStorages: function(storages) {
        try {
            var count = storages.length;
            this.varStorageCapacity.clearData();
            var height = 30 + (count * 24);
            this.gridStoragesUsage.setHeight(height + "px");

            for (var i = 0; i < count; i++) {
                var s_alloc = storages[i].allocation;
                var s_avail = storages[i].available;
                var s_tot = storages[i].capacity;
                var i_alloc = parseInt(s_alloc, 10);
                var i_tot = parseInt(s_tot, 10);
                var i_percent = Math.floor(i_alloc / i_tot * 100);
                var percent = i_percent.toString();
                var img = '';
                var type = storages[i].type.toUpperCase();
                if (storages[i].type === "dir") {
                    type = "Local directory";
                }
                var tmpStr = "   Type: " + type + "\n   Path: " + storages[i].path + "     ";
                var tip = '';
                if (i_percent < 70) {
                    img = "resources/images/icons/dialog-ok-apply.png";
                    tip = "You have enougth Free Space. \n";
                } else if (i_percent > 90) {
                    img = "resources/images/icons/dialog-error-16.png";
                    tip = "Free Space is alarmingly low ! \n";
                } else {
                    img = "resources/images/icons/dialog-warning-16.png";
                    tip = "Be carefull, Free Space is low. \n";
                }
                var moreInfo = '<image style="height: 16px;" src="' + img + '" title="' + tip + tmpStr + '"/>';
                var repo = {
                    "name": storages[i].name,
                    "size": s_tot,
                    "available": s_avail,
                    "used": s_alloc,
                    "info": moreInfo
                };
                this.varStorageCapacity.addItem(repo);
            }
            this.gridStoragesUsage.reflow();

        } catch (e) {
            this.showToastError("ERROR IN displayNodeStorages: " + e.toString());
            console.error('ERROR IN displayNodeStorages: ' + e);
        }
    },
    javaGetServerNetworkInfoResult: function(inSender, inDeprecated) {
        try {
            this.loadingNodeNetworkConf.setShowing(false);
            this.btnReloadNodeConfig.setDisabled(false);

            var serviceName = inSender.name.toString();
            var result = this[serviceName].getValue("dataValue");
            // Set force to false by default
            this[serviceName].input.setValue("force", false);
            this.logDebugServer(serviceName + " network infos is: " + result);
            var jsonRes = JSON.parse(result);
            this.makeVmListNetworks(jsonRes.node);
            var network = jsonRes.action.result;

            var output = "";
            var params = "";
            var inetList = "";
            var name = "";
            var type = "";
            var physCount = network.physicals.ifaces.length;
            var str = "";
            for (var i = 0; i < physCount; i++) {
                var state = "";
                if (network.physicals.ifaces[i].name.indexOf("usb") !== 0) {
                    var eth = network.physicals.ifaces[i].name;
                    if (network.physicals.ifaces[i].state === "up") {
                        eth_state = '<font color = "green" title="Network Interface is UP"><b>' + eth + '</b></font>';
                    } else {
                        eth_state = '<font color = "red" title="Network Interface is DOWN"><b>' + eth + '</b></font>';
                    }

                    var speed = network.physicals.ifaces[i].speed;
                    var duplex = network.physicals.ifaces[i].duplex;

                    more_info = '';
                    if (speed !== "unknown") {
                        more_info = speed;
                    }
                    if (duplex !== "unknown") {
                        if (more_info === '') {
                            more_info = duplex;
                        } else {
                            more_info += ', ' + duplex;
                        }
                    }
                    if (more_info !== '') {
                        if (more_info === '-1') {
                            more_info = "Unplugged";
                        }
                        finale_info = '<small>[' + more_info + ']</small>';
                    }

                    var vendor = network.physicals.ifaces[i].info;
                    var sriov_support = "SR-IOV Support : <b>No</b>";
                    if (network.physicals.ifaces[i].sriov !== "0") {
                        sriov_support = "SR-IOV Support : <b>" + network.physicals.ifaces[i].sriov + " Virtual Functions</b>";
                    }
                    str += "<p>" + eth_state + "  " + finale_info + " : <br>" + sriov_support + "<br>" + vendor + "</p>";
                }
            }
            this.networkInterfacesTextArea.setDataValue(str);

            this.setVirtualNetworks(network.virtualnet.networks);

            if (this.layerServerNetwork.isActive() && this.TabServersConfig.isActive()) {
                this.labelServerNetworkingClick(undefined, undefined);

            } else {
                this.TabServersOverview.reflow();
            }


        } catch (e) {
            this.showToastError("ERROR IN javaGetServerNetworkInfoResult: " + e.toString());
            console.error('ERROR IN javaGetServerNetworkInfoResult: ' + e);
        }
    },
    javaGetCapabilitiesResult: function(inSender, inDeprecated) {
        try {

            var serviceName = inSender.name.toString();
            var result = this[serviceName].getValue("dataValue");
            this.logDebugDataCenter(serviceName + ":" + result);

            var node = serviceName.replace(/nodeCapa/, "");
            if (result.indexOf("Error:") > -1) {
                var infos = result.split("::");
                node = infos[0];
                this.setNodeUnreachable(node, "Node temporarily unreachable \nPlease try to reconnect.");
            } else {
                var type = "";
                var emulator = "";
                var arch = "";
                var domcount = 0;
                var archList = "<br><U>Supported architectures:</U></br>";
                var varVirt = node + "virt";
                var jsonCapa = JSON.parse(result);
                var count = jsonCapa.capabilities.guest.length;
                this.varArch.clearData();

                for (var i = 0; i < count; i++) {
                    arch = jsonCapa.capabilities.guest[i].arch.name;
                    domcount = jsonCapa.capabilities.guest[i].arch.domain.length;
                    if (domcount === undefined) {
                        type = jsonCapa.capabilities.guest[i].arch.domain.type;
                        if (type === this[varVirt].getValue("dataValue")) {
                            emulator = jsonCapa.capabilities.guest[i].arch.emulator;
                            archList += "<br><dd>" + arch + ", emulator:" + emulator + "</br>";
                            this.varArch.addItem({
                                name: arch,
                                dataValue: emulator
                            });
                        }
                    } else {
                        for (var j = 0; j < domcount; j++) {
                            type = jsonCapa.capabilities.guest[i].arch.domain[j].type;
                            if (type === this[varVirt].getValue("dataValue")) {
                                emulator = jsonCapa.capabilities.guest[i].arch.domain[j].emulator;
                                archList += "<br><dd>" + arch + ", emulator:" + emulator + "</br>";
                                this.varArch.addItem({
                                    name: arch,
                                    dataValue: emulator
                                });
                            }
                        }
                    }
                }
                this.varKeymaps.clearData();
                var keymaps = jsonCapa.keymaps.split(",");
                var keyCount = keymaps.length;
                for (var k = 0; k < keyCount; k++) {
                    akey = keymaps[k];
                    this.varKeymaps.addItem({
                        name: akey,
                        dataValue: akey
                    });
                }
                this.textServerInfo.setDataValue(archList);
                if (this.panelNewVmHardware.disabled) {
                    this.panelNewVmHardware.setDisabled(false);
                }
            }
        } catch (e) {
            this.showToastError("ERROR IN javaGetCapabilitiesResult: " + e.toString());
            console.error('ERROR IN javaGetCapabilitiesResult: ' + e);
        }
    },
    ////// End virsh info /////////////////////////////////////////////////////////    
    ////// Server configuaration /////////////////////////////////////////////////////////
    updateNodeInfos: function(sender, data) {
        try {
            var json = this.javaServerReadXml.getValue("dataValue");
            this.logDebugServer("before node update:" + json);
            var nodeInfos = JSON.parse(json);

            var coordinates = {};
            var storageList = [];
            var networks = [];


            if (sender === "coordinates") {
                coordinates = data;
            } else {
                coordinates = nodeInfos.coordinates;
            }
            if (sender === "storages") {
                storageList = data;
            } else {
                storageList = nodeInfos.storages;
            }
            if (sender === "networks") {
                networks = data;
            } else {
                networks = nodeInfos.networks;
            }

            var desc = "";
            if (nodeInfos.description !== undefined) {
                desc = nodeInfos.description;
            }


            var newJson = {
                "name": nodeInfos.name,
                "password": "",
                "ip": nodeInfos.ip,
                "hypervisor": nodeInfos.hypervisor,
                "description": desc,
                "networks": networks,
                "vmconfigs": nodeInfos.vmconfigs,
                "storages": storageList,
                "coordinates": coordinates,
                "transport": "ssh"
            };



            var jsonString = JSON.stringify(newJson);
            this.logDebugServer("node updated:" + jsonString);

            this.addLog("Update " + sender, nodeInfos.name, nodeInfos.name, 0);

            this.javaUpdateServerConfig.input.setValue("jsonString", jsonString);
            this.javaUpdateServerConfig.input.setValue("log", "Update " + sender);
            this.javaUpdateServerConfig.input.setValue("server", nodeInfos.name);
            this.javaUpdateServerConfig.update();


        } catch (e) {
            this.showToastError("ERROR IN updateNodeInfos: " + e.toString());
            console.error('ERROR IN updateNodeInfos: ' + e);
        }
    },
    setServerConfSelected: function(panel, layer) {
        try {
            this[layer].activate();

            this.panelServerStorages.domNode.style.backgroundColor = "#ffffff";
            this.panelServerSnmp.domNode.style.backgroundColor = "#ffffff";
            this.panelServerNetworking.domNode.style.backgroundColor = "#ffffff";
            this.panelServerCapabilities.domNode.style.backgroundColor = "#ffffff";
            this.panelServerNtp.domNode.style.backgroundColor = "#ffffff";
            //this[panel].domNode.style.backgroundColor = "#dfd8d8";
            this[panel].domNode.style.backgroundColor = "#c8c8c8";

        } catch (e) {
            this.showToastError("ERROR IN setServerConfSelected: " + e.toString());
            console.error('ERROR IN setServerConfSelected: ' + e);
        }
    },

    labelServerCoordinatesClick: function(inSender, inEvent) {
        try {
            this.setServerConfSelected("panelServerCoordinates", "layerServerCoordinates");

        } catch (e) {
            this.showToastError("ERROR IN labelServerCoordinatesClick: " + e.toString());
            console.error('ERROR IN labelServerCoordinatesClick: ' + e);
        }
    },
    labelServerSnmpClick: function(inSender, inEvent) {
        try {
            this.loadingSnmpConfig.show();
            this.setServerConfSelected("panelServerSnmp", "layerServerSnmp");
            var node = this.varSelectedServer.getValue("dataValue");
            this.javaGetNodeSnmpConfiguration.input.setValue("node", node);
            this.javaGetNodeSnmpConfiguration.update();

            this.pictureWarningSnmpService.setShowing(false);
            this.pictureWarningSnmpAutostart.setShowing(false);
            this.pictureWarningSnmpAgent.setShowing(false);
            this.labelSnmpServiceState.setCaption("<i>stopped</i>");
            this.labelSnmpAutoStart.setCaption("<i>off</i>");
            this.labelHardwareAgentAutoStart.setCaption("<i>off</i>");
            this.labelSnmpServer.setCaption("<i>unknown</i>");
            this.labelHardwareAgentName.setCaption("<i>unknown</i>");
            this.labelHardwareAgentVersion.setCaption("<i>unknown</i>");
            this.labelHardwareAgentStatus.setCaption("<i>unknown</i>");

            this.panelSnmpWarning.setShowing(false);
            this.labelSnmpWarning.setCaption("");
            this.panelHardwareAgentWarning.setShowing(false);
            this.panelHardwareAgentInfo.setShowing(false);
            this.labelHardwareAgentWarning.setCaption("");
            this.snmpConfigBtn.setDisabled(false);
            this.hardwareAgentConfigBtn.setDisabled(false);
        } catch (e) {
            console.error('ERROR IN labelServerSnmpClick: ' + e);
        }
    },
    javaGetNodeSnmpConfigurationResult: function(inSender, inDeprecated) {
        try {
            this.loadingSnmpConfig.hide();
            var result = this.javaGetNodeSnmpConfiguration.getValue("dataValue");
            var snmpConfig = JSON.parse(result).action.result;
            var service_state = "";
            var autostart = "";

            if (snmpConfig.service === "running") {
                service_state = '<font color="green"><b>running</b></font>';
            } else {
                service_state = '<font color="res"><b>' + snmpConfig.service + '</b></font>';
            }
            if (snmpConfig.autostart === "on") {
                autostart = '<font color="green"><b>on</b></font>';
            } else {
                autostart = '<font color="res"><b>' + snmpConfig.autostart + '</b></font>';
            }
            this.labelSnmpServiceState.setCaption(service_state);
            this.labelSnmpAutoStart.setCaption(autostart);
            this.labelSnmpServer.setCaption(snmpConfig.server);

            if (snmpConfig.agent.service === "running") {
                service_state = '<font color="green"><b>running</b></font>';
            } else {
                service_state = '<font color="res"><b>' + snmpConfig.agent.service + '</b></font>';
            }
            if (snmpConfig.agent.autostart === "on") {
                autostart = '<font color="green"><b>on</b></font>';
            } else {
                autostart = '<font color="res"><b>' + snmpConfig.agent.autostart + '</b></font>';
            }

            this.labelHardwareAgentName.setCaption(snmpConfig.agent.name);
            this.labelHardwareAgentStatus.setCaption(service_state);
            this.labelHardwareAgentAutoStart.setCaption(autostart);

            if (snmpConfig.service === "unrecognized service") {
                this.labelSnmpWarning.setCaption("The package <strong>net-snmp</strong> is not installed.</br>Please update your KVM server to the latest <strong>NetOS6</strong> version.");
                this.panelSnmpWarning.setShowing(true);
                this.snmpConfigBtn.setDisabled(true);
            }
            if (snmpConfig.agent.version.indexOf("not installed") > -1) {
                var version = '<font color="res"><b>not installed</b></font>';
                this.labelHardwareAgentVersion.setCaption(version);
                this.labelHardwareAgentWarning.setCaption("The package <strong>" + snmpConfig.agent.name + "</strong> is not installed.</br>Please update your KVM server to the latest <strong>NetOS6</strong> version.");
                this.panelHardwareAgentWarning.setShowing(true);
                this.hardwareAgentConfigBtn.setDisabled(true);
                this.panelHardwareAgentInfo.setShowing(false);
            } else {
                this.labelHardwareAgentVersion.setCaption(snmpConfig.agent.version);
                this.panelHardwareAgentInfo.setShowing(true);
            }

        } catch (e) {
            this.showToastError("ERROR IN javaGetNodeSnmpConfigurationResult: " + e.toString());
            console.error('ERROR IN javaGetNodeSnmpConfigurationResult: ' + e);
        }
    },
    snmpConfigBtnClick: function(inSender) {
        try {
            if (this.labelSnmpAutoStart.caption.indexOf("on") > -1) {
                this.checkSnmpStartAtBoot.setChecked(true);
            } else {
                this.checkSnmpStartAtBoot.setChecked(false);
            }
            if (this.labelSnmpServiceState.caption.indexOf("running") > -1) {
                this.checkSnmpProcessNow.setChecked(true);
            } else {
                this.checkSnmpProcessNow.setChecked(false);
            }
            this.textSnmpServer.setDataValue(this.labelSnmpServer.caption);
            this.configureSnmpDialog.show();

        } catch (e) {
            this.showToastError("ERROR IN CoordinatesApplyBtnClick: " + e.toString());
            console.error('ERROR IN CoordinatesApplyBtnClick: ' + e);
        }
    },
    cancelSnmpConfigClick: function(inSender) {
        try {
            this.checkSnmpStartAtBoot.setChecked(false);
            this.checkSnmpProcessNow.setChecked(false);
            this.textSnmpServer.setDataValue("");
            this.configureSnmpDialog.hide();

        } catch (e) {
            console.error('ERROR IN cancelSnmpConfigClick: ' + e);
        }
    },
    applySnmpConfigClick: function(inSender) {
        try {
            var data = {
                'autostart': this.checkSnmpStartAtBoot.getChecked(),
                'run': this.checkSnmpProcessNow.getChecked(),
                'server': this.textSnmpServer.getDataValue()
            };
            var node = this.varSelectedServer.getValue("dataValue");
            this.javaSetNodeSnmpConfiguration.input.setValue("node", node);
            this.javaSetNodeSnmpConfiguration.input.setValue("data", data);
            this.javaSetNodeSnmpConfiguration.update();

            this.addLog("Hardware events", "configure snmp", node, 0);

            this.cancelSnmpConfigClick();
            this.loadingSnmpConfig.show();
        } catch (e) {
            console.error('ERROR IN applySnmpConfigClick: ' + e);
        }
    },
    javaSetNodeSnmpConfigurationResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaSetNodeSnmpConfiguration.getValue("dataValue");
            var snmpRes = JSON.parse(result);
            if (snmpRes.action.result.indexOf("Error:") > -1) {
                app.toastDialog.showToast(snmpRes.action.result, 5000, "Warning", "cc", "SNMP configuration error");
            }

            var node = this.varSelectedServer.getValue("dataValue");
            this.javaGetNodeSnmpConfiguration.input.setValue("node", node);
            this.javaGetNodeSnmpConfiguration.update();
            this.updateLog("Hardware events", "configure snmp", node, snmpRes.action.result);
        } catch (e) {
            console.error('ERROR IN javaSetNodeSnmpConfigurationResult: ' + e);
        }
    },

    hardwareAgentConfigBtnClick: function(inSender) {
        try {
            if (this.labelHardwareAgentAutoStart.caption.indexOf("on") > -1) {
                this.checkHardwareAgentStartAtBoot.setChecked(true);
            } else {
                this.checkHardwareAgentStartAtBoot.setChecked(false);
            }
            if (this.labelHardwareAgentStatus.caption.indexOf("running") > -1) {
                this.checkHardwareAgentProcessNow.setChecked(true);
            } else {
                this.checkHardwareAgentProcessNow.setChecked(false);
            }
            this.configureHardwareAgentDialog.show();
        } catch (e) {
            console.error('ERROR IN hardwareAgentConfigBtnClick: ' + e);
        }
    },
    applyHardwareAgentConfigClick: function(inSender) {
        try {
            var data = {
                'autostart': this.checkHardwareAgentStartAtBoot.getChecked(),
                'run': this.checkHardwareAgentProcessNow.getChecked()
            };
            var node = this.varSelectedServer.getValue("dataValue");
            this.javaSetNodeIpmiConfiguration.input.setValue("node", node);
            this.javaSetNodeIpmiConfiguration.input.setValue("data", data);
            this.javaSetNodeIpmiConfiguration.update();
            this.addLog("Hardware events", "configure agent", node, 0);
            this.cancelHardwareAgentConfigClick();
            this.loadingSnmpConfig.show();

        } catch (e) {
            console.error('ERROR IN applyHardwareAgentConfigClick: ' + e);
        }
    },
    cancelHardwareAgentConfigClick: function(inSender) {
        try {
            this.checkHardwareAgentStartAtBoot.setChecked(false);
            this.checkHardwareAgentProcessNow.setChecked(false);
            this.configureHardwareAgentDialog.hide();
        } catch (e) {
            console.error('ERROR IN cancelHardwareAgentConfigClick: ' + e);
        }
    },
    javaSetNodeIpmiConfigurationResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaSetNodeIpmiConfiguration.getValue("dataValue");
            var ipmiRes = JSON.parse(result);
            if (ipmiRes.action.result.indexOf("Error:") > -1) {
                app.toastDialog.showToast(ipmiRes.action.result, 5000, "Warning", "cc", "Hardware Agent configuration error");
            }

            var node = this.varSelectedServer.getValue("dataValue");
            this.javaGetNodeSnmpConfiguration.input.setValue("node", node);
            this.javaGetNodeSnmpConfiguration.update();
            this.updateLog("Hardware events", "configure agent", node, ipmiRes.action.result);
        } catch (e) {
            console.error('ERROR IN javaSetNodeIpmiConfigurationResult: ' + e);
        }
    },

    labelServerCapaClick: function(inSender, inEvent) {
        try {
            this.setServerConfSelected("panelServerCapabilities", "layerServerCapabilities");
        } catch (e) {
            this.showToastError("ERROR IN labelServerCapaClick: " + e.toString());
            console.error('ERROR IN labelServerCoordinatesClick: ' + e);
        }
    },
    labelServerNtpClick: function(inSender, inEvent) {
        try {
            var node = this.varSelectedServer.getValue("dataValue");
            this.javaGetNodeTimeConfiguration.input.setValue("node", node);
            this.javaGetNodeTimeConfiguration.update();
            // init panel
            this.labelDateAndTime.setCaption("");
            this.labelNodeTimezone.setCaption("");
            this.labelNtpDaemonState.setCaption("");
            this.pictureWarningNtpService.setShowing(false);
            this.pictureWarningNtpAutostart.setShowing(false);
            this.labelNtpAutoStart.setCaption("");
            this.varNtpServerList.clearData();
            this.btnEditGeneralNtp.setDisabled(true);
            if (this.panelNtpMisc.showing === true) {
                this.pictShowNtpAvanced.setSource("resources/images/icons/arrow-hide.png");
                this.panelNtpMisc.setShowing(false);
                this.pictShowNtpAvanced.setHint("Show");
            }

            this.setServerConfSelected("panelServerNtp", "layerServerNtp");

        } catch (e) {
            console.error('ERROR IN labelServerNtpClick: ' + e);
            this.showToastError("ERROR IN labelServerNtpClick: " + e.toString());
        }
    },
    layerServerNtpShow: function(inSender) {
        try {
            this.loadingNodeTimeConfig.show();

        } catch (e) {
            console.error('ERROR IN layerServerNtpShow: ' + e);
        }
    },
    javaGetNodeTimeConfigurationResult: function(inSender, inDeprecated) {
        try {
            this.loadingNodeTimeConfig.hide();
            var result = this.javaGetNodeTimeConfiguration.getValue("dataValue");
            this.logDebugServer("time:" + result);
            var timeConfig = JSON.parse(result).action.result;
            this.labelDateAndTime.setCaption(timeConfig.date);
            this.labelNodeTimezone.setCaption(timeConfig.timezone.replace(/"/g, ''));
            this.labelNtpDaemonState.setCaption(timeConfig.ntpd);
            if (timeConfig.ntpd_autostart === "") {
                timeConfig.ntpd_autostart = "off";
            }
            this.labelNtpAutoStart.setCaption(timeConfig.ntpd_autostart);
            if ((timeConfig.ntpd_autostart === "on") && (timeConfig.ntpd === "stopped")) {
                this.pictureWarningNtpService.setShowing(true);
                this.pictureWarningNtpAutostart.setShowing(false);
            } else if ((timeConfig.ntpd_autostart !== "on") && (timeConfig.ntpd === "running")) {
                this.pictureWarningNtpService.setShowing(false);
                this.pictureWarningNtpAutostart.setShowing(true);
            } else {
                this.pictureWarningNtpService.setShowing(false);
                this.pictureWarningNtpAutostart.setShowing(false);
            }

            this.varNtpServerList.clearData();
            for (var i = 0; i < timeConfig.servers.length; i++) {
                this.varNtpServerList.addItem({
                    "name": timeConfig.servers[i],
                    "dataValue": timeConfig.servers[i]
                });
            }
            this.NtpOptionTextArea.clear();
            var otherStr = "";
            for (var j = 0; j < timeConfig.other.length; j++) {
                otherStr += timeConfig.other[j] + "\n";
            }
            this.btnEditGeneralNtp.setDisabled(false);
            this.NtpOptionTextArea.setDataValue(otherStr);


        } catch (e) {
            console.error('ERROR IN javaGetNodeTimeConfigurationResult: ' + e);
            this.showToastError("ERROR IN javaGetNodeTimeConfigurationResult: " + e.toString());
        }
    },
    pictShowNtpAvancedClick: function(inSender) {
        try {
            if (this.panelNtpMisc.showing === true) {
                this.pictShowNtpAvanced.setSource("resources/images/icons/arrow-hide.png");
                this.panelNtpMisc.setShowing(false);
                this.pictShowNtpAvanced.setHint("Show");
            } else {
                this.pictShowNtpAvanced.setSource("resources/images/icons/arrow-show.png");
                this.panelNtpMisc.setShowing(true);
                this.pictShowNtpAvanced.setHint("Hide");
            }

        } catch (e) {
            console.error('ERROR IN pictShowNtpAvancedClick: ' + e);
        }
    },
    btnCancelMiscNtpClick: function(inSender) {
        try {
            var timeConfig = JSON.parse(this.javaGetNodeTimeConfiguration.getValue("dataValue")).action.result;
            this.NtpOptionTextArea.clear();
            var otherStr = "";
            for (var j = 0; j < timeConfig.other.length; j++) {
                otherStr += timeConfig.other[j] + "\n";
            }
            this.NtpOptionTextArea.setDataValue(otherStr);

        } catch (e) {
            console.error('ERROR IN btnCancelMiscNtpClick: ' + e);
        }
    },
    labelServerConfigStorageClick: function(inSender, inEvent) {
        try {
            this.setServerConfSelected("panelServerStorages", "layerServerStorage");
        } catch (e) {
            this.showToastError("ERROR IN labelServerConfigStorageClick: " + e.toString());
            console.error('ERROR IN labelServerConfigStorageClick: ' + e);
        }
    },
    btnDefaultVmConfigStorageBrowseClick: function(inSender) {
        try {
            this.varBrowserCaller.setValue("name", "editRepoTarget");
            this.varBrowserCaller.setValue("dataValue", "folder");
            this.remoteFileBrowserDiag.setShowing(true);
        } catch (e) {
            this.showToastError("btnDefaultVmConfigStorageBrFowseClick: " + e.toString());
            console.error('ERROR IN btnDefaultVmConfigStorageBrowseClick: ' + e);
        }
    },
    labelConfigHostNetworksClick: function(inSender, inEvent) {
        try {
            this.layerHostNetworks.activate();
            this.labelConfigVirtualNetworks.domNode.style.backgroundColor = "#eeeeee";
            this.labelConfigHostNetworks.domNode.style.backgroundColor = "#e0e0e0";
            this.labelConfigHostNetworks.setBorder('1,2,0,1');
            this.labelConfigVirtualNetworks.setBorder('1,1,0,1');
            this.labelConfigVirtualNetworks.removeUserClass("wm_TextDecoration_Bold");
            this.labelConfigHostNetworks.addUserClass("wm_TextDecoration_Bold");
        } catch (e) {
            console.error('ERROR IN labelConfigHostNetworksClick: ' + e);
        }
    },
    labelConfigVirtualNetworksClick: function(inSender, inEvent) {
        try {
            this.layerVirtualNetworks.activate();
            this.labelConfigHostNetworks.domNode.style.backgroundColor = "#eeeeee";
            this.labelConfigVirtualNetworks.domNode.style.backgroundColor = "#e0e0e0";
            this.labelConfigVirtualNetworks.setBorder('1,2,0,1');
            this.labelConfigHostNetworks.setBorder('1,1,0,1');
            this.labelConfigVirtualNetworks.addUserClass("wm_TextDecoration_Bold");
            this.labelConfigHostNetworks.removeUserClass("wm_TextDecoration_Bold");
        } catch (e) {
            console.error('ERROR IN labelConfigVirtualNetworksClick: ' + e);
        }
    },
    btnReloadNodeConfigClick: function(inSender) {
        try {
            this.btnReloadNodeConfig.setDisabled(true);
            var node = this.varSelectedServer.getValue("dataValue");
            this.getNodeInformation(node, true);

        } catch (e) {
            console.error('ERROR IN btnReloadNodeConfigClick: ' + e);
            this.showToastError("btnReloadNodeConfigClick: " + e.toString());
        }
    },
    labelServerNetworkingClick: function(inSender, inEvent) {
        try {
            this.setServerConfSelected("panelServerNetworking", "layerServerNetwork");
            if (this._waitForAllVmsNics) {
                //Wait that node's network configuration has been retreived.              
                setTimeout(function() {
                    try {
                        wm.Page.getPage("Main").labelServerNetworkingClick(inSender, inEvent);
                    } catch (e) {
                        alert(e);
                    }
                }, 1000);

            } else {
                this.loadingNodeNetworkConf2.setShowing(false);
                var node = this.varSelectedServer.getValue("dataValue");
                var serviceName = node + "javaNodeNetwork";
                var networking = this[serviceName].getValue("dataValue");
                var jsonInfo = JSON.parse(networking);
                var network = jsonInfo.action.result;

                var physCount = network.physicals.ifaces.length;
                for (var i = 0; i < this.varHostNetworkDevices.getCount(); i++) {
                    var item = this.varHostNetworkDevices.getItem(i);
                    var remove = true;
                    for (var j = 0; j < physCount; j++) {
                        if ((item.getValue("name") === network.physicals.ifaces[j].name)) {
                            remove = false;
                        }
                    }
                    if (remove) {
                        var delPanel = item.getValue("name") + "NodePanel";
                        if (this[delPanel] !== undefined) {
                            this[delPanel].setShowing(false);
                        }
                    }

                }

                this.varHostNetworkDevices.clearData();
                var do_continue = true;
                var pos = 0;
                var ethNames = [];
                var ethInfos = [];
                for (i = 0; i < physCount; i++) {
                    var eth = network.physicals.ifaces[i].name;
                    var vendor = network.physicals.ifaces[i].desc;
                    var state = network.physicals.ifaces[i].state;
                    if (eth.indexOf("usb") !== 0) {
                        ethNames.push(eth);
                        ethInfos.push(state);
                        this.varHostNetworkDevices.addItem({
                            "name": eth,
                            "dataValue": state
                        });
                        var ethPanel = eth + "NodePanel";
                        if (this[ethPanel] !== undefined) {
                            var ethLabel = eth + "LabelNodePanel";
                            var ethPicture = eth + "pictureNodePanel";
                            var img = "";
                            if (state === "up") {
                                img = src = "resources/images/icons/hardware/network-card.png";
                                this[ethPanel].setDisabled(false);
                            } else {
                                img = src = "resources/images/icons/hardware/network-remove.png";
                                this[ethPanel].setDisabled(true);
                            }
                            this[ethLabel].setCaption(eth);
                            this[ethPicture].setSource(img);
                            this[ethPanel].setShowing(true);
                        }
                    }
                }
                var ethList = {
                    'names': ethNames,
                    'states': ethInfos
                };

                this.varHostNetworkDevices.addItem({
                    "name": "Local",
                    "dataValue": "up"
                });

                var brNameList = [];
                var vnicNames = [];
                var vnicInfos = [];
                var virtualNets = network.virtualnet.networks;
                var virtualNetsCount = virtualNets.length;
                for (i = 0; i < virtualNetsCount; i++) {
                    brNameList.push(virtualNets[i].name);
                    vnicNames.push(virtualNets[i].name);
                    vnicInfos.push(virtualNets[i].bridge);
                }
                virtualNets.sort(this.dynamicSort("name"));
                this.createVirtualNetworks(virtualNets);
                this.virtualNetNodePanel.reflow();
                var vnics = {
                    'names': vnicNames,
                    'bridges': vnicInfos
                };

                var bondNames = [];
                var bondInfos = [];
                var bondMods = [];

                for (i = 0; i < network.ovs.bonds.length; i++) {
                    bondNames.push(network.ovs.bonds[i].name);
                    bondMods.push(network.ovs.bonds[i].mode);
                    var bondEths = [];
                    for (var bid = 0; bid < network.ovs.bonds[i].ifaces.length; bid++) {
                        var bondEthName = network.ovs.bonds[i].ifaces[bid];
                        var bondEthid = ethList.names.indexOf(bondEthName);
                        bondEths.push({
                            'name': bondEthName,
                            'state': ethList.states[bondEthid]
                        });
                    }
                    bondInfos.push(bondEths);
                }
                var bonds = {
                    'names': bondNames,
                    'infos': bondInfos,
                    'modes': bondMods
                };

                var brList = [];
                var ovsBr = network.ovs.bridges;
                for (i = 0; i < ovsBr.length; i++) {
                    var ovsAccess = [];
                    if (brNameList.indexOf(ovsBr[i].name) === -1) {
                        var attachedvnics = [];
                        var vnicId = 100;
                        var searchStart = 0;
                        while (vnicId !== -1) {
                            vnicId = vnics.bridges.indexOf(ovsBr[i].name, searchStart);
                            if (vnicId !== -1) {
                                attachedvnics.push(vnics.names[vnicId]);
                                searchStart = vnicId + 1;
                            }
                        }

                        if (ovsBr[i].type === "public") {
                            var ports = ovsBr[i].ports;
                            for (var k = 0; k < ports.length; k++) {
                                if (bonds.names.indexOf(ports[k].name) > -1) {
                                    var bondid = bonds.names.indexOf(ports[k].name);
                                    ovsAccess.push({
                                        'name': ports[k].name,
                                        'type': 'bond',
                                        'mode': bonds.modes[bondid],
                                        'infos': bonds.infos[bondid]
                                    });
                                } else if (ethList.names.indexOf(ports[k].name) > -1) {
                                    var ethid = ethList.names.indexOf(ports[k].name);
                                    ovsAccess.push({
                                        'name': ports[k].name,
                                        'type': 'eth',
                                        'infos': ethList.states[ethid]
                                    });
                                }
                            }
                            brList.push({
                                "name": ovsBr[i].name,
                                "pub": "yes",
                                "type": "ovs",
                                "inet": ovsBr[i].inet,
                                "mngt": ovsBr[i].mngt,
                                "access": ovsAccess,
                                "attached": attachedvnics
                            });
                        } else {
                            brList.push({
                                "name": ovsBr[i].name,
                                "pub": "no",
                                "type": "ovs",
                                "inet": ovsBr[i].inet,
                                "mngt": ovsBr[i].mngt,
                                "attached": attachedvnics
                            });
                        }
                        brNameList.push(ovsBr[i].name);
                    }
                }
                brList.sort(this.dynamicSort("name"));
                
                var lbr = network.lbr.bridges;
                lbr.sort(this.dynamicSort("name"));
                for (i = 0; i < lbr.length; i++) {
                    if (brNameList.indexOf(lbr[i].name) === -1) {
                        brList.push({
                            "name": lbr[i].name,
                            "pub": "no",
                            "inet": "none",
                            "mngt": "no",
                            "type": "lbr",
                            "attached": []
                        });
                        brNameList.push(lbr[i].name);
                    }
                }
                
                this.varNetworkTargets.clearData();
                for (i = 0; i < brList.length; i++) {
                    if (brList[i].name !== "openkvibr0") {
                        if (brList[i].type === "ovs") {
                            brName = brList[i].name + " (OVS Bridge)";
                        } else if (brList[i].type === "lbr") {
                            brName = brList[i].name + " (Linux Bridge)";
                        } else {
                            brName = brList[i].name + " (" + brList[i].type + ")";
                        }
                        this.varNetworkTargets.addItem({
                            'name': brName,
                            'dataValue': brList[i].type
                        });
                    }
                }
                this.varNetworkTargets.addItem({
                    'name': 'Private network',
                    'dataValue': 'private'
                });
                data = {
                    "list": brList
                };
                this.createNetworkInterfaceComponents(data);

            }
        } catch (e) {
            this.showToastError("ERROR IN labelServerNetworkingClick: " + e.toString());
            console.error('ERROR IN labelServerNetworkingClick: ' + e);
        }
    },
    createNetworkInterfaceComponents: function(bridges) {
        try {
            var html = '<body>\n';
            for (var i = 0; i < bridges.list.length; i++) {
                brName = bridges.list[i].name;
                if (bridges.list[i].type === "ovs") {
                    brType = "OVS Bridge";
                } else if (bridges.list[i].type === "lbr") {
                    brType = "Linux Bridge";
                } else {
                    brType = bridges.list[i].type;
                }

                brPublic = bridges.list[i].pub;
                brActive = bridges.list[i].active;

                if (brPublic === "yes") {
                    html += '<div class="brGroup">';
                    html += '<div id="html_bridge_' + brName + '"  class="brPanel wm_BorderTopStyle_Curved8px wm_BorderBottomStyle_Curved8px wm_BorderShadow_WeakShadow" style="float: left;">';
                    html += '<div class="brDesc wm_BorderTopStyle_Curved8px" style=" background-color: DarkSlateBlue;" ><label><b>' + brName + '</b></label>';
                    if (bridges.list[i].mngt === "yes") {
                        //html += '<div ><label><font color="BlanchedAlmond">Management</font></label></div>';
                        html += '<div ><label>Management</label></div>';
                    }
                    if (bridges.list[i].inet !== "none") {
                        html += '<div ><label><small>' + bridges.list[i].inet + '</small></label></div>';
                    }
                    html += '<div><label><small><i>' + brType + '</i></small></label></div>';
                    html += '</div>';
                    for (var j = 0; j < bridges.list[i].attached.length; j++) {
                        var attachedBr = bridges.list[i].attached[j];
                        html += '<div class="brBody" ><label>' + attachedBr + '</label></div>';
                    }
                    html += '</div>';
                    html += '<div style="height:32px; width:27px; float:left; padding-top: 8px;">';
                    html += '<img title="External network access" style="height: 16px; width: 27px" src="resources/images/icons/server_config/exit-pipe.png" align="center">';
                    html += '</div>';
                    html += '<div class="brPanel wm_BorderTopStyle_Curved8px wm_BorderBottomStyle_Curved8px wm_BorderShadow_WeakShadow">';
                    for (j = 0; j < bridges.list[i].access.length; j++) {
                        ethName = bridges.list[i].access[j].name;
                        if (bridges.list[i].access[j].type === 'eth') {
                            html += '<div class="brBody" align="center" >';
                            if (bridges.list[i].access[j].infos === "up") {
                                html += '<image src="resources/images/icons/server_config/network-card-16.png" align="center"/>';
                            } else {
                                html += '<image src="resources/images/icons/server_config/network-remove-16.png" align="center"/>';
                            }
                            html += '<label>' + ethName + '</label></div>';
                        } else {
                            html += '<div class="brDesc wm_BorderTopStyle_Curved8px" style=" background-color: Teal;" ><label><b>' + ethName + '</b></label></div>';
                            html += '<div class="brBody"><label><i><font color="DarkSlateGray">' + bridges.list[i].access[j].mode + '</font></i></label></div>';
                            for (var l = 0; l < bridges.list[i].access[j].infos.length; l++) {
                                html += '<div class="brBody" align="center" >';
                                if (bridges.list[i].access[j].infos[l].state === "up") {
                                    html += '<image src="resources/images/icons/server_config/network-card-16.png" align="center"/>';
                                } else {
                                    html += '<image src="resources/images/icons/server_config/network-remove-16.png" align="center"/>';
                                }
                                var tmpeth = bridges.list[i].access[j].infos[l].name;
                                html += '<label>' + tmpeth + '</label></div>';
                            }
                        }
                        html += '</div>';
                    }
                    html += '</div>';
                    html += '</div>';
                } else {
                    html += '<div class="brGroup">';
                    html += '<div id="html_bridge_' + brName + '"  class="brPanel wm_BorderTopStyle_Curved8px wm_BorderBottomStyle_Curved8px wm_BorderShadow_WeakShadow">';
                    html += '<div class="brDesc wm_BorderTopStyle_Curved8px" style=" background-color: MidnightBlue;" ><label><b>' + brName + '</b></label>';
                    if (bridges.list[i].inet !== "none") {
                        html += '<div ><label><small>' + bridges.list[i].inet + '</small></label></div>';
                    }
                    html += '<div ><label><small><i>' + brType + '</i></small></label></div>';
                    html += '</div>';
                    for (var k = 0; k < bridges.list[i].attached.length; k++) {
                        html += '<div class="brBody" ><label>' + bridges.list[i].attached[k] + '</label></div>';
                    }
                    html += '</div>';
                    html += '</div>';
                }
            }

            var htmlHead = '<html><head>';
            htmlHead += '<style type="text/css">\n';
            htmlHead += 'div.brGroup {';
            htmlHead += ' margin-left: 30px;';
            htmlHead += ' margin-bottom: 30px;';
            htmlHead += ' height: auto;';
            htmlHead += ' width: auto;';
            htmlHead += ' float: left;}\n';

            htmlHead += 'div.brPanel {';
            htmlHead += ' margin: 0px;';
            htmlHead += ' padding-left: 0px;';
            htmlHead += ' padding-right: 0px;';
            htmlHead += ' padding-bottom: 5px;';
            htmlHead += ' padding-top: 0px;';
            htmlHead += ' border: 1px solid #999999;';
            //htmlHead += ' height: auto;';
            htmlHead += ' width: auto;';
            htmlHead += ' min-height: 24px;';
            htmlHead += ' float: left;';
            htmlHead += ' text-align: center;}\n';

            htmlHead += 'div.brTools {cursor: pointer;}\n';

            htmlHead += 'div.brPanel img {';
            htmlHead += ' display: inline;';
            htmlHead += ' margin-left: 5px;}\n';
            htmlHead += 'div.brPanel:hover {border: 1px solid #34345f;}\n';

            htmlHead += 'div.brDesc {';
            //htmlHead += ' background-color: #f1eec3;';
            //htmlHead += ' background-color: MidnightBlue;';
            htmlHead += ' border-bottom: 1px solid #b3b8c4;';
            htmlHead += ' margin: 1px;';
            //htmlHead += ' margin-bottom: 5px;';
            //htmlHead += ' margin-left: 1px;';
            //htmlHead += ' margin-right: 1px;';
            htmlHead += ' padding-bottom: 5px;';
            htmlHead += ' padding-top: 5px;';
            htmlHead += ' padding-bottom: 5px;}\n';
            htmlHead += 'div.brDesc label {';
            //htmlHead += ' color: LightGoldenRodYellow;';
            htmlHead += ' color: BlanchedAlmond;';
            htmlHead += ' text-align: center;';
            htmlHead += ' font-weight: normal;';
            htmlHead += ' padding-left: 20px;';
            htmlHead += ' padding-right: 20px;}\n';
            htmlHead += 'div.brDesc img {';
            htmlHead += ' cursor: pointer;';
            htmlHead += ' align: right;}\n';

            htmlHead += 'div.brBody {';
            htmlHead += ' padding-top: 5px;';
            htmlHead += ' padding-left: 10px;';
            htmlHead += ' padding-right: 20px;}\n';
            htmlHead += 'div.brBody label {';
            htmlHead += ' text-align: center;';
            htmlHead += ' font-weight: normal;';
            htmlHead += ' padding-left: 5px;';
            //htmlHead += ' padding-right: 20px;';
            htmlHead += '}\n';
            htmlHead += 'div.brBody img {';
            htmlHead += ' cursor: pointer;';
            htmlHead += ' align: right;}\n';


            htmlHead += '</style></head>';
            var htmlTail = '</body>\n</html>';

            this.htmlHostNetworkConfig.setHtml(htmlHead + html + htmlTail);




        } catch (e) {
            this.showToastError("createNetworkInterfaceComponents: " + e.toString());
            console.error('ERROR IN createNetworkInterfaceComponents: ' + e);
        }
    },
    destroyBridgeComponent: function(parent, pos) {
        try {
            var brLabel = parent + "NodeLabelBr" + pos;
            var brTitle = parent + "NodePanelBrTitle" + pos;
            var brLabelUpdate = parent + "NodeLabelUpdateBr" + pos;
            var brLabelRemove = parent + "NodeLabelRemoveBr" + pos;
            var brHtml = parent + "NodeHtmlBr" + pos;
            var brPanel = parent + "NodePanelBr" + pos;

            this[brHtml].destroy();
            //this[brLabelUpdate].destroy();
            this[brLabelRemove].destroy();
            this[brLabel].destroy();
            this[brTitle].destroy();
            this[brPanel].destroy();

        } catch (e) {
            this.showToastError("destroyBridgeComponent: " + e.toString());
            console.error('ERROR IN destroyBridgeComponent: ' + e);
        }
    },
    createVirtualNetworks: function(networks) {
        try {
            this.logDebugServer("Virtual Networks:" + JSON.stringify(networks));
            var html = '<body>\n';
            var InterfacesData = this.javaGetAllVmsNetworks.getValue("dataValue");
            var jsonRes = JSON.parse(InterfacesData);
            var node = jsonRes.node;
            var jsonVar = jsonRes.action.result;
            this.logDebugServer("Virtual Interfaces:" + JSON.stringify(jsonVar));
            var brList = [];
            var vnicList = [];
            var divPortgroupList = [];
            var linkStatusList = [];
            
            for (var i = 0; i < networks.length; i++) {
                network = networks[i];
                brName = network.name;
                brActive = network.active;
                mode = "bridge";

                net_opts = "<div>Mode: <i>" + network.mode + "</i></div>";
                optColor = "Teal";

                if (brActive !== 1) {
                    vnBackground = 'Gray';
                    fontColor = '"LightYellow "';
                    optColor = "LightYellow ";
                    brTitle = "Inactive virtual network";
                } else if ((network.bridge === 'openkvibr0') && (brName === 'default')) {
                    //vnBackground = 'FireBrick';
                    vnBackground = 'SlateGray';
                    fontColor = '"LightGoldenRodYellow"';
                    brTitle = "Management interface";
                    optColor = "LightYellow ";
                    net_opts += "<div>Bridge: <i>" + network.bridge + "</i></div>";
                } else {
                    brTitle = "";
                    fontColor = '"MidnightBlue"';
                    if (network.mode === "nat") {
                        mode = "nat";
                        net_opts += "<div>Bridge: <i>" + network.bridge + "</i></div>";
                        vnBackground = 'LightGreen';
                    } else if (network.mode === "bridge") {
                        if (network.type === "openvswitch") {
                            net_opts = "<div>Mode: <i>openvswitch</i></div>";
                            vnBackground = 'BlanchedAlmond';
                            mode = "openvswitch";
                        } else {
                            mode = "bridge";
                            vnBackground = 'AntiqueWhite';
                        }
                        net_opts += "<div>Bridge: <i>" + network.bridge + "</i></div>";
                    } else if (network.mode === "hostdev") {
                        vnBackground = 'Aqua';
                        if (network.type === "sriov") {
                            net_opts = "<div>Mode: <i>sr-iov</i></div>";
                            net_opts += "<div>Device: <i>" + network.sriov_dev + "</i></div>";
                            mode = "sr-iov";
                        } else {
                            net_opts += "<div>Passthrough: <i>direct</i></div>";
                            mode = "hostdev";
                        }
                    } else if (network.mode === "private") {
                        mode = "private";
                        net_opts += "<div>Bridge: <i>" + network.bridge + "</i></div>";
                        vnBackground = 'Beige';

                    }
                }
                // BEGINING OF VIRTUAL NETWORK PANEL
                if (brActive !== 1) {
                    html += '<div id="bridge_id_' + brName + '" class="vnPanel wm_BorderBottomStyle_Curved8px wm_BorderShadow_WeakShadow" style="background-color:' + vnBackground + ';">';
                } else {
                    html += '<div id="bridge_id_' + brName + '" class="vnPanel wm_BorderBottomStyle_Curved8px wm_BorderShadow_WeakShadow">';
                }
                html += '<div title="' + brTitle + '" id="name_bridge_' + brName + '" class="vnDesc" style="background-color:' + vnBackground + ';" >';
                html += '<div><label><b><font color = ' + fontColor + '>' + brName + '</font></b></label>';

                // Configure and delete
                if (!((network.bridge === 'openkvibr0') && (brName === 'default'))) {
                    // We only support Bridge and Hostdev configuration yet
                    if ((network.mode === "bridge") || (network.mode === "hostdev") || (network.mode === "private")) {
                        html += '<image id="configure_bridge_' + brName + '" title="Configure Virtual Network"';
                        html += 'src="resources/images/icons/actions/configure-16.png" align="left"/>';
                    }
                    html += '<image id="remove_bridge_' + brName + '" src="resources/images/icons/actions/delete-16.png"';
                    if (network.connections === "0") {
                        html += 'title="Remove this Virtual Network" align="right" style="padding-right: 5px;"/></div>\n';
                    } else {
                        html += 'title="Cannot remove a Virtual Network with running VMs" align="right" style="opacity: 0.3; padding-right: 5px;"/></div>\n';
                    }
                } else {
                    html += '</div>\n';
                }
                html += '</div>';
                html += '<div class="vnPlug" align="left" style="background-color:' + vnBackground + ';"><label><font color=' + optColor + '>' + net_opts + '</font></label></div>';

                network.vm_connections = 0;                
                for (var m = 0; m < network.portgroups.length; m++) {
                    var portgroup = network.portgroups[m];
                    var str = '';
                    var nbVm = 0;
                    for (var k = 0; k < jsonVar.length; k++) {
                        var vmName = jsonVar[k].name;
                        var vmInterfaces = jsonVar[k].vnics;
                        var interfaceCount = vmInterfaces.length;
                        for (var l = 0; l < interfaceCount; l++) {
                            var matched = false;
                            if (vmInterfaces[l].vswitch === brName) {
                                if ((vmInterfaces[l].portgroup === "") && (portgroup.is_default === "yes")) {
                                    matched = true;
                                } else if (vmInterfaces[l].portgroup === portgroup.name) {
                                    matched = true;
                                } else {
                                    matched = false;
                                }
                            }
                            if ((network.bridge === 'openkvibr0') && (vmInterfaces[l].vswitch === network.bridge)) {
                                matched = true;
                            }
                            if (matched) {                                
                                nbVm += 1;
                                var link_image = "link_down.png";
                                var link_msg = "Interface is down";
                                var varVmStatus = "Status" + vmName + "__" + node;
                                var state = "";
                                var link = "";
                                var link_mac = vmInterfaces[l].mac;
                                var link_type = "info";
                                if (this[varVmStatus] !== undefined) {
                                    var vmStatus = this[varVmStatus].getValue("dataValue");
                                    if ((vmStatus === "stopped") || (vmStatus === "suspended")) {
                                        state = "stopped";
                                        link = "down";
                                        link_image = "link_down.png";
                                        link_msg = "Interface is down";
                                        network.vm_connections += 1;
                                    } else if (vmInterfaces[l].state === "down") {
                                        state = "started";
                                        link = "down";
                                        link_image = "link_disconnected.png";
                                        if (vmInterfaces[l].target !== "unknown") {
                                            link_msg = vmInterfaces[l].target+" is disconnected";
                                        } else {
                                            link_msg = "Interface is disconnected";
                                        }
                                        network.vm_connections += 1;
                                    } else if (vmInterfaces[l].state.indexOf("Error") > -1) {
                                        state = "started";
                                        link = "down";
                                        link_image = "link_error.png";
                                        state_info = vmInterfaces[l].state.split(":");
                                        link_type = "error";
                                        link_msg = "Error: "+vmInterfaces[l].target+" is on the"+ state_info[1];
                                        network.vm_connections += 1;
                                    } else {
                                        state = "started";
                                        link = "up";
                                        link_image = "link_up.png";
                                        link_msg = vmInterfaces[l].target+" is connected";
                                        link_type = "success";
                                        network.vm_connections += 1;
                                    }
                                }
                                vnicList.push({
                                    'mac': vmInterfaces[l].mac,
                                    'name': vmName,
                                    'state': state,
                                    'link': link,
                                    'vswitch': brName,
                                    'portgroup': portgroup.name,
                                    'type': network.type                                
                                });
                                
                                image = "resources/images/icons/" + link_image;
                                var vnic_id = "id_" + vmInterfaces[l].mac;
                                str += '<div id=' + vnic_id + ' draggable="true" style="cursor: move;"><img style="height: 20px; width: 11px;" title="Drag&Drop Vnic" ';
                                str += 'src="' + image + '" align="center">';
                                //str += '<small title="' + link_title + '">' + vmName + '</small>';
                                str += '<small>' + vmName + '</small>';
                                str += '</div>';
                                linkStatusList.push({ "id": vnic_id, 
                                                      "title": link_msg, 
                                                      "msg": "MAC address: <b>"+link_mac+"</b>", 
                                                      "type": link_type});
                                //l = interfaceCount;    
                            }
                        }
                    }
                    if (portgroup.is_default === "yes") {
                        pgName = '<div style="display:inline-block;  width:100%;">';
                        pgName += '<div style="float: left;">' + portgroup.name + ' <font color=Teal>&#9734;</font></div>';
                        pgName += '<div title="Attached vnets" class="smallCircle openkvi_SmallShadow" style="float:right; font-size:x-small; color:Teal;" align="center">' + nbVm + '</div></div>';
                        pgTitle = "Default Portgroup";
                    } else {
                        pgName = '<div style="display:inline-block; width:100%;">';
                        pgName += '<div style="float: left;">' + portgroup.name + '</div>';
                        pgName += '<div title="Attached vnets" class="smallCircle openkvi_SmallShadow" style="float:right; font-size:x-small; color:Teal;" align="center">' + nbVm + '</div></div>';
                        pgTitle = "";
                    }
                    pgHead = "";
                    if (portgroup.vlan_id !== '-1') {
                        pgHead = pgName + '<div style="font-size: small; color:Teal; width:100%; display:inline-block;">Vlan ID: <i>' + portgroup.vlan_id + '</i></div>';
                    } else {
                        pgHead = pgName;
                    }
                    html += '<div id="pg_id_' + brName + '_' + portgroup.name + '" class="vnPortGroup wm_BorderTopStyle_Curved4px wm_BorderBottomStyle_Curved4px" >';
                    html += '<div class="vnPortGroupTitle" align="left" title="' + pgTitle + '">' + pgHead + '</div>';

                    html += '<div id="divPortGroup_' + brName + '_' + portgroup.name + '" class="vnPortGroupBody" align="left">' + str + '</div>';
                    if (nbVm > 0) {
                        html += '<div id="hideShowPortgroupVnets_' + brName + '_' + portgroup.name + '" style="width:100%; height:10px;" align="center">';
                        html += '<div class="nodeDashboardHider" style="width:40px; height:8px;" align="left">';
                        html += '<image  title="Hide/Show Vnets" src="resources/images/icons/three-dot-horizon-small.png" align="left"/>';
                        html += '</div></div>';
                        divPortgroupList.push({
                            'vswitch': brName,
                            'portgroup': portgroup.name
                        });
                    }
                    html += '</div>';

                }
                //html += '<div style="height: 5px;"></div></div>\n';
                html += '</div>\n';
            }


            var htmlHead = '<html><head>';
            htmlHead += '<style type="text/css">\n';
            htmlHead += 'div.vnPanel {';
            htmlHead += '    min-width:150px;';
            htmlHead += '    margin: 10px;';
            htmlHead += '    padding: 0px;';
            htmlHead += '    border: 1px solid #999999;';
            htmlHead += '    height: auto;';
            htmlHead += '    width: auto;';
            htmlHead += '    float: left;';
            htmlHead += '    text-align: center;';
            htmlHead += '  }\n';
            htmlHead += 'div.vnTools {cursor: pointer;}\n';
            htmlHead += 'div.vnPanel img {';
            htmlHead += '    display: inline;';
            htmlHead += '    margin-left: 5px;';
            htmlHead += '  }\n';
            htmlHead += 'div.vnPanel:hover {';
            htmlHead += '    border: 1px solid #34345f;';
            htmlHead += '  }\n';
            htmlHead += 'div.vnDesc {';
            htmlHead += '    background-color: ' + vnBackground + ' ;';
            htmlHead += '    border-bottom: 1px solid #b3b8c4;';
            htmlHead += '    padding-top: 5px;';
            htmlHead += '    padding-bottom: 5px;';
            htmlHead += '  }\n';
            htmlHead += 'div.vnDesc label {';
            htmlHead += '    text-align: center;';
            htmlHead += '    font-weight: normal;';
            htmlHead += '    padding-left: 15px;';
            htmlHead += '    padding-right: 10px;';
            htmlHead += '  }\n';
            htmlHead += 'div.vnDesc img {';
            htmlHead += '  cursor: pointer;';
            htmlHead += '  align: right;';
            htmlHead += '  }\n';
            htmlHead += 'div.vnPlug {';
            htmlHead += '    background-color: ' + vnBackground + ' ;';
            htmlHead += '    border-bottom: 1px solid #b3b8c4;';
            htmlHead += '    margin-bottom: 10px;';
            htmlHead += '    padding-top: 2px;';
            htmlHead += '    padding-bottom: 4px;';
            htmlHead += '    padding-left: 10px;';
            htmlHead += '    padding-right: 10px;';
            htmlHead += '  }\n';
            htmlHead += 'div.vnPortGroup {';
            htmlHead += '    border: 1px solid #b3b8c4;';
            htmlHead += '    margin: 5px;';
            htmlHead += '    margin-bottom: 10px;';
            htmlHead += '  }\n';
            //htmlHead += 'div.vnPortGroup:hover {';
            //htmlHead += '    border: 1px solid #34345f;';
            //htmlHead += '  }\n';
            htmlHead += 'div.vnPortGroupTitle {';
            htmlHead += '    border-bottom: 1px solid #b3b8c4;';
            htmlHead += '    padding: 5px;';
            htmlHead += '  }\n';
            htmlHead += 'div.vnPortGroupBody {';
            htmlHead += '    margin: 5px;';
            htmlHead += '  }\n';
            htmlHead += '</style></head>';
            var htmlTail = '</body>\n</html>';

            this.htmlVirtualNetworks.setHtml(htmlHead + html + htmlTail);

            for (var j = 0; j < networks.length; j++) {
                network = networks[j];
                if (!((network.bridge === 'openkvibr0') && (network.name === 'default'))) {
                    var delHid = dojo.byId('remove_bridge_' + network.name);
                    var modHid = dojo.byId('configure_bridge_' + network.name);
                    if ((network.mode === "bridge") || (network.mode === "hostdev") || (network.mode === "private")) {
                        this.connect(modHid, "onclick", this, dojo.hitch(this, "updateNetworkInterface", network));
                    }
                    if (network.vm_connections === 0) {
                        this.connect(delHid, "onclick", this, dojo.hitch(this, "removeNetworkInterface", network));
                        dojo.attr(delHid, "title", "Remove this Virtual Network");
                    } else {
                        dojo.attr(delHid, "title", "Cannot remove a Virtual Network with running VMs");
                        dojo.style(delHid, "opacity", 0.3);
                    }
                    for (var x = 0; x < network.portgroups.length; x++) {
                        var pg = network.portgroups[x];
                        this.connectPortgroupDragAndDrop(network.name, pg.name, network.type);
                    }
                }
            }
            for (i = 0; i < divPortgroupList.length; i++) {
                var nodeShowVnetsHid = dojo.byId('hideShowPortgroupVnets_' + divPortgroupList[i].vswitch + '_' + divPortgroupList[i].portgroup);
                this.connect(nodeShowVnetsHid, "onclick", this, dojo.hitch(this, "hideShowVnets", divPortgroupList[i].vswitch, divPortgroupList[i].portgroup));
            }
            // Connect ondragover and ondragend to each vnic
            this.logDebugServer("vnicList.length: " + vnicList.length);
            for (i = 0; i < vnicList.length; i++) {
                //({'mac': vmInterfaces[l].mac, 'name': vmName, 'state': state, 'link': link, 'vswitch': brName, 'portgroup': portgroup.name});
                this.connectVnicDragAndDrop(vnicList[i]);
            }
            for (i = 0; i < linkStatusList.length; i++) {
                this.addToolTip(linkStatusList[i].id,linkStatusList[i].title,linkStatusList[i].msg,linkStatusList[i].type, 700);
            }

        } catch (e) {
            this.htmlVirtualNetworks.setHtml("");
            this.showToastError(this.name + "ERROR IN createVirtualNetworks: " + e.toString());
            console.error('ERROR IN createVirtualNetworks: ' + e);
        }
    },
    hideShowVnets: function(vswitch, portgroup) {
        try {
            var wipeout = true;
            if (this.hideShowVnetsInfos === undefined) {
                this.hideShowVnetsInfos = {};
            }
            if (this.hideShowVnetsInfos[vswitch] !== undefined) {
                if (this.hideShowVnetsInfos[vswitch][portgroup] !== undefined) {
                    wipeout = !this.hideShowVnetsInfos[vswitch][portgroup].wipeOut;
                    this.hideShowVnetsInfos[vswitch][portgroup].wipeOut = wipeout;
                } else {
                    this.hideShowVnetsInfos[vswitch][portgroup] = {};
                    this.hideShowVnetsInfos[vswitch][portgroup].wipeOut = true;
                    wipeout = true;
                }
            } else {
                this.hideShowVnetsInfos[vswitch] = {};
                this.hideShowVnetsInfos[vswitch][portgroup] = {};
                this.hideShowVnetsInfos[vswitch][portgroup].wipeOut = true;
                wipeout = true;
            }
            var div = dojo.byId('divPortGroup_' + vswitch + '_' + portgroup);
            this.wipeInOutDiv(div, wipeout);

        } catch (e) {
            console.error('ERROR IN hideShowVnets: ' + e);
        }
    },
    connectVnicDragAndDrop: function(vnic) {
        try {
            var vnicHid = dojo.byId('id_' + vnic.mac);
            this.connect(vnicHid, "ondragstart", this, function(event) {
                this._movingVnic = vnic;
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text", event.target.id);
            });
            this.connect(vnicHid, "ondragend", this, function(event) {
                this._movingVnic = {};
                event.dataTransfer.clearData();
            });
        } catch (e) {
            this.showToastError(this.name + "ERROR IN connectVnicDragAndDrop: " + e.toString());
            console.error('ERROR IN connectVnicDragAndDrop: ' + e);
        }
    },
    connectPortgroupDragAndDrop: function(vswitch, portgroup, type) {
        try {
            var portgroupHid = dojo.byId("pg_id_" + vswitch + "_" + portgroup);
            this.connect(portgroupHid, "ondragover", this, function(event) {
                event.preventDefault();
                this.vswitchOndragover(vswitch, portgroup);
            });
            this.connect(portgroupHid, "ondragleave", this, function(event) {
                this.vswitchOndragleave(vswitch, portgroup);
            });
            this.connect(portgroupHid, "ondrop", this, function(event) {
                event.preventDefault();
                event.stopPropagation();
                //var data = event.dataTransfer.getData("text");
                //event.target.appendChild(document.getElementById(data));
                this.vswitchOndrop(vswitch, portgroup, type);
            });
        } catch (e) {
            this.showToastError(this.name + "ERROR IN connectVswitchDragAndDrop: " + e.toString());
            console.error('ERROR IN connectVswitchDragAndDrop: ' + e);
        }
    },
    vswitchOndragover: function(vswitch, portgroup) {
        try {
            var allowMove = false;
            if (this._movingVnic.vswitch !== vswitch) {
                allowMove = true;
            } else if (this._movingVnic.portgroup !== portgroup) {
                allowMove = true;
            }
            if ((this._movingVnic.name === "OpenKVI") && (this._movingVnic.vswitch === "default")) {
                allowMove = false;
            }
            if (allowMove) {
                var portgroupHid = dojo.byId("pg_id_" + vswitch + "_" + portgroup);
                dojo.style(portgroupHid, "border", "3px solid #b3b8c4");
            }
        } catch (e) {
            this.showToastError(this.name + "ERROR IN vswitchOndragover: " + e.toString());
            console.error('ERROR IN vswitchOndragover: ' + e);
        }
    },
    vswitchOndragleave: function(vswitch, portgroup) {
        try {
            var portgroupHid = dojo.byId("pg_id_" + vswitch + "_" + portgroup);
            dojo.style(portgroupHid, "border", "1px solid #b3b8c4");
        } catch (e) {
            this.showToastError(this.name + "ERROR IN vswitchOndragleave: " + e.toString());
            console.error('ERROR IN vswitchOndragleave: ' + e);
        }
    },
    vswitchOndrop: function(vswitch, portgroup, type) {
        try {
            var allowMove = false;
            if (this._movingVnic.vswitch !== vswitch) {
                allowMove = true;
            } else if (this._movingVnic.portgroup !== portgroup) {
                allowMove = true;
            }
            if ((this._movingVnic.name === "OpenKVI") && (this._movingVnic.vswitch === "default")) {
                allowMove = false;
            }
            if (allowMove) {
                var portgroupHid = dojo.byId("pg_id_" + vswitch + "_" + portgroup);
                dojo.style(portgroupHid, "border", "1px solid #b3b8c4");
                var data = {
                    "mac": this._movingVnic.mac,
                    "vswitch": vswitch,
                    "portgroup": portgroup
                };
                var node = this.varSelectedServer.getValue("dataValue");
                var vName = this._movingVnic.name;

                if (this._movingVnic.state === "started") {
                    if (this._movingVnic.type !== type) {
                        var msg = "Cannot move a running VM's Virtual NIC between conflicting Virtual Networks";
                        app.toastDialog.showToast(msg, 8000, "Warning", "cc", "Incompatible Virtual Networks types");
                    } else {
                        this.moveVmNic(vName, node, data);
                    }
                } else {
                    this.moveVmNic(vName, node, data);
                }
            }
        } catch (e) {
            this.showToastError(this.name + "ERROR IN vswitchOndrop: " + e.toString());
            console.error('ERROR IN vswitchOndrop: ' + e);
        }
    },
    moveVmNic: function(vName, node, data) {
        try {
            this.javaMoveVmNic.input.setValue("vName", vName);
            this.javaMoveVmNic.input.setValue("node", node);
            this.javaMoveVmNic.input.setValue("data", data);
            this.javaMoveVmNic.update();
            this.loadingNodeNetworkConf2.setShowing(true);
        } catch (e) {
            this.showToastError(this.name + "ERROR IN moveVmNic: " + e.toString());
            console.error('ERROR IN moveVmNic: ' + e);
        }
    },
    javaMoveVmNicResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaMoveVmNic.getValue("dataValue");
            var jsonVar = JSON.parse(result);
            var node = jsonVar.node;
            var varIP = node + "ip";
            var sIP = this[varIP].getValue("dataValue");
            var javaNodeNetwork = node + "javaNodeNetwork";
            this[javaNodeNetwork].input.setValue("node", node);
            this[javaNodeNetwork].update();
            if (jsonVar.action.result.indexOf("Error:") > -1) {
                this.updateLog("Move Virtual NIC", jsonVar.vm, node, jsonVar.action.result.replace("Error: ", "Failed: "));
            }


        } catch (e) {
            console.error('ERROR IN javaMoveVmNicResult: ' + e);
            this.showToastError(this.name + "ERROR IN javaMoveVmNicResult: " + e.toString());
        }
    },
    /*
    createBridgeComponents: function(name, bridge, panel, type, pos) {
        try {
            var brPanel = panel + "NodePanelBr" + pos;
            var ethPanel = panel + "NodePanel";
            var displayed = name;
            if (name !== bridge) {
                displayed = name + " (" + bridge + ")";
            }

            this[ethPanel].createComponent(brPanel, "wm.Panel", {
                layoutKind: "top-to-bottom",
                verticalAlign: "middle",
                horizontalAlign: "left",
                width: "175px",
                border: 1,
                padding: "0",
                margin: "10",
                height: "80px",
                title: "Bridge component",
                fitToContentHeight: false
            });
            this[brPanel].setBorderColor("#b3b8c4");
            //this[brPanel].addUserClass("wm_BorderShadow_WeakShadow");
            this[brPanel].addUserClass("wm_BorderBottomStyle_Curved8px");
            //this[brPanel].addUserClass("wm_BorderBottomStyle_Curved4px");
            this.connect(this[brPanel].domNode, "onmouseover", this, dojo.hitch(this, "onBrPanelMouseOver", this[brPanel]));
            this.connect(this[brPanel].domNode, "onmouseout", this, dojo.hitch(this, "onBrPanelMouseOut", this[brPanel]));


            var brTitlePanel = panel + "NodePanelBrTitle" + pos;
            this[brPanel].createComponent(brTitlePanel, "wm.Panel", {
                layoutKind: "left-to-right",
                verticalAlign: "middle",
                horizontalAlign: "left",
                width: "100%",
                border: "0,0,1,0",
                padding: "0",
                margin: "0",
                height: "30px",
                fitToContentHeight: false
            });
            this[brTitlePanel].setBorderColor("#b3b8c4");
            this[brTitlePanel].domNode.style.backgroundColor = "#f1eec3";

            var brLabel = panel + "NodeLabelBr" + pos;
            this[brTitlePanel].createComponent(brLabel, "wm.Label", {
                width: "100%",
                height: "30px",
                align: "center",
                padding: "0",
                border: "0",
                caption: displayed
            });

            var brLabelRemove = panel + "NodeLabelRemoveBr" + pos;
            this[brTitlePanel].createComponent(brLabelRemove, "wm.Label", {
                width: "22px",
                height: "18px",
                padding: "0",
                border: "0",
                align: "center",
                caption: '<image src="resources/images/icons/actions/delete-16.png"/>'
            });
            this[brLabelRemove].domNode.style.cursor = "pointer";
            this[brLabelRemove].setValue("domNode.title", "Remove bridge");



            var brHtml = panel + "NodeHtmlBr" + pos;
            this[brPanel].createComponent(brHtml, "wm.Html", {
                width: "100%",
                height: "100%",
                margin: "10",
                border: 0
            });

            var InterfacesData = this.javaGetAllVmsNetworks.getValue("dataValue");
            var jsonVar = JSON.parse(InterfacesData).action.result;
            var vmCount = jsonVar.length;
            var str = '';
            var nbVm = 0;
            for (var k = 0; k < vmCount; k++) {
                var vmName = jsonVar[k].name;
                var vmInterfaces = jsonVar[k].vnics;
                var interfaceCount = vmInterfaces.length;
                for (var l = 0; l < interfaceCount; l++) {
                    if (vmInterfaces[l].device === name) {
                        nbVm += 1;
                        image = "resources/images/icons/link2.png";
                        str += '<div><img style="height: 20px; width: 11px" ';
                        str += 'src="' + image + '" align="center">';
                        str += '<small>' + vmName + '</small>';
                        str += '</div>';

                    }
                }
            }
            if (nbVm > 0) {
                this[brLabelRemove].setValue("domNode.title", "Cannot remove an interface\nwith attached VMs");
                dojo.style(this[brLabelRemove].domNode, "opacity", 0.3);
            } else {
                var data = {
                    "name": name,
                    "bridge": bridge,
                    "type": type
                };
                //this.connect(this[brLabelRemove].domNode, "onclick", this, dojo.hitch(this, "removeNetworkInterface", data));
            }

            var height = 80 + (nbVm * 20);
            if (height < 85) {
                height = 85;
            }
            this[brHtml].setHtml(str);
            this[brPanel].setHeight(height + "px");
            this[ethPanel].reflow();
            this[brPanel].reflow();

        } catch (e) {
            this.showToastError("createBridgeComponents: " + e.toString());
            console.error('ERROR IN createBridgeComponents: ' + e);
        }
    },
    */
    onBrPanelMouseOver: function(inSender, event) {
        try {
            inSender.addUserClass("wm_BorderShadow_StrongShadow");
        } catch (e) {
            console.error('ERROR IN onHtmlMouseOver: ' + e);
        }
    },
    onBrPanelMouseOut: function(inSender, event) {
        try {
            inSender.removeUserClass("wm_BorderShadow_StrongShadow");
        } catch (e) {
            console.error('ERROR IN onHtmlMouseOut: ' + e);
        }
    },
    btnNodeEditVirtualNetworkClick: function(inSender) {
        try {
            this.textInterfaceNaming.setReadonly(false);

        } catch (e) {
            console.error('ERROR IN btnNodeEditVirtualNetworkClick: ' + e);
        }
    },
    updateNetworkInterface: function(netInfo) {
        try {
            this._nodeVirtualNetworkData = null;
            this._nodeVirtualNetworkData = this.clone(netInfo);
            this._nodeVirtualNetworkData.cfg_state = 'clean';
            this._nodeVirtualNetworkData.old_name = this._nodeVirtualNetworkData.name;
            this.setInterfaceType(netInfo.type);
            this.nodeNetworkDialog.setTitle("Update Virtual Network");
            if ((netInfo.type === "openvswitch") && (netInfo.bridge.indexOf('private_') === 0)) {
                this.selectInterfaceType.setDataValue("private");
                this.selectInterfaceTarget.setDisplayValue(netInfo.bridge);
                this.selectInterfaceTarget.setReadonly(true);
                this.selectInterfaceTarget.setDisabled(true);
            } else {
                this.selectInterfaceType.setDataValue(netInfo.type);
                this.selectInterfaceTarget.setReadonly(false);
                this.selectInterfaceTarget.setDisabled(false);
                if (netInfo.type === "sriov") {
                    this.selectInterfaceTarget.setDataValue(netInfo.sriov_dev);
                } else {
                    this.selectInterfaceTarget.setDataValue(netInfo.bridge);
                }
            }
            this.btnNodeEditVirtualNetwork.setShowing(true);
            this.selectInterfaceType.setReadonly(true);
            this.textInterfaceNaming.setDisplayValue(netInfo.name);
            this.textInterfaceNaming.setReadonly(true);

            this.logDebugServer("_nodeVirtualNetworkData:" + JSON.stringify(this._nodeVirtualNetworkData));
            this.setPortGroupHtmlDisplay();
            this.nodeNetworkDialog.show();

        } catch (e) {
            this.showToastError("updateNetworkInterface: " + e.toString());
            console.error('ERROR IN updateNetworkInterface: ' + e);
        }
    },
    setPortGroupHtmlDisplay: function() {
        try {
            var netInfo = this._nodeVirtualNetworkData;
            var Head = '<html>\n';
            Head += '<head><style type="text/css">\n';
            Head += 'div.editPortGroup {';
            Head += '    border: 1px solid #999999;';
            Head += '    text-align: center;';
            Head += '    margin-bottom: 10px;';
            Head += '    padding: 2px;';
            Head += '    cursor: pointer;';
            Head += '  }\n';
            Head += 'div.editPortGroup:hover {';
            Head += '    border: 1px solid #34345f;';
            Head += '  }\n';
            Head += 'div.editPortGroupSelected {';
            Head += '    background-color: #b3b8c4;';
            Head += '    border: 1px solid #999999;';
            Head += '    text-align: center;';
            Head += '    margin-bottom: 10px;';
            Head += '    padding: 2px;';
            Head += '    cursor: pointer;';
            Head += '  }\n';
            Head += 'div.editPortGroupSelected:hover {';
            Head += '    border: 1px solid #34345f;';
            Head += '  }\n';
            Head += '</style></head><body><div id="portgroupList">';
            var Body = '';
            var pgclass = "editPortGroup wm_BorderTopStyle_Curved4px wm_BorderBottomStyle_Curved4px";
            for (var j = 0; j < netInfo.portgroups.length; j++) {
                if (this._nodeVirtualNetworkData.portgroups[j].cfg_state === undefined) {
                    this._nodeVirtualNetworkData.portgroups[j].cfg_state = "clean";
                    this._nodeVirtualNetworkData.portgroups[j].old_name = this._nodeVirtualNetworkData.portgroups[j].name;
                }
                portgroup = netInfo.portgroups[j];
                //&#9734;
                if (portgroup.is_default === "yes") {
                    if (portgroup.name === "") {
                        Body += '<div class="' + pgclass + '" id="editPortgroup_Default">undefined  &#9734;</div>';
                    } else {
                        Body += '<div class="' + pgclass + '" id="editPortgroup_' + portgroup.name + '">' + portgroup.name + '  &#9734;</div>';
                    }
                } else if (portgroup.name !== "") {
                    Body += '<div class="' + pgclass + '" id="editPortgroup_' + portgroup.name + '">' + portgroup.name + '</div>';
                }
            }
            var Tail = '</div></body></html>';
            this.htmlPortgroupList.setHtml(Head + Body + Tail);

            for (var index = 0; index < netInfo.portgroups.length; index++) {
                portgroup = netInfo.portgroups[index];
                var modHid = '';
                if ((portgroup.name === "") && (portgroup.is_default === "yes")) {
                    modHid = dojo.byId('editPortgroup_Default');
                    this.connect(modHid, "onclick", this, dojo.hitch(this, "showPortgroupConfiguration", index));
                } else if (portgroup.name !== "") {
                    modHid = dojo.byId('editPortgroup_' + portgroup.name);
                    this.connect(modHid, "onclick", this, dojo.hitch(this, "showPortgroupConfiguration", index));
                }
            }
            this.btnRemovePortgroup.setShowing(false);
            this.panelPortgroupConfig.setShowing(false);

        } catch (e) {
            this.showToastError("setPortGroupHtmlDisplay: " + e.toString());
            console.error('ERROR IN setPortGroupHtmlDisplay: ' + e);
        }
    },
    showPortgroupConfiguration: function(index) {
        try {
            this._selectedPortgroupIndex = index;
            var portgroup = this._nodeVirtualNetworkData.portgroups[index];
            this.textPortgroupName.setDisplayValue(portgroup.name);

            if (portgroup.vlan_id === "-1") {
                this.checkPortGroupVlan.setChecked(false);
            } else {
                this.numPortGroupVlanId.setDisplayValue(parseInt(portgroup.vlan_id, 10));
                this.checkPortGroupVlan.setChecked(true);
            }
            if (portgroup.is_default === "yes") {
                this.checkPortgroupIsDefault.setChecked(true);
                this.btnRemovePortgroup.setShowing(false);
            } else {
                this.checkPortgroupIsDefault.setChecked(false);
                this.btnRemovePortgroup.setShowing(true);
            }
            // remove previous class
            var portgroupList = dojo.byId("portgroupList");
            var items = portgroupList.getElementsByTagName("div");
            for (var i = 0; i < items.length; i++) {
                var id = dojo.attr(items[i], "id");
                dojo.replaceClass(id, "editPortGroup", "editPortGroupSelected");
            }

            if (portgroup.name === "") {
                dojo.replaceClass("editPortgroup_Default", "editPortGroupSelected", "editPortGroup");
            } else {
                dojo.replaceClass('editPortgroup_' + portgroup.name, "editPortGroupSelected", "editPortGroup");
            }

            this.panelPortgroupConfig.setShowing(true);
        } catch (e) {
            this.showToastError("showPortgroupConfiguration: " + e.toString());
            console.error('ERROR IN showPortgroupConfiguration: ' + e);
        }
    },
    checkPortgroupIsDefaultChange: function(inSender) {
        try {
            if (this.checkPortgroupIsDefault.getChecked()) {
                var index = -1;
                for (var i = 0; i < this._nodeVirtualNetworkData.portgroups.length; i++) {
                    portgroup = this._nodeVirtualNetworkData.portgroups[i];
                    if (i === this._selectedPortgroupIndex) {
                        if (this._nodeVirtualNetworkData.portgroups[i].is_default !== "yes") {
                            this._nodeVirtualNetworkData.portgroups[i].is_default = "yes";
                            if (this._nodeVirtualNetworkData.portgroups[i].cfg_state !== "new") {
                                this._nodeVirtualNetworkData.portgroups[i].cfg_state = "updated";
                            }
                            index = i;
                        }
                    } else if (this._nodeVirtualNetworkData.portgroups[i].is_default === "yes") {
                        this._nodeVirtualNetworkData.portgroups[i].is_default = "no";
                        if (this._nodeVirtualNetworkData.portgroups[i].cfg_state !== "new") {
                            this._nodeVirtualNetworkData.portgroups[i].cfg_state = "updated";
                        }
                    }
                }
                this.checkPortgroupIsDefault.setDisabled(true);
                // Remove any previous default portgroup wihtout name
                for (i = 0; i < this._nodeVirtualNetworkData.portgroups.length; i++) {
                    portgroup = this._nodeVirtualNetworkData.portgroups[i];
                    if ((portgroup.name === "") && (portgroup.is_default !== "yes")) {
                        this._nodeVirtualNetworkData.portgroups.splice(i, 1);
                        index = -1;
                    }
                }
                if (index === -1) {
                    for (i = 0; i < this._nodeVirtualNetworkData.portgroups.length; i++) {
                        if (this._nodeVirtualNetworkData.portgroups[i] === "yes") {
                            this.showPortgroupConfiguration(i);
                            this.setPortGroupHtmlDisplay();
                        }
                    }
                } else {
                    this.setPortGroupHtmlDisplay();
                    this.showPortgroupConfiguration(index);
                }

            } else {
                this.checkPortgroupIsDefault.setDisabled(false);
            }

        } catch (e) {
            console.error('ERROR IN checkPortgroupIsDefaultChange: ' + e);
            this.showToastError("checkPortgroupIsDefaultChange: " + e.toString());
        }
    },
    textPortgroupNameChange: function(inSender) {
        try {
            var newName = inSender.getDataValue();
            var oldName = this._nodeVirtualNetworkData.portgroups[this._selectedPortgroupIndex].name;
            if (newName !== oldName) {
                this._nodeVirtualNetworkData.portgroups[this._selectedPortgroupIndex].name = newName;
                this._nodeVirtualNetworkData.portgroups[this._selectedPortgroupIndex].cfg_state = "updated";
                this.setPortGroupHtmlDisplay();
                this.showPortgroupConfiguration(this._selectedPortgroupIndex);
            }
        } catch (e) {
            console.error('ERROR IN textPortgroupNameChange: ' + e);
        }
    },
    checkPortGroupVlanChange: function(inSender) {
        try {
            var index = this._selectedPortgroupIndex;
            if (!this.checkPortGroupVlan.getChecked()) {
                if (this._nodeVirtualNetworkData.portgroups[index].vlan_id !== "-1") {
                    this._nodeVirtualNetworkData.portgroups[index].vlan_id = "-1";
                    if (this._nodeVirtualNetworkData.portgroups[index].cfg_state !== "new") {
                        this._nodeVirtualNetworkData.portgroups[index].cfg_state = "updated";
                    }
                }
            } else if (this._nodeVirtualNetworkData.portgroups[index].vlan_id === "-1") {
                this.numPortGroupVlanId.setDisplayValue(1);
                this._nodeVirtualNetworkData.portgroups[index].vlan_id = "1";
            }
        } catch (e) {
            console.error('ERROR IN checkPortGroupVlanChange: ' + e);
        }
    },
    numPortGroupVlanIdChange: function(inSender) {
        try {
            var index = this._selectedPortgroupIndex;
            var vlan_id = inSender.getDataValue().toString();
            if (this._nodeVirtualNetworkData.portgroups[index].vlan_id !== vlan_id) {
                this._nodeVirtualNetworkData.portgroups[index].vlan_id = vlan_id;
                if (this._nodeVirtualNetworkData.portgroups[index].cfg_state !== "new") {
                    this._nodeVirtualNetworkData.portgroups[index].cfg_state = "updated";
                }
            }
        } catch (e) {
            console.error('ERROR IN numPortGroupVlanIdChange: ' + e);
        }
    },
    btnAddPortgroupClick: function(inSender) {
        try {
            this.AddPortgroup("PORTGROUP");

        } catch (e) {
            console.error('ERROR IN btnAddPortgroupClick: ' + e);
        }
    },
    AddPortgroup: function(pgname) {
        try {
            var nb = 0;
            var new_name = pgname;
            var is_default = "no";

            new_name = pgname + nb.toString();
            var is_not_new = true;
            while (is_not_new) {
                is_not_new = false;
                for (var i = 0; i < this._nodeVirtualNetworkData.portgroups.length; i++) {
                    if (this._nodeVirtualNetworkData.portgroups[i].name === new_name) {
                        is_not_new = true;
                        break;
                    }
                }
                if (is_not_new) {
                    nb += 1;
                    new_name = pgname + nb.toString();
                }
            }
            this._nodeVirtualNetworkData.portgroups.push({
                'is_default': is_default,
                'name': new_name,
                'vlan_id': '-1',
                'cfg_state': 'new',
                'old_name': new_name
            });
            this.setPortGroupHtmlDisplay();

        } catch (e) {
            console.error('ERROR IN AddPortgroup: ' + e);
            this.showToastError("AddPortgroup: " + e.toString());
        }
    },
    btnRemovePortgroupClick: function(inSender) {
        try {
            var index = this._selectedPortgroupIndex;
            this._nodeVirtualNetworkData.portgroups.splice(index, 1);
            this.setPortGroupHtmlDisplay();

        } catch (e) {
            console.error('ERROR IN btnRemovePortgroupClick: ' + e);
        }
    },
    selectInterfaceTargetChange: function(inSender) {
        try {
            var target = inSender.getDataValue();
            if (this._nodeVirtualNetworkData.type === "openvswitch") {
                if (this._nodeVirtualNetworkData.bridge !== target) {
                    this._nodeVirtualNetworkData.bridge = target;
                }
            } else if (this._nodeVirtualNetworkData.type === "sriov") {
                if (this._nodeVirtualNetworkData.sriov_dev !== target) {
                    this._nodeVirtualNetworkData.sriov_dev = target;
                }
            }
            if (this._nodeVirtualNetworkData.cfg_state !== "new") {
                this._nodeVirtualNetworkData.cfg_state = "updated";
            }

        } catch (e) {
            console.error('ERROR IN selectInterfaceTargetChange: ' + e);
        }
    },
    btnInterfaceNewClick: function(inSender) {
        try {
            this.nodeNetworkDialog.setTitle("Add a Virtual Network");
            this.textInterfaceNaming.setDisplayValue("");
            this.textInterfaceNaming.setReadonly(false);
            this.selectInterfaceType.setDisplayValue("");
            this.selectInterfaceType.setReadonly(false);
            this.btnNodeEditVirtualNetwork.setShowing(false);
            this.selectInterfaceTarget.setDisplayValue("");
            this.selectInterfaceTarget.setReadonly(false);

            this._nodeVirtualNetworkData = {
                "bridge": "",
                "name": "",
                "portgroups": [{
                    "is_default": "yes",
                    "name": "Default",
                    "vlan_id": "-1"
                }],
                "persistent": 1,
                "connections": "0",
                "mode": "",
                "active": 1,
                "type": "",
                "cfg_state": "new"
            };

            this.nodeNetworkDialog.show();
            this.setPortGroupHtmlDisplay();
            this.showPortgroupConfiguration(0);

        } catch (e) {
            console.error('ERROR IN btnInterfaceNewClick: ' + e);
            this.showToastError("btnInterfaceNewClick: " + e.toString());
        }
    },
    selectInterfaceTypeChange: function(inSender) {
        try {
            var type = inSender.getValue("dataValue");
            this.setInterfaceType(type);
        } catch (e) {
            console.error('ERROR IN selectInterfaceTypeChange: ' + e);
            this.showToastError("selectInterfaceTypeChange: " + e.toString());
        }
    },
    setInterfaceType: function(type) {
        try {
            var node = this.varSelectedServer.getValue("dataValue");
            var serviceName = node + "javaNodeNetwork";
            var networking = this[serviceName].getValue("dataValue");
            var jsonInfo = JSON.parse(networking);
            var network = jsonInfo.action.result;
            this.varNetworkTargets.clearData();

            if (type === "openvswitch") {
                this.selectInterfaceTarget.setDisabled(false);
                this.selectInterfaceTarget.setDisabled(false);
                this.selectInterfaceTarget.required = true;
                this.selectInterfaceTarget.setCaption('OVS Bridge:');
                var brCount = network.ovs.bridges.length;
                for (var i = 0; i < brCount; i++) {
                    var ovs_name = network.ovs.bridges[i].name;
                    if (ovs_name.indexOf('private_') !== 0) {
                        var ovs_type = network.ovs.bridges[i].type;
                        if (ovs_type === "public") {
                            ovs_infos = "( access: " + network.ovs.bridges[i].access + " )";
                        } else {
                            ovs_infos = "( private )";
                        }
                        this.varNetworkTargets.addItem({
                            'name': ovs_name + "   " + ovs_infos,
                            'dataValue': ovs_name
                        });
                    }
                }
                this.selectInterfaceTarget.setDisabled(false);
                this.selectInterfaceTarget.reflow();
            } else if (type === "sriov") {
                var is_sriov = false;
                for (var j = 0; j < network.physicals.ifaces.length; j++) {
                    var eth = network.physicals.ifaces[j].name;
                    var state = network.physicals.ifaces[j].state;
                    var sriov_vf = network.physicals.ifaces[j].sriov;
                    if ((eth.indexOf("usb") !== 0) && (sriov_vf !== "0")) {
                        is_sriov = true;
                        this.varNetworkTargets.addItem({
                            'name': eth + "   ( " + sriov_vf + " virtual functions )",
                            'dataValue': eth
                        });
                    }
                }
                if (is_sriov) {
                    this.selectInterfaceTarget.setDisabled(false);
                    this.selectInterfaceTarget.setDisabled(false);
                    this.selectInterfaceTarget.required = true;
                    this.selectInterfaceTarget.setCaption('Physical Device:');
                    this.selectInterfaceTarget.setDisabled(false);
                } else {
                    var msg = "Sorry, " + node + " does not support SR-IOV Passthrough";
                    app.toastDialog.showToast(msg, 5000, "Warning", "cc", "Not Supported");
                    this.selectInterfaceType.setDataValue("openvswitch");
                }

            } else {
                this.selectInterfaceTarget.required = false;
                this.selectInterfaceTarget.setDisabled(true);
                this.selectInterfaceTarget.setReadonly(true);
                this.selectInterfaceTarget.setDisplayValue("");
            }
        } catch (e) {
            console.error('ERROR IN setInterfaceType: ' + e);
            this.showToastError("setInterfaceType: " + e.toString());
        }
    },
    removeNetworkInterface: function(inData) {
        try {
            this.loadingNodeNetworkConf2.setShowing(true);
            var node = this.varSelectedServer.getValue("dataValue");
            this.javaNodeRemoveNetwork.input.setValue("node", node);
            this.javaNodeRemoveNetwork.input.setValue("data", JSON.stringify(inData));
            this.showConfirmDialog("This will remove " + inData.type + " " + inData.name + " from node " + node, "removeNetworkInterfaceConfirmed", true);
            this.addLog("Remove Virtual Network", inData.name, node, 0);

        } catch (e) {
            console.error('ERROR IN removeNetworkInterface: ' + e);
            this.showToastError("removeNetworkInterface: " + e.toString());
        }
    },
    removeNetworkInterfaceConfirmed: function(confirmed) {
        try {
            if (confirmed) {
                this.javaNodeRemoveNetwork.update();
            } else {
                var node = this.varSelectedServer.getValue("dataValue");
                var text = this.confirmDialog.userPrompt;
                var tmpStr1 = text.replace(/ from node .*/, "");
                var target = tmpStr1.replace(/.* /, "");
                this.updateLog("Remove Virtual Network", target, node, "Canceled by user");
                this.loadingNodeNetworkConf2.setShowing(false);
            }


        } catch (e) {
            console.error('ERROR IN removeNetworkInterfaceConfirmed: ' + e);
            this.showToastError("removeNetworkInterfaceConfirmed: " + e.toString());
        }
    },
    textInterfaceNamingChange: function(inSender) {
        try {
            var old_msg = this.textInterfaceNaming.invalidMessage;
            if (old_msg.indexOf("already exist") > 0) {
                this.textInterfaceNaming.invalidMessage = "";
                this.textInterfaceNaming.setRegExp("^[A-Za-z0-9]+(?:-?_?[A-Za-z0-9]+)+$");
            }
            var node = this.varSelectedServer.getValue("dataValue");
            var serviceName = node + "javaNodeNetwork";
            var networking = this[serviceName].getValue("dataValue");
            var jsonInfo = JSON.parse(networking);
            var network = jsonInfo.action.result;

            var msg = "";
            var tmpName = this.textInterfaceNaming.getDisplayValue();
            var isValid = true;
            for (i = 0; i < network.virtualnet.networks.length; i++) {
                var virtName = network.virtualnet.networks[i].name;
                if (tmpName === network.virtualnet.networks[i].name) {
                    if (this.nodeNetworkDialog.title.indexOf("Add ") > -1) {
                        this.textInterfaceNaming.setRegExp("^((?!" + tmpName + ").)*$");
                        msg = tmpName + " already exist, please enter a new name.";
                        this.textInterfaceNaming.invalidMessage = msg;
                        app.toastDialog.showToast(msg, 5000, "Warning", "cc", "Invalid name");
                    } else if (tmpName !== this._nodeVirtualNetworkData.old_name) {
                        this.textInterfaceNaming.setRegExp("^((?!" + tmpName + ").)*$");
                        msg = tmpName + " already exist, please enter a new name.";
                        this.textInterfaceNaming.invalidMessage = msg;
                        isValid = false;
                    }
                }
            }
            if (isValid) {
                this._nodeVirtualNetworkData.name = tmpName;
            }

        } catch (e) {
            console.error('ERROR IN textInterfaceNamingChange: ' + e);
            this.showToastError("textInterfaceNamingChange: " + e.toString());
        }
    },
    nodeNetworkBtnSaveClick: function(inSender) {
        try {
            var node = this.varSelectedServer.getValue("dataValue");
            this.logDebugServer("nodeNetworkBtnSaveClick+: " + data);

            if (this.nodeNetworkDialog.title.indexOf("Add ") > -1) {
                this._nodeVirtualNetworkData.type = this.selectInterfaceType.getDataValue();
                this._nodeVirtualNetworkData.bridge = this.selectInterfaceTarget.getDataValue();
                var new_data = JSON.stringify(this._nodeVirtualNetworkData);
                this.javaNodeCreateNetwork.input.setValue("node", node);
                this.javaNodeCreateNetwork.input.setValue("data", new_data);
                this.javaNodeCreateNetwork.update();
                this.addLog("Create Virtual Network", this._nodeVirtualNetworkData.name, node, 0);
            } else {
                var mod_data = JSON.stringify(this._nodeVirtualNetworkData);
                this.javaNodeUpdateNetwork.input.setValue("node", node);
                this.javaNodeUpdateNetwork.input.setValue("data", mod_data);
                this.javaNodeUpdateNetwork.update();
                this.addLog("Update Virtual Network", this._nodeVirtualNetworkData.name, node, 0);
            }
            this.nodeNetworkDialog.hide();
            this.loadingNodeNetworkConf2.setShowing(true);

        } catch (e) {
            console.error('ERROR IN nodeNetworkBtnSaveClick: ' + e);
            this.showToastError("nodeNetworkBtnSaveClick: " + e.toString());
        }
    },
    javaNodeCreateNetworkResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaNodeCreateNetwork.getValue("dataValue");
            this.logDebugServer("javaNodeCreateNetworkResult:" + result);

            var data = JSON.parse(result);
            var info = JSON.parse(data.action.desc);
            if (data.action.result.indexOf("Error") > -1) {
                var str = data.action.result.replace(/:/g, ":</br>");
                this.showWarning(str);
                //this.updateLog("Create Virtual Network", info.name, node, "Failed: " + str);
            } else {
                var node = data.node;
                var varIP = node + "ip";
                var sIP = this[varIP].getValue("dataValue");
                var javaNodeNetwork = node + "javaNodeNetwork";
                this[javaNodeNetwork].input.setValue("node", node);
                this[javaNodeNetwork].update();
                //this.updateLog("Create Virtual Network", info.name, node, "Successful");
                this.loadingNodeNetworkConf2.setShowing(true);
            }
        } catch (e) {
            console.error('ERROR IN javaNodeCreateNetworkResult: ' + e);
            this.showToastError("javaNodeCreateNetworkResult: " + e.toString());
        }
    },
    javaNodeRemoveNetworkResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaNodeRemoveNetwork.getValue("dataValue");
            var data = JSON.parse(result);
            var info = JSON.parse(data.action.desc);
            if (data.action.result.indexOf("Error") > -1) {
                var str = data.action.result.replace(/:/g, ":</br>");
                this.showWarning(str);
                //this.updateLog("Remove Virtual Network", info.name, node, "Failed: " + str);
            } else {
                var node = data.node;
                var varIP = node + "ip";
                var sIP = this[varIP].getValue("dataValue");
                var javaNodeNetwork = node + "javaNodeNetwork";
                this[javaNodeNetwork].input.setValue("node", node);
                this[javaNodeNetwork].update();
                //this.updateLog("Remove Virtual Network", info.name, node, "Successful");
                this.loadingNodeNetworkConf2.setShowing(true);
            }

        } catch (e) {
            console.error('ERROR IN javaNodeRemoveNetworkResult: ' + e);
            this.showToastError("javaNodeRemoveNetworkResult: " + e.toString());
        }
    },
    javaNodeUpdateNetworkResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaNodeUpdateNetwork.getValue("dataValue");
            this.logDebugServer("javaNodeUpdateNetwork:" + result);
            var data = JSON.parse(result);
            var info = JSON.parse(data.action.desc);
            if (data.action.result.indexOf("Error") > -1) {
                var str = data.action.result.replace(/:/g, ":</br>");
                this.showWarning(str);
                //this.updateLog("Update Virtual Network", info.name, node, "Failed: " + str);
            } else {
                var node = data.node;
                var varIP = node + "ip";
                var sIP = this[varIP].getValue("dataValue");
                var javaNodeNetwork = node + "javaNodeNetwork";
                this[javaNodeNetwork].input.setValue("node", node);
                this[javaNodeNetwork].update();
                //this.updateLog("Update Virtual Network", info.name, node, "Successful");
                this.loadingNodeNetworkConf2.setShowing(true);
            }

        } catch (e) {
            console.error('ERROR IN javaNodeUpdateNetworkResult: ' + e);
            this.showToastError("javaNodeUpdateNetworkResult: " + e.toString());
        }
    },
    ///// END Server configuaration /////////////////////////////////////////////////
    ///// Start of Servers Control Board ////////////////////////////////////////////
    TabServersLogsShow: function(inSender) {
        try {
            this.nodeLogsArea.clear();
            this.nodeHardwareLogArea.clear();
            this.labelHardwareEventsClick();
        } catch (e) {
            console.error('ERROR IN TabServersLogsShow: ' + e);
        }
    },
    reloadNodeHel: function() {
        try {
            if (this.layerServer.isActive() && this.layerHardwareEvents.isActive()) {
                var node = this.varSelectedServer.getValue("dataValue");
                this.javaGetNodeHardwareEvents.input.setValue("node", node);
                this.javaGetNodeHardwareEvents.update();
                setTimeout(function() {
                    try {
                        wm.Page.getPage("Main").reloadNodeHel();
                    } catch (e) {
                        alert(e);
                    }
                }, 300000);
            }
        } catch (e) {
            console.error('ERROR IN reloadNodeHel: ' + e);
        }
    },
    javaGetNodeHardwareEventsResult: function(inSender, inDeprecated) {
        try {
            this.readHardwareEvents();
        } catch (e) {
            console.error('ERROR IN javaGetNodeHardwareEventsResult: ' + e);
        }
    },
    readHardwareEvents: function() {
        try {
            var result = this.javaGetNodeHardwareEvents.getValue("dataValue");
            var hel = JSON.parse(result).action.result;

            var dispStr = "";
            var addToArea = false;
            for (var i = 0; i < hel.length; i++) {
                addToArea = false;
                var elts = hel[i].split("::");
                //<font color = "838888">' + args[1] + '</font>'
                var tmpStr = "";
                var color = "black";
                if (elts[1] === "[CRITICAL]") {
                    color = "Red";
                    if (this.checkHardwareCriticalEvents.getChecked()) {
                        addToArea = true;
                    }
                } else if (elts[1] === "[WARNING]") {
                    color = "OrangeRed";
                    if (this.checkHardwareWarningEvents.getChecked()) {
                        addToArea = true;
                    }
                } else if (elts[1] === "[NOTICE]") {
                    color = "DarkSlateBlue";
                    if (this.checkHardwareNoticeEvents.getChecked()) {
                        addToArea = true;
                    }
                } else if (elts[1] === "[INFOS]") {
                    color = "Grey";
                    if (this.checkHardwareInfos.getChecked()) {
                        addToArea = true;
                    }
                }
                if (addToArea) {
                    tmpStr = '<font color = "' + color + '">' + elts[0] + '  <b>' + elts[1] + '</b>  ' + elts[2] + '</font>';
                    dispStr += tmpStr + "</br>";
                }
            }
            this.nodeHardwareLogArea.setDisplayValue(dispStr);

        } catch (e) {
            console.error('ERROR IN readHardwareEvents: ' + e);
        }
    },
    onNodeHardwareEventsCheckboxChange: function(inSender) {
        try {
            this.readHardwareEvents();
        } catch (e) {
            console.error('ERROR IN onLogCheckboxChange: ' + e);
        }
    },

    labelHardwareEventsClick: function(inSender, inEvent) {
        try {
            this.labelHardwareEvents.domNode.style.backgroundColor = this._LogFrameColor;
            this.panelHardwareEvents.domNode.style.backgroundColor = this._LogFrameColor;
            
            this.layerHardwareEvents.activate();
            this.labelServerLogs.domNode.style.backgroundColor = "#eeeeee";
            this.labelHardwareEvents.setBorder('1,2,0,1');
            this.labelServerLogs.setBorder('1,1,0,1');
            this.labelServerLogs.removeUserClass("wm_TextDecoration_Bold");
            this.labelHardwareEvents.addUserClass("wm_TextDecoration_Bold");

            this.nodeHardwareLogArea.setDisplayValue("");
            this.reloadNodeHel();

        } catch (e) {
            console.error('ERROR IN labelHardwareEventsClick: ' + e);
        }
    },
    labelServerLogsClick: function(inSender, inEvent) {
        try {
            this.labelServerLogs.domNode.style.backgroundColor = this._LogFrameColor;
            this.panelServerLogs.domNode.style.backgroundColor = this._LogFrameColor;
            
            this.layerServerLogs.activate();
            this.labelHardwareEvents.domNode.style.backgroundColor = "#eeeeee";
            this.labelServerLogs.setBorder('1,2,0,1');
            this.labelHardwareEvents.setBorder('1,1,0,1');
            this.labelHardwareEvents.removeUserClass("wm_TextDecoration_Bold");
            this.labelServerLogs.addUserClass("wm_TextDecoration_Bold");

            this.nodeLogsArea.setDisplayValue("");
            this.reloadNodeLogs();

        } catch (e) {
            console.error('ERROR IN labelServerLogsClick: ' + e);
        }
    },
    reloadNodeLogs: function() {
        try {
            if (this.layerServer.isActive() && this.layerServerLogs.isActive()) {
                this.loadingNodeLogs.setShowing(true);
                this.reloadNodeLogsBtn.setDisabled(true);
                var node = this.varSelectedServer.getValue("dataValue");
                this.javaGetNodeLogs.input.setValue("node", node);
                this.javaGetNodeLogs.update();
            }
        } catch (e) {
            console.error('ERROR IN reloadNodeLogs: ' + e);
        }
    },
    javaGetNodeLogsResult: function(inSender, inDeprecated) {
        try {
            this.reloadNodeLogsBtn.setDisabled(false);
            var result = this.javaGetNodeLogs.getValue("dataValue");
            this.nodeLogsArea.setDisplayValue(result);
            this.loadingNodeLogs.setShowing(false);
        } catch (e) {
            console.error('ERROR IN javaGetNodeLogsResult: ' + e);
        }
    },
    reloadNodeLogsBtnClick: function(inSender) {
        try {
            this.reloadNodeLogs();
        } catch (e) {
            console.error('ERROR IN reloadNodeLogsBtnClick: ' + e);
        }
    },
    ///// END of Servers Control Board ////////////////////////////////////////////

    ///// Start VM Configuration ////////////////////////////////////////////////////
    btnRenameVmSaveClick: function(inSender) {
        try {
            var currentName = this["Label" + this.vmLiveVar.getValue("name") + "__" + this.vmLiveVar.getValue("server")].caption;
            var newName = this.renameVmName.getValue("dataValue");

            var badName = false;
            if (newName === undefined || newName === "") badName = true;

            if (badName) {
                app.toastDialog.showToast("Name is invalid", 5000, "Warning", "cc", "");
            }
            else {
                var node = this.varSelectedServer.getValue("dataValue");
                this.renameVmDialog.hide();
                this.addLog("Rename Virtual Machine", currentName, node, 0);

                this.vmLiveVar.setOperation("update");
                this.vmLiveVar.sourceData.setData({
                    id: this.vmLiveVar.getValue("id"),
                    displayedname: newName
                });
                this.vmLiveVar.update();
            }
        } catch (e) {
            console.error('ERROR IN btnRenameVmSaveClick: ' + e);
            this.showToastError(this.name + "ERROR IN btnRenameVmSaveClick: " + e.toString());
        }
    },
    renameVmNameChange: function(inSender) {
        try {
            var notFound = true;
            var vName = this.renameVmName.getDisplayValue();
            var vmCount = this.tablevmsLiveVariable2.getCount();
            var oldname = this.vmLiveVar.getValue("name");

            for (var j = 0; j < vmCount; j++) {
                var vmInfo = this.tablevmsLiveVariable2.getItem(j);
                var vm = vmInfo.getValue("name");
                var dVm = vmInfo.getValue("displayedname");
                if (vm !== oldname) {
                    if ((vm === vName) || (dVm === vName)) {
                        var msg = "Virtual Machine names must be unique within an OpenKVI instance";
                        var title = vm + " name already exist";
                        app.toastDialog.showToast(msg, 5000, "Warning", "cc", title);
                        this.renameVmName.setRegExp("^((?!" + vm + ").)*$");
                        //this.layerGeneral.activate();\w*
                        notFound = false;
                    }
                }
            }
            if (notFound === true) {
                this.renameVmName.setRegExp("^[A-Za-z0-9]+(?:-?_?[A-Za-z0-9]+)+$");
            }
        } catch (e) {
            console.error('ERROR IN renameVmNameChange: ' + e);
            this.showToastError(this.name + "ERROR IN renameVmNameChange: " + e.toString());
        }
    },
    vmLiveVarResult: function(inSender, inDeprecated) {
        try {
            var user = this.templateUsernameVar.getValue("dataValue");
            var node = this.varSelectedServer.getValue("dataValue");
            var str;
            var request;

            if (this.vmLiveVar.operation === "read") {
                var vName = this.vmLiveVar.getValue("displayedname");
                if (vName === "") vName = this.vmLiveVar.getValue("name");
                this.renameVmName.setValue("dataValue", vName);
                this.renameVmDialog.show();
            } else if (this.vmLiveVar.operation === "update") {
                request = "renameVM";
                var vm = this.vmLiveVar.getValue("name");
                var extraInfos = {
                    "vm": vm,
                    "owner": user,
                    "oldname": this["Label" + vm + "__" + node].caption,
                    "newname": this.vmLiveVar.getValue("displayedname")
                };

                var infos2 = {
                    "vm": this.vmLiveVar.getValue("name"),
                    "owner": user,
                    "oldname": this["Label" + this.vmLiveVar.getValue("name") + "__" + node].caption,
                    "newname": this.vmLiveVar.getValue("displayedname")
                };

                node = this.varSelectedServer.getValue("dataValue");
                this.javaNotifyAll.input.setValue("node", node);
                this.javaNotifyAll.input.setValue("request", request);
                this.javaNotifyAll.input.setValue("infos", extraInfos);
                this.javaNotifyAll.update();
            }
        } catch (e) {
            console.error('ERROR IN vmLiveVarResult: ' + e);
        }
    },

    labelVmRenameClick: function(inSender, inEvent) {
        try {
            if (this.labelVmRename.disabled !== true) {
                this.VmPopupMenu.hide();
                this.vmLiveVar.clearData();
                var vmInfos = this.varSelectedVm.getValue("dataValue");
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];
                //var varServer = vName + "Server";
                //var node = this[varServer].getValue("dataValue");
                this.vmLiveVar.filter.setData({
                    name: vName,
                    server: node
                });
                this.vmLiveVar.sourceData.setData({
                    id: undefined
                });
                this.vmLiveVar.setOperation("read");
                this.vmLiveVar.update();
            }
        } catch (e) {
            this.showToastError("labelVmRenameClick ERROR: " + e.toString());
            console.error('ERROR IN labelVmRenameClick: ' + e);
        }
    },
    clearVmExtraInfos: function() {
        try {
            this.richVmNotes.clear();
            this.buttonSaveNotes.setShowing(false);
            for (var i = 0; i < 5; i++) {
                var ipEditor = "textVnetIp" + i;
                var vNetBtn = "editVnetIp" + i;
                var macEditor = "textVnetMac" + i;
                this[vNetBtn].setSource("resources/images/icons/actions/document-edit-16.png");
                this[vNetBtn].setHint("Edit IP");
                this[ipEditor].setReadonly(true);
                this[macEditor].clear();
                this[ipEditor].clear();
            }
            this.textOsFamily.clear();
            this.textOsFamily.setReadonly(true);
            this.textOsArch.clear();
            this.textOsArch.setReadonly(true);
            this.textOsDistro.clear();
            this.textOsDistro.setReadonly(true);
            this.textOsName.clear();
            this.textOsName.setReadonly(true);
            this.textOsVersion.clear();
            this.textOsVersion.setReadonly(true);

        } catch (e) {
            this.showToastError("clearVmExtraInfos ERROR: " + e.toString());
            console.error('ERROR IN clearVnetExtra: ' + e);
        }
    },

    richVmNotesFocus: function(inSender) {
        try {
            this.buttonSaveNotes.setShowing(true);
        } catch (e) {
            console.error('ERROR IN richVmNotesChange: ' + e);
        }
    },
    javaWriteVmExtraResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaWriteVmExtra.getValue("dataValue");
            this.buttonSaveNotes.setShowing(false);
        } catch (e) {
            console.error('ERROR IN javaWriteVmExtraResult: ' + e);
        }
    },
    buttonSaveNotesClick: function(inSender) {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            var vmData = JSON.parse(this.javaGetVmExtendedInfos.getValue("dataValue"));
            var extraInfos = this.getVmExtraInfos(vmData);
            var htmlNotes = this.richVmNotes.getDisplayValue();
            extraInfos.notes = String(htmlNotes).replace(/</g, '&<&').replace(/>/g, '&>&').replace(/"/g, '&quot;').replace(/^\s+|\s+$/g, '');
            this.javaWriteVmExtra.input.setValue("server", node);
            this.javaWriteVmExtra.input.setValue("vName", vName);
            this.javaWriteVmExtra.input.setValue("data", extraInfos);
            this.javaWriteVmExtra.update();

        } catch (e) {
            this.showToastError("buttonSaveNotesClick ERROR: " + e.toString());
            console.error('ERROR IN buttonSaveNotesClick: ' + e);
        }
    },
    onFindVnetClick: function(inSender) {
        try {
            if (! this.tabVirtualMachines.disabled) {
                this.btnLaunchVnetIpSearch.setCaption("Start scan");
                this.btnLaunchVnetIpSearch.setImageIndex(66);
                this.btnLaunchVnetIpSearch.setDisabled(false);
                this.textVnetIpRangeStart.setDataValue("");
                this.textVnetIpRangeEnd.setDataValue("");
                this.labelVnetScanInfo.setCaption("");
                this.labelScanVnetIpResult.setCaption("");
                var btnName = inSender.name.toString();
                var vnet = btnName.replace(/find/g, "");
                var macText = "text" + vnet.replace(/Ip/, "Mac");
                var macInfos = this[macText].getValue("dataValue");
                var mac = macInfos.replace(/ {2}\(.*/, "");
                this.textFindIpForMac.setDataValue(mac);
                this.loadingScanVnetIp.setShowing(false);
                this.findVnetIpDialog.show();
                
            }
            
        } catch (e) {
            this.showToastError("onFindVnetClick ERROR: " + e.toString());
            console.error('ERROR IN onFindVnetClick: ' + e);
        }
    },
    textVnetIpRangeStartChange: function(inSender) {
        try {
            var start = this.textVnetIpRangeStart.getDataValue();
            if (start !== "") {
                var args = start.split('.');
                var end = args[0]+"."+args[1]+"."+args[2]+".254";
                this.textVnetIpRangeEnd.setDataValue(end);
                this.textVnetIpRangeEnd.setRegExp(args[0]+'\.'+args[1]+'\.([0-9]{1,3}\.){1}[0-9]{1,3}');
            }
    
        } catch (e) {
            console.error('ERROR IN textVnetIpRangeStartChange: ' + e);
        }
    },
    btnLaunchVnetIpSearchClick: function(inSender) {
        try {
            if (this.btnLaunchVnetIpSearch.caption === "Start scan") {
                this.btnLaunchVnetIpSearch.setDisabled(true);
                this.labelScanVnetIpResult.setCaption("");
                var vmInfos = this.varSelectedVm.getValue("dataValue");
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];
                var mac = this.textFindIpForMac.getDataValue();
                var start_args = this.textVnetIpRangeStart.getDataValue().split('.');
                var end_args = this.textVnetIpRangeEnd.getDataValue().split('.');
                var istart = parseInt(start_args[3], 10);
                var iend = parseInt(end_args[3], 10);
                var start = this.textVnetIpRangeStart.getDataValue();
                var end = this.textVnetIpRangeEnd.getDataValue();
                if (start_args[2] === end_args[2]) {
                    if ((iend - istart) > 25) {
                        end = start_args[0]+"."+start_args[1]+"."+start_args[2]+"."+(istart + 25).toString();
                    }
                } else {
                    if ((254 - istart) > 25) {
                        end = start_args[0]+"."+start_args[1]+"."+start_args[2]+"."+(istart + 25).toString();
                    } else if (istart === 254) {
                        istart = 1;
                        var tmpstr = start_args[2];
                        start_args[2] = (parseInt(tmpstr, 10) + 1).toString();
                        start = start_args[0]+"."+start_args[1]+"."+start_args[2]+"."+istart.toString();
                        if (start_args[2] === end_args[2]) {
                            if ((iend - istart) > 25) {
                                end = start_args[0]+"."+start_args[1]+"."+start_args[2]+"."+(istart + 25).toString();
                            }
                        } else {
                            end = start_args[0]+"."+start_args[1]+"."+start_args[2]+"."+(istart + 25).toString();
                        }
                    } else {
                        end = start_args[0]+"."+start_args[1]+"."+start_args[2]+".254";
                    }                            
                }
                var range = start+","+end;
                this.labelVnetScanInfo.setCaption("Scanning range "+start+" to "+end);
                this.javaGetVmIp.input.setValue("mac", mac);
                this.javaGetVmIp.input.setValue("vm", vName);
                this.javaGetVmIp.input.setValue("range", range);
                this.javaGetVmIp.input.setValue("node", node);
                this.javaGetVmIp.update();
                this.btnLaunchVnetIpSearch.setCaption("Stop scan");
                this.btnLaunchVnetIpSearch.setImageIndex(108);
                setTimeout(function() { wm.Page.getPage("Main").btnLaunchVnetIpSearch.setDisabled(false);}, 1000);
                this.btnCancelFindVnetIp.setDisabled(true);
                this.loadingScanVnetIp.setShowing(true);
            } else {
                this.btnLaunchVnetIpSearch.setCaption("Start scan");
                this.labelVnetScanInfo.setCaption("Aborting scan ...");
                this.btnLaunchVnetIpSearch.setDisabled(true);
            }
        } catch (e) {
            console.error('ERROR IN btnLaunchVnetIpSearchClick: ' + e);
        }
    },
    textVnetIpEnterKeyPress: function(inSender) {
        try {
            var ipBtn = inSender.name.replace(/text/, "edit");
            this.onEditVnetClick(this[ipBtn]);

        } catch (e) {
            console.error('ERROR IN textVnetIp0EnterKeyPress: ' + e);
        }
    },
    getVmExtraInfos: function(vmData) {
        var extraInfos = { 
            "notes": "", 
            "networks": [], 
            "os": {
                "family": "",
                "arch": "",
                "distro": "",
                "name": "",
                "version": ""}
            };
        try {
            
            if (vmData.domain.metadata !== undefined) {
                if (vmData.domain.metadata.extra !== undefined) {
                    extra = vmData.domain.metadata.extra;
                    if (typeof(extra.notes) === "string") {
                        extraInfos.notes = extra.notes;
                    }            
                    if (extra.system !== undefined) {
                        extraInfos.os = extra.system;
                    }    
                    if (extra.networks !== undefined) {
                        if (Array.isArray(extra.networks)) {
                            for (var j = 0; j < extra.networks.length; j++) {
                                extraInfos.networks.push(extra.networks[j].vnet);
                            }
                        } else if (extra.networks.vnet) {
                            extraInfos.networks.push(extra.networks.vnet);
                        }
                    }
                }
            } 
        } catch (e) {
            console.error('ERROR in getVmExtraInfos: ' + e);
        }
        return extraInfos;
    },
    onEditVnetClick: function(inSender) {
        try {
            if (this.tabVirtualMachines.disabled !== true) {
                var ipEditor = inSender.name.replace(/edit/, "text");
                var source = inSender.source;
                if (source.indexOf("save") > 0) {
                    inSender.setSource("resources/images/icons/actions/document-edit-16.png");
                    inSender.setHint("Edit IP");

                    this[ipEditor].setReadonly(true);
                    var macEditor = ipEditor.replace(/Ip/g, "Mac");
                    var ip = this[ipEditor].getDisplayValue();
                    var mac = this[macEditor].getDisplayValue();

                    var vmInfos = this.varSelectedVm.getValue("dataValue");
                    var dic = vmInfos.split("__");
                    var vName = dic[0];
                    var node = dic[1];
                    var vmData = JSON.parse(this.javaGetVmExtendedInfos.getValue("dataValue"));
                    var extraInfos = this.getVmExtraInfos(vmData);

                    var found = false;                    
                    for (var i = 0; i < extraInfos.networks.length; i++) {
                        if (mac === extraInfos.networks[i].mac) {
                            found = true;
                            extraInfos.networks[i].ip = ip;
                        }
                    }
                    if (found === false) {
                        extraInfos.networks.push({
                            "mac": mac,
                            "ip": ip
                        });
                    }
                    this.javaWriteVmExtra.input.setValue("server", node);
                    this.javaWriteVmExtra.input.setValue("vName", vName);
                    this.javaWriteVmExtra.input.setValue("data", extraInfos);
                    this.javaWriteVmExtra.update();

                } else {
                    inSender.setSource("resources/images/icons/actions/document-save-16.png");
                    inSender.setHint("Save IP");
                    this[ipEditor].setReadonly(false);
                }
            }
        } catch (e) {
            this.showToastError("onEditVnetClick ERROR: " + e.toString());
            console.error('ERROR IN onEditVnetClick: ' + e);
        }
    },
    javaGetVmIpResult: function(inSender, inDeprecated) {
        try {
            if (this.btnLaunchVnetIpSearch.caption === "Stop scan") {
                var result = this.javaGetVmIp.getValue("dataValue");
                var jres = JSON.parse(result);
                var range_limits = jres.action.range.split(',');
                this.btnLaunchVnetIpSearch.setDisabled(false);
                if (jres.action.result) {
                    this.labelScanVnetIpResult.setCaption(jres.action.result);
                    this.btnLaunchVnetIpSearch.setCaption("Start scan");
                    this.btnLaunchVnetIpSearch.setImageIndex(66);
                    this.labelVnetScanInfo.setCaption("Scan complete");
                    this.btnCancelFindVnetIp.setDisabled(false);
                    this.loadingScanVnetIp.setShowing(false);
                } else if (range_limits[1] !== this.textVnetIpRangeEnd.getDataValue()) {
                    var mac = this.textFindIpForMac.getDataValue();
                    var start = range_limits[1];
                    var start_args = start.split('.');
                    var end_args = this.textVnetIpRangeEnd.getDataValue().split('.');
                    var istart = parseInt(start_args[3], 10);
                    var iend = parseInt(end_args[3], 10);
                    
                    var end = this.textVnetIpRangeEnd.getDataValue();                        
                    if (start_args[2] === end_args[2]) {
                        if ((iend - istart) > 25) {
                            end = start_args[0]+"."+start_args[1]+"."+start_args[2]+"."+(istart + 25).toString();
                        }
                    } else {
                        if ((254 - istart) > 25) {
                            end = start_args[0]+"."+start_args[1]+"."+start_args[2]+"."+(istart + 25).toString();
                        } else if (istart === 254) {
                            istart = 1;                            
                            var tmpstr = start_args[2];
                            start_args[2] = (parseInt(tmpstr, 10) + 1).toString();
                            start = start_args[0]+"."+start_args[1]+"."+start_args[2]+"."+istart.toString();
                            if (start_args[2] === end_args[2]) {
                                if ((iend - istart) > 25) {
                                    end = start_args[0]+"."+start_args[1]+"."+start_args[2]+"."+(istart + 25).toString();
                                }
                            } else {
                                end = start_args[0]+"."+start_args[1]+"."+start_args[2]+"."+(istart + 25).toString();
                            }
                        } else {
                            end = start_args[0]+"."+start_args[1]+"."+start_args[2]+".254";
                        }                            
                    }
                    var range = start+","+end;
                    this.labelVnetScanInfo.setCaption("Scanning range "+start+" to "+end);
                    
                    this.javaGetVmIp.input.setValue("mac", mac);
                    this.javaGetVmIp.input.setValue("vm", jres.action.vm);
                    this.javaGetVmIp.input.setValue("range", range);
                    this.javaGetVmIp.input.setValue("node", jres.node);
                    this.javaGetVmIp.update();
                } else {
                    this.labelVnetScanInfo.setCaption("Scan complete: no IP found !");
                    this.btnLaunchVnetIpSearch.setCaption("Start scan");
                    this.btnLaunchVnetIpSearch.setImageIndex(66);
                    this.btnCancelFindVnetIp.setDisabled(false);
                    this.loadingScanVnetIp.setShowing(false);
                }
            } else {
                this.labelVnetScanInfo.setCaption("Scan aborted");
                this.btnLaunchVnetIpSearch.setDisabled(false);
                this.btnLaunchVnetIpSearch.setImageIndex(66);
                this.btnCancelFindVnetIp.setDisabled(false);
                this.loadingScanVnetIp.setShowing(false);
            }
        } catch (e) {
            this.showToastError("javaGetVmIpResult ERROR: " + e.toString());
            console.error('ERROR IN javaGetVmIpResult: ' + e);
        }
    },
    btnApplyFoundIpClick: function(inSender) {
        try {
            var mac = this.textFindIpForMac.getDataValue();
            for (var i = 0; i < 5; i++) {
                var index = parseInt(i, 10);
                var component = "textVnetMac"+index;
                var tmpmac = this[component].getDataValue();
                if (tmpmac === mac) {
                    this["textVnetIp"+index].setDisplayValue(this.labelScanVnetIpResult.caption);
                    this["editVnetIp"+index].setSource("resources/images/icons/actions/document-save-16.png");
                    this["editVnetIp"+index].setHint("Save IP");
                    this.onEditVnetClick(this["editVnetIp"+index]);
                }
            }
            this.findVnetIpDialog.hide();
            
        } catch (e) {
            console.error('ERROR IN btnApplyFoundIpClick: ' + e);
        }
    },
    findOsInfosClick: function(inSender) {
        try {
            if (this.tabVirtualMachines.disabled !== true) {
                var vmInfos = this.varSelectedVm.getValue("dataValue");
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];
                var picLabel = "picLabel" + vName + '__' + node;
                iconState = this[picLabel].caption;
                if (iconState.indexOf("start2") > -1) {
                    this.findOsInfos.setSource("resources/images/icons/loading/ajax-loader-arrows.gif");
                    //app.toastDialog.showToast("This function has not been implemented yet.", 5000, "Warning", "cc", "Not yet supported");
                    this.javaGetRunningOs.input.setValue("node", node);
                    this.javaGetRunningOs.input.setValue("vName", vName);
                    this.javaGetRunningOs.update();
                }
            }
        } catch (e) {
            this.showToastError("findOsInfosClick ERROR: " + e.toString());
            console.error('ERROR IN findOsInfosClick: ' + e);
        }
    },
    editOsInfosClick: function(inSender) {
        try {
            if (this.tabVirtualMachines.disabled !== true) {
                var source = inSender.source;
                if (source.indexOf("save") > 0) {
                    inSender.setSource("resources/images/icons/actions/document-edit-16.png");
                    inSender.setHint("Edit Operating System information");
                    this.textOsFamily.setReadonly(true);
                    this.textOsArch.setReadonly(true);
                    this.textOsDistro.setReadonly(true);
                    this.textOsName.setReadonly(true);
                    this.textOsVersion.setReadonly(true);

                    var vmInfos = this.varSelectedVm.getValue("dataValue");
                    var dic = vmInfos.split("__");
                    var vName = dic[0];
                    var node = dic[1];
                    var vmData = JSON.parse(this.javaGetVmExtendedInfos.getValue("dataValue"));
                    var extraInfos = this.getVmExtraInfos(vmData);
                    
                    var family = this.textOsFamily.getDisplayValue();
                    var arch = this.textOsArch.getDisplayValue();
                    var distro = this.textOsDistro.getDisplayValue();
                    var name = this.textOsName.getDisplayValue();
                    var version = this.textOsVersion.getDisplayValue();

                    extraInfos.os = {
                        "family": family,
                        "arch": arch,
                        "distro": distro,
                        "name": name,
                        "version": version
                    };

                    this.javaWriteVmExtra.input.setValue("server", node);
                    this.javaWriteVmExtra.input.setValue("vName", vName);
                    this.javaWriteVmExtra.input.setValue("data", extraInfos);
                    this.javaWriteVmExtra.update();

                } else {
                    inSender.setSource("resources/images/icons/actions/document-save-16.png");
                    inSender.setHint("Save Operating System information");
                    this.textOsFamily.setReadonly(false);
                    this.textOsArch.setReadonly(false);
                    this.textOsDistro.setReadonly(false);
                    this.textOsName.setReadonly(false);
                    this.textOsVersion.setReadonly(false);
                }
            }
        } catch (e) {
            this.showToastError("editOsInfosClick ERROR: " + e.toString());
            console.error('ERROR IN editOsInfosClick: ' + e);
        }
    },
    textOsEnterKeyPress: function(inSender) {
        try {
            this.editOsInfosClick(this.editOsInfos);

        } catch (e) {
            console.error('ERROR IN textOsFamilyEnterKeyPress: ' + e);
        }
    },
    javaGetRunningOsResult: function(inSender, inDeprecated) {
        try {
            this.findOsInfos.setSource("resources/images/icons/actions/tools-wizard-16.png");
            var result = this.javaGetRunningOs.getValue("dataValue");
            this.logDebugVM("javaGetRunningOsResult: " + result);
            var jsonVar = JSON.parse(result).action.result;
            if (Array.isArray(jsonVar.operatingsystems.operatingsystem)) {
                os_infos = jsonVar.operatingsystems.operatingsystem[0];
            } else {
                os_infos = jsonVar.operatingsystems.operatingsystem;
            }

            this.textOsFamily.setDisplayValue(os_infos.name);
            this.textOsArch.setDisplayValue(os_infos.arch);
            this.textOsDistro.setDisplayValue(os_infos.distro);
            var nameInfos = os_infos.product_name.split(" ");
            var name = "";
            for (i = 0; i < nameInfos.length; i++) {
                if (i === 0) {
                    name = nameInfos[0];
                } else {
                    var newLength = name.length + nameInfos[i].length;
                    if (newLength < 25) {
                        name += " " + nameInfos[i];
                    }
                }
            }
            this.textOsName.setDisplayValue(name);
            var version = os_infos.major_version + "." + os_infos.minor_version;
            this.textOsVersion.setDisplayValue(version);
            if (os_infos.distro !== "") {
                this.editOsInfos.setSource("resources/images/icons/actions/document-save-16.png");
            }
            //this.logDebugVM(result);
        } catch (e) {
            this.showToastError("javaGetRunningOsResult ERROR: " + e.toString());
            console.error('ERROR IN javaGetRunningOsResult: ' + e);
        }
    },
    TabVMsOverviewShow: function(inSender) {
        try {
            this.updateVmOverview();

        } catch (e) {
            this.showToastError("TabVMsOverviewShow ERROR: " + e.toString());
            console.error('ERROR IN TabVMsOverviewShow: ' + e);
        }
    },
    pictureVmReloadOverviewClick: function(inSender) {
        try {
            this.pictureVmReloadOverview.setSource("resources/images/icons/loading/ajax-loader-arrows.gif");
            this.updateVmOverview();

        } catch (e) {
            console.error('ERROR IN pictureVmReloadOverviewClick: ' + e);
        }
    },
    updateVmOverview: function() {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            //var varServer = vName + "Server";
            //var node = this[varServer].getValue("dataValue");
            var varConnected = node + "connected";
            var nodeOnLine = this[varConnected].getValue("dataValue");
            if (nodeOnLine) {
                this.javaGetVmScreenShot.input.setValue("vName", vName);
                this.javaGetVmScreenShot.input.setValue("node", node);
                this.javaGetVmScreenShot.update();
            }

        } catch (e) {
            this.showToastError("updateVmOverview ERROR: " + e.toString());
            console.error('ERROR IN updateVmOverview: ' + e);
        }
    },
    TabVMsConfigShow: function(inSender) {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var locked = this.vmIsLocked(vmInfos);
            this.panelApplyConfigHelp.setShowing(false);
            if (locked) {
                //var lock = this.getVmLock(vName);
                this.loadingVmConfiguration.setShowing(true);

            } else {
                this.reloadVmConfig("TabVMsConfigShow");
                this.loadingVmConfiguration.setShowing(false);
            }

        } catch (e) {
            this.showToastError("TabVMsConfigShow ERROR: " + e.toString());
            console.error('ERROR IN TabVMsConfigShow: ' + e);
        }
    },
    vmLayerActivate: function(configName) {
        try {
            var varOldItem = this.varSelectedVmConfig.getValue("dataValue") || "labelVmStorages";
            var varOldPanel = varOldItem.replace(/label/g, "panel");
            var varOldLayer = varOldItem.replace(/label/g, "layer");
            var labelName = "label" + configName;
            var panelName = "panel" + configName;
            var layerName = "layer" + configName;
            var func = "get" + configName + "Info";

            this.varSelectedVmConfig.setValue("dataValue", labelName);
            //this[varOldPanel].removeUserClass("wm_BorderShadow_WeakShadow");
            this[varOldPanel].domNode.style.backgroundColor = "#ffffff";
            //this.panelDatacenter.addUserClass("wm_BorderShadow_WeakShadow");
            //this[panelName].domNode.style.backgroundColor = "#dfd8d8";
            this[panelName].domNode.style.backgroundColor = "#c8c8c8";

            this[func]();
            this.disableVmConfigSave();
            this._vmConfigHotswapable = "";
            this[layerName].activate();

        } catch (e) {
            this.showToastError("vmLayerActivate: " + e.toString());
            console.error('ERROR IN vmLayerActivate: ' + e);
        }
    },
    reloadVmConfig: function(inSender) {
        try {

            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            //var varServer = vName + "Server";
            //var node = this[varServer].getValue("dataValue");
            var varIP = node + "ip";
            var sIP = this[varIP].getValue("dataValue");
            //this.getNodeInformation(node, true);
            this.getVmInfos(vName, node);
        } catch (e) {
            this.showToastError("reloadVmConfig: " + e.toString());
            console.error('ERROR IN reloadVmConfig: ' + e);
        }
    },
    resetVmConfigBtnClick: function(inSender) {
        try {
            this.resetVmConfigBtn.setDisabled(true);
            this.reloadVmConfig(inSender.name);

        } catch (e) {
            this.showToastError("resetVmConfigBtnClick: " + e.toString());
            console.error('ERROR IN resetVmConfigBtnClick: ' + e);
        }
    },
    onVmConfigLayerClick: function(inSender, inEvent) {
        try {
            var labelName = inSender.name.toString();
            var configName = labelName.replace(/label/g, "");
            this.disableVmConfigSave();
            this._vmConfigHotswapable = "";
            this.vmLayerActivate(configName);


        } catch (e) {
            this.showToastError("onVmConfigLayerClick: " + e.toString());
            console.error('ERROR IN onVmConfigLayerClick: ' + e);
        }
    },
    getVmProcessorInfo: function() {
        this.varVmTimers.clearData();

        try {
            var jsonVar = JSON.parse(this.javaGetVmExtendedInfos.getValue("dataValue"));
            var vcpu = jsonVar.domain.vcpu.content;
            if (vcpu === undefined) {
                vcpu = jsonVar.domain.vcpu;
            }
            this.labelVmCurrentCpu.setCaption(vcpu);
            this.numVmNewCpu.setDisplayValue(vcpu);
            this.labelVmCurrentArch.setCaption(jsonVar.domain.os.type.arch);
            var offset = jsonVar.domain.clock.offset;
            this.selectClockOffset.setDataValue(offset);
            if (offset == "timezone") {
                this.selectTimeZone.setDisplayValue(jsonVar.domain.clock.timezone);
            }
            var cpuMod = "default";
            if ((jsonVar.domain.cpu !== undefined) && (jsonVar.domain.cpu.mode !== undefined)) {
                cpuMod = jsonVar.domain.cpu.mode;
            }
            if (cpuMod === "custom") {
                cpuMod = "default";
            }
            this.selectCpuModel.setDataValue(cpuMod);

            if (jsonVar.domain.clock.timer !== undefined) {
                jsonTimers = jsonVar.domain.clock.timer;
                var timers = [];
                if (Object.prototype.toString.call(jsonTimers) === "[object Array]") {
                    timers = jsonTimers;
                } else {
                    timers[0] = jsonTimers;
                }
                for (var i = 0; i < timers.length; i++) {
                    var present = timers[i].present;
                    if (present === undefined) {
                        present = "yes";
                    }
                    var track = timers[i].track;
                    if (track === undefined) {
                        track = "";
                    }
                    var frequency = timers[i].frequency;
                    if (frequency === undefined) {
                        frequency = "";
                    }
                    var mode = timers[i].mode;
                    if (mode === undefined) {
                        mode = "";
                    }
                    var newTimerEntry = {
                        "name": timers[i].name,
                        "tickpolicy": timers[i].tickpolicy,
                        "track": track,
                        "present": present,
                        "frequency": frequency,
                        "mode": mode,
                        "status": ""
                    };
                    this.varVmTimers.addItem(newTimerEntry);
                }
            }
            this.gridVmTimerList.reflow();
            this.btnUpdateVmTimer.setDisabled(true);
            this.btnRemoveVmTimer.setDisabled(true);

        } catch (e) {
            this.showToastError("getVmProcessorInfo ERROR: " + e.toString());
            console.error('ERROR IN getVmProcessorInfo: ' + e);
        }
    },
    getVmMemoryInfo: function() {
        try {
            var jsonVar = JSON.parse(this.javaGetVmExtendedInfos.getValue("dataValue"));
            var memKb = jsonVar.domain.memory.content;
            if (memKb === undefined) {
                memKb = jsonVar.domain.memory;
            }
            var mem = Math.floor(parseInt(memKb, 10) / 1024);
            this.labelVmCurrentMem.setCaption(mem);
            this.numVmNewMem.setDataValue(mem);

        } catch (e) {
            this.showToastError("getVmMemoryInfo ERROR: " + e.toString());
            console.error('ERROR IN getVmMemoryInfo: ' + e);
        }
    },
    getVmBiosInfo: function() {
        this.varFeatureList.clearData();

        try {
            var jsonVar = JSON.parse(this.javaGetVmExtendedInfos.getValue("dataValue"));
            // boot options
            bootList = ["network", "cdrom", "hd"];
            this.varBootList.clearData();
            var count = jsonVar.domain.os.boot.length;
            var index = 0;
            if (count) {
                for (var i = 0; i < count; i++) {
                    this.varBootList.addItem({
                        "name": jsonVar.domain.os.boot[i].dev,
                        "checked": true
                    });
                    index = bootList.indexOf(jsonVar.domain.os.boot[i].dev);
                    if (index != -1) bootList.splice(index, 1);
                }
            } else {
                this.varBootList.addItem({
                    "name": jsonVar.domain.os.boot.dev,
                    "checked": true
                });
                index = bootList.indexOf(jsonVar.domain.os.boot.dev);
                if (index != -1) bootList.splice(index, 1);
            }
            bootcount = bootList.length;
            if (bootcount > 0) {
                for (var j = 0; j < bootcount; j++) {
                    this.varBootList.addItem({
                        "name": bootList[j],
                        "checked": false
                    });
                }
            }
            var bootmenu = "no";
            try {
                bootmenu = jsonVar.domain.os.bootmenu.enable;
            } catch (e1) {
                bootmenu = "none";
            } finally {
                if (bootmenu === "yes") {
                    this.showMenuBox.setChecked(true);
                } else {
                    this.showMenuBox.setChecked(false);
                }
            }
            //lifecylce options:
            this.selectOnCrash.setDataValue(jsonVar.domain.on_crash);
            this.selectOnReboot.setDataValue(jsonVar.domain.on_reboot);
            this.selectOnPoweroff.setDataValue(jsonVar.domain.on_poweroff);
            //hardware options:
            var featureList = ["pae", "acpi", "apic", "hap"];
            for (var feature in jsonVar.domain.features) {
                if (jsonVar.domain.features.hasOwnProperty(feature)) {
                    this.varFeatureList.addItem({
                        "name": feature,
                        "checked": true
                    });
                    var fIndex = featureList.indexOf(feature);
                    if (fIndex != -1) featureList.splice(fIndex, 1);
                }
            }
            var Fcount = featureList.length;
            if (Fcount > 0) {
                for (var k = 0; k < Fcount; k++) {
                    this.varFeatureList.addItem({
                        "name": featureList[k],
                        "checked": false
                    });
                }
            }
            this.panelBootListMove.setDisabled(true);

        } catch (e) {
            this.showToastError("getVmBiosInfo ERROR: " + e.toString());
            console.error('ERROR IN getVmBiosInfo: ' + e);
        }
    },
    getVmStoragesInfo: function() {
        this.varVmDiskList.clearData();
        this.varVmStorageActions.clearData();

        try {
            var result = this.javaGetVmExtendedInfos.getValue("dataValue");
            var jsonVar = JSON.parse(result);

            if (jsonVar.domain.devices.hasOwnProperty('disk')) {
                var storageCount = jsonVar.domain.devices.disk.length;
                var diskArray = [];
                if (storageCount > 1) {
                    for (var n = 0; n < storageCount; n++) {
                        diskArray[n] = jsonVar.domain.devices.disk[n];
                    }
                } else if (result.search('disk":{') > -1) {
                    diskArray[0] = jsonVar.domain.devices.disk;
                }

                var array = "";
                var name = "";
                var path = "";
                var type = "";
                var target = "";
                var format = "";
                var vsize = "";
                var rsize = "";
                var icon = "";
                var bus = "";
                var busType = "";
                var cache = "";
                var l = 1;

                for (var i = 0; i < diskArray.length; i++) {
                    strDisk = JSON.stringify(diskArray[i]);
                    //this.logDebugVM(strDisk);
                    format = "";
                    if (diskArray[i].type === "file") {
                        if (strDisk.search('"source":{') > -1) {
                            array = diskArray[i].source.file.split("/");
                            path = "";
                            for (l = 1; l < array.length - 1; l++) {
                                path += "/" + array[l];
                            }
                            path += "/";
                            name = array[array.length - 1];
                        } else {
                            path = "";
                            name = "";
                        }
                        if (strDisk.search('"driver":{') > -1) {
                            format = diskArray[i].driver.type;
                        } else {
                            format = "<I>unknown</I>";
                        }
                        if (strDisk.search('"vsize":') > -1) {
                            vsize = diskArray[i].vsize;
                        } else {
                            vsize = "<I>unknown</I>";
                        }
                        if (strDisk.search('"rsize":') > -1) {
                            rsize = diskArray[i].rsize;
                        } else {
                            rsize = "<I>unknown</I>";
                        }
                        target = diskArray[i].target.dev;
                        type = diskArray[i].type;
                        if (diskArray[i].device === "cdrom") {
                            icon = '<image title="cdrom"; style="height: 30px;" src="resources/images/icons/hardware/media-optical.png"/>';
                        } else {
                            icon = '<image title="harddisk"; style="height: 30px;" src="resources/images/icons/hardware/drive-harddisk.png"/>';
                        }
                    } else if (diskArray[i].type === "block") {
                        if (strDisk.search('"source":{') > -1) {
                            array = diskArray[i].source.dev.split("/");
                            path = diskArray[i].source.dev;
                            name = array[array.length - 1];
                        } else {
                            path = "";
                            name = "";
                        }
                        if (strDisk.search('"driver":{') > -1) {
                            format = diskArray[i].driver.type;
                        } else {
                            format = "<I>unknown</I>";
                        }
                        vsize = "";
                        rsize = "";
                        icon = '<image style="height: 30px;" src="resources/images/icons/hardware/media-optical.png"/>';
                        type = "cdrom";
                        target = diskArray[i].target.dev;

                    }

                    if (strDisk.search('"target":{') > -1) {
                        bus = diskArray[i].target.dev;
                    } else {
                        bus = "<I>unknown</I>";
                    }
                    if (strDisk.search('"bus":') > -1) {
                        busType = diskArray[i].target.bus;
                    } else {
                        busType = "<I>unknown</I>";
                    }
                    if (strDisk.search('"cache":') > -1) {
                        cache = diskArray[i].driver.cache;
                    } else {
                        cache = "default";
                    }

                    this.varVmDiskList.addItem({
                        "name": name,
                        "type": type,
                        "path": path,
                        "device": target,
                        "format": format,
                        "size": vsize,
                        "used": rsize,
                        "icon": icon,
                        "bus": bus,
                        "busType": busType,
                        "cache": cache
                    });
                }
                this.gridVmDisks.reflow();
                this.updateVmStorageBtn.setDisabled(true);
                this.removeVmStorageBtn.setDisabled(true);
                this.deleteVmStorageBtn.setDisabled(true);
                this.eraseVmStorageBtn.setDisabled(true);
            }
        } catch (e) {
            this.showToastError("getVmStoragesInfo ERROR: " + e.toString());
            console.error('ERROR IN getVmStoragesInfo: ' + e);
        }
    },
    getVmNetworksInfo: function() {
        this.varNetworkInput.clearData();
        try {
            var result = this.javaGetVmExtendedInfos.getValue("dataValue");
            var jsonString = result.replace(/interface/g, "interfaces");
            var jsonVar = JSON.parse(jsonString);
            this.logDebugVM("exented VM Info: " + result);

            var result2 = this.javaGetVmVnics.getValue("dataValue");
            var vnicStates = JSON.parse(result2).action.result;
            this.logDebugVM("javaGetVmVnics: " + result2);

            if (jsonString.search('"interfaces":') > -1) {
                //this.logDebugVM("interfaces:"+JSON.stringify(jsonVar.domain.devices.interfaces));
                var networkCount = jsonVar.domain.devices.interfaces.length;
                var networkArray = [];
                if (networkCount > 1) {
                    for (var n = 0; n < networkCount; n++) {
                        networkArray[n] = jsonVar.domain.devices.interfaces[n];
                    }
                } else {
                    networkArray[0] = jsonVar.domain.devices.interfaces;
                }

                var source = "";
                var model = "";
                var mac = "";
                var type = "";
                var option = "";
                var connected = "";
                //var icon = '<image title="network"; style="height: 30px;" src="resources/images/icons/hardware/network-card.png"/>';
                var icon = "resources/images/icons/hardware/network-card.png";
                for (var i = 0; i < networkArray.length; i++) {
                    type = networkArray[i].type;
                    if (networkArray[i].model === undefined) {
                        model = "unknown";
                    } else {
                        model = networkArray[i].model.type;
                    }
                    portgroup = "<i>none</i>";
                    if (type.search('bridge') > -1) {
                        source = networkArray[i].source.bridge;
                        type = "Bridge";
                    } else if (type.search('network') > -1) {
                        source = networkArray[i].source.network;
                        type = "network";
                        if (networkArray[i].source.portgroup === undefined) {
                            portgroup = "<i>default</i>";
                        } else {
                            portgroup = networkArray[i].source.portgroup;
                        }
                    } else if (type.search('user') > -1) {
                        type = "Userspace SLIRP";
                        //bridge = networkArray[i].source.user;
                    } else if (type.search('direct') > -1) {
                        type = "Direct Access";
                        source = networkArray[i].source.dev;
                        option = networkArray[i].source.mode;
                    } else if (type.search('mcast') > -1) {
                        type = "Multicast Tunnel";
                        source = networkArray[i].source.address;
                        option = networkArray[i].source.port;
                    } else if (type.search('server') > -1) {
                        type = "TCP Tunnel";
                        source = networkArray[i].source.address;
                        option = networkArray[i].source.port;
                    }


                    if (networkArray[i].link === undefined) {
                        connected = "yes";
                    } else {
                        if ((networkArray[i].link.state === "down")) {
                            connected = "no";
                        } else {
                            connected = "yes";
                        }
                    }
                    mac = networkArray[i].mac.address;
                    var link = false;
                    if (vnicStates.error !== "Domain is not active") {
                        for (var j = 0; j < vnicStates.vnics.length; j++) {
                            if (vnicStates.vnics[j].mac === mac) {
                                if (connected === "no") {
                                    link = false;
                                } else if (vnicStates.vnics[j].state === "up") {
                                    link = true;
                                }
                                if (type === "network") {
                                    // see varNetworkDeviceType
                                    if (vnicStates.vnics[j].device_type === "openvswitch") {
                                        if (vnicStates.vnics[j].source.indexOf("private_") === 0) {
                                            type = "Private Bridge";
                                        } else {
                                            type = "OpenVswitch";
                                        }
                                    } else if (vnicStates.vnics[j].device_type === "sriov") {
                                        type = "SR-IOV Passthrough";
                                    } else {
                                        type = "Virtual Network";
                                    }
                                }
                            }
                        }
                    }
                    this.varNetworkInput.addItem({
                        "source": source,
                        "portgroup": portgroup,
                        "option": option,
                        "type": type,
                        "model": model,
                        "mac": mac,
                        "status": icon,
                        "connected": connected,
                        "link": link
                    });
                }
            }
            this.gridVmNetworks.reflow();
            this.updateVmNetworkBtn.setDisabled(true);
            this.removeVmNetworkBtn.setDisabled(true);

        } catch (e) {
            this.showToastError("getVmNetworksInfo ERROR: " + e.toString());
            console.error('ERROR IN getVmNetworksInfo: ' + e);
        }
    },
    getVmVideoInfo: function() {
        this.varGraphicList.clearData();

        try {
            var jsonVar = JSON.parse(this.javaGetVmExtendedInfos.getValue("dataValue"));
            var jsonString = this.javaGetVmExtendedInfos.getValue("dataValue");
            this.selectVideoModel.setDisplayValue(jsonVar.domain.devices.video.model.type);
            this.headNumber.setDataValue(jsonVar.domain.devices.video.model.heads);
            this.vramNumber.setDataValue(jsonVar.domain.devices.video.model.vram);

            var graphicArray = [];
            var graphicCount = jsonVar.domain.devices.graphics.length;
            if (graphicCount > 1) {
                for (var i = 0; i < graphicCount; i++) {
                    graphicArray[i] = jsonVar.domain.devices.graphics[i];
                }
            } else if (jsonString.search('"graphics":{') > -1) {
                graphicArray[0] = jsonVar.domain.devices.graphics;
            }

            var port = "";
            var autoport = "";
            var keymap = "";
            var type = "";
            var listen = "";
            var icon = "";
            for (var n = 0; n < graphicArray.length; n++) {
                port = "";
                autoport = "";
                keymap = "";
                type = "";
                listen = "";
                icon = "";
                type = graphicArray[n].type;
                var str = JSON.stringify(graphicArray[n]);
                if (str.indexOf("keymap") > -1) {
                    keymap = graphicArray[n].keymap;
                } else {
                    keymap = "";
                }
                if (type === "vnc") {
                    icon = '<image style="height: 30px;" src="resources/images/icons/hardware/vnc.png" align="middle"/>';
                    //icon = "resources/images/icons/hardware/vnc.png";
                    port = graphicArray[n].port;
                    autoport = graphicArray[n].autoport;
                    if (graphicArray[n].listen !== undefined) {
                        if (graphicArray[n].listen.length === 2) {
                            listen = graphicArray[n].listen[0];
                        } else {
                            listen = graphicArray[n].listen;
                        }
                    } else {
                        listen = "";
                    }
                } else {
                    icon = '<image style="height: 30px;" src="resources/images/icons/hardware/sdl.png" align="middle"/>';
                    listen = graphicArray[n].display;
                }
                this.varGraphicList.addItem({
                    "port": port,
                    "autoport": autoport,
                    "type": type,
                    "keymap": keymap,
                    "listen": listen,
                    "icon": icon
                });
            }
            this.varVmConfigUpdate.clearData();
            this.gridGraphics.reflow();
            this.updateVmGraphicBtn.setDisabled(true);
            this.removeVmGraphicBtn.setDisabled(true);

        } catch (e) {
            this.showToastError("getVmVideoInfo ERROR: " + e.toString());
            console.error('ERROR IN getVmVideoInfo: ' + e);
        }
    },
    getVmInputsInfo: function() {
        this.varVmInputList.clearData();

        try {
            var type = "";
            var bus = "";

            var jsonVar = JSON.parse(this.javaGetVmExtendedInfos.getValue("dataValue"));
            if (jsonVar.domain.devices.input) {
                if (typeof(jsonVar.domain.devices.input.type) === "string") { // only one input
                    type = jsonVar.domain.devices.input.type;
                    if (type === "mouse") {
                        icon = '<image style="height: 30px;" src="resources/images/icons/hardware/input-mouse.png" align="middle"/>';
                    } else {
                        icon = '<image style="height: 30px;" src="resources/images/icons/hardware/input-tablet.png" align="middle"/>';
                    }
                    bus = jsonVar.domain.devices.input.bus;
                    this.varVmInputList.addItem({
                        "bus": bus,
                        "type": type,
                        "icon": icon
                    });
                } else {
                    for (var n = 0; n < jsonVar.domain.devices.input.length; n++) {
                        type = jsonVar.domain.devices.input[n].type;
                        bus = jsonVar.domain.devices.input[n].bus;
                        if (type === "mouse") {
                            icon = '<image style="height: 30px;" src="resources/images/icons/hardware/input-mouse.png" align="middle"/>';
                        } else {
                            icon = '<image style="height: 30px;" src="resources/images/icons/hardware/input-tablet.png" align="middle"/>';
                        }
                        this.varVmInputList.addItem({
                            "bus": bus,
                            "type": type,
                            "icon": icon
                        });
                    }
                }
            }
            this.varVmConfigUpdate.clearData();
            this.gridVmInputs.reflow();
            this.updateVmInputBtn.setDisabled(true);
            this.removeVmInputBtn.setDisabled(true);

        } catch (e) {
            this.showToastError("getVmInputsInfo ERROR: " + e.toString());
            console.error('ERROR IN getVmInputsInfo: ' + e);
        }
    },
    getVmTerminalsInfo: function() {
        this.varVmConsoleList.clearData();

        try {
            var type = "";
            var port = "";

            var jsonVar = JSON.parse(this.javaGetVmExtendedInfos.getValue("dataValue"));
            if (typeof(jsonVar.domain.devices.console.type) === "string") { // only one console
                type = jsonVar.domain.devices.console.target.type;
                port = jsonVar.domain.devices.console.target.port;
                this.varVmConsoleList.addItem({
                    "port": port,
                    "type": type
                });
            } else {
                var consoleCount = jsonVar.domain.devices.console.length;
                for (var n = 0; n < consoleCount; n++) {
                    type = jsonVar.domain.devices.console[n].target.type;
                    port = jsonVar.domain.devices.console[n].target.port;
                    this.varVmConsoleList.addItem({
                        "port": port,
                        "type": type
                    });
                }
            }

        } catch (e) {
            this.showToastError("getVmTerminalsInfo ERROR: " + e.toString());
            console.error('ERROR IN getVmTerminalsInfo: ' + e);
        }
    },
    getVmSerialsInfo: function() {
        this.varVmSerialList.clearData();

        try {
            var type = "";
            var port = "";

            var jsonVar = JSON.parse(this.javaGetVmExtendedInfos.getValue("dataValue"));
            if (typeof(jsonVar.domain.devices.serial.type) === "string") {
                type = jsonVar.domain.devices.serial.type;
                port = jsonVar.domain.devices.serial.target.port;
                this.varVmSerialList.addItem({
                    "port": port,
                    "type": type
                });
            } else {
                var serialCount = jsonVar.domain.devices.console.length;
                for (var n = 0; n < serialCount; n++) {
                    type = jsonVar.domain.devices.serial[n].type;
                    port = jsonVar.domain.devices.serial[n].target.port;
                    this.varVmSerialList.addItem({
                        "port": port,
                        "type": type
                    });
                }
            }

        } catch (e) {
            this.showToastError("getVmSerialsInfo ERROR: " + e.toString());
            console.error('ERROR IN getVmSerialsInfo: ' + e);
        }
    },
    setVmInfo: function(vmData) {
        try {
            this.resetVmConfigBtn.setDisabled(false);
            var varOldItem = null;
            var configFunc = null;
            var data = null;
            var err = "";
            this.logDebugVM("VmInfo: " + vmData);
            var node = "";
            var vName = "";
            var varPictWait = "";
            if (vmData.indexOf("Error") > -1) {
                if (vmData.indexOf("::") > -1) {
                    //Error from nodemanager
                    var infos = vmData.split("::");
                    vName = infos[0];
                    node = infos[1];
                    err = infos[2];                    
                    if (err.indexOf("state") > -1) {
                        var errdata = JSON.parse(err);
                        err = errdata.state;
                    }
                    picLabel = "picLabel" + vName + "__" + node;
                    uri = '<image style="height: 20px;" src="resources/images/icons/20/dialog-warning-20.png"/>';
                    this.deactivateVm(vName, node, err);
                    this[picLabel].setCaption(uri);
                    this[picLabel].reflow();
                    
                    varPictWait = "PictVmWait" + vName + "__" + node;
                    if (this[varPictWait] !== undefined) {
                        this[varPictWait].setDisabled(true);
                        this[varPictWait].setShowing(false);
                    }
                    if (err !== undefined) {
                        err = err.replace(/Error/g, "Failed");
                        this.updateLog("Get Virtual Machine information", vName, node, err);
                    }
                } else {
                    try {
                        data = JSON.parse(vmData);
                        err = data.error;
                        this.updateLog("Get Virtual Machine information", data.domain.name, data.node, err);
                        picLabel = "picLabel" + data.domain.name + "__" + data.node;
                        uri = '<image style="height: 20px;" src="resources/images/icons/20/dialog-warning-20.png"/>';
                        this.deactivateVm(data.domain.name, data.node, err);
                        this[picLabel].setCaption(uri);
                        this[picLabel].reflow();
                    } catch(e0) {
                        app.toastDialog.showToast("A error occured when parsing VM's configuration.", 5000, "Error", "cc", "Unexpected error");
                    }
                }
                varOldItem = this.varSelectedVmConfig.getValue("dataValue") || "labelVmStorages";
                configFunc = varOldItem.replace(/label/g, "");
                this.vmLayerActivate(configFunc);
            } else {
                tmpData = vmData.replace(/interface/g, "interfaces");
                data = JSON.parse(tmpData);
                vName = data.domain.name;
                node = data.node;
                this.javaGetVmVnics.input.setValue("vName", vName);
                this.javaGetVmVnics.input.setValue("node", node);
                this.javaGetVmVnics.update();

                if ((data.error !== undefined) && (data.error.length > 0)) {
                    this.updateLog("Get Virtual Machine information", vName, node, data.error);
                }

                varPictWait = "PictVmWait" + vName + "__" + node;
                if (this[varPictWait] !== undefined) {
                    this[varPictWait].setDisabled(true);
                    this[varPictWait].setShowing(false);
                }

                varOldItem = this.varSelectedVmConfig.getValue("dataValue") || "labelVmStorages";
                configFunc = varOldItem.replace(/label/g, "");
                this.vmLayerActivate(configFunc);

                var memKb = data.domain.memory.content;
                if (memKb === undefined) {
                    memKb = data.domain.memory;
                }
                var mem = Math.floor(parseInt(memKb, 10) / 1024);

                var currentMemKb = data.domain.currentMemory.content;
                if (currentMemKb === undefined) {
                    currentMemKb = data.domain.currentMemory;
                }
                var currentMem = Math.floor(parseInt(currentMemKb, 10) / 1024);

                var vcpu = data.domain.vcpu.content;
                if (vcpu === undefined) {
                    vcpu = data.domain.vcpu;
                }
                this.textVmCpu.setDataValue(vcpu);
                this.textVmArchi.setDataValue(data.domain.os.type.arch);
                this.textVmMemory.setDataValue(mem + " MB");
                if (this._nodesData[node] !== undefined) {
                    this.textVmHostMem.setDataValue(this._nodesData[node].system.memory.toString() + " MB");
                }
                this.textVmMachine.setDataValue(data.domain.os.type.machine);
                this.textVmClock.setDataValue(data.domain.clock.offset);
                this.textVmHostCpu.setDataValue(this._nodesData[node].system.cpus + " Cores on " + this._nodesData[node].system.nodes + " CPUs");

                //clear VM network overview panel
                for (var k = 0; k < 5; k++) {
                    var panelToHide = "panelVnetInfos" + k;
                    this[panelToHide].setShowing(false);
                }
                if (Array.isArray(data.domain.devices.interfaces)) {
                    nicCount = data.domain.devices.interfaces.length;
                    if (nicCount > 5) {
                        nicCount = 5;
                    }

                    for (var i = 0; i < nicCount; i++) {
                        var ipEditor = "textVnetIp" + i;
                        this[ipEditor].setDisplayValue("");
                        var macEditor = "textVnetMac" + i;
                        var mac = data.domain.devices.interfaces[i].mac.address;
                        this[macEditor].setDisplayValue(mac);
                        var panel = "panelVnetInfos" + i;
                        this[panel].setShowing(true);
                    }
                } else { // only one interface
                    nicCount = 1;
                    var ipEditor0 = "textVnetIp0";
                    this[ipEditor0].setDisplayValue("");
                    var macEditor0 = "textVnetMac0";
                    var mac0 = data.domain.devices.interfaces.mac.address;
                    this[macEditor0].setDisplayValue(mac0);
                    var panel0 = "panelVnetInfos0";
                    this[panel0].setShowing(true);

                }

                if (data.domain.metadata !== undefined) {
                    extra = data.domain.metadata.extra;
                } else {
                    extra = undefined;
                }
                if (extra !== undefined) {
                    if ((extra.notes !== undefined) && (typeof(extra.notes) === "string")) {
                        var str = String(extra.notes).replace(/&<&/g, "<").replace(/&>&/g, ">").replace(/&quot;/g, '"');
                        this.richVmNotes.setDisplayValue(str);
                        this.buttonSaveNotes.setShowing(false);
                    }
                    if (extra.system !== undefined) {
                        this.textOsFamily.setDisplayValue(extra.system.family);
                        this.textOsArch.setDisplayValue(extra.system.arch);
                        this.textOsDistro.setDisplayValue(extra.system.distro);
                        this.textOsName.setDisplayValue(extra.system.name);
                        this.textOsVersion.setDisplayValue(extra.system.version);
                    }
                    if (extra.networks !== undefined) {
                        if (Array.isArray(extra.networks.vnet)) {
                            for (var m = 0; m < extra.networks.vnet.length; m++) {
                                for (var l = 0; l < nicCount; l++) {
                                    var macEd = "textVnetMac" + l;
                                    if (extra.networks.vnet[m].mac === this[macEd].getDisplayValue()) {
                                        var ipEd = "textVnetIp" + l;
                                        this[ipEd].setDisplayValue(extra.networks.vnet[m].ip);
                                        break;
                                    }
                                }
                            }
                        } else {
                            if (extra.networks.vnet !== undefined) {
                                for (var n = 0; n < nicCount; n++) {
                                    var macEd0 = "textVnetMac" + n;
                                    if (extra.networks.vnet.mac === this[macEd0].getDisplayValue()) {
                                        var ipEd0 = "textVnetIp" + n;
                                        this[ipEd0].setDisplayValue(extra.networks.vnet.ip);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            this.loadingDialogVm.setShowing(false);

        } catch (e) {
            this.showToastError("setVmInfo ERROR: " + e.toString());
            console.error('ERROR IN setVmInfo: ' + e);
        }
    },
    javaGetVmVnicsResult: function(inSender, inDeprecated) {
        try {
            this.getVmNetworksInfo();
        } catch (e) {
            console.error('ERROR IN javaGetVmVnicsResult: ' + e);
        }
    },
    getVmInfos: function(vName, node) {
        try {
            var varIP = node + "ip";
            var sIP = this[varIP].getValue("dataValue");
            this.javaGetVmExtendedInfos.input.setValue("vmName", vName);
            this.javaGetVmExtendedInfos.input.setValue("server", node);
            this.javaGetVmExtendedInfos.input.setValue("ipaddr", sIP);
            this.javaGetVmExtendedInfos.update();

        } catch (e) {
            console.error('ERROR IN getVmInfos: ' + e);
        }
    },
    javaGetVmExtendedInfosResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaGetVmExtendedInfos.getValue("dataValue");
            this.setVmInfo(result);
            //this.javaGetVmInfoResult(inSender, inDeprecated);       
        } catch (e) {
            console.error('ERROR IN javaGetVmExtendedInfosResult: ' + e);
        }
    },
    onINputFiledChange: function(inSender) {
        try {
            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";

        } catch (e) {
            this.showToastError("onINputFiledChange ERROR: " + e.toString());
            console.error('ERROR IN onNumberChange: ' + e);
        }
    },
    numVmNewCpuChange: function(inSender) {
        try {
            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";
        } catch (e) {
            console.error('ERROR IN numVmNewCpuChange: ' + e);
        }
    },
    selectCpuModelChange: function(inSender) {
        try {
            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";

        } catch (e) {
            console.error('ERROR IN selectCpuModelChange: ' + e);
        }
    },
    selectClockOffsetChange: function(inSender) {
        try {
            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";

            var selectedOffset = this.selectClockOffset.getValue("dataValue");
            if (selectedOffset === "timezone") {
                this.selectTimeZone.setShowing(true);
            } else {
                this.selectTimeZone.setShowing(false);
            }

        } catch (e) {
            console.error('ERROR IN selectClockOffsetChange: ' + e);
        }
    },
    selectTimeZoneChange: function(inSender) {
        try {
            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";

        } catch (e) {
            console.error('ERROR IN selectTimeZoneChange: ' + e);
        }
    },
    onInputGridCellEdited: function(inSender, inValue, rowId, fieldId) {
        try {
            this.enableVmConfigSave();


        } catch (e) {
            console.error('ERROR IN onDojoGridCellEdited: ' + e);
        }
    },

    TabVMsConfigDeactivate: function(inSender) {
        try {} catch (e) {
            console.error('ERROR IN TabVMsConfigDeactivate: ' + e);
        }
    },

    tabVirtualMachinesCanchange: function(inSender, inChangeInfo) {
        try {
            var activeLayer = inSender.getActiveLayer();
            if (activeLayer.name === "Configuration") {
                this.unsavedVirtualMachinesChanges(inChangeInfo);
            }
        } catch (e) {
            console.error('ERROR IN tabVirtualMachinesCanchange: ' + e);
        }

    },
    unsavedVirtualMachinesChanges: function(inChangeInfo) {
        try {
            if (this.vmConfigSave.disabled === false) {
                if (inChangeInfo !== undefined) {
                    this._vmTabChangeInfo = inChangeInfo;
                    if (inChangeInfo.newIndex !== undefined) {
                        inChangeInfo.canChange = false;
                    }
                }
                this.vmConfigWarningDialog.setShowing(true);
            }
        } catch (e) {
            console.error('ERROR IN unsavedMachinesChanges: ' + e);
        }
    },
    btnVmConfigDiscardClick: function(inSender) {
        try {
            this.vmConfigSave.setDisabled(true);
            if (this._vmTabChangeInfo !== null) {
                var inChangeInfo = this._vmTabChangeInfo;
                if (inChangeInfo.newIndex !== undefined) {
                    inChangeInfo.canChange = true;
                    this.tabVirtualMachines.setLayerIndex(inChangeInfo.newIndex);
                } else {
                    this[inChangeInfo](this._vmTabChangeParams[0], this._vmTabChangeParams[1]);
                }
            }
            this._vmTabChangeInfo = null;
            this.vmConfigWarningDialog.setShowing(false);

        } catch (e) {
            this.showToastError("btnVmConfigDiscardClick ERROR: " + e.toString());
            console.error('ERROR IN btnVmConfigDiscardClick: ' + e);
        }
    },
    btnWarningVmConfigSaveClick: function(inSender) {
        try {
            this.vmConfigWarningDialog.setShowing(false);
            var inChangeInfo = this._vmTabChangeInfo;
            if (inChangeInfo.canChange !== undefined) {
                inChangeInfo.canChange = true;
            }
            this.vmConfigSaveClick(inSender);

        } catch (e) {
            console.error('ERROR IN btnWarningVmConfigSaveClick: ' + e);
        }
    },
    btnCancelExitVmConfigClick: function(inSender) {
        try {
            this.vmConfigWarningDialog.setShowing(false);

        } catch (e) {
            console.error('ERROR IN btnCancelExitVmConfigClick: ' + e);
        }
    },

    vmConfigSaveClick: function(inSender) {
        try {
            var currentLayer = this.layersVmConfig.getActiveLayer();
            var layerName = currentLayer.name;
            var configName = layerName.replace(/layer/g, "");
            var funct = "update" + configName + "Info";

            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            var varIP = node + "ip";
            var sIP = this[varIP].getValue("dataValue");
            //this.addLog("Update Virtual Machine", vName, node, 30000);
            this[funct](vName, node, sIP);
            this.disableVmConfigSave();

            var varStatus = "Status" + vName + "__" + node;
            var vmState = this[varStatus].getValue("dataValue");

            if ((this._vmConfigHotswapable === "no") && (vmState === "running")) {
                this.panelApplyConfigHelp.setShowing(true);
                dojo.animateProperty({
                    node: this.panelAnnimConfigHelp.domNode,
                    duration: 300,
                    properties: {
                        height: {
                            start: '0',
                            end: '48',
                            unit: "px"
                        },
                        width: {
                            start: '550',
                            end: '550',
                            unit: "px"
                        }
                    }
                }).play();

                setTimeout(function() {
                    try {
                        wm.Page.getPage("Main").hidePanelApplyConfigHelp();
                    } catch (e) {
                        alert(e);
                    }
                }, 15000);

            }
            this._vmConfigHotswapable = "";

        } catch (e) {
            this.showToastError("vmConfigSaveClick ERROR: " + e.toString());
            console.error('ERROR IN vmConfigSaveClick: ' + e);
        }
    },
    hidePanelApplyConfigHelp: function() {
        try {
            //dojo.animateProperty({node: this.panelApplyConfigHelp.domNode, duration: 300,
            dojo.animateProperty({
                node: this.panelAnnimConfigHelp.domNode,
                duration: 300,
                properties: {
                    height: {
                        start: '48',
                        end: '0',
                        unit: "px"
                    },
                    width: {
                        start: '550',
                        end: '550',
                        unit: "px"
                    }
                }
            }).play();

            setTimeout(function() {
                try {
                    wm.Page.getPage("Main").panelApplyConfigHelp.setShowing(false);
                } catch (e) {
                    alert(e);
                }
            }, 200);
            //this.panelApplyConfigHelp.setShowing(false);
        } catch (e) {
            this.showToastError("hidePanelApplyConfigHelp ERROR: " + e.toString());
            console.error('ERROR IN hidePanelApplyConfigHelp: ' + e);
        }
    },


    onJavaUpdateVmConfigResult: function(inSender, inDeprecated) {
        var result = inSender.getValue("dataValue");
        try {
            this.logDebugVM("onJavaUpdateVmConfigResult:" + result);
            var args = result.split("::");
            var caller = args[0];
            var vName = args[1];
            var node = args[2];
            var json = args[3];
            var json2 = args[4];
            var owner = this.templateUsernameVar.getValue("dataValue");
            var flag = "error";
            if (result.indexOf("Error") > -1) {
                var jsonVar = null;
                var err = "";
                if (json.indexOf("Error") > 0) {
                    jsonVar = JSON.parse(json);
                    err = jsonVar.action.result.replace(/Error:/g, "Failed: ");
                    var task = "Update Virtual Machine";
                    if (jsonVar.action.device !== undefined) {
                        if (jsonVar.action.device === "networks") {
                            task = "Update Virtual Machine NICs";
                        } else if (jsonVar.action.device === "processor") {
                            task = "Update Virtual Machine CPUs";
                        } else if (jsonVar.action.device === "memory") {
                            task = "Update Virtual Machine Memory";
                        } else if (jsonVar.action.device === "bios") {
                            task = "Update Virtual Machine Bios";
                        } else if (jsonVar.action.device === "storages") {
                            task = "Update Virtual Machine Storages";
                        } else if (jsonVar.action.device === "video") {
                            task = "Update Virtual Machine Video";
                        } else if (jsonVar.action.device === "input") {
                            task = "Update Virtual Machine Input";
                        }
                    }
                    this.updateLog(task, vName, node, err, owner, flag);
                } else if (json2.indexOf("Error") > 0) {
                    jsonVar = JSON.parse(json2);
                    if (jsonVar.action.result.indexOf('unsupported configuration') > -1) {
                        err = "This device does not support Live Updates";
                        flag = "warning";
                    } else if (jsonVar.action.result.indexOf('domain is not active') > -1) {
                        err = "";
                    } else {
                        err = jsonVar.action.result.replace(/Error:/g, "Failed:");
                    }
                    if (err) {
                        this.updateLog("Live Update", vName, node, err, owner, flag);
                    }
                }

            } else {
                if (json2 !== undefined) {
                    flag = "successful";
                    var res = JSON.parse(json2).action.result.replace(/Success$/g, "Successful");
                    this.updateLog("Live Update", vName, node, res, owner, flag);
                }
            }
            this.getVmInfos(vName, node);

        } catch (e) {
            this.updateLog("Update Virtual Machine", "unknown", "unknown", "Failed: unknwon error");
            this.showToastError("onJavaUpdateVmConfigResult ERROR: " + e.toString());
            console.error('ERROR IN onJavaUpdateVmConfigResult: ' + e);
        }
    },
    updateVmProcessorInfo: function(vName, node, ipaddr) {
        try {
            var timers = this.varVmTimers.getData();
            var timerData = [];
            for (var i = 0; i < timers.length; i++) {
                if (timers[i].status.indexOf("delete") < 0) {
                    timerData.push(timers[i]);
                }
            }
            var cpuMod = this.selectCpuModel.getDisplayValue();
            if ((cpuMod === "") || (cpuMod === "default")) {
                cpuMod = "custom";
            }
            var data = {
                "vcpu": this.numVmNewCpu.getDataValue(),
                "offset": this.selectClockOffset.getDataValue(),
                "timezone": this.selectTimeZone.getDisplayValue(),
                "timers": timerData,
                "model": cpuMod
            };
            this.addLog("Update Virtual Machine CPUs", vName, node, 30000);
            this.javaUpdateVmProcessor.input.setValue("vName", vName);
            this.javaUpdateVmProcessor.input.setValue("server", node);
            this.javaUpdateVmProcessor.input.setValue("data", data);
            this.javaUpdateVmProcessor.update();
        } catch (e) {
            this.showToastError("updateVmProcessorInfo ERROR: " + e.toString());
            console.error('ERROR IN updateVmProcessorInfo: ' + e);
        }
    },
    updateVmMemoryInfo: function(vName, node, ipaddr) {
        try {
            this.addLog("Update Virtual Machine Memory", vName, node, 30000);
            mem = (this.numVmNewMem.getDataValue() * 1024);
            this.javaUpdateVmMemory.input.setValue("vName", vName);
            this.javaUpdateVmMemory.input.setValue("server", node);
            this.javaUpdateVmMemory.input.setValue("newMem", mem);
            this.javaUpdateVmMemory.update();
        } catch (e) {
            this.showToastError("updateVmMemoryInfo ERROR: " + e.toString());
            console.error('ERROR IN updateVmMemoryInfo: ' + e);
        }
    },
    updateVmBiosInfo: function(vName, node, ipaddr) {
        try {
            var count = this.gridBootList.getRowCount();
            var bootList = [];
            for (var i = 0; i < count; i++) {
                var device = this.gridBootList.getCell(i, "name");
                var useDevice = this.gridBootList.getCell(i, "checked");
                if (useDevice === true) {
                    bootList.push({
                        "dev": device
                    });
                }
            }
            var bootMenu = "yes";
            if (this.showMenuBox.getChecked() === false) {
                bootMenu = "no";
            }
            count = this.gridFeatureList.getRowCount();
            var featureList = [];
            for (i = 0; i < count; i++) {
                var feature = this.gridFeatureList.getCell(i, "name");
                var useFeature = this.gridFeatureList.getCell(i, "checked");
                if (useFeature === true) {
                    featureList.push({
                        "opt": feature
                    });
                }
            }

            var BiosHash = {
                "bootList": bootList,
                "bootMenu": bootMenu,
                "features": featureList,
                "on_poweroff": this.selectOnPoweroff.getDataValue(),
                "on_reboot": this.selectOnReboot.getDataValue(),
                "on_crash": this.selectOnCrash.getDataValue()
            };
            this.addLog("Update Virtual Machine Bios", vName, node, 30000);
            this.javaUpdateVmBios.input.setValue("vName", vName);
            this.javaUpdateVmBios.input.setValue("server", node);
            this.javaUpdateVmBios.input.setValue("newBiosJson", BiosHash);
            this.javaUpdateVmBios.update();

        } catch (e) {
            this.showToastError("updateVmBiosInfo ERROR: " + e.toString());
            console.error('ERROR IN updateVmBiosInfo: ' + e);
        }
    },
    updateVmStoragesInfo: function(vName, node, ipaddr) {
        try {
            var storageActions = {
                "actions": this.varVmStorageActions.getData()
            };
            this.addLog("Update Virtual Machine Storages", vName, node, 30000);
            this.logDebugVM(JSON.stringify(storageActions));
            this.javaUpdateVmStorages.input.setValue("vName", vName);
            this.javaUpdateVmStorages.input.setValue("server", node);
            this.javaUpdateVmStorages.input.setValue("ipaddr", ipaddr);
            this.javaUpdateVmStorages.input.setValue("storageActions", storageActions);
            this.javaUpdateVmStorages.update();

        } catch (e) {
            this.showToastError("updateVmStoragesInfo ERROR: " + e.toString());
            console.error('ERROR IN updateVmStoragesInfo: ' + e);
        }
    },
    updateVmNetworksInfo: function(vName, node, ipaddr) {
        try {
            var data = this.varNetworkInput.getData();
            var count = data.length;
            var hostNet = "";
            var source = "";
            var portgroup = "";
            var model = "";
            var mac = "";
            var type = "";
            var opt = "";
            var status = "";
            var action = "";
            var connected = "up";
            var netActions = [];

            for (i = 0; i < count; i++) {
                status = data[i].status;
                action = "none";
                if (status.indexOf("network-add.png") > -1) {
                    action = "add";
                } else if (status.indexOf("network-update.png") > -1) {
                    action = "update";
                } else if (status.indexOf("network-remove.png") > -1) {
                    action = "remove";
                }
                if (data[i].connected === "yes") {
                    connected = "up";
                } else {
                    connected = "down";
                }

                if ((action === "add") || (action === "remove")) {
                    source = data[i].source.replace(/<\/B>/g, "");
                    source = source.replace(/<B>/g, "");
                    portgroup = data[i].portgroup.replace(/<\/B>/g, "");
                    portgroup = portgroup.replace(/<B>/g, "");
                    model = data[i].model.replace(/<\/B>/g, "");
                    model = model.replace(/<B>/g, "");
                    mac = data[i].mac.replace(/<\/B>/g, "");
                    mac = mac.replace(/<B>/g, "");
                    type = data[i].type.replace(/<\/B>/g, "");
                    type = type.replace(/<B>/g, "");
                    opt = data[i].option.replace(/<\/B>/g, "");
                    opt = opt.replace(/<B>/g, "");
                    netActions.push({
                        "action": action,
                        "source": source,
                        "portgroup": portgroup,
                        "type": type,
                        "model": model,
                        "mac": mac,
                        "connected": connected,
                        "options": opt
                    });
                } else if (action === "update") {
                    var array1 = [];
                    var array2 = [];
                    var oldSource = "";
                    var oldPortgroup = "";
                    var oldModel = "";
                    var oldMac = "";
                    var oldType = "";
                    source = data[i].source.replace(/<\/B>/g, "");
                    if (source.indexOf("<B source=") > -1) {
                        array1 = source.split(";");
                        array2 = array1[0].split("=");
                        oldSource = array2[1].replace(/\"/g, "");
                        source = array1[1].replace(/.*>/g, "");
                    } else {
                        oldSource = source;
                    }
                    portgroup = data[i].portgroup.replace(/<\/B>/g, "");
                    if (portgroup.indexOf("<B portgroup=") > -1) {
                        array1 = portgroup.split(";");
                        array2 = array1[0].split("=");
                        oldPortgroup = array2[1].replace(/\"/g, "");
                        portgroup = array1[1].replace(/.*>/g, "");
                    } else {
                        oldPortgroup = portgroup;
                    }
                    model = data[i].model.replace(/<\/B>/g, "");
                    if (model.indexOf("<B model=") > -1) {
                        array1 = model.split(";");
                        array2 = array1[0].split("=");
                        oldModel = array2[1].replace(/\"/g, "");
                        model = array1[1].replace(/>/g, "");
                    } else {
                        oldModel = model;
                    }
                    mac = data[i].mac.replace(/<\/B>/g, "");
                    if (mac.indexOf("<B mac=") > -1) {
                        array1 = mac.split(";");
                        array2 = array1[0].split("=");
                        oldMac = array2[1].replace(/\"/g, "");
                        mac = array1[1].replace(/>/g, "");
                    } else {
                        oldMac = mac;
                    }
                    type = data[i].type.replace(/<\/B>/g, "");
                    if (type.indexOf("<B type=") > -1) {
                        array1 = type.split(";");
                        array2 = array1[0].split("=");
                        oldType = array2[1].replace(/\"/g, "");
                        type = array1[1].replace(/>/g, "");
                    } else {
                        oldType = type;
                    }

                    opt = data[i].option.replace(/<\/B>/g, "");
                    opt = opt.replace(/<B>/g, "");
                    netActions.push({
                        "action": action,
                        "source": source,
                        "portgroup": portgroup,
                        "type": type,
                        "model": model,
                        "mac": mac,
                        "options": opt,
                        "connected": connected,
                        "oldSource": oldSource,
                        "oldPortgroup": oldPortgroup,
                        "oldModel": oldModel,
                        "oldMac": oldMac,
                        "oldType": oldType
                    });

                }
            }
            var networkActions = {
                "actions": netActions
            };
            this.addLog("Update Virtual Machine NICs", vName, node, 30000);
            this.javaUpdateVmNetworks.input.setValue("vName", vName);
            this.javaUpdateVmNetworks.input.setValue("server", node);
            this.javaUpdateVmNetworks.input.setValue("netActions", networkActions);
            this.javaUpdateVmNetworks.update();
            this.gridVmNetworks.reflow();

        } catch (e) {
            this.showToastError("updateVmNetworksInfo ERROR: " + e.toString());
            console.error('ERROR IN updateVmNetworksInfo: ' + e);
        }
    },
    updateNetworkLink: function(state, rowId) {
        try {

            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var varStatus = "Status" + vmInfos;
            var vmStatus = this[varStatus].getValue("dataValue");
            if ((vmStatus === "stopped") || (vmStatus === "suspended")) {
                this.gridVmNetworks.setCell(rowId, "link", false, false);
            } else {
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];

                var selectedData = this.gridVmNetworks.getRow(rowId);
                var mac = selectedData.mac;
                var link = selectedData.link;
                var linkState = "down";
                if (link) {
                    linkState = "up";
                }
                var input = {
                    "mac": mac,
                    "state": linkState
                };

                this.javaUpdateVmNetworkLink.input.setValue("vName", vName);
                this.javaUpdateVmNetworkLink.input.setValue("server", node);
                this.javaUpdateVmNetworkLink.input.setValue("data", input);
                this.javaUpdateVmNetworkLink.update();
            }
        } catch (e) {
            this.showToastError("updateNetworkLink Error: " + e.toString());
            console.error('ERROR IN updateNetworkLink: ' + e);
        }
    },
    javaUpdateVmNetworkLinkResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaUpdateVmNetworkLink.getValue("dataValue");
            var jsonVar = JSON.parse(result);
            var info = jsonVar.action;
            if (info.result === "Success") {
                link = JSON.parse(info.link);
                app.toastDialog.showToast("Virtual NIC " + link.mac + " is " + link.state, 5000, "Info", "cc", "Virtual link is " + link.state);
            } else {
                app.toastDialog.showToast(info.result, 5000, "Error", "cc", "Cannot modify network connection");
            }
            this.javaGetVmVnics.input.setValue("vName", info.vm);
            this.javaGetVmVnics.input.setValue("node", jsonVar.node);
            this.javaGetVmVnics.update();

        } catch (e) {
            this.showToastError("javaUpdateVmNetworkLinkResult Error: " + e.toString());
            console.error('ERROR IN javaUpdateVmNetworkLinkResult: ' + e);
        }
    },
    updateVmVideoInfo: function(vName, node, ipaddr) {
        try {
            var jsonVar = JSON.parse(this.javaGetVmExtendedInfos.getValue("dataValue"));

            var videoModel = this.selectVideoModel.getDisplayValue();
            var heads = this.headNumber.getDataValue();
            var vram = this.vramNumber.getDataValue();
            var oldVideoModel = jsonVar.domain.devices.video.model.type;
            var oldHeads = jsonVar.domain.devices.video.model.heads;
            var oldVram = jsonVar.domain.devices.video.model.vram;

            var todo = [];
            var data = {};
            var todoCount = this.varVmConfigUpdate.getCount();

            for (var i = 0; i < todoCount; i++) {
                data = this.varVmConfigUpdate.getItem(i);
                var oldItemStr = data.getValue("olditem");
                var oldItem = {};
                if (oldItemStr !== "") {
                    oldItem = JSON.parse(oldItemStr);
                }

                todo.push({
                    "action": data.getValue("action"),
                    "type": data.getValue("type"),
                    "item": JSON.parse(data.getValue("item")),
                    "olditem": oldItem
                });
            }

            if ((videoModel !== oldVideoModel) || (heads !== oldHeads) || (vram !== oldVram)) {
                var jsonItem = {
                    "model": videoModel,
                    "heads": heads,
                    "vram": vram
                };
                //var item = JSON.stringify(jsonItem);
                todo.push({
                    "action": "update",
                    "index": "0",
                    "type": "video",
                    "item": jsonItem,
                    "olditem": {}
                });
            }


            this.addLog("Update Virtual Machine Video", vName, node, 30000);
            this.javaUpdateVmVideo.input.setValue("vName", vName);
            this.javaUpdateVmVideo.input.setValue("server", node);
            this.javaUpdateVmVideo.input.setValue("todo", todo);
            this.javaUpdateVmVideo.update();

        } catch (e) {
            this.showToastError("updateVmVideoInfo ERROR: " + e.toString());
            console.error('ERROR IN updateVmVideoInfo: ' + e);
        }
    },
    updateVmInputsInfo: function(vName, node, ipaddr) {
        try {
            var jsonVar = JSON.parse(this.javaGetVmExtendedInfos.getValue("dataValue"));

            var todo = [];
            var data = {};
            var todoCount = this.varVmConfigUpdate.getCount();
            for (var i = 0; i < todoCount; i++) {
                data = this.varVmConfigUpdate.getItem(i);
                var oldItemStr = data.getValue("olditem");
                var oldItem = {};
                if (oldItemStr !== "") {
                    oldItem = JSON.parse(oldItemStr);
                }
                todo.push({
                    "action": data.getValue("action"),
                    "type": data.getValue("type"),
                    "item": JSON.parse(data.getValue("item")),
                    "olditem": oldItem
                });
            }
            this.addLog("Update Virtual Machine Input", vName, node, 30000);
            this.javaUpdateVmInput.input.setValue("vName", vName);
            this.javaUpdateVmInput.input.setValue("server", node);
            this.javaUpdateVmInput.input.setValue("todo", todo);
            this.javaUpdateVmInput.update();
        } catch (e) {
            this.showToastError("updateVmInputsInfo ERROR: " + e.toString());
            console.error('ERROR IN updateVmInputsInfo: ' + e);
        }
    },
    updateVmTerminalsInfo: function(vName, node, ipaddr) {
        try {} catch (e) {
            this.showToastError("updateVmTerminalsInfo ERROR: " + e.toString());
            console.error('ERROR IN updateVmTerminalsInfo: ' + e);
        }
    },
    updateVmSerialsInfo: function(vName, node, ipaddr) {
        try {} catch (e) {
            this.showToastError("updateVmSerialsInfo ERROR: " + e.toString());
            console.error('ERROR IN updateVmSerialsInfo: ' + e);
        }
    },
    bootUpBtnClick: function(inSender) {
        try {
            var selectedIndex = this.gridBootList.getSelectedIndex();
            if (selectedIndex > 0) {
                var previousIndex = selectedIndex - 1;
                var selectedDevice = this.gridBootList.getCell(selectedIndex, "name");
                var selectedChecked = this.gridBootList.getCell(selectedIndex, "checked");
                var previousDevice = this.gridBootList.getCell(previousIndex, "name");
                var previousChecked = this.gridBootList.getCell(previousIndex, "checked");

                this.gridBootList.setCell(previousIndex, "name", selectedDevice, true);
                this.gridBootList.setCell(previousIndex, "checked", selectedChecked, false);
                this.gridBootList.setCell(selectedIndex, "name", previousDevice, true);
                this.gridBootList.setCell(selectedIndex, "checked", previousChecked, false);

                this.gridBootList.setSelectedRow(previousIndex, true);
                this.enableVmConfigSave();
                this._vmConfigHotswapable = "no";
            }
        } catch (e) {
            this.showToastError("bootUpBtnClick ERROR: " + e.toString());
            console.error('ERROR IN bootUpBtnClick: ' + e);
        }
    },
    bootDownBtnClick: function(inSender) {
        try {
            var selectedIndex = this.gridBootList.getSelectedIndex();
            var previousIndex = selectedIndex + 1;
            if (previousIndex < this.gridBootList.getRowCount()) {
                var selectedDevice = this.gridBootList.getCell(selectedIndex, "name");
                var selectedChecked = this.gridBootList.getCell(selectedIndex, "checked");
                var previousDevice = this.gridBootList.getCell(previousIndex, "name");
                var previousChecked = this.gridBootList.getCell(previousIndex, "checked");

                this.gridBootList.setCell(previousIndex, "name", selectedDevice, true);
                this.gridBootList.setCell(previousIndex, "checked", selectedChecked, false);
                this.gridBootList.setCell(selectedIndex, "name", previousDevice, true);
                this.gridBootList.setCell(selectedIndex, "checked", previousChecked, false);

                this.gridBootList.setSelectedRow(previousIndex, true);
                this.enableVmConfigSave();
                this._vmConfigHotswapable = "no";
            }

        } catch (e) {
            console.error('ERROR IN bootDownBtnClick: ' + e);
            this.showToastError("bootDownBtnClick ERROR: " + e.toString());
        }
    },
    gridVmDisksClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        try {
            var index = this.gridVmDisks.getSelectedIndex();
            var data = this.gridVmDisks.getRow(index);
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var varStatus = "Status" + vmInfos;
            var vmStatus = this[varStatus].getValue("dataValue");

            if (data.icon !== undefined) {
                if (data.icon.search('optical') > -1) {
                    this.deleteVmStorageBtn.setDisabled(true);
                    this.eraseVmStorageBtn.setDisabled(true);
                } else {
                    if (vmStatus === "stopped") {
                        this.eraseVmStorageBtn.setDisabled(false);
                        this.deleteVmStorageBtn.setDisabled(false);
                    } else {
                        this.eraseVmStorageBtn.setDisabled(true);
                        this.deleteVmStorageBtn.setDisabled(true);
                    }
                }
            }


        } catch (e) {
            this.showToastError("gridVmDisksClick ERROR: " + e.toString());
            console.error('ERROR IN gridVmDisksClick: ' + e);
        }
    },
    newVmStorageBtnClick: function(inSender) {
        try {
            this.newStorageDialog.setTitle("New Storage");
            this.radioNewDisk.setChecked(true);
            //var node = this.varSelectedServer.getValue("dataValue");
            this.selectStorageType.setDisplayValue("disk");
            this.selectCacheOption.setDisplayValue("default");
            this.newDiskLayer.activate();
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];


            diskcount = 0;
            var count = this.varVmDiskList.getCount();
            for (var i = 0; i < count; i++) {
                this.logDebugVM(this.varVmDiskList[i]);
                var icon = this.varVmDiskList.getItem(i).getValue("icon");
                if (icon.indexOf("harddisk") > -1) {
                    diskcount += 1;
                }
            }
            diskcount += 1;
            if (diskcount < 10) {
                this.newStorageDeviceName.setDataValue(vName + "-0" + diskcount.toString() + ".img");
            } else {
                this.newStorageDeviceName.setDataValue(vName + "-" + diskcount.toString() + ".img");
            }
            this.newStorageDeviceBusType.setDisplayValue("ide");
            this.makeBusList("ide");
            this.panelStorageType.setShowing(true);
            this.newStorageSizeEditor.setDataValue(6);
            this.newStorageSizeEditor.setReadonly(false);
            //this.newStorageDeviceName.setDisabled(true);
            this.newStorageDeviceName.setReadonly(true);
            //this.newStorageDeviceName.setDataValue("");
            this.newStorageDeviceType.setReadonly(false);
            this.newStorageDeviceType.setDisplayValue("");
            this.selectStorageName.setDisplayValue("");

            this.newStorageAllocateSpace.setShowing(true);
            this.panelSelectDisk.setShowing(true);
            this.selectStorageName.setShowing(true);

            this.showLayerVmStorageType();
            this.newStorageDialog.setShowing(true);
        } catch (e) {
            this.showToastError("newVmStorageBtnClick ERROR: " + e.toString());
            console.error('ERROR IN newVmStorageBtnClick: ' + e);
        }
    },
    // VM Storage Wizard
    newStorageDialogClose: function(inSender, inWhy) {
        try {
            this.showLayerVmStorageType();

        } catch (e) {
            console.error('ERROR IN newStorageDialogClose: ' + e);
        }
    },
    showLayerVmStorageType: function() {
        try {
            this.labelVmStorageType.setShowing(true);
            this.spacerLabelVmStorageType.setShowing(true);
            this.labelVmStorageType.setCaption("<b><u>Type</u></b>");
            this.labelVmStorageSource.setCaption("Source");
            this.labelVmStorageOpts.setCaption("Options");
            this.layerVmStorageType.activate();

            this.newStorageBack.setDisabled(true);
            this.newStorageSave.setCaption("Next");
            this.newStorageSave.setImageIndex(5);
        } catch (e) {
            console.error('ERROR IN labelVmStorageTypeClick: ' + e);
            this.showToastError("labelVmStorageTypeClick ERROR: " + e.toString());
        }
    },
    showLayerVmStorageSource: function() {
        try {
            this.selectStorageName.setDisabled(false);
            this.labelVmStorageSource.setShowing(true);
            this.spacerLabelVmStorageSource.setShowing(true);
            this.labelVmStorageType.setCaption("Type");
            this.labelVmStorageSource.setCaption("<b><u>Source</u></b>");
            this.labelVmStorageOpts.setCaption("Options");
            this.layerVmStorageSource.activate();
            if (this.labelVmStorageType.showing === true) {
                this.newStorageBack.setDisabled(false);
                this.newStorageBack.setShowing(false);
            } else {
                this.newStorageBack.setDisabled(true);
                this.newStorageBack.setShowing(true);
            }
            this.newStorageSave.setCaption("Next");
            this.picEditFileName.setShowing(true);
            this.newStorageSave.setImageIndex(5);
        } catch (e) {
            console.error('ERROR IN labelVmStorageSourceClick: ' + e);
            this.showToastError("labelVmStorageSourceClick ERROR: " + e.toString());
        }
    },
    showLayerVmStorageOpts: function() {
        try {
            if (this.isValideVmStorage(this.layerVmStorageSource.isActive())) {
                this.labelVmStorageOpts.setShowing(true);
                this.spacerLabelVmStorageOpts.setShowing(true);
                this.labelVmStorageType.setCaption("Type");
                this.labelVmStorageSource.setCaption("Source");
                this.labelVmStorageOpts.setCaption("<b><u>Options</u></b>");
                this.layerVmStorageOptions.activate();
                if (this.labelVmStorageSource.showing === true) {
                    this.newStorageBack.setDisabled(false);
                    this.newStorageBack.setShowing(false);
                } else {
                    this.newStorageBack.setDisabled(true);
                    this.newStorageBack.setShowing(true);
                }
                if (this.newStorageDialog.title === "New Storage") {
                    this.newStorageSave.setCaption("Done");
                } else {
                    this.newStorageSave.setCaption("Update");
                }
                this.newStorageSave.setImageIndex(88);
            }
        } catch (e) {
            console.error('ERROR IN labelVmStorageOptsClick: ' + e);
            this.showToastError("labelVmStorageOptsClick ERROR: " + e.toString());
        }
    },
    validateVmStorageInfo: function() {
        try {
            if (this.isValideVmStorage(false)) {
                this.newVmStorageSave();
                this.newStorageDialog.hide();
            }
        } catch (e) {
            console.error('ERROR IN validateVmStorageInfo: ' + e);
        }
    },
    newStorageBackClick: function(inSender) {
        try {
            var index = this.wizardVmStorage.indexOfLayer(this.wizardVmStorage.getActiveLayer()) - 1;
            this.switchVmStorageLayer(index);

        } catch (e) {
            console.error('ERROR IN newStorageBackClick: ' + e);
        }
    },
    newStorageSaveClick: function(inSender) {
        try {
            var index = this.wizardVmStorage.indexOfLayer(this.wizardVmStorage.getActiveLayer()) + 1;
            this.switchVmStorageLayer(index);

        } catch (e) {
            console.error('ERROR IN newStorageBackClick: ' + e);
        }
    },
    switchVmStorageLayer: function(index) {
        try {
            switch (index) {
            case 0:
                this.showLayerVmStorageType();
                break;
            case 1:
                this.showLayerVmStorageSource();
                break;
            case 2:
                this.showLayerVmStorageOpts();
                break;
            case 3:
                this.validateVmStorageInfo();
                break;
            default:
                this.showLayerVmStorageType();
            }
        } catch (e) {
            console.error('ERROR IN switchVmStorageLayer: ' + e);
        }
    },
    labelVmStorageTypeClick: function(inSender, inEvent) {
        try {
            this.showLayerVmStorageType();
        } catch (e) {
            console.error('ERROR IN labelVmStorageTypeClick: ' + e);
        }
    },
    labelVmStorageSourceClick: function(inSender, inEvent) {
        try {
            this.showLayerVmStorageSource();
        } catch (e) {
            console.error('ERROR IN labelVmStorageSourceClick: ' + e);
        }
    },
    labelVmStorageOptsClick: function(inSender, inEvent) {
        try {
            this.showLayerVmStorageOpts();
        } catch (e) {
            console.error('ERROR IN labelVmStorageOptsClick: ' + e);
        }
    },


    //
    picEditFileNameClick: function(inSender) {
        try {
            //this.newStorageDeviceName.setDisabled(false);
            if (this.newStorageDeviceName.readonly === true) {
                this.newStorageDeviceName.setReadonly(false);
            } else {
                this.newStorageDeviceName.setReadonly(true);
            }

        } catch (e) {
            console.error('ERROR IN picEditFileNameClick: ' + e);
        }
    },
    updateVmStorageBtnClick: function(inSender) {
        try {
            this.newStorageDialog.setTitle("Edit Storage Properties");
            var index = this.gridVmDisks.getSelectedIndex();
            var data = this.gridVmDisks.getRow(index);
            var path = "";
            var name = "";
            var format = "";
            var busType = "";
            var cache = "";
            if (data.path !== undefined) {
                path = data.path.replace(/<\/B>/g, "");
                path = path.replace(/<B>/g, "");
            }
            if (data.name !== undefined) {
                name = data.name.replace(/<\/B>/g, "");
                name = name.replace(/<B>/g, "");
            }
            if (data.format !== undefined) {
                format = data.format.replace(/<\/B>/g, "");
                format = format.replace(/<B>/g, "");
            }
            if (data.device !== undefined) {
                device = data.device.replace(/<\/B>/g, "");
                device = device.replace(/<B>/g, "");
            }
            if (data.busType !== undefined) {
                busType = data.busType.replace(/<\/B>/g, "");
                busType = busType.replace(/<B>/g, "");
            }
            if (data.cache !== undefined) {
                cache = data.cache.replace(/<\/B>/g, "");
                cache = cache.replace(/<B>/g, "");
            }

            this.panelStorageType.setShowing(false);
            if (this.newStorageDeviceName.width !== 345) {
                this.newStorageDeviceName.setWidth(345);
            }
            if (data.icon.search('harddisk') > -1) {
                type = "disk";
                this.selectStorageType.setDisplayValue(type);

                this.newDiskLayer.activate();
                var params1 = data.size.split("G");
                var params2 = params1[0].split(".");
                var size = params2[0];
                this.newStorageSizeEditor.setDataValue(size);
                this.newStorageSizeEditor.setReadonly(true);
                this.newStorageDeviceName.setDataValue(name);
                this.selectStorageName.setDisabled(true);
                this.picEditFileName.setShowing(false);

            } else if (data.icon.search('optical') > -1) {
                type = "cdrom";
                this.selectStorageType.setDisplayValue(type);
                this.newCdromLayer.activate();
                if (data.type === "block") {
                    this.newStorageRadioPhysical.setChecked(true);
                } else if (data.name.length === 0) {
                    this.newStorageRadioEmpty.setChecked(true);
                } else {
                    this.newStorageRadioISO.setChecked(true);
                }
                this.newStorageSelectIso.setDataValue(path + name);

            }
            //this.newStorageDeviceName.setDisabled(true);
            this.newStorageDeviceName.setReadonly(true);
            this.newStorageDeviceType.setDataValue(format);
            this.newStorageDeviceType.setReadonly(true);
            if (data.cache !== "") {
                this.selectCacheOption.setDataValue(cache);
            } else {
                this.selectCacheOption.setDataValue("default");
            }

            if (type === "cdrom") {
                this.showLayerVmStorageSource();
                this.labelVmStorageType.setShowing(false);
                this.spacerLabelVmStorageType.setShowing(false);
            } else if (type === "disk") {
                this.showLayerVmStorageOpts();
                this.labelVmStorageType.setShowing(false);
                this.spacerLabelVmStorageType.setShowing(false);
                this.labelVmStorageSource.setShowing(false);
                this.spacerLabelVmStorageSource.setShowing(false);
            }

            this.makeBusList(data.busType);
            this.newStorageDeviceBusType.setDisplayValue(busType);
            this.newStorageDeviceBusName.setDisplayValue(device);
            this.panelSelectDisk.setShowing(false);
            this.newStorageAllocateSpace.setShowing(false);
            this.selectStorageName.setShowing(false);

            this.newStorageDialog.setShowing(true);


        } catch (e) {
            this.showToastError("updateVmStorageBtnClick ERROR: " + e.toString());
            console.error('ERROR IN updateVmStorageBtnClick: ' + e);
        }
    },
    selectStorageTypeChange: function(inSender) {
        try {
            var type = this.selectStorageType.getDisplayValue();
            if (this.newStorageDialog.title === "New Storage") {
                if (type === "disk") {
                    this.panelSelectDisk.setShowing(true);
                    this.radioNewDisk.setChecked(true);
                    this.newStorageDeviceName.setReadonly(true);
                    this.newDiskLayer.activate();
                    this.newStorageDeviceBusType.setDataValue('virtio');
                } else {
                    this.panelSelectDisk.setShowing(false);
                    this.newCdromLayer.activate();
                    this.newStorageSelectIso.setDataValue("");
                    this.newStorageDeviceName.setDisplayValue("");
                    //this.newStorageDeviceName.setDisabled(true);
                    this.newStorageDeviceName.setReadonly(true);
                    this.newStorageDeviceBusType.setDataValue('ide');
                }
            }
        } catch (e) {
            console.error('ERROR IN selectStorageTypeChange: ' + e);
        }
    },
    onRadioDiskButtonChange: function(inSender) {
        try {
            if (this.radioNewDisk.getChecked() === true) {
                this.panelUseExistingDisk.setShowing(false);
                this.panelNewDisk.setShowing(true);
                this.newStorageSelectDisk.setRequired(false);

                var vmInfos = this.varSelectedVm.getValue("dataValue");
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];
                diskcount = 0;
                var count = this.varVmDiskList.getCount();
                for (var i = 0; i < count; i++) {
                    this.logDebugVM("disk :" + this.varVmDiskList[i]);
                    var icon = this.varVmDiskList.getItem(i).getValue("icon");
                    if (icon.indexOf("harddisk") > -1) {
                        diskcount += 1;
                    }
                }
                diskcount += 1;
                if (diskcount < 10) {
                    this.newStorageDeviceName.setDataValue(vName + "-0" + diskcount.toString() + ".img");
                } else {
                    this.newStorageDeviceName.setDataValue(vName + "-" + diskcount.toString() + ".img");
                }
                //this.newStorageDeviceName.setDisabled(true);
                this.newStorageDeviceName.setReadonly(true);
            } else {
                this.panelNewDisk.setShowing(false);
                this.panelUseExistingDisk.setShowing(true);
                this.newStorageDeviceName.setDataValue("");
                this.newStorageSelectDisk.setRequired(true);

            }


        } catch (e) {
            this.showToastError("ERROR IN onRadioDiskButtonChange: " + e.toString());
            console.error('ERROR IN radioNewDiskChange: ' + e);
        }
    },
    newStorageRadioISOChange: function(inSender) {
        try {
            if (this.newStorageRadioISO.getChecked() === true) {
                this.newIsoBrowseBtn.setDisabled(false);
                this.newStorageSelectIso.setDisabled(false);
                this.newStorageSelectIso.setRequired(true);

            } else {
                this.newIsoBrowseBtn.setDisabled(true);
                this.newStorageSelectIso.setDisabled(true);
                this.newStorageSelectIso.setRequired(false);
                this.newStorageSelectIso.setDataValue("");
            }
        } catch (e) {
            this.showToastError("ERROR IN newStorageRadioISOChange: " + e.toString());
            console.error('ERROR IN radioISO1Change: ' + e);
        }
    },
    newStorageRadioEmptyChange: function(inSender) {
        try {
            if (this.newStorageRadioEmpty.getChecked() === true) {
                this.newIsoBrowseBtn.setDisabled(true);
                this.newStorageSelectIso.setDisabled(true);
                this.newStorageSelectIso.setRequired(false);
                this.newStorageSelectIso.setDataValue("");
                var type = this.selectStorageType.getDisplayValue();
                if (type === "cdrom") {
                    this.newStorageDeviceName.setDataValue("");
                    this.picEditFileName.setShowing(false);
                }

            } else {
                this.newIsoBrowseBtn.setDisabled(false);
                this.newStorageSelectIso.setDisabled(false);
                this.newStorageSelectIso.setRequired(true);
            }

        } catch (e) {
            console.error('ERROR IN newStorageRadioEmptyChange: ' + e);
        }
    },
    newStorageDeviceBusTypeChange: function(inSender) {
        try {
            this.makeBusList(this.newStorageDeviceBusType.getDataValue());

        } catch (e) {
            this.showToastError("ERROR IN newStorageDeviceBusTypeChange: " + e.toString());
            console.error('ERROR IN newStorageDeviceBusTypeChange: ' + e);
        }
    },
    makeBusList: function(busType) {
        this.varBusList.clearData();

        try {
            var ignoreBus = "";
            if (this.newStorageDialog.title === "Edit Storage Properties") {
                var index = this.gridVmDisks.getSelectedIndex();
                var data = this.gridVmDisks.getRow(index);
                ignoreBus = data.device;
            }

            letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
            var busName = "";
            if (busType === "ide") {
                busName = "hd";
            } else if (busType === "scsi") {
                busName = "sd";
            } else if (busType === "virtio") {
                busName = "vd";
            }
            for (var i = 0; i < 10; i++) {
                var toAdd = true;
                var bus = busName + letters[i];
                var count = this.varVmDiskList.getCount();
                for (var j = 0; j < count; j++) {
                    var tmpbus = this.varVmDiskList.getItem(j).getValue("device");
                    if ((tmpbus.indexOf(bus) > -1) && (ignoreBus !== bus)) {
                        toAdd = false;
                    }
                }
                if (toAdd === true) {
                    this.varBusList.addItem({
                        "name": bus,
                        "dataValue": bus
                    });
                }
            }
            this.newStorageDeviceBusName.setDisplayValue(this.varBusList.getItem(0).getValue("dataValue"));

        } catch (e) {
            this.showToastError("ERROR IN makeBusList: " + e.toString());
            console.error('ERROR IN makeBusList: ' + e);
        }
    },
    newIsoBrowseBtnClick: function(inSender) {
        try {
            this.varBrowserCaller.setValue("name", "newStorageSelectIso");
            this.varBrowserCaller.setValue("dataValue", "file");
            this.remoteFileBrowserDiag.setShowing(true);
        } catch (e) {
            console.error('ERROR IN isoBtn1Click: ' + e);
        }
    },
    newStorageSelectIsoChange: function(inSender) {
        try {
            var path = this.newStorageSelectIso.getDataValue();
            if (path !== "") {
                params = path.split("/");
                this.newStorageDeviceName.setDataValue(params[params.length - 1]);
                //this.newStorageDeviceName.setDisabled(true);
                this.newStorageDeviceName.setReadonly(true);

            }

        } catch (e) {
            this.showToastError("ERROR IN newStorageSelectIsoChange: " + e.toString());
            console.error('ERROR IN newStorageSelectIsoChange: ' + e);
        }
    },
    newDiskBrowseBtnClick: function(inSender) {
        try {
            this.varBrowserCaller.setValue("name", "newStorageSelectDisk");
            this.varBrowserCaller.setValue("dataValue", "file");
            this.remoteFileBrowserDiag.setShowing(true);

        } catch (e) {
            console.error('ERROR IN newStorageBrowseBtn1Click: ' + e);
        }
    },
    newStorageSelectDiskChange: function(inSender) {
        try {
            var path = this.newStorageSelectDisk.getDataValue();
            if (path !== "") {
                params = path.split("/");
                this.newStorageDeviceName.setDataValue(params[params.length - 1]);
                //this.newStorageDeviceName.setDisabled(true);
                this.newStorageDeviceName.setReadonly(true);
            }
        } catch (e) {
            console.error('ERROR IN newStorageSelectDiskChange: ' + e);
        }
    },
    isValideVmStorage: function(showMsg) {
        isValid = false;
        showMsg = typeof showMsg !== 'undefined' ? showMsg : false;
        try {
            var storageType = this.selectStorageType.getDisplayValue();
            if (storageType === "disk") {
                if (this.radioNewDisk.getChecked() === true) {

                    if (this.newStorageDeviceType.getDataValue() === "") {
                        if (showMsg) {
                            app.toastDialog.showToast("File Type is not valid", 3000, "Warning", "cc", "Invalid information");
                        }
                    } else if ((this.selectStorageName.disabled === false) && (this.selectStorageName.getDataValue() === "")) {
                        if (showMsg) {
                            app.toastDialog.showToast("Location is not valid", 3000, "Warning", "cc", "Invalid information");
                        }
                    } else {
                        isValid = true;
                    }
                } else {
                    if (this.newStorageSelectDisk.getDataValue() === "") {
                        if (showMsg) {
                            app.toastDialog.showToast("Image path is not valid", 3000, "Warning", "cc", "Invalid information");
                        }
                    } else {
                        isValid = true;
                    }

                }
            } else if (storageType === "cdrom") {
                if (this.panelNewStorageSelectIso.invalid) {
                    if (showMsg) {
                        this.panelNewStorageSelectIso.getInvalidWidget().focus();
                        widgetName = this.panelNewStorageSelectIso.getInvalidWidget().caption;
                        app.toastDialog.showToast('"' + widgetName + '" information is not valid', 3000, "Warning", "cc", "Invalid information");
                    }
                } else {
                    isValid = true;
                }
            }

        } catch (e) {
            console.error('ERROR IN isValideVmStorage: ' + e);
        }
        return isValid;
    },
    newVmStorageSave: function(inSender) {
        try {
            var widgetName = "";
            var count = this.varVmDiskList.getCount();
            var storageType = this.selectStorageType.getDisplayValue();
            var cache = this.selectCacheOption.getDisplayValue();
            var storageDeviceName = this.newStorageDeviceName.getDataValue();
            var deviceBus = this.newStorageDeviceBusName.getDataValue();
            var busType = this.newStorageDeviceBusType.getDataValue();
            var allocation = "";
            var path = "";
            var vsize = "0";
            var usedSpace = "";
            var deviceType = "";
            var action = "";
            var icon = "";
            var type = "file";
            var index = this.gridVmDisks.getSelectedIndex();
            var oldSource = "";
            var oldBus = "";
            var oldItem = this.varVmDiskList.getItem(index).getData();

            if (this.isValideVmStorage(true)) {
                if (storageType === "disk") {
                    this._vmConfigHotswapable = "no";
                    if (this.newStorageSave.caption === "Update") {
                        action = "update";
                        icon = '<image title="harddisk"; style="height: 30px;" src="resources/images/icons/hardware/update-harddisk.png"/>';
                        allocation = "";
                        vsize = oldItem.size;
                        usedSpace = oldItem.used;
                        path = oldItem.path;
                        deviceType = this.newStorageDeviceType.getDataValue();
                        doContinue = true;
                    } else {
                        icon = '<image title="harddisk"; style="height: 30px;" src="resources/images/icons/hardware/add-harddisk.png"/>';
                        if (this.radioNewDisk.getChecked() === true) {
                            if (this.newStorageAllocateSpace.getChecked()) {
                                allocation = "preallocation";
                                usedSpace = this.newStorageSizeEditor.getDataValue() + "G";
                            } else {
                                allocation = "sparse";
                                usedSpace = "0G";
                            }
                            path = this.selectStorageName.getDataValue();
                            if (path[path.length - 1] !== "/") {
                                path += "/";
                            }
                            vsize = this.newStorageSizeEditor.getDataValue() + "G";
                            action = "create";
                            deviceType = this.newStorageDeviceType.getDataValue();
                            doContinue = true;

                        } else {
                            var str = this.newStorageSelectDisk.getDataValue();
                            path = str.replace(this.newStorageDeviceName.getDataValue(), "");
                            vsize = this.varFileInfo.getValue("vsize");
                            usedSpace = this.varFileInfo.getValue("rsize");
                            deviceType = this.varFileInfo.getValue("format");
                            action = "add";
                            doContinue = true;
                        }
                    }
                } else if (storageType === "cdrom") {
                    vsize = "0";
                    usedSpace = "0";
                    action = "add";
                    if (this.newStorageRadioPhysical.getChecked() === true) {
                        type = "block";
                        path = "/dev/cdrom";
                        deviceType = "raw";
                    } else if (this.newStorageRadioISO.getChecked() === true) {
                        deviceType = this.varFileInfo.getValue("format");
                        var str1 = this.newStorageSelectIso.getDataValue();
                        path = str1.replace(this.newStorageDeviceName.getDataValue(), "");
                    } else {
                        usedSpace = "0";
                        vsize = "0";
                        deviceType = "raw";
                        path = "";
                        name = "";
                    }
                    if (this.newStorageSave.caption === "Update") {
                        this._vmConfigHotswapable = "yes";
                        icon = '<image title="cdrom"; style="height: 30px;" src="resources/images/icons/hardware/update-optical.png"/>';
                        usedSpace = "0";
                        vsize = "0";
                        deviceType = "raw";
                        action = "update";
                    } else {
                        this._vmConfigHotswapable = "no";
                        icon = '<image title="cdrom"; style="height: 30px;" src="resources/images/icons/hardware/add-optical.png"/>';
                    }
                }

                if (this.newStorageSave.caption === "Update") {
                    oldSource = oldItem.path + oldItem.name;
                    oldBus = oldItem.device;
                } else {
                    oldSource = "";
                    oldBus = "";
                }
                var newDisk = {
                    "icon": icon,
                    "type": "<B>" + type + "</B>",
                    "name": "<B>" + storageDeviceName + "</B>",
                    "format": "<B>" + deviceType + "</B>",
                    "device": "<B>" + deviceBus + "</B>",
                    "size": "<B>" + vsize + "</B>",
                    "used": "<B>" + usedSpace + "</B>",
                    "path": "<B>" + path + "</B>",
                    "cache": "<B>" + cache + "</B>",
                    "bus": "<B>" + deviceBus + "</B>",
                    "busType": "<B>" + busType + "</B>"
                };

                if (this.newStorageSave.caption === "Update") {
                    this.varVmDiskList.setItem(index, newDisk);
                } else {
                    this.varVmDiskList.addItem(newDisk);
                }
                this.gridVmDisks.reflow();
                this.varVmStorageActions.addItem({
                    "action": action,
                    "index": count,
                    "type": type,
                    "device": storageType,
                    "driver": "qemu",
                    "name": storageDeviceName,
                    "format": deviceType,
                    "size": vsize,
                    "allocation": allocation,
                    "path": path,
                    "bus": deviceBus,
                    "busType": busType,
                    "cache": cache,
                    "oldSource": oldSource,
                    "oldBus": oldBus
                });

                this.enableVmConfigSave();
            }
        } catch (e) {
            this.showToastError("ERROR IN newVmStorageSave: " + e.toString());
            console.error('ERROR IN newVmStorageSave: ' + e);
        }
    },
    removeVmStorageBtnClick: function(inSender) {
        try {
            var index = this.gridVmDisks.getSelectedIndex();
            var data = this.gridVmDisks.getRow(index);
            if (data.icon.indexOf("add-") > -1) {
                this.varVmDiskList.removeItem(index);
                this.gridVmDisks.reflow();
            } else {
                this.showConfirmDialog("This will remove " + data.name + " from inventory", "removeVmStorageConfirmed", true);
            }

        } catch (e) {
            this.showToastError("ERROR IN removeVmStorageBtnClick: " + e.toString());
            console.error('ERROR IN removeVmStorageBtnClick: ' + e);
        }
    },
    removeVmStorageConfirmed: function(validated) {
        try {
            if (validated) {
                var index = this.gridVmDisks.getSelectedIndex();
                var data = this.gridVmDisks.getRow(index);
                var type = "";
                var icon = "";
                if (data.icon.indexOf("harddisk") > -1) {
                    type = "disk";
                    icon = '<image title="harddisk"; style="height: 30px;" src="resources/images/icons/hardware/remove-harddisk.png"/>';
                } else if (data.icon.indexOf("optical") > -1) {
                    type = "cdrom";
                    icon = '<image title="cdrom"; style="height: 30px;" src="resources/images/icons/hardware/remove-optical2.png"/>';
                }
                var updatedDisk = {
                    "icon": icon,
                    "type": "<B>" + data.type + "</B>",
                    "name": "<B>" + data.name + "</B>",
                    "format": "<B>" + data.format + "</B>",
                    "device": "<B>" + data.device + "</B>",
                    "size": "<B>" + data.size + "</B>",
                    "used": "<B>" + data.used + "</I>",
                    "path": "<B>" + data.path + "</B>"
                };
                this.varVmDiskList.setItem(index, updatedDisk);
                this.gridVmDisks.reflow();
                this.varVmStorageActions.addItem({
                    "action": "remove",
                    "index": index,
                    "type": "file",
                    "device": type,
                    "driver": "",
                    "name": data.name,
                    "format": data.format,
                    "size": data.size,
                    "allocation": "",
                    "path": data.path,
                    "bus": data.device,
                    "busType": "",
                    "cache": "",
                    "oldSource": "",
                    "oldBus": ""
                });

                this.enableVmConfigSave();
                this._vmConfigHotswapable = "no";
            }
        } catch (e) {
            this.showToastError("ERROR IN removeVmStorageConfirmed: " + e.toString());
            console.error('ERROR IN removeVmStorageConfirmed: ' + e);
        }
    },
    deleteVmStorageBtnClick: function(inSender) {
        try {
            var index = this.gridVmDisks.getSelectedIndex();
            var data = this.gridVmDisks.getRow(index);
            if (data.icon.indexOf("add-") > -1) {
                this.varVmDiskList.removeItem(index);
                this.gridVmDisks.reflow();
            } else {
                this.showConfirmDialog("This will permanently delete " + data.name + " from disk", "deleteVmStorageConfirmed", true);
            }

        } catch (e) {
            this.showToastError("ERROR IN deleteVmStorageBtnClick: " + e.toString());
            console.error('ERROR IN deleteVmStorageBtnClick: ' + e);
        }
    },
    deleteVmStorageConfirmed: function(validated) {
        try {
            if (validated) {
                var index = this.gridVmDisks.getSelectedIndex();
                var data = this.gridVmDisks.getRow(index);
                var type = "";
                var icon = "";
                if (data.icon.indexOf("harddisk") > -1) {
                    type = "disk";
                    icon = '<image title="harddisk"; style="height: 30px;" src="resources/images/icons/hardware/delete-harddisk.png"/>';
                } else if (data.icon.indexOf("optical") > -1) {
                    type = "cdrom";
                    icon = '<image title="cdrom"; style="height: 30px;" src="resources/images/icons/hardware/delete-optical2.png"/>';
                }
                var updatedDisk = {
                    "icon": icon,
                    "type": "<B>" + data.type + "</B>",
                    "name": "<B>" + data.name + "</B>",
                    "format": "<B>" + data.format + "</B>",
                    "device": "<B>" + data.device + "</B>",
                    "size": "<B>" + data.size + "</B>",
                    "used": "<B>" + data.used + "</I>",
                    "path": "<B>" + data.path + "</B>"
                };
                this.varVmDiskList.setItem(index, updatedDisk);
                this.gridVmDisks.reflow();
                this.varVmStorageActions.addItem({
                    "action": "delete",
                    "index": index,
                    "type": "file",
                    "device": type,
                    "driver": "",
                    "name": data.name,
                    "format": data.format,
                    "size": data.size,
                    "allocation": "",
                    "path": data.path,
                    "bus": data.device,
                    "busType": "",
                    "cache": "",
                    "oldSource": "",
                    "oldBus": ""
                });

                this.enableVmConfigSave();
                this._vmConfigHotswapable = "no";
            }
        } catch (e) {
            this.showToastError("ERROR IN deleteVmStorageConfirmed: " + e.toString());
            console.error('ERROR IN deleteVmStorageConfirmed: ' + e);
        }
    },
    eraseVmStorageBtnClick: function(inSender) {
        try {
            var index = this.gridVmDisks.getSelectedIndex();
            var data = this.gridVmDisks.getRow(index);
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            var varStatus = "Status" + vmInfos;
            var vmStatus = this[varStatus].getValue("dataValue");
            if (vmStatus === "stopped") {
                this.showConfirmDialog("This will erase all data and partitions from " + data.name, "eraseVmStorageConfirmed", true);
            } else {
                app.toastDialog.showToast("Please shutdown " + vName + " before erasing any vDisks.", 5000, "Warning", "cc", "Operation not permited !");
            }

        } catch (e) {
            this.showToastError("ERROR IN eraseVmStorageBtnClick: " + e.toString());
            console.error('ERROR IN eraseVmStorageBtnClick: ' + e);
        }
    },
    eraseVmStorageConfirmed: function(inSender) {
        try {
            var index = this.gridVmDisks.getSelectedIndex();
            var data = this.gridVmDisks.getRow(index);
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            this.loadingVmConfiguration.show();
            this.javaEraseVmStorage.input.setValue("vName", vName);
            this.javaEraseVmStorage.input.setValue("node", node);
            this.javaEraseVmStorage.input.setValue("vdisk", data.path + data.name);
            this.javaEraseVmStorage.update();

        } catch (e) {
            this.showToastError("ERROR IN eraseVmStorageConfirmed: " + e.toString());
            console.error('ERROR IN eraseVmStorageConfirmed: ' + e);
        }
    },
    javaEraseVmStorageResult: function(inSender, inDeprecated) {
        try {
            this.loadingVmConfiguration.hide();
            var result = this.javaEraseVmStorage.getValue("dataValue");
            var jsonVar = JSON.parse(result);
            var res = jsonVar.action.result;
            var index = this.gridVmDisks.getSelectedIndex();
            var data = this.gridVmDisks.getRow(index);
            if (res === "Successful") {
                app.toastDialog.showToast("All data and partitions from " + data.name + " have been erased.", 5000, "Success", "cc", "Virtual disk erased !");
            } else {
                app.toastDialog.showToast(res, 5000, "Error", "cc", "Erasing failed !");
            }

        } catch (e) {
            console.error('ERROR IN javaEraseVmStorageResult: ' + e);
            this.showToastError("ERROR IN javaEraseVmStorageResult: " + e.toString());
        }
    },

    newVmInputBtnClick: function(inSender) {
        try {
            this.selectInputType.setReadonly(false);
            this.vmInputDialog.setTitle("New input device");
            this.selectInputType.setDisplayValue("Mouse");
            this.selectInputBus.setDisplayValue("USB");
            this.vmInputDialog.show();
        } catch (e) {
            this.showToastError("newVmInputBtnClick Error: " + e.toString());
            console.error('ERROR IN newVmInputBtnClick: ' + e);
        }
    },
    updateVmInputBtnClick: function(inSender) {
        try {
            this.selectInputType.setReadonly(true);

            var index = this.gridVmInputs.getSelectedIndex();
            var data = this.gridVmInputs.getRow(index);
            var dialogTitle = "Update input device";

            if (data.icon.indexOf("-add.png") > -1) {
                data.type = data.type.replace(/<\/B>/g, "");
                data.type = data.type.replace(/<B>/g, "");
                data.bus = data.bus.replace(/<\/B>/g, "");
                data.bus = data.bus.replace(/<B>/g, "");
                this.varVmInputList.removeItem(index);
                dialogTitle = "New input device";
            } else if (data.icon.indexOf("-update.png") > -1) {
                app.toastDialog.showToast("Cannot update a component set to be updated", 10000, "Warning", "cc", "This operation is not allowed");
                return;
            } else if (data.icon.indexOf("-remove.png") > -1) {
                app.toastDialog.showToast("Cannot update a component set to be removed", 10000, "Warning", "cc", "This operation is not allowed");
                return;
            }

            this.selectInputType.setDataValue(data.type);
            this.selectInputBus.setDataValue(data.bus);

            this.vmInputDialog.setTitle(dialogTitle);
            this.vmInputDialog.show();

        } catch (e) {
            this.showToastError("updateVmInputBtnClick Error: " + e.toString());
            console.error('ERROR IN updateVmInputBtnClick: ' + e);
        }
    },
    vmInputBtnSaveClick: function(inSender) {
        try {
            var action = "";
            var item = "";
            var oldItem = "";
            var type = "input";
            var inputType = this.selectInputType.getDataValue();
            var bus = this.selectInputBus.getDataValue();
            var icon = "";
            var tmpvar = {};
            var index = 0;

            index = this.gridVmInputs.getRowCount() + 1;
            jsonItem = {
                "type": inputType,
                "bus": bus
            };
            item = JSON.stringify(jsonItem);

            if (this.vmInputDialog.title === "New input device") {
                if (inputType === "mouse") {
                    icon = '<image style="height: 30px;" src="resources/images/icons/hardware/input-mouse-add.png" align="middle"/>';
                } else if (inputType === "tablet") {
                    icon = '<image style="height: 30px;" src="resources/images/icons/hardware/input-tablet-add.png" align="middle"/>';
                }
                action = "add";
                tmpvar = {
                    "icon": icon,
                    "type": "<B>" + inputType + "</B>",
                    "bus": "<B>" + bus + "</B>"
                };
                this.varVmInputList.addItem(tmpvar);
            } else {
                if (inputType === "mouse") {
                    icon = '<image style="height: 30px;" src="resources/images/icons/hardware/input-mouse-update.png" align="middle"/>';
                } else if (inputType === "tablet") {
                    icon = '<image style="height: 30px;" src="resources/images/icons/hardware/input-tablet-update.png" align="middle"/>';
                }
                action = "update";
                index = this.gridVmInputs.getSelectedIndex();
                var data = this.gridVmInputs.getRow(index);
                jsonOldItem = {
                    "type": data.type,
                    "bus": data.bus
                };
                oldItem = JSON.stringify(jsonOldItem);

                tmpvar = {
                    "icon": icon,
                    "type": "<B>" + inputType + "</B>",
                    "bus": "<B>" + bus + "</B>"
                };
                this.varVmInputList.setItem(index, tmpvar);
            }
            this.varVmConfigUpdate.addItem({
                "action": action,
                "index": index,
                "type": type,
                "item": item,
                "olditem": oldItem
            });

            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";
            this.vmInputDialog.hide();

        } catch (e) {
            this.showToastError("vmInputBtnSaveClick Error: " + e.toString());
            console.error('ERROR IN vmInputBtnSaveClick: ' + e);
        }
    },
    removeVmInputBtnClick: function(inSender) {
        try {
            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";

            var index = this.gridVmInputs.getSelectedIndex();
            var data = this.gridVmInputs.getRow(index);
            var heads = 0;

            if (data.icon.indexOf("-add.png") > -1) {
                for (var i = 0; i < this.varVmConfigUpdate.getCount(); i++) {
                    actionItem = this.varVmConfigUpdate.getItem(i);
                    if (actionItem.index === index) {
                        this.varVmConfigUpdate.removeItem(i);
                    }
                }
                this.varVmInputList.removeItem(index);
                heads = this.headNumber.getDataValue();
                heads = heads - 1;
                if (heads < 0) {
                    heads = 1;
                }
                this.headNumber.setDataValue(heads);
                return;
            }
            if (data.icon.indexOf("-update.png") > -1) {
                app.toastDialog.showToast("Cannot Remove a component set to be updated", 10000, "Warning", "cc", "This operation is not allowed");
                return;
            } else if (data.icon.indexOf("-remove.png") > -1) {
                app.toastDialog.showToast("Component is already set to be removed", 10000, "Warning", "cc", "This operation is not allowed");
                return;
            }

            var jsonItem = {
                "type": data.type,
                "bus": data.bus
            };
            var item = JSON.stringify(jsonItem);
            var oldItem = "";
            this.varVmConfigUpdate.addItem({
                "action": "remove",
                "index": index,
                "type": "input",
                "item": item,
                "olditem": oldItem
            });

            //icon = '<image style="height: 30px;" src="resources/images/icons/hardware/vnc-remove.png" align="middle"/>';
            icon = "resources/images/icons/hardware/vnc-remove.png";
            tmpvar = {
                "icon": icon,
                "type": "<B>" + data.type + "</B>",
                "bus": "<B>" + data.bus + "</B>"
            };
            this.varVmInputList.setItem(index, tmpvar);
            this.gridGraphics.reflow();
        } catch (e) {
            console.error('ERROR IN removeVmInputBtnClick: ' + e);
        }
    },
    btnAddVmTimerClick: function(inSender) {
        try {
            this.vmConfigTimerDialog.setTitle("New timer");
            this.vmConfigTimerDialog.show();
            this.selectTimerName.setDisplayValue("");
            this.selectTimerPresent.setDisplayValue("yes");
            this.selectTimerPolicy.setDisplayValue("");
            this.textTimerFrequency.setDisplayValue("");
            this.selectTimerMode.setDisplayValue("");
            this.selectTimerTrack.setDisplayValue("");
            this.textTimerFrequency.setShowing(false);
            this.selectTimerMode.setShowing(false);
            this.selectTimerTrack.setShowing(false);
            if (this.vmConfigTimerDialog.height !== 198) {
                this.vmConfigTimerDialog.setHeight(198);
            }

        } catch (e) {
            console.error('ERROR IN btnAddVmTimerClick: ' + e);
        }
    },
    btnUpdateVmTimerClick: function(inSender) {
        try {
            this.vmConfigTimerDialog.setTitle("Update timer");
            this.vmConfigTimerDialog.show();

        } catch (e) {
            console.error('ERROR IN btnUpdateVmTimerClick: ' + e);
        }
    },
    selectTimerNameChange: function(inSender) {
        try {
            var timer = this.selectTimerName.getValue("dataValue");
            if (timer === "tsc") {
                this.textTimerFrequency.setShowing(true);
                this.selectTimerMode.setShowing(true);
                this.selectTimerTrack.setShowing(false);
                if (this.vmConfigTimerDialog.height !== 266) {
                    this.vmConfigTimerDialog.setHeight(266);
                }
            } else if ((timer === "rtc") || (timer === "plateform")) {
                this.textTimerFrequency.setShowing(false);
                this.selectTimerMode.setShowing(false);
                this.selectTimerTrack.setShowing(true);
                if (this.vmConfigTimerDialog.height !== 232) {
                    this.vmConfigTimerDialog.setHeight(232);
                }
            } else {
                this.textTimerFrequency.setShowing(false);
                this.selectTimerMode.setShowing(false);
                this.selectTimerTrack.setShowing(false);
                if (this.vmConfigTimerDialog.height !== 198) {
                    this.vmConfigTimerDialog.setHeight(198);
                }
            }


        } catch (e) {
            this.showToastError("selectTimerNameChange Error: " + e.toString());
            console.error('ERROR IN selectTimerNameChange: ' + e);
        }
    },
    vmTimerBtnSaveClick: function(inSender) {
        try {
            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";

            var timerName = this.selectTimerName.getDisplayValue();
            if (this.vmConfigTimerDialog.title === "New timer") {
                var newTimerEntry = {
                    "name": timerName,
                    "tickpolicy": this.selectTimerPolicy.getDisplayValue(),
                    "track": this.selectTimerTrack.getDisplayValue(),
                    "present": this.selectTimerPresent.getDisplayValue(),
                    "frequency": this.textTimerFrequency.getDisplayValue(),
                    "mode": this.selectTimerMode.getDisplayValue(),
                    "status": '<image title="Timer added. Configuration needs to be saved." style="height: 16px;" src="resources/images/icons/actions/add-16.png"/>'
                };
                this.varVmTimers.addItem(newTimerEntry);
                app.toastDialog.showToast("Save your configuration to apply changes.", 1500, "Success", "cc", 'Timer "' + timerName + '" set to be added');
            } else {
                var updateTimerEntry = {
                    "name": timerName,
                    "tickpolicy": this.selectTimerPolicy.getDisplayValue(),
                    "track": this.selectTimerTrack.getDisplayValue(),
                    "present": this.selectTimerPresent.getDisplayValue(),
                    "frequency": this.textTimerFrequency.getDisplayValue(),
                    "mode": this.selectTimerMode.getDisplayValue(),
                    "status": '<image title="Timer updated. Configuration needs to be saved." style="height: 16px;" src="resources/images/icons/actions/update-16.png"/>'
                };
                var selected = this.gridVmTimerList.getSelectedIndex();
                this.varVmTimers.setItem(selected, updateTimerEntry);
                app.toastDialog.showToast("Save your configuration to apply changes.", 1500, "Success", "cc", 'Timer "' + timerName + '" set to be updated');
            }
            this.vmConfigTimerDialog.hide();


        } catch (e) {
            this.showToastError("vmTimerBtnSaveClick Error: " + e.toString());
            console.error('ERROR IN vmTimerBtnSaveClick: ' + e);
        }
    },
    btnRemoveVmTimerClick: function(inSender) {
        try {

            var index = this.gridVmTimerList.getSelectedIndex();
            var selectedRow = this.gridVmTimerList.getRow(index);
            var removedEntry = {
                "name": "<s>" + selectedRow.name + "</s>",
                "tickpolicy": "<s>" + selectedRow.tickpolicy + "</s>",
                "track": "<s>" + selectedRow.track + "</s>",
                "present": "<s>" + selectedRow.present + "</s>",
                "frequency": "<s>" + selectedRow.frequency + "</s>",
                "mode": "<s>" + selectedRow.mode + "</s>",
                "status": '<image title="Timer removed. Configuration needs to be saved." style="height: 16px;" src="resources/images/icons/actions/delete-16.png"/>'
            };
            this.varVmTimers.setItem(index, removedEntry);
            app.toastDialog.showToast("Save your configuration to apply changes.", 1500, "Success", "cc", 'Timer "' + selectedRow.name + '" set to be removed');
            this.enableVmConfigSave();
            this._vmConfigHotswapable = "no";
        } catch (e) {
            this.showToastError("btnRemoveVmTimerClick Error: " + e.toString());
            console.error('ERROR IN btnRemoveVmTimerClick: ' + e);
        }
    },
    ///// End VM configuration //////////////////////////////////////////////////////
    ///// Start VM actions  /////////////////////////////////////////////////////////
    SendCtrlAltDelClick: function(inSender) {
        try {
            this.iFrameVnc.frame.contentWindow.sendCtrlAltDel();
        } catch (e) {
            this.showToastError(this.name + "ERROR IN SendCtrlAltDelClick: " + e.toString());
            console.error('ERROR IN SendCtrlAltDelClick: ' + e);
        }
    },
    vncReloadBtnClick: function(inSender) {
        try {
            this.iFrameVnc.frame.contentWindow.document.location.reload();
            //this.iFrameVnc.frame.contentWindow.document.location.reload();
        } catch (e) {
            this.showToastError(this.name + "ERROR IN button2Click: " + e.toString());
            console.error('ERROR IN buttonTest3Click: ' + e);
        }
    },
    iFrameVncMouseOver: function(inSender, event) {
        try {
            if (this.iFrameVnc.source !== "") {
                this._vncFocusTries = 0;
                this.iFrameVnc.frame.contentWindow.focus();
            } else {
                if (this.TabVmScreen.isActive()) {
                    if (this._vncFocusTries < 15) {
                        this._vncFocusTries += 1;
                        var timeout = 2000; // 2 seconds
                        setTimeout(function() {
                            try {
                                wm.Page.getPage("Main").iFrameVncMouseOver();
                            } catch (e) {
                                alert(e);
                            }
                        }, timeout);
                    }
                } else {
                    this._vncFocusTries = 0;
                }
            }
        } catch (e) {
            this.showToastError(this.name + "ERROR IN iFrameVncMouseOver: " + e.toString());
            console.error('ERROR IN iFrameVncMouseOver: ' + e);
        }
    },
    TabVmScreenShow: function(inSender) {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var locked = this.vmIsLocked(vmInfos);
            if (locked) {
                this.loadingLockScreen.setShowing(true);
            } else {
                this.startVnc(vmInfos);

                var varStatus = "Status" + vmInfos;
                var vmStatus = this[varStatus].getValue("dataValue");
                if (vmStatus === "running") {
                    this.startVmVncBtn.setDisabled(true);
                    this.startVmVncBtn.removeUserClass("wm_BackgroundChromeBar_LightGray");
                    this.pauseVmVncBtn.setDisabled(false);
                    this.pauseVmVncBtn.addUserClass("wm_BackgroundChromeBar_LightGray");
                    this.stopVmVncBtn.setDisabled(false);
                    this.stopVmVncBtn.addUserClass("wm_BackgroundChromeBar_LightGray");
                    this.killVmVncBtn.setDisabled(false);
                    this.killVmVncBtn.addUserClass("wm_BackgroundChromeBar_LightGray");

                } else if ((vmStatus === "stopped") || (vmStatus === "suspended")) {
                    this.startVmVncBtn.setDisabled(false);
                    this.startVmVncBtn.addUserClass("wm_BackgroundChromeBar_LightGray");
                    this.startVmVncBtn.hint = "Start Virtual Machine";
                    this.pauseVmVncBtn.setDisabled(true);
                    this.pauseVmVncBtn.removeUserClass("wm_BackgroundChromeBar_LightGray");
                    this.stopVmVncBtn.setDisabled(true);
                    this.stopVmVncBtn.removeUserClass("wm_BackgroundChromeBar_LightGray");
                    this.killVmVncBtn.setDisabled(true);
                    this.killVmVncBtn.removeUserClass("wm_BackgroundChromeBar_LightGray");

                } else if (vmStatus === "paused") {
                    this.startVmVncBtn.setDisabled(false);
                    this.startVmVncBtn.addUserClass("wm_BackgroundChromeBar_LightGray");
                    this.startVmVncBtn.hint = "Resume Virtual Machine";
                    this.pauseVmVncBtn.setDisabled(true);
                    this.pauseVmVncBtn.removeUserClass("wm_BackgroundChromeBar_LightGray");
                    this.stopVmVncBtn.setDisabled(true);
                    this.stopVmVncBtn.removeUserClass("wm_BackgroundChromeBar_LightGray");
                    //this.killVmVncBtn.setDisabled(true);
                    //this.killVmVncBtn.addUserClass("wm_BackgroundChromeBar_LightGray");
                }
            }
        } catch (e) {
            this.showToastError("ERROR IN TabVmScreenShow: " + e.toString());
            console.error('ERROR IN TabVmScreenShow: ' + e);
        }
    },
    textWebsocketEnterKeyPress: function(inSender) {
        try {
            var uri = this.textWebsocket.getDataValue();
            this.iFrameVnc.setSource(uri);

        } catch (e) {
            console.error('ERROR IN textWebsocketEnterKeyPress: ' + e);
        }
    },
    startVnc: function(vmInfos) {
        try {
            this.loadingDialogConsole.setShowing(false);
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            var hostname = window.location.hostname;
            var varVnc = "VNC" + vmInfos;
            var port = this[varVnc].getValue("dataValue");
            //var node = this.varSelectedServer.getValue("dataValue");
            if ((port.indexOf("none") > -1) || (port.indexOf("-1") > -1)) {
                //var varServer = vName + "Server";
                //node = this[varServer].getValue("dataValue");
                this.iFrameVnc.setSource("");
                this.textWebsocket.setDataValue("not available.");
                var varIP = node + "ip";
                var sIP = this[varIP].getValue("dataValue");
                var varConnected = node + "connected";
                var nodeOnLine = this[varConnected].getValue("dataValue");
                var varStatus = "Status" + vName + "__" + node;
                var vmStatus = this[varStatus].getValue("dataValue");
                if ((nodeOnLine) && (vmStatus === "running")) {
                    this.javaGetVmDisplay.input.setValue("node", node);
                    this.javaGetVmDisplay.input.setValue("vName", vName);
                    this.javaGetVmDisplay.update();
                    this.loadingDialogConsole.setShowing(true);
                }
            } else {
                var proto = window.location.protocol;
                var uri_html = "vnc_auto.html?";
                var uri_port = "&port=" + port;
                var encrypt = "&encrypt=false";
                var path = "";
                var clientId = this.varClientId.getValue("dataValue");
                if (proto === "https:") {
                    encrypt = "&encrypt=true";
                    uri_port = "&port=443";
                    path = "&path=ws/" + port + "?id=" + clientId;
                }

                this.loadingDialogDetachConsole.setShowing(false);
                var uri = "resources/novnc/" + uri_html + "host=" + hostname + uri_port + encrypt + path;
                this.textWebsocket.setDataValue(uri);
                var location = "";
                var uri2 = "";

                dispName = this.getVmDisplayedName(vName, node);
                if (((this.layerServer.isActive()) && (this.TabDashboard.isActive())) || ((this.layerVirtualMachines.isActive()) && (this.TabVMsOverview.isActive()))) {
                    location = window.location.href.replace(/index.html/, "");
                    //uri2 = location + "/resources/novnc/vnc_auto_detached.html?host=" + hostname + uri_port + "&vmName=" + dispName + encrypt + path;
                    uri2 = location + "/resources/novnc/vnc_auto.html?host=" + hostname + uri_port + "&vmName=" + dispName + encrypt + path;
                    window.open(uri2, '', 'scrollbars=yes,menubar=no,height=400,width=600,resizable=yes,toolbar=no,location=no,status=no');
                } else {
                    this.iFrameVnc.setSource(uri);
                }
            }

        } catch (e) {
            this.showToastError("ERROR IN startVnc: " + e.toString());
            console.error('ERROR IN startVnc: ' + e);
        }
    },
    labelVmStartClick: function(inSender, inEvent) {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            //var varServer = vName + "Server";
            //var node = this[varServer].getValue("dataValue");
            var varStatus = "Status" + vName + "__" + node;
            var vmStatus = this[varStatus].getValue("dataValue");
            var task = "";

            if ((vmStatus === "stopped") || (vmStatus === "suspended")) {
                this.addLog("Start", vName, node, 0);
                task = "Start";
                this.javaStartVm.input.setValue("node", node);
                this.javaStartVm.input.setValue("vName", vName);
                this.javaStartVm.update();

            } else if (vmStatus === "paused") {
                //this.addLog("Resume", vName, node, 0);
                this.addLog("Pause", vName, node, 0);
                this.javaSendCommand.input.setValue("node", node);
                this.javaSendCommand.input.setValue("vName", vName);
                this.javaSendCommand.input.setValue("command", "resume");
                this.javaSendCommand.update();
            }

            if (this.VmPopupMenu.showing) {
                this.VmPopupMenu.hide();
            }

        } catch (e) {
            this.showToastError("ERROR IN labelVmStartClick: " + e.toString());
            console.error('ERROR IN labelVmStartClick: ' + e);
        }
    },
    startVmVncBtnClick: function(inSender, inEvent) {
        try {
            this.labelVmStartClick(inSender, inEvent);

        } catch (e) {
            console.error('ERROR IN startVmVncBtnClick: ' + e);
            this.showToastError("ERROR IN startVmVncBtnClick: " + e.toString());
        }
    },
    stopVmVncBtnClick: function(inSender, inEvent) {
        try {
            this.labelVmStopClick(inSender, inEvent);

        } catch (e) {
            console.error('ERROR IN labelVmStopClick: ' + e);
        }
    },
    labelVmStopClick: function(inSender, inEvent) {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            //var varServer = vName + "Server";
            //var node = this[varServer].getValue("dataValue");
            var varStatus = "Status" + vName + "__" + node;
            var vmStatus = this[varStatus].getValue("dataValue");

            if (vmStatus === "running") {
                this.addLog("Shutdown", vName, node, 20000);
                //this.setLogTimeout("Shutdown", vName, node, 20000);                
                this.javaSendCommand.input.setValue("node", node);
                this.javaSendCommand.input.setValue("vName", vName);
                this.javaSendCommand.input.setValue("command", "shutdown");
                this.javaSendCommand.update();
                this.VmPopupMenu.hide();
            }

        } catch (e) {
            console.error('ERROR IN labelVmStopClick: ' + e);
        }
    },
    labelVmRebootClick: function(inSender, inEvent) {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            //var varServer = vName + "Server";
            //var node = this[varServer].getValue("dataValue");
            var varStatus = "Status" + vName + "__" + node;
            var vmStatus = this[varStatus].getValue("dataValue");

            if (vmStatus === "running") {
                dojo.cookie("Reboot_" + vName + "_" + node, "SET", {
                    //key expire after 60 seconds
                    expires: 0.0006
                });
                this.addLog("Reboot", vName, node, 30000);
                //this.setLogTimeout("Reboot", vName, node, 30000);
                this.javaSendCommand.input.setValue("node", node);
                this.javaSendCommand.input.setValue("vName", vName);
                this.javaSendCommand.input.setValue("command", "reboot");
                this.javaSendCommand.update();
                this.VmPopupMenu.hide();
            }

        } catch (e) {
            this.showToastError("ERROR IN labelVmRebootClick: " + e.toString());
            console.error('ERROR IN labelVmRebootClick: ' + e);
        }
    },
    labelVmKillClick: function(inSender, inEvent) {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            //var varServer = vName + "Server";
            //var node = this[varServer].getValue("dataValue");
            var varStatus = "Status" + vName + "__" + node;
            var vmStatus = this[varStatus].getValue("dataValue");

            if ((vmStatus === "running") || (vmStatus === "paused")) {
                this.addLog("Stop", vName, node, 0);
                this.javaSendCommand.input.setValue("node", node);
                this.javaSendCommand.input.setValue("vName", vName);
                this.javaSendCommand.input.setValue("command", "kill");
                this.javaSendCommand.update();

                var varVnc = "VNC" + vName + "__" + node;
                this[varVnc].setValue("dataValue", "none");
                this.VmPopupMenu.hide();
            }

        } catch (e) {
            console.error('ERROR IN labelVmKillClick: ' + e);
        }
    },
    killVmVncBtnClick: function(inSender) {
        try {
            this.labelVmKillClick(inSender, null);

        } catch (e) {
            console.error('ERROR IN killVmVncBtnClick: ' + e);
        }
    },
    labelVmPauseClick: function(inSender, inEvent) {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            //var varServer = vName + "Server";
            //var node = this[varServer].getValue("dataValue");
            var varStatus = "Status" + vName + "__" + node;
            var vmStatus = this[varStatus].getValue("dataValue");

            if (vmStatus === "running") {
                this.addLog("Pause", vName, node, 0, "progess");
                this.javaSendCommand.input.setValue("node", node);
                this.javaSendCommand.input.setValue("vName", vName);
                this.javaSendCommand.input.setValue("command", "pause");
                this.javaSendCommand.update();
                var varVnc = "VNC" + vName + "__" + node;
                this[varVnc].setValue("dataValue", "none");
                this.VmPopupMenu.hide();
            }
        } catch (e) {
            console.error('ERROR IN labelVmPauseClick: ' + e);
        }
    },
    labelVmSuspendClick: function(inSender, inEvent) {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            var varStatus = "Status" + vName + "__" + node;
            var vmStatus = this[varStatus].getValue("dataValue");

            if (vmStatus === "running") {
                this.addLog("Suspend", vName, node, 0, "progess");
                this.javaSendCommand.input.setValue("node", node);
                this.javaSendCommand.input.setValue("vName", vName);
                this.javaSendCommand.input.setValue("command", "suspend");
                this.javaSendCommand.update();
                var varVnc = "VNC" + vName + "__" + node;
                this[varVnc].setValue("dataValue", "none");
                this.VmPopupMenu.hide();
            }

        } catch (e) {
            console.error('ERROR IN labelVmSuspendClick: ' + e);
        }
    },
    javaStartVmResult: function(inSender, inDeprecated) {
        try {
            var vName = "";
            var node = "";
            var result = this.javaStartVm.getValue("dataValue");
            if ((result.indexOf("Error") > -1) && (result.indexOf("result") === -1)) {
                var params = result.split("=");
                node = params[0];
                vName = params[1];
                this.updateLog("Start", vName, node, "Failed: " + result);
            } else {
                var jsonVar = JSON.parse(result);
                var owner = jsonVar.sender;
                node = jsonVar.node;
                vName = jsonVar.action.vm;
                res = jsonVar.action.result;
                if (res.indexOf("command sent") === -1) {
                    this.updateLog("Start", vName, node, "Failed: " + res);
                }
            }
        } catch (e) {
            this.updateLog("Send Start", "unknown", "unknown", "Failed: unknwon error");
            this.showToastError("ERROR IN javaStartVmResult: " + e.toString());
            console.error('ERROR IN javaStartVmResult: ' + e);
        }
    },
    javaSendCommandResult: function(inSender, inDeprecated) {
        try {
            var res = this.javaSendCommand.getValue("dataValue");
            this.logDebugVM("VM command result: " + res);
            infos = res.split("::");

            command = infos["0"];
            var vName = "";
            var node = "";
            if (command === "reboot") {
                command = "Reboot";
            } else if (command === "kill") {
                command = "Stop";
            } else if (command === "shutdown") {
                command = "Shutdown";
            } else if (command === "resume") {
                command = "Resume";
            } else if (command === "suspend") {
                command = "Suspend";
            } else if (command === "pause") {
                command = "Pause";
            }


            if (res.indexOf("Error") > -1) {
                node = infos["1"];
                vName = infos["2"];
                err = infos["3"];
                this.updateLog(command, vName, node, "Failed: " + err);
            } else {
                var jsonVar = JSON.parse(infos["1"]);
                var owner = jsonVar.sender;
                node = jsonVar.node;
                vName = jsonVar.action.vm;
                result = jsonVar.action.result;
                if (result.indexOf("Requested operation is not valid") > -1) {
                    this.updateLog(command, vName, node, "Failed: " + "Requested operation is not valid");
                } else if (result.indexOf("command sent") === -1) {
                    this.updateLog(command, vName, node, "Failed: " + result);
                }
            }

        } catch (e) {
            //this.updateLog("Send "+command, "unknown", "unknown", "Failed: unknwon error");
            this.showToastError("ERROR IN javaSendCommandResult: " + e.toString());
            console.error('ERROR IN javaSendCommandResult: ' + e);
        }
    },
    javaGetVmStatusResult: function(inSender, inDeprecated) {
        var result = this.javaGetVmStatus.getValue("dataValue");
        this.logDebugServer("vm status:" + result);

        var vName = "";
        var node = "";
        var picLabel = "";
        var jsonVar = "";
        var uri = "";
        try {
            if (result.indexOf("Error") > -1) {
                if (result.indexOf("Receive timed out") > -1) {
                    jsonVar = JSON.parse(result);
                    vName = jsonVar.action.vm;
                    node = jsonVar.node;
                    picLabel = "picLabel" + vName + "__" + node;
                    uri = '<image style="height: 20px;" src="resources/images/icons/20/dialog-warning-20.png"/>';
                    this.deactivateVm(vName, node, "failed to answer");
                    this[picLabel].setCaption(uri);
                    this[picLabel].reflow();
                    this.setVmTooltip(vName, node, "Receive timed out", "error");
                }
            } else {
                jsonVar = JSON.parse(result);
                var infos = jsonVar.action.result;
                vName = jsonVar.action.vm;
                node = jsonVar.node;
                this.changeVmState(vName, node, infos.state, infos.locked, infos.lockName);
                
            }

        } catch (e) {
            this.showToastError("ERROR IN javaGetVmStatusResult: " + e.toString());
            console.error('ERROR IN javaGetVmStatusResult: ' + e);
        }
    },
    javaGetVmListStatusResult: function(inSender, inDeprecated) {
        var serviceName = inSender.name.toString();
        var result = this[serviceName].getValue("dataValue");
        this.logDebugDataCenter("vm list status:" + result);
        try {
            if (result.indexOf("Error") === 0) {
                this.showToastError("error getting  vm status:" + result);
            } else {
                node = "";
                var jsonVar = JSON.parse(result);
                for (var i = 0; i < jsonVar.list.length; i++) {
                    var jsonRes = JSON.parse(jsonVar.list[i]);
                    var infos = jsonRes.action.result;
                    var vName = jsonRes.action.vm;
                    if (node === "") {
                        node = jsonRes.node;
                    }
                    this.changeVmState(vName, node, infos.state, infos.locked, infos.lockName);
                }
                var varPictWait = "PictServerWait" + node;
                if (this[varPictWait] !== undefined) {
                    this[varPictWait].setShowing(false);
                    var varPictVMListWait = "PictVMListWait" + node;
                    this[varPictVMListWait].setShowing(false);
                }

            }
        } catch (e) {
            this.showToastError("ERROR IN javaGetVmListStatusResult: " + e.toString());
            console.error('ERROR IN javaGetVmListStatusResult: ' + e);
        }
    },
    changeVmState: function(vName, node, state, locked, lockName) {
        try {
            locked = typeof locked !== 'undefined' ? locked : false;
            lockName = typeof lockName !== 'undefined' ? lockName : 'b';

            var picLabel = "picLabel" + vName + "__" + node;
            var uri = "";
            var varStatus = "Status" + vName + "__" + node;
            var ext = ".png";
            var panelVM = "panelVm" + vName + "__" + node;
            var vm_state = "stopped";
            // Check if user has rights to display VM
            var tipType = "notice";
            var tipMsg = "";
            if (this[varStatus] !== undefined) {
                if (locked) {
                    this.setVmLock(vName + "__" + node, lockName, true);
                    ext = "-locked.png";
                    if (lockName === "Snapshot") {
                        this.deactivateVmSnapshot(vName, node, "is locked. Processing a snapshot.");
                    } else if (lockName === "Migration") {
                        this.deactivateVmMigration(vName, node, "is locked. Processing a migration");
                    } else {
                        this.deactivateVm(vName, node, "is locked.");
                    }
                } else {
                    this.clearVmLocks(vName + "__" + node);
                }
                switch (state) {
                    case "running":
                        uri = '<image style="height: 20px;" src="resources/images/icons/20/start2' + ext + '"/>';
                        vm_state = "running";
                        break;
                    case "shutoff":
                        uri = '<image style="height: 20px;" src="resources/images/icons/20/system-shutdown' + ext + '"/>';
                        vm_state= "stopped";
                        break;
                    case "paused":
                        uri = '<image style="height: 20px;" src="resources/images/icons/20/pause' + ext + '"/>';
                        vm_state = "paused";
                        break;
                    case "suspended":
                        uri = '<image style="height: 20px;" src="resources/images/icons/20/suspend' + ext + '"/>';
                        vm_state = "suspended";
                        break;
                    case "crashed":
                        uri = '<image style="height: 20px;" src="resources/images/icons/20/crashed' + ext + '"/>';
                        vm_state = "crashed";
                        break;
                    default:
                        if (state.indexOf("vm does not exist") > -1) {
                            uri = '<image style="height: 20px;" src="resources/images/icons/20/dialog-warning-20.png"/>';
                            vm_state = "stopped";
                            tipMsg = "VM has not been found on node";
                            this.deactivateVm(vName, node, tipMsg);
                            tipType = "error";
                        } else if (state.indexOf("being shut dow") > -1) {
                            uri = '<image style="height: 20px;" src="resources/images/icons/20/system-reboot' + ext + '"/>';
                            vm_state = "rebooted";
                        } else {
                            uri = '<image style="height: 20px;" src="resources/images/icons/20/system-shutdown.png"/>';
                            vm_state = "stopped";
                        }
                        break;
                }
                if (tipMsg === "") {
                    tipMsg = "is "+vm_state;
                }
                this[varStatus].setData({dataValue: vm_state});
                this.setVmTooltip(vName, node, tipMsg, tipType);
                this[picLabel].setCaption(uri);
                this[picLabel].reflow();
            }

        } catch (e) {
            this.showToastError("ERROR IN changeVmState: " + e.toString());
            console.error('ERROR IN changeVmState: ' + e);
        }
    },

    deactivateVm: function(vName, node, message) {
        try {
            var picLabel = "picLabel" + vName + "__" + node;
            var panelVM = "panelVm" + vName + "__" + node;
            var varLabel = "Label" + vName + "__" + node;
            var varConnected = node + "connected";
            var nodeOnLine = this[varConnected].getValue("dataValue");
            if (nodeOnLine) {
                this.setVmTooltip(vName, node, "has been deactivated:</br>"+message, "error");
            }
            dojo.style(this[panelVM].domNode, "opacity", 0.5);
            this.unsetVmDragAndDrop(vName, node);
            var selected = this.varSelectedVm.getValue("dataValue");
            if (selected === vName + "__" + node) {
                this.tabVirtualMachines.setShowing(false);
                this.panelVmDisabled.setShowing(true);
            }
            
        } catch (e) {
            this.showToastError("ERROR IN deactivateVm: " + e.toString());
            console.error('ERROR IN deactivateVm: ' + e);
        }
    },
    deactivateVmMigration: function(vName, node, message) {
        try {
            var picLabel = "picLabel" + vName + "__" + node;
            var panelVM = "panelVm" + vName + "__" + node;
            var varLabel = "Label" + vName + "__" + node;
            var varConnected = node + "connected";
            var nodeOnLine = this[varConnected].getValue("dataValue");
            if (nodeOnLine) {
                this.setVmTooltip(vName, node, "is locked during its migration", "error");
            }
            dojo.style(this[panelVM].domNode, "opacity", 0.5);
            this.unsetVmDragAndDrop(vName, node);
            var selected = this.varSelectedVm.getValue("dataValue");
            if (selected === vName + "__" + node) {
                this.panelVmOverviewWarning.setShowing(true);
                this.labelVmOverviewWarning.setCaption("This Virtual Machine is locked during its migration.");
                if (this.TabVmScreen.isActive()) {
                    this.loadingDialogConsole.setShowing(true);
                }
            }
            var varVnc = "VNC" + vName + "__" + node;
            this[varVnc].setValue("dataValue", "none");
            
        } catch (e) {
            this.showToastError("ERROR IN deactivateVm: " + e.toString());
            console.error('ERROR IN deactivateVm: ' + e);
        }
    },
    deactivateVmSnapshot: function(vName, node, message) {
        try {
            var picLabel = "picLabel" + vName + "__" + node;
            var panelVM = "panelVm" + vName + "__" + node;
            var varLabel = "Label" + vName + "__" + node;

            var varConnected = node + "connected";
            var nodeOnLine = this[varConnected].getValue("dataValue");
            if (nodeOnLine) {
                this.setVmTooltip(vName, node, "is deactivated during its snapshot", "error");
            }
            dojo.style(this[panelVM].domNode, "opacity", 0.8);
            this.unsetVmDragAndDrop(vName, node);
            var selected = this.varSelectedVm.getValue("dataValue");
            var snapCookie = dojo.cookie("openkvi_vm_snapshot_" + vName + ":::" + node);
            if (selected === vName + "__" + node) {
                if ((this.TabVmSnapshots.isActive()) && (snapCookie === undefined)) {
                    this.loadingSnapshots.setShowing(true);
                }
            }
            
        } catch (e) {
            this.showToastError("ERROR IN deactivateVm: " + e.toString());
            console.error('ERROR IN deactivateVm: ' + e);
        }
    },
    activateVm: function(vName, node) {
        try {
            var picLabel = "picLabel" + vName + "__" + node;
            var panelVM = "panelVm" + vName + "__" + node;
            var varLabel = "Label" + vName + "__" + node;
            dojo.style(this[panelVM].domNode, "opacity", 1);
            this.setVmDragAndDrop(vName, node);
            var selected = this.varSelectedVm.getValue("dataValue");
            if (selected === vName + "__" + node) {
                this.tabVirtualMachines.setShowing(true);
                this.panelVmDisabled.setShowing(false);
            }
            var varStatus = "Status" + vName + "__" + node;
            var vm_state = this[varStatus].getData("dataValue");
            this.changeVmState(vName, node, vm_state, false, "");
        } catch (e) {
            this.showToastError("ERROR IN activateVm: " + e.toString());
            console.error('ERROR IN activateVm: ' + e);
        }
    },
    activateVmMigration: function(vName, node) {
        try {
            var picLabel = "picLabel" + vName + "__" + node;
            var panelVM = "panelVm" + vName + "__" + node;
            var varLabel = "Label" + vName + "__" + node;
            //var varServer = vName + "Server";
            //var destNode =  this[varServer].getValue("dataValue");
            dojo.style(this[panelVM].domNode, "opacity", 1);
            this.setVmDragAndDrop(vName, node);
            var selected = this.varSelectedVm.getValue("dataValue");
            if (selected === vName + "__" + node) {
                this.panelVmOverviewWarning.setShowing(false);
                this.loadingDialogConsole.setShowing(false);
            }
            var varStatus = "Status" + vName + "__" + node;
            var vm_state = this[varStatus].getData("dataValue");
            this.changeVmState(vName, node, vm_state, false, "");
        } catch (e) {
            this.showToastError("ERROR IN activateVm: " + e.toString());
            console.error('ERROR IN activateVm: ' + e);
        }
    },
    activateVmSnapshot: function(vName, node) {
        try {
            var picLabel = "picLabel" + vName + "__" + node;
            var panelVM = "panelVm" + vName + "__" + node;
            var varLabel = "Label" + vName + "__" + node;

            dojo.style(this[panelVM].domNode, "opacity", 1);
            this.setVmDragAndDrop(vName, node);
            var selected = this.varSelectedVm.getValue("dataValue");
            var snapCookie = dojo.cookie("openkvi_vm_snapshot_" + vName + ":::" + node);
            if (selected === vName + "__" + node) {
                if ((this.TabVmSnapshots.isActive()) && (snapCookie === undefined)) {
                    this.loadingSnapshots.setShowing(false);
                    this.TabVmSnapshotsShow();
                }
            }
            this[panelVM].reflow();
            var varStatus = "Status" + vName + "__" + node;
            var vm_state = this[varStatus].getData("dataValue");
            this.changeVmState(vName, node, vm_state, false, "");
        } catch (e) {
            this.showToastError("ERROR IN activateVm: " + e.toString());
            console.error('ERROR IN activateVm: ' + e);
        }
    },
    javaGetVmDisplayResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaGetVmDisplay.getValue("dataValue");
            if (result.indexOf("Error") > -1) {
                if (result.indexOf("no vnc display") === -1) {
                    this.showToastError("error getting  vm display:" + result);
                } else {
                    this.textWebsocket.setDataValue("");
                    this.iFrameVnc.setSource("");
                }
            } else {
/*
                var params = result.split("=");
                var node = params[0];
                var vName = params[1];
                var port = params[2];
                var varVnc = "VNC"+vName+"__"+node;
                this[varVnc].setValue("dataValue", port);
                this.startVnc(vName+"__"+node);
                */
                var jsonVar = JSON.parse(result);
                var PortList = jsonVar.action.result;
                vName = jsonVar.action.vm;
                node = jsonVar.node;
                picLabel = "picLabel" + vName + "__" + node;
                var varVnc = "VNC" + vName + "__" + node;

                var args = PortList.split(',');
                var port = args[0].replace('/ /g', '');
                this[varVnc].setValue("dataValue", port);
                this.startVnc(vName + "__" + node);

            }

        } catch (e) {
            this.showToastError("ERROR IN javaGetVmDisplayResult: " + e.toString());
            console.error('ERROR IN javaGetVmDisplayResult: ' + e);
        }
    },
    javaGetVmScreenShotResult: function(inSender, inDeprecated) {
        try {
            this.vmScreenshotpict.setShowing(true);
            this.pictureVmReloadOverview.setSource("resources/images/icons/photo.png");
            var source = "resources/images/logos/notrunning-240.png";
            var result = this.javaGetVmScreenShot.getValue("dataValue");
            //this.logDebugVM(result);
            if (result.indexOf("Error") > -1) {
                source = "resources/images/logos/notavailable-240.png";
            } else {
                var jsonVar = JSON.parse(result);
                var state = jsonVar.action.result;
                var vName = jsonVar.action.vm;
                var node = jsonVar.node;
                if (state.indexOf("Failed: not supported") > -1) {
                    source = "resources/images/logos/notavailable-240.png";
                } else if (state.indexOf("Failed: domain is not running") > -1) {
                    source = "resources/images/logos/notrunning-240.png";
                } else {
                    source = "resources/data/" + node + "/screenshots/" + vName + "-240.png";
                }

            }
            this.vmScreenshotpict.setSource(source);

        } catch (e) {
            this.showToastError("ERROR IN javaGetVmScreenShotResult: " + e.toString());
            console.error('ERROR IN javaGetVmScreenShotResult: ' + e);
        }
    },
    vmScreenshotpictClick: function(inSender) {
        try {
            var source = this.vmScreenshotpict.source;
            if ((source.indexOf("notrunning") < 0) && (source.indexOf("notavailable") < 0)) {
                var vmInfos = this.varSelectedVm.getValue("dataValue");
                this.startVnc(vmInfos);
            }

        } catch (e) {
            console.error('ERROR IN vmScreenshotpictClick: ' + e);
        }
    },
    passwordRequired: function(rfb) {
        this.showToastError("Password is required !");
    },
    newVncWindowBtnClick: function(inSender) {
        try {
            var hostname = window.location.hostname;
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            //var node = this.varSelectedServer.getValue("dataValue");
            var varVnc = "VNC" + vName + "__" + node;
            var port = this[varVnc].getValue("dataValue");
            var location = window.location.href.replace(/index.html/g, "");
            if (port.indexOf("none") > -1) {
                this.showToastError("No vnc display available");
            } else {
                var proto = window.location.protocol;
                var uri_port = "&port=" + port;
                var encrypt = "&encrypt=false";
                var path = "";
                var clientId = this.varClientId.getValue("dataValue");
                if (proto === "https:") {
                    encrypt = "&encrypt=true";
                    uri_port = "&port=443";
                    path = "&path=ws/" + port + "?id=" + clientId;
                }
                dispName = this.getVmDisplayedName(vName, node);
                //var uri = location + "/resources/novnc/vnc_auto_detached.html?host=" + hostname + uri_port + "&vmName=" + dispName + encrypt + path;
                var uri = location + "/resources/novnc/vnc_auto.html?host=" + hostname + uri_port + "&vmName=" + dispName + encrypt + path;
                window.open(uri, "", 'scrollbars=yes,menubar=no,height=400,width=600,resizable=yes,toolbar=no,location=no,status=no');
            }


        } catch (e) {
            this.showToastError("ERROR IN newVncWindowBtnClick: " + e.toString());
            console.error('ERROR IN newVncWindowBtnClick: ' + e);
        }
    },
    TabVmPerformancesShow: function(inSender) {
        try {
            this.varVmTop.clearData();
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            //var varServer = vName + "Server";
            //var node = this[varServer].getValue("dataValue");
            var varIP = node + "ip";
            var sIP = this[varIP].getValue("dataValue");
            this.javaVmVirtop.input.setValue("node", node);
            this.javaVmVirtop.input.setValue("vm", vName);
            this.javaVmVirtop.input.setValue("ipaddr", sIP);
            this.javaVmVirtop.update();
            for (var i = 0; i < 21; i++) {
                var data = {
                    "read": 0,
                    "write": 0,
                    "net_rx": 0,
                    "net_tx": 0,
                    "cpu": 0,
                    "mem": 0,
                    "index": (3 * i)
                };

                this.varVmTop.addItem(data);
            }


        } catch (e) {
            this.showToastError(this.name + "ERROR IN TabVmPerformancesShow: " + e.toString());
            console.error('ERROR IN TabVmPerformancesShow: ' + e);
        }
    },
    javaVmVirtopResult: function(inSender, inDeprecated) {
        try {
            // ;1;R;0;0;342;0;1,6;12,0;238:17.14;Asterisk
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];

            var result = this.javaVmVirtop.getValue("dataValue");
            this.logDebugServer("virtop:" + result);
            var args = result.split("=");
            var vm = args[0];

            if ((vm === vName) && (args[1].length > 0)) {
                var count = this.varVmTop.getCount();
                if (count === 21) {
                    this.varVmTop.removeItem(0);
                    var tmpData = this.varVmTop.getData();
                    for (var i = 0; i < count - 1; i++) {
                        tmpData[i].index = (3 * i);
                    }
                    this.varVmTop.setData(tmpData);
                }

                var list = args[1].split(";");
                var index = (3 * this.varVmTop.getCount());
                var tmp = list[7].split(",");
                var tmp1 = tmp[0].split(".");
                var cpu = tmp1[0];
                tmp = list[8].split(",");
                tmp1 = tmp[0].split(".");
                var mem = tmp1[0];
                var rx = 0;
                var tx = 0;
                if (list[5].indexOf("K") > -1) {
                    rx = list[5].replace(/K/, "");
                } else if (list[5].indexOf("M") > -1) {
                    rx = (list[5].replace(/M/, "") * 1000);
                } else if (list[5].indexOf("G") > -1) {
                    rx = (list[5].replace(/G/, "") * 1000000);
                } else {
                    rx = (list[5].replace(/K/, "") / 1000);
                }
                if (list[6].indexOf("K") > -1) {
                    tx = list[6].replace(/K/, "");
                } else if (list[6].indexOf("M") > -1) {
                    tx = (list[6].replace(/M/, "") * 1000);
                } else if (list[6].indexOf("G") > -1) {
                    tx = (list[6].replace(/G/, "") * 1000000);
                } else {
                    tx = (list[6].replace(/K/, "") / 1000);
                }

                //parseInt();
                var data = {
                    "read": list[3],
                    "write": list[4],
                    "net_rx": rx,
                    "net_tx": tx,
                    "cpu": cpu,
                    "mem": mem,
                    "index": index
                };

                this.varVmTop.addItem(data);
            } else {
                this.varVmTop.clearData();
            }
            if (this.TabVmPerformances.isActive()) {
                //var varServer = vName + "Server";
                //var node = this[varServer].getValue("dataValue");
                this.javaVmVirtop.input.setValue("node", node);
                this.javaVmVirtop.input.setValue("vm", vName);
                this.javaVmVirtop.update();
            }

        } catch (e) {
            this.showToastError(this.name + "ERROR IN javaVmVirtopResult: " + e.toString());
            console.error('ERROR IN javaVmVirtopResult: ' + e);
        }
    },
    ///// End VM actions ////////////////////////////////////////////////////////////
    TabDashboardShow: function(inSender) {
        try {
            this.getVmScreenshots(true);
        } catch (e) {
            this.showToastError(this.name + "ERROR IN TabDashboardShow: " + e.toString());
            console.error('ERROR IN TabDashboardShow: ' + e);
        }
    },
    getVmScreenshots: function(showWait) {
        try {
            if (this.TabDashboard.isActive()) {
                if (showWait !== undefined) {
                    this.htmlNodeDashboard.setShowing(false);
                    this.pictureLoadingBoard.setShowing(true);
                }
                var node = this.varSelectedServer.getValue("dataValue");
                var count = this.tablevmsLiveVariable2.getCount();
                var projectData = null;
                var vName = "";
                var vmList = "";
                if (count > 0) {
                    for (var i = 0; i < count; i++) {
                        projectData = this.tablevmsLiveVariable2.getData()[i] || 0;
                        if ((projectData) && (projectData.server === node)) {
                            vName = projectData.name;
                            if (vmList.length === 0) {
                                vmList = vName;
                            } else {
                                vmList += "::" + vName;
                            }
                        }
                    }
                    var varGetVmListScreenshot = node + "getVmListScreenshot";
                    this[varGetVmListScreenshot].input.setValue("node", node);
                    this[varGetVmListScreenshot].input.setValue("vmList", vmList);
                    this[varGetVmListScreenshot].update();
                }
            }
        } catch (e) {
            this.showToastError(this.name + "ERROR IN getVmScreenshots: " + e.toString());
            console.error('ERROR IN getVmScreenshots: ' + e);
        }
    },

    javaGetVmListScreenshotResult: function(inSender, inDeprecated) {
        var serviceName = inSender.name.toString();
        var result = this[serviceName].getValue("dataValue");
        this.logDebugDataCenter("screenshots: " + result);
        if (this.pictureLoadingBoard.showing === true) {
            this.pictureLoadingBoard.setShowing(false);
            this.htmlNodeDashboard.setShowing(true);
        }
        try {
            var jsonRes = {};
            var vName = "";
            var node = "";
            var path = "";
            var html = '<body>\n';
            if (result.indexOf("Error") < 0) {
                var jsonVar = JSON.parse(result);
                for (var i = 0; i < jsonVar.action.result.length; i++) {
                    jsonRes = jsonVar.action.result[i];
                    path = jsonRes.path;
                    vName = jsonRes.name;
                    if (node === "") {
                        node = jsonVar.node;
                    }
                    var screenshot = "";
                    if (path.search("not supported") > -1) {
                        screenshot = "resources/images/logos/notsupported-168.png";
                    } else if (path.search("not running") > -1) {
                        screenshot = "resources/images/logos/notrunning-168.png";
                    } else {
                        screenshot = "resources/data/" + node + "/screenshots/" + vName + "-168.png";
                    }
                    html += '<div id="id_' + vName + '" class="img wm_BorderTopStyle_Curved4px wm_BorderBottomStyle_Curved4px wm_BorderShadow_WeakShadow">';
                    html += '<img src="' + screenshot + '"';
                    html += ' alt="' + vName + '" width="168" height="94"/>\n';
                    html += '<div id="name_screenshot_vm_' + vName + '" class="desc">' + this.getVmDisplayedName(vName, node) + '</div>\n</div>\n';
                }

                var htmlHead = '<html>\n<head>\n';
                htmlHead += '<style type="text/css">\n';
                htmlHead += 'div.img\n {\n';
                htmlHead += '  margin: 10px;\n';
                htmlHead += '  padding: 2px;\n';
                htmlHead += '  border: 1px solid #0000ff;\n';
                htmlHead += '  height: auto;\n';
                htmlHead += '  width: auto;\n';
                htmlHead += '  float: left;\n';
                htmlHead += '  text-align: center;\n}';
                htmlHead += 'div.img img\n {\n';
                htmlHead += '  cursor: pointer;\n';
                htmlHead += '  display: inline;\n';
                htmlHead += '  margin: 3px;\n';
                htmlHead += '  border: 1px solid #ffffff;\n}';
                htmlHead += 'div.img a:hover img {border: 1px solid #0000ff;}';
                htmlHead += 'div.desc\n {\n';
                htmlHead += ' text-align: center;\n';
                htmlHead += ' font-weight: normal;\n';
                htmlHead += '  width: 120px;\n';
                htmlHead += '  margin: 2px;\n}';
                htmlHead += '</style>\n';
                htmlHead += '</head>\n';
                var htmlTail = '</body>\n</html>';
                this.htmlNodeDashboard.setHtml(htmlHead + html + htmlTail);
                var hideDiv = null;
                for (i = 0; i < jsonVar.action.result.length; i++) {
                    jsonRes = jsonVar.action.result[i];
                    vName = jsonRes.name;
                    hideDiv = dojo.byId('id_' + vName);
                    this.connect(hideDiv, "onclick", this, dojo.hitch(this, "thumbnailClick", vName + "__" + node));
                    this.connect(hideDiv, "onmouseover", this, dojo.hitch(this, "thumbnailOver", vName));
                    this.connect(hideDiv, "oncontextmenu", this, function(event) {
                        var vmInfos = this.varSelectedVm.getValue("dataValue");
                        var varLabel = "Label" + vmInfos;
                        this.varMousePosition.setValue("top", event.clientY);
                        this.varMousePosition.setValue("left", event.clientX);
                        dojo.stopEvent(event);
                        this.showVmPopupMenu(this[varLabel], node);
                    });
                }
            }

            this.javaSleep.input.setValue("func", "getVmScreenshots");
            this.javaSleep.input.setValue("sleep", 25000);
            this.javaSleep.update();
        } catch (e) {
            this.showToastError(this.name + "ERROR IN javaGetVmListScreenshotResult: " + e.toString());
            console.error('ERROR IN javaGetVmListScreenshotResult: ' + e);
        }
    },

    thumbnailClick: function(vmInfos) {
        this.loadingDialogDetachConsole.setShowing(true);
        this.startVnc(vmInfos);
    },
    thumbnailOver: function(vmInfos) {
        this.varSelectedVm.setValue("dataValue", vmInfos);
    },

    //////////////////////// Node performances /////////////////////////////////////
    TabServersPerformancesShow: function(inSender) {
        try {
            this.clearNodePerfReloadCounter();
            this.panelNodePerfomanceWarning.setShowing(false);
            this.panelDisplayNodePerformances.setShowing(false);
            this.getNodePerformances();
            this.loadingPerformanceTab.show();
            this._AutoReloadPerfData = true;

            this.btnSetNodePerformancesAutoReload.removeUserClass("wm_BackgroundChromeBar_LightGray");
            this.btnSetNodePerformancesAutoReload.addUserClass("wm_BackgroundChromeBar_Green");
            this.btnSetNodePerformancesAutoReload.hint = "Unset automatic data reload.";

        } catch (e) {
            this.showToastError(this.name + "ERROR IN TabServersPerfShow: " + e.toString());
            console.error('ERROR IN TabServersPerformancesShow: ' + e);
        }
    },
    getNodePerformances: function() {
        try {
            var node = this.varSelectedServer.getValue("dataValue");
            this.javaGetNodePerformances.input.setValue("node", node);
            this.javaGetNodePerformances.update();
        } catch (e) {
            this.showToastError(this.name + "ERROR IN getNodeformances: " + e.toString());
            console.error('ERROR IN getNodeformances: ' + e);
        }
    },
    javaGetNodePerformancesResult: function(inSender, inDeprecated) {
        try {
            this.btnReloadNodePerformances.setDisabled(false);
            var result = this.javaGetNodePerformances.getValue("dataValue");
            this.logDebugServer("javaGetNodePerformances: " + result);
            var perfConfig = JSON.parse(result).action.result;
            console.error("javaGetNodePerformancesResult: "+JSON.stringify(perfConfig.conf));
            
            if (perfConfig.error === "") {
                this.panelDisplayNodePerformances.setShowing(true);
                this.panelNodePerformancesTools.setDisabled(false);
                var clientId = this.varClientId.getValue("dataValue");
                var input = "id=" + clientId + "&conf=" + JSON.stringify(perfConfig.conf);
                var source = "resources/jarmon/monitor/index.html?" + input;
                var source_detached = "resources/jarmon/monitor/index_detach.html?" + input;
                if (source !== this.iFrameNodePerformances.source) {
                    this.iFrameNodePerformances.setSource(source);
                    this.labelNodePerformacesUri.setCaption(source_detached);
                } else {
                    this.iFrameNodePerformances.frame.contentWindow.reload_data();
                }
                // Automatically reload data every 60 seconds
                if (this.TabServersPerformances.isActive() && this._AutoReloadPerfData) {
                    this._nodePerfReloadTime = 0;
                    this.clearNodePerfReloadCounter();
                    setTimeout(function() {
                        try {
                            wm.Page.getPage("Main").incrementNodePerfReloadTime();
                        } catch (e) {
                            alert(e);
                        }
                    }, 500);
                }
            } else {
                this.panelNodePerfomanceWarning.setShowing(true);
                this.panelDisplayNodePerformances.setShowing(false);
                this.panelNodePerformancesTools.setDisabled(true);
                this.labelNodePerformancesWarning.setCaption(perfConfig.error);
            }
            if (this.loadingPerformanceTab.showing) {
                this.loadingPerformanceTab.hide();
            }

        } catch (e) {
            console.error('ERROR IN javaGetNodePerformancesResult: ' + e);
        }
    },
    incrementNodePerfReloadTime: function() {
        try {
            if (this.TabServersPerformances.isActive() && this._AutoReloadPerfData) {
                if (this._nodePerfReloadTime > -1) {
                    this._nodePerfReloadTime += 1;
                    if (this._nodePerfReloadTime === 116) {
                        this.getNodePerformances();
                    } else {
                        //this.showNodePerfReloadCounter(Math.floor(this._nodePerfReloadTime * 100 / 120));
                        this.showNodePerfReloadCounter(this._nodePerfReloadTime * 100 / 120);
                        setTimeout(function() {
                            try {
                                wm.Page.getPage("Main").incrementNodePerfReloadTime();
                            } catch (e) {
                                alert(e);
                            }
                        }, 500);
                    }
                }
            }
        } catch (e) {
            console.error('ERROR IN incrementNodePerfReloadTime: ' + e);
        }
    },
    btnReloadNodePerformancesClick: function(inSender) {
        try {
            this.btnReloadNodePerformances.setDisabled(true);
            this.getNodePerformances();
        } catch (e) {
            console.error('ERROR IN btnReloadNodePerformancesClick: ' + e);
        }
    },
    btnSetNodePerformancesAutoReloadClick: function(inSender) {
        try {
            this.clearNodePerfReloadCounter();
            this._nodePerfReloadTime = 0;
            this.btnSetNodePerformancesAutoReload.setDisabled(true);
            if (this._AutoReloadPerfData) {
                this._AutoReloadPerfData = false;
                this.btnSetNodePerformancesAutoReload.removeUserClass("wm_BackgroundChromeBar_Green");
                this.btnSetNodePerformancesAutoReload.addUserClass("wm_BackgroundChromeBar_LightGray");
                this.btnSetNodePerformancesAutoReload.hint = "Start automatic data reloading.";
            } else {
                this._AutoReloadPerfData = true;
                this.btnSetNodePerformancesAutoReload.removeUserClass("wm_BackgroundChromeBar_LightGray");
                this.btnSetNodePerformancesAutoReload.addUserClass("wm_BackgroundChromeBar_Green");
                this.btnSetNodePerformancesAutoReload.hint = "Stop automatic data reloading.";
                this.incrementNodePerfReloadTime();
            }
            setTimeout(function() {
                try {
                    wm.Page.getPage("Main").btnSetNodePerformancesAutoReload.setDisabled(false);
                } catch (e) {
                    alert(e);
                }
            }, 1000);

        } catch (e) {
            console.error('ERROR IN btnSetNodePerformancesAutoReloadClick: ' + e);
        }
    },
    showNodePerfReloadCounter: function(step, color) {
        try {
            if (color === undefined) {
                color = 'Aqua';
            }
            // SVG stuff
            //var bg = document.id('counter');
            var bg = dojo.byId("counter_node_perf");
            var ctx = bg.getContext('2d');
            var imd = null;
            var circ = Math.PI * 2;
            var quart = Math.PI / 2;

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineCap = 'square';
            ctx.closePath();
            ctx.fill();
            ctx.lineWidth = 3.0;
            imd = ctx.getImageData(0, 0, 32, 32);

            var draw = function(current) {
                ctx.putImageData(imd, 0, 0);
                ctx.beginPath();
                ctx.arc(16, 16, 8, -(quart), ((circ) * current) - quart, false);
                ctx.stroke();
            };
            draw(step / 100);
        } catch (e) {
            console.error('ERROR IN showNodePerfReloadCounter: ' + e);
        }
    },
    clearNodePerfReloadCounter: function() {
        try {
            var html = '<style type="text/css">';
            html += 'canvas {display: block;}';
            html += 'input {width: 28px;}';
            html += 'body {}</style>';
            html += '<canvas title="Remaining time before data reloading. " id="counter_node_perf" width="32" height="32"></canvas>';
            this.htmlNodePerfDataLoad.setHtml(html);
            this.showNodePerfReloadCounter(100, "FireBrick");
        } catch (e) {
            console.error('ERROR IN clearNodePerfReloadCounter: ' + e);
        }
    },
    btnDetachNodePerformancesClick: function(inSender) {
        try {
            this.btnDetachNodePerformances.setDisabled(true);
            var uri = this.labelNodePerformacesUri.caption;
            window.open(uri, "", 'scrollbars=yes,menubar=no,height=800,width=1000,resizable=yes,toolbar=no,location=no,status=no');
            setTimeout(function() {
                try {
                    wm.Page.getPage("Main").btnDetachNodePerformances.setDisabled(false);
                } catch (e) {
                    alert(e);
                }
            }, 1000);
        } catch (e) {
            console.error('ERROR IN btnDetachNodePerformancesClick: ' + e);
        }
    },
    /////////////////  Google Map /////////////////////////////////////////////////
    javaGetNodesCoordinatesResult: function(inSender, inDeprecated) {
        try {
            this.varGmap.clearData();
            var result = this.javaGetNodesCoordinates.getValue("dataValue");
            this.logDebugDataCenter("coordinates:" + result);
            if (result.indexOf("Error") === -1) {
                var jsonVar = JSON.parse(result);
                var count = jsonVar.list.length;
                var lat = "";
                var long = "";
                var node = "";
                var lastLat = "0";
                var lastLong = "0";
                var str = "";
                var test = -1;
                var coordinateList = [];
                var varDesc = "";
                var desc = "";
                var addr = "";
                for (var i = 0; i < count; i++) {
                    lat = jsonVar.list[i].latitude;
                    long = jsonVar.list[i].longitude;
                    node = jsonVar.list[i].node;
                    desc = jsonVar.list[i].desc;
                    if ((lat !== "") || (long !== "")) {
                        test = -1;
                        for (var j = 0; j < coordinateList.length; j++) {
                            str = lat + ":" + long;
                            if (coordinateList[j] === str) {
                                test = j;
                            }
                        }
                        if (test > -1) {
                            var dataTmp = this.varGmap.getItem(test);
                            desc = node + ": " + desc;
                            var oldNode = dataTmp.getValue("node");
                            var oldDesc = dataTmp.getValue("description");
                            dataTmp.setValue("node", oldNode + ", " + node);
                            dataTmp.setValue("description", oldDesc + "<div>" + desc + "</div>");
                            this.varGmap.setItem(test, dataTmp);

                        } else {
                            desc = "<div>" + node + ": " + desc + "</div>";
                            var newCoordinates = {
                                "node": node,
                                "address": "",
                                "lat": lat,
                                "long": long,
                                "description": desc
                            };
                            this.varGmap.addItem(newCoordinates);
                            coordinateList.push(lat + ":" + long);
                        }
                        lastLat = lat;
                        lastLong = long;

                    }
                }
                //this.googleMap.fitToMarkers();
/*
                this.googleMap.setLatitude(lastLat);
                this.googleMap.setLongitude(lastLong);
                if ((lastLat === "0") && (lastLong === "0")) {
                    this.googleMap.setZoom(2);
                } else {
                    this.googleMap.setZoom(9);
                }*/
            }

        } catch (e) {
            this.showToastError(this.name + "ERROR IN javaGetNodesCoordinatesResult: " + e.toString());
            console.error('ERROR IN javaGetNodesCoordinatesResult: ' + e);
        }
    },
    smallHeaderMenuProbeNodesClick: function(inSender, inEvent) {
        try {
            this.javaProbeNeighborhood.update();
            this.MenuDialogCenter.hide();
            this.varAvailableNodes.clearData();
            this.layersAvailableNodes.setLayer(this.layerWaitNodeList);
            this.listAvailableNodes.show();
            this.addSelectedNode.setDisabled(true);
        } catch (e) {
            this.showToastError(this.name + "ERROR IN labelCenterProbeClick: " + e.toString());
            console.error('ERROR IN smallHeaderMenuProbeNodesClick: ' + e);
        }
    },
    javaProbeNeighborhoodResult: function(inSender, inDeprecated) {
        try {
            this.layersAvailableNodes.setLayer(this.layerNodeList);
            var result = this.javaProbeNeighborhood.getValue("dataValue");
            this.logDebugDataCenter("Probe Neighborhood: " + result);
            var jsonVar = JSON.parse(result);
            var neighborhood = jsonVar.action.result;

            for (var i = 0; i < neighborhood.length; i++) {
                var name = neighborhood[i].name;
                var addr = neighborhood[i].ip;
                var info = neighborhood[i].info;
                var count = this.listAllServersLiveVar.getCount();
                var data = null;
                var unknown = true;
                for (var j = 0; j < count; j++) {
                    data = this.listAllServersLiveVar.getData()[j];
                    var varIP = data.name + "ip";
                    var ip = this[varIP].getValue("dataValue");
                    if ((name === data.name) || (addr === ip)) {
                        unknown = false;
                    }
                }
                if (unknown) {
                    this.varAvailableNodes.addItem({
                        "name": name,
                        "ip": addr,
                        "type": info
                    });
                }

            }

        } catch (e) {
            console.error('ERROR IN javaProbeNeighborhoodResult: ' + e);
            this.showToastError(this.name + "ERROR IN javaProbeNeighborhoodResult: " + e.toString());
        }
    },

    gridAvailableNodesCellDblClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        try {
            this.addSelectedNodeClick(inSender);

        } catch (e) {
            console.error('ERROR IN gridAvailableNodesCellDblClick: ' + e);
        }
    },
    addSelectedNodeClick: function(inSender) {
        try {
            var data = this.gridAvailableNodes.getRow(this.gridAvailableNodes.getSelectedIndex());
            this.tableserversDialog.setTitle("Add Discovered Node");
            this.tableserversLivePanel1.popupLivePanelInsert();
            this.nameEditor.setDisplayValue(data.name);
            this.ipEditor.setDisplayValue(data.ip);
            this.selectHypervisor.setDataValue(data.type);
            if (data.type !== "") {
                this.selectHypervisor.setReadonly(true);
            } else {
                this.selectHypervisor.setReadonly(false);
            }
            this.descEditor.setDataValue("");
            //this.tableserversDialog.show();
        } catch (e) {
            console.error('ERROR IN addSelectedNodeClick: ' + e);
            this.showToastError(this.name + "ERROR IN addSelectedNodeClick: " + e.toString());
        }
    },

    gridAvailableNodesClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        try {
            this.addSelectedNode.setDisabled(false);

        } catch (e) {
            console.error('ERROR IN gridAvailableNodesClick: ' + e);
        }
    },


    /////////////////////// START VM SNAPSHOTS MANAGEMENT ///////////////////////////
    TabVmSnapshotsShow: function(inSender) {
        try {
            var vmInfos = this.varSelectedVm.getValue("dataValue");
            var dic = vmInfos.split("__");
            var vName = dic[0];
            var node = dic[1];
            var locked = this.vmIsLocked(vmInfos);
            if (locked) {
                //var lock = this.getVmLock(vName);
                this.loadingSnapshots.setShowing(true);
            } else {
                this.loadingSnapshots.setShowing(false);
                this.getVmStoragesInfo();
                var count = this.varVmDiskList.getCount();
                var tmpstr = "";
                var supported = true;
                for (var i = 0; i < count; i++) {
                    this.logDebugVM("disk :" + this.varVmDiskList[i]);
                    var icon = this.varVmDiskList.getItem(i).getValue("icon");
                    if (icon.indexOf("harddisk") > -1) {
                        var format = this.varVmDiskList.getItem(i).getValue("format");
                        var name = this.varVmDiskList.getItem(i).getValue("name");
                        //diskcount += 1;
                        if (format !== "qcow2") {
                            supported = false;
                        }
                    }
                }
                if (supported) {
                    this.pictureSnapWarning.setShowing(false);
                    this.panelSnapIcons.addUserClass("wm_BackgroundChromeBar_LightGray");
                    this.panelSnapIcons.removeUserClass("wm_BackgroundColor_LightGray");
                    this.panelSnapMain.removeUserClass("wm_BackgroundColor_LightGray");
                    this.panelSnapMain.setDisabled(false);
                    //var varServer = vName + "Server";
                    //var node =  this[varServer].getValue("dataValue");
                    this.javaSnapshotsGetList.input.setValue("server", node);
                    this.javaSnapshotsGetList.input.setValue("vmName", vName);
                    this.javaSnapshotsGetList.update();
                } else {
                    this.snapshotsTree.setData();
                    this.SnapshotsTitle.setCaption("<b>The domain does not support snapshots</b>");
                    this.panelSnapMain.setDisabled(true);
                    this.panelSnapIcons.removeUserClass("wm_BackgroundChromeBar_LightGray");
                    this.panelSnapIcons.addUserClass("wm_BackgroundColor_LightGray");
                    this.panelSnapMain.addUserClass("wm_BackgroundColor_LightGray");
                    this.pictureSnapWarning.setShowing(true);
                }
            }

        } catch (e) {
            this.showToastError(this.name + "ERROR IN TabVmSnapshotsShow: " + e.toString());
            console.error('ERROR IN TabVmSnapshotsShow: ' + e);
        }
    },
    javaSnapshotsGetListResult: function(inSender, inDeprecated) {
        try {
            this.loadingSnapshots.setShowing(false);
            var serviceName = inSender.name.toString();
            var result = this[serviceName].getValue("dataValue");
            var jsonVar = JSON.parse(result);
            var snapshotList = jsonVar.action.result.list;
            this.varSnapshotList.clearData();

            if (result.indexOf('Virtual machine is locked') > -1) {
                this.SnapshotsTitle.setCaption("The virtual machine is currently locked");
                this.panelSnapshotsManagement.setDisabled(true);
            } else if ((jsonVar.action.result === "Failed") || (Object.keys(snapshotList).length === 0)) {
                this.SnapshotsTitle.setCaption("The domain does not have any snapshots");
                this.snapshotsTree.setData();
                this.buttonMergeToDescSnapshot.setDisabled(true);
                this.buttonDeleteSnapshot.setDisabled(true);
                this.buttonRollbackSnapshot.setDisabled(true);
                this.buttonRevertSnapshot.setDisabled(true);
            } else {
                this.panelSnapshotsManagement.setDisabled(false);
                var current = jsonVar.action.result.current;
                if (current.indexOf("Error:") > -1) {
                    current = "none";
                }
                var reg0 = new RegExp(':', 'i');

                var infos = "";
                var test = "";

                this.snapshotsTree.setData(snapshotList);
                this.SnapshotsTitle.setCaption('Snapshot currently in use: <b>' + current + '</b>');

                var selected = false;
                var snapNameList = [];
                this.snapshotsTree.forEachNode(function(inNode) {
                    if ((inNode.content.indexOf("children") < 0) && (inNode.content.indexOf(":") < 0)) {
                        snapNameList.push(inNode.content);
                    }

                    if (inNode.hasChildren === true) {
                        inNode.setOpen(true);
                        if (inNode.content === current) {
                            str = '<b><u>' + inNode.content + '</u></b>';
                            inNode.setContent(str);
                            node = inNode;
                            selected = true;
                        }
                        if (inNode.content.indexOf("children") > -1) {
                            inNode.setContent('<font color = "SteelBlue">children</font>');
                            inNode.canSelect = false;
                        }

                    } else /*if (inNode !== curInode)*/
                    {
                        infos = inNode.content;
                        line = infos.replace(reg0, ":::");
                        test += line;
                        args = line.split(":::");
                        head = '<font color = "SteelBlue">' + args[0] + '</font>';
                        body = "";
                        if ((args[0].indexOf("description") > -1) && (args[1].indexOf("\n") > -1)) {
                            descLines = args[1].split("\n");
                            body = '<font color="838888">' + descLines[0] + '</font>';
                            for (var i = 1; i < descLines.length; i++) {
                                body += '<br/><font color="838888" style="margin-left: 74px;">' + descLines[i] + '</font>';
                            }

                        } else {
                            body = '<font color = "838888">' + args[1] + '</font>';
                        }
                        inNode.setContent(head + ":" + body);
                        inNode.disabled = true;
                        inNode.canSelect = false;
                        if (inNode.content.indexOf("children") > -1) {
                            inNode.destroy();
                        }
                    }
                });

                if (selected === true) {
                    this.snapshotsTree.select(node);
                }

                for (var i = 0; i < snapNameList.length; i++) {
                    this.varSnapshotList.addItem({
                        "name": snapNameList[i],
                        "dataValue": snapNameList[i]
                    });
                }

            }

        } catch (e) {
            this.showToastError(this.name + "ERROR IN javaSnapshotsGetListResult: " + e.toString());
            console.error('ERROR IN javaSnapshotsGetListResult: ' + e);
        }
    },
    snapshotsTreeSelect: function(inSender, inNode, inData) {
        try {
            var reg0 = new RegExp('<.>', 'gi');
            var reg1 = new RegExp('</.>', 'gi');
            var tmp = inNode.content.replace(reg0, "");
            var snapshot = tmp.replace(reg1, "");
            this.varSelectedSnapshot.setValue("dataValue", snapshot);
            var parentName = inNode.parent.parent.content;

            var result = this.javaSnapshotsGetList.getValue("dataValue");
            var jsonVar = JSON.parse(result);
            var current = '<b><u>' + jsonVar.action.result.current + '</u></b>';

            if (parentName === "") {
                parentName = this.varSelectedVm.getValue("dataValue").split("__")[0];
            }
            this.varSelectedSnapshotParent.setValue("dataValue", parentName);

            this.connect(inNode.domNode, "oncontextmenu", this, function(event) {
                this.varMousePosition.setValue("top", event.clientY);
                this.varMousePosition.setValue("left", event.clientX);
                dojo.stopEvent(event);
                this.showSnapshotPopupMenu(inNode);
            });

            var hasChildren = false;
            var hasCurrent = false;
            inNode.forEachDescendant(function(descNode) {
                if (descNode.content === current) {
                    hasCurrent = true;
                }
                if ((descNode.content.indexOf("children")) && (descNode.hasChildren === true)) {
                    hasChildren = true;
                    return 0;
                }
            });
            this.panelPopupCreateSnapshot.setShowing(true);
            this.panelPopupCreateSnapshot.setBorder("0,0,1,0");
            this.panelPopupMergeToDescendantSnapshot.setShowing(true);
            this.panelPopupRevertSnapshot.setShowing(true);
            this.panelPopupDeleteSnapshot.setShowing(true);
            this.panelPopupRollbackSnapshot.setShowing(true);
            this.snapshotPopup.setHeight("192px");
            this.panelPopupDiscardBranch.setShowing(false);
            this.buttonMergeToDescSnapshot.setDisabled(false);
            this.buttonDeleteSnapshot.setDisabled(false);
            this.buttonRollbackSnapshot.setDisabled(false);
            this.buttonRevertSnapshot.setDisabled(false);
            this.buttonNewSnapshot.setDisabled(false);


            if (inNode.content === current) {
                hasCurrent = true;
                if (hasChildren === false) {
                    this.panelPopupMergeToDescendantSnapshot.setShowing(false);
                    this.buttonMergeToDescSnapshot.setDisabled(true);
                    this.snapshotPopup.setHeight("158px");
                } else {
                    this.labelSnapshotMergeToDescendant.setCaption("Merge with children");
                    this.buttonMergeToDescSnapshot.setHint("Merge with children");
                }
                this.labelSnapshotRevert.setCaption("Reset snapshot");
                this.buttonRevertSnapshot.setHint("Reset snapshot");

            } else {
                this.panelPopupCreateSnapshot.setShowing(false);
                this.buttonNewSnapshot.setDisabled(true);
                this.buttonRollbackSnapshot.setDisabled(true);
                this.buttonDeleteSnapshot.setDisabled(true);
                this.panelPopupRollbackSnapshot.setShowing(false);
                this.panelPopupDeleteSnapshot.setShowing(false);
                //this.snapshotPopup.setHeight("124px");
                this.snapshotPopup.setHeight("90px");
                this.labelSnapshotRevert.setCaption("Go To");
                this.buttonRevertSnapshot.setHint("Go to snapshot");
                this.labelSnapshotMergeToDescendant.setCaption("Discard");
                this.buttonMergeToDescSnapshot.setHint("Discard snapshot");
            }
            if ((!hasCurrent) && (hasChildren)) {
                this.buttonDiscardAll.setShowing(true);
                this.panelPopupDiscardBranch.setShowing(true);
                this.snapshotPopup.setHeight("124px");
            } else {
                this.buttonDiscardAll.setShowing(false);
            }



        } catch (e) {
            this.showToastError(this.name + "ERROR IN snapshotsTreeSelect: " + e.toString());
            console.error('ERROR IN snapshotsTreeSelect: ' + e);
        }
    },

    showSnapshotPopupMenu: function(inNode) {
        try {
            //var vmName = this.varSelectedVm.getValue("dataValue").split("__")[0];
            if (inNode.isSelected() === true) {
                this.snapshotPopup.fixPositionNode = inNode.domNode;
                var top = this.varMousePosition.getValue("top");
                var left = this.varMousePosition.getValue("left");
                this.snapshotPopup.show();
                this.setMenuPosition(this.snapshotPopup, top, left);
                //this.snapshotPopup.domNode.style.top = event.clientY+"px";
                //this.snapshotPopup.domNode.style.left = event.clientX+"px";
            }
        } catch (e) {
            this.showToastError(this.name + "ERROR IN showSnapshotPopupMenu: " + e.toString());
            console.error('ERROR IN snapshotsTreeSelect: ' + e);
        }
    },
    labelSnapshotCreateClick: function(inSender, inEvent) {
        try {
            this.snapshotPopup.hide();
            this.snapshotNameText.setDataValue("");
            this.snapshotDescArea.setDataValue("");
            this.newSnapshotDialog.show();
        } catch (e) {
            console.error('ERROR IN labelSnapshotCreateClick: ' + e);
        }
    },
    buttonNewSnapshotClick: function(inSender) {
        try {
            this.snapshotNameText.setDataValue("");
            this.snapshotDescArea.setDataValue("");
            this.newSnapshotDialog.show();
        } catch (e) {
            console.error('ERROR IN buttonNewSnapshotClick: ' + e);
        }
    },
    btnCreateSnashotClick: function(inSender) {
        try {
            var name = this.snapshotNameText.getDisplayValue();
            var count = this.varSnapshotList.getCount();
            var testOk = true;
            for (var i = 0; i < count; i++) {
                var tmpName = this.varSnapshotList.getItem(i).getValue("dataValue");
                if (name === tmpName) {
                    app.toastDialog.showToast("Please select a new snapshot name.", 5000, "Warning", "cc", name + " is already defined");
                    testOk = false;
                }
            }
            var desc = this.snapshotDescArea.getDataValue();
            var myRegxp = new RegExp('^([a-zA-Z0-9\n: .,?!;_+-]+)$', 'gi');
            if (myRegxp.test(desc) === false) {
                var errTitle = "Invalid snapshot description";
                var errMsg = "There is an illegal character in the snapshot descrition.";
                app.toastDialog.showToast(errMsg, 5000, "Warning", "cc", errTitle);
                testOk = false;
            }
            
            if (testOk) {
                this.loadingSnapshots.setShowing(true);
                if (desc === "") {
                    desc = " ";
                }
                var xml = "<domainsnapshot><description>" + desc + "</description><name>" + name + "</name></domainsnapshot>";

                var vmInfos = this.varSelectedVm.getValue("dataValue");
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];
                //var varServer = vName + "Server";
                //var node = this[varServer].getValue("dataValue");
                this.javaSnapshotCreate.input.setValue("server", node);
                this.javaSnapshotCreate.input.setValue("vmName", vName);
                this.javaSnapshotCreate.input.setValue("xml", xml);
                this.javaSnapshotCreate.update();
                this.newSnapshotDialog.hide();
                this.addLog("Create snapshot", vName, node, 0);
                dojo.cookie("openkvi_vm_snapshot_" + vName + ":::" + node, "Create snapshot", {
                    expires: 1
                });
            }

        } catch (e) {
            this.showToastError(this.name + "ERROR IN btnCreateSnashotClick: " + e.toString());
            console.error('ERROR IN btnCreateSnashotClick: ' + e);
        }
    },

    labelSnapshotRevertClick: function(inSender, inEvent) {
        try {
            this.snapshotPopup.hide();
            this.revertConfirm();
        } catch (e) {
            console.error('ERROR IN labelSnapshotRevertClick: ' + e);
        }
    },
    buttonRevertSnapshotClick: function(inSender) {
        try {
            this.revertConfirm();

        } catch (e) {
            console.error('ERROR IN buttonRevertSnapshotClick: ' + e);
        }
    },
    revertConfirm: function() {
        try {
            var snapshot = this.varSelectedSnapshot.getValue("dataValue");
            this.showConfirmDialog("This will reset data to <b>" + snapshot + "</b> initial state.", "snapshotRevert", true);

        } catch (e) {
            console.error('ERROR IN labelSnapshotRevertClick: ' + e);
        }
    },
    snapshotRevert: function(validated) {
        try {
            if (validated === true) {
                this.loadingSnapshots.setShowing(true);
                var snapshot = this.varSelectedSnapshot.getValue("dataValue");
                var vmInfos = this.varSelectedVm.getValue("dataValue");
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];
                //var varServer = vName + "Server";
                //var node = this[varServer].getValue("dataValue");
                this.javaSnapshotsRevert.input.setValue("server", node);
                this.javaSnapshotsRevert.input.setValue("vmName", vName);
                this.javaSnapshotsRevert.input.setValue("snapshot", snapshot);
                this.javaSnapshotsRevert.update();
                this.addLog("Go to snapshot", vName, node, 0);
                dojo.cookie("openkvi_vm_snapshot_" + vName + ":::" + node, "Go to snapshot");
            }
        } catch (e) {
            console.error('ERROR IN labelSnapshotRevertClick: ' + e);
        }
    },
    labelSnapshotRollbackClick: function(inSender, inEvent) {
        try {
            this.snapshotPopup.hide();
            this.rollbackConfirm();
        } catch (e) {
            console.error('ERROR IN labelSnapshotRollbackClick: ' + e);
        }
    },
    buttonRollbackSnapshotClick: function(inSender) {
        try {
            this.rollbackConfirm();

        } catch (e) {
            console.error('ERROR IN buttonRollbackSnapshotClick: ' + e);
        }
    },
    rollbackConfirm: function() {
        try {
            var snapshot = this.varSelectedSnapshot.getValue("dataValue");
            this.showConfirmDialog("This will rollback <b>" + snapshot + "</b>.</br>Any modification will be lost and the snapshot will be deleted.", "snapshotRollback", true);

        } catch (e) {
            console.error('ERROR IN labelSnapshotRevertClick: ' + e);
        }
    },
    snapshotRollback: function(validated) {
        try {
            if (validated === true) {
                this.loadingSnapshots.setShowing(true);
                var snapshot = this.varSelectedSnapshot.getValue("dataValue");
                var vmInfos = this.varSelectedVm.getValue("dataValue");
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];
                //var varServer = vName + "Server";
                //var node = this[varServer].getValue("dataValue");
                this.javaSnapshotsRollback.input.setValue("server", node);
                this.javaSnapshotsRollback.input.setValue("vmName", vName);
                this.javaSnapshotsRollback.input.setValue("snapshot", snapshot);
                this.javaSnapshotsRollback.update();
                this.addLog("Rollback snapshot", vName, node, 0);
                dojo.cookie("openkvi_vm_snapshot_" + vName + ":::" + node, "Rollback snapshot");
            }
        } catch (e) {
            console.error('ERROR IN snapshotRollback: ' + e);
        }
    },
    labelSnapshotMergeAllClick: function(inSender, inEvent) {
        try {
            this.snapshotPopup.hide();
            this.mergeToParentConfirm();
        } catch (e) {
            console.error('ERROR IN labelSnapshotMergeAllClick: ' + e);
        }
    },
    buttonDeleteSnapshotClick: function(inSender) {
        try {
            this.mergeToParentConfirm();
        } catch (e) {
            console.error('ERROR IN buttonDeleteSnapshotClick: ' + e);
        }
    },
    mergeToParentConfirm: function() {
        try {
            var parentName = this.varSelectedSnapshotParent.getValue("dataValue");
            if (parentName === undefined) {
                parentName = "ROOT";
            }
            var snapshot = this.varSelectedSnapshot.getValue("dataValue");
            this.showConfirmDialog("<B>" + snapshot + "</B> and its descendants will be merged to <B>" + parentName + "</B> and then deleted.", "SnapshotMergeToParent", true);
        } catch (e) {
            console.error('ERROR IN mergeAllConfirm: ' + e);
        }
    },
    SnapshotMergeToParent: function(validated) {
        try {
            if (validated === true) {
                this.loadingSnapshots.setShowing(true);
                var snapshot = this.varSelectedSnapshot.getValue("dataValue");
                var vmInfos = this.varSelectedVm.getValue("dataValue");
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];
                //var varServer = vName + "Server";
                //var node = this[varServer].getValue("dataValue");
                this.javaSnapshotsMergeToParent.input.setValue("server", node);
                this.javaSnapshotsMergeToParent.input.setValue("vmName", vName);
                this.javaSnapshotsMergeToParent.input.setValue("snapshot", snapshot);
                this.javaSnapshotsMergeToParent.update();
                this.addLog("Merge snapshot with parent", vName, node, 0);
                dojo.cookie("openkvi_vm_snapshot_" + vName + ":::" + node, "Merge snapshot with parent");
            }
        } catch (e) {
            console.error('ERROR IN labelSnapshotMergeAllClick: ' + e);
        }
    },

    labelSnapshotMergeToDescendantClick: function(inSender, inEvent) {
        try {
            this.snapshotPopup.hide();
            this.mergeToDescConfirm();
        } catch (e) {
            console.error('ERROR IN labelSnapshotMergeToDescendantClick: ' + e);
        }
    },
    buttonMergeToDescSnapshotClick: function(inSender) {
        try {
            this.mergeToDescConfirm();

        } catch (e) {
            console.error('ERROR IN buttonMergeToDescSnapshotClick: ' + e);
        }
    },
    mergeToDescConfirm: function() {
        try {
            var snapshot = this.varSelectedSnapshot.getValue("dataValue");
            if (this.labelSnapshotMergeToDescendant.caption === "Discard") {
                this.showConfirmDialog("<B>" + snapshot + "</B> will be discarded.", "snapshotMergeToDescendant", true);
            } else {
                this.showConfirmDialog("<B>" + snapshot + "</B> will be deleted and changes merged into descendant snapshots.", "snapshotMergeToDescendant", true);
            }
        } catch (e) {
            console.error('ERROR IN labelSnapshotMergeToDescendantClick: ' + e);
        }
    },
    snapshotMergeToDescendant: function(validated) {
        try {
            if (validated === true) {
                this.loadingSnapshots.setShowing(true);
                var snapshot = this.varSelectedSnapshot.getValue("dataValue");
                var vmInfos = this.varSelectedVm.getValue("dataValue");
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];
                //var varServer = vName + "Server";
                //var node = this[varServer].getValue("dataValue");
                this.javaSnapshotsMergeToChildren.input.setValue("server", node);
                this.javaSnapshotsMergeToChildren.input.setValue("vmName", vName);
                this.javaSnapshotsMergeToChildren.input.setValue("snapshot", snapshot);
                this.javaSnapshotsMergeToChildren.update();
                this.addLog("Discard snapshot", vName, node, 0);
                dojo.cookie("openkvi_vm_snapshot_" + vName + ":::" + node, "Discard snapshot");
            }
        } catch (e) {
            console.error('ERROR IN labelSnapshotMergeToDescendantClick: ' + e);
        }
    },
    buttonDiscardAllClick: function(inSender) {
        try {
            this.discardAllConfirm();

        } catch (e) {
            console.error('ERROR IN buttonDiscardAllClick: ' + e);
        }
    },
    discardAllConfirm: function() {
        try {
            var snapshot = this.varSelectedSnapshot.getValue("dataValue");
            this.showConfirmDialog("<B>" + snapshot + "</B> and the rest of the branch will be discarded.", "snapshotDiscardAll", true);
        } catch (e) {
            console.error('ERROR IN labelSnapshotMergeToDescendantClick: ' + e);
        }
    },
    snapshotDiscardAll: function(validated) {
        try {
            if (validated === true) {
                this.loadingSnapshots.setShowing(true);
                var snapshot = this.varSelectedSnapshot.getValue("dataValue");
                var vmInfos = this.varSelectedVm.getValue("dataValue");
                var dic = vmInfos.split("__");
                var vName = dic[0];
                var node = dic[1];
                //var varServer = vName + "Server";
                //var node = this[varServer].getValue("dataValue");
                this.javaSnapshotsDiscardAll.input.setValue("server", node);
                this.javaSnapshotsDiscardAll.input.setValue("vmName", vName);
                this.javaSnapshotsDiscardAll.input.setValue("snapshot", snapshot);
                this.javaSnapshotsDiscardAll.update();
                this.addLog("Discard snapshot and its children", vName, node, 0);
                dojo.cookie("openkvi_vm_snapshot_" + vName + ":::" + node, "Discard snapshot and its children");
            }
        } catch (e) {
            console.error('ERROR IN labelSnapshotMergeAllClick: ' + e);
        }
    },
    snapshotResult: function(node, vm, task, status, detail, sender) {
        try {
            this.javaGetVmStatus.input.setValue("node", node);
            this.javaGetVmStatus.input.setValue("vName", vm);
            this.javaGetVmStatus.update();

            var final_status = status + ": " + detail;
            this.updateLog(task, vm, node, final_status, sender);
            var selectedVm = this.varSelectedVm.getValue("dataValue").split("__")[0];
            if ((vm === selectedVm) && (this.TabVmSnapshots.isActive() === true)) {
                this.TabVmSnapshotsShow();
            }

            var snap_cookie = dojo.cookie("openkvi_vm_snapshot_" + vm + ":::" + node);
            if (snap_cookie === task) {
                dojo.cookie("openkvi_vm_snapshot_" + vm + ":::" + node, "", {
                    expires: 0.00001
                });
                if ((vm !== selectedVm) || (this.TabVmSnapshots.isActive() === false)) {
                    if (status.indexOf("Failed") > -1) {
                        app.toastDialog.showToast(detail, 5000, "Warning", "cc", task + " of " + vm);
                    } else {
                        app.toastDialog.showToast(detail, 5000, "Success", "cc", task + " of " + vm);
                    }
                }
            }
        } catch (e) {
            this.showToastError(this.name + "ERROR IN snapshotResult: " + e.toString());
            console.error('ERROR IN snapshotResult: ' + e);
        }
    },

    /////////////////////// END VM SNAPSHOTS MANAGEMENT /////////////////////////////
    // Clock widget ///
    ntpConfigurationDialogShow: function(inSender) {
        try {

            this.labelClockOffset.setCaption("empty");
            this.labelDate.setCaption("");

            var timeConfig = JSON.parse(this.javaGetNodeTimeConfiguration.getValue("dataValue")).action.result;
            var offset = '+1';
            var jsonDate = timeConfig.time.split(" ");
            var jsonTime = jsonDate[3].split(':');
            var month = parseInt(jsonDate[1], 10) - 1;
            var timezone = timeConfig.timezone.replace(/"/g, '');
            //var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);
            var nodeDate = new Date(jsonDate[0], month.toString(), jsonDate[2], jsonTime[0], jsonTime[1], jsonTime[2], 0);
            var refDate = new Date();
            var diffDate = nodeDate - refDate;
            var diffInt = -(refDate.getTimezoneOffset() / 60) - ((refDate - nodeDate) / 3600000);
            offset = diffInt.toString();

            var shortDate = timeConfig.date.split(" - ");
            this.labelDate.setCaption(shortDate[0]);

            this.ntpCalendar.setDate(nodeDate);
            this.editTimeHour.setDataValue(jsonTime[0]);
            this.editTimeMinutes.setDataValue(jsonTime[1]);
            if ((timeConfig.ntpd === "stopped") || (timeConfig.ntpd_autostart !== "on")) {
                this.checkActivateNtp.setChecked(false);
            } else {
                this.checkActivateNtp.setChecked(true);
            }
            this.selectNtpServer.setDisplayValue(timeConfig.servers[0]);

            this.labelTimezone.setCaption(timezone);
            this.labelClockOffset.setCaption(offset);
            if (this.coolClock === undefined) {
                //this.htmlClock.setHtml('<canvas id="clk1" class="CoolClock:swissRail:85::' + offset + '"></canvas>');
                this.htmlClock.setHtml('<canvas id="clk1" class="CoolClock:classic:85::' + offset + '"></canvas>');
                this.coolClock = CoolClock.findAndCreateClocks();
            } else {
                this.coolClock.setOffset(offset);
            }

        } catch (e) {
            console.error('ERROR IN ntpConfigurationDialogShow: ' + e);
            this.showToastError(this.name + "ERROR IN ntpConfigurationDialogShow: " + e.toString());
        }
    },

    editTimeHourChange: function(inSender) {
        try {
            this.updateClock();
        } catch (e) {
            console.error('ERROR IN editTimeHourChange: ' + e);
            this.showToastError(this.name + "ERROR IN editTimeHourChange: " + e.toString());
        }
    },
    editTimeMinutesChange: function(inSender) {
        try {
            this.updateClock();

        } catch (e) {
            console.error('ERROR IN editTimeMinutesChange: ' + e);
        }
    },
    updateClock: function() {
        try {
            if (this.labelClockOffset.caption !== "empty") {
                var hours = parseInt(this.editTimeHour.getDisplayValue(), 10);
                var minutes = parseInt(this.editTimeMinutes.getDisplayValue(), 10);

                var timeConfig = JSON.parse(this.javaGetNodeTimeConfiguration.getValue("dataValue")).action.result;
                var offset = '+1';
                jsonDate = timeConfig.time.split(" ");
                jsonTime = jsonDate[3].split(':');
                var month = parseInt(jsonDate[1], 10) - 1;
                var nodeDate = new Date(jsonDate[0], month.toString(), jsonDate[2], hours, minutes, 0, 0);
                var refDate = new Date();
                var diffInt = -(refDate.getTimezoneOffset() / 60) - ((refDate - nodeDate) / 3600000);
                offset = diffInt.toString();
                this.coolClock.setOffset(offset);
            }
        } catch (e) {
            console.error('ERROR IN updateClock: ' + e);
            this.showToastError(this.name + "ERROR IN updateClock: " + e.toString());
        }
    },

    toggleTimezonesClick: function(inSender) {
        try {
            if (this.timezonesDialog.showing === false) {
                this.timezonesDialog.show();
                this.toggleTimezones.addUserClass("wm_BackgroundColor_Graphite");
                this.toggleTimezones.setIconUrl("resources/images/icons/arrow-hide.png");
            } else {
                this.timezonesDialog.hide();
                this.toggleTimezones.removeUserClass("wm_BackgroundColor_Graphite");
                this.toggleTimezones.setIconUrl("resources/images/icons/arrow-show.png");
                //this.toggleTimezones.addUserClass("wm_BackgroundChromeBar_LightGray");
            }
        } catch (e) {
            console.error('ERROR IN toggleTimezonesClick: ' + e);
        }
    },
    closeTimezoneDialog: function(inSender) {
        try {
            if (this.timezonesDialog.showing === true) {
                this.timezonesDialog.hide();
                this.toggleTimezones.removeUserClass("wm_BackgroundColor_Graphite");
                this.toggleTimezones.setIconUrl("resources/images/icons/arrow-show.png");
                //this.toggleTimezones.addUserClass("wm_BackgroundChromeBar_LightGray");
            }
        } catch (e) {
            console.error('ERROR IN closeTimezoneDialog: ' + e);
        }
    },

    timezonesDialogShow: function(inSender) {
        try {
            var zones = this.labelTimezone.caption.split("/");
            var zone = this.labelTimezone.caption;
            switch (zones.length) {
            case 2:
                zone = zones[1];
                break;
            case 3:
                zone = zones[2];
                break;
            }
            this.timeZoneTree.forEachNode(function(inNode) {
                try {
                    switch (zones.length) {
                    case 2:
                        if (inNode.content === zones[0]) {
                            inNode.setOpen(true);
                        } else if ((inNode.hasChildren === true) && (inNode.content !== "")) {
                            inNode.setOpen(false);
                        }
                        break;
                    case 3:
                        if ((inNode.content === zones[0]) || (inNode.content === zones[1])) {
                            inNode.setOpen(true);
                        } else if ((inNode.hasChildren === true) && (inNode.content !== "")) {
                            inNode.setOpen(false);
                        }
                        break;
                    }

                    if (inNode.content === zone) {
                        wm.Page.getPage("Main").timeZoneTree.select(inNode);
                        selectedNode = inNode;

                    }
                } catch (err) {
                    wm.Page.getPage("Main").showToastError("ERROR IN timeZoneTree: " + err.toString());
                }
            });
            this.timeZoneTree.domNode.scrollTop = 0;
            if (selectedNode !== undefined) {
                var nodePos = dojo.position(selectedNode.domNode, false).y;
                var top = this.timezonesDialog.domNode.style.top.replace(/px/, "");
                var newPos = nodePos - top - 50;
                if (newPos < 0) {
                    newPos = 0;
                }
                this.timeZoneTree.domNode.scrollTop = newPos;
            }
        } catch (e) {
            console.error('ERROR IN timezonesDialogShow: ' + e);
            this.showToastError(this.name + "ERROR IN timezonesDialogShow: " + e.toString());
        }
    },
    timeZoneTreeDblclick: function(inSender, inNode) {
        try {
            var timezone = inNode.content;
            var tmpNode = inNode;
            while (inNode.parent.content !== "") {
                tmpNode = inNode.parent;
                inNode = tmpNode;
                timezone = inNode.content + "/" + timezone;
            }
            this.labelTimezone.setCaption(timezone);
            this.toggleTimezonesClick(inSender);
        } catch (e) {
            console.error('ERROR IN timeZoneTreeDblclick: ' + e);
            this.showToastError("ERROR IN timeZoneTreeDblclick: " + e.toString());
        }
    },
    btnNtpValidateClick: function(inSender) {
        try {
            var ntp_server = "";
            var date = "";
            var timezone = "";
            var time = "";
            var timeConfig = JSON.parse(this.javaGetNodeTimeConfiguration.getValue("dataValue")).action.result;
            var jsonDate = timeConfig.time.split(" ");
            var jsonTime = jsonDate[3].split(':');
            var month = parseInt(jsonDate[1], 10) - 1;
            var nodeDate = new Date(jsonDate[0], month.toString(), jsonDate[2], jsonTime[0], jsonTime[1], jsonTime[2], 0);

            if (this.labelTimezone.caption !== timeConfig.timezone.replace(/"/g, '')) {
                timezone = this.labelTimezone.caption;
            }

            if ((this.editTimeHour.getDisplayValue() !== jsonTime[0]) || (this.editTimeMinutes.getDisplayValue() !== jsonTime[1])) {
                time = this.editTimeHour.getDataValue() + ":" + this.editTimeMinutes.getDataValue() + ":00";
            }

            var shortDate = timeConfig.date.split(" - ");
            if (this.labelDate.caption !== shortDate[0]) {
                date = this.labelDate.caption;
                if (time === "") {
                    time = jsonDate[3];
                }
            }

            if (this.checkActivateNtp.getChecked()) {
                ntp_server = this.selectNtpServer.getDisplayValue();
            }

            var data = {
                "ntp": this.checkActivateNtp.getChecked(),
                "ntp_server": ntp_server,
                "date": date,
                "timezone": timezone,
                "time": time
            };

            var node = this.varSelectedServer.getValue("dataValue");
            this.javaSetNodeTimeConfiguration.input.setValue('node', node);
            this.javaSetNodeTimeConfiguration.input.setValue('data', JSON.stringify(data));
            this.javaSetNodeTimeConfiguration.update();
            this.ntpConfigurationDialog.hide();
            this.loadingNodeTimeConfig.show();

        } catch (e) {
            console.error('ERROR IN btnNtpValidateClick: ' + e);
            this.showToastError("ERROR IN btnNtpValidateClick: " + e.toString());
        }
    },
    ntpCalendarValueSelected: function(inSender, inDate) {
        try {
            var timeConfig = JSON.parse(this.javaGetNodeTimeConfiguration.getValue("dataValue")).action.result;
            var shortDate = timeConfig.date.split(" - ");
            var data = inDate.toString().split(" ");
            var newDate = data[0] + " " + data[2] + " " + data[1] + " " + data[3];
            this.labelDate.setCaption(newDate);

            if (newDate === shortDate[0]) {
                this.labelDate.removeUserClass("wm_TextDecoration_Bold");
            } else {
                this.labelDate.addUserClass("wm_TextDecoration_Bold");
            }


        } catch (e) {
            console.error('ERROR IN ntpCalendarValueSelected: ' + e);
            this.showToastError("ERROR IN ntpCalendarValueSelected: " + e.toString());
        }
    },
    javaSetNodeTimeConfigurationResult: function(inSender, inDeprecated) {
        try {
            var node = this.varSelectedServer.getValue("dataValue");
            this.javaGetNodeTimeConfiguration.input.setValue("node", node);
            this.javaGetNodeTimeConfiguration.update();


        } catch (e) {
            console.error('ERROR IN javaSetNodeTimeConfigurationResult: ' + e);
        }
    },
    btnAddNtpServerClick: function(inSender) {
        try {
            this.labelNtpServerConfig.setCaption("Enter a new NTP server name or IP:");
            this.textNtpServerConfig.setReadonly(false);
            this.textNtpServerConfig.setDisplayValue("");
            this.nodeNtpServerDialog.show();
        } catch (e) {
            console.error('ERROR IN btnAddNtpServerClick: ' + e);
            this.showToastError("ERROR IN btnAddNtpServerClick: " + e.toString());
        }
    },
    btnEditNtpServerClick: function(inSender) {
        try {
            this.labelNtpServerConfig.setCaption("Edit NTP server name or IP:");
            var index = this.gridNtpServerList.getSelectedIndex();
            this.textNtpServerConfig.setDisplayValue(this.gridNtpServerList.getCell(index, "name"));
            this.textNtpServerConfig.setReadonly(false);
            this.nodeNtpServerDialog.show();
        } catch (e) {
            console.error('ERROR IN btnEditNtpServerClick: ' + e);
            this.showToastError("ERROR IN btnEditNtpServerClick: " + e.toString());
        }
    },
    btnRemoveNtpServerClick: function(inSender) {
        try {
            this.labelNtpServerConfig.setCaption("This will remove the following NTP server:");
            var index = this.gridNtpServerList.getSelectedIndex();
            this.textNtpServerConfig.setDisplayValue(this.gridNtpServerList.getCell(index, "name"));
            this.textNtpServerConfig.setReadonly(true);
            this.nodeNtpServerDialog.show();

        } catch (e) {
            console.error('ERROR IN btnRemoveNtpServerClick: ' + e);
            this.showToastError("ERROR IN btnRemoveNtpServerClick: " + e.toString());
        }
    },
    btnValidNtpServerClick: function(inSender) {
        try {
            var label = this.labelNtpServerConfig.caption;
            var ntpServer = this.textNtpServerConfig.getDisplayValue();
            if (label.indexOf("This will remove the following NTP server:") > -1) {
                var del_index = this.gridNtpServerList.getSelectedIndex();
                this.gridNtpServerList.deleteRow(del_index);
            } else if (label.indexOf("Edit NTP server name or IP:") > -1) {
                var index = this.gridNtpServerList.getSelectedIndex();
                this.gridNtpServerList.setCell(index, "name", ntpServer, true);
            } else {
                this.gridNtpServerList.addRow({
                    name: ntpServer,
                    dataValue: ntpServer
                }, true);
            }
            ntp_servers = [];
            //.getRowCount()
            for (var i = 0; i < this.gridNtpServerList.getRowCount(); i++) {
                ntp_servers.push(this.gridNtpServerList.getCell(i, "name"));
            }
            var data = {
                "ntp_servers": ntp_servers
            };

            var node = this.varSelectedServer.getValue("dataValue");
            this.javaSetNodeNtpServers.input.setValue('node', node);
            this.javaSetNodeNtpServers.input.setValue('data', JSON.stringify(data));
            this.javaSetNodeNtpServers.update();

            this.nodeNtpServerDialog.hide();
        } catch (e) {
            console.error('ERROR IN btnValidNtpServerClick: ' + e);
            this.showToastError("ERROR IN btnValidNtpServerClick: " + e.toString());
        }
    },
    javaSetNodeNtpServersResult: function(inSender, inDeprecated) {
        try {
            var node = this.varSelectedServer.getValue("dataValue");
            this.javaGetNodeTimeConfiguration.input.setValue("node", node);
            this.javaGetNodeTimeConfiguration.update();

        } catch (e) {
            console.error('ERROR IN javaSetNodeNtpServersResult: ' + e);
        }
    },
    btnEditMiscNtpClick: function(inSender) {
        try {
            ntp_servers = [];
            //.getRowCount()
            for (var i = 0; i < this.gridNtpServerList.getRowCount(); i++) {
                ntp_servers.push(this.gridNtpServerList.getCell(i, "name"));
            }

            var data = {
                "ntp_servers": ntp_servers,
                "misc": this.NtpOptionTextArea.getDisplayValue()
            };

            var node = this.varSelectedServer.getValue("dataValue");
            this.javaSetNodeAdvancedTimeConfiguration.input.setValue('node', node);
            this.javaSetNodeAdvancedTimeConfiguration.input.setValue('data', JSON.stringify(data));
            this.javaSetNodeAdvancedTimeConfiguration.update();

        } catch (e) {
            console.error('ERROR IN btnEditMiscNtpClick: ' + e);
        }
    },
    javaSetNodeAdvancedTimeConfigurationBeforeUpdate: function(inSender, ioInput) {
        try {
            this.loadingNodeTimeConfig.show();
        } catch (e) {
            console.error('ERROR IN javaSetNodeAdvancedTimeConfigurationBeforeUpdate: ' + e);
        }
    },
    javaSetNodeAdvancedTimeConfigurationResult: function(inSender, inDeprecated) {
        try {
            var result = JSON.parse(this.javaSetNodeAdvancedTimeConfiguration.getValue("dataValue")).action.result;
            if (result !== "Successful") {
                app.toastDialog.showToast("Please review your NTP configuration.", 5000, "Warning", "cc", result);
            }
            var node = this.varSelectedServer.getValue("dataValue");
            this.javaGetNodeTimeConfiguration.input.setValue("node", node);
            this.javaGetNodeTimeConfiguration.update();


        } catch (e) {
            console.error('ERROR IN javaSetNodeAdvancedTimeConfigurationResult: ' + e);
        }
    },
    labelSnapshotDiscardBranchClick: function(inSender, inEvent) {
        try {
            this.labelSnapshotMergeToDescendantClick(inSender, inEvent);

        } catch (e) {
            console.error('ERROR IN labelSnapshotDiscardBranchClick: ' + e);
        }
    },


    tableserversDojoGridCellDblClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        try {
            this.labelServerClick(this.tableserversDojoGrid.getCell(rowId, "name"));

        } catch (e) {
            this.showToastError("ERROR IN tableserversDojoGridCellDblClick: " + e.toString());
            console.error('ERROR IN tableserversDojoGridCellDblClick: ' + e);
        }
    },

    // Dojo Menus
    dojoMenuToolsSettingsClick: function(inSender /*,args*/ ) {
        try {
            this.labelDatacenterClick();
            this.TabCenterConfig.activate();

        } catch (e) {
            console.error('ERROR IN dojoMenuToolsSettingsClick: ' + e);
        }
    },

    toolbarToolsAddNodeClick: function(inSender, inEvent) {
        try {
            this.tableserversDialog.setTitle("Add Node");
            this.tableserversLivePanel1.popupLivePanelInsert();

        } catch (e) {
            console.error('ERROR IN toolbarToolsAddNodeClick: ' + e);
        }
    },

    toolbarViewCompactClick: function(inSender, inEvent) {
        try {
            this.panelMenu.hide();
            this.panelBottom.hide();
            this.panelDesc.hide();
            this.hideTasksList();
            this.panelSmallHeader.show();
            dojo.cookie("openkvi_compact_view", "yes");

        } catch (e) {
            console.error('ERROR IN toolbarViewCompactClick: ' + e);
            this.showToastError("ERROR IN toolbarViewCompactClick: " + e.toString());
        }
    },

    hideTasksList: function() {
        try {
            var domHeight = this.layersBottomInfo.domNode.style.height.replace(/px/g, "");
            if (domHeight !== this.layersBottomInfo.height) {
                this.layersBottomInfo.setHeight(domHeight);
            }
            this._gridLogHeight = this.layersBottomInfo.height;

            this.layersBottomInfo.setHeight(this._BottomInfoHided);
            this.hideTaskListPict.setHint("Show Tasks List");
            this.hideTaskListPict.setSource("resources/images/icons/arrow-show.png");
            this._TaskListHided = true;
        } catch (e) {
            console.error('ERROR IN hideTasksList: ' + e);
        }
    },
    showTasksList: function() {
        try {
            this.labelNbUnseenMsg.setShowing(false);
            this.labelNbUnseenMsg.setCaption("0");
            this.layersBottomInfo.setHeight(this._gridLogHeight);
            this.hideTaskListPict.setHint("Hide Tasks List");
            this.hideTaskListPict.setSource("resources/images/icons/arrow-hide.png");
            this._TaskListHided = false;
        } catch (e) {
            console.error('ERROR IN hideTasksList: ' + e);
        }
    },
    hideTaskListPictClick: function(inSender) {
        try {
            var arrow = this.hideTaskListPict.source;
            if (arrow.indexOf("hide") > 0) {
                this.hideTasksList();
                dojo.cookie("openkvi_compact_view", "yes");
            } else {
                this.showTasksList();
                dojo.cookie("openkvi_compact_view", "no");
            }

        } catch (e) {
            console.error('ERROR IN hideTaskListPictClick: ' + e);
        }
    },
    SmallHeaderMenuClose: function(inSender, inWhy) {
        try {
            this.panelSmallOpenkvi.removeUserClass("wm_BackgroundColor_SteelBlue");

        } catch (e) {
            console.error('ERROR IN SmallHeaderMenuClose: ' + e);
        }
    },
    smallHeaderMenuAddNodeClick: function(inSender, inEvent) {
        try {
            this.tableserversDialog.setTitle("Add Node");
            this.tableserversLivePanel1.popupLivePanelInsert();

        } catch (e) {
            console.error('ERROR IN smallHeaderMenuAddNodeClick: ' + e);
        }
    },

  _end: 0
});