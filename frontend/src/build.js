import { marked } from "marked";
import { promises as fs } from 'fs';
import path from 'path';
import figlet from 'figlet';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { gfmHeadingId } from "marked-gfm-heading-id";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function figletPromise(text) {
    return new Promise((resolve, reject) => {
        figlet(text, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
const options = {
	prefix: "",
};
marked.use(gfmHeadingId(options));
marked.setOptions({
    gfm: true,
    breaks: true,
    highlight: function(code, lang) {
        return code;
    }
});

async function buildSite() {
    try {
        const template = await fs.readFile(
            path.join(__dirname, 'templates/base.html'), 
            'utf-8'
        );

        const githubCss = await fs.readFile(
            path.join(__dirname, 'github-markdown.css'),
            'utf-8'
        );

        await fs.mkdir(path.join(__dirname, '../dist'), { recursive: true });

        await buildPagesFromDirectory(
            path.join(__dirname, '../content'),
            template,
            githubCss
        );

        await copyDirectory(
            path.join(__dirname, '../public'),
            path.join(__dirname, '../dist')
        );

    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

async function buildPagesFromDirectory(contentDir, template, githubCss) {
    const files = await fs.readdir(contentDir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(contentDir, file.name);
        
        if (file.isDirectory()) {
            await buildPagesFromDirectory(fullPath, template, githubCss);
            continue;
        }

        if (path.extname(file.name) !== '.md') continue;

        await buildPage(fullPath, template, githubCss);
    }
}

async function buildPage(filePath, template, githubCss) {
    const markdown = await fs.readFile(filePath, 'utf-8');
    const title = path.basename(filePath, '.md');
    
    const relativePath = path.relative(
        path.join(__dirname, '../content'),
        filePath
    );
    
    let displayTitle = title;
    if (title === 'index' && !relativePath.includes(path.sep)) {
        displayTitle = 'TIMFIRST.com';
    } else if (relativePath.startsWith('blog')) {
        displayTitle = 'Blog';
    } else if (relativePath.startsWith('projects')) {
        displayTitle = 'Projects';
    }

    const asciiTitle = await figletPromise(displayTitle);
    const content = marked(markdown);
    
    const styledContent = `
        <style>
            ${githubCss}
            .markdown-body {
                box-sizing: border-box;
                min-width: 200px;
                max-width: 980px;
                margin: 0 auto;
                padding: 45px;
            }
            @media (max-width: 767px) {
                .markdown-body {
                    padding: 15px;
                }
            }
        </style>
        <article class="markdown-body">
            ${content}
        </article>
    `;
    
    let html = template
        .replace('{{title}}', displayTitle)
        .replace('{{asciiTitle}}', asciiTitle)
        .replace('{{content}}', styledContent);
    
    const outputPath = path.join(
        __dirname,
        '../dist',
        relativePath.replace('.md', '.html')
    );
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html);
}

async function copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

buildSite();
