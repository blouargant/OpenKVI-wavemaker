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

public class snapshotTools extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {
    /* Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;
     *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation
     */
    public snapshotTools() {
       super(INFO);
    }
    
    public String getSnapshotList(String vmName, String server) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "list");
            joAction.put("vm", vmName);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager(server, joAction.toString());
        
        } catch (Exception e) {
            log(ERROR, "getSnapshotList", e);
            return result+"Error:"+e.toString();
        }
        return result;
    }
    
    public String createSnapshot(String vmName, String server, String xml) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "create");
            joAction.put("xml", xml);
            joAction.put("vm", vmName);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            
            result = callOvnmanager(server, joAction.toString());
        
        } catch (Exception e) {
            log(ERROR, "createSnapshot", e);
            return result+"Error:"+e.toString();
        }
        return result;
    }

    public String mergeToParent(String vmName, String server, String snapshot) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "delete");
            joAction.put("vm", vmName);
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("snapshot="+snapshot);
            optList.add("children=yes");
            optList.add("message=Merge snapshot with parent");
            joAction.put("options", optList);
            
            result = callOvnmanager(server, joAction.toString());
        
        } catch (Exception e) {
            log(ERROR, "mergeToParent", e);
            return result+"Error:"+e.toString();
        }
        return result;
    }
    
    public String discardAll(String vmName, String server, String snapshot) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "delete");
            joAction.put("vm", vmName);
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("snapshot="+snapshot);
            optList.add("children=yes");
            optList.add("message=Discard snapshot and its children");
            joAction.put("options", optList);
            
            result = callOvnmanager(server, joAction.toString());
        
        } catch (Exception e) {
            log(ERROR, "mergeToParent", e);
            return result+"Error:"+e.toString();
        }
        return result;
    }
    
    public String mergeToChildren(String vmName, String server, String snapshot) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "delete");
            joAction.put("vm", vmName);
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("snapshot="+snapshot);
            joAction.put("options", optList);
            
            result = callOvnmanager(server, joAction.toString());
        
        } catch (Exception e) {
            log(ERROR, "mergeToChildren", e);
            return result+"Error:"+e.toString();
        }
        return result;
    }

    public String rollback(String vmName, String server, String snapshot) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "rollback");
            joAction.put("vm", vmName);
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("snapshot="+snapshot);
            joAction.put("options", optList);
            
            result = callOvnmanager(server, joAction.toString());
        
        } catch (Exception e) {
            log(ERROR, "rollback", e);
            return result+"Error:"+e.toString();
        }
        return result;
    }
    public String revert(String vmName, String server, String snapshot) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "revert");
            joAction.put("vm", vmName);
            ArrayList<String> optList = new ArrayList<String>();
            optList.add("snapshot="+snapshot);
            joAction.put("options", optList);
            
            result = callOvnmanager(server, joAction.toString());
        
        } catch (Exception e) {
            log(ERROR, "rollback", e);
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
        inBuffer = new byte[8192];
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
            joCmd.put("target", "SNAPSHOT");
            joCmd.put("node", node);
            joCmd.put("action", joAction);
            String output = joCmd.toString();
            
            socket = new DatagramSocket();
            String actionName = joAction.get("name").toString();
            if (actionName.equals("create")) {
                socket.setSoTimeout(180000);
            } else {
                socket.setSoTimeout(60000);
            }
            
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


}
