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

import org.json.*;
import java.io.IOException;
import java.io.InputStream;
import org.apache.commons.io.IOUtils;
import com.wavemaker.runtime.RuntimeAccess;
import javax.xml.parsers.*; 
import java.io.*; 
import java.util.ArrayList;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.OutputKeys;
import java.util.UUID;
import java.util.Random;
import org.xml.sax.*; 
import org.jdom.*;
import org.jdom.input.*;
import org.jdom.output.*;
import java.util.List;
import java.util.Iterator;
import java.net.*;

import javax.servlet.http.HttpSession;


public class vmXmlFile extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {
    /* Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;
     *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation
     */
    public vmXmlFile() {
       super(INFO);
    }   
    
    public String updateVmMemory(String vName, String server, String newMem) throws IOException {
        String result = "VmMemory::"+vName+"::"+server+"::";
        org.jdom.Document document;
        Element racine;
        try {
            String relPath="resources/data/"+server+"/vm/configs/"+vName+"/"+vName+".xml";
            String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            File xmlFile = new File(pathToXml);
            SAXBuilder sxb = new SAXBuilder();
            document = sxb.build(xmlFile);
            //
            racine = document.getRootElement();
            // Update Memory
            Element memory = racine.getChild("memory");
            memory.setText(newMem);
            
            Element currentMemory = racine.getChild("currentMemory");
            currentMemory.setText(newMem);
            
            
            // transform DOM to XML
            Format format = Format.getPrettyFormat();
            format.setOmitDeclaration(true);
            XMLOutputter sortie = new XMLOutputter(format);
            sortie.output(document, new FileOutputStream(pathToXml));
            
            this.updateVmLiveMemory(vName, server, newMem);
            String res = this.updateVmDesc(vName, server, pathToXml, "memory"); 
            result += res;
            
        } catch (Exception e) {
            return result+"Error="+e.toString();
        }
        return result;
    }
    
    public String updateVmProcessor(String vName, String server, String data) throws IOException {
        String result = "vmProcessor::"+vName+"::"+server+"::";
        org.jdom.Document document;
        Element racine;
        try {
            String relPath="resources/data/"+server+"/vm/configs/"+vName+"/"+vName+".xml";
            String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            File xmlFile = new File(pathToXml);
            SAXBuilder sxb = new SAXBuilder();
            document = sxb.build(xmlFile);
            //
            racine = document.getRootElement();
            JSONObject joData = new JSONObject(data);
            
            // Update CPU
            String newCpu = joData.get("vcpu").toString();
            Element processor = racine.getChild("vcpu");
            processor.setText(newCpu);
            
            //Update Clock source
            racine.removeChildren("clock");
            Element clock = new Element("clock");
            racine.addContent(clock);
            
            //Update Model
            //<cpu mode='host-passthrough'/>
            racine.removeChildren("cpu");
            Element host_cpu = new Element("cpu");
            racine.addContent(host_cpu);
            String newCpuMode = joData.get("model").toString();
            Attribute cpuModel = new Attribute("mode",newCpuMode);
            host_cpu.setAttribute(cpuModel);
            
            String strOffset = joData.get("offset").toString();            
            Attribute offsetAt = new Attribute("offset",strOffset);
            clock.setAttribute(offsetAt);
            if (strOffset.equals("timezone")) {
                Attribute zoneAt = new Attribute("timezone",joData.get("timezone").toString());
                clock.setAttribute(zoneAt);
            }
            JSONArray timerArray = joData.getJSONArray("timers");
            for (int i = 0; i < timerArray.length(); i++) {
                Element timerEl = new Element("timer");
                clock.addContent(timerEl);                
                JSONObject timerData = timerArray.getJSONObject(i);
                String timerName = timerData.get("name").toString();
                Attribute timerNameAt = new Attribute("name",timerName);
                timerEl.setAttribute(timerNameAt);
                String timerTickpolicy = timerData.get("tickpolicy").toString();
                Attribute timerTickpolicyAt = new Attribute("tickpolicy",timerTickpolicy);
                timerEl.setAttribute(timerTickpolicyAt);
                String timerPresent = timerData.get("present").toString();
                Attribute timerPresentAt = new Attribute("present",timerPresent);
                timerEl.setAttribute(timerPresentAt);  
                // Optional parameters:
                String timerTrack = timerData.get("track").toString();
                if (timerTrack.length() > 0) {
                    Attribute timerTrackAt = new Attribute("track",timerTrack);
                    timerEl.setAttribute(timerTrackAt);
                }
                String timerFrequency = timerData.get("frequency").toString();
                if (timerFrequency.length() > 0) {
                    Attribute timerFrequencyAt = new Attribute("frequency",timerFrequency);
                    timerEl.setAttribute(timerFrequencyAt);
                }
                String timerMode = timerData.get("mode").toString();
                if (timerMode.length() > 0) {
                    Attribute timerModeAt = new Attribute("mode",timerMode);
                    timerEl.setAttribute(timerModeAt);
                }                
            }     
            
            // transform DOM to XML
            Format format = Format.getPrettyFormat();
            format.setOmitDeclaration(true);
            XMLOutputter sortie = new XMLOutputter(format);
            sortie.output(document, new FileOutputStream(pathToXml));
            
            this.updateVmLiveCpus(vName, server, newCpu);
            String res = this.updateVmDesc(vName, server, pathToXml, "processor"); 
            result += res;
            
        } catch (Exception e) {
            return result+"Error="+e.toString();
        }
        return result;
    }
    
