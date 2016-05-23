/**
 * This is a client-facing service class.  All
 * public methods will be exposed to the client.  Their return
 * values and parameters will be passed to the client or taken
 * from the client, respectively.  This will be a singleton
 * instance, shared between all requests. 
 * 
 * To log, call the superclass method log(LOG_LEVEL, String) or log(LOG_LEVEL, String, Exception).
 * LOG_LEVEL is one of FATAL, ERROR, WARN, INFO and DEBUG to modify your log level.
 * For info on these levels, look for tomcat/log4j documentation
 */

import java.io.*;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.Hashtable;
import javax.naming.*;
import javax.naming.directory.*;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.common.util.SystemUtils;
import org.hibernate.Query;
import org.hibernate.Session;
import org.json.JSONObject;
import com.openkvidb.OpenkviDB;
import com.openkvidb.data.Authentication;
import javax.servlet.http.HttpSession;

public class authenticationModeTools extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {
    /* Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;
	 *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation
	 */
	public authenticationModeTools() {
		super(INFO);
	}

    private String callOvnmanager(String node, String user, String action) {
        String result= "";
        DatagramSocket socket = null;
        int serverPort = 9999;
        DatagramPacket packet2Send;
        DatagramPacket receivedPacket;
		byte[] outBuffer;
		byte[] inBuffer;    
        inBuffer = new byte[8192];
		outBuffer = new byte[8192];
        
        try {
            HttpSession session = RuntimeAccess.getInstance().getSession();
            JSONObject joCmd = new JSONObject();
            JSONObject joAction = new JSONObject(action);
            joCmd.put("sender", user);
            joCmd.put("target", "GENERAL");
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

	private void copyFile(String srFile, String dtFile){
		try {
			File f1 = new File(srFile);
			File f2 = new File(dtFile);
			InputStream in = new FileInputStream(f1);

			OutputStream out = new FileOutputStream(f2);

			byte[] buf = new byte[1024];
			int len;
			while ((len = in.read(buf)) > 0){
				out.write(buf, 0, len);
			}
			in.close();
			out.close();
		} catch(FileNotFoundException ex) {
			log(ERROR, ex.getMessage() + " in the specified directory.");
		} catch(IOException e){
			log(ERROR, e.getMessage());
		}
	}

	public Authentication getAuthenticationData() {
		OpenkviDB service = (OpenkviDB) RuntimeAccess.getInstance().getServiceBean("openkviDB");
		service.begin();
		Session session = service.getDataServiceManager().getSession();
		Authentication result = null;

		try {
            log(INFO, "Trying to get auth mode");
			Query query = session.createQuery("from Authentication");
			if (query.uniqueResult() != null) {
				result = (Authentication) query.uniqueResult();
			}
			service.commit();
		}
		catch (Exception ex) {
			log(ERROR, "getAuthenticationData has failed", ex);
			service.rollback();
		}
		return result;
	}

	private String getLastDn(String dn) {
		String str[] = dn.split(",");
		return str[0];
	}

	private String getFirstDns(String dn) {
		String str[] = dn.split(",");
		String result = "";
		for (int i = 1 ; i < str.length ; i++) {
			if (!result.equals("")) result += ",";
			result += str[i];
		}
		return result;
	}

	private String encryptPassword(String password) {
		return SystemUtils.encrypt(password);
	}
    public String getAuthenticationMode() {
        String result = "";
        try {
            Authentication authenticationData = (Authentication) getAuthenticationData();
    		result = authenticationData.getMode();
            
        } catch(Exception e) {
			log(ERROR, "getAuthenticationMode service operation has failed", e);
            result = "Failed: "+e.toString();
		}
		return result;
	}       
            
    /*    
	public String resetAuthenticationMode() {
		String result  = null;
		try {
			log(INFO, "Starting resetAuthenticationMode");
			String pathToProjectSecurity = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("WEB-INF/");

			// get authentication data
			Authentication authenticationData = (Authentication) getAuthenticationData();
			log(INFO, ">>>>> Authentication mode:" + authenticationData.getMode());

			// save the current project-security.xml
			copyFile(pathToProjectSecurity  + "/project-security.xml", pathToProjectSecurity  + "/project-security-" + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()) + ".xml");
			// if mode = SQL
			if (authenticationData.getMode().equals("SQL")) {
				//  replace project-security.xml with sql.project-security.xml
				copyFile(pathToProjectSecurity  + "/sql.project-security.xml", pathToProjectSecurity  + "/project-security.xml");
			} else { // (mode = LDAP)
				
				//   open ldap.project-security.xml
				File fileToParse = new File(pathToProjectSecurity  + "/ldap.project-security.xml");
				InputStream fpIn = new FileInputStream(fileToParse);
				int buf;
				String stringToParse = "";
				while ((buf = fpIn.read()) != -1) {
					stringToParse += (char) buf;
				}
				fpIn.close();
				
				stringToParse = stringToParse.replace("{host}", authenticationData.getLdaphost());
				if (!authenticationData.getLdapport().equals(""))
					stringToParse = stringToParse.replace("{port}", authenticationData.getLdapport());
				else
					stringToParse = stringToParse.replace("{port}", "389");
				stringToParse = stringToParse.replace("{searchDn}", getLastDn(authenticationData.getLdapbasedn()));
				stringToParse = stringToParse.replace("{identifier}", authenticationData.getLdapidentifierfield());
				stringToParse = stringToParse.replace("{pathDn}", getFirstDns(authenticationData.getLdapbasedn()));
				stringToParse = stringToParse.replace("{adminLogin}", authenticationData.getLdapadminlogin());
				stringToParse = stringToParse.replace("{adminPassword}", encryptPassword(authenticationData.getLdapadminpassword()));
				//stringToParse = stringToParse.replace("{adminPassword}", authenticationData.getLdapadminpassword());
				
				File newFile = new File(pathToProjectSecurity  + "/project-security.xml");
				OutputStream fpOut = new FileOutputStream(newFile);
				fpOut.write(stringToParse.getBytes(), 0, stringToParse.getBytes().length);
				fpOut.close();
			
			}
			// restart openkvi using nodemanager
            JSONObject joAction = new JSONObject();
            joAction.put("name", "restartOpenkvi");
            ArrayList<String> optList = new ArrayList<String>();
            joAction.put("options", optList);
            callOvnmanager("None", "admin", joAction.toString());

			result = "OK";
			log(INFO, "Returning " + result);
		} catch(Exception e) {
			log(ERROR, "resetAuthenticationMode service operation has failed", e);
		}
		return result;
	}
    */

	private LdapUser _getLdapUser(String host, String port, String baseDn, String adminLogin, String adminPassword, String identifier, String searchedUser) {
		return _getLdapUser(host, port, baseDn, adminLogin, adminPassword, identifier, searchedUser, null, null, null);
	}

	private LdapUser _getLdapUser(String host, String port, String baseDn, String adminLogin, String adminPassword, String identifier, String searchedUser, String firstNameField, String lastNameField, String mailField) {
		// http://www.frank4dd.com/howto/various/ad_ldaptest_java.htm
		LdapUser result  = null;
		try {
			log(INFO, "Starting _getLdapUser");

			/*log(INFO, "host: " + host);
			log(INFO, "port: " + port);
			log(INFO, "baseDn: " + baseDn);
			log(INFO, "adminLogin: " + adminLogin);
			log(INFO, "adminPassword: " + adminPassword);
			log(INFO, "identifier: " + identifier);
			log(INFO, "searchedUser" + searchedUser);*/

			// set the LDAP authentication method
			String authMethod  = "simple";
			// set the LDAP client Version
			String ldapVersion = "3";

			DirContext ctx      = null;
			Hashtable env       = new Hashtable();

			// Here we store the returned LDAP object data
			String dn           = "";
			// This will hold the returned attribute list
			Attributes attrs;

			env.put(Context.INITIAL_CONTEXT_FACTORY,"com.sun.jndi.ldap.LdapCtxFactory");
			env.put(Context.PROVIDER_URL,"ldap://" + host + ":" + port);
			env.put(Context.SECURITY_AUTHENTICATION, authMethod);
			env.put(Context.SECURITY_PRINCIPAL, adminLogin);
			env.put(Context.SECURITY_CREDENTIALS, adminPassword);
			env.put("java.naming.ldap.version", ldapVersion);

			try {
				log(INFO, "Connecting to host " + host + " at port " + port + "...");

				ctx = new InitialDirContext(env);
				log(INFO, "LDAP authentication successful!");

				// Specify the attribute list to be returned
				//String[] attrIDs = { "memberOf" };

				SearchControls ctls = new SearchControls();
				//ctls.setReturningAttributes(attrIDs);
				ctls.setSearchScope(SearchControls.SUBTREE_SCOPE);

				// Check if identifier is in the right form,
                // should be something like (sAMAccountName={0}) but 
                // sAMAccountName is accpeted
                if (identifier.indexOf("={0}") == -1) {
                    identifier += "={0}";
                }
                if (identifier.indexOf("(") != 0) {
                    identifier = "(" + identifier + ")";
                }
                
                // Specify the search filter to match
                String filter = ("(&(objectClass=user)" + identifier + ")").replace("{0}", searchedUser);

				// Search the subtree for objects using the given filter
				NamingEnumeration answer = ctx.search(baseDn, filter, ctls);

				while (answer.hasMoreElements()) {
					SearchResult sr = (SearchResult)answer.next();
					dn = sr.getName();
					attrs = sr.getAttributes();

					log(INFO, "Found Object: " + dn + "," + baseDn);
					result = new LdapUser(searchedUser);
					if (attrs != null) {
						// we have some attributes for this object
						NamingEnumeration ae = attrs.getAll();
						while (ae.hasMoreElements()) {
							Attribute attr = (Attribute)ae.next();
							String attrId = attr.getID();
							if (attrId.equals(firstNameField) || attrId.equals(lastNameField) || attrId.equals(mailField)) {
								log(INFO, "Found Attribute: " + attrId);
								Enumeration vals = attr.getAll();
								while (vals.hasMoreElements()) {
									String attrVal = (String)vals.nextElement();
									log(INFO, attrId + ": " + attrVal);
									if (attrId.equals(firstNameField)) {
										result.setFirstName(attrVal);
									} else if (attrId.equals(lastNameField)) {
										result.setLastName(attrVal);
									} else if (attrId.equals(mailField)) {
										result.setMail(attrVal);
									}
								}
							}
						}
					}
				}

				// Close the context when we're done
				ctx.close();
			} catch (AuthenticationException authEx) {
				authEx.printStackTrace();
				log(INFO, "LDAP authentication failed: "+authEx.toString());
			} catch (NamingException namEx) {
				log(INFO, "LDAP connection failed: "+namEx.toString());
				namEx.printStackTrace();
			} catch (Exception e) {
				e.printStackTrace();
			}

		} catch(Exception e) {
			log(ERROR, "_getLdapUser has failed", e);
		}
		log(INFO, "return: " + result);
		return result;

	}

	public String testLdapConnection(String host, String port, String baseDn, String adminLogin, String adminPassword, String identifier, String searchedUser) {
		if (_getLdapUser(host, port, baseDn, adminLogin, adminPassword, identifier, searchedUser) != null)
			return "OK";
		else
			return null; 
	}

/*
	public String getLdapUserInfo(String searchedUser) {
		String result = null;
		try {
			log(INFO, "Starting getLdapUserInfo");
			Authentication authenticationData = (Authentication) getAuthenticationData();
			if (authenticationData.getMode().equals("LDAP")) {
				LdapUser getLdapUserResult = _getLdapUser(authenticationData.getLdaphost(), authenticationData.getLdapport(), authenticationData.getLdapbasedn(), authenticationData.getLdapadminlogin(), authenticationData.getLdapadminpassword(), authenticationData.getLdapidentifierfield(), searchedUser, authenticationData.getLdapfirstnamefield(), authenticationData.getLdaplastnamefield(), authenticationData.getLdapmailfield());
				if (getLdapUserResult != null) {
					log(INFO, "----> " + getLdapUserResult.getIdentifier());
					result = 
						getLdapUserResult.getIdentifier() + ":::" +
						(getLdapUserResult.getFirstName() != null ? getLdapUserResult.getFirstName() : "") + ":::" +
						(getLdapUserResult.getLastName() != null ? getLdapUserResult.getLastName() : "") + ":::" +
						(getLdapUserResult.getMail() != null ? getLdapUserResult.getMail() : "");
				}
			}
		} catch(Exception e) {
			log(ERROR, "getLdapUserInfo service operation has failed", e);
		}
		return result;
	}
*/

	public String getSubscriptionMode() {
		String result = null;
		try {
			Authentication authenticationData = (Authentication) getAuthenticationData();
			if (authenticationData.getMode() == "LDAP") {
				if (authenticationData.getLdapcreationmode().equals("AutoSubscription")) {
					result = authenticationData.getLdapcreationmode();
				}
			}
		} catch(Exception e) {
			log(ERROR, "getSubscriptionMode service operation has failed", e);
		}
		return result;
	}

	public String AutoSubscribeLdapUser(String user) {
		String result = null;
		try {
			log(INFO, "Starting AutoSubscribeLdapUser");
			Authentication authenticationData = (Authentication) getAuthenticationData();
			if (authenticationData.getMode() == "LDAP") {
				if (authenticationData.getLdapcreationmode().equals("AutoSubscription")) {
					// Get user data
					// if ok: insert it in the users table with the default role
					result = "OK";
				}
			}
		} catch(Exception e) {
			log(ERROR, "AutoSubscribeLdapUser service operation has failed", e);
		}
		return result;
	}
    public String getLdapUserInfo(String login, String password, String user) {
    	String result = null;
		try {
			Authentication authenticationData = (Authentication) getAuthenticationData();
            String mode = authenticationData.getMode();
			if ((mode.equals("LDAP")) || (mode.equals("AD"))) {
                            
                String host = authenticationData.getLdaphost();
                String port = authenticationData.getLdapport();
                String basedn = authenticationData.getLdapbasedn();
                String ldapLogin = "";
                String passwd = password;
                if (authenticationData.getMode().equals("AD")) {
                    ldapLogin = authenticationData.getLdapadminlogin()+ "\\" + login;
                    //passwd = password;
                } else {
                    ldapLogin = login;
                    //passwd = authenticationData.getLdapadminpassword();
                }
                String identifierField = authenticationData.getLdapidentifierfield();
                String firstnameField = authenticationData.getLdapfirstnamefield();
                String lastnameField = authenticationData.getLdaplastnamefield();
                String mailField = authenticationData.getLdapmailfield();
                String defaultRole = authenticationData.getLdapdefaultrole();
                
                String testAuth = testLdapConnection(host,port,basedn,ldapLogin,passwd,identifierField,login);
                if (testAuth == null) {
                    return "Error: Authentication failed";
                }
                
				LdapUser getLdapUserResult = _getLdapUser(host,port,basedn,ldapLogin,passwd,identifierField,user,firstnameField,lastnameField,mailField);
				if (getLdapUserResult != null) {
					log(INFO, "----> " + getLdapUserResult.getIdentifier());
                    String userId = getLdapUserResult.getIdentifier();
                    String firstname = getLdapUserResult.getFirstName();
                    String lastname = getLdapUserResult.getLastName();
                    String mail = getLdapUserResult.getMail();                    
                    String enPasswd = encryptPassword(password);
                    if (firstname == "") {
                        firstname = "User not found";
                    }
                
					result = "{\"mode\":\""+mode+"\", " +
                             "\"login\":\""+userId+"\", " +
                             "\"firstname\": \""+firstname+"\", " +
                             "\"lastname\": \""+lastname+"\", " +
                             "\"mail\": \""+mail+"\"}";
				} else {
                    result = "{\"mode\":\""+mode+"\", " +
                             "\"login\":\""+user+"\", " +
                             "\"firstname\": \"User not found\", " +
                             "\"lastname\": \"\", " +
                             "\"mail\": \"\"}";
				}
			} else if (mode.equals("SQL")) {
                result = "{\"mode\":\""+mode+"\"}";        
			}
		} catch(Exception e) {
			log(ERROR, "authenticateUser service operation has failed", e);
		}
		return result;
	}

}

class LdapUser {
	private String identifier;
	private String firstName;
	private String lastName;
	private String mail;

	public LdapUser(String identifier, String firstName, String lastName, String mail) {
		super();
		this.identifier = identifier;
		this.firstName = firstName;
		this.lastName = lastName;
		this.mail = mail;
	}

	public LdapUser(String identifier) {
		super();
		this.identifier = identifier;
	}

	public String getIdentifier() {
		return identifier;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getMail() {
		return mail;
	}

	public void setIdentifier(String identifier) {
		this.identifier = identifier;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

}