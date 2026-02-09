import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "ul", "ol", "li",
      "a", "strong", "em", "b", "i", "u",
      "blockquote", "code", "pre",
      "table", "thead", "tbody", "tr", "th", "td",
      "img", "figure", "figcaption",
      "span", "div",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "class", "id"],
  });
}
