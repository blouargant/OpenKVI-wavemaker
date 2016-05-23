#/bin/sh

# list physical interfaces
INETLIST=`ls -l /sys/class/net/ | grep -v virtual | sed -e "s/total.*//" | sed -e "s/ ->.*//" | sed -e "s/.* //" | grep -v "^$"`
VNETLIST=`ls -l /sys/class/net/ | grep virtual | sed -e "s/total.*//" | sed -e "s/ ->.*//" | sed -e "s/.* //" | grep -v "^$"`

# get pci id:
PHYS=""
ETH_LIST=""
for INET in $INETLIST; do
	BUS=`ls -l /sys/class/net/$INET/device | sed -e "s/.*-> //" | sed -e "s/.*\///"`
	SUBSYSTEM=`ls -l /sys/class/net/$INET/device/ | grep "subsystem " | sed -e "s/.* -> //" | sed -e "s/.*\///"`
	STATE=`cat /sys/class/net/$INET/operstate`
	DUPLEX=`cat /sys/class/net/$INET/duplex 2>/dev/null`
	SPEED=`cat /sys/class/net/$INET/speed 2>/dev/null`
	BRIDGE=`grep "BRIDGE=" /etc/sysconfig/network-scripts/ifcfg-$INET | sed -e 's/BRIDGE=//' | sed -e 's/"//g'`
	if [ "$STATE" = "up" ]; then
		ETH_LIST="$ETH_LIST $INET"
	fi
	if [ "$SUBSYSTEM" = "pci" ]; then
		INFOS=`lspci -s $BUS | sed -e "s/.*://" | sed -e "s/^ *//"`
	elif [ "$SUBSYSTEM" = "usb" ]; then
		USB_INFOS=`lsusb -s $BUS | sed -e "s/.*://" | sed -e "s/^ *//"`
		INFOS="USB Device: "+$USB_INFOS 
	fi
	if [ "$PHYS" = "" ]; then 
		PHYS="{\"name\":\"$INET\", \"desc\":\"$INFOS\", \"state\":\"$STATE\", \"speed\":\"$SPEED\", \"duplex\":\"$DUPLEX\", \"bridge\":\"$BRIDGE\"}"
	else
		PHYS=$PHYS", {\"name\":\"$INET\", \"desc\":\"$INFOS\", \"state\":\"$STATE\", \"speed\":\"$SPEED\", \"duplex\":\"$DUPLEX\", \"bridge\":\"$BRIDGE\"}"
	fi
done

VIRTUALS=""
for VNET in $VNETLIST; do
	if [ "$VIRTUALS" = "" ]; then 
		VIRTUALS="{\"name\":\"$VNET\"}"
	else
		VIRTUALS=$VIRTUALS", {\"name\":\"$VNET\"}"
	fi
done

BRIDGE_LIST=`brctl show 2>/dev/null > /tmp/brlist; sed -i "1d" /tmp/brlist; perl -p -i -e "s/\n/;/g;" /tmp/brlist 2>/dev/null; cat /tmp/brlist | sed -e "s/\t\t*/:/g" | sed -e "s/;:/,/g" | sed -e "s/;/\n/g" | sed -e "s/:/ /g" | awk '{print $1"="$3";"$4}'`

BRLIST=""
for BRIDGE in $BRIDGE_LIST; do
	BR_IFACE_LIST=""
	BR=`echo "$BRIDGE" | sed -e "s/=.*//"`
	IFACE_LIST=`echo "$BRIDGE" | sed -e "s/.*=//" | sed -e "s/.*;//" |sed -e "s/,/ /g"`
	STP=`echo "$BRIDGE" | sed -e "s/.*=//" | sed -e "s/;.*//"`
	STATE=`cat /sys/class/net/$BR/operstate`
	for IFACE in $IFACE_LIST; do
		if [ "$BR_IFACE_LIST" = "" ]; then
			BR_IFACE_LIST="\"$IFACE\""
		else 
			BR_IFACE_LIST="$BR_IFACE_LIST, \"$IFACE\""
		fi
	done
	if [ "$STATE" != "down" ]; then
		INFO="{\"name\":\"$BR\", \"inetlist\":[$BR_IFACE_LIST], \"stp\":\"$STP\", \"state\":\"$STATE\"}"
		if [ "$BRLIST" = "" ]; then
			BRLIST=$INFO
		else 
			BRLIST=$BRLIST", "$INFO
		fi
	fi
done

#RESULT="{\"physicals\":[$PHYS], \"bridges\":[$BRLIST], \"virtuals\":[$VIRTUALS]}"
RESULT="{\"physicals\":[$PHYS], \"bridges\":[$BRLIST]}"
echo $RESULT


