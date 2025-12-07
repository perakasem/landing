/**
 * Duplicate R2 files with and without extensions
 *
 * This script copies all files in R2 to create extension-less versions:
 * - abc-123.png → also stored as abc-123
 * - abc-123.jpg → also stored as abc-123
 *
 * This allows both URL formats to work:
 * - assets.perakasem.com/abc-123.png ✅
 * - assets.perakasem.com/abc-123 ✅
 *
 * Usage:
 *   npx ts-node scripts/duplicate-r2-files.ts
 */

import { S3Client, ListObjectsV2Command, CopyObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

// R2 Configuration from environment variables
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
	console.error('❌ Missing required environment variables:');
	console.error('   - R2_ACCOUNT_ID');
	console.error('   - R2_ACCESS_KEY_ID');
	console.error('   - R2_SECRET_ACCESS_KEY');
	console.error('   - R2_BUCKET_NAME');
	process.exit(1);
}

// Initialize R2 client
const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY
	}
});

async function listAllFiles() {
	console.log('📂 Listing all files in R2 bucket...\n');

	const files: string[] = [];
	let continuationToken: string | undefined;

	do {
		const command = new ListObjectsV2Command({
			Bucket: R2_BUCKET_NAME,
			ContinuationToken: continuationToken
		});

		const response = await r2Client.send(command);

		if (response.Contents) {
			files.push(...response.Contents.map((obj) => obj.Key!));
		}

		continuationToken = response.NextContinuationToken;
	} while (continuationToken);

	return files;
}

async function fileExists(key: string): Promise<boolean> {
	try {
		await r2Client.send(
			new HeadObjectCommand({
				Bucket: R2_BUCKET_NAME,
				Key: key
			})
		);
		return true;
	} catch {
		return false;
	}
}

async function copyFile(sourceKey: string, destKey: string, contentType: string) {
	const command = new CopyObjectCommand({
		Bucket: R2_BUCKET_NAME,
		CopySource: `${R2_BUCKET_NAME}/${sourceKey}`,
		Key: destKey,
		ContentType: contentType,
		MetadataDirective: 'COPY'
	});

	await r2Client.send(command);
}

async function duplicateFiles() {
	console.log('🚀 Starting R2 file duplication...\n');

	// Get all files
	const allFiles = await listAllFiles();

	console.log(`📊 Found ${allFiles.length} files in bucket\n`);

	// Filter files with extensions
	const filesWithExtensions = allFiles.filter((file) => {
		const ext = file.split('.').pop();
		return ext && ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pdf', 'mp4', 'webm'].includes(ext.toLowerCase());
	});

	console.log(`🎯 ${filesWithExtensions.length} files have extensions\n`);

	let copied = 0;
	let skipped = 0;
	let errors = 0;

	for (const sourceFile of filesWithExtensions) {
		// Create extension-less version
		const fileNameWithoutExt = sourceFile.substring(0, sourceFile.lastIndexOf('.'));
		const extension = sourceFile.substring(sourceFile.lastIndexOf('.'));

		// Determine content type
		const contentTypeMap: Record<string, string> = {
			'.png': 'image/png',
			'.jpg': 'image/jpeg',
			'.jpeg': 'image/jpeg',
			'.gif': 'image/gif',
			'.webp': 'image/webp',
			'.svg': 'image/svg+xml',
			'.pdf': 'application/pdf',
			'.mp4': 'video/mp4',
			'.webm': 'video/webm'
		};

		const contentType = contentTypeMap[extension.toLowerCase()] || 'application/octet-stream';

		// Check if extension-less version already exists
		const exists = await fileExists(fileNameWithoutExt);

		if (exists) {
			console.log(`⏭️  Skipped: ${fileNameWithoutExt} (already exists)`);
			skipped++;
			continue;
		}

		try {
			await copyFile(sourceFile, fileNameWithoutExt, contentType);
			console.log(`✅ Copied: ${sourceFile} → ${fileNameWithoutExt}`);
			copied++;
		} catch (error) {
			console.error(`❌ Error copying ${sourceFile}:`, error);
			errors++;
		}
	}

	console.log('\n━'.repeat(50));
	console.log(`✅ Duplication complete!\n`);
	console.log(`📊 Summary:`);
	console.log(`   - Copied: ${copied}`);
	console.log(`   - Skipped: ${skipped}`);
	console.log(`   - Errors: ${errors}`);
	console.log(`   - Total files now: ~${allFiles.length + copied}\n`);
}

async function main() {
	console.log('🔧 R2 File Duplication Tool\n');
	console.log('━'.repeat(50) + '\n');

	try {
		await duplicateFiles();
	} catch (error) {
		console.error('❌ Error during duplication:', error);
		process.exit(1);
	}
}

main();
