#/bin/sh

VERSION=$1

rm -f OpenKVI_User_Guide_v$VERSION.docx
sed -e "s/resources\/help\/user_guide\///" user_guide.html > user_guide.html.pandoc
pandoc --toc -c help.custom.css -s -S -f html user_guide.html.pandoc -t docx -o OpenKVI_User_Guide_v$VERSION.docx
