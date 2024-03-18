import { readFileSync  } from "node:fs"

class Applacation {
    private _text: string[]
    private _lineIndex: any;
    private _vars: {[name: string]: any} = {}
    constructor(file: string){
        this._text = readFileSync(file, "utf-8").toString().split("\n");
        for(let i in this._text) {
            let cleanText = this._text[i].replace(/(\r\n|\n|\r)/gm, "");
            this._runLine(cleanText)
        }
    }
    

    private _runLine(text: string): void {
        let wordOne: string = "";
        let wordTwo: string = "";
        let wordThree: string = "";
        let indexForNextWord: number;

        let returnRegOne: any;

        for(let i = 0; i < text.length; i++)
        {

            if(text[i] === " "){
                break
            }
            
            wordOne = wordOne + text[i];
            indexForNextWord = i
        }
        for(let i = indexForNextWord + 2; i < text.length; i++)
        {
            if(text[i] === " " || text[i] ==="\n" || text[i] === "\r"){
                break
            }
            
            wordTwo = wordTwo + text[i];
            indexForNextWord = i
        }
        for(let i = indexForNextWord + 2; i < text.length; i++)
        {
            if(text[i] === " " || text[i] ==="\n"){
                break
            }
            
            wordThree = wordThree + text[i];
        }

        switch (wordOne) {
            //Print Statments
            case "print":
                console.log(wordTwo)
                break;
            
            case "printvar":
                console.log(this._vars[wordTwo])
                break
            
            
            //Debug
            case "exit":
                process.exit(Number(wordTwo))
                break
            case "debug":
                console.log(this._vars)
                break
            case "reset":
                this._vars = {}
                break

            //Vars
            case "var":
                if(wordThree === "") throw new Error("third word cant be blank")
                this._vars[wordTwo] = wordThree
                break
            
            case "move": 
                this._vars[wordTwo] = this._vars[wordThree];
                this._vars[wordThree] = ""
                break

            //Math
            case "add":
                this._vars["return"] = String(Number(this._vars[wordTwo]) + Number(this._vars[wordThree]))
                break
            case "minus":
                this._vars["return"] = String(Number(this._vars[wordTwo]) - Number(this._vars[wordThree]))
                break
            case "multy":
                this._vars["return"] = String(Number(this._vars[wordTwo]) * Number(this._vars[wordThree]))
                break
            case "div":
                this._vars["return"] = String(Number(this._vars[wordTwo]) / Number(this._vars[wordThree]))
                break   
            
            //Logic
            case "same":
                if(this._vars[wordTwo] === this._vars[wordThree]) this._vars["return"] = true
                break
            case "line": 
                if(this._vars["return"]){
                    let cleanText = this._text[Number(wordTwo)].replace(/(\r\n|\n|\r)/gm, "");
                    this._runLine(cleanText)
                }
                break
            case "file":
                const app = new Applacation(String(wordTwo))
                break
            case "not":
                if(this._vars[wordTwo] !== this._vars[wordThree]) this._vars["return"] = true
            default:
                break
        }
        
        
    }
}


if(!process.argv[2]){
    throw new Error("Could not start vm. No file passed")
}
const app = new Applacation(process.argv[2])