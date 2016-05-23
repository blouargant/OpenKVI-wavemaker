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
import java.util.Date;
import javax.xml.parsers.*; 
import org.w3c.dom.*; 
import java.net.*;
import javax.servlet.http.HttpSession;
/**/


public class vmTools extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {
    /* Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;
     *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation
     */

    public vmTools() {
       super(INFO);
    }
    
    
    private String runCommand(String command) {
        String result = "";
        String error = "";
        String s = null;
        try {
 
            Process p = Runtime.getRuntime().exec(command);
            //p.waitFor();
            BufferedReader stdInput = new BufferedReader(new 
                 InputStreamReader(p.getInputStream()));

            BufferedReader stdError = new BufferedReader(new 
                 InputStreamReader(p.getErrorStream()));
            // read the output from the command
            while ((s = stdInput.readLine()) != null) {
                result = result + s;
            }
            
            // read any errors from the attempted command
            while ((s = stdError.readLine()) != null) {
                error = error + s;
            }
            if (error != "") {
                return error;
            } else {
                return result;
            }
        }
        catch (IOException e) {
            return "unknown error";
        }
    } 
    private String makeRelativeDirs(String directory) {
        try {
            String pathToRessource = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("resources/data/");
            String mkDir = pathToRessource+directory;
            (new File(mkDir)).mkdirs();
            return mkDir;
        } catch (Exception e) {
            return "Error";
        }
    } 
    public String sendCommand(String node, String vName, String command) {
        String result = command+"::";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "send");
            joAction.put("vm", vName);
            joAction.put("request", command);
            ArrayList<String> optList = new ArrayList<String>();
            if ((command.indexOf("pause") > -1) || (command.indexOf("suspend") > -1) ) {
                optList.add("progress=True");
            }
            joAction.put("options", optList);
            
