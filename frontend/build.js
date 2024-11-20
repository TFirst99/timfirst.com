const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const katex = require('katex');

const md = new MarkdownIt({ html: true });

async function loadTemplate(name) {
  return await fs.readFile(`./src/templates/${name}.html`, 'utf-8');
}

async function applyTemplate(content, template, data = {}) {
  let html = template;
  for (const [key, value] of Object.entries(data)) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return html;
}

async function buildSite() {
  await fs.remove('./dist');
  await fs.ensureDir('./dist');
  await fs.copy('./src/assets', './dist/assets');
  await fs.copy('./src/styles', './dist/styles');
  await fs.copy('./src/assets', './dist/assets');

  await buildMainPages();
  await buildPosts();
}

async function buildMainPages(){
  const template = await loadTemplate('base');
  const mainPages = ['home', 'projects', 'writing'];
  
  for (const page of mainPages) {
    const content = await fs.readFile(`./src/content/main/${page}.md`, 'utf-8');
    const { data, content: markdownContent } = matter(content);
    
    const html = await applyTemplate(markdownContent, template, {
      ...data,
      content: md.render(markdownContent)
    });

    const outputFile = page === 'home' ? 'index.html' : `${page}.html`;
    await fs.outputFile(`./dist/${outputFile}`, html);
  }
}
  
async function buildPosts() {
  const template = await loadTemplate('post');
  const files = await fs.readdir('./src/content/posts');

  for (const file of files) {
    if (path.extname(file) !== '.md') continue;

    const content = await fs.readFile(`./src/content/posts/${file}`, 'utf-8');
    const { data, content: markdownContent } = matter(content);
    
    const html = await applyTemplate(markdownContent, template, {
      ...data,
      content: md.render(markdownContent)
    });

    await fs.outputFile(
      `./dist/posts/${path.basename(file, '.md')}.html`, 
      html
    );
  }
}

buildSite().catch(console.error);
