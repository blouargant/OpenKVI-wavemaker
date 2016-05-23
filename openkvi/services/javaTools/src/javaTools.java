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
import java.io.*;
//import java.io.File;
//import java.io.RandomAccessFile;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import com.wavemaker.runtime.RuntimeAccess;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.regex.Pattern;
import java.util.Random;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Set;
import org.json.*;
import difflib.*;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpServletRequest;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.net.SocketException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import org.xml.sax.*; 
import org.jdom.*;
import org.jdom.input.*;
import org.jdom.output.*;
import java.util.Date;
import java.util.Vector;


public class javaTools extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {
    /* Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;
     *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation
     */

    //private Hashtable inputHash = new Hashtable();
    private Hashtable<Integer, String> aliveHash = new Hashtable();
    private Hashtable<String, Socket> clients = new Hashtable<String, Socket>();
    private Hashtable<String, DataExchanger> dataBuffers = new Hashtable<String, DataExchanger>();
        
     
    public javaTools() {
        super(INFO);
        CleanerThread Cleaner = new CleanerThread();
        Cleaner.start();
    }
    public String setUser(String name) {
        HttpSession session = RuntimeAccess.getInstance().getSession();
        session.setAttribute("User", name);
        return name;
    }
    
    private class CleanerThread extends Thread {    
        public void run() {
            try {
                ArrayList<Integer> deadList = new ArrayList();
                while (true) {
                    // Wake up every minutes to clean hastables
                    // Cleanup previously stored clientids
                    for(int i = 0; i < deadList.size(); i++)
                    {
                        int clientId = deadList.get(i);
                        if (aliveHash.containsKey(clientId)) {
                            String alive = (String) aliveHash.get(clientId);
                            if ( alive == "false" ) {
                                log(INFO, "Cleaner Thread: removing "+String.valueOf(clientId));
                                try {
                                    if (clients.contains(String.valueOf(clientId))) {
                                        Socket clientSocket = clients.get(String.valueOf(clientId));
                                        clientSocket.close();
                                        clients.remove(String.valueOf(clientId));
                                    }
                                } catch (Exception exCl) {
                                    if (clients.contains(String.valueOf(clientId))) {
                                        clients.remove(String.valueOf(clientId));
                                    }
                                }
                                if (dataBuffers.contains(String.valueOf(clientId))) {
                                    dataBuffers.remove(String.valueOf(clientId));
                                }
                                aliveHash.remove(clientId);
                            }   
                        }
                    }
                    deadList.clear();
                    for (Integer key:aliveHash.keySet()) {
                        //log(INFO, "Cleaner Thread: checking "+String.valueOf(key));
                        String value = aliveHash.get(key);
                        if (value != "true") {
                            deadList.add(key) ;
                            log(INFO, "Cleaner Thread: "+String.valueOf(key)+" is dead !");    
                        }
                    }
                    // sleep for 5 minutes
                    this.sleep(30000);                    
                }
            } catch (Exception e) {
                log(ERROR, "CleanerThread: ", e);
            }
        }
    }
    
    private class DataExchanger extends Object {
        private String data = "";
        static final int MAXQUEUE = 5;
        private Vector messages = new Vector();
    
    
        public synchronized void putMessage(String inputData) throws InterruptedException {
    
            while (messages.size() == MAXQUEUE) {
                wait();
            }
            messages.addElement(inputData);
            notify();
        }
    
        public synchronized String getMessage() throws InterruptedException {
            notify();
            while (messages.size() == 0) {
                wait();
            }
            String message = (String) messages.firstElement();
            messages.removeElement(message);
            return message;
        }
    }
    
    private class ListenerThread extends Thread {
        private int clientId;
        private String remoteIP;
        private boolean running;
        private String errorMsg;
        private DataExchanger clientBuffer;
        
        public ListenerThread(int clientId, String ipAddress, DataExchanger Buffer) {
            this.clientId = clientId;
            this.remoteIP = ipAddress;
            this.clientBuffer = Buffer;
            this.errorMsg = "";
        }
        public void stopListener() {
            this.running = false;
        }
                
