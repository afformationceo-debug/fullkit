import sanitize from "sanitize-html";

export function sanitizeHtml(html: string): string {
  return sanitize(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "ul", "ol", "li",
      "a", "strong", "em", "b", "i", "u",
      "blockquote", "code", "pre",
      "table", "thead", "tbody", "tr", "th", "td",
      "img", "figure", "figcaption",
      "span", "div",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "class", "loading", "width", "height"],
      div: ["class", "id"],
      span: ["class", "id"],
      h2: ["class", "id"],
      h3: ["class", "id"],
      p: ["class"],
      table: ["class"],
      blockquote: ["class"],
      ul: ["class"],
      ol: ["class"],
      li: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
