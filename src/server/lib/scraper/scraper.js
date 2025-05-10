import { Scraper as TwitterScraper } from "agent-twitter-client";

/**
 * Extended Twitter scraper class.
 * 
 * Inherits from the base TwitterScraper class to provide Twitter data scraping functionality.
 * @extends TwitterScraper
 */
class Scraper extends TwitterScraper {
    /**
     * Creates an instance of Scraper.
     */
    constructor() {
        super();
    }
}

/** @type {Scraper|null} Singleton instance of the Scraper class */
let scraper = null;

/**
 * Returns a singleton instance of the Scraper class.
 * 
 * If an instance doesn't exist, creates a new one. Otherwise returns the existing instance.
 * @returns {Scraper} The Scraper instance
 */
export function getScraper() {
    if (!scraper) {
        scraper = new Scraper();
    }
    return scraper;
}