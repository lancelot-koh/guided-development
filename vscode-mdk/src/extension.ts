import { ISnippet } from '@sap-devx/code-snippet-types';
import { ICollection, CollectionType, IItem, ManagerAPI, IItemExecuteAction, IItemExecuteContext } from '@sap-devx/guided-development-types';
import { bas, ISnippetAction } from '@sap-devx/app-studio-toolkit-types';
import * as vscode from 'vscode';
import * as _ from 'lodash';
import * as fs from 'fs';

const datauri = require("datauri");

const EXT_ID = "saposs.vscode-mdk";
let extensionPath: string;

let addComponentIntoPage: ISnippetAction;
let removeComponentFromPage: ISnippetAction;
let enableSearchInComponent: ISnippetAction;
let disableSearchInComponent: ISnippetAction;
let projectDir: string;

function getCollections(): ICollection[] {
    const collections: ICollection[] = [];

    // let idx =  0; //_.random();
    // if (idx == 0) {
        
        let pageCollection: ICollection = {
            id: "pageCollection",
            title: "MDK Page",
            description: "This is a tool to Create Or Edit MDK Page",
            type: CollectionType.Scenario,
            itemIds: [
                `${EXT_ID}.add-component-into_page`,
                `${EXT_ID}.remove-component-from-page`
            ]
        };
        collections.push(pageCollection);
    // } else {
        let componentCollection: ICollection = {
            id: "dataobjectCollection",
            title: "MDK Component",
            description: "This is a tool to Congiure MDK Component",
            type: CollectionType.Scenario,
            itemIds: [
                `${EXT_ID}.enable-search-in-component`,
                `${EXT_ID}.disable-search-in-component` 
                ]
        };
        collections.push(componentCollection);
    // }

    return collections;
}

function getItems(): Array<IItem> {
    return getInitialItems();
}

function getInitialItems(): Array<IItem> {
	const items: Array<IItem> = [];
	let item: IItem;
    item = {
        id: "add-component-into_page",
        title: "Add Component into Page",
        description: "Select the component you want to add into page.",
        action1:  {
            name: "Add Component Into Page",
            action: addComponentIntoPage,
            contexts: [{
                project: "myProj",
                context: {"actionName": "addComponentIntoPage",
                    "title": "Add Component into Page",
                    "description": "Add Component into Page",
                    "categoty": "Page"
                }
            }]
        },
        labels: [
            { "Project Type": "MDK Page" }
        ]
    };
    items.push(item);

    item = {
        id: "remove-component-from-page",
        title: "Remove Component from Page",
        description: "Remove Component from Page",
        action1:  {
            name: "Remove Component from Page",
            action: removeComponentFromPage,
            contexts: [{
                project: "myProj",
                context: {"actionName": "removeComponentFromPage", 
                    "title": "Remove Component from Page",
                    "description": "Remove Component from Page",
                    "categoty": "Page"
                }
            }]
        },
        labels: [
            { "Project Type": "MDK Page" }
        ]
    };
    items.push(item);

    item = {
        id: "enable-search-in-component",
        title: "Enable/Disable search in Component",
        description: "Select the component you want to add into page.",
        action1:  {
            name: "Enable",
            action: enableSearchInComponent,
            contexts: [{
                project: "myProj",
                context: {
                    "actionName": "enableSearchInComponent", 
                    "title": "Enable search in Component X",
                    "description": "Enable search in Component",
                    "categoty": "DataObjects"
                }
            }]
        },
        
        labels: [
            { "Project Type": "MDK Page" }
        ]
    };
    items.push(item);

    item = {
        id: "disable-search-in-component",
        title: "Enable/Disable search in Component",
        description: "Select the component you want to add into page.",
        
        action1: {
            name: "Disable",
            action: disableSearchInComponent,
            contexts: [{
                project: "myProj",
                context: {
                    "actionName": "disableSearchInComponent", 
                    "title": "Disable search in Component Y",
                    "description": "Disable search in Component",
                    "categoty": "DataObjects"
                }
            }]
        },
        labels: [
            { "Project Type": "MDK Page" }
        ]
    };


    items.push(item);

    
    return items;
}

export async function activate(context: vscode.ExtensionContext) {
    extensionPath = context.extensionPath;
    projectDir = extensionPath + '/MDKProject/crud3.mdkproject/metadata'; 
    let testFile = projectDir + "/DataObjects/Authors/Authors_List.dataobject";
    
    const basAPI: typeof bas = vscode.extensions.getExtension("SAPOSS.app-studio-toolkit")?.exports;
    basAPI.getExtensionAPI<ManagerAPI>("SAPOSS.guided-development").then((managerAPI) => {
        // vscode.workspace.openTextDocument(vscode.Uri.parse(testFile)).then(async (content) => {
            // console.log(content.getText());
            // resolve the file content to check what need to show in the collection.
            createGuidedDevActions(basAPI);
            managerAPI.setData(EXT_ID, getCollections(), getItems());
        // });
    });

    const api = {
		getCodeSnippets(context: any) {
			const snippets = new Map<string, ISnippet>();
			let snippet: ISnippet = {
				getMessages() {
					return {
						title: context.title,
						description: context.description,
						applyButton: "Apply"
					};
				},
				async getQuestions() {
					return createCodeSnippetQuestions(context);
				},
				async getWorkspaceEdit(answers: any) {
					return createCodeSnippetWorkspaceEdit(answers, context);
				}
			}
			snippets.set("snippet_1", snippet);
			return snippets;
		},
    };

    return api;
}