        public void run() {
            String reply = "timeout";
            Socket clientSocket = null;
            int serverPort = 9999;
            
            boolean exit = false;
            String inputStr = "";
            String alive = "";
            this.running = true;
            int timeoutCounter = 0;
            try {
                
                boolean sessionHasExpired = false;

                while (this.running) {
                    try {
                        clientSocket = new Socket("localhost", serverPort);
                        clientSocket.setSoTimeout(300000); //timeout after 5min without messages
                        clients.put(String.valueOf(this.clientId), clientSocket);
            
                        BufferedReader inFromServer = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                        DataOutputStream outToServer = new DataOutputStream(clientSocket.getOutputStream());
                        
                        String str = String.valueOf(this.clientId) + "::" + this.remoteIP +"\n";
                        outToServer.writeBytes(str);
            
                        while ((reply = inFromServer.readLine()) != null) {
                            try {
                                alive = (String) aliveHash.get(this.clientId);
                                if (alive == "false") {
                                    this.running = false;
                                    clientSocket.close();
                                } else {
                                    this.clientBuffer.putMessage(reply);
                                }
                            } catch (Exception ex) {
                                this.errorMsg = ex.toString();
                                this.clientBuffer.putMessage("MONITOR_ERROR: "+ex.toString());
                            }
                        }
                        clientSocket.close();
                        //this.running = false;
                    } catch (SocketTimeoutException s) {
                        System.out.println("Socket timed out!");
                        alive = (String) aliveHash.get(this.clientId);
                        if (alive == "false") {
                            this.running = false;
                            this.errorMsg = "MONITOR_ERROR: Socket timed out!";
                        }
                        clientSocket.close();
                    } catch (SocketException t) {
                        log(ERROR, "SocketException ", t);
                        this.running = false;
                        if (sessionHasExpired) {
                            this.clientBuffer.putMessage("MONITOR_ERROR: session expired");
                        } else {                                            
                            this.errorMsg = "MONITOR_ERROR: socket closed";
                            this.clientBuffer.putMessage("MONITOR_ERROR: socket closed");
                        }
                        aliveHash.put(clientId, "false");
                        
                    } catch (Exception e) {
                        log(ERROR, "unable to establish connection", e);
                        this.errorMsg = "MONITOR_ERROR: Nodemanagerd is not listening" + e.toString();
                        this.running = false;
                        aliveHash.put(clientId, "false");
                    }
                }
            
            } catch (Exception e) {
                log(ERROR, "Listener Thread:", e);
                this.errorMsg = "MONITOR_ERROR: Listener Thread " + e.toString();
                this.running = false;
            }
        }// END of RUN

    }// END of ListenerThread class
    
