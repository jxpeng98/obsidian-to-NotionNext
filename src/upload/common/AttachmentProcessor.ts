import { App, TFile, normalizePath } from "obsidian";
import { AttachmentUploader } from "./AttachmentUploader";
import type MyPlugin from "src/main";
import type { DatabaseDetails } from "../../ui/settingTabs";

export interface AttachmentPrepareResult {
	content: string;
	imageUrlToUploadId: Record<string, string>;
	filePlaceholderToUpload: Record<string, { id: string; name: string }>;
}

interface LocalAttachment {
	file: TFile;
	originalRef: string;
}

const IMAGE_EXTENSIONS = new Set([
	"png", "jpg", "jpeg", "gif", "webp", "svg", "heic", "tif", "tiff", "bmp"
]);

const SUPPORTED_EXTENSIONS = new Set([
	...IMAGE_EXTENSIONS, "pdf"
]);

export class AttachmentProcessor {
	private plugin: MyPlugin;
	private dbDetails: DatabaseDetails;
	private uploader: AttachmentUploader;

	constructor(plugin: MyPlugin, dbDetails: DatabaseDetails) {
		this.plugin = plugin;
		this.dbDetails = dbDetails;
		this.uploader = new AttachmentUploader(plugin, dbDetails);
	}

	private isStandaloneOnLine(input: string, offset: number, match: string): boolean {
		const lineStart = input.lastIndexOf("\n", Math.max(0, offset - 1)) + 1;
		const lineEndIdx = input.indexOf("\n", offset + match.length);
		const lineEnd = lineEndIdx === -1 ? input.length : lineEndIdx;
		const before = input.slice(lineStart, offset).trim();
		const after = input.slice(offset + match.length, lineEnd).trim();
		return before.length === 0 && after.length === 0;
	}

