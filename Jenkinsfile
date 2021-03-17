def riqi=''
import java.text.SimpleDateFormat
pipeline {
    agent {
        label "$agent"
    }

    environment {
        server_name = "${JOB_BASE_NAME}"
    }
    
    stages {
        stage('get user') {
            steps{
                wrap([$class: 'BuildUser']) {
                    script {
                        BUILD_USER = "${env.BUILD_USER}"
                    }
                }
            }
        }
        stage('notify wechat') {
            steps {
                sh "wechat ${server_name} 开始 ${BUILD_USER} ${branch} ${base}${profile} '[查看任务]($JOB_URL)'"
            }
        }
        stage('npm build') {
            steps {
                sh  "rm  -rf  node_modules"
                sh "cnpm install"
                sh "npm run build"
            }
        }
        stage('backup') {
            steps {
                script{
                    def dateFormat = new SimpleDateFormat("yyyyMMdd")
                    def date = new Date()
                    riqi=dateFormat.format(date)
                }
                sh "cp -r /data/saas/front/pi /data/saas/front/backup/pi${riqi}${BUILD_NUMBER}"
            }
        }
        stage('deploy') {
            steps {
                sh "rm -rf /data/saas/front/pi/*"
                sh "cp -r dist/* /data/saas/front/pi/"
                sh "chmod -R 777 /data/saas/front"
            }
        }
        stage('clean up') {
            steps {
                cleanWs()
            }
        }
    }
    
    post {
        success {
            sh "wechat ${server_name} 成功 ${BUILD_USER} ${branch} ${base}${profile} '[查看任务]($JOB_URL)'"
        }
        failure {
            sh "wechat ${server_name} 失败 ${BUILD_USER} ${branch} ${base}${profile} '[查看任务]($JOB_URL)'"
        }
    }
}