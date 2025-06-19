#!/bin/sh

error_occurred=0

docker_compose_has_changes=false
docker_compose_backed_up=true
cmp --silent default.docker-compose.yml docker-compose.yml || docker_compose_has_changes=true
if [ "$docker_compose_has_changes" = true ]; then
  echo "docker-compose.yml has changed from default.docker-compose.yml" 
  cmp --silent docker-compose.yml.huskybackup docker-compose.yml || docker_compose_backed_up=false
  if [ "$docker_compose_backed_up" = true ]; then
    echo "docker-compose.yml has changes that are already backed up in a docker-compose.yml.huskybackup. ignoring." 
  fi
  if [ "$docker_compose_backed_up" = false ]; then
    echo "docker-compose.yml has changes that aren't backed up in a docker-compose.yml.huskybackup" 
    echo "backing up docker-compose.yml to docker-compose.yml.huskybackup. Find pre-existing backups in ./backups/dockercompose" 
    mkdir -p ./backups/dockercompose
    [ -e docker-compose.yml.huskybackup ] && cp --backup=numbered docker-compose.yml.huskybackup ./backups/dockercompose/docker-compose.yml.huskybackup
    cp docker-compose.yml docker-compose.yml.huskybackup || error_occurred=1
  fi
  echo "ensuring default docker-compose.yml is maintained in repo" 
  cp default.docker-compose.yml docker-compose.yml || error_occurred=1
  git add docker-compose.yml
fi

env_has_changes=false
env_backed_up=true
cmp --silent default.env .env || env_has_changes=true
if [ "$env_has_changes" = true ]; then
  echo ".env has changed from default.env" 
  cmp --silent .env.huskybackup .env || env_backed_up=false
  if [ "$env_backed_up" = true ]; then
    echo ".env has changes that are already backed up in a .env.huskybackup. ignoring." 
  fi
  if [ "$env_backed_up" = false ]; then
    echo ".env has changes that aren't backed up in a .env.huskybackup" 
    echo "backing up .env to .env.huskybackup. Find pre-existing backups in ./backups/env" 
    mkdir -p ./backups/env
    [ -e .env.huskybackup ] && cp --backup=numbered .env.huskybackup ./backups/dockercompose/.env.huskybackup
    cp .env .env.huskybackup || error_occurred=1
  fi
  echo "ensuring default .env is maintained in repo" 
  cp default.env .env || error_occurred=1
  git add .env
fi

secret_env_has_changes=false
secret_env_backed_up=true
cmp --silent default.env .env.secret || secret_env_has_changes=true
if [ "$secret_env_has_changes" = true ]; then
  echo ".env has changed from default.env.secret" 
  cmp --silent .env.secret.huskybackup .env.secret || secret_env_backed_up=false
  if [ "$secret_env_backed_up" = true ]; then
    echo ".env has changes that are already backed up in a .env.secret.huskybackup. ignoring." 
  fi
  if [ "$secret_env_backed_up" = false ]; then
    echo ".env has changes that aren't backed up in a .env.secret.huskybackup" 
    echo "backing up .env.secret to .env.secret.huskybackup. Find pre-existing backups in ./backups/env" 
    mkdir -p ./backups/env
    [ -e .env.secret.huskybackup ] && cp --backup=numbered .env.secret.huskybackup ./backups/dockercompose/.env.huskybackup
    cp .env.secret .env.secret.huskybackup || error_occurred=1
  fi
  echo "ensuring default .env.secret is maintained in repo" 
  cp default.env.secret .env.secret || error_occurred=1
  git add .env.secret
fi

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

if [ -e docker-compose.yml.huskybackup ]; then
  echo "restoring backed up docker-compose.yml" 
  cp docker-compose.yml.huskybackup docker-compose.yml || error_occurred=1
fi

if [ -e .env.huskybackup ]; then
  echo "restoring backed up .env" 
  cp .env.huskybackup .env || error_occurred=1
fi

if [ -e .env.secret.huskybackup ]; then
  echo "restoring backed up .env.secret" 
  cp .env.secret.huskybackup .env.secret || error_occurred=1
fi

if [ $error_occurred -ne 0 ]; then
  echo "failed to run pre-commit checks"
  exit 1
fi