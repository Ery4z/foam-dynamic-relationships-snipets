# fdrs README

This is the README for the "fdrs" extension. "fdrs" (Foam Dynamic Relationship System) is a Visual Studio Code extension designed to enhance Markdown file management within the VS Code environment, especially for users who manage a large number of Markdown files, such as in a wiki or documentation project.

## Features

"fdrs" allows users to easily insert links to other Markdown files by providing a quick and intuitive interface. It scans a specified directory for Markdown files and lets you insert a link to these files in your current document.

### Insert Relation Feature
With "fdrs", you can insert a relation to another Markdown file with just a few keystrokes. This feature is especially useful for linking related documents in a large project.

> Tip: A short, focused animation here would effectively demonstrate how to use the "Insert Relation" feature.

## Requirements

"fdrs" requires a standard Visual Studio Code setup. There are no additional dependencies required to use this extension.

## Extension Settings

To configure "fdrs", create a `fdrs-config.json` file at the root of your workspace. This file should contain an array of objects, each specifying a category of files to link to, the relative path to the folder containing these files, and the section text under which to insert the links in your Markdown files.

### fdrs-config.json Structure

Here's a generalized example of the `fdrs-config.json` file structure:

```json
[
    {
        "name": "CategoryName",
        "path": "relative/path/to/category",
        "section_text": "> Section Header related:"
    },
    // Add more objects as needed for different categories
]
```

Each object in the array represents a different category of Markdown files you might want to link to. Customize the name, path, and section_text according to your project's structure and needs.

## Known Issues

No known issues at the moment. Please report any issues you encounter on the GitHub issues page for this project.

## Release Notes

### 1.0.0

Initial release of "fdrs":
- Insert links to Markdown files within a specified directory.
- Configuration options for customizing the path and section text.


## Following Extension Guidelines

This extension follows the best practices as outlined in the Visual Studio Code extension guidelines.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can edit this README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For More Information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy using fdrs!**
