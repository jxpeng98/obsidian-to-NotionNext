import { readFileSync, writeFileSync } from "fs";

const targetVersion = process.env.npm_package_version;

// read minAppVersion from manifest.json and bump version to target version
let manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t"));

// update versions.json with target version and minAppVersion from manifest.json
let versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t"));

// tag the changelog by converting "Unreleased" to the new version section
function bumpChangelog(version) {
	const changelogPath = "CHANGELOG.md";
	const content = readFileSync(changelogPath, "utf8");

	const unreleasedHeader = "## Unreleased";
	if (!content.includes(unreleasedHeader)) {
		console.warn(`[version-bump] ${unreleasedHeader} not found in ${changelogPath}, skipping changelog tagging`);
		return;
	}

	const today = new Date().toISOString().slice(0, 10);
	const releaseHeader = `## ${version} (${today})`;
	const updated = content.replace(unreleasedHeader, releaseHeader);

	const marker = "# Changelog\n\n";
	if (!updated.startsWith(marker)) {
		writeFileSync(changelogPath, updated);
		return;
	}

	const newUnreleased = [
		"## Unreleased",
		"",
		"### Added",
		"",
		"### Changed",
		"",
		"### Fixed",
		"",
	].join("\n");

	writeFileSync(changelogPath, marker + newUnreleased + updated.slice(marker.length));
}

bumpChangelog(targetVersion);
