#/bin/sh
MAC=$1
NEWBR=$2
OLDBR=$3
STRIPEDMAC=`echo $MAC | sed -e "s/^../../"`
VNET=`ifconfig | grep -i $STRIPEDMAC | sed -e "s/ .*//"`
if [ "$VNET" ]; then
	brctl delif $OLDBR $VNET
	brctl addif $NEWBR $VNET
fi

