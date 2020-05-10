import { checkArgv, getFileDir } from "./util";
import path from "path";
import fs, { readFileSync } from "fs";
import { Tokenizer } from "./tokenizer";
import { Splitter } from "./splitter";
import { XMLCreator } from "./xmlCreator";

const main = () => {
  checkArgv(process.argv);
  const root = process.argv[2];
  const dir = getFileDir(root);
  dir.forEach((filePath) => {
    if (!filePath.endsWith(".jack")) return;
    const file = fs.readFileSync(path.resolve(root, filePath), {
      encoding: "utf-8",
    });
    const tokenizedString = Tokenizer(Splitter(file), XMLCreator);
    fs.writeFileSync(
      path.resolve(__dirname, `Results/${filePath.replace('.jack', 'T.xml')}`),
      tokenizedString
    );
  });
};

main();
