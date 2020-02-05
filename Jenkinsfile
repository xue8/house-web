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
        git(credentialsId: '73a7f53f-9c2b-4d1c-82a5-7fd99ac744a8', branch: 'master', url: 'git@github.com:xue8/house-web.git')
        sh '''git clone git@e.coding.net:mmnn/house-web.git
\\cp -r dist/* house-web/
cd house-web
git push origin master'''
        echo '部署完成'
      }
    }
  }
}