
package com.openkvidb.data;



/**
 *  openkviDB.Vms
 *  04/23/2016 17:58:24
 * 
 */
public class Vms {

    private Integer id;
    private Integer memory;
    private Integer nbcpu;
    private String freqcpu;
    private String arch;
    private String network;
    private String cdrom;
    private String name;
    private String server;
    private String disks;
    private String displayedname;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getMemory() {
        return memory;
    }

    public void setMemory(Integer memory) {
        this.memory = memory;
    }

    public Integer getNbcpu() {
        return nbcpu;
    }

    public void setNbcpu(Integer nbcpu) {
        this.nbcpu = nbcpu;
    }

    public String getFreqcpu() {
        return freqcpu;
    }

    public void setFreqcpu(String freqcpu) {
        this.freqcpu = freqcpu;
    }

    public String getArch() {
        return arch;
    }

    public void setArch(String arch) {
        this.arch = arch;
    }

    public String getNetwork() {
        return network;
    }

    public void setNetwork(String network) {
        this.network = network;
    }

    public String getCdrom() {
        return cdrom;
    }

    public void setCdrom(String cdrom) {
        this.cdrom = cdrom;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getServer() {
        return server;
    }

    public void setServer(String server) {
        this.server = server;
    }

    public String getDisks() {
        return disks;
    }

    public void setDisks(String disks) {
        this.disks = disks;
    }

    public String getDisplayedname() {
        return displayedname;
    }

    public void setDisplayedname(String displayedname) {
        this.displayedname = displayedname;
    }

}
