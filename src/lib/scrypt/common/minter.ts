const OpenMinterArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/openMinter.json')
const OpenMinterV2Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/openMinterV2.json')
const FXPOpenMinterArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/FXPOpenMinter.json')

export enum MinterType {
	// @ts-ignore
	OPEN_MINTER_V1 = OpenMinterArtifact.md5,
	// @ts-ignore
	OPEN_MINTER_V2 = OpenMinterV2Artifact.md5,
	// @ts-ignore
	FXP_OPEN_MINTER = FXPOpenMinterArtifact.md5,
	UNKOWN_MINTER = 'unkown_minter'
}
