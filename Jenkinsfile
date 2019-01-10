pipeline {
    agent any
    parameters {
        choice choices: ['Dev', 'T1', 'T2'], description: '发布环境', name: 'ENV'
        gitParameter branch: '', branchFilter: '.*', defaultValue: '', description: 'Git分支名称', name: 'BRANCH', quickFilterEnabled: false, selectedValue: 'NONE', sortMode: 'NONE', tagFilter: '*', type: 'PT_BRANCH_TAG'
    }
    stages {
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Stage Init') {
            steps {
                . ~/.nvm/nvm.sh
                node --version
                npm --version
                npm install
            }
        }
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}