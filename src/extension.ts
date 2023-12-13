import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const config = loadConfig(context);

    let insertRelationDisposable = vscode.commands.registerCommand('fdrs.insertRelation', async () => {
        const pickedSection = await showSectionQuickPick(config);
        if (pickedSection) {
            const selectedFile = await showFileQuickPick(pickedSection);
            if (selectedFile) {
                insertMarkdownLink(selectedFile, pickedSection);
            }
        }
    });

    context.subscriptions.push(insertRelationDisposable);
}

function loadConfig(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showInformationMessage('No workspace is open.');
        return null;
    }

    const configPath = path.join(workspaceFolders[0].uri.fsPath, 'fdrs-config.json');
    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
        vscode.window.showErrorMessage('Failed to load fdrs-config.json');
        return [];
    }
}

async function showSectionQuickPick(config: any) {
    const pickedName = await vscode.window.showQuickPick(
        config.map((c:any )=> c.name),
        { placeHolder: 'Choose a section' }
    );

    if (pickedName) {
        return config.find((c: any) => c.name === pickedName);
    }

    return null;
}

async function showFileQuickPick(pickedSection: any) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showInformationMessage('No workspace is open.');
        return null;
    }

    const sectionDir = path.join(workspaceFolders[0].uri.fsPath, pickedSection.path);
    try {
        const files = fs.readdirSync(sectionDir);
        const pickedFileName = await vscode.window.showQuickPick(files, { placeHolder: 'Select a file' });

        if (pickedFileName) {
            const filePath = path.join(sectionDir, pickedFileName);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const prettyName = extractTitle(fileContent);

            const relativePath = path.relative(
                path.join(vscode.window.activeTextEditor?.document.uri.fsPath || '', ".."), 
                filePath
            ).replace(/\\/g, '/');
            
            return { name: pickedFileName, relativePath: relativePath, prettyName: prettyName };
        } else {
            return null;
        }
    } catch (err) {
        vscode.window.showErrorMessage(`Error reading ${pickedSection.path} directory.`);
        return null;
    }
}

function extractTitle(fileContent: string) {
    const lines = fileContent.split(/\r?\n/);
    const titleLine = lines.find(line => line.startsWith('# '));
    return titleLine ? titleLine.substring(2).trim() : 'Untitled';
}



function insertMarkdownLink(selectedFileObject:any, pickedSection:any) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        const text = document.getText();
        const linksSectionTitle = '## Links';
        const sectionText = pickedSection.section_text;
        let markdownLink = `> - [${selectedFileObject.prettyName}](${selectedFileObject.relativePath})`;
        let position: vscode.Position;

        const indexOfLinksSection = text.indexOf(linksSectionTitle);
        let indexOfSectionText;
        if (indexOfLinksSection !== -1) {
            // Links section exists, now find the specific section_text within it
            const textAfterLinks = text.substring(indexOfLinksSection);
            indexOfSectionText = textAfterLinks.indexOf(sectionText);
            if (indexOfSectionText !== -1) {
                // section_text exists within Links, find where to insert the link
                indexOfSectionText += indexOfLinksSection;
                let endOfSectionIndex = text.indexOf('\n', indexOfSectionText + sectionText.length);
                if (endOfSectionIndex === -1) {
                    endOfSectionIndex = text.length;
                }
                position = document.positionAt(endOfSectionIndex);
                markdownLink = `\n${markdownLink}`;
            } else {
                // section_text does not exist within Links, create it
                position = document.positionAt(indexOfLinksSection + textAfterLinks.indexOf('---') -2);
                markdownLink = `\n${sectionText}\n${markdownLink}\n`;
            }
        } else {
            // Links section does not exist, create it at the end of the document
            position = new vscode.Position(document.lineCount, 0);
            markdownLink = `\n${linksSectionTitle}\n\n${sectionText}\n${markdownLink}\n---`;
        }

        editor.edit(editBuilder => {
            editBuilder.insert(position, markdownLink);
        });
    }
}


export function deactivate() {}