    public String updateVmBios(String vName, String server, String newBiosJson) throws IOException {
        String result = "vmBios::"+vName+"::"+server+"::";
        org.jdom.Document document;
        Element racine;
        try {
            String relPath="resources/data/"+server+"/vm/configs/"+vName+"/"+vName+".xml";
            String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            File xmlFile = new File(pathToXml);
            SAXBuilder sxb = new SAXBuilder();
            document = sxb.build(xmlFile);
            
            racine = document.getRootElement();
            JSONObject jo = new JSONObject(newBiosJson);
            
            
            Element nPoweroff = racine.getChild("on_poweroff");
            nPoweroff.setText(jo.get("on_poweroff").toString());

            Element nCrash = racine.getChild("on_crash");
            nCrash.setText(jo.get("on_crash").toString());
            
            Element nReboot = racine.getChild("on_reboot");
            nReboot.setText(jo.get("on_reboot").toString());
            
            Element os = racine.getChild("os");
            os.removeChildren("boot");
            JSONArray bootArray = jo.getJSONArray("bootList");
            for (int i = 0; i < bootArray.length(); i++) {
                JSONObject bootDev = bootArray.getJSONObject(i);
                Element boot = new Element("boot");
                os.addContent(boot);
                Attribute dev = new Attribute("dev",bootDev.get("dev").toString());
                boot.setAttribute(dev);
            } 
            Element bootmenu = new Element("bootmenu");
            os.addContent(bootmenu);
            Attribute enable = new Attribute("enable",jo.get("bootMenu").toString());
            bootmenu.setAttribute(enable);
            
            Element features = racine.getChild("features");
            features.removeContent();
            JSONArray featureArray = jo.getJSONArray("features");
            for (int i = 0; i < featureArray.length(); i++) {
                JSONObject jasonFeature = featureArray.getJSONObject(i);
                Element feature = new Element(jasonFeature.get("opt").toString());
                features.addContent(feature);
            }
              
            Format format = Format.getPrettyFormat();
            format.setOmitDeclaration(true);
            XMLOutputter sortie = new XMLOutputter(format);
            sortie.output(document, new FileOutputStream(pathToXml));
            
            String res = this.updateVmDesc(vName, server, pathToXml, "bios"); 
            result += res;
            
        } catch (Exception e) {
            return result+"Error="+e.toString();
        }
        return result;
    }
    
