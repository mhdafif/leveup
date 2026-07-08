export interface GlossaryEntry {
  /** The abbreviation as it appears in prose (matched case-sensitively, word-boundary). */
  term: string;
  /** The full expansion. */
  full: string;
  /** A plain-language, beginner-friendly meaning. */
  meaning: string;
}

/**
 * Common developer abbreviations shown with a hover/click tooltip in every
 * lesson. In Easy mode the `meaning` is also appended inline as "(…)".
 * Extend freely — the enhancer wraps the first occurrence of each key per page.
 */
export const GLOSSARY: Record<string, GlossaryEntry> = {
  API: { term: "API", full: "Application Programming Interface", meaning: "a way for programs to talk to each other" },
  DOM: { term: "DOM", full: "Document Object Model", meaning: "the live structure of the page the browser builds from your HTML" },
  HTTP: { term: "HTTP", full: "HyperText Transfer Protocol", meaning: "the rules browsers and servers use to exchange pages" },
  HTTPS: { term: "HTTPS", full: "HyperText Transfer Protocol Secure", meaning: "HTTP with encryption so data can't be read in transit" },
  HTML: { term: "HTML", full: "HyperText Markup Language", meaning: "the language that describes a page's structure and content" },
  CSS: { term: "CSS", full: "Cascading Style Sheets", meaning: "the language that controls how a page looks" },
  JS: { term: "JS", full: "JavaScript", meaning: "the language that makes web pages interactive" },
  URL: { term: "URL", full: "Uniform Resource Locator", meaning: "the address of a page or resource on the web" },
  URI: { term: "URI", full: "Uniform Resource Identifier", meaning: "a name or address that identifies a resource" },
  JSON: { term: "JSON", full: "JavaScript Object Notation", meaning: "a simple text format for sending structured data" },
  AJAX: { term: "AJAX", full: "Asynchronous JavaScript and XML", meaning: "loading data in the background without reloading the page" },
  CRUD: { term: "CRUD", full: "Create, Read, Update, Delete", meaning: "the four basic things you do with stored data" },
  REST: { term: "REST", full: "Representational State Transfer", meaning: "a common style for designing web APIs" },
  SPA: { term: "SPA", full: "Single-Page Application", meaning: "a site that updates content without full page reloads" },
  SSR: { term: "SSR", full: "Server-Side Rendering", meaning: "building the page's HTML on the server before sending it" },
  SSG: { term: "SSG", full: "Static Site Generation", meaning: "building all pages ahead of time as static files" },
  CDN: { term: "CDN", full: "Content Delivery Network", meaning: "servers spread worldwide that deliver files faster" },
  CLI: { term: "CLI", full: "Command-Line Interface", meaning: "controlling a program by typing commands" },
  IDE: { term: "IDE", full: "Integrated Development Environment", meaning: "an app for writing, running, and debugging code" },
  SDK: { term: "SDK", full: "Software Development Kit", meaning: "a bundle of tools for building on a platform" },
  npm: { term: "npm", full: "Node Package Manager", meaning: "the tool for installing JavaScript packages" },
  DNS: { term: "DNS", full: "Domain Name System", meaning: "the web's phonebook that turns names into IP addresses" },
  IP: { term: "IP", full: "Internet Protocol", meaning: "the addressing system that routes data across the internet" },
  TCP: { term: "TCP", full: "Transmission Control Protocol", meaning: "the protocol that delivers data reliably and in order" },
  SQL: { term: "SQL", full: "Structured Query Language", meaning: "the language for asking databases questions" },
  ORM: { term: "ORM", full: "Object-Relational Mapping", meaning: "a tool that lets you use database rows as code objects" },
  JWT: { term: "JWT", full: "JSON Web Token", meaning: "a signed token used to prove who a user is" },
  CORS: { term: "CORS", full: "Cross-Origin Resource Sharing", meaning: "browser rules for requests between different sites" },
  UI: { term: "UI", full: "User Interface", meaning: "the part of a product people see and interact with" },
  UX: { term: "UX", full: "User Experience", meaning: "how it feels to use a product end to end" },
  A11y: { term: "A11y", full: "Accessibility", meaning: "making products usable by people with disabilities" },
  ARIA: { term: "ARIA", full: "Accessible Rich Internet Applications", meaning: "HTML attributes that help assistive tech understand UI" },
  SEO: { term: "SEO", full: "Search Engine Optimization", meaning: "helping pages rank higher in search results" },
  CI: { term: "CI", full: "Continuous Integration", meaning: "automatically building and testing code on every change" },
  CD: { term: "CD", full: "Continuous Delivery", meaning: "automatically shipping code that passes checks" },
  MVP: { term: "MVP", full: "Minimum Viable Product", meaning: "the smallest version worth releasing to learn from" },
  MDN: { term: "MDN", full: "Mozilla Developer Network", meaning: "the go-to reference docs for web technologies" },
};