    public String nodemanagerListener(int clientId) {
        String result = "";
        long maxInactiveInterval = -1;
        //boolean wait = false;
        try {
            HttpServletRequest request = RuntimeAccess.getInstance().getRequest();
            HttpSession session = RuntimeAccess.getInstance().getSession();
            
            String ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null) {
                ipAddress = request.getRemoteAddr();
            }
            if (clientId <= 0) {
                //if (clientId == -1) {
                //    wait = true;
                //}
                Random randomGenerator = new Random();
                int i = 0;
                while (i < 10000) {
                    clientId = randomGenerator.nextInt(100000) + 1;
                    if (dataBuffers.containsKey(clientId)) {
                        i += 1;
                    } else {
                        i = 99999;
                        aliveHash.put(clientId, "true");
                    }
                }
                if (i != 99999) {
                    return "Error: to many clients";
                }
                DataExchanger Buffer = new DataExchanger();
                dataBuffers.put(String.valueOf(clientId), Buffer);
                javaTools.ListenerThread Listener = new javaTools.ListenerThread(clientId, ipAddress, Buffer);
                Listener.start();
                Thread.sleep(1000);
                if (Listener.running) {
                    result = "started::"+ipAddress;
                } else {
                    result = Listener.errorMsg;
                }
            }
    
    
    
        } catch (Exception e) {
            log(ERROR, "nodemanagerListener has failed", e);
            result = "JAVAERROR: nodemanagerListener has failed" + e.toString();
        }
        return clientId + "::" + result;
    }

    public void stopMonitoring(int clientId) {
        try {
            aliveHash.put(clientId, "false");
            dataBuffers.remove(clientId);
    
        } catch (Exception e) {
            log(ERROR, "stopMonitoring operation has failed", e);
        }
    }

    public String monitorInputString(int clientId) {
        String result = "";
        String alive = "true";
        boolean toClose = false;
        try {
            String inputStr = "";
            DataExchanger clientBuffer = dataBuffers.get(String.valueOf(clientId));
            alive = (String) aliveHash.get(clientId);
            HttpSession session = RuntimeAccess.getInstance().getSession();
            int maxInactiveInterval = session.getMaxInactiveInterval() *1000;
            Long LastActive = (Long)session.getAttribute("LastActive");
            
            result = clientBuffer.getMessage();
            
            Long now = System.currentTimeMillis();
            if ((maxInactiveInterval > 0) && ((LastActive + maxInactiveInterval) <= now)) {
                    toClose = true;
                    result = "MONITOR_ERROR: session expired";
            } else if (alive == "false") {
                result = "MONITOR_ERROR: stopped";
                toClose = true;
            }
            if (toClose) {
                this.stopMonitoring(clientId);
                try {
                    Socket clientSocket = clients.get(String.valueOf(clientId));
                    clientSocket.close();
                    //clients.remove(String.valueOf(clientId));
                } catch (Exception ex) {
                    String err = ex.toString().replaceAll("Error", "MONITOR_ERROR");
                    result +="; "+err;
                }   
            } 
        } catch (Exception e) {
            log(ERROR, "monitorInputString operation has failed", e);
            result = "MONITOR_ERROR:" + e.toString();
        }
        return result;
    }
    
    public String timeout(String log, int sleeping) {
        try {
            Thread.sleep(sleeping);
        } catch(Exception e) {
            log(ERROR, "timeout has failed", e);
            log = e.toString();
        }
        return log;
    }
    public String sleep(String func, int sleep) {
        try {
            Thread.sleep(sleep);
        } catch(Exception e) {
            return func;
        }
        return func;
    }
    public String deleteVmLocalFiles(String directories, String vmName) {
        String result  = null;
        Pattern patternImg;
        patternImg = Pattern.compile(vmName+"-[0-9]*.img");
        Pattern patternXml;
        patternXml = Pattern.compile(vmName+".xml");
        try {
            String pathToRepo = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("resources/data/");
            String[] dirList = directories.split(",");
            for (String dirInfos : dirList) {
                String dir = dirInfos.trim();
                File path = new File(pathToRepo +"/"+ dir);
                File[] files = path.listFiles();
                for(int i=0; i<files.length; i++) {
                    if((patternImg.matcher(files[i].getName()).matches()) || (patternXml.matcher(files[i].getName()).matches())) {
                        files[i].delete();  
                    }
                }
            }
        } catch(Exception e) {
            log(ERROR, "deleteVmLocalFiles has failed", e);
            result = e.toString();
        }

        return result;
    }

    public String createDirectory(String directories) {
        String result  = null;
        try {
            String pathToRepo = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("resources/data/");
            String[] dirList = directories.split(",");
            for (String dir : dirList) {
                dir = dir.trim();
                boolean success = (new File(pathToRepo+"/"+dir)).mkdirs();
                if (success) {
                    result = directories + " created";
                } 
            }
        } catch(Exception e) {
            log(ERROR, "createDirectory has failed", e);
            result = e.toString();
        }

        return result;
    }
    
    public boolean deleteDirectory(String directory) {
        String workingDir = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("resources/data/");
        boolean res = recursiveDelete(new File(workingDir+"/"+directory));
        return( res );
    }


    private boolean recursiveDelete(File path) {
        if( path.exists() ) {
          File[] files = path.listFiles();
          for(int i=0; i<files.length; i++) {
             if(files[i].isDirectory()) {
               recursiveDelete(files[i]);
             }
             else {
               files[i].delete();
             }
          }
        }
        return( path.delete() );
    }
    
    public String getHelpFile(String help) {
        String result = "";
        try {
            String helpFile = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("resources/help/"+help);
            result = readFile(helpFile);
        } catch(Exception e) {
            log(ERROR, "getHelpFile has failed", e);
            result = e.toString();
        }
            return result;
    }
