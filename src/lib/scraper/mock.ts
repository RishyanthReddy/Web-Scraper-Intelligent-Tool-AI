/**
 * This file provides a mock implementation of the scraper for development and testing
 * when the actual browser automation can't be used (e.g., in environments without browser support)
 */

import { ScrapeResult, ScrapedData, ScraperOptions } from "./types";

/**
 * Generate mock scraped data for a given URL
 */
export function generateMockData(url: string): ScrapedData {
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  const isNews =
    domain.includes("news") ||
    domain.includes("blog") ||
    domain.includes("article");
  const isEcommerce =
    domain.includes("shop") ||
    domain.includes("store") ||
    domain.includes("product");

  // Base data structure
  const data: ScrapedData = {
    url,
    title: `${domain.charAt(0).toUpperCase() + domain.slice(1)} - ${isNews ? "Latest News" : isEcommerce ? "Online Store" : "Website"}`,
    timestamp: new Date().toISOString(),
    metadata: {
      description: `This is a ${isNews ? "news article" : isEcommerce ? "product page" : "website"} from ${domain}`,
      keywords: [
        "web",
        "scraping",
        domain,
        isNews ? "news" : isEcommerce ? "ecommerce" : "website",
      ],
      author: "John Doe",
      openGraph: {
        title: `${domain} - ${isNews ? "News" : isEcommerce ? "Store" : "Website"}`,
        description: `Visit ${domain} for ${isNews ? "the latest news" : isEcommerce ? "great products" : "more information"}`,
        image: `https://example.com/${domain}-image.jpg`,
      },
      twitterCard: {
        card: "summary_large_image",
        title: `${domain} - ${isNews ? "News" : isEcommerce ? "Store" : "Website"}`,
        description: `Visit ${domain} for ${isNews ? "the latest news" : isEcommerce ? "great products" : "more information"}`,
      },
      favicon: `https://${domain}/favicon.ico`,
    },
    content: {
      headings: generateMockHeadings(isNews, isEcommerce),
      paragraphs: generateMockParagraphs(isNews, isEcommerce),
      links: generateMockLinks(domain, isNews, isEcommerce),
      images: generateMockImages(domain, isNews, isEcommerce),
      lists: generateMockLists(isNews, isEcommerce),
      tables: isEcommerce ? generateMockTables() : [],
      mainText: generateMockMainText(isNews, isEcommerce),
    },
  };

  return data;
}

/**
 * Generate a mock scrape result
 */
export function mockScrape(
  url: string,
  options?: Partial<ScraperOptions>,
): Promise<ScrapeResult> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(
      () => {
        // Simulate error for specific URLs
        if (url.includes("error") || url.includes("fail")) {
          resolve({
            data: null,
            error:
              "Failed to scrape the website. The server returned a 404 Not Found error.",
            status: "error",
            duration: 1500,
          });
          return;
        }

        // Generate mock data
        const data = generateMockData(url);

        resolve({
          data,
          status: "success",
          duration: 2000 + Math.random() * 1000,
        });
      },
      1500 + Math.random() * 1000,
    );
  });
}

// Helper functions to generate mock content

function generateMockHeadings(
  isNews: boolean,
  isEcommerce: boolean,
): Array<{ level: number; text: string }> {
  if (isNews) {
    return [
      { level: 1, text: "Breaking News: Important Development" },
      { level: 2, text: "What Happened" },
      { level: 2, text: "Why It Matters" },
      { level: 3, text: "Expert Analysis" },
      { level: 2, text: "What Comes Next" },
    ];
  } else if (isEcommerce) {
    return [
      { level: 1, text: "Premium Product" },
      { level: 2, text: "Product Features" },
      { level: 2, text: "Specifications" },
      { level: 2, text: "Customer Reviews" },
      { level: 3, text: "Related Products" },
    ];
  } else {
    return [
      { level: 1, text: "Welcome to Our Website" },
      { level: 2, text: "About Us" },
      { level: 2, text: "Our Services" },
      { level: 3, text: "Service Details" },
      { level: 2, text: "Contact Information" },
    ];
  }
}

