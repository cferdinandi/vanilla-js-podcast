YEAR=`date +"%Y"`

if [ -z $2 ]; then
	DAY=`date +"%Y-%m-%d"`
else
	DAY=`date -v+$2d +"%Y-%m-%d"`
fi

# Episode
NEWARTICLE=`hugo new episodes/${YEAR}/${DAY}-$1.md`
GETPATH=${NEWARTICLE% created}

# Transcript
TRANSCRIPT=`mkdir -p static/transcripts/${YEAR} && touch static/transcripts/${YEAR}/${DAY}-$1.txt`

echo ${NEWARTICLE}
/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl ${GETPATH}

echo static/transcripts/${YEAR}/${DAY}-$1.txt created
/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl static/transcripts/${YEAR}/${DAY}-$1.txt