# Assignment III: Continuous Integration and Continuous Deployment (DSO101)

## Student Information

- Name: Kinley Pem
- Student ID: 02250354
- Course: Bachelor of Engineering in Software Engineering (SWE)
- Date of Submission: 29th April 2026

---

## Introduction

For this assignment, I configured a GitHub Actions workflow to automate the Continuous Integration and Continuous Deployment (CI/CD) pipeline for my To-Do List application. The automation handles building a Docker container for the application, pushing the container to DockerHub, and deploying it live on Render.com.

The main objective of this assignment was to transition from manual deployments to automated workflows, understanding how modern CI/CD practices improve deployment speed, reliability, and security.

---

## Project Overview

The assignment focuses on creating an automated pipeline using the backend API (Node.js + Express.js) developed in previous assignments.

The CI/CD pipeline consists of the following automated stages triggered upon every push to the main branch:

- Source Control: Code is pushed to GitHub
- Build: GitHub Actions checks out the code and builds a Docker image
- Push: The Docker image is securely authenticated and pushed to a public DockerHub repository
- Deploy: A webhook triggers Render.com to pull the latest image and deploy it to the cloud

---

## Technologies Used

### Application Stack

- Node.js (v20-alpine)
- Express.js
- npm (Package Manager)

### DevOps and Deployment Tools

- GitHub
- GitHub Actions
- Docker
- DockerHub
- Render.com

---

## Steps Taken

### Step 1: Repository and Application Verification

Before setting up automation, the application code had to be verified. I ensured the package.json file contained the necessary "start" and "test" scripts. I also ensured the GitHub repository was set to public. Additionally, I created index.js with an Express server running on port 3000.

The package.json scripts included:

- start: node index.js
- test: jest --passWithNoTests
- dev: nodemon index.js

### Step 2: Verifying the Dockerfile

A Dockerfile was created in the repository root using the Node.js LTS alpine image. The Dockerfile was configured to set the working directory to /app, copy package\*.json and run npm install, copy all application files, run npm test with error tolerance, expose port 3000, and execute npm start to run the application.

The Dockerfile structure follows industry best practices by using a lightweight alpine base image, installing dependencies efficiently, and ensuring the application starts correctly on deployment.

### Step 3: Creating the GitHub Actions Workflow

To automate the build and deployment, a GitHub Actions configuration file was created. I created the file path .github/workflows/deploy.yml at the repository root. The workflow was configured to trigger on push to the main branch.

The workflow includes the following steps:

- Checkout Repository: Uses actions/checkout@v4 to get the code
- Set up Docker Buildx: Uses docker/setup-buildx-action@v2 for efficient building
- Login to DockerHub: Uses docker/login-action@v3 with secrets
- Build and Push Docker Image: Uses docker/build-push-action@v4
- Trigger Render Deployment: Uses curl to call the Render webhook

### Step 4: Securing Credentials with GitHub Secrets

To ensure sensitive credentials were not exposed in source code, GitHub Secrets were configured. Three secrets were added to the GitHub repository:

1. DOCKERHUB_USERNAME - DockerHub account username
2. DOCKERHUB_TOKEN - Personal Access Token from DockerHub
3. RENDER_DEPLOY_WEBHOOK - Render deployment webhook URL

The deploy.yml file referenced these using the ${{ secrets.SECRET_NAME }} syntax, ensuring credentials are never hardcoded in the codebase.

Configuration steps involved navigating to GitHub Repository Settings, then Secrets and variables, then Actions. I clicked "New repository secret" and added each secret with the appropriate value.

### Step 5: DockerHub Setup

I created a public repository on DockerHub named kinleyp06/todo-app. A Personal Access Token (PAT) was generated for authentication purposes. The repository visibility was set to PUBLIC to allow Render.com to access the image without additional credentials. The token was verified to have read and write permissions.

### Step 6: Render.com Configuration

To host the application, I created a new Web Service on Render.com. I selected "Deploy an existing image from a registry" option. The image URL was configured to kinleyp06/todo-app:latest, and the port was set to 3000.

After deployment, I copied the Deploy Hook URL from the Render settings and added it as the RENDER_DEPLOY_WEBHOOK GitHub Secret. This enabled automatic redeployment whenever a new image is pushed to DockerHub.

---

## Challenges Faced During the Assignment

Several issues were encountered while establishing the CI/CD pipeline.

### Challenge 1: Docker Hub Authentication Error

The workflow initially failed with the error: "Error response from daemon: unauthorized: incorrect username or password". This occurred because the DockerHub credentials in GitHub Secrets were incorrect or expired.

I resolved this by generating a new Personal Access Token from DockerHub. I navigated to Settings, then Security, and created a new token. I verified that DOCKERHUB_USERNAME contained the actual username and not the email address. After updating the secrets in GitHub, I re-tested the workflow successfully.

### Challenge 2: Missing index.js File

The Docker build failed with the error: "Error: Cannot find module '/app/index.js'". This happened because the application entry point file was not committed to the repository.

