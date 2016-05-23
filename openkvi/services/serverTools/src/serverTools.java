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
import org.w3c.dom.*; 
import org.xml.sax.*; 
import java.io.*; 
import java.util.ArrayList;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.OutputKeys;
import java.util.Comparator;
import java.util.regex.Pattern;
import java.util.UUID;
import java.util.Date;
import java.util.List;
import java.util.LinkedList;
import java.io.*;
import java.net.*;
import javax.servlet.http.HttpSession;


public class serverTools extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {
    /* Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;
     *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation
     */
     
    public serverTools() {
       super(INFO);
    }
    
    public String getLocalHostname() {
        //try {
        //    InetAddress addr = InetAddress.getLocalHost();
        //    hostname = addr.getHostName();
        //} catch (UnknownHostException e) {  
        //    hostname = "Data Center:";
        //}
        String hostname = this.runCommand("hostname");
        return hostname;
    }
    
    private String runCommand(String command) {
        String result = "";
        String error = "";
        String s = null;
        try {
            Process p = Runtime.getRuntime().exec(command);            
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
    
    public String connectToServer(String ipaddr,String server, String force) {
        String action = "connect";
        return _connectToServer(ipaddr, server, force, action);
    }
    
    public String reconnectToServer(String ipaddr,String server, String force) {
        String action = "reconnect";
        return _connectToServer(ipaddr, server, force, action);
    }
    
    private String _connectToServer(String ipaddr,String server, String force, String action) {
        String result = "connectToServer="+server+"::";
        
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", action);
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("ip="+ipaddr);
            optList.add("force="+force);
            joAction.put("options", optList);
            
            String msg = callOvnmanager(server, joAction.toString());            
            result += msg;
            
        }
            catch (Exception e) {
            log(ERROR, "_connectToServer has failed", e);
            return "connectToServer="+server+"::Failed::"+e.toString();
            
        }
        return result;
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

    public String getNodesCoordinates(String nodeList) throws IOException { 
        try {
            JSONObject joResult = new JSONObject();
            JSONArray resList = new JSONArray();
            java.util.StringTokenizer tokenizer = new java.util.StringTokenizer(nodeList,"::");
            while(tokenizer.hasMoreTokens()){
    		    String node = tokenizer.nextToken();
                if (node.length() > 0) {
                    String xml = this.readXml(node);
                    JSONObject jo = new JSONObject(xml);
                    String desc = jo.optString("description", "");
                    JSONObject joRes = new JSONObject();
                    JSONObject joCoord = jo.getJSONObject("coordinates");
                    joRes.put("node", node);
                    joRes.put("latitude", joCoord.get("latitude").toString());
                    joRes.put("longitude", joCoord.get("longitude").toString());
                    joRes.put("desc", desc);
                    resList.put(joRes);
                }
            }
            joResult.put("list", resList);
            String result = joResult.toString();
            return result;
            
        } catch (Exception e) {
            return "Error";
        }
    }
        
        
    public String readXml(String server) throws IOException {
        String result = null;
        
        try {
            JSONObject jo = new JSONObject();
            JSONArray storagesArray = new JSONArray();
            JSONArray switchesArray = new JSONArray();
            
            DocumentBuilderFactory fabrique = DocumentBuilderFactory.newInstance();
            DocumentBuilder constructeur = fabrique.newDocumentBuilder();
            String relPath="resources/data/"+server+"/config/"+server+".xml";
            String pathToXml = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            File xml = new File(pathToXml);
            Document doc = constructeur.parse(xml);
            doc.getDocumentElement().normalize();
    
            NodeList nList = doc.getElementsByTagName("name");
            Node n = nList.item(0);
            String name = "";
            if (n.getNodeType() == Node.ELEMENT_NODE) {
                name = n.getTextContent().trim();
            }
            nList = doc.getElementsByTagName("ip");
            n = nList.item(0);
            String ipaddr = "";
            if (n.getNodeType() == Node.ELEMENT_NODE) {
                ipaddr = n.getTextContent().trim();
            }
            nList = doc.getElementsByTagName("hypervisor");
            n = nList.item(0);
            String hypervisor = "";
            if (n.getNodeType() == Node.ELEMENT_NODE) {
                hypervisor = n.getTextContent().trim();
            }
            nList = doc.getElementsByTagName("transport");
            n = nList.item(0);
            String transport = "";
            if (n.getNodeType() == Node.ELEMENT_NODE) {
                transport = n.getTextContent().trim();
            }
            nList = doc.getElementsByTagName("vmconfigs");
            n = nList.item(0);
            String vmconfigs = "";
            if (n.getNodeType() == Node.ELEMENT_NODE) {
                vmconfigs = n.getTextContent().trim();
            }
            nList = doc.getElementsByTagName("description");
            String description = "";
            if (nList.getLength() > 0) {
                n = nList.item(0);
                if (n.getNodeType() == Node.ELEMENT_NODE) {
                    description = n.getTextContent().trim();
                }
            }
            
            
            jo.put("name", name);
            jo.put("ip", ipaddr);
            jo.put("hypervisor", hypervisor);
            jo.put("transport", transport);
            jo.put("description", description);
            jo.put("vmconfigs", vmconfigs);
            
            nList = doc.getElementsByTagName("coordinates");
            String building = "";
            String street = "";
            String city = "";
            String latitude = "";
            String longitude = "";
            if (nList.getLength() > 0) {
                n = nList.item(0);
                if (n.getNodeType() == Node.ELEMENT_NODE) {
                    Element CoordElement = (Element) n;
                    building = CoordElement.getAttribute("building");
                    street = CoordElement.getAttribute("street");
                    city = CoordElement.getAttribute("city");
                    latitude = CoordElement.getAttribute("latitude");
                    longitude = CoordElement.getAttribute("longitude");
                }
            }
            JSONObject CoordJo = new JSONObject();
            CoordJo.put("building", building);
            CoordJo.put("street", street);
            CoordJo.put("city", city);
            CoordJo.put("latitude", latitude);
            CoordJo.put("longitude", longitude);
            jo.put("coordinates", CoordJo);
            
            nList = doc.getElementsByTagName("repository");
            for (int i = 0; i < nList.getLength(); i++) {
                n = nList.item(i);
                JSONObject diskJo = new JSONObject(); 
                if (n.getNodeType() == Node.ELEMENT_NODE) {
                    Element repoElement = (Element) n;
                    String repoName = repoElement.getAttribute("name");
                    String repoType = repoElement.getAttribute("type");
                    NodeList nListPath = repoElement.getElementsByTagName("target");
                    Node nPath = nListPath.item(0);
                    String path = nPath.getTextContent().trim();
                    NodeList nListSource = repoElement.getElementsByTagName("source");
                    Node nSource = nListSource.item(0);
                    String source = nSource.getTextContent().trim();
                    
                    diskJo.put("name", repoName);
                    diskJo.put("type", repoType);
                    diskJo.put("target", path);
                    diskJo.put("source", source);
                }
                storagesArray.put(diskJo);
            }
            jo.put("storages", storagesArray);
            
            JSONArray networkArray = new JSONArray();
            nList = doc.getElementsByTagName("network");
            for (int i = 0; i < nList.getLength(); i++) {
                n = nList.item(i);
                JSONObject networkJo = new JSONObject(); 
                if (n.getNodeType() == Node.ELEMENT_NODE) {
                    Element networkElement = (Element) n;
                    String netName = networkElement.getAttribute("name");
                    String netNaming = networkElement.getAttribute("naming");
                    String netType = networkElement.getAttribute("type");
                    networkJo.put("name", netName);
                    networkJo.put("naming", netNaming);
                    networkJo.put("type", netType);
                    
                    JSONArray targetArray = new JSONArray();
                    NodeList nListTarget = networkElement.getElementsByTagName("target");
                    for (int j = 0; j < nListTarget.getLength(); j++) {
                        Node nTarget = nListTarget.item(j);
                        if (nTarget.getNodeType() == Node.ELEMENT_NODE) {
                            Element targetElement = (Element) nTarget;
                            JSONObject targetJo = new JSONObject();                        
                            NodeList nTargetListName = targetElement.getElementsByTagName("name");
                            Node nTargetName = nTargetListName.item(0);
                            NodeList nTargetListDesc = targetElement.getElementsByTagName("desc");
                            Node nTargetDesc = nTargetListDesc.item(0);
                            String targetName = nTargetName.getTextContent().trim();
                            String targetDesc = nTargetDesc.getTextContent().trim();
                            targetJo.put("name", targetName);
                            targetJo.put("desc", targetDesc);
                            targetArray.put(targetJo);
                        }
                    }
                    networkJo.put("targets", targetArray);
                }
                networkArray.put(networkJo);
            }
            jo.put("networks", networkArray);
            

            result = jo.toString();
            //result = strName;
        } catch (Exception e) {
            log(ERROR, "readXml has failed", e);
        }
        return result;
    }
    public String updateServerConfig(String jsonString, String server, String log) {
        String result = server+"="+log+"=";
        try {
            result += this.createServerConfig(server, jsonString);
    
        } catch (Exception e) {
            log(ERROR, "Xml file update has failed", e);
            return result+"Error="+e.toString();
        }
        return result;
    }
    
    public String createServerConfig(String node, String jsonString) {
        String result = node+"::";
        try {
            String ret;
            JSONObject jo = new JSONObject(jsonString);
            UUID uid = UUID.randomUUID();
        
            String varName = node;
            String varIP = jo.get("ip").toString();
            String varHyp = jo.get("hypervisor").toString();
            String varVmconfigs = jo.get("vmconfigs").toString();
            String varTransport = jo.get("transport").toString();
            String varDesc = jo.get("description").toString();
            // make sure that remote directory exist
            // Get the JSONArray value associated with the Result key
            JSONArray storageArray = jo.getJSONArray("storages");
            String configDir = this.makeRelativeDirs("/"+varName+"/config");            
            this.makeRelativeDirs("/"+varName+"/screenshots");
            this.makeRelativeDirs("/"+varName+"/vm/configs");
            
            // Création d'un nouveau DOM
            DocumentBuilderFactory fabrique = DocumentBuilderFactory.newInstance();
            DocumentBuilder constructeur = fabrique.newDocumentBuilder();
            Document document = constructeur.newDocument();

            // Propriétés du DOM
            document.setXmlStandalone(true);

            // Création de l'arborescence du DOM
            Element server = document.createElement("server");
            document.appendChild(server);
             
            //racine.appendChild(document.createComment("Commentaire sous la racine"));
            Element name = document.createElement("name");
            server.appendChild(name);
            name.setTextContent(varName);
            
            Element ip = document.createElement("ip");
            server.appendChild(ip);
            ip.setTextContent(varIP);
            
            Element hypervisor = document.createElement("hypervisor");
            server.appendChild(hypervisor);
            hypervisor.setTextContent(varHyp);
            
            Element transport = document.createElement("transport");
            server.appendChild(transport);
            transport.setTextContent(varTransport);
            
            Element descEl = document.createElement("description");
            server.appendChild(descEl);
            descEl.setTextContent(varDesc);
            
            
            
            
            Element vmconfigs = document.createElement("vmconfigs");
            server.appendChild(vmconfigs);
            vmconfigs.setTextContent(varVmconfigs);
            
            JSONObject coordinatesObj = jo.getJSONObject("coordinates");
            Element coordinatesEl = document.createElement("coordinates");
            server.appendChild(coordinatesEl);
            coordinatesEl.setAttribute("building", coordinatesObj.get("building").toString());
            coordinatesEl.setAttribute("street", coordinatesObj.get("street").toString());
            coordinatesEl.setAttribute("city", coordinatesObj.get("city").toString());
            coordinatesEl.setAttribute("latitude", coordinatesObj.get("latitude").toString());
            coordinatesEl.setAttribute("longitude", coordinatesObj.get("longitude").toString());
            
            //<storages>
            Element storages = document.createElement("storages");
            server.appendChild(storages);
                        
            
            int resultCount = storageArray.length();
            for (int i = 0; i < resultCount; i++) {
                Element repository = document.createElement("repository");
                storages.appendChild(repository);
                Element path = document.createElement("target");
                repository.appendChild(path);
                
                JSONObject newStorage = storageArray.getJSONObject(i);
                String storageName = newStorage.get("name").toString();
                String storagePath = newStorage.get("target").toString();
                storageName = storageName.replaceAll(" ","_");
                storagePath = storagePath.replaceAll(" ","_");
                
                repository.setAttribute("type", newStorage.get("type").toString());
                repository.setAttribute("name", storageName);
                path.setTextContent(storagePath);
                
                Element source = document.createElement("source");
                repository.appendChild(source);
                String storageSource = newStorage.get("source").toString();
                source.setTextContent(storageSource);
                
                String localStorageDir =this.makeRelativeDirs("/"+varName+"/vm/storages/"+storageName);
                if ( localStorageDir == "Error" ) {
                    return result+"Error: cannot create "+varName+"/vm/storages/"+storageName;
                }
            }
            //</storages>
            // Get network information (look for bridges)
            Element networks = document.createElement("networks");
            server.appendChild(networks);
                        
            JSONObject joAction = new JSONObject();
            joAction.put("name", "add");
            joAction.put("driver", varHyp);
            joAction.put("transport", varTransport);
            joAction.put("description", varDesc);
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("ip="+varIP);
            String varPasswd = "";
            varPasswd = jo.opt("password").toString();
            if (varPasswd.length() > 0) {
                optList.add("exchange_keys="+varPasswd);
            }
            joAction.put("options", optList);
            String msg = callOvnmanager(node, joAction.toString());
            
            JSONObject joMsg = new JSONObject(msg);
            JSONObject joActionRes = joMsg.getJSONObject("action");
            result += joActionRes.get("result").toString();
            //write the content into xml file
        
            String pathToXml = configDir+"/"+varName+".xml"; 
            File xmlOutput = new File(pathToXml);
        
            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");

            DOMSource source = new DOMSource(document);
    	    StreamResult streamRes =  new StreamResult(xmlOutput);
    	    transformer.transform(source, streamRes);
      
        } catch (Exception e) {
            log(ERROR, "create xml file has failed", e);
            return result+"Error: "+e.toString();
        }
        //ret = "done";
        return result;
    }

    public String deleteServer(String name) {
        String result= "";
        String workingDir = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("resources/data/");
        try {
            //String vmConfigs = workingDir+"/"+name+"/vm/configs/";
            //this.runCommand("fusermount -u "+vmConfigs);
            
            this.deleteDirectory(name);
            
            JSONObject joAction = new JSONObject();
            joAction.put("name", "remove");
            joAction.put("driver", "");
            joAction.put("transport", "");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager(name, joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "create xml file has failed", e);
            return e.toString();
        }
        return result;
    }

    public String getServerInfo(String node) {
        String result = "";
        
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "info");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
                
            result = callOvnmanager(node, joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "getServerInfo", e);
            return e.toString();
        }
        return result;
    }
    public String getServerRessources(String node) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "ressources");
            ArrayList<String> optList = new ArrayList<String>();
            //optList.add("storages="+storages);
            joAction.put("options", optList);
                
            result = callOvnmanager(node, joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "getServerRessources", e);
            return e.toString();
        }
        return result;
    }
    
    public String getServerCapabilities(String node) {
        String result= node;
        try {
            String relPath="resources/data/"+node+"/config/";
            String path = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            String capaPath = path + "/capabilities.xml";
            String keymapPath = path + "/keymaps.lst";
            
            File xmlFile = new File(capaPath);
            long lastMod = xmlFile.lastModified();
            Date date = new Date();
            long currentTime = date.getTime();
            long diff = currentTime - lastMod;
            if ((diff >= 3600000) || (diff == currentTime)) { 
                JSONObject joAction = new JSONObject();
                joAction.put("name", "get");
                joAction.put("request", "capabilities");
                ArrayList<String> optList = new ArrayList<String>();
                optList.add("path="+path);
                joAction.put("options", optList);
                
                String msg = callOvnmanager(node, joAction.toString());
                if ( msg.indexOf("Error") > 0 ) {
                    result = node+"::"+msg;
                    return result;
                }
                /*
                JSONObject joResult = new JSONObject(msg);
                JSONObject joActResult = joResult.getJSONObject("action");
                JSONArray keymaps = joActResult.getJSONArray("result");
                */
                String capa = this.readFile(capaPath);  
                String keymaps = this.readFile(keymapPath);
                XML xml = new XML();
                JSONObject jCapa = xml.toJSONObject(capa);
                jCapa.put("keymaps", keymaps);
                result = jCapa.toString();
            } else {
                String capa = this.readFile(capaPath);  
                String keymaps = this.readFile(keymapPath);
                XML xml = new XML();
                JSONObject jCapa = xml.toJSONObject(capa);
                jCapa.put("keymaps", keymaps);
                result = jCapa.toString();
            }
            
        } catch (Exception e) {
            log(ERROR, "getServerCapabilities", e);
            return e.toString();
        }
        return result;
    }
    public String listAllVms(String node) {
        String result= node;
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "vm_list");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager(node, joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "listAllVms", e);
            return e.toString();
        }
        return result;
    }
    public String importLocalVms(String node, String vmList) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "local_import");
            joAction.put("data", vmList);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
                
            result = callOvnmanager(node, joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "importLocalVms", e);
            return e.toString();
        }
        return result;
    }
    
    public String getVmListScreenshot(String node, String vmList) {
        String result= node;
        String relPath="resources/data/"+node+"/screenshots/";
        String path = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
        JSONObject joLastMod = new JSONObject();
        
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "screenshots");
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("path="+path);
            optList.add("list="+vmList);
            joAction.put("options", optList);
            
            result = callOvnmanager(node, joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "getVmListScreenshot", e);
            return e.toString();
        }
        return result;
    }
    
    public String getServerNetworkInfos(String node,Boolean force) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "networks");
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("force="+force.toString());
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
        } catch (Exception e) {
            log(ERROR, "getServerNetworkInfos", e);
            return "Failed: "+e.toString();
        }
        return result;
    }     
    public String getVmIp(String node, String vm, String mac, String range) {
        String result= "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "vnic_ip");
            joAction.put("vm", vm);
            joAction.put("mac", mac);
            joAction.put("range", range);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
        } catch (Exception e) {
            log(ERROR, "getVmIp", e);
            result += "Failed: "+e.toString();
        }
        return result;
    }  
    /*
    public String getRunningOs(String ipaddr, String vName) {
        String result= "";
        sshClient sshc = new sshClient();
        try {
            String cmd = "virt-inspector2 -d "+vName;
            String infos = sshc.executeRemoteCommand(ipaddr, cmd);
            XML xml = new XML();
            JSONObject jInfos = xml.toJSONObject(infos);
            result = jInfos.toString();
            
        } catch (Exception e) {
            log(ERROR, "getRunningOs", e);
            result += "Failed: "+e.toString();
        }
        return result;
    } 
    */
    public String getRunningOs(String node, String vName) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "inspect_vm");
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("vm="+vName);
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
        } catch (Exception e) {
            log(ERROR, "getRunningOs", e);
            return "Failed: "+e.toString();
        }
        return result;
    }     

    public String createNetwork(String node, String data) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "network");
            joAction.put("request", "create");
            joAction.put("desc", data);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
    
    
            result = callOvnmanager(node, joAction.toString());
    
        } catch (Exception e) {
            log(ERROR, "createNetwork failed", e);
            return e.toString();
        }
        return result;
    }
    public String removeNetwork(String node, String data) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "network");
            joAction.put("request", "remove");
            joAction.put("desc", data);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
    
        } catch (Exception e) {
            log(ERROR, "removeNetwork failed", e);
            return e.toString();
        }
        return result;
    }
    public String updateNetwork(String node, String data) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "network");
            joAction.put("request", "update");
            joAction.put("desc", data);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
    
        } catch (Exception e) {
            log(ERROR, "updateNetwork failed", e);
            return e.toString();
        }
        return result;
    }   
    public String getAllVmsNetworks(String node) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "network");
            joAction.put("request", "vmnics");
            joAction.put("desc", "");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
    
        } catch (Exception e) {
            log(ERROR, "updateNetwork failed", e);
            return e.toString();
        }
        return result;
    }   
    public String getNodeTimeConfiguration(String node) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "time");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
        } catch (Exception e) {
            log(ERROR, "getNodeTimeConfiguration", e);
            return "Failed: "+e.toString();
        }
        return result;
    }   
    public String setNodeTimeConfiguration(String node, String data) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "set");
            joAction.put("request", "time");
            joAction.put("desc", data);
            ArrayList < String > optList = new ArrayList < String > ();
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
    
        } catch (Exception e) {
            log(ERROR, "setNodeTimeConfiguration failed", e);
            return e.toString();
        }
        return result;
    }
    public String setNodeNtpServers(String node, String data) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "set");
            joAction.put("request", "timeservers");
            joAction.put("desc", data);
            ArrayList < String > optList = new ArrayList < String > ();
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
    
        } catch (Exception e) {
            log(ERROR, "setNodeNtpServers failed", e);
            return e.toString();
        }
        return result;
    }
    public String setNodeAdvancedTimeConfiguration(String node, String data) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "set");
            joAction.put("request", "timemisc");
            joAction.put("desc", data);
            ArrayList < String > optList = new ArrayList < String > ();
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
    
        } catch (Exception e) {
            log(ERROR, "setNodeAdvancedTimeConfiguration failed", e);
            return e.toString();
        }
        return result;
    }
    public String getNodeSnmpConfiguration(String node) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "snmp");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
        } catch (Exception e) {
            log(ERROR, "getNodeSnmpConfiguration", e);
            return "Failed: "+e.toString();
        }
        return result;
    }   
    public String setNodeSnmpConfiguration(String node, String data) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "set");
            joAction.put("request", "snmp");
            joAction.put("desc", data);
            ArrayList < String > optList = new ArrayList < String > ();
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
    
        } catch (Exception e) {
            log(ERROR, "setNodeSnmpConfiguration failed", e);
            return e.toString();
        }
        return result;
    }
    public String setNodeIpmiConfiguration(String node, String data) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "set");
            joAction.put("request", "ipmi");
            joAction.put("desc", data);
            ArrayList < String > optList = new ArrayList < String > ();
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
    
        } catch (Exception e) {
            log(ERROR, "setNodeSnmpConfiguration failed", e);
            return e.toString();
        }
        return result;
    }
    public String getNodeHardwareEvents(String node) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "hel");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
        } catch (Exception e) {
            log(ERROR, "getNodeSnmpConfiguration", e);
            return "Failed: "+e.toString();
        }
        return result;
    }
    public String getNodePerformances(String node) {
        String result = "";
        try {
            String pathToRessource = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("resources/jarmon/monitor/data");
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "performances");
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("path="+pathToRessource);
            joAction.put("options", optList);
    
            result = callOvnmanager(node, joAction.toString());
        } catch (Exception e) {
            log(ERROR, "getNodePerformances", e);
            return "Failed: "+e.toString();
        }
        return result;
    } 
    public String getEtcHosts() {
        String result= "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "etchosts");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager("none", joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "getEtcHosts", e);
            return e.toString();
        }
        return result;
    }    
    public String setEtcHosts(String data) {
        String result= "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "set");
            joAction.put("request", "etchosts");
            joAction.put("desc", data);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager("none", joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "getEtcHosts", e);
            return e.toString();
        }
        return result;
    }
    public String getAllNodesInfo() {
        String result= "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "all_nodes_info");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager("none", joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "getAllNodesInfo", e);
            return e.toString();
        }
        return result;
    }
    public String probeNeighborhood() {
        String result= "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "probe_nodes");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager("none", joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "probeNeighborhood", e);
            return e.toString();
        }
        return result;
    }
    public String getNodeLogs(String node) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "logs");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
    
                            
            String res = callOvnmanager(node, joAction.toString());
            JSONObject jsonRes = new JSONObject(res);
            JSONObject joActRes = jsonRes.getJSONObject("action");
            JSONObject joData = joActRes.getJSONObject("result");
            String error = joData.get("error").toString();
            if (error.length() > 0) {
                return error;
            }
            String file_path = joData.get("path").toString();
            String hostname = joData.get("host").toString();
            result = this.readLogsFile(file_path+"/messages", hostname);
            
        } catch (Exception e) {
            log(ERROR, "getNodeLog", e);
            return "Failed: "+e.toString();
        }
        return result;
    } 
    private boolean deleteDirectory(String directory) {
        String workingDir = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("resources/data/");
        boolean res = recursiveDelete(new File(workingDir + "/" + directory));
        return (res);
    }
    public String notifyAll(String node, String request, String infos) {
        String result= node;
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "notify");
            joAction.put("request", request);
            joAction.put("infos", infos);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager(node, joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "notifyAll", e);
            return e.toString();
        }
        return result;
    }
    private boolean recursiveDelete(File path) {
        if (path.exists()) {
            File[] files = path.listFiles();
            for (int i = 0; i < files.length; i++) {
                if (files[i].isDirectory()) {
                    recursiveDelete(files[i]);
                }
                else {
                    files[i].delete();
                }
            }
        }
        return (path.delete());
    }

    public String readFile(String file) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(file));
        String line = null;
        StringBuilder stringBuilder = new StringBuilder();
        try {
            while ((line = reader.readLine()) != null) {                
                stringBuilder.append(line+"\n");
            }
        } finally {
            reader.close();
            return stringBuilder.toString();
        }
    }
    private String readLogsFile(String file, String hostname) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(file));
        String line = null;
        StringBuilder stringBuilder = new StringBuilder();
        try {
            while ((line = reader.readLine()) != null) {
                if ((! line.matches(".*(DHCPACK|DHCPREQUEST).openkvibr0.*")) 
                    && (! line.matches(".*(hpasmlited|ipmievd).*")))
                    {
                        
                        String[] splitString = (line.split(hostname));
                        String date = splitString[0];
                        
                        //We remove the hostname from the logs
                        String info = "";
                        for (int i = 1; i < splitString.length; i++) {
                            info += splitString[i];
                        }
                        
                        String color = "DarkSlateBlue";
                        if (info.matches(".* (E|e)rror.*")) {
                            color = "Red";
                        } else if (info.matches(".* (W|w)arning.*")) {
                            color = "OrangeRed";
                        } else if (info.matches(".* (F|f)ailed.*")) {
                            color = "OrangeRed";
                        } 
                        line = "<font color=\""+color+"\">"+date+" "+info+"</font>";
                        stringBuilder.append(line+"<br/>");
                }
            }
        } finally {
            reader.close();
            return stringBuilder.toString();
        }
    }
    public String listDirectory(String node, String path) {
        String result= "";
        try {
            
            JSONObject joAction = new JSONObject();
            joAction.put("name", "list_directory");
            joAction.put("request", path);
            ArrayList<String> optList = new ArrayList<String>();
            //optList.add("storages="+storages);
            joAction.put("options", optList);
                
            result = callOvnmanager(node, joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "listDirectory", e);
            return e.toString();
        }
        return result;
    }
    public String getFileInfo(String node, String path) {
        String result= "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "file_info");
            joAction.put("request", path);
            ArrayList<String> optList = new ArrayList<String>();
            //optList.add("storages="+storages);
            joAction.put("options", optList);
                
            result = callOvnmanager(node, joAction.toString());
            
        } catch (Exception e) {
            log(ERROR, "listDirectory", e);
            return e.toString();
        }
        return result;
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
        //inBuffer = new byte[8192];
		//outBuffer = new byte[8192];
        inBuffer = new byte[65536];
    	outBuffer = new byte[8192];
        
        
        try {
            HttpSession session = RuntimeAccess.getInstance().getSession();
            String sessionUser = (String)session.getAttribute("User");
            if (sessionUser == null) {
                sessionUser = "administrator";
            }
            
            JSONObject joAction = new JSONObject(action);
            JSONObject joCmd = new JSONObject();
            joCmd.put("sender", sessionUser);
            joCmd.put("target", "NODE");
            joCmd.put("node", node);
            joCmd.put("action", joAction);
            String output = joCmd.toString();
            
            socket = new DatagramSocket();
            // set timeout
            String actionName = joAction.get("name").toString();
            if (actionName.equals("add")) {
                socket.setSoTimeout(90000);
            } else if (actionName.equals("connect")) {
                socket.setSoTimeout(60000);
            } else {
                socket.setSoTimeout(60000);
            }
            InetAddress serverInet = InetAddress.getByName("localhost");
            socket.connect(serverInet,serverPort);
            outBuffer = output.getBytes();
            packet2Send = new DatagramPacket(outBuffer, outBuffer.length, serverInet, serverPort);
    		receivedPacket = new DatagramPacket(inBuffer, inBuffer.length);
			
            try {
                // send the data
                socket.send(packet2Send);
                // receive reply            
    		    socket.receive(receivedPacket);
    			// the server reply is...
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
    public String virtop(String node) {
        String result= "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get");
            joAction.put("request", "virt-top");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager(node, joAction.toString());

        } catch (Exception e) {
            log(ERROR, "virtop has failed", e);
            return node+"=Error:"+e.toString();
        }
        return result;
    }
    
}

