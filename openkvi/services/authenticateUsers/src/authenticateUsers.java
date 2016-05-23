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
import com.openkvidb.data.Users;


public class authenticateUsers extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {
    /* Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;
     *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation
     */
    public authenticateUsers() {
       super(INFO);
    }
    
    private String insertUserInDB(String login, String password, String role, String firstname, String lastname, String mail, String group) {
        OpenkviDB service = (OpenkviDB) RuntimeAccess.getInstance().getServiceBean("openkviDB");
		service.begin();
		Session session = service.getDataServiceManager().getSession();
		String result = null;

		try {
            //log(INFO, "Trying to insert user info from openkviDB");
			Users user = new Users();
            user.setLogin(login);
            user.setPassword(password);
            user.setRole(role);
            user.setFirstname(firstname);
            user.setLastname(lastname);
            user.setMail(mail);
            user.setGroupid(group);
            session.save(user);
            service.commit();
            result = "done";
		}
		catch (Exception ex) {
			log(ERROR, "insertUserInDB has failed", ex);
			service.rollback();
		}
		return result;
	}

    private String updateUserInDB(Users userData, String encryptedPassword) {
        OpenkviDB service = (OpenkviDB) RuntimeAccess.getInstance().getServiceBean("openkviDB");
    	service.begin();
		Session session = service.getDataServiceManager().getSession();
		String result = null;

		try {
            //log(INFO, "Trying to update user info  in openkviDB");
			userData.setPassword(encryptedPassword);
            session.update(userData);
            service.commit();
            result = "done";
            //log(INFO, "update password in data base  successful !");
		}
		catch (Exception ex) {
			log(ERROR, "updateUserInDB has failed", ex);
			service.rollback();
		}
		return result;
	}

    private Users getUserFromDB(String login) {
    	OpenkviDB service = (OpenkviDB) RuntimeAccess.getInstance().getServiceBean("openkviDB");
		service.begin();
		Session session = service.getDataServiceManager().getSession();
		Users result = null;

		try {
            //log(INFO, "Trying to get user info from openkviDB");
            Query query = session.createQuery("from Users user where user.login = :login");
            query.setString("login", login);
			if (query.uniqueResult() != null) {
				result = (Users) query.uniqueResult();
			}
			service.commit();
            
		}
		catch (Exception ex) {
			log(ERROR, "getUserFromDB has failed", ex);
			service.rollback();
		}
		return result;
	}
    private String encryptPassword(String password) {
		return SystemUtils.encrypt(password);
	}
    
    private LdapUser _getLdapUser(String host, String port, String baseDn, String adminLogin, String adminPassword, String identifier, String searchedUser) {
		return _getLdapUser(host, port, baseDn, adminLogin, adminPassword, identifier, searchedUser, null, null, null);
	}

	private LdapUser _getLdapUser(String host, String port, String baseDn, String adminLogin, String adminPassword, String identifier, String searchedUser, String firstNameField, String lastNameField, String mailField) {
		// http://www.frank4dd.com/howto/various/ad_ldaptest_java.htm
		LdapUser result  = null;
		try {
			//log(INFO, "Starting _getLdapUser");

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
				//log(INFO, "Connecting to host " + host + " at port " + port + "...");

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

					//log(INFO, "Found Object: " + dn + "," + baseDn);
					result = new LdapUser(searchedUser);
					if (attrs != null) {
						// we have some attributes for this object
						NamingEnumeration ae = attrs.getAll();
						while (ae.hasMoreElements()) {
							Attribute attr = (Attribute)ae.next();
							String attrId = attr.getID();
							if (attrId.equals(firstNameField) || attrId.equals(lastNameField) || attrId.equals(mailField)) {
								//log(INFO, "Found Attribute: " + attrId);
								Enumeration vals = attr.getAll();
								while (vals.hasMoreElements()) {
									String attrVal = (String)vals.nextElement();
									//log(INFO, attrId + ": " + attrVal);
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

    public Authentication getAuthenticationData() {
    	OpenkviDB service = (OpenkviDB) RuntimeAccess.getInstance().getServiceBean("openkviDB");
		service.begin();
		Session session = service.getDataServiceManager().getSession();
		Authentication result = null;

		try {
            //log(INFO, "Trying to get auth mode");
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
	public String testLdapConnection(String host, String port, String baseDn, String adminLogin, String adminPassword, String identifier, String searchedUser) {
        if (_getLdapUser(host, port, baseDn, adminLogin, adminPassword, identifier, searchedUser) != null) {
			return "OK";
		} else {
			return null; 
		}
	}
    
    public String authenticateUser(String user, String password) {
		String result = null;
		try {
			//log(INFO, "Starting authenticateUser");
			Authentication authenticationData = (Authentication) getAuthenticationData();
            String mode = authenticationData.getMode();
            Boolean subscribed = false;
			if ((mode.equals("LDAP")) || (mode.equals("AD"))) {
                            
                String host = authenticationData.getLdaphost();
                String port = authenticationData.getLdapport();
                String basedn = authenticationData.getLdapbasedn();
                String login = "";
                String passwd = password;
                if (authenticationData.getMode().equals("AD")) {
                    login = authenticationData.getLdapadminlogin()+ "\\" + user;
                    //passwd = password;
                } else {
                    login = user;
                    //passwd = authenticationData.getLdapadminpassword();
                }
                String identifierField = authenticationData.getLdapidentifierfield();
                String firstnameField = authenticationData.getLdapfirstnamefield();
                String lastnameField = authenticationData.getLdaplastnamefield();
                String mailField = authenticationData.getLdapmailfield();
                String defaultRole = authenticationData.getLdapdefaultrole();
                
				LdapUser getLdapUserResult = _getLdapUser(host,port,basedn,login,passwd,identifierField,user,firstnameField,lastnameField,mailField);
				if (getLdapUserResult != null) {
					
                    String userId = getLdapUserResult.getIdentifier();
                    String firstname = getLdapUserResult.getFirstName();
                    String lastname = getLdapUserResult.getLastName();
                    String mail = getLdapUserResult.getMail();                    
                    String enPasswd = encryptPassword(password);
                
                    Users dbUser = (Users) getUserFromDB(user);
                    if (dbUser == null) {
                        String subscribeMode = authenticationData.getLdapcreationmode();
                        if (subscribeMode.equals("AutoSubscription")) {
                            //log(INFO, "add user info to DB if it does not exist");    
                            String res = insertUserInDB(userId,enPasswd,defaultRole,firstname,lastname,mail,"none");
                            subscribed = true;
                        }
                    } else {
                        //Update User password with the one validated by LDAP authentication
                        // if encrypted passwords mismatch
                        if (! dbUser.getPassword().equals(enPasswd)) {
                            //log(INFO, "update password in data base :"+enPasswd+" != "+dbUser.getPassword());
                            updateUserInDB(dbUser, enPasswd);        
                        }
                        subscribed = true;
                    }
                    
					result = "{\"mode\":\""+mode+"\", " +
                             "\"subscribed\":"+subscribed+", " +
                             "\"login\":\""+userId+"\", " +
                             "\"firstname\": \""+firstname+"\", " +
                             "\"lastname\": \""+lastname+"\", " +
                             "\"password\": \""+enPasswd+"\", " +
                             "\"mail\": \""+mail+"\"}";
				} else {
                    result = "{\"mode\":\""+mode+"\", " +
                             "\"subscribed\":true, " +
                             "\"login\":\""+user+"\", " +
                             "\"firstname\": \"\", " +
                             "\"lastname\": \"\", " +
                             "\"password\": \""+password+"\", " +
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
