
package com.openkvidb.data;



/**
 *  openkviDB.Authentication
 *  04/23/2016 17:58:24
 * 
 */
public class Authentication {

    private Integer id;
    private String mode;
    private String ldaphost;
    private String ldapport;
    private String ldapadminlogin;
    private String ldapadminpassword;
    private String ldapbasedn;
    private String ldapcreationmode;
    private String ldapdefaultrole;
    private String ldapidentifierfield;
    private String ldapfirstnamefield;
    private String ldaplastnamefield;
    private String ldapmailfield;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getLdaphost() {
        return ldaphost;
    }

    public void setLdaphost(String ldaphost) {
        this.ldaphost = ldaphost;
    }

    public String getLdapport() {
        return ldapport;
    }

    public void setLdapport(String ldapport) {
        this.ldapport = ldapport;
    }

    public String getLdapadminlogin() {
        return ldapadminlogin;
    }

    public void setLdapadminlogin(String ldapadminlogin) {
        this.ldapadminlogin = ldapadminlogin;
    }

    public String getLdapadminpassword() {
        return ldapadminpassword;
    }

    public void setLdapadminpassword(String ldapadminpassword) {
        this.ldapadminpassword = ldapadminpassword;
    }

    public String getLdapbasedn() {
        return ldapbasedn;
    }

    public void setLdapbasedn(String ldapbasedn) {
        this.ldapbasedn = ldapbasedn;
    }

    public String getLdapcreationmode() {
        return ldapcreationmode;
    }

    public void setLdapcreationmode(String ldapcreationmode) {
        this.ldapcreationmode = ldapcreationmode;
    }

    public String getLdapdefaultrole() {
        return ldapdefaultrole;
    }

    public void setLdapdefaultrole(String ldapdefaultrole) {
        this.ldapdefaultrole = ldapdefaultrole;
    }

    public String getLdapidentifierfield() {
        return ldapidentifierfield;
    }

    public void setLdapidentifierfield(String ldapidentifierfield) {
        this.ldapidentifierfield = ldapidentifierfield;
    }

    public String getLdapfirstnamefield() {
        return ldapfirstnamefield;
    }

    public void setLdapfirstnamefield(String ldapfirstnamefield) {
        this.ldapfirstnamefield = ldapfirstnamefield;
    }

    public String getLdaplastnamefield() {
        return ldaplastnamefield;
    }

    public void setLdaplastnamefield(String ldaplastnamefield) {
        this.ldaplastnamefield = ldaplastnamefield;
    }

    public String getLdapmailfield() {
        return ldapmailfield;
    }

    public void setLdapmailfield(String ldapmailfield) {
        this.ldapmailfield = ldapmailfield;
    }

}