    public String updateVmStorages(String vName, String server, String ipaddr, String storageActions) throws IOException {
        String result = "vmStorages::"+vName+"::"+server+"::";
        org.jdom.Document document;
        Element racine;
        Format xmlFormat = Format.getPrettyFormat();
        xmlFormat.setOmitDeclaration(true);
        XMLOutputter sortie = new XMLOutputter(xmlFormat);
        String deviceRes = "";
        
        try {
            String relPath="resources/data/"+server+"/vm/configs/"+vName+"/"+vName+".xml";
            String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            File xmlFile = new File(pathToXml);
            SAXBuilder sxb = new SAXBuilder();
            document = sxb.build(xmlFile);
            
            racine = document.getRootElement();
            Element devices = racine.getChild("devices");
            
            JSONObject jo = new JSONObject(storageActions);
            JSONArray actions = jo.getJSONArray("actions");
            for (int i = 0; i < actions.length(); i++) {
                JSONObject actionObj = actions.getJSONObject(i);
                String action = actionObj.get("action").toString();
                String device = actionObj.get("device").toString();
                String type = actionObj.get("type").toString();
                String name = actionObj.get("name").toString();
                String path = actionObj.get("path").toString();
                String fileFormat =  actionObj.get("format").toString();
                String size = actionObj.get("size").toString();
                String alloc = actionObj.get("allocation").toString();
                String driver = actionObj.get("driver").toString();
                String busType = actionObj.get("busType").toString();
                String bus = actionObj.get("bus").toString();
                String cache = actionObj.get("cache").toString();
                String image = path+name;
                if (action.equals("create")) {
                    String res = this.createVmImage(vName, server, image, fileFormat, size, alloc);
                }
                if (action.equals("delete")) {
                    //String res = this.deleteVmImage(ipaddr, image);
                    String res = this.deleteVmImage(vName, server, image);
                }

                if (action.equals("create") || action.equals("add")) {
                    Element elDisk = new Element("disk");
                    devices.addContent(elDisk);
                    Attribute atrType = new Attribute("type", type);
                    Attribute atrDevice = new Attribute("device", device);
                    elDisk.setAttribute(atrType);
                    elDisk.setAttribute(atrDevice);
                    
                    Element elDriver = new Element("driver");
                    elDisk.addContent(elDriver);
                    Attribute atrCache = new Attribute("cache", cache);
                    Attribute atrName = new Attribute("name", driver);
                    Attribute atrDriverType = new Attribute("type", fileFormat);
                    elDriver.setAttribute(atrCache);
                    elDriver.setAttribute(atrName);
                    elDriver.setAttribute(atrDriverType);                    
                    
                    
                    Element elTarget = new Element("target");
                    elDisk.addContent(elTarget);
                    Attribute atrDev = new Attribute("dev", bus);
                    Attribute atrBus = new Attribute("bus", busType);
                    elTarget.setAttribute(atrDev);
                    elTarget.setAttribute(atrBus);             
                    
                    if (image.length() >0) {
                        Element elSource = new Element("source");
                        elDisk.addContent(elSource);
                        Attribute atrFile = null;
                        if (type.equals("file")) {
                            atrFile = new Attribute("file", image);
                        } else if (type.equals("block")) {
                            atrFile = new Attribute("dev", image);
                        }
                        elSource.setAttribute(atrFile);
                    }
                } else if (action.equals("remove") || action.equals("delete")) {
                    List diskList = devices.getChildren("disk");
                    for(Iterator ite = diskList.iterator(); ite.hasNext(); ) {
                        Element elDisk = (Element) ite.next();
                        String tmpType = elDisk.getAttributeValue("type").toString();
                        if (image.length() >0) {
                            Element elSource = elDisk.getChild("source");
                            if(elSource != null) {
                                String strSource = "";
                                if (tmpType.equals("file")) {
                                    strSource = elSource.getAttributeValue("file").toString();
                                } else if (tmpType.equals("block")) {
                                    strSource = elSource.getAttributeValue("dev").toString();
                                }
                                if (image.equals(strSource)) {
                                    devices.removeContent(elDisk);
                                    break;
                                }
                            }
                        } else {
                            Element elTarget = elDisk.getChild("targer");
                            String strDev = elTarget.getAttributeValue("dev").toString();
                            if (bus.equals(strDev)) {
                                devices.removeContent(elDisk);
                                    break;
                            }
                        }
                    }
                } else if (action.equals("update")) {
                    List diskList = devices.getChildren("disk");
                    boolean found = false;
                    String oldSource = actionObj.get("oldSource").toString();
                    String oldBus = actionObj.get("oldBus").toString();
                       
                    for(Iterator ite = diskList.iterator(); ite.hasNext(); ) {
                        Element elDisk = (Element) ite.next();
                        String tmpType = elDisk.getAttributeValue("type").toString();
                        Element tmpSource = elDisk.getChild("source");
                        String strSource = "";
                        if (found == false) {
                            if (tmpSource != null) {
                                if (tmpType.equals("file")) {
                                    strSource = tmpSource.getAttributeValue("file").toString();
                                } else if (tmpType.equals("block")) {
                                    strSource = tmpSource.getAttributeValue("dev").toString();
                                }
                            }
                            
                            if (!strSource.equals("")) {
                                if (oldSource.equals(strSource)) {
                                    found = true;
                                }
                            } 
                            Element elTarget = elDisk.getChild("target");
                            String strDev = elTarget.getAttributeValue("dev").toString();
                            if (oldBus.equals(strDev)) {
                                found = true;                                
                            }
                            
                            if (found == true) {
                                elDisk.removeChild("address");
                                
                                if (elDisk.getAttribute("type") != null) {
                                    elDisk.setAttribute("type", type);
                                } else {
                                    Attribute atrType = new Attribute("type", type);
                                    elDisk.setAttribute(atrType);
                                }
                                if (elDisk.getAttribute("device") != null) {
                                    elDisk.setAttribute("device", device);
                                } else {
                                    Attribute atrDevice = new Attribute("device", device);
                                    elDisk.setAttribute(atrDevice);
                                }
                                        
                                Element elDriver = elDisk.getChild("driver");
                                if (elDriver.getAttribute("cache") != null) {
                                    elDriver.setAttribute("cache", cache);
                                } else {
                                    Attribute atrCache = new Attribute("cache", cache);
                                    elDriver.setAttribute(atrCache);
                                }
                                if (elDriver.getAttribute("name") != null) {
                                    elDriver.setAttribute("name", driver);
                                } else {
                                    Attribute atrName = new Attribute("name", driver);
                                    elDriver.setAttribute(atrName);
                                }
                                if (elDriver.getAttribute("type") != null) {
                                    elDriver.setAttribute("type", fileFormat);
                                } else {
                                    Attribute atrDriverType = new Attribute("type", fileFormat);
                                    elDriver.setAttribute(atrDriverType);
                                }
                                
                                if (elTarget.getAttribute("dev") != null) {
                                    elTarget.setAttribute("dev", bus);
                                } else {
                                    Attribute atrDev = new Attribute("dev", bus);
                                    elTarget.setAttribute(atrDev);
                                }
                                if (elTarget.getAttribute("bus") != null) {
                                    elTarget.setAttribute("bus", busType);
                                } else {
                                    Attribute atrBus = new Attribute("bus", busType);
                                    elTarget.setAttribute(atrBus);
                                }
                                
                                if (!image.equals(oldSource)) {
                                    if (tmpSource == null) {
                                        tmpSource = new Element("source");
                                        elDisk.addContent(tmpSource);
                                    } else {
                                        tmpSource.removeContent();
                                    }
                                    Attribute atrFile = null;
                                    if (type.equals("file")) {
                                        atrFile = new Attribute("file", image);
                                    } else if (type.equals("block")) {
                                        atrFile = new Attribute("dev", image);
                                    }
                                    tmpSource.setAttribute(atrFile);
                                }
                                String deviceXml = sortie.outputString(elDisk);
                                deviceRes += "::"+this.updateVmDevice(vName, server, deviceXml);
                                
                            }
                        }
                    }
                }
            }
            
            sortie.output(document, new FileOutputStream(pathToXml));    
            String res = this.updateVmDesc(vName, server, pathToXml, "storages"); 
            result += res + deviceRes;
            
        } catch (Exception e) {
            return result+"Error="+e.toString();
        }
        return result;
    }
    public String updateVmNetworks(String vName, String server, String netActions) throws IOException {
        String result = "vmStorages::"+vName+"::"+server+"::";
        org.jdom.Document document;
        Element racine;
        Format xmlFormat = Format.getPrettyFormat();
        xmlFormat.setOmitDeclaration(true);
        XMLOutputter sortie = new XMLOutputter(xmlFormat);
        String deviceRes = "";
        try {
            String relPath="resources/data/"+server+"/vm/configs/"+vName+"/"+vName+".xml";
            String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            File xmlFile = new File(pathToXml);
            SAXBuilder sxb = new SAXBuilder();
            document = sxb.build(xmlFile);
            
            racine = document.getRootElement();
            Element devices = racine.getChild("devices");
            
            JSONObject jo = new JSONObject(netActions);
            JSONArray actions = jo.getJSONArray("actions");
            for (int i = 0; i < actions.length(); i++) {
                JSONObject actionObj = actions.getJSONObject(i);
                String type = actionObj.get("type").toString();
                if (type.equals("Bridge")) {
                    type = "bridge";
                } else if (type.equals("Virtual Network")) {
                    type = "network";
                } else if (type.equals("OpenVswitch")) {
                    type = "network";
                } else if (type.equals("Private Bridge")) {
                    type = "network";
                } else if (type.equals("SR-IOV Passthrough")) {
                    type = "network";
                } else if (type.equals("Userspace SLIRP")) {
                    type = "user";
                } else if (type.equals("Direct Access")) {
                    type = "direct";
                } else if (type.equals("Multicast Tunnel")) {
                    type = "mcast";
                } else if (type.equals("TCP Tunnel")) {
                    type = "server";
                }
                
                String action = actionObj.get("action").toString();
                String source = actionObj.get("source").toString();
                String portgroup = actionObj.get("portgroup").toString();
                if (portgroup.equals("<i>default</i>") || portgroup.equals("<i>none</i>")) {
                    portgroup = "";
                }
                
                String model = actionObj.get("model").toString();
                String mac = actionObj.get("mac").toString();
                String options =  actionObj.get("options").toString();
                String connected =  actionObj.get("connected").toString();
                if (mac.equals("auto")) {
                    Random rand = new Random();
                    mac = "52:54:00";
                    String hexa = Integer.toHexString(rand.nextInt(255));
                    mac += ":" + hexa;
                    hexa = Integer.toHexString(rand.nextInt(255));
                    mac += ":" + hexa;
                    hexa = Integer.toHexString(rand.nextInt(255));
                    mac += ":" + hexa;
                }
                
                
                
                if (action.equals("add")) {
                    Element elInterface = new Element("interface");
                    devices.addContent(elInterface);
                    Attribute atrType = new Attribute("type", type);
                    elInterface.setAttribute(atrType);
                    
                    Element elSource = new Element("source");
                    elInterface.addContent(elSource);
                    if (type.equals("bridge")) {
                        Attribute atrSrc = new Attribute("bridge", source);
                        elSource.setAttribute(atrSrc);
                        Element elMac = new Element("mac");
                        elInterface.addContent(elMac);
                        Attribute atrMac = new Attribute("address", mac);
                        elMac.setAttribute(atrMac);
                        
                    } else if (type.equals("network")) {
                        Attribute atrSrc = new Attribute("network", source);
                        elSource.setAttribute(atrSrc);
                        if (! portgroup.equals("")) {
                            Attribute atrPg = new Attribute("portgroup", portgroup);
                            elSource.setAttribute(atrPg);
                        }
                        Element elMac = new Element("mac");
                        elInterface.addContent(elMac);
                        Attribute atrMac = new Attribute("address", mac);
                        elMac.setAttribute(atrMac);
                        
                    } else if (type.equals("ethernet")) {
                        Attribute atrSrc = new Attribute("dev", source);
                        elSource.setAttribute(atrSrc);
                    } else if (type.equals("direct")) {
                        Attribute atrSrc = new Attribute("dev", source);
                        Attribute atrMode = new Attribute("mode", mac);
                        elSource.setAttribute(atrSrc);
                        elSource.setAttribute(atrMode);
                    } else if (type.equals("direct")) {
                        Attribute atrSrc = new Attribute("dev", source);
                        Attribute atrMode = new Attribute("mode", mac);
                        elSource.setAttribute(atrSrc);
                        elSource.setAttribute(atrMode);
                    } else if (type.equals("mcast")) {
                        Attribute atrSrc = new Attribute("address", source);
                        Attribute atrMode = new Attribute("port", mac);
                        elSource.setAttribute(atrSrc);
                        elSource.setAttribute(atrMode);
                    } else if (type.equals("server")) {
                        Attribute atrSrc = new Attribute("address", source);
                        Attribute atrMode = new Attribute("port", mac);
                        elSource.setAttribute(atrSrc);
                        elSource.setAttribute(atrMode);
                    }
                    Element elModel = new Element("model");
                    elInterface.addContent(elModel);
                    Attribute atrModel = new Attribute("type", model);
                    elModel.setAttribute(atrModel);
                    
                    Element elLink = new Element("link");
                    elInterface.addContent(elLink);
                    Attribute atrLink = new Attribute("state", connected);
                    elLink.setAttribute(atrLink);
                    
                    
                } else if (action.equals("remove")) {
                    List interfaceList = devices.getChildren("interface");
                    Element elToRemove = null;
                    for(Iterator ite = interfaceList.iterator(); ite.hasNext(); ) {
                        Element elInterface = (Element) ite.next();
                        String tmpType = elInterface.getAttributeValue("type").toString();
                        Element elSource = elInterface.getChild("source");
                        String tmpMac = "";
                        
                        if (type.equals("bridge") || type.equals("network")) {
                            Element elMac = elInterface.getChild("mac");
                            tmpMac = elMac.getAttributeValue("address").toString();
                            if (mac.equals(tmpMac)) {
                                elToRemove = elInterface;
                            }
                        }
                    }
                    if (elToRemove != null) {
                        devices.removeContent(elToRemove);
                    }
                } 
                
                else if (action.equals("update")) {
                    List interfaceList = devices.getChildren("interface");
                    boolean found = false;
                    String oldSource = actionObj.get("oldSource").toString();
                    String oldPortgroup = actionObj.get("oldPortgroup").toString();
                    String oldModel = actionObj.get("oldModel").toString();
                    String oldMac = actionObj.get("oldMac").toString();
                    
                       
                    for(Iterator ite = interfaceList.iterator(); ite.hasNext(); ) {
                        Element elInterface = (Element) ite.next();
                        if (found == false) {
                            String tmpType = elInterface.getAttributeValue("type").toString();
                            Element elSource = elInterface.getChild("source");
                            String strSource = "";
                            if (tmpType.equals("bridge") || tmpType.equals("network")) {
                                Element elTmpMac = elInterface.getChild("mac");
                                String tmpMac = elTmpMac.getAttributeValue("address").toString();
                                if (oldMac.equals(tmpMac)) {
                                    found = true;
                                }
                            } 
                            if (found == true) {
                                elInterface.setAttribute("type", type);
                                elInterface.removeChildren("source");
                                Element newElSource = new Element("source");
                                elInterface.addContent(newElSource);
                                if (type.equals("bridge")) {
                                    Attribute atrSrc = new Attribute("bridge", source);
                                    newElSource.setAttribute(atrSrc);
                                    Element elMac = elInterface.getChild("mac");
                                    elMac.setAttribute("address", mac);
                                } else if (type.equals("network")) {
                                    Attribute atrSrc = new Attribute("network", source);
                                    newElSource.setAttribute(atrSrc);
                                    if (! portgroup.equals("")) {
                                        Attribute atrPg = new Attribute("portgroup", portgroup);
                                        newElSource.setAttribute(atrPg);
                                    }
                                    Element elMac = elInterface.getChild("mac");
                                    elMac.setAttribute("address", mac);
                                }
                                elInterface.removeChildren("model");
                                Element elModel = new Element("model");
                                elInterface.addContent(elModel);
                                Attribute atrModel = new Attribute("type", model);
                                elModel.setAttribute(atrModel);
                                
                                elInterface.removeChildren("link");
                                Element elLink = new Element("link");
                                elInterface.addContent(elLink);
                                Attribute atrLink = new Attribute("state", connected);
                                elLink.setAttribute(atrLink);
                                
                                String deviceXml = sortie.outputString(elInterface);
                                if (type.equals("network")) {
                                    String dst = "{\"mac\":\""+mac+"\", \"vswitch\":\""+source+"\", \"portgroup\":\""+portgroup+"\"}";
                                    deviceRes += "::"+this.moveVmLink(vName, server, dst);
                                }                                
                            }
                        }
                    }
                }
            }
            
            sortie.output(document, new FileOutputStream(pathToXml));    
            String res = this.updateVmDesc(vName, server, pathToXml, "networks"); 
            result += res + deviceRes;
            
        } catch (Exception e) {
            return result+"Error="+e.toString();
        }
        return result;
    }
    public String moveVmLink(String vName, String server, String data) throws IOException {
    String result = "";
    // data : {"mac": mac, "vswitch":source, "portgroup":portgroup}
    try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "move_vlink");
            joAction.put("vm", vName);
            joAction.put("vlink", data);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            String res = callOvnmanager(server, joAction.toString());
            result = res;
        } catch (Exception e) {
            return result+"Error="+e.toString();
        }
        return result;
    }  
    public String updateVmNetworkLink(String vName, String server, String data) throws IOException {
    String result = "";
    try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "link_state");
            joAction.put("vm", vName);
            joAction.put("link", data);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            String res = callOvnmanager(server, joAction.toString());
            result = res;
        } catch (Exception e) {
            return result+"Error="+e.toString();
        }
        return result;
    }   
        
    public String updateVmVideo(String vName, String server, String todo) throws IOException {
        String result = "vmVideo::"+vName+"::"+server+"::";
        org.jdom.Document document;
        Element racine;
        Format xmlFormat = Format.getPrettyFormat();
        xmlFormat.setOmitDeclaration(true);
        XMLOutputter sortie = new XMLOutputter(xmlFormat);
        boolean found = false;
        String deviceRes = "";

        try {
            String relPath="resources/data/"+server+"/vm/configs/"+vName+"/"+vName+".xml";
            String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            File xmlFile = new File(pathToXml);
            SAXBuilder sxb = new SAXBuilder();
            document = sxb.build(xmlFile);
            
            racine = document.getRootElement();
            Element devices = racine.getChild("devices");
            
            JSONArray joTodo = new JSONArray(todo);
            for (int i = 0; i < joTodo.length(); i++) {
                JSONObject actionObj = joTodo.getJSONObject(i);
                String ComponentType = actionObj.get("type").toString();
                String action = actionObj.get("action").toString();
                JSONObject item = actionObj.getJSONObject("item");
                
                
                if (ComponentType.equals("video")) {
                    Element video = devices.getChild("video");
                    video.removeChildren("model");
                    Element model = new Element("model");
                    video.addContent(model);
                    Attribute atrType = new Attribute("type",item.get("model").toString());
                    model.setAttribute(atrType);
                    Attribute atrVram = new Attribute("vram",item.get("vram").toString());
                    model.setAttribute(atrVram);
                    Attribute atrHeads = new Attribute("heads",item.get("heads").toString());
                    model.setAttribute(atrHeads);
                    
                } else if (action.equals("add")) {
                    Element elGraphics = new Element("graphics");
                    devices.addContent(elGraphics);
                    String type = item.get("type").toString();
                    Attribute atrType = new Attribute("type", type);
                    elGraphics.setAttribute(atrType);
                    Attribute atrKeymap = new Attribute("keymap", item.get("keymap").toString());
                    elGraphics.setAttribute(atrKeymap);
                    
                    if (type.equals("vnc")) {
                        Attribute atrListen = new Attribute("listen", item.get("listen").toString());
                        elGraphics.setAttribute(atrListen);
                        Attribute atrPort = new Attribute("port", item.get("port").toString());
                        elGraphics.setAttribute(atrPort);
                        Attribute atrAutoport = new Attribute("autoport", item.get("autoport").toString());
                        elGraphics.setAttribute(atrAutoport);
                    
                    } else if (type.equals("sdl")) {
                        Attribute atrDisplay = new Attribute("display", item.get("listen").toString());
                        elGraphics.setAttribute(atrDisplay);
                    }
                    
                } else if (action.equals("remove")) {
                    List graphicsList = devices.getChildren("graphics");
                    Element elToRemove = null;
                    String type = item.get("type").toString();
                    for(Iterator ite = graphicsList.iterator(); ite.hasNext(); ) {
                        Element elGraph = (Element) ite.next();
                        String tmpType = elGraph.getAttributeValue("type").toString();
                        if (type.equals(tmpType) && type.equals("vnc")) {
                            String tmpPort = elGraph.getAttributeValue("port");
                            if (tmpPort == null) { tmpPort = ""; }
                            String tmpAutoport = elGraph.getAttributeValue("autoport");
                            if (tmpAutoport == null) { tmpAutoport = ""; }
                            String tmpKeymap = elGraph.getAttributeValue("keymap");
                            if (tmpKeymap == null) { tmpKeymap = ""; }
                            String tmpListen = elGraph.getAttributeValue("listen");
                            if (tmpListen == null) { tmpListen = ""; }
                            
                            String port = item.get("port").toString();
                            String autoport = item.get("autoport").toString();
                            String listen = item.get("listen").toString();
                            String keymap = item.get("keymap").toString();
                            
                            if (keymap.equals(tmpKeymap)&&listen.equals(tmpListen)&&autoport.equals(tmpAutoport)&&port.equals(tmpPort)) {
                                elToRemove = elGraph;
                            }
                        } else if (type.equals(tmpType) && type.equals("sdl")) {
                            String tmpDisplay = elGraph.getAttributeValue("display").toString();
                            String display = item.get("display").toString();
                            
                            if (display.equals(tmpDisplay)) {
                                elToRemove = elGraph;
                            }
                        }
                    }
                    if ( elToRemove != null ) {
                        devices.removeContent(elToRemove);
                    }
                } else if (action.equals("update")) {
                    List graphicsList = devices.getChildren("graphics");
                    //boolean found = false;
                    String type = item.get("type").toString();
                    JSONObject oldItem = actionObj.getJSONObject("olditem");
                    String oldtype = oldItem.get("type").toString();
                       
                    for(Iterator ite = graphicsList.iterator(); ite.hasNext(); ) {
                        Element elGraph = (Element) ite.next();
                        if (found == false) {
                            String tmpType = elGraph.getAttributeValue("type").toString();
                            String strSource = "";
                            if (oldtype.equals(tmpType) && type.equals("vnc")) {
                                String tmpPort = elGraph.getAttributeValue("port");
                                if (tmpPort == null) { tmpPort = ""; }
                                String tmpAutoport = elGraph.getAttributeValue("autoport");
                                if (tmpAutoport == null) { tmpAutoport = ""; }
                                String tmpKeymap = elGraph.getAttributeValue("keymap");
                                if (tmpKeymap == null) { tmpKeymap = ""; }
                                String tmpListen = elGraph.getAttributeValue("listen");
                                if (tmpListen == null) { tmpListen = ""; }
                            
                                String oldPort = oldItem.get("port").toString();
                                String oldAutoport = oldItem.get("autoport").toString();
                                String oldListen = oldItem.get("listen").toString();
                                String oldKeymap = oldItem.get("keymap").toString();
                            
                                if (oldKeymap.equals(tmpKeymap)&&oldListen.equals(tmpListen)&&oldAutoport.equals(tmpAutoport)) {
                                    found = true;
                                } 
                            } else if (oldtype.equals(tmpType) && oldtype.equals("sdl")) {
                                String tmpDisplay = elGraph.getAttributeValue("display").toString();
                                String oldDisplay = oldItem.get("display").toString();
                            
                                if (oldDisplay.equals(tmpDisplay)) {
                                    found = true;
                                }
                            } 
                            if (found == true) {
                                if (type.equals("vnc")) {
                                    elGraph.removeAttribute("port");
                                    Attribute atrPort = new Attribute("port", item.get("port").toString());
                                    elGraph.setAttribute(atrPort);
                                    elGraph.removeAttribute("listen");
                                    Attribute atrListen = new Attribute("listen", item.get("listen").toString());
                                    elGraph.setAttribute(atrListen);
                                    elGraph.removeAttribute("autoport");
                                    Attribute atrAutoport = new Attribute("autoport", item.get("autoport").toString());
                                    elGraph.setAttribute(atrAutoport);
                                    elGraph.removeAttribute("keymap");
                                    Attribute atrKeymap = new Attribute("keymap", item.get("keymap").toString());
                                    elGraph.setAttribute(atrKeymap);
                                    
                                } else if (type.equals("sdl")) {
                                    elGraph.removeAttribute("display");
                                    Attribute atrDisplay = new Attribute("display", item.get("display").toString());
                                    elGraph.setAttribute(atrDisplay);
                                    elGraph.removeAttribute("keymap");
                                    Attribute atrKeymap = new Attribute("keymap", item.get("keymap").toString());
                                    elGraph.setAttribute(atrKeymap);
                                    
                                }
                                String deviceXml = sortie.outputString(elGraph);
                                deviceRes += "::"+this.updateVmDevice(vName, server, deviceXml);
                                
                            }
                        }
                    }
                }
            }
            
            sortie.output(document, new FileOutputStream(pathToXml));    
            String res = this.updateVmDesc(vName, server, pathToXml, "video"); 
            result += res + deviceRes;
            
        } catch (Exception e) {
            return result+"{\"action\":{\"result\":\"Error:"+e.toString()+"\"}}";
        }
        return result;
    }

    public String updateVmInput(String vName, String server, String todo) throws IOException {
		String result = "vmInput::"+vName+"::"+server+"::";
		org.jdom.Document document;
		Element racine;
		Format xmlFormat = Format.getPrettyFormat();
		xmlFormat.setOmitDeclaration(true);
		XMLOutputter sortie = new XMLOutputter(xmlFormat);
		boolean found = false;
		String deviceRes = "";
		try {
			String relPath="resources/data/"+server+"/vm/configs/"+vName+"/"+vName+".xml";
			String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
			File xmlFile = new File(pathToXml);
			SAXBuilder sxb = new SAXBuilder();
			document = sxb.build(xmlFile);
			
			racine = document.getRootElement();
			Element devices = racine.getChild("devices");
			
			JSONArray joTodo = new JSONArray(todo);
			for (int i = 0; i < joTodo.length(); i++) {
				JSONObject actionObj = joTodo.getJSONObject(i);
				String ComponentType = actionObj.get("type").toString();
				String action = actionObj.get("action").toString();
				JSONObject item = actionObj.getJSONObject("item");
				
				if (action.equals("add")) {
					Element elInput = new Element("input");
					devices.addContent(elInput);
					String type = item.get("type").toString();
					Attribute atrType = new Attribute("type", type);
					elInput.setAttribute(atrType);
					Attribute atrBus = new Attribute("bus", item.get("bus").toString());
					elInput.setAttribute(atrBus);
				
				} else if (action.equals("remove")) {
					List inputList = devices.getChildren("input");
					Element elToRemove = null;
					String type = item.get("type").toString();
					for (Iterator ite = inputList.iterator(); ite.hasNext(); ) {
						Element elInput = (Element) ite.next();
						String tmpType = elInput.getAttributeValue("type").toString();
						if (type.equals(tmpType)) {
							String tmpBus = elInput.getAttributeValue("bus");
							if (tmpBus == null) { tmpBus = ""; }
							String bus = item.get("bus").toString();
							
							if (bus.equals(tmpBus)) {
								elToRemove = elInput;
							}
						}
					}
					if ( elToRemove != null ) {
						devices.removeContent(elToRemove);
					}
				} else if (action.equals("update")) {
					List inputList = devices.getChildren("input");
					String type = item.get("type").toString();
					JSONObject oldItem = actionObj.getJSONObject("olditem");
					String oldtype = oldItem.get("type").toString();
					
					for(Iterator ite = inputList.iterator(); ite.hasNext(); ) {
						Element elInput = (Element) ite.next();
						if (found == false) {
							String tmpType = elInput.getAttributeValue("type").toString();
							String strSource = "";
							if (oldtype.equals(tmpType)) {
								String tmpBus = elInput.getAttributeValue("bus");
								if (tmpBus == null) { tmpBus = ""; }
								String oldBus = oldItem.get("bus").toString();
								if (oldBus.equals(tmpBus)) {
									found = true;
								} 
							}
							if (found == true) {
    							elInput.removeAttribute("type");
    							Attribute atrType = new Attribute("type", item.get("type").toString());
    							elInput.setAttribute(atrType);
    							elInput.removeAttribute("bus");
    							Attribute atrBus = new Attribute("bus", item.get("bus").toString());
    							elInput.setAttribute(atrBus);
    							
    							String deviceXml = sortie.outputString(elInput);
    							deviceRes += "::"+this.updateVmDevice(vName, server, deviceXml);
    							
							
							}
						}
					}
				}
			}
			
			sortie.output(document, new FileOutputStream(pathToXml));    
			String res = this.updateVmDesc(vName, server, pathToXml, "input"); 
			result += res + deviceRes;
		
		} catch (Exception e) {
			return result+"{\"action\":{\"result\":\"Error:"+e.toString()+"\"}}";
		}
		return result;
	}
    
    public String updateVmExtra(String vName, String server, String data) throws IOException {
    	String result = "vmInput::"+vName+"::"+server+"::";
		org.jdom.Document document;
		Element racine;
		Format xmlFormat = Format.getPrettyFormat();
		xmlFormat.setOmitDeclaration(true);
		XMLOutputter sortie = new XMLOutputter(xmlFormat);
		try {
			String relPath="resources/data/"+server+"/vm/configs/"+vName+"/"+vName+".xml";
			String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
			File xmlFile = new File(pathToXml);
			SAXBuilder sxb = new SAXBuilder();
			document = sxb.build(xmlFile);
			
			racine = document.getRootElement();
			Element metadata = racine.getChild("metadata");
		    if (metadata == null) {
                metadata = new Element("metadata");
				racine.addContent(metadata);
		    }            
            
            if (metadata.getChild("extra") != null) {
                Element extraToDel = metadata.getChild("extra");
                metadata.removeContent(extraToDel);
            }
            
            Element elExtra = new Element("extra");
            metadata.addContent(elExtra);
            
            JSONObject jo = new JSONObject(data);
            String varNotes = jo.get("notes").toString();
            Element elNotes = new Element("notes");
            elExtra.addContent(elNotes);
            elNotes.setText(varNotes);
            Element elNetworks = new Element("networks");
            elExtra.addContent(elNetworks);
            JSONArray nicArray = jo.getJSONArray("networks");
            int netCount = nicArray.length();
            for (int i = 0; i < netCount; i++) {
                JSONObject jVnet = nicArray.getJSONObject(i);
                if (jVnet.has("mac")) {
                    String mac = jVnet.get("mac").toString();
                    String ip = jVnet.get("ip").toString();
                    Element elVnet = new Element("vnet");
                    elVnet.setAttribute("mac",mac);
                    elVnet.setAttribute("ip",ip);
                    elNetworks.addContent(elVnet);
                }
            }
            
            JSONObject jOS = jo.getJSONObject("os");
            Element elOS = new Element("system");
            elOS.setAttribute("family",jOS.get("family").toString());
            elOS.setAttribute("arch",jOS.get("arch").toString());
            elOS.setAttribute("distro",jOS.get("distro").toString());
            elOS.setAttribute("name",jOS.get("name").toString());
            elOS.setAttribute("version",jOS.get("version").toString());
            elExtra.addContent(elOS);
              
            
            // transform DOM to XML
            Format format = Format.getPrettyFormat();
            format.setOmitDeclaration(true);
            
			sortie.output(document, new FileOutputStream(pathToXml));    
			String res = this.updateVmDesc(vName, server, pathToXml, "extra"); 
			result += res;
		
		} catch (Exception e) {
			return result+"{\"action\":{\"result\":\"Error:"+e.toString()+"\"}}";
		}
		return result;
	}

    public String updateVmDesc(String vName, String node, String path, String device) {
        String result = "";
        try {
            String xml = readFile(path);
            JSONObject joAction = new JSONObject();
            joAction.put("name", "update");
            joAction.put("vm", vName);
            joAction.put("xml", xml);
            joAction.put("device", device);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            String res = callOvnmanager(node, joAction.toString());
            result = res;
            
        } catch (Exception e) {
            log(ERROR, "create VM has failed", e);
            return result+e.toString();
        }
        return result;
    }
    public String updateVmLiveMemory(String vName, String node, String memory) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "setmem");
            joAction.put("vm", vName);
            joAction.put("memory", memory);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            String res = callOvnmanager(node, joAction.toString());
            result = res;
            
        } catch (Exception e) {
            log(ERROR, "create VM has failed", e);
            return result+e.toString();
        }
        return result;
    }
    public String updateVmLiveCpus(String vName, String node, String ncpu) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "setcpu");
            joAction.put("vm", vName);
            joAction.put("ncpu", ncpu);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            String res = callOvnmanager(node, joAction.toString());
            result = res;
            
        } catch (Exception e) {
            log(ERROR, "create VM has failed", e);
            return result+e.toString();
        }
        return result;
    }
    public String updateVmDevice(String vName, String node, String xml) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "live_update");
            joAction.put("vm", vName);
            joAction.put("xml", xml);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager(node, joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "create VM has failed", e);
            return result+e.toString();
        }
        return result;
    }
    public String createVmImage(String vName, String node, String image, String format, String size, String alloc) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "create_vdisk");
            joAction.put("vm", vName);
            JSONObject joDisk = new JSONObject();
            joDisk.put("image", image);
            joDisk.put("format", format);
            joDisk.put("size", size);
            joDisk.put("allocation", alloc);
            joAction.put("vdisk", joDisk);
            
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager(node, joAction.toString());
            return result;
            
        } catch (Exception e) {
            log(ERROR, "create image has failed", e);
            return e.toString();
        }
    }       

    public String deleteVmImage(String vName, String node, String image) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "delete_vdisk");
            joAction.put("vm", vName);
            joAction.put("vdisk", image);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager(node, joAction.toString());
            return result;
        } catch (Exception e) {
            log(ERROR, "create image has failed", e);
            return e.toString();
        }
    }       
    
    
    private String readFile(String file) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(file));
        String line = null;
        StringBuilder stringBuilder = new StringBuilder();
        try {
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line);
            }
        } finally {
            reader.close();
            return stringBuilder.toString();
        }
    }
    
    private String callOvnmanager(String node, String action) {
        String result= "";
        DatagramSocket socket = null;
        int serverPort = 9999;
        DatagramPacket packet2Send;
        DatagramPacket receivedPacket;
		InetAddress theServerAddress;
		byte[] outBuffer;
		byte[] inBuffer;    
        inBuffer = new byte[65536];
        outBuffer = new byte[8192];
        
        try {
            HttpSession session = RuntimeAccess.getInstance().getSession();
            String sessionUser = (String)session.getAttribute("User");
            if (sessionUser == null) {
                sessionUser = "administrator";
            }
            JSONObject joCmd = new JSONObject();
            JSONObject joAction = new JSONObject(action);
            joCmd.put("sender", sessionUser);
            joCmd.put("target", "VM");
            joCmd.put("node", node);
            joCmd.put("action", joAction);
            String output = joCmd.toString();
            
            socket = new DatagramSocket();
            InetAddress serverInet = InetAddress.getByName("localhost");
            socket.connect(serverInet,serverPort);
            outBuffer = output.getBytes();
            packet2Send = new DatagramPacket(outBuffer, outBuffer.length, serverInet, serverPort);
    		// send the data
			socket.send(packet2Send);
            
            receivedPacket = new DatagramPacket(inBuffer, inBuffer.length);
    		socket.receive(receivedPacket);
 
			// the server response is...
			result = new String(receivedPacket.getData(), 0, receivedPacket.getLength());
            session.setAttribute("LastActive", System.currentTimeMillis());
			socket.close();
            
            
        } catch (Exception e) {
            log(ERROR, "callOvnmanager", e);
            return e.toString();
        }
        return result;
    }

}
