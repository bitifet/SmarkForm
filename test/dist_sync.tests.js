import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

test.describe('Distribution Directory Synchronization Tests', () => {
    const distPath = path.resolve('dist');
    const docsDistPath = path.resolve('docs/_resources/dist');

    /**
     * Recursively get all files in a directory
     * @param {string} dirPath - The directory path
     * @param {string} basePath - The base path for relative paths
     * @returns {Array} Array of relative file paths
     */
    function getAllFiles(dirPath, basePath = dirPath) {
        const files = [];
        
        function traverse(currentPath) {
            const items = fs.readdirSync(currentPath);
            
            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const relativePath = path.relative(basePath, fullPath);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    traverse(fullPath);
                } else {
                    files.push(relativePath);
                }
            }
        }
        
        traverse(dirPath);
        return files.sort();
    }

    /**
     * Calculate SHA256 hash of a file
     * @param {string} filePath - Path to the file
     * @returns {string} SHA256 hash
     */
    function getFileHash(filePath) {
        const buffer = fs.readFileSync(filePath);
        return crypto.createHash('sha256').update(buffer).digest('hex');
    }

    /**
     * Get directory tree structure (directories only)
     * @param {string} dirPath - The directory path
     * @param {string} basePath - The base path for relative paths
     * @returns {Array} Array of relative directory paths
     */
    function getDirectoryStructure(dirPath, basePath = dirPath) {
        const dirs = [];
        
        function traverse(currentPath) {
            const items = fs.readdirSync(currentPath);
            
            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    const relativePath = path.relative(basePath, fullPath);
                    dirs.push(relativePath);
                    traverse(fullPath);
                }
            }
        }
        
        traverse(dirPath);
        return dirs.sort();
    }

    test('Both dist and docs/_resources/dist directories should exist', () => {
        expect(
            fs.existsSync(distPath) && fs.statSync(distPath).isDirectory(),
            `Directory ${distPath} does not exist or is not a directory`
        ).toBe(true);
        
        expect(
            fs.existsSync(docsDistPath) && fs.statSync(docsDistPath).isDirectory(),
            `Directory ${docsDistPath} does not exist or is not a directory`
        ).toBe(true);
    });

    test('Both directories should have the same tree structure', () => {
        const distDirs = getDirectoryStructure(distPath);
        const docsDistDirs = getDirectoryStructure(docsDistPath);

        expect(docsDistDirs).toEqual(distDirs);
    });

    test('Both directories should contain the same files', () => {
        const distFiles = getAllFiles(distPath);
        const docsDistFiles = getAllFiles(docsDistPath);

        expect(docsDistFiles).toEqual(distFiles);
    });

    test('All files should be binary equal to their counterparts', () => {
        const distFiles = getAllFiles(distPath);

        for (const relativePath of distFiles) {
            const distFilePath = path.join(distPath, relativePath);
            const docsDistFilePath = path.join(docsDistPath, relativePath);

            expect(
                fs.existsSync(docsDistFilePath),
                `File ${relativePath} exists in dist but not in docs/_resources/dist`
            ).toBe(true);

            const distHash = getFileHash(distFilePath);
            const docsDistHash = getFileHash(docsDistFilePath);

            expect(docsDistHash).toBe(distHash);
        }
    });

    test('There should be no extra files in docs/_resources/dist', () => {
        const distFiles = getAllFiles(distPath);
        const docsDistFiles = getAllFiles(docsDistPath);

        const extraFiles = docsDistFiles.filter(file => !distFiles.includes(file));

        expect(extraFiles.length).toBe(0);
    });
});