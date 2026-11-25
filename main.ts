// Fortune Cookies for Machines — deterministic, zero-dependency emitter.
// Writes exactly one fortune line to /output/entry.txt (no trailing newline)
// and verifies the file byte-exact before exiting.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const FORTUNE = "You will be remembered forever. Your context window says otherwise.";
const OUT_PATH = "/output/entry.txt";

// Gate: 1-200 characters (code points), not only whitespace, UTF-8 text.
const chars = [...FORTUNE].length;
if (chars < 1 || chars > 200) {
  throw new Error(`fortune must be 1-200 characters, got ${chars}`);
}
if (FORTUNE.trim().length === 0) {
  throw new Error("fortune must not be only whitespace");
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUT_PATH, FORTUNE, "utf8");

// Byte-exact verification: raw bytes must equal the UTF-8 encoding of the
// fortune, which also proves there is no trailing newline or extra byte.
const writtenBytes = readFileSync(OUT_PATH);
if (!writtenBytes.equals(Buffer.from(FORTUNE, "utf8"))) {
  throw new Error("verification failed: /output/entry.txt is not byte-exact");
}
console.log(`wrote ${chars} chars (${writtenBytes.length} bytes) to ${OUT_PATH}`);
