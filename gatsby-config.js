var postCssPlugins = require("./postcss.config")().plugins

module.exports = {
  siteMetadata: {
    title: `Lucas' Refuge`,
    subTitle: `We copyleft`,
    author: `Lucas Lira Gomes`,
    description: `Lucas Lira Gomes' personal blog.`,
    siteUrl: `https://x8lucas8x.com/`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/data`,
        name: `data`,
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`, // Needed for dynamic images
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GA_TRACKING_ID || "dev",
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Lucas' Refuge Feed",
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            // match: "^/",
            // optional configuration to specify external rss feed, such as feedburner
            // link: "https://feeds.feedburner.com/x8lucas8x",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Lucas' Refuge`,
        short_name: `LR`,
        start_url: `/`,
        background_color: `#c53030`,
        theme_color: `#fff`,
        display: `minimal-ui`,
        icon: `content/assets/icon.svg`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins,
      },
    },
    `gatsby-plugin-postcss`,
    `gatsby-plugin-purgecss`,
    `gatsby-plugin-netlify`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-brotli`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: process.env.DISQUS_SHORTNAME,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-vscode`,
            // All options are optional. Defaults shown here.
            options: {
              theme: "Dark+ (default dark)", // Read on for list of included themes. Also accepts object and function forms.
              wrapperClassName: "", // Additional class put on 'pre' tag. Also accepts function to set the class dynamically.
              injectStyles: true, // Injects (minimal) additional CSS for layout and scrolling
              extensions: [], // Third-party extensions providing additional themes and languages
              languageAliases: {}, // Map of custom/unknown language codes to standard/known language codes
              replaceColor: (x) => x, // Function allowing replacement of a theme color with another. Useful for replacing hex colors with CSS variables.
              getLineClassName: ({
                // Function allowing dynamic setting of additional class names on individual lines
                content, //   - the string content of the line
                index, //   - the zero-based index of the line within the code fence
                language, //   - the language specified for the code fence
                meta, //   - any options set on the code fence alongside the language (more on this later)
              }) => "",
              logLevel: "warn", // Set to 'info' to debug if something looks wrong
            },
          },
        ],
      },
    },
  ],
}
