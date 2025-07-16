import assert from 'assert';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

describe('Distribution Directory Synchronization Tests', function() {
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

    it('Both dist and docs/_resources/dist directories should exist', function() {
        assert.ok(
            fs.existsSync(distPath) && fs.statSync(distPath).isDirectory(),
            `Directory ${distPath} does not exist or is not a directory`
        );
        
        assert.ok(
            fs.existsSync(docsDistPath) && fs.statSync(docsDistPath).isDirectory(),
            `Directory ${docsDistPath} does not exist or is not a directory`
        );
    });

    it('Both directories should have the same tree structure', function() {
        const distDirs = getDirectoryStructure(distPath);
        const docsDistDirs = getDirectoryStructure(docsDistPath);

        assert.deepStrictEqual(
            docsDistDirs,
            distDirs,
            'Directory structures do not match'
        );
    });

    it('Both directories should contain the same files', function() {
        const distFiles = getAllFiles(distPath);
        const docsDistFiles = getAllFiles(docsDistPath);

        assert.deepStrictEqual(
            docsDistFiles,
            distFiles,
            'File lists do not match between directories'
        );
    });

    it('All files should be binary equal to their counterparts', function() {
        const distFiles = getAllFiles(distPath);

        for (const relativePath of distFiles) {
            const distFilePath = path.join(distPath, relativePath);
            const docsDistFilePath = path.join(docsDistPath, relativePath);

            assert.ok(
                fs.existsSync(docsDistFilePath),
                `File ${relativePath} exists in dist but not in docs/_resources/dist`
            );

            const distHash = getFileHash(distFilePath);
            const docsDistHash = getFileHash(docsDistFilePath);

            assert.strictEqual(
                docsDistHash,
                distHash,
                `File ${relativePath} has different content in docs/_resources/dist`
            );
        }
    });

    it('There should be no extra files in docs/_resources/dist', function() {
        const distFiles = getAllFiles(distPath);
        const docsDistFiles = getAllFiles(docsDistPath);

        const extraFiles = docsDistFiles.filter(file => !distFiles.includes(file));

        assert.strictEqual(
            extraFiles.length,
            0,
            `Found extra files in docs/_resources/dist: ${extraFiles.join(', ')}`
        );
    });
});