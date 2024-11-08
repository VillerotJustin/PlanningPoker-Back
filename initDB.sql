CREATE DATABASE IF NOT EXISTS poker;   

CREATE TABLE IF NOT EXISTS Client(
   username VARCHAR(25),
   password VARCHAR(50),
   PRIMARY KEY(username)
);

CREATE TABLE IF NOT EXISTS Room(
   id INT,
   name VARCHAR(50),
   slots INT,
   mode INT,
   password VARCHAR(50),
   owner VARCHAR(25) NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(owner) REFERENCES Client(username)
);

CREATE TABLE IF NOT EXISTS Story(
   id INT,
   name VARCHAR(50),
   value INT,
   roomId INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(roomId) REFERENCES Room(id)
);