function generateMockParagraphs(
  isNews: boolean,
  isEcommerce: boolean,
): string[] {
  if (isNews) {
    return [
      "In a surprising development today, officials announced a major policy change that will affect thousands of people across the country.",
      "The decision comes after months of debate and public consultation, with experts weighing in from various fields.",
      "Critics argue that the change doesn't go far enough, while supporters claim it's a step in the right direction.",
      "Analysis suggests that the economic impact will be minimal in the short term, but could lead to significant changes in the industry over time.",
      "The implementation is expected to begin next month, with a phased approach to minimize disruption.",
    ];
  } else if (isEcommerce) {
    return [
      "Introducing our flagship product, designed with quality and performance in mind. This premium item combines cutting-edge technology with elegant design.",
      "Made from high-quality materials, this product is built to last. Each unit undergoes rigorous testing to ensure it meets our strict quality standards.",
      "Our customers love the versatility and ease of use. With intuitive controls and a user-friendly interface, you'll be up and running in no time.",
      "Available in multiple colors and configurations to suit your specific needs. Customization options are also available for bulk orders.",
      "Order today and experience the difference quality makes. Shipping is free on orders over $50, and we offer a 30-day money-back guarantee.",
    ];
  } else {
    return [
      "Welcome to our website. We're dedicated to providing the best service and information to our visitors.",
      "Our team of experts has years of experience in the industry, allowing us to offer insights and solutions that make a difference.",
      "We believe in transparency and customer satisfaction. That's why we work closely with our clients to ensure their needs are met.",
      "Explore our website to learn more about what we offer. You'll find detailed information about our services and how they can benefit you.",
      "Don't hesitate to contact us if you have any questions. Our customer service team is available 24/7 to assist you.",
    ];
  }
}

function generateMockLinks(
  domain: string,
  isNews: boolean,
  isEcommerce: boolean,
): Array<{ text: string; url: string; isInternal: boolean }> {
  const baseUrl = `https://${domain}`;

  const commonLinks = [
    { text: "Home", url: baseUrl, isInternal: true },
    { text: "About Us", url: `${baseUrl}/about`, isInternal: true },
    { text: "Contact", url: `${baseUrl}/contact`, isInternal: true },
    { text: "Privacy Policy", url: `${baseUrl}/privacy`, isInternal: true },
    { text: "Terms of Service", url: `${baseUrl}/terms`, isInternal: true },
  ];

  const specificLinks = isNews
    ? [
        { text: "Latest News", url: `${baseUrl}/news`, isInternal: true },
        { text: "Politics", url: `${baseUrl}/news/politics`, isInternal: true },
        { text: "Technology", url: `${baseUrl}/news/tech`, isInternal: true },
        { text: "Health", url: `${baseUrl}/news/health`, isInternal: true },
        {
          text: "Related Story",
          url: "https://othernews.com/story",
          isInternal: false,
        },
        { text: "Source", url: "https://source.org/data", isInternal: false },
      ]
    : isEcommerce
      ? [
          { text: "Products", url: `${baseUrl}/products`, isInternal: true },
          {
            text: "Categories",
            url: `${baseUrl}/categories`,
            isInternal: true,
          },
          { text: "Sale Items", url: `${baseUrl}/sale`, isInternal: true },
          { text: "Shopping Cart", url: `${baseUrl}/cart`, isInternal: true },
          { text: "My Account", url: `${baseUrl}/account`, isInternal: true },
          {
            text: "Manufacturer",
            url: "https://manufacturer.com",
            isInternal: false,
          },
        ]
      : [
          { text: "Services", url: `${baseUrl}/services`, isInternal: true },
          { text: "Portfolio", url: `${baseUrl}/portfolio`, isInternal: true },
          { text: "Blog", url: `${baseUrl}/blog`, isInternal: true },
          { text: "Resources", url: `${baseUrl}/resources`, isInternal: true },
          {
            text: "Partner Website",
            url: "https://partner.com",
            isInternal: false,
          },
        ];

  return [...commonLinks, ...specificLinks];
}

function generateMockImages(
  domain: string,
  isNews: boolean,
  isEcommerce: boolean,
): Array<{ alt: string; src: string; width?: number; height?: number }> {
  if (isNews) {
    return [
      {
        alt: "News Header Image",
        src: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",
        width: 800,
        height: 400,
      },
      {
        alt: "Event Photo",
        src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
        width: 600,
        height: 400,
      },
      {
        alt: "Infographic",
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        width: 500,
        height: 700,
      },
    ];
  } else if (isEcommerce) {
    return [
      {
        alt: "Product Main Image",
        src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        width: 600,
        height: 600,
      },
      {
        alt: "Product Side View",
        src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
        width: 600,
        height: 600,
      },
      {
        alt: "Product in Use",
        src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        width: 600,
        height: 400,
      },
      {
        alt: "Product Details",
        src: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80",
        width: 800,
        height: 600,
      },
    ];
  } else {
    return [
      {
        alt: "Company Logo",
        src: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&q=80",
        width: 200,
        height: 100,
      },
      {
        alt: "Office Building",
        src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
        width: 800,
        height: 500,
      },
      {
        alt: "Team Photo",
        src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
        width: 800,
        height: 400,
      },
    ];
  }
}

