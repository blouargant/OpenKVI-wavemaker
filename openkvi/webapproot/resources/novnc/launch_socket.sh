#/bin/sh

OPT=$1
if [ "$OPT" = "-v" ]; then
	TARGET=$2
	VERBOSE="yes"

elif [ "$OPT" = "-h" ]; then
	echo "./launch_socket.sh IPADDR:VNCPORT"
	echo "ex: ./launchh_socket.sh 192.168.0.1:0"
	echo "Options: "
	echo "  -h: display this message"
	echo "  -v: enable verbose mode"
	exit
else
	TARGET=$1
fi


if [ -z "$TARGET" ]; then
	echo "Error: missing target argument"
	exit -1
fi

NOCLEAN="0"
DIR=`echo $0 | sed -e "s/launch_socket.sh//" | sed -e "s/\/$//" 2>/dev/null`

if [ -z "$DIR" ]; then
	DIR="."
fi


if [ -e "/bin/netstat" ]; then
	NET_TOOL="netstat -pant 2>/dev/null"
else
	NET_TOOL="ss -pant"
fi

function execute()
{
for i in {8700..65000}
do
	if [ "$VERBOSE" ]; then
		echo "trying $i"
	fi
	OTHER_USED=$($NET_TOOL | grep ":$i " | grep LISTEN)
	CERT="/etc/pki/tls/certs/openkvi_server.crt"
	KEY="/etc/pki/tls/private/openkvi_server.key"
	if [ -z "$OTHER_USED" ]; then
		if [ "$VERBOSE" ]; then
			python $DIR/websockify/run -D $i $TARGET --cert=$CERT --key=$KEY
		else
			python $DIR/websockify/run -D $i $TARGET --cert=$CERT --key=$KEY 1>/dev/null 2>&1
		fi
		
		if [ "$NET_TOOL" == "netstat" ]; then
			PYPID=$($NET_TOOL | grep ":$i .*LISTEN.*" 2>/dev/null | sed -e "s/.* \([0-9]*\)\/python/\1;/" 2>/dev/null | sed -e "s/;.*//" 2>/dev/null)
		else
			PYPID=$($NET_TOOL | grep ":$i " | grep "LISTEN" | sed -e "s/.*pid=//" | sed -e "s/,.*//")
		fi
		echo "PID=$PYPID;PORT=$i;TARGET=$TARGET"
		break
	fi
done
}

execute