            String msg = callOvnmanager(node, joAction.toString());
            result = command+"::"+msg;

        } catch (Exception e) {
            log(ERROR, "sendComand has failed", e);
            return command+"::"+node+"::"+vName+"::Error="+e.toString();
        }
        return result;
    }

    public String undefineVm(String node, String vm) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "undefine");
            joAction.put("vm", vm);
            //joAction.put("request", "start");
            ArrayList<String> optList = new ArrayList<String>();
            //optList.add("disks="+disks);
            joAction.put("options", optList);
            
            result = callOvnmanager(node, joAction.toString());

        } catch (Exception e) {
            log(ERROR, "undefineVm has failed", e);
            return vm+"=Error:"+e.toString();
        }
        return result;
    }
    public String removeVm(String node, String vm) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "remove");
            joAction.put("vm", vm);
            //joAction.put("request", "start");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager(node, joAction.toString());

        } catch (Exception e) {
            log(ERROR, "removeVm has failed", e);
            return vm+"=Error:"+e.toString();
        }
        return result;
    }
    
    public String startVm(String node, String vName) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "send");
            joAction.put("vm", vName);
            joAction.put("request", "start");
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("progress=True");
            joAction.put("options", optList);
            
            result = callOvnmanager(node, joAction.toString());

        } catch (Exception e) {
            log(ERROR, "startVm VM has failed", e);
            return node+"="+vName+"=Error:"+e.toString();
        }
        return result;
    }
    
    public String getVmDisplay(String node, String vName) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("vm", vName);
            joAction.put("request", "display");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager(node, joAction.toString());
                        
        } catch (Exception e) {
            log(ERROR, "getVmDisplay VM has failed", e);
            return "Error:"+e.toString();
        }
        return result;
    }

    public String getVmStatus(String node, String vName) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("vm", vName);
            joAction.put("request", "state");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager(node, joAction.toString());
                        
        } catch (Exception e) {
            log(ERROR, "getVmDisplay VM has failed", e);
            return "Error:"+e.toString();
        }
        return result;
    }
    
    public String migrateVm(String node, String vName, String target) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "migrate");
            joAction.put("vm", vName);
            joAction.put("dest", target);
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("progress=True");
            joAction.put("options", optList);
            result = callOvnmanager(node, joAction.toString());
                        
        } catch (Exception e) {
            log(ERROR, "migrateVm VM has failed", e);
            return vName+"::"+target+"::Error: "+e.toString();
        }
        return result;
    }    
        
    public String eraseVmStorage(String node, String vName, String vdisk) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "erase_vdisk");
            joAction.put("vm", vName);
            joAction.put("vdisk", vdisk);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            result = callOvnmanager(node, joAction.toString());
                        
        } catch (Exception e) {
            log(ERROR, "eraseVmStorage VM has failed", e);
            return vName+"::"+node+"::Error: "+e.toString();
        }
        return result;
    }   
    public String getVmListStatus(String node, String vmList) {
        String result = "";
        try {
            JSONObject joResult = new JSONObject();
            ArrayList<String> resList = new ArrayList<String>();
            java.util.StringTokenizer tokenizer = new java.util.StringTokenizer(vmList,"::");
            while(tokenizer.hasMoreTokens()){
			    String vName = tokenizer.nextToken();
                if (vName.length() > 0) {
                    JSONObject joAction = new JSONObject();
                    joAction.put("name", "get");
                    joAction.put("vm", vName);
                    joAction.put("request", "state");
                    ArrayList<String> optList = new ArrayList<String>();
                    joAction.put("options", optList);
            
                    result = callOvnmanager(node, joAction.toString());
                    resList.add(result);
                }
            }
            joResult.put("list", resList);
            result = joResult.toString();
            
        } catch (Exception e) {
            log(ERROR, "getVmDisplay VM has failed", e);
            return "Error:"+e.toString();
        }
        return result;
    }    
    public String getVmListScreenshot2(String node, String vmList, boolean wait) {
        String result = "";
        try {
            String relPath="resources/data/"+node+"/screenshots/";
            String path = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            JSONObject joLastMod = new JSONObject();
            
            if ( wait ) {                
                java.util.StringTokenizer token = new java.util.StringTokenizer(vmList,"::");
                while(token.hasMoreTokens()){
            	    String vm = token.nextToken();
                    if (vm.length() > 0) {
                        File f = new File(path+vm+"-168.png");
                        long lastMod = 0;
                        if (f.exists()) {
                            lastMod = f.lastModified();
                        }
                        joLastMod.put(vm, lastMod);
                    }
                }
                Thread.sleep(10000);
            }
            
            JSONObject joResult = new JSONObject();
            ArrayList<String> resList = new ArrayList<String>();
            java.util.StringTokenizer tokenizer = new java.util.StringTokenizer(vmList,"::");
            while(tokenizer.hasMoreTokens()){
    		    String vName = tokenizer.nextToken();
                if (vName.length() > 0) {
                    JSONObject joAction = new JSONObject();
                    joAction.put("name", "get");
                    joAction.put("vm", vName);
                    joAction.put("request", "screenshot");
                    ArrayList<String> optList = new ArrayList<String>();
                    optList.add("path="+path);
                    joAction.put("options", optList);

                    if ( wait ) { 
                        File image = new File(path+vName+"-168.png");
                        long imageMod = 0;
                        if (image.exists()) {
                            imageMod = image.lastModified();
                        }
                        long previousMod = Long.parseLong(joLastMod.get(vName).toString());
                        if (imageMod == previousMod) {
                            result = callOvnmanager(node, joAction.toString());
                        } else {
                            joAction.put("result", "already done");
                            result = joAction.toString();
                        }
                    } else {
                        result = callOvnmanager(node, joAction.toString());
                    }
                    resList.add(result);
                }
            }
            joResult.put("list", resList);
            result = joResult.toString();

        } catch (Exception e) {
            log(ERROR, "getScreenshot has failed", e);
            return node+"::Error="+e.toString();
        }
        return result;
    }
    public String getScreenshot(String node, String vName) {
        String result = "";
        try {
            String relPath="resources/data/"+node+"/screenshots/";
            String path = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("vm", vName);
            joAction.put("request", "screenshot");
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("path="+path);
            joAction.put("options", optList);
            
            String msg = callOvnmanager(node, joAction.toString());
            result = msg;

        } catch (Exception e) {
            log(ERROR, "getScreenshot has failed", e);
            return vName+"::Error="+e.toString();
        }
        return result;
    }
    public String createVm(String jsonString, String server, String ipaddr, String path) {
        String result = server+"::";
        String xml = "";
        try {
            xml = this.createVmXml(jsonString, server);
            JSONObject jo = new JSONObject(jsonString);
            String vName = jo.get("name").toString();
            result = result+vName+"::";
            
            JSONObject joChkAction = new JSONObject();
            joChkAction.put("name", "check");
            joChkAction.put("request", "exist");
            joChkAction.put("vm", vName);
            ArrayList<String> optChkList = new ArrayList<String>();
            joChkAction.put("options", optChkList);            
            String chkRes = callOvnmanager(server, joChkAction.toString());
            if (chkRes.indexOf("not found") > -1) {
            
                JSONArray diskArray = jo.getJSONArray("diskList");
                int resultCount = diskArray.length();
                for (int i = 0; i < resultCount; i++) {
                    JSONObject newDisk = diskArray.getJSONObject(i);
                    String device = newDisk.get("device").toString();
                    String type = newDisk.get("type").toString();
                    
                    if (device.equals("disk") && type.equals("file")) {
                        String image = newDisk.get("source").toString();
                        String format =  newDisk.get("format").toString();
                        String size = newDisk.get("size").toString();
                        String alloc = newDisk.get("alloc").toString();
                        this.createVmImage(vName, server, image, format, size, alloc);
                    }
                
                }
                
                String relPath="resources/data/"+server+"/vm/configs/"+vName+"/"+vName+".xml";
                String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
                
                
                JSONObject joAction = new JSONObject();
                joAction.put("name", "define");
                joAction.put("vm", vName);
                joAction.put("xml", xml);
                ArrayList<String> optList = new ArrayList<String>();
                joAction.put("options", optList);
                
                String res = callOvnmanager(server, joAction.toString());
                result = result+res;
                
                if (result.indexOf("Error") > -1) {
                    //Remove all disk images already created
                    for (int i = 0; i < resultCount; i++) {
                        JSONObject newDisk = diskArray.getJSONObject(i);
                        String device = newDisk.get("device").toString();
                        String type = newDisk.get("type").toString();
                        if (device.equals("disk") && type.equals("file")) {
                            String image = newDisk.get("source").toString();
                            this.deleteVmImage(vName, server, image);
                        }
                    }
                }
            } else {
                result = result+"Error: Virtual Machine already exist on node !";
            }
            
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
    public String getVmImageInfo(String vName, String node, String image) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "vdisk_info");
            joAction.put("vm", vName);
            joAction.put("vdisk", image);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager(node, joAction.toString());
            return result;
        } catch (Exception e) {
            log(ERROR, "getVmImageInfo has failed", e);
            return e.toString();
        }
    }
    public String createVmXml(String jsonString, String server) {
        String ret = "";
        
        
        ArrayList<String> ide = new ArrayList<String>(); 
        ide.add("hda");
        ide.add("hdb");
        ide.add("hdc");
        ide.add("hdd");
        ide.add("hde");
        ide.add("hdf");
        ArrayList<String> scsi = new ArrayList<String>(); 
        scsi.add("sda");
        scsi.add("sdb");
        scsi.add("sdc");
        scsi.add("sdd");
        scsi.add("sde");
        scsi.add("sdf");            

            
        try {
            JSONObject jo = new JSONObject(jsonString);
            // A JSONArray is an ordered sequence of values. Its external form is a 
            // string wrapped in square brackets with commas between the values.
            // Get the JSONObject value associated with the search result key.
            String varName = jo.get("name").toString();
            
            
            String domainType = jo.get("domain_type").toString();
            String varMem = jo.get("memory").toString();
            String varCpu = jo.get("vcpu").toString();
            String varArch = jo.get("arch").toString();
    
            // Get the JSONArray value associated with the Result key
            JSONArray diskArray = jo.getJSONArray("diskList");
            JSONArray nicArray = jo.getJSONArray("nicList");

            // Création d'un nouveau DOM
            DocumentBuilderFactory fabrique = DocumentBuilderFactory.newInstance();
            DocumentBuilder constructeur = fabrique.newDocumentBuilder();
            Document document = constructeur.newDocument();

            // Propriétés du DOM
            document.setXmlStandalone(true);

            // Création de l'arborescence du DOM
            Element domain = document.createElement("domain");
            document.appendChild(domain);
            domain.setAttribute("type",domainType);
            
            //racine.appendChild(document.createComment("Commentaire sous la racine"));
            Element name = document.createElement("name");
            domain.appendChild(name);
            name.setTextContent(varName);
            
            UUID varuid = UUID.randomUUID();
            Element uid = document.createElement("uuid");
            domain.appendChild(uid);
            uid.setTextContent(varuid.toString());
            
            Element memory = document.createElement("memory");
            domain.appendChild(memory);
            memory.setTextContent(varMem);
            
            Element currentMemory = document.createElement("currentMemory");
            domain.appendChild(currentMemory);
            currentMemory.setTextContent(varMem);
            
            Element vcpu = document.createElement("vcpu");
            domain.appendChild(vcpu);
            vcpu.setTextContent(varCpu);
            //<os>
            Element os = document.createElement("os");
            domain.appendChild(os);
            Element type = document.createElement("type");
            os.appendChild(type);
            type.setAttribute("arch",varArch);
            type.setAttribute("machine",jo.get("machine").toString());
            type.setTextContent(jo.get("machine_type").toString());
            
            JSONArray bootArray = jo.getJSONArray("bootList");
            int count = bootArray.length();
            for (int i = 0; i < count; i++) {
                JSONObject bootDev = bootArray.getJSONObject(i);
                Element boot = document.createElement("boot");
                os.appendChild(boot);
                boot.setAttribute("dev",bootDev.get("dev").toString());
            }
            
            Element bootmenu = document.createElement("bootmenu");
            os.appendChild(bootmenu);
            bootmenu.setAttribute("enable",jo.get("bootMenu").toString());
            //</os>
            //<features>
            Element features = document.createElement("features");
            domain.appendChild(features);
            JSONArray featureArray = jo.getJSONArray("features");
            int featureCount = featureArray.length();
            for (int i = 0; i < featureCount; i++) {
                JSONObject jasonFeature = featureArray.getJSONObject(i);
                String newFeature = jasonFeature.get("opt").toString();
                Element elFeature = document.createElement(newFeature);
                features.appendChild(elFeature);
            }
            //</features>
            Element clock = document.createElement("clock");
            domain.appendChild(clock);
            // Clock settings
            clock.setAttribute("offset",jo.get("clock_offset").toString());
            JSONArray timerArray = jo.getJSONArray("timers");
            for (int i = 0; i < timerArray.length(); i++) {
                JSONObject jsonTimer = timerArray.getJSONObject(i);
                Element elTimer = document.createElement("timer");
                clock.appendChild(elTimer);                
                elTimer.setAttribute("name", jsonTimer.get("name").toString());
                elTimer.setAttribute("present", jsonTimer.get("present").toString());
                elTimer.setAttribute("tickpolicy", jsonTimer.get("tickpolicy").toString());                               
            }            
            
            Element poweroff = document.createElement("on_poweroff");
            domain.appendChild(poweroff);
            poweroff.setTextContent(jo.get("on_poweroff").toString());
            Element reboot = document.createElement("on_reboot");
            domain.appendChild(reboot);
            reboot.setTextContent(jo.get("on_reboot").toString());
            Element crash = document.createElement("on_crash");
            domain.appendChild(crash);
            crash.setTextContent(jo.get("on_crash").toString());
            //<devices>
            Element devices = document.createElement("devices");
            domain.appendChild(devices);
            String varEmulator = jo.get("emulator").toString();
            Element emulator = document.createElement("emulator");
            devices.appendChild(emulator);
            emulator.setTextContent(varEmulator);
            
            
            int resultCount = diskArray.length();
            for (int i = 0; i < resultCount; i++) {
                Element disk = document.createElement("disk");
                devices.appendChild(disk);
                JSONObject newDisk = diskArray.getJSONObject(i);
                String diskType = newDisk.get("type").toString();
                Element driver = document.createElement("driver");
                Element target = document.createElement("target");
                disk.appendChild(driver);
                disk.appendChild(target);
                if (diskType.equals("file")) {
                    Element source = document.createElement("source");
                    disk.appendChild(source);
                    source.setAttribute("file", newDisk.get("source").toString());
                    driver.setAttribute("cache", "none");
                }

                disk.setAttribute("type", diskType);
                disk.setAttribute("device", newDisk.get("device").toString());
                driver.setAttribute("type", newDisk.get("format").toString());
                driver.setAttribute("name", newDisk.get("driver").toString());
                
                //String diskDev = ide.get(0);
                //ide.remove(0);
                String diskDev = newDisk.get("bus").toString();
                String diskBus = "";
                if (diskDev.indexOf("hd") > -1) {
                    diskBus = "ide";
                } else if (diskDev.indexOf("sd") > -1) {
                    diskBus = "scsi";
                } else if (diskDev.indexOf("vd") > -1) {
                    diskBus = "virtio";
                }
                
                target.setAttribute("dev", diskDev);
                target.setAttribute("bus", diskBus);
            
            }
            
            
            resultCount = nicArray.length();
            for (int i = 0; i < resultCount; i++) {
                JSONObject newNic = nicArray.getJSONObject(i);
                String macaddr = newNic.get("mac").toString().toLowerCase();
                if (macaddr.indexOf("automatic") > -1) {
                    Random rand = new Random();
                    macaddr = "52:54:00";
                    String hexa = Integer.toHexString(rand.nextInt(255));
                    macaddr += ":" + hexa;
                    hexa = Integer.toHexString(rand.nextInt(255));
                    macaddr += ":" + hexa;
                    hexa = Integer.toHexString(rand.nextInt(255));
                    macaddr += ":" + hexa;
                }            
                
                
                Element netIf = document.createElement("interface");
                devices.appendChild(netIf);
                Element netSource = document.createElement("source");
                Element netDevice = document.createElement("model");
                Element netMac = document.createElement("mac");
                netIf.appendChild(netSource);
                netIf.appendChild(netDevice);
                netIf.appendChild(netMac);
                netIf.setAttribute("type", "network");
                netSource.setAttribute("network", newNic.get("bridge").toString());
                String portgroup = newNic.get("portgroup").toString();
                if (! portgroup.equals("")) {
                    netSource.setAttribute("portgroup", portgroup);
                }
                netDevice.setAttribute("type", newNic.get("device").toString());
                netMac.setAttribute("address", macaddr);
            }
        
            JSONArray serialArray = jo.getJSONArray("serial");
            count = serialArray.length();
            for (int i = 0; i < count; i++) {
                JSONObject serialDev = serialArray.getJSONObject(i);
                Element serial = document.createElement("serial");
                devices.appendChild(serial);
                serial.setAttribute("type", serialDev.get("type").toString());
                Element target = document.createElement("target");
                serial.appendChild(target);
                target.setAttribute("port", serialDev.get("port").toString());
            }
        
        
            JSONArray consoleArray = jo.getJSONArray("console");
            count = consoleArray.length();
            for (int i = 0; i < count; i++) {
                JSONObject consoleDev = consoleArray.getJSONObject(i);
                Element console = document.createElement("console");
                devices.appendChild(console);
                console.setAttribute("type", "pty");
                Element target = document.createElement("target");
                console.appendChild(target);
                target.setAttribute("port", consoleDev.get("port").toString());
                target.setAttribute("type", consoleDev.get("type").toString());
            }
        
            JSONArray inputArray = jo.getJSONArray("input");
            count = inputArray.length();
            for (int i = 0; i < count; i++) {
                JSONObject inputDev = inputArray.getJSONObject(i);
                Element input = document.createElement("input");
                devices.appendChild(input);
                input.setAttribute("type", inputDev.get("type").toString());
                input.setAttribute("bus", inputDev.get("bus").toString());
            }
            
            JSONArray graphicsArray = jo.getJSONArray("graphics");
            count = graphicsArray.length();
            for (int i = 0; i < count; i++) {
                JSONObject graphicsDev = graphicsArray.getJSONObject(i);
                Element graphics = document.createElement("graphics");
                devices.appendChild(graphics);
                graphics.setAttribute("type", graphicsDev.get("type").toString());
                graphics.setAttribute("port", graphicsDev.get("port").toString());
                graphics.setAttribute("autoport", graphicsDev.get("autoport").toString());
                graphics.setAttribute("listen",graphicsDev.get("listen").toString());
                graphics.setAttribute("keymap", graphicsDev.get("keymap").toString());
            }

            JSONArray soundArray = jo.getJSONArray("sound");
            count = soundArray.length();
            for (int i = 0; i < count; i++) {
                JSONObject soundDev = soundArray.getJSONObject(i);
                Element sound = document.createElement("sound");
                devices.appendChild(sound);
                sound.setAttribute("model", soundDev.get("model").toString());
            }
            //sound.setAttribute("model", "ac97");
            
            JSONArray videoArray = jo.getJSONArray("video");
            count = videoArray.length();
            for (int i = 0; i < count; i++) {
                JSONObject videoDev = videoArray.getJSONObject(i);
                Element video = document.createElement("video");
                devices.appendChild(video);
                Element model = document.createElement("model");
                video.appendChild(model);
                model.setAttribute("model", videoDev.get("type").toString());
                model.setAttribute("model", videoDev.get("vram").toString());
                model.setAttribute("model", videoDev.get("heads").toString());
            }

            //write the content into xml file
            this.makeRelativeDirs("/"+server+"/vm/configs/"+varName);
            String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("resources/data/"+server+"/vm/configs/"+varName+"/"+varName+".xml"); 
            File xmlOutput = new File(pathToXml);
            
            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

	        DOMSource source = new DOMSource(document);
	        StreamResult result =  new StreamResult(xmlOutput);
	        transformer.transform(source, result);
            
            StringWriter stw = new StringWriter();
            transformer.transform(source, new StreamResult(stw));
            ret = stw.toString();
      
        } catch (Exception e) {
            log(ERROR, "create xml file has failed", e);
            return e.toString();
        }
        return ret;
    }
    public String readVmXml(String vmName, String server) throws IOException {
        String result = null;
        String error = "";
        try {
            //DocumentBuilderFactory fabrique = DocumentBuilderFactory.newInstance();
            //DocumentBuilder constructeur = fabrique.newDocumentBuilder();
            String relPath="resources/data/"+server+"/vm/configs/"+vmName+"/"+vmName+".xml";
            String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            String content = this.readFile(pathToXml);  
            XML xml = new XML();
            JSONObject jsonContent = xml.toJSONObject(content);
            result = jsonContent.toString();
        } catch (Exception e) {
            return vmName+" Error: "+e.toString();
        }
        return result;
    }
    public String readVmXmlActive(String vmName, String server) throws IOException {
        String result = null;
        String error = "";
        try {
            //DocumentBuilderFactory fabrique = DocumentBuilderFactory.newInstance();
            //DocumentBuilder constructeur = fabrique.newDocumentBuilder();
            String relPath="resources/data/"+server+"/vm/configs/"+vmName+"/"+vmName+".xml-active";
            String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            String content = this.readFile(pathToXml);  
            XML xml = new XML();
            JSONObject jsonContent = xml.toJSONObject(content);
            result = jsonContent.toString();
        } catch (Exception e) {
            return vmName+" Error: "+e.toString();
        }
        return result;
    }
    public String extendedVmXml(String vmName, String server, String ipaddr) throws IOException {
        String result = null;
        String error = "";
        try {
            //DocumentBuilderFactory fabrique = DocumentBuilderFactory.newInstance();
            //DocumentBuilder constructeur = fabrique.newDocumentBuilder();
            String relPath="resources/data/"+server+"/vm/configs/"+vmName+"/"+vmName+".xml";
            String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            String content = this.readFile(pathToXml);  
            XML xml = new XML();
            JSONObject jsonContent = xml.toJSONObject(content);
            result = jsonContent.toString();
            
            JSONObject domainInfo = jsonContent.getJSONObject("domain");
            JSONObject deviceObj = domainInfo.getJSONObject("devices");       
            
            JSONArray diskArray = deviceObj.optJSONArray("disk");
            if (diskArray == null) {
                JSONObject diskObj = deviceObj.optJSONObject("disk");
                if (diskObj != null) {
                    JSONObject diskSource = diskObj.optJSONObject("source");
                    String diskType = diskObj.get("type").toString();
                    if ((diskType.indexOf("file") > -1) && (diskSource != null)) {
                        String diskFile = diskSource.get("file").toString();                        
                        String strImageInfo = this.getVmImageInfo(vmName, server, diskFile);
                        JSONObject jsonRes = new JSONObject(strImageInfo);
                        JSONObject jsonInfo = jsonRes.getJSONObject("action").getJSONObject("result");
                        diskObj.put("format", jsonInfo.get("format").toString());
                        diskObj.put("vsize", jsonInfo.get("vsize").toString());
                        diskObj.put("rsize", jsonInfo.get("rsize").toString());
                        String resError = jsonInfo.get("error").toString();
                        if (resError.length() != 0 ) {
                            error += resError+". ";
                        }
                    }
                }
            } else {
                int diskCount = diskArray.length();
                for (int diski = 0; diski < diskCount; diski++) {
                    JSONObject newDisk = diskArray.getJSONObject(diski); 
                    JSONObject diskSource = newDisk.optJSONObject("source");
                    String diskType = newDisk.get("type").toString();
                    if ( (diskType.indexOf("file") > -1) && (diskSource != null) ) {
                        String diskFile = diskSource.get("file").toString();
                        String strImageInfo = this.getVmImageInfo(vmName, server, diskFile);
                        JSONObject jsonRes = new JSONObject(strImageInfo);
                        JSONObject jsonInfo = jsonRes.getJSONObject("action").getJSONObject("result");
                        newDisk.put("format", jsonInfo.get("format").toString());
                        newDisk.put("vsize", jsonInfo.get("vsize").toString());
                        newDisk.put("rsize", jsonInfo.get("rsize").toString());
                        String resError = jsonInfo.get("error").toString();
                        if (resError.length() != 0 ) {
                            error += resError+". ";
                        }
                    }
                }
            }
            
            jsonContent.put("error", error);
            jsonContent.put("node", server);
            result = jsonContent.toString();
            
        } catch (Exception e) {
            log(ERROR, "extendedVmXml", e);
            return vmName+"::"+server+"::Error:"+e.toString();
        }
        return result;
    }
    
    public String getVmConfig(String vmName, String server) {
        String result = "";
        try {
            String relPath="resources/data/"+server+"/vm/configs/"+vmName+"/"+vmName+".xml";
            String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            File xmlFile = new File(pathToXml);
            long lastMod = xmlFile.lastModified();
            Date date = new Date();
            long currentTime = date.getTime();
            long diff = currentTime - lastMod;
            if ((diff >= 60000) || (diff == currentTime)) {           
        
                JSONObject joAction = new JSONObject();
                joAction.put("name", "get");
                joAction.put("vm", vmName);
                joAction.put("request", "xml");
                ArrayList<String> optList = new ArrayList<String>();
                optList.add("path="+pathToXml);
                optList.add("notify=no");
                joAction.put("options", optList);
            
                String msg = callOvnmanager(server, joAction.toString());
                if (msg.indexOf("Error") > -1) {
                    JSONObject joResult = new JSONObject(msg);
                    JSONObject joResAction = joResult.getJSONObject("action");
                    result = vmName+"::"+server+"::"+joResAction.get("result").toString();
                
                } else {
                    result = readVmXml(vmName, server);  
                }
            } else {
                result = readVmXml(vmName, server);  
            }
                
        } catch (Exception e) {
            log(ERROR, "getVmConfig", e);
            return vmName+"::"+server+"::Error:"+e.toString();
        }
        return result;
    }
    
    public String getVmExtendedConfig(String vmName, String server, String ipaddr) {
        String result = "";
        try {
            String relPath="resources/data/"+server+"/vm/configs/"+vmName+"/"+vmName+".xml";
            String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
    
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("vm", vmName);
            joAction.put("request", "xml");
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("path="+pathToXml);
            optList.add("notify=no");
            joAction.put("options", optList);
            
            String msg = callOvnmanager(server, joAction.toString());
            if (msg.indexOf("Error") > -1) {
                JSONObject joResult = new JSONObject(msg);
                JSONObject joResAction = joResult.getJSONObject("action");
                result = vmName+"::"+server+"::"+joResAction.get("result").toString();
                
            } else {
                result = extendedVmXml(vmName, server, ipaddr);  
            }
        
        } catch (Exception e) {
            log(ERROR, "getVmExtendedConfig", e);
            return vmName+"::"+server+"::Error:"+e.toString();
        }
        return result;
    }
    public String getVmVnics(String node, String vName) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("vm", vName);
            joAction.put("request", "vnics");
            ArrayList<String> optList = new ArrayList<String>();
            //optList.add("progress=True");
            joAction.put("options", optList);
            result = callOvnmanager(node, joAction.toString());
                        
        } catch (Exception e) {
            log(ERROR, "getVmVnics has failed", e);
            return vName+"::"+"Error: "+e.toString();
        }
        return result;
    }
    public String moveVmNic(String node, String vName, String data) throws IOException {
    String result = "";
    // data : {"mac": mac, "vswitch":source, "portgroup":portgroup}
    try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "move_vnic");
            joAction.put("vm", vName);
            joAction.put("vnic", data);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            String res = callOvnmanager(node, joAction.toString());
            result = res;
        } catch (Exception e) {
            return result+"Error="+e.toString();
        }
        return result;
    }  
    public String ImportVmConfig(String ipaddr, String jsonString, String server) {
        String result = "";
        JSONObject joResult = new JSONObject();
        JSONArray vmInfo = new JSONArray();
        try {
            JSONArray jo = new JSONArray(jsonString);
            int count = jo.length();
            for (int i = 0; i < count; i++) {
                JSONObject newVm = jo.getJSONObject(i);
                String vName = newVm.get("name").toString();
                this.makeRelativeDirs("/"+server+"/vm/configs/"+vName);
                String relPath="resources/data/"+server+"/vm/configs/"+vName+"/"+vName+".xml";
                String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            
                JSONObject joAction = new JSONObject();
                joAction.put("name", "get");
                joAction.put("vm", vName);
                joAction.put("request", "xml");
                ArrayList<String> optList = new ArrayList<String>();
                optList.add("path="+pathToXml);
                optList.add("notify=no");
                joAction.put("options", optList);
                
                String msg = callOvnmanager(server, joAction.toString());
                String vmStringInfo = extendedVmXml(vName, server, ipaddr);
                
                JSONObject vmJsonInfo = new JSONObject(vmStringInfo); 
                vmJsonInfo.put("node", server);
                vmInfo.put(vmJsonInfo);
            }  
            joResult.put("vms", vmInfo);
            result = joResult.toString();
        
        } catch (Exception e) {
            log(ERROR, "ImportVmConfig", e);
            return result+"Error:"+e.toString();
        }
        return result;
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
        /*
        if (this.user == null) {
            this.user = "admin";
        }*/
        
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
            String actionName = joAction.get("name").toString();
            /*if (actionName.equals("migrate")) {
                socket.setSoTimeout(600000);
            } else {
                socket.setSoTimeout(60000);
            }*/
            socket.setSoTimeout(60000);
            
            InetAddress serverInet = InetAddress.getByName("localhost");
            socket.connect(serverInet,serverPort);
            outBuffer = output.getBytes();
            packet2Send = new DatagramPacket(outBuffer, outBuffer.length, serverInet, serverPort);
    		
            try {
                // send the data
			    socket.send(packet2Send);
                receivedPacket = new DatagramPacket(inBuffer, inBuffer.length);
    	    	socket.receive(receivedPacket);
    			// the server response is...
	    		result = new String(receivedPacket.getData(), 0, receivedPacket.getLength());
                session.setAttribute("LastActive", System.currentTimeMillis());
            } catch (Exception excep) {
                String msg = excep.getMessage();
                //String msg = excep.toString();
                joCmd.remove("action");
                joAction.put("result", "Error:"+msg);
                joCmd.put("action", joAction);
                result = joCmd.toString();
            }
			socket.close();
            
            
        } catch (Exception e) {
            log(ERROR, "callOvnmanager", e);
            return e.toString();
        }
        return result;
    }
    public String virtop(String node, String vm, String ipaddr) {
        String result = vm+"=";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "virtop");
            joAction.put("vm", vm);
            ArrayList<String> optList = new ArrayList<String>();
            //optList.add("progress=True");
            joAction.put("options", optList);
            String output = callOvnmanager(node, joAction.toString());
            JSONObject jsonRes = new JSONObject(output);
            String info = jsonRes.getJSONObject("action").get("result").toString();
            result += info;
        } catch (Exception e) {
            log(ERROR, "virtop has failed", e);
            return vm+"=Error:"+e.toString();
        }
        return result;
    }


}
