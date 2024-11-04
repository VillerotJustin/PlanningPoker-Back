CREATE TABLE Client(
   Client_Id INT,
   Username VARCHAR(25),
   Mail VARCHAR(50),
   Password VARCHAR(50),
   PRIMARY KEY(Client_Id)
);

CREATE TABLE Room(
   Room_Id INT,
   Private LOGICAL,
   Password VARCHAR(50),
   Locked LOGICAL,
   Space INT,
   Room_Name VARCHAR(50),
   Client_Id INT NOT NULL,
   PRIMARY KEY(Room_Id),
   FOREIGN KEY(Client_Id) REFERENCES Client(Client_Id)
);

CREATE TABLE Backlog(
   Backlog_Id INT,
   Name VARCHAR(50),
   Complexity INT,
   Room_Id INT NOT NULL,
   PRIMARY KEY(Backlog_Id),
   FOREIGN KEY(Room_Id) REFERENCES Room(Room_Id)
);