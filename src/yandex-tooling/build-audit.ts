import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface YandexBuildAuditOptions {
  requiredRootFiles?: readonly string[];
  maxUncompressedBytes?: number;
}

export interface YandexBuildAuditReport {
  root: string;
  fileCount: number;
  uncompressedBytes: number;
  files: string[];
  errors: string[];
  warnings: string[];
}

const listFiles = async (root: string, relative = ''): Promise<string[]> => {
  const directory = path.join(root, relative);
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const next = relative ? path.join(relative, entry.name) : entry.name;
    if (entry.isDirectory()) files.push(...await listFiles(root, next));
    else if (entry.isFile()) files.push(next.split(path.sep).join('/'));
  }
  return files;
};

/**
 * Audits the directory that will become the root of a Yandex Games upload ZIP.
 * ZIP creation itself stays with the consumer/CI so the kit does not impose an
 * archiver dependency.
 */
export const auditYandexBuildDirectory = async (
  root: string,
  options: YandexBuildAuditOptions = {},
): Promise<YandexBuildAuditReport> => {
  const files = (await listFiles(root)).sort();
  const errors: string[] = [];
  const warnings: string[] = [];
  const requiredRootFiles = options.requiredRootFiles ?? ['index.html'];
  for (const required of requiredRootFiles) {
    if (!files.includes(required)) errors.push(`Missing required root file: ${required}`);
  }

  let uncompressedBytes = 0;
  for (const file of files) {
    uncompressedBytes += (await fs.stat(path.join(root, file))).size;
  }
  if (options.maxUncompressedBytes !== undefined && uncompressedBytes > options.maxUncompressedBytes) {
    errors.push(
      `Uncompressed build size ${uncompressedBytes} exceeds configured limit ${options.maxUncompressedBytes}`,
    );
  }
  if (files.some((file) => file.startsWith('dist/'))) {
    warnings.push('Build contains a nested dist/ directory; verify the ZIP is not wrapping the intended root.');
  }

  return { root, fileCount: files.length, uncompressedBytes, files, errors, warnings };
};

export const assertYandexBuildDirectory = async (
  root: string,
  options: YandexBuildAuditOptions = {},
): Promise<YandexBuildAuditReport> => {
  const report = await auditYandexBuildDirectory(root, options);
  if (report.errors.length > 0) throw new Error(report.errors.join('; '));
  return report;
};

export const sha256File = async (filePath: string): Promise<string> => {
  const data = await fs.readFile(filePath);
  return createHash('sha256').update(data).digest('hex');
};
