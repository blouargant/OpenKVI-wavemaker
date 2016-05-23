#/bin/sh

CHECK1=`grep "export LANG=" /root/.bashrc`
CHECK2=`grep "export LANG=en_EN.UTF-8" /root/.bashrc`

if [ -z "$CHECK1" ]; then
	cho "export LANG=en_EN.UTF-8" >> /root/.bashrc
elif [ -z "$CHECK2" ]; then
	perl -p -i -e 's/export LANG=.*/export LANG=en_EN.UTF-8/' /root/.bashrc
fi
