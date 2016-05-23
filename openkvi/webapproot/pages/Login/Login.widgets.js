Login.widgets = {
	varTest: ["wm.Variable", {"type":"BooleanData"}, {}],
	javaAuthenticateUser: ["wm.ServiceVariable", {"operation":"authenticateUser","service":"authenticateUsers"}, {"onResult":"javaAuthenticateUserResult"}, {
		input: ["wm.ServiceInput", {"type":"authenticateUserInputs"}, {}]
	}],
	loadingAuthUser: ["wm.LoadingDialog", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px","wm_BackgroundColor_SteelBlue"]}}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"loginInputPanel","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	layoutBox: ["wm.Layout", {"height":"100%"}, {}, {
		loginMainPanel: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center","padding":"10","verticalAlign":"center","width":"100%"}, {}, {
			wmTitle: ["wm.Label", {"align":"center","border":"0","height":"20px","padding":"4","showing":false,"width":"350px"}, {}],
			pictureLogin: ["wm.Picture", {"border":"0","height":"70px","source":"resources/images/logos/OpenKVI-46-2.png","width":"350px"}, {}],
			loginInputPanel: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px","wm_BorderShadow_StrongShadow"]},"border":"1","height":"160px","horizontalAlign":"center","padding":"0","verticalAlign":"center","width":"350px"}, {}, {
				panel2: ["wm.EmphasizedContentPanel", {"borderColor":"#cbcbcb","height":"100%","horizontalAlign":"left","margin":"5","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
					panel3: ["wm.Panel", {"border":"0","height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						picture1: ["wm.Picture", {"border":"0","height":"32px","source":"resources/images/icons/secure-22.png","width":"32px"}, {}],
						labelAuthenticate: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_FontColor_Graphite"]},"border":"0","caption":"User Authentication","padding":"4"}, {}]
					}],
					panel1: ["wm.Panel", {"border":"0","height":"55px","horizontalAlign":"center","verticalAlign":"middle","width":"100%"}, {}, {
						usernameInput: ["wm.Text", {"caption":"Username","dataValue":undefined,"displayValue":"","width":"280px"}, {}],
						passwordInput: ["wm.Text", {"caption":"Password","dataValue":undefined,"displayValue":"","password":true,"width":"280px"}, {}]
					}]
				}],
				loginButtonPanel: ["wm.MainContentPanel", {"border":"0","height":"50px","horizontalAlign":"right","layoutKind":"left-to-right","margin":"5","width":"100%"}, {}, {
					loginErrorMsg: ["wm.Label", {"align":"center","border":"0","caption":" ","height":"100%","padding":"4","singleLine":false,"width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					loginButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_SteelBlue"]},"caption":"Login","height":"100%","margin":"4","width":"90px"}, {"onclick":"loginButtonClick"}]
				}]
			}]
		}]
	}]
}