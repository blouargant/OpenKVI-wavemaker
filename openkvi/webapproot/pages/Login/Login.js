/*
 *  Copyright (C) 2010-2011 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


dojo.declare("Login", wm.Page, {
    start: function() {
        try {
            var cookieTest = dojo.cookie("closingTest");
            //app.alert("Cookie : "+cookieTest);
            if (cookieTest === "BACKSPACE") {
                dojo.cookie("closingTest", "ok", {
                    expires: 1
                });
                window.location = "/openkvi/index.html";
                //app.loadPage("Main");
            }
    
            this.connect(this.domNode, "keydown", this, "keydown");
            this.usernameInput.setDataValue(dojo.cookie("user") || "");
            this.usernameInput.focus();
            if (this.wmTitle) this.wmTitle.setCaption(app.name || app.declaredClass);
            this.loadingAuthUser.setShowing(false);
        } catch (e) {
            app.toastError("Error start:" + e.toString());
        }
    },
    
    keydown: function(e) {
        if (e.keyCode == dojo.keys.ENTER) {
            this.loginButton.domNode.focus();
        }
    },

    loginButtonClick: function(inSender) {
        try {
            this.loadingAuthUser.setShowing(true);
            //app.varMainLoaded.setData({dataValue : true});
            dojo.cookie("user", this.usernameInput.getDataValue(), {
                expires: 365
            });
            this.loginErrorMsg.setCaption("");
            loginFailedCallback = "loginFailed";
            dojo.cookie("backTest", "ok", {
                expires: 1
            });
            
            //wm.login([this.usernameInput.getDataValue(), this.passwordInput.getDataValue()], null, dojo.hitch(this, loginFailedCallback));
            this.javaAuthenticateUser.input.setValue("user",this.usernameInput.getDataValue());
            this.javaAuthenticateUser.input.setValue("password",this.passwordInput.getDataValue());
            this.javaAuthenticateUser.update();
            
        } catch (e) {
            app.toastError("Error :" + e.toString());
        }
    },

    autoSubscriptionAttempt: function(inResponse) {
        // calls autosubscribe
        //if ok:
            wm.login(
                [this.usernameInput.getDataValue(), this.passwordInput.getDataValue()], 
                null,
                dojo.hitch(this, "loginFailed")
            );
    },

    loginFailed: function(inResponse) {
        this.loadingAuthUser.setShowing(false);
	    this.loginErrorMsg.setCaption("Invalid username or password.");
	    this.usernameInput.focus();
	},
    
    javaAuthenticateUserResult: function(inSender, inDeprecated) {
        try {
            var result = this.javaAuthenticateUser.getValue("dataValue");
            if (result !== null) {
                var jsonVar = JSON.parse(result);
                if (jsonVar.mode === "SQL") {
                    wm.login([this.usernameInput.getDataValue(), this.passwordInput.getDataValue()], null, dojo.hitch(this, "loginFailed"));
                } else if (jsonVar.subscribed === false) {
                    this.loadingAuthUser.setShowing(false);
                    app.alert("User <b>"+jsonVar.firstname +"</b> is not registred.</br>Please contact your Administrator");
                    this.loginErrorMsg.setCaption("User not registred.");
                    this.usernameInput.focus();
                } else {
                   wm.login([this.usernameInput.getDataValue(), jsonVar.password], null, dojo.hitch(this, "loginFailed"));
                }
            } else {
                wm.login([this.usernameInput.getDataValue(), this.passwordInput.getDataValue()], null, dojo.hitch(this, "loginFailed"));
            }
        } catch (e) {
            app.toastError("Error javaAuthenticateUserResult:" + e);
            console.error('ERROR IN javaAuthenticateUserResult: ' + e);
        }
    },
  _end: 0
});
