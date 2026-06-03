// Ports https://github.com/iteufel/node-strings-file/blob/master/index.js to TyeScript and ESM:

import fs from "fs";
import iconv from "iconv-lite";

type ParsedStrings = {
  [key: string]: string | { value: string; comment: string };
};

export function parse(data: string, wantComments?: boolean): ParsedStrings {
  if (data.indexOf("\n") === -1) {
    data += "\n";
  }
  const re = /(?:\/\*(.+)\*\/\n)?(.+)\s*=\s*"(.+)";\n/gim;
  const res: ParsedStrings = {};
  let m: RegExpExecArray | null;

  while ((m = re.exec(data)) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    let key = m[2]!;
    const value = m[3]!;
    if (key.substring(0, 1) === '"') {
      key = key.trim().slice(1, -1);
    }
    if (wantComments) {
      res[key] = {
        value: unescapeString(value),
        comment: m[1] || "",
      };
    } else {
      res[key] = unescapeString(value);
    }
  }
  return res;
}

export function build(obj: ParsedStrings): string {
  let data = "";
  for (const i in obj) {
    if (typeof obj[i] === "object") {
      if (obj[i]["comment"] && obj[i]["comment"].length > 0) {
        data += `\n/*${obj[i]["comment"]}*/\n`;
      }
      data += `"${i}" = "${escapeString(obj[i]["value"])}";\n`;
    } else if (typeof obj[i] === "string") {
      data += `\n"${i}" = "${escapeString(obj[i])}";\n`;
    }
  }
  return data;
}

function escapeString(str: string): string {
  return str.replace(/"/gim, '\\"');
}

function unescapeString(str: string): string {
  return str.replace(/\\"/gim, '"');
}

export async function openAsync(file: string, wantComments?: boolean) {
  const data = await fs.promises.readFile(file);
  return parse(iconv.decode(data, "utf-16"), wantComments);
}

export function writeAsync(filename: string, data: ParsedStrings) {
  return fs.promises.writeFile(
    filename,
    iconv.encode(build(data), "utf-16"),
    "binary",
  );
}
