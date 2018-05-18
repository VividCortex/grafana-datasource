#!/bin/bash -e

if [ "$CIRCLE_BRANCH" != "master" ]; then
    echo "The release should be performed from the master branch"
    exit 1
fi

# Look for the bump type in the commit message.
BUMP_LEVEL=$(git log -1 --pretty=%B | egrep -e "(?:\[bump:)(major|minor|patch)(?:\])" || true) &>/dev/null
if [ $? -ne "0" ] || [ "$BUMP_LEVEL" == "" ]; then
    echo "There is no bump version in the log message, defaulting to 'patch'."
    BUMP_LEVEL="patch"
fi

yarn "release:$BUMP_LEVEL"

git add .

git commit -m "$BUMP_LEVEL release"
