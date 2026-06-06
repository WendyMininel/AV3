-- CreateTable
CREATE TABLE `Aeronave` (
    `codigo` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `capacidade` INTEGER NOT NULL,
    `alcance` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Peca` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `fornecedor` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Funcionario` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `usuario` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `nivelPermissao` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Funcionario_usuario_key`(`usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Etapa` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `prazo` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `aeronaveCodigo` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teste` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `resultado` VARCHAR(191) NOT NULL,
    `aeronaveCodigo` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EtapaFuncionario` (
    `funcionarioId` VARCHAR(191) NOT NULL,
    `etapaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`funcionarioId`, `etapaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MetricaLatencia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `endpoint` VARCHAR(191) NOT NULL,
    `latenciaMs` DOUBLE NOT NULL,
    `tempoRespostaMs` DOUBLE NOT NULL,
    `tempoProcessamentoMs` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