function createGuidedDevActions(basAPI: typeof bas) {
    addComponentIntoPage = new basAPI.actions.SnippetAction();
    addComponentIntoPage.contributorId = EXT_ID;
    addComponentIntoPage.snippetName = "snippet_1";
    addComponentIntoPage.context = {};

    removeComponentFromPage = new basAPI.actions.SnippetAction();
    removeComponentFromPage.contributorId = EXT_ID;
    removeComponentFromPage.snippetName = "snippet_1";
    removeComponentFromPage.context = {};

    enableSearchInComponent = new basAPI.actions.SnippetAction();
    enableSearchInComponent.contributorId = EXT_ID;
    enableSearchInComponent.snippetName = "snippet_1";
    enableSearchInComponent.context = {};

    disableSearchInComponent = new basAPI.actions.SnippetAction();
    disableSearchInComponent.contributorId = EXT_ID;
    disableSearchInComponent.snippetName = "snippet_1";
    disableSearchInComponent.context = {};
    
}

async function createCodeSnippetWorkspaceEdit(answers: any, context: any) {
    let fileURI: vscode.Uri;
    if (context.categoty === "Page") {
        fileURI = vscode.Uri.parse(projectDir + answers.pageList);
    } else if (context.categoty === "DataObjects") {
        fileURI = vscode.Uri.parse(projectDir + answers.dataobjectList);
    } else {
        return;
    }

    let actionName = context.actionName;

    switch (actionName) {
        case 'addComponentIntoPage':
            insertSnippetsWhenAddComponentIntoPage(fileURI, answers);
            break;
        case 'removeComponentFromPage':
            applyRemoveComponentFromPage(fileURI, answers);
            break;
        case 'enableSearchInComponent':
            applyEnableSearchInComponent(fileURI);
            break;
        case 'disableSearchInComponent':
            applyDisableSearchInComponent(fileURI);
            break;
        
    }
    return undefined;
}

async function createCodeSnippetQuestions(context: any) {
    let questions: any[] = [];
    let actionName = context.actionName;
    switch(actionName) {
        case 'addComponentIntoPage': 
            return getQuestionsWhenAddComponent();
        case 'removeComponentFromPage':
            return getQuestionsWhenRemoveComponent();
        case 'enableSearchInComponent':
            return getQuestionsWhenEnableSearchInComponent();
        case 'disableSearchInComponent':
            return getQuestionsWhenDisableSearchInComponent();
        default:
            return [];
    }
}

async function getQuestionsWhenAddComponent() {
    let pageChoices: any = [];
    let dataobjectChoices: any = [];
    const pattern = new vscode.RelativePattern(projectDir, '**/*.{page,dataobject}');
    return vscode.workspace.findFiles(pattern).then(files => {
        for (const file of files) {
            if (_.endsWith(file.fsPath, "_List.page")) {
                pageChoices.push({
                    name: file.fsPath.replace(projectDir, ''),
                    value: file.fsPath.replace(projectDir, ''),
                });
            } else if (_.endsWith(file.fsPath, ".dataobject")) {
                dataobjectChoices.push({
                    name: file.fsPath.replace(projectDir, ''),
                    value: file.fsPath.replace(projectDir, ''),
                });
            }
            
        }
        const questions: any[] = [];
        questions.push(
            {
                type: "list",
                name: "pageList",
                message: "Page List",
                choices: () => pageChoices
            },
            {
                type: "input",
                name: "name",
                message: "Data Object Name"
            },
            {
                type: "list",
                name: "dataobjectList",
                message: "DataObject List",
                choices: () => dataobjectChoices
            },
          );
      
        return questions;
      });
}

function getQuestionsWhenRemoveComponent() {
    let pageChoices: any = [];
    const pattern = new vscode.RelativePattern(projectDir, '**/*.page');
    return vscode.workspace.findFiles(pattern).then(files => {
        for (const file of files) {
            if (_.endsWith(file.fsPath, "_List.page")) {
                pageChoices.push({
                    name: file.fsPath.replace(projectDir, ''),
                    value: file.fsPath.replace(projectDir, ''),
                });
            }
        }
        const questions: any[] = [];
        questions.push(
            {
                type: "list",
                name: "pageList",
                message: "Page List",
                choices: () => pageChoices
            },
            {
                type: "list",
                name: "removed",
                message: "DataObject List in files",
                choices: function(answers: any) {
					if (answers.pageList !== undefined) {
                        return getDataObjectListFromFile(answers.pageList);
					}
                    return [];
                },
                when: function (answers: any) {
                    return answers.pageList !== undefined? true : false;
                  }, 
            }
          );
      
        return questions;
      });
}


