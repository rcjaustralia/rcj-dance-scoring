PROJECT_NAME=rcja_robo
DOCKER_NAMESPACE=rcjadance_default
JSLINT_ARGS=--node --nomen --indent=2
JS_FILES=app.js lib/*/*.js
ROOT := $(shell pwd)
PRODUCTION_CONTAINER_NAME=robocup
BASE_IMAGE=mhart/alpine-node:6.3.1

DOCKERRUN := docker run -it --rm \
	-v ${ROOT}:/usr/src/app \
	-w /usr/src/app 

DOCKERFULLRUN := $(DOCKERRUN) ${PROJECT_NAME}_work_image

npm: build/rcja_robo_work_image 
	$(DOCKERRUN) --entrypoint="sh" ${PROJECT_NAME}_work_image -c "apk add --no-cache --virtual .npm-deps git python make gcc linux-headers alpine-sdk && /usr/bin/npm set progress=false && /usr/bin/npm install"

clean:
	rm -rf build \
	&& docker rmi rcja_robo_work_image > /dev/null 2>&1 || true

ensureNetwork:
	docker network create $(DOCKER_PROJECT_NAME) > /dev/null 2>&1 || true;

build/rcja_robo_work_image: ensureNetwork
	mkdir -p ${ROOT}/build
	docker rmi -f rcja_robo_work_image > /dev/null 2>&1 || true
	docker build -t rcja_robo_work_image .
	docker inspect -f "{{ .ID }}" rcja_robo_work_image > build/rcja_robo_work_image

minikubeStart:
	minikube start --profile robocup --vm-driver virtualbox --kubernetes-version v1.7.5 --memory 3072

build:
	eval $$(minikube docker-env) && \
	docker build -t davefinster/rcja-dance:latest .

push: build
	eval $$(minikube docker-env) && \
	docker push davefinster/rcja-dance:latest

applyBase:
	kubectl apply -f ./specs/minikube/spec.yml

kube-cmd:
	trap 'kubectl delete pod robocup-dance-dev' 2 && \
	kubectl create -f specs/minikube/cmd.yml && sleep 1 && kubectl attach -i -t --pod-running-timeout=1m0s robocup-dance-dev;
	kubectl delete pod robocup-dance-dev;

kube-npm:
	eval $$(minikube docker-env --shell bash) && \
	docker run -it --rm -v /mnt/Projects/rcj-dance-scoring:/usr/src/app -w /usr/src/app --entrypoint="sh" $(BASE_IMAGE) -c "apk add --no-cache --virtual .npm-deps git python make gcc linux-headers alpine-sdk && npm set progress=false && cd ../ && mkdir npmpack && cd npmpack && cp ../app/package.json ./ && npm install && rm package.json && tar -czvf npm.tar.gz * && mv npm.tar.gz ./../app/" && \
	tar -zxvf npm.tar.gz && \
	rm npm.tar.gz