function generateMockLists(
  isNews: boolean,
  isEcommerce: boolean,
): Array<{ type: "ordered" | "unordered"; items: string[] }> {
  if (isNews) {
    return [
      {
        type: "unordered",
        items: [
          "Major policy announcement expected tomorrow",
          "Industry leaders respond to new regulations",
          "Public opinion divided on controversial decision",
          "Economic impact remains uncertain",
        ],
      },
      {
        type: "ordered",
        items: [
          "Initial reports emerged last week",
          "Officials confirmed details on Monday",
          "Implementation will begin next month",
          "Full rollout expected by year end",
        ],
      },
    ];
  } else if (isEcommerce) {
    return [
      {
        type: "unordered",
        items: [
          "Premium quality materials",
          "Ergonomic design for comfort",
          "Multiple color options available",
          "Energy efficient operation",
          "One-year manufacturer warranty",
        ],
      },
      {
        type: "ordered",
        items: [
          "Select your preferred model",
          "Choose color and configuration",
          "Add to cart and proceed to checkout",
          "Enter shipping and payment information",
          "Confirm your order",
        ],
      },
    ];
  } else {
    return [
      {
        type: "unordered",
        items: [
          "Professional consulting services",
          "Custom solutions for businesses",
          "Ongoing technical support",
          "Training and resources",
        ],
      },
      {
        type: "ordered",
        items: [
          "Schedule an initial consultation",
          "Receive a customized proposal",
          "Review and approve the plan",
          "Implementation and follow-up",
        ],
      },
    ];
  }
}

function generateMockTables(): Array<{ headers: string[]; rows: string[][] }> {
  return [
    {
      headers: ["Specification", "Value"],
      rows: [
        ["Dimensions", '10" x 5" x 2"'],
        ["Weight", "1.5 lbs"],
        ["Material", "Aluminum/Plastic"],
        ["Battery Life", "12 hours"],
        ["Warranty", "1 year"],
      ],
    },
    {
      headers: ["Package", "Price", "Features"],
      rows: [
        ["Basic", "$29.99", "Core functionality"],
        ["Standard", "$49.99", "Core + Premium features"],
        ["Premium", "$79.99", "All features + Priority support"],
        ["Enterprise", "Contact sales", "Custom solutions"],
      ],
    },
  ];
}

function generateMockMainText(isNews: boolean, isEcommerce: boolean): string {
  if (isNews) {
    return `# Breaking News: Important Development

In a surprising development today, officials announced a major policy change that will affect thousands of people across the country.

## What Happened

The decision comes after months of debate and public consultation, with experts weighing in from various fields.

Critics argue that the change doesn\'t go far enough, while supporters claim it\'s a step in the right direction.

## Why It Matters

Analysis suggests that the economic impact will be minimal in the short term, but could lead to significant changes in the industry over time.

### Expert Analysis

"This is a pivotal moment," said Dr. Jane Smith, an expert in the field. "The implications will be far-reaching."

## What Comes Next

The implementation is expected to begin next month, with a phased approach to minimize disruption.

* Major policy announcement expected tomorrow
* Industry leaders respond to new regulations
* Public opinion divided on controversial decision
* Economic impact remains uncertain

1. Initial reports emerged last week
2. Officials confirmed details on Monday
3. Implementation will begin next month
4. Full rollout expected by year end`;
  } else if (isEcommerce) {
    return `# Premium Product

Introducing our flagship product, designed with quality and performance in mind. This premium item combines cutting-edge technology with elegant design.

## Product Features

Made from high-quality materials, this product is built to last. Each unit undergoes rigorous testing to ensure it meets our strict quality standards.

* Premium quality materials
* Ergonomic design for comfort
* Multiple color options available
* Energy efficient operation
* One-year manufacturer warranty

## Specifications

| Specification | Value |
|--------------|-------|
| Dimensions    | 10" x 5" x 2" |
| Weight        | 1.5 lbs |
| Material      | Aluminum/Plastic |
| Battery Life  | 12 hours |
| Warranty      | 1 year |

## Customer Reviews

Our customers love the versatility and ease of use. With intuitive controls and a user-friendly interface, you\'ll be up and running in no time.

> "This product exceeded my expectations. The quality is outstanding and it\'s so easy to use!" - John D.

### Related Products

Available in multiple colors and configurations to suit your specific needs. Customization options are also available for bulk orders.

Order today and experience the difference quality makes. Shipping is free on orders over $50, and we offer a 30-day money-back guarantee.`;
  } else {
    return `# Welcome to Our Website

Welcome to our website. We\'re dedicated to providing the best service and information to our visitors.

## About Us

Our team of experts has years of experience in the industry, allowing us to offer insights and solutions that make a difference.

We believe in transparency and customer satisfaction. That\'s why we work closely with our clients to ensure their needs are met.

## Our Services

* Professional consulting services
* Custom solutions for businesses
* Ongoing technical support
* Training and resources

### Service Details

Explore our website to learn more about what we offer. You\'ll find detailed information about our services and how they can benefit you.

1. Schedule an initial consultation
2. Receive a customized proposal
3. Review and approve the plan
4. Implementation and follow-up

## Contact Information

Don\'t hesitate to contact us if you have any questions. Our customer service team is available 24/7 to assist you.

**Phone:** (555) 123-4567  
**Email:** info@example.com  
**Address:** 123 Main Street, Anytown, USA`;
  }
}