	hasInternalAttachments(content: string, sourceFile: TFile): boolean {
		const app = this.plugin.app;
		const contentWithoutCode = content.replace(/```[\s\S]*?```|`[^`\n]+`/g, "");

		const embedImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
		const embedWikilinkRegex = /!\[\[([^\]]+)\]\]/g;
		const linkMarkdownRegex = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;
		const linkWikilinkRegex = /(?<!!)\[\[([^\]]+)\]\]/g;

		let match: RegExpExecArray | null;

		while ((match = embedImageRegex.exec(contentWithoutCode)) !== null) {
			const rawPath = this.parseDestination(match[2]);
			if (this.shouldSkipLinkDestination(rawPath)) continue;
			const file = this.resolveFile(app, sourceFile, rawPath, { log: false });
			if (file && this.isSupported(file)) return true;
		}

		while ((match = embedWikilinkRegex.exec(contentWithoutCode)) !== null) {
			const linkPath = this.parseWikilink(match[1]);
			if (this.shouldSkipLinkDestination(linkPath)) continue;
			const file = this.resolveFile(app, sourceFile, linkPath, { log: false });
			if (file && this.isSupported(file)) return true;
		}

		while ((match = linkMarkdownRegex.exec(contentWithoutCode)) !== null) {
			const rawPath = this.parseDestination(match[2]);
			if (this.shouldSkipLinkDestination(rawPath)) continue;
			const file = this.resolveFile(app, sourceFile, rawPath, { log: false });
			if (file && this.isSupported(file)) return true;
		}

		while ((match = linkWikilinkRegex.exec(contentWithoutCode)) !== null) {
			const linkPath = this.parseWikilink(match[1]);
			if (this.shouldSkipLinkDestination(linkPath)) continue;
			const file = this.resolveFile(app, sourceFile, linkPath, { log: false });
			if (file && this.isSupported(file)) return true;
		}

		return false;
	}

	async processContent(content: string, sourceFile: TFile): Promise<AttachmentPrepareResult> {
		console.log(`[AttachmentProcessor] Starting attachment processing for file: ${sourceFile.path}`);

		// Strip code blocks before processing to avoid matching inside them
		const codeBlockPlaceholders: string[] = [];
		const contentWithoutCode = content.replace(/```[\s\S]*?```|`[^`\n]+`/g, (match) => {
			const placeholder = `__CODE_BLOCK_${codeBlockPlaceholders.length}__`;
			codeBlockPlaceholders.push(match);
			return placeholder;
		});
		console.log(`[AttachmentProcessor] Stripped ${codeBlockPlaceholders.length} code blocks`);

		const { internal, external } = this.collectAttachments(contentWithoutCode, sourceFile);

		if (external.length > 0) {
			console.log(`[AttachmentProcessor] Found ${external.length} external reference(s) (will be skipped):`);
			external.forEach((ref, idx) => {
				console.log(`  ${idx + 1}. [EXTERNAL] ${ref}`);
			});
		}

		if (internal.length === 0) {
			console.log(`[AttachmentProcessor] No internal attachments found in ${sourceFile.path}`);
			return {
				content,
				imageUrlToUploadId: {},
				filePlaceholderToUpload: {},
			};
		}

		console.log(`[AttachmentProcessor] Found ${internal.length} internal attachment(s) to upload:`);
		internal.forEach((attachment, idx) => {
			const typeLabel = this.isImage(attachment.file) ? 'IMAGE' : 'FILE';
			const sizeKB = (attachment.file.stat.size / 1024).toFixed(2);
			console.log(`  ${idx + 1}. [${typeLabel}] ${attachment.file.path} (${sizeKB} KB) - Ref: "${attachment.originalRef}"`);
		});

		const uploadedMap = new Map<string, { id: string; file: TFile }>();

		for (const attachment of internal) {
			try {
				console.log(`[AttachmentProcessor] Uploading: ${attachment.file.path} (${(attachment.file.stat.size / 1024).toFixed(2)} KB)`);
				const result = await this.uploader.uploadFile(attachment.file);
				uploadedMap.set(attachment.file.path, { id: result.id, file: attachment.file });
				console.log(`[AttachmentProcessor] ✓ Uploaded successfully: ${attachment.file.name} -> ${result.id}`);
			} catch (error) {
				console.error(`[AttachmentProcessor] ✗ Failed to upload ${attachment.file.path}:`, error);
			}
		}

		console.log(`[AttachmentProcessor] Upload complete: ${uploadedMap.size}/${internal.length} successful`);

		const rewriteResult = this.rewriteContent(contentWithoutCode, sourceFile, uploadedMap);

		// Restore code blocks
		let restoredContent = rewriteResult.content;
		codeBlockPlaceholders.forEach((code, idx) => {
			restoredContent = restoredContent.replace(`__CODE_BLOCK_${idx}__`, code);
		});

		console.log(`[AttachmentProcessor] Content rewrite complete:`, {
			imageReplacements: Object.keys(rewriteResult.imageUrlToUploadId).length,
			fileReplacements: Object.keys(rewriteResult.filePlaceholderToUpload).length,
		});

		return {
			content: restoredContent,
			imageUrlToUploadId: rewriteResult.imageUrlToUploadId,
			filePlaceholderToUpload: rewriteResult.filePlaceholderToUpload,
		};
	}

