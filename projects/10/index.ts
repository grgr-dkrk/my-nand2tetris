import { checkArgv, getFileDir } from "./libs/file";
import path from "path";
import fs from "fs";
import { Tokenizer } from "./Tokenizer";
import { Splitter } from "./libs/textSplitter";
import { TokenizedXMLCreator } from "./Tokenizer/xmlCreator";
import { Compilation } from "./CompilationEngine";
import { Initiarize } from "./libs/initiarize";

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

    /**
     * Tokenizer
     */
    if (process.argv[3] && process.argv[3] !== "--skipTokenizedXML") {
      console.log(`tokenized generating: ${filePath}`);
      const tokenizedXML = TokenizedXMLCreator(tokenizedString);
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `ProgramResults/Tokenizer/${filePath.replace(".jack", "T.xml")}`
        ),
        tokenizedXML
      );
    }

    /**
     * Compiler
     */
    if (process.argv[3] && process.argv[3] !== "--skipCompileXML") {
      console.log(`compile generating: ${filePath}`);
      const compileXML = Compilation();
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `ProgramResults/Compiler/${filePath.replace(".jack", ".xml")}`
        ),
        compileXML
      );
    }
    console.log(`completed: ${filePath}`);
    Initiarize(filePath);
  });
};

main();
