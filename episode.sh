YEAR=`date +"%Y"`
TODAY=`date +"%Y-%m-%d"`

NEWARTICLE=`hugo new episodes/${YEAR}/${TODAY}-$1.md`
GETPATH=${NEWARTICLE% created}

echo ${NEWARTICLE}
/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl ${GETPATH}