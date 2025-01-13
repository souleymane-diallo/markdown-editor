import { MarkdownFile } from "../models/markdown-file.model";

export function createMarkdownFile(markdownFiles: MarkdownFile[], markdownFile: MarkdownFile): MarkdownFile[] {
  return [...markdownFiles, markdownFile];
}


export function toggleTheme(isDarkTheme: boolean): boolean {
  const body = document.body;

  body.classList.toggle('dark-theme', isDarkTheme);
  body.classList.toggle('light-theme', !isDarkTheme);

  return !isDarkTheme;
}
