#!/usr/bin/env bash
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  bin="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$bin/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symli
nk file was located
done
bin="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
cd $bin

export LANG=en_US.UTF8
export CFG_PATH=/project/config/service.conf
./write_csv_to_db
