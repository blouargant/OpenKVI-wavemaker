#/bin/sh
MAC=$1
HOSTNET=$2
IP=""
if [ -e "/usr/sbin/arping2" ]; then
	IP=`arping2 -c 1 -i $HOSTNET $MAC | head -n2 | tail -n1 | sed -e "s/.*from //" | sed -e "s/ (.*//"`
fi
if [ "$IP" == "" ]; then
	STRIPEDMAC=`echo $MAC | sed -e "s/^../../"`
	VNET=`ifconfig 2>/dev/null | grep -i $STRIPEDMAC | sed -e "s/ .*//"`
	IP=`ping -b -I $VNET -W 1 -c1 255.255.255.255 2>/dev/null | head -n2 | tail -n1 | sed -e "s/.*from //" | sed -e "s/:.*//"`
fi

echo $IP
