PROJECT_NAME=rcja_robo
DOCKER_NAMESPACE=rcjadance_default
JSLINT_ARGS=--node --nomen --indent=2
JS_FILES=app.js lib/*/*.js
ROOT := $(shell pwd)
PRODUCTION_CONTAINER_NAME=robocup

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