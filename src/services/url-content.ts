'use server';

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

/**
 * Represents the content of a web page.
 */
export interface WebPageContent {
  /**
   * The title of the web page.
   */
  title: string;
  /**
   * The main content of the web page, as text.
   */
  content: string;
}

/**
 * Asynchronously retrieves the content of a web page from a given URL.
 *
 * @param url The URL of the web page to retrieve.
 * @returns A promise that resolves to a WebPageContent object containing the title and content.
 */
export async function getWebPageContent(url: string): Promise<WebPageContent> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract title
    const title = $('title').text() || 'No Title';

    // Extract all text content
    let content = '';
    $('body *').each((i, element) => {
      content += $(element).text() + ' ';
    });

    // Clean up content by removing extra spaces
    content = content.replace(/\s+/g, ' ').trim();

    return {
      title: title,
      content: content,
    };
  } catch (error: any) {
    console.error('Error fetching or parsing URL:', error);
    throw new Error(`Failed to fetch content from URL: ${error.message}`);
  }
}

