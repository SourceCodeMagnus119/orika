#!/usr/bin/env node

/**
 * @param orika - command line interface extention.
 * @author PAUL JH GOWASEB <SourceCodeMagnus119>
 */
const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const program = new Command();

/**
 * @param Core Logic.
 * @events Filter dir and sort by creation date, Promt to Select, Output Selection.
 */
program
  .name('cd-helper')
  .description('CLI tool to navigate recent directories')
  .version('1.0.0');

program
  .command('cd')
  .description('Select and navigate recent directories')
  .action(async () => {
    try {
      const cwd = process.cwd();
      const allItems = await fs.readdir(cwd, { withFileTypes: true });

      const directories = allItems
        .filter(item => item.isDirectory())
        .map(dir => ({
          name: dir.name,
          createdTime: fs.statSync(path.join(cwd, dir.name)).birthtime,
        }))
        .sort((a, b) => b.createdTime - a.createdTime);

      if (directories.length === 0) {
        console.log(chalk.yellow('No recent directories found.'));
        return;
      }

      const { selectedDir } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedDir',
          message: 'Select a directory to navigate:',
          choices: directories.map(dir => dir.name),
        },
      ]);

      console.log(chalk.green(`Navigating to: ${selectedDir}`));
      process.chdir(path.join(cwd, selectedDir));
      console.log(chalk.blue(`Current directory: ${process.cwd()}`));
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
    }
});

program.parse(process.argv);