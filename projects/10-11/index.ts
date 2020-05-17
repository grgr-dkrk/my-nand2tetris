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
  const compileFolderName = root.split('/').slice(-1)[0]
  dir.forEach((filePath) => {
    if (!filePath.endsWith(".jack")) return;
    const file = fs.readFileSync(path.resolve(root, filePath), {
      encoding: "utf-8",
    });
    console.log(`start: ${filePath}`);
    const tokenizedString = Tokenizer(Splitter(file));

    /**
     * Tokenizer
     */
    if (process.argv[3] && process.argv[3] === "--torkenize") {
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
    if (process.argv[3] && process.argv[3] === "--compile") {
      console.log(`compile generating: ${filePath}`);
      const className = filePath.replace(".jack", "");
      const compiled = Compilation(className);
      if (!fs.existsSync(path.resolve(__dirname, `ProgramResults/${compileFolderName}`))) {
        fs.mkdirSync(path.resolve(__dirname, `ProgramResults/${compileFolderName}`))
      }
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `ProgramResults/Compiler/${filePath.replace(".jack", ".xml")}`
        ),
        compiled.xml
      );
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `ProgramResults/${compileFolderName}/${filePath.replace(".jack", ".vm")}`
        ),
        compiled.vm
      );
    }
    console.log(`completed: ${filePath}`);
    Initiarize(filePath);
  });
};

main();
