import fs from "node:fs";
import path from "node:path";
import os from "node:os";

/**
 * Resolves a safe, writable data directory path across all environments:
 * 1. Local Development: `process.cwd()/data`
 * 2. Serverless (Vercel / AWS Lambda / Cloudflare): `os.tmpdir()/unicure-data`
 */
export function getSafeDataFilePath(filename: string): string {
  // If in read-only serverless environment
  const isServerless =
    !!process.env.VERCEL ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    (typeof process.cwd === "function" && process.cwd().startsWith("/var/task"));

  const targetDir = isServerless
    ? path.resolve(os.tmpdir(), "unicure-data")
    : path.resolve(process.cwd(), "data");

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    return path.resolve(targetDir, filename);
  } catch (err) {
    // If target mkdir fails (e.g. read-only filesystem), fallback to os.tmpdir()
    try {
      const fallbackDir = path.resolve(os.tmpdir(), "unicure-data");
      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true });
      }
      return path.resolve(fallbackDir, filename);
    } catch {
      return path.resolve(os.tmpdir(), filename);
    }
  }
}

/**
 * Safe JSON File Reader with in-memory fallback
 */
export function safeReadJsonFile<T>(filename: string, fallback: T): T {
  try {
    // 1. Try safe writable path first
    const filePath = getSafeDataFilePath(filename);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed !== undefined && parsed !== null) return parsed;
    }

    // 2. Try repo root data/ path if bundled with deployment
    const rootDataPath = path.resolve(process.cwd(), "data", filename);
    if (fs.existsSync(rootDataPath)) {
      const raw = fs.readFileSync(rootDataPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed !== undefined && parsed !== null) return parsed;
    }
  } catch (err) {
    console.warn(`[SafeStorage] Read error for ${filename}, using default fallback:`, err);
  }
  return fallback;
}

/**
 * Safe JSON File Writer (Never crashes serverless functions)
 */
export function safeWriteJsonFile<T>(filename: string, data: T): void {
  try {
    const filePath = getSafeDataFilePath(filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn(`[SafeStorage] Non-critical write notice for ${filename}:`, err);
  }
}
