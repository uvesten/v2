#!/bin/bash
set -e
set -u
set -x

# This script is called by `make dev-build`
export VERSION="dev-$(date +%s)"
export NAMESPACE="development"
declare -a targets=("www" "faraday" "account/api" "account/server" "email/server" "myaccount" "whoami" "company/server" "company/api" "ical" "superpowers" "sms/server" "bot/server" "app")

echo "Running database migration"
migrate -url=$ACCOUNT_MYSQL_CONFIG -path=$STAFFJOY/account/migrations/ up
migrate -url=$COMPANY_MYSQL_CONFIG -path=$STAFFJOY/company/migrations/ up

## now loop through the above array
for target in "${targets[@]}"
do
    # Remove slashes from service
    service=$(echo $target | sed 's/\///g')
    export service
    # Run the build and upload to GKE
    #bazel run //$target:docker
    # bazel run //$target:docker
    bazel build //$target:docker
    cat bazel-bin/$(echo $target)/docker | sed -e 's/tag ${name}/tag sha256:${name}/' > .docker.v2
    sudo mv .docker.v2 bazel-bin/$(echo $target)/docker
    chmod +x bazel-bin/$(echo $target)/docker
    bazel-bin/$(echo $target)/docker
    # Tag so we can track the deploy in Kubernetes
    # (bazel converts slash to an underscore)
    docker tag bazel/$(echo $target):docker localhost:5000/$service:$VERSION
    docker push localhost:5000/$service:$VERSION
    # Deploy service to Kubernetes
    ./ci/deploy-service.sh
done

echo "Finished deploying version ${VERSION} - check the status at http://kubernetes.staffjoy-v2.local"

