#/bin/sh

USER=$1
HOST=$2

TARGET=$1@$2
#TARGET=`cat /root/.ssh/id_dsa.pub | sed -e "s/.*= //"`
AUTHFILE=`ls /root/.ssh/authorized_keys`

if [ "$AUTHFILE" ]; then
        perl -p -i -e "s/.*= $TARGET.*\n$//" /root/.ssh/authorized_keys
fi

cat /root/.ssh/id_dsa.pub.$1.$2 | sed -e "s/= .*@.*/= $TARGET/" >> /root/.ssh/authorized_keys
