declare module 'markdown-yaml-metadata-parser' {
  export interface ParserResult {
    content: string
    metadata: object
  }
  export default function <T extends ParserResult>(text: string): T
}
