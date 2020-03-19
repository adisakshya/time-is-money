# Time is money

If you ensure that the resources like compute/memory/storage/time are used efficiently at your end, and do not go into processing tasks that have already been stopped (and then to roll back the work done post the stop-action), you save time to devote to other tasks/clients and make money.

[![](https://img.shields.io/badge/docs%20-view%20API%20Documentation-blue.svg?style=for-the-badge&logo=appveyor)](https://www.adisakshya.co/time-is-money/) [![made-for-atlan](https://img.shields.io/badge/Made%20for-Atlan-blue.svg?style=for-the-badge&logo=appveyor)](https://www.youtube.com/watch?v=Ldza4HUNZqg&feature=youtu.be) [![version](https://img.shields.io/badge/Version-1.0.0-blue.svg?style=for-the-badge&logo=appveyor)](https://www.youtube.com/watch?v=Ldza4HUNZqg&feature=youtu.be)

## The Challenge

You have a variety of long-running tasks that require time and resources on the servers. As it stands now, once you have triggered off a long-running task, there is no way to tap into it and pause/stop/terminate the task, upon realizing that an erroneous request went through from one of the clients (mostly web or pipeline).

This repository holds the solution to the given challenge statement

## Technology Stack

**Programming Language:** JavaScript

**Framework:** ExpressJS

**Runtime Engine:** NodeJS

**Database:** MySQL

**Containerization:** Docker and Docker Compose

**Caching:** Redis

**Documentation:** apiDoc documentation

## Node.js perspective

At a high level, Node.js falls into the category of concurrent computation. This is a direct result of the single-threaded event loop being the backbone of a Node.js application. The event-loop repeatedly takes an event and then sequentially executes all listeners interested in that event.

It also facilitates creation of child processes to leverage parallel processing on multi-core CPU based systems. When we spawn a new child process in Node.js, this take advantage of multi-core CPUs. A new process will be created and managed by the OS. That new process can be executed in parallel to the main process as long as your computer has at least 2 virtual CPU CORES.

**What happens if we have 1 core and you spawn child process?**

The same thing that happens when you have multiple cores. The operating system schedules the execution of the processes amongst N cores, which in this case, would mean that all processes are being executed by 1 CORE.

**So do we still get some benefit?** 
If you have one core, and you create child process, then processor will make them run in parallel (even one task is long running?).

If the processes can be executed in parallel by the processor, then yes, we will get the benefit (intel processors do virtual core which let even single core act like multi core).

## Architecture

![High level client interaction with system](https://raw.githubusercontent.com/adisakshya/time-is-money/master/docs/archi/High%20level%20client%20interaction%20with%20system.png)
Fig.1: High Level - Client Interaction with the system

![API - Handling client requests](https://raw.githubusercontent.com/adisakshya/time-is-money/master/docs/archi/API%20-%20Client%20Request%20Handling.png)
Fig.2: Middle Level - Logic for API handling client requests

![Data flow diagram for the child process](https://raw.githubusercontent.com/adisakshya/time-is-money/master/docs/archi/Child%20Process%20Dataflow%20Diagram.png)
Fig.3: Lower Level - Data flow diagram for the child process

## Operating Instructions

#### Prerequisites

- Make sure you have
  - Docker installed

#### Clone

- Download or clone this repository
	- You can clone the repository executing below command in a location of your choice of your system.
	```$ git clone https://github.com/adisakshya/time-is-money.git```

#### Run Using Docker

- Make sure you have docker installed before proceeding.
	- In project-directory ```./time-is-money```, run the following command
		- ```docker-compose up --build```
    - Running docker-compose in non-detached mode (to be able to see the logs running)
- Now you have successfully setup the project,
	- Please find the API documentation [here](https://www.adisakshya.co/time-is-money/).
  - It describe all routes that define the operation the API.

#### API Routes
    
  - Get details of all the tasks
      - ```http://<domain:port>/api/v1/task```
  - Get details of a task by ID
      - ```http://<domain:port>/api/v1/task/view?id=taskID```
      - Query Parameter: id [TaskID]
  - Start a long running task
      - ```http://<domain:port>/api/v1/task/start```
  - Terminate a long running task by id
      - ```http://<domain:port>/api/v1/task/terminate?id=taskID```
      - Query Parameter: id [TaskID]
  - Pause long running task by id
      - ```http://<domain:port>/api/v1/task/pause?id=taskID```
      - Query Parameter: id [TaskID]
  - Resume a paused long running task by id
      - ```http://<domain:port>/api/v1/task/resume?id=taskID```
      - Query Parameter: id [TaskID]