	private collectAttachments(content: string, sourceFile: TFile): { internal: LocalAttachment[]; external: string[] } {
		const internal: LocalAttachment[] = [];
		const external: string[] = [];
		const seen = new Set<string>();
		const app = this.plugin.app;

		console.log(`[AttachmentProcessor] Scanning for attachments in content (${content.length} chars)`);

		// Match all types of references: ![...](...)  ![[...]]  [...](...) [[...]]
		const embedImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
		const embedWikilinkRegex = /!\[\[([^\]]+)\]\]/g;
		const linkMarkdownRegex = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;
		const linkWikilinkRegex = /(?<!!)\[\[([^\]]+)\]\]/g;

		let match;

		// Process embedded images: ![alt](path)
		let embedCount = 0;
		while ((match = embedImageRegex.exec(content)) !== null) {
			embedCount++;
			const rawPath = this.parseDestination(match[2]);
			console.log(`[AttachmentProcessor] Found embedded image #${embedCount}: "${match[0]}" -> parsed path: "${rawPath}"`);

			if (this.shouldSkipLinkDestination(rawPath)) {
				if (this.isTodoUrl(rawPath)) {
					console.log(`[AttachmentProcessor]   ⊘ Unsupported URL scheme (TODO, skipped): ${rawPath}`);
				} else {
					console.log(`[AttachmentProcessor]   ⊘ External URL (skipped): ${rawPath}`);
				}
				external.push(match[0]);
				continue;
			}

			const file = this.resolveFile(app, sourceFile, rawPath);
			if (!file) {
				console.log(`[AttachmentProcessor]   ✗ Could not resolve file for path: "${rawPath}"`);
			} else if (!this.isSupported(file)) {
				console.log(`[AttachmentProcessor]   ✗ Unsupported file type: ${file.extension} (${file.path})`);
			} else if (seen.has(file.path)) {
				console.log(`[AttachmentProcessor]   ⊚ Duplicate (already added): ${file.path}`);
			} else {
				seen.add(file.path);
				internal.push({ file, originalRef: match[0] });
				console.log(`[AttachmentProcessor]   ✓ Added: ${file.path}`);
			}
		}

		// Process embedded wikilinks: ![[path]]
		let wikiEmbedCount = 0;
		while ((match = embedWikilinkRegex.exec(content)) !== null) {
			wikiEmbedCount++;
			const linkPath = this.parseWikilink(match[1]);
			console.log(`[AttachmentProcessor] Found embedded wikilink #${wikiEmbedCount}: "${match[0]}" -> parsed path: "${linkPath}"`);

			if (this.shouldSkipLinkDestination(linkPath)) {
				if (this.isTodoUrl(linkPath)) {
					console.log(`[AttachmentProcessor]   ⊘ Unsupported URL scheme (TODO, skipped): ${linkPath}`);
				} else {
					console.log(`[AttachmentProcessor]   ⊘ External URL (skipped): ${linkPath}`);
				}
				external.push(match[0]);
				continue;
			}

			const file = this.resolveFile(app, sourceFile, linkPath);
			if (!file) {
				console.log(`[AttachmentProcessor]   ✗ Could not resolve file for path: "${linkPath}"`);
			} else if (!this.isSupported(file)) {
				console.log(`[AttachmentProcessor]   ✗ Unsupported file type: ${file.extension} (${file.path})`);
			} else if (seen.has(file.path)) {
				console.log(`[AttachmentProcessor]   ⊚ Duplicate (already added): ${file.path}`);
			} else {
				seen.add(file.path);
				internal.push({ file, originalRef: match[0] });
				console.log(`[AttachmentProcessor]   ✓ Added: ${file.path}`);
			}
		}

		// Process markdown links: [text](path)
		let linkCount = 0;
		while ((match = linkMarkdownRegex.exec(content)) !== null) {
			linkCount++;
			const rawPath = this.parseDestination(match[2]);
			console.log(`[AttachmentProcessor] Found markdown link #${linkCount}: "${match[0]}" -> parsed path: "${rawPath}"`);

			if (this.shouldSkipLinkDestination(rawPath)) {
				if (this.isTodoUrl(rawPath)) {
					console.log(`[AttachmentProcessor]   ⊘ Unsupported URL scheme (TODO, skipped): ${rawPath}`);
				} else {
					console.log(`[AttachmentProcessor]   ⊘ External URL (skipped): ${rawPath}`);
				}
				external.push(match[0]);
				continue;
			}

			const file = this.resolveFile(app, sourceFile, rawPath);
			if (!file) {
				console.log(`[AttachmentProcessor]   ✗ Could not resolve file for path: "${rawPath}"`);
			} else if (!this.isSupported(file)) {
				console.log(`[AttachmentProcessor]   ✗ Unsupported file type: ${file.extension} (${file.path})`);
			} else if (seen.has(file.path)) {
				console.log(`[AttachmentProcessor]   ⊚ Duplicate (already added): ${file.path}`);
			} else {
				seen.add(file.path);
				internal.push({ file, originalRef: match[0] });
				console.log(`[AttachmentProcessor]   ✓ Added: ${file.path}`);
			}
		}

		// Process wikilink references: [[path]]
		let wikilinkCount = 0;
		while ((match = linkWikilinkRegex.exec(content)) !== null) {
			wikilinkCount++;
			const linkPath = this.parseWikilink(match[1]);
			console.log(`[AttachmentProcessor] Found wikilink reference #${wikilinkCount}: "${match[0]}" -> parsed path: "${linkPath}"`);

			if (this.shouldSkipLinkDestination(linkPath)) {
				if (this.isTodoUrl(linkPath)) {
					console.log(`[AttachmentProcessor]   ⊘ Unsupported URL scheme (TODO, skipped): ${linkPath}`);
				} else {
					console.log(`[AttachmentProcessor]   ⊘ External URL (skipped): ${linkPath}`);
				}
				external.push(match[0]);
				continue;
			}

			const file = this.resolveFile(app, sourceFile, linkPath);
			if (!file) {
				console.log(`[AttachmentProcessor]   ✗ Could not resolve file for path: "${linkPath}"`);
			} else if (!this.isSupported(file)) {
				console.log(`[AttachmentProcessor]   ✗ Unsupported file type: ${file.extension} (${file.path})`);
			} else if (seen.has(file.path)) {
				console.log(`[AttachmentProcessor]   ⊚ Duplicate (already added): ${file.path}`);
			} else {
				seen.add(file.path);
				internal.push({ file, originalRef: match[0] });
				console.log(`[AttachmentProcessor]   ✓ Added: ${file.path}`);
			}
		}

		console.log(`[AttachmentProcessor] Scan complete: ${embedCount} embeds, ${wikiEmbedCount} wiki-embeds, ${linkCount} links, ${wikilinkCount} wikilinks -> ${internal.length} internal attachments, ${external.length} external references`);
		return { internal, external };
	}

	private rewriteContent(
		content: string,
		sourceFile: TFile,
		uploadedMap: Map<string, { id: string; file: TFile }>
	): AttachmentPrepareResult {
		const imageUrlToUploadId: Record<string, string> = {};
		const filePlaceholderToUpload: Record<string, { id: string; name: string }> = {};
		const app = this.plugin.app;

		let rewritten = content;

		// Rewrite embedded images: ![alt](path)
			rewritten = rewritten.replace(
				/!\[([^\]]*)\]\(([^)]+)\)/g,
				(fullMatch, altText, rawDest, offset, input) => {
					const path = this.parseDestination(rawDest);
					if (this.shouldSkipLinkDestination(path)) return fullMatch;

					const file = this.resolveFile(app, sourceFile, path);
					if (!file) return fullMatch;

				const uploaded = uploadedMap.get(file.path);
				if (!uploaded) return fullMatch;

				if (this.isImage(file)) {
					const sentinelUrl = this.buildSentinelUrl(uploaded.id, file, altText);
					imageUrlToUploadId[sentinelUrl] = uploaded.id;
					const markdown = `![${altText}](${sentinelUrl})`;
					return typeof offset === "number" && typeof input === "string" && this.isStandaloneOnLine(input, offset, fullMatch)
						? `\n\n${markdown}\n\n`
						: markdown;
				} else {
					const token = `__NOTION_FILE_UPLOAD__:${uploaded.id}`;
					filePlaceholderToUpload[token] = { id: uploaded.id, name: file.name };
					return `\n\n\`${token}\`\n\n`;
				}
			}
		);

		// Rewrite embedded wikilinks: ![[path]]
			rewritten = rewritten.replace(
				/!\[\[([^\]]+)\]\]/g,
				(fullMatch, inner, offset, input) => {
					const linkPath = this.parseWikilink(inner);
					if (this.shouldSkipLinkDestination(linkPath)) return fullMatch;

					const file = this.resolveFile(app, sourceFile, linkPath);
					if (!file) return fullMatch;

				const uploaded = uploadedMap.get(file.path);
				if (!uploaded) return fullMatch;

				if (this.isImage(file)) {
					const sentinelUrl = this.buildSentinelUrl(uploaded.id, file);
					imageUrlToUploadId[sentinelUrl] = uploaded.id;
					const markdown = `![](${sentinelUrl})`;
					return typeof offset === "number" && typeof input === "string" && this.isStandaloneOnLine(input, offset, fullMatch)
						? `\n\n${markdown}\n\n`
						: markdown;
				} else {
					const token = `__NOTION_FILE_UPLOAD__:${uploaded.id}`;
					filePlaceholderToUpload[token] = { id: uploaded.id, name: file.name };
					return `\n\n\`${token}\`\n\n`;
				}
			}
		);

		// Rewrite markdown links: [text](path)
			rewritten = rewritten.replace(
				/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g,
				(fullMatch, _linkText, rawDest) => {
					const path = this.parseDestination(rawDest);
					if (this.shouldSkipLinkDestination(path)) return fullMatch;

					const file = this.resolveFile(app, sourceFile, path);
					if (!file) return fullMatch;

				const uploaded = uploadedMap.get(file.path);
				if (!uploaded) return fullMatch;

				// For markdown links, always use file placeholder (non-image treatment)
				const token = `__NOTION_FILE_UPLOAD__:${uploaded.id}`;
				filePlaceholderToUpload[token] = { id: uploaded.id, name: file.name };
				return `\n\n\`${token}\`\n\n`;
			}
		);

		// Rewrite wikilink references: [[path]]
			rewritten = rewritten.replace(
				/(?<!!)\[\[([^\]]+)\]\]/g,
				(fullMatch, inner) => {
					const linkPath = this.parseWikilink(inner);
					if (this.shouldSkipLinkDestination(linkPath)) return fullMatch;

					const file = this.resolveFile(app, sourceFile, linkPath);
					if (!file) return fullMatch;

				const uploaded = uploadedMap.get(file.path);
				if (!uploaded) return fullMatch;

				// For wikilink references, always use file placeholder (non-image treatment)
				const token = `__NOTION_FILE_UPLOAD__:${uploaded.id}`;
				filePlaceholderToUpload[token] = { id: uploaded.id, name: file.name };
				return `\n\n\`${token}\`\n\n`;
			}
		);

		return { content: rewritten, imageUrlToUploadId, filePlaceholderToUpload };
	}

	private parseDestination(rawDest: string): string {
		const trimmed = rawDest.trim();
		// Handle angle-bracket wrapped URLs: <path>
		if (trimmed.startsWith("<") && trimmed.includes(">")) {
			const end = trimmed.indexOf(">");
			return this.decodePathOrUrl(trimmed.slice(1, end));
		}
		// Take first non-space segment
		const match = trimmed.match(/^(\S+)/);
		return this.decodePathOrUrl(match ? match[1] : trimmed);
	}

	private parseWikilink(inner: string): string {
		const trimmed = inner.trim();
		// Remove alias: [[path|alias]]
		const beforeAlias = trimmed.split("|")[0]?.trim() ?? trimmed;
		// Remove heading: [[path#heading]]
		const beforeHeading = beforeAlias.split("#")[0]?.trim() ?? beforeAlias;
		return this.decodePathOrUrl(beforeHeading);
	}

	private decodePathOrUrl(value: string): string {
		/*
		// TODO: Support `obsidian://` and `app://` URL destinations.
		// For now we only support wikilink + standard markdown formats with vault paths.
		if (value.startsWith("obsidian://") || value.startsWith("app://")) {
			try {
				return decodeURIComponent(value);
			} catch {
				return value;
			}
		}
		*/
		// For regular paths, strip query/hash and decode
		const stripped = value.split(/[?#]/)[0] ?? value;
		try {
			return decodeURIComponent(stripped);
		} catch {
			return stripped;
		}
	}

	private isExternalUrl(link: string): boolean {
		return link.startsWith("http://") || link.startsWith("https://");
	}

	private isTodoUrl(link: string): boolean {
		return link.startsWith("obsidian://") || link.startsWith("app://");
	}

	private shouldSkipLinkDestination(link: string): boolean {
		return this.isExternalUrl(link) || this.isTodoUrl(link);
	}

	private resolveFile(app: App, sourceFile: TFile, link: string, options?: { log?: boolean }): TFile | null {
		const shouldLog = options?.log !== false;
		const log = (...args: any[]) => {
			if (shouldLog) console.log(...args);
		};

		if (!link.trim()) {
			log(`[AttachmentProcessor] resolveFile: empty link`);
			return null;
		}

		// TODO: Support `obsidian://` and `app://` URL destinations.
		if (this.isTodoUrl(link)) {
			return null;
		}

		/*
		// Handle obsidian:// URLs
		if (link.startsWith("obsidian://")) {
			const filePath = this.parseObsidianUrl(link);
			log(`[AttachmentProcessor] resolveFile: obsidian:// URL -> extracted path: "${filePath}"`);
			if (!filePath) return null;
			const file = app.vault.getAbstractFileByPath(normalizePath(filePath));
			if (file instanceof TFile) {
				log(`[AttachmentProcessor] resolveFile: ✓ Resolved obsidian:// to: ${file.path}`);
				return file;
			}
			log(`[AttachmentProcessor] resolveFile: ✗ Failed to resolve obsidian:// path: ${filePath}`);
			return null;
		}

		// Handle app://local/ URLs (Obsidian internal)
		if (link.startsWith("app://")) {
			const filePath = this.parseAppUrl(link);
			log(`[AttachmentProcessor] resolveFile: app:// URL -> extracted path: "${filePath}"`);
			if (!filePath) return null;

			const vaultCandidate = filePath.startsWith("/") ? filePath.slice(1) : filePath;
			let file = app.vault.getAbstractFileByPath(normalizePath(vaultCandidate));
			if (file instanceof TFile) {
				log(`[AttachmentProcessor] resolveFile: ✓ Resolved app:// to: ${file.path}`);
				return file;
			}

			const mapped = this.mapAbsolutePathToVault(app, filePath);
			if (mapped) {
				file = app.vault.getAbstractFileByPath(normalizePath(mapped));
				if (file instanceof TFile) {
					log(`[AttachmentProcessor] resolveFile: ✓ Resolved app:// absolute path to: ${file.path}`);
					return file;
				}
			}

			log(`[AttachmentProcessor] resolveFile: ✗ Failed to resolve app:// path: ${filePath}`);
			return null;
		}
		*/

		// Try metadata cache first
		const cached = app.metadataCache.getFirstLinkpathDest(link, sourceFile.path);
		if (cached instanceof TFile) {
			log(`[AttachmentProcessor] resolveFile: ✓ Resolved via metadata cache: ${link} -> ${cached.path}`);
			return cached;
		}

		// Try absolute path
		const byPath = app.vault.getAbstractFileByPath(normalizePath(link));
		if (byPath instanceof TFile) {
			log(`[AttachmentProcessor] resolveFile: ✓ Resolved via absolute path: ${link} -> ${byPath.path}`);
			return byPath;
		}

		// Try relative to source file
		const sourceDir = sourceFile.path.includes("/")
			? sourceFile.path.slice(0, sourceFile.path.lastIndexOf("/"))
			: "";
		const relPath = normalizePath(sourceDir ? `${sourceDir}/${link}` : link);
		const byRel = app.vault.getAbstractFileByPath(relPath);
		if (byRel instanceof TFile) {
			log(`[AttachmentProcessor] resolveFile: ✓ Resolved via relative path: ${link} -> ${byRel.path}`);
			return byRel;
		}

		log(`[AttachmentProcessor] resolveFile: ✗ Failed to resolve: ${link} (tried cache, absolute, relative)`);
		return null;
	}

	/*
	// TODO: Support `obsidian://` URL destinations.
	private parseObsidianUrl(url: string): string | null {
		try {
			const urlObj = new URL(url);
			// obsidian://open?vault=VaultName&file=path/to/file.png
			const filePath = urlObj.searchParams.get("file");
			if (filePath) {
				return decodeURIComponent(filePath);
			}
			return null;
		} catch {
			return null;
		}
	}

	// TODO: Support `app://` URL destinations.
	private parseAppUrl(url: string): string | null {
		try {
			const urlObj = new URL(url);
			const pathname = urlObj.pathname;
			if (!pathname || pathname === "/") return null;
			return decodeURIComponent(pathname);
		} catch {
			return null;
		}
	}

	// TODO: Support mapping absolute paths to vault paths for `app://local/...`.
	private mapAbsolutePathToVault(app: App, absolutePath: string): string | null {
		const adapter: any = app.vault.adapter;
		if (typeof adapter?.getBasePath !== "function") {
			return null;
		}

		let normalizedAbsolute = absolutePath.replace(/\\/g, "/");
		if (/^\/[A-Za-z]:\//.test(normalizedAbsolute)) {
			normalizedAbsolute = normalizedAbsolute.slice(1);
		}

		let basePath = String(adapter.getBasePath()).replace(/\\/g, "/");
		if (basePath.endsWith("/")) {
			basePath = basePath.slice(0, -1);
		}
		if (/^\/[A-Za-z]:\//.test(basePath)) {
			basePath = basePath.slice(1);
		}

		const windowsStyle = /^[A-Za-z]:\//.test(basePath);
		const compareAbsolute = windowsStyle ? normalizedAbsolute.toLowerCase() : normalizedAbsolute;
		const compareBase = windowsStyle ? basePath.toLowerCase() : basePath;

		if (!compareAbsolute.startsWith(compareBase)) {
			return null;
		}

		let relative = normalizedAbsolute.slice(basePath.length);
		if (relative.startsWith("/")) {
			relative = relative.slice(1);
		}
		return relative || null;
	}
	*/

	private isSupported(file: TFile): boolean {
		const ext = file.extension?.toLowerCase() ?? "";
		return SUPPORTED_EXTENSIONS.has(ext);
	}

	private isImage(file: TFile): boolean {
		const ext = file.extension?.toLowerCase() ?? "";
		return IMAGE_EXTENSIONS.has(ext);
	}

	private buildSentinelUrl(uploadId: string, file: TFile, _altText?: string): string {
		const ext = file.extension?.toLowerCase() ?? "";
		const suffix = ext ? `.${ext}` : "";
		return `https://notion-file-upload.local/${uploadId}${suffix}`;
	}
}

export function applyBlockRewrites(
	blocks: any[],
	rewrites: Pick<AttachmentPrepareResult, "imageUrlToUploadId" | "filePlaceholderToUpload">
): void {
	transformBlocksInPlace(blocks, rewrites);
}

function transformBlocksInPlace(
	blocks: any[],
	rewrites: Pick<AttachmentPrepareResult, "imageUrlToUploadId" | "filePlaceholderToUpload">
): void {
	for (let i = 0; i < blocks.length; i++) {
		const block = blocks[i];

		// Transform image blocks with sentinel URLs
		if (block?.type === "image" && block?.image?.type === "external") {
			const url = block.image?.external?.url;
			if (url && rewrites.imageUrlToUploadId[url]) {
				const caption = block.image?.caption;
				block.image = {
					type: "file_upload",
					file_upload: { id: rewrites.imageUrlToUploadId[url] },
					...(caption ? { caption } : {}),
				};
			}
		}

		// Transform paragraph placeholders to file blocks
		if (block?.type === "paragraph") {
			const token = extractParagraphText(block);
			if (token && rewrites.filePlaceholderToUpload[token]) {
				const { id, name } = rewrites.filePlaceholderToUpload[token];
				blocks[i] = buildFileBlock(id, name);
			}
		}

		// Recurse into children
		const inner = block?.[block?.type];
		if (inner?.children && Array.isArray(inner.children)) {
			transformBlocksInPlace(inner.children, rewrites);
		}
	}
}

function extractParagraphText(block: any): string | undefined {
	const richText = block?.paragraph?.rich_text;
	if (!Array.isArray(richText) || richText.length === 0) return undefined;
	return richText
		.map((item: any) => item?.plain_text ?? item?.text?.content ?? "")
		.join("")
		.trim() || undefined;
}

function buildFileBlock(uploadId: string, name: string): any {
	return {
		object: "block",
		type: "file",
		file: {
			type: "file_upload",
			file_upload: { id: uploadId },
		},
	};
}
