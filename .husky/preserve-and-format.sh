#!/bin/sh

error_occurred=0

backup_file() {
  has_changes=false
  backed_up=true
  filename=$1;
  dirname=$2;
  cmp --silent ${dirname}official_${filename} ${dirname}${filename} || has_changes=true
  if [ "$has_changes" = true ]; then
    echo "${dirname}${filename} has changed from ${dirname}official_${filename}" 
    cmp --silent ${dirname}${filename}.huskybackup ${dirname}${filename} || backed_up=false
    if [ "$backed_up" = true ]; then
      echo "${dirname}${filename} has changes that are already backed up in a ${dirname}${filename}.huskybackup. ignoring." 
    fi
    if [ "$backed_up" = false ]; then
      echo "${dirname}${filename} has changes that aren't backed up in a ${dirname}${filename}.huskybackup" 
      echo "backing up ${dirname}${filename} to ${dirname}${filename}.huskybackup. Find pre-existing backups in ./backups/${dirname}${filename}" 
      mkdir -p ./backups/${dirname}
      [ -e ${dirname}${filename}.huskybackup ] && cp --backup=numbered ${dirname}${filename}.huskybackup ./backups/${dirname}${filename}.huskybackup
      cp ${dirname}${filename} ${dirname}${filename}.huskybackup || error_occurred=1
    fi
    echo "ensuring official ${dirname}${filename} is maintained in repo" 
    cp ${dirname}official_${filename} ${dirname}${filename} || error_occurred=1
    git add ${dirname}${filename}
  fi
}

restore_file() {
  filename=$1;
  dirname=$2;
  if [ -e ${dirname}${filename}.huskybackup ]; then
    echo "restoring backed up ${dirname}${filename}" 
    cp ${dirname}${filename}.huskybackup ${dirname}${filename} || error_occurred=1
  fi
}

backup_file docker-compose.yml ./
backup_file .env ./
backup_file .env.secret ./
backup_file Dockerfile proxy/
backup_file default.conf.template proxy/conf.d/templates/
backup_file app.web.conf.template proxy/conf.d/templates/subdomains/
backup_file api.web.conf.template proxy/conf.d/templates/subdomains/
backup_file auth.web.conf.template proxy/conf.d/templates/subdomains/
backup_file staticapp.web.conf.template proxy/conf.d/templates/subdomains/
backup_file vault.web.conf.template proxy/conf.d/templates/subdomains/

temp_commit_created=0
echo "committing staged changes to preserve them for the real commit"
git commit -m 'husky - Save index' --no-verify --quiet || temp_commit_created=1
echo "creating temp file so there is always something to stash"
touch huskytemp || error_occurred=1
echo "stashing changes not already added for the commit" 
git stash --include-untracked -m "husky - unstaged changes" --quiet || error_occurred=1

if [ $temp_commit_created -eq 0 ]; then
  echo "restoring staged changes from the temp commit" 
  git reset --soft HEAD^ --quiet || error_occurred=1
fi

# in git versions 2.25 and later, the following commands can be used instead of the above commands
# echo "stashing staged changes to preserve them for the commit"
# git stash push --staged -m "husky - staged changes"    
# echo "stashing changes not already added for the commit" 
# git stash --include-untracked -m "husky - unstaged changes"
# echo "restoring staged changes from the stash" 
# git stash pop stash@{1}

echo "running format..." 
npm run --silent format || error_occurred=1

echo "adding all files to the commit that were changed by formatting" 
git add .  || error_occurred=1

echo "restoring the stashed changes" 
git stash pop --quiet || error_occurred=1
echo "deleting temp file" 
rm huskytemp || error_occurred=1

restore_file docker-compose.yml ./
restore_file .env ./
restore_file .env.secret ./
restore_file Dockerfile proxy/
restore_file default.conf.template proxy/conf.d/templates/
restore_file app.web.conf.template proxy/conf.d/templates/subdomains/
restore_file api.web.conf.template proxy/conf.d/templates/subdomains/
restore_file auth.web.conf.template proxy/conf.d/templates/subdomains/
restore_file staticapp.web.conf.template proxy/conf.d/templates/subdomains/
restore_file vault.web.conf.template proxy/conf.d/templates/subdomains/

if [ $error_occurred -ne 0 ]; then
  echo "failed to run pre-commit checks"
  exit 1
fi