# podcastgenie

Welcome to the PodcastGenie repository! This guide will walk you through setting up, running, and understanding the project.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Project](#running-the-project)
4. [Login Credentials](#login-credentials)


## Prerequisites

Before setting up the project, ensure your environment meets the following requirements:

- **Node.js** (v18.17.1 or above)
- **PNPM** (Package Now, Pay Me later) - a fast and efficient package manager for Node.js
- **Docker** - a platform for developing, shipping, and running applications inside containers

## Installation

Follow these steps to install the project:

1. **Clone the Repository**  
   Clone the project repository to your local machine using Git:

```bash
    git clone https://github.com/augmentedstartups/podcastgenie.git
 ```
2. **Install Dependencies**
    Install all required packages by running:

 ```bash
    pnpm install
```
## Running the Project
    After installing the dependencies, follow these steps to run the project:

1. **Start Docker**  
    Ensure Docker is installed and running on your system. Docker is required to manage containers and run services like Supabase.

2. **Set Up and Start Supabase**  
    Run the following command to set up Supabase, which is used for backend services:
   
```bash
    pnpm run supabase:web:start
```
   This command will create the necessary Docker containers and set up Supabase for the project.

3. **Start the Development Server**  
    Once Supabase is up and running, start the development server with:
   
```bash
    pnpm run dev
```
   This will start the local development environment, allowing you to access the application via your web browser.

## Login Credentials
```bash
    Email: test@makerkit.dev
    Password: testingpassword
```