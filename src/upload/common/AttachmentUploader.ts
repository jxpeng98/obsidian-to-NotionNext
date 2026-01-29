import { TFile, requestUrl } from "obsidian";
import type MyPlugin from "src/main";
import type { DatabaseDetails } from "../../ui/settingTabs";

const NOTION_API_VERSION = "2025-09-03";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

interface FileUploadSession {
	id: string;
	status: string;
	upload_url?: string;
}

interface UploadResult {
	id: string;
	filename: string;
}

export class AttachmentUploader {
	private plugin: MyPlugin;
	private dbDetails: DatabaseDetails;
	private textEncoder = new TextEncoder();

	constructor(plugin: MyPlugin, dbDetails: DatabaseDetails) {
		this.plugin = plugin;
		this.dbDetails = dbDetails;
	}

	async uploadFile(file: TFile): Promise<UploadResult> {
		const { notionAPI } = this.dbDetails;
		const fileSizeBytes = file.stat?.size ?? 0;
		const contentType = this.getContentType(file.extension);

		if (fileSizeBytes > MAX_UPLOAD_BYTES) {
			throw new Error(
				`File too large for Notion upload (max 5MB): ${file.path} (${(fileSizeBytes / 1024 / 1024).toFixed(2)} MB)`,
			);
		}
		const mode = "single_part";

		console.log(`[AttachmentUploader] uploadFile: ${file.name}`, {
			path: file.path,
			size: `${(fileSizeBytes / 1024).toFixed(2)} KB`,
			contentType,
			mode,
		});

		const session = await this.createUploadSession({
			mode,
			notionAPI,
		});

		console.log(`[AttachmentUploader] Upload session created:`, {
			sessionId: session.id,
			status: session.status,
		});

		const binary = await this.plugin.app.vault.readBinary(file);
		console.log(`[AttachmentUploader] Read binary data: ${binary.byteLength} bytes`);

		if (binary.byteLength > MAX_UPLOAD_BYTES) {
			throw new Error(
				`File too large for Notion upload (max 5MB): ${file.path} (${(binary.byteLength / 1024 / 1024).toFixed(2)} MB)`,
			);
		}

		const uploadUrl =
			session.upload_url ??
			`https://api.notion.com/v1/file_uploads/${encodeURIComponent(session.id)}/send`;
		await this.sendFileData(session.id, uploadUrl, binary, notionAPI, file.name, contentType);

		console.log(`[AttachmentUploader] Upload complete: ${file.name} -> ${session.id}`);
		return { id: session.id, filename: file.name };
	}

