create database dtech_pm_erp;

USE dtech_pm_erp;

CREATE TABLE Admin (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Picture VARCHAR(255),
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Contact VARCHAR(20),
    Photo VARCHAR(255)
);

CREATE TABLE Project (
    ProjectID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectName VARCHAR(255) NOT NULL,
    Details TEXT,
    Start_Date DATE,
    End_Date DATE,
    Location VARCHAR(255),
    Status INT,
    Uploads VARCHAR(255)
);

CREATE TABLE AssignEngineer (
    AssignID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Project_ID INT,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (Project_ID) REFERENCES Project(ProjectID)
);

CREATE TABLE ScopeWork (
    WorkID INT AUTO_INCREMENT PRIMARY KEY,
    Work_Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Status INT,
    ProjectID INT,
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
);

CREATE TABLE Work_Quality (
    WorkQualityID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectID INT,
    WorkID INT,
    WorkName VARCHAR(255),
    TotalWork VARCHAR(255),
    Allignment TINYINT(1) DEFAULT 0,
    Accesories TINYINT(1) DEFAULT 0,
    SiliconIn TINYINT(1) DEFAULT 0,
    SiliconOut TINYINT(1) DEFAULT 0,
    Behaviour TEXT,
    Comment TEXT,
    FOREIGN KEY (ProjectID) REFERENCES Project (ProjectID),
    FOREIGN KEY (WorkID) REFERENCES ScopeWork (WorkID)
);

CREATE TABLE DAILY_PROGRESS (
    DAILY_PROGRESS_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255),
    ProjectID INT,
    Details TEXT,
    Media TEXT,
    Progress_Date VARCHAR(255),
    FOREIGN KEY (ProjectID) REFERENCES Project (ProjectID)
);

CREATE TABLE MaterialRequisition(
	MaterialRequisitionID INT AUTO_INCREMENT primary key,
    ProjectID INT,
    AssignID INT,
    ReqStatus INT,
    DELREQ INT,	-- for delete, use 1
    REMARKS TEXT,
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
    FOREIGN KEY (AssignID) REFERENCES AssignEngineer(AssignID)
);

CREATE TABLE RequestedItem(
	RequestedItemID INT AUTO_INCREMENT primary key,
    MaterialRequisitionID INT,
    ItemName VARCHAR(255),
    AmountExpected INT,
    ExpectedDate VARCHAR(255),
    ExpectedMonth VARCHAR(255),
    ExpectedYear INT, 
    ApprovalStatus INT, -- for updates, use 1. for delete use 2
    REMARKS TEXT,
    
    FOREIGN KEY (MaterialRequisitionID) REFERENCES MaterialRequisition(MaterialRequisitionID)
);
CREATE TABLE ArrivedItem(
	ArrivedItemID INT AUTO_INCREMENT PRIMARY KEY,
    RequestedItemID INT,
    AmountReceived INT,
	AmountGood INT,
    ArrivalStatus INT, -- for updates, use 1. for delete use 2
    ReceivedDate VARCHAR(255),
    ReceivedMonth VARCHAR(255),
    ReceivedYear INT(255),
    
    FOREIGN KEY (RequestedItemID) REFERENCES RequestedItem(RequestedItemID)
);
CREATE TABLE QualityControlReport(
	QualityControlReportID INT AUTO_INCREMENT PRIMARY KEY,
    RequestedItemID INT,
    ReportDate VARCHAR(255),
    ReportMonth VARCHAR(255),
    ReportYear INT,
    Remarks TEXT,
    ApprovalStatus INT, -- for updates, use 1. for delete use 2
    
    FOREIGN KEY (RequestedItemID) REFERENCES RequestedItem(RequestedItemID)
);

CREATE TABLE contractor(
	contractor_id int auto_increment primary key,
    name varchar(255),
    contact varchar(50),
    address varchar(500),
    bloodgroup varchar(5)
);

CREATE TABLE worker (
    worker_id INT AUTO_INCREMENT PRIMARY KEY,
    contractor_id INT,
    name VARCHAR(255),
    contact VARCHAR(255),
    address VARCHAR(255),
    bloodgroup varchar(255),
    rating FLOAT default 0,
    
    foreign key (contractor_id) references contractor(contractor_id)
);

CREATE TABLE assignedworker (
	assignedworker_id INT auto_increment primary key,
    worker_id int,
    contractor_id int,
    project_id int,
    rating int default 0,
    
    foreign key (contractor_id) references contractor(contractor_id),
    foreign key (worker_id) references worker(worker_id),
    foreign key (project_id) references project(ProjectID)
);

CREATE TABLE targetworkflow(
targetworkflow_id INT primary key auto_increment,
scope_work_id int,
amount float default 0,
date varchar(100),
month varchar(100),
year int,
remaining float,

foreign key (scope_work_id) references scopework(WorkID)
);

CREATE TABLE completeworkflow(
completeworkflow_id int primary key auto_increment,
targetworkflow_id int,
amount float default 0,
date varchar(100),
month varchar(100),
year int,

foreign key (targetworkflow_id) references targetworkflow(targetworkflow_id)
);

CREATE TABLE remaining(
remaining_id INT primary key auto_increment,
remaining INT,
scopeWorkID INT,

FOREIGN KEY (scopeWorkID) REFERENCES ScopeWork(WorkID)
);

ALTER TABLE targetworkflow
DROP COLUMN remaining;


-- Altering Start_Date column
-- Otherwise date is not GMT+6
ALTER TABLE Project
MODIFY Start_Date VARCHAR(255);

-- Altering End_Date column
-- Otherwise date is not GMT+6
ALTER TABLE Project
MODIFY End_Date VARCHAR(255);
-- ADD date column in the work_quality table 
ALTER TABLE Work_Quality
ADD COLUMN Curent_Date VARCHAR(255);

ALTER TABLE requesteditem
ADD COLUMN Thickness VARCHAR(255),
ADD COLUMN SIZE VARCHAR(255);

ALTER TABLE arriveditem
DROP COLUMN AmountGood;

ALTER TABLE qualitycontrolreport
ADD COLUMN AmountGood INT,
ADD COLUMN Thickness VARCHAR(255),
ADD COLUMN SIZE VARCHAR(255),
ADD COLUMN Quality Varchar(255);

-- alter table requesteditem
-- add column remarks TEXT

ALTER TABLE scopework
ADD COLUMN sqrfoot INT DEFAULT 0;

CREATE TABLE Request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ProjectID INT,
    AssignID INT,
    ReqStatus INT,
    Picture VARCHAR(50)
);

CREATE TABLE Report (
    id INT AUTO_INCREMENT PRIMARY KEY,
    RequestId INT,
    ProjectID INT,
    ReqStatus INT,
    AssignID INT,
    Picture VARCHAR(255),
    FOREIGN KEY (AssignID) REFERENCES AssignEngineer(AssignID), 
    FOREIGN KEY (RequestId) REFERENCES Request(id)
);
