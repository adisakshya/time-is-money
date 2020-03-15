-- Create manager database
CREATE DATABASE managerdb;
use managerdb;

-- Set max_allowed_packet variable globally
SET GLOBAL max_allowed_packet = 1024 * 1024 * 256;

-- Tasks Table
-- For storing information about all tasks
CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    iscompleted BOOLEAN DEFAULT false,
    isPaused BOOLEAN DEFAULT false,
    isTerminated BOOLEAN DEFAULT false,
    totalRows INTEGER DEFAULT 0,
    rowsProcessed INTEGER DEFAULT 0
);

-- Big Process Table
-- For storing data from process
CREATE TABLE process (
    taskID VARCHAR(255),
    rowID INT(11),
    field1 VARCHAR(20), 
    field2 VARCHAR(20), 
    field3 VARCHAR(20), 
    field4 VARCHAR(20), 
    field5 VARCHAR(20), 
    field6 VARCHAR(20), 
    field7 VARCHAR(20), 
    field8 VARCHAR(20), 
    field9 VARCHAR(20), 
    field10 VARCHAR(20), 
    field11 VARCHAR(20), 
    field12 VARCHAR(20), 
    field13 VARCHAR(20), 
    field14 VARCHAR(20), 
    field15 VARCHAR(20), 
    field16 VARCHAR(20), 
    field17 VARCHAR(20), 
    field18 VARCHAR(20), 
    field19 VARCHAR(20), 
    field20 VARCHAR(20)
);

-- Indexes for table process
ALTER TABLE `process`
  ADD PRIMARY KEY (`taskID`,`rowID`),
  ADD KEY `taskID` (`taskID`);

-- Constraint for table process
ALTER TABLE `process`
  ADD CONSTRAINT `process_ibfk_1` FOREIGN KEY (`taskID`) REFERENCES `tasks` (`id`);