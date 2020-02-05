pipeline {
  agent any
  stages {
    stage('检出') {
      steps {
        checkout([$class: 'GitSCM', branches: [[name: env.GIT_BUILD_REF]], 
                                                                                                                                                                                                                                                            userRemoteConfigs: [[url: env.GIT_REPO_URL, credentialsId: env.CREDENTIALS_ID]]])
      }
    }
    stage('构建') {
      steps {
        echo '构建中...'
        sh '''npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install -g vue-cli
docker version
npm version
npm install
npm run build
ls'''
        echo '构建完成.'
        script {
          def exists = fileExists 'README.md'
          if (!exists) {
            writeFile(file: 'README.md', text: 'Helloworld')
          }
        }

        archiveArtifacts(artifacts: 'README.md', fingerprint: true)
      }
    }
    stage('测试') {
      steps {
        echo '单元测试中...'
        echo '单元测试完成.'
      }
    }
    stage('部署') {
      steps {
        echo '部署中...'
        sh '''git clone https://$MYGIT_USR:"$MYGIT_PSW"@e.coding.net:mmnn/house-web.git
\\cp -r dist/* house-web/
cd house-web
git push https://$MYGIT_USR:"$MYGIT_PSW"@e.coding.net:mmnn/house-web.git'''
        echo '部署完成'
      }
    }
  }
  environment {
    MYGIT = credentials('fa62c2d3-842d-4b0a-a94f-e173748ea809')
  }
}