import React from "react"
import { Link, graphql } from "gatsby"
import { Disqus } from "gatsby-plugin-disqus"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const {
      title,
      subTitle,
      author,
      siteUrl,
    } = this.props.data.site.siteMetadata
    const { previous, next } = this.props.pageContext

    return (
      <Layout
        location={this.props.location}
        title={title}
        subTitle={subTitle}
        author={author}
      >
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <article>
          <header>
            <h1
              style={{
                marginTop: rhythm(1),
                marginBottom: 0,
              }}
            >
              {post.frontmatter.title}
            </h1>
            <p
              style={{
                ...scale(-1 / 5),
                display: `block`,
                marginBottom: rhythm(1),
              }}
            >
              {post.frontmatter.date} - {post.fields.readingTime.text}
            </p>
            {post.frontmatter.tags && (
              <p
                style={{
                  ...scale(-1 / 5),
                }}
              >
                {post.frontmatter.tags.map((name) => (
                  <span className="tag">{name}</span>
                ))}
              </p>
            )}
          </header>
          <section dangerouslySetInnerHTML={{ __html: post.html }} />
          <hr />
          <footer>
            <Bio />
          </footer>
        </article>

        <nav className="post-navigation">
          <div className="post-navigation-container">
            {previous && (
              <Link
                className="navigation-btn"
                to={previous.fields.slug}
                rel="prev"
              >
                <div>← </div>
                <div className="navigation-title text-right">
                  {previous.frontmatter.title}
                </div>
              </Link>
            )}
            {next ? (
              <Link className="navigation-btn" to={next.fields.slug} rel="next">
                <div className="navigation-title text-left">
                  {next.frontmatter.title}
                </div>
                <div> →</div>
              </Link>
            ) : (
              <div className="navigation-btn navigation-disabled">
                <div className="navigation-title text-left">...</div>
                <div> →</div>
              </div>
            )}
          </div>
        </nav>

        <section>
          <Disqus
            config={{
              url: `${siteUrl + this.props.location.pathname}`,
              identifier: post.id,
              title: title,
            }}
          />
        </section>
      </Layout>
    )
  }
}

/**
 * The `remarkForm` higher order component wraps the `BlogPostTemplate`
 * and generates a new form from the data in the `markdownRemark` query.
 */
export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        subTitle
        author
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
      }
      fields {
        readingTime {
          text
        }
      }
    }
  }
`
