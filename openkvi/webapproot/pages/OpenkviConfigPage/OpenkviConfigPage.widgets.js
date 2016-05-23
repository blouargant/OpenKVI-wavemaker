OpenkviConfigPage.widgets = {
	varAuthenticationModes: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"Local SQL database\",\"dataValue\":\"SQL\"},{\"name\":\"Remote LDAP server\",\"dataValue\":\"LDAP\"},{\"name\":\"Active Directory server\",\"dataValue\":\"AD\"}]","type":"EntryData"}, {}],
	varLdapCreationMode: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"Administrator adds\",\"dataValue\":\"AdminAdd\"},{\"name\":\"Auto subscription\",\"dataValue\":\"AutoSubscription\"},{\"name\":\"Administrator validates\",\"dataValue\":\"AdminValidation\"}]","type":"EntryData"}, {}],
	javaAuthenticationMode: ["wm.ServiceVariable", {"operation":"AutoSubscribeLdapUser","service":"authenticationModeTools"}, {"onResult":"javaAuthenticationModeResult"}, {
		input: ["wm.ServiceInput", {"type":"AutoSubscribeLdapUserInputs"}, {}]
	}],
	javaTestLdapConnection: ["wm.ServiceVariable", {"operation":"testLdapConnection","service":"authenticationModeTools"}, {"onResult":"javaTestLdapConnectionResult"}, {
		input: ["wm.ServiceInput", {"type":"testLdapConnectionInputs"}, {}]
	}],
	javaGetLdapUserInfo: ["wm.ServiceVariable", {"operation":"getLdapUserInfo","service":"authenticationModeTools"}, {"onResult":"javaGetLdapUserInfoResult"}, {
		input: ["wm.ServiceInput", {"type":"getLdapUserInfoInputs"}, {}]
	}],
	usersDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget","height":"310px","title":"Users","width":"350px"}, {}, {
		containerWidget: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"5","verticalAlign":"middle","width":"100%"}, {}, {
			usersLiveForm: ["wm.LiveForm", {"alwaysPopulateEditors":true,"customGetValidate":"usersLiveFormIsValid","fitToContentHeight":true,"height":"225px","horizontalAlign":"left","liveEditing":false,"margin":"4","padding":"10","saveOnEnterKey":false,"verticalAlign":"top"}, {"onSuccess":"usersLivePanel.popupLiveFormSuccess"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"usersDojoGrid.selectedItem","targetProperty":"dataSet"}, {}]
				}],
				panel4: ["wm.Panel", {"border":"0","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					loginEditor: ["wm.Text", {"caption":"Login:","captionAlign":"left","captionSize":"80px","dataValue":"","emptyValue":"emptyString","formField":"login","height":"26px","required":true,"width":"100%"}, {"onEnterKeyPress":"loginEditorEnterKeyPress"}]
				}],
				panelGetUserInfo: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,80","verticalAlign":"top","width":"100%"}, {}, {
					btnGetLdapUserInfo: ["wm.Button", {"caption":"Get user details","hint":"Check user information","imageIndex":66,"imageList":"app.silkIconsOpenkvi","margin":"5","width":"150px"}, {"onclick":"btnGetLdapUserInfoClick"}]
				}],
				passwordEditor: ["wm.Text", {"caption":"Password:","captionAlign":"left","captionSize":"80px","dataValue":"","emptyValue":"emptyString","formField":"password","height":"26px","password":true,"required":true,"width":"100%"}, {}],
				roleEditor: ["wm.SelectMenu", {"caption":"User Role:","captionSize":"80px","dataField":"dataValue","displayField":"name","emptyValue":"emptyString","formField":"role","height":"26px","required":true,"width":"100%"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"app.varRolesList","targetProperty":"dataSet"}, {}]
					}]
				}],
				firstNameEditor: ["wm.Text", {"caption":"First Name:","captionAlign":"left","captionSize":"80px","dataValue":"","emptyValue":"emptyString","formField":"firstname","height":"26px","width":"100%"}, {}],
				lastNameEditor: ["wm.Text", {"caption":"Last Name:","captionAlign":"left","captionSize":"80px","dataValue":"","emptyValue":"emptyString","formField":"lastname","height":"26px","width":"100%"}, {}],
				mailEditor: ["wm.Text", {"caption":"eMail","captionAlign":"left","captionSize":"80px","dataValue":"","emptyValue":"emptyString","formField":"mail","height":"26px","width":"100%"}, {}]
			}]
		}],
		buttonBar: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			usersSaveButton: ["wm.Button", {"caption":" Save","imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"usersSaveButtonClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"source":"usersLiveForm.invalid","targetId":null,"targetProperty":"disabled"}, {}]
				}]
			}],
			usersCancelButton: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"usersDialog.hide","onclick1":"usersLiveForm.cancelEdit"}]
		}]
	}],
	groupsDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget1","height":134,"title":"groups","width":"500px"}, {}, {
		containerWidget1: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			groupsLiveForm: ["wm.LiveForm", {"alwaysPopulateEditors":true,"fitToContentHeight":true,"height":"34px","horizontalAlign":"left","liveEditing":false,"margin":"4","verticalAlign":"top"}, {"onSuccess":"groupsLivePanel.popupLiveFormSuccess"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"groupsDojoGrid.selectedItem","targetProperty":"dataSet"}, {}]
				}],
				nameEditor: ["wm.Text", {"caption":"Name","captionSize":"200px","dataValue":"","emptyValue":"emptyString","formField":"name","height":"26px","required":true,"width":"100%"}, {}]
			}]
		}],
		buttonBar1: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			groupsSaveButton: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"groupsLiveForm.saveDataIfValid"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"source":"groupsLiveForm.invalid","targetId":null,"targetProperty":"disabled"}, {}]
				}]
			}],
			groupsCancelButton: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"groupsDialog.hide","onclick1":"groupsLiveForm.cancelEdit"}]
		}]
	}],
	getAuthenticationMode: ["wm.ServiceVariable", {"operation":"getAuthenticationMode","service":"authenticationModeTools"}, {"onResult":"getAuthenticationModeResult"}, {
		input: ["wm.ServiceInput", {"type":"getAuthenticationModeInputs"}, {}]
	}],
	groupsLiveVariable: ["wm.LiveVariable", {"liveSource":"app.groupsLiveView1"}, {}],
	usersLiveVariable: ["wm.LiveVariable", {"liveSource":"app.usersLiveView1"}, {}],
	authenticationLiveVariable: ["wm.LiveVariable", {"liveSource":"app.authenticationLiveView1","matchMode":"exact"}, {}],
	ldapLoginDiag: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget2","height":"145px","title":"Authentication test","width":"350px"}, {}, {
		containerWidget2: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			textTestLogin: ["wm.Text", {"caption":"Login:","dataValue":"","displayValue":"","emptyValue":"emptyString","required":true}, {}],
			textTestPassword: ["wm.Text", {"caption":"Password:","dataValue":"","displayValue":"","emptyValue":"emptyString","password":true,"required":true}, {"onEnterKeyPress":"textTestPasswordEnterKeyPress"}],
			labelInvalidUser: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Red"]},"border":"0","caption":"<i>Invalid username or password.</i>","padding":"4","showing":false,"width":"100%"}, {}]
		}],
		buttonBar2: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			btnValidTest: ["wm.Button", {"caption":"OK","margin":"4"}, {"onclick":"btnValidTestClick"}],
			btnCancelTest: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"ldapLoginDiag.hide"}]
		}]
	}],
	javaGetHosts: ["wm.ServiceVariable", {"operation":"getEtcHosts","service":"serverTools"}, {"onResult":"javaGetHostsResult"}, {
		input: ["wm.ServiceInput", {"type":"getEtcHostsInputs"}, {}]
	}],
	loadingHosts: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"javaGetHosts","targetProperty":"serviceVariableToTrack"}, {}],
			wire1: ["wm.Wire", {"expression":undefined,"source":"gridEtcHosts","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	varEtcHosts: ["wm.Variable", {"isList":true,"type":"typeEtcHosts"}, {}],
	hostnamesDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget3","height":"150px","title":"New Host entry","width":"400px"}, {}, {
		containerWidget3: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			panelHostEntry: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","margin":"10","verticalAlign":"top","width":"100%"}, {}, {
				textHostIP: ["wm.Text", {"caption":"IP","dataValue":undefined,"displayValue":"","helpText":"Host's IP address","regExp":"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$","required":true}, {}],
				textHostNames: ["wm.Text", {"autoSizeHeight":true,"caption":"Names","dataValue":undefined,"displayValue":"","helpText":"Host's names. Use a comma to separate its different names. ","required":true,"singleLine":false}, {}]
			}]
		}],
		buttonBar3: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			btnHostEntrySave: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"btnHostEntrySaveClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"panelHostEntry.invalid","targetProperty":"disabled"}, {}]
				}]
			}],
			btnHostEntryCancel: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"hostnamesDialog.hide"}]
		}]
	}],
	javaSetHosts: ["wm.ServiceVariable", {"operation":"setEtcHosts","service":"serverTools"}, {"onResult":"javaSetHostsResult"}, {
		input: ["wm.ServiceInput", {"type":"setEtcHostsInputs"}, {}]
	}],
	deleteHostEntryDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget4","height":"150px","title":"Please confirm ...","width":"600px"}, {}, {
		containerWidget4: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"10","verticalAlign":"top","width":"100%"}, {}, {
			label7: ["wm.Label", {"border":"0","caption":"This will delete the following host entry:","padding":"4","width":"100%"}, {}],
			labelHostEntryToDelete: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"autoSizeHeight":true,"border":"0","height":"25px","padding":"4","singleLine":false,"width":"100%"}, {}]
		}],
		buttonBar4: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			btnDeleteHostEntryConfirm: ["wm.Button", {"caption":"Confirm","margin":"4"}, {"onclick":"btnDeleteHostEntryConfirmClick"}],
			btnDeleteHostEntryCancel: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"deleteHostEntryDialog.hide"}]
		}]
	}],
	javaGetSessionInfo: ["wm.ServiceVariable", {"operation":"getSessionInfo","service":"javaTools"}, {"onResult":"javaGetSessionInfoResult"}, {
		input: ["wm.ServiceInput", {"type":"getSessionInfoInputs"}, {}]
	}],
	javaSetSessionInfo: ["wm.ServiceVariable", {"operation":"setSessionInfo","service":"javaTools"}, {"onResult":"javaSetSessionInfoResult"}, {
		input: ["wm.ServiceInput", {"type":"setSessionInfoInputs"}, {}]
	}],
	javaRestartTomcat: ["wm.ServiceVariable", {"operation":"restartTomcat","service":"javaTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"restartTomcatInputs"}, {}]
	}],
	javaGetSecurityLevel: ["wm.ServiceVariable", {"operation":"getSecurityLevel","service":"javaTools"}, {"onResult":"javaGetSecurityLevelResult"}, {
		input: ["wm.ServiceInput", {"type":"getSecurityLevelInputs"}, {}]
	}],
	javaSetSecurityLevel: ["wm.ServiceVariable", {"operation":"setSecurityLevel","service":"javaTools"}, {"onResult":"javaSetSecurityLevelResult"}, {
		input: ["wm.ServiceInput", {"type":"setSecurityLevelInputs"}, {}]
	}],
	layout: ["wm.Layout", {"_classes":{"domNode":["MainContent"]},"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		openkviConfig: ["wm.Template", {"border":"0","height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"100%"}, {}, {
			panelOpenkviConfig: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				panelOpenkviConfList: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"10,0,10,10","verticalAlign":"top","width":"170px"}, {}, {
					panel45: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_White"]},"borderColor":"#b3b8c4","height":"95%","horizontalAlign":"left","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
						panelUsers: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
							picture8: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/user-24.png","width":"24px"}, {}],
							labelUsers: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_Mouse_pointer"]},"border":"0,0,0,0","borderColor":"#b3b8c4","caption":"Users","padding":"4","width":"100%"}, {"onclick":"onItemConfigClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						panelAuth: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
							picture9: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/secure-24.png","width":"24px"}, {}],
							labelAuthenticationMode: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_Mouse_pointer"]},"border":"0,0,0,0","borderColor":"#b3b8c4","caption":"Authentication","padding":"4","width":"100%"}, {"onclick":"onItemConfigClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						panelSecurity: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
							picture11: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/server_config/security.png","width":"24px"}, {}],
							labelSecurity: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_Mouse_pointer"]},"border":"0,0,0,0","borderColor":"#b3b8c4","caption":"Security","padding":"4","width":"100%"}, {"onclick":"onItemConfigClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						panelHosts: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
							picture10: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/server_config/computer.png","width":"24px"}, {}],
							labelHosts: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_Mouse_pointer"]},"border":"0,0,0,0","borderColor":"#b3b8c4","caption":"Hosts definitions","padding":"4","width":"100%"}, {"onclick":"onItemConfigClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						panelDefaultStorages: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","roles":["dev"],"verticalAlign":"middle","width":"100%"}, {}, {
							picture7: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/server_config/storage-24.png","width":"24px"}, {}],
							labelDefaultStorages: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_Mouse_pointer"]},"border":"0,0,0,0","borderColor":"#b3b8c4","caption":"Storages","padding":"4","width":"100%"}, {"onclick":"onItemConfigClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}]
					}]
				}],
				panel46: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
					layersDataCenter: ["wm.Layers", {"defaultLayer":3}, {}, {
						layerDataStorage: ["wm.Layer", {"borderColor":"","caption":"layerServerStorage","horizontalAlign":"left","padding":"10,10,10,0","verticalAlign":"top"}, {}, {
							panel50: ["wm.HeaderContentPanel", {"borderColor":"#b3b8c4","height":"100%","horizontalAlign":"left","margin":"5","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
								panel47: ["wm.HeaderContentPanel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"borderColor":"#b3b8c4","height":"36px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
									editDefaultVmConfigStorage: ["wm.Text", {"caption":"Default configuration directory : ","captionSize":"200px","displayValue":"","readonly":true,"width":"95%"}, {}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":false,"source":"varDefaultVmConfigPath.dataValue","targetProperty":"dataValue"}, {}]
										}]
									}],
									btnDefaultVmConfigStorage: ["wm.Button", {"caption":"Edit","margin":"4","width":"70px"}, {"onclick":"btnDefaultVmConfigStorageClick"}],
									btnCancelVmConfigStorage: ["wm.Button", {"caption":"Cancel","margin":"4","showing":false}, {"onclick":"btnCancelVmConfigStorageClick"}]
								}],
								panel48: ["wm.HeaderContentPanel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"borderColor":"#b3b8c4","height":"36px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
									editDefaultVmImageStorage: ["wm.Text", {"caption":"Default disk images directory :","captionSize":"200px","displayValue":"","readonly":true,"width":"95%"}, {}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":false,"source":"varDefaultDiskPath.dataValue","targetProperty":"dataValue"}, {}]
										}]
									}],
									btnDefaultVmImageStorage: ["wm.Button", {"caption":"Edit","margin":"4","width":"70px"}, {"onclick":"btnDefaultVmImageStorageClick"}],
									btnCancelVmImageStorage: ["wm.Button", {"caption":"Cancel","margin":"4","showing":false}, {"onclick":"btnCancelVmImageStorageClick"}]
								}],
								panel77: ["wm.HeaderContentPanel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"borderColor":"#b3b8c4","height":"36px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
									editDefaultIsoStorage: ["wm.Text", {"caption":"Default ISOs images directory :","captionSize":"200px","displayValue":"","readonly":true,"width":"95%"}, {}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":false,"source":"varIsoDirectory.dataValue","targetProperty":"dataValue"}, {}]
										}]
									}],
									btnDefaultVmImageStorage1: ["wm.Button", {"caption":"Edit","margin":"4","width":"70px"}, {"onclick":"btnDefaultVmImageStorage1Click"}],
									btnCancelVmImageStorage1: ["wm.Button", {"caption":"Cancel","margin":"4","showing":false}, {"onclick":"btnCancelVmImageStorage1Click"}]
								}]
							}]
						}],
						layerDataHosts: ["wm.Layer", {"borderColor":"","caption":"layerServerNetwork","horizontalAlign":"left","margin":"0","padding":"10,10,10,0","verticalAlign":"top"}, {}, {
							panelHostsConfig: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"autoScroll":true,"border":"1","borderColor":"#b3b8c4","height":"95%","horizontalAlign":"left","margin":"0","padding":"20","verticalAlign":"top","width":"100%"}, {}, {
								panel13: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
									panel14: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_NoCurve"]},"border":"0","borderColor":"#999999","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
										label9: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0,0,1,0","caption":"Network Hosts","padding":"4","width":"100%"}, {}]
									}],
									panel11: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"335px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
										panel17: ["wm.HeaderContentPanel", {"fitToContentWidth":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"600px"}, {}, {
											gridEtcHosts: ["wm.DojoGrid", {"columns":[{"show":true,"id":"ip","title":"IP","width":"100px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"names","title":"Hostnames","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"300px","margin":"4","width":"600px"}, {}, {
												binding: ["wm.Binding", {}, {}, {
													wire: ["wm.Wire", {"expression":undefined,"source":"varEtcHosts","targetProperty":"dataSet"}, {}]
												}]
											}]
										}],
										panel12: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,4","verticalAlign":"top","width":"100%"}, {}, {
											btnHostNew: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray","wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"caption":" New","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnHostNewClick"}],
											btnHostEdit: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray","wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"caption":" Edit","imageIndex":80,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnHostEditClick"}, {
												binding: ["wm.Binding", {}, {}, {
													wire: ["wm.Wire", {"expression":undefined,"source":"gridEtcHosts.emptySelection","targetProperty":"disabled"}, {}]
												}]
											}],
											btnHostDelete: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray","wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"caption":" Delete","imageIndex":108,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnHostDeleteClick"}, {
												binding: ["wm.Binding", {}, {}, {
													wire: ["wm.Wire", {"expression":undefined,"source":"gridEtcHosts.emptySelection","targetProperty":"disabled"}, {}]
												}]
											}]
										}]
									}]
								}]
							}]
						}],
						layerDataOption: ["wm.Layer", {"borderColor":"","caption":"layerServerOption","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}],
						layerUsers: ["wm.Layer", {"borderColor":"","caption":"layerServerStorage","horizontalAlign":"left","margin":"","padding":"10,10,10,0","verticalAlign":"top"}, {}, {
							panel52: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"autoScroll":true,"border":"1","borderColor":"#b3b8c4","height":"95%","horizontalAlign":"left","margin":"0","padding":"20","verticalAlign":"top","width":"100%"}, {}, {
								panel1: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
									panel9: ["wm.HeaderContentPanel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
										usersLivePanel: ["wm.LivePanel", {"autoScroll":false,"border":"0","horizontalAlign":"left","verticalAlign":"top"}, {}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"source":"usersDialog","targetId":null,"targetProperty":"dialog"}, {}],
												wire1: ["wm.Wire", {"source":"usersLiveForm","targetId":null,"targetProperty":"liveForm"}, {}],
												wire2: ["wm.Wire", {"source":"usersDojoGrid","targetId":null,"targetProperty":"dataGrid"}, {}],
												wire3: ["wm.Wire", {"source":"usersSaveButton","targetId":null,"targetProperty":"saveButton"}, {}]
											}],
											label2: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0,0,1,0","caption":"Users","padding":"4","width":"100%"}, {}],
											spacer3: ["wm.Spacer", {"height":"24px","width":"96px"}, {}],
											usersDojoGrid: ["wm.DojoGrid", {"borderColor":"#b3b8c4","columns":[{"show":false,"id":"id","title":"Id","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":true,"id":"login","title":"Login","width":"154px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"password","title":"Password","width":"100px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"role","title":"Role","width":"80px","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","fieldType":""},{"show":true,"id":"firstname","title":"First Name","width":"25%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"lastname","title":"Last Name","width":"25%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"mail","title":"eMail","width":"50%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"groupid","title":"Groupid","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","margin":"4"}, {"onCellDblClick":"usersLivePanel.popupLivePanelEdit"}, {
												binding: ["wm.Binding", {}, {}, {
													wire: ["wm.Wire", {"expression":undefined,"source":"usersLiveVariable","targetProperty":"dataSet"}, {}]
												}]
											}]
										}]
									}],
									usersGridButtonPanel: ["wm.MainContentPanel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,4","verticalAlign":"top","width":"100%"}, {}, {
										usersNewButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray","wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px"]},"caption":" New","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"setUsersDialog","onclick1":"usersLivePanel.popupLivePanelInsert"}],
										usersUpdateButton: ["wm.Button", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundChromeBar_LightGray","wm_BorderTopStyle_Curved4px"]},"caption":" Edit","imageIndex":80,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"setUsersDialog","onclick1":"usersLivePanel.popupLivePanelEdit"}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"source":"usersDojoGrid.emptySelection","targetId":null,"targetProperty":"disabled"}, {}]
											}]
										}],
										usersDeleteButton: ["wm.Button", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px","wm_BackgroundChromeBar_LightGray"]},"caption":" Delete","imageIndex":108,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"usersLiveForm.deleteData"}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"source":"usersDojoGrid.emptySelection","targetId":null,"targetProperty":"disabled"}, {}]
											}]
										}]
									}]
								}],
								spacer1: ["wm.Spacer", {"height":"48px","width":"96px"}, {}],
								panel7: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
									label1: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0,0,1,0","caption":"Roles:","padding":"4","width":"100%"}, {}],
									spacer4: ["wm.Spacer", {"height":"24px","width":"96px"}, {}],
									panel2: ["wm.Panel", {"border":"0","height":"200px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"300px"}, {}, {
										groupsLivePanel: ["wm.LivePanel", {"autoScroll":false,"border":"0","horizontalAlign":"left","verticalAlign":"top"}, {}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"source":"groupsDialog","targetId":null,"targetProperty":"dialog"}, {}],
												wire1: ["wm.Wire", {"source":"groupsLiveForm","targetId":null,"targetProperty":"liveForm"}, {}],
												wire2: ["wm.Wire", {"source":"groupsDojoGrid","targetId":null,"targetProperty":"dataGrid"}, {}],
												wire3: ["wm.Wire", {"source":"groupsSaveButton","targetId":null,"targetProperty":"saveButton"}, {}]
											}],
											groupsDojoGrid: ["wm.DojoGrid", {"borderColor":"#b3b8c4","columns":[{"show":false,"id":"id","title":"Id","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":true,"id":"name","title":"Name","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","margin":"4"}, {"onCellDblClick":"groupsLivePanel.popupLivePanelEdit"}, {
												binding: ["wm.Binding", {}, {}, {
													wire: ["wm.Wire", {"expression":undefined,"source":"groupsLiveVariable","targetProperty":"dataSet"}, {}]
												}]
											}],
											groupsGridButtonPanel: ["wm.MainContentPanel", {"border":"0","height":"36px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
												groupsNewButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray","wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px","wm_BorderShadow_NoShadow"]},"caption":"New","margin":"4"}, {"onclick":"groupsLivePanel.popupLivePanelInsert"}],
												groupsUpdateButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray","wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px","wm_BorderShadow_NoShadow"]},"caption":"Update","margin":"4"}, {"onclick":"groupsLivePanel.popupLivePanelEdit"}, {
													binding: ["wm.Binding", {}, {}, {
														wire: ["wm.Wire", {"source":"groupsDojoGrid.emptySelection","targetId":null,"targetProperty":"disabled"}, {}]
													}]
												}],
												groupsDeleteButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray","wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px","wm_BorderShadow_NoShadow"]},"caption":"Delete","margin":"4"}, {"onclick":"groupsLiveForm.deleteData"}, {
													binding: ["wm.Binding", {}, {}, {
														wire: ["wm.Wire", {"source":"groupsDojoGrid.emptySelection","targetId":null,"targetProperty":"disabled"}, {}]
													}]
												}]
											}]
										}]
									}]
								}]
							}]
						}],
						layerAuthenticationMode: ["wm.Layer", {"borderColor":"","caption":"AuthenticationMode","horizontalAlign":"left","margin":"","padding":"10,10,10,0","verticalAlign":"top"}, {}, {
							panel54: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"autoScroll":true,"borderColor":"#b3b8c4","height":"95%","horizontalAlign":"left","padding":"20","verticalAlign":"top","width":"100%"}, {}, {
								panel5: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_NoCurve"]},"border":"0","borderColor":"#999999","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
									label3: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0,0,1,0","caption":"Authentication","padding":"4","width":"100%"}, {}]
								}],
								authenticationLivePanel: ["wm.LivePanel", {"border":"0","fitToContentHeight":true,"fitToContentWidth":true,"height":"562px","horizontalAlign":"left","verticalAlign":"top","width":"502px"}, {}, {
									panel6: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px"]},"borderColor":"#b3b8c4","fitToContentHeight":true,"height":"562px","horizontalAlign":"left","padding":"0","verticalAlign":"top","width":"502px"}, {}, {
										spacer2: ["wm.Spacer", {"height":"20px","width":"96px"}, {}],
										modeSelectEditor: ["wm.SelectMenu", {"caption":"Methode","captionSize":"90px","dataField":"dataValue","displayField":"name","displayValue":"","height":"26px","helpText":"Please select the authentication methode","padding":"4","required":true}, {"onchange":"modeSelectEditorChange"}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"expression":undefined,"source":"varAuthenticationModes","targetProperty":"dataSet"}, {}],
												wire1: ["wm.Wire", {"expression":undefined,"source":"getAuthenticationMode.dataValue","targetProperty":"dataValue"}, {}]
											}]
										}],
										spacer5: ["wm.Spacer", {"height":"20px","width":"96px"}, {}],
										ldapParametersPanel: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px","wm_BorderShadow_WeakShadow"]},"border":"1","borderColor":"#b3b8c4","fitToContentHeight":true,"height":"444px","horizontalAlign":"left","margin":"0,25,20,25","padding":"0,0,10,0","verticalAlign":"top","width":"500px"}, {}, {
											label4: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_SilverBlueTheme_ToolBar"]},"border":"0","caption":"LDAP parameters:","padding":"4","width":"100%"}, {}],
											spacer7: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
											authenticationLiveForm: ["wm.LiveForm", {"fitToContentHeight":true,"height":"378px","horizontalAlign":"left","liveEditing":false,"margin":"0,40,0,40","verticalAlign":"top"}, {"onResult":"authenticationLiveFormResult"}, {
												binding: ["wm.Binding", {}, {}, {
													wire: ["wm.Wire", {"expression":undefined,"source":"authenticationLiveVariable","targetProperty":"dataSet"}, {}]
												}],
												idEditor: ["wm.Number", {"caption":"Id","captionSize":"200px","emptyValue":"zero","formField":"id","height":"26px","required":true,"showing":false,"width":"100%"}, {}],
												label6: ["wm.Label", {"border":"0,0,1,0","borderColor":"#b3b8c4","caption":"Connection:","padding":"4","width":"100%"}, {}],
												panel8: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"83px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
													authMode: ["wm.Text", {"caption":"Mode","captionSize":"150px","emptyValue":"emptyString","formField":"mode","height":"26px","showing":false,"width":"100%"}, {}, {
														binding: ["wm.Binding", {}, {}, {
															wire: ["wm.Wire", {"expression":undefined,"source":"modeSelectEditor.dataValue","targetProperty":"dataValue"}, {}]
														}]
													}],
													spacer8: ["wm.Spacer", {"height":"5px","width":"96px"}, {}],
													ldaphostEditor: ["wm.Text", {"caption":"Host","captionSize":"150px","dataValue":undefined,"formField":"ldaphost","height":"26px","helpText":"Authentication server IP address or name.","padding":"2,20,2,0","placeHolder":"IP address","required":true,"width":"100%"}, {}],
													ldapportEditor: ["wm.Text", {"caption":"Port","captionSize":"150px","dataValue":undefined,"defaultInsert":"","formField":"ldapport","height":"26px","helpText":"Default = 389","padding":"2,20,2,0","placeHolder":"389","required":true,"width":"100%"}, {}],
													ldapadminpasswordEditor: ["wm.Text", {"caption":"Password","captionSize":"150px","dataValue":"","defaultInsert":"none","emptyValue":"emptyString","formField":"ldapadminpassword","height":"26px","padding":"2,20,2,0","password":true,"showing":false,"width":"100%"}, {}],
													ldapbasednEditor: ["wm.Text", {"caption":"Base DN","captionSize":"150px","dataValue":"","emptyValue":"emptyString","formField":"ldapbasedn","height":"26px","helpText":"Example: if your domain is mycompany.com then your DN would be dc=mycompany,dc=com","padding":"2,20,2,0","placeHolder":"dc=mycompany,dc=com","required":true,"width":"100%"}, {}]
												}],
												ldapadminloginEditor: ["wm.Text", {"caption":"Domain","captionSize":"150px","dataValue":"","defaultInsert":"none","emptyValue":"emptyString","formField":"ldapadminlogin","height":"26px","helpText":"Example: MYCOMPANY","padding":"2,20,2,0","placeHolder":"MYCOMPANY","width":"100%"}, {}],
												spacer6: ["wm.Spacer", {"height":"20px","width":"96px"}, {}],
												panel10: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"185px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
													label5: ["wm.Label", {"border":"0,0,1,0","borderColor":"#b3b8c4","caption":"Attributes:","padding":"4","width":"100%"}, {}],
													spacer9: ["wm.Spacer", {"height":"5px","width":"96px"}, {}],
													ldapdefaultroleEditor: ["wm.SelectMenu", {"caption":"Default Role","captionSize":"150px","dataField":"name","displayField":"dataValue","formField":"ldapdefaultrole","height":"26px","padding":"2,20,2,0","required":true,"width":"100%"}, {}, {
														binding: ["wm.Binding", {}, {}, {
															wire: ["wm.Wire", {"expression":undefined,"source":"app.varRolesList","targetProperty":"dataSet"}, {}]
														}]
													}],
													ldapidentifierfieldEditor: ["wm.Text", {"caption":"Login","captionSize":"150px","dataValue":"","emptyValue":"emptyString","formField":"ldapidentifierfield","height":"26px","helpText":"Example for Active Directory: sAMAccountName","padding":"2,20,2,0","width":"100%"}, {}],
													ldapfirstnamefieldEditor: ["wm.Text", {"caption":"First name","captionSize":"150px","dataValue":"","emptyValue":"emptyString","formField":"ldapfirstnamefield","height":"26px","helpText":"Example for Active Directory: givenName","padding":"2,20,2,0","width":"100%"}, {}],
													ldaplastnamefieldEditor: ["wm.Text", {"caption":"Last name","captionSize":"150px","dataValue":"","emptyValue":"emptyString","formField":"ldaplastnamefield","height":"26px","helpText":"Example for Active Directory: sn","padding":"2,20,2,0","width":"100%"}, {}],
													ldapmailfieldEditor: ["wm.Text", {"caption":"Mail","captionSize":"150px","dataValue":"","emptyValue":"emptyString","formField":"ldapmailfield","height":"26px","helpText":"Example for Active Directory: mail","padding":"2,20,2,0","width":"100%"}, {}],
													checkUserCreationMode: ["wm.Checkbox", {"caption":"On-the-fly user creation","captionSize":"150px","dataValue":"true","displayValue":"true","height":"26px","startChecked":true,"width":"200px"}, {"onchange":"checkUserCreationModeChange"}],
													ldapCreationModeSelectEditor: ["wm.SelectMenu", {"caption":"Ldapcreationmode","captionSize":"150px","dataField":"dataValue","displayField":"name","emptyValue":"emptyString","formField":"ldapcreationmode","height":"26px","helpText":"The way to create users:<br/>- Administrator adds: only administrators can add user from the users management interface.<br/>- Auto subscription: users are automatically added with the default role when they connect for the first time.","padding":"2,20,2,0","required":true,"showing":false,"width":"100%"}, {"onchange":"ldapCreationModeSelectEditorChange"}, {
														binding: ["wm.Binding", {}, {}, {
															wire: ["wm.Wire", {"expression":undefined,"source":"varLdapCreationMode","targetProperty":"dataSet"}, {}]
														}]
													}]
												}],
												panel3: ["wm.MainContentPanel", {"border":"0","height":"40px","horizontalAlign":"right","layoutKind":"left-to-right","padding":"2,16,2,0","verticalAlign":"top","width":"100%"}, {}, {
													btnTestLdapConnection: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray","wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"caption":"Test LDAP connection","iconMargin":"0 5px 0 0","imageIndex":17,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"180px"}, {"onclick":"btnTestLdapConnectionClick"}, {
														binding: ["wm.Binding", {}, {}, {
															wire: ["wm.Wire", {"expression":undefined,"source":"authenticationLivePanel.invalid","targetProperty":"disabled"}, {}]
														}]
													}]
												}]
											}]
										}],
										panelAuthSave: ["wm.MainContentPanel", {"border":"0","height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
											btnUpdateAuthenticationMode: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray","wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"caption":" Apply","iconMargin":"","imageIndex":0,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnUpdateAuthenticationModeClick"}]
										}]
									}]
								}]
							}]
						}],
						layerSecurity: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"left","margin":"","padding":"10,10,10,0","themeStyleType":"","verticalAlign":"top"}, {}, {
							panelHostsConfig1: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"autoScroll":true,"border":"1","borderColor":"#b3b8c4","height":"95%","horizontalAlign":"left","margin":"0","padding":"20","verticalAlign":"top","width":"100%"}, {}, {
								panel15: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
									panel16: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_NoCurve"]},"border":"0","borderColor":"#999999","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
										label10: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0,0,1,0","caption":"Security","padding":"4","width":"100%"}, {}]
									}],
									panelDataCenterSecurity: ["wm.HeaderContentPanel", {"height":"140px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
										panel18: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px","wm_BorderShadow_WeakShadow"]},"border":"1","height":"120px","horizontalAlign":"left","verticalAlign":"top","width":"600px"}, {}, {
											label8: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BackgroundChromeBar_LightGray"]},"border":"0,0,1,0","borderColor":"#cdd5ef","caption":"Session Timeout:","padding":"4","width":"100%"}, {}],
											panel20: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
												panel19: ["wm.Panel", {"border":"0","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
													binding: ["wm.Binding", {}, {}, {
														wire: ["wm.Wire", {"expression":undefined,"source":"useTimeoutBox.dataValue","targetProperty":"disabled"}, {}]
													}],
													sessionTimeout: ["wm.Number", {"caption":"Logout user after","captionAlign":"left","captionSize":"110px","changeOnKey":true,"displayValue":"","maximum":1440,"minimum":1,"spinnerButtons":true,"width":"175px"}, {"onchange":"sessionTimeoutChange"}],
													text1: ["wm.Text", {"caption":"Minutes of inactivity.","captionSize":"130px","dataValue":undefined,"displayValue":"","readonly":true}, {}]
												}],
												useTimeoutBox: ["wm.Checkbox", {"caption":"<i>Sessions never expire</i>","captionAlign":"left","captionSize":"140px","dataValue":"","displayValue":"","width":"300px"}, {"onchange":"useTimeoutBoxChange"}, {
													format: ["wm.DataFormatter", {}, {}]
												}]
											}]
										}]
									}],
									panel21: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
										panel22: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px","wm_BorderShadow_WeakShadow"]},"border":"1","height":"350px","horizontalAlign":"left","verticalAlign":"top","width":"600px"}, {}, {
											label11: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BackgroundChromeBar_LightGray"]},"border":"0,0,1,0","borderColor":"#cdd5ef","caption":"Security Level:","padding":"4","width":"100%"}, {}],
											panel25: ["wm.Panel", {"border":"0","height":"80px","horizontalAlign":"left","padding":"0,20,0,20","verticalAlign":"middle","width":"100%"}, {}, {
												panel26: ["wm.Panel", {"border":"0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
													label12: ["wm.Label", {"border":"0","caption":"Low","padding":"4","width":"40px"}, {}],
													spacer10: ["wm.Spacer", {"height":"24px","width":"220px"}, {}],
													label13: ["wm.Label", {"border":"0","caption":"High","padding":"4","width":"40px"}, {}]
												}],
												sliderSecurity: ["wm.Slider", {"dataValue":"-1","discreteValues":"2","displayValue":"-1","emptyValue":"zero","maximum":1}, {"onchange":"sliderSecurityChange"}]
											}],
											panel23: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"0,20,0,20","verticalAlign":"middle","width":"100%"}, {}, {
												panel24: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
													SecurityLevelText: ["wm.LargeTextArea", {"dataValue":undefined,"displayValue":"","height":"100%","readonly":true,"width":"100%"}, {}]
												}]
											}]
										}]
									}],
									panelDataCenterSecurityApply: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
										btnApplyDataCenterSecurity: ["wm.Button", {"caption":" Apply","imageIndex":0,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnApplyDataCenterSecurityClick"}],
										btnResetSecurity: ["wm.Button", {"caption":" Reset","imageIndex":98,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnResetSecurityClick"}]
									}]
								}]
							}]
						}]
					}]
				}]
			}]
		}]
	}]
}