	private async createUploadSession(params: {
		mode: string;
		notionAPI: string;
	}): Promise<FileUploadSession> {
		console.log(`[AttachmentUploader] Creating upload session:`, {
			mode: params.mode,
		});

		const response = await this.requestWithRetry({
			url: "https://api.notion.com/v1/file_uploads",
			method: "POST",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${params.notionAPI}`,
				"Notion-Version": NOTION_API_VERSION,
			},
			body: JSON.stringify({
				mode: params.mode,
			}),
			throw: false,
		});

		const data = response.json;
		if (response.status < 200 || response.status >= 300) {
			console.error(`[AttachmentUploader] Failed to create upload session:`, {
				status: response.status,
				message: data?.message,
				response: data,
			});
			throw new Error(`Failed to create upload session: ${data?.message ?? response.status}`);
		}

		const id = data?.id ?? data?.file_upload?.id;
		if (!id) {
			throw new Error("Upload session response missing id");
		}

		return { id, status: data.status, upload_url: data.upload_url };
	}

	private async sendFileData(
		fileUploadId: string,
		uploadUrl: string,
		binary: ArrayBuffer,
		notionAPI: string,
		filename: string,
		contentType: string,
	): Promise<void> {
		console.log(`[AttachmentUploader] Sending file data for session: ${fileUploadId} (${binary.byteLength} bytes)`);

		const { body, boundary } = this.buildMultipartBody({
			fieldName: "file",
			filename,
			contentType: contentType || "application/octet-stream",
			binary,
		});

		const response = await this.requestWithRetry({
			url: uploadUrl,
			method: "POST",
			headers: {
				accept: "application/json",
				"Content-Type": `multipart/form-data; boundary=${boundary}`,
				Authorization: `Bearer ${notionAPI}`,
				"Notion-Version": NOTION_API_VERSION,
			},
			body,
			throw: false,
		});

		const data = response.json;
		if (response.status < 200 || response.status >= 300) {
			console.error(`[AttachmentUploader] Failed to send file data:`, {
				sessionId: fileUploadId,
				status: response.status,
				message: data?.message,
				response: data,
			});
			throw new Error(`Failed to send file data: ${data?.message ?? response.status}`);
		}

		console.log(`[AttachmentUploader] File data sent successfully for session: ${fileUploadId}`);
	}

	private buildMultipartBody(params: {
		fieldName: string;
		filename: string;
		contentType: string;
		binary: ArrayBuffer;
	}): { body: ArrayBuffer; boundary: string } {
		const boundary = `----NotionFormBoundary${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;

		const safeFilename = params.filename.replace(/"/g, '\\"');
		const prefix = [
			`--${boundary}\r\n`,
			`Content-Disposition: form-data; name="${params.fieldName}"; filename="${safeFilename}"\r\n`,
			`Content-Type: ${params.contentType}\r\n`,
			`\r\n`,
		].join("");
		const suffix = `\r\n--${boundary}--\r\n`;

		const prefixBytes = this.textEncoder.encode(prefix);
		const fileBytes = new Uint8Array(params.binary);
		const suffixBytes = this.textEncoder.encode(suffix);

		const out = new Uint8Array(prefixBytes.length + fileBytes.length + suffixBytes.length);
		out.set(prefixBytes, 0);
		out.set(fileBytes, prefixBytes.length);
		out.set(suffixBytes, prefixBytes.length + fileBytes.length);
		return { body: out.buffer, boundary };
	}

	private async requestWithRetry(params: any, maxAttempts = 4): Promise<any> {
		let attempt = 0;
		let lastError: unknown;

		while (attempt < maxAttempts) {
			attempt++;
			try {
				const response = await requestUrl(params);
				if (this.shouldRetry(response.status) && attempt < maxAttempts) {
					const delayMs = this.getRetryDelay(response, attempt);
					console.warn(`[AttachmentUploader] Retryable status ${response.status}, attempt ${attempt}/${maxAttempts}, retrying in ${delayMs}ms`);
					await this.sleep(delayMs);
					continue;
				}
				return response;
			} catch (error: unknown) {
				lastError = error;
				console.error(`[AttachmentUploader] Request failed, attempt ${attempt}/${maxAttempts}:`, error);
				if (attempt >= maxAttempts) break;
				const delayMs = this.getRetryDelay(undefined, attempt);
				console.warn(`[AttachmentUploader] Retrying in ${delayMs}ms`);
				await this.sleep(delayMs);
			}
		}

		console.error(`[AttachmentUploader] Request failed after ${maxAttempts} attempts`);
		throw lastError ?? new Error("Request failed after retries");
	}

	private shouldRetry(status: number): boolean {
		return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
	}

	private getRetryDelay(response: any, attempt: number): number {
		const retryAfter = response?.headers?.["retry-after"] ?? response?.headers?.["Retry-After"];
		if (retryAfter) {
			const seconds = parseInt(retryAfter, 10);
			if (!isNaN(seconds)) return seconds * 1000;
		}
		const base = 500;
		const max = 8000;
		const expo = Math.min(max, base * Math.pow(2, attempt - 1));
		const jitter = Math.floor(Math.random() * 250);
		return expo + jitter;
	}

	private sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	private getContentType(extension: string): string {
		const ext = extension.toLowerCase();
		const mimeTypes: Record<string, string> = {
			png: "image/png",
			jpg: "image/jpeg",
			jpeg: "image/jpeg",
			gif: "image/gif",
			webp: "image/webp",
			svg: "image/svg+xml",
			heic: "image/heic",
			tif: "image/tiff",
			tiff: "image/tiff",
			bmp: "image/bmp",
			pdf: "application/pdf",
		};
		return mimeTypes[ext] ?? "application/octet-stream";
	}
}
