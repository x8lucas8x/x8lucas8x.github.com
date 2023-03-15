import React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage } from "gatsby-plugin-image";
import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'

const DEFAULT_WIDTH = 1200
const DEFAULT_HEIGHT = 630

const GlobalPageStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: Montserrat,sans-serif;
  }
`

const Wrapper = styled.div`
  width: ${props => props.width || DEFAULT_WIDTH}px;
  height: ${props => props.height || DEFAULT_HEIGHT}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  vertical-align: middle;
  text-align: center;
  background-color: white;
  position: relative;
`

const Square = styled.div`
  width: ${props => props.width || DEFAULT_WIDTH}px;
  height: ${props => props.height || DEFAULT_HEIGHT}px;
  position: absolute;
  outline: 8px solid red !important;
  outline-offset: -50px;
`

const Title = styled.h1`
  font-weight: 600;
  font-size: 4.0rem;
  font-style: italic;
  font-family: 'Merriweather','Georgia',serif;
  margin: 10px 60px;
  color: hsla(0,0%,0%,0.59);
  text-shadow: 1px 1px 4px rgba(34, 34, 34, 0.6) gray;
  text-align: center;
  z-index: 1;
`

const SiteTitle = styled.p`
  font-size: 2.5rem;
  left: 50%;
  font-weight: 700;
  text-align: center;
  z-index: 1;
  position: absolute;
  top: 8px;
  color: white;
  background-color: red;
  padding: 1px 5px 1px 5px;
  margin-bottom: 5px;
  transform: translate(-50%);
  width: max-content;
`

const SubTitle = styled.div`
  vertical-align: middle;
  text-align: center;
  font-weight: 500;
  z-index: 1;
`

const BlogPostShareImage = props => {
  const post = props.data.markdownRemark

  const authorImage = props.data.authorImage.childImageSharp.gatsbyImageData
  const defaultPreviewImage = props.data.defaultPreviewImage.childImageSharp.gatsbyImageData
  const { width, height } = props.pageContext
  const heroImg = post.frontmatter.imageShare?.childImageSharp?.gatsbyImageData || defaultPreviewImage

  return (
    <Wrapper width={width} height={height}>
      <link
        href="https://fonts.googleapis.com/css?family=Rubik&display=swap"
        rel="stylesheet"
      />
      <GlobalPageStyle />

      <SiteTitle>{post.frontmatter.title}</SiteTitle>

     {
        post.frontmatter.quote ? (
            <Title>
                "<i>{post.frontmatter.quote}</i>"<br/><br/>
                {post.frontmatter.quoteAuthor}
            </Title>
        ) : (
            <Title>
                
            </Title>
        )
     }
      {heroImg && (
        <GatsbyImage
          image={heroImg}
          width={width}
          height={height}
          style={{
            position: "absolute",
            backgroundPosition: "center",
            backgroundSize: "cover",
            opacity: 0.1,
          }} />
      )}
      <SubTitle>
        <GatsbyImage
          image={authorImage}
          className="bio-image"
          width={200}
          height={200}
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
          }} />
      </SubTitle>
      <Square width={width} height={height} />
    </Wrapper>
  );
}

export default BlogPostShareImage

export const pageQuery = graphql`query BlogPostShareImage($slug: String!) {
  authorImage: file(absolutePath: {regex: "/lucasProfile.jpeg/"}) {
    childImageSharp {
      gatsbyImageData(width: 200, height: 200, layout: FIXED)
    }
  }
  defaultPreviewImage: file(absolutePath: {regex: "/defaultPreviewImage.jpeg/"}) {
    childImageSharp {
      gatsbyImageData(width: 1200, height: 630, layout: FIXED)
    }
  }
  markdownRemark(fields: {slug: {eq: $slug}}) {
    id
    excerpt(pruneLength: 120)
    frontmatter {
      title
      quote
      quoteAuthor
      imageShare {
        childImageSharp {
          gatsbyImageData(width: 1200, height: 630, layout: FIXED)
        }
      }
    }
  }
}`