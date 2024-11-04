CREATE TABLE Client(
   Client_Id INT,
   Username VARCHAR(25),
   Password VARCHAR(50),
   PRIMARY KEY(Client_Id)
);

CREATE TABLE Room(
   Room_Id INT,
   Room_Name VARCHAR(50),
   Slots INT,
   Password VARCHAR(50),
   Client_Id INT NOT NULL,
   PRIMARY KEY(Room_Id),
   FOREIGN KEY(Client_Id) REFERENCES Client(Client_Id)
);

CREATE TABLE Story(
   Story_Id INT,
   Name VARCHAR(50),
   Complexity INT,
   Room_Id INT NOT NULL,
   PRIMARY KEY(Story_Id),
   FOREIGN KEY(Room_Id) REFERENCES Room(Room_Id)
);
