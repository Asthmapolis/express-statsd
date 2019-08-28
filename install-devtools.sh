#!/bin/bash

###############################################################################
# INSTALL DEVELOPMENT TOOLS
###############################################################################

# Check for pre-req tools
for _tool in nvm
do
  if ! command -v "${_tool}" >/dev/null 2>&1
  then
    echo "ERROR: ${_tool} is not installed or available in PATH" >&2
    return 1
  fi
done

# Reload NVM
nvm deactivate || return 1
nvm install    || return 1
nvm use        || return 1

# Verify NPM version
declare npm_version_current
declare npm_version_wanted
npm_version_current=$(npm --version)
npm_version_wanted=$(cat .nvmrc | tail -1)
if [[ "${npm_version_current}" != "${npm_version_wanted}" ]]
then
  echo "Reseting NPM version to ${npm_version_wanted} ..."
  npm install --global npm@${npm_version_wanted} || return 1
fi

# Install NPM Packages
if test -e ./package-lock.json
then
  npm ci || return 1
else
  npm install || return 1
fi

# Set environment variables used
declare _npmbin="$(npm bin)"
if ! echo -n "${PATH}" | grep "${_npmbin}" >/dev/null 2>&1
then
  export PATH="$(npm bin):${PATH}"
fi

# Done
return 0

###############################################################################
