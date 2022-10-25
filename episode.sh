YEAR=`date +"%Y"`

if [ -z $2 ]; then
	DAY=`date +"%Y-%m-%d"`
else
	DAY=`date -v+$2d +"%Y-%m-%d"`
fi

NEWARTICLE=`hugo new episodes/${YEAR}/${DAY}-$1.md`
GETPATH=${NEWARTICLE% created}

echo ${NEWARTICLE}
/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl ${GETPATH}