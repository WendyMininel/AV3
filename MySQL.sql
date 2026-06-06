-- Executar em MySQL Workbench
DROP DATABASE IF EXISTS aerocode;
CREATE DATABASE aerocode;
USE aerocode;

SELECT * FROM information_schema.REFERENTIAL_CONSTRAINTS 
WHERE CONSTRAINT_SCHEMA = 'aerocode' AND TABLE_NAME = 'PecaFuncionario';

CREATE TABLE Aeronave (
    codigo VARCHAR(50) PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    capacidade INT NOT NULL DEFAULT 0,
    alcance INT NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Peca (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    fornecedor VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Funcionario (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nivelPermissao VARCHAR(20) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE PecaFuncionario (
    pecaId VARCHAR(50) NOT NULL,
    funcionarioId VARCHAR(50) NOT NULL,
    PRIMARY KEY (pecaId, funcionarioId),
    FOREIGN KEY (pecaId) REFERENCES Peca(id) ON DELETE CASCADE,
    FOREIGN KEY (funcionarioId) REFERENCES Funcionario(id) ON DELETE CASCADE
);

CREATE TABLE Etapa (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    prazo DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    aeronaveCodigo VARCHAR(50) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aeronaveCodigo) REFERENCES Aeronave(codigo) ON DELETE CASCADE
);

CREATE TABLE EtapaFuncionario (
    funcionarioId VARCHAR(50) NOT NULL,
    etapaId VARCHAR(50) NOT NULL,
    PRIMARY KEY (funcionarioId, etapaId),
    FOREIGN KEY (funcionarioId) REFERENCES Funcionario(id) ON DELETE CASCADE,
    FOREIGN KEY (etapaId) REFERENCES Etapa(id) ON DELETE CASCADE
);

CREATE TABLE Teste (
    id VARCHAR(50) PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL,
    resultado VARCHAR(20) NOT NULL,
    aeronaveCodigo VARCHAR(50) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aeronaveCodigo) REFERENCES Aeronave(codigo) ON DELETE CASCADE
);

CREATE TABLE MetricaLatencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    latenciaMs FLOAT NOT NULL,
    tempoRespostaMs FLOAT NOT NULL,
    tempoProcessamentoMs FLOAT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS PecaFuncionario (
    pecaId VARCHAR(50) NOT NULL,
    funcionarioId VARCHAR(50) NOT NULL,
    PRIMARY KEY (pecaId, funcionarioId),
    FOREIGN KEY (pecaId) REFERENCES Peca(id) ON DELETE CASCADE,
    FOREIGN KEY (funcionarioId) REFERENCES Funcionario(id) ON DELETE CASCADE
);
USE aerocode;

CREATE TABLE IF NOT EXISTS PecaAeronave (
    pecaId VARCHAR(50) NOT NULL,
    aeronaveCodigo VARCHAR(50) NOT NULL,
    PRIMARY KEY (pecaId, aeronaveCodigo),
    FOREIGN KEY (pecaId) REFERENCES Peca(id) ON DELETE CASCADE,
    FOREIGN KEY (aeronaveCodigo) REFERENCES Aeronave(codigo) ON DELETE CASCADE
);

SHOW TABLES;

INSERT INTO Funcionario (id, nome, telefone, endereco, usuario, senha, nivelPermissao) VALUES
('1', 'Gerson', '(12) 98283-9273', 'Fatec, 123', 'adm', 'adm001', 'ADMINISTRADOR'),
('2', 'Wendy', '(12) 99752-6999', 'Caçapava-SP, 456', 'eng', 'eng001', 'ENGENHEIRO'),
('3', 'Ana', '(12) 99666-4755', 'Caçapava, Rua Lírios-SP, 789', 'op', 'op001', 'OPERADOR');


SELECT 'Banco criado' AS '';
SELECT COUNT(*) AS Funcionarios FROM Funcionario;
SELECT COUNT(*) AS Aeronaves FROM Aeronave;
SELECT COUNT(*) AS Pecas FROM Peca;
SELECT COUNT(*) AS Etapas FROM Etapa;
SELECT COUNT(*) AS Testes FROM Teste;