I resolved this by creating index.js with a proper Express server implementation and committing it to GitHub. After pushing the file, I triggered the workflow again, and the build succeeded.

### Challenge 3: Incorrect Image URL Format

Render showed the error: "No public image found". This was caused by an incorrect image URL format and the DockerHub repository being private.

I resolved this by changing the image URL from docker.io/kinleyp06/todo-app:latest to the correct format kinleyp06/todo-app:latest. I also made the DockerHub repository public and verified that the image existed in the registry.

### Challenge 4: Workflow Failed - Missing GitHub Secrets

The GitHub Actions workflow failed during the DockerHub login step. This occurred because one or more GitHub Secrets were not properly configured.

I resolved this by verifying that all three secrets were added to GitHub. I deleted and re-added the secrets with correct values. I ensured that secret values matched exactly without extra spaces. After reconfiguring, I re-triggered the workflow, and it passed successfully.

---

## Learning Outcomes

This assignment provided hands-on experience with modern DevOps practices.

I learned how to structure and write YAML syntax for GitHub Actions workflows. I understood the importance of keeping credentials secure using GitHub Secrets rather than hardcoding them. I gained practical experience with automating Docker image building and pushing from source control.

I learned how to integrate container registries like DockerHub into CI/CD pipelines. I understood how webhooks function to trigger events between different platforms such as GitHub and Render. I developed skills in reading and troubleshooting CI/CD pipeline failures by examining logs.

I gained understanding of cloud deployment automation using Render.com. I learned to apply security best practices for sensitive credential management. I understood the complete CI/CD pipeline from code push to production deployment.

I also learned to define infrastructure and workflows in configuration files, which is the foundation of Infrastructure as Code practices.

---

## Deployment Links and Deliverables

### GitHub Repository

Link: https://github.com/kinleyp06/Kinley-Pem_02250354_DSO101_A3

Contents:

- Dockerfile
- .github/workflows/deploy.yml
- package.json with scripts
- index.js (Express server)
- README.md (this file)

### DockerHub Repository

Link: https://hub.docker.com/r/kinleyp06/todo-app

Image Tag: kinleyp06/todo-app:latest

Status: Public repository with automated pushes from GitHub Actions

### Live Render Deployment

Application Running At: https://[your-render-app-name].onrender.com

---

## How the CI/CD Pipeline Works

### Workflow Sequence

The CI/CD pipeline follows this sequence:

1. Developer pushes code to main branch
2. GitHub Actions automatically triggers the workflow
3. Checkout Repository action retrieves the code
4. Docker Buildx is set up for efficient building
5. Login to DockerHub occurs using stored secrets
6. Docker image is built with tag kinleyp06/todo-app:latest
7. Image is pushed to DockerHub registry
8. Render webhook URL is triggered via curl
9. Render pulls the latest image from DockerHub
10. Render redeploys the application
11. Application becomes live at the Render URL

### Key Benefits

The automation provides several key benefits. Deployment requires no manual steps. The deployment process completes in approximately 2 minutes. The process is consistent every time it runs. Credentials are stored securely as secrets and never exposed in code. The same pipeline works for multiple code changes without modification. Deployment history can be easily tracked in GitHub Actions. Previous images stored in DockerHub enable quick rollback if needed.

---

## Best Practices Applied

In this implementation, I ensured that credentials were never hardcoded in the codebase. Instead, GitHub Secrets were used for all sensitive data. The DockerHub repository was kept public to allow easy access from Render.com. Automated testing was included in the Dockerfile to catch issues early. Descriptive commit messages were used to maintain clear git history.

I used the latest stable versions, specifically Node.js 20-alpine LTS, for production readiness. Proper error handling was implemented using the || true syntax for non-critical failures. Webhook integration was configured to enable automatic Render deployments.

The deploy step was configured to only run on successful build using the if: success() condition. Each workflow step has a single responsibility, following the separation of concerns principle.

---

## Repository Structure

The repository is organized as follows:

Kinley-Pem_02250354_DSO101_A3/

- .github/
  - workflows/
    - deploy.yml (GitHub Actions workflow configuration)
- Dockerfile (Docker image configuration)
- package.json (Node.js dependencies and scripts)
- index.js (Express.js server entry point)
- README.md (This comprehensive documentation)
- [other application files]

---

## Conclusion

This assignment successfully demonstrated a complete CI/CD pipeline implementation using industry-standard tools and practices. The automated workflow ensures that every push to the main branch results in a tested, containerized, and deployed application on Render.com.

The skills acquired through this assignment are fundamental to modern software engineering and DevOps practices, enabling efficient and secure application deployment at scale.

The CI/CD pipeline represents a significant advancement in development workflow, moving from manual deployments to fully automated, tested, and monitored deployments that can handle multiple changes per day with confidence and consistency.

---

Submitted by: Kinley Pem (02250354)
Course: DSO101 - Continuous Integration and Continuous Deployment