/*
    public String monitorInputs(String strFile, long lastTimeStamp, String oldbuff) {
        String result = "";
        String err = "error";
        JSONObject joResult = new JSONObject();
        File inputFile = new File(strFile); 
        
        try {
            FileChannel channel = new RandomAccessFile(inputFile, "rw").getChannel();
            FileLock lock = null;
            String newInput = "";
            String lastTime = "";
            String infos = "";
            long lastMod = 0;
            
            
            if (oldbuff.indexOf("error") > -1) {
                err = "error2";
                Thread.sleep(2000);
            }
            
            if (lastTimeStamp == 0) {
                // Create a shared lock on the file.
                // This method blocks until it can retrieve the lock.
                lock = channel.lock(0, Long.MAX_VALUE, true);
                lastMod = inputFile.lastModified();
                // Release the lock
                lock.release(); 
                lastTimeStamp = lastMod;
            }
                    
            if (oldbuff.indexOf("empty") > -1) {
                oldbuff = readFile(strFile);
                if (oldbuff.indexOf("service stopped") > -1) {
                    lastTime = String.valueOf(lastTimeStamp);
                    joResult.put("time", lastTime);
                    joResult.put("buffer", oldbuff);
                    joResult.put("infos", oldbuff);
                    result = joResult.toString();
                    return result;
                }
            }

            boolean NotModified = true;

            lock = channel.lock(0, Long.MAX_VALUE, true);
            lastMod = inputFile.lastModified();
            lastTimeStamp = lastMod;
            newInput = readFile(strFile);
            lock.release();
            
            if (newInput.equals(oldbuff)) {
                while (NotModified == true) {
                    lock = channel.lock(0, Long.MAX_VALUE, true); 
                    lastMod = inputFile.lastModified();
                    if (lastTimeStamp != lastMod) {
                        lastTimeStamp = lastMod;
                        newInput = readFile(strFile);            
                        NotModified = false;
                    }
                    // Release the lock
                    lock.release(); 
                    if (NotModified == true) {
                        Thread.sleep(1000); //sleep for 1000 ms
                    }
                }
                infos = diff(newInput, oldbuff);
                oldbuff = newInput;
                lastTime = String.valueOf(lastTimeStamp);
                joResult.put("time", lastTime);
                joResult.put("buffer", oldbuff);
                joResult.put("infos", infos);
                result = joResult.toString();    
            
            } else {
                infos = diff(newInput, oldbuff);
                oldbuff = newInput;
                lastTime = String.valueOf(lastTimeStamp);
                joResult.put("time", lastTime);
                joResult.put("buffer", oldbuff);
                joResult.put("infos", infos);
                result = joResult.toString();
            }
                        
            
            
        } catch (Exception e) {
            log(ERROR, "monitorInputs operation has failed", e);
            result = e.toString()+"::"+strFile;
        }
        return result;
    }
*/
    public String readLogFile() {
        String result = "";
        try {
            String filename = "/opt/virtualization/openkvi/openkvi.log";
            result = readFile(filename);
        }catch (Exception e) {
            result = e.toString();
        }
        return result;
    }
    
    private String readFile(String file) throws IOException {
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
    private static void writeFile(String file, String content) {
        try {
            // Create file 
            FileWriter fstream = new FileWriter(file);
            BufferedWriter out = new BufferedWriter(fstream);
            out.write(content);
            //Close the output stream
            out.close();
        } catch (Exception e) { //Catch exception if any
            System.err.println("Error: " + e.getMessage());
        }
    }
    private static List<String> fileToLines(String filename) {
        List<String> lines = new LinkedList<String>();
        String line = "";
        try {
            BufferedReader in = new BufferedReader(new FileReader(filename));
            while ((line = in .readLine()) != null) {
                lines.add(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return lines;
    }
    private static List<String> stringToLines(String aString) {
        List<String> lines = new LinkedList<String>();
        String[] strings = aString.split("\n");
        for (String splited : strings) {
            lines.add(splited);
        }
        return lines;
    }    
    private static String diff(String revStr, String origStr) {
        List<String> revised = stringToLines(revStr);
        List<String> original = stringToLines(origStr);
        Patch patch = DiffUtils.diff(original, revised);
        List<String> res = processDeltas(original, patch.getDeltas(),0);
        return res.toString();
    }
    
    
     /**
      * processDeltas takes a list of Deltas and outputs them together in a single block of Unified-Diff-format text.
      *
      * @param origLines   - the lines of the original file
      * @param deltas      - the Deltas to be output as a single block
      * @param contextSize - the number of lines of context to place around block
      * @return
      * @author Bill James (tankerbay@gmail.com)
      */
     private static List<String> processDeltas(List<String> origLines, List<Delta> deltas, int contextSize) {
         List<String> buffer = new ArrayList<String>();
         int origTotal = 0; // counter for total lines output from Original
         int revTotal = 0; // counter for total lines output from Original
         int line;
     
         Delta curDelta = deltas.get(0);
     
         // NOTE: +1 to overcome the 0-offset Position
         int origStart = curDelta.getOriginal().getPosition() + 1 - contextSize;
         if (origStart < 1) {
             origStart = 1;
         }
         int revStart = curDelta.getRevised().getPosition() + 1 - contextSize;
         if (revStart < 1) {
             revStart = 1;
         }
         // find the start of the wrapper context code
         int contextStart = curDelta.getOriginal().getPosition() - contextSize;
         if (contextStart < 0) {
             contextStart = 0; // clamp to the start of the file
         }
         // output the context before the first Delta
         for (line = contextStart; line < curDelta.getOriginal().getPosition(); line++) { //
             buffer.add(" " + origLines.get(line));
             origTotal++;
             revTotal++;
         }
         // output the first Delta
         buffer.addAll(getDeltaText(curDelta));
         origTotal += curDelta.getOriginal().getLines().size();
         revTotal += curDelta.getRevised().getLines().size();
     
         int deltaIndex = 1;
         while (deltaIndex < deltas.size()) { // for each of the other Deltas
             Delta nextDelta = deltas.get(deltaIndex);
             int intermediateStart = curDelta.getOriginal().getPosition() + curDelta.getOriginal().getLines().size();
             for (line = intermediateStart; line < nextDelta.getOriginal().getPosition(); line++) {
                 // output the code between the last Delta and this one
                 buffer.add(" " + origLines.get(line));
                 origTotal++;
                 revTotal++;
             }
             buffer.addAll(getDeltaText(nextDelta)); // output the Delta
             origTotal += nextDelta.getOriginal().getLines().size();
             revTotal += nextDelta.getRevised().getLines().size();
             curDelta = nextDelta;
             deltaIndex++;
         }
     
         // Now output the post-Delta context code, clamping the end of the file
         contextStart = curDelta.getOriginal().getPosition() + curDelta.getOriginal().getLines().size();
         for (line = contextStart;
         (line < (contextStart + contextSize)) && (line < origLines.size()); line++) {
             buffer.add(" " + origLines.get(line));
             origTotal++;
             revTotal++;
         }
         return buffer;
     }
     /**
     * getDeltaText returns the lines to be added to the Unified Diff text from the Delta parameter
     *
     * @param delta - the Delta to output
     * @return list of String lines of code.
     * @author Bill James (tankerbay@gmail.com)
     */
    private static List<String> getDeltaText(Delta delta) {
        List<String> buffer = new ArrayList<String>();
        // Only return new lines
        /*
        for (Object line : delta.getOriginal().getLines()) {
            buffer.add("-" + line);
        }*/
        for (Object line : delta.getRevised().getLines()) {
            buffer.add("+" + line);
        }
        return buffer;
    }

    // Use avahi service to find running libvirt daemon in the neighborhood
    // return a JSON string
    public String probeNeighborhood() 
    {
        String result = "";
        try {
            String command = "/usr/bin/avahi-browse -tr _libvirt._tcp";

            final Process process = Runtime.getRuntime().exec(command);
            BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuffer sb = new StringBuffer();
            while (true) {
                String line = br.readLine();
                if (line == null) break;
                if (line.indexOf("= ") > -1) {
                    line = line.replaceAll(" *_libvirt._tcp.*", ""); 
                    line = line.replaceAll("\"", "");
                    line = line.replaceAll(".*Virtualization Host (.*)", ",{\"name\":\"$1\"");
                    line = line.replaceAll(" *(.*) = .(.*).$", ",\"$1\":\"$2\"");
                    line = line.replaceAll("txt(.*)", "info$1} ");
                    
                    sb.append(line);
                }
            }
            result = sb.toString();
            result = result.replaceAll("^,", "{\"neighborhood\":[");
            result = result.replaceAll("$", "]}");
    
        } catch (Exception e) {
            log(ERROR, "probeNeighborhood operation has failed", e);
            result = e.toString();
        }
        return result;
    }
   
    public String getTimeZones() {
        String result = null;
        try {
            String relPath = "resources/javascript/";
            String path = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            String timezonePath = path + "/timezone.xml";
    
            String timezones = this.readFile(timezonePath);
            XML xml = new XML();
            JSONObject jZones = xml.toJSONObject(timezones);
            result = jZones.toString();
        } catch (Exception e) {
            log(ERROR, "getTimeZones", e);
            return e.toString();
        }
        return result;
    }
    public String getSessionInfo() {
        String result = null;
        try {
            String relPath = "WEB-INF/";
            String path = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            String sessionPath = path + "/web.xml";
    
            String infos = this.readFile(sessionPath);
            XML xml = new XML();
            JSONObject jSession = xml.toJSONObject(infos);            
            
            result = jSession.toString();
        } catch (Exception e) {
            log(ERROR, "getSessionInfo", e);
            return e.toString();
        }
        return result;
    }   
    public String setSessionInfo(String timeout) {
        String result = null;
        try {
            String relPath = "WEB-INF/";
            String path = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(relPath);
            String sessionPath = path + "/web.xml";
            File xmlFile = new File(sessionPath);
    
            org.jdom.Document document;
            SAXBuilder sxb = new SAXBuilder();
            document = sxb.build(xmlFile);
            Element elRacine = document.getRootElement();
    
            // transform DOM to XML
            Format xmlFormat = Format.getPrettyFormat();
            xmlFormat.setOmitDeclaration(true);
            xmlFormat.setLineSeparator(System.getProperty("line.separator"));
            XMLOutputter sortie = new XMLOutputter(xmlFormat);
    
            //System.out.println("----" + sortie.outputString(document));            
            List listElements = elRacine.getChildren();
            Iterator i = listElements.iterator();
            while (i.hasNext()) {
                Element courant = (Element) i.next();
                String currentName = courant.getName();
                if (currentName.equals("session-config")) {
                    List listSession = courant.getChildren();
                    Iterator i2 = listSession.iterator();
                    while (i2.hasNext()) {
                        Element courantSess = (Element) i2.next();
                        String currentSessName = courantSess.getName();
                        if (currentSessName.equals("session-timeout")) {
                            courantSess.setText(timeout);
                            //System.out.println(" !!! "+currentSessName+" !!!"+sortie.outputString(courantSess));
                            break;
                        }
                    }
                    break;
                }
            }
    
            sortie.output(document, new FileOutputStream(xmlFile));
            result = "done";
            
        } catch (Exception e) {
            log(ERROR, "setSessionInfo", e);
            return e.toString();
        }
        return result;
    }
    
    public String restartTomcat() {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "restartOpenkvi");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            callOvnmanager(joAction.toString());
        } catch (Exception e) {
            log(ERROR, "restartTomcat", e);
            return e.toString();
        }
        return result;
    }    
    
    public String getSecurityLevel() {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get_security_level");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            result = callOvnmanager(joAction.toString());
        } catch (Exception e) {
            log(ERROR, "getSecurityLevel", e);
            return e.toString();
        }
        return result;
    }    
    public String setSecurityLevel(String level) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "set_security_level");
            joAction.put("level", level);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            result = callOvnmanager(joAction.toString());
        } catch (Exception e) {
            log(ERROR, "setSecurityLevel", e);
            return e.toString();
        }
        return result;
    }    
    public String getDebug() {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "get_debug");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            result = callOvnmanager(joAction.toString());
        } catch (Exception e) {
            log(ERROR, "setSecurityLevel", e);
            return e.toString();
        }
        return result;
    }    

    public String setDebug(String enabled) {
        String result = "";
        try {
            JSONObject joAction = new JSONObject();
            joAction.put("name", "set_debug");
            joAction.put("enabled", enabled);
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            result = callOvnmanager(joAction.toString());
        } catch (Exception e) {
            log(ERROR, "setSecurityLevel", e);
            return e.toString();
        }
        return result;
    }    
    
    private String callOvnmanager(String action) {
        String result= "";
        DatagramSocket socket = null;
        int serverPort = 9999;
        DatagramPacket packet2Send;
        DatagramPacket receivedPacket;
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
            joCmd.put("target", "GENERAL");
            joCmd.put("node", "None");
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
