#/bin/sh

# exchange ssh key
TARGET=`cat /root/.ssh/id_dsa.pub | sed -e "s/.*== //"`
AUTHFILE=`ls /root/.ssh/authorized_keys`

if [ "$AUTHFILE" ]; then
        perl -p -i -e "s/.*== $TARGET.*\n$//" /root/.ssh/authorized_keys
fi

cat /root/.ssh/id_dsa.pub >> /root/.ssh/authorized_keys

# force Lang to EN
CHECK1=`grep "export LANG=" /root/.bashrc`
CHECK2=`grep "export LANG=en_EN.UTF-8" /root/.bashrc`

if [ -z "$CHECK1" ]; then
	echo "export LANG=en_EN.UTF-8" >> /root/.bashrc
elif [ -z "$CHECK2" ]; then
	perl -p -i -e 's/export LANG=.*/export LANG=en_EN.UTF-8/' /root/.bashrc
fi
