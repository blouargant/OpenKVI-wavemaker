Main.widgets = {
	templateUsernameVar: ["wm.ServiceVariable", {"autoUpdate":true,"operation":"getUserName","service":"securityService","startUpdate":true}, {"onSuccess":"templateUsernameVarSuccess"}, {
		input: ["wm.ServiceInput", {"type":"getUserNameInputs"}, {}]
	}],
	templateLogoutVar: ["wm.LogoutVariable", {}, {"onBeforeUpdate":"templateLogoutVarBeforeUpdate"}, {
		input: ["wm.ServiceInput", {"type":"logoutInputs"}, {}]
	}],
	tableserversLiveVariable1: ["wm.LiveVariable", {"autoUpdate":false,"liveSource":"app.NodesLiveView","matchMode":"exact","maxResults":1000,"orderBy":"asc:name","startUpdate":false}, {"onSuccess":"tableserversLiveVariable1Success"}],
	varHypervisors: ["wm.Variable", {"type":"EntryData"}, {}],
	varServersCreated: ["wm.Variable", {}, {}],
	tablevmsLiveVariable2: ["wm.LiveVariable", {"autoUpdate":false,"liveSource":"app.vmsLiveView1","matchMode":"exact","orderBy":"asc:name","startUpdate":false}, {"onResult":"tablevmsLiveVariable2Result"}],
	imageList1: ["wm.ImageList", {"colCount":10,"height":16,"iconCount":10,"url":"resources/images/list","width":16}, {}],
	varVMsCreated: ["wm.Variable", {}, {}],
	varServersDbLoaded: ["wm.Variable", {}, {}],
	varSelectedItem: ["wm.Variable", {"type":"EntryData"}, {}],
	vmList: ["wm.Variable", {"isList":true,"type":"EntryData"}, {"onSetData":"vmListSetData"}],
	varSelectedServer: ["wm.Variable", {"type":"StringData"}, {}],
	varVmToDelete: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
	varVmPerServer: ["wm.Variable", {"type":"com.VirtDB.data.TableVMs"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":false,"source":"vmDbHandle","targetProperty":"dataSet"}, {}]
		}]
	}],
	delVMbyServer: ["wm.ServiceVariable", {"operation":"deleteVmsFromNode","service":"openkviDB"}, {"onResult":"delVMbyServerResult"}, {
		input: ["wm.ServiceInput", {"type":"deleteVmsFromNodeInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":false,"source":"serverToDelete.dataValue","targetProperty":"selectedServer"}, {}]
			}]
		}]
	}],
	serverToDelete: ["wm.Variable", {"type":"EntryData"}, {}],
	varArch: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
	varNewVmCaller: ["wm.Variable", {}, {}],
	varFileType: ["wm.Variable", {"isList":true,"json":"[{name: 'QCOW2 (full featured)',\ndataValue: 'qcow2'},\n{name: 'RAW (fastest)',\ndataValue: 'raw'}, \n{name: 'VMDK (vmware)',\ndataValue: 'vmdk'}, \n{name: 'CLOOP (Live CDs)',\ndataValue: 'cloop'}]","type":"EntryData"}, {}],
	varFreePCI: ["wm.Variable", {"isList":true,"json":"[{name: '0:0',\ndataValue: '0:0'}, \n{name: '0:1',\ndataValue: '0:1'}, \n{name: '0:2',\ndataValue: '0:2'}, \n{name: '1:0',\ndataValue: '1:0'}, \n{name: '1:1',\ndataValue: '1:1'}, \n{name: '1:2',\ndataValue: '1:2'}]","type":"EntryData"}, {}],
	varVmDisk: ["wm.Variable", {"isList":true}, {}],
	varSelectedVm: ["wm.Variable", {"type":"StringData"}, {}],
	varDefaultDiskSize: ["wm.Variable", {}, {}],
	varDefaultDiskPath: ["wm.Variable", {"type":"EntryData"}, {}],
	varInitGrid: ["wm.Variable", {"isList":true,"type":"diskDef"}, {}],
	varDiskCaller: ["wm.Variable", {"type":"StringData"}, {}],
	varNetworkInput: ["wm.Variable", {"isList":true,"json":"[]","type":"networkDef"}, {}],
	varNetworkCaller: ["wm.Variable", {}, {}],
	varNetworkDevices: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"VirtIO (paravirt)\",\"dataValue\":\"virtio\"},{\"name\":\"pcnet32 (general)\",\"dataValue\":\"pcnet\"},{\"name\":\"e1000\",\"dataValue\":\"e1000\"},{\"name\":\"rtl8139\",\"dataValue\":\"rtl8139\"}]","type":"EntryData"}, {}],
	varVmBios: ["wm.Variable", {"isList":true,"type":"VmBiosDef"}, {}],
	javaCreateDir: ["wm.ServiceVariable", {"operation":"createDirectory","service":"javaTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"createDirectoryInputs"}, {}]
	}],
	javaDeleteDir: ["wm.ServiceVariable", {"operation":"deleteDirectory","service":"javaTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"deleteDirectoryInputs"}, {}]
	}],
	varDefaultVmConfigPath: ["wm.Variable", {}, {}],
	javaDeleteVmData: ["wm.ServiceVariable", {"operation":"deleteVmLocalFiles","service":"javaTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"deleteVmLocalFilesInputs"}, {}]
	}],
	varServerInfo: ["wm.Variable", {"type":"typeServerInfo"}, {}],
	clearServerInfo: ["wm.Variable", {}, {}],
	javaMakeServerConfig: ["wm.ServiceVariable", {"operation":"createServerConfig","service":"serverTools"}, {"onResult":"javaMakeServerConfigResult"}, {
		input: ["wm.ServiceInput", {"type":"createServerConfigInputs"}, {}]
	}],
	javaDeleteServer: ["wm.ServiceVariable", {"operation":"deleteServer","service":"serverTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"deleteServerInputs"}, {}]
	}],
	varServerList: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
	javaCreateVM: ["wm.ServiceVariable", {"operation":"createVm","service":"vmTools"}, {"onResult":"javaCreateVMResult"}, {
		input: ["wm.ServiceInput", {"type":"createVmInputs"}, {}]
	}],
	varServerXmlData: ["wm.Variable", {"type":"severDataDef"}, {}],
	javaServerReadXml: ["wm.ServiceVariable", {"operation":"readXml","service":"serverTools"}, {"onSuccess":"javaServerReadXmlSuccess"}, {
		input: ["wm.ServiceInput", {"type":"readXmlInputs"}, {}]
	}],
	serverInfoLiveVar: ["wm.LiveVariable", {"autoUpdate":false,"liveSource":"com.openkvidb.data.Nodes","matchMode":"exact","startUpdate":false}, {"onResult":"serverInfoLiveVarResult"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":false,"source":"serverToDelete.dataValue","targetProperty":"filter.name"}, {}]
		}]
	}],
	javaGetVmInfo: ["wm.ServiceVariable", {"operation":"getVmConfig","service":"vmTools"}, {"onResult":"javaGetVmInfoResult"}, {
		input: ["wm.ServiceInput", {"type":"getVmConfigInputs"}, {}]
	}],
	javaUndefineVm: ["wm.ServiceVariable", {"operation":"undefineVm","service":"vmTools"}, {"onResult":"javaUndefineVmResult"}, {
		input: ["wm.ServiceInput", {"type":"undefineVmInputs"}, {}]
	}],
	vmDeleteLiveVar: ["wm.LiveVariable", {"autoUpdate":false,"liveSource":"com.openkvidb.data.Vms","matchMode":"exact","startUpdate":false}, {"onResult":"vmDeleteLiveVarResult"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":false,"source":"varSelectedVm.dataValue","targetProperty":"filter.name"}, {}]
		}]
	}],
	javaStartVm: ["wm.ServiceVariable", {"operation":"startVm","service":"vmTools"}, {"onResult":"javaStartVmResult"}, {
		input: ["wm.ServiceInput", {"type":"startVmInputs"}, {}]
	}],
	javaGetVmDisplay: ["wm.ServiceVariable", {"operation":"getVmDisplay","service":"vmTools"}, {"onResult":"javaGetVmDisplayResult"}, {
		input: ["wm.ServiceInput", {"type":"getVmDisplayInputs"}, {}]
	}],
	javaGetVmStatus: ["wm.ServiceVariable", {"operation":"getVmStatus","service":"vmTools"}, {"onResult":"javaGetVmStatusResult"}, {
		input: ["wm.ServiceInput", {"type":"getVmStatusInputs"}, {}]
	}],
	varIsoDirectory: ["wm.Variable", {}, {}],
	vmListByServerLive: ["wm.LiveVariable", {"autoUpdate":false,"liveSource":"com.openkvidb.data.Vms","matchMode":"exact","orderBy":"asc:name","startUpdate":false}, {"onResult":"vmListByServerLiveResult"}],
	varTaskLog: ["wm.Variable", {"isList":true,"type":"TaskDef"}, {}],
	varRepositoryType: ["wm.Variable", {"isList":true,"json":"[{name: 'local',\ndataValue: 'local'}, \n{name: 'NFS',\ndataValue: 'nfs'}]","type":"EntryData"}, {}],
	varVmState: ["wm.Variable", {"isList":true,"type":"vmState"}, {}],
	javaImportVmConfig: ["wm.ServiceVariable", {"operation":"ImportVmConfig","service":"vmTools"}, {"onSuccess":"javaImportVmConfigSuccess"}, {
		input: ["wm.ServiceInput", {"type":"ImportVmConfigInputs"}, {}]
	}],
	varVmsToImport: ["wm.Variable", {}, {}],
	listAllServersLiveVar: ["wm.LiveVariable", {"autoUpdate":false,"liveSource":"com.openkvidb.data.Nodes","matchMode":"exact","orderBy":"asc:name","startUpdate":false}, {"onResult":"listAllServersLiveVarResult"}],
	varVmDbInsert: ["wm.Variable", {"type":"com.VirtDB.data.TableVMs"}, {}],
	varLoadVMDB: ["wm.Variable", {}, {}],
	varVmToInsert: ["wm.Variable", {"type":"VmServerDef"}, {}],
	varSelectedVmConfig: ["wm.Variable", {}, {}],
	varBootList: ["wm.Variable", {"isList":true,"json":"[{'name':'network', \n'checked':false}, \n{'name':'cdrom', \n'checked':false}, \n{'name':'hd', \n'checked':false}] \n","type":"booDeviceDef"}, {}],
	javaGetHelp: ["wm.ServiceVariable", {"operation":"getHelpFile","service":"javaTools"}, {"onResult":"javaGetHelpResult"}, {
		input: ["wm.ServiceInput", {"type":"getHelpFileInputs"}, {}]
	}],
	varLifecycle: ["wm.Variable", {"isList":true,"json":"[{name: \"destroy\",\ndataValue: \"destroy\"}, {name: \"restart\",\ndataValue: \"restart\"}, {name: \"preserve\",\ndataValue: \"preserve\"}, {name: \"rename-restart\",\ndataValue: \"rename-restart\"}]","type":"EntryData"}, {}],
	varLifecycleCrash: ["wm.Variable", {"isList":true,"json":"[{name: \"destroy\",\ndataValue: \"destroy\"}, {name: \"restart\",\ndataValue: \"restart\"}, {name: \"preserve\",\ndataValue: \"preserve\"}, {name: \"rename-restart\",\ndataValue: \"rename-restart\"}, \n{name: \"coredump-destroy\",\ndataValue: \"coredump-destroy\"}, {name: \"coredump-restart\",\ndataValue: \"coredump-restart\"}]","type":"EntryData"}, {}],
	varFeatureList: ["wm.Variable", {"isList":true,"type":"booDeviceDef"}, {}],
	varGraphicList: ["wm.Variable", {"isList":true,"type":"graphicDef"}, {}],
	varVideoCards: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"cirrus\",\"dataValue\":\"cirrus\"},{\"name\":\"vga\",\"dataValue\":\"vga\"},{\"name\":\"vmvga\",\"dataValue\":\"vmcga\"},{\"name\":\"xen\",\"dataValue\":\"xen\"},{\"name\":\"vbox\",\"dataValue\":\"vbox\"},{\"name\":\"qxl\",\"dataValue\":\"qxl\"}]","type":"EntryData"}, {}],
	varVmDiskList: ["wm.Variable", {"isList":true,"type":"vmDiskListDef"}, {}],
	varVmInputList: ["wm.Variable", {"isList":true,"type":"inputDef"}, {}],
	varVmSerialList: ["wm.Variable", {"isList":true,"type":"defSerials"}, {}],
	varVmConsoleList: ["wm.Variable", {"isList":true,"type":"consoleDef"}, {}],
	javaUpdateVmMemory: ["wm.ServiceVariable", {"operation":"updateVmMemory","service":"vmXmlFile"}, {"onResult":"onJavaUpdateVmConfigResult"}, {
		input: ["wm.ServiceInput", {"type":"updateVmMemoryInputs"}, {}]
	}],
	javaUpdateVmProcessor: ["wm.ServiceVariable", {"operation":"updateVmProcessor","service":"vmXmlFile"}, {"onResult":"onJavaUpdateVmConfigResult"}, {
		input: ["wm.ServiceInput", {"type":"updateVmProcessorInputs"}, {}]
	}],
	javaUpdateVmBios: ["wm.ServiceVariable", {"operation":"updateVmBios","service":"vmXmlFile"}, {"onResult":"onJavaUpdateVmConfigResult"}, {
		input: ["wm.ServiceInput", {"type":"updateVmBiosInputs"}, {}]
	}],
	varStorageType: ["wm.Variable", {"isList":true,"json":"[{name:\"disk\", dataValue:\"disk\"}, {name:\"cdrom\", dataValue:\"cdrom\"}]","type":"EntryData"}, {}],
	varBrowserFileList: ["wm.Variable", {"isList":true,"type":"browserFileDef"}, {}],
	javaListRemoteDirectory: ["wm.ServiceVariable", {"operation":"listDirectory","service":"serverTools"}, {"onResult":"javaListRemoteDirectoryResult"}, {
		input: ["wm.ServiceInput", {"type":"listDirectoryInputs"}, {}]
	}],
	javaGetFileInfo: ["wm.ServiceVariable", {"operation":"getFileInfo","service":"serverTools"}, {"onResult":"javaGetFileInfoResult"}, {
		input: ["wm.ServiceInput", {"type":"getFileInfoInputs"}, {}]
	}],
	varBrowserCaller: ["wm.Variable", {"type":"EntryData"}, {}],
	javaUpdateServerConfig: ["wm.ServiceVariable", {"operation":"updateServerConfig","service":"serverTools"}, {"onResult":"javaUpdateServerConfigResult"}, {
		input: ["wm.ServiceInput", {"type":"updateServerConfigInputs"}, {}]
	}],
	varCurrentUser: ["wm.Variable", {"type":"StringData"}, {}],
	varVmStorageActions: ["wm.Variable", {"isList":true,"json":"[]","type":"storageActionDef"}, {}],
	varBusTypeList: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"ide\",\"dataValue\":\"ide\"},{\"name\":\"virtio\",\"dataValue\":\"virtio\"}]","type":"EntryData"}, {}],
	varDefaultInputFile: ["wm.Variable", {}, {}],
	varDefaultOutputFile: ["wm.Variable", {}, {}],
	javaSendCommand: ["wm.ServiceVariable", {"operation":"sendCommand","service":"vmTools"}, {"onResult":"javaSendCommandResult"}, {
		input: ["wm.ServiceInput", {"type":"sendCommandInputs"}, {}]
	}],
	javaGetLocalHostname: ["wm.ServiceVariable", {"operation":"getLocalHostname","service":"serverTools"}, {"onResult":"javaGetLocalHostnameResult"}, {
		input: ["wm.ServiceInput", {"type":"getLocalHostnameInputs"}, {}]
	}],
	varCenterHostname: ["wm.Variable", {"type":"StringData"}, {}],
	varBusList: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
	varFileInfo: ["wm.Variable", {"type":"fileInfoDef"}, {}],
	javaUpdateVmStorages: ["wm.ServiceVariable", {"operation":"updateVmStorages","service":"vmXmlFile"}, {"onResult":"onJavaUpdateVmConfigResult"}, {
		input: ["wm.ServiceInput", {"type":"updateVmStoragesInputs"}, {}]
	}],
	javaGetVmScreenShot: ["wm.ServiceVariable", {"operation":"getScreenshot","service":"vmTools"}, {"onResult":"javaGetVmScreenShotResult"}, {
		input: ["wm.ServiceInput", {"type":"getScreenshotInputs"}, {}]
	}],
	varCdromBus: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"ide\",\"dataValue\":\"hdb\"},{\"name\":\"virtio\",\"dataValue\":\"vdb\"}]","type":"EntryData"}, {}],
	varDiskBus: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"virtio\",\"dataValue\":\"vda\"},{\"name\":\"ide\",\"dataValue\":\"hda\"}]","type":"EntryData"}, {}],
	varDiskCache: ["wm.Variable", {"isList":true,"json":"[\n\t{\n\t\t\"name\": \"none\", \n\t\t\"dataValue\": \"none\"\n\t}, \n\t{\n\t\t\"name\": \"writethrough\", \n\t\t\"dataValue\": \"writethrough\"\n\t}, \n\t{\n\t\t\"name\": \"writeback\", \n\t\t\"dataValue\": \"writeback\"\n\t}, \n\t{\n\t\t\"name\": \"default\", \n\t\t\"dataValue\": \"default\"\n\t}\n]","type":"EntryData"}, {}],
	varStorages: ["wm.Variable", {"isList":true,"json":"[]","type":"storageDef"}, {}],
	varNetworkDeviceType: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"OpenVswitch\",\"dataValue\":\"openvswitch\"},{\"name\":\"SR-IOV Passthrough\",\"dataValue\":\"sriov\"},{\"name\":\"Private Bridge\",\"dataValue\":\"private\"}]","type":"EntryData"}, {}],
	varNetworkInterfaces: ["wm.Variable", {"isList":true,"json":"[]","type":"networkInterfacesDef"}, {}],
	varMousePosition: ["wm.Variable", {"type":"positionDef"}, {}],
	varPreviousNetworkInterface: ["wm.Variable", {"json":"{\"name\":\"none\",\"dataValue\":\"none\"}","type":"EntryData"}, {}],
	javaUpdateVmNetworks: ["wm.ServiceVariable", {"operation":"updateVmNetworks","service":"vmXmlFile"}, {"onResult":"onJavaUpdateVmConfigResult"}, {
		input: ["wm.ServiceInput", {"type":"updateVmNetworksInputs"}, {}]
	}],
	varKeymaps: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
	varGraphicTypes: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"VNC\",\"dataValue\":\"vnc\"},{\"name\":\"SDL\",\"dataValue\":\"sdl\"}]","type":"EntryData"}, {}],
	varVmConfigUpdate: ["wm.Variable", {"isList":true,"json":"[]","type":"vmConfigUpdateDef"}, {}],
	javaUpdateVmVideo: ["wm.ServiceVariable", {"operation":"updateVmVideo","service":"vmXmlFile"}, {"onResult":"onJavaUpdateVmConfigResult"}, {
		input: ["wm.ServiceInput", {"type":"updateVmVideoInputs"}, {}]
	}],
	javaNotifyAll: ["wm.ServiceVariable", {"operation":"notifyAll","service":"serverTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"notifyAllInputs"}, {}]
	}],
	varImportedVms: ["wm.Variable", {"isList":true,"type":"VmServerDef"}, {}],
	javaVmVirtop: ["wm.ServiceVariable", {"operation":"virtop","service":"vmTools"}, {"onResult":"javaVmVirtopResult"}, {
		input: ["wm.ServiceInput", {"type":"virtopInputs"}, {}]
	}],
	varVmTop: ["wm.Variable", {"isList":true,"json":"[{\"read\":\"20\",\"write\":\"20\",\"net_rx\":\"9000\",\"net_tx\":\"1000\",\"cpu\":\"10\",\"mem\":\"10\",\"index\":\"0\"},{\"read\":\"50\",\"write\":\"100\",\"net_rx\":\"3000\",\"net_tx\":\"2000\",\"cpu\":\"50\",\"mem\":\"70\",\"index\":\"3\"},{\"read\":\"10\",\"write\":\"20\",\"net_rx\":\"5000\",\"net_tx\":\"10000\",\"cpu\":\"10\",\"mem\":\"2\",\"index\":\"3\"},{\"read\":\"90\",\"write\":\"100\",\"net_rx\":\"500\",\"net_tx\":\"1500\",\"cpu\":\"10\",\"mem\":\"15\",\"index\":\"6\"}]","type":"virtopDef"}, {}],
	varNodeCpuTop: ["wm.Variable", {"isList":true}, {}],
	varVmToUpdate: ["wm.Variable", {"type":"com.openkvidb.data.Vms"}, {}],
	vmMigrateLiveVar: ["wm.LiveVariable", {"autoUpdate":false,"liveSource":"com.openkvidb.data.Vms","matchMode":"exact","startUpdate":false}, {"onResult":"vmMigrateLiveVarResult"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"varVmToUpdate.name","targetProperty":"filter.name"}, {}]
		}],
		varVmToUpdate: ["wm.Variable", {"type":"com.openkvidb.data.Vms"}, {}]
	}],
	javaMigrateVm: ["wm.ServiceVariable", {"operation":"migrateVm","service":"vmTools"}, {"onResult":"javaMigrateVmResult"}, {
		input: ["wm.ServiceInput", {"type":"migrateVmInputs"}, {}]
	}],
	javaTimeout: ["wm.ServiceVariable", {"operation":"timeout","service":"javaTools"}, {"onResult":"javaTimeoutResult"}, {
		input: ["wm.ServiceInput", {"type":"timeoutInputs"}, {}]
	}],
	varGmap: ["wm.Variable", {"isList":true,"json":"[{\"building\":\"8\",\"street\":\"Commodore Allet\",\"city\":\"Caen\",\"lat\":\"49.201050\",\"long\":\"-0.391300\",\"description\":\"HS22 C, Rack noir\",\"node\":\"kvm-test\"}]","type":"coordinatesDef"}, {}],
	javaGetNodesCoordinates: ["wm.ServiceVariable", {"operation":"getNodesCoordinates","service":"serverTools"}, {"onResult":"javaGetNodesCoordinatesResult"}, {
		input: ["wm.ServiceInput", {"type":"getNodesCoordinatesInputs"}, {}]
	}],
	javaGetVmListStatus: ["wm.ServiceVariable", {"operation":"getVmListStatus","service":"vmTools"}, {"onResult":"javaGetVmListStatusResult"}, {
		input: ["wm.ServiceInput", {"type":"getVmListStatusInputs"}, {}]
	}],
	javaGetVmExtendedInfos: ["wm.ServiceVariable", {"operation":"getVmExtendedConfig","service":"vmTools"}, {"onResult":"javaGetVmExtendedInfosResult"}, {
		input: ["wm.ServiceInput", {"type":"getVmExtendedConfigInputs"}, {}]
	}],
	javaSleep: ["wm.ServiceVariable", {"operation":"sleep","service":"javaTools"}, {"onResult":"javaSleepResult"}, {
		input: ["wm.ServiceInput", {"type":"sleepInputs"}, {}]
	}],
	javaGetVmIp: ["wm.ServiceVariable", {"operation":"getVmIp","service":"serverTools"}, {"onResult":"javaGetVmIpResult"}, {
		input: ["wm.ServiceInput", {"type":"getVmIpInputs"}, {}]
	}],
	javaGetVmExtra: ["wm.ServiceVariable", {"operation":"readVmExtra","service":"vmTools"}, {"onResult":"javaGetVmExtraResult"}, {
		input: ["wm.ServiceInput", {"type":"readVmExtraInputs"}, {}]
	}],
	javaWriteVmExtra: ["wm.ServiceVariable", {"operation":"updateVmExtra","service":"vmXmlFile"}, {"onResult":"javaWriteVmExtraResult"}, {
		input: ["wm.ServiceInput", {"type":"updateVmExtraInputs"}, {}]
	}],
	javaGetRunningOs: ["wm.ServiceVariable", {"operation":"getRunningOs","service":"serverTools"}, {"onResult":"javaGetRunningOsResult"}, {
		input: ["wm.ServiceInput", {"type":"getRunningOsInputs"}, {}]
	}],
	varVmDeleteOrRemove: ["wm.Variable", {"type":"StringData"}, {}],
	varInputTypes: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"Mouse\",\"dataValue\":\"mouse\"},{\"name\":\"Tablet\",\"dataValue\":\"tablet\"}]","type":"EntryData"}, {}],
	varInputBuses: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"PS2\",\"dataValue\":\"ps2\"},{\"name\":\"USB\",\"dataValue\":\"usb\"}]","type":"EntryData"}, {}],
	javaUpdateVmInput: ["wm.ServiceVariable", {"operation":"updateVmInput","service":"vmXmlFile"}, {"onResult":"onJavaUpdateVmConfigResult"}, {
		input: ["wm.ServiceInput", {"type":"updateVmInputInputs"}, {}]
	}],
	javaProbeNeighborhood: ["wm.ServiceVariable", {"operation":"probeNeighborhood","service":"serverTools"}, {"onResult":"javaProbeNeighborhoodResult"}, {
		input: ["wm.ServiceInput", {"type":"probeNeighborhoodInputs"}, {}]
	}],
	varAvailableNodes: ["wm.Variable", {"isList":true,"type":"availableNodesDef"}, {}],
	varHostNetworkDevices: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
	javaSnapshotsGetList: ["wm.ServiceVariable", {"operation":"getSnapshotList","service":"snapshotTools"}, {"onResult":"javaSnapshotsGetListResult"}, {
		input: ["wm.ServiceInput", {"type":"getSnapshotListInputs"}, {}]
	}],
	javaSnapshotCreate: ["wm.ServiceVariable", {"operation":"createSnapshot","service":"snapshotTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"createSnapshotInputs"}, {}]
	}],
	javaSnapshotsMergeToParent: ["wm.ServiceVariable", {"operation":"mergeToParent","service":"snapshotTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"mergeToParentInputs"}, {}]
	}],
	javaSnapshotsMergeToChildren: ["wm.ServiceVariable", {"operation":"mergeToChildren","service":"snapshotTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"mergeToChildrenInputs"}, {}]
	}],
	varSelectedSnapshot: ["wm.Variable", {"type":"StringData"}, {}],
	varSelectedSnapshotParent: ["wm.Variable", {"type":"StringData"}, {}],
	varVmToMigrate: ["wm.Variable", {"type":"vmToMigrateDef"}, {}],
	javaMonitorInputString: ["wm.ServiceVariable", {"operation":"monitorInputString","service":"javaTools"}, {"onResult":"javaMonitorInputStringResult"}, {
		input: ["wm.ServiceInput", {"type":"monitorInputStringInputs"}, {}]
	}],
	varClientId: ["wm.Variable", {"type":"StringData"}, {}],
	stopMonitoring: ["wm.ServiceVariable", {"operation":"stopMonitoring","service":"javaTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"stopMonitoringInputs"}, {}]
	}],
	vmLiveVar: ["wm.LiveVariable", {"autoUpdate":false,"liveSource":"com.openkvidb.data.Vms","matchMode":"exact","startUpdate":false}, {"onResult":"vmLiveVarResult"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"varSelectedVm.dataValue","targetProperty":"filter.name"}, {}],
			wire1: ["wm.Wire", {"expression":undefined,"source":"varSelectedServer.dataValue","targetProperty":"filter.server"}, {}]
		}]
	}],
	varCpuModels: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"default\",\"dataValue\":\"default\"},{\"name\":\"host-model\",\"dataValue\":\"host-model\"},{\"name\":\"host-passthrough\",\"dataValue\":\"host-passthrough\"}]","type":"EntryData"}, {}],
	nodemanagerListener: ["wm.ServiceVariable", {"operation":"nodemanagerListener","service":"javaTools"}, {"onResult":"nodemanagerListenerResult"}, {
		input: ["wm.ServiceInput", {"type":"nodemanagerListenerInputs"}, {}]
	}],
	navShowConfigPage: ["wm.NavigationCall", {"operation":"gotoPage"}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoPageInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":"\"OpenkviConfigPage\"","targetProperty":"pageName"}, {}]
			}]
		}]
	}],
	varStorageCapacity: ["wm.Variable", {"isList":true,"type":"storageCapacityDef"}, {}],
	javaNodeCreateNetwork: ["wm.ServiceVariable", {"operation":"createNetwork","service":"serverTools"}, {"onResult":"javaNodeCreateNetworkResult"}, {
		input: ["wm.ServiceInput", {"type":"createNetworkInputs"}, {}]
	}],
	javaNodeUpdateNetwork: ["wm.ServiceVariable", {"operation":"updateNetwork","service":"serverTools"}, {"onResult":"javaNodeUpdateNetworkResult"}, {
		input: ["wm.ServiceInput", {"type":"updateNetworkInputs"}, {}]
	}],
	javaNodeRemoveNetwork: ["wm.ServiceVariable", {"operation":"removeNetwork","service":"serverTools"}, {"onResult":"javaNodeRemoveNetworkResult"}, {
		input: ["wm.ServiceInput", {"type":"removeNetworkInputs"}, {}]
	}],
	varNetworkTargets: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
	javaSnapshotsRevert: ["wm.ServiceVariable", {"operation":"revert","service":"snapshotTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"revertInputs"}, {}]
	}],
	javaSnapshotsRollback: ["wm.ServiceVariable", {"operation":"rollback","service":"snapshotTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"rollbackInputs"}, {}]
	}],
	varSnapshotList: ["wm.Variable", {"isList":true,"json":"[]","type":"StringData"}, {}],
	varClockOffset: ["wm.Variable", {"isList":true,"json":"[\n\t{\n        \"name\": \"UTC\",\n\t\t\"dataValue\": \"utc\"\n\t}, \n\t{\n        \"name\": \"Host Time\",\n\t\t\"dataValue\": \"localtime\"\n\t}, \n\t{\n        \"name\": \"Timezone\",\n\t\t\"dataValue\": \"timezone\"\n\t}\n]","type":"EntryData"}, {}],
	varTimezones: ["wm.Variable", {"isList":true,"json":"[{\"dataValue\":\"Africa/Abidjan\"},\n{\"dataValue\":\"Africa/Accra\"},\n{\"dataValue\":\"Africa/Addis_Ababa\"},\n{\"dataValue\":\"Africa/Algiers\"},\n{\"dataValue\":\"Africa/Asmara\"},\n{\"dataValue\":\"Africa/Asmera\"},\n{\"dataValue\":\"Africa/Bamako\"},\n{\"dataValue\":\"Africa/Bangui\"},\n{\"dataValue\":\"Africa/Banjul\"},\n{\"dataValue\":\"Africa/Bissau\"},\n{\"dataValue\":\"Africa/Blantyre\"},\n{\"dataValue\":\"Africa/Brazzaville\"},\n{\"dataValue\":\"Africa/Bujumbura\"},\n{\"dataValue\":\"Africa/Cairo\"},\n{\"dataValue\":\"Africa/Casablanca\"},\n{\"dataValue\":\"Africa/Ceuta\"},\n{\"dataValue\":\"Africa/Conakry\"},\n{\"dataValue\":\"Africa/Dakar\"},\n{\"dataValue\":\"Africa/Dar_es_Salaam\"},\n{\"dataValue\":\"Africa/Djibouti\"},\n{\"dataValue\":\"Africa/Douala\"},\n{\"dataValue\":\"Africa/El_Aaiun\"},\n{\"dataValue\":\"Africa/Freetown\"},\n{\"dataValue\":\"Africa/Gaborone\"},\n{\"dataValue\":\"Africa/Harare\"},\n{\"dataValue\":\"Africa/Johannesburg\"},\n{\"dataValue\":\"Africa/Juba\"},\n{\"dataValue\":\"Africa/Kampala\"},\n{\"dataValue\":\"Africa/Khartoum\"},\n{\"dataValue\":\"Africa/Kigali\"},\n{\"dataValue\":\"Africa/Kinshasa\"},\n{\"dataValue\":\"Africa/Lagos\"},\n{\"dataValue\":\"Africa/Libreville\"},\n{\"dataValue\":\"Africa/Lome\"},\n{\"dataValue\":\"Africa/Luanda\"},\n{\"dataValue\":\"Africa/Lubumbashi\"},\n{\"dataValue\":\"Africa/Lusaka\"},\n{\"dataValue\":\"Africa/Malabo\"},\n{\"dataValue\":\"Africa/Maputo\"},\n{\"dataValue\":\"Africa/Maseru\"},\n{\"dataValue\":\"Africa/Mbabane\"},\n{\"dataValue\":\"Africa/Mogadishu\"},\n{\"dataValue\":\"Africa/Monrovia\"},\n{\"dataValue\":\"Africa/Nairobi\"},\n{\"dataValue\":\"Africa/Ndjamena\"},\n{\"dataValue\":\"Africa/Niamey\"},\n{\"dataValue\":\"Africa/Nouakchott\"},\n{\"dataValue\":\"Africa/Ouagadougou\"},\n{\"dataValue\":\"Africa/Porto-Novo\"},\n{\"dataValue\":\"Africa/Sao_Tome\"},\n{\"dataValue\":\"Africa/Timbuktu\"},\n{\"dataValue\":\"Africa/Tripoli\"},\n{\"dataValue\":\"Africa/Tunis\"},\n{\"dataValue\":\"Africa/Windhoek\"},\n{\"dataValue\":\"AKST9AKDT\"},\n{\"dataValue\":\"America/Adak\"},\n{\"dataValue\":\"America/Anchorage\"},\n{\"dataValue\":\"America/Anguilla\"},\n{\"dataValue\":\"America/Antigua\"},\n{\"dataValue\":\"America/Araguaina\"},\n{\"dataValue\":\"America/Argentina/Buenos_Aires\"},\n{\"dataValue\":\"America/Argentina/Catamarca\"},\n{\"dataValue\":\"America/Argentina/ComodRivadavia\"},\n{\"dataValue\":\"America/Argentina/Cordoba\"},\n{\"dataValue\":\"America/Argentina/Jujuy\"},\n{\"dataValue\":\"America/Argentina/La_Rioja\"},\n{\"dataValue\":\"America/Argentina/Mendoza\"},\n{\"dataValue\":\"America/Argentina/Rio_Gallegos\"},\n{\"dataValue\":\"America/Argentina/Salta\"},\n{\"dataValue\":\"America/Argentina/San_Juan\"},\n{\"dataValue\":\"America/Argentina/San_Luis\"},\n{\"dataValue\":\"America/Argentina/Tucuman\"},\n{\"dataValue\":\"America/Argentina/Ushuaia\"},\n{\"dataValue\":\"America/Aruba\"},\n{\"dataValue\":\"America/Asuncion\"},\n{\"dataValue\":\"America/Atikokan\"},\n{\"dataValue\":\"America/Atka\"},\n{\"dataValue\":\"America/Bahia\"},\n{\"dataValue\":\"America/Bahia_Banderas\"},\n{\"dataValue\":\"America/Barbados\"},\n{\"dataValue\":\"America/Belem\"},\n{\"dataValue\":\"America/Belize\"},\n{\"dataValue\":\"America/Blanc-Sablon\"},\n{\"dataValue\":\"America/Boa_Vista\"},\n{\"dataValue\":\"America/Bogota\"},\n{\"dataValue\":\"America/Boise\"},\n{\"dataValue\":\"America/Buenos_Aires\"},\n{\"dataValue\":\"America/Cambridge_Bay\"},\n{\"dataValue\":\"America/Campo_Grande\"},\n{\"dataValue\":\"America/Cancun\"},\n{\"dataValue\":\"America/Caracas\"},\n{\"dataValue\":\"America/Catamarca\"},\n{\"dataValue\":\"America/Cayenne\"},\n{\"dataValue\":\"America/Cayman\"},\n{\"dataValue\":\"America/Chicago\"},\n{\"dataValue\":\"America/Chihuahua\"},\n{\"dataValue\":\"America/Coral_Harbour\"},\n{\"dataValue\":\"America/Cordoba\"},\n{\"dataValue\":\"America/Costa_Rica\"},\n{\"dataValue\":\"America/Creston\"},\n{\"dataValue\":\"America/Cuiaba\"},\n{\"dataValue\":\"America/Curacao\"},\n{\"dataValue\":\"America/Danmarkshavn\"},\n{\"dataValue\":\"America/Dawson\"},\n{\"dataValue\":\"America/Dawson_Creek\"},\n{\"dataValue\":\"America/Denver\"},\n{\"dataValue\":\"America/Detroit\"},\n{\"dataValue\":\"America/Dominica\"},\n{\"dataValue\":\"America/Edmonton\"},\n{\"dataValue\":\"America/Eirunepe\"},\n{\"dataValue\":\"America/El_Salvador\"},\n{\"dataValue\":\"America/Ensenada\"},\n{\"dataValue\":\"America/Fort_Wayne\"},\n{\"dataValue\":\"America/Fortaleza\"},\n{\"dataValue\":\"America/Glace_Bay\"},\n{\"dataValue\":\"America/Godthab\"},\n{\"dataValue\":\"America/Goose_Bay\"},\n{\"dataValue\":\"America/Grand_Turk\"},\n{\"dataValue\":\"America/Grenada\"},\n{\"dataValue\":\"America/Guadeloupe\"},\n{\"dataValue\":\"America/Guatemala\"},\n{\"dataValue\":\"America/Guayaquil\"},\n{\"dataValue\":\"America/Guyana\"},\n{\"dataValue\":\"America/Halifax\"},\n{\"dataValue\":\"America/Havana\"},\n{\"dataValue\":\"America/Hermosillo\"},\n{\"dataValue\":\"America/Indiana/Indianapolis\"},\n{\"dataValue\":\"America/Indiana/Knox\"},\n{\"dataValue\":\"America/Indiana/Marengo\"},\n{\"dataValue\":\"America/Indiana/Petersburg\"},\n{\"dataValue\":\"America/Indiana/Tell_City\"},\n{\"dataValue\":\"America/Indiana/Vevay\"},\n{\"dataValue\":\"America/Indiana/Vincennes\"},\n{\"dataValue\":\"America/Indiana/Winamac\"},\n{\"dataValue\":\"America/Indianapolis\"},\n{\"dataValue\":\"America/Inuvik\"},\n{\"dataValue\":\"America/Iqaluit\"},\n{\"dataValue\":\"America/Jamaica\"},\n{\"dataValue\":\"America/Jujuy\"},\n{\"dataValue\":\"America/Juneau\"},\n{\"dataValue\":\"America/Kentucky/Louisville\"},\n{\"dataValue\":\"America/Kentucky/Monticello\"},\n{\"dataValue\":\"America/Knox_IN\"},\n{\"dataValue\":\"America/Kralendijk\"},\n{\"dataValue\":\"America/La_Paz\"},\n{\"dataValue\":\"America/Lima\"},\n{\"dataValue\":\"America/Los_Angeles\"},\n{\"dataValue\":\"America/Louisville\"},\n{\"dataValue\":\"America/Lower_Princes\"},\n{\"dataValue\":\"America/Maceio\"},\n{\"dataValue\":\"America/Managua\"},\n{\"dataValue\":\"America/Manaus\"},\n{\"dataValue\":\"America/Marigot\"},\n{\"dataValue\":\"America/Martinique\"},\n{\"dataValue\":\"America/Matamoros\"},\n{\"dataValue\":\"America/Mazatlan\"},\n{\"dataValue\":\"America/Mendoza\"},\n{\"dataValue\":\"America/Menominee\"},\n{\"dataValue\":\"America/Merida\"},\n{\"dataValue\":\"America/Metlakatla\"},\n{\"dataValue\":\"America/Mexico_City\"},\n{\"dataValue\":\"America/Miquelon\"},\n{\"dataValue\":\"America/Moncton\"},\n{\"dataValue\":\"America/Monterrey\"},\n{\"dataValue\":\"America/Montevideo\"},\n{\"dataValue\":\"America/Montreal\"},\n{\"dataValue\":\"America/Montserrat\"},\n{\"dataValue\":\"America/Nassau\"},\n{\"dataValue\":\"America/New_York\"},\n{\"dataValue\":\"America/Nipigon\"},\n{\"dataValue\":\"America/Nome\"},\n{\"dataValue\":\"America/Noronha\"},\n{\"dataValue\":\"America/North_Dakota/Beulah\"},\n{\"dataValue\":\"America/North_Dakota/Center\"},\n{\"dataValue\":\"America/North_Dakota/New_Salem\"},\n{\"dataValue\":\"America/Ojinaga\"},\n{\"dataValue\":\"America/Panama\"},\n{\"dataValue\":\"America/Pangnirtung\"},\n{\"dataValue\":\"America/Paramaribo\"},\n{\"dataValue\":\"America/Phoenix\"},\n{\"dataValue\":\"America/Port_of_Spain\"},\n{\"dataValue\":\"America/Port-au-Prince\"},\n{\"dataValue\":\"America/Porto_Acre\"},\n{\"dataValue\":\"America/Porto_Velho\"},\n{\"dataValue\":\"America/Puerto_Rico\"},\n{\"dataValue\":\"America/Rainy_River\"},\n{\"dataValue\":\"America/Rankin_Inlet\"},\n{\"dataValue\":\"America/Recife\"},\n{\"dataValue\":\"America/Regina\"},\n{\"dataValue\":\"America/Resolute\"},\n{\"dataValue\":\"America/Rio_Branco\"},\n{\"dataValue\":\"America/Rosario\"},\n{\"dataValue\":\"America/Santa_Isabel\"},\n{\"dataValue\":\"America/Santarem\"},\n{\"dataValue\":\"America/Santiago\"},\n{\"dataValue\":\"America/Santo_Domingo\"},\n{\"dataValue\":\"America/Sao_Paulo\"},\n{\"dataValue\":\"America/Scoresbysund\"},\n{\"dataValue\":\"America/Shiprock\"},\n{\"dataValue\":\"America/Sitka\"},\n{\"dataValue\":\"America/St_Barthelemy\"},\n{\"dataValue\":\"America/St_Johns\"},\n{\"dataValue\":\"America/St_Kitts\"},\n{\"dataValue\":\"America/St_Lucia\"},\n{\"dataValue\":\"America/St_Thomas\"},\n{\"dataValue\":\"America/St_Vincent\"},\n{\"dataValue\":\"America/Swift_Current\"},\n{\"dataValue\":\"America/Tegucigalpa\"},\n{\"dataValue\":\"America/Thule\"},\n{\"dataValue\":\"America/Thunder_Bay\"},\n{\"dataValue\":\"America/Tijuana\"},\n{\"dataValue\":\"America/Toronto\"},\n{\"dataValue\":\"America/Tortola\"},\n{\"dataValue\":\"America/Vancouver\"},\n{\"dataValue\":\"America/Virgin\"},\n{\"dataValue\":\"America/Whitehorse\"},\n{\"dataValue\":\"America/Winnipeg\"},\n{\"dataValue\":\"America/Yakutat\"},\n{\"dataValue\":\"America/Yellowknife\"},\n{\"dataValue\":\"Antarctica/Casey\"},\n{\"dataValue\":\"Antarctica/Davis\"},\n{\"dataValue\":\"Antarctica/DumontDUrville\"},\n{\"dataValue\":\"Antarctica/Macquarie\"},\n{\"dataValue\":\"Antarctica/Mawson\"},\n{\"dataValue\":\"Antarctica/McMurdo\"},\n{\"dataValue\":\"Antarctica/Palmer\"},\n{\"dataValue\":\"Antarctica/Rothera\"},\n{\"dataValue\":\"Antarctica/South_Pole\"},\n{\"dataValue\":\"Antarctica/Syowa\"},\n{\"dataValue\":\"Antarctica/Vostok\"},\n{\"dataValue\":\"Arctic/Longyearbyen\"},\n{\"dataValue\":\"Asia/Aden\"},\n{\"dataValue\":\"Asia/Almaty\"},\n{\"dataValue\":\"Asia/Amman\"},\n{\"dataValue\":\"Asia/Anadyr\"},\n{\"dataValue\":\"Asia/Aqtau\"},\n{\"dataValue\":\"Asia/Aqtobe\"},\n{\"dataValue\":\"Asia/Ashgabat\"},\n{\"dataValue\":\"Asia/Ashkhabad\"},\n{\"dataValue\":\"Asia/Baghdad\"},\n{\"dataValue\":\"Asia/Bahrain\"},\n{\"dataValue\":\"Asia/Baku\"},\n{\"dataValue\":\"Asia/Bangkok\"},\n{\"dataValue\":\"Asia/Beirut\"},\n{\"dataValue\":\"Asia/Bishkek\"},\n{\"dataValue\":\"Asia/Brunei\"},\n{\"dataValue\":\"Asia/Calcutta\"},\n{\"dataValue\":\"Asia/Choibalsan\"},\n{\"dataValue\":\"Asia/Chongqing\"},\n{\"dataValue\":\"Asia/Chungking\"},\n{\"dataValue\":\"Asia/Colombo\"},\n{\"dataValue\":\"Asia/Dacca\"},\n{\"dataValue\":\"Asia/Damascus\"},\n{\"dataValue\":\"Asia/Dhaka\"},\n{\"dataValue\":\"Asia/Dili\"},\n{\"dataValue\":\"Asia/Dubai\"},\n{\"dataValue\":\"Asia/Dushanbe\"},\n{\"dataValue\":\"Asia/Gaza\"},\n{\"dataValue\":\"Asia/Harbin\"},\n{\"dataValue\":\"Asia/Hebron\"},\n{\"dataValue\":\"Asia/Ho_Chi_Minh\"},\n{\"dataValue\":\"Asia/Hong_Kong\"},\n{\"dataValue\":\"Asia/Hovd\"},\n{\"dataValue\":\"Asia/Irkutsk\"},\n{\"dataValue\":\"Asia/Istanbul\"},\n{\"dataValue\":\"Asia/Jakarta\"},\n{\"dataValue\":\"Asia/Jayapura\"},\n{\"dataValue\":\"Asia/Jerusalem\"},\n{\"dataValue\":\"Asia/Kabul\"},\n{\"dataValue\":\"Asia/Kamchatka\"},\n{\"dataValue\":\"Asia/Karachi\"},\n{\"dataValue\":\"Asia/Kashgar\"},\n{\"dataValue\":\"Asia/Kathmandu\"},\n{\"dataValue\":\"Asia/Katmandu\"},\n{\"dataValue\":\"Asia/Kolkata\"},\n{\"dataValue\":\"Asia/Krasnoyarsk\"},\n{\"dataValue\":\"Asia/Kuala_Lumpur\"},\n{\"dataValue\":\"Asia/Kuching\"},\n{\"dataValue\":\"Asia/Kuwait\"},\n{\"dataValue\":\"Asia/Macao\"},\n{\"dataValue\":\"Asia/Macau\"},\n{\"dataValue\":\"Asia/Magadan\"},\n{\"dataValue\":\"Asia/Makassar\"},\n{\"dataValue\":\"Asia/Manila\"},\n{\"dataValue\":\"Asia/Muscat\"},\n{\"dataValue\":\"Asia/Nicosia\"},\n{\"dataValue\":\"Asia/Novokuznetsk\"},\n{\"dataValue\":\"Asia/Novosibirsk\"},\n{\"dataValue\":\"Asia/Omsk\"},\n{\"dataValue\":\"Asia/Oral\"},\n{\"dataValue\":\"Asia/Phnom_Penh\"},\n{\"dataValue\":\"Asia/Pontianak\"},\n{\"dataValue\":\"Asia/Pyongyang\"},\n{\"dataValue\":\"Asia/Qatar\"},\n{\"dataValue\":\"Asia/Qyzylorda\"},\n{\"dataValue\":\"Asia/Rangoon\"},\n{\"dataValue\":\"Asia/Riyadh\"},\n{\"dataValue\":\"Asia/Saigon\"},\n{\"dataValue\":\"Asia/Sakhalin\"},\n{\"dataValue\":\"Asia/Samarkand\"},\n{\"dataValue\":\"Asia/Seoul\"},\n{\"dataValue\":\"Asia/Shanghai\"},\n{\"dataValue\":\"Asia/Singapore\"},\n{\"dataValue\":\"Asia/Taipei\"},\n{\"dataValue\":\"Asia/Tashkent\"},\n{\"dataValue\":\"Asia/Tbilisi\"},\n{\"dataValue\":\"Asia/Tehran\"},\n{\"dataValue\":\"Asia/Tel_Aviv\"},\n{\"dataValue\":\"Asia/Thimbu\"},\n{\"dataValue\":\"Asia/Thimphu\"},\n{\"dataValue\":\"Asia/Tokyo\"},\n{\"dataValue\":\"Asia/Ujung_Pandang\"},\n{\"dataValue\":\"Asia/Ulaanbaatar\"},\n{\"dataValue\":\"Asia/Ulan_Bator\"},\n{\"dataValue\":\"Asia/Urumqi\"},\n{\"dataValue\":\"Asia/Vientiane\"},\n{\"dataValue\":\"Asia/Vladivostok\"},\n{\"dataValue\":\"Asia/Yakutsk\"},\n{\"dataValue\":\"Asia/Yekaterinburg\"},\n{\"dataValue\":\"Asia/Yerevan\"},\n{\"dataValue\":\"Atlantic/Azores\"},\n{\"dataValue\":\"Atlantic/Bermuda\"},\n{\"dataValue\":\"Atlantic/Canary\"},\n{\"dataValue\":\"Atlantic/Cape_Verde\"},\n{\"dataValue\":\"Atlantic/Faeroe\"},\n{\"dataValue\":\"Atlantic/Faroe\"},\n{\"dataValue\":\"Atlantic/Jan_Mayen\"},\n{\"dataValue\":\"Atlantic/Madeira\"},\n{\"dataValue\":\"Atlantic/Reykjavik\"},\n{\"dataValue\":\"Atlantic/South_Georgia\"},\n{\"dataValue\":\"Atlantic/St_Helena\"},\n{\"dataValue\":\"Atlantic/Stanley\"},\n{\"dataValue\":\"Australia/ACT\"},\n{\"dataValue\":\"Australia/Adelaide\"},\n{\"dataValue\":\"Australia/Brisbane\"},\n{\"dataValue\":\"Australia/Broken_Hill\"},\n{\"dataValue\":\"Australia/Canberra\"},\n{\"dataValue\":\"Australia/Currie\"},\n{\"dataValue\":\"Australia/Darwin\"},\n{\"dataValue\":\"Australia/Eucla\"},\n{\"dataValue\":\"Australia/Hobart\"},\n{\"dataValue\":\"Australia/LHI\"},\n{\"dataValue\":\"Australia/Lindeman\"},\n{\"dataValue\":\"Australia/Lord_Howe\"},\n{\"dataValue\":\"Australia/Melbourne\"},\n{\"dataValue\":\"Australia/North\"},\n{\"dataValue\":\"Australia/NSW\"},\n{\"dataValue\":\"Australia/Perth\"},\n{\"dataValue\":\"Australia/Queensland\"},\n{\"dataValue\":\"Australia/South\"},\n{\"dataValue\":\"Australia/Sydney\"},\n{\"dataValue\":\"Australia/Tasmania\"},\n{\"dataValue\":\"Australia/Victoria\"},\n{\"dataValue\":\"Australia/West\"},\n{\"dataValue\":\"Australia/Yancowinna\"},\n{\"dataValue\":\"Brazil/Acre\"},\n{\"dataValue\":\"Brazil/DeNoronha\"},\n{\"dataValue\":\"Brazil/East\"},\n{\"dataValue\":\"Brazil/West\"},\n{\"dataValue\":\"Canada/Atlantic\"},\n{\"dataValue\":\"Canada/Central\"},\n{\"dataValue\":\"Canada/Eastern\"},\n{\"dataValue\":\"Canada/East-Saskatchewan\"},\n{\"dataValue\":\"Canada/Mountain\"},\n{\"dataValue\":\"Canada/Newfoundland\"},\n{\"dataValue\":\"Canada/Pacific\"},\n{\"dataValue\":\"Canada/Saskatchewan\"},\n{\"dataValue\":\"Canada/Yukon\"},\n{\"dataValue\":\"CET\"},\n{\"dataValue\":\"Chile/Continental\"},\n{\"dataValue\":\"Chile/EasterIsland\"},\n{\"dataValue\":\"CST6CDT\"},\n{\"dataValue\":\"Cuba\"},\n{\"dataValue\":\"EET\"},\n{\"dataValue\":\"Egypt\"},\n{\"dataValue\":\"Eire\"},\n{\"dataValue\":\"EST\"},\n{\"dataValue\":\"EST5EDT\"},\n{\"dataValue\":\"Etc./GMT\"},\n{\"dataValue\":\"Etc./GMT+0\"},\n{\"dataValue\":\"Etc./UCT\"},\n{\"dataValue\":\"Etc./Universal\"},\n{\"dataValue\":\"Etc./UTC\"},\n{\"dataValue\":\"Etc./Zulu\"},\n{\"dataValue\":\"Europe/Amsterdam\"},\n{\"dataValue\":\"Europe/Andorra\"},\n{\"dataValue\":\"Europe/Athens\"},\n{\"dataValue\":\"Europe/Belfast\"},\n{\"dataValue\":\"Europe/Belgrade\"},\n{\"dataValue\":\"Europe/Berlin\"},\n{\"dataValue\":\"Europe/Bratislava\"},\n{\"dataValue\":\"Europe/Brussels\"},\n{\"dataValue\":\"Europe/Bucharest\"},\n{\"dataValue\":\"Europe/Budapest\"},\n{\"dataValue\":\"Europe/Chisinau\"},\n{\"dataValue\":\"Europe/Copenhagen\"},\n{\"dataValue\":\"Europe/Dublin\"},\n{\"dataValue\":\"Europe/Gibraltar\"},\n{\"dataValue\":\"Europe/Guernsey\"},\n{\"dataValue\":\"Europe/Helsinki\"},\n{\"dataValue\":\"Europe/Isle_of_Man\"},\n{\"dataValue\":\"Europe/Istanbul\"},\n{\"dataValue\":\"Europe/Jersey\"},\n{\"dataValue\":\"Europe/Kaliningrad\"},\n{\"dataValue\":\"Europe/Kiev\"},\n{\"dataValue\":\"Europe/Lisbon\"},\n{\"dataValue\":\"Europe/Ljubljana\"},\n{\"dataValue\":\"Europe/London\"},\n{\"dataValue\":\"Europe/Luxembourg\"},\n{\"dataValue\":\"Europe/Madrid\"},\n{\"dataValue\":\"Europe/Malta\"},\n{\"dataValue\":\"Europe/Mariehamn\"},\n{\"dataValue\":\"Europe/Minsk\"},\n{\"dataValue\":\"Europe/Monaco\"},\n{\"dataValue\":\"Europe/Moscow\"},\n{\"dataValue\":\"Europe/Nicosia\"},\n{\"dataValue\":\"Europe/Oslo\"},\n{\"dataValue\":\"Europe/Paris\"},\n{\"dataValue\":\"Europe/Podgorica\"},\n{\"dataValue\":\"Europe/Prague\"},\n{\"dataValue\":\"Europe/Riga\"},\n{\"dataValue\":\"Europe/Rome\"},\n{\"dataValue\":\"Europe/Samara\"},\n{\"dataValue\":\"Europe/San_Marino\"},\n{\"dataValue\":\"Europe/Sarajevo\"},\n{\"dataValue\":\"Europe/Simferopol\"},\n{\"dataValue\":\"Europe/Skopje\"},\n{\"dataValue\":\"Europe/Sofia\"},\n{\"dataValue\":\"Europe/Stockholm\"},\n{\"dataValue\":\"Europe/Tallinn\"},\n{\"dataValue\":\"Europe/Tirane\"},\n{\"dataValue\":\"Europe/Tiraspol\"},\n{\"dataValue\":\"Europe/Uzhgorod\"},\n{\"dataValue\":\"Europe/Vaduz\"},\n{\"dataValue\":\"Europe/Vatican\"},\n{\"dataValue\":\"Europe/Vienna\"},\n{\"dataValue\":\"Europe/Vilnius\"},\n{\"dataValue\":\"Europe/Volgograd\"},\n{\"dataValue\":\"Europe/Warsaw\"},\n{\"dataValue\":\"Europe/Zagreb\"},\n{\"dataValue\":\"Europe/Zaporozhye\"},\n{\"dataValue\":\"Europe/Zurich\"},\n{\"dataValue\":\"GB\"},\n{\"dataValue\":\"GB-Eire\"},\n{\"dataValue\":\"GMT\"},\n{\"dataValue\":\"GMT+0\"},\n{\"dataValue\":\"GMT0\"},\n{\"dataValue\":\"GMT-0\"},\n{\"dataValue\":\"Greenwich\"},\n{\"dataValue\":\"Hong Kong\"},\n{\"dataValue\":\"HST\"},\n{\"dataValue\":\"Iceland\"},\n{\"dataValue\":\"Indian/Antananarivo\"},\n{\"dataValue\":\"Indian/Chagos\"},\n{\"dataValue\":\"Indian/Christmas\"},\n{\"dataValue\":\"Indian/Cocos\"},\n{\"dataValue\":\"Indian/Comoro\"},\n{\"dataValue\":\"Indian/Kerguelen\"},\n{\"dataValue\":\"Indian/Mahe\"},\n{\"dataValue\":\"Indian/Maldives\"},\n{\"dataValue\":\"Indian/Mauritius\"},\n{\"dataValue\":\"Indian/Mayotte\"},\n{\"dataValue\":\"Indian/Reunion\"},\n{\"dataValue\":\"Iran\"},\n{\"dataValue\":\"Israel\"},\n{\"dataValue\":\"Jamaica\"},\n{\"dataValue\":\"Japan\"},\n{\"dataValue\":\"JST-9\"},\n{\"dataValue\":\"Kwajalein\"},\n{\"dataValue\":\"Libya\"},\n{\"dataValue\":\"MET\"},\n{\"dataValue\":\"Mexico/BajaNorte\"},\n{\"dataValue\":\"Mexico/BajaSur\"},\n{\"dataValue\":\"Mexico/General\"},\n{\"dataValue\":\"MST\"},\n{\"dataValue\":\"MST7MDT\"},\n{\"dataValue\":\"Navajo\"},\n{\"dataValue\":\"NZ\"},\n{\"dataValue\":\"NZ-CHAT\"},\n{\"dataValue\":\"Pacific/Apia\"},\n{\"dataValue\":\"Pacific/Auckland\"},\n{\"dataValue\":\"Pacific/Chatham\"},\n{\"dataValue\":\"Pacific/Chuuk\"},\n{\"dataValue\":\"Pacific/Easter\"},\n{\"dataValue\":\"Pacific/Efate\"},\n{\"dataValue\":\"Pacific/Enderbury\"},\n{\"dataValue\":\"Pacific/Fakaofo\"},\n{\"dataValue\":\"Pacific/Fiji\"},\n{\"dataValue\":\"Pacific/Funafuti\"},\n{\"dataValue\":\"Pacific/Galapagos\"},\n{\"dataValue\":\"Pacific/Gambier\"},\n{\"dataValue\":\"Pacific/Guadalcanal\"},\n{\"dataValue\":\"Pacific/Guam\"},\n{\"dataValue\":\"Pacific/Honolulu\"},\n{\"dataValue\":\"Pacific/Johnston\"},\n{\"dataValue\":\"Pacific/Kiritimati\"},\n{\"dataValue\":\"Pacific/Kosrae\"},\n{\"dataValue\":\"Pacific/Kwajalein\"},\n{\"dataValue\":\"Pacific/Majuro\"},\n{\"dataValue\":\"Pacific/Marquesas\"},\n{\"dataValue\":\"Pacific/Midway\"},\n{\"dataValue\":\"Pacific/Nauru\"},\n{\"dataValue\":\"Pacific/Niue\"},\n{\"dataValue\":\"Pacific/Norfolk\"},\n{\"dataValue\":\"Pacific/Noumea\"},\n{\"dataValue\":\"Pacific/Pago_Pago\"},\n{\"dataValue\":\"Pacific/Palau\"},\n{\"dataValue\":\"Pacific/Pitcairn\"},\n{\"dataValue\":\"Pacific/Pohnpei\"},\n{\"dataValue\":\"Pacific/Ponape\"},\n{\"dataValue\":\"Pacific/Port_Moresby\"},\n{\"dataValue\":\"Pacific/Rarotonga\"},\n{\"dataValue\":\"Pacific/Saipan\"},\n{\"dataValue\":\"Pacific/Samoa\"},\n{\"dataValue\":\"Pacific/Tahiti\"},\n{\"dataValue\":\"Pacific/Tarawa\"},\n{\"dataValue\":\"Pacific/Tongatapu\"},\n{\"dataValue\":\"Pacific/Truk\"},\n{\"dataValue\":\"Pacific/Wake\"},\n{\"dataValue\":\"Pacific/Wallis\"},\n{\"dataValue\":\"Pacific/Yap\"},\n{\"dataValue\":\"Poland\"},\n{\"dataValue\":\"Portugal\"},\n{\"dataValue\":\"PRC\"},\n{\"dataValue\":\"PST8PDT\"},\n{\"dataValue\":\"ROC\"},\n{\"dataValue\":\"ROK\"},\n{\"dataValue\":\"Singapore\"},\n{\"dataValue\":\"Turkey\"},\n{\"dataValue\":\"UCT\"},\n{\"dataValue\":\"Universal\"},\n{\"dataValue\":\"US/Alaska\"},\n{\"dataValue\":\"US/Aleutian\"},\n{\"dataValue\":\"US/Arizona\"},\n{\"dataValue\":\"US/Central\"},\n{\"dataValue\":\"US/Eastern\"},\n{\"dataValue\":\"US/East-Indiana\"},\n{\"dataValue\":\"US/Hawaii\"},\n{\"dataValue\":\"US/Indiana-Starke\"},\n{\"dataValue\":\"US/Michigan\"},\n{\"dataValue\":\"US/Mountain\"},\n{\"dataValue\":\"US/Pacific\"},\n{\"dataValue\":\"US/Pacific-New\"},\n{\"dataValue\":\"US/Samoa\"},\n{\"dataValue\":\"UTC\"},\n{\"dataValue\":\"WET\"},\n{\"dataValue\":\"W-SU\"},\n{\"dataValue\":\"Zulu\"}]","type":"StringData"}, {}],
	varVmTimers: ["wm.Variable", {"isList":true,"json":"[]","type":"vmTimerDef"}, {}],
	varVmTimerList: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"pit\",\"dataValue\":\"pit\"},{\"name\":\"rtc\",\"dataValue\":\"rtc\"},{\"name\":\"tsc\",\"dataValue\":\"tsc\"},{\"name\":\"kvmclock\",\"dataValue\":\"kvmclock\"},{\"name\":\"hpet\",\"dataValue\":\"hpet\"},{\"name\":\"plateform\",\"dataValue\":\"plateform\"}]","type":"EntryData"}, {}],
	varTimerTickpolicy: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"delay\",\"dataValue\":\"delay\"},{\"name\":\"catchup\",\"dataValue\":\"catchup\"},{\"name\":\"merge\",\"dataValue\":\"merge\"},{\"name\":\"discard\",\"dataValue\":\"discard\"}]","type":"EntryData"}, {}],
	varTimerTrack: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"boot\",\"dataValue\":\"boot\"},{\"name\":\"guest\",\"dataValue\":\"guest\"},{\"name\":\"wall\",\"dataValue\":\"wall\"}]","type":"EntryData"}, {}],
	varTimerModes: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"auto\",\"dataValue\":\"auto\"},{\"name\":\"native\",\"dataValue\":\"native\"},{\"name\":\"emulate\",\"dataValue\":\"emulate\"},{\"name\":\"paravirt\",\"dataValue\":\"paravirt\"},{\"name\":\"smpsafe\",\"dataValue\":\"smpsafe\"}]","type":"EntryData"}, {}],
	varTimerPresent: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"yes\",\"dataValue\":\"yes\"},{\"name\":\"no\",\"dataValue\":\"no\"}]","type":"EntryData"}, {}],
	varNtpServerList: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
	javaGetNodeTimeConfiguration: ["wm.ServiceVariable", {"operation":"getNodeTimeConfiguration","service":"serverTools"}, {"onResult":"javaGetNodeTimeConfigurationResult"}, {
		input: ["wm.ServiceInput", {"type":"getNodeTimeConfigurationInputs"}, {}]
	}],
	javaSetNodeTimeConfiguration: ["wm.ServiceVariable", {"operation":"setNodeTimeConfiguration","service":"serverTools"}, {"onResult":"javaSetNodeTimeConfigurationResult"}, {
		input: ["wm.ServiceInput", {"type":"setNodeTimeConfigurationInputs"}, {}]
	}],
	javaSetNodeNtpServers: ["wm.ServiceVariable", {"operation":"setNodeNtpServers","service":"serverTools"}, {"onResult":"javaSetNodeNtpServersResult"}, {
		input: ["wm.ServiceInput", {"type":"setNodeNtpServersInputs"}, {}]
	}],
	javaSetNodeAdvancedTimeConfiguration: ["wm.ServiceVariable", {"operation":"setNodeAdvancedTimeConfiguration","service":"serverTools"}, {"onBeforeUpdate":"javaSetNodeAdvancedTimeConfigurationBeforeUpdate","onResult":"javaSetNodeAdvancedTimeConfigurationResult"}, {
		input: ["wm.ServiceInput", {"type":"setNodeAdvancedTimeConfigurationInputs"}, {}]
	}],
	javaSnapshotsDiscardAll: ["wm.ServiceVariable", {"operation":"discardAll","service":"snapshotTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"discardAllInputs"}, {}]
	}],
	javaRemoveVm: ["wm.ServiceVariable", {"operation":"removeVm","service":"vmTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"removeVmInputs"}, {}]
	}],
	javaNodeImportLocalVms: ["wm.ServiceVariable", {"operation":"importLocalVms","service":"serverTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"importLocalVmsInputs"}, {}]
	}],
	javaUpdateVmNetworkLink: ["wm.ServiceVariable", {"operation":"updateVmNetworkLink","service":"vmXmlFile"}, {"onResult":"javaUpdateVmNetworkLinkResult"}, {
		input: ["wm.ServiceInput", {"type":"updateVmNetworkLinkInputs"}, {}]
	}],
	javaReadVmXmlActive: ["wm.ServiceVariable", {"operation":"readVmXmlActive","service":"vmTools"}, {"onResult":"javaReadVmXmlActiveResult"}, {
		input: ["wm.ServiceInput", {"type":"readVmXmlActiveInputs"}, {}]
	}],
	javaReadLogFile: ["wm.ServiceVariable", {"operation":"readLogFile","service":"javaTools"}, {"onResult":"javaReadLogFileResult"}, {
		input: ["wm.ServiceInput", {"type":"readLogFileInputs"}, {}]
	}],
	javaSetJavaToolsUser: ["wm.ServiceVariable", {"operation":"setUser","service":"javaTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"setUserInputs"}, {}]
	}],
	javaSetUser: ["wm.ServiceVariable", {"operation":"setUser","service":"javaTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"setUserInputs"}, {}]
	}],
	getUserRoles: ["wm.ServiceVariable", {"autoUpdate":true,"operation":"getUserRoles","service":"securityService","startUpdate":true}, {"onResult":"getUserRolesResult"}, {
		input: ["wm.ServiceInput", {"type":"getUserRolesInputs"}, {}]
	}],
	binding: ["wm.Binding", {}, {}, {
		wire: ["wm.Wire", {"expression":undefined,"source":"varVmTimers","targetProperty":"dataSet"}, {}]
	}],
	varNodeMemory: ["wm.Variable", {}, {}],
	javaGetDebug: ["wm.ServiceVariable", {"operation":"getDebug","service":"javaTools"}, {"onResult":"javaGetDebugResult"}, {
		input: ["wm.ServiceInput", {"type":"getDebugInputs"}, {}]
	}],
	javaSetDebug: ["wm.ServiceVariable", {"operation":"setDebug","service":"javaTools"}, {}, {
		input: ["wm.ServiceInput", {"type":"setDebugInputs"}, {}]
	}],
	javaEraseVmStorage: ["wm.ServiceVariable", {"operation":"eraseVmStorage","service":"vmTools"}, {"onResult":"javaEraseVmStorageResult"}, {
		input: ["wm.ServiceInput", {"type":"eraseVmStorageInputs"}, {}]
	}],
	javaGetAllVmsNetworks: ["wm.ServiceVariable", {"operation":"getAllVmsNetworks","service":"serverTools"}, {"onResult":"javaGetAllVmsNetworksResult"}, {
		input: ["wm.ServiceInput", {"type":"getAllVmsNetworksInputs"}, {}]
	}],
	javaGetVmVnics: ["wm.ServiceVariable", {"operation":"getVmVnics","service":"vmTools"}, {"onResult":"javaGetVmVnicsResult"}, {
		input: ["wm.ServiceInput", {"type":"getVmVnicsInputs"}, {}]
	}],
	javaMoveVmNic: ["wm.ServiceVariable", {"operation":"moveVmNic","service":"vmTools"}, {"onResult":"javaMoveVmNicResult"}, {
		input: ["wm.ServiceInput", {"type":"moveVmNicInputs"}, {}]
	}],
	tableserversDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget","height":"370px","roles":["dev","Administrator"],"title":"Add Node","width":"400px"}, {"onEnterKeyPress":"onNumberEnterKeyPress","onShow":"tableserversDialogShow"}, {
		containerWidget: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			panel42: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"middle","width":"100%"}, {}, {
				panelServerError: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"middle","width":"100%"}, {}, {
					spacer15: ["wm.Spacer", {"height":"100%","width":"10px"}, {}],
					picture5: ["wm.Picture", {"border":"0","height":"30px","source":"resources/images/icons/dialog-warning-30.png","width":"30px"}, {}],
					labelServerWarnig: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_FontColor_BrightRed","wm_FontSizePx_12px"]},"autoSizeHeight":true,"border":"0","caption":"warning","margin":"0,0,0,5","padding":"4","singleLine":false,"width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				labelAddNodeInfos: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0","caption":"Node information:","padding":"4"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				panelNewServer: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"223px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
					tableserversLiveForm1: ["wm.LiveForm", {"alwaysPopulateEditors":true,"border":"1","borderColor":"#b3b8c4","fitToContentHeight":true,"height":"114px","horizontalAlign":"left","liveEditing":false,"margin":"4","verticalAlign":"middle"}, {"onDeleteData":"onLiveFormDeleteData","onInsertData":"tableserversLiveForm1InsertData"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"tableserversLiveVariable1","targetProperty":"dataSet"}, {}]
						}],
						idEditor: ["wm.Number", {"caption":"Id","captionSize":"200px","formField":"id","height":"26px","showing":false,"width":"100%"}, {}],
						nameEditor: ["wm.Text", {"caption":"Name","captionSize":"140px","dataValue":undefined,"formField":"name","height":"26px","regExp":"^[A-Za-z0-9]+(?:-?_?[A-Za-z0-9]+)+$","required":true}, {}],
						ipEditor: ["wm.Text", {"caption":"IP Address","captionSize":"140px","dataValue":undefined,"formField":"ip","height":"26px","regExp":"([0-9]{1,3}\\.){3}[0-9]{1,3}","required":true}, {}],
						selectHypervisor: ["wm.SelectMenu", {"caption":"Hypervisor","captionSize":"140px","dataField":"dataValue","displayField":"name","formField":"hypervisor","height":"26px","required":true}, {"onchange":"selectHypervisorChange"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"varHypervisors","targetProperty":"dataSet"}, {}]
							}]
						}],
						panelWarningQemu: ["wm.Panel", {"border":"0","height":"20px","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
							labelWarningQemu: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Red"]},"border":"0","caption":"<i><small>NB: QEMU full virtualization is not fit for production systems</small></i>","height":"20px","padding":"0,0,7,5","width":"100%"}, {}]
						}],
						descEditor: ["wm.Text", {"caption":"Description","captionSize":"140px","dataValue":"","emptyValue":"emptyString","formField":"description","height":"26px"}, {"onEnterKeyPress":"onNumberEnterKeyPress"}]
					}],
					spacer3: ["wm.Spacer", {"height":"15px","width":"100%"}, {}],
					labelAddNodeSecurity: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0","caption":"SSH and TLS keys:","padding":"4"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel40: ["wm.Panel", {"border":"1","borderColor":"#b3b8c4","height":"70px","horizontalAlign":"left","margin":"4","verticalAlign":"middle","width":"100%"}, {}, {
						panel41: ["wm.Panel", {"border":"0","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							boxSshKey: ["wm.Checkbox", {"caption":"Exchange keys","captionAlign":"left","captionSize":"110px","dataValue":"true","displayValue":"true","padding":"0,0,0,10","startChecked":true,"width":"150px"}, {"onchange":"boxSshKeyChange"}],
							label4: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px","wm_TextDecoration_None","wm_FontColor_Graphite"]},"border":"0","caption":"(Uncheck if it has already been done)","padding":"4"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						panel28: ["wm.Panel", {"border":"0","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							editPassword: ["wm.Text", {"caption":"Root password","captionAlign":"left","captionSize":"110px","dataValue":undefined,"displayValue":"","padding":"0,0,0,10","password":true,"required":true,"width":"250px"}, {"onEnterKeyPress":"tableserversSaveButtonClick"}],
							checkboxPasswd: ["wm.Checkbox", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"caption":"hide password","captionAlign":"left","captionPosition":"right","captionSize":"80px","dataValue":"true","displayValue":"true","padding":"0,0,0,10","startChecked":true,"width":"110px"}, {"onchange":"checkboxPasswdChange"}]
						}]
					}]
				}]
			}]
		}],
		buttonBar: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"0","fitToContentHeight":true,"height":"34px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel128: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BackgroundColor_SteelBlue"]},"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				tableserversSaveButton: ["wm.Button", {"caption":"OK","imageIndex":109,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"tableserversSaveButtonClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":false,"source":"panelNewServer.invalid","targetProperty":"disabled"}, {}]
					}]
				}],
				tableserversCancelButton: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"tableserversCancelButtonClick"}]
			}]
		}]
	}],
	tablevmsDialog1: ["wm.DesignableDialog", {"buttonBarId":"buttonBar2","containerWidgetId":"containerWidget2","corner":"ccenter","height":"410px","noEscape":true,"noMaxify":true,"noMinify":true,"roles":["dev","Administrator","PowerUser"],"title":"New Virtual Machine","width":"460px"}, {"onShow":"tablevmsDialog1Show"}, {
		containerWidget2: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"center","margin":"0","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
			wizardNewVm: ["wm.WizardLayers", {"defaultLayer":0,"transition":"slide"}, {"onCancelClick":"onNewVmCancelClick","onDoneClick":"onWizardLayersDoneClick","onLayerValidation":"onWizardLayersLayerValidation","onchange":"wizardNewVmChange"}, {
				layerGeneral: ["wm.Layer", {"border":"1","caption":"General Settings","horizontalAlign":"right","padding":"8","verticalAlign":"middle"}, {}, {
					tablevmsLiveForm2: ["wm.LiveForm", {"alwaysPopulateEditors":true,"fitToContentHeight":true,"height":"254px","horizontalAlign":"left","liveEditing":false,"saveOnEnterKey":false,"verticalAlign":"top"}, {"onCancelEdit":"tablevmsLiveForm2CancelEdit","onDeleteData":"onVmFormDeleteData","onUpdateData":"tablevmsLiveForm2UpdateData"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"tablevmsLiveVariable2","targetProperty":"dataSet"}, {}],
							wire1: ["wm.Wire", {"expression":undefined,"source":"nameEditor3.dataValue","targetProperty":"dataOutput.displayedname"}, {}]
						}],
						idEditor3: ["wm.Number", {"caption":"Id","captionSize":"200px","formField":"id","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
						label2: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px"]},"border":"1,1,0,1","borderColor":"#b3b8c4","caption":"Details","height":"20px","margin":"0,0,0,10","padding":"8","width":"100px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						panel18: ["wm.MainContentPanel", {"borderColor":"#b3b8c4","height":"70px","horizontalAlign":"center","margin":"0","verticalAlign":"middle","width":"100%"}, {}, {
							nameEditor3: ["wm.Text", {"caption":"VM Name :","captionAlign":"left","captionSize":"105px","dataValue":undefined,"formField":"name","height":"30px","invalidMessage":"Invalid Virtual Machine name","margin":"4,0,4,0","padding":"0","regExp":"^[A-Za-z0-9]+(?:-?_?[A-Za-z0-9]+)+$","required":true,"width":"340px"}, {"onchange":"nameEditor3Change"}],
							serverMenuEditor: ["wm.SelectMenu", {"caption":"Hosting Node :","captionAlign":"left","captionSize":"105px","dataField":"name","displayField":"name","emptyValue":"emptyString","formField":"server","height":"30px","margin":"4,0,4,0","padding":"","required":true,"startUpdate":true,"width":"340px"}, {"onchange":"serverMenuEditorChange"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"varServerList","targetProperty":"dataSet"}, {}]
								}]
							}]
						}],
						spacer4: ["wm.Spacer", {"height":"10px","width":"100%"}, {}],
						label3: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px"]},"border":"1,1,0,1","borderColor":"#b3b8c4","caption":"Hardware","margin":"0,0,0,10","padding":"8","width":"100px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						panelNewVmHardware: ["wm.MainContentPanel", {"borderColor":"#b3b8c4","height":"130px","horizontalAlign":"left","margin":"0","padding":"0,0,0,30","verticalAlign":"middle","width":"100%"}, {}, {
							selectArchMenu: ["wm.SelectMenu", {"caption":"Architecture :","captionAlign":"left","captionSize":"130px","dataField":"dataValue","displayField":"name","displayValue":"","emptyValue":"emptyString","height":"30px","margin":"4,0,4,0","padding":"","required":true,"width":"250px"}, {"onchange":"selectArchMenuChange"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"varArch","targetProperty":"dataSet"}, {}]
								}]
							}],
							memoryEditor: ["wm.Number", {"caption":"Memory (MB) :","captionAlign":"left","captionSize":"130px","formField":"memory","height":"30px","margin":"4,0,4,0","maximum":32768,"minimum":256,"padding":"","required":true,"spinnerButtons":true,"width":"250px"}, {}],
							nbcpuEditor: ["wm.Number", {"caption":"Number of vCPU(s) :","captionAlign":"left","captionSize":"130px","formField":"nbcpu","height":"30px","margin":"4,0,4,0","minimum":1,"padding":"","required":true,"spinnerButtons":true,"width":"250px"}, {}],
							vmArch: ["wm.Text", {"caption":"Arch","captionSize":"200px","formField":"arch","height":"26px","required":true,"showing":false,"width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":false,"source":"selectArchMenu.selectedItem.name","targetProperty":"dataValue"}, {}]
								}]
							}],
							selectKeymap: ["wm.SelectMenu", {"caption":"Keymap :","captionAlign":"left","captionSize":"130px","dataField":"dataValue","displayField":"dataValue","displayValue":"","height":"30px","margin":"4,0,4,0","padding":"","required":true,"width":"250px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"varKeymaps","targetProperty":"dataSet"}, {}]
								}]
							}]
						}],
						freqcpuEditor2: ["wm.Number", {"caption":"Freqcpu","captionSize":"200px","defaultInsert":"100","formField":"freqcpu","height":"26px","required":true,"showing":false,"width":"100%"}, {}],
						networkEditor1: ["wm.Text", {"caption":"Network","captionSize":"200px","dataValue":undefined,"defaultInsert":"br0","formField":"network","height":"26px","required":true,"showing":false,"width":"100%"}, {}],
						disksEditor2: ["wm.Text", {"caption":"Disks","captionSize":"200px","dataValue":undefined,"defaultInsert":"6gb","formField":"disks","height":"26px","required":true,"showing":false,"width":"100%"}, {}],
						cdromEditor2: ["wm.Text", {"caption":"Cdrom","captionSize":"200px","dataValue":undefined,"defaultInsert":"none","formField":"cdrom","height":"26px","required":true,"showing":false,"width":"100%"}, {}]
					}]
				}],
				layerStorage: ["wm.Layer", {"border":"1","caption":"Storage","horizontalAlign":"right","margin":"0","padding":"8","verticalAlign":"middle"}, {}, {
					panel10: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"199px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
						label6: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px"]},"border":"1,1,0,1","borderColor":"#b3b8c4","caption":"Main Hard Drive","height":"20px","margin":"0,0,0,10","padding":"8","width":"140px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						panel11: ["wm.MainContentPanel", {"borderColor":"#b3b8c4","fitToContentHeight":true,"height":"179px","horizontalAlign":"left","margin":"0","padding":"0,0,0,30","verticalAlign":"middle","width":"100%"}, {}, {
							spacer12: ["wm.Spacer", {"height":"15px","width":"100%"}, {}],
							panel102: ["wm.Panel", {"border":"0","height":"36px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								diskSizeEditor: ["wm.Number", {"caption":"Size in GB :","captionAlign":"left","captionSize":"90px","displayValue":"6","height":"26px","maximum":300,"minimum":4,"required":true,"spinnerButtons":true,"width":"170px"}, {}],
								boxAllocateSpace: ["wm.Checkbox", {"caption":"Allocate All Space ","captionAlign":"left","captionPosition":"right","captionSize":"140px","dataValue":"true","disabled":true,"displayValue":"true","height":"26px","padding":"2,0,0,20","startChecked":true,"width":"160px"}, {}]
							}],
							panel149: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"42px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								panelFileType: ["wm.Panel", {"border":"0","fitToContentWidth":true,"height":"36px","horizontalAlign":"left","padding":"0","verticalAlign":"top","width":"290px"}, {}, {
									selectDeviceType: ["wm.SelectMenu", {"caption":"File Type :","captionAlign":"left","captionSize":"90px","dataField":"dataValue","displayField":"name","displayValue":"","height":"26px","required":true,"width":"290px"}, {"onchange":"selectDeviceTypeChange"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":undefined,"source":"varFileType","targetProperty":"dataSet"}, {}]
										}]
									}]
								}],
								panelWarnNoSnapshot: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
									picInfoDiskSnapshot: ["wm.Picture", {"border":"0","height":"16px","padding":"0","source":"resources/images/icons/dialog-warning-16.png","width":"16px"}, {}],
									labelWarnNoSnapshot: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Red"]},"autoSizeHeight":true,"border":"0","caption":"<small><i>Snaphots are not supported.</i></small>","height":"42px","padding":"5,7,5,7","singleLine":false,"width":"100%"}, {}]
								}]
							}],
							panel248: ["wm.Panel", {"border":"0","height":"36px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								diskPathEditor: ["wm.SelectMenu", {"caption":"Location :","captionAlign":"left","captionSize":"90px","dataField":"target","displayField":"name","displayValue":"","height":"26px","required":true,"width":"290px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"varStorages","targetProperty":"dataSet"}, {}]
									}]
								}]
							}],
							panel249: ["wm.Panel", {"border":"0","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								selectDiskBus: ["wm.SelectMenu", {"caption":"Bus: ","captionAlign":"left","captionSize":"90px","dataField":"dataValue","displayField":"name","displayValue":"","emptyValue":"emptyString","height":"26px","helpText":"Select the emulated Bus exposed to the guest OS.</br> <b>Note:</b> VirtIO Bus will provide the best performances, however you have to make sure that the appropriate driver is available for your guest OS.","required":true,"width":"310px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"varDiskBus","targetProperty":"dataSet"}, {}]
									}]
								}]
							}]
						}]
					}]
				}],
				layerNetwork: ["wm.Layer", {"border":"1","caption":"Network","horizontalAlign":"right","margin":"0","padding":"8","verticalAlign":"middle"}, {}, {
					panel16: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"197px","horizontalAlign":"left","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
						Virtual_NIC: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px"]},"border":"1,1,0,1","borderColor":"#b3b8c4","caption":"Virtual NIC","height":"20px","margin":"0,0,0,10","padding":"8","width":"110px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						panel15: ["wm.MainContentPanel", {"borderColor":"#b3b8c4","fitToContentHeight":true,"height":"177px","horizontalAlign":"left","margin":"0","padding":"0,0,0,30","verticalAlign":"middle","width":"100%"}, {}, {
							spacer16: ["wm.Spacer", {"height":"15px","width":"100%"}, {}],
							panel254: ["wm.Panel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								selectVswitch: ["wm.SelectMenu", {"caption":"Network Connection :","captionAlign":"left","captionSize":"140px","dataField":"All Fields","displayField":"display","displayValue":"","height":"26px","helpText":"Select a Network on Node to which the Virtual Interface will be connected.","required":true,"width":"360px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"varNetworkInterfaces","targetProperty":"dataSet"}, {}]
									}]
								}]
							}],
							panel255: ["wm.Panel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								selectNetworkDevice: ["wm.SelectMenu", {"caption":"Virtual Adapter :","captionAlign":"left","captionSize":"140px","dataField":"dataValue","displayField":"name","displayValue":"","height":"26px","helpText":"Select the emulated device exposed to the guest OS.</br> <b>Note:</b> <br> - VirtIO device will provide the best performances, however you have to make sure that the appropriate driver is available for your guest OS. <br> - pcnet32 device will work on virtually any OS.","required":true,"width":"360px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"varNetworkDevices","targetProperty":"dataSet"}, {}]
									}]
								}]
							}],
							panel256: ["wm.Panel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								macEditor: ["wm.Text", {"caption":"MAC Address :","captionAlign":"left","captionSize":"140px","dataValue":"Automatic","displayValue":"Automatic","height":"26px","required":true,"width":"340px"}, {"onchange":"macEditorChange"}]
							}],
							panel257: ["wm.Panel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,140","verticalAlign":"top","width":"100%"}, {}, {
								checkboxNetBoot: ["wm.Checkbox", {"caption":"Bootable","captionAlign":"left","captionPosition":"right","dataValue":"true","displayValue":"true","startChecked":true}, {}]
							}]
						}]
					}]
				}],
				layerCdrom: ["wm.Layer", {"border":"1","caption":"CD-ROM","horizontalAlign":"right","margin":"0","padding":"8","verticalAlign":"middle"}, {"onShow":"layerCdromShow"}, {
					panel50: ["wm.Panel", {"border":"0","height":"25px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
						label5: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px"]},"border":"1,1,0,1","borderColor":"#b3b8c4","caption":"Media Source","height":"20px","margin":"0,0,0,10","padding":"8","width":"120px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}],
					panel20: ["wm.MainContentPanel", {"borderColor":"#b3b8c4","height":"190px","horizontalAlign":"left","imageList":"app.silkIconList","margin":"0","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
						panel155: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"136px","horizontalAlign":"left","padding":"0,0,0,30","verticalAlign":"top","width":"100%"}, {}, {
							radioNone: ["wm.RadioButton", {"caption":"No Media","captionAlign":"left","captionPosition":"right","captionSize":"110px","displayValue":"","height":"34px","padding":"0","width":"130px"}, {}],
							radioPhysical: ["wm.RadioButton", {"caption":"Physical device","captionAlign":"left","captionPosition":"right","captionSize":"110px","displayValue":"","height":"34px","padding":"0","width":"130px"}, {}],
							radioISO: ["wm.RadioButton", {"caption":"Image file :","captionAlign":"left","captionPosition":"right","captionSize":"110px","displayValue":"","height":"34px","padding":"0","width":"130px"}, {"onchange":"radioISOChange"}],
							panel132: ["wm.Panel", {"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","verticalAlign":"top","width":"100%"}, {}, {
								selectISO: ["wm.Text", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"caption":"Location :","captionSize":"0px","dataValue":undefined,"disabled":true,"displayValue":"","padding":"0","width":"100%"}, {}],
								isoBtn: ["wm.Button", {"caption":"Browse","disabled":true,"height":"24px","hint":"Browse on remote node.","imageIndex":66,"margin":"0,0,0,7"}, {"onclick":"isoBtnClick"}],
								spacer11: ["wm.Spacer", {"height":"100%","width":"10px"}, {}]
							}]
						}],
						selectCdromBus: ["wm.SelectMenu", {"caption":"Bus:","captionSize":"60px","dataField":"dataValue","disabled":true,"displayField":"name","displayValue":"","emptyValue":"emptyString","showing":false,"width":"200px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"varCdromBus","targetProperty":"dataSet"}, {}]
							}]
						}]
					}]
				}],
				layerSummary: ["wm.Layer", {"border":"1","caption":"Summary","horizontalAlign":"right","margin":"0","padding":"8","verticalAlign":"middle"}, {}, {
					panel47: ["wm.Panel", {"border":"1","borderColor":"#b3b8c4","fitToContentHeight":true,"height":"220px","horizontalAlign":"left","padding":"4","verticalAlign":"top","width":"100%"}, {}, {
						panel22: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","verticalAlign":"middle","width":"100%"}, {}, {
							label7: ["wm.Label", {"border":"0","caption":"VM Name :","padding":"4","width":"100px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label8: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"align":"left","border":"0","padding":"4","width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":"\"<b>\"+${nameEditor3.dataValue}+\"</b>\"","source":false,"targetProperty":"caption"}, {}]
								}],
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						panel258: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","verticalAlign":"middle","width":"100%"}, {}, {
							label9: ["wm.Label", {"border":"0","caption":"Hosting Node : ","padding":"4","width":"100px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label10: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"align":"left","border":"0","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}],
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":"\"<b>\"+${serverMenuEditor.dataValue}+\"</b>\"","source":false,"targetProperty":"caption"}, {}]
								}]
							}]
						}],
						panel23: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","verticalAlign":"middle","width":"100%"}, {}, {
							label13: ["wm.Label", {"border":"0","caption":"Storage :","padding":"4","width":"100px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label14: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"align":"left","border":"0","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}],
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":"\"<b>\"+${diskSizeEditor.dataValue}+\"</b> GB   in   <b>\"+${selectDeviceType.dataValue}+\"</b>\"","source":false,"targetProperty":"caption"}, {}]
								}]
							}]
						}],
						panel154: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
							label21: ["wm.Label", {"border":"0","caption":"Processing : ","height":"22px","padding":"4","width":"100px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label22: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"align":"left","border":"0","height":"25px","padding":"4","width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":"\"<b>\"+${nbcpuEditor.dataValue}+\"</b> vCPU(s)   of type    <b>\"+${selectArchMenu.selectedItem.name}+\"</b>\"","source":false,"targetProperty":"caption"}, {}]
								}],
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						panel26: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","verticalAlign":"middle","width":"100%"}, {}, {
							label19: ["wm.Label", {"border":"0","caption":"Memory :","padding":"4","width":"100px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label20: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"align":"left","border":"0","padding":"4","width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":"\"<b>\"+${memoryEditor.dataValue}+\"</b> MB\"","source":false,"targetProperty":"caption"}, {}]
								}],
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						panel25: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","verticalAlign":"middle","width":"100%"}, {}, {
							label15: ["wm.Label", {"border":"0","caption":"Networking :","padding":"4","width":"100px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label25: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"align":"left","border":"0","padding":"4","width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":"\"<b>\"+${selectNetworkDevice.dataValue}+\"</b> device, attached to <b>\"+${selectVswitch.selectedItem.display}+\"</b>\"","source":false,"targetProperty":"caption"}, {}]
								}],
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						panel24: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"middle","width":"100%"}, {}, {
							label11: ["wm.Label", {"border":"0","caption":"CD-ROM :","padding":"4","width":"80px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label12: ["wm.Label", {"autoSizeWidth":true,"border":"0","padding":"4","width":"41px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}]
					}]
				}]
			}]
		}],
		buttonBar2: ["wm.Panel", {"_classes":{"domNode":["dialogfooter","wm_BorderBottomStyle_Curved4px"]},"border":"0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel129: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				tablevmsCancelButton1: ["wm.Button", {"caption":"Cancel","height":"30px","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","showing":false,"width":"100px"}, {"onclick":"onNewVmCancelClick"}]
			}]
		}]
	}],
	serverPopup: ["wm.DesignableDialog", {"_classes":{"domNode":["wm_BorderShadow_StrongShadow","wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px","wm_BackgroundColor_Graphite"]},"buttonBarId":"","containerWidgetId":"panelServerPopup","corner":"bc","height":"155px","modal":false,"noEscape":true,"noMaxify":true,"noMinify":true,"roles":["dev","Administrator","PowerUser"],"title":"","width":"200px"}, {"onClose":"serverPopupClose"}, {
		panelServerPopup: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"146px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"5,5,5,5","verticalAlign":"top","width":"100%"}, {}, {
			panel37: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"136px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
				panelPopupAddVm: ["wm.Panel", {"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","roles":["dev","Administrator","PowerUser"],"verticalAlign":"middle","width":"100%"}, {}, {
					picture3: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/add-vm-24.png","width":"24px"}, {}],
					labelServerAddVm: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"New Virtual Machine","margin":"0,0,0,4","padding":"4"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"onNewVmButtonClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panelPopupImportVm: ["wm.Panel", {"border":"0,0,1,0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","roles":["dev","Administrator"],"verticalAlign":"middle","width":"100%"}, {}, {
					picture11: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/import-vm-24.png","width":"24px"}, {}],
					labelServerScanVm: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Import Virtual Machines","margin":"0,0,0,4","padding":"4"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelServerScanVmClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panel55: ["wm.Panel", {"border":"0,0,1,0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","roles":["dev","Administrator"],"verticalAlign":"middle","width":"100%"}, {}, {
					picture9: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/connect24.png","width":"24px"}, {}],
					labelServerConnect: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Reconnect","height":"26px","margin":"0,0,0,4","padding":"4","width":"202px"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelServerConnectClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panel38: ["wm.Panel", {"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","roles":["dev","Administrator"],"verticalAlign":"middle","width":"100%"}, {}, {
					picture4: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/del-server.png","width":"24px"}, {}],
					labelServerDelete: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Delete Node","margin":"0,0,0,4","padding":"4"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelServerDeleteClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}]
			}]
		}]
	}],
	connectingServerDiag: ["wm.DesignableDialog", {"_classes":{"domNode":["wm_BackgroundChromeBar_Graphite"]},"buttonBarId":"","containerWidgetId":"panel39","footerBorder":"0","height":"50px","noEscape":true,"noMaxify":true,"noMinify":true,"title":"","titlebarBorder":"0","titlebarHeight":"0","width":"230px"}, {}, {
		panel39: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundChromeBar_Graphite"]},"border":"0","height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
			labelWaiting: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_White","wm_TextDecoration_Bold"]},"border":"0","caption":"Trying to add node","padding":"4","width":"170px"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			picture6: ["wm.Picture", {"border":"0","height":"22px","source":"resources/images/icons/loading.gif","width":"31px"}, {}]
		}]
	}],
	VmPopupMenu: ["wm.DesignableDialog", {"_classes":{"domNode":["wm_BorderShadow_StrongShadow","wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px","wm_BackgroundColor_Graphite"]},"buttonBarId":"","containerWidgetId":"panelVmPopupMenu","corner":"bc","footerBorder":"0,0,0,0","height":"334px","modal":false,"noEscape":true,"noMaxify":true,"noMinify":true,"title":"Menu","titlebarBorder":"0,0,0,0","titlebarHeight":"0","width":"190px"}, {"onShow":"onPopupDialogShow"}, {
		panelVmPopupMenu: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel81: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","margin":"5","verticalAlign":"top","width":"100%"}, {}, {
				panelVmStart: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundColor_Graphite"]},"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2","verticalAlign":"middle","width":"100%"}, {}, {
					pictureStartVm: ["wm.Picture", {"border":"0","height":"20px","source":"resources/images/icons/20/start2.png","width":"20px"}, {}],
					labelVmStart: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Power on","margin":"0,0,0,4","padding":"4"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelVmStartClick"}]
				}],
				panelVmStop: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundColor_Graphite"]},"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2","verticalAlign":"middle","width":"100%"}, {}, {
					pictureStopVm: ["wm.Picture", {"border":"0","height":"20px","source":"resources/images/icons/20/system-shutdown.png","width":"20px"}, {}],
					labelVmStop: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_White","wm_Mouse_pointer"]},"border":"0","caption":"Shutdown","margin":"0,0,0,4","padding":"4"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelVmStopClick"}]
				}],
				panelVmReboot: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundColor_Graphite"]},"border":"0,0,1,0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2","verticalAlign":"middle","width":"100%"}, {}, {
					pictureRebootVm: ["wm.Picture", {"border":"0","height":"20px","source":"resources/images/icons/20/system-reboot.png","width":"20px"}, {}],
					labelVmReboot: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer","wm_FontColor_White"]},"border":"0","caption":"Reboot","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelVmRebootClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panelVmPause: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundColor_Graphite"]},"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2","verticalAlign":"middle","width":"100%"}, {}, {
					picturePauseVm: ["wm.Picture", {"border":"0","height":"22px","source":"resources/images/icons/20/pause.png","width":"22px"}, {}],
					labelVmPause: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Pause","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelVmPauseClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panelVmSuspend: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundColor_Graphite"]},"border":"0,0,1,0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2","verticalAlign":"middle","width":"100%"}, {}, {
					pictureSuspendVm: ["wm.Picture", {"border":"0","height":"22px","source":"resources/images/icons/20/suspend.png","width":"22px"}, {}],
					labelVmSuspend: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Suspend","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelVmSuspendClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panelVmKill: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundColor_Graphite"]},"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2","verticalAlign":"middle","width":"100%"}, {}, {
					pictureKillVm: ["wm.Picture", {"border":"0","height":"22px","source":"resources/images/icons/20/stop_20.png","width":"22px"}, {}],
					labelVmKill: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer","wm_FontColor_White"]},"border":"0","caption":"Stop VM","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelVmKillClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				spacer49: ["wm.Spacer", {"height":"3px","roles":["dev","Administrator","PowerUser"],"width":"100%"}, {}],
				panelVmRemove: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundColor_Graphite"]},"border":"1,0,0,0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2","roles":["dev","Administrator","PowerUser"],"verticalAlign":"middle","width":"100%"}, {}, {
					pictureRemoveVm: ["wm.Picture", {"border":"0","height":"22px","source":"resources/images/icons/20/list-remove2.png","width":"22px"}, {}],
					labelVmDelete: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer","wm_FontColor_White"]},"border":"0","caption":"Delete VM","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelVmDeleteClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panelVmRemoveFromInventory: ["wm.Panel", {"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2","roles":["dev","Administrator","PowerUser"],"verticalAlign":"middle","width":"100%"}, {}, {
					pictureRemoveFromVmInventory: ["wm.Picture", {"border":"0","height":"22px","source":"resources/images/icons/20/trash-empty.png","width":"22px"}, {}],
					labelVmRemoveFromInventory: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer","wm_FontColor_White"]},"border":"0","caption":"Remove From Inventory","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelVmRemoveFromInventoryClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				spacer50: ["wm.Spacer", {"height":"3px","roles":["dev","Administrator","PowerUser"],"width":"100%"}, {}],
				panelVmRename: ["wm.Panel", {"border":"1,0,0,0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2","roles":["dev","Administrator","PowerUser"],"verticalAlign":"middle","width":"100%"}, {}, {
					pictureVmRename: ["wm.Picture", {"border":"0","height":"22px","source":"resources/images/icons/20/rename.png","width":"22px"}, {}],
					labelVmRename: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer","wm_FontColor_White"]},"border":"0","caption":"Change Label","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelVmRenameClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}]
			}]
		}]
	}],
	serverRepositoryDialog: ["wm.DesignableDialog", {"buttonBarId":"panel127","containerWidgetId":"containerWidget1","corner":"ccenter","height":"265px","roles":["dev","Administrator"],"title":"New repository","width":"400px"}, {}, {
		containerWidget1: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			panel89: ["wm.Panel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				editRepoName: ["wm.Text", {"caption":"Name:","captionSize":"80px","dataValue":undefined,"displayValue":"","regExp":"^[A-Za-z0-9]+(?:-?_?[A-Za-z0-9]+)+$","required":true,"width":"210px"}, {}]
			}],
			panel90: ["wm.Panel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				selectRepoType: ["wm.SelectMenu", {"caption":"Type:","captionSize":"80px","dataField":"dataValue","displayField":"name","displayValue":"","emptyValue":"emptyString","required":true,"width":"210px"}, {"onchange":"selectRepoTypeChange"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"varRepositoryType","targetProperty":"dataSet"}, {}]
					}]
				}]
			}],
			panel91: ["wm.Panel", {"border":"0","height":"70px","horizontalAlign":"left","verticalAlign":"middle","width":"100%"}, {}, {
				panel126: ["wm.Panel", {"border":"0","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					editRepoTarget: ["wm.Text", {"caption":"Target:","captionSize":"80px","dataValue":"/opt/virtualization/","displayValue":"/opt/virtualization/","required":true,"width":"100%"}, {}],
					btnDefaultVmConfigStorageBrowse: ["wm.Button", {"caption":"Browse","imageIndex":66,"imageList":"app.silkIconList","margin":"4"}, {"onclick":"btnDefaultVmConfigStorageBrowseClick"}]
				}],
				createDirectorybox: ["wm.Checkbox", {"caption":"Create directory on server","captionAlign":"left","captionPosition":"right","captionSize":"180px","dataValue":"true","displayValue":"true","padding":"0,0,0,80","startChecked":true,"width":"280px"}, {}]
			}],
			panelRemoteTarget: ["wm.Panel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"middle","width":"100%"}, {}, {
				editRemoteSource: ["wm.Text", {"caption":"Source:","captionSize":"80px","dataValue":"none","displayValue":"none","emptyValue":"emptyString","required":true,"width":"100%"}, {}]
			}]
		}],
		panel127: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"35px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			btnRepoSave: ["wm.Button", {"caption":"Save","imageIndex":109,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"btnRepoSaveClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":false,"source":"containerWidget1.invalid","targetProperty":"disabled"}, {}]
				}]
			}],
			btnCancel: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"serverRepositoryDialog.hide"}]
		}]
	}],
	listAvailableVmsDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar3","containerWidgetId":"containerWidget3","height":"300px","roles":["dev","Administrator","PowerUser"],"title":"Available virtual machines ","width":"330px"}, {}, {
		containerWidget3: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			panel93: ["wm.HeaderContentPanel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
				gridAvailableVms: ["wm.DojoGrid", {"caseSensitiveSort":false,"columns":[{"show":false,"id":"id","title":"Id","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"name","title":"Name","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"state","title":"State","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"add","title":"Add","width":"40px","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","fieldType":"dojox.grid.cells.Bool"}],"height":"100%","localizationStructure":{},"margin":"4"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"varVmState","targetProperty":"dataSet"}, {}]
					}]
				}],
				liveFormInsertVm: ["wm.LiveForm", {"fitToContentHeight":true,"height":"318px","horizontalAlign":"left","liveEditing":false,"operation":"insert","showing":false,"verticalAlign":"top"}, {"onInsertData":"liveFormInsertVmInsertData"}, {
					binding: ["wm.Binding", {}, {}, {
						wire1: ["wm.Wire", {"expression":undefined,"source":"nameEditor2.dataValue","targetProperty":"dataOutput.displayedname"}, {}],
						wire: ["wm.Wire", {"expression":undefined,"source":"tablevmsLiveVariable2","targetProperty":"dataSet"}, {}]
					}],
					idEditor2: ["wm.Number", {"caption":"Id","captionSize":"200px","formField":"id","height":"26px","required":true,"width":"100%"}, {}],
					memoryEditor1: ["wm.Number", {"caption":"Memory","captionSize":"200px","formField":"memory","height":"26px","required":true,"width":"100%"}, {}],
					nbcpuEditor1: ["wm.Number", {"caption":"Nbcpu","captionSize":"200px","formField":"nbcpu","height":"26px","required":true,"width":"100%"}, {}],
					freqcpuEditor1: ["wm.Number", {"caption":"Freqcpu","captionSize":"200px","formField":"freqcpu","height":"26px","required":true,"width":"100%"}, {}],
					archEditor1: ["wm.Text", {"caption":"Arch","captionSize":"200px","dataValue":undefined,"formField":"arch","height":"26px","required":true,"width":"100%"}, {}],
					networkEditor2: ["wm.Text", {"caption":"Network","captionSize":"200px","dataValue":undefined,"formField":"network","height":"26px","required":true,"width":"100%"}, {}],
					cdromEditor1: ["wm.Text", {"caption":"Cdrom","captionSize":"200px","dataValue":undefined,"formField":"cdrom","height":"26px","required":true,"width":"100%"}, {}],
					nameEditor2: ["wm.Text", {"caption":"Name","captionSize":"200px","dataValue":undefined,"formField":"name","height":"26px","required":true,"width":"100%"}, {}],
					serverEditor1: ["wm.Text", {"caption":"Server","captionSize":"200px","dataValue":undefined,"formField":"server","height":"26px","required":true,"width":"100%"}, {}],
					disksEditor1: ["wm.Text", {"caption":"Disks","captionSize":"200px","dataValue":undefined,"formField":"disks","height":"26px","width":"100%"}, {}],
					displayednameEditor1: ["wm.Text", {"caption":"Displayedname","captionSize":"200px","dataValue":"","emptyValue":"emptyString","formField":"displayedname","height":"26px","required":true,"width":"100%"}, {}],
					liveFormInsertVmEditPanel: ["wm.EditPanel", {"height":"32px","isCustomized":true,"liveForm":"liveFormInsertVm","lock":false,"operationPanel":"operationPanel1","savePanel":"savePanel1"}, {}, {
						savePanel1: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
							saveButton1: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"liveFormInsertVmEditPanel.saveData"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"liveFormInsertVmEditPanel.formInvalid","targetProperty":"disabled"}, {}]
								}]
							}],
							cancelButton1: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"liveFormInsertVmEditPanel.cancelEdit"}]
						}],
						operationPanel1: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							newButton1: ["wm.Button", {"caption":"New","margin":"4"}, {"onclick":"liveFormInsertVmEditPanel.beginDataInsert"}],
							updateButton1: ["wm.Button", {"caption":"Update","margin":"4"}, {"onclick":"liveFormInsertVmEditPanel.beginDataUpdate"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"liveFormInsertVmEditPanel.formUneditable","targetProperty":"disabled"}, {}]
								}]
							}],
							deleteButton1: ["wm.Button", {"caption":"Delete","margin":"4"}, {"onclick":"liveFormInsertVmEditPanel.deleteData"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"liveFormInsertVmEditPanel.formUneditable","targetProperty":"disabled"}, {}]
								}]
							}]
						}]
					}]
				}]
			}]
		}],
		buttonBar3: ["wm.Panel", {"_classes":{"domNode":["dialogfooter","wm_BorderBottomStyle_Curved4px"]},"border":"0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel6: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				addAvailableVmsBtn: ["wm.Button", {"caption":"Add","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"addAvailableVmsBtnClick"}],
				cancelScanVmsBtn: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"listAvailableVmsDialog.hide"}]
			}]
		}]
	}],
	dialogHelp: ["wm.DesignableDialog", {"buttonBarId":"","containerWidgetId":"containerWidget4","height":"500px","modal":false,"noEscape":true,"noMinify":true,"positionNear":"","title":"Help","width":"700px"}, {}, {
		containerWidget4: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			helpText: ["wm.LargeTextArea", {"caption":"Help info","dataValue":undefined,"displayValue":"","height":"100%","margin":"0","readonly":true,"width":"100%"}, {}]
		}],
		buttonBar4: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel273: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BackgroundColor_SteelBlue"]},"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}, {
				bthPrintHelp: ["wm.Button", {"caption":"Print","imageIndex":77,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"bthPrintHelpClick"}]
			}],
			panel27: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BackgroundColor_SteelBlue","wm_BorderBottomStyle_NoCurve"]},"border":"0","height":"100%","horizontalAlign":"right","verticalAlign":"top","width":"100%"}, {}, {
				button2: ["wm.Button", {"caption":"Close","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"dialogHelp.hide"}]
			}]
		}]
	}],
	remoteFileBrowserDiag: ["wm.DesignableDialog", {"buttonBarId":"","containerWidgetId":"panelBrowser","height":"450px","modal":false,"noEscape":true,"noMaxify":true,"noMinify":true,"title":"Remote Browser","width":"700px"}, {"onShow":"remoteFileBrowserDiagShow"}, {
		panelBrowser: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panelBrowserMain: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"7,7,0,7","verticalAlign":"top","width":"100%"}, {}, {
				panelBrowserTools: ["wm.HeaderContentPanel", {"border":"1","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","padding":"0,0,0,5","verticalAlign":"middle","width":"100%"}, {}, {
					pictBrowserUp: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer","wm_BorderShadow_WeakShadow","wm_BackgroundChromeBar_LightGray"]},"border":"0","height":"30px","hint":"Go Up","source":"resources/images/icons/browser/go-up.png","width":"48px"}, {"onMouseOut":"onPictureMouseOut","onMouseOver":"onPictureMouseOver","onclick":"pictBrowserUpClick"}],
					panel125: ["wm.Panel", {"border":"0,0,0,1","height":"80%","horizontalAlign":"left","verticalAlign":"middle","width":"7px"}, {}],
					pictBrowserRefresh: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer","wm_BorderShadow_WeakShadow","wm_BackgroundChromeBar_LightGray"]},"border":"0","height":"30px","hint":"Refresh","source":"resources/images/icons/browser/view-refresh.png","width":"48px"}, {"onMouseOut":"onPictureMouseOut","onMouseOver":"onPictureMouseOver","onclick":"pictBrowserRefreshClick"}],
					panel123: ["wm.Panel", {"border":"0,0,0,1","height":"80%","horizontalAlign":"left","margin":"0,0,0,9","verticalAlign":"middle","width":"18px"}, {}],
					pictBrowserHome: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer","wm_BorderShadow_WeakShadow","wm_BackgroundChromeBar_LightGray"]},"border":"0","height":"30px","hint":"Go Home","source":"resources/images/icons/browser/go-home.png","width":"48px"}, {"onMouseOut":"onPictureMouseOut","onMouseOver":"onPictureMouseOver","onclick":"pictBrowserHomeClick"}],
					panel124: ["wm.Panel", {"border":"0,0,0,1","height":"80%","horizontalAlign":"left","margin":"0,0,0,9","verticalAlign":"middle","width":"18px"}, {}],
					pictBrowserNewFolder: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer","wm_BorderShadow_WeakShadow","wm_BackgroundChromeBar_LightGray"]},"border":"0","height":"30px","hint":"New Folder","source":"resources/images/icons/browser/folder-new.png","width":"48px"}, {"onMouseOut":"onPictureMouseOut","onMouseOver":"onPictureMouseOver"}]
				}],
				panelBrowserPath: ["wm.Panel", {"border":"0,1,0,1","disabled":true,"height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
					browserPath: ["wm.Text", {"caption":"Path:","captionSize":"50px","dataValue":undefined,"disabled":true,"displayValue":"","width":"640px"}, {"onEnterKeyPress":"browserPathEnterKeyPress"}],
					panel151: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"border":"1","height":"24px","horizontalAlign":"center","padding":"1,0,0,0","verticalAlign":"middle","width":"32px"}, {}, {
						pictBrowserLoading: ["wm.Picture", {"border":"0","height":"18px","showing":false,"source":"resources/images/icons/loading/ajax-loader-indicator-small.gif","width":"18px"}, {}]
					}]
				}],
				panelBrowserBody: ["wm.HeaderContentPanel", {"border":"0,1,0,1","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					spacer20: ["wm.Spacer", {"height":"100%","width":"10px"}, {}],
					browserGrid: ["wm.DojoGrid", {"columns":[{"show":false,"id":"type","title":"target","width":"35px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"icon","title":"Type","width":"35px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"name","title":"Name","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"owner","title":"Owner","width":"60px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"group","title":"Group","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"size","title":"Size","width":"60px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"modified","title":"Modified","width":"70px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"rights","title":"Rights","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","margin":"4"}, {"onCellDblClick":"browserGridCellDblClick","onClick":"browserGridClick"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"varBrowserFileList","targetProperty":"dataSet"}, {}]
						}]
					}],
					panelBrowserDetails: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px"]},"border":"1","height":"100%","horizontalAlign":"left","margin":"4,0,4,0","verticalAlign":"top","width":"140px"}, {}, {
						panelDetailsTitle: ["wm.Panel", {"border":"0,0,1,0","height":"30px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
							labelBrowserDetailTitle: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black"]},"border":"0","caption":"File Information","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						fileInfoTextArea: ["wm.LargeTextArea", {"captionSize":"0px","dataValue":undefined,"displayValue":"","height":"100%","readonly":true,"width":"100%"}, {}],
						panel141: ["wm.Panel", {"border":"1,0,1,0","height":"30px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
							label43: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black"]},"border":"0","caption":"Qemu Information","padding":"4"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						qemuInfoTextArea: ["wm.LargeTextArea", {"captionSize":"0px","dataValue":undefined,"displayValue":"","height":"100px","readonly":true,"width":"100%"}, {}]
					}],
					spacer21: ["wm.Spacer", {"height":"100%","width":"10px"}, {}]
				}],
				panelBrowserSelection: ["wm.Panel", {"border":"0,1,0,1","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					BrowserSelection: ["wm.Text", {"caption":"Selection:","captionSize":"80px","dataValue":undefined,"displayValue":"","readonly":true,"width":"100%"}, {}],
					spacer23: ["wm.Spacer", {"height":"100%","width":"10px"}, {}]
				}]
			}],
			panelBrowserButtons: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				browserBtnOpen: ["wm.Button", {"caption":"Open","imageIndex":52,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"browserBtnOpenClick"}],
				spacer19: ["wm.Spacer", {"height":"100%","width":"100%"}, {}],
				panelBrowserBtnLeft: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"210px"}, {}, {
					browserBtnSelect: ["wm.Button", {"caption":"Select","disabled":true,"imageIndex":88,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"browserBtnSelectClick"}],
					browserBtnCancel: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"browserBtnCancelClick"}]
				}]
			}]
		}]
	}],
	selectNodeToDel: ["wm.DesignableDialog", {"buttonBarId":"buttonBar1","containerWidgetId":"containerWidget5","height":"150px","noEscape":true,"noMaxify":true,"noMinify":true,"roles":["dev","Administrator"],"title":"Delete Node","width":"400px"}, {}, {
		containerWidget5: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			panel131: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				selectNode: ["wm.SelectMenu", {"caption":"Select Node:","captionSize":"80px","dataField":"dataValue","displayField":"dataValue","displayValue":"","required":true}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"varServerList","targetProperty":"dataSet"}, {}]
					}]
				}],
				deleteNode: ["wm.Button", {"caption":"Delete","margin":"4"}, {"onclick":"deleteNodeClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":false,"source":"panel131.invalid","targetProperty":"disabled"}, {}]
					}]
				}]
			}]
		}],
		buttonBar1: ["wm.Panel", {"_classes":{"domNode":["dialogfooter","wm_BorderBottomStyle_Curved4px"]},"border":"0","height":"35px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel130: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				cancelDeleteNodeBtn: ["wm.Button", {"caption":"Cancel","height":"30px","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"selectNodeToDel.hide"}]
			}]
		}]
	}],
	newStorageDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar5","containerWidgetId":"containerWidget6","height":"260px","roles":["dev","Administrator","PowerUser"],"title":"New storage","width":"420px"}, {"onClose":"newStorageDialogClose"}, {
		containerWidget6: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent","wm_BackgroundColor_VeryLightGray"]},"height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
			panel152: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","margin":"0,10,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel19: ["wm.Panel", {"border":"0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
					labelVmStorageType: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"autoSizeWidth":true,"border":"0","caption":"<b><u>Type</u></b>","padding":"4","width":"41px"}, {"onclick":"labelVmStorageTypeClick"}],
					spacerLabelVmStorageType: ["wm.Spacer", {"height":"100%","width":"20px"}, {}],
					labelVmStorageSource: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"autoSizeWidth":true,"border":"0","caption":"Source","padding":"4","width":"51px"}, {"onclick":"labelVmStorageSourceClick"}],
					spacerLabelVmStorageSource: ["wm.Spacer", {"height":"100%","width":"20px"}, {}],
					labelVmStorageOpts: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"autoSizeWidth":true,"border":"0","caption":"Options","padding":"4","width":"55px"}, {"onclick":"labelVmStorageOptsClick"}],
					spacerLabelVmStorageOpts: ["wm.Spacer", {"height":"100%","width":"20px"}, {}]
				}],
				wizardVmStorage: ["wm.Layers", {"defaultLayer":0,"transition":"slide"}, {}, {
					layerVmStorageType: ["wm.Layer", {"borderColor":"","caption":"Type","horizontalAlign":"left","margin":"0","padding":"0","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
						panelStorageType: ["wm.MainContentPanel", {"borderColor":"#b3b8c4","height":"140px","horizontalAlign":"left","margin":"0","padding":"20,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
							selectStorageType: ["wm.SelectMenu", {"caption":"Storage Type:","dataField":"name","displayField":"name","displayValue":"","required":true}, {"onchange":"selectStorageTypeChange"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"varStorageType","targetProperty":"dataSet"}, {}]
								}]
							}],
							panelSelectDisk: ["wm.Panel", {"border":"0","borderColor":"#b3b8c4","height":"80px","horizontalAlign":"left","padding":"15","verticalAlign":"middle","width":"100%"}, {}, {
								radioNewDisk: ["wm.RadioButton", {"caption":"Create a new virtual disk","captionAlign":"left","captionPosition":"right","captionSize":"180px","checkedValue":"on","dataType":"boolean","displayValue":true,"emptyValue":"false","radioGroup":"virtualDisk","startChecked":true,"width":"200px"}, {"onchange":"onRadioDiskButtonChange"}],
								radioUseDisk: ["wm.RadioButton", {"caption":"Use an existing virtual disk","captionAlign":"left","captionPosition":"right","captionSize":"180px","checkedValue":"on","dataType":"boolean","displayValue":false,"emptyValue":"false","radioGroup":"virtualDisk","width":"200px"}, {"onchange":"onRadioDiskButtonChange"}]
							}]
						}]
					}],
					layerVmStorageSource: ["wm.Layer", {"borderColor":"","caption":"Source","horizontalAlign":"left","margin":"0","padding":"0","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
						panelVmStorageSource: ["wm.MainContentPanel", {"borderColor":"#b3b8c4","height":"140px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"10,0,0,0","verticalAlign":"top","width":"100%"}, {}, {
							layersNewStorages: ["wm.Layers", {}, {}, {
								newDiskLayer: ["wm.Layer", {"_classes":{"domNode":["MainContent"]},"borderColor":"","caption":"layer1","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top"}, {}, {
									panelUseExistingDisk: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"15","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
										label47: ["wm.Label", {"border":"0","caption":"Image location:","padding":"4"}, {}],
										panel138: ["wm.Panel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
											spacer24: ["wm.Spacer", {"height":"100px","width":"5px"}, {}],
											newStorageSelectDisk: ["wm.Text", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"caption":"Image path","captionSize":"0px","dataValue":"","displayValue":"","emptyValue":"emptyString","width":"270px"}, {"onchange":"newStorageSelectDiskChange"}],
											newDiskBrowseBtn: ["wm.Button", {"caption":"Browse","height":"24px","imageIndex":66,"imageList":"app.silkIconList","margin":"0,0,0,7"}, {"onclick":"newDiskBrowseBtnClick"}]
										}]
									}],
									panelNewDisk: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"10,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
										panel46: ["wm.Panel", {"border":"0","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
											newStorageSizeEditor: ["wm.Number", {"caption":"Size in GB","captionAlign":"left","captionSize":"90px","displayValue":"6","maximum":300,"minimum":4,"required":true,"spinnerButtons":true,"width":"140px"}, {}],
											newStorageAllocateSpace: ["wm.Checkbox", {"caption":"Allocate All Space ","captionAlign":"left","captionPosition":"right","captionSize":"135px","dataValue":"true","disabled":true,"displayValue":"true","padding":"0,0,0,30","startChecked":true,"width":"180px"}, {}]
										}],
										newStorageDeviceType: ["wm.SelectMenu", {"caption":"File Type:","captionAlign":"left","captionSize":"90px","dataField":"dataValue","displayField":"name","displayValue":"","emptyValue":"emptyString","height":"26px"}, {"onchange":"newStorageDeviceTypeChange"}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"expression":undefined,"source":"varFileType","targetProperty":"dataSet"}, {}]
											}]
										}],
										selectStorageName: ["wm.SelectMenu", {"caption":"Storage name:","captionAlign":"left","captionSize":"90px","dataField":"target","displayField":"name","displayValue":"","emptyValue":"emptyString"}, {}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"expression":undefined,"source":"varStorages","targetProperty":"dataSet"}, {}]
											}]
										}]
									}]
								}],
								newCdromLayer: ["wm.Layer", {"_classes":{"domNode":["MainContent"]},"borderColor":"","caption":"layer1","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top"}, {}, {
									panel136: ["wm.Panel", {"border":"0","borderColor":"","height":"170px","horizontalAlign":"left","imageList":"app.silkIconList","margin":"0","verticalAlign":"top","width":"100%"}, {}, {
										label46: ["wm.Label", {"border":"0","caption":"CDRom source:","padding":"4,4,4,10"}, {}],
										newStorageRadioEmpty: ["wm.RadioButton", {"caption":"Empty","captionAlign":"left","captionPosition":"right","captionSize":"110px","checkedValue":true,"dataType":"boolean","displayValue":false,"emptyValue":"false","padding":"0,0,0,20","width":"150px"}, {"onchange":"newStorageRadioEmptyChange"}],
										newStorageRadioPhysical: ["wm.RadioButton", {"caption":"Physical device","captionAlign":"left","captionPosition":"right","captionSize":"110px","checkedValue":true,"dataType":"boolean","displayValue":false,"emptyValue":"false","height":"34px","padding":"0,0,0,20","showing":false,"width":"150px"}, {}],
										panel137: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"58px","horizontalAlign":"left","verticalAlign":"middle","width":"380px"}, {}, {
											newStorageRadioISO: ["wm.RadioButton", {"caption":"Image :","captionAlign":"left","captionPosition":"right","captionSize":"65px","checkedValue":true,"dataType":"boolean","displayValue":false,"emptyValue":"false","padding":"0,0,0,20","width":"105px"}, {"onchange":"newStorageRadioISOChange"}],
											panelNewStorageSelectIso: ["wm.Panel", {"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
												spacer27: ["wm.Spacer", {"height":"100%","width":"15px"}, {}],
												newStorageSelectIso: ["wm.Text", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"caption":"Image path","captionSize":"0px","dataValue":"","displayValue":"","emptyValue":"emptyString","required":true,"width":"100%"}, {"onchange":"newStorageSelectIsoChange"}],
												newIsoBrowseBtn: ["wm.Button", {"caption":"Search","disabled":true,"height":"24px","imageIndex":66,"margin":"0,0,0,7"}, {"onclick":"newIsoBrowseBtnClick"}],
												spacer26: ["wm.Spacer", {"height":"100%","width":"10px"}, {}]
											}]
										}]
									}]
								}]
							}]
						}]
					}],
					layerVmStorageOptions: ["wm.Layer", {"borderColor":"","caption":"Options","horizontalAlign":"left","margin":"0","padding":"0","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
						panelStorageOpts: ["wm.MainContentPanel", {"borderColor":"#b3b8c4","height":"140px","horizontalAlign":"left","margin":"0","padding":"10,0,0,0","verticalAlign":"top","width":"100%"}, {}, {
							panelAdvancedStorageOpt: ["wm.Panel", {"border":"0","height":"120px","horizontalAlign":"left","padding":"0,10,0,10","verticalAlign":"top","width":"100%"}, {}, {
								panel48: ["wm.Panel", {"border":"0,0,1,0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
									newStorageDeviceName: ["wm.Text", {"caption":"File Name:","captionAlign":"left","captionSize":"90px","dataValue":"toto","displayValue":"toto","emptyValue":"emptyString","height":"30px","padding":"5,2,5,2","required":true,"width":"345px"}, {}],
									picEditFileName: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"30px","hint":"Edit file name","padding":"5,0,0,0","source":"resources/images/icons/actions/document-edit-16.png","width":"24px"}, {"onclick":"picEditFileNameClick"}]
								}],
								selectCacheOption: ["wm.SelectMenu", {"caption":"Caching:","captionAlign":"left","captionSize":"90px","dataField":"dataValue","displayField":"dataValue","displayValue":"","emptyValue":"emptyString","height":"30px","padding":"5,2,5,2","required":true,"width":"230px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"varDiskCache","targetProperty":"dataSet"}, {}]
									}]
								}],
								newStorageDeviceBusType: ["wm.SelectMenu", {"caption":"Bus type:","captionAlign":"left","captionSize":"90px","dataField":"dataValue","displayField":"dataValue","displayValue":"","height":"30px","padding":"5,2,5,2","required":true,"width":"230px"}, {"onchange":"newStorageDeviceBusTypeChange"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"varBusTypeList","targetProperty":"dataSet"}, {}]
									}]
								}],
								newStorageDeviceBusName: ["wm.SelectMenu", {"caption":"Bus id:","captionAlign":"left","captionSize":"90px","dataField":"dataValue","displayField":"dataValue","displayValue":"","height":"30px","padding":"5,2,5,2","required":true,"width":"230px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"varBusList","targetProperty":"dataSet"}, {}]
									}]
								}]
							}]
						}]
					}]
				}]
			}]
		}],
		buttonBar5: ["wm.Panel", {"_classes":{"domNode":["dialogfooter","wm_BorderBottomStyle_Curved4px"]},"border":"0","height":"35px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel133: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,10,0,10","verticalAlign":"top","width":"100%"}, {}, {
				newStorageCancel: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"newStorageDialog.hide"}],
				panel140: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}],
				newStorageBack: ["wm.Button", {"caption":"Back","imageIndex":3,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"newStorageBackClick"}],
				newStorageSave: ["wm.Button", {"caption":"Done","imageIndex":88,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"newStorageSaveClick"}]
			}]
		}]
	}],
	confirmDialog: ["wm.GenericDialog", {"button1Caption":"OK","button1Close":true,"button2Caption":"Cancel","button2Close":true,"corner":"ccenter","enterKeyIsButton1":false,"height":"106px","noMaxify":true,"noMinify":true,"positionNear":"","title":"Please confirm ..."}, {"onButton1Click":"confirmDialogButton1Click"}],
	editNetworkDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget8","height":"320px","roles":["dev","Administrator","PowerUser"],"title":"Add network interface","width":"410px"}, {"onShow":"editNetworkDialogShow"}, {
		containerWidget8: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
			panel157: ["wm.MainContentPanel", {"border":"0,1,0,1","height":"100%","horizontalAlign":"left","margin":"0,10,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panelVmNetworkConfig: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center","padding":"4","verticalAlign":"middle","width":"100%"}, {}, {
					panelVmNetworkWarning: ["wm.Panel", {"border":"0","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
						picture21: ["wm.Picture", {"border":"0","height":"30px","source":"resources/images/icons/dialog-warning-30.png","width":"30px"}, {}],
						labelWarningVmNetwork: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Red"]},"border":"0","caption":"<i>There is no Virtual Network available.<br> You should check the Node's configuration.</i>","height":"40px","padding":"4","singleLine":false,"width":"100%"}, {}]
					}],
					label76: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_FontColor_SteelBlue"]},"border":"1,1,0,1","caption":"Network connection","margin":"0,160,0,0","padding":"0,0,0,10","width":"330px"}, {}],
					panel231: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"border":"1","height":"90px","horizontalAlign":"center","verticalAlign":"middle","width":"95%"}, {}, {
						selectBridge: ["wm.SelectMenu", {"caption":"Virtual Network:","captionAlign":"left","captionSize":"120px","dataField":"All Fields","displayField":"display","displayValue":"","helpText":"Select a Network on Node to which the Virtual Interface will be connected.","required":true,"width":"320px"}, {"onchange":"selectBridgeChange"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"varNetworkInterfaces","targetProperty":"dataSet"}, {}]
							}]
						}],
						selectNetworkType: ["wm.SelectMenu", {"caption":"Type:","captionAlign":"left","captionSize":"120px","dataField":"dataValue","displayField":"name","displayValue":"","margin":"0,20,0,0","readonly":true,"required":true,"width":"320px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"varNetworkDeviceType","targetProperty":"dataSet"}, {}]
							}]
						}],
						checkLinkStatus: ["wm.Checkbox", {"caption":"Enable on boot","captionAlign":"left","captionSize":"122px","dataValue":"true","displayValue":"true","helpText":"Uncheck to <b>disable</b> a network interface at boot time.<br><i>Once disabled, a network interface cannot be connected while the Virtual Machine is running.</i>","startChecked":true,"width":"320px"}, {}]
					}],
					spacer30: ["wm.Spacer", {"height":"15px","width":"96px"}, {}],
					label77: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_FontColor_SteelBlue"]},"border":"1,1,0,1","caption":"Virtual Interface","margin":"0,160,0,0","padding":"0,0,0,10","width":"330px"}, {}],
					panel232: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px"]},"border":"1","height":"70px","horizontalAlign":"center","verticalAlign":"middle","width":"95%"}, {}, {
						selectNetDevice: ["wm.SelectMenu", {"caption":"Virtual Adapter:","captionAlign":"left","captionSize":"120px","dataField":"dataValue","displayField":"name","displayValue":"","helpText":"Select the emulated device exposed to the guest OS.</br> <b>Note:</b> <br> - VirtIO device will provide the best performances, however you have to make sure that the appropriate driver is available for your guest OS. <br> - pcnet32 device will work on virtually any OS.","required":true,"width":"320px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"varNetworkDevices","targetProperty":"dataSet"}, {}]
							}]
						}],
						editMac: ["wm.Text", {"caption":"MAC Address:","captionAlign":"left","captionSize":"120px","dataValue":undefined,"displayValue":"","margin":"0,20,0,0","width":"320px"}, {}]
					}]
				}]
			}]
		}],
		buttonBar6: ["wm.Panel", {"_classes":{"domNode":["dialogfooter","wm_BorderBottomStyle_Curved4px"]},"border":"0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel158: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				newNetworkSave: ["wm.Button", {"caption":"Apply","imageIndex":109,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"newNetworkSaveClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"panelVmNetworkConfig.invalid","targetProperty":"disabled"}, {}]
					}]
				}],
				newNetworkCancel: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"newNetworkCancelClick"}]
			}]
		}]
	}],
	MenuDialogCenter: ["wm.DesignableDialog", {"_classes":{"domNode":["wm_BorderShadow_StrongShadow","wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px","wm_BackgroundColor_Graphite"]},"buttonBarId":"","containerWidgetId":"panel12","corner":"bc","footerBorder":"0,0,0,0","height":"124px","modal":false,"noEscape":true,"noMaxify":true,"noMinify":true,"title":"Menu","titlebarBorder":"0,0,0,0","titlebarHeight":"0","width":"160px"}, {}, {
		panel12: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"78px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
			panel14: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"78px","horizontalAlign":"left","margin":"5","verticalAlign":"middle","width":"100%"}, {}, {
				panel35: ["wm.Panel", {"border":"0,0,0,0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2","roles":["dev","Administrator"],"verticalAlign":"middle","width":"100%"}, {}, {
					picture2: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/add-server24.png","width":"24px"}, {}],
					labelCenterAddNewServer: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Add Node","margin":"0,0,0,6","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelCenterAddNewServerClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panel145: ["wm.Panel", {"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
					picture12: ["wm.Picture", {"border":"0","height":"30px","margin":"0","source":"resources/images/icons/reload.png","width":"30px"}, {}],
					labelCenterReload: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Reload","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelCenterReloadClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}]
			}]
		}]
	}],
	nodeNetworkDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget9","height":"500px","roles":["dev","Administrator"],"title":"Add a Virtual Switch","width":"480px"}, {}, {
		containerWidget9: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
			panelNewNodeInterface: ["wm.MainContentPanel", {"border":"0,1,0,1","height":"100%","horizontalAlign":"left","margin":"0,10,0,10","padding":"15,10,15,10","verticalAlign":"top","width":"100%"}, {}, {
				panel135: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"124px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
					label16: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px"]},"border":"1,1,0,1","caption":"General Settings","margin":"0,0,0,20","padding":"0,0,0,10","width":"300px"}, {}],
					panel236: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"border":"1","height":"100px","horizontalAlign":"left","padding":"7,0,0,40","verticalAlign":"top","width":"100%"}, {}, {
						panel71: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							textInterfaceNaming: ["wm.Text", {"caption":"Network Name: ","captionAlign":"left","captionSize":"130px","dataValue":undefined,"displayValue":"","regExp":"^[A-Za-z0-9]+(?:-?_?[A-Za-z0-9]+)+$","required":true,"width":"340px"}, {"onchange":"textInterfaceNamingChange"}],
							btnNodeEditVirtualNetwork: ["wm.Button", {"caption":"","height":"24px","hint":"Change Virtual Switch name","imageIndex":75,"imageList":"app.silkIconsOpenkvi","margin":"2","showing":false,"width":"24px"}, {"onclick":"btnNodeEditVirtualNetworkClick"}]
						}],
						spacer10: ["wm.Spacer", {"height":"5px","width":"100%"}, {}],
						selectInterfaceType: ["wm.SelectMenu", {"caption":"Connection Type: ","captionAlign":"left","captionSize":"130px","dataField":"dataValue","displayField":"name","displayValue":"","required":true,"width":"340px"}, {"onchange":"selectInterfaceTypeChange"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"varNetworkDeviceType","targetProperty":"dataSet"}, {}]
							}]
						}],
						spacer29: ["wm.Spacer", {"height":"5px","width":"100%"}, {}],
						selectInterfaceTarget: ["wm.SelectMenu", {"caption":"Host network: ","captionAlign":"left","captionSize":"130px","dataField":"dataValue","disabled":true,"displayField":"name","displayValue":"","required":true,"width":"340px"}, {"onchange":"selectInterfaceTargetChange"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"varNetworkTargets","targetProperty":"dataSet"}, {}]
							}]
						}]
					}]
				}],
				spacer5: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
				panel265: ["wm.Panel", {"border":"0","borderColor":"#b3b8c4","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
					label17: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px"]},"border":"1,1,0,1","caption":"Portgroups","margin":"0,0,0,20","padding":"0,0,0,10","width":"300px"}, {}],
					panel266: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"border":"1","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						panel267: ["wm.Panel", {"border":"0,2,0,0","borderColor":"#b3b8c4","height":"100%","horizontalAlign":"left","padding":"1","verticalAlign":"top","width":"180px"}, {}, {
							panel69: ["wm.Panel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
								htmlPortgroupList: ["wm.Html", {"_classes":{"domNode":["wm_BackgroundColor_White"]},"border":"0","height":"100%","padding":"8"}, {}]
							}],
							panel268: ["wm.Panel", {"border":"1,0,0,0","borderColor":"#b3b8c4","height":"34px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								btnAddPortgroup: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"","hint":"Add a new Portgroup","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"32px"}, {"onclick":"btnAddPortgroupClick"}],
								btnRemovePortgroup: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"","hint":"Remove selected Portgroup","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"32px"}, {"onclick":"btnRemovePortgroupClick"}]
							}]
						}],
						panelPortgroupConfig: ["wm.Panel", {"border":"0","borderColor":"#b3b8c4","height":"100%","horizontalAlign":"left","padding":"20,10,20,10","verticalAlign":"top","width":"100%"}, {}, {
							textPortgroupName: ["wm.Text", {"caption":"Name:","captionAlign":"left","captionSize":"60px","changeOnKey":true,"dataValue":undefined,"displayValue":"","maxChars":"19","regExp":"^[A-Za-z0-9]+(?:-?_?[A-Za-z0-9]+)+$","width":"220px"}, {"onchange":"textPortgroupNameChange"}],
							spacer6: ["wm.Spacer", {"height":"10px","width":"100%"}, {}],
							checkPortgroupIsDefault: ["wm.Checkbox", {"caption":"Default Portgroup:","captionAlign":"left","captionSize":"125px","dataValue":"","displayValue":"","width":"150px"}, {"onchange":"checkPortgroupIsDefaultChange"}],
							spacer7: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
							checkPortGroupVlan: ["wm.Checkbox", {"caption":"Use VLAN tagging:","captionAlign":"left","captionSize":"125px","dataValue":"","displayValue":"","width":"150px"}, {"onchange":"checkPortGroupVlanChange"}],
							numPortGroupVlanId: ["wm.Number", {"caption":"Tag ID:","captionAlign":"left","captionSize":"60px","displayValue":"","emptyValue":"zero","maximum":4094,"minimum":1,"spinnerButtons":true,"width":"145px"}, {"onchange":"numPortGroupVlanIdChange"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"checkPortGroupVlan.dataValue","targetProperty":"showing"}, {}]
								}]
							}]
						}]
					}]
				}]
			}]
		}],
		buttonBar7: ["wm.Panel", {"_classes":{"domNode":["dialogfooter","wm_BorderBottomStyle_Curved4px"]},"border":"0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel170: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				nodeNetworkBtnSave: ["wm.Button", {"caption":"Apply","imageIndex":109,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"nodeNetworkBtnSaveClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"panelNewNodeInterface.invalid","targetProperty":"disabled"}, {}]
					}]
				}],
				nodeNetworkBtnCancel: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"nodeNetworkDialog.hide"}]
			}]
		}]
	}],
	vmGraphicDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget10","height":"210px","roles":["dev","Administrator","PowerUser"],"title":"New graphic interface","width":"280px"}, {}, {
		containerWidget10: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
			panelVmGraphics: ["wm.MainContentPanel", {"border":"0,1,0,1","height":"100%","horizontalAlign":"left","margin":"0,10,0,10","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
				selectGraphicType: ["wm.SelectMenu", {"caption":"Type :","dataField":"dataValue","displayField":"name","displayValue":"","required":true,"width":"200px"}, {"onchange":"selectGraphicTypeChange"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"varGraphicTypes","targetProperty":"dataSet"}, {}]
					}]
				}],
				spacer39: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
				textGraphicAddress: ["wm.Text", {"caption":"Listen :","dataValue":"0.0.0.0","displayValue":"0.0.0.0","emptyValue":"emptyString","required":true,"width":"200px"}, {}],
				textGraphicDisplay: ["wm.SelectMenu", {"caption":"Listen :","displayValue":"","showing":false,"width":"200px"}, {}],
				spacer40: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
				textGraphicPort: ["wm.Text", {"caption":"Port :","dataValue":"autoport","displayValue":"autoport","emptyValue":"emptyString","width":"200px"}, {}],
				spacer41: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
				selectGraphicKeymap: ["wm.SelectMenu", {"caption":"Keymap :","dataField":"dataValue","displayField":"dataValue","displayValue":"","required":true,"width":"200px"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"varKeymaps","targetProperty":"dataSet"}, {}]
					}]
				}]
			}]
		}],
		buttonBar8: ["wm.Panel", {"_classes":{"domNode":["dialogfooter","wm_BorderBottomStyle_Curved4px"]},"border":"0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel175: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				vmGraphicBtnSave: ["wm.Button", {"caption":"OK","imageIndex":109,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"vmGraphicBtnSaveClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"panelVmGraphics.invalid","targetProperty":"disabled"}, {}]
					}]
				}],
				vmGraphicBtnCancel: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"vmGraphicDialog.hide"}]
			}]
		}]
	}],
	VmPopupMenuRemove: ["wm.DesignableDialog", {"_classes":{"domNode":["wm_BorderShadow_StrongShadow","wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px","wm_BackgroundColor_Graphite"]},"buttonBarId":"","containerWidgetId":"panelVmPopupMenu","corner":"bc","footerBorder":"0,0,0,0","height":"50px","modal":false,"noEscape":true,"noMaxify":true,"noMinify":true,"roles":["dev","Administrator","PowerUser"],"title":"Menu","titlebarBorder":"0,0,0,0","titlebarHeight":"0","width":"190px"}, {}, {
		panel82: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
			panelVmRemoveDisabled: ["wm.Panel", {"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2","verticalAlign":"middle","width":"100%"}, {}, {
				pictureRemoveDisabledVm: ["wm.Picture", {"border":"0","height":"20px","source":"resources/images/icons/20/trash-empty.png","width":"20px"}, {}],
				labelDisabledlVmDelete: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Remove From Inventory","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelDisabledlVmDeleteClick"}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}]
		}]
	}],
	loadingDialogVm: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"layerVirtualMachines","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	loadingDialogDetachConsole: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"htmlNodeDashboard","targetProperty":"widgetToCover"}, {}],
			wire1: ["wm.Wire", {"expression":undefined,"source":"javaGetVmDisplay","targetProperty":"serviceVariableToTrack"}, {}]
		}]
	}],
	sessionExpiredDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget11","height":"125px","noEscape":true,"noMaxify":true,"noMinify":true,"title":"Warning","width":"450px"}, {}, {
		containerWidget11: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
			pictureSessionExpired: ["wm.Picture", {"border":"0","height":"47px","source":"resources/images/icons/dialog-warning-45.png","width":"47px"}, {}],
			labelSessionInfo: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_FontColor_Red"]},"border":"0","caption":"Your session has expired, please reauthenticate.","height":"100%","margin":"0,0,0,5","padding":"4","width":"100%"}, {}]
		}],
		buttonBar9: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			btnExitApp: ["wm.Button", {"caption":"OK","imageIndex":0,"margin":"4"}, {"onclick":"btnExitAppClick"}]
		}]
	}],
	loadingDialogConsole: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"panelVmScreen","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	vmInputDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget7","height":"150px","roles":["dev","Administrator","PowerUser"],"title":"New input device","width":"300px"}, {}, {
		containerWidget7: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","verticalAlign":"top","width":"100%"}, {}, {
			panelVmInput: ["wm.MainContentPanel", {"border":"0,1,0,1","height":"100%","horizontalAlign":"left","margin":"0,10,0,10","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
				selectInputType: ["wm.SelectMenu", {"caption":"Type :","dataField":"dataValue","displayField":"name","displayValue":"","required":true,"width":"200px"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"varInputTypes","targetProperty":"dataSet"}, {}]
					}]
				}],
				spacer51: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
				selectInputBus: ["wm.SelectMenu", {"caption":"Bus ","dataField":"dataValue","displayField":"name","displayValue":"","required":true,"width":"200px"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"varInputBuses","targetProperty":"dataSet"}, {}]
					}]
				}]
			}]
		}],
		buttonBar10: ["wm.Panel", {"_classes":{"domNode":["dialogfooter","wm_BorderBottomStyle_Curved4px"]},"border":"0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel178: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				vmInputBtnSave: ["wm.Button", {"caption":"OK","imageIndex":88,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"vmInputBtnSaveClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"panelVmInput.invalid","targetProperty":"disabled"}, {}]
					}]
				}],
				vmInputBtnCancel: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"vmInputDialog.hide"}]
			}]
		}]
	}],
	renameVmDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBarRenameVm","containerWidgetId":"containerWidgetRenameVm","height":"160px","title":"Change displayed name","width":"350px"}, {}, {
		containerWidgetRenameVm: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
			panelRenameVm: ["wm.Panel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				renameVmName: ["wm.Text", {"caption":"Name:","captionSize":"90px","dataValue":undefined,"displayValue":"","invalidMessage":"name already exists","regExp":"^[A-Za-z0-9]+(?:-?_?[A-Za-z0-9]+)+$","required":true,"width":"270px"}, {"onchange":"renameVmNameChange"}]
			}],
			spacer61: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
			vmRenameNoteText: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_FontColor_SteelBlue"]},"captionAlign":"center","dataValue":"<small><i>Note that this will only affect the Virtual Machine name as displayed in OpenKVI</i></small>","displayValue":"<small><i>Note that this will only affect the Virtual Machine name as displayed in OpenKVI</i></small>","height":"40px","padding":"0,10,0,25","readonly":true,"width":"100%"}, {}]
		}],
		buttonBarRenameVm: ["wm.Panel", {"_classes":{"domNode":["dialogfooter","wm_BorderBottomStyle_Curved4px"]},"border":"0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel113: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				btnRenameVmSave: ["wm.Button", {"caption":"Apply","imageIndex":109,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"btnRenameVmSaveClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"panelRenameVm.invalid","targetProperty":"disabled"}, {}]
					}]
				}],
				btnRenameVmCancel: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"renameVmDialog.hide"}]
			}]
		}]
	}],
	listAvailableNodes: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget12","height":"300px","roles":["dev","Administrator","PowerUser"],"title":"Available Nodes","width":"400px"}, {}, {
		containerWidget12: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			panelAvailableNodes: ["wm.HeaderContentPanel", {"autoScroll":true,"height":"100%","horizontalAlign":"center","verticalAlign":"middle","width":"100%"}, {}, {
				layersAvailableNodes: ["wm.Layers", {"defaultLayer":0}, {}, {
					layerWaitNodeList: ["wm.Layer", {"_classes":{"domNode":["MainContent","wm_BackgroundColor_VeryLightGray"]},"borderColor":"","horizontalAlign":"center","padding":"0","themeStyleType":"","verticalAlign":"middle"}, {}, {
						pictureWaitNodeList: ["wm.Picture", {"border":"0","height":"32px","source":"resources/images/icons/loading/ajax-loader-indictor-big.gif","width":"32px"}, {}]
					}],
					layerNodeList: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"left","padding":"0","themeStyleType":"","verticalAlign":"top"}, {}, {
						gridAvailableNodes: ["wm.DojoGrid", {"_classes":{"domNode":["wm_Mouse_pointer"]},"caseSensitiveSort":false,"columns":[{"show":true,"id":"name","title":"Name","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"ip","title":"IP","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"type","title":"Type","width":"50px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","localizationStructure":{},"margin":"4"}, {"onCellDblClick":"gridAvailableNodesCellDblClick","onClick":"gridAvailableNodesClick"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"varAvailableNodes","targetProperty":"dataSet"}, {}]
							}]
						}]
					}]
				}]
			}]
		}],
		buttonBar11: ["wm.Panel", {"_classes":{"domNode":["dialogfooter","wm_BorderBottomStyle_Curved4px"]},"border":"0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel44: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				addSelectedNode: ["wm.Button", {"caption":"Add","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"addSelectedNodeClick"}],
				doneProbeNodes: ["wm.Button", {"caption":"Close","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"listAvailableNodes.hide"}]
			}]
		}]
	}],
	snapshotPopup: ["wm.DesignableDialog", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px","wm_BorderShadow_StrongShadow","wm_BackgroundColor_Graphite"]},"buttonBarId":"","containerWidgetId":"containerWidget13","height":"192px","modal":false,"noEscape":true,"noMaxify":true,"noMinify":true,"title":"","width":"200px"}, {}, {
		containerWidget13: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent","wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px","wm_BackgroundColor_Graphite"]},"autoScroll":true,"fitToContentHeight":true,"height":"180px","horizontalAlign":"left","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			panel77: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"170px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
				panelPopupCreateSnapshot: ["wm.Panel", {"border":"0,0,1,0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
					pictureCreateSnapshot: ["wm.Picture", {"border":"0","height":"24px","imageIndex":0,"imageList":"","source":"resources/images/icons/actions/snapshot_create_24.png","width":"24px"}, {}],
					labelSnapshotCreate: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"New Snapshot","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelSnapshotCreateClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panelPopupRollbackSnapshot: ["wm.Panel", {"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
					pictureRollbackSnapshot: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/actions/snapshot_rollback_24.png","width":"24px"}, {}],
					labelSnapshotRollback: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Rollback","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelSnapshotRollbackClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panelPopupDeleteSnapshot: ["wm.Panel", {"border":"0,0,1,0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
					pictureDeleteSnapshot: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/actions/snapshot_merge_parent_24.png","width":"24px"}, {}],
					labelSnapshotMergeAll: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Merge with parent","height":"26px","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelSnapshotMergeAllClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panelPopupRevertSnapshot: ["wm.Panel", {"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
					pictureRevertSnapshot: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/actions/snapshot_revert_24.png","width":"24px"}, {}],
					labelSnapshotRevert: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Go To","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelSnapshotRevertClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panelPopupMergeToDescendantSnapshot: ["wm.Panel", {"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
					picture18: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/actions/snapshot_merge_descendant_24.png","width":"24px"}, {}],
					labelSnapshotMergeToDescendant: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Discard","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelSnapshotMergeToDescendantClick"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panelPopupDiscardBranch: ["wm.Panel", {"border":"0","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","showing":false,"verticalAlign":"middle","width":"100%"}, {}, {
					picture20: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/actions/discard-all-snapshots.png","width":"24px"}, {}],
					labelSnapshotDiscardBranch: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Discard branch","margin":"0,0,0,4","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"buttonDiscardAllClick","onclick1":"snapshotPopup.hide"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}]
			}]
		}]
	}],
	newSnapshotDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget14","height":"250px","title":"Create a new Snapshot","width":"300px"}, {}, {
		containerWidget14: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
			panelNewSnapshot: ["wm.MainContentPanel", {"border":"0,1,0,1","height":"100%","horizontalAlign":"left","margin":"0,10,0,10","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
				snapshotNameText: ["wm.Text", {"caption":"Name :","captionSize":"60px","dataValue":"","displayValue":"","emptyValue":"emptyString","padding":"2,5,2,5","regExp":"^[A-Za-z0-9]+(?:-?_?[A-Za-z0-9]+)+$","required":true,"width":"100%"}, {}],
				textSnapshotDesc: ["wm.SelectMenu", {"caption":"Listen :","displayValue":"","showing":false,"width":"200px"}, {}],
				spacer54: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
				snapshotDescArea: ["wm.LargeTextArea", {"caption":"Descritption :","dataValue":"","displayValue":"","emptyValue":"emptyString","height":"110px","padding":"5","required":true,"width":"100%"}, {}]
			}]
		}],
		buttonBar12: ["wm.Panel", {"_classes":{"domNode":["dialogfooter","wm_BorderBottomStyle_Curved4px"]},"border":"0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel162: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"100%","horizontalAlign":"right","imageList":"app.silkIconList","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				btnCreateSnashot: ["wm.Button", {"caption":"Create","imageIndex":109,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"btnCreateSnashotClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"panelNewSnapshot.invalid","targetProperty":"disabled"}, {}]
					}]
				}],
				btnNewSnapshotCancel: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"newSnapshotDialog.hide"}]
			}]
		}]
	}],
	loadingSnapshots: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"panelSnapshotsManagement","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	warningDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget11","height":"150px","noEscape":true,"noMaxify":true,"noMinify":true,"title":"Warning","width":"450px"}, {}, {
		containerWidget22: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
			pictureWarningDialog: ["wm.Picture", {"border":"0","height":"47px","source":"resources/images/icons/dialog-warning-45.png","width":"47px"}, {}],
			spacer60: ["wm.Spacer", {"height":"48px","width":"10px"}, {}],
			panel159: ["wm.Panel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"middle","width":"100%"}, {}, {
				warningDialogText: ["wm.LargeTextArea", {"autoSizeHeight":true,"dataValue":undefined,"displayValue":"","height":"80px","maxHeight":500,"readonly":true,"width":"100%"}, {}]
			}]
		}],
		buttonBar20: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
			btnExitWarnDiag: ["wm.Button", {"caption":"OK","imageIndex":88,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"warningDialog.hide"}]
		}]
	}],
	loadingNodeRessources: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"panelNodeRessources","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	vmConfigTimerDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget15","height":"300px","roles":["dev","Administrator","PowerUser"],"title":"New Timer","width":"360px"}, {}, {
		containerWidget15: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
			panelVmTimer: ["wm.MainContentPanel", {"border":"0,1,0,1","height":"100%","horizontalAlign":"left","margin":"0,10,0,10","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
				selectTimerName: ["wm.SelectMenu", {"caption":"Timer name:","captionAlign":"left","dataField":"dataValue","displayField":"name","displayValue":"","padding":"2,2,2,15","required":true}, {"onchange":"selectTimerNameChange"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"varVmTimerList","targetProperty":"dataSet"}, {}],
						wire1: ["wm.Wire", {"expression":undefined,"source":"gridVmTimerList.selectedItem.name","targetProperty":"dataValue"}, {}]
					}]
				}],
				spacer62: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
				selectTimerPresent: ["wm.SelectMenu", {"caption":"Present:","captionAlign":"left","dataField":"dataValue","displayField":"name","displayValue":"","padding":"2,2,2,15","required":true}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"varTimerPresent","targetProperty":"dataSet"}, {}],
						wire1: ["wm.Wire", {"expression":undefined,"source":"gridVmTimerList.selectedItem.present","targetProperty":"dataValue"}, {}]
					}]
				}],
				spacer63: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
				selectTimerPolicy: ["wm.SelectMenu", {"caption":"Tick policy:","captionAlign":"left","dataField":"dataValue","displayField":"name","displayValue":"","padding":"2,2,2,15","required":true}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"varTimerTickpolicy","targetProperty":"dataSet"}, {}],
						wire1: ["wm.Wire", {"expression":undefined,"source":"gridVmTimerList.selectedItem.tickpolicy","targetProperty":"dataValue"}, {}]
					}]
				}],
				selectTimerTrack: ["wm.SelectMenu", {"caption":"Track:","captionAlign":"left","displayField":"name","displayValue":"","emptyValue":"emptyString","height":"34px","padding":"12,2,2,15"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"varTimerTrack","targetProperty":"dataSet"}, {}],
						wire1: ["wm.Wire", {"expression":undefined,"source":"gridVmTimerList.selectedItem.track","targetProperty":"dataValue"}, {}]
					}]
				}],
				textTimerFrequency: ["wm.Text", {"caption":"Frequency:","captionAlign":"left","displayValue":"","emptyValue":"emptyString","height":"34px","padding":"12,2,2,15"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"gridVmTimerList.selectedItem.frequency","targetProperty":"dataValue"}, {}]
					}]
				}],
				selectTimerMode: ["wm.SelectMenu", {"caption":"Mode:","captionAlign":"left","displayField":"name","displayValue":"","emptyValue":"emptyString","height":"34px","padding":"12,2,2,15"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"varTimerModes","targetProperty":"dataSet"}, {}],
						wire1: ["wm.Wire", {"expression":undefined,"source":"gridVmTimerList.selectedItem.mode","targetProperty":"dataValue"}, {}]
					}]
				}]
			}]
		}],
		buttonBar13: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel210: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"1,0,0,0","borderColor":"#333333","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				vmTimerBtnSave: ["wm.Button", {"caption":"OK","imageIndex":109,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"vmTimerBtnSaveClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"panelVmTimer.invalid","targetProperty":"disabled"}, {}]
					}]
				}],
				vmTimerBtnCancel: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"vmConfigTimerDialog.hide"}]
			}]
		}]
	}],
	ntpConfigurationDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget16","height":"420px","roles":["dev","Administrator"],"title":"Date and Time configuration","width":"610px"}, {"onShow":"ntpConfigurationDialogShow"}, {
		containerWidget16: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			panel215: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"360px"}, {}, {
				labelDate: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"autoSizeWidth":true,"border":"0","height":"20px","padding":"4","width":"41px"}, {}],
				ntpCalendar: ["wm.dijit.Calendar", {"_classes":{"domNode":["wm_BorderShadow_WeakShadow","wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px"]},"border":"1","height":"180px","imageList":"","margin":"0,10,10,10"}, {"onValueSelected":"ntpCalendarValueSelected"}],
				panel221: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px","wm_BorderShadow_WeakShadow"]},"border":"1","height":"100%","horizontalAlign":"left","margin":"5","padding":"0,4,4,4","verticalAlign":"top","width":"100%"}, {}, {
					panel222: ["wm.Panel", {"border":"0","height":"32px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						label66: ["wm.Label", {"border":"0","caption":"Network Time Protocol (NTP)","padding":"4","width":"184px"}, {}]
					}],
					label67: ["wm.Label", {"border":"0","caption":"Synchronize node with a remote time server:","padding":"2,2,2,8","width":"200%"}, {}],
					spacer68: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
					checkActivateNtp: ["wm.Checkbox", {"caption":"Activate NTP","captionAlign":"left","captionPosition":"right","captionSize":"150px","dataValue":"","displayValue":"","padding":"2,2,2,8","width":"170px"}, {}],
					spacer66: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
					selectNtpServer: ["wm.SelectMenu", {"caption":"Primary server:","captionAlign":"left","dataField":"dataValue","displayField":"name","displayValue":"","emptyValue":"null","padding":"2,2,2,8","restrictValues":false,"width":"330px"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"varNtpServerList","targetProperty":"dataSet"}, {}]
						}]
					}]
				}]
			}],
			panel218: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"100%"}, {}, {
				panel219: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved12px","wm_BorderTopStyle_Curved12px","wm_BorderShadow_WeakShadow"]},"border":"1","borderColor":"#333333","height":"180px","horizontalAlign":"center","layoutKind":"left-to-right","margin":"7,0,0,7","verticalAlign":"middle","width":"180px"}, {}, {
					htmlClock: ["wm.Html", {"border":"0","height":"190px","margin":"0","width":"190px"}, {}]
				}],
				panel223: ["wm.Panel", {"border":"0","height":"48px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
					editTimeHour: ["wm.Number", {"captionSize":"0px","displayValue":"","height":"35px","maximum":23,"minimum":0,"spinnerButtons":true,"width":"50px"}, {"onchange":"editTimeHourChange"}],
					spacer67: ["wm.Spacer", {"height":"48px","width":"20px"}, {}],
					editTimeMinutes: ["wm.Number", {"captionSize":"0px","displayValue":"","height":"35px","maximum":59,"minimum":0,"spinnerButtons":true,"width":"50px"}, {"onchange":"editTimeMinutesChange"}]
				}],
				panel220: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderShadow_WeakShadow","wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px"]},"borderColor":"#888888","height":"100%","horizontalAlign":"center","margin":"10,5,5,5","verticalAlign":"top","width":"100%"}, {}, {
					labelClockOffset: ["wm.Label", {"border":"0","caption":"empty","padding":"4","showing":false}, {}],
					label68: ["wm.Label", {"align":"center","border":"0","caption":"Timezone:","padding":"4","width":"100%"}, {}],
					spacer69: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
					labelTimezone: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"align":"center","border":"0","padding":"4","width":"100%"}, {}],
					toggleTimezones: ["wm.Button", {"caption":"Change timezone","iconUrl":"resources/images/icons/arrow-show.png","margin":"4","width":"140px"}, {"onclick":"toggleTimezonesClick"}]
				}]
			}]
		}],
		buttonBar14: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel269: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"0","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				btnNtpValidate: ["wm.Button", {"caption":"Apply","imageIndex":109,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"btnNtpValidateClick"}],
				btnNtpConfigCancel: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"ntpConfigurationDialog.hide"}]
			}]
		}]
	}],
	timezonesDialog: ["wm.DesignableDialog", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved8px","wm_BorderTopStyle_Curved8px"]},"borderColor":"#999999","buttonBarId":"buttonBar","containerWidgetId":"containerWidget17","corner":"cr","modal":false,"noEscape":true,"noMaxify":true,"noMinify":true,"positionNear":"toggleTimezones","roles":["dev","Administrator"],"title":"","width":"200px"}, {"onShow":"timezonesDialogShow"}, {
		containerWidget17: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
			panelTreeTimezone: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
				timeZoneTree: ["wm.ObjectTree", {"border":"0","data":{"Africa":{"Abidjan":undefined,"Accra":undefined,"Addis_Ababa":undefined,"Algiers":undefined,"Asmara":undefined,"Asmera":undefined,"Bamako":undefined,"Bangui":undefined,"Banjul":undefined,"Bissau":undefined,"Blantyre":undefined,"Brazzaville":undefined,"Bujumbura":undefined,"Cairo":undefined,"Casablanca":undefined,"Ceuta":undefined,"Conakry":undefined,"Dakar":undefined,"Dar_es_Salaam":undefined,"Djibouti":undefined,"Douala":undefined,"El_Aaiun":undefined,"Freetown":undefined,"Gaborone":undefined,"Harare":undefined,"Johannesburg":undefined,"Juba":undefined,"Kampala":undefined,"Khartoum":undefined,"Kigali":undefined,"Kinshasa":undefined,"Lagos":undefined,"Libreville":undefined,"Lome":undefined,"Luanda":undefined,"Lubumbashi":undefined,"Lusaka":undefined,"Malabo":undefined,"Maputo":undefined,"Maseru":undefined,"Mbabane":undefined,"Mogadishu":undefined,"Monrovia":undefined,"Nairobi":undefined,"Ndjamena":undefined,"Niamey":undefined,"Nouakchott":undefined,"Ouagadougou":undefined,"Porto-Novo":undefined,"Sao_Tome":undefined,"Timbuktu":undefined,"Tripoli":undefined,"Tunis":undefined,"Windhoek":undefined},"AKST9AKDT":undefined,"America":{"Adak":undefined,"Anchorage":undefined,"Anguilla":undefined,"Antigua":undefined,"Araguaina":undefined,"Argentina":{"Buenos_Aires":undefined,"Catamarca":undefined,"ComodRivadavia":undefined,"Cordoba":undefined,"Jujuy":undefined,"La_Rioja":undefined,"Mendoza":undefined,"Rio_Gallegos":undefined,"Salta":undefined,"San_Juan":undefined,"San_Luis":undefined,"Tucuman":undefined,"Ushuaia":undefined},"Aruba":undefined,"Asuncion":undefined,"Atikokan":undefined,"Atka":undefined,"Bahia":undefined,"Bahia_Banderas":undefined,"Barbados":undefined,"Belem":undefined,"Belize":undefined,"Blanc-Sablon":undefined,"Boa_Vista":undefined,"Bogota":undefined,"Boise":undefined,"Buenos_Aires":undefined,"Cambridge_Bay":undefined,"Campo_Grande":undefined,"Cancun":undefined,"Caracas":undefined,"Catamarca":undefined,"Cayenne":undefined,"Cayman":undefined,"Chicago":undefined,"Chihuahua":undefined,"Coral_Harbour":undefined,"Cordoba":undefined,"Costa_Rica":undefined,"Creston":undefined,"Cuiaba":undefined,"Curacao":undefined,"Danmarkshavn":undefined,"Dawson":undefined,"Dawson_Creek":undefined,"Denver":undefined,"Detroit":undefined,"Dominica":undefined,"Edmonton":undefined,"Eirunepe":undefined,"El_Salvador":undefined,"Ensenada":undefined,"Fort_Wayne":undefined,"Fortaleza":undefined,"Glace_Bay":undefined,"Godthab":undefined,"Goose_Bay":undefined,"Grand_Turk":undefined,"Grenada":undefined,"Guadeloupe":undefined,"Guatemala":undefined,"Guayaquil":undefined,"Guyana":undefined,"Halifax":undefined,"Havana":undefined,"Hermosillo":undefined,"Indiana":{"Indianapolis":undefined,"Knox":undefined,"Marengo":undefined,"Petersburg":undefined,"Tell_City":undefined,"Vevay":undefined,"Vincennes":undefined,"Winamac":undefined},"Inuvik":undefined,"Iqaluit":undefined,"Jamaica":undefined,"Jujuy":undefined,"Juneau":undefined,"Kentucky":{"Louisville":undefined,"Monticello":undefined},"Knox_IN":undefined,"Kralendijk":undefined,"La_Paz":undefined,"Lima":undefined,"Los_Angeles":undefined,"Louisville":undefined,"Lower_Princes":undefined,"Maceio":undefined,"Managua":undefined,"Manaus":undefined,"Marigot":undefined,"Martinique":undefined,"Matamoros":undefined,"Mazatlan":undefined,"Mendoza":undefined,"Menominee":undefined,"Merida":undefined,"Metlakatla":undefined,"Mexico_City":undefined,"Miquelon":undefined,"Moncton":undefined,"Monterrey":undefined,"Montevideo":undefined,"Montreal":undefined,"Montserrat":undefined,"Nassau":undefined,"New_York":undefined,"Nipigon":undefined,"Nome":undefined,"Noronha":undefined,"North_Dakota":{"Beulah":undefined,"Center":undefined,"New_Salem":undefined},"Ojinaga":undefined,"Panama":undefined,"Pangnirtung":undefined,"Paramaribo":undefined,"Phoenix":undefined,"Port_of_Spain":undefined,"Port-au-Prince":undefined,"Porto_Acre":undefined,"Porto_Velho":undefined,"Puerto_Rico":undefined,"Rainy_River":undefined,"Rankin_Inlet":undefined,"Recife":undefined,"Regina":undefined,"Resolute":undefined,"Rio_Branco":undefined,"Rosario":undefined,"Santa_Isabel":undefined,"Santarem":undefined,"Santiago":undefined,"Santo_Domingo":undefined,"Sao_Paulo":undefined,"Scoresbysund":undefined,"Shiprock":undefined,"Sitka":undefined,"St_Barthelemy":undefined,"St_Johns":undefined,"St_Kitts":undefined,"St_Lucia":undefined,"St_Thomas":undefined,"St_Vincent":undefined,"Swift_Current":undefined,"Tegucigalpa":undefined,"Thule":undefined,"Thunder_Bay":undefined,"Tijuana":undefined,"Toronto":undefined,"Tortola":undefined,"Vancouver":undefined,"Virgin":undefined,"Whitehorse":undefined,"Winnipeg":undefined,"Yakutat":undefined,"Yellowknife":undefined},"Antarctica":{"Casey":undefined,"Davis":undefined,"DumontDUrville":undefined,"Macquarie":undefined,"Mawson":undefined,"McMurdo":undefined,"Palmer":undefined,"Rothera":undefined,"South_Pole":undefined,"Syowa":undefined,"Vostok":undefined},"Arctic/Longyearbyen":undefined,"Asia":{"Aden":undefined,"Almaty":undefined,"Amman":undefined,"Anadyr":undefined,"Aqtau":undefined,"Aqtobe":undefined,"Ashgabat":undefined,"Ashkhabad":undefined,"Baghdad":undefined,"Bahrain":undefined,"Baku":undefined,"Bangkok":undefined,"Beirut":undefined,"Bishkek":undefined,"Brunei":undefined,"Calcutta":undefined,"Choibalsan":undefined,"Chongqing":undefined,"Chungking":undefined,"Colombo":undefined,"Dacca":undefined,"Damascus":undefined,"Dhaka":undefined,"Dili":undefined,"Dubai":undefined,"Dushanbe":undefined,"Gaza":undefined,"Harbin":undefined,"Hebron":undefined,"Ho_Chi_Minh":undefined,"Hong_Kong":undefined,"Hovd":undefined,"Irkutsk":undefined,"Istanbul":undefined,"Jakarta":undefined,"Jayapura":undefined,"Jerusalem":undefined,"Kabul":undefined,"Kamchatka":undefined,"Karachi":undefined,"Kashgar":undefined,"Kathmandu":undefined,"Katmandu":undefined,"Kolkata":undefined,"Krasnoyarsk":undefined,"Kuala_Lumpur":undefined,"Kuching":undefined,"Kuwait":undefined,"Macao":undefined,"Macau":undefined,"Magadan":undefined,"Makassar":undefined,"Manila":undefined,"Muscat":undefined,"Nicosia":undefined,"Novokuznetsk":undefined,"Novosibirsk":undefined,"Omsk":undefined,"Oral":undefined,"Phnom_Penh":undefined,"Pontianak":undefined,"Pyongyang":undefined,"Qatar":undefined,"Qyzylorda":undefined,"Rangoon":undefined,"Riyadh":undefined,"Saigon":undefined,"Sakhalin":undefined,"Samarkand":undefined,"Seoul":undefined,"Shanghai":undefined,"Singapore":undefined,"Taipei":undefined,"Tashkent":undefined,"Tbilisi":undefined,"Tehran":undefined,"Tel_Aviv":undefined,"Thimbu":undefined,"Thimphu":undefined,"Tokyo":undefined,"Ujung_Pandang":undefined,"Ulaanbaatar":undefined,"Ulan_Bator":undefined,"Urumqi":undefined,"Vientiane":undefined,"Vladivostok":undefined,"Yakutsk":undefined,"Yekaterinburg":undefined,"Yerevan":undefined},"Atlantic":{"Azores":undefined,"Bermuda":undefined,"Canary":undefined,"Cape_Verde":undefined,"Faeroe":undefined,"Faroe":undefined,"Jan_Mayen":undefined,"Madeira":undefined,"Reykjavik":undefined,"South_Georgia":undefined,"St_Helena":undefined,"Stanley":undefined},"Australia":{"ACT":undefined,"Adelaide":undefined,"Brisbane":undefined,"Broken_Hill":undefined,"Canberra":undefined,"Currie":undefined,"Darwin":undefined,"Eucla":undefined,"Hobart":undefined,"LHI":undefined,"Lindeman":undefined,"Lord_Howe":undefined,"Melbourne":undefined,"North":undefined,"NSW":undefined,"Perth":undefined,"Queensland":undefined,"South":undefined,"Sydney":undefined,"Tasmania":undefined,"Victoria":undefined,"West":undefined,"Yancowinna":undefined},"Brazil":{"Acre":undefined,"DeNoronha":undefined,"East":undefined,"West":undefined},"Canada":{"Atlantic":undefined,"Central":undefined,"Eastern":undefined,"East-Saskatchewan":undefined,"Mountain":undefined,"Newfoundland":undefined,"Pacific":undefined,"Saskatchewan":undefined,"Yukon":undefined},"CET":undefined,"Chile":{"Continental":undefined,"EasterIsland":undefined},"CST6CDT":undefined,"Cuba":undefined,"EET":undefined,"Egypt":undefined,"Eire":undefined,"EST":undefined,"EST5EDT":undefined,"Etc.":{"GMT":undefined,"GMT+0":undefined,"UCT":undefined,"Universal":undefined,"UTC":undefined,"Zulu":undefined},"Europe":{"Amsterdam":undefined,"Andorra":undefined,"Athens":undefined,"Belfast":undefined,"Belgrade":undefined,"Berlin":undefined,"Bratislava":undefined,"Brussels":undefined,"Bucharest":undefined,"Budapest":undefined,"Chisinau":undefined,"Copenhagen":undefined,"Dublin":undefined,"Gibraltar":undefined,"Guernsey":undefined,"Helsinki":undefined,"Isle_of_Man":undefined,"Istanbul":undefined,"Jersey":undefined,"Kaliningrad":undefined,"Kiev":undefined,"Lisbon":undefined,"Ljubljana":undefined,"London":undefined,"Luxembourg":undefined,"Madrid":undefined,"Malta":undefined,"Mariehamn":undefined,"Minsk":undefined,"Monaco":undefined,"Moscow":undefined,"Nicosia":undefined,"Oslo":undefined,"Paris":undefined,"Podgorica":undefined,"Prague":undefined,"Riga":undefined,"Rome":undefined,"Samara":undefined,"San_Marino":undefined,"Sarajevo":undefined,"Simferopol":undefined,"Skopje":undefined,"Sofia":undefined,"Stockholm":undefined,"Tallinn":undefined,"Tirane":undefined,"Tiraspol":undefined,"Uzhgorod":undefined,"Vaduz":undefined,"Vatican":undefined,"Vienna":undefined,"Vilnius":undefined,"Volgograd":undefined,"Warsaw":undefined,"Zagreb":undefined,"Zaporozhye":undefined,"Zurich":undefined},"GB":undefined,"GB-Eire":undefined,"GMT":undefined,"GMT+0":undefined,"GMT0":undefined,"GMT-0":undefined,"Greenwich":undefined,"Hong Kong":undefined,"HST":undefined,"Iceland":undefined,"Indian":{"Antananarivo":undefined,"Chagos":undefined,"Christmas":undefined,"Cocos":undefined,"Comoro":undefined,"Kerguelen":undefined,"Mahe":undefined,"Maldives":undefined,"Mauritius":undefined,"Mayotte":undefined,"Reunion":undefined},"Iran":undefined,"Israel":undefined,"Jamaica":undefined,"Japan":undefined,"JST-9":undefined,"Kwajalein":undefined,"Libya":undefined,"MET":undefined,"Mexico":{"BajaNorte":undefined,"BajaSur":undefined,"General":undefined},"MST":undefined,"MST7MDT":undefined,"Navajo":undefined,"NZ":undefined,"NZ-CHAT":undefined,"Pacific":{"Apia":undefined,"Auckland":undefined,"Chatham":undefined,"Chuuk":undefined,"Easter":undefined,"Efate":undefined,"Enderbury":undefined,"Fakaofo":undefined,"Fiji":undefined,"Funafuti":undefined,"Galapagos":undefined,"Gambier":undefined,"Guadalcanal":undefined,"Guam":undefined,"Honolulu":undefined,"Johnston":undefined,"Kiritimati":undefined,"Kosrae":undefined,"Kwajalein":undefined,"Majuro":undefined,"Marquesas":undefined,"Midway":undefined,"Nauru":undefined,"Niue":undefined,"Norfolk":undefined,"Noumea":undefined,"Pago_Pago":undefined,"Palau":undefined,"Pitcairn":undefined,"Pohnpei":undefined,"Ponape":undefined,"Port_Moresby":undefined,"Rarotonga":undefined,"Saipan":undefined,"Samoa":undefined,"Tahiti":undefined,"Tarawa":undefined,"Tongatapu":undefined,"Truk":undefined,"Wake":undefined,"Wallis":undefined,"Yap":undefined},"Poland":undefined,"Portugal":undefined,"PRC":undefined,"PST8PDT":undefined,"ROC":undefined,"ROK":undefined,"Singapore":undefined,"Turkey":undefined,"UCT":undefined,"Universal":undefined,"US":{"Alaska":undefined,"Aleutian":undefined,"Arizona":undefined,"Central":undefined,"Eastern":undefined,"East-Indiana":undefined,"Hawaii":undefined,"Indiana-Starke":undefined,"Michigan":undefined,"Mountain":undefined,"Pacific":undefined,"Pacific-New":undefined,"Samoa":undefined},"UTC":undefined,"WET":undefined,"W-SU":undefined,"Zulu":undefined},"height":"100%"}, {"ondblclick":"timeZoneTreeDblclick"}]
			}]
		}],
		buttonBar15: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}]
	}],
	SmallHeaderMenu: ["wm.DesignableDialog", {"_classes":{"domNode":["wm_BorderShadow_StrongShadow","wm_BorderBottomStyle_Curved8px","wm_BorderTopStyle_Curved8px"]},"buttonBarId":"","containerWidgetId":"containerWidget18","corner":"tl","height":"284px","modal":false,"noEscape":true,"noMaxify":true,"noMinify":true,"positionNear":"panelSmallHeader","title":"","width":"250px"}, {"onClose":"SmallHeaderMenuClose"}, {
		containerWidget18: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
			panel241: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"0,5,0,5","verticalAlign":"top","width":"100%"}, {}, {
				panel242: ["wm.Panel", {"border":"0,0,1,0","borderColor":"#333333","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
					picture27: ["wm.Picture", {"border":"0","height":"24px","imageIndex":0,"imageList":"","source":"resources/images/icons/cloud-home-invert-24.png","width":"24px"}, {}],
					smallHeaderMenuViewFull: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"DataCenter's Home","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"labelDatacenterClick"}]
				}],
				panel245: ["wm.Panel", {"border":"0","borderColor":"#333333","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","roles":["dev","Administrator"],"verticalAlign":"middle","width":"100%"}, {}, {
					picture30: ["wm.Picture", {"border":"0","height":"24px","imageIndex":0,"imageList":"","source":"resources/images/icons/add-server24.png","width":"24px"}, {}],
					smallHeaderMenuAddNode: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Add Node","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"smallHeaderMenuAddNodeClick","onclick1":"SmallHeaderMenu.hide"}]
				}],
				panel150: ["wm.Panel", {"border":"0","borderColor":"#333333","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","roles":["dev","Administrator"],"verticalAlign":"middle","width":"100%"}, {}, {
					picture16: ["wm.Picture", {"border":"0","height":"24px","margin":"0","source":"resources/images/icons/find-nodes.png","width":"24px"}, {}],
					smallHeaderMenuProbeNodes: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Probe Nodes","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"smallHeaderMenuProbeNodesClick","onclick1":"SmallHeaderMenu.hide"}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panel244: ["wm.Panel", {"border":"0,0,1,0","borderColor":"#333333","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","roles":["dev","Administrator"],"verticalAlign":"middle","width":"100%"}, {}, {
					picture29: ["wm.Picture", {"border":"0","height":"24px","imageIndex":0,"imageList":"","source":"resources/images/icons/del-server.png","width":"24px"}, {}],
					smallHeaderMenuRemoveNode: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Remove Node","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"selectNodeToDel.show","onclick1":"SmallHeaderMenu.hide"}]
				}],
				panel274: ["wm.Panel", {"border":"0","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
					picture31: ["wm.Picture", {"border":"0","height":"16px","imageIndex":90,"imageList":"app.silkIconsOpenkvi","width":"24px"}, {}],
					smallHeaderMenuUserGuide: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"User Manual","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"onHelpClick","onclick1":"SmallHeaderMenu.hide"}]
				}],
				panel243: ["wm.Panel", {"border":"0","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
					picture28: ["wm.Picture", {"border":"0","height":"16px","imageIndex":56,"imageList":"app.silkIconList","width":"24px"}, {}],
					smallHeaderMenuWhatsnew: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"What's new","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"onHelpClick","onclick1":"SmallHeaderMenu.hide"}]
				}],
				panel225: ["wm.Panel", {"border":"1,0,0,0","borderColor":"#333333","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
					picture14: ["wm.Picture", {"border":"0","height":"22px","source":"resources/images/icons/secure-22.png","width":"24px"}, {}],
					smallHeaderMenuLogout: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_Mouse_pointer"]},"border":"0","caption":"Logout","padding":"4","width":"100%"}, {"onMouseOut":"onLabelMouseOut","onMouseOver":"onLabelMouseOver","onclick":"templateLogoutVar"}]
				}]
			}],
			panel239: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundColor_SteelBlue","wm_BorderBottomStyle_Curved8px"]},"border":"1,0,0,0","height":"48px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
				panel247: ["wm.Panel", {"border":"0","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,15,0,0","verticalAlign":"top","width":"100%"}, {}, {
					label71: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_White","wm_TextDecoration_Bold"]},"border":"0","padding":"4,4,4,20","width":"100%"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":"${templateUsernameVar.dataValue}","source":false,"targetProperty":"caption"}, {}]
						}]
					}],
					label83: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_LightGray"]},"autoSizeWidth":true,"border":"0","padding":"4","width":"91px"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":"\"Version: \"+${openkviVersion.caption}","source":false,"targetProperty":"caption"}, {}]
						}]
					}]
				}],
				panel246: ["wm.Panel", {"border":"0","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,15,0,0","verticalAlign":"top","width":"100%"}, {}, {
					label82: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_LightGray"]},"border":"0","padding":"4,4,4,20","width":"100%"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":"\"Role: \" + ${getUserRoles.dataValue}","source":false,"targetProperty":"caption"}, {}]
						}]
					}]
				}]
			}]
		}]
	}],
	loadingNodeTimeConfig: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire1: ["wm.Wire", {"expression":undefined,"source":"javaGetNodeTimeConfiguration","targetProperty":"serviceVariableToTrack"}, {}],
			wire: ["wm.Wire", {"expression":undefined,"source":"panelNodeTimeConfiguration","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	nodeNtpServerDialog: ["wm.DesignableDialog", {"buttonBarId":"","containerWidgetId":"containerWidget19","height":"150px","roles":["dev","Administrator"],"title":"NTP server configuration","width":"400px"}, {}, {
		containerWidget19: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"15,5,5,20","verticalAlign":"top","width":"100%"}, {}, {
			labelNtpServerConfig: ["wm.Label", {"border":"0","caption":"Edit NTP server:","padding":"4","width":"100%"}, {}],
			textNtpServerConfig: ["wm.Text", {"dataValue":undefined,"displayValue":""}, {}]
		}],
		buttonBar16: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {"onEnterKeyPress":"nodeNtpServerDialog.hide"}, {
			panel270: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"0","height":"48px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				btnValidNtpServer: ["wm.Button", {"caption":"Apply","imageIndex":109,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"btnValidNtpServerClick"}],
				btnCancelNtpServer: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"nodeNtpServerDialog.hide"}]
			}]
		}]
	}],
	loadingVmConfiguration: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"panelVmConfiguration","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	loadingLockScreen: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"panelVmScreen","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	vmConfigWarningDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget20","height":"160px","noEscape":true,"noMaxify":true,"noMinify":true,"title":"Leaving Virtual Machine configuration","width":"450px"}, {}, {
		containerWidget20: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","padding":"5","verticalAlign":"middle","width":"100%"}, {}, {
			picture19: ["wm.Picture", {"border":"0","height":"45px","source":"resources/images/icons/dialog-warning-45.png","width":"80px"}, {}],
			panel228: ["wm.Panel", {"border":"0","height":"64px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
				label74: ["wm.Label", {"border":"0","caption":"You have unsaved modifications.","padding":"4","width":"100%"}, {}],
				label75: ["wm.Label", {"border":"0","caption":"Would you like to save your modifications, discard them or cancel exit ?","height":"40px","padding":"4","singleLine":false,"width":"100%"}, {}]
			}]
		}],
		buttonBar17: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","borderColor":"#333333","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel271: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"0","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				btnWarningVmConfigSave: ["wm.Button", {"caption":"Save","imageIndex":15,"imageList":"app.silkIconList","margin":"4","width":"100px"}, {"onclick":"btnWarningVmConfigSaveClick"}],
				btnVmConfigDiscard: ["wm.Button", {"caption":"Discard","imageIndex":86,"imageList":"app.silkIconList","margin":"4","width":"100px"}, {"onclick":"btnVmConfigDiscardClick"}],
				panel229: ["wm.Panel", {"border":"0,0,0,1","borderColor":"#b3b3a9","height":"90%","horizontalAlign":"left","margin":"0,0,0,5","verticalAlign":"top","width":"10px"}, {}],
				btnCancelExitVmConfig: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconList","margin":"4","width":"100px"}, {"onclick":"btnCancelExitVmConfigClick"}]
			}]
		}]
	}],
	loadingNodeNetworkConf: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"panelNodeNetworkInterfaces","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	loadingNodeNetworkConf2: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"panelNodeNetworkConfig","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	javaGetNodeSnmpConfiguration: ["wm.ServiceVariable", {"operation":"getNodeSnmpConfiguration","service":"serverTools"}, {"onResult":"javaGetNodeSnmpConfigurationResult"}, {
		input: ["wm.ServiceInput", {"type":"getNodeSnmpConfigurationInputs"}, {}]
	}],
	loadingSnmpConfig: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"layerServerSnmp","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	configureSnmpDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget21","height":"180px","title":"Configure SNMP service","width":"410px"}, {}, {
		containerWidget21: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
			panelSnmpConfig: ["wm.MainContentPanel", {"border":"0,1,0,1","height":"100%","horizontalAlign":"left","margin":"0,10,0,10","padding":"10","verticalAlign":"top","width":"100%"}, {}, {
				checkSnmpStartAtBoot: ["wm.Checkbox", {"caption":"Autostart service at boot","captionAlign":"left","captionPosition":"right","captionSize":"180px","dataValue":"","displayValue":"","width":"200px"}, {}],
				checkSnmpProcessNow: ["wm.Checkbox", {"caption":"Run process now","captionAlign":"left","captionPosition":"right","captionSize":"180px","dataValue":"","displayValue":"","width":"200px"}, {}],
				textSnmpServer: ["wm.Text", {"caption":"Remote SNMP server:","captionAlign":"left","captionSize":"150px","dataValue":undefined,"displayValue":"","required":true,"width":"350px"}, {}]
			}]
		}],
		buttonBar18: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel281: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"0","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				applySnmpConfig: ["wm.Button", {"caption":"Apply","imageIndex":109,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"applySnmpConfigClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"panelSnmpConfig.invalid","targetProperty":"disabled"}, {}]
					}]
				}],
				cancelSnmpConfig: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"cancelSnmpConfigClick"}]
			}]
		}]
	}],
	javaSetNodeSnmpConfiguration: ["wm.ServiceVariable", {"operation":"setNodeSnmpConfiguration","service":"serverTools"}, {"onResult":"javaSetNodeSnmpConfigurationResult"}, {
		input: ["wm.ServiceInput", {"type":"setNodeSnmpConfigurationInputs"}, {}]
	}],
	configureHardwareAgentDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget21","height":"140px","title":"Configure Hardware agent","width":"410px"}, {}, {
		containerWidget25: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
			panelHardwareAgentConfig: ["wm.MainContentPanel", {"border":"0,1,0,1","height":"100%","horizontalAlign":"left","margin":"0,10,0,10","padding":"10","verticalAlign":"top","width":"100%"}, {}, {
				checkHardwareAgentStartAtBoot: ["wm.Checkbox", {"caption":"Autostart service at boot","captionAlign":"left","captionPosition":"right","captionSize":"180px","dataValue":"","displayValue":"","width":"200px"}, {}],
				checkHardwareAgentProcessNow: ["wm.Checkbox", {"caption":"Load agent now","captionAlign":"left","captionPosition":"right","captionSize":"180px","dataValue":"","displayValue":"","width":"200px"}, {}]
			}]
		}],
		buttonBar19: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel282: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"0","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				applyHardwareAgentConfig: ["wm.Button", {"caption":"Apply","imageIndex":109,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"applyHardwareAgentConfigClick"}],
				cancelHardwareAgentConfig: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"cancelHardwareAgentConfigClick"}]
			}]
		}]
	}],
	javaSetNodeIpmiConfiguration: ["wm.ServiceVariable", {"operation":"setNodeIpmiConfiguration","service":"serverTools"}, {"onResult":"javaSetNodeIpmiConfigurationResult"}, {
		input: ["wm.ServiceInput", {"type":"setNodeIpmiConfigurationInputs"}, {}]
	}],
	javaGetNodeHardwareEvents: ["wm.ServiceVariable", {"operation":"getNodeHardwareEvents","service":"serverTools"}, {"onResult":"javaGetNodeHardwareEventsResult"}, {
		input: ["wm.ServiceInput", {"type":"getNodeHardwareEventsInputs"}, {}]
	}],
	javaGetNodePerformances: ["wm.ServiceVariable", {"operation":"getNodePerformances","service":"serverTools"}, {"onResult":"javaGetNodePerformancesResult"}, {
		input: ["wm.ServiceInput", {"type":"getNodePerformancesInputs"}, {}]
	}],
	loadingPerformanceTab: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"TabServersPerformances","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	javaGetNodeLogs: ["wm.ServiceVariable", {"operation":"getNodeLogs","service":"serverTools"}, {"onResult":"javaGetNodeLogsResult"}, {
		input: ["wm.ServiceInput", {"type":"getNodeLogsInputs"}, {}]
	}],
	javaReadNodeFile: ["wm.ServiceVariable", {"operation":"readFile","service":"serverTools"}, {"onResult":"javaReadNodeFileResult"}, {
		input: ["wm.ServiceInput", {"type":"readFileInputs"}, {}]
	}],
	loadingNodeLogs: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"nodeLogsArea","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	javaGetAllNodesInfo: ["wm.ServiceVariable", {"operation":"getAllNodesInfo","service":"serverTools"}, {"onResult":"javaGetAllNodesInfoResult"}, {
		input: ["wm.ServiceInput", {"type":"getAllNodesInfoInputs"}, {}]
	}],
	findVnetIpDialog: ["wm.DesignableDialog", {"buttonBarId":"","containerWidgetId":"containerWidget27","height":"300px","title":"Search Vnet IP address","width":"320px"}, {}, {
		containerWidget27: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			textFindIpForMac: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_LightBlue"]},"caption":"Vnet MAC address:","captionSize":"130px","dataValue":undefined,"displayValue":"","readonly":true}, {}],
			panelScnaVnetIp: ["wm.MainContentPanel", {"border":"0","fitToContentWidth":true,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"302px"}, {}, {
				label18: ["wm.Label", {"border":"0","borderColor":"#b3b8c4","caption":"Subnet range to scan:","padding":"4,4,4,10","width":"295px"}, {}],
				panel294: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"top","width":"100%"}, {}, {
					textVnetIpRangeStart: ["wm.Text", {"caption":"Start","captionAlign":"left","captionSize":"60px","dataValue":undefined,"displayValue":"","regExp":"([0-9]{1,3}\\.){3}[0-9]{1,3}","required":true,"width":"230px"}, {"onchange":"textVnetIpRangeStartChange"}]
				}],
				panel296: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"top","width":"302px"}, {}, {
					textVnetIpRangeEnd: ["wm.Text", {"caption":"End","captionAlign":"left","captionSize":"60px","dataValue":undefined,"displayValue":"","regExp":".([0-9]{1,3}\\.){3}[0-9]{1,3}","required":true,"width":"230px"}, {}]
				}],
				panel293: ["wm.Panel", {"border":"0","borderColor":"#b3b8c4","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,18","verticalAlign":"top","width":"100%"}, {}, {
					btnLaunchVnetIpSearch: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"Start scan","imageIndex":108,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"btnLaunchVnetIpSearchClick"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"panelScnaVnetIp.invalid","targetProperty":"disabled"}, {}]
						}]
					}],
					labelVnetScanInfo: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_SteelBlue"]},"border":"0","caption":"","height":"48px","padding":"4","singleLine":false,"width":"170px"}, {}]
				}],
				label23: ["wm.Label", {"border":"0","borderColor":"#b3b8c4","caption":"Found IP(s):","padding":"4,4,4,10","width":"100px"}, {}],
				labelScanVnetIpResult: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","borderColor":"#b3b8c4","caption":"","height":"48px","padding":"4,4,4,15","singleLine":false,"width":"295px"}, {}]
			}]
		}],
		buttonBar21: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel36: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_SteelBlue"]},"border":"0","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				btnApplyFoundIp: ["wm.Button", {"caption":"Save","imageIndex":109,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"btnApplyFoundIpClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":"!${labelScanVnetIpResult.caption}","source":false,"targetProperty":"disabled"}, {}]
					}]
				}],
				btnCancelFindVnetIp: ["wm.Button", {"caption":"Cancel","imageIndex":35,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"100px"}, {"onclick":"findVnetIpDialog.hide"}]
			}]
		}]
	}],
	loadingScanVnetIp: ["wm.LoadingDialog", {}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"labelScanVnetIpResult","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	mainLayoutBox: ["wm.Layout", {"_classes":{"domNode":["wm_BorderShadow_NoShadow","wm_BackgroundColor_SteelBlue"]},"height":"964px","horizontalAlign":"center","verticalAlign":"top","width":"100%"}, {"onRightClick":"mainLayoutBoxRightClick"}, {
		panelBody: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderShadow_NoShadow"]},"borderColor":"#b3b3a9","height":"100%","horizontalAlign":"left","margin":"0","verticalAlign":"top","width":"100%"}, {}, {
			panel5: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				panelTree: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_NoCurve","wm_BorderBottomStyle_NoCurve","wm_BackgroundColor_VeryLightGray"]},"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"240px"}, {}, {
					panel56: ["wm.Panel", {"_classes":{"domNode":["wm_BorderShadow_WeakShadow","wm_BackgroundColor_LightBlue"]},"border":"0,0,1,0","height":"38px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,3,0","padding":"0,5,0,5","verticalAlign":"middle","width":"100%"}, {}, {
						panelSmallOpenkvi: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"border":"0","height":"26px","horizontalAlign":"center","verticalAlign":"middle","width":"38px"}, {}, {
							pictureMainMenu: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"24px","source":"resources/images/logos/ic_menu_white_24dp.png","width":"24px"}, {"onclick":"pictureSmallOpenkviClick"}]
						}],
						spacer1: ["wm.Spacer", {"height":"100%","width":"100%"}, {}],
						panelDatacenter: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px"]},"border":"0","height":"26px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"38px"}, {}, {
							pictureHome: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"24px","source":"resources/images/icons/cloud-home-24.png","width":"24px"}, {"onclick":"labelDatacenterClick"}],
							labelDatacenter: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_FontColor_Graphite"]},"border":"0","caption":"Data Center","padding":"4","showing":false,"width":"100%"}, {"onRightClick":"onLabelRightClick","onclick":"labelDatacenterClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}]
					}],
					panelTreeCenter: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","margin":"2,0,0,0","padding":"0,8,0,8","verticalAlign":"top","width":"100%"}, {}, {
						panelServers: ["wm.MainContentPanel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}],
						panelRightSearch: ["wm.MainContentPanel", {"border":"0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							textRightSearch: ["wm.Text", {"captionSize":"0px","dataValue":undefined,"displayValue":"","placeHolder":"Search ...","resetButton":true,"width":"100%"}, {"onchange":"textRightSearchChange"}]
						}]
					}]
				}],
				splitterLeftRight: ["wm.Splitter", {"height":"100%","minimum":175,"width":"10px"}, {}],
				panelInfo: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
					panelInfoCenter: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
						panelDesc: ["wm.MainContentPanel", {"border":"0","borderColor":"#b3b3a9","height":"24px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							panel1: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_NoCurve"]},"border":"0","borderColor":"","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
								labelUserInfoPath: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_Green"]},"border":"0","caption":"Data Center","margin":"0,0,0,15","padding":"0","width":"100%"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								pictureSmallLogout: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"24px","hint":"Logout","source":"resources/images/icons/secure-22.png","width":"24px"}, {"onclick":"templateLogoutVar"}]
							}]
						}],
						layersMain: ["wm.Layers", {"defaultLayer":0,"padding":"0,4,4,4"}, {}, {
							layerDataCenter: ["wm.Layer", {"_classes":{"domNode":["MainContent"]},"borderColor":"","caption":"DataCenter","customGetValidate":"buttonSerClick","horizontalAlign":"left","margin":"0,0,0,0","padding":"0","verticalAlign":"top"}, {}, {
								panelTabs: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
									tabDataCenter: ["wm.TabLayers", {"defaultLayer":0}, {}, {
										TabCenterOverview: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"Nodes Dashboard","horizontalAlign":"left","margin":"","padding":"5,10,5,10","verticalAlign":"top"}, {"onShow":"TabCenterOverviewShow"}, {
											panelCenterOverview: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
												htmlCenterOverview: ["wm.Html", {"border":"0","height":"100%"}, {}]
											}],
											panel290: ["wm.MainContentPanel", {"border":"0","height":"38px","horizontalAlign":"left","layoutKind":"left-to-right","roles":["dev","Administrator"],"verticalAlign":"top","width":"100%"}, {}, {
												tabNodesNewButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Add Node","height":"36px","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4","roles":["dev","Administrator"],"width":"110px"}, {"onclick":"tableserversLivePanel1.popupLivePanelInsert"}],
												btnProbeNodes: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Probe Nodes","height":"36px","imageIndex":67,"imageList":"app.silkIconsOpenkvi","margin":"4","roles":["dev","Administrator"],"width":"110px"}, {"onclick":"btnProbeNodesClick"}]
											}]
										}],
										TabCenterVms: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"Virtual Machines","horizontalAlign":"left","layoutKind":"left-to-right","margin":"1","padding":"5,10,5,10","verticalAlign":"top"}, {}, {
											panel4: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"20","verticalAlign":"top","width":"100%"}, {}, {
												panel197: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"90%"}, {}, {
													tablevmsLivePanel1: ["wm.LivePanel", {"border":"0","horizontalAlign":"left","verticalAlign":"top"}, {}, {
														binding: ["wm.Binding", {}, {}, {
															wire: ["wm.Wire", {"source":"tablevmsDialog1","targetId":null,"targetProperty":"dialog"}, {}],
															wire1: ["wm.Wire", {"source":"tablevmsLiveForm2","targetId":null,"targetProperty":"liveForm"}, {}],
															wire2: ["wm.Wire", {"source":"tablevmsDojoGrid","targetId":null,"targetProperty":"dataGrid"}, {}],
															wire3: ["wm.Wire", {"source":"tablevmsSaveButton1","targetId":null,"targetProperty":"saveButton"}, {}]
														}],
														labelDatacenterNbVms: ["wm.Label", {"border":"0","caption":"Number of virtual machines:","padding":"4","width":"100%"}, {}, {
															format: ["wm.DataFormatter", {}, {}]
														}],
														panel201: ["wm.HeaderContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
															tablevmsDojoGrid: ["wm.DojoGrid", {"columns":[{"show":false,"id":"id","title":"Id","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":false,"id":"memory","title":"Memory","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":false,"id":"nbcpu","title":"Nbcpu","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":false,"id":"freqcpu","title":"Freqcpu","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"name","title":"VM Name","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"displayedname","title":"Label","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"arch","title":"Architecture","width":"75px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"network","title":"Network","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"cdrom","title":"Cdrom","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"server","title":"Node","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"disks","title":"Disks","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","margin":"0"}, {"onCellDblClick":"tablevmsDojoGridCellDblClick","onSelectionChange":"tablevmsDojoGridSelectionChange"}, {
																binding: ["wm.Binding", {}, {}, {
																	wire: ["wm.Wire", {"expression":undefined,"source":"tablevmsLiveVariable2","targetProperty":"dataSet"}, {}]
																}]
															}]
														}]
													}]
												}],
												tablevmsGridButtonPanel: ["wm.Panel", {"border":"0","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","roles":["dev","Administrator","PowerUser"],"verticalAlign":"top","width":"100%"}, {}, {
													tablevmsNewButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" New","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"onNewVmButtonClick"}],
													tablevmsDeleteButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Delete","imageIndex":108,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"onDataCenterDeleteVmClick"}, {
														binding: ["wm.Binding", {}, {}, {
															wire: ["wm.Wire", {"source":"tablevmsDojoGrid.emptySelection","targetId":null,"targetProperty":"disabled"}, {}]
														}]
													}]
												}]
											}]
										}],
										TabCenterServers: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"Grid Server","horizontalAlign":"left","layoutKind":"left-to-right","margin":"1","padding":"5,10,5,10","verticalAlign":"top"}, {"onShow":"TabCenterServersShow"}, {
											panel8: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"20","verticalAlign":"top","width":"100%"}, {}, {
												panel196: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"90%"}, {}, {
													tableserversLivePanel1: ["wm.LivePanel", {"border":"0","horizontalAlign":"left","verticalAlign":"top"}, {}, {
														binding: ["wm.Binding", {}, {}, {
															wire: ["wm.Wire", {"source":"tableserversDialog","targetId":null,"targetProperty":"dialog"}, {}],
															wire1: ["wm.Wire", {"source":"tableserversLiveForm1","targetId":null,"targetProperty":"liveForm"}, {}],
															wire2: ["wm.Wire", {"source":"tableserversDojoGrid","targetId":null,"targetProperty":"dataGrid"}, {}],
															wire3: ["wm.Wire", {"source":"tableserversSaveButton","targetId":null,"targetProperty":"saveButton"}, {}]
														}],
														labelNumberOfNodes: ["wm.Label", {"border":"0","caption":"Number of nodes: ","padding":"4"}, {}, {
															format: ["wm.DataFormatter", {}, {}]
														}],
														panel200: ["wm.HeaderContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
															tableserversDojoGrid: ["wm.DojoGrid", {"columns":[{"show":false,"id":"id","title":"Id","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":true,"id":"name","title":"Node Name","width":"40%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"ip","title":"IP","width":"100px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"hypervisor","title":"Hypervisor","width":"80px","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","fieldType":"dojox.grid.cells._Widget","expression":"${hypervisor}.toUpperCase()"},{"show":true,"id":"description","title":"Description","width":"60%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","margin":"0"}, {"onCellDblClick":"tableserversDojoGridCellDblClick"}, {
																binding: ["wm.Binding", {}, {}, {
																	wire: ["wm.Wire", {"expression":undefined,"source":"listAllServersLiveVar","targetProperty":"dataSet"}, {}]
																}]
															}]
														}]
													}]
												}],
												tableserversGridButtonPanel: ["wm.Panel", {"border":"0","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","roles":["dev","Administrator"],"verticalAlign":"top","width":"100%"}, {}, {
													tableserversNewButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Add","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"tableserversLivePanel1.popupLivePanelInsert"}],
													tableserversDeleteButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Delete","imageIndex":108,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"tableserversDeleteButtonClick"}, {
														binding: ["wm.Binding", {}, {}, {
															wire: ["wm.Wire", {"source":"tableserversDojoGrid.emptySelection","targetId":null,"targetProperty":"disabled"}, {}]
														}]
													}]
												}]
											}]
										}],
										TabCenterConfig: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"Configuration","horizontalAlign":"left","layoutKind":"left-to-right","margin":"1","padding":"5,10,5,10","roles":["Administrator","dev"],"verticalAlign":"top"}, {"onShow":"TabCenterConfigShow"}, {
											panel2: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
												openkviConfigContainer: ["wm.PageContainer", {"border":"0","deferLoad":true,"pageName":"OpenkviConfigPage"}, {}]
											}]
										}],
										TabCenterLogs: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"Logs","horizontalAlign":"left","margin":"1","padding":"5,10,5,10","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"TabCenterLogsShow"}, {
											panelDataCenterLogs: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
												panel260: ["wm.MainContentPanel", {"border":"0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"bottom","width":"100%"}, {}, {
													labelNodemanagerLogs: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold","wm_Mouse_pointer","wm_BorderTopStyle_Curved4px"]},"align":"center","border":"1,1,0,1","borderColor":"#999999","caption":"Nodemanager Logs","margin":"0,4,0,4","padding":"4","width":"170px"}, {"onclick":"labelNodemanagerLogsClick"}],
													labelOpenkviLogs: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_Mouse_pointer","wm_BorderTopStyle_Curved4px"]},"align":"center","border":"1,1,0,1","borderColor":"#999999","caption":"OpenKVI Logs","margin":"0,4,0,4","padding":"4","width":"130px"}, {"onclick":"labelOpenkviLogsClick"}],
													panel261: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","margin":"0,5,0,0","verticalAlign":"bottom","width":"100%"}, {}, {
														setDebugModeBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"","hint":"Enable Debug Mode","imageIndex":53,"imageList":"app.silkIconsOpenkvi","margin":"4","roles":["dev","Administrator"],"width":"50px"}, {"onclick":"setDebugModeBtnClick"}]
													}]
												}],
												panelDataCenterLogsFrame: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px"]},"border":"1","borderColor":"#999999","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
													panel263: ["wm.EmphasizedContentPanel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
														tabNodeNetworkConfig1: ["wm.Layers", {"defaultLayer":0,"transition":"slide"}, {}, {
															layerNodeManagerLogs: ["wm.Layer", {"borderColor":"","caption":"layerNodeManagerLogs","horizontalAlign":"left","margin":"0","padding":"0","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
																panelNodemanagerLogs: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","margin":"0","minWidth":200,"verticalAlign":"top","width":"100%"}, {}, {
																	panel237: ["wm.Panel", {"border":"0,0,1,0","borderColor":"#b3b8c4","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
																		checkErrorLogs: ["wm.Checkbox", {"_classes":{"domNode":["wm_FontColor_BrightRed"]},"caption":"ERRORS","captionSize":"80px","dataValue":"true","displayValue":"true","startChecked":true,"width":"100px"}, {"onchange":"onLogCheckboxChange"}],
																		checkWarningLogs: ["wm.Checkbox", {"caption":"<font color = 'OrangeRed'>WARNINGS</font>","dataValue":"true","displayValue":"true","startChecked":true}, {"onchange":"onLogCheckboxChange"}],
																		checkInfoLogs: ["wm.Checkbox", {"_classes":{"domNode":["wm_FontColor_SteelBlue"]},"caption":"<font color = 'DarkSlateBlue '>INFOS</font>","captionSize":"70px","dataValue":"true","displayValue":"true","startChecked":true,"width":"90px"}, {"onchange":"onLogCheckboxChange"}],
																		checkEventLogs: ["wm.Checkbox", {"_classes":{"domNode":["wm_FontColor_Green"]},"caption":"EVENTS","captionSize":"80px","dataValue":"true","displayValue":"true","startChecked":true,"width":"100px"}, {"onchange":"onLogCheckboxChange"}],
																		checkDebugLogs: ["wm.Checkbox", {"_classes":{"domNode":["wm_FontColor_Black"]},"caption":"<font color = 'Grey'>DEBUGS</font>","captionSize":"80px","dataValue":"","displayValue":"","width":"100px"}, {"onchange":"onLogCheckboxChange"}]
																	}],
																	nodemanagerLogArea: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_BorderShadow_NoShadow","wm_BackgroundColor_White","wm_BorderBottomStyle_Curved4px"]},"border":"0,1,1,1","borderColor":"#b3b8c4","dataValue":undefined,"displayValue":"","editorBorder":false,"height":"100%","margin":"0,8,8,8","padding":"4","readonly":true,"width":"100%"}, {}]
																}]
															}],
															layerOpenkviLogs: ["wm.Layer", {"borderColor":"","caption":"layerOpenkviLogs","horizontalAlign":"left","margin":"0","padding":"0","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
																panelOpenkviLogs: ["wm.MainContentPanel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																	dataCenterDebugArea: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved8px","wm_BorderTopStyle_Curved8px","wm_BackgroundColor_White"]},"border":"1","borderColor":"#b3b8c4","dataValue":undefined,"displayValue":"","height":"100%","margin":"10,10,0,10","padding":"2.","readonly":true,"width":"100%"}, {}],
																	clearOpenkviLogsPanel: ["wm.Panel", {"border":"0","height":"32px","horizontalAlign":"left","padding":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
																		clearOpenkviLogsBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Reset","imageIndex":98,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"clearOpenkviLogsBtnClick"}]
																	}]
																}]
															}]
														}]
													}]
												}]
											}]
										}]
									}]
								}]
							}],
							layerServer: ["wm.Layer", {"borderColor":"","caption":"Server","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}, {
								panelServerTabs: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
									tabServers: ["wm.TabLayers", {"defaultLayer":0,"headerHeight":"30px","margin":"0,0,0,0"}, {}, {
										TabServersOverview: ["wm.Layer", {"_classes":{"domNode":["MainContent"]},"autoScroll":true,"border":"1","borderColor":"#b3b8c4","caption":"Overview","horizontalAlign":"left","imageList":"app.silkIconsOpenkvi","layoutKind":"left-to-right","margin":"1","padding":"5,10,5,10","verticalAlign":"top"}, {}, {
											panel7: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","minHeight":450,"verticalAlign":"top","width":"330px"}, {}, {
												spacer34: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
												panel59: ["wm.Panel", {"border":"0","height":"250px","horizontalAlign":"left","margin":"10","verticalAlign":"top","width":"310px"}, {}, {
													label28: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_BorderTopStyle_Curved4px","wm_BorderShadow_WeakShadow","wm_SilverBlueTheme_ToolBar"]},"border":"1","borderColor":"#999999","caption":"General Information","height":"26px","padding":"0,0,0,5","width":"280px"}, {}, {
														format: ["wm.DataFormatter", {}, {}]
													}],
													panel53: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderShadow_WeakShadow","wm_BackgroundColor_VeryLightGray"]},"border":"0,1,1,1","borderColor":"#999999","height":"170px","horizontalAlign":"left","verticalAlign":"middle","width":"280px"}, {}, {
														serverIpText: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"IP address :","captionAlign":"left","captionSize":"110px","dataValue":undefined,"displayValue":"","padding":"0,0,0,10","readonly":true,"width":"100%"}, {}],
														serverHypervisorText: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Hypervisor:","captionAlign":"left","captionSize":"110px","displayValue":"","padding":"0,0,0,10","readonly":true,"width":"100%"}, {}, {
															binding: ["wm.Binding", {}, {}, {
																wire: ["wm.Wire", {"expression":false,"source":"varServerXmlData.hypervisor","targetProperty":"dataValue"}, {}]
															}]
														}],
														textCpuAch: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Architecture:","captionAlign":"left","captionSize":"110px","dataValue":undefined,"displayValue":"","padding":"0,0,0,10","readonly":true,"width":"100%"}, {}],
														textCoreNumber: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Cores :","captionAlign":"left","captionSize":"110px","dataValue":undefined,"displayValue":"","padding":"0,0,0,10","readonly":true,"width":"100%"}, {}],
														textFrequency: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Frequency :","captionAlign":"left","captionSize":"110px","dataValue":undefined,"displayValue":"","padding":"0,0,0,10","readonly":true,"width":"100%"}, {}],
														textHyperthreading: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Hyperthreading :","captionAlign":"left","captionSize":"110px","dataValue":undefined,"displayValue":"","padding":"0,0,0,10","readonly":true,"width":"100%"}, {}]
													}]
												}],
												panel66: ["wm.HeaderContentPanel", {"borderColor":"#cbcbcb","fitToContentHeight":true,"height":"132px","horizontalAlign":"left","margin":"10","verticalAlign":"top","width":"310px"}, {}, {
													label30: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_BorderTopStyle_Curved4px","wm_BorderShadow_WeakShadow","wm_SilverBlueTheme_ToolBar"]},"border":"1","borderColor":"#999999","caption":"Physical Interfaces","height":"26px","padding":"0,0,0,5","width":"280px"}, {}, {
														format: ["wm.DataFormatter", {}, {}]
													}],
													panelNodeNetworkInterfaces: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderShadow_WeakShadow","wm_BackgroundColor_VeryLightGray"]},"border":"0,1,1,1","borderColor":"#999999","fitToContentHeight":true,"height":"66px","horizontalAlign":"left","verticalAlign":"top","width":"280px"}, {}, {
														spacer13: ["wm.Spacer", {"height":"5px","width":"100%"}, {}],
														networkInterfacesTextArea: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"autoSizeHeight":true,"dataValue":undefined,"displayValue":"","height":"50px","maxHeight":320,"minHeight":50,"padding":"0,10,0,10","readonly":true,"width":"100%"}, {}],
														spacer59: ["wm.Spacer", {"height":"10px","width":"100%"}, {}]
													}],
													spacer33: ["wm.Spacer", {"height":"20px","width":"96px"}, {}]
												}]
											}],
											panel65: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
												spacer35: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
												panel185: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"273px","horizontalAlign":"left","margin":"10","verticalAlign":"top","width":"310px"}, {}, {
													label59: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_BorderTopStyle_Curved4px","wm_BorderShadow_WeakShadow","wm_SilverBlueTheme_ToolBar"]},"border":"1","borderColor":"#999999","caption":"Ressources","height":"26px","padding":"0,0,0,5","width":"280px"}, {}, {
														format: ["wm.DataFormatter", {}, {}]
													}],
													panelNodeRessources: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderShadow_WeakShadow","wm_BackgroundColor_VeryLightGray"]},"border":"0,1,1,1","borderColor":"#999999","fitToContentHeight":true,"height":"195px","horizontalAlign":"left","padding":"0,10,0,10","verticalAlign":"middle","width":"280px"}, {}, {
														spacer57: ["wm.Spacer", {"height":"10px","width":"100%"}, {}],
														panel188: ["wm.Panel", {"border":"0","height":"46px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
															pictureNodeMem1: ["wm.Picture", {"border":"0","height":"28px","showing":false,"source":"resources/images/icons/hardware/cpu.png","width":"28px"}, {}],
															panel189: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"36px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																panel191: ["wm.Panel", {"border":"0","height":"20px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																	titleCpuUsage: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"CPU usage:","height":"20px","padding":"0","width":"75px"}, {}],
																	labelTitleCpuUsage: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_TextDecoration_Bold"]},"align":"right","border":"0","caption":"","height":"20px","padding":"0","width":"80px"}, {}]
																}],
																panel190: ["wm.Panel", {"border":"0","height":"16px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																	labelCpuUsage: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"<progress max='100' value='0'></progress>","height":"16px","padding":"2,0,0,20","width":"162px"}, {}],
																	labelTotalCpu: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"","height":"16px","padding":"0,0,2,5"}, {}]
																}]
															}]
														}],
														panel49: ["wm.Panel", {"border":"0","height":"62px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
															pictureNodeMem: ["wm.Picture", {"border":"0","height":"20px","showing":false,"source":"resources/images/icons/hardware/memory.png","width":"28px"}, {}],
															panel187: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"52px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																panel193: ["wm.Panel", {"border":"0","height":"20px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																	titleMemUsage: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"Memory usage:","height":"20px","padding":"0","width":"100px"}, {}],
																	labelUsedMemory: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_TextDecoration_Bold"]},"align":"right","border":"0","caption":"","height":"20px","padding":"0","width":"55px"}, {}]
																}],
																panel192: ["wm.Panel", {"border":"0","height":"16px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																	labelMemoryUsage: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"<progress max=\"100\" value=\"0\"></progress>","height":"16px","padding":"2,0,0,20","width":"162px"}, {}],
																	labelTotalMemory: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"","height":"16px","padding":"0,0,2,5","width":"100%"}, {}]
																}],
																labelNodeFreeMem: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_LightBlue"]},"border":"0","caption":"","height":"16px","padding":"0,0,0,25","width":"100%"}, {}]
															}]
														}],
														panel195: ["wm.Panel", {"border":"1,0,0,0","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
															label60: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"Storage devices:","padding":"4,4,4,0"}, {}]
														}],
														panel194: ["wm.HeaderContentPanel", {"border":"1","borderColor":"#999999","fitToContentHeight":true,"height":"42px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
															gridStoragesUsage: ["wm.DojoGrid", {"border":"0","columns":[{"show":false,"id":"used","title":"","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"name","title":"Name","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"size","title":"Size","width":"40px","displayType":"Text","noDelete":true,"align":"center","formatFunc":""},{"show":true,"id":"available","title":"Free","width":"40px","displayType":"Text","noDelete":true,"align":"center","formatFunc":""},{"show":true,"id":"info","title":"<image style=\"height: 12px;\" src=\"resources/images/icons/documentinfo-12.png\"/>","width":"24px","displayType":"Text","noDelete":true,"align":"center","formatFunc":""}],"height":"40px","margin":"0"}, {}, {
																binding: ["wm.Binding", {}, {}, {
																	wire: ["wm.Wire", {"expression":undefined,"source":"varStorageCapacity","targetProperty":"dataSet"}, {}]
																}]
															}]
														}],
														spacer55: ["wm.Spacer", {"height":"10px","width":"100%"}, {}]
													}],
													spacer56: ["wm.Spacer", {"height":"32px","width":"100px"}, {}]
												}],
												panel60: ["wm.Panel", {"border":"0","height":"170px","horizontalAlign":"left","margin":"10","verticalAlign":"top","width":"310px"}, {}, {
													label52: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_BorderTopStyle_Curved4px","wm_BorderShadow_WeakShadow","wm_SilverBlueTheme_ToolBar"]},"border":"1","borderColor":"#999999","caption":"Hardware","height":"26px","padding":"0,0,0,5","width":"280px"}, {}, {
														format: ["wm.DataFormatter", {}, {}]
													}],
													panel61: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderShadow_WeakShadow","wm_BackgroundColor_VeryLightGray"]},"border":"0,1,1,1","borderColor":"#999999","fitToContentHeight":true,"height":"91px","horizontalAlign":"left","verticalAlign":"middle","width":"280px"}, {}, {
														spacer38: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
														nodeManufacturer: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Manufacturer :","captionAlign":"left","captionSize":"90px","dataValue":"Unknown","displayValue":"Unknown","height":"20px","minWidth":110,"padding":"0,0,0,10","readonly":true,"width":"100%"}, {}],
														nodeProductSerial: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Serial :","captionAlign":"left","captionSize":"90px","dataValue":undefined,"displayValue":"","height":"20px","padding":"0,0,0,10","readonly":true,"width":"100%"}, {}],
														panel52: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
															label53: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"Product :","height":"20px","padding":"0,0,0,10","width":"90px"}, {}],
															nodeProduct: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"autoSizeHeight":true,"captionSize":"18px","dataValue":"Unknown","displayValue":"Unknown","height":"30px","margin":"0","maxHeight":350,"minHeight":30,"padding":"3,0,0,10","readonly":true,"width":"100%"}, {}]
														}],
														spacer58: ["wm.Spacer", {"height":"10px","width":"96px"}, {}]
													}]
												}]
											}]
										}],
										TabConsole: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"Console","horizontalAlign":"left","margin":"1","padding":"10","roles":["dev","admin","Administrator"],"themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"TabConsoleShow"}, {
											panelNodeConsoleWarning: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
												panel169: ["wm.Panel", {"border":"0","height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"400px"}, {}, {
													pictureWarningDialog1: ["wm.Picture", {"border":"0","height":"47px","source":"resources/images/icons/dialog-warning-45.png","width":"47px"}, {}],
													label78: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_BrightRed","wm_TextDecoration_Bold"]},"border":"0","caption":"The SSH Console can only be accessed through a secure connection (https).","height":"40px","padding":"4","singleLine":false,"width":"350px"}, {}]
												}]
											}],
											panelNodeConsole: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
												panel80: ["wm.Panel", {"border":"0","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
													btnDetachNodeConsole: ["wm.Button", {"caption":" Detach","hint":"Open Console in an new window.","imageIndex":76,"imageList":"app.silkIconList","margin":"4"}, {"onclick":"btnDetachNodeConsoleClick"}]
												}],
												panelFrameConsole: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px","wm_BorderShadow_NoShadow","wm_BackgroundColor_White"]},"height":"100%","horizontalAlign":"center","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
													iFrameNodeConsole: ["wm.IFrame", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_NoCurve"]},"border":"0","height":"100%","margin":"6","width":"100%"}, {}]
												}],
												labelWebshellUri: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"https://","padding":"4","width":"100%"}, {}]
											}]
										}],
										TabServersConfig: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"Configuration","horizontalAlign":"left","layoutKind":"left-to-right","margin":"1","padding":"5,10,5,10","roles":["dev","Administrator"],"verticalAlign":"top"}, {"onShow":"TabServersConfigShow"}, {
											panel29: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
												panel30: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"border":"1","borderColor":"#b3b8c4","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"20","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
													panel32: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"180px"}, {}, {
														panel34: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BackgroundColor_White"]},"border":"0,1,0,0","borderColor":"#b3b8c4","height":"100%","horizontalAlign":"left","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
															panel51: ["wm.Panel", {"border":"0","height":"10px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}],
															panelServerStorages: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
																picture8: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/server_config/storage-24.png","width":"24px"}, {}],
																labelServerConfigStorage: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_Mouse_pointer"]},"border":"0,0,0,0","borderColor":"#b3b8c4","caption":"Storage Pools","padding":"4","width":"100%"}, {"onclick":"labelServerConfigStorageClick"}, {
																	format: ["wm.DataFormatter", {}, {}]
																}]
															}],
															panelServerNetworking: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
																picture13: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/server_config/system_config_network.png","width":"24px"}, {}],
																labelServerNetworking: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_Mouse_pointer"]},"border":"0","caption":"Networking","padding":"4"}, {"onclick":"labelServerNetworkingClick"}, {
																	format: ["wm.DataFormatter", {}, {}]
																}]
															}],
															panelServerNtp: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
																picture17: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/server_config/clock.png","width":"24px"}, {}],
																labelServerNtp: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_Mouse_pointer"]},"border":"0","caption":"Time configuration","padding":"4"}, {"onclick":"labelServerNtpClick"}, {
																	format: ["wm.DataFormatter", {}, {}]
																}]
															}],
															panelServerSnmp: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
																picture32: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/server_config/flag-red.png","width":"24px"}, {}],
																labelServerSnmp: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_Mouse_pointer"]},"border":"0","caption":"Hardware events","padding":"4"}, {"onclick":"labelServerSnmpClick"}, {
																	format: ["wm.DataFormatter", {}, {}]
																}]
															}],
															panelServerCapabilities: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
																picture15: ["wm.Picture", {"border":"0","height":"24px","source":"resources/images/icons/server_config/server-capabilities.png","width":"24px"}, {}],
																labelServerCapa: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_Mouse_pointer"]},"border":"0","caption":"Features","padding":"4"}, {"onclick":"labelServerCapaClick"}, {
																	format: ["wm.DataFormatter", {}, {}]
																}]
															}]
														}]
													}],
													panel33: ["wm.MainContentPanel", {"border":"0","borderColor":"#b3b8c4","height":"100%","horizontalAlign":"left","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
														layersServer: ["wm.Layers", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"borderColor":"#b3b8c4","defaultLayer":4,"margin":"10"}, {}, {
															layerServerStorage: ["wm.Layer", {"_classes":{"domNode":["MainContent"]},"borderColor":"","caption":"layerServerStorage","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}, {
																panel167: ["wm.MainContentPanel", {"border":"0,0,1,0","borderColor":"#888888","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																	label48: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold"]},"border":"0","caption":"Pools:","padding":"4","width":"100%"}, {}]
																}],
																panel31: ["wm.HeaderContentPanel", {"height":"100%","horizontalAlign":"left","padding":"20,10,10,10","verticalAlign":"top","width":"100%"}, {}, {
																	storageGrid: ["wm.DojoGrid", {"columns":[{"show":true,"id":"name","title":"Name","width":"150px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"type","title":"Type","width":"60px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"target","title":"Target","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"source","title":"Source","width":"100px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"capacity","title":"Capacity","width":"60px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"allocation","title":"Allocated","width":"60px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"available","title":"Available","width":"60px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","margin":"0"}, {}, {
																		binding: ["wm.Binding", {}, {}, {
																			wire: ["wm.Wire", {"expression":undefined,"source":"varStorages","targetProperty":"dataSet"}, {}]
																		}]
																	}]
																}],
																panel78: ["wm.MainContentPanel", {"border":"0","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
																	storageNewButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" New","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"serverRepositoryDialog.show"}],
																	storageUpdateButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Edit","imageIndex":80,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {}, {
																		binding: ["wm.Binding", {}, {}, {
																			wire: ["wm.Wire", {"expression":false,"source":"storageGrid.emptySelection","targetProperty":"disabled"}, {}]
																		}]
																	}],
																	storageDeleteButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Delete","imageIndex":108,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {}, {
																		binding: ["wm.Binding", {}, {}, {
																			wire: ["wm.Wire", {"expression":false,"source":"storageGrid.emptySelection","targetProperty":"disabled"}, {}]
																		}]
																	}]
																}]
															}],
															layerServerNetwork: ["wm.Layer", {"borderColor":"","caption":"layerServerNetwork","horizontalAlign":"center","layoutKind":"left-to-right","padding":"0","verticalAlign":"middle"}, {}, {
																panelNodeNetworkConfig: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																	panel163: ["wm.MainContentPanel", {"border":"0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","verticalAlign":"bottom","width":"100%"}, {}, {
																		labelConfigVirtualNetworks: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold","wm_Mouse_pointer","wm_BorderTopStyle_Curved4px"]},"align":"center","border":"1,1,0,1","caption":"Virtual Networks","margin":"0,4,0,4","padding":"4","width":"150px"}, {"onclick":"labelConfigVirtualNetworksClick"}],
																		labelConfigHostNetworks: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold","wm_Mouse_pointer","wm_BorderTopStyle_Curved4px"]},"align":"center","border":"1,1,0,1","caption":"Host Networks","margin":"0,4,0,4","padding":"4","width":"150px"}, {"onclick":"labelConfigHostNetworksClick"}],
																		panel54: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","margin":"0","verticalAlign":"bottom","width":"100%"}, {}, {
																			btnReloadNodeConfig: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"","hint":"Reload node's configuration.","imageIndex":98,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"40px"}, {"onclick":"btnReloadNodeConfigClick"}]
																		}]
																	}],
																	panel235: ["wm.Panel", {"border":"1","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																		panel161: ["wm.EmphasizedContentPanel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
																			tabNodeNetworkConfig: ["wm.Layers", {"defaultLayer":0,"transition":"slide"}, {}, {
																				layerVirtualNetworks: ["wm.Layer", {"borderColor":"","caption":"layer2","horizontalAlign":"left","padding":"0","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
																					virtualNetNodePanelMain: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","minWidth":200,"verticalAlign":"top","width":"100%"}, {}, {
																						virtualNetNodePanel: ["wm.Panel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,10,0,10","verticalAlign":"top","width":"100%"}, {}, {
																							htmlVirtualNetworks: ["wm.Html", {"border":"0","height":"100%"}, {}]
																						}],
																						panel166: ["wm.MainContentPanel", {"border":"1,0,0,0","borderColor":"#888888","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
																							btnInterfaceNew: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" New","hint":"Add a new network interface","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnInterfaceNewClick"}]
																						}]
																					}]
																				}],
																				layerHostNetworks: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"left","padding":"0","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
																					panelNodeNetPhysicalMain: ["wm.MainContentPanel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																						panelNodeNetPhysical: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
																							htmlHostNetworkConfig: ["wm.Html", {"border":"0","height":"100%","margin":"10,10,10,0"}, {}]
																						}]
																					}]
																				}]
																			}],
																			panelNodeNetworking: ["wm.Panel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
																				panel45: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"30px"}, {}]
																			}]
																		}]
																	}]
																}]
															}],
															layerServerOption: ["wm.Layer", {"_classes":{"domNode":["MainContent"]},"borderColor":"","caption":"layerServerOption","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}],
															layerServerCapabilities: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}, {
																panel58: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																	panel168: ["wm.Panel", {"border":"0,0,1,0","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																		label50: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold"]},"border":"0","caption":"Features:","padding":"4"}, {}]
																	}],
																	panel64: ["wm.Panel", {"border":"0","borderColor":"#cbcbcb","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																		textServerInfo: ["wm.LargeTextArea", {"borderColor":"#cbcbcb","dataValue":undefined,"displayValue":"","height":"100%","maxHeight":1024,"padding":"10","readonly":true,"width":"100%"}, {}]
																	}]
																}]
															}],
															layerServerSnmp: ["wm.Layer", {"borderColor":"","caption":"layerServerCoordinates","horizontalAlign":"left","padding":"0","themeStyleType":"","verticalAlign":"top"}, {"onShow":"layerServerSnmpShow"}, {
																panel203: ["wm.Panel", {"border":"0,0,1,0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
																	label61: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold"]},"border":"0","caption":"SNMP service:","padding":"4"}, {}],
																	panel84: ["wm.MainContentPanel", {"border":"0","height":"35px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
																		snmpConfigBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"<image style='height: 20px;' src='resources/images/icons/server_config/preferences-system.png'/>","hint":"Configure SNMP Service","imageIndex":0,"margin":"4"}, {"onclick":"snmpConfigBtnClick"}]
																	}]
																}],
																panelNodeSnmp: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"border":"0","fitToContentHeight":true,"height":"68px","horizontalAlign":"left","padding":"10,0,10,20","verticalAlign":"top","width":"100%"}, {}, {
																	panel276: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
																		label79: ["wm.Label", {"border":"0","caption":"Service status:","padding":"4","width":"100px"}, {}],
																		pictureWarningSnmpService: ["wm.Picture", {"border":"0","height":"16px","hint":"Service is stopped while Autostart is \"on\"","source":"resources/images/icons/dialog-warning-16.png","width":"16px"}, {}],
																		labelSnmpServiceState: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"<i>Stopped</i>","padding":"4","width":"140px"}, {}],
																		label80: ["wm.Label", {"border":"0","caption":"Autostart:","padding":"4","width":"70px"}, {}],
																		pictureWarningSnmpAutostart: ["wm.Picture", {"border":"0","height":"16px","hint":"Service is running while Autostart is \"off\"","source":"resources/images/icons/dialog-warning-16.png","width":"16px"}, {}],
																		labelSnmpAutoStart: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"<i>Off</i>","padding":"4","width":"80px"}, {}]
																	}],
																	panel277: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
																		label84: ["wm.Label", {"border":"0","caption":"Remote server:","padding":"4","width":"100px"}, {}],
																		labelSnmpServer: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"<i>unknown</i>","padding":"4"}, {}]
																	}]
																}],
																panelSnmpWarning: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px","wm_BackgroundColor_Yellow"]},"border":"1","height":"80px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"10","padding":"5","showing":false,"verticalAlign":"top","width":"500px"}, {}, {
																	picture10: ["wm.Picture", {"border":"0","height":"45px","source":"resources/images/icons/dialog-warning-45.png","width":"45px"}, {}],
																	labelSnmpWarning: ["wm.Label", {"border":"0","caption":"","height":"100%","padding":"4","singleLine":false,"width":"100%"}, {}]
																}],
																panel275: ["wm.Panel", {"border":"0,0,1,0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
																	label87: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold"]},"border":"0","caption":"Hardware agent:","padding":"4"}, {}],
																	panel283: ["wm.MainContentPanel", {"border":"0","height":"35px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
																		hardwareAgentConfigBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"<image style='height: 20px;' src='resources/images/icons/server_config/preferences-system.png'/>","hint":"Configure SNMP Service","imageIndex":0,"margin":"4"}, {"onclick":"hardwareAgentConfigBtnClick"}]
																	}]
																}],
																panel279: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"69px","horizontalAlign":"left","padding":"10,0,10,20","verticalAlign":"top","width":"100%"}, {}, {
																	panel278: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
																		label85: ["wm.Label", {"border":"0","caption":"Agent name:","padding":"4","width":"100px"}, {}],
																		labelHardwareAgentName: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"<i>unknown</i>","padding":"4","width":"140px"}, {}],
																		label86: ["wm.Label", {"border":"0","caption":"Version:","padding":"4","width":"70px"}, {}],
																		pictureWarningSnmpAgent: ["wm.Picture", {"border":"0","height":"16px","hint":"Hardware Agent is not installed.","source":"resources/images/icons/dialog-warning-16.png","width":"16px"}, {}],
																		labelHardwareAgentVersion: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"<i>0.0</i>","padding":"4","width":"180px"}, {}]
																	}],
																	panel280: ["wm.Panel", {"border":"0","fitToContentHeight":true,"height":"25px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
																		label88: ["wm.Label", {"border":"0","caption":"Service status:","padding":"4","width":"100px"}, {}],
																		labelHardwareAgentStatus: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"autoSizeHeight":true,"border":"0","caption":"<i>unknown</i>","height":"25px","padding":"4","singleLine":false,"width":"140px"}, {}],
																		label89: ["wm.Label", {"border":"0","caption":"Autostart:","padding":"4","width":"70px"}, {}],
																		labelHardwareAgentAutoStart: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"<i>Off</i>","padding":"4","width":"80px"}, {}]
																	}]
																}],
																panelHardwareAgentWarning: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px","wm_BackgroundColor_Yellow"]},"border":"1","height":"80px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"10","padding":"5","showing":false,"verticalAlign":"top","width":"500px"}, {}, {
																	picture33: ["wm.Picture", {"border":"0","height":"45px","source":"resources/images/icons/dialog-warning-45.png","width":"45px"}, {}],
																	labelHardwareAgentWarning: ["wm.Label", {"border":"0","caption":"","height":"100%","padding":"4","singleLine":false,"width":"100%"}, {}]
																}],
																panelHardwareAgentInfo: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px"]},"border":"0","height":"80px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"10","padding":"5","verticalAlign":"top","width":"520px"}, {}, {
																	picture34: ["wm.Picture", {"border":"0","height":"16px","showing":false,"source":"resources/images/icons/documentinfo.png","width":"16px"}, {}],
																	labelHardwareAgentInfo: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"<i>N.B.: Depending on the hardware platform, you can also configure the baseboard's management module to send events in case of Operationg System failure.</i>","height":"100%","padding":"4","singleLine":false,"width":"100%"}, {}]
																}]
															}],
															layerServerNtp: ["wm.Layer", {"autoScroll":true,"borderColor":"","caption":"layer1","horizontalAlign":"left","padding":"0","themeStyleType":"","verticalAlign":"top"}, {"onShow":"layerServerNtpShow"}, {
																panelNodeTimeConfiguration: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																	panelNtpGeneral: ["wm.Panel", {"border":"0,0,1,0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
																		label27: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_FontColor_Black"]},"border":"0","caption":"General:","padding":"4"}, {}],
																		panel139: ["wm.MainContentPanel", {"border":"0","height":"35px","horizontalAlign":"right","layoutKind":"left-to-right","padding":"0,0,0,15","verticalAlign":"bottom","width":"100%"}, {}, {
																			btnEditGeneralNtp: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"<image style=\"height: 20px;\" src=\"resources/images/icons/server_config/preferences-system.png\"/>","hint":"Configure NTP Service","imageList":"app.silkIconList","margin":"4"}, {"onclick":"ntpConfigurationDialog.show"}]
																		}]
																	}],
																	spacer8: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
																	panel216: ["wm.Panel", {"border":"0","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,15","verticalAlign":"top","width":"100%"}, {}, {
																		label65: ["wm.Label", {"border":"0","caption":"Date & Time:","padding":"4","width":"100px"}, {}],
																		labelDateAndTime: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","padding":"4","width":"100%"}, {}]
																	}],
																	panel224: ["wm.Panel", {"border":"0","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,15","verticalAlign":"top","width":"100%"}, {}, {
																		label70: ["wm.Label", {"border":"0","caption":"Timezone:","padding":"4","width":"100px"}, {}],
																		labelNodeTimezone: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","padding":"4"}, {}]
																	}],
																	panel217: ["wm.Panel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,15","verticalAlign":"top","width":"100%"}, {}, {
																		label64: ["wm.Label", {"border":"0","caption":"NTP daemon:","padding":"4","width":"100px"}, {}],
																		pictureWarningNtpService: ["wm.Picture", {"border":"0","height":"16px","hint":"Service is stopped while Autostart is \"on\"","source":"resources/images/icons/dialog-warning-16.png","width":"16px"}, {}],
																		labelNtpDaemonState: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","padding":"4","width":"100px"}, {}],
																		label69: ["wm.Label", {"border":"0","caption":"Autostart:","padding":"4","width":"70px"}, {}],
																		pictureWarningNtpAutostart: ["wm.Picture", {"border":"0","height":"16px","hint":"Service is running while Autostart is \"off\"","source":"resources/images/icons/dialog-warning-16.png","width":"16px"}, {}],
																		labelNtpAutoStart: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","padding":"4","width":"80px"}, {}]
																	}],
																	panelNtpServers: ["wm.Panel", {"border":"0","height":"170px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																		panelNtpServersTitle: ["wm.Panel", {"border":"0,0,1,0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
																			label49: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_FontColor_Black"]},"border":"0","caption":"NTP servers:","padding":"4"}, {}]
																		}],
																		spacer9: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
																		panel214: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																			panel213: ["wm.HeaderContentPanel", {"fitToContentHeight":true,"fitToContentWidth":true,"height":"130px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"300px"}, {}, {
																				gridNtpServerList: ["wm.DojoGrid", {"columns":[{"show":true,"id":"name","title":"Name","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"dataValue","title":"DataValue","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"130px","margin":"4","width":"300px"}, {}, {
																					binding: ["wm.Binding", {}, {}, {
																						wire: ["wm.Wire", {"expression":undefined,"source":"varNtpServerList","targetProperty":"dataSet"}, {}]
																					}]
																				}]
																			}],
																			panel212: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"5,5,5,10","verticalAlign":"middle","width":"100%"}, {}, {
																				btnAddNtpServer: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" New","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnAddNtpServerClick"}],
																				btnEditNtpServer: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Edit","imageIndex":80,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnEditNtpServerClick"}, {
																					binding: ["wm.Binding", {}, {}, {
																						wire: ["wm.Wire", {"expression":undefined,"source":"gridNtpServerList.emptySelection","targetProperty":"disabled"}, {}]
																					}]
																				}],
																				btnRemoveNtpServer: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Remove","imageIndex":108,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnRemoveNtpServerClick"}, {
																					binding: ["wm.Binding", {}, {}, {
																						wire: ["wm.Wire", {"expression":undefined,"source":"gridNtpServerList.emptySelection","targetProperty":"disabled"}, {}]
																					}]
																				}]
																			}]
																		}]
																	}],
																	spacer64: ["wm.Spacer", {"height":"30px","width":"96px"}, {}],
																	panel211: ["wm.MainContentPanel", {"border":"0,0,1,0","borderColor":"#888888","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"3,3,0,3","padding":"0","verticalAlign":"middle","width":"100%"}, {}, {
																		pictShowNtpAvanced: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"16px","hint":"Show","source":"resources/images/icons/arrow-hide.png","width":"16px"}, {"onclick":"pictShowNtpAvancedClick"}],
																		label63: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_FontColor_Black"]},"border":"0","caption":"Advanced options:","padding":"4","width":"160px"}, {}]
																	}],
																	panelNtpMisc: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px"]},"border":"0,1,1,1","borderColor":"#cbcbcb","height":"100%","horizontalAlign":"left","margin":"0,3,3,3","padding":"0,10,0,10","verticalAlign":"top","width":"100%"}, {}, {
																		spacer65: ["wm.Spacer", {"height":"15px","width":"96px"}, {}],
																		panelEditNtpMisc: ["wm.Panel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																			NtpOptionTextArea: ["wm.LargeTextArea", {"captionSize":"100px","changeOnKey":true,"dataValue":undefined,"displayValue":"","height":"100%","width":"100%"}, {}]
																		}],
																		panelBtnNtpMisc: ["wm.MainContentPanel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
																			btnEditMiscNtp: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Apply","imageIndex":0,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnEditMiscNtpClick"}, {
																				binding: ["wm.Binding", {}, {}, {
																					wire: ["wm.Wire", {"expression":"${NtpOptionTextArea.isDirty} !== true","source":false,"targetProperty":"disabled"}, {}]
																				}]
																			}],
																			btnCancelMiscNtp: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Reset","imageIndex":98,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnCancelMiscNtpClick"}, {
																				binding: ["wm.Binding", {}, {}, {
																					wire: ["wm.Wire", {"expression":"${NtpOptionTextArea.isDirty} !== true","source":false,"targetProperty":"disabled"}, {}]
																				}]
																			}]
																		}]
																	}]
																}]
															}]
														}]
													}]
												}]
											}]
										}],
										TabServersVMs: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"Virtual Machines","horizontalAlign":"left","layoutKind":"left-to-right","margin":"1","padding":"5,10,5,10","verticalAlign":"top"}, {"onShow":"TabServersVMsShow"}, {
											panel9: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"20","verticalAlign":"top","width":"100%"}, {}, {
												panel143: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"400px"}, {}, {
													labelNodeNbVms: ["wm.Label", {"border":"0","caption":"Number of virtual machines:","padding":"4","width":"100%"}, {}, {
														format: ["wm.DataFormatter", {}, {}]
													}],
													panel186: ["wm.HeaderContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
														GridVmList: ["wm.DojoGrid", {"_classes":{"domNode":["wm_Mouse_pointer"]},"columns":[{"show":false,"id":"id","title":"Id","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":true,"id":"name","title":"VM Name","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"displayedname","title":"Label","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"arch","title":"Architecture","width":"80px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"nbcpu","title":"vCPUs","width":"80px","displayType":"Number","noDelete":true,"align":"center","formatFunc":""},{"show":false,"id":"memory","title":"Memory (MB)","width":"80px","displayType":"Number","noDelete":true,"align":"center","formatFunc":""},{"show":false,"id":"freqcpu","title":"Freqcpu","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"network","title":"Network","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"cdrom","title":"Cdrom","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"server","title":"Server","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"disks","title":"Disks","width":"80px","displayType":"Text","noDelete":true,"align":"center","formatFunc":""}],"height":"100%","margin":"4"}, {"onCellDblClick":"GridVmListCellDblClick","onSelectionChange":"GridVmListSelectionChange"}, {
															binding: ["wm.Binding", {}, {}, {
																wire: ["wm.Wire", {"expression":undefined,"source":"vmListByServerLive","targetProperty":"dataSet"}, {}]
															}]
														}]
													}],
													vmGridButtonPanel: ["wm.MainContentPanel", {"border":"0","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","roles":["dev","Administrator","PowerUser"],"verticalAlign":"top","width":"100%"}, {}, {
														vmNewButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"New","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"onNewVmButtonClick"}],
														vmDeleteButton: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"Delete","imageIndex":108,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"vmDeleteButtonClick"}, {
															binding: ["wm.Binding", {}, {}, {
																wire: ["wm.Wire", {"expression":false,"source":"GridVmList.emptySelection","targetProperty":"disabled"}, {}]
															}]
														}]
													}]
												}]
											}]
										}],
										TabServersPerformances: ["wm.Layer", {"autoScroll":true,"border":"1","borderColor":"#b3b8c4","caption":"Performances","horizontalAlign":"center","margin":"0","padding":"0","verticalAlign":"top"}, {"onShow":"TabServersPerformancesShow"}, {
											panelNodePerformancesTools: ["wm.MainContentPanel", {"border":"0,0,1,0","borderColor":"#b3b8c4","height":"38px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
												panel291: ["wm.MainContentPanel", {"border":"0,1,0,0","height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","margin":"3,0,3,0","verticalAlign":"middle","width":"48px"}, {}, {
													btnDetachNodePerformances: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"","hint":"Detach panel","imageIndex":59,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"40px"}, {"onclick":"btnDetachNodePerformancesClick"}]
												}],
												panel292: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","margin":"3,0,3,0","verticalAlign":"middle","width":"96px"}, {}, {
													btnSetNodePerformancesAutoReload: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_Green"]},"caption":"","hint":"Unset automatic data reloading.","imageIndex":89,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"40px"}, {"onclick":"btnSetNodePerformancesAutoReloadClick"}],
													btnReloadNodePerformances: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"","hint":"Reload data now.","imageIndex":104,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"40px"}, {"onclick":"btnReloadNodePerformancesClick"}]
												}],
												panel63: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
													labelNodePerformacesUri: ["wm.Label", {"border":"0","padding":"4","showing":false,"width":"100%"}, {}]
												}],
												panel295: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"40px"}, {}, {
													htmlNodePerfDataLoad: ["wm.Html", {"autoSizeWidth":true,"border":"0","height":"100%","width":"80px"}, {}]
												}]
											}],
											panelNodePerfomanceWarning: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px","wm_BackgroundColor_Yellow"]},"border":"1","height":"80px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"10","padding":"5","verticalAlign":"middle","width":"500px"}, {}, {
												pictureNodePerfWarning: ["wm.Picture", {"border":"0","height":"45px","source":"resources/images/icons/dialog-warning-45.png","width":"45px"}, {}],
												labelNodePerformancesWarning: ["wm.Label", {"border":"0","height":"100%","margin":"4","padding":"4","singleLine":false,"width":"100%"}, {}]
											}],
											panelDisplayNodePerformances: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"5,10,5,10","verticalAlign":"top","width":"100%"}, {}, {
												iFrameNodePerformances: ["wm.IFrame", {"border":"0","height":"100%","width":"100%"}, {}]
											}]
										}],
										TabServersLogs: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"Logs","horizontalAlign":"left","padding":"0,10,10,10","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"TabServersLogsShow"}, {
											panel284: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
												panelDataCenterLogs1: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
													panel285: ["wm.MainContentPanel", {"border":"0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"bottom","width":"100%"}, {}, {
														labelHardwareEvents: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold","wm_Mouse_pointer","wm_BorderTopStyle_Curved4px"]},"align":"center","border":"1,1,0,1","borderColor":"#999999","caption":"Hardware events","margin":"0,4,0,4","padding":"4","width":"170px"}, {"onclick":"labelHardwareEventsClick"}],
														labelServerLogs: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_Mouse_pointer","wm_BorderTopStyle_Curved4px"]},"align":"center","border":"1,1,0,1","borderColor":"#999999","caption":"System","margin":"0,4,0,4","padding":"4","width":"130px"}, {"onclick":"labelServerLogsClick"}],
														panel286: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","margin":"0,5,0,0","verticalAlign":"bottom","width":"100%"}, {}]
													}],
													panel287: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px"]},"border":"1","borderColor":"#999999","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
														panel288: ["wm.EmphasizedContentPanel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
															tabNodelogInfos: ["wm.Layers", {"defaultLayer":0,"transition":"slide"}, {}, {
																layerHardwareEvents: ["wm.Layer", {"borderColor":"","caption":"layerNodeManagerLogs","horizontalAlign":"left","margin":"0","padding":"0","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
																	panelHardwareEvents: ["wm.Panel", {"_classes":{"domNode":["#FFCCBC"]},"border":"0","height":"100%","horizontalAlign":"left","margin":"0","minWidth":200,"verticalAlign":"top","width":"100%"}, {}, {
																		panel289: ["wm.Panel", {"border":"0,0,1,0","borderColor":"#b3b8c4","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
																			checkHardwareCriticalEvents: ["wm.Checkbox", {"_classes":{"domNode":["wm_FontColor_BrightRed"]},"caption":"CRITICALS","captionSize":"80px","dataValue":"true","displayValue":"true","startChecked":true,"width":"100px"}, {"onchange":"onNodeHardwareEventsCheckboxChange"}],
																			checkHardwareWarningEvents: ["wm.Checkbox", {"caption":"<font color = 'OrangeRed'>WARNINGS</font>","dataValue":"true","displayValue":"true","startChecked":true}, {"onchange":"onNodeHardwareEventsCheckboxChange"}],
																			checkHardwareNoticeEvents: ["wm.Checkbox", {"_classes":{"domNode":["wm_FontColor_SteelBlue"]},"caption":"<font color = 'DarkSlateBlue '>NOTICES</font>","captionSize":"90px","dataValue":"true","displayValue":"true","startChecked":true,"width":"110px"}, {"onchange":"onNodeHardwareEventsCheckboxChange"}],
																			checkHardwareInfos: ["wm.Checkbox", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"INFOS","captionSize":"80px","dataValue":"true","displayValue":"true","startChecked":true,"width":"100px"}, {"onchange":"onNodeHardwareEventsCheckboxChange"}]
																		}],
																		nodeHardwareLogArea: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_BorderShadow_NoShadow","wm_BackgroundColor_White","wm_BorderBottomStyle_Curved4px"]},"border":"0,1,1,1","borderColor":"#b3b8c4","dataValue":undefined,"displayValue":"","editorBorder":false,"height":"100%","margin":"0,8,8,8","padding":"4","readonly":true,"width":"100%"}, {}]
																	}]
																}],
																layerServerLogs: ["wm.Layer", {"borderColor":"","caption":"layerOpenkviLogs","horizontalAlign":"left","margin":"0","padding":"0","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
																	panelServerLogs: ["wm.Panel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																		clearNodeLogsPanel: ["wm.Panel", {"border":"0,0,1,0","borderColor":"#b3b8c4","height":"32px","horizontalAlign":"left","padding":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
																			reloadNodeLogsBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Reload","imageIndex":98,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"reloadNodeLogsBtnClick"}]
																		}],
																		nodeLogsArea: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_BorderShadow_NoShadow","wm_BackgroundColor_White","wm_BorderBottomStyle_Curved4px"]},"border":"0,1,1,1","borderColor":"#b3b8c4","dataValue":undefined,"displayValue":"","editorBorder":false,"height":"100%","margin":"0,8,8,8","padding":"4","readonly":true,"width":"100%"}, {}]
																	}]
																}]
															}]
														}]
													}]
												}]
											}]
										}],
										TabDashboard: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"DashBoard","horizontalAlign":"left","margin":"1","padding":"5,10,5,10","roles":["dev"],"themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"TabDashboardShow"}, {
											panelDasboard: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
												pictureLoadingBoard: ["wm.Picture", {"border":"0","height":"32px","source":"resources/images/icons/loading/ajax-loader-squares.gif","width":"32px"}, {}],
												htmlNodeDashboard: ["wm.Html", {"border":"0","height":"100%","margin":"10"}, {}]
											}]
										}]
									}]
								}]
							}],
							layerVirtualMachines: ["wm.Layer", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"borderColor":"","caption":"layerVirtualMachines","customGetValidate":"buttonVMsClick","horizontalAlign":"left","margin":"0,0,0,0","padding":"0","verticalAlign":"top"}, {"onShow":"layerVirtualMachinesShow"}, {
								panelVmTabs: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
									panelVmDisabled: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","showing":false,"verticalAlign":"middle","width":"100%"}, {}, {
										picture7: ["wm.Picture", {"border":"0","height":"64px","source":"resources/images/icons/security-medium.png","width":"64px"}, {}],
										labelVmDisabled: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Red","wm_TextDecoration_Bold"]},"border":"0","caption":"This virtual machine has been locked !","height":"50px","padding":"4,4,4,20","width":"320px"}, {}]
									}],
									tabVirtualMachines: ["wm.TabLayers", {"defaultLayer":0,"headerHeight":"30px","margin":"0,0,0,0"}, {"oncanchange":"tabVirtualMachinesCanchange"}, {
										TabVMsOverview: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"Overview","horizontalAlign":"left","layoutKind":"left-to-right","margin":"1","padding":"5,10,5,10","verticalAlign":"top"}, {}, {
											panel227: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
												panelVmOverviewWarning: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved12px","wm_BorderBottomStyle_Curved12px","wm_BackgroundChromeBar_Yellow"]},"border":"1","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"7","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
													pictureVmOverviewWarning: ["wm.Picture", {"border":"0","height":"30px","source":"resources/images/icons/dialog-warning-30.png","width":"30px"}, {}],
													labelVmOverviewWarning: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"border":"0","caption":"This Virtual Machine is locked by a snapshot process.","padding":"4,4,4,7","width":"100%"}, {}]
												}],
												panel3: ["wm.Panel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
													panel172: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"0,0,0,10","verticalAlign":"top","width":"300px"}, {}, {
														spacer31: ["wm.Spacer", {"height":"10px","width":"100%"}, {}],
														panel142: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px","wm_BorderShadow_StrongShadow"]},"borderColor":"#999999","height":"192px","horizontalAlign":"left","margin":"10","padding":"0","verticalAlign":"top","width":"270px"}, {}, {
															panel173: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_SilverBlueTheme_ToolBar","wm_BorderTopStyle_Curved4px"]},"border":"0,0,1,0","borderColor":"#999999","height":"26px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																label1: ["wm.Label", {"border":"0","borderColor":"#999999","caption":"Settings","height":"26px","margin":"0","padding":"0,0,0,5","width":"205px"}, {}]
															}],
															spacer32: ["wm.Spacer", {"height":"5px","width":"100%"}, {}],
															textVmCpu: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_BackgroundColor_VeryLightGray"]},"borderColor":"#cbcbcb","caption":"vCPUs:","captionAlign":"left","captionSize":"95px","dataValue":undefined,"displayValue":"","height":"26px","padding":"2,2,2,20","readonly":true,"width":"100%"}, {}],
															textVmArchi: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_BackgroundColor_VeryLightGray"]},"caption":"Architecture:","captionAlign":"left","captionSize":"95px","dataValue":undefined,"displayValue":"","height":"26px","padding":"2,2,2,20","readonly":true,"width":"100%"}, {}],
															textVmMemory: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_BackgroundColor_VeryLightGray"]},"caption":"Memory:","captionAlign":"left","captionSize":"95px","dataValue":undefined,"displayValue":"","height":"26px","padding":"2,2,2,20","readonly":true,"width":"100%"}, {}],
															textVmMachine: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_BackgroundColor_VeryLightGray"]},"caption":"Machine:","captionAlign":"left","captionSize":"95px","dataValue":undefined,"displayValue":"","height":"26px","padding":"2,2,2,20","readonly":true,"width":"100%"}, {}],
															textVmClock: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_BackgroundColor_VeryLightGray"]},"caption":"Clock:","captionAlign":"left","captionSize":"95px","dataValue":undefined,"displayValue":"","height":"26px","padding":"2,2,2,20","readonly":true,"width":"100%"}, {}]
														}],
														panelVmOperatingSystem: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px","wm_BorderShadow_StrongShadow"]},"borderColor":"#999999","fitToContentHeight":true,"height":"168px","horizontalAlign":"left","margin":"10","padding":"0","verticalAlign":"top","width":"270px"}, {}, {
															panel177: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_SilverBlueTheme_ToolBar","wm_BorderTopStyle_Curved4px"]},"border":"0,0,1,0","borderColor":"#999999","height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
																label56: ["wm.Label", {"border":"0","borderColor":"#999999","caption":"Operating System","height":"26px","margin":"0","padding":"0,0,0,5","width":"180px"}, {}],
																editOsInfos: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"22px","hint":"Edit Operating System information","source":"resources/images/icons/actions/document-edit-16.png","width":"22px"}, {"onclick":"editOsInfosClick"}],
																findOsInfos: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"22px","hint":"Find Operating System information","source":"resources/images/icons/actions/tools-wizard-16.png","width":"22px"}, {"onclick":"findOsInfosClick"}]
															}],
															spacer47: ["wm.Spacer", {"height":"5px","width":"100%"}, {}],
															panelVnetInfos: ["wm.Panel", {"border":"0","height":"110px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																textOsFamily: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Family :","captionAlign":"left","captionSize":"60px","dataValue":"Linux","displayValue":"Linux","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"100%"}, {"onEnterKeyPress":"textOsEnterKeyPress"}],
																textOsArch: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Arch. :","captionAlign":"left","captionSize":"60px","dataValue":"i386","displayValue":"i386","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"100%"}, {"onEnterKeyPress":"textOsEnterKeyPress"}],
																textOsDistro: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Type :","captionAlign":"left","captionSize":"60px","dataValue":"redhat-based","displayValue":"redhat-based","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"120%"}, {"onEnterKeyPress":"textOsEnterKeyPress"}],
																textOsName: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Name :","captionAlign":"left","captionSize":"60px","dataValue":"NetOS 4","displayValue":"NetOS 4","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"120%"}, {"onEnterKeyPress":"textOsEnterKeyPress"}],
																textOsVersion: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Version :","captionAlign":"left","captionSize":"60px","dataValue":"0.0","displayValue":"0.0","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"120%"}, {"onEnterKeyPress":"textOsEnterKeyPress"}]
															}],
															spacer48: ["wm.Spacer", {"height":"5px","width":"96px"}, {}]
														}]
													}],
													panel13: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"300px"}, {}, {
														spacer37: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
														panelVmNetworkSettings: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px","wm_BorderShadow_StrongShadow"]},"borderColor":"#999999","fitToContentHeight":true,"height":"104px","horizontalAlign":"left","margin":"10","padding":"0","verticalAlign":"top","width":"250px"}, {}, {
															panel176: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_SilverBlueTheme_ToolBar","wm_BorderTopStyle_Curved4px"]},"border":"0,0,1,0","borderColor":"#999999","height":"26px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																label54: ["wm.Label", {"border":"0","borderColor":"#999999","caption":"Networking","height":"26px","margin":"0","padding":"0,0,0,5","width":"205px"}, {}]
															}],
															spacer45: ["wm.Spacer", {"height":"5px","width":"100%"}, {}],
															panelVnetInfos0: ["wm.Panel", {"border":"0","height":"46px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																textVnetMac0: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Mac:","captionAlign":"left","captionSize":"40px","dataValue":"Test","displayValue":"Test","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"100%"}, {}],
																panelVnetIp0: ["wm.HeaderContentPanel", {"fitToContentHeight":true,"height":"22px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																	textVnetIp0: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_BackgroundColor_VeryLightGray"]},"caption":"IP:","captionAlign":"left","captionSize":"40px","dataValue":"","displayValue":"","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"100%"}, {"onEnterKeyPress":"textVnetIpEnterKeyPress"}],
																	editVnetIp0: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"22px","hint":"Edit IP","source":"resources/images/icons/actions/document-edit-16.png","width":"22px"}, {"onclick":"onEditVnetClick"}],
																	findVnetIp0: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"22px","hint":"Find IP","source":"resources/images/icons/actions/tools-wizard-16.png","width":"22px"}, {"onclick":"onFindVnetClick"}]
																}]
															}],
															panelVnetInfos1: ["wm.Panel", {"border":"0","height":"46px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
																textVnetMac1: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Mac:","captionAlign":"left","captionSize":"40px","dataValue":"","displayValue":"","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"100%"}, {}],
																panelVnetIp1: ["wm.HeaderContentPanel", {"fitToContentHeight":true,"height":"22px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																	textVnetIp1: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_BackgroundColor_VeryLightGray"]},"caption":"IP:","captionAlign":"left","captionSize":"40px","dataValue":"","displayValue":"","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"100%"}, {"onEnterKeyPress":"textVnetIpEnterKeyPress"}],
																	editVnetIp1: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"22px","hint":"Edit IP","source":"resources/images/icons/actions/document-edit-16.png","width":"22px"}, {"onclick":"onEditVnetClick"}],
																	findVnetIp1: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"22px","hint":"Find IP","source":"resources/images/icons/actions/tools-wizard-16.png","width":"22px"}, {"onclick":"onFindVnetClick"}]
																}]
															}],
															panelVnetInfos2: ["wm.Panel", {"border":"0","height":"46px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
																textVnetMac2: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Mac:","captionAlign":"left","captionSize":"40px","dataValue":"","displayValue":"","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"100%"}, {}],
																panelVnetIp2: ["wm.HeaderContentPanel", {"fitToContentHeight":true,"height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																	textVnetIp2: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_BackgroundColor_VeryLightGray"]},"caption":"IP:","captionAlign":"left","captionSize":"40px","dataValue":"","displayValue":"","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"100%"}, {"onEnterKeyPress":"textVnetIpEnterKeyPress"}],
																	editVnetIp2: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"22px","hint":"Edit IP","source":"resources/images/icons/actions/document-edit-16.png","width":"22px"}, {"onclick":"onEditVnetClick"}],
																	findVnetIp2: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"22px","hint":"Find IP","source":"resources/images/icons/actions/tools-wizard-16.png","width":"22px"}, {"onclick":"onFindVnetClick"}]
																}]
															}],
															panelVnetInfos3: ["wm.Panel", {"border":"0","height":"46px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
																textVnetMac3: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Mac:","captionAlign":"left","captionSize":"40px","dataValue":"","displayValue":"","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"100%"}, {}],
																panelVnetIp3: ["wm.HeaderContentPanel", {"fitToContentHeight":true,"height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																	textVnetIp3: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_BackgroundColor_VeryLightGray"]},"caption":"IP:","captionAlign":"left","captionSize":"40px","dataValue":"","displayValue":"","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"100%"}, {"onEnterKeyPress":"textVnetIpEnterKeyPress"}],
																	editVnetIp3: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"22px","hint":"Edit IP","source":"resources/images/icons/actions/document-edit-16.png","width":"22px"}, {"onclick":"onEditVnetClick"}],
																	findVnetIp3: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"22px","hint":"Find IP","source":"resources/images/icons/actions/tools-wizard-16.png","width":"22px"}, {"onclick":"onFindVnetClick"}]
																}]
															}],
															panelVnetInfos4: ["wm.Panel", {"border":"0","height":"46px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
																textVnetMac4: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Mac:","captionAlign":"left","captionSize":"40px","dataValue":"","displayValue":"","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"100%"}, {}],
																panelVnetIp4: ["wm.HeaderContentPanel", {"fitToContentHeight":true,"height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																	textVnetIp4: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite","wm_BackgroundColor_VeryLightGray"]},"caption":"IP:","captionAlign":"left","captionSize":"40px","dataValue":"","displayValue":"","emptyValue":"emptyString","height":"20px","padding":"1,1,1,20","readonly":true,"width":"100%"}, {"onEnterKeyPress":"textVnetIpEnterKeyPress"}],
																	editVnetIp4: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"22px","hint":"Edit IP","source":"resources/images/icons/actions/document-edit-16.png","width":"22px"}, {"onclick":"onEditVnetClick"}],
																	findVnetIp4: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"22px","hint":"Find IP","source":"resources/images/icons/actions/tools-wizard-16.png","width":"22px"}, {"onclick":"onFindVnetClick"}]
																}]
															}],
															spacer14: ["wm.Spacer", {"height":"5px","width":"96px"}, {}]
														}]
													}],
													panel86: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
														spacer46: ["wm.Spacer", {"height":"15px","width":"96px"}, {}],
														panel85: ["wm.Panel", {"border":"0","height":"280px","horizontalAlign":"left","verticalAlign":"top","width":"280px"}, {}, {
															panel87: ["wm.Panel", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0","height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"15,0,0,20","verticalAlign":"top","width":"100%"}, {}, {
																label55: ["wm.Label", {"border":"0","caption":"Notes","padding":"4","width":"217px"}, {}],
																buttonSaveNotes: ["wm.Button", {"caption":"","height":"26px","hint":"Save notes","imageIndex":15,"imageList":"app.silkIconList","margin":"0","showing":false,"width":"26px"}, {"onclick":"buttonSaveNotesClick"}]
															}],
															richVmNotes: ["wm.RichText", {"_classes":{"domNode":["wm_FontColor_Blue"]},"editorBorder":false,"height":"100%","margin":"5","padding":"0,10,10,15","toolbarAlign":false,"toolbarList":false,"toolbarStyle":false,"toolbarUndo":false}, {"onfocus":"richVmNotesFocus"}]
														}],
														panel92: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px","wm_BorderShadow_StrongShadow","wm_SilverBlueTheme_ToolBar"]},"border":"1","borderColor":"#999999","height":"192px","horizontalAlign":"center","margin":"10","padding":"0","roles":["dev"],"verticalAlign":"top","width":"270px"}, {}, {
															panel134: ["wm.Panel", {"_classes":{"domNode":["wm_SilverBlueTheme_ToolBar","wm_BorderTopStyle_Curved4px"]},"border":"0,0,1,0","borderColor":"#999999","height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
																labelVmScreenshot: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px"]},"border":"0","borderColor":"#999999","caption":"Screenshot","height":"26px","margin":"0","padding":"4","width":"218px"}, {}, {
																	format: ["wm.DataFormatter", {}, {}]
																}],
																pictureVmReloadOverview: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"16px","hint":"Take a screenshot","margin":"0","source":"resources/images/icons/photo.png","width":"24px"}, {"onclick":"pictureVmReloadOverviewClick"}]
															}],
															spacer36: ["wm.Spacer", {"height":"5px","width":"96px"}, {}],
															vmScreenshotpict: ["wm.Picture", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_Mouse_pointer"]},"border":"0","borderColor":"#999999","height":"134px","showing":false,"source":"resources/images/logos/notavailable-240.png","width":"240px"}, {"onclick":"vmScreenshotpictClick"}]
														}]
													}]
												}]
											}]
										}],
										TabVmScreen: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"Screen","horizontalAlign":"left","margin":"1","padding":"5,5,5,5","verticalAlign":"top"}, {"onShow":"TabVmScreenShow"}, {
											panelVmScreen: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
												panel68: ["wm.MainContentPanel", {"border":"0","height":"34px","horizontalAlign":"left","imageList":"app.silkIconList","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
													newVncWindowBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightBlue"]},"caption":"","hint":"Detach screen","imageIndex":76,"imageList":"app.silkIconList","margin":"4","width":"45px"}, {"onclick":"newVncWindowBtnClick"}],
													vncReloadBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightBlue"]},"caption":"","hint":"Reload display","imageIndex":98,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"45px"}, {"onclick":"vncReloadBtnClick"}],
													panel147: ["wm.Panel", {"border":"0,0,0,1","height":"32px","horizontalAlign":"left","margin":"2,0,2,8","verticalAlign":"top","width":"16px"}, {}],
													startVmVncBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"","hint":"Start Virtual Machine","imageIndex":113,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"45px"}, {"onclick":"startVmVncBtnClick"}],
													pauseVmVncBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"","hint":"Pause Virtual Machine","imageIndex":114,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"45px"}, {"onclick":"labelVmPauseClick"}],
													stopVmVncBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"","hint":"Shutdown Virtual Machine","imageIndex":115,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"45px"}, {"onclick":"stopVmVncBtnClick"}],
													panel148: ["wm.Panel", {"border":"0,0,0,1","height":"32px","horizontalAlign":"left","margin":"2,0,2,8","verticalAlign":"top","width":"16px"}, {}],
													killVmVncBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"","hint":"Stop Virtual Machine","imageIndex":40,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"45px"}, {"onclick":"killVmVncBtnClick"}]
												}],
												panel146: ["wm.Panel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
													iFrameVnc: ["wm.IFrame", {"_classes":{"domNode":["wm_BackgroundColor_Black"]},"border":"0","height":"100%","padding":"0","source":"resources/novnc/vnc_auto.html","width":"100%"}, {"onMouseOver":"iFrameVncMouseOver"}]
												}]
											}],
											textWebsocket: ["wm.Text", {"caption":"VNC websocket:","captionSize":"110px","dataValue":undefined,"disabled":true,"displayValue":"","readonly":true,"showing":false,"width":"100%"}, {"onEnterKeyPress":"textWebsocketEnterKeyPress"}]
										}],
										TabVMsConfig: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"Configuration","horizontalAlign":"left","margin":"1","padding":"5,10,5,10","roles":["dev","Administrator","PowerUser"],"verticalAlign":"top"}, {"onDeactivate":"TabVMsConfigDeactivate","onShow":"TabVMsConfigShow"}, {
											panelApplyConfigHelp: ["wm.Panel", {"border":"0","height":"62px","horizontalAlign":"left","padding":"5,0,0,10","verticalAlign":"top","width":"650px"}, {}, {
												panelAnnimConfigHelp: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px","wm_BackgroundColor_Graphite","wm_BorderShadow_StrongShadow"]},"border":"1","borderColor":"#3d46ff","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"550px"}, {}, {
													picVmConfigHelp: ["wm.Picture", {"border":"0","height":"32px","source":"resources/images/icons/help-about.png","width":"32px"}, {"onclick":"hidePanelApplyConfigHelp"}],
													panel230: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px"]},"border":"0","height":"100%","horizontalAlign":"left","padding":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
														label72: ["wm.Label", {"border":"0","caption":"<b>Some hardware modifications cannot be applied on a live system.</b>","padding":"4","width":"95%"}, {"onclick":"hidePanelApplyConfigHelp"}],
														label73: ["wm.Label", {"border":"0","caption":"<small>You have to stop and start your Virtual Machine to effectively commit changes within the OS.</small>","padding":"0,0,5,5","width":"95%"}, {"onclick":"hidePanelApplyConfigHelp"}]
													}]
												}]
											}],
											panelVmConfiguration: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
												panel70: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px"]},"border":"1","borderColor":"#b3b8c4","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"10,0,10,10","verticalAlign":"top","width":"100%"}, {}, {
													panelVmConfig: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px","wm_BackgroundColor_White"]},"autoScroll":true,"border":"0,1,0,0","borderColor":"#b3b8c4","height":"100%","horizontalAlign":"left","margin":"0","padding":"10,0,0,0","verticalAlign":"top","width":"200px"}, {}, {
														panelVmStorages: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
															pictureStorage: ["wm.Picture", {"border":"0","height":"28px","source":"resources/images/icons/hardware/drive-harddisk.png","width":"28px"}, {}],
															labelVmStorages: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Storage Devices","margin":"0,0,0,5","padding":"4","width":"100%"}, {"onclick":"onVmConfigLayerClick"}, {
																format: ["wm.DataFormatter", {}, {}]
															}]
														}],
														panelVmNetworks: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
															pictureNetwork: ["wm.Picture", {"border":"0","height":"28px","source":"resources/images/icons/hardware/network.png","width":"28px"}, {}],
															labelVmNetworks: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Networking","margin":"0,0,0,5","padding":"4","width":"100%"}, {"onclick":"onVmConfigLayerClick"}, {
																format: ["wm.DataFormatter", {}, {}]
															}]
														}],
														panel21: ["wm.Panel", {"border":"1,0,0,0","height":"14px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"7,0,0,0","verticalAlign":"top","width":"100%"}, {}],
														panelVmProcessor: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
															pictureProcessor: ["wm.Picture", {"border":"0","height":"28px","source":"resources/images/icons/hardware/cpu.png","width":"28px"}, {}],
															labelVmProcessor: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Processor","margin":"0,0,0,5","padding":"4","width":"100%"}, {"onclick":"onVmConfigLayerClick"}, {
																format: ["wm.DataFormatter", {}, {}]
															}]
														}],
														panelVmMemory: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
															pictureMemory: ["wm.Picture", {"border":"0","height":"20px","source":"resources/images/icons/hardware/memory.png","width":"28px"}, {}],
															labelVmMemory: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Memory","margin":"0,0,0,5","padding":"4","width":"100%"}, {"onclick":"onVmConfigLayerClick"}, {
																format: ["wm.DataFormatter", {}, {}]
															}]
														}],
														panelVmBios: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
															pictureBoot: ["wm.Picture", {"border":"0","height":"28px","source":"resources/images/icons/hardware/bios.png","width":"28px"}, {}],
															labelVmBios: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Bios settings","margin":"0,0,0,5","padding":"4","width":"100%"}, {"onclick":"onVmConfigLayerClick"}, {
																format: ["wm.DataFormatter", {}, {}]
															}]
														}],
														panel259: ["wm.Panel", {"border":"1,0,0,0","height":"14px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"7,0,0,0","verticalAlign":"top","width":"100%"}, {}],
														panelVmVideo: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
															pictureVideo: ["wm.Picture", {"border":"0","height":"28px","source":"resources/images/icons/hardware/display.png","width":"28px"}, {}],
															labelVmVideo: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Video","margin":"0,0,0,5","padding":"4","width":"100%"}, {"onclick":"onVmConfigLayerClick"}, {
																format: ["wm.DataFormatter", {}, {}]
															}]
														}],
														panelVmInputs: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
															pictureInputs: ["wm.Picture", {"border":"0","height":"28px","source":"resources/images/icons/hardware/input-mouse.png","width":"28px"}, {}],
															labelVmInputs: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Inputs","margin":"0,0,0,5","padding":"4","width":"100%"}, {"onclick":"onVmConfigLayerClick"}, {
																format: ["wm.DataFormatter", {}, {}]
															}]
														}],
														panelVmTerminals: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
															pictureTerminal: ["wm.Picture", {"border":"0","height":"28px","source":"resources/images/icons/hardware/terminal.png","width":"28px"}, {}],
															labelVmTerminals: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Terminals","margin":"0,0,0,5","padding":"4","width":"100%"}, {"onclick":"onVmConfigLayerClick"}, {
																format: ["wm.DataFormatter", {}, {}]
															}]
														}],
														panelVmSerials: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
															pictureSerials: ["wm.Picture", {"border":"0","height":"28px","source":"resources/images/icons/hardware/serials.png","width":"28px"}, {}],
															labelVmSerials: ["wm.Label", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","caption":"Serials","margin":"0,0,0,5","padding":"4","width":"100%"}, {"onclick":"onVmConfigLayerClick"}, {
																format: ["wm.DataFormatter", {}, {}]
															}]
														}]
													}],
													panel57: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px"]},"border":"0","borderColor":"#b3b8c4","height":"100%","horizontalAlign":"left","margin":"0","padding":"2","verticalAlign":"top","width":"100%"}, {}, {
														layersVmConfig: ["wm.Layers", {"margin":"5"}, {}, {
															layerVmStorages: ["wm.Layer", {"borderColor":"","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}, {
																labelStorages: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextDecoration_Bold","wm_FontColor_Black"]},"border":"0","caption":"Storage Devices:","padding":"4"}, {}, {
																	format: ["wm.DataFormatter", {}, {}]
																}],
																panel107: ["wm.Panel", {"autoScroll":true,"border":"1,0,0,0","height":"100%","horizontalAlign":"left","padding":"15","verticalAlign":"top","width":"100%"}, {}, {
																	panel67: ["wm.HeaderContentPanel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","minHeight":140,"verticalAlign":"top","width":"100%"}, {}, {
																		gridVmDisks: ["wm.DojoGrid", {"columns":[{"show":true,"id":"icon","title":"<image style=\"height: 12px;\" src=\"resources/images/icons/documentinfo-12.png\"/>","width":"45px","displayType":"Text","noDelete":true,"align":"center","formatFunc":""},{"show":true,"id":"type","title":"Type","width":"40px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"name","title":"Name","width":"100px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"format","title":"Format","width":"60px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"used","title":"Used","width":"60px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"size","title":"Size","width":"60px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"device","title":"Bus","width":"50px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"cache","title":"Cache","width":"50px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"path","title":"Path","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"bus","title":"Bus","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"busType","title":"BusType","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","margin":"0","minHeight":150,"minWidth":650}, {"onCellDblClick":"updateVmStorageBtnClick","onClick":"gridVmDisksClick"}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"varVmDiskList","targetProperty":"dataSet"}, {}]
																			}]
																		}]
																	}],
																	panel17: ["wm.MainContentPanel", {"border":"0","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																		newVmStorageBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" New","hint":"Create or add a new disk","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"newVmStorageBtnClick"}],
																		updateVmStorageBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Edit","hint":"Update disk information","imageIndex":80,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"updateVmStorageBtnClick"}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"gridVmDisks.emptySelection","targetProperty":"disabled"}, {}]
																			}]
																		}],
																		panel264: ["wm.Panel", {"border":"0,0,0,1","height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"5,0,0,10","padding":"0","verticalAlign":"top","width":"20px"}, {}],
																		eraseVmStorageBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Erase","hint":"Erase all data and partitions on disk","imageIndex":62,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"eraseVmStorageBtnClick"}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"gridVmDisks.emptySelection","targetProperty":"disabled"}, {}]
																			}]
																		}],
																		removeVmStorageBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Detach","hint":"Detach device from Virtual Machine","imageIndex":106,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"removeVmStorageBtnClick"}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"gridVmDisks.emptySelection","targetProperty":"disabled"}, {}]
																			}]
																		}],
																		panel253: ["wm.Panel", {"border":"0,0,0,1","height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"5,0,0,10","padding":"0","verticalAlign":"top","width":"20px"}, {}],
																		deleteVmStorageBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Delete","hint":"Delete from hard drive","imageIndex":108,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"deleteVmStorageBtnClick"}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"gridVmDisks.emptySelection","targetProperty":"disabled"}, {}]
																			}]
																		}]
																	}]
																}]
															}],
															layerVmNetworks: ["wm.Layer", {"borderColor":"","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}, {
																labelNet: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextDecoration_Bold","wm_FontColor_Black"]},"border":"0","caption":"Network interfaces:","padding":"4"}, {}, {
																	format: ["wm.DataFormatter", {}, {}]
																}],
																panel109: ["wm.Panel", {"autoScroll":true,"border":"1,0,0,0","height":"100%","horizontalAlign":"left","padding":"15","verticalAlign":"top","width":"100%"}, {}, {
																	panel110: ["wm.HeaderContentPanel", {"autoScroll":true,"fitToContentWidth":true,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"700px"}, {}, {
																		gridVmNetworks: ["wm.DojoGrid", {"columns":[{"show":true,"id":"status","title":"<image style=\"height: 12px;\" src=\"resources/images/icons/documentinfo-12.png\"/>","width":"40px","displayType":"Text","noDelete":true,"align":"center","formatFunc":"gridVmNetworksStatusFormat"},{"show":true,"id":"type","title":"Type","width":"80px","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","fieldType":""},{"show":true,"id":"source","title":"Virtual Network","width":"90px","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","fieldType":""},{"show":true,"id":"portgroup","title":"Portgroup","width":"90px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"model","title":"Virtual Adapter","width":"90px","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","fieldType":""},{"show":true,"id":"mac","title":"MAC Address","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","fieldType":"dojox.grid.cells._Widget"},{"show":false,"id":"option","title":"opts","width":"65px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"connected","title":"Enabled on boot","width":"60px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"link","title":"Link up","width":"30px","displayType":"Text","noDelete":true,"align":"center","formatFunc":"","fieldType":"dojox.grid.cells.Bool"}],"height":"100%","margin":"0","minHeight":150,"singleClickEdit":true,"width":"700px"}, {"onCellDblClick":"gridVmNetworksCellDblClick","onCellEdited":"gridVmNetworksCellEdited"}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"varNetworkInput","targetProperty":"dataSet"}, {}]
																			}]
																		}]
																	}],
																	panel156: ["wm.MainContentPanel", {"border":"0","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																		newVmNetworkBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" New","hint":"Add a network device","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"newVmNetworkBtnClick"}],
																		updateVmNetworkBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Edit","hint":"Update device information","imageIndex":80,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"updateVmNetworkBtnClick"}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"gridVmNetworks.emptySelection","targetProperty":"disabled"}, {}]
																			}]
																		}],
																		panel252: ["wm.Panel", {"border":"0,0,0,1","height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"5,0,0,10","padding":"0","verticalAlign":"top","width":"20px"}, {}],
																		removeVmNetworkBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Remove","hint":"Remove from inventory","iconMargin":"0 0 0 4px","imageIndex":108,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"removeVmNetworkBtnClick"}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"gridVmNetworks.emptySelection","targetProperty":"disabled"}, {}]
																			}]
																		}]
																	}]
																}]
															}],
															layerVmProcessor: ["wm.Layer", {"borderColor":"","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}, {
																label31: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextDecoration_Bold","wm_FontColor_Black"]},"border":"0","borderColor":"#cdd5ef","caption":"Processor:","padding":"4","width":"100%"}, {}, {
																	format: ["wm.DataFormatter", {}, {}]
																}],
																panel73: ["wm.Panel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
																	panel179: ["wm.Panel", {"border":"1,0,0,0","height":"170px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																		panel180: ["wm.Panel", {"border":"0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
																			helpCpuAllocBtn: ["wm.Button", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"caption":"","height":"26px","hint":"Show help on CPU allocation","iconMargin":"0","imageIndex":56,"imageList":"app.silkIconList","margin":"2","width":"26px"}, {"onclick":"onHelpClick"}],
																			label57: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold"]},"border":"0","caption":"Allocation","padding":"4","width":"130px"}, {}, {
																				format: ["wm.DataFormatter", {}, {}]
																			}]
																		}],
																		panel74: ["wm.Panel", {"border":"0","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2,2,2,20","verticalAlign":"top","width":"95%"}, {}, {
																			label32: ["wm.Label", {"border":"0","caption":"Current Allocation:","padding":"4","width":"130px"}, {}, {
																				format: ["wm.DataFormatter", {}, {}]
																			}],
																			labelVmCurrentCpu: ["wm.Label", {"border":"0","caption":"0","padding":"4","width":"70px"}, {}, {
																				format: ["wm.DataFormatter", {}, {}]
																			}]
																		}],
																		panel153: ["wm.Panel", {"border":"0","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2,2,2,20","verticalAlign":"top","width":"95%"}, {}, {
																			label44: ["wm.Label", {"border":"0","caption":"Architecture:","padding":"4","width":"130px"}, {}, {
																				format: ["wm.DataFormatter", {}, {}]
																			}],
																			labelVmCurrentArch: ["wm.Label", {"border":"0","caption":"","padding":"4","width":"70px"}, {}, {
																				format: ["wm.DataFormatter", {}, {}]
																			}]
																		}],
																		panel75: ["wm.Panel", {"border":"0","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2,2,2,20","verticalAlign":"middle","width":"95%"}, {}, {
																			label33: ["wm.Label", {"border":"0","caption":"New Allocation:","padding":"4","width":"130px"}, {}, {
																				format: ["wm.DataFormatter", {}, {}]
																			}],
																			numVmNewCpu: ["wm.Number", {"captionSize":"0px","changeOnKey":true,"displayValue":"","maximum":256,"minimum":1,"places":"0","spinnerButtons":true,"width":"70px"}, {"onchange":"numVmNewCpuChange"}]
																		}],
																		panel76: ["wm.Panel", {"border":"0","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2,2,2,20","verticalAlign":"middle","width":"95%"}, {}, {
																			textVmHostCpu: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Cores on Host:","captionAlign":"left","captionSize":"130px","dataValue":undefined,"displayValue":"","padding":"4","readonly":true,"width":"100%"}, {}]
																		}]
																	}],
																	panel204: ["wm.Panel", {"border":"1,0,0,0","height":"210px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																		panel205: ["wm.Panel", {"border":"0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
																			helpClockOptionsBtn: ["wm.Button", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"caption":"","height":"26px","hint":"Show help on CPU advanced options","iconMargin":"0","imageIndex":56,"imageList":"app.silkIconList","margin":"2","width":"26px"}, {"onclick":"onHelpClick"}],
																			label62: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold"]},"border":"0","caption":"Time source","padding":"4","width":"130px"}, {}, {
																				format: ["wm.DataFormatter", {}, {}]
																			}]
																		}],
																		panel206: ["wm.Panel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2,2,2,20","verticalAlign":"top","width":"100%"}, {}, {
																			selectClockOffset: ["wm.SelectMenu", {"caption":"Clock offset:","captionAlign":"left","captionSize":"80px","dataField":"dataValue","displayField":"name","displayValue":"","padding":"2,2,2,6","width":"230px"}, {"onchange":"selectClockOffsetChange"}, {
																				binding: ["wm.Binding", {}, {}, {
																					wire: ["wm.Wire", {"expression":undefined,"source":"varClockOffset","targetProperty":"dataSet"}, {}]
																				}]
																			}],
																			selectTimeZone: ["wm.SelectMenu", {"caption":"Timezone:","captionSize":"80px","dataField":"dataValue","displayField":"dataValue","displayValue":"","padding":"2,2,2,6","width":"280px"}, {"onchange":"selectTimeZoneChange"}, {
																				binding: ["wm.Binding", {}, {}, {
																					wire: ["wm.Wire", {"expression":undefined,"source":"varTimezones","targetProperty":"dataSet"}, {}]
																				}]
																			}]
																		}],
																		labelTimers: ["wm.Label", {"border":"0","caption":"Timers:","padding":"4,4,4,28"}, {}],
																		panel208: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																			panel207: ["wm.HeaderContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,5,20,30","verticalAlign":"top","width":"490px"}, {}, {
																				gridVmTimerList: ["wm.DojoGrid", {"columns":[{"show":true,"id":"name","title":"Name","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"tickpolicy","title":"Tickpolicy","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"track","title":"Track","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"present","title":"Present","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"frequency","title":"Frequency","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"mode","title":"Mode","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"status","title":"Status","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","margin":"4"}, {}, {
																					binding: ["wm.Binding", {}, {}, {
																						wire: ["wm.Wire", {"expression":undefined,"source":"varVmTimers","targetProperty":"dataSet"}, {}]
																					}]
																				}]
																			}],
																			panel209: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"105px"}, {}, {
																				btnAddVmTimer: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" New","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnAddVmTimerClick"}],
																				btnUpdateVmTimer: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Edit","imageIndex":80,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnUpdateVmTimerClick"}, {
																					binding: ["wm.Binding", {}, {}, {
																						wire: ["wm.Wire", {"expression":undefined,"source":"gridVmTimerList.emptySelection","targetProperty":"disabled"}, {}]
																					}]
																				}],
																				btnRemoveVmTimer: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Remove","imageIndex":108,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"btnRemoveVmTimerClick"}, {
																					binding: ["wm.Binding", {}, {}, {
																						wire: ["wm.Wire", {"expression":undefined,"source":"gridVmTimerList.emptySelection","targetProperty":"disabled"}, {}]
																					}]
																				}]
																			}]
																		}]
																	}],
																	panel181: ["wm.Panel", {"border":"1,0,0,0","height":"150px","horizontalAlign":"left","roles":["dev","Administrator","PowerUser"],"verticalAlign":"top","width":"100%"}, {}, {
																		panel182: ["wm.Panel", {"border":"0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
																			helpCpuAdvancedBtn: ["wm.Button", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"caption":"","height":"26px","hint":"Show help on CPU advanced options","iconMargin":"0","imageIndex":56,"imageList":"app.silkIconList","margin":"2","width":"26px"}, {"onclick":"onHelpClick"}],
																			label58: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold"]},"border":"0","caption":"Advanced","padding":"4","width":"130px"}, {}, {
																				format: ["wm.DataFormatter", {}, {}]
																			}]
																		}],
																		panel183: ["wm.Panel", {"border":"0","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"2,2,2,20","roles":["dev","Administrator","PowerUser"],"verticalAlign":"top","width":"100%"}, {}, {
																			selectCpuModel: ["wm.SelectMenu", {"caption":"Model:","captionAlign":"left","captionSize":"60px","dataField":"dataValue","displayField":"name","displayValue":"","emptyValue":"emptyString","padding":"2,2,2,4","width":"220px"}, {"onchange":"selectCpuModelChange"}, {
																				binding: ["wm.Binding", {}, {}, {
																					wire: ["wm.Wire", {"expression":undefined,"source":"varCpuModels","targetProperty":"dataSet"}, {}]
																				}]
																			}]
																		}]
																	}]
																}]
															}],
															layerVmMemory: ["wm.Layer", {"borderColor":"","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}, {
																label35: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextDecoration_Bold","wm_FontColor_Black"]},"border":"0","borderColor":"#cdd5ef","caption":"Memory:","padding":"4","width":"100%"}, {}, {
																	format: ["wm.DataFormatter", {}, {}]
																}],
																panel94: ["wm.Panel", {"border":"1,0,0,0","height":"100%","horizontalAlign":"left","padding":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
																	panel95: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"95%"}, {}, {
																		label36: ["wm.Label", {"border":"0","caption":"Current Allocation:","padding":"4","width":"130px"}, {}, {
																			format: ["wm.DataFormatter", {}, {}]
																		}],
																		labelVmCurrentMem: ["wm.Label", {"border":"0","caption":"0","padding":"4","width":"70px"}, {}, {
																			format: ["wm.DataFormatter", {}, {}]
																		}]
																	}],
																	panel96: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"95%"}, {}, {
																		label37: ["wm.Label", {"border":"0","caption":"New Allocation:","padding":"4","width":"130px"}, {}, {
																			format: ["wm.DataFormatter", {}, {}]
																		}],
																		numVmNewMem: ["wm.Number", {"captionSize":"40px","changeOnKey":true,"displayValue":"","emptyValue":"zero","maximum":102400,"minimum":128,"spinnerButtons":true,"width":"70px"}, {"onchange":"onINputFiledChange"}]
																	}],
																	panel97: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"95%"}, {}, {
																		textVmHostMem: ["wm.Text", {"_classes":{"domNode":["wm_FontColor_Graphite"]},"caption":"Memory on Host:","captionAlign":"left","captionSize":"130px","dataValue":undefined,"displayValue":"","padding":"4","readonly":true}, {}]
																	}]
																}]
															}],
															layerVmBios: ["wm.Layer", {"borderColor":"","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}, {
																BIOSsettings: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextDecoration_Bold","wm_FontColor_Black"]},"border":"0","borderColor":"#cdd5ef","caption":"BIOS Settings:","padding":"4","width":"100%"}, {}, {
																	format: ["wm.DataFormatter", {}, {}]
																}],
																panel108: ["wm.Panel", {"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																	panel171: ["wm.Panel", {"border":"1,0,0,0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
																		helpBootOptionsBtn: ["wm.Button", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"caption":"","height":"26px","hint":"Show help on Booting options","iconMargin":"0","imageIndex":56,"imageList":"app.silkIconList","margin":"2","width":"26px"}, {"onclick":"onHelpClick"}],
																		label51: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold"]},"border":"0","caption":"Booting options","padding":"4","width":"130px"}, {}, {
																			format: ["wm.DataFormatter", {}, {}]
																		}]
																	}],
																	panel98: ["wm.Panel", {"border":"0","height":"120px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"95%"}, {}, {
																		label38: ["wm.Label", {"border":"0","caption":"Boot devices:","padding":"2,2,2,20","width":"130px"}, {}, {
																			format: ["wm.DataFormatter", {}, {}]
																		}],
																		panel101: ["wm.HeaderContentPanel", {"fitToContentHeight":true,"fitToContentWidth":true,"height":"97px","horizontalAlign":"left","verticalAlign":"top","width":"200px"}, {}, {
																			gridBootList: ["wm.DojoGrid", {"columns":[{"show":true,"id":"name","title":"Device","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"checked","title":"Boot","width":"40px","displayType":"Text","noDelete":true,"align":"center","formatFunc":"","fieldType":"dojox.grid.cells.Bool"}],"height":"97px","margin":"4","width":"200px"}, {"onCellEdited":"onInputGridCellEdited"}, {
																				binding: ["wm.Binding", {}, {}, {
																					wire: ["wm.Wire", {"expression":undefined,"source":"varBootList","targetProperty":"dataSet"}, {}]
																				}]
																			}]
																		}],
																		panelBootListMove: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"middle","width":"40px"}, {}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"gridBootList.emptySelection","targetProperty":"disabled"}, {}]
																			}],
																			bootUpBtn: ["wm.Button", {"caption":"","imageIndex":7,"imageList":"app.silkIconList","margin":"4","width":"30px"}, {"onclick":"bootUpBtnClick"}],
																			bootDownBtn: ["wm.Button", {"caption":"","imageIndex":2,"imageList":"app.silkIconList","margin":"4","width":"30px"}, {"onclick":"bootDownBtnClick"}]
																		}]
																	}],
																	panel99: ["wm.Panel", {"border":"0","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"95%"}, {}, {
																		showMenuBox: ["wm.Checkbox", {"caption":"Show boot menu:","captionAlign":"left","captionSize":"115px","dataValue":"","displayValue":"","padding":"2,2,2,20","width":"200px"}, {"onchange":"onINputFiledChange"}]
																	}],
																	panel106: ["wm.Panel", {"border":"1,0,0,0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
																		helpHardOptionsBtn: ["wm.Button", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"caption":"","height":"26px","hint":"Show help on Hardware options","iconMargin":"0","imageIndex":56,"imageList":"app.silkIconList","margin":"2","width":"26px"}, {"onclick":"onHelpClick"}],
																		label41: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold"]},"border":"0","caption":"Hardware options","padding":"4","width":"130px"}, {}, {
																			format: ["wm.DataFormatter", {}, {}]
																		}]
																	}],
																	panel100: ["wm.MainContentPanel", {"border":"0","height":"125px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"95%"}, {}, {
																		label39: ["wm.Label", {"border":"0","caption":"Features:","padding":"2,2,2,20","width":"130px"}, {}, {
																			format: ["wm.DataFormatter", {}, {}]
																		}],
																		panel199: ["wm.HeaderContentPanel", {"fitToContentHeight":true,"fitToContentWidth":true,"height":"115px","horizontalAlign":"left","verticalAlign":"top","width":"200px"}, {}, {
																			gridFeatureList: ["wm.DojoGrid", {"columns":[{"show":true,"id":"name","title":"Name","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"checked","title":"Used","width":"40px","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","fieldType":"dojox.grid.cells.Bool"}],"height":"115px","margin":"4","width":"200px"}, {"onCellEdited":"onInputGridCellEdited"}, {
																				binding: ["wm.Binding", {}, {}, {
																					wire: ["wm.Wire", {"expression":undefined,"source":"varFeatureList","targetProperty":"dataSet"}, {}]
																				}]
																			}]
																		}]
																	}],
																	panel104: ["wm.Panel", {"border":"1,0,0,0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
																		helpLifecycleBtn: ["wm.Button", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px","wm_BorderTopStyle_Curved4px"]},"caption":"","height":"26px","hint":"Show help on Lifecycle control","iconMargin":"0","imageIndex":56,"imageList":"app.silkIconList","margin":"2","width":"26px"}, {"onclick":"onHelpClick"}],
																		label40: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold"]},"border":"0","caption":"Lifecycle control","padding":"4","width":"130px"}, {}, {
																			format: ["wm.DataFormatter", {}, {}]
																		}]
																	}],
																	panel103: ["wm.Panel", {"border":"0","height":"90px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"95%"}, {}, {
																		panel105: ["wm.Panel", {"border":"0","height":"90px","horizontalAlign":"left","verticalAlign":"top","width":"270px"}, {}, {
																			selectOnPoweroff: ["wm.SelectMenu", {"caption":"On Poweroff:","captionAlign":"left","captionSize":"110px","dataField":"dataValue","displayField":"dataValue","displayValue":"","emptyValue":"destroy","padding":"4,4,4,20","required":true,"width":"250px"}, {"onchange":"onINputFiledChange"}, {
																				binding: ["wm.Binding", {}, {}, {
																					wire: ["wm.Wire", {"expression":undefined,"source":"varLifecycle","targetProperty":"dataSet"}, {}]
																				}]
																			}],
																			selectOnCrash: ["wm.SelectMenu", {"caption":"On Crash:","captionAlign":"left","captionSize":"110px","dataField":"dataValue","displayField":"dataValue","displayValue":"","emptyValue":"destroy","padding":"4,4,4,20","required":true,"width":"250px"}, {"onchange":"onINputFiledChange"}, {
																				binding: ["wm.Binding", {}, {}, {
																					wire: ["wm.Wire", {"expression":undefined,"source":"varLifecycleCrash","targetProperty":"dataSet"}, {}]
																				}]
																			}],
																			selectOnReboot: ["wm.SelectMenu", {"caption":"On Reboot:","captionAlign":"left","captionSize":"110px","dataField":"dataValue","displayField":"dataValue","displayValue":"","emptyValue":"restart","padding":"4,4,4,20","required":true,"width":"250px"}, {"onchange":"onINputFiledChange"}, {
																				binding: ["wm.Binding", {}, {}, {
																					wire: ["wm.Wire", {"expression":undefined,"source":"varLifecycle","targetProperty":"dataSet"}, {}]
																				}]
																			}]
																		}]
																	}]
																}]
															}],
															layerVmVideo: ["wm.Layer", {"borderColor":"","caption":"Video","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}, {
																labelNet1: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextDecoration_Bold","wm_FontColor_Black"]},"border":"0","borderColor":"#cdd5ef","caption":"Video settings:","padding":"4","width":"100%"}, {}, {
																	format: ["wm.DataFormatter", {}, {}]
																}],
																panel115: ["wm.Panel", {"autoScroll":true,"border":"1,0,0,0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																	spacer17: ["wm.Spacer", {"height":"10px","width":"100%"}, {}],
																	panel111: ["wm.Panel", {"border":"0","height":"106px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
																		panel112: ["wm.Panel", {"border":"0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
																			helpVideoCardBtn: ["wm.Button", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"caption":"","height":"26px","hint":"Show help about Video Cards","imageIndex":56,"imageList":"app.silkIconList","margin":"2","width":"26px"}, {"onclick":"onHelpClick"}],
																			label34: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold"]},"border":"0","caption":"Video card","padding":"0,0,0,5"}, {}, {
																				format: ["wm.DataFormatter", {}, {}]
																			}]
																		}],
																		selectVideoModel: ["wm.SelectMenu", {"caption":"Model type :","captionAlign":"left","dataField":"dataValue","displayField":"dataValue","displayValue":"","height":"26px","padding":"4,4,4,33","width":"240px"}, {"onchange":"selectVideoModelChange"}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"varVideoCards","targetProperty":"dataSet"}, {}]
																			}]
																		}],
																		headNumber: ["wm.Number", {"caption":"Heads :","captionAlign":"left","displayValue":"","height":"26px","maximum":10,"minimum":1,"padding":"4,4,4,33","spinnerButtons":true,"width":"200px"}, {}],
																		vramNumber: ["wm.Number", {"caption":"vram :","captionAlign":"left","displayValue":"","height":"26px","maximum":204800,"minimum":256,"padding":"4,4,4,33","spinnerButtons":true,"width":"200px"}, {"onchange":"vramNumberChange"}]
																	}],
																	spacer18: ["wm.Spacer", {"height":"10px","width":"100%"}, {}],
																	panel114: ["wm.Panel", {"border":"0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
																		helpGraphicsBtn: ["wm.Button", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px"]},"caption":"","height":"26px","hint":"Show help about Video outputs","imageIndex":56,"imageList":"app.silkIconList","margin":"2","width":"26px"}, {"onclick":"onHelpClick"}],
																		label42: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black","wm_TextDecoration_Bold"]},"border":"0","caption":"Graphics","padding":"0,0,0,5"}, {}, {
																			format: ["wm.DataFormatter", {}, {}]
																		}]
																	}],
																	panel202: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"15","verticalAlign":"top","width":"100%"}, {}, {
																		panel116: ["wm.HeaderContentPanel", {"fitToContentWidth":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","minHeight":100,"verticalAlign":"top","width":"400px"}, {}, {
																			gridGraphics: ["wm.DojoGrid", {"columns":[{"show":true,"id":"icon","title":"<image style=\"height: 12px;\" src=\"resources/images/icons/documentinfo-12.png\"/>","width":"40px","displayType":"Text","noDelete":true,"align":"center","formatFunc":""},{"show":true,"id":"type","title":"Type","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"keymap","title":"Keymap","width":"70px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"listen","title":"Listen","width":"90px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"port","title":"Port","width":"50px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"autoport","title":"Autoport","width":"55px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","margin":"0","minHeight":80,"width":"400px"}, {}, {
																				binding: ["wm.Binding", {}, {}, {
																					wire: ["wm.Wire", {"expression":undefined,"source":"varGraphicList","targetProperty":"dataSet"}, {}]
																				}]
																			}]
																		}],
																		panel174: ["wm.MainContentPanel", {"border":"0","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																			newVmGraphicBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" New","hint":"Add a network device","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"newVmGraphicBtnClick"}],
																			updateVmGraphicBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Edit","hint":"Update device information","imageIndex":80,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"updateVmGraphicBtnClick"}, {
																				binding: ["wm.Binding", {}, {}, {
																					wire: ["wm.Wire", {"expression":undefined,"source":"gridGraphics.emptySelection","targetProperty":"disabled"}, {}]
																				}]
																			}],
																			panel251: ["wm.Panel", {"border":"0,0,0,1","height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"5,0,0,10","padding":"0","verticalAlign":"top","width":"20px"}, {}],
																			removeVmGraphicBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Remove","hint":"Remove from inventory","imageIndex":108,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"removeVmGraphicBtnClick"}, {
																				binding: ["wm.Binding", {}, {}, {
																					wire: ["wm.Wire", {"expression":undefined,"source":"gridGraphics.emptySelection","targetProperty":"disabled"}, {}]
																				}]
																			}]
																		}]
																	}]
																}]
															}],
															layerVmInputs: ["wm.Layer", {"borderColor":"","caption":"Mouse","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}, {
																labelInputs: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextDecoration_Bold","wm_FontColor_Black"]},"border":"0","caption":"Inputs:","padding":"4"}, {}, {
																	format: ["wm.DataFormatter", {}, {}]
																}],
																panel117: ["wm.Panel", {"autoScroll":true,"border":"1,0,0,0","height":"100%","horizontalAlign":"left","padding":"15","verticalAlign":"top","width":"100%"}, {}, {
																	panel118: ["wm.HeaderContentPanel", {"fitToContentHeight":true,"fitToContentWidth":true,"height":"150px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,5","verticalAlign":"top","width":"205px"}, {}, {
																		gridVmInputs: ["wm.DojoGrid", {"columns":[{"show":true,"id":"icon","title":"<image style=\"height: 12px;\" src=\"resources/images/icons/documentinfo-12.png\"/>","width":"40px","displayType":"Text","noDelete":true,"align":"center","formatFunc":""},{"show":true,"id":"type","title":"Type","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"bus","title":"Bus","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","margin":"0","minHeight":150,"minWidth":200}, {}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"varVmInputList","targetProperty":"dataSet"}, {}]
																			}]
																		}]
																	}],
																	panel43: ["wm.MainContentPanel", {"border":"0","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
																		newVmInputBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" New","hint":"Add an input device","imageIndex":1,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"newVmInputBtnClick"}],
																		updateVmInputBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Edit","hint":"Update input device information","imageIndex":80,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"updateVmInputBtnClick"}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"gridVmInputs.emptySelection","targetProperty":"disabled"}, {}]
																			}]
																		}],
																		panel250: ["wm.Panel", {"border":"0,0,0,1","height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"5,0,0,10","padding":"0","verticalAlign":"top","width":"20px"}, {}],
																		removeVmInputBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Remove","hint":"Remove from inventory","imageIndex":108,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"removeVmInputBtnClick"}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"gridVmInputs.emptySelection","targetProperty":"disabled"}, {}]
																			}]
																		}]
																	}]
																}]
															}],
															layerVmTerminals: ["wm.Layer", {"borderColor":"","caption":"Terminals","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}, {
																labeTerminals: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextDecoration_Bold","wm_FontColor_Black"]},"border":"0","caption":"Terminals:","padding":"4"}, {}, {
																	format: ["wm.DataFormatter", {}, {}]
																}],
																panel119: ["wm.MainContentPanel", {"autoScroll":true,"border":"1,0,0,0","borderColor":"#888888","height":"100%","horizontalAlign":"left","padding":"15","verticalAlign":"top","width":"100%"}, {}, {
																	panel120: ["wm.HeaderContentPanel", {"fitToContentHeight":true,"fitToContentWidth":true,"height":"150px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"200px"}, {}, {
																		gridVmTerminals: ["wm.DojoGrid", {"columns":[{"show":true,"id":"type","title":"Type","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"port","title":"Port","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","margin":"0","minHeight":150,"minWidth":200}, {}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"varVmConsoleList","targetProperty":"dataSet"}, {}]
																			}]
																		}]
																	}]
																}]
															}],
															layerVmSerials: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"left","padding":"0","verticalAlign":"top"}, {}, {
																labelSerials: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextDecoration_Bold","wm_FontColor_Black"]},"border":"0","caption":"Serials:","padding":"4"}, {}, {
																	format: ["wm.DataFormatter", {}, {}]
																}],
																panel121: ["wm.Panel", {"autoScroll":true,"border":"1,0,0,0","height":"100%","horizontalAlign":"left","padding":"15","verticalAlign":"top","width":"100%"}, {}, {
																	panel122: ["wm.HeaderContentPanel", {"fitToContentHeight":true,"fitToContentWidth":true,"height":"150px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"200px"}, {}, {
																		gridVmSerials: ["wm.DojoGrid", {"columns":[{"show":true,"id":"type","title":"Type","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"port","title":"Port","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","margin":"0","minHeight":150,"minWidth":200}, {}, {
																			binding: ["wm.Binding", {}, {}, {
																				wire: ["wm.Wire", {"expression":undefined,"source":"varVmSerialList","targetProperty":"dataSet"}, {}]
																			}]
																		}]
																	}]
																}]
															}]
														}]
													}]
												}],
												panel72: ["wm.MainContentPanel", {"border":"0","height":"34px","horizontalAlign":"right","layoutKind":"left-to-right","padding":"0,10,0,0","verticalAlign":"top","width":"100%"}, {}, {
													vmConfigSave: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"Commit","hint":"Commit your modifications.","imageIndex":15,"imageList":"app.silkIconsOpenkvi","margin":"4","width":"90px"}, {"onclick":"vmConfigSaveClick"}],
													resetVmConfigBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":" Reset","imageIndex":98,"imageList":"app.silkIconsOpenkvi","margin":"4"}, {"onclick":"resetVmConfigBtnClick"}]
												}]
											}]
										}],
										TabVmSnapshots: ["wm.Layer", {"border":"1","borderColor":"#b3b8c4","caption":"Snapshots","horizontalAlign":"left","layoutKind":"left-to-right","margin":"1","padding":"5,10,5,10","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"TabVmSnapshotsShow"}, {
											panelSnapshotsManagement: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"10,20,20,20","verticalAlign":"top","width":"100%"}, {}, {
												panelSnapMain: ["wm.Panel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px","wm_BorderShadow_StrongShadow"]},"border":"1","borderColor":"#b3b8c4","height":"100%","horizontalAlign":"left","margin":"10","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
													panel184: ["wm.Panel", {"border":"0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
														pictureSnapWarning: ["wm.Picture", {"border":"0","height":"30px","padding":"4,0,0,0","source":"resources/images/icons/dialog-warning-16.png","width":"20px"}, {}],
														SnapshotsTitle: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_Black"]},"align":"left","border":"0","caption":"Snapshot currently in use:","margin":"0,0,0,10","padding":"4","width":"100%"}, {}]
													}],
													panelSnapIcons: ["wm.EmphasizedContentPanel", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"border":"1,0,1,0","borderColor":"#b3b8c4","height":"38px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
														spacer53: ["wm.Spacer", {"height":"100%","width":"5px"}, {}],
														buttonNewSnapshot: ["wm.Button", {"caption":"<img src='resources/images/icons/actions/snapshot_create_24.png'/>","height":"34px","hint":"Create new snapshot","imageIndex":0,"margin":"2","width":"45px"}, {"onclick":"buttonNewSnapshotClick"}],
														panel198: ["wm.Panel", {"border":"0,0,0,1","height":"100%","horizontalAlign":"left","margin":"0,0,0,8","verticalAlign":"top","width":"16px"}, {}],
														buttonRevertSnapshot: ["wm.Button", {"caption":"<img src='resources/images/icons/actions/snapshot_revert_24.png'/>","height":"34px","hint":"Go to snapshot","imageIndex":3,"margin":"2","width":"45px"}, {"onclick":"buttonRevertSnapshotClick"}],
														panel164: ["wm.Panel", {"border":"0,0,0,1","height":"100%","horizontalAlign":"left","margin":"0,0,0,8","verticalAlign":"top","width":"16px"}, {}],
														buttonRollbackSnapshot: ["wm.Button", {"caption":"<img src='resources/images/icons/actions/snapshot_rollback_24.png'/>","height":"34px","hint":"Rollback snapshot","imageIndex":3,"margin":"2","width":"45px"}, {"onclick":"buttonRollbackSnapshotClick"}],
														buttonDeleteSnapshot: ["wm.Button", {"caption":"<img src='resources/images/icons/actions/snapshot_merge_parent_24.png'/>","height":"34px","hint":"Merge snapshot with parent","imageIndex":35,"margin":"2","width":"45px"}, {"onclick":"buttonDeleteSnapshotClick"}],
														panel165: ["wm.Panel", {"border":"0,0,0,1","height":"100%","horizontalAlign":"left","margin":"0,0,0,8","verticalAlign":"top","width":"16px"}, {}],
														buttonMergeToDescSnapshot: ["wm.Button", {"caption":"<img src='resources/images/icons/actions/snapshot_merge_descendant_24.png'/>","height":"34px","hint":"Discard snapshot","margin":"2","width":"45px"}, {"onclick":"buttonMergeToDescSnapshotClick"}],
														buttonDiscardAll: ["wm.Button", {"caption":"<img src='resources/images/icons/actions/discard-all-snapshots.png'/>","height":"34px","hint":"Discard branch","margin":"2","showing":false,"width":"45px"}, {"onclick":"buttonDiscardAllClick"}]
													}],
													panelSnapshots: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px"]},"autoScroll":true,"border":"0","borderColor":"#ffffff","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","minWidth":300,"padding":"20","verticalAlign":"top","width":"100%"}, {}, {
														snapshotsTree: ["wm.ObjectTree", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved4px"]},"border":"0","data":{},"height":"100%","imageList":"app.silkIconList","padding":"0"}, {"onselect":"snapshotsTreeSelect"}]
													}]
												}]
											}]
										}],
										TabVmPerformances: ["wm.Layer", {"autoScroll":true,"border":"1","borderColor":"#b3b8c4","caption":"Performances","horizontalAlign":"left","margin":"1","padding":"5,10,5,10","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"TabVmPerformancesShow"}, {
											panel62: ["wm.Panel", {"border":"0","height":"320px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"10,0,0,0","verticalAlign":"top","width":"100%"}, {}, {
												spacer42: ["wm.Spacer", {"height":"48px","width":"33px"}, {}],
												dojoChartCpuMem: ["wm.DojoChart", {"_classes":{"domNode":["wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px","wm_BorderShadow_WeakShadow","wm_BackgroundColor_VeryLightGray"]},"border":"1","chartColor":["#a94a38","#6098f0"],"chartTitle":"CPU and Memory usage on host","chartType":"Lines","height":"300px","margin":"5","maxTimePoints":1,"padding":"4","theme":"Tufte","width":"400px","xAxis":"index","yAxis":"cpu,mem","yAxisTitle":"Percent"}, {}, {
													binding: ["wm.Binding", {}, {}, {
														wire: ["wm.Wire", {"expression":undefined,"source":"varVmTop","targetProperty":"dataSet"}, {}]
													}]
												}],
												spacer43: ["wm.Spacer", {"height":"48px","width":"33px"}, {}],
												dojoChartNetwork: ["wm.DojoChart", {"_classes":{"domNode":["wm_BackgroundColor_VeryLightGray","wm_BorderTopStyle_Curved4px","wm_BorderBottomStyle_Curved4px","wm_BorderShadow_WeakShadow"]},"border":"1","chartColor":[""],"chartTitle":"Network traffic (Kb)","chartType":"Areas","height":"300px","margin":"5","maxTimePoints":1,"padding":"4","theme":"Tufte","width":"400px","xAxis":"index","yAxis":"net_rx,net_tx"}, {}, {
													binding: ["wm.Binding", {}, {}, {
														wire: ["wm.Wire", {"expression":undefined,"source":"varVmTop","targetProperty":"dataSet"}, {}]
													}]
												}],
												spacer44: ["wm.Spacer", {"height":"48px","width":"33px"}, {}]
											}]
										}]
									}],
									TabVMsPerf: ["wm.Box", {"border":"1","borderColor":"#cdd5ef","caption":"Performances","horizontalAlign":"left","verticalAlign":"top"}, {}]
								}]
							}]
						}]
					}],
					splitterHor: ["wm.Splitter", {"bevelSize":"2","height":"2px","minimum":36,"width":"100%"}, {}],
					layersBottomInfo: ["wm.Layers", {"defaultLayer":0,"height":"150px"}, {}, {
						layerLogs: ["wm.Layer", {"borderColor":"","caption":"layerLogs","horizontalAlign":"left","padding":"0","themeStyleType":"","verticalAlign":"top"}, {}, {
							panel79: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
								panel88: ["wm.HeaderContentPanel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
									panelLogTitle: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"border":"0","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"middle","width":"100%"}, {}, {
										hideTaskListPict: ["wm.Picture", {"_classes":{"domNode":["wm_Mouse_pointer"]},"border":"0","height":"16px","hint":"Hide Tasks List","imageList":"","source":"resources/images/icons/arrow-hide.png","width":"16px"}, {"onclick":"hideTaskListPictClick"}],
										labelTaskLog: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_FontColor_Graphite"]},"border":"0","caption":"Tasks list","height":"20px","padding":"0,0,0,2","width":"70px"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}],
										labelNbUnseenMsg: ["wm.Label", {"_classes":{"domNode":["wm_BorderTopStyle_Curved12px","wm_BorderBottomStyle_Curved12px","wm_TextDecoration_Bold","wm_FontColor_White"]},"align":"center","border":"1","caption":"0","padding":"0","width":"24px"}, {}],
										spacer25: ["wm.Spacer", {"height":"100%","width":"100%"}, {}],
										clearLogBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"Clear","height":"20px","margin":"0","width":"44px"}, {"onclick":"clearLogBtnClick"}],
										spacer28: ["wm.Spacer", {"height":"100%","width":"10px"}, {}]
									}],
									gridLog: ["wm.DojoGrid", {"columns":[{"show":true,"id":"task","title":"Task","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"target","title":"Object","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"owner","title":"Owner","width":"80px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"node","title":"Node","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"started","title":"Started","width":"80px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"finished","title":"Finished","width":"80px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"icon","title":"<image style=\"height: 12px;\" src=\"resources/images/icons/documentinfo-12.png\"/>","width":"24px","displayType":"Text","noDelete":true,"align":"center","formatFunc":""},{"show":true,"id":"status","title":"Status","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"state","title":"State","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"uid","title":"Uid","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","margin":"0"}, {}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":undefined,"source":"varTaskLog","targetProperty":"dataSet"}, {}]
										}]
									}]
								}]
							}]
						}],
						layerShowSearch: ["wm.Layer", {"borderColor":"","caption":"layerShowSearch","horizontalAlign":"left","padding":"0","themeStyleType":"","verticalAlign":"top"}, {}, {
							panelLogTitle1: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"border":"0,0,1,0","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
								labelShowSearch: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_FontColor_Graphite"]},"border":"0","caption":"Search result","height":"20px","padding":"0,0,0,10","width":"100%"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								CloseSearchBtn: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"caption":"Close","height":"20px","imageIndex":35,"imageList":"app.silkIconList","margin":"0","width":"70px"}, {"onclick":"CloseSearchBtnClick"}],
								spacer52: ["wm.Spacer", {"height":"100%","width":"10px"}, {}]
							}]
						}]
					}]
				}]
			}]
		}],
		panelBottom: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"borderColor":"#b3b3a9","height":"20px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
			panel144: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				label29: ["wm.Label", {"_classes":{"domNode":["wm_FontFamily_Courier","wm_FontSizePx_12px"]},"border":"0","caption":"Open KVM Virtualization Infrastructure","height":"100%","padding":"0,0,0,10","width":"100%"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				labelVersion: ["wm.Label", {"border":"0","caption":"Version:","height":"100%","padding":"0","width":"60px"}, {}],
				openkviVersion: ["wm.Label", {"border":"0","caption":"2.0.0","height":"100%","padding":"0","width":"70px"}, {}]
			}]
		}]
	}]
}