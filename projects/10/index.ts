import { checkArgv, getFileDir } from "./util";
import path from "path";
import fs from "fs";
import { Tokenizer } from "./tokenizer";
import { Splitter } from "./splitter";
import { XMLCreator } from "./xmlCreator";
import { Compilation } from "./compilationEngine";
import { Initiarize } from "./initiarize";

const main = () => {
  checkArgv(process.argv);
  const root = process.argv[2];
  const dir = getFileDir(root);
  dir.forEach((filePath) => {
    if (!filePath.endsWith(".jack")) return;
    const file = fs.readFileSync(path.resolve(root, filePath), {
      encoding: "utf-8",
    });
    console.log(`start: ${filePath}`);
    const tokenizedString = Tokenizer(Splitter(file));
    console.log(tokenizedString);

    if (process.argv[3] && process.argv[3] !== "--skipTokenizedXML") {
      console.log(`tokenized generating: ${filePath}`);
      const tokenizedXML = XMLCreator(tokenizedString);
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `TokenizeResults/${filePath.replace(".jack", "T.xml")}`
        ),
        tokenizedXML
      );
    }

    if (process.argv[3] && process.argv[3] !== "--skipCompileXML") {
      console.log(`compile generating: ${filePath}`);
      const compileXML = Compilation();
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `CompileResults/${filePath.replace(".jack", ".xml")}`
        ),
        compileXML
      );
    }
    console.log(`completed: ${filePath}`);
    Initiarize(filePath);
  });
};

main();
