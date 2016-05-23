dojo.declare("openkvi", wm.Application, {
	"dialogAnimationTime": 350, 
	"disableDirtyEditorTracking": false, 
	"i18n": false, 
	"main": "Main", 
	"projectSubVersion": "0.0", 
	"projectVersion": "2", 
	"promptChromeFrame": "chromeframe.html", 
	"saveCounter": 13403, 
	"studioVersion": "6.4.6GA", 
	"theme": "blSimple01", 
	"toastPosition": "br",
	"widgets": {
		silkIconList: ["wm.ImageList", {"colCount":39,"height":16,"iconCount":90,"url":"lib/images/silkIcons/silk.png","width":16}, {}], 
		silkIconsOpenkvi: ["wm.ImageList", {"colCount":39,"height":16,"iconCount":117,"url":"resources/images/silkIcons-2/silk.png","width":16}, {}], 
		TaskDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"task"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"target"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"owner"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"node"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"started"}, {}],
			field6: ["wm.TypeDefinitionField", {"fieldName":"finished"}, {}],
			field7: ["wm.TypeDefinitionField", {"fieldName":"status"}, {}],
			field8: ["wm.TypeDefinitionField", {"fieldName":"icon"}, {}],
			field9: ["wm.TypeDefinitionField", {"fieldName":"state"}, {}],
			field10: ["wm.TypeDefinitionField", {"fieldName":"uid"}, {}]
		}], 
		VmBiosDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"arch"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"machine"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"boot","isList":true}, {}]
		}], 
		VmServerDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"server"}, {}]
		}], 
		availableNodesDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"ip"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}]
		}], 
		booDeviceDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"checked","fieldType":"Boolean"}, {}]
		}], 
		browserFileDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"owner"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"group"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"modified"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"rights"}, {}],
			field6: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}],
			field7: ["wm.TypeDefinitionField", {"fieldName":"size"}, {}],
			field8: ["wm.TypeDefinitionField", {"fieldName":"icon"}, {}]
		}], 
		consoleDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"port"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}]
		}], 
		coordinatesDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"address"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"lat"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"long"}, {}],
			field6: ["wm.TypeDefinitionField", {"fieldName":"description"}, {}],
			field7: ["wm.TypeDefinitionField", {"fieldName":"node"}, {}]
		}], 
		defSerials: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"port"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}]
		}], 
		diskDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"size"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"path"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"pci"}, {}]
		}], 
		fileInfoDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"format"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"vsize"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"rsize"}, {}]
		}], 
		graphicDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"port"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"autoport"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"keymap"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"listen"}, {}],
			field6: ["wm.TypeDefinitionField", {"fieldName":"icon"}, {}]
		}], 
		inputDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"bus"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"icon"}, {}]
		}], 
		lockTypeDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"Snapshot","fieldType":"Boolean"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"Migration","fieldType":"Boolean"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"Disabled","fieldType":"Boolean"}, {}]
		}], 
		networkDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"source"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"model"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"mac"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"option"}, {}],
			field6: ["wm.TypeDefinitionField", {"fieldName":"status"}, {}],
			field7: ["wm.TypeDefinitionField", {"fieldName":"link"}, {}],
			field8: ["wm.TypeDefinitionField", {"fieldName":"connected"}, {}],
			field9: ["wm.TypeDefinitionField", {"fieldName":"portgroup"}, {}]
		}], 
		networkInterfacesDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"target"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"portgroup"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"display"}, {}]
		}], 
		positionDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"left"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"top"}, {}]
		}], 
		severDataDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"ip"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"hypervisor"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"vmconfigs"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"storages","fieldType":"storageDef","isList":true}, {}]
		}], 
		storageActionDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"action"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"index","fieldType":"Number"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"device"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"driver"}, {}],
			field6: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field7: ["wm.TypeDefinitionField", {"fieldName":"format"}, {}],
			field8: ["wm.TypeDefinitionField", {"fieldName":"size"}, {}],
			field9: ["wm.TypeDefinitionField", {"fieldName":"allocation"}, {}],
			field10: ["wm.TypeDefinitionField", {"fieldName":"path"}, {}],
			field11: ["wm.TypeDefinitionField", {"fieldName":"bus"}, {}],
			field12: ["wm.TypeDefinitionField", {"fieldName":"busType"}, {}],
			field13: ["wm.TypeDefinitionField", {"fieldName":"cache"}, {}],
			field14: ["wm.TypeDefinitionField", {"fieldName":"oldSource"}, {}],
			field15: ["wm.TypeDefinitionField", {"fieldName":"oldBus"}, {}]
		}], 
		storageCapacityDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"available"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"size"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"used"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"info"}, {}]
		}], 
		storageDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"target"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"source"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"capacity"}, {}],
			field6: ["wm.TypeDefinitionField", {"fieldName":"allocation"}, {}],
			field7: ["wm.TypeDefinitionField", {"fieldName":"available"}, {}]
		}], 
		timezoneDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"desc"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"offset"}, {}]
		}], 
		topCpuDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {}, {}]
		}], 
		typeEtcHosts: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"ip"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"names"}, {}]
		}], 
		typeServerInfo: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"ip"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"virt"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"passwd"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"desc"}, {}]
		}], 
		virtopDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"read"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"write","fieldType":"Number"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"net_rx","fieldType":"Number"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"net_tx","fieldType":"Number"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"cpu","fieldType":"Number"}, {}],
			field6: ["wm.TypeDefinitionField", {"fieldName":"mem","fieldType":"Number"}, {}],
			field7: ["wm.TypeDefinitionField", {"fieldName":"index","fieldType":"Number"}, {}]
		}], 
		vmConfigUpdateDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"action"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"item"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"olditem"}, {}]
		}], 
		vmDiskListDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"icon"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"format"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"device"}, {}],
			field6: ["wm.TypeDefinitionField", {"fieldName":"path"}, {}],
			field7: ["wm.TypeDefinitionField", {"fieldName":"size"}, {}],
			field8: ["wm.TypeDefinitionField", {"fieldName":"used"}, {}],
			field9: ["wm.TypeDefinitionField", {"fieldName":"bus"}, {}],
			field10: ["wm.TypeDefinitionField", {"fieldName":"busType"}, {}],
			field11: ["wm.TypeDefinitionField", {"fieldName":"cache"}, {}]
		}], 
		vmState: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"id"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"state"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"add"}, {}]
		}], 
		vmTimerDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"tickpolicy"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"track"}, {}],
			field4: ["wm.TypeDefinitionField", {"fieldName":"present"}, {}],
			field5: ["wm.TypeDefinitionField", {"fieldName":"frequency"}, {}],
			field6: ["wm.TypeDefinitionField", {"fieldName":"mode"}, {}],
			field7: ["wm.TypeDefinitionField", {"fieldName":"status"}, {}]
		}], 
		vmToMigrateDef: ["wm.TypeDefinition", {}, {}, {
			field1: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			field2: ["wm.TypeDefinitionField", {"fieldName":"from"}, {}],
			field3: ["wm.TypeDefinitionField", {"fieldName":"to"}, {}]
		}], 
		NodesLiveView: ["wm.LiveView", {"dataType":"com.openkvidb.data.Nodes","related":[],"service":"openkviDB","view":[{"caption":"Id","sortable":true,"dataIndex":"id","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":2000,"subType":null,"widthUnits":"px"},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2001,"subType":null,"widthUnits":"px"},{"caption":"Ip","sortable":true,"dataIndex":"ip","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2002,"subType":null,"widthUnits":"px"},{"caption":"Hypervisor","sortable":true,"dataIndex":"hypervisor","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2003,"subType":null,"widthUnits":"px"},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2004,"subType":null,"widthUnits":"px"}]}, {}], 
		authenticationLiveView1: ["wm.LiveView", {"dataType":"com.openkvidb.data.Authentication","related":[],"service":"openkviDB","view":[{"caption":"Id","sortable":true,"dataIndex":"id","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Mode","sortable":true,"dataIndex":"mode","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Ldaphost","sortable":true,"dataIndex":"ldaphost","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Ldapport","sortable":true,"dataIndex":"ldapport","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Ldapadminlogin","sortable":true,"dataIndex":"ldapadminlogin","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"Ldapadminpassword","sortable":true,"dataIndex":"ldapadminpassword","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Ldapbasedn","sortable":true,"dataIndex":"ldapbasedn","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null},{"caption":"Ldapcreationmode","sortable":true,"dataIndex":"ldapcreationmode","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":7,"subType":null},{"caption":"Ldapdefaultrole","sortable":true,"dataIndex":"ldapdefaultrole","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8,"subType":null},{"caption":"Ldapidentifierfield","sortable":true,"dataIndex":"ldapidentifierfield","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":9,"subType":null},{"caption":"Ldapfirstnamefield","sortable":true,"dataIndex":"ldapfirstnamefield","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":10,"subType":null},{"caption":"Ldaplastnamefield","sortable":true,"dataIndex":"ldaplastnamefield","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":11,"subType":null},{"caption":"Ldapmailfield","sortable":true,"dataIndex":"ldapmailfield","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":12,"subType":null}]}, {}], 
		authenticationLiveView2: ["wm.LiveView", {"dataType":"com.openkvidb.data.Authentication","related":[],"service":"openkviDB","view":[{"caption":"Id","sortable":true,"dataIndex":"id","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":2000,"subType":null,"widthUnits":"px"},{"caption":"Mode","sortable":true,"dataIndex":"mode","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2001,"subType":null,"widthUnits":"px"},{"caption":"Ldaphost","sortable":true,"dataIndex":"ldaphost","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2002,"subType":null,"widthUnits":"px"},{"caption":"Ldapport","sortable":true,"dataIndex":"ldapport","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2003,"subType":null,"widthUnits":"px"},{"caption":"Ldapadminlogin","sortable":true,"dataIndex":"ldapadminlogin","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2004,"subType":null,"widthUnits":"px"},{"caption":"Ldapadminpassword","sortable":true,"dataIndex":"ldapadminpassword","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2005,"subType":null,"widthUnits":"px"},{"caption":"Ldapbasedn","sortable":true,"dataIndex":"ldapbasedn","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2006,"subType":null,"widthUnits":"px"},{"caption":"Ldapcreationmode","sortable":true,"dataIndex":"ldapcreationmode","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2007,"subType":null,"widthUnits":"px"},{"caption":"Ldapdefaultrole","sortable":true,"dataIndex":"ldapdefaultrole","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2008,"subType":null,"widthUnits":"px"},{"caption":"Ldapidentifierfield","sortable":true,"dataIndex":"ldapidentifierfield","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2009,"subType":null,"widthUnits":"px"},{"caption":"Ldapfirstnamefield","sortable":true,"dataIndex":"ldapfirstnamefield","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2010,"subType":null,"widthUnits":"px"},{"caption":"Ldaplastnamefield","sortable":true,"dataIndex":"ldaplastnamefield","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2011,"subType":null,"widthUnits":"px"},{"caption":"Ldapmailfield","sortable":true,"dataIndex":"ldapmailfield","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2012,"subType":null,"widthUnits":"px"}]}, {}], 
		groupsLiveView1: ["wm.LiveView", {"dataType":"com.openkvidb.data.Groups","related":[],"service":"openkviDB","view":[{"caption":"Id","sortable":true,"dataIndex":"id","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null}]}, {}], 
		usersLiveView1: ["wm.LiveView", {"dataType":"com.openkvidb.data.Users","related":[],"service":"openkviDB","view":[{"caption":"Id","sortable":true,"dataIndex":"id","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":4000,"subType":null,"widthUnits":"px"},{"caption":"Login","sortable":true,"dataIndex":"login","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":4001,"subType":null,"widthUnits":"px"},{"caption":"Password","sortable":true,"dataIndex":"password","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":4002,"subType":null,"widthUnits":"px"},{"caption":"Role","sortable":true,"dataIndex":"role","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":4003,"subType":null,"widthUnits":"px"},{"caption":"Lastname","sortable":true,"dataIndex":"lastname","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":4004},{"caption":"Firstname","sortable":true,"dataIndex":"firstname","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":4005},{"caption":"Mail","sortable":true,"dataIndex":"mail","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":4006},{"caption":"Groupid","sortable":true,"dataIndex":"groupid","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":4007}]}, {}], 
		vmsLiveView1: ["wm.LiveView", {"dataType":"com.openkvidb.data.Vms","related":[],"service":"openkviDB","view":[{"caption":"Id","sortable":true,"dataIndex":"id","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":8000,"subType":null,"widthUnits":"px"},{"caption":"Memory","sortable":true,"dataIndex":"memory","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8001,"subType":null,"widthUnits":"px"},{"caption":"Nbcpu","sortable":true,"dataIndex":"nbcpu","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8002,"subType":null,"widthUnits":"px"},{"caption":"Freqcpu","sortable":true,"dataIndex":"freqcpu","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8003,"subType":null,"widthUnits":"px"},{"caption":"Arch","sortable":true,"dataIndex":"arch","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8004,"subType":null,"widthUnits":"px"},{"caption":"Network","sortable":true,"dataIndex":"network","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8005,"subType":null,"widthUnits":"px"},{"caption":"Cdrom","sortable":true,"dataIndex":"cdrom","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8006,"subType":null,"widthUnits":"px"},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":8007,"subType":null,"widthUnits":"px"},{"caption":"Server","sortable":true,"dataIndex":"server","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":8008,"subType":null,"widthUnits":"px"},{"caption":"Disks","sortable":true,"dataIndex":"disks","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8009,"subType":null,"widthUnits":"px"},{"caption":"Displayedname","sortable":true,"dataIndex":"displayedname","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":8010,"subType":null,"widthUnits":"px"}]}, {}], 
		getLoggedUserName: ["wm.ServiceVariable", {"autoUpdate":true,"operation":"getUserName","service":"securityService","startUpdate":true}, {}, {
			input: ["wm.ServiceInput", {"type":"getUserNameInputs"}, {}]
		}], 
		getLoggedUserRole: ["wm.ServiceVariable", {"autoUpdate":true,"operation":"getUserRoles","service":"securityService","startUpdate":true}, {}, {
			input: ["wm.ServiceInput", {"type":"getUserRolesInputs"}, {}]
		}], 
		varRolesList: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"Administrator\",\"dataValue\":\"Administrator\"},{\"name\":\"PowerUser\",\"dataValue\":\"PowerUser\"},{\"name\":\"User\",\"dataValue\":\"User\"}]","type":"EntryData"}, {}]
	},
	_end: 0
});

openkvi.extend({


  _end: 0
});