async function getQuestionsWhenEnableSearchInComponent() {
    let dataobjectChoices: any = [];
    const pattern = new vscode.RelativePattern(projectDir, '**/*.dataobject');
    return vscode.workspace.findFiles(pattern).then(files => {
        for (const file of files) {
            if (_.endsWith(file.fsPath, ".dataobject")) {
                dataobjectChoices.push({
                    name: file.fsPath.replace(projectDir, ''),
                    value: file.fsPath.replace(projectDir, ''),
                });
            }
            
        }
        const questions: any[] = [];
        questions.push(
            {
                type: "list",
                name: "dataobjectList",
                message: "DataObject List",
                choices: () => dataobjectChoices
            }
          );
      
        return questions;
      });
}

async function getQuestionsWhenDisableSearchInComponent() {
    let dataobjectChoices: any = [];
    const pattern = new vscode.RelativePattern(projectDir, '**/*.dataobject');
    return vscode.workspace.findFiles(pattern).then(files => {
        for (const file of files) {
            if (_.endsWith(file.fsPath, ".dataobject")) {
                dataobjectChoices.push({
                    name: file.fsPath.replace(projectDir, ''),
                    value: file.fsPath.replace(projectDir, ''),
                });
            }
            
        }
        const questions: any[] = [];
        questions.push(
            {
                type: "list",
                name: "dataobjectList",
                message: "DataObject List",
                choices: () => dataobjectChoices
            },
            {
                type: "list",
                name: "removed",
                message: "DataObject List in files",
                choices: function(answers: any) {
					if (answers.dataobjectList !== undefined) {
                        return [{name: "Yes", value: true},{name: "No", value: false}];
					}
                    return [];
                },
                when: function (answers: any) {
                    return answers.dataobjectList !== undefined? true : false;
                  }, 
            }
          );
      
        return questions;
      });
}

async function getDataObjectListFromFile(page: string) {
    let currentPageURI: vscode.Uri = vscode.Uri.parse(projectDir + page);
    let content = readFileContent(currentPageURI);
    let jsonDoc = JSON.parse(content);
    let doList = [];
    let sections = jsonDoc.Controls[0].Sections;
    for(let i = 0; i < sections.length; i++) {
        if (sections[i]._Type === 'Section.Type.DataObject') {
            doList.push(sections[i]._Name);
        }
    }
    return doList;
}

async function insertSnippetsWhenAddComponentIntoPage(currentPage: vscode.Uri, answers: any) {
    let content = readFileContent(currentPage);
    let jsonDoc = JSON.parse(content);
    let sections = jsonDoc.Controls[0].Sections;
    let dataobject = {
        DataObject: answers.dataobjectList,
        _Name: answers.name,
        _Type: "Section.Type.DataObject"
    };
    sections.push(dataobject);
    writeToFile(jsonDoc, currentPage);
}

async function applyEnableSearchInComponent(currentPage: vscode.Uri) {
    let content = readFileContent(currentPage);
    let jsonDoc = JSON.parse(content);
    let search = jsonDoc.Search;
    if (search === undefined) {
        jsonDoc['Search'] = {
            Enabled: true,
            Placeholder: "Item Search",
            BarcodeScanner: true,
            Delay: 500,
            MinimumCharacterThreshold: 3
        };
    } else {
        jsonDoc['Search']['Enabled']= true;
    }
    writeToFile(jsonDoc, currentPage);
}

async function applyDisableSearchInComponent(currentPage: vscode.Uri) {
    let content = readFileContent(currentPage);
    let jsonDoc = JSON.parse(content);
    let search = jsonDoc.Search;
    if (search) {
        jsonDoc.Search['Enabled']= false;
    } else {
        delete jsonDoc.Search;
    }
    writeToFile(jsonDoc, currentPage);
}

async function applyRemoveComponentFromPage(currentPage: vscode.Uri, answers: any) {
    let content = readFileContent(currentPage);
    let jsonDoc = JSON.parse(content);
    let sections = jsonDoc.Controls[0].Sections;
    let removedIndex;
    for(let i = 0; i < sections.length; i++) {
        if (sections[i]._Name === answers.removed) {
            removedIndex = i;
            break;
        }
    }
    sections.splice(removedIndex, 1);
    writeToFile(jsonDoc, currentPage);
}

async function writeToFile(jsonString: string, currentPage: vscode.Uri) {
    const writeStr = JSON.stringify(jsonString, undefined, 4);
    fs.writeFileSync(currentPage.fsPath, writeStr, 'utf-8');
}

function readFileContent(fileURI: vscode.Uri) {
    return fs.readFileSync(fileURI.fsPath, 'utf8');
}

function getImage(imagePath: string) :string {
    let image;
    try {
      image = datauri.sync(imagePath);
    } catch (error) {
        // image = DEFAULT_IMAGE;
    }
    return image;
}

export function deactivate() {}
