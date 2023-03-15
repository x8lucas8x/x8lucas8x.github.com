#!/usr/bin/env node

// https://raw.githubusercontent.com/maxpou/gatsby-starter-morning-dew/master/scripts/generatePostPreviewImages.js
/* eslint-disable no-console */
const { readFile, existsSync } = require('fs')
const { join, dirname } = require('path')
const glob = require('glob')
const YAML = require('yaml')
const puppeteer = require('puppeteer')

const baseUrl = process.argv[2] || 'http://localhost:8786/'

const takeScreenshot = async (url, destination) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  // Set viewport width and height
  await page.setViewport({ width: 1200, height: 630 });
  await page.goto(url, {
    waitUntil: 'networkidle2',
  })
  await page.screenshot({
    path: destination,
    fullPage: true,
  })
  await page.close();
  await browser.close()
}

const getArticleFiles = () => {
  return glob.sync(join(process.cwd(), 'content', 'blog', '**', '*.md'))
}

const parseFile = async file => {
  return new Promise((resolve, reject) => {
    readFile(file, 'utf8', (err, content) => {
      if (err) {
        return reject(err)
      }

      const frontmatter = content.split('---')[1]
      const data = YAML.parse(frontmatter)

      return resolve({
        ...data,
        file,
        directory: dirname(file),
      })
    })
  })
}

const main = async () => {
  const files = await Promise.all(getArticleFiles().map(parseFile))

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const destinationFile = join(file.directory, `hero-share.png`)

    if (
        file['generate-card'] !== false
        // && !existsSync(destinationFile)
    ) {
      await takeScreenshot(
        `${baseUrl}${file.slug}/preview_image`,
        destinationFile
      )
      console.log(`Created ${destinationFile}`)
    }
  }
}

main()