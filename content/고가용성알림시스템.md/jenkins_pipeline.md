---
title: Jenkins Pipeline Code
weight: 6
---
### Jenkins Pipeline Code
```
pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS_ID = 'harbor-credential' // Docker 레지스트리 인증 정보 ID
        IMAGE_NAME = 'was' // Docker 이미지 이름
        TAG = 'latest' // Docker 이미지 태그
        REGISTRY_URL = 'harbor.dragonhailstone.org:9092' // Harbor 주소
        PROJECT = 'coin_alarm'
    }
    stages {
        stage("Permission") {
            steps {
                sh "chmod +x ./gradlew"
            }
        }
        stage("Compile") {
            steps {
                sh "./gradlew compileJava"
            }
        }
        stage("Gradle Build") {
            steps {
                sh "./gradlew clean build"
            }
        }
        stage("Build image") {
            steps {
                script {
                    def app = docker.build("${REGISTRY_URL}/${PROJECT}/${IMAGE_NAME}:${TAG}")
                }
            }
        }
        stage("Push image") {
            steps {
                script {
                    docker.withRegistry("http://${REGISTRY_URL}", DOCKER_CREDENTIALS_ID) {
                        def app = docker.image("${REGISTRY_URL}/${PROJECT}/${IMAGE_NAME}:${TAG}")
                        app.push()
                    }
                }
            }
        }
    }
}
```
