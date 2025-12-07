/**
 * API endpoint to duplicate files in R2
 *
 * Called by Directus webhook when a new file is uploaded
 * Creates an extension-less copy: abc-123.png → abc-123
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { S3Client, CopyObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import {
	R2_ACCOUNT_ID,
	R2_ACCESS_KEY_ID,
	R2_SECRET_ACCESS_KEY,
	R2_BUCKET_NAME
} from '$env/static/private';

const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY
	}
});

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

export const POST: RequestHandler = async ({ request }) => {
	try {
		const webhook = await request.json();

		// Verify this is a file upload event
		if (webhook.collection !== 'directus_files' || webhook.event !== 'items.create') {
			return json({ message: 'Not a file upload event' }, { status: 200 });
		}

		const file = webhook.payload;

		// Only process cloudflare storage files
		if (file.storage !== 'cloudflare') {
			return json({ message: 'Not a cloudflare file' }, { status: 200 });
		}

		const filename = file.filename_disk; // e.g., "abc-123.png"
		const lastDotIndex = filename.lastIndexOf('.');

		if (lastDotIndex === -1) {
			return json({ message: 'File has no extension' }, { status: 200 });
		}

		const filenameWithoutExt = filename.substring(0, lastDotIndex);
		const extension = filename.substring(lastDotIndex);
		const contentType = contentTypeMap[extension.toLowerCase()] || 'application/octet-stream';

		// Check if extension-less version already exists
		const exists = await fileExists(filenameWithoutExt);

		if (exists) {
			return json({
				message: 'Duplicate already exists',
				file: filenameWithoutExt
			}, { status: 200 });
		}

		// Copy file to create extension-less version
		await r2Client.send(
			new CopyObjectCommand({
				Bucket: R2_BUCKET_NAME,
				CopySource: `${R2_BUCKET_NAME}/${filename}`,
				Key: filenameWithoutExt,
				ContentType: contentType,
				MetadataDirective: 'COPY'
			})
		);

		console.log(`✅ Duplicated: ${filename} → ${filenameWithoutExt}`);

		return json({
			success: true,
			originalFile: filename,
			duplicateFile: filenameWithoutExt
		});
	} catch (error) {
		console.error('Error duplicating file:', error);
		return json({ error: 'Failed to duplicate file' }, { status: 500 });
	}
};
