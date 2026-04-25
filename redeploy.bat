@echo off
setlocal

:: --- Configuration ---
set GIT_EXE="C:\Program Files\Git\cmd\git.exe"
set DOCKER_EXE="C:\Program Files\Docker\Docker\resources\bin\docker.exe"
set AWS_EXE="C:\Program Files\Amazon\AWSCLIV2\aws.exe"
set TERRAFORM_EXE="C:\terraform\terraform.exe"

set REGION=us-east-1
set REPO_URL=102915632264.dkr.ecr.us-east-1.amazonaws.com/omrani-shop-repo
set REGISTRY=102915632264.dkr.ecr.us-east-1.amazonaws.com

set OMRANI_DIR=c:\Users\bacca\Desktop\omranis
set TERRAFORM_DIR=c:\Users\bacca\Desktop\terraform\tf-free-deploy

echo [1/6] Committing new version...
cd /d %OMRANI_DIR%
%GIT_EXE% add .
%GIT_EXE% commit -m "feat: deploy new version including shop, profile, and UI providers updates"

echo [2/6] Authenticating Docker with ECR...
%AWS_EXE% ecr get-login-password --region %REGION% | %DOCKER_EXE% login --username AWS --password-stdin %REGISTRY%
if %errorlevel% neq 0 ( echo AWS/Docker login failed! & pause & exit /b )

echo [3/6] Building Docker image...
%DOCKER_EXE% build -t omrani-shop .
if %errorlevel% neq 0 ( echo Docker build failed! & pause & exit /b )

echo [4/6] Tagging and Pushing to ECR...
%DOCKER_EXE% tag omrani-shop:latest %REPO_URL%:latest
%DOCKER_EXE% push %REPO_URL%:latest
if %errorlevel% neq 0 ( echo Docker push failed! & pause & exit /b )

echo [5/6] Tainting EC2 instance in Terraform...
cd /d %TERRAFORM_DIR%
%TERRAFORM_EXE% taint module.ec2.aws_instance.app

echo [6/6] Applying Terraform changes...
%TERRAFORM_EXE% apply -auto-approve

echo.
echo Deployment Complete!
pause
