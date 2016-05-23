#/bin/sh

grep "name=\"_Toc_IMG" user_guide.html | sed -e "s/name=\"/href=\"#/" | sed -e "s/\t*//" > figure_list.html
sed -i -ne '/<!-- LIST OF FIGURE START -->/ {p; r figure_list.html' -e ':a; n; /<!-- LIST OF FIGURE END -->/ {p; b}; ba}; p' user_guide.html
rm -f figure_list.html
